/**
 * Maps device input to selection commands. Device differences live only here; the selection model
 * never sees an event. Mouse and keyboard are covered; touch (long press enters selection mode) and
 * gamepad (keyboard focus model with button mappings) are not implemented yet.
 */

const IGNORED_TARGETS = "a, button, input, textarea, select, label, summary, [contenteditable=\"true\"]";

/** True when a click landed on a control that keeps its own meaning. */
export function isSelectionIgnoredTarget(target) {
  return Boolean(target?.closest?.(IGNORED_TARGETS));
}

/** The command a primary click performs: extend with Shift, toggle with Ctrl or Cmd, otherwise select. */
export function pointerCommand(event) {
  if (event.shiftKey) return "extend";
  if (event.ctrlKey || event.metaKey) return "toggle";
  return "select";
}

/**
 * The command a key performs on a focused selectable row, or null to leave the key alone.
 * Alt+Arrow belongs to reordering and is never taken here.
 */
export function keyCommand(event) {
  if (event.altKey) return null;
  const modifier = event.ctrlKey || event.metaKey;
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    return { command: "move", delta: event.key === "ArrowDown" ? 1 : -1, extend: event.shiftKey };
  }
  if (event.key === " " && !modifier) return { command: "toggle" };
  if (event.key === "Escape") return { command: "clear" };
  if (modifier && !event.shiftKey && event.key.toLowerCase() === "c") return { command: "copy" };
  if (modifier && !event.shiftKey && event.key.toLowerCase() === "a") return { command: "all" };
  return null;
}
