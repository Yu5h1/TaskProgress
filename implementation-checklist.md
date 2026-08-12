# Implementation Checklist

Current round only: `plan.md#時間編輯-ux-parity-修復-draft-01`.

This file opts TaskProgress into the Agent Work Route shared verification workflow. Outer items track implementation. Nested verification checks are added only after an item is built, then handed to the user for hands-on UI verification where applicable.

- [x] Reorder `TimeSettingsEditor` into the specified vertical flow with delivery date first.
- [x] Remove the desktop two-column time-settings layout while preserving desktop and 390px responsive rules.
- [x] Remove the inline manual-estimate `<details>` from `ItemRow` without moving or duplicating its time capsule.
- [x] Add the manual hours, rationale, and confirmation editing state to the existing item `TimeDialog`.
- [x] Wire the active item draft and existing `setManualEstimate` callback through the framework-neutral host/controller boundary.
- [x] Preserve Dialog close, keyboard, focus-return, dirty-state, discard, preview, and save transaction semantics in source.
- [x] Update targeted component, production-interface, controller/model, and host contract tests.
  - [x] Targeted Node tests: 39/39 passed on 2026-08-11.
- [x] Rebuild the committed Viewer UI bundle and confirm source/bundle parity.
  - User ran `npm.cmd run viewer:ui:build` successfully on 2026-08-12: Vite transformed 130 modules and generated `viewer/assets/viewer-ui.js` (146.80 kB).
  - The four emitted Svelte diagnostics are non-blocking warnings: one form interaction warning, three tabpanel-role warnings, and one unused `timeTask` export warning.
- [x] Verify the production Viewer at desktop and 390px.
  - Entry: `http://127.0.0.1:8001/?scope=task-progress` → hard reload → enter edit mode.
  - Expect: delivery first; heading/content vertical; item row has no inline estimate editor; clicking the time capsule opens the shared Dialog with manual hours, rationale and confirmation; applying marks the global draft dirty; 390px has no horizontal overflow.
  - Why user: visual layout, focus behavior, and responsive manipulation are faster and more reliable to confirm hands-on.
  - User reported the full check passed on 2026-08-12.
