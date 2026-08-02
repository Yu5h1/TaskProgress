import { mount } from "svelte";

import "@editor/priority-policy.js";
import "@editor/styles.css";
import "./styles.css";
import App from "./App.svelte";

mount(App, {
  target: document.querySelector("#app"),
});
