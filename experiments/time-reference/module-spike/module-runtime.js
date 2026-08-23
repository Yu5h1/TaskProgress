const ACTIVE_OPERATIONS = new Set(["inspect", "render"]);
const PASSIVE_OPERATIONS = new Set(["inspect"]);
const KNOWN_OPERATIONS = new Set([
  "inspect",
  "render",
  "start",
  "preview",
  "save",
  "route_mutation",
]);

export const EXPERIMENT_MODES = Object.freeze({
  fixture: "fixture",
  passiveShadow: "passive_shadow",
  isolatedPreview: "isolated_preview",
  productionCutover: "production_cutover",
});

function capabilityBoundary(role, allowed) {
  return Object.freeze({
    role,
    allows(operation) {
      return allowed.has(operation);
    },
    assert(operation) {
      if (!KNOWN_OPERATIONS.has(operation)) throw new Error(`未知 module operation：${operation}`);
      if (!allowed.has(operation)) {
        throw new Error(`${role} 不允許 module operation：${operation}`);
      }
    },
  });
}
export function createTrustedModuleRegistry(definitions) {
  const modules = new Map();
  definitions.forEach((definition) => {
    if (!definition || typeof definition.type !== "string" || typeof definition.inspect !== "function") {
      throw new TypeError("module definition 必須提供 type 與 inspect()。");
    }
    if (modules.has(definition.type)) {
      throw new Error(`可信任 module type「${definition.type}」重複。`);
    }
    modules.set(definition.type, definition);
  });
  return Object.freeze({
    inspect(input) {
      const definition = modules.get(input.descriptor.type);
      if (!definition) throw new Error(`未安裝 module type：${input.descriptor.type}`);
      return definition.inspect(input);
    },
    types() {
      return Object.freeze([...modules.keys()]);
    },
  });
}

async function inspectAdapter(adapter, context, registry) {
  const inputs = await adapter.discover(context);
  return Object.freeze(inputs.map((input) => registry.inspect(input)));
}

function compareSemanticModules(activeModules, shadowModules) {
  const active = activeModules.map((module) => module.semantic);
  const shadow = shadowModules.map((module) => module.semantic);
  const matches = JSON.stringify(active) === JSON.stringify(shadow);
  return Object.freeze({
    matches,
    active_count: active.length,
    shadow_count: shadow.length,
    differences: Object.freeze(matches ? [] : ["normalized_semantic_result"]),
  });
}

function activeResult(adapter, modules) {
  return Object.freeze({
    adapter_id: adapter.id,
    modules,
    capabilities: capabilityBoundary("active", ACTIVE_OPERATIONS),
  });
}

function passiveResult(adapter, modules, role = "shadow") {
  return Object.freeze({
    adapter_id: adapter.id,
    modules,
    capabilities: capabilityBoundary(role, PASSIVE_OPERATIONS),
  });
}

export async function runExperimentalComposition({
  mode,
  report,
  manifest,
  readJson,
  registry,
  legacyAdapter,
  manifestAdapter,
}) {
  const context = { report, manifest, readJson };
  if (!Object.values(EXPERIMENT_MODES).includes(mode)) {
    throw new Error(`未知 experiment mode：${mode}`);
  }

  if (mode === EXPERIMENT_MODES.fixture) {
    const modules = await inspectAdapter(manifestAdapter, context, registry);
    return Object.freeze({
      mode,
      active: null,
      fixture: passiveResult(manifestAdapter, modules, "fixture"),
      shadow: null,
      comparison: null,
      active_adapter_count: 0,
    });
  }

  if (mode === EXPERIMENT_MODES.passiveShadow) {
    const activeModules = await inspectAdapter(legacyAdapter, context, registry);
    const shadowModules = await inspectAdapter(manifestAdapter, context, registry);
    return Object.freeze({
      mode,
      active: activeResult(legacyAdapter, activeModules),
      fixture: null,
      shadow: passiveResult(manifestAdapter, shadowModules),
      comparison: compareSemanticModules(activeModules, shadowModules),
      active_adapter_count: 1,
    });
  }

  if (mode === EXPERIMENT_MODES.isolatedPreview) {
    const modules = await inspectAdapter(manifestAdapter, context, registry);
    return Object.freeze({
      mode,
      active: activeResult(manifestAdapter, modules),
      fixture: null,
      shadow: null,
      comparison: null,
      active_adapter_count: 1,
    });
  }

  const adapter = manifest ? manifestAdapter : legacyAdapter;
  const modules = await inspectAdapter(adapter, context, registry);
  return Object.freeze({
    mode,
    active: activeResult(adapter, modules),
    fixture: null,
    shadow: null,
    comparison: null,
    active_adapter_count: 1,
  });
}
