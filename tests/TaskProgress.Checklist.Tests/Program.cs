// Exercises the structured Checklist document contract without an external test framework.
using System.Text;
using System.Text.Json;
using TaskProgress;

internal static class Program
{
    private static int assertionCount;

    public static int Main()
    {
        var root = Path.Combine(Path.GetTempPath(), $"task-progress-checklist-{Guid.NewGuid():N}");
        Directory.CreateDirectory(root);
        try
        {
            VerifySharedSemantics();
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

            // A saved manual result records the user's current judgment, so it stays
            // revisable through the whole cycle; Agent evidence does not.
            var revised = updated.ApplyManualResults([
                new ChecklistManualResult(1, 1, ChecklistStatus.Passed, null),
            ]);
            Equal(ChecklistStatus.Passed, revised.Items[0].Checks[1].Status, "revised manual result");
            True(revised.Items[0].Checks[1].Observed is null, "revised manual result clears Observed");
            // The work item is still pending: its Agent check has not run.
            Equal(ChecklistStatus.Pending, revised.Items[0].Status, "derived status after revision");

            var cleared = resolved.ApplyManualResults([
                new ChecklistManualResult(1, 1, ChecklistStatus.Pending, null),
            ]);
            Equal(ChecklistStatus.Pending, cleared.Items[0].Checks[1].Status, "manual result cycled to pending");
            True(cleared.Items[0].Checks[1].Observed is null, "pending manual result clears Observed");
            True(cleared.Items[0].Checks[1].Resolved is null, "pending manual result clears Resolved");
            Equal(ChecklistStatus.Pending, cleared.Items[0].Status, "derived status after clearing");
            var clearedBytes = cleared.Serialize();
            SequenceEqual(
                clearedBytes,
                ChecklistDocument.Parse(clearedBytes).Serialize(),
                "revised manual byte round-trip");
            Throws(() => revised.ApplyManualResults([
                new ChecklistManualResult(1, 1, ChecklistStatus.Failed, " "),
            ]), "revised failure without Observed");
            Throws(() => resolved.ApplyManualResults([
                new ChecklistManualResult(1, 0, ChecklistStatus.Pending, null),
            ]), "Agent check mutation after save");

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

            var projectChecklists = FindProjectChecklists();
            True(projectChecklists.Count > 0, "project has no .checklist files");
            foreach (var projectChecklistPath in projectChecklists)
            {
                var projectChecklistBytes = File.ReadAllBytes(projectChecklistPath);
                var projectChecklist = ChecklistDocument.Parse(projectChecklistBytes);
                SequenceEqual(
                    projectChecklistBytes,
                    projectChecklist.Serialize(),
                    $"project Checklist byte round-trip: {Path.GetFileName(projectChecklistPath)}");
            }

            var path = Path.Combine(root, "task-a.checklist");
            File.WriteAllBytes(path, source);
            string? openedPath = null;
            Equal(0, ChecklistCommand.Run([path], value => openedPath = value), "Checklist command result");
            Equal(Path.GetFullPath(path), openedPath, "Checklist command target");
            Throws(() => ChecklistCommand.Run([], _ => { }), "Checklist command missing target");
            Throws(() => ChecklistCommand.Run([path, path], _ => { }), "Checklist command extra target");
            Throws(() => ChecklistCommand.Run([Path.Combine(root, "missing.checklist")], _ => { }),
                "Checklist command missing file");
            var markdownPath = Path.Combine(root, "legacy-checklist.md");
            File.WriteAllBytes(markdownPath, source);
            Throws(() => ChecklistCommand.Run([markdownPath], _ => { }), "Checklist command legacy Markdown target");
            var textPath = Path.Combine(root, "task-a.txt");
            File.WriteAllBytes(textPath, source);
            Throws(() => ChecklistCommand.Run([textPath], _ => { }), "Checklist command unrelated extension");
            True(
                TaskProgress.Program.IsDirectChecklistActivation([path]),
                "direct .checklist activation");
            True(
                TaskProgress.Program.IsDirectChecklistActivation([path.ToUpperInvariant()]),
                "case-insensitive direct .checklist activation");
            True(
                !TaskProgress.Program.IsDirectChecklistActivation([markdownPath]),
                "legacy Markdown is not a direct Checklist activation");
            True(
                !TaskProgress.Program.IsDirectChecklistActivation([path, path]),
                "direct Checklist activation requires exactly one path");

            var installed = false;
            var uninstalled = false;
            Equal(0, ChecklistCommand.Run(
                ["install"],
                _ => throw new InvalidOperationException("install must not open a file"),
                () => installed = true,
                () => { uninstalled = true; return true; }),
                "Checklist association install result");
            True(installed, "Checklist association install dispatch");
            installed = false;
            Equal(0, ChecklistCommand.Run(
                ["uninstall"],
                _ => throw new InvalidOperationException("uninstall must not open a file"),
                () => installed = true,
                () => { uninstalled = true; return true; }),
                "Checklist association uninstall result");
            True(!installed, "Checklist association uninstall did not dispatch install");
            True(uninstalled, "Checklist association uninstall dispatch");
            Equal(
                "\"C:\\Program Files\\TaskProgress\\task-progress.exe\" checklist \"%1\"",
                ChecklistFileRegistration.BuildLaunchCommand(
                    @"C:\Program Files\TaskProgress\task-progress.exe"),
                "Checklist association launch command");
            True(
                ChecklistDesktopHost.CreateRuntimeMissingError("missing")
                    .Message.Contains("Evergreen Runtime", StringComparison.Ordinal),
                "WebView2 runtime failure guidance");

            var bridgePath = Path.Combine(root, "bridge-checklist.checklist");
            var isolatedPath = Path.Combine(root, "isolated-checklist.checklist");
            File.WriteAllBytes(bridgePath, source);
            File.WriteAllBytes(isolatedPath, source);
            var bridge = new ChecklistBridge(bridgePath);
            using var loadResponse = JsonDocument.Parse(bridge.Handle(
                """{"version":1,"id":"load-1","type":"load"}"""));
            Equal("result", loadResponse.RootElement.GetProperty("type").GetString(), "bridge load result");
            var revision = loadResponse.RootElement.GetProperty("payload").GetProperty("revision").GetString();
            True(!string.IsNullOrWhiteSpace(revision), "bridge load revision");
            using var unknownResponse = JsonDocument.Parse(bridge.Handle(
                """{"version":1,"id":"bad-1","type":"openPath","payload":{"path":"other.checklist"}}"""));
            Equal("error", unknownResponse.RootElement.GetProperty("type").GetString(), "unknown bridge message");
            using var injectedPathResponse = JsonDocument.Parse(bridge.Handle(
                JsonSerializer.Serialize(new
                {
                    version = 1,
                    id = "save-path",
                    type = "save",
                    payload = new { revision, results = Array.Empty<object>(), path = "other.checklist" },
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
            var savedRevision = saveResponse.RootElement.GetProperty("payload").GetProperty("revision").GetString();
            using var revertResponse = JsonDocument.Parse(bridge.Handle(
                JsonSerializer.Serialize(new
                {
                    version = 1,
                    id = "save-2",
                    type = "save",
                    payload = new
                    {
                        revision = savedRevision,
                        results = new[]
                        {
                            new { workItemId = 1, checkIndex = 1, status = "pending", observed = (string?)null },
                        },
                    },
                })));
            Equal("result", revertResponse.RootElement.GetProperty("type").GetString(), "bridge revert result");
            Equal(
                ChecklistStatus.Pending,
                new ChecklistDocumentStore().Load(bridgePath).Items[0].Checks[1].Status,
                "bridge persisted manual revert");
            SequenceEqual(source, File.ReadAllBytes(isolatedPath), "bridge changed a different Checklist file");

            var conflictPath = Path.Combine(root, "bridge-conflict.checklist");
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

            Console.WriteLine($"Checklist document, host, and bridge tests passed: {assertionCount} checks.");
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

    private static void VerifySharedSemantics()
    {
        var fixturePath = Path.Combine(AppContext.BaseDirectory, "fixtures", "checklist-semantics.json");
        using var fixture = JsonDocument.Parse(File.ReadAllBytes(fixturePath));
        foreach (var statusCase in fixture.RootElement.GetProperty("status_cases").EnumerateArray())
        {
            var statuses = statusCase.GetProperty("checks")
                .EnumerateArray()
                .Select(value => ParseFixtureStatus(value.GetString()))
                .ToArray();
            var expected = ParseFixtureStatus(statusCase.GetProperty("expected").GetString());
            var document = ChecklistDocument.Parse(StatusFixture(statuses, expected));
            Equal(expected, document.Items[0].Status, statusCase.GetProperty("name").GetString()!);
        }

        foreach (var transitionCase in fixture.RootElement.GetProperty("transition_cases").EnumerateArray())
        {
            var name = transitionCase.GetProperty("name").GetString()!;
            var manual = transitionCase.GetProperty("manual").GetBoolean();
            var initial = transitionCase.GetProperty("initial");
            var target = transitionCase.GetProperty("target");
            var expected = transitionCase.GetProperty("expected");
            var document = ChecklistDocument.Parse(TransitionFixture(manual, initial));
            var result = new ChecklistManualResult(
                1,
                0,
                ParseFixtureStatus(target.GetProperty("status").GetString()),
                NullableString(target, "observed"));
            if (expected.GetProperty("error").GetBoolean())
            {
                Throws(() => document.ApplyManualResults([result]), name);
                continue;
            }

            var updated = document.ApplyManualResults([result]);
            var check = updated.Items[0].Checks[0];
            Equal(ParseFixtureStatus(expected.GetProperty("status").GetString()), check.Status, $"{name} status");
            Equal(NullableString(expected, "observed"), check.Observed, $"{name} Observed");
            Equal(NullableString(expected, "resolved"), check.Resolved, $"{name} Resolved");
            Equal(ParseFixtureStatus(expected.GetProperty("item_status").GetString()), updated.Items[0].Status, $"{name} item status");
        }
    }

    private static byte[] StatusFixture(
        IReadOnlyList<ChecklistStatus> statuses,
        ChecklistStatus expected)
    {
        var lines = new List<string>
        {
            "# Semantics Checklist",
            "",
            "Current round: `plan.md#semantics`.",
            "",
            $"- [{FixtureMarker(expected)}] **1. Status precedence**",
            "  Outcome: Both runtimes derive the same item status.",
            "  Checks:",
        };
        for (var index = 0; index < statuses.Count; index++)
        {
            var status = statuses[index];
            lines.Add($"    - [{FixtureMarker(status)}] **Check {index + 1}**");
            lines.Add("      - Action: Apply the fixture case.");
            lines.Add("      - Expect: The canonical result matches.");
            if (status == ChecklistStatus.Failed) lines.Add("      - Observed: Fixture failure.");
        }
        lines.Add(string.Empty);
        return Encoding.UTF8.GetBytes(string.Join("\n", lines));
    }

    private static byte[] TransitionFixture(bool manual, JsonElement initial)
    {
        var status = ParseFixtureStatus(initial.GetProperty("status").GetString());
        var lines = new List<string>
        {
            "# Semantics Checklist",
            "",
            "Current round: `plan.md#semantics`.",
            "",
            $"- [{FixtureMarker(status)}] **1. Transition**",
            "  Outcome: Both runtimes apply the same manual result.",
            "  Checks:",
            $"    - [{FixtureMarker(status)}] **Check 1**{(manual ? " `[manual]`" : string.Empty)}",
            "      - Action: Apply the fixture case.",
            "      - Expect: The canonical result matches.",
        };
        if (manual) lines.Add("      - Reason: Shared semantics fixture.");
        var observed = NullableString(initial, "observed");
        var resolved = NullableString(initial, "resolved");
        if (observed is not null) lines.Add($"      - Observed: {observed}");
        if (resolved is not null) lines.Add($"      - Resolved: {resolved}");
        lines.Add(string.Empty);
        return Encoding.UTF8.GetBytes(string.Join("\n", lines));
    }

    private static ChecklistStatus ParseFixtureStatus(string? value) => value switch
    {
        "pending" => ChecklistStatus.Pending,
        "passed" => ChecklistStatus.Passed,
        "failed" => ChecklistStatus.Failed,
        _ => throw new InvalidOperationException($"Unknown fixture status: {value}"),
    };

    private static string FixtureMarker(ChecklistStatus status) => status switch
    {
        ChecklistStatus.Pending => " ",
        ChecklistStatus.Passed => "x",
        ChecklistStatus.Failed => "!",
        _ => throw new ArgumentOutOfRangeException(nameof(status)),
    };

    private static string? NullableString(JsonElement source, string property)
    {
        var value = source.GetProperty(property);
        return value.ValueKind == JsonValueKind.Null ? null : value.GetString();
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

    private static IReadOnlyList<string> FindProjectChecklists()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            var checklistDirectory = Path.Combine(directory.FullName, "checklists");
            if (Directory.Exists(checklistDirectory))
            {
                var candidates = Directory.GetFiles(
                    checklistDirectory,
                    $"*{ChecklistFileRegistration.FileExtension}",
                    SearchOption.TopDirectoryOnly);
                if (candidates.Length > 0)
                {
                    return candidates.OrderBy(path => path, StringComparer.OrdinalIgnoreCase).ToArray();
                }
            }
            directory = directory.Parent;
        }
        throw new InvalidOperationException("Project checklists/*.checklist files were not found.");
    }

    private static void Equal<T>(T expected, T actual, string message)
    {
        if (!EqualityComparer<T>.Default.Equals(expected, actual))
        {
            throw new InvalidOperationException($"{message}: expected {expected}, actual {actual}");
        }
        assertionCount++;
    }

    private static void SequenceEqual(byte[] expected, byte[] actual, string message)
    {
        if (!expected.AsSpan().SequenceEqual(actual)) throw new InvalidOperationException(message);
        assertionCount++;
    }

    private static void Throws(Action action, string message)
    {
        try
        {
            action();
        }
        catch (CliException)
        {
            assertionCount++;
            return;
        }
        throw new InvalidOperationException($"Expected CliException: {message}");
    }

    private static void True(bool value, string message)
    {
        if (!value) throw new InvalidOperationException(message);
        assertionCount++;
    }
}

internal static class Utf8TestExtensions
{
    public static byte[] ReplaceUtf8(this byte[] source, string oldValue, string newValue) =>
        Encoding.UTF8.GetBytes(
            Encoding.UTF8.GetString(source).Replace(oldValue, newValue, StringComparison.Ordinal));
}
