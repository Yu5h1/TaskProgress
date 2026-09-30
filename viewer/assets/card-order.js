import { normalizeCapsuleOrder, moveCapsuleOrder } from "./capsule-order.js";

// An explicit request promotes, never toggles. A repeated request stays idempotent.
export function promotePin(pinnedIds, id) {
  return [id, ...pinnedIds.filter(key => key !== id)];
}

export function requestedCardPin(search, scope) {
  const query = new URLSearchParams(search);
  return query.get("scope") === scope ? (query.get("pin") || null) : null;
}

export function displayCards(items, order, mode, pinnedIds = []) {
  const sorted = mode === "free" ? orderCards(items, order) : mode === "reverse" ? [...items].reverse() : items;
  if (!pinnedIds.length) return sorted;
  const byId = new Map(items.map(item => [item.id, item]));
  const pinned = new Set(pinnedIds);
  return [...pinned].filter(id => byId.has(id)).map(id => byId.get(id))
    .concat(sorted.filter(item => !pinned.has(item.id)));
}

export function orderCards(items, order) {
  if (!order) return items;
  const rank = new Map(order.map((id, index) => [id, index]));
  return [...items].sort((a, b) => (rank.get(a.id) ?? order.length) - (rank.get(b.id) ?? order.length));
}

// Move only visible slots: filtering must not relocate hidden cards.
export function moveVisibleCard(allIds, saved, visibleIds, id, targetId, after) {
  const full = normalizeCapsuleOrder(saved, allIds);
  const visible = new Set(visibleIds);
  const reordered = moveCapsuleOrder(full.filter(key => visible.has(key)), id, targetId, after);
  let index = 0;
  return full.map(key => visible.has(key) ? reordered[index++] : key);
}
