import {
  loadCapsuleOrder,
  moveCapsuleOrder,
  normalizeCapsuleOrder,
  saveCapsuleOrder,
} from "./capsule-order.js";

export const STATUS_ORDER_STORAGE_KEY = "taskprogress.viewer.status-order.v1";

export function normalizeStatusOrder(value, supportedStatuses) {
  return normalizeCapsuleOrder(value, supportedStatuses);
}

export function loadStatusOrder(storage, supportedStatuses) {
  return loadCapsuleOrder(storage, STATUS_ORDER_STORAGE_KEY, supportedStatuses);
}

export function saveStatusOrder(storage, order) {
  return saveCapsuleOrder(storage, STATUS_ORDER_STORAGE_KEY, order);
}

export function moveStatusOrder(order, status, targetStatus, placeAfter = false) {
  return moveCapsuleOrder(order, status, targetStatus, placeAfter);
}

export function stableSortByStatus(items, order, getStatus = (item) => item.status) {
  const rank = new Map(order.map((status, index) => [status, index]));
  return [...items]
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftRank = rank.get(getStatus(left.item)) ?? order.length;
      const rightRank = rank.get(getStatus(right.item)) ?? order.length;
      return leftRank - rightRank || left.index - right.index;
    })
    .map(({ item }) => item);
}

/*
 * Task status and item status are two axes, not one.
 *
 * A task carries its own status; its items carry theirs, and the two do not
 * follow each other — an in-progress task holds both finished and unfinished
 * items. `planned` used to also mean "has any pending item", which is why
 * selecting it left completed items on screen: the overload matched the card,
 * and nothing then filtered what was inside it.
 */
export const ITEM_VIEW_STATUSES = Object.freeze(["pending", "completed"]);

export function taskMatchesViewStatus(task, status) {
  return task?.status === status;
}

export function taskMatchesItemStatus(task, itemStatus) {
  return countMatchingItems(task, itemStatus) > 0;
}

function countMatchingItems(task, itemStatus) {
  const field = itemStatus === "completed" ? "completed_items" : "pending_items";
  return Array.isArray(task?.[field]) ? task[field].length : 0;
}

/*
 * Keep only the items that match, so a filtered card cannot still show the work
 * it was filtered away from. Filtering hides; it never reorders.
 */
export function filterTaskItems(task, itemStatus) {
  if (!ITEM_VIEW_STATUSES.includes(itemStatus)) return task;
  return {
    ...task,
    completed_items: itemStatus === "completed" ? (task.completed_items ?? []) : [],
    pending_items: itemStatus === "pending" ? (task.pending_items ?? []) : [],
  };
}
