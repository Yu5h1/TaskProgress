// Cost's rollup, and the one rule the whole module is shaped around: an item
// with no active estimate is excluded and makes its level partial.
//
// Cost exists first as the second real case for the shared assessment rules,
// so most of what is asserted here is not about money — it is about whether
// those rules survive a module whose unit is not minutes. If a test here reads
// like a Time test with different numbers, that is the point.

using TaskProgress;

internal static class CostEstimationTests
{
    public static void Run()
    {
        var root = Path.Combine(
            Path.GetTempPath(),
            $"task-progress-cost-{Guid.NewGuid():N}");
        Directory.CreateDirectory(root);
        try
        {
            UnestimatedItemsAreExcludedRatherThanZeroed(root);
            FinishedItemsLeaveTheRemainingTotal(root);
            ASecondActiveEstimateIsDiagnosedNotAdded(root);
            AnEstimateForAnUnknownItemIsDiagnosedNotCounted(root);
            PartialCoverageRefusesToClaimOnTrack(root);
            FullCoverageComparesMoneyWithMoney(root);
            NoInputsMeansNothingToDo(root);
            CostIsRegisteredInBothProductionLists();
            AnalyzeAsksEveryModuleAndTakesNullForAnAnswer(root);
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
    ///   The rule that stops a total looking complete while resting on
    ///   nothing. Two of four items are estimated: the total is the two, and
    ///   the level says so.
    /// </summary>
    private static void UnestimatedItemsAreExcludedRatherThanZeroed(string root)
    {
        var folder = NewReport(root, "partial", pending: ["a", "b", "c"], done: ["d"]);
        WriteEstimates(folder, ("a", 150000), ("d", 300000));

        var result = CostEstimationGenerator.Generate(folder, When);
        var analysis = ReadAnalysis(folder);

        Equal(450000L, Long(analysis, "summary", "total_estimated_minor_units"), "Unestimated items changed the total");
        Equal(2, result.EstimatedItemCount, "Estimated item count did not match the estimates written");
        Equal("partial", result.Coverage, "Two of four estimated items did not read as partial");
    }

    private static void FinishedItemsLeaveTheRemainingTotal(string root)
    {
        var folder = NewReport(root, "remaining", pending: ["a"], done: ["b"]);
        WriteEstimates(folder, ("a", 100000), ("b", 700000));

        CostEstimationGenerator.Generate(folder, When);
        var analysis = ReadAnalysis(folder);

        Equal(800000L, Long(analysis, "summary", "total_estimated_minor_units"), "A finished item left the overall total");
        Equal(100000L, Long(analysis, "summary", "remaining_estimated_minor_units"), "A finished item stayed in the remaining total");
    }

    private static void ASecondActiveEstimateIsDiagnosedNotAdded(string root)
    {
        var folder = NewReport(root, "duplicate", pending: ["a"], done: []);
        WriteEstimates(folder, ("a", 100000), ("a", 900000));

        var result = CostEstimationGenerator.Generate(folder, When);
        var analysis = ReadAnalysis(folder);

        Equal(100000L, Long(analysis, "summary", "total_estimated_minor_units"), "A duplicate active estimate was added twice");
        True(result.DiagnosticCount > 0, "A duplicate active estimate was accepted silently");
    }

    private static void AnEstimateForAnUnknownItemIsDiagnosedNotCounted(string root)
    {
        var folder = NewReport(root, "orphan", pending: ["a"], done: []);
        WriteEstimates(folder, ("a", 100000), ("ghost", 500000));

        var result = CostEstimationGenerator.Generate(folder, When);
        var analysis = ReadAnalysis(folder);

        Equal(100000L, Long(analysis, "summary", "total_estimated_minor_units"), "An estimate for an unknown item was counted");
        True(result.DiagnosticCount > 0, "An estimate for an unknown item was accepted silently");
    }

    /// <summary>
    ///   Incomplete coverage means the balance is not trustworthy, so the
    ///   module declines to call it on track rather than reassuring a reader
    ///   with a number it knows is short.
    /// </summary>
    private static void PartialCoverageRefusesToClaimOnTrack(string root)
    {
        var folder = NewReport(root, "unknown-urgency", pending: ["a", "b"], done: []);
        WriteEstimates(folder, ("a", 1000));
        WriteConfig(folder, available: 10000000);

        var result = CostEstimationGenerator.Generate(folder, When);

        Equal("unknown", result.Urgency, "Partial coverage claimed a trustworthy urgency");
    }

    private static void FullCoverageComparesMoneyWithMoney(string root)
    {
        var folder = NewReport(root, "urgency", pending: ["a"], done: []);
        WriteEstimates(folder, ("a", 800000));

        WriteConfig(folder, available: 2000000);
        Equal("on_track", CostEstimationGenerator.Generate(folder, When).Urgency, "A comfortable budget was not on track");

        WriteConfig(folder, available: 900000);
        Equal("at_risk", CostEstimationGenerator.Generate(folder, When).Urgency, "A budget within the threshold was not at risk");

        WriteConfig(folder, available: 500000);
        Equal("critical", CostEstimationGenerator.Generate(folder, When).Urgency, "A budget short of the remaining cost was not critical");
    }

    private static void NoInputsMeansNothingToDo(string root)
    {
        var folder = NewReport(root, "no-inputs", pending: ["a"], done: []);

        False(CostEstimationGenerator.HasInputs(folder), "A folder with no Cost inputs claimed to have some");
        False(
            File.Exists(Path.Combine(folder, CostEstimationGenerator.AnalysisFileName)),
            "Cost output existed for a report that never used Cost");
    }

    /// <summary>
    ///   The Phase 3 boundary's whole claim: adding a module is one entry in
    ///   each production list, with no edit to ReportFolder,
    ///   LocalWebServiceClient, Program or ScopeCatalog.
    /// </summary>
    private static void CostIsRegisteredInBothProductionLists()
    {
        True(
            ReportModuleProviders.Production.Any(p => p.Type == CostReportModuleProvider.ModuleType),
            "Cost is not registered as a report module provider");
        True(
            AnalysisModules.Production.Any(m => m.Type == CostReportModuleProvider.ModuleType),
            "Cost is not registered as an analysis module");

        var cli = Path.Combine(RepositoryRoot(), "src", "TaskProgress.Cli");
        foreach (var name in new[] { "ReportFolder.cs", "LocalWebServiceClient.cs", "Program.cs", "ScopeCatalog.cs" })
        {
            if (File.ReadAllText(Path.Combine(cli, name)).Contains("Cost", StringComparison.Ordinal))
            {
                throw new InvalidOperationException(
                    $"{name} names Cost; adding a module must not reach the core path.");
            }
        }
    }

    /// <summary>
    ///   `analyze` does not gate on HasInputs — the reader asked for it — so a
    ///   module with nothing to say answers null instead of writing an empty
    ///   projection. Time is the opposite case and must keep producing from
    ///   report.json alone, which is why reports/example carries a
    ///   time.analysis.json and no time.config.json.
    /// </summary>
    private static void AnalyzeAsksEveryModuleAndTakesNullForAnAnswer(string root)
    {
        var folder = NewReport(root, "analyze-null", pending: ["a"], done: []);

        foreach (var module in AnalysisModules.Production)
        {
            var result = module.Generate(folder, When);
            if (module.Type == CostReportModuleProvider.ModuleType)
            {
                Equal<object?>(null, result, "Cost wrote a projection for a report that never costed anything");
                continue;
            }

            True(result is not null, $"{module.DisplayName} produced nothing for a report it can analyze");
            True(result!.Details.Count > 0, $"{module.DisplayName} produced no detail lines for analyze");
        }
    }

    private static readonly DateTimeOffset When = DateTimeOffset.Parse("2026-08-26T12:00:00+08:00");

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
              "report_id": "cost-fixture",
              "scope_id": "cost-fixture",
              "title": "Cost fixture",
              "updated_at": "2026-08-26T12:00:00+08:00",
              "tasks": [
                { "id": "t1", "title": "t1", "status": "planned", "priority": 2{{Items("pending_items", pending)}}{{Items("completed_items", done)}} }
              ]
            }
            """);
        return folder;
    }

    private static void WriteEstimates(string folder, params (string ItemId, long Amount)[] rows) =>
        File.WriteAllText(
            Path.Combine(folder, CostEstimationGenerator.EstimatesFileName),
            $$"""
            {
              "schema_version": "0.1",
              "scope_id": "cost-fixture",
              "updated_at": "2026-08-26T12:00:00+08:00",
              "estimates": [{{string.Join(",", rows.Select((row, index) =>
                  $$"""{"estimate_id":"e{{index}}","task_id":"t1","item_id":"{{row.ItemId}}","active":true,"contributors":["human"],"amount_minor_units":{{row.Amount}},"human_confirmed":true}"""))}}]
            }
            """);

    private static void WriteConfig(string folder, long available) =>
        File.WriteAllText(
            Path.Combine(folder, CostEstimationGenerator.ConfigFileName),
            $$"""
            {
              "schema_version": "0.1",
              "scope_id": "cost-fixture",
              "updated_at": "2026-08-26T12:00:00+08:00",
              "currency": "TWD",
              "currency_symbol": "$",
              "available_resource_minor_units": {{available}},
              "risk_thresholds": { "at_risk_remaining_ratio": 0.2 }
            }
            """);

    private static System.Text.Json.JsonDocument ReadAnalysis(string folder) =>
        System.Text.Json.JsonDocument.Parse(
            File.ReadAllText(Path.Combine(folder, CostEstimationGenerator.AnalysisFileName)));

    private static long Long(System.Text.Json.JsonDocument document, string container, string property) =>
        document.RootElement.GetProperty(container).GetProperty(property).GetInt64();

    private static string RepositoryRoot()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            if (File.Exists(Path.Combine(directory.FullName, "src", "TaskProgress.Cli", "ReportFolder.cs")))
            {
                return directory.FullName;
            }

            directory = directory.Parent;
        }

        throw new InvalidOperationException("Repository root was not found from the test output directory");
    }

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
