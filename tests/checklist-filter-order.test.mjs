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

const IDS = ["__default__", "pending", "passed", "failed"];

function fakeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
  };
}

const app = await readFile(
  new URL("../ui/web-workflow/checklist.mjs", import.meta.url),
  "utf8",
);
const strip = await readFile(
  new URL("../ui/web-workflow/common.mjs", import.meta.url),
  "utf8",
);

test("one strip, and 預設 rides in the same order array", async () => {
  assert.equal((app.match(/filters\(\{/gu) ?? []).length, 1);
  assert.match(app, /reorderable: true/u);
  assert.match(app, /supportedIds: \[DEFAULT_CAPSULE_ID, \.\.\.TAGS\]/u);
});

test("selecting and ordering are separate gestures", async () => {
  assert.match(app, /onSelect: id => this\.select\(toggleTag/u);
  assert.match(app, /onSelectDefault: \(\) => this\.select\(toggleDefault/u);
  assert.match(app, /onReorder: \(id, target, after\)/u);
  assert.match(strip, /pressed: p\.selected\?\.has\(id\)/u);
});

test("capsule order persists in the user profile under its own key", () => {
  assert.equal(CHECKLIST_FILTER_ORDER_STORAGE_KEY, "task-progress.checklist-filter-order.v1");

  const storage = fakeStorage();
  const order = createChecklistFilterOrder({ supportedIds: IDS, storage });
  assert.deepEqual(order.order, IDS, "defaults to the declared order");

  order.move("failed", "pending");
  assert.deepEqual(order.order, ["__default__", "failed", "pending", "passed"]);
  assert.equal(
    storage.getItem(CHECKLIST_FILTER_ORDER_STORAGE_KEY),
    JSON.stringify(order.order),
  );

  // A reopened screen restores it, including where 預設 ended up.
  const restored = createChecklistFilterOrder({ supportedIds: IDS, storage });
  assert.deepEqual(restored.order, order.order);
});

test("預設 can be dragged out of first place and that is remembered", () => {
  const storage = fakeStorage();
  const order = createChecklistFilterOrder({ supportedIds: IDS, storage });
  assert.equal(order.order[0], "__default__", "it starts leading");

  order.move("__default__", "pending", true);
  assert.notEqual(order.order[0], "__default__", "which switches the screen to grouped order");
  assert.deepEqual(
    createChecklistFilterOrder({ supportedIds: IDS, storage }).order,
    order.order,
  );
});

test("an unknown saved id is dropped and a new one is appended", () => {
  const storage = fakeStorage({
    [CHECKLIST_FILTER_ORDER_STORAGE_KEY]: JSON.stringify(["failed", "__default__", "gone"]),
  });
  const order = createChecklistFilterOrder({ supportedIds: IDS, storage });
  assert.deepEqual(order.order, ["failed", "__default__", "pending", "passed"]);
});

test("capsule order is what reorders the cards", () => {
  // The order model itself knows nothing about the document.
  const source = "" + createChecklistFilterOrder.toString();
  assert.doesNotMatch(source, /items|checks/u);
  // The screen applies it explicitly, and 預設 in first place means as written.
  assert.match(app, /orderChecklistItems\(doc, this\.order\)/u);
});

test("storage stays out of the screen", () => {
  assert.doesNotMatch(app, /localStorage/u);
  assert.match(app, /createChecklistFilterOrder/u);
});
