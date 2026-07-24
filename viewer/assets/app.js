import {
  STATUS_META,
  SUPPORTED_SCHEMA_VERSION,
  buildScopeHref,
  calculateProjectProgress,
  calculateTaskProgress,
  mergeReports,
  resolveDeveloperReportSource,
  resolveReportRequest,
  validateScopeCatalog,
  validateDeveloperReport,
  validateReport,
} from "./report-model.js";
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
  timeSummaryButton: document.querySelector("#time-summary-button"),
  timeDialog: document.querySelector("#time-dialog"),
  timeDialogClose: document.querySelector("#time-dialog-close"),
  timeDialogKicker: document.querySelector("#time-dialog-kicker"),
  timeDialogTitle: document.querySelector("#time-dialog-title"),
  timeDialogContent: document.querySelector("#time-dialog-content"),
};

const state = {
  report: null,
  tasks: [],
  filter: "all",
  diagnostics: [],
  developerAvailable: false,
  timeAnalysis: null,
  timeController: null,
  statusOrder: loadStatusOrder(statusOrderStorage, supportedStatuses),
};

let draggedStatus = null;
let suppressFilterClick = false;
let pointerDrag = null;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function appendList(parent, title, items, className = "", timeItems = false) {
  if (!Array.isArray(items) || items.length === 0) return;
  const section = el("section", `detail-section ${className}`.trim());
  section.append(el("h4", "detail-heading", title));
  const list = el("ul", "detail-list");
  items.forEach((item) => {
    const stableItem = item !== null && typeof item === "object" && !Array.isArray(item);
    const itemTitle = stableItem ? item.title : item;
    const row = el("li");
    if (timeItems) {
      row.classList.add("time-work-item");
      row.append(el("span", "time-work-title", itemTitle));
      if (stableItem) {
        const button = state.timeController?.createItemTimeButton(item.id, itemTitle);
        if (button) row.append(button);
      }
    } else {
      row.textContent = itemTitle;
    }
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
  const progress = calculateProjectProgress(state.tasks);
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
  const meta = STATUS_META[task.status];
  const progress = calculateTaskProgress(task);
  const card = el("article", `task-card status-${meta.tone}`);
  const header = el("header", "task-header");
  const titleGroup = el("div", "task-title-group");
  const statusLine = el("div", "time-task-status-line");
  const titleLine = el("div", "time-task-title-line");
  const headerMeta = el("div", "task-header-meta");
  const fraction = el("strong", "task-fraction", `${progress.completed} / ${progress.total}`);
  fraction.setAttribute(
    "aria-label",
    `子項目完成 ${progress.completed}，共 ${progress.total}`,
  );
  statusLine.append(el("span", `status-badge status-${meta.tone}`, meta.label));
  titleLine.append(el("h3", "", task.title));
  const duration = state.timeController?.taskDuration(task.id);
  if (duration) titleLine.append(el("span", "task-duration", `約需 ${duration}`));
  titleGroup.append(statusLine, titleLine);
  headerMeta.append(fraction, el("code", "task-id", task.id));
  header.append(titleGroup, headerMeta);
  card.append(header, el("p", "task-summary", task.summary));
  renderDeveloperDetails(task, card);

  if (task.completed_items?.length || task.pending_items?.length) {
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
      appendList(columns, group.title, group.items, group.className, true);
    });
    card.append(columns);
  }
  return card;
}

function renderTasks() {
  const orderedTasks = stableSortByStatus(state.tasks, state.statusOrder);
  const tasks = state.filter === "all"
    ? orderedTasks
    : orderedTasks.filter((task) => taskMatchesViewStatus(task, state.filter));
  elements.taskList.replaceChildren(...tasks.map(renderTask));
  elements.empty.hidden = tasks.length !== 0;
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
  renderDiagnostics();
  renderProjectProgress();
  renderOverview();
  renderFilters();
  renderTasks();
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
    renderReport();
  } catch (error) {
    showFatal(error instanceof Error ? error.message : "發生未知錯誤。");
  }
}

initializeThemeControls();
elements.timeDialogClose.addEventListener("click", () => elements.timeDialog.close());
elements.timeDialog.addEventListener("click", (event) => {
  if (event.target === elements.timeDialog) elements.timeDialog.close();
});
window.setInterval(() => state.timeController?.refresh(), 60_000);
window.addEventListener("pageshow", () => state.timeController?.refresh());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") state.timeController?.refresh();
});
main();
