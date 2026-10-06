// Consume the activation gesture after leaving an editable page, including foreground reloads.
export function installFocusShield({
  windowTarget = globalThis.window,
  documentTarget = globalThis.document,
  storage,
  key = `taskprogress.focus-shield.v1:${windowTarget.location.pathname}`,
  onChange = () => {},
} = {}) {
  const focused = () => documentTarget.visibilityState !== "hidden" && documentTarget.hasFocus();
  let blocked = !focused();
  try { blocked ||= (storage ?? globalThis.sessionStorage).getItem(key) === "blocked"; } catch {}
  let activationKey = null;
  const publish = () => {
    try {
      const cache = storage ?? globalThis.sessionStorage;
      if (blocked) cache.setItem(key, "blocked"); else cache.removeItem(key);
    } catch {}
    onChange(blocked);
  };
  const lock = () => { blocked = true; activationKey = null; publish(); };
  const visibility = () => { if (documentTarget.visibilityState === "hidden") lock(); };
  const stop = event => { event.preventDefault(); event.stopImmediatePropagation(); };
  function intercept(event) {
    if (!blocked) return;
    stop(event);
    if (!focused()) return;
    if (event.type === "keydown" && !event.repeat && ["Enter", " "].includes(event.key)) activationKey = event.key;
    if ((event.type === "click" && event.button === 0) ||
        (event.type === "keyup" && activationKey === event.key)) {
      activationKey = null;
      blocked = false;
      publish();
    }
  }
  const events = ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "dblclick", "keydown", "keyup", "beforeinput", "input", "change", "submit"];
  windowTarget.addEventListener("blur", lock);
  documentTarget.addEventListener("visibilitychange", visibility);
  for (const type of events) windowTarget.addEventListener(type, intercept, true);
  publish();
  return () => {
    windowTarget.removeEventListener("blur", lock);
    documentTarget.removeEventListener("visibilitychange", visibility);
    for (const type of events) windowTarget.removeEventListener(type, intercept, true);
  };
}
