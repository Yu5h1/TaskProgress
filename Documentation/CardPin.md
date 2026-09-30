# 任務卡釘選

> Task ID: card-pin

## 契約

一般任務卡及指路卡頂部中央提供小圖釘，可釘選／取消。最新釘選排最前，優先於群組、優先級、順排、逆排與自由排序。釘選不繞過篩選或隱藏；取消後恢復既有排序位置。

這是本機檢視設定，沿用 CardList 的報告 storageKey，以 `:pins` 保存 ID 順序，不改 report。無法儲存時仍可於本頁使用並顯示提示。切換報告重新載入各自設定，過期 ID 不生成卡片。釘選卡不可自由拖移，未釘選卡仍可拖移且不改隱藏卡的底層排序槽位。

實作量小、架構影響局部：CardList 提供預設關閉的 pinEnabled，TaskList 啟用。Checklist／Decision 不在本次範圍。排序邏輯集中於 card-order.js，釘選投影最後套用，不複製任務或新增 Report schema 欄位。

驗收：排序定向測試及 Viewer 建置；使用者核查圖示位置、釘選與取消、重載保存。記錄位於 checklists/card-pin.checklist。
