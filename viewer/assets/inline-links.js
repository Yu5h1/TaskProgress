// Parses only inline Markdown links; all other content remains literal text.
export function safeInlineHref(value) {
  if (!value || /[\u0000-\u0020\u007f\\]/u.test(value)) return null;
  try {
    const url = new URL(value, "https://taskprogress.invalid/");
    return ["http:", "https:"].includes(url.protocol) ? value : null;
  } catch { return null; }
}

export function parseInlineLinks(value) {
  const text = String(value ?? "");
  const parts = [];
  const pattern = /\[([^\]\n]+)\]\(/gu;
  let previous = 0, match;
  while ((match = pattern.exec(text))) {
    if (match.index > 0 && ["!", "\\"].includes(text[match.index - 1])) continue;
    let end = pattern.lastIndex, depth = 1;
    for (; end < text.length && depth; end++) {
      if (text[end] === "(") depth++;
      if (text[end] === ")") depth--;
      if (text[end] === "\n") break;
    }
    if (depth) continue;
    const href = safeInlineHref(text.slice(pattern.lastIndex, end - 1));
    if (!href) { pattern.lastIndex = end; continue; }
    if (match.index > previous) parts.push({text: text.slice(previous, match.index)});
    parts.push({text: match[1], href});
    previous = end;
    pattern.lastIndex = end;
  }
  if (previous < text.length) parts.push({text: text.slice(previous)});
  return parts;
}

/**
 * Creates the one link element every surface uses for a parsed `[label](URL)` part.
 * `emphasis` marks links inside descriptive text, which render bold.
 */
export function createInlineLink(doc, part, { emphasis = false } = {}) {
  const link = doc.createElement("a");
  link.className = emphasis ? "inline-link inline-link--emphasis" : "inline-link";
  link.setAttribute("href", part.href);
  link.setAttribute("rel", "noopener noreferrer");
  link.textContent = part.text;
  return link;
}

/** Replaces the host's children with the full text, rendering safe inline links through `createInlineLink`. */
export function renderInlineLinks(host, text, options = {}) {
  const doc = host.ownerDocument;
  host.replaceChildren(...parseInlineLinks(text).map(part => (
    part.href ? createInlineLink(doc, part, options) : doc.createTextNode(part.text)
  )));
}

/** Svelte-style action around `renderInlineLinks`; options are `{ text, emphasis }`. */
export function inlineLinks(host, options = {}) {
  let current = null;
  function update(next = {}) {
    const text = String(next.text ?? "");
    const emphasis = next.emphasis === true;
    if (current && current.text === text && current.emphasis === emphasis) return;
    current = { text, emphasis };
    renderInlineLinks(host, text, { emphasis });
  }
  update(options);
  return { update, destroy() { host.replaceChildren(); } };
}

export function inlineUnits(text) {
  const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter(undefined, {granularity: "grapheme"}) : null;
  return parseInlineLinks(text).map(part => ({...part, units: part.href ? [part.text] :
    segmenter ? Array.from(segmenter.segment(part.text), entry => entry.segment) : Array.from(part.text)}));
}
