/** Framework-independent text disclosure with safe inline links. Owns an empty host's children. */
import { createInlineLink, inlineUnits } from "./inline-links.js";
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
  const meter = doc.createElement("div");
  const meterText = doc.createElement("span");
  const meterButton = doc.createElement("button");
  meter.className = "expandable-text__content expandable-text__measure";
  meter.setAttribute("aria-hidden", "true");
  meter.inert = true;
  meterButton.className = "expandable-text__toggle";
  meter.append(meterText, meterButton);
  host.append(meter);
  let settings;
  let expanded = false;
  let frame = 0;
  let destroyed = false;
  let pieces = [], visibleNodes = [], measuringNodes = [], unitCount = 0;

  function createNodes(parent) {
    parent.replaceChildren();
    return pieces.map(piece => {
      const node = piece.href ? createInlineLink(doc, piece, { emphasis: settings.emphasis }) : doc.createElement("span");
      parent.append(node);
      return node;
    });
  }

  function showPrefix(nodes, count) {
    pieces.forEach((piece, index) => {
      const take = Math.max(0, Math.min(count, piece.units.length));
      count -= take;
      if (piece.href) nodes[index].hidden = !take;
      else nodes[index].textContent = piece.units.slice(0, take).join("");
    });
  }

  function render() {
    const caption = String(expanded ? settings.lessLabel : settings.moreLabel);
    const ellipsis = expanded ? "" : (caption.match(/^(?:…|\.{3})/)?.[0] ?? "");
    prefix.textContent = ellipsis;
    label.textContent = caption.slice(ellipsis.length);
    button.setAttribute("aria-expanded", String(expanded));
    meterButton.textContent = caption;
  }

  function measure() {
    frame = 0;
    if (!content.getClientRects().length || !content.clientWidth) return;
    const lineHeight = parseFloat(win.getComputedStyle(content).lineHeight);
    const limit = lineHeight * settings.lines + 1;
    // Measure offscreen so resizing cannot detach or temporarily hide a focused link.
    meter.style.width = `${content.clientWidth}px`;
    showPrefix(measuringNodes, unitCount);
    meterButton.hidden = true;
    const overflowing = meter.scrollHeight > limit;
    meterButton.hidden = !overflowing;
    button.hidden = !overflowing;
    if (overflowing && visibleNodes.some((node, index) => pieces[index].href && node === doc.activeElement)) {
      expanded = true;
      render();
    }
    if (!overflowing && expanded) {
      expanded = false;
      render();
    }
    if (overflowing && !expanded) {
      let low = 0;
      let high = unitCount;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        showPrefix(measuringNodes, middle);
        if (meter.scrollHeight <= limit) low = middle;
        else high = middle - 1;
      }
      showPrefix(visibleNodes, low);
    } else showPrefix(visibleNodes, unitCount);
  }

  function schedule() {
    if (!destroyed && !frame) frame = win.requestAnimationFrame(measure);
  }

  function update(next = {}) {
    const text = String(next.text ?? "");
    const lines = Number.isInteger(next.lines) && next.lines > 0 ? next.lines : 2;
    const emphasis = next.emphasis === true;
    const textChanged = !settings || settings.text !== text || settings.emphasis !== emphasis;
    const open = next.expanded === true;
    if (textChanged || settings.lines !== lines) expanded = open;
    else if (open && !settings.open) expanded = true;
    settings = { text, lines, open, emphasis, moreLabel: next.moreLabel ?? "…更多", lessLabel: next.lessLabel ?? "收合" };
    if (textChanged) {
      pieces = inlineUnits(text);
      unitCount = pieces.reduce((total, piece) => total + piece.units.length, 0);
      visibleNodes = createNodes(textNode);
      measuringNodes = createNodes(meterText);
      showPrefix(visibleNodes, unitCount);
    }
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
      meter.remove();
      host.classList.remove("expandable-text");
    },
  };
}
