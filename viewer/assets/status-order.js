export const STATUS_ORDER_STORAGE_KEY = "taskprogress.viewer.status-order.v1";

export function normalizeStatusOrder(value, supportedStatuses) {
  const supported = [...new Set(supportedStatuses)];
  if (!Array.isArray(value)) return supported;

  const supportedSet = new Set(supported);
  const seen = new Set();
  const normalized = [];
  value.forEach((status) => {
    if (!supportedSet.has(status) || seen.has(status)) return;
    seen.add(status);
    normalized.push(status);
  });
  supported.forEach((status) => {
    if (!seen.has(status)) normalized.push(status);
  });
  return normalized;
}

export function loadStatusOrder(storage, supportedStatuses) {
  if (!storage) return normalizeStatusOrder(null, supportedStatuses);
  try {
    const saved = JSON.parse(storage.getItem(STATUS_ORDER_STORAGE_KEY) ?? "null");
    return normalizeStatusOrder(saved, supportedStatuses);
  } catch {
    return normalizeStatusOrder(null, supportedStatuses);
  }
}

export function saveStatusOrder(storage, order) {
  if (!storage) return false;
  try {
    storage.setItem(STATUS_ORDER_STORAGE_KEY, JSON.stringify(order));
    return true;
  } catch {
    return false;
  }
}

export function moveStatusOrder(order, status, targetStatus, placeAfter = false) {
  if (status === targetStatus || !order.includes(status) || !order.includes(targetStatus)) {
    return [...order];
  }

  const next = order.filter((candidate) => candidate !== status);
  const targetIndex = next.indexOf(targetStatus);
  next.splice(targetIndex + (placeAfter ? 1 : 0), 0, status);
  return next;
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
