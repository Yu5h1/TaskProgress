using System.Text.Json;
using System.Text.Json.Serialization;

namespace TaskProgress;

internal static class ScopeCatalog
{
    public const string UrlPath = "/task-progress-scopes.json";

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
    };

    public static void Write(string path, IReadOnlyCollection<ReportFolder> reports)
    {
        var catalog = new Catalog(
            "1.0",
            reports
                .OrderBy(report => report.Scope, StringComparer.Ordinal)
                .Select(report => new CatalogScope(
                    report.Scope,
                    report.DeveloperPath is not null))
                .ToArray());

        try
        {
            var directory = Path.GetDirectoryName(path)!;
            Directory.CreateDirectory(directory);
            var temporaryPath = path + ".tmp";
            File.WriteAllText(temporaryPath, JsonSerializer.Serialize(catalog, JsonOptions));
            File.Move(temporaryPath, path, overwrite: true);
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException)
        {
            throw new CliException($"無法寫入 scope catalog：{error.Message}");
        }
    }

    private sealed record Catalog(
        [property: JsonPropertyName("schema_version")] string SchemaVersion,
        [property: JsonPropertyName("scopes")] CatalogScope[] Scopes);

    private sealed record CatalogScope(
        [property: JsonPropertyName("id")] string Id,
        [property: JsonPropertyName("has_developer_report")] bool HasDeveloperReport);
}
