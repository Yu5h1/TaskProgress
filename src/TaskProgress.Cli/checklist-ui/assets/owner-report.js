import { buildScopeHref, reportPathForScope } from "./report-model.js";

// Optional navigation metadata; failure must not block the document editor.
export async function loadOwnerReport(scope, fetchImpl = globalThis.fetch) {
  try {
    const response = await fetchImpl(reportPathForScope(scope), {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const report = await response.json();
    if (report?.scope_id !== scope || typeof report.title !== "string" || !report.title.trim()
      || !Array.isArray(report.tasks)) return null;
    return { title: report.title, href: `/${buildScopeHref(scope)}` };
  } catch {
    return null;
  }
}
