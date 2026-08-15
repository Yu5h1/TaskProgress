<script>
  /*
   * Shared progress summary: a count row, a progress bar, and one line of text.
   *
   * Everything it shows is passed in. It reads no data structure of its own, so
   * the same component serves every screen that has to answer "how far along is
   * this" — each caller derives its own numbers and supplies its own words.
   *
   * The bar has two forms because callers need different things from it:
   * `segmented` gives one cell per unit, which stays readable while there are a
   * dozen or so and lets a reader count what is left; `continuous` is a single
   * filled track for when only the proportion matters. Two shapes of one
   * component, not two components.
   *
   * Tones use the same three-state vocabulary as `MarkerBox.svelte`, so a
   * screen does not translate between two sets of names.
   */
  export let stats = [];
  export let bar = null;
  export let caption = "";
  export let note = "";
  export let label = "進度摘要";

  const TONES = new Set(["passed", "failed", "pending"]);

  const toneClass = (tone) => (TONES.has(tone) ? ` progress-tone-${tone}` : "");

  function percent(value) {
    const ratio = Number(value);
    if (!Number.isFinite(ratio)) return 0;
    return Math.min(100, Math.max(0, Math.round(ratio * 1000) / 10));
  }

  $: cells = bar?.form === "segmented" && Array.isArray(bar.cells) ? bar.cells : [];
  $: filled = bar?.form === "continuous" ? percent(bar.ratio) : 0;
</script>

<section class="progress-summary" aria-label={label}>
  {#if stats.length}
    <div class="progress-stats">
      {#each stats as stat (stat.key ?? stat.label)}
        <div class={`progress-stat${toneClass(stat.tone)}`}>
          <b>{stat.value}</b>
          <span>{stat.label}</span>
        </div>
      {/each}
    </div>
  {/if}

  {#if bar?.form === "segmented"}
    <div class="progress-bar progress-bar-segmented" role="img" aria-label={caption || label}>
      {#each cells as cell, index (index)}
        <i class={`progress-cell${toneClass(cell)}`}></i>
      {/each}
    </div>
  {:else if bar?.form === "continuous"}
    <div class="progress-bar progress-bar-continuous" role="img" aria-label={caption || label}>
      <i class="progress-fill" style={`width: ${filled}%`}></i>
    </div>
  {/if}

  {#if caption || note}
    <p class="progress-caption">
      <span>{caption}</span>
      {#if note}<span class="progress-note">{note}</span>{/if}
    </p>
  {/if}
</section>
