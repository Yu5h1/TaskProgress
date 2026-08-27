// Turns provider declarations into the routes the local service should hold.
//
// Everything a provider is not trusted to decide lives here, so that one
// provider cannot be safer or laxer than another: whether a declared name is
// really a plain file inside the authorized folder, whether two providers
// collide, whether a file is present, and what URL it is served at.
//
// The escape rules are the reason this is a registry and not a helper on the
// provider. A report folder is the only directory the Launcher authorized; a
// name that walks out of it with `..`, an absolute path, or a link pointing
// elsewhere would serve a file the reader never granted. Those are rejected
// as programming errors, not reported as diagnostics — a provider is built-in
// code, not report data, so a bad declaration is a bug to fix rather than an
// input to tolerate.

namespace TaskProgress;

/// <summary>
///   A file that is present, validated by its owning module, and should be
///   served.
/// </summary>
internal sealed record ReportModuleRoute(
    string ModuleType,
    string FileName,
    string UrlPath,
    string FilePath);

/// <summary>
///   What the local service should hold for one scope: routes to register,
///   and the URLs of declared-but-absent files whose stale routes must go.
/// </summary>
internal sealed record ReportModuleRouteSet(
    IReadOnlyList<ReportModuleRoute> Present,
    IReadOnlyList<string> Absent);

/// <summary>
///   Composes report module providers and resolves their declarations against
///   one authorized report folder.
/// </summary>
internal static class ReportModuleRegistry
{
    /// <summary>
    ///   Builds the URL a scope's file is served at. Single source for the
    ///   report route shape, so providers and stale-route cleanup cannot
    ///   disagree about it.
    /// </summary>
    public static string BuildUrlPath(string scope, string fileName) =>
        $"/reports/{scope}/{fileName}";

    /// <summary>
    ///   Resolves every provider's declaration into routes, asking each
    ///   provider to vouch for the files it owns. Throws
    ///   <see cref="CliException"/> when two providers share a type or claim
    ///   the same file, when a declared name escapes the report folder by
    ///   separator, root, traversal or link, or when a present file fails its
    ///   owner's identity check.
    /// </summary>
    public static ReportModuleRouteSet Resolve(
        ReportModuleContext context,
        IReadOnlyList<IReportModuleProvider> providers)
    {
        var root = ResolveRealDirectory(context.DirectoryPath);
        var seenTypes = new HashSet<string>(StringComparer.Ordinal);
        var owners = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        var present = new List<ReportModuleRoute>();
        var absent = new List<string>();

        foreach (var provider in providers)
        {
            if (!seenTypes.Add(provider.Type))
            {
                throw new CliException($"模組 type 重複註冊：{provider.Type}");
            }

            foreach (var artifact in provider.Declare())
            {
                if (!string.Equals(artifact.ModuleType, provider.Type, StringComparison.Ordinal))
                {
                    throw new CliException(
                        $"模組 {provider.Type} 宣告了不屬於自己的 artifact type：{artifact.ModuleType}");
                }

                var fileName = RequirePlainFileName(provider.Type, artifact.FileName);
                if (owners.TryGetValue(fileName, out var owner))
                {
                    throw new CliException(
                        $"模組 {provider.Type} 與 {owner} 都宣告了 {fileName}；一個檔案只能有一個擁有者。");
                }

                owners.Add(fileName, provider.Type);
                var urlPath = BuildUrlPath(context.Scope, fileName);
                var candidate = Path.Combine(root, fileName);
                if (!File.Exists(candidate))
                {
                    absent.Add(urlPath);
                    continue;
                }

                var filePath = RequireInside(provider.Type, root, candidate);
                provider.Validate(context, artifact, filePath);
                present.Add(new ReportModuleRoute(provider.Type, fileName, urlPath, filePath));
            }
        }

        return new ReportModuleRouteSet(present, absent);
    }

    /// <summary>
    ///   Every file name the given providers may ever contribute. This is the
    ///   allowlist the local service needs, derived rather than maintained, so
    ///   a new pure data module does not mean editing a fixed list.
    /// </summary>
    public static IReadOnlyList<string> DeclaredFileNames(
        IReadOnlyList<IReportModuleProvider> providers) =>
        providers
            .SelectMany(provider => provider.Declare())
            .Select(artifact => artifact.FileName)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

    private static string RequirePlainFileName(string moduleType, string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            throw new CliException($"模組 {moduleType} 宣告了空的檔名。");
        }

        if (Path.IsPathRooted(fileName)
            || fileName.Contains('/', StringComparison.Ordinal)
            || fileName.Contains('\\', StringComparison.Ordinal)
            || !string.Equals(Path.GetFileName(fileName), fileName, StringComparison.Ordinal))
        {
            throw new CliException(
                $"模組 {moduleType} 宣告的 {fileName} 不是報告資料夾內的單一檔名。");
        }

        return fileName;
    }

    private static string RequireInside(string moduleType, string root, string candidate)
    {
        var resolved = ResolveRealFile(candidate);
        var relative = Path.GetRelativePath(root, resolved);
        if (Path.IsPathRooted(relative)
            || relative.Split(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar)
                .Any(segment => string.Equals(segment, "..", StringComparison.Ordinal)))
        {
            throw new CliException(
                $"模組 {moduleType} 的 {Path.GetFileName(candidate)} 指向報告資料夾之外。");
        }

        return resolved;
    }

    private static string ResolveRealDirectory(string path)
    {
        var full = Path.GetFullPath(path);
        var target = Directory.ResolveLinkTarget(full, returnFinalTarget: true);
        return Path.TrimEndingDirectorySeparator(
            target is null ? full : Path.GetFullPath(target.FullName));
    }

    private static string ResolveRealFile(string path)
    {
        var full = Path.GetFullPath(path);
        var target = File.ResolveLinkTarget(full, returnFinalTarget: true);
        return target is null ? full : Path.GetFullPath(target.FullName);
    }
}
