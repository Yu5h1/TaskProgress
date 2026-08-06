import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createTimeReferenceController } from "../viewer/assets/time-dialog-control.js";

const analysis = JSON.parse(await readFile(
  new URL("../reports/example/time.analysis.json", import.meta.url),
  "utf8",
));

function fakeStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

// Matches the fixture's own `evaluated_at`/`as_of`. The controller's
// constructor calls `refresh()` once against the real clock (the same thing
// `time-view.js` always did) so the urgency it reports drifts with the
// calendar — re-pinning it here is what keeps this suite deterministic
// rather than "on_track" turning into "critical" once the fixture's 8/1
// delivery date is in the past relative to whenever the suite runs.
const ASOF = new Date("2026-07-24T17:00:00+08:00");

function makeController(overrides = {}) {
  globalThis.localStorage = overrides.storage ?? fakeStorage();
  const controller = createTimeReferenceController({
    sourceAnalysis: overrides.analysis ?? analysis,
    report: { scope_id: "example" },
    location: overrides.location ?? new URL("http://127.0.0.1:8000/viewer/"),
    workProgressRatio: overrides.workProgressRatio,
    onDraftChange: overrides.onDraftChange,
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

  controller.showItemTime("build-deployment-artifact", "建立部署產物");
  const itemDialog = controller.snapshot().dialog;
  assert.equal(itemDialog.kind, "item");
  assert.equal(itemDialog.kicker, "子項目工時");
  assert.equal(itemDialog.title, "建立部署產物");
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

test("the capacity form validates before applying and reports its error through the snapshot", () => {
  const controller = makeController();
  controller.openProjectDetail();
  controller.setEditing(true);
  const openEditor = controller.snapshot().dialog.project.capacity.editor;
  assert.ok(openEditor, "the editor should be open while globally editing on a local origin");
  assert.equal(openEditor.sleepHours, 8);
  assert.equal(openEditor.workingWeekdays.length, 5);

  const rejected = controller.submitCapacityForm({
    sleepHours: 12,
    lifeHours: 12,
    otherHours: 2,
    workingWeekdays: [1, 2, 3, 4, 5],
    exceptionsText: "",
  });
  assert.equal(rejected, false);
  assert.match(
    controller.snapshot().dialog.project.capacity.editor.error,
    /24 hr/,
  );

  const accepted = controller.submitCapacityForm({
    sleepHours: 7,
    lifeHours: 7,
    otherHours: 0,
    workingWeekdays: [1, 2, 3, 4, 5, 6],
    exceptionsText: "2026-08-10 | 0 | 休假",
  });
  assert.equal(accepted, true);
  const capacity = controller.snapshot().dialog.project.capacity;
  assert.equal(capacity.editor.error, "");
  assert.match(capacity.formulaCode, /10 hr/);
  assert.equal(capacity.editor.revision, 1);
});

test("setEditing(false) discards a pending capacity draft that was never saved", () => {
  const controller = makeController();
  controller.openProjectDetail();
  controller.setEditing(true);
  controller.submitCapacityForm({
    sleepHours: 6,
    lifeHours: 6,
    otherHours: 0,
    workingWeekdays: [1, 2, 3, 4, 5],
    exceptionsText: "",
  });
  assert.match(controller.snapshot().dialog.project.capacity.formulaCode, /12 hr/);
  controller.setEditing(false);
  assert.match(controller.snapshot().dialog.project.capacity.formulaCode, /8 hr/);
  assert.equal(controller.prepareSave(), null);
});

test("prepareSave stages a local override and commit/rollback settle it", () => {
  const storage = fakeStorage();
  const controller = makeController({ storage });
  controller.openProjectDetail();
  controller.setEditing(true);
  controller.submitCapacityForm({
    sleepHours: 6,
    lifeHours: 6,
    otherHours: 0,
    workingWeekdays: [1, 2, 3, 4, 5],
    exceptionsText: "",
  });
  const save = controller.prepareSave();
  assert.ok(save);
  assert.ok(storage.getItem("taskprogress.time-capacity.example.v1"));
  save.commit();
  // A second setEditing(false) after commit must not revert the committed profile.
  controller.setEditing(false);
  assert.match(controller.snapshot().dialog.project.capacity.formulaCode, /12 hr/);
});

test("remote origins never expose the local capacity editor", () => {
  const controller = makeController({ location: new URL("https://example.test/viewer/") });
  controller.openProjectDetail();
  controller.setEditing(true);
  assert.equal(controller.snapshot().dialog.project.capacity.editor, null);
});
