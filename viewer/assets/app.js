import {
  PRIORITY_POLICY,
  STATUS_META,
  SUPPORTED_SCHEMA_VERSIONS,
  buildScopeHref,
  calculateProjectProgress,
  calculateTaskProgress,
  isSupportedSchemaVersion,
  mergeReports,
  projectPointerCard,
  reportPathForScope,
  reportSummaryText,
  resolveDeveloperReportSource,
  resolveReportRequest,
  stableSortTasksByPriority,
  taskKind,
  validateScopeCatalog,
  validateDeveloperReport,
  validateReport,
} from "./report-model.js";
import {
  normalizeMeaningfulText,
} from "./editor-core.js";
import { createReportEditorAdapter } from "./report-editor-adapter.js";
import { createPersistenceController } from "./persistence-mode.js";
import {
  bindHistoryShortcuts,
} from "./editor-surface.js";
import { createEditHostClient } from "./edit-host-client.js";
import {
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
import { createTrustedModuleRegistry } from "./module-registry.js";
import { activateCapsule, attachModules, collectCapsules, disposeModules } from "./module-composition.js";
import { TIME_MODULE_TYPE, createTimeModuleDefinition } from "./time-module-definition.js";
import { COST_MODULE_TYPE, createCostModuleDefinition } from "./cost-module-definition.js";
import { inspectCostAnalysis } from "./cost-model.js";
import { loadLegacyTimeAnalysis } from "./time-legacy-discovery.js";
import { loadManifestTimeAnalysis } from "./time-manifest-discovery.js";
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

/*
 * The trusted module registry: which module types this build ships a
 * Renderer for. Registering happens once, at build composition — never from
 * report data, which can declare a module but can never install one.
 */
const moduleRegistry = createTrustedModuleRegistry([
  createTimeModuleDefinition(),
  createCostModuleDefinition(),
]);

/*
 * Modules are addressed by type, never by position. Indexing into the
 * attached list reads correctly while one module is registered and silently
 * returns the wrong module once a second one is, because attach order is not
 * a contract.
 */
function attachedModule(type) {
  return state.attachedModules.find((entry) => entry.type === type)?.instance ?? null;
}

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
  moduleDetailDock: document.querySelector("#module-detail-dock"),
  timeSettingsDock: document.querySelector("#time-settings-dock"),
  deliverySaveConfirmationDock: document.querySelector("#delivery-save-confirmation-dock"),
};

const state = {
  report: null,
  persistedReport: null,
  developerReport: null,
  tasks: [],
  // Report pointer cards fetch their target report independently of the
  // current report's own load; each entry is keyed by the pointer task's own
  // stable id and never by the target scope, since two pointers could name
  // the same target. Nothing here is written back to `report`.
  pointerCards: new Map(),
  // One selected set of task statuses; items match the two they can carry.
  // Seeded with every status: an empty set is a deliberate "show nothing", and
  // starting there would open the screen with no cards at all.
  selection: createFilterSelection(supportedStatuses),
  diagnostics: [],
  developerAvailable: false,
  timeAnalysis: null,
  taskListView: null,
  taskAdderView: null,
  projectModuleStripView: null,
  // Modules attached for the currently loaded report, in registry order.
  // Emptied and re-attached per load; `disposeModules` runs first so a
  // previous scope's instances cannot outlive it.
  attachedModules: [],
  // True while an unsaved draft has added or removed tasks/items, so every
  // module projection keyed to those IDs no longer matches. Distinct from a
  // saved report_revision mismatch: the draft has no revision to compare
  // against yet, so this is the only way that divergence is visible.
  moduleProjectionStale: false,
  moduleDetailViews: new Map(),
  diagnosticsView: null,
  scopeDirectoryView: null,
  overviewView: null,
  projectProgressView: null,
  filtersView: null,
  deliverySaveConfirmationView: null,
  statusOrder: loadCapsuleOrder(),
  moduleOrder: moduleOrderControl.order,
  editor: {
    available: false,
    editing: false,
    externalDirty: false,
    previewing: false,
    scope: null,
    client: null,
    session: null,
    persistence: null,
    persistenceView: null,
    // The time-input draft (config + versioned manual estimates) is a
    // second draft alongside the Editor Core session: report edits and
    // time-settings edits save through the same dual-revision request, but
    // they are validated and discarded independently.
    timeDraft: null,
    timeDraftView: null,
    timeSettingsPending: false,
    deliveryPreview: null,
    confirmingDeliverySave: false,
    confirmationResolve: null,
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
// all converge on the same render path. Prop computation itself lives in
// `time-viewer-module.js` (verified equivalent to the previous inline version
// through a stage-2 passive-shadow comparison, 2026-08-25); this function
// only assembles the context — including every editing-session callback,
// since that state stays owned here, not by the render module — and mounts
// the result.
function renderTimeReference() {
  if (!state.attachedModules.length) return;
  elements.timeSummaryButton.hidden = false;

  /*
   * Only the editing session travels from here into a module's detail panel.
   * The module supplies its own snapshot and the commands that drive its
   * dialog; this host no longer holds a controller to call.
   */
  const editingContext = {
    editing: state.editor.editing,
    timeDraftView: state.editor.timeDraftView,
    hasTimeDraft: Boolean(state.editor.timeDraft),
    deliveryPreview: state.editor.deliveryPreview,
    callbacks: {
      onManualEstimate: applyManualEstimateDraft,
      onApplyTimeSettings: (settings) => {
        const result = state.editor.timeDraft.setTimeSettings(settings);
        state.editor.timeDraftView = result.snapshot;
        if (!result.error) invalidateDeliveryPreview();
        renderEditorTimeExtras();
        return result;
      },
      onPreviewTimeSettings: () => requestRiskPreview({ scheduleSave: true }),
      onPendingTimeSettingsChange: (pending) => {
        state.editor.timeSettingsPending = pending;
        if (pending) invalidateDeliveryPreview();
        renderEditorTimeExtras();
      },
      onInitializeTimeConfig: () => {
        const result = state.editor.timeDraft.initializeConfig();
        state.editor.timeDraftView = result.snapshot;
        if (!result.error) invalidateDeliveryPreview();
        if (!result.error) state.editor.persistence?.changed({ type: "initialize-time-config" });
        renderEditorTimeExtras();
      },
    },
  };

  /*
   * The main-panel module strip, filled by the registry rather than by this
   * function naming a module. Time contributes its capsule through its
   * registered definition; a second module joins by registering one too, not
   * by editing this render path.
   *
   * Each capsule keeps its own module's class, so the strip supplies layout,
   * ordering and scrolling while the module keeps its appearance — exactly
   * the split the slot contract describes.
   */
  const { capsules, diagnostics: capsuleDiagnostics } = collectCapsules(
    state.attachedModules,
    "project-summary",
    null,
    { stale: state.moduleProjectionStale },
  );
  capsuleDiagnostics.forEach((diagnostic) => {
    console.warn(`[module] ${diagnostic.message}`);
  });
  /*
   * A stale projection hides every module value, which on its own would look
   * like the figures had simply broken. Core says why, in wording that names
   * no module — the same "資料待重算" the stale policy already specifies —
   * because the condition is Core's judgement, not any one module's.
   */
  const staleNotice = elements.timeSummaryButton.querySelector(".module-stale-notice");
  if (state.moduleProjectionStale && !staleNotice) {
    const notice = el("span", "module-stale-notice", "資料待重算");
    notice.title = "任務結構已變更，模組資料需要重新計算後才會再顯示。";
    elements.timeSummaryButton.append(notice);
  } else if (!state.moduleProjectionStale && staleNotice) {
    staleNotice.remove();
  }

  const projectCapsuleProps = {
    capsules,
    moduleOrder: state.moduleOrder,
    className: "project-module-strip",
    ariaLabel: "專案模組",
    // Dispatch by capsule id: with more than one capsule the strip must reach
    // the module that owns the one actually clicked.
    onActivate: (capsuleId) => activateCapsule(state.attachedModules, "project-summary", capsuleId),
    // Both strips reorder through the one control, so dragging a capsule in
    // either row moves it in both.
    onReorder: applyModuleOrder,
  };
  if (state.projectModuleStripView) state.projectModuleStripView.update(projectCapsuleProps);
  else {
    state.projectModuleStripView = createUiView(
      "project-module-strip",
      elements.timeSummaryButton,
      projectCapsuleProps,
    );
  }

  /*
   * Detail follows the same rule as the inline values: a stale projection is
   * not shown at all. Leaving an open panel up would be worse than hiding the
   * capsules, since it presents figures the report no longer matches — and it
   * is Core's judgement, so Core tears it down rather than asking the module
   * to withdraw.
   */
  renderModuleDetails(editingContext);
}

/*
 * Every module's detail panel through one dock and one rule.
 *
 * The host used to hold a dock, a selector and a mount block per module, so a
 * third module meant editing markup and this file. Now it iterates whatever is
 * attached and asks each module which view renders it, which is the same shape
 * the capsule strips already use — modules are addressed by type, never by
 * position, and the host names none of them.
 *
 * The stale rule applies to all of them, not just the first. It used to return
 * before Cost was reached, which left Cost's panel showing figures the report
 * no longer matched while Time's was correctly torn down.
 */
function renderModuleDetails(editingContext) {
  for (const { type, instance } of state.attachedModules) {
    const detail = state.moduleProjectionStale
      ? null
      : instance.detailProps?.(editingContext);
    const mounted = state.moduleDetailViews.get(type);

    if (!detail) {
      mounted?.view.destroy();
      mounted?.element.remove();
      state.moduleDetailViews.delete(type);
      continue;
    }

    if (mounted) {
      mounted.view.update(detail);
      continue;
    }

    const element = el("div", "module-detail");
    element.dataset.moduleType = type;
    elements.moduleDetailDock.append(element);
    state.moduleDetailViews.set(type, {
      element,
      view: createUiView(instance.detailView, element, detail),
    });
  }
}

function applyManualEstimateDraft(change) {
  if (!state.editor.timeDraft) return { error: "目前沒有可編輯的時間草稿。" };
  const result = state.editor.timeDraft.setManualEstimate(change);
  state.editor.timeDraftView = result.snapshot;
  if (!result.error) invalidateDeliveryPreview();
  if (!result.error) state.editor.persistence?.changed({ type: "set-manual-estimate" });
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
    disabled: Boolean(
      state.editor.persistenceView?.saving
      || state.editor.previewing
      || state.editor.confirmingDeliverySave
    ),
  });
}

// Time settings, its delivery-risk preview and the save confirmation only
// exist while a local edit session is open. They share one render pass so
// every mutation that can affect any of the three (apply, preview,
// pending-change, manual estimate) stays consistent instead of drifting
// out of sync across separate call sites.
function renderEditorTimeExtras() {
  renderTimeReference();
  renderMissingTimeConfigFallback();
  renderDeliverySaveConfirmation();
}

// The bootstrap prompt for a project with no time.config.json and no
// time.analysis.json at all: no module has attached yet (there
// is nothing on disk to build it from), so the shared TimeDialog isn't
// mounted either and this can't route through it like every other time
// setting now does. It is the one remaining exception to "the delivery
// button is the only entry point" — there is no delivery button to be found
// until a first save regenerates time.analysis.json and the page reloads.
function renderMissingTimeConfigFallback() {
  const dock = elements.timeSettingsDock;
  const show = state.editor.editing
    && state.editor.available
    && !state.attachedModules.length
    && !state.editor.timeDraftView?.inputs.config;
  if (!show) {
    dock.hidden = true;
    dock.replaceChildren();
    return;
  }
  dock.hidden = false;
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
    if (!result.error) state.editor.persistence?.changed({ type: "initialize-time-config" });
    renderEditorTimeExtras();
  });
  panel.append(copy, button);
  dock.replaceChildren(panel);
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
    busy: false,
    onBack: () => {
      settleDeliveryConfirmation(false);
    },
    onConfirm: () => settleDeliveryConfirmation(true),
  };
  if (state.deliverySaveConfirmationView) state.deliverySaveConfirmationView.update(props);
  else state.deliverySaveConfirmationView = createUiView("delivery-save-confirmation", dock, props);
  refreshModeToggleDisabled();
}

function settleDeliveryConfirmation(confirmed) {
  const resolve = state.editor.confirmationResolve;
  state.editor.confirmationResolve = null;
  state.editor.confirmingDeliverySave = false;
  renderDeliverySaveConfirmation();
  refreshModeToggleDisabled();
  resolve?.(confirmed === true);
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

function syncPersistenceView(next = state.editor.persistence?.snapshot()) {
  if (!next) return;
  state.editor.persistenceView = next;
  state.report = next.report;
  // Core owns the stale judgement; modules are simply not asked while it
  // holds. Nothing here reaches into a module's own API to tell it.
  state.moduleProjectionStale = Boolean(next.derived?.timeInvalidation.stale);
  updateSaveBar({
    editing: state.editor.editing,
    cautious: next.cautious,
    dirty: next.dirty,
    saving: next.saving,
    canUndo: Boolean(next.history?.canUndo),
    canRedo: Boolean(next.history?.canRedo),
    message: next.message,
  });
  renderTimeReference();
  refreshModeToggleDisabled();
}

function markEditorDirty(message = "有尚未儲存的修改") {
  state.editor.externalDirty = true;
  state.editor.persistence?.changed({ type: "set-local-capacity", message });
}

function applyEditorCommand(
  command,
  message = "有尚未儲存的修改",
  { render = false } = {},
) {
  if (!state.editor.persistence) throw new Error("Editor Core 尚未啟動。");
  state.editor.persistence.dispatch(command);
  state.report = state.editor.persistence.snapshot().report;
  if (render) {
    rebuildMergedTasks();
    renderReport();
  }
  return true;
}

function applyEditorHistory(direction) {
  if (!state.editor.editing || state.editor.persistenceView?.saving || !state.editor.persistence) return false;
  if (direction === "redo") state.editor.persistence.redo();
  else state.editor.persistence.undo();
  state.report = state.editor.persistence.snapshot().report;
  rebuildMergedTasks();
  renderReport();
  return true;
}

function currentProjectProgress(tasks) {
  if (state.editor.editing && state.editor.persistenceView) {
    return state.editor.persistenceView.derived.progress.project;
  }
  return calculateProjectProgress(tasks);
}

function currentTaskProgress(task) {
  if (state.editor.editing && state.editor.persistenceView) {
    return state.editor.persistenceView.derived.progress.tasks[task.id]
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

/*
 * Cost's sidecar, beside report.json. A missing file is the normal case and
 * stays silent; an invalid one is a diagnostic and the module simply does not
 * attach, so a broken Cost projection can never take the report down with it.
 */
async function loadCostAnalysis(reportSource, scopeId) {
  try {
    const url = new URL("cost.analysis.json", new URL(reportSource, document.baseURI));
    const raw = await fetchOptionalJson(url, "cost.analysis.json");
    if (!raw) return null;
    const status = inspectCostAnalysis(raw, scopeId);
    if (status.errors.length) {
      state.diagnostics.push({
        level: "warning",
        message: `cost.analysis.json 已忽略：${status.errors.join("；")}`,
      });
      return null;
    }
    return raw;
  } catch (error) {
    state.diagnostics.push({
      level: "warning",
      message: `cost.analysis.json 已忽略：${error?.message ?? error}`,
    });
    return null;
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

// The read-only state behind one Report pointer card, keyed by the pointer
// task's own id. `loading` is the default so a first paint shows a card
// before its target report ever resolves.
function pointerCardView(taskId) {
  return state.pointerCards.get(taskId) ?? { status: "loading" };
}

/*
 * Report pointer cards fetch their target report independently of the
 * current report's own load, and one failing target must not take the rest
 * of this report down with it — each fetch is isolated in its own try/catch
 * and only ever updates its own entry.
 *
 * Nothing is cached between calls to `main`/`renderReport`: this always reads
 * the target report fresh, so a stale card never outlives the data it was
 * built from.
 */
async function loadPointerCards() {
  const pointerTasks = state.tasks.filter((task) => taskKind(task) === "report_pointer");
  if (!pointerTasks.length) {
    if (state.pointerCards.size) state.pointerCards = new Map();
    return;
  }

  const entries = await Promise.all(pointerTasks.map(async (task) => {
    const scopeId = task.report_ref?.scope_id;
    try {
      const targetReport = await fetchJson(reportPathForScope(scopeId), `${scopeId} 的 report.json`);
      if (!isSupportedSchemaVersion(targetReport.schema_version)) {
        throw new Error(`不支援的 schema 版本：${targetReport.schema_version ?? "未指定"}`);
      }
      const errors = validateReport(targetReport);
      if (errors.length) {
        throw new Error(`目標報告未通過驗證：${errors[0].message}`);
      }
      return [task.id, { status: "ready", card: projectPointerCard(task, targetReport) }];
    } catch (error) {
      return [task.id, {
        status: "error",
        message: error instanceof Error ? error.message : "指路卡載入失敗。",
      }];
    }
  }));
  state.pointerCards = new Map(entries);
  renderTasks();
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
  // Core progress reports the report's own task progress and nothing else.
  // It used to append Time's elapsed-window share to its accessible label,
  // which meant this core path reached three levels into a module's data
  // (`analysis.summary.deadline.time_progress_ratio`, three levels into a
  // module's own shape) and
  // could not survive that controller moving behind the module boundary.
  // That sentence now lives on Time's own capsule.
  const props = {
    percentage: progress.percentage,
    completed: progress.completed,
    total: progress.total,
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
  // One order, both strips: the main-panel row and every item row have to
  // repaint together or they would show the same modules in different orders.
  renderTimeReference();
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
  const itemCapsules = new Map();
  const moduleTotals = {};
  const progress = {};
  const pointerCards = {};
  tasks.forEach((task) => {
    // A pointer card has no items or time detail of its own to fetch — its
    // own status, progress and rows come from its fetched target instead.
    if (task.kind === "report_pointer") {
      const scopeId = task.report_ref?.scope_id ?? null;
      pointerCards[task.id] = {
        ...pointerCardView(task.id),
        openHref: scopeId ? buildScopeHref(scopeId) : null,
      };
      return;
    }
    progress[task.id] = currentTaskProgress(task);
    const taskTotals = collectCapsules(
      state.attachedModules,
      "task-body",
      { taskId: task.id },
      { stale: state.moduleProjectionStale },
    );
    taskTotals.diagnostics.forEach((d) => console.warn(`[module] ${d.message}`));
    if (taskTotals.capsules.length) moduleTotals[task.id] = taskTotals.capsules;
    // Capsules per stable item come from the registry, not from this host
    // knowing which modules exist. A module that has nothing for an item
    // contributes no capsule, which is also what leaves an unset item's row
    // with no capsule at all.
    [...(task.completed_items ?? []), ...(task.pending_items ?? [])].forEach((item) => {
      if (!item || typeof item !== "object") return;
      const { capsules, diagnostics } = collectCapsules(
        state.attachedModules,
        "item-inline",
        { taskId: task.id, itemId: item.id, itemTitle: item.title },
        { stale: state.moduleProjectionStale, editing: state.editor.editing },
      );
      diagnostics.forEach((diagnostic) => console.warn(`[module] ${diagnostic.message}`));
      if (capsules.length) itemCapsules.set(item.id, capsules);
    });
  });

  return {
    tasks,
    progress,
    moduleTotals,
    itemCapsules,
    pointerCards,
    editing: state.editor.editing,
    statusOrder: state.statusOrder,
    moduleOrder: state.moduleOrder,
    policy: PRIORITY_POLICY,
    emptyLabel: "沒有符合目前篩選的工作項目。",
    onCommand: (command) => {
      if (["delete-task", "delete-item"].includes(command.type)
        && !globalThis.confirm("這會永久刪除所選項目。確定繼續？")) {
        return;
      }
      applyEditorCommand(command, "有尚未儲存的修改", { render: true });
    },
    onAddItem: (taskId, title, priority) => addTaskItem(taskId, title, priority),
    onModuleReorder: (id, targetId, placeAfter) => {
      applyModuleOrder(id, targetId, placeAfter);
    },
    onModuleActivate: (capsuleId, subject) => {
      activateCapsule(state.attachedModules, "item-inline", capsuleId, subject);
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
  // those items. Ordering above is untouched by any of it. A pointer card
  // carries no status of its own to match against a status filter — the
  // 待處理／已完成 split describes work, not a link to another report — so
  // it stays visible regardless of the current selection.
  const selected = state.selection.selected;
  const tasks = orderedTasks
    .filter((task) => taskKind(task) === "report_pointer"
      || taskMatchesSelection(task, selected)
      || taskHasSelectedItem(task, selected))
    .map((task) => {
      const kind = taskKind(task);
      return kind === "report_pointer"
        ? { ...task, kind }
        : { ...filterTaskItems(task, selected), kind };
    });

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

function isTextEditorCommand(command) {
  return command?.type === "set-report-field"
    || (command?.type === "set-task-field" && ["title", "summary"].includes(command.field))
    || (command?.type === "set-item-field" && command.property === "title");
}

// Editing happens in this document, in place — no iframe, no second load of
// the report. A local edit session opens both drafts a save can touch: the
// Editor Core session for the report, and the time-input draft for
// time.config.json/estimates.json, staged from whatever the session already
// carries as defaults.
async function startEditing() {
  if (!state.editor.available || state.editor.editing) return false;
  try {
    const hostSession = await state.editor.client.start();
    state.editor.timeDraft = createTimeInputDraft(hostSession.inputs, state.editor.scope, {
      configTemplate: hostSession.input_defaults?.config ?? null,
    });
    state.editor.externalDirty = false;
    state.editor.session = createReportEditorAdapter(state.persistedReport, {
      fallbackPriority: PRIORITY_POLICY.fallbackValue,
      timeDraft: state.editor.timeDraft,
      isExternalDirty: () => state.editor.externalDirty,
      onCommit: (saved) => {
        state.persistedReport = structuredClone(saved.report);
        state.editor.externalDirty = false;
        state.editor.timeDraftView = state.editor.timeDraft.snapshot();
        invalidateDeliveryPreview();
      },
      onDiscard: () => {
        state.editor.externalDirty = false;
        state.editor.timeDraftView = state.editor.timeDraft.snapshot();
        invalidateDeliveryPreview();
      },
    });
    state.editor.editing = true;
    state.editor.persistence = createPersistenceController({
      session: state.editor.session,
      save: saveReportDraft,
      confirmSave: confirmReportSave,
      debounceCommand: isTextEditorCommand,
      onChange: (next) => {
        syncPersistenceView(next);
        if (next.status === "saved") {
          rebuildMergedTasks();
          renderReport();
        }
      },
    });
    state.editor.timeDraftView = state.editor.timeDraft.snapshot();
    state.editor.timeSettingsPending = false;
    invalidateDeliveryPreview();
    syncPersistenceView(state.editor.persistence.snapshot());
    rebuildMergedTasks();
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
  if (state.editor.confirmationResolve) settleDeliveryConfirmation(false);
  if (state.editor.persistenceView?.mode === "auto") {
    await state.editor.persistence?.flush();
    if (state.editor.persistence?.snapshot().dirty) return false;
  }
  state.editor.persistence?.discard();
  state.editor.persistence = null;
  state.editor.persistenceView = null;
  state.editor.session = null;
  state.editor.timeDraft = null;
  state.editor.timeDraftView = null;
  state.editor.timeSettingsPending = false;
  invalidateDeliveryPreview();
  state.editor.externalDirty = false;
  state.editor.editing = false;
  state.moduleProjectionStale = false;
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
async function requestRiskPreview({ scheduleSave = false, report = null } = {}) {
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
  const prepared = report
    ? { report, errors: [] }
    : state.editor.session.prepareSave(new Date().toISOString());
  const reportToPreview = prepared.report;
  const errors = prepared.errors;
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
    if (scheduleSave) state.editor.persistence?.changed({ type: "set-time-settings" });
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

// The shared persistence controller calls this boundary before either an
// automatic or cautious save. Plain edits pass through; a delivery-date change
// waits on the same risk preview and explicit confirmation in both modes.
async function confirmReportSave(payload) {
  if (state.editor.timeSettingsPending) {
    updateSaveBar({ editing: true, saving: false, tone: "error", message: "時間設定仍有未套用內容；請先按重新計算預覽。" });
    return false;
  }
  const deliveryChange = state.editor.timeDraft?.deliveryChangePreview() ?? null;
  if (!deliveryChange) return true;
  const preview = state.editor.deliveryPreview
    ?? await requestRiskPreview({ report: payload.report });
  if (!preview) return false;
  if (preview.after.present && !preview.next.available) {
    updateSaveBar({ editing: true, saving: false, tone: "error", message: "交付日草稿尚無有效期限分析，不能進入儲存確認。" });
    return false;
  }
  state.editor.confirmingDeliverySave = true;
  renderDeliverySaveConfirmation();
  return new Promise((resolve) => {
    state.editor.confirmationResolve = resolve;
  });
}

async function saveReportDraft(payload) {
  return await state.editor.client.save(payload);
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
    // Fire-and-forget: pointer cards paint as "loading" on first render and
    // repaint themselves through `renderTasks()` once each target resolves,
    // independently of the rest of this report's own load.
    void loadPointerCards();

    /*
     * The one place discovery is selected — the composition root the
     * architecture plan requires, so the choice never spreads into
     * `if manifest` branches elsewhere. Exactly one adapter runs per load,
     * which is what keeps a single sidecar from being loaded or displayed
     * twice.
     *
     * Order matters and is not arbitrary:
     *   1. An explicit `?time=` query is a deliberate override by whoever
     *      opened the page, so it outranks both. `none` disables Time
     *      entirely (the migration-period alias for disabling this one
     *      module); any other value names a sidecar to load directly, which
     *      only the legacy path can honor.
     *   2. Otherwise a manifest, when present, is the only discovery source.
     *      `handled` says whether it claimed the decision — a manifest that
     *      exists but is broken, or that declares no Time, still claims it,
     *      because falling through to filename discovery would silently
     *      ignore a declaration the report author made on purpose.
     *   3. Only with no manifest at all does legacy filename discovery run.
     */
    const explicitTimeSource = params.get("time") ?? undefined;
    const fetchTimeJson = (url) => fetchOptionalJson(url, "time.analysis.json");
    let timeResult = null;

    if (explicitTimeSource === undefined) {
      const manifestResult = await loadManifestTimeAnalysis({
        report,
        reportSource: request.reportSource,
        baseUrl: document.baseURI,
        fetchJson: (url) => fetchOptionalJson(url, "report.modules.json"),
      });
      if (manifestResult.handled) timeResult = manifestResult;
    }

    if (!timeResult) {
      timeResult = await loadLegacyTimeAnalysis({
        reportSource: request.reportSource,
        baseUrl: document.baseURI,
        explicitTimeSource,
        scopeId: report.scope_id,
        fetchJson: fetchTimeJson,
      });
    }

    state.timeAnalysis = timeResult.timeAnalysis;
    state.diagnostics.push(...timeResult.diagnostics);

    /*
     * Cost is discovered by its filename beside report.json, not through the
     * manifest. Time carries both paths because it predates manifests; Cost
     * has only ever had one, and giving it a second before a report actually
     * declares it would be two discovery routes with one caller.
     */
    state.costAnalysis = await loadCostAnalysis(request.reportSource, report.scope_id);

    /*
     * Attach every module the registry has an implementation for. Dispose
     * first so a previous scope's instances never outlive their report — this
     * runs on every load, and a scope switch is just another load.
     *
     * Time's `host` is what stays owned here: the live controller snapshot
     * and the action that opens its dialog. The module turns those into a
     * capsule descriptor; it does not reach the DOM and does not own the
     * controller (see time-module-definition.js for why that has not moved).
     */
    disposeModules(state.attachedModules).forEach((diagnostic) => {
      console.warn(`[module] ${diagnostic.message}`);
    });
    const { attached, diagnostics: attachDiagnostics } = attachModules(moduleRegistry, [
      ...(state.costAnalysis ? [{
        type: COST_MODULE_TYPE,
        schemaVersion: state.costAnalysis.schema_version,
        data: state.costAnalysis,
        host: { onChanged: () => renderTimeReference() },
      }] : []),
      ...(state.timeAnalysis ? [{
        type: TIME_MODULE_TYPE,
        schemaVersion: state.timeAnalysis.schema_version,
        data: state.timeAnalysis,
        host: {
          // Two callbacks are the whole surface: one report-derived figure
          // the module cannot compute, and one "re-render, something I own
          // moved". Everything else is now the module's own business.
          getWorkProgressRatio: () => {
            const progress = calculateProjectProgress(state.tasks);
            return progress.total ? progress.completed / progress.total : 0;
          },
          onChanged: () => renderTimeReference(),
          // An unset marker is only worth offering when there is somewhere
          // to save the estimate it would create.
          canEditEstimates: () => Boolean(state.editor.timeDraft),
        },
      }] : []),
    ]);
    state.attachedModules = attached;
    // A module with clock- or event-driven behaviour opts into it here; the
    // matching stop is `disposeModules`, which runs before the next attach.
    attached.forEach((entry) => {
      try {
        entry.instance.start?.();
      } catch (error) {
        console.warn(`[module] ${entry.type} 啟動失敗：${error?.message ?? error}`);
      }
    });
    attachDiagnostics.forEach((diagnostic) => {
      state.diagnostics.push({ level: "warning", message: diagnostic.message });
    });

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
  cautious: false,
  editing: false,
  dirty: false,
  saving: false,
  canUndo: false,
  canRedo: false,
  onToggleCautious: (next) => {
    void state.editor.persistence?.setCautious(next);
  },
  onUndo: () => applyEditorHistory("undo"),
  onRedo: () => applyEditorHistory("redo"),
  onDiscard: () => {
    state.editor.persistence?.discard();
    state.editor.timeDraftView = state.editor.timeDraft?.snapshot() ?? null;
    rebuildMergedTasks();
    renderReport();
  },
  onSave: () => {
    void state.editor.persistence?.save();
  },
});
bindHistoryShortcuts(document, {
  isActive: () => state.editor.editing && !state.editor.persistenceView?.saving,
  onUndo: () => applyEditorHistory("undo"),
  onRedo: () => applyEditorHistory("redo"),
});
// The clock-driven refresh moved into the module's start()/dispose(): a
// module knows whether its own projection depends on the current time, and
// owning the timer there is what lets a scope switch actually stop it. This
// host's interval was created once at load and never cleared.
window.addEventListener("beforeunload", (event) => {
  if (!state.editor.persistenceView?.dirty) return;
  event.preventDefault();
  event.returnValue = "";
});
main();
