---
name: taskprogress-capabilities
description: Find the TaskProgress entrance that already exists — a CLI verb, a page the local service serves, or a documented skill — before building anything against a `.checklist` or `.decisions` file, a report, or a scope, and make sure the acting agent has its user-level TaskProgress entry (task-progress-items). Use when work in any project touches TaskProgress data, before creating a `.decisions` file to ask the user something, or before answering that some TaskProgress capability is missing.
---

# TaskProgress capabilities

An **entrance** is a shipped way in: a CLI verb, a page the local service serves, a documented
skill. TaskProgress has more entrances than any single router row names. This skill exists to stop
two failures: building a substitute for an entrance that already ships, and telling the user a
capability is absent after reading only part of the source.

## Initialize the user-level entry

TaskProgress keeps no agent-specific skill folder. Every agent reaches each shared procedure below
through one small entry in its own user-level skills directory, so the entries work from any
project. Check them whenever you are routed here; creating the acting agent's own entry needs no
further question.

| `<NAME>` | Shared source (in this repository) | `<DESCRIPTION>` |
|---|---|---|
| `task-progress-items` | `.agents/skills/task-progress-items/SKILL.md` | TaskProgress executable items — evaluate a project into items, write one instruction as an item and run it, run the execution or acceptance queue, or do all of it. Use only when the user explicitly invokes task-progress-items (in Claude Code, the /task-progress-items command); answer paraphrases with the invocation instead. |

For each row:

1. Use the user-level skills directory your own tool documents or reports. You only need yours;
   when you cannot confirm it, stop and ask the user.
2. Resolve `<SOURCE>` as the absolute path of the row's shared source in the TaskProgress
   repository the index routed you through. It must exist; never assume the session works inside
   TaskProgress.
3. Look at `<user skills directory>/<NAME>/SKILL.md`:
   - absent → create it with the template below, the placeholders replaced from the row;
   - present and identical to the filled template (ignoring line-ending style) → leave it;
   - present but different, or naming a source that does not exist → report a conflict with both
     contents and stop; never overwrite.
   Also report, without changing it, any project-level skill of the same name your tool would see
   beside the entry, since it would shadow or duplicate the entry.
4. Write only your own directory. Never move, rename or delete an entry anywhere else, even in a
   directory your tool does not read: another tool reads it.
5. Verify in your tool: in a new session, confirm the skill appears in its slash menu or skill list.
   Only then report it ready; otherwise report "created, not verified".
6. Initialization ends there: it starts no task, no queue and no acceptance. Do not use symbolic
   links.

The entry template (UTF-8, LF):

```markdown
---
name: <NAME>
description: <DESCRIPTION>
---

# <NAME> (user-level entry)

This entry holds no procedure. Before acting, read and follow the shared skill:

<SOURCE>

The scope is the project the user names or the project this session works in, never TaskProgress merely because the shared skill lives there. Created by taskprogress-capabilities § Initialize the user-level entry; do not edit by hand.
```

## Open-only requests

When the user asks only to open or show an existing `.checklist` or `.decisions` file, treat that
as navigation. Resolve the file and scope, [ensure the service](#ensure-the-checklist-service),
and navigate the Browser pane — nothing more.

Do not enumerate the capability surface, inspect the document for mistakes, run `validate` or
`request`, execute checks, change markers or answers, or diagnose the document. If the user
reports a parse or load error on the page, relay that error and stop. A request to open and also check or
validate authorizes only the additional action the user named.

## Enumerate the entrances first

For anything other than open-only, check all four sources before concluding a capability is
missing. Each is cheap; none is sufficient alone.

1. The CLI catalog: `PrintHelp()` in `src/TaskProgress.Cli/Program.cs`. Read the source; do not
   run the EXE to discover usage. It is a WinExe, a missing argument or subcommand `--help` opens a
   usage dialog on the user's screen, and no arguments means `start`. Families: `start`/`worker`,
   `analyze`, `report` (`get`/`validate`/`apply`), `checklist`, `decisions`, `open`, `scope`,
   `service`, `protocol`. The build is `Build/win-x64/task-progress.exe` and is **not** on `PATH`.
2. `.agents/skills/` in this repository — the only skill folder it keeps; agents see the
   user-facing ones through the entries in § Initialize the user-level entry.
3. `handoff.md`'s `## Current state`, newest entry first. A capability shipped days ago may exist
   nowhere else yet.
4. The Artifact list (`action: "list"` on the Artifact tool). A prototype from an earlier session
   is still something the user remembers.

## The entrances

| Want | Entrance |
|---|---|
| Create, run or accept executable items with verification options | The acting agent's user-level `task-progress-items` entry (§ Initialize the user-level entry), which routes to [task-progress-items](../task-progress-items/SKILL.md). |
| Open a task card pinned to the top of its report | `task-progress.exe open --scope <scope-id> --pin <task-id>` (or a report folder). See [Update existing Report through CLI](../task-progress-report/SKILL.md#update-existing-report-through-cli). |
| View or tick a `.checklist` round in a browser | The service's `/checklist/?scope=<scope-id>&task=<stem>` page in the Browser pane, reached as [Reaching the browser entrance from another project](#reaching-the-browser-entrance-from-another-project) says; the user normally opens it from the bound item on the Report card. Same read/write engine as the desktop host. |
| Write, mark, or complete a round | `.agents/skills/checklist-round/SKILL.md` — the document contract. |
| Check that a `.checklist` parses | `task-progress checklist validate <file>` — console only, non-zero exit on failure. |
| View or answer a `.decisions` file in a browser | `/decisions/?scope=<scope-id>&task=<stem>` (one file) or `/decisions/?scope=<scope-id>` (scope overview) in the Browser pane. Behavior: [DecisionItemsUsage](../../../Documentation/DecisionItemsUsage.md#browser-與-report). |
| Ask the user or record answers in a `.decisions` file without a browser | `task-progress decisions request --file <file>` (UTF-8 stdin `load`, then `confirm`/`reopen`/`revise` with the loaded revision); `decisions validate <file>` to check it. Request shapes: [DecisionItemsUsage](../../../Documentation/DecisionItemsUsage.md#agent-與本機請求). |
| Open a document outside the Browser pane | `task-progress checklist <file>` / `decisions <file>` — opens the service page in the system browser when the route is available, otherwise the native desktop editor. Not a fallback for a Browser-pane request. |
| Put clickable links inside Report descriptions | `[label](URL)` in the existing string; see [Inline links](../task-progress-report/SKILL.md#inline-links-in-report-descriptions). |
| Let a Checklist or Decision drive a Report item's completion | `document_ref` on the object item; see [Bind Checklist and Decision documents](../task-progress-report/SKILL.md#bind-checklist-and-decision-documents-document_ref). |
| Update report tasks and items | `task-progress report get|validate|apply`; see [the Report skill](../task-progress-report/SKILL.md#update-existing-report-through-cli). |
| Mark the one item a scope acts on now | The report's `next`: `report apply` `next.set`／`next.clear` ([CLI usage](../../../Documentation/ReportCliUsage.md#next-標記)); the user long-presses a row or presses Shift+Enter in the Viewer. Design: [NextMarkerPlan](../../../Documentation/NextMarkerPlan.md). |
| Give the user a stable reference to a card, item, decision or checklist work item | The Viewer's hover copy icons: an item copies `<scope-id> › <task-id> › <item-id>` (several selected items, one per line), a Report, Decision or Checklist card copies its ID; a pasted reference in the Report search box narrows to that item. [ItemReference](../../../Documentation/ItemReference.md). |
| List the registered scopes in a browser | The service root `http://127.0.0.1:8001/`; each Report links back to it with 「← Scopes 入口」. Console: `task-progress scope list`. |
| Report generation, time, cost, deadline risk | `.agents/skills/task-progress-report/SKILL.md`. |
| Ports, mounts, and routing for the local service | `LocalWebService`'s `skills/local-web-service/SKILL.md`. |

`<scope-id>` in these routes is the `scope_id` in the owning folder's `report.json` (lowercase, for
example `ux` for `UX/`), never the folder name; read it before composing a URL.

Checklist and Decision pages show a "← <report name>" link back to the same scope's Report on their own;
it needs no `document_ref` ([DocumentOwnerReport](../../../Documentation/DocumentOwnerReport.md)).

## When a question needs a decisions file

A `.decisions` file, with the Report card and binding its page requires, is for questions that need a
durable record. Create one only when at least one of these holds:

- the user asks for a decisions file or the decision page;
- the task is large enough that later sessions, agents or reviewers will rely on its answers;
- the task clearly needs a record of what was chosen and why, beyond the spec that results;
- the task is an automated workflow whose steps read the answers back from the file.

Judge by whether anyone or anything will read the answers back later, not by counting questions.
One question an automated workflow reads back still needs the file; several small details settled on
the spot and written straight into the spec do not. When no record is needed, ask in the
conversation, give the recommendation and the facts it rests on, and write the answer into the spec,
plan or handoff that the work updates. A small task with one or two questions is the common case of
this, not a threshold. Do not create a Report card, child item or binding just to host such a
question: their cost outweighs a question that needs no record.

## Reaching the browser entrance from another project

Build the checklist URL by hand; it works from any project. Three preconditions, in order:

1. The project carries `checklists/<stem>.checklist` or `decisions/<stem>.decisions`.
2. The project is a registered scope: `task-progress scope list` to check, `scope add <scope-id>
   <folder>` to add. `scope add` requires a `report.json` in that folder; a minimal
   `{"schema_version":"1.0","report_id":"…","scope_id":"…","title":"…","updated_at":"…","tasks":[]}`
   satisfies it without adopting TaskProgress reporting for that project. Say so when adding one, so
   an empty report is never mistaken for real tracked progress.
3. `open` has run per [Ensure the Checklist service](#ensure-the-checklist-service).

Then navigate the Browser pane to `/checklist/?scope=<scope-id>&task=<stem>` (or `/decisions/…`)
per that procedure's last step.

## Ensure the Checklist service

The shared procedure for opening Checklist, Decision, and Report pages: run `open`, then put the
URL in the Browser pane. It does not authorize stopping or replacing a running service. Report
route synchronization is in
[the Report skill](../task-progress-report/SKILL.md#start-or-synchronize-the-shared-viewer).

1. Resolve `Build/win-x64/task-progress.exe` from the TaskProgress repository, not the consuming
   project's working directory; use its absolute path.
2. Run `task-progress.exe open --scope <scope-id> --no-browser` (add `--pin <card-id>` when a card
   is the target; a report folder may replace `--scope`; `open` rejects `--port`) once, every
   time, with no HTTP check first: `open` goes through TrayHost, starting the tray and its service
   when they are not running, and registers the scope's routes; a port that answers says nothing
   about the scope. Contract:
   [TrayWorkerPlan](../../../Documentation/TrayWorkerPlan.md#開啟入口open資料夾參數與-protocol).
   Run it as a plain direct command, outside the sandbox, as the current ordinary Windows user
   (in Codex, `sandbox_permissions: "require_escalated"`), because startup writes scope/catalog
   state outside the workspace. The EXE is a WinExe that prints nothing and returns at once: do not
   wait for output or wrap it in `Start-Process` with redirected streams. Do not run `start`, use
   another launcher, `RunAs`, ACL changes or weakened pipe security; if unsandboxed execution is
   denied, give the user the absolute EXE command to run in a normal terminal. An old resident
   worker from an earlier build is exited by the user, never terminated automatically.
3. Navigate the Browser pane straight to the target URL, reusing the relevant tab and URL-encoding
   scope and task values: Report `http://127.0.0.1:8001/?scope=<scope-id>` (`&pin=<card-id>` for a
   card), Checklist `/checklist/?scope=<scope-id>&task=<stem>`, Decision `/decisions/…`. Do not
   probe the port, run `service status`, read the page back, or retry; the user sees the pane.

Only when the user says the page did not load, run `task-progress.exe service status` (with
`--port <port>` when one was requested) with redirected standard output — the direct call prints
nothing — and report what it says: connected output shows URL, PID, Instance, Viewer root and
registration count (there is no literal `Running`); not-started, an error or a foreign service is
reported as is. No loops, no `start`, no takeover or restart.
