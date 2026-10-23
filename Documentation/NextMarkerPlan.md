# Next 標記

> Task ID: next-marker
>
> 來源：[agent-workflow.decisions](../decisions/agent-workflow.decisions) 第 3 題（使用者 2026-10-23 定案）。

```text
TaskProgress Report（一個 scope）
└─ Next 標記：report.json 的一個指標，指向唯一一個子項
   ├─ 資料：Report CLI 寫入（agent）、Viewer 寫入（使用者），同一套 revision 檢查
   ├─ 排序：Next 的卡排在所有卡之前，Next 的子項排在卡內所有子項之前
   ├─ 外觀：語意色 next（金色）套在卡片 pin 圖示與子項的「Next」標籤
   └─ 失效：子項完成、等待中或待使用者時，排序與標記效果消失，退回推算；覆盤時 agent 重設
```

Report 要回答「現在該做哪一件事」。推算的下一步（優先級、卡片順序、等待狀態）會過期也會與人的判斷不同；Next 是人或 agent 明確指定的那一件，推算只在沒有 Next 時補位。

## 已決定

1. **唯一。** 每個 scope 一個 Next，掛在子項上，存在 `report.json` 的頂層欄位 `next`（`task_id`、`item_id`）。設新的就取代舊的。跨 scope 的 Next 不做。
2. **排最高。** Next 所在的卡排在所有卡之前，含優先級 立即（0）；Next 子項排在卡內所有子項之前。釘選（pin）是瀏覽器本機視圖，不改：釘選的卡仍在 Next 卡之上。
3. **失效即推進。** Next 子項推算為完成或等待中（等其他子項）時，Viewer（本機、非編輯中）直接把推算出的下一個子項（依優先級與卡片順序取第一個未完成且不等待的）寫成新的 Next，狀態直接改變，畫面不另標「推算」（使用者 2026-10-23：不用分）。沒有可推算的子項時 Next 卡不顯示。待使用者、待他驗的子項仍是有效的 Next，只是輪到那個人（使用者 2026-10-23 實測後修正）。使用者取消後 `next` 為空，不自動補回，等使用者自己設或下一次評估。
4. **覆盤重設。** `/task-progress-items` 評估結尾：`next` 為空或失效時，agent 依同一推算規則選一個寫入，回報「Next 已設為 …」。原第 3 題「下一個模組怎麼點名」併入：點名的決策子項設為 Next 即可。
5. **寫入路徑。** Report CLI 新增 `next.set`（task_id、item_id）與 `next.clear`，帶 `actor`／`session_id`，記活動；Viewer 在預覽與編輯模式都可設定或取消（預覽模式寫入沿用拖曳換位的先例）。兩邊同一個 revision 檢查；指向不存在的子項時拒絕。
6. **語意色。** 新增第四個語意色 `next`，與完成、受阻、警告同級：自訂佈景不覆蓋。暗色約 `#d4a62a`，亮色約 `#9a6b00`（實作時以 4.5:1 對比核定）。金色與優先（1）的琥珀色相近，使用者 2026-10-23 知悉並決定保留，不另換色；Next 的辨識靠填滿的 pin 圖示與「Next」膠囊的形狀，不只靠顏色。
7. **外觀。** 卡片的 pin 圖示在 Next 卡上以 `next` 色實心顯示（一般釘選維持現狀）；Next 子項那一行左緣 `next` 色色條，加一個 `next` 色「Next」小膠囊。不用整圈外框、不加底色。
8. **隔離同名標籤。** 卡片 Developer 區藍色「Next Step :」改名「後續」，與「後續動作」清單併為一區，改用次要文字色；Checklist 畫面的「下一步 · Agent：…」一行刪除。「Next」與金色只屬於本標記。

9. **控制項：長按。** 使用者 2026-10-23 決定：子項列依 UX 操作規範的長按（[Input](../../UX/Documentation/ModuleSpec/Foundation/Input.md) 3.0.1 INPUT-PRESS-HOLD：`holdDuration` 400ms、`dragThreshold` 6px，長按後抑制原生短按）設為 Next，對 Next 子項再長按取消；鍵盤依 INPUT-KEY-COMMAND 以 Shift+Enter 對應 `hold`。實作 `viewer/assets/long-press.js` 自 Web `src/ui/long-press.ts`（規格來源基線）移植。不另加滑過圖示。
10. **隱藏項目連結。** 三個面板（Report、Checklist、Decision）的卡片清單底部，有被篩選標籤藏起的項目時，間距 5px、置中顯示「…顯示隱藏項目(N)」，只有文字帶底線可按，動作是重設全部篩選標籤（Report 另清空搜尋）。Report 的 N 計整張被藏的卡加上留下的卡裡被藏的子項。共用 `CardList` 實作，三個宿主各自提供數量與重設。
11. **執行後由 agent 提出。** `/task-progress-items` 的命令（`run`、`accept`、`auto`）讓 Next 子項變成完成或等待中時，agent 評估下一件該做的事（推算順序只是預設），以 `next.set` 寫入並在回報說明理由；使用者以長按改掉。Viewer 的自動推進仍保留，處理沒有 agent 經手時的失效（使用者 2026-10-23）。

## 尚未決定

無。

## 實作紀錄（2026-10-23）

- 資料：`schemas/report.schema.json` 頂層 `next`；Report CLI `next.set`／`next.clear`（`service/report_operations.py`，設定時在子項記 `updated`）；`viewer/assets/report-model.js` 只驗形狀。
- 推算與排序：`viewer/assets/next-marker.js`（有效性、推算、卡與子項提前）；`app.js` 的 `renderTasks` 在狀態分組與優先級排序後提前 Next 卡，釘選由 `CardList` 之後套用所以仍在其上；失效的 Next 由 `advanceStaleNext` 寫成推算出的子項（每個失效指標只試一次）；`TaskCard` 提前 Next 子項並展開它。
- 畫面：頂端 `next-step` region（`ReportNextStep.svelte` 包共用 `NextStepCard`，只顯示有效的 Next，整張可點、以 `?pin=` 開卡）；語意色 `--theme-next-*`／`--color-next-*` 四個佈景區塊；`.card-pin.is-next`、`.editor-item-row.is-next` 左緣、`.item-next-capsule`。Developer 區「Next Step :」改「後續：」、清單標題改「後續」、顏色改次要文字色；Checklist 畫面的下一步連結與樣式刪除。
- 寫入：預覽模式長按或 Shift+Enter 經 `setNextInPreview` 走與拖曳換位相同的本機編輯主機與過期檢查；Viewer 寫入時不在子項記活動（CLI 會記）。**編輯模式尚未支援**：編輯 session 持有草稿，需要 Editor Core 的命令，另排。
- 驗證：Node 637 項通過（4 項既有的 checklist 格式失敗與本次無關）、Python Report CLI 22 項通過；Browser 實測 Report 頂端 Next 卡、金色 pin、Next 膠囊、Shift+Enter 設定與取消。四個 UI bundle 已重建；`Build/win-x64` 的桌面版 checklist-ui 要等下次 Publish。

## 驗收

- 排序：含立即（0）卡時 Next 卡仍在最前；釘選卡在 Next 卡之上；Next 子項在卡內最前；Next 子項完成後兩者回到原位。
- 失效：Next 子項完成或等待中時，Viewer 把推算出的下一個子項寫成新的 `next`，畫面不標「推算」；待使用者、待他驗時仍是有效的 Next，`next` 不變。
- 寫入：`next.set` 指向不存在的子項被拒；Viewer 設定後 report.json 多出 `next`，活動紀錄有記錄者；重設時舊 Next 消失。
- 外觀：兩種佈景與自訂佈景下 pin 圖示與「Next」膠囊都是 `next` 色且對比達 4.5:1；卡片 Developer 區顯示「後續」，不再出現「Next Step」；Checklist 畫面沒有「下一步 · Agent」一行。
- 覆盤：`next` 為空時執行 `/task-progress-items plan`，agent 寫入 Next 並在回報列出。
