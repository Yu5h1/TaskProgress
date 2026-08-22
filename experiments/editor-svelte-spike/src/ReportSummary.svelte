<script>
  /*
   * The report's summary line, in both modes and on every screen that shows
   * one.
   *
   * Preview renders the sentence the host resolved: the written summary, or
   * the generated fallback when the report carries none. Edit turns the same
   * line into a field in place — a report header does not grow a second form
   * because one of its fields became editable.
   *
   * Unwritten is a legal state, so clearing the field is allowed and the
   * placeholder says what the report falls back to. The start, directory and
   * error screens pass their own sentence through here as well; it is the same
   * line in the same place, and a second implementation of it would drift.
   */
  export let text = "";
  export let editable = false;
  export let value = "";
  export let placeholder = "";
  export let label = "報告摘要";
  export let onCommit = () => {};
</script>

{#if editable}
  <textarea
    class="report-summary-input"
    aria-label={label}
    maxlength="1000"
    rows="2"
    {placeholder}
    {value}
    oninput={(event) => onCommit(event.currentTarget.value)}
  ></textarea>
{:else}
  <p class="hero-summary">{text}</p>
{/if}
