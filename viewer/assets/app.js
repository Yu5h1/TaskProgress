import {
  PRIORITY_POLICY,
  STATUS_META,
  SUPPORTED_SCHEMA_VERSION,
  buildScopeHref,
  calculateProjectProgress,
  calculateTaskProgress,
  mergeReports,
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
import { createUiView } from "./ui-host.js";
import { createThemeControl } from "./theme-control.js";
import {
  inspectTimeAnalysis,
  resolveTimeAnalysisSource,
} from "./time-model.js";
import { createTimeReferenceController } from "./time-dialog-control.js";
import {
  loadStatusOrder,
  moveStatusOrder,
  saveStatusOrder,
  stableSortByStatus,
  taskMatchesViewStatus,
} from "./status-order.js";

const supportedStatuses = Object.keys(STATUS_META);

function getBrowserStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

const statusOrderStorage = getBrowserStorage();

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
  editorSurfaceOverlay: document.querySelector("#editor-surface-overlay"),
  editorSurfaceFrame: document.querySelector("#editor-surface-frame"),
  taskAddShell: document.querySelector("#task-add-shell"),
  timeSummaryButton: document.querySelector("#time-summary-dock"),
  timeDialog: document.querySelector("#time-dialog-dock"),
};

const state = {
  report: null,
  persistedReport: null,
  developerReport: null,
  tasks: [],
  filter: "all",
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
  statusOrder: loadStatusOrder(statusOrderStorage, supportedStatuses),
  editor: {
    available: false,
    editing: false,
    dirty: false,
    externalDirty: false,
    saving: false,
    scope: null,
    revision: null,
    token: null,
    session: null,
    surfaceUrl: null,
    surfaceActive: false,
  },
};

let viewModeToggleView = null;
let saveBarView = null;

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
    state.editor.externalDirty || derived?.dirty,
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
    counts[status] = state.tasks.filter((task) => taskMatchesViewStatus(task, status)).length;
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




function renderFilters() {
  const props = {
    counts: statusCounts(),
    statusOrder: state.statusOrder,
    activeFilter: state.filter,
    statusLabels: Object.fromEntries(
      Object.entries(STATUS_META).map(([status, meta]) => [status, meta.label]),
    ),
    onFilterChange: (filter) => {
      state.filter = filter;
      renderFilters();
      renderTasks();
    },
    onReorder: (status, targetStatus, placeAfter) => {
      applyStatusOrder(status, targetStatus, placeAfter);
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
    contractText: "預設狀態：待處理；預設優先級：一般；ID 會獨立產生",
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
    policy: PRIORITY_POLICY,
    emptyLabel: "沒有符合目前篩選的工作項目。",
    onCommand: (command) => {
      applyEditorCommand(command, "有尚未儲存的修改", { render: true });
    },
    onAddItem: (taskId, title, priority) => addTaskItem(taskId, title, priority),
    onTimeClick: (itemId, itemTitle) => {
      time?.showItemTime(itemId, itemTitle);
      renderTimeReference();
    },
  };
}

function renderTasks() {
  const orderedTasks = stableSortByStatus(
    stableSortTasksByPriority(state.tasks),
    state.statusOrder,
  );
  const tasks = state.filter === "all"
    ? orderedTasks
    : orderedTasks.filter((task) => taskMatchesViewStatus(task, state.filter));

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
  elements.summary.textContent = `${report.tasks.length} 個可追溯任務；狀態由報告資料提供。`;
  elements.scope.textContent = report.scope_id;
  elements.updatedAt.textContent = formatTime(report.updated_at);
  elements.reportId.textContent = report.report_id;
  elements.meta.hidden = false;
  elements.content.hidden = false;
  elements.start.hidden = true;
  elements.modeBadge.hidden = !state.developerAvailable;
  elements.viewerModeLabel.textContent = state.editor.editing || state.editor.surfaceActive
    ? "Local edit session"
    : "Viewer is read-only";
  viewModeToggleView?.update({
    mode: state.editor.editing || state.editor.surfaceActive ? "edit" : "preview",
  });
  renderDiagnostics();
  renderProjectProgress();
  renderOverview();
  renderFilters();
  renderTasks();
  renderTimeReference();
}

async function readProblem(response, fallback) {
  try {
    const problem = await response.json();
    return problem.detail ? `${problem.title}：${problem.detail}` : problem.title ?? fallback;
  } catch {
    return fallback;
  }
}

async function discoverLocalEditor(scope) {
  if (!scope) return;
  try {
    const response = await fetch(
      `/__taskprogress/v1/capabilities/${encodeURIComponent(scope)}`,
      { headers: { Accept: "application/json" }, cache: "no-store" },
    );
    if (!response.ok) return;
    const capability = await response.json();
    if (!capability.editable || capability.scope_id !== scope) return;
    state.editor.available = true;
    state.editor.scope = scope;
    state.editor.revision = capability.revision;
    if (typeof capability.editor_surface_url === "string") {
      const surfaceUrl = new URL(capability.editor_surface_url, window.location.origin);
      if (
        surfaceUrl.origin === window.location.origin
        && surfaceUrl.pathname.startsWith("/__taskprogress/v1/editor/")
      ) {
        state.editor.surfaceUrl = surfaceUrl.href;
      }
    }
    viewModeToggleView?.update({ available: true });
  } catch {
    // Public/static hosting intentionally has no editor capability.
  }
}

async function startEditing() {
  if (!state.editor.available || state.editor.editing || state.editor.surfaceActive) return false;
  if (state.editor.surfaceUrl) {
    const editorUrl = new URL(state.editor.surfaceUrl);
    editorUrl.search = window.location.search;
    editorUrl.searchParams.set("scope", state.editor.scope);
    editorUrl.searchParams.set("embedded", "1");
    state.editor.surfaceActive = true;
    elements.editorSurfaceFrame.src = editorUrl.href;
    elements.editorSurfaceOverlay.hidden = false;
    document.documentElement.classList.add("editor-surface-open");
    elements.editorSurfaceFrame.focus();
    return true;
  }
  try {
    const response = await fetch("/__taskprogress/v1/edit-sessions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-TaskProgress-Editor": "1",
      },
      body: JSON.stringify({ scope_id: state.editor.scope }),
    });
    if (!response.ok) {
      throw new Error(await readProblem(response, "無法建立本機編輯工作階段。"));
    }
    const session = await response.json();
    state.editor.token = session.token;
    state.editor.revision = session.revision;
    state.editor.session = createReportEditorSession(state.persistedReport, {
      fallbackPriority: PRIORITY_POLICY.fallbackValue,
    });
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

function closeEditorSurface({ saved = false } = {}) {
  if (!state.editor.surfaceActive) return;
  state.editor.surfaceActive = false;
  elements.editorSurfaceOverlay.hidden = true;
  elements.editorSurfaceFrame.src = "about:blank";
  document.documentElement.classList.remove("editor-surface-open");
  viewModeToggleView?.update({ mode: "preview" });
  if (saved) window.location.reload();
}

window.addEventListener("message", (event) => {
  if (
    event.origin !== window.location.origin
    || event.source !== elements.editorSurfaceFrame.contentWindow
    || event.data?.type !== "taskprogress:editor-close"
  ) return;
  closeEditorSurface({ saved: event.data.saved === true });
});

async function cancelEditing() {
  if (!state.editor.editing) return false;
  const token = state.editor.token;
  state.editor.session?.discard();
  state.editor.session = null;
  state.editor.externalDirty = false;
  state.editor.editing = false;
  state.editor.dirty = false;
  state.editor.token = null;
  state.timeController?.setEditing(false);
  state.timeController?.setReportStructureStale(false);
  state.report = structuredClone(state.persistedReport);
  rebuildMergedTasks();
  updateSaveBar({ editing: false, dirty: false, saving: false });
  renderReport();
  if (!token) return true;
  try {
    await fetch(
      `/__taskprogress/v1/edit-sessions/${encodeURIComponent(state.editor.scope)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-TaskProgress-Editor": "1",
        },
      },
    );
  } catch {
    // The short-lived server session expires automatically.
  }
  return true;
}

async function saveEditing() {
  if (!state.editor.editing || !state.editor.dirty || state.editor.saving) return;
  const reportToSave = state.editor.session
    ? state.editor.session.prepareSave(new Date().toISOString())
    : structuredClone(state.report);
  const errors = state.editor.session
    ? state.editor.session.validate(reportToSave)
    : validateReport(reportToSave);
  if (errors.length) {
    updateSaveBar({ editing: true, saving: false, tone: "error", message: errors[0].message });
    return;
  }
  state.editor.saving = true;
  viewModeToggleView?.update({ disabled: true });
  updateSaveBar({
    editing: true,
    dirty: true,
    saving: true,
    message: "正在驗證、儲存並重新分析…",
  });
  let timeSave = null;
  try {
    timeSave = state.timeController?.prepareSave() ?? null;
    const response = await fetch(
      `/__taskprogress/v1/reports/${encodeURIComponent(state.editor.scope)}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${state.editor.token}`,
          "Content-Type": "application/json",
          "If-Match": `"${state.editor.revision}"`,
          "X-TaskProgress-Editor": "1",
        },
        body: JSON.stringify(reportToSave),
      },
    );
    if (!response.ok) {
      throw new Error(await readProblem(response, "儲存失敗；原始檔案未變更。"));
    }
    timeSave?.commit();
    updateSaveBar({
      editing: true,
      dirty: false,
      saving: true,
      message: "已安全儲存，正在重新載入…",
    });
    state.editor.session?.commit(reportToSave);
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
    viewModeToggleView?.update({ disabled: false });
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
  elements.summary.textContent = "每個連結只載入指定 scope 的唯讀報告。";
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
    elements.summary.textContent = "選擇已由本機 Launcher 載入的任務報告。";
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
  elements.summary.textContent = "請檢查連結與資料格式後再試一次。";
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
    if (report.schema_version !== SUPPORTED_SCHEMA_VERSION) {
      errors.unshift({ message: `Viewer 支援 schema ${SUPPORTED_SCHEMA_VERSION}，收到 ${report.schema_version ?? "未指定"}。` });
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
    const nextMode = (state.editor.editing || state.editor.surfaceActive) ? "preview" : "edit";
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
  onSave: saveEditing,
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
