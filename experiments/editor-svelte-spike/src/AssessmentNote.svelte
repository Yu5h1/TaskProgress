<script>
  /*
   * A titled block of supporting prose inside an assessment panel: why a
   * figure is what it is, what formula produced it, or why a judgement is
   * being withheld.
   *
   * The body is a slot rather than a prop because the two real callers put
   * different things in it — Time renders a `<code>` formula, Cost a
   * paragraph — and a `text` prop would have forced one of them to smuggle
   * markup through a string.
   *
   * `tone` renders the same dot the metric grid does, on the same vocabulary:
   * Time and Cost independently arrived at on-track/at-risk/critical, which is
   * why it is a shared token here rather than a class name each domain passes
   * through.
   */
  export let heading;
  export let tone = null;
</script>

<section class="assessment-note">
  <h3>
    {#if tone}
      <span class="assessment-tone-dot assessment-tone-{tone}" aria-hidden="true"></span>
    {/if}
    {heading}
  </h3>
  <slot />
</section>
