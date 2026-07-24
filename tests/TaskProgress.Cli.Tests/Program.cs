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
                Path.Combine(repositoryRoot, "reports", "example", "report.json"),
                cancellation.Token);
            await File.WriteAllTextAsync(
                Path.Combine(derivedFolder, "report.json"),
                reportSource.Replace(
                    "\"scope_id\": \"example\"",
                    "\"scope_id\": \"bonghuo-vr\"",
                    StringComparison.Ordinal),
                cancellation.Token);
            var store = new ScopeStore(Path.Combine(testHome, "derived-scopes.json"));
            Equal("bonghuo-vr", store.Add(derivedFolder), "Derived scope was not returned");
            Equal(
                Path.GetFullPath(derivedFolder),
                store.Resolve("bonghuo-vr"),
                "Derived scope was not persisted");

            var secondFolder = Path.Combine(testHome, "UnityProject");
            Directory.CreateDirectory(secondFolder);
            await File.WriteAllTextAsync(
                Path.Combine(secondFolder, "report.json"),
                reportSource.Replace(
                    "\"scope_id\": \"example\"",
                    "\"scope_id\": \"sample-unity-project\"",
                    StringComparison.Ordinal),
                cancellation.Token);

            var estimateOnly = TimeAnalysisGenerator.Generate(
                derivedFolder,
                DateTimeOffset.Parse("2026-07-24T21:30:00+08:00"));
            False(TimeAnalysisGenerator.HasInputs(derivedFolder),
                "Generated output was mistaken for analyzer input");
            False(estimateOnly.DeadlineIncluded, "Default analysis unexpectedly created a deadline");
            True(estimateOnly.TotalEstimatedMinutes > 0, "Default estimates were not generated");
            var estimateOnlyJson = await File.ReadAllTextAsync(
                estimateOnly.OutputPath,
                cancellation.Token);
            False(
                HasDeadline(estimateOnlyJson),
                "Estimate-only analysis serialized a deadline");

            await File.WriteAllTextAsync(
                Path.Combine(secondFolder, "time.config.json"),
                """
                {
                  "schema_version": "0.2",
                  "scope_id": "sample-unity-project",
                  "updated_at": "2026-07-24T20:00:00+08:00",
                  "timezone": "Asia/Taipei",
                  "standard_allocation": {
                    "total_minutes_per_day": 1440,
                    "sleep_minutes_per_day": 480,
                    "life_minutes_per_day": 480,
                    "other_unavailable_minutes_per_day": 0,
                    "capacity_minutes_per_executor_day": 480,
                    "working_weekdays": [1, 2, 3, 4, 5],
                    "workday_start_local": "09:00",
                    "workday_end_local": "17:00"
                  },
                  "project": {
                    "executor_count": 1,
                    "not_before": "2026-07-20",
                    "delivery_at": "2026-08-01T00:00:00+08:00",
                    "capacity_exceptions": [
                      {
                        "date": "2026-07-29",
                        "available_minutes": 0,
                        "reason": "private reason",
                        "public_label": "休假"
                      }
                    ]
                  },
                  "estimate_defaults": {
                    "unplanned_item_likely_minutes": 480,
                    "unplanned_item_confidence": "low",
                    "allow_range": true
                  },
                  "estimate_resolution": {
                    "automatic_source_order": ["historical", "ai", "default"],
                    "manual_resolution": "final_override",
                    "preserve_history": true
                  },
                  "execution_calibration": {
                    "initial_factor": 1.0,
                    "prior_equivalent_samples": 10,
                    "automatic_adjustment": false
                  },
                  "urgency_thresholds": {
                    "on_track_max_pressure_ratio": 1.1,
                    "at_risk_max_pressure_ratio": 1.5
                  },
                  "display": {
                    "project_day_rounding": "ceiling",
                    "item_unit": "hour"
                  }
                }
                """,
                cancellation.Token);
            True(TimeAnalysisGenerator.HasInputs(secondFolder),
                "time.config.json did not enable automatic analysis");
            var deadlineAnalysis = TimeAnalysisGenerator.Generate(
                secondFolder,
                DateTimeOffset.Parse("2026-07-24T17:00:00+08:00"));
            True(deadlineAnalysis.DeadlineIncluded, "Configured deadline was not generated");
            var deadlineJson = await File.ReadAllTextAsync(
                deadlineAnalysis.OutputPath,
                cancellation.Token);
            True(HasDeadline(deadlineJson), "Deadline analysis omitted summary.deadline");
            Equal(
                "deterministic-capacity-feasibility",
                ReadMethodName(deadlineJson),
                "Deadline analysis did not use the v0.3 capacity method");
            Equal(
                960d,
                ReadSummaryNumber(deadlineJson, "remaining_estimated_minutes"),
                "Remaining demand did not sum the two pending default estimates");
            Equal(
                "on_track",
                ReadDeadlineString(deadlineJson, "urgency"),
                "Feasible remaining demand should remain on track");
            False(deadlineJson.Contains("private reason", StringComparison.Ordinal),
                "Private capacity reason leaked into the public analysis");
            True(HasPublicLabel(deadlineJson, "休假"),
                "Approved public capacity label was not projected");

            var firstReport = ReportFolder.Load(derivedFolder);
            var secondReport = ReportFolder.Load(secondFolder);
            var timeReport = ReportFolder.Load(Path.Combine(repositoryRoot, "reports", "example"));
            True(timeReport.TimeAnalysisPath is not null, "Example time analysis was not discovered");

            int firstProcessId;
            using (var first = await LocalWebServiceClient.EnsureAsync(settings, cancellation.Token))
            {
                await first.RegisterReportAsync(firstReport, cancellation.Token);
                Equal(
                    new Uri(settings.BaseUri, "?scope=bonghuo-vr"),
                    first.BuildViewerUri(firstReport),
                    "Launcher Viewer URL should rely on local scope auto-loading");
                firstProcessId = first.State.ProcessId;
            }

            using (var second = await LocalWebServiceClient.EnsureAsync(settings, cancellation.Token))
            {
                await second.RegisterReportAsync(secondReport, cancellation.Token);
                await second.RegisterReportAsync(timeReport, cancellation.Token);
                ScopeCatalog.Write(settings.ScopeCatalogFile, [firstReport, secondReport, timeReport]);
                await second.RegisterScopeCatalogAsync(settings.ScopeCatalogFile, cancellation.Token);
                Equal(firstProcessId, second.State.ProcessId, "Launcher created a second service process");

                using var http = new HttpClient(new SocketsHttpHandler { UseProxy = false });
                var firstJson = await http.GetStringAsync(
                    new Uri(settings.BaseUri, "reports/bonghuo-vr/report.json"),
                    cancellation.Token);
                var secondJson = await http.GetStringAsync(
                    new Uri(settings.BaseUri, "reports/sample-unity-project/report.json"),
                    cancellation.Token);
                Equal("bonghuo-vr", ReadScope(firstJson), "First scope route returned the wrong report");
                Equal(
                    "sample-unity-project",
                    ReadScope(secondJson),
                    "Second scope route returned the wrong report");
                var timeJson = await http.GetStringAsync(
                    new Uri(settings.BaseUri, "reports/example/time.analysis.json"),
                    cancellation.Token);
                Equal(
                    "example",
                    ReadScope(timeJson),
                    "Time analysis route returned the wrong scope");
                var catalogJson = await http.GetStringAsync(
                    new Uri(settings.BaseUri, ScopeCatalog.UrlPath.TrimStart('/')),
                    cancellation.Token);
                Equal(3, ReadCatalogCount(catalogJson), "Scope catalog returned the wrong count");
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

    private static bool HasDeadline(string source)
    {
        using var document = JsonDocument.Parse(source);
        return document.RootElement
            .GetProperty("summary")
            .TryGetProperty("deadline", out _);
    }

    private static string? ReadMethodName(string source)
    {
        using var document = JsonDocument.Parse(source);
        return document.RootElement
            .GetProperty("method")
            .GetProperty("name")
            .GetString();
    }

    private static double ReadSummaryNumber(string source, string property)
    {
        using var document = JsonDocument.Parse(source);
        return document.RootElement
            .GetProperty("summary")
            .GetProperty(property)
            .GetDouble();
    }

    private static string? ReadDeadlineString(string source, string property)
    {
        using var document = JsonDocument.Parse(source);
        return document.RootElement
            .GetProperty("summary")
            .GetProperty("deadline")
            .GetProperty(property)
            .GetString();
    }

    private static bool HasPublicLabel(string source, string expected)
    {
        using var document = JsonDocument.Parse(source);
        var exceptions = document.RootElement
            .GetProperty("summary")
            .GetProperty("deadline")
            .GetProperty("schedule")
            .GetProperty("capacity_profile")
            .GetProperty("capacity_exceptions");
        return exceptions.EnumerateArray().Any(item =>
            item.TryGetProperty("public_label", out var label)
            && label.GetString() == expected);
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

    private static void True(bool value, string message)
    {
        if (!value)
        {
            throw new InvalidOperationException(message);
        }
    }
}
