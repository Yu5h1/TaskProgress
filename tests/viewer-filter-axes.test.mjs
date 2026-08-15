// Task status and item status are two independent filter axes. Both only hide;
// neither reorders.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ITEM_VIEW_STATUSES,
  filterTaskItems,
  stableSortByStatus,
  taskMatchesItemStatus,
  taskMatchesViewStatus,
} from "../viewer/assets/status-order.js";

const task = (id, status, pending = [], completed = []) => ({
  id,
  status,
  pending_items: pending,
  completed_items: completed,
});

test("a task status matches only that status", () => {
  const planned = task("a", "planned", [{ id: "p1" }]);
  const active = task("b", "in_progress", [{ id: "p2" }], [{ id: "c1" }]);

  assert.equal(taskMatchesViewStatus(planned, "planned"), true);
  assert.equal(taskMatchesViewStatus(active, "in_progress"), true);
  // The overload is gone: having pending items no longer makes a task planned,
  // which is what left completed items on screen.
  assert.equal(taskMatchesViewStatus(active, "planned"), false);
});

test("an item status keeps the cards that hold one", () => {
  assert.deepEqual([...ITEM_VIEW_STATUSES], ["pending", "completed"]);

  const done = task("a", "done", [], [{ id: "c1" }]);
  const mixed = task("b", "in_progress", [{ id: "p1" }], [{ id: "c2" }]);

  assert.equal(taskMatchesItemStatus(done, "pending"), false);
  assert.equal(taskMatchesItemStatus(done, "completed"), true);
  assert.equal(taskMatchesItemStatus(mixed, "pending"), true);
  assert.equal(taskMatchesItemStatus(mixed, "completed"), true);
});

test("a surviving card shows only the items that matched", () => {
  const mixed = task("b", "in_progress", [{ id: "p1" }], [{ id: "c1" }, { id: "c2" }]);

  const pendingOnly = filterTaskItems(mixed, "pending");
  assert.deepEqual(pendingOnly.pending_items.map((item) => item.id), ["p1"]);
  assert.deepEqual(pendingOnly.completed_items, [], "no completed item survives 未完成");

  const completedOnly = filterTaskItems(mixed, "completed");
  assert.deepEqual(completedOnly.completed_items.map((item) => item.id), ["c1", "c2"]);
  assert.deepEqual(completedOnly.pending_items, []);

  // An unknown axis leaves the task exactly as it was.
  assert.equal(filterTaskItems(mixed, "bogus"), mixed);
});

test("filtering never reorders", () => {
  const tasks = [
    task("a", "done", [], [{ id: "c1" }]),
    task("b", "in_progress", [{ id: "p1" }]),
    task("c", "planned", [{ id: "p2" }]),
  ];
  const ordered = stableSortByStatus(tasks, ["in_progress", "planned", "done"]);
  assert.deepEqual(ordered.map((entry) => entry.id), ["b", "c", "a"]);

  // Applying either axis preserves that order; order comes from the capsule
  // drag order alone.
  const filtered = ordered
    .filter((entry) => taskMatchesItemStatus(entry, "pending"))
    .map((entry) => filterTaskItems(entry, "pending"));
  assert.deepEqual(filtered.map((entry) => entry.id), ["b", "c"]);
});

test("the strip carries both groups and only the task group drags", async () => {
  const source = await readFile(
    new URL("../experiments/editor-svelte-spike/src/StatusFilters.svelte", import.meta.url),
    "utf8",
  );
  assert.equal((source.match(/<FilterStrip/gu) ?? []).length, 2);
  assert.match(source, /categories=\{taskCategories\}[\s\S]*?reorderable=\{true\}/u);
  // Item capsules filter only; they never join the drag order.
  assert.match(source, /sortable: false,/u);
  const itemStrip = source.slice(source.indexOf("{#if itemCategories.length}"));
  assert.doesNotMatch(itemStrip, /reorderable/u);
  assert.doesNotMatch(itemStrip, /onReorder/u);
});

test("the host applies both axes and keeps ordering above them", async () => {
  const app = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.match(app, /itemFilter: null,/u);
  assert.match(app, /taskMatchesItemStatus\(task, state\.itemFilter\)/u);
  assert.match(app, /filterTaskItems\(task, state\.itemFilter\)/u);
  // Selecting the active item capsule again clears that axis.
  assert.match(app, /state\.itemFilter = state\.itemFilter === itemFilter \? null : itemFilter;/u);
  // Ordering happens before filtering and is not re-sorted afterwards.
  const render = app.slice(app.indexOf("function renderTasks()"));
  assert.ok(
    render.indexOf("stableSortByStatus") < render.indexOf("state.itemFilter"),
    "ordering must not depend on the filter",
  );
});
