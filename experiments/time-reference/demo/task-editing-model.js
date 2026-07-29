(function initializeTimeTaskEditingModel(global) {
const priorityPolicy = global.TaskProgressPriorityPolicy;
if (!priorityPolicy) throw new Error("優先級設定未載入。");

function normalizeTaskDescription(value, maxLength = 1000) {
  const description = String(value ?? "").trim();
  if (!description) {
    return { ok: false, cancelled: true, error: "" };
  }
  if (description.length > maxLength) {
    return {
      ok: false,
      cancelled: false,
      error: `描述不可超過 ${maxLength} 個字元。`,
    };
  }
  if (!/[\p{L}\p{N}]/u.test(description)) {
    return {
      ok: false,
      cancelled: false,
      error: "描述必須至少包含一個文字或數字。",
    };
  }
  return { ok: true, cancelled: false, value: description, error: "" };
}

function createStableItemId(existingIds, seed = null) {
  const ids = new Set(existingIds ?? []);
  const randomPart = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 12)
    : Math.random().toString(36).slice(2, 14);
  const safeSeed = String(seed ?? `${Date.now().toString(36)}-${randomPart}`)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "") || "new";
  const base = `demo-item-${safeSeed}`;
  let candidate = base;
  let suffix = 2;
  while (ids.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function createStableTaskId(existingIds, seed = null) {
  const ids = new Set(existingIds ?? []);
  const randomPart = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 12)
    : Math.random().toString(36).slice(2, 14);
  const safeSeed = String(seed ?? `${Date.now().toString(36)}-${randomPart}`)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "") || "new";
  const base = `demo-task-${safeSeed}`;
  let candidate = base;
  let suffix = 2;
  while (ids.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function calculateProgressUnits(tasks) {
  const progress = (tasks ?? [])
    .filter((task) => task.status !== "archive")
    .map((task) => {
      const completed = Number(task.completed ?? 0);
      const total = Number(task.total ?? 0);
      return total > 0
        ? { completed, total }
        : { completed: task.status === "done" ? 1 : 0, total: 1 };
    });
  const completed = progress.reduce((sum, item) => sum + item.completed, 0);
  const total = progress.reduce((sum, item) => sum + item.total, 0);
  return {
    completed,
    total,
    ratio: total === 0 ? 0 : completed / total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

function normalizeStatusOrder(value, defaultOrder) {
  const fallback = [...(defaultOrder ?? [])];
  if (
    !Array.isArray(value)
    || value.length !== fallback.length
    || new Set(value).size !== fallback.length
    || fallback.some((status) => !value.includes(status))
  ) {
    return fallback;
  }
  return [...value];
}

function moveStatusOrder(order, status, targetStatus, placeAfter = false) {
  const nextOrder = [...(order ?? [])];
  if (
    status === targetStatus
    || !nextOrder.includes(status)
    || !nextOrder.includes(targetStatus)
  ) {
    return nextOrder;
  }
  nextOrder.splice(nextOrder.indexOf(status), 1);
  const targetIndex = nextOrder.indexOf(targetStatus);
  nextOrder.splice(targetIndex + (placeAfter ? 1 : 0), 0, status);
  return nextOrder;
}

function stableSortByStatus(items, order, getStatus = (item) => item.status) {
  const rank = new Map((order ?? []).map((status, index) => [status, index]));
  return [...(items ?? [])]
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const difference = (rank.get(getStatus(left.item)) ?? rank.size)
        - (rank.get(getStatus(right.item)) ?? rank.size);
      return difference || left.index - right.index;
    })
    .map(({ item }) => item);
}

function normalizePriority(value, fallback = null) {
  return priorityPolicy.normalize(value, fallback);
}

global.TimeTaskEditingModel = Object.freeze({
  normalizeTaskDescription,
  createStableItemId,
  createStableTaskId,
  calculateProgressUnits,
  normalizeStatusOrder,
  moveStatusOrder,
  stableSortByStatus,
  normalizePriority,
});
}(globalThis));
