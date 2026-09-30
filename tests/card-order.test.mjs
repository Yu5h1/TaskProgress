import test from "node:test";
import assert from "node:assert/strict";
import { orderCards, moveVisibleCard, displayCards, promotePin, requestedCardPin } from "../viewer/assets/card-order.js";

test("explicit pin promotes an existing card without toggling or duplicating", () => {
  const saved = ["b", "a", "c"];
  assert.deepEqual(promotePin(saved, "a"), ["a", "b", "c"]);
  assert.deepEqual(promotePin(promotePin(saved, "a"), "a"), ["a", "b", "c"]);
  assert.deepEqual(saved, ["b", "a", "c"]);
});

test("URL pin only targets the requested scope and decodes IDs", () => {
  assert.equal(requestedCardPin("?scope=web&pin=card%20%26%20one", "web"), "card & one");
  assert.equal(requestedCardPin("?scope=web&pin=a", "other"), null);
  assert.equal(requestedCardPin("?scope=web&pin=", "web"), null);
});

test("pins override every sort mode and unpin restores the underlying order", () => {
  const items = ["a", "b", "c", "d"].map(id => ({ id }));
  const saved = ["d", "c", "b", "a"];
  const pins = ["b", "c", "b", "gone"];
  for (const mode of ["forward", "reverse", "free"]) {
    const base = displayCards(items, saved, mode).map(item => item.id);
    assert.deepEqual(displayCards(items, saved, mode, pins).map(item => item.id),
      ["b", "c", ...base.filter(id => !["b", "c"].includes(id))]);
    assert.deepEqual(displayCards(items, saved, mode, []).map(item => item.id), base);
  }
  assert.deepEqual(items.map(item => item.id), ["a", "b", "c", "d"]);
  assert.deepEqual(pins, ["b", "c", "b", "gone"]);
});

test("pins do not resurrect filtered cards or disturb hidden/free-order slots", () => {
  const items = [{ id: "a" }, { id: "c" }];
  assert.deepEqual(displayCards(items, null, "forward", ["b", "c"]).map(item => item.id), ["c", "a"]);
  const moved = moveVisibleCard(["a", "b", "c", "d"], null, ["a", "d"], "d", "a", false);
  assert.deepEqual(moved, ["d", "b", "c", "a"]);
  assert.deepEqual(displayCards(["a", "b", "c", "d"].map(id => ({ id })), moved, "free", ["c"])
    .map(item => item.id), ["c", "d", "b", "a"]);
});

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
