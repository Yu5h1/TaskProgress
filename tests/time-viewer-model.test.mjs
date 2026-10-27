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
  const [adapter, app, assessment, common, timeModule] = await Promise.all([
    readFile(new URL('../ui/web-workflow/viewer.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../viewer/assets/app.js', import.meta.url), 'utf8'),
    readFile(new URL('../ui/web-workflow/assessment.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../ui/web-workflow/common.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../viewer/assets/time-module-definition.js', import.meta.url), 'utf8'),
  ]);
  assert.match(adapter, /'project-module-strip':/u);
  assert.match(adapter, /'time-dialog': timeDialog/u);
  assert.match(app, /createUiView\(instance\.detailView, element, detail\)/u);
  assert.match(timeModule, /detailView: "time-dialog"/u);
  assert.doesNotMatch(app, /"time-dialog"|"cost-dialog"/u);
  assert.match(assessment, /return dialog\(/u);
  assert.doesNotMatch(assessment, /showModal\(|localStorage/u);
  assert.match(common, /<ui-dialog/u);
  assert.match(common, /node\.addEventListener\('ui-close', close\)/u);
  assert.match(common, /node\.removeEventListener\('ui-close', close\)/u);
});

 test("unset entries accept absent durations; real estimates still require durations", () => {
  const copy = structuredClone(analysis);
  const item = copy.tasks[0].items[0];
  item.mode = "default";
  delete item.likely_minutes;
  delete item.display_hours;
  assert.deepEqual(validateTimeAnalysis(copy, "example"), []);
  item.mode = "manual";
  assert.ok(validateTimeAnalysis(copy, "example").length > 0);
});
