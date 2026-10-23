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
3. **失效即退回。** Next 子項推算為完成、等待中、待使用者或待他驗時，排序與標記效果消失，畫面退回原排序，頂端的下一步退回推算（依優先級與卡片順序取第一個未完成且不等待的子項），並標示「推算」。指標本身不自動清除，誰在何時改掉它留在活動紀錄。
4. **覆盤重設。** `/task-progress-items` 評估的第 0 步：`next` 為空或失效時，agent 依同一推算規則選一個寫入，回報「Next 已設為 …」。原第 3 題「下一個模組怎麼點名」併入：點名的決策子項設為 Next 即可。
5. **寫入路徑。** Report CLI 新增 `next.set`（task_id、item_id）與 `next.clear`，帶 `actor`／`session_id`，記活動；Viewer 在預覽與編輯模式都可設定或取消（預覽模式寫入沿用拖曳換位的先例）。兩邊同一個 revision 檢查；指向不存在的子項時拒絕。
6. **語意色。** 新增第四個語意色 `next`，與完成、受阻、警告同級：自訂佈景不覆蓋。暗色約 `#d4a62a`，亮色約 `#9a6b00`（實作時以 4.5:1 對比核定）。
7. **外觀。** 卡片的 pin 圖示在 Next 卡上以 `next` 色實心顯示（一般釘選維持現狀）；Next 子項那一行左緣 `next` 色色條，加一個 `next` 色「Next」小膠囊。不用整圈外框、不加底色。
8. **隔離同名標籤。** 卡片 Developer 區藍色「Next Step :」改名「後續」，與「後續動作」清單併為一區，改用次要文字色；Checklist 畫面的「下一步 · Agent：…」一行刪除。「Next」與金色只屬於本標記。

## 尚未決定

- **設定 Next 的控制項形狀。** 候選：(a) 子項列滑過時出現的圖示，與「複製參照」同位置，點一下設定、再點取消；(b) 以 IconChoice 的 cycle 模式做兩態（無／Next）；(c) 不在列上放按鈕，由頂端下一步卡片或多選狀態下的動作設定。先看現有元件再定；三者都不碰卡片圖釘。

## 驗收

- 排序：含立即（0）卡時 Next 卡仍在最前；釘選卡在 Next 卡之上；Next 子項在卡內最前；Next 子項完成後兩者回到原位。
- 失效：Next 子項分別為完成、等待中、待使用者時，頂端顯示推算的下一步並標「推算」；`next` 欄位未被改動。
- 寫入：`next.set` 指向不存在的子項被拒；Viewer 設定後 report.json 多出 `next`，活動紀錄有記錄者；重設時舊 Next 消失。
- 外觀：兩種佈景與自訂佈景下 pin 圖示與「Next」膠囊都是 `next` 色且對比達 4.5:1；卡片 Developer 區顯示「後續」，不再出現「Next Step」；Checklist 畫面沒有「下一步 · Agent」一行。
- 覆盤：`next` 為空時執行 `/task-progress-items plan`，agent 寫入 Next 並在回報列出。
