function problemMessage(problem, fallback) {
  if (!problem || typeof problem !== "object") return fallback;
  return problem.detail
    ? `${problem.title ?? fallback}：${problem.detail}`
    : problem.title ?? fallback;
}

async function responseProblem(response, fallback) {
  try {
    return problemMessage(await response.json(), fallback);
  } catch {
    return fallback;
  }
}

export function createEditHostClient({
  scope,
  fetchImpl = globalThis.fetch,
  apiRoot = "/__taskprogress/v1",
} = {}) {
  if (typeof scope !== "string" || !scope) {
    throw new TypeError("Editor host client 需要 scope。");
  }
  if (typeof fetchImpl !== "function") {
    throw new TypeError("Editor host client 需要 fetch。");
  }

  let session = null;

  async function request(url, options, fallback) {
    const response = await fetchImpl(url, options);
    if (!response.ok) throw new Error(await responseProblem(response, fallback));
    return response;
  }

  return Object.freeze({
    async discover() {
      try {
        const response = await fetchImpl(
          `${apiRoot}/capabilities/${encodeURIComponent(scope)}`,
          { headers: { Accept: "application/json" }, cache: "no-store" },
        );
        if (!response.ok) return null;
        const capability = await response.json();
        return capability.editable && capability.scope_id === scope
          ? Object.freeze(capability)
          : null;
      } catch {
        return null;
      }
    },

    async start() {
      const response = await request(
        `${apiRoot}/edit-sessions`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-TaskProgress-Editor": "1",
          },
          body: JSON.stringify({ scope_id: scope }),
        },
        "無法建立本機編輯工作階段。",
      );
      session = await response.json();
      return structuredClone(session);
    },

    async save({ report, inputs }) {
      if (!session) throw new Error("本機編輯工作階段尚未建立。");
      const response = await request(
        `${apiRoot}/edit-sessions/${encodeURIComponent(scope)}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.token}`,
            "Content-Type": "application/json",
            "If-Match": `"${session.revision}"`,
            "X-TaskProgress-Editor": "1",
          },
          body: JSON.stringify({
            report,
            inputs_revision: session.inputs_revision,
            inputs,
          }),
        },
        "儲存失敗；原始檔案未變更。",
      );
      session = await response.json();
      return structuredClone(session);
    },

    async close() {
      const closing = session;
      session = null;
      if (!closing) return;
      try {
        await fetchImpl(
          `${apiRoot}/edit-sessions/${encodeURIComponent(scope)}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${closing.token}`,
              "X-TaskProgress-Editor": "1",
            },
          },
        );
      } catch {
        // The short-lived server session expires automatically.
      }
    },
  });
}
