import assert from "node:assert/strict";
import test from "node:test";

import {
  createReportEditorSession,
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
