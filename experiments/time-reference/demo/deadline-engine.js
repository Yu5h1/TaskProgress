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

function calculateDeadlineRisk(deadline, nowValue = new Date()) {
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

  const progressPressureRatio =
    (1 - workProgressRatio) / (1 - timeProgressRatio);
  const thresholds = schedule.risk_thresholds;
  if (
    !thresholds
    || !Number.isFinite(thresholds.on_track_max)
    || !Number.isFinite(thresholds.at_risk_max)
    || thresholds.on_track_max <= 0
    || thresholds.at_risk_max < thresholds.on_track_max
  ) {
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

globalThis.TimeDeadlineEngine = Object.freeze({
  calculate: calculateDeadlineRisk,
});
