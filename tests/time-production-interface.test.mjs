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
const reportAdapterSource = await readFile(
  new URL("../viewer/assets/report-editor-adapter.js", import.meta.url),
  "utf8",
);
const manualEstimateEditorSource = await readFile(
  new URL("../experiments/editor-svelte-spike/src/ManualEstimateEditor.svelte", import.meta.url),
  "utf8",
);
const timeViewerModuleSource = await readFile(
  new URL("../viewer/assets/time-viewer-module.js", import.meta.url),
  "utf8",
);
const timeLegacyDiscoverySource = await readFile(
  new URL("../viewer/assets/time-legacy-discovery.js", import.meta.url),
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

test("delivery date and capacity are edited in one place: the shared TimeDialog", () => {
  // The browser-local capacity override (its own draft, its own localStorage
  // commit/rollback, independent of the canonical report save) is retired —
  // TimeSettingsEditor is the one editing surface now, and it lives inside
  // the same dialog that already shows these figures read-only.
  assert.doesNotMatch(timeControlSource, /localStorage|prepareSave|setEditing|capacityEditorOpen/);
  assert.doesNotMatch(appSource, /timeController\?\.setEditing|timeController\?\.prepareSave/);
  assert.doesNotMatch(reportAdapterSource, /externalSave/);
  assert.match(timeDialogSource, /<TimeSettingsEditor/);
  assert.match(timeDialogSource, /<DeliveryRiskPreview preview=\{deliveryPreview\}/);
  // Only shown outside the dialog while there is truly nothing to build a
  // dialog from yet — no time.analysis.json means no TimeSummaryButton to
  // open one through.
  assert.match(appSource, /!state\.timeController\s*\n\s*&& !state\.editor\.timeDraftView\?\.inputs\.config/);
});

test("production loading isolates deadline diagnostics from estimate diagnostics", () => {
  // Discovery/loading moved into time-legacy-discovery.js at its 2026-08-25
  // cutover; app.js now only assigns state.timeAnalysis from its result.
  assert.match(timeLegacyDiscoverySource, /inspectTimeAnalysis/);
  assert.match(timeLegacyDiscoverySource, /期限分析已忽略/);
  assert.match(timeLegacyDiscoverySource, /delete timeAnalysis\.summary\.deadline/);
  assert.match(appSource, /state\.timeAnalysis = legacyTimeResult\.timeAnalysis;/);
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
  assert.equal(itemRowSource.split("time-item-button").length - 1, 1);
  assert.match(itemRowSource, /if \(id === "time" && onTimeClick\) onTimeClick\(item\.id, item\.title, taskId\)/);
  assert.match(itemRowSource, /<ModuleCapsuleStrip/);
  assert.match(itemRowSource, /查看估算依據/);
  assert.match(appSource, /onTimeClick: \(itemId, itemTitle, taskId\) => \{\s*time\?\.showItemTime\(itemId, itemTitle, taskId\);/);
  assert.doesNotMatch(appSource, /createItemTimeButton/);
  assert.doesNotMatch(itemRowSource, /<details|spike-estimate-editor|onManualEstimate/);
  assert.match(timeDialogSource, /<ManualEstimateEditor/);
  assert.match(manualEstimateEditorSource, /人工工時（hr）/);
  assert.match(manualEstimateEditorSource, /人工依據/);
  assert.match(manualEstimateEditorSource, /人工確認此工時/);
  // The editing-gate for manual estimate access moved into the extracted
  // Time render layer (2026-08-25 production cutover); app.js now just wires
  // the always-present callback through `context.callbacks.onManualEstimate`.
  assert.match(appSource, /onManualEstimate: applyManualEstimateDraft/);
  assert.match(
    timeViewerModuleSource,
    /onManualEstimate: editing && hasTimeDraft \? callbacks\.onManualEstimate : null/,
  );
  assert.match(timeControlSource, /function itemTime\(itemId\)/);
});
