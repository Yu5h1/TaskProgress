<script>
  import { copyText } from "../../../viewer/assets/item-reference.js";

  export let id;
  export let label;

  let state = "";
  let timer;

  async function copyId(event) {
    event.stopPropagation();
    clearTimeout(timer);
    const copied = await copyText(id);
    state = copied ? "已複製" : "無法複製";
    timer = setTimeout(() => { state = ""; }, 1500);
  }
</script>

<button
  type="button"
  class="task-id-copy"
  class:is-done={state}
  class:is-copied={state === "已複製"}
  aria-label={state || `複製「${label}」的卡片 ID`}
  title={state || id}
  onclick={copyId}
>{state === "已複製" ? "✓" : state ? "✕" : "⧉"}</button>
