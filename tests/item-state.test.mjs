import test from "node:test";
import assert from "node:assert/strict";
import { deriveItemState, waitLinks, waitsText } from "../viewer/assets/item-state.js";
import { checklistWorkItemDone, evaluateChecklistDocument, evaluateWaitTargets, projectTasksWithBindings, waitKey } from "../viewer/assets/document-binding.js";

const check = (overrides) => ({ status: "pending", effectiveStatus: "pending", validity: "valid", ...overrides });
const evaluation = (checks) => evaluateChecklistDocument({ items: [{ checks }] });
const at = (minutes) => new Date(Date.UTC(2026, 9, 22, 10, minutes)).toISOString();
const started = { activity: [{ event: "started", actor: "claude", session_id: "e", at: at(0) }] };

test("executor done, acceptance pending is awaiting acceptance; passed everywhere is done", () => {
  const untagged = check({ status: "passed", effectiveStatus: "passed" });
  assert.equal(deriveItemState(started, evaluation([untagged, check({ tag: "acceptance" })])), "awaiting_acceptance");
  const accepted = check({ tag: "acceptance", status: "passed", effectiveStatus: "passed", recorder: "claude:a" });
  assert.equal(deriveItemState(started, evaluation([untagged, accepted])), "done");
  assert.equal(deriveItemState(started, evaluation([check({})])), "in_progress");
  assert.equal(deriveItemState({}, evaluation([check({})])), "not_started");
});

test("an implementation failure needs a fix until a later release, then returns to acceptance", () => {
  const untagged = check({ status: "passed", effectiveStatus: "passed" });
  const failed = check({ tag: "acceptance", status: "failed", effectiveStatus: "failed", rejectReason: "implementation", recordedAt: at(10) });
  assert.equal(deriveItemState(started, evaluation([untagged, failed])), "needs_fix");
  const released = { activity: [...started.activity, { event: "released", actor: "claude", at: at(20) }] };
  assert.equal(deriveItemState(released, evaluation([untagged, failed])), "awaiting_acceptance");
});

test("condition mismatches go to revision, and a second mismatch or a dispute goes to the user", () => {
  const untagged = check({ status: "passed", effectiveStatus: "passed" });
  const condition = (count) => check({ tag: "acceptance", status: "failed", effectiveStatus: "failed", rejectReason: "condition", conditionCount: count, recordedAt: at(10) });
  assert.equal(deriveItemState(started, evaluation([untagged, condition(1)])), "conditions_to_revise");
  assert.equal(deriveItemState(started, evaluation([untagged, condition(2)])), "awaiting_user_dispute");
  const disputed = { activity: [...started.activity, { event: "disputed", actor: "claude", at: at(30), note: "條件正確" }] };
  assert.equal(deriveItemState(disputed, evaluation([untagged, condition(1)])), "awaiting_user_dispute");
});

test("manual waits for the user, and a void or agent-marked manual result also waits for the user", () => {
  const untagged = check({ status: "passed", effectiveStatus: "passed" });
  assert.equal(deriveItemState(started, evaluation([untagged, check({ tag: "manual" })])), "awaiting_user");
  const voided = check({ tag: "manual", status: "passed", effectiveStatus: "pending", validity: "fingerprint" });
  assert.equal(deriveItemState(started, evaluation([untagged, voided])), "awaiting_user");
  const userFailed = check({ tag: "manual", status: "failed", effectiveStatus: "failed", recorder: "user", recordedAt: at(10) });
  assert.equal(deriveItemState(started, evaluation([untagged, userFailed])), "needs_fix");
});

test("passes voided by a later release reopen acceptance before the user is asked again", () => {
  const untagged = check({ status: "passed", effectiveStatus: "passed" });
  const acceptance = check({ tag: "acceptance", status: "passed", effectiveStatus: "pending", validity: "released" });
  const manual = check({ tag: "manual", status: "passed", effectiveStatus: "pending", validity: "released", recorder: "user" });
  assert.equal(deriveItemState(started, evaluation([untagged, acceptance, manual])), "awaiting_acceptance");
  const reaccepted = check({ tag: "acceptance", status: "passed", effectiveStatus: "passed", recorder: "claude:a" });
  assert.equal(deriveItemState(started, evaluation([untagged, reaccepted, manual])), "awaiting_user");
});

test("waits show one link per card with its open count, and unreadable targets by name", () => {
  const web = "/?scope=web&pin=card";
  const pending = [
    { done: false, available: true, card: "Web [驗收](/?scope=web&pin=x)", label: "Web › A", href: web },
    { done: false, available: true, card: "Web [驗收](/?scope=web&pin=x)", label: "Web › B", href: web },
    { done: false, available: true, card: "Unity", label: "Unity › C", href: "/?scope=unity&pin=u" },
    { done: false, available: false, label: "gone › D", href: null },
  ];
  assert.equal(waitsText(pending),
    "等待：[Web 驗收](/?scope=web&pin=card)（2 項未完成）、[Unity](/?scope=unity&pin=u)（1 項未完成）、gone › D（無法讀取）");
});

test("the waiting capsule opens each waited card or checklist once, in order", () => {
  const web = "/?scope=web&pin=card";
  const pending = [
    { done: false, available: true, card: "Web [驗收](/?scope=web&pin=x)", label: "Web › A", href: web },
    { done: false, available: true, card: "Web [驗收](/?scope=web&pin=x)", label: "Web › B", href: web },
    { done: false, available: true, card: "ui.checklist", label: "ui.checklist 第 2 項", href: "/checklist/?scope=ux&task=ui" },
    { done: false, available: false, label: "gone › D", href: "/?scope=gone&pin=d" },
  ];
  assert.deepEqual(waitLinks(pending), [
    { href: web, label: "Web 驗收" },
    { href: "/checklist/?scope=ux&task=ui", label: "ui.checklist" },
    { href: null, label: "gone › D" },
  ]);
  assert.deepEqual(waitLinks([]), []);
});

test("waits make an unfinished item waiting and list links for unfinished targets", () => {
  const wait = { scope_id: "web", task_id: "card", item_id: "w1" };
  const item = { id: "u", title: "收尾", waits_for: [wait] };
  const pending = [{ done: false, available: true, card: "卡片", label: "卡片 › W1", href: "/?scope=web&pin=card" }];
  assert.equal(deriveItemState(item, null, pending), "waiting");
  assert.equal(waitsText(pending), "等待：[卡片](/?scope=web&pin=card)（1 項未完成）");
  const evaluations = new Map([[waitKey(wait), pending[0]]]);
  const [task] = projectTasksWithBindings([{ id: "t", status: "planned", pending_items: [item] }], evaluations);
  assert.equal(task.pending_items[0].derivedState, "waiting");
  assert.equal(task.pending_items[0].displayTitle, "收尾　等待：[卡片](/?scope=web&pin=card)（1 項未完成）");
  evaluations.set(waitKey(wait), { ...pending[0], done: true });
  const [cleared] = projectTasksWithBindings([{ id: "t", status: "planned", pending_items: [item] }], evaluations);
  assert.equal(cleared.pending_items[0].derivedState, undefined);
});

test("a wait on a checklist work item clears only when every check in that work item passes", async () => {
  const wait = { scope_id: "unity", checklist: "uitk-input", work_item: 5 };
  const item = { id: "u", title: "收尾", waits_for: [wait] };
  const tasks = [{ id: "t", status: "planned", pending_items: [item] }];
  const payload = (status) => ({ document: { items: [
    { id: 4, checks: [{ status: "passed" }] },
    { id: 5, checks: [{ status: "passed" }, { tag: "manual", status, effectiveStatus: status }] },
  ] } });
  const evaluate = (document) => evaluateWaitTargets(tasks, {
    createChecklistTransport: ({ scope, task }) => {
      assert.deepEqual([scope, task], ["unity", "uitk-input"]);
      return { load: async () => { if (!document) throw new Error("gone"); return document; } };
    },
  });
  const pending = await evaluate(payload("pending"));
  const [waiting] = projectTasksWithBindings(tasks, pending);
  assert.equal(waiting.pending_items[0].derivedState, "waiting");
  assert.equal(waiting.pending_items[0].displayTitle,
    "收尾　等待：[uitk-input.checklist](/checklist/?scope=unity&task=uitk-input)（1 項未完成）");
  const [cleared] = projectTasksWithBindings(tasks, await evaluate(payload("passed")));
  assert.equal(cleared.pending_items[0].derivedState, undefined);
  const missing = await evaluate(null);
  assert.deepEqual([missing.get(waitKey(wait)).done, missing.get(waitKey(wait)).available], [false, false]);
  assert.equal(checklistWorkItemDone(payload("passed"), 9), null);
});
