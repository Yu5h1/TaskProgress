# Implementation Checklist

Current round only: `plan.md#子項目狀態與模組膠囊列-draft-01-2026-08-13`.

Run each item once. If any implementation or verification attempt fails, mark that item `[!]`, stop the round, and let the user choose the next approach. Do not retry with an alternate command.

- [x] Add an Editor Core command that moves one stable item between `pending_items` and `completed_items`, preserves identity, and participates in Undo／Redo, derived progress, and time invalidation.
- [x] Give the shared `ItemRow` one grid contract: marker → priority → description → module strip → status → trailing action; vertically center status and show the far-right text delete control only in Edit without shifting shared fields.
  - [!] Verify shared row geometry in the production Viewer.
    Entry: `http://127.0.0.1:8001/?scope=task-progress` → compare Preview／Edit on desktop and 390px.
    Expect: priority, description, Time, and status stay in the same columns; status is vertically centered; Delete appears only at the far right in Edit; the page has no horizontal overflow.
    Why not agent: column alignment and mode-switch movement are faster and more reliable to judge directly on the rendered screen.
    Failed 2026-08-13: fixed priority/action columns left an empty gap when priority was hidden, description did not align left, and the newly added status duplicated the existing preview status presentation. User selected a left content flow plus right utility panel: optional priority collapses, description flexes, and `module strip → status → edit-only delete` stays right-aligned.
- [x] Correct the failed row geometry with a collapsible left content flow and one right utility panel; suppress the legacy status pseudo-element on shared rows and reuse its preview styling on the single real status control.
  - [!] Re-check the corrected row geometry in the production Viewer.
    Entry: `http://127.0.0.1:8001/?scope=task-progress` → compare Preview／Edit on desktop and 390px.
    Expect: an unspecified priority leaves no gap; description starts immediately after the marker, remains left-aligned, and takes flexible space; the right panel orders Time → status → edit-only Delete; status appears exactly once and uses the original preview appearance.
    Why not agent: this specifically rechecks the visual failure reported above.
    Failed 2026-08-13: the right utility panel could exceed the centered content shell; Preview status sizing did not fit its text, and the Edit status select was clipped.
- [!] Constrain the row and right utility panel to the centered card, let the module strip absorb shrink, and give Preview/Edit status controls content-safe non-shrinking widths.
  - [!] Run the focused presentation/Svelte source tests once.
    Failed 2026-08-13: 17/18 passed. The new status-width assertion inspected the isolated spike `styles.css`, while the implemented shared rule correctly lives in `viewer/assets/styles.css`; no alternate assertion or rerun was attempted.
  - [x] Re-check panel bounds and status sizing in the production Viewer.
    Entry: `http://127.0.0.1:8001/?scope=task-progress` → compare Preview／Edit on desktop and 390px.
    Expect: every row ends inside the centered card; Preview status background fits its text; Edit status labels are fully visible; module capsules shrink or scroll before status/Delete are clipped.
    Why not agent: this directly rechecks the three rendered CSS defects reported by the user.
    Passed 2026-08-13: user confirmed centered panel bounds, Preview status sizing, and Edit status label sizing are all normal.
- [x] Unify visible item-priority controls to one width and restore stateful left markers: pending `○`, completed `✓`, matching the right-side status.
  - [x] User confirmed the unified priority presentation and matching `○`／`✓` markers render correctly on 2026-08-13.
- [x] Expose Preview priority, Edit priority, and Edit status widths as shared CSS variables; give native Edit selects extra width so their arrows do not clip the selected label.
- [!] Keep priority values in `0..4` and change new task/item creation from `2` General to `4` Unspecified; preserve legacy fallback and hide Unspecified in Preview.
  - Failed 2026-08-13: the atomic source/document patch did not apply because the README paragraph context was longer than the selected match. No source or documentation change from that patch was applied, and no alternate patch was attempted.
- [x] Correct the user-authorized priority-default round: initialize task/item priority selects through policy fallback, bind task/item status selects to controlled values, and default new task/item priority to `4` Unspecified.
  - [x] Focused report-model, local-edit, Svelte, and time-interface tests passed 47/47; Viewer bundle rebuilt with 132 modules (150.78 kB) on 2026-08-13.
- [x] Correct the shared-style test target, pass the focused presentation/Svelte/time tests 25/25, and regenerate the Viewer bundle (132 modules, 150.79 kB).
- [x] Add pending／completed status display and editing to the shared row, wired through the Core move command with accessible labels.
  - [ ] Verify reversible item status editing without saving test data.
    Entry: same Viewer → Edit → change one item between 待處理／已完成 → Undo → Redo → return to Preview.
    Expect: the same item moves panels, fraction/progress follows, Undo／Redo restores it, and returning to Preview discards the draft.
    Why not agent: this is one short visual interaction chain and should not write verification data into the report.
- [x] Extract one shared `ModuleCapsuleStrip`, adapt Time as its first capsule, collapse the empty strip, and confine overflow to the strip on desktop and narrow layouts.
  - [ ] Verify the Time capsule remains the same interaction in both modes.
    Entry: same Viewer → open one Time capsule in Preview, close it, switch to Edit, and open it again at 390px.
    Expect: both open the shared Time Dialog; the capsule stays in the module column and does not create page-level horizontal scrolling.
    Why not agent: Dialog focus and responsive overflow need direct browser observation.
- [x] Reuse the `StatusFilters` reorder model and UX for module capsules: mouse drag, 8px horizontal touch threshold, `Alt + ←／→`, focus restoration, click-versus-drag separation, and immediate browser-local persistence.
- [x] Add focused Core/model/component coverage for the new contracts and regenerate the committed Viewer bundle required by changed Svelte source.
