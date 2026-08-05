<script>
  // Registered scopes on the localhost home page. Hrefs are resolved by the
  // host, which owns the scope-to-URL rule; this component only lays them out.
  // `基本報告` links to the same scope with the Developer overlay disabled.
  export let scopes = [];
  export let baseOnlyLabel = "基本報告";
</script>

{#each scopes as scope (scope.id)}
  <article class="scope-entry">
    <a class="scope-link" href={scope.href}>{scope.id}</a>
    {#if scope.baseOnlyHref}
      <a class="scope-developer-link" href={scope.baseOnlyHref}>{baseOnlyLabel}</a>
    {/if}
  </article>
{/each}
