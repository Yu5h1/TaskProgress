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

export function inlineUnits(text) {
  const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter(undefined, {granularity: "grapheme"}) : null;
  return parseInlineLinks(text).map(part => ({...part, units: part.href ? [part.text] :
    segmenter ? Array.from(segmenter.segment(part.text), entry => entry.segment) : Array.from(part.text)}));
}
