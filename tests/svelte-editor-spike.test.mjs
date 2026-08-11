import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  loadSvelteEditorData,
  resolveSvelteDataRequest,
} from "../experiments/editor-svelte-spike/src/data-loader.js";
import { createEditHostClient } from "../viewer/assets/edit-host-client.js";
import { createSvelteEditorAdapter } from "../experiments/editor-svelte-spike/src/editor-adapter.js";
import {
  buildDeliveryRiskPreview,
  buildTimeSettingsRiskPreview,
} from "../viewer/assets/delivery-risk-preview.js";
import { fixtureReport } from "../experiments/editor-svelte-spike/src/fixture.js";
import {
  activeEstimateIndex,
  createTimeInputDraft,
} from "../viewer/assets/time-input-draft.js";

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

  const hosted = resolveSvelteDataRequest(
    new URLSearchParams("scope=example"),
    "http://127.0.0.1:8148/__taskprogress/v1/editor/editor.html",
  );
  assert.equal(hosted.reportUrl.href, "http://127.0.0.1:8148/reports/example/report.json");
  assert.equal(hosted.timeUrl.href, "http://127.0.0.1:8148/reports/example/time.analysis.json");

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

test("time input draft edits and clears delivery without mutating its baseline", () => {
  const config = {
    scope_id: "example",
    updated_at: "2026-08-01T00:00:00Z",
    project: { executor_count: 1 },
  };
  const draft = createTimeInputDraft({ config, estimates: null }, "example");
  const missingReason = draft.setDeliveryAt("2026-08-20T17:00:00+08:00");
  assert.match(missingReason.error, /需要填寫原因/u);
  assert.equal(missingReason.snapshot.inputs.config.project.delivery_at, undefined);

  const changed = draft.setDeliveryAt(
    "2026-08-20T17:00:00+08:00",
    {
      reason: "配合里程碑調整",
      updatedAt: "2026-08-03T01:00:00Z",
    },
  );

  assert.equal(changed.error, "");
  assert.equal(config.project.delivery_at, undefined);
  assert.equal(changed.snapshot.inputs.config.project.delivery_at, "2026-08-20T17:00:00+08:00");
  assert.deepEqual(changed.snapshot.dirtyFiles, ["config"]);
  assert.deepEqual(Object.keys(draft.replacements()), ["config"]);
  assert.deepEqual(draft.changes(), [{
    field_path: "time.config.project.delivery_at",
    reason: "配合里程碑調整",
    actor: "human",
  }]);
  assert.deepEqual(draft.deliveryChangePreview(), {
    field_path: "time.config.project.delivery_at",
    reason: "配合里程碑調整",
    actor: "human",
    before: { present: false, value: null },
    after: { present: true, value: "2026-08-20T17:00:00+08:00" },
  });

  const cleared = draft.setDeliveryAt("", {
    updatedAt: "2026-08-03T02:00:00Z",
  });
  assert.equal(cleared.snapshot.inputs.config.project.delivery_at, undefined);
  assert.deepEqual(draft.changes(), []);
  assert.equal(draft.discard().inputs.config.project.delivery_at, undefined);
  assert.equal(draft.snapshot().dirty, false);
});

test("delivery risk preview compares the isolated analysis with the same draft", () => {
  const preview = buildDeliveryRiskPreview(
    {
      summary: {
        deadline: {
          urgency: "critical",
          remaining_capacity_minutes: 60,
          capacity_balance_minutes: -120,
        },
      },
    },
    {
      summary: {
        deadline: {
          urgency: "on_track",
          remaining_capacity_minutes: 300,
          capacity_balance_minutes: 120,
        },
      },
    },
    {
      reason: "配合里程碑調整",
      actor: "human",
      before: { present: true, value: "2026-08-20T17:00:00+08:00" },
      after: { present: true, value: "2026-08-25T17:00:00+08:00" },
    },
  );

  assert.equal(preview.current.label, "交付不可行");
  assert.equal(preview.next.label, "交付可行");
  assert.equal(preview.capacityDelta, 240);
  assert.equal(preview.balanceDelta, 240);
  assert.equal(preview.reason, "配合里程碑調整");

  const cleared = buildDeliveryRiskPreview(
    null,
    { summary: {} },
    {
      reason: "取消尚未核定期限",
      actor: "human",
      before: { present: true, value: "2026-08-20T17:00:00+08:00" },
      after: { present: false, value: null },
    },
  );
  assert.equal(cleared.next.label, "期限分析將停用");
});

test("time settings risk preview supports capacity-only drafts", () => {
  const preview = buildTimeSettingsRiskPreview(
    {
      summary: {
        deadline: {
          urgency: "critical",
          remaining_capacity_minutes: 120,
          capacity_balance_minutes: -60,
        },
      },
    },
    {
      summary: {
        deadline: {
          urgency: "on_track",
          remaining_capacity_minutes: 420,
          capacity_balance_minutes: 240,
        },
      },
    },
    {
      before: { present: true, value: "2026-08-20T17:00:00+08:00" },
      after: { present: true, value: "2026-08-20T17:00:00+08:00" },
      deliveryChanged: false,
      capacityChanged: true,
    },
  );

  assert.equal(preview.deliveryChanged, false);
  assert.equal(preview.capacityChanged, true);
  assert.equal(preview.capacityDelta, 300);
  assert.equal(preview.balanceDelta, 300);
  assert.equal(preview.reason, "");
});

test("time input draft creates the explicit 8/8/8 config only on request", () => {
  const template = {
    schema_version: "0.2",
    scope_id: "example",
    updated_at: "2026-08-03T03:59:00Z",
    timezone: "Asia/Taipei",
    standard_allocation: {
      total_minutes_per_day: 1440,
      sleep_minutes_per_day: 480,
      life_minutes_per_day: 480,
      other_unavailable_minutes_per_day: 0,
      capacity_minutes_per_executor_day: 480,
      working_weekdays: [1, 2, 3, 4, 5],
      workday_start_local: "09:00",
      workday_end_local: "17:00",
    },
    project: { executor_count: 1 },
    estimate_defaults: {
      unplanned_item_likely_minutes: 480,
      unplanned_item_confidence: "low",
      allow_range: true,
    },
    estimate_resolution: {
      automatic_source_order: ["historical", "ai", "default"],
      manual_resolution: "final_override",
      preserve_history: true,
    },
    execution_calibration: {
      initial_factor: 1,
      prior_equivalent_samples: 10,
      automatic_adjustment: false,
    },
    urgency_thresholds: {
      on_track_max_pressure_ratio: 1.1,
      at_risk_max_pressure_ratio: 1.5,
    },
    display: { project_day_rounding: "ceiling", item_unit: "hour" },
  };
  const draft = createTimeInputDraft(
    { config: null, estimates: null },
    "example",
    { configTemplate: template },
  );
  assert.equal(draft.snapshot().inputs.config, null);
  assert.equal(draft.snapshot().dirty, false);

  const initialized = draft.initializeConfig({ updatedAt: "2026-08-03T04:00:00Z" });
  const config = initialized.snapshot.inputs.config;

  assert.equal(initialized.error, "");
  assert.equal(config.scope_id, "example");
  assert.equal(config.timezone, "Asia/Taipei");
  assert.equal(config.standard_allocation.sleep_minutes_per_day, 480);
  assert.equal(config.standard_allocation.life_minutes_per_day, 480);
  assert.equal(config.standard_allocation.capacity_minutes_per_executor_day, 480);
  assert.equal(
    config.standard_allocation.sleep_minutes_per_day
      + config.standard_allocation.life_minutes_per_day
      + config.standard_allocation.other_unavailable_minutes_per_day
      + config.standard_allocation.capacity_minutes_per_executor_day,
    config.standard_allocation.total_minutes_per_day,
  );
  assert.deepEqual(config.standard_allocation.working_weekdays, [1, 2, 3, 4, 5]);
  assert.deepEqual(Object.keys(draft.replacements()), ["config"]);

  const delivery = draft.setDeliveryAt(
    "2026-08-30T17:00:00+08:00",
    {
      reason: "設定第一版交付界線",
      updatedAt: "2026-08-03T04:01:00Z",
    },
  );
  assert.equal(delivery.error, "");
  assert.equal(
    delivery.snapshot.inputs.config.project.delivery_at,
    "2026-08-30T17:00:00+08:00",
  );

  assert.equal(template.updated_at, "2026-08-03T03:59:00Z");
  assert.equal(template.project.delivery_at, undefined);

  const missingTemplate = createTimeInputDraft(
    { config: null, estimates: null },
    "example",
  ).initializeConfig();
  assert.match(missingTemplate.error, /未提供/u);
});

test("time input draft atomically edits allocation, weekdays, and private capacity exceptions", () => {
  const config = {
    schema_version: "0.2",
    scope_id: "example",
    updated_at: "2026-08-03T04:00:00Z",
    timezone: "Asia/Taipei",
    standard_allocation: {
      total_minutes_per_day: 1440,
      sleep_minutes_per_day: 480,
      life_minutes_per_day: 480,
      other_unavailable_minutes_per_day: 0,
      capacity_minutes_per_executor_day: 480,
      working_weekdays: [1, 2, 3, 4, 5],
      workday_start_local: "09:00",
      workday_end_local: "17:00",
    },
    project: {
      executor_count: 1,
      delivery_at: "2026-08-20T17:00:00+08:00",
      capacity_exceptions: [],
    },
  };
  const draft = createTimeInputDraft({ config, estimates: null }, "example");
  const changed = draft.setTimeSettings({
    deliveryAt: config.project.delivery_at,
    capacity: {
      sleepMinutes: 450,
      lifeMinutes: 450,
      otherUnavailableMinutes: 60,
      workingWeekdays: [1, 2, 3, 4, 6],
      capacityExceptions: [{
        date: "2026-08-12",
        availableMinutes: 0,
        reason: " 私人請假原因 ",
        publicLabel: " 不可工作 ",
      }],
    },
  }, { updatedAt: "2026-08-03T05:00:00Z" });

  assert.equal(changed.error, "");
  const replacement = draft.replacements().config;
  assert.equal(replacement.standard_allocation.capacity_minutes_per_executor_day, 480);
  assert.deepEqual(replacement.standard_allocation.working_weekdays, [1, 2, 3, 4, 6]);
  assert.equal(replacement.standard_allocation.workday_start_local, "09:00");
  assert.deepEqual(replacement.project.capacity_exceptions, [{
    date: "2026-08-12",
    available_minutes: 0,
    reason: "私人請假原因",
    public_label: "不可工作",
  }]);
  assert.deepEqual(draft.changes(), []);
  assert.deepEqual(draft.timeSettingsChangePreview(), {
    before: { present: true, value: config.project.delivery_at },
    after: { present: true, value: config.project.delivery_at },
    deliveryChanged: false,
    capacityChanged: true,
    reason: "",
    actor: "human",
  });

  const beforeInvalid = draft.snapshot();
  const invalid = draft.setTimeSettings({
    deliveryAt: config.project.delivery_at,
    capacity: {
      sleepMinutes: 720,
      lifeMinutes: 720,
      otherUnavailableMinutes: 0,
      workingWeekdays: [1],
      capacityExceptions: [],
    },
  });
  assert.match(invalid.error, /小於 24 hr/u);
  assert.deepEqual(invalid.snapshot.inputs, beforeInvalid.inputs);
});

test("time input draft versions direct human estimates and keeps the rationale", () => {
  const inputs = {
    config: null,
    estimates: {
      schema_version: "0.2",
      scope_id: "example",
      updated_at: "2026-08-01T00:00:00Z",
      estimates: [{
        estimate_id: "old-estimate",
        task_id: "editor-framework-spike",
        item_id: "svelte-parity",
        likely_minutes: 60,
        contributors: [{ kind: "system_default", summary: "預設。" }],
        human_confirmed: false,
        confidence: "low",
        estimated_at: "2026-08-01T00:00:00Z",
        active: true,
      }],
    },
  };
  const draft = createTimeInputDraft(inputs, "example");
  const changed = draft.setManualEstimate({
    taskId: "editor-framework-spike",
    itemId: "svelte-parity",
    likelyMinutes: 150,
    humanNote: "  已拆解三個步驟。 ",
    humanConfirmed: false,
    updatedAt: "2026-08-03T03:00:00Z",
  });

  assert.equal(changed.error, "");
  assert.equal(changed.estimate.supersedes_estimate_id, "old-estimate");
  assert.equal(changed.estimate.human_note, "已拆解三個步驟。");
  assert.equal(changed.estimate.human_confirmed, false);
  const replacement = draft.replacements().estimates;
  assert.equal(replacement.estimates[0].active, false);
  assert.equal(replacement.estimates[1].active, true);
  assert.equal(activeEstimateIndex({ estimates: replacement }).get("svelte-parity").likely_minutes, 150);

  const confirmed = draft.setManualEstimate({
    taskId: "editor-framework-spike",
    itemId: "svelte-parity",
    likelyMinutes: 180,
    humanNote: "已由負責人確認拆解結果。",
    humanConfirmed: true,
    updatedAt: "2026-08-03T03:30:00Z",
  });
  assert.equal(confirmed.error, "");
  assert.equal(confirmed.estimate.human_confirmed, true);
  assert.equal(confirmed.estimate.supersedes_estimate_id, changed.estimate.estimate_id);
  assert.equal(replacement.estimates[1].active, true);
  const confirmedReplacement = draft.replacements().estimates;
  assert.equal(confirmedReplacement.estimates[1].active, false);
  assert.equal(confirmedReplacement.estimates[2].active, true);
  assert.equal(activeEstimateIndex({ estimates: confirmedReplacement }).get("svelte-parity").likely_minutes, 180);

  const rejected = draft.setManualEstimate({
    taskId: "editor-framework-spike",
    itemId: "svelte-parity",
    likelyMinutes: 0,
    humanNote: "有依據",
  });
  assert.match(rejected.error, /至少 1 分鐘/u);
});

test("Svelte edit-host client sends the dual-revision multi-file contract", async () => {
  const calls = [];
  const firstSession = {
    token: "first-token",
    scope_id: "example",
    revision: "a".repeat(64),
    inputs_revision: "b".repeat(64),
    local_revision: "e".repeat(64),
    inputs: { config: null, estimates: null },
  };
  const nextSession = {
    ...firstSession,
    token: "next-token",
    revision: "c".repeat(64),
    inputs_revision: "d".repeat(64),
    local_revision: "f".repeat(64),
    report: exampleReport,
  };
  const previewResponse = {
    analysis: exampleTimeAnalysis,
    revision: firstSession.revision,
    inputs_revision: firstSession.inputs_revision,
    local_revision: firstSession.local_revision,
  };
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    if (String(url).includes("/capabilities/")) {
      return jsonResponse({ editable: true, scope_id: "example" });
    }
    if (String(url).endsWith("/preview")) return jsonResponse(previewResponse);
    if (options.method === "POST") return jsonResponse(firstSession, 201);
    if (options.method === "PUT") return jsonResponse(nextSession);
    return { ok: true, status: 204, async json() { return null; } };
  };
  const client = createEditHostClient({
    scope: "example",
    fetchImpl,
    timezone: "Asia/Taipei",
  });

  assert.equal((await client.discover()).editable, true);
  await client.start();
  const previewed = await client.preview({
    report: exampleReport,
    inputs: { config: { scope_id: "example" } },
  });
  assert.equal(previewed.analysis.scope_id, "example");
  const saved = await client.save({
    report: exampleReport,
    inputs: { estimates: { scope_id: "example" } },
    changes: [],
  });

  assert.equal(saved.token, "next-token");
  const startRequest = calls.find((call) => (
    call.options.method === "POST" && !String(call.url).endsWith("/preview")
  ));
  assert.deepEqual(JSON.parse(startRequest.options.body), {
    scope_id: "example",
    timezone: "Asia/Taipei",
  });
  const previewRequest = calls.find((call) => String(call.url).endsWith("/preview"));
  const previewBody = JSON.parse(previewRequest.options.body);
  assert.equal(previewRequest.options.headers["If-Match"], `"${firstSession.revision}"`);
  assert.equal(previewBody.inputs_revision, firstSession.inputs_revision);
  assert.equal(previewBody.local_revision, firstSession.local_revision);
  assert.deepEqual(Object.keys(previewBody.inputs), ["config"]);
  const request = calls.find((call) => call.options.method === "PUT");
  const body = JSON.parse(request.options.body);
  assert.equal(request.options.headers["If-Match"], `"${firstSession.revision}"`);
  assert.equal(body.inputs_revision, firstSession.inputs_revision);
  assert.equal(body.local_revision, firstSession.local_revision);
  assert.deepEqual(body.changes, []);
  assert.deepEqual(Object.keys(body.inputs), ["estimates"]);
  await client.close();
  assert.equal(calls.at(-1).options.method, "DELETE");
  assert.equal(calls.at(-1).options.headers.Authorization, "Bearer next-token");
});

test("Svelte spike is isolated, static-path safe, and uses the shared core", async () => {
  const [packageText, viteText, appText, cardText, rowText, dialogText, manualEstimateText, adapterText, loaderText, clientText, timeDraftText, timeSettingsText, previewText, confirmationText, stylesText, timeEditingText, presentationText, viewerMainText, editorHtmlText] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/vite.config.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/App.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/TaskCard.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/ItemRow.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/TimeDialog.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/ManualEstimateEditor.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/editor-adapter.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/data-loader.js", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/edit-host-client.js", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/time-input-draft.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/TimeSettingsEditor.svelte", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/delivery-risk-preview.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/DeliverySaveConfirmation.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/editor-time-editing.css", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/editor-presentation.css", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/viewer-main.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/editor.html", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageText);

  assert.ok(packageJson.devDependencies.svelte);
  assert.ok(packageJson.devDependencies.vite);
  assert.equal(packageJson.devDependencies.vue, undefined);
  assert.equal(packageJson.scripts["spike:svelte:build"], "npm run editor:svelte:build");
  assert.equal(packageJson.scripts["editor:svelte:build"].includes("vite build"), true);
  assert.match(viteText, /base:\s*"\.\/"/u);
  assert.match(viteText, /editor:\s*fileURLToPath/u);
  assert.match(appText, /createSvelteEditorAdapter/u);
  assert.match(appText, /view\.history\.canUndo/u);
  assert.match(appText, /loadSvelteEditorData/u);
  assert.match(appText, /#each tasks as task/u);
  assert.match(cardText, /<ItemRow/u);
  assert.match(cardText, /timeItems/u);
  assert.match(rowText, /type:\s*"set-item-field"/u);
  assert.doesNotMatch(rowText, /<details|spike-estimate-editor|onManualEstimate/u);
  assert.match(rowText, /onTimeClick\(item\.id, item\.title, taskId\)/u);
  assert.match(dialogText, /<ManualEstimateEditor/u);
  assert.match(manualEstimateText, /humanConfirmed:\s*estimateConfirmed/u);
  assert.match(manualEstimateText, /人工確認此工時/u);
  assert.match(manualEstimateText, /未勾選仍可儲存人工工時與依據/u);
  assert.match(adapterText, /viewer\/assets\/editor-core\.js/u);
  assert.match(adapterText, /normalizeMeaningfulText/u);
  assert.match(loaderText, /resolveReportRequest/u);
  assert.match(loaderText, /inspectTimeAnalysis/u);
  assert.match(clientText, /inputs_revision/u);
  assert.match(clientText, /\/preview/u);
  assert.match(timeDraftText, /supersedes_estimate_id/u);
  assert.match(timeDraftText, /setTimeSettings/u);
  assert.match(timeSettingsText, /工作容量與交付日/u);
  assert.ok(timeSettingsText.indexOf("spike-delivery-settings") < timeSettingsText.indexOf("spike-capacity-settings"));
  assert.match(timeSettingsText, /既有私人理由會保留但不在此顯示或修改/u);
  assert.match(timeSettingsText, /capacityExceptions/u);
  assert.match(appText, /<TimeSettingsEditor/u);
  assert.match(previewText, /capacityDelta/u);
  assert.match(confirmationText, /確認儲存/u);
  assert.match(confirmationText, /event\.key !== "Escape"/u);
  assert.match(confirmationText, /onkeydown=\{keydown\}/u);
  // The time-settings/risk-preview/save-confirmation styling moved into the
  // shared, themed editor-time-editing.css so every host mounting those
  // regions gets it, not just the isolated spike. It stays separate from
  // editor-presentation.css, which is geometry-only and carries no colours.
  assert.match(timeEditingText, /\.spike-time-editor\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/u);
  assert.match(stylesText, /@import "@editor\/editor-presentation\.css"/u);
  assert.match(stylesText, /@import "@editor\/editor-time-editing\.css"/u);
  assert.match(appText, /class="spike-page editor-layout-shell"/u);
  // The editor shell uses the shared controls rather than its own markup.
  assert.match(appText, /<ModeToggle/u);
  assert.match(appText, /<SaveBar/u);
  assert.doesNotMatch(appText, /spike-mode-toggle|spike-savebar|spike-save-button/u);
  assert.match(cardText, /task-card editor-task-card/u);
  assert.match(rowText, /class="editor-item-row"/u);
  assert.match(presentationText, /--editor-content-max-width:\s*960px/u);
  assert.match(presentationText, /\.editor-mode-dock\s*\{[\s\S]*?position:\s*fixed/u);
  assert.match(viewerMainText, /requireHostCapability:\s*true/u);
  assert.match(viewerMainText, /autoStartEditing:\s*window\.self !== window\.top/u);
  assert.match(appText, /taskprogress:editor-close/u);
  assert.match(appText, /autoStartEditing && hostAvailable/u);
  assert.match(editorHtmlText, /noindex, nofollow/u);
  assert.doesNotMatch(appText + cardText + rowText, /localStorage/u);
});
