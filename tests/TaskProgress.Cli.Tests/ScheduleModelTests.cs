// Pure Schedule reference and constraint checks against schema fixtures.
using System.Text.Json.Nodes;
using TaskProgress;

internal static class ScheduleModelTests
{
    internal static void Run()
    {
        var path = Path.Combine("tests", "fixtures", "schedule", "parallel.plan.json");
        var plan = JsonNode.Parse(File.ReadAllText(path))!.AsObject();
        var report = JsonNode.Parse("""{"scope_id":"sample","tasks":[{"id":"a","status":"planned"},{"id":"b","status":"planned"},{"id":"c","status":"planned"}]}""")!.AsObject();
        var original = plan.ToJsonString();
        Check(ScheduleModel.Validate(plan, report).Count == 0, "valid fixture");
        Check(plan.ToJsonString() == original, "validation must not mutate input");
        void Expect(string code, Action<JsonObject> mutate)
        {
            var copy = (JsonObject)plan.DeepClone();
            mutate(copy);
            Check(ScheduleModel.Validate(copy, report).Any(x => x.Code == code), code);
        }
        Expect("scope_mismatch", p => p["scope_id"] = "other");
        Expect("duplicate_identity", p => p["resources"]!.AsArray().Add(p["resources"]![0]!.DeepClone()));
        Expect("duplicate_subject", p => p["works"]![2]!["subject"]!["task_id"] = "a");
        Expect("orphan_subject", p => p["works"]![0]!["subject"]!["task_id"] = "unknown");
        Expect("missing_predecessor", p => p["works"]![1]!["dependencies"]![0]!["predecessor_work_id"] = "unknown");
        Expect("missing_resource", p => p["works"]![0]!["assignments"]![0]!["resource_id"] = "unknown");
        Expect("missing_duration", p => p["works"]![0]!.AsObject().Remove("duration_source"));
        Expect("resource_overallocated", p => p["works"]![0]!["assignments"]!.AsArray().Add(p["works"]![0]!["assignments"]![0]!.DeepClone()));
        Expect("constraint_conflict", p => p["works"]![0]!["constraints"] = JsonNode.Parse("""[{"kind":"start_fixed","at":"2026-09-28T12:00:00+08:00"},{"kind":"finish_fixed","at":"2026-09-28T11:00:00+08:00"}]"""));
        var cyclic = (JsonObject)plan.DeepClone();
        cyclic["works"]![0]!["dependencies"] = JsonNode.Parse("""[{"predecessor_work_id":"b","type":"finish_to_start","lag_minutes":0}]""");
        var cycles = ScheduleModel.Validate(cyclic, report).Where(x => x.Code == "schedule_cycle").Select(x => x.WorkId).ToArray();
        Check(cycles.SequenceEqual(new[] { "a", "b" }), "cycle members only, independent c survives");
        Check(ScheduleModel.Validate(cyclic, report).First(x => x.Code == "schedule_cycle").CyclePath!.SequenceEqual(new[] { "a", "b", "a" }), "complete closed cycle path");
        Expect("orphan_subject", p => p["works"]![0]!["duration_source"] = JsonNode.Parse("""{"kind":"time_projection","task_id":"missing"}"""));
        var itemReport = (JsonObject)report.DeepClone();
        itemReport["tasks"]![0]!["pending_items"] = JsonNode.Parse("""["legacy title",{"id":"pending","title":"Pending"}]""");
        itemReport["tasks"]![0]!["completed_items"] = JsonNode.Parse("""[{"id":"complete","title":"Complete"}]""");
        foreach (var itemId in new[] { "pending", "complete" })
        {
            var itemPlan = (JsonObject)plan.DeepClone();
            itemPlan["works"]![0]!["subject"] = new JsonObject { ["kind"] = "item", ["task_id"] = "a", ["item_id"] = itemId };
            Check(!ScheduleModel.Validate(itemPlan, itemReport).Any(x => x.Code == "orphan_subject"), "real report item collections");
        }
        var archived = (JsonObject)report.DeepClone();
        itemReport["tasks"]![0]!["pending_items"]![1]!["status"] = "archive";
        var archivedItemPlan = (JsonObject)plan.DeepClone();
        foreach (var index in new[] { 0, 2 })
        {
            archivedItemPlan["works"]![index]!["subject"] = new JsonObject { ["kind"] = "item", ["task_id"] = "a", ["item_id"] = "pending" };
            archivedItemPlan["works"]![index]!.AsObject().Remove("duration_source");
        }
        Check(ScheduleModel.Validate(archivedItemPlan, itemReport).Count == 0, "explicit archive item status overrides collection");
        archived["tasks"]![0]!["status"] = "archive";
        var duplicate = (JsonObject)plan.DeepClone();
        duplicate["works"]![2]!["subject"]!["task_id"] = "a";
        Check(!ScheduleModel.Validate(duplicate, archived).Any(x => x.Code == "duplicate_subject"), "archived subjects are inactive");
        Console.WriteLine("Schedule model checks passed; no service or file mutation.");
    }

    private static void Check(bool condition, string message)
    {
        if (!condition) throw new Exception(message);
    }
}
