import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import { remainingWorkload } from "../viewer/assets/time-dialog-control.js";

const timeControlSource = await readFile(
  new URL("../viewer/assets/time-dialog-control.js", import.meta.url),
  "utf8",
);
const timeDialogSource = await readFile(
  new URL("../experiments/editor-svelte-spike/src/TimeDialog.svelte", import.meta.url),
  "utf8",
);
const appSource = await readFile(
  new URL("../viewer/assets/app.js", import.meta.url),
  "utf8",
);
const taskCardSource = await readFile(
  new URL("../experiments/editor-svelte-spike/src/TaskCard.svelte", import.meta.url),
  "utf8",
);
const addControlSource = await readFile(
  new URL("../experiments/editor-svelte-spike/src/AddControl.svelte", import.meta.url),
  "utf8",
);
const itemRowSource = await readFile(
  new URL("../experiments/editor-svelte-spike/src/ItemRow.svelte", import.meta.url),
  "utf8",
);
const timeCapacityEditorSource = await readFile(
  new URL("../experiments/editor-svelte-spike/src/TimeCapacityEditor.svelte", import.meta.url),
  "utf8",
);

test("unfinished work is independent from deadline data", () => {
  assert.equal(remainingWorkload({
    total_estimated_minutes: 2400,
    calibrated_total_minutes: 3000,
    execution_calibration: { factor: 1.25 },
  }, 0.4), 1800);
});

test("unfinished work prefers the direct pending-estimate sum", () => {
  assert.equal(remainingWorkload({
    total_estimated_minutes: 19440,
    calibrated_total_minutes: 19440,
    remaining_estimated_minutes: 6960,
    execution_calibration: { factor: 1 },
  }, 0.62), 6960);
});

test("production Viewer exposes a neutral undated estimate surface", () => {
  assert.match(timeControlSource, /交付日未定/);
  assert.match(timeControlSource, /time-summary-button no-deadline/);
  assert.match(timeControlSource, /if \(deadlineAvailable\) updateDeadline/);
  const noDeadlineBranch = timeControlSource
    .match(/className: "time-summary-button no-deadline",[\s\S]*?showChevron: true,\s*\};/)?.[0] ?? "";
  assert.doesNotMatch(noDeadlineBranch, /showDot: true/);
});

test("production loading isolates deadline diagnostics from estimate diagnostics", () => {
  assert.match(appSource, /inspectTimeAnalysis/);
  assert.match(appSource, /期限分析已忽略/);
  assert.match(appSource, /delete state\.timeAnalysis\.summary\.deadline/);
});

test("production capacity editing follows the one global edit transaction", () => {
  assert.doesNotMatch(timeControlSource, /編輯工作容量/);
  // The capacity form has exactly one action — recalculate — because there is
  // no per-dialog editor toggle; visibility is tied to the global edit
  // session, so cancelling it means leaving edit mode, not a form control.
  assert.doesNotMatch(timeCapacityEditorSource, /取消/);
  assert.match(timeCapacityEditorSource, /<h3>設定<\/h3>/);
  assert.match(timeCapacityEditorSource, /重新計算/);
  assert.match(timeControlSource, /onDraftChange\?\.\("工作容量已重新計算，尚未全域儲存"\)/);
  assert.match(timeControlSource, /function setEditing\(enabled\)/);
  assert.match(timeControlSource, /function prepareSave\(\)/);
  assert.match(appSource, /state\.timeController\?\.setEditing\(true\)/);
  assert.match(appSource, /state\.timeController\?\.setEditing\(false\)/);
  assert.match(appSource, /timeSave = state\.timeController\?\.prepareSave\(\) \?\? null/);
  assert.match(appSource, /timeSave\?\.commit\(\)/);
  assert.match(appSource, /timeSave\?\.rollback\(\)/);
});

test("each production task card has one bottom child-item add control", () => {
  // The task list is rendered through the UI adapter now, so the contract lives
  // in the card component; the host only supplies the command.
  const adderIndex = taskCardSource.indexOf("task-adder-section");
  const columnsIndex = taskCardSource.indexOf("work-columns");
  assert.ok(columnsIndex >= 0 && adderIndex > columnsIndex);
  assert.equal(taskCardSource.split("spike-add-shell").length - 1, 1);
  assert.match(taskCardSource, /\{#if editing\}\s*<div class="spike-add-shell">/);

  // New children always land in pending_items regardless of panel order.
  assert.match(appSource, /function addTaskItem\(taskId, draftTitle, priority\)/);
  assert.match(appSource, /type: "add-item",\s*taskId,\s*field: "pending_items"/);
  assert.match(appSource, /createUiView\("add-control", elements\.taskAddShell/);
  // Creation default now comes from the policy inside the shared control.
  assert.match(addControlSource, /policy\?\.creationDefaultValue/);
  assert.match(appSource, /policy: PRIORITY_POLICY/);
});

test("production item time actions remain visible in global edit mode", async () => {
  // The capsule is rendered by the shared row in both modes and opens the
  // shared TimeDialog component through a callback, so no DOM node crosses
  // the UI boundary.
  assert.equal(itemRowSource.split("time-item-button").length - 1, 4);
  assert.match(itemRowSource, /onclick=\{\(\) => onTimeClick\(item\.id, item\.title\)\}/);
  assert.match(itemRowSource, /查看估算依據/);
  assert.match(appSource, /onTimeClick: \(itemId, itemTitle\) => \{\s*time\?\.showItemTime\(itemId, itemTitle\);/);
  assert.doesNotMatch(appSource, /createItemTimeButton/);
  assert.match(timeControlSource, /function itemTime\(itemId\)/);
  // The dialog is shared by both hosts: the standalone editor wires the same
  // capsule click to the same controller instead of rendering an inert span.
  const appSvelteSource = await readFile(
    new URL("../experiments/editor-svelte-spike/src/App.svelte", import.meta.url),
    "utf8",
  );
  assert.match(appSvelteSource, /createTimeReferenceController/);
  assert.match(appSvelteSource, /onTimeClick=\{timeController \? openItemTime : null\}/);
});
