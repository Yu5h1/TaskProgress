---
name: checklist-round
description: Split a settled spec into a per-task `.checklist` file, shape its work items and nested checks — untagged for the executor, `[acceptance]` for an independent acceptance context, `[manual]` for the user — run one round to completion, and record tagged results through the CLI. Use when the project carries a `checklists/` directory and a task's spec has been accepted.
---

# Checklist Round

TaskProgress owns the `.checklist` document: `ChecklistDocument` parses and writes it, and
`task-progress.exe checklist <file>` opens one file at a time. This skill is the written contract
that implementation follows. Markdown stays the single source of truth.

## Split the checklist with the user

Do not create a checklist from issues, review findings, recommendations, or unresolved decisions.
Create it only after the user accepts a durable spec; keep anything still awaiting a decision in
the issue or design discussion, and send work that fits in one edit straight to Execute.

A project opts in by carrying a `checklists/` directory at its root. Each
independently executable task owns one direct child named
`checklists/<task-id>.checklist`; use the stable task ID from its canonical route
or assignment, and do not create an index merely to find the file. Without that
directory, skip all of this. One checklist per item holds the executor's checks
and, when the item needs them, `[acceptance]` checks for an independent acceptance
context (task-progress-items § Independent acceptance) and
`[manual]` checks for the user (§ Tagged checks). The user checks a screen in seconds where the agent spends a round
of tool calls that then sit in context for the rest of the session, so do not
drive a page to judge what the user can see. A standing instruction to run
everything makes the agent the executor for that scope.

Only project development work belongs in the checklist: product behavior, code,
configuration, schemas, migrations, and the verification needed to prove those
changes against the spec. Keep repository administration and record maintenance
out of it — commits, staging, pushes, handoff/plan/report updates, recording
results, and checks that validate only those status artifacts are normal
closeout work, never checklist items.

The current task's `.checklist` file is nevertheless part of the development commit's evidence.
When a commit implements, verifies, fails, or supersedes a checklist item, stage
the corresponding `checklists/<task-id>.checklist` state change in that same
commit. Before committing, compare the staged development diff with the current
round and include every affected checklist marker or nested verification result.
Do not create a later checklist-only commit merely to mark work already carried
by an earlier implementation commit. This co-commit rule changes how the file is
versioned; it does not make "update the checklist" a checklist item.

### Document header

Every `.checklist` file opens with the same three lines, in this order:

```markdown
# <Task title> Checklist

Current round: `<path>#<anchor>`.
```

`Current round` is the round identity: exactly one backtick-quoted anchor naming
the settled spec this round implements, on a line closed by a half-width `.`.
Two anchors joined by prose, or a full-width `。`, fail the whole document —
not just that line. The anchor names a section, so it carries the spec heading's
`#<fragment>` rather than a bare file path.

The file's own prose follows after a blank line, before the first work item.
The file is UTF-8 and uses one newline style throughout; CRLF and LF must not be
mixed.

### Shape

Two layers. The outer list contains work items; nested checks prove each item's
outcome. A work item has a stable numeric ID, a title, and one observable
`Outcome`. Its marker is read-only and derived from its checks. Do not add a
second outer `Verification` field that repeats the nested checks. When execution
order is not obvious, place optional `  Depends on: 1, 2.` directly after the
work-item title; every referenced ID belongs to another item in the same round.

```markdown
- [ ] **1. Stop serving the standalone editor**
  Outcome: The Viewer opens and saves without requesting a retired editor path.
  Checks:
    - [ ] **Source contract**
      - Action: Run the focused loader and host tests.
      - Expect: All focused tests pass and no source references editor.html.
    - [x] **Resolved environment check**
      - Action: Run the focused build after the environment intervention.
      - Expect: The build completes successfully.
      - Observed: The initial run could not reach the required package source.
      - Resolved: The authorized package restore completed and the focused build passed.
```

`Action` covers commands, URLs, and hands-on steps; `Expect` gives the observable
pass condition. Tags are permission labels and only registered tags parse:
untagged checks belong to the executor; `[manual]` to the user, for what needs the
user's device, environment, protected data, or direct UX judgment, with a short
`Reason`; `[acceptance]` to an agent session other than the executor (§ Tagged
checks). "The user is faster" is not a capability reason. Do not use separate
`Entry`, `Verification`, `By`, or `Why not agent` fields; they duplicate this
structure. Every check field is a nested Markdown list entry using the exact
`      - Field: value` shape. This applies to required `Action` and `Expect` and
optional `Reason`, `Observed`, `Resolved` and `Recorded`.

Those fields are ordered, not a set: `Action`, then `Expect`, then whichever of
`Reason`, `Observed`, `Resolved` and `Recorded` apply, in that order. The parser reads the
next line by position, so a `Reason` placed between `Action` and `Expect` is
rejected as a missing `Expect` rather than as a misplaced `Reason`. One blank
line separates consecutive work items, and `Depends on` ends with a period.

### Markers

Checks have three result states. The outer work-item marker is computed, not
clicked.

| | Meaning | Next |
|---|---|---|
| `[ ]` | The check has not run | Its owner runs it once |
| `[x]` | The check ran and matched `Expect` | Preserve it |
| `[!]` | The check ran and did not match `Expect` | Add `Observed`; pause automatic retries and dependent work |

The parent is `[x]` only when every required check is `[x]`, `[!]` when any check
is `[!]`, and `[ ]` otherwise. The executor runs and records every untagged check
by editing the file; tagged results are written only through the CLI or the panel
(§ Recording tagged results). A panel uses one marker at
the check's normal left-side position and cycles `[ ]` → `[x]` → `[!]` → `[ ]`.
Agent markers and derived work-item markers remain read-only. A transition to
`[!]` requires `Observed`; until that text is valid, the failed state remains an
incomplete draft rather than a saved result.

Once any result is saved, freeze the item's title, outcome, actions, and
expectations. Agent-owned `[x]` and `[!]` results are immutable execution evidence:
a saved `[!]` requires a concise `Observed` statement, is not retried
automatically, and may become `[x]` only after an explicit post-intervention
verification that preserves `Observed` and adds `Resolved`. An Agent-resolved
result never returns to `[ ]`.

Manual result state remains user-editable after save because it records the
user's current verification judgment. Cycling a saved manual result to `[ ]`
clears its `Observed` and `Resolved`; cycling to `[!]` requires a new concise
`Observed`. Git or the owning document's revision history records earlier manual
states. A manual `[ ]` is incomplete and continues to block dependent work; this
editable manual path does not authorize the Agent to rerun or rewrite its own
saved checks. `[manual]` text may also change after a result: the result then
fails its fingerprint and reads as needing re-verification.

Keep a correction under the same item when its outcome and acceptance condition
are unchanged. Add a new numeric item only when the required outcome, scope,
action, or expectation materially changes. An unattempted `[ ]` specification can
still be clarified before its first saved result.

### Tagged checks

One item binds one checklist. Its tagged checks sit in their own final work
items, after the executor's:

- `[acceptance]`: written when the item is planned, from the original
  requirement, and committed before execution starts. Each `Action` cites the
  spec section it compares against. The first acceptance check is always
  「驗收條件未被改動」: git shows the `[acceptance]` text unchanged since the
  commit that wrote it (or the latest commit marked 「條件修訂」).
- `[manual]`: drafted when the item is planned (what the user must accept); the
  executor and the acceptor may add or refine `[manual]` checks later, for
  example the page link once the page exists.

The program orders them, so tagged work items carry no `Depends on`: an
`[acceptance]` result is refused until every untagged check is `[x]`, and a
`[manual]` result until every `[acceptance]` has passed. Checklists written
before these rules keep their structure.

A workflow that decided on one manual file per page (UX decision 89, used by
referenced-module-acceptance) keeps that form: the file holds the `[manual]`
checks for exactly one page of one piece of work, is named after its own Task ID
`checklists/<work>-<check>-<page>.checklist` (`toggle-tg02-playback`), is opened
only after the work's own round has every check `[x]`, and binds its own child
item under the same existing card.

Write `[manual]` `Action` so the user can reach the target from the checklist,
then the hands-on steps:

- Target with a URL (web page, local service page): link it as `[label](URL)`
  with an absolute `http(s)://` address. The checklist page renders `[label](URL)`
  in `Outcome`, `Action`, and `Expect` as a clickable link
  (rules: [InlineReportLinks](../../../Documentation/InlineReportLinks.md#checklist-欄位));
  the desktop editor opens only absolute links, and a relative link does nothing
  there. Before handing over, confirm every linked page answers from the
  project's own demo entry (an HTTP request, not a guess); a page the built
  delivery does not contain is not a manual check yet, and when the entry has to
  be started first, say how in the checklist's opening prose.
- Target without a URL (Unity scene, desktop window, device): no link. The first
  sentence names how to open it — project, scene path, menu path or command — in
  backticks, and that scene or entry must exist in the delivered project. Do not
  invent a URL or link a file path; `file:` is not rendered as a link.
- When the user compares against a reference that has a URL, link the reference
  and still state how to open the target.

Which target, address or scene to name belongs to the project or the acceptance
workflow that asks for the check, not to this skill.
`Expect` names what the user must see; `Reason` says why the agent
cannot judge it (「外觀由使用者判」 is a capability reason).

```markdown
- [ ] **3. 人工驗收**
  Outcome: 使用者接受播放列的兩顆開關。
  Checks:
    - [ ] **播放／暫停與循環播放** `[manual]`
      - Action: 開啟 [animation 播放列](http://127.0.0.1:8015/demo/animation/)，按播放再按暫停，開關循環播放。
      - Expect: 播放鈕只換名稱與圖示、沒有亮底；循環播放開著時底色為 accent。
      - Reason: 外觀由使用者判。
```

### Recording tagged results

Tagged results are written only through `task-progress checklist request --file
<file>` (an agent, with `actor` and `sessionId` on the message) or the Checklist
panel (the user). The write stamps a `Recorded` line — recorder, time and a
fingerprint of the check's `Action` and `Expect` — and, for a failed
`[acceptance]`, the reason:

```markdown
      - Recorded: claude:9f2c…; at=2026-10-22T10:00:00Z; fp=1a2b3c4d5e6f; reason=implementation
```

Never type a tagged marker or a `Recorded` line by hand.

- An agent records `[acceptance]` only when its session never started or took
  over the item; a failure names the reason: `implementation` (the work does not
  meet the condition) or `condition` (the condition contradicts the spec). A
  re-verification that passes keeps `Observed` and adds `Resolved`.
- An agent may only mark `[manual]` `[!]`, with `Observed` saying what changed;
  only the user marks `[manual]` `[x]`. This replaces the earlier rule that the
  operating tool could record a manual result it witnessed.
- The user may also change an `[acceptance]` result in the panel after
  confirming 「確認修改 agent 紀錄嗎？」.
- A tagged result without `Recorded` fails `checklist validate` and reads as
  needing re-verification; one whose fingerprint no longer matches its text reads
  the same way, and so does a pass recorded before the bound item's latest
  `released` (snapshot `validity: "released"`). Results recorded before these rules are stamped `legacy` with
  `task-progress checklist migrate <file>`, run deliberately; reading never
  converts them.

Test processes and batch runners must never write checklist state. The agent
records their results after execution under the untagged-check rules above.

### Migrate existing checklists

When `checklist validate` reports a tagged result without a recorder in a
project's checklists recorded before these rules, migrate that project's files:

1. Check the project's repository for uncommitted changes and its current branch.
   Leave files someone else changed alone, and do not commit onto a feature
   branch that holds other work; ask the user instead.
2. Preview: `task-progress.exe checklist migrate <every checklists/*.checklist> --dry-run`
   names how many results each file would get.
3. Migrate the same files without `--dry-run`. A file that already fails to
   parse is reported and skipped; it is a separate fix, never part of the
   migration.
4. Run `checklist validate` on every file; all of them must pass.
5. Check the diff: the only added lines are `      - Recorded: legacy; …`,
   nothing removed or changed.
6. Stage only those checklist files and commit them on their own, saying the
   results predate the recorder rule.

Migrate only results you believe were recorded before the rules. A result that
an agent may have typed by hand is re-verified by its owner instead.

### Verify the document

This section applies when the agent writes or changes a round, or when the user explicitly requests
validation. A request only to open or show an existing `.checklist` is navigation owned by
`taskprogress-capabilities`: do not inspect the document for errors or run validation. If the opener
surfaces an error, wait until the user explicitly asks before inspecting, validating, or
troubleshooting it.

Check the file against the parser rather than by eye:

```text
task-progress checklist validate <task.checklist>
```

On success it prints the round identity and the item and check counts. On
failure it prints the offending line number and the rule that line broke, and
exits non-zero. It never opens a window, so it is the entry point for a headless
run; `checklist <file>` without `validate` opens the editor and reports a
failure in a dialog instead. Run it after writing the round, and after any edit
that changes a marker or a field.

### The round

The spec is what makes an item valid. When the design moves the spec moves, and
items that no longer match it are deleted — not expired, not re-derived. Nothing
else needs to track staleness.

1. Spec settles → write each work item, its outcome, and its checks, including
   any `[acceptance]` and `[manual]` drafts (§ Tagged checks); all markers start
   `[ ]`. Commit before execution starts.
2. The executor implements the work and runs each untagged check once, then
   completes the `[manual]` drafts.
3. When every untagged check is `[x]`, `[acceptance]` goes to an independent acceptance context,
   then `[manual]` to the user. Hand over through the task card: give the card
   link from `task-progress.exe open --scope <scope> --pin <task> --no-browser`
   (or open the card in the browser pane), never loose URLs or file paths.
4. Record tagged checks under **Recording tagged results**. The user may later
   revise manual results through the single marker cycle. `[!]` requires
   `Observed`; `[ ]` remains incomplete.
5. Any `[!]` pauses automatic retries of that check and blocks only work that
   depends on it. Continue independent unchecked work when doing so is safe and
   useful. Record dependencies explicitly when they are not obvious from order.
6. On request, triage an implementation, specification, or environment failure
   and give the user a concrete recovery direction. Human troubleshooting may
   continue without creating checklist items for each attempt.
7. After the user reports an intervention complete, run the failed check once.
   If it now passes, change that check from `[!]` to `[x]`, retain `Observed`, and
   add `Resolved`. If it still fails, update `Observed` and pause again.
8. Create a new numeric item only when triage changes the outcome or acceptance
   contract. A fix that still targets the original `Expect` remains in that item.
9. When every check is `[x]` with valid records, the derived parent is `[x]`, the
   round ends and the bound item shows done.

Each task file carries one round at a time. When the round completes, keep its
finished contents readable and commit them with the implementation and evidence.
If the same task later receives a new settled round, first verify the completed
state is committed, then reuse the same `<task-id>.checklist` path and replace the
old items with the new unchecked list; Git history owns the replaced round. A
genuinely independent goal receives a new task ID and a new file instead. State
the one-round boundary in the file's own opening lines so it stays self-limiting
wherever it is read.

### Report binding

Bind every round to a Report child item when the round is written; an unbound
round is invisible on the task card and gets skipped. Bind it with `document_ref`
(`kind: "checklist"`, the owning `scope_id`, `task: "<stem>"`) to the child item
that is finished exactly when this round is; when no such item exists, add one
(for example 「驗收 <name>」) under the task the round verifies. Other related
checklists are linked from the item's description, not bound. Binding runs one way only: a child item binds
one checklist or decision document; a task card binds nothing and aggregates
completion from its items; a checklist never binds back to a card or item.
The bound item's state is derived from the checklist everywhere (Viewer,
`report get`'s `derived_state`, time analysis): done once every check is `[x]`
with valid records, and back to unfinished whenever a check reopens, whatever
status is stored. Document bindings are allowed
only on child items; tasks aggregate completion from their items. Field rules,
how to write the binding, and the projection contract belong to [the Report skill](../task-progress-report/SKILL.md#bind-checklist-and-decision-documents-document_ref).
