/*
 * Time as a registered trusted module — the first real occupant of
 * `module-registry.js`, which until now was built and tested but unused by
 * production.
 *
 * What this owns: the time runtime controller, constructed in `attach()` and
 * stopped in `dispose()`; the capsule descriptors for all three slots it
 * declares; the commands that drive its own dialog; and the clock-driven
 * refresh. That is the Runtime Controller responsibility the architecture
 * plan's component table assigns to a module rather than to Core.
 *
 * What it deliberately does not own: the editing session. Drafts, delivery
 * previews and save confirmation stay in `app.js` and arrive through
 * `detailProps(editing)`, because moving them is the separate — and still
 * open — shared assessment shell question.
 *
 * The host is reached only through callbacks it supplied: `getWorkProgressRatio`
 * for a figure derived from the report, and `onChanged` to say "something I
 * own moved, re-render". Nothing here touches the DOM.
 */
import { buildTimeDialogProps, buildTimeSummaryProps } from "./time-viewer-module.js";
import { createTimeReferenceController } from "./time-dialog-control.js";

/*
 * Deadline urgency is a function of the current clock, so the projection has
 * to be recomputed as time passes and whenever the page comes back to the
 * foreground after being hidden — otherwise a tab left open overnight shows
 * yesterday's lamp.
 */
const REFRESH_INTERVAL_MS = 60_000;

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
 * The snapshot is read at capsule-build time rather than captured at attach,
 * because urgency changes with the clock — capturing it once would freeze the
 * capsule at whatever the page loaded with and make the refresh pointless.
 */
export function createTimeModuleDefinition() {
  return {
    type: TIME_MODULE_TYPE,
    supportedSchemaVersions: ["0.2"],
    slots: ["project-summary", "task-body", "item-inline"],
    attach({ data, host }) {
      /*
       * The module owns its runtime controller: it is constructed here from
       * the projection it was attached with, and `dispose()` is what stops
       * it. A throw during construction is caught by `attachModules` and
       * isolated as a per-module diagnostic, so a malformed projection no
       * longer needs the host to guard it.
       */
      const controller = createTimeReferenceController({
        sourceAnalysis: data,
        workProgressRatio: host.getWorkProgressRatio(),
      });
      let timer = null;
      let onForeground = null;

      const snapshotNow = () => controller.snapshot();

      return {
        capsuleFor(slot, subject) {
          if (slot === "project-summary") {
            const snapshot = snapshotNow();
            if (!snapshot) return null;
            const props = buildTimeSummaryProps({
              snapshot,
              callbacks: {
                onOpenProjectDetail: () => { controller.openProjectDetail(); host.onChanged(); },
              },
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
            const duration = subject?.taskId ? controller.taskDuration(subject.taskId) : null;
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
            const itemTime = subject?.itemId ? controller.itemTime(subject.itemId) : null;
            if (!itemTime) return null;
            const label = formatHours(itemTime);
            return {
              id: TIME_ITEM_CAPSULE_ID,
              label,
              className: "time-item-button",
              sortable: true,
              ariaLabel: `${subject.itemTitle}，${label}，查看估算依據`,
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
          if (slot === "project-summary") controller.openProjectDetail();
          if (slot === "item-inline" && subject) {
            controller.showItemTime(subject.itemId, subject.itemTitle, subject.taskId);
          }
          host.onChanged();
        },

        /*
         * Detail props for the panel the host still mounts. Everything the
         * editing session owns arrives in `editing`; this module contributes
         * only what it knows — the current snapshot and the four commands
         * that drive its own dialog.
         */
        detailProps(editing) {
          return buildTimeDialogProps({
            ...editing,
            snapshot: snapshotNow(),
            callbacks: {
              ...editing.callbacks,
              onClose: () => { controller.closeDialog(); host.onChanged(); },
              onToggleDetails: () => { controller.toggleDetails(); host.onChanged(); },
              onSetTab: (name) => { controller.setActiveTab(name); host.onChanged(); },
            },
          });
        },

        /*
         * Urgency depends on the clock, so the projection is recomputed on a
         * timer and whenever the page returns to the foreground. Owning this
         * here is what makes `dispose()` able to stop it — the host's own
         * interval used to outlive every scope switch.
         */
        start() {
          const recompute = () => { controller.refresh(); host.onChanged(); };
          timer = setInterval(recompute, REFRESH_INTERVAL_MS);
          // Only a return *to* the foreground is worth recomputing for;
          // firing on the hide half would do work nobody can see.
          onForeground = () => {
            if (globalThis.document?.visibilityState === "hidden") return;
            recompute();
          };
          globalThis.addEventListener?.("pageshow", onForeground);
          globalThis.document?.addEventListener("visibilitychange", onForeground);
        },
        dispose() {
          if (timer !== null) clearInterval(timer);
          timer = null;
          if (onForeground) {
            globalThis.removeEventListener?.("pageshow", onForeground);
            globalThis.document?.removeEventListener("visibilitychange", onForeground);
            onForeground = null;
          }
        },
      };
    },
  };
}
