// The trayhost-jsonlines-v1 lines this Launcher exchanges with a TrayHost Host
// when it runs as an owned worker. The wire shape is owned by Winform's
// Documentation/TrayApp.md; this file is the reader/writer for our side of it.
//
// Every line produced here is a single line by construction: the serializer is
// never given indented output, and the payload text is JSON-escaped, so a
// command that printed newlines still arrives as one protocol line.

using System.Text.Json;

namespace TaskProgress;

/// <summary>
///   Reads worker requests and writes ready, response, and fatal lines.
/// </summary>
internal static class WorkerProtocol
{
    internal const int Version = 1;
    internal const string InvokeOperation = "invoke";
    internal const string ShutdownOperation = "shutdown";

    /// <summary>
    ///   Creates the readiness line the Host waits for before it dispatches.
    /// </summary>
    internal static string Ready()
    {
        return JsonSerializer.Serialize(new
        {
            protocol = Version,
            type = "ready"
        });
    }

    /// <summary>
    ///   Returns a parsed request, or null when the line is not one this
    ///   protocol version can correlate and answer.
    /// </summary>
    internal static WorkerRequest? ParseRequest(string line)
    {
        JsonDocument document;
        try
        {
            document = JsonDocument.Parse(line);
        }
        catch (JsonException)
        {
            return null;
        }

        using (document)
        {
            var root = document.RootElement;
            if (root.ValueKind != JsonValueKind.Object) return null;
            if (!root.TryGetProperty("protocol", out var protocol)
                || protocol.ValueKind != JsonValueKind.Number
                || protocol.GetInt32() != Version)
            {
                return null;
            }
            if (!root.TryGetProperty("type", out var type)
                || type.GetString() != "request")
            {
                return null;
            }
            if (!root.TryGetProperty("requestId", out var requestId)
                || requestId.ValueKind != JsonValueKind.String)
            {
                return null;
            }

            var identifier = requestId.GetString();
            if (string.IsNullOrEmpty(identifier)) return null;

            var operation = root.TryGetProperty("operation", out var operationElement)
                ? operationElement.GetString() ?? ""
                : "";
            return new WorkerRequest(identifier, operation, ReadArguments(root));
        }
    }

    /// <summary>
    ///   Creates the successful response carrying one command's own output.
    /// </summary>
    internal static string Success(string requestId, string stdout)
    {
        return JsonSerializer.Serialize(new
        {
            protocol = Version,
            type = "response",
            requestId,
            success = true,
            payload = new { stdout }
        });
    }

    /// <summary>
    ///   Creates the failed response for one request; the worker stays ready.
    /// </summary>
    internal static string Failure(string requestId, string code, string message)
    {
        return JsonSerializer.Serialize(new
        {
            protocol = Version,
            type = "response",
            requestId,
            success = false,
            error = new { code, message }
        });
    }

    private static string[] ReadArguments(JsonElement root)
    {
        if (!root.TryGetProperty("payload", out var payload)
            || payload.ValueKind != JsonValueKind.Object
            || !payload.TryGetProperty("arguments", out var arguments)
            || arguments.ValueKind != JsonValueKind.Array)
        {
            return [];
        }

        var values = new List<string>(arguments.GetArrayLength());
        foreach (var argument in arguments.EnumerateArray())
        {
            if (argument.ValueKind != JsonValueKind.String) return [];
            values.Add(argument.GetString() ?? "");
        }
        return [.. values];
    }
}

/// <summary>
///   One correlated request line addressed to this worker.
/// </summary>
internal sealed record WorkerRequest(
    string RequestId,
    string Operation,
    IReadOnlyList<string> Arguments);
