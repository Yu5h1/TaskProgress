(function initializeTaskProgressEditorSurfaceRuntime(global) {
// Framework-neutral Editor Surface. Task cards, item rows, priority controls,
// and field validation moved to the shared Svelte components (TaskCard.svelte,
// ItemRow.svelte, AddControl.svelte); what stays here is the keyboard binding,
// which is document-level behaviour rather than markup.
function createEditorSurface({
  document,
  priorityPolicy,
  statusMeta,
} = {}) {
  if (!document || typeof document.createElement !== "function") {
    throw new TypeError("Editor Surface 需要可建立元素的 document。");
  }
  if (
    !priorityPolicy
    || typeof priorityPolicy.format !== "function"
    || typeof priorityPolicy.normalize !== "function"
    || !Array.isArray(priorityPolicy.levels)
  ) {
    throw new TypeError("Editor Surface 需要 priority policy。");
  }
  if (!statusMeta || typeof statusMeta !== "object" || Array.isArray(statusMeta)) {
    throw new TypeError("Editor Surface 需要 status metadata。");
  }

  function bindHistoryShortcuts(target, {
    isActive = () => true,
    onUndo,
    onRedo,
  } = {}) {
    if (!target || typeof target.addEventListener !== "function") {
      throw new TypeError("History shortcuts 需要事件 target。");
    }
    const handleKeydown = (event) => {
      if (!isActive() || event.altKey || !(event.ctrlKey || event.metaKey)) return;
      const key = String(event.key ?? "").toLowerCase();
      const redo = (key === "z" && event.shiftKey) || key === "y";
      const undo = key === "z" && !event.shiftKey;
      if (!undo && !redo) return;
      const handled = redo
        ? (typeof onRedo === "function" && onRedo())
        : (typeof onUndo === "function" && onUndo());
      if (handled !== false) event.preventDefault();
    };
    target.addEventListener("keydown", handleKeydown);
    return Object.freeze({
      dispose() {
        target.removeEventListener?.("keydown", handleKeydown);
      },
    });
  }

  return Object.freeze({
    bindHistoryShortcuts,
  });
}

global.TaskProgressEditorSurfaceRuntime = Object.freeze({ createEditorSurface });
}(globalThis));
