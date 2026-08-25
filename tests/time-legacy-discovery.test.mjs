// Fixture coverage for the legacy Time discovery/loading extraction — see
// the header comment in ../viewer/assets/time-legacy-discovery.js for why
// this stays separate from module-model.js's envelope loader. `fetchJson` is
// injected so every case here runs with no real network access.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { loadLegacyTimeAnalysis } from "../viewer/assets/time-legacy-discovery.js";

const BASE_URL = "https://example.invalid/reports/task-progress/";
const REPORT_SOURCE = "report.json";
const SCOPE_ID = "task-progress";

function validAnalysis(overrides = {}) {
  return {
    schema_version: "0.2",
    scope_id: SCOPE_ID,
    method: { name: "deterministic-capacity-feasibility", version: "0.3" },
    summary: {
      nominal_daily_capacity_minutes: 480,
      total_estimated_minutes: 100,
      calibrated_total_minutes: 100,
      remaining_estimated_minutes: 100,
      execution_calibration: { factor: 1 },
    },
    tasks: [],
    ...overrides,
  };
}

function validDeadline() {
  return {
    started_at: "2026-08-01T00:00:00Z",
    delivery_at: "2026-09-01T00:00:00Z",
    remaining_estimated_minutes: 50,
    schedule: {
      timezone: "Asia/Taipei",
      workday_start_local: "09:00",
      workday_end_local: "17:00",
      risk_thresholds: {},
      capacity_timeline: [{}],
    },
  };
}

function baseArgs(overrides = {}) {
  return {
    reportSource: REPORT_SOURCE,
    baseUrl: BASE_URL,
    explicitTimeSource: undefined,
    scopeId: SCOPE_ID,
    fetchJson: async () => null,
    ...overrides,
  };
}

test("explicit ?time=none skips the fetch entirely", async () => {
  let calls = 0;
  const result = await loadLegacyTimeAnalysis(baseArgs({
    explicitTimeSource: "none",
    fetchJson: async () => { calls += 1; return validAnalysis(); },
  }));
  assert.equal(calls, 0);
  assert.deepEqual(result, { timeAnalysis: null, diagnostics: [] });
});

test("a missing sidecar (fetchJson resolves null) is a clean no-op, not a diagnostic", async () => {
  const result = await loadLegacyTimeAnalysis(baseArgs({ fetchJson: async () => null }));
  assert.deepEqual(result, { timeAnalysis: null, diagnostics: [] });
});

test("a valid estimate-only sidecar (no deadline) loads with no diagnostics", async () => {
  const result = await loadLegacyTimeAnalysis(baseArgs({ fetchJson: async () => validAnalysis() }));
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.timeAnalysis.summary.total_estimated_minutes, 100);
  assert.equal("deadline" in result.timeAnalysis.summary, false);
});

test("a valid sidecar with a valid deadline keeps the deadline and reports no diagnostics", async () => {
  const analysis = validAnalysis({ summary: { ...validAnalysis().summary, deadline: validDeadline() } });
  const result = await loadLegacyTimeAnalysis(baseArgs({ fetchJson: async () => analysis }));
  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(result.timeAnalysis.summary.deadline, validDeadline());
});

test("estimate-core errors reject the whole sidecar with one diagnostic, timeAnalysis stays null", async () => {
  const result = await loadLegacyTimeAnalysis(baseArgs({
    fetchJson: async () => validAnalysis({ schema_version: "0.1" }),
  }));
  assert.equal(result.timeAnalysis, null);
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].level, "warning");
  assert.match(result.diagnostics[0].message, /^time\.analysis\.json 已忽略：/);
});

// inspectTimeAnalysis() itself folds `deadlineErrors.length > 0` into a
// false `deadlineAvailable` — the field being merely present is not enough —
// so a broken deadline is dropped, not kept-but-flagged. This fixture pins
// that down after an earlier wrong assumption here failed against the real
// function.
test("a malformed-but-present deadline is stripped from timeAnalysis and reported as a diagnostic", async () => {
  const analysis = validAnalysis({ summary: { ...validAnalysis().summary, deadline: {} } });
  const result = await loadLegacyTimeAnalysis(baseArgs({ fetchJson: async () => analysis }));
  assert.equal("deadline" in result.timeAnalysis.summary, false);
  assert.equal(result.diagnostics.length, 1);
  assert.match(result.diagnostics[0].message, /^期限分析已忽略：/);
});

test("a thrown fetch error becomes one diagnostic instead of an unhandled rejection", async () => {
  const result = await loadLegacyTimeAnalysis(baseArgs({
    fetchJson: async () => { throw new Error("time.analysis.json 載入失敗（HTTP 500）。"); },
  }));
  assert.equal(result.timeAnalysis, null);
  assert.deepEqual(result.diagnostics, [
    { level: "warning", message: "時間參考已忽略：time.analysis.json 載入失敗（HTTP 500）。" },
  ]);
});

test("fetchJson is called with the resolved sidecar URL, honoring an explicit override", async () => {
  let receivedUrl = null;
  await loadLegacyTimeAnalysis(baseArgs({
    explicitTimeSource: "custom-time.json",
    fetchJson: async (url) => { receivedUrl = url; return null; },
  }));
  assert.equal(receivedUrl.href, new URL("custom-time.json", BASE_URL).href);
});

// --- isolation: this file never touches the DOM itself ---

test("time-legacy-discovery.js stays off the DOM", async () => {
  const source = await readFile(new URL("../viewer/assets/time-legacy-discovery.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /document\.|window\.|querySelector\(|createUiView\(/u);
});

// --- wiring shape: app.js runs this path as the fallback its composition
// root selects, the stage-2 shadow scaffolding and the old inline duplicate
// are both gone. ---

test("app.js runs legacy discovery only when the manifest path did not claim the load", async () => {
  const appSource = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.match(appSource, /from "\.\/time-legacy-discovery\.js"/u);
  assert.match(appSource, /if \(!timeResult\) \{\s*\n\s*timeResult = await loadLegacyTimeAnalysis\(\{/u);
  assert.match(appSource, /state\.timeAnalysis = timeResult\.timeAnalysis;/u);
  assert.match(appSource, /state\.diagnostics\.push\(\.\.\.timeResult\.diagnostics\);/u);
  // The explicit ?time= override still reaches this path, so ?time=none and
  // ?time=<path> keep working exactly as before.
  assert.match(appSource, /explicitTimeSource,/u);
});

test("the stage-2 shadow scaffolding and the old inline duplicate are both gone", async () => {
  const appSource = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.doesNotMatch(appSource, /shadowCheckLegacyTimeDiscovery|resolveTimeAnalysisSource|inspectTimeAnalysis/u);
});
