/*
 * Cost domain validation — the second module's own `data` shape, on top of
 * the common envelope Phase 1 already validates
 * (Documentation/CostEstimationModulePlan.md). Scoped to the `estimated`
 * category only, matching the design's v0.1 slice: `actual`/`committed`/
 * `replacement` are future sibling keys, not yet accepted here.
 *
 * Unlike Time, Cost natively emits the common envelope — there is no legacy
 * format to adapt, so this file only validates `data`, the way
 * `inspectTimeAnalysis` validates Time's. Subject matching reuses Phase 1's
 * generic `createSubjectIndex` rather than a second copy of task-lookup
 * logic, which is itself part of what this module is meant to prove: two
 * different domains sharing the same subject-matching primitive.
 */
import { createSubjectIndex } from "./module-model.js";

export const CURRENCY_PATTERN = /^[A-Z]{3}$/;
export const CONFIDENCE_LEVELS = Object.freeze(["low", "medium", "high"]);
export const TIME_INPUT_FRESHNESS_VALUES = Object.freeze(["current", "stale", "unknown"]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateEstimatedFigure(figure, path, errors, { requireMethodAndBreakdown }) {
  if (!isRecord(figure)) {
    errors.push(`${path} 必須是物件。`);
    return;
  }
  if (!isNonNegativeInteger(figure.minor_unit_amount)) {
    errors.push(`${path}.minor_unit_amount 必須是非負整數（最小貨幣單位）。`);
  }
  if (!CONFIDENCE_LEVELS.includes(figure.confidence)) {
    errors.push(`${path}.confidence 必須是 ${CONFIDENCE_LEVELS.join("／")} 其中之一。`);
  }
  if (figure.time_input_revision !== undefined && !isNonEmptyString(figure.time_input_revision)) {
    errors.push(`${path}.time_input_revision 存在時必須是非空字串。`);
  }
  if (figure.time_input_freshness !== undefined
    && !TIME_INPUT_FRESHNESS_VALUES.includes(figure.time_input_freshness)) {
    errors.push(`${path}.time_input_freshness 必須是 ${TIME_INPUT_FRESHNESS_VALUES.join("／")} 其中之一。`);
  }

  if (!requireMethodAndBreakdown) return;
  if (!isNonEmptyString(figure.method)) {
    errors.push(`${path}.method 必須是非空字串。`);
  }
  if (!Array.isArray(figure.scope_included) || figure.scope_included.length === 0
    || !figure.scope_included.every(isNonEmptyString)) {
    errors.push(`${path}.scope_included 必須是非空字串陣列。`);
  }
  if (!Array.isArray(figure.breakdown)) {
    errors.push(`${path}.breakdown 必須是陣列。`);
  } else {
    figure.breakdown.forEach((entry, index) => {
      const entryPath = `${path}.breakdown[${index}]`;
      if (!isRecord(entry)) {
        errors.push(`${entryPath} 必須是物件。`);
        return;
      }
      if (!isNonEmptyString(entry.category)) errors.push(`${entryPath}.category 必須是非空字串。`);
      if (!isNonNegativeInteger(entry.minor_unit_amount)) {
        errors.push(`${entryPath}.minor_unit_amount 必須是非負整數。`);
      }
      if (!isNonEmptyString(entry.basis)) errors.push(`${entryPath}.basis 必須是非空字串。`);
    });
  }
}

/*
 * Validates `envelope.data` against Cost's v0.1 `estimated`-only shape.
 * Returns `{ errors, taskIds }` — `taskIds` are the task-level entries found,
 * already reduced to the plain refs `createSubjectIndex` accepts, so the
 * caller does not have to know Cost's own field names to check orphans.
 */
export function validateCostData(data) {
  const errors = [];
  if (!isRecord(data)) {
    return { errors: ["data 必須是物件。"], taskIds: [] };
  }
  if (!CURRENCY_PATTERN.test(data.currency)) {
    errors.push("data.currency 必須是三個大寫字母的 ISO 4217 代碼。");
  }
  if (!isRecord(data.summary) || !("estimated" in data.summary)) {
    errors.push("data.summary.estimated 缺少。");
  } else {
    validateEstimatedFigure(data.summary.estimated, "data.summary.estimated", errors, {
      requireMethodAndBreakdown: false,
    });
  }

  if (!Array.isArray(data.tasks)) {
    errors.push("data.tasks 必須是陣列。");
    return { errors, taskIds: [] };
  }

  const seen = new Set();
  const taskIds = [];
  data.tasks.forEach((task, index) => {
    const path = `data.tasks[${index}]`;
    if (!isRecord(task)) {
      errors.push(`${path} 必須是物件。`);
      return;
    }
    if (!isNonEmptyString(task.task_id)) {
      errors.push(`${path}.task_id 必須是非空字串。`);
    } else {
      if (seen.has(task.task_id)) errors.push(`${path}.task_id「${task.task_id}」重複。`);
      seen.add(task.task_id);
      taskIds.push(task.task_id);
    }
    if (!("estimated" in task)) {
      errors.push(`${path}.estimated 缺少。`);
    } else {
      validateEstimatedFigure(task.estimated, `${path}.estimated`, errors, { requireMethodAndBreakdown: true });
    }
  });

  return { errors, taskIds };
}

/*
 * Subject matching for Cost's tasks, reusing Phase 1's generic index rather
 * than a Cost-specific lookup. Cost has no item-level data in v0.1
 * (Documentation/CostEstimationModulePlan.md's own scoping decision), so
 * only task-level refs are built.
 */
export function costSubjectIndex(report, taskIds) {
  return createSubjectIndex(report, taskIds.map((taskId) => ({ level: "task", task_id: taskId })));
}
