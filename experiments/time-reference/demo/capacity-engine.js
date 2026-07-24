function nextDate(date) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

function isoWeekday(date) {
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

function validateProfile(profile) {
  const fixedMinutes = [
    profile.sleep_minutes_per_day,
    profile.life_minutes_per_day,
    profile.other_unavailable_minutes_per_day,
  ];
  if (
    !fixedMinutes.every((value) => Number.isInteger(value) && value >= 0)
    || !Number.isInteger(profile.total_minutes_per_day)
    || profile.total_minutes_per_day <= 0
  ) {
    throw new Error("每日時間分配必須是有效的非負整數分鐘。");
  }
  const derivedCapacity = profile.total_minutes_per_day
    - fixedMinutes.reduce((total, value) => total + value, 0);
  if (
    derivedCapacity <= 0
    || derivedCapacity !== profile.capacity_minutes_per_executor_day
  ) {
    throw new Error("每日工作容量必須等於總時間扣除固定不可工作時間。");
  }
  if (
    !Array.isArray(profile.working_weekdays)
    || !profile.working_weekdays.length
    || new Set(profile.working_weekdays).size !== profile.working_weekdays.length
    || !profile.working_weekdays.every(
      (value) => Number.isInteger(value) && value >= 1 && value <= 7,
    )
  ) {
    throw new Error("工作日必須是不重複的 ISO weekday 1 至 7。");
  }
  if (!Array.isArray(profile.capacity_exceptions)) {
    throw new Error("休假與例外必須是陣列。");
  }
}

function parseExceptions(value) {
  const dates = new Set();
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [date = "", hourText = "", ...reasonParts] = line
        .split("|")
        .map((part) => part.trim());
      const parsedDate = new Date(`${date}T00:00:00Z`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date)
        || Number.isNaN(parsedDate.getTime())
        || parsedDate.toISOString().slice(0, 10) !== date
      ) {
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
        public_label: reasonParts.join(" | ") || "其他不可工作時間",
      };
    });
}

function buildTimeline(deadline, profile) {
  validateProfile(profile);
  const startDate = deadline.started_at.slice(0, 10);
  const deliveryDate = deadline.delivery_at.slice(0, 10);
  const workingDays = new Set(profile.working_weekdays);
  const exceptions = new Map();
  profile.capacity_exceptions.forEach((exception) => {
    if (exceptions.has(exception.date)) {
      throw new Error(`例外日期重複：${exception.date}`);
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(exception.date)
      || !Number.isInteger(exception.available_minutes)
      || exception.available_minutes < 0
      || exception.available_minutes > 1440
    ) {
      throw new Error(`容量例外無效：${exception.date}`);
    }
    exceptions.set(exception.date, exception);
  });

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
  return timeline;
}

globalThis.TimeCapacityEngine = Object.freeze({
  buildTimeline,
  parseExceptions,
  validateProfile,
});
