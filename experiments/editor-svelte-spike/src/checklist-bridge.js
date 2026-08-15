const PROTOCOL_VERSION = 1;
const ALLOWED_REQUEST_TYPES = new Set(["load", "save"]);

export function createChecklistBridgeTransport(webview = globalThis.chrome?.webview) {
  if (!webview || typeof webview.postMessage !== "function") {
    throw new Error("此頁面必須由 TaskProgress Checklist Desktop Host 開啟。");
  }
  let sequence = 0;
  const pending = new Map();
  webview.addEventListener("message", (event) => {
    const response = event.data;
    if (!response || response.version !== PROTOCOL_VERSION || typeof response.id !== "string") return;
    const request = pending.get(response.id);
    if (!request) return;
    pending.delete(response.id);
    if (response.type === "result") request.resolve(response.payload);
    else request.reject(new Error(response.error?.message ?? "Checklist bridge request failed."));
  });

  function request(type, payload) {
    if (!ALLOWED_REQUEST_TYPES.has(type)) {
      return Promise.reject(new Error(`不支援的 Checklist bridge request：${type}`));
    }
    const id = `checklist-${Date.now()}-${++sequence}`;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      const message = { version: PROTOCOL_VERSION, id, type };
      if (payload !== undefined) message.payload = payload;
      webview.postMessage(message);
    });
  }

  return Object.freeze({
    load: () => request("load"),
    save: (payload) => request("save", payload),
  });
}
