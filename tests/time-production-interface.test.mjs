import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import { remainingWorkload } from "../viewer/assets/time-view.js";

const timeViewSource = await readFile(
  new URL("../viewer/assets/time-view.js", import.meta.url),
  "utf8",
);
const appSource = await readFile(
  new URL("../viewer/assets/app.js", import.meta.url),
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
  assert.match(timeViewSource, /交付日未定/);
  assert.match(timeViewSource, /time-summary-button no-deadline/);
  assert.match(timeViewSource, /if \(deadlineAvailable\) updateDeadline/);
  assert.doesNotMatch(
    timeViewSource.match(/className = "time-summary-button no-deadline";[\s\S]*?return;/)?.[0] ?? "",
    /time-risk-dot/,
  );
});

test("production loading isolates deadline diagnostics from estimate diagnostics", () => {
  assert.match(appSource, /inspectTimeAnalysis/);
  assert.match(appSource, /期限分析已忽略/);
  assert.match(appSource, /delete state\.timeAnalysis\.summary\.deadline/);
});

test("production capacity editing follows the one global edit transaction", () => {
  assert.doesNotMatch(timeViewSource, /編輯工作容量/);
  assert.doesNotMatch(timeViewSource, /const cancel = el\("button"[\s\S]*?createCapacityEditor/);
  assert.match(timeViewSource, /el\("h3", "", "設定"\)/);
  assert.match(timeViewSource, /"重新計算"/);
  assert.match(timeViewSource, /onDraftChange\?\.\("工作容量已重新計算，尚未全域儲存"\)/);
  assert.match(timeViewSource, /function setEditing\(enabled\)/);
  assert.match(timeViewSource, /function prepareSave\(\)/);
  assert.match(appSource, /state\.timeController\?\.setEditing\(true\)/);
  assert.match(appSource, /state\.timeController\?\.setEditing\(false\)/);
  assert.match(appSource, /timeSave = state\.timeController\?\.prepareSave\(\) \?\? null/);
  assert.match(appSource, /timeSave\?\.commit\(\)/);
  assert.match(appSource, /timeSave\?\.rollback\(\)/);
});

test("each production task card has one bottom child-item add control", () => {
  const appendListBody = appSource.match(
    /function appendList\([\s\S]*?\n}\n\nfunction safeReportUrl/,
  )?.[0] ?? "";
  const renderTaskBody = appSource.match(
    /function renderTask\([\s\S]*?\n}\n\nfunction rebuildMergedTasks/,
  )?.[0] ?? "";

  assert.doesNotMatch(appendListBody, /appendItemAdder/);
  assert.match(
    renderTaskBody,
    /stableSortByStatus\(workGroups,[\s\S]*?if \(state\.editor\.editing\) \{\s*appendItemAdder\(columns, editableTask, "pending_items"\);\s*\}\s*card\.append\(columns\)/,
  );
  assert.match(appSource, /aria-label", "增加待處理子任務"/);
});

test("production item time actions remain visible in global edit mode", () => {
  const appendListBody = appSource.match(
    /function appendList\([\s\S]*?\n}\n\nfunction safeReportUrl/,
  )?.[0] ?? "";

  assert.match(
    appendListBody,
    /if \(timeItems\) \{\s*const button = state\.timeController\?\.createItemTimeButton\(item\.id, itemTitle\);\s*if \(button\) row\.append\(button\);\s*\}\s*list\.append\(row\)/,
  );
  assert.match(
    timeViewSource,
    /查看估算依據/,
  );
});
