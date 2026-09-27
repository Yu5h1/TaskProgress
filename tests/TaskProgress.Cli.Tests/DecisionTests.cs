// Focused decision lifecycle, conflict, receipt and migration tests on temporary files.
using System.Text.Json.Nodes;
using TaskProgress;

internal static class DecisionTests
{
    private static void Check(bool value, string label) { if (!value) throw new Exception(label); }
    private static JsonObject Load(DecisionStore store) => store.Handle("{\"operation\":\"load\"}");
    private static JsonObject Request(JsonObject snapshot, string operation, string requestId, JsonObject payload) => new()
    {
        ["operation"] = operation, ["request_id"] = requestId, ["decision_id"] = "input",
        ["expected_revision"] = snapshot["revision"]!.DeepClone(),
        ["expected_version"] = snapshot["document"]!["decisions"]![0]!["version"]!.DeepClone(), ["payload"] = payload
    };
    internal static void Run()
    {
        var folder = Path.Combine(Path.GetTempPath(), "taskprogress-decisions-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(folder);
        var path = Path.Combine(folder, "decision-example.decisions");
        try
        {
            var fixture = Path.Combine(Directory.GetCurrentDirectory(), "tests", "fixtures", "decision-example.decisions");
            File.Copy(fixture, path);
            var store = new DecisionStore(path);
            var initial = Load(store);
            Check(initial["ok"]!.GetValue<bool>(), "load fixture");
            Check(store.Handle("{\"operation\":\"load\"}", "different-task")["error"]!["code"]!.GetValue<string>() == "task_mismatch", "task identity checked inside lock");
            Check(!store.Handle("{\"operation\":\"load\",\"operation\":\"load\"}")["ok"]!.GetValue<bool>(), "duplicate request properties");
            Check(ChecklistFileRegistration.BuildLaunchCommand(@"C:\tools checklist build\task-progress.exe", "decisions") == "\"C:\\tools checklist build\\task-progress.exe\" decisions \"%1\"", "registration keeps executable path");
            var confirm = Request(initial, "confirm", "confirm-1", new() { ["kind"] = "option", ["option_id"] = "batch" });
            var success = store.Handle(confirm.ToJsonString());
            Check(success["status"]!.GetValue<string>() == "applied", "confirm");
            var repeated = store.Handle(confirm.ToJsonString());
            Check(repeated["status"]!.GetValue<string>() == "already_applied", "latest receipt retry");
            Check(!repeated["document"]!["decisions"]![0]!.AsObject().ContainsKey("history"), "no history persisted");
            confirm["payload"]!["option_id"] = "short";
            Check(store.Handle(confirm.ToJsonString())["error"]!["code"]!.GetValue<string>() == "request_id_conflict", "receipt mismatch");
            confirm["payload"]!["option_id"] = "batch";
            var reopened = store.Handle(Request(success, "reopen", "reopen-1", new()).ToJsonString());
            Check(reopened["ok"]!.GetValue<bool>(), "reopen");
            Check(reopened["document"]!["decisions"]![0]!["answer"] is null, "reopen clears answer");
            Check(store.Handle(confirm.ToJsonString())["error"]!["code"]!.GetValue<string>() == "revision_conflict", "superseded retry conflicts safely");
            confirm["request_id"] = "stale";
            Check(store.Handle(confirm.ToJsonString())["error"]!["code"]!.GetValue<string>() == "revision_conflict", "stale revision");
            var beforeBytes = File.ReadAllBytes(path);
            var invalid = Request(reopened, "confirm", "blank", new() { ["kind"] = "other", ["text"] = "  " });
            Check(!store.Handle(invalid.ToJsonString())["ok"]!.GetValue<bool>(), "blank other rejected");
            Check(beforeBytes.SequenceEqual(File.ReadAllBytes(path)), "invalid request leaves bytes intact");
            var definition = DecisionDocument.Definition(reopened["document"]!["decisions"]![0]!.AsObject());
            var noChange = store.Handle(Request(reopened, "revise", "noop", (JsonObject)definition.DeepClone()).ToJsonString());
            Check(noChange["status"]!.GetValue<string>() == "no_change", "no-op revise");
            Check(beforeBytes.SequenceEqual(File.ReadAllBytes(path)), "no-op leaves bytes intact");
            definition["question"] = "修改後的中文問題";
            var revised = store.Handle(Request(reopened, "revise", "revise-1", definition).ToJsonString());
            Check(revised["document"]!["decisions"]![0]!["version"]!.GetValue<int>() == 2, "version increments");
            Check(revised["document"]!["decisions"]![0]!["last_request"]!["request_id"]!.GetValue<string>() == "revise-1", "only latest receipt retained");
            var raceA = Request(revised, "confirm", "race-a", new() { ["kind"] = "other", ["text"] = "中文自訂" });
            var raceB = Request(revised, "confirm", "race-b", new() { ["kind"] = "option", ["option_id"] = "both" });
            var results = new JsonObject[2];
            Parallel.Invoke(() => results[0] = new DecisionStore(path).Handle(raceA.ToJsonString()),
                () => results[1] = new DecisionStore(path.ToUpperInvariant()).Handle(raceB.ToJsonString()));
            Check(results.Count(r => r["ok"]!.GetValue<bool>()) == 1, "cooperative writers serialize");
            var tampered = JsonNode.Parse(File.ReadAllText(path))!.AsObject();
            tampered["decisions"]![0]!["question"] = "外部直接改題";
            File.WriteAllText(path, tampered.ToJsonString());
            Check(Load(store)["ok"]!.GetValue<bool>(), "current state validates without historical snapshots");
            var legacy = JsonNode.Parse(File.ReadAllText(fixture))!.AsObject();
            legacy["schema_version"] = "1.0";
            foreach (var node in legacy["decisions"]!.AsArray()) node!["history"] = new JsonArray();
            var legacyDecision = legacy["decisions"]![0]!;
            legacyDecision["status"] = "decided";
            legacyDecision["answer"] = new JsonObject { ["kind"] = "option", ["option_id"] = "batch", ["confirmed_at"] = "2026-09-25T00:00:00Z" };
            legacyDecision["history"]!.AsArray().Add(new JsonObject { ["request_id"] = "legacy", ["fingerprint"] = new string('a', 64) });
            File.WriteAllText(path, legacy.ToJsonString());
            var legacyBytes = File.ReadAllBytes(path);
            var migrated = Load(store);
            Check(migrated["ok"]!.GetValue<bool>(), "legacy load");
            Check(legacyBytes.SequenceEqual(File.ReadAllBytes(path)), "load does not rewrite legacy file");
            Check(migrated["document"]!["decisions"]![0]!["answer"]!["option_id"]!.GetValue<string>() == "batch", "migration retains current answer");
            var migratedSave = store.Handle(Request(migrated, "reopen", "migrate-save", new()).ToJsonString());
            Check(migratedSave["ok"]!.GetValue<bool>(), "legacy save");
            var persisted = JsonNode.Parse(File.ReadAllText(path))!;
            Check(persisted["schema_version"]!.GetValue<string>() == "1.1", "save uses simplified version");
            Check(persisted["decisions"]!.AsArray().All(node => !node!.AsObject().ContainsKey("history")), "save removes all historical snapshots");
            File.WriteAllText(path, File.ReadAllText(fixture).Replace("\"schema_version\":", "\"schema_version\":\"1.0\",\"schema_version\":"));
            Check(!Load(store)["ok"]!.GetValue<bool>(), "duplicate JSON properties");
            File.Copy(fixture, path, true);
            var bad = JsonNode.Parse(File.ReadAllText(path))!.AsObject();
            bad["decisions"]![0]!.AsObject().Remove("answer");
            File.WriteAllText(path, bad.ToJsonString());
            Check(!Load(store)["ok"]!.GetValue<bool>(), "missing answer rejected");
            bad = JsonNode.Parse(File.ReadAllText(fixture))!.AsObject();
            bad["decisions"]![0]!["unknown"] = 1;
            File.WriteAllText(path, bad.ToJsonString());
            Check(!Load(store)["ok"]!.GetValue<bool>(), "unknown fields");
            Console.WriteLine("Decision lifecycle, conflict, receipt, migration and UTF-8 checks passed.");
        }
        finally
        {
            foreach (var file in Directory.GetFiles(folder)) File.Delete(file);
            Directory.Delete(folder);
        }
    }
}
