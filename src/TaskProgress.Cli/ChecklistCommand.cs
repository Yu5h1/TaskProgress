// Owns the exact-file Checklist CLI boundary without entering the report-hosting path.
namespace TaskProgress;

internal static class ChecklistCommand
{
    public static int Run(string[] args)
    {
        ArgumentNullException.ThrowIfNull(args);
        // Three commands, two error edges. The window command is normally
        // launched from a shortcut with no console, so a failure there needs a
        // dialog. `validate` and `request` are its console twins — one written
        // for an agent checking its own file, the other for a browser-side edit
        // host piping a bridge message through stdin/stdout — where a message
        // box is a hang, not a report. Only the edge differs; every path
        // reaches the same store load.
        if (args.Length > 0 && string.Equals(args[0], "validate", StringComparison.OrdinalIgnoreCase))
        {
            return Validate(args[1..]);
        }

        if (args.Length > 0 && string.Equals(args[0], "request", StringComparison.OrdinalIgnoreCase))
        {
            return Request(args[1..]);
        }

        return Run(args, ChecklistDesktopHost.Run, ChecklistErrorDialog.Show);
    }

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

    // Reports the parser's verdict on stdout and nothing else: no window, no
    // dialog, no write back to the file. This is the only way a checklist author
    // can confirm the document contract without a desktop session.
    internal static int Validate(string[] args)
    {
        ArgumentNullException.ThrowIfNull(args);
        try
        {
            if (args.Length != 1)
            {
                throw new CliException("用法：task-progress checklist validate <task.checklist>");
            }

            var path = ChecklistDocumentStore.ValidatePath(args[0]);
            var document = new ChecklistDocumentStore().Load(path);
            var checks = document.Items.Sum(item => item.Checks.Count);
            var manual = document.Items.Sum(item => item.Checks.Count(check => check.IsManual));
            Console.WriteLine($"Checklist 格式正確：{path}");
            Console.WriteLine($"  Current round：{document.RoundIdentity}");
            Console.WriteLine($"  work items {document.Items.Count}，checks {checks}（manual {manual}）");
            return 0;
        }
        catch (CliException error)
        {
            Console.Error.WriteLine($"錯誤：{error.Message}");
            return 1;
        }
    }

    // The stdin/stdout twin of the WebView bridge: one JSON message in, one
    // JSON message out, no window, no revision state kept between calls. This
    // is the seam a browser-side edit host pipes a bridge request through so
    // the one C# parser stays the only parser, without this file knowing that
    // caller exists — no port, no host name, no reference of any kind to it,
    // matching the boundary the sibling `validate` command already keeps.
    // Handle() already reports its own business errors (unknown message,
    // invalid payload, revision conflict) as
    // a `type: "error"` JSON body, so this command's own try/catch only covers
    // what would leave it with no JSON to print at all: a bad --file, or an
    // unreadable stdin. Exit code follows that split — 0 means a JSON response
    // was produced (success or business error alike), non-zero means it was not.
    internal static int Request(string[] args)
    {
        ArgumentNullException.ThrowIfNull(args);
        try
        {
            string? file = null;
            for (var index = 0; index < args.Length; index++)
            {
                if (!string.Equals(args[index], "--file", StringComparison.OrdinalIgnoreCase))
                {
                    throw new CliException($"不支援的參數：{args[index]}");
                }
                if (index + 1 >= args.Length)
                {
                    throw new CliException("--file 需要一個路徑。");
                }
                file = args[++index];
            }
            if (file is null)
            {
                throw new CliException("用法：task-progress checklist request --file <task.checklist>");
            }

            var bridge = new ChecklistBridge(file);
            var requestJson = Console.In.ReadToEnd();
            Console.WriteLine(bridge.Handle(requestJson));
            return 0;
        }
        catch (CliException error)
        {
            Console.Error.WriteLine($"錯誤：{error.Message}");
            return 1;
        }
    }
}
