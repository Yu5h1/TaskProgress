/*
 * The Time render layer, extracted from `app.js` in three confirmed stages
 * (Documentation/ExtensionModuleArchitecturePlan.md#phase-2viewer-registry-與-time-遷移):
 * a fixture-tested pure extraction, a live passive-shadow comparison against
 * the still-live inline code (verified 2026-08-25 against the real
 * `task-progress` scope, both project- and item-level dialogs, editing and
 * preview), then this production cutover — `app.js` now calls these
 * functions directly and the old inline duplicate is gone.
 *
 * This file owns only prop computation: turning a `time-dialog-control.js`
 * snapshot plus editing-session facts into the two UI regions' props. It
 * does not call `createUiView`, does not read `document`, and does not own
 * `timeController`/`timeAnalysis`/`timeDraft`/`deliveryPreview` — those stay
 * `app.js` state, passed in explicitly via `context`, including every
 * editing-session callback. That ownership split is deliberate: Renderer,
 * per the architecture plan's component table, turns data into slots — it
 * does not also have to absorb the editing session to be a real module, and
 * the editing capability move is documented for a later vertical slice, not
 * this one. Registering this as a real `taskprogress.time` entry in
 * `module-registry.js`, and driving it from a manifest instead of `app.js`
 * calling it directly, remains unstarted.
 */
import { activeEstimateIndex } from "./time-input-draft.js";

/*
 * `context.callbacks.onOpenProjectDetail` mirrors today's inline closure
 * (`state.timeController.openProjectDetail(); renderTimeReference();`) —
 * the caller supplies one function that does both, since this module has no
 * way to mutate `timeController` or trigger a re-render itself.
 */
export function buildTimeSummaryProps(context) {
  return {
    ...context.snapshot.summary,
    onClick: context.callbacks.onOpenProjectDetail,
  };
}

export function buildTimeSettingsProps(context) {
  if (!context.editing) return null;
  const config = context.timeDraftView?.inputs.config ?? null;
  return {
    hasConfig: Boolean(config),
    config,
    onApply: context.callbacks.onApplyTimeSettings,
    onPreview: context.callbacks.onPreviewTimeSettings,
    onPendingChange: context.callbacks.onPendingTimeSettingsChange,
    onInitializeConfig: context.callbacks.onInitializeTimeConfig,
  };
}

/*
 * `context.hasTimeDraft` stands in for today's `state.editor.timeDraft`
 * truthiness check — a boolean instead of the draft controller object
 * itself, since this module has no business holding a reference to it.
 */
export function buildTimeDialogProps(context) {
  const {
    snapshot, editing, timeDraftView, hasTimeDraft, deliveryPreview, callbacks,
  } = context;
  return {
    ...snapshot.dialog,
    editing,
    activeEstimate: snapshot.dialog.kind === "item"
      ? activeEstimateIndex(timeDraftView?.inputs ?? null).get(snapshot.dialog.item?.itemId) ?? null
      : null,
    onManualEstimate: editing && hasTimeDraft ? callbacks.onManualEstimate : null,
    onClose: callbacks.onClose,
    onToggleDetails: callbacks.onToggleDetails,
    onSetTab: callbacks.onSetTab,
    timeSettings: buildTimeSettingsProps(context),
    deliveryPreview,
  };
}
