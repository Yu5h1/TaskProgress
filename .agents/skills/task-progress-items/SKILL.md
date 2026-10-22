---
name: task-progress-items
description: Shared procedure for TaskProgress executable items — evaluate a project into items, write one instruction as an item and run it, run the execution queue, run the acceptance queue, or do all of it. Each agent reaches it through its own user-level task-progress-items entry (created by taskprogress-capabilities § Initialize the user-level entry); read it when that entry routes here.
---

# task-progress-items

The one shared procedure behind every agent's `task-progress-items` entry. Design and the reasons
behind every rule: [AcceptanceChainPlan](../../../Documentation/AcceptanceChainPlan.md) (Task ID
`checklist-acceptance-chain`). The checklist format belongs to
[checklist-round](../checklist-round/SKILL.md), report writes to
[task-progress-report](../task-progress-report/SKILL.md), and what to evaluate to
[agent-executable-items § Evaluate a scope](../../../../.agents/skills/agent-executable-items/SKILL.md#evaluate-a-scope).
This file only sequences them.

## Scope

The scope is the project the user names, or else the project the session works in: its
`report.json` `scope_id`, registered in `task-progress.exe scope list`. This skill lives in
TaskProgress; that never makes TaskProgress the scope. Resolve `task-progress.exe` from the
TaskProgress repository (`Build/win-x64/task-progress.exe`), not from the scope.

## Commands

The verbs are the same for every agent; how they are typed is in § Agent specifics.

| Verb | Does |
|---|---|
| (none) | Evaluate the scope and create items; run nothing |
| `<instruction>` | Write that one instruction as an item, then execute it in this session |
| `run [card or item ID]` | Execution queue |
| `accept [card or item ID]` | Acceptance queue |
| `auto` | Evaluate, execute and accept |

A leading `self`, `manual`, `cross` or `cross manual` forces the verification of the items it
creates; otherwise choose per item by the criteria below and report each choice with its reason.

When the user uses an old phrase (「請繼續發展任務」, 「請評估 <scope> 並建立可執行項目」,
「請執行 <scope> report 的可執行項目」, 「寫成可執行項目」), an agent whose entry is this command starts
nothing: it replies with the matching command. Editing an existing checklist or report on request
follows those documents' own rules and starts no flow.

## Verification and its checklist

| Choice | Checklist | Sessions |
|---|---|---|
| `self` | untagged checks only | 1 |
| `manual` | untagged + `[manual]` | 1, plus the user |
| `cross` | untagged + `[acceptance]` | 2: executor (may be the planner), acceptor |
| `cross manual` | all three | 2, plus the user |

Choose: user-only judgment (appearance, feel, the user's device) → add `manual`; a requirement easy
to misread (deriving implementation from a spec, changing a published spec, design data, cases or
code) → add `cross`; otherwise `self`.

Write one checklist per item, bound with `document_ref`, by checklist-round:

- Untagged work items first: the executor's own checks.
- `cross`: a final acceptance work item whose first check is 「驗收條件未被改動」 and whose other
  checks each cite the spec section they compare against in `Action`, written from the original
  requirement, not from your steps.
- `manual`: a `[manual]` work item drafted now (what the user must accept); the executor adds links
  and details after execution.
- No `Depends on` for tagged work items; the program orders them.
- Commit the checklist and the binding before anyone executes, even this session.

## Execute (`run`, and the instruction form)

1. Claim: `item.update` `status: in_progress` with your session identity.
2. Do the work. Tick untagged checks in the file by checklist-round's marker rules. For an item with
   `[acceptance]`, every commit message carries the item ID.
3. For `manual`, complete the `[manual]` drafts (links that answer, steps).
4. `task-progress.exe checklist validate <file>`, commit, then release:
   `{"op": "item.event", "task_id": "<card>", "item_id": "<item>", "event": "released"}`.
5. An item with `[acceptance]` now shows 待他驗: tell the user to accept it from another session.
   This session executed it and must not accept it.

Needs-fix items (an `[acceptance]` failed as 實作不符, or the user failed a `[manual]`): claim, fix,
commit with the item ID, release. Do not add work items for a fix whose `Expect` is unchanged. If a
fix changes something a `[manual]` already passed, mark that check `[!]` with `Observed` naming the
change.

Conditions-to-revise items (an `[acceptance]` failed as 條件不符) belong to the author: if you agree,
revise the `[acceptance]` text and commit with the item ID and 「條件修訂」; if you disagree, record
`{"op": "item.event", …, "event": "disputed", "note": "<why>"}`. The acceptor who raised it never
revises it.

## Accept (`accept`)

Pick items whose `derived_state` (from `report get`) is `awaiting_acceptance` and that this session
never started or took over. For each `[acceptance]` check, after reading the cited spec and
`git log --grep <item-id>`, pipe a UTF-8 message to
`task-progress.exe checklist request --file <checklist>`:

```json
{"version":1,"id":"a1","type":"set","actor":"<actor>","sessionId":"<session id>",
 "payload":{"workItemId":2,"checkIndex":1,"status":"failed","observed":"Spec 3.2 rounds half up; code truncates.","reason":"implementation"}}
```

Use `"reason":"condition"` when the condition itself contradicts the spec. Passing a check that
failed before needs `"resolved"`. The CLI refuses an executor's session, results before the
executor's checks pass, and `[manual]` `[x]` from an agent.

## Queues and sessions

Read `report get` and act on `derived_state`: `run` takes `not_started`, `in_progress` not claimed
by another session, `needs_fix` and `conditions_to_revise` (not those whose condition you raised);
`accept` takes `awaiting_acceptance`. Skip `waiting`, `awaiting_user` and `awaiting_user_dispute`
(the user's) and `done`. Order: priority, then card order. A card or item ID narrows the queue.

Several items: when this agent can start sessions (§ Agent specifics), start one per item, one at a
time per scope — wait for its completion notice before the next, and finish your own acceptance
writes before starting the next. Without that ability, `run`/`accept` stop after one item and name
the next candidate; `auto` executes everything itself and lists the items with `[acceptance]` left
for acceptance from another session.

End every command with a short report: items created (verification and reason), executed, accepted
or rejected, and what waits on the user.

## Agent specifics

Every report write on an item whose checklist has `[acceptance]` carries `"actor"` and
`"session_id"`; every checklist write carries `"actor"` and `"sessionId"`.

| Agent | Command syntax | `actor` | Session ID | Starting sessions |
|---|---|---|---|---|
| Claude Code | `/task-progress-items [verb …]` (user-level skill) | `claude` | The SessionStart hook's `session_id`; if none is shown, generate one UUID and reuse it for the session | The Claude desktop app can start sessions; the plain CLI cannot |
| Codex | The tool's own explicit skill invocation of `task-progress-items`, as the user aligns it | `codex` | The session ID the tool exposes; otherwise one generated UUID for the session | Treat as unavailable until documented |
| Gemini / Antigravity | The tool's own explicit skill invocation of `task-progress-items`, as the user aligns it | `antigravity` | The session ID the tool exposes; otherwise one generated UUID for the session | Treat as unavailable until documented |

A session never changes its session ID to pass as another session; independent acceptance needs a
genuinely separate session.
