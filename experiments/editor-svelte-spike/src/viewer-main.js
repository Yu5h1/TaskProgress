import { mount } from "svelte";

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
