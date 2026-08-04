import { registerUiAdapter } from "@editor/ui-host.js";

import { svelteTaskListAdapter } from "./task-list-adapter.svelte.js";

/*
 * Preview bundle for `viewer/index.html`.
 *
 * It registers the UI implementation and nothing else — no data loading, no
 * capability checks, no persistence. `app.js` stays the host: it resolves the
 * report, owns editor state, and asks the registered adapter to render the
 * task list. Replacing Svelte means shipping a different bundle that registers
 * a different adapter under the same contract.
 */
registerUiAdapter(svelteTaskListAdapter);
