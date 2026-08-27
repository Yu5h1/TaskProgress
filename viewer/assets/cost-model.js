/*
 * Cost's Viewer-side domain: validating `cost.analysis.json` and turning
 * minor units into something a capsule can hold.
 *
 * Money is stored to the minor unit and displayed coarsely — those are two
 * different jobs, and this file is where they separate. A capsule has room for
 * "$11.7K"; the panel behind it is where the exact figure belongs.
 *
 * Pure: no DOM, no fetch, no clock. Unlike Time, Cost has no clock-driven
 * urgency — money does not change because an hour passed — so nothing here
 * needs recomputing on a timer.
 */

/*
 * Cost's own data contract version, as carried by the sidecar's
 * `schema_version`. An unknown version becomes a clean diagnostic rather than
 * a crash, the same way Time's does.
 */
export const SUPPORTED_COST_DATA_VERSIONS = Object.freeze(["0.1"]);

const DEFAULT_SYMBOL = "$";

/*
 * The assessment vocabulary, in Cost's wording. The shared layer knows a
 * contributor is one of three kinds; what each is called to a reader is the
 * module's to say.
 */
const CONTRIBUTOR_LABELS = Object.freeze({
  human: "人工",
  ai: "AI 分析",
  "historical-reference": "歷史參考",
});

const CONFIDENCE_LABELS = Object.freeze({
  high: "高信心",
  medium: "中信心",
  low: "低信心",
});

/*
 * K/M/B, the convention a view count uses. Deliberately not 萬: it reads
 * correctly only in Chinese-speaking regions, and a currency figure is the
 * last place to assume where the reader is.
 */
const UNITS = Object.freeze([
  { threshold: 1_000_000_000, suffix: "B" },
  { threshold: 1_000_000, suffix: "M" },
  { threshold: 1_000, suffix: "K" },
]);

export function inspectCostAnalysis(raw, scopeId) {
  const errors = [];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { errors: ["根節點必須是物件"] };
  }
  if (!SUPPORTED_COST_DATA_VERSIONS.includes(raw.schema_version)) {
    errors.push(`不支援的 schema_version：${raw.schema_version}`);
  }
  if (scopeId && raw.scope_id && raw.scope_id !== scopeId) {
    errors.push(`scope_id 與報告不符：${raw.scope_id}`);
  }
  if (!raw.summary || typeof raw.summary !== "object") {
    errors.push("缺少 summary");
  }
  if (!Array.isArray(raw.tasks)) {
    errors.push("缺少 tasks 陣列");
  }
  return { errors };
}

/*
 * Minor units to a display string. `minorPerMajor` is 100 for the currencies
 * that carry cents; a currency without them would pass 1. It is a parameter
 * rather than a constant because the wrong assumption here silently multiplies
 * every figure by a hundred.
 */
export function formatMoney(minorUnits, { symbol = DEFAULT_SYMBOL, minorPerMajor = 100 } = {}) {
  if (!Number.isFinite(minorUnits)) return null;
  const major = minorUnits / minorPerMajor;
  const magnitude = Math.abs(major);
  const unit = UNITS.find((candidate) => magnitude >= candidate.threshold);
  if (!unit) {
    return `${symbol}${major.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  const scaled = major / unit.threshold;
  // One decimal, and only when it says something: $1.2M is worth the
  // character, $1.0M is not.
  const text = scaled.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return `${symbol}${text}${unit.suffix}`;
}

/*
 * Exact figure for a detail panel, where there is room to be precise. The
 * capsule's short form and this share one source so they can never disagree
 * about the underlying number.
 */
export function formatMoneyExact(minorUnits, { symbol = DEFAULT_SYMBOL, minorPerMajor = 100 } = {}) {
  if (!Number.isFinite(minorUnits)) return null;
  return `${symbol}${(minorUnits / minorPerMajor).toLocaleString(undefined, {
    maximumFractionDigits: minorPerMajor === 1 ? 0 : 2,
  })}`;
}

/*
 * Coverage is what stops a total being read as complete when it is not, so it
 * carries its own wording rather than being inferred from a count at each
 * call site.
 */
export function coverageLabel(coverage, estimated, total) {
  if (coverage === "full") return `已完整估算（${estimated}/${total}）`;
  if (coverage === "partial") return `部分估算（${estimated}/${total}）`;
  return "尚未估算";
}

export function urgencyTone(urgency) {
  if (urgency === "critical") return "critical";
  if (urgency === "at_risk") return "at-risk";
  if (urgency === "on_track") return "on-track";
  return "neutral";
}

/*
 * Reader over a validated projection. Every lookup answers null rather than a
 * zero when nothing was estimated, so a caller cannot accidentally render a
 * figure for a value nobody set.
 */
export function createCostReader(analysis) {
  const summary = analysis?.summary ?? {};
  const symbol = summary.currency_symbol ?? DEFAULT_SYMBOL;
  const money = { symbol, minorPerMajor: 100 };
  const tasks = new Map();
  const items = new Map();
  for (const task of analysis?.tasks ?? []) {
    if (!task?.id) continue;
    tasks.set(task.id, task);
    for (const item of task.items ?? []) {
      if (item?.id) items.set(item.id, item);
    }
  }

  return {
    symbol,
    projectTotal() {
      if (!Number.isFinite(summary.total_estimated_minor_units)) return null;
      if (summary.coverage === "none") return null;
      return {
        label: formatMoney(summary.total_estimated_minor_units, money),
        exact: formatMoneyExact(summary.total_estimated_minor_units, money),
        remaining: formatMoneyExact(summary.remaining_estimated_minor_units, money),
        coverage: summary.coverage,
        coverageLabel: coverageLabel(
          summary.coverage,
          summary.estimated_item_count,
          summary.item_count,
        ),
        urgency: summary.resource?.urgency ?? "unknown",
        tone: urgencyTone(summary.resource?.urgency),
        available: formatMoneyExact(summary.resource?.available_minor_units, money),
        balance: formatMoneyExact(summary.resource?.balance_minor_units, money),
      };
    },
    taskTotal(taskId) {
      const task = tasks.get(taskId);
      if (!task || task.coverage === "none") return null;
      return {
        label: formatMoney(task.estimated_minor_units, money),
        coverage: task.coverage,
        coverageLabel: coverageLabel(
          task.coverage,
          task.estimated_item_count,
          task.item_count,
        ),
      };
    },
    itemAmount(itemId) {
      const item = items.get(itemId);
      if (!item) return null;
      return {
        label: formatMoney(item.estimated_minor_units, money),
        exact: formatMoneyExact(item.estimated_minor_units, money),
        done: item.done === true,
        contributors: (item.contributors ?? []).map((kind) => ({
          kind,
          label: CONTRIBUTOR_LABELS[kind] ?? kind,
        })),
        confidenceLabel: CONFIDENCE_LABELS[item.confidence] ?? null,
        humanConfirmed: item.human_confirmed === true,
      };
    },
  };
}
