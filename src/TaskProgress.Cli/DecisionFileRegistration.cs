// Uses the same per-user registration mechanism as Checklist for named decision files.
namespace TaskProgress;

internal static class DecisionFileRegistration
{
    public const string FileExtension = ".decisions";
    internal const string ProgId = "TaskProgress.Decisions";

    public static void Install() => ChecklistFileRegistration.Install(FileExtension, ProgId);
    public static bool Uninstall() => ChecklistFileRegistration.Uninstall(FileExtension, ProgId);
    internal static string BuildLaunchCommand(string processPath) => ChecklistFileRegistration.BuildLaunchCommand(processPath);
}
