// Cost's deterministic analyzer: item amounts in, task and project totals out.
//
// It reads report.json for the stable task/item identity and completion state,
// and Cost's own private inputs. It never reads Time. `工時 × 時薪` is a
// terminal settlement's job, and giving Cost an optional Time dependency would
// make Cost's freshness depend on Time's while leaving that conversion with no
// independent owner.
//
// The rule that shapes everything here: an item with no active estimate is
// excluded from the total and makes its level partial. Not zero, and not a
// domain default — a default produces a number that looks complete and rests
// on nothing, which is exactly how this project's own Time report came to read
// "約需 88 hr" with every one of its 113 items unestimated.

using System.Text.Json;
using System.Text.Json.Nodes;

namespace TaskProgress;

internal sealed record CostAnalysisGenerationResult(
    string OutputPath,
    int TaskCount,
    int EstimatedItemCount,
    long TotalEstimatedMinorUnits,
    string Coverage,
    string Urgency,
    int DiagnosticCount);

internal static class CostEstimationGenerator
{
    private const string CostSchemaVersion = "0.1";
    private const string MethodName = "deterministic-cost-rollup";
    private const string MethodVersion = "0.1";
    public const string ConfigFileName = "cost.config.json";
    public const string EstimatesFileName = "cost.estimates.json";
    public const string AnalysisFileName = "cost.analysis.json";

    private static readonly JsonSerializerOptions OutputOptions = new() { WriteIndented = true };

    /// <summary>
    ///   Whether this folder carries Cost inputs. A report that never used
    ///   Cost has none, and must stay that way — nothing here creates inputs.
    /// </summary>
    public static bool HasInputs(string folderValue)
    {
        if (string.IsNullOrWhiteSpace(folderValue)) return false;
        var directory = ResolveDirectory(folderValue);
        return File.Exists(Path.Combine(directory, ConfigFileName))
            || File.Exists(Path.Combine(directory, EstimatesFileName));
    }

    public static CostAnalysisGenerationResult Generate(
        string folderValue,
        DateTimeOffset? evaluatedAt = null,
        string? outputValue = null)
    {
        var reportFolder = ReportFolder.Load(folderValue);
        var report = ReadObject(reportFolder.ReportPath, "report.json");
        var asOf = evaluatedAt ?? DateTimeOffset.Now;
        var outputPath = outputValue is null
            ? Path.Combine(reportFolder.DirectoryPath, AnalysisFileName)
            : Path.GetFullPath(
                Path.IsPathRooted(outputValue)
                    ? outputValue
                    : Path.Combine(reportFolder.DirectoryPath, outputValue));

        var configPath = Path.Combine(reportFolder.DirectoryPath, ConfigFileName);
        var estimatesPath = Path.Combine(reportFolder.DirectoryPath, EstimatesFileName);
        var config = File.Exists(configPath) ? ReadObject(configPath, ConfigFileName) : null;
        var estimates = File.Exists(estimatesPath)
            ? ReadObject(estimatesPath, EstimatesFileName)
            : null;

        var diagnostics = new List<string>();
        var active = ReadActiveEstimates(estimates, diagnostics);
        var tasks = RollUp(report, active, diagnostics);

        var totalMinorUnits = tasks.Sum(task => task.EstimatedMinorUnits);
        var remainingMinorUnits = tasks.Sum(task => task.RemainingMinorUnits);
        var estimatedItems = tasks.Sum(task => task.EstimatedItemCount);
        var totalItems = tasks.Sum(task => task.ItemCount);
        var coverage = Coverage(estimatedItems, totalItems);
        var available = ReadOptionalLong(config, "available_resource_minor_units");
        var balance = available is null ? (long?)null : available.Value - remainingMinorUnits;
        var urgency = Urgency(balance, available, remainingMinorUnits, coverage, config);

        WriteOutput(
            outputPath,
            reportFolder.Scope,
            asOf,
            config,
            estimates,
            tasks,
            totalMinorUnits,
            remainingMinorUnits,
            estimatedItems,
            totalItems,
            coverage,
            available,
            balance,
            urgency,
            diagnostics);

        return new CostAnalysisGenerationResult(
            outputPath,
            tasks.Count,
            estimatedItems,
            totalMinorUnits,
            coverage,
            urgency,
            diagnostics.Count);
    }

    /// <summary>
    ///   One active estimate per item. A second active row for the same item
    ///   is a diagnostic and is dropped rather than added, because adding it
    ///   would silently double the item's cost.
    /// </summary>
    private static Dictionary<string, ActiveEstimate> ReadActiveEstimates(
        JsonDocument? estimates,
        List<string> diagnostics)
    {
        var byItem = new Dictionary<string, ActiveEstimate>(StringComparer.Ordinal);
        if (estimates is null) return byItem;
        if (!estimates.RootElement.TryGetProperty("estimates", out var rows)
            || rows.ValueKind != JsonValueKind.Array)
        {
            diagnostics.Add($"{EstimatesFileName} 缺少 estimates 陣列。");
            return byItem;
        }

        foreach (var row in rows.EnumerateArray())
        {
            if (row.ValueKind != JsonValueKind.Object) continue;
            if (!row.TryGetProperty("active", out var activeValue)
                || activeValue.ValueKind != JsonValueKind.True)
            {
                continue;
            }

            var itemId = OptionalString(row, "item_id");
            if (itemId is null)
            {
                diagnostics.Add("有一筆 active estimate 沒有 item_id，已略過。");
                continue;
            }

            if (!row.TryGetProperty("amount_minor_units", out var amountValue)
                || !amountValue.TryGetInt64(out var amount))
            {
                diagnostics.Add($"item「{itemId}」的 amount_minor_units 不是整數，已略過。");
                continue;
            }

            var contributors = new List<string>();
            if (row.TryGetProperty("contributors", out var contributorRows)
                && contributorRows.ValueKind == JsonValueKind.Array)
            {
                foreach (var contributor in contributorRows.EnumerateArray())
                {
                    if (contributor.ValueKind == JsonValueKind.String)
                    {
                        contributors.Add(contributor.GetString()!);
                    }
                }
            }

            var estimate = new ActiveEstimate(
                amount,
                contributors,
                OptionalString(row, "confidence"),
                row.TryGetProperty("human_confirmed", out var confirmed)
                    && confirmed.ValueKind == JsonValueKind.True);
            if (!byItem.TryAdd(itemId, estimate))
            {
                diagnostics.Add($"item「{itemId}」有多於一筆 active estimate，只採用第一筆。");
            }
        }

        return byItem;
    }

    private static List<TaskRollup> RollUp(
        JsonDocument report,
        Dictionary<string, ActiveEstimate> active,
        List<string> diagnostics)
    {
        var tasks = new List<TaskRollup>();
        if (!report.RootElement.TryGetProperty("tasks", out var taskRows)
            || taskRows.ValueKind != JsonValueKind.Array)
        {
            return tasks;
        }

        var matched = new HashSet<string>(StringComparer.Ordinal);
        foreach (var taskRow in taskRows.EnumerateArray())
        {
            var taskId = OptionalString(taskRow, "id");
            if (taskId is null) continue;

            long estimated = 0;
            long remaining = 0;
            var itemCount = 0;
            var estimatedItemCount = 0;
            var rollups = new List<ItemRollup>();
            foreach (var (field, done) in new[] { ("pending_items", false), ("completed_items", true) })
            {
                if (!taskRow.TryGetProperty(field, out var itemRows)
                    || itemRows.ValueKind != JsonValueKind.Array)
                {
                    continue;
                }

                foreach (var item in itemRows.EnumerateArray())
                {
                    var itemId = OptionalString(item, "id");
                    if (itemId is null) continue;
                    itemCount++;
                    if (!active.TryGetValue(itemId, out var estimate)) continue;
                    var amount = estimate.AmountMinorUnits;
                    matched.Add(itemId);
                    estimatedItemCount++;
                    estimated += amount;
                    var itemDone = OptionalString(item, "status") is { } status
                        ? string.Equals(status, "done", StringComparison.Ordinal)
                        : done;
                    if (!itemDone) remaining += amount;
                    rollups.Add(new ItemRollup(itemId, amount, itemDone, estimate));
                }
            }

            tasks.Add(new TaskRollup(
                taskId,
                estimated,
                remaining,
                itemCount,
                estimatedItemCount,
                Coverage(estimatedItemCount, itemCount),
                rollups));
        }

        foreach (var orphan in active.Keys.Where(id => !matched.Contains(id)).OrderBy(id => id, StringComparer.Ordinal))
        {
            diagnostics.Add($"estimate 指向的 item「{orphan}」不在 report.json 中，未計入。");
        }

        return tasks;
    }

    private static string Coverage(int estimated, int total) => total == 0
        ? "none"
        : estimated == 0 ? "none" : estimated == total ? "full" : "partial";

    /// <summary>
    ///   Cost risk compares money with money and nothing else: no deadline, no
    ///   working capacity, no progress pressure. Combining Cost with a
    ///   time-rate contribution is a terminal settlement's result, not this
    ///   module's.
    /// </summary>
    private static string Urgency(
        long? balance,
        long? available,
        long remaining,
        string coverage,
        JsonDocument? config)
    {
        if (available is null || balance is null || coverage is "none" or "partial") return "unknown";
        if (balance.Value < 0) return "critical";
        if (available.Value == 0) return remaining == 0 ? "on_track" : "critical";

        var threshold = ReadOptionalDouble(config, "risk_thresholds", "at_risk_remaining_ratio") ?? 0.2;
        var remainingRatio = (double)balance.Value / available.Value;
        return remainingRatio < threshold ? "at_risk" : "on_track";
    }

    private static void WriteOutput(
        string outputPath,
        string scope,
        DateTimeOffset asOf,
        JsonDocument? config,
        JsonDocument? estimates,
        List<TaskRollup> tasks,
        long totalMinorUnits,
        long remainingMinorUnits,
        int estimatedItems,
        int totalItems,
        string coverage,
        long? available,
        long? balance,
        string urgency,
        List<string> diagnostics)
    {
        var summary = new JsonObject
        {
            ["currency"] = OptionalString(config?.RootElement, "currency") ?? "TWD",
            ["currency_symbol"] = OptionalString(config?.RootElement, "currency_symbol") ?? "$",
            ["total_estimated_minor_units"] = totalMinorUnits,
            ["remaining_estimated_minor_units"] = remainingMinorUnits,
            ["estimated_item_count"] = estimatedItems,
            ["item_count"] = totalItems,
            ["coverage"] = coverage,
            ["resource"] = new JsonObject
            {
                ["available_minor_units"] = available,
                ["balance_minor_units"] = balance,
                ["urgency"] = urgency,
            },
        };

        var taskArray = new JsonArray();
        foreach (var task in tasks)
        {
            var itemArray = new JsonArray();
            foreach (var item in task.Items)
            {
                var contributorArray = new JsonArray();
                foreach (var contributor in item.Estimate.Contributors) contributorArray.Add(contributor);
                itemArray.Add(new JsonObject
                {
                    ["id"] = item.Id,
                    ["estimated_minor_units"] = item.EstimatedMinorUnits,
                    ["done"] = item.Done,
                    ["contributors"] = contributorArray,
                    ["confidence"] = item.Estimate.Confidence,
                    ["human_confirmed"] = item.Estimate.HumanConfirmed,
                });
            }

            taskArray.Add(new JsonObject
            {
                ["id"] = task.Id,
                ["estimated_minor_units"] = task.EstimatedMinorUnits,
                ["remaining_minor_units"] = task.RemainingMinorUnits,
                ["estimated_item_count"] = task.EstimatedItemCount,
                ["item_count"] = task.ItemCount,
                ["coverage"] = task.Coverage,
                ["items"] = itemArray,
            });
        }

        var diagnosticArray = new JsonArray();
        foreach (var entry in diagnostics) diagnosticArray.Add(entry);

        var document = new JsonObject
        {
            ["schema_version"] = CostSchemaVersion,
            ["scope_id"] = scope,
            ["as_of"] = asOf.ToString("o"),
            ["method"] = new JsonObject
            {
                ["name"] = MethodName,
                ["version"] = MethodVersion,
            },
            ["inputs"] = new JsonObject
            {
                ["config_updated_at"] = OptionalString(config?.RootElement, "updated_at"),
                ["estimates_updated_at"] = OptionalString(estimates?.RootElement, "updated_at"),
            },
            ["summary"] = summary,
            ["tasks"] = taskArray,
            ["diagnostics"] = diagnosticArray,
        };

        try
        {
            File.WriteAllText(outputPath, document.ToJsonString(OutputOptions));
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException)
        {
            throw new CliException($"無法寫入 {AnalysisFileName}：{error.Message}");
        }
    }

    private static string ResolveDirectory(string folderValue)
    {
        var fullPath = Path.GetFullPath(Environment.ExpandEnvironmentVariables(folderValue));
        return File.Exists(fullPath) ? Path.GetDirectoryName(fullPath)! : fullPath;
    }

    private static JsonDocument ReadObject(string path, string label)
    {
        try
        {
            var document = JsonDocument.Parse(File.ReadAllBytes(path));
            if (document.RootElement.ValueKind != JsonValueKind.Object)
            {
                document.Dispose();
                throw new CliException($"{label} 的根節點必須是物件。 ");
            }

            return document;
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

    private static string? OptionalString(JsonElement? root, string propertyName) =>
        root is { } element
            && element.ValueKind == JsonValueKind.Object
            && element.TryGetProperty(propertyName, out var property)
            && property.ValueKind == JsonValueKind.String
                ? property.GetString()
                : null;

    private static string? OptionalString(JsonElement root, string propertyName) =>
        OptionalString((JsonElement?)root, propertyName);

    private static long? ReadOptionalLong(JsonDocument? document, string propertyName) =>
        document is not null
            && document.RootElement.TryGetProperty(propertyName, out var property)
            && property.TryGetInt64(out var value)
                ? value
                : null;

    private static double? ReadOptionalDouble(JsonDocument? document, string objectName, string propertyName) =>
        document is not null
            && document.RootElement.TryGetProperty(objectName, out var container)
            && container.ValueKind == JsonValueKind.Object
            && container.TryGetProperty(propertyName, out var property)
            && property.TryGetDouble(out var value)
                ? value
                : null;

    private sealed record TaskRollup(
        string Id,
        long EstimatedMinorUnits,
        long RemainingMinorUnits,
        int ItemCount,
        int EstimatedItemCount,
        string Coverage,
        IReadOnlyList<ItemRollup> Items);

    /// <summary>
    ///   Only items that actually carry an estimate appear. An item with none
    ///   is absent rather than present with a zero, so the Viewer cannot
    ///   accidentally render a capsule for a value nobody set.
    /// </summary>
    private sealed record ItemRollup(
        string Id,
        long EstimatedMinorUnits,
        bool Done,
        ActiveEstimate Estimate);

    /// <summary>
    ///   The assessment fields an estimate carries beyond its amount. They are
    ///   projected so a reader can see what a figure rests on; without them an
    ///   item panel shows a number and no way to judge it.
    /// </summary>
    private sealed record ActiveEstimate(
        long AmountMinorUnits,
        IReadOnlyList<string> Contributors,
        string? Confidence,
        bool HumanConfirmed);
}
