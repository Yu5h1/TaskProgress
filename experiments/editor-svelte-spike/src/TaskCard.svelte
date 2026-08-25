<script>
  import DeveloperDetails from "./DeveloperDetails.svelte";
  import ItemRow from "./ItemRow.svelte";

  export let task;
  export let progress;
  export let editing;
  export let policy;
  export let onCommand;
  export let onAddItem;
  export let timeTask = null;
  // Capsule descriptors per stable item id, built by the host from the
  // module registry. This card only routes them to the right row.
  export let itemCapsules = new Map();
  export let onModuleActivate = () => {};
  export let moduleOrder = ["time"];
  export let onModuleReorder = () => {};
  // The Viewer lets the reader reorder status groups; the completed/pending
  // panels follow that order, so it has to reach the card.
  export let statusOrder = ["done", "planned"];
  export let taskDuration = null;

  const statuses = [
    { value: "planned", label: "待處理", tone: "neutral" },
    { value: "in_progress", label: "進行中", tone: "active" },
    { value: "blocked", label: "受阻", tone: "danger" },
    { value: "done", label: "已完成", tone: "success" },
    { value: "archive", label: "已封存", tone: "muted" },
  ];

  $: workGroups = [
    {
      status: "done",
      title: "已完成",
      className: "completed-work",
      field: "completed_items",
      items: task.completed_items ?? [],
    },
    {
      status: "planned",
      title: "待處理",
      className: "pending-work",
      field: "pending_items",
      items: task.pending_items ?? [],
    },
  ];
  $: orderedGroups = [...workGroups].sort((left, right) => {
    const leftIndex = statusOrder.indexOf(left.status);
    const rightIndex = statusOrder.indexOf(right.status);
    return (leftIndex < 0 ? statusOrder.length : leftIndex)
      - (rightIndex < 0 ? statusOrder.length : rightIndex);
  });

  let adding = false;
  let newTitle = "";
  let newPriority = policy.creationDefaultValue;
  let addError = "";
  let taskStatusValue = task.status;
  let taskPriorityValue = policy.normalize(task.priority, policy.fallbackValue);

  $: taskPriority = policy.metadata(task.priority);
  $: taskStatusValue = task.status;
  $: taskPriorityValue = policy.normalize(task.priority, policy.fallbackValue);
  $: statusEntry = statuses.find((entry) => entry.value === task.status)
    ?? { label: task.status, tone: "muted" };
  $: if (!editing && adding) closeAdd();

  function closeAdd() {
    adding = false;
    newTitle = "";
    newPriority = policy.creationDefaultValue;
    addError = "";
  }

  function submitAdd() {
    const result = onAddItem(newTitle, Number(newPriority));
    addError = result.error;
    if (!addError) closeAdd();
  }
</script>

<article class={`task-card editor-task-card status-${statusEntry.tone}`} aria-labelledby={`task-${task.id}-title`}>
  <header class="task-header">
    <div class="task-title-group">
      <div class="time-task-status-line">
        <span class={`status-badge status-${statusEntry.tone}`}>{statusEntry.label}</span>
        {#if editing}
          <select
            class="inline-status-select"
            aria-label={`${task.title} 狀態`}
            bind:value={taskStatusValue}
            onchange={() => onCommand({
              type: "set-task-field",
              taskId: task.id,
              field: "status",
              value: taskStatusValue,
            })}
          >
            {#each statuses as status (status.value)}
              <option value={status.value}>{status.label}</option>
            {/each}
          </select>
          <select
            class="inline-priority-select"
            aria-label={`${task.title} 優先級`}
            bind:value={taskPriorityValue}
            onchange={() => onCommand({
              type: "set-task-field",
              taskId: task.id,
              field: "priority",
              value: Number(taskPriorityValue),
            })}
          >
            {#each policy.levels as level (level.value)}
              <option value={level.value}>{policy.format(level.value)}</option>
            {/each}
          </select>
        {:else if taskPriority && (!taskPriority.hidden || !policy.labelsValid)}
          <span
            class={`task-priority-badge priority-badge priority-${taskPriority.tone}`}
            title={`${policy.format(task.priority)}；同一狀態內依優先級排序`}
            aria-label={`優先級：${policy.format(task.priority)}`}
          >{policy.format(task.priority)}</span>
        {/if}
      </div>
      <div class="time-task-title-line">
        {#if editing}
          <input
            id={`task-${task.id}-title`}
            class="task-title-input"
            aria-label="任務名稱"
            maxlength="160"
            value={task.title}
            oninput={(event) => onCommand({
              type: "set-task-field",
              taskId: task.id,
              field: "title",
              value: event.currentTarget.value,
            })}
          >
        {:else}
          <h3 id={`task-${task.id}-title`}>{task.title}</h3>
        {/if}
        <span class="task-duration" hidden={!taskDuration}>
          {taskDuration ? `約需 ${taskDuration}` : ""}
        </span>
      </div>
    </div>
    <div class="task-header-meta">
      <strong
        class="task-fraction"
        aria-label={`子項目完成 ${progress.completed}，共 ${progress.total}`}
      >{progress.completed} / {progress.total}</strong>
      <code class="task-id">{task.id}</code>
    </div>
  </header>

  {#if editing}
    <textarea
      class="task-summary-input"
      aria-label="任務描述"
      maxlength="1000"
      rows="3"
      value={task.summary}
      oninput={(event) => onCommand({
        type: "set-task-field",
        taskId: task.id,
        field: "summary",
        value: event.currentTarget.value,
      })}
    ></textarea>
  {:else}
    <p class="task-summary">{task.summary}</p>
  {/if}

  <DeveloperDetails developer={task.developer ?? null} />

  <div class="work-columns">
    {#each orderedGroups as group (group.status)}
      {#if group.items.length || editing}
        <section class={`detail-section ${group.className}`}>
          <h4 class="detail-heading">{group.title}</h4>
          <ul class="detail-list">
            {#each group.items as item (item.id)}
              <ItemRow
                taskId={task.id}
                field={group.field}
                {item}
                {editing}
                {policy}
                {onCommand}
                moduleCapsules={itemCapsules.get(item.id) ?? []}
                {onModuleActivate}
                {moduleOrder}
                {onModuleReorder}
              />
            {/each}
          </ul>
        </section>
      {/if}
    {/each}
    <section class="task-adder-section">
      {#if editing}
        <div class="spike-add-shell">
          {#if adding}
            <div class="spike-add-form">
              <input
                aria-label="新增子項目描述"
                placeholder="新增待處理項目"
                maxlength="500"
                bind:value={newTitle}
                onkeydown={(event) => {
                  if (event.key === "Enter") submitAdd();
                  if (event.key === "Escape") closeAdd();
                }}
              >
              <select aria-label="新增子項目優先級" bind:value={newPriority}>
                {#each policy.levels as level (level.value)}
                  <option value={level.value}>{policy.format(level.value)}</option>
                {/each}
              </select>
              <button type="button" onclick={submitAdd}>新增</button>
              <button type="button" onclick={closeAdd}>取消</button>
              <p class="spike-field-error" role="alert" hidden={!addError}>{addError}</p>
            </div>
          {:else}
            <button
              class="spike-add-button"
              type="button"
              aria-label={`在「${task.title}」新增子項目`}
              onclick={() => { adding = true; }}
            >＋</button>
          {/if}
        </div>
      {/if}
    </section>
  </div>
</article>
