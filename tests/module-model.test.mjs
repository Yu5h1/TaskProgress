// Phase 1 fixture matrix for the extension-module pure model
// (Documentation/ExtensionModuleArchitecturePlan.md#phase-1schema-與純模型).
// Every assertion here stays off the DOM and off a service: manifests,
// envelopes and artifacts are plain fixtures, and the loader is exercised
// against them directly. Coverage follows the Phase 1 exit list verbatim:
// unknown type, version mismatch, identity mismatch, orphan, stale, and one
// module's failure not stopping another's.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createSubjectIndex,
  evaluateProjectionFreshness,
  isSafeModuleSource,
  isSupportedManifestSchemaVersion,
  loadReportModules,
  MODULE_DIAGNOSTIC_CODES,
  PROJECTION_FRESHNESS,
  resolveModuleSource,
  SUPPORTED_MANIFEST_SCHEMA_VERSIONS,
  validateModuleEnvelope,
  validateModuleManifest,
} from "../viewer/assets/module-model.js";

const REPORT = Object.freeze({
  report_id: "task-progress-report",
  scope_id: "task-progress",
  tasks: [
    {
      id: "extension-module-phase1",
      title: "Phase 1",
      status: "in_progress",
      summary: "Schema 與純模型。",
      completed_items: [{ id: "manifest-schema", title: "manifest schema" }],
      pending_items: [{ id: "pure-model", title: "pure model" }, "legacy string item"],
    },
  ],
});

const CURRENT_REVISION = `sha256:${"a".repeat(64)}`;
const OTHER_REVISION = `sha256:${"b".repeat(64)}`;

function manifestFor(overrides = {}) {
  return {
    schema_version: "0.1",
    report_id: REPORT.report_id,
    scope_id: REPORT.scope_id,
    modules: [
      {
        id: "cost",
        type: "taskprogress.cost",
        source: "cost.analysis.json",
        optional: true,
        visibility: "local",
      },
    ],
    ...overrides,
  };
}

function envelopeFor(overrides = {}) {
  return {
    module_type: "taskprogress.cost",
    schema_version: "0.1",
    module_id: "cost",
    report_id: REPORT.report_id,
    scope_id: REPORT.scope_id,
    report_revision: CURRENT_REVISION,
    generated_at: "2026-08-24T18:00:00+08:00",
    generator: { id: "taskprogress-cost-analyzer", version: "0.1" },
    data: { summary: {} },
    ...overrides,
  };
}

// --- manifest schema (JSON Schema file, checked for shape rather than parsed
// with a validator library — the project has none, matching report.schema.json's
// own hand-written-JS-plus-Schema-file split). ---

test("the manifest schema fixes descriptor fields and the v0.1 constants", async () => {
  const schema = JSON.parse(
    await readFile(new URL("../schemas/report.modules.schema.json", import.meta.url), "utf8"),
  );
  assert.equal(schema.properties.schema_version.const, "0.1");
  assert.deepEqual(
    Object.keys(schema.$defs.moduleDescriptor.properties),
    ["id", "type", "source", "optional", "visibility"],
  );
  assert.equal(schema.$defs.moduleDescriptor.additionalProperties, false);
  assert.equal(schema.$defs.moduleDescriptor.properties.optional.const, true);
  assert.deepEqual(schema.$defs.moduleDescriptor.properties.visibility.enum, ["public", "developer", "local"]);
});

test("the envelope schema names the common fields and leaves data open", async () => {
  const schema = JSON.parse(
    await readFile(new URL("../schemas/module-envelope.schema.json", import.meta.url), "utf8"),
  );
  const envelope = schema.$defs.envelope;
  assert.deepEqual(envelope.required, [
    "module_type", "schema_version", "module_id", "report_id", "scope_id", "generated_at", "generator", "data",
  ]);
  assert.equal(envelope.properties.data.type, "object");
  assert.equal(schema.$defs.reportRevision.pattern, "^sha256:[0-9a-f]{64}$");
});

// --- version negotiation ---

test("every reader asks the same list which manifest versions are live", () => {
  assert.deepEqual(SUPPORTED_MANIFEST_SCHEMA_VERSIONS, ["0.1"]);
  assert.equal(isSupportedManifestSchemaVersion("0.1"), true);
  assert.equal(isSupportedManifestSchemaVersion("0.2"), false);
  assert.equal(isSupportedManifestSchemaVersion(undefined), false);
});

// --- safe source resolver (path restriction) ---

test("module source accepts a same-origin relative JSON path and rejects escape attempts", () => {
  assert.equal(isSafeModuleSource("cost.analysis.json"), true);
  assert.equal(isSafeModuleSource("modules/cost.analysis.json"), true);
  assert.equal(resolveModuleSource("cost.analysis.json"), "cost.analysis.json");

  for (const unsafe of [
    "../cost.analysis.json",
    "/cost.analysis.json",
    "cost.analysis.json?x=1",
    "cost.analysis.json#frag",
    "cost%2eanalysis.json",
    "cost\\analysis.json",
    "cost.analysis.js",
    "",
  ]) {
    assert.equal(isSafeModuleSource(unsafe), false, unsafe);
    assert.throws(() => resolveModuleSource(unsafe), /module source/u, unsafe);
  }
});

// --- manifest validation ---

test("a valid manifest returns no errors and one normalized descriptor", () => {
  const { errors, descriptors } = validateModuleManifest(manifestFor(), REPORT);
  assert.deepEqual(errors, []);
  assert.deepEqual(descriptors, [
    { id: "cost", type: "taskprogress.cost", source: "cost.analysis.json", optional: true, visibility: "local" },
  ]);
  assert.equal(Object.isFrozen(descriptors), true);
});

test("an invalid manifest drops every descriptor, not just the bad one", () => {
  const manifest = manifestFor();
  manifest.modules.push({ ...manifest.modules[0], id: "cost-2" }); // duplicate type
  const { errors, descriptors } = validateModuleManifest(manifest, REPORT);
  assert.deepEqual(descriptors, []);
  assert.equal(errors.some((error) => error.code === "duplicate_module_type"), true);
});

test("manifest identity must match the report it sits beside", () => {
  const { errors } = validateModuleManifest({ ...manifestFor(), scope_id: "another-scope" }, REPORT);
  assert.equal(errors.some((error) => error.code === "identity_mismatch" && error.path === "scope_id"), true);
});

test("an unsupported manifest schema_version is rejected", () => {
  const { errors } = validateModuleManifest({ ...manifestFor(), schema_version: "1.0" }, REPORT);
  assert.equal(errors.some((error) => error.code === "unsupported_schema_version"), true);
});

test("a descriptor may not carry an executable or unknown field", () => {
  const manifest = manifestFor();
  manifest.modules[0].script = "untrusted.js";
  const { errors } = validateModuleManifest(manifest, REPORT);
  assert.equal(errors.some((error) => error.code === "unexpected_field" && error.path.endsWith(".script")), true);
});

test("descriptor.optional must be exactly true and visibility must be a known category", () => {
  const optionalFalse = manifestFor();
  optionalFalse.modules[0].optional = false;
  assert.equal(
    validateModuleManifest(optionalFalse, REPORT).errors.some((error) => error.code === "unsupported_optional_value"),
    true,
  );

  const badVisibility = manifestFor();
  badVisibility.modules[0].visibility = "secret";
  assert.equal(
    validateModuleManifest(badVisibility, REPORT).errors.some((error) => error.code === "invalid_visibility"),
    true,
  );
});

test("duplicate module id is rejected even when types differ", () => {
  const manifest = manifestFor();
  manifest.modules.push({
    id: "cost", type: "taskprogress.cost.replacement", source: "cost.replacement.json", optional: true, visibility: "local",
  });
  const { errors } = validateModuleManifest(manifest, REPORT);
  assert.equal(errors.some((error) => error.code === "duplicate_module_id"), true);
});

// --- envelope validation ---

test("a valid envelope returns no errors", () => {
  const errors = validateModuleEnvelope(envelopeFor(), {
    report: REPORT,
    descriptor: manifestFor().modules[0],
    supportedDataSchemaVersions: ["0.1"],
  });
  assert.deepEqual(errors, []);
});

test("envelope module_type must match its manifest descriptor", () => {
  const errors = validateModuleEnvelope(envelopeFor({ module_type: "taskprogress.time" }), {
    report: REPORT,
    descriptor: manifestFor().modules[0],
    supportedDataSchemaVersions: ["0.1"],
  });
  assert.equal(errors.some((error) => error.code === "type_mismatch"), true);
});

test("envelope identity (report_id/scope_id/module_id) must match", () => {
  const descriptor = manifestFor().modules[0];
  for (const [field, value] of [["report_id", "other-report"], ["scope_id", "other-scope"], ["module_id", "other-id"]]) {
    const errors = validateModuleEnvelope(envelopeFor({ [field]: value }), {
      report: REPORT, descriptor, supportedDataSchemaVersions: ["0.1"],
    });
    assert.equal(errors.some((error) => error.code === "identity_mismatch" && error.path === field), true, field);
  }
});

test("an unsupported data schema_version is rejected even when the type is installed", () => {
  const errors = validateModuleEnvelope(envelopeFor({ schema_version: "9.9" }), {
    report: REPORT,
    descriptor: manifestFor().modules[0],
    supportedDataSchemaVersions: ["0.1"],
  });
  assert.equal(errors.some((error) => error.code === "unsupported_schema_version"), true);
});

test("report_revision, generated_at, generator and data are each checked", () => {
  const descriptor = manifestFor().modules[0];
  const context = { report: REPORT, descriptor, supportedDataSchemaVersions: ["0.1"] };
  assert.equal(
    validateModuleEnvelope(envelopeFor({ report_revision: "not-a-hash" }), context)
      .some((error) => error.code === "invalid_report_revision"),
    true,
  );
  assert.equal(
    validateModuleEnvelope(envelopeFor({ generated_at: "not-a-date" }), context)
      .some((error) => error.code === "invalid_timestamp"),
    true,
  );
  assert.equal(
    validateModuleEnvelope(envelopeFor({ generator: { id: "x" } }), context)
      .some((error) => error.code === "invalid_generator"),
    true,
  );
  assert.equal(
    validateModuleEnvelope(envelopeFor({ data: "not-an-object" }), context)
      .some((error) => error.code === "invalid_data"),
    true,
  );
});

// --- freshness / stale policy ---

test("freshness is current, unknown, or stale — never guessed as current", () => {
  assert.equal(
    evaluateProjectionFreshness({ envelope: envelopeFor(), currentReportRevision: CURRENT_REVISION }),
    PROJECTION_FRESHNESS.current,
  );
  assert.equal(
    evaluateProjectionFreshness({ envelope: envelopeFor({ report_revision: undefined }), currentReportRevision: CURRENT_REVISION }),
    PROJECTION_FRESHNESS.unknown,
  );
  assert.equal(
    evaluateProjectionFreshness({ envelope: envelopeFor({ report_revision: OTHER_REVISION }), currentReportRevision: CURRENT_REVISION }),
    PROJECTION_FRESHNESS.stale,
  );
});

// --- subject index (project/task/item pairing, orphan diagnostics) ---

test("subject refs match by stable id, project-level always matches, and legacy string items cannot be subjects", () => {
  const index = createSubjectIndex(REPORT, [
    { level: "project" },
    { level: "task", task_id: "extension-module-phase1" },
    { level: "item", task_id: "extension-module-phase1", item_id: "manifest-schema" },
    { level: "task", task_id: "no-such-task" },
    { level: "item", task_id: "extension-module-phase1", item_id: "no-such-item" },
  ]);
  assert.deepEqual(index.tasks, ["extension-module-phase1"]);
  assert.deepEqual(index.items, ["extension-module-phase1/manifest-schema"]);
  assert.equal(index.orphans.length, 2);
  assert.deepEqual(index.orphans.map((entry) => entry.reason), ["unknown_task", "unknown_item"]);
});

test("one orphan does not discard the subjects that did resolve", () => {
  const index = createSubjectIndex(REPORT, [
    { level: "item", task_id: "extension-module-phase1", item_id: "manifest-schema" },
    { level: "item", task_id: "extension-module-phase1", item_id: "ghost" },
  ]);
  assert.deepEqual(index.items, ["extension-module-phase1/manifest-schema"]);
  assert.equal(index.orphans.length, 1);
});

// --- loadReportModules: full orchestration, isolation, partial failure ---

test("no manifest means the base report loads with zero module noise", () => {
  const result = loadReportModules({ report: REPORT, manifest: null, currentReportRevision: CURRENT_REVISION });
  assert.deepEqual(result, { manifestErrors: [], modules: [] });
});

test("an invalid manifest surfaces its errors and loads no module", () => {
  const result = loadReportModules({
    report: REPORT,
    manifest: { ...manifestFor(), scope_id: "wrong" },
    currentReportRevision: CURRENT_REVISION,
  });
  assert.equal(result.modules.length, 0);
  assert.equal(result.manifestErrors.some((error) => error.code === "identity_mismatch"), true);
});

test("an unknown module type is isolated with its own diagnostic", () => {
  const result = loadReportModules({
    report: REPORT,
    manifest: manifestFor(),
    currentReportRevision: CURRENT_REVISION,
    artifacts: new Map([["cost.analysis.json", envelopeFor()]]),
    registrySupportedVersions: new Map(), // taskprogress.cost not installed
  });
  assert.equal(result.modules[0].status, "unsupported_type");
  assert.equal(result.modules[0].errors[0].code, "unknown_module_type");
});

test("a missing sidecar is unavailable, not a thrown error", () => {
  const result = loadReportModules({
    report: REPORT,
    manifest: manifestFor(),
    currentReportRevision: CURRENT_REVISION,
    artifacts: new Map(), // cost.analysis.json not supplied
    registrySupportedVersions: new Map([["taskprogress.cost", ["0.1"]]]),
  });
  assert.equal(result.modules[0].status, "unavailable");
  assert.equal(result.modules[0].errors[0].code, "module_unavailable");
});

test("an identity-mismatched envelope is invalid and isolated", () => {
  const result = loadReportModules({
    report: REPORT,
    manifest: manifestFor(),
    currentReportRevision: CURRENT_REVISION,
    artifacts: new Map([["cost.analysis.json", envelopeFor({ scope_id: "wrong" })]]),
    registrySupportedVersions: new Map([["taskprogress.cost", ["0.1"]]]),
  });
  assert.equal(result.modules[0].status, "invalid");
  assert.equal(result.modules[0].errors.some((error) => error.code === "identity_mismatch"), true);
});

test("a stale projection still loads, tagged stale rather than dropped", () => {
  const result = loadReportModules({
    report: REPORT,
    manifest: manifestFor(),
    currentReportRevision: CURRENT_REVISION,
    artifacts: new Map([["cost.analysis.json", envelopeFor({ report_revision: OTHER_REVISION })]]),
    registrySupportedVersions: new Map([["taskprogress.cost", ["0.1"]]]),
  });
  assert.equal(result.modules[0].status, "loaded");
  assert.equal(result.modules[0].freshness, PROJECTION_FRESHNESS.stale);
});

test("one module's failure does not stop a second, valid module from loading", () => {
  const manifest = manifestFor();
  manifest.modules.push({
    id: "time", type: "taskprogress.time", source: "time.analysis.json", optional: true, visibility: "local",
  });
  const timeEnvelope = envelopeFor({
    module_type: "taskprogress.time",
    module_id: "time",
    data: { summary: { total_estimated_minutes: 2640 } },
  });
  const result = loadReportModules({
    report: REPORT,
    manifest,
    currentReportRevision: CURRENT_REVISION,
    artifacts: new Map([
      ["cost.analysis.json", envelopeFor({ scope_id: "wrong" })], // invalid
      ["time.analysis.json", timeEnvelope], // valid
    ]),
    registrySupportedVersions: new Map([
      ["taskprogress.cost", ["0.1"]],
      ["taskprogress.time", ["0.1"]],
    ]),
  });
  assert.equal(result.modules.length, 2);
  assert.equal(result.modules[0].status, "invalid");
  assert.equal(result.modules[1].status, "loaded");
  assert.equal(result.modules[1].freshness, PROJECTION_FRESHNESS.current);
});

// --- diagnostic code table completeness ---

test("every diagnostic code this file can emit is named in the table", async () => {
  const source = await readFile(new URL("../viewer/assets/module-model.js", import.meta.url), "utf8");
  const emitted = new Set([...source.matchAll(/issue\(\s*"([a-z_]+)"/gu)].map((match) => match[1]));
  for (const code of emitted) {
    assert.ok(Object.hasOwn(MODULE_DIAGNOSTIC_CODES, code), `未登記的診斷代碼：${code}`);
  }
});
