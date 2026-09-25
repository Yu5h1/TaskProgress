// Adapts report commands to the shared Python editor without starting a service.
using System.Diagnostics;
using System.Text;
using System.Text.Json;

namespace TaskProgress;

/// <summary>
///   Owns report arguments and the one-shot process boundary; editing rules remain in Python.
/// </summary>
internal static class ReportCommand
{
    private static readonly Encoding Utf8 = new UTF8Encoding(false, true);

    internal static async Task<int> RunAsync(
        string[] args, ScopeStore store, CancellationToken cancellationToken)
    {
        try
        {
            var request = Parse(args, store);
            var input = request.Input is null ? null
                : request.Input == "-"
                    ? await Console.In.ReadToEndAsync(cancellationToken)
                    : await ReadInputAsync(request.Input, cancellationToken);
            return await ExecuteAsync(request, input, cancellationToken);
        }
        catch (CliException error)
        {
            return Fail(2, "invalid_input", error.Message);
        }
        catch (OperationCanceledException)
        {
            return Fail(4, "cancelled", "Report command was cancelled; inspect the source before retrying an apply.");
        }
        catch (Exception error)
        {
            return Fail(4, "runtime_error", error.Message);
        }
    }

    private static Request Parse(string[] args, ScopeStore store)
    {
        if (args.Length == 0)
            throw new CliException("用法：report get|validate|apply <folder>|--scope <id> [選項]");
        var action = args[0].ToLowerInvariant();
        if (action is not ("get" or "validate" or "apply"))
            throw new CliException($"不支援的 report 命令：{args[0]}");
        string? folder = null;
        string? scope = null;
        string? task = null;
        string? input = null;
        var dryRun = false;
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        for (var index = 1; index < args.Length; index++)
        {
            var argument = args[index];
            if (!argument.StartsWith('-'))
            {
                if (folder is not null) throw new CliException("report 只能指定一個 folder。");
                folder = argument;
                continue;
            }
            var option = argument.ToLowerInvariant();
            if (option is not ("--scope" or "--task" or "--input" or "--dry-run"))
                throw new CliException($"不支援的 report 選項：{argument}");
            if (!seen.Add(option)) throw new CliException($"重複選項：{argument}");
            if (option == "--dry-run")
            {
                dryRun = true;
                continue;
            }
            if (++index >= args.Length || string.IsNullOrWhiteSpace(args[index])
                || (args[index].StartsWith('-') && !(option == "--input" && args[index] == "-")))
                throw new CliException($"{argument} 缺少值。");
            switch (option)
            {
                case "--scope": scope = args[index]; break;
                case "--task": task = args[index]; break;
                case "--input": input = args[index]; break;
            }
        }
        if ((folder is null) == (scope is null))
            throw new CliException("請指定 folder 或 --scope，兩者不可同時指定。");
        if (task is not null && action != "get") throw new CliException("--task 僅適用於 report get。");
        if ((input is not null || dryRun) && action != "apply")
            throw new CliException("--input 與 --dry-run 僅適用於 report apply。");
        if (action == "apply" && input is null) throw new CliException("report apply 需要 --input <file|->。");
        folder = scope is null ? folder : store.Resolve(scope);
        try
        {
            if (string.IsNullOrWhiteSpace(folder)) throw new ArgumentException("folder 不可為空白。");
            folder = Path.GetFullPath(folder);
        }
        catch (Exception error) when (error is ArgumentException or NotSupportedException or PathTooLongException)
        {
            throw new CliException($"無效的 report folder：{error.Message}");
        }
        return new Request(action, folder, task, input, dryRun);
    }

    private static async Task<string> ReadInputAsync(string path, CancellationToken cancellationToken)
    {
        try
        {
            var bytes = await File.ReadAllBytesAsync(path, cancellationToken);
            var offset = bytes.Length >= 3 && bytes[0] == 0xef && bytes[1] == 0xbb && bytes[2] == 0xbf ? 3 : 0;
            return Utf8.GetString(bytes, offset, bytes.Length - offset);
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException
            or ArgumentException or NotSupportedException)
        {
            throw new CliException($"無法讀取 UTF-8 input：{error.Message}");
        }
    }

    private static async Task<int> ExecuteAsync(Request request, string? input, CancellationToken cancellationToken)
    {
        var script = FindScript();
        var start = new ProcessStartInfo
        {
            FileName = Environment.GetEnvironmentVariable("TASK_PROGRESS_PYTHON") is { Length: > 0 } python
                ? python : "python",
            UseShellExecute = false,
            CreateNoWindow = false,
            RedirectStandardInput = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            StandardInputEncoding = Utf8,
            StandardOutputEncoding = Utf8,
            StandardErrorEncoding = Utf8,
        };
        start.Environment["PYTHONIOENCODING"] = "utf-8";
        start.ArgumentList.Add(script);
        start.ArgumentList.Add(request.Action);
        start.ArgumentList.Add("--folder");
        start.ArgumentList.Add(request.Folder);
        if (request.Task is not null)
        {
            start.ArgumentList.Add("--task");
            start.ArgumentList.Add(request.Task);
        }
        if (request.DryRun) start.ArgumentList.Add("--dry-run");
        start.ArgumentList.Add("--analyzer-json");
        start.ArgumentList.Add(JsonSerializer.Serialize(AnalyzerCommand()));
        using var process = new Process { StartInfo = start };
        cancellationToken.ThrowIfCancellationRequested();
        if (!process.Start()) throw new InvalidOperationException("Unable to start report Python runtime.");
        using var cancellation = cancellationToken.Register(() => Kill(process));
        var output = process.StandardOutput.ReadToEndAsync(cancellationToken);
        var diagnostic = process.StandardError.ReadToEndAsync(cancellationToken);
        try
        {
            if (input is not null) await process.StandardInput.WriteAsync(input.AsMemory(), cancellationToken);
            process.StandardInput.Close();
            await process.WaitForExitAsync(cancellationToken);
            var stdout = await output;
            var stderr = await diagnostic;
            if (stderr.Length > 0) Console.Error.Write(stderr);
            using var document = JsonDocument.Parse(stdout);
            var root = document.RootElement;
            if (root.ValueKind != JsonValueKind.Object
                || !root.TryGetProperty("ok", out var ok)
                || ok.ValueKind is not (JsonValueKind.True or JsonValueKind.False)
                || process.ExitCode is not (0 or 2 or 3 or 4)
                || ok.GetBoolean() != (process.ExitCode == 0))
                throw new InvalidOperationException("Report backend returned an invalid JSON result or exit code.");
            Console.WriteLine(root.GetRawText());
            return process.ExitCode;
        }
        finally
        {
            Kill(process);
        }
    }

    private static string[] AnalyzerCommand()
    {
        var executable = Environment.ProcessPath
            ?? throw new InvalidOperationException("Unable to locate the current CLI executable.");
        return string.Equals(Path.GetFileNameWithoutExtension(executable), "dotnet", StringComparison.OrdinalIgnoreCase)
            ? [executable, typeof(ReportCommand).Assembly.Location]
            : [executable];
    }

    private static string FindScript()
    {
        var configured = Environment.GetEnvironmentVariable("TASK_PROGRESS_VIEWER_ROOT");
        if (!string.IsNullOrWhiteSpace(configured))
        {
            var parent = Directory.GetParent(Path.GetFullPath(configured));
            if (parent is not null)
            {
                var script = Path.Combine(parent.FullName, "service", "report_cli.py");
                if (File.Exists(script)) return script;
            }
            throw new InvalidOperationException("TASK_PROGRESS_VIEWER_ROOT parent does not contain service/report_cli.py.");
        }
        foreach (var start in new[] { Environment.CurrentDirectory, AppContext.BaseDirectory })
        {
            for (var directory = new DirectoryInfo(start); directory is not null; directory = directory.Parent)
            {
                var script = Path.Combine(directory.FullName, "service", "report_cli.py");
                if (File.Exists(script)) return script;
            }
        }
        throw new InvalidOperationException("Cannot find service/report_cli.py. Set TASK_PROGRESS_VIEWER_ROOT to the repository viewer directory.");
    }

    private static void Kill(Process process)
    {
        try
        {
            if (!process.HasExited) process.Kill(entireProcessTree: true);
        }
        catch (InvalidOperationException) { }
        catch (System.ComponentModel.Win32Exception) { }
    }

    private static int Fail(int exitCode, string code, string message)
    {
        Console.Error.WriteLine(message);
        Console.WriteLine(JsonSerializer.Serialize(new { ok = false, error = new { code, message } }));
        return exitCode;
    }

    private sealed record Request(string Action, string Folder, string? Task, string? Input, bool DryRun);
}
