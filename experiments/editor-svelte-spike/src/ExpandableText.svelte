<script>
  import { expandableText } from "@editor/expandable-text.js";
  export let text = "";
  export let lines = 2;
  export let moreLabel = "…更多";
  export let lessLabel = "收合";
  export let expanded = false;
</script>

<div use:expandableText={{ text, lines, moreLabel, lessLabel, expanded }}></div>
