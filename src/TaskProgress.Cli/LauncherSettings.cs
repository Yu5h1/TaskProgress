namespace TaskProgress;

internal sealed record LauncherSettings(
    string ViewerRoot,
    string ServiceScript,
    string PythonExecutable,
    string StateFile,
    string ScopeCatalogFile,
    int Port)
{
    public const int DefaultPort = 8001;
    public const string LoopbackHost = "127.0.0.1";

    public Uri BaseUri => new($"http://{LoopbackHost}:{Port}/");

    public static LauncherSettings Create(int port)
    {
        if (port is < 1 or > 65535)
        {
            throw new CliException("port 必須是 1 到 65535 的整數。 ");
        }

        var viewerRoot = ResolveViewerRoot();
        var serviceScript = ResolveServiceScript(viewerRoot);
        var pythonExecutable = Environment.GetEnvironmentVariable("TASK_PROGRESS_PYTHON");
        if (string.IsNullOrWhiteSpace(pythonExecutable))
        {
            pythonExecutable = "python";
        }
        else
        {
            pythonExecutable = Environment.ExpandEnvironmentVariables(pythonExecutable);
        }

        var applicationHome = GetApplicationHome();
        var stateFile = Environment.GetEnvironmentVariable("TASK_PROGRESS_SERVICE_STATE");
        if (string.IsNullOrWhiteSpace(stateFile))
        {
            stateFile = Path.Combine(applicationHome, $"localwebservice-{port}.json");
        }
        else
        {
            stateFile = Path.GetFullPath(Environment.ExpandEnvironmentVariables(stateFile));
        }

        return new LauncherSettings(
            viewerRoot,
            serviceScript,
            pythonExecutable,
            stateFile,
            Path.Combine(applicationHome, $"scope-catalog-{port}.json"),
            port);
    }

    private static string ResolveViewerRoot()
    {
        var configured = Environment.GetEnvironmentVariable("TASK_PROGRESS_VIEWER_ROOT");
        if (!string.IsNullOrWhiteSpace(configured))
        {
            var root = Path.GetFullPath(Environment.ExpandEnvironmentVariables(configured));
            EnsureViewerRoot(root);
            return root;
        }

        foreach (var start in new[] { Environment.CurrentDirectory, AppContext.BaseDirectory })
        {
            var root = FindViewerRoot(start);
            if (root is not null)
            {
                return root;
            }
        }

        throw new CliException(
            "找不到 TaskProgress Viewer root。請設定 TASK_PROGRESS_VIEWER_ROOT。 ");
    }

    private static string ResolveServiceScript(string viewerRoot)
    {
        var configured = Environment.GetEnvironmentVariable("TASK_PROGRESS_LOCAL_WEB_SERVICE");
        var script = string.IsNullOrWhiteSpace(configured)
            ? FindServiceScript(viewerRoot)
            : Path.GetFullPath(Environment.ExpandEnvironmentVariables(configured));

        if (script is null || !File.Exists(script))
        {
            throw new CliException(
                $"找不到 LocalWebService：{script}。請設定 TASK_PROGRESS_LOCAL_WEB_SERVICE。 ");
        }
        return Path.GetFullPath(script);
    }

    private static string? FindViewerRoot(string start)
    {
        var directory = new DirectoryInfo(Path.GetFullPath(start));
        while (directory is not null)
        {
            if (IsViewerRoot(directory.FullName))
            {
                return directory.FullName;
            }

            var viewer = Path.Combine(directory.FullName, "viewer");
            if (IsViewerRoot(viewer))
            {
                return viewer;
            }
            directory = directory.Parent;
        }
        return null;
    }

    private static string? FindServiceScript(string viewerRoot)
    {
        var directory = new DirectoryInfo(Path.GetFullPath(viewerRoot));
        while (directory is not null)
        {
            var script = Path.Combine(directory.FullName, "LocalWebService", "localHost.py");
            if (File.Exists(script))
            {
                return script;
            }
            directory = directory.Parent;
        }
        return null;
    }

    private static void EnsureViewerRoot(string root)
    {
        if (!IsViewerRoot(root))
        {
            throw new CliException(
                $"TaskProgress Viewer root 缺少 index.html 或 assets/app.js：{root}");
        }
    }

    private static bool IsViewerRoot(string root) =>
        File.Exists(Path.Combine(root, "index.html"))
        && File.Exists(Path.Combine(root, "assets", "app.js"));

    private static string GetApplicationHome()
    {
        var overrideDirectory = Environment.GetEnvironmentVariable("TASK_PROGRESS_HOME");
        return string.IsNullOrWhiteSpace(overrideDirectory)
            ? Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "TaskProgress")
            : Path.GetFullPath(Environment.ExpandEnvironmentVariables(overrideDirectory));
    }
}
