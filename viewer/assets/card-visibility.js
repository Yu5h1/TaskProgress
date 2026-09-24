export function isCardVisible(id, mode, hiddenIds) {
  if (mode === "closed") return false;
  return mode !== "enabled" || !hiddenIds.includes(id);
}
export function chooseVisibility(mode, hiddenIds, action) {
  if (action === "reset") return { mode: "enabled", hiddenIds: [] };
  return { mode: ["enabled", "closed", "disabled"].includes(action) ? action : mode, hiddenIds };
}
