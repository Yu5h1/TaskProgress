// The scope's one Next marker: effective only while its item is unfinished and
// waits on nobody, lifted above every card and item, falling back to the
// derived next step. Design: Documentation/NextMarkerPlan.md.
import test from "node:test";
import assert from "node:assert/strict";

import {
  clearNextMarker,
  effectiveNext,
  fallbackNext,
  liftNextItem,
  liftNextTask,
  nextRefusal,
  resolveNext,
  setNextMarker,
} from "../viewer/assets/next-marker.js";
import { validateReport } from "../viewer/assets/report-model.js";

const tasks = () => [
  { id: "urgent", title: "U", status: "in_progress", summary: "u", priority: 0, pending_items: [{ id: "u1", title: "u1", priority: 0 }] },
  { id: "card", title: "C", status: "in_progress", summary: "c", priority: 2, pending_items: [
    { id: "wait", title: "w", priority: 0, derivedState: "waiting" },
    { id: "low", title: "l", priority: 3 },
    { id: "mid", title: "m", priority: 1 },
  ], completed_items: [{ id: "done", title: "d", status: "done" }] },
  { id: "pointer", kind: "report_pointer", title: "P", report_ref: { scope_id: "other" } },
];

test("the marker resolves only to an unfinished item that waits on nobody", () => {
  const list = tasks();
  assert.equal(resolveNext({ task_id: "card", item_id: "low" }, list)?.itemId, "low");
  assert.equal(resolveNext({ task_id: "card", item_id: "done" }, list), null, "a completed item is not a Next");
  assert.equal(resolveNext({ task_id: "card", item_id: "wait" }, list), null, "a waiting item is not a Next");
  assert.equal(resolveNext({ task_id: "card", item_id: "gone" }, list), null);
  assert.equal(resolveNext({ task_id: "pointer", item_id: "x" }, list), null);
  assert.equal(resolveNext(null, list), null);
  list[1].pending_items[1].derivedState = "awaiting_user";
  assert.equal(resolveNext({ task_id: "card", item_id: "low" }, list)?.itemId, "low", "an item in the user's hands is still the scope's Next");
});

test("the derived next step is the first unfinished, non-waiting item by card order then priority", () => {
  const list = tasks();
  assert.equal(fallbackNext(list)?.itemId, "u1");
  assert.equal(fallbackNext(list.slice(1))?.itemId, "mid", "waiting items are skipped, priority ranks the rest");
  assert.equal(fallbackNext([list[2]]), null);
  assert.equal(resolveNext({ task_id: "card", item_id: "done" }, list), null, "a stale marker resolves to nothing; effectiveNext shows the derived step");
});

test("the Next card and item lead, whatever their priority, and nothing else moves", () => {
  const list = tasks();
  assert.deepEqual(liftNextTask(list, "card").map((t) => t.id), ["card", "urgent", "pointer"]);
  assert.deepEqual(liftNextTask(list, "urgent").map((t) => t.id), ["urgent", "card", "pointer"]);
  assert.deepEqual(liftNextTask(list, null).map((t) => t.id), ["urgent", "card", "pointer"]);
  const items = list[1].pending_items;
  assert.deepEqual(liftNextItem(items, "mid").map((i) => i.id), ["mid", "wait", "low"]);
  assert.deepEqual(liftNextItem(items, "nope").map((i) => i.id), ["wait", "low", "mid"]);
});

test("setting and clearing the marker edits a copy and validates the target", () => {
  const report = { schema_version: "1.1", report_id: "r", scope_id: "r", title: "T", updated_at: "2026-10-23T00:00:00Z", tasks: tasks().slice(0, 2) };
  const set = setNextMarker(report, { taskId: "card", itemId: "low" });
  assert.deepEqual(set.next, { task_id: "card", item_id: "low" });
  assert.equal(report.next, undefined, "the source report is untouched");
  assert.deepEqual(validateReport(set), []);
  assert.throws(() => setNextMarker(report, { taskId: "card", itemId: "done" }));
  assert.throws(() => setNextMarker(report, { taskId: "none", itemId: "low" }));
  assert.equal(clearNextMarker(set).next, undefined);
  assert.equal(validateReport({ ...report, next: { task_id: "card" } }).length, 1, "both IDs are required");
  assert.equal(validateReport({ ...report, next: { task_id: "card", item_id: "low", extra: 1 } }).length, 1);
  assert.deepEqual(validateReport({ ...report, next: { task_id: "card", item_id: "gone" } }), [], "a stale target is derived, not refused");
});

test("a refused Next says why, for the warning popup", () => {
  const report = { tasks: [{ id: "card", pending_items: [{ id: "open" }, { id: "shelved", status: "archive" }], completed_items: [{ id: "finished", status: "done" }] }] };
  assert.equal(nextRefusal(report, { taskId: "card", itemId: "open" }), null);
  assert.equal(nextRefusal(report, { taskId: "card", itemId: "shelved" }), "已封存的子項目不能設為 Next。");
  assert.equal(nextRefusal(report, { taskId: "card", itemId: "finished" }), "已完成的子項目不能設為 Next。");
  assert.match(nextRefusal(report, { taskId: "card", itemId: "gone" }), /找不到子項目/u);
  assert.match(nextRefusal(report, { taskId: "none", itemId: "open" }), /找不到任務/u);
  assert.throws(() => setNextMarker(report, { taskId: "card", itemId: "shelved" }), /已封存/u);
});

test("an item someone is already working on is not the Next, and comes back when released", () => {
  const list = tasks();
  list[1].pending_items[2].status = "in_progress";
  assert.equal(resolveNext({ task_id: "card", item_id: "mid" }, list), null, "an unbound item claimed in progress");
  delete list[1].pending_items[2].status;
  list[1].pending_items[2].derivedState = "in_progress";
  assert.equal(resolveNext({ task_id: "card", item_id: "mid" }, list), null, "a bound item derived in progress");
  assert.equal(fallbackNext(list.slice(1))?.itemId, "low", "the derived step skips it");
  list[1].pending_items[2].derivedState = "not_started";
  assert.equal(effectiveNext({ task_id: "card", item_id: "mid" }, list)?.itemId, "mid", "the stored marker is effective again");
  list[1].pending_items[2].derivedState = "awaiting_acceptance";
  list[1].pending_items[2].status = "in_progress";
  assert.equal(resolveNext({ task_id: "card", item_id: "mid" }, list)?.itemId, "mid", "the derived state outranks the stored claim");
});

test("the shown Next is the stored marker, else the derived step, and nothing when cleared", () => {
  const list = tasks();
  assert.deepEqual(effectiveNext({ task_id: "card", item_id: "low" }, list) && [effectiveNext({ task_id: "card", item_id: "low" }, list).itemId, effectiveNext({ task_id: "card", item_id: "low" }, list).derived], ["low", false]);
  const stale = effectiveNext({ task_id: "card", item_id: "done" }, list);
  assert.deepEqual([stale.itemId, stale.derived], ["u1", true]);
  assert.equal(effectiveNext(undefined, list), null, "a cleared marker shows no Next");
  assert.equal(fallbackNext([...list].reverse())?.itemId, "u1", "the derived step follows priority, not the order the view passes");
});

test("a press on a row the Report shows as done, waiting or in progress is refused", () => {
  const report = { tasks: [{ id: "card", pending_items: [{ id: "open" }, { id: "claimed", status: "in_progress" }] }] };
  assert.equal(nextRefusal(report, { taskId: "card", itemId: "claimed" }), "執行中的子項目不能設為 Next。");
  assert.equal(nextRefusal(report, { taskId: "card", itemId: "open", derivedState: "waiting" }), "等待中的子項目不能設為 Next。");
  assert.equal(nextRefusal(report, { taskId: "card", itemId: "open", derivedState: "done" }), "已完成的子項目不能設為 Next。");
  assert.equal(nextRefusal(report, { taskId: "card", itemId: "claimed", derivedState: "awaiting_acceptance" }), null);
});
