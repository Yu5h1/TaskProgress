/*
 * Time as a registered trusted module — the first real occupant of
 * `module-registry.js`, which until now was built and tested but unused by
 * production.
 *
 * Scope of this step, stated plainly so the next reader does not assume more
 * moved than did: this definition owns **producing Time's main-panel capsule
 * descriptor and dispatching its activation**. It does not own the time
 * controller, the dialog, the 60-second refresh, or the editing session —
 * those stay in `app.js`, reached through the `host` callbacks below. Moving
 * the runtime controller behind `attach()`/`dispose()` (where the
 * architecture plan's component table ultimately puts it) is a later step and
 * needs its own verification, because it changes who owns live state rather
 * than only who computes props.
 *
 * What this does prove: `app.js` no longer names Time when building the
 * main-panel strip. A second module joins by registering a definition, not by
 * editing the render path.
 */
import { buildTimeSummaryProps } from "./time-viewer-module.js";

export const TIME_MODULE_TYPE = "taskprogress.time";
export const TIME_PROJECT_CAPSULE_ID = "time";

/*
 * `host` supplies what the Viewer owns: the current controller snapshot (or
 * `null` when there is no time data) and the action that opens the project
 * detail. Keeping both as callbacks rather than values matters — the snapshot
 * changes on every refresh tick, so capturing it at attach time would freeze
 * the capsule at whatever urgency it had when the page loaded.
 */
export function createTimeModuleDefinition() {
  return {
    type: TIME_MODULE_TYPE,
    supportedSchemaVersions: ["0.2"],
    slots: ["project-summary"],
    attach({ host }) {
      return {
        capsuleFor(slot) {
          if (slot !== "project-summary") return null;
          const snapshot = host.getSnapshot();
          if (!snapshot) return null;
          const props = buildTimeSummaryProps({
            snapshot,
            callbacks: { onOpenProjectDetail: host.openProjectDetail },
          });
          return {
            id: TIME_PROJECT_CAPSULE_ID,
            className: props.className,
            label: props.label,
            ariaLabel: props.ariaLabel,
            showDot: props.showDot,
            showChevron: props.showChevron,
            disabled: props.disabled,
          };
        },
        ownsCapsule(slot, capsuleId) {
          return slot === "project-summary" && capsuleId === TIME_PROJECT_CAPSULE_ID;
        },
        activate(slot, capsuleId) {
          if (this.ownsCapsule(slot, capsuleId)) host.openProjectDetail();
        },
        dispose() {
          // Nothing to release yet: the controller and its timers are still
          // owned by app.js. When they move here, this is where they stop.
        },
      };
    },
  };
}
