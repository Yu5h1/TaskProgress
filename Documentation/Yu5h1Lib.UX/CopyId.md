# CopyId 複製識別碼 — TaskProgress 來源基線

```text
Report／Checklist／Decision 卡片
├─ copyButton／copyAction：入口、回饋與生命週期
├─ item-reference：卡片 ID 或子項完整參照、剪貼簿寫入
└─ UX CopyId：由本來源抽出的共通體驗草案
```

來源：`ui/web-workflow/common.mjs` 的 `copyAction`／`copyButton`、`viewer/assets/item-reference.js` 的 `copyText`／`itemReference`；Report 子項由 `ui/web-workflow/viewer.mjs` 提供參照或多選回呼。靜態檢查時 checkout HEAD 為 `ae4b725e35a3c3b193e6b91a8c75e567d515d0b1`；`viewer.mjs` 當時有其他工作的未提交變更，該檔內容不當作固定 commit 快照。

來源紀錄：卡片複製宿主 ID；子項可複製完整參照或由宿主多選處理。成功顯示 `✓`、失敗 `✕`，1.5 秒回復；新操作以 generation 淘汰舊結果，destroy 清計時與監聽。Clipboard API 失敗時會嘗試 selection-copy fallback。滑過、焦點及回饋狀態由產品樣式決定。

## 來源驗證狀態

[UX 草案](../../../UX/Documentation/ModuleSpec/Controls/CopyId.md) 的來源基線為暫定：2026-11-05 從實際 `http://127.0.0.1:8001/?scope=yu5h1lib-web` 以受控剪貼簿替身檢查，滑過、卡片 ID、成功與 1.5 秒復原、失敗、點擊隔離、後到結果與子項完整參照共 6/6 通過。證據 [summary.json](../../../Web/.verify/copy-id-source/2026-11-05T09-59-29-793Z/summary.json)；未更動系統剪貼簿。

伺服器的 `/assets/viewer-ui.js` 與本地產物相同，SHA-256 `e1c6418f3c775f15a2379acc31aef8379ec2ef43dc4399058fa2ed83c1fe9714`；此檔有其他工作中的未提交變更，因此此結果綁定內容雜湊、不可稱為 commit `ae4b725` 的乾淨基線。外觀由使用者確認，系統剪貼簿、卸載及可控計時等完整中性案例尚未完成。來源基線只證明草案與 TaskProgress 的對照，不代表其他平台相容。
