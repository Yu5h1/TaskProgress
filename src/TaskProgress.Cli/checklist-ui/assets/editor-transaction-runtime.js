// One draft/history owner for ES modules and classic-script editor hosts.
(function initializeEditorTransactionRuntime(global) {
  const clone = (value) => structuredClone(value);
  const signature = (value) => JSON.stringify(value);

  function createEditorTransaction(
    persistedValue,
    { derive = () => ({}), normalize = (value) => value, historyLimit = 100 } = {},
  ) {
    let persisted;
    let baseline;
    let draft;
    let derived;
    const undoStack = [];
    const redoStack = [];
    const limit = Number.isInteger(historyLimit) && historyLimit > 0 ? historyLimit : 100;
    let canMerge = false;
    let nextEntryId = 1;

    function clearHistory() {
      undoStack.length = 0;
      redoStack.length = 0;
      canMerge = false;
    }

    function history() {
      return Object.freeze({
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        undoDepth: undoStack.length,
        redoDepth: redoStack.length,
        undoCommandType: undoStack.at(-1)?.command.type ?? null,
        redoCommandType: redoStack.at(-1)?.command.type ?? null,
      });
    }

    function apply(command, reducer, mergeKey = "") {
      if (!command || typeof command !== "object" || typeof reducer !== "function") {
        throw new TypeError("Editor transaction 需要 command 與 reducer。");
      }
      const before = clone(draft);
      const next = clone(reducer(clone(draft), command));
      if (signature(before) === signature(next)) return false;
      // Finish fallible work before publishing either the draft or its history.
      const nextDerived = derive(next, baseline);
      const entry = { before, after: clone(next), command: clone(command), mergeKey };
      const previous = undoStack.at(-1);
      entry.id = canMerge && mergeKey && previous?.mergeKey === mergeKey ? previous.id : nextEntryId++;
      if (canMerge && mergeKey && previous?.mergeKey === mergeKey) {
        entry.before = previous.before;
        undoStack.pop();
        if (signature(entry.before) !== signature(entry.after)) undoStack.push(entry);
      } else {
        undoStack.push(entry);
        if (undoStack.length > limit) undoStack.shift();
      }
      redoStack.length = 0;
      canMerge = true;
      draft = next;
      derived = nextDerived;
      return true;
    }

    function restore(from, to, field) {
      const entry = from.at(-1);
      if (!entry) return false;
      const next = clone(entry[field]);
      const nextDerived = derive(next, baseline);
      from.pop();
      to.push(entry);
      draft = next;
      derived = nextDerived;
      // Editing after traversing history starts a new action, even in the same field.
      canMerge = false;
      return true;
    }

    function reset(value, keepHistory = false) {
      const nextPersisted = clone(value);
      const next = clone(normalize(clone(nextPersisted)));
      const nextBaseline = clone(next);
      const nextDerived = derive(next, nextBaseline);
      persisted = nextPersisted;
      baseline = nextBaseline;
      draft = next;
      derived = nextDerived;
      if (!keepHistory) {
        clearHistory();
      }
      // A completed save is also a boundary between separate typing actions.
      canMerge = false;
    }

    reset(persistedValue);
    return Object.freeze({
      get draft() { return draft; },
      get derived() { return derived; },
      get dirty() { return signature(draft) !== signature(baseline); },
      get history() { return history(); },
      // Public metadata only: callers never receive mutable document snapshots.
      get historyEntries() {
        return [...undoStack.map(entry => ({ id: entry.id, command: clone(entry.command), applied: true })),
          ...[...redoStack].reverse().map(entry => ({ id: entry.id, command: clone(entry.command), applied: false }))];
      },
      clearHistory,
      apply,
      undo() { return restore(undoStack, redoStack, "before"); },
      redo() { return restore(redoStack, undoStack, "after"); },
      discard() { reset(persisted); },
      // Saved revisions remain host-owned; undo restores content, not write authority.
      commit(value, { keepHistory = false } = {}) { reset(value, keepHistory); },
    });
  }

  global.TaskProgressEditorTransactionRuntime = Object.freeze({ createEditorTransaction });
})(globalThis);
