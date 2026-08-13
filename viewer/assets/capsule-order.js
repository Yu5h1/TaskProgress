export function normalizeCapsuleOrder(value, supportedIds) {
  const supported = [...new Set(supportedIds)];
  if (!Array.isArray(value)) return supported;

  const supportedSet = new Set(supported);
  const seen = new Set();
  const normalized = [];
  value.forEach((id) => {
    if (!supportedSet.has(id) || seen.has(id)) return;
    seen.add(id);
    normalized.push(id);
  });
  supported.forEach((id) => {
    if (!seen.has(id)) normalized.push(id);
  });
  return normalized;
}

export function loadCapsuleOrder(storage, storageKey, supportedIds) {
  if (!storage) return normalizeCapsuleOrder(null, supportedIds);
  try {
    const saved = JSON.parse(storage.getItem(storageKey) ?? "null");
    return normalizeCapsuleOrder(saved, supportedIds);
  } catch {
    return normalizeCapsuleOrder(null, supportedIds);
  }
}

export function saveCapsuleOrder(storage, storageKey, order) {
  if (!storage) return false;
  try {
    storage.setItem(storageKey, JSON.stringify(order));
    return true;
  } catch {
    return false;
  }
}

export function moveCapsuleOrder(order, id, targetId, placeAfter = false) {
  if (id === targetId || !order.includes(id) || !order.includes(targetId)) {
    return [...order];
  }

  const next = order.filter((candidate) => candidate !== id);
  const targetIndex = next.indexOf(targetId);
  next.splice(targetIndex + (placeAfter ? 1 : 0), 0, id);
  return next;
}
