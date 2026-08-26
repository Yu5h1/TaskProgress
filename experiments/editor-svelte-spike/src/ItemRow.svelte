<script>
  import ModuleCapsuleStrip from "./ModuleCapsuleStrip.svelte";

  export let taskId;
  export let field;
  export let item;
  export let editing;
  export let policy;
  export let onCommand;
  /*
   * Module capsules arrive already built. This row used to derive Time's
   * capsule itself from a `timeItem` prop, which meant the shared row knew
   * one module by name and a second module could not appear without editing
   * it. The host now collects descriptors from the module registry, exactly
   * as the main-panel strip does.
   */
  export let moduleCapsules = [];
  export let onModuleActivate = () => {};
  export let moduleOrder = ["time"];
  export let onModuleReorder = () => {};

  let priorityValue = policy.normalize(item.priority, policy.fallbackValue);
  // Same five statuses a task card carries. `statuses` is supplied by the
  // host so the two levels cannot drift into different sets.
  export let statuses = [];
  let statusValue = item.status ?? (field === "completed_items" ? "done" : "planned");

  $: metadata = policy.metadata(item.priority);
  $: label = policy.format(item.priority);
  $: priorityValue = policy.normalize(item.priority, policy.fallbackValue);
  // Absent `status` means the array decides, which is what those arrays
  // already meant — so a report written before the field exists reads the
  // same as it always did.
  $: itemStatus = item.status ?? (field === "completed_items" ? "done" : "planned");
  $: statusValue = itemStatus;
  $: statusEntry = statuses.find((entry) => entry.value === itemStatus)
    ?? { label: itemStatus, tone: "muted" };
  $: statusLabel = statusEntry.label;

  // One command: the host relocates the item when the new status requires
  // it, so the row never has to know which array a status belongs in.
  function setStatus(value) {
    if (value === itemStatus) return;
    onCommand({
      type: "set-item-status",
      taskId,
      field,
      itemId: item.id,
      status: value,
    });
  }

  // The row does not know which module a capsule belongs to; the host
  // dispatches by id back to whichever module claims it.
  function activateModule(id) {
    onModuleActivate(id, { taskId, itemId: item.id, itemTitle: item.title });
  }
</script>

<li class="editor-item-row" class:editable-work-item={editing}>
  <span
    class={`item-row-marker item-row-marker-${itemStatus}`}
    aria-hidden="true"
  >{itemStatus === "done" ? "✓" : "○"}</span>

  <!-- A finished item has no priority worth reading: priority ranks what to do
       next, and there is nothing left to schedule here. Preview therefore drops
       the badge, the same way it drops an unset value — see
       `Documentation/AssessmentModuleArchitecturePlan.md` 未設置的值. Edit mode
       still shows the select, because that is the entry point for changing it,
       and because a status set by mistake has to be recoverable. -->
  {#if editing || (itemStatus !== "done" && metadata && (!metadata.hidden || !policy.labelsValid))}
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
          {#each statuses as status (status.value)}
            <option value={status.value}>{status.label}</option>
          {/each}
        </select>
      {:else}
        <span class={`item-status-capsule status-${statusEntry.tone}`}>{statusLabel}</span>
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
