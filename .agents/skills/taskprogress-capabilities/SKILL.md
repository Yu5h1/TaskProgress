---
name: taskprogress-capabilities
description: Find the TaskProgress entrance that already exists — a CLI verb, a page the local service serves, or a documented skill — before building anything against a `.checklist` file, a report, or a scope. Use when work in any project touches TaskProgress data, or before answering that some TaskProgress capability is missing.
---

# TaskProgress capabilities

An **entrance** is a shipped way in: a CLI verb, a page the local service serves, a documented
skill. TaskProgress has more entrances than any single router row names, and the failure this skill
exists to stop is building a substitute for one that already ships — or telling the user a
capability is absent after reading only the source.

## Open-only requests

When the user asks only to open or show an existing `.checklist`, treat that as navigation, not
inspection or round execution. Use the recorded entrance below and perform only the routing needed
to reach it, such as resolving the requested file or scope, checking whether the required service
is available, and navigating the Browser pane.

Do not enumerate the whole capability surface, inspect the checklist contents for mistakes, run
`checklist validate` or `checklist request`, execute any checks, change markers, or diagnose the
document. If the opened UI itself reports a parse or load error, relay that observed error and stop;
inspect, validate, or troubleshoot only after the user explicitly asks for that work. A request to
open and also check or validate authorizes only the additional action the user named.

## Enumerate the entrances first

Except for the open-only path above, use four sources. All cheap, none sufficient alone; reading source and finding no implementation
settles nothing until all four are checked.

1. `task-progress.exe` with no arguments prints every command family: service (`start`, `worker`,
   `service`), reports (`analyze`, `open`, `scope`), `checklist` (`validate`, `request`, `install`),
   `protocol`. The build sits at `Build/win-x64/task-progress.exe` and is **not** on `PATH`.
2. `.agents/skills/` **and** `.claude/skills/` in this repository — list both directories. Each
   `SKILL.md` is a shipped capability. A router row names the closest single match, never the whole
   surface; and `.claude/skills/` is invisible to a session rooted in another project, which is
   exactly where this goes wrong.
3. `handoff.md`'s `## Current state`, newest entry first. A capability that shipped days ago may
   exist nowhere else yet.
4. The Artifact list (`action: "list"` on the Artifact tool). A working prototype from an earlier
   session is still something shipped, and still something the user remembers.

## The entrances, last verified 2026-09-04

| Want | Entrance |
|---|---|
| View or tick a `.checklist` round in a browser | `.claude/skills/checklist/SKILL.md` — the local service's `/checklist/?scope=&task=` page in the Browser pane. Real read/write to the file, same engine as the WPF host. |
| Write, mark, or complete a round | `.agents/skills/checklist-round/SKILL.md` — the document contract. Authorship, not viewing. |
| Check that a `.checklist` parses | `task-progress checklist validate <file>` — console only, non-zero exit on failure, no window. |
| Edit a round without a browser | `task-progress checklist <file>` — the native WPF host. A different entrance from the browser page; the browser skill forbids falling back to it. |
| Report generation, time, cost, deadline risk | `.agents/skills/task-progress-report/SKILL.md`. |
| Ports, mounts, and routing for the local service | `LocalWebService`'s `skills/local-web-service/SKILL.md`. |

## Reaching the browser entrance from another project

`/checklist` lives in `.claude/skills/`, so a session rooted in a consuming project cannot invoke
it — build the URL by hand instead. Three preconditions, in order:

1. The project carries `checklists/<task-id>.checklist`.
2. The project is a registered scope: `task-progress scope list` to check, `scope add <scope-id>
   <folder>` to add. `scope add` requires a `report.json` in that folder; a minimal
   `{"schema_version":"1.0","report_id":"…","scope_id":"…","title":"…","updated_at":"…","tasks":[]}`
   satisfies it without adopting TaskProgress reporting for that project. Say so when adding one, so
   an empty report is never mistaken for real tracked progress.
3. The service is running: `task-progress service status`. **Never start it unasked** — offer
   `task-progress start` and wait.

Then open `http://127.0.0.1:8001/checklist/?scope=<scope-id>&task=<stem>` — `preview_start` carrying
the URL when the Browser pane is closed, otherwise navigate the tab already active. Confirm what
landed with `get_page_text`; a navigation that silently failed looks identical to one that worked
until the page is read.
