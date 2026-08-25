<script>
  /*
   * The one module capsule strip, for both host levels the architecture plan
   * defines: the main-panel strip at `project-summary` and the sub-item strip
   * at `item-inline`. The two differ only in which capsules the host hands
   * over and how the row is labelled — the layout, ordering, scroll and
   * keyboard behaviour are the same code, so they cannot drift apart.
   *
   * Core owns capsule order: `moduleOrder` ranks known module types, and
   * anything not in it sorts to the end. Modules supply a label, tone and
   * action; none of them reaches the DOM.
   */
  import HorizontalCapsuleStrip from "./HorizontalCapsuleStrip.svelte";

  export let capsules = [];
  export let moduleOrder = [];
  export let className = "item-module-strip";
  export let ariaLabel = "子項目模組";
  export let onActivate = () => {};
  export let onReorder = () => {};

  $: rank = new Map(moduleOrder.map((id, index) => [id, index]));
  $: ordered = [...capsules].sort((left, right) => (
    (rank.get(left.id) ?? moduleOrder.length)
    - (rank.get(right.id) ?? moduleOrder.length)
  ));
</script>

{#if ordered.length}
  <HorizontalCapsuleStrip
    items={ordered}
    {className}
    {ariaLabel}
    {onActivate}
    {onReorder}
  />
{/if}
