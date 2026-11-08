// Navigation context lasts for the first selection, regardless of loading time.
const TONES = new Set(["active", "success", "danger", "warning", "muted", "neutral", "retired"]);

export function checklistReturnHref(href, taskId, itemId, base = globalThis.location?.href) {
  if (!href || !taskId || !itemId || !base) return href;
  try {
    const source = new URL(base), target = new URL(href, source);
    if (target.origin !== source.origin || !target.pathname.endsWith('/checklist/')) return href;
    source.searchParams.set('pin', taskId);
    source.hash = `item-${taskId}--${itemId}`;
    target.searchParams.set('return_to', source.href);
    return target.href;
  } catch { return href; }
}

export function checklistReturnOwner(owner, search, base = globalThis.location?.href) {
  if (!owner || !base) return owner;
  try {
    const value = new URLSearchParams(search).get('return_to');
    if (!value) return owner;
    const target = new URL(value, base), current = new URL(base);
    const reportPath = current.pathname.replace(/checklist\/$/, '');
    if (target.origin !== current.origin || ![reportPath, `${reportPath}index.html`].includes(target.pathname) || !target.searchParams.has('scope') || !target.hash.startsWith('#item-')) return owner;
    return { ...owner, href: target.href };
  } catch { return owner; }
}

export function linkSelectionHref(href, tone, base = globalThis.location?.href) {
  if (!href || !TONES.has(tone) || !base) return href;
  try {
    const url = new URL(href, base);
    if (url.origin !== new URL(base).origin || !url.searchParams.has("scope")) return href;
    if (!["/", "/checklist/", "/decisions/"].includes(url.pathname)) return href;
    url.searchParams.set("link-tone", tone);
    return href.startsWith("/") ? `${url.pathname}${url.search}${url.hash}` : url.href;
  } catch { return href; }
}

export function readLinkSelection(search) {
  const query = new URLSearchParams(search);
  const tone = query.get("link-tone");
  return TONES.has(tone) ? { tone, id: query.get("pin") ?? query.get("work_item") ?? query.get("decision") } : null;
}

// A whole-document link still needs a target when saved filters hide every card.
export function documentLinkTarget(request, ids) {
  return request ? request.id ?? (ids.length ? String(ids[0]) : null) : null;
}

export function createLinkSelection(request) {
  let phase = request ? "pending" : "cleared";
  let target = null;
  return {
    // Missing/filtered data is still pending, rather than consuming the request early.
    claim(ids) {
      if (phase !== "pending") return null;
      const id = request.id === null ? ids[0] : ids.find(id => String(id) === request.id);
      if (id === undefined) return null;
      target = id;
      phase = "active";
      return { id, tone: request.tone };
    },
    selectionChanged(id) {
      if (phase === "active" && id !== target) phase = "cleared";
      return phase === "active" ? request.tone : null;
    },
  };
}
