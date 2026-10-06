// Adapts HTTP or WebView messages to the same decision response contract.
const segment = value => /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(value ?? "") && value.length <= 100;
export function createDecisionHttpTransport(scope, task) {
  if (!segment(scope) || (task && !segment(task))) throw new Error("無效的 scope 或 task。");
  const base = `/__taskprogress/v1/decisions/${encodeURIComponent(scope)}`;
  async function post(path, body) {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json", "X-TaskProgress-Editor": "1" }, body: JSON.stringify(body) });
    if (!response.ok) {
      const text = await response.text();
      let problem;
      try { problem = JSON.parse(text); } catch { /* An unreadable response is ambiguous. */ }
      // Only host gates known to reject BEFORE the writer runs are definitive.
      // decision_request_failed may follow a write/timeout and must retain the original request.
      const rejected = ["browser_origin_forbidden", "unsupported_media_type", "request_too_large",
        "invalid_operation", "task_not_found", "task_mismatch"];
      if (response.status >= 400 && response.status < 500 && rejected.includes(problem?.code) &&
          problem.type === `https://task-progress.local/problems/${problem.code}`) {
        return { ok: false, request_id: body.request_id, error: { code: problem.code,
          message: problem.code === "invalid_operation"
            ? "服務版本不支援此操作，請更新並重啟 TaskProgress 服務後再試。此次請求未修改資料。"
            : `操作被拒絕，未修改資料：${problem.title ?? problem.code}` } };
      }
      throw new Error(`決策服務錯誤 ${response.status}：${text}`);
    }
    return response.json();
  }
  return { load: () => task ? post(`${base}/${encodeURIComponent(task)}`, { operation: "load" }) : post(base, {}),
    request: body => post(`${base}/${encodeURIComponent(task)}`, body) };
}
export function createDecisionDesktopTransport(webview) {
  const waiting = new Map();
  webview.addEventListener("message", event => {
    const entry = waiting.get(event.data.request_id);
    if (!entry) return;
    clearTimeout(entry.timer); waiting.delete(event.data.request_id); entry.resolve(event.data);
  });
  function request(body) {
    const message = { ...body, request_id: body.request_id ?? crypto.randomUUID() };
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { waiting.delete(message.request_id); reject(new Error("回應逾時，結果未確認。")); }, 30000);
      waiting.set(message.request_id, { resolve, timer }); webview.postMessage(message);
    });
  }
  return { load: () => request({ operation: "load" }), request };
}
