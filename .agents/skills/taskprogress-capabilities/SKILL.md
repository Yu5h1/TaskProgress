---
name: taskprogress-capabilities
description: Find the TaskProgress entrance that already exists — a CLI verb, a page the local service serves, or a documented skill — before building anything against a `.checklist` or `.decisions` file, a report, or a scope. Use when work in any project touches TaskProgress data, before creating a `.decisions` file to ask the user something, or before answering that some TaskProgress capability is missing.
---

# TaskProgress capabilities

An **entrance** is a shipped way in: a CLI verb, a page the local service serves, a documented
skill. TaskProgress has more entrances than any single router row names. This skill exists to stop
two failures: building a substitute for an entrance that already ships, and telling the user a
capability is absent after reading only part of the source.

## Open-only requests

When the user asks only to open or show an existing `.checklist` or `.decisions` file, treat that
as navigation. Resolve the file and scope, [ensure the service](#ensure-the-checklist-service),
and navigate the Browser pane — nothing more.

Do not enumerate the capability surface, inspect the document for mistakes, run `validate` or
`request`, execute checks, change markers or answers, or diagnose the document. If the opened page
reports a parse or load error, relay that error and stop. A request to open and also check or
validate authorizes only the additional action the user named.

## Enumerate the entrances first

For anything other than open-only, check all four sources before concluding a capability is
missing. Each is cheap; none is sufficient alone.

1. The CLI catalog: `PrintHelp()` in `src/TaskProgress.Cli/Program.cs`. Read the source; do not
   run the EXE to discover usage. It is a WinExe, a missing argument or subcommand `--help` opens a
   usage dialog on the user's screen, and no arguments means `start`. Families: `start`/`worker`,
   `analyze`, `report` (`get`/`validate`/`apply`), `checklist`, `decisions`, `open`, `scope`,
   `service`, `protocol`. The build is `Build/win-x64/task-progress.exe` and is **not** on `PATH`.
2. `.agents/skills/` **and** `.claude/skills/` in this repository. `.claude/skills/` is invisible
   to a session rooted in another project, which is exactly where entrances get missed.
3. `handoff.md`'s `## Current state`, newest entry first. A capability shipped days ago may exist
   nowhere else yet.
4. The Artifact list (`action: "list"` on the Artifact tool). A prototype from an earlier session
   is still something the user remembers.

## The entrances (verified against source 2026-10-16)

| Want | Entrance |
|---|---|
| Open a task card pinned to the top of its report | `task-progress.exe open --scope <scope-id> --pin <task-id>` (or a report folder). See [Update existing Report through CLI](../task-progress-report/SKILL.md#update-existing-report-through-cli). |
| View or tick a `.checklist` round in a browser | `.claude/skills/checklist/SKILL.md` — the service's `/checklist/?scope=&task=` page in the Browser pane. Same read/write engine as the desktop host. |
| Write, mark, or complete a round | `.agents/skills/checklist-round/SKILL.md` — the document contract. |
| Check that a `.checklist` parses | `task-progress checklist validate <file>` — console only, non-zero exit on failure. |
| View or answer a `.decisions` file in a browser | `/decisions/?scope=<scope-id>&task=<stem>` (one file) or `/decisions/?scope=<scope-id>` (scope overview) in the Browser pane. Behavior: [DecisionItemsUsage](../../../Documentation/DecisionItemsUsage.md#browser-與-report). |
| Ask the user or record answers in a `.decisions` file without a browser | `task-progress decisions request --file <file>` (UTF-8 stdin `load`, then `confirm`/`reopen`/`revise` with the loaded revision); `decisions validate <file>` to check it. Request shapes: [DecisionItemsUsage](../../../Documentation/DecisionItemsUsage.md#agent-與本機請求). |
| Open a document outside the Browser pane | `task-progress checklist <file>` / `decisions <file>` — opens the service page in the system browser when the route is available, otherwise the native desktop editor. Not a fallback for a Browser-pane request. |
| Put clickable links inside Report descriptions | `[label](URL)` in the existing string; see [Inline links](../task-progress-report/SKILL.md#inline-links-in-report-descriptions). |
| Let a Checklist or Decision drive a Report item's completion | `document_ref` on the object item; see [Bind Checklist and Decision documents](../task-progress-report/SKILL.md#bind-checklist-and-decision-documents-document_ref). |
| Update report tasks and items | `task-progress report get|validate|apply`; see [the Report skill](../task-progress-report/SKILL.md#update-existing-report-through-cli). |
| Report generation, time, cost, deadline risk | `.agents/skills/task-progress-report/SKILL.md`. |
| Ports, mounts, and routing for the local service | `LocalWebService`'s `skills/local-web-service/SKILL.md`. |

`<scope-id>` in these routes is the `scope_id` in the owning folder's `report.json` (lowercase, for
example `ux` for `UX/`), never the folder name; read it before composing a URL.

Checklist and Decision pages show an "擁有者" link back to the same scope's Report on their own;
it needs no `document_ref` ([DocumentOwnerReport](../../../Documentation/DocumentOwnerReport.md)).

## When a question needs a decisions file

A `.decisions` file, with the Report card and binding its page requires, is for questions that need a
durable record. Create one only when at least one of these holds:

- the user asks for a decisions file or the decision page;
- the task is large — many questions, or answers that later sessions, agents or reviewers will rely on;
- the task clearly needs a record of what was chosen and why, beyond the spec that results;
- the task is an automated workflow whose steps read the answers back from the file.

A small task with one or two questions does not qualify: ask in the conversation, give the
recommendation and the facts it rests on, and write the answer into the spec, plan or handoff that
the work updates. Do not create a Report card, child item or binding just to host such a question.

## Reaching the browser entrance from another project

`/checklist` lives in `.claude/skills/`, so a session rooted in a consuming project cannot invoke
it — build the URL by hand instead. Three preconditions, in order:

1. The project carries `checklists/<stem>.checklist` or `decisions/<stem>.decisions`.
2. The project is a registered scope: `task-progress scope list` to check, `scope add <scope-id>
   <folder>` to add. `scope add` requires a `report.json` in that folder; a minimal
   `{"schema_version":"1.0","report_id":"…","scope_id":"…","title":"…","updated_at":"…","tasks":[]}`
   satisfies it without adopting TaskProgress reporting for that project. Say so when adding one, so
   an empty report is never mistaken for real tracked progress.
3. The service is running per [Ensure the Checklist service](#ensure-the-checklist-service).

Then open `/checklist/?scope=<scope-id>&task=<stem>` (or `/decisions/…`) on the confirmed port in
the Browser pane, reusing the relevant tab. Read the loaded URL and page content to confirm the
requested document loaded; a successful navigation call alone is insufficient.

## Ensure the Checklist service

The shared service-readiness procedure for opening Checklist, Decision, and Report pages. Opening
one includes starting the service when stopped. It does not authorize stopping or replacing a
running service. Report route synchronization is in
[the Report skill](../task-progress-report/SKILL.md#start-or-synchronize-the-shared-viewer).

1. Resolve `Build/win-x64/task-progress.exe` from the TaskProgress repository, not the consuming
   project's working directory; use its absolute path.
2. Run `task-progress.exe service status` (with `--port <port>` when explicitly requested). It
   connects to the service and checks its identity; do not substitute TrayHost liveness, a PID, an
   occupied port, or a state file.
   - **Connected**: output shows URL, PID, Instance, Viewer root, and registration count (there is
     no literal `Running`). Reuse it.
   - **Not started**: both outcomes can exit 0, so read the output. A health timeout can also
     produce not-started. Before startup, check TCP listeners on the port (default 8001), e.g. a
     successful `Get-NetTCPConnection -State Listen` filtered by `LocalPort`. If a listener remains
     or the check fails, report unavailable/unknown and stop.
   - **Error or foreign service**: report it; do not take over or restart.
3. Only when status is not-started and the port has no listener, run `task-progress.exe start`
   once, outside the sandbox, as the current ordinary Windows user, using the agent tool's approval
   mechanism (in Codex, `sandbox_permissions: "require_escalated"` — unsandboxed, not administrator).
   Startup writes scope/catalog state outside the workspace, so never launch the resident
   TrayHost/worker inside the sandbox. Do not use `RunAs`, change ACLs, or weaken pipe security.
   If unsandboxed execution is unavailable or denied, give the user the absolute EXE command to run
   in a normal terminal and resume after they start it; do not route around a denial through
   another launcher. `start` takes neither `--tray` nor `--port`; the worker uses
   `LauncherSettings.DefaultPort`. An old resident worker from an earlier build must be exited by
   the user before new commands work; do not terminate it automatically.
4. Run `service status` again in the ordinary-user context and require the connected output from
   step 2. Exit code 0 or a "tray ready" message alone is insufficient. If startup fails, the
   service stays unavailable, or its port differs from an explicitly requested port, report the
   actual error and stop: no loops, no second startup, no unverified link.
5. Open the page on the confirmed port in the Browser pane and give a clickable link, URL-encoding
   scope and task values. Read the loaded URL and page content. Report a load or parse error
   without claiming success or falling back to another UI.
