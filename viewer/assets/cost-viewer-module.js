/*
 * Cost render layer — the second module's Renderer, v0.1 (`estimated` only,
 * project level; see Documentation/CostEstimationModulePlan.md). Pure prop
 * computation only, no DOM: given a validated envelope's `data`, build the
 * main-panel capsule props and the detail-panel props. Mounting them is the
 * caller's job, matching the split `time-viewer-module.js` already
 * established for Time — a Renderer turns data into slot props, it does not
 * have to own a state machine to be a real module.
 */

/*
 * Minor-unit amounts (integers) formatted through Intl, matching how every
 * amount in this file's inputs is stored — never a floating-point currency
 * value. Falls back to a plain number if the currency code is not
 * recognized, rather than throwing partway through a render.
 */
export function formatCostAmount(currency, minorUnitAmount) {
  const amount = minorUnitAmount / 100;
  try {
    return new Intl.NumberFormat("zh-Hant", { style: "currency", currency, maximumFractionDigits: 0 })
      .format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("zh-Hant")}`;
  }
}

/*
 * The main-panel capsule. No deadline-style dot/urgency exists yet for Cost
 * — v0.1 shows one figure, not a risk lamp — so `showDot` is always false;
 * the field exists so the shared strip's contract stays uniform across
 * modules rather than Cost inventing its own capsule shape.
 */
export function buildCostSummaryProps({ data, onOpenDetail }) {
  const estimated = data.summary.estimated;
  const amount = formatCostAmount(data.currency, estimated.minor_unit_amount);
  return {
    id: "cost",
    className: "time-summary-button cost-summary-button",
    label: `預估成本 ${amount}`,
    ariaLabel: `預估成本 ${amount}，信心度 ${estimated.confidence}`,
    showDot: false,
    showChevron: true,
    onClick: onOpenDetail,
  };
}

/*
 * The detail panel: total, per-task breakdown, and the Time-input freshness
 * note this module's own design requires — Core's stale mechanism only
 * checks Cost's own report_revision, so a stale Time input has to be shown
 * here, by Cost, or it is invisible anywhere.
 */
export function buildCostDetailProps({ data, open, onClose }) {
  const estimated = data.summary.estimated;
  return {
    open,
    onClose,
    currency: data.currency,
    totalLabel: formatCostAmount(data.currency, estimated.minor_unit_amount),
    asOf: estimated.as_of ?? null,
    confidence: estimated.confidence,
    timeInputFreshness: estimated.time_input_freshness ?? null,
    tasks: data.tasks.map((task) => ({
      taskId: task.task_id,
      amountLabel: formatCostAmount(data.currency, task.estimated.minor_unit_amount),
      method: task.estimated.method,
      scopeIncluded: task.estimated.scope_included,
      confidence: task.estimated.confidence,
      breakdown: task.estimated.breakdown.map((entry) => ({
        category: entry.category,
        amountLabel: formatCostAmount(data.currency, entry.minor_unit_amount),
        basis: entry.basis,
      })),
    })),
  };
}
