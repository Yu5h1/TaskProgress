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
 * Task status and item status are the same vocabulary, seen at two levels.
 *
 * A card carries its own status. Its items carry only two of those statuses,
 * because an item is either waiting or finished — `pending_items` means
 * planned, `completed_items` means done. Selecting a status an item cannot
 * hold, such as in progress, leaves that card with no matching item, which is
 * the honest answer until items gain a status of their own.
 *
 * `planned` used to also mean "has any pending item", which is why selecting it
 * left completed items on screen: the overload matched the card, and nothing
 * then filtered what was inside it.
 */
export const ITEM_STATUS_FIELDS = Object.freeze({
  planned: "pending_items",
  done: "completed_items",
});

/*
 * Group only what the reader asked for, and leave the rest as written.
 *
 * Anything whose status is in `groupOrder` is grouped and sorted within its
 * group; anything else keeps the data's own order and follows behind. An empty
 * `groupOrder` therefore means "change nothing", which is what 預設 leading
 * asks for.
 */
export function orderByCapsuleBoundary(
  items,
  groupOrder,
  getStatus = (item) => item.status,
  sortWithinGroup = (list) => list,
) {
  if (groupOrder.length === 0) return [...items];
  const grouped = [];
  const rest = [];
  for (const item of items) {
    (groupOrder.includes(getStatus(item)) ? grouped : rest).push(item);
  }
  return [
    ...stableSortByStatus(sortWithinGroup(grouped), groupOrder, getStatus),
    ...rest,
  ];
}

export function taskMatchesSelection(task, selected) {
  return selected.has(task?.status);
}

export function taskHasSelectedItem(task, selected) {
  return Object.entries(ITEM_STATUS_FIELDS)
    .some(([status, field]) => selected.has(status) && (task?.[field]?.length ?? 0) > 0);
}

/*
 * Keep only the items whose status is selected, so a card cannot still show the
 * work it was filtered away from. Filtering hides; it never reorders.
 */
export function filterTaskItems(task, selected) {
  const next = { ...task };
  for (const [status, field] of Object.entries(ITEM_STATUS_FIELDS)) {
    next[field] = selected.has(status) ? (task[field] ?? []) : [];
  }
  return next;
}
