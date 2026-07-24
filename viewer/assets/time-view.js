import {
  buildCapacityTimeline,
  calculateDeadlineRisk,
  canUseLocalTimeOverrides,
  createTimeIndex,
  parseCapacityExceptions,
} from "./time-model.js";

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

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

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

function metric(label, value) {
  const node = el("div", "time-metric");
  node.append(el("span", "", label), el("strong", "", value));
  return node;
}

function sourceRow(label, value, note) {
  const row = el("div", "time-source-row");
  const copy = el("div");
  copy.append(el("strong", "", label), el("p", "", note));
  row.append(copy, el("span", "", value));
  return row;
}

function summaryField(label, value, urgency = null) {
  const node = el("div", "time-report-field");
  const result = el("strong");
  if (urgency) {
    const lamp = el("span", `time-risk-dot ${urgency.className}`);
    lamp.setAttribute("aria-hidden", "true");
    result.append(lamp);
  }
  result.append(value);
  node.append(el("span", "", label), result);
  return node;
}

function evaluationNode(label, value, note, className = "") {
  const node = el("div", `time-evaluation-node ${className}`.trim());
  node.append(
    el("span", "", label),
    el("strong", "", value),
    el("small", "", note),
  );
  return node;
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

export function createTimeReferenceController({
  sourceAnalysis,
  report,
  location,
  summaryButton,
  dialog,
  dialogKicker,
  dialogTitle,
  dialogContent,
  workProgressRatio,
  onRiskChange,
}) {
  const analysis = cloneValue(sourceAnalysis);
  const deadlineAvailable = Boolean(analysis.summary.deadline);
  const currentWorkProgressRatio = Number.isFinite(workProgressRatio)
    ? Math.min(1, Math.max(0, workProgressRatio))
    : deadlineAvailable && Number.isFinite(analysis.summary.deadline.work_progress_ratio)
      ? analysis.summary.deadline.work_progress_ratio
      : 0;
  if (deadlineAvailable) {
    analysis.summary.deadline.work_progress_ratio =
      currentWorkProgressRatio;
  }
  const index = createTimeIndex(analysis);
  const localOverridesAllowed = canUseLocalTimeOverrides(location);
  const storageKey = `taskprogress.time-capacity.${report.scope_id}.v1`;
  let detailsExpanded = false;
  let activeTab = "flow";
  let capacityEditorOpen = false;
  let currentDialog = null;

  function applyCapacityProfile(profile) {
    const safeProfile = cloneValue(profile);
    const deadline = analysis.summary.deadline;
    deadline.schedule.capacity_profile = safeProfile;
    deadline.schedule.capacity_timeline = buildCapacityTimeline(deadline, safeProfile);
    analysis.summary.nominal_daily_capacity_minutes =
      safeProfile.capacity_minutes_per_executor_day;
  }

  if (deadlineAvailable && localOverridesAllowed) {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (stored?.profile) applyCapacityProfile(stored.profile);
    } catch {
      // Invalid or unavailable local storage must not block the published report.
    }
  }

  function updateDeadline(now = new Date()) {
    if (!deadlineAvailable) return;
    Object.assign(
      analysis.summary.deadline,
      calculateDeadlineRisk(analysis.summary.deadline, now),
    );
  }

  function urgency() {
    if (!deadlineAvailable) return null;
    return URGENCY_META[analysis.summary.deadline.urgency] ?? URGENCY_META.at_risk;
  }

  function renderSummaryButton() {
    if (!deadlineAvailable) {
      summaryButton.hidden = false;
      summaryButton.disabled = false;
      summaryButton.className = "time-summary-button no-deadline";
      summaryButton.replaceChildren(
        el("span", "", "交付日未定"),
        el("span", "time-chevron", "›"),
      );
      summaryButton.setAttribute("aria-label", "時間參考：交付日未定，查看工程估算");
      return;
    }
    const deadline = analysis.summary.deadline;
    const meta = urgency();
    summaryButton.hidden = false;
    summaryButton.disabled = false;
    summaryButton.className = `time-summary-button ${meta.className}`;
    summaryButton.replaceChildren(
      el("span", "", `${deliveryLabel(deadline)} 交付`),
      el("span", "time-risk-dot"),
      el("span", "time-chevron", "›"),
    );
    summaryButton.setAttribute(
      "aria-label",
      `工期摘要：${deliveryLabel(deadline)} 交付，${meta.lamp}`,
    );
    onRiskChange?.(deadline);
  }

  function openDialog(kicker, title, content, kind) {
    dialogKicker.textContent = kicker;
    dialogTitle.textContent = title;
    dialogContent.replaceChildren(content);
    dialog.dataset.timeDialog = kind;
    currentDialog = kind;
    if (!dialog.open) dialog.showModal();
  }

  function createFlowPanel(summary, deadline, meta, remaining) {
    const panel = el("section", "time-tab-panel time-flow-panel");
    panel.id = "time-flow-panel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", "time-flow-tab");
    panel.append(el(
      "p",
      "time-flow-intro",
      "工程需求與可工作時間分開計算；容量不足會優先判定交付不可行，再用進度壓力補充趨勢。",
    ));
    const remainingCapacity = Math.max(
      0,
      deadline.total_capacity_minutes - deadline.elapsed_capacity_minutes,
    );
    const balanceMinutes = remainingCapacity - remaining;
    const lanes = el("div", "time-flow-lanes");
    const engineeringLane = el("section", "time-flow-lane");
    engineeringLane.setAttribute("aria-label", "工程估算路徑");
    engineeringLane.append(
      evaluationNode(
        "工程估算來源",
        "公式／AI／歷史／人工／預設",
        "預設 8 hr 只在缺少資料時使用",
      ),
      el("span", "time-flow-arrow", "→"),
      evaluationNode(
        "預估未完成工時",
        hours(remaining),
        Number.isFinite(summary.remaining_estimated_minutes)
          ? "直接加總未完成項目的校準後估算"
          : "舊版資料：工程總估算 × 未完成比例",
        "time-evaluation-result",
      ),
    );
    const capacityLane = el("section", "time-flow-lane");
    capacityLane.setAttribute("aria-label", "工作容量路徑");
    capacityLane.append(
      evaluationNode(
        "工作容量設定",
        "每日分配／工作日／請假例外",
        "交付日前逐日加總可工作容量",
      ),
      el("span", "time-flow-arrow", "→"),
      evaluationNode(
        "交付前剩餘容量",
        hours(remainingCapacity),
        "總容量 − 已消耗容量",
        "time-evaluation-result",
      ),
    );
    lanes.append(engineeringLane, capacityLane);

    const merge = el("div", "time-flow-merge");
    const balanceLabel = balanceMinutes >= 0 ? "容量餘裕" : "容量缺口";
    merge.append(
      el("span", "time-flow-arrow", "↓"),
      evaluationNode(
        "需求與容量比較",
        `${balanceLabel} ${hours(Math.abs(balanceMinutes))}`,
        balanceMinutes < 0
          ? "容量不足會直接改為紅燈"
          : "使用超過 80% 剩餘容量時至少為黃燈",
        balanceMinutes >= 0 ? "time-evaluation-balance" : "time-evaluation-shortage",
      ),
    );

    const risk = el("div", "time-flow-lane time-flow-risk");
    risk.append(
      evaluationNode(
        "現行進度趨勢",
        `工作 ${percent(deadline.work_progress_ratio)}／時間 ${percent(deadline.time_progress_ratio)}`,
        `進度壓力 ${pressureLabel(deadline)}`,
      ),
      el("span", "time-flow-arrow", "→"),
      evaluationNode(
        "目前風險評估",
        publicRiskLabel(deadline, meta),
        "deterministic-capacity-feasibility v0.3",
        `time-evaluation-risk ${meta.className}`,
      ),
    );
    panel.append(
      lanes,
      merge,
      risk,
      el(
        "p",
        "time-flow-note",
        "v0.3 先檢查剩餘工程需求與真實工作容量：缺口為紅燈、容量使用率超過 80% 至少為黃燈；容量足夠時再採進度壓力判斷。",
      ),
    );
    return panel;
  }

  function createEngineeringPanel(summary, deadline, meta, remaining) {
    const panel = el("section", "time-tab-panel");
    panel.id = "time-engineering-panel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", "time-engineering-tab");
    const grid = el("div", "time-metric-grid");
    grid.append(
      metric("工程總預估工時", hours(summary.total_estimated_minutes)),
      metric("預估未完成工時", hours(remaining)),
      metric("時間進度", percent(deadline.time_progress_ratio)),
      metric("工作進度", percent(deadline.work_progress_ratio)),
      metric("進度壓力", pressureLabel(deadline)),
      metric("目前判定", meta.label),
      metric("本次風險計算", formatTime(deadline.evaluated_at, deadline.schedule.timezone)),
    );
    const explanation = el("section", "time-explanation-card");
    const explanationTitle = el("h3", "time-formula-heading");
    const lamp = el("span", `time-risk-dot ${meta.className}`);
    lamp.setAttribute("aria-hidden", "true");
    explanationTitle.append(lamp, "風險評估公式");
    const result = deadlineExplanation(deadline, meta);
    explanation.append(
      explanationTitle,
      el("p", "", result.text),
      el("code", "time-formula", result.formula),
    );
    const calibration = el("section", "time-explanation-card");
    calibration.append(
      el("h3", "", "執行校準"),
      el(
        "p",
        "",
        `目前因子 ${summary.execution_calibration.factor.toFixed(1)}，有效樣本 ${summary.execution_calibration.effective_sample_count ?? 0}。`,
      ),
    );
    const composition = el("section", "time-composition");
    composition.append(el("h3", "", "估算組成"));
    const list = el("div", "time-source-list");
    const values = summary.estimate_composition ?? {};
    list.append(
      sourceRow("混合估算", hours(values.mixed_minutes ?? 0), "人工參數＋AI 分析＋固定公式"),
      sourceRow("人工直接估算", hours(values.manual_minutes ?? 0), "由使用者輸入最後估值"),
      sourceRow("預設", hours(values.default_minutes ?? 0), "缺少足夠工程資料"),
    );
    if ((values.ai_minutes ?? 0) > 0) {
      list.append(sourceRow("AI 估算", hours(values.ai_minutes), "沒有人工參數的 AI 分析"));
    }
    composition.append(list);
    panel.append(grid, explanation, calibration, composition);
    return panel;
  }

  function createEstimateOnlyEngineeringPanel(summary, remaining) {
    const panel = el("section", "time-tab-panel time-estimate-only-panel");
    const reportTime = analysis.inputs?.task_state_updated_at ?? analysis.as_of;
    const grid = el("div", "time-metric-grid");
    grid.append(
      metric("工程總預估工時", hours(summary.total_estimated_minutes)),
      metric("校準後總工時", hours(summary.calibrated_total_minutes)),
      metric("預估未完成工時", hours(remaining)),
      metric("工作進度", percent(currentWorkProgressRatio)),
      metric("整體信心", CONFIDENCE_LABELS[summary.overall_confidence] ?? "未標示"),
      metric("最後估算", formatTime(reportTime)),
    );
    const calibration = el("section", "time-explanation-card");
    calibration.append(
      el("h3", "", "執行校準"),
      el(
        "p",
        "",
        `目前因子 ${summary.execution_calibration.factor.toFixed(1)}，有效樣本 ${summary.execution_calibration.effective_sample_count ?? 0}。`,
      ),
    );
    const composition = el("section", "time-composition");
    composition.append(el("h3", "", "估算組成"));
    const list = el("div", "time-source-list");
    const values = summary.estimate_composition ?? {};
    list.append(
      sourceRow("混合估算", hours(values.mixed_minutes ?? 0), "人工參數＋AI 分析＋固定公式"),
      sourceRow("人工直接估算", hours(values.manual_minutes ?? 0), "由使用者輸入最後估值"),
      sourceRow("預設", hours(values.default_minutes ?? 0), "缺少足夠工程資料"),
    );
    if ((values.ai_minutes ?? 0) > 0) {
      list.append(sourceRow("AI 估算", hours(values.ai_minutes), "沒有人工參數的 AI 分析"));
    }
    composition.append(list);
    panel.append(
      el("p", "time-flow-intro", "工程工時可以獨立成立；設定交付日後才會加入容量與風險分析。"),
      grid,
      calibration,
      composition,
    );
    return panel;
  }

  function capacityHourInput(name, label, minutes) {
    const field = el("label", "time-editor-field");
    const input = el("input");
    input.type = "number";
    input.name = name;
    input.min = "0";
    input.max = "24";
    input.step = "0.5";
    input.required = true;
    input.value = String(Math.round((minutes / 60) * 10) / 10);
    const control = el("span", "time-editor-control");
    control.append(input, el("span", "", "hr"));
    field.append(el("span", "", label), control);
    return field;
  }

  function createCapacityEditor(profile) {
    const form = el("form", "time-capacity-editor");
    const heading = el("div", "time-editor-heading");
    heading.append(
      el("h3", "", "編輯工作容量"),
      el("span", "", "本機瀏覽器暫存，不修改來源檔"),
    );
    const fields = el("div", "time-editor-fields");
    fields.append(
      capacityHourInput("sleep_hours", "每日睡眠", profile.sleep_minutes_per_day),
      capacityHourInput("life_hours", "每日生活時間", profile.life_minutes_per_day),
      capacityHourInput(
        "other_hours",
        "其他固定不可工作",
        profile.other_unavailable_minutes_per_day,
      ),
    );
    const derived = el("p", "time-capacity-derived");
    const updateDerived = () => {
      const values = new FormData(form);
      const unavailable = ["sleep_hours", "life_hours", "other_hours"]
        .reduce((total, name) => total + Number(values.get(name) ?? 0), 0);
      derived.textContent = 24 - unavailable > 0
        ? `每日工作容量：${Math.round((24 - unavailable) * 10) / 10} hr`
        : "每日工作容量必須大於 0 hr";
    };
    const weekdays = el("fieldset", "time-weekdays");
    weekdays.append(el("legend", "", "工作日"));
    WEEKDAY_LABELS.forEach((label, day) => {
      const option = el("label");
      const input = el("input");
      input.type = "checkbox";
      input.name = "working_weekday";
      input.value = String(day);
      input.checked = profile.working_weekdays.includes(day);
      option.append(input, `週${label}`);
      weekdays.append(option);
    });
    const exceptionsField = el("label", "time-exceptions-editor");
    const exceptions = el("textarea");
    exceptions.name = "capacity_exceptions";
    exceptions.rows = 4;
    exceptions.placeholder = "2026-07-29 | 0 | 休假";
    exceptions.value = profile.capacity_exceptions
      .map((item) => (
        `${item.date} | ${Math.round((item.available_minutes / 60) * 10) / 10} | ${item.public_label ?? ""}`
      ))
      .join("\n");
    exceptionsField.append(
      el("span", "", "休假與例外"),
      exceptions,
      el("small", "", "每行：日期 | 當日可工作 hr | 公開標籤"),
    );
    const error = el("p", "time-editor-error");
    error.hidden = true;
    const actions = el("div", "time-editor-actions");
    const cancel = el("button", "secondary-button", "取消");
    cancel.type = "button";
    const submit = el("button", "primary-button", "重新計算");
    submit.type = "submit";
    actions.append(cancel, submit);
    form.append(heading, fields, derived, weekdays, exceptionsField, error, actions);
    form.addEventListener("input", updateDerived);
    cancel.addEventListener("click", () => {
      capacityEditorOpen = false;
      showProjectDetail();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      error.hidden = true;
      try {
        const values = new FormData(form);
        const sleep = Math.round(Number(values.get("sleep_hours")) * 60);
        const life = Math.round(Number(values.get("life_hours")) * 60);
        const other = Math.round(Number(values.get("other_hours")) * 60);
        const capacity = 1440 - sleep - life - other;
        if (![sleep, life, other].every((value) => Number.isFinite(value) && value >= 0)
          || capacity <= 0) {
          throw new Error("睡眠、生活與其他時間合計必須小於 24 hr。");
        }
        const nextProfile = {
          total_minutes_per_day: 1440,
          sleep_minutes_per_day: sleep,
          life_minutes_per_day: life,
          other_unavailable_minutes_per_day: other,
          capacity_minutes_per_executor_day: capacity,
          working_weekdays: values.getAll("working_weekday").map(Number),
          capacity_exceptions: parseCapacityExceptions(
            String(values.get("capacity_exceptions") ?? ""),
          ),
        };
        if (nextProfile.working_weekdays.length === 0) {
          throw new Error("至少選擇一個工作日。");
        }
        applyCapacityProfile(nextProfile);
        localStorage.setItem(storageKey, JSON.stringify({
          profile: nextProfile,
          updated_at: new Date().toISOString(),
        }));
        capacityEditorOpen = false;
        activeTab = "capacity";
        refresh();
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
    const panel = el("section", "time-tab-panel");
    panel.id = "time-capacity-panel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", "time-capacity-tab");
    const toolbar = el("div", "time-capacity-toolbar");
    toolbar.append(el(
      "p",
      "",
      "工作容量由每日分配、工作日及休假例外共同產生。",
    ));
    if (localOverridesAllowed) {
      const edit = el("button", "time-small-button", capacityEditorOpen ? "編輯中" : "編輯");
      edit.type = "button";
      edit.disabled = capacityEditorOpen;
      edit.addEventListener("click", () => {
        capacityEditorOpen = true;
        showProjectDetail();
      });
      toolbar.append(edit);
    }
    const remainingCapacity = Math.max(
      0,
      deadline.total_capacity_minutes - deadline.elapsed_capacity_minutes,
    );
    const grid = el("div", "time-metric-grid");
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
    const formula = el("section", "time-explanation-card");
    formula.append(
      el("h3", "", "每日容量公式"),
      el("p", "", "固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。"),
      el(
        "code",
        "time-formula",
        `${hours(profile.total_minutes_per_day)} - ${hours(profile.sleep_minutes_per_day)} - ${hours(profile.life_minutes_per_day)} - ${hours(profile.other_unavailable_minutes_per_day)} = ${hours(profile.capacity_minutes_per_executor_day)}`,
      ),
    );
    const exceptions = el("section", "time-composition");
    exceptions.append(el("h3", "", `休假與例外（${profile.capacity_exceptions.length}）`));
    const list = el("div", "time-source-list");
    if (profile.capacity_exceptions.length) {
      list.append(...profile.capacity_exceptions.map((item) => sourceRow(
        item.date,
        hours(item.available_minutes),
        item.public_label || "工作容量例外",
      )));
    } else {
      list.append(el("p", "time-empty-note", "目前沒有休假或其他容量例外。"));
    }
    exceptions.append(list);
    panel.append(toolbar, grid, formula, exceptions);
    if (capacityEditorOpen && localOverridesAllowed) {
      panel.append(createCapacityEditor(profile));
    }
    return panel;
  }

  function showProjectDetail() {
    const { summary } = analysis;
    if (!deadlineAvailable) {
      const remaining = remainingWorkload(summary, currentWorkProgressRatio);
      const content = el("div");
      const toolbar = el("div", "time-detail-toolbar");
      const toggle = el(
        "button",
        "time-small-button",
        detailsExpanded ? "收合詳細資訊" : "詳細資訊",
      );
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", String(detailsExpanded));
      toolbar.append(el("span", "time-report-caption", "工程摘要"), toggle);
      const overview = el("section", "time-report-overview");
      const overviewGrid = el("div", "time-report-grid");
      overviewGrid.append(
        summaryField("工程總預估工時", hours(summary.total_estimated_minutes)),
        summaryField("預估未完成工時", hours(remaining)),
        summaryField("交付日期", "交付日未定"),
      );
      const reportTime = analysis.inputs?.task_state_updated_at ?? analysis.as_of;
      overview.append(
        overviewGrid,
        el("p", "time-report-updated", `最後估算：${formatTime(reportTime)}`),
      );
      const details = el("section", "time-project-details");
      details.hidden = !detailsExpanded;
      details.append(createEstimateOnlyEngineeringPanel(summary, remaining));
      toggle.addEventListener("click", () => {
        detailsExpanded = !detailsExpanded;
        showProjectDetail();
      });
      content.append(toolbar, overview, details);
      openDialog("時間參考", "進度報告", content, "project");
      return;
    }
    const deadline = summary.deadline;
    const meta = urgency();
    const remaining = remainingWorkload(summary, currentWorkProgressRatio);
    const content = el("div");
    const toolbar = el("div", "time-detail-toolbar");
    const toggle = el(
      "button",
      "time-small-button",
      detailsExpanded ? "收合詳細資訊" : "詳細資訊",
    );
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", String(detailsExpanded));
    toolbar.append(el("span", "time-report-caption", "即時摘要"), toggle);
    const overview = el("section", "time-report-overview");
    const overviewGrid = el("div", "time-report-grid");
    overviewGrid.append(
      summaryField("距離交付", deliveryCountdown(deadline)),
      summaryField("預估未完成工時", hours(remaining)),
      summaryField("風險評估", publicRiskLabel(deadline, meta), meta),
    );
    const reportTime = analysis.inputs?.task_state_updated_at ?? analysis.as_of;
    overview.append(
      overviewGrid,
      el(
        "p",
        "time-report-updated",
        `最後回報：${formatTime(reportTime, deadline.schedule.timezone)}`,
      ),
    );

    const details = el("section", "time-project-details");
    details.hidden = !detailsExpanded;
    const tabList = el("div", "time-tab-list");
    tabList.setAttribute("role", "tablist");
    tabList.setAttribute("aria-label", "進度報告詳細資訊");
    const definitions = [
      ["flow", "評估流程"],
      ["engineering", "工程估算"],
      ["capacity", "工作容量"],
    ];
    const panels = {
      flow: createFlowPanel(summary, deadline, meta, remaining),
      engineering: createEngineeringPanel(summary, deadline, meta, remaining),
      capacity: createCapacityPanel(summary, deadline),
    };
    const tabs = definitions.map(([name, label]) => {
      const button = el("button", "time-tab", label);
      button.id = `time-${name}-tab`;
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", `time-${name}-panel`);
      tabList.append(button);
      return { name, button, panel: panels[name] };
    });
    const activate = (name, focus = false) => {
      activeTab = name;
      tabs.forEach((tab) => {
        const selected = tab.name === name;
        tab.button.setAttribute("aria-selected", String(selected));
        tab.button.tabIndex = selected ? 0 : -1;
        tab.panel.hidden = !selected;
        if (selected && focus) tab.button.focus();
      });
    };
    tabs.forEach((tab, indexValue) => {
      tab.button.addEventListener("click", () => activate(tab.name));
      tab.button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (indexValue + direction + tabs.length) % tabs.length;
        activate(tabs[nextIndex].name, true);
      });
    });
    activate(activeTab);
    details.append(tabList, panels.flow, panels.engineering, panels.capacity);
    toggle.addEventListener("click", () => {
      detailsExpanded = !detailsExpanded;
      showProjectDetail();
    });
    content.append(toolbar, overview, details);
    openDialog("時間參考", "進度報告", content, "project");
  }

  function itemSourceBadges(item) {
    const kinds = new Set(item.contributors?.map((itemValue) => itemValue.kind) ?? []);
    const visible = [];
    if (kinds.has("human_estimate")) visible.push("human_estimate");
    if (kinds.has("human_parameter")) visible.push("human_parameter");
    if (kinds.has("ai_analysis")) visible.push("ai_analysis");
    if (kinds.has("historical_evidence")) visible.push("historical_evidence");
    if (kinds.has("system_default")) visible.push("system_default");
    return visible.map((kind) => el(
      "span",
      `time-source-badge source-${kind}`,
      CONTRIBUTOR_LABELS[kind],
    ));
  }

  function showItemDetail(item, title) {
    const content = el("div");
    const toolbar = el("div", "time-detail-toolbar");
    const toggle = el(
      "button",
      "time-small-button",
      detailsExpanded ? "收合詳細資訊" : "詳細資訊",
    );
    toggle.type = "button";
    toolbar.append(
      el(
        "span",
        `time-confidence confidence-${item.confidence}`,
        CONFIDENCE_LABELS[item.confidence] ?? "信心未標示",
      ),
      toggle,
    );
    const readout = el("section", "time-estimate-readout");
    const meta = el("div", "time-estimate-meta");
    meta.append(el("span", "", "預估工時"), ...itemSourceBadges(item));
    readout.append(meta, el("strong", "", hours(item.likely_minutes)));
    const rationale = el("section", "time-explanation-card time-item-rationale");
    rationale.append(
      el("h3", "", "估算依據"),
      el("p", "", item.explanation ?? "尚未提供估算依據。"),
    );
    const technical = el("section", "time-item-technical");
    technical.hidden = !detailsExpanded;
    const grid = el("div", "time-metric-grid");
    grid.append(
      metric("item_id", item.item_id),
      metric("estimate_id", item.estimate_id ?? "未提供"),
      metric(
        "估算範圍",
        Number.isFinite(item.low_minutes) && Number.isFinite(item.high_minutes)
          ? `${hours(item.low_minutes)} – ${hours(item.high_minutes)}`
          : "未提供",
      ),
      metric("人工確認", item.human_confirmed ? "是" : "否"),
      metric("估算模式", item.mode ?? "未提供"),
      metric("算法", item.calculation?.algorithm_id ?? "未提供"),
    );
    technical.append(grid);
    if (item.analysis_method) {
      technical.append(sourceRow(
        item.analysis_method.name,
        item.analysis_method.version ?? "",
        item.analysis_method.explanation ?? "分析方法",
      ));
    }
    if (item.calculation?.formula) {
      const formula = el("section", "time-explanation-card");
      formula.append(
        el("h3", "", "固定公式"),
        el("code", "time-formula", item.calculation.formula),
      );
      technical.append(formula);
    }
    if (item.reference) {
      technical.append(el("code", "time-reference", item.reference));
    }
    toggle.addEventListener("click", () => {
      detailsExpanded = !detailsExpanded;
      showItemDetail(item, title);
    });
    content.append(toolbar, readout, rationale, technical);
    openDialog("子項目工時", title, content, "item");
  }

  function createItemTimeButton(itemId, title) {
    const item = index.items.get(itemId);
    if (!item) return null;
    const button = el("button", "time-item-button", hours(item.likely_minutes));
    button.type = "button";
    button.setAttribute("aria-label", `${title}，${hours(item.likely_minutes)}，查看估算依據`);
    button.addEventListener("click", () => showItemDetail(item, title));
    return button;
  }

  function taskDuration(taskId) {
    const task = index.tasks.get(taskId);
    return task ? hours(task.total_likely_minutes) : null;
  }

  function refresh(now = new Date()) {
    if (deadlineAvailable) updateDeadline(now);
    renderSummaryButton();
    if (dialog.open && currentDialog === "project" && !capacityEditorOpen) {
      showProjectDetail();
    }
  }

  summaryButton.addEventListener("click", showProjectDetail);
  dialog.addEventListener("close", () => {
    capacityEditorOpen = false;
    currentDialog = null;
    delete dialog.dataset.timeDialog;
  });
  refresh();

  return Object.freeze({
    analysis,
    createItemTimeButton,
    deadlineAvailable,
    refresh,
    taskDuration,
  });
}
