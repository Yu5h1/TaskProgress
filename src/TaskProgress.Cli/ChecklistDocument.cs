// Parses, validates, updates, and atomically stores the structured Markdown Checklist contract.
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace TaskProgress;

internal enum ChecklistStatus
{
    Pending,
    Passed,
    Failed,
}

internal sealed record ChecklistCheck(
    ChecklistStatus Status,
    string Title,
    bool IsManual,
    string Action,
    string Expect,
    string? Reason,
    string? Observed,
    string? Resolved);

internal sealed record ChecklistWorkItem(
    int Id,
    ChecklistStatus Status,
    string Title,
    IReadOnlyList<int> DependsOn,
    string Outcome,
    IReadOnlyList<ChecklistCheck> Checks);

internal sealed record ChecklistManualResult(
    int WorkItemId,
    int CheckIndex,
    ChecklistStatus Status,
    string? Observed);

internal sealed class ChecklistDocument
{
    private static readonly Regex WorkItemPattern = new(
        @"^- \[(?<status> |x|X|!)\] \*\*(?<id>[1-9][0-9]*)\. (?<title>.+)\*\*$",
        RegexOptions.CultureInvariant);
    private static readonly Regex CheckPattern = new(
        @"^    - \[(?<status> |x|X|!)\] \*\*(?<title>.+)\*\*(?<manual> `\[manual\]`)?$",
        RegexOptions.CultureInvariant);
    private static readonly Regex RoundPattern = new(
        @"^Current round: `(?<round>[^`]+)`\.$",
        RegexOptions.CultureInvariant);

    private ChecklistDocument(
        string prefix,
        string roundIdentity,
        IReadOnlyList<ChecklistWorkItem> items,
        string newLine,
        bool hasFinalNewLine,
        bool hasUtf8Bom,
        string revision)
    {
        Prefix = prefix;
        RoundIdentity = roundIdentity;
        Items = items;
        NewLine = newLine;
        HasFinalNewLine = hasFinalNewLine;
        HasUtf8Bom = hasUtf8Bom;
        Revision = revision;
    }

    public string Prefix { get; }
    public string RoundIdentity { get; }
    public IReadOnlyList<ChecklistWorkItem> Items { get; }
    public string NewLine { get; }
    public bool HasFinalNewLine { get; }
    public bool HasUtf8Bom { get; }
    public string Revision { get; }

    public static ChecklistDocument Parse(byte[] source)
    {
        ArgumentNullException.ThrowIfNull(source);
        var hasBom = source.AsSpan().StartsWith(Encoding.UTF8.Preamble);
        var content = hasBom ? source.AsSpan(Encoding.UTF8.Preamble.Length) : source.AsSpan();
        string text;
        try
        {
            text = new UTF8Encoding(false, true).GetString(content);
        }
        catch (DecoderFallbackException error)
        {
            throw new CliException($"Checklist 必須是有效 UTF-8：{error.Message}");
        }

        var newLine = text.Contains("\r\n", StringComparison.Ordinal) ? "\r\n" : "\n";
        if (newLine == "\r\n" && text.Replace("\r\n", string.Empty, StringComparison.Ordinal).Contains('\n'))
        {
            throw new CliException("Checklist 不可混用 CRLF 與 LF 換行。");
        }

        var lines = text.Split(newLine, StringSplitOptions.None);
        var firstItem = Array.FindIndex(lines, line => WorkItemPattern.IsMatch(line));
        if (firstItem < 0)
        {
            throw new CliException("Checklist 找不到結構化 work item。");
        }

        var prefix = string.Join(newLine, lines[..firstItem]) + newLine;
        var roundMatch = lines[..firstItem]
            .Select(line => RoundPattern.Match(line))
            .FirstOrDefault(match => match.Success);
        if (roundMatch is null)
        {
            // A malformed round line is a different failure from an absent one:
            // reporting both as "missing" sends the reader hunting for a line
            // that is sitting right there. Match loosely on purpose so a casing
            // slip still lands on the offending line instead of the absent case.
            var candidate = Array.FindIndex(
                lines[..firstItem],
                line => line.StartsWith("Current round", StringComparison.OrdinalIgnoreCase));
            throw candidate < 0
                ? new CliException("Checklist 缺少 Current round plan anchor。")
                : FormatError(candidate, "Current round 必須是單一 backtick 包住的 plan anchor 並以半形 . 結尾");
        }

        var hasFinalNewLine = text.EndsWith(newLine, StringComparison.Ordinal);
        var lastLine = lines.Length;
        if (hasFinalNewLine) lastLine--;
        var items = new List<ChecklistWorkItem>();
        var ids = new HashSet<int>();
        var index = firstItem;
        while (index < lastLine)
        {
            var itemMatch = WorkItemPattern.Match(lines[index]);
            if (!itemMatch.Success)
            {
                throw FormatError(index, "預期 work item 標題");
            }
            var itemStatus = ParseStatus(itemMatch.Groups["status"].Value);
            var id = int.Parse(itemMatch.Groups["id"].Value, System.Globalization.CultureInfo.InvariantCulture);
            if (!ids.Add(id)) throw FormatError(index, $"work item ID {id} 重複");
            var title = RequireText(itemMatch.Groups["title"].Value, index, "work item title");
            index++;

            var dependsOn = ReadDependencies(lines, ref index, lastLine, id);
            var outcome = ReadField(lines, ref index, lastLine, "  Outcome: ", "Outcome");
            RequireLine(lines, ref index, lastLine, "  Checks:", "Checks");
            var checks = new List<ChecklistCheck>();
            while (index < lastLine && CheckPattern.IsMatch(lines[index]))
            {
                var checkMatch = CheckPattern.Match(lines[index]);
                var status = ParseStatus(checkMatch.Groups["status"].Value);
                var checkTitle = RequireText(checkMatch.Groups["title"].Value, index, "check title");
                var manual = checkMatch.Groups["manual"].Success;
                index++;
                var action = ReadField(lines, ref index, lastLine, "      - Action: ", "Action");
                var expect = ReadField(lines, ref index, lastLine, "      - Expect: ", "Expect");
                string? reason = null;
                string? observed = null;
                string? resolved = null;
                if (index < lastLine && lines[index].StartsWith("      - Reason: ", StringComparison.Ordinal))
                {
                    reason = ReadField(lines, ref index, lastLine, "      - Reason: ", "Reason");
                }
                if (index < lastLine && lines[index].StartsWith("      - Observed: ", StringComparison.Ordinal))
                {
                    observed = ReadField(lines, ref index, lastLine, "      - Observed: ", "Observed");
                }
                if (index < lastLine && lines[index].StartsWith("      - Resolved: ", StringComparison.Ordinal))
                {
                    resolved = ReadField(lines, ref index, lastLine, "      - Resolved: ", "Resolved");
                }
                if (manual && reason is null) throw FormatError(index, "manual check 缺少 Reason");
                if (!manual && reason is not null) throw FormatError(index, "Agent check 不可包含 Reason");
                if (status == ChecklistStatus.Failed && observed is null)
                {
                    throw FormatError(index, "失敗 check 缺少 Observed");
                }
                if (status == ChecklistStatus.Failed && resolved is not null)
                {
                    throw FormatError(index, "尚未通過的 check 不可包含 Resolved");
                }
                if (status == ChecklistStatus.Passed && (observed is null) != (resolved is null))
                {
                    throw FormatError(index, "已解決 check 必須同時包含 Observed 與 Resolved");
                }
                if (status == ChecklistStatus.Pending && (observed is not null || resolved is not null))
                {
                    throw FormatError(index, "尚未執行的 check 不可包含 Observed 或 Resolved");
                }
                checks.Add(new ChecklistCheck(status, checkTitle, manual, action, expect, reason, observed, resolved));
            }
            if (checks.Count == 0) throw FormatError(index, "work item 至少需要一個 check");

            var derived = DeriveStatus(checks);
            if (itemStatus != derived)
            {
                throw FormatError(index, $"work item {id} 狀態必須由 checks 衍生為 {Marker(derived)}");
            }
            items.Add(new ChecklistWorkItem(id, derived, title, dependsOn, outcome, checks));

            if (index < lastLine)
            {
                if (lines[index].Length != 0) throw FormatError(index, "work item 之間必須有空行");
                index++;
            }
        }
        if (items.Count == 0) throw new CliException("Checklist 至少需要一個 work item。");
        var knownIds = items.Select(item => item.Id).ToHashSet();
        foreach (var item in items)
        {
            var missing = item.DependsOn.FirstOrDefault(dependency => !knownIds.Contains(dependency));
            if (missing != 0)
            {
                throw new CliException($"Checklist work item {item.Id} 指向不存在的 dependency {missing}。");
            }
        }

        return new ChecklistDocument(
            prefix,
            roundMatch.Groups["round"].Value,
            items,
            newLine,
            hasFinalNewLine,
            hasBom,
            ComputeRevision(source));
    }

    public ChecklistDocument ApplyManualResults(IEnumerable<ChecklistManualResult> results)
    {
        ArgumentNullException.ThrowIfNull(results);
        var items = Items.Select(item => item with { Checks = item.Checks.ToArray() }).ToArray();
        var seen = new HashSet<(int, int)>();
        foreach (var result in results)
        {
            if (!seen.Add((result.WorkItemId, result.CheckIndex)))
            {
                throw new CliException("同一個 manual check 不可重複提交。");
            }
            var itemIndex = Array.FindIndex(items, item => item.Id == result.WorkItemId);
            if (itemIndex < 0) throw new CliException($"找不到 work item {result.WorkItemId}。");
            var checks = items[itemIndex].Checks.ToArray();
            if (result.CheckIndex < 0 || result.CheckIndex >= checks.Length)
            {
                throw new CliException($"work item {result.WorkItemId} 的 check index 無效。");
            }
            var check = checks[result.CheckIndex];
            // A manual result records the user's current verification judgment, so
            // it stays revisable through the full cycle after it is saved. Agent
            // results remain immutable execution evidence.
            if (!check.IsManual) throw new CliException("Agent check 在人類介面中是唯讀的。");
            var observed = string.IsNullOrWhiteSpace(result.Observed) ? null : result.Observed.Trim();
            if (result.Status == ChecklistStatus.Failed && observed is null)
            {
                throw new CliException("失敗 manual check 必須填寫 Observed。");
            }
            if (result.Status != ChecklistStatus.Failed && observed is not null)
            {
                throw new CliException("只有失敗 manual check 可以填寫 Observed。");
            }
            checks[result.CheckIndex] = check with
            {
                Status = result.Status,
                Observed = observed,
                Resolved = null,
            };
            items[itemIndex] = items[itemIndex] with
            {
                Checks = checks,
                Status = DeriveStatus(checks),
            };
        }
        return new ChecklistDocument(
            Prefix,
            RoundIdentity,
            items,
            NewLine,
            HasFinalNewLine,
            HasUtf8Bom,
            Revision);
    }

    public ChecklistDocument ResolveFailedCheck(int workItemId, int checkIndex, string resolved)
    {
        if (string.IsNullOrWhiteSpace(resolved))
        {
            throw new CliException("重新驗證通過時必須填寫 Resolved。");
        }
        var items = Items.Select(item => item with { Checks = item.Checks.ToArray() }).ToArray();
        var itemIndex = Array.FindIndex(items, item => item.Id == workItemId);
        if (itemIndex < 0) throw new CliException($"找不到 work item {workItemId}。");
        var checks = items[itemIndex].Checks.ToArray();
        if (checkIndex < 0 || checkIndex >= checks.Length)
        {
            throw new CliException($"work item {workItemId} 的 check index 無效。");
        }
        var check = checks[checkIndex];
        if (check.Status != ChecklistStatus.Failed || check.Observed is null)
        {
            throw new CliException("只有保留 Observed 的失敗 check 可以標記為已解決。");
        }
        checks[checkIndex] = check with
        {
            Status = ChecklistStatus.Passed,
            Resolved = resolved.Trim(),
        };
        items[itemIndex] = items[itemIndex] with
        {
            Checks = checks,
            Status = DeriveStatus(checks),
        };
        return new ChecklistDocument(
            Prefix,
            RoundIdentity,
            items,
            NewLine,
            HasFinalNewLine,
            HasUtf8Bom,
            Revision);
    }

    public byte[] Serialize()
    {
        var builder = new StringBuilder(Prefix);
        for (var itemIndex = 0; itemIndex < Items.Count; itemIndex++)
        {
            var item = Items[itemIndex];
            builder.Append("- [").Append(Marker(item.Status)).Append("] **")
                .Append(item.Id).Append(". ").Append(item.Title).Append("**").Append(NewLine);
            if (item.DependsOn.Count > 0)
            {
                builder.Append("  Depends on: ")
                    .AppendJoin(", ", item.DependsOn)
                    .Append('.').Append(NewLine);
            }
            builder.Append("  Outcome: ").Append(item.Outcome).Append(NewLine);
            builder.Append("  Checks:").Append(NewLine);
            foreach (var check in item.Checks)
            {
                builder.Append("    - [").Append(Marker(check.Status)).Append("] **")
                    .Append(check.Title).Append("**");
                if (check.IsManual) builder.Append(" `[manual]`");
                builder.Append(NewLine);
                builder.Append("      - Action: ").Append(check.Action).Append(NewLine);
                builder.Append("      - Expect: ").Append(check.Expect).Append(NewLine);
                if (check.Reason is not null)
                {
                    builder.Append("      - Reason: ").Append(check.Reason).Append(NewLine);
                }
                if (check.Observed is not null)
                {
                    builder.Append("      - Observed: ").Append(check.Observed).Append(NewLine);
                }
                if (check.Resolved is not null)
                {
                    builder.Append("      - Resolved: ").Append(check.Resolved).Append(NewLine);
                }
            }
            if (itemIndex + 1 < Items.Count) builder.Append(NewLine);
        }
        if (!HasFinalNewLine && builder.Length >= NewLine.Length)
        {
            builder.Length -= NewLine.Length;
        }

        var content = new UTF8Encoding(false).GetBytes(builder.ToString());
        if (!HasUtf8Bom) return content;
        var result = new byte[Encoding.UTF8.Preamble.Length + content.Length];
        Encoding.UTF8.Preamble.CopyTo(result.AsSpan());
        content.CopyTo(result, Encoding.UTF8.Preamble.Length);
        return result;
    }

    public static string ComputeRevision(byte[] source) =>
        Convert.ToHexString(SHA256.HashData(source)).ToLowerInvariant();

    private static ChecklistStatus DeriveStatus(IReadOnlyList<ChecklistCheck> checks)
    {
        if (checks.Any(check => check.Status == ChecklistStatus.Failed)) return ChecklistStatus.Failed;
        return checks.All(check => check.Status == ChecklistStatus.Passed)
            ? ChecklistStatus.Passed
            : ChecklistStatus.Pending;
    }

    private static string Marker(ChecklistStatus status) => status switch
    {
        ChecklistStatus.Pending => " ",
        ChecklistStatus.Passed => "x",
        ChecklistStatus.Failed => "!",
        _ => throw new ArgumentOutOfRangeException(nameof(status)),
    };

    private static ChecklistStatus ParseStatus(string marker) => marker switch
    {
        " " => ChecklistStatus.Pending,
        "x" or "X" => ChecklistStatus.Passed,
        "!" => ChecklistStatus.Failed,
        _ => throw new CliException($"不支援的 checklist marker：{marker}"),
    };

    private static string ReadField(
        string[] lines,
        ref int index,
        int lastLine,
        string prefix,
        string name)
    {
        if (index >= lastLine || !lines[index].StartsWith(prefix, StringComparison.Ordinal))
        {
            throw FormatError(index, $"缺少 {name}");
        }
        var value = RequireText(lines[index][prefix.Length..], index, name);
        index++;
        return value;
    }

    private static IReadOnlyList<int> ReadDependencies(
        string[] lines,
        ref int index,
        int lastLine,
        int workItemId)
    {
        const string prefix = "  Depends on: ";
        if (index >= lastLine || !lines[index].StartsWith(prefix, StringComparison.Ordinal))
        {
            return [];
        }
        var lineIndex = index;
        var source = lines[index][prefix.Length..].Trim();
        index++;
        if (!source.EndsWith(".", StringComparison.Ordinal))
        {
            throw FormatError(lineIndex, "Depends on 必須以句點結尾");
        }
        var dependencies = new List<int>();
        foreach (var token in source[..^1].Split(',', StringSplitOptions.TrimEntries))
        {
            if (!int.TryParse(
                    token,
                    System.Globalization.NumberStyles.None,
                    System.Globalization.CultureInfo.InvariantCulture,
                    out var dependency)
                || dependency <= 0)
            {
                throw FormatError(lineIndex, "Depends on 必須包含正整數 ID");
            }
            if (dependency == workItemId)
            {
                throw FormatError(lineIndex, "work item 不可依賴自己");
            }
            if (dependencies.Contains(dependency))
            {
                throw FormatError(lineIndex, $"dependency {dependency} 重複");
            }
            dependencies.Add(dependency);
        }
        if (dependencies.Count == 0)
        {
            throw FormatError(lineIndex, "Depends on 不可空白");
        }
        return dependencies;
    }

    private static void RequireLine(
        string[] lines,
        ref int index,
        int lastLine,
        string expected,
        string name)
    {
        if (index >= lastLine || !string.Equals(lines[index], expected, StringComparison.Ordinal))
        {
            throw FormatError(index, $"缺少 {name}");
        }
        index++;
    }

    private static string RequireText(string value, int index, string name)
    {
        if (string.IsNullOrWhiteSpace(value)) throw FormatError(index, $"{name} 不可空白");
        return value.Trim();
    }

    private static CliException FormatError(int zeroBasedLine, string message) =>
        new($"Checklist 第 {zeroBasedLine + 1} 行格式錯誤：{message}。");
}

internal sealed class ChecklistDocumentStore
{
    public ChecklistDocument Load(string path)
    {
        var fullPath = ValidatePath(path);
        return ChecklistDocument.Parse(File.ReadAllBytes(fullPath));
    }

    public void Save(string path, string expectedRevision, ChecklistDocument updated)
    {
        var fullPath = ValidatePath(path);
        var current = File.ReadAllBytes(fullPath);
        if (!string.Equals(
                ChecklistDocument.ComputeRevision(current),
                expectedRevision,
                StringComparison.Ordinal))
        {
            throw new CliException("Checklist 已被外部修改；草稿尚未覆寫來源檔案。");
        }

        var bytes = updated.Serialize();
        var directory = Path.GetDirectoryName(fullPath)
            ?? throw new CliException("Checklist 路徑沒有父目錄。");
        var temporary = Path.Combine(
            directory,
            $".{Path.GetFileName(fullPath)}.{Guid.NewGuid():N}.tmp");
        try
        {
            File.WriteAllBytes(temporary, bytes);
            File.Replace(temporary, fullPath, null);
        }
        finally
        {
            if (File.Exists(temporary)) File.Delete(temporary);
        }
    }

    public static string ValidatePath(string path)
    {
        if (string.IsNullOrWhiteSpace(path)) throw new CliException("請指定 .checklist 檔案。");
        var fullPath = Path.GetFullPath(path);
        if (!File.Exists(fullPath)) throw new CliException($"找不到 Checklist：{fullPath}");
        if (!string.Equals(Path.GetExtension(fullPath), ChecklistFileRegistration.FileExtension, StringComparison.OrdinalIgnoreCase))
        {
            throw new CliException("Checklist 必須是 .checklist 檔案。");
        }
        return fullPath;
    }
}
