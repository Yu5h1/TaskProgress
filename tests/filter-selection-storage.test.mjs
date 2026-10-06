// Filter preferences survive a reload within one session without crossing document keys.
import test from "node:test";
import assert from "node:assert/strict";
import { createFilterSelection, toggleTag, toggleDefault, loadFilterSelection, saveFilterSelection } from "../viewer/assets/filter-selection.js";
const tags = ["pending", "decided"];
const memory = () => {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};
test("reload preserves partial and empty selection, isolated by document and session", () => {
  const storage = memory();
  const partial = toggleTag(createFilterSelection(tags), "decided");
  saveFilterSelection("scope-a", partial, storage);
  assert.deepEqual([...loadFilterSelection("scope-a", tags, storage).selected], ["pending"]);
  assert.deepEqual([...loadFilterSelection("scope-b", tags, storage).selected], tags);
  assert.deepEqual([...loadFilterSelection("scope-a", tags, memory()).selected], tags);
  saveFilterSelection("scope-a", toggleDefault(createFilterSelection(tags)), storage);
  assert.equal(loadFilterSelection("scope-a", tags, storage).selected.size, 0);
});
test("invalid storage falls back safely and removed tags never return", () => {
  const storage = memory();
  for (const invalid of ["broken", "{}", "[1]", "null"]) {
    storage.setItem("key", invalid);
    assert.deepEqual([...loadFilterSelection("key", tags, storage).selected], tags);
  }
  storage.setItem("key", '["pending","removed","pending"]');
  assert.deepEqual([...loadFilterSelection("key", tags, storage).selected], ["pending"]);
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  assert.deepEqual([...loadFilterSelection("key", tags, blocked).selected], tags);
  assert.doesNotThrow(() => saveFilterSelection("key", createFilterSelection(tags), blocked));
});
