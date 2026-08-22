import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createChecklistEditorSession } from "../viewer/assets/checklist-editor.js";
import { createEditorTransaction } from "../viewer/assets/editor-transaction.js";
import { createChecklistBridgeTransport } from "../experiments/editor-svelte-spike/src/checklist-bridge.js";

function documentFixture() {
  return {
    fileName: "task-a.checklist",
    revision: "abc",
    roundIdentity: "plan.md#round",
    items: [{
      id: 1,
      status: "pending",
      title: "Build UI",
      dependsOn: [],
      outcome: "The UI works.",
      checks: [
        {
          index: 0,
          status: "passed",
          title: "Agent check",
          isManual: false,
          action: "Run tests.",
          expect: "They pass.",
          reason: null,
          observed: null,
          resolved: null,
        },
        {
          index: 1,
          status: "pending",
          title: "Manual check",
          isManual: true,
          action: "Open the app.",
          expect: "It is usable.",
          reason: "Requires UX judgment.",
          observed: null,
          resolved: null,
        },
      ],
    }],
  };
}

test("shared editor transaction owns draft history, discard, and commit", () => {
  const transaction = createEditorTransaction({ value: 1 });
  transaction.apply(
    { type: "set", value: 2 },
    (draft, command) => ({ ...draft, value: command.value }),
  );
  assert.equal(transaction.draft.value, 2);
  assert.equal(transaction.history.canUndo, true);
  transaction.undo();
  assert.equal(transaction.draft.value, 1);
  transaction.redo();
  assert.equal(transaction.draft.value, 2);
  transaction.discard();
  assert.equal(transaction.dirty, false);
  transaction.commit({ value: 3 });
  assert.equal(transaction.draft.value, 3);
});

test("Checklist session edits manual checks only", () => {
  const session = createChecklistEditorSession(documentFixture());
  assert.throws(() => session.dispatch({
    type: "set-result",
    workItemId: 1,
    checkIndex: 0,
    status: "failed",
  }), /Agent check/u);

  let view = session.dispatch({
    type: "set-result",
    workItemId: 1,
    checkIndex: 1,
    status: "failed",
  });
  assert.equal(view.document.items[0].status, "failed");
  assert.equal(session.prepareSave().errors[0].code, "observed_required");

  view = session.dispatch({
    type: "set-observed",
    workItemId: 1,
    checkIndex: 1,
    value: "Button stayed disabled.",
  });
  assert.equal(view.dirty, true);
  assert.deepEqual(session.prepareSave(), {
    revision: "abc",
    results: [{
      workItemId: 1,
      checkIndex: 1,
      status: "failed",
      observed: "Button stayed disabled.",
    }],
    errors: [],
  });
  session.undo();
  assert.equal(session.prepareSave().errors[0].code, "observed_required");
  session.discard();
  assert.equal(session.snapshot().dirty, false);
});

test("a saved manual result stays revisable through the whole marker cycle", () => {
  const session = createChecklistEditorSession(documentFixture());
  const cycle = () => session.dispatch({ type: "cycle-result", workItemId: 1, checkIndex: 1 });

  assert.equal(cycle().document.items[0].checks[1].status, "passed");
  assert.equal(cycle().document.items[0].checks[1].status, "failed");
  session.dispatch({
    type: "set-observed",
    workItemId: 1,
    checkIndex: 1,
    value: "The window did not open.",
  });

  const saved = documentFixture();
  saved.revision = "def";
  saved.items[0].status = "failed";
  saved.items[0].checks[1].status = "failed";
  saved.items[0].checks[1].observed = "The window did not open.";
  session.commit(saved);
  assert.equal(session.snapshot().dirty, false);
  assert.deepEqual(session.prepareSave().results, [], "an unchanged saved result is not resubmitted");

  // The saved failure cycles back to pending and drops the result it described.
  const view = cycle();
  const check = view.document.items[0].checks[1];
  assert.equal(check.status, "pending");
  assert.equal(check.observed, null);
  assert.equal(check.resolved, null);
  assert.equal(view.document.items[0].status, "pending", "the parent marker follows its checks");
  assert.deepEqual(session.prepareSave(), {
    revision: "def",
    results: [{ workItemId: 1, checkIndex: 1, status: "pending", observed: null }],
    errors: [],
  });

  // A new failure needs its own Observed before it can be written.
  cycle();
  cycle();
  assert.equal(session.prepareSave().errors[0].code, "observed_required");
});

test("Checklist transport exposes only load and save", async () => {
  const listeners = new Map();
  const sent = [];
  const webview = {
    addEventListener(type, listener) { listeners.set(type, listener); },
    postMessage(message) { sent.push(message); },
  };
  const transport = createChecklistBridgeTransport(webview);
  const load = transport.load();
  assert.equal(sent[0].type, "load");
  listeners.get("message")({
    data: { version: 1, id: sent[0].id, type: "result", payload: documentFixture() },
  });
  assert.equal((await load).fileName, "task-a.checklist");
  assert.deepEqual(Object.keys(transport).sort(), ["load", "save"]);
});

test("Checklist Svelte source reuses SaveBar and never requests a path", async () => {
  const [app, bridge, host] = await Promise.all([
    readFile(new URL("../experiments/editor-svelte-spike/src/ChecklistApp.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/checklist-bridge.js", import.meta.url), "utf8"),
    readFile(new URL("../src/TaskProgress.Cli/ChecklistBridge.cs", import.meta.url), "utf8"),
  ]);
  assert.match(app, /import SaveBar from "\.\/SaveBar\.svelte"/u);
  assert.match(app, /createChecklistEditorSession/u);
  assert.doesNotMatch(app, /fetch\(|localStorage/u);
  assert.match(bridge, /new Set\(\["load", "save"\]\)/u);
  assert.doesNotMatch(bridge, /path/u);
  assert.match(host, /RejectUnknown\(payload, "save payload", "revision", "results"\)/u);
});
