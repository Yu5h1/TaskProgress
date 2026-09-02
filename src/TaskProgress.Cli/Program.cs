using System.Diagnostics;
using System.Net;
using System.Text;

namespace TaskProgress;

internal static class Program
{
    public static async Task<int> Main(string[] args)
    {
        Console.OutputEncoding = Encoding.UTF8;
        using var cancellation = new CancellationTokenSource();
        Console.CancelKeyPress += (_, eventArgs) =>
        {
            eventArgs.Cancel = true;
            cancellation.Cancel();
        };

        try
        {
            return await RunAsync(args, cancellation.Token);
        }
        catch (CliException error)
        {
            Console.Error.WriteLine($"錯誤：{error.Message}");
            return 1;
        }
        catch (Exception error)
        {
            Console.Error.WriteLine($"未預期錯誤：{error.Message}");
            return 1;
        }
    }

    private static async Task<int> RunAsync(string[] args, CancellationToken cancellationToken)
    {
        if (args.Length == 0 || IsHelp(args[0]))
        {
            PrintHelp();
            return 0;
        }

        // Windows default-App activation passes only the selected file path;
        // it does not preserve the `checklist` command inserted by our own
        // Registry installer. Both activation forms must reach the same exact-
        // file validation and error-dialog boundary.
        if (IsDirectChecklistActivation(args))
        {
            return ChecklistCommand.Run(args);
        }

        var store = new ScopeStore();
        if (Uri.TryCreate(args[0], UriKind.Absolute, out var activationUri)
            && string.Equals(activationUri.Scheme, ProtocolRegistration.Scheme, StringComparison.OrdinalIgnoreCase))
        {
            var protocolRequest = ParseProtocolRequest(activationUri, store);
            await OpenAsync(protocolRequest, cancellationToken);
            return 0;
        }

        switch (args[0].ToLowerInvariant())
        {
            case "protocol":
                return RunProtocolCommand(args[1..]);
            case "scope":
                return RunScopeCommand(args[1..], store);
            case "service":
                return await RunServiceCommandAsync(args[1..], cancellationToken);
            case "start":
                await StartAsync(ParseStartRequest(args[1..]), store, cancellationToken);
                return 0;
            case "worker":
                return await WorkerCommand.RunAsync(store, cancellationToken);
            case "analyze":
                Analyze(ParseAnalyzeRequest(args[1..], store));
                return 0;
            case "checklist":
                return ChecklistCommand.Run(args[1..]);
            case "open":
                await OpenAsync(ParseOpenRequest(args[1..], store), cancellationToken);
                return 0;
            default:
                await OpenAsync(ParseOpenRequest(args, store), cancellationToken);
                return 0;
        }
    }

    private static int RunProtocolCommand(string[] args)
    {
        if (args.Length != 1)
        {
            throw new CliException("用法：task-progress protocol install|uninstall");
        }

        switch (args[0].ToLowerInvariant())
        {
            case "install":
                ProtocolRegistration.Install();
                Console.WriteLine("已為目前 Windows 使用者註冊 task-progress://。");
                Console.WriteLine("Chrome 書籤可使用：task-progress://open?scope=<scope-id>");
                return 0;
            case "uninstall":
                Console.WriteLine(ProtocolRegistration.Uninstall()
                    ? "已移除 task-progress:// 註冊。"
                    : "task-progress:// 尚未註冊。 ");
                return 0;
            default:
                throw new CliException("用法：task-progress protocol install|uninstall");
        }
    }

    internal static int RunScopeCommand(string[] args, ScopeStore store)
    {
        if (args.Length == 1 && string.Equals(args[0], "list", StringComparison.OrdinalIgnoreCase))
        {
            var scopes = store.List();
            if (scopes.Count == 0)
            {
                Console.WriteLine($"尚未登記本機 scope。設定檔：{store.ConfigPath}");
                return 0;
            }
            foreach (var item in scopes.OrderBy(item => item.Key, StringComparer.Ordinal))
            {
                Console.WriteLine($"{item.Key} -> {item.Value}");
            }
            return 0;
        }

        if (args.Length == 3 && string.Equals(args[0], "add", StringComparison.OrdinalIgnoreCase))
        {
            store.Add(args[1], args[2]);
            Console.WriteLine($"已登記 scope「{args[1]}」：{Path.GetFullPath(args[2])}");
            return 0;
        }

        if (args.Length == 2 && string.Equals(args[0], "add", StringComparison.OrdinalIgnoreCase))
        {
            var scope = store.Add(args[1]);
            Console.WriteLine($"已從資料夾名稱登記 scope「{scope}」：{Path.GetFullPath(args[1])}");
            return 0;
        }

        if (args.Length == 2 && string.Equals(args[0], "remove", StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine(store.Remove(args[1])
                ? $"已移除 scope「{args[1]}」。"
                : $"找不到 scope「{args[1]}」。");
            return 0;
        }

        throw new CliException(
            "用法：task-progress scope add <report-folder> | add <scope> <report-folder> | remove <scope> | list");
    }

    private static OpenRequest ParseProtocolRequest(Uri uri, ScopeStore store)
    {
        if (!string.Equals(uri.Host, "open", StringComparison.OrdinalIgnoreCase))
        {
            throw new CliException("不支援的 task-progress protocol action。 ");
        }

        var scope = ReadQueryParameter(uri, "scope");
        scope = ScopeId.Validate(scope);
        return new OpenRequest(store.Resolve(scope), scope, LauncherSettings.DefaultPort, true);
    }

    private static string? ReadQueryParameter(Uri uri, string name)
    {
        string? result = null;
        foreach (var pair in uri.Query.TrimStart('?').Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var separator = pair.IndexOf('=');
            var rawName = separator < 0 ? pair : pair[..separator];
            if (!string.Equals(WebUtility.UrlDecode(rawName), name, StringComparison.Ordinal))
            {
                continue;
            }

            if (result is not null)
            {
                throw new CliException($"{name} 不可重複指定。 ");
            }
            result = WebUtility.UrlDecode(separator < 0 ? string.Empty : pair[(separator + 1)..]);
        }
        return result;
    }

    internal static OpenRequest ParseOpenRequest(string[] args, ScopeStore store)
    {
        string? folder = null;
        string? scope = null;
        var port = LauncherSettings.DefaultPort;
        var openBrowser = true;

        for (var index = 0; index < args.Length; index++)
        {
            var value = args[index];
            switch (value.ToLowerInvariant())
            {
                case "--scope":
                    scope = ReadOptionValue(args, ref index, value);
                    break;
                case "--port":
                    port = ParseInteger(ReadOptionValue(args, ref index, value), value, 1, 65535);
                    break;
                case "--no-browser":
                case "--no-open":
                    openBrowser = false;
                    break;
                default:
                    if (value.StartsWith('-'))
                    {
                        throw new CliException($"不支援的選項：{value}");
                    }
                    if (folder is not null)
                    {
                        throw new CliException("只能指定一個 report folder。 ");
                    }
                    folder = value;
                    break;
            }
        }

        if (folder is not null && scope is not null)
        {
            throw new CliException("report folder 與 --scope 不可同時指定。 ");
        }
        if (scope is not null)
        {
            scope = ScopeId.Validate(scope);
            folder = store.Resolve(scope);
        }
        if (folder is null)
        {
            throw new CliException("請指定 report folder，或使用 --scope <scope-id>。 ");
        }

        return new OpenRequest(folder, scope, port, openBrowser);
    }

    private static StartRequest ParseStartRequest(string[] args)
    {
        var port = LauncherSettings.DefaultPort;
        var portSpecified = false;
        var openBrowser = true;
        var tray = false;
        for (var index = 0; index < args.Length; index++)
        {
            var value = args[index];
            switch (value.ToLowerInvariant())
            {
                case "--port":
                    port = ParseInteger(ReadOptionValue(args, ref index, value), value, 1, 65535);
                    portSpecified = true;
                    break;
                case "--no-browser":
                case "--no-open":
                    openBrowser = false;
                    break;
                case "--tray":
                    tray = true;
                    break;
                default:
                    throw new CliException($"不支援的 start 選項：{value}");
            }
        }

        if (tray && portSpecified)
        {
            throw new CliException(
                "--tray 不能與 --port 併用。tray 的 port 由 TrayApp manifest 決定，"
                + "命令列的值傳不進 worker，所以這裡拒絕而不是安靜忽略。 ");
        }

        return new StartRequest(port, openBrowser, tray);
    }

    private static AnalyzeRequest ParseAnalyzeRequest(string[] args, ScopeStore store)
    {
        string? folder = null;
        string? scope = null;
        string? output = null;
        string? module = null;
        DateTimeOffset? asOf = null;
        for (var index = 0; index < args.Length; index++)
        {
            var value = args[index];
            switch (value.ToLowerInvariant())
            {
                case "--scope":
                    scope = ScopeId.Validate(ReadOptionValue(args, ref index, value));
                    break;
                case "--output":
                    output = ReadOptionValue(args, ref index, value);
                    break;
                case "--module":
                    module = ReadOptionValue(args, ref index, value);
                    break;
                case "--as-of":
                    var timestamp = ReadOptionValue(args, ref index, value);
                    if (!DateTimeOffset.TryParse(
                        timestamp,
                        System.Globalization.CultureInfo.InvariantCulture,
                        System.Globalization.DateTimeStyles.RoundtripKind,
                        out var parsed))
                    {
                        throw new CliException("--as-of 必須是包含時區的 ISO 8601 時間。");
                    }
                    asOf = parsed;
                    break;
                default:
                    if (value.StartsWith('-'))
                    {
                        throw new CliException($"不支援的 analyze 選項：{value}");
                    }
                    if (folder is not null)
                    {
                        throw new CliException("analyze 只能指定一個 report folder。");
                    }
                    folder = value;
                    break;
            }
        }
        if (folder is not null && scope is not null)
        {
            throw new CliException("report folder 與 --scope 不可同時指定。");
        }
        if (scope is not null) folder = store.Resolve(scope);
        folder ??= ".";
        return new AnalyzeRequest(folder, output, module, asOf);
    }

    /// <summary>
    ///   Explicit regeneration. Unlike the automatic refresh this does not
    ///   gate on <see cref="IAnalysisModule.HasInputs"/> — the reader asked
    ///   for it, so each module is given the chance to answer and returns null
    ///   only when it genuinely has nothing to produce.
    /// </summary>
    private static void Analyze(AnalyzeRequest request)
    {
        var modules = SelectAnalysisModules(request.Module);
        if (request.Output is not null && modules.Count != 1)
        {
            throw new CliException("--output 需要以 --module 指定單一模組。");
        }

        var produced = new List<(string Name, IReadOnlyList<string> Details)>();
        foreach (var module in PlanAnalysisModules(modules).Order)
        {
            var result = module.Generate(request.Folder, request.AsOf, request.Output);
            if (result is not null) produced.Add((module.DisplayName, result.Details));
        }

        if (produced.Count == 0)
        {
            Console.WriteLine("沒有模組可分析此報告。");
            return;
        }

        foreach (var (name, details) in produced)
        {
            if (produced.Count > 1) Console.WriteLine($"[{name}]");
            foreach (var line in details) Console.WriteLine(line);
        }
    }

    private static IReadOnlyList<IAnalysisModule> SelectAnalysisModules(string? module)
    {
        if (module is null) return AnalysisModules.Production;
        var selected = AnalysisModules.Production
            .Where(candidate => string.Equals(candidate.Type, module, StringComparison.OrdinalIgnoreCase)
                || candidate.Type.EndsWith($".{module}", StringComparison.OrdinalIgnoreCase))
            .ToArray();
        if (selected.Length == 0)
        {
            var names = string.Join("、", AnalysisModules.Production.Select(candidate => candidate.Type));
            throw new CliException($"找不到分析模組「{module}」。可用：{names}");
        }

        return selected;
    }

    private static async Task StartAsync(
        StartRequest request,
        ScopeStore store,
        CancellationToken cancellationToken)
    {
        if (request.Tray)
        {
            await StartTrayAsync(request, cancellationToken);
            return;
        }

        if (store.List().Count == 0)
        {
            throw new CliException(
                $"尚未登記本機 scope。請先執行 scope add <report-folder>。設定檔：{store.ConfigPath}");
        }

        var reports = LoadRegisteredReports(store);
        var settings = LauncherSettings.Create(request.Port);
        using var service = await EnsureServiceAsync(
            settings,
            reports,
            ServiceLaunchMode.VisibleConsole,
            cancellationToken);

        Console.WriteLine($"TaskProgress Viewer：{settings.BaseUri}");
        Console.WriteLine($"LocalWebService：PID {service.State.ProcessId}，port {settings.Port}");
        Console.WriteLine($"已載入 scope：{reports.Count}");
        foreach (var report in reports)
        {
            Console.WriteLine($"  {report.Scope}");
        }
        Console.WriteLine(service.StartedNewProcess
            ? "LocalWebService 已在獨立 Console 啟動；按 Ctrl+C 可正常停止服務。"
            : "LocalWebService 原本已在執行；已沿用現有 process，視窗狀態不變。 ");

        if (request.OpenBrowser)
        {
            Process.Start(new ProcessStartInfo(settings.BaseUri.AbsoluteUri) { UseShellExecute = true });
        }
    }

    /// <summary>
    ///   Hands startup to the tray. Nothing is confirmed or launched here:
    ///   TrayHost's own invoke starts the Host only when it is not already
    ///   running, and the resident worker is what brings the service up, so
    ///   running this twice reuses one tray instead of racing itself.
    /// </summary>
    private static async Task StartTrayAsync(
        StartRequest request,
        CancellationToken cancellationToken)
    {
        var status = await TrayHostLauncher.InvokeAsync(["status"], cancellationToken);
        if (status.Length > 0)
        {
            Console.WriteLine(status);
        }
        Console.WriteLine("TaskProgress 系統匣已就緒；結束請使用 tray 選單的 Exit。");

        if (request.OpenBrowser)
        {
            var viewer = LauncherSettings.Create(LauncherSettings.DefaultPort).BaseUri;
            Console.WriteLine($"TaskProgress Viewer：{viewer}");
            Process.Start(new ProcessStartInfo(viewer.AbsoluteUri) { UseShellExecute = true });
        }
    }

    /// <summary>
    ///   Loads and validates every registered scope, refreshing whatever
    ///   analysis modules have inputs. An empty store is a valid result here;
    ///   only callers that cannot proceed without a scope reject it.
    /// </summary>
    internal static IReadOnlyList<ReportFolder> LoadRegisteredReports(ScopeStore store)
    {
        var registeredScopes = store.List();
        var reports = new List<ReportFolder>(registeredScopes.Count);
        foreach (var item in registeredScopes.OrderBy(item => item.Key, StringComparer.Ordinal))
        {
            var expectedScope = ScopeId.Validate(item.Key);
            var report = ReportFolder.Load(item.Value);
            if (!string.Equals(expectedScope, report.Scope, StringComparison.Ordinal))
            {
                throw new CliException(
                    $"scope「{expectedScope}」與 {report.ReportPath} 的 scope_id「{report.Scope}」不一致。 ");
            }
            if (TryAutoGenerate(item.Value))
            {
                report = ReportFolder.Load(item.Value);
            }
            reports.Add(report);
        }

        return reports;
    }

    /// <summary>
    ///   Brings the service up and makes it serve exactly these reports:
    ///   registers each one, retires routes for scopes that are gone, and
    ///   publishes the path-free catalog. The launch mode is the caller's
    ///   because a console is right for a one-shot run and wrong for a worker.
    /// </summary>
    internal static async Task<LocalWebServiceClient> EnsureServiceAsync(
        LauncherSettings settings,
        IReadOnlyList<ReportFolder> reports,
        ServiceLaunchMode launchMode,
        CancellationToken cancellationToken)
    {
        ScopeCatalog.Write(settings.ScopeCatalogFile, reports);
        var service = await LocalWebServiceClient.EnsureAsync(
            settings,
            cancellationToken,
            launchMode);
        try
        {
            foreach (var report in reports)
            {
                await service.RegisterReportAsync(report, cancellationToken);
            }
            await service.RemoveUnregisteredReportRoutesAsync(
                reports.Select(report => report.Scope).ToHashSet(StringComparer.Ordinal),
                cancellationToken);
            await service.RegisterScopeCatalogAsync(settings.ScopeCatalogFile, cancellationToken);
            return service;
        }
        catch
        {
            service.Dispose();
            throw;
        }
    }

    internal static async Task OpenAsync(OpenRequest request, CancellationToken cancellationToken)
    {
        var report = ReportFolder.Load(request.Folder);
        if (request.ExpectedScope is not null
            && !string.Equals(request.ExpectedScope, report.Scope, StringComparison.Ordinal))
        {
            throw new CliException(
                $"scope「{request.ExpectedScope}」與 report.json 的 scope_id「{report.Scope}」不一致。 ");
        }
        if (TryAutoGenerate(request.Folder))
        {
            report = ReportFolder.Load(request.Folder);
        }

        var settings = LauncherSettings.Create(request.Port);
        using var service = await LocalWebServiceClient.EnsureAsync(settings, cancellationToken);
        await service.RegisterReportAsync(report, cancellationToken);
        var viewerUri = service.BuildViewerUri(report);

        Console.WriteLine($"TaskProgress Viewer：{viewerUri}");
        Console.WriteLine($"Scope：{report.Scope}");
        Console.WriteLine($"LocalWebService：PID {service.State.ProcessId}，port {settings.Port}");
        if (request.OpenBrowser)
        {
            Process.Start(new ProcessStartInfo(viewerUri.AbsoluteUri) { UseShellExecute = true });
        }
    }

    /// <summary>
    ///   Refreshes every analysis module that has inputs in this folder, and
    ///   reports whether any produced something, which is what tells the
    ///   caller to reload the report. One module failing is isolated: it warns
    ///   and the rest still run, because a broken analyzer must not stop a
    ///   report being served.
    /// </summary>
    private static bool TryAutoGenerate(string folder)
    {
        var plan = PlanAnalysisModules(AnalysisModules.Production);
        var generated = false;
        foreach (var module in plan.Order)
        {
            if (!module.HasInputs(folder)) continue;
            try
            {
                var result = module.Generate(folder);
                if (result is null) continue;
                Console.WriteLine(result.Summary);
                generated = true;
            }
            catch (CliException error)
            {
                Console.Error.WriteLine($"警告：{module.DisplayName}自動更新失敗：{error.Message}");
            }
        }

        return generated;
    }

    /// <summary>
    ///   Orders the modules by what they declare they read, and reports what
    ///   that left out. Diagnostics go to stderr: a cycle is a configuration
    ///   mistake, and an ignored dependency means the numbers that follow were
    ///   computed on less input than they claim to describe.
    /// </summary>
    private static ModuleDependencyPlan PlanAnalysisModules(
        IReadOnlyList<IAnalysisModule> modules)
    {
        var plan = ModuleDependencyGraph.Plan(modules);
        var names = modules.ToDictionary(
            module => module.Type,
            module => module.DisplayName,
            StringComparer.Ordinal);

        foreach (var cycle in plan.Cycles)
        {
            Console.Error.WriteLine(
                $"警告：分析模組相依成環，已停用環上全部模組：{cycle}");
        }

        foreach (var ignored in plan.IgnoredDependencies)
        {
            var reason = ignored.Reason == IgnoredDependencyReason.DisabledByCycle
                ? "因相依成環被停用"
                : "未註冊";
            var self = names.TryGetValue(ignored.ModuleType, out var name)
                ? name
                : ignored.ModuleType;
            Console.Error.WriteLine(
                $"警告：{self} 的相依模組「{ignored.DependsOnType}」{reason}，其數值未計入。");
        }

        return plan;
    }

    private static async Task<int> RunServiceCommandAsync(
        string[] args,
        CancellationToken cancellationToken)
    {
        if (args.Length == 0)
        {
            throw new CliException("用法：task-progress service status|stop [--port <port>]");
        }

        var action = args[0].ToLowerInvariant();
        var port = LauncherSettings.DefaultPort;
        for (var index = 1; index < args.Length; index++)
        {
            var value = args[index];
            if (!string.Equals(value, "--port", StringComparison.OrdinalIgnoreCase))
            {
                throw new CliException($"不支援的選項：{value}");
            }
            port = ParseInteger(ReadOptionValue(args, ref index, value), value, 1, 65535);
        }

        var settings = LauncherSettings.Create(port);
        using var service = await LocalWebServiceClient.TryConnectAsync(settings, cancellationToken);
        if (service is null)
        {
            Console.WriteLine($"LocalWebService 未在 {settings.BaseUri} 啟動。 ");
            return 0;
        }

        switch (action)
        {
            case "status":
                Console.WriteLine($"LocalWebService：{settings.BaseUri}");
                Console.WriteLine($"PID：{service.State.ProcessId}");
                Console.WriteLine($"Instance：{service.State.InstanceId}");
                Console.WriteLine($"Viewer root：{service.Status.WebRoot}");
                Console.WriteLine($"已註冊檔案：{service.Status.RegistrationCount}");
                return 0;
            case "stop":
                await service.ShutdownAsync(cancellationToken);
                Console.WriteLine("LocalWebService 已停止。 ");
                return 0;
            default:
                throw new CliException("用法：task-progress service status|stop [--port <port>]");
        }
    }

    private static string ReadOptionValue(string[] args, ref int index, string option)
    {
        if (index + 1 >= args.Length || args[index + 1].StartsWith('-'))
        {
            throw new CliException($"{option} 缺少值。 ");
        }
        return args[++index];
    }

    private static int ParseInteger(string value, string option, int minimum, int maximum)
    {
        if (!int.TryParse(value, out var result) || result < minimum || result > maximum)
        {
            throw new CliException($"{option} 必須是 {minimum} 到 {maximum} 的整數。 ");
        }
        return result;
    }

    private static bool IsHelp(string value) => value is "--help" or "-help" or "-h" or "help";

    internal static bool IsDirectChecklistActivation(string[] args) =>
        args.Length == 1
        && string.Equals(
            Path.GetExtension(args[0]),
            ChecklistFileRegistration.FileExtension,
            StringComparison.OrdinalIgnoreCase);

    private static void PrintHelp()
    {
        Console.WriteLine("TaskProgress Launcher");
        Console.WriteLine();
        Console.WriteLine("用法：");
        Console.WriteLine("  task-progress.exe <命令> [參數] [選項]");
        Console.WriteLine("  task-progress.exe <report-folder> [選項]");
        Console.WriteLine();
        Console.WriteLine("命令：");
        Console.WriteLine("  start                            啟動服務並載入所有已登記 scope");
        Console.WriteLine("  start --tray                     改以系統匣常駐啟動；重複執行會重用同一個 tray");
        Console.WriteLine("  worker                           以 TrayHost owned worker 常駐（由 tray 啟動，非人工執行）");
        Console.WriteLine("  analyze <report-folder>          執行所有分析模組");
        Console.WriteLine("  analyze --module <名稱>          只執行指定模組，例如 time、cost");
        Console.WriteLine("  analyze --scope <scope-id>       分析已登記的 scope");
        Console.WriteLine("  checklist <task.checklist>       開啟本機 WPF Checklist 編輯器");
        Console.WriteLine("  checklist validate <file>        僅驗證文件格式並輸出到 stdout，不開視窗");
        Console.WriteLine("  checklist install                註冊目前使用者的 .checklist 檔案關聯");
        Console.WriteLine("  checklist uninstall              移除 TaskProgress .checklist 檔案關聯");
        Console.WriteLine("  open <report-folder>             開啟指定資料夾的報告");
        Console.WriteLine("  open --scope <scope-id>          開啟已登記的 scope");
        Console.WriteLine("  scope add <report-folder>        以資料夾名稱自動產生並登記 scope");
        Console.WriteLine("  scope add <scope-id> <folder>    以指定名稱登記 scope");
        Console.WriteLine("  scope remove <scope-id>          移除 scope");
        Console.WriteLine("  scope list                       列出所有 scope");
        Console.WriteLine("  service status                   顯示 LocalWebService 狀態");
        Console.WriteLine("  service stop                     停止 LocalWebService");
        Console.WriteLine("  protocol install                 註冊 task-progress://");
        Console.WriteLine("  protocol uninstall               移除 task-progress://");
        Console.WriteLine();
        Console.WriteLine("選項：");
        Console.WriteLine("  --scope <scope-id>               使用已登記的 scope");
        Console.WriteLine("  --as-of <ISO timestamp>          固定分析時間，便於重現與測試");
        Console.WriteLine("  --module <名稱>                  選擇單一分析模組（time、cost）");
        Console.WriteLine("  --output <path>                  指定分析輸出，需搭配 --module");
        Console.WriteLine("  --port <port>                    指定連接埠，預設 8001");
        Console.WriteLine("  --no-browser                     不自動開啟瀏覽器");
        Console.WriteLine("  --tray                           搭配 start，改用系統匣常駐（不可與 --port 併用）");
        Console.WriteLine("  -h, -help, --help                顯示本說明");
        Console.WriteLine();
        Console.WriteLine("範例：");
        Console.WriteLine("  scope add \"W:\\UnityProject\\BonghuoVR\"");
        Console.WriteLine("  analyze --scope bonghuo-vr");
        Console.WriteLine("  checklist checklists\\task-a.checklist");
        Console.WriteLine("  checklist validate checklists\\task-a.checklist");
        Console.WriteLine("  start");
        Console.WriteLine("  open --scope bonghuo-vr --no-browser");
        Console.WriteLine("  http://127.0.0.1:8001/?scope=bonghuo-vr");
        Console.WriteLine();
        Console.WriteLine("資料夾名稱範例：BonghuoVR -> bonghuo-vr");
    }

    internal sealed record OpenRequest(
        string Folder,
        string? ExpectedScope,
        int Port,
        bool OpenBrowser);

    private sealed record StartRequest(int Port, bool OpenBrowser, bool Tray);

    private sealed record AnalyzeRequest(
        string Folder,
        string? Output,
        string? Module,
        DateTimeOffset? AsOf);
}
