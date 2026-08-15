// Implements the framework-neutral, exact-file Checklist WebView message boundary.
using System.Text.Json;

namespace TaskProgress;

internal sealed class ChecklistBridge
{
    private const int ProtocolVersion = 1;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };
    private readonly string checklistPath;
    private readonly ChecklistDocumentStore store;

    public ChecklistBridge(string checklistPath, ChecklistDocumentStore? store = null)
    {
        this.checklistPath = ChecklistDocumentStore.ValidatePath(checklistPath);
        this.store = store ?? new ChecklistDocumentStore();
    }

    public string Handle(string requestJson)
    {
        string id = "";
        try
        {
            using var request = JsonDocument.Parse(requestJson);
            var root = request.RootElement;
            RequireObject(root, "request");
            RejectUnknown(root, "request", "version", "id", "type", "payload");
            RequireInteger(root, "version", ProtocolVersion);
            id = RequireString(root, "id", 64);
            var type = RequireString(root, "type", 16);
            object payload = type switch
            {
                "load" => Load(root),
                "save" => Save(root),
                _ => throw new ChecklistBridgeException("unknown_message", $"不支援的 bridge message：{type}"),
            };
            return Serialize(new
            {
                version = ProtocolVersion,
                id,
                type = "result",
                payload,
            });
        }
        catch (Exception error) when (error is JsonException or CliException or ChecklistBridgeException)
        {
            var bridgeError = error as ChecklistBridgeException;
            return Serialize(new
            {
                version = ProtocolVersion,
                id,
                type = "error",
                error = new
                {
                    code = bridgeError?.Code ?? (IsConflict(error) ? "revision_conflict" : "invalid_request"),
                    message = error.Message,
                },
            });
        }
    }

    private object Load(JsonElement root)
    {
        if (root.TryGetProperty("payload", out var payload)
            && payload.ValueKind is not (JsonValueKind.Null or JsonValueKind.Undefined))
        {
            RequireObject(payload, "load payload");
            RejectUnknown(payload, "load payload");
        }
        return Snapshot(store.Load(checklistPath));
    }

    private object Save(JsonElement root)
    {
        if (!root.TryGetProperty("payload", out var payload))
        {
            throw new ChecklistBridgeException("invalid_request", "save message 缺少 payload。");
        }
        RequireObject(payload, "save payload");
        RejectUnknown(payload, "save payload", "revision", "results");
        var revision = RequireString(payload, "revision", 128);
        if (!payload.TryGetProperty("results", out var results) || results.ValueKind != JsonValueKind.Array)
        {
            throw new ChecklistBridgeException("invalid_request", "save payload 缺少 results array。");
        }
        var manualResults = new List<ChecklistManualResult>();
        foreach (var result in results.EnumerateArray())
        {
            RequireObject(result, "manual result");
            RejectUnknown(result, "manual result", "workItemId", "checkIndex", "status", "observed");
            var status = RequireString(result, "status", 16) switch
            {
                "pending" => ChecklistStatus.Pending,
                "passed" => ChecklistStatus.Passed,
                "failed" => ChecklistStatus.Failed,
                _ => throw new ChecklistBridgeException(
                    "invalid_request",
                    "manual result status 只能是 pending、passed 或 failed。"),
            };
            manualResults.Add(new ChecklistManualResult(
                RequireInteger(result, "workItemId", minimum: 1),
                RequireInteger(result, "checkIndex", minimum: 0),
                status,
                OptionalString(result, "observed", 4000)));
        }
        var source = store.Load(checklistPath);
        if (!string.Equals(source.Revision, revision, StringComparison.Ordinal))
        {
            throw new CliException("Checklist 已被外部修改；草稿尚未覆寫來源檔案。");
        }
        var updated = source.ApplyManualResults(manualResults);
        store.Save(checklistPath, revision, updated);
        return Snapshot(store.Load(checklistPath));
    }

    private object Snapshot(ChecklistDocument document) => new
    {
        fileName = Path.GetFileName(checklistPath),
        revision = document.Revision,
        roundIdentity = document.RoundIdentity,
        items = document.Items.Select(item => new
        {
            id = item.Id,
            status = StatusValue(item.Status),
            title = item.Title,
            dependsOn = item.DependsOn,
            outcome = item.Outcome,
            checks = item.Checks.Select((check, index) => new
            {
                index,
                status = StatusValue(check.Status),
                title = check.Title,
                isManual = check.IsManual,
                action = check.Action,
                expect = check.Expect,
                reason = check.Reason,
                observed = check.Observed,
                resolved = check.Resolved,
            }),
        }),
    };

    private static string StatusValue(ChecklistStatus status) => status switch
    {
        ChecklistStatus.Pending => "pending",
        ChecklistStatus.Passed => "passed",
        ChecklistStatus.Failed => "failed",
        _ => throw new ArgumentOutOfRangeException(nameof(status)),
    };

    private static void RequireObject(JsonElement element, string name)
    {
        if (element.ValueKind != JsonValueKind.Object)
        {
            throw new ChecklistBridgeException("invalid_request", $"{name} 必須是 object。");
        }
    }

    private static void RejectUnknown(JsonElement element, string name, params string[] allowed)
    {
        var allowlist = new HashSet<string>(allowed, StringComparer.Ordinal);
        foreach (var property in element.EnumerateObject())
        {
            if (!allowlist.Contains(property.Name))
            {
                throw new ChecklistBridgeException(
                    "invalid_request",
                    $"{name} 不支援欄位 {property.Name}。");
            }
        }
    }

    private static string RequireString(JsonElement element, string propertyName, int maximumLength)
    {
        if (!element.TryGetProperty(propertyName, out var property)
            || property.ValueKind != JsonValueKind.String
            || string.IsNullOrWhiteSpace(property.GetString()))
        {
            throw new ChecklistBridgeException("invalid_request", $"{propertyName} 必須是非空字串。");
        }
        var value = property.GetString()!;
        if (value.Length > maximumLength)
        {
            throw new ChecklistBridgeException("invalid_request", $"{propertyName} 超過長度限制。");
        }
        return value;
    }

    private static string? OptionalString(JsonElement element, string propertyName, int maximumLength)
    {
        if (!element.TryGetProperty(propertyName, out var property)
            || property.ValueKind == JsonValueKind.Null)
        {
            return null;
        }
        if (property.ValueKind != JsonValueKind.String)
        {
            throw new ChecklistBridgeException("invalid_request", $"{propertyName} 必須是字串或 null。");
        }
        var value = property.GetString();
        if (value?.Length > maximumLength)
        {
            throw new ChecklistBridgeException("invalid_request", $"{propertyName} 超過長度限制。");
        }
        return value;
    }

    private static int RequireInteger(
        JsonElement element,
        string propertyName,
        int? exact = null,
        int minimum = int.MinValue)
    {
        if (!element.TryGetProperty(propertyName, out var property)
            || !property.TryGetInt32(out var value)
            || value < minimum
            || (exact is not null && value != exact.Value))
        {
            throw new ChecklistBridgeException("invalid_request", $"{propertyName} 數值無效。");
        }
        return value;
    }

    private static bool IsConflict(Exception error) =>
        error is CliException && error.Message.Contains("外部修改", StringComparison.Ordinal);

    private static string Serialize(object value) => JsonSerializer.Serialize(value, JsonOptions);
}

internal sealed class ChecklistBridgeException(string code, string message) : Exception(message)
{
    public string Code { get; } = code;
}
