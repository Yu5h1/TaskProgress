// Exercises the structured Checklist document contract without an external test framework.
using System.Text;
using System.Text.Json;
using TaskProgress;

internal static class Program
{
    public static int Main()
    {
        var root = Path.Combine(Path.GetTempPath(), $"task-progress-checklist-{Guid.NewGuid():N}");
        Directory.CreateDirectory(root);
        try
        {
            var source = Sample("\r\n", bom: true);
            var document = ChecklistDocument.Parse(source);
            Equal("plan.md#round", document.RoundIdentity, "round identity");
            Equal(2, document.Items.Count, "work item count");
            Equal(ChecklistStatus.Pending, document.Items[0].Status, "derived pending status");
            Equal(ChecklistStatus.Passed, document.Items[1].Status, "derived passed status");
            Equal(1, document.Items[1].DependsOn.Single(), "work item dependency");
            SequenceEqual(source, document.Serialize(), "unchanged byte round-trip");

            var updated = document.ApplyManualResults([
                new ChecklistManualResult(1, 1, ChecklistStatus.Failed, "Button remained disabled."),
            ]);
            Equal(ChecklistStatus.Failed, updated.Items[0].Status, "derived failed status");
            True(
                Encoding.UTF8.GetString(updated.Serialize()).Contains(
                    "- Observed: Button remained disabled.",
                    StringComparison.Ordinal),
                "Observed was not serialized");

            var resolved = updated.ResolveFailedCheck(1, 1, "Focused verification passed.");
            Equal(ChecklistStatus.Passed, resolved.Items[0].Checks[1].Status, "resolved check status");
            Equal("Button remained disabled.", resolved.Items[0].Checks[1].Observed, "resolved Observed");
            Equal("Focused verification passed.", resolved.Items[0].Checks[1].Resolved, "Resolved evidence");
            var resolvedBytes = resolved.Serialize();
            var reparsed = ChecklistDocument.Parse(resolvedBytes);
            SequenceEqual(resolvedBytes, reparsed.Serialize(), "resolved byte round-trip");

            Throws(() => document.ApplyManualResults([
                new ChecklistManualResult(1, 0, ChecklistStatus.Passed, null),
            ]), "Agent check mutation");
            Throws(() => document.ApplyManualResults([
                new ChecklistManualResult(1, 1, ChecklistStatus.Failed, " "),
            ]), "failed result without Observed");
            Throws(() => document.ResolveFailedCheck(1, 1, "Not failed."), "resolve pending check");
            Throws(() => updated.ResolveFailedCheck(1, 1, " "), "resolve without Resolved");
            Throws(() => ChecklistDocument.Parse(
                Encoding.UTF8.GetBytes(Encoding.UTF8.GetString(source).Replace(
                    "- [x] **2. Frozen item**",
                    "- [ ] **2. Frozen item**",
                    StringComparison.Ordinal))), "stale parent marker");
            Throws(() => ChecklistDocument.Parse(
                Encoding.UTF8.GetBytes("# Implementation Checklist\n\n- [ ] **1. Missing round**\n")),
                "missing round identity");
            Throws(() => ChecklistDocument.Parse(
                Sample("\n", bom: false)
                    .AsSpan()
                    .ToArray()
                    .ReplaceUtf8("      - Action: ", "      Action: ")),
                "legacy unbulleted Action");
            Throws(() => ChecklistDocument.Parse(
                Sample("\n", bom: false)
                    .AsSpan()
                    .ToArray()
                    .ReplaceUtf8("  Depends on: 1.", "  Depends on: 99.")),
                "missing dependency");

            var activeChecklistPath = FindActiveChecklist();
            var activeChecklistBytes = File.ReadAllBytes(activeChecklistPath);
            var activeChecklist = ChecklistDocument.Parse(activeChecklistBytes);
            SequenceEqual(
                activeChecklistBytes,
                activeChecklist.Serialize(),
                "active Checklist byte round-trip");

            var path = Path.Combine(root, "implementation-checklist.md");
            File.WriteAllBytes(path, source);
            string? openedPath = null;
            Equal(0, ChecklistCommand.Run([path], value => openedPath = value), "Checklist command result");
            Equal(Path.GetFullPath(path), openedPath, "Checklist command target");
            Throws(() => ChecklistCommand.Run([], _ => { }), "Checklist command missing target");
            Throws(() => ChecklistCommand.Run([path, path], _ => { }), "Checklist command extra target");
            Throws(() => ChecklistCommand.Run([Path.Combine(root, "missing.md")], _ => { }),
                "Checklist command missing file");
            var textPath = Path.Combine(root, "implementation-checklist.txt");
            File.WriteAllBytes(textPath, source);
            Throws(() => ChecklistCommand.Run([textPath], _ => { }), "Checklist command non-Markdown target");
            True(
                ChecklistDesktopHost.CreateRuntimeMissingError("missing")
                    .Message.Contains("Evergreen Runtime", StringComparison.Ordinal),
                "WebView2 runtime failure guidance");

            var bridgePath = Path.Combine(root, "bridge-checklist.md");
            File.WriteAllBytes(bridgePath, source);
            var bridge = new ChecklistBridge(bridgePath);
            using var loadResponse = JsonDocument.Parse(bridge.Handle(
                """{"version":1,"id":"load-1","type":"load"}"""));
            Equal("result", loadResponse.RootElement.GetProperty("type").GetString(), "bridge load result");
            var revision = loadResponse.RootElement.GetProperty("payload").GetProperty("revision").GetString();
            True(!string.IsNullOrWhiteSpace(revision), "bridge load revision");
            using var unknownResponse = JsonDocument.Parse(bridge.Handle(
                """{"version":1,"id":"bad-1","type":"openPath","payload":{"path":"other.md"}}"""));
            Equal("error", unknownResponse.RootElement.GetProperty("type").GetString(), "unknown bridge message");
            using var injectedPathResponse = JsonDocument.Parse(bridge.Handle(
                JsonSerializer.Serialize(new
                {
                    version = 1,
                    id = "save-path",
                    type = "save",
                    payload = new { revision, results = Array.Empty<object>(), path = "other.md" },
                })));
            Equal(
                "invalid_request",
                injectedPathResponse.RootElement.GetProperty("error").GetProperty("code").GetString(),
                "bridge path injection");
            using var saveResponse = JsonDocument.Parse(bridge.Handle(
                JsonSerializer.Serialize(new
                {
                    version = 1,
                    id = "save-1",
                    type = "save",
                    payload = new
                    {
                        revision,
                        results = new[]
                        {
                            new { workItemId = 1, checkIndex = 1, status = "passed", observed = (string?)null },
                        },
                    },
                })));
            Equal("result", saveResponse.RootElement.GetProperty("type").GetString(), "bridge save result");
            Equal(
                ChecklistStatus.Passed,
                new ChecklistDocumentStore().Load(bridgePath).Items[0].Checks[1].Status,
                "bridge persisted manual result");

            var conflictPath = Path.Combine(root, "bridge-conflict.md");
            File.WriteAllBytes(conflictPath, source);
            var conflictBridge = new ChecklistBridge(conflictPath);
            using var conflictLoad = JsonDocument.Parse(conflictBridge.Handle(
                """{"version":1,"id":"conflict-load","type":"load"}"""));
            var staleRevision = conflictLoad.RootElement.GetProperty("payload").GetProperty("revision").GetString();
            File.WriteAllText(
                conflictPath,
                File.ReadAllText(conflictPath, Encoding.UTF8).Replace(
                    "Manual result can be recorded.",
                    "Manual result remains external.",
                    StringComparison.Ordinal),
                new UTF8Encoding(true));
            using var conflictResponse = JsonDocument.Parse(conflictBridge.Handle(
                JsonSerializer.Serialize(new
                {
                    version = 1,
                    id = "conflict-save",
                    type = "save",
                    payload = new
                    {
                        revision = staleRevision,
                        results = new[]
                        {
                            new { workItemId = 1, checkIndex = 1, status = "passed", observed = (string?)null },
                        },
                    },
                })));
            Equal(
                "revision_conflict",
                conflictResponse.RootElement.GetProperty("error").GetProperty("code").GetString(),
                "bridge revision conflict");
            var store = new ChecklistDocumentStore();
            var loaded = store.Load(path);
            File.AppendAllText(path, "<!-- external -->", Encoding.UTF8);
            Throws(() => store.Save(path, loaded.Revision, loaded), "revision conflict");
            True(
                File.ReadAllText(path, Encoding.UTF8).EndsWith("<!-- external -->", StringComparison.Ordinal),
                "conflict overwrote external content");

            Console.WriteLine("Checklist document, host, and bridge tests passed: 33 checks.");
            return 0;
        }
        catch (Exception error)
        {
            Console.Error.WriteLine(error);
            return 1;
        }
        finally
        {
            try { Directory.Delete(root, recursive: true); } catch { }
        }
    }

    private static byte[] Sample(string newline, bool bom)
    {
        var text = string.Join(newline,
        [
            "# Implementation Checklist",
            "",
            "Current round: `plan.md#round`.",
            "",
            "Run each check once.",
            "",
            "- [ ] **1. Editable item**",
            "  Outcome: Manual result can be recorded.",
            "  Checks:",
            "    - [ ] **Agent proof**",
            "      - Action: Run a test.",
            "      - Expect: It passes.",
            "    - [ ] **Rendered proof** `[manual]`",
            "      - Action: Select a result.",
            "      - Expect: It is saved.",
            "      - Reason: Requires direct UX judgment.",
            "",
            "- [x] **2. Frozen item**",
            "  Depends on: 1.",
            "  Outcome: Saved results remain immutable.",
            "  Checks:",
            "    - [x] **Existing proof**",
            "      - Action: Run the old proof.",
            "      - Expect: It passed.",
            "",
        ]);
        var body = new UTF8Encoding(false).GetBytes(text);
        if (!bom) return body;
        return [.. Encoding.UTF8.Preamble, .. body];
    }

    private static string FindActiveChecklist()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            var candidate = Path.Combine(directory.FullName, "implementation-checklist.md");
            if (File.Exists(candidate)) return candidate;
            directory = directory.Parent;
        }
        throw new InvalidOperationException("Active implementation-checklist.md was not found.");
    }

    private static void Equal<T>(T expected, T actual, string message)
    {
        if (!EqualityComparer<T>.Default.Equals(expected, actual))
        {
            throw new InvalidOperationException($"{message}: expected {expected}, actual {actual}");
        }
    }

    private static void SequenceEqual(byte[] expected, byte[] actual, string message)
    {
        if (!expected.AsSpan().SequenceEqual(actual)) throw new InvalidOperationException(message);
    }

    private static void Throws(Action action, string message)
    {
        try
        {
            action();
        }
        catch (CliException)
        {
            return;
        }
        throw new InvalidOperationException($"Expected CliException: {message}");
    }

    private static void True(bool value, string message)
    {
        if (!value) throw new InvalidOperationException(message);
    }
}

internal static class Utf8TestExtensions
{
    public static byte[] ReplaceUtf8(this byte[] source, string oldValue, string newValue) =>
        Encoding.UTF8.GetBytes(
            Encoding.UTF8.GetString(source).Replace(oldValue, newValue, StringComparison.Ordinal));
}
