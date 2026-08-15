// The filter strip must hold no categories of its own, keep one pointer and
// keyboard implementation, and make reordering something a screen opts into.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { compile } from "svelte/compiler";

const read = (path) =>
  readFile(new URL(`../experiments/editor-svelte-spike/src/${path}`, import.meta.url), "utf8");

const strip = await read("FilterStrip.svelte");
const statusFilters = await read("StatusFilters.svelte");

test("both components compile cleanly", () => {
  for (const [name, source] of [["FilterStrip", strip], ["StatusFilters", statusFilters]]) {
    const compiled = compile(source, { name });
    assert.deepEqual(compiled.warnings.map((warning) => warning.code), [], `${name} warns`);
  }
});

test("the strip defines no categories of its own", () => {
  assert.match(strip, /export let categories = \[\];/u);
  assert.match(strip, /categories\.map\(/u);
  // Code only: the comment explaining the boundary is allowed to name the
  // screens, the code is not allowed to know them.
  const code = strip.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/\/\/.*$/gmu, "");
  assert.doesNotMatch(code, /"all"|全部|planned|待規劃|拖曳調整卡片|task-progress/u);
});

test("one pointer and keyboard implementation stays underneath", () => {
  assert.match(strip, /import HorizontalCapsuleStrip from "\.\/HorizontalCapsuleStrip\.svelte"/u);
  assert.doesNotMatch(strip, /pointerdown|keydown|draggable/u, "interaction is not reimplemented");
  assert.doesNotMatch(statusFilters, /HorizontalCapsuleStrip/u, "callers go through the strip");
});

test("reordering is opt-in and off by default", () => {
  assert.match(strip, /export let reorderable = false;/u);
  assert.match(strip, /const sortable = reorderable && category\.sortable !== false;/u);
  // A screen that does not opt in gets no sortable capsule at all; a screen
  // that does can still hold one capsule out, which is how the task-progress
  // "all" capsule stays fixed while the status capsules drag.
  assert.match(strip, /sortable,\n\s*pressed:/u);
});

test("the task-progress screen keeps its existing behaviour", () => {
  assert.match(statusFilters, /import FilterStrip from "\.\/FilterStrip\.svelte"/u);
  assert.match(statusFilters, /reorderable=\{true\}/u);
  // Its own vocabulary moved with it, not into the shared strip.
  assert.match(statusFilters, /全部/u);
  assert.match(statusFilters, /拖曳調整卡片排序；Alt＋左右方向鍵也可移動/u);
  assert.match(statusFilters, /排序第 \$\{index\}/u);
  // The "all" capsule and the count-driven visibility rule are unchanged.
  assert.match(statusFilters, /\["all", \.\.\.statusOrder\]/u);
  assert.match(statusFilters, /\(counts\[filter\] \?\? 0\) > 0/u);
  assert.match(statusFilters, /className="status-filter-strip"/u);
});

test("counts render the same way for every caller", () => {
  assert.match(strip, /`\$\{category\.label\} \$\{category\.count\}`/u);
  // A category without a count shows just its label rather than "label
  // undefined".
  assert.match(strip, /category\.count === undefined \|\| category\.count === null/u);
});
