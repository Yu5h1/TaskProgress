// Checks the Next rules the CLI shares with the Viewer: shown while it needs taking up, derived only on request.
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
        JsonObject Fresh(string? next) => Report(next);
        ItemStateResolver For(JsonObject report) => new(scopeRoot, report);
        string? Field(JsonObject? marker, string field) => marker?[field]?.GetValue<string>();

        var withLow = Fresh("low");
        Equal("low", Field(NextMarker.Effective(withLow, "nm", For(withLow)), "item_id"), "an item that needs taking up stays the Next");
        True(NextMarker.Keeps(withLow, "nm", For(withLow))?.Contains("仍有效") == true, "report next keeps an effective marker");

        foreach (var stale in new[] { "wait", "finished", "shelved", "gone" })
        {
            var report = Fresh(stale);
            True(NextMarker.Effective(report, "nm", For(report)) is null, $"a Next on {stale} is not shown");
            True(NextMarker.Keeps(report, "nm", For(report)) is null, $"report next may replace a Next on {stale}");
            Equal("u1", Field(NextMarker.Derive(report, "nm", For(report)), "item_id"), $"deriving after {stale} takes card priority first");
        }

        var inProgress = Fresh("mid");
        True(NextMarker.Effective(inProgress, "nm", For(inProgress)) is null, "an in-progress Next is not shown");
        True(NextMarker.Keeps(inProgress, "nm", For(inProgress))?.Contains("執行中") == true, "report next keeps an in-progress Next");

        var cleared = Fresh(null);
        True(NextMarker.Effective(cleared, "nm", For(cleared)) is null, "a cleared marker shows no Next");
        True(NextMarker.Keeps(cleared, "nm", For(cleared)) is null, "report next may set a cleared marker");
        Equal("low", Field(NextMarker.Derive(cleared, "nm", For(cleared), "card"), "item_id"), "a card narrows the choice; waiting, in-progress and archived items are skipped");
        True(NextMarker.Derive(cleared, "nm", For(cleared), "pointer") is null, "a pointer card offers nothing");

        var released = Fresh("mid");
        released["tasks"]![1]!["pending_items"]![2]!.AsObject().Remove("status");
        Equal("mid", Field(NextMarker.Effective(released, "nm", For(released)), "item_id"), "a released item is the Next again");

        var refusals = Report(null);
        var resolver = new ItemStateResolver(scopeRoot, refusals);
        Equal("執行中的子項目不能設為 Next。", NextMarker.Refusal(refusals, "nm", "card", "mid", resolver), "in progress is refused");
        Equal("等待中的子項目不能設為 Next。", NextMarker.Refusal(refusals, "nm", "card", "wait", resolver), "waiting is refused");
        Equal("已封存的子項目不能設為 Next。", NextMarker.Refusal(refusals, "nm", "card", "shelved", resolver), "archived is refused");
        True(NextMarker.Refusal(refusals, "nm", "card", "finished", resolver)?.Contains("不是待處理") == true, "a completed item is not pending");
        Equal<string?>(null, NextMarker.Refusal(refusals, "nm", "card", "low", resolver), "an open item can be the Next");
    }
}
