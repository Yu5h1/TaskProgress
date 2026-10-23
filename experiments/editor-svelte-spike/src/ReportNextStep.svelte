<script>
  /*
   * The Report's answer to "what now": the scope's Next item while its marker
   * is effective, otherwise the derived next step, labelled as such. The host
   * resolves which it is (viewer/assets/next-marker.js); this only lays it out
   * on the shared next-step card and links to the card that holds the item.
   */
  import NextStepCard from "./NextStepCard.svelte";

  export let next = null;
</script>

{#if next}
  <a class="report-next-step" class:is-derived={next.derived} href={next.href} title={`開啟卡片：${next.cardTitle}`}>
    <NextStepCard
      heading={next.derived ? "下一步 · 推算" : "Next"}
      title={next.title}
      action={next.cardTitle}
      actionLabel="卡片"
      expect={next.stateLabel ?? ""}
      expectLabel="狀態"
    />
  </a>
{/if}
