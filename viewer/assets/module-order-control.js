import {
  DEFAULT_ITEM_MODULE_ORDER,
  loadModuleOrder,
  moveModuleOrder,
  saveModuleOrder,
} from "./module-order.js";

function browserStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function createModuleOrderControl({
  storage = browserStorage(),
  supportedIds = DEFAULT_ITEM_MODULE_ORDER,
} = {}) {
  let order = loadModuleOrder(storage, supportedIds);

  return Object.freeze({
    get order() {
      return [...order];
    },
    move(id, targetId, placeAfter = false) {
      const next = moveModuleOrder(order, id, targetId, placeAfter);
      const changed = next.some((candidate, index) => candidate !== order[index]);
      if (changed) {
        order = next;
        saveModuleOrder(storage, order);
      }
      return Object.freeze({ order: [...order], changed });
    },
  });
}
