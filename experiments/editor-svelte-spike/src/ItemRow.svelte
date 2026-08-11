<script>
  export let taskId;
  export let field;
  export let item;
  export let editing;
  export let policy;
  export let onCommand;
  export let timeItem = null;
  // When a host can open the time dialog it passes the action, not a node, so
  // the capsule stays part of this component and remains replaceable.
  export let onTimeClick = null;

  $: metadata = policy.metadata(item.priority);
  $: label = policy.format(item.priority);
  // `label` is what a host-side analysis already formatted; `display_hours` is
  // the spike fixture shape. One capsule, either source.
  $: timeLabel = timeItem
    ? timeItem.label
      ?? `${Number(timeItem.display_hours).toLocaleString(undefined, { maximumFractionDigits: 2 })} hr`
    : "";

</script>

<li class="editor-item-row" class:editable-work-item={editing}>
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
        onclick={() => onTimeClick(item.id, item.title, taskId)}
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
        onclick={() => onTimeClick(item.id, item.title, taskId)}
      >{timeLabel}</button>
    {:else if timeItem}
      <span class="time-item-button" title={`目前分析：${timeItem.likely_minutes} 分鐘`}>{timeLabel}</span>
    {/if}
  {/if}
</li>
