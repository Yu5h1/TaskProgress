import { test } from "node:test";
import assert from "node:assert/strict";
import { nextChoice, pickerChoices } from "../viewer/assets/icon-choice.js";

const items = [{ id: "a" }, { id: "reset", kind: "action" }, { id: "b" }];
test("cycling skips actions, wraps, and recovers an unknown value", () => {
  assert.equal(nextChoice(items, "a"), "b");
  assert.equal(nextChoice(items, "b"), "a");
  assert.equal(nextChoice(items, "unknown"), "a");
  assert.equal(nextChoice([{ id: "reset", kind: "action" }], "a"), undefined);
});
test("adjacent picker excludes current state while retaining actions and source order", () => {
  assert.deepEqual(pickerChoices(items, "a", "adjacent").map(item => item.id), ["reset", "b"]);
  assert.deepEqual(pickerChoices(items, "a", "aligned"), items);
  assert.equal(items.length, 3);
});
