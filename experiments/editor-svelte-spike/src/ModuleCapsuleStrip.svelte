<script>
  import HorizontalCapsuleStrip from "./HorizontalCapsuleStrip.svelte";

  export let capsules = [];
  export let moduleOrder = [];
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
    className="item-module-strip"
    ariaLabel="子項目模組"
    {onActivate}
    {onReorder}
  />
{/if}
