// Owns the exact-file Checklist CLI boundary without entering the report-hosting path.
namespace TaskProgress;

internal static class ChecklistCommand
{
    public static int Run(string[] args) => Run(args, ChecklistDesktopHost.Run, ChecklistErrorDialog.Show);

    internal static int Run(string[] args, Action<string> openWindow, Action<string> reportError)
    {
        ArgumentNullException.ThrowIfNull(reportError);
        try
        {
            return Run(args, openWindow);
        }
        catch (CliException error)
        {
            // Both channels on purpose: a console run still prints, and a
            // shortcut run still gets a window instead of a silent exit.
            Console.Error.WriteLine($"錯誤：{error.Message}");
            reportError(error.Message);
            return 1;
        }
    }

    internal static int Run(string[] args, Action<string> openWindow)
    {
        ArgumentNullException.ThrowIfNull(args);
        ArgumentNullException.ThrowIfNull(openWindow);
        if (args.Length != 1)
        {
            throw new CliException("用法：task-progress checklist <implementation-checklist.md>");
        }

        var path = ChecklistDocumentStore.ValidatePath(args[0]);
        _ = new ChecklistDocumentStore().Load(path);
        openWindow(path);
        return 0;
    }
}
