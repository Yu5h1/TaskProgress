// The Checklist filter bar is one horizontal strip carrying both groups, with
// capsules the reader can reorder. Order is a per-user preference; work item
// order stays the document's.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CHECKLIST_FILTER_ORDER_STORAGE_KEY,
  createChecklistFilterOrder,
} from "../viewer/assets/checklist-filter-order.js";

const IDS = ["status:pending", "status:passed", "status:failed", "owner:manual", "owner:agent"];

function fakeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
  };
}

const app = await readFile(
  new URL("../experiments/editor-svelte-spike/src/ChecklistApp.svelte", import.meta.url),
  "utf8",
);
const strip = await readFile(
  new URL("../experiments/editor-svelte-spike/src/FilterStrip.svelte", import.meta.url),
  "utf8",
);

test("one strip carries both groups in a single row", () => {
  assert.equal((app.match(/<FilterStrip/gu) ?? []).length, 1, "one strip, not one per group");
  assert.match(app, /reorderable=\{true\}/u);
  assert.match(app, /activeIds=\{activeFilterIds\}/u);
  // The stacked wrapper is gone.
  assert.doesNotMatch(app, /checklist-filters/u);
});

test("the groups stay independent inside the one strip", () => {
  // Each capsule declares its group, and toggling touches only that group.
  assert.match(app, /\{ id: "status:pending", group: "status", value: "pending"/u);
  assert.match(app, /\{ id: "owner:manual", group: "owner", value: "manual"/u);
  assert.match(app, /filter = \{ \.\.\.filter, \[capsule\.group\]: current === capsule\.value \? null : capsule\.value \}/u);
  // Both groups can be active at once.
  assert.match(app, /\["status", "owner"\]\s*\.filter\(\(group\) => filter\[group\] !== null\)/u);
  assert.match(strip, /export let activeIds = null;/u);
  assert.match(strip, /new Set\(activeIds \?\? \(activeId === null \? \[\] : \[activeId\]\)\)/u);
});

test("capsule order persists in the user profile under its own key", () => {
  assert.equal(CHECKLIST_FILTER_ORDER_STORAGE_KEY, "task-progress.checklist-filter-order.v1");

  const storage = fakeStorage();
  const order = createChecklistFilterOrder({ supportedIds: IDS, storage });
  assert.deepEqual(order.order, IDS, "defaults to the declared order");

  order.move("status:failed", "status:pending");
  assert.deepEqual(order.order, [
    "status:failed",
    "status:pending",
    "status:passed",
    "owner:manual",
    "owner:agent",
  ]);
  assert.equal(
    storage.getItem(CHECKLIST_FILTER_ORDER_STORAGE_KEY),
    JSON.stringify(order.order),
  );

  // A reopened screen restores it.
  const restored = createChecklistFilterOrder({ supportedIds: IDS, storage });
  assert.deepEqual(restored.order, order.order);
});

test("groups may interleave, and an unknown saved id is dropped", () => {
  const storage = fakeStorage({
    [CHECKLIST_FILTER_ORDER_STORAGE_KEY]: JSON.stringify([
      "owner:manual",
      "status:failed",
      "gone:removed",
    ]),
  });
  const order = createChecklistFilterOrder({ supportedIds: IDS, storage });
  assert.deepEqual(order.order, [
    "owner:manual",
    "status:failed",
    "status:pending",
    "status:passed",
    "owner:agent",
  ]);
});

test("reordering capsules never reorders work items", () => {
  const source = "" + createChecklistFilterOrder.toString();
  assert.doesNotMatch(source, /items|checks/u);
  // The screen still lists the document's own order.
  assert.match(app, /filterChecklist\(view\.document, filter\)\.items/u);
  assert.doesNotMatch(app, /\.items\.sort\(|reverse\(\)/u);
});

test("storage stays out of the screen", () => {
  assert.doesNotMatch(app, /localStorage/u);
  assert.match(app, /createChecklistFilterOrder/u);
});
