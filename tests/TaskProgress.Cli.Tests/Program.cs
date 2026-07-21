using System.Net.Sockets;
using System.Text.Json;
using TaskProgress;

internal static class Program
{
    public static async Task<int> Main()
    {
        var originalHome = Environment.GetEnvironmentVariable("TASK_PROGRESS_HOME");
        var testHome = Path.Combine(
            Path.GetTempPath(),
            $"task-progress-launcher-test-{Guid.NewGuid():N}");
        Directory.CreateDirectory(testHome);
        Environment.SetEnvironmentVariable("TASK_PROGRESS_HOME", testHome);

        var port = ReservePort();
        var settings = LauncherSettings.Create(port);
        using var cancellation = new CancellationTokenSource(TimeSpan.FromSeconds(30));
        try
        {
            var root = settings.ViewerRoot;
            var repositoryRoot = Directory.GetParent(root)?.FullName
                ?? throw new InvalidOperationException("Viewer root has no repository parent");
            Equal("viewer", Path.GetFileName(root), "Launcher did not discover the viewer directory");
            Equal(
                "bonghuo-vr",
                ScopeId.FromFolderName(Path.Combine(testHome, "BonghuoVR")),
                "Folder name was not converted to kebab-case scope");

            var derivedFolder = Path.Combine(testHome, "BonghuoVR");
            Directory.CreateDirectory(derivedFolder);
            var reportSource = await File.ReadAllTextAsync(
                Path.Combine(repositoryRoot, "examples", "yu5h1lib", "report.json"),
                cancellation.Token);
            await File.WriteAllTextAsync(
                Path.Combine(derivedFolder, "report.json"),
                reportSource.Replace("yu5h1lib", "bonghuo-vr", StringComparison.Ordinal),
                cancellation.Token);
            var store = new ScopeStore(Path.Combine(testHome, "derived-scopes.json"));
            Equal("bonghuo-vr", store.Add(derivedFolder), "Derived scope was not returned");
            Equal(
                Path.GetFullPath(derivedFolder),
                store.Resolve("bonghuo-vr"),
                "Derived scope was not persisted");

            var firstReport = ReportFolder.Load(Path.Combine(repositoryRoot, "examples", "yu5h1lib"));
            var secondReport = ReportFolder.Load(Path.Combine(repositoryRoot, "examples", "unity-project"));

            int firstProcessId;
            using (var first = await LocalWebServiceClient.EnsureAsync(settings, cancellation.Token))
            {
                await first.RegisterReportAsync(firstReport, cancellation.Token);
                firstProcessId = first.State.ProcessId;
            }

            using (var second = await LocalWebServiceClient.EnsureAsync(settings, cancellation.Token))
            {
                await second.RegisterReportAsync(secondReport, cancellation.Token);
                ScopeCatalog.Write(settings.ScopeCatalogFile, [firstReport, secondReport]);
                await second.RegisterScopeCatalogAsync(settings.ScopeCatalogFile, cancellation.Token);
                Equal(firstProcessId, second.State.ProcessId, "Launcher created a second service process");

                using var http = new HttpClient(new SocketsHttpHandler { UseProxy = false });
                var firstJson = await http.GetStringAsync(
                    new Uri(settings.BaseUri, "reports/yu5h1lib/report.json"),
                    cancellation.Token);
                var secondJson = await http.GetStringAsync(
                    new Uri(settings.BaseUri, "reports/sample-unity-project/report.json"),
                    cancellation.Token);
                Equal("yu5h1lib", ReadScope(firstJson), "First scope route returned the wrong report");
                Equal(
                    "sample-unity-project",
                    ReadScope(secondJson),
                    "Second scope route returned the wrong report");
                var catalogJson = await http.GetStringAsync(
                    new Uri(settings.BaseUri, ScopeCatalog.UrlPath.TrimStart('/')),
                    cancellation.Token);
                Equal(2, ReadCatalogCount(catalogJson), "Scope catalog returned the wrong count");
                False(catalogJson.Contains(root, StringComparison.OrdinalIgnoreCase),
                    "Scope catalog exposed a local folder path");

                await second.ShutdownAsync(cancellation.Token);
            }

            False(File.Exists(settings.StateFile), "Service state remained after shutdown");
            Console.WriteLine("TaskProgress Launcher integration passed.");
            return 0;
        }
        catch (Exception error)
        {
            Console.Error.WriteLine(error);
            return 1;
        }
        finally
        {
            await StopServiceIfRunningAsync(settings);
            Environment.SetEnvironmentVariable("TASK_PROGRESS_HOME", originalHome);
            try
            {
                Directory.Delete(testHome, recursive: true);
            }
            catch (IOException)
            {
            }
            catch (UnauthorizedAccessException)
            {
            }
        }
    }

    private static int ReservePort()
    {
        using var listener = new TcpListener(System.Net.IPAddress.Loopback, 0);
        listener.Start();
        return ((System.Net.IPEndPoint)listener.LocalEndpoint).Port;
    }

    private static string? ReadScope(string source)
    {
        using var document = JsonDocument.Parse(source);
        return document.RootElement.GetProperty("scope_id").GetString();
    }

    private static int ReadCatalogCount(string source)
    {
        using var document = JsonDocument.Parse(source);
        return document.RootElement.GetProperty("scopes").GetArrayLength();
    }

    private static async Task StopServiceIfRunningAsync(LauncherSettings settings)
    {
        using var cleanup = new CancellationTokenSource(TimeSpan.FromSeconds(10));
        try
        {
            using var service = await LocalWebServiceClient.TryConnectAsync(
                settings,
                cleanup.Token);
            if (service is not null)
            {
                await service.ShutdownAsync(cleanup.Token);
            }
        }
        catch
        {
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
}
