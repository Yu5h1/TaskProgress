import { mount, unmount } from "svelte";

import AddControl from "./AddControl.svelte";
import Diagnostics from "./Diagnostics.svelte";
import ModeToggle from "./ModeToggle.svelte";
import ProjectProgress from "./ProjectProgress.svelte";
import ScopeDirectory from "./ScopeDirectory.svelte";
import SaveBar from "./SaveBar.svelte";
import StatusFilters from "./StatusFilters.svelte";
import StatusOverview from "./StatusOverview.svelte";
import TaskList from "./TaskList.svelte";
import ThemeControl from "./ThemeControl.svelte";

/*
 * Svelte implementation of the Viewer's preview regions.
 *
 * Everything framework-specific stops here: the host passes plain data and
 * callbacks, this file turns them into mounted Svelte components. Swapping to
 * another UI technology means writing a sibling file exposing the same regions
 * and the same three methods; nothing in the host changes.
 *
 * This is a `.svelte.js` module so `$state` compiles — reactive props are a
 * Svelte detail and must not leak into the host contract.
 */
const components = {
  "task-list": TaskList,
  "status-overview": StatusOverview,
  "status-filters": StatusFilters,
  "project-progress": ProjectProgress,
  "mode-toggle": ModeToggle,
  "save-bar": SaveBar,
  "add-control": AddControl,
  "diagnostics": Diagnostics,
  "scope-directory": ScopeDirectory,
  "theme-control": ThemeControl,
};

export const svelteViewerAdapter = {
  id: "svelte",
  regions: Object.keys(components),

  mount(region, target, props) {
    const state = $state({ ...props });
    const component = mount(components[region], { target, props: state });
    return { component, state };
  },

  update(instance, props) {
    // Assigning onto the reactive props object lets Svelte diff. The host does
    // not need to know that; it just calls update().
    Object.assign(instance.state, props);
    return instance;
  },

  destroy(instance) {
    unmount(instance.component);
  },
};
