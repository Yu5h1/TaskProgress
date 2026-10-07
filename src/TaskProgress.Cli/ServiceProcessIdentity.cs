// TaskProgress-owned process receipts distinguish a reused PID from its original service.
using System.ComponentModel;
using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace TaskProgress;

internal sealed record ServiceProcessIdentity(int ProcessId, long StartTimeUtcTicks, string ExecutablePath)
{
    private sealed record Receipt(string InstanceId, ServiceProcessIdentity Process);

    /// <summary>Keeps mutex acquisition and release on one thread while serializing asynchronous startup work.</summary>
    internal static Task<T> WithStartupLockAsync<T>(string stateFile, Func<Task<T>> action, CancellationToken cancellationToken)
        => Task.Run(() =>
        {
            var path = Path.GetFullPath(stateFile).ToUpperInvariant();
            using var mutex = new Mutex(false, "Local\\TaskProgress.ServiceStart." + Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(path))));
            var acquired = false;
            try
            {
                int result;
                try { result = WaitHandle.WaitAny([mutex, cancellationToken.WaitHandle], TimeSpan.FromSeconds(20)); }
                catch (AbandonedMutexException) { result = 0; }
                acquired = result == 0;
                cancellationToken.ThrowIfCancellationRequested();
                if (!acquired) throw new CliException("另一個 TaskProgress 啟動流程尚未完成；請稍後再試。");
                return action().GetAwaiter().GetResult();
            }
            finally { if (acquired) mutex.ReleaseMutex(); }
        }, cancellationToken);

    internal static ServiceProcessIdentity? Read(int pid)
    {
        try
        {
            using var process = Process.GetProcessById(pid);
            if (process.HasExited) return null;
            return new(pid, process.StartTime.ToUniversalTime().Ticks,
                process.MainModule?.FileName ?? throw new CliException($"無法識別 PID {pid} 的執行檔。"));
        }
        catch (ArgumentException) { return null; }
        catch (Exception error) when (error is Win32Exception or InvalidOperationException)
        {
            throw new CliException($"無法查核 PID {pid} 的程序身分；保留服務狀態：{error.Message}");
        }
    }

    internal static string ReceiptPath(string stateFile) => stateFile + ".process.json";

    internal static void Save(string stateFile, LocalWebServiceState state, ServiceProcessIdentity process)
    {
        if (state.ProcessId != process.ProcessId) throw new CliException("服務 PID 與啟動的程序不一致。");
        var current = LocalWebServiceState.Load(stateFile);
        if (current.InstanceId != state.InstanceId || current.ProcessId != state.ProcessId)
            throw new CliException("服務實例已改變，停止寫入程序身分紀錄。");
        var path = ReceiptPath(stateFile);
        var temp = path + "." + Guid.NewGuid().ToString("N") + ".tmp";
        try
        {
            File.WriteAllText(temp, JsonSerializer.Serialize(new Receipt(state.InstanceId, process)));
            File.Move(temp, path, true);
        }
        finally { if (File.Exists(temp)) File.Delete(temp); }
    }

    internal static bool IsStale(ServiceProcessIdentity? current, ServiceProcessIdentity? recorded, DateTime stateWrittenUtc)
    {
        if (current is null) return true;
        if (recorded is not null)
            return current.ProcessId != recorded.ProcessId || current.StartTimeUtcTicks != recorded.StartTimeUtcTicks ||
                !string.Equals(current.ExecutablePath, recorded.ExecutablePath, StringComparison.OrdinalIgnoreCase);
        return current.StartTimeUtcTicks > stateWrittenUtc.AddSeconds(1).Ticks;
    }

    internal static void EnsurePortFree(int port)
    {
        if (IPGlobalProperties.GetIPGlobalProperties().GetActiveTcpListeners().Any(endpoint => endpoint.Port == port))
            throw new CliException($"Port {port} 已有程序監聽但 health 無法驗證；不接管、不終止程序，也不移除狀態。");
    }

    /// <summary>Retires only proven stale state after an unsuccessful health probe and a free-port check.</summary>
    internal static void Prepare(string stateFile, int port,
        Func<int, ServiceProcessIdentity?>? readProcess = null, Action<int>? checkPort = null)
    {
        checkPort ??= EnsurePortFree;
        readProcess ??= Read;
        checkPort(port);
        if (!File.Exists(stateFile)) return;
        var before = File.ReadAllText(stateFile);
        var writtenAt = File.GetLastWriteTimeUtc(stateFile);
        var state = LocalWebServiceState.Load(stateFile);
        if (state.Port != port) throw new CliException("服務狀態的 port 與啟動設定不一致；保留原檔。");
        ServiceProcessIdentity? recorded = null;
        var receiptPath = ReceiptPath(stateFile);
        if (File.Exists(receiptPath))
        {
            var receipt = JsonSerializer.Deserialize<Receipt>(File.ReadAllText(receiptPath));
            if (receipt?.InstanceId == state.InstanceId)
            {
                recorded = receipt.Process;
                if (recorded is null || recorded.ProcessId != state.ProcessId || recorded.StartTimeUtcTicks <= 0 ||
                    string.IsNullOrWhiteSpace(recorded.ExecutablePath))
                    throw new CliException("程序身分紀錄無效；保留服務狀態。");
            }
        }
        if (!IsStale(readProcess(state.ProcessId), recorded, writtenAt))
            throw new CliException($"PID {state.ProcessId} 的原程序仍存在或舊紀錄不足以證明已過期；保留狀態，不另啟服務。");
        checkPort(port);
        if (File.ReadAllText(stateFile) != before) throw new CliException("服務狀態已被其他程序更新；停止回收。");
        var backup = stateFile + ".stale-" + Guid.NewGuid().ToString("N");
        File.Move(stateFile, backup);
    }
}
