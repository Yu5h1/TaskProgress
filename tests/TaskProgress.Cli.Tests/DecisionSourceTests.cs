// Exercises source inspection, safe exact-file reading and warning-only validation without a service.
using System.Text.Json.Nodes;
using TaskProgress;

internal static class DecisionSourceTests
{
    internal static void Run()
    {
        var root = Path.Combine(Path.GetTempPath(), "taskprogress-sources-" + Guid.NewGuid().ToString("N"));
        var directory = Path.Combine(root, "decisions");
        Directory.CreateDirectory(directory);
        var path = Path.Combine(directory, "test.decisions");
        var source = Path.Combine(root, "中文 計畫.md");
        try
        {
            File.WriteAllText(source, "# 已定\ntext\n## 已定\n```md\n# 假標題\n```\n另一標題\n===\n## **Bold** [link](url)\n");
            var reference = "../中文%20計畫.md#已定";
            var available = DecisionSources.Read(path, reference, true);
            Check(available["status"]!.GetValue<string>() == "available" && available["line"]!.GetValue<int>() == 1, "relative Unicode source");
            Check(available["content"]!.GetValue<string>().Contains("text"), "content read");
            Check(DecisionSources.Read(path, "../中文 計畫.md#已定-1")["line"]!.GetValue<int>() == 3, "duplicate heading");
            Check(DecisionSources.Read(path, "../中文 計畫.md#另一標題")["line"]!.GetValue<int>() == 7, "Setext heading");
            Check(DecisionSources.Read(path, "../中文 計畫.md#bold-link")["status"]!.GetValue<string>() == "available", "inline heading markup");
            var formatted = DecisionSources.Headings("# _Hello_\n# __Hello__\n# [Label][ref]\n# `_code_`\n# snake_case\n");
            Check(formatted.ContainsKey("hello") && formatted.ContainsKey("hello-1") && formatted.ContainsKey("label") &&
                formatted.ContainsKey("_code_") && formatted.ContainsKey("snake_case"), "emphasis and reference links preserve code and word underscores");
            foreach (var invalid in new[] { "../中文 計畫.md#假標題", "../中文 計畫.md#missing", "../missing.md", "../../outside.md", "..%2f..%2foutside.md", "https://example.com/file.md", "C:/secret.md", "../run.exe" })
                Check(DecisionSources.Read(path, invalid)["status"]!.GetValue<string>() == "invalid", invalid);
            var doc = DecisionDocument.Parse(File.ReadAllText("tests/fixtures/decision-example.decisions"));
            doc["decisions"]![0]!["source_ref"] = reference;
            doc["decisions"]![1]!["source_ref"] = "../missing.md";
            File.WriteAllText(path, doc.ToJsonString());
            var bytes = File.ReadAllBytes(path);
            var store = new DecisionStore(path);
            var loaded = store.Handle("{\"operation\":\"load\"}");
            Check(loaded["ok"]!.GetValue<bool>() && loaded["sources"]!["next"]!["status"]!.GetValue<string>() == "invalid", "missing source only warns");
            var request = "{\"operation\":\"source\",\"decision_id\":\"input\",\"request_id\":\"read-source\"}";
            var opened = store.Handle(request);
            Check(opened["source"]!["status"]!.GetValue<string>() == "available", "source operation");
            Check(opened["request_id"]!.GetValue<string>() == "read-source", "desktop correlation");
            Check(!store.Handle("{\"operation\":\"source\",\"decision_id\":\"input\",\"payload\":{\"path\":\"secret.md\"}}")["ok"]!.GetValue<bool>(), "client cannot supply target");
            File.Delete(source);
            Check(store.Handle(request)["source"]!["status"]!.GetValue<string>() == "invalid", "recheck deleted file on click");
            Check(bytes.SequenceEqual(File.ReadAllBytes(path)), "source reads preserve document bytes");
            var output = new StringWriter();
            var error = new StringWriter();
            var originalOut = Console.Out;
            var originalError = Console.Error;
            try
            {
                Console.SetOut(output); Console.SetError(error);
                Check(DecisionCommand.Run(["validate", path]) == 0, "warnings keep successful validation exit");
            }
            finally { Console.SetOut(originalOut); Console.SetError(originalError); }
            Check(error.ToString().Contains("警告 [input]") && error.ToString().Contains("來源已失效"), "validation warning contains decision and reason");
            Console.WriteLine("Decision source paths, headings, read-only requests and validation warning checks passed.");
        }
        finally
        {
            if (File.Exists(source)) File.Delete(source);
            if (File.Exists(path)) File.Delete(path);
            Directory.Delete(directory);
            Directory.Delete(root);
        }
    }

    private static void Check(bool condition, string name)
    {
        if (!condition) throw new InvalidOperationException(name);
    }
}
