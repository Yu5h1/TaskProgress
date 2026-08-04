/*
 * UI host boundary.
 *
 * The host owns data, commands and persistence; a UI implementation owns how
 * that data becomes pixels. The contract between them is deliberately narrow —
 * mount, update, destroy — so replacing the UI technology means writing one
 * adapter, not rewriting the host.
 *
 * What crosses the boundary is plain data going in and callbacks coming out.
 * DOM nodes do not: the moment the host reaches inside a rendered view, the
 * contract stops being narrow and the implementation stops being replaceable.
 *
 * Exactly one implementation is registered at a time. The boundary makes a
 * swap cheap; it does not make two simultaneous implementations safe. Two live
 * implementations of the same screen drift, which is the problem this exists
 * to end.
 */

const registry = new Map();
let activeId = null;

function assertAdapter(adapter) {
  if (!adapter || typeof adapter !== "object") {
    throw new TypeError("UI adapter 必須是物件。");
  }
  if (typeof adapter.id !== "string" || !adapter.id) {
    throw new TypeError("UI adapter 需要穩定的 id。");
  }
  for (const method of ["mount", "update", "destroy"]) {
    if (typeof adapter[method] !== "function") {
      throw new TypeError(`UI adapter「${adapter.id}」缺少 ${method}()。`);
    }
  }
}

export function registerUiAdapter(adapter) {
  assertAdapter(adapter);
  registry.set(adapter.id, adapter);
  activeId ??= adapter.id;
  return adapter.id;
}

export function useUiAdapter(id) {
  if (!registry.has(id)) throw new Error(`UI adapter「${id}」尚未註冊。`);
  activeId = id;
  return id;
}

export function activeUiAdapter() {
  return activeId ? registry.get(activeId) ?? null : null;
}

export function registeredUiAdapters() {
  return [...registry.keys()];
}

export function resetUiAdapters() {
  registry.clear();
  activeId = null;
}

/*
 * A view is one mounted region. The host keeps the handle, not the nodes, so
 * re-rendering is `view.update(props)` regardless of which implementation is
 * active — an imperative adapter rebuilds, a reactive one diffs, and the host
 * never needs to know which.
 */
export function createUiView(target, props = {}) {
  const adapter = activeUiAdapter();
  if (!adapter) throw new Error("尚未註冊任何 UI adapter。");
  if (!target) throw new TypeError("UI view 需要掛載目標。");

  let instance = adapter.mount(target, props);
  let destroyed = false;

  return {
    adapterId: adapter.id,
    update(nextProps = {}) {
      if (destroyed) throw new Error("UI view 已銷毀。");
      instance = adapter.update(instance, nextProps) ?? instance;
      return this;
    },
    destroy() {
      if (destroyed) return;
      adapter.destroy(instance);
      destroyed = true;
    },
    get destroyed() {
      return destroyed;
    },
  };
}
