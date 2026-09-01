// Time's half of the rule Cost already follows: a leaf nobody estimated is
// excluded from every total, and the level says so rather than reporting a
// figure that rests on a substituted default.
//
// Two of these guard something the exclusion created rather than fixed.
//
// The item entry must survive exclusion. It is what the Viewer offers as the
// `-hr` entry point for making a first estimate, and an entry point whose
// subject cannot be looked up leads nowhere -- so "excluded from the total"
// must not quietly become "absent from the file".
//
// The deadline must disappear with the estimates. With no demand to weigh
// capacity against, the feasibility branch reads `remaining <= 0` as finished
// and reports the project `complete`, which is a worse falsehood than the
// defaults this rule removed.

using TaskProgress;

internal static class TimeAnalysisTests
{
    public static void Run()
    {
        var root = Path.Combine(
            Path.GetTempPath(),
            $"task-progress-time-{Guid.NewGuid():N}");
        Directory.CreateDirectory(root);
        try
        {
            UnestimatedItemsAreExcludedRatherThanDefaulted(root);
            AnExcludedItemStillHasAnEntryToOpen(root);
            PartialCoverageSumsOnlyWhatIsSet(root);
            NoEstimateAnywhereWithholdsTheDeadline(root);
            ExcludedMinutesStayVisibleWithoutJoiningTheTotal(root);
        }
        finally
        {
            try
            {
                Directory.Delete(root, recursive: true);
            }
            catch (IOException)
            {
            }
        }
    }

    /// <summary>
    ///   The headline: three unestimated items used to contribute the
    ///   configured default each, producing a complete-looking total with
    ///   nothing behind it.
    /// </summary>
    private static void UnestimatedItemsAreExcludedRatherThanDefaulted(string root)
    {
        var folder = NewReport(root, "none", pending: ["a", "b"], done: ["c"]);
        WriteConfig(folder);

        var result = TimeAnalysisGenerator.Generate(folder, When);
        var analysis = ReadAnalysis(folder);

        Equal(0L, Long(analysis, "summary", "total_estimated_minutes"), "An unestimated item reached the total");
        Equal(0, result.EstimatedLeafCount, "An unestimated leaf counted as estimated");
        Equal(3, result.LeafCount, "The leaf count did not match the report");
        Equal("none", result.EstimateCoverage, "A report with no estimates did not read as none");
    }

    /// <summary>
    ///   Excluded from the total, still present in the file. The task carrying
    ///   it must survive too, or the item has nowhere to live.
    /// </summary>
    private static void AnExcludedItemStillHasAnEntryToOpen(string root)
    {
        var folder = NewReport(root, "entry", pending: ["a"], done: []);
        WriteConfig(folder);

        TimeAnalysisGenerator.Generate(folder, When);
        var analysis = ReadAnalysis(folder);

        var tasks = analysis.RootElement.GetProperty("tasks");
        Equal(1, tasks.GetArrayLength(), "A task whose leaves are all unset was dropped");
        var items = tasks[0].GetProperty("items");
        Equal(1, items.GetArrayLength(), "An excluded item lost its entry");
        Equal("a", items[0].GetProperty("item_id").GetString(), "The surviving entry was not the excluded item");
        Equal("none", tasks[0].GetProperty("estimate_coverage").GetString(), "An all-unset task did not read as none");
    }

    /// <summary>
    ///   Coverage is per level and not all-or-nothing: one estimated leaf of
    ///   two is real data, merely incomplete.
    /// </summary>
    private static void PartialCoverageSumsOnlyWhatIsSet(string root)
    {
        var folder = NewReport(root, "partial", pending: ["a", "b"], done: []);
        WriteConfig(folder);
        WriteEstimates(folder, ("a", 120));

        var result = TimeAnalysisGenerator.Generate(folder, When);
        var analysis = ReadAnalysis(folder);

        Equal(120L, Long(analysis, "summary", "total_estimated_minutes"), "The total was not the one estimate written");
        Equal("partial", result.EstimateCoverage, "One of two estimated leaves did not read as partial");
        Equal(
            "partial",
            analysis.RootElement.GetProperty("tasks")[0].GetProperty("estimate_coverage").GetString(),
            "The task level did not report partial coverage");
    }

    /// <summary>
    ///   No estimate means no feasibility claim. Absence is the supported
    ///   "not assessable" state; the alternative was reporting `complete`.
    /// </summary>
    private static void NoEstimateAnywhereWithholdsTheDeadline(string root)
    {
        var withoutEstimates = NewReport(root, "no-deadline", pending: ["a"], done: []);
        WriteConfig(withoutEstimates, delivery: "2026-09-30T00:00:00+08:00");

        var bare = TimeAnalysisGenerator.Generate(withoutEstimates, When);
        False(bare.DeadlineIncluded, "A deadline was produced with nothing to compare against");
        False(
            ReadAnalysis(withoutEstimates).RootElement.GetProperty("summary").TryGetProperty("deadline", out _),
            "The deadline block survived in the file");

        var withEstimates = NewReport(root, "with-deadline", pending: ["a"], done: []);
        WriteConfig(withEstimates, delivery: "2026-09-30T00:00:00+08:00");
        WriteEstimates(withEstimates, ("a", 120));

        True(
            TimeAnalysisGenerator.Generate(withEstimates, When).DeadlineIncluded,
            "A real estimate did not restore the deadline, so the delivery date was not the reason it was withheld");
    }

    /// <summary>
    ///   What was left out stays reportable. Hiding the size of the exclusion
    ///   would make it as hard to notice as the default it replaced.
    /// </summary>
    private static void ExcludedMinutesStayVisibleWithoutJoiningTheTotal(string root)
    {
        var folder = NewReport(root, "excluded", pending: ["a"], done: []);
        WriteConfig(folder);

        TimeAnalysisGenerator.Generate(folder, When);
        var composition = ReadAnalysis(folder)
            .RootElement.GetProperty("summary").GetProperty("estimate_composition");

        Equal(480L, composition.GetProperty("default_minutes").GetInt64(), "The excluded minutes were not reported");
        Equal(0L, composition.GetProperty("manual_minutes").GetInt64(), "An excluded leaf was counted as manual");
    }

    private static readonly DateTimeOffset When = DateTimeOffset.Parse("2026-08-28T12:00:00+08:00");

    private static string NewReport(string root, string name, string[] pending, string[] done)
    {
        var folder = Path.Combine(root, name);
        Directory.CreateDirectory(folder);
        string Items(string field, string[] ids) => ids.Length == 0
            ? ""
            : $""", "{field}": [{string.Join(",", ids.Select(id => $$"""{"id":"{{id}}","title":"{{id}}"}"""))}]""";
        File.WriteAllText(
            Path.Combine(folder, "report.json"),
            $$"""
            {
              "schema_version": "1.1",
              "report_id": "time-fixture",
              "scope_id": "time-fixture",
              "title": "Time fixture",
              "updated_at": "2026-08-28T12:00:00+08:00",
              "tasks": [
                { "id": "t1", "title": "t1", "status": "planned", "priority": 2{{Items("pending_items", pending)}}{{Items("completed_items", done)}} }
              ]
            }
            """);
        return folder;
    }

    private static void WriteConfig(string folder, string? delivery = null)
    {
        var project = delivery is null
            ? "\"executor_count\": 1"
            : "\"executor_count\": 1, \"not_before\": \"2026-08-28\", "
                + $"\"delivery_at\": \"{delivery}\", \"capacity_exceptions\": []";
        File.WriteAllText(
            Path.Combine(folder, "time.config.json"),
            $$"""
            {
              "schema_version": "0.2",
              "scope_id": "time-fixture",
              "updated_at": "2026-08-28T12:00:00+08:00",
              "timezone": "Asia/Taipei",
              "standard_allocation": {
                "total_minutes_per_day": 1440,
                "sleep_minutes_per_day": 480,
                "life_minutes_per_day": 480,
                "other_unavailable_minutes_per_day": 0,
                "capacity_minutes_per_executor_day": 480,
                "working_weekdays": [1, 2, 3, 4, 5],
                "workday_start_local": "09:00",
                "workday_end_local": "17:00"
              },
              "project": { {{project}} },
              "estimate_defaults": { "unplanned_item_likely_minutes": 480, "unplanned_item_confidence": "low", "allow_range": true },
              "estimate_resolution": { "automatic_source_order": ["historical", "ai", "default"], "manual_resolution": "final_override", "preserve_history": true },
              "execution_calibration": { "initial_factor": 1.0, "prior_equivalent_samples": 10, "automatic_adjustment": false },
              "urgency_thresholds": { "on_track_max_pressure_ratio": 1.1, "at_risk_max_pressure_ratio": 1.5 },
              "display": { "project_day_rounding": "ceiling", "item_unit": "hour" }
            }
            """);
    }

    private static void WriteEstimates(string folder, params (string ItemId, int Minutes)[] rows) =>
        File.WriteAllText(
            Path.Combine(folder, "time.estimates.json"),
            $$"""
            {
              "schema_version": "0.2",
              "scope_id": "time-fixture",
              "updated_at": "2026-08-28T12:00:00+08:00",
              "estimates": [{{string.Join(",", rows.Select((row, index) =>
                  $$"""{"estimate_id":"e{{index}}","task_id":"t1","item_id":"{{row.ItemId}}","active":true,"contributors":[{"kind":"human_estimate"}],"likely_minutes":{{row.Minutes}},"confidence":"medium","human_confirmed":true,"estimated_at":"2026-08-28T12:00:00+08:00"}"""))}}]
            }
            """);

    private static System.Text.Json.JsonDocument ReadAnalysis(string folder) =>
        System.Text.Json.JsonDocument.Parse(
            File.ReadAllText(Path.Combine(folder, "time.analysis.json")));

    private static long Long(System.Text.Json.JsonDocument document, string container, string property) =>
        document.RootElement.GetProperty(container).GetProperty(property).GetInt64();

    private static void Equal<T>(T expected, T actual, string message)
    {
        if (!EqualityComparer<T>.Default.Equals(expected, actual))
        {
            throw new InvalidOperationException($"{message}: expected {expected}, actual {actual}");
        }
    }

    private static void False(bool value, string message)
    {
        if (value) throw new InvalidOperationException(message);
    }

    private static void True(bool value, string message)
    {
        if (!value) throw new InvalidOperationException(message);
    }
}
