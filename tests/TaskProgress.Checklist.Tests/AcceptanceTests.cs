// Exercises permission tags, recorders, fingerprints, ordering and migration on temporary files.
using System.Text;
using System.Text.Json;
using TaskProgress;

internal static partial class Program
{
    private static void VerifyAcceptance(string root)
    {
        var at = DateTimeOffset.Parse("2026-10-22T10:00:00Z", System.Globalization.CultureInfo.InvariantCulture);
        var document = ChecklistDocument.Parse(AcceptanceFixture(executorDone: false));
        SequenceEqual(AcceptanceFixture(executorDone: false), document.Serialize(), "acceptance round-trip");
        True(document.Items[1].Checks[0].IsAcceptance && document.Items[2].Checks[0].IsManual, "tags parsed");
        True(document.HasAcceptance && !document.UntaggedComplete, "acceptance waits for executor");

        var executor = new HashSet<string> { "exec-1" };
        var acceptor = new ChecklistWriter("claude:acc-1", false, "acc-1", executor);
        var self = new ChecklistWriter("claude:exec-1", false, "exec-1", executor);
        Throws(() => document.ApplyTaggedResults([new(2, 0, ChecklistStatus.Passed, null)], acceptor, at),
            "acceptance before executor completes");

        var ready = ChecklistDocument.Parse(AcceptanceFixture(executorDone: true));
        Throws(() => ready.ApplyTaggedResults([new(2, 0, ChecklistStatus.Passed, null)], self, at),
            "executor cannot accept");
        Throws(() => ready.ApplyTaggedResults([new(3, 0, ChecklistStatus.Passed, null)], ChecklistWriter.User, at),
            "manual waits for acceptance");
        Throws(() => ready.ApplyTaggedResults([new(2, 0, ChecklistStatus.Failed, "Wrong.")], acceptor, at),
            "acceptance failure needs a reason");
        Throws(() => ready.ApplyTaggedResults([new(1, 0, ChecklistStatus.Passed, null)], acceptor, at),
            "untagged check is read-only");

        var failed = ready.ApplyTaggedResults(
            [new(2, 0, ChecklistStatus.Failed, "Rounding differs from spec.", null, ChecklistRejectReason.Implementation)],
            acceptor, at);
        var record = failed.Items[1].Checks[0].Record!;
        Equal("claude:acc-1", record.Recorder, "acceptance recorder");
        Equal(ChecklistRejectReason.Implementation, record.RejectReason, "rejection reason");
        Equal(ChecklistResultValidity.Valid, ChecklistDocument.Validity(failed.Items[1].Checks[0]), "fresh result valid");
        var failedBytes = failed.Serialize();
        SequenceEqual(failedBytes, ChecklistDocument.Parse(failedBytes).Serialize(), "recorded round-trip");
        True(Encoding.UTF8.GetString(failedBytes).Contains("- Recorded: claude:acc-1; at=2026-10-22T10:00:00Z; fp=", StringComparison.Ordinal),
            "record line serialized");

        Throws(() => failed.ApplyTaggedResults([new(2, 0, ChecklistStatus.Passed, null)], acceptor, at),
            "reverification needs Resolved");
        var reverified = failed.ApplyTaggedResults(
            [new(2, 0, ChecklistStatus.Passed, null, "Rounding fixed in abc123.")], acceptor, at);
        Equal("Rounding differs from spec.", reverified.Items[1].Checks[0].Observed, "reverification keeps Observed");
        True(reverified.AcceptanceComplete, "acceptance complete after reverification");

        var condition = ready.ApplyTaggedResults(
            [new(2, 0, ChecklistStatus.Failed, "Spec 3.2 says two decimals.", null, ChecklistRejectReason.Condition)],
            acceptor, at);
        Equal(1, condition.Items[1].Checks[0].Record!.ConditionCount, "first condition mismatch");
        var revisedCondition = ChecklistDocument.Parse(Encoding.UTF8.GetBytes(
            Encoding.UTF8.GetString(condition.Serialize()).Replace("Expect: Two decimals.", "Expect: Two decimals, half up.", StringComparison.Ordinal)));
        Equal(ChecklistResultValidity.FingerprintMismatch, ChecklistDocument.Validity(revisedCondition.Items[1].Checks[0]),
            "revised condition voids the old result");
        Equal(ChecklistStatus.Pending, ChecklistDocument.EffectiveStatus(revisedCondition.Items[1].Checks[0]),
            "void result counts as pending");
        var second = revisedCondition.ApplyTaggedResults(
            [new(2, 0, ChecklistStatus.Failed, "Still differs.", null, ChecklistRejectReason.Condition)], acceptor, at);
        Equal(2, second.Items[1].Checks[0].Record!.ConditionCount, "second condition mismatch counts");

        var accepted = ready.ApplyTaggedResults([new(2, 0, ChecklistStatus.Passed, null)], acceptor, at);
        Throws(() => accepted.ApplyTaggedResults([new(3, 0, ChecklistStatus.Passed, null)], acceptor, at),
            "agent cannot pass manual");
        Throws(() => accepted.ApplyTaggedResults([new(3, 0, ChecklistStatus.Failed, null)], acceptor, at),
            "agent manual failure needs Observed");
        var agentRecheck = accepted.ApplyTaggedResults([new(3, 0, ChecklistStatus.Failed, "Layout changed; please recheck.")], self, at);
        Equal(ChecklistStatus.Failed, agentRecheck.Items[2].Checks[0].Status, "agent may ask for a recheck");
        var userPassed = accepted.ApplyTaggedResults([new(3, 0, ChecklistStatus.Passed, null)], ChecklistWriter.User, at);
        Equal("user", userPassed.Items[2].Checks[0].Record!.Recorder, "user recorder");
        True(userPassed.Items.All(item => item.Status == ChecklistStatus.Passed), "all passed");

        var later = at.AddMinutes(5);
        var acceptedCheck = accepted.Items[1].Checks[0];
        Equal(ChecklistResultValidity.PassedBeforeRelease, ChecklistDocument.Validity(acceptedCheck, later),
            "a later release voids the pass");
        Equal(ChecklistStatus.Pending, ChecklistDocument.EffectiveStatus(acceptedCheck, later), "voided pass counts as pending");
        Equal(ChecklistResultValidity.Valid, ChecklistDocument.Validity(acceptedCheck, at.AddMinutes(-5)),
            "an earlier release keeps the pass");
        True(!accepted.IsAcceptanceComplete(later) && accepted.IsAcceptanceComplete(at), "acceptance reopens after a later release");
        Equal(ChecklistResultValidity.Valid, ChecklistDocument.Validity(failed.Items[1].Checks[0], later),
            "a release never voids a failure");
        Throws(() => accepted.ApplyTaggedResults([new(3, 0, ChecklistStatus.Passed, null)], ChecklistWriter.User with { ReleasedAt = later }, later),
            "manual locks again until the voided acceptance is re-recorded");
        var reaccepted = accepted.ApplyTaggedResults([new(2, 0, ChecklistStatus.Passed, null)], acceptor, later.AddMinutes(1));
        True(reaccepted.IsAcceptanceComplete(later), "re-recording the pass after the release restores acceptance");

        var legacy = ChecklistDocument.Parse(Encoding.UTF8.GetBytes(
            Encoding.UTF8.GetString(AcceptanceFixture(executorDone: true)).Replace("- [ ] **3. Manual**", "- [x] **3. Manual**", StringComparison.Ordinal)
                .Replace("    - [ ] **Decimal input** `[manual]`", "    - [x] **Decimal input** `[manual]`", StringComparison.Ordinal)));
        True(legacy.Issues().Count == 1, "unrecorded result is an issue");
        Equal(ChecklistResultValidity.NoRecorder, ChecklistDocument.Validity(legacy.Items[2].Checks[0]), "unrecorded validity");
        var migrated = legacy.MigrateLegacyResults(at, out var count);
        Equal(1, count, "one result migrated");
        Equal("legacy", migrated.Items[2].Checks[0].Record!.Recorder, "legacy recorder");
        True(migrated.Issues().Count == 0, "migration clears the issue");
        migrated.MigrateLegacyResults(at, out var again);
        Equal(0, again, "migration leaves recorded results alone");

        VerifyAgentBridge(root, at);
    }

    private static void VerifyAgentBridge(string root, DateTimeOffset at)
    {
        var scopeRoot = Path.Combine(root, "acceptance-scope");
        var checklists = Path.Combine(scopeRoot, "checklists");
        Directory.CreateDirectory(checklists);
        var path = Path.Combine(checklists, "decimals.checklist");
        File.WriteAllBytes(path, AcceptanceFixture(executorDone: true));
        var agent = new ChecklistBridge(path, fromUser: false);
        object accept = new { workItemId = 2, checkIndex = 0, status = "passed" };

        Equal("forbidden", ErrorCode(agent, "set", accept, "claude", "acc-1"), "unbound checklist rejects agent writes");
        File.WriteAllText(Path.Combine(scopeRoot, "report.json"), JsonSerializer.Serialize(new
        {
            scope_id = "acc",
            tasks = new object[]
            {
                new
                {
                    id = "card",
                    pending_items = new object[]
                    {
                        new
                        {
                            id = "decimals",
                            document_ref = new { kind = "checklist", scope_id = "acc", task = "decimals" },
                            activity = new object[]
                            {
                                new { @event = "created", actor = "claude", session_id = "plan-1", at = "2026-10-22T08:00:00Z" },
                                new { @event = "started", actor = "claude", session_id = "exec-1", at = "2026-10-22T09:00:00Z" },
                            },
                        },
                    },
                },
            },
        }));
        Equal("invalid_request", ErrorCode(agent, "set", accept, null, null), "agent write needs actor");
        Equal("invalid_request", ErrorCode(agent, "set", accept, "user", "acc-1"), "agent cannot claim user");
        Equal("invalid_request", ErrorCode(agent, "set", accept, "claude", "exec-1"), "executor session rejected");
        Equal("invalid_request", ErrorCode(agent, "set", accept, "claude", "plan-1"), "creator session rejected");
        Equal("forbidden", ErrorCode(agent, "reset", new { }, "claude", "acc-1"), "agent cannot reset");
        Equal(null, ErrorCode(agent, "set", accept, "claude", "acc-1"), "other session accepts");
        Equal("claude:acc-1", new ChecklistDocumentStore().Load(path).Items[1].Checks[0].Record!.Recorder, "bridge stamps recorder");
        var user = new ChecklistBridge(path);
        Equal("invalid_request", ErrorCode(user, "set", new { workItemId = 3, checkIndex = 0, status = "passed" }, "claude", "x"),
            "panel writes carry no actor");
        Equal(null, ErrorCode(user, "set", new { workItemId = 3, checkIndex = 0, status = "passed" }, null, null), "panel passes manual");
        using var snapshot = JsonDocument.Parse(user.Handle(JsonSerializer.Serialize(new { version = 1, id = "load", type = "load" })));
        var check = snapshot.RootElement.GetProperty("payload").GetProperty("items")[2].GetProperty("checks")[0];
        Equal("manual", check.GetProperty("tag").GetString(), "snapshot tag");
        Equal("valid", check.GetProperty("validity").GetString(), "snapshot validity");
        Equal("user", check.GetProperty("recorder").GetString(), "snapshot recorder");

        var reportPath = Path.Combine(scopeRoot, "report.json");
        var report = System.Text.Json.Nodes.JsonNode.Parse(File.ReadAllText(reportPath))!.AsObject();
        var item = report["tasks"]![0]!["pending_items"]![0]!.AsObject();
        var resolver = new ItemStateResolver(scopeRoot, report);
        Equal(ItemStates.Done, resolver.StateOf("acc", item), "accepted and manually passed item is done");
        item["activity"]!.AsArray().Add(new System.Text.Json.Nodes.JsonObject
        {
            ["event"] = "released",
            ["actor"] = "claude",
            ["session_id"] = "exec-1",
            ["at"] = DateTimeOffset.UtcNow.AddMinutes(1).ToString("O", System.Globalization.CultureInfo.InvariantCulture),
        });
        File.WriteAllText(reportPath, report.ToJsonString());
        Equal(ItemStates.AwaitingAcceptance, new ItemStateResolver(scopeRoot, report).StateOf("acc", item),
            "work released after the passes reopens acceptance");
        using var reopened = JsonDocument.Parse(user.Handle(JsonSerializer.Serialize(new { version = 1, id = "load", type = "load" })));
        var reopenedPayload = reopened.RootElement.GetProperty("payload");
        Equal(false, reopenedPayload.GetProperty("acceptanceComplete").GetBoolean(), "snapshot reopens acceptance");
        var reopenedCheck = reopenedPayload.GetProperty("items")[1].GetProperty("checks")[0];
        Equal("released", reopenedCheck.GetProperty("validity").GetString(), "snapshot names the release");
        Equal("pending", reopenedCheck.GetProperty("effectiveStatus").GetString(), "snapshot counts the voided pass as pending");

        string WaitingOn(int workItem) => new ItemStateResolver(scopeRoot, report).StateOf("acc", new System.Text.Json.Nodes.JsonObject
        {
            ["id"] = "closure",
            ["status"] = "blocked",
            ["waits_for"] = new System.Text.Json.Nodes.JsonArray(new System.Text.Json.Nodes.JsonObject
            {
                ["scope_id"] = "acc",
                ["checklist"] = "decimals",
                ["work_item"] = workItem,
            }),
        });
        Equal(ItemStates.Blocked, WaitingOn(1), "a passed work item releases the wait to the stored status");
        Equal(ItemStates.Waiting, WaitingOn(2), "a pass voided by the bound item's release keeps the wait");
        Equal(ItemStates.Waiting, WaitingOn(9), "an unknown work item keeps the wait");
    }

    private static string? ErrorCode(ChecklistBridge bridge, string type, object payload, string? actor, string? session)
    {
        var request = actor is null
            ? JsonSerializer.Serialize(new { version = 1, id = "acc", type, payload })
            : JsonSerializer.Serialize(new { version = 1, id = "acc", type, payload, actor, sessionId = session });
        using var response = JsonDocument.Parse(bridge.Handle(request));
        return response.RootElement.GetProperty("type").GetString() == "error"
            ? response.RootElement.GetProperty("error").GetProperty("code").GetString()
            : null;
    }

    private static byte[] AcceptanceFixture(bool executorDone)
    {
        var mark = executorDone ? "x" : " ";
        var text = $"""
            # Decimals Checklist

            Current round: `spec.md#decimals`.

            - [{mark}] **1. Implement decimals**
              Outcome: Settings accept decimals.
              Checks:
                - [{mark}] **Unit tests**
                  - Action: Run the tests.
                  - Expect: They pass.

            - [ ] **2. Cross verification**
              Outcome: Another session confirms against the spec.
              Checks:
                - [ ] **Decimals match spec** `[acceptance]`
                  - Action: Compare with spec.md#decimals.
                  - Expect: Two decimals.

            - [ ] **3. Manual**
              Outcome: The user accepts the change.
              Checks:
                - [ ] **Decimal input** `[manual]`
                  - Action: Type 1.25.
                  - Expect: Shows 1.25.
                  - Reason: Feel is the user's call.
            """;
        return Encoding.UTF8.GetBytes(text.ReplaceLineEndings("\n") + "\n");
    }
}
