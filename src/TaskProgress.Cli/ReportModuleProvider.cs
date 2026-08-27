// The provider-facing half of the Launcher's module boundary.
//
// Today the Launcher knows every sidecar by name twice: ReportFolder carries a
// field per file, and LocalWebServiceClient builds a URL per file. Adding a
// pure data module therefore means editing both. A provider instead declares
// which file names it owns inside one authorized report folder, and the
// registry turns that declaration into routes.
//
// One deliberate departure from the sketch in
// Documentation/ExtensionModuleArchitecturePlan.md: providers do not build
// routes. `/reports/{scope}/{file}` is one URL policy, and a provider that
// built its own would be a second copy of it. The registry owns route
// construction; providers name files and vouch for their contents.

namespace TaskProgress;

/// <summary>
///   The one authorized report folder a provider may look inside, with the
///   identity every artifact in it must belong to. The identity comes from
///   report.json, which is read and validated before this exists.
/// </summary>
internal sealed record ReportModuleContext(
    string DirectoryPath,
    string Scope,
    string ReportId,
    string SchemaVersion);

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
    ///
    ///   Context-free on purpose: this is also the answer to "could this URL
    ///   ever have been ours?", which route cleanup asks without a report in
    ///   hand. A provider whose file names really depend on the report can
    ///   take a context when one exists.
    /// </summary>
    IReadOnlyList<ReportModuleArtifact> Declare();

    /// <summary>
    ///   Confirms a present file really belongs to this report, throwing
    ///   <see cref="CliException"/> when it does not. The default does
    ///   nothing, which is the honest answer for most modules: an analysis
    ///   projection carries no identity contract of its own yet, so there is
    ///   nothing to check and inventing one here would reject valid files.
    /// </summary>
    void Validate(ReportModuleContext context, ReportModuleArtifact artifact, string filePath)
    {
    }
}
