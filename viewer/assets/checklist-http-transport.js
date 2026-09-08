// The Browser twin of experiments/editor-svelte-spike/src/checklist-bridge.js.
// Same {load, save} shape with an optional reset capability, same {version, id, type, payload} message the
// desktop bridge already exchanges with ChecklistBridge.Handle — only the
// channel differs: a postMessage round trip there, one POST here to the
// scope+task-id route `checklist request --file <path>` sits behind. The
// screen that consumes this transport does not know which one it got.
const PROTOCOL_VERSION = 1;
const ALLOWED_REQUEST_TYPES = new Set(["load", "save", "reset"]);

export function createChecklistHttpTransport({
  scope,
  task,
  fetchImpl = globalThis.fetch,
  apiRoot = "/__taskprogress/v1",
} = {}) {
  if (typeof scope !== "string" || !scope) {
    throw new TypeError("Checklist HTTP transport 需要 scope。");
  }
  if (typeof task !== "string" || !task) {
    throw new TypeError("Checklist HTTP transport 需要 task。");
  }
  if (typeof fetchImpl !== "function") {
    throw new TypeError("Checklist HTTP transport 需要 fetch。");
  }
  let sequence = 0;

  async function request(type, payload) {
    if (!ALLOWED_REQUEST_TYPES.has(type)) {
      throw new Error(`不支援的 Checklist request：${type}`);
    }
    const message = { version: PROTOCOL_VERSION, id: `checklist-${Date.now()}-${++sequence}`, type };
    if (payload !== undefined) message.payload = payload;

    let response;
    try {
      response = await fetchImpl(
        `${apiRoot}/checklists/${encodeURIComponent(scope)}/${encodeURIComponent(task)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-TaskProgress-Editor": "1",
          },
          body: JSON.stringify(message),
        },
      );
    } catch (error) {
      throw new Error(`Checklist request 無法送出：${error.message}`, { cause: error });
    }
    if (!response.ok) {
      // The route itself failed before the bridge ever ran (bad scope, bad
      // task id, no CLI available) — there is no {type:"error"} body to
      // read, just this app's own problem+json shape.
      let detail = `HTTP ${response.status}`;
      try {
        const problem = await response.json();
        detail = problem.detail ?? problem.title ?? detail;
      } catch {
        // Body was not JSON; keep the status-only detail above.
      }
      throw new Error(`Checklist request 失敗：${detail}`);
    }

    const body = await response.json();
    if (body.type === "result") return body.payload;
    // The code travels with the error so the persistence controller can tell
    // a source conflict from an ordinary write error, matching the desktop
    // transport's own contract.
    const failure = new Error(body.error?.message ?? "Checklist bridge request failed.");
    failure.code = body.error?.code ?? "bridge_error";
    throw failure;
  }

  return Object.freeze({
    load: () => request("load"),
    save: (payload) => request("save", payload),
    reset: (payload = {}) => request("reset", payload),
  });
}
