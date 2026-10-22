// Derives a Report child item's state from its bound checklist, its claims and the items it waits for.
using System.Text.Json.Nodes;

namespace TaskProgress;

/// <summary>
///   The derived states, in the order they are decided. Items without a bound
///   checklist keep their stored status; only waiting applies to every item.
/// </summary>
internal static class ItemStates
{
    public const string Done = "done";
    public const string Waiting = "waiting";
    public const string Disputed = "awaiting_user_dispute";
    public const string ConditionsToRevise = "conditions_to_revise";
    public const string NeedsFix = "needs_fix";
    public const string AwaitingUser = "awaiting_user";
    public const string AwaitingAcceptance = "awaiting_acceptance";
    public const string InProgress = "in_progress";
    public const string NotStarted = "not_started";
    public const string Blocked = "blocked";
    public const string Archived = "archive";
}

/// <summary>
///   Resolves item states across registered scopes, loading each report and
///   checklist at most once. Unreadable items count as unfinished.
/// </summary>
internal sealed class ItemStateResolver
{
    private const int DepthLimit = 50;
    private readonly ScopeStore? store;
    private readonly Dictionary<string, (string Folder, JsonObject Report)?> reports = new(StringComparer.Ordinal);
    private readonly Dictionary<string, ChecklistDocument?> checklists = new(StringComparer.OrdinalIgnoreCase);

    public ItemStateResolver(string folder, JsonObject report, ScopeStore? store = null)
    {
        this.store = store;
        if (report["scope_id"]?.GetValue<string>() is { } scope) reports[scope] = (folder, report);
    }

    public string StateOf(string scope, JsonObject item, int depth = 0)
    {
        var checklist = BoundChecklist(scope, item, out var bound);
        var stored = item["status"]?.GetValue<string>();
        if (bound && checklist is not null && IsDone(checklist)) return ItemStates.Done;
        if (!bound && stored == "done") return ItemStates.Done;
        if (Waits(item, depth)) return ItemStates.Waiting;
        if (!bound || checklist is null)
        {
            return stored switch
            {
                "in_progress" => ItemStates.InProgress,
                "blocked" => ItemStates.Blocked,
                "archive" => ItemStates.Archived,
                _ => ItemStates.NotStarted,
            };
        }
        return FromChecklist(checklist, item);
    }

    public bool IsDone(string scope, string taskId, string itemId, int depth)
    {
        if (depth > DepthLimit) return false;
        var found = FindItem(scope, taskId, itemId);
        return found is not null && StateOf(scope, found, depth + 1) == ItemStates.Done;
    }

    private bool Waits(JsonObject item, int depth)
    {
        if (item["waits_for"] is not JsonArray waits) return false;
        foreach (var wait in waits.OfType<JsonObject>())
        {
            var scope = wait["scope_id"]?.GetValue<string>();
            var task = wait["task_id"]?.GetValue<string>();
            var target = wait["item_id"]?.GetValue<string>();
            if (scope is null || task is null || target is null || !IsDone(scope, task, target, depth)) return true;
        }
        return false;
    }

    private static string FromChecklist(ChecklistDocument checklist, JsonObject item)
    {
        var checks = checklist.Items.SelectMany(work => work.Checks).ToArray();
        var released = LatestAt(item, "released");
        var disputed = LatestAt(item, "disputed");
        var conditions = checks
            .Where(check => check.IsAcceptance && ChecklistDocument.EffectiveStatus(check) == ChecklistStatus.Failed
                && check.Record?.RejectReason == ChecklistRejectReason.Condition)
            .ToArray();
        if (conditions.Any(check => check.Record!.ConditionCount >= 2 || (disputed is { } at && at > check.Record.At)))
            return ItemStates.Disputed;
        if (conditions.Length > 0) return ItemStates.ConditionsToRevise;
        var unfixed = checks.Where(check => ChecklistDocument.EffectiveStatus(check) == ChecklistStatus.Failed
            && ((check.IsAcceptance && check.Record?.RejectReason == ChecklistRejectReason.Implementation)
                || (check.IsManual && check.Record?.Recorder == "user")));
        if (unfixed.Any(check => released is null || check.Record!.At > released)) return ItemStates.NeedsFix;
        var executorFailed = checks.Any(check => !check.IsTagged && check.Status == ChecklistStatus.Failed);
        var agentRecheck = checks.Any(check => check.IsManual && ChecklistDocument.EffectiveStatus(check) == ChecklistStatus.Failed
            && check.Record?.Recorder != "user");
        var manualVoid = checks.Any(check => check.IsManual
            && ChecklistDocument.Validity(check) != ChecklistResultValidity.Valid);
        var manualOpen = checks.Any(check => check.IsManual && ChecklistDocument.EffectiveStatus(check) != ChecklistStatus.Passed);
        if (executorFailed || agentRecheck || manualVoid
            || (manualOpen && checklist.UntaggedComplete && checklist.AcceptanceComplete))
            return ItemStates.AwaitingUser;
        if (checklist.UntaggedComplete && !checklist.AcceptanceComplete) return ItemStates.AwaitingAcceptance;
        return item["activity"] is JsonArray activity
            && activity.OfType<JsonObject>().Any(entry => entry["event"]?.GetValue<string>() is "started" or "takeover")
            ? ItemStates.InProgress
            : ItemStates.NotStarted;
    }

    private static bool IsDone(ChecklistDocument checklist) =>
        checklist.Items.SelectMany(work => work.Checks).All(check => ChecklistDocument.EffectiveStatus(check) == ChecklistStatus.Passed);

    private static DateTimeOffset? LatestAt(JsonObject item, string eventName)
    {
        if (item["activity"] is not JsonArray activity) return null;
        DateTimeOffset? latest = null;
        foreach (var entry in activity.OfType<JsonObject>())
        {
            if (entry["event"]?.GetValue<string>() != eventName) continue;
            if (DateTimeOffset.TryParse(entry["at"]?.GetValue<string>(), System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.RoundtripKind, out var at) && (latest is null || at > latest))
                latest = at;
        }
        return latest;
    }

    private ChecklistDocument? BoundChecklist(string scope, JsonObject item, out bool bound)
    {
        bound = false;
        if (item["document_ref"] is not JsonObject reference || reference["kind"]?.GetValue<string>() != "checklist")
            return null;
        var refScope = reference["scope_id"]?.GetValue<string>();
        var task = reference["task"]?.GetValue<string>();
        if (refScope is null || task is null || Report(refScope) is not { } owner) return null;
        bound = true;
        var path = Path.Combine(owner.Folder, "checklists", task + ".checklist");
        if (!checklists.TryGetValue(path, out var document))
        {
            try
            {
                document = File.Exists(path) ? ChecklistDocument.Parse(File.ReadAllBytes(path)) : null;
            }
            catch (CliException)
            {
                document = null;
            }
            checklists[path] = document;
        }
        return document;
    }

    private JsonObject? FindItem(string scope, string taskId, string itemId)
    {
        if (Report(scope)?.Report["tasks"] is not JsonArray tasks) return null;
        var task = tasks.OfType<JsonObject>().FirstOrDefault(t => t["id"]?.GetValue<string>() == taskId);
        return new[] { "pending_items", "completed_items" }
            .Select(list => task?[list] as JsonArray)
            .Where(list => list is not null)
            .SelectMany(list => list!.OfType<JsonObject>())
            .FirstOrDefault(entry => entry["id"]?.GetValue<string>() == itemId);
    }

    private (string Folder, JsonObject Report)? Report(string scope)
    {
        if (reports.TryGetValue(scope, out var cached)) return cached;
        (string, JsonObject)? loaded = null;
        try
        {
            var folder = (store ?? new ScopeStore()).Resolve(scope);
            if (JsonNode.Parse(File.ReadAllBytes(Path.Combine(folder, "report.json"))) is JsonObject report)
                loaded = (folder, report);
        }
        catch (Exception error) when (error is CliException or IOException or UnauthorizedAccessException
            or System.Text.Json.JsonException)
        {
            loaded = null;
        }
        reports[scope] = loaded;
        return loaded;
    }
}
