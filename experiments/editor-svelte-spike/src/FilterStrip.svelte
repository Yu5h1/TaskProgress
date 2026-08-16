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
   * decides what is shown, dragging decides the order. 預設 is a select-all
   * switch that matches no status of its own, and it renders wherever the
   * caller's order puts it, because its position marks where explicit ordering
   * stops — capsules to its left are grouped, the rest stay as written.
   */
  import HorizontalCapsuleStrip from "./HorizontalCapsuleStrip.svelte";
  import { DEFAULT_CAPSULE_ID } from "../../../viewer/assets/filter-selection.js";

  export let categories = [];
  export let order = [];
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

  const tagCapsule = (category) => {
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
  };

  $: defaultCapsule = {
    id: DEFAULT_CAPSULE_ID,
    label: defaultLabel,
    className: `filter-button filter-default${reorderable ? " status-sortable" : ""}`,
    sortable: reorderable,
    pressed: defaultLit,
    title: reorderable
      ? "顯示全部；它左邊的標籤決定分組順序，右邊的維持原本的順序"
      : "顯示全部",
    ariaLabel: defaultLit ? `${defaultLabel}，已全選` : `${defaultLabel}，選取全部`,
  };

  $: byId = new Map(categories.map((category) => [category.id, category]));
  // The caller's order is what renders, so 預設 can actually be seen to move.
  $: sequence = order.length > 0
    ? order
    : [DEFAULT_CAPSULE_ID, ...categories.map((category) => category.id)];
  $: capsules = sequence
    .map((id) => (id === DEFAULT_CAPSULE_ID ? defaultCapsule : byId.get(id)))
    .filter(Boolean)
    .map((entry) => (entry === defaultCapsule ? entry : tagCapsule(entry)));

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
