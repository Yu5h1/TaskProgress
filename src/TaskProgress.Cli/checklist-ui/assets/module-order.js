import {
  loadCapsuleOrder,
  moveCapsuleOrder,
  normalizeCapsuleOrder,
  saveCapsuleOrder,
} from "./capsule-order.js";

export const MODULE_ORDER_STORAGE_KEY = "taskprogress.viewer.module-order.v1";
export const DEFAULT_ITEM_MODULE_ORDER = Object.freeze(["time"]);

export function normalizeModuleOrder(value, supportedIds = DEFAULT_ITEM_MODULE_ORDER) {
  return normalizeCapsuleOrder(value, supportedIds);
}

export function loadModuleOrder(storage, supportedIds = DEFAULT_ITEM_MODULE_ORDER) {
  return loadCapsuleOrder(storage, MODULE_ORDER_STORAGE_KEY, supportedIds);
}

export function saveModuleOrder(storage, order) {
  return saveCapsuleOrder(storage, MODULE_ORDER_STORAGE_KEY, order);
}

export function moveModuleOrder(order, id, targetId, placeAfter = false) {
  return moveCapsuleOrder(order, id, targetId, placeAfter);
}
