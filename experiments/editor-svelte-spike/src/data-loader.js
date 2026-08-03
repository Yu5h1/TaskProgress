import {
  SUPPORTED_SCHEMA_VERSION,
  resolveReportRequest,
  validateReport,
} from "../../../viewer/assets/report-model.js";
import {
  inspectTimeAnalysis,
  resolveTimeAnalysisSource,
} from "../../../viewer/assets/time-model.js";

function safeHttpUrl(value, baseUrl, label) {
  let url;
  try {
    url = new URL(value, baseUrl);
  } catch {
    throw new Error(`${label} 不是有效的 URL。`);
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${label} 只支援 HTTP 或 HTTPS 來源。`);
  }
  return url;
}

async function fetchJson(fetchImpl, url, label, { optional = false } = {}) {
  const response = await fetchImpl(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (optional && response.status === 404) return null;
  if (!response.ok) throw new Error(`${label} 載入失敗（HTTP ${response.status}）。`);
  try {
    return await response.json();
  } catch {
    throw new Error(`${label} 不是有效的 JSON。`);
  }
}

export function resolveSvelteDataRequest(params, baseUrl) {
  const request = resolveReportRequest(params);
  if (!request) return null;

  const reportUrl = request.source === "scope"
    ? resolveScopeReportUrl(request.scope, baseUrl)
    : safeHttpUrl(request.reportSource, baseUrl, "report.json");
  const explicitTimeSource = params.get("time") ?? undefined;
  const timeSource = resolveTimeAnalysisSource(
    reportUrl.href,
    baseUrl,
    explicitTimeSource,
  );
  const timeUrl = timeSource
    ? safeHttpUrl(timeSource, baseUrl, "time.analysis.json")
    : null;

  return Object.freeze({ ...request, reportUrl, timeUrl });
}

function resolveScopeReportUrl(scope, baseUrl) {
  const base = new URL(baseUrl);
  if (base.pathname.startsWith("/__taskprogress/v1/editor/")) {
    return new URL(`/reports/${scope}/report.json`, base.origin);
  }
  return new URL(`../../reports/${scope}/report.json`, base);
}

export async function loadSvelteEditorData({
  params,
  baseUrl,
  fetchImpl = globalThis.fetch,
}) {
  if (typeof fetchImpl !== "function") {
    throw new TypeError("Svelte data loader 需要 fetch。 ");
  }
  const request = resolveSvelteDataRequest(params, baseUrl);
  if (!request) return null;

  const report = await fetchJson(fetchImpl, request.reportUrl, "report.json");
  const reportErrors = validateReport(report);
  if (report.schema_version !== SUPPORTED_SCHEMA_VERSION) {
    reportErrors.unshift({
      message: `Editor 支援 schema ${SUPPORTED_SCHEMA_VERSION}，收到 ${report.schema_version ?? "未指定"}。`,
    });
  }
  if (reportErrors.length) {
    throw new Error(`report.json 未通過驗證：${reportErrors.map((error) => error.message).join("；")}`);
  }

  const diagnostics = [];
  let timeAnalysis = null;
  if (request.timeUrl) {
    try {
      const candidate = await fetchJson(
        fetchImpl,
        request.timeUrl,
        "time.analysis.json",
        { optional: true },
      );
      if (candidate) {
        const status = inspectTimeAnalysis(candidate, report.scope_id);
        if (status.errors.length) {
          diagnostics.push({
            level: "warning",
            message: `time.analysis.json 已忽略：${status.errors.join("；")}`,
          });
        } else {
          timeAnalysis = structuredClone(candidate);
          if (!status.deadlineAvailable) delete timeAnalysis.summary.deadline;
          if (status.deadlineErrors.length) {
            diagnostics.push({
              level: "warning",
              message: `期限分析已忽略：${status.deadlineErrors.join("；")}`,
            });
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
  }

  return Object.freeze({
    report,
    timeAnalysis,
    diagnostics,
    request,
  });
}
