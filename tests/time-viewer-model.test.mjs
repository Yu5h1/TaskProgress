import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildCapacityTimeline,
  calculateDeadlineRisk,
  canUseLocalTimeOverrides,
  inspectTimeAnalysis,
  resolveTimeAnalysisSource,
  validateTimeAnalysis,
} from "../viewer/assets/time-model.js";

const analysis = JSON.parse(await readFile(
  new URL("../reports/example/time.analysis.json", import.meta.url),
  "utf8",
));

test("Viewer accepts the example time analysis and indexes a real deadline", () => {
  assert.deepEqual(validateTimeAnalysis(analysis, "example"), []);

  const result = calculateDeadlineRisk(
    analysis.summary.deadline,
    "2026-07-24T17:00:00+08:00",
  );
  assert.equal(result.total_capacity_minutes, 4320);
  assert.equal(result.elapsed_capacity_minutes, 2400);
  assert.equal(result.urgency, "on_track");
  assert.ok(Math.abs(result.progress_pressure_ratio - 0.9) < 0.000001);
});

test("capacity shortfall overrides a green progress-pressure result", () => {
  const deadline = structuredClone(analysis.summary.deadline);
  deadline.remaining_estimated_minutes = 3000;

  const result = calculateDeadlineRisk(
    deadline,
    "2026-07-24T17:00:00+08:00",
  );

  assert.ok(result.progress_pressure_ratio < 1);
  assert.equal(result.remaining_capacity_minutes, 1920);
  assert.equal(result.capacity_balance_minutes, -1080);
  assert.equal(result.risk_basis, "capacity_shortfall");
  assert.equal(result.urgency, "critical");
});

test("using more than 80 percent of remaining capacity is at least yellow", () => {
  const deadline = structuredClone(analysis.summary.deadline);
  deadline.work_progress_ratio = 0.8;
  deadline.remaining_estimated_minutes = 1600;

  const result = calculateDeadlineRisk(
    deadline,
    "2026-07-24T17:00:00+08:00",
  );

  assert.equal(result.remaining_capacity_minutes, 1920);
  assert.ok(result.feasibility_ratio > 0.8);
  assert.equal(result.risk_basis, "capacity_tight");
  assert.equal(result.urgency, "at_risk");
});

test("Viewer resolves the optional sidecar beside report.json", () => {
  assert.equal(
    resolveTimeAnalysisSource(
      "../reports/example/report.json",
      "https://example.test/viewer/",
    ).href,
    "https://example.test/reports/example/time.analysis.json",
  );
  assert.equal(
    resolveTimeAnalysisSource(
      "../reports/example/report.json",
      "https://example.test/viewer/",
      "none",
    ),
    null,
  );
});

test("capacity profile rebuilds the timeline while excluding weekends", () => {
  const timeline = buildCapacityTimeline(
    analysis.summary.deadline,
    analysis.summary.deadline.schedule.capacity_profile,
  );
  assert.deepEqual(timeline, analysis.summary.deadline.schedule.capacity_timeline);
});

test("capacity overrides are local-only", () => {
  assert.equal(canUseLocalTimeOverrides(new URL("file:///viewer/index.html")), true);
  assert.equal(canUseLocalTimeOverrides(new URL("http://127.0.0.1:8765/")), true);
  assert.equal(canUseLocalTimeOverrides(new URL("https://example.test/viewer/")), false);
});

test("a broken or mismatched sidecar remains optional", () => {
  const errors = validateTimeAnalysis(
    { ...analysis, scope_id: "another-scope" },
    "example",
  );
  assert.match(errors.join("；"), /scope_id/);
});

test("production Viewer accepts estimate-only analysis without a deadline", () => {
  const estimateOnly = structuredClone(analysis);
  delete estimateOnly.summary.deadline;

  assert.deepEqual(inspectTimeAnalysis(estimateOnly, "example"), {
    errors: [],
    deadlineAvailable: false,
    deadlineErrors: [],
  });
  assert.deepEqual(validateTimeAnalysis(estimateOnly, "example"), []);
});

test("production Viewer isolates a malformed deadline from valid estimates", () => {
  const partial = structuredClone(analysis);
  partial.summary.deadline = {
    delivery_at: "not-a-date",
    schedule: {},
  };

  const result = inspectTimeAnalysis(partial, "example");
  assert.deepEqual(result.errors, []);
  assert.equal(result.deadlineAvailable, false);
  assert.ok(result.deadlineErrors.length > 0);
});

test("Viewer markup exposes one shared dialog mount and all three detail tabs", async () => {
  const html = await readFile(
    new URL("../viewer/index.html", import.meta.url),
    "utf8",
  );
  const source = await readFile(
    new URL("../viewer/assets/time-dialog-control.js", import.meta.url),
    "utf8",
  );

  assert.match(html, /id="time-dialog-dock"/);
  assert.match(html, /id="time-summary-dock"/);
  assert.doesNotMatch(html, /id="time-dialog"/);
  assert.doesNotMatch(html, /id="time-summary-button"/);
  assert.match(source, /name: "flow", label: "評估流程"/);
  assert.match(source, /name: "engineering", label: "工程估算"/);
  assert.match(source, /name: "capacity", label: "工作容量"/);
});

test("the time summary button and its dialog are registered as one shared implementation", async () => {
  const [adapter, app, timeDialog, timeSummaryButton] = await Promise.all([
    readFile(new URL("../experiments/editor-svelte-spike/src/viewer-adapter.svelte.js", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/TimeDialog.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/TimeSummaryButton.svelte", import.meta.url), "utf8"),
  ]);

  assert.match(adapter, /"time-summary-button": TimeSummaryButton/);
  assert.match(adapter, /"time-dialog": TimeDialog/);
  assert.match(app, /createUiView\("time-summary-button", elements\.timeSummaryButton/);
  assert.match(app, /createUiView\("time-dialog", elements\.timeDialog/);

  // The dialog element is structurally conditional on `open`, not toggled by
  // an imperative call reacting to a prop change — see the comment in
  // TimeDialog.svelte for why a bare `$:`/action-update on that prop is
  // unreliable in this project's imperative-mount setup.
  assert.match(timeDialog, /\{#if open\}/);
  assert.match(timeDialog, /use:openOnMount/);
  // Closing is host-notified directly by the button/backdrop, not solely
  // through the native `close` event.
  assert.match(timeDialog, /function requestClose\(\)/);
  assert.match(timeDialog, /dialogEl\?\.close\(\);\s*notifyClose\(\);/);
  // `notifyClose` is that direct notification plus focus restoration.
  assert.match(timeDialog, /function notifyClose\(\)[\s\S]*?onClose\(\);/);

  assert.doesNotMatch(timeSummaryButton, /localStorage/);
  assert.doesNotMatch(timeDialog, /localStorage/);
});
