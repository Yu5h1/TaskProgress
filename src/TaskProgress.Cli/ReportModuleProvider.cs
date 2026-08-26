// The provider-facing half of the Launcher's module boundary.
//
// Today the Launcher knows every sidecar by name twice: ReportFolder carries a
// field per file, and LocalWebServiceClient builds a URL per file. Adding a
// pure data module therefore means editing both. A provider instead declares
// which file names it owns inside one authorized report folder, and the
// registry turns that declaration into routes.
//
// Two deliberate departures from the sketch in
// Documentation/ExtensionModuleArchitecturePlan.md:
//
//   - Providers do not build routes. `/reports/{scope}/{file}` is one URL
//     policy, and a provider that built its own would be a second copy of it.
//     The registry owns route construction; providers name files.
//   - Identity validation is not on this interface yet. The only identity
//     rules that exist belong to report.dev.json and report.modules.json,
//     which ReportFolder still enforces. Folding those in is part of the
//     production cutover, not of declaring the boundary.

namespace TaskProgress;

/// <summary>
///   The one authorized report folder a provider may look inside, with the
///   identity every artifact in it must belong to.
/// </summary>
internal sealed record ReportModuleContext(
    string DirectoryPath,
    string Scope,
    string ReportId);

/// <summary>
///   One file a provider claims. <paramref name="FileName"/> must be a plain
///   file name directly inside the report folder; the registry rejects
///   anything else rather than resolving it.
/// </summary>
internal sealed record ReportModuleArtifact(string ModuleType, string FileName);

/// <summary>
///   Discovers the files one module contributes to a report folder.
///   Implementations declare names only — existence, path safety, conflicts
///   and routing are the registry's to decide, so that every provider gets
///   the same answers.
/// </summary>
internal interface IReportModuleProvider
{
    /// <summary>Module type this provider speaks for, unique per registry.</summary>
    string Type { get; }

    /// <summary>
    ///   Every file name this provider may contribute, whether or not it is
    ///   present. Naming an absent file is what lets the registry retire a
    ///   route after the file is deleted.
    /// </summary>
    IReadOnlyList<ReportModuleArtifact> Declare(ReportModuleContext context);
}
