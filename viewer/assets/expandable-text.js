/** Framework-independent plain-text disclosure. Owns the children of an empty host. */
export function expandableText(host, options = {}) {
  const doc = host.ownerDocument;
  const win = doc.defaultView;
  const content = doc.createElement("div");
  const button = doc.createElement("button");
  content.className = "expandable-text__content";
  button.className = "expandable-text__toggle";
  button.type = "button";
  host.classList.add("expandable-text");
  host.append(content, button);
  let settings;
  let expanded = false;
  let frame = 0;
  let destroyed = false;

  function render() {
    content.style.webkitLineClamp = expanded ? "unset" : String(settings.lines);
    button.textContent = expanded ? settings.lessLabel : settings.moreLabel;
    button.setAttribute("aria-expanded", String(expanded));
  }

  function measure() {
    frame = 0;
    if (!content.getClientRects().length || !content.clientWidth) return;
    const lineHeight = parseFloat(win.getComputedStyle(content).lineHeight);
    const overflowing = content.scrollHeight > lineHeight * settings.lines + 1;
    button.hidden = !overflowing;
    if (!overflowing && expanded) {
      expanded = false;
      render();
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
    content.textContent = text;
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
      button.remove();
      host.classList.remove("expandable-text");
    },
  };
}
