// Turns the modules' own dependency declarations into a run order.
//
// Today TryAutoGenerate walks AnalysisModules.Production in array order, and
// that order carries no meaning because no module reads another's output. The
// trap is that it would start carrying meaning silently: the first module that
// reads an upstream projection makes list position the contract, and nothing
// would fail if someone reordered the list. Ordering from declarations closes
// that before it can happen.
//
// Design: Documentation/ExtensionModuleArchitecturePlan.md#模組依賴與重算.
// Three rules from it shape this file.
//
// Dependencies are soft — a declared upstream that is not registered is
// ignored, never an error. That is also the failure isolation rule: a module
// whose upstream is gone still runs, on less input.
//
// A cycle disables every module inside it and nothing else. Breaking the cycle
// by dropping one edge is forbidden even though soft dependencies make it
// possible: dropping A→B or B→A yields different numbers with nothing on
// screen to say which was dropped.
//
// Every ignored dependency is reported rather than silently absorbed, because
// a module that ran without an upstream produced a number that means something
// different from the same number computed with it.

namespace TaskProgress;

/// <summary>
///   Why a declared dependency did not participate in this run.
/// </summary>
internal enum IgnoredDependencyReason
{
    /// <summary>The upstream type is not registered in this run.</summary>
    NotRegistered,

    /// <summary>The upstream is registered but disabled by a dependency cycle.</summary>
    DisabledByCycle,
}

/// <summary>
///   One declared dependency that did not participate, named precisely enough
///   for a user-visible message to say whose value is missing.
/// </summary>
internal sealed record IgnoredDependency(
    string ModuleType,
    string DependsOnType,
    IgnoredDependencyReason Reason);

/// <summary>
///   One dependency cycle, as a walkable path whose first and last element are
///   the same type. Diagnostics must print the path: a cycle is a configuration
///   mistake, and "load failed" does not tell anyone which edge to remove.
/// </summary>
internal sealed record ModuleCycle(IReadOnlyList<string> Path)
{
    public override string ToString() => string.Join(" → ", Path);
}

/// <summary>
///   What to run, in what order, and what was left out of this run.
/// </summary>
internal sealed record ModuleDependencyPlan(
    IReadOnlyList<IAnalysisModule> Order,
    IReadOnlyList<ModuleCycle> Cycles,
    IReadOnlyList<string> DisabledTypes,
    IReadOnlyList<IgnoredDependency> IgnoredDependencies);

/// <summary>
///   Orders analysis modules so every module runs after the ones it declares
///   it reads.
/// </summary>
internal static class ModuleDependencyGraph
{
    /// <summary>
    ///   Plans one run. Modules in a cycle are excluded and reported; every
    ///   other module is ordered so its registered, enabled dependencies come
    ///   first. Declared dependencies that are absent or disabled are reported
    ///   rather than treated as failures.
    /// </summary>
    internal static ModuleDependencyPlan Plan(IReadOnlyList<IAnalysisModule> modules)
    {
        if (modules is null) throw new ArgumentNullException(nameof(modules));

        var byType = new Dictionary<string, IAnalysisModule>(StringComparer.Ordinal);
        foreach (var module in modules)
        {
            if (!byType.TryAdd(module.Type, module))
            {
                throw new CliException($"分析模組 type「{module.Type}」重複註冊。 ");
            }
        }

        var edges = byType.ToDictionary(
            entry => entry.Key,
            entry => entry.Value.DependsOn
                .Where(byType.ContainsKey)
                .Distinct(StringComparer.Ordinal)
                .ToArray(),
            StringComparer.Ordinal);

        var cycles = FindCycles(edges);
        var disabled = cycles
            .SelectMany(cycle => cycle.Path)
            .ToHashSet(StringComparer.Ordinal);

        var ignored = new List<IgnoredDependency>();
        foreach (var module in modules)
        {
            if (disabled.Contains(module.Type)) continue;
            foreach (var dependency in module.DependsOn.Distinct(StringComparer.Ordinal))
            {
                if (!byType.ContainsKey(dependency))
                {
                    ignored.Add(new IgnoredDependency(
                        module.Type, dependency, IgnoredDependencyReason.NotRegistered));
                }
                else if (disabled.Contains(dependency))
                {
                    ignored.Add(new IgnoredDependency(
                        module.Type, dependency, IgnoredDependencyReason.DisabledByCycle));
                }
            }
        }

        var order = TopologicalOrder(modules, byType, edges, disabled);
        return new ModuleDependencyPlan(
            order,
            cycles,
            [.. disabled.OrderBy(type => type, StringComparer.Ordinal)],
            ignored);
    }

    /// <summary>
    ///   Kahn's algorithm over the enabled subgraph. Ties are broken by the
    ///   caller's registration order so a run with no dependencies at all
    ///   keeps producing exactly the order it produces today.
    /// </summary>
    private static IReadOnlyList<IAnalysisModule> TopologicalOrder(
        IReadOnlyList<IAnalysisModule> modules,
        IReadOnlyDictionary<string, IAnalysisModule> byType,
        IReadOnlyDictionary<string, string[]> edges,
        IReadOnlySet<string> disabled)
    {
        var remaining = modules
            .Where(module => !disabled.Contains(module.Type))
            .ToList();
        var pending = remaining.ToDictionary(
            module => module.Type,
            module => edges[module.Type].Where(type => !disabled.Contains(type)).ToHashSet(StringComparer.Ordinal),
            StringComparer.Ordinal);

        var ordered = new List<IAnalysisModule>(remaining.Count);
        var emitted = new HashSet<string>(StringComparer.Ordinal);
        while (ordered.Count < remaining.Count)
        {
            var next = remaining.FirstOrDefault(module =>
                !emitted.Contains(module.Type) && pending[module.Type].All(emitted.Contains));
            if (next is null) break;

            ordered.Add(next);
            emitted.Add(next.Type);
        }

        return ordered;
    }

    /// <summary>
    ///   Finds every dependency cycle using Tarjan's strongly connected
    ///   components. Membership is what matters, not just "what is left over"
    ///   after ordering: a module downstream of a cycle is not itself in the
    ///   cycle, and by the soft-dependency rule it still runs.
    /// </summary>
    private static IReadOnlyList<ModuleCycle> FindCycles(
        IReadOnlyDictionary<string, string[]> edges)
    {
        var index = new Dictionary<string, int>(StringComparer.Ordinal);
        var lowLink = new Dictionary<string, int>(StringComparer.Ordinal);
        var onStack = new HashSet<string>(StringComparer.Ordinal);
        var stack = new Stack<string>();
        var components = new List<List<string>>();
        var next = 0;

        void StrongConnect(string node)
        {
            index[node] = next;
            lowLink[node] = next;
            next++;
            stack.Push(node);
            onStack.Add(node);

            foreach (var successor in edges[node])
            {
                if (!index.ContainsKey(successor))
                {
                    StrongConnect(successor);
                    lowLink[node] = Math.Min(lowLink[node], lowLink[successor]);
                }
                else if (onStack.Contains(successor))
                {
                    lowLink[node] = Math.Min(lowLink[node], index[successor]);
                }
            }

            if (lowLink[node] != index[node]) return;

            var component = new List<string>();
            string member;
            do
            {
                member = stack.Pop();
                onStack.Remove(member);
                component.Add(member);
            }
            while (!string.Equals(member, node, StringComparison.Ordinal));
            components.Add(component);
        }

        foreach (var node in edges.Keys.OrderBy(type => type, StringComparer.Ordinal))
        {
            if (!index.ContainsKey(node)) StrongConnect(node);
        }

        var cycles = new List<ModuleCycle>();
        foreach (var component in components)
        {
            var isCycle = component.Count > 1
                || edges[component[0]].Contains(component[0], StringComparer.Ordinal);
            if (!isCycle) continue;

            cycles.Add(new ModuleCycle(BuildCyclePath(component, edges)));
        }

        return cycles;
    }

    /// <summary>
    ///   Walks one closed path through a strongly connected component so the
    ///   diagnostic can name the edges rather than only the members.
    /// </summary>
    private static IReadOnlyList<string> BuildCyclePath(
        IReadOnlyList<string> component,
        IReadOnlyDictionary<string, string[]> edges)
    {
        var members = component.ToHashSet(StringComparer.Ordinal);
        var start = component.OrderBy(type => type, StringComparer.Ordinal).First();
        var path = new List<string> { start };
        var visited = new HashSet<string>(StringComparer.Ordinal) { start };
        var current = start;

        while (true)
        {
            var successor = edges[current]
                .Where(members.Contains)
                .OrderBy(type => type, StringComparer.Ordinal)
                .FirstOrDefault(type => string.Equals(type, start, StringComparison.Ordinal)
                    || !visited.Contains(type));
            if (successor is null) break;

            path.Add(successor);
            if (string.Equals(successor, start, StringComparison.Ordinal)) break;
            visited.Add(successor);
            current = successor;
        }

        return path;
    }
}
