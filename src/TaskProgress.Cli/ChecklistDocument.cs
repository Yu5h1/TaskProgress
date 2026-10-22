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

/// <summary>
///   Registered permission tags: untagged checks belong to the executor, manual
///   checks to the user, acceptance checks to an agent session other than the executor.
/// </summary>
internal enum ChecklistTag
{
    None,
    Manual,
    Acceptance,
}

internal enum ChecklistRejectReason
{
    Implementation,
    Condition,
}

/// <summary>
///   Who recorded a tagged result, when, and against which content. A result
///   whose fingerprint no longer matches its check's Action and Expect is void,
///   and so is a pass recorded before the bound item's latest release.
/// </summary>
internal sealed record ChecklistRecord(
    string Recorder,
    DateTimeOffset At,
    string Fingerprint,
    ChecklistRejectReason? RejectReason = null,
    int ConditionCount = 0);

internal enum ChecklistResultValidity
{
    Valid,
    NoRecorder,
    FingerprintMismatch,
    PassedBeforeRelease,
}

internal sealed record ChecklistCheck(
    ChecklistStatus Status,
    string Title,
    ChecklistTag Tag,
    string Action,
    string Expect,
    string? Reason,
    string? Observed,
    string? Resolved,
    ChecklistRecord? Record = null)
{
    public bool IsManual => Tag == ChecklistTag.Manual;
    public bool IsAcceptance => Tag == ChecklistTag.Acceptance;
    public bool IsTagged => Tag != ChecklistTag.None;

    /// <summary>Source line for messages only; it is not part of the check's identity.</summary>
    public int Line { get; init; }

    public bool Equals(ChecklistCheck? other) =>
        other is not null
        && Status == other.Status && Title == other.Title && Tag == other.Tag
        && Action == other.Action && Expect == other.Expect && Reason == other.Reason
        && Observed == other.Observed && Resolved == other.Resolved && Equals(Record, other.Record);

    public override int GetHashCode() =>
        HashCode.Combine(Status, Title, Tag, Action, Expect, Reason, Observed, HashCode.Combine(Resolved, Record));
}

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
    string? Observed,
    string? Resolved = null,
    ChecklistRejectReason? RejectReason = null);

/// <summary>
///   The party writing tagged results. The user may record any tagged check;
///   an agent session may record acceptance checks it did not execute and may
///   only fail manual checks.
/// </summary>
internal sealed record ChecklistWriter(
    string Recorder,
    bool IsUser,
    string? SessionId,
    IReadOnlySet<string> ExecutorSessions,
    DateTimeOffset? ReleasedAt = null)
{
    public static ChecklistWriter User { get; } = new("user", true, null, new HashSet<string>());
}

internal sealed class ChecklistDocument
{
    private static readonly Regex WorkItemPattern = new(
        @"^- \[(?<status> |x|X|!)\] \*\*(?<id>[1-9][0-9]*)\. (?<title>.+)\*\*$",
        RegexOptions.CultureInvariant);
    private static readonly Regex CheckPattern = new(
        @"^    - \[(?<status> |x|X|!)\] \*\*(?<title>.+)\*\*(?: `\[(?<tag>manual|acceptance)\]`)?$",
        RegexOptions.CultureInvariant);
    private static readonly Regex RecordPattern = new(
        @"^(?<recorder>[^;]+); at=(?<at>[^;]+); fp=(?<fp>[0-9a-f]{12})(?:; reason=(?<reason>implementation|condition))?(?:; count=(?<count>[1-9][0-9]*))?$",
        RegexOptions.CultureInvariant);
    private const string RecordPrefix = "      - Recorded: ";
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
                var checkLine = index;
                var status = ParseStatus(checkMatch.Groups["status"].Value);
                var checkTitle = RequireText(checkMatch.Groups["title"].Value, index, "check title");
                var tag = checkMatch.Groups["tag"].Value switch
                {
                    "manual" => ChecklistTag.Manual,
                    "acceptance" => ChecklistTag.Acceptance,
                    _ => ChecklistTag.None,
                };
                var manual = tag == ChecklistTag.Manual;
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
                ChecklistRecord? record = null;
                if (index < lastLine && lines[index].StartsWith(RecordPrefix, StringComparison.Ordinal))
                {
                    var recordLine = index;
                    record = ParseRecord(ReadField(lines, ref index, lastLine, RecordPrefix, "Recorded"), recordLine);
                    if (tag == ChecklistTag.None) throw FormatError(recordLine, "不標的 check 不可包含 Recorded");
                    if (status == ChecklistStatus.Pending) throw FormatError(recordLine, "尚未執行的 check 不可包含 Recorded");
                    var rejection = tag == ChecklistTag.Acceptance && status == ChecklistStatus.Failed;
                    if (rejection != (record.RejectReason is not null))
                    {
                        throw FormatError(recordLine, rejection
                            ? "失敗的 acceptance check 必須記錄 reason"
                            : "只有失敗的 acceptance check 可以記錄 reason");
                    }
                }
                if (manual && reason is null) throw FormatError(index, "manual check 缺少 Reason");
                if (!manual && reason is not null) throw FormatError(index, "只有 manual check 可以包含 Reason");
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
                checks.Add(new ChecklistCheck(status, checkTitle, tag, action, expect, reason, observed, resolved, record)
                {
                    Line = checkLine,
                });
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

    public ChecklistDocument ApplyManualResults(IEnumerable<ChecklistManualResult> results) =>
        ApplyTaggedResults(results, ChecklistWriter.User, DateTimeOffset.UtcNow);

    /// <summary>
    ///   Writes tagged results under the writer's permission. Every non-pending
    ///   result is stamped with its recorder, time and content fingerprint;
    ///   writing a pending result clears the earlier one.
    /// </summary>
    public ChecklistDocument ApplyTaggedResults(
        IEnumerable<ChecklistManualResult> results, ChecklistWriter writer, DateTimeOffset at)
    {
        ArgumentNullException.ThrowIfNull(results);
        ArgumentNullException.ThrowIfNull(writer);
        var items = Items.Select(item => item with { Checks = item.Checks.ToArray() }).ToArray();
        var seen = new HashSet<(int, int)>();
        foreach (var result in results)
        {
            if (!seen.Add((result.WorkItemId, result.CheckIndex)))
            {
                throw new CliException("同一個 check 不可重複提交。");
            }
            var itemIndex = Array.FindIndex(items, item => item.Id == result.WorkItemId);
            if (itemIndex < 0) throw new CliException($"找不到 work item {result.WorkItemId}。");
            var checks = items[itemIndex].Checks.ToArray();
            if (result.CheckIndex < 0 || result.CheckIndex >= checks.Length)
            {
                throw new CliException($"work item {result.WorkItemId} 的 check index 無效。");
            }
            var check = checks[result.CheckIndex];
            if (!check.IsTagged) throw new CliException("不標的 check 屬於執行者，在這個介面中是唯讀的。");
            if (result.Status != ChecklistStatus.Pending)
            {
                var current = new ChecklistDocument(Prefix, RoundIdentity, items, NewLine, HasFinalNewLine, HasUtf8Bom, Revision);
                if (!current.UntaggedComplete)
                {
                    throw new CliException("執行者的檢查尚未全部完成，標籤檢查還不能記錄結果。");
                }
                if (check.IsManual && !current.IsAcceptanceComplete(writer.ReleasedAt))
                {
                    throw new CliException("[acceptance] 尚未全部通過，[manual] 還不能記錄結果。");
                }
            }
            checks[result.CheckIndex] = Record(check, result, writer, at);
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

    private static ChecklistCheck Record(
        ChecklistCheck check, ChecklistManualResult result, ChecklistWriter writer, DateTimeOffset at)
    {
        var observed = string.IsNullOrWhiteSpace(result.Observed) ? null : result.Observed.Trim();
        var resolved = string.IsNullOrWhiteSpace(result.Resolved) ? null : result.Resolved.Trim();
        if (!writer.IsUser)
        {
            if (writer.SessionId is null) throw new CliException("agent 寫入標籤檢查必須帶 sessionId。");
            if (check.IsManual && result.Status != ChecklistStatus.Failed)
            {
                throw new CliException("agent 只能把 [manual] 標成 [!]，[x] 只有使用者能標。");
            }
            if (check.IsAcceptance && writer.ExecutorSessions.Contains(writer.SessionId))
            {
                throw new CliException("驗收者不能是執行過這個子項的 session。");
            }
        }
        if (result.Status == ChecklistStatus.Pending)
        {
            if (observed is not null || resolved is not null || result.RejectReason is not null)
            {
                throw new CliException("清除結果時不可附帶 Observed、Resolved 或 reason。");
            }
            return check with { Status = ChecklistStatus.Pending, Observed = null, Resolved = null, Record = null };
        }
        if (result.Status == ChecklistStatus.Failed)
        {
            if (observed is null) throw new CliException("標成 [!] 必須填寫 Observed。");
            if (resolved is not null) throw new CliException("標成 [!] 時不可填寫 Resolved。");
            if (check.IsAcceptance != (result.RejectReason is not null))
            {
                throw new CliException(check.IsAcceptance
                    ? "[acceptance] 標成 [!] 必須選擇原因：實作不符或條件不符。"
                    : "只有 [acceptance] 可以選擇不通過的原因。");
            }
            var count = result.RejectReason == ChecklistRejectReason.Condition
                ? (check.Record?.RejectReason == ChecklistRejectReason.Condition ? check.Record.ConditionCount : 0) + 1
                : 0;
            return check with
            {
                Status = ChecklistStatus.Failed,
                Observed = observed,
                Resolved = null,
                Record = new ChecklistRecord(writer.Recorder, at, Fingerprint(check), result.RejectReason, count),
            };
        }
        if (result.RejectReason is not null) throw new CliException("通過時不可選擇不通過的原因。");
        var reverified = !writer.IsUser && check.IsAcceptance && check.Status == ChecklistStatus.Failed;
        if (reverified && resolved is null)
        {
            throw new CliException("[acceptance] 由 [!] 重驗通過時必須填寫 Resolved，並保留原本的 Observed。");
        }
        if (!reverified && (observed is not null || resolved is not null))
        {
            throw new CliException("通過時只有重驗 [acceptance] 可以附帶 Resolved。");
        }
        return check with
        {
            Status = ChecklistStatus.Passed,
            Observed = reverified ? check.Observed : null,
            Resolved = reverified ? resolved : null,
            Record = new ChecklistRecord(writer.Recorder, at, Fingerprint(check)),
        };
    }

    /// <summary>Hashes the parts of a check that define what its result attests to.</summary>
    public static string Fingerprint(ChecklistCheck check) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(check.Action + "\n" + check.Expect)))
            .ToLowerInvariant()[..12];

    /// <summary>
    ///   <paramref name="releasedAt"/> is the bound item's latest release: work
    ///   released after a pass was recorded voids that pass. Failures stay, so a
    ///   release can still mark them fixed.
    /// </summary>
    public static ChecklistResultValidity Validity(ChecklistCheck check, DateTimeOffset? releasedAt = null)
    {
        if (!check.IsTagged || check.Status == ChecklistStatus.Pending) return ChecklistResultValidity.Valid;
        if (check.Record is null) return ChecklistResultValidity.NoRecorder;
        if (!string.Equals(check.Record.Fingerprint, Fingerprint(check), StringComparison.Ordinal))
            return ChecklistResultValidity.FingerprintMismatch;
        return check.Status == ChecklistStatus.Passed && releasedAt is { } released && check.Record.At < released
            ? ChecklistResultValidity.PassedBeforeRelease
            : ChecklistResultValidity.Valid;
    }

    /// <summary>A tagged result that is void counts as not yet recorded.</summary>
    public static ChecklistStatus EffectiveStatus(ChecklistCheck check, DateTimeOffset? releasedAt = null) =>
        Validity(check, releasedAt) == ChecklistResultValidity.Valid ? check.Status : ChecklistStatus.Pending;

    private IEnumerable<ChecklistCheck> AllChecks => Items.SelectMany(item => item.Checks);

    public bool UntaggedComplete =>
        AllChecks.Where(check => !check.IsTagged).All(check => check.Status == ChecklistStatus.Passed);

    public bool AcceptanceComplete => IsAcceptanceComplete(null);

    public bool IsAcceptanceComplete(DateTimeOffset? releasedAt) =>
        AllChecks.Where(check => check.IsAcceptance).All(check => EffectiveStatus(check, releasedAt) == ChecklistStatus.Passed);

    public bool HasAcceptance => AllChecks.Any(check => check.IsAcceptance);

    /// <summary>
    ///   Problems that do not stop the document from opening but fail
    ///   <c>checklist validate</c>. Ordering is enforced when a result is
    ///   written, not here, so results recorded before the rule existed stay valid.
    /// </summary>
    public IReadOnlyList<string> Issues() =>
        AllChecks
            .Where(check => check.IsTagged && check.Status != ChecklistStatus.Pending && check.Record is null)
            .Select(check => $"第 {check.Line + 1} 行：標籤檢查的結果沒有記錄者；新規則前的舊結果請執行 task-progress checklist migrate <file>，否則請重新記錄。")
            .ToArray();

    /// <summary>
    ///   Marks every recorded-before-the-rules tagged result as legacy so it keeps
    ///   counting. Only an explicit migrate command calls this; reading never does.
    /// </summary>
    public ChecklistDocument MigrateLegacyResults(DateTimeOffset at, out int migrated)
    {
        var count = 0;
        var items = Items.Select(item => item with
        {
            Checks = item.Checks.Select(check =>
            {
                if (!check.IsTagged || check.Status == ChecklistStatus.Pending || check.Record is not null) return check;
                count++;
                var reason = check.IsAcceptance && check.Status == ChecklistStatus.Failed
                    ? ChecklistRejectReason.Implementation
                    : (ChecklistRejectReason?)null;
                return check with { Record = new ChecklistRecord("legacy", at, Fingerprint(check), reason) };
            }).ToArray(),
        }).ToArray();
        migrated = count;
        return new ChecklistDocument(Prefix, RoundIdentity, items, NewLine, HasFinalNewLine, HasUtf8Bom, Revision);
    }

    private static ChecklistRecord ParseRecord(string value, int line)
    {
        var match = RecordPattern.Match(value);
        if (!match.Success
            || !DateTimeOffset.TryParse(
                match.Groups["at"].Value,
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.RoundtripKind,
                out var at))
        {
            throw FormatError(line, "Recorded 必須是「記錄者; at=時間; fp=指紋」格式");
        }
        ChecklistRejectReason? reason = match.Groups["reason"].Value switch
        {
            "implementation" => ChecklistRejectReason.Implementation,
            "condition" => ChecklistRejectReason.Condition,
            _ => null,
        };
        var count = match.Groups["count"].Success
            ? int.Parse(match.Groups["count"].Value, System.Globalization.CultureInfo.InvariantCulture)
            : 0;
        if ((reason == ChecklistRejectReason.Condition) != (count > 0))
        {
            throw FormatError(line, "count 只能、而且必須隨 reason=condition 記錄");
        }
        return new ChecklistRecord(match.Groups["recorder"].Value.Trim(), at, match.Groups["fp"].Value, reason, count);
    }

    private static string FormatRecord(ChecklistRecord record)
    {
        var builder = new StringBuilder(record.Recorder)
            .Append("; at=").Append(record.At.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ", System.Globalization.CultureInfo.InvariantCulture))
            .Append("; fp=").Append(record.Fingerprint);
        if (record.RejectReason is { } reason)
        {
            builder.Append("; reason=").Append(reason == ChecklistRejectReason.Condition ? "condition" : "implementation");
        }
        if (record.ConditionCount > 0) builder.Append("; count=").Append(record.ConditionCount);
        return builder.ToString();
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
                if (check.IsAcceptance) builder.Append(" `[acceptance]`");
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
                if (check.Record is not null)
                {
                    builder.Append(RecordPrefix).Append(FormatRecord(check.Record)).Append(NewLine);
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
        using var writeMutex = OpenWriteMutex(fullPath);
        var acquired = false;
        try
        {
            try
            {
                acquired = writeMutex.WaitOne(TimeSpan.FromSeconds(10));
            }
            catch (AbandonedMutexException)
            {
                acquired = true;
            }
            if (!acquired) throw new CliException("Checklist 正由另一個程序寫入；請稍後重試。");
            SaveLocked(fullPath, expectedRevision, updated);
        }
        finally
        {
            if (acquired) writeMutex.ReleaseMutex();
        }
    }

    /// <summary>
    ///   Coordinates store writers across processes and sessions for the same normalized Windows path.
    ///   External editors that do not use this mutex remain subject to revision detection only.
    /// </summary>
    internal static Mutex OpenWriteMutex(string path)
    {
        var identity = Path.GetFullPath(path).ToUpperInvariant();
        var digest = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(identity)));
        return new Mutex(false, $"Global\\TaskProgress.Checklist.{digest}");
    }

    private static void SaveLocked(string fullPath, string expectedRevision, ChecklistDocument updated)
    {
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
