// WinExe activation with opt-in observation consoles and preserved CLI pipes.
using System.Runtime.InteropServices;
using System.Text;

namespace TaskProgress;

internal static class ConsoleEntry
{
    internal static void Initialize(string[] args)
    {
        if (args.Length == 0) return;
        var handles = new[] { -10, -11, -12 }.Select(id => (Id: id, Handle: GetStdHandle(id))).ToArray();
        var redirected = handles.Where(h => GetFileType(h.Handle) is 1 or 3).ToArray();
        // Pipe-driven worker/bridge commands must never attach to a parent console.
        var attached = redirected.Length < handles.Length && AttachConsole(uint.MaxValue);
        var observe = args[0].Equals("start", StringComparison.OrdinalIgnoreCase)
            && args.Any(a => a.Equals("--console", StringComparison.OrdinalIgnoreCase));
        if (!attached && observe && GetConsoleWindow() == IntPtr.Zero)
        {
            if (!AllocConsole()) throw new InvalidOperationException("無法建立日誌觀察 Console。");
            attached = true;
        }
        foreach (var handle in redirected) SetStdHandle(handle.Id, handle.Handle);
        if (!attached) return;
        Console.SetOut(new StreamWriter(Console.OpenStandardOutput(), new UTF8Encoding(false)) { AutoFlush = true });
        Console.SetError(new StreamWriter(Console.OpenStandardError(), new UTF8Encoding(false)) { AutoFlush = true });
        Console.SetIn(new StreamReader(Console.OpenStandardInput(), new UTF8Encoding(false)));
    }

    internal static void ShowStartupError(string[] args, string message)
    {
        var startup = args.Length == 0 || args[0].Equals("start", StringComparison.OrdinalIgnoreCase);
        if (startup && GetConsoleWindow() == IntPtr.Zero && GetFileType(GetStdHandle(-12)) is not (1 or 3))
            System.Windows.MessageBox.Show(message, "TaskProgress 啟動失敗");
    }

    [DllImport("kernel32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool AttachConsole(uint processId);
    [DllImport("kernel32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool AllocConsole();
    [DllImport("kernel32.dll")]
    private static extern IntPtr GetConsoleWindow();
    [DllImport("kernel32.dll")]
    private static extern IntPtr GetStdHandle(int id);
    [DllImport("kernel32.dll")]
    private static extern uint GetFileType(IntPtr handle);
    [DllImport("kernel32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool SetStdHandle(int id, IntPtr handle);
}
