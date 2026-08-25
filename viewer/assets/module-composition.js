/*
 * The registry-driven module lifecycle — the loop that was missing between
 * `module-registry.js` (which types have a trusted implementation) and the
 * Viewer (which actually renders). Without it the registry was built and
 * tested but unused, and `app.js` still named Time directly when building
 * the main-panel strip.
 *
 * What made this shape derivable rather than guesswork: the main-panel slot
 * now renders through the shared capsule strip, which takes an *array* of
 * capsule descriptors. Collecting that array from N modules is the loop; when
 * the host mounted one standalone button there was no array to fill and any
 * lifecycle written for it would have been invented.
 *
 * Pure: no DOM, no fetch, no clock. Attaching gives each module an instance;
 * the host asks those instances for descriptors and hands them to the strip.
 * Modules never reach the DOM, matching the plan's "Core 收集通過驗證的膠囊
 * 描述" rule.
 */
import { VIEWER_MODULE_SLOTS } from "./module-registry.js";

/*
 * `loaded` is what discovery produced: `[{ type, data, host }]`, where `host`
 * is whatever that module's definition needs from the Viewer and is passed
 * through untouched. A type with no registered definition is skipped with a
 * diagnostic rather than throwing — one unsupported module must not stop the
 * others, and Phase 0 already fixed `unsupported_module_type` as the code.
 */
export function attachModules(registry, loaded = []) {
  const attached = [];
  const diagnostics = [];

  for (const entry of loaded) {
    const definition = registry.get(entry.type);
    if (!definition) {
      diagnostics.push({
        code: "unsupported_module_type",
        type: entry.type,
        message: `沒有已安裝的可信任 Renderer 支援 module type「${entry.type}」。`,
      });
      continue;
    }
    if (!definition.supportedSchemaVersions.includes(entry.schemaVersion)) {
      diagnostics.push({
        code: "unsupported_schema_version",
        type: entry.type,
        message: `module type「${entry.type}」不支援資料版本 ${entry.schemaVersion}。`,
      });
      continue;
    }
    // A module that throws while attaching is isolated here, not allowed to
    // take the report down: the failure boundary the plan requires is only
    // real if the host never sees the exception.
    try {
      attached.push({
        type: definition.type,
        slots: definition.slots,
        instance: definition.attach({ data: entry.data, host: entry.host }),
      });
    } catch (error) {
      diagnostics.push({
        code: "attach_failed",
        type: entry.type,
        message: error instanceof Error
          ? `module type「${entry.type}」初始化失敗：${error.message}`
          : `module type「${entry.type}」初始化失敗。`,
      });
    }
  }

  return { attached: Object.freeze(attached), diagnostics: Object.freeze(diagnostics) };
}

/*
 * One capsule per module that declares the slot and returns a descriptor.
 * Returning `null` is a normal answer — it means "nothing to show right now",
 * not an error — so a module with no data simply contributes no capsule
 * instead of an empty one.
 *
 * A descriptor's `id` must be the module type's capsule id; the host
 * dispatches activation back by that id, so it is the only link between a
 * rendered capsule and the module that owns it.
 *
 * `subject` names which task or stable item the caller is asking about, and
 * is `null` for project-level slots that have no narrower subject. Modules
 * are asked per subject rather than handed the whole report, so a module
 * never sees rows it was not asked about.
 */
export function collectCapsules(attached, slot, subject = null) {
  if (!VIEWER_MODULE_SLOTS.includes(slot)) {
    throw new TypeError(`未知的 Viewer slot：${slot}`);
  }
  const capsules = [];
  const diagnostics = [];

  for (const entry of attached) {
    if (!entry.slots.includes(slot)) continue;
    try {
      const descriptor = entry.instance.capsuleFor?.(slot, subject) ?? null;
      if (descriptor) capsules.push(descriptor);
    } catch (error) {
      diagnostics.push({
        code: "render_failed",
        type: entry.type,
        message: error instanceof Error
          ? `module type「${entry.type}」產生膠囊失敗：${error.message}`
          : `module type「${entry.type}」產生膠囊失敗。`,
      });
    }
  }

  return { capsules: Object.freeze(capsules), diagnostics: Object.freeze(diagnostics) };
}

/*
 * Dispatch a capsule click back to the module that produced it. The host does
 * not know what activation means for any module — Time opens its dialog, a
 * future module may do something else entirely.
 */
export function activateCapsule(attached, slot, capsuleId, subject = null) {
  const entry = attached.find(
    (candidate) => candidate.slots.includes(slot)
      && candidate.instance.ownsCapsule?.(slot, capsuleId),
  );
  if (!entry) return false;
  entry.instance.activate?.(slot, capsuleId, subject);
  return true;
}

/*
 * Scope switch, reload and page unload all end a composition. Every instance
 * gets its `dispose()` called even if an earlier one throws, so one bad
 * module cannot leak the others' timers or listeners.
 */
export function disposeModules(attached) {
  const diagnostics = [];
  for (const entry of attached) {
    try {
      entry.instance.dispose?.();
    } catch (error) {
      diagnostics.push({
        code: "dispose_failed",
        type: entry.type,
        message: error instanceof Error
          ? `module type「${entry.type}」清理失敗：${error.message}`
          : `module type「${entry.type}」清理失敗。`,
      });
    }
  }
  return Object.freeze(diagnostics);
}
