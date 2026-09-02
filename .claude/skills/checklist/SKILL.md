---
name: checklist
description: Open a TaskProgress `.checklist` round in the in-app Browser pane by name. Use when the user asks to open, show, or look at a checklist — `/checklist <name>`, "開 checklist", "看一下 <name> 那份清單", a bare checklist stem with no other verb, or a recency word standing in for one (最近, 目前, 這輪, current, latest, recent).
---

# Open a Checklist

Put the named round's page in the Browser pane. `<name>` is a `.checklist` file
stem, never a path and never a `.checklist` filename.

This is the browser entrance and the only one it may use: the local service plus
the in-app Browser pane. Never fall back to `task-progress checklist <file>`,
which opens the WPF desktop host — a different entrance, and not the one asked
for here. A page that will not load is reported, not routed around.

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
`<scope-id>` is the registered scope owning that `checklists/` directory —
`task-progress` for this repository. The port is 8001 unless the user names
another.

Read the pane's tab list first (`tabs_context`) and pick the tool by what it
reports. With the pane open, navigate the existing active tab by its id —
opening a fresh tab leaves the user watching whichever tab they already had,
which reads as a page that failed to load. With the pane closed
(`browserOpen: false`), open it with `preview_start` carrying the url;
`navigate` is refused from that state.

Confirm what actually landed by reading the page (`get_page_text`), then report
the round identity and the check tally. The tab list's hidden/displayed flag
does not say whether the user can see the page — a tab id from an earlier call
can be gone, and the pane can be showing a blank tab while the tools still
answer for a stale one. The loaded URL and title are the evidence; that flag is
not.

## When it does not load

A failed navigation has two unrelated causes, and they are told apart before
anything is reported. Run `task-progress service status` — it reads the state
file and does not touch the tray. A live PID means the host is up and the
failure belongs to the pane: reopen it with `preview_start`. No service means
the host is down: say so and offer `task-progress start`, and do not start it
unasked. A bad name is neither, and was already settled while resolving the
stem.

To check a file's format rather than look at it, use
`task-progress checklist validate <file>` — console only, no window. The
document contract itself belongs to `.agents/skills/checklist-round/SKILL.md`.
