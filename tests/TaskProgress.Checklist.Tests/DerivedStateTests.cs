// Checks that an item with no stored status takes its state from the array it sits in, for report get and for waits.
using System.Text.Json.Nodes;
using TaskProgress;

internal static partial class Program
{
    private static void VerifyArrayFallback(string root)
    {
        var scopeRoot = Path.Combine(root, "array-fallback");
        Directory.CreateDirectory(Path.Combine(scopeRoot, "checklists"));
        File.WriteAllBytes(Path.Combine(scopeRoot, "checklists", "bound.checklist"), Sample("\n", bom: false));
        const string reportText = """
            {
              "scope_id": "af",
              "tasks": [
                { "id": "card", "title": "C", "status": "in_progress",
                  "pending_items": [
                    { "id": "open" },
                    { "id": "waiter", "waits_for": [ { "scope_id": "af", "task_id": "card", "item_id": "finished" } ] },
                    { "id": "waits-open", "waits_for": [ { "scope_id": "af", "task_id": "card", "item_id": "open" } ] }
                  ],
                  "completed_items": [
                    { "id": "finished" },
                    { "id": "explicit", "status": "in_progress" },
                    { "id": "bound", "document_ref": { "kind": "checklist", "scope_id": "af", "task": "bound" } }
                  ] }
              ]
            }
            """;
        File.WriteAllText(Path.Combine(scopeRoot, "report.json"), reportText);

        string StateIn(JsonNode? output, string list, string id) =>
            output!.AsObject()[list]!.AsArray().OfType<JsonObject>()
                .First(item => item["id"]!.GetValue<string>() == id)["derived_state"]!.GetValue<string>();

        var full = JsonNode.Parse(ReportCommand.WithDerivedStates(scopeRoot,
            new JsonObject { ["ok"] = true, ["report"] = JsonNode.Parse(reportText) }.ToJsonString()))!["report"]!["tasks"]![0];
        var single = JsonNode.Parse(ReportCommand.WithDerivedStates(scopeRoot,
            new JsonObject { ["ok"] = true, ["task"] = JsonNode.Parse(reportText)!["tasks"]![0]!.DeepClone() }.ToJsonString()))!["task"];

        foreach (var (label, output) in new[] { ("report get", full), ("report get --task", single) })
        {
            Equal(ItemStates.Done, StateIn(output, "completed_items", "finished"), $"{label}: an unbound completed item without status is done");
            Equal(ItemStates.NotStarted, StateIn(output, "pending_items", "open"), $"{label}: an unbound pending item without status is not started");
            Equal(ItemStates.InProgress, StateIn(output, "completed_items", "explicit"), $"{label}: a stored status outranks the array");
            True(StateIn(output, "completed_items", "bound") != ItemStates.Done, $"{label}: a bound checklist decides, not the array");
            Equal(ItemStates.NotStarted, StateIn(output, "pending_items", "waiter"), $"{label}: a wait on a completed item without status is lifted");
            Equal(ItemStates.Waiting, StateIn(output, "pending_items", "waits-open"), $"{label}: a wait on a pending item still holds");
        }

        var report = JsonNode.Parse(reportText)!.AsObject();
        var resolver = new ItemStateResolver(scopeRoot, report);
        var finished = report["tasks"]![0]!["completed_items"]![0]!.AsObject();
        Equal(ItemStates.Done, resolver.StateOf("af", finished), "the resolver finds the array itself when the caller does not say");
        True(resolver.IsDone("af", "card", "finished", 0), "the dependency path reads the array");

        Directory.CreateDirectory(Path.Combine(scopeRoot, "decisions"));
        static string Decisions(string second) =>
            $$"""{ "decisions": [ { "id": "a", "status": "decided", "answer": { "kind": "option", "option_id": "x" } }, { "id": "b", "status": "{{second}}", "answer": {{(second == "decided" ? "{ \"kind\": \"option\", \"option_id\": \"y\" }" : "null")}} } ] }""";
        File.WriteAllText(Path.Combine(scopeRoot, "decisions", "answered.decisions"), Decisions("decided"));
        File.WriteAllText(Path.Combine(scopeRoot, "decisions", "open.decisions"), Decisions("pending"));
        JsonObject DecisionItem(string stem) => JsonNode.Parse(
            $$"""{ "id": "{{stem}}", "status": "planned", "document_ref": { "kind": "decision", "scope_id": "af", "task": "{{stem}}" } }""")!.AsObject();
        Equal(ItemStates.Done, resolver.StateOf("af", DecisionItem("answered")), "a fully answered decisions file completes its item");
        Equal(ItemStates.NotStarted, resolver.StateOf("af", DecisionItem("open")), "an open decision keeps its item unfinished");

        JsonObject Retired(string status, bool bound) => JsonNode.Parse(
            $$"""{ "id": "r", "status": "{{status}}", "retirement": { "reason": "x" }{{(bound ? ", \"document_ref\": { \"kind\": \"checklist\", \"scope_id\": \"af\", \"task\": \"bound\" }" : "")}} }""")!.AsObject();
        Equal(ItemStates.Obsolete, resolver.StateOf("af", Retired("obsolete", bound: false)), "an obsolete item reads obsolete");
        Equal(ItemStates.Discontinued, resolver.StateOf("af", Retired("discontinued", bound: true)), "a retired bound item ignores its checklist");
        var retiredReport = JsonNode.Parse("""
            { "scope_id": "af", "tasks": [ { "id": "card", "title": "C", "status": "in_progress",
              "pending_items": [ { "id": "gone", "status": "obsolete", "retirement": { "replaced_by": { "scope_id": "af", "task_id": "card", "item_id": "live" } } }, { "id": "live" } ] } ] }
            """)!.AsObject();
        var next = NextMarker.Derive(retiredReport, "af", new ItemStateResolver(scopeRoot, retiredReport), null);
        Equal("live", next?["item_id"]?.GetValue<string>(), "Next skips a retired item");
    }
}
