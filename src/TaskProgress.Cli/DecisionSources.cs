// Resolves decision-owned source references and Markdown heading locations without exposing a directory mount.
using System.Net;
using System.Text;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace TaskProgress;

internal static class DecisionSources
{
    private static readonly TimeSpan PatternTimeout = TimeSpan.FromMilliseconds(100);
    private static Match Match(string text, string pattern) => Regex.Match(text, pattern, RegexOptions.CultureInvariant, PatternTimeout);
    private static string Replace(string text, string pattern, string replacement) => Regex.Replace(text, pattern, replacement, RegexOptions.CultureInvariant, PatternTimeout);
    private static string Replace(string text, string pattern, MatchEvaluator replacement) => Regex.Replace(text, pattern, replacement, RegexOptions.CultureInvariant, PatternTimeout);
    private sealed class SourceText(string content)
    {
        internal string Content { get; } = content;
        internal Lazy<Dictionary<string, int>> Headings { get; } = new(() => DecisionSources.Headings(content));
    }

    internal static JsonObject InspectAll(string documentPath, JsonObject document)
    {
        var result = new JsonObject();
        var cache = new Dictionary<string, JsonObject>(StringComparer.Ordinal);
        var documents = new Dictionary<string, SourceText>(StringComparer.OrdinalIgnoreCase);
        foreach (var node in DecisionDocument.Array(document, "decisions"))
        {
            var decision = node!.AsObject();
            if (decision["source_ref"] is not JsonValue value) continue;
            var reference = value.GetValue<string>();
            if (!cache.TryGetValue(reference, out var source))
                cache[reference] = source = Read(documentPath, reference, false, documents);
            result[decision["id"]!.GetValue<string>()] = source.DeepClone();
        }
        return result;
    }

    internal static JsonObject Read(string documentPath, string reference, bool includeContent = false)
        => Read(documentPath, reference, includeContent, new Dictionary<string, SourceText>(StringComparer.OrdinalIgnoreCase));

    private static JsonObject Read(string documentPath, string reference, bool includeContent, Dictionary<string, SourceText> documents)
    {
        JsonObject Invalid(string reason) => new() { ["reference"] = reference, ["status"] = "invalid", ["message"] = "來源已失效：" + reason };
        try
        {
            var parts = reference.Split('#', 2);
            var relative = Uri.UnescapeDataString(parts[0]);
            var fragment = parts.Length == 2 ? Uri.UnescapeDataString(parts[1]) : "";
            if (string.IsNullOrWhiteSpace(relative) || Path.IsPathRooted(relative) || relative.Contains(':') || relative.Contains('?') || relative.Contains('\0'))
                return Invalid("需要相對檔案路徑");
            var directory = Path.GetDirectoryName(Path.GetFullPath(documentPath))!;
            var root = string.Equals(Path.GetFileName(directory), "decisions", StringComparison.OrdinalIgnoreCase)
                ? Path.GetDirectoryName(directory)! : directory;
            var target = Path.GetFullPath(Path.Combine(directory, relative.Replace('/', Path.DirectorySeparatorChar)));
            if (!target.StartsWith(root + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
                return Invalid("來源超出決策所屬目錄");
            var extension = Path.GetExtension(target).ToLowerInvariant();
            if (extension is not (".md" or ".markdown" or ".txt")) return Invalid("目前僅支援 Markdown 或文字文件");
            for (FileSystemInfo? part = new FileInfo(target); part is not null; part = part is FileInfo file ? file.Directory : ((DirectoryInfo)part).Parent)
                if (part.Exists && (part.Attributes & FileAttributes.ReparsePoint) != 0) return Invalid("不支援連結檔案或目錄");
            if (!File.Exists(target)) return Invalid("檔案不存在");
            if (!documents.TryGetValue(target, out var source))
            {
                using var stream = new FileStream(target, FileMode.Open, FileAccess.Read, FileShare.ReadWrite | FileShare.Delete);
                if (stream.Length > DecisionDocument.MaxBytes) return Invalid("來源文件超過 4 MiB");
                using var reader = new StreamReader(stream, new UTF8Encoding(false, true), true);
                var buffer = new char[DecisionDocument.MaxBytes + 1];
                var count = reader.ReadBlock(buffer, 0, buffer.Length);
                if (count > DecisionDocument.MaxBytes) return Invalid("來源文件超過 4 MiB");
                var text = new string(buffer, 0, count);
                if (Encoding.UTF8.GetByteCount(text) > DecisionDocument.MaxBytes) return Invalid("來源文件超過 4 MiB");
                documents[target] = source = new SourceText(text);
            }
            var line = 1;
            if (fragment.Length > 0)
            {
                if (extension == ".txt") return Invalid("文字文件不支援標題錨點");
                var headings = source.Headings.Value;
                if (!headings.TryGetValue(fragment, out line)) return Invalid("標題錨點不存在：" + fragment);
            }
            var result = new JsonObject { ["reference"] = reference, ["status"] = "available", ["line"] = line };
            if (includeContent) result["content"] = source.Content;
            return result;
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException or ArgumentException or NotSupportedException or DecoderFallbackException or RegexMatchTimeoutException)
        {
            return Invalid("無法讀取來源文件");
        }
    }

    /// <summary>Maps Markdown ATX and Setext headings to case-sensitive GitHub-style fragment IDs and one-based lines.</summary>
    internal static Dictionary<string, int> Headings(string text)
    {
        var result = new Dictionary<string, int>(StringComparer.Ordinal);
        var lines = text.Replace("\r\n", "\n").Split('\n');
        char fence = '\0';
        var fenceLength = 0;
        for (var i = 0; i < lines.Length; i++)
        {
            var marker = Match(lines[i], @"^ {0,3}(`{3,}|~{3,})(.*)$");
            if (marker.Success)
            {
                var run = marker.Groups[1].Value;
                if (fence == '\0') { fence = run[0]; fenceLength = run.Length; }
                else if (run[0] == fence && run.Length >= fenceLength && string.IsNullOrWhiteSpace(marker.Groups[2].Value)) fence = '\0';
                continue;
            }
            if (fence != '\0') continue;
            var atx = Match(lines[i], @"^ {0,3}#{1,6}(?:[ \t]+(.*)|$)");
            string heading;
            var line = i + 1;
            if (atx.Success) heading = Replace(atx.Groups[1].Value, @"[ \t]+#+[ \t]*$", "");
            else if (i + 1 < lines.Length && !string.IsNullOrWhiteSpace(lines[i]) && !lines[i].StartsWith("    ") &&
                Match(lines[i + 1], @"^ {0,3}(?:=+|-+)[ \t]*$").Success) heading = lines[i++];
            else continue;
            heading = HeadingText(heading);
            var slug = Replace(heading.Trim().ToLowerInvariant(), @"[^\p{L}\p{M}\p{N}\p{Pc}\-\s]", "");
            slug = Replace(slug, @"\s", "-");
            var unique = slug;
            for (var suffix = 1; result.ContainsKey(unique); suffix++) unique = $"{slug}-{suffix}";
            result[unique] = line;
        }
        return result;
    }

    private static string HeadingText(string heading)
    {
        var literals = new List<string>();
        var marker = Guid.NewGuid().ToString("N");
        string Preserve(string value) { literals.Add(value); return $"\uE000{marker}{literals.Count - 1}\uE001"; }
        heading = Replace(heading, @"(`+)(.*?)\1", match => Preserve(match.Groups[2].Value));
        heading = Replace(heading, @"\\([\p{P}\p{S}])", match => Preserve(match.Groups[1].Value));
        heading = Replace(heading, @"!?\[([^\]]*)\]\([^)]*\)", "$1");
        heading = Replace(heading, @"!?\[([^\]]*)\]\[[^\]]*\]", "$1");
        heading = Replace(heading, @"(?<!\w)_{1,2}(.+?)_{1,2}(?!\w)", "$1");
        heading = WebUtility.HtmlDecode(Replace(heading, "<[^>]*>", ""));
        return Replace(heading, "\uE000" + marker + "([0-9]+)\uE001", match => literals[int.Parse(match.Groups[1].Value)]);
    }
}
