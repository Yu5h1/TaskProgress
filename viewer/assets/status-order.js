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

export function taskMatchesViewStatus(task, status) {
  if (status === "planned") {
    return task?.status === "planned"
      || (Array.isArray(task?.pending_items) && task.pending_items.length > 0);
  }
  return task?.status === status;
}
