import { mount } from "svelte";

import "@editor/theme-bootstrap.js";
import "@editor/styles.css";
import "./checklist-styles.css";
import ChecklistApp from "./ChecklistApp.svelte";

mount(ChecklistApp, { target: document.querySelector("#app") });
