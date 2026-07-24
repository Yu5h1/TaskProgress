const ID_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function localDateTimeParts(value, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minuteOfDay: Number(values.hour) * 60 + Number(values.minute),
  };
}

function clockMinutes(value) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) throw new Error(`無效的本地時間：${value}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

function nextDate(date) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

function isoWeekday(date) {
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

export function resolveTimeAnalysisSource(
  reportSource,
  baseUrl,
  explicitTimeSource = undefined,
) {
  if (explicitTimeSource === "none") return null;
  if (explicitTimeSource) return new URL(explicitTimeSource, baseUrl);
  const reportUrl = new URL(reportSource, baseUrl);
  return new URL("time.analysis.json", reportUrl);
}

export function inspectTimeAnalysis(value, expectedScopeId) {
  const errors = [];
  const deadlineErrors = [];
  if (!isRecord(value)) {
    return {
      errors: ["time.analysis.json 的根節點必須是物件。"],
      deadlineAvailable: false,
      deadlineErrors,
    };
  }
  if (value.schema_version !== "0.2") errors.push("time.analysis.json schema_version 必須是 0.2。");
  if (value.scope_id !== expectedScopeId) {
    errors.push(`time.analysis.json scope_id 必須是 ${expectedScopeId}。`);
  }
  if (!isRecord(value.method)
    || typeof value.method.name !== "string"
    || typeof value.method.version !== "string") {
    errors.push("time.analysis.json 缺少有效的 method。");
  }
  if (!isRecord(value.summary)) {
    errors.push("time.analysis.json 缺少 summary。");
    return { errors, deadlineAvailable: false, deadlineErrors };
  }
  const summary = value.summary;
  for (const field of [
    "nominal_daily_capacity_minutes",
    "total_estimated_minutes",
    "calibrated_total_minutes",
  ]) {
    if (!Number.isFinite(summary[field]) || summary[field] < 0) {
      errors.push(`summary.${field} 必須是非負數值。`);
    }
  }
  if (!isRecord(summary.execution_calibration)
    || !Number.isFinite(summary.execution_calibration.factor)
    || summary.execution_calibration.factor <= 0) {
    errors.push("summary.execution_calibration.factor 必須大於零。");
  }
  const deadlineAvailable = isRecord(summary.deadline);
  if (deadlineAvailable) {
    if (!isRecord(summary.deadline.schedule)) {
      deadlineErrors.push("deadline.schedule 缺少或無效。");
    } else {
    const { deadline } = summary;
    if (Number.isNaN(Date.parse(deadline.started_at))
      || Number.isNaN(Date.parse(deadline.delivery_at))) {
      deadlineErrors.push("deadline 的開始或交付時間無效。");
    }
    const schedule = deadline.schedule;
    if (typeof schedule.timezone !== "string"
      || typeof schedule.workday_start_local !== "string"
      || typeof schedule.workday_end_local !== "string"
      || !isRecord(schedule.risk_thresholds)
      || !Array.isArray(schedule.capacity_timeline)
      || schedule.capacity_timeline.length === 0) {
      deadlineErrors.push("deadline.schedule 缺少重算風險所需資料。");
    }
    if (schedule.capacity_profile !== undefined) {
      const profile = schedule.capacity_profile;
      if (!isRecord(profile)
        || !Array.isArray(profile.working_weekdays)
        || !Array.isArray(profile.capacity_exceptions)) {
        deadlineErrors.push("deadline.schedule.capacity_profile 無效。");
      }
    }
    }
  }
  if (!Array.isArray(value.tasks)) {
    errors.push("time.analysis.json tasks 必須是陣列。");
    return { errors, deadlineAvailable: false, deadlineErrors };
  }
  const taskIds = new Set();
  const itemIds = new Set();
  value.tasks.forEach((task, taskIndex) => {
    if (!isRecord(task) || typeof task.task_id !== "string" || !ID_PATTERN.test(task.task_id)) {
      errors.push(`tasks[${taskIndex}].task_id 無效。`);
      return;
    }
    if (taskIds.has(task.task_id)) errors.push(`task_id「${task.task_id}」重複。`);
    taskIds.add(task.task_id);
    if (!Number.isFinite(task.total_likely_minutes) || !Array.isArray(task.items)) {
      errors.push(`tasks[${taskIndex}] 缺少工時或 items。`);
      return;
    }
    task.items.forEach((item, itemIndex) => {
      if (!isRecord(item)
        || typeof item.item_id !== "string"
        || !ID_PATTERN.test(item.item_id)
        || !Number.isFinite(item.likely_minutes)
        || !Number.isFinite(item.display_hours)) {
        errors.push(`tasks[${taskIndex}].items[${itemIndex}] 無效。`);
        return;
      }
      if (itemIds.has(item.item_id)) errors.push(`item_id「${item.item_id}」重複。`);
      itemIds.add(item.item_id);
    });
  });
  return {
    errors,
    deadlineAvailable: deadlineAvailable && deadlineErrors.length === 0,
    deadlineErrors,
  };
}

export function validateTimeAnalysis(value, expectedScopeId) {
  const result = inspectTimeAnalysis(value, expectedScopeId);
  return [...result.errors, ...result.deadlineErrors];
}

export function calculateDeadlineRisk(deadline, nowValue = new Date()) {
  const now = new Date(nowValue);
  if (Number.isNaN(now.getTime())) throw new Error("目前時間無效。");
  const deliveryAt = new Date(deadline.delivery_at);
  const startedAt = new Date(deadline.started_at);
  if (Number.isNaN(deliveryAt.getTime()) || Number.isNaN(startedAt.getTime())) {
    throw new Error("開始或交付時間無效。");
  }

  const schedule = deadline.schedule;
  const timeline = schedule.capacity_timeline;
  if (!Array.isArray(timeline) || timeline.length === 0) {
    throw new Error("期限前容量時間線不可為空。");
  }
  const dates = new Set();
  timeline.forEach((day) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
      throw new Error(`容量日期無效：${day.date}`);
    }
    if (dates.has(day.date)) throw new Error(`容量日期重複：${day.date}`);
    dates.add(day.date);
    if (!Number.isInteger(day.capacity_minutes) || day.capacity_minutes < 0) {
      throw new Error(`每日容量無效：${day.date}`);
    }
  });
  const totalCapacityMinutes = timeline.reduce(
    (total, day) => total + day.capacity_minutes,
    0,
  );
  if (!(totalCapacityMinutes > 0)) throw new Error("期限前總容量必須大於零。");

  const rawWorkProgressRatio = Number(deadline.work_progress_ratio);
  if (!Number.isFinite(rawWorkProgressRatio)) throw new Error("工作進度必須是有效數值。");
  const workProgressRatio = clamp(rawWorkProgressRatio, 0, 1);
  const startMinute = clockMinutes(schedule.workday_start_local);
  const endMinute = clockMinutes(schedule.workday_end_local);
  if (endMinute <= startMinute) throw new Error("每日工作結束時間必須晚於開始時間。");

  let elapsedCapacityMinutes = 0;
  if (now >= deliveryAt) {
    elapsedCapacityMinutes = totalCapacityMinutes;
  } else if (now > startedAt) {
    const localNow = localDateTimeParts(now, schedule.timezone);
    timeline.forEach((day) => {
      if (day.date < localNow.date) {
        elapsedCapacityMinutes += day.capacity_minutes;
      } else if (day.date === localNow.date) {
        const fraction = clamp(
          (localNow.minuteOfDay - startMinute) / (endMinute - startMinute),
          0,
          1,
        );
        elapsedCapacityMinutes += day.capacity_minutes * fraction;
      }
    });
  }

  elapsedCapacityMinutes = Math.round(
    clamp(elapsedCapacityMinutes, 0, totalCapacityMinutes),
  );
  const timeProgressRatio = elapsedCapacityMinutes / totalCapacityMinutes;
  const evaluatedAt = now.toISOString();

  if (workProgressRatio >= 1) {
    return {
      evaluated_at: evaluatedAt,
      elapsed_capacity_minutes: elapsedCapacityMinutes,
      total_capacity_minutes: totalCapacityMinutes,
      time_progress_ratio: timeProgressRatio,
      work_progress_ratio: workProgressRatio,
      progress_pressure_ratio: 0,
      boundary_state: "complete",
      urgency: "complete",
    };
  }
  if (now >= deliveryAt) {
    return {
      evaluated_at: evaluatedAt,
      elapsed_capacity_minutes: totalCapacityMinutes,
      total_capacity_minutes: totalCapacityMinutes,
      time_progress_ratio: 1,
      work_progress_ratio: workProgressRatio,
      boundary_state: "delivery_reached",
      urgency: "critical",
    };
  }
  if (timeProgressRatio >= 1) {
    return {
      evaluated_at: evaluatedAt,
      elapsed_capacity_minutes: totalCapacityMinutes,
      total_capacity_minutes: totalCapacityMinutes,
      time_progress_ratio: 1,
      work_progress_ratio: workProgressRatio,
      boundary_state: "capacity_exhausted",
      urgency: "critical",
    };
  }

  const progressPressureRatio = (1 - workProgressRatio) / (1 - timeProgressRatio);
  const thresholds = schedule.risk_thresholds;
  if (!isRecord(thresholds)
    || !Number.isFinite(thresholds.on_track_max)
    || !Number.isFinite(thresholds.at_risk_max)
    || thresholds.on_track_max <= 0
    || thresholds.at_risk_max < thresholds.on_track_max) {
    throw new Error("風險門檻無效。");
  }
  const urgency = progressPressureRatio <= thresholds.on_track_max
    ? "on_track"
    : progressPressureRatio <= thresholds.at_risk_max
      ? "at_risk"
      : "critical";
  return {
    evaluated_at: evaluatedAt,
    elapsed_capacity_minutes: elapsedCapacityMinutes,
    total_capacity_minutes: totalCapacityMinutes,
    time_progress_ratio: timeProgressRatio,
    work_progress_ratio: workProgressRatio,
    progress_pressure_ratio: progressPressureRatio,
    boundary_state: "active",
    urgency,
  };
}

export function buildCapacityTimeline(deadline, profile) {
  const fixedMinutes = [
    profile.sleep_minutes_per_day,
    profile.life_minutes_per_day,
    profile.other_unavailable_minutes_per_day,
  ];
  const derivedCapacity = profile.total_minutes_per_day
    - fixedMinutes.reduce((total, value) => total + value, 0);
  if (!fixedMinutes.every((value) => Number.isInteger(value) && value >= 0)
    || derivedCapacity <= 0
    || derivedCapacity !== profile.capacity_minutes_per_executor_day
    || !Array.isArray(profile.working_weekdays)
    || profile.working_weekdays.length === 0
    || !Array.isArray(profile.capacity_exceptions)) {
    throw new Error("工作容量設定無效。");
  }
  const startDate = deadline.started_at.slice(0, 10);
  const deliveryDate = deadline.delivery_at.slice(0, 10);
  const workingDays = new Set(profile.working_weekdays);
  const exceptions = new Map(
    profile.capacity_exceptions.map((exception) => [exception.date, exception]),
  );
  const timeline = [];
  for (let date = startDate; date < deliveryDate; date = nextDate(date)) {
    const exception = exceptions.get(date);
    if (!workingDays.has(isoWeekday(date)) && !exception) continue;
    timeline.push({
      date,
      capacity_minutes: exception
        ? exception.available_minutes
        : profile.capacity_minutes_per_executor_day,
    });
  }
  if (!timeline.some((day) => day.capacity_minutes > 0)) {
    throw new Error("交付前必須至少保留一段可工作容量。");
  }
  return timeline;
}

export function parseCapacityExceptions(value) {
  const dates = new Set();
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [date = "", hourText = "", ...labelParts] = line
        .split("|")
        .map((part) => part.trim());
      const parsedDate = new Date(`${date}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)
        || Number.isNaN(parsedDate.getTime())
        || parsedDate.toISOString().slice(0, 10) !== date) {
        throw new Error(`第 ${index + 1} 筆例外日期無效。`);
      }
      if (dates.has(date)) throw new Error(`例外日期重複：${date}`);
      dates.add(date);
      const availableHours = Number(hourText);
      if (!Number.isFinite(availableHours) || availableHours < 0 || availableHours > 24) {
        throw new Error(`第 ${index + 1} 筆可工作時數必須介於 0 至 24。`);
      }
      return {
        date,
        available_minutes: Math.round(availableHours * 60),
        public_label: labelParts.join(" | ") || "其他不可工作時間",
      };
    });
}

export function canUseLocalTimeOverrides(locationLike) {
  if (locationLike.protocol === "file:") return true;
  if (!["http:", "https:"].includes(locationLike.protocol)) return false;
  const hostname = String(locationLike.hostname ?? "").toLowerCase();
  return hostname === "localhost"
    || hostname === "127.0.0.1"
    || hostname === "::1"
    || hostname === "[::1]";
}

export function createTimeIndex(analysis) {
  const tasks = new Map();
  const items = new Map();
  analysis.tasks.forEach((task) => {
    tasks.set(task.task_id, task);
    task.items.forEach((item) => items.set(item.item_id, item));
  });
  return { tasks, items };
}
