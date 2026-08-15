// The filter strip must hold no categories of its own, keep one pointer and
// keyboard implementation, and make reordering something a screen opts into.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { compile } from "svelte/compiler";

const read = (path) =>
  readFile(new URL(`../experiments/editor-svelte-spike/src/${path}`, import.meta.url), "utf8");

const strip = await read("FilterStrip.svelte");
const app = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");

test("the strip compiles cleanly", () => {
  const compiled = compile(strip, { name: "FilterStrip" });
  assert.deepEqual(compiled.warnings.map((warning) => warning.code), []);
});

test("the strip defines no categories of its own", () => {
  assert.match(strip, /export let categories = \[\];/u);
  assert.match(strip, /categories\.map\(/u);
  // Code only: the comment explaining the boundary is allowed to name the
  // screens, the code is not allowed to know them.
  const code = strip.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/\/\/.*$/gmu, "");
  // 預設 is the strip's own control, so describing it is fair; knowing what a
  // status means is not.
  assert.doesNotMatch(code, /planned|in_progress|待規劃|待處理|未執行|通過|失敗|已封存/u);
});

test("one pointer and keyboard implementation stays underneath", () => {
  assert.match(strip, /import HorizontalCapsuleStrip from "\.\/HorizontalCapsuleStrip\.svelte"/u);
  assert.doesNotMatch(strip, /pointerdown|keydown|draggable/u, "interaction is not reimplemented");
  assert.doesNotMatch(app, /HorizontalCapsuleStrip/u, "callers go through the strip");
});

test("reordering is opt-in and off by default", () => {
  assert.match(strip, /export let reorderable = false;/u);
  assert.match(strip, /const sortable = reorderable && category\.sortable !== false;/u);
  // A screen that does not opt in gets no sortable capsule at all; a screen
  // that does can still hold one capsule out, which is how the task-progress
  // "all" capsule stays fixed while the status capsules drag.
  assert.match(strip, /sortable,\n\s*pressed:/u);
});

test("the task-progress host supplies its own vocabulary", () => {
  // StatusFilters used to sit between the host and the strip; the host now
  // builds its categories directly, so there is one less place to drift.
  assert.match(app, /"status-filters"/u);
  assert.match(app, /categories: tagOrder\.map\(/u);
  assert.match(app, /STATUS_META\[status\]\?\.label/u);
  assert.match(app, /拖曳調整卡片排序/u);
  assert.match(app, /排序第 \$\{index\}/u);
  assert.match(app, /reorderable: true,/u);
});

test("counts render the same way for every caller", () => {
  assert.match(strip, /`\$\{category\.label\} \$\{category\.count\}`/u);
  // A category without a count shows just its label rather than "label
  // undefined".
  assert.match(strip, /category\.count === undefined \|\| category\.count === null/u);
});
