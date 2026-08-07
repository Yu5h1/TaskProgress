import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import "../viewer/assets/priority-policy.js";
import "../viewer/assets/editor-surface-runtime.js";

const priorityPolicy = globalThis.TaskProgressPriorityPolicy;
const surfaceRuntime = globalThis.TaskProgressEditorSurfaceRuntime;

// Minimal DOM stub: the Editor Surface is framework-neutral, so it must build
// task cards without a browser. Only the node API the surface actually uses is
// implemented, which keeps the shared contract explicit.
function createDocumentStub() {
  function createElement(tag) {
    const node = {
      tagName: tag,
      listeners: {},
      addEventListener(type, handler) {
        (this.listeners[type] ??= []).push(handler);
      },
      removeEventListener(type, handler) {
        this.listeners[type] = (this.listeners[type] ?? []).filter((existing) => existing !== handler);
      },
      dispatch(type, event = {}) {
        const stableEvent = {
          key: undefined,
          preventDefault() {},
          ...event,
        };
        (this.listeners[type] ?? []).forEach((handler) => handler(stableEvent));
      },
    };
    return node;
  }
  return { createElement };
}

const PRODUCTION_STATUS_META = {
  planned: { label: "待處理", tone: "neutral" },
  in_progress: { label: "進行中", tone: "active" },
  blocked: { label: "受阻", tone: "danger" },
  done: { label: "已完成", tone: "success" },
  archive: { label: "已封存", tone: "muted" },
};

test("editor surface rejects hosts without a document, priority policy, or status metadata", () => {
  assert.throws(
    () => surfaceRuntime.createEditorSurface({ priorityPolicy, statusMeta: {} }),
    /document/,
  );
  assert.throws(
    () => surfaceRuntime.createEditorSurface({
      document: createDocumentStub(),
      statusMeta: {},
    }),
    /priority policy/,
  );
  assert.throws(
    () => surfaceRuntime.createEditorSurface({
      document: createDocumentStub(),
      priorityPolicy,
    }),
    /status metadata/,
  );
});

test("shared history shortcuts handle platform undo and redo only while active", () => {
  const document = createDocumentStub();
  const surface = surfaceRuntime.createEditorSurface({
    document,
    priorityPolicy,
    statusMeta: PRODUCTION_STATUS_META,
  });
  const target = document.createElement("div");
  let active = true;
  let undos = 0;
  let redos = 0;
  let prevented = 0;
  surface.bindHistoryShortcuts(target, {
    isActive: () => active,
    onUndo: () => { undos += 1; return true; },
    onRedo: () => { redos += 1; return true; },
  });

  const event = (key, extra = {}) => ({
    key,
    ctrlKey: true,
    preventDefault: () => { prevented += 1; },
    ...extra,
  });
  target.dispatch("keydown", event("z"));
  target.dispatch("keydown", event("z", { shiftKey: true }));
  target.dispatch("keydown", event("y"));
  active = false;
  target.dispatch("keydown", event("z"));

  assert.equal(undos, 1);
  assert.equal(redos, 2);
  assert.equal(prevented, 3);
});

// ItemRow's single-order contract now lives entirely in ItemRow.svelte's own
// template — editor-surface-runtime.js no longer renders rows at all, so
// there is nothing left here to configure per host. This guards against the
// knob (`itemEditOrder`) that used to let two hosts drift into different
// sequences from ever coming back.
test("item order is not host-configurable anywhere in the shared surface, the Viewer, or the retired Demo", async () => {
  const [runtime, itemRow, viewerApp, demoApp] = await Promise.all([
    readFile(new URL("../viewer/assets/editor-surface-runtime.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/ItemRow.svelte", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/time-reference/demo/app.js", import.meta.url), "utf8"),
  ]);
  [runtime, itemRow, viewerApp, demoApp].forEach((source) => {
    assert.doesNotMatch(source, /itemEditOrder/);
  });
});
