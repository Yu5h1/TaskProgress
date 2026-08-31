// Pure tests for the TrayHost worker role: no service, no ports, no network.
//
// The framing tests are the load-bearing ones. A worker whose stdout carries a
// single stray character stops being parseable by the Host, and the failure
// surfaces as an unrelated JsonException on the other side of a process
// boundary, so the escaping and single-line guarantees are asserted literally
// rather than derived the same way the code under test derives them.

using System.Text.Json;
using TaskProgress;

internal static class WorkerTests
{
    public static void Run()
    {
        ReadyIsOneLineAndAnnouncesNothingElse();
        ParsesAWellFormedInvokeRequest();
        RejectsLinesItCannotCorrelateOrAnswer();
        KeepsMultiLineCommandOutputOnOneProtocolLine();
        FailureCarriesTheCodeTheHostSurfaces();
        AnEmptyScopeStoreIsAValidWorkerStartup();
        UnresolvableConfigurationIsReportedNotFatal();
        StdoutIsProtectedByRedirectionNotByDiscipline();
    }

    private static void ReadyIsOneLineAndAnnouncesNothingElse()
    {
        var ready = WorkerProtocol.Ready();
        Equal(1, CountLines(ready), "Ready is not a single line");

        using var document = JsonDocument.Parse(ready);
        Equal(1, document.RootElement.GetProperty("protocol").GetInt32(), "Ready protocol is wrong");
        Equal("ready", document.RootElement.GetProperty("type").GetString(), "Ready type is wrong");
    }

    private static void ParsesAWellFormedInvokeRequest()
    {
        var request = WorkerProtocol.ParseRequest(
            """{"protocol":1,"type":"request","requestId":"42","operation":"invoke","payload":{"arguments":["open","--scope","task-progress"]}}""");

        True(request is not null, "A well-formed invoke request was rejected");
        Equal("42", request!.RequestId, "Request ID was not read");
        Equal("invoke", request.Operation, "Operation was not read");
        Equal(3, request.Arguments.Count, "Arguments were not read");
        Equal("--scope", request.Arguments[1], "Argument order was not preserved");

        var shutdown = WorkerProtocol.ParseRequest(
            """{"protocol":1,"type":"request","requestId":"7","operation":"shutdown","payload":{}}""");
        True(shutdown is not null, "A shutdown request was rejected");
        Equal(
            WorkerProtocol.ShutdownOperation,
            shutdown!.Operation,
            "Shutdown operation was not read");
        Equal(0, shutdown.Arguments.Count, "A payload without arguments did not produce an empty list");
    }

    private static void RejectsLinesItCannotCorrelateOrAnswer()
    {
        Null(WorkerProtocol.ParseRequest("not json"), "Non-JSON was accepted");
        Null(WorkerProtocol.ParseRequest("[]"), "A non-object line was accepted");
        Null(
            WorkerProtocol.ParseRequest("""{"protocol":2,"type":"request","requestId":"1"}"""),
            "A future protocol version was accepted");
        Null(
            WorkerProtocol.ParseRequest("""{"protocol":1,"type":"response","requestId":"1"}"""),
            "A response line was accepted as a request");
        Null(
            WorkerProtocol.ParseRequest("""{"protocol":1,"type":"request"}"""),
            "A request without an ID was accepted");
        Null(
            WorkerProtocol.ParseRequest("""{"protocol":1,"type":"request","requestId":""}"""),
            "An empty request ID was accepted");

        var nonStringArgument = WorkerProtocol.ParseRequest(
            """{"protocol":1,"type":"request","requestId":"1","operation":"invoke","payload":{"arguments":["ok",3]}}""");
        True(nonStringArgument is not null, "A request with a bad argument list should still be answerable");
        Equal(
            0,
            nonStringArgument!.Arguments.Count,
            "A non-string argument should discard the list rather than coerce it");
    }

    private static void KeepsMultiLineCommandOutputOnOneProtocolLine()
    {
        var stdout = "第一行\r\n第二行\n\"引號\"\\反斜線";
        var line = WorkerProtocol.Success("42", stdout);
        Equal(1, CountLines(line), "Multi-line command output escaped into more than one protocol line");

        using var document = JsonDocument.Parse(line);
        var root = document.RootElement;
        Equal("42", root.GetProperty("requestId").GetString(), "Response was not correlated");
        True(root.GetProperty("success").GetBoolean(), "Success response is not marked successful");
        Equal(
            stdout,
            root.GetProperty("payload").GetProperty("stdout").GetString(),
            "Command output did not survive the round trip");
    }

    private static void FailureCarriesTheCodeTheHostSurfaces()
    {
        var line = WorkerProtocol.Failure("9", "unknown_operation", "worker 不支援命令「checklist」。");
        Equal(1, CountLines(line), "Failure is not a single line");

        using var document = JsonDocument.Parse(line);
        var root = document.RootElement;
        False(root.GetProperty("success").GetBoolean(), "Failure response is marked successful");
        Equal(
            "unknown_operation",
            root.GetProperty("error").GetProperty("code").GetString(),
            "Failure code was not carried");
        True(
            root.GetProperty("error").GetProperty("message").GetString()!.Contains("checklist", StringComparison.Ordinal),
            "Failure message was not carried");
    }

    private static void AnEmptyScopeStoreIsAValidWorkerStartup()
    {
        var root = Path.Combine(Path.GetTempPath(), $"task-progress-worker-{Guid.NewGuid():N}");
        Directory.CreateDirectory(root);
        try
        {
            var store = new ScopeStore(Path.Combine(root, "scopes.json"));
            Equal(0, TaskProgress.Program.LoadRegisteredReports(store).Count, "An empty store did not load as zero reports");
        }
        finally
        {
            Directory.Delete(root, true);
        }
    }

    private static void UnresolvableConfigurationIsReportedNotFatal()
    {
        var root = Path.Combine(Path.GetTempPath(), $"task-progress-worker-{Guid.NewGuid():N}");
        Directory.CreateDirectory(root);
        var original = Environment.GetEnvironmentVariable("TASK_PROGRESS_VIEWER_ROOT");
        Environment.SetEnvironmentVariable(
            "TASK_PROGRESS_VIEWER_ROOT",
            Path.Combine(root, "no-such-viewer"));
        try
        {
            var session = new WorkerSession(new ScopeStore(Path.Combine(root, "scopes.json")));
            session.StartServiceAsync(CancellationToken.None).GetAwaiter().GetResult();
            var status = session.BuildStatusLineAsync(CancellationToken.None).GetAwaiter().GetResult();
            True(
                status.StartsWith("Error", StringComparison.Ordinal),
                $"A worker with unresolvable configuration did not report Error: {status}");
        }
        finally
        {
            Environment.SetEnvironmentVariable("TASK_PROGRESS_VIEWER_ROOT", original);
            Directory.Delete(root, true);
        }
    }

    private static void StdoutIsProtectedByRedirectionNotByDiscipline()
    {
        var source = TryReadSource("WorkerCommand.cs");
        if (source is null)
        {
            Console.WriteLine("略過 worker stdout 來源檢查：找不到 WorkerCommand.cs。");
            return;
        }

        True(
            source.Contains("Console.SetOut(captured)", StringComparison.Ordinal),
            "The worker no longer redirects Console.Out, so any stray print would corrupt the protocol");
        True(
            source.IndexOf("Console.SetOut(captured)", StringComparison.Ordinal)
                < source.IndexOf("WorkerProtocol.Ready()", StringComparison.Ordinal),
            "The worker announces readiness before redirecting stdout");
        False(
            source.Contains("Console.WriteLine(WorkerProtocol", StringComparison.Ordinal),
            "A protocol line is being written through Console.Out instead of the captured real stdout");
    }

    private static string? TryReadSource(string fileName)
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            var candidate = Path.Combine(directory.FullName, "src", "TaskProgress.Cli", fileName);
            if (File.Exists(candidate)) return File.ReadAllText(candidate);
            directory = directory.Parent;
        }
        return null;
    }

    private static int CountLines(string value) =>
        value.Split('\n').Length;

    private static void Null(object? value, string message)
    {
        if (value is not null)
        {
            throw new InvalidOperationException(message);
        }
    }

    private static void Equal<T>(T expected, T actual, string message)
    {
        if (!EqualityComparer<T>.Default.Equals(expected, actual))
        {
            throw new InvalidOperationException($"{message}: expected {expected}, actual {actual}");
        }
    }

    private static void False(bool value, string message)
    {
        if (value)
        {
            throw new InvalidOperationException(message);
        }
    }

    private static void True(bool value, string message)
    {
        if (!value)
        {
            throw new InvalidOperationException(message);
        }
    }
}
