// Checks that a wait is met while the waited item lacks only the user's acceptance, that strict waits still hold, that a user failure sends started waiters back to fixing, and that a manual-only checklist works.
using System.Text;
using System.Text.Json.Nodes;
using TaskProgress;

internal static partial class Program
{
    private static void VerifyManualWaits(string root)
    {
        var failedAt = DateTimeOffset.Parse("2026-10-25T10:00:00Z", System.Globalization.CultureInfo.InvariantCulture);
        var main = Path.Combine(root, "manual-wait-main");
        var other = Path.Combine(root, "manual-wait-other");
        foreach (var folder in new[] { main, other }) Directory.CreateDirectory(Path.Combine(folder, "checklists"));

        File.WriteAllBytes(Path.Combine(main, "checklists", "only-manual.checklist"), ManualWaitFixture(executorDone: true));
        File.WriteAllBytes(Path.Combine(main, "checklists", "work-open.checklist"), ManualWaitFixture(executorDone: false));
        File.WriteAllBytes(Path.Combine(main, "checklists", "user-failed.checklist"),
            ChecklistDocument.Parse(ManualWaitFixture(executorDone: true))
                .ApplyTaggedResults([new(2, 0, ChecklistStatus.Failed, "Label did not change.")], ChecklistWriter.User, failedAt)
                .Serialize());
        File.WriteAllBytes(Path.Combine(other, "checklists", "remote.checklist"), ManualWaitFixture(executorDone: true));

        static string Bound(string id, string stem, string scope = "mw") =>
            $$"""{ "id": "{{id}}", "document_ref": { "kind": "checklist", "scope_id": "{{scope}}", "task": "{{stem}}" } }""";
        const string started = """, "activity": [ { "event": "started", "actor": "claude", "at": "2026-10-25T09:00:00Z" } ]""";
        const string redone = """, "activity": [ { "event": "started", "actor": "claude", "at": "2026-10-25T09:00:00Z" }, { "event": "released", "actor": "claude", "at": "2026-10-25T11:00:00Z" } ]""";

        var mainReport = $$"""
            {
              "schema_version": "1.0", "report_id": "mw", "scope_id": "mw",
              "tasks": [
                { "id": "card", "title": "C", "status": "in_progress",
                  "pending_items": [
                    {{Bound("only-manual", "only-manual")}},
                    {{Bound("work-open", "work-open")}},
                    {{Bound("user-failed", "user-failed")}},
                    { "id": "lifted", "waits_for": [ { "scope_id": "mw", "task_id": "card", "item_id": "only-manual" } ] },
                    { "id": "strict", "waits_for": [ { "scope_id": "mw", "task_id": "card", "item_id": "only-manual", "strict": true } ] },
                    { "id": "work-pending", "waits_for": [ { "scope_id": "mw", "task_id": "card", "item_id": "work-open" } ] },
                    { "id": "redo", "waits_for": [ { "scope_id": "mw", "task_id": "card", "item_id": "user-failed" } ]{{started}} },
                    { "id": "redone", "waits_for": [ { "scope_id": "mw", "task_id": "card", "item_id": "user-failed" } ]{{redone}} },
                    { "id": "never-started", "waits_for": [ { "scope_id": "mw", "task_id": "card", "item_id": "user-failed" } ] },
                    { "id": "strict-failed", "waits_for": [ { "scope_id": "mw", "task_id": "card", "item_id": "user-failed", "strict": true } ]{{started}} },
                    { "id": "chain", "waits_for": [ { "scope_id": "mw-other", "task_id": "card", "item_id": "remote" } ] }
                  ],
                  "completed_items": [
                    { "id": "done-then-failed", "status": "done", "waits_for": [ { "scope_id": "mw", "task_id": "card", "item_id": "user-failed" } ],
                      "activity": [ { "event": "started", "actor": "claude", "at": "2026-10-25T08:00:00Z" }, { "event": "done", "actor": "claude", "at": "2026-10-25T09:30:00Z" } ] }
                  ] }
              ]
            }
            """;
        var otherReport = $$"""
            { "schema_version": "1.0", "report_id": "mw-other", "scope_id": "mw-other", "tasks": [ { "id": "card", "title": "O", "status": "in_progress",
              "pending_items": [ {{Bound("remote", "remote", "mw-other")}} ] } ] }
            """;
        File.WriteAllText(Path.Combine(main, "report.json"), mainReport);
        File.WriteAllText(Path.Combine(other, "report.json"), otherReport);
        var store = new ScopeStore(Path.Combine(root, "manual-wait-scopes.json"));
        store.Add("mw", main);
        store.Add("mw-other", other);

        var report = JsonNode.Parse(mainReport)!.AsObject();
        var resolver = new ItemStateResolver(main, report, store);
        var card = report["tasks"]![0]!;
        string State(string id) =>
            new[] { "pending_items", "completed_items" }
                .Select(list => (List: list, Item: card[list]!.AsArray().OfType<JsonObject>().FirstOrDefault(item => item["id"]!.GetValue<string>() == id)))
                .Where(found => found.Item is not null)
                .Select(found => resolver.StateOf("mw", found.Item!, completed: found.List == "completed_items"))
                .First();

        Equal(ItemStates.AwaitingUser, State("only-manual"), "a manual-only remainder awaits the user");
        Equal(ItemStates.NotStarted, State("lifted"), "a wait is met while the waited item lacks only the user's acceptance");
        Equal(ItemStates.Waiting, State("strict"), "a strict wait holds until the user accepts");
        Equal(ItemStates.Waiting, State("work-pending"), "a wait holds while the waited item's own checks are open");
        Equal(ItemStates.NeedsFix, State("user-failed"), "the user's failure needs a fix");
        Equal(ItemStates.NeedsFix, State("redo"), "a started waiter needs redoing after the user fails the waited item");
        Equal(ItemStates.Waiting, State("redone"), "a waiter released after the failure waits for the fix");
        Equal(ItemStates.Waiting, State("never-started"), "a waiter that never started just waits");
        Equal(ItemStates.Waiting, State("strict-failed"), "a strict waiter never proceeded, so it only waits");
        Equal(ItemStates.NeedsFix, State("done-then-failed"), "a waiter done before the failure cannot stay done");
        Equal(ItemStates.NotStarted, State("chain"), "a wait across scopes is met by a remote manual-only remainder");

        var manualOnly = ChecklistDocument.Parse(ManualOnlyFixture());
        True(manualOnly.UntaggedComplete && manualOnly.IsAcceptanceComplete(null), "a manual-only checklist has no executor or acceptance work");
        Throws(() => manualOnly.ApplyTaggedResults([new(1, 0, ChecklistStatus.Passed, null)],
            new ChecklistWriter("claude:s-1", false, "s-1", new HashSet<string>()), failedAt), "an agent cannot pass a manual check");
        var accepted = manualOnly.ApplyTaggedResults([new(1, 0, ChecklistStatus.Passed, null)], ChecklistWriter.User, failedAt);
        File.WriteAllBytes(Path.Combine(main, "checklists", "closure.checklist"), ManualOnlyFixture());
        var closure = JsonNode.Parse(Bound("closure", "closure"))!.AsObject();
        Equal(ItemStates.AwaitingUser, resolver.StateOf("mw", closure), "a manual-only close-out awaits the user");
        File.WriteAllBytes(Path.Combine(main, "checklists", "closure-accepted.checklist"), accepted.Serialize());
        var acceptedClosure = JsonNode.Parse(Bound("closure-accepted", "closure-accepted"))!.AsObject();
        Equal(ItemStates.Done, new ItemStateResolver(main, report, store).StateOf("mw", acceptedClosure), "the user's pass completes a manual-only close-out");
    }

    private static byte[] ManualWaitFixture(bool executorDone)
    {
        var mark = executorDone ? "x" : " ";
        var text = $"""
            # Hold Checklist

            Current round: `spec.md#hold`.

            - [{mark}] **1. Implement hold**
              Outcome: Holding changes the label.
              Checks:
                - [{mark}] **Unit tests**
                  - Action: Run the tests.
                  - Expect: They pass.

            - [ ] **2. Manual**
              Outcome: The user accepts the hold.
              Checks:
                - [ ] **Hold feel** `[manual]`
                  - Action: Hold the button.
                  - Expect: The label changes.
                  - Reason: Feel is the user's call.
            """;
        return Encoding.UTF8.GetBytes(text.ReplaceLineEndings("\n") + "\n");
    }

    private static byte[] ManualOnlyFixture()
    {
        const string text = """
            # Close-out Checklist

            Current round: `plan.md#close-out`.

            - [ ] **1. Card goal**
              Outcome: The user accepts the card's result against its goal.
              Checks:
                - [ ] **Goal reached** `[manual]`
                  - Action: Open the card and read the delivery.
                  - Expect: The result matches the goal.
                  - Reason: Intent is the user's call.
            """;
        return Encoding.UTF8.GetBytes(text.ReplaceLineEndings("\n") + "\n");
    }
}
