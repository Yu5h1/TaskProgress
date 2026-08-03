<script>
  import { onMount } from "svelte";

  import DeliveryRiskPreview from "./DeliveryRiskPreview.svelte";

  export let preview;
  export let busy = false;
  export let onBack;
  export let onConfirm;

  let dialog;
  let backButton;

  onMount(() => {
    dialog.showModal();
    backButton.focus();
  });

  function cancel(event) {
    event.preventDefault();
    if (!busy) onBack();
  }

  function keydown(event) {
    if (event.key !== "Escape" || busy) return;
    event.preventDefault();
    event.stopPropagation();
    onBack();
  }
</script>

<dialog
  class="spike-confirm-dialog"
  bind:this={dialog}
  aria-labelledby="delivery-confirm-title"
  oncancel={cancel}
  onkeydown={keydown}
>
  <div class="spike-confirm-copy">
    <p class="spike-editor-kicker">敏感資料確認</p>
    <h2 id="delivery-confirm-title">確認儲存交付日變更？</h2>
    <p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p>
  </div>
  <DeliveryRiskPreview {preview} heading="儲存影響確認" />
  <div class="spike-confirm-actions">
    <button bind:this={backButton} type="button" onclick={onBack} disabled={busy}>返回修改</button>
    <button class="spike-save-button" type="button" onclick={onConfirm} disabled={busy}>
      {busy ? "正在儲存…" : "確認儲存"}
    </button>
  </div>
</dialog>
