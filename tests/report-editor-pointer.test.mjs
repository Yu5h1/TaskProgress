import assert from "node:assert/strict";
import test from "node:test";
import { createReportEditorAdapter } from "../viewer/assets/report-editor-adapter.js";
import { createPersistenceController } from "../viewer/assets/persistence-mode.js";

function fixture() {
  return {
    schema_version: "1.1", report_id: "pointer-editor", scope_id: "parent",
    title: "Parent", updated_at: "2026-09-30T00:00:00Z",
    tasks: [
      { id: "workflow", title: "Workflow", summary: "Work", status: "planned", priority: 4 },
      { id: "child", title: "Child report", kind: "report_pointer", report_ref: { scope_id: "child" } },
    ],
  };
}

test("priority auto-save with a pointer card drains cleanly so edit mode can exit", async () => {
  const report = fixture();
  const pointer = structuredClone(report.tasks[1]);
  const session = createReportEditorAdapter(report);
  const saved = [];
  const controller = createPersistenceController({
    session, storage: null,
    save: async payload => {
      saved.push(structuredClone(payload.report));
      return { report: payload.report };
    },
  });
  await controller.dispatch({ type: "set-task-field", taskId: "workflow", field: "priority", value: 1 });
  await controller.flush();
  assert.equal(saved.length, 1);
  assert.equal(saved[0].tasks[0].priority, 1);
  assert.deepEqual(saved[0].tasks[1], pointer);
  assert.equal(controller.snapshot().status, "saved");
  assert.equal(controller.snapshot().dirty, false);
  assert.equal(controller.snapshot().pending, false);
  assert.deepEqual(session.prepareSave().errors, []);
  assert.equal(report.tasks[0].priority, 4);
  await controller.undo();
  await controller.flush();
  assert.deepEqual(saved.at(-1).tasks[1], pointer);
  assert.equal(controller.snapshot().dirty, false);
});

test("invalid source pointer fields remain rejected instead of being silently dropped", () => {
  const report = fixture();
  report.tasks[1].pending_items = [];
  const session = createReportEditorAdapter(report);
  assert.ok(session.prepareSave().errors.some(error => error.code === "unexpected_pointer_field"));
});
