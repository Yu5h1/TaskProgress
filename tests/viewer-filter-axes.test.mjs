// One tag vocabulary, applied at both levels. An earlier version of this file
// split task and item filtering into two capsule groups; the tags are now one
// set, and an item matches the two statuses it can actually carry.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ITEM_STATUS_FIELDS,
  filterTaskItems,
  stableSortByStatus,
  taskHasSelectedItem,
  taskMatchesSelection,
} from "../viewer/assets/status-order.js";

const task = (id, status, pending = [], completed = []) => ({
  id,
  status,
  pending_items: pending,
  completed_items: completed,
});

test("an item carries the two statuses its arrays stand for", () => {
  assert.deepEqual(ITEM_STATUS_FIELDS, {
    planned: "pending_items",
    done: "completed_items",
  });
});

test("a card survives by its own status or by holding a matching item", () => {
  const mixed = task("b", "in_progress", [{ id: "p1" }], [{ id: "c1" }]);
  const active = new Set(["in_progress"]);
  const planned = new Set(["planned"]);

  assert.equal(taskMatchesSelection(mixed, active), true);
  assert.equal(taskMatchesSelection(mixed, planned), false);
  assert.equal(taskHasSelectedItem(mixed, planned), true, "its pending item matches");
  assert.equal(taskHasSelectedItem(task("c", "done"), planned), false);
});

test("a surviving card shows only the items whose status is selected", () => {
  const mixed = task("b", "in_progress", [{ id: "p1" }], [{ id: "c1" }, { id: "c2" }]);

  const planned = filterTaskItems(mixed, new Set(["planned"]));
  assert.deepEqual(planned.pending_items.map((item) => item.id), ["p1"]);
  assert.deepEqual(planned.completed_items, [], "no completed item survives 待處理");

  const both = filterTaskItems(mixed, new Set(["planned", "done"]));
  assert.equal(both.pending_items.length, 1);
  assert.equal(both.completed_items.length, 2);
});

test("selecting a status an item cannot hold leaves the card with no items", () => {
  // Items are only ever waiting or finished, so 進行中 matches none of them.
  // That is the honest result until items gain a status of their own.
  const mixed = task("b", "in_progress", [{ id: "p1" }], [{ id: "c1" }]);
  const filtered = filterTaskItems(mixed, new Set(["in_progress"]));
  assert.deepEqual(filtered.pending_items, []);
  assert.deepEqual(filtered.completed_items, []);
});

test("an empty selection matches nothing at either level", () => {
  const mixed = task("b", "in_progress", [{ id: "p1" }], [{ id: "c1" }]);
  const none = new Set();
  assert.equal(taskMatchesSelection(mixed, none), false);
  assert.equal(taskHasSelectedItem(mixed, none), false);
});

test("filtering never reorders", () => {
  const tasks = [
    task("a", "done", [], [{ id: "c1" }]),
    task("b", "in_progress", [{ id: "p1" }]),
    task("c", "planned", [{ id: "p2" }]),
  ];
  const ordered = stableSortByStatus(tasks, ["in_progress", "planned", "done"]);
  assert.deepEqual(ordered.map((entry) => entry.id), ["b", "c", "a"]);

  const selected = new Set(["planned"]);
  const filtered = ordered
    .filter((entry) => taskMatchesSelection(entry, selected) || taskHasSelectedItem(entry, selected))
    .map((entry) => filterTaskItems(entry, selected));
  assert.deepEqual(filtered.map((entry) => entry.id), ["b", "c"], "order survives the filter");
});

test("the host filters both levels and lets 預設 choose the order", async () => {
  const app = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.match(app, /taskMatchesSelection\(task, selected\) \|\| taskHasSelectedItem\(task, selected\)/u);
  assert.match(app, /\.map\(\(task\) => filterTaskItems\(task, selected\)\)/u);
  // Leading 預設 means the report's own order: no grouping and no priority sort.
  assert.match(app, /state\.statusOrder\[0\] === DEFAULT_CAPSULE_ID\s*\?\s*state\.tasks/u);
  assert.match(app, /:\s*stableSortByStatus\(stableSortTasksByPriority\(state\.tasks\), state\.statusOrder\)/u);
  // 預設 is part of the persisted capsule order, so its position survives.
  assert.match(app, /const supportedCapsules = \[DEFAULT_CAPSULE_ID, \.\.\.supportedStatuses\]/u);
  assert.match(app, /loadStatusOrder\(statusOrderStorage, supportedCapsules\)/u);
});

test("the screen opens with everything selected and 預設 leading", async () => {
  const app = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  // An empty set is a deliberate "show nothing"; seeding the selection empty
  // would open the Viewer with no cards at all.
  assert.match(app, /selection: createFilterSelection\(supportedStatuses\)/u);
  assert.doesNotMatch(app, /createFilterSelection\(\[\]\)/u);
  // A saved order from before 預設 existed gets it placed first rather than
  // appended last, which would strand it and start everyone in grouped mode.
  assert.match(app, /function loadCapsuleOrder\(\)/u);
  assert.match(app, /\[DEFAULT_CAPSULE_ID, \.\.\.order\.filter\(\(id\) => id !== DEFAULT_CAPSULE_ID\)\]/u);
  assert.match(app, /statusOrder: loadCapsuleOrder\(\)/u);
});
