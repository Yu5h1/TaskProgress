import "./editor-core-runtime.js";
import {
  calculateProjectProgress,
  calculateTaskProgress,
  validateReport,
} from "./report-model.js";

const core = globalThis.TaskProgressEditorCoreRuntime.createEditorCore({
  calculateProjectProgress,
  calculateTaskProgress,
  validateReport,
});

export const {
  createReportEditorSession,
  deriveReportEditorState,
  diffEditableReports,
  nextStableId,
  normalizeEditableReport,
  normalizeMeaningfulText,
} = core;
