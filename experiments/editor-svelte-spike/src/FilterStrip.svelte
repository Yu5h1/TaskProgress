<script>
  /*
   * Shared filter strip: capsules a reader selects between, over the one
   * pointer, touch and keyboard implementation in `HorizontalCapsuleStrip`.
   *
   * It defines no categories. What a category means, how many there are, and
   * what order they sit in all come from the calling screen — the task-progress
   * screen filters by task status, the Checklist by check status and by owner,
   * and this component cannot tell the difference.
   *
   * Reordering is opt-in per screen. Where the reader's own order is the
   * meaning, a screen turns it on and persists it; where a document defines the
   * order, a screen leaves it off and the strip stays selection-only.
   */
  import HorizontalCapsuleStrip from "./HorizontalCapsuleStrip.svelte";

  export let categories = [];
  export let activeId = null;
  export let activeIds = null;
  export let ariaLabel = "篩選";
  export let className = "";
  export let reorderable = false;
  export let onSelect = () => {};
  export let onReorder = () => {};

  const withCount = (category) =>
    category.count === undefined || category.count === null
      ? category.label
      : `${category.label} ${category.count}`;

  // One strip can carry independent groups, so selection is a set rather than a
  // single id. `activeId` stays for the common one-group case.
  $: selected = new Set(activeIds ?? (activeId === null ? [] : [activeId]));

  $: capsules = categories.map((category) => {
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
  });
</script>

<HorizontalCapsuleStrip
  items={capsules}
  {className}
  {ariaLabel}
  onActivate={onSelect}
  {onReorder}
/>
