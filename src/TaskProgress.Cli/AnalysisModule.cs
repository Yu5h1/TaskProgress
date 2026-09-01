// The recomputation half of the Launcher's module boundary.
//
// An analysis module is not required of every report module. An external tool
// may write a valid projection directly, and TaskProgress then only reads it;
// this interface is for the built-in domains the CLI recomputes itself, which
// today means Time alone.
//
// TimeAnalysisModule wraps TimeAnalysisGenerator without touching its
// algorithm or its input files, exactly as the architecture plan asks. The
// wrapper exists so `analyze`, `open` and `start` can drive "does this folder
// have inputs, and if so regenerate" without naming Time, not to change what
// generation does.

namespace TaskProgress;

/// <summary>
///   The analysis modules the Launcher recomputes with, in the order it runs
///   them. Adding a recomputed domain is an entry here and nowhere else.
/// </summary>
internal static class AnalysisModules
{
    public static readonly IReadOnlyList<IAnalysisModule> Production =
    [
        new TimeAnalysisModule(),
        new CostAnalysisModule(),
    ];
}

/// <summary>
///   Outcome of one module's regeneration, in terms every module can report.
///   <paramref name="Summary"/> is the one-line form the automatic refresh
///   prints; <paramref name="Details"/> is what an explicit `analyze` prints.
///   Both are worded by the module, because only it knows what its numbers
///   mean.
/// </summary>
internal sealed record AnalysisRunResult(
    string ModuleType,
    string OutputPath,
    string Summary,
    IReadOnlyList<string> Details);

/// <summary>
///   Recomputes one module's published projection from inputs inside a report
///   folder. Implementations must treat a folder with no inputs as a normal
///   answer, never as an error, and must not create data for a report that
///   never had any.
/// </summary>
internal interface IAnalysisModule
{
    /// <summary>Module type this analyzer produces for, matching its provider.</summary>
    string Type { get; }

    /// <summary>
    ///   Module types whose published output this module reads, declared by
    ///   the module itself rather than by any manifest: a module that cannot
    ///   state its own inputs is not separable.
    ///
    ///   These are types, never instance ids. A soft dependency breaks
    ///   silently, so an id that gets renamed would take the edge with it and
    ///   leave no symptom beyond a number that is quietly short.
    ///
    ///   Empty by default, which is the honest answer for every module that
    ///   reads only its own private inputs.
    /// </summary>
    IReadOnlyList<string> DependsOn => [];

    /// <summary>
    ///   What to call this module when reporting that its run failed. The
    ///   module owns the wording because it also owns the wording of its
    ///   success line.
    /// </summary>
    string DisplayName { get; }

    /// <summary>
    ///   Whether this folder carries the inputs this module recomputes from.
    ///   False means "nothing to do", which is why a report without the module
    ///   stays untouched.
    /// </summary>
    bool HasInputs(string folderPath);

    /// <summary>
    ///   Regenerates the projection, or returns null when this module has
    ///   nothing to produce for this report. Null rather than an exception,
    ///   because "this report does not use me" is a normal answer to an
    ///   explicit `analyze` that names no module.
    /// </summary>
    AnalysisRunResult? Generate(
        string folderPath,
        DateTimeOffset? asOf = null,
        string? outputPath = null);
}

/// <summary>
///   Time as the first analysis module. Delegates to TimeAnalysisGenerator so
///   the deterministic capacity/feasibility algorithm keeps one owner.
/// </summary>
internal sealed class TimeAnalysisModule : IAnalysisModule
{
    public string Type => TimeReportModuleProvider.ModuleType;

    public string DisplayName => "時間分析";

    public bool HasInputs(string folderPath) => TimeAnalysisGenerator.HasInputs(folderPath);

    /// <summary>
    ///   Time produces even with no private inputs: report.json plus its
    ///   estimate defaults are enough, which is why reports/example carries a
    ///   time.analysis.json and no time.config.json. Never returns null.
    /// </summary>
    public AnalysisRunResult Generate(
        string folderPath,
        DateTimeOffset? asOf = null,
        string? outputPath = null)
    {
        var result = TimeAnalysisGenerator.Generate(folderPath, asOf, outputPath);
        return new AnalysisRunResult(
            Type,
            result.OutputPath,
            $"時間分析已更新：{result.TotalEstimatedMinutes} 分鐘，"
                + (result.DeadlineIncluded ? "含期限風險" : "交付日未定"),
            [
                $"已產生：{result.OutputPath}",
                $"工程估算：{result.TotalEstimatedMinutes} 分鐘",
                $"分析範圍：{result.TaskCount} 個 task，{result.ItemCount} 個穩定 item",
                result.DeadlineIncluded ? "期限分析：已產生" : "期限分析：交付日未定",
                $"診斷：{result.DiagnosticCount} 項",
            ]);
    }
}

/// <summary>
///   Cost as the second analysis module. Its presence here is the whole test
///   of the Phase 3 boundary: adding a recomputed domain is one entry in this
///   list and one in ReportModuleProviders.Production, and nothing else.
/// </summary>
internal sealed class CostAnalysisModule : IAnalysisModule
{
    public string Type => CostReportModuleProvider.ModuleType;

    public string DisplayName => "成本分析";

    public bool HasInputs(string folderPath) => CostEstimationGenerator.HasInputs(folderPath);

    /// <summary>
    ///   Returns null for a report with no Cost inputs. Cost has no defaults
    ///   to fall back on, and writing an empty projection would put a $0 total
    ///   on a report that never costed anything.
    /// </summary>
    public AnalysisRunResult? Generate(
        string folderPath,
        DateTimeOffset? asOf = null,
        string? outputPath = null)
    {
        if (!CostEstimationGenerator.HasInputs(folderPath)) return null;
        var result = CostEstimationGenerator.Generate(folderPath, asOf, outputPath);
        return new AnalysisRunResult(
            Type,
            result.OutputPath,
            $"成本分析已更新：{result.EstimatedItemCount} 個子項，coverage {result.Coverage}",
            [
                $"已產生：{result.OutputPath}",
                $"估算總額：{result.TotalEstimatedMinorUnits} 最小貨幣單位",
                $"分析範圍：{result.TaskCount} 個 task，{result.EstimatedItemCount} 個已估算子項",
                $"涵蓋率：{result.Coverage}；資源風險：{result.Urgency}",
                $"診斷：{result.DiagnosticCount} 項",
            ]);
    }
}
