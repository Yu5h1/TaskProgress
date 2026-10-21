import test from "node:test";
import assert from "node:assert/strict";
import { moveUnfinishedItem } from "../viewer/assets/item-reorder.js";

const report = () => ({
  tasks: [{
    id: "work",
    pending_items: ["legacy text", { id: "a", title: "A" }, { id: "b", title: "B" }, { id: "c", title: "C" }],
    completed_items: [{ id: "done", title: "Done", status: "done" }],
  }],
});

test("moves one unfinished item by stable ID and leaves everything else untouched", () => {
  const source = report();
  const moved = moveUnfinishedItem(source, { taskId: "work", itemId: "c", position: { before: "a" } });
  assert.deepEqual(moved.tasks[0].pending_items.map(item => item.id ?? item), ["legacy text", "c", "a", "b"]);
  assert.equal(moved.tasks[0].pending_items[0], "legacy text");
  assert.deepEqual(moved.tasks[0].completed_items, source.tasks[0].completed_items);
  assert.deepEqual(source.tasks[0].pending_items.map(item => item.id ?? item), ["legacy text", "a", "b", "c"]);
  assert.deepEqual(moveUnfinishedItem(source, { taskId: "work", itemId: "a", position: { after: "c" } }).tasks[0].pending_items.map(item => item.id ?? item), ["legacy text", "b", "c", "a"]);
});

test("rejects invalid positions, missing items and completed items", () => {
  for (const command of [
    { taskId: "work", itemId: "a", position: {} },
    { taskId: "work", itemId: "a", position: { before: "b", after: "c" } },
    { taskId: "work", itemId: "a", position: { before: "a" } },
    { taskId: "work", itemId: "missing", position: { before: "a" } },
    { taskId: "work", itemId: "done", position: { before: "a" } },
    { taskId: "work", itemId: "a", position: { before: "done" } },
    { taskId: "other", itemId: "a", position: { before: "b" } },
  ]) assert.throws(() => moveUnfinishedItem(report(), command));
});
