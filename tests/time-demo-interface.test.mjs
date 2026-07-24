import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appSource = await readFile(
  new URL("../experiments/time-reference/demo/app.js", import.meta.url),
  "utf8",
);
const htmlSource = await readFile(
  new URL("../experiments/time-reference/demo/index.html", import.meta.url),
  "utf8",
);
const cssSource = await readFile(
  new URL("../experiments/time-reference/demo/styles.css", import.meta.url),
  "utf8",
);

test("progress report exposes one switching panel with three overview tabs", () => {
  const flowIndex = appSource.indexOf('flowTab.textContent = "評估流程"');
  const engineeringIndex = appSource.indexOf('engineeringTab.textContent = "工程估算"');
  const capacityIndex = appSource.indexOf('capacityTab.textContent = "工作容量"');

  assert.ok(flowIndex >= 0);
  assert.ok(engineeringIndex > flowIndex);
  assert.ok(capacityIndex > engineeringIndex);
  assert.match(appSource, /technical\.append\(tabList, flowPanel, engineeringPanel, capacityPanel\)/);
  assert.match(appSource, /v0\.3 先檢查剩餘工程需求與真實工作容量/);
  assert.match(appSource, /deterministic-capacity-feasibility v0\.3/);
});

test("the demo can showcase estimate-only work without a deadline", () => {
  assert.match(htmlSource, /id="time-scenario-select"/);
  assert.match(htmlSource, /value="undated" selected>交付日未定/);
  assert.match(htmlSource, /value="deadline">8\/1 交付/);
  assert.match(appSource, /item_id: "decouple-estimates-from-deadline"/);
  assert.match(appSource, /const TASK_CONTENT_REVISION = 2/);
  assert.match(appSource, /Number\(content\.base_revision \?\? 1\) < TASK_CONTENT_REVISION/);
  assert.match(appSource, /function showUndatedProjectDetail\(\)/);
  assert.match(appSource, /elements\.timeText\.textContent = "交付日未定"/);
  assert.match(appSource, /if \(!analysis\?\.summary\?\.deadline\) return;/);
  assert.match(
    cssSource,
    /\.time-summary-button\.no-deadline \.risk-dot\s*\{\s*display: none;/,
  );
});

test("the demo exposes one global preview and edit mode control", () => {
  assert.match(htmlSource, /id="view-mode-select"/);
  assert.match(htmlSource, /value="preview">預覽模式/);
  assert.match(htmlSource, /value="edit">編輯模式/);
  assert.match(appSource, /function globalEditingEnabled\(\)/);
  assert.match(appSource, /if \(globalEditingEnabled\(\)\) \{\s*capacityEditorOpen = true;/);
  assert.match(
    appSource,
    /if \(globalEditingEnabled\(\) && hasHumanInputs\) content\.append\(createItemEditor\(item\)\)/,
  );
});

test("global edit mode owns summary and child-item mutations", () => {
  assert.match(appSource, /task-summary-direct-input/);
  assert.match(appSource, /createTaskItemTitleInput/);
  assert.match(appSource, /createTaskItemDeleteButton/);
  assert.match(appSource, /createTaskItemAddRow/);
  assert.match(appSource, /createDeletedTaskItemNotice/);
  assert.match(appSource, /taskEditingModel\.normalizeTaskDescription/);
  assert.match(appSource, /items_by_task/);
  assert.match(htmlSource, /id="global-edit-save"/);
  assert.match(appSource, /elements\.globalEditSave\.hidden = !globalEditingEnabled\(\) \|\| !taskContentDirty/);
  assert.doesNotMatch(appSource, /task-summary-edit-button|openTaskSummaryEditor|saveTaskSummaryOverrides/);
  assert.doesNotMatch(appSource, /editingTaskItemId/);
});

test("all child items become one-row inputs in global edit mode", () => {
  const workRowStart = appSource.indexOf("function createWorkRow(");
  const workRowEnd = appSource.indexOf("function createWorkRowWithoutTime", workRowStart);
  const workRowSource = appSource.slice(workRowStart, workRowEnd);

  assert.match(
    workRowSource,
    /createTaskItemTitleInput\(taskItem, primaryTaskId\),\s*createTaskItemDeleteButton\(taskItem, primaryTaskId\),\s*button,\s*createTaskItemStatus\(taskItem\)/,
  );
  assert.match(appSource, /elements\.globalEditSaveButton\.addEventListener\("click", saveTaskItemDrafts\)/);
  assert.match(
    cssSource,
    /\.work-columns \.detail-list li\.time-work-item::before\s*\{\s*display: none;/,
  );
});

test("every task card has a bottom add control in global edit mode", () => {
  const childLists = htmlSource.match(/data-task-child-list="[^"]+"/g) ?? [];

  assert.equal(childLists.length, 4);
  assert.match(appSource, /function renderAuxiliaryTaskItems\(\)/);
  assert.match(
    appSource,
    /if \(globalEditingEnabled\(\)\) rows\.push\(createTaskItemAddRow\(taskId\)\)/,
  );
  assert.match(appSource, /taskItemsFor\(taskId\)\.push/);
  assert.match(appSource, /taskEditingModel\.createStableItemId\(allTaskItemIds\(\)\)/);
});

test("task descriptions are direct global-mode inputs without a local editor", () => {
  assert.match(appSource, /summary\.hidden = globalEditingEnabled\(\)/);
  assert.match(appSource, /input\.className = "task-summary-direct-input"/);
  assert.match(
    appSource,
    /document\.querySelectorAll\("#task-list \.task-summary-direct-input"\)/,
  );
  assert.doesNotMatch(appSource, /儲存描述|編輯描述/);
  assert.doesNotMatch(cssSource, /\.task-summary-editor|\.task-summary-edit-button/);
});

test("global save stays fixed at the viewport bottom", () => {
  assert.match(htmlSource, /class="global-edit-save" id="global-edit-save" hidden/);
  assert.doesNotMatch(
    htmlSource,
    /class="project-progress-label">\s*<div class="global-edit-save"/,
  );
  assert.match(
    cssSource,
    /\.global-edit-save\s*\{[\s\S]*?position: fixed;[\s\S]*?right: calc\([\s\S]*?bottom: calc\([\s\S]*?z-index: 40;/,
  );
  assert.match(cssSource, /env\(safe-area-inset-bottom, 0px\)/);
});

test("status ordering is an always-available view preference", () => {
  const moveStart = appSource.indexOf("function moveStatus(");
  const moveEnd = appSource.indexOf("function moveStatusByOffset", moveStart);
  const moveSource = appSource.slice(moveStart, moveEnd);

  assert.match(appSource, /const DEFAULT_STATUS_ORDER = \["in_progress", "done", "blocked", "archive"\]/);
  assert.match(appSource, /const DEMO_STATUS_ORDER_KEY = "taskprogress\.time-reference-demo\.status-order\.v1"/);
  assert.match(appSource, /function saveStatusOrderPreference\(\)/);
  assert.match(appSource, /button\.draggable = true/);
  assert.match(appSource, /button\.addEventListener\("dragstart"/);
  assert.match(appSource, /button\.addEventListener\("drop"/);
  assert.match(appSource, /Alt\+ArrowLeft Alt\+ArrowRight/);
  assert.match(moveSource, /saveStatusOrderPreference\(\)/);
  assert.doesNotMatch(moveSource, /globalEditingEnabled|updateTaskContentDirty/);
  assert.doesNotMatch(appSource, /status_order: \[\.\.\.statusOrder\]/);
  assert.match(appSource, /function sortStatusBoundElements\(\)/);
  assert.match(appSource, /\.forEach\(\(card\) => elements\.taskList\.append\(card\)\)/);
  assert.match(appSource, /\.forEach\(\(card\) => elements\.overviewGrid\.append\(card\)\)/);
  assert.match(appSource, /orderedTaskItems\(items\)/);
  assert.match(appSource, /orderedTaskItems\(taskItems\)/);
  assert.match(
    htmlSource,
    /class="overview-card overview-active" data-status="in_progress"/,
  );
  assert.match(cssSource, /\.filter-button\.status-sortable\s*\{[\s\S]*?cursor: grab;/);
});
