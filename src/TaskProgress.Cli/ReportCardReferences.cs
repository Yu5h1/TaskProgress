// Projects same-report card references without adding work to the report.
using System.Text.Json.Nodes;

namespace TaskProgress;

internal static class ReportCardReferences
{
    public static bool IsReferenceOnly(JsonObject task) =>
        task["card_refs"] is JsonArray { Count: > 0 }
        && task["progress"] is null
        && task["pending_items"] is not JsonArray { Count: > 0 }
        && task["completed_items"] is not JsonArray { Count: > 0 };

    public static void Project(string scope, JsonObject report, IEnumerable<JsonObject> requested, ItemStateResolver resolver)
    {
        var sources = requested.Where(task => task["card_refs"] is JsonArray { Count: > 0 }).ToArray();
        if (sources.Length == 0 || report["tasks"] is not JsonArray tasks) return;

        var byId = tasks.OfType<JsonObject>().ToDictionary(task => task["id"]!.GetValue<string>(), StringComparer.Ordinal);
        var projections = new Dictionary<string, (string Status, int Completed, int Total)>(StringComparer.Ordinal);
        foreach (var task in sources)
        {
            var rows = new JsonArray();
            var statuses = new List<string>();
            foreach (var reference in ((JsonArray)task["card_refs"]!).OfType<JsonObject>())
            {
                var targetId = reference["task_id"]!.GetValue<string>();
                var target = byId.GetValueOrDefault(targetId);
                var row = (JsonObject)reference.DeepClone();
                row["title"] = target?["title"]?.GetValue<string>() ?? targetId;
                if (target is null || target["status"]?.GetValue<string>() == ItemStates.Archived)
                {
                    row["status"] = ItemStates.Blocked;
                    row["error"] = target is null ? "找不到目標卡片" : "目標卡片已封存";
                    statuses.Add(ItemStates.Blocked);
                }
                else
                {
                    if (!projections.TryGetValue(targetId, out var projection))
                    {
                        projection = TargetProgress(scope, target, resolver);
                        projections.Add(targetId, projection);
                    }
                    row["status"] = projection.Status;
                    row["progress"] = Progress(projection.Completed, projection.Total);
                    statuses.Add(projection.Status);
                }
                rows.Add(row);
            }
            var completed = statuses.Count(status => status == ItemStates.Done);
            task["card_references"] = rows;
            task["reference_progress"] = Progress(completed, rows.Count);
            if (IsReferenceOnly(task) && task["status"]?.GetValue<string>() != ItemStates.Archived)
                task["derived_status"] = RollupStatus(statuses, completed);
        }
    }

    private static string RollupStatus(List<string> statuses, int completed)
    {
        if (completed == statuses.Count) return ItemStates.Done;
        if (statuses.Contains(ItemStates.InProgress)) return ItemStates.InProgress;
        if (statuses.Where(status => status != ItemStates.Done).All(status => status == ItemStates.Blocked))
            return ItemStates.Blocked;
        return "planned";
    }

    private static (string Status, int Completed, int Total) TargetProgress(string scope, JsonObject target, ItemStateResolver resolver)
    {
        var status = target["status"]!.GetValue<string>();
        var total = 0;
        var completed = 0;
        var hasBinding = false;
        foreach (var field in new[] { "completed_items", "pending_items" })
        {
            if (target[field] is not JsonArray items) continue;
            foreach (var item in items)
            {
                var inCompleted = field == "completed_items";
                var itemStatus = inCompleted ? ItemStates.Done : "planned";
                if (item is JsonObject obj)
                {
                    hasBinding |= obj["document_ref"]?["kind"]?.GetValue<string>() is "checklist" or "decision";
                    itemStatus = resolver.ProjectStatus(scope, obj, inCompleted);
                }
                if (itemStatus == ItemStates.Archived || ItemStates.IsRetired(itemStatus)) continue;
                total++;
                if (itemStatus == ItemStates.Done) completed++;
            }
        }

        if (total > 0)
        {
            if (hasBinding && completed == total) status = ItemStates.Done;
            else if (hasBinding && status == ItemStates.Done) status = ItemStates.InProgress;
            return (status, completed, total);
        }
        if (target["progress"] is JsonObject progress)
            return (status, progress["completed"]!.GetValue<int>(), progress["total"]!.GetValue<int>());
        return (status, status == ItemStates.Done ? 1 : 0, 1);
    }

    private static JsonObject Progress(int completed, int total) => new()
    {
        ["completed"] = completed,
        ["total"] = total,
    };
}
