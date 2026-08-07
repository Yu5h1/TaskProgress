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
const viewerCssSource = await readFile(
  new URL("../viewer/assets/styles.css", import.meta.url),
  "utf8",
);
const presentationCssSource = await readFile(
  new URL("../viewer/assets/editor-presentation.css", import.meta.url),
  "utf8",
);
const priorityPolicySource = await readFile(
  new URL("../viewer/assets/priority-policy.js", import.meta.url),
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
  assert.match(appSource, /const TASK_CONTENT_REVISION = 5/);
  assert.match(appSource, /Number\(content\.base_revision \?\? 1\) < TASK_CONTENT_REVISION/);
  assert.match(appSource, /function showUndatedProjectDetail\(\)/);
  const undatedStart = appSource.indexOf("function showUndatedProjectDetail(");
  const undatedEnd = appSource.indexOf("function showProjectDetail(", undatedStart);
  const undatedSource = appSource.slice(undatedStart, undatedEnd);
  assert.match(undatedSource, /flowTab\.disabled = true/);
  assert.match(undatedSource, /engineeringTab\.setAttribute\("aria-selected", "true"\)/);
  assert.match(undatedSource, /capacityTab\.disabled = true/);
  assert.match(undatedSource, /technical\.append\(tabList, engineeringPanel\)/);
  assert.match(appSource, /elements\.timeText\.textContent = "交付日未定"/);
  assert.match(appSource, /if \(!analysis\?\.summary\?\.deadline\) return;/);
  assert.match(
    cssSource,
    /\.time-summary-button\.no-deadline \.risk-dot\s*\{\s*display: none;/,
  );
});

test("the demo exposes one global preview and edit mode control", () => {
  assert.match(htmlSource, /id="view-mode-toggle"/);
  assert.match(htmlSource, /aria-pressed="false"/);
  assert.match(htmlSource, />預覽模式<\/button>/);
  assert.doesNotMatch(htmlSource, /id="view-mode-select"/);
  assert.match(appSource, /editorSurface\.createModeController\(elements\.viewModeToggle/);
  assert.match(appSource, /function globalEditingEnabled\(\)/);
  assert.match(appSource, /if \(globalEditingEnabled\(\)\) \{\s*capacityEditorOpen = true;/);
  assert.match(
    appSource,
    /if \(globalEditingEnabled\(\) && hasHumanInputs\) content\.append\(createItemEditor\(item\)\)/,
  );
});

test("global edit mode owns summary and child-item mutations", () => {
  assert.match(appSource, /task-summary-direct-input/);
  assert.match(appSource, /editorSurface\.createItemRow/);
  assert.match(appSource, /itemInputClass: "task-item-title-input"/);
  assert.match(appSource, /itemDeleteClass: "task-item-delete"/);
  assert.match(appSource, /itemPrioritySelectClass: "task-item-priority-select"/);
  assert.match(appSource, /createTaskItemAddRow/);
  assert.doesNotMatch(appSource, /createDeletedTaskItemNotice|lastDeletedTaskItem/);
  assert.match(appSource, /function applyDemoEditorHistory\(direction\)/);
  assert.match(appSource, /demoEditorSession\.undo\(\)/);
  assert.match(appSource, /demoEditorSession\.redo\(\)/);
  assert.match(appSource, /taskEditingModel\.normalizeTaskDescription/);
  assert.match(appSource, /items_by_task/);
  assert.match(htmlSource, /id="global-edit-save"/);
  assert.match(
    appSource,
    /saveBarControl\?\.setState\(\{[\s\S]*?editing: globalEditingEnabled\(\),[\s\S]*?dirty,[\s\S]*?saving: globalSaving/,
  );
  assert.doesNotMatch(appSource, /task-summary-edit-button|openTaskSummaryEditor|saveTaskSummaryOverrides/);
  assert.doesNotMatch(appSource, /editingTaskItemId/);
});

test("all child items become one-row inputs in global edit mode", () => {
  const workRowStart = appSource.indexOf("function createDemoItemRow(");
  const workRowEnd = appSource.indexOf("function validateTaskItemDrafts", workRowStart);
  const workRowSource = appSource.slice(workRowStart, workRowEnd);

  assert.match(workRowSource, /editing: globalEditingEnabled\(\)/);
  assert.match(workRowSource, /contentNodes: \[time\]/);
  assert.match(workRowSource, /trailingNodes: \[createTaskItemStatus\(taskItem\)\]/);
  // Row order is a fixed shared contract, not a Demo presentation choice.
  assert.doesNotMatch(appSource, /itemEditOrder/);
  assert.match(appSource, /saveBarControl = editorSurface\.createSaveBar\(elements\.globalEditSave, \{[\s\S]*?onSave: saveGlobalDrafts/);
  assert.match(appSource, /editorSurface\.bindHistoryShortcuts\(document, \{/);
  assert.match(appSource, /editorSurface\.setFieldError\(input, message\)/);
  assert.match(appSource, /editorSurface\.reportFieldError\(firstInvalid\.input, firstInvalid\.message\)/);
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
  assert.match(appSource, /demoEditorSession\.createItemId\(/);
  assert.match(appSource, /type: "add-item"/);
  assert.match(
    appSource,
    /priority: taskEditingModel\.normalizePriority\(priority, CREATION_PRIORITY\)/,
  );
  assert.match(appSource, /editorSurface\.createAddControl\(row, \{/);
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

test("global save stays fixed at the panel-aligned viewport bottom", () => {
  assert.match(htmlSource, /class="global-edit-save" id="global-edit-save" hidden/);
  assert.doesNotMatch(htmlSource, /id="global-edit-save-button"/);
  assert.match(appSource, /statusId: "global-edit-save-status"/);
  assert.match(appSource, /buttonId: "global-edit-save-button"/);
  assert.doesNotMatch(
    htmlSource,
    /class="project-progress-label">\s*<div class="global-edit-save"/,
  );
  assert.match(
    cssSource,
    /\.global-edit-save\s*\{[\s\S]*?position: fixed;[\s\S]*?left: 50%;[\s\S]*?width: min\(960px, calc\(100% - 32px\)\);[\s\S]*?bottom: calc\([\s\S]*?transform: translateX\(-50%\);/,
  );
  assert.match(cssSource, /env\(safe-area-inset-bottom, 0px\)/);
  assert.match(cssSource, /#global-edit-save-button\s*\{[\s\S]*?color: #fff;/);
  assert.match(cssSource, /\.global-edit-save-status\s*\{/);
  assert.match(
    cssSource,
    /@media \(max-width: 600px\)[\s\S]*?\.global-edit-save\s*\{[\s\S]*?width: min\(960px, calc\(100% - 24px\)\);/,
  );
});

test("Demo mode toggle uses the shared viewport-top dock", () => {
  assert.match(
    htmlSource,
    /<button\s+class="theme-control view-mode-control view-mode-toggle editor-mode-dock"[\s\S]*?id="view-mode-toggle"/,
  );
  assert.doesNotMatch(htmlSource, /<span>模式<\/span>/);
  assert.match(
    presentationCssSource,
    /\.editor-mode-dock\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?top:\s*calc\(12px \+ env\(safe-area-inset-top, 0px\)\);[\s\S]*?left:\s*50%;[\s\S]*?transform:\s*translateX\(-50%\);/,
  );
});

test("leaving edit mode discards drafts and restores the persisted preview", () => {
  assert.match(appSource, /function discardGlobalDrafts\(\)/);
  assert.match(appSource, /demoEditorSession\?\.discard\(\)/);
  assert.match(appSource, /syncLegacyStateFromEditorSession\(\)/);
  assert.match(appSource, /estimateDrafts\.clear\(\)/);
  assert.match(appSource, /render\(prepareDemoAnalysis\(loadedAnalysisSource\)\)/);
  assert.match(
    appSource,
    /if \(leavingEditMode && hasUnsavedDrafts\(\)\) discardGlobalDrafts\(\)/,
  );
  assert.doesNotMatch(appSource, /尚有未儲存內容，請先按下全域/);
});

test("estimate and capacity editing preview locally and persist through global save", () => {
  const capacityStart = appSource.indexOf("function createCapacityEditor(");
  const capacityEnd = appSource.indexOf("function createCapacityPanel(", capacityStart);
  const capacitySource = appSource.slice(capacityStart, capacityEnd);
  const itemStart = appSource.indexOf("function createItemEditor(");
  const itemEnd = appSource.indexOf("function showItemDetail(", itemStart);
  const itemSource = appSource.slice(itemStart, itemEnd);
  const saveStart = appSource.indexOf("function saveGlobalDrafts(");
  const saveEnd = appSource.indexOf("function createDeletedTaskItemNotice(", saveStart);
  const saveSource = appSource.slice(saveStart, saveEnd);
  const previewStart = appSource.indexOf("function previewTimeDrafts(");
  const previewEnd = appSource.indexOf("function saveGlobalDrafts(", previewStart);
  const previewSource = appSource.slice(previewStart, previewEnd);

  assert.doesNotMatch(
    capacitySource,
    /textContent = "取消"|item-editor-cancel/,
  );
  assert.doesNotMatch(
    itemSource,
    /textContent = "取消"|item-editor-cancel/,
  );
  assert.match(capacitySource, /preview\.textContent = "重新計算"/);
  assert.match(itemSource, /preview\.textContent = "重新計算"/);
  assert.match(capacitySource, /capacityDraft = readCapacityDraft\(form\)/);
  assert.match(itemSource, /estimateDrafts\.set\(item\.item_id/);
  assert.match(previewSource, /applyEstimateResult\(change\.item, change\.result, \{ createVersion: false \}\)/);
  assert.match(previewSource, /recomputeDerivedTotals\(analysis\)/);
  assert.doesNotMatch(previewSource, /saveDemoOverride|saveCapacityOverride|recomputeAnalysis/);
  assert.match(saveSource, /prepareEstimateDrafts\(\)/);
  assert.match(saveSource, /capacityProfileFromDraft\(capacityDraft\)/);
  assert.match(saveSource, /stageTaskContentOverrides\(readDemoOverrides\(\)\)/);
  assert.match(saveSource, /writeDemoOverrides\(stagedOverrides\)/);
  assert.match(saveSource, /沒有部分提交/);
  assert.match(saveSource, /recomputeAnalysis\(analysis/);
});

test("status ordering is an always-available view preference", () => {
  const moveStart = appSource.indexOf("function moveStatus(");
  const moveEnd = appSource.indexOf("function moveStatusByOffset", moveStart);
  const moveSource = appSource.slice(moveStart, moveEnd);

  assert.match(appSource, /const DEFAULT_STATUS_ORDER = \["planned", "in_progress", "done", "blocked", "archive"\]/);
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
    appSource,
    /taskEditingModel\.normalizePriority\(left\.item\.priority, DEFAULT_PRIORITY\)/,
  );
  assert.match(
    htmlSource,
    /class="overview-card overview-active" data-status="in_progress"/,
  );
  assert.match(cssSource, /\.filter-button\.status-sortable\s*\{[\s\S]*?cursor: grab;/);
});

test("P0 top-level task creation has a stable contract and a bottom add control", () => {
  assert.match(htmlSource, /id="task-card-add-host" hidden/);
  assert.match(htmlSource, /data-filter="planned"[^>]*>待處理 0/);
  assert.match(appSource, /function renderTopLevelTaskAdd\(\)/);
  assert.match(appSource, /editorSurface\.createAddControl\(host, \{/);
  assert.match(appSource, /triggerAriaLabel: "新增最外層任務卡"/);
  assert.match(appSource, /demoEditorSession\.createTaskId\(/);
  assert.match(appSource, /type: "add-task"/);
  assert.match(appSource, /status: "planned"/);
  assert.match(appSource, /priority: taskEditingModel\.normalizePriority\(priority, CREATION_PRIORITY\)/);
  assert.match(appSource, /title: titleResult\.value/);
  assert.match(appSource, /summary: summaryResult\.value/);
  assert.match(appSource, /tasks: taskDefinitions/);
  assert.match(cssSource, /@media \(max-width: 600px\)[\s\S]*?\.task-card-add-form\s*\{\s*grid-template-columns: 1fr;/);
});

test("Demo and production Viewer share the same Editor Core runtime", () => {
  assert.match(
    htmlSource,
    /viewer\/assets\/editor-core-runtime\.js/,
  );
  assert.match(appSource, /globalThis\.TaskProgressEditorCoreRuntime/);
  assert.match(appSource, /editorCoreRuntime\.createEditorCore/);
  assert.match(appSource, /demoEditorCore\.createReportEditorSession/);
  assert.match(appSource, /demoEditorSession\.dispatch\(command\)/);
  assert.match(appSource, /demoEditorSession\.derived\.progress\.project/);
  assert.match(appSource, /demoEditorSession\.derived\.timeInvalidation\.stale/);
});

test("task cards and child items share the five named priority levels", () => {
  assert.match(priorityPolicySource, /value: 0, label: "立即"/);
  assert.match(priorityPolicySource, /value: 1, label: "優先"/);
  assert.match(priorityPolicySource, /value: 2, label: "一般"/);
  assert.match(priorityPolicySource, /value: 3, label: "次要"/);
  assert.match(priorityPolicySource, /value: 4, label: "未指定"[\s\S]*?hidden: true/);
  assert.match(priorityPolicySource, /labelsValid \? level\.label : `P\$\{level\.value\}`/);
  assert.match(htmlSource, /priority-policy\.js[^<]*<\/script>[\s\S]*task-editing-model\.js/);
  assert.match(appSource, /const priorityPolicy = globalThis\.TaskProgressPriorityPolicy/);
  assert.match(appSource, /const DEFAULT_PRIORITY = priorityPolicy\.fallbackValue/);
  assert.match(appSource, /const CREATION_PRIORITY = priorityPolicy\.creationDefaultValue/);
  // The Demo's own source (frozen, retired) still calls the shared Editor
  // Surface's createPrioritySelect; that function no longer exists in
  // editor-surface-runtime.js (dead code, deleted), which is exactly why the
  // Demo throws on load and is not repaired — see handoff.md.
  assert.match(appSource, /editorSurface\.createPrioritySelect\(value, \{ className, ariaLabel \}\)/);
  assert.match(appSource, /function renderTaskPriorityControls\(\)/);
  assert.match(appSource, /task_priorities: Object\.fromEntries/);
  assert.match(appSource, /card\.dataset\.priority/);
  assert.match(appSource, /priorityOrderedCards/);
  assert.match(appSource, /預設優先級：一般/);
  assert.doesNotMatch(appSource, /預設優先級：P2/);
  assert.doesNotMatch(appSource, /label: "(立即|優先|一般|次要|未指定)"/);
  assert.match(cssSource, /\.task-priority-select\.priority-urgent/);
  assert.match(cssSource, /\.task-priority-select\.priority-unspecified/);
});

test("P0 protects drafts, recalculates progress, and invalidates stale time projections", () => {
  assert.match(appSource, /function hasUnsavedDrafts\(\)/);
  assert.match(appSource, /window\.addEventListener\("beforeunload"/);
  assert.match(appSource, /if \(leavingEditMode && hasUnsavedDrafts\(\)\) discardGlobalDrafts\(\)/);
  assert.match(appSource, /function updateStatusAndProgressSummaries\(\)/);
  assert.match(appSource, /taskEditingModel\.calculateProgressUnits/);
  assert.match(appSource, /elements\.filterButtons\.forEach/);
  assert.match(appSource, /elements\.overviewCards\.forEach/);
  assert.match(appSource, /function updateTaskStructureChanged\(\)/);
  assert.match(appSource, /受影響的時間資料已失效/);
  assert.match(appSource, /primaryStructureStale \? \[\]/);
  assert.match(appSource, /elements\.timeText\.textContent = "時間待重新分析"/);
});
