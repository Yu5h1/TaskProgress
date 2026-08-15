<script>
  /*
   * Filtering for the task-progress screen, in one strip carrying two groups.
   *
   * They are two axes because a task's status and its items' statuses do not
   * follow each other: an in-progress task holds both finished and unfinished
   * items. Selecting in one group leaves the other alone.
   *
   * Dragging reorders the task-status capsules, and that order groups the cards
   * — that is ordering, not filtering. Selecting a capsule only hides.
   */
  import FilterStrip from "./FilterStrip.svelte";

  export let counts = {};
  export let statusOrder = [];
  export let activeFilter = "all";
  export let statusLabels = {};
  export let itemCounts = {};
  export let activeItemFilter = null;
  export let onFilterChange = () => {};
  export let onItemFilterChange = () => {};
  export let onReorder = () => {};

  const ITEM_FILTERS = [
    { id: "pending", label: "未完成子項" },
    { id: "completed", label: "已完成子項" },
  ];

  $: visible = ["all", ...statusOrder]
    .filter((filter) => filter === "all" || (counts[filter] ?? 0) > 0);
  $: taskCategories = visible.map((filter, index) => {
    const label = filter === "all" ? "全部" : statusLabels[filter] ?? filter;
    const count = counts[filter] ?? 0;
    const sortable = filter !== "all";
    return {
      id: filter,
      label,
      count,
      sortable,
      title: !sortable ? null : "拖曳調整卡片排序；Alt＋左右方向鍵也可移動",
      ariaLabel: sortable
        ? `${label} ${count}，排序第 ${index}；可拖曳調整`
        : `${label} ${count}`,
    };
  });
  // Item capsules filter only, so they never join the drag order.
  $: itemCategories = ITEM_FILTERS
    .filter((entry) => (itemCounts[entry.id] ?? 0) > 0)
    .map((entry) => ({
      id: entry.id,
      label: entry.label,
      count: itemCounts[entry.id] ?? 0,
      sortable: false,
      title: "只顯示這一類子項；卡片順序不受影響",
    }));
</script>

<FilterStrip
  categories={taskCategories}
  activeId={activeFilter}
  className="status-filter-strip"
  ariaLabel="工作狀態篩選與排序"
  reorderable={true}
  onSelect={onFilterChange}
  {onReorder}
/>
{#if itemCategories.length}
  <FilterStrip
    categories={itemCategories}
    activeIds={activeItemFilter ? [activeItemFilter] : []}
    className="status-filter-strip item-filter-strip"
    ariaLabel="子項狀態篩選"
    onSelect={onItemFilterChange}
  />
{/if}
