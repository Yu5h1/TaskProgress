// Shared in-memory draft, history, discard, and commit boundary for editor adapters.
function clone(value) {
  return structuredClone(value);
}

export function createEditorTransaction(
  persistedValue,
  { derive = () => ({}), historyLimit = 100 } = {},
) {
  let persisted = clone(persistedValue);
  let baseline = clone(persisted);
  let draft = clone(baseline);
  let derived = derive(draft);
  const undoStack = [];
  const redoStack = [];
  const limit = Number.isInteger(historyLimit) && historyLimit > 0 ? historyLimit : 100;

  const signature = (value) => JSON.stringify(value);

  function history() {
    return Object.freeze({
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
      undoDepth: undoStack.length,
      redoDepth: redoStack.length,
    });
  }

  function refresh() {
    derived = derive(draft);
  }

  function apply(command, reducer, mergeKey = "") {
    if (!command || typeof command !== "object" || typeof reducer !== "function") {
      throw new TypeError("Editor transaction 需要 command 與 reducer。");
    }
    const before = clone(draft);
    const next = reducer(clone(draft), command);
    if (signature(before) === signature(next)) return false;
    draft = next;
    const previous = undoStack.at(-1);
    if (mergeKey && previous?.mergeKey === mergeKey) {
      previous.after = clone(draft);
      previous.command = clone(command);
      if (signature(previous.before) === signature(previous.after)) undoStack.pop();
    } else {
      undoStack.push({
        before,
        after: clone(draft),
        command: clone(command),
        mergeKey,
      });
      if (undoStack.length > limit) undoStack.shift();
    }
    redoStack.length = 0;
    refresh();
    return true;
  }

  function undo() {
    const entry = undoStack.pop();
    if (!entry) return false;
    redoStack.push(entry);
    draft = clone(entry.before);
    refresh();
    return true;
  }

  function redo() {
    const entry = redoStack.pop();
    if (!entry) return false;
    undoStack.push(entry);
    draft = clone(entry.after);
    refresh();
    return true;
  }

  function reset(value, keepHistory = false) {
    persisted = clone(value);
    baseline = clone(persisted);
    draft = clone(baseline);
    if (!keepHistory) {
      undoStack.length = 0;
      redoStack.length = 0;
    }
    refresh();
  }

  return Object.freeze({
    get draft() { return draft; },
    get derived() { return derived; },
    get dirty() { return signature(draft) !== signature(baseline); },
    get history() { return history(); },
    apply,
    undo,
    redo,
    discard() { reset(persisted); },
    // `keepHistory` belongs to automatic persistence: every change commits on
    // its own, so clearing the stacks on each commit would leave the reader with
    // no Undo at all. Undo/Redo after a commit are ordinary new changes.
    commit(value, { keepHistory = false } = {}) { reset(value, keepHistory); },
  });
}
