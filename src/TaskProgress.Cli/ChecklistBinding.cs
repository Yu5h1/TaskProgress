// Finds the Report child item a checklist is bound to, from the report beside its checklists folder.
using System.Text.Json;

namespace TaskProgress;

internal sealed record ChecklistBindingInfo(
    string ReportFolder,
    string ScopeId,
    string TaskId,
    string ItemId,
    IReadOnlySet<string> ExcludedAcceptors,
    DateTimeOffset? ReleasedAt);

internal static class ChecklistBinding
{
    /// <summary>
    ///   Returns the item whose <c>document_ref</c> names this checklist, with
    ///   every session that created, started or took it over (none of them may
    ///   accept it) and its latest release;
    ///   null when nothing binds it.
    /// </summary>
    public static ChecklistBindingInfo? Find(string checklistPath)
    {
        var fullPath = Path.GetFullPath(checklistPath);
        var directory = Path.GetDirectoryName(fullPath);
        if (directory is null || !string.Equals(Path.GetFileName(directory), "checklists", StringComparison.OrdinalIgnoreCase))
            return null;
        var root = Path.GetDirectoryName(directory);
        if (root is null) return null;
        var reportPath = Path.Combine(root, "report.json");
        if (!File.Exists(reportPath)) return null;
        var stem = Path.GetFileNameWithoutExtension(fullPath);
        using var document = JsonDocument.Parse(File.ReadAllBytes(reportPath));
        var report = document.RootElement;
        var scope = report.TryGetProperty("scope_id", out var scopeElement) ? scopeElement.GetString() : null;
        if (scope is null || !report.TryGetProperty("tasks", out var tasks)) return null;
        foreach (var task in tasks.EnumerateArray())
        {
            if (task.TryGetProperty("kind", out var kind) && kind.GetString() == "report_pointer") continue;
            foreach (var list in new[] { "pending_items", "completed_items" })
            {
                if (!task.TryGetProperty(list, out var items)) continue;
                foreach (var item in items.EnumerateArray())
                {
                    if (item.ValueKind != JsonValueKind.Object || !Binds(item, scope, stem)) continue;
                    return new ChecklistBindingInfo(
                        root,
                        scope,
                        task.GetProperty("id").GetString()!,
                        item.GetProperty("id").GetString()!,
                        ExcludedAcceptors(item),
                        LatestRelease(item));
                }
            }
        }
        return null;
    }

    private static bool Binds(JsonElement item, string scope, string stem) =>
        item.TryGetProperty("document_ref", out var reference)
        && reference.TryGetProperty("kind", out var kind) && kind.GetString() == "checklist"
        && reference.TryGetProperty("scope_id", out var scopeId) && scopeId.GetString() == scope
        && reference.TryGetProperty("task", out var task) && task.GetString() == stem;

    private static IReadOnlySet<string> ExcludedAcceptors(JsonElement item)
    {
        var sessions = new HashSet<string>(StringComparer.Ordinal);
        if (!item.TryGetProperty("activity", out var activity)) return sessions;
        foreach (var entry in activity.EnumerateArray())
        {
            var name = entry.TryGetProperty("event", out var eventName) ? eventName.GetString() : null;
            if (name is not ("created" or "started" or "takeover")) continue;
            if (entry.TryGetProperty("session_id", out var session) && session.GetString() is { Length: > 0 } id)
                sessions.Add(id);
        }
        return sessions;
    }

    private static DateTimeOffset? LatestRelease(JsonElement item)
    {
        DateTimeOffset? latest = null;
        if (!item.TryGetProperty("activity", out var activity)) return latest;
        foreach (var entry in activity.EnumerateArray())
        {
            if (!entry.TryGetProperty("event", out var eventName) || eventName.GetString() != "released") continue;
            if (entry.TryGetProperty("at", out var at)
                && DateTimeOffset.TryParse(at.GetString(), System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.RoundtripKind, out var parsed)
                && (latest is null || parsed > latest))
                latest = parsed;
        }
        return latest;
    }
}
