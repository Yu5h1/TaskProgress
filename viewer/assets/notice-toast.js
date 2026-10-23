/*
 * One transient notice for the result of a page action (a preview reorder,
 * a Next write, undo/redo, entering edit mode). A new notice replaces the
 * current one instead of stacking, fades out on its own, and is always
 * mirrored to the console so the developer log keeps every message. Load
 * diagnostics that describe the page's own state stay in the banner region.
 */
const DEFAULT_DURATION_MS = 4000;
const FADE_MS = 400;

export function createNoticeToast(document, { duration = DEFAULT_DURATION_MS, logger = console } = {}) {
  let host = null;
  let text = null;
  let hideTimer = null;
  let removeTimer = null;

  function clearTimers() {
    clearTimeout(hideTimer);
    clearTimeout(removeTimer);
  }

  function hide() {
    if (!host) return;
    clearTimers();
    host.classList.remove("notice-toast-visible");
    removeTimer = setTimeout(() => { host.hidden = true; }, FADE_MS);
  }

  function mount() {
    host = document.createElement("div");
    host.className = "notice-toast";
    host.hidden = true;
    text = document.createElement("p");
    host.append(text);
    host.addEventListener("pointerenter", () => clearTimeout(hideTimer));
    host.addEventListener("pointerleave", () => {
      if (!host.hidden) hideTimer = setTimeout(hide, duration);
    });
    host.addEventListener("click", hide);
    document.body.append(host);
  }

  function show({ level = "error", message }) {
    const tone = level === "warning" ? "warning" : level === "info" ? "info" : "error";
    const log = tone === "error" ? logger.error : tone === "warning" ? logger.warn : logger.info;
    log.call(logger, `[viewer] ${message}`);
    if (!host) mount();
    clearTimers();
    host.dataset.level = tone;
    host.setAttribute("role", tone === "error" ? "alert" : "status");
    text.textContent = message;
    host.hidden = false;
    void host.offsetWidth;
    host.classList.add("notice-toast-visible");
    hideTimer = setTimeout(hide, duration);
  }

  return Object.freeze({ show, hide });
}
