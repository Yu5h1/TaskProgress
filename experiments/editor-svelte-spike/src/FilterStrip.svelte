<script>
  /*
   * Shared filter strip: capsules a reader selects between, over the one
   * pointer, touch and keyboard implementation in `HorizontalCapsuleStrip`.
   *
   * It defines no categories. What a category means, how many there are, and
   * what order they sit in all come from the calling screen, so the two screens
   * can describe different things without either being locked to the other.
   *
   * Two gestures, two jobs, and keeping them apart is the whole point: clicking
   * decides what is shown, dragging decides the order. The leading 預設 capsule
   * is a select-all switch that matches no status of its own; where it sits also
   * chooses the ordering mode, which the caller reads from the capsule order.
   */
  import HorizontalCapsuleStrip from "./HorizontalCapsuleStrip.svelte";
  import { DEFAULT_CAPSULE_ID } from "../../../viewer/assets/filter-selection.js";

  export let categories = [];
  export let selected = new Set();
  export let defaultLit = false;
  export let defaultLabel = "預設";
  export let ariaLabel = "篩選";
  export let className = "";
  export let reorderable = false;
  export let onSelect = () => {};
  export let onSelectDefault = () => {};
  export let onReorder = () => {};

  const withCount = (category) =>
    category.count === undefined || category.count === null
      ? category.label
      : `${category.label} ${category.count}`;

  $: capsules = [
    {
      id: DEFAULT_CAPSULE_ID,
      label: defaultLabel,
      className: `filter-button filter-default${reorderable ? " status-sortable" : ""}`,
      sortable: reorderable,
      pressed: defaultLit,
      title: reorderable
        ? "顯示全部；放在第一顆時依資料原本的順序排列，拖曳到後面則依膠囊順序分組"
        : "顯示全部",
      ariaLabel: defaultLit ? `${defaultLabel}，已全選` : `${defaultLabel}，選取全部`,
    },
    ...categories.map((category) => {
      const sortable = reorderable && category.sortable !== false;
      return {
        id: category.id,
        label: withCount(category),
        className: `filter-button${sortable ? " status-sortable" : ""}`,
        sortable,
        pressed: selected.has(category.id),
        title: category.title ?? null,
        ariaLabel: category.ariaLabel ?? withCount(category),
      };
    }),
  ];

  function activate(id) {
    if (id === DEFAULT_CAPSULE_ID) onSelectDefault();
    else onSelect(id);
  }
</script>

<HorizontalCapsuleStrip
  items={capsules}
  {className}
  {ariaLabel}
  onActivate={activate}
  {onReorder}
/>
