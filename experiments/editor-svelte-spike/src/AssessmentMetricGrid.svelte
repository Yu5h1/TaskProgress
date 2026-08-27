<script>
  /*
   * The label/value grid every assessment panel uses to show its supporting
   * figures.
   *
   * Extracted once Time and Cost both had one, not before: the shape below is
   * what the two of them actually needed, rather than what a single case made
   * look general. Time reaches it from four places (item technical detail,
   * engineering, capacity, estimate-only); Cost from one.
   *
   * `tone` is here because both domains mark a figure as carrying risk — Time
   * on its deadline urgency, Cost on its budget balance. The component renders
   * the dot; it never decides which tone a number deserves, because that
   * judgement belongs to the module that owns the units.
   */
  export let metrics = [];
</script>

<div class="assessment-metric-grid">
  {#each metrics as metric (metric.label)}
    <div class="assessment-metric">
      <span>{metric.label}</span>
      <strong>
        {#if metric.tone}
          <span class="assessment-tone-dot assessment-tone-{metric.tone}" aria-hidden="true"></span>
        {/if}
        {metric.value}
      </strong>
    </div>
  {/each}
</div>
