<script>
  export let taskId;
  export let field;
  export let item;
  export let editing;
  export let policy;
  export let onCommand;
  export let timeItem = null;
  export let activeEstimate = null;
  export let onManualEstimate = null;
  // When a host can open the time dialog it passes the action, not a node, so
  // the capsule stays part of this component and remains replaceable.
  export let onTimeClick = null;

  let estimateHours = activeEstimate
    ? String(activeEstimate.likely_minutes / 60)
    : timeItem
      ? String(timeItem.likely_minutes / 60)
      : "";
  let estimateNote = activeEstimate?.human_note ?? "";
  let estimateConfirmed = Boolean(activeEstimate?.human_confirmed);
  let estimateError = "";

  $: metadata = policy.metadata(item.priority);
  $: label = policy.format(item.priority);
  // `label` is what a host-side analysis already formatted; `display_hours` is
  // the spike fixture shape. One capsule, either source.
  $: timeLabel = timeItem
    ? timeItem.label
      ?? `${Number(timeItem.display_hours).toLocaleString(undefined, { maximumFractionDigits: 2 })} hr`
    : "";

  function applyManualEstimate() {
    const hours = Number(estimateHours);
    if (!Number.isFinite(hours) || hours <= 0) {
      estimateError = "工時必須大於 0。";
      return;
    }
    const result = onManualEstimate?.({
      taskId,
      itemId: item.id,
      likelyMinutes: Math.round(hours * 60),
      humanNote: estimateNote,
      humanConfirmed: estimateConfirmed,
    });
    estimateError = result?.error ?? "";
  }
</script>

<li class="editor-item-row" class:editable-work-item={editing} class:has-estimate-editor={editing && onManualEstimate}>
  {#if editing}
    <input
      class="inline-edit-input"
      aria-label={`編輯子項目：${item.title}`}
      maxlength="500"
      value={item.title}
      oninput={(event) => onCommand({
        type: "set-item-field",
        taskId,
        field,
        itemId: item.id,
        property: "title",
        value: event.currentTarget.value,
      })}
    >
    <select
      class="inline-priority-select"
      aria-label={`設定「${item.title}」的優先級`}
      value={item.priority}
      onchange={(event) => onCommand({
        type: "set-item-field",
        taskId,
        field,
        itemId: item.id,
        property: "priority",
        value: Number(event.currentTarget.value),
      })}
    >
      {#each policy.levels as level (level.value)}
        <option value={level.value}>{policy.format(level.value)}</option>
      {/each}
    </select>
    {#if timeItem && onTimeClick}
      <button
        class="time-item-button"
        type="button"
        aria-label={`${item.title}，${timeLabel}，查看估算依據`}
        onclick={() => onTimeClick(item.id, item.title)}
      >{timeLabel}</button>
    {:else if timeItem}
      <span class="time-item-button" title={`目前分析：${timeItem.likely_minutes} 分鐘`}>{timeLabel}</span>
    {/if}
    <button
      class="inline-delete-button"
      type="button"
      aria-label={`刪除子項目：${item.title}`}
      onclick={() => onCommand({
        type: "delete-item",
        taskId,
        field,
        itemId: item.id,
      })}
    >刪除</button>
    {#if onManualEstimate}
      <details class="spike-estimate-editor">
        <summary>
          <span>人工工時與依據</span>
          <small>{estimateConfirmed ? "已確認" : "未確認"}</small>
        </summary>
        <div class="spike-estimate-fields">
          <label>
            <span>工時（hr）</span>
            <input
              type="number"
              min="0.02"
              step="0.25"
              aria-label={`「${item.title}」人工工時（hr）`}
              bind:value={estimateHours}
            >
          </label>
          <label class="spike-estimate-note">
            <span>人工依據</span>
            <input
              maxlength="1000"
              aria-label={`「${item.title}」人工依據`}
              bind:value={estimateNote}
              placeholder="例如：已拆解三個步驟"
            >
          </label>
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
          <button
            type="button"
            aria-label={`套用「${item.title}」人工估算草稿`}
            onclick={applyManualEstimate}
          >套用工時草稿</button>
          {#if estimateError}<p class="spike-field-error" role="alert">{estimateError}</p>{/if}
        </div>
      </details>
    {/if}
  {:else}
    <span class="spike-item-title">{item.title}</span>
    {#if metadata && (!metadata.hidden || !policy.labelsValid)}
      <span class={`priority-badge priority-${metadata.tone}`}>{label}</span>
    {/if}
    {#if timeItem && onTimeClick}
      <button
        class="time-item-button"
        type="button"
        aria-label={`${item.title}，${timeLabel}，查看估算依據`}
        onclick={() => onTimeClick(item.id, item.title)}
      >{timeLabel}</button>
    {:else if timeItem}
      <span class="time-item-button" title={`目前分析：${timeItem.likely_minutes} 分鐘`}>{timeLabel}</span>
    {/if}
  {/if}
</li>
