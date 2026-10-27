// Best-effort mouse activation guard. Focus itself never locks keyboard editing.
export function installFocusShield({
  windowTarget = globalThis.window,
  documentTarget = globalThis.document,
  now = () => Date.now(),
  activationWindowMs = 100,
  storage,
  key = `taskprogress.mouse-activation.v2:${windowTarget.location?.pathname ?? ""}`,
} = {}) {
  const focused = () => documentTarget.visibilityState !== "hidden" && documentTarget.hasFocus();
  let away = !focused(), recentFocus = -Infinity, suppressMouse = false, nonMouseSequence = false;
  try {
    const deadline = Number((storage ?? globalThis.sessionStorage).getItem(key));
    if (focused() && deadline > now() && deadline <= now() + activationWindowMs) recentFocus = deadline - activationWindowMs;
  } catch {}
  const clearWindow = () => {
    recentFocus = -Infinity;
    try { (storage ?? globalThis.sessionStorage).removeItem(key); } catch {}
  };
  const leave = () => { away = true; clearWindow(); suppressMouse = false; nonMouseSequence = false; };
  const enter = () => {
    if (!focused() || !away) return;
    away = false;
    recentFocus = now();
    try { (storage ?? globalThis.sessionStorage).setItem(key, String(recentFocus + activationWindowMs)); } catch {}
  };
  const visibility = () => {
    if (documentTarget.visibilityState === "hidden") leave();
    else enter();
  };
  const stop = event => { event.preventDefault(); event.stopImmediatePropagation(); };
  const keyboard = () => { clearWindow(); };
  function intercept(event) {
    if (event.type === "pointerdown") nonMouseSequence = event.pointerType && event.pointerType !== "mouse";
    if (nonMouseSequence || (event.pointerType && event.pointerType !== "mouse")) {
      if (event.type === "click" || event.type === "pointercancel") nonMouseSequence = false;
      return;
    }
    // Keyboard/assistive activation must not be mistaken for a mouse click.
    if (event.type === "click" && event.detail === 0) return;
    const down = event.type === "pointerdown" || event.type === "mousedown";
    const activation = away || !focused() || now() - recentFocus < activationWindowMs;
    if (down) {
      // mousedown follows pointerdown; preserve the decision for that gesture.
      if (event.type === "pointerdown" || !suppressMouse) suppressMouse = activation;
    }
    // Some hosts deliver only the tail of the activation gesture to the page.
    if (!down && activation && ["mouseup", "click", "auxclick"].includes(event.type)) suppressMouse = true;
    if (!suppressMouse) return;
    stop(event);
    if (event.type === "click" || event.type === "auxclick" || event.type === "pointercancel") {
      suppressMouse = false;
      clearWindow();
    }
  }
  const events = ["pointerdown", "pointerup", "pointercancel", "mousedown", "mouseup", "click", "auxclick"];
  windowTarget.addEventListener("blur", leave);
  windowTarget.addEventListener("focus", enter);
  windowTarget.addEventListener("keydown", keyboard, { capture: true });
  documentTarget.addEventListener("visibilitychange", visibility);
  for (const type of events) windowTarget.addEventListener(type, intercept, { capture: true });
  return () => {
    windowTarget.removeEventListener("blur", leave);
    windowTarget.removeEventListener("focus", enter);
    windowTarget.removeEventListener("keydown", keyboard, { capture: true });
    documentTarget.removeEventListener("visibilitychange", visibility);
    for (const type of events) windowTarget.removeEventListener(type, intercept, { capture: true });
  };
}
