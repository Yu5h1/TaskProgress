// Adapts HTTP or WebView messages to the same decision response contract.
const segment = value => /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(value ?? "") && value.length <= 100;
export function createDecisionHttpTransport(scope, task) {
  if (!segment(scope) || (task && !segment(task))) throw new Error("無效的 scope 或 task。");
  const base = `/__taskprogress/v1/decisions/${encodeURIComponent(scope)}`;
  async function post(path, body) {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json", "X-TaskProgress-Editor": "1" }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error(`決策服務錯誤 ${response.status}：${await response.text()}`);
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
