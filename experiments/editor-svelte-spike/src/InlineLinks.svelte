<script>
  // Full-length text with the same safe `[label](URL)` links ExpandableText
  // renders; the stored string stays the raw Markdown.
  import { inlineLinks } from "@editor/inline-links.js";
  export let text = "";
  export let emphasis = false;
</script>

<span use:inlineLinks={{ text, emphasis }}></span>
