// Serializes cooperative writers and keeps current answers and latest request receipts in one atomic file.
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using static TaskProgress.DecisionDocument;

namespace TaskProgress;

internal sealed class DecisionStore
{
    private readonly string path;
    public DecisionStore(string file)
    {
        path = Path.GetFullPath(file);
        if (!path.EndsWith(".decisions", StringComparison.OrdinalIgnoreCase)) Fail("invalid_path", "Expected a .decisions file.");
        for (FileSystemInfo? part = new FileInfo(path); part is not null; part = part is FileInfo f ? f.Directory : ((DirectoryInfo)part).Parent)
            if (part.Exists && (part.Attributes & FileAttributes.ReparsePoint) != 0) Fail("invalid_path", "Linked paths are not supported.");
    }

    public JsonObject Handle(string json, string? expectedTaskId = null)
    {
        string? requestId = null;
        try
        {
            if (Encoding.UTF8.GetByteCount(json) > MaxBytes) Fail("too_large", "Request exceeds 4 MiB.");
            var request = ParseObject(json);
            requestId = request["request_id"]?.GetValue<string>();
            Fields(request, ["operation", "decision_id", "expected_revision", "expected_version", "request_id", "payload"]);
            var operation = Text(request, "operation");
            var normalized = OperatingSystem.IsWindows() ? path.ToUpperInvariant() : path;
            using var mutex = new Mutex(false, "TaskProgress.Decisions." + Hash(Encoding.UTF8.GetBytes(normalized)));
            var locked = false;
            try
            {
                try { locked = mutex.WaitOne(TimeSpan.FromSeconds(10)); }
                catch (AbandonedMutexException) { locked = true; }
                if (!locked) Fail("busy", "Decision document is busy.");
                if (new FileInfo(path).Length > MaxBytes) Fail("too_large", "Document exceeds 4 MiB.");
                var bytes = File.ReadAllBytes(path);
                var document = Parse(new UTF8Encoding(false, true).GetString(bytes).TrimStart('\uFEFF'));
                if (expectedTaskId is not null && Text(document, "task_id") != expectedTaskId)
                    Fail("task_mismatch", "Document task id differs from the requested task.");
                var revision = Hash(bytes);
                if (operation == "load") return Response("loaded", document, revision, requestId);
                if (operation is not ("confirm" or "reopen" or "revise")) Fail("invalid_request", "Unknown operation.");
                requestId = Text(request, "request_id");
                var decisionId = Id(request, "decision_id");
                var expected = Text(request, "expected_revision");
                var version = Integer(request, "expected_version");
                var payload = Object(request["payload"]);
                var fingerprint = Fingerprint(request);
                foreach (var node in Array(document, "decisions"))
                {
                    if (Object(node)["last_request"] is not JsonObject entry || Text(entry, "request_id") != requestId) continue;
                    if (Text(entry, "fingerprint") != fingerprint) Fail("request_id_conflict", "Request id already has different content.");
                    return Response("already_applied", document, revision, requestId);
                }
                if (revision != expected) Fail("revision_conflict", "Reload and compare the changed document.");
                var decision = Array(document, "decisions").Select(Object).FirstOrDefault(d => Text(d, "id") == decisionId)
                    ?? throw new DecisionException("decision_not_found", "Decision is missing.");
                if (Integer(decision, "version") != version) Fail("version_conflict", "Question version changed.");
                var at = DateTimeOffset.UtcNow.ToString("O");
                switch (operation)
                {
                    case "confirm":
                        if (Text(decision, "status") != "pending") Fail("invalid_transition", "Decision is already answered.");
                        ValidateAnswer(payload, Definition(decision), false);
                        var answer = (JsonObject)payload.DeepClone();
                        answer["confirmed_at"] = at;
                        decision["answer"] = answer;
                        decision["status"] = "decided";
                        break;
                    case "reopen":
                        Fields(payload, []);
                        if (Text(decision, "status") != "decided") Fail("invalid_transition", "Only answered decisions can reopen.");
                        decision["answer"] = null;
                        decision["status"] = "pending";
                        break;
                    case "revise":
                        ValidateDefinition(payload);
                        if (Equal(payload, Definition(decision))) return Response("no_change", document, revision, requestId);
                        SetDefinition(decision, payload);
                        decision["version"] = checked(version + 1);
                        decision["answer"] = null;
                        decision["status"] = "pending";
                        break;
                }
                decision["last_request"] = new JsonObject
                {
                    ["request_id"] = requestId, ["fingerprint"] = fingerprint
                };
                document["updated_at"] = at;
                Validate(document);
                var output = Encoding.UTF8.GetBytes(document.ToJsonString(Format) + "\n");
                if (output.Length > MaxBytes) Fail("too_large", "Document exceeds 4 MiB.");
                var temp = path + "." + Guid.NewGuid().ToString("N") + ".tmp";
                try
                {
                    using (var stream = new FileStream(temp, FileMode.CreateNew, FileAccess.Write, FileShare.None))
                    { stream.Write(output); stream.Flush(true); }
                    if (Hash(File.ReadAllBytes(path)) != revision) Fail("revision_conflict", "An external writer changed the document.");
                    File.Move(temp, path, true);
                }
                finally { if (File.Exists(temp)) File.Delete(temp); }
                return Response("applied", document, Hash(output), requestId);
            }
            finally { if (locked) mutex.ReleaseMutex(); }
        }
        catch (Exception error) when (error is DecisionException or JsonException or IOException or UnauthorizedAccessException or InvalidOperationException or FormatException or OverflowException or DecoderFallbackException)
        {
            return new JsonObject { ["ok"] = false, ["request_id"] = requestId,
                ["error"] = new JsonObject { ["code"] = error is DecisionException d ? d.Code : error is FileNotFoundException ? "file_not_found" : "invalid_or_unavailable", ["message"] = error.Message } };
        }
    }

    private JsonObject Response(string status, JsonObject document, string revision, string? requestId) => new()
    {
        ["ok"] = true, ["status"] = status, ["request_id"] = requestId,
        ["document_key"] = Hash(Encoding.UTF8.GetBytes(OperatingSystem.IsWindows() ? path.ToUpperInvariant() : path)),
        ["document"] = document, ["revision"] = revision
    };
}
