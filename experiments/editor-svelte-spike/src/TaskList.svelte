<script>
  import TaskCard from "./TaskCard.svelte";
  import ReportPointerCard from "./ReportPointerCard.svelte";

  export let tasks = [];
  export let progress = {};
  export let editing = false;
  export let policy;
  export let onCommand = () => {};
  export let onAddItem = () => {};
  export let timeTasks = new Map();
  export let timeItems = new Map();
  export let onTimeClick = null;
  export let moduleOrder = ["time"];
  export let onModuleReorder = () => {};
  export let durations = {};
  export let statusOrder = ["done", "planned"];
  export let emptyLabel = "沒有符合目前篩選的工作項目。";
  // Keyed by pointer task id: { status: "loading"|"ready"|"error", card,
  // message, openHref }. A pointer card never takes `editing`, `onCommand` or
  // any other write-capable prop — it has no edit affordances to receive one.
  export let pointerCards = {};
</script>

{#if tasks.length}
  {#each tasks as task (task.id)}
    {#if task.kind === "report_pointer"}
      <ReportPointerCard {task} state={pointerCards[task.id] ?? { status: "loading" }} />
    {:else}
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
        {moduleOrder}
        {onModuleReorder}
        {statusOrder}
        taskDuration={durations[task.id] ?? null}
      />
    {/if}
  {/each}
{:else}
  <p class="empty-state">{emptyLabel}</p>
{/if}
