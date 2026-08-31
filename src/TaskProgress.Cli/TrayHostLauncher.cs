// Hands the tray over to Yu5h1Lib.TrayHost rather than reimplementing it here.
//
// The single-instance guarantee is TrayHost's, not ours: `invoke` starts a Host
// only when its standalone mutex is absent and otherwise talks to the Host
// already running. Calling `host` directly instead would mean writing a second
// "already open, do not open again" rule next to the one TrayHost identity
// already enforces, so this only ever calls `invoke`.
//
// The manifest is resolved beside this executable. That is what keeps one
// deployment to one tray: TrayHost derives standalone identity from the
// manifest's canonical path, so a second copy of the file would be a second
// tray competing for the same port.
//
// `--buildIcon` is passed on every call rather than being a separate setup
// step. It creates only the icon files that are missing and writes nothing
// once they exist, so it costs an existence check and removes the class of
// bug where a fresh deployment has a manifest but no artwork. The icons are
// therefore generated beside the executable and never live in the sources.

using System.Diagnostics;

namespace TaskProgress;

/// <summary>
///   Resolves the TrayHost executable and forwards one request to the tray.
/// </summary>
internal static class TrayHostLauncher
{
    internal const string ManifestFileName = "taskprogress.trayapp.json";
    private const string ExecutableName = "Yu5h1Lib.TrayHost.exe";

    /// <summary>
    ///   Runs one request through the standalone tray instance, starting it
    ///   first when it is not running yet, and returns whatever the worker
    ///   printed. A non-zero exit becomes an error the caller reports.
    /// </summary>
    internal static async Task<string> InvokeAsync(
        IReadOnlyList<string> arguments,
        CancellationToken cancellationToken)
    {
        var executable = ResolveExecutable();
        var manifest = ResolveManifest();

        var startInfo = new ProcessStartInfo
        {
            FileName = executable,
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
        };
        startInfo.ArgumentList.Add("invoke");
        startInfo.ArgumentList.Add(manifest);
        startInfo.ArgumentList.Add("--standalone");
        startInfo.ArgumentList.Add("--buildIcon");
        startInfo.ArgumentList.Add("--");
        foreach (var argument in arguments)
        {
            startInfo.ArgumentList.Add(argument);
        }

        using var process = Process.Start(startInfo)
            ?? throw new CliException($"無法執行 TrayHost：{executable}");
        var standardOutput = process.StandardOutput.ReadToEndAsync(cancellationToken);
        var standardError = process.StandardError.ReadToEndAsync(cancellationToken);
        await process.WaitForExitAsync(cancellationToken);

        var output = await standardOutput;
        if (process.ExitCode != 0)
        {
            var detail = (await standardError).Trim();
            throw new CliException(detail.Length == 0
                ? $"TrayHost invoke 失敗，exit code {process.ExitCode}。"
                : $"TrayHost invoke 失敗：{detail}");
        }

        return output.Trim();
    }

    /// <summary>
    ///   Finds the released TrayHost the same way the Launcher finds its
    ///   sibling LocalWebService: an explicit override first, then an upward
    ///   search. Only Release is searched — TrayHost is consumed here as a
    ///   published binary, and binding to a Debug output would make this
    ///   project depend on someone else's work in progress.
    /// </summary>
    internal static string ResolveExecutable()
    {
        var configured = Environment.GetEnvironmentVariable("TASK_PROGRESS_TRAY_HOST");
        if (!string.IsNullOrWhiteSpace(configured))
        {
            var path = Path.GetFullPath(Environment.ExpandEnvironmentVariables(configured));
            if (!File.Exists(path))
            {
                throw new CliException(
                    $"找不到 TrayHost：{path}。請檢查 TASK_PROGRESS_TRAY_HOST。 ");
            }
            return path;
        }

        foreach (var start in new[] { AppContext.BaseDirectory, Environment.CurrentDirectory })
        {
            var found = SearchUpwards(start);
            if (found is not null) return found;
        }

        throw new CliException(
            $"找不到已發布的 {ExecutableName}（只搜尋 Winform/bin/TrayHost/Release）。請取得 TrayHost 的 Release 建置，或設定 TASK_PROGRESS_TRAY_HOST。 ");
    }

    /// <summary>
    ///   Returns the TrayApp manifest that belongs to this deployment.
    /// </summary>
    internal static string ResolveManifest()
    {
        var directory = Path.GetDirectoryName(Environment.ProcessPath) ?? AppContext.BaseDirectory;
        var manifest = Path.Combine(directory, ManifestFileName);
        if (!File.Exists(manifest))
        {
            throw new CliException($"找不到 TrayApp manifest：{manifest}");
        }
        return manifest;
    }

    private static string? SearchUpwards(string start)
    {
        var directory = new DirectoryInfo(Path.GetFullPath(start));
        while (directory is not null)
        {
            var candidate = Path.Combine(
                directory.FullName,
                "Winform",
                "bin",
                "TrayHost",
                "Release",
                ExecutableName);
            if (File.Exists(candidate)) return candidate;
            directory = directory.Parent;
        }
        return null;
    }
}
