// Checks that report get's effective Next follows the Viewer's rule: stored while it needs taking up, else derived.
using System.Text.Json.Nodes;
using TaskProgress;

internal static partial class Program
{
    private static void VerifyNextMarker(string root)
    {
        var scopeRoot = Path.Combine(root, "next-marker");
        Directory.CreateDirectory(scopeRoot);
        JsonObject Report(string? nextItem) => JsonNode.Parse($$"""
            {
              "scope_id": "nm",
              {{(nextItem is null ? "" : $"\"next\": {{ \"task_id\": \"card\", \"item_id\": \"{nextItem}\" }},")}}
              "tasks": [
                { "id": "pointer", "kind": "report_pointer", "title": "P", "report_ref": { "scope_id": "other" } },
                { "id": "card", "title": "C", "status": "in_progress", "priority": 2, "pending_items": [
                  { "id": "wait", "priority": 0, "waits_for": [ { "scope_id": "nm", "task_id": "card", "item_id": "low" } ] },
                  { "id": "low", "priority": 3 },
                  { "id": "mid", "priority": 1, "status": "in_progress" },
                  { "id": "shelved", "priority": 0, "status": "archive" }
                ], "completed_items": [ { "id": "finished", "status": "done" } ] },
                { "id": "urgent", "title": "U", "status": "planned", "priority": 0, "pending_items": [ { "id": "u1", "priority": 2 } ] }
              ]
            }
            """)!.AsObject();
        string? Effective(JsonObject report, string field) =>
            NextMarker.Effective(report, "nm", new ItemStateResolver(scopeRoot, report))?[field]?.GetValue<string>();

        var withLow = Report("low");
        Equal("low", Effective(withLow, "item_id"), "an item that needs taking up stays the Next");
        Equal("stored", Effective(withLow, "source"), "the stored marker is reported as stored");

        foreach (var stale in new[] { "mid", "wait", "finished", "shelved", "gone" })
        {
            var report = Report(stale);
            Equal("u1", Effective(report, "item_id"), $"a Next on {stale} falls back to the derived step, card priority first");
            Equal("derived", Effective(report, "source"), $"the fallback from {stale} is reported as derived");
        }

        var cleared = Report(null);
        True(NextMarker.Effective(cleared, "nm", new ItemStateResolver(scopeRoot, cleared)) is null, "a cleared marker shows no Next");

        var released = Report("mid");
        released["tasks"]![1]!["pending_items"]![2]!.AsObject().Remove("status");
        Equal("mid", Effective(released, "item_id"), "a released item is the Next again");

        var onlyCard = Report("mid");
        onlyCard["tasks"]!.AsArray().RemoveAt(2);
        Equal("low", Effective(onlyCard, "item_id"), "waiting, in-progress and archived items are skipped");

        var refusals = Report(null);
        var resolver = new ItemStateResolver(scopeRoot, refusals);
        Equal("執行中的子項目不能設為 Next。", NextMarker.Refusal(refusals, "nm", "card", "mid", resolver), "in progress is refused");
        Equal("等待中的子項目不能設為 Next。", NextMarker.Refusal(refusals, "nm", "card", "wait", resolver), "waiting is refused");
        Equal("已封存的子項目不能設為 Next。", NextMarker.Refusal(refusals, "nm", "card", "shelved", resolver), "archived is refused");
        True(NextMarker.Refusal(refusals, "nm", "card", "finished", resolver)?.Contains("不是待處理") == true, "a completed item is not pending");
        Equal<string?>(null, NextMarker.Refusal(refusals, "nm", "card", "low", resolver), "an open item can be the Next");
    }
}
