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

    public static async Task<LocalWebServiceClient> EnsureAsync(
        LauncherSettings settings,
        CancellationToken cancellationToken,
        ServiceLaunchMode launchMode = ServiceLaunchMode.Hidden)
    {
        var health = await ProbeHealthAsync(settings, cancellationToken);
        var startedNewProcess = false;
        if (health is null)
        {
            PrepareStateFileForStart(settings);
            using var process = StartService(settings, launchMode);
            health = await WaitForHealthAsync(settings, process, cancellationToken);
            startedNewProcess = true;
        }

        return await ConnectAsync(settings, health, startedNewProcess, cancellationToken);
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

    public async Task RegisterReportAsync(
        ReportFolder report,
        CancellationToken cancellationToken)
    {
        var reportUrl = $"/reports/{report.Scope}/report.json";
        var developerUrl = $"/reports/{report.Scope}/report.dev.json";
        await RegisterFileAsync(reportUrl, report.ReportPath, cancellationToken);

        if (report.DeveloperPath is not null)
        {
            await RegisterFileAsync(developerUrl, report.DeveloperPath, cancellationToken);
        }
        else
        {
            await UnregisterUrlIfPresentAsync(developerUrl, cancellationToken);
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

    public Uri BuildViewerUri(ReportFolder report)
    {
        var query = $"?scope={Uri.EscapeDataString(report.Scope)}";
        if (report.DeveloperPath is not null)
        {
            query += $"&dev=reports/{Uri.EscapeDataString(report.Scope)}/report.dev.json";
        }
        return new Uri(_settings.BaseUri, query);
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
        {
            try
            {
                return WindowsConsoleProcess.Start(
                    settings.PythonExecutable,
                    arguments,
                    Path.GetDirectoryName(settings.ServiceScript)!,
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
            WorkingDirectory = Path.GetDirectoryName(settings.ServiceScript)!,
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

    private static string[] BuildServiceArguments(LauncherSettings settings) =>
    [
        settings.ServiceScript,
        "--root",
        settings.ViewerRoot,
        "--host",
        LauncherSettings.LoopbackHost,
        "--port",
        settings.Port.ToString(System.Globalization.CultureInfo.InvariantCulture),
        "--control-state",
        settings.StateFile,
        "--no-browser",
    ];

    private static void PrepareStateFileForStart(LauncherSettings settings)
    {
        if (!File.Exists(settings.StateFile))
        {
            return;
        }

        var state = LocalWebServiceState.Load(settings.StateFile);
        if (IsProcessRunning(state.ProcessId))
        {
            throw new CliException(
                $"LocalWebService state file 屬於仍在執行的 PID {state.ProcessId}，不會覆寫：{settings.StateFile}");
        }

        try
        {
            File.Delete(settings.StateFile);
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException)
        {
            throw new CliException($"無法移除過期的 LocalWebService state file：{error.Message}");
        }
    }

    private static bool IsProcessRunning(int processId)
    {
        try
        {
            using var process = Process.GetProcessById(processId);
            return !process.HasExited;
        }
        catch (ArgumentException)
        {
            return false;
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

    private static bool TryReadReportRouteScope(string urlPath, out string scope)
    {
        scope = string.Empty;
        var segments = urlPath.Trim('/').Split('/');
        if (segments.Length != 3
            || !string.Equals(segments[0], "reports", StringComparison.Ordinal)
            || segments[2] is not ("report.json" or "report.dev.json"))
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

    private sealed record FileRegistration
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
}
