// Pure tests for the Launcher's module boundary: no service, no ports, no
// network. They run first so a broken boundary fails fast, before the
// heavyweight launcher scenarios spend thirty seconds getting there.
//
// The parity test is the load-bearing one. The boundary is only worth adopting
// if it produces exactly the routes LocalWebServiceClient.RegisterReportAsync
// builds by hand today, so that test spells those four URLs out literally
// rather than deriving them the same way the code under test does.

using TaskProgress;

internal static class ReportModuleTests
{
    private static readonly IReadOnlyList<IReportModuleProvider> Production =
    [
        new CoreReportModuleProvider(),
        new TimeReportModuleProvider(),
    ];

    public static void Run()
    {
        var root = Path.Combine(
            Path.GetTempPath(),
            $"task-progress-module-boundary-{Guid.NewGuid():N}");
        Directory.CreateDirectory(root);
        try
        {
            ResolvesExactlyTodaysRoutes(root);
            RetiresRoutesForFilesThatWentAway(root);
            DerivesTheAllowlistInsteadOfMaintainingIt(root);
            RejectsNamesThatLeaveTheReportFolder(root);
            RejectsTwoOwnersForOneFile(root);
            RejectsADuplicateModuleType(root);
            RejectsAnArtifactBelongingToAnotherModule(root);
            RejectsALinkPointingOutOfTheReportFolder(root);
            TimeAnalysisModuleDelegatesToTheGenerator(root);
            StaysOutOfTheProductionPathUntilCutover();
        }
        finally
        {
            try
            {
                Directory.Delete(root, recursive: true);
            }
            catch (IOException)
            {
            }
        }
    }

    private static void ResolvesExactlyTodaysRoutes(string root)
    {
        var folder = NewFolder(root, "full");
        Touch(folder, "report.json");
        Touch(folder, "report.dev.json");
        Touch(folder, "report.modules.json");
        Touch(folder, "time.analysis.json");

        var routes = ReportModuleRegistry.Resolve(Context(folder), Production);
        var urls = routes.Present.Select(route => route.UrlPath).ToArray();

        Equal(4, urls.Length, "A full report folder did not produce four routes");
        Contains(urls, "/reports/demo-scope/report.json");
        Contains(urls, "/reports/demo-scope/report.dev.json");
        Contains(urls, "/reports/demo-scope/report.modules.json");
        Contains(urls, "/reports/demo-scope/time.analysis.json");
        Equal(0, routes.Absent.Count, "A full report folder reported stale routes");
        Equal(
            TimeReportModuleProvider.ModuleType,
            routes.Present.Single(route => route.UrlPath.EndsWith("time.analysis.json", StringComparison.Ordinal)).ModuleType,
            "The time sidecar was not attributed to the Time module");
    }

    private static void RetiresRoutesForFilesThatWentAway(string root)
    {
        var folder = NewFolder(root, "minimal");
        Touch(folder, "report.json");

        var routes = ReportModuleRegistry.Resolve(Context(folder), Production);

        Equal(1, routes.Present.Count, "A report with no sidecars served more than the report");
        Equal(3, routes.Absent.Count, "Absent sidecars did not become stale routes to remove");
        Contains(routes.Absent, "/reports/demo-scope/report.dev.json");
        Contains(routes.Absent, "/reports/demo-scope/report.modules.json");
        Contains(routes.Absent, "/reports/demo-scope/time.analysis.json");
    }

    private static void DerivesTheAllowlistInsteadOfMaintainingIt(string root)
    {
        var folder = NewFolder(root, "allowlist");
        var names = ReportModuleRegistry.DeclaredFileNames(Context(folder), Production);

        Equal(4, names.Count, "The derived allowlist did not cover every declared file");
        Contains(names, "time.analysis.json");
    }

    private static void RejectsNamesThatLeaveTheReportFolder(string root)
    {
        var folder = NewFolder(root, "escape");
        foreach (var name in new[] { "../outside.json", "..\\outside.json", "nested/inside.json", "C:\\absolute.json", "" })
        {
            Throws(
                () => ReportModuleRegistry.Resolve(Context(folder), [new StubProvider("stub.a", name)]),
                $"A declaration of \"{name}\" was accepted");
        }
    }

    private static void RejectsTwoOwnersForOneFile(string root)
    {
        var folder = NewFolder(root, "collision");
        Throws(
            () => ReportModuleRegistry.Resolve(
                Context(folder),
                [new StubProvider("stub.a", "shared.json"), new StubProvider("stub.b", "shared.json")]),
            "Two providers were allowed to claim one file");
    }

    private static void RejectsADuplicateModuleType(string root)
    {
        var folder = NewFolder(root, "duplicate-type");
        Throws(
            () => ReportModuleRegistry.Resolve(
                Context(folder),
                [new StubProvider("stub.a", "one.json"), new StubProvider("stub.a", "two.json")]),
            "One module type was registered twice");
    }

    private static void RejectsAnArtifactBelongingToAnotherModule(string root)
    {
        var folder = NewFolder(root, "wrong-owner");
        Throws(
            () => ReportModuleRegistry.Resolve(
                Context(folder),
                [new StubProvider("stub.a", "one.json", artifactType: "stub.b")]),
            "A provider declared an artifact owned by another module");
    }

    private static void RejectsALinkPointingOutOfTheReportFolder(string root)
    {
        var folder = NewFolder(root, "link");
        var outside = Path.Combine(root, "outside-secret.json");
        File.WriteAllText(outside, "{}");
        var link = Path.Combine(folder, "leaked.json");
        try
        {
            File.CreateSymbolicLink(link, outside);
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException or PlatformNotSupportedException)
        {
            Console.WriteLine("略過：此環境不允許建立符號連結，無法驗證連結逃逸。");
            return;
        }

        Throws(
            () => ReportModuleRegistry.Resolve(Context(folder), [new StubProvider("stub.a", "leaked.json")]),
            "A symlink escaping the report folder was served");
    }

    private static void TimeAnalysisModuleDelegatesToTheGenerator(string root)
    {
        var folder = NewFolder(root, "analysis");
        var module = new TimeAnalysisModule();

        Equal(
            TimeReportModuleProvider.ModuleType,
            module.Type,
            "The Time analyzer and Time provider disagree about the module type");
        False(module.HasInputs(folder), "An empty folder was reported as having Time inputs");

        File.WriteAllText(Path.Combine(folder, "time.config.json"), "{}");
        True(module.HasInputs(folder), "A folder with time.config.json was reported as having no inputs");
    }

    /// <summary>
    ///   The boundary is declared but not adopted: ReportFolder still carries a
    ///   field per sidecar and LocalWebServiceClient still builds each URL by
    ///   hand. Until the cutover replaces those, nothing in the production path
    ///   may reference the new types — otherwise "this slice cannot change
    ///   behaviour" stops being true without anything saying so.
    /// </summary>
    private static void StaysOutOfTheProductionPathUntilCutover()
    {
        var cli = Path.Combine(RepositoryRoot(), "src", "TaskProgress.Cli");
        foreach (var name in new[] { "ReportFolder.cs", "LocalWebServiceClient.cs", "Program.cs" })
        {
            var source = File.ReadAllText(Path.Combine(cli, name));
            foreach (var symbol in new[] { "ReportModuleRegistry", "IReportModuleProvider", "IAnalysisModule" })
            {
                if (source.Contains(symbol, StringComparison.Ordinal))
                {
                    throw new InvalidOperationException(
                        $"{name} references {symbol}; the module boundary is wired in, "
                            + "so this test must be replaced by real cutover coverage.");
                }
            }
        }
    }

    private static string RepositoryRoot()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            if (File.Exists(Path.Combine(directory.FullName, "src", "TaskProgress.Cli", "ReportFolder.cs")))
            {
                return directory.FullName;
            }

            directory = directory.Parent;
        }

        throw new InvalidOperationException("Repository root was not found from the test output directory");
    }

    private static ReportModuleContext Context(string folder) =>
        new(folder, "demo-scope", "demo-report");

    private static string NewFolder(string root, string name)
    {
        var folder = Path.Combine(root, name);
        Directory.CreateDirectory(folder);
        return folder;
    }

    private static void Touch(string folder, string name) =>
        File.WriteAllText(Path.Combine(folder, name), "{}");

    private static void Contains(IReadOnlyList<string> values, string expected)
    {
        if (!values.Contains(expected, StringComparer.Ordinal))
        {
            throw new InvalidOperationException(
                $"Expected {expected} among [{string.Join(", ", values)}]");
        }
    }

    private static void Throws(Action action, string message)
    {
        try
        {
            action();
        }
        catch (CliException)
        {
            return;
        }

        throw new InvalidOperationException(message);
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

    private sealed class StubProvider(string type, string fileName, string? artifactType = null)
        : IReportModuleProvider
    {
        public string Type => type;

        public IReadOnlyList<ReportModuleArtifact> Declare(ReportModuleContext context) =>
            [new(artifactType ?? type, fileName)];
    }
}
