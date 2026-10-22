// Implements the framework-neutral, exact-file Checklist message boundary.
// All write messages share the document's manual-result rules and revision-checked store.
using System.Text.Json;

namespace TaskProgress;

internal sealed class ChecklistBridge
{
    private const int ProtocolVersion = 1;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };
    private static readonly System.Text.RegularExpressions.Regex ActorPattern = new("^[a-z][a-z0-9-]{0,31}$");
    private readonly string checklistPath;
    private readonly ChecklistDocumentStore store;
    private readonly bool fromUser;
    private ChecklistWriter writer = ChecklistWriter.User;

    /// <summary>
    ///   <paramref name="fromUser"/> is true for the panels the user operates;
    ///   a direct CLI caller is an agent and must say who it is on every write.
    /// </summary>
    public ChecklistBridge(string checklistPath, ChecklistDocumentStore? store = null, bool fromUser = true)
    {
        this.checklistPath = ChecklistDocumentStore.ValidatePath(checklistPath);
        this.store = store ?? new ChecklistDocumentStore();
        this.fromUser = fromUser;
    }

    public string Handle(string requestJson)
    {
        string id = "";
        try
        {
            using var request = JsonDocument.Parse(requestJson);
            var root = request.RootElement;
            RequireObject(root, "request");
            RejectUnknown(root, "request", "version", "id", "type", "payload", "actor", "sessionId");
            RequireInteger(root, "version", ProtocolVersion);
            id = RequireString(root, "id", 64);
            var type = RequireString(root, "type", 16);
            if (type != "load") writer = ResolveWriter(root, type);
            object payload = type switch
            {
                "load" => Load(root),
                "save" => Save(root),
                "set" => Set(root),
                "reset" => Reset(root),
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
            manualResults.Add(ParseManualResult(result));
        }
        var source = store.Load(checklistPath);
        if (!string.Equals(source.Revision, revision, StringComparison.Ordinal))
        {
            throw new CliException("Checklist 已被外部修改；草稿尚未覆寫來源檔案。");
        }
        return Persist(source, manualResults);
    }

    private object Set(JsonElement root)
    {
        var result = ParseManualResult(RequirePayload(root, "set"));
        return Persist(store.Load(checklistPath), [result]);
    }

    private object Reset(JsonElement root)
    {
        var payload = RequirePayload(root, "reset");
        RejectUnknown(payload, "reset payload", "targets");
        var source = store.Load(checklistPath);
        var results = new List<ChecklistManualResult>();
        if (payload.TryGetProperty("targets", out var targets))
        {
            if (targets.ValueKind != JsonValueKind.Array)
            {
                throw new ChecklistBridgeException("invalid_request", "reset targets 必須是 array。");
            }
            foreach (var target in targets.EnumerateArray())
            {
                RequireObject(target, "reset target");
                RejectUnknown(target, "reset target", "workItemId", "checkIndex");
                results.Add(new ChecklistManualResult(
                    RequireInteger(target, "workItemId", minimum: 1),
                    RequireInteger(target, "checkIndex", minimum: 0),
                    ChecklistStatus.Pending,
                    null));
            }
        }
        else
        {
            foreach (var item in source.Items)
            {
                for (var index = 0; index < item.Checks.Count; index++)
                {
                    if (item.Checks[index].IsManual)
                    {
                        results.Add(new ChecklistManualResult(item.Id, index, ChecklistStatus.Pending, null));
                    }
                }
            }
        }
        return Persist(source, results);
    }

    private object Persist(ChecklistDocument source, IEnumerable<ChecklistManualResult> results)
    {
        var updated = source.ApplyTaggedResults(results, writer, DateTimeOffset.UtcNow);
        store.Save(checklistPath, source.Revision, updated);
        return Snapshot(store.Load(checklistPath));
    }

    private ChecklistWriter ResolveWriter(JsonElement root, string type)
    {
        var hasActor = root.TryGetProperty("actor", out _);
        if (fromUser)
        {
            if (hasActor || root.TryGetProperty("sessionId", out _))
                throw new ChecklistBridgeException("invalid_request", "面板寫入不帶 actor 或 sessionId。");
            return ChecklistWriter.User with { ReleasedAt = OptionalBinding()?.ReleasedAt };
        }
        if (type == "reset") throw new ChecklistBridgeException("forbidden", "agent 不能清空結果。");
        if (!hasActor || !root.TryGetProperty("sessionId", out _))
            throw new ChecklistBridgeException("invalid_request", "agent 寫入必須帶 actor 與 sessionId。");
        var actor = RequireString(root, "actor", 32);
        var session = RequireString(root, "sessionId", 100);
        if (!ActorPattern.IsMatch(actor) || actor == "user" || actor == "legacy")
            throw new ChecklistBridgeException("invalid_request", "actor 必須是寫入工具的小寫名稱，例如 claude，且不能是 user 或 legacy。");
        if (session.Contains(';')) throw new ChecklistBridgeException("invalid_request", "sessionId 不可包含分號。");
        var binding = ChecklistBinding.Find(checklistPath)
            ?? throw new ChecklistBridgeException("forbidden", "這份 checklist 沒有綁定 Report 子項，agent 不能寫入標籤檢查。");
        return new ChecklistWriter($"{actor}:{session}", false, session, binding.ExcludedAcceptors, binding.ReleasedAt);
    }

    /// <summary>The bound item for reads and panel writes, which still work beside an unreadable report.</summary>
    private ChecklistBindingInfo? OptionalBinding()
    {
        try
        {
            return ChecklistBinding.Find(checklistPath);
        }
        catch (Exception error) when (error is JsonException or IOException or UnauthorizedAccessException
            or KeyNotFoundException or InvalidOperationException)
        {
            return null;
        }
    }

    private static JsonElement RequirePayload(JsonElement root, string type)
    {
        if (!root.TryGetProperty("payload", out var payload))
        {
            throw new ChecklistBridgeException("invalid_request", $"{type} message 缺少 payload。");
        }
        RequireObject(payload, $"{type} payload");
        return payload;
    }

    private static ChecklistManualResult ParseManualResult(JsonElement result)
    {
        RequireObject(result, "manual result");
        RejectUnknown(result, "manual result", "workItemId", "checkIndex", "status", "observed", "resolved", "reason");
        var status = RequireString(result, "status", 16) switch
        {
            "pending" => ChecklistStatus.Pending,
            "passed" => ChecklistStatus.Passed,
            "failed" => ChecklistStatus.Failed,
            _ => throw new ChecklistBridgeException(
                "invalid_request",
                "manual result status 只能是 pending、passed 或 failed。"),
        };
        ChecklistRejectReason? reason = OptionalString(result, "reason", 16) switch
        {
            null => null,
            "implementation" => ChecklistRejectReason.Implementation,
            "condition" => ChecklistRejectReason.Condition,
            _ => throw new ChecklistBridgeException("invalid_request", "reason 只能是 implementation 或 condition。"),
        };
        return new ChecklistManualResult(
            RequireInteger(result, "workItemId", minimum: 1),
            RequireInteger(result, "checkIndex", minimum: 0),
            status,
            OptionalString(result, "observed", 4000),
            OptionalString(result, "resolved", 4000),
            reason);
    }

    private object Snapshot(ChecklistDocument document) => Snapshot(document, OptionalBinding()?.ReleasedAt);

    private object Snapshot(ChecklistDocument document, DateTimeOffset? releasedAt) => new
    {
        fileName = Path.GetFileName(checklistPath),
        revision = document.Revision,
        roundIdentity = document.RoundIdentity,
        untaggedComplete = document.UntaggedComplete,
        acceptanceComplete = document.IsAcceptanceComplete(releasedAt),
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
                effectiveStatus = StatusValue(ChecklistDocument.EffectiveStatus(check, releasedAt)),
                title = check.Title,
                tag = check.Tag switch
                {
                    ChecklistTag.Manual => "manual",
                    ChecklistTag.Acceptance => "acceptance",
                    _ => (string?)null,
                },
                isManual = check.IsManual,
                isAcceptance = check.IsAcceptance,
                action = check.Action,
                expect = check.Expect,
                reason = check.Reason,
                observed = check.Observed,
                resolved = check.Resolved,
                validity = ChecklistDocument.Validity(check, releasedAt) switch
                {
                    ChecklistResultValidity.NoRecorder => "no_recorder",
                    ChecklistResultValidity.FingerprintMismatch => "fingerprint",
                    ChecklistResultValidity.PassedBeforeRelease => "released",
                    _ => "valid",
                },
                recorder = check.Record?.Recorder,
                recordedAt = check.Record?.At,
                rejectReason = check.Record?.RejectReason switch
                {
                    ChecklistRejectReason.Implementation => "implementation",
                    ChecklistRejectReason.Condition => "condition",
                    _ => null,
                },
                conditionCount = check.Record?.ConditionCount ?? 0,
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
            || property.ValueKind != JsonValueKind.Number
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
