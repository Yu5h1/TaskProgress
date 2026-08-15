<script>
  /*
   * Shared next-step card: the one thing to do next, what it is, and how it
   * passes.
   *
   * One item at a time on purpose — a list of everything outstanding is what
   * the screen below the card already is, and a card showing three things
   * stops being an answer to "what now". The caller decides which item that
   * is, because only it knows what blocks what.
   *
   * Every string is supplied. `command` is optional and renders as a copyable
   * block rather than prose, so a reader never has to pick a command out of a
   * sentence.
   */
  export let heading = "";
  export let title = "";
  export let action = "";
  export let expect = "";
  export let command = "";
  export let actionLabel = "要做什麼";
  export let expectLabel = "怎樣算通過";
</script>

<section class="next-step-card" aria-label={heading || title}>
  {#if heading}<p class="next-step-heading">{heading}</p>{/if}
  {#if title}<h3 class="next-step-title">{title}</h3>{/if}

  {#if action || expect}
    <dl class="next-step-fields">
      {#if action}
        <div><dt>{actionLabel}</dt><dd>{action}</dd></div>
      {/if}
      {#if expect}
        <div><dt>{expectLabel}</dt><dd>{expect}</dd></div>
      {/if}
    </dl>
  {/if}

  {#if command}<pre class="next-step-command">{command}</pre>{/if}
</section>
