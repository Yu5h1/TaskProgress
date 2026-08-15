<script>
  /*
   * The one progress bar. Two forms, because callers need different things from
   * it, and both live here so neither screen grows its own:
   *
   * - `segmented` draws one cell per unit, readable while there are a dozen or
   *   so and countable at a glance.
   * - `continuous` draws a native `<progress>`, which carries the meter
   *   semantics assistive technology expects and takes the shared gradient.
   *
   * `extraClass` exists for placement only — a caller whose layout positions the
   * bar (a grid row, say) passes its own class and keeps the look. It is not a
   * hook for a second appearance.
   */
  export let form = "continuous";
  export let cells = [];
  export let ratio = 0;
  export let label = "";
  export let extraClass = "";

  const TONES = new Set(["passed", "failed", "pending"]);

  const toneClass = (tone) => (TONES.has(tone) ? ` progress-tone-${tone}` : "");

  function percent(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0;
    return Math.min(100, Math.max(0, Math.round(parsed * 1000) / 10));
  }

  $: filled = percent(ratio);
  $: segments = Array.isArray(cells) ? cells : [];
</script>

{#if form === "segmented"}
  <div class={`progress-bar progress-bar-segmented ${extraClass}`} role="img" aria-label={label}>
    {#each segments as cell, index (index)}
      <i class={`progress-cell${toneClass(cell)}`}></i>
    {/each}
  </div>
{:else}
  <progress class={`progress-meter ${extraClass}`} max="100" value={filled} aria-label={label}></progress>
{/if}
