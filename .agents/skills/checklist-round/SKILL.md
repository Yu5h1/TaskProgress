---
name: checklist-round
description: Split a settled spec into a per-task `.checklist` file, shape its work items and nested checks, hand `[manual]` checks to the user, and run one round to completion. Use when the project carries a `checklists/` directory and a task's spec has been accepted.
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
directory, skip all of this. Once the current task's file exists, hand the list
over instead of running it alone when any one of these holds — all countable
before starting, unlike elapsed minutes or token spend:

- the list runs past ~10 items
- verification touches UI, device input, or hands-on manipulation
- the plan needs more than ~10 tool calls, or more than 3 browser round-trips

The user checks a screen in seconds where the agent spends a round of tool calls
that then sit in context for the rest of the session. They can also ask for the
handover directly, with no threshold met. A standing instruction to run
everything makes the agent the executor for that scope: skip the pause, run it
all.

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
    - [ ] **Rendered Viewer** `[manual]`
      - Action: Open the local Viewer, enter Edit, and save once.
      - Expect: The Network panel has no 404 or request for a retired editor path.
      - Reason: Requires inspection in the user's running browser session.
    - [x] **Resolved environment check**
      - Action: Run the focused build after the environment intervention.
      - Expect: The build completes successfully.
      - Observed: The initial run could not reach the required package source.
      - Resolved: The authorized package restore completed and the focused build passed.
```

`Action` covers commands, URLs, and hands-on steps; `Expect` gives the observable
pass condition. Untagged checks belong to the agent. Add `[manual]` only when a
check needs the user's device, environment, protected data, or direct UX
judgment, and require a short `Reason`. "The user is faster" is not a capability
reason. Do not use separate `Entry`, `Verification`, `By`, or `Why not agent`
fields; they duplicate this structure. Every check field is a nested Markdown
list entry using the exact `      - Field: value` shape. This applies to required
`Action` and `Expect` and optional `Reason`, `Observed`, and `Resolved`.

Those fields are ordered, not a set: `Action`, then `Expect`, then whichever of
`Reason`, `Observed`, and `Resolved` apply, in that order. The parser reads the
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
is `[!]`, and `[ ]` otherwise. The agent runs and records every untagged check;
the user performs `[manual]` checks. Their recorder follows the contract below.
A manual UI uses one marker at
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
saved checks.

Keep a correction under the same item when its outcome and acceptance condition
are unchanged. Add a new numeric item only when the required outcome, scope,
action, or expectation materially changes. An unattempted `[ ]` specification can
still be clarified before its first saved result.

### Recording manual results

`[manual]` identifies who performs the check and supplies the required capability,
not who types its marker. The user may record the result directly, or the
interactive tool the user is currently operating may record it when that tool
can witness the check's entire `Expect`. Witnessing only part of `Expect` is
insufficient; leave that check for the user to judge and record.

Before each execution, a tool that records results must tell the user which
work items and checks it covers. It may write only those declared checks;
undeclared checks remain for the user. This declaration belongs to the tool at
runtime, not to an automation whitelist or extra field in `.checklist`.

Test processes and batch runners must never write checklist state. The agent
records their results after execution under the untagged-check rules above.
This exception for an interactive recorder does not grant it permission to
change agent-owned execution evidence.

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

1. Spec settles → write each work item, its outcome, and its checks; all markers
   start `[ ]`.
2. The agent implements the work and runs each untagged check once.
3. If only `[manual]` checks remain, hand those checks to the user and stop.
4. Record manual checks under **Recording manual results**. The user may later
   revise them through the single marker cycle. `[!]` requires `Observed`;
   `[ ]` remains incomplete.
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
9. When every check is `[x]`, the derived parent is `[x]` and the round ends.

Each task file carries one round at a time. When the round completes, keep its
finished contents readable and commit them with the implementation and evidence.
If the same task later receives a new settled round, first verify the completed
state is committed, then reuse the same `<task-id>.checklist` path and replace the
old items with the new unchecked list; Git history owns the replaced round. A
genuinely independent goal receives a new task ID and a new file instead. State
the one-round boundary in the file's own opening lines so it stays self-limiting
wherever it is read.
