// Routes .checklist and .decisions file-open requests to the verified local web service or the desktop host.
using System.Diagnostics;

namespace TaskProgress;

internal enum DocumentKind
{
    Checklist,
    Decisions,
}

internal sealed record DocumentOpenRequest(
    DocumentKind Kind,
    string FilePath,
    int Port);

internal static class DocumentOpenRouter
{
    public static bool TryGetKind(string path, out DocumentKind kind)
    {
        var extension = Path.GetExtension(path);
        if (string.Equals(extension, ChecklistFileRegistration.FileExtension, StringComparison.OrdinalIgnoreCase))
        {
            kind = DocumentKind.Checklist;
            return true;
        }

        if (string.Equals(extension, DecisionFileRegistration.FileExtension, StringComparison.OrdinalIgnoreCase))
        {
            kind = DocumentKind.Decisions;
            return true;
        }

        kind = default;
        return false;
    }

    public static bool IsDirectActivation(string[] args) =>
        TryMatchDirectActivation(args, out _);

    public static bool IsDirectChecklistActivation(string[] args) =>
        TryMatchDirectActivation(args, out var kind) && kind == DocumentKind.Checklist;

    private static bool TryMatchDirectActivation(string[] args, out DocumentKind kind)
    {
        ArgumentNullException.ThrowIfNull(args);
        kind = default;
        if (args.Length == 1)
        {
            return TryGetKind(args[0], out kind);
        }

        if (args.Length == 3
            && string.Equals(args[1], "--port", StringComparison.OrdinalIgnoreCase))
        {
            return TryGetKind(args[0], out kind);
        }

        return false;
    }

    public static DocumentOpenRequest ParseArgs(
        string[] args,
        DocumentKind? forcedKind = null,
        string? usageMessage = null)
    {
        ArgumentNullException.ThrowIfNull(args);
        var usage = usageMessage ?? GetUsageMessage(forcedKind);
        string? filePath = null;
        var port = LauncherSettings.DefaultPort;

        for (var index = 0; index < args.Length; index++)
        {
            var value = args[index];
            if (string.Equals(value, "--port", StringComparison.OrdinalIgnoreCase))
            {
                if (index + 1 >= args.Length || args[index + 1].StartsWith('-'))
                {
                    throw new CliException("--port 缺少值。 ");
                }

                var rawPort = args[++index];
                if (!int.TryParse(rawPort, out port) || port < 1 || port > 65535)
                {
                    throw new CliException("--port 必須是 1 到 65535 的整數。 ");
                }

                continue;
            }

            if (value.StartsWith('-'))
            {
                throw new CliException(usage);
            }

            if (filePath is not null)
            {
                throw new CliException(usage);
            }

            filePath = value;
        }

        if (filePath is null)
        {
            throw new CliException(usage);
        }

        if (forcedKind is not null)
        {
            return new DocumentOpenRequest(forcedKind.Value, filePath, port);
        }

        if (!TryGetKind(filePath, out var detectedKind))
        {
            throw new CliException(usage);
        }

        return new DocumentOpenRequest(detectedKind, filePath, port);
    }

    public static int Run(
        string[] args,
        DocumentKind? forcedKind = null,
        Action<Uri>? openBrowser = null,
        Action<DocumentKind, string>? openDesktop = null,
        Action<string>? reportError = null,
        TimeSpan? probeTimeout = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return OpenAsync(
                args,
                forcedKind,
                openBrowser,
                openDesktop,
                probeTimeout,
                cancellationToken).GetAwaiter().GetResult();
        }
        catch (CliException error)
        {
            Console.Error.WriteLine($"錯誤：{error.Message}");
            (reportError ?? ChecklistErrorDialog.Show)(error.Message);
            return 1;
        }
    }

    public static async Task<int> OpenAsync(
        string[] args,
        DocumentKind? forcedKind = null,
        Action<Uri>? openBrowser = null,
        Action<DocumentKind, string>? openDesktop = null,
        TimeSpan? probeTimeout = null,
        CancellationToken cancellationToken = default)
    {
        var request = ParseArgs(args, forcedKind);
        string fullPath;
        DecisionStore? decisionStore = null;

        if (request.Kind == DocumentKind.Checklist)
        {
            fullPath = ChecklistDocumentStore.ValidatePath(request.FilePath);
            _ = new ChecklistDocumentStore().Load(fullPath);
        }
        else
        {
            (fullPath, decisionStore) = ValidateDecisionFile(request.FilePath);
        }

        var webUri = await LocalWebServiceClient.TryResolveDocumentUriAsync(
            request.Kind,
            fullPath,
            request.Port,
            probeTimeout,
            cancellationToken);
        if (webUri is not null)
        {
            (openBrowser ?? OpenDefaultBrowser)(webUri);
            return 0;
        }

        if (openDesktop is not null)
        {
            openDesktop(request.Kind, fullPath);
            return 0;
        }

        if (request.Kind == DocumentKind.Checklist)
        {
            ChecklistDesktopHost.Run(fullPath);
            return 0;
        }

        ChecklistDesktopHost.RunDocument(
            fullPath,
            "decisions-ui",
            "taskprogress.decisions",
            "Decisions",
            json => decisionStore!.Handle(json).ToJsonString());
        return 0;
    }

    private static (string FullPath, DecisionStore Store) ValidateDecisionFile(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
        {
            throw new CliException("請指定 .decisions 檔案。");
        }

        DecisionStore store;
        string fullPath;
        try
        {
            fullPath = Path.GetFullPath(filePath);
            store = new DecisionStore(fullPath);
        }
        catch (DecisionException error)
        {
            throw new CliException(error.Message);
        }
        catch (Exception error) when (error is ArgumentException or NotSupportedException or PathTooLongException)
        {
            throw new CliException(error.Message);
        }

        var response = store.Handle("{\"operation\":\"load\"}");
        if (response["ok"]?.GetValue<bool>() != true)
        {
            throw new CliException(response["error"]?.ToJsonString() ?? "Invalid decision file.");
        }

        return (fullPath, store);
    }

    private static void OpenDefaultBrowser(Uri uri) =>
        Process.Start(new ProcessStartInfo(uri.AbsoluteUri) { UseShellExecute = true });

    private static string GetUsageMessage(DocumentKind? forcedKind) =>
        forcedKind switch
        {
            DocumentKind.Checklist => "用法：task-progress checklist <task.checklist>|install|uninstall",
            DocumentKind.Decisions => "用法：task-progress decisions <file.decisions> | validate <file> | request --file <file> | install | uninstall",
            _ => "用法：task-progress <file.checklist|file.decisions> [--port <port>]",
        };
}
