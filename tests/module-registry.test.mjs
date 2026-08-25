// Phase 2 — registry / slot-contract slice only. This suite stays off the DOM
// on purpose: no real module (Time included) is wired in yet, so every
// definition here is a stub with plain functions standing in for
// attach/render/start/dispose. What is being proven is the registration
// contract itself, and that it hands Phase 1's loader exactly the shape it
// expects — not any actual rendering behavior.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { loadReportModules } from "../viewer/assets/module-model.js";
import { createTrustedModuleRegistry, VIEWER_MODULE_SLOTS } from "../viewer/assets/module-registry.js";

function stubDefinition(overrides = {}) {
  return {
    type: "taskprogress.cost",
    supportedSchemaVersions: ["0.1"],
    slots: ["project-summary", "project-detail"],
    attach: () => {},
    ...overrides,
  };
}

test("the slot table matches the architecture plan's eight mount points", () => {
  assert.deepEqual(VIEWER_MODULE_SLOTS, [
    "project-summary",
    "task-header",
    "task-body",
    "item-inline",
    "project-detail",
    "task-detail",
    "item-detail",
    "diagnostics",
  ]);
});

test("a well-formed definition registers and is queryable by type and slot", () => {
  const registry = createTrustedModuleRegistry([stubDefinition()]);
  assert.deepEqual(registry.types(), ["taskprogress.cost"]);
  assert.equal(registry.has("taskprogress.cost"), true);
  assert.equal(registry.has("taskprogress.time"), false);
  assert.equal(registry.supportsSlot("taskprogress.cost", "project-summary"), true);
  assert.equal(registry.supportsSlot("taskprogress.cost", "item-inline"), false);
  assert.equal(registry.supportsSlot("taskprogress.unknown", "project-summary"), false);
  const definition = registry.get("taskprogress.cost");
  assert.equal(typeof definition.attach, "function");
  assert.equal(Object.isFrozen(definition.slots), true);
});

test("an invalid type, missing versions, unknown slot, or missing attach() is rejected", () => {
  assert.throws(() => createTrustedModuleRegistry([stubDefinition({ type: "Cost" })]), /type/u);
  assert.throws(() => createTrustedModuleRegistry([stubDefinition({ type: "cost" })]), /type/u); // single segment, no dot
  assert.throws(() => createTrustedModuleRegistry([stubDefinition({ supportedSchemaVersions: [] })]), /supportedSchemaVersions/u);
  assert.throws(() => createTrustedModuleRegistry([stubDefinition({ slots: ["not-a-slot"] })]), /slot/u);
  assert.throws(() => createTrustedModuleRegistry([stubDefinition({ slots: [] })]), /slot/u);
  assert.throws(() => createTrustedModuleRegistry([stubDefinition({ attach: undefined })]), /attach/u);
});

test("an optional lifecycle field must be a function when present", () => {
  assert.throws(() => createTrustedModuleRegistry([stubDefinition({ render: "not-a-function" })]), /render/u);
  assert.doesNotThrow(() => createTrustedModuleRegistry([
    stubDefinition({ render: () => {}, start: () => {}, dispose: () => {} }),
  ]));
});

test("duplicate type registration throws instead of silently taking over", () => {
  assert.throws(
    () => createTrustedModuleRegistry([stubDefinition(), stubDefinition()]),
    /重複註冊/u,
  );
});

test("supportedVersionsMap() is exactly what Phase 1's loader expects for registrySupportedVersions", () => {
  const registry = createTrustedModuleRegistry([
    stubDefinition(),
    stubDefinition({ type: "taskprogress.time", slots: ["project-summary", "item-inline"] }),
  ]);
  const versions = registry.supportedVersionsMap();
  assert.deepEqual(versions.get("taskprogress.cost"), ["0.1"]);
  assert.deepEqual(versions.get("taskprogress.time"), ["0.1"]);

  const report = Object.freeze({ report_id: "r", scope_id: "s", tasks: [] });
  const revision = `sha256:${"a".repeat(64)}`;
  const manifest = {
    schema_version: "0.1",
    report_id: "r",
    scope_id: "s",
    modules: [{ id: "cost", type: "taskprogress.cost", source: "cost.analysis.json", optional: true, visibility: "local" }],
  };
  const envelope = {
    module_type: "taskprogress.cost",
    schema_version: "0.1",
    module_id: "cost",
    report_id: "r",
    scope_id: "s",
    report_revision: revision,
    generated_at: "2026-08-24T00:00:00Z",
    generator: { id: "x", version: "0.1" },
    data: {},
  };
  const result = loadReportModules({
    report,
    manifest,
    currentReportRevision: revision,
    artifacts: new Map([["cost.analysis.json", envelope]]),
    registrySupportedVersions: versions,
  });
  assert.equal(result.modules[0].status, "loaded");
});

test("the registry stays off the DOM, and production builds exactly one", async () => {
  const source = await readFile(new URL("../viewer/assets/module-registry.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /document\.|window\.|querySelector|addEventListener/u);

  // The registry went live on 2026-08-25: app.js composes it once, at module
  // scope, from definitions this build ships. Report data can declare a
  // module but must never be able to install one, so this must not sit
  // inside a load path where a report could influence it.
  const appSource = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.match(appSource, /^const moduleRegistry = createTrustedModuleRegistry\(\[/mu);
  assert.equal(appSource.match(/createTrustedModuleRegistry\(/gu).length, 1);
});
