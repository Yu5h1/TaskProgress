---
name: task-progress-report
description: Generate, update, validate, roll up, register, and locally deploy TaskProgress report.json, optional report.dev.json, and optional time.analysis.json for Yu5h1Lib scopes. Use when an agent is asked to create or refresh project or multi-project workspace progress, synthesize a portfolio report from routed child scopes or deliverables, estimate task or item time, publish deadline risk, onboard another workspace, prepare or register a scope, synchronize the shared all-scope localhost Viewer, or verify TaskProgress report data locally.
---

# TaskProgress report workflow

## Resolve paths

- Treat the directory containing the shared `.agents` folder as `<yu5h1lib-root>`.
- Treat `<yu5h1lib-root>\TaskProgress` as `<task-progress-root>`.
- Resolve `<task-progress-exe>` from the first existing path:
  1. `<task-progress-root>\Build\win-x64\task-progress.exe`
  2. `<task-progress-root>\artifacts\win-x64\task-progress.exe`
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

1. Use the target scope's `tasks.md` only to resolve tracked task IDs, ownership, and canonical entries; do not treat it as a progress source.
2. Start with the target project's `handoff.md` when present, then follow the canonical entry to the relevant plan or design record.
3. Load only the additional sources needed to establish report facts, such as issue files, implementation, and test results.
4. Prefer verified repository state over stale prose. Do not invent completion, blockers, totals, decisions, or claims.
5. Preserve stable `report_id`, `scope_id`, and task IDs when updating an existing report.

## Resolve scope level and roll-up coverage

- Treat every report directory as an independent scope. The same schema may describe a multi-project workspace, a project, or a narrower component; the Viewer and Launcher render one selected scope and do not infer hierarchy.
- Resolve the requested target first. Use that scope's `tasks.md` as the explicit inclusion and routing boundary; never recursively scan directories to discover report members.
- A workspace with `tasks.md` and a root report may validly have no root handoff. Follow each canonical route to the relevant child plan, handoff, report, and repository facts.
- Classify each workspace card as one of: a direct workspace task, a whole child-scope roll-up, or a selected child deliverable. Preserve mixed portfolios when that is the established report intent.
- Require the canonical route or routing note to make the card's coverage unambiguous. For a selected deliverable, record the covered child task IDs or a clear named boundary. Do not treat a deliverable marked `done` as proof that its whole child project is complete.
- For a whole child scope, summarize its current outcome and project-level milestones. For a selected deliverable, read only the covered child work. If coverage remains ambiguous, report the ambiguity and do not silently switch between whole-scope and deliverable semantics.
- Keep workspace `completed_items` and `pending_items` at workspace milestone granularity. Do not copy every descendant item or compute portfolio progress by summing unrelated descendant counts.
- Derive `blocked` only when no meaningful work inside the covered scope can proceed. Derive `done` only when that card's explicit coverage is complete. Never infer `archive`; it requires an explicit scope decision.
- Choose a workspace `next_step` for portfolio relevance: first a scope-stopping blocker, then an explicit child primary next step, then the next covered milestone. Do not copy an entire child backlog or select an arbitrary first pending item.
- Treat cross-scope synthesis as an Agent workflow. Deterministic aggregation, drill-down, or stale-roll-up detection requires explicit machine-readable parent/child coverage and is outside the current Viewer, Launcher, and schema behavior.

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

## Generate optional `time.analysis.json`

- Do not create time data merely because the Viewer supports it. Create or refresh it when the user requests time estimates or deadline risk, or when the target already maintains the sidecar.
- Prefer the published deterministic analyzer after the Agent or human has prepared any required engineering judgment:

```powershell
& "<task-progress-exe>" analyze "<project-root>"
```

  `analyze --scope <scope-id>` uses the shared registry. `--as-of <ISO timestamp>` fixes the clock for reproducible validation. `open` and `start` also refresh automatically when `time.config.json`, `time.estimates.json`, or `time.events.json` exists; projects without any time input remain unchanged.
- The analyzer can produce an estimate-only snapshot without a deadline. When invoked with only `report.json`, stable items missing active estimates receive the explicit low-confidence default. Do not treat this deterministic fallback as AI analysis.
- Treat `time.analysis.json` as a public, derived snapshot. Keep private work patterns, raw sessions, private leave reasons, prompts, and hidden reasoning in local inputs rather than this projection.
- Match `scope_id` to `report.json`. Match every `task_id` and `item_id` to stable IDs in the base report; do not guess correspondence from display text.
- Store durations as integer minutes. Display hours are derived presentation values, not the arithmetic source of truth.
- Preserve existing `analysis_id`, stable work IDs, algorithm IDs, and estimate lineage unless their identities genuinely change.
- Recompute deterministic values after changing progress, capacity, deadline, parameters, or estimates. Do not ask AI to redo arithmetic already covered by a registered formula.
- For `deterministic-capacity-feasibility` v0.3, sum calibrated estimates for unfinished items, compare that demand with remaining scheduled capacity first, and then use progress pressure as a secondary trend signal. A capacity shortfall is critical; capacity utilization above 80% is at least at risk. Preserve legacy v0.2 pressure-only snapshots when reading old sidecars.
- If required evidence is missing, emit an explicit low-confidence default estimate rather than inventing a precise range or historical basis.

## Generate optional `report.dev.json`

- Do not create the file merely to satisfy a template. Its absence is valid.
- Match `schema_version` and `report_id` with `report.json` exactly.
- Every developer task `id` must match an existing task in `report.json`; never guess a match.
- Use schema-supported fields for actionable next steps, blockers, stable decisions, route choices, and verified ownership details.
- Treat `claim` as a generated snapshot copied from the authoritative project `handoff.md`, not as a second live claim source.
- Do not place secrets, credentials, tokens, or unnecessary private data in either report.

## Validate before reporting completion

1. Parse `report.json` and parse `report.dev.json` when present.
2. Validate every property against the matching schema, including allowed values, ID patterns, required fields, lengths, and `additionalProperties: false`.
3. Confirm task IDs are unique.
4. If `report.dev.json` exists, confirm:
   - `schema_version` and `report_id` match the base report.
   - every overlay task ID exists in the base report.
5. If `time.analysis.json` exists, confirm:
   - it satisfies Draft 0.2 and has the same `scope_id` as `report.json`;
   - every analyzed task/item resolves to a stable base-report ID;
   - item totals, task totals, project total, estimate composition, capacity profile, and capacity timeline are arithmetically consistent;
  - direct unfinished estimate totals, remaining capacity, capacity balance, feasibility ratio, `evaluated_at`, work progress, time progress, pressure, risk basis, boundary state, and urgency reproduce for the same clock value;
   - only `public_label` is projected for capacity exceptions.
6. Confirm factual consistency with the source task documents and current repository/test state.
7. Launch the actual Viewer when `<task-progress-exe>` exists:

```powershell
& "<task-progress-exe>" "<project-root>"
```

8. Verify the generated URL uses `?scope=<scope-id>`, the Viewer loads, and no validation diagnostic appears. If `report.dev.json` is absent, confirm no `dev=` query and no Developer overlay. If `time.analysis.json` is absent, confirm the Viewer shows no time placeholders; if present, confirm the delivery capsule, item hours, and three detail tabs appear.
   For estimate-only analysis, confirm the neutral `交付日未定 ›` capsule, project/task/item estimates, and engineering details appear without a risk lamp, countdown, capacity tab, or deadline refresh.
9. Report the files written and the validation performed. Do not claim Viewer validation if only JSON parsing was performed.

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

After registering or refreshing one or more scopes, synchronize all registered workspaces:

```powershell
& "<task-progress-exe>" start
```

`start` must:

- Read every scope from the shared `scopes.json`.
- Validate every registered report before changing service routes.
- Start LocalWebService in an independent visible Console when no matching service is running.
- Register each base/developer/time-analysis report, remove stale routes for scopes no longer registered, and publish a sanitized scope catalog without local paths.
- Open `http://127.0.0.1:8001/`, where the user can select any registered scope.

Use `start --no-browser` when only synchronization is needed. If a compatible service is already running, `start` reuses it and cannot add a Console window retroactively. When the user explicitly wants a visible Console, check status first; obtain confirmation before stopping an existing service, then run:

```powershell
& "<task-progress-exe>" service stop
& "<task-progress-exe>" start
```

Press `Ctrl+C` in the LocalWebService Console for normal shutdown, or use `service stop`. Do not treat a state file alone as proof that the service is running; use `service status` or the health endpoint.

The Chrome bookmark form is:

```text
task-progress://open?scope=<scope-id>
```

## Publishing boundary

- Local generation does not authorize publishing.
- Copy only an explicitly approved public `report.json` to `<task-progress-root>\reports\<scope-id>\report.json` when the user asks to publish it.
- Do not copy `report.dev.json` to the public reports directory unless the user explicitly requests that exact action.
- Copy `time.analysis.json` only when the user approves publishing its capacity, estimates, deadline, and public exception labels. Its existence locally does not imply publication consent.
