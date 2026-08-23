import {
  createTimeIndex,
  inspectTimeAnalysis,
} from "../../../viewer/assets/time-model.js";
import { freezeJsonSnapshot } from "./module-contract.js";

export const TIME_MODULE_TYPE = "taskprogress.time";

function semanticTask(task) {
  return {
    task_id: task.task_id,
    total_likely_minutes: task.total_likely_minutes,
    items: task.items.map((item) => ({
      item_id: item.item_id,
      estimate_id: item.estimate_id,
      likely_minutes: item.likely_minutes,
      display_hours: item.display_hours,
      mode: item.mode,
      confidence: item.confidence,
    })),
  };
}
function semanticSnapshot(input, inspection) {
  const analysis = input.artifact;
  return freezeJsonSnapshot({
    module_id: input.descriptor.id,
    module_type: input.descriptor.type,
    schema_version: analysis.schema_version,
    scope_id: analysis.scope_id,
    analysis_id: analysis.analysis_id,
    estimate_available: true,
    deadline_available: inspection.deadlineAvailable,
    summary: {
      total_estimated_minutes: analysis.summary.total_estimated_minutes,
      calibrated_total_minutes: analysis.summary.calibrated_total_minutes,
      remaining_estimated_minutes: analysis.summary.remaining_estimated_minutes,
      overall_confidence: analysis.summary.overall_confidence,
      estimate_composition: structuredClone(analysis.summary.estimate_composition),
    },
    tasks: analysis.tasks.map(semanticTask),
    diagnostics: analysis.diagnostics.map(({ level, code }) => ({ level, code })),
  });
}

export function createTimeModuleDefinition() {
  return Object.freeze({
    type: TIME_MODULE_TYPE,
    supportedSchemaVersions: Object.freeze(["0.2"]),
    inspect(input) {
      if (input.descriptor.type !== TIME_MODULE_TYPE) {
        throw new Error(`Time Module 不支援 ${input.descriptor.type}。`);
      }
      const inspection = inspectTimeAnalysis(
        input.artifact,
        input.report_identity.scope_id,
      );
      if (inspection.errors.length > 0) {
        throw new Error(`Time Module 驗證失敗：${inspection.errors.join("；")}`);
      }
      const index = createTimeIndex(input.artifact);
      const semantic = semanticSnapshot(input, inspection);
      return Object.freeze({
        semantic,
        deadlineDiagnostics: Object.freeze([...inspection.deadlineErrors]),
        task(taskId) {
          return index.tasks.get(taskId) ?? null;
        },
        item(itemId) {
          return index.items.get(itemId) ?? null;
        },
      });
    },
  });
}
