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

test("Viewer markup exposes one shared dialog and all three detail tabs", async () => {
  const html = await readFile(
    new URL("../viewer/index.html", import.meta.url),
    "utf8",
  );
  const source = await readFile(
    new URL("../viewer/assets/time-view.js", import.meta.url),
    "utf8",
  );

  assert.match(html, /id="time-dialog"/);
  assert.match(html, /id="time-summary-button"/);
  assert.match(source, /\["flow", "評估流程"\]/);
  assert.match(source, /\["engineering", "工程估算"\]/);
  assert.match(source, /\["capacity", "工作容量"\]/);
});
