// Fixture coverage for the Time render layer (production since the stage-3
// cutover, 2026-08-25) — see the header comment in
// ../viewer/assets/time-viewer-module.js for the ownership split (rendering
// only; editing-session state stays in app.js). Every assertion here stays
// off the DOM: no `createUiView`, no `document`.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildTimeDialogProps,
  buildTimeSettingsProps,
  buildTimeSummaryProps,
} from "../viewer/assets/time-viewer-module.js";

function noop() {}

function callbacks(overrides = {}) {
  return {
    onOpenProjectDetail: noop,
    onManualEstimate: noop,
    onClose: noop,
    onToggleDetails: noop,
    onSetTab: noop,
    onApplyTimeSettings: noop,
    onPreviewTimeSettings: noop,
    onPendingTimeSettingsChange: noop,
    onInitializeTimeConfig: noop,
    ...overrides,
  };
}

// --- buildTimeSummaryProps ---

test("summary props spread the snapshot's summary and wire onClick to the caller's callback", () => {
  const snapshot = { summary: { label: "M/D 交付", tone: "danger" }, dialog: {} };
  const onOpenProjectDetail = () => {};
  const props = buildTimeSummaryProps({ snapshot, callbacks: callbacks({ onOpenProjectDetail }) });
  assert.equal(props.label, "M/D 交付");
  assert.equal(props.tone, "danger");
  assert.equal(props.onClick, onOpenProjectDetail);
});

// --- buildTimeSettingsProps ---

test("time settings props are null outside a global edit session", () => {
  assert.equal(buildTimeSettingsProps({ editing: false, timeDraftView: null, callbacks: callbacks() }), null);
});

test("time settings props report hasConfig and pass every callback through by identity", () => {
  const onApplyTimeSettings = () => {};
  const onPreviewTimeSettings = () => {};
  const onPendingTimeSettingsChange = () => {};
  const onInitializeTimeConfig = () => {};
  const props = buildTimeSettingsProps({
    editing: true,
    timeDraftView: { inputs: { config: { delivery_at: "2026-09-01" } } },
    callbacks: callbacks({
      onApplyTimeSettings, onPreviewTimeSettings, onPendingTimeSettingsChange, onInitializeTimeConfig,
    }),
  });
  assert.equal(props.hasConfig, true);
  assert.deepEqual(props.config, { delivery_at: "2026-09-01" });
  assert.equal(props.onApply, onApplyTimeSettings);
  assert.equal(props.onPreview, onPreviewTimeSettings);
  assert.equal(props.onPendingChange, onPendingTimeSettingsChange);
  assert.equal(props.onInitializeConfig, onInitializeTimeConfig);
});

test("time settings props report hasConfig false when editing has started but no config exists yet", () => {
  const props = buildTimeSettingsProps({ editing: true, timeDraftView: null, callbacks: callbacks() });
  assert.equal(props.hasConfig, false);
  assert.equal(props.config, null);
});

// --- buildTimeDialogProps ---

function dialogContext(overrides = {}) {
  return {
    snapshot: { dialog: { kind: "project", open: true } },
    editing: false,
    timeDraftView: null,
    hasTimeDraft: false,
    deliveryPreview: null,
    callbacks: callbacks(),
    ...overrides,
  };
}

test("dialog props spread the snapshot's dialog and pass editing/deliveryPreview through", () => {
  const deliveryPreview = { next: { available: true } };
  const props = buildTimeDialogProps(dialogContext({
    snapshot: { dialog: { kind: "project", open: true, activeTab: "flow" } },
    editing: true,
    deliveryPreview,
  }));
  assert.equal(props.kind, "project");
  assert.equal(props.open, true);
  assert.equal(props.activeTab, "flow");
  assert.equal(props.editing, true);
  assert.equal(props.deliveryPreview, deliveryPreview);
});

test("activeEstimate is null for a project-kind dialog even when the draft has active estimates", () => {
  const props = buildTimeDialogProps(dialogContext({
    snapshot: { dialog: { kind: "project" } },
    timeDraftView: { inputs: { estimates: { estimates: [{ item_id: "a", active: true }] } } },
  }));
  assert.equal(props.activeEstimate, null);
});

test("activeEstimate resolves the active estimate for the dialog's item, or null when none is active", () => {
  const timeDraftView = {
    inputs: {
      estimates: {
        estimates: [
          { item_id: "a", active: true, likely_minutes: 120 },
          { item_id: "a", active: false, likely_minutes: 60 },
          { item_id: "b", active: true, likely_minutes: 30 },
        ],
      },
    },
  };
  const found = buildTimeDialogProps(dialogContext({
    snapshot: { dialog: { kind: "item", item: { itemId: "a" } } },
    timeDraftView,
  }));
  assert.deepEqual(found.activeEstimate, { item_id: "a", active: true, likely_minutes: 120 });

  const missing = buildTimeDialogProps(dialogContext({
    snapshot: { dialog: { kind: "item", item: { itemId: "no-such-item" } } },
    timeDraftView,
  }));
  assert.equal(missing.activeEstimate, null);
});

test("onManualEstimate is only exposed while editing with a draft present", () => {
  const onManualEstimate = () => {};
  const withCallback = callbacks({ onManualEstimate });

  assert.equal(
    buildTimeDialogProps(dialogContext({ editing: false, hasTimeDraft: true, callbacks: withCallback })).onManualEstimate,
    null,
    "not editing",
  );
  assert.equal(
    buildTimeDialogProps(dialogContext({ editing: true, hasTimeDraft: false, callbacks: withCallback })).onManualEstimate,
    null,
    "editing but no draft yet",
  );
  assert.equal(
    buildTimeDialogProps(dialogContext({ editing: true, hasTimeDraft: true, callbacks: withCallback })).onManualEstimate,
    onManualEstimate,
  );
});

test("onClose/onToggleDetails/onSetTab pass through by identity", () => {
  const onClose = () => {};
  const onToggleDetails = () => {};
  const onSetTab = () => {};
  const props = buildTimeDialogProps(dialogContext({ callbacks: callbacks({ onClose, onToggleDetails, onSetTab }) }));
  assert.equal(props.onClose, onClose);
  assert.equal(props.onToggleDetails, onToggleDetails);
  assert.equal(props.onSetTab, onSetTab);
});

test("dialog props embed the same timeSettings a direct call would build", () => {
  const context = dialogContext({
    editing: true,
    timeDraftView: { inputs: { config: { delivery_at: "2026-09-01" } } },
  });
  const props = buildTimeDialogProps(context);
  assert.deepEqual(props.timeSettings, buildTimeSettingsProps(context));
});

test("dialog props carry no timeSettings outside a global edit session", () => {
  const props = buildTimeDialogProps(dialogContext({ editing: false }));
  assert.equal(props.timeSettings, null);
});

// --- isolation: this file never touches the DOM itself ---

test("time-viewer-module.js stays off the DOM", async () => {
  const source = await readFile(new URL("../viewer/assets/time-viewer-module.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /document\.|window\.|querySelector\(|createUiView\(/u);
});

// --- stage 3 wiring shape: app.js's real createUiView calls now mount this
// module's output directly, the stage-2 shadow scaffolding is gone, and the
// old inline duplicate (including the standalone timeSettingsProps()) no
// longer exists to drift out of sync with it. ---

test("app.js mounts the dialog directly but gets the capsule from the registry, not from Time by name", async () => {
  const appSource = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.match(appSource, /from "\.\/time-viewer-module\.js"/u);
  assert.match(appSource, /const dialogProps = buildTimeDialogProps\(context\);/u);
  assert.match(appSource, /createUiView\("time-dialog", elements\.timeDialog, dialogProps\)/u);

  // The main-panel capsule now comes from the module lifecycle loop
  // (2026-08-25). `buildTimeSummaryProps` moved behind Time's registered
  // definition, so this render path must no longer call it — that is what
  // makes a second module joinable without editing this function.
  assert.doesNotMatch(appSource, /buildTimeSummaryProps/u);
  assert.match(
    appSource,
    /collectCapsules\(\s*state\.attachedModules,\s*"project-summary",\s*null,\s*\{ stale: state\.moduleProjectionStale \},\s*\)/u,
  );
  // Activation dispatches by capsule id; ignoring it silently worked only
  // while exactly one capsule existed.
  assert.match(appSource, /onActivate: \(capsuleId\) => activateCapsule\(state\.attachedModules, "project-summary", capsuleId\)/u);
});

test("the Time render layer is still the one place that computes the capsule's props", async () => {
  const definitionSource = await readFile(
    new URL("../viewer/assets/time-module-definition.js", import.meta.url),
    "utf8",
  );
  assert.match(definitionSource, /import \{ buildTimeSummaryProps \} from "\.\/time-viewer-module\.js"/u);
});

test("the stage-2 shadow scaffolding and the old inline duplicate are both gone", async () => {
  const appSource = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.doesNotMatch(appSource, /shadowCheckTimeReference|diffTimeReferenceProps|activeEstimateIndex/u);
  assert.doesNotMatch(appSource, /function timeSettingsProps\(\)/u);
});
