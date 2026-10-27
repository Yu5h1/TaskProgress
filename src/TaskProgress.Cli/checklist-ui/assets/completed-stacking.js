/*
 * Completed collections stack newest first; the file keeps its own order.
 * Design: Documentation/CompletedStackingPlan.md. The Report's child items
 * already follow this rule; these two functions give the Checklist and
 * Decision pages the same shape.
 */

function time(value) {
  const parsed = typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isNaN(parsed) ? null : parsed;
}

/** Pending decisions keep file order and lead; decided ones follow, latest confirmation first. */
export function stackDecisions(decisions) {
  const entries = (decisions ?? []).map((decision, index) => ({ decision, index }));
  const pending = entries.filter(({ decision }) => decision?.status !== "decided");
  const decided = entries.filter(({ decision }) => decision?.status === "decided")
    .sort((left, right) => (time(right.decision.answer?.confirmed_at) ?? -1) - (time(left.decision.answer?.confirmed_at) ?? -1)
      || left.index - right.index);
  return [...pending, ...decided].map(({ decision }) => decision);
}

function passed(item) {
  if (typeof item?.status === "string") return item.status === "passed";
  const checks = item?.checks ?? [];
  return checks.length > 0 && checks.every((check) => check?.status === "passed");
}

/** The latest valid passed recording in the item, or null when no check carries a time. */
export function latestRecorded(item) {
  return (item?.checks ?? []).reduce((latest, check) => {
    if (check?.status !== "passed" || (check.validity ?? "valid") !== "valid") return latest;
    const at = time(check.recordedAt);
    return at !== null && (latest === null || at > latest) ? at : latest;
  }, null);
}

/**
 * Passed work items stack newest first: those with a recorded time by that
 * time, those with none (untagged checks carry no time) after them in file
 * order. In the document's own order (`asWritten`) they also move behind the
 * unfinished items; under an explicit capsule grouping they only reorder
 * among the slots the grouping gave them.
 */
export function stackChecklistItems(items, { asWritten = true } = {}) {
  const entries = (items ?? []).map((item, index) => ({ item, index }));
  const done = entries.filter(({ item }) => passed(item));
  const sorted = [...done].sort((left, right) => {
    const l = latestRecorded(left.item);
    const r = latestRecorded(right.item);
    if (l !== null && r !== null) return r - l || left.index - right.index;
    if (l !== null) return -1;
    if (r !== null) return 1;
    return left.index - right.index;
  });
  if (asWritten) {
    return [...entries.filter(({ item }) => !passed(item)), ...sorted].map(({ item }) => item);
  }
  let slot = 0;
  return entries.map((entry) => (passed(entry.item) ? sorted[slot++].item : entry.item));
}
