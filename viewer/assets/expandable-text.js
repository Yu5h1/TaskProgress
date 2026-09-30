/** Framework-independent plain-text disclosure. Owns the children of an empty host. */
export function expandableText(host, options = {}) {
  const doc = host.ownerDocument;
  const win = doc.defaultView;
  const content = doc.createElement("div");
  const textNode = doc.createElement("span");
  const button = doc.createElement("button");
  const prefix = doc.createElement("span");
  const label = doc.createElement("span");
  label.className = "expandable-text__label";
  button.append(prefix, label);
  content.className = "expandable-text__content";
  button.className = "expandable-text__toggle";
  button.type = "button";
  host.classList.add("expandable-text");
  content.append(textNode, button);
  host.append(content);
  let settings;
  let expanded = false;
  let frame = 0;
  let destroyed = false;
  let characters = [];

  function render() {
    const caption = String(expanded ? settings.lessLabel : settings.moreLabel);
    const ellipsis = expanded ? "" : (caption.match(/^(?:…|\.{3})/)?.[0] ?? "");
    prefix.textContent = ellipsis;
    label.textContent = caption.slice(ellipsis.length);
    button.setAttribute("aria-expanded", String(expanded));
  }

  function measure() {
    frame = 0;
    if (!content.getClientRects().length || !content.clientWidth) return;
    const lineHeight = parseFloat(win.getComputedStyle(content).lineHeight);
    const limit = lineHeight * settings.lines + 1;
    // Measure full text without the control, then reserve its actual inline width.
    textNode.textContent = settings.text;
    // Remove from line flow without hiding a focused toggle during measurement.
    button.style.position = "absolute";
    const overflowing = content.scrollHeight > limit;
    button.style.position = "";
    button.hidden = !overflowing;
    if (!overflowing && expanded) {
      expanded = false;
      render();
    }
    if (overflowing && !expanded) {
      let low = 0;
      let high = characters.length;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        textNode.textContent = characters.slice(0, middle).join("").replace(/[ \t]+$/u, "");
        if (content.scrollHeight <= limit) low = middle;
        else high = middle - 1;
      }
      textNode.textContent = characters.slice(0, low).join("").replace(/[ \t]+$/u, "");
    }
  }

  function schedule() {
    if (!destroyed && !frame) frame = win.requestAnimationFrame(measure);
  }

  function update(next = {}) {
    const text = String(next.text ?? "");
    const lines = Number.isInteger(next.lines) && next.lines > 0 ? next.lines : 2;
    if (!settings || settings.text !== text || settings.lines !== lines) expanded = false;
    settings = { text, lines, moreLabel: next.moreLabel ?? "…更多", lessLabel: next.lessLabel ?? "收合" };
    // Keep emoji and combined characters intact at the truncation boundary.
    characters = typeof Intl.Segmenter === "function"
      ? Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), part => part.segment)
      : Array.from(text);
    textNode.textContent = text;
    render();
    schedule();
  }

  function toggle() {
    expanded = !expanded;
    render();
    schedule();
  }

  button.hidden = true;
  button.addEventListener("click", toggle);
  const observer = new win.ResizeObserver(schedule);
  observer.observe(content);
  doc.fonts?.addEventListener("loadingdone", schedule);
  update(options);
  return {
    update,
    destroy() {
      destroyed = true;
      win.cancelAnimationFrame(frame);
      observer.disconnect();
      doc.fonts?.removeEventListener("loadingdone", schedule);
      button.removeEventListener("click", toggle);
      content.remove();
      host.classList.remove("expandable-text");
    },
  };
}
