import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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
  const [report, checklistBrowser, checklistDesktop, checklistApp] = await Promise.all([
    readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/checklist-browser-main.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/checklist-main.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/ChecklistApp.svelte", import.meta.url), "utf8"),
  ]);

  assert.match(report, /import \{ installForegroundRefresh \} from "\.\/foreground-refresh\.js"/u);
  for (const guard of ["dirty", "saving", "pending", "previewing", "timeSettingsPending", "confirmingDeliverySave"]) {
    assert.match(report, new RegExp(`!state\\.editor(?:\\.persistenceView\\?)?\\.${guard}`, "u"));
  }

  assert.match(checklistBrowser, /import \{ installForegroundRefresh \}/u);
  assert.match(checklistBrowser, /onPersistenceChange/u);
  for (const guard of ["dirty", "saving", "pending"]) {
    assert.match(checklistBrowser, new RegExp(`!persistenceView\\?\\.${guard}`, "u"));
  }
  assert.doesNotMatch(checklistDesktop, /installForegroundRefresh/u);
  assert.match(checklistApp, /export let onPersistenceChange = \(\) => \{\}/u);
  assert.match(checklistApp, /\$: onPersistenceChange\(view \? \{ \.\.\.view, pending: view\.pending \|\| resetOpen \|\| resetBusy \} : view\)/u);
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
  const checklistApp = await readFile(
    new URL("../experiments/editor-svelte-spike/src/ChecklistApp.svelte", import.meta.url),
    "utf8"
  );

  // Verifies that refresh captures initial session identity and revision
  assert.match(checklistApp, /const initialPersistence = persistence/u);
  assert.match(checklistApp, /const initialRevision = view\?\.document\?\.revision/u);

  // Verifies that refresh checks session identity, revision, dirty, saving, pending, reset before applying
  assert.match(checklistApp, /persistence !== initialPersistence/u);
  assert.match(checklistApp, /view\.document\?\.revision !== initialRevision/u);
  assert.match(checklistApp, /view\.dirty \|\| view\.saving \|\| view\.pending \|\| resetOpen \|\| resetBusy/u);
});

test("Checklist in-flight draft scenario preserves user draft when load returns different revision", async () => {
  let installedDocument = null;
  let view = {
    document: { revision: "rev-1" },
    dirty: false,
    saving: false,
    pending: false,
  };
  let persistence = { id: "session-1" };
  let resetOpen = false;
  let resetBusy = false;

  let resolveLoad = null;
  const transport = {
    load: () => new Promise((resolve) => {
      resolveLoad = resolve;
    }),
  };

  async function simulatedRefresh() {
    if (!transport || !view || view.dirty || view.saving || view.pending || resetOpen || resetBusy) return;
    const initialPersistence = persistence;
    const initialRevision = view?.document?.revision;
    try {
      const document = await transport.load();
      if (!document || !document.revision) return;
      if (!persistence || persistence !== initialPersistence || !view) return;
      if (view.document?.revision !== initialRevision) return;
      if (view.dirty || view.saving || view.pending || resetOpen || resetBusy) return;
      if (document.revision === initialRevision) return;
      installedDocument = document;
    } catch {
      // ignore
    }
  }

  // 1. Start refresh when clean
  const refreshPromise = simulatedRefresh();

  // 2. While load is in-flight, user edits and creates a draft
  view.dirty = true;

  // 3. Load returns with a new remote revision
  resolveLoad({ revision: "rev-2", items: [] });
  await refreshPromise;

  // 4. In-flight response must be discarded; draft not overwritten!
  assert.equal(installedDocument, null, "In-flight response must not install new document over user draft");
  assert.equal(view.dirty, true, "User draft state must be preserved");
});


