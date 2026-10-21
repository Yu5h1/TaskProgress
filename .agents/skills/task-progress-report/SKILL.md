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

- Treat every report directory as an independent scope. The same schema may describe a multi-project workspace, a project, or a narrower component; the Viewer and Launcher render one selected scope and do not infer hierarchy.
- Resolve the requested target first. Its existing `report.json` cards, including `report_pointer` cards for child scopes, are the explicit inclusion boundary; add a card only for a task the user names or whose declaration is in scope. Never recursively scan directories to discover report members.
- A workspace with a root report may validly have no root handoff. Follow each canonical route to the relevant child plan, handoff, report, and repository facts.
- Classify each workspace card as one of: a direct workspace task, a whole child-scope roll-up, or a selected child deliverable. Preserve mixed portfolios when that is the established report intent.
- Require the canonical route or routing note to make the card's coverage unambiguous. For a selected deliverable, record the covered child task IDs or a clear named boundary. Do not treat a deliverable marked `done` as proof that its whole child project is complete.
- For a whole child scope, summarize its current outcome and project-level milestones. For a selected deliverable, read only the covered child work. If coverage remains ambiguous, report the ambiguity and do not silently switch between whole-scope and deliverable semantics.
- Keep workspace `completed_items` and `pending_items` at workspace milestone granularity. Do not copy every descendant item or compute portfolio progress by summing unrelated descendant counts.
- Derive `blocked` only when no meaningful work inside the covered scope can proceed. Derive `done` only when that card's explicit coverage is complete. Never infer `archive`; it requires an explicit scope decision.
- Choose a workspace `next_step` for portfolio relevance: first a scope-stopping blocker, then an explicit child primary next step, then the next covered milestone. Do not copy an entire child backlog or select an arbitrary first pending item.
- Treat cross-scope synthesis as an Agent workflow. Deterministic aggregation, drill-down, or stale-roll-up detection requires explicit machine-readable parent/child coverage and is outside the current Viewer, Launcher, and schema behavior.

## Update existing Report through CLI

To open the task being worked on, first follow [the shared service-readiness procedure](../taskprogress-capabilities/SKILL.md#ensure-the-checklist-service), then run `open --scope <scope-id> --pin <task-id> --no-browser` (or a report folder instead of `--scope`). Take the card ID from current task context or `report get`; no session mapping is needed. `--no-browser` returns the link without opening the system browser but still registers routes and refreshes analysis as a normal `open` does; opening that link in the Browser pane applies the pin. Pin promotes the card to the front, never toggles it off, and is browser-local view state, not report data. Pass `--port <port>` to `open` and every later `service status` when the confirmed port is not the default. Confirm status after the command, then read the loaded URL and page content. Contract: [card pin](../../../Documentation/CardPin.md#cli-開啟並釘選).

For task, item, and developer-field updates, use the `report` command instead of hand-editing JSON; [Report CLI usage](../../../Documentation/ReportCliUsage.md) owns request shapes and runtime requirements. Run `report get` (optionally `--task`) for the current revision, then `report apply --input <file> --dry-run` with ID-addressed operations, then the same without `--dry-run`. Never invent a revision or overwrite a conflict without rereading. Check both the JSON `ok` value and the exit code. Every request names its `actor` (the writing tool, such as `claude` or `codex`); the CLI refuses a request without it, and the value feeds the child-item activity log. Concurrency is the CLI's own job (its process lock and revision check); the agent's part is `actor` plus `expected_revision`, and rereading on a conflict. The command does not cover legacy string items, pointer mutations, deletions, cross-card moves, new report creation, or changing `document_ref` on an existing entry (see [binding](#bind-checklist-and-decision-documents-document_ref)). Hand-edit `report.json` only for one of those operations the CLI lacks, run `report validate` on the folder afterwards, and say in the commit message what was hand-edited and why; any change the CLI can make goes through `report apply`. It needs no running server.

## Maintain child items

- Tasks and child items have independent optional integer priority: `0` 立即, `1` 優先, `2` 一般, `3` 次要, `4` 未指定. Missing values also mean `4`; Preview hides the unspecified label. Choose priority from actual work importance, not to force an item into a particular position. Never use values outside 0–4.
- Viewer sorts unfinished children by priority, preserving source-array order within each level. When all are unspecified, array order is the display order. Use CLI position operations to insert or move an item relative to a same-level stable ID when order matters without a priority change; see [positions and status](../../../Documentation/ReportCliUsage.md#子項目位置與狀態) for syntax and version requirements. Completed children retain completion order, newest first.
- A manual checklist ([checklist-round § Manual checklists](../checklist-round/SKILL.md#manual-checklists)) gets its own child item under the requirement's existing task card, never a new card. Title it so a reader sees what the user verifies for that task, aligned with the card's wording; steps, expectations and links stay in the bound checklist, not in the title. Set `priority` (0 highest) so these items sort where the user looks first. One item per manual checklist; bind it with `document_ref` on `item.add`.
- Maintain an object item's status as work happens: `planned` before work begins, `in_progress` when implementation or validation starts, `blocked` when progress is blocked, and `done` only when the outcome is complete and adequately verified. Resume with the actual current status; use `archive` only for an explicit retirement decision. Use `item.update` rather than waiting until completion to manually move arrays. The CLI relocates done to completed_items and other statuses to pending_items while preserving the stable ID.
- The user may paste an item reference copied from the Viewer: `<scope-id> › <task-id> › <item-id>`. Resolve it by IDs with `report get --scope <scope-id> --task <task-id>` and address the item by `<item-id>`. Older pastes may end with a 「title head」; ignore it beyond a sanity check. When the IDs do not resolve, say so instead of guessing ([format](../../../Documentation/ItemReference.md)).
- Every `report apply` request carries `"actor"` (your tool in lowercase: `claude`, `codex`, `antigravity`) and `"session"` when you know your session ID; the CLI records item activity from them. Setting an item `in_progress` claims it. When the CLI answers `claim_unverified`, retry that operation with `"claim": "own"` only if you started the item yourself; on `claim_conflict`, or when you do not recognize the work, stop and ask the user, then retry with `"claim": "takeover"` once they agree ([activity and claims](../../../Documentation/ItemActivityLog.md#認領)).
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
- Write `summary` as the current outcome or state, not a work diary.
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

When a task summary or completed/pending item description benefits from navigation, write `[label](URL)` in its existing string field (an object item's `title`, or a legacy string item). Labels are free text: `下載`, `影片`, `教學`, and `前往` are examples, not fixed controls. Links can appear anywhere in a sentence; keep the surrounding text meaningful. Do not put link syntax into IDs or assume other report fields render it.

When a summary or item description you author or update mentions a specific Checklist or Decision, make the mention an inline link to its page rather than a bare name or path. A document that decides the entry's completion is bound with [`document_ref`](#bind-checklist-and-decision-documents-document_ref) instead, and the Viewer renders its link itself. Resolve the existing file and its owning registered scope first; use the file's stem as `task`, which need not match the Report task ID. Compose a root-relative URL and URL-encode each query value:

- `[驗收清單](/checklist/?scope=<scope-id>&task=<stem>)` → `checklists/<stem>.checklist`.
- `[決策細節](/decisions/?scope=<scope-id>&task=<stem>)` → `decisions/<stem>.decisions`.

Use a meaningful label such as the checklist name or decision topic. Route through these pages, not a Windows filesystem path or `file://` URL. If the mention is generic or the target cannot be verified, retain plain text and report an unresolved specific target; do not invent a link or create a file just to supply one. Apply this rule to the descriptions being authored or updated, without rewriting unrelated Report entries.

Use an actual HTTP(S) URL for downloads, videos, or external documentation. Supported URL forms also include page-relative paths and `#fragment`; encode spaces. Relative URLs resolve against the Viewer page, not the report file's folder. This is inline-link support, not full Markdown: bare URLs, images, and HTML are not rendered as links. The label `下載` does not force a download. Existing field length limits include the stored syntax.

Before adding a link, verify its target from available evidence; the Viewer does not validate these destinations or show the decision `source_ref` warnings. Keep local-only Checklist/Decision links out of a public report unless that deployment actually provides those routes; do not substitute a localhost URL as a public destination. For supported rendering and disclosure behavior, read [Inline report links](../../../Documentation/InlineReportLinks.md).

## Bind Checklist and Decision documents (document_ref)

Bind a `.checklist` or `.decisions` file when finishing that document is what finishes an object item. In a scope with a `report.json`, bind every new checklist round and every decisions file that has pending decisions when it is written, before asking the user to act on it: an unbound document does not appear on any task card and gets overlooked. When no child item matches, add one (for example 「驗收 <name>」 or 「決策 <topic>」) under the task the document serves. Document bindings are allowed only on child items; tasks aggregate status from their items. To merely mention a document, use an [inline link](#inline-links-in-report-descriptions); general hyperlinks in task summaries and items are preserved and do not participate in status derivation.

```json
"document_ref": { "kind": "checklist", "scope_id": "<scope-id>", "task": "<stem>" }
```

- `kind` is `checklist` (→ `<scope-root>/checklists/<stem>.checklist`) or `decision`, singular (→ `<scope-root>/decisions/<stem>.decisions`).
- `scope_id` is the registered scope that owns the file. It may differ from the report's own scope when both are served by the same local service.
- `task` names the file stem, matching the page's `?task=` query; `stem` is an accepted alias. Write `task`. The stem need not equal the Report task ID.
- Allowed only on object items (`{ "id", "title" }`). Tasks must not carry `document_ref`. A legacy string item must first become an object item with a stable ID.
- Writing it: `item.add` accepts `document_ref` inside `value`; `task.add` does not accept `document_ref`. The `report` command cannot add, change, or remove it on an existing entry; edit `report.json` directly, then run `report validate` (see [Validate](#validate-before-reporting-completion)).

How the Viewer projects it (`viewer/assets/document-binding.js`):

- It reads each bound document on load and on foreground return, through the service's Checklist and Decision routes.
- **Checklist complete**: at least one check, and every nested check `[x]`, `[manual]` checks included.
- **Decision complete**: at least one decision, and every decision answered. Unanswered, or 「其他」 with an empty reason, is pending.
- A complete document shows the bound child item as `done`: it moves to the completed list and counts toward progress. When the document is incomplete, reopened, unchecked, empty, or fails to read, the item reflects an unfinished state (reverting to its stored `planned`/`in_progress`/`blocked` status, or `in_progress` if stored as `done`). Stored `archive` retains archive semantics. Missing or unreadable files mark the item's source unavailable.
- For task cards containing bound child items, card status and progress aggregate all its child items: all items done derives the card to `done`; incomplete items revert a done card to `in_progress` or retain the card's unfinished status. Task cards without any bound items keep their stored status and existing behavior unchanged.
- The projection is display-only. Saving from the Viewer never writes it back to `report.json`, and a refresh is skipped while the editor holds unsaved changes.
- A missing file, unknown scope, or transport failure marks that entry's source unavailable; the rest of the report renders normally.
- The bound child item shows a `Checklist` or `Decision` source link beside its text, opening the document page. Task card headers and summaries do not show document badges or decision links.

Separate, unbound behavior: document pages link back to their scope's Report by scope alone (no `document_ref` needed; see [DocumentOwnerReport](../../../Documentation/DocumentOwnerReport.md)). Task cards do not show task-level pending decision counts or decision links.

The bound routes exist only on the local service. Keep `document_ref` out of a report published elsewhere unless that deployment serves `/checklist/` and `/decisions/`; otherwise every bound entry shows an unavailable source.

## Generate optional `time.analysis.json`

- Do not create time data merely because the Viewer supports it. Create or refresh it when the user requests time estimates or deadline risk, or when the target already maintains the sidecar.
- Prefer the published deterministic analyzer after the Agent or human has prepared any required engineering judgment:

```powershell
& "<task-progress-exe>" analyze "<project-root>"
```

  `analyze --scope <scope-id>` uses the shared registry. `--as-of <ISO timestamp>` fixes the clock for reproducible validation. `open` refreshes only its target automatically when `time.config.json`, `time.estimates.json`, or `time.events.json` exists; projects without any time input remain unchanged. `start` synchronizes routes without regenerating any scope; `scope add` only registers its target.
- The analyzer can produce an estimate-only snapshot without a deadline. When invoked with only `report.json`, stable items missing active estimates retain unset identities without invented durations and are excluded from totals. Do not treat this deterministic fallback as AI analysis.
- Treat `time.analysis.json` as a public, derived snapshot. Keep private work patterns, raw sessions, private leave reasons, prompts, and hidden reasoning in local inputs rather than this projection.
- Match `scope_id` to `report.json`. Match every `task_id` and `item_id` to stable IDs in the base report; do not guess correspondence from display text.
- Store durations as integer minutes. Display hours are derived presentation values, not the arithmetic source of truth.
- Preserve existing `analysis_id`, stable work IDs, algorithm IDs, and estimate lineage unless their identities genuinely change.
- Recompute deterministic values after changing progress, capacity, deadline, parameters, or estimates. Do not ask AI to redo arithmetic already covered by a registered formula.
- For `deterministic-capacity-feasibility` v0.3, sum calibrated estimates for unfinished items, compare that demand with remaining scheduled capacity first, and then use progress pressure as a secondary trend signal. A capacity shortfall is critical; capacity utilization above 80% is at least at risk. Preserve legacy v0.2 pressure-only snapshots when reading old sidecars.
- If required evidence is missing, leave the estimate unset; report coverage and unestimated item counts, never fallback minutes.

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
3. If `time.analysis.json` exists, confirm:
   - it satisfies Draft 0.2 and has the same `scope_id` as `report.json`;
   - every analyzed task/item resolves to a stable base-report ID;
   - item totals, task totals, project total, estimate composition, capacity profile, and capacity timeline are arithmetically consistent;
   - direct unfinished estimate totals, remaining capacity, capacity balance, feasibility ratio, `evaluated_at`, work progress, time progress, pressure, risk basis, boundary state, and urgency reproduce for the same clock value;
   - only `public_label` is projected for capacity exceptions.
4. For every `document_ref`, confirm `scope_id` is a registered scope (`scope list`) and its `checklists/<stem>.checklist` or `decisions/<stem>.decisions` exists. Schema validation checks neither.
5. Confirm factual consistency with the source task documents and current repository/test state.
6. When `<task-progress-exe>` exists, follow [the shared service-readiness procedure](../taskprogress-capabilities/SKILL.md#ensure-the-checklist-service), then obtain the actual Viewer URL:

```powershell
& "<task-progress-exe>" open "<project-root>" --no-browser
```

   For a confirmed nondefault port, append `--port <port>` to `open` and every subsequent `service status` call. Confirm service status again after the command. Open the returned URL in the Browser pane using the available browser tools, reusing the relevant tab when present. Read the loaded URL and page content; do not treat command success as page-load evidence.

7. Verify the generated URL uses `?scope=<scope-id>`, the Viewer loads, and no validation diagnostic appears. If `report.dev.json` is absent, confirm no `dev=` query and no Developer overlay. If `time.analysis.json` is absent, confirm the Viewer shows no time placeholders; if present, confirm the delivery capsule, item hours, and three detail tabs appear.
   For estimate-only analysis, confirm the neutral `交付日未定 ›` capsule, project/task/item estimates, and engineering details appear without a risk lamp, countdown, capacity tab, or deadline refresh.
   With `document_ref`, confirm each bound entry shows its source link and the completion its document implies, with no unavailable source.
8. Report the files written and the validation performed. Do not claim Viewer validation if only JSON parsing was performed.

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

For opening an existing Report, first follow [the shared service-readiness procedure](../taskprogress-capabilities/SKILL.md#ensure-the-checklist-service). It owns status checks, ordinary-user unsandboxed startup, readiness evidence, and failure handling. A live TrayHost alone is insufficient.

When registration or route changes require synchronization of all registered scopes, check status first, then run this command once in the same ordinary-user unsandboxed context used by that procedure:

```powershell
& "<task-progress-exe>" start --no-browser
```

`start` invokes TrayHost and its resident worker, ensures the service, validates registered reports, synchronizes exact report routes and the sanitized scope catalog, and removes stale routes. It does not regenerate analysis snapshots. It defaults to no browser; `--browser` explicitly opens the system browser. It does not create an independent service Console. `--console` is a log observer, not a different service host. The startup contract is owned by [TrayWorkerPlan](../../../Documentation/TrayWorkerPlan.md#啟動入口start).

Confirm service status after synchronization before opening a URL. If the readiness procedure already ran `start` for the same unchanged registry, do not run it again. On an error or foreign service, report the failure and stop; do not stop/restart the service or loop startup to make navigation work. If synchronization alone was requested, no Browser navigation is needed. Otherwise obtain the Report URL with `open --no-browser` as above, open it in the pane, and verify the loaded page.

The Chrome bookmark form is:

```text
task-progress://open?scope=<scope-id>
```

## Publishing boundary

- Local generation does not authorize publishing.
- Copy only an explicitly approved public `report.json` to `<task-progress-root>\reports\<scope-id>\report.json` when the user asks to publish it.
- Do not copy `report.dev.json` to the public reports directory unless the user explicitly requests that exact action.
- Copy `time.analysis.json` only when the user approves publishing its capacity, estimates, deadline, and public exception labels. Its existence locally does not imply publication consent.
