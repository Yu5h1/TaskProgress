using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace TaskProgress;

internal sealed record TimeAnalysisGenerationResult(
    string OutputPath,
    int TaskCount,
    int ItemCount,
    int TotalEstimatedMinutes,
    bool DeadlineIncluded,
    int DiagnosticCount);

internal static class TimeAnalysisGenerator
{
    private const string TimeSchemaVersion = "0.2";
    private const string RiskMethodName = "deterministic-capacity-feasibility";
    private const string RiskMethodVersion = "0.3";
    private const double CapacityAtRiskRatio = 0.8;
    private const int MinutesPerDay = 1440;
    private static readonly JsonSerializerOptions OutputOptions = new()
    {
        WriteIndented = true
    };

    public static bool HasInputs(string folderValue)
    {
        if (string.IsNullOrWhiteSpace(folderValue)) return false;
        var fullPath = Path.GetFullPath(Environment.ExpandEnvironmentVariables(folderValue));
        var directory = File.Exists(fullPath)
            ? Path.GetDirectoryName(fullPath)!
            : fullPath;
        return new[] { "time.config.json", "time.estimates.json", "time.events.json" }
            .Any(name => File.Exists(Path.Combine(directory, name)));
    }

    public static TimeAnalysisGenerationResult Generate(
        string folderValue,
        DateTimeOffset? evaluatedAt = null,
        string? outputValue = null)
    {
        var reportFolder = ReportFolder.Load(folderValue);
        var report = ReadObject(reportFolder.ReportPath, "report.json");
        var asOf = evaluatedAt ?? DateTimeOffset.Now;
        var outputPath = outputValue is null
            ? Path.Combine(reportFolder.DirectoryPath, "time.analysis.json")
            : Path.GetFullPath(
                Path.IsPathRooted(outputValue)
                    ? outputValue
                    : Path.Combine(reportFolder.DirectoryPath, outputValue));

        var configPath = Path.Combine(reportFolder.DirectoryPath, "time.config.json");
        var estimatesPath = Path.Combine(reportFolder.DirectoryPath, "time.estimates.json");
        var eventsPath = Path.Combine(reportFolder.DirectoryPath, "time.events.json");
        var configSource = File.Exists(configPath) ? ReadObject(configPath, "time.config.json") : null;
        var estimatesSource = File.Exists(estimatesPath)
            ? ReadObject(estimatesPath, "time.estimates.json")
            : null;
        var eventsSource = File.Exists(eventsPath) ? ReadObject(eventsPath, "time.events.json") : null;

        var scopeId = RequiredString(report, "scope_id", "report.json");
        ScopeId.Validate(scopeId);
        ValidateOptionalInput(configSource, "time.config.json", scopeId);
        ValidateOptionalInput(estimatesSource, "time.estimates.json", scopeId);
        ValidateOptionalInput(eventsSource, "time.events.json", scopeId);

        var diagnostics = new List<Diagnostic>();
        var config = ReadConfig(configSource, report, asOf, diagnostics);
        var reportTasks = ReadReportTasks(report);
        var activeEstimates = ReadActiveEstimates(estimatesSource, reportTasks);
        var analysisTasks = new JsonArray();
        var composition = new Dictionary<string, int>(StringComparer.Ordinal)
        {
            ["ai"] = 0,
            ["mixed"] = 0,
            ["manual"] = 0,
            ["default"] = 0
        };
        var confidences = new List<string>();
        var totalEstimatedMinutes = 0;
        double remainingBaseMinutes = 0;
        var itemCount = 0;

        foreach (var task in reportTasks.Where(task => task.Status != "archive"))
        {
            var taskLevel = activeEstimates.GetValueOrDefault(TargetKey(task.Id, null));
            var itemLevel = task.Items
                .Select(item => activeEstimates.GetValueOrDefault(TargetKey(task.Id, item.Id)))
                .Where(estimate => estimate is not null)
                .Cast<JsonObject>()
                .ToList();
            if (taskLevel is not null && itemLevel.Count > 0)
            {
                throw new CliException(
                    $"task「{task.Id}」同時存在 task-level 與 item-level active estimates，無法避免重複計算。");
            }

            var items = new JsonArray();
            var taskMinutes = 0;
            if (taskLevel is not null)
            {
                var mode = ResolveMode(taskLevel);
                var likely = RequiredPositiveInteger(taskLevel, "likely_minutes", "active estimate");
                taskMinutes += likely;
                totalEstimatedMinutes += likely;
                remainingBaseMinutes += likely * CalculateTaskRemainingRatio(task);
                composition[mode] += likely;
                confidences.Add(RequiredConfidence(taskLevel));
                diagnostics.Add(new Diagnostic(
                    "info",
                    "task-level-estimate-used",
                    $"{task.Id} 使用 task-level estimate，因此不產生子項目工時。"));
            }
            else
            {
                foreach (var item in task.Items)
                {
                    var source = activeEstimates.GetValueOrDefault(TargetKey(task.Id, item.Id))
                        ?? CreateDefaultEstimate(task.Id, item.Id, config, asOf);
                    var mode = ResolveMode(source);
                    var itemAnalysis = CreateItemAnalysis(source, item.Id, mode);
                    var likely = itemAnalysis["likely_minutes"]!.GetValue<int>();
                    items.Add(itemAnalysis);
                    taskMinutes += likely;
                    totalEstimatedMinutes += likely;
                    if (!item.Completed) remainingBaseMinutes += likely;
                    composition[mode] += likely;
                    confidences.Add(itemAnalysis["confidence"]!.GetValue<string>());
                    itemCount++;
                    if (mode == "default")
                    {
                        diagnostics.Add(new Diagnostic(
                            "info",
                            "default-estimate-used",
                            $"{item.Id} 沒有 active estimate，已使用預設 {likely} 分鐘。"));
                    }
                }
            }

            if (task.LegacyItemCount > 0)
            {
                diagnostics.Add(new Diagnostic(
                    "warning",
                    "stable-item-id-missing",
                    $"{task.Id} 有 {task.LegacyItemCount} 個舊字串項目；沒有穩定 item ID，因此無法產生項目工時。"));
            }

            if (taskMinutes <= 0) continue;
            var estimatedDays = DivideDays(taskMinutes, config);
            analysisTasks.Add(new JsonObject
            {
                ["task_id"] = task.Id,
                ["total_likely_minutes"] = taskMinutes,
                ["estimated_days"] = estimatedDays,
                ["display_days"] = DisplayDays(estimatedDays, config.RoundDays),
                ["items"] = items
            });
        }

        foreach (var estimate in activeEstimates.Values)
        {
            var taskId = RequiredString(estimate, "task_id", "active estimate");
            if (!reportTasks.Any(task => task.Id == taskId && task.Status != "archive"))
            {
                diagnostics.Add(new Diagnostic(
                    "warning",
                    "inactive-task-estimate-ignored",
                    $"{RequiredString(estimate, "estimate_id", "active estimate")} 指向不存在或已封存的 task，未計入分析。"));
            }
        }

        var actualMinutes = CalculateActualMinutes(eventsSource);
        var calibration = CreateCalibration(config, diagnostics);
        var calibratedMinutes = Math.Round(totalEstimatedMinutes * config.CalibrationFactor, 2);
        var remainingEstimatedMinutes = Math.Round(
            remainingBaseMinutes * config.CalibrationFactor,
            2);
        var estimatedTotalDays = config.DailyCapacityMinutes > 0
            ? Math.Round(calibratedMinutes / (config.DailyCapacityMinutes * config.ExecutorCount), 4)
            : 0;
        var summary = new JsonObject
        {
            ["executor_count"] = config.ExecutorCount,
            ["nominal_daily_capacity_minutes"] = config.DailyCapacityMinutes,
            ["execution_calibration"] = calibration,
            ["total_estimated_minutes"] = totalEstimatedMinutes,
            ["calibrated_total_minutes"] = calibratedMinutes,
            ["remaining_estimated_minutes"] = remainingEstimatedMinutes,
            ["actual_recorded_minutes"] = actualMinutes,
            ["estimated_total_days"] = estimatedTotalDays,
            ["display_total_days"] = DisplayDays(estimatedTotalDays, config.RoundDays),
            ["overall_confidence"] = OverallConfidence(confidences),
            ["estimate_composition"] = new JsonObject
            {
                ["ai_minutes"] = composition["ai"],
                ["mixed_minutes"] = composition["mixed"],
                ["manual_minutes"] = composition["manual"],
                ["default_minutes"] = composition["default"]
            }
        };

        var workProgress = CalculateProjectProgress(reportTasks);
        var deadline = CreateDeadline(
            config,
            eventsSource,
            report,
            asOf,
            workProgress,
            remainingEstimatedMinutes,
            diagnostics);
        if (deadline is not null) summary["deadline"] = deadline;

        var analysisId = ReadExistingAnalysisId(outputPath, scopeId)
            ?? $"analysis-{asOf.UtcDateTime:yyyyMMdd-HHmmss}";
        var analysis = new JsonObject
        {
            ["schema_version"] = TimeSchemaVersion,
            ["scope_id"] = scopeId,
            ["analysis_id"] = analysisId,
            ["as_of"] = asOf.ToString("O", CultureInfo.InvariantCulture),
            ["method"] = new JsonObject
            {
                ["name"] = RiskMethodName,
                ["version"] = RiskMethodVersion
            },
            ["inputs"] = new JsonObject
            {
                ["config_updated_at"] = InputTimestamp(configSource, asOf),
                ["estimates_updated_at"] = InputTimestamp(estimatesSource, asOf),
                ["events_updated_at"] = InputTimestamp(eventsSource, asOf),
                ["task_state_updated_at"] = RequiredString(report, "updated_at", "report.json")
            },
            ["summary"] = summary,
            ["tasks"] = analysisTasks,
            ["diagnostics"] = new JsonArray(diagnostics.Select(item => item.ToJson()).ToArray())
        };

        WriteAtomic(outputPath, analysis.ToJsonString(OutputOptions) + Environment.NewLine);
        return new TimeAnalysisGenerationResult(
            outputPath,
            analysisTasks.Count,
            itemCount,
            totalEstimatedMinutes,
            deadline is not null,
            diagnostics.Count);
    }

    private static JsonObject ReadObject(string path, string label)
    {
        try
        {
            var node = JsonNode.Parse(File.ReadAllText(path, Encoding.UTF8));
            return node as JsonObject
                ?? throw new CliException($"{label} 的根節點必須是物件。");
        }
        catch (JsonException error)
        {
            throw new CliException($"{label} 不是有效的 JSON：{error.Message}");
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException)
        {
            throw new CliException($"無法讀取 {label}：{error.Message}");
        }
    }

    private static void ValidateOptionalInput(JsonObject? input, string label, string scopeId)
    {
        if (input is null) return;
        if (RequiredString(input, "schema_version", label) != TimeSchemaVersion)
        {
            throw new CliException($"{label} schema_version 必須是 {TimeSchemaVersion}。");
        }
        if (RequiredString(input, "scope_id", label) != scopeId)
        {
            throw new CliException($"{label} scope_id 必須與 report.json 相同。");
        }
    }

    private static AnalyzerConfig ReadConfig(
        JsonObject? source,
        JsonObject report,
        DateTimeOffset asOf,
        List<Diagnostic> diagnostics)
    {
        if (source is null)
        {
            diagnostics.Add(new Diagnostic(
                "warning",
                "default-time-config-used",
                "找不到 time.config.json；使用 8/8/8、週一至週五、單一執行者與交付日未定。"));
            return AnalyzerConfig.Default;
        }

        var allocation = RequiredObject(source, "standard_allocation", "time.config.json");
        var project = RequiredObject(source, "project", "time.config.json");
        var defaults = RequiredObject(source, "estimate_defaults", "time.config.json");
        var calibration = RequiredObject(source, "execution_calibration", "time.config.json");
        var urgency = RequiredObject(source, "urgency_thresholds", "time.config.json");
        var display = RequiredObject(source, "display", "time.config.json");
        var total = RequiredPositiveInteger(allocation, "total_minutes_per_day", "standard_allocation");
        var sleep = RequiredNonNegativeInteger(allocation, "sleep_minutes_per_day", "standard_allocation");
        var life = RequiredNonNegativeInteger(allocation, "life_minutes_per_day", "standard_allocation");
        var other = RequiredNonNegativeInteger(
            allocation,
            "other_unavailable_minutes_per_day",
            "standard_allocation");
        var capacity = RequiredPositiveInteger(
            allocation,
            "capacity_minutes_per_executor_day",
            "standard_allocation");
        if (sleep + life + other + capacity != total || total != MinutesPerDay)
        {
            throw new CliException("time.config.json 的睡眠、生活、其他不可工作與工作容量總和必須等於 1440 分鐘。");
        }

        var weekdays = RequiredArray(allocation, "working_weekdays", "standard_allocation")
            .Select(node => node?.GetValue<int>() ?? 0)
            .ToArray();
        if (weekdays.Length == 0 || weekdays.Any(day => day is < 1 or > 7) || weekdays.Distinct().Count() != weekdays.Length)
        {
            throw new CliException("time.config.json working_weekdays 必須是唯一的 ISO weekday 1..7。");
        }

        var executorCount = RequiredPositiveInteger(project, "executor_count", "project");
        if (executorCount != 1)
        {
            throw new CliException("Draft 0.2 分析器目前只支援 executor_count = 1。");
        }
        var startClock = OptionalString(allocation, "workday_start_local") ?? "09:00";
        var endClock = OptionalString(allocation, "workday_end_local")
            ?? AddClockMinutes(startClock, capacity);
        ValidateClockWindow(startClock, endClock);

        var exceptions = new List<CapacityException>();
        if (project["capacity_exceptions"] is JsonArray exceptionArray)
        {
            var dates = new HashSet<DateOnly>();
            foreach (var node in exceptionArray)
            {
                var item = node as JsonObject
                    ?? throw new CliException("capacity_exceptions 的每一項都必須是物件。");
                var date = ParseDate(RequiredString(item, "date", "capacity exception"), "capacity exception");
                if (!dates.Add(date)) throw new CliException($"容量例外日期重複：{date:yyyy-MM-dd}");
                var available = RequiredNonNegativeInteger(item, "available_minutes", "capacity exception");
                if (available > MinutesPerDay) throw new CliException("容量例外不可超過 1440 分鐘。");
                exceptions.Add(new CapacityException(
                    date,
                    available,
                    OptionalString(item, "public_label")));
            }
        }

        var onTrack = RequiredPositiveNumber(
            urgency,
            "on_track_max_pressure_ratio",
            "urgency_thresholds");
        var atRisk = RequiredPositiveNumber(
            urgency,
            "at_risk_max_pressure_ratio",
            "urgency_thresholds");
        if (atRisk < onTrack) throw new CliException("黃色風險上限不可小於綠色上限。");
        var factor = RequiredPositiveNumber(calibration, "initial_factor", "execution_calibration");
        var priorSamples = RequiredPositiveNumber(
            calibration,
            "prior_equivalent_samples",
            "execution_calibration");
        var defaultMinutes = RequiredPositiveInteger(
            defaults,
            "unplanned_item_likely_minutes",
            "estimate_defaults");
        var defaultConfidence = RequiredString(
            defaults,
            "unplanned_item_confidence",
            "estimate_defaults");
        ValidateConfidence(defaultConfidence);
        var roundDays = RequiredString(display, "project_day_rounding", "display");
        if (roundDays is not ("ceiling" or "nearest"))
        {
            throw new CliException("display.project_day_rounding 必須是 ceiling 或 nearest。");
        }

        return new AnalyzerConfig(
            RequiredString(source, "timezone", "time.config.json"),
            executorCount,
            total,
            sleep,
            life,
            other,
            capacity,
            weekdays,
            startClock,
            endClock,
            OptionalString(project, "not_before"),
            OptionalString(project, "delivery_at"),
            exceptions,
            defaultMinutes,
            defaultConfidence,
            factor,
            priorSamples,
            OptionalBoolean(calibration, "automatic_adjustment") ?? false,
            onTrack,
            atRisk,
            roundDays);
    }

    private static List<ReportTask> ReadReportTasks(JsonObject report)
    {
        var tasks = RequiredArray(report, "tasks", "report.json");
        var result = new List<ReportTask>();
        var taskIds = new HashSet<string>(StringComparer.Ordinal);
        foreach (var node in tasks)
        {
            var task = node as JsonObject
                ?? throw new CliException("report.json tasks 的每一項都必須是物件。");
            var id = RequiredString(task, "id", "report task");
            ScopeId.Validate(id);
            if (!taskIds.Add(id)) throw new CliException($"report.json task id 重複：{id}");
            var status = RequiredString(task, "status", "report task");
            var items = new List<ReportItem>();
            var itemIds = new HashSet<string>(StringComparer.Ordinal);
            var legacyItemCount = 0;
            var completedCount = 0;
            var pendingCount = 0;
            ReadItems(
                task["completed_items"],
                id,
                itemIds,
                items,
                completed: true,
                ref legacyItemCount,
                ref completedCount);
            ReadItems(
                task["pending_items"],
                id,
                itemIds,
                items,
                completed: false,
                ref legacyItemCount,
                ref pendingCount);
            int? progressCompleted = null;
            int? progressTotal = null;
            if (task["progress"] is JsonObject progress)
            {
                progressCompleted = RequiredNonNegativeInteger(progress, "completed", "task.progress");
                progressTotal = RequiredPositiveInteger(progress, "total", "task.progress");
            }
            result.Add(new ReportTask(
                id,
                status,
                items,
                legacyItemCount,
                completedCount,
                pendingCount,
                progressCompleted,
                progressTotal));
        }
        return result;
    }

    private static void ReadItems(
        JsonNode? source,
        string taskId,
        HashSet<string> ids,
        List<ReportItem> items,
        bool completed,
        ref int legacyCount,
        ref int listCount)
    {
        if (source is null) return;
        if (source is not JsonArray array)
        {
            throw new CliException($"{taskId} 的工作項目必須是陣列。");
        }
        foreach (var node in array)
        {
            listCount++;
            if (node is JsonValue)
            {
                legacyCount++;
                continue;
            }
            var item = node as JsonObject
                ?? throw new CliException($"{taskId} 包含無效的工作項目。");
            var id = RequiredString(item, "id", "report item");
            ScopeId.Validate(id);
            if (!ids.Add(id)) throw new CliException($"{taskId} 的 item id 重複：{id}");
            items.Add(new ReportItem(id, completed));
        }
    }

    private static Dictionary<string, JsonObject> ReadActiveEstimates(
        JsonObject? source,
        IReadOnlyCollection<ReportTask> reportTasks)
    {
        var result = new Dictionary<string, JsonObject>(StringComparer.Ordinal);
        if (source is null) return result;
        var estimates = RequiredArray(source, "estimates", "time.estimates.json");
        var estimateIds = new HashSet<string>(StringComparer.Ordinal);
        foreach (var node in estimates)
        {
            var estimate = node as JsonObject
                ?? throw new CliException("time.estimates.json estimates 的每一項都必須是物件。");
            var estimateId = RequiredString(estimate, "estimate_id", "estimate");
            ScopeId.Validate(estimateId);
            if (!estimateIds.Add(estimateId)) throw new CliException($"estimate_id 重複：{estimateId}");
            if (!(estimate["active"]?.GetValue<bool>() ?? false)) continue;
            var taskId = RequiredString(estimate, "task_id", "estimate");
            var task = reportTasks.FirstOrDefault(item => item.Id == taskId)
                ?? throw new CliException($"{estimateId} 指向不存在的 task_id：{taskId}");
            var itemId = OptionalString(estimate, "item_id");
            if (itemId is not null && task.Items.All(item => item.Id != itemId))
            {
                throw new CliException($"{estimateId} 指向不存在或沒有穩定 ID 的 item：{itemId}");
            }
            RequiredPositiveInteger(estimate, "likely_minutes", estimateId);
            RequiredConfidence(estimate);
            var key = TargetKey(taskId, itemId);
            if (!result.TryAdd(key, estimate))
            {
                throw new CliException($"{taskId}/{itemId ?? "(task)"} 同時有多個 active estimates。");
            }
        }
        return result;
    }

    private static JsonObject CreateDefaultEstimate(
        string taskId,
        string itemId,
        AnalyzerConfig config,
        DateTimeOffset asOf)
    {
        return new JsonObject
        {
            ["estimate_id"] = $"estimate-default-{taskId}-{itemId}-v1",
            ["task_id"] = taskId,
            ["item_id"] = itemId,
            ["likely_minutes"] = config.DefaultItemMinutes,
            ["contributors"] = new JsonArray
            {
                new JsonObject
                {
                    ["kind"] = "system_default",
                    ["summary"] = "沒有 active estimate，採用設定檔的預設項目工時。"
                },
                new JsonObject
                {
                    ["kind"] = "deterministic_formula",
                    ["summary"] = "固定公式直接使用預設分鐘數。"
                }
            },
            ["human_confirmed"] = false,
            ["inputs"] = new JsonArray
            {
                new JsonObject
                {
                    ["name"] = "default_item_minutes",
                    ["value"] = config.DefaultItemMinutes,
                    ["unit"] = "min",
                    ["origin"] = "default"
                }
            },
            ["calculation"] = new JsonObject
            {
                ["algorithm_id"] = "default-workday",
                ["formula"] = "unplanned_item_likely_minutes",
                ["version"] = "0.2",
                ["explanation"] = $"使用設定值 {config.DefaultItemMinutes} 分鐘。"
            },
            ["confidence"] = config.DefaultConfidence,
            ["estimated_at"] = asOf.ToString("O", CultureInfo.InvariantCulture),
            ["active"] = true,
            ["rationale"] = "尚無足夠工程估算資料，使用低信心預設值；未虛構估算範圍。"
        };
    }

    private static JsonObject CreateItemAnalysis(JsonObject source, string itemId, string mode)
    {
        var likely = RequiredPositiveInteger(source, "likely_minutes", "estimate");
        var result = new JsonObject
        {
            ["estimate_id"] = RequiredString(source, "estimate_id", "estimate"),
            ["item_id"] = itemId,
            ["likely_minutes"] = likely,
            ["display_hours"] = Math.Round(likely / 60d, 2),
            ["mode"] = mode,
            ["contributors"] = RequiredArray(source, "contributors", "estimate").DeepClone(),
            ["human_confirmed"] = source["human_confirmed"]?.GetValue<bool>() ?? false,
            ["confidence"] = RequiredConfidence(source),
            ["explanation"] = OptionalString(source, "rationale")
                ?? "估算來源已記錄，但尚未提供公開說明。"
        };
        CopyOptional(source, result, "supersedes_estimate_id");
        CopyOptional(source, result, "low_minutes");
        CopyOptional(source, result, "high_minutes");
        CopyOptional(source, result, "inputs");
        CopyOptional(source, result, "analysis_method");
        CopyOptional(source, result, "calculation");
        CopyOptional(source, result, "human_note");
        CopyOptional(source, result, "reference");
        return result;
    }

    private static string ResolveMode(JsonObject estimate)
    {
        var contributors = RequiredArray(estimate, "contributors", "estimate")
            .Select(node => RequiredString(node as JsonObject
                ?? throw new CliException("estimate contributor 必須是物件。"), "kind", "contributor"))
            .ToHashSet(StringComparer.Ordinal);
        if (contributors.Contains("human_estimate")) return "manual";
        if (contributors.Contains("human_parameter")) return "mixed";
        if (contributors.Contains("ai_analysis") || contributors.Contains("historical_evidence")) return "ai";
        if (contributors.Contains("system_default")) return "default";
        throw new CliException(
            $"{RequiredString(estimate, "estimate_id", "estimate")} 無法判斷互斥估算模式。");
    }

    private static JsonObject CreateCalibration(AnalyzerConfig config, List<Diagnostic> diagnostics)
    {
        diagnostics.Add(new Diagnostic(
            "warning",
            "calibration-has-no-samples",
            "目前分析器尚未建立可比較的完成樣本；校準使用設定的先驗因子。"));
        return new JsonObject
        {
            ["factor"] = config.CalibrationFactor,
            ["prior_factor"] = config.CalibrationFactor,
            ["prior_equivalent_samples"] = config.PriorEquivalentSamples,
            ["raw_sample_count"] = 0,
            ["effective_sample_count"] = 0,
            ["data_weight"] = 0,
            ["confidence"] = "low",
            ["automatic_applied"] = false
        };
    }

    private static JsonObject? CreateDeadline(
        AnalyzerConfig config,
        JsonObject? eventsSource,
        JsonObject report,
        DateTimeOffset asOf,
        double workProgress,
        double remainingEstimatedMinutes,
        List<Diagnostic> diagnostics)
    {
        if (config.DeliveryAt is null) return null;
        try
        {
            var timeZone = TimeZoneInfo.FindSystemTimeZoneById(config.TimeZone);
            var delivery = ParseTimestamp(config.DeliveryAt, "project.delivery_at");
            var startDate = config.NotBefore is not null
                ? ParseDate(config.NotBefore, "project.not_before")
                : InferStartDate(eventsSource, report, timeZone, diagnostics);
            var start = LocalDateTime(startDate, config.WorkdayStart, timeZone);
            if (delivery <= start)
            {
                throw new CliException("交付時間必須晚於開始時間。");
            }

            var exceptions = config.Exceptions.ToDictionary(item => item.Date);
            var timeline = new List<CapacityDay>();
            var deliveryLocal = TimeZoneInfo.ConvertTime(delivery, timeZone);
            for (var date = startDate; date < DateOnly.FromDateTime(deliveryLocal.Date); date = date.AddDays(1))
            {
                var hasException = exceptions.TryGetValue(date, out var exception);
                if (!config.WorkingWeekdays.Contains(IsoWeekday(date)) && !hasException) continue;
                timeline.Add(new CapacityDay(
                    date,
                    hasException ? exception!.AvailableMinutes : config.DailyCapacityMinutes));
            }
            var totalCapacity = timeline.Sum(item => item.Minutes);
            if (totalCapacity <= 0) throw new CliException("交付前沒有任何可工作容量。");

            var elapsedCapacity = CalculateElapsedCapacity(
                timeline,
                asOf,
                delivery,
                start,
                timeZone,
                config.WorkdayStart,
                config.WorkdayEnd,
                totalCapacity);
            var timeProgress = Math.Round(elapsedCapacity / (double)totalCapacity, 6);
            var remainingCapacity = Math.Max(0, totalCapacity - elapsedCapacity);
            var capacityBalance = Math.Round(
                remainingCapacity - remainingEstimatedMinutes,
                2);
            var boundary = "active";
            var urgency = "on_track";
            var riskBasis = "progress_pressure";
            double? pressure = null;
            double? feasibility = remainingCapacity > 0
                ? Math.Round(remainingEstimatedMinutes / remainingCapacity, 6)
                : null;
            if (workProgress >= 1 || remainingEstimatedMinutes <= 0)
            {
                boundary = "complete";
                urgency = "complete";
                riskBasis = "complete";
            }
            else if (asOf >= delivery)
            {
                boundary = "delivery_reached";
                urgency = "critical";
                riskBasis = "boundary";
                elapsedCapacity = totalCapacity;
                timeProgress = 1;
                remainingCapacity = 0;
                capacityBalance = -remainingEstimatedMinutes;
                feasibility = null;
            }
            else if (elapsedCapacity >= totalCapacity)
            {
                boundary = "capacity_exhausted";
                urgency = "critical";
                riskBasis = "boundary";
                elapsedCapacity = totalCapacity;
                timeProgress = 1;
                remainingCapacity = 0;
                capacityBalance = -remainingEstimatedMinutes;
                feasibility = null;
            }
            else
            {
                pressure = Math.Round((1 - workProgress) / (1 - timeProgress), 6);
                var progressUrgency = pressure <= config.OnTrackMaximum
                    ? "on_track"
                    : pressure <= config.AtRiskMaximum
                        ? "at_risk"
                        : "critical";
                if (capacityBalance < 0)
                {
                    urgency = "critical";
                    riskBasis = "capacity_shortfall";
                }
                else if (feasibility > CapacityAtRiskRatio
                    && progressUrgency == "on_track")
                {
                    urgency = "at_risk";
                    riskBasis = "capacity_tight";
                }
                else
                {
                    urgency = progressUrgency;
                    riskBasis = "progress_pressure";
                }
            }

            var profileExceptions = new JsonArray();
            foreach (var item in config.Exceptions)
            {
                var projected = new JsonObject
                {
                    ["date"] = item.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                    ["available_minutes"] = item.AvailableMinutes
                };
                if (!string.IsNullOrWhiteSpace(item.PublicLabel))
                {
                    projected["public_label"] = item.PublicLabel;
                }
                profileExceptions.Add(projected);
            }
            var timelineJson = new JsonArray(timeline.Select(item => new JsonObject
            {
                ["date"] = item.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                ["capacity_minutes"] = item.Minutes
            }).ToArray());
            var result = new JsonObject
            {
                ["started_at"] = start.ToString("O", CultureInfo.InvariantCulture),
                ["delivery_at"] = delivery.ToString("O", CultureInfo.InvariantCulture),
                ["evaluated_at"] = asOf.ToString("O", CultureInfo.InvariantCulture),
                ["schedule"] = new JsonObject
                {
                    ["timezone"] = config.TimeZone,
                    ["workday_start_local"] = config.WorkdayStart,
                    ["workday_end_local"] = config.WorkdayEnd,
                    ["risk_thresholds"] = new JsonObject
                    {
                        ["on_track_max"] = config.OnTrackMaximum,
                        ["at_risk_max"] = config.AtRiskMaximum,
                        ["capacity_at_risk_ratio"] = CapacityAtRiskRatio
                    },
                    ["capacity_profile"] = new JsonObject
                    {
                        ["total_minutes_per_day"] = config.TotalMinutes,
                        ["sleep_minutes_per_day"] = config.SleepMinutes,
                        ["life_minutes_per_day"] = config.LifeMinutes,
                        ["other_unavailable_minutes_per_day"] = config.OtherUnavailableMinutes,
                        ["capacity_minutes_per_executor_day"] = config.DailyCapacityMinutes,
                        ["working_weekdays"] = new JsonArray(
                            config.WorkingWeekdays.Select(day => JsonValue.Create(day)).ToArray()),
                        ["capacity_exceptions"] = profileExceptions
                    },
                    ["capacity_timeline"] = timelineJson
                },
                ["elapsed_capacity_minutes"] = elapsedCapacity,
                ["total_capacity_minutes"] = totalCapacity,
                ["remaining_capacity_minutes"] = remainingCapacity,
                ["remaining_estimated_minutes"] = remainingEstimatedMinutes,
                ["capacity_balance_minutes"] = capacityBalance,
                ["time_progress_ratio"] = timeProgress,
                ["work_progress_ratio"] = Math.Round(workProgress, 6),
                ["boundary_state"] = boundary,
                ["urgency"] = urgency,
                ["risk_basis"] = riskBasis
            };
            if (pressure is not null) result["progress_pressure_ratio"] = pressure.Value;
            if (feasibility is not null) result["feasibility_ratio"] = feasibility.Value;
            return result;
        }
        catch (Exception error) when (error is TimeZoneNotFoundException or InvalidTimeZoneException)
        {
            diagnostics.Add(new Diagnostic(
                "warning",
                "deadline-timezone-invalid",
                $"期限分析已略過：無法使用時區 {config.TimeZone}。"));
            return null;
        }
        catch (CliException error)
        {
            diagnostics.Add(new Diagnostic(
                "warning",
                "deadline-analysis-unavailable",
                $"期限分析已略過：{error.Message}"));
            return null;
        }
    }

    private static DateOnly InferStartDate(
        JsonObject? eventsSource,
        JsonObject report,
        TimeZoneInfo timeZone,
        List<Diagnostic> diagnostics)
    {
        var candidates = new List<DateTimeOffset>();
        if (eventsSource?["events"] is JsonArray events)
        {
            foreach (var node in events.OfType<JsonObject>())
            {
                var occurredAt = OptionalString(node, "occurred_at");
                if (occurredAt is not null
                    && DateTimeOffset.TryParse(
                        occurredAt,
                        CultureInfo.InvariantCulture,
                        DateTimeStyles.RoundtripKind,
                        out var timestamp))
                {
                    candidates.Add(timestamp);
                }
            }
        }
        if (DateTimeOffset.TryParse(
            RequiredString(report, "updated_at", "report.json"),
            CultureInfo.InvariantCulture,
            DateTimeStyles.RoundtripKind,
            out var reportTime))
        {
            candidates.Add(reportTime);
        }
        var earliest = candidates.Count > 0 ? candidates.Min() : DateTimeOffset.Now;
        diagnostics.Add(new Diagnostic(
            "info",
            "deadline-start-inferred",
            "project.not_before 未設定；期限容量起點由最早事件或 report.updated_at 推定。"));
        return DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(earliest, timeZone).Date);
    }

    private static int CalculateElapsedCapacity(
        IReadOnlyCollection<CapacityDay> timeline,
        DateTimeOffset asOf,
        DateTimeOffset delivery,
        DateTimeOffset start,
        TimeZoneInfo timeZone,
        string startClock,
        string endClock,
        int totalCapacity)
    {
        if (asOf <= start) return 0;
        if (asOf >= delivery) return totalCapacity;
        var localNow = TimeZoneInfo.ConvertTime(asOf, timeZone);
        var localDate = DateOnly.FromDateTime(localNow.Date);
        var currentMinutes = localNow.Hour * 60 + localNow.Minute;
        var startMinutes = ParseClock(startClock);
        var endMinutes = ParseClock(endClock);
        double elapsed = 0;
        foreach (var day in timeline)
        {
            if (day.Date < localDate)
            {
                elapsed += day.Minutes;
            }
            else if (day.Date == localDate)
            {
                var fraction = Math.Clamp(
                    (currentMinutes - startMinutes) / (double)(endMinutes - startMinutes),
                    0,
                    1);
                elapsed += day.Minutes * fraction;
            }
        }
        return (int)Math.Round(Math.Clamp(elapsed, 0, totalCapacity));
    }

    private static int CalculateActualMinutes(JsonObject? source)
    {
        if (source?["events"] is not JsonArray events) return 0;
        var total = 0;
        foreach (var item in events.OfType<JsonObject>())
        {
            if (OptionalString(item, "kind") != "work_session_recorded"
                || item["session"] is not JsonObject session)
            {
                continue;
            }
            var start = ParseTimestamp(RequiredString(session, "started_at", "work session"), "work session");
            var end = ParseTimestamp(RequiredString(session, "ended_at", "work session"), "work session");
            var breakMinutes = OptionalInteger(session, "break_minutes") ?? 0;
            var minutes = (int)Math.Round((end - start).TotalMinutes) - breakMinutes;
            if (minutes < 0) throw new CliException("work session 的結束時間或休息分鐘數無效。");
            total += minutes;
        }
        return total;
    }

    private static double CalculateProjectProgress(IEnumerable<ReportTask> tasks)
    {
        var completed = 0;
        var total = 0;
        foreach (var task in tasks.Where(task => task.Status != "archive"))
        {
            if (task.CompletedCount + task.PendingCount > 0)
            {
                completed += task.CompletedCount;
                total += task.CompletedCount + task.PendingCount;
            }
            else if (task.ProgressCompleted is not null && task.ProgressTotal is not null)
            {
                completed += task.ProgressCompleted.Value;
                total += task.ProgressTotal.Value;
            }
            else
            {
                completed += task.Status == "done" ? 1 : 0;
                total += 1;
            }
        }
        return total == 0 ? 0 : completed / (double)total;
    }

    private static double CalculateTaskRemainingRatio(ReportTask task)
    {
        if (task.Status == "done") return 0;
        if (task.CompletedCount + task.PendingCount > 0)
        {
            return task.PendingCount / (double)(task.CompletedCount + task.PendingCount);
        }
        if (task.ProgressCompleted is not null && task.ProgressTotal is not null)
        {
            return 1 - Math.Clamp(
                task.ProgressCompleted.Value / (double)task.ProgressTotal.Value,
                0,
                1);
        }
        return 1;
    }

    private static string OverallConfidence(IReadOnlyCollection<string> values)
    {
        if (values.Count == 0 || values.Contains("low")) return "low";
        return values.Contains("medium") ? "medium" : "high";
    }

    private static double DivideDays(int minutes, AnalyzerConfig config)
    {
        return Math.Round(minutes / (double)(config.DailyCapacityMinutes * config.ExecutorCount), 4);
    }

    private static int DisplayDays(double days, string mode)
    {
        return mode == "nearest"
            ? (int)Math.Round(days, MidpointRounding.AwayFromZero)
            : (int)Math.Ceiling(days);
    }

    private static string InputTimestamp(JsonObject? input, DateTimeOffset fallback)
    {
        return OptionalString(input, "updated_at")
            ?? fallback.ToString("O", CultureInfo.InvariantCulture);
    }

    private static string? ReadExistingAnalysisId(string path, string scopeId)
    {
        if (!File.Exists(path)) return null;
        try
        {
            var existing = ReadObject(path, "existing time.analysis.json");
            return OptionalString(existing, "scope_id") == scopeId
                ? OptionalString(existing, "analysis_id")
                : null;
        }
        catch (CliException)
        {
            return null;
        }
    }

    private static void WriteAtomic(string outputPath, string content)
    {
        try
        {
            var directory = Path.GetDirectoryName(outputPath)
                ?? throw new CliException("time.analysis.json 輸出路徑無效。");
            Directory.CreateDirectory(directory);
            var temporary = Path.Combine(
                directory,
                $".{Path.GetFileName(outputPath)}.{Guid.NewGuid():N}.tmp");
            File.WriteAllText(temporary, content, new UTF8Encoding(false));
            File.Move(temporary, outputPath, true);
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException)
        {
            throw new CliException($"無法寫入 time.analysis.json：{error.Message}");
        }
    }

    private static void CopyOptional(JsonObject source, JsonObject target, string name)
    {
        if (source[name] is JsonNode value) target[name] = value.DeepClone();
    }

    private static string TargetKey(string taskId, string? itemId) => $"{taskId}\u001f{itemId ?? ""}";

    private static JsonObject RequiredObject(JsonObject source, string name, string label)
    {
        return source[name] as JsonObject
            ?? throw new CliException($"{label} 缺少有效的 {name}。");
    }

    private static JsonArray RequiredArray(JsonObject source, string name, string label)
    {
        return source[name] as JsonArray
            ?? throw new CliException($"{label} 缺少有效的 {name}。");
    }

    private static string RequiredString(JsonObject source, string name, string label)
    {
        return OptionalString(source, name)
            ?? throw new CliException($"{label} 缺少有效的 {name}。");
    }

    private static string? OptionalString(JsonObject? source, string name)
    {
        if (source?[name] is not JsonValue value
            || !value.TryGetValue<string>(out var result)
            || string.IsNullOrWhiteSpace(result))
        {
            return null;
        }
        return result;
    }

    private static bool? OptionalBoolean(JsonObject source, string name)
    {
        return source[name] is JsonValue value && value.TryGetValue<bool>(out var result)
            ? result
            : null;
    }

    private static int? OptionalInteger(JsonObject source, string name)
    {
        return source[name] is JsonValue value && value.TryGetValue<int>(out var result)
            ? result
            : null;
    }

    private static int RequiredPositiveInteger(JsonObject source, string name, string label)
    {
        var value = OptionalInteger(source, name);
        if (value is null || value <= 0) throw new CliException($"{label}.{name} 必須是正整數。");
        return value.Value;
    }

    private static int RequiredNonNegativeInteger(JsonObject source, string name, string label)
    {
        var value = OptionalInteger(source, name);
        if (value is null || value < 0) throw new CliException($"{label}.{name} 必須是非負整數。");
        return value.Value;
    }

    private static double RequiredPositiveNumber(JsonObject source, string name, string label)
    {
        if (source[name] is not JsonValue value
            || !value.TryGetValue<double>(out var result)
            || !double.IsFinite(result)
            || result <= 0)
        {
            throw new CliException($"{label}.{name} 必須是正數。");
        }
        return result;
    }

    private static string RequiredConfidence(JsonObject source)
    {
        var value = RequiredString(source, "confidence", "estimate");
        ValidateConfidence(value);
        return value;
    }

    private static void ValidateConfidence(string value)
    {
        if (value is not ("low" or "medium" or "high"))
        {
            throw new CliException($"不支援的信心值：{value}");
        }
    }

    private static DateTimeOffset ParseTimestamp(string value, string label)
    {
        if (!DateTimeOffset.TryParse(
            value,
            CultureInfo.InvariantCulture,
            DateTimeStyles.RoundtripKind,
            out var result))
        {
            throw new CliException($"{label} 不是有效的 ISO 8601 時間。");
        }
        return result;
    }

    private static DateOnly ParseDate(string value, string label)
    {
        if (!DateOnly.TryParseExact(
            value,
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var result))
        {
            throw new CliException($"{label} 不是有效的 YYYY-MM-DD 日期。");
        }
        return result;
    }

    private static int ParseClock(string value)
    {
        if (!TimeOnly.TryParseExact(
            value,
            "HH:mm",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var result))
        {
            throw new CliException($"無效的本地工作時間：{value}");
        }
        return result.Hour * 60 + result.Minute;
    }

    private static void ValidateClockWindow(string start, string end)
    {
        if (ParseClock(end) <= ParseClock(start))
        {
            throw new CliException("workday_end_local 必須晚於 workday_start_local。");
        }
    }

    private static string AddClockMinutes(string start, int minutes)
    {
        var result = ParseClock(start) + minutes;
        if (result >= MinutesPerDay)
        {
            throw new CliException(
                "每日容量超出預設工作視窗；請在 standard_allocation 設定 workday_start_local 與 workday_end_local。");
        }
        return $"{result / 60:00}:{result % 60:00}";
    }

    private static DateTimeOffset LocalDateTime(
        DateOnly date,
        string clock,
        TimeZoneInfo timeZone)
    {
        var time = TimeOnly.ParseExact(clock, "HH:mm", CultureInfo.InvariantCulture);
        var local = date.ToDateTime(time, DateTimeKind.Unspecified);
        if (timeZone.IsInvalidTime(local))
        {
            throw new CliException($"{date:yyyy-MM-dd} {clock} 在時區 {timeZone.Id} 不存在。");
        }
        return new DateTimeOffset(local, timeZone.GetUtcOffset(local));
    }

    private static int IsoWeekday(DateOnly date)
    {
        return date.DayOfWeek == DayOfWeek.Sunday ? 7 : (int)date.DayOfWeek;
    }

    private sealed record ReportItem(string Id, bool Completed);

    private sealed record ReportTask(
        string Id,
        string Status,
        IReadOnlyList<ReportItem> Items,
        int LegacyItemCount,
        int CompletedCount,
        int PendingCount,
        int? ProgressCompleted,
        int? ProgressTotal);

    private sealed record CapacityException(
        DateOnly Date,
        int AvailableMinutes,
        string? PublicLabel);

    private sealed record CapacityDay(DateOnly Date, int Minutes);

    private sealed record Diagnostic(string Level, string Code, string Message)
    {
        public JsonObject ToJson() => new()
        {
            ["level"] = Level,
            ["code"] = Code,
            ["message"] = Message
        };
    }

    private sealed record AnalyzerConfig(
        string TimeZone,
        int ExecutorCount,
        int TotalMinutes,
        int SleepMinutes,
        int LifeMinutes,
        int OtherUnavailableMinutes,
        int DailyCapacityMinutes,
        IReadOnlyList<int> WorkingWeekdays,
        string WorkdayStart,
        string WorkdayEnd,
        string? NotBefore,
        string? DeliveryAt,
        IReadOnlyList<CapacityException> Exceptions,
        int DefaultItemMinutes,
        string DefaultConfidence,
        double CalibrationFactor,
        double PriorEquivalentSamples,
        bool AutomaticCalibration,
        double OnTrackMaximum,
        double AtRiskMaximum,
        string RoundDays)
    {
        public static AnalyzerConfig Default => new(
            "Asia/Taipei",
            1,
            1440,
            480,
            480,
            0,
            480,
            [1, 2, 3, 4, 5],
            "09:00",
            "17:00",
            null,
            null,
            [],
            480,
            "low",
            1.0,
            10,
            false,
            1.1,
            1.5,
            "ceiling");
    }
}
