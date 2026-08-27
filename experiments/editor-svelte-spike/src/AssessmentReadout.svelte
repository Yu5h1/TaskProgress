<script>
  /*
   * The headline row of an assessment panel: what the reader opened the panel
   * to see, on one line.
   *
   * It is a property row, not a stat card. Label left, value right, one column
   * to scan — the way an Inspector, a property grid or a sign-in form reads.
   * The label is never stacked above the value at any width; when the row runs
   * out of room the decorations move instead (see the container query in
   * styles.css), because the label/value pair is the part that has to survive.
   *
   * Chips arrive through a slot rather than a prop: Time puts contributor
   * badges here and Cost's project panel puts a coverage chip, and those are
   * different elements with different meanings. A `chips: []` prop would have
   * forced one of them to pretend to be the other.
   *
   * `summary` is optional. Neither module fills it yet — Time's estimate
   * rationale is a paragraph and belongs in its own note below — but the zone
   * exists because the layout has to know where it goes when one appears.
   */
  export let label;
  export let value;
  export let summary = null;
</script>

<section class="assessment-readout">
  <span class="assessment-readout-label">{label}</span>
  <span class="assessment-readout-badges"><slot name="badges" /></span>
  {#if summary}
    <span class="assessment-readout-summary" title={summary}>{summary}</span>
  {/if}
  <strong class="assessment-readout-value">{value}</strong>
</section>
