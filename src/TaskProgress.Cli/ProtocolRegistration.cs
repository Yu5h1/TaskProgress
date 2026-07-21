using Microsoft.Win32;

namespace TaskProgress;

internal static class ProtocolRegistration
{
    public const string Scheme = "task-progress";
    private const string RegistryPath = $@"Software\Classes\{Scheme}";

    public static void Install()
    {
        EnsureWindows();
        var command = BuildLaunchCommand();
        using var protocol = Registry.CurrentUser.CreateSubKey(RegistryPath, writable: true)
            ?? throw new CliException("無法建立 task-progress protocol Registry key。 ");
        protocol.SetValue(null, "URL:TaskProgress Protocol");
        protocol.SetValue("URL Protocol", string.Empty);

        using var icon = protocol.CreateSubKey("DefaultIcon", writable: true);
        icon?.SetValue(null, $"\"{Environment.ProcessPath}\",0");

        using var openCommand = protocol.CreateSubKey(@"shell\open\command", writable: true);
        openCommand?.SetValue(null, command);
    }

    public static bool Uninstall()
    {
        EnsureWindows();
        using var classes = Registry.CurrentUser.OpenSubKey(@"Software\Classes", writable: true)
            ?? throw new CliException("無法開啟目前使用者的 Software\\Classes。 ");
        using var existing = classes.OpenSubKey(Scheme);
        if (existing is null)
        {
            return false;
        }
        existing.Close();
        classes.DeleteSubKeyTree(Scheme, throwOnMissingSubKey: false);
        return true;
    }

    private static string BuildLaunchCommand()
    {
        var processPath = Environment.ProcessPath
            ?? throw new CliException("無法取得目前執行檔路徑。 ");
        if (string.Equals(Path.GetFileName(processPath), "dotnet.exe", StringComparison.OrdinalIgnoreCase))
        {
            throw new CliException("請使用發布後的 task-progress.exe 註冊 protocol。 ");
        }
        return $"\"{processPath}\" \"%1\"";
    }

    private static void EnsureWindows()
    {
        if (!OperatingSystem.IsWindows())
        {
            throw new CliException("task-progress protocol 只能在 Windows 註冊。 ");
        }
    }
}
