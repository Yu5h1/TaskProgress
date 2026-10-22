// Contract tests with an in-memory process boundary: never launch TrayHost, GUI, or a service.
using System.ComponentModel;
using System.Diagnostics;
using TaskProgress;

internal static class TrayHostLauncherTests
{
    public static async Task RunAsync()
    {
        var directory = Path.Combine(Path.GetTempPath(), "taskprogress tray 中文 contract-" + Guid.NewGuid().ToString("N"));
        var manifest = TrayHostLauncher.ResolveManifest(directory);
        var executable = Path.Combine(directory, "TrayHost.exe");
        Check(Path.IsPathFullyQualified(manifest), "Manifest path must be absolute");
        Check(!Directory.Exists(directory), "Resolving path created a directory");
        await ForwardAsync(executable, manifest, ["start", "--browser"], false);
        Check(!File.Exists(manifest) && !Directory.Exists(directory), "Missing manifest was created");

        Directory.CreateDirectory(directory);
        try
        {
            const string existing = "{ deliberately invalid user content";
            File.WriteAllText(manifest, existing);
            await ForwardAsync(executable, manifest, ["start"], false);
            await ForwardAsync(executable, manifest, ["service", "status", "中文 空格"], true);
            Check(File.ReadAllText(manifest) == existing, "Existing manifest was validated or overwritten");
            await CancelAsync(executable, manifest);
            await OpenThroughTrayAsync(executable, manifest);
            foreach (var code in new[] { 2, 7 })
            {
                foreach (var detail in new[] { "", " access denied \n" })
                {
                    try
                    {
                        await TrayHostLauncher.InvokeAsync(executable, manifest, ["start"],
                            (_, _) => Task.FromResult(new TrayHostLauncher.ProcessResult(code, "", detail)), default);
                        throw new Exception("Non-cancel failure was swallowed");
                    }
                    catch (CliException error)
                    {
                        Check(error.Message.Contains(detail.Length == 0 ? $"exit code {code}" : "access denied"), "Failure detail lost");
                    }
                }
            }
            foreach (var failure in new Exception[] { new Win32Exception(2), new UnauthorizedAccessException("denied"), new CliException("cannot start") })
            {
                try
                {
                    await TrayHostLauncher.InvokeAsync(executable, manifest, ["start"],
                        (_, _) => Task.FromException<TrayHostLauncher.ProcessResult>(failure), default);
                    throw new Exception("Process-start error was swallowed");
                }
                catch (Exception error) when (ReferenceEquals(error, failure)) { }
            }
            Check(File.ReadAllText(manifest) == existing, "Error handling changed manifest");
        }
        finally
        {
            File.Delete(manifest);
            Directory.Delete(directory);
        }
        Console.WriteLine("Tray launcher contracts passed: missing/existing manifest, arguments/output, silent cancel, open through tray, nonzero errors, process errors, no manifest writes. No process launched.");
    }

    private static async Task ForwardAsync(string executable, string manifest, string[] arguments, bool noNotify)
    {
        var calls = 0;
        var result = await TrayHostLauncher.InvokeAsync(executable, manifest, arguments, (info, _) =>
        {
            calls++;
            var expected = new List<string>
            {
                "invoke", manifest, "--standalone", "--buildIcon",
                "--init-executable", "task-progress.exe", "--init-argument", "worker"
            };
            if (noNotify) expected.Add("--no-notify");
            expected.Add("--");
            expected.AddRange(arguments);
            Check(info.ArgumentList.SequenceEqual(expected), "Invocation arguments changed");
            Check(info.FileName == executable && !info.UseShellExecute && info.RedirectStandardOutput && info.RedirectStandardError,
                "Process/output contract changed");
            return Task.FromResult(new TrayHostLauncher.ProcessResult(0, " worker output \n", "ignored success stderr"));
        }, default);
        Check(calls == 1 && !result.Cancelled && result.Output == "worker output", "Success output changed");
    }

    private static async Task CancelAsync(string executable, string manifest)
    {
        var originalOut = Console.Out;
        var originalError = Console.Error;
        using var output = new StringWriter();
        using var error = new StringWriter();
        try
        {
            Console.SetOut(output);
            Console.SetError(error);
            var calls = 0;
            var exit = await TaskProgress.Program.StartAsync(new TaskProgress.Program.StartRequest(true, true), default,
                (arguments, token) => TrayHostLauncher.InvokeAsync(executable, manifest, arguments, (_, _) =>
                {
                    calls++;
                    return Task.FromResult(new TrayHostLauncher.ProcessResult(1, "cancel output", "cancel stderr"));
                }, token));
            Check(exit == 1 && calls == 1, "Cancellation retried, fell back or lost exit code");
            Check(output.ToString() == "" && error.ToString() == "", "Cancellation emitted a failure message");
        }
        finally { Console.SetOut(originalOut); Console.SetError(originalError); }
    }

    private static async Task OpenThroughTrayAsync(string executable, string manifest)
    {
        var scoped = new TaskProgress.Program.OpenRequest("unused", "task-progress", false, "card-pin");
        Check(TaskProgress.Program.BuildWorkerOpenArguments(scoped)
                .SequenceEqual(["open", "--scope", "task-progress", "--pin", "card-pin", "--no-browser"]),
            "Scoped open lost scope, pin or browser choice");
        var folder = TaskProgress.Program.BuildWorkerOpenArguments(new TaskProgress.Program.OpenRequest(".", null, true));
        Check(folder.SequenceEqual(["open", Path.GetFullPath(".")]), "Folder open was not sent fully qualified");

        var originalOut = Console.Out;
        using var output = new StringWriter();
        try
        {
            Console.SetOut(output);
            IReadOnlyList<string>? forwarded = null;
            var exit = await TaskProgress.Program.OpenThroughTrayAsync(scoped, default,
                (arguments, token) => TrayHostLauncher.InvokeAsync(executable, manifest, arguments, (info, _) =>
                {
                    forwarded = [.. info.ArgumentList];
                    return Task.FromResult(new TrayHostLauncher.ProcessResult(0, " viewer url \n", ""));
                }, token));
            Check(exit == 0 && output.ToString().Trim() == "viewer url", "Open did not relay worker output");
            Check(forwarded is not null && forwarded.Contains("--no-notify")
                    && forwarded.SkipWhile(a => a != "--").Skip(1).SequenceEqual(TaskProgress.Program.BuildWorkerOpenArguments(scoped)),
                "Open was not forwarded to the tray worker");

            var cancelled = await TaskProgress.Program.OpenThroughTrayAsync(scoped, default,
                (_, _) => Task.FromResult(new TrayHostLauncher.InvocationResult(true, "")));
            Check(cancelled == 1, "Cancelled tray open did not return 1");
        }
        finally { Console.SetOut(originalOut); }
    }

    private static void Check(bool value, string message)
    {
        if (!value) throw new Exception(message);
    }
}
