import {
  PRIORITY_POLICY,
  STATUS_META,
  SUPPORTED_SCHEMA_VERSIONS,
  buildScopeHref,
  calculateProjectProgress,
  calculateTaskProgress,
  isSupportedSchemaVersion,
  mergeReports,
  reportSummaryText,
  resolveDeveloperReportSource,
  resolveReportRequest,
  stableSortTasksByPriority,
  validateScopeCatalog,
  validateDeveloperReport,
  validateReport,
} from "./report-model.js";
import {
  createReportEditorSession,
  normalizeMeaningfulText,
} from "./editor-core.js";
import {
  bindHistoryShortcuts,
} from "./editor-surface.js";
import { createEditHostClient } from "./edit-host-client.js";
import {
  activeEstimateIndex,
  createTimeInputDraft,
} from "./time-input-draft.js";
import { buildTimeSettingsRiskPreview } from "./delivery-risk-preview.js";
import { createUiView } from "./ui-host.js";
import { createThemeControl } from "./theme-control.js";
import {
  DEFAULT_CAPSULE_ID,
  createFilterSelection,
  groupingOrder,
  isDefaultLit,
  toggleDefault,
  toggleTag,
  withTags,
} from "./filter-selection.js";
import {
  inspectTimeAnalysis,
  resolveTimeAnalysisSource,
} from "./time-model.js";
import { createTimeReferenceController } from "./time-dialog-control.js";
import { createModuleOrderControl } from "./module-order-control.js";
import {
  STATUS_ORDER_STORAGE_KEY,
  filterTaskItems,
  loadStatusOrder,
  moveStatusOrder,
  saveStatusOrder,
  orderByCapsuleBoundary,
  stableSortByStatus,
  taskHasSelectedItem,
  taskMatchesSelection,
} from "./status-order.js";

const supportedStatuses = Object.keys(STATUS_META);
// 預設 rides in the same order array so dragging it is ordinary capsule
// reordering, and its position is persisted with everything else.
const supportedCapsules = [DEFAULT_CAPSULE_ID, ...supportedStatuses];

function getBrowserStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

const statusOrderStorage = getBrowserStorage();

/*
 * 預設 leads unless the reader has already placed it.
 *
 * A saved order from before this capsule existed has no opinion about where it
 * belongs, and the normalizer appends unknown-but-supported ids at the end —
 * which would silently open every existing reader in grouped mode with 預設
 * stranded at the far right.
 */
function loadCapsuleOrder() {
  const order = loadStatusOrder(statusOrderStorage, supportedCapsules);
  if (order[0] === DEFAULT_CAPSULE_ID) return order;
  let saved = null;
  try {
    saved = statusOrderStorage?.getItem(STATUS_ORDER_STORAGE_KEY) ?? null;
  } catch {
    saved = null;
  }
  if (typeof saved === "string" && saved.includes(DEFAULT_CAPSULE_ID)) return order;
  return [DEFAULT_CAPSULE_ID, ...order.filter((id) => id !== DEFAULT_CAPSULE_ID)];
}
const moduleOrderControl = createModuleOrderControl({ storage: statusOrderStorage });

const elements = {
  title: document.querySelector("#report-title"),
  summary: document.querySelector("#report-summary"),
  scope: document.querySelector("#scope-label"),
  meta: document.querySelector("#report-meta"),
  updatedAt: document.querySelector("#updated-at"),
  reportId: document.querySelector("#report-id"),
  projectProgress: document.querySelector("#project-progress"),
  diagnostics: document.querySelector("#diagnostics"),
  content: document.querySelector("#report-content"),
  overview: document.querySelector("#overview-grid"),
  filters: document.querySelector("#status-filters"),
  taskList: document.querySelector("#task-list"),
  empty: document.querySelector("#empty-state"),
  start: document.querySelector("#start-panel"),
  startKicker: document.querySelector("#start-kicker"),
  startTitle: document.querySelector("#start-title"),
  startDescription: document.querySelector("#start-description"),
  exampleLink: document.querySelector("#example-link"),
  scopeDirectory: document.querySelector("#scope-directory"),
  modeBadge: document.querySelector("#mode-badge"),
  themeControl: document.querySelector("#theme-control"),
  viewModeToggle: document.querySelector("#view-mode-toggle"),
  viewerModeLabel: document.querySelector("#viewer-mode-label"),
  editSaveBar: document.querySelector("#edit-save-bar"),
  taskAddShell: document.querySelector("#task-add-shell"),
  timeSummaryButton: document.querySelector("#time-summary-dock"),
  timeDialog: document.querySelector("#time-dialog-dock"),
  timeSettingsDock: document.querySelector("#time-settings-dock"),
  deliveryRiskPreviewDock: document.querySelector("#delivery-risk-preview-dock"),
  deliverySaveConfirmationDock: document.querySelector("#delivery-save-confirmation-dock"),
};

const state = {
  report: null,
  persistedReport: null,
  developerReport: null,
  tasks: [],
  // One selected set of task statuses; items match the two they can carry.
  // Seeded with every status: an empty set is a deliberate "show nothing", and
  // starting there would open the screen with no cards at all.
  selection: createFilterSelection(supportedStatuses),
  diagnostics: [],
  developerAvailable: false,
  timeAnalysis: null,
  timeController: null,
  taskListView: null,
  taskAdderView: null,
  timeSummaryView: null,
  timeDialogView: null,
  diagnosticsView: null,
  scopeDirectoryView: null,
  overviewView: null,
  projectProgressView: null,
  filtersView: null,
  timeSettingsView: null,
  deliveryRiskPreviewView: null,
  deliverySaveConfirmationView: null,
  statusOrder: loadCapsuleOrder(),
  moduleOrder: moduleOrderControl.order,
  editor: {
    available: false,
    editing: false,
    dirty: false,
    externalDirty: false,
    saving: false,
    previewing: false,
    scope: null,
    client: null,
    session: null,
    // The time-input draft (config + versioned manual estimates) is a
    // second draft alongside the Editor Core session: report edits and
    // time-settings edits save through the same dual-revision request, but
    // they are validated and discarded independently.
    timeDraft: null,
    timeDraftView: null,
    timeSettingsPending: false,
    deliveryPreview: null,
    confirmingDeliverySave: false,
  },
};

let viewModeToggleView = null;
let saveBarView = null;
let reportSummaryView = null;

/*
 * One region for the line under the report title. The report's own summary,
 * the start screen's guidance and a load error's advice are the same line in
 * the same place; the host supplies the sentence and, in edit mode, the field
 * behind it, and never writes text into the node itself.
 */
function renderReportSummary(props) {
  if (reportSummaryView) reportSummaryView.update(props);
  else reportSummaryView = createUiView("report-summary", elements.summary, props);
}

// The theme adapter owns storage and the document root; the shared component
// renders the picker and the custom-palette dialog and reports the reader's
// choice back here.
const themeControl = createThemeControl();
let themeControlView = null;

function renderThemeControl() {
  const props = {
    mode: themeControl.mode,
    custom: themeControl.custom,
    systemScheme: themeControl.systemScheme,
    onModeChange: (mode) => {
      themeControl.setMode(mode);
      renderThemeControl();
    },
    onApplyCustom: (palette) => {
      themeControl.applyCustom(palette);
      renderThemeControl();
    },
  };
  if (themeControlView) themeControlView.update(props);
  else themeControlView = createUiView("theme-control", elements.themeControl, props);
}

// The time controller (viewer/assets/time-dialog-control.js) is entirely
// data: no DOM node crosses out of it. This host function is the single
// place that turns its snapshot into the two UI regions, called after every
// command so a periodic refresh, a capsule click and a capacity recalculation
// all converge on the same render path.
function renderTimeReference() {
  if (!state.timeController) return;
  const snap = state.timeController.snapshot();
  elements.timeSummaryButton.hidden = false;
  const summaryProps = {
    ...snap.summary,
    onClick: () => {
      state.timeController.openProjectDetail();
      renderTimeReference();
    },
  };
  if (state.timeSummaryView) state.timeSummaryView.update(summaryProps);
  else state.timeSummaryView = createUiView("time-summary-button", elements.timeSummaryButton, summaryProps);

  const dialogProps = {
    ...snap.dialog,
    editing: state.editor.editing,
    activeEstimate: snap.dialog.kind === "item"
      ? activeEstimateIndex(state.editor.timeDraftView?.inputs ?? null)
        .get(snap.dialog.item?.itemId) ?? null
      : null,
    onManualEstimate: state.editor.editing && state.editor.timeDraft
      ? applyManualEstimateDraft
      : null,
    onClose: () => {
      state.timeController.closeDialog();
      renderTimeReference();
    },
    onToggleDetails: () => {
      state.timeController.toggleDetails();
      renderTimeReference();
    },
    onSetTab: (name) => {
      state.timeController.setActiveTab(name);
      renderTimeReference();
    },
    onSubmitCapacity: (values) => {
      state.timeController.submitCapacityForm(values);
      renderTimeReference();
    },
  };
  if (state.timeDialogView) state.timeDialogView.update(dialogProps);
  else state.timeDialogView = createUiView("time-dialog", elements.timeDialog, dialogProps);
}

function applyManualEstimateDraft(change) {
  if (!state.editor.timeDraft) return { error: "目前沒有可編輯的時間草稿。" };
  const result = state.editor.timeDraft.setManualEstimate(change);
  state.editor.timeDraftView = result.snapshot;
  if (!result.error) invalidateDeliveryPreview();
  syncEditorDirty(result.error || "人工工時已套用到草稿");
  renderEditorTimeExtras();
  renderTimeReference();
  return result;
}

function invalidateDeliveryPreview() {
  state.editor.deliveryPreview = null;
  state.editor.confirmingDeliverySave = false;
}

function refreshModeToggleDisabled() {
  viewModeToggleView?.update({
    disabled: state.editor.saving || state.editor.previewing || state.editor.confirmingDeliverySave,
  });
}

// Time settings, its delivery-risk preview and the save confirmation only
// exist while a local edit session is open. They share one render pass so
// every mutation that can affect any of the three (apply, preview,
// pending-change, manual estimate) stays consistent instead of drifting
// out of sync across separate call sites.
function renderEditorTimeExtras() {
  renderTimeSettings();
  renderDeliveryRiskPreview();
  renderDeliverySaveConfirmation();
}

function renderMissingTimeConfigPanel(dock) {
  const panel = el("section", "spike-time-config-missing");
  panel.setAttribute("aria-labelledby", "missing-time-config-title");
  const copy = el("div");
  const title = el("strong", null, "尚未建立工作容量設定");
  title.id = "missing-time-config-title";
  const description = el(
    "p",
    null,
    "建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。",
  );
  copy.append(title, description);
  const button = el("button", null, "建立 8/8/8 預設設定");
  button.type = "button";
  button.addEventListener("click", () => {
    const result = state.editor.timeDraft.initializeConfig();
    state.editor.timeDraftView = result.snapshot;
    if (!result.error) invalidateDeliveryPreview();
    syncEditorDirty(result.error || "已建立預設草稿");
    renderEditorTimeExtras();
  });
  panel.append(copy, button);
  dock.replaceChildren(panel);
}

function renderTimeSettings() {
  const dock = elements.timeSettingsDock;
  const config = state.editor.editing ? state.editor.timeDraftView?.inputs.config ?? null : null;
  if (!config) {
    state.timeSettingsView?.destroy();
    state.timeSettingsView = null;
    dock.replaceChildren();
    const showMissingPanel = state.editor.editing && state.editor.available;
    dock.hidden = !showMissingPanel;
    if (showMissingPanel) renderMissingTimeConfigPanel(dock);
    return;
  }
  dock.hidden = false;
  // The dock may still hold the plain "missing config" panel from before
  // initializeConfig() ran — mount() appends rather than replacing, so a
  // first-time createUiView call needs the dock cleared or the two stack.
  if (!state.timeSettingsView) dock.replaceChildren();
  const props = {
    config,
    onApply: (settings) => {
      const result = state.editor.timeDraft.setTimeSettings(settings);
      state.editor.timeDraftView = result.snapshot;
      if (!result.error) invalidateDeliveryPreview();
      syncEditorDirty(result.error || "時間設定已套用到草稿");
      renderEditorTimeExtras();
      return result;
    },
    onPreview: () => requestRiskPreview(),
    onPendingChange: (pending) => {
      state.editor.timeSettingsPending = pending;
      if (pending) invalidateDeliveryPreview();
      renderDeliveryRiskPreview();
      renderDeliverySaveConfirmation();
    },
  };
  if (state.timeSettingsView) state.timeSettingsView.update(props);
  else state.timeSettingsView = createUiView("time-settings", dock, props);
}

function renderDeliveryRiskPreview() {
  const dock = elements.deliveryRiskPreviewDock;
  if (!state.editor.deliveryPreview) {
    state.deliveryRiskPreviewView?.destroy();
    state.deliveryRiskPreviewView = null;
    dock.hidden = true;
    return;
  }
  dock.hidden = false;
  const props = { preview: state.editor.deliveryPreview };
  if (state.deliveryRiskPreviewView) state.deliveryRiskPreviewView.update(props);
  else state.deliveryRiskPreviewView = createUiView("delivery-risk-preview", dock, props);
}

// The confirmation is a self-managing <dialog> (it calls showModal() on
// mount); this host only creates and destroys the region, it never opens or
// closes the dialog element itself.
function renderDeliverySaveConfirmation() {
  const dock = elements.deliverySaveConfirmationDock;
  if (!state.editor.confirmingDeliverySave || !state.editor.deliveryPreview) {
    state.deliverySaveConfirmationView?.destroy();
    state.deliverySaveConfirmationView = null;
    return;
  }
  const props = {
    preview: state.editor.deliveryPreview,
    busy: state.editor.saving,
    onBack: () => {
      if (state.editor.saving) return;
      state.editor.confirmingDeliverySave = false;
      renderDeliverySaveConfirmation();
      refreshModeToggleDisabled();
    },
    onConfirm: () => persistSave(),
  };
  if (state.deliverySaveConfirmationView) state.deliverySaveConfirmationView.update(props);
  else state.deliverySaveConfirmationView = createUiView("delivery-save-confirmation", dock, props);
  refreshModeToggleDisabled();
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}


// The save bar's container belongs to the host: `hidden`, `data-state` and
// `aria-busy` describe the fixed panel, while the component renders its
// contents. Keeping them together here stops the two from drifting apart.
const saveBarState = {
  editing: false,
  dirty: false,
  saving: false,
  canUndo: false,
  canRedo: false,
  message: "尚未修改",
};

function updateSaveBar(patch = {}) {
  Object.assign(saveBarState, patch);
  const tone = patch.tone
    ?? (saveBarState.saving ? "saving" : saveBarState.dirty ? "dirty" : "clean");
  elements.editSaveBar.hidden = !saveBarState.editing;
  elements.editSaveBar.dataset.state = tone;
  elements.editSaveBar.setAttribute("aria-busy", saveBarState.saving ? "true" : "false");
  saveBarView?.update(saveBarState);
}

function syncEditorDirty(message = "有尚未儲存的修改") {
  const derived = state.editor.session?.derived;
  const history = state.editor.session?.history;
  state.editor.dirty = Boolean(
    state.editor.externalDirty || derived?.dirty || state.editor.timeDraftView?.dirty,
  );
  state.timeController?.setReportStructureStale(
    Boolean(derived?.timeInvalidation.stale),
  );
  updateSaveBar({
    editing: state.editor.editing,
    dirty: state.editor.dirty,
    saving: state.editor.saving,
    canUndo: Boolean(history?.canUndo),
    canRedo: Boolean(history?.canRedo),
    message: state.editor.dirty ? message : "尚未修改",
  });
  renderTimeReference();
}

function markEditorDirty(message = "有尚未儲存的修改") {
  state.editor.externalDirty = true;
  syncEditorDirty(message);
}

function applyEditorCommand(
  command,
  message = "有尚未儲存的修改",
  { render = false } = {},
) {
  if (!state.editor.session) throw new Error("Editor Core 尚未啟動。");
  const changed = state.editor.session.dispatch(command);
  state.report = state.editor.session.draft;
  if (!changed) return false;
  syncEditorDirty(message);
  if (render) {
    rebuildMergedTasks();
    renderReport();
  }
  return true;
}

function applyEditorHistory(direction) {
  if (!state.editor.editing || state.editor.saving || !state.editor.session) return false;
  const changed = direction === "redo"
    ? state.editor.session.redo()
    : state.editor.session.undo();
  if (!changed) return false;
  state.report = state.editor.session.draft;
  syncEditorDirty(direction === "redo" ? "已重做修改" : "已復原修改");
  rebuildMergedTasks();
  renderReport();
  return true;
}

function currentProjectProgress(tasks) {
  if (state.editor.editing && state.editor.session) {
    return state.editor.session.derived.progress.project;
  }
  return calculateProjectProgress(tasks);
}

function currentTaskProgress(task) {
  if (state.editor.editing && state.editor.session) {
    return state.editor.session.derived.progress.tasks[task.id]
      ?? calculateTaskProgress(task);
  }
  return calculateTaskProgress(task);
}

// Adding a child item stays a host concern: it needs the editor session for a
// stable ID and the Editor Core command, neither of which belongs in a UI
// implementation. The UI only reports the title and priority the reader typed.
function addTaskItem(taskId, draftTitle, priority) {
  const title = normalizeMeaningfulText(draftTitle);
  if (!title) return { error: "子任務描述不可為空白。" };
  const prefix = `item-${taskId}-${Date.now().toString(36)}`;
  const id = state.editor.session.createItemId(taskId, prefix);
  applyEditorCommand(
    {
      type: "add-item",
      taskId,
      field: "pending_items",
      item: { id, title, priority },
    },
    "已新增子任務，尚未儲存",
    { render: true },
  );
  return { error: "" };
}



function safeReportUrl(value, label) {
  let url;
  try {
    url = new URL(value, document.baseURI);
  } catch {
    throw new Error(`${label} 不是有效的 URL。`);
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`${label} 只支援 HTTP 或 HTTPS 來源。`);
  }
  return url;
}

async function fetchJson(value, label) {
  const url = safeReportUrl(value, label);
  const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`${label} 載入失敗（HTTP ${response.status}）。`);
  try {
    return await response.json();
  } catch {
    throw new Error(`${label} 不是有效的 JSON。`);
  }
}

async function fetchOptionalJson(value, label) {
  const url = safeReportUrl(value, label);
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${label} 載入失敗（HTTP ${response.status}）。`);
  try {
    return await response.json();
  } catch {
    throw new Error(`${label} 不是有效的 JSON。`);
  }
}

function formatTime(value) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return formatter.format(new Date(value));
}

function renderDiagnostics() {
  elements.diagnostics.hidden = state.diagnostics.length === 0;
  const props = { diagnostics: state.diagnostics };
  if (state.diagnosticsView) state.diagnosticsView.update(props);
  else state.diagnosticsView = createUiView("diagnostics", elements.diagnostics, props);
}

function renderOverview() {
  const counts = Object.fromEntries(supportedStatuses.map((status) => [status, 0]));
  state.tasks.forEach((task) => { counts[task.status] += 1; });
  const props = { counts, statusOrder: state.statusOrder };
  if (state.overviewView) state.overviewView.update(props);
  else state.overviewView = createUiView("status-overview", elements.overview, props);
}

function renderProjectProgress() {
  const progress = currentProjectProgress(state.tasks);
  const props = {
    percentage: progress.percentage,
    completed: progress.completed,
    total: progress.total,
    timeProgressPercent: state.timeController?.deadlineAvailable
      ? Math.round(state.timeController.analysis.summary.deadline.time_progress_ratio * 100)
      : null,
  };
  if (state.projectProgressView) state.projectProgressView.update(props);
  else state.projectProgressView = createUiView("project-progress", elements.projectProgress, props);
  elements.projectProgress.hidden = false;
}

function statusCounts() {
  const counts = { all: state.tasks.length };
  supportedStatuses.forEach((status) => {
    counts[status] = state.tasks.filter((task) => task.status === status).length;
  });
  return counts;
}




function applyStatusOrder(status, targetStatus, placeAfter = false) {
  const nextOrder = moveStatusOrder(state.statusOrder, status, targetStatus, placeAfter);
  if (nextOrder.every((candidate, index) => candidate === state.statusOrder[index])) return;
  state.statusOrder = nextOrder;
  saveStatusOrder(statusOrderStorage, state.statusOrder);
  renderOverview();
  renderFilters();
  renderTasks();
}

function applyModuleOrder(id, targetId, placeAfter = false) {
  const result = moduleOrderControl.move(id, targetId, placeAfter);
  if (!result.changed) return;
  state.moduleOrder = result.order;
  renderTasks();
}




function renderFilters() {
  // Every status shows, including the ones at zero: hiding them would let the
  // capsule set change under a reader who never touched the filter.
  const tagOrder = state.statusOrder.filter((id) => id !== DEFAULT_CAPSULE_ID);
  state.selection = withTags(state.selection, tagOrder);
  const counts = statusCounts();
  const props = {
    categories: tagOrder.map((status, index) => {
      const label = STATUS_META[status]?.label ?? status;
      const count = counts[status] ?? 0;
      return {
        id: status,
        label,
        count,
        title: "拖曳調整卡片排序；「預設」在第一顆時依報告原本的順序",
        ariaLabel: `${label} ${count}，排序第 ${index}；可拖曳調整`,
      };
    }),
    order: state.statusOrder,
    selected: state.selection.selected,
    defaultLit: isDefaultLit(state.selection),
    className: "status-filter-strip",
    ariaLabel: "工作狀態篩選與排序",
    reorderable: true,
    onSelect: (status) => {
      state.selection = toggleTag(state.selection, status);
      renderFilters();
      renderTasks();
    },
    onSelectDefault: () => {
      state.selection = toggleDefault(state.selection);
      renderFilters();
      renderTasks();
    },
    onReorder: (id, targetId, placeAfter) => {
      applyStatusOrder(id, targetId, placeAfter);
    },
  };
  if (state.filtersView) state.filtersView.update(props);
  else state.filtersView = createUiView("status-filters", elements.filters, props);
}



function rebuildMergedTasks() {
  const merged = mergeReports(state.report, state.developerReport);
  state.tasks = merged.tasks;
  state.developerAvailable = merged.developerAvailable;
}

// Top-level task adder. The control is shared; the host keeps Unicode
// validation and stable ID generation because both belong to Editor Core.
function renderTaskAdder({ expanded = false, error = "" } = {}) {
  elements.taskAddShell.hidden = !state.editor.editing;
  if (!state.editor.editing) {
    state.taskAdderView?.destroy();
    state.taskAdderView = null;
    elements.taskAddShell.replaceChildren();
    return;
  }
  const props = {
    kind: "task",
    expanded,
    policy: PRIORITY_POLICY,
    triggerAriaLabel: "增加工作項目",
    contractText: "預設狀態：待處理；預設優先級：未指定；ID 會獨立產生",
    errorMessage: error,
    onOpen: () => renderTaskAdder({ expanded: true }),
    onCancel: () => renderTaskAdder(),
    onSubmit: ({ title, summary, priority }) => {
      const taskTitle = normalizeMeaningfulText(title);
      const taskSummary = normalizeMeaningfulText(summary);
      if (!taskTitle || !taskSummary) {
        if (!String(title).trim() && !String(summary).trim()) {
          renderTaskAdder();
          return;
        }
        renderTaskAdder({
          expanded: true,
          error: !taskTitle ? "請填寫有效的任務名稱。" : "請填寫有效的任務描述。",
        });
        return;
      }
      const id = state.editor.session.createTaskId(`task-${Date.now().toString(36)}`);
      applyEditorCommand(
        {
          type: "add-task",
          task: {
            id,
            title: taskTitle,
            status: "planned",
            summary: taskSummary,
            priority,
            completed_items: [],
            pending_items: [],
          },
        },
        "已新增任務，尚未儲存",
        { render: true },
      );
    },
  };
  if (state.taskAdderView) state.taskAdderView.update(props);
  else state.taskAdderView = createUiView("add-control", elements.taskAddShell, props);
}

// Props for the task-list region. Only plain data and callbacks cross into the
// UI implementation — no DOM nodes — so the implementation stays replaceable.
function taskListProps(tasks) {
  const time = state.timeController;
  const timeItems = new Map();
  const durations = {};
  const progress = {};
  tasks.forEach((task) => {
    progress[task.id] = currentTaskProgress(task);
    const duration = time?.taskDuration(task.id);
    if (duration) durations[task.id] = duration;
    [...(task.completed_items ?? []), ...(task.pending_items ?? [])].forEach((item) => {
      if (!item || typeof item !== "object") return;
      const itemTime = time?.itemTime(item.id);
      if (itemTime) timeItems.set(item.id, itemTime);
    });
  });

  return {
    tasks,
    progress,
    durations,
    timeItems,
    editing: state.editor.editing,
    statusOrder: state.statusOrder,
    moduleOrder: state.moduleOrder,
    policy: PRIORITY_POLICY,
    emptyLabel: "沒有符合目前篩選的工作項目。",
    onCommand: (command) => {
      applyEditorCommand(command, "有尚未儲存的修改", { render: true });
    },
    onAddItem: (taskId, title, priority) => addTaskItem(taskId, title, priority),
    onModuleReorder: (id, targetId, placeAfter) => {
      applyModuleOrder(id, targetId, placeAfter);
    },
    onTimeClick: (itemId, itemTitle, taskId) => {
      time?.showItemTime(itemId, itemTitle, taskId);
      renderTimeReference();
    },
  };
}

function renderTasks() {
  // 預設 marks where explicit ordering stops: the capsules to its left group
  // the cards, with priority sorting inside each group, and everything else
  // keeps the report's own order.
  const orderedTasks = orderByCapsuleBoundary(
    state.tasks,
    groupingOrder(state.statusOrder),
    (task) => task.status,
    stableSortTasksByPriority,
  );
  // Filtering only hides, and it applies at both levels: a card survives when
  // it matches or when it still holds a matching item, and it then shows only
  // those items. Ordering above is untouched by any of it.
  const selected = state.selection.selected;
  const tasks = orderedTasks
    .filter((task) => taskMatchesSelection(task, selected) || taskHasSelectedItem(task, selected))
    .map((task) => filterTaskItems(task, selected));

  const props = taskListProps(tasks);
  if (state.taskListView) state.taskListView.update(props);
  else state.taskListView = createUiView("task-list", elements.taskList, props);

  elements.empty.hidden = true;
  renderTaskAdder();
}

function renderReport() {
  const { report } = state;
  document.title = `${report.title} — TaskProgress`;
  elements.title.textContent = report.title;
  renderReportSummary({
    text: reportSummaryText(report),
    editable: state.editor.editing && Boolean(state.editor.session),
    value: typeof report.summary === "string" ? report.summary : "",
    placeholder: reportSummaryText({ ...report, summary: "" }),
    onCommit: (value) => {
      applyEditorCommand(
        { type: "set-report-field", field: "summary", value },
        "報告摘要已修改",
      );
    },
  });
  elements.scope.textContent = report.scope_id;
  elements.updatedAt.textContent = formatTime(report.updated_at);
  elements.reportId.textContent = report.report_id;
  elements.meta.hidden = false;
  elements.content.hidden = false;
  elements.start.hidden = true;
  elements.modeBadge.hidden = !state.developerAvailable;
  elements.viewerModeLabel.textContent = state.editor.editing
    ? "Local edit session"
    : "Viewer is read-only";
  viewModeToggleView?.update({
    mode: state.editor.editing ? "edit" : "preview",
  });
  renderDiagnostics();
  renderProjectProgress();
  renderOverview();
  renderFilters();
  renderTasks();
  renderTimeReference();
  renderEditorTimeExtras();
}

async function discoverLocalEditor(scope) {
  if (!scope) return;
  state.editor.scope = scope;
  state.editor.client = createEditHostClient({ scope });
  const capability = await state.editor.client.discover();
  if (!capability) return;
  state.editor.available = true;
  viewModeToggleView?.update({ available: true });
}

// Editing happens in this document, in place — no iframe, no second load of
// the report. A local edit session opens both drafts a save can touch: the
// Editor Core session for the report, and the time-input draft for
// time.config.json/estimates.json, staged from whatever the session already
// carries as defaults.
async function startEditing() {
  if (!state.editor.available || state.editor.editing) return false;
  try {
    const session = await state.editor.client.start();
    state.editor.session = createReportEditorSession(state.persistedReport, {
      fallbackPriority: PRIORITY_POLICY.fallbackValue,
    });
    state.editor.timeDraft = createTimeInputDraft(session.inputs, state.editor.scope, {
      configTemplate: session.input_defaults?.config ?? null,
    });
    state.editor.timeDraftView = state.editor.timeDraft.snapshot();
    state.editor.timeSettingsPending = false;
    invalidateDeliveryPreview();
    state.editor.externalDirty = false;
    state.editor.editing = true;
    state.report = state.editor.session.draft;
    rebuildMergedTasks();
    state.timeController?.setEditing(true);
    syncEditorDirty("尚未修改");
    renderReport();
    return true;
  } catch (error) {
    state.diagnostics.push({
      level: "error",
      message: error instanceof Error ? error.message : "無法進入編輯模式。",
    });
    renderDiagnostics();
    return false;
  }
}

async function cancelEditing() {
  if (!state.editor.editing) return false;
  state.editor.session?.discard();
  state.editor.session = null;
  state.editor.timeDraft?.discard();
  state.editor.timeDraft = null;
  state.editor.timeDraftView = null;
  state.editor.timeSettingsPending = false;
  invalidateDeliveryPreview();
  state.editor.externalDirty = false;
  state.editor.editing = false;
  state.editor.dirty = false;
  state.timeController?.setEditing(false);
  state.timeController?.setReportStructureStale(false);
  state.report = structuredClone(state.persistedReport);
  rebuildMergedTasks();
  updateSaveBar({ editing: false, dirty: false, saving: false });
  renderReport();
  await state.editor.client?.close();
  return true;
}

// A recalculation runs against an isolated preview endpoint — it validates
// the current report draft and the time-input draft together but writes
// nothing. Delivery-date changes route through this before a save can even
// be requested, so the risk comparison always reflects the draft being
// saved, not a stale one.
async function requestRiskPreview() {
  if (!state.editor.available || !state.editor.client || !state.editor.timeDraft) {
    updateSaveBar({ editing: true, saving: false, tone: "error", message: "期限風險預覽需要本機安全編輯服務。" });
    return null;
  }
  if (state.editor.timeSettingsPending) {
    updateSaveBar({ editing: true, saving: false, tone: "error", message: "時間設定仍有未套用內容；請先按重新計算預覽。" });
    return null;
  }
  const settingsChange = state.editor.timeDraft.timeSettingsChangePreview();
  if (!settingsChange) {
    updateSaveBar({ editing: true, saving: false, message: "時間設定沒有變更，不需要重新計算。" });
    return null;
  }
  const reportToPreview = state.editor.session.prepareSave(new Date().toISOString());
  const errors = state.editor.session.validate(reportToPreview);
  if (errors.length) {
    updateSaveBar({ editing: true, saving: false, tone: "error", message: errors[0].message });
    return null;
  }
  state.editor.previewing = true;
  refreshModeToggleDisabled();
  updateSaveBar({
    editing: true,
    saving: true,
    savingLabel: "重新計算中…",
    message: "正在隔離環境重新計算草稿風險…",
  });
  try {
    const response = await state.editor.client.preview({
      report: reportToPreview,
      inputs: state.editor.timeDraft.replacements(),
    });
    state.editor.deliveryPreview = buildTimeSettingsRiskPreview(
      state.timeAnalysis,
      response.analysis,
      settingsChange,
    );
    const message = settingsChange.after.present && !state.editor.deliveryPreview.next.available
      ? "草稿無法建立期限分析，請調整交付日後重新計算。"
      : "時間設定草稿已重新計算；預覽沒有修改任何檔案。";
    updateSaveBar({ editing: true, saving: false, message });
    renderEditorTimeExtras();
    return state.editor.deliveryPreview;
  } catch (error) {
    state.editor.deliveryPreview = null;
    updateSaveBar({
      editing: true,
      saving: false,
      tone: "error",
      message: error instanceof Error ? error.message : "草稿風險重新計算失敗；原始檔案未變更。",
    });
    renderEditorTimeExtras();
    return null;
  } finally {
    state.editor.previewing = false;
    refreshModeToggleDisabled();
  }
}

// The save button's entry point. A plain report edit saves immediately; a
// delivery-date change needs a risk preview and an explicit confirmation
// first, because it can change deadline urgency for everyone reading the
// report, not just the editor.
async function requestSave() {
  if (!state.editor.editing || !state.editor.dirty || state.editor.saving) return;
  if (state.editor.timeSettingsPending) {
    updateSaveBar({ editing: true, saving: false, tone: "error", message: "時間設定仍有未套用內容；請先按重新計算預覽。" });
    return;
  }
  const deliveryChange = state.editor.timeDraft?.deliveryChangePreview() ?? null;
  if (!deliveryChange) {
    await persistSave();
    return;
  }
  const preview = state.editor.deliveryPreview ?? await requestRiskPreview();
  if (!preview) return;
  if (preview.after.present && !preview.next.available) {
    updateSaveBar({ editing: true, saving: false, tone: "error", message: "交付日草稿尚無有效期限分析，不能進入儲存確認。" });
    return;
  }
  state.editor.confirmingDeliverySave = true;
  renderDeliverySaveConfirmation();
}

async function persistSave() {
  const reportToSave = state.editor.session.prepareSave(new Date().toISOString());
  const errors = state.editor.session.validate(reportToSave);
  if (errors.length) {
    updateSaveBar({ editing: true, saving: false, tone: "error", message: errors[0].message });
    return;
  }
  state.editor.saving = true;
  refreshModeToggleDisabled();
  updateSaveBar({
    editing: true,
    dirty: true,
    saving: true,
    message: "正在驗證、儲存並重新分析…",
  });
  let timeSave = null;
  try {
    timeSave = state.timeController?.prepareSave() ?? null;
    await state.editor.client.save({
      report: reportToSave,
      inputs: state.editor.timeDraft?.replacements() ?? {},
      changes: state.editor.timeDraft?.changes() ?? [],
    });
    timeSave?.commit();
    updateSaveBar({
      editing: true,
      dirty: false,
      saving: true,
      message: "已安全儲存，正在重新載入…",
    });
    state.editor.session.commit(reportToSave);
    state.editor.timeDraft?.commit();
    state.editor.externalDirty = false;
    state.editor.dirty = false;
    window.location.reload();
  } catch (error) {
    timeSave?.rollback();
    updateSaveBar({ editing: true, saving: false, tone: "error", message: error instanceof Error
      ? error.message
      : "儲存失敗；原始檔案未變更。" });
  } finally {
    state.editor.saving = false;
    refreshModeToggleDisabled();
  }
}

async function loadScopeCatalog() {
  const response = await fetch("task-progress-scopes.json", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`scope catalog 載入失敗（HTTP ${response.status}）。`);
  let catalog;
  try {
    catalog = await response.json();
  } catch {
    throw new Error("scope catalog 不是有效的 JSON。");
  }
  return validateScopeCatalog(catalog);
}

// The scope-to-URL rule stays here; the component only lays the entries out.
function renderScopeDirectory(scopes) {
  const props = {
    scopes: scopes.map((scope) => ({
      id: scope.id,
      href: buildScopeHref(scope.id),
      baseOnlyHref: scope.hasDeveloperReport ? buildScopeHref(scope.id, "none") : null,
    })),
  };
  if (state.scopeDirectoryView) state.scopeDirectoryView.update(props);
  else state.scopeDirectoryView = createUiView("scope-directory", elements.scopeDirectory, props);
  elements.scopeDirectory.hidden = false;
}

async function showStart() {
  elements.title.textContent = "TaskProgress Viewer";
  renderReportSummary({ text: "每個連結只載入指定 scope 的唯讀報告。" });
  elements.scope.textContent = "尚未指定 report 或 scope";
  elements.startKicker.textContent = "Link-first viewer";
  elements.startTitle.textContent = "從報告連結開始";
  elements.startDescription.textContent = "本機 ?scope= 會自動載入存在的 Developer report；公開網站只載入基本報告。可用 &dev=none 強制停用 Developer overlay。";
  elements.exampleLink.hidden = false;
  elements.scopeDirectory.hidden = true;
  elements.start.hidden = false;
  elements.content.hidden = true;
  elements.meta.hidden = true;
  elements.projectProgress.hidden = true;
  elements.timeSummaryButton.hidden = true;

  try {
    const scopes = await loadScopeCatalog();
    if (!scopes || scopes.length === 0) return;
    elements.title.textContent = "TaskProgress Scopes";
    renderReportSummary({ text: "選擇已由本機 Launcher 載入的任務報告。" });
    elements.scope.textContent = `本機服務 · ${scopes.length} 個 scope`;
    elements.startKicker.textContent = "Local scope directory";
    elements.startTitle.textContent = "已註冊的 Scope";
    elements.startDescription.textContent = "這份清單只包含 scope ID，不會公開本機資料夾路徑。";
    elements.exampleLink.hidden = true;
    renderScopeDirectory(scopes);
  } catch (error) {
    state.diagnostics.push({
      level: "warning",
      message: error instanceof Error ? error.message : "scope catalog 無法載入。",
    });
    renderDiagnostics();
  }
}

function showFatal(message, details = []) {
  elements.title.textContent = "報告無法載入";
  renderReportSummary({ text: "請檢查連結與資料格式後再試一次。" });
  elements.scope.textContent = "資料診斷";
  elements.content.hidden = true;
  elements.projectProgress.hidden = true;
  elements.timeSummaryButton.hidden = true;
  state.diagnostics = [
    { level: "error", message },
    ...details.map((detail) => ({ level: "error", message: detail.message })),
  ];
  renderDiagnostics();
}

async function main() {
  renderReportSummary({ text: "資料會由目前連結自動載入。" });
  const params = new URLSearchParams(window.location.search);
  let request;
  try {
    request = resolveReportRequest(params);
  } catch (error) {
    showFatal(error instanceof Error ? error.message : "scope 無效。 ");
    return;
  }
  if (!request) {
    await showStart();
    return;
  }

  try {
    const report = await fetchJson(request.reportSource, "report.json");
    const errors = validateReport(report);
    if (!isSupportedSchemaVersion(report.schema_version)) {
      errors.unshift({
        message: `Viewer 支援 schema ${SUPPORTED_SCHEMA_VERSIONS.join("、")}，收到 ${report.schema_version ?? "未指定"}。`,
      });
    }
    if (errors.length) {
      showFatal("report.json 未通過驗證。", errors);
      return;
    }

    let developerReport = null;
    const devSource = resolveDeveloperReportSource(
      params,
      request,
      document.baseURI,
    );
    if (devSource) {
      try {
        const isAutomatic = !params.get("dev");
        developerReport = isAutomatic
          ? await fetchOptionalJson(devSource, "report.dev.json")
          : await fetchJson(devSource, "report.dev.json");
        if (!developerReport) {
          developerReport = null;
        }
        const developerErrors = developerReport
          ? validateDeveloperReport(developerReport)
          : [];
        if (developerErrors.length) {
          state.diagnostics.push({
            level: "error",
            message: `report.dev.json 未通過驗證：${developerErrors.map((error) => error.message).join("；")}`,
          });
          developerReport = null;
        }
      } catch (error) {
        state.diagnostics.push({ level: "warning", message: error.message });
      }
    }

    const merged = mergeReports(report, developerReport);
    state.report = report;
    state.persistedReport = structuredClone(report);
    state.developerReport = developerReport;
    state.tasks = merged.tasks;
    state.developerAvailable = merged.developerAvailable;
    state.diagnostics.push(...merged.diagnostics);

    const explicitTimeSource = params.get("time") ?? undefined;
    try {
      const timeSource = resolveTimeAnalysisSource(
        request.reportSource,
        document.baseURI,
        explicitTimeSource,
      );
      if (timeSource) {
        const timeAnalysis = await fetchOptionalJson(timeSource, "time.analysis.json");
        if (timeAnalysis) {
          const timeStatus = inspectTimeAnalysis(timeAnalysis, report.scope_id);
          if (timeStatus.errors.length) {
            state.diagnostics.push({
              level: "warning",
              message: `time.analysis.json 已忽略：${timeStatus.errors.join("；")}`,
            });
          } else {
            state.timeAnalysis = JSON.parse(JSON.stringify(timeAnalysis));
            if (!timeStatus.deadlineAvailable) {
              delete state.timeAnalysis.summary.deadline;
            }
            if (timeStatus.deadlineErrors.length) {
              state.diagnostics.push({
                level: "warning",
                message: `期限分析已忽略：${timeStatus.deadlineErrors.join("；")}`,
              });
            }
          }
        }
      }
    } catch (error) {
      state.diagnostics.push({
        level: "warning",
        message: error instanceof Error
          ? `時間參考已忽略：${error.message}`
          : "時間參考無法載入。",
      });
    }

    if (state.timeAnalysis) {
      try {
        const projectProgress = calculateProjectProgress(state.tasks);
        state.timeController = createTimeReferenceController({
          sourceAnalysis: state.timeAnalysis,
          report,
          location: window.location,
          workProgressRatio: projectProgress.total
            ? projectProgress.completed / projectProgress.total
            : 0,
          onDraftChange: (message) => markEditorDirty(message),
        });
      } catch (error) {
        state.timeAnalysis = null;
        state.timeController = null;
        elements.timeSummaryButton.hidden = true;
        state.diagnostics.push({
          level: "warning",
          message: error instanceof Error
            ? `時間參考已忽略：${error.message}`
            : "時間參考無法初始化。",
        });
      }
    }
    await discoverLocalEditor(request.scope);
    renderReport();
  } catch (error) {
    showFatal(error instanceof Error ? error.message : "發生未知錯誤。");
  }
}

renderThemeControl();
viewModeToggleView = createUiView("mode-toggle", elements.viewModeToggle, {
  mode: "preview",
  available: false,
  disabled: false,
  hideWhenUnavailable: true,
  onToggle: () => {
    const nextMode = state.editor.editing ? "preview" : "edit";
    void (nextMode === "edit" ? startEditing() : cancelEditing());
  },
});
saveBarView = createUiView("save-bar", elements.editSaveBar, {
  editing: false,
  dirty: false,
  saving: false,
  canUndo: false,
  canRedo: false,
  onUndo: () => applyEditorHistory("undo"),
  onRedo: () => applyEditorHistory("redo"),
  onDiscard: () => {
    void cancelEditing();
  },
  onSave: requestSave,
});
bindHistoryShortcuts(document, {
  isActive: () => state.editor.editing && !state.editor.saving,
  onUndo: () => applyEditorHistory("undo"),
  onRedo: () => applyEditorHistory("redo"),
});
function refreshTimeReference() {
  state.timeController?.refresh();
  renderTimeReference();
}
window.setInterval(refreshTimeReference, 60_000);
window.addEventListener("pageshow", refreshTimeReference);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refreshTimeReference();
});
window.addEventListener("beforeunload", (event) => {
  if (!state.editor.dirty) return;
  event.preventDefault();
  event.returnValue = "";
});
main();
