// Shared projection fingerprints and bounded input provenance for analysis modules.
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace TaskProgress;

internal static class ModuleProjection
{
    internal static string Hash(byte[] bytes) => "sha256:" + Convert.ToHexStringLower(SHA256.HashData(bytes));
    internal static string Canonical(JsonNode? node) => node switch
    {
        JsonObject obj => "{" + string.Join(",", obj.OrderBy(p => p.Key, StringComparer.Ordinal).Select(p => JsonSerializer.Serialize(p.Key) + ":" + Canonical(p.Value))) + "}",
        JsonArray array => "[" + string.Join(",", array.Select(Canonical)) + "]",
        _ => node?.ToJsonString() ?? "null"
    };
    internal static string ContentRevision(JsonNode content) => Hash(Encoding.UTF8.GetBytes(Canonical(content)));

    internal static string InputRevision(string folder, IReadOnlyList<string> files)
    {
        var inputs = new JsonObject();
        foreach (var file in files.OrderBy(name => name, StringComparer.Ordinal))
        {
            var path = Path.Combine(folder, file);
            inputs[file] = File.Exists(path) ? Hash(File.ReadAllBytes(path)) : null;
        }
        return ContentRevision(inputs);
    }

    internal static void Stamp(JsonObject output, string folder, IReadOnlyList<string> inputs, JsonNode content)
    {
        output["report_revision"] = Hash(File.ReadAllBytes(Path.Combine(folder, "report.json")));
        output["source_revision"] = InputRevision(folder, inputs);
        output["content_revision"] = ContentRevision(content);
        output["input_modules"] = new JsonArray();
    }

    internal static JsonObject? Read(string path)
    {
        try { return JsonNode.Parse(File.ReadAllText(path)) as JsonObject; }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException or JsonException) { return null; }
    }

    internal static bool HasRevision(JsonObject? output) => output?["content_revision"] is JsonValue value
        && value.TryGetValue<string>(out var revision)
        && System.Text.RegularExpressions.Regex.IsMatch(revision, "^sha256:[a-f0-9]{64}$");
}
