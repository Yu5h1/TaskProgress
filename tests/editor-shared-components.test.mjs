import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createEditHostClient } from "../viewer/assets/edit-host-client.js";
import { createReportEditorAdapter } from "../viewer/assets/report-editor-adapter.js";
import {
  buildDeliveryRiskPreview,
  buildTimeSettingsRiskPreview,
} from "../viewer/assets/delivery-risk-preview.js";
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

test("Report adapter delegates mutations and history to the shared Editor Core", () => {
  const adapter = createReportEditorAdapter(exampleReport);
  const baseline = adapter.snapshot();

  const changed = adapter.dispatch({
    type: "set-task-field",
    taskId: "scope-link",
    field: "summary",
    value: "Svelte view-model draft",
  });

  assert.equal(changed.dirty, true);
  assert.equal(changed.history.canUndo, true);
  assert.equal(changed.report.tasks[0].summary, "Svelte view-model draft");
  assert.notStrictEqual(changed.report, baseline.report);
  assert.equal(exampleReport.tasks[0].summary, baseline.report.tasks[0].summary);

  const undone = adapter.undo();
  assert.equal(undone.report.tasks[0].summary, baseline.report.tasks[0].summary);
  assert.equal(undone.history.canRedo, true);

  const redone = adapter.redo();
  assert.equal(redone.report.tasks[0].summary, "Svelte view-model draft");
  assert.equal(redone.history.canRedo, false);
});

test("Report adapter validates and adds pending items through stable-ID commands", () => {
  const adapter = createReportEditorAdapter(exampleReport);
  const originalCount = adapter.snapshot().report.tasks[1].pending_items.length;

  const rejected = adapter.addPendingItem("pages-deployment", "✨…!!!", 2);
  assert.match(rejected.error, /文字或數字/u);
  assert.equal(rejected.snapshot.report.tasks[1].pending_items.length, originalCount);

  const accepted = adapter.addPendingItem("pages-deployment", "  驗證鍵盤操作  ", 1);
  const items = accepted.snapshot.report.tasks[1].pending_items;
  assert.equal(accepted.error, "");
  assert.equal(items.length, originalCount + 1);
  assert.equal(items.at(-1).title, "驗證鍵盤操作");
  assert.match(items.at(-1).id, /^item-pages-deployment-pending/u);
  assert.equal(accepted.snapshot.derived.progress.tasks["pages-deployment"].total, 3);
});

test("Report adapter keeps invalid saves as drafts and history after commit", () => {
  const adapter = createReportEditorAdapter(exampleReport);
  adapter.dispatch({
    type: "set-task-field",
    taskId: "scope-link",
    field: "summary",
    value: "",
  });

  const rejected = adapter.prepareSave("2026-08-02T12:00:00+08:00");
  assert.ok(rejected.errors.length > 0);
  assert.equal(adapter.snapshot().dirty, true);
  assert.equal(adapter.snapshot().history.canUndo, true);

  adapter.dispatch({
    type: "set-task-field",
    taskId: "scope-link",
    field: "summary",
    value: "有效描述",
  });
  const saved = adapter.prepareSave("2026-08-02T12:30:00+08:00");
  assert.deepEqual(saved.errors, []);
  adapter.commit({ report: saved.report });
  assert.equal(adapter.snapshot().report.updated_at, "2026-08-02T12:30:00+08:00");
  assert.equal(adapter.snapshot().dirty, false);
  assert.equal(adapter.snapshot().history.canUndo, true);
  adapter.undo();
  assert.equal(adapter.snapshot().report.tasks[0].summary, exampleReport.tasks[0].summary);
  adapter.redo();
  assert.equal(adapter.snapshot().report.tasks[0].summary, "有效描述");
});

test("Report adapter applies the shared meaningful-text rule before commit", () => {
  const adapter = createReportEditorAdapter(exampleReport);
  adapter.dispatch({
    type: "set-item-field",
    taskId: "pages-deployment",
    field: "pending_items",
    itemId: "build-deployment-artifact",
    property: "title",
    value: "✨…!!!",
  });

  const rejected = adapter.prepareSave("2026-08-02T12:45:00+08:00");
  assert.equal(adapter.snapshot().dirty, true);
  assert.equal(rejected.errors.some((error) => (
    error.path === "tasks[1].pending_items[0].title"
  )), true);
});

test("Report adapter combines report and private time drafts into one payload", () => {
  let externalDirty = true;
  const timeDraft = createTimeInputDraft({
    config: { scope_id: "example", project: { executor_count: 1 } },
    estimates: null,
  }, "example");
  timeDraft.setDeliveryAt("2026-08-30T17:00:00+08:00", {
    reason: "契約驗證",
    updatedAt: "2026-08-23T12:00:00+08:00",
  });
  const adapter = createReportEditorAdapter(exampleReport, {
    timeDraft,
    isExternalDirty: () => externalDirty,
    onCommit: () => { externalDirty = false; },
    now: () => "2026-08-23T12:01:00+08:00",
  });

  const prepared = adapter.prepareSave();
  assert.equal(adapter.snapshot().dirty, true);
  assert.deepEqual(Object.keys(prepared.inputs), ["config"]);
  assert.equal(prepared.changes[0].field_path, "time.config.project.delivery_at");
  adapter.commit({ report: prepared.report });
  assert.equal(adapter.snapshot().dirty, false);
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

test("Shared edit-host client sends the dual-revision multi-file contract", async () => {
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

test("formal Viewer delegates commands and assessment to the shared product core", async () => {
  const [viewer, assessment, adapter, settings] = await Promise.all([
    readFile(new URL('../ui/web-workflow/viewer.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../ui/web-workflow/assessment.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../viewer/assets/report-editor-adapter.js', import.meta.url), 'utf8'),
    readFile(new URL('../ui/web-workflow/time-settings.mjs', import.meta.url), 'utf8'),
  ]);
  for (const region of ['task-list', 'save-bar', 'delivery-save-confirmation']) assert.ok(viewer.includes(`'${region}':`));
  assert.match(viewer, /cmd\('set-item-field'/u);
  assert.match(viewer, /cmd\('set-item-status'/u);
  assert.doesNotMatch(viewer, /type: ['"]move-item['"]|localStorage/u);
  assert.match(viewer, /p\.itemCapsules\?\.get\(item\.id\)/u);
  assert.match(viewer, /p\.onModuleActivate\?\.\(id, \{ taskId: task\.id, itemId: item\.id, itemTitle: item\.title \}\)/u);
  assert.match(adapter, /\.\/editor-core\.js/u);
  assert.match(adapter, /normalizeMeaningfulText/u);
  assert.match(assessment, /timeSettings\(p\.timeSettings, view\)/u);
  assert.match(assessment, /humanConfirmed: s\.confirmed/u);
  assert.match(assessment, /dismissOnBackdrop:false/u);
  assert.match(settings, /capacityExceptions/u);
});

test("Cost and Time share one readout template", async () => {
  const source = await readFile(new URL('../ui/web-workflow/assessment.mjs', import.meta.url), 'utf8');
  for (const label of ['預估工時', '估算成本', '估算總額']) assert.ok(source.includes(`readout('${label}',`));
  assert.equal((source.match(/const readout =/gu) ?? []).length, 1);
});

test("decision context, option descriptions and recommendation reasons render inline links; questions stay plain", async () => {
  const decision = await readFile(new URL('../ui/web-workflow/decisions.mjs', import.meta.url), 'utf8');
  for (const expression of ['item.context', 'o.description', 'item.recommendation.reason']) assert.ok(decision.includes(`inline(${expression})`));
  assert.doesNotMatch(decision, /inline\(item\.question\)/u);
});
