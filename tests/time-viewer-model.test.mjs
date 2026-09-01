import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  calculateDeadlineRisk,
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

  assert.match(html, /id="module-detail-dock"/);
  assert.doesNotMatch(html, /id="time-dialog-dock"/);
  assert.doesNotMatch(html, /id="cost-dialog-dock"/);
  assert.match(html, /id="time-summary-dock"/);
  assert.doesNotMatch(html, /id="time-dialog"/);
  assert.doesNotMatch(html, /id="time-summary-button"/);
  assert.match(source, /name: "flow", label: "評估流程"/);
  assert.match(source, /name: "engineering", label: "工程估算"/);
  assert.match(source, /name: "capacity", label: "工作容量"/);
});

test("the time summary button and its dialog are registered as one shared implementation", async () => {
  const [adapter, app, timeDialog, timeSummaryButton, timeModule] = await Promise.all([
    readFile(new URL("../experiments/editor-svelte-spike/src/viewer-adapter.svelte.js", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/TimeDialog.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/TimeSummaryButton.svelte", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/time-module-definition.js", import.meta.url), "utf8"),
  ]);

  // The delivery capsule now mounts through the shared module strip rather
  // than as a lone button, so the main-panel and item-row capsule rows are
  // one implementation (2026-08-25). TimeSummaryButton itself stays
  // registered for hosts that still mount a standalone capsule.
  assert.match(adapter, /"project-module-strip": ModuleCapsuleStrip/);
  assert.match(adapter, /"time-dialog": TimeDialog/);
  assert.match(app, /createUiView\(\s*"project-module-strip",\s*elements\.timeSummaryButton/);

  // The host no longer names Time's panel. Every module's detail mounts
  // through one dock, and the module says which shared view renders it, so
  // adding a module touches neither the markup nor the host.
  assert.match(timeModule, /detailView: "time-dialog"/);
  assert.match(app, /createUiView\(instance\.detailView, element, detail\)/);
  assert.doesNotMatch(app, /"time-dialog"|"cost-dialog"/);

  // Modal mechanics live in DialogShell, not in Time's panel. Time passes
  // `open` through and renders its content into the shell's slot.
  assert.match(timeDialog, /<DialogShell[\s\S]*?\{open\}/);
  assert.doesNotMatch(timeDialog, /showModal\(|use:openOnMount/);

  const dialogShell = await readFile(
    new URL("../experiments/editor-svelte-spike/src/DialogShell.svelte", import.meta.url),
    "utf8",
  );
  // The dialog element is structurally conditional on `open`, not toggled by
  // an imperative call reacting to a prop change — see the comment in
  // DialogShell.svelte for why a bare `$:`/action-update on that prop is
  // unreliable in this project's imperative-mount setup.
  assert.match(dialogShell, /\{#if open\}/);
  assert.match(dialogShell, /use:openOnMount/);
  // Closing is host-notified directly by the button/backdrop, not solely
  // through the native `close` event.
  assert.match(dialogShell, /function requestClose\(\)/);
  assert.match(dialogShell, /dialogEl\?\.close\(\);\s*notifyClose\(\);/);
  // `notifyClose` is that direct notification plus focus restoration.
  assert.match(dialogShell, /function notifyClose\(\)[\s\S]*?onClose\(\);/);
  // The shell stays domain-neutral: it imports nothing, so no domain
  // component, model or formatter can be reached from inside it.
  assert.doesNotMatch(dialogShell, /^\s*import\s/mu);

  assert.doesNotMatch(timeSummaryButton, /localStorage/);
  assert.doesNotMatch(timeDialog, /localStorage/);
});
