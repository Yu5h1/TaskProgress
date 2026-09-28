// Pure semantic validation for schema-validated Schedule plans; no IO or scheduling defaults.
using System.Globalization;
using System.Text.Json.Nodes;

namespace TaskProgress;

internal sealed record ScheduleDiagnostic(string Code, string? WorkId = null, IReadOnlyList<string>? CyclePath = null);

/// <summary>Validates references and constraints after schedule.plan.schema.json validation.</summary>
internal static class ScheduleModel
{
    internal static IReadOnlyList<ScheduleDiagnostic> Validate(JsonObject plan, JsonObject report)
    {
        var diagnostics = new List<ScheduleDiagnostic>();
        void Add(string code, string? work = null) => diagnostics.Add(new(code, work));
        if (Text(plan, "scope_id") != Text(report, "scope_id")) Add("scope_mismatch");
        var resources = Nodes(plan, "resources");
        var works = Nodes(plan, "works");
        var resourceIds = new HashSet<string>(StringComparer.Ordinal);
        foreach (var resource in resources)
            if (!resourceIds.Add(Text(resource, "id"))) Add("duplicate_identity");
        var byId = new Dictionary<string, JsonObject>(StringComparer.Ordinal);
        foreach (var work in works)
            if (!byId.TryAdd(Text(work, "work_id"), work)) Add("duplicate_identity", Text(work, "work_id"));
        var subjects = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var task in Nodes(report, "tasks"))
        {
            var taskId = Text(task, "id");
            if (Text(task, "kind") == "report_pointer") continue;
            subjects[taskId] = Text(task, "status");
            foreach (var field in new[] { "completed_items", "pending_items" })
                foreach (var item in task[field]?.AsArray().OfType<JsonObject>() ?? [])
                    subjects[taskId + "/" + Text(item, "id")] = Text(task, "status") == "archive" ? "archive" :
                        item["status"] is not null ? Text(item, "status") : field == "completed_items" ? "done" : "planned";
        }
        var owners = new HashSet<string>(StringComparer.Ordinal);
        foreach (var work in works)
        {
            var id = Text(work, "work_id");
            var dependencies = new HashSet<string>(StringComparer.Ordinal);
            foreach (var dependency in Nodes(work, "dependencies"))
            {
                var predecessor = Text(dependency, "predecessor_work_id");
                if (!byId.ContainsKey(predecessor)) Add("missing_predecessor", id);
                if (!dependencies.Add(predecessor)) Add("duplicate_identity", id);
            }
            if (Text(work, "kind") == "milestone") continue;
            var subject = (JsonObject)work["subject"]!;
            var key = Text(subject, "task_id") + (Text(subject, "kind") == "item" ? "/" + Text(subject, "item_id") : "");
            if (!subjects.TryGetValue(key, out var status)) Add("orphan_subject", id);
            if (status == "archive") continue;
            if (!owners.Add(key)) Add("duplicate_subject", id);
            if (status == "done") continue;
            if (work["duration_source"] is null) Add("missing_duration", id);
            if (work["duration_source"] is JsonObject duration && Text(duration, "kind") == "time_projection")
            {
                var durationKey = Text(duration, "task_id") + (duration["item_id"] is null ? "" : "/" + Text(duration, "item_id"));
                if (!subjects.ContainsKey(durationKey)) Add("orphan_subject", id);
            }
            var assignments = Nodes(work, "assignments");
            if (assignments.Length == 0) Add("missing_resource", id);
            var assigned = new HashSet<string>(StringComparer.Ordinal);
            foreach (var assignment in assignments)
            {
                var resource = Text(assignment, "resource_id");
                if (!resourceIds.Contains(resource)) Add("missing_resource", id);
                if (!assigned.Add(resource)) Add("resource_overallocated", id);
            }
            var constraints = new Dictionary<string, DateTimeOffset>(StringComparer.Ordinal);
            foreach (var constraint in Nodes(work, "constraints"))
                if (!constraints.TryAdd(Text(constraint, "kind"), DateTimeOffset.Parse(Text(constraint, "at"), CultureInfo.InvariantCulture)))
                    Add("constraint_conflict", id);
            if (constraints.TryGetValue("start_fixed", out var start) &&
                constraints.TryGetValue("start_no_earlier_than", out var earliest) && start < earliest) Add("constraint_conflict", id);
            if (constraints.TryGetValue("finish_fixed", out var finish) &&
                constraints.TryGetValue("finish_no_later_than", out var latest) && finish > latest) Add("constraint_conflict", id);
            var lower = constraints.Where(x => x.Key.StartsWith("start", StringComparison.Ordinal)).Select(x => x.Value).ToArray();
            var upper = constraints.Where(x => x.Key.StartsWith("finish", StringComparison.Ordinal)).Select(x => x.Value).ToArray();
            if (lower.Length > 0 && upper.Length > 0 && lower.Max() >= upper.Min()) Add("constraint_conflict", id);
        }
        foreach (var id in byId.Keys.Order(StringComparer.Ordinal))
        {
            var pending = new Stack<string[]>(Nodes(byId[id], "dependencies").Select(x => new[] { id, Text(x, "predecessor_work_id") }));
            var visited = new HashSet<string>(StringComparer.Ordinal);
            while (pending.TryPop(out var path))
            {
                var next = path[^1];
                if (next == id) { diagnostics.Add(new("schedule_cycle", id, path)); break; }
                if (!visited.Add(next) || !byId.TryGetValue(next, out var node)) continue;
                foreach (var dependency in Nodes(node, "dependencies")) pending.Push([.. path, Text(dependency, "predecessor_work_id")]);
            }
        }
        return diagnostics.Distinct().ToArray();
    }

    private static string Text(JsonObject node, string name) => node[name]?.GetValue<string>() ?? "";
    private static JsonObject[] Nodes(JsonObject node, string name) => node[name]?.AsArray().Cast<JsonObject>().ToArray() ?? [];
}
