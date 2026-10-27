/*
 * Long press (hold) on one element, per the UX Input specification 3.0.1
 * (`UX/Documentation/ModuleSpec/Foundation/Input.md`, INPUT-PRESS-HOLD,
 * INPUT-PRESS-SUPPRESS, INPUT-CANCEL): `hold` fires once after `holdDuration`
 * while the pointer stays within `dragThreshold`; after a hold, a move past the
 * threshold, a release outside the target or an interruption, that pointer's
 * native click is suppressed so only a tap activates. Ported from the Web
 * implementation (`Web/src/ui/long-press.ts`), which is the specification's
 * source baseline; defaults are the Input design data values.
 */
export const HOLD_DURATION_MS = 400;
export const DRAG_THRESHOLD_PX = 6;

const scale = (size, layout) => (size > 0 && layout > 0 ? size / layout : 1);

export function bindLongPress(target, options) {
  const delay = options.delay ?? HOLD_DURATION_MS;
  const tolerance = options.tolerance ?? DRAG_THRESHOLD_PX;
  const doc = target.ownerDocument;
  const view = doc.defaultView;
  const abort = new AbortController();
  let press;
  let timer;
  let fired = false;
  let suppressPointer;
  let disposed = false;
  const on = (node, name, listener, capture = false) => node.addEventListener(name, listener, { signal: abort.signal, capture });
  const cancel = () => {
    const id = press?.event.pointerId;
    press = undefined;
    fired = false;
    clearTimeout(timer);
    timer = undefined;
    if (options.capture !== false && id !== undefined && target.hasPointerCapture?.(id)) target.releasePointerCapture(id);
  };
  const interrupt = () => {
    const wasActive = Boolean(press);
    if (press) suppressPointer = press.event.pointerId;
    cancel();
    if (wasActive) options.onCancel?.();
  };
  const outside = (event) => {
    const rect = target.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  on(target, "pointerdown", (event) => {
    if (disposed || press || !event.isPrimary || event.button !== 0 || target.matches(":disabled")) return;
    if (options.accept && !options.accept(event)) return;
    const rect = target.getBoundingClientRect();
    suppressPointer = undefined;
    press = { event, sx: scale(rect.width, target.offsetWidth), sy: scale(rect.height, target.offsetHeight) };
    if (options.capture !== false) try { target.setPointerCapture(event.pointerId); } catch { /* no active native pointer */ }
    options.onStart?.(event);
    timer = setTimeout(() => {
      timer = undefined;
      if (press?.event !== event || disposed || !target.isConnected || target.matches(":disabled")) { cancel(); return; }
      fired = true;
      suppressPointer = event.pointerId;
      options.onTrigger(event);
    }, delay);
  });
  on(doc, "pointerdown", (event) => { if (press && event.pointerId !== press.event.pointerId) interrupt(); });
  on(doc, "pointermove", (event) => {
    if (!press || event.pointerId !== press.event.pointerId) return;
    if (fired) { options.onMove?.(event); return; }
    const dx = (event.clientX - press.event.clientX) / press.sx;
    const dy = (event.clientY - press.event.clientY) / press.sy;
    if (Math.hypot(dx, dy) > tolerance) interrupt();
  });
  on(doc, "pointerup", (event) => {
    if (event.pointerId !== press?.event.pointerId) return;
    if (fired) { cancel(); options.onEnd?.(event); }
    else if (outside(event)) interrupt();
    else cancel();
  });
  on(doc, "pointercancel", (event) => { if (event.pointerId === press?.event.pointerId) interrupt(); });
  on(target, "lostpointercapture", (event) => { if (event.pointerId === press?.event.pointerId) interrupt(); });
  on(target, "click", (event) => {
    if (suppressPointer === undefined || event.detail === 0) return;
    if ("pointerId" in event && event.pointerId !== suppressPointer) return;
    suppressPointer = undefined;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  on(target, "contextmenu", (event) => { if (fired) event.preventDefault(); else interrupt(); });
  on(doc, "keydown", (event) => { if (event.key === "Escape") interrupt(); }, true);
  if (view) { on(view, "blur", interrupt); on(view, "resize", interrupt); }
  on(doc, "scroll", interrupt, true);
  on(doc, "visibilitychange", () => { if (doc.hidden) interrupt(); });
  return {
    get isHolding() { return fired; },
    cancel,
    dispose() {
      if (disposed) return;
      disposed = true;
      try { interrupt(); } finally { abort.abort(); }
    },
  };
}
