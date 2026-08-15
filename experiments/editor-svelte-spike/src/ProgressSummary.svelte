<script>
  /*
   * Shared progress summary: a count row, a progress bar, and one line of text.
   *
   * Everything it shows is passed in. It reads no data structure of its own, so
   * the same component serves every screen that has to answer "how far along is
   * this" — each caller derives its own numbers and supplies its own words.
   *
   * The bar itself is `ProgressBar.svelte`, which the task-progress screen also
   * uses directly: a screen that wants only a meter should not have to take a
   * count row and a caption with it.
   *
   * Tones use the same three-state vocabulary as `MarkerBox.svelte`, so a
   * screen does not translate between two sets of names.
   */
  import ProgressBar from "./ProgressBar.svelte";

  export let stats = [];
  export let bar = null;
  export let caption = "";
  export let note = "";
  export let label = "進度摘要";

  const TONES = new Set(["passed", "failed", "pending"]);

  const toneClass = (tone) => (TONES.has(tone) ? ` progress-tone-${tone}` : "");
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

  {#if bar}
    <ProgressBar
      form={bar.form}
      cells={bar.cells ?? []}
      ratio={bar.ratio ?? 0}
      label={caption || label}
    />
  {/if}

  {#if caption || note}
    <p class="progress-caption">
      <span>{caption}</span>
      {#if note}<span class="progress-note">{note}</span>{/if}
    </p>
  {/if}
</section>
