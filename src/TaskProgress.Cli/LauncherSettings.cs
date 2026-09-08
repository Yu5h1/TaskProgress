namespace TaskProgress;

internal sealed record LauncherSettings(
    string ViewerRoot,
    string ServiceScript,
    string EditHostScript,
    string ReportSchema,
    string PythonExecutable,
    string AnalyzerExecutable,
    string? AnalyzerAssembly,
    string StateFile,
    string ScopeCatalogFile,
    int Port)
{
    public const int DefaultPort = 8001;
    public const string LoopbackHost = "127.0.0.1";

    public Uri BaseUri => new($"http://{LoopbackHost}:{Port}/");

    public string EndpointsDirectory => Path.Combine(Path.GetDirectoryName(ScopeCatalogFile)!, "endpoints");

    public static LauncherSettings Create(int port)
    {
        if (port is < 1 or > 65535)
        {
            throw new CliException("port 必須是 1 到 65535 的整數。 ");
        }

        var viewerRoot = ResolveViewerRoot();
        var serviceScript = ResolveServiceScript(viewerRoot);
        var editHostScript = ResolveProjectFile(
            viewerRoot,
            "TASK_PROGRESS_EDIT_HOST",
            Path.Combine("service", "taskprogress_host.py"),
            "TaskProgress 本機編輯 Host");
        var reportSchema = ResolveProjectFile(
            viewerRoot,
            "TASK_PROGRESS_REPORT_SCHEMA",
            Path.Combine("schemas", "report.schema.json"),
            "TaskProgress report schema");
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

        var analyzerExecutable = Environment.ProcessPath
            ?? throw new CliException("無法判斷 TaskProgress analyzer 執行檔。 ");
        var analyzerAssembly = string.Equals(
            Path.GetFileNameWithoutExtension(analyzerExecutable),
            "dotnet",
            StringComparison.OrdinalIgnoreCase)
            ? Path.Combine(AppContext.BaseDirectory, "task-progress.dll")
            : null;
        if (analyzerAssembly is not null && !File.Exists(analyzerAssembly))
        {
            analyzerAssembly = null;
        }

        return new LauncherSettings(
            viewerRoot,
            serviceScript,
            editHostScript,
            reportSchema,
            pythonExecutable,
            analyzerExecutable,
            analyzerAssembly,
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

    private static string ResolveProjectFile(
        string viewerRoot,
        string environmentVariable,
        string relativePath,
        string label)
    {
        var configured = Environment.GetEnvironmentVariable(environmentVariable);
        var path = string.IsNullOrWhiteSpace(configured)
            ? Path.Combine(Directory.GetParent(viewerRoot)?.FullName ?? viewerRoot, relativePath)
            : Path.GetFullPath(Environment.ExpandEnvironmentVariables(configured));
        if (!File.Exists(path))
        {
            throw new CliException(
                $"找不到 {label}：{path}。請設定 {environmentVariable}。 ");
        }
        return Path.GetFullPath(path);
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
