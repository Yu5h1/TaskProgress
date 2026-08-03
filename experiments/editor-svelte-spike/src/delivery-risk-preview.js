const RISK_LABELS = Object.freeze({
  complete: "工作已完成",
  on_track: "交付可行",
  at_risk: "交付有風險",
  critical: "交付不可行",
});

function finiteNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function deadlineSummary(analysis, missingLabel) {
  const deadline = analysis?.summary?.deadline;
  if (!deadline || typeof deadline !== "object") {
    return Object.freeze({
      available: false,
      label: missingLabel,
      urgency: null,
      remainingCapacityMinutes: null,
      capacityBalanceMinutes: null,
    });
  }
  return Object.freeze({
    available: true,
    label: RISK_LABELS[deadline.urgency] ?? "期限狀態未知",
    urgency: deadline.urgency ?? null,
    remainingCapacityMinutes: finiteNumber(deadline.remaining_capacity_minutes),
    capacityBalanceMinutes: finiteNumber(deadline.capacity_balance_minutes),
  });
}

export function buildDeliveryRiskPreview(
  currentAnalysis,
  previewAnalysis,
  deliveryChange,
) {
  if (!deliveryChange?.before || !deliveryChange?.after) {
    throw new TypeError("交付日風險預覽需要同一份 delivery draft。 ");
  }
  const current = deadlineSummary(currentAnalysis, "尚無期限分析");
  const next = deadlineSummary(
    previewAnalysis,
    deliveryChange.after.present ? "無法建立期限分析" : "期限分析將停用",
  );
  const capacityDelta = current.remainingCapacityMinutes != null
    && next.remainingCapacityMinutes != null
    ? next.remainingCapacityMinutes - current.remainingCapacityMinutes
    : null;
  const balanceDelta = current.capacityBalanceMinutes != null
    && next.capacityBalanceMinutes != null
    ? next.capacityBalanceMinutes - current.capacityBalanceMinutes
    : null;

  return Object.freeze({
    before: Object.freeze({ ...deliveryChange.before }),
    after: Object.freeze({ ...deliveryChange.after }),
    reason: deliveryChange.reason,
    actor: deliveryChange.actor,
    current,
    next,
    capacityDelta,
    balanceDelta,
  });
}
