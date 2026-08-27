// One authorized report folder, resolved: the report's identity, plus
// whatever the registered providers found beside it.
//
// No module may have a field on this record. A module contributes files by
// being a provider, and a per-sidecar field here would put that module's name
// on the core report type and make every new module an edit to this file.
//
// Resolution — and therefore identity validation — belongs in Load, not at
// route registration. Commands that never start a service, `analyze` above
// all, rely on a mismatched overlay failing the load; checking only when a
// route is registered would quietly stop them noticing.

using System.Text.Json;

namespace TaskProgress;

internal sealed record ReportFolder(
    string DirectoryPath,
    string ReportPath,
    string Scope,
    string ReportId,
    ReportModuleRouteSet Routes)
{
    private static readonly string[] SupportedSchemaVersions = ["1.0", "1.1"];

    /// <summary>
    ///   Whether a named file was found and validated in this folder. Callers
    ///   name the file through its owning provider's constant so the name has
    ///   one source.
    /// </summary>
    public bool HasArtifact(string fileName) =>
        Routes.Present.Any(route =>
            string.Equals(route.FileName, fileName, StringComparison.OrdinalIgnoreCase));

    public static ReportFolder Load(string pathValue)
    {
        if (string.IsNullOrWhiteSpace(pathValue))
        {
            throw new CliException("請指定包含 report.json 的資料夾。 ");
        }

        var fullPath = Path.GetFullPath(Environment.ExpandEnvironmentVariables(pathValue));
        var directory = File.Exists(fullPath)
            ? Path.GetDirectoryName(fullPath)!
            : fullPath;
        var reportPath = File.Exists(fullPath)
            ? fullPath
            : Path.Combine(directory, CoreReportModuleProvider.ReportFileName);

        if (!File.Exists(reportPath))
        {
            throw new CliException($"找不到 report.json：{reportPath}");
        }

        var report = ReadIdentity(reportPath);
        var scope = ScopeId.Validate(report.Scope!);
        var context = new ReportModuleContext(
            Path.GetFullPath(directory),
            scope,
            report.ReportId,
            report.SchemaVersion);

        return new ReportFolder(
            context.DirectoryPath,
            Path.GetFullPath(reportPath),
            scope,
            report.ReportId,
            ReportModuleRegistry.Resolve(context, ReportModuleProviders.Production));
    }

    private static ReportIdentity ReadIdentity(string path)
    {
        const string label = CoreReportModuleProvider.ReportFileName;
        byte[] source;
        try
        {
            source = File.ReadAllBytes(path);
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException)
        {
            throw new CliException($"無法讀取 {label}：{error.Message}");
        }

        try
        {
            using var document = JsonDocument.Parse(source);
            if (document.RootElement.ValueKind != JsonValueKind.Object)
            {
                throw new CliException($"{label} 的根節點必須是物件。 ");
            }

            var schemaVersion = RequiredString(document.RootElement, "schema_version", label);
            if (Array.IndexOf(SupportedSchemaVersions, schemaVersion) < 0)
            {
                throw new CliException(
                    $"{label} schema_version 必須是 {string.Join("、", SupportedSchemaVersions)}，目前是 {schemaVersion}。");
            }

            return new ReportIdentity(
                schemaVersion,
                RequiredString(document.RootElement, "report_id", label),
                RequiredString(document.RootElement, "scope_id", label));
        }
        catch (JsonException error)
        {
            throw new CliException($"{label} 不是有效的 JSON：{error.Message}");
        }
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

    private sealed record ReportIdentity(string SchemaVersion, string ReportId, string? Scope);
}
