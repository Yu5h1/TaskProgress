# 統一 UI 來源 (One UI Source) Plan

根據 `handoff.md` 與 `report.dev.json` 的最高優先原則：「同一個視覺元素只能有一套實作，且 Svelte 為選定的組合技術 (composition technology)」。

本文件記錄消除目前殘留的三組雙重 UI 控制項實作的計畫，將其完全收斂至獨立的 Svelte 元件，並透過 `ui-host.js` Adapter 供 `app.js` 載入，最後徹底清理舊版 Vanilla JS 的 DOM 繪製邏輯。

---

## 核心準則與設計背景

1. **單一來源原則 (One UI Source)**：
   同一個畫面元素在預覽與編輯模式下，只能有一套 HTML/Markup 實作。
   衝突時由宿主 (Host) 提供資料與 Callback，共用元件負責維持 DOM 結構。

2. **收斂至 Svelte**：
   Svelte 是本專案選定的 UI 組合技術，所有的共用控制項均應實作於獨立的 `.svelte` 元件中。

3. **零設定分岔 (Zero Knobs)**：
   消除任何允許兩邊渲染出不同結果的設定開關或類別，直接收斂至單一寫法。

---

## 需消除的雙重實作控制項

| 控制項名稱 | 舊版 Vanilla JS (刪除標的) | 新版 Svelte (目標單一來源) |
| :--- | :--- | :--- |
| **Mode Toggle** | `editor-surface-runtime.js` 的 `createModeController` | `ModeToggle.svelte` |
| **SaveBar** | `editor-surface-runtime.js` 的 `createSaveBar` | `SaveBar.svelte` |
| **Add Control** | `editor-surface-runtime.js` 的 `createAddControl` | `AddControl.svelte` |

---

## 擬定的修改細節

### 1. 新增 Svelte 共用元件
* `experiments/editor-svelte-spike/src/ModeToggle.svelte`
* `experiments/editor-svelte-spike/src/SaveBar.svelte`
* `experiments/editor-svelte-spike/src/AddControl.svelte`

### 2. 更新 UI Adapter 註冊與打包
* `experiments/editor-svelte-spike/src/viewer-adapter.svelte.js`：註冊 `mode-toggle`、`save-bar` 與 `add-control` 區域。
* 執行 `npm run viewer:ui:build` 生成最新的 `viewer/assets/viewer-ui.js`。

### 3. 宿主 app.js 介面替換
* 修改 `viewer/assets/app.js`，將模式切換、儲存列與新增控制改為透過 `createUiView` 呼叫 Adapter 渲染。

### 4. 刪除 Vanilla 舊實作
* 移除 `viewer/assets/editor-surface-runtime.js` 中的 `createModeController`、`createSaveBar` 與 `createAddControl` 函數定義與導出。

---

## 驗證計畫

1. **單元測試**：執行 `npm test` 確認現有與新增的元件合約測試全數通過。
2. **UI Build 產物編譯**：執行 `npm run viewer:ui:build` 確認產物無誤。
3. **本機 LocalWebService 瀏覽器預覽**：開啟 `http://127.0.0.1:8001/?scope=example` 實測切換模式與儲存列顯示。
