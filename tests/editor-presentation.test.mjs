import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("Viewer, Demo, and Svelte consume one framework-neutral presentation contract", async () => {
  const [presentation, viewer, demo, svelteStyles, svelteApp, taskCard, itemRow] = await Promise.all([
    read("../viewer/assets/editor-presentation.css"),
    read("../viewer/index.html"),
    read("../experiments/time-reference/demo/index.html"),
    read("../experiments/editor-svelte-spike/src/styles.css"),
    read("../experiments/editor-svelte-spike/src/App.svelte"),
    read("../experiments/editor-svelte-spike/src/TaskCard.svelte"),
    read("../experiments/editor-svelte-spike/src/ItemRow.svelte"),
  ]);

  assert.match(presentation, /--editor-content-max-width:\s*960px/u);
  assert.match(presentation, /\.editor-layout-shell/u);
  assert.match(presentation, /\.editor-task-card/u);
  assert.match(presentation, /\.editor-item-row/u);
  assert.match(viewer, /href="assets\/editor-presentation\.css"/u);
  assert.match(demo, /href="\.\.\/\.\.\/\.\.\/viewer\/assets\/editor-presentation\.css"/u);
  assert.match(svelteStyles, /@import "@editor\/editor-presentation\.css"/u);
  assert.match(viewer, /page-shell editor-layout-shell/u);
  assert.match(demo, /page-shell editor-layout-shell/u);
  assert.match(svelteApp, /spike-page editor-layout-shell/u);
  // TaskCard.svelte/ItemRow.svelte are the single source for these two
  // classes now; editor-surface-runtime.js's dead createTaskCardShell/
  // createItemRow used to carry them and is gone.
  assert.match(taskCard, /task-card editor-task-card /u);
  assert.match(itemRow, /class="editor-item-row"/u);
});

test("shared presentation owns geometry only and leaves host themes independent", async () => {
  const presentation = await read("../viewer/assets/editor-presentation.css");

  assert.doesNotMatch(presentation, /(?:^|\s)(?:color|background(?:-color)?|box-shadow):/mu);
  assert.match(presentation, /--editor-card-gap/u);
  assert.match(presentation, /--editor-item-min-height/u);
});
