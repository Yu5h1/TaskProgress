<script>
  // Full-length text with the same safe `[label](URL)` links ExpandableText
  // renders; the stored string stays the raw Markdown.
  import { parseInlineLinks } from "@editor/inline-links.js";
  export let text = "";
  $: parts = parseInlineLinks(text);
</script>

{#each parts as part}{#if part.href}<a class="inline-link" href={part.href} rel="noopener noreferrer">{part.text}</a>{:else}{part.text}{/if}{/each}
