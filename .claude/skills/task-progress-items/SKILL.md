---
name: task-progress-items
description: The only entry for TaskProgress executable items in Claude — evaluate a project into items, write one instruction as an item and run it, run the execution queue, run the acceptance queue, or do all of it. Trigger only on the exact slash command `/task-progress-items` with its arguments (none, an instruction, `run`, `accept`, `auto`, optionally led by `self`, `manual`, `cross` or `cross manual`). Never trigger on paraphrases such as 「請繼續發展任務」 or 「請執行 … 的可執行項目」; answer those with the matching command instead.
---

# /task-progress-items

Design and the reasons behind every rule: `TaskProgress/Documentation/AcceptanceChainPlan.md`
(Task ID `checklist-acceptance-chain`). This skill is the procedure; the checklist format is
`TaskProgress/.agents/skills/checklist-round/SKILL.md`, report writes are
`TaskProgress/.agents/skills/task-progress-report/SKILL.md`, and what to evaluate is
`.agents/skills/agent-executable-items/SKILL.md` § Evaluate a scope.

## Commands

The scope is the project the session works in (its `report.json` `scope_id`, registered in
`task-progress.exe scope list`). Name another scope only when the user does.

| Command | Does |
|---|---|
| `/task-progress-items` | Evaluate the project and create items; run nothing |
| `/task-progress-items <instruction>` | Write that one instruction as an item, then execute it in this session |
| `/task-progress-items run [card or item ID]` | Execution queue |
| `/task-progress-items accept [card or item ID]` | Acceptance queue |
| `/task-progress-items auto` | Evaluate, execute and accept |

A leading `self`, `manual`, `cross` or `cross manual` forces the verification of the items it
creates; otherwise choose per item by the criteria below and report each choice with its reason.

When the user uses an old phrase (「請繼續發展任務」, 「請評估 <scope> 並建立可執行項目」,
「請執行 <scope> report 的可執行項目」, 「寫成可執行項目」), start nothing: reply with the matching
command, for example 「要評估並建立項目，請用 `/task-progress-items`」. Editing an existing
checklist or report on request follows those documents' own rules and starts no flow.

## Session identity

Every write in an item whose checklist has `[acceptance]` names the session. Use this
session's ID as shown at session start (the SessionStart hook's `session_id`); if none is
known, generate one UUID now and reuse it for the whole session. Report writes carry
`"actor": "claude", "session_id": "<id>"`; checklist writes carry
`"actor": "claude", "sessionId": "<id>"`.

## Verification and its checklist

| Choice | Checklist | Sessions |
|---|---|---|
| `self` | untagged checks only | 1 |
| `manual` | untagged + `[manual]` | 1, plus the user |
| `cross` | untagged + `[acceptance]` | 2: executor (may be the planner), acceptor |
| `cross manual` | all three | 2, plus the user |

Choose: user-only judgment (appearance, feel, the user's device) → add `manual`; a requirement
easy to misread (deriving implementation from a spec, changing a published spec, design data,
cases or code) → add `cross`; otherwise `self`.

Write one checklist per item, bound with `document_ref`, by the checklist-round contract:

- Untagged work items first: the executor's own checks.
- `cross`: a final acceptance work item whose first check is 「驗收條件未被改動」 (git shows the
  `[acceptance]` text unchanged since the commit that wrote it) and whose other checks each cite
  the spec section they compare against in `Action`. Write them from the original requirement,
  not from your steps.
- `manual`: a `[manual]` work item drafted now (what the user must accept); the executor adds
  links and details after execution.
- Do not write `Depends on` for tagged work items; the program orders them.
- Commit the checklist and the binding before anyone executes, even this session.

## Execute (`run`, and the instruction form)

1. Claim: `item.update` `status: in_progress` (records `started` with your session).
2. Do the work. Tick untagged checks in the file by the checklist-round marker rules. For a
   `cross` item, every commit message carries the item ID.
3. For `manual`, complete the `[manual]` drafts (links that answer, steps).
4. `task-progress checklist validate <file>`, commit, then release:
   `{"op": "item.event", "task_id": "<card>", "item_id": "<item>", "event": "released"}`.
5. A `cross` item now shows 待他驗: tell the user to run `/task-progress-items accept <item>`
   in another session. This session executed it and must not accept it.

Needs-fix items (an `[acceptance]` failed as 實作不符, or the user failed a `[manual]`): claim,
fix, commit with the item ID, release. Do not add work items for a fix whose `Expect` is
unchanged. If a fix changes something a `[manual]` already passed, mark that check `[!]` with
`Observed` naming the change (agents may only mark `[manual]` `[!]`).

Conditions-to-revise items (an `[acceptance]` failed as 條件不符) are the author's: if you agree,
revise the `[acceptance]` text, commit with the item ID and 「條件修訂」 in the message; if you
disagree, record `{"op": "item.event", …, "event": "disputed", "note": "<why>"}`. The acceptor who
raised it never revises it.

## Accept (`accept`)

Pick items whose `derived_state` (from `report get`) is `awaiting_acceptance` and that this
session never started or took over. For each `[acceptance]` check, after reading the cited spec
and `git log --grep <item-id>`:

```json
{"version":1,"id":"a1","type":"set","actor":"claude","sessionId":"<id>",
 "payload":{"workItemId":2,"checkIndex":1,"status":"failed","observed":"Spec 3.2 rounds half up; code truncates.","reason":"implementation"}}
```

piped to `task-progress checklist request --file <checklist>` (UTF-8 stdin). Use
`"reason":"condition"` when the condition itself contradicts the spec. Passing a check that
failed before needs `"resolved"`. The CLI refuses an executor's session, results before the
executor's checks pass, and `[manual]` `[x]` from an agent.

## Queues and sessions

Read `report get` and act on `derived_state`: `run` takes `not_started`, `in_progress` not
claimed by another session, `needs_fix` and `conditions_to_revise`; `accept` takes
`awaiting_acceptance`. Skip `waiting`, `awaiting_user` and `awaiting_user_dispute` (the user's),
and `done`. Order: priority, then card order. A card or item ID narrows the queue.

Several items: when this host can start sessions, start one per item, one at a time per scope —
wait for its completion notice before the next, and finish your own acceptance writes before
starting the next. Without that ability, `run`/`accept` stop after one item and name the next
candidate; `auto` executes everything itself and lists the `cross` items left for acceptance in
another session.

End every command with a short report: items created (verification and reason), executed,
accepted or rejected, and what waits on the user.
