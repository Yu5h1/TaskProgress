---
name: task-progress-report
description: Generate, update, validate, roll up, register, and locally deploy TaskProgress report.json, optional report.dev.json, and optional time.analysis.json for Yu5h1Lib scopes. Use when an agent is asked to create or refresh project or multi-project workspace progress, synthesize a portfolio report from routed child scopes or deliverables, bind checklists or decisions to report items, estimate task or item time, publish deadline risk, onboard another workspace, prepare or register a scope, synchronize the shared all-scope localhost Viewer, or verify TaskProgress report data locally.
---

# TaskProgress report workflow

## Resolve paths

- Treat the directory containing the shared `.agents` folder as `<yu5h1lib-root>`.
- Treat `<yu5h1lib-root>\TaskProgress` as `<task-progress-root>`.
- Treat `<task-progress-root>\Build\win-x64\task-progress.exe` (the `Publish.cmd` output) as `<task-progress-exe>`. It is not on `PATH`. Take command shapes from this skill, [Report CLI usage](../../../Documentation/ReportCliUsage.md), or `PrintHelp()` in `src/TaskProgress.Cli/Program.cs`; never probe with missing arguments or subcommand `--help`, which opens a usage dialog on the user's screen.
- Place another project's reports at the project root:
  - `<project-root>\report.json`
  - `<project-root>\report.dev.json` only when developer details exist or the user requests it.
  - `<project-root>\time.analysis.json` only when a time estimate or deadline analysis is requested or already maintained.
- Read `<task-progress-root>\schemas\report.schema.json` completely before generating base report data.
- Read `<task-progress-root>\schemas\report.dev.schema.json` only when `report.dev.json` exists or the task creates, updates, or validates it.
- Read `<task-progress-root>\experiments\time-reference\schemas\time.analysis.schema.json` completely before creating, updating, or validating `time.analysis.json`.
- Read [references/time-estimation.md](references/time-estimation.md) whenever the task estimates work, updates capacity or deadlines, explains risk, or touches a time sidecar.
- Use `<task-progress-root>\reports\example` only as a tracked format example. Never copy its project facts into another scope.

## Read project truth first

1. Resolve each tracked task ID to its canonical entry through its `Task ID:` declaration (`AgentArtifactGuide.md` § Task identity); the declaration is a route, not a progress source.
2. Start with the target project's `handoff.md` when present, then follow the canonical entry to the relevant plan or design record.
3. Load only the additional sources needed to establish report facts, such as issue files, implementation, and test results.
4. Prefer verified repository state over stale prose. Do not invent completion, blockers, totals, decisions, or claims.
5. Preserve stable `report_id`, `scope_id`, and task IDs when updating an existing report.

## Resolve scope level and roll-up coverage

- Every report directory is an independent scope; the same schema describes a workspace, a project, or a component, and the Viewer renders one scope without inferring hierarchy.
- The target's existing cards, `report_pointer` cards included, are the inclusion boundary: add a card only for a task the user names or whose declaration is in scope; never scan directories to discover members. A workspace with a root report may validly have no root handoff.
- Classify each workspace card as a direct task, a whole child-scope roll-up, or a selected child deliverable, and make its coverage unambiguous (covered child task IDs or a named boundary). A deliverable marked `done` does not prove its child project complete; when coverage is ambiguous, report that instead of switching semantics.
- Keep workspace `completed_items`／`pending_items` at milestone granularity; do not copy descendant items or sum unrelated counts. Derive `blocked` only when nothing in the covered scope can proceed, `done` only when the card's coverage is complete, and never infer `archive`.
- A workspace `next_step` is the first of: a scope-stopping blocker, an explicit child primary next step, the next covered milestone.
- Cross-scope synthesis is agent work; deterministic aggregation and stale-roll-up detection are outside the current Viewer, Launcher and schema.

## Update existing Report through CLI

To open the card being worked on, follow [the shared service-readiness procedure](../taskprogress-capabilities/SKILL.md#ensure-the-checklist-service) with `--pin <task-id>` (the card ID from task context or `report get`), then navigate the pane to `http://127.0.0.1:8001/?scope=<scope-id>&pin=<task-id>`. Pin promotes the card to the front and is browser-local view state, not report data ([card pin](../../../Documentation/CardPin.md#cli-開啟並釘選)).

For task, item, and developer-field updates, use the `report` command instead of hand-editing JSON; [Report CLI usage](../../../Documentation/ReportCliUsage.md) owns request shapes and runtime requirements. Run `report get` (optionally `--task`) for the current revision, then `report apply --input <file> --dry-run` with ID-addressed operations, then the same without `--dry-run`. Never invent a revision or overwrite a conflict without rereading. Check both the JSON `ok` value and the exit code. Every request names its `actor` (the writing tool, such as `claude` or `codex`); the CLI refuses a request without it, and the value feeds the child-item activity log. Concurrency is the CLI's own job (its process lock and revision check); the agent's part is `actor` plus `expected_revision`, and rereading on a conflict. The command does not cover legacy string items, pointer mutations, deletions, cross-card moves, new report creation, or changing `document_ref` on an existing entry (see [binding](#bind-checklist-and-decision-documents-document_ref)). Hand-edit `report.json` only for one of those operations the CLI lacks; then append to each changed item's `activity` the entry the CLI would have written (`event` per [ItemActivityLog](../../../Documentation/ItemActivityLog.md): `updated` for a content change, `done` when it completes; your `actor`, your `session` ID when you know it, ISO `at`), run `report validate` on the folder, and say in the commit message what was hand-edited and why. A hand-edit without the activity entry leaves the item with no record of who changed it, which the log exists to prevent. Any change the CLI can make goes through `report apply`. It needs no running server.

## Maintain child items

- Tasks and child items have independent optional integer priority: `0` 立即, `1` 優先, `2` 一般, `3` 次要, `4` 未指定. Missing values also mean `4`; Preview hides the unspecified label. Choose priority from actual work importance, not to force an item into a particular position. Never use values outside 0–4.
- Viewer sorts unfinished children by priority, preserving source-array order within each level. When all are unspecified, array order is the display order. Use CLI position operations to insert or move an item relative to a same-level stable ID when order matters without a priority change; see [positions and status](../../../Documentation/ReportCliUsage.md#子項目位置與狀態) for syntax and version requirements. Completed children retain completion order, newest first.
- An item binds one checklist ([checklist-round § Tagged checks](../checklist-round/SKILL.md#tagged-checks)). A workflow that keeps one manual file per page gives each file its own child item under the requirement's existing card, never a new card, titled for what the user verifies; steps, expectations and links stay in the checklist.
- An item bound to a checklist derives its state from it (`report get` adds `derived_state`: `not_started`, `in_progress`, `waiting`, `awaiting_acceptance`, `awaiting_user`, `awaiting_user_dispute`, `conditions_to_revise`, `needs_fix`, `done`); its stored status only records the claim. Claim with `status: in_progress`, release with `{"op": "item.event", "event": "released"}` when your part is done, and never set `done` by hand on it. Procedure: [task-progress-items](../task-progress-items/SKILL.md), reached through each agent's user-level entry.
- An item, bound or not, that cannot start until another item or a checklist work item finishes — in this scope or another — declares it in `waits_for`: `{"scope_id", "task_id", "item_id"}` for an item, `{"scope_id", "checklist": "<stem>", "work_item": <number>}` for one work item of a checklist, finished when every check in it passes. The title states only the item's own work, with no ordering prose or waited-card link: `report get` and the Viewer derive `waiting` from `waits_for` alone, show the waited cards or checklists and lift the wait once all of them pass, so a wait written in words is never seen. The CLI rejects unknown targets and loops. An item wait is also met while the waited item lacks only the user's `[manual]` acceptance (every other check passed and the user failed none), so the waiter proceeds without the user; add `"strict": true` to an item wait that must hold until the user has accepted. If the user then fails that acceptance, a waiter that had started derives `needs_fix` until it is released or marked done again after the failure: redo it against the fixed result. A checklist work-item wait always waits for every check. The waited item, when it exists because of the wait, links back as § Inline links says.
- The report's `next` names the one child item the scope acts on now (`next.set` with `task_id` and `item_id` of an unfinished object item, `next.clear`; [CLI usage](../../../Documentation/ReportCliUsage.md#next-標記)). The Viewer lifts that card and item to the top while the item still needs taking up; while it is done, waiting or in progress the Viewer shows no Next and writes nothing (`report get` → `next_effective` is null). Only `report next --actor <tool> [--task <card>]` derives a replacement, when an agent chooses to run it. The user sets or clears it with a long press on a row; `next.set` refuses an item that is done, archived, waiting or in progress.
- Maintain an unbound object item's status as work happens: `planned` before work begins, `in_progress` when implementation or validation starts, `blocked` when progress is blocked, and `done` only when the outcome is complete and adequately verified. Resume with the actual current status; use `archive` only for an explicit retirement decision. Use `item.update` rather than waiting until completion to manually move arrays. The CLI relocates done to completed_items and other statuses to pending_items while preserving the stable ID.
- The user may paste an item reference copied from the Viewer: `<scope-id> › <task-id> › <item-id>`. Resolve it by IDs with `report get --scope <scope-id> --task <task-id>` and address the item by `<item-id>`. Older pastes may end with a 「title head」; ignore it beyond a sanity check. When the IDs do not resolve, say so instead of guessing ([format](../../../Documentation/ItemReference.md)).
- Every `report apply` request carries `"actor"` (your tool in lowercase: `claude`, `codex`, `antigravity`) plus `"session"` (your session's name, the title shown in your tool) and `"session_id"` when you know them; the CLI records item activity from them. The Viewer shows the name; claims compare only `session_id`. Setting an item `in_progress` claims it. When the CLI answers `claim_unverified`, retry that operation with `"claim": "own"` only if you started the item yourself; on `claim_conflict`, or when you do not recognize the work, stop and ask the user, then retry with `"claim": "takeover"` once they agree. A `released` event frees only your own claim; releasing another session's committed but unreleased work takes the user's yes and `"claim": "recover"`, which records no takeover ([activity and claims](../../../Documentation/ItemActivityLog.md#認領)).
- A missing child status falls back to array membership: completed_items means done, pending_items means planned. The parent card's status does not make its children in_progress. Legacy strings need a separate supported migration before ID-addressed editing; do not target them by label or array index.

## Generate `report.json`

- Use an ISO 8601 `updated_at` timestamp with timezone.
- Keep the report readable by a general viewer. Put internal coordination details in `report.dev.json`.
- Map task status exactly:
  - `planned`: accepted or known, but implementation has not started.
  - `in_progress`: implementation or validation is actively underway.
  - `blocked`: progress requires unavailable input, authority, dependency, or external state.
  - `done`: requested outcome is implemented and adequately verified.
  - `archive`: historical work retained for context but no longer active.
- Write `summary` as the current outcome or state, not a work diary. When the card has a plan document, link its 〈問題與目標〉 section from the summary: that section is the card's goal.
- Add `completed_items` and `pending_items` only for concrete, useful facts.
- Preserve legacy string items when no stable identity is needed. When time analysis must align an item, use `{ "id": "<stable-id>", "title": "<display text>" }`; keep the ID stable when wording or estimates change.
- Add `progress` only when both numbers are factual. Never estimate a percentage or denominator.
- Keep task IDs unique and stable. Split unrelated outcomes into separate tasks.

Minimal shape:

```json
{
  "schema_version": "1.0",
  "report_id": "project-progress",
  "scope_id": "project",
  "title": "Project development progress",
  "updated_at": "2026-07-21T12:00:00+08:00",
  "tasks": [
    {
      "id": "feature-a",
      "title": "Feature A",
      "status": "in_progress",
      "summary": "Core implementation is complete; integration validation remains.",
      "completed_items": ["Implemented the core path"],
      "pending_items": ["Run integration validation"]
    }
  ]
}
```

## Inline links in report descriptions

Write `[label](URL)` inside an existing string field (an object item's `title`, a legacy string item, a summary) wherever navigation helps; labels are free text, links may sit anywhere in a sentence, and no other field renders them. This is inline-link support, not Markdown: bare URLs, images and HTML do not render, relative URLs resolve against the Viewer page, and the stored syntax counts toward field length limits.

When a description you author or update mentions a specific Checklist, Decision or card, link its page rather than naming it (a document that decides the entry's completion is bound with [`document_ref`](#bind-checklist-and-decision-documents-document_ref) instead, and the Viewer renders that link itself). Resolve the file and its registered owning scope first and URL-encode each query value:

- `[驗收清單](/checklist/?scope=<scope-id>&task=<stem>)` → `checklists/<stem>.checklist`
- `[決策細節](/decisions/?scope=<scope-id>&task=<stem>)` → `decisions/<stem>.decisions`
- `[卡片名稱](/?scope=<scope-id>&pin=<card-id>)` → that card, pinned and expanded ([card pin](../../../Documentation/CardPin.md)); pin targets cards only, so for a child item link its card and name the item in words.

A wait is declared in `waits_for` (§ Maintain child items), never as a link here. The reverse direction has no generated link, so an item that exists because another scope's item waits on it links back to that item's card and names the item in words, written when the item is created and updated when the waiting item moves. Route through these pages, never a filesystem path or `file://` URL; when the target cannot be verified, keep plain text and report it rather than inventing a link. Use real HTTP(S) URLs for downloads and external documentation, keep local-only Checklist/Decision links out of a public report unless that deployment serves those routes, and change only the descriptions being authored. Rendering and disclosure behavior: [Inline report links](../../../Documentation/InlineReportLinks.md).

## Bind Checklist and Decision documents (document_ref)

Bind a `.checklist` or `.decisions` file when finishing that document is what finishes an object item: every new checklist round and every decisions file with pending decisions, when it is written and before the user is asked to act on it, because an unbound document appears on no card. Add a child item (「驗收 <name>」, 「決策 <topic>」) under the task the document serves when none matches. To merely mention a document, use an [inline link](#inline-links-in-report-descriptions).

```json
"document_ref": { "kind": "checklist", "scope_id": "<scope-id>", "task": "<stem>" }
```

- `kind` is `checklist` (→ `<scope-root>/checklists/<stem>.checklist`) or `decision`, singular (→ `<scope-root>/decisions/<stem>.decisions`); `scope_id` is the registered scope that owns the file; `task` is the file stem (`stem` is an accepted alias), which need not equal the Report task ID.
- Only object items carry a checklist or decision binding; tasks aggregate from their items; a legacy string item first becomes an object item. A card carries only its experience record (§ Keep a card's experience record).
- `item.add` accepts it inside `value`; the `report` command cannot add, change or remove it on an existing entry, so hand-edit `report.json` for that and run `report validate`.
- Projection (display-only, never written back): a checklist is complete when every check is `[x]`, a decisions file when every decision is answered; a complete document shows the item done, an incomplete or unreadable one shows its stored unfinished state, and a card with bound items aggregates them. The bound routes exist only on the local service, so keep `document_ref` out of a report published elsewhere.

## Keep a card's experience record

A card binds its own experience record, the Markdown file where work on the card logs what it learned:

```json
"document_ref": { "kind": "experience", "scope_id": "<the card's own scope>", "task": "<stem>" }
```

- The file is `<scope-root>/experience/<stem>.md`; use the card ID as the stem. Create the file first: `task.add` and `task.update` (`set` or `unset` `document_ref`) refuse another kind, another scope, extra fields or a missing file.
- It is for agents: no Viewer UI shows it, and it never counts toward the card's progress. The user opens it in a text editor.
- The handoff routes to the card; the record itself stays with the card.

Log a line while you work, whenever something could change how the next session works. One lesson
per line:

```markdown
- [open] 2026-10-24 claude › <item-id> › environment：Python 測試要加 PYTHONPATH=. 才跑得起來 → README〈測試〉
- [promoted → <where it was written>] …
- [dismissed：<reason>] …
```

- Kinds: `misled` (a step or rule sent you wrong), `missing` (a rule or explanation was absent),
  `environment` (a tool or environment trap), `judgment` (a call made with no rule to follow).
- Not here: progress, next steps or current state (Report and checklist), a choice for the user
  (decisions file), a fix someone must make (「問題：」 item).
- The close-out review turns each `open` line into `promoted` or `dismissed` and keeps it; a card is
  done with no `open` line left. It then appends one metrics line, for example
  `指標：驗收不通過 1／5、重做 0、重講目標 1、週期 3 天` — acceptance failures over tagged checks,
  redo count (`needs_fix` episodes), times the user restated the goal, days from first item created
  to last done.

## Generate optional `time.analysis.json`

- Create or refresh it only when the user requests time estimates or deadline risk, or the target already maintains the sidecar; never because the Viewer supports it.
- Run the published deterministic analyzer after any engineering judgment is prepared: `& "<task-progress-exe>" analyze "<project-root>"` (`--scope <scope-id>` uses the registry; `--as-of <ISO timestamp>` fixes the clock). `open` refreshes only its target and only when a time input exists; `start` and `scope add` regenerate nothing.
- With only `report.json`, items without active estimates stay unset and excluded from totals; that fallback is not AI analysis, and missing evidence leaves an estimate unset with coverage reported, never fallback minutes.
- The sidecar is a public derived snapshot: keep private work patterns and reasoning in local inputs. Match `scope_id`, `task_id` and `item_id` to the base report's stable IDs; store integer minutes; preserve `analysis_id`, work IDs, algorithm IDs and estimate lineage; recompute after any input change instead of asking AI to redo registered arithmetic. Estimate modes, capacity, calibration and the v0.3 risk method: [references/time-estimation.md](references/time-estimation.md).

## Generate optional `report.dev.json`

- Do not create the file merely to satisfy a template. Its absence is valid.
- Match `schema_version` and `report_id` with `report.json` exactly.
- Every developer task `id` must match an existing task in `report.json`; never guess a match.
- Use schema-supported fields for actionable next steps, blockers, stable decisions, route choices, and verified ownership details.
- Treat `claim` as a generated snapshot copied from the authoritative project `handoff.md`, not as a second live claim source.
- Do not place secrets, credentials, tokens, or unnecessary private data in either report.

## Validate before reporting completion

1. Run `& "<task-progress-exe>" report validate "<project-root>"` (or `--scope <scope-id>`) and require `ok: true` with exit code 0. It checks `report.json` against its schema and, when present, `report.dev.json` against its schema plus matching `schema_version`/`report_id` and known, unduplicated overlay task IDs. When the EXE is unavailable, perform those checks by hand: parse both files and validate allowed values, ID patterns, required fields, lengths, and `additionalProperties: false`.
2. Confirm task IDs are unique.
3. If `time.analysis.json` exists, confirm it satisfies Draft 0.2 with the same `scope_id`, every analyzed task/item resolves to a stable base-report ID, totals and derived risk values reproduce for the same clock per [references/time-estimation.md](references/time-estimation.md), and only `public_label` is projected for capacity exceptions.
4. For every `document_ref`, confirm `scope_id` is a registered scope (`scope list`) and its `checklists/<stem>.checklist` or `decisions/<stem>.decisions` exists. Schema validation checks neither.
5. Confirm factual consistency with the source task documents and current repository/test state.
6. When `<task-progress-exe>` exists, follow [the shared service-readiness procedure](../taskprogress-capabilities/SKILL.md#ensure-the-checklist-service), whose `open` call for this report is:

```powershell
& "<task-progress-exe>" open "<project-root>" --no-browser
```

   It prints nothing when run directly; the Viewer URL is `http://127.0.0.1:8001/?scope=<scope-id>`. `open` rejects `--port`; the tray's service uses the default port. Navigate the Browser pane to that URL, reusing the relevant tab, and stop there: no waiting, page read-back, port probe or retry, as that procedure says. The user sees the pane.

7. Tell the user what the Viewer should now show for this change, from this list, so they can see it at a glance: no validation diagnostic; no Developer overlay when `report.dev.json` is absent; no time placeholders when `time.analysis.json` is absent, otherwise the delivery capsule, item hours and three detail tabs (estimate-only: the neutral `交付日未定 ›` capsule and estimates, without risk lamp, countdown, capacity tab or deadline refresh); with `document_ref`, each bound entry's source link and the completion its document implies. Diagnose only when the user says something is wrong, per that procedure's closing paragraph.
8. Report the files written and the validation performed. The Viewer itself was not checked by you; say so rather than claiming it.

## Register a reusable local scope

Only register when the user requests it because this changes the user's local TaskProgress configuration:

```powershell
& "<task-progress-exe>" scope add <scope-id> "<project-root>"
& "<task-progress-exe>" scope list
```

- Treat `%LOCALAPPDATA%\TaskProgress\scopes.json` as the default shared registry for every workspace. `TASK_PROGRESS_HOME` overrides its directory when explicitly configured.
- Never expose `scopes.json` through the web server because it contains local folder paths. Do not hand-edit it when the CLI can perform the requested add/remove operation.
- Require the registered key, the report's `scope_id`, and the intended Viewer scope to match exactly.

## Start or synchronize the shared Viewer

Opening an existing Report follows [the shared service-readiness procedure](../taskprogress-capabilities/SKILL.md#ensure-the-checklist-service); an agent brings the service up no other way. When registration or route changes require synchronizing all registered scopes, check status, then run once in that same ordinary-user unsandboxed context:

```powershell
& "<task-progress-exe>" start --no-browser
```

`start` invokes TrayHost and its worker, ensures the service, validates registered reports, synchronizes exact routes and the sanitized catalog, and removes stale routes; it regenerates no analysis, opens no browser (`--browser` does), and `--console` is only a log observer. `open` already synchronizes its own scope, so do not run `start` for an unchanged registry. On an error or a foreign service, report and stop; never restart or loop. The Chrome bookmark form is `task-progress://open?scope=<scope-id>`.

## Publishing boundary

- Local generation does not authorize publishing.
- Copy only an explicitly approved public `report.json` to `<task-progress-root>\reports\<scope-id>\report.json` when the user asks to publish it.
- Do not copy `report.dev.json` to the public reports directory unless the user explicitly requests that exact action.
- Copy `time.analysis.json` only when the user approves publishing its capacity, estimates, deadline, and public exception labels. Its existence locally does not imply publication consent.
