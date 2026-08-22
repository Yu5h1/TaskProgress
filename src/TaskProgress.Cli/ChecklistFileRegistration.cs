using Microsoft.Win32;

namespace TaskProgress;

internal static class ChecklistFileRegistration
{
    public const string FileExtension = ".checklist";
    internal const string ProgId = "TaskProgress.Checklist";
    private const string ClassesPath = @"Software\Classes";

    public static void Install()
    {
        EnsureWindows();
        var processPath = CurrentProcessPath();

        using var extension = Registry.CurrentUser.CreateSubKey(
            $@"{ClassesPath}\{FileExtension}",
            writable: true)
            ?? throw new CliException("無法建立 .checklist Registry key。 ");
        extension.SetValue(null, ProgId);

        using var fileType = Registry.CurrentUser.CreateSubKey(
            $@"{ClassesPath}\{ProgId}",
            writable: true)
            ?? throw new CliException("無法建立 TaskProgress Checklist Registry key。 ");
        fileType.SetValue(null, "TaskProgress Checklist");

        using var icon = fileType.CreateSubKey("DefaultIcon", writable: true);
        icon?.SetValue(null, $"\"{processPath}\",0");

        using var openCommand = fileType.CreateSubKey(@"shell\open\command", writable: true);
        openCommand?.SetValue(null, BuildLaunchCommand(processPath));
    }

    public static bool Uninstall()
    {
        EnsureWindows();
        using var classes = Registry.CurrentUser.OpenSubKey(ClassesPath, writable: true)
            ?? throw new CliException("無法開啟目前使用者的 Software\\Classes。 ");

        var ownsExtension = false;
        using (var extension = classes.OpenSubKey(FileExtension))
        {
            ownsExtension = string.Equals(
                extension?.GetValue(null) as string,
                ProgId,
                StringComparison.OrdinalIgnoreCase);
        }

        var removed = false;
        if (ownsExtension)
        {
            classes.DeleteSubKeyTree(FileExtension, throwOnMissingSubKey: false);
            removed = true;
        }

        using (var fileType = classes.OpenSubKey(ProgId))
        {
            if (fileType is null) return removed;
        }
        classes.DeleteSubKeyTree(ProgId, throwOnMissingSubKey: false);
        return true;
    }

    internal static string BuildLaunchCommand(string processPath)
    {
        if (string.IsNullOrWhiteSpace(processPath))
        {
            throw new CliException("無法取得目前執行檔路徑。 ");
        }
        if (string.Equals(Path.GetFileName(processPath), "dotnet.exe", StringComparison.OrdinalIgnoreCase))
        {
            throw new CliException("請使用發布後的 task-progress.exe 註冊 .checklist 檔案關聯。 ");
        }
        return $"\"{processPath}\" checklist \"%1\"";
    }

    private static string CurrentProcessPath() => Environment.ProcessPath
        ?? throw new CliException("無法取得目前執行檔路徑。 ");

    private static void EnsureWindows()
    {
        if (!OperatingSystem.IsWindows())
        {
            throw new CliException(".checklist 檔案關聯只能在 Windows 註冊。 ");
        }
    }
}
