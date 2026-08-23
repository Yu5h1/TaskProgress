# Experimental Time Module

This isolated spike proves the Time-first module boundary without changing the production Viewer, Launcher, LocalWebService, analyzer, or shared Time UI.

```text
legacy discovery ─┐
                  ├─ immutable normalized input → trusted Time Module
manifest loader ──┘                         └─ production time-model.js
```

The spike implements fixture, passive-shadow, isolated-preview, and cutover composition. Only one adapter may be active. Shadow can inspect normalized semantics but cannot render, start runtime, preview, save, or mutate routes.

Run the focused tests:

```powershell
node --test tests/time-module-spike.test.mjs
```

Inspect the repository's current example estimates:

```powershell
node experiments/time-reference/module-spike/run-current-estimates.mjs
```

The runner reads `../examples/report.json`, `time.estimates.json`, and `time.analysis.json` directly. It writes nothing and does not start a Viewer or service.
