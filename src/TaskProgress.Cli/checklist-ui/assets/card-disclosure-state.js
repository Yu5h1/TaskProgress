// Tab-local presentation state survives foreground reloads without changing source data.
export function loadDisclosure(key, storage) {
  try {
    const value = JSON.parse((storage ?? globalThis.sessionStorage).getItem(key));
    if (typeof value?.expanded !== "boolean") return { expanded: true, overrides: {} };
    const overrides = Object.fromEntries(Object.entries(value.overrides ?? {}).filter(([, state]) => typeof state === "boolean"));
    return { expanded: value.expanded, overrides };
  } catch { return { expanded: true, overrides: {} }; }
}
export function saveDisclosure(key, expanded, overrides, storage) {
  try { (storage ?? globalThis.sessionStorage).setItem(key, JSON.stringify({ expanded, overrides })); }
  catch { /* Storage restrictions must not prevent in-memory card interaction. */ }
}
