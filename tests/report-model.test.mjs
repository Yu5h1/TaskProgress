import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  buildScopeHref,
  calculateProjectProgress,
  calculateTaskProgress,
  mergeReports,
  resolveReportRequest,
  validateScopeCatalog,
  validateDeveloperReport,
  validateReport,
} from "../viewer/assets/report-model.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(ROOT, relativePath), "utf8"));
}

for (const scope of ["yu5h1lib", "unity-project"]) {
  test(`${scope} examples satisfy the runtime contract`, async () => {
    const report = await readJson(`examples/${scope}/report.json`);
    const dev = await readJson(`examples/${scope}/report.dev.json`);
    assert.deepEqual(validateReport(report), []);
    assert.deepEqual(validateDeveloperReport(dev), []);
    const merged = mergeReports(report, dev);
    assert.equal(merged.developerAvailable, true);
  });
}

test("the public example scope report satisfies the runtime contract", async () => {
  const report = await readJson("reports/example/report.json");
  assert.deepEqual(validateReport(report), []);
});

test("developer reports accept a one-line next step action", () => {
  const report = {
    schema_version: "1.0",
    report_id: "test-report",
    updated_at: "2026-07-21T00:00:00Z",
    tasks: [{ id: "task-a", next_step: "Run the focused validation suite" }],
  };
  assert.deepEqual(validateDeveloperReport(report), []);

  report.tasks[0].next_step = "";
  assert.ok(validateDeveloperReport(report).some((error) => error.path.endsWith("next_step")));
});

test("project progress counts completed current tasks and excludes archives", () => {
  const progress = calculateProjectProgress([
    { status: "done" },
    { status: "in_progress" },
    { status: "planned" },
    { status: "archive" },
  ]);
  assert.deepEqual(progress, { completed: 1, total: 3, percentage: 33 });
});

test("task progress derives displayed item fractions before using explicit progress", () => {
  assert.deepEqual(
    calculateTaskProgress({
      status: "in_progress",
      progress: { completed: 1, total: 2 },
      completed_items: ["a", "b", "c"],
      pending_items: ["d"],
    }),
    { completed: 3, total: 4 },
  );
  assert.deepEqual(
    calculateTaskProgress({
      status: "in_progress",
      progress: { completed: 1, total: 2 },
    }),
    { completed: 1, total: 2 },
  );
});

test("project progress includes child item fractions", () => {
  const progress = calculateProjectProgress([
    { status: "in_progress", completed_items: ["a", "b"], pending_items: ["c", "d"] },
    { status: "done", progress: { completed: 3, total: 3 } },
    { status: "planned" },
    { status: "archive", progress: { completed: 10, total: 10 } },
  ]);
  assert.deepEqual(progress, { completed: 5, total: 8, percentage: 63 });
});

test("project progress is zero when only archived tasks exist", () => {
  assert.deepEqual(
    calculateProjectProgress([{ status: "archive" }]),
    { completed: 0, total: 0, percentage: 0 },
  );
});

test("a version mismatch keeps viewer data and ignores the overlay", async () => {
  const report = await readJson("examples/yu5h1lib/report.json");
  const dev = await readJson("examples/invalid/version-mismatch.report.dev.json");
  const merged = mergeReports(report, dev);
  assert.equal(merged.developerAvailable, false);
  assert.equal(merged.diagnostics[0].code, "schema_mismatch");
  assert.ok(merged.tasks.every((task) => task.developer === null));
});

test("an orphan developer task produces a diagnostic without guessing", async () => {
  const report = await readJson("examples/yu5h1lib/report.json");
  const dev = await readJson("examples/invalid/orphan-task.report.dev.json");
  const merged = mergeReports(report, dev);
  assert.equal(merged.developerAvailable, true);
  assert.equal(merged.diagnostics[0].code, "orphan_developer_task");
});

test("explicit progress cannot exceed its total", () => {
  const report = {
    schema_version: "1.0",
    report_id: "test-report",
    scope_id: "test-scope",
    title: "Test",
    updated_at: "2026-07-20T00:00:00Z",
    tasks: [{
      id: "invalid-progress",
      title: "Invalid progress",
      status: "in_progress",
      summary: "The completed count is invalid.",
      progress: { completed: 4, total: 3 },
    }],
  };
  assert.ok(validateReport(report).some((error) => error.code === "invalid_progress"));
});

test("scope resolves to its deterministic public report path", () => {
  const request = resolveReportRequest(new URLSearchParams("scope=yu5h1lib"));
  assert.deepEqual(request, {
    source: "scope",
    reportSource: "../reports/yu5h1lib/report.json",
    scope: "yu5h1lib",
  });
});

test("an explicit report takes precedence over scope", () => {
  const request = resolveReportRequest(new URLSearchParams(
    "scope=ignored&report=reports/custom/report.json",
  ));
  assert.deepEqual(request, {
    source: "report",
    reportSource: "reports/custom/report.json",
    scope: null,
  });
});

test("scope rejects path traversal and non-stable identifiers", () => {
  for (const scope of ["../private", "nested/path", "Yu5h1Lib", "scope with spaces"]) {
    assert.throws(
      () => resolveReportRequest(new URLSearchParams({ scope })),
      /穩定 ID/,
    );
  }
});

test("scope catalog exposes safe links without local folder paths", () => {
  const scopes = validateScopeCatalog({
    schema_version: "1.0",
    scopes: [
      { id: "bonghuo-vr", has_developer_report: true },
      { id: "yu5h1lib", has_developer_report: false },
    ],
  });
  assert.deepEqual(scopes, [
    { id: "bonghuo-vr", hasDeveloperReport: true },
    { id: "yu5h1lib", hasDeveloperReport: false },
  ]);
  assert.equal(buildScopeHref("bonghuo-vr"), "?scope=bonghuo-vr");
  assert.equal(
    buildScopeHref("bonghuo-vr", true),
    "?scope=bonghuo-vr&dev=..%2Freports%2Fbonghuo-vr%2Freport.dev.json",
  );
});

test("scope catalog rejects duplicate or unsafe IDs", () => {
  assert.throws(() => validateScopeCatalog({
    schema_version: "1.0",
    scopes: [
      { id: "same", has_developer_report: false },
      { id: "same", has_developer_report: true },
    ],
  }), /無效或重複/);
  assert.throws(() => buildScopeHref("../private"), /scope 無效/);
});
