<script>
  import { loadDisclosure, saveDisclosure } from "../../../viewer/assets/card-disclosure-state.js";
  import TaskCard from "./TaskCard.svelte";
  import CardList from "./CardList.svelte";
  import FilterStrip from "./FilterStrip.svelte";
  export let filters = null;
  import ReportPointerCard from "./ReportPointerCard.svelte";

  export let tasks = [];
  export let allIds = [];
  export let cardStorageKey = null;
  export let requestedPin = null;
  export let scopeId = null;
  export let searchQuery = "";
  export let onSearch = null;
  export let reorderable = false;
  export let onReorder = () => {};
  export let progress = {};
  export let editing = false;
  export let policy;
  export let onCommand = () => {};
  export let onAddItem = () => {};
  export let timeTasks = new Map();
  export let itemCapsules = new Map();
  export let onModuleActivate = () => {};
  export let moduleOrder = ["time"];
  export let onModuleReorder = () => {};
  export let moduleTotals = {};
  export let statusOrder = ["done", "planned"];
  export let emptyLabel = "沒有符合目前篩選的工作項目。";
  // Keyed by pointer task id: { status: "loading"|"ready"|"error", card,
  // message, openHref }. A pointer card never takes `editing`, `onCommand` or
  // any other write-capable prop — it has no edit affordances to receive one.
  export let pointerCards = {};
  let defaultExpanded = true;
  let expandedCards = {};
  let appliedPin = null;
  $: disclosureKey = `taskprogress.disclosure:${cardStorageKey ?? location.href}`;
  $: restoreDisclosure(disclosureKey);
  $: expandRequestedPin(requestedPin, disclosureKey);
  function expandRequestedPin(id, key) {
    if (!id || appliedPin === JSON.stringify([key, id])) return;
    appliedPin = JSON.stringify([key, id]);
    expandedCards = { ...expandedCards, [id]: true };
  }
  function restoreDisclosure(key) {
    appliedPin = null;
    const state = loadDisclosure(key);
    defaultExpanded = state.expanded;
    expandedCards = state.overrides;
  }
  function setExpanded(id, value) { expandedCards = { ...expandedCards, [id]: value }; saveDisclosure(disclosureKey, defaultExpanded, expandedCards); }
  function setAllExpanded(value) { defaultExpanded = value; expandedCards = {}; saveDisclosure(disclosureKey, defaultExpanded, expandedCards); }
</script>

  <CardList pinEnabled {requestedPin} expanded={defaultExpanded} onToggleAll={setAllExpanded} items={tasks} {allIds} storageKey={cardStorageKey} let:item={task} let:lead let:visibilityEnabled let:visible let:onVisibleChange>
    <svelte:fragment slot="filters">
      {#if filters}<FilterStrip {...filters} />{/if}
    </svelte:fragment>
    <svelte:fragment slot="tools">
      {#if onSearch}
        <span class="task-search">
          <input
            type="search"
            aria-label="搜尋任務卡名稱、摘要與子項"
            placeholder="搜尋名稱、摘要、子項"
            value={searchQuery}
            oninput={(event) => onSearch(event.currentTarget.value)}
          >
          <svg class="task-search-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6" />
            <path d="M10.4 10.4 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </span>
      {/if}
    </svelte:fragment>
    {#if task.kind === "report_pointer"}
      <ReportPointerCard {visibilityEnabled} {visible} {onVisibleChange} expanded={expandedCards[task.id] ?? defaultExpanded} onToggle={value => setExpanded(task.id, value)} {task} state={pointerCards[task.id] ?? { status: "loading" }} />
    {:else}
      <TaskCard {visibilityEnabled} {visible} {onVisibleChange}
        expanded={expandedCards[task.id] ?? defaultExpanded}
        onToggle={value => setExpanded(task.id, value)}
        {task}
        progress={progress[task.id]}
        {editing}
        {policy}
        {onCommand}
        onAddItem={(title, priority) => onAddItem(task.id, title, priority)}
        timeTask={timeTasks.get(task.id) ?? null}
        {itemCapsules}
        {onModuleActivate}
        {moduleOrder}
        {onModuleReorder}
        {statusOrder}
        moduleTotals={moduleTotals[task.id] ?? []}
        {lead}
        {scopeId}
        {reorderable}
        {onReorder}
      />
    {/if}
  </CardList>
{#if !tasks.length}
  <p class="empty-state">{emptyLabel}</p>
{/if}
