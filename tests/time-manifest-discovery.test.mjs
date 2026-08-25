// Manifest-driven Time discovery. The assertions worth having here are the
// ones about *which* path claims discovery and what a failure does to the
// rest of the report: a present-but-broken manifest must not silently fall
// back to legacy filename discovery, and a Time module that fails must not
// take the base report down with it.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  MODULE_MANIFEST_FILENAME,
  SUPPORTED_TIME_DATA_VERSIONS,
  loadManifestTimeAnalysis,
} from "../viewer/assets/time-manifest-discovery.js";

const BASE_URL = "https://example.invalid/reports/task-progress/";
const REPORT_SOURCE = "report.json";

const REPORT = Object.freeze({
  report_id: "task-progress-development",
  scope_id: "task-progress",
  tasks: [],
});

function manifest(overrides = {}) {
  return {
    schema_version: "0.1",
    report_id: REPORT.report_id,
    scope_id: REPORT.scope_id,
    modules: [{
      id: "time",
      type: "taskprogress.time",
      source: "time.analysis.json",
      optional: true,
      visibility: "local",
    }],
    ...overrides,
  };
}

function legacyAnalysis(overrides = {}) {
  return {
    schema_version: "0.2",
    scope_id: "task-progress",
    analysis_id: "analysis-1",
    as_of: "2026-08-25T10:29:27+08:00",
    method: { name: "deterministic-capacity-feasibility", version: "0.3" },
    summary: {
      nominal_daily_capacity_minutes: 480,
      total_estimated_minutes: 480,
      calibrated_total_minutes: 480,
      remaining_estimated_minutes: 480,
      execution_calibration: { factor: 1 },
    },
    tasks: [],
    ...overrides,
  };
}

function filesFetcher(files) {
  return async (url) => {
    const name = url.pathname.split("/").pop();
    if (!(name in files)) return null;
    const value = files[name];
    if (value instanceof Error) throw value;
    return value;
  };
}

function args(files, extra = {}) {
  return {
    report: REPORT,
    reportSource: REPORT_SOURCE,
    baseUrl: BASE_URL,
    fetchJson: filesFetcher(files),
    ...extra,
  };
}

// --- who claims discovery ---

test("no manifest means this path does not claim discovery, and says nothing", async () => {
  const result = await loadManifestTimeAnalysis(args({}));
  assert.equal(result.handled, false);
  assert.equal(result.timeAnalysis, null);
  assert.deepEqual(result.diagnostics, []);
});

test("a manifest that declares no Time still claims discovery — it said there is none", async () => {
  const result = await loadManifestTimeAnalysis(args({
    "report.modules.json": manifest({ modules: [] }),
    // A legacy sidecar sitting right there must NOT be picked up: the
    // manifest is the only discovery source once it exists.
    "time.analysis.json": legacyAnalysis(),
  }));
  assert.equal(result.handled, true);
  assert.equal(result.timeAnalysis, null);
});

test("an unreadable manifest claims discovery rather than falling back to the legacy filename", async () => {
  const result = await loadManifestTimeAnalysis(args({
    "report.modules.json": new Error("report.modules.json 不是有效的 JSON。"),
    "time.analysis.json": legacyAnalysis(),
  }));
  assert.equal(result.handled, true);
  assert.equal(result.timeAnalysis, null);
  assert.match(result.diagnostics[0].message, /report\.modules\.json 已忽略/);
});

// --- the happy path ---

test("a valid manifest loads Time through the envelope adapter and the shared domain validator", async () => {
  const result = await loadManifestTimeAnalysis(args({
    "report.modules.json": manifest(),
    "time.analysis.json": legacyAnalysis(),
  }));
  assert.equal(result.handled, true);
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.timeAnalysis.summary.total_estimated_minutes, 480);
  assert.equal(result.provenance.identity_binding, "scope-only");
});

test("the descriptor's source is honored, not the legacy filename", async () => {
  const result = await loadManifestTimeAnalysis(args({
    "report.modules.json": manifest({
      modules: [{
        id: "time",
        type: "taskprogress.time",
        source: "modules/time.projection.json",
        optional: true,
        visibility: "local",
      }],
    }),
    "time.projection.json": legacyAnalysis(),
  }));
  assert.equal(result.timeAnalysis.summary.total_estimated_minutes, 480);
});

test("the descriptor's module id reaches the envelope, so identity is checked against what the manifest declared", async () => {
  const result = await loadManifestTimeAnalysis(args({
    "report.modules.json": manifest({
      modules: [{
        id: "time-primary",
        type: "taskprogress.time",
        source: "time.analysis.json",
        optional: true,
        visibility: "local",
      }],
    }),
    "time.analysis.json": legacyAnalysis(),
  }));
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.timeAnalysis.summary.total_estimated_minutes, 480);
});

// --- failure isolation ---

test("an invalid manifest drops the module and reports it, without a partial load", async () => {
  const result = await loadManifestTimeAnalysis(args({
    "report.modules.json": manifest({ scope_id: "another-scope" }),
    "time.analysis.json": legacyAnalysis(),
  }));
  assert.equal(result.handled, true);
  assert.equal(result.timeAnalysis, null);
  assert.match(result.diagnostics[0].message, /report\.modules\.json 已忽略/);
});

test("a declared-but-missing sidecar is a module diagnostic, not a thrown error", async () => {
  const result = await loadManifestTimeAnalysis(args({ "report.modules.json": manifest() }));
  assert.equal(result.timeAnalysis, null);
  assert.match(result.diagnostics[0].message, /找不到 time\.analysis\.json/);
});

test("a sidecar whose scope disagrees with the report is rejected at the envelope, before domain validation", async () => {
  const result = await loadManifestTimeAnalysis(args({
    "report.modules.json": manifest(),
    "time.analysis.json": legacyAnalysis({ scope_id: "another-scope" }),
  }));
  assert.equal(result.timeAnalysis, null);
  assert.match(result.diagnostics[0].message, /時間模組已忽略/);
});

test("an unsupported Time data version is refused rather than guessed at", async () => {
  const result = await loadManifestTimeAnalysis(args({
    "report.modules.json": manifest(),
    "time.analysis.json": legacyAnalysis({ schema_version: "9.9" }),
  }));
  assert.equal(result.timeAnalysis, null);
  assert.match(result.diagnostics[0].message, /時間模組已忽略/);
  assert.deepEqual(SUPPORTED_TIME_DATA_VERSIONS, ["0.2"]);
});

test("a malformed deadline is stripped and reported, matching the legacy path's behavior", async () => {
  const result = await loadManifestTimeAnalysis(args({
    "report.modules.json": manifest(),
    "time.analysis.json": legacyAnalysis({
      summary: { ...legacyAnalysis().summary, deadline: {} },
    }),
  }));
  assert.equal("deadline" in result.timeAnalysis.summary, false);
  assert.match(result.diagnostics[0].message, /期限分析已忽略/);
});

// --- freshness is reported, not enforced ---

test("freshness is reported when a report revision is supplied, and does not block rendering", async () => {
  const result = await loadManifestTimeAnalysis(args(
    { "report.modules.json": manifest(), "time.analysis.json": legacyAnalysis() },
    { currentReportRevision: `sha256:${"a".repeat(64)}` },
  ));
  // Adapted legacy sidecars carry no report_revision, so unknown is the
  // honest answer — and it must not suppress the projection.
  assert.equal(result.freshness, "freshness_unknown");
  assert.notEqual(result.timeAnalysis, null);
});

// --- isolation ---

test("the manifest filename is fixed and this module stays off the DOM", async () => {
  assert.equal(MODULE_MANIFEST_FILENAME, "report.modules.json");
  const source = await readFile(new URL("../viewer/assets/time-manifest-discovery.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /document\.|window\.|querySelector\(|createUiView\(/u);
});

test("nothing in production selects between manifest and legacy discovery yet", async () => {
  const appSource = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.doesNotMatch(appSource, /time-manifest-discovery\.js/u);
});
