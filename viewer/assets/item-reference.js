/** Builds the text an agent resolves to one Report child item; null when the item has no stable ID. */
import { parseInlineLinks } from "./inline-links.js";

export function itemReference({ scopeId, taskId, item, titleLength = 24 }) {
  if (!scopeId || !taskId || !item?.id || item.legacy) return null;
  const plain = parseInlineLinks(item.title).map(part => part.text).join("").replace(/\s+/gu, " ").trim();
  const units = Array.from(plain);
  const head = units.length > titleLength ? `${units.slice(0, titleLength).join("")}…` : plain;
  return `${scopeId} › ${taskId} › ${item.id}${head ? `「${head}」` : ""}`;
}

/** Writes text to the clipboard; falls back to a selection copy where the Clipboard API is refused. */
export async function copyText(text, doc = globalThis.document) {
  try {
    await doc.defaultView.navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = doc.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    const focused = doc.activeElement;
    doc.body.append(field);
    field.select();
    const copied = doc.execCommand("copy");
    field.remove();
    focused?.focus?.();
    return copied;
  }
}
