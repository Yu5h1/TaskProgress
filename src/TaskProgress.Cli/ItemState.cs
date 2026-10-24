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
    public const string Obsolete = "obsolete";
    public const string Discontinued = "discontinued";

    /// <summary>
    ///   Stored statuses that take an item out of the work for good: replaced by another item, or dropped.
    /// </summary>
    public static bool IsRetired(string? status) => status is Obsolete or Discontinued;
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

    /// <summary>
    ///   The item's derived state. An unbound item with no stored status takes it from its array:
    ///   <c>completed_items</c> means done. <paramref name="completed"/> names that array when the
    ///   caller knows it; otherwise it is looked up in the scope's report. An item that started on
    ///   a waited item lacking only the user's acceptance needs fixing once the user fails that
    ///   acceptance, until it is released or done again.
    /// </summary>
    public string StateOf(string scope, JsonObject item, int depth = 0, bool? completed = null)
    {
        if (item["status"]?.GetValue<string>() is { } retired && ItemStates.IsRetired(retired)) return retired;
        if (MustRedo(item, depth)) return ItemStates.NeedsFix;
        var checklist = BoundChecklist(scope, item, out var bound);
        var stored = item["status"]?.GetValue<string>();
        if (bound && checklist is not null && IsDone(checklist, LatestAt(item, "released"))) return ItemStates.Done;
        if (DecisionsAnswered(item)) return ItemStates.Done;
        if (!bound && stored == "done") return ItemStates.Done;
        if (!bound && stored is null && (completed ?? InCompleted(scope, item))) return ItemStates.Done;
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

    public bool IsDone(string scope, string taskId, string itemId, int depth) =>
        Target(scope, taskId, itemId, depth).Done;

    /// <summary>
    ///   A waited item: done, lacking only the user's <c>[manual]</c> acceptance (read from its
    ///   checklist alone: every other check passed and the user failed none), and when the user last
    ///   failed a <c>[manual]</c> check still marked failed in the file. The mark counts even after the
    ///   waited item's fix is released, so a waiter cannot skip its redo before the user passes again.
    /// </summary>
    private (bool Done, bool OnlyManual, DateTimeOffset? UserFailedAt) Target(string scope, string taskId, string itemId, int depth)
    {
        if (depth > DepthLimit) return (false, false, null);
        var (found, completed) = FindItem(scope, taskId, itemId);
        if (found is null) return (false, false, null);
        if (StateOf(scope, found, depth + 1, completed) == ItemStates.Done) return (true, false, null);
        if (BoundChecklist(scope, found, out _) is not { } checklist) return (false, false, null);
        var released = LatestAt(found, "released");
        var checks = checklist.Items.SelectMany(work => work.Checks).ToArray();
        var onlyManual = FromChecklist(checklist, found) == ItemStates.AwaitingUser
            && checks.All(check => check.IsManual || ChecklistDocument.EffectiveStatus(check, released) == ChecklistStatus.Passed);
        var userFailedAt = checks
            .Where(check => check.IsManual && check.Record?.Recorder == "user" && check.Status == ChecklistStatus.Failed)
            .Select(check => (DateTimeOffset?)check.Record!.At)
            .DefaultIfEmpty(null)
            .Max();
        return (false, onlyManual, userFailedAt);
    }

    private static IEnumerable<(string Scope, string Task, string Item, bool Strict)> ItemWaits(JsonObject item) =>
        (item["waits_for"] as JsonArray)?.OfType<JsonObject>()
            .Where(wait => wait["checklist"] is null)
            .Select(wait => (wait["scope_id"]?.GetValue<string>(), wait["task_id"]?.GetValue<string>(),
                wait["item_id"]?.GetValue<string>(), wait["strict"]?.GetValue<bool>() == true))
            .Where(wait => wait.Item1 is not null && wait.Item2 is not null && wait.Item3 is not null)
            .Select(wait => (wait.Item1!, wait.Item2!, wait.Item3!, wait.Item4))
        ?? [];

    private bool MustRedo(JsonObject item, int depth)
    {
        if (LatestAt(item, "started") is null && LatestAt(item, "takeover") is null) return false;
        var redone = new[] { LatestAt(item, "released"), LatestAt(item, "done") }.Max();
        return ItemWaits(item).Any(wait => !wait.Strict
            && Target(wait.Scope, wait.Task, wait.Item, depth).UserFailedAt is { } failed
            && (redone is null || redone < failed));
    }

    private bool Waits(JsonObject item, int depth)
    {
        if (item["waits_for"] is not JsonArray waits) return false;
        foreach (var wait in waits.OfType<JsonObject>())
        {
            if (wait["checklist"] is JsonValue stemValue)
            {
                if (!stemValue.TryGetValue<string>(out var stem)
                    || !IsWorkItemDone(wait["scope_id"]?.GetValue<string>(), stem, wait["work_item"])) return true;
                continue;
            }
            if (wait["scope_id"]?.GetValue<string>() is null || wait["task_id"]?.GetValue<string>() is null
                || wait["item_id"]?.GetValue<string>() is null) return true;
        }
        foreach (var (scope, task, target, strict) in ItemWaits(item))
        {
            var waited = Target(scope, task, target, depth);
            if (!waited.Done && (strict || !waited.OnlyManual)) return true;
        }
        return false;
    }

    /// <summary>
    ///   A waited checklist work item is done when it exists and every check
    ///   in it passes, a tagged result voided by its bound item's release
    ///   counting as pending.
    /// </summary>
    private bool IsWorkItemDone(string? scope, string stem, JsonNode? workItem)
    {
        if (scope is null || workItem is not JsonValue number || !number.TryGetValue<int>(out var id)
            || Report(scope) is not { } owner) return false;
        var path = Path.Combine(owner.Folder, "checklists", stem + ".checklist");
        var work = LoadChecklist(path)?.Items.FirstOrDefault(candidate => candidate.Id == id);
        if (work is null || work.Checks.Count == 0) return false;
        var released = ChecklistBinding.Find(path)?.ReleasedAt;
        return work.Checks.All(check => ChecklistDocument.EffectiveStatus(check, released) == ChecklistStatus.Passed);
    }

    private static string FromChecklist(ChecklistDocument checklist, JsonObject item)
    {
        var checks = checklist.Items.SelectMany(work => work.Checks).ToArray();
        var released = LatestAt(item, "released");
        var disputed = LatestAt(item, "disputed");
        var conditions = checks
            .Where(check => check.IsAcceptance && ChecklistDocument.EffectiveStatus(check, released) == ChecklistStatus.Failed
                && check.Record?.RejectReason == ChecklistRejectReason.Condition)
            .ToArray();
        if (conditions.Any(check => check.Record!.ConditionCount >= 2 || (disputed is { } at && at > check.Record.At)))
            return ItemStates.Disputed;
        if (conditions.Length > 0) return ItemStates.ConditionsToRevise;
        var unfixed = checks.Where(check => ChecklistDocument.EffectiveStatus(check, released) == ChecklistStatus.Failed
            && ((check.IsAcceptance && check.Record?.RejectReason == ChecklistRejectReason.Implementation)
                || (check.IsManual && check.Record?.Recorder == "user")));
        if (unfixed.Any(check => released is null || check.Record!.At > released)) return ItemStates.NeedsFix;
        var executorFailed = checks.Any(check => !check.IsTagged && check.Status == ChecklistStatus.Failed);
        var agentRecheck = checks.Any(check => check.IsManual && ChecklistDocument.EffectiveStatus(check, released) == ChecklistStatus.Failed
            && check.Record?.Recorder != "user");
        var manualOpen = checks.Any(check => check.IsManual && ChecklistDocument.EffectiveStatus(check, released) != ChecklistStatus.Passed);
        var acceptanceComplete = checklist.IsAcceptanceComplete(released);
        if (executorFailed || agentRecheck
            || (manualOpen && checklist.UntaggedComplete && acceptanceComplete))
            return ItemStates.AwaitingUser;
        if (checklist.UntaggedComplete && !acceptanceComplete) return ItemStates.AwaitingAcceptance;
        return item["activity"] is JsonArray activity
            && activity.OfType<JsonObject>().Any(entry => entry["event"]?.GetValue<string>() is "started" or "takeover")
            ? ItemStates.InProgress
            : ItemStates.NotStarted;
    }

    private static bool IsDone(ChecklistDocument checklist, DateTimeOffset? released) =>
        checklist.Items.SelectMany(work => work.Checks).All(check => ChecklistDocument.EffectiveStatus(check, released) == ChecklistStatus.Passed);

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
        return LoadChecklist(Path.Combine(owner.Folder, "checklists", task + ".checklist"));
    }

    /// <summary>
    ///   A decisions-bound item is done once its decisions file has at least one decision and every
    ///   one is decided with an answer, matching the Viewer's binding projection.
    /// </summary>
    private bool DecisionsAnswered(JsonObject item)
    {
        if (item["document_ref"] is not JsonObject reference || reference["kind"]?.GetValue<string>() != "decision"
            || reference["scope_id"]?.GetValue<string>() is not { } scope
            || (reference["task"] ?? reference["stem"])?.GetValue<string>() is not { } stem
            || Report(scope) is not { } owner) return false;
        try
        {
            var path = Path.Combine(owner.Folder, "decisions", stem + ".decisions");
            return File.Exists(path)
                && JsonNode.Parse(File.ReadAllBytes(path))?["decisions"] is JsonArray decisions
                && decisions.Count > 0
                && decisions.All(decision => decision?["status"]?.GetValue<string>() == "decided" && decision["answer"] is JsonObject);
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException or System.Text.Json.JsonException
            or InvalidOperationException)
        {
            return false;
        }
    }

    private ChecklistDocument? LoadChecklist(string path)
    {
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

    private (JsonObject? Item, bool Completed) FindItem(string scope, string taskId, string itemId)
    {
        if (Report(scope)?.Report["tasks"] is not JsonArray tasks) return (null, false);
        var task = tasks.OfType<JsonObject>().FirstOrDefault(t => t["id"]?.GetValue<string>() == taskId);
        foreach (var list in new[] { "pending_items", "completed_items" })
        {
            var found = (task?[list] as JsonArray)?.OfType<JsonObject>()
                .FirstOrDefault(entry => entry["id"]?.GetValue<string>() == itemId);
            if (found is not null) return (found, list == "completed_items");
        }
        return (null, false);
    }

    private bool InCompleted(string scope, JsonObject item) =>
        Report(scope)?.Report["tasks"] is JsonArray tasks
        && tasks.OfType<JsonObject>().Any(task =>
            (task["completed_items"] as JsonArray)?.Any(entry => ReferenceEquals(entry, item)) == true);

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
