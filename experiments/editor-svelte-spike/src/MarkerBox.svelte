<script>
  /*
   * The three-state marker box: `[ ]` not run, `[x]` passed, `[!]` failed.
   *
   * One implementation for every surface that shows this vocabulary. The box
   * renders as a square the same way a checkbox does — the border is the
   * bracket. Clicking an interactive box advances one step through
   * pending → passed → failed → pending; the caller owns what that means and
   * whether it is allowed, so a read-only or derived marker is the same box
   * with `interactive` left off, not a second component.
   *
   * `stale` outlines an empty box whose earlier result no longer counts, so
   * "needs re-verification" reads apart from "never run" without a fourth glyph.
   *
   * Styling lives with the other shared classes in `viewer/assets/styles.css`,
   * so any host that already loads the shared stylesheet gets the box.
   */
  export let status = "pending";
  export let interactive = false;
  export let stale = false;
  export let label = "";
  export let onCycle = () => {};

  const GLYPH = { pending: "", passed: "✓", failed: "!" };
  const STATE_LABEL = { pending: "未執行", passed: "通過", failed: "失敗" };

  $: glyph = GLYPH[status] ?? "?";
  $: stateLabel = stale && status === "pending" ? "需重驗" : STATE_LABEL[status] ?? status;
  $: staleClass = stale && status === "pending" ? " marker-stale" : "";
  $: description = label ? `${label}：${stateLabel}` : stateLabel;
</script>

{#if interactive}
  <button
    type="button"
    class={`marker-box marker-${status}${staleClass} marker-box-button`}
    aria-label={`${description}，點擊切換下一個結果`}
    onclick={onCycle}
  ><span aria-hidden="true">{glyph}</span></button>
{:else}
  <span class={`marker-box marker-${status}${staleClass}`} role="img" aria-label={description}
  ><span aria-hidden="true">{glyph}</span></span>
{/if}
