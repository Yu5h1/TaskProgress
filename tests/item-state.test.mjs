import test from "node:test";
import assert from "node:assert/strict";
import { deriveItemState, statusLinks, waitLinks, waitsText } from "../viewer/assets/item-state.js";
import { checklistWorkItemDone, documentBindingKey, evaluateChecklistDocument, evaluateWaitTargets, projectTasksWithBindings, waitKey } from "../viewer/assets/document-binding.js";

const check = (overrides) => ({ status: "pending", effectiveStatus: "pending", validity: "valid", ...overrides });
const evaluation = (checks) => evaluateChecklistDocument({ items: [{ checks }] });
const at = (minutes) => new Date(Date.UTC(2026, 9, 22, 10, minutes)).toISOString();
const started = { activity: [{ event: "started", actor: "claude", session_id: "e", at: at(0) }] };

test("a redo keeps its triggering target link after the dependency no longer blocks work", () => {
  const wait = { scope_id: "web", task_id: "card", item_id: "fixed" };
  const strictWait = { ...wait, item_id: "strict", strict: true };
  const unaffected = { ...wait, task_id: "other", item_id: "untouched" };
  const target = { done: false, onlyManual: true, userFailedAt: Date.parse(at(30)), available: true,
    card: "Web", label: "Web › Fixed", href: "/?scope=web&pin=card" };
  const evaluations = new Map([
    [waitKey(wait), target],
    [waitKey(strictWait), target],
    [waitKey(unaffected), { ...target, userFailedAt: null, card: "Other", href: "/?scope=web&pin=other" }],
  ]);
  const item = { ...started, id: "redo", title: "Redo", waits_for: [wait, strictWait, unaffected] };
  const project = (value) => projectTasksWithBindings([{ id: "t", pending_items: [value] }], evaluations)[0].pending_items[0];
  const projected = project(item);
  assert.equal(projected.derivedState, "needs_fix");
  assert.deepEqual(projected.redoTargets, [target], "only the non-strict rejected target triggers redo");
  assert.deepEqual(statusLinks(projected), [{ href: target.href, label: "Web" }], "pending and redo targets deduplicate");
  const lifted = project({ ...item, waits_for: [wait, unaffected] });
  assert.deepEqual(lifted.pendingWaits, []);
  assert.equal(lifted.derivedState, "needs_fix");
  assert.deepEqual(statusLinks(lifted), [{ href: target.href, label: "Web" }]);
  const released = project({ ...item, waits_for: [wait], activity: [...started.activity, { event: "released", at: at(40) }] });
  assert.equal(released.derivedState, undefined, "a later release clears the redo and its link");
  assert.deepEqual(statusLinks(released), []);
});

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

test("a waited item with no status counts as done when it sits in completed_items", async () => {
  const other = { tasks: [{ id: "card", title: "卡片", pending_items: [{ id: "open", title: "o" }], completed_items: [{ id: "finished", title: "f" }] }] };
  const fetchImpl = async () => ({ ok: true, json: async () => other });
  const waits = [{ scope_id: "web", task_id: "card", item_id: "finished" }, { scope_id: "web", task_id: "card", item_id: "open" }];
  const results = await evaluateWaitTargets([{ id: "t", pending_items: [{ id: "u", waits_for: waits }] }], { fetchImpl });
  assert.equal(results.get(waitKey(waits[0])).done, true, "completed_items without status is done");
  assert.equal(results.get(waitKey(waits[1])).done, false, "pending_items without status is not");
});

test("a wait is met while the waited item lacks only the user's acceptance, and a user failure sends started waiters back", async () => {
  const bound = (id) => ({ id, title: id, document_ref: { kind: "checklist", scope_id: "web", task: id } });
  const fixed = { ...bound("fixed"), activity: [{ event: "released", actor: "claude", at: at(35) }] };
  const other = { tasks: [{ id: "card", title: "卡片", pending_items: [bound("only-manual"), bound("user-failed"), bound("work-open"), fixed] }] };
  const documents = {
    "only-manual": [{ status: "passed" }, { tag: "manual", status: "pending" }],
    "user-failed": [{ status: "passed" }, { tag: "manual", status: "failed", effectiveStatus: "failed", recorder: "user", recordedAt: at(30) }],
    "work-open": [{ status: "pending" }, { tag: "manual", status: "pending" }],
    fixed: [{ status: "passed" }, { tag: "manual", status: "failed", effectiveStatus: "pending", recorder: "user", recordedAt: at(30) }],
  };
  const on = (item_id, extra = {}) => ({ scope_id: "web", task_id: "card", item_id, ...extra });
  const event = (name, minutes) => ({ event: name, actor: "claude", at: at(minutes) });
  const waiters = [
    { id: "lifted", title: "l", waits_for: [on("only-manual")] },
    { id: "strict", title: "s", waits_for: [on("only-manual", { strict: true })] },
    { id: "work-pending", title: "w", waits_for: [on("work-open")] },
    { id: "redo", title: "r", waits_for: [on("user-failed")], activity: [event("started", 0)] },
    { id: "redone", title: "rd", waits_for: [on("user-failed")], activity: [event("started", 0), event("released", 40)] },
    { id: "never-started", title: "n", waits_for: [on("user-failed")] },
    { id: "strict-failed", title: "sf", waits_for: [on("user-failed", { strict: true })], activity: [event("started", 0)] },
    { id: "redo-after-fix", title: "raf", waits_for: [on("fixed")], activity: [event("started", 0)] },
    { id: "redone-after-fix", title: "rdf", status: "in_progress", waits_for: [on("fixed")], activity: [event("started", 0), event("released", 40)] },
  ];
  const doneThenFailed = { id: "done-then-failed", title: "d", status: "done", waits_for: [on("user-failed")],
    activity: [event("started", 0), event("done", 10)] };
  const tasks = [{ id: "t", status: "in_progress", pending_items: waiters, completed_items: [doneThenFailed] }];
  const evaluations = await evaluateWaitTargets(tasks, {
    fetchImpl: async () => ({ ok: true, json: async () => other }),
    createChecklistTransport: ({ task }) => ({ load: async () => ({ document: { items: [{ checks: documents[task] }] } }) }),
  });
  assert.equal(evaluations.get(waitKey(on("only-manual"))).onlyManual, true);
  assert.equal(evaluations.get(waitKey(on("work-open"))).onlyManual, false);
  const [task] = projectTasksWithBindings(tasks, evaluations);
  const state = (id) => [...task.pending_items, ...task.completed_items].find((item) => item.id === id)?.derivedState;
  assert.equal(state("lifted"), undefined, "met: only the user's acceptance is left");
  assert.equal(state("strict"), "waiting", "a strict wait holds");
  assert.equal(state("work-pending"), "waiting", "open work keeps the wait");
  assert.equal(state("redo"), "needs_fix", "a started waiter is redone after the user's failure");
  assert.equal(state("redone"), "waiting", "released after the failure: it waits for the fix");
  assert.equal(state("never-started"), "waiting");
  assert.equal(state("strict-failed"), "waiting");
  assert.equal(state("done-then-failed"), "needs_fix", "a waiter done before the failure cannot stay done");
  assert.equal(state("redo-after-fix"), "needs_fix", "the failure on file keeps the redo after the waited fix is released");
  assert.equal(state("redone-after-fix"), undefined, "a waiter released after the failure is not sent back again");
  assert.ok(task.pending_items.some((item) => item.id === "done-then-failed"), "the redone item moves back to pending");
});

test("a retired item keeps its retirement over its checklist, waits and redo, and leaves the card's progress", () => {
  const ref = { kind: "checklist", scope_id: "web", task: "gone" };
  const evaluations = new Map([[documentBindingKey(ref), evaluation([check({ status: "pending" })])]]);
  const items = [
    { id: "obs", title: "o", status: "obsolete", retirement: { replaced_by: { scope_id: "web", task_id: "t", item_id: "live" } }, document_ref: ref },
    { id: "dis", title: "d", status: "discontinued", retirement: { reason: "前提不成立" }, waits_for: [{ scope_id: "web", task_id: "t", item_id: "x" }] },
    { id: "live", title: "l", status: "done" },
  ];
  assert.equal(deriveItemState(items[1], null, [{ done: false }], true), "discontinued");
  const [task] = projectTasksWithBindings([{ id: "t", status: "in_progress", pending_items: items.slice(0, 2), completed_items: [items[2]] }], evaluations);
  const byId = Object.fromEntries([...task.pending_items, ...task.completed_items].map((item) => [item.id, item]));
  assert.equal(byId.obs.derivedState, "obsolete");
  assert.equal(byId.obs.derivedStateLabel, "已取代");
  assert.equal(byId.dis.derivedStateLabel, "已棄案");
  assert.equal(task.status, "done", "retired items leave the card's count like archived ones");
});
