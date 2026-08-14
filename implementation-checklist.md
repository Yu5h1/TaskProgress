# Implementation Checklist

Current round: `plan.md#結構化-checklist-編輯-draft-01-2026-08-13`.

Run every Agent check once. If a check fails, mark it `[!]`, add `Observed`, and pause automatic retries plus dependent work. After an intervention, the user may request one new verification attempt; success changes the same check to `[x]` while preserving `Observed` and adding `Resolved`. Continue independent work when safe. Create a new item only when the outcome or acceptance contract changes. The parent marker is derived from its checks. This file contains only the active round; git history owns prior rounds.

- [x] **1. Add the strict Checklist document core**
  Outcome: TaskProgress can parse and serialize the approved Markdown shape, derive parent status, preserve the document envelope, reject malformed or frozen-result changes, and detect source revision conflicts.
  Checks:
    - [x] **Focused document-core tests**
      Action: Run the Checklist parser, writer, derived-status, immutable-result, malformed-input, and revision-conflict tests once.
      Expect: Every focused test passes and an unchanged document round-trips byte-for-byte.
      Observed: `dotnet run` stopped during restore with NU1301 because the sandbox could not connect to `https://api.nuget.org/v3/index.json`; compilation and the focused tests did not start.
      Resolved: Publish-only restore inputs were isolated, CRLF round parsing and resolved-result serialization were corrected, and all 16 focused document-core checks passed with byte-for-byte CRLF／BOM round trips.

- [ ] **2. Add the WPF and WebView2 desktop host boundary**
  Depends on: 1.
  Outcome: `task-progress.exe checklist <file>` validates one exact Markdown file and opens a WPF WebView2 window without starting LocalWebService; the pinned official WebView2 dependency and runtime failure path are explicit.
  Checks:
    - [ ] **CLI and host contract tests**
      Action: Restore the pinned package with a lock file, then run the focused CLI and desktop-host source tests once.
      Expect: The command accepts one existing file, rejects missing or extra targets, does not enter the LocalWebService path, and the project builds from the locked dependency graph.

- [ ] **3. Add the restricted bridge and shared Svelte Checklist UI**
  Depends on: 2.
  Outcome: The WPF host exposes only load and save messages for the selected document; the Svelte UI renders derived work-item state, keeps Agent checks read-only, lets users draft nullable pass／fail only for manual checks, requires Observed on failure, and shares existing Editor transaction and SaveBar behavior.
  Checks:
    - [ ] **Bridge and Svelte source tests**
      Action: Run the focused bridge allowlist, payload validation, Checklist UI, and shared-component source tests once.
      Expect: Unknown messages and stale revisions are rejected, no arbitrary path crosses the bridge, and all Checklist interaction rules are represented by one Svelte implementation.
    - [ ] **Checklist asset build**
      Action: Build the dedicated Checklist UI asset once from the existing locked npm dependency graph.
      Expect: The WPF-loadable HTML／JavaScript／CSS assets are produced without adding another UI framework or copying shared controls.

- [ ] **4. Verify the packaged desktop flow**
  Depends on: 2, 3.
  Outcome: A built TaskProgress executable opens the real checklist in a WPF window, edits only manual results, saves valid Markdown atomically, and can discard an unsaved draft without using localhost.
  Checks:
    - [ ] **Focused .NET build and tests**
      Action: Run the focused TaskProgress CLI tests and Release build once with locked restore.
      Expect: Tests and build pass; output contains the Checklist assets and WebView2 host files required at runtime.
    - [ ] **Real WPF Checklist interaction** `[manual]`
      Action: Open a disposable Checklist copy with `task-progress.exe checklist <file>`, change one manual check, test Discard, then save once.
      Expect: No LocalWebService process or port is used; Discard restores the persisted value; Save changes only the selected Markdown file and reopening shows the saved result.
      Reason: Requires the user's Windows desktop, installed Evergreen WebView2 Runtime, and direct UX confirmation.

- [x] **5. Isolate publish-only properties from normal builds**
  Outcome: Normal CLI and test restore no longer requests publish runtime packs, while `Publish.cmd` remains the single owner of the existing self-contained single-file contract.
  Checks:
    - [x] **Offline document-core restore and tests**
      Action: Restore the focused Checklist test project once with unavailable sources ignored and NuGet audit disabled, then run it with `--no-restore`.
      Expect: Restore completes without NU1301, compilation succeeds, and every focused document-core test passes.
      Observed: Offline restore completed for both projects without NU1301, but compilation stopped at `ChecklistDocument.cs:277` with CS1501 because the selected `CopyTo` overload does not accept two arguments; the focused tests did not run.
      Resolved: The BOM copy overload and subsequent parser defects were corrected; the already-restored project compiled and all 16 focused document-core checks passed.
    - [x] **Publish command contract**
      Action: Run the focused source contract test for `TaskProgress.Cli.csproj` and `Publish.cmd`.
      Expect: The csproj contains no RID, self-contained, or single-file publish settings; `Publish.cmd` explicitly supplies `win-x64`, self-contained, single-file, no trimming, compression, and native self-extraction.

- [x] **6. Correct UTF-8 BOM serialization and finish the focused proof**
  Outcome: The Checklist document core compiles, preserves UTF-8 BOM bytes, passes its focused behavioral tests, and the publish-only settings remain isolated from normal builds.
  Checks:
    - [x] **Document-core and publish-contract tests**
      Action: Run the already-restored focused Checklist document-core project with `--no-restore`, then run the publish-contract Node test once.
      Expect: Compilation succeeds, all document-core checks pass, and both publish-contract tests pass.
      Observed: The CRLF and resolved-result contract changes were applied, but compilation stopped at `ChecklistDocument.cs:106` with CS0121 because `Select(RoundPattern.Match)` was ambiguous between the indexed and non-indexed LINQ overloads. The document-core tests and publish-contract test did not run.
      Resolved: The method group was replaced with an explicit one-argument lambda; compilation succeeded, all 16 document-core checks passed, and both publish-contract tests passed.
