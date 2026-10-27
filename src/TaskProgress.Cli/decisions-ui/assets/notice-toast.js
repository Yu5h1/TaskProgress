/*
 * One transient notice for the result of a page action (a preview reorder,
 * a Next write, undo/redo, entering edit mode). A new notice replaces the
 * current one instead of stacking, fades out on its own, and is always
 * mirrored to the console so the developer log keeps every message. Load
 * diagnostics that describe the page's own state stay in the banner region.
 */
const DEFAULT_DURATION_MS = 4000;
const FADE_MS = 400;
const SVG_NS = "http://www.w3.org/2000/svg";

// The tone's shape filled in the tone colour, the glyph cut out in the panel colour.
const ICONS = Object.freeze({
  info: { shape: ["circle", { cx: "12", cy: "12", r: "10" }], glyph: "M9.2 9.3a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.4-2.8 4.2M12 17.6v.1" },
  warning: { shape: ["path", { d: "M10.3 3.6 1.9 18.2A2 2 0 0 0 3.6 21h16.8a2 2 0 0 0 1.7-2.8L13.7 3.6a2 2 0 0 0-3.4 0Z" }], glyph: "M12 9v4.6M12 17.4v.1" },
  error: { shape: ["circle", { cx: "12", cy: "12", r: "10" }], glyph: "m8.6 8.6 6.8 6.8m0-6.8-6.8 6.8" },
});

function createIcon(document, tone) {
  const { shape, glyph } = ICONS[tone];
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "notice-toast-icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const fill = document.createElementNS(SVG_NS, shape[0]);
  for (const [name, value] of Object.entries(shape[1])) fill.setAttribute(name, value);
  fill.setAttribute("class", "notice-toast-icon-shape");
  const mark = document.createElementNS(SVG_NS, "path");
  mark.setAttribute("d", glyph);
  mark.setAttribute("class", "notice-toast-icon-glyph");
  svg.append(fill, mark);
  return svg;
}

export function createNoticeToast(document, { duration = DEFAULT_DURATION_MS, logger = console } = {}) {
  let host = null;
  let icon = null;
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
    icon = document.createElement("span");
    icon.className = "notice-toast-icon-slot";
    text = document.createElement("p");
    host.append(icon, text);
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
    icon.replaceChildren(createIcon(document, tone));
    text.textContent = message;
    host.hidden = false;
    void host.offsetWidth;
    host.classList.add("notice-toast-visible");
    hideTimer = setTimeout(hide, duration);
  }

  return Object.freeze({ show, hide });
}
