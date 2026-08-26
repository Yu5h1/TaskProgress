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
///   Outcome of one module's regeneration, in terms every module can report.
///   <paramref name="Summary"/> is the module's own one-line result, already
///   worded for the console.
/// </summary>
internal sealed record AnalysisRunResult(string ModuleType, string OutputPath, string Summary);

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
    ///   Whether this folder carries the inputs this module recomputes from.
    ///   False means "nothing to do", which is why a report without the module
    ///   stays untouched.
    /// </summary>
    bool HasInputs(string folderPath);

    /// <summary>
    ///   Regenerates the projection. Callers guard this with
    ///   <see cref="HasInputs"/>; calling it without inputs is a programming
    ///   error, not a supported no-op.
    /// </summary>
    AnalysisRunResult Generate(string folderPath, DateTimeOffset? asOf = null);
}

/// <summary>
///   Time as the first analysis module. Delegates to TimeAnalysisGenerator so
///   the deterministic capacity/feasibility algorithm keeps one owner.
/// </summary>
internal sealed class TimeAnalysisModule : IAnalysisModule
{
    public string Type => TimeReportModuleProvider.ModuleType;

    public bool HasInputs(string folderPath) => TimeAnalysisGenerator.HasInputs(folderPath);

    public AnalysisRunResult Generate(string folderPath, DateTimeOffset? asOf = null)
    {
        var result = TimeAnalysisGenerator.Generate(folderPath, asOf);
        return new AnalysisRunResult(
            Type,
            result.OutputPath,
            $"時間分析已更新：{result.TotalEstimatedMinutes} 分鐘，"
                + (result.DeadlineIncluded ? "含期限風險" : "交付日未定"));
    }
}
