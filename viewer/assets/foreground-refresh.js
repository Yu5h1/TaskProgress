function requireEventTarget(value, label) {
  if (!value
    || typeof value.addEventListener !== "function"
    || typeof value.removeEventListener !== "function") {
    throw new TypeError(`${label} 必須支援事件監聽。`);
  }
  return value;
}

/*
 * Browser-host lifecycle only. The caller owns the meaning of "safe": this
 * helper knows nothing about report drafts, Checklist persistence, or the
 * transport that will reload their source. A leave event arms one refresh;
 * focus and visibility may both announce the same return, so a microtask is
 * enough to coalesce them without introducing a timer or polling lifecycle.
 */
export function installForegroundRefresh({
  windowTarget = globalThis.window,
  documentTarget = globalThis.document,
  canRefresh = () => true,
  reload = () => windowTarget.location.reload(),
  schedule = (callback) => globalThis.queueMicrotask(callback),
} = {}) {
  requireEventTarget(windowTarget, "windowTarget");
  requireEventTarget(documentTarget, "documentTarget");
  if (typeof canRefresh !== "function") throw new TypeError("canRefresh 必須是函式。");
  if (typeof reload !== "function") throw new TypeError("reload 必須是函式。");
  if (typeof schedule !== "function") throw new TypeError("schedule 必須是函式。");

  let armed = false;
  let scheduled = false;
  let refreshing = false;
  let disposed = false;

  function arm() {
    if (disposed || refreshing) return;
    armed = true;
  }

  function run() {
    scheduled = false;
    if (disposed || refreshing || !armed) return;
    // One return cycle gets one decision. A later focus event from the same
    // foreground transition must not turn a previously unsafe return into a
    // reload; another leave event is required to arm the next decision.
    armed = false;
    if (canRefresh() !== true) return;
    refreshing = true;
    reload();
  }

  function request() {
    if (disposed || refreshing || scheduled || !armed) return;
    scheduled = true;
    schedule(run);
  }

  function onVisibilityChange() {
    if (documentTarget.visibilityState === "hidden") arm();
    else if (documentTarget.visibilityState === "visible") request();
  }

  windowTarget.addEventListener("blur", arm);
  windowTarget.addEventListener("focus", request);
  documentTarget.addEventListener("visibilitychange", onVisibilityChange);

  return function disposeForegroundRefresh() {
    if (disposed) return;
    disposed = true;
    armed = false;
    windowTarget.removeEventListener("blur", arm);
    windowTarget.removeEventListener("focus", request);
    documentTarget.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
