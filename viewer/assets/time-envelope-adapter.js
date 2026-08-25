/*
 * Read-time adapter: legacy Draft 0.2 `time.analysis.json` → common module
 * envelope (Documentation/ExtensionModuleArchitecturePlan.md#legacy-sidecar-的-envelope-轉接2026-08-25-使用者決策).
 *
 * The manifest's `source` points at the existing flat sidecar, which predates
 * the common envelope and carries none of its root fields. The settled
 * direction is to adapt on read rather than change what the analyzer writes:
 * the file on disk, public reports, and every existing reader stay untouched,
 * and the wrapping happens in memory here.
 *
 * Pure transform — no I/O, no DOM, no clock. Give it an already-parsed legacy
 * object, get back an envelope plus a description of what the adaptation had
 * to invent or approximate.
 *
 * Two things this deliberately does NOT do, both load-bearing:
 *
 *   1. It never fills `report_id` from the report. Envelope validation exists
 *      to compare a sidecar's identity against the report; a value copied
 *      from the comparison target makes that check tautological — it looks
 *      verified while proving nothing. Legacy Time's real identity binding
 *      reaches scope level only (`scope_id`, which the source does carry and
 *      `inspectTimeAnalysis` already checks), so the envelope is emitted with
 *      `identityBinding: "scope-only"` and the diagnostics say as much.
 *   2. It never conflates `as_of` with `generated_at`, or `method` with
 *      `generator` — see the notes on each below.
 */

export const TIME_MODULE_TYPE = "taskprogress.time";
export const DEFAULT_TIME_MODULE_ID = "time";
export const LEGACY_TIME_SOURCE_FORMAT = "time.analysis.draft-0.2-flat";

/*
 * Under read-time adaptation this envelope really is produced here, not by
 * the analyzer, so `generator` says so honestly. The analyzer's own algorithm
 * identity (`method`) stays untouched inside `data`, where it belongs.
 */
export const TIME_ENVELOPE_ADAPTER = Object.freeze({
  id: "taskprogress-time-legacy-envelope-adapter",
  version: "0.1",
});

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/*
 * `data` is the legacy document verbatim, including the `schema_version` and
 * `scope_id` that also get lifted to envelope roots. The duplication is
 * deliberate: `inspectTimeAnalysis` — the Time domain validator that already
 * exists and is already trusted — reads both of those fields, so stripping
 * them to avoid repeating a value would leave `data` unvalidatable by the one
 * function built to validate it. Domain content is not rewritten or trimmed.
 */
export function adaptLegacyTimeAnalysis(legacy, { moduleId = DEFAULT_TIME_MODULE_ID } = {}) {
  if (!isObject(legacy)) {
    throw new TypeError("adaptLegacyTimeAnalysis 需要已解析的 time.analysis.json 物件。");
  }

  const suppliedByAdapter = ["module_type", "module_id", "generator"];
  const approximated = [];
  const unavailable = ["report_id", "report_revision"];

  const envelope = {
    module_type: TIME_MODULE_TYPE,
    module_id: moduleId,
    // Same meaning on both sides: the data contract version for this module
    // type. Passed through rather than translated.
    schema_version: legacy.schema_version,
    // The one identity the source genuinely carries and that can be checked
    // against report.json.
    scope_id: legacy.scope_id,
    generator: { ...TIME_ENVELOPE_ADAPTER },
    data: legacy,
  };

  /*
   * `as_of` is the analysis clock — `analyze --as-of <ISO>` pins it so a run
   * reproduces — while `generated_at` means when the projection was produced.
   * They genuinely differ whenever --as-of is used, so this is an
   * approximation, recorded as one. `data.as_of` remains the authoritative
   * value.
   */
  if (typeof legacy.as_of === "string") {
    envelope.generated_at = legacy.as_of;
    approximated.push({
      field: "generated_at",
      from: "as_of",
      reason: "來源沒有投影產生時間；as_of 是分析基準時鐘，使用 analyze --as-of 時兩者不同。權威值仍在 data.as_of。",
    });
  }

  const provenance = Object.freeze({
    adapted: true,
    source_format: LEGACY_TIME_SOURCE_FORMAT,
    adapter: { ...TIME_ENVELOPE_ADAPTER },
    identity_binding: "scope-only",
    fields_supplied_by_adapter: Object.freeze(suppliedByAdapter),
    fields_approximated: Object.freeze(approximated.map((entry) => Object.freeze(entry))),
    fields_unavailable: Object.freeze(unavailable),
    notes: Object.freeze([
      "identity 只驗證到 scope 層級：來源沒有 report_id，且不得由 report.json 補上。",
      "沒有 report_revision，投影新鮮度為 freshness_unknown，不得宣稱已驗證為最新。",
      "method（演算法身分）保留在 data 內，未當作 generator（工具身分）使用。",
    ]),
  });

  return { envelope, provenance };
}
