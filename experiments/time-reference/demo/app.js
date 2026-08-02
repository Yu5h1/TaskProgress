const DATA_URL = "../examples/time.analysis.json";

const FALLBACK_ANALYSIS = {
  as_of: "2026-07-22T17:00:00+08:00",
  method: {
    name: "deterministic-capacity-feasibility",
    version: "0.3",
  },
  summary: {
    executor_count: 1,
    nominal_daily_capacity_minutes: 480,
    execution_calibration: {
      factor: 1,
      effective_sample_count: 0,
    },
    total_estimated_minutes: 2640,
    remaining_estimated_minutes: 2112,
    display_total_days: 6,
    estimate_composition: {
      ai_minutes: 0,
      mixed_minutes: 1800,
      default_minutes: 480,
      manual_minutes: 360,
    },
    deadline: {
      started_at: "2026-07-20T09:00:00+08:00",
      delivery_at: "2026-08-01T00:00:00+08:00",
      evaluated_at: "2026-07-22T17:00:00+08:00",
      schedule: {
        timezone: "Asia/Taipei",
        workday_start_local: "09:00",
        workday_end_local: "17:00",
        risk_thresholds: {
          on_track_max: 1.1,
          at_risk_max: 1.5,
          capacity_at_risk_ratio: 0.8,
        },
        capacity_profile: {
          total_minutes_per_day: 1440,
          sleep_minutes_per_day: 480,
          life_minutes_per_day: 480,
          other_unavailable_minutes_per_day: 0,
          capacity_minutes_per_executor_day: 480,
          working_weekdays: [1, 2, 3, 4, 5],
          capacity_exceptions: [
            {
              date: "2026-07-29",
              available_minutes: 0,
              public_label: "休假",
            },
          ],
        },
        capacity_timeline: [
          "2026-07-20",
          "2026-07-21",
          "2026-07-22",
          "2026-07-23",
          "2026-07-24",
          "2026-07-27",
          "2026-07-28",
          "2026-07-29",
          "2026-07-30",
          "2026-07-31",
        ].map((date) => ({
          date,
          capacity_minutes: date === "2026-07-29" ? 0 : 480,
        })),
      },
      elapsed_capacity_minutes: 1440,
      total_capacity_minutes: 4320,
      remaining_capacity_minutes: 2880,
      remaining_estimated_minutes: 2112,
      capacity_balance_minutes: 768,
      feasibility_ratio: 0.733333,
      time_progress_ratio: 0.3333,
      work_progress_ratio: 0.2,
      progress_pressure_ratio: 1.2,
      boundary_state: "active",
      urgency: "at_risk",
      risk_basis: "progress_pressure",
    },
  },
  tasks: [
    {
      task_id: "time-reference-prototype",
      display_days: 6,
      items: [
        {
          estimate_id: "estimate-draft-schemas-v1",
          item_id: "define-draft-schemas",
          low_minutes: 240,
          likely_minutes: 360,
          high_minutes: 720,
          display_hours: 6,
          mode: "manual",
          contributors: [
            {
              kind: "human_estimate",
              summary: "人工依工程計畫直接估算工時。",
            },
          ],
          human_confirmed: true,
          inputs: [
            {
              name: "likely_hours",
              value: 6,
              unit: "hr",
              origin: "human",
              note: "人工直接輸入最可能工時。",
            },
          ],
          confidence: "medium",
          explanation: "人工依照原型計畫，估算建立四份旁掛資料契約與相互一致範例所需工時，並另行確認最後結果。",
          human_note: "依目前四份 Schema、範例與驗證範圍，人工估算約需 6 小時。",
          calculation: {
            algorithm_id: "direct-human-estimate",
            formula: "likely_hours * 60",
            version: "0.1",
            explanation: "6 hr × 60 = 360 min。",
          },
          reference: "plan.md#時間參考擴充計畫",
        },
        {
          estimate_id: "estimate-unknown-route-v2",
          supersedes_estimate_id: "estimate-unknown-route-v1",
          item_id: "evaluate-unknown-route",
          low_minutes: 960,
          likely_minutes: 1800,
          high_minutes: 3600,
          display_hours: 30,
          mode: "mixed",
          contributors: [
            {
              kind: "human_parameter",
              summary: "人工提供基礎實作工時與需要探索的路線數量。",
            },
            {
              kind: "ai_analysis",
              summary: "AI 判斷採用工程拆解方法並解釋探索成本。",
            },
            {
              kind: "deterministic_formula",
              summary: "固定公式依輸入參數計算最後工時。",
            },
          ],
          human_confirmed: false,
          inputs: [
            {
              name: "base_implementation_hours",
              value: 18,
              unit: "hr",
              origin: "human",
              note: "人工依已知工程範圍提供。",
            },
            {
              name: "exploration_routes",
              value: 3,
              unit: "route",
              origin: "human",
              note: "人工確認目前有三條候選技術路線需要驗證。",
            },
          ],
          analysis_method: {
            name: "engineering-decomposition",
            version: "0.2",
            performed_by: "ai",
            explanation: "AI 將人工參數映射為基礎實作與每條未知路線的探索成本。",
          },
          calculation: {
            algorithm_id: "engineering-decomposition",
            formula: "base_implementation_hours + exploration_routes * 4",
            version: "0.1",
            explanation: "18 hr + 3 × 4 hr = 30 hr。",
          },
          confidence: "low",
          explanation: "人工提供工程參數，AI 選擇拆解方法，再由固定公式計算基礎實作與三條探索路線的總工時；最後結果尚未人工確認。",
          human_note: "基礎實作先抓 18 小時，目前有三條候選技術路線需要驗證。",
        },
        {
          estimate_id: "estimate-document-fallback-v1",
          item_id: "document-fallback",
          likely_minutes: 480,
          display_hours: 8,
          mode: "default",
          contributors: [
            {
              kind: "system_default",
              summary: "沒有足夠工程資料，採用設定檔的一個標準工作日。",
            },
            {
              kind: "deterministic_formula",
              summary: "固定公式將預設小時換算為分鐘。",
            },
          ],
          human_confirmed: false,
          inputs: [
            {
              name: "default_item_hours",
              value: 8,
              unit: "hr",
              origin: "default",
            },
          ],
          calculation: {
            algorithm_id: "default-workday",
            formula: "default_item_hours * 60",
            version: "0.1",
            explanation: "8 hr × 60 = 480 min。",
          },
          confidence: "low",
          explanation: "尚無工程計畫，套用預設一日；未虛構低值與高值。",
        },
      ],
    },
  ],
};

const DEADLINE_DECOUPLING_ESTIMATE = {
  estimate_id: "estimate-deadline-decoupling-demo-v1",
  item_id: "decouple-estimates-from-deadline",
  low_minutes: 480,
  likely_minutes: 720,
  high_minutes: 1440,
  display_hours: 12,
  mode: "ai",
  contributors: [
    {
      kind: "ai_analysis",
      summary: "AI 依 capability 邊界拆解 estimate-only 與 deadline runtime。",
    },
    {
      kind: "deterministic_formula",
      summary: "固定加總模型將驗證、介面與回歸測試工作量合併。",
    },
  ],
  human_confirmed: false,
  inputs: [
    {
      name: "implementation_hours",
      value: 8,
      unit: "hr",
      origin: "ai",
      note: "Demo 資料政策、交付日未定摘要與工程估算面板。",
    },
    {
      name: "verification_hours",
      value: 4,
      unit: "hr",
      origin: "ai",
      note: "完整期限、無期限與無 sidecar 的回歸驗證。",
    },
  ],
  analysis_method: {
    name: "capability-decomposition",
    version: "0.1",
    performed_by: "ai",
    explanation: "將工程估算核心、期限能力與容量能力拆成可獨立顯示的介面路徑。",
  },
  calculation: {
    algorithm_id: "demo-capability-decomposition",
    formula: "implementation_hours + verification_hours",
    version: "0.1",
    explanation: "8 hr + 4 hr = 12 hr。",
  },
  confidence: "medium",
  explanation: "依既有解耦計畫完成 Demo 所需的資料驗證、無期限摘要、工程估算細節與完整期限回歸測試；正式 Viewer 尚未納入。",
  reference: "Documentation/TimeEstimateDeadlineDecouplingPlan.md",
};

const labels = {
  "define-draft-schemas": "定義 Draft Schemas",
  "evaluate-unknown-route": "驗證未知技術路線",
  "document-fallback": "整理原型說明",
  "decouple-estimates-from-deadline": "工時估算與截止日解耦",
};
const BASE_TASK_ITEMS = [
  {
    id: "define-draft-schemas",
    title: labels["define-draft-schemas"],
    status: "active",
    priority: 0,
  },
  {
    id: "evaluate-unknown-route",
    title: labels["evaluate-unknown-route"],
    status: "blocked",
    priority: 0,
  },
  {
    id: "document-fallback",
    title: labels["document-fallback"],
    status: "pending",
    priority: 2,
  },
  {
    id: "decouple-estimates-from-deadline",
    title: labels["decouple-estimates-from-deadline"],
    status: "pending",
    priority: 1,
  },
];

const contributorMeta = {
  human_estimate: { label: "人工估算", className: "source-manual", surface: true },
  human_parameter: { label: "人工參數", className: "source-manual", surface: true },
  ai_analysis: { label: "AI 分析", className: "source-ai", surface: true },
  historical_evidence: { label: "歷史資料", className: "source-history", surface: true },
  system_default: { label: "預設", className: "source-default", surface: true },
  deterministic_formula: { label: "固定公式", className: "source-formula", surface: false },
};

const inputOriginMeta = {
  human: "人工",
  ai: "AI",
  historical: "歷史資料",
  default: "系統預設",
};

const performerMeta = {
  ai: "AI",
  human: "人工",
  system: "系統",
};

const inputLabelMeta = {
  likely_hours: "最可能工時",
  base_implementation_hours: "基礎實作工時",
  exploration_routes: "探索路線數",
  default_item_hours: "預設項目工時",
};

const DEMO_OVERRIDES_KEY = "taskprogress.time-reference-demo.overrides.v1";
const DEMO_STATUS_ORDER_KEY = "taskprogress.time-reference-demo.status-order.v1";
const TASK_CONTENT_REVISION = 5;
const editingPolicy = globalThis.TimeEditingPolicy;
const taskEditingModel = globalThis.TimeTaskEditingModel;
const priorityPolicy = globalThis.TaskProgressPriorityPolicy;
const editorCoreRuntime = globalThis.TaskProgressEditorCoreRuntime;
const editorSurfaceRuntime = globalThis.TaskProgressEditorSurfaceRuntime;
const timeDataPolicy = globalThis.TimeDataPolicy;
const estimateEngine = globalThis.TimeEstimateEngine;
const capacityEngine = globalThis.TimeCapacityEngine;
const deadlineEngine = globalThis.TimeDeadlineEngine;
if (!editingPolicy) throw new Error("編輯環境政策未載入。");
if (!taskEditingModel) throw new Error("任務編輯模型未載入。");
if (!priorityPolicy) throw new Error("優先級設定未載入。");
if (!editorCoreRuntime) throw new Error("Editor Core runtime 未載入。");
if (!editorSurfaceRuntime) throw new Error("Editor Surface runtime 未載入。");
if (!timeDataPolicy) throw new Error("時間資料政策未載入。");
if (!estimateEngine) throw new Error("估算算法引擎未載入。");
if (!capacityEngine) throw new Error("工作容量引擎未載入。");
if (!deadlineEngine) throw new Error("期限風險引擎未載入。");
const localEditingAllowed = editingPolicy.canEditFromLocation(window.location);
const BASE_REPORT_UPDATED_AT = "2026-07-21T23:44:00+08:00";
const DEFAULT_STATUS_ORDER = ["planned", "in_progress", "done", "blocked", "archive"];
const DEFAULT_PRIORITY = priorityPolicy.fallbackValue;
const CREATION_PRIORITY = priorityPolicy.creationDefaultValue;
const taskStatusMeta = {
  planned: { label: "待處理", cardClass: "", dotClass: "state-muted" },
  in_progress: { label: "進行中", cardClass: "status-active", dotClass: "state-active" },
  done: { label: "已完成", cardClass: "status-success", dotClass: "state-success" },
  blocked: { label: "受阻", cardClass: "status-danger", dotClass: "state-danger" },
  archive: { label: "已封存", cardClass: "", dotClass: "state-muted" },
};
// Shared Editor Surface. The Demo keeps its own dot presentation and neutral
// card borders through the presentation adapter; structure, ordering, and
// accessibility text now come from the same module as the production Viewer.
const editorSurface = editorSurfaceRuntime.createEditorSurface({
  document,
  priorityPolicy,
  statusMeta: Object.fromEntries(
    Object.entries(taskStatusMeta).map(([status, meta]) => [
      status,
      { label: meta.label, tone: meta.dotClass.replace("state-", "") },
    ]),
  ),
  presentation: {
    headerClass: "task-header time-task-header",
    titleGroupClass: "time-task-copy",
    statusStyle: "dot",
    priorityOptionMarker: "● ",
    priorityOptionTone: true,
    cardStatusClass: (status, meta) => (
      ["active", "success", "danger"].includes(meta?.tone) ? `status-${meta.tone}` : ""
    ),
    itemRowClass: "time-work-item",
    itemEditingClass: "",
    itemCopyClass: "time-work-copy",
    itemTitleClass: "time-work-title",
    itemInputClass: "task-item-title-input",
    itemDeleteClass: "task-item-delete",
    itemPrioritySelectClass: "task-item-priority-select",
    itemEditOrder: ["title", "delete", "priority", "content", "trailing"],
    itemPreviewWrap: true,
  },
});
const filterStatusLabels = {
  planned: "待處理",
  in_progress: "進行中",
  done: "已完成",
  blocked: "受阻",
  archive: "已封存",
};
const itemStatusGroup = {
  active: "in_progress",
  pending: "planned",
  done: "done",
  success: "done",
  blocked: "blocked",
  danger: "blocked",
  archive: "archive",
  muted: "archive",
};
const itemStatusWithinGroup = {
  active: 0,
  pending: 1,
  done: 0,
  success: 0,
  blocked: 0,
  danger: 0,
  archive: 0,
  muted: 0,
};
const itemStatusMeta = {
  active: { label: "進行中", className: "active" },
  pending: { label: "待處理", className: "pending" },
  done: { label: "已完成", className: "success" },
  success: { label: "已完成", className: "success" },
  blocked: { label: "受阻", className: "danger" },
  danger: { label: "受阻", className: "danger" },
  archive: { label: "已封存", className: "muted" },
  muted: { label: "已封存", className: "muted" },
};

const confidenceMeta = {
  low: "低信心",
  medium: "中等信心",
  high: "高信心",
};

const urgencyMeta = {
  on_track: { label: "交付可行", lampLabel: "綠色燈號", className: "on-track" },
  at_risk: { label: "交付有風險", lampLabel: "黃色燈號", className: "at-risk" },
  critical: { label: "交付不可行", lampLabel: "紅色燈號", className: "critical" },
  complete: { label: "已完成", lampLabel: "完成燈號", className: "on-track" },
};

const elements = {
  timeButton: document.querySelector("#time-summary-button"),
  timeText: document.querySelector("#time-summary-text"),
  progressValue: document.querySelector("#project-progress-value"),
  progressMeter: document.querySelector("#project-progress-meter"),
  globalEditSave: document.querySelector("#global-edit-save"),
  globalEditSaveButton: document.querySelector("#global-edit-save-button"),
  updatedAt: document.querySelector("#updated-at"),
  analysisMethodMeta: document.querySelector("#analysis-method-meta"),
  analysisMethod: document.querySelector("#analysis-method"),
  taskCard: document.querySelector("#task-card"),
  taskTotal: document.querySelector("#task-total"),
  taskDuration: document.querySelector("#task-duration"),
  taskDurations: [...document.querySelectorAll(".task-duration")],
  workList: document.querySelector("#work-list"),
  overviewGrid: document.querySelector(".overview-grid"),
  overviewCards: [...document.querySelectorAll(".overview-grid [data-status]")],
  statusFilters: document.querySelector("#status-filters"),
  filterButtons: [...document.querySelectorAll("#status-filters [data-filter]")],
  taskList: document.querySelector("#task-list"),
  taskCards: [...document.querySelectorAll("#task-list [data-status]")],
  taskCardAddHost: document.querySelector("#task-card-add-host"),
  heroSummary: document.querySelector(".hero-summary"),
  timeScenarioSelect: document.querySelector("#time-scenario-select"),
  viewModeSelect: document.querySelector("#view-mode-select"),
  themeSelect: document.querySelector("#theme-select"),
  dialog: document.querySelector("#detail-dialog"),
  dialogKicker: document.querySelector("#dialog-kicker"),
  dialogTitle: document.querySelector("#dialog-title"),
  dialogContent: document.querySelector("#dialog-content"),
};

let analysis;
let loadedAnalysisSource = null;
let timeScenario = "undated";
let deadlineDiagnostic = null;
let timeDetailsExpanded = false;
let projectDetailTab = "flow";
let capacityEditorOpen = false;
let viewMode = "preview";
let statusOrder = loadStatusOrderPreference();
let draggedStatus = null;
let suppressFilterClick = false;
let activeTaskFilter = "all";
const primaryTaskId = elements.taskCard.dataset.taskId;
let taskItems = BASE_TASK_ITEMS.map((item) => ({ ...item }));
let persistedTaskItems = BASE_TASK_ITEMS.map((item) => ({ ...item }));
let auxiliaryTaskItems = Object.fromEntries(
  elements.taskCards
    .filter((card) => card.dataset.taskId !== primaryTaskId)
    .map((card) => [card.dataset.taskId, []]),
);
let persistedAuxiliaryTaskItems = cloneValue(auxiliaryTaskItems);
let taskContentDirty = false;
let taskStructureChanged = false;
let demoEditorSession = null;
let addingTaskId = null;
let addingTopLevelTask = false;
let lastDeletedTaskItem = null;
const baseTaskDefinitions = elements.taskCards.map((card) => ({
  id: card.dataset.taskId,
  title: card.querySelector("h3")?.textContent.trim() ?? card.dataset.taskId,
  summary: card.querySelector(".task-summary")?.textContent.trim() ?? "",
  status: card.dataset.status,
  priority: taskEditingModel.normalizePriority(card.dataset.priority, DEFAULT_PRIORITY),
  baseCompleted: Number(card.dataset.baseCompleted ?? 0),
  baseTotal: Number(card.dataset.baseTotal ?? 0),
}));
let taskDefinitions = cloneValue(baseTaskDefinitions);
let persistedTaskDefinitions = cloneValue(baseTaskDefinitions);
const baseTaskSummaries = Object.fromEntries(
  elements.taskCards.map((card) => [
    card.dataset.taskId,
    card.querySelector(".task-summary")?.textContent.trim() ?? "",
  ]),
);
let taskSummaries = { ...baseTaskSummaries };
let persistedTaskSummaries = { ...baseTaskSummaries };
const estimateDrafts = new Map();
let capacityDraft = null;
let timeInputDirty = false;
let timeDraftError = null;

const weekdayLabels = new Map([
  [1, "一"],
  [2, "二"],
  [3, "三"],
  [4, "四"],
  [5, "五"],
  [6, "六"],
  [7, "日"],
]);

function roundHours(value) {
  return Math.round(value * 10) / 10;
}

function nextEstimateId(value) {
  const match = /^(.*)-v(\d+)$/.exec(value);
  return match ? `${match[1]}-v${Number(match[2]) + 1}` : `${value}-v2`;
}

function calculateEstimate(item) {
  const algorithmId = item.calculation?.algorithm_id;
  const inputValues = Object.fromEntries(
    item.inputs.map((input) => [input.name, Number(input.value)]),
  );
  return estimateEngine.calculate(algorithmId, inputValues, item.human_note);
}

function applyEstimateResult(item, result, { createVersion = true } = {}) {
  if (createVersion) {
    const previousEstimateId = item.estimate_id;
    item.estimate_id = nextEstimateId(previousEstimateId);
    item.supersedes_estimate_id = previousEstimateId;
  }
  item.likely_minutes = Math.round(result.likelyHours * 60);
  item.display_hours = roundHours(result.likelyHours);
  if (result.lowHours && result.highHours) {
    item.low_minutes = Math.round(result.lowHours * 60);
    item.high_minutes = Math.round(result.highHours * 60);
  } else {
    delete item.low_minutes;
    delete item.high_minutes;
  }
  item.calculation.explanation = result.explanation;
  item.explanation = result.rationale;
  item.human_confirmed = false;
}

function recomputeDerivedTotals(data) {
  const composition = {
    ai_minutes: 0,
    mixed_minutes: 0,
    manual_minutes: 0,
    default_minutes: 0,
  };
  let totalMinutes = 0;
  data.tasks.forEach((task) => {
    task.total_likely_minutes = task.items.reduce((total, item) => total + item.likely_minutes, 0);
    task.estimated_days = task.total_likely_minutes / data.summary.nominal_daily_capacity_minutes;
    task.display_days = Math.ceil(task.estimated_days);
    totalMinutes += task.total_likely_minutes;
    task.items.forEach((item) => {
      const key = `${item.mode}_minutes`;
      if (key in composition) composition[key] += item.likely_minutes;
    });
  });
  const factor = data.summary.execution_calibration.factor;
  data.summary.total_estimated_minutes = totalMinutes;
  data.summary.calibrated_total_minutes = totalMinutes / factor;
  data.summary.estimated_total_days =
    data.summary.calibrated_total_minutes / data.summary.nominal_daily_capacity_minutes;
  data.summary.display_total_days = Math.ceil(data.summary.estimated_total_days);
  data.summary.estimate_composition = composition;
}

function recomputeAnalysis(data, changedInput = "estimates") {
  recomputeDerivedTotals(data);
  data.as_of = new Date().toISOString();
  if (data.inputs) data.inputs[`${changedInput}_updated_at`] = data.as_of;
}

function ensureDeadlineDecouplingEstimate(data) {
  const task = data.tasks?.[0];
  if (!task || task.items.some(
    (item) => item.item_id === DEADLINE_DECOUPLING_ESTIMATE.item_id,
  )) {
    return data;
  }
  task.items.push(cloneValue(DEADLINE_DECOUPLING_ESTIMATE));
  recomputeDerivedTotals(data);
  return data;
}

function prepareDemoAnalysis(source) {
  const data = ensureDeadlineDecouplingEstimate(cloneValue(source));
  applyDemoOverrides(data);
  if (timeScenario === "undated") {
    delete data.summary.deadline;
  }
  return data;
}

function readDemoOverrides() {
  if (!localEditingAllowed) return {};
  try {
    return JSON.parse(localStorage.getItem(DEMO_OVERRIDES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function loadStatusOrderPreference() {
  try {
    const savedOrder = JSON.parse(localStorage.getItem(DEMO_STATUS_ORDER_KEY) ?? "null");
    if (Array.isArray(savedOrder)) {
      return taskEditingModel.normalizeStatusOrder(savedOrder, DEFAULT_STATUS_ORDER);
    }
    const legacyOverrides = JSON.parse(localStorage.getItem(DEMO_OVERRIDES_KEY) ?? "{}");
    return taskEditingModel.normalizeStatusOrder(
      legacyOverrides.__task_content?.status_order,
      DEFAULT_STATUS_ORDER,
    );
  } catch {
    return [...DEFAULT_STATUS_ORDER];
  }
}

function saveStatusOrderPreference() {
  try {
    localStorage.setItem(DEMO_STATUS_ORDER_KEY, JSON.stringify(statusOrder));
  } catch {
    // Sorting remains available in memory when browser storage is unavailable.
  }
}

function writeDemoOverrides(overrides) {
  if (!localEditingAllowed) return false;
  try {
    localStorage.setItem(DEMO_OVERRIDES_KEY, JSON.stringify(overrides));
    return true;
  } catch {
    return false;
  }
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function globalEditingEnabled() {
  return localEditingAllowed && viewMode === "edit";
}

function demoCalculateTaskProgress(task) {
  const completed = task.completed_items?.length ?? 0;
  const pending = task.pending_items?.length ?? 0;
  if (completed + pending > 0) {
    return { completed, total: completed + pending };
  }
  if (task.progress) return { ...task.progress };
  return { completed: task.status === "done" ? 1 : 0, total: 1 };
}

function demoCalculateProjectProgress(tasks) {
  const units = tasks
    .filter((task) => task.status !== "archive")
    .map(demoCalculateTaskProgress);
  const completed = units.reduce((sum, item) => sum + item.completed, 0);
  const total = units.reduce((sum, item) => sum + item.total, 0);
  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

function demoValidateReport(report) {
  const errors = [];
  const taskIds = new Set();
  (report.tasks ?? []).forEach((task, taskIndex) => {
    const taskPath = `tasks[${taskIndex}]`;
    if (!task.id || taskIds.has(task.id)) {
      errors.push({ path: `${taskPath}.id`, message: "任務 ID 不可空白或重複。" });
    }
    taskIds.add(task.id);
    if (!taskEditingModel.normalizeTaskDescription(task.title, 200).ok) {
      errors.push({ path: `${taskPath}.title`, message: "任務名稱無效。" });
    }
    if (!taskEditingModel.normalizeTaskDescription(task.summary, 1000).ok) {
      errors.push({ path: `${taskPath}.summary`, message: "任務描述無效。" });
    }
    if (!taskStatusMeta[task.status]) {
      errors.push({ path: `${taskPath}.status`, message: "任務狀態無效。" });
    }
    const itemIds = new Set();
    ["completed_items", "pending_items"].forEach((field) => {
      (task[field] ?? []).forEach((item, itemIndex) => {
        if (!item.id || itemIds.has(item.id)) {
          errors.push({
            path: `${taskPath}.${field}[${itemIndex}].id`,
            message: "子項目 ID 不可空白或重複。",
          });
        }
        itemIds.add(item.id);
        if (
          !item.demoSynthetic
          && !taskEditingModel.normalizeTaskDescription(item.title, 300).ok
        ) {
          errors.push({
            path: `${taskPath}.${field}[${itemIndex}].title`,
            message: "子項目描述無效。",
          });
        }
      });
    });
  });
  return errors;
}

const demoEditorCore = editorCoreRuntime.createEditorCore({
  calculateProjectProgress: demoCalculateProjectProgress,
  calculateTaskProgress: demoCalculateTaskProgress,
  validateReport: demoValidateReport,
});

function syncTaskLabels() {
  Object.keys(labels).forEach((id) => delete labels[id]);
  [
    ...taskItems,
    ...Object.values(auxiliaryTaskItems).flat(),
  ].forEach((item) => {
    labels[item.id] = item.title;
  });
}

function taskDefinitionFor(taskId) {
  return taskDefinitions.find((task) => task.id === taskId) ?? null;
}

function taskProgressSnapshot(taskId) {
  const definition = taskDefinitionFor(taskId);
  const items = taskItemsFor(taskId);
  const itemCompleted = items.filter(
    (item) => item.status === "done" || item.status === "success",
  ).length;
  if (taskId === primaryTaskId) {
    return {
      completed: itemCompleted,
      total: items.length,
      status: definition?.status ?? "in_progress",
    };
  }
  return {
    completed: Number(definition?.baseCompleted ?? 0) + itemCompleted,
    total: Number(definition?.baseTotal ?? 0) + items.length,
    status: definition?.status ?? "planned",
  };
}

function currentProgressSummary() {
  if (demoEditorSession) {
    return demoEditorSession.derived.progress.project;
  }
  return taskEditingModel.calculateProgressUnits(
    taskDefinitions.map((task) => ({
      ...taskProgressSnapshot(task.id),
      status: task.status,
    })),
  );
}

function updateStatusAndProgressSummaries() {
  const counts = Object.fromEntries(DEFAULT_STATUS_ORDER.map((status) => [status, 0]));
  taskDefinitions.forEach((task) => {
    if (task.status in counts) counts[task.status] += 1;
  });
  elements.filterButtons.forEach((button) => {
    const status = button.dataset.filter;
    button.textContent = status === "all"
      ? `全部 ${taskDefinitions.length}`
      : `${filterStatusLabels[status] ?? status} ${counts[status] ?? 0}`;
  });
  elements.overviewCards.forEach((card) => {
    const status = card.dataset.status;
    const value = card.querySelector(".overview-value");
    if (value) value.textContent = String(counts[status] ?? 0);
  });
  elements.heroSummary.textContent =
    `${taskDefinitions.length} 個狀態測試任務；第一張卡使用隔離時間分析範例。`;

  const progress = currentProgressSummary();
  elements.progressValue.textContent = `整體約 ${progress.percentage}%`;
  elements.progressMeter.value = progress.percentage;
  elements.progressMeter.textContent = `${progress.percentage}%`;
  elements.progressMeter.setAttribute(
    "aria-label",
    `整體進度 ${progress.percentage}%，完成 ${progress.completed}，共 ${progress.total}`,
  );
  return progress;
}

function baseStructureFor(taskId) {
  if (taskId === primaryTaskId) return BASE_TASK_ITEMS.map((item) => item.id);
  return baseTaskDefinitions.some((task) => task.id === taskId) ? [] : null;
}

function updateTaskStructureChanged() {
  if (demoEditorSession) {
    taskStructureChanged = demoEditorSession.derived.timeInvalidation.stale;
    return;
  }
  taskStructureChanged = taskDefinitions.some((task) => {
    const baseItems = baseStructureFor(task.id);
    if (baseItems === null) return true;
    return taskItemsFor(task.id).map((item) => item.id).join("|") !== baseItems.join("|");
  });
}

function taskItemsFor(taskId) {
  return taskId === primaryTaskId
    ? taskItems
    : (auxiliaryTaskItems[taskId] ?? []);
}

function demoCoreItem(item, order) {
  return {
    id: item.id,
    title: item.title,
    priority: taskEditingModel.normalizePriority(item.priority, DEFAULT_PRIORITY),
    demoStatus: item.status,
    demoOrder: order,
  };
}

function demoSyntheticItem(taskId, kind, index) {
  return {
    id: `demo-base-${taskId}-${kind}-${index + 1}`,
    title: kind === "done" ? "既有完成進度" : "既有待處理進度",
    priority: DEFAULT_PRIORITY,
    demoSynthetic: true,
    demoStatus: kind === "done" ? "done" : "pending",
    demoOrder: -1,
  };
}

function demoReportFromLegacyState() {
  return {
    schema_version: "1.0",
    report_id: "time-reference-demo",
    scope_id: "time-reference-demo",
    title: "TaskProgress 時間參考開發進度",
    updated_at: BASE_REPORT_UPDATED_AT,
    tasks: taskDefinitions.map((definition) => {
      const items = taskItemsFor(definition.id);
      const completedItems = items
        .map(demoCoreItem)
        .filter((item) => ["done", "success"].includes(item.demoStatus));
      const pendingItems = items
        .map(demoCoreItem)
        .filter((item) => !["done", "success"].includes(item.demoStatus));
      const baseCompleted = definition.id === primaryTaskId
        ? 0
        : Number(definition.baseCompleted ?? 0);
      const baseTotal = definition.id === primaryTaskId
        ? 0
        : Number(definition.baseTotal ?? 0);
      completedItems.unshift(...Array.from(
        { length: baseCompleted },
        (_value, index) => demoSyntheticItem(definition.id, "done", index),
      ));
      pendingItems.unshift(...Array.from(
        { length: Math.max(0, baseTotal - baseCompleted) },
        (_value, index) => demoSyntheticItem(definition.id, "todo", index),
      ));
      return {
        id: definition.id,
        title: definition.title,
        summary: taskSummaries[definition.id] ?? definition.summary,
        status: definition.status,
        priority: taskEditingModel.normalizePriority(
          definition.priority,
          DEFAULT_PRIORITY,
        ),
        completed_items: completedItems,
        pending_items: pendingItems,
        demoBaseCompleted: baseCompleted,
        demoBaseTotal: baseTotal,
      };
    }),
  };
}

function syncLegacyStateFromEditorSession() {
  if (!demoEditorSession) return;
  const draftTasks = demoEditorSession.draft.tasks;
  const taskIds = new Set(draftTasks.map((task) => task.id));
  elements.taskCards = elements.taskCards.filter((card) => {
    if (taskIds.has(card.dataset.taskId)) return true;
    card.remove();
    return false;
  });
  elements.taskDurations = elements.taskDurations.filter(
    (duration) => duration.isConnected,
  );

  const nextDefinitions = [];
  const nextSummaries = {};
  const nextItemsByTask = {};
  draftTasks.forEach((task) => {
    nextDefinitions.push({
      id: task.id,
      title: task.title,
      summary: task.summary,
      status: task.status,
      priority: taskEditingModel.normalizePriority(task.priority, DEFAULT_PRIORITY),
      baseCompleted: Number(task.demoBaseCompleted ?? 0),
      baseTotal: Number(task.demoBaseTotal ?? 0),
    });
    nextSummaries[task.id] = task.summary;
    nextItemsByTask[task.id] = [
      ...(task.completed_items ?? []).map((item) => ({ field: "completed", item })),
      ...(task.pending_items ?? []).map((item) => ({ field: "pending", item })),
    ]
      .filter(({ item }) => !item.demoSynthetic)
      .sort((left, right) => (
        Number(left.item.demoOrder ?? 0) - Number(right.item.demoOrder ?? 0)
      ))
      .map(({ field, item }) => ({
        id: item.id,
        title: item.title,
        status: item.demoStatus ?? (field === "completed" ? "done" : "pending"),
        priority: taskEditingModel.normalizePriority(item.priority, DEFAULT_PRIORITY),
      }));
  });

  taskDefinitions = nextDefinitions;
  taskSummaries = nextSummaries;
  taskItems = nextItemsByTask[primaryTaskId] ?? [];
  auxiliaryTaskItems = Object.fromEntries(
    nextDefinitions
      .filter((task) => task.id !== primaryTaskId)
      .map((task) => [task.id, nextItemsByTask[task.id] ?? []]),
  );

  nextDefinitions.forEach((definition) => {
    let card = elements.taskCards.find(
      (candidate) => candidate.dataset.taskId === definition.id,
    );
    if (!card) card = createTaskCard(definition);
    card.dataset.status = definition.status;
    card.dataset.priority = String(definition.priority);
    card.dataset.baseCompleted = String(definition.baseCompleted);
    card.dataset.baseTotal = String(definition.baseTotal);
    const title = card.querySelector("h3");
    if (title) title.textContent = definition.title;
  });
  syncTaskLabels();
}

function initializeDemoEditorSession() {
  demoEditorSession = demoEditorCore.createReportEditorSession(
    demoReportFromLegacyState(),
    { fallbackPriority: DEFAULT_PRIORITY },
  );
  syncLegacyStateFromEditorSession();
  updateTaskStructureChanged();
  updateTaskContentDirty();
}

function applyDemoEditorCommand(command) {
  if (!demoEditorSession) throw new Error("Demo Editor Core 尚未啟動。");
  const changed = demoEditorSession.dispatch(command);
  if (!changed) return false;
  syncLegacyStateFromEditorSession();
  updateTaskStructureChanged();
  updateTaskContentDirty();
  return true;
}

function allTaskItemIds() {
  return elements.taskCards.flatMap(
    (card) => taskItemsFor(card.dataset.taskId).map((item) => item.id),
  );
}

function allTaskIds() {
  return taskDefinitions.map((task) => task.id);
}

function orderedTaskItems(items) {
  const rank = new Map(statusOrder.map((status, index) => [status, index]));
  return items
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftGroup = itemStatusGroup[left.item.status];
      const rightGroup = itemStatusGroup[right.item.status];
      const groupDifference = (rank.get(leftGroup) ?? statusOrder.length)
        - (rank.get(rightGroup) ?? statusOrder.length);
      if (groupDifference) return groupDifference;
      const priorityDifference =
        (taskEditingModel.normalizePriority(left.item.priority, DEFAULT_PRIORITY))
        - (taskEditingModel.normalizePriority(right.item.priority, DEFAULT_PRIORITY));
      if (priorityDifference) return priorityDifference;
      const withinDifference = (itemStatusWithinGroup[left.item.status] ?? 0)
        - (itemStatusWithinGroup[right.item.status] ?? 0);
      return withinDifference || left.index - right.index;
    })
    .map(({ item }) => item);
}

function taskContentSignature(definitions, summaries, primaryItems, auxiliaryItems) {
  return JSON.stringify({
    tasks: definitions.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      baseCompleted: task.baseCompleted,
      baseTotal: task.baseTotal,
    })),
    summaries,
    items_by_task: Object.fromEntries(
      elements.taskCards.map((card) => {
        const taskId = card.dataset.taskId;
        const items = taskId === primaryTaskId
          ? primaryItems
          : (auxiliaryItems[taskId] ?? []);
        return [
          taskId,
          items.map(({ id, title, status, priority }) => ({
            id,
            title,
            status,
            priority,
          })),
        ];
      }),
    ),
  });
}

function renderGlobalEditSave() {
  elements.globalEditSave.hidden =
    !globalEditingEnabled() || (!taskContentDirty && !timeInputDirty);
}

function updateTimeInputDirty() {
  timeInputDirty = estimateDrafts.size > 0 || capacityDraft !== null;
  renderGlobalEditSave();
}

function updateTaskContentDirty() {
  if (demoEditorSession) {
    taskContentDirty = demoEditorSession.derived.dirty;
    renderGlobalEditSave();
    return;
  }
  taskContentDirty = taskContentSignature(
    taskDefinitions,
    taskSummaries,
    taskItems,
    auxiliaryTaskItems,
  ) !== taskContentSignature(
    persistedTaskDefinitions,
    persistedTaskSummaries,
    persistedTaskItems,
    persistedAuxiliaryTaskItems,
  );
  renderGlobalEditSave();
}

function createTaskCard(definition) {
  const status = taskStatusMeta[definition.status] ? definition.status : "planned";
  const shell = editorSurface.createTaskCardShell(
    { ...definition, status },
    { completed: 0, total: 0, showPriority: false },
  );
  const { card, duration } = shell;
  card.dataset.baseCompleted = String(definition.baseCompleted ?? 0);
  card.dataset.baseTotal = String(definition.baseTotal ?? 0);
  duration.textContent = "時間待重新分析";

  const columns = document.createElement("div");
  columns.className = "work-columns task-child-panel";
  columns.hidden = true;
  const section = document.createElement("section");
  section.className = "detail-section pending-work";
  const heading = document.createElement("h4");
  heading.className = "detail-heading";
  heading.textContent = "尚未完成";
  const list = document.createElement("ul");
  list.className = "detail-list task-child-list";
  list.dataset.taskChildList = definition.id;
  section.append(heading, list);
  columns.append(section);
  card.append(columns);

  elements.taskList.append(card);
  elements.taskCards.push(card);
  elements.taskDurations.push(duration);
  auxiliaryTaskItems[definition.id] ??= [];
  taskSummaries[definition.id] ??= definition.summary;
  return card;
}

function loadTaskContentOverrides() {
  const content = readDemoOverrides().__task_content;
  if (!content || typeof content !== "object") {
    syncTaskLabels();
    persistedTaskSummaries = { ...taskSummaries };
    return;
  }

  if (Array.isArray(content.tasks)) {
    const knownTaskIds = new Set(allTaskIds());
    content.tasks.forEach((task) => {
      const id = String(task?.id ?? "");
      const title = taskEditingModel.normalizeTaskDescription(task?.title, 200);
      const summary = taskEditingModel.normalizeTaskDescription(task?.summary, 1000);
      if (
        knownTaskIds.has(id)
        || !/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(id)
        || !title.ok
        || !summary.ok
        || !taskStatusMeta[task?.status]
      ) {
        return;
      }
      const definition = {
        id,
        title: title.value,
        summary: summary.value,
        status: task.status,
        priority: taskEditingModel.normalizePriority(task.priority, DEFAULT_PRIORITY),
        baseCompleted: 0,
        baseTotal: 0,
      };
      knownTaskIds.add(id);
      taskDefinitions.push(definition);
      createTaskCard(definition);
    });
  }

  const taskPriorities = content.task_priorities && typeof content.task_priorities === "object"
    ? content.task_priorities
    : {};
  taskDefinitions.forEach((task) => {
    task.priority = taskEditingModel.normalizePriority(
      taskPriorities[task.id],
      taskEditingModel.normalizePriority(task.priority, DEFAULT_PRIORITY),
    );
  });

  if (content.summaries && typeof content.summaries === "object") {
    taskDefinitions.forEach(({ id: taskId }) => {
      const result = taskEditingModel.normalizeTaskDescription(
        content.summaries[taskId],
        1000,
      );
      if (result.ok) taskSummaries[taskId] = result.value;
    });
  }

  const itemsByTask = content.items_by_task && typeof content.items_by_task === "object"
    ? content.items_by_task
    : {};
  const ids = new Set();
  elements.taskCards.forEach((card) => {
    const taskId = card.dataset.taskId;
    const savedItems = Array.isArray(itemsByTask[taskId])
      ? itemsByTask[taskId]
      : (taskId === primaryTaskId && Array.isArray(content.items) ? content.items : null);
    if (!savedItems) {
      taskItemsFor(taskId).forEach((item) => ids.add(item.id));
      return;
    }

    const restored = [];
    savedItems.forEach((item) => {
      const title = taskEditingModel.normalizeTaskDescription(item?.title, 300);
      const id = String(item?.id ?? "");
      if (
        !title.ok
        || !/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(id)
        || ids.has(id)
      ) {
        return;
      }
      ids.add(id);
      restored.push({
        id,
        title: title.value,
        status: itemStatusMeta[item.status] ? item.status : "pending",
        priority: taskEditingModel.normalizePriority(
          item.priority,
          BASE_TASK_ITEMS.find((candidate) => candidate.id === id)?.priority ?? DEFAULT_PRIORITY,
        ),
      });
    });
    if (
      taskId === primaryTaskId
      && Number(content.base_revision ?? 1) < TASK_CONTENT_REVISION
      && !ids.has(DEADLINE_DECOUPLING_ESTIMATE.item_id)
    ) {
      const baseItem = BASE_TASK_ITEMS.find(
        (item) => item.id === DEADLINE_DECOUPLING_ESTIMATE.item_id,
      );
      if (baseItem) {
        restored.push({ ...baseItem });
        ids.add(baseItem.id);
      }
    }
    if (taskId === primaryTaskId) taskItems = restored;
    else auxiliaryTaskItems[taskId] = restored;
  });

  updateTaskStructureChanged();
  syncTaskLabels();
  persistedTaskItems = taskItems.map((item) => ({ ...item }));
  persistedAuxiliaryTaskItems = cloneValue(auxiliaryTaskItems);
  persistedTaskSummaries = { ...taskSummaries };
  persistedTaskDefinitions = cloneValue(taskDefinitions);
  updateTaskContentDirty();
}

function stageTaskContentOverrides(overrides) {
  const itemsByTask = Object.fromEntries(
    elements.taskCards.map((card) => {
      const taskId = card.dataset.taskId;
      return [taskId, taskItemsFor(taskId).map((item) => ({ ...item }))];
    }),
  );
  overrides.__task_content = {
    base_revision: TASK_CONTENT_REVISION,
    tasks: taskDefinitions
      .filter((task) => !baseTaskDefinitions.some((base) => base.id === task.id))
      .map((task) => ({ ...task, summary: taskSummaries[task.id] })),
    summaries: { ...taskSummaries },
    task_priorities: Object.fromEntries(
      taskDefinitions.map((task) => [
        task.id,
        taskEditingModel.normalizePriority(task.priority, DEFAULT_PRIORITY),
      ]),
    ),
    items_by_task: itemsByTask,
    items: taskItems.map((item) => ({ ...item })),
  };
  return overrides;
}

function commitPersistedTaskContent() {
  if (demoEditorSession) {
    demoEditorSession.commit(
      demoEditorSession.prepareSave(new Date().toISOString()),
    );
    syncLegacyStateFromEditorSession();
  }
  persistedTaskItems = taskItems.map((item) => ({ ...item }));
  persistedAuxiliaryTaskItems = cloneValue(auxiliaryTaskItems);
  persistedTaskSummaries = { ...taskSummaries };
  persistedTaskDefinitions = cloneValue(taskDefinitions);
  updateTaskContentDirty();
}

function renderTaskSummaryControls() {
  elements.taskCards.forEach((card) => {
    const taskId = card.dataset.taskId;
    const summary = card.querySelector(".task-summary");
    if (!taskId || !summary) return;
    summary.textContent = taskSummaries[taskId] ?? baseTaskSummaries[taskId];
    summary.hidden = globalEditingEnabled();
    card.querySelector(".task-summary-direct-input")?.remove();
    if (!globalEditingEnabled()) return;

    const input = document.createElement("textarea");
    input.className = "task-summary-direct-input";
    input.rows = 2;
    input.maxLength = 1000;
    input.value = taskSummaries[taskId] ?? baseTaskSummaries[taskId];
    input.dataset.taskId = taskId;
    input.setAttribute("aria-label", "任務描述");
    input.addEventListener("input", () => {
      input.setCustomValidity("");
      applyDemoEditorCommand({
        type: "set-task-field",
        taskId,
        field: "summary",
        value: input.value,
      });
    });
    summary.after(input);
  });
}

function hasUnsavedDrafts() {
  return taskContentDirty || timeInputDirty;
}

function discardGlobalDrafts() {
  demoEditorSession?.discard();
  syncLegacyStateFromEditorSession();
  addingTaskId = null;
  addingTopLevelTask = false;
  lastDeletedTaskItem = null;

  estimateDrafts.clear();
  capacityDraft = null;
  timeDraftError = null;
  timeInputDirty = false;

  syncTaskLabels();
  updateTaskStructureChanged();
  updateTaskContentDirty();
  if (loadedAnalysisSource) {
    render(prepareDemoAnalysis(loadedAnalysisSource));
  } else {
    renderWithoutTime();
  }
}

function setViewMode(nextMode) {
  const leavingEditMode = nextMode !== "edit" && viewMode === "edit";
  viewMode = nextMode === "edit" && localEditingAllowed ? "edit" : "preview";
  document.documentElement.dataset.viewMode = viewMode;
  elements.viewModeSelect.value = viewMode;
  elements.viewModeSelect.disabled = !localEditingAllowed;
  if (!localEditingAllowed) {
    elements.viewModeSelect.title = "編輯模式只在本機 Demo 開放";
  }
  if (leavingEditMode && hasUnsavedDrafts()) discardGlobalDrafts();
  addingTaskId = null;
  if (elements.dialog.open) elements.dialog.close();
  renderTaskSummaryControls();
  renderTaskItems();
  renderTopLevelTaskAdd();
  renderGlobalEditSave();
  return true;
}

function applyCapacityProfile(data, profile, updatedAt = null) {
  const safeProfile = cloneValue(profile);
  const deadline = data.summary.deadline;
  deadline.schedule.capacity_profile = safeProfile;
  deadline.schedule.capacity_timeline = capacityEngine.buildTimeline(
    deadline,
    safeProfile,
  );
  data.summary.nominal_daily_capacity_minutes =
    safeProfile.capacity_minutes_per_executor_day;
  if (updatedAt && data.inputs) data.inputs.config_updated_at = updatedAt;
}

function applyDemoOverrides(data) {
  const overrides = readDemoOverrides();
  let capacityApplied = false;
  if (overrides.__capacity_profile?.profile && data.summary.deadline?.schedule) {
    applyCapacityProfile(
      data,
      overrides.__capacity_profile.profile,
      overrides.__capacity_profile.updated_at,
    );
    capacityApplied = true;
  }
  let applied = false;
  data.tasks.forEach((task) => {
    task.items.forEach((item) => {
      const override = overrides[item.item_id];
      if (!override) return;
      applied = true;
      item.inputs.forEach((input) => {
        if (input.origin === "human" && override.inputs?.[input.name] !== undefined) {
          input.value = override.inputs[input.name];
        }
      });
      item.human_note = override.human_note ?? item.human_note;
      applyEstimateResult(item, calculateEstimate(item));
    });
  });
  if (applied) {
    recomputeAnalysis(data);
  } else if (capacityApplied) {
    recomputeDerivedTotals(data);
  }
  return data;
}

function sortStatusBoundElements() {
  const priorityOrderedCards = elements.taskCards
    .map((card, index) => ({ card, index }))
    .sort((left, right) => {
      const difference =
        taskEditingModel.normalizePriority(left.card.dataset.priority, DEFAULT_PRIORITY)
        - taskEditingModel.normalizePriority(right.card.dataset.priority, DEFAULT_PRIORITY);
      return difference || left.index - right.index;
    })
    .map(({ card }) => card);
  taskEditingModel.stableSortByStatus(
    priorityOrderedCards,
    statusOrder,
    (card) => card.dataset.status,
  )
    .forEach((card) => elements.taskList.append(card));
  taskEditingModel.stableSortByStatus(
    elements.overviewCards,
    statusOrder,
    (card) => card.dataset.status,
  )
    .forEach((card) => elements.overviewGrid.append(card));
}

function renderStatusOrder() {
  const allButton = elements.filterButtons.find((button) => button.dataset.filter === "all");
  if (allButton) elements.statusFilters.append(allButton);
  statusOrder.forEach((status, index) => {
    const button = elements.filterButtons.find(
      (candidate) => candidate.dataset.filter === status,
    );
    if (!button) return;
    elements.statusFilters.append(button);
    button.draggable = true;
    button.classList.add("status-sortable");
    button.title = "拖曳調整卡片排序；Alt＋左右方向鍵也可移動";
    button.setAttribute("aria-keyshortcuts", "Alt+ArrowLeft Alt+ArrowRight");
    button.setAttribute(
      "aria-label",
      `${button.textContent.trim()}，排序第 ${index + 1}；可拖曳調整`,
    );
  });
  sortStatusBoundElements();
}

function moveStatus(status, targetStatus, placeAfter = false) {
  if (
    status === targetStatus
    || !statusOrder.includes(status)
    || !statusOrder.includes(targetStatus)
  ) {
    return;
  }
  const nextOrder = taskEditingModel.moveStatusOrder(
    statusOrder,
    status,
    targetStatus,
    placeAfter,
  );
  if (nextOrder.every((candidate, index) => candidate === statusOrder[index])) return;
  statusOrder = nextOrder;
  saveStatusOrderPreference();
  renderTaskItems();
}

function moveStatusByOffset(status, offset) {
  const index = statusOrder.indexOf(status);
  const targetIndex = index + offset;
  if (index < 0 || targetIndex < 0 || targetIndex >= statusOrder.length) return;
  const targetStatus = statusOrder[targetIndex];
  moveStatus(status, targetStatus, offset > 0);
  elements.filterButtons
    .find((button) => button.dataset.filter === status)
    ?.focus();
}

function clearStatusDragIndicators() {
  elements.filterButtons.forEach((button) => {
    button.classList.remove("status-dragging", "status-drop-before", "status-drop-after");
  });
}

function applyTaskFilter(filter) {
  activeTaskFilter = filter;
  sortStatusBoundElements();
  elements.taskCards.forEach((card) => {
    card.hidden = filter !== "all" && card.dataset.status !== filter;
  });
  elements.filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

function hours(minutes) {
  return `${Math.round((minutes / 60) * 10) / 10} hr`;
}

function deliveryLabel(value) {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));
}

function analysisTime(value) {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function updateRuntimeDeadline(data, now = new Date()) {
  const deadline = data?.summary?.deadline;
  if (!deadline?.schedule) return;
  deadline.work_progress_ratio = currentProgressSummary().ratio;
  Object.assign(deadline, deadlineEngine.calculate(deadline, now));
}

function pressureLabel(deadline) {
  return Number.isFinite(deadline.progress_pressure_ratio)
    ? `${deadline.progress_pressure_ratio.toFixed(4)} ×`
    : "已無可用容量";
}

function deadlineExplanation(deadline, urgency) {
  if (deadline.boundary_state === "complete") {
    return {
      text: "工作進度已達 100%，期限風險計算結束。",
      formula: "work_progress = 1 → complete",
    };
  }
  if (deadline.boundary_state === "delivery_reached") {
    return {
      text: "已到交付時間，最後回報的工作進度仍未達 100%，因此判定為進度危急。",
      formula: "now ≥ delivery_at AND work_progress < 1 → critical",
    };
  }
  if (deadline.boundary_state === "capacity_exhausted") {
    return {
      text: "交付前排定的可用工作容量已全部消耗，但工作仍未完成，因此判定為進度危急。",
      formula: "time_progress = 1 AND work_progress < 1 → critical",
    };
  }
  if (deadline.risk_basis === "capacity_shortfall") {
    return {
      text: `預估未完成工作為 ${hours(deadline.remaining_estimated_minutes)}，但交付前只剩 ${hours(deadline.remaining_capacity_minutes)}；容量缺口 ${hours(Math.abs(deadline.capacity_balance_minutes))}，因此直接判定為「容量不足」。`,
      formula: `${hours(deadline.remaining_capacity_minutes)} - ${hours(deadline.remaining_estimated_minutes)} = -${hours(Math.abs(deadline.capacity_balance_minutes))}`,
    };
  }
  if (deadline.risk_basis === "capacity_tight") {
    return {
      text: `預估未完成工作將使用剩餘容量的 ${percent(deadline.feasibility_ratio)}，已超過 ${percent(deadline.schedule.risk_thresholds.capacity_at_risk_ratio ?? 0.8)} 的容量警戒線，因此判定為「容量緊繃」。`,
      formula: `${hours(deadline.remaining_estimated_minutes)} ÷ ${hours(deadline.remaining_capacity_minutes)} = ${deadline.feasibility_ratio.toFixed(4)}`,
    };
  }

  const pressure = deadline.progress_pressure_ratio;
  const thresholds = deadline.schedule.risk_thresholds;
  return {
    text: `截至目前，可用工作容量已消耗 ${percent(deadline.time_progress_ratio)}，最後回報的工作進度為 ${percent(deadline.work_progress_ratio)}。剩餘期間需要約 ${pressure.toFixed(4)} 倍原計畫速度，目前判定為「${urgency.label}」；綠燈上限 ${thresholds.on_track_max.toFixed(2)}，黃燈上限 ${thresholds.at_risk_max.toFixed(2)}。`,
    formula: `(1 - ${deadline.work_progress_ratio.toFixed(2)}) ÷ (1 - ${deadline.time_progress_ratio.toFixed(4)}) = ${pressure.toFixed(4)}`,
  };
}

function metric(label, value) {
  const node = document.createElement("div");
  node.className = "metric";
  const name = document.createElement("span");
  name.textContent = label;
  const result = document.createElement("strong");
  result.textContent = value;
  node.append(name, result);
  return node;
}

function reportSummaryField(label, value, urgency = null) {
  const node = document.createElement("div");
  node.className = "progress-report-field";
  const name = document.createElement("span");
  name.textContent = label;
  const result = document.createElement("strong");
  if (urgency) {
    const lamp = document.createElement("span");
    lamp.className = `formula-lamp ${urgency.className}`;
    lamp.setAttribute("aria-hidden", "true");
    result.append(lamp);
  }
  result.append(value);
  node.append(name, result);
  return node;
}

function deliveryCountdown(deadline) {
  if (deadline.boundary_state === "complete") return "已完成";
  const now = new Date(deadline.evaluated_at);
  const deliveryAt = new Date(deadline.delivery_at);
  const difference = deliveryAt.getTime() - now.getTime();
  const absoluteDifference = Math.abs(difference);
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const amount = absoluteDifference >= day
    ? `${Math.ceil(absoluteDifference / day)} 日`
    : absoluteDifference >= hour
      ? `${Math.ceil(absoluteDifference / hour)} 小時`
      : "不到 1 小時";
  return difference > 0 ? amount : `已逾期 ${amount}`;
}

function remainingWorkload(summary, workProgressRatio = currentProgressSummary().ratio) {
  if (Number.isFinite(summary.remaining_estimated_minutes)
    && summary.remaining_estimated_minutes >= 0) {
    return { minutes: summary.remaining_estimated_minutes };
  }
  const factor = summary.execution_calibration.factor;
  const calibratedTotal = summary.calibrated_total_minutes
    ?? summary.total_estimated_minutes / factor;
  const remainingMinutes = calibratedTotal * (1 - workProgressRatio);
  return {
    minutes: remainingMinutes,
  };
}

function publicRiskLabel(deadline, urgency) {
  if (deadline.boundary_state === "complete") return "已完成";
  if (deadline.boundary_state === "delivery_reached") return "已逾期";
  if (deadline.risk_basis === "capacity_shortfall") return "容量不足";
  if (deadline.risk_basis === "capacity_tight") return "容量緊繃";
  if (deadline.urgency === "critical") return "預計超期";
  return urgency.label;
}

function openDialog(kicker, title, content) {
  elements.dialogKicker.textContent = kicker;
  elements.dialogTitle.textContent = title;
  elements.dialogContent.replaceChildren(content);
  if (!elements.dialog.open) elements.dialog.showModal();
}

function sourceRow(label, value, note) {
  const row = document.createElement("div");
  row.className = "source-row";
  const copy = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = label;
  const description = document.createElement("p");
  description.textContent = note;
  const amount = document.createElement("span");
  amount.textContent = value;
  copy.append(title, description);
  row.append(copy, amount);
  return row;
}

function capacityProfileFor(summary, deadline) {
  return deadline.schedule.capacity_profile ?? {
    total_minutes_per_day: 1440,
    sleep_minutes_per_day: 480,
    life_minutes_per_day: 480,
    other_unavailable_minutes_per_day: 0,
    capacity_minutes_per_executor_day: summary.nominal_daily_capacity_minutes,
    working_weekdays: [1, 2, 3, 4, 5],
    capacity_exceptions: [],
  };
}

function workingDaysLabel(weekdays) {
  const sorted = [...weekdays].sort((left, right) => left - right);
  if (sorted.join(",") === "1,2,3,4,5") return "星期一至五";
  return sorted.map((day) => `週${weekdayLabels.get(day)}`).join("、");
}

function capacityHourInput(name, label, valueInHours) {
  const field = document.createElement("label");
  field.className = "item-editor-field";
  const title = document.createElement("span");
  title.textContent = label;
  const control = document.createElement("span");
  control.className = "item-editor-control";
  const input = document.createElement("input");
  input.type = "number";
  input.name = name;
  input.min = "0";
  input.max = "24";
  input.step = "0.5";
  input.required = true;
  input.value = String(valueInHours);
  const unit = document.createElement("span");
  unit.textContent = "hr";
  control.append(input, unit);
  field.append(title, control);
  return field;
}

function capacityDraftFromProfile(profile) {
  return {
    sleep_hours: String(roundHours(profile.sleep_minutes_per_day / 60)),
    life_hours: String(roundHours(profile.life_minutes_per_day / 60)),
    other_hours: String(roundHours(profile.other_unavailable_minutes_per_day / 60)),
    working_weekdays: [...profile.working_weekdays],
    capacity_exceptions: profile.capacity_exceptions
      .map((exception) => (
        `${exception.date} | ${roundHours(exception.available_minutes / 60)} | ${exception.public_label ?? ""}`
      ))
      .join("\n"),
  };
}

function readCapacityDraft(form) {
  const formData = new FormData(form);
  return {
    sleep_hours: String(formData.get("sleep_hours") ?? ""),
    life_hours: String(formData.get("life_hours") ?? ""),
    other_hours: String(formData.get("other_hours") ?? ""),
    working_weekdays: formData
      .getAll("working_weekday")
      .map(Number)
      .sort((left, right) => left - right),
    capacity_exceptions: String(formData.get("capacity_exceptions") ?? ""),
  };
}

function capacityProfileFromDraft(draft) {
  const sleepMinutes = Math.round(Number(draft.sleep_hours) * 60);
  const lifeMinutes = Math.round(Number(draft.life_hours) * 60);
  const otherMinutes = Math.round(Number(draft.other_hours) * 60);
  const capacityMinutes = 1440 - sleepMinutes - lifeMinutes - otherMinutes;
  if (
    ![sleepMinutes, lifeMinutes, otherMinutes].every(
      (value) => Number.isFinite(value) && value >= 0,
    )
    || capacityMinutes <= 0
  ) {
    throw new Error("睡眠、生活與其他不可工作時間合計必須小於 24 hr。");
  }
  if (!draft.working_weekdays.length) throw new Error("至少選擇一個工作日。");
  const profile = {
    total_minutes_per_day: 1440,
    sleep_minutes_per_day: sleepMinutes,
    life_minutes_per_day: lifeMinutes,
    other_unavailable_minutes_per_day: otherMinutes,
    capacity_minutes_per_executor_day: capacityMinutes,
    working_weekdays: [...draft.working_weekdays],
    capacity_exceptions: capacityEngine.parseExceptions(draft.capacity_exceptions),
  };
  if (analysis.summary.deadline) {
    const timeline = capacityEngine.buildTimeline(analysis.summary.deadline, profile);
    if (!timeline.some((day) => day.capacity_minutes > 0)) {
      throw new Error("交付前必須至少保留一段可工作容量。");
    }
  }
  return profile;
}

function createCapacityEditor(profile) {
  const form = document.createElement("form");
  form.className = "item-editor capacity-editor";
  const draft = capacityDraft ?? capacityDraftFromProfile(profile);

  const heading = document.createElement("div");
  heading.className = "item-editor-heading";
  const title = document.createElement("h3");
  title.textContent = "編輯工作容量";
  const localNote = document.createElement("span");
  localNote.textContent = "草稿暫存在記憶體；重新計算只預覽，全域儲存才寫入";
  heading.append(title, localNote);

  const fields = document.createElement("div");
  fields.className = "item-editor-fields";
  fields.append(
    capacityHourInput("sleep_hours", "每日睡眠", draft.sleep_hours),
    capacityHourInput("life_hours", "每日生活時間", draft.life_hours),
    capacityHourInput(
      "other_hours",
      "其他固定不可工作",
      draft.other_hours,
    ),
  );

  const derived = document.createElement("p");
  derived.className = "capacity-derived";
  const updateDerived = () => {
    const formData = new FormData(form);
    const unavailable = ["sleep_hours", "life_hours", "other_hours"]
      .reduce((total, name) => total + Number(formData.get(name) ?? 0), 0);
    const available = 24 - unavailable;
    derived.textContent = Number.isFinite(available) && available > 0
      ? `每日工作容量：${roundHours(available)} hr`
      : "每日工作容量必須大於 0 hr";
  };

  const weekdayField = document.createElement("fieldset");
  weekdayField.className = "capacity-weekdays";
  const weekdayLegend = document.createElement("legend");
  weekdayLegend.textContent = "工作日";
  weekdayField.append(weekdayLegend);
  weekdayLabels.forEach((label, day) => {
    const option = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "working_weekday";
    input.value = String(day);
    input.checked = draft.working_weekdays.includes(day);
    option.append(input, `週${label}`);
    weekdayField.append(option);
  });

  const exceptionsField = document.createElement("label");
  exceptionsField.className = "item-editor-reason capacity-exceptions-editor";
  const exceptionsLabel = document.createElement("span");
  exceptionsLabel.textContent = "休假與例外";
  const exceptions = document.createElement("textarea");
  exceptions.name = "capacity_exceptions";
  exceptions.rows = 4;
  exceptions.placeholder = "2026-07-29 | 0 | 休假";
  exceptions.value = draft.capacity_exceptions;
  const exceptionsHelp = document.createElement("small");
  exceptionsHelp.textContent = "每行：日期 | 當日可工作 hr | 公開標籤（不要填私人細節）";
  exceptionsField.append(exceptionsLabel, exceptions, exceptionsHelp);

  const error = document.createElement("p");
  error.className = "item-editor-error";
  error.hidden = timeDraftError?.kind !== "capacity";
  error.textContent = error.hidden ? "" : timeDraftError.message;

  const actions = document.createElement("div");
  actions.className = "item-editor-actions";
  const preview = document.createElement("button");
  preview.className = "item-editor-preview";
  preview.type = "button";
  preview.textContent = "重新計算";
  preview.addEventListener("click", () => previewTimeDrafts({
    kind: "capacity",
  }));
  actions.append(preview);

  form.append(heading, fields, derived, weekdayField, exceptionsField, error, actions);
  form.addEventListener("input", () => {
    capacityDraft = readCapacityDraft(form);
    if (timeDraftError?.kind === "capacity") timeDraftError = null;
    error.hidden = true;
    updateDerived();
    updateTimeInputDirty();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
  updateDerived();
  return form;
}

function createCapacityPanel(summary, deadline) {
  const profile = capacityProfileFor(summary, deadline);
  const panel = document.createElement("section");
  panel.className = "project-tab-panel";
  panel.id = "project-capacity-panel";
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", "project-capacity-tab");

  const toolbar = document.createElement("div");
  toolbar.className = "capacity-panel-toolbar";
  const note = document.createElement("p");
  note.textContent = globalEditingEnabled()
    ? "全域編輯模式已解鎖工作容量；修改只保存在此瀏覽器。"
    : "工作容量由每日分配、工作日及休假例外共同產生。";
  toolbar.append(note);

  const grid = document.createElement("div");
  grid.className = "metric-grid";
  const remainingCapacity = Math.max(
    0,
    deadline.total_capacity_minutes - deadline.elapsed_capacity_minutes,
  );
  grid.append(
    metric("每日工作容量", hours(profile.capacity_minutes_per_executor_day)),
    metric("工作日", workingDaysLabel(profile.working_weekdays)),
    metric("交付前總容量", hours(deadline.total_capacity_minutes)),
    metric("交付前剩餘容量", hours(remainingCapacity)),
    metric("每日睡眠", hours(profile.sleep_minutes_per_day)),
    metric("每日生活時間", hours(profile.life_minutes_per_day)),
    metric("其他固定不可工作", hours(profile.other_unavailable_minutes_per_day)),
    metric("時區", deadline.schedule.timezone),
  );

  const formulaCard = document.createElement("section");
  formulaCard.className = "explanation-card";
  const formulaTitle = document.createElement("h3");
  formulaTitle.textContent = "每日容量公式";
  const formulaText = document.createElement("p");
  formulaText.textContent = "睡眠、生活與其他固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。";
  const formula = document.createElement("code");
  formula.className = "formula";
  formula.textContent = `${hours(profile.total_minutes_per_day)} - ${hours(profile.sleep_minutes_per_day)} - ${hours(profile.life_minutes_per_day)} - ${hours(profile.other_unavailable_minutes_per_day)} = ${hours(profile.capacity_minutes_per_executor_day)}`;
  formulaCard.append(formulaTitle, formulaText, formula);

  const exceptionSection = document.createElement("section");
  exceptionSection.className = "composition capacity-exceptions";
  const exceptionTitle = document.createElement("h3");
  exceptionTitle.textContent = `休假與例外（${profile.capacity_exceptions.length}）`;
  const exceptionList = document.createElement("div");
  exceptionList.className = "source-list";
  if (profile.capacity_exceptions.length) {
    exceptionList.append(
      ...profile.capacity_exceptions.map((exception) => sourceRow(
        exception.date,
        hours(exception.available_minutes),
        exception.public_label || "工作容量例外",
      )),
    );
  } else {
    const empty = document.createElement("p");
    empty.className = "capacity-empty";
    empty.textContent = "目前沒有休假或其他容量例外。";
    exceptionList.append(empty);
  }
  exceptionSection.append(exceptionTitle, exceptionList);

  panel.append(toolbar, grid, formulaCard, exceptionSection);
  if (globalEditingEnabled()) {
    capacityEditorOpen = true;
    panel.append(createCapacityEditor(profile));
  }
  return panel;
}

function evaluationNode(label, value, note, className = "") {
  const node = document.createElement("div");
  node.className = `evaluation-node ${className}`.trim();
  const heading = document.createElement("span");
  heading.textContent = label;
  const result = document.createElement("strong");
  result.textContent = value;
  const description = document.createElement("small");
  description.textContent = note;
  node.append(heading, result, description);
  return node;
}

function createEvaluationFlowPanel(summary, deadline, urgency, remaining) {
  const panel = document.createElement("section");
  panel.className = "project-tab-panel evaluation-flow-panel";
  panel.id = "project-flow-panel";
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", "project-flow-tab");

  const intro = document.createElement("p");
  intro.className = "evaluation-flow-intro";
  intro.textContent = "工程需求與可工作時間分開計算；容量不足會優先判定交付不可行，再用進度壓力補充趨勢。";

  const remainingCapacity = Math.max(
    0,
    deadline.total_capacity_minutes - deadline.elapsed_capacity_minutes,
  );
  const capacityBalance = remainingCapacity - remaining.minutes;
  const lanes = document.createElement("div");
  lanes.className = "evaluation-flow-lanes";

  const engineeringLane = document.createElement("section");
  engineeringLane.className = "evaluation-flow-lane";
  engineeringLane.setAttribute("aria-label", "工程估算路徑");
  const engineeringArrow = document.createElement("span");
  engineeringArrow.className = "evaluation-arrow";
  engineeringArrow.setAttribute("aria-hidden", "true");
  engineeringArrow.textContent = "→";
  engineeringLane.append(
    evaluationNode(
      "工程估算來源",
      "公式／AI／歷史／人工／預設",
      "預設 8 hr 只在缺少資料時使用",
    ),
    engineeringArrow,
    evaluationNode(
      "預估未完成工時",
      hours(remaining.minutes),
      Number.isFinite(summary.remaining_estimated_minutes)
        ? "直接加總未完成項目的校準後估算"
        : "舊版資料：工程總估算 × 未完成比例",
      "evaluation-node-result",
    ),
  );

  const capacityLane = document.createElement("section");
  capacityLane.className = "evaluation-flow-lane";
  capacityLane.setAttribute("aria-label", "工作容量路徑");
  const capacityArrow = document.createElement("span");
  capacityArrow.className = "evaluation-arrow";
  capacityArrow.setAttribute("aria-hidden", "true");
  capacityArrow.textContent = "→";
  capacityLane.append(
    evaluationNode(
      "工作容量設定",
      "每日分配／工作日／請假例外",
      "交付日前逐日加總可工作容量",
    ),
    capacityArrow,
    evaluationNode(
      "交付前剩餘容量",
      hours(remainingCapacity),
      "總容量 − 已消耗容量",
      "evaluation-node-result",
    ),
  );
  lanes.append(engineeringLane, capacityLane);

  const merge = document.createElement("div");
  merge.className = "evaluation-merge";
  const mergeArrow = document.createElement("span");
  mergeArrow.className = "evaluation-merge-arrow";
  mergeArrow.setAttribute("aria-hidden", "true");
  mergeArrow.textContent = "↓";
  const balanceLabel = capacityBalance >= 0 ? "容量餘裕" : "容量缺口";
  const balance = evaluationNode(
    "需求與容量比較",
    `${balanceLabel} ${hours(Math.abs(capacityBalance))}`,
    capacityBalance < 0
      ? "容量不足會直接改為紅燈"
      : "使用超過 80% 剩餘容量時至少為黃燈",
    capacityBalance >= 0 ? "evaluation-node-balance" : "evaluation-node-shortage",
  );
  merge.append(mergeArrow, balance);

  const riskRow = document.createElement("div");
  riskRow.className = "evaluation-risk-row";
  const riskArrow = document.createElement("span");
  riskArrow.className = "evaluation-arrow";
  riskArrow.setAttribute("aria-hidden", "true");
  riskArrow.textContent = "→";
  riskRow.append(
    evaluationNode(
      "現行進度趨勢",
      `工作 ${percent(deadline.work_progress_ratio)}／時間 ${percent(deadline.time_progress_ratio)}`,
      `進度壓力 ${pressureLabel(deadline)}`,
    ),
    riskArrow,
    evaluationNode(
      "目前風險評估",
      publicRiskLabel(deadline, urgency),
      "deterministic-capacity-feasibility v0.3",
      `evaluation-node-risk ${urgency.className}`,
    ),
  );

  const note = document.createElement("p");
  note.className = "evaluation-flow-note";
  note.textContent = "v0.3 先檢查剩餘工程需求與真實工作容量：缺口為紅燈、容量使用率超過 80% 至少為黃燈；容量足夠時再採進度壓力判斷。";

  panel.append(intro, lanes, merge, riskRow, note);
  return panel;
}

function showUndatedProjectDetail() {
  const { summary } = analysis;
  const workProgressRatio = currentProgressSummary().ratio;
  const remaining = remainingWorkload(summary, workProgressRatio);
  const content = document.createElement("div");
  const toolbar = document.createElement("div");
  toolbar.className = "item-detail-toolbar progress-report-toolbar";
  const summaryLabel = document.createElement("span");
  summaryLabel.className = "progress-report-caption";
  summaryLabel.textContent = "估算摘要";
  const toggle = document.createElement("button");
  toggle.className = "item-detail-toggle";
  toggle.type = "button";
  toggle.textContent = timeDetailsExpanded ? "收合詳細資訊" : "詳細資訊";
  toggle.setAttribute("aria-expanded", String(timeDetailsExpanded));
  toolbar.append(summaryLabel, toggle);

  const overview = document.createElement("section");
  overview.className = "progress-report-overview";
  const overviewGrid = document.createElement("div");
  overviewGrid.className = "progress-report-grid";
  overviewGrid.append(
    reportSummaryField("工程總預估工時", hours(summary.total_estimated_minutes)),
    reportSummaryField("預估未完成工時", hours(remaining.minutes)),
    reportSummaryField("交付日期", "交付日未定"),
  );
  const lastReport = document.createElement("p");
  lastReport.className = "progress-report-updated";
  const reportTimestamp = analysis.inputs?.task_state_updated_at ?? analysis.as_of;
  lastReport.textContent = `最後估算：${analysisTime(reportTimestamp)}`;
  overview.append(overviewGrid, lastReport);

  const technical = document.createElement("section");
  technical.className = "project-detail-tabs undated-engineering-panel";
  technical.hidden = !timeDetailsExpanded;

  const tabList = document.createElement("div");
  tabList.className = "project-tab-list";
  tabList.setAttribute("role", "tablist");
  tabList.setAttribute("aria-label", "進度報告詳細資訊");
  const flowTab = document.createElement("button");
  flowTab.id = "project-flow-tab";
  flowTab.className = "project-tab";
  flowTab.type = "button";
  flowTab.disabled = true;
  flowTab.setAttribute("role", "tab");
  flowTab.setAttribute("aria-selected", "false");
  flowTab.setAttribute("aria-disabled", "true");
  flowTab.title = "需要交付日才能評估流程";
  flowTab.textContent = "評估流程";
  const engineeringTab = document.createElement("button");
  engineeringTab.id = "project-engineering-tab";
  engineeringTab.className = "project-tab";
  engineeringTab.type = "button";
  engineeringTab.setAttribute("role", "tab");
  engineeringTab.setAttribute("aria-selected", "true");
  engineeringTab.setAttribute("aria-controls", "project-engineering-panel");
  engineeringTab.textContent = "工程估算";
  const capacityTab = document.createElement("button");
  capacityTab.id = "project-capacity-tab";
  capacityTab.className = "project-tab";
  capacityTab.type = "button";
  capacityTab.disabled = true;
  capacityTab.setAttribute("role", "tab");
  capacityTab.setAttribute("aria-selected", "false");
  capacityTab.setAttribute("aria-disabled", "true");
  capacityTab.title = "需要交付日才能計算交付前工作容量";
  capacityTab.textContent = "工作容量";
  tabList.append(flowTab, engineeringTab, capacityTab);

  const engineeringPanel = document.createElement("section");
  engineeringPanel.className = "project-tab-panel";
  engineeringPanel.id = "project-engineering-panel";
  engineeringPanel.setAttribute("role", "tabpanel");
  engineeringPanel.setAttribute("aria-labelledby", "project-engineering-tab");
  const title = document.createElement("h3");
  title.className = "detail-heading";
  title.textContent = "工程估算";
  const grid = document.createElement("div");
  grid.className = "metric-grid";
  grid.append(
    metric("工程總預估工時", hours(summary.total_estimated_minutes)),
    metric("預估未完成工時", hours(remaining.minutes)),
    metric("工作進度", percent(workProgressRatio)),
    metric("整體信心", confidenceMeta[summary.overall_confidence] ?? summary.overall_confidence),
    metric("執行校準", `${summary.execution_calibration.factor.toFixed(1)} ×`),
    metric("交付日期", "未設定"),
  );

  const note = document.createElement("section");
  note.className = "explanation-card undated-note";
  const noteTitle = document.createElement("h3");
  noteTitle.textContent = deadlineDiagnostic ? "期限資料已忽略" : "期限分析未啟用";
  const noteText = document.createElement("p");
  noteText.textContent = deadlineDiagnostic
    ? `${deadlineDiagnostic}。工程估算仍然有效，因此保留工時並停用期限與風險功能。`
    : "尚未設定交付日期；目前只顯示工程估算，不計算倒數、時間進度、工作容量或風險燈號。";
  note.append(noteTitle, noteText);

  const composition = document.createElement("section");
  composition.className = "composition";
  const compositionTitle = document.createElement("h3");
  compositionTitle.textContent = "估算組成";
  const list = document.createElement("div");
  list.className = "source-list";
  const compositionRows = [
    ["混合估算", summary.estimate_composition.mixed_minutes, "人工參數＋AI 分析＋固定公式"],
    ["人工直接估算", summary.estimate_composition.manual_minutes, "由使用者輸入最後估值"],
    ["AI 估算", summary.estimate_composition.ai_minutes, "AI 工程拆解與固定公式"],
    ["預設", summary.estimate_composition.default_minutes, "缺少足夠工程資料"],
  ];
  compositionRows
    .filter(([, minutes]) => minutes > 0)
    .forEach(([label, minutes, description]) => {
      list.append(sourceRow(label, hours(minutes), description));
    });
  composition.append(compositionTitle, list);
  engineeringPanel.append(title, grid, note, composition);
  technical.append(tabList, engineeringPanel);

  toggle.addEventListener("click", () => {
    timeDetailsExpanded = !timeDetailsExpanded;
    toggle.setAttribute("aria-expanded", String(timeDetailsExpanded));
    toggle.textContent = timeDetailsExpanded ? "收合詳細資訊" : "詳細資訊";
    technical.hidden = !timeDetailsExpanded;
  });
  content.append(toolbar, overview, technical);
  openDialog("時間參考", "進度報告", content);
}

function showProjectDetail() {
  const { summary } = analysis;
  if (!summary.deadline) {
    showUndatedProjectDetail();
    return;
  }
  const deadline = summary.deadline;
  const urgency = urgencyMeta[deadline.urgency] ?? urgencyMeta.at_risk;
  const content = document.createElement("div");
  const toolbar = document.createElement("div");
  toolbar.className = "item-detail-toolbar progress-report-toolbar";
  const summaryLabel = document.createElement("span");
  summaryLabel.className = "progress-report-caption";
  summaryLabel.textContent = "即時摘要";
  const toggle = document.createElement("button");
  toggle.className = "item-detail-toggle";
  toggle.type = "button";
  toggle.textContent = timeDetailsExpanded ? "收合詳細資訊" : "詳細資訊";
  toggle.setAttribute("aria-expanded", String(timeDetailsExpanded));
  toolbar.append(summaryLabel, toggle);

  const remaining = remainingWorkload(summary, deadline.work_progress_ratio);
  const overview = document.createElement("section");
  overview.className = "progress-report-overview";
  const overviewGrid = document.createElement("div");
  overviewGrid.className = "progress-report-grid";
  overviewGrid.append(
    reportSummaryField("距離交付", deliveryCountdown(deadline)),
    reportSummaryField("預估未完成工時", hours(remaining.minutes)),
    reportSummaryField("風險評估", publicRiskLabel(deadline, urgency), urgency),
  );
  const lastReport = document.createElement("p");
  lastReport.className = "progress-report-updated";
  const reportTimestamp = analysis.inputs?.task_state_updated_at ?? analysis.as_of;
  lastReport.textContent = `最後回報：${analysisTime(reportTimestamp)}`;
  overview.append(overviewGrid, lastReport);

  const technical = document.createElement("section");
  technical.className = "project-detail-tabs";
  technical.hidden = !timeDetailsExpanded;

  const tabList = document.createElement("div");
  tabList.className = "project-tab-list";
  tabList.setAttribute("role", "tablist");
  tabList.setAttribute("aria-label", "進度報告詳細資訊");
  const flowTab = document.createElement("button");
  flowTab.id = "project-flow-tab";
  flowTab.className = "project-tab";
  flowTab.type = "button";
  flowTab.setAttribute("role", "tab");
  flowTab.setAttribute("aria-controls", "project-flow-panel");
  flowTab.textContent = "評估流程";
  const engineeringTab = document.createElement("button");
  engineeringTab.id = "project-engineering-tab";
  engineeringTab.className = "project-tab";
  engineeringTab.type = "button";
  engineeringTab.setAttribute("role", "tab");
  engineeringTab.setAttribute("aria-controls", "project-engineering-panel");
  engineeringTab.textContent = "工程估算";
  const capacityTab = document.createElement("button");
  capacityTab.id = "project-capacity-tab";
  capacityTab.className = "project-tab";
  capacityTab.type = "button";
  capacityTab.setAttribute("role", "tab");
  capacityTab.setAttribute("aria-controls", "project-capacity-panel");
  capacityTab.textContent = "工作容量";
  tabList.append(flowTab, engineeringTab, capacityTab);

  const engineeringPanel = document.createElement("section");
  engineeringPanel.className = "project-tab-panel";
  engineeringPanel.id = "project-engineering-panel";
  engineeringPanel.setAttribute("role", "tabpanel");
  engineeringPanel.setAttribute("aria-labelledby", "project-engineering-tab");
  const grid = document.createElement("div");
  grid.className = "metric-grid";
  grid.append(
    metric("工程總預估工時", hours(summary.total_estimated_minutes)),
    metric("預估未完成工時", hours(remaining.minutes)),
    metric("時間進度", percent(deadline.time_progress_ratio)),
    metric("工作進度", percent(deadline.work_progress_ratio)),
    metric("進度壓力", pressureLabel(deadline)),
    metric("目前判定", urgency.label),
    metric("本次風險計算", analysisTime(deadline.evaluated_at)),
  );

  const explanation = document.createElement("section");
  explanation.className = "explanation-card";
  const explanationTitle = document.createElement("h3");
  explanationTitle.className = "formula-heading";
  const formulaLamp = document.createElement("span");
  formulaLamp.className = `formula-lamp ${urgency.className}`;
  formulaLamp.setAttribute("aria-hidden", "true");
  explanationTitle.append(formulaLamp, "風險評估公式：");
  const explanationText = document.createElement("p");
  const explanationResult = deadlineExplanation(deadline, urgency);
  explanationText.textContent = explanationResult.text;
  const formula = document.createElement("code");
  formula.className = "formula";
  formula.textContent = explanationResult.formula;
  explanation.append(explanationTitle, explanationText, formula);

  const calibration = document.createElement("section");
  calibration.className = "explanation-card";
  const calibrationTitle = document.createElement("h3");
  calibrationTitle.textContent = "執行校準";
  const calibrationText = document.createElement("p");
  calibrationText.textContent = `目前因子 ${summary.execution_calibration.factor.toFixed(1)}，有效樣本 ${summary.execution_calibration.effective_sample_count}。沒有完成樣本，所以維持 100% 中性基準／低信心。`;
  calibration.append(calibrationTitle, calibrationText);

  const composition = document.createElement("section");
  composition.className = "composition";
  const compositionTitle = document.createElement("h3");
  compositionTitle.textContent = "估算組成";
  const list = document.createElement("div");
  list.className = "source-list";
  list.append(
    sourceRow("混合估算", hours(summary.estimate_composition.mixed_minutes), "人工參數＋AI 分析＋固定公式"),
    sourceRow("人工直接估算", hours(summary.estimate_composition.manual_minutes), "由使用者輸入最後估值"),
    sourceRow("預設", hours(summary.estimate_composition.default_minutes), "缺少足夠工程資料"),
  );
  if (summary.estimate_composition.ai_minutes > 0) {
    list.append(sourceRow("AI 估算", hours(summary.estimate_composition.ai_minutes), "沒有人工參數的 AI 分析"));
  }
  composition.append(compositionTitle, list);
  engineeringPanel.append(grid, explanation, calibration, composition);

  const flowPanel = createEvaluationFlowPanel(summary, deadline, urgency, remaining);
  const capacityPanel = createCapacityPanel(summary, deadline);
  const tabs = [
    { name: "flow", button: flowTab, panel: flowPanel },
    { name: "engineering", button: engineeringTab, panel: engineeringPanel },
    { name: "capacity", button: capacityTab, panel: capacityPanel },
  ];
  const activateTab = (name, { focus = false } = {}) => {
    projectDetailTab = name;
    tabs.forEach((tab) => {
      const active = tab.name === name;
      tab.button.setAttribute("aria-selected", String(active));
      tab.button.tabIndex = active ? 0 : -1;
      tab.panel.hidden = !active;
      if (active && focus) tab.button.focus();
    });
  };
  tabs.forEach((tab, index) => {
    tab.button.addEventListener("click", () => activateTab(tab.name));
    tab.button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + tabs.length) % tabs.length;
      activateTab(tabs[nextIndex].name, { focus: true });
    });
  });
  activateTab(projectDetailTab);
  technical.append(tabList, flowPanel, engineeringPanel, capacityPanel);
  toggle.addEventListener("click", () => {
    timeDetailsExpanded = !timeDetailsExpanded;
    toggle.setAttribute("aria-expanded", String(timeDetailsExpanded));
    toggle.textContent = timeDetailsExpanded ? "收合詳細資訊" : "詳細資訊";
    technical.hidden = !timeDetailsExpanded;
  });
  content.append(toolbar, overview, technical);
  openDialog("時間參考", "進度報告", content);
}

function createItemEditor(item) {
  const form = document.createElement("form");
  form.className = "item-editor";
  const existingDraft = estimateDrafts.get(item.item_id);
  const draft = existingDraft ?? {
    inputs: Object.fromEntries(
      item.inputs
        .filter((input) => input.origin === "human")
        .map((input) => [input.name, String(input.value)]),
    ),
    human_note: item.human_note ?? "",
  };

  const heading = document.createElement("div");
  heading.className = "item-editor-heading";
  const title = document.createElement("h3");
  title.textContent = "編輯人工輸入";
  const note = document.createElement("span");
  note.textContent = "草稿暫存在記憶體；重新計算只預覽，全域儲存才寫入";
  heading.append(title, note);

  const fields = document.createElement("div");
  fields.className = "item-editor-fields";
  item.inputs
    .filter((input) => input.origin === "human")
    .forEach((input) => {
      const field = document.createElement("label");
      field.className = "item-editor-field";
      const label = document.createElement("span");
      label.textContent = inputLabelMeta[input.name] ?? input.name;
      const control = document.createElement("span");
      control.className = "item-editor-control";
      const value = document.createElement("input");
      value.type = "number";
      value.min = "0.1";
      value.step = "0.1";
      value.required = true;
      value.name = input.name;
      value.value = draft.inputs[input.name] ?? String(input.value);
      const unit = document.createElement("span");
      unit.textContent = input.unit ?? "";
      control.append(value, unit);
      field.append(label, control);
      fields.append(field);
    });

  const reasonField = document.createElement("label");
  reasonField.className = "item-editor-reason";
  const reasonLabel = document.createElement("span");
  reasonLabel.textContent = "人工理由";
  const reason = document.createElement("textarea");
  reason.name = "human_note";
  reason.rows = 3;
  reason.maxLength = 1000;
  reason.value = draft.human_note;
  reasonField.append(reasonLabel, reason);

  const error = document.createElement("p");
  error.className = "item-editor-error";
  error.hidden = !(timeDraftError?.kind === "estimate"
    && timeDraftError.itemId === item.item_id);
  error.textContent = error.hidden ? "" : timeDraftError.message;

  const actions = document.createElement("div");
  actions.className = "item-editor-actions";
  const preview = document.createElement("button");
  preview.className = "item-editor-preview";
  preview.type = "button";
  preview.textContent = "重新計算";
  preview.addEventListener("click", () => previewTimeDrafts({
    kind: "estimate",
    itemId: item.item_id,
  }));
  actions.append(preview);

  form.append(heading, fields, reasonField, error, actions);
  form.addEventListener("input", () => {
    const values = new FormData(form);
    estimateDrafts.set(item.item_id, {
      inputs: Object.fromEntries(
        item.inputs
          .filter((input) => input.origin === "human")
          .map((input) => [input.name, String(values.get(input.name) ?? "")]),
      ),
      human_note: String(values.get("human_note") ?? ""),
    });
    if (
      timeDraftError?.kind === "estimate"
      && timeDraftError.itemId === item.item_id
    ) {
      timeDraftError = null;
    }
    error.hidden = true;
    updateTimeInputDirty();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
  return form;
}

function showItemDetail(item) {
  const content = document.createElement("div");
  const toolbar = document.createElement("div");
  toolbar.className = "item-detail-toolbar";
  const confidence = document.createElement("span");
  confidence.className = `confidence-badge confidence-${item.confidence}`;
  confidence.textContent = confidenceMeta[item.confidence] ?? item.confidence;
  const toggle = document.createElement("button");
  toggle.className = "item-detail-toggle";
  toggle.type = "button";
  toggle.textContent = timeDetailsExpanded ? "收合詳細資訊" : "詳細資訊";
  toggle.setAttribute("aria-expanded", String(timeDetailsExpanded));
  const toolbarActions = document.createElement("div");
  toolbarActions.className = "item-detail-actions";
  const hasHumanInputs = item.inputs.some((input) => input.origin === "human");
  toolbarActions.append(toggle);
  toolbar.append(confidence, toolbarActions);

  const estimate = document.createElement("div");
  estimate.className = "estimate-readout";
  const estimateMeta = document.createElement("span");
  estimateMeta.className = "estimate-meta";
  const estimateLabel = document.createElement("span");
  estimateLabel.textContent = "預估工時";
  estimateMeta.append(estimateLabel);
  item.contributors
    .map((contributor) => ({
      contributor,
      meta: contributorMeta[contributor.kind],
    }))
    .filter(({ meta }) => meta?.surface)
    .forEach(({ meta }) => {
      const badge = document.createElement("span");
      badge.className = `estimate-source-badge ${meta.className}`;
      badge.textContent = meta.label;
      estimateMeta.append(badge);
    });
  if (estimateMeta.children.length === 1) {
    const badge = document.createElement("span");
    badge.className = "estimate-source-badge source-default";
    badge.textContent = item.mode;
    estimateMeta.append(badge);
  }
  const estimateValue = document.createElement("strong");
  estimateValue.textContent = `${item.display_hours} hr`;
  estimate.append(estimateMeta, estimateValue);

  const explanation = document.createElement("section");
  explanation.className = "explanation-card item-rationale";
  const explanationHeading = document.createElement("div");
  explanationHeading.className = "rationale-heading";
  const title = document.createElement("h3");
  title.textContent = "估算依據";
  const copy = document.createElement("p");
  copy.textContent = item.explanation;
  explanationHeading.append(title);
  explanation.append(explanationHeading, copy);

  const technical = document.createElement("section");
  technical.className = "item-technical-details";
  technical.hidden = !timeDetailsExpanded;
  const technicalGrid = document.createElement("div");
  technicalGrid.className = "technical-grid";
  technicalGrid.append(metric("工作項目 ID", item.item_id));
  technicalGrid.append(metric("估算版本 ID", item.estimate_id));
  if (item.supersedes_estimate_id) {
    technicalGrid.append(metric("取代估算 ID", item.supersedes_estimate_id));
  }
  technicalGrid.append(metric(
    "估算範圍",
    item.low_minutes && item.high_minutes
      ? `${hours(item.low_minutes)} – ${hours(item.high_minutes)}`
      : "未提供範圍",
  ));
  technicalGrid.append(metric("人工確認", item.human_confirmed ? "是" : "否"));

  const provenance = document.createElement("div");
  provenance.className = "technical-note";
  const provenanceTitle = document.createElement("h3");
  provenanceTitle.textContent = "估算參與";
  const provenanceList = document.createElement("div");
  provenanceList.className = "provenance-list";
  item.contributors.forEach((contributor) => {
    const meta = contributorMeta[contributor.kind] ?? {
      label: contributor.kind,
      className: "source-default",
    };
    const row = document.createElement("div");
    row.className = "provenance-row";
    const badge = document.createElement("span");
    badge.className = `estimate-source-badge ${meta.className}`;
    badge.textContent = meta.label;
    const summary = document.createElement("p");
    summary.textContent = contributor.summary;
    row.append(badge, summary);
    provenanceList.append(row);
  });
  provenance.append(provenanceTitle, provenanceList);

  const detailSections = [provenance];

  if (item.inputs?.length) {
    const inputs = document.createElement("div");
    inputs.className = "technical-note";
    const inputsTitle = document.createElement("h3");
    inputsTitle.textContent = "輸入參數";
    const inputList = document.createElement("div");
    inputList.className = "source-list";
    item.inputs.forEach((input) => {
      const origin = inputOriginMeta[input.origin] ?? input.origin;
      const value = `${input.value}${input.unit ? ` ${input.unit}` : ""}`;
      inputList.append(sourceRow(input.name, value, input.note ? `${origin}；${input.note}` : origin));
    });
    inputs.append(inputsTitle, inputList);
    detailSections.push(inputs);
  }

  if (item.human_note) {
    const humanReason = document.createElement("div");
    humanReason.className = "technical-note";
    const humanReasonTitle = document.createElement("h3");
    humanReasonTitle.textContent = "人工理由";
    const humanReasonText = document.createElement("p");
    humanReasonText.textContent = item.human_note;
    humanReason.append(humanReasonTitle, humanReasonText);
    detailSections.push(humanReason);
  }

  if (item.analysis_method) {
    const method = document.createElement("div");
    method.className = "technical-note";
    const methodTitle = document.createElement("h3");
    methodTitle.textContent = "分析方法";
    const methodText = document.createElement("p");
    const performer = performerMeta[item.analysis_method.performed_by] ?? item.analysis_method.performed_by;
    methodText.textContent = `${performer} · ${item.analysis_method.name} v${item.analysis_method.version}：${item.analysis_method.explanation}`;
    method.append(methodTitle, methodText);
    detailSections.push(method);
  }

  if (item.calculation) {
    const calculation = document.createElement("div");
    calculation.className = "technical-note";
    const calculationTitle = document.createElement("h3");
    calculationTitle.textContent = "計算公式";
    const calculationText = document.createElement("p");
    calculationText.textContent = item.calculation.explanation;
    const formula = document.createElement("code");
    formula.className = "technical-reference";
    formula.textContent = `${item.calculation.algorithm_id} · ${item.calculation.formula} · v${item.calculation.version}`;
    calculation.append(calculationTitle, calculationText, formula);
    detailSections.push(calculation);
  }

  if (item.reference) {
    const evidence = document.createElement("div");
    evidence.className = "technical-note";
    const evidenceTitle = document.createElement("h3");
    evidenceTitle.textContent = "資料依據";
    const reference = document.createElement("code");
    reference.className = "technical-reference";
    reference.textContent = item.reference;
    evidence.append(evidenceTitle, reference);
    detailSections.push(evidence);
  }

  technical.append(technicalGrid, ...detailSections);
  toggle.addEventListener("click", () => {
    timeDetailsExpanded = !timeDetailsExpanded;
    toggle.setAttribute("aria-expanded", String(timeDetailsExpanded));
    toggle.textContent = timeDetailsExpanded ? "收合詳細資訊" : "詳細資訊";
    technical.hidden = !timeDetailsExpanded;
  });

  content.append(toolbar, estimate);
  if (globalEditingEnabled() && hasHumanInputs) content.append(createItemEditor(item));
  content.append(explanation, technical);
  openDialog("子項目工時", labels[item.item_id] ?? item.item_id, content);
}

function createTaskItemStatus(item) {
  const meta = itemStatusMeta[item.status] ?? itemStatusMeta.pending;
  const status = document.createElement("span");
  status.className = `time-work-status status-${meta.className}`;
  status.textContent = meta.label;
  return status;
}

function createPriorityBadge(priority, className) {
  return editorSurface.createPriorityBadge(priority, className)
    ?? document.createDocumentFragment();
}

function createPrioritySelect(value, ariaLabel, className) {
  return editorSurface.createPrioritySelect(value, { className, ariaLabel });
}

function createTaskItemPrioritySelect(item, ariaLabel = `設定「${item.title}」的優先級`) {
  return createPrioritySelect(
    item.priority,
    ariaLabel,
    "task-item-priority-select",
  );
}

function renderTaskPriorityControls() {
  elements.taskCards.forEach((card) => {
    const definition = taskDefinitionFor(card.dataset.taskId);
    const statusLine = card.querySelector(".time-task-status-line");
    if (!definition || !statusLine) return;
    card.dataset.priority = String(
      taskEditingModel.normalizePriority(definition.priority, DEFAULT_PRIORITY),
    );
    statusLine.querySelector(".task-priority-control")?.remove();
    if (globalEditingEnabled()) {
      const select = createPrioritySelect(
        definition.priority,
        `設定「${definition.title}」任務卡優先級`,
        "task-priority-select task-priority-control",
      );
      select.addEventListener("change", () => {
        applyDemoEditorCommand({
          type: "set-task-field",
          taskId: definition.id,
          field: "priority",
          value: taskEditingModel.normalizePriority(
            select.value,
            DEFAULT_PRIORITY,
          ),
        });
        renderTaskItems();
      });
      statusLine.append(select);
      return;
    }
    const badge = createPriorityBadge(
      definition.priority,
      "task-priority-badge task-priority-control",
    );
    statusLine.append(badge);
  });
}

function deleteTaskItem(taskId, item) {
  const items = taskItemsFor(taskId);
  const index = items.findIndex((candidate) => candidate.id === item.id);
  if (index < 0) return;
  lastDeletedTaskItem = { taskId, item: { ...items[index] }, index };
  const field = ["done", "success"].includes(item.status)
    ? "completed_items"
    : "pending_items";
  applyDemoEditorCommand({
    type: "delete-item",
    taskId,
    field,
    itemId: item.id,
  });
  renderTaskItems();
}

function taskItemField(item) {
  return ["done", "success"].includes(item.status)
    ? "completed_items"
    : "pending_items";
}

function createDemoItemRow(taskId, taskItem, estimate = null) {
  const time = document.createElement(estimate ? "button" : "span");
  if (estimate) {
    time.className = "time-estimate-button";
    time.type = "button";
    time.textContent = `${estimate.display_hours} hr`;
    time.setAttribute(
      "aria-label",
      `${taskItem.title}，約 ${estimate.display_hours} 小時，查看估算依據`,
    );
    time.addEventListener("click", () => showItemDetail(estimate));
  } else {
    time.className = "time-estimate-missing";
    time.textContent = "待估";
  }

  return editorSurface.createItemRow(taskItem, {
    editing: globalEditingEnabled(),
    showPriority: true,
    contentNodes: [time],
    trailingNodes: [createTaskItemStatus(taskItem)],
    inputDataset: { itemId: taskItem.id, taskId },
    titleAriaLabel: "子項目描述",
    priorityAriaLabel: `設定「${taskItem.title}」的優先級`,
    deleteAriaLabel: `刪除子項目：${taskItem.title}`,
    onTitleInput: (value) => {
      applyDemoEditorCommand({
        type: "set-item-field",
        taskId,
        field: taskItemField(taskItem),
        itemId: taskItem.id,
        property: "title",
        value,
      });
    },
    onDelete: () => deleteTaskItem(taskId, taskItem),
    onPriorityChange: (priority) => {
      applyDemoEditorCommand({
        type: "set-item-field",
        taskId,
        field: taskItemField(taskItem),
        itemId: taskItem.id,
        property: "priority",
        value: priority,
      });
      renderTaskItems();
    },
  }).row;
}

function validateTaskItemDrafts() {
  let firstInvalidInput = null;

  document.querySelectorAll("#task-list .task-summary-direct-input").forEach((input) => {
    const result = taskEditingModel.normalizeTaskDescription(input.value, 1000);
    if (!result.ok) {
      input.setCustomValidity(result.cancelled ? "任務描述不可為空白。" : result.error);
      firstInvalidInput ??= input;
      return;
    }
    input.setCustomValidity("");
    applyDemoEditorCommand({
      type: "set-task-field",
      taskId: input.dataset.taskId,
      field: "summary",
      value: result.value,
    });
  });

  document.querySelectorAll("#task-list .task-item-title-input").forEach((input) => {
    const item = taskItemsFor(input.dataset.taskId)
      .find((candidate) => candidate.id === input.dataset.itemId);
    if (!item) return;
    const result = taskEditingModel.normalizeTaskDescription(input.value, 300);
    if (!result.ok) {
      input.setCustomValidity(result.cancelled ? "子項目名稱不可為空白。" : result.error);
      firstInvalidInput ??= input;
      return;
    }
    input.setCustomValidity("");
    applyDemoEditorCommand({
      type: "set-item-field",
      taskId: input.dataset.taskId,
      field: ["done", "success"].includes(item.status)
        ? "completed_items"
        : "pending_items",
      itemId: item.id,
      property: "title",
      value: result.value,
    });
  });

  if (firstInvalidInput) {
    firstInvalidInput.focus();
    firstInvalidInput.reportValidity();
    return false;
  }

  return true;
}

function prepareEstimateDrafts() {
  return [...estimateDrafts.entries()].map(([itemId, draft]) => {
    try {
      const item = analysis?.tasks
        ?.flatMap((task) => task.items)
        .find((candidate) => candidate.item_id === itemId);
      if (!item) throw new Error(`找不到待重新計算的估算項目：${itemId}`);
      const nextInputs = item.inputs.map((input) => ({
        ...input,
        value: input.origin === "human" && draft.inputs[input.name] !== undefined
          ? Number(draft.inputs[input.name])
          : input.value,
      }));
      const nextHumanNote = draft.human_note.trim();
      const result = calculateEstimate({
        ...item,
        inputs: nextInputs,
        human_note: nextHumanNote,
      });
      return { item, nextInputs, nextHumanNote, result };
    } catch (reason) {
      const error = reason instanceof Error ? reason : new Error(String(reason));
      error.itemId = itemId;
      throw error;
    }
  });
}

function revealTimeDraftError(error) {
  timeDraftError = error;
  if (error.kind === "capacity" && analysis?.summary?.deadline) {
    timeDetailsExpanded = true;
    projectDetailTab = "capacity";
    showProjectDetail();
    return;
  }
  if (error.kind === "estimate") {
    const item = analysis?.tasks
      ?.flatMap((task) => task.items)
      .find((candidate) => candidate.item_id === error.itemId);
    if (item) showItemDetail(item);
    if (item) return;
  }
  elements.globalEditSaveButton.setCustomValidity(error.message);
  elements.globalEditSaveButton.reportValidity();
  elements.globalEditSaveButton.setCustomValidity("");
}

function previewTimeDrafts(target) {
  let preparedEstimates;
  let preparedCapacity = null;
  try {
    preparedEstimates = prepareEstimateDrafts();
  } catch (reason) {
    revealTimeDraftError({
      kind: "estimate",
      itemId: reason?.itemId ?? target.itemId,
      message: reason instanceof Error ? reason.message : String(reason),
    });
    return;
  }
  try {
    if (capacityDraft) preparedCapacity = capacityProfileFromDraft(capacityDraft);
  } catch (reason) {
    revealTimeDraftError({
      kind: "capacity",
      message: reason instanceof Error ? reason.message : String(reason),
    });
    return;
  }

  preparedEstimates.forEach((change) => {
    change.item.inputs = change.nextInputs;
    change.item.human_note = change.nextHumanNote;
    applyEstimateResult(change.item, change.result, { createVersion: false });
  });
  if (preparedCapacity) {
    if (analysis.summary.deadline) {
      applyCapacityProfile(analysis, preparedCapacity);
    } else {
      analysis.summary.nominal_daily_capacity_minutes =
        preparedCapacity.capacity_minutes_per_executor_day;
    }
  }
  recomputeDerivedTotals(analysis);
  if (analysis.summary.deadline) updateRuntimeDeadline(analysis);
  render(analysis);
  renderGlobalEditSave();

  if (target.kind === "capacity" && analysis.summary.deadline) {
    timeDetailsExpanded = true;
    projectDetailTab = "capacity";
    showProjectDetail();
    return;
  }
  const item = analysis.tasks
    .flatMap((task) => task.items)
    .find((candidate) => candidate.item_id === target.itemId);
  if (item) showItemDetail(item);
}

function saveGlobalDrafts() {
  if (!validateTaskItemDrafts()) return;

  let preparedEstimates;
  let preparedCapacity = null;
  try {
    preparedEstimates = prepareEstimateDrafts();
  } catch (reason) {
    revealTimeDraftError({
      kind: "estimate",
      itemId: reason?.itemId ?? [...estimateDrafts.keys()][0],
      message: reason instanceof Error ? reason.message : String(reason),
    });
    return;
  }
  try {
    if (capacityDraft) preparedCapacity = capacityProfileFromDraft(capacityDraft);
  } catch (reason) {
    revealTimeDraftError({
      kind: "capacity",
      message: reason instanceof Error ? reason.message : String(reason),
    });
    return;
  }

  syncTaskLabels();
  updateTaskStructureChanged();
  const stagedOverrides = stageTaskContentOverrides(readDemoOverrides());
  preparedEstimates.forEach((change) => {
    stagedOverrides[change.item.item_id] = {
      inputs: Object.fromEntries(
        change.nextInputs
          .filter((input) => input.origin === "human")
          .map((input) => [input.name, input.value]),
      ),
      human_note: change.nextHumanNote,
    };
  });
  const capacityUpdatedAt = preparedCapacity ? new Date().toISOString() : null;
  if (preparedCapacity) {
    stagedOverrides.__capacity_profile = {
      profile: cloneValue(preparedCapacity),
      updated_at: capacityUpdatedAt,
    };
  }
  if (!writeDemoOverrides(stagedOverrides)) {
    elements.globalEditSaveButton.setCustomValidity("儲存失敗；草稿仍保留，沒有部分提交。");
    elements.globalEditSaveButton.reportValidity();
    elements.globalEditSaveButton.setCustomValidity("");
    return;
  }
  commitPersistedTaskContent();

  preparedEstimates.forEach((change) => {
    change.item.inputs = change.nextInputs;
    change.item.human_note = change.nextHumanNote;
    applyEstimateResult(change.item, change.result);
  });
  if (preparedCapacity) {
    if (analysis.summary.deadline) {
      applyCapacityProfile(analysis, preparedCapacity, capacityUpdatedAt);
    } else {
      analysis.summary.nominal_daily_capacity_minutes =
        preparedCapacity.capacity_minutes_per_executor_day;
      if (analysis.inputs) analysis.inputs.config_updated_at = capacityUpdatedAt;
    }
  }

  const timeChanged = preparedEstimates.length > 0 || preparedCapacity !== null;
  estimateDrafts.clear();
  capacityDraft = null;
  timeDraftError = null;
  updateTimeInputDirty();

  if (timeChanged) {
    recomputeAnalysis(analysis, preparedCapacity ? "config" : "estimates");
    if (preparedCapacity && preparedEstimates.length && analysis.inputs) {
      analysis.inputs.estimates_updated_at = analysis.as_of;
    }
    if (analysis.summary.deadline) updateRuntimeDeadline(analysis);
    if (elements.dialog.open) elements.dialog.close();
    render(analysis);
  }
  renderTaskSummaryControls();
  renderTaskItems();
  renderGlobalEditSave();
}

function createDeletedTaskItemNotice(taskId) {
  const row = document.createElement("li");
  row.className = "task-item-undo-row";
  const copy = document.createElement("span");
  copy.textContent = `已刪除「${lastDeletedTaskItem.item.title}」`;
  const undo = document.createElement("button");
  undo.type = "button";
  undo.textContent = "復原";
  undo.addEventListener("click", () => {
    const restored = lastDeletedTaskItem.item;
    const field = ["done", "success"].includes(restored.status)
      ? "completed_items"
      : "pending_items";
    applyDemoEditorCommand({
      type: "add-item",
      taskId,
      field,
      item: {
        id: restored.id,
        title: restored.title,
        priority: restored.priority,
        demoStatus: restored.status,
        demoOrder: lastDeletedTaskItem.index - 0.5,
      },
    });
    lastDeletedTaskItem = null;
    renderTaskItems();
  });
  row.append(copy, undo);
  return row;
}

function createTaskItemAddRow(taskId = primaryTaskId) {
  const row = document.createElement("li");
  row.className = "task-item-add-row";
  if (addingTaskId !== taskId) {
    const add = document.createElement("button");
    add.type = "button";
    add.className = "task-item-add";
    add.textContent = "+";
    const cardTitle = elements.taskCards
      .find((card) => card.dataset.taskId === taskId)
      ?.querySelector("h3")?.textContent.trim();
    add.setAttribute("aria-label", `在「${cardTitle ?? taskId}」新增尚未完成的子項目`);
    add.addEventListener("click", () => {
      addingTaskId = taskId;
      renderTaskItems();
    });
    row.append(add);
    return row;
  }

  const form = document.createElement("form");
  form.className = "task-item-add-form";
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 300;
  input.placeholder = "新增尚未完成的任務描述";
  input.setAttribute("aria-label", "新增子項目描述");
  const prioritySelect = createTaskItemPrioritySelect(
    { title: "新子項目", priority: CREATION_PRIORITY },
    "新子項目優先級",
  );
  const error = document.createElement("span");
  error.className = "task-inline-error";
  error.hidden = true;
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "task-inline-cancel";
  cancel.textContent = "取消";
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "task-inline-save";
  submit.textContent = "新增";
  form.append(input, prioritySelect, cancel, submit, error);
  row.append(form);

  const close = () => {
    addingTaskId = null;
    renderTaskItems();
  };
  cancel.addEventListener("click", close);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = taskEditingModel.normalizeTaskDescription(input.value, 300);
    if (!result.ok) {
      if (result.cancelled) {
        close();
        return;
      }
      error.textContent = result.error;
      error.hidden = false;
      return;
    }
    const id = demoEditorSession.createItemId(
      taskId,
      `item-${Date.now().toString(36)}`,
    );
    applyDemoEditorCommand({
      type: "add-item",
      taskId,
      field: "pending_items",
      item: {
        id,
        title: result.value,
        priority: taskEditingModel.normalizePriority(
          prioritySelect.value,
          CREATION_PRIORITY,
        ),
        demoStatus: "pending",
        demoOrder: taskItemsFor(taskId).length,
      },
    });
    addingTaskId = null;
    lastDeletedTaskItem = null;
    renderTaskItems();
  });
  queueMicrotask(() => input.focus());
  return row;
}

function renderTopLevelTaskAdd() {
  const host = elements.taskCardAddHost;
  host.hidden = !globalEditingEnabled();
  if (host.hidden) {
    host.replaceChildren();
    addingTopLevelTask = false;
    return;
  }

  if (!addingTopLevelTask) {
    const add = document.createElement("button");
    add.type = "button";
    add.className = "task-card-add";
    add.textContent = "+";
    add.setAttribute("aria-label", "新增最外層任務卡");
    add.addEventListener("click", () => {
      addingTopLevelTask = true;
      renderTopLevelTaskAdd();
    });
    host.replaceChildren(add);
    return;
  }

  const form = document.createElement("form");
  form.className = "task-card-add-form";
  const title = document.createElement("input");
  title.type = "text";
  title.maxLength = 200;
  title.placeholder = "任務名稱";
  title.setAttribute("aria-label", "新任務名稱");
  const summary = document.createElement("textarea");
  summary.rows = 2;
  summary.maxLength = 1000;
  summary.placeholder = "任務描述";
  summary.setAttribute("aria-label", "新任務描述");
  const prioritySelect = createPrioritySelect(
    CREATION_PRIORITY,
    "新任務卡優先級",
    "task-priority-select",
  );
  const contract = document.createElement("span");
  contract.className = "task-add-contract";
  contract.textContent = "預設狀態：待處理；預設優先級：一般；ID 會獨立產生";
  const error = document.createElement("span");
  error.className = "task-inline-error";
  error.hidden = true;
  const actions = document.createElement("div");
  actions.className = "task-inline-actions";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "task-inline-cancel";
  cancel.textContent = "取消";
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "task-inline-save";
  submit.textContent = "新增任務";
  actions.append(cancel, submit);
  form.append(title, summary, prioritySelect, contract, error, actions);
  host.replaceChildren(form);

  const close = () => {
    addingTopLevelTask = false;
    renderTopLevelTaskAdd();
  };
  cancel.addEventListener("click", close);
  form.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const titleResult = taskEditingModel.normalizeTaskDescription(title.value, 200);
    const summaryResult = taskEditingModel.normalizeTaskDescription(summary.value, 1000);
    if (!titleResult.ok || !summaryResult.ok) {
      if (titleResult.cancelled && summaryResult.cancelled) {
        close();
        return;
      }
      error.textContent = !titleResult.ok
        ? (titleResult.cancelled ? "請填寫任務名稱。" : titleResult.error)
        : (summaryResult.cancelled ? "請填寫任務描述。" : summaryResult.error);
      error.hidden = false;
      return;
    }
    const definition = {
      id: demoEditorSession.createTaskId(`task-${Date.now().toString(36)}`),
      title: titleResult.value,
      summary: summaryResult.value,
      status: "planned",
      priority: taskEditingModel.normalizePriority(
        prioritySelect.value,
        CREATION_PRIORITY,
      ),
      baseCompleted: 0,
      baseTotal: 0,
    };
    applyDemoEditorCommand({
      type: "add-task",
      task: {
        id: definition.id,
        title: definition.title,
        summary: definition.summary,
        status: definition.status,
        priority: definition.priority,
        completed_items: [],
        pending_items: [],
        demoBaseCompleted: 0,
        demoBaseTotal: 0,
      },
    });
    addingTopLevelTask = false;
    lastDeletedTaskItem = null;
    renderTaskSummaryControls();
    renderTaskItems();
    renderTopLevelTaskAdd();
  });
  queueMicrotask(() => title.focus());
}

function renderAuxiliaryTaskItems() {
  elements.taskCards
    .filter((card) => card.dataset.taskId !== primaryTaskId)
    .forEach((card) => {
      const taskId = card.dataset.taskId;
      const items = taskItemsFor(taskId);
      const list = card.querySelector(`[data-task-child-list="${taskId}"]`);
      const panel = list?.closest(".task-child-panel");
      if (!list || !panel) return;

      const rows = orderedTaskItems(items)
        .map((item) => createDemoItemRow(taskId, item));
      if (
        globalEditingEnabled()
        && lastDeletedTaskItem?.taskId === taskId
      ) {
        rows.push(createDeletedTaskItemNotice(taskId));
      }
      if (globalEditingEnabled()) rows.push(createTaskItemAddRow(taskId));
      list.replaceChildren(...rows);
      panel.hidden = !globalEditingEnabled() && items.length === 0;

      const { completed, total } = taskProgressSnapshot(taskId);
      const fraction = card.querySelector(".task-fraction");
      fraction.textContent = `${completed} / ${total}`;
      fraction.setAttribute("aria-label", `子項目完成 ${completed}，共 ${total}`);

      const duration = card.querySelector(".task-duration");
      if (duration) {
        const stale = baseStructureFor(taskId)?.join("|")
          !== items.map((item) => item.id).join("|");
        duration.hidden = !stale;
        if (stale) duration.textContent = "時間待重新分析";
      }
    });
}

function renderTaskItems() {
  updateTaskStructureChanged();
  const primaryStructureStale = baseStructureFor(primaryTaskId).join("|")
    !== taskItems.map((item) => item.id).join("|");
  const estimates = new Map(
    (primaryStructureStale ? [] : (analysis?.tasks?.[0]?.items ?? []))
      .map((item) => [item.item_id, item]),
  );
  const rows = orderedTaskItems(taskItems).map((taskItem) => {
    const estimate = estimates.get(taskItem.id);
    return createDemoItemRow(primaryTaskId, taskItem, estimate);
  });
  if (
    globalEditingEnabled()
    && lastDeletedTaskItem?.taskId === primaryTaskId
  ) {
    rows.push(createDeletedTaskItemNotice(primaryTaskId));
  }
  if (globalEditingEnabled()) rows.push(createTaskItemAddRow(primaryTaskId));
  elements.workList.replaceChildren(...rows);

  const primaryProgress = taskProgressSnapshot(primaryTaskId);
  elements.taskTotal.textContent = `${primaryProgress.completed} / ${primaryProgress.total}`;
  elements.taskTotal.setAttribute(
    "aria-label",
    `子項目完成 ${primaryProgress.completed}，共 ${primaryProgress.total}`,
  );
  const staleNote = elements.taskCard.querySelector(".task-structure-note")
    ?? document.createElement("p");
  staleNote.className = "task-structure-note";
  staleNote.textContent = "任務結構已修改；受影響的時間資料已失效，等待重新分析。";
  staleNote.hidden = !taskStructureChanged;
  if (!staleNote.isConnected) elements.workList.after(staleNote);
  if (analysis && taskStructureChanged) {
    elements.taskDuration.textContent = "時間待重新分析";
    elements.taskDuration.hidden = !primaryStructureStale;
    elements.timeButton.hidden = false;
    elements.timeButton.disabled = true;
    elements.timeButton.className = "time-summary-button no-deadline";
    elements.timeText.textContent = "時間待重新分析";
    elements.timeButton.setAttribute(
      "aria-label",
      "進度報告：任務結構已修改，時間資料等待重新分析",
    );
  }
  renderAuxiliaryTaskItems();
  renderTaskPriorityControls();
  updateStatusAndProgressSummaries();
  renderStatusOrder();
  applyTaskFilter(activeTaskFilter);
}

function renderBaseProgress() {
  updateStatusAndProgressSummaries();
}

function renderRuntimeRiskSurface(data) {
  const { summary } = data;
  const deadline = summary.deadline;
  const progress = currentProgressSummary();
  if (!deadline) {
    const workPercent = progress.percentage;
    elements.timeButton.className = "time-summary-button no-deadline";
    elements.timeText.textContent = "交付日未定";
    elements.timeButton.setAttribute(
      "aria-label",
      `進度報告：交付日未定，工程總預估 ${hours(summary.total_estimated_minutes)}`,
    );
    elements.progressValue.textContent = `整體約 ${workPercent}%`;
    elements.progressMeter.value = workPercent;
    elements.progressMeter.textContent = `${workPercent}%`;
    elements.progressMeter.setAttribute("aria-label", `整體進度 ${workPercent}%`);
    return;
  }
  const urgency = urgencyMeta[deadline.urgency] ?? urgencyMeta.at_risk;
  const workPercent = progress.percentage;

  elements.timeButton.className = `time-summary-button ${urgency.className}`;
  elements.timeText.textContent = `${deliveryLabel(deadline.delivery_at)} 交付`;
  elements.timeButton.setAttribute(
    "aria-label",
    `工期摘要：${deliveryLabel(deadline.delivery_at)} 交付，工程總預估 ${hours(summary.total_estimated_minutes)}，${urgency.lampLabel}`,
  );
  elements.progressValue.textContent = `整體約 ${workPercent}%`;
  elements.progressMeter.value = workPercent;
  elements.progressMeter.textContent = `${workPercent}%`;
  elements.progressMeter.setAttribute(
    "aria-label",
    `整體進度 ${workPercent}%，時間已使用 ${percent(deadline.time_progress_ratio)}`,
  );
}

function refreshRuntimeRisk() {
  if (!analysis?.summary?.deadline) return;
  try {
    updateRuntimeDeadline(analysis);
    renderRuntimeRiskSurface(analysis);
    if (
      elements.dialog.open
      && elements.dialogTitle.textContent === "進度報告"
      && !capacityEditorOpen
    ) {
      showProjectDetail();
    }
  } catch (error) {
    renderError(error);
  }
}

function renderWithoutTime(diagnostic = null) {
  analysis = null;
  deadlineDiagnostic = null;
  elements.timeButton.hidden = true;
  elements.timeButton.disabled = true;
  elements.timeButton.onclick = null;
  elements.taskDurations.forEach((duration) => {
    duration.hidden = true;
  });
  elements.analysisMethodMeta.hidden = true;
  elements.updatedAt.textContent = analysisTime(BASE_REPORT_UPDATED_AT);
  renderTaskItems();
  renderBaseProgress();
  elements.taskCard.setAttribute("aria-busy", "false");
  if (diagnostic) console.warn("time.analysis.json 已忽略：", diagnostic);
}

function render(data) {
  const inspection = timeDataPolicy.inspectTimeAnalysis(data);
  if (inspection.state !== "available") {
    renderWithoutTime(inspection.errors.join("；") || null);
    return;
  }

  deadlineDiagnostic = inspection.deadlineErrors.join("；") || null;
  if (!inspection.deadlineAvailable) {
    delete data.summary.deadline;
  }
  analysis = data;
  if (data.summary.deadline) updateRuntimeDeadline(data);
  const { summary } = data;
  const task = data.tasks[0];

  elements.timeButton.hidden = false;
  elements.timeButton.disabled = false;
  renderRuntimeRiskSurface(data);
  elements.updatedAt.textContent = analysisTime(data.as_of);
  elements.analysisMethodMeta.hidden = false;
  elements.analysisMethod.textContent = `${data.method.name} v${data.method.version}`;
  elements.taskTotal.textContent = `0 / ${task.items.length}`;
  elements.taskTotal.setAttribute("aria-label", `子項目完成 0，共 ${task.items.length}`);
  elements.taskDuration.textContent = `約需 ${hours(task.total_likely_minutes)}`;
  elements.taskDurations.forEach((duration) => {
    duration.hidden = false;
  });
  renderTaskItems();
  elements.taskCard.setAttribute("aria-busy", "false");
  elements.timeButton.onclick = showProjectDetail;
}

function renderError(error) {
  renderWithoutTime(error instanceof Error ? error.message : String(error));
}

elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});
elements.dialog.addEventListener("close", () => {
  capacityEditorOpen = false;
});

elements.filterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (suppressFilterClick) {
      event.preventDefault();
      suppressFilterClick = false;
      return;
    }
    applyTaskFilter(button.dataset.filter);
  });
  button.addEventListener("dragstart", (event) => {
    const status = button.dataset.filter;
    if (status === "all") {
      event.preventDefault();
      return;
    }
    draggedStatus = status;
    suppressFilterClick = true;
    button.classList.add("status-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", status);
  });
  button.addEventListener("dragover", (event) => {
    const targetStatus = button.dataset.filter;
    if (!draggedStatus || targetStatus === "all" || targetStatus === draggedStatus) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    elements.filterButtons.forEach((candidate) => {
      candidate.classList.remove("status-drop-before", "status-drop-after");
    });
    const bounds = button.getBoundingClientRect();
    const placeAfter = event.clientX >= bounds.left + bounds.width / 2;
    button.classList.add(placeAfter ? "status-drop-after" : "status-drop-before");
  });
  button.addEventListener("dragleave", (event) => {
    if (!button.contains(event.relatedTarget)) {
      button.classList.remove("status-drop-before", "status-drop-after");
    }
  });
  button.addEventListener("drop", (event) => {
    const targetStatus = button.dataset.filter;
    if (!draggedStatus || targetStatus === "all") return;
    event.preventDefault();
    const bounds = button.getBoundingClientRect();
    const placeAfter = event.clientX >= bounds.left + bounds.width / 2;
    const status = draggedStatus;
    draggedStatus = null;
    clearStatusDragIndicators();
    moveStatus(status, targetStatus, placeAfter);
  });
  button.addEventListener("dragend", () => {
    draggedStatus = null;
    clearStatusDragIndicators();
    window.setTimeout(() => {
      suppressFilterClick = false;
    }, 0);
  });
  button.addEventListener("keydown", (event) => {
    if (!event.altKey || button.dataset.filter === "all") return;
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    moveStatusByOffset(button.dataset.filter, event.key === "ArrowLeft" ? -1 : 1);
  });
});

elements.globalEditSaveButton.addEventListener("click", saveGlobalDrafts);

elements.viewModeSelect.addEventListener("change", () => {
  setViewMode(elements.viewModeSelect.value);
});

elements.timeScenarioSelect.addEventListener("change", () => {
  timeScenario = elements.timeScenarioSelect.value === "deadline"
    ? "deadline"
    : "undated";
  if (elements.dialog.open) elements.dialog.close();
  if (loadedAnalysisSource) {
    render(prepareDemoAnalysis(loadedAnalysisSource));
  }
});

const initialTheme = document.documentElement.dataset.theme;
elements.themeSelect.value = ["light", "dark"].includes(initialTheme) ? initialTheme : "system";
elements.themeSelect.addEventListener("change", () => {
  if (elements.themeSelect.value === "system") {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.themeBase;
    return;
  }
  document.documentElement.dataset.theme = elements.themeSelect.value;
  document.documentElement.dataset.themeBase = elements.themeSelect.value;
});

window.setInterval(refreshRuntimeRisk, 60_000);
window.addEventListener("pageshow", refreshRuntimeRisk);
window.addEventListener("beforeunload", (event) => {
  if (!hasUnsavedDrafts()) return;
  event.preventDefault();
  event.returnValue = "";
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refreshRuntimeRisk();
});

loadTaskContentOverrides();
initializeDemoEditorSession();
setViewMode("preview");

const queryParams = new URLSearchParams(window.location.search);
const timeMode = queryParams.get("time");
timeScenario = queryParams.get("scenario") === "deadline" ? "deadline" : "undated";
elements.timeScenarioSelect.value = timeScenario;

function loadDemoAnalysis(source) {
  loadedAnalysisSource = cloneValue(source);
  render(prepareDemoAnalysis(loadedAnalysisSource));
}

if (timeMode === "none") {
  elements.timeScenarioSelect.disabled = true;
  renderWithoutTime();
} else if (window.location.protocol === "file:") {
  loadDemoAnalysis(FALLBACK_ANALYSIS);
} else {
  fetch(DATA_URL, { cache: "no-store" })
    .then((response) => {
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`分析資料載入失敗（HTTP ${response.status}）`);
      return response.json();
    })
    .then((data) => {
      if (data === null) {
        elements.timeScenarioSelect.disabled = true;
        renderWithoutTime();
        return;
      }
      loadDemoAnalysis(data);
    })
    .catch(renderError);
}
