// The Checklist screen takes its transport from the host. Only the desktop
// entry knows about WebView2, and the screen works over any substitute.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createPersistenceController } from "../viewer/assets/persistence-mode.js";
import { createChecklistEditorSession } from "../viewer/assets/checklist-editor.js";
import { createChecklistBridgeTransport } from "../experiments/editor-svelte-spike/src/checklist-bridge.js";

const read = (path) =>
  readFile(new URL(`../experiments/editor-svelte-spike/src/${path}`, import.meta.url), "utf8");

const app = await read("ChecklistApp.svelte");
const entry = await read("checklist-main.js");

test("the screen resolves no global WebView object", () => {
  assert.match(app, /export let transport = null;/u);
  assert.match(app, /await transport\.load\(\)/u);
  assert.match(app, /save: transport\.save/u);
  // Code only: the comment naming the seam may say "WebView", the code may not
  // reach for one.
  const code = app.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/\/\/.*$/gmu, "");
  assert.doesNotMatch(code, /chrome|webview|createChecklistBridgeTransport/iu);
});

test("the desktop entry is the one place that knows about WebView2", () => {
  assert.match(entry, /import \{ createChecklistBridgeTransport \}/u);
  assert.match(entry, /props: \{ transport: resolveTransport\(\) \}/u);
});

test("assets opened outside WebView2 still report the reason", async () => {
  // Resolving the bridge throws there, and the screen's load-failure path is
  // what tells the reader why; a transport that rejects keeps that behaviour.
  assert.match(entry, /catch \(error\)/u);
  assert.match(entry, /const reject = \(\) => Promise\.reject\(error\)/u);

  assert.throws(() => createChecklistBridgeTransport(undefined), /Desktop Host/u);
});

test("a substitute transport drives the same screen contract", async () => {
  // What the screen does with the transport, without a browser: load once,
  // then save through the shared persistence controller.
  const document = {
    fileName: "implementation-checklist.md",
    revision: "abc",
    roundIdentity: "plan.md#round",
    items: [{
      id: 1,
      title: "Verify",
      dependsOn: [],
      outcome: "",
      checks: [{
        index: 0,
        status: "pending",
        title: "Manual check",
        isManual: true,
        action: "Look.",
        expect: "It works.",
        reason: "Needs eyes.",
        observed: null,
        resolved: null,
      }],
    }],
  };
  const saved = [];
  const transport = {
    load: async () => structuredClone(document),
    save: async (payload) => {
      saved.push(payload);
      const next = structuredClone(document);
      next.revision = "def";
      next.items[0].checks[0].status = "passed";
      return next;
    },
  };

  const loaded = await transport.load();
  const controller = createPersistenceController({
    session: createChecklistEditorSession(loaded),
    save: transport.save,
    storage: null,
    debounceCommand: (command) => command.type === "set-observed",
  });

  await controller.dispatch({ type: "cycle-result", workItemId: 1, checkIndex: 0 });
  assert.deepEqual(saved, [{
    revision: "abc",
    results: [{ workItemId: 1, checkIndex: 0, status: "passed", observed: null }],
  }]);

  const view = controller.snapshot();
  assert.equal(view.status, "saved");
  assert.equal(view.document.revision, "def");
  assert.equal(view.summary.checks.passed, 1, "the summary follows the saved document");
});
