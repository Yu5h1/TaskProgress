// Builds same-report card links and keeps the breadcrumb in browser history.
const TRAIL_KEY = "taskprogress-card-navigation";
const CARD_ROUTE = /\/card\/(?:index\.html)?$/;
const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function reportPageUrl(current) {
  const url = new URL(current);
  if (CARD_ROUTE.test(url.pathname)) url.pathname = url.pathname.replace(CARD_ROUTE, "/");
  url.searchParams.delete("task");
  url.searchParams.delete("pin");
  url.searchParams.delete("link-tone");
  url.hash = "";
  return url;
}

export function cardPageUrl(current, scope, taskId) {
  const url = reportPageUrl(current);
  if (LOOPBACK.has(url.hostname)) url.pathname = new URL("card/", url).pathname;
  if (scope) url.searchParams.set("scope", scope);
  url.searchParams.set("task", taskId);
  return url;
}

export function rememberCardTrail(destination, ids) {
  try { sessionStorage.setItem(TRAIL_KEY, JSON.stringify({ destination, ids })); } catch {}
}

export function restoreCardTrail() {
  let arrival;
  try {
    arrival = JSON.parse(sessionStorage.getItem(TRAIL_KEY));
    sessionStorage.removeItem(TRAIL_KEY);
  } catch {}
  if (arrival?.destination === location.href && Array.isArray(arrival.ids)) {
    history.replaceState({ ...history.state, cardTrail: arrival.ids }, "");
  }
  return history.state?.cardTrail ?? [];
}

export function cardTrail(ids, taskId, targetsById) {
  if (!Array.isArray(ids) || ids.at(-1) !== taskId) return [taskId];
  const first = ids.findLastIndex((id, index) => index < ids.length - 1
    && !targetsById.get(id)?.has(ids[index + 1]));
  return ids.slice(first + 1);
}
