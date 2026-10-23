// Derives the Next a Report shows: the stored marker while effective, else the derived next step.
using System.Text.Json.Nodes;

namespace TaskProgress;

/// <summary>
///   The scope's Next as <c>report get</c> reports it, by the same rule as the Viewer's
///   <c>next-marker.js</c> (Documentation/NextMarkerPlan.md, decision 3). A marker is effective
///   while its item still needs someone to take it up; otherwise the first such item is derived.
///   Deriving writes nothing, and a cleared marker yields no Next.
/// </summary>
internal static class NextMarker
{
    private const int DefaultPriority = 4;
    private static readonly HashSet<string> NotTakeUp = new(StringComparer.Ordinal)
    {
        ItemStates.Done, ItemStates.Waiting, ItemStates.InProgress, ItemStates.Archived,
    };

    /// <summary>
    ///   Returns <c>{ task_id, item_id, source }</c> with source <c>stored</c> or
    ///   <c>derived</c>, or null when the marker is cleared or nothing can be taken up.
    /// </summary>
    internal static JsonObject? Effective(JsonObject report, string scope, ItemStateResolver resolver)
    {
        if (report["next"] is not JsonObject stored) return null;
        var tasks = (report["tasks"] as JsonArray)?.OfType<JsonObject>().ToList() ?? [];
        var taskId = Text(stored["task_id"]);
        var itemId = Text(stored["item_id"]);
        var task = tasks.FirstOrDefault(candidate => Text(candidate["id"]) == taskId);
        if (task is not null && Actionable(task)
            && Pending(task).FirstOrDefault(item => Text(item["id"]) == itemId) is { } marked
            && TakesUp(scope, marked, resolver))
            return Marker(taskId!, itemId!, "stored");

        foreach (var candidate in RankTasks(tasks).Where(Actionable))
        {
            var first = RankItems(Pending(candidate)).FirstOrDefault(item => TakesUp(scope, item, resolver));
            if (first is not null) return Marker(Text(candidate["id"])!, Text(first["id"])!, "derived");
        }
        return null;
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

    private static JsonObject Marker(string taskId, string itemId, string source) =>
        new() { ["task_id"] = taskId, ["item_id"] = itemId, ["source"] = source };
}
