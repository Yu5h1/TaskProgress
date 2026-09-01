/*
 * Cost as the second registered trusted module.
 *
 * Its whole reason for existing at this stage is to be a second real occupant
 * of the same slots Time fills, in a domain whose unit is money rather than
 * minutes. Where this file and `time-module-definition.js` agree, the shared
 * contract is real; where they need different shapes, that difference is the
 * evidence the assessment shell contract still has to account for.
 *
 * Simpler than Time in two ways, both deliberate:
 *
 *   - No runtime controller and no `start()`. Money does not change because
 *     an hour passed, so there is nothing to refresh on a clock. A module that
 *     needs no lifecycle should not be given one to look symmetrical.
 *   - No editing. Cost estimates are written by an external tool for now, so
 *     the item capsule has no unset marker: there is nowhere for it to lead.
 *
 * Nothing here touches the DOM. The host is reached only through `onChanged`.
 */
import { createCostReader } from "./cost-model.js";

export const COST_MODULE_TYPE = "taskprogress.cost";
export const COST_CAPSULE_ID = "cost";

export function createCostModuleDefinition() {
  return {
    type: COST_MODULE_TYPE,
    supportedSchemaVersions: ["0.1"],
    slots: ["project-summary", "task-body", "item-inline"],
    attach({ data, host }) {
      const reader = createCostReader(data);
      /*
       * Which subject the open panel is about. One dialog serves both, the
       * same contract Time's does — but the subject has to travel with the
       * activation, or an item capsule opens a panel showing the project
       * total and never the figure the reader just pressed.
       */
      let openSubject = null;

      return {
        capsuleFor(slot, subject) {
          if (slot === "project-summary") {
            const total = reader.projectTotal();
            if (!total) return null;
            return {
              id: COST_CAPSULE_ID,
              className: `capsule-button cost-summary-button cost-${total.tone}`,
              label: total.label,
              ariaLabel: `專案估算成本 ${total.exact}，${total.coverageLabel}`,
              showChevron: true,
            };
          }
          /*
           * Task level is a label, not a capsule — the same call Time makes,
           * and for the same reason: a task total is the sum of its items, so
           * anything pressable here would promise an action that does not
           * exist.
           */
          if (slot === "task-body") {
            const total = subject?.taskId ? reader.taskTotal(subject.taskId) : null;
            if (!total) return null;
            return {
              id: COST_CAPSULE_ID,
              label: total.label,
              interactive: false,
              sortable: false,
            };
          }
          if (slot === "item-inline") {
            const amount = subject?.itemId ? reader.itemAmount(subject.itemId) : null;
            // Unset shows nothing at all, in either mode. Time offers an unset
            // marker because it has a panel that can create a first estimate;
            // Cost has no editing yet, so a marker here would be an entry
            // point to nowhere.
            if (!amount) return null;
            return {
              id: COST_CAPSULE_ID,
              label: amount.label,
              className: "cost-item-button",
              sortable: true,
              ariaLabel: `${subject.itemTitle}，估算成本 ${amount.exact}`,
              title: `估算成本 ${amount.exact}`,
            };
          }
          return null;
        },
        ownsCapsule(slot, capsuleId) {
          if (slot === "project-summary") return capsuleId === COST_CAPSULE_ID;
          if (slot === "item-inline") return capsuleId === COST_CAPSULE_ID;
          return false;
        },
        activate(slot, capsuleId, activated) {
          if (!this.ownsCapsule(slot, capsuleId)) return;
          openSubject = slot === "item-inline" && activated
            ? { kind: "item", itemId: activated.itemId, itemTitle: activated.itemTitle }
            : { kind: "project" };
          host.onChanged();
        },

        /*
         * Detail props for the panel the host mounts. Cost contributes only
         * what it knows; it holds no draft, because it has no editing.
         */
        /*
         * Which shared view renders this module's detail panel. The host
         * mounts it into one dock shared by every module, so naming the
         * view here is what keeps the host from naming this module.
         */
        detailView: "cost-dialog",

        detailProps() {
          const onClose = () => { openSubject = null; host.onChanged(); };
          if (openSubject?.kind === "item") {
            const amount = reader.itemAmount(openSubject.itemId);
            return {
              open: Boolean(amount),
              kind: "item",
              kicker: "子項目成本",
              title: openSubject.itemTitle,
              item: amount,
              onClose,
            };
          }
          const total = reader.projectTotal();
          return {
            open: Boolean(openSubject) && Boolean(total),
            kind: "project",
            kicker: "估算成本",
            title: "專案成本",
            total,
            onClose,
          };
        },
      };
    },
  };
}
