/*
 * Phase 2 — registry / slot-contract slice only
 * (Documentation/ExtensionModuleArchitecturePlan.md#phase-2viewer-registry-與-time-遷移).
 *
 * This file only answers two questions: which module types have an
 * installed, trusted Renderer, and which Viewer slots each one may mount
 * into. It never touches the DOM itself — `attach`/`render`/`start`/
 * `dispose` are validated as functions at registration time but never
 * invoked here. Wrapping the existing Time UI into a real ViewerModule
 * definition, and calling those functions from the Viewer's render loop, is
 * a separately-confirmed follow-up; this file only proves the registry
 * contract that step will register into, and nothing in `app.js` imports it
 * yet.
 */

import { isModuleType } from "./module-model.js";

/*
 * The eight mount points named in the architecture plan's Viewer Slots
 * table. Core owns insertion order, accessibility and mobile space within
 * each one — a Renderer only ever fills a slot it declared, it does not
 * reach for another module's or the report's own DOM.
 */
export const VIEWER_MODULE_SLOTS = Object.freeze([
  "project-summary",
  "task-header",
  "task-body",
  "item-inline",
  "project-detail",
  "task-detail",
  "item-detail",
  "diagnostics",
]);

const OPTIONAL_LIFECYCLE_FIELDS = Object.freeze(["render", "start", "dispose"]);

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0
    && value.every((entry) => typeof entry === "string" && entry.trim().length > 0);
}

function validateDefinition(definition) {
  if (!definition || typeof definition !== "object" || Array.isArray(definition)) {
    throw new TypeError("module definition 必須是物件。");
  }
  if (!isModuleType(definition.type)) {
    throw new TypeError(`module definition.type 無效：${JSON.stringify(definition.type)}`);
  }
  if (!isNonEmptyStringArray(definition.supportedSchemaVersions)) {
    throw new TypeError(`module type「${definition.type}」的 supportedSchemaVersions 必須是非空字串陣列。`);
  }
  if (!Array.isArray(definition.slots) || definition.slots.length === 0) {
    throw new TypeError(`module type「${definition.type}」必須宣告至少一個 slot。`);
  }
  const unknownSlot = definition.slots.find((slot) => !VIEWER_MODULE_SLOTS.includes(slot));
  if (unknownSlot !== undefined) {
    throw new TypeError(`module type「${definition.type}」宣告了不存在的 slot「${unknownSlot}」。`);
  }
  if (typeof definition.attach !== "function") {
    throw new TypeError(`module type「${definition.type}」缺少必要的 attach()。`);
  }
  for (const field of OPTIONAL_LIFECYCLE_FIELDS) {
    if (definition[field] !== undefined && typeof definition[field] !== "function") {
      throw new TypeError(`module type「${definition.type}」的 ${field} 必須是函式。`);
    }
  }
}

/*
 * The one place a build registers which module types have a trusted
 * Renderer "installed" — Core never infers this from report data, per the
 * architecture plan's "顯示不代表權限" principle applied to type trust. A
 * malformed or duplicate definition throws: this is a build-time contract
 * mistake, not runtime report data, so it fails loudly instead of being
 * isolated as a per-module diagnostic the way a bad manifest descriptor is.
 *
 * `supportedVersionsMap()` returns exactly the shape Phase 1's
 * `loadReportModules({ registrySupportedVersions })` expects, so a caller
 * wires registry → loader without re-deriving the same map twice.
 */
export function createTrustedModuleRegistry(definitions) {
  if (!Array.isArray(definitions)) {
    throw new TypeError("createTrustedModuleRegistry 需要 definition 陣列。");
  }

  const byType = new Map();
  definitions.forEach((definition) => {
    validateDefinition(definition);
    if (byType.has(definition.type)) {
      throw new Error(`可信任 module type「${definition.type}」重複註冊。`);
    }
    byType.set(definition.type, Object.freeze({
      ...definition,
      supportedSchemaVersions: Object.freeze([...definition.supportedSchemaVersions]),
      slots: Object.freeze([...definition.slots]),
    }));
  });

  return Object.freeze({
    types() {
      return Object.freeze([...byType.keys()]);
    },
    get(type) {
      return byType.get(type);
    },
    has(type) {
      return byType.has(type);
    },
    supportsSlot(type, slot) {
      return byType.get(type)?.slots.includes(slot) ?? false;
    },
    supportedVersionsMap() {
      return new Map([...byType.entries()].map(
        ([type, definition]) => [type, [...definition.supportedSchemaVersions]],
      ));
    },
  });
}
