import { normalizeMeaningfulText } from "../../../viewer/assets/editor-core.js";

function clone(value) {
  return value == null ? value : structuredClone(value);
}

function inputState(inputs) {
  return {
    config: clone(inputs?.config ?? null),
    estimates: clone(inputs?.estimates ?? null),
  };
}

function activeEstimate(estimates, taskId, itemId) {
  return estimates.find((estimate) => (
    estimate.active
    && estimate.task_id === taskId
    && estimate.item_id === itemId
  ));
}

function estimateId(itemId, instant, existingIds) {
  const stem = `estimate-${itemId}-${instant.replace(/\D/g, "")}`.toLowerCase();
  let candidate = stem;
  let suffix = 2;
  while (existingIds.has(candidate)) {
    candidate = `${stem}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function deliveryValue(config) {
  const project = config?.project;
  return project && Object.hasOwn(project, "delivery_at")
    ? { present: true, value: project.delivery_at }
    : { present: false, value: null };
}

function equalValue(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function comparableConfig(config) {
  if (!config) return null;
  const comparable = clone(config);
  delete comparable.updated_at;
  return comparable;
}

function capacityValue(config) {
  if (!config) return null;
  return {
    standard_allocation: clone(config.standard_allocation ?? null),
    capacity_exceptions: clone(config.project?.capacity_exceptions ?? []),
  };
}

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function optionalText(value, label) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized.length > 500) throw new Error(`${label}不可超過 500 字。`);
  return normalized;
}

function normalizeCapacity(capacity) {
  if (!capacity || typeof capacity !== "object") {
    throw new Error("工作容量設定不完整。");
  }
  const total = 1440;
  const sleep = Number(capacity.sleepMinutes);
  const life = Number(capacity.lifeMinutes);
  const other = Number(capacity.otherUnavailableMinutes);
  if (![sleep, life, other].every((value) => (
    Number.isInteger(value) && value >= 0 && value <= total
  ))) {
    throw new Error("睡眠、生活與其他不可工作時間必須是有效分鐘數。");
  }
  const available = total - sleep - life - other;
  if (available < 1) {
    throw new Error("睡眠、生活與其他不可工作時間合計必須小於 24 hr。");
  }
  const weekdays = [...new Set(
    (Array.isArray(capacity.workingWeekdays) ? capacity.workingWeekdays : [])
      .map(Number),
  )].sort((left, right) => left - right);
  if (!weekdays.length || weekdays.some((day) => !Number.isInteger(day) || day < 1 || day > 7)) {
    throw new Error("至少選擇一個有效工作日。");
  }
  const dates = new Set();
  const exceptions = (Array.isArray(capacity.capacityExceptions)
    ? capacity.capacityExceptions
    : [])
    .map((entry) => {
      const date = typeof entry?.date === "string" ? entry.date.trim() : "";
      const minutes = Number(entry?.availableMinutes);
      if (!validDate(date)) throw new Error("休假與容量例外需要有效日期。");
      if (dates.has(date)) throw new Error(`休假與容量例外日期不可重複：${date}`);
      dates.add(date);
      if (!Number.isInteger(minutes) || minutes < 0 || minutes > total) {
        throw new Error(`${date} 的可工作時間必須介於 0 與 24 hr。`);
      }
      const reason = optionalText(entry?.reason, "私人理由");
      const publicLabel = optionalText(entry?.publicLabel, "公開標籤");
      return {
        date,
        available_minutes: minutes,
        ...(reason ? { reason } : {}),
        ...(publicLabel ? { public_label: publicLabel } : {}),
      };
    });
  return {
    allocation: {
      total_minutes_per_day: total,
      sleep_minutes_per_day: sleep,
      life_minutes_per_day: life,
      other_unavailable_minutes_per_day: other,
      capacity_minutes_per_executor_day: available,
      working_weekdays: weekdays,
    },
    exceptions,
  };
}

export function createTimeInputDraft(
  inputs,
  scope,
  { configTemplate = null } = {},
) {
  if (typeof scope !== "string" || !scope) {
    throw new TypeError("Time input draft 需要 scope。");
  }
  let baseline = inputState(inputs);
  let draft = inputState(inputs);
  let deliveryChange = null;
  const dirtyFiles = new Set();

  function syncConfigDirty() {
    if (equalValue(comparableConfig(draft.config), comparableConfig(baseline.config))) {
      draft.config = clone(baseline.config);
      dirtyFiles.delete("config");
    } else {
      dirtyFiles.add("config");
    }
  }

  function snapshot() {
    return Object.freeze({
      inputs: inputState(draft),
      dirty: dirtyFiles.size > 0,
      dirtyFiles: Object.freeze([...dirtyFiles]),
      changeCount: deliveryChange ? 1 : 0,
    });
  }

  return Object.freeze({
    snapshot,

    initializeConfig({ updatedAt = new Date().toISOString() } = {}) {
      if (draft.config) {
        return Object.freeze({
          error: "time.config.json 已存在，不需要重新建立。",
          snapshot: snapshot(),
        });
      }
      if (!configTemplate || configTemplate.scope_id !== scope) {
        return Object.freeze({
          error: "本機服務未提供可驗證的預設時間設定。",
          snapshot: snapshot(),
        });
      }
      draft.config = clone(configTemplate);
      draft.config.updated_at = updatedAt;
      syncConfigDirty();
      return Object.freeze({ error: "", snapshot: snapshot() });
    },

    setTimeSettings({
      deliveryAt,
      deliveryReason = "",
      actor = "human",
      capacity,
    }, { updatedAt = new Date().toISOString() } = {}) {
      if (!draft.config) {
        return Object.freeze({
          error: "此 scope 尚無 time.config.json，需先建立工作容量設定。",
          snapshot: snapshot(),
        });
      }
      const normalizedDelivery = typeof deliveryAt === "string" ? deliveryAt.trim() : "";
      if (normalizedDelivery && Number.isNaN(Date.parse(normalizedDelivery))) {
        return Object.freeze({ error: "交付日不是有效時間。", snapshot: snapshot() });
      }
      const baselineDelivery = deliveryValue(baseline.config);
      const nextDelivery = normalizedDelivery
        ? { present: true, value: normalizedDelivery }
        : { present: false, value: null };
      const changedDelivery = !equalValue(baselineDelivery, nextDelivery);
      const normalizedReason = normalizeMeaningfulText(deliveryReason);
      if (changedDelivery && !normalizedReason) {
        return Object.freeze({
          error: "修改交付日需要填寫原因；原因請勿包含敏感原文。",
          snapshot: snapshot(),
        });
      }
      let normalizedCapacity;
      try {
        normalizedCapacity = normalizeCapacity(capacity);
      } catch (error) {
        return Object.freeze({
          error: error instanceof Error ? error.message : "工作容量設定無效。",
          snapshot: snapshot(),
        });
      }
      const nextConfig = clone(draft.config);
      const preservedWindow = {
        ...(nextConfig.standard_allocation?.workday_start_local
          ? { workday_start_local: nextConfig.standard_allocation.workday_start_local }
          : {}),
        ...(nextConfig.standard_allocation?.workday_end_local
          ? { workday_end_local: nextConfig.standard_allocation.workday_end_local }
          : {}),
      };
      nextConfig.standard_allocation = {
        ...normalizedCapacity.allocation,
        ...preservedWindow,
      };
      nextConfig.project ??= {};
      nextConfig.project.capacity_exceptions = normalizedCapacity.exceptions;
      if (normalizedDelivery) nextConfig.project.delivery_at = normalizedDelivery;
      else delete nextConfig.project.delivery_at;
      nextConfig.updated_at = updatedAt;
      draft.config = nextConfig;
      deliveryChange = changedDelivery
        ? {
            field_path: "time.config.project.delivery_at",
            reason: normalizedReason,
            actor,
            before: clone(baselineDelivery),
            after: clone(nextDelivery),
          }
        : null;
      syncConfigDirty();
      return Object.freeze({ error: "", snapshot: snapshot() });
    },

    setDeliveryAt(value, {
      reason = "",
      actor = "human",
      updatedAt = new Date().toISOString(),
    } = {}) {
      if (!draft.config) {
        return Object.freeze({
          error: "此 scope 尚無 time.config.json，需先建立工作容量設定。",
          snapshot: snapshot(),
        });
      }
      const normalized = typeof value === "string" ? value.trim() : "";
      if (normalized && Number.isNaN(Date.parse(normalized))) {
        return Object.freeze({ error: "交付日不是有效時間。", snapshot: snapshot() });
      }
      const baselineDelivery = deliveryValue(baseline.config);
      const nextDelivery = normalized
        ? { present: true, value: normalized }
        : { present: false, value: null };
      const changed = baselineDelivery.present !== nextDelivery.present
        || (baselineDelivery.present && baselineDelivery.value !== nextDelivery.value);
      const normalizedReason = normalizeMeaningfulText(reason);
      if (changed && !normalizedReason) {
        return Object.freeze({
          error: "修改交付日需要填寫原因；原因請勿包含敏感原文。",
          snapshot: snapshot(),
        });
      }
      draft.config.project ??= {};
      if (normalized) draft.config.project.delivery_at = normalized;
      else delete draft.config.project.delivery_at;
      draft.config.updated_at = updatedAt;
      syncConfigDirty();
      deliveryChange = changed
        ? {
            field_path: "time.config.project.delivery_at",
            reason: normalizedReason,
            actor,
            before: clone(baselineDelivery),
            after: clone(nextDelivery),
          }
        : null;
      return Object.freeze({ error: "", snapshot: snapshot() });
    },

    setManualEstimate({
      taskId,
      itemId,
      likelyMinutes,
      humanNote,
      humanConfirmed = false,
      updatedAt = new Date().toISOString(),
    }) {
      const minutes = Number(likelyMinutes);
      const note = normalizeMeaningfulText(humanNote);
      if (!Number.isInteger(minutes) || minutes < 1) {
        return Object.freeze({ error: "人工工時必須是至少 1 分鐘的整數。", snapshot: snapshot() });
      }
      if (!note) {
        return Object.freeze({ error: "人工依據至少需要一個文字或數字。", snapshot: snapshot() });
      }
      if (!draft.estimates) {
        draft.estimates = {
          schema_version: "0.2",
          scope_id: scope,
          updated_at: updatedAt,
          estimates: [],
        };
      }
      const estimates = draft.estimates.estimates;
      const previous = activeEstimate(estimates, taskId, itemId);
      if (previous) previous.active = false;
      const ids = new Set(estimates.map((estimate) => estimate.estimate_id));
      const next = {
        estimate_id: estimateId(itemId, updatedAt, ids),
        task_id: taskId,
        item_id: itemId,
        likely_minutes: minutes,
        contributors: [
          { kind: "human_estimate", summary: "人工直接估算。" },
        ],
        human_confirmed: Boolean(humanConfirmed),
        confidence: "medium",
        estimated_at: updatedAt,
        active: true,
        human_note: note,
      };
      if (previous?.estimate_id) next.supersedes_estimate_id = previous.estimate_id;
      estimates.push(next);
      draft.estimates.updated_at = updatedAt;
      dirtyFiles.add("estimates");
      return Object.freeze({ error: "", estimate: clone(next), snapshot: snapshot() });
    },

    replacements() {
      const replacements = {};
      for (const key of dirtyFiles) replacements[key] = clone(draft[key]);
      return replacements;
    },

    changes() {
      return deliveryChange
        ? [{
            field_path: deliveryChange.field_path,
            reason: deliveryChange.reason,
            actor: deliveryChange.actor,
          }]
        : [];
    },

    deliveryChangePreview() {
      return clone(deliveryChange);
    },

    timeSettingsChangePreview() {
      if (!dirtyFiles.has("config")) return null;
      const before = deliveryValue(baseline.config);
      const after = deliveryValue(draft.config);
      return {
        before: clone(before),
        after: clone(after),
        deliveryChanged: !equalValue(before, after),
        capacityChanged: !equalValue(
          capacityValue(baseline.config),
          capacityValue(draft.config),
        ),
        reason: deliveryChange?.reason ?? "",
        actor: deliveryChange?.actor ?? "human",
      };
    },

    discard() {
      draft = inputState(baseline);
      dirtyFiles.clear();
      deliveryChange = null;
      return snapshot();
    },

    commit(nextInputs = draft) {
      baseline = inputState(nextInputs);
      draft = inputState(nextInputs);
      dirtyFiles.clear();
      deliveryChange = null;
      return snapshot();
    },
  });
}

export function activeEstimateIndex(inputs) {
  const index = new Map();
  for (const estimate of inputs?.estimates?.estimates ?? []) {
    if (estimate.active && estimate.item_id) index.set(estimate.item_id, estimate);
  }
  return index;
}
