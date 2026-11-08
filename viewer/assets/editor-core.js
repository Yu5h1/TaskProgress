import { createEditorTransaction } from "./editor-transaction.js";
import { moveReportCard } from "./card-reorder.js";
import "./editor-core-runtime.js";
import {
  calculateProjectProgress,
  calculateTaskProgress,
  validateReport,
} from "./report-model.js";

const core = globalThis.TaskProgressEditorCoreRuntime.createEditorCore({
  createEditorTransaction,
  moveReportCard,
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
