using System.Text.Json;
using System.Text.Json.Serialization;

namespace TaskProgress;

internal sealed class ScopeStore
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
    };

    private readonly string _configPath;

    public ScopeStore(string? configPath = null)
    {
        _configPath = configPath ?? GetDefaultConfigPath();
    }

    public string ConfigPath => _configPath;

    public IReadOnlyDictionary<string, string> List() => Load().Scopes;

    public string Resolve(string scope)
    {
        scope = ScopeId.Validate(scope);
        var config = Load();
        if (!config.Scopes.TryGetValue(scope, out var folder))
        {
            throw new CliException(
                $"尚未登記 scope「{scope}」。請先執行 scope add {scope} <report-folder>。");
        }

        return folder;
    }

    public void Add(string scope, string folder)
    {
        scope = ScopeId.Validate(scope);
        var report = ReportFolder.Load(folder);
        Add(scope, report);
    }

    public string Add(string folder)
    {
        var report = ReportFolder.Load(folder);
        var scope = ScopeId.FromFolderName(report.DirectoryPath);
        Add(scope, report);
        return scope;
    }

    private void Add(string scope, ReportFolder report)
    {
        if (!string.Equals(report.Scope, scope, StringComparison.Ordinal))
        {
            throw new CliException(
                $"scope「{scope}」與 report.json 的 scope_id「{report.Scope}」不一致。 ");
        }

        var config = Load();
        config.Scopes[scope] = report.DirectoryPath;
        Save(config);
    }

    public bool Remove(string scope)
    {
        scope = ScopeId.Validate(scope);
        var config = Load();
        var removed = config.Scopes.Remove(scope);
        if (removed)
        {
            Save(config);
        }
        return removed;
    }

    private ScopeConfiguration Load()
    {
        if (!File.Exists(_configPath))
        {
            return new ScopeConfiguration();
        }

        try
        {
            var configuration = JsonSerializer.Deserialize<ScopeConfiguration>(
                File.ReadAllText(_configPath),
                JsonOptions) ?? new ScopeConfiguration();
            configuration.Scopes = new Dictionary<string, string>(
                configuration.Scopes,
                StringComparer.Ordinal);
            return configuration;
        }
        catch (Exception error) when (error is JsonException or IOException or UnauthorizedAccessException)
        {
            throw new CliException($"無法讀取 scope 設定：{error.Message}");
        }
    }

    private static string GetDefaultConfigPath()
    {
        var overrideDirectory = Environment.GetEnvironmentVariable("TASK_PROGRESS_HOME");
        var directory = string.IsNullOrWhiteSpace(overrideDirectory)
            ? Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "TaskProgress")
            : Path.GetFullPath(Environment.ExpandEnvironmentVariables(overrideDirectory));
        return Path.Combine(directory, "scopes.json");
    }

    private void Save(ScopeConfiguration configuration)
    {
        try
        {
            var directory = Path.GetDirectoryName(_configPath)!;
            Directory.CreateDirectory(directory);
            var temporaryPath = _configPath + ".tmp";
            File.WriteAllText(temporaryPath, JsonSerializer.Serialize(configuration, JsonOptions));
            File.Move(temporaryPath, _configPath, overwrite: true);
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException)
        {
            throw new CliException($"無法儲存 scope 設定：{error.Message}");
        }
    }

    private sealed class ScopeConfiguration
    {
        [JsonPropertyName("schema_version")]
        public string SchemaVersion { get; set; } = "1.0";

        [JsonPropertyName("scopes")]
        public Dictionary<string, string> Scopes { get; set; } = new(StringComparer.Ordinal);
    }
}
