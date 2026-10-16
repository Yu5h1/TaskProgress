// One screen and one bundle for HTTP and the exact-file WebView host.
import { mount } from "svelte";
import "@editor/theme-bootstrap.js";
import "@editor/styles.css";
import "./checklist-styles.css";
import DecisionApp from "./DecisionApp.svelte";
import { createDecisionHttpTransport, createDecisionDesktopTransport } from "@editor/decision-transport.js";
import { installForegroundRefresh } from "@editor/foreground-refresh.js";
let refreshApp = null;
let persistence;
let transport;
try {
  const query = new URLSearchParams(location.search);
  transport = window.chrome?.webview ? createDecisionDesktopTransport(window.chrome.webview)
    : createDecisionHttpTransport(query.get("scope"), query.get("task"));
} catch (error) { transport = { load: () => Promise.reject(error) }; }
if (!window.chrome?.webview) {
  installForegroundRefresh({
    canRefresh: () => !persistence?.dirty && !persistence?.saving && !persistence?.pending,
    reload: async () => {
      if (refreshApp) {
        await refreshApp();
      }
    },
  });
}
mount(DecisionApp, {
  target: document.querySelector("#app"),
  props: {
    transport,
    bindRefresh: (fn) => { refreshApp = fn; },
    onPersistenceChange: value => persistence = value,
  },
});
