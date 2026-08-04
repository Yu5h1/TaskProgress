import { mount, unmount } from "svelte";

import TaskList from "./TaskList.svelte";

/*
 * Svelte implementation of the task-list region.
 *
 * Everything framework-specific stops here: the host passes plain data and
 * callbacks, this file turns them into a mounted Svelte component. Swapping to
 * another UI technology means writing a sibling file exposing the same three
 * methods; nothing in the host changes.
 *
 * This is a `.svelte.js` module so `$state` compiles — reactive props are a
 * Svelte detail and must not leak into the host contract.
 */
export const svelteTaskListAdapter = {
  id: "svelte",

  mount(target, props) {
    const state = $state({ ...props });
    const component = mount(TaskList, { target, props: state });
    return { component, state };
  },

  update(instance, props) {
    // Assigning onto the reactive props object lets Svelte diff the list. The
    // host does not need to know that; it just calls update().
    Object.assign(instance.state, props);
    return instance;
  },

  destroy(instance) {
    unmount(instance.component);
  },
};
