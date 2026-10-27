/*
 * Undo/redo for the writes preview mode makes directly to report.json (item
 * reorder and the Next marker). There is no draft and no cautious mode here:
 * every step is written at once, so each entry pairs the report it left on
 * disk (`applied`) with the report it replaced (`restore`). A step is only
 * offered while the persisted report is still exactly `applied`; any other
 * change since, from edit mode or from outside, makes the history unusable
 * and it is dropped rather than overwriting that change.
 */
const DEFAULT_LIMIT = 50;

function sameReport(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function createPreviewHistory({ limit = DEFAULT_LIMIT } = {}) {
  const stacks = { undo: [], redo: [] };

  function opposite(direction) {
    return direction === "undo" ? "redo" : "undo";
  }

  function record(before, after) {
    stacks.undo.push({ applied: structuredClone(after), restore: structuredClone(before) });
    if (stacks.undo.length > limit) stacks.undo.shift();
    stacks.redo = [];
  }

  /** The report a step would write, `null` when there is no step, or `"stale"` when the persisted report has moved on. */
  function target(direction, persisted) {
    const entry = stacks[direction].at(-1);
    if (!entry) return null;
    if (!sameReport(entry.applied, persisted)) return "stale";
    return structuredClone(entry.restore);
  }

  /** Called once the step's report has been written; `written` is what is now on disk. */
  function complete(direction, written) {
    const entry = stacks[direction].pop();
    if (!entry) return;
    stacks[opposite(direction)].push({ applied: structuredClone(written), restore: entry.applied });
  }

  function clear() {
    stacks.undo = [];
    stacks.redo = [];
  }

  return Object.freeze({
    record,
    target,
    complete,
    clear,
    get canUndo() { return stacks.undo.length > 0; },
    get canRedo() { return stacks.redo.length > 0; },
  });
}
