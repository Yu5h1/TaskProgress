# Implementation Checklist

Current round only: `plan.md#standalone-editor-退場-draft-01`.

Run each item once. If any implementation or verification attempt fails, mark that item `[!]`, stop the round, and let the user choose the next approach. Do not retry with an alternate command.

- [x] Delete the host-only Editor entry, wrapper, build command, and verifier.
- [x] Remove standalone Editor scripts/configuration from `package.json`, Vite, and `Publish.cmd`.
- [x] Remove `editor_surface_url`, the editor asset route, and editor-root injection from the edit host.
- [x] Remove obsolete host-only URL resolution and update focused Node/Python contract tests.
- [x] Update README and the framework decision record to the same-page Viewer contract.
- [x] Confirm no live source or current documentation still references the retired surface.
  - Remaining exact names occur only in negative retirement assertions or explicitly labeled historical records.
- [x] Run the focused Node tests once.
  - 2026-08-12: 28/28 passed across standalone-build, Svelte spike, local-edit interface, and production time-interface contracts.
- [x] Run the focused Python edit-host tests once.
  - 2026-08-12: 25/25 edit-host tests passed, including capability and route retirement.
- [x] Update handoff for the completed retirement implementation.
  - This is record maintenance, not product exploration; no product test was rerun.
- [x] Update `report.json`／`report.dev.json` projection and run final schema validation.
  - 2026-08-12: Draft 2020-12 validation passed for `report.json` (6 unique tasks) and `report.dev.json` (6 overlays); schema/report IDs match and every overlay task resolves to the base report.
