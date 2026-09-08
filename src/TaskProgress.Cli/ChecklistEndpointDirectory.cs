// Protects the application-owned discovery directory before the edit host writes client credentials.
using System.Security.AccessControl;
using System.Security.Principal;

namespace TaskProgress;

internal static class ChecklistEndpointDirectory
{
    /// <summary>
    ///   Grants the current Windows user access to discovery files without inherited grants to other users.
    /// </summary>
    public static void Prepare(string path)
    {
        using var identity = WindowsIdentity.GetCurrent();
        var user = identity.User ?? throw new CliException("無法識別端點探索檔的 Windows 使用者。");
        var security = new DirectorySecurity();
        security.SetOwner(user);
        security.SetAccessRuleProtection(isProtected: true, preserveInheritance: false);
        security.AddAccessRule(new FileSystemAccessRule(
            user,
            FileSystemRights.FullControl,
            InheritanceFlags.ContainerInherit | InheritanceFlags.ObjectInherit,
            PropagationFlags.None,
            AccessControlType.Allow));
        var directory = new DirectoryInfo(Path.GetFullPath(path));
        if (directory.Exists)
        {
            if ((directory.Attributes & FileAttributes.ReparsePoint) != 0)
                throw new CliException("端點探索目錄不可為重新解析點。");
            directory.SetAccessControl(security);
        }
        else
        {
            directory.Create(security);
        }
    }
}
