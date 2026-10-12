import assert from "node:assert/strict";
import test from "node:test";
import { createEditorTransaction } from "../viewer/assets/editor-transaction.js";
import { createReportEditorSession } from "../viewer/assets/editor-core.js";
import { createReportEditorAdapter } from "../viewer/assets/report-editor-adapter.js";
import { createChecklistEditorSession } from "../viewer/assets/checklist-editor.js";
import { createPersistenceController } from "../viewer/assets/persistence-mode.js";

const reduce = (draft, command) => ({ ...draft, value: command.value });
const edit = (tx, value, key = "") => tx.apply({ type: "set", value }, reduce, key);
const state = tx => structuredClone({ draft: tx.draft, derived: tx.derived, dirty: tx.dirty, history: tx.history });

test("empty history is inert; typing merges and returning to the starting value removes the step", () => {
  const tx = createEditorTransaction({ value: "" });
  assert.equal(tx.undo(), false);
  assert.equal(tx.redo(), false);
  edit(tx, "a", "text");
  edit(tx, "ab", "text");
  assert.equal(tx.history.undoDepth, 1);
  assert.equal(tx.history.undoCommandType, "set");
  tx.undo();
  assert.equal(tx.draft.value, "");
  tx.redo();
  assert.equal(tx.draft.value, "ab");
  tx.discard();
  edit(tx, "a", "text");
  edit(tx, "", "text");
  assert.equal(tx.history.undoDepth, 0);
  assert.equal(tx.dirty, false);
});

test("undo then editing the earlier field creates a branch without merging into the earlier action", () => {
  const tx = createEditorTransaction({ value: "" });
  edit(tx, "a", "first");
  edit(tx, "b", "second");
  tx.undo();
  const beforeNoOp = state(tx);
  assert.equal(edit(tx, "a", "first"), false);
  assert.deepEqual(state(tx), beforeNoOp, "a no-op must preserve redo");
  edit(tx, "c", "first");
  assert.equal(tx.history.canRedo, false);
  assert.equal(tx.history.undoDepth, 2);
  tx.undo();
  assert.equal(tx.draft.value, "a");
  tx.undo();
  assert.equal(tx.draft.value, "");
});

test("redo and successful saves separate later typing while keepHistory preserves traversal", () => {
  const tx = createEditorTransaction({ value: "" });
  edit(tx, "a", "text");
  tx.undo();
  tx.redo();
  edit(tx, "b", "text");
  tx.undo();
  assert.equal(tx.draft.value, "a");
  tx.redo();
  tx.commit(tx.draft, { keepHistory: true });
  assert.equal(tx.dirty, false);
  edit(tx, "c", "text");
  tx.undo();
  assert.equal(tx.draft.value, "b");
  assert.equal(tx.dirty, false);
  tx.undo();
  assert.equal(tx.draft.value, "a");
  assert.equal(tx.dirty, true);
  tx.discard();
  assert.equal(tx.draft.value, "b");
  assert.equal(tx.history.canUndo, false);
  assert.equal(tx.history.canRedo, false);
  edit(tx, "d");
  tx.commit(tx.draft);
  assert.equal(tx.history.undoDepth, 0);
});

test("bounded history evicts only the oldest step and invalid limits use the default", () => {
  const tx = createEditorTransaction({ value: 0 }, { historyLimit: 2 });
  for (const value of [1, 2, 3]) edit(tx, value);
  assert.equal(tx.history.undoDepth, 2);
  tx.undo(); tx.undo();
  assert.equal(tx.draft.value, 1);
  assert.equal(tx.undo(), false);
  tx.redo(); tx.redo();
  assert.equal(tx.draft.value, 3);
  for (const historyLimit of [0, -1, 1.5, NaN]) {
    const fallback = createEditorTransaction({ value: 0 }, { historyLimit });
    for (let value = 1; value <= 101; value++) edit(fallback, value);
    assert.equal(fallback.history.undoDepth, 100);
  }
});

test("reducer and derivation failures do not partially edit the draft or history", () => {
  const tx = createEditorTransaction({ value: 0 }, {
    derive: draft => {
      if (draft.value === 9) throw new Error("derive failed");
      return { doubled: draft.value * 2 };
    },
  });
  edit(tx, 1); edit(tx, 2); tx.undo();
  const before = state(tx);
  assert.throws(() => tx.apply({ type: "bad" }, draft => {
    draft.value = 7;
    throw new Error("reducer failed");
  }), /reducer failed/);
  assert.deepEqual(state(tx), before);
  assert.throws(() => edit(tx, 9), /derive failed/);
  assert.deepEqual(state(tx), before);
  assert.throws(() => tx.commit({ value: 9 }), /derive failed/);
  assert.deepEqual(state(tx), before);
  tx.redo();
  assert.equal(tx.derived.doubled, 4);
});

test("undo derivation failure leaves both history stacks and draft available for retry", () => {
  let fail = false;
  const tx = createEditorTransaction({ value: 0 }, { derive: () => {
    if (fail) throw new Error("derive failed");
    return {};
  } });
  edit(tx, 1);
  const before = state(tx);
  fail = true;
  assert.throws(() => tx.undo(), /derive failed/);
  assert.deepEqual(state(tx), before);
  fail = false;
  tx.undo();
  assert.equal(tx.draft.value, 0);
});

test("transaction isolates input and reducer-owned data and derives against the latest normalized baseline", () => {
  const input = { value: 1 };
  const tx = createEditorTransaction(input, {
    normalize: value => ({ ...value, normalized: true }),
    derive: (draft, baseline) => ({ delta: draft.value - baseline.value }),
  });
  input.value = 99;
  const next = { value: 2, normalized: true };
  tx.apply({ type: "set" }, () => next);
  next.value = 88;
  assert.equal(tx.draft.value, 2);
  tx.commit({ value: 3 }, { keepHistory: true });
  tx.undo();
  assert.equal(tx.draft.value, 1);
  assert.equal(tx.draft.normalized, true);
  assert.equal(tx.derived.delta, -2);
  tx.discard();
  assert.equal(tx.draft.value, 3);
});

function reportFixture() {
  return {
    schema_version: "1.0", report_id: "history", scope_id: "history",
    title: "History", updated_at: "2026-10-12T00:00:00Z",
    tasks: [{ id: "a", title: "A", summary: "Original", status: "planned", priority: 4,
      pending_items: [], completed_items: [] }],
  };
}
const reportEdit = value => ({ type: "set-task-field", taskId: "a", field: "summary", value });

test("Report traverses the shared transaction rather than maintaining its own history", () => {
  let calls = 0;
  const core = globalThis.TaskProgressEditorCoreRuntime.createEditorCore({
    createEditorTransaction: (...args) => { calls++; return createEditorTransaction(...args); },
    calculateTaskProgress: () => ({}), calculateProjectProgress: () => ({}), validateReport: () => [],
  });
  const session = core.createReportEditorSession(reportFixture());
  assert.equal(calls, 1);
  session.dispatch(reportEdit("First"));
  session.commit(session.draft, { keepHistory: true });
  session.dispatch(reportEdit("Second"));
  session.undo();
  assert.equal(session.task("a").summary, "First");
  session.redo();
  assert.equal(session.task("a").summary, "Second");
});

test("Report failure during normalization does not replace the last saved draft", () => {
  const session = createReportEditorSession(reportFixture());
  session.dispatch(reportEdit("First"));
  const before = structuredClone(session.draft);
  assert.throws(() => session.commit({ ...reportFixture(), tasks: [null] }));
  assert.deepEqual(session.draft, before);
  session.discard();
  assert.equal(session.task("a").summary, "Original");
});

test("Report auto-save, undo, redo and failed save retain history; cautious mode stages changes", async () => {
  const session = createReportEditorAdapter(reportFixture());
  const saved = [];
  let fail = false;
  const controller = createPersistenceController({ session, storage: null, save: async payload => {
    if (fail) throw new Error("save failed");
    saved.push(structuredClone(payload.report));
    return { report: payload.report };
  } });
  await controller.dispatch(reportEdit("First"));
  await controller.dispatch(reportEdit("Second"));
  await controller.undo();
  assert.equal(saved.at(-1).tasks[0].summary, "First");
  await controller.redo();
  assert.equal(saved.at(-1).tasks[0].summary, "Second");
  fail = true;
  await controller.dispatch(reportEdit("Third"));
  assert.equal(controller.snapshot().status, "error");
  assert.equal(controller.snapshot().report.tasks[0].summary, "Third");
  assert.equal(controller.snapshot().dirty, true);
  fail = false;
  await controller.save();
  await controller.undo();
  assert.equal(saved.at(-1).tasks[0].summary, "Second");
  await controller.setCautious(true);
  const count = saved.length;
  controller.dispatch(reportEdit("Draft"));
  await controller.flush();
  assert.equal(saved.length, count);
  controller.undo();
  assert.equal(controller.snapshot().report.tasks[0].summary, "Second");
  controller.redo();
  await controller.save();
  assert.equal(saved.at(-1).tasks[0].summary, "Draft");
});

test("Checklist retains the newest write revision while undo and redo restore saved content", async () => {
  const document = { revision: "r0", items: [{ id: 1, status: "pending", checks: [
    { index: 0, isManual: true, status: "pending", observed: null },
  ] }] };
  const session = createChecklistEditorSession(document);
  const revisions = [];
  const controller = createPersistenceController({ session, storage: null, save: async payload => {
    revisions.push(payload.revision);
    const saved = structuredClone(document);
    saved.revision = `r${revisions.length}`;
    Object.assign(saved.items[0].checks[0], payload.results[0]);
    return saved;
  } });
  await controller.dispatch({ type: "set-result", workItemId: 1, checkIndex: 0, status: "passed" });
  await controller.undo();
  assert.equal(controller.snapshot().document.items[0].checks[0].status, "pending");
  await controller.redo();
  assert.equal(controller.snapshot().document.items[0].checks[0].status, "passed");
  assert.deepEqual(revisions, ["r0", "r1", "r2"]);
});
