// Owns the exact-file Checklist CLI boundary without entering the report-hosting path.
namespace TaskProgress;

internal static class ChecklistCommand
{
    public static int Run(string[] args) => Run(args, ChecklistDesktopHost.Run);

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
