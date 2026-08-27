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
            DerivesTheAllowlistInsteadOfMaintainingIt();
            RejectsNamesThatLeaveTheReportFolder(root);
            RejectsTwoOwnersForOneFile(root);
            RejectsADuplicateModuleType(root);
            RejectsAnArtifactBelongingToAnotherModule(root);
            RejectsALinkPointingOutOfTheReportFolder(root);
            TimeAnalysisModuleDelegatesToTheGenerator(root);
            CoreProviderStillRejectsAMismatchedSidecar(root);
            AnalysisModulesSkipFoldersWithNoInputs(root);
            NoSidecarNameSurvivesInTheRoutingPath();
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
        Touch(folder, "time.analysis.json");
        WriteValidDeveloper(folder);
        WriteValidManifest(folder);

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

    private static void DerivesTheAllowlistInsteadOfMaintainingIt()
    {
        var names = ReportModuleRegistry.DeclaredFileNames(Production);

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
    ///   The point of the cutover: no sidecar file name may be written into
    ///   the routing path any more. A regression here does not break a test
    ///   elsewhere — it quietly restores the hand-maintained allowlist Phase 3
    ///   exists to delete — so it is asserted against the source directly.
    /// </summary>
    private static void NoSidecarNameSurvivesInTheRoutingPath()
    {
        var cli = Path.Combine(RepositoryRoot(), "src", "TaskProgress.Cli");
        var routing = File.ReadAllText(Path.Combine(cli, "LocalWebServiceClient.cs"));
        foreach (var name in new[] { "report.dev.json", "time.analysis.json", "report.modules.json" })
        {
            if (routing.Contains(name, StringComparison.Ordinal))
            {
                throw new InvalidOperationException(
                    $"LocalWebServiceClient.cs names {name}; routing must come from the provider registry.");
            }
        }

        var folder = File.ReadAllText(Path.Combine(cli, "ReportFolder.cs"));
        foreach (var field in new[] { "DeveloperPath", "TimeAnalysisPath", "ModuleManifestPath" })
        {
            if (folder.Contains(field, StringComparison.Ordinal))
            {
                throw new InvalidOperationException(
                    $"ReportFolder.cs still carries {field}; a module must not own a field on the core report type.");
            }
        }

        var autoRefresh = MethodBody(
            File.ReadAllText(Path.Combine(cli, "Program.cs")),
            "private static bool TryAutoGenerate");
        if (autoRefresh.Contains("TimeAnalysisGenerator", StringComparison.Ordinal))
        {
            throw new InvalidOperationException(
                "TryAutoGenerate names TimeAnalysisGenerator; automatic refresh must go through AnalysisModules.");
        }

        if (!autoRefresh.Contains("AnalysisModules.Production", StringComparison.Ordinal))
        {
            throw new InvalidOperationException(
                "TryAutoGenerate no longer drives refresh from the analysis module list.");
        }
    }

    /// <summary>
    ///   Text of one method, from its signature to the next member. Crude, but
    ///   enough to assert about one method without pinning the whole file:
    ///   `analyze` deliberately still calls TimeAnalysisGenerator directly, so
    ///   a file-wide check would forbid the wrong thing.
    /// </summary>
    private static string MethodBody(string source, string signature)
    {
        var start = source.IndexOf(signature, StringComparison.Ordinal);
        if (start < 0)
        {
            throw new InvalidOperationException($"{signature} was not found");
        }

        var next = source.IndexOf("\n    private ", start + signature.Length, StringComparison.Ordinal);
        return next < 0 ? source[start..] : source[start..next];
    }

    /// <summary>
    ///   A module that has no inputs in a folder is skipped rather than run,
    ///   which is what stops a report that never used a domain from having one
    ///   created for it.
    /// </summary>
    private static void AnalysisModulesSkipFoldersWithNoInputs(string root)
    {
        var folder = NewFolder(root, "no-inputs");
        Touch(folder, "report.json");

        foreach (var module in AnalysisModules.Production)
        {
            False(
                module.HasInputs(folder),
                $"{module.DisplayName} claimed inputs in a folder that has none");
        }

        Equal(
            AnalysisModules.Production.Select(module => module.Type).Distinct().Count(),
            AnalysisModules.Production.Count,
            "Two analysis modules registered for the same module type");
    }

    /// <summary>
    ///   Identity validation moved from ReportFolder.Load into the core
    ///   provider, and must still reject exactly what it rejected before:
    ///   an overlay or manifest belonging to another report.
    /// </summary>
    private static void CoreProviderStillRejectsAMismatchedSidecar(string root)
    {
        var folder = NewFolder(root, "identity");
        Touch(folder, "report.json");
        var provider = new CoreReportModuleProvider();
        var context = Context(folder);

        File.WriteAllText(
            Path.Combine(folder, CoreReportModuleProvider.DeveloperFileName),
            """{"schema_version":"1.1","report_id":"someone-elses-report"}""");
        Throws(
            () => provider.Validate(
                context,
                new(CoreReportModuleProvider.ModuleType, CoreReportModuleProvider.DeveloperFileName),
                Path.Combine(folder, CoreReportModuleProvider.DeveloperFileName)),
            "An overlay belonging to another report was accepted");

        File.WriteAllText(
            Path.Combine(folder, CoreReportModuleProvider.ManifestFileName),
            """{"schema_version":"0.1","report_id":"demo-report","scope_id":"another-scope"}""");
        Throws(
            () => provider.Validate(
                context,
                new(CoreReportModuleProvider.ModuleType, CoreReportModuleProvider.ManifestFileName),
                Path.Combine(folder, CoreReportModuleProvider.ManifestFileName)),
            "A manifest belonging to another scope was accepted");

        File.WriteAllText(
            Path.Combine(folder, CoreReportModuleProvider.ManifestFileName),
            """{"schema_version":"0.1","report_id":"demo-report","scope_id":"demo-scope"}""");
        provider.Validate(
            context,
            new(CoreReportModuleProvider.ModuleType, CoreReportModuleProvider.ManifestFileName),
            Path.Combine(folder, CoreReportModuleProvider.ManifestFileName));
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
        new(folder, "demo-scope", "demo-report", "1.1");

    private static string NewFolder(string root, string name)
    {
        var folder = Path.Combine(root, name);
        Directory.CreateDirectory(folder);
        return folder;
    }

    private static void Touch(string folder, string name) =>
        File.WriteAllText(Path.Combine(folder, name), "{}");

    private static void WriteValidDeveloper(string folder) =>
        File.WriteAllText(
            Path.Combine(folder, CoreReportModuleProvider.DeveloperFileName),
            """{"schema_version":"1.1","report_id":"demo-report"}""");

    private static void WriteValidManifest(string folder) =>
        File.WriteAllText(
            Path.Combine(folder, CoreReportModuleProvider.ManifestFileName),
            """{"schema_version":"0.1","report_id":"demo-report","scope_id":"demo-scope"}""");

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

        public IReadOnlyList<ReportModuleArtifact> Declare() =>
            [new(artifactType ?? type, fileName)];
    }
}
