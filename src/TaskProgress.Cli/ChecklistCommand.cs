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
        var operation = args.Length == 1 ? args[0] : null;
        var uninstalled = false;
        var result = Run(
            args,
            openWindow,
            ChecklistFileRegistration.Install,
            () => uninstalled = ChecklistFileRegistration.Uninstall());

        if (string.Equals(operation, "install", StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine("已為目前 Windows 使用者註冊 .checklist 檔案關聯。");
        }
        else if (string.Equals(operation, "uninstall", StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine(uninstalled
                ? "已移除 TaskProgress .checklist 檔案關聯。"
                : "TaskProgress .checklist 檔案關聯尚未註冊。 ");
        }
        return result;
    }

    internal static int Run(
        string[] args,
        Action<string> openWindow,
        Action installAssociation,
        Func<bool> uninstallAssociation)
    {
        ArgumentNullException.ThrowIfNull(args);
        ArgumentNullException.ThrowIfNull(openWindow);
        ArgumentNullException.ThrowIfNull(installAssociation);
        ArgumentNullException.ThrowIfNull(uninstallAssociation);
        if (args.Length != 1)
        {
            throw new CliException("用法：task-progress checklist <task.checklist>|install|uninstall");
        }

        if (string.Equals(args[0], "install", StringComparison.OrdinalIgnoreCase))
        {
            installAssociation();
            return 0;
        }

        if (string.Equals(args[0], "uninstall", StringComparison.OrdinalIgnoreCase))
        {
            _ = uninstallAssociation();
            return 0;
        }

        var path = ChecklistDocumentStore.ValidatePath(args[0]);
        _ = new ChecklistDocumentStore().Load(path);
        openWindow(path);
        return 0;
    }
}
