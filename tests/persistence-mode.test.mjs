// Covers the shared auto/cautious persistence contract: when a commit happens,
// what a failed commit keeps, where the preference lives, and which controls the
// shared SaveBar renders per mode.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createChecklistEditorSession } from "../viewer/assets/checklist-editor.js";
import { createEditorTransaction } from "../viewer/assets/editor-transaction.js";
import {
  CAUTIOUS_MODE_STORAGE_KEY,
  createPersistenceController,
  loadCautiousPreference,
  saveCautiousPreference,
} from "../viewer/assets/persistence-mode.js";

function fakeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
  };
}

function fakeTimers() {
  const scheduled = new Map();
  let next = 0;
  return {
    setTimeout(callback) {
      const id = ++next;
      scheduled.set(id, callback);
      return id;
    },
    clearTimeout(id) {
      scheduled.delete(id);
    },
    get pending() {
      return scheduled.size;
    },
    run() {
      const callbacks = [...scheduled.values()];
      scheduled.clear();
      callbacks.forEach((callback) => callback());
    },
  };
}

// A minimal session on the shared editor transaction: the controller must work
// against that one draft/history/commit boundary, not a persistence-only copy.
function textSession(initial = "") {
  let revision = "r1";
  const transaction = createEditorTransaction({ revision, value: initial });
  const reduce = (draft, command) => ({ ...draft, value: command.value });
  return {
    snapshot: () => Object.freeze({
      document: transaction.draft,
      dirty: transaction.dirty,
      history: transaction.history,
    }),
    dispatch(command) {
      transaction.apply(command, reduce, command.type === "set-text" ? "text" : "");
    },
    undo() { transaction.undo(); },
    redo() { transaction.redo(); },
    discard() { transaction.discard(); },
    commit(saved) {
      revision = saved.revision;
      transaction.commit(saved, { keepHistory: true });
    },
    prepareSave() {
      const { value } = transaction.draft;
      return {
        revision,
        results: [{ value }],
        errors: value === "!" ? [{ code: "incomplete", message: "草稿尚未完成。" }] : [],
      };
    },
  };
}

function harness({ storage = fakeStorage(), save, session = textSession() } = {}) {
  const calls = [];
  const timers = fakeTimers();
  const controller = createPersistenceController({
    session,
    storage,
    timers,
    debounceCommand: (command) => command.type === "set-text",
    save: save ?? (async (payload) => {
      calls.push(payload);
      return { revision: `r${calls.length + 1}`, value: payload.results[0].value };
    }),
  });
  return { controller, calls, timers, storage, session };
}

test("the persistence preference defaults to automatic and only lives in profile storage", () => {
  assert.equal(CAUTIOUS_MODE_STORAGE_KEY, "task-progress.cautious-mode.v1");
  assert.equal(loadCautiousPreference(fakeStorage()), false);
  assert.equal(loadCautiousPreference(undefined), false);

  const storage = fakeStorage();
  saveCautiousPreference(storage, true);
  assert.equal(storage.getItem(CAUTIOUS_MODE_STORAGE_KEY), "true");
  assert.equal(loadCautiousPreference(storage), true);

  const { controller } = harness();
  assert.equal(controller.snapshot().mode, "auto");
  assert.equal(controller.snapshot().cautious, false);
  const restored = harness({ storage }).controller.snapshot();
  assert.equal(restored.mode, "cautious");
});

test("automatic mode commits discrete commands at once and debounces text", async () => {
  const { controller, calls, timers } = harness();

  await controller.dispatch({ type: "set-flag", value: "on" });
  assert.deepEqual(calls, [{ revision: "r1", results: [{ value: "on" }] }]);
  assert.equal(controller.snapshot().status, "saved");
  assert.equal(controller.snapshot().dirty, false);

  controller.dispatch({ type: "set-text", value: "d" });
  controller.dispatch({ type: "set-text", value: "dr" });
  controller.dispatch({ type: "set-text", value: "draft" });
  assert.equal(calls.length, 1, "text input must not commit per keystroke");
  assert.equal(controller.snapshot().status, "pending");
  assert.equal(timers.pending, 1, "a new keystroke replaces the pending debounce");

  timers.run();
  await controller.flush();
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1].results, [{ value: "draft" }]);
  assert.equal(controller.snapshot().status, "saved");
});

test("Undo and Redo are ordinary automatic commits", async () => {
  const { controller, calls } = harness();
  await controller.dispatch({ type: "set-flag", value: "on" });

  controller.undo();
  await controller.flush();
  assert.deepEqual(calls.at(-1).results, [{ value: "" }]);

  controller.redo();
  await controller.flush();
  assert.deepEqual(calls.at(-1).results, [{ value: "on" }]);
  assert.equal(calls.length, 3);
});

test("an incomplete draft is never written and does not pause automatic mode", async () => {
  const { controller, calls } = harness();
  await controller.dispatch({ type: "set-flag", value: "!" });
  assert.equal(calls.length, 0);
  assert.equal(controller.snapshot().status, "incomplete");
  assert.equal(controller.snapshot().blocked, false);
  assert.equal(controller.snapshot().dirty, true, "the draft stays on screen");

  await controller.dispatch({ type: "set-flag", value: "observed" });
  assert.equal(calls.length, 1);
  assert.equal(controller.snapshot().status, "saved");
});

test("a conflict keeps the draft and pauses automatic commits until an explicit retry", async () => {
  let failing = true;
  const calls = [];
  const { controller } = harness({
    save: async (payload) => {
      calls.push(payload);
      if (failing) {
        const error = new Error("Checklist 已被外部修改；草稿尚未覆寫來源檔案。");
        error.code = "revision_conflict";
        throw error;
      }
      return { revision: "r9", value: payload.results[0].value };
    },
  });

  await controller.dispatch({ type: "set-flag", value: "on" });
  let view = controller.snapshot();
  assert.equal(view.status, "conflict");
  assert.equal(view.blocked, true);
  assert.equal(view.dirty, true, "a rejected save must not drop the draft");
  assert.equal(view.document.value, "on");

  await controller.dispatch({ type: "set-flag", value: "again" });
  assert.equal(calls.length, 1, "a paused mode collects changes without retrying");
  assert.equal(controller.snapshot().status, "conflict");

  failing = false;
  await controller.save();
  view = controller.snapshot();
  assert.equal(calls.length, 2);
  assert.equal(view.status, "saved");
  assert.equal(view.blocked, false);
  assert.equal(view.dirty, false);
});

test("cautious mode holds a draft behind explicit Save and Discard", async () => {
  const storage = fakeStorage();
  const { controller, calls } = harness({ storage });
  await controller.setCautious(true);
  assert.equal(storage.getItem(CAUTIOUS_MODE_STORAGE_KEY), "true");

  controller.dispatch({ type: "set-flag", value: "on" });
  assert.equal(calls.length, 0);
  assert.equal(controller.snapshot().status, "draft");
  assert.equal(controller.snapshot().dirty, true);

  controller.discard();
  assert.equal(controller.snapshot().dirty, false);
  assert.equal(calls.length, 0);

  controller.dispatch({ type: "set-flag", value: "kept" });
  await controller.save();
  assert.deepEqual(calls, [{ revision: "r1", results: [{ value: "kept" }] }]);
  assert.equal(controller.snapshot().dirty, false);
});

test("mode switches wait for pending automatic saves and refuse to strand a draft", async () => {
  const storage = fakeStorage();
  const { controller, calls, timers } = harness({ storage });

  controller.dispatch({ type: "set-text", value: "typed" });
  assert.equal(calls.length, 0);
  await controller.setCautious(true);
  assert.equal(calls.length, 1, "entering cautious mode flushes the pending automatic save");
  assert.equal(timers.pending, 0);
  assert.equal(controller.snapshot().dirty, false);

  controller.dispatch({ type: "set-flag", value: "draft" });
  await controller.setCautious(false);
  assert.equal(controller.snapshot().mode, "cautious", "an uncommitted draft blocks the switch");
  assert.equal(controller.snapshot().status, "mode_blocked");
  assert.equal(storage.getItem(CAUTIOUS_MODE_STORAGE_KEY), "true");

  await controller.save();
  await controller.setCautious(false);
  assert.equal(controller.snapshot().mode, "auto");
  assert.equal(storage.getItem(CAUTIOUS_MODE_STORAGE_KEY), "false");
});

test("the Checklist session saves through the same controller and revision contract", async () => {
  const document = {
    fileName: "task-a.checklist",
    revision: "abc",
    roundIdentity: "plan.md#round",
    items: [{
      id: 1,
      status: "pending",
      title: "Build UI",
      dependsOn: [],
      outcome: "The UI works.",
      checks: [{
        index: 0,
        status: "pending",
        title: "Manual check",
        isManual: true,
        action: "Open the app.",
        expect: "It is usable.",
        reason: "Requires UX judgment.",
        observed: null,
        resolved: null,
      }],
    }],
  };
  const { controller, calls, timers } = harness({
    session: createChecklistEditorSession(document),
    save: async (payload) => {
      calls.push(payload);
      return structuredClone({ ...document, revision: "def" });
    },
  });

  await controller.dispatch({ type: "set-result", workItemId: 1, checkIndex: 0, status: "failed" });
  assert.equal(calls.length, 0, "a failure without Observed is not written");
  assert.equal(controller.snapshot().status, "incomplete");

  controller.dispatch({
    type: "set-observed",
    workItemId: 1,
    checkIndex: 0,
    value: "The dialog stayed open.",
  });
  assert.equal(calls.length, 0);
  timers.run();
  await controller.flush();
  assert.deepEqual(calls, [{
    revision: "abc",
    results: [{ workItemId: 1, checkIndex: 0, status: "failed", observed: "The dialog stayed open." }],
  }]);
  assert.equal(controller.snapshot().document.revision, "def");
});

test("the shared SaveBar owns both modes and the Checklist reuses it", async () => {
  const [saveBar, app, controller, bridge] = await Promise.all([
    readFile(new URL("../experiments/editor-svelte-spike/src/SaveBar.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/ChecklistApp.svelte", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/persistence-mode.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/checklist-bridge.js", import.meta.url), "utf8"),
  ]);

  // Save and Discard exist only in cautious mode; status and history do not move.
  const cautiousOnly = saveBar.slice(saveBar.indexOf("{#if cautious}"));
  assert.match(cautiousOnly, /edit-discard-button/u);
  assert.match(cautiousOnly, /edit-save-button/u);
  assert.doesNotMatch(saveBar.slice(0, saveBar.indexOf("{#if cautious}")), /edit-save-button|edit-discard-button/u);
  assert.match(saveBar, /onToggleCautious\(!cautious\)/u);
  assert.match(saveBar, /edit-save-status/u);
  assert.match(saveBar, /edit-history-button/u);

  assert.match(app, /import SaveBar from "\.\/SaveBar\.svelte"/u);
  assert.match(app, /createPersistenceController/u);
  assert.doesNotMatch(app, /fetch\(|localStorage/u);
  assert.doesNotMatch(
    app,
    /edit-save-button|edit-discard-button|edit-mode-button/u,
    "the Checklist must not copy the shared save controls",
  );

  // Browser storage stops at the adapter; the controller stays DOM-free.
  assert.doesNotMatch(controller, /document\.|window\./u);
  assert.match(bridge, /failure\.code = response\.error\?\.code/u);
});
