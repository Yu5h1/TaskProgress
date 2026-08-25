<script>
  /*
   * Cost's project-detail panel, v0.1 — read-only, `estimated` category only
   * (Documentation/CostEstimationModulePlan.md). No editing exists for Cost
   * yet, so unlike TimeDialog this is a single self-managing <dialog>, the
   * same shape DeliverySaveConfirmation.svelte already uses for a
   * single-purpose panel.
   *
   * `timeInputFreshness`, when present, is Cost's own bookkeeping about
   * whether its labor figures still match Time's current projection — not
   * Core's stale mechanism (that only checks Cost's own report_revision).
   * If Cost never said, this stays null and nothing is claimed either way.
   */
  export let open = false;
  export let onClose = () => {};
  export let currency = "";
  export let totalLabel = "";
  export let asOf = null;
  export let confidence = "";
  export let timeInputFreshness = null;
  export let tasks = [];

  let dialog;
  let closeButton;

  function attachDialog(node) {
    dialog = node;
    node.showModal();
    closeButton?.focus();
    return {
      destroy() {
        dialog = null;
      },
    };
  }

  function cancel(event) {
    event.preventDefault();
    onClose();
  }

  function keydown(event) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    onClose();
  }

  const FRESHNESS_LABEL = {
    current: "與目前 Time 投影一致",
    stale: "labor 金額依舊版工時估算，尚未重新計算",
    unknown: "Time 輸入版本未知",
  };
</script>

{#if open}
  <dialog
    class="theme-dialog cost-detail-dialog"
    use:attachDialog
    aria-labelledby="cost-detail-title"
    oncancel={cancel}
    onkeydown={keydown}
  >
    <div class="theme-dialog-heading">
      <div>
        <p class="section-kicker">預估成本</p>
        <h2 id="cost-detail-title">{totalLabel}</h2>
      </div>
      <button bind:this={closeButton} type="button" class="theme-close" onclick={onClose} aria-label="關閉預估成本">
        ×
      </button>
    </div>

    <p class="theme-dialog-description">
      幣別 {currency}{#if asOf} ‧ 基準日 {asOf}{/if} ‧ 信心度 {confidence}
    </p>

    {#if timeInputFreshness}
      <p class="theme-dialog-status" class:theme-status-warning={timeInputFreshness !== "current"}>
        {FRESHNESS_LABEL[timeInputFreshness] ?? timeInputFreshness}
      </p>
    {/if}

    <ul class="cost-task-breakdown">
      {#each tasks as task (task.taskId)}
        <li>
          <div class="cost-task-row">
            <span class="cost-task-id">{task.taskId}</span>
            <span class="cost-task-amount">{task.amountLabel}</span>
          </div>
          <p class="cost-task-method">{task.method} ‧ {task.scopeIncluded.join("、")} ‧ 信心度 {task.confidence}</p>
          {#if task.breakdown.length}
            <ul class="cost-breakdown-list">
              {#each task.breakdown as entry}
                <li>{entry.category}：{entry.amountLabel}（{entry.basis}）</li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>

    <div class="theme-dialog-actions">
      <button type="button" onclick={onClose}>關閉</button>
    </div>
  </dialog>
{/if}
