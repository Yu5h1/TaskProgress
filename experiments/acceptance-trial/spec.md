# 驗證流程試跑規格

這份規格只供〈驗證流程選項〉試跑使用（`Documentation/AcceptanceChainPlan.md`），產物都放在本資料夾，試跑結束後可整個刪除。

## 自驗試跑

建立 `experiments/acceptance-trial/self.txt`，內容只有一行 `self ok`。

## 人工試跑

建立 `experiments/acceptance-trial/manual.txt`，內容只有一行 `manual ok`。使用者在 Report 上確認這一項的狀態膠囊依序顯示「待使用者」，驗收後顯示完成。

## 他驗試跑

建立 `experiments/acceptance-trial/cross.json`，內容是一個物件，恰好三個欄位：`name` 為 `"cross"`、`decimals` 為 `2`、`rounding` 為 `"half-up"`。

## 他驗與人工試跑

建立 `experiments/acceptance-trial/cross-manual.txt`，內容兩行：第一行 `cross manual ok`，第二行是建立時間（ISO 8601，UTC）。使用者在 Checklist 面板確認 `[acceptance]` 檢查顯示「他驗」標籤與記錄者，並在他驗通過前 `[manual]` 是鎖住的。

## 條件不符試跑

建立 `experiments/acceptance-trial/condition.txt`，內容只有一行數字 `3`。

## 等待試跑

在「他驗試跑」完成之後，建立 `experiments/acceptance-trial/waits.txt`，內容只有一行 `waited`。這一項宣告等待「他驗試跑」，在那一項完成前，Report 應顯示「等待中」並列出它的連結。

## 人工等待試跑

對應〈流程紀錄〉情境 7 的第 4 步（`Documentation/AcceptanceChainPlan.md`）。三個子項：

- **W（人工等待：被等項）**：建立 `experiments/acceptance-trial/manual-wait.txt`，內容只有一行 `manual wait ok`；驗證方式為人工。
- **L（人工等待：一般等待者）**：宣告等待 W。W 只差使用者驗收時就能執行：建立 `experiments/acceptance-trial/wait-lifted.txt`，內容只有一行 `lifted`。
- **S（人工等待：嚴格等待者）**：以嚴格等待（`"strict": true`）宣告等待 W。W 完成後才能執行：建立 `experiments/acceptance-trial/wait-strict.txt`，內容只有一行 `strict`。

使用者先判 W 的人工驗收不通過一次，確認已完成的 L 改顯示「需修正」、S 仍等待中；agent 修正 W 並重做 L 之後，使用者判通過，S 解除等待並完成。
