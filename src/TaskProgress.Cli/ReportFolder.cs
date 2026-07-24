using System.Text.Json;

namespace TaskProgress;

internal sealed record ReportFolder(
    string DirectoryPath,
    string ReportPath,
    string? DeveloperPath,
    string? TimeAnalysisPath,
    string Scope,
    string ReportId)
{
    private const string SupportedSchemaVersion = "1.0";

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

        return new ReportFolder(
            Path.GetFullPath(directory),
            Path.GetFullPath(reportPath),
            resolvedDeveloperPath,
            resolvedTimeAnalysisPath,
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
            if (!string.Equals(schemaVersion, SupportedSchemaVersion, StringComparison.Ordinal))
            {
                throw new CliException(
                    $"{label} schema_version 必須是 {SupportedSchemaVersion}，目前是 {schemaVersion}。");
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
