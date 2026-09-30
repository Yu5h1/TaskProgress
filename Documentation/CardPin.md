# 任務卡釘選

> Task ID: card-pin

## 契約

一般任務卡及指路卡頂部中央提供小圖釘，可釘選／取消。最新釘選排最前，優先於群組、優先級、順排、逆排與自由排序。釘選不繞過篩選或隱藏；取消後恢復既有排序位置。

這是本機檢視設定，沿用 CardList 的報告 storageKey，以 `:pins` 保存 ID 順序，不改 report。無法儲存時仍可於本頁使用並顯示提示。切換報告重新載入各自設定，過期 ID 不生成卡片。釘選卡不可自由拖移，未釘選卡仍可拖移且不改隱藏卡的底層排序槽位。

實作量小、架構影響局部：CardList 提供預設關閉的 pinEnabled，TaskList 啟用。Checklist／Decision 不在本次範圍。排序邏輯集中於 card-order.js，釘選投影最後套用，不複製任務或新增 Report schema 欄位。

驗收：排序定向測試及 Viewer 建置；使用者核查圖示位置、釘選與取消、重載保存。記錄位於 checklists/card-pin.checklist。

## CLI 開啟並釘選

```powershell
task-progress.exe open --scope web --pin workflow
task-progress.exe open "C:\Project" --pin workflow --no-browser
```

`--pin` 接受一個既有任務卡 ID，不是標題。Agent 從目前任務上下文取得 ID，不需要 session ID、session 參數或新的關聯資料。卡片名稱不明確時先讀 report，不能猜 ID。

每次開啟帶有 `?scope=web&pin=workflow` 的頁面，都會將該 ID 移到本機釘選序列最前。既有釘選不重複、不取消；手動點擊圖釘仍是切換。釘選沿用瀏覽器及報告的本機設定，不修改 report，不即時遙控其他已開啟頁籤。

CLI 拒絕缺值、空值、重複 --pin，以及目標 report 中不存在的 ID；檢查在分析／服務啟動前完成。`--no-browser` 只準備入口並輸出網址，實際開啟網址才套用 pin。不同瀏覽器的本機設定各自獨立。

明確的 URL pin 會展開並顯示該卡片，暫時豁免該卡片的狀態／子項篩選，不改篩選標籤；其他卡片仍依篩選顯示。卡片隱藏設定會解除。每次頁面載入只套用一次，後續畫面刷新不會覆蓋使用者取消釘選或收合的操作；重新開啟此網址才再觸發。跨 scope 不套用相同 ID。

確認所用 EXE 的 `--help` 有列出 `open --pin`；部署狀態以 handoff.md 為準。Debug 建置可從 `src/TaskProgress.Cli/bin/Debug/net9.0-windows/task-progress.exe` 使用，正式入口為 `Build/win-x64/task-progress.exe`。
