import { mount } from "svelte";

// The saved theme preference must be applied before paint, exactly as the
// Viewer does it. Without this the embedded editor falls back to
// `prefers-color-scheme` and renders dark while the Viewer is showing light.
import "@editor/theme-bootstrap.js";
import "@editor/priority-policy.js";
import "@editor/styles.css";
import "./styles.css";
import App from "./App.svelte";

mount(App, {
  target: document.querySelector("#app"),
  props: {
    requireHostCapability: true,
    surfaceKind: "viewer",
    embedded: window.self !== window.top,
    autoStartEditing: window.self !== window.top,
  },
});
