<script>
  import IconChoice from "./IconChoice.svelte";
  import EyeIcon from "./EyeIcon.svelte";
  export let mode = "disabled";
  export let onChoose = () => {};
  const options = [
    { id: "enabled", label: "啟用" },
    { id: "closed", label: "全體關閉" },
    { id: "disabled", label: "禁用" },
    { id: "reset", label: "重置", kind: "action" },
  ];
</script>

<IconChoice items={options} value={mode} label="可見性" orientation="vertical" {onChoose}>
  <svelte:fragment slot="icon" let:item>
    {#if item?.id === "reset"}
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></svg>
    {:else}
      <EyeIcon closed={item?.id === "closed"} disabled={item?.id === "disabled"} />
    {/if}
  </svelte:fragment>
</IconChoice>
