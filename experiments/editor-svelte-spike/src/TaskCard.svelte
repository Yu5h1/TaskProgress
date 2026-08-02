<script>
  import ItemRow from "./ItemRow.svelte";

  export let task;
  export let progress;
  export let editing;
  export let policy;
  export let onCommand;
  export let onAddItem;
  export let timeTask = null;
  export let timeItems = new Map();

  const statuses = [
    { value: "planned", label: "待處理", tone: "muted" },
    { value: "in_progress", label: "進行中", tone: "active" },
    { value: "done", label: "已完成", tone: "success" },
    { value: "blocked", label: "受阻", tone: "danger" },
    { value: "archive", label: "已封存", tone: "muted" },
  ];

  let adding = false;
  let newTitle = "";
  let newPriority = policy.creationDefaultValue;
  let addError = "";

  $: taskPriority = policy.metadata(task.priority);
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

<article class={`task-card status-${statusEntry.tone}`} aria-labelledby={`task-${task.id}-title`}>
  <header class="task-header">
    <div class="task-title-group">
      {#if editing}
        <input
          id={`task-${task.id}-title`}
          class="task-title-input"
          aria-label="任務標題"
          maxlength="200"
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
    </div>
    <div class="task-header-meta">
      {#if timeTask}
        <span class="spike-task-time">
          {Number(timeTask.total_likely_minutes / 60).toLocaleString(undefined, { maximumFractionDigits: 2 })}h
        </span>
      {/if}
      <span class="task-fraction">{progress.completed}/{progress.total}</span>
    </div>
  </header>

  <div class="spike-task-state">
    {#if editing}
      <select
        class="inline-status-select"
        aria-label="任務狀態"
        value={task.status}
        onchange={(event) => onCommand({
          type: "set-task-field",
          taskId: task.id,
          field: "status",
          value: event.currentTarget.value,
        })}
      >
        {#each statuses as status (status.value)}
          <option value={status.value}>{status.label}</option>
        {/each}
      </select>
      <select
        class="inline-priority-select"
        aria-label="任務優先級"
        value={task.priority}
        onchange={(event) => onCommand({
          type: "set-task-field",
          taskId: task.id,
          field: "priority",
          value: Number(event.currentTarget.value),
        })}
      >
        {#each policy.levels as level (level.value)}
          <option value={level.value}>{policy.format(level.value)}</option>
        {/each}
      </select>
    {:else}
      <span class={`status-badge status-${statusEntry.tone}`}>{statusEntry.label}</span>
      {#if taskPriority && (!taskPriority.hidden || !policy.labelsValid)}
        <span class={`priority-badge task-priority-badge priority-${taskPriority.tone}`}>
          {policy.format(task.priority)}
        </span>
      {/if}
    {/if}
  </div>

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

  <div class="work-columns">
    <section>
      <h4 class="spike-list-heading">已完成</h4>
      <ul class="detail-list">
        {#each task.completed_items as item (item.id)}
          <ItemRow
            taskId={task.id}
            field="completed_items"
            {item}
            {editing}
            {policy}
            {onCommand}
            timeItem={timeItems.get(item.id) ?? null}
          />
        {/each}
      </ul>
    </section>
    <section>
      <h4 class="spike-list-heading">待處理</h4>
      <ul class="detail-list">
        {#each task.pending_items as item (item.id)}
          <ItemRow
            taskId={task.id}
            field="pending_items"
            {item}
            {editing}
            {policy}
            {onCommand}
            timeItem={timeItems.get(item.id) ?? null}
          />
        {/each}
      </ul>
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
