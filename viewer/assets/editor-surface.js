import "./editor-surface-runtime.js";
import { PRIORITY_POLICY, STATUS_META } from "./report-model.js";

/*
 * Remaining framework-neutral helper. Task cards, item rows, priority
 * controls, field validation, the mode toggle, the save bar and the add
 * control all live in the shared Svelte components now; what stays here is
 * the keyboard binding, which is document-level behaviour rather than markup.
 */
export const editorSurface = globalThis.TaskProgressEditorSurfaceRuntime.createEditorSurface({
  document: globalThis.document,
  priorityPolicy: PRIORITY_POLICY,
  statusMeta: STATUS_META,
});

export const {
  bindHistoryShortcuts,
} = editorSurface;
