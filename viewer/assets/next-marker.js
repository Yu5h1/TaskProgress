import { stableSortTaskItemsByPriority, stableSortTasksByPriority, taskKind } from "./report-model.js";

/*
 * The scope's one Next marker (`report.next`), and the derived next step shown
 * in its place. Design: Documentation/NextMarkerPlan.md.
 *
 * A marker is effective while the item it names still needs someone to take it
 * up: unfinished, waiting on nobody and held by nobody. While it is not, the
 * derived next step is shown as the Next, unlabelled, and nothing is written:
 * the stored marker stays, so an item released back to not started is the Next
 * again. A cleared marker stays cleared until the user or an evaluation sets
 * one. `report get` derives the same way (C# NextMarker).
 */
// An item awaiting the user or an acceptor still needs that person, so it stays
// the Next; a finished item, one waiting on others, or one already being worked
// on does not.
export const INEFFECTIVE_STATES = Object.freeze(["done", "waiting", "in_progress"]);

function currentState(item) {
  return item.derivedState ?? item.status ?? "planned";
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function unfinished(item) {
  return isObject(item) && typeof item.id === "string" && !item.legacy
    && item.status !== "done" && item.status !== "archive"
    && !INEFFECTIVE_STATES.includes(currentState(item));
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
 * The derived next step: the first item that needs taking up, by card priority
 * (then the card's highest item priority, then source order) and item priority.
 * The view's own grouping never changes it, so the CLI derives the same item.
 */
export function fallbackNext(tasks) {
  for (const task of stableSortTasksByPriority(tasks ?? [])) {
    if (!actionable(task)) continue;
    const item = stableSortTaskItemsByPriority(task.pending_items).find(unfinished);
    if (item) return { taskId: task.id, itemId: item.id, task, item, derived: true };
  }
  return null;
}

/** What the Report shows as the Next: the stored marker while effective, else the derived step; none when cleared. */
export function effectiveNext(next, tasks) {
  if (!isObject(next)) return null;
  return resolveNext(next, tasks) ?? fallbackNext(tasks);
}

/** The Next card leads every other card. */
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

/**
 * Why the item cannot become the Next, in words for the user; null when it can.
 * `derivedState` is the state the Report shows; without it the stored status decides.
 */
export function nextRefusal(report, { taskId, itemId, derivedState = null }) {
  const task = report?.tasks?.find((entry) => entry?.id === taskId);
  if (!task) return `找不到任務「${taskId}」。`;
  const item = [...(task.pending_items ?? []), ...(task.completed_items ?? [])]
    .find((entry) => isObject(entry) && entry.id === itemId);
  if (!item) return `找不到子項目「${itemId}」。`;
  if (item.status === "archive") return "已封存的子項目不能設為 Next。";
  if (item.status === "done" || !(task.pending_items ?? []).includes(item)) return "已完成的子項目不能設為 Next。";
  const state = derivedState ?? item.status;
  if (state === "done") return "已完成的子項目不能設為 Next。";
  if (state === "waiting") return "等待中的子項目不能設為 Next。";
  if (state === "in_progress") return "執行中的子項目不能設為 Next。";
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
