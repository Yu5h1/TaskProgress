const ID_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/u;
const MODULE_TYPE_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)+$/u;
const SAFE_SOURCE_PATTERN = /^[a-z0-9][a-z0-9._/-]*\.json$/u;
const VISIBILITIES = new Set(["public", "developer", "local"]);
const MANIFEST_FIELDS = new Set([
  "schema_version",
  "report_id",
  "scope_id",
  "updated_at",
  "modules",
]);
const DESCRIPTOR_FIELDS = new Set(["id", "type", "source", "optional", "visibility"]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireId(value, field) {
  if (typeof value !== "string" || !ID_PATTERN.test(value)) {
    throw new Error(`${field} 必須是穩定 ID。`);
  }
}

function validateReportIdentity(report) {
  if (!isRecord(report)) throw new Error("report 必須是物件。");
  requireId(report.report_id, "report.report_id");
  requireId(report.scope_id, "report.scope_id");
}

export function freezeJsonSnapshot(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(freezeJsonSnapshot);
  return Object.freeze(value);
}

function immutableCopy(value) {
  return freezeJsonSnapshot(structuredClone(value));
}

export function validateModuleSource(source) {
  if (typeof source !== "string"
    || source.length === 0
    || source.length > 255
    || !SAFE_SOURCE_PATTERN.test(source)
    || source.includes("\\")
    || source.includes("?")
    || source.includes("#")) {
    throw new Error("module source 必須是 report folder 內的相對 JSON 路徑。");
  }
  let decoded;
  try {
    decoded = decodeURIComponent(source);
  } catch {
    throw new Error("module source 含有無效編碼。");
  }
  if (decoded !== source) throw new Error("module source 不接受編碼後的路徑字元。");
  const segments = source.split("/");
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) {
    throw new Error("module source 不得離開 report folder。");
  }
  return source;
}

function validateDescriptor(descriptor, index) {
  if (!isRecord(descriptor)) throw new Error(`modules[${index}] 必須是物件。`);
  const extraField = Object.keys(descriptor).find((field) => !DESCRIPTOR_FIELDS.has(field));
  if (extraField) throw new Error(`modules[${index}] 不接受欄位「${extraField}」。`);
  requireId(descriptor.id, `modules[${index}].id`);
  if (typeof descriptor.type !== "string" || !MODULE_TYPE_PATTERN.test(descriptor.type)) {
    throw new Error(`modules[${index}].type 無效。`);
  }
  validateModuleSource(descriptor.source);
  if (descriptor.optional !== true) {
    throw new Error(`modules[${index}].optional 第一版只能是 true。`);
  }
  if (!VISIBILITIES.has(descriptor.visibility)) {
    throw new Error(`modules[${index}].visibility 無效。`);
  }
  return immutableCopy({
    id: descriptor.id,
    type: descriptor.type,
    source: descriptor.source,
    optional: true,
    visibility: descriptor.visibility,
  });
}

export function validateModuleManifest(manifest, report) {
  validateReportIdentity(report);
  if (!isRecord(manifest)) throw new Error("report.modules.json 必須是物件。");
  const extraField = Object.keys(manifest).find((field) => !MANIFEST_FIELDS.has(field));
  if (extraField) throw new Error(`report.modules.json 不接受欄位「${extraField}」。`);
  if (manifest.schema_version !== "0.1") {
    throw new Error("report.modules.json schema_version 必須是 0.1。");
  }
  if (manifest.report_id !== report.report_id || manifest.scope_id !== report.scope_id) {
    throw new Error("report.modules.json identity 必須與 report.json 相符。");
  }
  if (manifest.updated_at !== undefined && Number.isNaN(Date.parse(manifest.updated_at))) {
    throw new Error("report.modules.json updated_at 必須是有效時間。");
  }
  if (!Array.isArray(manifest.modules)) {
    throw new Error("report.modules.json modules 必須是陣列。");
  }
  const ids = new Set();
  const types = new Set();
  const descriptors = manifest.modules.map((descriptor, index) => {
    const normalized = validateDescriptor(descriptor, index);
    if (ids.has(normalized.id)) throw new Error(`module id「${normalized.id}」重複。`);
    if (types.has(normalized.type)) throw new Error(`module type「${normalized.type}」重複。`);
    ids.add(normalized.id);
    types.add(normalized.type);
    return normalized;
  });
  return freezeJsonSnapshot(descriptors);
}

function normalizedInput(adapterId, report, descriptor, artifact) {
  return immutableCopy({
    discovery_adapter: adapterId,
    report_identity: {
      report_id: report.report_id,
      scope_id: report.scope_id,
    },
    descriptor,
    artifact,
  });
}

export function createManifestDiscoveryAdapter() {
  const adapterId = "manifest";
  return Object.freeze({
    id: adapterId,
    async discover({ report, manifest, readJson }) {
      if (typeof readJson !== "function") throw new TypeError("readJson 必須是函式。");
      const descriptors = validateModuleManifest(manifest, report);
      const inputs = [];
      for (const descriptor of descriptors) {
        const artifact = await readJson(descriptor.source);
        if (artifact === undefined || artifact === null) {
          throw new Error(`找不到 module artifact：${descriptor.source}`);
        }
        inputs.push(normalizedInput(adapterId, report, descriptor, artifact));
      }
      return Object.freeze(inputs);
    },
  });
}

export function createLegacyTimeDiscoveryAdapter() {
  const adapterId = "legacy-time";
  return Object.freeze({
    id: adapterId,
    async discover({ report, readJson }) {
      validateReportIdentity(report);
      if (typeof readJson !== "function") throw new TypeError("readJson 必須是函式。");
      const artifact = await readJson("time.analysis.json");
      if (artifact === undefined || artifact === null) return Object.freeze([]);
      const descriptor = Object.freeze({
        id: "time",
        type: "taskprogress.time",
        source: "time.analysis.json",
        optional: true,
        visibility: "local",
      });
      return Object.freeze([normalizedInput(adapterId, report, descriptor, artifact)]);
    },
  });
}
