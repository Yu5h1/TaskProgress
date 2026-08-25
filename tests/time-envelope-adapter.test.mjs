// The legacy→envelope read-time adapter, and the scope-only identity binding
// it depends on. The assertions that matter most here are the refusals: that
// report_id is never manufactured, that as_of/method are not silently
// promoted into generated_at/generator, and that an adapted envelope still
// satisfies the real validator rather than a relaxed copy of it.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  IDENTITY_BINDINGS,
  validateModuleEnvelope,
} from "../viewer/assets/module-model.js";
import {
  DEFAULT_TIME_MODULE_ID,
  LEGACY_TIME_SOURCE_FORMAT,
  TIME_ENVELOPE_ADAPTER,
  TIME_MODULE_TYPE,
  adaptLegacyTimeAnalysis,
} from "../viewer/assets/time-envelope-adapter.js";
import { inspectTimeAnalysis } from "../viewer/assets/time-model.js";

const REPORT = Object.freeze({ report_id: "task-progress-development", scope_id: "task-progress" });

const DESCRIPTOR = Object.freeze({
  id: "time",
  type: "taskprogress.time",
  source: "time.analysis.json",
  optional: true,
  visibility: "local",
});

function legacyAnalysis(overrides = {}) {
  return {
    schema_version: "0.2",
    scope_id: "task-progress",
    analysis_id: "analysis-20260824-184941",
    as_of: "2026-08-25T10:29:27+08:00",
    method: { name: "deterministic-capacity-feasibility", version: "0.3" },
    inputs: { config_updated_at: "2026-08-24T18:49:41.721Z" },
    summary: {
      executor_count: 1,
      nominal_daily_capacity_minutes: 480,
      total_estimated_minutes: 53760,
      calibrated_total_minutes: 53760,
      remaining_estimated_minutes: 5280,
      execution_calibration: { factor: 1 },
    },
    tasks: [],
    ...overrides,
  };
}

// --- lifting the envelope roots ---

test("the envelope carries module identity the source never had, and the scope_id it did", () => {
  const { envelope } = adaptLegacyTimeAnalysis(legacyAnalysis());
  assert.equal(envelope.module_type, TIME_MODULE_TYPE);
  assert.equal(envelope.module_id, DEFAULT_TIME_MODULE_ID);
  assert.equal(envelope.scope_id, "task-progress");
});

test("module_id comes from the manifest descriptor when one names it", () => {
  const { envelope } = adaptLegacyTimeAnalysis(legacyAnalysis(), { moduleId: "time-primary" });
  assert.equal(envelope.module_id, "time-primary");
});

test("schema_version passes through untranslated — same meaning on both sides", () => {
  const { envelope } = adaptLegacyTimeAnalysis(legacyAnalysis());
  assert.equal(envelope.schema_version, "0.2");
});

// --- the two refusals the design turns on ---

test("report_id is never manufactured, not even though report.json has one", () => {
  const { envelope, provenance } = adaptLegacyTimeAnalysis(legacyAnalysis());
  assert.equal("report_id" in envelope, false);
  assert.equal(provenance.identity_binding, "scope-only");
  assert.ok(provenance.fields_unavailable.includes("report_id"));
});

test("report_revision stays absent, so freshness can only be reported as unknown", () => {
  const { envelope, provenance } = adaptLegacyTimeAnalysis(legacyAnalysis());
  assert.equal("report_revision" in envelope, false);
  assert.ok(provenance.fields_unavailable.includes("report_revision"));
});

test("generator identifies the adapter, and method is left alone inside data", () => {
  const { envelope } = adaptLegacyTimeAnalysis(legacyAnalysis());
  assert.deepEqual(envelope.generator, { ...TIME_ENVELOPE_ADAPTER });
  // The algorithm identity must not have been promoted into generator.
  assert.notEqual(envelope.generator.id, "deterministic-capacity-feasibility");
  assert.deepEqual(envelope.data.method, { name: "deterministic-capacity-feasibility", version: "0.3" });
});

test("generated_at is taken from as_of but recorded as an approximation, with as_of authoritative in data", () => {
  const { envelope, provenance } = adaptLegacyTimeAnalysis(legacyAnalysis());
  assert.equal(envelope.generated_at, "2026-08-25T10:29:27+08:00");
  assert.equal(envelope.data.as_of, "2026-08-25T10:29:27+08:00");
  const note = provenance.fields_approximated.find((entry) => entry.field === "generated_at");
  assert.equal(note.from, "as_of");
  assert.match(note.reason, /as_of/);
});

// --- data stays a faithful, independently-validatable copy ---

test("data is the legacy document verbatim, so the existing Time domain validator still accepts it", () => {
  const legacy = legacyAnalysis();
  const { envelope } = adaptLegacyTimeAnalysis(legacy);
  assert.deepEqual(envelope.data, legacy);
  // schema_version/scope_id are lifted to envelope roots AND kept in data on
  // purpose: inspectTimeAnalysis reads both, so stripping them would leave
  // data unvalidatable by the one function built to validate it.
  assert.equal(envelope.data.schema_version, "0.2");
  assert.equal(envelope.data.scope_id, "task-progress");
  assert.deepEqual(inspectTimeAnalysis(envelope.data, REPORT.scope_id).errors, []);
});

// --- the adapted envelope must satisfy the real validator ---

test("an adapted envelope passes validateModuleEnvelope under scope-only binding", () => {
  const { envelope } = adaptLegacyTimeAnalysis(legacyAnalysis());
  const errors = validateModuleEnvelope(envelope, {
    report: REPORT,
    descriptor: DESCRIPTOR,
    supportedDataSchemaVersions: ["0.2"],
    identityBinding: "scope-only",
  });
  assert.deepEqual(errors, []);
});

test("the same envelope is rejected under full binding — it genuinely lacks report_id", () => {
  const { envelope } = adaptLegacyTimeAnalysis(legacyAnalysis());
  const errors = validateModuleEnvelope(envelope, {
    report: REPORT,
    descriptor: DESCRIPTOR,
    supportedDataSchemaVersions: ["0.2"],
  });
  assert.equal(errors.some((error) => error.code === "identity_mismatch" && error.path === "report_id"), true);
});

test("a scope_id that disagrees with the report still fails under scope-only binding", () => {
  const { envelope } = adaptLegacyTimeAnalysis(legacyAnalysis({ scope_id: "another-scope" }));
  const errors = validateModuleEnvelope(envelope, {
    report: REPORT,
    descriptor: DESCRIPTOR,
    supportedDataSchemaVersions: ["0.2"],
    identityBinding: "scope-only",
  });
  assert.equal(errors.some((error) => error.code === "identity_mismatch" && error.path === "scope_id"), true);
});

// --- scope-only must not become a way to smuggle an unverified report_id ---

test("scope-only rejects an envelope that does carry report_id, rather than ignoring it", () => {
  const { envelope } = adaptLegacyTimeAnalysis(legacyAnalysis());
  const smuggled = { ...envelope, report_id: REPORT.report_id };
  const errors = validateModuleEnvelope(smuggled, {
    report: REPORT,
    descriptor: DESCRIPTOR,
    supportedDataSchemaVersions: ["0.2"],
    identityBinding: "scope-only",
  });
  assert.equal(errors.some((error) => error.code === "identity_mismatch" && error.path === "report_id"), true);
});

test("full binding stays the default, and an unknown binding throws rather than silently relaxing", () => {
  assert.deepEqual(IDENTITY_BINDINGS, ["full", "scope-only"]);
  assert.throws(
    () => validateModuleEnvelope({}, { report: REPORT, descriptor: DESCRIPTOR, identityBinding: "none" }),
    /identityBinding/u,
  );
});

// --- provenance shape and isolation ---

test("provenance names the source format, the adapter, and what it had to supply", () => {
  const { provenance } = adaptLegacyTimeAnalysis(legacyAnalysis());
  assert.equal(provenance.adapted, true);
  assert.equal(provenance.source_format, LEGACY_TIME_SOURCE_FORMAT);
  assert.deepEqual(provenance.adapter, { ...TIME_ENVELOPE_ADAPTER });
  for (const field of ["module_type", "module_id", "generator"]) {
    assert.ok(provenance.fields_supplied_by_adapter.includes(field), field);
  }
  assert.equal(provenance.notes.length > 0, true);
});

test("provenance is not folded into the envelope, so the shared contract stays unwidened", () => {
  const { envelope } = adaptLegacyTimeAnalysis(legacyAnalysis());
  assert.deepEqual(
    Object.keys(envelope).sort(),
    ["data", "generated_at", "generator", "module_id", "module_type", "schema_version", "scope_id"],
  );
});

test("a non-object input is refused instead of producing a hollow envelope", () => {
  for (const bad of [null, undefined, "x", 42, []]) {
    assert.throws(() => adaptLegacyTimeAnalysis(bad), /time\.analysis\.json/u);
  }
});

// --- isolation ---

test("the adapter stays a pure transform: no DOM, no fetch, no clock", async () => {
  const source = await readFile(new URL("../viewer/assets/time-envelope-adapter.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /document\.|window\.|fetch\(|Date\.now\(|new Date\(/u);
});

test("nothing in production imports the adapter yet", async () => {
  const appSource = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.doesNotMatch(appSource, /time-envelope-adapter\.js/u);
});
