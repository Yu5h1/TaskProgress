// The registry-driven lifecycle loop. The assertions that matter here are
// the isolation ones: an unsupported type, a module that throws while
// attaching, one that throws while producing a capsule, and one that throws
// while disposing must each be contained so the others still work.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  activateCapsule,
  attachModules,
  collectCapsules,
  disposeModules,
} from "../viewer/assets/module-composition.js";
import { createTrustedModuleRegistry } from "../viewer/assets/module-registry.js";

function definition(type, overrides = {}) {
  return {
    type,
    supportedSchemaVersions: ["0.1"],
    slots: ["project-summary"],
    attach: () => ({
      capsuleFor: (slot) => (slot === "project-summary" ? { id: type, label: type } : null),
      ownsCapsule: (slot, capsuleId) => slot === "project-summary" && capsuleId === type,
      activate: () => {},
      dispose: () => {},
    }),
    ...overrides,
  };
}

function loaded(type, overrides = {}) {
  return { type, schemaVersion: "0.1", data: {}, host: {}, ...overrides };
}

// --- attach ---

test("a registered module attaches and contributes its capsule", () => {
  const registry = createTrustedModuleRegistry([definition("taskprogress.time")]);
  const { attached, diagnostics } = attachModules(registry, [loaded("taskprogress.time")]);
  assert.equal(attached.length, 1);
  assert.deepEqual(diagnostics, []);

  const collected = collectCapsules(attached, "project-summary");
  assert.deepEqual(collected.capsules.map((capsule) => capsule.id), ["taskprogress.time"]);
});

test("an unregistered type is skipped with a diagnostic, not thrown", () => {
  const registry = createTrustedModuleRegistry([definition("taskprogress.time")]);
  const { attached, diagnostics } = attachModules(registry, [loaded("taskprogress.unknown")]);
  assert.equal(attached.length, 0);
  assert.equal(diagnostics[0].code, "unsupported_module_type");
});

test("a data version the definition does not support is refused rather than rendered anyway", () => {
  const registry = createTrustedModuleRegistry([definition("taskprogress.time")]);
  const { attached, diagnostics } = attachModules(registry, [
    loaded("taskprogress.time", { schemaVersion: "9.9" }),
  ]);
  assert.equal(attached.length, 0);
  assert.equal(diagnostics[0].code, "unsupported_schema_version");
});

test("a module that throws while attaching is isolated and the others still attach", () => {
  const registry = createTrustedModuleRegistry([
    definition("taskprogress.bad", { attach: () => { throw new Error("boom"); } }),
    definition("taskprogress.good"),
  ]);
  const { attached, diagnostics } = attachModules(registry, [
    loaded("taskprogress.bad"),
    loaded("taskprogress.good"),
  ]);
  assert.deepEqual(attached.map((entry) => entry.type), ["taskprogress.good"]);
  assert.equal(diagnostics[0].code, "attach_failed");
  assert.match(diagnostics[0].message, /boom/);
});

// --- collect ---

test("capsules arrive in one array, so a second module joins without a second row", () => {
  const registry = createTrustedModuleRegistry([
    definition("taskprogress.time"),
    definition("taskprogress.cost"),
  ]);
  const { attached } = attachModules(registry, [loaded("taskprogress.time"), loaded("taskprogress.cost")]);
  const { capsules } = collectCapsules(attached, "project-summary");
  assert.deepEqual(capsules.map((capsule) => capsule.id), ["taskprogress.time", "taskprogress.cost"]);
});

test("returning null is a normal answer — no data means no capsule, not an empty one", () => {
  const registry = createTrustedModuleRegistry([
    definition("taskprogress.time", {
      attach: () => ({ capsuleFor: () => null }),
    }),
  ]);
  const { attached } = attachModules(registry, [loaded("taskprogress.time")]);
  const { capsules, diagnostics } = collectCapsules(attached, "project-summary");
  assert.deepEqual(capsules, []);
  assert.deepEqual(diagnostics, []);
});

test("a module that throws while producing a capsule does not drop the others", () => {
  const registry = createTrustedModuleRegistry([
    definition("taskprogress.bad", {
      attach: () => ({ capsuleFor: () => { throw new Error("render boom"); } }),
    }),
    definition("taskprogress.good"),
  ]);
  const { attached } = attachModules(registry, [loaded("taskprogress.bad"), loaded("taskprogress.good")]);
  const { capsules, diagnostics } = collectCapsules(attached, "project-summary");
  assert.deepEqual(capsules.map((capsule) => capsule.id), ["taskprogress.good"]);
  assert.equal(diagnostics[0].code, "render_failed");
});

test("a module is only asked for slots it declared", () => {
  const registry = createTrustedModuleRegistry([
    definition("taskprogress.time", { slots: ["item-inline"] }),
  ]);
  const { attached } = attachModules(registry, [loaded("taskprogress.time")]);
  assert.deepEqual(collectCapsules(attached, "project-summary").capsules, []);
});

test("an unknown slot is a programming error and throws rather than silently returning nothing", () => {
  assert.throws(() => collectCapsules([], "not-a-slot"), /Viewer slot/u);
});

// --- activate ---

test("activation is dispatched to the module that owns that capsule id", () => {
  const activated = [];
  const registry = createTrustedModuleRegistry([
    definition("taskprogress.time", {
      attach: () => ({
        capsuleFor: () => ({ id: "time", label: "t" }),
        ownsCapsule: (slot, id) => id === "time",
        activate: () => activated.push("time"),
      }),
    }),
    definition("taskprogress.cost", {
      attach: () => ({
        capsuleFor: () => ({ id: "cost", label: "c" }),
        ownsCapsule: (slot, id) => id === "cost",
        activate: () => activated.push("cost"),
      }),
    }),
  ]);
  const { attached } = attachModules(registry, [loaded("taskprogress.time"), loaded("taskprogress.cost")]);

  assert.equal(activateCapsule(attached, "project-summary", "cost"), true);
  assert.deepEqual(activated, ["cost"], "the click must reach Cost, not whichever module came first");

  assert.equal(activateCapsule(attached, "project-summary", "time"), true);
  assert.deepEqual(activated, ["cost", "time"]);
});

test("activating an unknown capsule id reports failure instead of guessing an owner", () => {
  const registry = createTrustedModuleRegistry([definition("taskprogress.time")]);
  const { attached } = attachModules(registry, [loaded("taskprogress.time")]);
  assert.equal(activateCapsule(attached, "project-summary", "no-such-capsule"), false);
});

// --- dispose ---

test("every module is disposed even when one throws", () => {
  const disposed = [];
  const registry = createTrustedModuleRegistry([
    definition("taskprogress.bad", {
      attach: () => ({ capsuleFor: () => null, dispose: () => { throw new Error("dispose boom"); } }),
    }),
    definition("taskprogress.good", {
      attach: () => ({ capsuleFor: () => null, dispose: () => disposed.push("good") }),
    }),
  ]);
  const { attached } = attachModules(registry, [loaded("taskprogress.bad"), loaded("taskprogress.good")]);
  const diagnostics = disposeModules(attached);
  assert.deepEqual(disposed, ["good"]);
  assert.equal(diagnostics[0].code, "dispose_failed");
});

// --- isolation ---

test("the composition loop stays off the DOM", async () => {
  const source = await readFile(new URL("../viewer/assets/module-composition.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /document\.|window\.|querySelector\(|createUiView\(|fetch\(/u);
});

// --- stale: Core stops asking rather than telling modules to withdraw ---

test("a stale projection yields no capsules, and no module is even consulted", () => {
  let asked = 0;
  const registry = createTrustedModuleRegistry([
    definition("taskprogress.time", {
      attach: () => ({
        capsuleFor: () => { asked += 1; return { id: "time", label: "8 hr" }; },
      }),
    }),
  ]);
  const { attached } = attachModules(registry, [loaded("taskprogress.time")]);

  const fresh = collectCapsules(attached, "project-summary");
  assert.equal(fresh.capsules.length, 1);
  assert.equal(asked, 1);

  const stale = collectCapsules(attached, "project-summary", null, { stale: true });
  assert.deepEqual(stale.capsules, []);
  assert.deepEqual(stale.diagnostics, []);
  // Not asked at all: the contract stays one-directional, so a module needs
  // no stale method and cannot run a side effect on being told the report
  // moved underneath it.
  assert.equal(asked, 1, "a stale render must not consult the module");
});

test("stale is per-call, so it never sticks to an attached module", () => {
  const registry = createTrustedModuleRegistry([definition("taskprogress.time")]);
  const { attached } = attachModules(registry, [loaded("taskprogress.time")]);
  assert.deepEqual(collectCapsules(attached, "project-summary", null, { stale: true }).capsules, []);
  assert.equal(collectCapsules(attached, "project-summary").capsules.length, 1);
});
