import { stableSortTaskItemsByPriority, taskKind } from "./report-model.js";

/*
 * The scope's one Next marker (`report.next`), and the derived next step it
 * falls back to. Design: Documentation/NextMarkerPlan.md.
 *
 * A marker is effective while the item it names is still an unfinished object
 * item of its task that waits on no other item. Once the item completes or
 * starts waiting, the Viewer advances the
 * marker to the derived next step and writes it, so the state itself moves on;
 * nothing is ever shown as "derived". A cleared marker stays cleared until the
 * user or the next evaluation sets one.
 */
// Only a finished item or one blocked by other items stops being a Next: an
// item awaiting the user or an acceptor is still the scope's one thing to do,
// in that person's hands.
export const INEFFECTIVE_STATES = Object.freeze(["done", "waiting"]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function unfinished(item) {
  return isObject(item) && typeof item.id === "string" && !item.legacy
    && item.status !== "done" && item.status !== "archive"
    && !INEFFECTIVE_STATES.includes(item.derivedState);
}

function actionable(task) {
  return isObject(task) && taskKind(task) !== "report_pointer"
    && task.status !== "done" && task.status !== "archive";
}

/** The marker's target while it is effective; null otherwise. */
export function resolveNext(next, tasks) {
  if (!isObject(next) || typeof next.task_id !== "string" || typeof next.item_id !== "string") return null;
  const task = (tasks ?? []).find((entry) => entry?.id === next.task_id);
  if (!task || taskKind(task) === "report_pointer") return null;
  const item = (task.pending_items ?? []).find((entry) => isObject(entry) && entry.id === next.item_id);
  if (!item || !unfinished(item)) return null;
  return { taskId: task.id, itemId: item.id, task, item, derived: false };
}

/**
 * The derived next step: the first unfinished item that waits on nobody, by
 * card order (already ranked by the caller) and item priority.
 */
export function fallbackNext(orderedTasks) {
  for (const task of orderedTasks ?? []) {
    if (!actionable(task)) continue;
    const item = stableSortTaskItemsByPriority(task.pending_items).find(unfinished);
    if (item) return { taskId: task.id, itemId: item.id, task, item, derived: true };
  }
  return null;
}

/** The Next card leads every other card; pins are applied by the list afterwards and stay above it. */
export function liftNextTask(orderedTasks, nextTaskId) {
  if (!nextTaskId) return orderedTasks;
  const index = (orderedTasks ?? []).findIndex((task) => task?.id === nextTaskId);
  if (index <= 0) return orderedTasks;
  return [orderedTasks[index], ...orderedTasks.slice(0, index), ...orderedTasks.slice(index + 1)];
}

/** The Next item leads its card's unfinished items, whatever its priority. */
export function liftNextItem(items, nextItemId) {
  if (!nextItemId) return items;
  const index = (items ?? []).findIndex((item) => isObject(item) && item.id === nextItemId);
  if (index <= 0) return items;
  return [items[index], ...items.slice(0, index), ...items.slice(index + 1)];
}

/** Why the item cannot become the Next, in words for the user; null when it can. */
export function nextRefusal(report, { taskId, itemId }) {
  const task = report?.tasks?.find((entry) => entry?.id === taskId);
  if (!task) return `找不到任務「${taskId}」。`;
  const item = [...(task.pending_items ?? []), ...(task.completed_items ?? [])]
    .find((entry) => isObject(entry) && entry.id === itemId);
  if (!item) return `找不到子項目「${itemId}」。`;
  if (item.status === "archive") return "已封存的子項目不能設為 Next。";
  if (item.status === "done" || !(task.pending_items ?? []).includes(item)) return "已完成的子項目不能設為 Next。";
  return null;
}

/** A copy of the raw report with the marker set; the target must be an unfinished object item of that task. */
export function setNextMarker(report, { taskId, itemId }) {
  const refusal = nextRefusal(report, { taskId, itemId });
  if (refusal) throw new Error(refusal);
  const next = structuredClone(report);
  next.next = { task_id: taskId, item_id: itemId };
  return next;
}

export function clearNextMarker(report) {
  const next = structuredClone(report);
  delete next.next;
  return next;
}
