import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { inspectCurrentEstimateFixture } from "../experiments/time-reference/module-spike/current-estimates.js";
import {
  createLegacyTimeDiscoveryAdapter,
  createManifestDiscoveryAdapter,
  validateModuleManifest,
  validateModuleSource,
} from "../experiments/time-reference/module-spike/module-contract.js";
import {
  createTrustedModuleRegistry,
  EXPERIMENT_MODES,
  runExperimentalComposition,
} from "../experiments/time-reference/module-spike/module-runtime.js";
import { createTimeModuleDefinition } from "../experiments/time-reference/module-spike/time-module.js";

const exampleRoot = new URL("../experiments/time-reference/examples/", import.meta.url);
const [report, estimates, analysis] = await Promise.all([
  readFile(new URL("report.json", exampleRoot), "utf8").then(JSON.parse),
  readFile(new URL("time.estimates.json", exampleRoot), "utf8").then(JSON.parse),
  readFile(new URL("time.analysis.json", exampleRoot), "utf8").then(JSON.parse),
]);

function manifestFor(reportValue = report) {
  return {
    schema_version: "0.1",
    report_id: reportValue.report_id,
    scope_id: reportValue.scope_id,
    modules: [
      {
        id: "time",
        type: "taskprogress.time",
        source: "time.analysis.json",
        optional: true,
        visibility: "local",
      },
    ],
  };
}

function harness(overrides = {}) {
  const files = new Map([["time.analysis.json", analysis]]);
  return {
    report,
    manifest: manifestFor(),
    readJson: async (source) => files.get(source),
    registry: createTrustedModuleRegistry([createTimeModuleDefinition()]),
    legacyAdapter: createLegacyTimeDiscoveryAdapter(),
    manifestAdapter: createManifestDiscoveryAdapter(),
    ...overrides,
  };
}

test("manifest and legacy discovery converge on one immutable Time input", async () => {
  const context = harness();
  const [legacyInputs, manifestInputs] = await Promise.all([
    context.legacyAdapter.discover(context),
    context.manifestAdapter.discover(context),
  ]);

  assert.equal(legacyInputs.length, 1);
  assert.equal(manifestInputs.length, 1);
  assert.equal(legacyInputs[0].descriptor.type, "taskprogress.time");
  assert.deepEqual(legacyInputs[0].artifact, manifestInputs[0].artifact);
  assert.equal(Object.isFrozen(legacyInputs[0].artifact), true);
  assert.equal(Object.isFrozen(manifestInputs[0].descriptor), true);
});

test("manifest identity, unique types, and report-folder sources are enforced", () => {
  assert.equal(validateModuleSource("modules/time.analysis.json"), "modules/time.analysis.json");
  for (const unsafe of ["../time.analysis.json", "/time.analysis.json", "time.analysis.json?x=1", "time%2eanalysis.json", "time\\analysis.json"]) {
    assert.throws(() => validateModuleSource(unsafe), /module source/u);
  }

  assert.throws(
    () => validateModuleManifest(
      { ...manifestFor(), scope_id: "another-scope" },
      report,
    ),
    /identity/u,
  );
  const duplicate = manifestFor();
  duplicate.modules.push({ ...duplicate.modules[0], id: "time-copy" });
  assert.throws(() => validateModuleManifest(duplicate, report), /module type/u);

  const executableDescriptor = manifestFor();
  executableDescriptor.modules[0].script = "untrusted.js";
  assert.throws(
    () => validateModuleManifest(executableDescriptor, report),
    /不接受欄位「script」/u,
  );
});

test("the trusted Time Module reuses production validation and subject indexes", async () => {
  const context = harness();
  const [input] = await context.manifestAdapter.discover(context);
  const module = context.registry.inspect(input);

  assert.equal(module.semantic.summary.total_estimated_minutes, 2640);
  assert.equal(module.semantic.deadline_available, true);
  assert.equal(module.task("time-reference-prototype").items.length, 3);
  assert.equal(module.item("evaluate-unknown-route").likely_minutes, 1800);
  assert.equal(module.item("missing-item"), null);

  const source = await readFile(
    new URL("../experiments/time-reference/module-spike/time-module.js", import.meta.url),
    "utf8",
  );
  assert.match(source, /from "\.\.\/\.\.\/\.\.\/viewer\/assets\/time-model\.js"/u);
  assert.doesNotMatch(source, /TimeDialog|setInterval|localStorage|likely_hours \* 60/u);
});

test("passive shadow compares semantics but cannot activate behavior", async () => {
  const composition = await runExperimentalComposition({
    mode: EXPERIMENT_MODES.passiveShadow,
    ...harness(),
  });

  assert.equal(composition.active_adapter_count, 1);
  assert.equal(composition.active.adapter_id, "legacy-time");
  assert.equal(composition.shadow.adapter_id, "manifest");
  assert.equal(composition.comparison.matches, true);
  assert.deepEqual(composition.comparison.differences, []);
  assert.equal(composition.shadow.capabilities.allows("inspect"), true);
  for (const forbidden of ["render", "start", "preview", "save", "route_mutation"]) {
    assert.equal(composition.shadow.capabilities.allows(forbidden), false);
    assert.throws(() => composition.shadow.capabilities.assert(forbidden), /不允許/u);
  }
});

test("isolated preview and cutover select exactly one adapter", async () => {
  const preview = await runExperimentalComposition({
    mode: EXPERIMENT_MODES.isolatedPreview,
    ...harness(),
  });
  assert.equal(preview.active_adapter_count, 1);
  assert.equal(preview.active.adapter_id, "manifest");
  assert.equal(preview.shadow, null);

  const cutover = await runExperimentalComposition({
    mode: EXPERIMENT_MODES.productionCutover,
    ...harness(),
  });
  assert.equal(cutover.active.adapter_id, "manifest");

  const fallback = await runExperimentalComposition({
    mode: EXPERIMENT_MODES.productionCutover,
    ...harness({ manifest: null }),
  });
  assert.equal(fallback.active.adapter_id, "legacy-time");
});

test("current time.estimates active versions reproduce the module total and IDs", async () => {
  const result = await inspectCurrentEstimateFixture();
  const allLikelyMinutes = estimates.estimates.reduce(
    (total, estimate) => total + estimate.likely_minutes,
    0,
  );

  assert.equal(result.activeAdapterCount, 1);
  assert.equal(result.activeEstimateCount, 3);
  assert.equal(result.sourceLikelyMinutes, 2640);
  assert.equal(result.moduleLikelyMinutes, 2640);
  assert.equal(result.estimatesRevisionMatches, true);
  assert.equal(allLikelyMinutes, 4200, "inactive superseded estimate stays excluded");
  assert.deepEqual(new Set(result.moduleEstimateIds), new Set(result.activeEstimateIds));
  assert.deepEqual(result.taskIds, ["time-reference-prototype"]);
  assert.deepEqual(
    new Set(result.itemIds),
    new Set(report.tasks[0].completed_items.concat(report.tasks[0].pending_items).map((item) => item.id)),
  );
  assert.equal(result.shadowParity, true);
  assert.deepEqual(result.differences, []);
});
