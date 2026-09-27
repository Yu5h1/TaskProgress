// One topological analysis pass: compare inputs, run each dirty module once, isolate failures.
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace TaskProgress;

internal sealed class AnalysisInputs(IReadOnlyDictionary<string, JsonObject> available, IReadOnlyList<string> declared)
{
    private readonly Dictionary<string, string> consumed = new(StringComparer.Ordinal);
    internal JsonObject? Read(string type)
    {
        if (!declared.Contains(type)) throw new CliException($"未宣告的模組依賴：{type}");
        if (!available.TryGetValue(type, out var output)) return null;
        consumed[type] = output["content_revision"]!.GetValue<string>();
        return (JsonObject)output.DeepClone();
    }
    internal JsonArray Receipts() => new(consumed.OrderBy(p => p.Key, StringComparer.Ordinal)
        .Select(p => (JsonNode)new JsonObject { ["module_type"] = p.Key, ["content_revision"] = p.Value }).ToArray());
}

internal static class AnalysisRefresh
{
    internal static IReadOnlyList<AnalysisRunResult> Run(string folder, ModuleDependencyPlan plan,
        bool force, Action<string> diagnose, DateTimeOffset? asOf = null, string? outputPath = null)
    {
        folder = ReportFolder.Load(folder).DirectoryPath;
        var available = new Dictionary<string, JsonObject>(StringComparer.Ordinal);
        var results = new List<AnalysisRunResult>();
        var failures = new List<string>();
        foreach (var module in plan.Order)
        {
            string? staging = null;
            try
            {
                if (!force && !module.HasInputs(folder)) continue;
                var target = outputPath is null
                    ? module.ProjectionFileName is null ? null : Path.Combine(folder, module.ProjectionFileName)
                    : Path.GetFullPath(outputPath, folder);
                var old = target is null ? null : ModuleProjection.Read(target);
                var source = ModuleProjection.InputRevision(folder, module.InputFiles);
                var dirty = force || module.RefreshesWithClock || !ModuleProjection.HasRevision(old)
                    || ReadRevision(old, "source_revision") != source
                    || !SameInputs(old?["input_modules"], module.DependsOn, available);
                if (!dirty)
                {
                    available[module.Type] = old!;
                    continue;
                }
                var inputs = new AnalysisInputs(available, module.DependsOn);
                if (target is null) throw new CliException($"{module.DisplayName}未宣告投影檔名。");
                staging = target + "." + Guid.NewGuid().ToString("N") + ".staging.json";
                if (File.Exists(target)) File.Copy(target, staging);
                var result = module.GenerateWithInputs(folder, inputs, asOf, staging);
                if (result is null) continue;
                var document = ModuleProjection.Read(result.OutputPath)
                    ?? throw new CliException($"{module.DisplayName}未產生有效投影。");
                if (!ModuleProjection.HasRevision(document))
                    throw new CliException($"{module.DisplayName}未提供 content_revision。");
                if (ModuleProjection.InputRevision(folder, module.InputFiles) != source)
                    throw new CliException($"{module.DisplayName}來源在分析期間變更，請重新分析。");
                document["source_revision"] = source;
                document["input_modules"] = inputs.Receipts();
                var omitted = module.DependsOn.Distinct().Where(type => !available.ContainsKey(type)).ToArray();
                document["excluded_modules"] = new JsonArray(omitted.Select(type => (JsonNode)JsonValue.Create(type)!).ToArray());
                foreach (var type in omitted) diagnose($"{module.DisplayName}：{type} 無法使用，其數值未計入。");
                if (!string.Equals(Path.GetFullPath(result.OutputPath), Path.GetFullPath(staging), StringComparison.OrdinalIgnoreCase))
                    throw new CliException($"{module.DisplayName}未使用指定的暫存輸出。");
                WriteAtomic(target, document);
                available[module.Type] = document;
                results.Add(result with { OutputPath = target,
                    Details = result.Details.Select(line => line.Replace(staging, target, StringComparison.Ordinal)).ToArray() });
            }
            catch (Exception error) when (error is CliException or IOException or UnauthorizedAccessException or JsonException or InvalidOperationException)
            {
                failures.Add($"{module.DisplayName}更新失敗：{error.Message}");
                diagnose(failures[^1]);
            }
            finally { if (staging is not null && File.Exists(staging)) File.Delete(staging); }
        }
        if (force && failures.Count > 0) throw new CliException(string.Join(Environment.NewLine, failures));
        return results;
    }

    private static string? ReadRevision(JsonObject? output, string field) => output?[field] is JsonValue value
        && value.TryGetValue<string>(out var text) ? text : null;

    private static bool SameInputs(JsonNode? recorded, IReadOnlyList<string> declared, IReadOnlyDictionary<string, JsonObject> available)
    {
        if (recorded is not JsonArray receipts) return false;
        var expected = declared.Distinct().Where(available.ContainsKey).OrderBy(type => type, StringComparer.Ordinal)
            .Select(type => (JsonNode)new JsonObject { ["module_type"] = type, ["content_revision"] = available[type]["content_revision"]!.DeepClone() }).ToArray();
        return ModuleProjection.Canonical(receipts) == ModuleProjection.Canonical(new JsonArray(expected));
    }

    private static void WriteAtomic(string path, JsonObject output)
    {
        var temporary = path + "." + Guid.NewGuid().ToString("N") + ".tmp";
        try
        {
            File.WriteAllText(temporary, output.ToJsonString(new JsonSerializerOptions { WriteIndented = true }) + "\n", new UTF8Encoding(false));
            File.Move(temporary, path, true);
        }
        finally { if (File.Exists(temporary)) File.Delete(temporary); }
    }
}
