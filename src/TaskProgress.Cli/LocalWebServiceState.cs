using System.Text.Json;
using System.Text.Json.Serialization;

namespace TaskProgress;

internal sealed record LocalWebServiceState
{
    [JsonPropertyName("service")]
    public string Service { get; init; } = string.Empty;

    [JsonPropertyName("api_version")]
    public int ApiVersion { get; init; }

    [JsonPropertyName("instance_id")]
    public string InstanceId { get; init; } = string.Empty;

    [JsonPropertyName("token")]
    public string Token { get; init; } = string.Empty;

    [JsonPropertyName("pid")]
    public int ProcessId { get; init; }

    [JsonPropertyName("host")]
    public string Host { get; init; } = string.Empty;

    [JsonPropertyName("port")]
    public int Port { get; init; }

    [JsonPropertyName("web_root")]
    public string WebRoot { get; init; } = string.Empty;

    [JsonPropertyName("control_api")]
    public string ControlApi { get; init; } = string.Empty;

    public static LocalWebServiceState Load(string path)
    {
        try
        {
            var state = JsonSerializer.Deserialize<LocalWebServiceState>(File.ReadAllText(path))
                ?? throw new CliException($"LocalWebService state file 是空的：{path}");
            state.Validate(path);
            return state;
        }
        catch (CliException)
        {
            throw;
        }
        catch (Exception error) when (error is IOException
            or UnauthorizedAccessException
            or JsonException)
        {
            throw new CliException($"無法讀取 LocalWebService state file：{error.Message}");
        }
    }

    private void Validate(string path)
    {
        if (!string.Equals(Service, "localwebservice", StringComparison.Ordinal)
            || ApiVersion != 1
            || string.IsNullOrWhiteSpace(InstanceId)
            || Token.Length < 32
            || ProcessId <= 0
            || Host is not ("127.0.0.1" or "localhost")
            || Port is < 1 or > 65535
            || string.IsNullOrWhiteSpace(WebRoot)
            || !string.Equals(ControlApi, "/__localwebservice/v1", StringComparison.Ordinal))
        {
            throw new CliException($"LocalWebService state file 格式無效：{path}");
        }
    }
}
