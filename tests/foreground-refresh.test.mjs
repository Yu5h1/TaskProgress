import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { loadTemplates } from "./helpers/web-ui-template.mjs";

import { installForegroundRefresh } from "../viewer/assets/foreground-refresh.js";

class FakeEventTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatch(type) {
    for (const listener of this.listeners.get(type) ?? []) listener({ type });
  }
}

function fixture({ safe = true } = {}) {
  const windowTarget = new FakeEventTarget();
  const documentTarget = new FakeEventTarget();
  documentTarget.visibilityState = "visible";
  const scheduled = [];
  let reloads = 0;
  let canRefresh = safe;
  const dispose = installForegroundRefresh({
    windowTarget,
    documentTarget,
    canRefresh: () => canRefresh,
    reload: () => {
      reloads += 1;
    },
    schedule: (callback) => scheduled.push(callback),
  });
  return {
    windowTarget,
    documentTarget,
    dispose,
    reloads: () => reloads,
    setSafe: (next) => {
      canRefresh = next;
    },
    flush: () => {
      while (scheduled.length) scheduled.shift()();
    },
  };
}

test("foreground refresh waits until the page has actually been left", () => {
  const page = fixture();
  page.windowTarget.dispatch("focus");
  page.flush();
  assert.equal(page.reloads(), 0);

  page.windowTarget.dispatch("blur");
  page.windowTarget.dispatch("focus");
  page.flush();
  assert.equal(page.reloads(), 1);
});

test("focus and visibility return events coalesce into one reload", () => {
  const page = fixture();
  page.documentTarget.visibilityState = "hidden";
  page.documentTarget.dispatch("visibilitychange");
  page.windowTarget.dispatch("blur");
  page.documentTarget.visibilityState = "visible";
  page.documentTarget.dispatch("visibilitychange");
  page.windowTarget.dispatch("focus");
  page.flush();
  assert.equal(page.reloads(), 1);
});

test("unsafe state requires another leave before a safe return can reload", () => {
  const page = fixture({ safe: false });
  page.windowTarget.dispatch("blur");
  page.windowTarget.dispatch("focus");
  page.flush();
  assert.equal(page.reloads(), 0);

  page.setSafe(true);
  page.windowTarget.dispatch("focus");
  page.flush();
  assert.equal(page.reloads(), 0, "the same return cycle must not retry after becoming safe");

  page.windowTarget.dispatch("blur");
  page.windowTarget.dispatch("focus");
  page.flush();
  assert.equal(page.reloads(), 1);
});

test("disposing the lifecycle prevents an already scheduled reload", () => {
  const page = fixture();
  page.windowTarget.dispatch("blur");
  page.windowTarget.dispatch("focus");
  page.dispose();
  page.flush();
  assert.equal(page.reloads(), 0);
});

test("Report and Checklist Browser wire the shared lifecycle at host boundaries", async () => {
  const [report, checklist] = await Promise.all([
    readFile(new URL('../viewer/assets/app.js', import.meta.url), 'utf8'),
    readFile(new URL('../ui/web-workflow/checklist.mjs', import.meta.url), 'utf8'),
  ]);
  assert.match(report, /installForegroundRefresh/u);
  for (const guard of ['dirty', 'saving', 'pending', 'previewing', 'timeSettingsPending', 'confirmingDeliverySave']) {
    assert.match(report, new RegExp(`!state\\.editor(?:\\.persistenceView\\?)?\\.${guard}`, 'u'));
  }
  assert.match(checklist, /installForegroundRefresh\(\{ canRefresh: \(\) => this\.canRefresh\(\)/u);
  for (const guard of ['dirty', 'saving', 'pending']) assert.ok(checklist.includes(`!this.data.${guard}`));
  assert.ok(checklist.includes('!this.resetOpen && !this.resetBusy'));
});

test("sequential leave and return cycles continue to refresh", () => {
  const page = fixture();
  for (let i = 1; i <= 3; i++) {
    page.windowTarget.dispatch("blur");
    page.windowTarget.dispatch("focus");
    page.flush();
    assert.equal(page.reloads(), i, `cycle ${i} triggers reload`);
  }
});

test("async reload prevents concurrent execution and restores refreshing state in finally", async () => {
  const windowTarget = new FakeEventTarget();
  const documentTarget = new FakeEventTarget();
  documentTarget.visibilityState = "visible";
  const scheduled = [];
  let reloads = 0;
  let resolveReload = null;

  installForegroundRefresh({
    windowTarget,
    documentTarget,
    reload: () => {
      reloads += 1;
      return new Promise((resolve) => {
        resolveReload = resolve;
      });
    },
    schedule: (cb) => scheduled.push(cb),
  });

  windowTarget.dispatch("blur");
  windowTarget.dispatch("focus");
  while (scheduled.length) scheduled.shift()();
  assert.equal(reloads, 1);

  windowTarget.dispatch("focus");
  while (scheduled.length) scheduled.shift()();
  assert.equal(reloads, 1, "in-flight reload guards against concurrent start");

  resolveReload();
  await Promise.resolve();
  await Promise.resolve();

  windowTarget.dispatch("blur");
  windowTarget.dispatch("focus");
  while (scheduled.length) scheduled.shift()();
  assert.equal(reloads, 2, "restores refreshing state in finally");
  resolveReload();
});

test("async reload rejection restores refreshing state in finally so subsequent cycle can retry", async () => {
  const windowTarget = new FakeEventTarget();
  const documentTarget = new FakeEventTarget();
  documentTarget.visibilityState = "visible";
  const scheduled = [];
  let reloads = 0;
  let shouldFail = true;

  installForegroundRefresh({
    windowTarget,
    documentTarget,
    reload: () => {
      reloads += 1;
      if (shouldFail) {
        return Promise.reject(new Error("network failure"));
      }
      return Promise.resolve();
    },
    schedule: (cb) => scheduled.push(cb),
  });

  windowTarget.dispatch("blur");
  windowTarget.dispatch("focus");
  while (scheduled.length) scheduled.shift()();
  assert.equal(reloads, 1);
  await Promise.resolve();
  await Promise.resolve();

  shouldFail = false;
  windowTarget.dispatch("blur");
  windowTarget.dispatch("focus");
  while (scheduled.length) scheduled.shift()();
  assert.equal(reloads, 2, "failure in cycle 1 allows retry in cycle 2");
});

test("Checklist refresh guards against in-flight draft creation and state changes", async () => {
  const source = await readFile(new URL('../ui/web-workflow/checklist.mjs', import.meta.url), 'utf8');
  assert.match(source, /const initial = this\.persistence, revision = this\.data\.document\.revision/u);
  assert.match(source, /!this\.canRefresh\(\) \|\| this\.persistence !== initial \|\| this\.data\.document\.revision !== revision/u);
});

test("Checklist late refresh preserves a draft, replaced session, or changed revision", async () => {
  const { Checklist } = await loadTemplates('checklist');
  for (const interfere of [
    app => { app.data.dirty = true; },
    app => { app.data.saving = true; },
    app => { app.data.pending = true; },
    app => { app.resetOpen = true; },
    app => { app.resetBusy = true; },
    app => { app.disposed = true; },
    app => { app.persistence = {}; },
    app => { app.data.document.revision = 'local-new'; },
  ]) {
    let resolveLoad, installed = false;
    const app = Object.assign(Object.create(Checklist.prototype), {
      data: { document: { revision: 'baseline' } }, persistence: {},
      transport: { load: () => new Promise(resolve => { resolveLoad = resolve; }) },
      install() { installed = true; }, draw() {},
    });
    const pending = app.refreshSource();
    interfere(app);
    resolveLoad({ revision: 'remote-new' });
    await pending;
    assert.equal(installed, false, interfere.toString());
  }
});

test("Checklist clean refresh installs a new revision and preserves cautious mode", async () => {
  const { Checklist } = await loadTemplates('checklist');
  for (const revision of ['baseline', 'remote-new']) {
    const events = [];
    const app = Object.assign(Object.create(Checklist.prototype), {
      data: { document: { revision: 'baseline' }, cautious: true },
      persistence: { async setCautious(value) { events.push(value); } },
      transport: { load: async () => ({ revision }) },
      install(document) { events.push(document.revision); },
      draw() {},
    });
    await app.refreshSource();
    assert.deepEqual(events, revision === 'baseline' ? [] : ['remote-new', true]);
  }
});


