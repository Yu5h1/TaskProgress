// The two providers that reproduce what the Launcher serves today.
//
// Together they declare exactly the four files LocalWebServiceClient names by
// hand, which is what makes them a drop-in replacement rather than a parallel
// scheme: core report files that every report has, and Time's analysis
// sidecar that only reports using Time have.
//
// Time is here as a provider, not as a special case in the core one, because
// that is the whole point of the boundary — Cost will be a sibling of
// TimeReportModuleProvider, added to the registry list and nowhere else.

namespace TaskProgress;

/// <summary>
///   The report files that are not a module's: the report itself, its optional
///   developer overlay, and the optional module manifest. These belong to the
///   report format rather than to any module, so no module may claim them.
/// </summary>
internal sealed class CoreReportModuleProvider : IReportModuleProvider
{
    public const string ModuleType = "taskprogress.core";

    public string Type => ModuleType;

    public IReadOnlyList<ReportModuleArtifact> Declare(ReportModuleContext context) =>
    [
        new(ModuleType, "report.json"),
        new(ModuleType, "report.dev.json"),
        new(ModuleType, "report.modules.json"),
    ];
}

/// <summary>
///   Time's published projection. Its inputs (time.config.json,
///   time.estimates.json, time.events.json) are deliberately absent: they feed
///   the analyzer locally and are not served to a reader.
/// </summary>
internal sealed class TimeReportModuleProvider : IReportModuleProvider
{
    public const string ModuleType = "taskprogress.time";

    public string Type => ModuleType;

    public IReadOnlyList<ReportModuleArtifact> Declare(ReportModuleContext context) =>
    [
        new(ModuleType, "time.analysis.json"),
    ];
}
