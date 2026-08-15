import { mount } from "svelte";

import "@editor/theme-bootstrap.js";
import "@editor/styles.css";
import "./checklist-styles.css";
import ChecklistApp from "./ChecklistApp.svelte";
import { createChecklistBridgeTransport } from "./checklist-bridge.js";

// The desktop entry is what knows this build runs inside WebView2, so it is the
// one place that resolves the WebView bridge. Another host supplies its own
// transport to the same screen.
//
// Resolving the bridge can fail — opening these assets outside WebView2 is the
// normal way to hit that — and the screen already reports a load failure
// clearly. Deferring the error into the transport keeps that behaviour instead
// of leaving a blank page and a console message.
function resolveTransport() {
  try {
    return createChecklistBridgeTransport();
  } catch (error) {
    const reject = () => Promise.reject(error);
    return { load: reject, save: reject };
  }
}

mount(ChecklistApp, {
  target: document.querySelector("#app"),
  props: { transport: resolveTransport() },
});
