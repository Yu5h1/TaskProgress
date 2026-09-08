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
  assert.match(checklistApp, /\$: onPersistenceChange\(view\)/u);
});
