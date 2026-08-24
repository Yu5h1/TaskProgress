/*
 * Phase 1 pure model for the extension-module system described in
 * Documentation/ExtensionModuleArchitecturePlan.md. Nothing here touches the
 * DOM, fetches a file, or starts a service — every function takes already-read
 * JSON and known facts (the current report, an already-computed report
 * revision, which types have an installed Renderer) and returns validation
 * results, diagnostics and a per-module decision. Wiring this into the Viewer
 * registry and Renderer slots is Phase 2's job, not this file's; wiring it
 * into the Launcher's file discovery is Phase 3's.
 */

export const SUPPORTED_MANIFEST_SCHEMA_VERSIONS = Object.freeze(["0.1"]);

export function isSupportedManifestSchemaVersion(version) {
  return SUPPORTED_MANIFEST_SCHEMA_VERSIONS.includes(version);
}

export const MODULE_VISIBILITIES = Object.freeze(["public", "developer", "local"]);

/*
 * One table naming every diagnostic this file can produce, so a Renderer or
 * the Developer overlay has a single place to look up what a code means
 * instead of inferring it from message text. Phase 0's error/degradation
 * table names these situations; this is where their machine-readable codes
 * live.
 */
export const MODULE_DIAGNOSTIC_CODES = Object.freeze({
  invalid_manifest: "report.modules.json 結構無效，忽略所有宣告模組。",
  unexpected_field: "manifest 或 descriptor 含有不支援的欄位。",
  unsupported_schema_version: "schema_version 不受此讀取者支援。",
  identity_mismatch: "report_id、scope_id 或 module_id 與 report.json 不符。",
  unsafe_module_source: "module source 不是安全的同源相對 JSON 路徑。",
  duplicate_module_id: "manifest 內有重複的 module id。",
  duplicate_module_type: "manifest 內有重複的 module type。",
  unsupported_optional_value: "descriptor.optional 第一版只能是 true。",
  invalid_visibility: "descriptor.visibility 不是支援的發布分類。",
  unknown_module_type: "沒有已安裝的可信任 Renderer 對應此 module type。",
  type_mismatch: "envelope 的 module_type 與 manifest descriptor 不符。",
  invalid_report_revision: "report_revision 格式必須是 sha256:<64 hex>。",
  invalid_timestamp: "時間欄位必須是有效的 date-time。",
  invalid_generator: "generator 必須包含 id 與 version 字串。",
  invalid_data: "module envelope 的 data 必須是物件。",
  module_unavailable: "module source 尚未提供資料（例如 404）。",
  orphan_subject: "module 資料指向 report 中不存在的 task 或 item。",
});

const ID_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const MODULE_TYPE_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)+$/;
const SAFE_SOURCE_PATTERN = /^[a-z0-9][a-z0-9._/-]*\.json$/;
const REPORT_REVISION_PATTERN = /^sha256:[0-9a-f]{64}$/;

/*
 * The one module-type pattern, exported so a Phase 2+ registry validates
 * `type` the same way manifest descriptors do instead of keeping a second
 * copy of the regex that could drift from this one.
 */
export function isModuleType(value) {
  return typeof value === "string" && MODULE_TYPE_PATTERN.test(value);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function issue(code, path, message) {
  return { code, path, message: message ?? MODULE_DIAGNOSTIC_CODES[code] ?? code };
}

function requireString(value, path, errors, options = {}) {
  const { pattern, code = "invalid_manifest" } = options;
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(issue(code, path, `${path} 必須是非空白文字。`));
    return false;
  }
  if (pattern && !pattern.test(value)) {
    errors.push(issue(code, path, `${path} 格式無效。`));
    return false;
  }
  return true;
}

function requireTimestamp(value, path, errors) {
  if (!requireString(value, path, errors, { code: "invalid_timestamp" })) return;
  if (Number.isNaN(Date.parse(value))) {
    errors.push(issue("invalid_timestamp", path, `${path} 必須是有效的 date-time。`));
  }
}

/*
 * The one place that decides whether a module `source` is safe to resolve
 * against the report folder: same-origin, no traversal, no query/fragment, no
 * encoded path characters, no backslash. Manifest validation uses this as a
 * predicate; a host that needs a hard boundary (Phase 3's Launcher provider)
 * uses `resolveModuleSource` below instead of re-deriving the same rule.
 */
export function isSafeModuleSource(source) {
  if (typeof source !== "string" || source.length === 0 || source.length > 255) return false;
  if (!SAFE_SOURCE_PATTERN.test(source)) return false;
  if (source.includes("\\") || source.includes("?") || source.includes("#")) return false;
  let decoded;
  try {
    decoded = decodeURIComponent(source);
  } catch {
    return false;
  }
  if (decoded !== source) return false;
  return !source.split("/").some((segment) => segment === "" || segment === "." || segment === "..");
}

export function resolveModuleSource(source) {
  if (!isSafeModuleSource(source)) {
    throw new Error(`module source 必須是 report folder 內的安全相對 JSON 路徑：${JSON.stringify(source)}`);
  }
  return source;
}

const MANIFEST_FIELDS = new Set(["schema_version", "report_id", "scope_id", "updated_at", "modules"]);
const DESCRIPTOR_FIELDS = new Set(["id", "type", "source", "optional", "visibility"]);

function validateDescriptor(descriptor, path, errors) {
  if (!isObject(descriptor)) {
    errors.push(issue("invalid_manifest", path, `${path} 必須是物件。`));
    return null;
  }
  const extraField = Object.keys(descriptor).find((field) => !DESCRIPTOR_FIELDS.has(field));
  if (extraField) {
    errors.push(issue("unexpected_field", `${path}.${extraField}`, `${path} 不接受欄位「${extraField}」。`));
  }
  const idOk = requireString(descriptor.id, `${path}.id`, errors, { pattern: ID_PATTERN });
  const typeOk = requireString(descriptor.type, `${path}.type`, errors, { pattern: MODULE_TYPE_PATTERN });
  if (!isSafeModuleSource(descriptor.source)) {
    errors.push(issue("unsafe_module_source", `${path}.source`, `${path}.source 必須是安全的同源相對 JSON 路徑。`));
  }
  if (descriptor.optional !== true) {
    errors.push(issue("unsupported_optional_value", `${path}.optional`, `${path}.optional 第一版只能是 true。`));
  }
  if (!MODULE_VISIBILITIES.includes(descriptor.visibility)) {
    errors.push(issue("invalid_visibility", `${path}.visibility`, `${path}.visibility 不是支援的發布分類。`));
  }
  if (!idOk || !typeOk) return null;
  return Object.freeze({
    id: descriptor.id,
    type: descriptor.type,
    source: descriptor.source,
    optional: true,
    visibility: descriptor.visibility,
  });
}

/*
 * Structural and identity validation for `report.modules.json`. Phase 0
 * decided an invalid manifest drops every declared module rather than
 * salvaging the valid-looking ones ("manifest 無效 -> 忽略所有宣告模組"), so
 * `descriptors` is always empty when `errors` is non-empty — callers must not
 * read one without checking the other.
 */
export function validateModuleManifest(manifest, report) {
  if (!isObject(report) || typeof report.report_id !== "string" || typeof report.scope_id !== "string") {
    throw new TypeError("validateModuleManifest 需要已知 report_id／scope_id 的 report。");
  }
  if (!isObject(manifest)) {
    return { errors: [issue("invalid_manifest", "$", "report.modules.json 的根節點必須是物件。")], descriptors: [] };
  }

  const errors = [];
  const extraField = Object.keys(manifest).find((field) => !MANIFEST_FIELDS.has(field));
  if (extraField) {
    errors.push(issue("unexpected_field", extraField, `report.modules.json 不接受欄位「${extraField}」。`));
  }
  if (!isSupportedManifestSchemaVersion(manifest.schema_version)) {
    errors.push(issue("unsupported_schema_version", "schema_version", "report.modules.json schema_version 不受支援。"));
  }
  if (manifest.report_id !== report.report_id) {
    errors.push(issue("identity_mismatch", "report_id", "report.modules.json report_id 與 report.json 不符。"));
  }
  if (manifest.scope_id !== report.scope_id) {
    errors.push(issue("identity_mismatch", "scope_id", "report.modules.json scope_id 與 report.json 不符。"));
  }
  if (manifest.updated_at !== undefined) requireTimestamp(manifest.updated_at, "updated_at", errors);
  if (!Array.isArray(manifest.modules)) {
    errors.push(issue("invalid_manifest", "modules", "modules 必須是陣列。"));
    return { errors, descriptors: [] };
  }

  const ids = new Set();
  const types = new Set();
  const descriptors = [];
  manifest.modules.forEach((descriptor, index) => {
    const path = `modules[${index}]`;
    const normalized = validateDescriptor(descriptor, path, errors);
    if (!normalized) return;
    if (ids.has(normalized.id)) {
      errors.push(issue("duplicate_module_id", `${path}.id`, `module id「${normalized.id}」重複。`));
    }
    if (types.has(normalized.type)) {
      errors.push(issue("duplicate_module_type", `${path}.type`, `module type「${normalized.type}」重複。`));
    }
    ids.add(normalized.id);
    types.add(normalized.type);
    descriptors.push(normalized);
  });

  if (errors.length > 0) return { errors, descriptors: [] };
  return { errors, descriptors: Object.freeze(descriptors) };
}

/*
 * Structural and identity validation for one module sidecar's common
 * envelope. Domain validation of `data` is not this file's job — Phase 1 only
 * proves the envelope that every module shares; a domain module (Time, and
 * later Cost) validates its own `data` shape on top of a clean envelope.
 */
export function validateModuleEnvelope(envelope, { report, descriptor, supportedDataSchemaVersions = [] }) {
  if (!isObject(envelope)) {
    return [issue("invalid_data", "$", "module envelope 必須是物件。")];
  }

  const errors = [];
  if (envelope.module_type !== descriptor.type) {
    errors.push(issue("type_mismatch", "module_type", "envelope 的 module_type 與 manifest descriptor 不符。"));
  }
  if (!supportedDataSchemaVersions.includes(envelope.schema_version)) {
    errors.push(issue("unsupported_schema_version", "schema_version", "envelope schema_version 不受此 Renderer 支援。"));
  }
  if (envelope.module_id !== descriptor.id) {
    errors.push(issue("identity_mismatch", "module_id", "envelope 的 module_id 與 manifest descriptor 不符。"));
  }
  if (envelope.report_id !== report.report_id) {
    errors.push(issue("identity_mismatch", "report_id", "envelope 的 report_id 與 report.json 不符。"));
  }
  if (envelope.scope_id !== report.scope_id) {
    errors.push(issue("identity_mismatch", "scope_id", "envelope 的 scope_id 與 report.json 不符。"));
  }
  if (envelope.report_revision !== undefined && !REPORT_REVISION_PATTERN.test(envelope.report_revision)) {
    errors.push(issue("invalid_report_revision", "report_revision", "report_revision 格式必須是 sha256:<64 hex>。"));
  }
  requireTimestamp(envelope.generated_at, "generated_at", errors);
  if (
    !isObject(envelope.generator)
    || typeof envelope.generator.id !== "string" || envelope.generator.id.trim().length === 0
    || typeof envelope.generator.version !== "string" || envelope.generator.version.trim().length === 0
  ) {
    errors.push(issue("invalid_generator", "generator", "generator 必須包含 id 與 version 字串。"));
  }
  if (!isObject(envelope.data)) {
    errors.push(issue("invalid_data", "data", "module envelope 的 data 必須是物件。"));
  }
  return errors;
}

export const PROJECTION_FRESHNESS = Object.freeze({
  current: "current",
  unknown: "freshness_unknown",
  stale: "stale",
});

/*
 * Phase 0's stale-minimum policy, as a pure comparison: a module that never
 * recorded `report_revision` cannot claim to be current — that allowance is
 * for legacy migration only, per the architecture plan — and a mismatched
 * revision is stale, not merely unknown. Hashing `report.json` itself is the
 * caller's job; this function only classifies two revision strings it is
 * handed.
 */
export function evaluateProjectionFreshness({ envelope, currentReportRevision }) {
  if (typeof currentReportRevision !== "string" || !REPORT_REVISION_PATTERN.test(currentReportRevision)) {
    throw new TypeError("currentReportRevision 必須是 sha256:<64 hex>。");
  }
  const recorded = envelope?.report_revision;
  if (recorded === undefined) return PROJECTION_FRESHNESS.unknown;
  return recorded === currentReportRevision ? PROJECTION_FRESHNESS.current : PROJECTION_FRESHNESS.stale;
}

export const SUBJECT_LEVELS = Object.freeze(["project", "task", "item"]);

function collectStableItemIds(task) {
  const ids = new Set();
  for (const field of ["completed_items", "pending_items"]) {
    for (const item of task[field] ?? []) {
      if (isObject(item) && typeof item.id === "string") ids.add(item.id);
    }
  }
  return ids;
}

/*
 * Subject Adapter, generalized: it never reads a module's own `data` shape —
 * the caller (a domain adapter, Phase 2 onward) reduces its data to plain
 * {level, task_id, item_id} refs first. Matching stays keyed on stable IDs
 * only, never screen order or display text, per the architecture plan's
 * subject rules. A legacy plain-string stable item carries no id of its own,
 * so it can never be a subject — only object-shaped items with `.id` are
 * matchable; that is a report-model concern (`mergeReports` synthesizes a
 * presentation-only id), not something this pure model should guess at.
 */
export function createSubjectIndex(report, subjectRefs) {
  if (!Array.isArray(report?.tasks)) {
    throw new TypeError("createSubjectIndex 需要含 tasks 陣列的 report。");
  }
  const validTaskIds = new Set(report.tasks.map((task) => task.id));
  const itemIdsByTask = new Map(report.tasks.map((task) => [task.id, collectStableItemIds(task)]));

  const tasks = new Set();
  const items = new Set();
  const orphans = [];

  (subjectRefs ?? []).forEach((ref, index) => {
    if (!isObject(ref) || !SUBJECT_LEVELS.includes(ref.level)) {
      orphans.push({ index, ref: ref ?? null, reason: "invalid_level" });
      return;
    }
    if (ref.level === "project") {
      return;
    }
    if (!validTaskIds.has(ref.task_id)) {
      orphans.push({
        index, level: ref.level, task_id: ref.task_id ?? null, item_id: ref.item_id ?? null, reason: "unknown_task",
      });
      return;
    }
    if (ref.level === "task") {
      tasks.add(ref.task_id);
      return;
    }
    const itemIds = itemIdsByTask.get(ref.task_id);
    if (!itemIds.has(ref.item_id)) {
      orphans.push({
        index, level: "item", task_id: ref.task_id, item_id: ref.item_id ?? null, reason: "unknown_item",
      });
      return;
    }
    items.add(`${ref.task_id}/${ref.item_id}`);
  });

  return Object.freeze({
    tasks: Object.freeze([...tasks]),
    items: Object.freeze([...items]),
    orphans: Object.freeze(orphans.map((entry) => Object.freeze(entry))),
  });
}

export const MODULE_STATUSES = Object.freeze(["unsupported_type", "unavailable", "invalid", "loaded"]);

/*
 * The Phase 1 loader: per declared module, decide whether a trusted Renderer
 * exists for its type, whether the fetched envelope is structurally valid and
 * identity-matched, and how fresh it is — without touching the DOM, starting
 * a service, or reading a module's own domain `data`. One invalid module
 * never stops another from loading; that isolation is asserted by the tests,
 * not merely assumed. `registrySupportedVersions` stands in for the Phase 2
 * trusted registry: a type absent from the map has no installed Renderer.
 */
export function loadReportModules({
  report,
  manifest,
  currentReportRevision,
  artifacts = new Map(),
  registrySupportedVersions = new Map(),
}) {
  if (manifest === null || manifest === undefined) {
    return Object.freeze({ manifestErrors: Object.freeze([]), modules: Object.freeze([]) });
  }

  const { errors: manifestErrors, descriptors } = validateModuleManifest(manifest, report);
  if (manifestErrors.length > 0) {
    return Object.freeze({ manifestErrors: Object.freeze(manifestErrors), modules: Object.freeze([]) });
  }

  const modules = descriptors.map((descriptor) => {
    const supportedDataSchemaVersions = registrySupportedVersions.get(descriptor.type);
    if (supportedDataSchemaVersions === undefined) {
      return Object.freeze({
        descriptor,
        status: "unsupported_type",
        errors: Object.freeze([issue(
          "unknown_module_type",
          `modules.${descriptor.id}`,
          `沒有已安裝的可信任 Renderer 支援 module type「${descriptor.type}」。`,
        )]),
        freshness: null,
      });
    }

    const artifact = artifacts.get(descriptor.source);
    if (artifact === undefined) {
      return Object.freeze({
        descriptor,
        status: "unavailable",
        errors: Object.freeze([issue(
          "module_unavailable",
          `modules.${descriptor.id}`,
          `找不到 module source：${descriptor.source}`,
        )]),
        freshness: null,
      });
    }

    const envelopeErrors = validateModuleEnvelope(artifact, { report, descriptor, supportedDataSchemaVersions });
    if (envelopeErrors.length > 0) {
      return Object.freeze({
        descriptor,
        status: "invalid",
        errors: Object.freeze(envelopeErrors),
        freshness: null,
      });
    }

    const freshness = evaluateProjectionFreshness({ envelope: artifact, currentReportRevision });
    return Object.freeze({
      descriptor,
      status: "loaded",
      errors: Object.freeze([]),
      freshness,
    });
  });

  return Object.freeze({ manifestErrors: Object.freeze([]), modules: Object.freeze(modules) });
}
