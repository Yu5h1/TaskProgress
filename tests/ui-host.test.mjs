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

function recordingAdapter(id = "recording", regions = ["task-list"]) {
  const calls = [];
  return {
    calls,
    adapter: {
      id,
      regions,
      mount(region, target, props) {
        calls.push(["mount", region, target, props]);
        return { region, target, props };
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
  assert.throws(
    () => registerUiAdapter({ id: "regionless", mount() {}, update() {}, destroy() {} }),
    /regions/,
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
  const view = createUiView("task-list", target, { tasks: [1] });
  assert.equal(view.adapterId, "svelte");
  assert.equal(view.region, "task-list");

  view.update({ tasks: [1, 2] });
  view.destroy();
  view.destroy(); // idempotent

  assert.deepEqual(calls, [
    ["mount", "task-list", target, { tasks: [1] }],
    ["update", { tasks: [1, 2] }],
    ["destroy", target],
  ]);
  assert.equal(view.destroyed, true);
  assert.throws(() => view.update({}), /已銷毀/);
});

test("the host refuses to render without an implementation or a target", () => {
  resetUiAdapters();
  assert.throws(() => createUiView("task-list", {}, {}), /尚未註冊/);
  registerUiAdapter(recordingAdapter().adapter);
  assert.throws(() => createUiView("task-list", null, {}), /掛載目標/);
  // A region the implementation does not claim must fail loudly, not render
  // nothing.
  assert.throws(() => createUiView("unknown-region", {}, {}), /不支援 region/);
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

// The docs Pages artifact copies `viewer/index.html` and `viewer/assets/`. A
// bundle in a subdirectory only survives if that copy is recursive, which this
// repository cannot verify, and a missing bundle takes the whole report down
// rather than degrading it — createUiView throws, and showFatal replaces the
// page. Keep the bundle flat.
test("the preview bundle ships flat inside viewer/assets", async () => {
  const [html, config, bundle] = await Promise.all([
    readFile(new URL("../viewer/index.html", import.meta.url), "utf8"),
    readFile(
      new URL("../experiments/editor-svelte-spike/vite.viewer-ui.config.js", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../viewer/assets/viewer-ui.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /src="assets\/viewer-ui\.js"/);
  assert.doesNotMatch(html, /assets\/[a-z-]+\/viewer-ui\.js/);
  assert.match(config, /outDir: fileURLToPath\(new URL\("\.\.\/\.\.\/viewer\/assets"/);
  // True would delete every hand-written source in viewer/assets.
  assert.match(config, /emptyOutDir: false/);
  // The host stays external and resolves as a sibling, not a parent.
  assert.match(bundle, /from "\.\/ui-host\.js"/);

  // Registration must run before app.js asks for a view.
  const bundleIndex = html.indexOf("assets/viewer-ui.js");
  const appIndex = html.indexOf("assets/app.js");
  assert.ok(bundleIndex >= 0 && appIndex > bundleIndex);
});

test("the Svelte adapter implements the contract and keeps framework detail inside", async () => {
  const source = await readFile(
    new URL("../experiments/editor-svelte-spike/src/viewer-adapter.svelte.js", import.meta.url),
    "utf8",
  );
  assert.match(source, /id:\s*"svelte"/);
  assert.match(source, /regions: Object\.keys\(components\)/);
  // Every preview region the Viewer mounts must be declared here.
  for (const region of [
    "task-list", "status-overview", "status-filters", "project-progress",
    "mode-toggle", "save-bar", "add-control", "diagnostics", "scope-directory",
    "theme-control", "time-summary-button", "time-dialog",
    "time-settings", "delivery-risk-preview", "delivery-save-confirmation",
  ]) {
    assert.match(source, new RegExp(`"${region}":`, "u"));
  }
  assert.match(source, /mount\(region, target, props\)/);
  assert.match(source, /update\(instance, props\)/);
  assert.match(source, /destroy\(instance\)/);
  assert.match(source, /from "svelte"/);

  // Registration happens in the preview entry, not in the host.
  const entry = await readFile(
    new URL("../experiments/editor-svelte-spike/src/viewer-ui.js", import.meta.url),
    "utf8",
  );
  assert.match(entry, /registerUiAdapter\(svelteViewerAdapter\)/);

  const host = await readFile(new URL("../viewer/assets/ui-host.js", import.meta.url), "utf8");
  assert.doesNotMatch(host, /svelte/i);
});
