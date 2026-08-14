# Implementation Checklist

Current round: `plan.md#子項目狀態與模組膠囊列-draft-01-2026-08-13`.

Run each item once. If an implementation or verification attempt fails, mark the item `[!]` and stop the round. Do not retry with a different command.

- [x] **4. Align the presentation test with the approved priority width**
  Acceptance: The presentation contract test expects the user-approved `42px` preview priority width. The focused `ItemRow`, SaveBar, and Viewer adapter source tests pass.
  Verification: Run `tests/editor-presentation.test.mjs`, `tests/local-edit-interface.test.mjs`, and `tests/svelte-editor-spike.test.mjs` once.
  Passed 2026-08-14: 22 of 22 focused tests passed.
- [x] **2. Make the child-item description fill the available width**
  Acceptance: The description extends to the right utility panel. A tooltip shows the full description when the text is truncated. The edit input uses the same available width.
  Verification: After the source contract tests pass, use a long description to check Preview and Edit at desktop width and 390px in the Viewer.
  Passed 2026-08-14: 18 of 18 focused presentation and Svelte source tests passed.
  - [X] Check a long child-item description in Preview and Edit at desktop width and 390px.
    Entry: `http://127.0.0.1:8001/?scope=task-progress`
    Expect: the description fills the space before the utility panel; truncated text shows the full description in a tooltip.
    Why not agent: text truncation, pointer hover, and responsive geometry require direct rendered-screen inspection.
- [x] **3. Add a Discard button**
  Acceptance: The shared SaveBar shows `放棄`. The button uses the existing discard flow to discard the draft, close the edit session, and return to Preview.
  Verification: After the source contract tests pass, change one field in the Viewer and select `放棄`. Confirm that the UI restores the saved value and does not write a file.
  Passed 2026-08-14: 20 of 20 focused local-edit and Svelte source tests passed. The Viewer bundle rebuilt successfully with 132 modules (`viewer-ui.js` 151.22 kB).
  - [X] Verify the Discard action without saving test data.
    Entry: same Viewer → Edit → change one field → select `放棄`.
    Expect: Preview returns with the saved value restored and no file write.
    Why not agent: this is a short end-to-end interaction against the user's running local edit host.
