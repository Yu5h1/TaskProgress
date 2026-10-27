/*
 * Manifest-driven Time discovery: the other half of the pair whose legacy
 * side is `time-legacy-discovery.js`
 * (Documentation/ExtensionModuleArchitecturePlan.md#phase-2viewer-registry-與-time-遷移).
 *
 * Where the legacy path finds `time.analysis.json` by its known filename,
 * this path reads an optional `report.modules.json`, finds the descriptor
 * declaring `taskprogress.time`, fetches whatever `source` it names, and runs
 * the sidecar through the read-time envelope adapter before validating it as
 * a common envelope. Both paths converge on the same Time domain object, so
 * neither owns a second copy of Time's semantics.
 *
 * Selection between the two is the caller's job, not this file's, and the
 * rule is the architecture plan's: a manifest, when present, is the only
 * discovery source — legacy filename discovery does not also run, so one
 * sidecar can never be loaded or displayed twice.
 *
 * Pure apart from the injected `fetchJson`: no DOM, no filename assumptions
 * beyond the manifest's own fixed name.
 */
import {
  evaluateProjectionFreshness,
  validateModuleManifest,
  validateModuleEnvelope,
} from "./module-model.js";
import { TIME_MODULE_TYPE, adaptLegacyTimeAnalysis } from "./time-envelope-adapter.js";
import { inspectTimeAnalysis } from "./time-model.js";

export const MODULE_MANIFEST_FILENAME = "report.modules.json";

/*
 * Time's own data contract versions, as carried by the sidecar's
 * `schema_version`. Draft 0.2 is the only shipped one; this list is what a
 * future Time schema bump extends, and what makes an unknown version a
 * clean per-module diagnostic instead of a crash.
 */
export const SUPPORTED_TIME_DATA_VERSIONS = Object.freeze(["0.2"]);

function warning(message) {
  return { level: "warning", message };
}

/*
 * Returns the same `{ timeAnalysis, diagnostics }` shape the legacy path
 * returns, plus `handled` — whether a manifest existed and therefore claimed
 * discovery. `handled: false` means no manifest was found and the caller
 * should fall back to legacy filename discovery; it is not an error.
 *
 * `provenance` and `freshness` are reported for diagnostics but deliberately
 * do not gate rendering here: a `freshness_unknown` legacy projection is
 * exactly what every adapted Time sidecar produces today, and treating that
 * as a failure would make the manifest path strictly worse than the legacy
 * one it is meant to match.
 */
export async function loadManifestTimeAnalysis({
  report, reportSource, baseUrl, fetchJson, currentReportRevision = null,
}) {
  const diagnostics = [];
  const manifestUrl = new URL(MODULE_MANIFEST_FILENAME, new URL(reportSource, baseUrl));

  let manifest = null;
  try {
    manifest = await fetchJson(manifestUrl);
  } catch (error) {
    // A manifest that exists but cannot be read is not the same as no
    // manifest: falling back to legacy discovery would silently ignore a
    // declaration the report author made on purpose.
    return {
      handled: true,
      timeAnalysis: null,
      provenance: null,
      freshness: null,
      diagnostics: [warning(
        error instanceof Error
          ? `${MODULE_MANIFEST_FILENAME} 已忽略：${error.message}`
          : `${MODULE_MANIFEST_FILENAME} 無法載入。`,
      )],
    };
  }

  if (manifest === null || manifest === undefined) {
    return { handled: false, timeAnalysis: null, provenance: null, freshness: null, diagnostics };
  }

  const { errors: manifestErrors, descriptors } = validateModuleManifest(manifest, report);
  if (manifestErrors.length > 0) {
    // Phase 0's rule: an invalid manifest drops every declared module rather
    // than salvaging the ones that happen to look fine.
    return {
      handled: true,
      timeAnalysis: null,
      provenance: null,
      freshness: null,
      diagnostics: [warning(
        `${MODULE_MANIFEST_FILENAME} 已忽略：${manifestErrors.map((error) => error.message).join("；")}`,
      )],
    };
  }

  const descriptor = descriptors.find((entry) => entry.type === TIME_MODULE_TYPE);
  if (!descriptor) {
    // A valid manifest that simply does not declare Time. Still `handled`:
    // the manifest is the discovery source, and it says there is no Time.
    return { handled: true, timeAnalysis: null, provenance: null, freshness: null, diagnostics };
  }

  let sidecar = null;
  try {
    sidecar = await fetchJson(new URL(descriptor.source, new URL(reportSource, baseUrl)));
  } catch (error) {
    return {
      handled: true,
      timeAnalysis: null,
      provenance: null,
      freshness: null,
      diagnostics: [warning(
        error instanceof Error
          ? `時間模組已忽略：${error.message}`
          : "時間模組無法載入。",
      )],
    };
  }

  if (sidecar === null || sidecar === undefined) {
    return {
      handled: true,
      timeAnalysis: null,
      provenance: null,
      freshness: null,
      diagnostics: [warning(`時間模組已忽略：找不到 ${descriptor.source}。`)],
    };
  }

  const { envelope, provenance } = adaptLegacyTimeAnalysis(sidecar, { moduleId: descriptor.id });
  const envelopeErrors = validateModuleEnvelope(envelope, {
    report,
    descriptor,
    supportedDataSchemaVersions: SUPPORTED_TIME_DATA_VERSIONS,
    identityBinding: provenance.identity_binding,
  });
  if (envelopeErrors.length > 0) {
    return {
      handled: true,
      timeAnalysis: null,
      provenance,
      freshness: null,
      diagnostics: [warning(
        `時間模組已忽略：${envelopeErrors.map((error) => error.message).join("；")}`,
      )],
    };
  }

  // Domain validation on top of a clean envelope, reusing the one Time
  // validator both paths share rather than a manifest-specific copy.
  const status = inspectTimeAnalysis(envelope.data, report.scope_id);
  if (status.errors.length) {
    return {
      handled: true,
      timeAnalysis: null,
      provenance,
      freshness: null,
      diagnostics: [warning(`時間模組已忽略：${status.errors.join("；")}`)],
    };
  }

  const timeAnalysis = JSON.parse(JSON.stringify(envelope.data));
  if (!status.deadlineAvailable) {
    delete timeAnalysis.summary.deadline;
  }
  if (status.deadlineErrors.length) {
    diagnostics.push(warning(`期限分析已忽略：${status.deadlineErrors.join("；")}`));
  }

  const freshness = currentReportRevision
    ? evaluateProjectionFreshness({ envelope, currentReportRevision })
    : null;

  return { handled: true, timeAnalysis, provenance, freshness, diagnostics };
}
