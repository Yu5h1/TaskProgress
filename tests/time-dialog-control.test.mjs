import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createTimeReferenceController } from "../viewer/assets/time-dialog-control.js";

const analysis = JSON.parse(await readFile(
  new URL("../reports/example/time.analysis.json", import.meta.url),
  "utf8",
));

// Matches the fixture's own `evaluated_at`/`as_of`. The controller's
// constructor calls `refresh()` once against the real clock (the same thing
// `time-view.js` always did) so the urgency it reports drifts with the
// calendar — re-pinning it here is what keeps this suite deterministic
// rather than "on_track" turning into "critical" once the fixture's 8/1
// delivery date is in the past relative to whenever the suite runs.
const ASOF = new Date("2026-07-24T17:00:00+08:00");

function makeController(overrides = {}) {
  const controller = createTimeReferenceController({
    sourceAnalysis: overrides.analysis ?? analysis,
    workProgressRatio: overrides.workProgressRatio,
  });
  controller.refresh(overrides.now ?? ASOF);
  return controller;
}

test("the summary snapshot reflects deadline, no-deadline and stale states", () => {
  const controller = makeController();
  const deadlineSummary = controller.snapshot().summary;
  assert.equal(deadlineSummary.className, "time-summary-button on-track");
  assert.equal(deadlineSummary.showDot, true);
  assert.equal(deadlineSummary.showChevron, true);

  const estimateOnly = structuredClone(analysis);
  delete estimateOnly.summary.deadline;
  const noDeadlineController = makeController({ analysis: estimateOnly });
  const noDeadlineSummary = noDeadlineController.snapshot().summary;
  assert.equal(noDeadlineSummary.className, "time-summary-button no-deadline");
  assert.equal(noDeadlineSummary.showDot, false);
  assert.equal(noDeadlineSummary.label, "交付日未定");

  const controller2 = makeController();
  controller2.setReportStructureStale(true);
  const staleSummary = controller2.snapshot().summary;
  assert.equal(staleSummary.disabled, true);
  assert.equal(staleSummary.className, "time-summary-button stale");
  assert.equal(staleSummary.label, "時間待重新分析");
});

test("marking the report structure stale closes an open dialog", () => {
  const controller = makeController();
  controller.openProjectDetail();
  assert.equal(controller.snapshot().dialog.open, true);
  controller.setReportStructureStale(true);
  assert.equal(controller.snapshot().dialog.open, false);
});

test("openProjectDetail and showItemTime drive one shared dialog snapshot", () => {
  const controller = makeController();
  assert.equal(controller.snapshot().dialog.open, false);

  controller.openProjectDetail();
  const projectDialog = controller.snapshot().dialog;
  assert.equal(projectDialog.open, true);
  assert.equal(projectDialog.kind, "project");
  assert.equal(projectDialog.kicker, "時間參考");
  assert.equal(projectDialog.project.hasDeadline, true);
  assert.deepEqual(
    projectDialog.project.tabs.map((tab) => tab.name),
    ["flow", "engineering", "capacity"],
  );

  controller.showItemTime("build-deployment-artifact", "建立部署產物", "pages-deployment");
  const itemDialog = controller.snapshot().dialog;
  assert.equal(itemDialog.kind, "item");
  assert.equal(itemDialog.kicker, "子項目工時");
  assert.equal(itemDialog.title, "建立部署產物");
  assert.equal(itemDialog.item.taskId, "pages-deployment");
  assert.equal(itemDialog.item.itemId, "build-deployment-artifact");
  assert.equal(itemDialog.item.likelyMinutes, 720);
  assert.equal(itemDialog.item.likelyHoursLabel, "12 hr");
  assert.deepEqual(
    itemDialog.item.sourceBadges.map((badge) => badge.kind),
    ["human_parameter", "ai_analysis"],
  );

  controller.closeDialog();
  assert.equal(controller.snapshot().dialog.open, false);
});

test("detailsExpanded and activeTab are shared across dialog kinds, matching the original single shared flag", () => {
  const controller = makeController();
  controller.openProjectDetail();
  controller.setActiveTab("capacity");
  controller.toggleDetails();
  assert.equal(controller.snapshot().dialog.project.detailsExpanded, true);

  controller.showItemTime("build-deployment-artifact", "建立部署產物");
  // Opening the item dialog does not reset detailsExpanded or activeTab —
  // the original vanilla controller used one shared pair of flags for both.
  assert.equal(controller.snapshot().dialog.item.detailsExpanded, true);

  controller.openProjectDetail();
  assert.equal(controller.snapshot().dialog.project.activeTab, "capacity");
});

test("itemTime and taskDuration go stale together with reportStructureStale", () => {
  const controller = makeController();
  assert.equal(controller.itemTime("build-deployment-artifact").label, "12 hr");
  assert.equal(controller.taskDuration("pages-deployment"), "20 hr");
  controller.setReportStructureStale(true);
  assert.equal(controller.itemTime("build-deployment-artifact"), null);
  assert.equal(controller.taskDuration("pages-deployment"), null);
});

test("the capacity tab stays read-only figures — editing lives in TimeSettingsEditor, not this controller", () => {
  const controller = makeController();
  controller.openProjectDetail();
  const capacity = controller.snapshot().dialog.project.capacity;
  assert.equal(Object.hasOwn(capacity, "editor"), false);
  assert.equal(Object.hasOwn(capacity, "editorOpen"), false);
  assert.equal(typeof controller.setEditing, "undefined");
  assert.equal(typeof controller.submitCapacityForm, "undefined");
  assert.equal(typeof controller.prepareSave, "undefined");
});
