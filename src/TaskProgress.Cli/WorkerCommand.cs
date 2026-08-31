// The resident process role: task-progress.exe hosted as a TrayHost owned
// worker. Design and the decisions behind it live in
// Documentation/TrayWorkerPlan.md.
//
// Two things here are load-bearing and easy to undo by accident.
//
// First, stdout belongs to the protocol. Rather than threading a writer through
// every command body and hoping no Console.WriteLine is ever missed, this
// redirects Console.Out once, for the whole worker lifetime, into a buffer the
// commands cannot reach past. The real stdout is captured before that
// redirection and is the only handle that writes protocol lines, so a stray
// print anywhere in the call graph — including code written later — lands in
// the response payload instead of corrupting the stream.
//
// Second, readiness is announced before any service work. A worker that
// confirmed the server first would leave the tray invisible whenever startup
// failed, which is exactly when the user needs somewhere to read the error.

using System.Text;

namespace TaskProgress;

/// <summary>
///   Serves one TrayHost Host over newline-delimited JSON on stdin and stdout.
/// </summary>
internal static class WorkerCommand
{
    /// <summary>
    ///   Runs until stdin closes or the Host asks for a cooperative shutdown.
    /// </summary>
    public static async Task<int> RunAsync(ScopeStore store, CancellationToken cancellationToken)
    {
        using var protocol = new StreamWriter(
            Console.OpenStandardOutput(),
            new UTF8Encoding(encoderShouldEmitUTF8Identifier: false))
        {
            AutoFlush = true
        };
        using var input = new StreamReader(
            Console.OpenStandardInput(),
            new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));

        var captured = new StringWriter();
        Console.SetOut(captured);

        await protocol.WriteLineAsync(WorkerProtocol.Ready());

        var session = new WorkerSession(store);
        await session.StartServiceAsync(cancellationToken);
        captured.GetStringBuilder().Clear();

        while (!cancellationToken.IsCancellationRequested)
        {
            var line = await input.ReadLineAsync(cancellationToken);
            if (line is null) break;
            if (string.IsNullOrWhiteSpace(line)) continue;

            var request = WorkerProtocol.ParseRequest(line);
            if (request is null)
            {
                await Console.Error.WriteLineAsync("worker：忽略無法解析的 request 行。");
                continue;
            }

            if (string.Equals(request.Operation, WorkerProtocol.ShutdownOperation, StringComparison.Ordinal))
                break;

            captured.GetStringBuilder().Clear();
            var response = await DispatchAsync(session, request, captured, cancellationToken);
            await protocol.WriteLineAsync(response);
        }

        await session.StopServiceAsync(CancellationToken.None);
        return 0;
    }

    /// <summary>
    ///   Runs one request against the allowed command surface. A failing
    ///   request is answered and survived; it never stops the worker.
    /// </summary>
    private static async Task<string> DispatchAsync(
        WorkerSession session,
        WorkerRequest request,
        StringWriter captured,
        CancellationToken cancellationToken)
    {
        if (!string.Equals(request.Operation, WorkerProtocol.InvokeOperation, StringComparison.Ordinal))
        {
            return WorkerProtocol.Failure(
                request.RequestId,
                "unknown_operation",
                $"worker 不支援 operation「{request.Operation}」。");
        }

        var arguments = request.Arguments;
        if (arguments.Count == 0)
        {
            return WorkerProtocol.Failure(
                request.RequestId,
                "unknown_operation",
                "worker request 沒有帶任何參數。");
        }

        try
        {
            switch (arguments[0].ToLowerInvariant())
            {
                case "status":
                    if (arguments.Count != 1)
                        throw new CliException("用法：status");
                    Console.WriteLine(await session.BuildStatusLineAsync(cancellationToken));
                    break;
                case "open":
                    await Program.OpenAsync(
                        Program.ParseOpenRequest([.. arguments.Skip(1)], session.Store),
                        cancellationToken);
                    break;
                case "scope":
                    Program.RunScopeCommand([.. arguments.Skip(1)], session.Store);
                    break;
                default:
                    return WorkerProtocol.Failure(
                        request.RequestId,
                        "unknown_operation",
                        $"worker 不支援命令「{arguments[0]}」。可用：status、open、scope。");
            }
        }
        catch (CliException error)
        {
            return WorkerProtocol.Failure(request.RequestId, "command_failed", error.Message);
        }
        catch (Exception error) when (error is not OperationCanceledException)
        {
            return WorkerProtocol.Failure(request.RequestId, "worker_failed", error.Message);
        }

        return WorkerProtocol.Success(request.RequestId, captured.ToString());
    }
}

/// <summary>
///   Holds what survives between requests: the endpoint being served and why
///   startup failed.
/// </summary>
internal sealed class WorkerSession
{
    private LauncherSettings? _settings;
    private string? _startupError;

    internal WorkerSession(ScopeStore store)
    {
        Store = store;
    }

    internal ScopeStore Store { get; }

    /// <summary>
    ///   Resolves the launcher configuration, brings the server up, and
    ///   registers every scope. Every failure here — including a configuration
    ///   that cannot even be resolved — is recorded and reported through status
    ///   rather than thrown, because a worker that died here would take the
    ///   tray down with it and leave the error with nowhere to appear.
    /// </summary>
    internal async Task StartServiceAsync(CancellationToken cancellationToken)
    {
        try
        {
            _settings = LauncherSettings.Create(LauncherSettings.DefaultPort);
            var reports = Program.LoadRegisteredReports(Store);
            using var service = await Program.EnsureServiceAsync(
                _settings,
                reports,
                ServiceLaunchMode.Hidden,
                cancellationToken);
            _startupError = null;
        }
        catch (Exception error) when (error is not OperationCanceledException)
        {
            _startupError = error.Message;
            await Console.Error.WriteLineAsync($"worker：LocalWebService 啟動失敗：{error.Message}");
        }
    }

    /// <summary>
    ///   Stops the server this worker was serving, whether it started that
    ///   server or captured one that was already running. Connecting at all is
    ///   the ownership proof: it required a matching health identity, the
    ///   protected state file, its token, and the expected web root. A server
    ///   this worker cannot connect to is one it cannot stop either, so the
    ///   foreign case needs no separate rule.
    /// </summary>
    internal async Task StopServiceAsync(CancellationToken cancellationToken)
    {
        if (_settings is null) return;

        try
        {
            using var service = await LocalWebServiceClient.TryConnectAsync(_settings, cancellationToken);
            if (service is null) return;
            await service.ShutdownAsync(cancellationToken);
        }
        catch (Exception error)
        {
            await Console.Error.WriteLineAsync($"worker：停止 LocalWebService 失敗：{error.Message}");
        }
    }

    /// <summary>
    ///   Observes the server without starting anything. The prefix is a fixed
    ///   vocabulary so a caller can act on it without parsing the rest.
    ///   Separators are ASCII on purpose: this line is relayed through
    ///   TrayHost's invoke, which encodes its output in the system ANSI code
    ///   page, so anything outside ASCII arrives corrupted.
    /// </summary>
    internal async Task<string> BuildStatusLineAsync(CancellationToken cancellationToken)
    {
        if (_settings is null)
            return $"Error | 無法解析 Launcher 設定：{_startupError}";

        var endpoint = $"{LauncherSettings.LoopbackHost}:{_settings.Port}";
        try
        {
            using var service = await LocalWebServiceClient.TryConnectAsync(_settings, cancellationToken);
            if (service is null)
            {
                return _startupError is null
                    ? $"Stopped | {endpoint}"
                    : $"Stopped | {endpoint} | 啟動失敗：{_startupError}";
            }

            return $"Ready | {endpoint} | PID {service.State.ProcessId} | {Store.List().Count} scopes";
        }
        catch (CliException error)
        {
            return $"Conflict | {endpoint} | {error.Message}";
        }
        catch (Exception error) when (error is not OperationCanceledException)
        {
            return $"Error | {endpoint} | {error.Message}";
        }
    }
}
