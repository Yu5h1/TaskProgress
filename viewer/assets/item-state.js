/**
 * Derived Report child item state, decided in the same order as the CLI's ItemStateResolver:
 * a bound checklist decides completion and who acts next; waits apply to every item.
 */

import { parseInlineLinks } from "./inline-links.js";

export const ITEM_STATE_META = Object.freeze({
  done: { label: "完成", tone: "success" },
  waiting: { label: "等待中", tone: "warning" },
  awaiting_user_dispute: { label: "待使用者（爭議）", tone: "warning" },
  conditions_to_revise: { label: "條件待修", tone: "warning" },
  needs_fix: { label: "需修正", tone: "danger" },
  awaiting_user: { label: "待使用者", tone: "warning" },
  awaiting_acceptance: { label: "待他驗", tone: "active" },
  in_progress: { label: "執行中", tone: "active" },
  not_started: { label: "未開始", tone: "muted" },
});

function effective(check) {
  return check?.effectiveStatus ?? check?.status;
}

function latestAt(item, event) {
  const times = (item?.activity ?? [])
    .filter((entry) => entry?.event === event)
    .map((entry) => Date.parse(entry.at))
    .filter(Number.isFinite);
  return times.length ? Math.max(...times) : null;
}

function recordedAt(check) {
  const at = Date.parse(check?.recordedAt ?? "");
  return Number.isFinite(at) ? at : null;
}

/** State from a bound checklist's evaluation; null when the item has no readable checklist. */
export function stateFromChecklist(item, evaluation) {
  if (!evaluation?.ok || !Array.isArray(evaluation.checks)) return null;
  const checks = evaluation.checks;
  if (checks.length && checks.every((check) => effective(check) === "passed")) return "done";
  const released = latestAt(item, "released");
  const disputed = latestAt(item, "disputed");
  const conditions = checks.filter((check) => check.tag === "acceptance" && effective(check) === "failed"
    && check.rejectReason === "condition");
  if (conditions.some((check) => check.conditionCount >= 2 || (disputed !== null && disputed > (recordedAt(check) ?? Infinity)))) {
    return "awaiting_user_dispute";
  }
  if (conditions.length) return "conditions_to_revise";
  const unfixed = checks.filter((check) => effective(check) === "failed"
    && ((check.tag === "acceptance" && check.rejectReason === "implementation")
      || (check.tag === "manual" && check.recorder === "user")));
  if (unfixed.some((check) => released === null || (recordedAt(check) ?? 0) > released)) return "needs_fix";
  const executorFailed = checks.some((check) => !check.tag && check.status === "failed");
  const agentRecheck = checks.some((check) => check.tag === "manual" && effective(check) === "failed" && check.recorder !== "user");
  const manualOpen = checks.some((check) => check.tag === "manual" && effective(check) !== "passed");
  if (executorFailed || agentRecheck
    || (manualOpen && evaluation.untaggedComplete && evaluation.acceptanceComplete)) return "awaiting_user";
  if (evaluation.untaggedComplete && !evaluation.acceptanceComplete) return "awaiting_acceptance";
  const started = (item?.activity ?? []).some((entry) => entry?.event === "started" || entry?.event === "takeover");
  return started ? "in_progress" : "not_started";
}

/**
 * What a waiter needs from a checklist-bound waited item beyond completion, read from its checklist
 * alone: whether only the user's [manual] acceptance is left (every other check passed and the user
 * failed none), and when the user last failed a [manual] check that still stands.
 */
export function waitedChecklistFacts(item, evaluation) {
  if (!evaluation?.ok || !Array.isArray(evaluation.checks)) return { onlyManual: false, userFailedAt: null };
  const checks = evaluation.checks;
  const onlyManual = stateFromChecklist(item, evaluation) === "awaiting_user"
    && checks.every((check) => check.tag === "manual" || effective(check) === "passed");
  const failures = checks
    .filter((check) => check.tag === "manual" && check.recorder === "user" && effective(check) === "failed")
    .map(recordedAt)
    .filter((at) => at !== null);
  return { onlyManual, userFailedAt: failures.length ? Math.max(...failures) : null };
}

/** An item wait is met by a done item, or by one lacking only the user's acceptance unless strict. */
export function waitMet(wait, result) {
  return Boolean(result?.done || (wait?.strict !== true && result?.onlyManual));
}

/**
 * Whether an item that started must be redone: a non-strict wait's item was failed by the user
 * after this item's latest release or completion.
 */
export function mustRedo(item, waitResults) {
  if (latestAt(item, "started") === null && latestAt(item, "takeover") === null) return false;
  const redone = [latestAt(item, "released"), latestAt(item, "done")].filter((at) => at !== null);
  const since = redone.length ? Math.max(...redone) : null;
  return (waitResults ?? []).some(({ wait, result }) => wait?.strict !== true
    && Number.isFinite(result?.userFailedAt) && (since === null || since < result.userFailedAt));
}

/**
 * The item's derived state, or null when nothing beyond its stored status applies
 * (no readable bound checklist and nothing it waits for is unfinished).
 */
export function deriveItemState(item, evaluation, pendingWaits = [], redo = false) {
  if (redo) return "needs_fix";
  const fromChecklist = stateFromChecklist(item, evaluation);
  if (fromChecklist === "done") return "done";
  if (!fromChecklist && (item?.status ?? "planned") === "done") return null;
  if (pendingWaits.length) return "waiting";
  return fromChecklist;
}

/**
 * A title as link text: links inside it keep only their text, and brackets become full-width, so
 * the label can never open or close a link of its own.
 */
function textOf(text) {
  return parseInlineLinks(text).map((part) => part.text).join("");
}

function plainLabel(text) {
  return textOf(text).replace(/\[/gu, "［").replace(/\]/gu, "］");
}

/**
 * Inline-link text for unfinished waited items, appended to the expanded row: one link per card,
 * because a link opens and pins the card, never a single item, and the card shows which items are
 * still open. A target that cannot be read is named on its own.
 */
/**
 * The places a waiting item's capsule opens: one entry per waited card or checklist, in waits_for
 * order; a target that cannot be read keeps its label and has no href.
 */
export function waitLinks(pendingWaits) {
  const links = new Map();
  for (const wait of pendingWaits ?? []) {
    const href = wait.available ? wait.href : null;
    const key = href ?? `unreadable:${wait.label}`;
    if (links.has(key)) continue;
    links.set(key, { href, label: textOf(href ? (wait.card ?? wait.label) : wait.label) });
  }
  return [...links.values()];
}

export function waitsText(pendingWaits) {
  if (!pendingWaits.length) return "";
  const cards = new Map();
  const unreadable = [];
  for (const wait of pendingWaits) {
    if (!wait.available) {
      unreadable.push(`${plainLabel(wait.label)}（無法讀取）`);
      continue;
    }
    const card = cards.get(wait.href) ?? { label: plainLabel(wait.card ?? wait.label), count: 0 };
    card.count += 1;
    cards.set(wait.href, card);
  }
  const links = [...cards].map(([href, card]) => `[${card.label}](${href})（${card.count} 項未完成）`);
  return `等待：${[...links, ...unreadable].join("、")}`;
}
