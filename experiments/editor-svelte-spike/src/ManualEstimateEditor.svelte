<script>
  import AssessmentNote from "./AssessmentNote.svelte";

  export let item;
  export let activeEstimate = null;
  export let onApply = () => ({ error: "" });

  /*
   * An unset item starts empty rather than pre-filled. The analyzer
   * substitutes a default into `likely_minutes` for items nobody estimated,
   * and offering that as the starting value would hand the reader a number
   * they never chose and invite them to confirm it — which is how a default
   * becomes an "estimate" without anyone deciding anything.
   */
  let estimateHours = activeEstimate?.likely_minutes
    ? String(activeEstimate.likely_minutes / 60)
    : (item.unset ? "" : String(item.likelyMinutes / 60));
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
  <section class="spike-estimate-row">
    <div class="spike-estimate-badges">
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

  <div class="time-item-rationale">
    <AssessmentNote heading="估算依據">
    <label class="spike-estimate-note">
      <span>人工依據</span>
      <input
        maxlength="1000"
        aria-label={`「${item.title}」人工依據`}
        bind:value={estimateNote}
        placeholder="例如：已拆解三個步驟"
      >
    </label>
    </AssessmentNote>
  </div>

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
