/**
 * Derived Report child item state, decided in the same order as the CLI's ItemStateResolver:
 * a bound checklist decides completion and who acts next; waits apply to every item.
 */

export const ITEM_STATE_META = Object.freeze({
  done: { label: "完成", tone: "success" },
  waiting: { label: "等待中", tone: "muted" },
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
 * The item's derived state, or null when nothing beyond its stored status applies
 * (no readable bound checklist and nothing it waits for is unfinished).
 */
export function deriveItemState(item, evaluation, pendingWaits = []) {
  const fromChecklist = stateFromChecklist(item, evaluation);
  if (fromChecklist === "done") return "done";
  if (!fromChecklist && (item?.status ?? "planned") === "done") return null;
  if (pendingWaits.length) return "waiting";
  return fromChecklist;
}

/** Inline-link text listing unfinished waited items, appended to the expanded row. */
export function waitsText(pendingWaits) {
  if (!pendingWaits.length) return "";
  const links = pendingWaits.map((wait) => wait.available
    ? `[${wait.label}](${wait.href})`
    : `${wait.label}（無法讀取）`);
  return `等待：${links.join("、")}`;
}
