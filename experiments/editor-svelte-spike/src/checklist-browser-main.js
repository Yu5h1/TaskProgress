import { mount } from "svelte";

import "@editor/theme-bootstrap.js";
import "@editor/styles.css";
import "./checklist-styles.css";
import ChecklistApp from "./ChecklistApp.svelte";
import { createChecklistHttpTransport } from "@editor/checklist-http-transport.js";
import { installForegroundRefresh } from "@editor/foreground-refresh.js";

// The Browser entry is what knows this build is loaded at /checklist/, so it
// is the one place that reads scope and task off the URL — plan.md's settled
// address is /checklist/?scope=<scope>&task=<task-id>, the same `scope`
// vocabulary the Viewer's own `?scope=` already uses. Another host supplies
// its own transport to the same screen; this one never reaches for a global.
//
// Resolving the transport can fail — a missing or malformed query is the
// normal way to hit that here — and the screen already reports a load
// failure clearly. Deferring the error into the transport keeps that
// behaviour instead of leaving a blank page and a console message, matching
// the desktop entry's own precedent.
function resolveTransport() {
  try {
    const params = new URLSearchParams(location.search);
    return createChecklistHttpTransport({
      scope: params.get("scope"),
      task: params.get("task"),
    });
  } catch (error) {
    const reject = () => Promise.reject(error);
    return { load: reject, save: reject };
  }
}

let persistenceView = null;

installForegroundRefresh({
  canRefresh: () => Boolean(
    !persistenceView?.dirty
    && !persistenceView?.saving
    && !persistenceView?.pending
  ),
});

mount(ChecklistApp, {
  target: document.querySelector("#app"),
  props: {
    transport: resolveTransport(),
    onPersistenceChange: (next) => {
      persistenceView = next;
    },
  },
});
