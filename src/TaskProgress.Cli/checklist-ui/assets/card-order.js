import { normalizeCapsuleOrder, moveCapsuleOrder } from "./capsule-order.js";

// An explicit request promotes, never toggles. A repeated request stays idempotent.
export function promotePin(pinnedIds, id) {
  return [id, ...pinnedIds.filter(key => key !== id)];
}

// Initial observation is a baseline. A later completion clears a pin once;
// pinning an already completed card remains an explicit user choice.
export function removeNewlyCompletedPins(pinnedIds, before, after) {
  return pinnedIds.filter(id => !(before?.[id] === false && after?.[id] === true));
}

export function requestedCardPin(search, scope) {
  const query = new URLSearchParams(search);
  return query.get("scope") === scope ? (query.get("pin") || null) : null;
}

export function visibleRootCards(cards, parents, pinnedIds, nextId, requestedPin) {
  const keep = new Set([...pinnedIds, nextId, requestedPin]);
  return cards.filter(card => !parents.has(card.id) || keep.has(card.id));
}

// The lead card (the scope's Next) outranks every pin and every sort mode.
export function displayCards(items, order, mode, pinnedIds = [], leadId = null, completedIds = null) {
  let sorted = mode === "free" ? orderCards(items, order) : mode === "reverse" ? [...items].reverse() : items;
  if (completedIds) {
    const completed = new Set(completedIds);
    sorted = sorted.filter(item => !completed.has(item.id)).concat(items.filter(item => completed.has(item.id)));
  }
  const byId = new Map(items.map(item => [item.id, item]));
  const pinned = new Set(pinnedIds);
  const cards = pinnedIds.length
    ? [...pinned].filter(id => byId.has(id)).map(id => byId.get(id)).concat(sorted.filter(item => !pinned.has(item.id)))
    : sorted;
  if (leadId === null || !byId.has(leadId) || completedIds?.includes(leadId)) return cards;
  return [byId.get(leadId), ...cards.filter(item => item.id !== leadId)];
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
