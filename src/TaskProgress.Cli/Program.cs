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

    private static int RunScopeCommand(string[] args, ScopeStore store)
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

    private static OpenRequest ParseOpenRequest(string[] args, ScopeStore store)
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
        var openBrowser = true;
        for (var index = 0; index < args.Length; index++)
        {
            var value = args[index];
            switch (value.ToLowerInvariant())
            {
                case "--port":
                    port = ParseInteger(ReadOptionValue(args, ref index, value), value, 1, 65535);
                    break;
                case "--no-browser":
                case "--no-open":
                    openBrowser = false;
                    break;
                default:
                    throw new CliException($"不支援的 start 選項：{value}");
            }
        }
        return new StartRequest(port, openBrowser);
    }

    private static async Task StartAsync(
        StartRequest request,
        ScopeStore store,
        CancellationToken cancellationToken)
    {
        var registeredScopes = store.List();
        if (registeredScopes.Count == 0)
        {
            throw new CliException(
                $"尚未登記本機 scope。請先執行 scope add <report-folder>。設定檔：{store.ConfigPath}");
        }

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
            reports.Add(report);
        }

        var settings = LauncherSettings.Create(request.Port);
        ScopeCatalog.Write(settings.ScopeCatalogFile, reports);
        using var service = await LocalWebServiceClient.EnsureAsync(
            settings,
            cancellationToken,
            ServiceLaunchMode.VisibleConsole);
        foreach (var report in reports)
        {
            await service.RegisterReportAsync(report, cancellationToken);
        }
        await service.RemoveUnregisteredReportRoutesAsync(
            reports.Select(report => report.Scope).ToHashSet(StringComparer.Ordinal),
            cancellationToken);
        await service.RegisterScopeCatalogAsync(settings.ScopeCatalogFile, cancellationToken);

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

    private static async Task OpenAsync(OpenRequest request, CancellationToken cancellationToken)
    {
        var report = ReportFolder.Load(request.Folder);
        if (request.ExpectedScope is not null
            && !string.Equals(request.ExpectedScope, report.Scope, StringComparison.Ordinal))
        {
            throw new CliException(
                $"scope「{request.ExpectedScope}」與 report.json 的 scope_id「{report.Scope}」不一致。 ");
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
        Console.WriteLine("  --port <port>                    指定連接埠，預設 8001");
        Console.WriteLine("  --no-browser                     不自動開啟瀏覽器");
        Console.WriteLine("  -h, -help, --help                顯示本說明");
        Console.WriteLine();
        Console.WriteLine("範例：");
        Console.WriteLine("  scope add \"W:\\UnityProject\\BonghuoVR\"");
        Console.WriteLine("  start");
        Console.WriteLine("  open --scope bonghuo-vr --no-browser");
        Console.WriteLine("  http://127.0.0.1:8001/?scope=bonghuo-vr");
        Console.WriteLine();
        Console.WriteLine("資料夾名稱範例：BonghuoVR -> bonghuo-vr");
    }

    private sealed record OpenRequest(
        string Folder,
        string? ExpectedScope,
        int Port,
        bool OpenBrowser);

    private sealed record StartRequest(int Port, bool OpenBrowser);
}
