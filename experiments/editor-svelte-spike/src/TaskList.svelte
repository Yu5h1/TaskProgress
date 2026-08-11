<script>
  import TaskCard from "./TaskCard.svelte";

  export let tasks = [];
  export let progress = {};
  export let editing = false;
  export let policy;
  export let onCommand = () => {};
  export let onAddItem = () => {};
  export let timeTasks = new Map();
  export let timeItems = new Map();
  export let onTimeClick = null;
  export let durations = {};
  export let statusOrder = ["done", "planned"];
  export let emptyLabel = "沒有符合目前篩選的工作項目。";
</script>

{#if tasks.length}
  {#each tasks as task (task.id)}
    <TaskCard
      {task}
      progress={progress[task.id]}
      {editing}
      {policy}
      {onCommand}
      onAddItem={(title, priority) => onAddItem(task.id, title, priority)}
      timeTask={timeTasks.get(task.id) ?? null}
      {timeItems}
      {onTimeClick}
      {statusOrder}
      taskDuration={durations[task.id] ?? null}
    />
  {/each}
{:else}
  <p class="empty-state">{emptyLabel}</p>
{/if}
