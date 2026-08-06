<script>
  /*
   * The `M/D 交付 ●` pill next to the report title. Pure presentation: the
   * host's time-dialog-control.js decides the label, tone and aria text; this
   * component only lays them out, so it can be shared by every host that
   * shows a project title line.
   */
  export let hidden = true;
  export let disabled = false;
  export let className = "time-summary-button";
  export let ariaLabel = "";
  export let label = "";
  export let showDot = false;
  export let showChevron = false;
  export let onClick = () => {};
</script>

<button
  class={className}
  type="button"
  {hidden}
  {disabled}
  aria-label={ariaLabel}
  onclick={onClick}
>
  <span>{label}</span>
  {#if showDot}<span class="time-risk-dot"></span>{/if}
  {#if showChevron}<span class="time-chevron">›</span>{/if}
</button>
