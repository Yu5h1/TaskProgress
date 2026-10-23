// The scope's one Next marker: effective only while its item is unfinished and
// waits on nobody, lifted above every card and item, falling back to the
// derived next step. Design: Documentation/NextMarkerPlan.md.
import test from "node:test";
import assert from "node:assert/strict";

import {
  clearNextMarker,
  currentNext,
  fallbackNext,
  liftNextItem,
  liftNextTask,
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
  assert.equal(resolveNext({ task_id: "card", item_id: "low" }, list), null, "an item in the user's hands is not a Next");
});

test("the derived next step is the first unfinished, non-waiting item by card order then priority", () => {
  const list = tasks();
  assert.equal(fallbackNext(list)?.itemId, "u1");
  assert.equal(fallbackNext(list.slice(1))?.itemId, "mid", "waiting items are skipped, priority ranks the rest");
  assert.equal(fallbackNext([list[2]]), null);
  const derived = currentNext({ task_id: "card", item_id: "done" }, list);
  assert.equal(derived?.itemId, "u1");
  assert.equal(derived?.derived, true, "an ineffective marker falls back and says so");
  assert.equal(currentNext({ task_id: "card", item_id: "low" }, list)?.derived, false);
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
