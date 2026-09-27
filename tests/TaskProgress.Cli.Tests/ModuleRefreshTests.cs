// Focused provenance and incremental-pass checks on disposable report copies.
using System.Text.Json.Nodes;
using TaskProgress;

internal static class ModuleRefreshTests
{
    private static void Check(bool condition, string message) { if (!condition) throw new Exception(message); }
    private sealed class Module(string type, params string[] dependencies) : IAnalysisModule
    {
        public string Type => type;
        public string DisplayName => type;
        public IReadOnlyList<string> DependsOn => dependencies;
        public string ProjectionFileName => type + ".json";
        public IReadOnlyList<string> InputFiles => ["report.json", type + ".input"];
        public int Runs;
        public bool Fail;
        public bool ChangeSource;
        public bool HasInputs(string folder) => true;
        public AnalysisRunResult? Generate(string folder, DateTimeOffset? asOf = null, string? outputPath = null) => throw new Exception("input context required");
        public AnalysisRunResult GenerateWithInputs(string folder, AnalysisInputs inputs, DateTimeOffset? asOf = null, string? outputPath = null)
        {
            Runs++;
            if (Fail) throw new CliException("test failure");
            var value = File.Exists(Path.Combine(folder, type + ".input")) ? File.ReadAllText(Path.Combine(folder, type + ".input")) : "initial";
            var content = new JsonObject { ["value"] = value };
            foreach (var dependency in dependencies) content[dependency] = inputs.Read(dependency)?["content_revision"]?.DeepClone();
            var document = new JsonObject { ["data"] = content.DeepClone() };
            ModuleProjection.Stamp(document, folder, InputFiles, content);
            var path = outputPath ?? Path.Combine(folder, ProjectionFileName);
            File.WriteAllText(path, document.ToJsonString());
            if (ChangeSource) File.WriteAllText(Path.Combine(folder, type + ".input"), "changed during run");
            return new(type, path, type, []);
        }
    }
    internal static void Run()
    {
        var folder = Path.Combine(Path.GetTempPath(), "tp-module-refresh-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(folder);
        try
        {
            File.Copy("reports/example/report.json", Path.Combine(folder, "report.json"));
            var branchedCycle = ModuleDependencyGraph.Plan([new Module("cycle.a", "cycle.b", "cycle.c"),
                new Module("cycle.b", "cycle.a"), new Module("cycle.c", "cycle.a"), new Module("cycle.d", "cycle.a")]);
            Check(branchedCycle.DisabledTypes.Count == 3 && branchedCycle.Order.Single().Type == "cycle.d", "all strongly connected members disabled; downstream remains");
            var a = new Module("test.a"); var b = new Module("test.b", "test.a"); var c = new Module("test.c", "test.a", "test.b");
            var plan = ModuleDependencyGraph.Plan([c,b,a]);
            var diagnostics = new List<string>();
            AnalysisRefresh.Run(folder, plan, false, diagnostics.Add);
            Check(a.Runs == 1 && b.Runs == 1 && c.Runs == 1, "topological diamond runs once");
            AnalysisRefresh.Run(folder, plan, false, diagnostics.Add);
            Check(a.Runs == 1 && b.Runs == 1 && c.Runs == 1, "unchanged pass skips all");
            File.WriteAllText(Path.Combine(folder, "test.a.input"), "changed");
            AnalysisRefresh.Run(folder, plan, false, diagnostics.Add);
            Check(a.Runs == 2 && b.Runs == 2 && c.Runs == 2, "transitive change runs each once");
            a.Fail = true;
            File.WriteAllText(Path.Combine(folder, "test.a.input"), "fail");
            AnalysisRefresh.Run(folder, plan, false, diagnostics.Add);
            var output = ModuleProjection.Read(Path.Combine(folder, "test.b.json"))!;
            Check(output["excluded_modules"]!.AsArray().Any(n => n!.GetValue<string>() == "test.a"), "failed upstream not read from old disk output");
            Check(output["input_modules"]!.AsArray().Count == 0, "only actual reads recorded");
            Check(c.Runs == 3 && diagnostics.Any(message => message.Contains("未計入")), "downstream continues with coverage warning");
            a.Fail = false;
            AnalysisRefresh.Run(folder, plan, false, diagnostics.Add);
            Check(b.Runs == 4 && c.Runs == 4, "restored dependency recomputes");
            var lastGood = File.ReadAllBytes(Path.Combine(folder, "test.a.json"));
            a.ChangeSource = true;
            File.WriteAllText(Path.Combine(folder, "test.a.input"), "trigger source drift");
            AnalysisRefresh.Run(folder, plan, false, diagnostics.Add);
            Check(lastGood.SequenceEqual(File.ReadAllBytes(Path.Combine(folder, "test.a.json"))), "source drift leaves last publication intact");
            a.ChangeSource = false;
            AnalysisRefresh.Run(folder, plan, false, diagnostics.Add);
            var corrupt = ModuleProjection.Read(Path.Combine(folder, "test.a.json"))!;
            corrupt["source_revision"] = 3;
            File.WriteAllText(Path.Combine(folder, "test.a.json"), corrupt.ToJsonString());
            var runsBefore = a.Runs;
            AnalysisRefresh.Run(folder, plan, false, diagnostics.Add);
            Check(a.Runs == runsBefore + 1, "malformed metadata regenerates");
            a.Fail = true;
            var rejected = false;
            try { AnalysisRefresh.Run(folder, plan, true, diagnostics.Add); }
            catch (CliException) { rejected = true; }
            Check(rejected, "explicit failure reports non-success");
            a.Fail = false;
            var one = TimeAnalysisGenerator.Generate(folder, DateTimeOffset.Parse("2026-09-27T00:00:00Z"));
            var old = ModuleProjection.Read(one.OutputPath)!;
            TimeAnalysisGenerator.Generate(folder, DateTimeOffset.Parse("2026-09-28T00:00:00Z"));
            var newer = ModuleProjection.Read(one.OutputPath)!;
            Check(old["content_revision"]!.GetValue<string>() == newer["content_revision"]!.GetValue<string>(), "clock metadata alone does not churn content");
            Check(old["as_of"]!.GetValue<string>() != newer["as_of"]!.GetValue<string>(), "clock actually changed");
            Check(ModuleProjection.ContentRevision(JsonNode.Parse("{\"a\":1,\"b\":2}")!) == ModuleProjection.ContentRevision(JsonNode.Parse("{\"b\":2,\"a\":1}")!), "canonical object order");
            Console.WriteLine("Module revision, incremental cascade, failure isolation and timestamp checks passed.");
        }
        finally { Directory.Delete(folder, true); }
    }
}
