import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  activeUiAdapter,
  createUiView,
  registerUiAdapter,
  registeredUiAdapters,
  resetUiAdapters,
  useUiAdapter,
} from "../viewer/assets/ui-host.js";

function recordingAdapter(id = "recording") {
  const calls = [];
  return {
    calls,
    adapter: {
      id,
      mount(target, props) {
        calls.push(["mount", target, props]);
        return { target, props };
      },
      update(instance, props) {
        calls.push(["update", props]);
        return { ...instance, props };
      },
      destroy(instance) {
        calls.push(["destroy", instance.target]);
      },
    },
  };
}

test("the host rejects adapters that do not satisfy the contract", () => {
  resetUiAdapters();
  assert.throws(() => registerUiAdapter(null), /物件/);
  assert.throws(() => registerUiAdapter({ mount() {}, update() {}, destroy() {} }), /id/);
  assert.throws(
    () => registerUiAdapter({ id: "partial", mount() {}, update() {} }),
    /destroy/,
  );
  assert.deepEqual(registeredUiAdapters(), []);
});

test("exactly one implementation is active at a time", () => {
  resetUiAdapters();
  const first = recordingAdapter("first");
  const second = recordingAdapter("second");
  registerUiAdapter(first.adapter);
  registerUiAdapter(second.adapter);

  // Registering a second implementation must not silently take over: two live
  // implementations of one screen is the drift this boundary exists to end.
  assert.equal(activeUiAdapter().id, "first");
  assert.deepEqual(registeredUiAdapters(), ["first", "second"]);

  useUiAdapter("second");
  assert.equal(activeUiAdapter().id, "second");
  assert.throws(() => useUiAdapter("missing"), /尚未註冊/);
});

test("a view delegates mount, update and destroy to the active adapter", () => {
  resetUiAdapters();
  const { adapter, calls } = recordingAdapter("svelte");
  registerUiAdapter(adapter);

  const target = { id: "task-list" };
  const view = createUiView(target, { tasks: [1] });
  assert.equal(view.adapterId, "svelte");

  view.update({ tasks: [1, 2] });
  view.destroy();
  view.destroy(); // idempotent

  assert.deepEqual(calls, [
    ["mount", target, { tasks: [1] }],
    ["update", { tasks: [1, 2] }],
    ["destroy", target],
  ]);
  assert.equal(view.destroyed, true);
  assert.throws(() => view.update({}), /已銷毀/);
});

test("the host refuses to render without an implementation or a target", () => {
  resetUiAdapters();
  assert.throws(() => createUiView({}, {}), /尚未註冊/);
  registerUiAdapter(recordingAdapter().adapter);
  assert.throws(() => createUiView(null, {}), /掛載目標/);
});

test("the contract stays narrow: data in, callbacks out, no DOM crossing back", async () => {
  const source = await readFile(new URL("../viewer/assets/ui-host.js", import.meta.url), "utf8");
  // The host must not reach into a rendered view; that is what makes an
  // implementation replaceable.
  assert.doesNotMatch(source, /document\./);
  assert.doesNotMatch(source, /querySelector|innerHTML|appendChild|createElement/);
  assert.match(source, /mount/);
  assert.match(source, /update/);
  assert.match(source, /destroy/);
});

test("the Svelte adapter implements the contract and keeps framework detail inside", async () => {
  const source = await readFile(
    new URL("../experiments/editor-svelte-spike/src/task-list-adapter.svelte.js", import.meta.url),
    "utf8",
  );
  assert.match(source, /id:\s*"svelte"/);
  assert.match(source, /mount\(target, props\)/);
  assert.match(source, /update\(instance, props\)/);
  assert.match(source, /destroy\(instance\)/);
  assert.match(source, /from "svelte"/);

  // Registration happens in the preview entry, not in the host.
  const entry = await readFile(
    new URL("../experiments/editor-svelte-spike/src/viewer-ui.js", import.meta.url),
    "utf8",
  );
  assert.match(entry, /registerUiAdapter\(svelteTaskListAdapter\)/);

  const host = await readFile(new URL("../viewer/assets/ui-host.js", import.meta.url), "utf8");
  assert.doesNotMatch(host, /svelte/i);
});
