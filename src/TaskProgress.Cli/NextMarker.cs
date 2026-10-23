// Derives the Next a Report shows: the stored marker while effective, else the derived next step.
using System.Text.Json.Nodes;

namespace TaskProgress;

/// <summary>
///   The scope's Next (Documentation/NextMarkerPlan.md, decision 3). A stored marker is effective
///   while its item still needs someone to take it up, by the same rule as the Viewer's
///   <c>next-marker.js</c>. Nothing derives a Next on its own: <see cref="Derive"/> runs only
///   when an agent asks for it through <c>report next</c>.
/// </summary>
internal static class NextMarker
{
    private const int DefaultPriority = 4;
    private static readonly HashSet<string> NotTakeUp = new(StringComparer.Ordinal)
    {
        ItemStates.Done, ItemStates.Waiting, ItemStates.InProgress, ItemStates.Archived,
    };

    /// <summary>
    ///   The stored marker as <c>{ task_id, item_id }</c> while it is effective; null when it is
    ///   cleared or its item no longer needs taking up.
    /// </summary>
    internal static JsonObject? Effective(JsonObject report, string scope, ItemStateResolver resolver)
    {
        var marked = StoredItem(report, out var taskId, out var itemId);
        return marked is not null && TakesUp(scope, marked, resolver) ? Marker(taskId!, itemId!) : null;
    }

    /// <summary>
    ///   Why <c>report next</c> must not replace the stored marker, or null when it may: an
    ///   effective marker stays, and so does one whose item is only in progress.
    /// </summary>
    internal static string? Keeps(JsonObject report, string scope, ItemStateResolver resolver)
    {
        var marked = StoredItem(report, out _, out var itemId);
        if (marked is null) return null;
        if (TakesUp(scope, marked, resolver)) return $"Next「{itemId}」仍有效，不改寫；要換請用 next.set。";
        return resolver.StateOf(scope, marked) == ItemStates.InProgress
            ? $"Next「{itemId}」執行中，不改寫；釋放後它會恢復。"
            : null;
    }

    /// <summary>
    ///   The first item that needs taking up, by card priority, the card's highest item priority
    ///   and source order, then item priority; within one card when <paramref name="taskId"/> is
    ///   given. Null when nothing qualifies.
    /// </summary>
    internal static JsonObject? Derive(JsonObject report, string scope, ItemStateResolver resolver, string? taskId = null)
    {
        var tasks = (report["tasks"] as JsonArray)?.OfType<JsonObject>().ToList() ?? [];
        foreach (var candidate in RankTasks(tasks).Where(Actionable)
                     .Where(task => taskId is null || Text(task["id"]) == taskId))
        {
            var first = RankItems(Pending(candidate)).FirstOrDefault(item => TakesUp(scope, item, resolver));
            if (first is not null) return Marker(Text(candidate["id"])!, Text(first["id"])!);
        }
        return null;
    }

    private static JsonObject? StoredItem(JsonObject report, out string? taskId, out string? itemId)
    {
        taskId = null;
        itemId = null;
        if (report["next"] is not JsonObject stored) return null;
        taskId = Text(stored["task_id"]);
        itemId = Text(stored["item_id"]);
        var id = taskId;
        var task = (report["tasks"] as JsonArray)?.OfType<JsonObject>().FirstOrDefault(candidate => Text(candidate["id"]) == id);
        var item = itemId;
        return task is not null && Actionable(task)
            ? Pending(task).FirstOrDefault(entry => Text(entry["id"]) == item)
            : null;
    }

    /// <summary>
    ///   Why an item cannot become the Next, or null when it can: it must be an object item
    ///   still pending on its task that someone has to take up.
    /// </summary>
    internal static string? Refusal(JsonObject report, string scope, string? taskId, string? itemId, ItemStateResolver resolver)
    {
        var task = (report["tasks"] as JsonArray)?.OfType<JsonObject>().FirstOrDefault(candidate => Text(candidate["id"]) == taskId);
        if (task is null) return $"找不到任務「{taskId}」。";
        var item = Pending(task).FirstOrDefault(candidate => Text(candidate["id"]) == itemId);
        if (item is null) return $"「{itemId}」不是待處理的子項目，不能設為 Next。";
        return resolver.StateOf(scope, item) switch
        {
            ItemStates.Done => "已完成的子項目不能設為 Next。",
            ItemStates.Archived => "已封存的子項目不能設為 Next。",
            ItemStates.Waiting => "等待中的子項目不能設為 Next。",
            ItemStates.InProgress => "執行中的子項目不能設為 Next。",
            _ => null,
        };
    }

    private static bool TakesUp(string scope, JsonObject item, ItemStateResolver resolver) =>
        Text(item["id"]) is { Length: > 0 }
        && Text(item["status"]) is not ("done" or "archive")
        && !NotTakeUp.Contains(resolver.StateOf(scope, item));

    private static bool Actionable(JsonObject task) =>
        (Text(task["kind"]) ?? "standard") != "report_pointer"
        && Text(task["status"]) is not ("done" or "archive");

    private static IEnumerable<JsonObject> Pending(JsonObject task) =>
        (task["pending_items"] as JsonArray)?.OfType<JsonObject>() ?? [];

    private static IEnumerable<JsonObject> RankTasks(List<JsonObject> tasks) =>
        tasks.Select((task, index) => (task, index))
            .OrderBy(entry => Priority(entry.task["priority"]))
            .ThenBy(entry => LeadItemPriority(entry.task))
            .ThenBy(entry => entry.index)
            .Select(entry => entry.task);

    private static IEnumerable<JsonObject> RankItems(IEnumerable<JsonObject> items) =>
        items.Select((item, index) => (item, index))
            .OrderBy(entry => Priority(entry.item["priority"]))
            .ThenBy(entry => entry.index)
            .Select(entry => entry.item);

    private static int LeadItemPriority(JsonObject task) =>
        (task["pending_items"] as JsonArray ?? [])
            .Where(item => item is not JsonObject entry || Text(entry["status"]) is not ("archive" or "done"))
            .Select(item => item is JsonObject entry ? Priority(entry["priority"]) : DefaultPriority)
            .DefaultIfEmpty(DefaultPriority)
            .Min();

    private static int Priority(JsonNode? value)
    {
        if (value is not JsonValue scalar) return DefaultPriority;
        if (scalar.TryGetValue<int>(out var number)) return number is >= 0 and <= 4 ? number : DefaultPriority;
        if (scalar.TryGetValue<double>(out var real)) return real is >= 0 and <= 4 && real == Math.Floor(real) ? (int)real : DefaultPriority;
        if (scalar.TryGetValue<string>(out var text) && text.Trim().Length > 0 && int.TryParse(text.Trim(), out var parsed))
            return parsed is >= 0 and <= 4 ? parsed : DefaultPriority;
        return DefaultPriority;
    }

    private static string? Text(JsonNode? node) =>
        node is JsonValue value && value.TryGetValue<string>(out var text) ? text : null;

    private static JsonObject Marker(string taskId, string itemId) =>
        new() { ["task_id"] = taskId, ["item_id"] = itemId };
}
