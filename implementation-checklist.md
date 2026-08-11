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
- [!] Rebuild the committed Viewer UI bundle and confirm source/bundle parity.
  - One allowed attempt: `npm run viewer:ui:build`.
  - PowerShell blocked `C:\Program Files\nodejs\npm.ps1` because script execution is disabled; Vite never started.
  - Per the one-attempt rule, no `npm.cmd` fallback or second attempt was made.
- [!] Verify the production Viewer at desktop and 390px.
  - Blocked by the failed bundle prerequisite: production still loads the old committed `viewer/assets/viewer-ui.js`.
  - No browser attempt was made and no visual result is claimed.
