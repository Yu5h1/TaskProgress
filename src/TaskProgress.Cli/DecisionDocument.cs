// Owns the JSON decision contract and validates its append-only state transitions.
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace TaskProgress;

internal sealed class DecisionException(string code, string message) : Exception(message)
{
    public string Code { get; } = code;
}

internal static class DecisionDocument
{
    internal const int MaxBytes = 4 * 1024 * 1024;
    internal static readonly JsonSerializerOptions Format = new() { WriteIndented = true };
    private static readonly string[] DefinitionKeys = ["question", "context", "source_ref", "options", "recommendation", "allow_other"];

    public static JsonObject Parse(string source)
    {
        if (Encoding.UTF8.GetByteCount(source) > MaxBytes) Fail("too_large", "Document exceeds 4 MiB.");
        var root = ParseObject(source);
        Validate(root);
        return root;
    }

    internal static JsonObject ParseObject(string source)
    {
        using var parsed = JsonDocument.Parse(source);
        CheckProperties(parsed.RootElement);
        return Object(JsonNode.Parse(source));
    }

    private static void CheckProperties(JsonElement element)
    {
        if (element.ValueKind == JsonValueKind.Object)
        {
            var names = new HashSet<string>();
            foreach (var field in element.EnumerateObject())
            {
                if (!names.Add(field.Name)) Fail("invalid_document", $"Duplicate property: {field.Name}");
                CheckProperties(field.Value);
            }
        }
        else if (element.ValueKind == JsonValueKind.Array)
            foreach (var child in element.EnumerateArray()) CheckProperties(child);
    }

    public static void Validate(JsonObject root)
    {
        Fields(root, ["schema_version", "task_id", "updated_at", "decisions"]);
        if (Text(root, "schema_version") != "1.0") Fail("unsupported_version", "Expected schema_version 1.0.");
        Id(root, "task_id");
        Timestamp(root, "updated_at");
        var ids = new HashSet<string>();
        var requests = new HashSet<string>();
        foreach (var node in Array(root, "decisions"))
        {
            var decision = Object(node);
            Fields(decision, ["id", "version", "question", "context", "source_ref", "options", "recommendation", "allow_other", "status", "answer", "history"]);
            if (!ids.Add(Id(decision, "id"))) Fail("invalid_document", "Duplicate decision id.");
            if (!decision.ContainsKey("answer")) Fail("invalid_document", "Missing answer field.");
            ValidateState(State(decision));
            var history = Array(decision, "history");
            JsonObject? previous = null;
            foreach (var eventNode in history)
            {
                var entry = Object(eventNode);
                Fields(entry, ["request_id", "fingerprint", "operation", "at", "before", "after"]);
                if (!requests.Add(Text(entry, "request_id"))) Fail("invalid_document", "Duplicate request id.");
                if (!Regex.IsMatch(Text(entry, "fingerprint"), "^[a-f0-9]{64}$")) Fail("invalid_document", "Invalid request fingerprint.");
                Timestamp(entry, "at");
                var before = Object(entry["before"]);
                var after = Object(entry["after"]);
                ValidateState(before);
                ValidateState(after);
                if (previous is not null && !Equal(previous, before)) Fail("history_mismatch", "History is discontinuous.");
                if (previous is null && (Text(before, "status") != "pending" || Integer(before, "version") != 1))
                    Fail("history_mismatch", "History must start at pending version 1.");
                ValidateTransition(Text(entry, "operation"), before, after);
                if (Text(entry, "operation") == "confirm" && Text(Object(after["answer"]), "confirmed_at") != Text(entry, "at"))
                    Fail("history_mismatch", "Confirmation timestamp differs from event.");
                previous = after;
            }
            if (previous is not null && !Equal(previous, State(decision))) Fail("history_mismatch", "Current state differs from history.");
            if (previous is null && (Text(decision, "status") != "pending" || Integer(decision, "version") != 1))
                Fail("history_mismatch", "New decisions must be pending version 1.");
        }
    }

    internal static void ValidateDefinition(JsonObject definition)
    {
        Fields(definition, DefinitionKeys);
        Text(definition, "question");
        foreach (var key in new[] { "context", "source_ref" }) if (definition.ContainsKey(key)) Text(definition, key);
        Boolean(definition, "allow_other");
        var options = Array(definition, "options");
        if (options.Count < 2) Fail("invalid_document", "At least two options are required.");
        var ids = new HashSet<string>();
        foreach (var node in options)
        {
            var option = Object(node);
            Fields(option, ["id", "label", "description"]);
            if (!ids.Add(Id(option, "id"))) Fail("invalid_document", "Duplicate option id.");
            Text(option, "label");
            if (option.ContainsKey("description")) Text(option, "description");
        }
        if (definition.ContainsKey("recommendation"))
        {
            var recommendation = Object(definition["recommendation"]);
            Fields(recommendation, ["option_id", "reason"]);
            if (!ids.Contains(Text(recommendation, "option_id"))) Fail("invalid_document", "Recommendation option is missing.");
            Text(recommendation, "reason");
        }
    }

    internal static void ValidateAnswer(JsonObject answer, JsonObject definition, bool persisted)
    {
        var kind = Text(answer, "kind");
        string[] keys = kind switch
        {
            "option" => ["kind", "option_id", "reason"],
            "other" => ["kind", "text", "reason"],
            _ => throw new DecisionException("invalid_answer", "Unknown answer kind.")
        };
        Fields(answer, persisted ? [.. keys, "confirmed_at"] : keys);
        if (kind == "option" && !Array(definition, "options").Any(n => Text(Object(n), "id") == Text(answer, "option_id")))
            Fail("invalid_answer", "Selected option is missing.");
        if (kind == "other")
        {
            if (!Boolean(definition, "allow_other")) Fail("invalid_answer", "Other answer is disabled.");
            Text(answer, "text");
        }
        if (answer.ContainsKey("reason")) Text(answer, "reason");
        if (persisted) Timestamp(answer, "confirmed_at");
    }

    private static void ValidateState(JsonObject state)
    {
        Fields(state, ["version", "definition", "status", "answer"]);
        Integer(state, "version");
        var definition = Object(state["definition"]);
        ValidateDefinition(definition);
        var status = Text(state, "status");
        if (!state.ContainsKey("answer")) Fail("invalid_document", "Missing answer.");
        if (status == "pending")
        {
            if (state["answer"] is not null) Fail("invalid_document", "Pending decision must have null answer.");
        }
        else if (status == "decided") ValidateAnswer(Object(state["answer"]), definition, true);
        else Fail("invalid_document", "Unknown decision status.");
    }

    private static void ValidateTransition(string operation, JsonObject before, JsonObject after)
    {
        var sameDefinition = Equal(before["definition"], after["definition"]);
        var sameVersion = Integer(before, "version") == Integer(after, "version");
        var valid = operation switch
        {
            "confirm" => sameDefinition && sameVersion && Text(before, "status") == "pending" && Text(after, "status") == "decided",
            "reopen" => sameDefinition && sameVersion && Text(before, "status") == "decided" && Text(after, "status") == "pending",
            "revise" => !sameDefinition && Integer(after, "version") == Integer(before, "version") + 1 && Text(after, "status") == "pending",
            _ => false
        };
        if (!valid) Fail("history_mismatch", "Invalid history transition.");
    }

    internal static JsonObject Definition(JsonObject decision)
    {
        var result = new JsonObject();
        foreach (var key in DefinitionKeys) if (decision.ContainsKey(key)) result[key] = decision[key]?.DeepClone();
        return result;
    }

    internal static JsonObject State(JsonObject decision) => new()
    {
        ["version"] = decision["version"]?.DeepClone(), ["definition"] = Definition(decision),
        ["status"] = decision["status"]?.DeepClone(), ["answer"] = decision["answer"]?.DeepClone()
    };

    internal static void SetDefinition(JsonObject decision, JsonObject definition)
    {
        foreach (var key in DefinitionKeys) decision.Remove(key);
        foreach (var pair in definition) decision[pair.Key] = pair.Value?.DeepClone();
    }

    internal static string Canonical(JsonNode? node) => node switch
    {
        JsonObject obj => "{" + string.Join(",", obj.OrderBy(p => p.Key, StringComparer.Ordinal).Select(p => JsonSerializer.Serialize(p.Key) + ":" + Canonical(p.Value))) + "}",
        JsonArray array => "[" + string.Join(",", array.Select(Canonical)) + "]",
        _ => node?.ToJsonString() ?? "null"
    };
    internal static bool Equal(JsonNode? a, JsonNode? b) => Canonical(a) == Canonical(b);
    internal static string Hash(byte[] bytes) => Convert.ToHexStringLower(SHA256.HashData(bytes));
    internal static string Fingerprint(JsonNode node) => Hash(Encoding.UTF8.GetBytes(Canonical(node)));
    internal static JsonObject Object(JsonNode? node) => node as JsonObject ?? throw new DecisionException("invalid_document", "Expected object.");
    internal static JsonArray Array(JsonObject obj, string key) => obj[key] as JsonArray ?? throw new DecisionException("invalid_document", $"Expected array: {key}");
    internal static string Text(JsonObject obj, string key) => obj[key] is JsonValue value && value.TryGetValue<string>(out var text) && !string.IsNullOrWhiteSpace(text) && text.Length <= 16000 ? text : throw new DecisionException("invalid_document", $"Expected nonempty string: {key}");
    internal static string Id(JsonObject obj, string key)
    {
        var text = Text(obj, key);
        if (text.Length > 100 || !Regex.IsMatch(text, "^[a-z0-9]+(?:[._-][a-z0-9]+)*$")) Fail("invalid_document", $"Invalid id: {key}");
        return text;
    }
    internal static int Integer(JsonObject obj, string key) => obj[key] is JsonValue value && value.TryGetValue<int>(out var number) && number > 0 ? number : throw new DecisionException("invalid_document", $"Expected positive integer: {key}");
    internal static bool Boolean(JsonObject obj, string key) => obj[key] is JsonValue value && value.TryGetValue<bool>(out var flag) ? flag : throw new DecisionException("invalid_document", $"Expected boolean: {key}");
    internal static void Timestamp(JsonObject obj, string key)
    {
        var text = Text(obj, key);
        if (!Regex.IsMatch(text, @"T.*(?:Z|[+-]\d\d:\d\d)$") || !DateTimeOffset.TryParse(text, out _)) Fail("invalid_document", "Timestamp requires timezone.");
    }
    internal static void Fields(JsonObject obj, string[] keys)
    {
        foreach (var field in obj) if (!keys.Contains(field.Key)) Fail("invalid_document", $"Unknown field: {field.Key}");
    }
    internal static void Fail(string code, string message) => throw new DecisionException(code, message);
}
