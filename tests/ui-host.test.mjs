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
test("the product adapter registers before the host starts creating views", async () => {
  const entry = await readFile(new URL('../ui/web-workflow/viewer-entry.mjs', import.meta.url), 'utf8');
  assert.ok(entry.indexOf("import './viewer.mjs'") < entry.indexOf("await import('@taskprogress/app.js')"));
  const html = await readFile(new URL('../viewer/index.html', import.meta.url), 'utf8');
  assert.match(html, /demo\.js/u);
  assert.doesNotMatch(html, /viewer-ui\.js/u);
});

test("the product adapter implements the narrow host contract", async () => {
  const source = await readFile(new URL('../ui/web-workflow/viewer.mjs', import.meta.url), 'utf8');
  assert.match(source, /id: 'yu5h1-web-ui-workflow'/u);
  assert.match(source, /regions: Object\.keys\(templates\)/u);
  for (const region of ['task-list', 'status-overview', 'status-filters', 'project-progress', 'mode-toggle', 'save-bar', 'add-control', 'diagnostics', 'scope-directory', 'theme-control', 'time-summary-button', 'time-dialog', 'cost-dialog', 'report-summary', 'delivery-save-confirmation']) assert.ok(source.includes(`'${region}':`));
  assert.match(source, /mount\(region, target, props\)/u);
  assert.match(source, /update\(instance, props\)/u);
  assert.match(source, /destroy\(instance\)/u);
  assert.match(source, /registerUiAdapter\(webViewerAdapter\)/u);
  const host = await readFile(new URL('../viewer/assets/ui-host.js', import.meta.url), 'utf8');
  assert.doesNotMatch(host, /from ['"]lit|@web\/ui/u);
});
