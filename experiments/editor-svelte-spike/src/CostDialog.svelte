<script>
  import AssessmentMetricGrid from "./AssessmentMetricGrid.svelte";
  import AssessmentNote from "./AssessmentNote.svelte";
  import DialogShell from "./DialogShell.svelte";

  /*
   * Cost's detail panel, and the second real case for DialogShell.
   *
   * One dialog serves both subjects — project total and a single item's
   * amount — which is the contract Time's panel already follows. `kind` says
   * which, exactly as it does there, so the two panels can be compared at the
   * same level rather than by accident of which one happened to be built.
   *
   * It is deliberately small. Cost has no tabs, no editor and no draft, so
   * everything this file contains is domain content: the exact figures the
   * capsule had no room for, and what the coverage and balance mean. Every
   * line that is not about money already lives in the shell.
   */
  export let open = false;
  export let kind = "project";
  export let kicker = "";
  export let title = "";
  export let total = null;
  export let item = null;
  export let onClose = () => {};
</script>

<DialogShell
  {open}
  {kicker}
  {title}
  id="cost-dialog"
  dialogClass="cost-dialog"
  titleId="cost-dialog-title"
  closeLabel={`關閉${kicker}`}
  {onClose}
>
  <div class="cost-dialog-content">
    {#if kind === "item" && item}
      <section class="cost-readout">
        <div class="cost-readout-meta">
          <span>估算成本</span>
          {#each item.contributors as contributor (contributor.kind)}
            <span class="assessment-source-badge source-{contributor.kind}">{contributor.label}</span>
          {/each}
        </div>
        <strong>{item.exact}</strong>
      </section>

      <AssessmentMetricGrid metrics={[
        ...(item.confidenceLabel ? [{ label: "信心", value: item.confidenceLabel }] : []),
        { label: "人工確認", value: item.humanConfirmed ? "已確認" : "未確認" },
        { label: "狀態", value: item.done ? "已完成" : "未完成" },
      ]} />

      {#if !item.humanConfirmed}
        <AssessmentNote heading="尚未由人確認">
          <p>
            這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。
          </p>
        </AssessmentNote>
      {/if}
    {:else if total}
      <section class="cost-readout">
        <div class="cost-readout-meta">
          <span>估算總額</span>
          <span class="cost-coverage cost-coverage-{total.coverage}">{total.coverageLabel}</span>
        </div>
        <strong>{total.exact}</strong>
      </section>

      <AssessmentMetricGrid metrics={[
        { label: "未完成成本", value: total.remaining },
        ...(total.available ? [
          { label: "可用資源", value: total.available },
          { label: "餘額", value: total.balance, tone: total.tone },
        ] : []),
      ]} />

      {#if total.coverage !== "full"}
        <AssessmentNote heading="為什麼沒有資源判斷">
          <p>
            尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，
            因此在涵蓋率完整之前不宣稱預算充足與否。
          </p>
        </AssessmentNote>
      {/if}
    {/if}
  </div>
</DialogShell>
