/**
 * Selection as a behavior any collection can attach to: a set of stable keys, a range anchor and a
 * focus, never positions. The host supplies the current order when a command needs one, so several
 * collections (one per task card) can share one selection. Framework-free; `subscribe` follows the
 * store contract so a Svelte view can read it with `$selection`.
 */
export function createSelection() {
  let state = Object.freeze({ keys: new Set(), anchor: null, focus: null });
  const listeners = new Set();

  function set(keys, anchor, focus) {
    state = Object.freeze({ keys, anchor, focus });
    listeners.forEach(listener => listener(state));
    return state;
  }

  function range(from, to, order) {
    const start = order.indexOf(from);
    const end = order.indexOf(to);
    if (start < 0 || end < 0) return [to];
    return order.slice(Math.min(start, end), Math.max(start, end) + 1);
  }

  return Object.freeze({
    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
    get state() {
      return state;
    },
    has(key) {
      return state.keys.has(key);
    },
    /** Selects only `key`. */
    select(key) {
      return set(new Set([key]), key, key);
    },
    /** Adds or removes `key`, keeping the rest. */
    toggle(key) {
      const keys = new Set(state.keys);
      if (keys.has(key)) keys.delete(key);
      else keys.add(key);
      return set(keys, key, key);
    },
    /** Selects every key from the anchor to `key` in `order`, replacing the rest. */
    extendTo(key, order) {
      const anchor = state.anchor ?? key;
      return set(new Set(range(anchor, key, order)), anchor, key);
    },
    /** Moves the focus to `key` without changing what is selected. */
    focusOn(key) {
      if (state.focus === key) return state;
      return set(state.keys, state.anchor, key);
    },
    /** Selects every key in `order`, keeping the focus. */
    selectAll(order) {
      return set(new Set(order), order[0] ?? null, state.focus ?? order[0] ?? null);
    },
    /** Moves the focus by `delta` in `order`; with `extend`, the range follows it. Returns the new focus. */
    moveFocus(delta, order, { extend = false } = {}) {
      if (!order.length) return null;
      const current = order.indexOf(state.focus);
      const next = order[current < 0 ? 0 : Math.min(order.length - 1, Math.max(0, current + delta))];
      if (extend) {
        const anchor = state.anchor ?? state.focus ?? next;
        set(new Set(range(anchor, next, order)), anchor, next);
      } else {
        set(state.keys, state.anchor, next);
      }
      return next;
    },
    /** Keeps only keys still present in `order`, such as after a filter or a reload. */
    retain(order) {
      const present = new Set(order);
      const keys = new Set([...state.keys].filter(key => present.has(key)));
      if (keys.size === state.keys.size && present.has(state.focus)) return state;
      return set(keys, present.has(state.anchor) ? state.anchor : null, present.has(state.focus) ? state.focus : null);
    },
    clear() {
      if (!state.keys.size && state.anchor === null && state.focus === null) return state;
      return set(new Set(), null, null);
    },
    /** Selected keys in `order`. */
    ordered(order) {
      return order.filter(key => state.keys.has(key));
    },
  });
}
