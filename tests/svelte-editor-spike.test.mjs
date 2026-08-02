import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  loadSvelteEditorData,
  resolveSvelteDataRequest,
} from "../experiments/editor-svelte-spike/src/data-loader.js";
import { createSvelteEditorAdapter } from "../experiments/editor-svelte-spike/src/editor-adapter.js";
import { fixtureReport } from "../experiments/editor-svelte-spike/src/fixture.js";

const exampleReport = JSON.parse(await readFile(
  new URL("../reports/example/report.json", import.meta.url),
  "utf8",
));
const exampleTimeAnalysis = JSON.parse(await readFile(
  new URL("../reports/example/time.analysis.json", import.meta.url),
  "utf8",
));

function jsonResponse(value, status = 200) {
  return {
    status,
    ok: status >= 200 && status < 300,
    async json() {
      return structuredClone(value);
    },
  };
}

function createFetch(routes) {
  return async (url) => routes.get(String(url)) ?? jsonResponse(null, 404);
}

test("Svelte adapter delegates mutations and history to the shared Editor Core", () => {
  const adapter = createSvelteEditorAdapter(fixtureReport);
  const baseline = adapter.snapshot();

  const changed = adapter.dispatch({
    type: "set-task-field",
    taskId: "editor-framework-spike",
    field: "summary",
    value: "Svelte view-model draft",
  });

  assert.equal(changed.dirty, true);
  assert.equal(changed.history.canUndo, true);
  assert.equal(changed.report.tasks[0].summary, "Svelte view-model draft");
  assert.notStrictEqual(changed.report, baseline.report);
  assert.equal(fixtureReport.tasks[0].summary.includes("正式 Editor Core"), true);

  const undone = adapter.undo();
  assert.equal(undone.report.tasks[0].summary, baseline.report.tasks[0].summary);
  assert.equal(undone.history.canRedo, true);

  const redone = adapter.redo();
  assert.equal(redone.report.tasks[0].summary, "Svelte view-model draft");
  assert.equal(redone.history.canRedo, false);
});

test("Svelte adapter validates and adds pending items through stable-ID commands", () => {
  const adapter = createSvelteEditorAdapter(fixtureReport);
  const originalCount = adapter.snapshot().report.tasks[0].pending_items.length;

  const rejected = adapter.addPendingItem("editor-framework-spike", "✨…!!!", 2);
  assert.match(rejected.error, /文字或數字/u);
  assert.equal(rejected.snapshot.report.tasks[0].pending_items.length, originalCount);

  const accepted = adapter.addPendingItem("editor-framework-spike", "  驗證鍵盤操作  ", 1);
  const items = accepted.snapshot.report.tasks[0].pending_items;
  assert.equal(accepted.error, "");
  assert.equal(items.length, originalCount + 1);
  assert.equal(items.at(-1).title, "驗證鍵盤操作");
  assert.match(items.at(-1).id, /^item-editor-framework-spike-pending/u);
  assert.equal(accepted.snapshot.derived.progress.tasks["editor-framework-spike"].total, 4);
});

test("Svelte adapter keeps invalid saves as drafts and resets history after commit", () => {
  const adapter = createSvelteEditorAdapter(fixtureReport);
  adapter.dispatch({
    type: "set-task-field",
    taskId: "editor-framework-spike",
    field: "summary",
    value: "",
  });

  const rejected = adapter.save("2026-08-02T12:00:00+08:00");
  assert.ok(rejected.errors.length > 0);
  assert.equal(rejected.snapshot.dirty, true);
  assert.equal(rejected.snapshot.history.canUndo, true);

  adapter.dispatch({
    type: "set-task-field",
    taskId: "editor-framework-spike",
    field: "summary",
    value: "有效描述",
  });
  const saved = adapter.save("2026-08-02T12:30:00+08:00");
  assert.deepEqual(saved.errors, []);
  assert.equal(saved.snapshot.report.updated_at, "2026-08-02T12:30:00+08:00");
  assert.equal(saved.snapshot.dirty, false);
  assert.equal(saved.snapshot.history.canUndo, false);
});

test("Svelte adapter applies the shared meaningful-text rule before commit", () => {
  const adapter = createSvelteEditorAdapter(fixtureReport);
  adapter.dispatch({
    type: "set-item-field",
    taskId: "editor-framework-spike",
    field: "pending_items",
    itemId: "svelte-parity",
    property: "title",
    value: "✨…!!!",
  });

  const rejected = adapter.save("2026-08-02T12:45:00+08:00");
  assert.equal(rejected.snapshot.dirty, true);
  assert.equal(rejected.errors.some((error) => (
    error.path === "tasks[0].pending_items[0].title"
  )), true);
});

test("Svelte data request keeps Viewer query precedence and resolves experiment scope paths", () => {
  const baseUrl = "https://example.test/experiments/editor-svelte-spike/";
  const scoped = resolveSvelteDataRequest(new URLSearchParams("scope=example"), baseUrl);
  assert.equal(scoped.reportUrl.href, "https://example.test/reports/example/report.json");
  assert.equal(scoped.timeUrl.href, "https://example.test/reports/example/time.analysis.json");

  const explicit = resolveSvelteDataRequest(
    new URLSearchParams("scope=ignored&report=/custom/report.json&time=none"),
    baseUrl,
  );
  assert.equal(explicit.source, "report");
  assert.equal(explicit.scope, null);
  assert.equal(explicit.reportUrl.href, "https://example.test/custom/report.json");
  assert.equal(explicit.timeUrl, null);
});

test("Svelte data loader reads and validates real report and time contracts", async () => {
  const reportUrl = "https://example.test/reports/example/report.json";
  const timeUrl = "https://example.test/reports/example/time.analysis.json";
  const loaded = await loadSvelteEditorData({
    params: new URLSearchParams("scope=example"),
    baseUrl: "https://example.test/experiments/editor-svelte-spike/",
    fetchImpl: createFetch(new Map([
      [reportUrl, jsonResponse(exampleReport)],
      [timeUrl, jsonResponse(exampleTimeAnalysis)],
    ])),
  });

  assert.equal(loaded.report.scope_id, "example");
  assert.equal(loaded.timeAnalysis.scope_id, "example");
  assert.deepEqual(loaded.diagnostics, []);
});

test("Svelte data loader treats missing or malformed time analysis as optional", async () => {
  const reportUrl = "https://example.test/reports/example/report.json";
  const timeUrl = "https://example.test/reports/example/time.analysis.json";
  const baseUrl = "https://example.test/experiments/editor-svelte-spike/";

  const missing = await loadSvelteEditorData({
    params: new URLSearchParams("scope=example"),
    baseUrl,
    fetchImpl: createFetch(new Map([[reportUrl, jsonResponse(exampleReport)]])),
  });
  assert.equal(missing.timeAnalysis, null);
  assert.deepEqual(missing.diagnostics, []);

  const malformed = await loadSvelteEditorData({
    params: new URLSearchParams("scope=example"),
    baseUrl,
    fetchImpl: createFetch(new Map([
      [reportUrl, jsonResponse(exampleReport)],
      [timeUrl, jsonResponse({ schema_version: "broken" })],
    ])),
  });
  assert.equal(malformed.timeAnalysis, null);
  assert.match(malformed.diagnostics[0].message, /time\.analysis\.json 已忽略/u);
});

test("Svelte data loader rejects invalid reports without showing fixture data", async () => {
  const reportUrl = "https://example.test/reports/example/report.json";
  const invalidReport = { ...exampleReport, tasks: "invalid" };
  await assert.rejects(
    loadSvelteEditorData({
      params: new URLSearchParams("scope=example"),
      baseUrl: "https://example.test/experiments/editor-svelte-spike/",
      fetchImpl: createFetch(new Map([[reportUrl, jsonResponse(invalidReport)]])),
    }),
    /report\.json 未通過驗證/u,
  );
});

test("Svelte spike is isolated, static-path safe, and uses the shared core", async () => {
  const [packageText, viteText, appText, cardText, rowText, adapterText, loaderText] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/vite.config.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/App.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/TaskCard.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/ItemRow.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/editor-adapter.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/data-loader.js", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageText);

  assert.ok(packageJson.devDependencies.svelte);
  assert.ok(packageJson.devDependencies.vite);
  assert.equal(packageJson.devDependencies.vue, undefined);
  assert.equal(packageJson.scripts["spike:svelte:build"].includes("vite build"), true);
  assert.match(viteText, /base:\s*"\.\/"/u);
  assert.match(appText, /createSvelteEditorAdapter/u);
  assert.match(appText, /view\.history\.canUndo/u);
  assert.match(appText, /loadSvelteEditorData/u);
  assert.match(appText, /#each tasks as task/u);
  assert.match(cardText, /<ItemRow/u);
  assert.match(cardText, /timeItems/u);
  assert.match(rowText, /type:\s*"set-item-field"/u);
  assert.match(adapterText, /viewer\/assets\/editor-core\.js/u);
  assert.match(adapterText, /normalizeMeaningfulText/u);
  assert.match(loaderText, /resolveReportRequest/u);
  assert.match(loaderText, /inspectTimeAnalysis/u);
  assert.doesNotMatch(appText + cardText + rowText, /localStorage/u);
});
