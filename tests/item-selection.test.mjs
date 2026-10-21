import test from "node:test";
import assert from "node:assert/strict";
import { createSelection } from "../viewer/assets/selection-model.js";
import { keyCommand, pointerCommand } from "../viewer/assets/selection-input.js";
import { createItemSelection } from "../viewer/assets/item-selection.js";

const order = ["a", "b", "c", "d", "e"];
const keys = selection => [...selection.state.keys].sort();

test("select, toggle and extend keep keys, not positions", () => {
  const selection = createSelection();
  selection.select("b");
  selection.toggle("d");
  assert.deepEqual(keys(selection), ["b", "d"]);
  selection.extendTo("a", order);
  assert.deepEqual(keys(selection), ["a", "b", "c", "d"], "the range runs from the last anchor (d) to a");
  selection.toggle("c");
  assert.deepEqual(selection.ordered(["d", "c", "b", "a"]), ["d", "b", "a"], "copy order follows the caller's order");
});

test("keyboard focus moves without selecting, and Shift extends from the anchor", () => {
  const selection = createSelection();
  selection.focusOn("b");
  assert.equal(selection.moveFocus(1, order), "c");
  assert.deepEqual(keys(selection), []);
  selection.select("c");
  selection.moveFocus(1, order, { extend: true });
  selection.moveFocus(1, order, { extend: true });
  assert.deepEqual(keys(selection), ["c", "d", "e"]);
  assert.equal(selection.moveFocus(5, order), "e", "focus stops at the end");
});

test("retain drops keys that are no longer shown; clear notifies subscribers", () => {
  const selection = createSelection();
  const seen = [];
  selection.subscribe(state => seen.push(state.keys.size));
  selection.selectAll(order);
  selection.retain(["a", "e"]);
  assert.deepEqual(keys(selection), ["a", "e"]);
  selection.clear();
  assert.deepEqual(seen, [0, 5, 2, 0]);
});

test("input mapping leaves Alt+Arrow to reordering and maps the rest", () => {
  assert.equal(pointerCommand({ shiftKey: true }), "extend");
  assert.equal(pointerCommand({ ctrlKey: true }), "toggle");
  assert.equal(pointerCommand({ metaKey: true }), "toggle");
  assert.equal(pointerCommand({}), "select");
  assert.equal(keyCommand({ key: "ArrowDown", altKey: true }), null);
  assert.deepEqual(keyCommand({ key: "ArrowUp", shiftKey: true }), { command: "move", delta: -1, extend: true });
  assert.deepEqual(keyCommand({ key: " " }), { command: "toggle" });
  assert.deepEqual(keyCommand({ key: "C", ctrlKey: true }), { command: "copy" });
  assert.deepEqual(keyCommand({ key: "a", metaKey: true }), { command: "all" });
  assert.equal(keyCommand({ key: "x" }), null);
});

test("the TaskProgress adapter copies the selection in display order, or the clicked row alone", async () => {
  const rows = order.map(key => ({ getAttribute: () => `s › t › ${key}`, focus() {} }));
  let copied = null;
  const items = createItemSelection({ root: { querySelectorAll: () => rows }, copy: async text => { copied = text; return true; } });
  const click = (key, extra = {}) => items.rowClick(`s › t › ${key}`, { button: 0, target: null, preventDefault() {}, ...extra });
  click("d");
  click("b", { ctrlKey: true });
  await items.copyReferences("s › t › d");
  assert.equal(copied, "s › t › b\ns › t › d");
  await items.copyReferences("s › t › e");
  assert.equal(copied, "s › t › e", "a row outside the selection copies only itself");
  click("a", { shiftKey: true });
  assert.deepEqual(items.references(), ["s › t › a", "s › t › b"], "the range runs from the last toggled row");
});
