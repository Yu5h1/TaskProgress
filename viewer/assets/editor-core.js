import { createEditorTransaction } from "./editor-transaction.js";
import { moveReportCard } from "./card-reorder.js";
import { recordTerminalTransitions } from './item-activity.js';
import "./editor-core-runtime.js";
import {
  calculateProjectProgress,
  calculateTaskProgress,
  validateReport,
} from "./report-model.js";

const core = globalThis.TaskProgressEditorCoreRuntime.createEditorCore({
  createEditorTransaction,
  moveReportCard,
  recordTerminalTransitions,
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
