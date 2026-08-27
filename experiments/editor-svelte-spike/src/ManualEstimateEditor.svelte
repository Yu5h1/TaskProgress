<script>
  export let item;
  export let activeEstimate = null;
  export let onApply = () => ({ error: "" });

  let estimateHours = String((activeEstimate?.likely_minutes ?? item.likelyMinutes) / 60);
  let estimateNote = activeEstimate?.human_note ?? "";
  let estimateConfirmed = Boolean(activeEstimate?.human_confirmed ?? item.humanConfirmed);
  let estimateError = "";

  function applyManualEstimate() {
    const hours = Number(estimateHours);
    if (!Number.isFinite(hours) || hours <= 0) {
      estimateError = "工時必須大於 0。";
      return;
    }
    const result = onApply({
      taskId: item.taskId,
      itemId: item.itemId,
      likelyMinutes: Math.round(hours * 60),
      humanNote: estimateNote,
      humanConfirmed: estimateConfirmed,
    });
    estimateError = result?.error ?? "";
  }
</script>

<form class="spike-estimate-form" onsubmit={(event) => { event.preventDefault(); applyManualEstimate(); }}>
  <section class="time-estimate-readout">
    <div class="time-estimate-meta">
      <span>預估工時</span>
      {#each item.sourceBadges as badge (badge.kind)}
        <span class="assessment-source-badge source-{badge.kind}">{badge.label}</span>
      {/each}
    </div>
    <label class="spike-estimate-hours">
      <span>人工工時（hr）</span>
      <input
        type="number"
        min="0.02"
        step="0.25"
        aria-label={`「${item.title}」人工工時（hr）`}
        bind:value={estimateHours}
      >
    </label>
  </section>

  <section class="time-explanation-card time-item-rationale">
    <h3>估算依據</h3>
    <label class="spike-estimate-note">
      <span>人工依據</span>
      <input
        maxlength="1000"
        aria-label={`「${item.title}」人工依據`}
        bind:value={estimateNote}
        placeholder="例如：已拆解三個步驟"
      >
    </label>
  </section>

  <label class="spike-estimate-confirmation">
    <input
      type="checkbox"
      aria-label={`確認「${item.title}」的人工估算`}
      bind:checked={estimateConfirmed}
    >
    <span>人工確認此工時</span>
  </label>
  <p class="spike-estimate-contract">
    未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。
  </p>
  <div class="spike-estimate-actions">
    <button type="submit" aria-label={`套用「${item.title}」人工估算草稿`}>套用工時草稿</button>
  </div>
  {#if estimateError}<p class="spike-field-error" role="alert">{estimateError}</p>{/if}
</form>
