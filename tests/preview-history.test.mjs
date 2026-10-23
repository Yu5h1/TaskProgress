import test from "node:test";
import assert from "node:assert/strict";
import { createPreviewHistory } from "../viewer/assets/preview-history.js";

const at = (stamp, next) => ({ updated_at: stamp, next, tasks: [] });

test("undo restores the replaced report and redo reapplies it", () => {
  const history = createPreviewHistory();
  const original = at("t0", undefined);
  const marked = at("t1", { task_id: "a", item_id: "x" });
  history.record(original, marked);
  assert.equal(history.canUndo, true);
  assert.equal(history.canRedo, false);

  const restore = history.target("undo", marked);
  assert.deepEqual(restore, original);
  const undone = { ...restore, updated_at: "t2" };
  history.complete("undo", undone);
  assert.equal(history.canUndo, false);
  assert.equal(history.canRedo, true);

  assert.deepEqual(history.target("redo", undone), marked);
  history.complete("redo", { ...marked, updated_at: "t3" });
  assert.equal(history.canUndo, true);
  assert.deepEqual(history.target("undo", { ...marked, updated_at: "t3" }), undone);
});

test("a new write clears redo", () => {
  const history = createPreviewHistory();
  history.record(at("t0"), at("t1"));
  history.complete("undo", at("t2"));
  history.record(at("t2"), at("t3"));
  assert.equal(history.canRedo, false);
});

test("a persisted report that moved on makes the step stale", () => {
  const history = createPreviewHistory();
  history.record(at("t0"), at("t1"));
  assert.equal(history.target("undo", at("t9")), "stale");
  assert.equal(history.target("redo", at("t1")), null);
});

test("returned reports are copies and the stack is bounded", () => {
  const history = createPreviewHistory({ limit: 2 });
  history.record(at("t0"), at("t1"));
  history.record(at("t1"), at("t2"));
  history.record(at("t2"), at("t3"));
  const restore = history.target("undo", at("t3"));
  restore.updated_at = "changed";
  assert.deepEqual(history.target("undo", at("t3")), at("t2"));
  history.complete("undo", at("t4"));
  history.complete("undo", at("t5"));
  assert.equal(history.canUndo, false);
});
