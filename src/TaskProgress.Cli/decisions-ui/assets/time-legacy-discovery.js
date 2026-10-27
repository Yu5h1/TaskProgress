/*
 * Legacy Time discovery/loading — production since the stage-3 cutover,
 * 2026-08-25 (Documentation/ExtensionModuleArchitecturePlan.md#phase-2viewer-registry-與-time-遷移,
 * discovery/loading slice; the render layer was extracted separately as
 * `time-viewer-module.js` and cut over first). This is the "legacy discovery
 * adapter" the architecture plan describes: it finds and validates the bare
 * `time.analysis.json` sidecar by its known filename, the way every report
 * has always worked, as opposed to a future manifest-declared module that
 * would read a `report.modules.json` entry instead. `time.analysis.json`
 * predates the common module envelope and is not shaped like one — it has no
 * `module_type`/`generator`/`data` wrapper — so this does not and should not
 * route through `module-model.js`'s envelope validation; `inspectTimeAnalysis`
 * already is that sidecar's own domain validator.
 *
 * Verified via fixture tests, then a live passive-shadow comparison against
 * the still-live inline code in `app.js` (both the no-sidecar and
 * has-real-data branches), before this cutover replaced the inline block.
 * `fetchJson` stays injected so this remains testable without a real network
 * call, and this file performs no DOM access itself. Constructing
 * `state.timeController` from a successful result, and hiding the summary
 * button on failure, stay in `app.js` — those touch the DOM and belong with
 * the render layer's existing lifecycle, not discovery.
 */
import { inspectTimeAnalysis, resolveTimeAnalysisSource } from "./time-model.js";

/*
 * Mirrors exactly what `app.js`'s inline try/catch currently does: resolve
 * the sidecar URL (or skip if explicitly disabled), fetch it, validate it,
 * strip an unavailable deadline rather than fabricate one, and turn any
 * failure into a diagnostic instead of an unhandled rejection. Returns
 * `{ timeAnalysis, diagnostics }` — `timeAnalysis` is `null` when there is no
 * sidecar, it 404s, or it fails validation; `diagnostics` is always an array,
 * empty on a clean load.
 */
export async function loadLegacyTimeAnalysis({
  reportSource, baseUrl, explicitTimeSource, scopeId, fetchJson,
}) {
  const diagnostics = [];
  let timeAnalysis = null;
  try {
    const timeSource = resolveTimeAnalysisSource(reportSource, baseUrl, explicitTimeSource);
    if (timeSource) {
      const raw = await fetchJson(timeSource);
      if (raw) {
        const status = inspectTimeAnalysis(raw, scopeId);
        if (status.errors.length) {
          diagnostics.push({
            level: "warning",
            message: `time.analysis.json 已忽略：${status.errors.join("；")}`,
          });
        } else {
          timeAnalysis = JSON.parse(JSON.stringify(raw));
          if (!status.deadlineAvailable) {
            delete timeAnalysis.summary.deadline;
          }
          if (status.deadlineErrors.length) {
            diagnostics.push({
              level: "warning",
              message: `期限分析已忽略：${status.deadlineErrors.join("；")}`,
            });
          }
        }
      }
    }
  } catch (error) {
    diagnostics.push({
      level: "warning",
      message: error instanceof Error
        ? `時間參考已忽略：${error.message}`
        : "時間參考無法載入。",
    });
  }
  return { timeAnalysis, diagnostics };
}
