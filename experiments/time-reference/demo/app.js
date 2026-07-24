const DATA_URL = "../examples/time.analysis.json";

const FALLBACK_ANALYSIS = {
  as_of: "2026-07-22T17:00:00+08:00",
  method: {
    name: "deterministic-progress-pressure",
    version: "0.2",
  },
  summary: {
    executor_count: 1,
    nominal_daily_capacity_minutes: 480,
    execution_calibration: {
      factor: 1,
      effective_sample_count: 0,
    },
    total_estimated_minutes: 2640,
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
      time_progress_ratio: 0.3333,
      work_progress_ratio: 0.2,
      progress_pressure_ratio: 1.2,
      boundary_state: "active",
      urgency: "at_risk",
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
const BASE_TASK_ITEMS = Object.entries(labels).map(([id, title], index) => ({
  id,
  title,
  status: ["active", "blocked", "pending"][index] ?? "pending",
}));

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
const TASK_CONTENT_REVISION = 2;
const editingPolicy = globalThis.TimeEditingPolicy;
const taskEditingModel = globalThis.TimeTaskEditingModel;
const timeDataPolicy = globalThis.TimeDataPolicy;
const estimateEngine = globalThis.TimeEstimateEngine;
const capacityEngine = globalThis.TimeCapacityEngine;
const deadlineEngine = globalThis.TimeDeadlineEngine;
if (!editingPolicy) throw new Error("編輯環境政策未載入。");
if (!taskEditingModel) throw new Error("任務編輯模型未載入。");
if (!timeDataPolicy) throw new Error("時間資料政策未載入。");
if (!estimateEngine) throw new Error("估算算法引擎未載入。");
if (!capacityEngine) throw new Error("工作容量引擎未載入。");
if (!deadlineEngine) throw new Error("期限風險引擎未載入。");
const localEditingAllowed = editingPolicy.canEditFromLocation(window.location);
const BASE_REPORT_UPDATED_AT = "2026-07-21T23:44:00+08:00";
const BASE_WORK_PROGRESS = 0.2;
const DEFAULT_STATUS_ORDER = ["in_progress", "done", "blocked", "archive"];
const itemStatusGroup = {
  active: "in_progress",
  pending: "pending",
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
  pending: { label: "待做", className: "pending" },
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
  on_track: { label: "進度正常", lampLabel: "綠色燈號", className: "on-track" },
  at_risk: { label: "進度有風險", lampLabel: "黃色燈號", className: "at-risk" },
  critical: { label: "進度危急", lampLabel: "紅色燈號", className: "critical" },
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
let addingTaskId = null;
let lastDeletedTaskItem = null;
const baseTaskSummaries = Object.fromEntries(
  elements.taskCards.map((card) => [
    card.dataset.taskId,
    card.querySelector(".task-summary")?.textContent.trim() ?? "",
  ]),
);
let taskSummaries = { ...baseTaskSummaries };
let persistedTaskSummaries = { ...baseTaskSummaries };

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

function saveDemoOverride(item) {
  if (!localEditingAllowed) return;
  const overrides = readDemoOverrides();
  overrides[item.item_id] = {
    inputs: Object.fromEntries(
      item.inputs
        .filter((input) => input.origin === "human")
        .map((input) => [input.name, input.value]),
    ),
    human_note: item.human_note ?? "",
  };
  try {
    localStorage.setItem(DEMO_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // The interactive demo still works in memory when browser storage is unavailable.
  }
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function globalEditingEnabled() {
  return localEditingAllowed && viewMode === "edit";
}

function syncTaskLabels() {
  Object.keys(labels).forEach((id) => delete labels[id]);
  [
    ...taskItems,
    ...Object.values(auxiliaryTaskItems).flat(),
  ].forEach((item) => {
    labels[item.id] = item.title;
  });
}

function updateTaskStructureChanged() {
  taskStructureChanged = taskItems.map((item) => item.id).join("|")
    !== BASE_TASK_ITEMS.map((item) => item.id).join("|");
}

function taskItemsFor(taskId) {
  return taskId === primaryTaskId
    ? taskItems
    : (auxiliaryTaskItems[taskId] ?? []);
}

function allTaskItemIds() {
  return elements.taskCards.flatMap(
    (card) => taskItemsFor(card.dataset.taskId).map((item) => item.id),
  );
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
      const withinDifference = (itemStatusWithinGroup[left.item.status] ?? 0)
        - (itemStatusWithinGroup[right.item.status] ?? 0);
      return withinDifference || left.index - right.index;
    })
    .map(({ item }) => item);
}

function taskContentSignature(summaries, primaryItems, auxiliaryItems) {
  return JSON.stringify({
    summaries,
    items_by_task: Object.fromEntries(
      elements.taskCards.map((card) => {
        const taskId = card.dataset.taskId;
        const items = taskId === primaryTaskId
          ? primaryItems
          : (auxiliaryItems[taskId] ?? []);
        return [
          taskId,
          items.map(({ id, title, status }) => ({ id, title, status })),
        ];
      }),
    ),
  });
}

function renderGlobalEditSave() {
  elements.globalEditSave.hidden = !globalEditingEnabled() || !taskContentDirty;
}

function updateTaskContentDirty() {
  taskContentDirty = taskContentSignature(
    taskSummaries,
    taskItems,
    auxiliaryTaskItems,
  ) !== taskContentSignature(
    persistedTaskSummaries,
    persistedTaskItems,
    persistedAuxiliaryTaskItems,
  );
  renderGlobalEditSave();
}

function loadTaskContentOverrides() {
  const content = readDemoOverrides().__task_content;
  if (!content || typeof content !== "object") {
    syncTaskLabels();
    persistedTaskSummaries = { ...taskSummaries };
    return;
  }

  if (content.summaries && typeof content.summaries === "object") {
    Object.keys(baseTaskSummaries).forEach((taskId) => {
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
  updateTaskContentDirty();
}

function saveTaskContentOverrides() {
  if (!localEditingAllowed) return;
  const overrides = readDemoOverrides();
  const itemsByTask = Object.fromEntries(
    elements.taskCards.map((card) => {
      const taskId = card.dataset.taskId;
      return [taskId, taskItemsFor(taskId).map((item) => ({ ...item }))];
    }),
  );
  overrides.__task_content = {
    base_revision: TASK_CONTENT_REVISION,
    summaries: { ...taskSummaries },
    items_by_task: itemsByTask,
    items: taskItems.map((item) => ({ ...item })),
  };
  try {
    localStorage.setItem(DEMO_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // The isolated Demo remains editable in memory when storage is unavailable.
  }
  persistedTaskItems = taskItems.map((item) => ({ ...item }));
  persistedAuxiliaryTaskItems = cloneValue(auxiliaryTaskItems);
  persistedTaskSummaries = { ...taskSummaries };
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
      taskSummaries[taskId] = input.value;
      updateTaskContentDirty();
    });
    summary.after(input);
  });
}

function setViewMode(nextMode) {
  viewMode = nextMode === "edit" && localEditingAllowed ? "edit" : "preview";
  document.documentElement.dataset.viewMode = viewMode;
  elements.viewModeSelect.value = viewMode;
  elements.viewModeSelect.disabled = !localEditingAllowed;
  if (!localEditingAllowed) {
    elements.viewModeSelect.title = "編輯模式只在本機 Demo 開放";
  }
  addingTaskId = null;
  if (elements.dialog.open) elements.dialog.close();
  renderTaskSummaryControls();
  renderTaskItems();
  renderGlobalEditSave();
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

function saveCapacityOverride(profile) {
  if (!localEditingAllowed) return;
  const overrides = readDemoOverrides();
  overrides.__capacity_profile = {
    profile: cloneValue(profile),
    updated_at: new Date().toISOString(),
  };
  try {
    localStorage.setItem(DEMO_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // The interactive demo still works in memory when browser storage is unavailable.
  }
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
  taskEditingModel.stableSortByStatus(
    elements.taskCards,
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

function remainingWorkload(summary, workProgressRatio = BASE_WORK_PROGRESS) {
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

function capacityHourInput(name, label, minutes) {
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
  input.value = String(roundHours(minutes / 60));
  const unit = document.createElement("span");
  unit.textContent = "hr";
  control.append(input, unit);
  field.append(title, control);
  return field;
}

function createCapacityEditor(profile) {
  const form = document.createElement("form");
  form.className = "item-editor capacity-editor";

  const heading = document.createElement("div");
  heading.className = "item-editor-heading";
  const title = document.createElement("h3");
  title.textContent = "編輯工作容量";
  const localNote = document.createElement("span");
  localNote.textContent = "僅保存在此瀏覽器";
  heading.append(title, localNote);

  const fields = document.createElement("div");
  fields.className = "item-editor-fields";
  fields.append(
    capacityHourInput("sleep_hours", "每日睡眠", profile.sleep_minutes_per_day),
    capacityHourInput("life_hours", "每日生活時間", profile.life_minutes_per_day),
    capacityHourInput(
      "other_hours",
      "其他固定不可工作",
      profile.other_unavailable_minutes_per_day,
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
    input.checked = profile.working_weekdays.includes(day);
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
  exceptions.value = profile.capacity_exceptions
    .map((exception) => (
      `${exception.date} | ${roundHours(exception.available_minutes / 60)} | ${exception.public_label ?? ""}`
    ))
    .join("\n");
  const exceptionsHelp = document.createElement("small");
  exceptionsHelp.textContent = "每行：日期 | 當日可工作 hr | 公開標籤（不要填私人細節）";
  exceptionsField.append(exceptionsLabel, exceptions, exceptionsHelp);

  const error = document.createElement("p");
  error.className = "item-editor-error";
  error.hidden = true;

  const actions = document.createElement("div");
  actions.className = "item-editor-actions";
  const cancel = document.createElement("button");
  cancel.className = "item-editor-cancel";
  cancel.type = "button";
  cancel.textContent = "取消";
  const submit = document.createElement("button");
  submit.className = "item-editor-submit";
  submit.type = "submit";
  submit.textContent = "重新計算";
  actions.append(cancel, submit);

  form.append(heading, fields, derived, weekdayField, exceptionsField, error, actions);
  form.addEventListener("input", updateDerived);
  cancel.addEventListener("click", () => {
    capacityEditorOpen = false;
    showProjectDetail();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.hidden = true;
    try {
      const formData = new FormData(form);
      const sleepMinutes = Math.round(Number(formData.get("sleep_hours")) * 60);
      const lifeMinutes = Math.round(Number(formData.get("life_hours")) * 60);
      const otherMinutes = Math.round(Number(formData.get("other_hours")) * 60);
      const capacityMinutes = 1440 - sleepMinutes - lifeMinutes - otherMinutes;
      if (
        ![sleepMinutes, lifeMinutes, otherMinutes].every(
          (value) => Number.isFinite(value) && value >= 0,
        )
        || capacityMinutes <= 0
      ) {
        throw new Error("睡眠、生活與其他不可工作時間合計必須小於 24 hr。");
      }
      const workingWeekdays = formData
        .getAll("working_weekday")
        .map(Number)
        .sort((left, right) => left - right);
      if (!workingWeekdays.length) throw new Error("至少選擇一個工作日。");
      const nextProfile = {
        total_minutes_per_day: 1440,
        sleep_minutes_per_day: sleepMinutes,
        life_minutes_per_day: lifeMinutes,
        other_unavailable_minutes_per_day: otherMinutes,
        capacity_minutes_per_executor_day: capacityMinutes,
        working_weekdays: workingWeekdays,
        capacity_exceptions: capacityEngine.parseExceptions(
          String(formData.get("capacity_exceptions") ?? ""),
        ),
      };
      const timeline = capacityEngine.buildTimeline(
        analysis.summary.deadline,
        nextProfile,
      );
      if (!timeline.some((day) => day.capacity_minutes > 0)) {
        throw new Error("交付前必須至少保留一段可工作容量。");
      }
      saveCapacityOverride(nextProfile);
      applyCapacityProfile(analysis, nextProfile, new Date().toISOString());
      recomputeAnalysis(analysis, "config");
      updateRuntimeDeadline(analysis);
      renderRuntimeRiskSurface(analysis);
      capacityEditorOpen = false;
      projectDetailTab = "capacity";
      showProjectDetail();
    } catch (reason) {
      error.textContent = reason instanceof Error ? reason.message : String(reason);
      error.hidden = false;
    }
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
  intro.textContent = "工程需求與可工作時間分開計算，再用目前進度判斷交付風險。";

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
      "工程總估算 × 未完成比例",
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
    "目前作為可行性參考，尚未直接改變燈號",
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
      "deterministic-progress-pressure v0.2",
      `evaluation-node-risk ${urgency.className}`,
    ),
  );

  const note = document.createElement("p");
  note.className = "evaluation-flow-note";
  note.textContent = "目前 v0.2 燈號只採進度壓力；容量缺口先作摘要參考，待公式升版後才可合併成總結風險。";

  panel.append(intro, lanes, merge, riskRow, note);
  return panel;
}

function showUndatedProjectDetail() {
  const { summary } = analysis;
  const workProgressRatio = BASE_WORK_PROGRESS;
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
  technical.append(title, grid, note, composition);

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

  const heading = document.createElement("div");
  heading.className = "item-editor-heading";
  const title = document.createElement("h3");
  title.textContent = "編輯人工輸入";
  const note = document.createElement("span");
  note.textContent = "Demo 會保存在此瀏覽器";
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
      value.value = String(input.value);
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
  reason.value = item.human_note ?? "";
  reasonField.append(reasonLabel, reason);

  const error = document.createElement("p");
  error.className = "item-editor-error";
  error.hidden = true;

  const actions = document.createElement("div");
  actions.className = "item-editor-actions";
  const cancel = document.createElement("button");
  cancel.className = "item-editor-cancel";
  cancel.type = "button";
  cancel.textContent = "取消";
  cancel.addEventListener("click", () => showItemDetail(item));
  const submit = document.createElement("button");
  submit.className = "item-editor-submit";
  submit.type = "submit";
  submit.textContent = "重新計算";
  actions.append(cancel, submit);

  form.append(heading, fields, reasonField, error, actions);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const nextInputs = item.inputs.map((input) => ({ ...input }));
    nextInputs.forEach((input) => {
      if (input.origin === "human" && values.has(input.name)) {
        input.value = Number(values.get(input.name));
      }
    });
    const nextHumanNote = String(values.get("human_note") ?? "").trim();
    try {
      const result = calculateEstimate({
        ...item,
        inputs: nextInputs,
        human_note: nextHumanNote,
      });
      item.inputs = nextInputs;
      item.human_note = nextHumanNote;
      applyEstimateResult(item, result);
      saveDemoOverride(item);
      recomputeAnalysis(analysis);
      render(analysis);
      showItemDetail(item);
    } catch (calculationError) {
      error.hidden = false;
      error.textContent = calculationError instanceof Error
        ? calculationError.message
        : String(calculationError);
    }
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

function deleteTaskItem(taskId, item) {
  const items = taskItemsFor(taskId);
  const index = items.findIndex((candidate) => candidate.id === item.id);
  if (index < 0) return;
  lastDeletedTaskItem = { taskId, item: { ...items[index] }, index };
  items.splice(index, 1);
  updateTaskStructureChanged();
  syncTaskLabels();
  updateTaskContentDirty();
  renderTaskItems();
}

function createTaskItemTitleInput(item, taskId = primaryTaskId) {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "task-item-title-input";
  input.maxLength = 300;
  input.value = item.title;
  input.setAttribute("aria-label", "子項目描述");
  input.dataset.itemId = item.id;
  input.dataset.taskId = taskId;
  input.addEventListener("input", () => {
    input.setCustomValidity("");
    item.title = input.value;
    labels[item.id] = input.value.trim() || item.id;
    updateTaskContentDirty();
  });
  return input;
}

function createTaskItemDeleteButton(item, taskId = primaryTaskId) {
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "task-item-delete";
  remove.textContent = "刪除";
  remove.setAttribute("aria-label", `刪除子項目：${item.title}`);
  remove.addEventListener("click", () => deleteTaskItem(taskId, item));
  return remove;
}

function createWorkRow(item, index, taskItem) {
  const row = document.createElement("li");
  row.className = "time-work-item";
  const button = document.createElement("button");
  button.className = "time-estimate-button";
  button.type = "button";
  button.textContent = `${item.display_hours} hr`;
  button.setAttribute("aria-label", `${taskItem.title}，約 ${item.display_hours} 小時，查看估算依據`);
  button.addEventListener("click", () => showItemDetail(item));

  if (globalEditingEnabled()) {
    row.append(
      createTaskItemTitleInput(taskItem, primaryTaskId),
      createTaskItemDeleteButton(taskItem, primaryTaskId),
      button,
      createTaskItemStatus(taskItem),
    );
    return row;
  }

  const copy = document.createElement("div");
  copy.className = "time-work-copy";
  const title = document.createElement("span");
  title.className = "time-work-title";
  title.textContent = taskItem.title;
  copy.append(title, button);
  row.append(copy, createTaskItemStatus(taskItem));
  return row;
}

function createWorkRowWithoutTime(taskItem) {
  const row = document.createElement("li");
  row.className = "time-work-item";
  const missing = document.createElement("span");
  missing.className = "time-estimate-missing";
  missing.textContent = "待估";

  if (globalEditingEnabled()) {
    row.append(
      createTaskItemTitleInput(taskItem, primaryTaskId),
      createTaskItemDeleteButton(taskItem, primaryTaskId),
      missing,
      createTaskItemStatus(taskItem),
    );
    return row;
  }

  const copy = document.createElement("div");
  copy.className = "time-work-copy";
  const title = document.createElement("span");
  title.className = "time-work-title";
  title.textContent = taskItem.title;
  copy.append(title, missing);
  row.append(copy, createTaskItemStatus(taskItem));
  return row;
}

function saveTaskItemDrafts() {
  let firstInvalidInput = null;

  document.querySelectorAll("#task-list .task-summary-direct-input").forEach((input) => {
    const result = taskEditingModel.normalizeTaskDescription(input.value, 1000);
    if (!result.ok) {
      input.setCustomValidity(result.cancelled ? "任務描述不可為空白。" : result.error);
      firstInvalidInput ??= input;
      return;
    }
    input.setCustomValidity("");
    taskSummaries[input.dataset.taskId] = result.value;
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
    item.title = result.value;
  });

  if (firstInvalidInput) {
    firstInvalidInput.focus();
    firstInvalidInput.reportValidity();
    return;
  }

  syncTaskLabels();
  updateTaskStructureChanged();
  saveTaskContentOverrides();
  renderTaskSummaryControls();
  renderTaskItems();
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
    const items = taskItemsFor(taskId);
    const insertionIndex = Math.min(lastDeletedTaskItem.index, items.length);
    items.splice(insertionIndex, 0, lastDeletedTaskItem.item);
    lastDeletedTaskItem = null;
    updateTaskStructureChanged();
    syncTaskLabels();
    updateTaskContentDirty();
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
  form.append(input, error, cancel, submit);
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
    const id = taskEditingModel.createStableItemId(allTaskItemIds());
    taskItemsFor(taskId).push({ id, title: result.value, status: "pending" });
    labels[id] = result.value;
    addingTaskId = null;
    lastDeletedTaskItem = null;
    updateTaskStructureChanged();
    updateTaskContentDirty();
    renderTaskItems();
  });
  queueMicrotask(() => input.focus());
  return row;
}

function createAuxiliaryWorkRow(taskId, taskItem) {
  const row = document.createElement("li");
  row.className = "time-work-item";
  const missing = document.createElement("span");
  missing.className = "time-estimate-missing";
  missing.textContent = "待估";

  if (globalEditingEnabled()) {
    row.append(
      createTaskItemTitleInput(taskItem, taskId),
      createTaskItemDeleteButton(taskItem, taskId),
      missing,
      createTaskItemStatus(taskItem),
    );
    return row;
  }

  const copy = document.createElement("div");
  copy.className = "time-work-copy";
  const title = document.createElement("span");
  title.className = "time-work-title";
  title.textContent = taskItem.title;
  copy.append(title, missing);
  row.append(copy, createTaskItemStatus(taskItem));
  return row;
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
        .map((item) => createAuxiliaryWorkRow(taskId, item));
      if (
        globalEditingEnabled()
        && lastDeletedTaskItem?.taskId === taskId
      ) {
        rows.push(createDeletedTaskItemNotice(taskId));
      }
      if (globalEditingEnabled()) rows.push(createTaskItemAddRow(taskId));
      list.replaceChildren(...rows);
      panel.hidden = !globalEditingEnabled() && items.length === 0;

      const completed = Number(card.dataset.baseCompleted);
      const baseTotal = Number(card.dataset.baseTotal);
      const total = baseTotal + items.length;
      const fraction = card.querySelector(".task-fraction");
      fraction.textContent = `${completed} / ${total}`;
      fraction.setAttribute("aria-label", `子項目完成 ${completed}，共 ${total}`);
    });
}

function renderTaskItems() {
  const estimates = new Map(
    (analysis?.tasks?.[0]?.items ?? []).map((item) => [item.item_id, item]),
  );
  const rows = orderedTaskItems(taskItems).map((taskItem, index) => {
    const estimate = estimates.get(taskItem.id);
    return estimate
      ? createWorkRow(estimate, index, taskItem)
      : createWorkRowWithoutTime(taskItem);
  });
  if (
    globalEditingEnabled()
    && lastDeletedTaskItem?.taskId === primaryTaskId
  ) {
    rows.push(createDeletedTaskItemNotice(primaryTaskId));
  }
  if (globalEditingEnabled()) rows.push(createTaskItemAddRow(primaryTaskId));
  elements.workList.replaceChildren(...rows);

  elements.taskTotal.textContent = `0 / ${taskItems.length}`;
  elements.taskTotal.setAttribute("aria-label", `子項目完成 0，共 ${taskItems.length}`);
  const staleNote = elements.taskCard.querySelector(".task-structure-note")
    ?? document.createElement("p");
  staleNote.className = "task-structure-note";
  staleNote.textContent = "任務結構已在此瀏覽器修改；時間總量等待重新分析。";
  staleNote.hidden = !taskStructureChanged;
  if (!staleNote.isConnected) elements.workList.after(staleNote);
  if (analysis && taskStructureChanged) {
    elements.taskDuration.textContent = "時間待重新分析";
    elements.taskDuration.hidden = false;
  }
  renderAuxiliaryTaskItems();
  renderStatusOrder();
}

function renderBaseProgress() {
  const workPercent = Math.round(BASE_WORK_PROGRESS * 100);
  elements.progressValue.textContent = `整體約 ${workPercent}%`;
  elements.progressMeter.value = workPercent;
  elements.progressMeter.textContent = `${workPercent}%`;
  elements.progressMeter.setAttribute("aria-label", `整體進度 ${workPercent}%`);
}

function renderRuntimeRiskSurface(data) {
  const { summary } = data;
  const deadline = summary.deadline;
  if (!deadline) {
    const workPercent = Math.round(BASE_WORK_PROGRESS * 100);
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
  const workPercent = Math.round(deadline.work_progress_ratio * 100);

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

elements.globalEditSaveButton.addEventListener("click", saveTaskItemDrafts);

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
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refreshRuntimeRisk();
});

loadTaskContentOverrides();
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
