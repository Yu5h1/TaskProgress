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
  stableSortTaskItemsByPriority,
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
  createAddControl,
  createItemRow,
  createModeController,
  createPrioritySelect,
  createSaveBar,
  createTaskCardShell,
} from "./editor-surface.js";
import { initializeThemeControls } from "./theme.js";
import {
  inspectTimeAnalysis,
  resolveTimeAnalysisSource,
} from "./time-model.js";
import { createTimeReferenceController } from "./time-view.js";
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
  projectProgressValue: document.querySelector("#project-progress-value"),
  projectProgressMeter: document.querySelector("#project-progress-meter"),
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
  viewModeToggle: document.querySelector("#view-mode-toggle"),
  viewerModeLabel: document.querySelector("#viewer-mode-label"),
  editSaveBar: document.querySelector("#edit-save-bar"),
  taskAddShell: document.querySelector("#task-add-shell"),
  timeSummaryButton: document.querySelector("#time-summary-button"),
  timeDialog: document.querySelector("#time-dialog"),
  timeDialogClose: document.querySelector("#time-dialog-close"),
  timeDialogKicker: document.querySelector("#time-dialog-kicker"),
  timeDialogTitle: document.querySelector("#time-dialog-title"),
  timeDialogContent: document.querySelector("#time-dialog-content"),
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
  },
};

let draggedStatus = null;
let suppressFilterClick = false;
let pointerDrag = null;
let viewModeControl = null;
let saveBarControl = null;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function prioritySelect(value, onChange, ariaLabel) {
  return createPrioritySelect(value, {
    className: "inline-priority-select",
    ariaLabel,
    onChange,
  });
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
  saveBarControl?.setState({
    editing: state.editor.editing,
    dirty: state.editor.dirty,
    saving: state.editor.saving,
    canUndo: Boolean(history?.canUndo),
    canRedo: Boolean(history?.canRedo),
    message: state.editor.dirty ? message : "尚未修改",
  });
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

function appendItemAdder(section, task, field) {
  const shell = el("div", "inline-add-shell");
  const render = (expanded = false) => createAddControl(shell, {
    kind: "item",
    expanded,
    triggerAriaLabel: "增加待處理子任務",
    defaultPriority: PRIORITY_POLICY.creationDefaultValue,
    onOpen: () => render(true),
    onCancel: () => renderTasks(),
    onSubmit: ({ title: draftTitle, priority }) => {
      const title = normalizeMeaningfulText(draftTitle);
      if (!title) {
        renderTasks();
        return;
      }
      const prefix = `item-${task.id}-${Date.now().toString(36)}`;
      const id = state.editor.session.createItemId(task.id, prefix);
      applyEditorCommand(
        {
          type: "add-item",
          taskId: task.id,
          field,
          item: {
            id,
            title,
            priority,
          },
        },
        "已新增子任務，尚未儲存",
        { render: true },
      );
    },
  });
  render();
  section.append(shell);
}

function appendList(
  parent,
  title,
  items,
  className = "",
  timeItems = false,
  editContext = null,
) {
  if ((!Array.isArray(items) || items.length === 0) && !editContext) return;
  const section = el("section", `detail-section ${className}`.trim());
  section.append(el("h4", "detail-heading", title));
  const list = el("ul", "detail-list");
  stableSortTaskItemsByPriority(items ?? []).forEach((item) => {
    const stableItem = item !== null && typeof item === "object" && !Array.isArray(item);
    const itemTitle = stableItem ? item.title : item;
    const timeButton = timeItems && stableItem
      ? state.timeController?.createItemTimeButton(item.id, itemTitle)
      : null;
    const { row } = createItemRow(item, {
      editing: Boolean(editContext),
      showPriority: timeItems,
      rowClass: editContext && stableItem ? "" : (timeItems ? "time-work-item" : ""),
      titleClass: timeItems ? "time-work-title" : "",
      contentNodes: timeButton ? [timeButton] : [],
      titleAriaLabel: "子任務描述",
      priorityAriaLabel: `${itemTitle} 優先級`,
      deleteAriaLabel: `刪除 ${itemTitle}`,
      onDelete: () => {
        applyEditorCommand(
          {
            type: "delete-item",
            taskId: editContext.taskId,
            field: editContext.field,
            itemId: item.id,
          },
          "已刪除子任務，尚未儲存",
          { render: true },
        );
      },
      onTitleInput: (value) => {
        applyEditorCommand({
          type: "set-item-field",
          taskId: editContext.taskId,
          field: editContext.field,
          itemId: item.id,
          property: "title",
          value,
        });
      },
      onTitleCommit: (draftValue) => {
        const value = normalizeMeaningfulText(draftValue);
        if (!value) {
          applyEditorCommand({
            type: "set-item-field",
            taskId: editContext.taskId,
            field: editContext.field,
            itemId: item.id,
            property: "title",
            value: itemTitle,
          });
          return itemTitle;
        }
        applyEditorCommand({
          type: "set-item-field",
          taskId: editContext.taskId,
          field: editContext.field,
          itemId: item.id,
          property: "title",
          value,
        });
        return value;
      },
      onPriorityChange: (priority) => {
        applyEditorCommand(
          {
            type: "set-item-field",
            taskId: editContext.taskId,
            field: editContext.field,
            itemId: item.id,
            property: "priority",
            value: priority,
          },
          "有尚未儲存的修改",
          { render: true },
        );
      },
    });
    list.append(row);
  });
  section.append(list);
  parent.append(section);
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
  elements.diagnostics.replaceChildren();
  elements.diagnostics.hidden = state.diagnostics.length === 0;
  state.diagnostics.forEach((diagnostic) => {
    const item = el("div", `diagnostic diagnostic-${diagnostic.level ?? "error"}`);
    item.append(el("strong", "", diagnostic.level === "warning" ? "注意" : "無法載入部分資料"));
    item.append(el("p", "", diagnostic.message));
    elements.diagnostics.append(item);
  });
}

function renderOverview() {
  const counts = Object.fromEntries(supportedStatuses.map((status) => [status, 0]));
  state.tasks.forEach((task) => { counts[task.status] += 1; });
  const cardMeta = {
    in_progress: { label: "目前進行", tone: "active" },
    done: { label: "已完成", tone: "success" },
    blocked: { label: "受阻", tone: "danger" },
    archive: { label: "已封存", tone: "muted" },
  };
  const cards = state.statusOrder
    .filter((status) => cardMeta[status])
    .map((status) => ({
      status,
      value: counts[status],
      ...cardMeta[status],
    }));
  elements.overview.replaceChildren();
  cards.forEach((card) => {
    const item = el("article", `overview-card overview-${card.tone}`);
    item.dataset.status = card.status;
    item.append(el("span", "overview-value", String(card.value)));
    item.append(el("span", "overview-label", card.label));
    elements.overview.append(item);
  });
}

function renderProjectProgress() {
  const progress = currentProjectProgress(state.tasks);
  elements.projectProgressValue.textContent = `整體約 ${progress.percentage}%`;
  elements.projectProgressMeter.value = progress.percentage;
  elements.projectProgressMeter.setAttribute(
    "aria-label",
    state.timeController?.deadlineAvailable
      ? `整體進度 ${progress.percentage}%，已完成 ${progress.completed}，共 ${progress.total} 個進度單位；時間已使用 ${Math.round(state.timeController.analysis.summary.deadline.time_progress_ratio * 100)}%`
      : `整體進度 ${progress.percentage}%，已完成 ${progress.completed}，共 ${progress.total} 個進度單位`,
  );
  elements.projectProgress.hidden = false;
}

function statusCounts() {
  const counts = { all: state.tasks.length };
  supportedStatuses.forEach((status) => {
    counts[status] = state.tasks.filter((task) => taskMatchesViewStatus(task, status)).length;
  });
  return counts;
}

function clearStatusDragIndicators() {
  elements.filters.querySelectorAll(".filter-button").forEach((button) => {
    button.classList.remove("status-dragging", "status-drop-before", "status-drop-after");
  });
}

function updateDropIndicator(button, clientX) {
  elements.filters.querySelectorAll(".filter-button").forEach((candidate) => {
    candidate.classList.remove("status-drop-before", "status-drop-after");
  });
  const bounds = button.getBoundingClientRect();
  const placeAfter = clientX >= bounds.left + bounds.width / 2;
  button.classList.add(placeAfter ? "status-drop-after" : "status-drop-before");
  return placeAfter;
}

function visibleStatusOrder() {
  const counts = statusCounts();
  return state.statusOrder.filter((status) => counts[status] > 0);
}

function applyStatusOrder(status, targetStatus, placeAfter = false, focusStatus = null) {
  const nextOrder = moveStatusOrder(state.statusOrder, status, targetStatus, placeAfter);
  if (nextOrder.every((candidate, index) => candidate === state.statusOrder[index])) return;
  state.statusOrder = nextOrder;
  saveStatusOrder(statusOrderStorage, state.statusOrder);
  renderOverview();
  renderFilters();
  renderTasks();
  if (focusStatus) {
    elements.filters.querySelector(`[data-filter="${focusStatus}"]`)?.focus();
  }
}

function moveVisibleStatusByOffset(status, offset) {
  const visible = visibleStatusOrder();
  const index = visible.indexOf(status);
  const targetIndex = index + offset;
  if (index < 0 || targetIndex < 0 || targetIndex >= visible.length) return;
  applyStatusOrder(status, visible[targetIndex], offset > 0, status);
}

function sortableButtonAtPoint(clientX, clientY) {
  const target = document.elementFromPoint(clientX, clientY);
  return target?.closest?.(".filter-button.status-sortable") ?? null;
}

function bindStatusOrdering(button) {
  const status = button.dataset.filter;
  button.addEventListener("dragstart", (event) => {
    draggedStatus = status;
    suppressFilterClick = true;
    button.classList.add("status-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", status);
  });
  button.addEventListener("dragover", (event) => {
    const targetStatus = button.dataset.filter;
    if (!draggedStatus || targetStatus === draggedStatus) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    updateDropIndicator(button, event.clientX);
  });
  button.addEventListener("dragleave", (event) => {
    if (!button.contains(event.relatedTarget)) {
      button.classList.remove("status-drop-before", "status-drop-after");
    }
  });
  button.addEventListener("drop", (event) => {
    if (!draggedStatus) return;
    event.preventDefault();
    const sourceStatus = draggedStatus;
    const placeAfter = updateDropIndicator(button, event.clientX);
    draggedStatus = null;
    clearStatusDragIndicators();
    applyStatusOrder(sourceStatus, status, placeAfter);
  });
  button.addEventListener("dragend", () => {
    draggedStatus = null;
    clearStatusDragIndicators();
    window.setTimeout(() => {
      suppressFilterClick = false;
    }, 0);
  });
  button.addEventListener("keydown", (event) => {
    if (!event.altKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    moveVisibleStatusByOffset(status, event.key === "ArrowLeft" ? -1 : 1);
  });
  button.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || event.button !== 0) return;
    pointerDrag = {
      pointerId: event.pointerId,
      status,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      targetStatus: null,
      placeAfter: false,
    };
    button.setPointerCapture?.(event.pointerId);
  });
  button.addEventListener("pointermove", (event) => {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - pointerDrag.startX;
    const deltaY = event.clientY - pointerDrag.startY;
    if (!pointerDrag.active) {
      if (Math.hypot(deltaX, deltaY) < 8) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      pointerDrag.active = true;
      suppressFilterClick = true;
      button.classList.add("status-dragging");
    }
    event.preventDefault();
    const targetButton = sortableButtonAtPoint(event.clientX, event.clientY);
    if (!targetButton || targetButton.dataset.filter === status) {
      pointerDrag.targetStatus = null;
      clearStatusDragIndicators();
      button.classList.add("status-dragging");
      return;
    }
    pointerDrag.targetStatus = targetButton.dataset.filter;
    pointerDrag.placeAfter = updateDropIndicator(targetButton, event.clientX);
    button.classList.add("status-dragging");
  });
  const finishPointerDrag = (event) => {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    const completedDrag = pointerDrag;
    pointerDrag = null;
    button.releasePointerCapture?.(event.pointerId);
    clearStatusDragIndicators();
    if (completedDrag.active && completedDrag.targetStatus) {
      applyStatusOrder(
        completedDrag.status,
        completedDrag.targetStatus,
        completedDrag.placeAfter,
      );
    }
    window.setTimeout(() => {
      suppressFilterClick = false;
    }, 0);
  };
  button.addEventListener("pointerup", finishPointerDrag);
  button.addEventListener("pointercancel", finishPointerDrag);
}

function renderFilters() {
  const counts = statusCounts();
  const filters = ["all", ...state.statusOrder];
  const visible = filters.filter((filter) => filter === "all" || counts[filter] > 0);
  elements.filters.replaceChildren();
  visible.forEach((filter) => {
    const label = filter === "all" ? "全部" : STATUS_META[filter].label;
    const button = el("button", "filter-button", `${label} ${counts[filter]}`);
    button.type = "button";
    button.dataset.filter = filter;
    button.setAttribute("aria-pressed", String(filter === state.filter));
    button.addEventListener("click", (event) => {
      if (suppressFilterClick) {
        event.preventDefault();
        suppressFilterClick = false;
        return;
      }
      state.filter = filter;
      renderFilters();
      renderTasks();
    });
    if (filter !== "all") {
      const orderPosition = visible.indexOf(filter);
      button.draggable = true;
      button.classList.add("status-sortable");
      button.title = filter === "planned"
        ? "點擊顯示待規劃或仍有待處理子項目的任務；拖曳可調整排序"
        : "拖曳調整卡片排序；Alt＋左右方向鍵也可移動";
      button.setAttribute("aria-keyshortcuts", "Alt+ArrowLeft Alt+ArrowRight");
      button.setAttribute(
        "aria-label",
        `${label} ${counts[filter]}，排序第 ${orderPosition}；可拖曳調整`,
      );
      bindStatusOrdering(button);
    }
    elements.filters.append(button);
  });
}

function renderDeveloperDetails(task, parent) {
  const developer = task.developer;
  if (!developer) return;
  const legacySteps = developer.next_steps ?? [];
  const nextAction = developer.next_step ?? legacySteps[0] ?? "尚未指定下一步";
  const followupSteps = developer.next_step ? legacySteps : legacySteps.slice(1);
  const hasDiscussion = Boolean(
    followupSteps.length
    || developer.blockers?.length
    || developer.decisions?.length
    || developer.routes?.length
    || developer.claim,
  );
  const details = el(hasDiscussion ? "details" : "section", "developer-details");
  const summary = el(hasDiscussion ? "summary" : "div", "developer-summary");
  summary.append(el("span", "developer-next-label", "Next Step :"));
  summary.append(el("span", "developer-next-action", nextAction));
  if (hasDiscussion) {
    summary.append(el("span", "developer-expand-hint", "展開作法與方向"));
  }
  details.append(summary);
  if (!hasDiscussion) {
    parent.append(details);
    return;
  }

  const body = el("div", "developer-body");
  body.append(el("h4", "developer-body-title", "作法與方向"));
  appendList(body, "後續動作", followupSteps, "next-steps");
  appendList(body, "Blockers", developer.blockers, "blockers");

  if (developer.decisions?.length) {
    const section = el("section", "detail-section");
    section.append(el("h4", "detail-heading", "Decisions"));
    const list = el("div", "decision-list");
    developer.decisions.forEach((decision) => {
      const item = el("article", "decision-item");
      item.append(el("p", "", decision.summary));
      if (decision.reference) item.append(el("code", "reference", decision.reference));
      list.append(item);
    });
    section.append(list);
    body.append(section);
  }

  if (developer.routes?.length) {
    const section = el("section", "detail-section");
    section.append(el("h4", "detail-heading", "Routes"));
    const list = el("div", "route-list");
    developer.routes.forEach((route) => {
      const item = el("article", "route-item");
      const heading = el("div", "route-heading");
      heading.append(el("strong", "", route.title));
      heading.append(el("span", `route-state route-${route.state}`, route.state));
      item.append(heading);
      if (route.reason) item.append(el("p", "", route.reason));
      list.append(item);
    });
    section.append(list);
    body.append(section);
  }

  if (developer.claim) {
    const section = el("section", "detail-section claim-section");
    section.append(el("h4", "detail-heading", "Claim"));
    section.append(el("p", "", `Agent: ${developer.claim.agent}`));
    if (developer.claim.worktree) section.append(el("p", "", `Worktree: ${developer.claim.worktree}`));
    if (developer.claim.source_paths?.length) {
      const paths = el("div", "path-list");
      developer.claim.source_paths.forEach((path) => paths.append(el("code", "reference", path)));
      section.append(paths);
    }
    body.append(section);
  }

  details.append(body);
  parent.append(details);
}

function renderTask(task) {
  const editableTask = state.editor.editing
    ? state.editor.session?.task(task.id) ?? task
    : task;
  const progress = currentTaskProgress(task);
  const shell = createTaskCardShell(task, {
    completed: progress.completed,
    total: progress.total,
    showPriority: !state.editor.editing,
  });
  const { card, statusLine, titleLine, headerMeta } = shell;
  if (state.editor.editing) {
    const remove = el("button", "inline-delete-button task-delete-button", "刪除");
    remove.type = "button";
    remove.setAttribute("aria-label", `刪除任務 ${task.title}`);
    remove.addEventListener("click", () => {
      applyEditorCommand(
        { type: "delete-task", taskId: task.id },
        "已刪除任務，尚未儲存",
        { render: true },
      );
    });
    headerMeta.prepend(remove);
  }
  if (state.editor.editing) {
    const statusSelect = el("select", "inline-status-select");
    statusSelect.setAttribute("aria-label", `${task.title} 狀態`);
    Object.entries(STATUS_META).forEach(([status, statusMeta]) => {
      const option = el("option", "", statusMeta.label);
      option.value = status;
      option.selected = status === task.status;
      statusSelect.append(option);
    });
    statusSelect.addEventListener("change", () => {
      applyEditorCommand(
        {
          type: "set-task-field",
          taskId: task.id,
          field: "status",
          value: statusSelect.value,
        },
        "有尚未儲存的修改",
        { render: true },
      );
    });
    statusLine.append(
      statusSelect,
      prioritySelect(
        editableTask.priority,
        (priority) => {
          applyEditorCommand(
            {
              type: "set-task-field",
              taskId: task.id,
              field: "priority",
              value: priority,
            },
            "有尚未儲存的修改",
            { render: true },
          );
        },
        `${task.title} 優先級`,
      ),
    );
    const titleInput = el("input", "task-title-input");
    titleInput.type = "text";
    titleInput.maxLength = 160;
    titleInput.value = task.title;
    titleInput.setAttribute("aria-label", "任務名稱");
    titleInput.addEventListener("input", () => {
      applyEditorCommand({
        type: "set-task-field",
        taskId: task.id,
        field: "title",
        value: titleInput.value,
      });
    });
    titleInput.addEventListener("change", () => {
      const value = normalizeMeaningfulText(titleInput.value);
      if (!value) {
        applyEditorCommand({
          type: "set-task-field",
          taskId: task.id,
          field: "title",
          value: task.title,
        });
        titleInput.value = task.title;
        return;
      }
      applyEditorCommand({
        type: "set-task-field",
        taskId: task.id,
        field: "title",
        value,
      });
      titleInput.value = value;
    });
    shell.title.replaceWith(titleInput);
  }
  const duration = state.timeController?.taskDuration(task.id);
  if (duration) {
    shell.duration.textContent = `約需 ${duration}`;
    shell.duration.hidden = false;
  }
  if (state.editor.editing) {
    const summary = el("textarea", "task-summary task-summary-input");
    summary.maxLength = 1000;
    summary.rows = 3;
    summary.value = editableTask.summary;
    summary.setAttribute("aria-label", `${task.title} 任務描述`);
    summary.addEventListener("input", () => {
      applyEditorCommand({
        type: "set-task-field",
        taskId: task.id,
        field: "summary",
        value: summary.value,
      });
    });
    summary.addEventListener("change", () => {
      const value = normalizeMeaningfulText(summary.value);
      if (!value) {
        applyEditorCommand({
          type: "set-task-field",
          taskId: task.id,
          field: "summary",
          value: task.summary,
        });
        summary.value = task.summary;
        return;
      }
      applyEditorCommand({
        type: "set-task-field",
        taskId: task.id,
        field: "summary",
        value,
      });
      summary.value = value;
    });
    shell.summary.replaceWith(summary);
  }
  renderDeveloperDetails(task, card);

  if (
    state.editor.editing
    || task.completed_items?.length
    || task.pending_items?.length
  ) {
    const columns = el("div", "work-columns");
    const workGroups = [
      {
        status: "done",
        title: "已完成",
        items: task.completed_items,
        className: "completed-work",
      },
      {
        status: "planned",
        title: "待處理",
        items: task.pending_items,
        className: "pending-work",
      },
    ];
    stableSortByStatus(workGroups, state.statusOrder).forEach((group) => {
      appendList(
        columns,
        group.title,
        group.items,
        group.className,
        true,
        state.editor.editing
          ? {
              taskId: editableTask.id,
              field: group.status === "done" ? "completed_items" : "pending_items",
            }
          : null,
      );
    });
    if (state.editor.editing) {
      appendItemAdder(columns, editableTask, "pending_items");
    }
    card.append(columns);
  }
  return card;
}

function rebuildMergedTasks() {
  const merged = mergeReports(state.report, state.developerReport);
  state.tasks = merged.tasks;
  state.developerAvailable = merged.developerAvailable;
}

function renderTaskAdder() {
  elements.taskAddShell.replaceChildren();
  elements.taskAddShell.hidden = !state.editor.editing;
  if (!state.editor.editing) return;
  const render = (expanded = false) => createAddControl(elements.taskAddShell, {
    kind: "task",
    expanded,
    triggerAriaLabel: "增加工作項目",
    defaultPriority: PRIORITY_POLICY.creationDefaultValue,
    contractText: "預設狀態：待處理；預設優先級：一般；ID 會獨立產生",
    onOpen: () => render(true),
    onCancel: () => renderTaskAdder(),
    onSubmit: ({ title, summary, priority }, control) => {
      const taskTitle = normalizeMeaningfulText(title);
      const taskSummary = normalizeMeaningfulText(summary);
      if (!taskTitle || !taskSummary) {
        if (!String(title).trim() && !String(summary).trim()) {
          renderTaskAdder();
          return;
        }
        control.showError(!taskTitle ? "請填寫有效的任務名稱。" : "請填寫有效的任務描述。");
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
  });
  render();
}

function renderTasks() {
  const orderedTasks = stableSortByStatus(
    stableSortTasksByPriority(state.tasks),
    state.statusOrder,
  );
  const tasks = state.filter === "all"
    ? orderedTasks
    : orderedTasks.filter((task) => taskMatchesViewStatus(task, state.filter));
  elements.taskList.replaceChildren(...tasks.map(renderTask));
  elements.empty.hidden = tasks.length !== 0;
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
  elements.viewerModeLabel.textContent = state.editor.editing
    ? "Local edit session"
    : "Viewer is read-only";
  viewModeControl?.setMode(state.editor.editing ? "edit" : "preview");
  renderDiagnostics();
  renderProjectProgress();
  renderOverview();
  renderFilters();
  renderTasks();
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
    viewModeControl?.setAvailable(true);
  } catch {
    // Public/static hosting intentionally has no editor capability.
  }
}

async function startEditing() {
  if (!state.editor.available || state.editor.editing) return false;
  if (state.editor.surfaceUrl) {
    const editorUrl = new URL(state.editor.surfaceUrl);
    editorUrl.search = window.location.search;
    editorUrl.searchParams.set("scope", state.editor.scope);
    window.location.assign(editorUrl.href);
    return false;
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
  saveBarControl?.setState({ editing: false, dirty: false, saving: false });
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
    saveBarControl?.showError(errors[0].message);
    return;
  }
  state.editor.saving = true;
  viewModeControl?.setBusy(true);
  saveBarControl?.setState({
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
    saveBarControl?.setState({
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
    saveBarControl?.showError(error instanceof Error
      ? error.message
      : "儲存失敗；原始檔案未變更。");
  } finally {
    state.editor.saving = false;
    viewModeControl?.setBusy(false);
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

function renderScopeDirectory(scopes) {
  elements.scopeDirectory.replaceChildren();
  for (const scope of scopes) {
    const card = el("article", "scope-entry");
    const reportLink = el("a", "scope-link", scope.id);
    reportLink.href = buildScopeHref(scope.id);
    card.append(reportLink);
    if (scope.hasDeveloperReport) {
      const baseOnlyLink = el("a", "scope-developer-link", "基本報告");
      baseOnlyLink.href = buildScopeHref(scope.id, "none");
      card.append(baseOnlyLink);
    }
    elements.scopeDirectory.append(card);
  }
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
          summaryButton: elements.timeSummaryButton,
          dialog: elements.timeDialog,
          dialogKicker: elements.timeDialogKicker,
          dialogTitle: elements.timeDialogTitle,
          dialogContent: elements.timeDialogContent,
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

initializeThemeControls();
viewModeControl = createModeController(elements.viewModeToggle, {
  available: false,
  hideWhenUnavailable: true,
  onRequest: (mode) => (mode === "edit" ? startEditing() : cancelEditing()),
});
saveBarControl = createSaveBar(elements.editSaveBar, {
  statusId: "edit-save-status",
  buttonId: "edit-save-button",
  onUndo: () => applyEditorHistory("undo"),
  onRedo: () => applyEditorHistory("redo"),
  onSave: saveEditing,
});
bindHistoryShortcuts(document, {
  isActive: () => state.editor.editing && !state.editor.saving,
  onUndo: () => applyEditorHistory("undo"),
  onRedo: () => applyEditorHistory("redo"),
});
elements.timeDialogClose.addEventListener("click", () => elements.timeDialog.close());
elements.timeDialog.addEventListener("click", (event) => {
  if (event.target === elements.timeDialog) elements.timeDialog.close();
});
window.setInterval(() => state.timeController?.refresh(), 60_000);
window.addEventListener("pageshow", () => state.timeController?.refresh());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") state.timeController?.refresh();
});
window.addEventListener("beforeunload", (event) => {
  if (!state.editor.dirty) return;
  event.preventDefault();
  event.returnValue = "";
});
main();
