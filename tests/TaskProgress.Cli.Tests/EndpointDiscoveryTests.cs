// Exercises one isolated Launcher service's discovery file and reuse lifecycle.
using System.Net;
using System.Net.Sockets;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Text.Json;
using TaskProgress;

internal static class EndpointDiscoveryTests
{
    public static async Task RunAsync()
    {
        var originalHome = Environment.GetEnvironmentVariable("TASK_PROGRESS_HOME");
        var originalState = Environment.GetEnvironmentVariable("TASK_PROGRESS_SERVICE_STATE");
        var home = Path.Combine(Path.GetTempPath(), $"tp-endpoint-check-{Guid.NewGuid():N}");
        Directory.CreateDirectory(home);
        Environment.SetEnvironmentVariable("TASK_PROGRESS_HOME", home);
        Environment.SetEnvironmentVariable("TASK_PROGRESS_SERVICE_STATE", null);
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        var port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();
        Console.WriteLine($"Isolated endpoint test: port {port}, home {home}");
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(40));
        LocalWebServiceClient? owner = null;
        var stopped = false;
        try
        {
            var settings = LauncherSettings.Create(port);
            owner = await LocalWebServiceClient.EnsureAsync(settings, timeout.Token);
            if (!owner.StartedNewProcess) throw new Exception("Expected a new isolated service.");
            var endpointPath = Path.Combine(settings.EndpointsDirectory, $"{port}.json");
            var before = await File.ReadAllTextAsync(endpointPath, timeout.Token);
            using var descriptor = JsonDocument.Parse(before);
            var token = descriptor.RootElement.GetProperty("client_token").GetString();
            if (string.IsNullOrEmpty(token)) throw new Exception("Endpoint token is absent.");
            var sid = WindowsIdentity.GetCurrent().User ?? throw new Exception("Current user SID is unavailable.");
            var security = new FileInfo(endpointPath).GetAccessControl();
            var raw = new RawSecurityDescriptor(security.GetSecurityDescriptorBinaryForm(), 0);
            if (!raw.ControlFlags.HasFlag(ControlFlags.DiscretionaryAclPresent) || raw.DiscretionaryAcl is null)
                throw new Exception("Endpoint has no discretionary access control list.");
            var rules = security.GetAccessRules(true, true, typeof(SecurityIdentifier)).Cast<FileSystemAccessRule>().ToArray();
            if (!rules.Any(rule => rule.AccessControlType == AccessControlType.Allow && sid.Equals(rule.IdentityReference) && (rule.FileSystemRights & FileSystemRights.ReadData) != 0))
                throw new Exception("Current user has no endpoint read permission.");
            if (rules.Any(rule => rule.AccessControlType == AccessControlType.Allow && !sid.Equals(rule.IdentityReference)))
                throw new Exception("Endpoint grants access to another identity.");
            using (var reused = await LocalWebServiceClient.EnsureAsync(settings, timeout.Token))
            {
                if (reused.StartedNewProcess || reused.State.ProcessId != owner.State.ProcessId)
                    throw new Exception("Service was not reused.");
                if (before != await File.ReadAllTextAsync(endpointPath, timeout.Token))
                    throw new Exception("Reusing the service changed the endpoint descriptor.");
            }
            await owner.ShutdownAsync(timeout.Token);
            stopped = true;
            if (File.Exists(endpointPath)) throw new Exception("Endpoint remains after shutdown.");
            Console.WriteLine($"Endpoint discovery lifecycle and ACL passed on isolated port {port}; data: {home}");
        }
        finally
        {
            if (owner is not null && !stopped)
            {
                using var cleanupTimeout = new CancellationTokenSource(TimeSpan.FromSeconds(15));
                try { await owner.ShutdownAsync(cleanupTimeout.Token); }
                catch (Exception error) { Console.Error.WriteLine($"Isolated service shutdown failed: {error.Message}"); }
            }
            owner?.Dispose();
            Environment.SetEnvironmentVariable("TASK_PROGRESS_HOME", originalHome);
            Environment.SetEnvironmentVariable("TASK_PROGRESS_SERVICE_STATE", originalState);
        }
    }
}
