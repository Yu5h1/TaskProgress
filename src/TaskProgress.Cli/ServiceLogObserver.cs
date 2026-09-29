// Read-only log observation; cancellation never owns or shuts down the service.
using System.Text;

namespace TaskProgress;

internal static class ServiceLogObserver
{
    internal static async Task RunAsync(LauncherSettings settings, CancellationToken cancellationToken)
    {
        Console.WriteLine("觀察 LocalServer 訊息；Ctrl+C 或關閉視窗只結束觀察，服務由 Tray Exit 停止。");
        Console.WriteLine($"日誌：{settings.ServiceLogFile}");
        var cursor = new LogCursor();
        string? previousStatus = null;
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                if (File.Exists(settings.ServiceLogFile))
                {
                    using var stream = new FileStream(settings.ServiceLogFile, FileMode.Open, FileAccess.Read,
                        FileShare.ReadWrite | FileShare.Delete);
                    using var buffer = new MemoryStream();
                    await stream.CopyToAsync(buffer, cancellationToken);
                    Console.Write(cursor.Read(buffer.ToArray()));
                }
                else if (previousStatus is null)
                    Console.WriteLine("尚無日誌；舊版服務需更新並重新啟動後才會產生日誌。");
                using var service = await LocalWebServiceClient.TryConnectAsync(settings, cancellationToken);
                var status = service is null ? "服務已停止；等待服務恢復。" : $"服務執行中 | PID {service.State.ProcessId}";
                if (status != previousStatus) Console.WriteLine(status);
                previousStatus = status;
            }
            catch (Exception error) when (error is IOException or CliException or HttpRequestException)
            {
                if (previousStatus != error.Message) Console.Error.WriteLine(error.Message);
                previousStatus = error.Message;
            }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
            {
                const string status = "服務狀態查詢逾時；稍後重試。";
                if (previousStatus != status) Console.Error.WriteLine(status);
                previousStatus = status;
            }
            await Task.Delay(1000, cancellationToken);
        }
    }
}

/// <summary>Reads complete UTF-8 lines and detects bounded-log rotation by generation header.</summary>
internal sealed class LogCursor
{
    private string? _generation;
    private int _offset;

    internal string Read(byte[] snapshot)
    {
        var headerEnd = Array.IndexOf(snapshot, (byte)'\n');
        if (headerEnd < 0) return "";
        var generation = Encoding.UTF8.GetString(snapshot, 0, headerEnd);
        if (_generation != generation || snapshot.Length < _offset)
        {
            _generation = generation;
            _offset = headerEnd + 1;
        }
        var end = Array.LastIndexOf(snapshot, (byte)'\n') + 1;
        if (end <= _offset) return "";
        var text = Encoding.UTF8.GetString(snapshot, _offset, end - _offset);
        _offset = end;
        return text;
    }
}
