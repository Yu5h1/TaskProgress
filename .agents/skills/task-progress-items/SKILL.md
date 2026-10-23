---
name: task-progress-items
description: Shared procedure for TaskProgress executable items — evaluate a project into items, write one instruction as an item and run it, run the execution queue, run the acceptance queue, or do all of it. Each agent reaches it through its own user-level task-progress-items entry (created by taskprogress-capabilities § Initialize the user-level entry); read it when that entry routes here.
---

# task-progress-items

The one shared procedure behind every agent's `task-progress-items` entry. Design and the reasons
behind every rule: [AcceptanceChainPlan](../../../Documentation/AcceptanceChainPlan.md) (Task ID
`checklist-acceptance-chain`). The checklist format belongs to
[checklist-round](../checklist-round/SKILL.md), report writes to
[task-progress-report](../task-progress-report/SKILL.md), and where an item lives, what to evaluate,
what qualifies and how an item's checklist is shaped to
[agent-executable-items](../../../../.agents/skills/agent-executable-items/SKILL.md).
This file only sequences them.

## Scope

The scope is the project the user names, or else the project the session works in: its
`report.json` `scope_id`, registered in `task-progress.exe scope list`. This skill lives in
TaskProgress; that never makes TaskProgress the scope. Resolve `task-progress.exe` from the
TaskProgress repository (`Build/win-x64/task-progress.exe`), not from the scope.

## Commands

The verbs are the same for every agent; how they are typed is in § Agent specifics. `<target>` is a
card or child item of the scope, resolved as § Resolve the target says.

| Form | Does |
|---|---|
| (none) | Same as `auto`: evaluate, do the direct work, execute and accept (user, 2026-10-23) |
| `plan [target]` | Evaluate the scope, create items and list direct work; run nothing. A card narrows it to that card. An item: report its `derived_state` and the command that acts on it; change nothing |
| `<target>` | Same as `auto <target>`: a card narrows all of it to that card, an item skips evaluation and executes then accepts that item |
| `<instruction>` | Write that one instruction as an item, then execute it in this session |
| `run [target]` | Execution queue; a card narrows it to that card's items, an item to that item |
| `accept [target]` | Acceptance queue, narrowed the same way |
| `auto [target]` | Evaluate, do the direct work, execute and accept; a card narrows all of it to that card, an item skips evaluation and executes then accepts that item |

### Resolve the target

Read `report get` for the scope. The argument is a target when it is, in this order: a card or item
ID; a pasted item reference `<scope-id> › <task-id> › <item-id>`; a card or item title matched
exactly, ignoring case and surrounding spaces. Several exact matches (one title on two cards) list
the candidates with their IDs and stop. Text that matches none of these is an instruction, except
when it partially matches a card or item title: then list those candidates with their IDs and stop,
creating nothing, so a misspelled card name never becomes a new item.

Evaluating a card reads the same sources as evaluating the scope, but creates only items whose work
belongs to that card; findings for other cards are named in the report with the command that starts
them, not created.

Evaluation never ends at a stop. A decision question it raises is answered on the spot when
[agent-executable-items § Evaluate a scope](../../../../.agents/skills/agent-executable-items/SKILL.md#evaluate-a-scope)
rates it low-risk: record the recommendation as the answer through `decisions request`
(`confirm`, the recommended `option_id`, `reason` 「採建議，未經使用者確認」) and continue; the
report names every answer taken this way so the user can overturn it on the decisions page. Other
questions wait for the user. Before sorting anything, read the scope's decisions files for answers
already given whose consequences are not yet in the plan, handoff or items, and act on those first.

A leading `self`, `manual`, `cross` or `cross manual` forces the verification of the items it
creates; otherwise choose per item by the criteria below and report each choice with its reason.

When the user uses an old phrase (「請繼續發展任務」, 「請評估 <scope> 並建立可執行項目」,
「請執行 <scope> report 的可執行項目」, 「寫成可執行項目」), no agent starts anything: reply with the
matching invocation. Editing an existing checklist or report on request
follows those documents' own rules and starts no flow.

## Verification and its checklist

| Choice | Checklist | Sessions |
|---|---|---|
| `self` | untagged checks only | 1 |
| `manual` | untagged + `[manual]` | 1, plus the user |
| `cross` | untagged + `[acceptance]` | 2: executor (may be the creator), acceptor |
| `cross manual` | all three | 2, plus the user |

Choose: user-only judgment (appearance, feel, the user's device) → add `manual`; a requirement easy
to misread (deriving implementation from a spec, changing a published spec, design data, cases or
code) → add `cross`; otherwise `self`.

Write one checklist per item, bound with `document_ref`, shaped as
[checklist-round § Tagged checks](../checklist-round/SKILL.md#tagged-checks) prescribes (untagged
work items first, `[acceptance]` conditions from the original requirement with their spec citations,
`[manual]` drafts, no `Depends on` on tagged work items). Commit the checklist and the binding before
anyone executes, even this session.

## Execute (`run`, and the instruction form)

1. Claim: `item.update` `status: in_progress` with your session identity.
2. Do the work. Tick untagged checks in the file by checklist-round's marker rules. For an item with
   `[acceptance]`, every commit message carries the item ID.
3. For `manual`, complete the `[manual]` drafts (links that answer, steps).
4. `task-progress.exe checklist validate <file>`, release
   (`{"op": "item.event", "task_id": "<card>", "item_id": "<item>", "event": "released"}`), then
   commit the work and the release's `report.json` change together, so an interruption never leaves
   only one of them saved.
5. An item with `[acceptance]` now shows 待他驗: hand it to an independent acceptance context
   (§ Independent acceptance). This context executed it and must not accept it, under any session
   ID.

Needs-fix items (an `[acceptance]` failed as 實作不符, or the user failed a `[manual]`): claim, fix,
release, commit with the item ID. Do not add work items for a fix whose `Expect` is unchanged. The
release voids every tagged pass recorded before it, so the acceptor and the user re-verify those as
well; nothing needs marking by hand.

### Recover a stale claim

A `run` candidate claimed by a session that has ended, whose work is committed but never released
(typically `needs_fix` with the fix already in `git log --grep <item-id>`, committed after the
failing result's `Recorded` time), needs only the release. Check that no uncommitted change touches
its paths, tell the user what you found, and on their yes release it with `"claim": "recover"`. This
records no takeover, so you are not its executor. Unfinished work is not a recovery: ask for a
takeover as task-progress-report's claim rule says. In `awaiting_acceptance` or `done` a stale claim
blocks nothing; leave it, because a release there would void the passes recorded since.

Conditions-to-revise items (an `[acceptance]` failed as 條件不符) belong to the author: if you agree,
revise the `[acceptance]` text and commit with the item ID and 「條件修訂」; if you disagree, record
`{"op": "item.event", …, "event": "disputed", "note": "<why>"}`. The acceptor who raised it never
revises it.

### Unbound items

An item with no bound checklist (one the user tracks by hand) is executable too, with no
verification stages:

1. `run` and `auto` take it in the same order as bound items, by its derived state (`not_started`,
   or `in_progress` not claimed by another session); `accept` never takes it.
2. Claim it, do the work, check the result against the item's title and description, and commit with
   the item ID.
3. Finish with `item.update` `status: done`, never `released`: release sets the status back to
   `planned`, and the item would return to the queue.
4. Evaluation counts it as existing work and never creates another item for it.

## Direct work

An evaluation finding becomes an item only when someone or something will read the record back: it
needs `[acceptance]` or `[manual]`, another item waits on it, it goes to another session, or the user
wants to follow it on the Report. Mechanical work whose commit alone shows the result and that nobody
will follow — moving or renaming files, fixing links — is direct work: no item, no checklist.

- `plan` lists it in the report, each with one sentence the user can hand to an agent.
- `auto` (and the bare form) does it in the evaluating session before executing items, commits each
  piece, and lists what it did in the report; it writes nothing to the Report.

## Independent acceptance

`[acceptance]` is recorded by an independent acceptance context: one that took no part in creating,
implementing or fixing the item and inherits none of the executor's conversation, reasoning or
expected conclusion. It judges from the original requirement, the committed conditions, the
artifacts and the change history; it may obtain execution facts, test evidence and operating steps;
it ignores any hint that it should pass and never lowers the bar to fit the implementation; it may
fail the work as 實作不符 or 條件不符, recording the grounds.

A new chat, a separate session, or a sub-agent started without the parent's context qualifies (per
tool: § Agent specifics). When the executor starts that sub-agent, the prompt names only the item
and the `accept` command. Staying in the executor's context and switching roles, or only changing
the session ID, does not qualify: the session ID records who wrote a result and lets the CLI refuse
the executor's; it is not independence. The acceptor may keep its own acceptance history and
re-verify the same item's fixes without a fresh context each time.

## Accept (`accept`)

Run only in an independent acceptance context. Pick items whose `derived_state` (from `report get`) is `awaiting_acceptance` and that this session
never created, started or took over, and whose conditions it never revised. For each `[acceptance]` check, after reading the cited spec and
`git log --grep <item-id>`, pipe a UTF-8 message to
`task-progress.exe checklist request --file <checklist>`. That includes checks already `[x]` whose
`load` snapshot shows `"validity": "released"`: they passed before the latest release and count as
pending until recorded again.

```json
{"version":1,"id":"a1","type":"set","actor":"<actor>","sessionId":"<session id>",
 "payload":{"workItemId":2,"checkIndex":1,"status":"failed","observed":"Spec 3.2 rounds half up; code truncates.","reason":"implementation"}}
```

`workItemId` counts from 1; `checkIndex` counts from 0 within that work item. Use
`"reason":"condition"` when the condition itself contradicts the spec. Passing a check that
failed before needs `"resolved"`. The CLI refuses the creator's or an executor's session, results before the
executor's checks pass, `[manual]` before every `[acceptance]` passes, and `[manual]` `[x]` from an
agent; a refusal is a reply with `"type":"error"` while the exit code stays 0, so read `type`.

## Queues and sessions

Read `report get` and act on `derived_state`, for bound and unbound items alike (§ Unbound items):
`run` takes `not_started`, `in_progress` not claimed by another session, `needs_fix` and
`conditions_to_revise` (not those whose condition you raised);
`accept` takes `awaiting_acceptance`. Skip `waiting`, `awaiting_user` and `awaiting_user_dispute`
(the user's) and `done`. Order: priority, then card order. A target narrows the queue; an item
target in a state the queue does not take is reported with its `derived_state`, never forced.

Several items: when this agent can start sessions (§ Agent specifics), start one per item, one at a
time per scope — wait for its completion notice before the next. An item with `[acceptance]` then
goes to an independent acceptance context, never this one when it created the item; wait for that
acceptance too before starting the next item. Without that ability, `run`/`accept` stop after one item and name
the next candidate; `auto` executes everything itself and hands the items with `[acceptance]` to an
independent acceptance context: a sub-agent started without this context when the tool has one,
otherwise listed for the user to accept from a new chat.

End every command with a short report: items created (verification and reason), decisions answered
by recommendation, direct work listed or done, items executed, accepted or rejected, problems
recorded as 「問題：」 items (AgentsRule § Core contract), and what waits on the user.

## Agent specifics

Every report write on an item whose checklist has `[acceptance]` carries `"actor"` and
`"session_id"`; every checklist write carries `"actor"` and `"sessionId"`.

| Agent | Command syntax | `actor` | Session ID | Starting sessions | Independent acceptance context |
|---|---|---|---|---|---|
| Claude Code | `/task-progress-items [verb …]` (user-level skill) | `claude` | The SessionStart hook's `session_id`; if none is shown, generate one UUID and reuse it for the session | The Claude desktop app can start sessions; the plain CLI cannot | A new chat or session; or an Agent-tool sub-agent of a non-fork type, which starts without this conversation |
| Codex | An explicit `$task-progress-items` skill mention | `codex` | The session ID the tool exposes; otherwise one generated UUID for the session | Treat as unavailable until documented | A new chat; or a sub-agent the tool starts without the parent's history, once confirmed for the version in use |
| Antigravity | The tool's own explicit invocation of the `task-progress-items` skill | `antigravity` | The session ID the tool exposes; otherwise one generated UUID for the session | Treat as unavailable until documented | A new chat; sub-agents count once documented to start without the parent's history |

A sub-agent without a session ID of its own generates one UUID and keeps it for its acceptance
history. No context changes its session ID to pass as another: a new ID does not make the same
context independent (§ Independent acceptance).
