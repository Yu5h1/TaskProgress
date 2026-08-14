<script>
  import ModuleCapsuleStrip from "./ModuleCapsuleStrip.svelte";

  export let taskId;
  export let field;
  export let item;
  export let editing;
  export let policy;
  export let onCommand;
  export let timeItem = null;
  export let onTimeClick = null;
  export let moduleOrder = ["time"];
  export let onModuleReorder = () => {};

  let priorityValue = policy.normalize(item.priority, policy.fallbackValue);
  let statusValue = field === "completed_items" ? "completed" : "pending";

  $: metadata = policy.metadata(item.priority);
  $: label = policy.format(item.priority);
  $: priorityValue = policy.normalize(item.priority, policy.fallbackValue);
  $: timeLabel = timeItem
    ? timeItem.label
      ?? `${Number(timeItem.display_hours).toLocaleString(undefined, { maximumFractionDigits: 2 })} hr`
    : "";
  $: itemStatus = field === "completed_items" ? "completed" : "pending";
  $: statusValue = itemStatus;
  $: statusLabel = itemStatus === "completed" ? "已完成" : "待處理";
  $: moduleCapsules = timeItem ? [{
    id: "time",
    label: timeLabel,
    className: "time-item-button",
    sortable: true,
    ariaLabel: onTimeClick
      ? `${item.title}，${timeLabel}，查看估算依據`
      : `${item.title}，目前分析 ${timeLabel}`,
    title: `目前分析：${timeItem.likely_minutes} 分鐘；可拖曳調整模組順序`,
  }] : [];

  function setStatus(value) {
    const toField = value === "completed" ? "completed_items" : "pending_items";
    if (toField === field) return;
    onCommand({
      type: "move-item",
      taskId,
      itemId: item.id,
      fromField: field,
      toField,
    });
  }

  function activateModule(id) {
    if (id === "time" && onTimeClick) onTimeClick(item.id, item.title, taskId);
  }
</script>

<li class="editor-item-row" class:editable-work-item={editing}>
  <span
    class={`item-row-marker item-row-marker-${itemStatus}`}
    aria-hidden="true"
  >{itemStatus === "completed" ? "✓" : "○"}</span>

  {#if editing || (metadata && (!metadata.hidden || !policy.labelsValid))}
    <span class="item-row-priority">
      {#if editing}
      <select
        class="inline-priority-select"
        aria-label={`設定「${item.title}」的優先級`}
        bind:value={priorityValue}
        onchange={() => onCommand({
          type: "set-item-field",
          taskId,
          field,
          itemId: item.id,
          property: "priority",
          value: Number(priorityValue),
        })}
      >
        {#each policy.levels as level (level.value)}
          <option value={level.value}>{policy.format(level.value)}</option>
        {/each}
      </select>
      {:else}
        <span class={`priority-badge priority-${metadata.tone}`}>{label}</span>
      {/if}
    </span>
  {/if}

  <span class="item-row-description">
    {#if editing}
      <input
        class="inline-edit-input"
        aria-label={`編輯子項目：${item.title}`}
        title={item.title}
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
    {:else}
      <span class="spike-item-title" title={item.title}>{item.title}</span>
    {/if}
  </span>

  <span class="item-row-utility-panel">
    <span class="item-row-modules">
      <ModuleCapsuleStrip
        capsules={moduleCapsules}
        {moduleOrder}
        onActivate={activateModule}
        onReorder={onModuleReorder}
      />
    </span>

    <span class="item-row-status">
      {#if editing}
        <select
          class="inline-status-select"
          aria-label={`設定「${item.title}」的狀態`}
          bind:value={statusValue}
          onchange={() => setStatus(statusValue)}
        >
          <option value="pending">待處理</option>
          <option value="completed">已完成</option>
        </select>
      {:else}
        <span class={`item-status-capsule item-status-${itemStatus}`}>{statusLabel}</span>
      {/if}
    </span>

    {#if editing}
      <span class="item-row-action">
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
      </span>
    {/if}
  </span>
</li>
