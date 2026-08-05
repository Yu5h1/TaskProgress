import "./editor-surface-runtime.js";
import { PRIORITY_POLICY, STATUS_META } from "./report-model.js";

/*
 * Remaining framework-neutral helpers. Task cards, item rows, priority
 * controls, the mode toggle, the save bar and the add control now live in the
 * shared Svelte components; what stays here is the keyboard binding, which is
 * document-level behaviour rather than markup, plus the field-validation and
 * card helpers the frozen Demo still references.
 */
export const editorSurface = globalThis.TaskProgressEditorSurfaceRuntime.createEditorSurface({
  document: globalThis.document,
  priorityPolicy: PRIORITY_POLICY,
  statusMeta: STATUS_META,
});

export const {
  bindHistoryShortcuts,
  clearFieldError,
  createItemRow,
  createPriorityBadge,
  createPrioritySelect,
  createTaskCardShell,
  reportFieldError,
  setFieldError,
  setTaskFraction,
} = editorSurface;
