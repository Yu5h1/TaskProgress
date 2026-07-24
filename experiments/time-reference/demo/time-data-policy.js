function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function inspectDeadline(deadline) {
  const errors = [];
  for (const field of [
    "started_at",
    "delivery_at",
    "evaluated_at",
    "boundary_state",
    "urgency",
  ]) {
    if (typeof deadline[field] !== "string" || deadline[field].length === 0) {
      errors.push(`summary.deadline.${field} 必須是字串`);
    }
  }
  for (const field of [
    "elapsed_capacity_minutes",
    "total_capacity_minutes",
    "time_progress_ratio",
    "work_progress_ratio",
  ]) {
    if (!Number.isFinite(deadline[field])) {
      errors.push(`summary.deadline.${field} 必須是數值`);
    }
  }
  if (!isRecord(deadline.schedule)) {
    errors.push("缺少 summary.deadline.schedule");
    return errors;
  }
  if (typeof deadline.schedule.timezone !== "string") {
    errors.push("summary.deadline.schedule.timezone 必須是字串");
  }
  if (!isRecord(deadline.schedule.risk_thresholds)) {
    errors.push("缺少 summary.deadline.schedule.risk_thresholds");
  }
  if (!Array.isArray(deadline.schedule.capacity_timeline)) {
    errors.push("summary.deadline.schedule.capacity_timeline 必須是陣列");
  }

  const profile = deadline.schedule.capacity_profile;
  if (profile !== undefined) {
    if (!isRecord(profile)) {
      errors.push("capacity_profile 必須是物件");
    } else {
      if (!Array.isArray(profile.working_weekdays)) {
        errors.push("capacity_profile.working_weekdays 必須是陣列");
      }
      if (!Array.isArray(profile.capacity_exceptions)) {
        errors.push("capacity_profile.capacity_exceptions 必須是陣列");
      }
    }
  }
  return errors;
}

function inspectTimeAnalysis(value) {
  if (value === null || value === undefined) {
    return Object.freeze({
      state: "missing",
      errors: Object.freeze([]),
      deadlineAvailable: false,
      deadlineErrors: Object.freeze([]),
    });
  }

  const errors = [];
  const deadlineErrors = [];
  let deadlineAvailable = false;
  if (!isRecord(value)) {
    errors.push("根節點必須是物件");
  } else {
    if (!isRecord(value.summary)) errors.push("缺少 summary");
    if (!isRecord(value.method)) errors.push("缺少 method");
    if (!Array.isArray(value.tasks)) errors.push("tasks 必須是陣列");

    if (isRecord(value.summary)) {
      if (!Number.isFinite(value.summary.display_total_days)) {
        errors.push("summary.display_total_days 必須是數值");
      }
      if (value.summary.deadline === undefined) {
        deadlineAvailable = false;
      } else if (!isRecord(value.summary.deadline)) {
        deadlineErrors.push("summary.deadline 必須是物件");
      } else {
        deadlineErrors.push(...inspectDeadline(value.summary.deadline));
        deadlineAvailable = deadlineErrors.length === 0;
      }
    }
  }

  return Object.freeze({
    state: errors.length ? "invalid" : "available",
    errors: Object.freeze(errors),
    deadlineAvailable: errors.length === 0 && deadlineAvailable,
    deadlineErrors: Object.freeze(deadlineErrors),
  });
}

globalThis.TimeDataPolicy = Object.freeze({
  inspectTimeAnalysis,
});
