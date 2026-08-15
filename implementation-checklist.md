# Implementation Checklist

Current round: `plan.md#結構化-checklist-編輯-draft-01-2026-08-13`.

Run every Agent check once. If a check fails, mark it `[!]`, add `Observed`, and pause automatic retries plus dependent work. After an intervention, the user may request one new verification attempt; success changes the same check to `[x]` while preserving `Observed` and adding `Resolved`. Manual checks remain user-editable through the shared marker cycle; Agent results do not. Continue independent work when safe. Create a new item only when the outcome or acceptance contract changes. The parent marker is derived from its checks. This file contains only the active round; git history owns prior rounds.

- [x] **1. Add the strict Checklist document core**
  Outcome: TaskProgress can parse and serialize the approved Markdown shape, derive parent status, preserve the document envelope, reject malformed or frozen-result changes, and detect source revision conflicts.
  Checks:
    - [x] **Focused document-core tests**
      - Action: Run the Checklist parser, writer, derived-status, immutable-result, malformed-input, and revision-conflict tests once.
      - Expect: Every focused test passes and an unchanged document round-trips byte-for-byte.
      - Observed: `dotnet run` stopped during restore with NU1301 because the sandbox could not connect to `https://api.nuget.org/v3/index.json`; compilation and the focused tests did not start.
      - Resolved: Publish-only restore inputs were isolated, CRLF round parsing and resolved-result serialization were corrected, and all 16 focused document-core checks passed with byte-for-byte CRLF／BOM round trips.

- [x] **2. Add the WPF and WebView2 desktop host boundary**
  Depends on: 1.
  Outcome: `task-progress.exe checklist <file>` validates one exact Markdown file and opens a WPF WebView2 window without starting LocalWebService; the pinned official WebView2 dependency and runtime failure path are explicit.
  Checks:
    - [x] **CLI and host contract tests**
      - Action: Restore the pinned package with a lock file, then run the focused CLI and desktop-host source tests once.
      - Expect: The command accepts one existing file, rejects missing or extra targets, does not enter the LocalWebService path, and the project builds from the locked dependency graph.
      - Observed: Locked restore of `Microsoft.Web.WebView2` 1.0.4078.44 succeeded, and project-level `System.IO`／`System.Net.Http` global usings restored the CLI compile boundary. The focused test project then emitted MSB3277 for conflicting WindowsBase versions 4 and 5 and stopped at `Program.cs:91` with CS0234 because the test directly constructs `WebView2RuntimeNotFoundException` without a compatible WebView2 reference. The C# tests, Node Host test, and item 7 format check did not run.
      - Resolved: The test now exercises a framework-neutral runtime-missing error builder while production still catches `WebView2RuntimeNotFoundException`. Locked restore succeeded, all 26 C# document／command／host checks passed, and both Node Host contract tests passed without starting a GUI or LocalWebService.

- [x] **3. Add the restricted bridge and shared Svelte Checklist UI**
  Depends on: 2.
  Outcome: The WPF host exposes only load and save messages for the selected document; the Svelte UI renders derived work-item state, keeps Agent checks read-only, lets users draft nullable pass／fail only for manual checks, requires Observed on failure, and shares existing Editor transaction and SaveBar behavior.
  Checks:
    - [x] **Bridge and Svelte source tests**
      - Action: Run the focused bridge allowlist, payload validation, Checklist UI, and shared-component source tests once.
      - Expect: Unknown messages and stale revisions are rejected, no arbitrary path crosses the bridge, and all Checklist interaction rules are represented by one Svelte implementation.
      - Observed: All 7 Node bridge／UI／shared-transaction tests passed. The first C# run stopped with three CS9007 errors in raw interpolated JSON fixtures; after those fixtures moved to `JsonSerializer.Serialize`, the authorized rerun entered the bridge but failed on a normal load request with `InvalidOperationException` because `RejectUnknown` read `Name` from the empty `JsonProperty` returned by `FirstOrDefault`. The allowlist now uses a direct `foreach` scan, but the check has not been rerun again.
      - Resolved: The allowlist now scans properties directly. All 33 C# document／host／bridge checks and all 7 Node bridge／UI／shared-transaction tests passed; unknown messages, path injection, stale revisions, manual-only edits, Undo／Redo, Discard, and shared SaveBar usage are covered.
    - [x] **Checklist asset build**
      - Action: Build the dedicated Checklist UI asset once from the existing locked npm dependency graph.
      - Expect: The WPF-loadable HTML／JavaScript／CSS assets are produced without adding another UI framework or copying shared controls.

- [x] **5. Isolate publish-only properties from normal builds**
  Outcome: Normal CLI and test restore no longer requests publish runtime packs, while `Publish.cmd` remains the single owner of the existing self-contained single-file contract.
  Checks:
    - [x] **Offline document-core restore and tests**
      - Action: Restore the focused Checklist test project once with unavailable sources ignored and NuGet audit disabled, then run it with `--no-restore`.
      - Expect: Restore completes without NU1301, compilation succeeds, and every focused document-core test passes.
      - Observed: Offline restore completed for both projects without NU1301, but compilation stopped at `ChecklistDocument.cs:277` with CS1501 because the selected `CopyTo` overload does not accept two arguments; the focused tests did not run.
      - Resolved: The BOM copy overload and subsequent parser defects were corrected; the already-restored project compiled and all 16 focused document-core checks passed.
    - [x] **Publish command contract**
      - Action: Run the focused source contract test for `TaskProgress.Cli.csproj` and `Publish.cmd`.
      - Expect: The csproj contains no RID, self-contained, or single-file publish settings; `Publish.cmd` explicitly supplies `win-x64`, self-contained, single-file, no trimming, compression, and native self-extraction.

- [x] **6. Correct UTF-8 BOM serialization and finish the focused proof**
  Outcome: The Checklist document core compiles, preserves UTF-8 BOM bytes, passes its focused behavioral tests, and the publish-only settings remain isolated from normal builds.
  Checks:
    - [x] **Document-core and publish-contract tests**
      - Action: Run the already-restored focused Checklist document-core project with `--no-restore`, then run the publish-contract Node test once.
      - Expect: Compilation succeeds, all document-core checks pass, and both publish-contract tests pass.
      - Observed: The CRLF and resolved-result contract changes were applied, but compilation stopped at `ChecklistDocument.cs:106` with CS0121 because `Select(RoundPattern.Match)` was ambiguous between the indexed and non-indexed LINQ overloads. The document-core tests and publish-contract test did not run.
      - Resolved: The method group was replaced with an explicit one-argument lambda; compilation succeeded, all 16 document-core checks passed, and both publish-contract tests passed.

- [x] **7. Migrate Checklist fields to nested Markdown bullets**
  Depends on: 2.
  Outcome: Shared instructions, the active Checklist, and TaskProgress document serialization use `- Action`, `- Expect`, and the same prefix for optional check fields; optional work-item dependencies round-trip without data loss.
  Checks:
    - [x] **Focused Checklist format contract**
      - Action: Run the document parser／serializer tests and shared-format source checks once after item 2's compile boundary is restored.
      - Expect: The active Checklist parses, CRLF／BOM and dependencies round-trip byte-for-byte, legacy unbulleted check fields are rejected, and shared instructions match the emitted syntax.
      - Observed: The 26-check C# run passed active-file parsing, byte round-trip, dependency handling, and rejection of unbulleted fields. The shared-format source check then failed because `agent-work-route/SKILL.md` describes optional `Observed`／`Resolved` fields through the generic `- Field:` rule but does not contain explicit `      - Observed:` and `      - Resolved:` example lines.
      - Resolved: The shared example now includes explicit nested `- Observed:` and `- Resolved:` lines. All 26 focused C# checks and all 6 shared-format syntax assertions passed.

- [ ] **8. Add automatic and cautious persistence modes**
  Depends on: 3.
  Outcome: Editable surfaces default to revision-safe automatic persistence, while a user-persisted cautious mode exposes explicit Save and Discard without creating a second transaction or SaveBar implementation.
  Checks:
    - [ ] **Persistence-mode source contract**
      - Action: Run focused tests for automatic discrete saves, debounced text saves, Undo／Redo persistence, cautious drafts, mode-switch guards, preference storage, conflict retention, and shared SaveBar rendering.
      - Expect: The preference defaults to automatic mode, persists only in the Browser／WebView user profile, and every save path uses the existing transaction, bridge, validation, and revision contract.
    - [ ] **Checklist asset build**
      - Action: Build the dedicated Checklist UI asset once from the locked npm dependency graph.
      - Expect: The WPF-loadable assets build successfully and auto／cautious controls come from the shared editor shell rather than a Checklist-only SaveBar copy.

- [ ] **9. Replace manual result buttons with one cyclic marker**
  Depends on: 3.
  Outcome: Every manual check remains editable through one left-side `[ ]` → `[x]` → `[!]` → `[ ]` marker, while Agent and derived work-item markers remain read-only and failed saves require Observed.
  Checks:
    - [ ] **Manual-result mutation contract**
      - Action: Run focused C# and Node tests for editing saved manual results, clearing Observed／Resolved on pending, requiring new Observed on failure, deriving parent status, rejecting Agent mutations, Undo／Redo, and serializing the revised Markdown atomically.
      - Expect: Manual results can traverse the full cycle after save without allowing Agent-result mutation or bypassing source-revision validation.
    - [ ] **Single-marker presentation contract**
      - Action: Run focused Svelte source and presentation tests for manual, Agent, and work-item markers.
      - Expect: Manual checks have exactly one interactive marker in the left marker column; no pass／fail controls render on the right, and incomplete failure drafts expose one inline Observed field.

- [ ] **10. Verify the revised packaged Checklist flow**
  Depends on: 8, 9.
  Outcome: The Release WPF Checklist App persists the selected mode and manual-result cycle safely against a disposable Markdown file without LocalWebService.
  Checks:
    - [ ] **Focused package build and tests**
      - Action: Run the focused Checklist／CLI／Node tests and Release build once with the locked dependency graph, then inspect the packaged Checklist UI and WebView2 files.
      - Expect: All focused tests and the build pass, and the output contains the executable, current Checklist assets, WebView2 managed assemblies, and native loader.
    - [ ] **Revised WPF Checklist interaction** `[manual]`
      - Action: Open a disposable Checklist copy, verify automatic save and reopen persistence, cycle one manual marker through all three states, enter Observed for failure, enable cautious mode, test Save and Discard, then reopen the App.
      - Expect: Automatic mode has no Save／Discard buttons; cautious mode persists for the user and owns those buttons; only the left manual marker is interactive; invalid failure drafts are not written; no LocalWebService process or port is used; only the disposable file changes.
      - Reason: Requires the user's Windows desktop, installed Evergreen WebView2 Runtime, and direct UX confirmation.
