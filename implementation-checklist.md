# Implementation Checklist

Current round: `plan.md#共用元件與傳輸接縫-round2026-08-15-核定`.

Run every Agent check once. If a check fails, mark it `[!]`, add `Observed`, and pause automatic retries plus dependent work. After an intervention, the user may request one new verification attempt; success changes the same check to `[x]` while preserving `Observed` and adding `Resolved`. Manual checks remain user-editable through the shared marker cycle; Agent results do not. Continue independent work when safe. Create a new item only when the outcome or acceptance contract changes. The parent marker is derived from its checks. This file contains only the active round; git history owns prior rounds.

- [x] **1. Add the shared progress summary**
  Outcome: One implementation renders the total, completed, and outstanding counts, a progress bar, and a one-line text progress, from numbers and labels the calling screen supplies.
  Checks:
    - [x] **Summary source contract**
      - Action: Run focused tests for the count row, both progress-bar forms, the text line, and the absence of domain knowledge in the component.
      - Expect: The component reads no report or checklist structure, every label comes from its caller, and the segmented and continuous bar forms are selectable without a second component.

- [x] **2. Add the shared next-step card**
  Outcome: One implementation shows a single outstanding item with what to do, how it passes, and an optional command block.
  Checks:
    - [x] **Next-step source contract**
      - Action: Run focused tests for single-item rendering, the optional command block, and the outstanding-state presentation.
      - Expect: The card renders exactly one item, takes its text from the caller, and uses the existing semantic warning colour rather than a new literal.

- [x] **3. Use the shared summary and next-step card on the Checklist screen**
  Depends on: 1, 2.
  Outcome: The Checklist screen opens with its own counts and the single check that is outstanding and not blocked by a dependency.
  Checks:
    - [x] **Checklist summary wiring**
      - Action: Run focused tests for the derived counts, outstanding-check selection under dependencies, and the segmented bar choice.
      - Expect: Counts cover the whole document, the selected next step skips checks blocked by an unfinished dependency, and no summary logic is duplicated in the screen.
    - [x] **Checklist asset build**
      - Action: Build the Checklist UI asset once from the locked npm dependency graph.
      - Expect: The build succeeds and the WPF-loadable assets contain the shared summary and card rather than a Checklist-only copy.

- [ ] **4. Make the progress bar one implementation across both screens**
  Depends on: 1, 3.
  Outcome: The task-progress meter and the Checklist bar are the same component, and the status overview keeps its own status-card presentation.
  Checks:
    - [x] **Shared progress bar contract**
      - Action: Run focused tests for the continuous form keeping native progress semantics and the accent gradient, the segmented form staying unchanged, and the task-progress screen holding no meter markup of its own; then rebuild the preview bundle.
      - Expect: The continuous form renders one native progress element with the existing classes, both callers reach it without a host-specific option, the status overview is untouched, and the bundle rebuilds.
    - [ ] **Rendered task-progress meter** `[manual]`
      - Action: Open the local Viewer at desktop width and 390px and compare the overall-progress meter against the previous layout in both themes.
      - Expect: The meter reads the same as before, including its gradient and any deadline overlay, nothing overflows horizontally, and the status cards above it are unchanged.
      - Reason: Requires direct visual comparison in the user's running browser.

- [x] **5. Lift the filter categories out of the shared strip**
  Outcome: The filter strip receives its categories and selection from the calling screen while keeping one pointer and keyboard implementation.
  Checks:
    - [x] **Filter strip source contract**
      - Action: Run focused tests for caller-supplied categories, selection callbacks, the optional reordering, and the unchanged pointer and keyboard behaviour.
      - Expect: The strip defines no categories of its own, reordering is opt-in per screen, and the task-progress screen keeps its existing order persistence.

- [x] **6. Give the Checklist its filter categories**
  Depends on: 3, 5.
  Outcome: The Checklist filters by check status and by owner without reordering, and filtering never changes what is saved or counted.
  Checks:
    - [x] **Checklist filter model**
      - Action: Run focused tests for the check-status and owner categories, reordering staying off, summary counts under an active filter, and dependency blocking under an active filter.
      - Expect: Counts stay whole-document, a filtered-out failed check still blocks dependent work, and work item order follows the document.
    - [x] **Checklist asset build**
      - Action: Build the Checklist UI asset once from the locked npm dependency graph.
      - Expect: The build succeeds and the filter strip comes from the shared implementation.

- [ ] **7. Make the Checklist UI receive its transport**
  Outcome: The Checklist screen takes its transport from its host instead of reaching for the WebView object, without changing the desktop behaviour.
  Checks:
    - [ ] **Transport seam contract**
      - Action: Run focused tests for the injected transport, the desktop entry supplying the WebView transport, and the screen holding no direct WebView reference.
      - Expect: The screen resolves no global WebView object, the existing bridge path is unchanged, and a substitute transport can drive the same screen in tests.

- [ ] **8. Verify the packaged flow after the shared component move**
  Depends on: 3, 4, 6, 7.
  Outcome: The Release WPF Checklist App shows the shared summary, next-step card, and filters, and still saves safely against a disposable Markdown file without LocalWebService.
  Checks:
    - [ ] **Focused package build and tests**
      - Action: Run the focused Checklist, CLI, and Node tests and the Release build once with the locked dependency graph, then inspect the packaged Checklist UI and WebView2 files.
      - Expect: All focused tests and the build pass, and the output contains the executable, current Checklist assets, WebView2 managed assemblies, and native loader.
    - [ ] **Packaged Checklist interaction** `[manual]`
      - Action: Open a disposable Checklist copy, read the summary and next-step card, apply a status filter and an owner filter, cycle one manual marker through all three states, then reopen the App.
      - Expect: The summary counts match the file, the next-step card names the outstanding check, filtering changes only what is visible, saving still works in both persistence modes, and only the disposable file changes.
      - Reason: Requires the user's Windows desktop, installed Evergreen WebView2 Runtime, and direct UX confirmation.
