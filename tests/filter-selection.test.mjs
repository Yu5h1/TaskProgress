// The 預設 capsule is a select-all switch that matches no status of its own.
import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_CAPSULE_ID,
  createFilterSelection,
  isDefaultLit,
  isEmptySelection,
  matchesSelection,
  toggleDefault,
  toggleTag,
  withTags,
} from "../viewer/assets/filter-selection.js";

const TAGS = ["planned", "in_progress", "done"];

test("everything starts selected with 預設 lit", () => {
  const selection = createFilterSelection(TAGS);
  assert.deepEqual([...selection.selected].sort(), [...TAGS].sort());
  assert.equal(isDefaultLit(selection), true);
  assert.equal(isEmptySelection(selection), false);
});

test("clicking a lit 預設 clears everything, and a dim one restores it", () => {
  let selection = createFilterSelection(TAGS);

  selection = toggleDefault(selection);
  assert.equal(isEmptySelection(selection), true);
  assert.equal(isDefaultLit(selection), false);
  // Nothing matches, so nothing shows. Not useful, but it is what the gesture
  // says, and a toggle that refuses to toggle is worse.
  for (const tag of TAGS) assert.equal(matchesSelection(selection, tag), false);

  selection = toggleDefault(selection);
  assert.equal(isDefaultLit(selection), true);
});

test("預設 follows the other capsules without being clicked", () => {
  let selection = createFilterSelection(TAGS);

  selection = toggleTag(selection, "done");
  assert.equal(isDefaultLit(selection), false, "clearing one dims it");
  assert.equal(matchesSelection(selection, "done"), false);
  assert.equal(matchesSelection(selection, "planned"), true);

  selection = toggleTag(selection, "done");
  assert.equal(isDefaultLit(selection), true, "restoring the last one lights it");
});

test("預設 is not a tag", () => {
  const selection = createFilterSelection(TAGS);
  assert.equal(DEFAULT_CAPSULE_ID, "__default__");
  assert.equal(selection.tags.includes(DEFAULT_CAPSULE_ID), false);
  assert.equal(matchesSelection(selection, DEFAULT_CAPSULE_ID), false);
  // An unknown tag cannot be toggled into the set.
  assert.equal(toggleTag(selection, "nonexistent"), selection);
});

test("a tag appearing later joins a full selection but not a partial one", () => {
  const full = withTags(createFilterSelection(TAGS), [...TAGS, "blocked"]);
  assert.equal(isDefaultLit(full), true, "a reader who never filtered loses nothing");
  assert.equal(matchesSelection(full, "blocked"), true);

  const partial = withTags(toggleTag(createFilterSelection(TAGS), "done"), [...TAGS, "blocked"]);
  assert.equal(matchesSelection(partial, "blocked"), false, "a deliberate filter is respected");
  assert.equal(matchesSelection(partial, "done"), false);
  assert.equal(matchesSelection(partial, "planned"), true);
});

test("a tag disappearing leaves the rest of the selection alone", () => {
  const selection = withTags(toggleTag(createFilterSelection(TAGS), "planned"), ["in_progress", "done"]);
  assert.deepEqual([...selection.selected].sort(), ["done", "in_progress"]);
  assert.equal(isDefaultLit(selection), true, "what remains is all of it");
});

test("selections are immutable", () => {
  const selection = createFilterSelection(TAGS);
  const next = toggleTag(selection, "done");
  assert.notEqual(next, selection);
  assert.equal(selection.selected.has("done"), true, "the original is untouched");
});
