# 可展開說明文字

> Task ID: expandable-text

## 實作契約

卡片說明預設顯示兩行；只有文字超出時才顯示「…更多」。「…」不加底線，只有「更多」加底線，直接接在第二行描述尾端，不另占一行。依實際行高與按鈕寬度截短文字，保留完整字素。按下後顯示全文與「收合」，收合恢復兩行。一般任務卡與指路卡共用實作；編輯模式保留完整 textarea。

實作量小，架構影響限於共用文字元件；新增原生 DOM 模式，驗證包含生命週期測試、Viewer 建置與畫面核查。元件不保存展開狀態，不修改報告資料，不處理 Markdown／HTML。主要 Web 專案的移植留待該專案接入，本輪不修改它。

## 模組邊界

任務卡摘要使用 `lines: 2`，任務卡子項文字使用 `lines: 1`，兩者共用同一個 ExpandableText 控制器與 Svelte 接入層。子項超長時「…更多」接在第一行末尾，展開後可收合；編輯模式仍顯示完整輸入欄位。

- `viewer/assets/expandable-text.js`：原生 DOM 控制器，無套件或 TaskProgress 資料依賴。
- `viewer/assets/expandable-text.css`：必要樣式，類名使用 `expandable-text` 前綴；字型、文字色繼承外層。連結色可用 `--expandable-text-link-color` 覆寫。
- `experiments/editor-svelte-spike/src/ExpandableText.svelte`：薄接入層，使用同一控制器。

移植時攜帶 JS 與 CSS，載入 CSS 後提供空的 host 元素即可。控制器擁有 host 的子節點；呼叫端負責外部字體、寬度、間距及卸載時機。需支援 ResizeObserver 的現代瀏覽器。

```js
import { expandableText } from "./expandable-text.js";

const control = expandableText(host, {
  text: "完整說明文字",
  lines: 2,
  moreLabel: "…更多",
  lessLabel: "收合",
});
control.update({ text: "更新後的說明", lines: 2 });
// 移除宿主前：
control.destroy();
```

`update` 接受完整選項；省略值回預設。文字或行數改變會收合，相同內容更新則保留目前展開狀態。文字用 textContent 寫入；保留換行，長網址可折行。ResizeObserver 與字型載入事件重新量測，卸載取消排程與觀察器。按鈕提供原生鍵盤操作、焦點提示與 aria-expanded。

## 驗收

1. 短文字不出現按鈕，長文字兩行後可展開與收合。
2. 調整寬度、收合再展開卡片、更新文字後，溢出狀態正確。
3. 兩種卡片共用元件；編輯及資料儲存行為不變。
4. 元件可獨立掛載、更新與銷毀，沒有 Report／Svelte 相依。

核查記錄：`checklists/expandable-text.checklist`。
