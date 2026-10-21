/** Keyword filtering for task cards: card title and summary, then child item text. Hides only; never reorders. */
import { parseInlineLinks } from "./inline-links.js";

const ITEM_FIELDS = ["pending_items", "completed_items"];

/** Reads a pasted item reference, `<scope> › <task> › <item>`; the item part is optional and an older trailing 「title head」 is ignored. */
export function parseReference(query) {
  const text = String(query ?? "").replace(/「[\s\S]*$/u, "").trim();
  if (!text.includes("›")) return null;
  const [scopeId, taskId, itemId] = text.split("›").map(part => part.trim());
  if (!scopeId || !taskId) return null;
  return { scopeId, taskId, itemId: itemId || null };
}

/** Keeps only the referenced card, and within it only the referenced item when one is named. */
export function referenceTask(task, reference) {
  if (task.id !== reference.taskId) return null;
  if (!reference.itemId) return task;
  const next = { ...task };
  let found = false;
  for (const field of ITEM_FIELDS) {
    next[field] = (task[field] ?? []).filter(item => item?.id === reference.itemId && !item.legacy);
    found ||= next[field].length > 0;
  }
  return found ? next : null;
}

export function searchTerms(query) {
  return String(query ?? "").toLocaleLowerCase().split(/\s+/u).filter(Boolean);
}

function plain(value) {
  return parseInlineLinks(value).map(part => part.text).join("").toLocaleLowerCase();
}

function covers(texts, terms) {
  return terms.every(term => texts.some(text => text.includes(term)));
}

/** Returns the task unchanged when the card itself matches, a copy holding only matching items, or null. */
export function searchTask(task, terms, { ids = false } = {}) {
  if (!terms.length) return task;
  const cardTexts = [plain(task.title), plain(task.summary), ...(ids ? [String(task.id ?? "").toLocaleLowerCase()] : [])];
  if (covers(cardTexts, terms)) return task;
  const next = { ...task };
  let found = false;
  for (const field of ITEM_FIELDS) {
    next[field] = (task[field] ?? []).filter(item => {
      const own = [plain(typeof item === "string" ? item : item?.title)];
      if (ids && item?.id && !item.legacy) own.push(String(item.id).toLocaleLowerCase());
      return covers([...cardTexts, ...own], terms);
    });
    found ||= next[field].length > 0;
  }
  return found ? next : null;
}
