using System.ComponentModel;
using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace TaskProgress;

internal enum ServiceLaunchMode
{
    Hidden,
    VisibleConsole,
}

internal sealed class LocalWebServiceClient : IDisposable
{
    private const string HealthPath = "/__localwebservice/v1/health";
    private const string StatusPath = "/__localwebservice/v1/status";
    private const string FilesPath = "/__localwebservice/v1/files";
    private const string ShutdownPath = "/__localwebservice/v1/shutdown";
    private const string EditHealthPath = "/__taskprogress/v1/health";
    private static readonly HashSet<string> RoutableFileNames = new(
        ReportModuleRegistry.DeclaredFileNames(ReportModuleProviders.Production),
        StringComparer.OrdinalIgnoreCase);

    private static readonly TimeSpan ProbeTimeout = TimeSpan.FromSeconds(1);
    private static readonly TimeSpan StartupTimeout = TimeSpan.FromSeconds(10);
    private readonly HttpClient _http;
    private readonly LauncherSettings _settings;

    private LocalWebServiceClient(
        LauncherSettings settings,
        LocalWebServiceState state,
        ServiceStatus status,
        HttpClient http,
        bool startedNewProcess)
    {
        _settings = settings;
        State = state;
        Status = status;
        _http = http;
        StartedNewProcess = startedNewProcess;
    }

    public LocalWebServiceState State { get; }

    public ServiceStatus Status { get; }

    public bool StartedNewProcess { get; }

    public static Task<LocalWebServiceClient> EnsureAsync(
        LauncherSettings settings,
        CancellationToken cancellationToken,
        ServiceLaunchMode launchMode = ServiceLaunchMode.Hidden)
        => ServiceProcessIdentity.WithStartupLockAsync(settings.StateFile,
            () => EnsureLockedAsync(settings, cancellationToken, launchMode), cancellationToken);

    private static async Task<LocalWebServiceClient> EnsureLockedAsync(
        LauncherSettings settings, CancellationToken cancellationToken, ServiceLaunchMode launchMode)
    {
        var health = await ProbeHealthAsync(settings, cancellationToken);
        var startedNewProcess = false;
        if (health is null)
        {
            ServiceProcessIdentity.Prepare(settings.StateFile, settings.Port);
            ChecklistEndpointDirectory.Prepare(settings.EndpointsDirectory);
            using var process = StartService(settings, launchMode);
            health = await WaitForHealthAsync(settings, process, cancellationToken);
            startedNewProcess = true;
        }

        var client = await ConnectAsync(settings, health, startedNewProcess, cancellationToken);
        try
        {
            await client.VerifyEditHostAsync(cancellationToken);
            if (startedNewProcess)
            {
                var identity = ServiceProcessIdentity.Read(client.State.ProcessId)
                    ?? throw new CliException("LocalWebService 服務程序已退出。");
                ServiceProcessIdentity.Save(settings.StateFile, client.State, identity);
            }
            return client;
        }
        catch
        {
            client.Dispose();
            throw;
        }
    }

    public static async Task<LocalWebServiceClient?> TryConnectAsync(
        LauncherSettings settings,
        CancellationToken cancellationToken)
    {
        var health = await ProbeHealthAsync(settings, cancellationToken);
        return health is null
            ? null
            : await ConnectAsync(settings, health, false, cancellationToken);
    }

    /// <summary>
    ///   Serves whatever the report's registered providers found, and retires
    ///   the route of anything they declared but did not find — so deleting a
    ///   sidecar actually stops it being served rather than leaving the
    ///   previous one live. No file name appears here: adding a module is a
    ///   provider, not another pair of branches.
    /// </summary>
    public async Task RegisterReportAsync(
        ReportFolder report,
        CancellationToken cancellationToken)
    {
        foreach (var route in report.Routes.Present)
        {
            await RegisterFileAsync(route.UrlPath, route.FilePath, cancellationToken);
        }

        foreach (var urlPath in report.Routes.Absent)
        {
            await UnregisterUrlIfPresentAsync(urlPath, cancellationToken);
        }
    }

    public Task RegisterScopeCatalogAsync(
        string catalogFile,
        CancellationToken cancellationToken) =>
        RegisterFileAsync(ScopeCatalog.UrlPath, catalogFile, cancellationToken);

    public async Task RemoveUnregisteredReportRoutesAsync(
        IReadOnlySet<string> registeredScopes,
        CancellationToken cancellationToken)
    {
        foreach (var registration in await ListFilesAsync(cancellationToken))
        {
            if (TryReadReportRouteScope(registration.UrlPath, out var scope)
                && !registeredScopes.Contains(scope))
            {
                await UnregisterAsync(registration, cancellationToken);
            }
        }
    }

    public Uri BuildViewerUri(ReportFolder report, string? pin = null)
    {
        return BuildViewerUri(_settings.BaseUri, report.Scope, pin);
    }

    internal static Uri BuildViewerUri(Uri baseUri, string scope, string? pin) =>
        new(baseUri, $"?scope={Uri.EscapeDataString(scope)}"
            + (pin is null ? "" : $"&pin={Uri.EscapeDataString(pin)}"));

    internal static Uri BuildDocumentUri(Uri baseUri, DocumentKind kind, string scope, string taskStem)
    {
        var route = kind switch
        {
            DocumentKind.Checklist => "checklist/",
            DocumentKind.Decisions => "decisions/",
            _ => throw new ArgumentOutOfRangeException(nameof(kind)),
        };
        return new Uri(
            baseUri,
            $"{route}?scope={Uri.EscapeDataString(scope)}&task={Uri.EscapeDataString(taskStem)}");
    }

    internal static async Task<Uri?> TryResolveDocumentUriAsync(
        DocumentKind kind,
        string fullPath,
        int port,
        TimeSpan? probeTimeout = null,
        CancellationToken cancellationToken = default)
    {
        LauncherSettings settings;
        try
        {
            settings = LauncherSettings.Create(port);
        }
        catch (CliException)
        {
            return null;
        }

        return await TryResolveDocumentUriAsync(
            settings,
            kind,
            fullPath,
            probeTimeout,
            cancellationToken);
    }

    internal static async Task<Uri?> TryResolveDocumentUriAsync(
        LauncherSettings settings,
        DocumentKind kind,
        string fullPath,
        TimeSpan? probeTimeout = null,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(fullPath) || HasReparsePoint(fullPath))
        {
            return null;
        }

        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeout.CancelAfter(probeTimeout ?? ProbeTimeout);
        try
        {
            using var client = await TryConnectAsync(settings, timeout.Token);
            if (client is null)
            {
                return null;
            }

            await client.VerifyEditHostAsync(timeout.Token);
            var files = await client.ListFilesAsync(timeout.Token);
            var serviceBaseUri = new Uri($"http://{client.State.Host}:{client.State.Port}/");
            return TryMatchRegisteredDocumentUri(serviceBaseUri, kind, fullPath, files);
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            return null;
        }
        catch (Exception error) when (error is CliException
            or HttpRequestException
            or IOException
            or JsonException
            or UnauthorizedAccessException
            or UriFormatException)
        {
            return null;
        }
    }

    internal static Uri? TryMatchRegisteredDocumentUri(
        Uri serviceBaseUri,
        DocumentKind kind,
        string fullPath,
        IReadOnlyList<FileRegistration> registrations)
    {
        if (string.IsNullOrWhiteSpace(fullPath))
        {
            return null;
        }

        var targetFullPath = Path.GetFullPath(fullPath);
        if (!File.Exists(targetFullPath) || HasReparsePoint(targetFullPath))
        {
            return null;
        }

        var (subdirectory, extension) = kind switch
        {
            DocumentKind.Checklist => ("checklists", ChecklistFileRegistration.FileExtension),
            DocumentKind.Decisions => ("decisions", DecisionFileRegistration.FileExtension),
            _ => throw new ArgumentOutOfRangeException(nameof(kind)),
        };

        if (!string.Equals(Path.GetExtension(targetFullPath), extension, StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var targetDirectory = Path.GetDirectoryName(targetFullPath);
        if (string.IsNullOrEmpty(targetDirectory))
        {
            return null;
        }

        var targetFileName = Path.GetFileName(targetFullPath);
        var actualFileName = new DirectoryInfo(targetDirectory)
            .EnumerateFiles()
            .FirstOrDefault(entry => string.Equals(entry.Name, targetFileName, StringComparison.OrdinalIgnoreCase))
            ?.Name
            ?? targetFileName;
        var stem = Path.GetFileNameWithoutExtension(actualFileName);
        if (string.IsNullOrWhiteSpace(stem))
        {
            return null;
        }

        var matchedScopes = new HashSet<string>(StringComparer.Ordinal);
        foreach (var registration in registrations)
        {
            if (!TryReadReportJsonRouteScope(registration.UrlPath, out var scope)
                || string.IsNullOrWhiteSpace(registration.FilePath))
            {
                continue;
            }

            string reportFullPath;
            try
            {
                reportFullPath = Path.GetFullPath(registration.FilePath);
            }
            catch (Exception error) when (error is ArgumentException or NotSupportedException or PathTooLongException)
            {
                continue;
            }

            if (!File.Exists(reportFullPath) || HasReparsePoint(reportFullPath))
            {
                continue;
            }

            var scopeRoot = Path.GetDirectoryName(reportFullPath);
            if (string.IsNullOrEmpty(scopeRoot))
            {
                continue;
            }

            var routeDirectory = Path.GetFullPath(Path.Combine(scopeRoot, subdirectory));
            if (!string.Equals(
                    Path.TrimEndingDirectorySeparator(targetDirectory),
                    Path.TrimEndingDirectorySeparator(routeDirectory),
                    StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            var routeFilePath = Path.GetFullPath(Path.Combine(routeDirectory, $"{stem}{extension}"));
            if (!string.Equals(targetFullPath, routeFilePath, StringComparison.OrdinalIgnoreCase)
                || !File.Exists(routeFilePath)
                || HasReparsePoint(routeFilePath))
            {
                continue;
            }

            matchedScopes.Add(scope);
        }

        if (matchedScopes.Count != 1)
        {
            return null;
        }

        return BuildDocumentUri(serviceBaseUri, kind, matchedScopes.Single(), stem);
    }

    internal static bool HasReparsePoint(string path)
    {
        for (FileSystemInfo? current = new FileInfo(Path.GetFullPath(path));
             current is not null;
             current = current is FileInfo file ? file.Directory : ((DirectoryInfo)current).Parent)
        {
            if (current.Exists && (current.Attributes & FileAttributes.ReparsePoint) != 0)
            {
                return true;
            }
        }
        return false;
    }

    public async Task ShutdownAsync(CancellationToken cancellationToken)
    {
        using var response = await _http.PostAsync(ShutdownPath, null, cancellationToken);
        if (response.StatusCode != HttpStatusCode.Accepted)
        {
            throw await CreateControlErrorAsync(response, "無法關閉 LocalWebService", cancellationToken);
        }

        var deadline = DateTime.UtcNow + TimeSpan.FromSeconds(10);
        while (DateTime.UtcNow < deadline)
        {
            cancellationToken.ThrowIfCancellationRequested();
            await Task.Delay(100, cancellationToken);
            var health = await ProbeHealthAsync(_settings, cancellationToken);
            if (health is null && !File.Exists(_settings.StateFile))
            {
                return;
            }
        }

        throw new CliException("LocalWebService 已接受關閉要求，但未在 10 秒內結束。 ");
    }

    public void Dispose() => _http.Dispose();

    private static async Task<LocalWebServiceClient> ConnectAsync(
        LauncherSettings settings,
        ServiceHealth health,
        bool startedNewProcess,
        CancellationToken cancellationToken)
    {
        if (!File.Exists(settings.StateFile))
        {
            throw new CliException(
                $"Port {settings.Port} 上已有 LocalWebService，但找不到控制狀態：{settings.StateFile}");
        }

        var state = LocalWebServiceState.Load(settings.StateFile);
        if (state.Port != settings.Port
            || !string.Equals(state.Host, LauncherSettings.LoopbackHost, StringComparison.Ordinal)
            || !string.Equals(state.InstanceId, health.InstanceId, StringComparison.Ordinal))
        {
            throw new CliException(
                "LocalWebService health 與 state file 不一致；不會覆寫或接管這個 process。 ");
        }

        var http = CreateHttpClient(settings, state.Token);
        try
        {
            using var response = await http.GetAsync(StatusPath, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                throw await CreateControlErrorAsync(
                    response,
                    "無法驗證 LocalWebService 狀態",
                    cancellationToken);
            }

            var status = await response.Content.ReadFromJsonAsync<ServiceStatus>(
                cancellationToken: cancellationToken)
                ?? throw new CliException("LocalWebService status 回應是空的。 ");
            ValidateStatus(settings, state, status);
            return new LocalWebServiceClient(settings, state, status, http, startedNewProcess);
        }
        catch
        {
            http.Dispose();
            throw;
        }
    }

    private static async Task<ServiceHealth?> ProbeHealthAsync(
        LauncherSettings settings,
        CancellationToken cancellationToken)
    {
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeout.CancelAfter(ProbeTimeout);
        using var http = CreateHttpClient(settings);
        try
        {
            using var response = await http.GetAsync(HealthPath, timeout.Token);
            if (!response.IsSuccessStatusCode)
            {
                throw new CliException(
                    $"Port {settings.Port} 已被占用，但不是相容的 LocalWebService。 ");
            }

            var health = await response.Content.ReadFromJsonAsync<ServiceHealth>(
                cancellationToken: timeout.Token);
            if (health is null
                || !string.Equals(health.Service, "localwebservice", StringComparison.Ordinal)
                || health.ApiVersion != 1
                || string.IsNullOrWhiteSpace(health.InstanceId))
            {
                throw new CliException(
                    $"Port {settings.Port} 的 health 回應不是相容的 LocalWebService。 ");
            }
            return health;
        }
        catch (HttpRequestException)
        {
            return null;
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            return null;
        }
        catch (JsonException)
        {
            throw new CliException(
                $"Port {settings.Port} 的 health 回應不是有效 JSON。 ");
        }
    }

    private static async Task<ServiceHealth> WaitForHealthAsync(
        LauncherSettings settings,
        Process process,
        CancellationToken cancellationToken)
    {
        var deadline = DateTime.UtcNow + StartupTimeout;
        while (DateTime.UtcNow < deadline)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (process.HasExited)
            {
                throw new CliException(
                    $"LocalWebService 啟動失敗，Python process 結束碼：{process.ExitCode}");
            }

            var health = await ProbeHealthAsync(settings, cancellationToken);
            if (health is not null)
            {
                return health;
            }
            await Task.Delay(100, cancellationToken);
        }

        throw new CliException("LocalWebService 未在 10 秒內完成啟動。 ");
    }

    private static Process StartService(
        LauncherSettings settings,
        ServiceLaunchMode launchMode)
    {
        var arguments = BuildServiceArguments(settings);
        if (launchMode == ServiceLaunchMode.VisibleConsole)
            arguments = [.. arguments, "--log-console"];
        if (launchMode == ServiceLaunchMode.VisibleConsole)
        {
            try
            {
                return WindowsConsoleProcess.Start(
                    settings.PythonExecutable,
                    arguments,
                    Path.GetDirectoryName(settings.EditHostScript)!,
                    $"TaskProgress LocalWebService :{settings.Port}");
            }
            catch (Exception error) when (error is Win32Exception
                or FileNotFoundException
                or DirectoryNotFoundException)
            {
                throw new CliException(
                    $"無法在獨立 Console 執行 Python「{settings.PythonExecutable}」：{error.Message}");
            }
        }

        var startInfo = new ProcessStartInfo
        {
            FileName = settings.PythonExecutable,
            WorkingDirectory = Path.GetDirectoryName(settings.EditHostScript)!,
            UseShellExecute = false,
            CreateNoWindow = true,
            WindowStyle = ProcessWindowStyle.Hidden,
        };
        foreach (var argument in arguments)
        {
            startInfo.ArgumentList.Add(argument);
        }

        try
        {
            return Process.Start(startInfo)
                ?? throw new CliException("無法建立 LocalWebService Python process。 ");
        }
        catch (Exception error) when (error is Win32Exception
            or FileNotFoundException
            or DirectoryNotFoundException)
        {
            throw new CliException(
                $"無法執行 Python「{settings.PythonExecutable}」：{error.Message}");
        }
    }

    private static string[] BuildServiceArguments(LauncherSettings settings)
    {
        var arguments = new List<string>
        {
            settings.EditHostScript,
            "--log-file",
            settings.ServiceLogFile,
            "--root",
            settings.ViewerRoot,
            "--host",
            LauncherSettings.LoopbackHost,
            "--port",
            settings.Port.ToString(System.Globalization.CultureInfo.InvariantCulture),
            "--control-state",
            settings.StateFile,
            "--endpoints-directory",
            settings.EndpointsDirectory,
            "--local-web-service",
            settings.ServiceScript,
            "--report-schema",
            settings.ReportSchema,
            "--analyzer-executable",
            settings.AnalyzerExecutable,
            "--no-browser",
        };
        if (settings.AnalyzerAssembly is not null)
        {
            arguments.Add("--analyzer-assembly");
            arguments.Add(settings.AnalyzerAssembly);
        }
        return [.. arguments];
    }

    private async Task VerifyEditHostAsync(CancellationToken cancellationToken)
    {
        using var response = await _http.GetAsync(EditHealthPath, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            throw new CliException(
                "目前執行中的 LocalWebService 不支援安全編輯。請先執行 service stop，再重新開啟 report。 ");
        }
        var health = await response.Content.ReadFromJsonAsync<EditHostHealth>(
            cancellationToken: cancellationToken);
        if (health is null
            || !string.Equals(
                health.Service,
                "taskprogress-edit-host",
                StringComparison.Ordinal)
            || health.ApiVersion != 1)
        {
            throw new CliException("TaskProgress 本機編輯 Host health 回應不相容。 ");
        }
    }

    private static void ValidateStatus(
        LauncherSettings settings,
        LocalWebServiceState state,
        ServiceStatus status)
    {
        if (!string.Equals(status.Service, "localwebservice", StringComparison.Ordinal)
            || status.ApiVersion != 1
            || !string.Equals(status.InstanceId, state.InstanceId, StringComparison.Ordinal)
            || !status.Capabilities.Contains("dynamic-exact-files", StringComparer.Ordinal))
        {
            throw new CliException("LocalWebService status 不支援動態精確檔案。 ");
        }

        var expectedRoot = Path.GetFullPath(settings.ViewerRoot);
        var actualRoot = Path.GetFullPath(status.WebRoot);
        if (!string.Equals(expectedRoot, actualRoot, StringComparison.OrdinalIgnoreCase)
            || !string.Equals(
                expectedRoot,
                Path.GetFullPath(state.WebRoot),
                StringComparison.OrdinalIgnoreCase))
        {
            throw new CliException(
                $"Port {settings.Port} 的 LocalWebService 使用不同 Viewer root：{actualRoot}");
        }
    }

    private async Task RegisterFileAsync(
        string urlPath,
        string filePath,
        CancellationToken cancellationToken)
    {
        using var response = await _http.PostAsJsonAsync(
            FilesPath,
            new FileRegistrationRequest(urlPath, filePath),
            cancellationToken);
        if (response.StatusCode is HttpStatusCode.OK or HttpStatusCode.Created)
        {
            return;
        }

        if (response.StatusCode == HttpStatusCode.Conflict)
        {
            var existing = (await ListFilesAsync(cancellationToken))
                .SingleOrDefault(item => string.Equals(item.UrlPath, urlPath, StringComparison.Ordinal));
            var target = existing is null ? "另一個檔案" : existing.FilePath;
            throw new CliException(
                $"scope URL 已指向不同檔案：{urlPath} -> {target}。請先執行 task-progress service stop。 ");
        }

        throw await CreateControlErrorAsync(
            response,
            $"無法註冊 {urlPath}",
            cancellationToken);
    }

    private async Task UnregisterUrlIfPresentAsync(
        string urlPath,
        CancellationToken cancellationToken)
    {
        var registration = (await ListFilesAsync(cancellationToken))
            .SingleOrDefault(item => string.Equals(item.UrlPath, urlPath, StringComparison.Ordinal));
        if (registration is null)
        {
            return;
        }

        await UnregisterAsync(registration, cancellationToken);
    }

    private async Task UnregisterAsync(
        FileRegistration registration,
        CancellationToken cancellationToken)
    {
        using var response = await _http.DeleteAsync(
            $"{FilesPath}/{Uri.EscapeDataString(registration.Id)}",
            cancellationToken);
        if (response.StatusCode != HttpStatusCode.NoContent)
        {
            throw await CreateControlErrorAsync(
                response,
                $"無法解除註冊 {registration.UrlPath}",
                cancellationToken);
        }
    }

    /// <summary>
    ///   Recognises a route this Launcher could have registered, so retiring a
    ///   scope retires everything under it. The file names come from the
    ///   providers rather than a list kept here: a module whose file this did
    ///   not recognise would leave its route behind after its scope was gone.
    /// </summary>
    private static bool TryReadReportRouteScope(string urlPath, out string scope)
    {
        scope = string.Empty;
        var segments = urlPath.Trim('/').Split('/');
        if (segments.Length != 3
            || !string.Equals(segments[0], "reports", StringComparison.Ordinal)
            || !RoutableFileNames.Contains(segments[2]))
        {
            return false;
        }

        try
        {
            scope = ScopeId.Validate(segments[1]);
            return true;
        }
        catch (CliException)
        {
            return false;
        }
    }

    private static bool TryReadReportJsonRouteScope(string urlPath, out string scope)
    {
        scope = string.Empty;
        var segments = urlPath.Trim('/').Split('/');
        if (segments.Length != 3
            || !string.Equals(segments[0], "reports", StringComparison.Ordinal)
            || !string.Equals(segments[2], CoreReportModuleProvider.ReportFileName, StringComparison.Ordinal))
        {
            return false;
        }

        try
        {
            scope = ScopeId.Validate(segments[1]);
            return true;
        }
        catch (CliException)
        {
            return false;
        }
    }

    private async Task<IReadOnlyList<FileRegistration>> ListFilesAsync(
        CancellationToken cancellationToken)
    {
        using var response = await _http.GetAsync(FilesPath, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            throw await CreateControlErrorAsync(
                response,
                "無法取得 LocalWebService 檔案列表",
                cancellationToken);
        }

        var result = await response.Content.ReadFromJsonAsync<FileRegistrationList>(
            cancellationToken: cancellationToken);
        return result?.Files ?? [];
    }

    private static HttpClient CreateHttpClient(
        LauncherSettings settings,
        string? token = null)
    {
        var http = new HttpClient(new SocketsHttpHandler { UseProxy = false })
        {
            BaseAddress = settings.BaseUri,
            Timeout = TimeSpan.FromSeconds(5),
        };
        if (token is not null)
        {
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }
        return http;
    }

    private static async Task<CliException> CreateControlErrorAsync(
        HttpResponseMessage response,
        string context,
        CancellationToken cancellationToken)
    {
        ProblemResponse? problem = null;
        try
        {
            problem = await response.Content.ReadFromJsonAsync<ProblemResponse>(
                cancellationToken: cancellationToken);
        }
        catch (JsonException)
        {
        }

        var detail = problem?.Detail ?? problem?.Title;
        var suffix = string.IsNullOrWhiteSpace(detail) ? string.Empty : $"：{detail}";
        var code = string.IsNullOrWhiteSpace(problem?.Code) ? string.Empty : $" [{problem.Code}]";
        return new CliException($"{context}{code}{suffix}");
    }

    internal sealed record ServiceStatus
    {
        [JsonPropertyName("service")]
        public string Service { get; init; } = string.Empty;

        [JsonPropertyName("api_version")]
        public int ApiVersion { get; init; }

        [JsonPropertyName("instance_id")]
        public string InstanceId { get; init; } = string.Empty;

        [JsonPropertyName("web_root")]
        public string WebRoot { get; init; } = string.Empty;

        [JsonPropertyName("capabilities")]
        public string[] Capabilities { get; init; } = [];

        [JsonPropertyName("registration_count")]
        public int RegistrationCount { get; init; }
    }

    private sealed record ServiceHealth
    {
        [JsonPropertyName("service")]
        public string Service { get; init; } = string.Empty;

        [JsonPropertyName("api_version")]
        public int ApiVersion { get; init; }

        [JsonPropertyName("instance_id")]
        public string InstanceId { get; init; } = string.Empty;
    }

    private sealed record FileRegistrationRequest(
        [property: JsonPropertyName("url_path")] string UrlPath,
        [property: JsonPropertyName("file_path")] string FilePath);

    private sealed record FileRegistrationList
    {
        [JsonPropertyName("files")]
        public FileRegistration[] Files { get; init; } = [];
    }

    internal sealed record FileRegistration
    {
        [JsonPropertyName("id")]
        public string Id { get; init; } = string.Empty;

        [JsonPropertyName("url_path")]
        public string UrlPath { get; init; } = string.Empty;

        [JsonPropertyName("file_path")]
        public string FilePath { get; init; } = string.Empty;
    }

    private sealed record ProblemResponse
    {
        [JsonPropertyName("title")]
        public string? Title { get; init; }

        [JsonPropertyName("detail")]
        public string? Detail { get; init; }

        [JsonPropertyName("code")]
        public string? Code { get; init; }
    }

    private sealed record EditHostHealth
    {
        [JsonPropertyName("service")]
        public string Service { get; init; } = string.Empty;

        [JsonPropertyName("api_version")]
        public int ApiVersion { get; init; }
    }
}
