import {
  calculateDeadlineRisk,
  createTimeIndex,
} from "./time-model.js";

/*
 * Framework-neutral controller for the time-reference summary button and its
 * progress-report dialog (project detail and item detail). Editing the
 * project's own delivery date and capacity settings is not this module's
 * concern — that draft lives in `time-input-draft.js` and is rendered by
 * `TimeSettingsEditor.svelte`, mounted inside this dialog's project detail
 * by the host while a global edit session is open. This controller only
 * derives the read-only capacity figures shown in the 工作容量 tab.
 *
 * This is the data half of the split: every function here returns plain
 * objects, never DOM nodes, so any UI implementation can render them. A host
 * creates one controller per loaded report, calls a command after a reader
 * interaction, then reads `snapshot()` and pushes it into its two UI views —
 * the same "host owns state, component owns markup" contract as
 * `theme-control.js` and `editor-core-runtime.js`.
 */

const URGENCY_META = Object.freeze({
  on_track: { label: "交付可行", lamp: "綠色燈號", className: "on-track" },
  at_risk: { label: "交付有風險", lamp: "黃色燈號", className: "at-risk" },
  critical: { label: "交付不可行", lamp: "紅色燈號", className: "critical" },
  complete: { label: "已完成", lamp: "完成燈號", className: "on-track" },
});

const WEEKDAY_LABELS = new Map([
  [1, "一"],
  [2, "二"],
  [3, "三"],
  [4, "四"],
  [5, "五"],
  [6, "六"],
  [7, "日"],
]);

const CONTRIBUTOR_LABELS = Object.freeze({
  human_estimate: "人工估算",
  human_parameter: "人工參數",
  ai_analysis: "AI 分析",
  historical_evidence: "歷史資料",
  system_default: "預設",
  deterministic_formula: "固定公式",
});

const CONFIDENCE_LABELS = Object.freeze({
  low: "低信心",
  medium: "中等信心",
  high: "高信心",
});

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function hours(minutes) {
  return `${Math.round((minutes / 60) * 10) / 10} hr`;
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

function deliveryLabel(deadline) {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: deadline.schedule.timezone,
    month: "numeric",
    day: "numeric",
  }).format(new Date(deadline.delivery_at));
}

function formatTime(value, timeZone) {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function pressureLabel(deadline) {
  return Number.isFinite(deadline.progress_pressure_ratio)
    ? `${deadline.progress_pressure_ratio.toFixed(4)} ×`
    : "已無可用容量";
}

function publicRiskLabel(deadline, urgency) {
  if (deadline.boundary_state === "complete") return "已完成";
  if (deadline.boundary_state === "delivery_reached") return "已逾期";
  if (deadline.risk_basis === "capacity_shortfall") return "容量不足";
  if (deadline.risk_basis === "capacity_tight") return "容量緊繃";
  if (deadline.urgency === "critical") return "預計超期";
  return urgency.label;
}

export function remainingWorkload(summary, workProgressRatio) {
  if (Number.isFinite(summary.remaining_estimated_minutes)
    && summary.remaining_estimated_minutes >= 0) {
    return summary.remaining_estimated_minutes;
  }
  const factor = summary.execution_calibration.factor;
  const total = summary.calibrated_total_minutes
    ?? summary.total_estimated_minutes * factor;
  return total * (1 - Math.min(1, Math.max(0, workProgressRatio)));
}

function deliveryCountdown(deadline) {
  if (deadline.boundary_state === "complete") return "已完成";
  const difference =
    new Date(deadline.delivery_at).getTime() - new Date(deadline.evaluated_at).getTime();
  const absolute = Math.abs(difference);
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const amount = absolute >= day
    ? `${Math.ceil(absolute / day)} 日`
    : absolute >= hour
      ? `${Math.ceil(absolute / hour)} 小時`
      : "不到 1 小時";
  return difference > 0 ? amount : `已逾期 ${amount}`;
}

function workingDaysLabel(weekdays) {
  const sorted = [...weekdays].sort((left, right) => left - right);
  if (sorted.join(",") === "1,2,3,4,5") return "星期一至五";
  return sorted.map((day) => `週${WEEKDAY_LABELS.get(day)}`).join("、");
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
      text: "交付前排定容量已全部消耗，但工作仍未完成，因此判定為進度危急。",
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
    const capacityRatio = deadline.feasibility_ratio;
    return {
      text: `預估未完成工作將使用剩餘容量的 ${percent(capacityRatio)}，已超過 ${percent(deadline.schedule.risk_thresholds.capacity_at_risk_ratio ?? 0.8)} 的容量警戒線，因此判定為「容量緊繃」。`,
      formula: `${hours(deadline.remaining_estimated_minutes)} ÷ ${hours(deadline.remaining_capacity_minutes)} = ${capacityRatio.toFixed(4)}`,
    };
  }
  const pressure = deadline.progress_pressure_ratio;
  const thresholds = deadline.schedule.risk_thresholds;
  return {
    text: `可用容量已消耗 ${percent(deadline.time_progress_ratio)}，最後回報工作進度為 ${percent(deadline.work_progress_ratio)}。剩餘期間需要約 ${pressure.toFixed(4)} 倍原計畫速度，目前判定為「${urgency.label}」；綠燈上限 ${thresholds.on_track_max.toFixed(2)}，黃燈上限 ${thresholds.at_risk_max.toFixed(2)}。`,
    formula: `(1 - ${deadline.work_progress_ratio.toFixed(2)}) ÷ (1 - ${deadline.time_progress_ratio.toFixed(4)}) = ${pressure.toFixed(4)}`,
  };
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

function compositionRows(summary) {
  const values = summary.estimate_composition ?? {};
  const rows = [
    { label: "混合估算", value: hours(values.mixed_minutes ?? 0), note: "人工參數＋AI 分析＋固定公式" },
    { label: "人工直接估算", value: hours(values.manual_minutes ?? 0), note: "由使用者輸入最後估值" },
    { label: "預設", value: hours(values.default_minutes ?? 0), note: "缺少足夠工程資料" },
  ];
  if ((values.ai_minutes ?? 0) > 0) {
    rows.push({ label: "AI 估算", value: hours(values.ai_minutes), note: "沒有人工參數的 AI 分析" });
  }
  return rows;
}

function itemSourceBadges(item) {
  const kinds = new Set(item.contributors?.map((contributor) => contributor.kind) ?? []);
  const order = ["human_estimate", "human_parameter", "ai_analysis", "historical_evidence", "system_default"];
  return order
    .filter((kind) => kinds.has(kind))
    .map((kind) => ({ kind, label: CONTRIBUTOR_LABELS[kind] }));
}

export function createTimeReferenceController({
  sourceAnalysis,
  workProgressRatio,
}) {
  const analysis = cloneValue(sourceAnalysis);
  const deadlineAvailable = Boolean(analysis.summary.deadline);
  const currentWorkProgressRatio = Number.isFinite(workProgressRatio)
    ? Math.min(1, Math.max(0, workProgressRatio))
    : deadlineAvailable && Number.isFinite(analysis.summary.deadline.work_progress_ratio)
      ? analysis.summary.deadline.work_progress_ratio
      : 0;
  if (deadlineAvailable) {
    analysis.summary.deadline.work_progress_ratio = currentWorkProgressRatio;
  }
  const index = createTimeIndex(analysis);

  // Presentation state. Kept here rather than in a UI component because it
  // must survive the dialog closing and reopening (the active tab and the
  // details-expanded flag are shared across the project and item dialogs,
  // exactly as the original DOM controller shared one `detailsExpanded`).
  let detailsExpanded = false;
  let activeTab = "flow";
  let reportStructureStale = false;
  let dialogKind = null; // 'project' | 'item' | null
  let activeItem = null; // { item, title } when dialogKind === 'item'

  function updateDeadline(now = new Date()) {
    if (!deadlineAvailable) return;
    Object.assign(analysis.summary.deadline, calculateDeadlineRisk(analysis.summary.deadline, now));
  }

  function urgency() {
    if (!deadlineAvailable) return null;
    return URGENCY_META[analysis.summary.deadline.urgency] ?? URGENCY_META.at_risk;
  }

  function summaryViewModel() {
    if (reportStructureStale) {
      return {
        hidden: false,
        disabled: true,
        className: "time-summary-button stale",
        ariaLabel: "任務結構已變更，時間資料須儲存並重新分析",
        label: "時間待重新分析",
        showDot: false,
        showChevron: false,
      };
    }
    if (!deadlineAvailable) {
      return {
        hidden: false,
        disabled: false,
        className: "time-summary-button no-deadline",
        ariaLabel: "時間參考：交付日未定，查看工程估算",
        label: "交付日未定",
        showDot: false,
        showChevron: true,
      };
    }
    const deadline = analysis.summary.deadline;
    const meta = urgency();
    return {
      hidden: false,
      disabled: false,
      className: `time-summary-button ${meta.className}`,
      // Elapsed share of the delivery window rides here rather than being
      // appended to the core progress bar's description. The core bar reports
      // task progress and must not reach into a module's data to describe
      // itself; a reader who never opens the dialog still hears this, because
      // it is on the module's own capsule.
      ariaLabel: `工期摘要：${deliveryLabel(deadline)} 交付，${meta.lamp}，時間已使用 ${percent(deadline.time_progress_ratio)}`,
      label: `${deliveryLabel(deadline)} 交付`,
      showDot: true,
      showChevron: true,
    };
  }

  function flowViewModel(summary, deadline, meta, remaining) {
    const remainingCapacity = Math.max(0, deadline.total_capacity_minutes - deadline.elapsed_capacity_minutes);
    const balanceMinutes = remainingCapacity - remaining;
    return {
      intro: "工程需求與可工作時間分開計算；容量不足會優先判定交付不可行，再用進度壓力補充趨勢。",
      engineeringLane: {
        source: { label: "工程估算來源", value: "公式／AI／歷史／人工／預設", note: "預設 8 hr 只在缺少資料時使用" },
        result: {
          label: "預估未完成工時",
          value: hours(remaining),
          note: Number.isFinite(summary.remaining_estimated_minutes)
            ? "直接加總未完成項目的校準後估算"
            : "舊版資料：工程總估算 × 未完成比例",
        },
      },
      capacityLane: {
        source: { label: "工作容量設定", value: "每日分配／工作日／請假例外", note: "交付日前逐日加總可工作容量" },
        result: { label: "交付前剩餘容量", value: hours(remainingCapacity), note: "總容量 − 已消耗容量" },
      },
      merge: {
        label: "需求與容量比較",
        value: `${balanceMinutes >= 0 ? "容量餘裕" : "容量缺口"} ${hours(Math.abs(balanceMinutes))}`,
        note: balanceMinutes < 0 ? "容量不足會直接改為紅燈" : "使用超過 80% 剩餘容量時至少為黃燈",
        className: balanceMinutes >= 0 ? "time-evaluation-balance" : "time-evaluation-shortage",
      },
      risk: {
        trend: {
          label: "現行進度趨勢",
          value: `工作 ${percent(deadline.work_progress_ratio)}／時間 ${percent(deadline.time_progress_ratio)}`,
          note: `進度壓力 ${pressureLabel(deadline)}`,
        },
        result: {
          label: "目前風險評估",
          value: publicRiskLabel(deadline, meta),
          note: "deterministic-capacity-feasibility v0.3",
          className: `time-evaluation-risk ${meta.className}`,
        },
      },
      note: "v0.3 先檢查剩餘工程需求與真實工作容量：缺口為紅燈、容量使用率超過 80% 至少為黃燈；容量足夠時再採進度壓力判斷。",
    };
  }

  function engineeringViewModel(summary, deadline, meta, remaining) {
    const result = deadlineExplanation(deadline, meta);
    return {
      metrics: [
        { label: "工程總預估工時", value: hours(summary.total_estimated_minutes) },
        { label: "預估未完成工時", value: hours(remaining) },
        { label: "時間進度", value: percent(deadline.time_progress_ratio) },
        { label: "工作進度", value: percent(deadline.work_progress_ratio) },
        { label: "進度壓力", value: pressureLabel(deadline) },
        { label: "目前判定", value: meta.label },
        { label: "本次風險計算", value: formatTime(deadline.evaluated_at, deadline.schedule.timezone) },
      ],
      explanation: { className: meta.className, text: result.text, formula: result.formula },
      calibrationText: `目前因子 ${summary.execution_calibration.factor.toFixed(1)}，有效樣本 ${summary.execution_calibration.effective_sample_count ?? 0}。`,
      composition: compositionRows(summary),
    };
  }

  function estimateOnlyViewModel(summary, remaining) {
    const reportTime = analysis.inputs?.task_state_updated_at ?? analysis.as_of;
    return {
      intro: "工程工時可以獨立成立；設定交付日後才會加入容量與風險分析。",
      metrics: [
        { label: "工程總預估工時", value: hours(summary.total_estimated_minutes) },
        { label: "校準後總工時", value: hours(summary.calibrated_total_minutes) },
        { label: "預估未完成工時", value: hours(remaining) },
        { label: "工作進度", value: percent(currentWorkProgressRatio) },
        { label: "整體信心", value: CONFIDENCE_LABELS[summary.overall_confidence] ?? "未標示" },
        { label: "最後估算", value: formatTime(reportTime) },
      ],
      calibrationText: `目前因子 ${summary.execution_calibration.factor.toFixed(1)}，有效樣本 ${summary.execution_calibration.effective_sample_count ?? 0}。`,
      composition: compositionRows(summary),
    };
  }

  function capacityViewModel(summary, deadline) {
    const profile = capacityProfileFor(summary, deadline);
    const remainingCapacity = Math.max(0, deadline.total_capacity_minutes - deadline.elapsed_capacity_minutes);
    return {
      metrics: [
        { label: "每日工作容量", value: hours(profile.capacity_minutes_per_executor_day) },
        { label: "工作日", value: workingDaysLabel(profile.working_weekdays) },
        { label: "交付前總容量", value: hours(deadline.total_capacity_minutes) },
        { label: "交付前剩餘容量", value: hours(remainingCapacity) },
        { label: "每日睡眠", value: hours(profile.sleep_minutes_per_day) },
        { label: "每日生活時間", value: hours(profile.life_minutes_per_day) },
        { label: "其他固定不可工作", value: hours(profile.other_unavailable_minutes_per_day) },
        { label: "時區", value: deadline.schedule.timezone },
      ],
      formulaCode: `${hours(profile.total_minutes_per_day)} - ${hours(profile.sleep_minutes_per_day)} - ${hours(profile.life_minutes_per_day)} - ${hours(profile.other_unavailable_minutes_per_day)} = ${hours(profile.capacity_minutes_per_executor_day)}`,
      exceptionsHeading: `休假與例外（${profile.capacity_exceptions.length}）`,
      exceptions: profile.capacity_exceptions.length
        ? profile.capacity_exceptions.map((item) => ({
          label: item.date,
          value: hours(item.available_minutes),
          note: item.public_label || "工作容量例外",
        }))
        : null,
    };
  }

  function projectViewModel() {
    const { summary } = analysis;
    const toggleLabel = detailsExpanded ? "收合詳細資訊" : "詳細資訊";
    if (!deadlineAvailable) {
      const remaining = remainingWorkload(summary, currentWorkProgressRatio);
      const reportTime = analysis.inputs?.task_state_updated_at ?? analysis.as_of;
      return {
        hasDeadline: false,
        detailsExpanded,
        toggleLabel,
        captionLabel: "工程摘要",
        overview: [
          { label: "工程總預估工時", value: hours(summary.total_estimated_minutes) },
          { label: "預估未完成工時", value: hours(remaining) },
          { label: "交付日期", value: "交付日未定" },
        ],
        updatedLabel: `最後估算：${formatTime(reportTime)}`,
        estimateOnly: estimateOnlyViewModel(summary, remaining),
      };
    }
    const deadline = summary.deadline;
    const meta = urgency();
    const remaining = remainingWorkload(summary, currentWorkProgressRatio);
    const reportTime = analysis.inputs?.task_state_updated_at ?? analysis.as_of;
    return {
      hasDeadline: true,
      detailsExpanded,
      toggleLabel,
      captionLabel: "即時摘要",
      overview: [
        { label: "距離交付", value: deliveryCountdown(deadline) },
        { label: "預估未完成工時", value: hours(remaining) },
        { label: "風險評估", value: publicRiskLabel(deadline, meta), urgencyClassName: meta.className },
      ],
      updatedLabel: `最後回報：${formatTime(reportTime, deadline.schedule.timezone)}`,
      activeTab,
      tabs: [
        { name: "flow", label: "評估流程" },
        { name: "engineering", label: "工程估算" },
        { name: "capacity", label: "工作容量" },
      ],
      flow: flowViewModel(summary, deadline, meta, remaining),
      engineering: engineeringViewModel(summary, deadline, meta, remaining),
      capacity: capacityViewModel(summary, deadline),
    };
  }

  function itemViewModel(item, taskId) {
    return {
      taskId,
      itemId: item.item_id,
      likelyMinutes: item.likely_minutes,
      humanConfirmed: Boolean(item.human_confirmed),
      detailsExpanded,
      toggleLabel: detailsExpanded ? "收合詳細資訊" : "詳細資訊",
      confidenceLabel: CONFIDENCE_LABELS[item.confidence] ?? "信心未標示",
      confidenceClass: `time-confidence confidence-${item.confidence}`,
      sourceBadges: itemSourceBadges(item),
      likelyHoursLabel: hours(item.likely_minutes),
      rationale: item.explanation ?? "尚未提供估算依據。",
      technical: {
        metrics: [
          { label: "item_id", value: item.item_id },
          { label: "estimate_id", value: item.estimate_id ?? "未提供" },
          {
            label: "估算範圍",
            value: Number.isFinite(item.low_minutes) && Number.isFinite(item.high_minutes)
              ? `${hours(item.low_minutes)} – ${hours(item.high_minutes)}`
              : "未提供",
          },
          { label: "人工確認", value: item.human_confirmed ? "是" : "否" },
          { label: "估算模式", value: item.mode ?? "未提供" },
          { label: "算法", value: item.calculation?.algorithm_id ?? "未提供" },
        ],
        analysisMethod: item.analysis_method
          ? {
            name: item.analysis_method.name,
            version: item.analysis_method.version ?? "",
            note: item.analysis_method.explanation ?? "分析方法",
          }
          : null,
        formula: item.calculation?.formula ?? null,
        reference: item.reference ?? null,
      },
    };
  }

  function dialogViewModel() {
    if (dialogKind === "item" && activeItem) {
      return {
        open: true,
        kind: "item",
        kicker: "子項目工時",
        title: activeItem.title,
        item: itemViewModel(activeItem.item, activeItem.taskId),
        project: null,
      };
    }
    if (dialogKind === "project") {
      return {
        open: true,
        kind: "project",
        kicker: "時間參考",
        title: "進度報告",
        item: null,
        project: projectViewModel(),
      };
    }
    return { open: false, kind: null, kicker: "", title: "", item: null, project: null };
  }

  function snapshot() {
    return { summary: summaryViewModel(), dialog: dialogViewModel() };
  }

  function openProjectDetail() {
    dialogKind = "project";
    activeItem = null;
  }

  function closeDialog() {
    dialogKind = null;
    activeItem = null;
  }

  function toggleDetails() {
    detailsExpanded = !detailsExpanded;
  }

  function setActiveTab(name) {
    activeTab = name;
  }

  function itemTime(itemId) {
    if (reportStructureStale) return null;
    const item = index.items.get(itemId);
    if (!item) return null;
    return Object.freeze({
      item_id: itemId,
      label: hours(item.likely_minutes),
      likely_minutes: item.likely_minutes,
    });
  }

  function showItemTime(itemId, title, taskId = "") {
    const item = index.items.get(itemId);
    if (!item) return;
    dialogKind = "item";
    activeItem = { item, title, taskId };
  }

  function taskDuration(taskId) {
    if (reportStructureStale) return null;
    const task = index.tasks.get(taskId);
    return task ? hours(task.total_likely_minutes) : null;
  }

  function setReportStructureStale(stale) {
    reportStructureStale = Boolean(stale);
    if (reportStructureStale && dialogKind) {
      dialogKind = null;
      activeItem = null;
    }
  }

  function refresh(now = new Date()) {
    if (deadlineAvailable) updateDeadline(now);
  }

  // Deadline risk is computed against "now", not the generation-time
  // snapshot baked into the sidecar file — without this, the first render
  // would show whatever urgency happened to be true when the analysis was
  // generated, not the current one.
  refresh();

  return Object.freeze({
    analysis,
    deadlineAvailable,
    itemTime,
    refresh,
    setReportStructureStale,
    showItemTime,
    taskDuration,
    snapshot,
    openProjectDetail,
    closeDialog,
    toggleDetails,
    setActiveTab,
  });
}
