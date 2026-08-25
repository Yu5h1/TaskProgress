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
 * The item capsule keeps the id `time` because that id is also what the
 * browser-local module ordering preference is keyed on — the reader's chosen
 * left-to-right order has to mean the same thing in both strips.
 */
export const TIME_ITEM_CAPSULE_ID = "time";

function formatHours(itemTime) {
  return itemTime.label
    ?? `${Number(itemTime.display_hours).toLocaleString(undefined, { maximumFractionDigits: 2 })} hr`;
}

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
    slots: ["project-summary", "task-body", "item-inline"],
    attach({ host }) {
      return {
        capsuleFor(slot, subject) {
          if (slot === "project-summary") {
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
          }
          /*
           * Task level is a label, not a capsule. A task total is the sum of
           * its items — there is nothing editable at this level, so anything
           * that looked pressable would promise an action that does not
           * exist. `sortable: false` keeps it out of capsule reordering.
           */
          if (slot === "task-body") {
            const duration = subject?.taskId ? host.getTaskDuration(subject.taskId) : null;
            if (!duration) return null;
            return {
              id: TIME_PROJECT_CAPSULE_ID,
              label: `約需 ${duration}`,
              interactive: false,
              sortable: false,
            };
          }
          if (slot === "item-inline") {
            // No estimate for this item means no capsule at all, which is
            // also what the unset-value rule requires of preview.
            const itemTime = subject?.itemId ? host.getItemTime(subject.itemId) : null;
            if (!itemTime) return null;
            const label = formatHours(itemTime);
            return {
              id: TIME_ITEM_CAPSULE_ID,
              label,
              className: "time-item-button",
              sortable: true,
              ariaLabel: host.canOpenItemDetail
                ? `${subject.itemTitle}，${label}，查看估算依據`
                : `${subject.itemTitle}，目前分析 ${label}`,
              title: `目前分析：${itemTime.likely_minutes} 分鐘；可拖曳調整模組順序`,
            };
          }
          return null;
        },
        ownsCapsule(slot, capsuleId) {
          if (slot === "project-summary") return capsuleId === TIME_PROJECT_CAPSULE_ID;
          if (slot === "item-inline") return capsuleId === TIME_ITEM_CAPSULE_ID;
          return false;
        },
        activate(slot, capsuleId, subject) {
          if (!this.ownsCapsule(slot, capsuleId)) return;
          if (slot === "project-summary") host.openProjectDetail();
          if (slot === "item-inline" && subject) {
            host.openItemDetail(subject.itemId, subject.itemTitle, subject.taskId);
          }
        },
        dispose() {
          // Nothing to release yet: the controller and its timers are still
          // owned by app.js. When they move here, this is where they stop.
        },
      };
    },
  };
}
