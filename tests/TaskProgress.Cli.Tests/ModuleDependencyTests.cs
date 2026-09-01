// Pure tests for the module dependency contract: no folders, no files, no
// generators. Every module here is a stub whose only real property is what it
// declares it reads.
//
// Two of these are load-bearing beyond the algorithm itself.
//
// The production-order test asserts that today's registration produces exactly
// today's order. No module declares a dependency yet, so ordering must be a
// no-op until one does; if it is not, this change altered behaviour it claimed
// to preserve.
//
// The cycle tests assert membership, not leftovers. A module downstream of a
// cycle is not in the cycle, and the soft-dependency rule says it still runs —
// disabling it too would be the quiet over-reach this contract exists to stop.

using TaskProgress;

internal static class ModuleDependencyTests
{
    public static void Run()
    {
        TodaysRegistrationOrderIsUnchanged();
        DependenciesRunBeforeTheModulesThatReadThem();
        AnAbsentUpstreamIsIgnoredAndReported();
        ACycleDisablesOnlyItsOwnMembers();
        ACycleIsReportedAsAWalkablePath();
        ASelfDependencyIsACycle();
        DuplicateTypesAreRejected();
    }

    private static void TodaysRegistrationOrderIsUnchanged()
    {
        var plan = ModuleDependencyGraph.Plan(AnalysisModules.Production);

        Equal(
            string.Join(",", AnalysisModules.Production.Select(module => module.Type)),
            string.Join(",", plan.Order.Select(module => module.Type)),
            "Ordering changed the production run order while no module declares a dependency");
        Equal(0, plan.Cycles.Count, "Production modules reported a cycle");
        Equal(0, plan.IgnoredDependencies.Count, "Production modules reported an ignored dependency");
    }

    private static void DependenciesRunBeforeTheModulesThatReadThem()
    {
        var plan = ModuleDependencyGraph.Plan(
        [
            new StubModule("settlement", "labor", "time"),
            new StubModule("labor"),
            new StubModule("time"),
        ]);

        var order = plan.Order.Select(module => module.Type).ToList();
        Equal(3, order.Count, "A module was dropped from an acyclic plan");
        True(
            order.IndexOf("labor") < order.IndexOf("settlement")
                && order.IndexOf("time") < order.IndexOf("settlement"),
            $"A module ran before something it reads: {string.Join(" → ", order)}");
    }

    private static void AnAbsentUpstreamIsIgnoredAndReported()
    {
        var plan = ModuleDependencyGraph.Plan(
        [
            new StubModule("cost", "material"),
        ]);

        Equal(1, plan.Order.Count, "A module with a missing upstream was dropped instead of run");
        Equal(0, plan.Cycles.Count, "A missing upstream was treated as a cycle");
        Equal(1, plan.IgnoredDependencies.Count, "A missing upstream was absorbed silently");

        var ignored = plan.IgnoredDependencies[0];
        Equal("cost", ignored.ModuleType, "Ignored dependency named the wrong module");
        Equal("material", ignored.DependsOnType, "Ignored dependency named the wrong upstream");
        Equal(
            IgnoredDependencyReason.NotRegistered,
            ignored.Reason,
            "A missing upstream was reported with the wrong reason");
    }

    private static void ACycleDisablesOnlyItsOwnMembers()
    {
        var plan = ModuleDependencyGraph.Plan(
        [
            new StubModule("cost", "material"),
            new StubModule("material", "cost"),
            new StubModule("downstream", "cost"),
            new StubModule("unrelated"),
        ]);

        var order = plan.Order.Select(module => module.Type).ToHashSet();
        False(order.Contains("cost"), "A module inside a cycle still ran");
        False(order.Contains("material"), "A module inside a cycle still ran");
        True(order.Contains("unrelated"), "An unrelated module was disabled by someone else's cycle");
        True(
            order.Contains("downstream"),
            "A module downstream of a cycle was disabled; the soft-dependency rule says it runs on less input");

        var disabledReport = plan.IgnoredDependencies
            .Single(entry => entry.ModuleType == "downstream");
        Equal(
            IgnoredDependencyReason.DisabledByCycle,
            disabledReport.Reason,
            "A downstream module was not told its upstream is disabled by a cycle");
    }

    private static void ACycleIsReportedAsAWalkablePath()
    {
        var plan = ModuleDependencyGraph.Plan(
        [
            new StubModule("cost", "material"),
            new StubModule("material", "cost"),
        ]);

        Equal(1, plan.Cycles.Count, "A two-module cycle was not reported as one cycle");
        var path = plan.Cycles[0].Path;
        Equal(
            path[0],
            path[^1],
            $"A cycle path did not close on itself: {plan.Cycles[0]}");
        Equal(3, path.Count, $"A two-module cycle should print as A → B → A, got {plan.Cycles[0]}");
        True(
            plan.Cycles[0].ToString().Contains("→", StringComparison.Ordinal),
            "A cycle did not render its edges, so a diagnostic could not name them");
    }

    private static void ASelfDependencyIsACycle()
    {
        var plan = ModuleDependencyGraph.Plan([new StubModule("loop", "loop")]);

        Equal(1, plan.Cycles.Count, "A module depending on itself was not detected as a cycle");
        Equal(0, plan.Order.Count, "A self-dependent module still ran");
        Contains(plan.DisabledTypes, "loop");
    }

    private static void DuplicateTypesAreRejected()
    {
        Throws(
            () => ModuleDependencyGraph.Plan([new StubModule("time"), new StubModule("time")]),
            "Two modules with the same type were accepted");
    }

    private sealed class StubModule(string type, params string[] dependsOn) : IAnalysisModule
    {
        public string Type => type;
        public IReadOnlyList<string> DependsOn => dependsOn;
        public string DisplayName => type;
        public bool HasInputs(string folderPath) => false;

        public AnalysisRunResult? Generate(
            string folderPath,
            DateTimeOffset? asOf = null,
            string? outputPath = null) => null;
    }

    private static void Contains(IReadOnlyList<string> values, string expected)
    {
        if (!values.Contains(expected, StringComparer.Ordinal))
        {
            throw new InvalidOperationException(
                $"Expected '{expected}' among [{string.Join(", ", values)}]");
        }
    }

    private static void Throws(Action action, string message)
    {
        try
        {
            action();
        }
        catch (CliException)
        {
            return;
        }
        throw new InvalidOperationException(message);
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
        if (value)
        {
            throw new InvalidOperationException(message);
        }
    }

    private static void True(bool value, string message)
    {
        if (!value)
        {
            throw new InvalidOperationException(message);
        }
    }
}
