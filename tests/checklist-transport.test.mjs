// The Checklist screen takes its transport from the host. Only the desktop
// entry knows about WebView2, and the screen works over any substitute.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createPersistenceController } from "../viewer/assets/persistence-mode.js";
import { createChecklistEditorSession } from "../viewer/assets/checklist-editor.js";
import { createChecklistBridgeTransport } from "../viewer/assets/checklist-bridge.js";

const read = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

const app = await read("ui/web-workflow/checklist.mjs");
const entry = await read("viewer/assets/document-transport.js");

test("the screen resolves no global WebView object", async () => {
  assert.match(app, /this\.transport=options\.transport \?\? transport/u);
  assert.match(app, /await this\.transport\.load\(\)/u);
  assert.match(app, /await this\.transport\.save\(payload\)/u);
  assert.doesNotMatch(app, /chrome|webview|createChecklistBridgeTransport/iu);
});

test("the transport boundary chooses desktop or browser without a second screen", async () => {
  assert.match(entry, /createChecklistBridgeTransport/u);
  assert.match(entry, /createChecklistHttpTransport/u);
  assert.match(app, /createDocumentTransport\('checklist', \{ params \}\)/u);
});

test("assets opened outside WebView2 still report the reason", async () => {
  assert.match(app, /catch \(error\)/u);
  assert.match(app, /load: \(\) => Promise\.reject\(error\)/u);
  assert.throws(() => createChecklistBridgeTransport(undefined), /Desktop Host/u);
});

test("a substitute transport drives the same screen contract", async () => {
  // What the screen does with the transport, without a browser: load once,
  // then save through the shared persistence controller.
  const document = {
    fileName: "task-a.checklist",
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

test("desktop reset forwards exact targets and returns bridge snapshot without retry", async () => {
  const sent = [];
  let receive;
  const bridge = createChecklistBridgeTransport({
    addEventListener: (_, listener) => { receive = listener; },
    postMessage: message => sent.push(message),
  });
  const payload = { targets: [{ workItemId: 1, checkIndex: 2 }] };
  const result = bridge.reset(payload);
  assert.equal(sent[0].type, "reset");
  assert.deepEqual(sent[0].payload, payload);
  receive({ data: { version: 1, id: sent[0].id, type: "result", payload: { revision: "reset" } } });
  assert.deepEqual(await result, { revision: "reset" });
  const rejected = bridge.reset({ targets: [] });
  receive({ data: { version: 1, id: sent[1].id, type: "error", error: { code: "conflict", message: "changed" } } });
  await assert.rejects(rejected, { code: "conflict" });
  assert.equal(sent.length, 2);
});
