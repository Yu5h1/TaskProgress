using System.Text.RegularExpressions;

namespace TaskProgress;

internal static partial class ScopeId
{
    public static string FromFolderName(string folder)
    {
        if (string.IsNullOrWhiteSpace(folder))
        {
            throw new CliException("report folder 不可為空。 ");
        }

        var folderName = new DirectoryInfo(Path.GetFullPath(folder)).Name;
        var separated = AcronymBoundary().Replace(folderName, "$1-$2");
        separated = LowercaseBoundary().Replace(separated, "$1-$2");
        var scope = InvalidCharacters().Replace(separated, "-")
            .Trim('-')
            .ToLowerInvariant();

        try
        {
            return Validate(scope);
        }
        catch (CliException)
        {
            throw new CliException(
                $"無法從資料夾名稱「{folderName}」產生有效 scope；請改用 scope add <scope> <report-folder>。 ");
        }
    }

    public static string Validate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value) || value.Length > 100 || !ScopePattern().IsMatch(value))
        {
            throw new CliException(
                "scope 必須是小寫英數字組成的穩定 ID，可使用點、底線或連字號。");
        }

        return value;
    }

    [GeneratedRegex("^[a-z0-9]+(?:[._-][a-z0-9]+)*$", RegexOptions.CultureInvariant)]
    private static partial Regex ScopePattern();

    [GeneratedRegex("([A-Z]+)([A-Z][a-z])", RegexOptions.CultureInvariant)]
    private static partial Regex AcronymBoundary();

    [GeneratedRegex("([a-z0-9])([A-Z])", RegexOptions.CultureInvariant)]
    private static partial Regex LowercaseBoundary();

    [GeneratedRegex("[^A-Za-z0-9]+", RegexOptions.CultureInvariant)]
    private static partial Regex InvalidCharacters();
}
