# 編輯歷史與 Undo／Redo

> Task ID: editor-history

## 所在位置

```text
TaskProgress 編輯器
├─ SaveBar：復原／重做按鈕
├─ Persistence controller：自動／謹慎保存、錯誤與重試
└─ 文件 session
   ├─ Report：欄位命令、正規化、進度與驗證
   ├─ Checklist：人工結果、Observed、來源 revision
   ├─ 決策：選項、其他文字與自動保存 revision
   └─ Editor transaction：草稿、歷史、放棄與提交基準
```

Report 的復原按鈕原本就有應用程式的歷史功能；輸入框的瀏覽器原生文字復原是另一種機制。Report／Checklist 按鈕透過 persistence controller 呼叫文件 session，決策按鈕使用其自動保存流程；三種文件的歷史由同一個 transaction 管理。

## 共用契約

`viewer/assets/editor-transaction.js` 是 ES module 入口；`editor-transaction-runtime.js` 是唯一實作，也可供 classic script 載入。Report Core 透過工廠注入使用它，Checklist 直接使用同一入口。核心不依賴 DOM、Svelte、檔案、HTTP 或文件種類。

- `apply(command, reducer, mergeKey)` 在獨立副本執行命令。有效修改才建立前後快照並清空 redo；無變更或失敗不改動歷史與目前草稿。
- 同一個非空 `mergeKey` 的連續修改合併為一步；回到修改前內容時移除該步。Undo、Redo 與成功 commit 會截斷合併，之後再修改同一欄位仍可獨立復原。
- Undo／Redo 同時還原內容與重新計算衍生資料。預設最多保留 100 步，可由 session 設定正整數上限；無效設定使用預設值。
- `normalize(value)` 在初始化、commit、discard 時建立可編輯資料；`derive(draft, baseline)` 負責衍生資料。兩者是同步純函式；reducer 必須回傳可 structured-clone、可 JSON 序列化的文件。
- `commit(saved, { keepHistory: true })` 更新保存基準並保留歷史，讓自動保存後仍可復原；預設 commit 與 discard 清空歷史。Discard 回到最後成功保存的內容。
- 歷史狀態包含 canUndo、canRedo、深度與命令類型。歷史只存在目前 session，不跨重新整理或重開。
- 文件 adapter 仍擁有寫入 revision、最後保存內容與驗證；Checklist 的歷史不含 revision，提交差異永遠對照最後保存的文件，避免復原或重做漏送結果。Persistence controller 決定何時保存，失敗時保留草稿。

## 驗收

1. Report 與 Checklist 委派同一個 transaction，Report Core 不再維護歷史堆疊。
2. 連續輸入合併、撤銷後分支、重做後新輸入、歷史上限、無變更及失敗不污染狀態都有定向測試。
3. Report 的進度、狀態搬移、指路卡、摘要，以及兩種 session 的自動保存／復原／重做、謹慎保存與錯誤保留維持正確。
4. ES module 與 classic runtime 可載入；Checklist Browser／Desktop 資產由同一來源重新建置。

## 範圍與成本

工作量中等，架構影響限於既有 transaction 的共用邊界。沿用現有實作，移除 Report 約百行重複歷史程式；以核心與 session 整合測試、定向資產建置驗證。

本輪不增加快捷鍵、不接管輸入框原生 Undo、不建立跨 session 永久歷史、不擴大時間設定的 Undo 範圍，也不重啟服務或恢復已退役 Demo 的 UI。Classic runtime 測試僅保護載入契約。

## 決策歷史

> Task ID: decision-history

決策頁面也使用同一個 editor transaction。session 只將選擇與「其他」文字交給歷史核心，revision、題目版本與請求識別維持在保存層。頁面提供「復原」「重做」及可用步數；歷史限本次頁面 session，最多 100 步。

- 選取、改選、取消選取及其他文字可復原；連續尚未保存的同欄文字合併為一步。保存成功保留歷史，復原後的新修改清除 redo。
- 復原／重做轉回草稿，沿用現有 confirm／reopen 保存；未選其他的文字仍只保存在本頁，不因復原而自動選取其他。
- 清除全部成功時加入一個 action；復原時逐題依最新 revision 保存，並非跨題原子交易。失敗保留草稿，沿用每題重試；結果未確認時必須先查詢原請求。
- 保存中、結果未確認或存在草稿衝突時不允許操作歷史。外部文件改動或重送回覆已包含其他變動時清空舊歷史，避免還原過期題目／答案。重新核對草稿也重建歷史基準。
- 首次載入預設僅顯示待決策；已決策可由標籤開啟。已有分頁篩選記錄仍優先，焦點回復與重新整理不覆蓋使用者選擇。編輯卡片離焦才套用篩選的既有契約不變。

驗收：已保存選擇的 Undo→保存→Redo 使用最新 revision；其他文字及在途輸入不遺失；清除全部是一筆歷史；重送、衝突與外部變更不誤覆寫；預設篩選和既有分頁偏好各自正確。

工作量中等，架構影響限既有 session adapter；不修改共用歷史核心或後端契約。以定向 Node 測試、Decision Browser／Desktop 共用資產建置與實機按鈕／篩選核查驗證。不新增鍵盤快捷鍵或永久歷史。
