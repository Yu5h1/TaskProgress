import test from "node:test";
import assert from "node:assert/strict";
import { orderCards, moveVisibleCard, displayCards } from "../viewer/assets/card-order.js";

test("moving visible cards preserves hidden slots and source arrays", () => {
  const all = [1, 2, 3, 4, 5];
  assert.deepEqual(moveVisibleCard(all, null, [1, 3, 5], 5, 1, false), [5, 2, 1, 4, 3]);
  assert.deepEqual(all, [1, 2, 3, 4, 5]);
});
test("saved order removes deleted IDs, deduplicates and appends new IDs", () => {
  assert.deepEqual(moveVisibleCard(["a", "b", "c"], ["gone", "b", "b", "a"], ["a", "b", "c"], "c", "b", false), ["c", "b", "a"]);
});
test("manual order overrides incoming grouping and reset preserves default", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "new" }];
  assert.deepEqual(orderCards(items, ["b", "a"]).map(item => item.id), ["b", "a", "new"]);
  assert.equal(orderCards(items, null), items);
  assert.deepEqual(moveVisibleCard(["a", "b"], null, ["a", "b"], "a", "missing", false), ["a", "b"]);
});

test("sort modes use existing order, reverse it, or restore custom order without mutating input", () => {
  const items = [{ id: "b" }, { id: "a" }, { id: "c" }];
  const saved = ["c", "b", "a"];
  assert.deepEqual(displayCards(items, saved, "forward").map(x => x.id), ["b", "a", "c"]);
  assert.deepEqual(displayCards(items, saved, "reverse").map(x => x.id), ["c", "a", "b"]);
  assert.deepEqual(displayCards(items, saved, "free").map(x => x.id), ["c", "b", "a"]);
  assert.deepEqual(items.map(x => x.id), ["b", "a", "c"]);
  assert.deepEqual(saved, ["c", "b", "a"]);
});
