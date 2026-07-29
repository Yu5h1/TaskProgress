import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

import {
  createReportEditorSession,
  deriveReportEditorState,
  diffEditableReports,
  nextStableId,
  normalizeEditableReport,
  normalizeMeaningfulText,
} from "../viewer/assets/editor-core.js";

function sampleReport() {
  return {
    schema_version: "1.0",
    report_id: "editor-core-test",
    scope_id: "editor-core",
    title: "Editor Core",
    updated_at: "2026-07-30T00:00:00+08:00",
    tasks: [
      {
        id: "task-a",
        title: "Task A",
        status: "planned",
        summary: "Summary A",
        completed_items: ["legacy done"],
        pending_items: [{ id: "item-a", title: "Item A", priority: 2 }],
      },
    ],
  };
}

test("editor core normalizes meaningful Unicode text without touching the DOM", () => {
  assert.equal(normalizeMeaningfulText("  新增   API 驗證！  "), "新增 API 驗證！");
  assert.equal(normalizeMeaningfulText("✨…!!!"), "");
  assert.equal(normalizeMeaningfulText(" \n\t "), "");
});

test("editor core normalizes legacy items on a cloned draft", () => {
  const persisted = sampleReport();
  const draft = normalizeEditableReport(persisted, 4);

  assert.equal(typeof persisted.tasks[0].completed_items[0], "string");
  assert.deepEqual(draft.tasks[0].completed_items[0], {
    id: "item-task-a-done-1",
    title: "legacy done",
    priority: 4,
  });
});

test("editor core applies task and item commands without mutating persisted input", () => {
  const persisted = sampleReport();
  const session = createReportEditorSession(persisted, { fallbackPriority: 4 });
  const legacyId = session.draft.tasks[0].completed_items[0].id;

  session.dispatch({
    type: "set-task-field",
    taskId: "task-a",
    field: "summary",
    value: "Changed",
  });
  session.dispatch({
    type: "set-item-field",
    taskId: "task-a",
    field: "completed_items",
    itemId: legacyId,
    property: "priority",
    value: 1,
  });
  session.dispatch({
    type: "add-item",
    taskId: "task-a",
    field: "pending_items",
    item: { id: "item-b", title: "Item B", priority: 2 },
  });

  assert.equal(session.dirty, true);
  assert.equal(session.task("task-a").summary, "Changed");
  assert.equal(session.task("task-a").completed_items[0].priority, 1);
  assert.equal(session.task("task-a").pending_items.length, 2);
  assert.equal(persisted.tasks[0].summary, "Summary A");
  assert.equal(typeof persisted.tasks[0].completed_items[0], "string");
});

test("editor core discards the whole draft and restores the normalized baseline", () => {
  const session = createReportEditorSession(sampleReport(), { fallbackPriority: 4 });
  session.dispatch({ type: "delete-task", taskId: "task-a" });

  assert.equal(session.draft.tasks.length, 0);
  assert.equal(session.dirty, true);

  session.discard();

  assert.equal(session.draft.tasks.length, 1);
  assert.equal(session.dirty, false);
  assert.equal(session.task("task-a").completed_items[0].title, "legacy done");
});

test("editor core prepares a timestamped save without mutating the draft", () => {
  const session = createReportEditorSession(sampleReport());
  session.dispatch({
    type: "set-task-field",
    taskId: "task-a",
    field: "title",
    value: "Updated Task",
  });
  const prepared = session.prepareSave("2026-07-30T02:00:00+08:00");

  assert.equal(prepared.updated_at, "2026-07-30T02:00:00+08:00");
  assert.equal(prepared.tasks[0].title, "Updated Task");
  assert.equal(session.draft.updated_at, "2026-07-30T00:00:00+08:00");
  assert.equal(session.dirty, true);
});

test("editor core clears dirty when commands restore the baseline", () => {
  const session = createReportEditorSession(sampleReport());

  session.dispatch({
    type: "set-task-field",
    taskId: "task-a",
    field: "summary",
    value: "Changed",
  });
  assert.equal(session.dirty, true);

  session.dispatch({
    type: "set-task-field",
    taskId: "task-a",
    field: "summary",
    value: "Summary A",
  });
  assert.equal(session.dirty, false);
});

test("editor core derives validation and progress from the current draft", () => {
  const session = createReportEditorSession(sampleReport());
  const initial = session.derived;

  assert.deepEqual(initial.validation, []);
  assert.deepEqual(initial.progress.project, {
    completed: 1,
    total: 2,
    percentage: 50,
  });
  assert.deepEqual(initial.progress.tasks["task-a"], {
    completed: 1,
    total: 2,
  });

  session.dispatch({
    type: "set-task-field",
    taskId: "task-a",
    field: "title",
    value: "",
  });

  assert.ok(session.derived.validation.some(
    (error) => error.path === "tasks[0].title",
  ));
});

test("content-only edits do not invalidate time projections", () => {
  const baseline = normalizeEditableReport(sampleReport());
  const draft = structuredClone(baseline);
  draft.tasks[0].summary = "Updated summary";
  draft.tasks[0].pending_items[0].title = "Renamed item";
  draft.tasks[0].priority = 0;

  const derived = deriveReportEditorState(baseline, draft);

  assert.equal(derived.dirty, true);
  assert.equal(derived.timeInvalidation.stale, false);
  assert.deepEqual(
    derived.diff.changes.map((change) => change.kind),
    ["task-updated", "item-updated"],
  );
});

test("structural and completion-state changes identify stale time targets", () => {
  const baseline = normalizeEditableReport(sampleReport());
  const draft = structuredClone(baseline);
  const moved = draft.tasks[0].pending_items.pop();
  draft.tasks[0].completed_items.push(moved);
  draft.tasks[0].pending_items.push({
    id: "item-new",
    title: "New work",
    priority: 2,
  });

  const diff = diffEditableReports(baseline, draft);

  assert.equal(diff.timeInvalidation.stale, true);
  assert.deepEqual(diff.timeInvalidation.taskIds, ["task-a"]);
  assert.deepEqual(
    new Set(diff.timeInvalidation.itemIds),
    new Set(["item-a", "item-new"]),
  );
  assert.ok(diff.changes.some((change) => change.kind === "item-state-changed"));
  assert.ok(diff.changes.some((change) => change.kind === "item-added"));
});

test("editor core rejects duplicate IDs and unsupported commands", () => {
  const session = createReportEditorSession(sampleReport());

  assert.throws(
    () => session.dispatch({
      type: "add-task",
      task: { id: "task-a", title: "Duplicate" },
    }),
    /已存在/,
  );
  assert.throws(
    () => session.dispatch({ type: "unknown" }),
    /不支援/,
  );
  assert.equal(nextStableId("task-a", new Set(["task-a"])), "task-a-1");
});

test("editor core runtime works as a classic script for the file Demo", async () => {
  const source = await readFile(
    new URL("../viewer/assets/editor-core-runtime.js", import.meta.url),
    "utf8",
  );
  const context = vm.createContext({ structuredClone });
  context.globalThis = context;
  vm.runInContext(source, context);

  const runtimeCore = context.TaskProgressEditorCoreRuntime.createEditorCore({
    calculateTaskProgress(task) {
      return {
        completed: task.completed_items.length,
        total: task.completed_items.length + task.pending_items.length,
      };
    },
    calculateProjectProgress(tasks) {
      const progress = tasks.map((task) => ({
        completed: task.completed_items.length,
        total: task.completed_items.length + task.pending_items.length,
      }));
      const completed = progress.reduce((sum, item) => sum + item.completed, 0);
      const total = progress.reduce((sum, item) => sum + item.total, 0);
      return { completed, total, percentage: Math.round((completed / total) * 100) };
    },
    validateReport() {
      return [];
    },
  });
  const session = runtimeCore.createReportEditorSession(sampleReport());

  session.dispatch({
    type: "add-item",
    taskId: "task-a",
    field: "completed_items",
    item: { id: "item-classic", title: "Classic item", priority: 1 },
  });

  assert.equal(session.dirty, true);
  assert.deepEqual(
    { ...session.derived.progress.project },
    { completed: 2, total: 3, percentage: 67 },
  );
  session.discard();
  assert.equal(session.dirty, false);
});
