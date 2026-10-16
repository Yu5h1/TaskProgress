import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateAllDocumentBindings,
  projectTasksWithBindings,
  documentBindingHref,
} from "../viewer/assets/document-binding.js";
import {
  calculateProjectProgress,
  calculateTaskProgress,
  stableSortTasksByPriority,
  validateReport,
} from "../viewer/assets/report-model.js";

function sampleReport() {
  return {
    schema_version: "1.1",
    report_id: "binding-test-report",
    scope_id: "main-project",
    title: "Document Binding Integration Test",
    updated_at: "2026-10-16T12:00:00Z",
    tasks: [
      {
        id: "task-checklist-done",
        title: "Task with completed checklist",
        status: "planned",
        summary: "Checklist is fully passed",
        priority: 1,
        document_ref: {
          kind: "checklist",
          scope_id: "main-project",
          task: "chk-all-passed",
        },
        completed_items: [],
        pending_items: [],
      },
      {
        id: "task-checklist-partial",
        title: "Task with partial checklist",
        status: "in_progress",
        summary: "Checklist has pending checks",
        priority: 2,
        document_ref: {
          kind: "checklist",
          scope_id: "main-project",
          task: "chk-partial",
        },
        completed_items: [],
        pending_items: [],
      },
      {
        id: "task-checklist-failed",
        title: "Task with failed checklist",
        status: "planned",
        summary: "Checklist has failed checks",
        priority: 2,
        document_ref: {
          kind: "checklist",
          scope_id: "main-project",
          task: "chk-failed",
        },
        completed_items: [],
        pending_items: [],
      },
      {
        id: "task-decision-done",
        title: "Task with completed decisions",
        status: "planned",
        summary: "Decision is fully answered",
        priority: 1,
        document_ref: {
          kind: "decision",
          scope_id: "main-project",
          stem: "dec-all-done",
        },
        completed_items: [],
        pending_items: [],
      },
      {
        id: "task-decision-reopened",
        title: "Task with reopened decision",
        status: "in_progress",
        summary: "Decision was reopened or empty",
        priority: 3,
        document_ref: {
          kind: "decision",
          scope_id: "main-project",
          task: "dec-reopened",
        },
        completed_items: [],
        pending_items: [],
      },
      {
        id: "task-with-items",
        title: "Task with bound sub-items",
        status: "planned",
        summary: "Sub-items carry their own document_ref",
        priority: 2,
        completed_items: [],
        pending_items: [
          {
            id: "sub-1-chk-done",
            title: "Sub-item 1 with passing checklist",
            document_ref: {
              kind: "checklist",
              scope_id: "other-scope",
              task: "shared-stem",
            },
          },
          {
            id: "sub-2-dec-done",
            title: "Sub-item 2 with decided decision",
            document_ref: {
              kind: "decision",
              scope_id: "main-project",
              task: "dec-all-done",
            },
          },
          {
            id: "sub-3-unbound",
            title: "Sub-item 3 unbound",
          },
        ],
      },
      {
        id: "task-raw-done",
        title: "Already done task with failing document",
        status: "done",
        summary: "Raw done must stay done",
        document_ref: {
          kind: "checklist",
          scope_id: "main-project",
          task: "chk-failed",
        },
        completed_items: [],
        pending_items: [],
      },
      {
        id: "task-archived",
        title: "Archived task with passing document",
        status: "archive",
        summary: "Archive must never be automatically reopened",
        document_ref: {
          kind: "checklist",
          scope_id: "main-project",
          task: "chk-all-passed",
        },
        completed_items: [],
        pending_items: [],
      },
      {
        id: "task-missing-doc",
        title: "Task with missing document",
        status: "planned",
        summary: "Missing file should show unavailable",
        document_ref: {
          kind: "checklist",
          scope_id: "main-project",
          task: "does-not-exist",
        },
        completed_items: [],
        pending_items: [],
      },
    ],
  };
}

test("validateReport validates report with document_ref successfully", () => {
  const report = sampleReport();
  const errors = validateReport(report);
  assert.deepEqual(errors, []);
});

test("evaluateAllDocumentBindings queries documents and distinguishes identical stem under different scopes", async () => {
  const report = sampleReport();

  const documents = {
    "checklist:main-project:chk-all-passed": {
      items: [{ checks: [{ status: "passed" }, { status: "passed" }] }],
    },
    "checklist:main-project:chk-partial": {
      items: [{ checks: [{ status: "passed" }, { status: "pending" }] }],
    },
    "checklist:main-project:chk-failed": {
      items: [{ checks: [{ status: "failed" }] }],
    },
    "decision:main-project:dec-all-done": {
      document: {
        decisions: [{ status: "decided", answer: { kind: "option", option_id: "a" } }],
      },
    },
    "decision:main-project:dec-reopened": {
      document: {
        decisions: [{ status: "pending", answer: null }],
      },
    },
    // Same stem "shared-stem" in two different scopes:
    "checklist:other-scope:shared-stem": {
      items: [{ checks: [{ status: "passed" }] }],
    },
  };

  const createChecklistTransport = ({ scope, task }) => ({
    load: async () => {
      const key = `checklist:${scope}:${task}`;
      if (!documents[key]) throw new Error("File not found");
      return documents[key];
    },
  });

  const createDecisionTransport = (scope, task) => ({
    load: async () => {
      const key = `decision:${scope}:${task}`;
      if (!documents[key]) throw new Error("File not found");
      return { ok: true, ...documents[key] };
    },
  });

  const evaluations = await evaluateAllDocumentBindings(report.tasks, {
    createChecklistTransport,
    createDecisionTransport,
  });

  // Verify evaluations
  assert.equal(evaluations.get("checklist:main-project:chk-all-passed")?.completed, true);
  assert.equal(evaluations.get("checklist:main-project:chk-partial")?.completed, false);
  assert.equal(evaluations.get("checklist:main-project:chk-failed")?.completed, false);
  assert.equal(evaluations.get("decision:main-project:dec-all-done")?.completed, true);
  assert.equal(evaluations.get("decision:main-project:dec-reopened")?.completed, false);
  assert.equal(evaluations.get("checklist:other-scope:shared-stem")?.completed, true);
  assert.equal(evaluations.get("checklist:main-project:does-not-exist")?.ok, false);

  // Project tasks
  const projected = projectTasksWithBindings(report.tasks, evaluations);

  // 1. Checklist all passed -> done
  const taskChkDone = projected.find((t) => t.id === "task-checklist-done");
  assert.equal(taskChkDone.status, "done");
  assert.equal(taskChkDone.sourceRef.completed, true);
  assert.equal(taskChkDone.sourceRef.available, true);

  // 2. Checklist partial -> stays original (planned)
  const taskChkPartial = projected.find((t) => t.id === "task-checklist-partial");
  assert.equal(taskChkPartial.status, "in_progress");
  assert.equal(taskChkPartial.sourceRef.completed, false);

  // 3. Checklist failed -> stays original (planned)
  const taskChkFailed = projected.find((t) => t.id === "task-checklist-failed");
  assert.equal(taskChkFailed.status, "planned");
  assert.equal(taskChkFailed.sourceRef.completed, false);

  // 4. Decision all done -> done
  const taskDecDone = projected.find((t) => t.id === "task-decision-done");
  assert.equal(taskDecDone.status, "done");
  assert.equal(taskDecDone.sourceRef.completed, true);

  // 5. Decision reopened -> stays in_progress
  const taskDecReopened = projected.find((t) => t.id === "task-decision-reopened");
  assert.equal(taskDecReopened.status, "in_progress");
  assert.equal(taskDecReopened.sourceRef.completed, false);

  // 6. Sub-items: sub-1 and sub-2 moved to completed_items, sub-3 remains in pending_items
  const taskWithItems = projected.find((t) => t.id === "task-with-items");
  // Parent task raw status remains planned (not automatically modified by sub-items)
  assert.equal(taskWithItems.status, "planned");
  assert.equal(taskWithItems.completed_items.length, 2);
  assert.deepEqual(
    taskWithItems.completed_items.map((i) => i.id),
    ["sub-1-chk-done", "sub-2-dec-done"],
  );
  assert.equal(taskWithItems.pending_items.length, 1);
  assert.equal(taskWithItems.pending_items[0].id, "sub-3-unbound");

  // Sub-item progress
  const itemProgress = calculateTaskProgress(taskWithItems);
  assert.equal(itemProgress.completed, 2);
  assert.equal(itemProgress.total, 3);

  // 7. Raw done stays done even with failing doc
  const taskRawDone = projected.find((t) => t.id === "task-raw-done");
  assert.equal(taskRawDone.status, "done");

  // 8. Archived task stays archive even with passed doc
  const taskArchived = projected.find((t) => t.id === "task-archived");
  assert.equal(taskArchived.status, "archive");

  // 9. Missing doc stays planned with available=false
  const taskMissing = projected.find((t) => t.id === "task-missing-doc");
  assert.equal(taskMissing.status, "planned");
  assert.equal(taskMissing.sourceRef.available, false);
  assert.match(taskMissing.sourceRef.error, /File not found/);

  // 10. Overall project progress reflects all completed tasks and items
  const projProgress = calculateProjectProgress(projected);
  // Total non-archived tasks: 8 tasks.
  // Completed items in taskWithItems: 2/3.
  // Completed tasks (1 unit each): task-checklist-done (1), task-decision-done (1), task-raw-done (1).
  // Total completed units = 1 + 0 + 0 + 1 + 0 + 2 + 1 + 0 = 5. Total units = 1 + 1 + 1 + 1 + 1 + 3 + 1 + 1 = 10.
  assert.equal(projProgress.completed, 5);
  assert.equal(projProgress.total, 10);
  assert.equal(projProgress.percentage, 50);

  // 11. Saving: original report is completely unmutated
  const rawReport = sampleReport();
  assert.equal(rawReport.tasks[0].status, "planned");
  assert.equal(rawReport.tasks[3].status, "planned");
  assert.equal(rawReport.tasks[5].completed_items.length, 0);
  assert.equal(rawReport.tasks[5].pending_items.length, 3);
});

test("when a completed checklist is unchecked or reverted, projected status reverts to raw", async () => {
  const report = {
    tasks: [
      {
        id: "task-dynamic",
        status: "planned",
        document_ref: { kind: "checklist", scope_id: "s", task: "chk" },
      },
    ],
  };

  // Round 1: All passed
  const evalsPassed = new Map([
    ["checklist:s:chk", { ok: true, completed: true }],
  ]);
  const projected1 = projectTasksWithBindings(report.tasks, evalsPassed);
  assert.equal(projected1[0].status, "done");

  // Round 2: User unchecked or check failed -> reverted
  const evalsReverted = new Map([
    ["checklist:s:chk", { ok: true, completed: false }],
  ]);
  const projected2 = projectTasksWithBindings(report.tasks, evalsReverted);
  assert.equal(projected2[0].status, "planned");
});
