// The two providers that carry what the Launcher serves.
//
// Together they declare exactly the four files LocalWebServiceClient used to
// name by hand: core report files that every report has, and Time's analysis
// sidecar that only reports using Time have.
//
// Time is here as a provider, not as a special case in the core one, because
// that is the whole point of the boundary — Cost will be a sibling of
// TimeReportModuleProvider, added to Production and nowhere else.

using System.Text.Json;

namespace TaskProgress;

/// <summary>
///   The provider set the Launcher runs with.
/// </summary>
internal static class ReportModuleProviders
{
    public static readonly IReadOnlyList<IReportModuleProvider> Production =
    [
        new CoreReportModuleProvider(),
        new TimeReportModuleProvider(),
        new CostReportModuleProvider(),
    ];
}

/// <summary>
///   The report files that are not a module's: the report itself, its optional
///   developer overlay, and the optional module manifest. These belong to the
///   report format rather than to any module, so no module may claim them.
///   This provider also owns the rule that a sidecar must belong to the report
///   beside it, which is why a mismatched overlay fails the whole load rather
///   than being served to a reader.
/// </summary>
internal sealed class CoreReportModuleProvider : IReportModuleProvider
{
    public const string ModuleType = "taskprogress.core";
    public const string ReportFileName = "report.json";
    public const string DeveloperFileName = "report.dev.json";
    public const string ManifestFileName = "report.modules.json";

    private static readonly string[] SupportedManifestSchemaVersions = ["0.1"];

    public string Type => ModuleType;

    public IReadOnlyList<ReportModuleArtifact> Declare() =>
    [
        new(ModuleType, ReportFileName),
        new(ModuleType, DeveloperFileName),
        new(ModuleType, ManifestFileName),
    ];

    /// <summary>
    ///   report.json is skipped: it is the identity every other file is
    ///   checked against, and was already validated before this context
    ///   existed. Checking it against itself would prove nothing.
    /// </summary>
    public void Validate(ReportModuleContext context, ReportModuleArtifact artifact, string filePath)
    {
        switch (artifact.FileName)
        {
            case DeveloperFileName:
                ValidateDeveloper(context, filePath);
                break;
            case ManifestFileName:
                ValidateManifest(context, filePath);
                break;
        }
    }

    private static void ValidateDeveloper(ReportModuleContext context, string filePath)
    {
        using var document = ReadObject(filePath, DeveloperFileName);
        if (!string.Equals(
                RequiredString(document.RootElement, "schema_version", DeveloperFileName),
                context.SchemaVersion,
                StringComparison.Ordinal))
        {
            throw new CliException($"{DeveloperFileName} 的 schema_version 與 report.json 不相容。 ");
        }

        if (!string.Equals(
                RequiredString(document.RootElement, "report_id", DeveloperFileName),
                context.ReportId,
                StringComparison.Ordinal))
        {
            throw new CliException($"{DeveloperFileName} 的 report_id 與 report.json 不一致。 ");
        }
    }

    /// <summary>
    ///   The manifest carries its own schema_version line (0.1), independent of
    ///   report.json's (1.0/1.1). Checking it against the report's list would
    ///   reject every valid manifest.
    /// </summary>
    private static void ValidateManifest(ReportModuleContext context, string filePath)
    {
        using var document = ReadObject(filePath, ManifestFileName);
        var schemaVersion = RequiredString(document.RootElement, "schema_version", ManifestFileName);
        if (Array.IndexOf(SupportedManifestSchemaVersions, schemaVersion) < 0)
        {
            throw new CliException(
                $"{ManifestFileName} schema_version 必須是 {string.Join("、", SupportedManifestSchemaVersions)}，目前是 {schemaVersion}。");
        }

        if (!string.Equals(
                RequiredString(document.RootElement, "report_id", ManifestFileName),
                context.ReportId,
                StringComparison.Ordinal))
        {
            throw new CliException($"{ManifestFileName} 的 report_id 與 report.json 不一致。 ");
        }

        if (!string.Equals(
                RequiredString(document.RootElement, "scope_id", ManifestFileName),
                context.Scope,
                StringComparison.Ordinal))
        {
            throw new CliException($"{ManifestFileName} 的 scope_id 與 report.json 不一致。 ");
        }
    }

    private static JsonDocument ReadObject(string path, string label)
    {
        byte[] source;
        try
        {
            source = File.ReadAllBytes(path);
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException)
        {
            throw new CliException($"無法讀取 {label}：{error.Message}");
        }

        JsonDocument document;
        try
        {
            document = JsonDocument.Parse(source);
        }
        catch (JsonException error)
        {
            throw new CliException($"{label} 不是有效的 JSON：{error.Message}");
        }

        if (document.RootElement.ValueKind != JsonValueKind.Object)
        {
            document.Dispose();
            throw new CliException($"{label} 的根節點必須是物件。 ");
        }

        return document;
    }

    private static string RequiredString(JsonElement root, string propertyName, string label)
    {
        if (!root.TryGetProperty(propertyName, out var property)
            || property.ValueKind != JsonValueKind.String
            || string.IsNullOrWhiteSpace(property.GetString()))
        {
            throw new CliException($"{label} 缺少有效的 {propertyName}。");
        }

        return property.GetString()!;
    }
}

/// <summary>
///   Time's published projection. Its inputs (time.config.json,
///   time.estimates.json, time.events.json) are deliberately absent: they feed
///   the analyzer locally and are not served to a reader. It has no identity
///   contract to validate yet, so it keeps the interface's no-op.
/// </summary>
internal sealed class TimeReportModuleProvider : IReportModuleProvider
{
    public const string ModuleType = "taskprogress.time";
    public const string AnalysisFileName = "time.analysis.json";

    public string Type => ModuleType;

    public IReadOnlyList<ReportModuleArtifact> Declare() =>
    [
        new(ModuleType, AnalysisFileName),
    ];
}

/// <summary>
///   Cost's published projection. Like Time, its private inputs
///   (cost.config.json, cost.estimates.json) stay local and are not served.
/// </summary>
internal sealed class CostReportModuleProvider : IReportModuleProvider
{
    public const string ModuleType = "taskprogress.cost";

    public string Type => ModuleType;

    public IReadOnlyList<ReportModuleArtifact> Declare() =>
    [
        new(ModuleType, CostEstimationGenerator.AnalysisFileName),
    ];
}
