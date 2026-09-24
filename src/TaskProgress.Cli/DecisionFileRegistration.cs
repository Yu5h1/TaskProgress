// Uses the same per-user registration mechanism as Checklist for named decision files.
namespace TaskProgress;

internal static class DecisionFileRegistration
{
    public static void Install() => ChecklistFileRegistration.Install(".decisions", "TaskProgress.Decisions", "decisions");
    public static bool Uninstall() => ChecklistFileRegistration.Uninstall(".decisions", "TaskProgress.Decisions");
}
