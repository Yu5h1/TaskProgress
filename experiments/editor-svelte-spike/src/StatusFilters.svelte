<script>
  import HorizontalCapsuleStrip from "./HorizontalCapsuleStrip.svelte";

  export let counts = {};
  export let statusOrder = [];
  export let activeFilter = "all";
  export let statusLabels = {};
  export let onFilterChange = () => {};
  export let onReorder = () => {};

  $: visible = ["all", ...statusOrder]
    .filter((filter) => filter === "all" || (counts[filter] ?? 0) > 0);
  $: capsules = visible.map((filter, index) => {
    const label = filter === "all" ? "全部" : statusLabels[filter] ?? filter;
    const count = counts[filter] ?? 0;
    const sortable = filter !== "all";
    return {
      id: filter,
      label: `${label} ${count}`,
      className: `filter-button ${sortable ? "status-sortable" : ""}`,
      sortable,
      pressed: filter === activeFilter,
      title: !sortable
        ? null
        : filter === "planned"
          ? "點擊顯示待規劃或仍有待處理子項目的任務；拖曳可調整排序"
          : "拖曳調整卡片排序；Alt＋左右方向鍵也可移動",
      ariaLabel: sortable
        ? `${label} ${count}，排序第 ${index}；可拖曳調整`
        : `${label} ${count}`,
    };
  });
</script>

<HorizontalCapsuleStrip
  items={capsules}
  className="status-filter-strip"
  ariaLabel="工作狀態篩選與排序"
  onActivate={onFilterChange}
  {onReorder}
/>
