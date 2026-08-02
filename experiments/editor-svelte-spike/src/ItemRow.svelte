<script>
  export let taskId;
  export let field;
  export let item;
  export let editing;
  export let policy;
  export let onCommand;
  export let timeItem = null;

  $: metadata = policy.metadata(item.priority);
  $: label = policy.format(item.priority);
  $: timeLabel = timeItem
    ? `${Number(timeItem.display_hours).toLocaleString(undefined, { maximumFractionDigits: 2 })}h`
    : "";
</script>

<li class:editable-work-item={editing}>
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
    {#if timeItem}
      <span
        class="spike-time-capsule"
        title={`目前分析：${timeItem.likely_minutes} 分鐘`}
      >{timeLabel}</span>
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
    {#if timeItem}
      <span
        class="spike-time-capsule"
        title={`目前分析：${timeItem.likely_minutes} 分鐘`}
      >{timeLabel}</span>
    {/if}
  {/if}
</li>
