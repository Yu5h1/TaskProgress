/*
 * Filter selection: a set of chosen tags plus the leading 預設 capsule.
 *
 * 預設 is a select-all switch, not a tag — it matches no status of its own. It
 * lights when every tag is selected, whether that happened by clicking 預設 or
 * by the reader ticking the last one, and dims the moment any tag is cleared.
 * Clicking a lit 預設 clears everything, which shows nothing: that result has no
 * practical use, but a toggle that refuses to toggle is worse.
 *
 * Framework-neutral: the strip renders what this returns and calls back into it.
 * It holds no tag vocabulary, so each screen supplies its own.
 */
export const DEFAULT_CAPSULE_ID = "__default__";

function unique(ids) {
  return [...new Set(ids)];
}

export function createFilterSelection(tagIds = []) {
  const tags = unique(tagIds);
  return Object.freeze({ tags, selected: new Set(tags) });
}

export function isDefaultLit(selection) {
  return selection.tags.length > 0 && selection.tags.every((id) => selection.selected.has(id));
}

export function isEmptySelection(selection) {
  return selection.selected.size === 0;
}

export function toggleTag(selection, id) {
  if (!selection.tags.includes(id)) return selection;
  const selected = new Set(selection.selected);
  if (selected.has(id)) selected.delete(id);
  else selected.add(id);
  return Object.freeze({ tags: selection.tags, selected });
}

export function toggleDefault(selection) {
  // Lit means everything is on, so the only move left is to clear it.
  const selected = isDefaultLit(selection) ? new Set() : new Set(selection.tags);
  return Object.freeze({ tags: selection.tags, selected });
}

/*
 * Keep the selection meaningful when the tag set itself changes.
 *
 * A tag that appears while everything was selected joins the selection, so a
 * reader who never touched the filter does not silently lose rows.
 */
export function withTags(selection, tagIds) {
  const tags = unique(tagIds);
  const wasAll = isDefaultLit(selection);
  const selected = wasAll
    ? new Set(tags)
    : new Set(tags.filter((id) => selection.selected.has(id)));
  return Object.freeze({ tags, selected });
}

export function matchesSelection(selection, status) {
  return selection.selected.has(status);
}
