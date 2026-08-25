// Manifest-driven Cost discovery. Mirrors time-manifest-discovery's test
// shape: who claims discovery, failure isolation, and — the point unique to
// Cost — that it is validated as a real envelope (full identity binding, no
// adapter), unlike Time's scope-only legacy path.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { COST_MODULE_TYPE, SUPPORTED_COST_DATA_VERSIONS, loadCostModule } from "../viewer/assets/cost-module-loader.js";

const BASE_URL = "https://example.invalid/reports/example/";
const REPORT_SOURCE = "report.json";

const REPORT = Object.freeze({
  report_id: "example-public-demo",
  scope_id: "example",
  tasks: [{ id: "scope-link", title: "x" }, { id: "pages-deployment", title: "y" }],
});

function manifest(overrides = {}) {
  return {
    schema_version: "0.1",
    report_id: REPORT.report_id,
    scope_id: REPORT.scope_id,
    modules: [{
      id: "cost",
      type: COST_MODULE_TYPE,
      source: "cost.analysis.json",
      optional: true,
      visibility: "public",
    }],
    ...overrides,
  };
}

function envelope(overrides = {}) {
  return {
    module_type: COST_MODULE_TYPE,
    schema_version: "0.1",
    module_id: "cost",
    report_id: REPORT.report_id,
    scope_id: REPORT.scope_id,
    generated_at: "2026-08-25T12:00:00+08:00",
    generator: { id: "taskprogress-cost-fixture", version: "0.1" },
    data: {
      currency: "TWD",
      summary: { estimated: { minor_unit_amount: 1250000, as_of: "2026-08-25", confidence: "medium" } },
      tasks: [{
        task_id: "scope-link",
        estimated: {
          minor_unit_amount: 480000,
          method: "time-rate-product",
          scope_included: ["labor"],
          breakdown: [{ category: "labor", minor_unit_amount: 480000, basis: "role-rate" }],
          confidence: "medium",
        },
      }],
    },
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
  return { report: REPORT, reportSource: REPORT_SOURCE, baseUrl: BASE_URL, fetchJson: filesFetcher(files), ...extra };
}

// --- who claims discovery ---

test("no manifest means Cost is simply not declared, not an error", async () => {
  const result = await loadCostModule(args({}));
  assert.equal(result.handled, false);
  assert.equal(result.data, null);
  assert.deepEqual(result.diagnostics, []);
});

test("a manifest that declares no Cost still claims discovery", async () => {
  const result = await loadCostModule(args({ "report.modules.json": manifest({ modules: [] }) }));
  assert.equal(result.handled, true);
  assert.equal(result.data, null);
});

// --- happy path ---

test("a valid manifest and envelope load Cost with full identity validation, not scope-only", async () => {
  const result = await loadCostModule(args({
    "report.modules.json": manifest(),
    "cost.analysis.json": envelope(),
  }));
  assert.equal(result.handled, true);
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.data.summary.estimated.minor_unit_amount, 1250000);
});

test("an envelope missing report_id is rejected — Cost gets no scope-only relaxation", async () => {
  const broken = envelope();
  delete broken.report_id;
  const result = await loadCostModule(args({ "report.modules.json": manifest(), "cost.analysis.json": broken }));
  assert.equal(result.data, null);
  assert.match(result.diagnostics[0].message, /成本模組已忽略/);
});

// --- failure isolation ---

test("an unreadable manifest claims discovery instead of pretending Cost is undeclared", async () => {
  const result = await loadCostModule(args({ "report.modules.json": new Error("bad json") }));
  assert.equal(result.handled, true);
  assert.equal(result.data, null);
  assert.match(result.diagnostics[0].message, /report\.modules\.json 已忽略/);
});

test("a declared-but-missing sidecar is a diagnostic, not a thrown error", async () => {
  const result = await loadCostModule(args({ "report.modules.json": manifest() }));
  assert.equal(result.data, null);
  assert.match(result.diagnostics[0].message, /找不到 cost\.analysis\.json/);
});

test("invalid domain data (bad currency) is refused with a diagnostic", async () => {
  const bad = envelope({ data: { ...envelope().data, currency: "twd" } });
  const result = await loadCostModule(args({ "report.modules.json": manifest(), "cost.analysis.json": bad }));
  assert.equal(result.data, null);
  assert.match(result.diagnostics[0].message, /成本模組已忽略/);
});

// --- subject matching, reused from Phase 1 ---

test("an orphan task_id is reported but does not drop the rest of the module", async () => {
  const withOrphan = envelope({
    data: {
      ...envelope().data,
      tasks: [
        ...envelope().data.tasks,
        {
          task_id: "no-such-task",
          estimated: {
            minor_unit_amount: 1000,
            method: "fixed",
            scope_included: ["subscription"],
            breakdown: [{ category: "subscription", minor_unit_amount: 1000, basis: "flat" }],
            confidence: "low",
          },
        },
      ],
    },
  });
  const result = await loadCostModule(args({ "report.modules.json": manifest(), "cost.analysis.json": withOrphan }));
  assert.notEqual(result.data, null);
  assert.deepEqual(result.orphanTaskIds, ["no-such-task"]);
  assert.equal(result.diagnostics.some((entry) => entry.message.includes("no-such-task")), true);
});

// --- freshness reported, not enforced ---

test("freshness is reported when a report revision is supplied", async () => {
  const revision = `sha256:${"c".repeat(64)}`;
  const withRevision = envelope({ report_revision: revision });
  const result = await loadCostModule(args(
    { "report.modules.json": manifest(), "cost.analysis.json": withRevision },
    { currentReportRevision: revision },
  ));
  assert.equal(result.freshness, "current");
  assert.notEqual(result.data, null);
});

// --- isolation ---

test("the loader stays off the DOM", async () => {
  const source = await readFile(new URL("../viewer/assets/cost-module-loader.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /document\.|window\.|querySelector\(|createUiView\(/u);
});

test("supported data versions are fixed to v0.1, matching the design's estimated-only slice", () => {
  assert.deepEqual(SUPPORTED_COST_DATA_VERSIONS, ["0.1"]);
});

test("nothing in production imports the Cost loader yet", async () => {
  const appSource = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.doesNotMatch(appSource, /cost-module-loader\.js/u);
});
