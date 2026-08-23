import { readFile } from "node:fs/promises";

import {
  createLegacyTimeDiscoveryAdapter,
  createManifestDiscoveryAdapter,
} from "./module-contract.js";
import {
  createTrustedModuleRegistry,
  EXPERIMENT_MODES,
  runExperimentalComposition,
} from "./module-runtime.js";
import { createTimeModuleDefinition } from "./time-module.js";

const exampleRoot = new URL("../examples/", import.meta.url);

async function readExample(name) {
  return JSON.parse(await readFile(new URL(name, exampleRoot), "utf8"));
}

function currentManifest(report) {
  return {
    schema_version: "0.1",
    report_id: report.report_id,
    scope_id: report.scope_id,
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

function summarizeActiveEstimates(estimates) {
  const active = estimates.estimates.filter((estimate) => estimate.active);
  const targets = new Set();
  active.forEach((estimate) => {
    const target = `${estimate.task_id}/${estimate.item_id ?? "@task"}`;
    if (targets.has(target)) throw new Error(`active estimate target 重複：${target}`);
    targets.add(target);
  });
  return Object.freeze({
    count: active.length,
    likelyMinutes: active.reduce((total, estimate) => total + estimate.likely_minutes, 0),
    estimateIds: Object.freeze(active.map((estimate) => estimate.estimate_id)),
    itemIds: Object.freeze(active.map((estimate) => estimate.item_id).filter(Boolean)),
  });
}

export async function inspectCurrentEstimateFixture() {
  const [report, estimates, analysis] = await Promise.all([
    readExample("report.json"),
    readExample("time.estimates.json"),
    readExample("time.analysis.json"),
  ]);
  const files = new Map([["time.analysis.json", analysis]]);
  const readJson = async (source) => files.get(source);
  const composition = await runExperimentalComposition({
    mode: EXPERIMENT_MODES.passiveShadow,
    report,
    manifest: currentManifest(report),
    readJson,
    registry: createTrustedModuleRegistry([createTimeModuleDefinition()]),
    legacyAdapter: createLegacyTimeDiscoveryAdapter(),
    manifestAdapter: createManifestDiscoveryAdapter(),
  });
  const source = summarizeActiveEstimates(estimates);
  const moduleSemantic = composition.active.modules[0].semantic;
  const moduleEstimateIds = moduleSemantic.tasks.flatMap(
    (task) => task.items.map((item) => item.estimate_id),
  );
  return Object.freeze({
    scopeId: report.scope_id,
    activeAdapter: composition.active.adapter_id,
    shadowAdapter: composition.shadow.adapter_id,
    activeAdapterCount: composition.active_adapter_count,
    activeEstimateCount: source.count,
    activeEstimateIds: source.estimateIds,
    moduleEstimateIds: Object.freeze(moduleEstimateIds),
    sourceLikelyMinutes: source.likelyMinutes,
    moduleLikelyMinutes: moduleSemantic.summary.total_estimated_minutes,
    estimatesRevisionMatches:
      estimates.updated_at === analysis.inputs.estimates_updated_at,
    taskIds: Object.freeze(moduleSemantic.tasks.map((task) => task.task_id)),
    itemIds: source.itemIds,
    shadowParity: composition.comparison.matches,
    differences: composition.comparison.differences,
  });
}
