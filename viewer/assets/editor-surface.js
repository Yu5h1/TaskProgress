import "./editor-surface-runtime.js";
import { PRIORITY_POLICY, STATUS_META } from "./report-model.js";

export const editorSurface = globalThis.TaskProgressEditorSurfaceRuntime.createEditorSurface({
  document: globalThis.document,
  priorityPolicy: PRIORITY_POLICY,
  statusMeta: STATUS_META,
});

export const {
  bindHistoryShortcuts,
  clearFieldError,
  createAddControl,
  createItemRow,
  createModeController,
  createPriorityBadge,
  createPrioritySelect,
  createSaveBar,
  createTaskCardShell,
  reportFieldError,
  setFieldError,
  setTaskFraction,
} = editorSurface;
