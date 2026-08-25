/*
 * Manifest-driven Cost discovery and loading — the second module's proof
 * that the shared contract generalizes (Documentation/CostEstimationModulePlan.md,
 * Documentation/ExtensionModuleArchitecturePlan.md#第二個驗證模組cost). Unlike
 * Time, Cost has no legacy format to adapt: it natively emits the common
 * envelope, so this is the first production caller of Phase 1's
 * `validateModuleEnvelope` against a real (not fixture) sidecar, and the
 * first real use of `createSubjectIndex` for a domain other than Time's.
 *
 * Structurally this mirrors `time-manifest-discovery.js` — same manifest
 * file, same descriptor lookup, same "a present-but-broken manifest still
 * claims discovery" rule — but it does not share that file's fetch of
 * `report.modules.json`. Each module currently re-fetches and re-validates
 * the manifest independently; that duplicate fetch is a known, deliberate
 * trade rather than an oversight (see the handoff note this shipped with),
 * accepted so proving Cost's discovery does not require re-touching Time's
 * already-verified path in the same change.
 *
 * Pure apart from the injected `fetchJson`.
 */
import {
  evaluateProjectionFreshness,
  validateModuleEnvelope,
  validateModuleManifest,
} from "./module-model.js";
import { costSubjectIndex, validateCostData } from "./cost-model.js";
import { MODULE_MANIFEST_FILENAME } from "./time-manifest-discovery.js";

export const COST_MODULE_TYPE = "taskprogress.cost";

/*
 * Cost's own data-contract versions, as carried by the sidecar's
 * `schema_version`. `0.1` is the only shipped one, matching
 * CostEstimationModulePlan.md's `estimated`-only slice.
 */
export const SUPPORTED_COST_DATA_VERSIONS = Object.freeze(["0.1"]);

function warning(message) {
  return { level: "warning", message };
}

function unresolved(diagnostics) {
  return { handled: true, data: null, freshness: null, orphanTaskIds: [], diagnostics };
}

/*
 * Returns `{ handled, data, freshness, orphanTaskIds, diagnostics }`.
 * `handled: false` means no manifest was found at all — there is nothing to
 * report, Cost simply is not declared for this scope. `handled: true` with
 * `data: null` means a manifest existed but Cost could not be loaded from it
 * (invalid manifest, no Cost descriptor, missing/invalid sidecar) — always
 * with a diagnostic explaining which, never a silent gap.
 */
export async function loadCostModule({
  report, reportSource, baseUrl, fetchJson, currentReportRevision = null,
}) {
  const manifestUrl = new URL(MODULE_MANIFEST_FILENAME, new URL(reportSource, baseUrl));

  let manifest;
  try {
    manifest = await fetchJson(manifestUrl);
  } catch (error) {
    return unresolved([warning(
      error instanceof Error
        ? `${MODULE_MANIFEST_FILENAME} 已忽略：${error.message}`
        : `${MODULE_MANIFEST_FILENAME} 無法載入。`,
    )]);
  }
  if (manifest === null || manifest === undefined) {
    return { handled: false, data: null, freshness: null, orphanTaskIds: [], diagnostics: [] };
  }

  const { errors: manifestErrors, descriptors } = validateModuleManifest(manifest, report);
  if (manifestErrors.length > 0) {
    return unresolved([warning(
      `${MODULE_MANIFEST_FILENAME} 已忽略：${manifestErrors.map((error) => error.message).join("；")}`,
    )]);
  }

  const descriptor = descriptors.find((entry) => entry.type === COST_MODULE_TYPE);
  if (!descriptor) {
    return { handled: true, data: null, freshness: null, orphanTaskIds: [], diagnostics: [] };
  }

  let envelope;
  try {
    envelope = await fetchJson(new URL(descriptor.source, new URL(reportSource, baseUrl)));
  } catch (error) {
    return unresolved([warning(
      error instanceof Error ? `成本模組已忽略：${error.message}` : "成本模組無法載入。",
    )]);
  }
  if (envelope === null || envelope === undefined) {
    return unresolved([warning(`成本模組已忽略：找不到 ${descriptor.source}。`)]);
  }

  // Cost natively emits the envelope, so this is the direct full-identity
  // check — no scope-only relaxation, unlike Time's adapted legacy sidecar.
  const envelopeErrors = validateModuleEnvelope(envelope, {
    report,
    descriptor,
    supportedDataSchemaVersions: SUPPORTED_COST_DATA_VERSIONS,
  });
  if (envelopeErrors.length > 0) {
    return unresolved([warning(`成本模組已忽略：${envelopeErrors.map((error) => error.message).join("；")}`)]);
  }

  const { errors: dataErrors, taskIds } = validateCostData(envelope.data);
  if (dataErrors.length > 0) {
    return unresolved([warning(`成本模組已忽略：${dataErrors.join("；")}`)]);
  }

  const subjectIndex = costSubjectIndex(report, taskIds);
  const diagnostics = subjectIndex.orphans.map(
    (orphan) => warning(`成本模組：task_id「${orphan.task_id}」在 report 中找不到，已略過該筆估算。`),
  );

  const freshness = currentReportRevision
    ? evaluateProjectionFreshness({ envelope, currentReportRevision })
    : null;

  return {
    handled: true,
    data: JSON.parse(JSON.stringify(envelope.data)),
    freshness,
    orphanTaskIds: subjectIndex.orphans.map((orphan) => orphan.task_id),
    diagnostics,
  };
}
