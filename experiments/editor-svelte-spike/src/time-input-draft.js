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
  const dirtyFiles = new Set();

  function snapshot() {
    return Object.freeze({
      inputs: inputState(draft),
      dirty: dirtyFiles.size > 0,
      dirtyFiles: Object.freeze([...dirtyFiles]),
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
      dirtyFiles.add("config");
      return Object.freeze({ error: "", snapshot: snapshot() });
    },

    setDeliveryAt(value, updatedAt = new Date().toISOString()) {
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
      draft.config.project ??= {};
      if (normalized) draft.config.project.delivery_at = normalized;
      else delete draft.config.project.delivery_at;
      draft.config.updated_at = updatedAt;
      dirtyFiles.add("config");
      return Object.freeze({ error: "", snapshot: snapshot() });
    },

    setManualEstimate({
      taskId,
      itemId,
      likelyMinutes,
      humanNote,
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
        human_confirmed: true,
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

    discard() {
      draft = inputState(baseline);
      dirtyFiles.clear();
      return snapshot();
    },

    commit(nextInputs = draft) {
      baseline = inputState(nextInputs);
      draft = inputState(nextInputs);
      dirtyFiles.clear();
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
