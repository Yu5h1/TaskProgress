// Exercises the structured Checklist document contract without an external test framework.
using System.Text;
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
            SequenceEqual(source, document.Serialize(), "unchanged byte round-trip");

            var updated = document.ApplyManualResults([
                new ChecklistManualResult(1, 1, ChecklistStatus.Failed, "Button remained disabled."),
            ]);
            Equal(ChecklistStatus.Failed, updated.Items[0].Status, "derived failed status");
            True(
                Encoding.UTF8.GetString(updated.Serialize()).Contains(
                    "Observed: Button remained disabled.",
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

            var path = Path.Combine(root, "implementation-checklist.md");
            File.WriteAllBytes(path, source);
            var store = new ChecklistDocumentStore();
            var loaded = store.Load(path);
            File.AppendAllText(path, "<!-- external -->", Encoding.UTF8);
            Throws(() => store.Save(path, loaded.Revision, loaded), "revision conflict");
            True(
                File.ReadAllText(path, Encoding.UTF8).EndsWith("<!-- external -->", StringComparison.Ordinal),
                "conflict overwrote external content");

            Console.WriteLine("Checklist document core tests passed: 16 checks.");
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
            "      Action: Run a test.",
            "      Expect: It passes.",
            "    - [ ] **Rendered proof** `[manual]`",
            "      Action: Select a result.",
            "      Expect: It is saved.",
            "      Reason: Requires direct UX judgment.",
            "",
            "- [x] **2. Frozen item**",
            "  Outcome: Saved results remain immutable.",
            "  Checks:",
            "    - [x] **Existing proof**",
            "      Action: Run the old proof.",
            "      Expect: It passed.",
            "",
        ]);
        var body = new UTF8Encoding(false).GetBytes(text);
        if (!bom) return body;
        return [.. Encoding.UTF8.Preamble, .. body];
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
