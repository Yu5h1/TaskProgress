<script>
  // A top-layer shield shared by screens whose inputs immediately write data.
  import { onMount } from "svelte";
  import { installFocusShield } from "../../../viewer/assets/focus-shield.js";
  let blocked = false;
  onMount(() => installFocusShield({ onChange: value => blocked = value }));
  function open(node) { node.showModal(); }
</script>

{#if blocked}
  <dialog use:open class="focus-shield" aria-label="操作已暫停" oncancel={event => event.preventDefault()}>
    <button type="button">操作已暫停<br /><small>點一下或按 Enter／空白鍵恢復操作</small></button>
  </dialog>
{/if}

<style>
  .focus-shield { position:fixed; inset:0; width:100vw; height:100vh; max-width:none; max-height:none; margin:0; padding:0; border:0; background:transparent; color:var(--text, #fff); }
  .focus-shield[open] { display:grid; place-items:center; }
  .focus-shield::backdrop { background:rgb(20 24 30 / 65%); backdrop-filter:blur(2px); }
  .focus-shield button { padding:20px 28px; border:1px solid var(--line, #888); border-radius:12px; background:var(--panel, #252a33); color:inherit; font:inherit; cursor:pointer; }
  .focus-shield small { display:block; margin-top:8px; }
</style>
