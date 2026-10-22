---
name: checklist
description: Shared procedure for opening a TaskProgress `.checklist` round in the Browser pane by name. Each agent reaches it through its own user-level checklist entry (created by taskprogress-capabilities § Initialize the user-level entry); read it when that entry routes here.
---

# Open a Checklist

Put the named round's page in the Browser pane. `<name>` is a `.checklist` file
stem, never a path and never a `.checklist` filename.

This is the browser entrance and the only one it may use: the local service plus
the in-app Browser pane. Never fall back to `task-progress checklist <file>`,
which opens the system browser or the native desktop editor — a different
entrance, and not the one asked for here. A page that will not load is reported, not routed around.

## Scope

The scope is the project the user names, or else the project the session works in. This skill
lives in TaskProgress; that never makes TaskProgress the scope.

## Resolve the name

1. List the stems in the scope's `checklists/` directory.
2. An exact stem match wins outright.
3. A recency word — 最近, 目前, 現在, 這輪, 本輪, latest, current, recent,
   recently, active, last — asks for a round instead of naming one. Prefer the
   round still open: one carrying at least one check that is not `[x]`. Exactly
   one open round is the answer. With several open, or none open at all, take
   the most recently modified file; when none is open, say every round is
   finished, so the reader knows this is the latest rather than the active one.
   Name the round chosen and what chose it — a fuzzy word resolved silently
   fails the same way a wrong stem opened silently does.
4. Otherwise match on unique prefix, then unique substring.
5. Print the stems and stop when the match is ambiguous or absent, a tie on
   modification time included — a wrong round opened silently costs more than
   one extra question.
6. With no `<name>` given, print the stems and stop. Do not pick one.

## Open it

The page is `http://127.0.0.1:<port>/checklist/?scope=<scope-id>&task=<stem>`.
`<scope-id>` is the `scope_id` in the `report.json` of the folder owning that
`checklists/` directory, registered as
[Reaching the browser entrance from another project](../taskprogress-capabilities/SKILL.md#reaching-the-browser-entrance-from-another-project)
requires. Run `open` and navigate per
[Ensure the Checklist service](../taskprogress-capabilities/SKILL.md#ensure-the-checklist-service),
without waiting for output or checking the service or page. Name the resolved
round in the reply.

In the Claude desktop app, read the pane's tab list first (`tabs_context`) and
pick the tool by what it reports. With the pane open, navigate the existing
active tab by its id — opening a fresh tab leaves the user watching whichever
tab they already had, which reads as a page that failed to load. With the pane
closed (`browserOpen: false`), open it with `preview_start` carrying the url;
`navigate` is refused from that state. Other agents use their own Browser pane
the same way: reuse the tab the user is watching.

When the user says the page did not load, diagnose per that procedure's
closing paragraph.

To check a file's format rather than look at it, use
`task-progress checklist validate <file>` — console only, no window. The
document contract itself belongs to [checklist-round](../checklist-round/SKILL.md).
