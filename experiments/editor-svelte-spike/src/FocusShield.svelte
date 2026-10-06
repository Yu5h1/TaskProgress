<script>
  // Shared mouse activation guard; deliberately renders no overlay or focus trap.
  import { onMount } from "svelte";
  import { installFocusShield } from "../../../viewer/assets/focus-shield.js";
  onMount(() => installFocusShield());
</script>
