# Editor UI framework decision

## Status

2026-08-02：**Svelte accepted for an isolated parity spike; production migration is not yet accepted.**

這項決策只選定第一個實驗候選，不會讓公開 Viewer 載入框架，也不會移除既有 Demo／Editor Surface。

## Context

TaskProgress 已有 framework-neutral Editor Core、完整 Undo／Redo、共享 Editor Surface 與本機跨檔案 transaction。未完成的人工估算、交付日、敏感歷史與行動版會繼續增加 UI state、表單與錯誤處理，因此需要驗證宣告式元件是否能降低 `app.js`／`time-view.js` 的組合成本。

框架不得取代 Editor Core、report/time Schema、scope capability、revision compare-and-swap 或 transaction。它只能成為 UI projection layer。

## Decision

第一個候選採 Svelte 5 + Vite，理由是元件結構接近目前 HTML-first 介面、可重用既有 CSS token，並能輸出 GitHub Pages／LocalWebService 都能提供的靜態相對路徑資產。

Vue 暫不安裝。原生 Viewer／Demo 是行為基準與回退路徑；只有 Svelte 通過真實資料載入、能力授權、儲存錯誤、focus／鍵盤、桌面及行動版 parity 後，才討論正式切換。

## Implemented spike

`experiments/editor-svelte-spike/` 提供隔離的 `App`、`TaskCard`、`ItemRow`、`DeliveryEditor` 與薄 adapter：

- adapter 直接委派正式 `viewer/assets/editor-core.js`，元件不修改 canonical report object；
- 支援全域預覽／編輯、task title／summary／status／priority、item title／priority、新增、刪除、Undo／Redo、驗證、discard 與記憶體 commit；
- 重用正式 priority policy 與 Viewer CSS，沒有 host identity 分支；
- 只有 scope capability 存在時才建立短生命週期 edit session；token 只留在記憶體，report 與 private time inputs 以雙 revision 及單一 multi-file save 寫入；
- 交付日草稿修改既有 config，人工工時／依據建立新的 active estimate version 並保留 supersedes 關係；缺少 config 時由 edit host 依 session timezone 產生並自行驗證 8/8/8 模板，只有使用者明確按下建立才進入 draft；
- Vite `base: "./"`，建置結果使用相對資產 URL，可放在 GitHub Pages 子路徑。

缺檔 config 初始化接入後，production build 約為 83.92 kB JavaScript（gzip 30.36 kB）與 43.37 kB CSS（gzip 8.43 kB）；CSS 數字包含重用的完整 Viewer stylesheet，不是最終裁切結果。

## Dependency and license policy

- Svelte、Vite 與 Svelte Vite plugin 只列為 repository `devDependencies`；版本由 `package-lock.json` 固定。
- 不提交 `node_modules` 或 spike 的 `dist`。
- 升級依賴前執行完整 Node suite、production build、依賴安全檢查與授權檢查。
- 正式 Editor 若採用 Svelte，必須保留 MIT notices；不從公開 CDN 載入 runtime。

## Verification and next gate

- Node：149/149，包含 Svelte adapter／loader／private time draft／edit-host transport／explicit config initialization 契約。
- Svelte production build：通過，輸出相對資產路徑。
- 建置產物掃描：未出現 `eval`／`new Function`、edit-host capability、private-history 或 Developer overlay 字串。
- npm install audit：0 vulnerabilities。

隔離 Svelte shell 已支援與 Viewer 相同的 `?scope=`／`?report=` 優先規則、report schema 驗證、多任務卡、可選 `time.analysis.json`、期限錯誤隔離及 item/task 工時投影，並以 tracked `reports/example` 驗證真實契約。本機 edit session 在 same-origin／editor-header 驗證後回傳 private config／estimates；新的 multi-file route 以 report／inputs 雙 revision、選擇性檔案 replacement、staged validation、分析與 rollback 完成單次儲存。Svelte 已接上交付日、版本化人工估算及明示的缺檔 config 初始化。下一關不是再做 Vue，而是補敏感歷史，並完成實際瀏覽器 UX／行動版 gate。
