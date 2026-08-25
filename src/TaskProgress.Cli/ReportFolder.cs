using System.Text.Json;

namespace TaskProgress;

internal sealed record ReportFolder(
    string DirectoryPath,
    string ReportPath,
    string? DeveloperPath,
    string? TimeAnalysisPath,
    string? ModuleManifestPath,
    string Scope,
    string ReportId)
{
    private static readonly string[] SupportedSchemaVersions = ["1.0", "1.1"];
    private static readonly string[] SupportedManifestSchemaVersions = ["0.1"];

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
            : Path.Combine(directory, "report.json");

        if (!File.Exists(reportPath))
        {
            throw new CliException($"找不到 report.json：{reportPath}");
        }

        var reportSource = ReadBytes(reportPath, "report.json");
        var report = ReadIdentity(reportSource, "report.json", requireScope: true);
        var scope = ScopeId.Validate(report.Scope);

        var developerPath = Path.Combine(directory, "report.dev.json");
        string? resolvedDeveloperPath = null;
        if (File.Exists(developerPath))
        {
            var developerSource = ReadBytes(developerPath, "report.dev.json");
            var developer = ReadIdentity(developerSource, "report.dev.json", requireScope: false);
            if (!string.Equals(developer.SchemaVersion, report.SchemaVersion, StringComparison.Ordinal))
            {
                throw new CliException("report.dev.json 的 schema_version 與 report.json 不相容。 ");
            }
            if (!string.Equals(developer.ReportId, report.ReportId, StringComparison.Ordinal))
            {
                throw new CliException("report.dev.json 的 report_id 與 report.json 不一致。 ");
            }
            resolvedDeveloperPath = Path.GetFullPath(developerPath);
        }

        var timeAnalysisPath = Path.Combine(directory, "time.analysis.json");
        var resolvedTimeAnalysisPath = File.Exists(timeAnalysisPath)
            ? Path.GetFullPath(timeAnalysisPath)
            : null;

        // The optional extension-module manifest. Absent is the normal case
        // and stays normal: every report that has never declared a module
        // must keep working untouched. Identity here is validated only
        // against report.json's own report_id/scope_id — the manifest's
        // module descriptors are the Viewer's contract to enforce, not the
        // Launcher's, so this deliberately does not parse them.
        var moduleManifestPath = Path.Combine(directory, "report.modules.json");
        string? resolvedModuleManifestPath = null;
        if (File.Exists(moduleManifestPath))
        {
            var manifestSource = ReadBytes(moduleManifestPath, "report.modules.json");
            var manifest = ReadManifestIdentity(manifestSource, "report.modules.json");
            if (!string.Equals(manifest.ReportId, report.ReportId, StringComparison.Ordinal))
            {
                throw new CliException("report.modules.json 的 report_id 與 report.json 不一致。 ");
            }
            if (!string.Equals(manifest.Scope, report.Scope, StringComparison.Ordinal))
            {
                throw new CliException("report.modules.json 的 scope_id 與 report.json 不一致。 ");
            }
            resolvedModuleManifestPath = Path.GetFullPath(moduleManifestPath);
        }

        return new ReportFolder(
            Path.GetFullPath(directory),
            Path.GetFullPath(reportPath),
            resolvedDeveloperPath,
            resolvedTimeAnalysisPath,
            resolvedModuleManifestPath,
            scope,
            report.ReportId);
    }

    private static byte[] ReadBytes(string path, string label)
    {
        try
        {
            return File.ReadAllBytes(path);
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException)
        {
            throw new CliException($"無法讀取 {label}：{error.Message}");
        }
    }

    private static ReportIdentity ReadIdentity(byte[] source, string label, bool requireScope)
    {
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

            var reportId = RequiredString(document.RootElement, "report_id", label);
            var scope = requireScope
                ? RequiredString(document.RootElement, "scope_id", label)
                : null;
            return new ReportIdentity(schemaVersion, reportId, scope);
        }
        catch (JsonException error)
        {
            throw new CliException($"{label} 不是有效的 JSON：{error.Message}");
        }
    }

    // The manifest carries its own schema_version line (0.1), independent of
    // report.json's (1.0/1.1) — a module manifest and a report version
    // separately, per the architecture plan. Reusing ReadIdentity here would
    // check the manifest against the report's version list and reject every
    // valid manifest.
    private static ManifestIdentity ReadManifestIdentity(byte[] source, string label)
    {
        try
        {
            using var document = JsonDocument.Parse(source);
            if (document.RootElement.ValueKind != JsonValueKind.Object)
            {
                throw new CliException($"{label} 的根節點必須是物件。 ");
            }

            var schemaVersion = RequiredString(document.RootElement, "schema_version", label);
            if (Array.IndexOf(SupportedManifestSchemaVersions, schemaVersion) < 0)
            {
                throw new CliException(
                    $"{label} schema_version 必須是 {string.Join("、", SupportedManifestSchemaVersions)}，目前是 {schemaVersion}。");
            }

            return new ManifestIdentity(
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

    private sealed record ManifestIdentity(string SchemaVersion, string ReportId, string Scope);
}
