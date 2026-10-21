# 複製子項參照

> Task ID: report-item-copy-reference
>
> 觸發方式由 [決策 copy-entry](../decisions/report-item-copy-reorder.decisions) 定案（滑過或聚焦才出現的小圖示）。驗收 `checklists/report-item-copy-reference.checklist`。

## 用途

使用者從 Viewer 一鍵複製某個任務卡子項的參照，貼給 agent，agent 以 ID 定位，不靠畫面順序或標題。畫面順序會因 priority 排序、狀態改變與文件綁定投影而變動，不能當參照。

## 格式

```text
<scope-id> › <task-id> › <item-id>
```

- scope 與卡片 ID 一併帶上：子項 ID 只在同一張卡內唯一，report CLI 的 `item.update` 也需要 task 與 item 兩個 ID。
- 只帶 ID，不帶標題內容：ID 已足以定位，使用者 2026-10-21 決定不再附標題前段。舊參照尾端的「…」仍可貼進搜尋，標題部分會被忽略。
- 由 `viewer/assets/item-reference.js` 的 `itemReference` 產生。

## 介面

- 預覽模式中，有穩定 ID 的子項顯示一個疊加的複製圖示，不佔版面寬度。只在滑鼠停在該列上或以 Tab 聚焦時顯示；卡片被選取不會讓圖示常駐。
- 圖示固定在列首狀態圓點（○／✓）的左側，位於卡片內距，不蓋住描述、「更多」或其他控制。位置依使用者 2026-10-20 的修正，取代決策選項原寫的「疊在列尾」。
- 子項列本身 `overflow: hidden`，所以編輯模式以外的子項列改為 `position: static`，讓圖示以卡片為定位基準、不被列裁切；拖曳時的放置線仍在該列設 `position: relative`。圖示在透明時也接收指標，從列內往左移到圖示上不會先消失。
- 成功複製後圖示短暫變成綠色 ✓，失敗為 ✕；文字說明放在提示與無障礙標籤。
- 子項被選取時，按選取中子項的圖示會複製全部選取，一行一個；鍵盤以子項本身聚焦並用 Ctrl＋C，圖示不再是 Tab 停點。見 [子項多選](ItemSelection.md)。
- 按下後圖示短暫顯示「已複製」，失敗顯示「無法複製」。先用 Clipboard API，被拒絕時改用選取複製。
- 編輯模式不顯示，避免蓋住輸入欄。任務卡不提供複製，卡片 ID 已顯示在卡片上。
- 舊式文字子項沒有 ID（Viewer 只為顯示產生 `legacy-…` 暫代 ID），不提供複製；需先遷移成具 ID 物件。

## 驗收

- 參照只含三段 ID；舊式子項與缺 scope 時不產生參照。
- Browser：有 ID 的子項平常不顯示圖示、聚焦或滑過時顯示，按下複製出正確參照；舊式子項沒有圖示；描述欄寬度不因此縮小。
- 圖示在狀態圓點左側，與圓點同高，不蓋住「更多」；點擊後顯示 ✓ 並複製該項參照。
