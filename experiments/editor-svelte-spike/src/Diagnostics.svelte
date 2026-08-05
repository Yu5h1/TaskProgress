<script>
  // Load diagnostics. The host decides what counts as a diagnostic and whether
  // the region is visible; the wording of each level lives here.
  export let diagnostics = [];

  const headings = {
    warning: "注意",
    error: "無法載入部分資料",
  };
</script>

{#each diagnostics as diagnostic}
  {@const level = diagnostic.level ?? "error"}
  <div class={`diagnostic diagnostic-${level}`}>
    <strong>{headings[level] ?? headings.error}</strong>
    <p>{diagnostic.message}</p>
  </div>
{/each}
