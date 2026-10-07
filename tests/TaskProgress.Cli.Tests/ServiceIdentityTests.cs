// Focused service identity checks use temporary state, fake processes, and a local listener only.
using System.Net;
using System.Net.Sockets;
using System.Text.Json;
using TaskProgress;

internal static class ServiceIdentityTests
{
    private static void Check(bool value, string label) { if (!value) throw new Exception(label); }
    private static void Reject(Action action)
    {
        try { action(); } catch (CliException) { return; }
        throw new Exception("Expected safe refusal.");
    }

    internal static void Run()
    {
        var root = Path.Combine(Path.GetTempPath(), "tp-service-identity-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(root);
        var file = Path.Combine(root, "state.json");
        var at = DateTime.UtcNow.AddDays(-1);
        var original = new ServiceProcessIdentity(42, at.AddMinutes(-1).Ticks, @"C:\Python\python.exe");
        var reused = original with { StartTimeUtcTicks = at.AddHours(1).Ticks, ExecutablePath = @"C:\Windows\conhost.exe" };
        var state = new LocalWebServiceState { Service = "localwebservice", ApiVersion = 1, InstanceId = "original",
            Token = new string('a', 40), ProcessId = 42, Host = "127.0.0.1", Port = 8001, WebRoot = root,
            ControlApi = "/__localwebservice/v1" };
        void Write(bool receipt)
        {
            File.WriteAllText(file, JsonSerializer.Serialize(state)); File.SetLastWriteTimeUtc(file, at);
            if (receipt) ServiceProcessIdentity.Save(file, state, original);
            else if (File.Exists(ServiceProcessIdentity.ReceiptPath(file))) File.Delete(ServiceProcessIdentity.ReceiptPath(file));
        }
        try
        {
            var active = 0;
            var overlapping = 0;
            var concurrent = Enumerable.Range(0, 3).Select(_ => ServiceProcessIdentity.WithStartupLockAsync(file, async () =>
            {
                if (Interlocked.Increment(ref active) != 1) Interlocked.Increment(ref overlapping);
                await Task.Delay(30);
                Interlocked.Decrement(ref active);
                return true;
            }, CancellationToken.None)).ToArray();
            Task.WhenAll(concurrent).GetAwaiter().GetResult();
            Check(overlapping == 0, "asynchronous startup callers serialize");
            Reject(() => ServiceProcessIdentity.WithStartupLockAsync<bool>(file,
                () => throw new CliException("failed startup"), CancellationToken.None).GetAwaiter().GetResult());
            Check(ServiceProcessIdentity.WithStartupLockAsync(file, () => Task.FromResult(true), CancellationToken.None).GetAwaiter().GetResult(), "failed startup releases mutex");
            Check(ServiceProcessIdentity.IsStale(null, original, at), "exited process");
            Check(ServiceProcessIdentity.IsStale(reused, original, at), "reused PID");
            Check(ServiceProcessIdentity.IsStale(original with { StartTimeUtcTicks = at.AddHours(1).Ticks }, original, at), "same executable reused PID");
            Check(!ServiceProcessIdentity.IsStale(original, original, at), "matching process");
            Check(ServiceProcessIdentity.IsStale(reused, null, at), "legacy state predates process after reboot");
            Check(!ServiceProcessIdentity.IsStale(original, null, at), "legacy ambiguity retains state");
            Write(true);
            Reject(() => ServiceProcessIdentity.Prepare(file, 8001, _ => original, _ => {}));
            Check(File.Exists(file), "live unresponsive service retained");
            ServiceProcessIdentity.Prepare(file, 8001, _ => reused, _ => {});
            Check(!File.Exists(file) && Directory.GetFiles(root, "*.stale-*").Length == 1, "stale state backed up");
            Write(false);
            ServiceProcessIdentity.Prepare(file, 8001, _ => reused, _ => {});
            Check(!File.Exists(file), "legacy recycled process recovered");
            Write(true);
            Reject(() => ServiceProcessIdentity.Prepare(file, 8001, _ => throw new CliException("access denied"), _ => {}));
            Check(File.Exists(file), "unreadable process preserved");
            Reject(() => ServiceProcessIdentity.Prepare(file, 8001, _ => reused, _ => throw new CliException("occupied")));
            Check(File.Exists(file), "foreign port preserves state");
            var checks = 0;
            Reject(() => ServiceProcessIdentity.Prepare(file, 8001, _ => reused, _ => {
                if (++checks == 2) File.AppendAllText(file, " ");
            }));
            Check(File.Exists(file), "changed state preserved");
            using var listener = new TcpListener(IPAddress.Loopback, 0); listener.Start();
            Reject(() => ServiceProcessIdentity.EnsurePortFree(((IPEndPoint)listener.LocalEndpoint).Port));
            Check(ServiceProcessIdentity.Read(Environment.ProcessId)?.ProcessId == Environment.ProcessId, "real current process capture");
            Console.WriteLine("Service identity, legacy recovery, occupied port and safe refusal checks passed.");
        }
        finally { Directory.Delete(root, true); }
    }
}
