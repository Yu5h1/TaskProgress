# Editor UI framework decision

## Status

2026-08-12：**Svelte production migration complete; standalone Editor entry retired.**

正式 Viewer 的預覽與編輯已共用同一頁、同一組 Svelte 元件及 framework-neutral Editor Core。`editor.html`、host-only wrapper、專用 build gate 與 edit-host asset route 已退場；公開 Viewer 仍因缺少本機 capability 而保持唯讀。

以下內容保留 2026-08-02 至 2026-08-07 的選型與遷移紀錄；其中雙入口與 iframe 描述是歷史階段，不代表目前架構。

## Context

TaskProgress 已有 framework-neutral Editor Core、完整 Undo／Redo、共享 Editor Surface 與本機跨檔案 transaction。未完成的人工估算、交付日、敏感歷史與行動版會繼續增加 UI state、表單與錯誤處理，因此需要驗證宣告式元件是否能降低 `app.js`／`time-view.js` 的組合成本。

框架不得取代 Editor Core、report/time Schema、scope capability、revision compare-and-swap 或 transaction。它只能成為 UI projection layer。

## Decision

第一個候選採 Svelte 5 + Vite，理由是元件結構接近目前 HTML-first 介面、可重用既有 CSS token，並能輸出 GitHub Pages／LocalWebService 都能提供的靜態相對路徑資產。

Vue 暫不安裝。原生 Viewer／Demo 是行為基準與回退路徑；只有 Svelte 通過真實資料載入、能力授權、儲存錯誤、focus／鍵盤、桌面及行動版 parity 後，才討論正式切換。

## Implemented spike

`experiments/editor-svelte-spike/` 提供隔離的 `App`、`TaskCard`、`ItemRow`、`TimeSettingsEditor` 與薄 adapter：

- adapter 直接委派正式 `viewer/assets/editor-core.js`，元件不修改 canonical report object；
- 支援全域預覽／編輯、task title／summary／status／priority、item title／priority、新增、刪除、Undo／Redo、驗證、discard 與記憶體 commit；
- 重用正式 priority policy 與 Viewer CSS，沒有 host identity 分支；
- 只有 scope capability 存在時才建立短生命週期 edit session；token 只留在記憶體，report 與 private time inputs 以雙 revision 及單一 multi-file save 寫入；
- 交付日草稿修改既有 config，人工工時／依據建立新的 active estimate version 並保留 supersedes 關係；缺少 config 時由 edit host 依 session timezone 產生並自行驗證 8/8/8 模板，只有使用者明確按下建立才進入 draft；
- `TimeSettingsEditor` 將每日分配、工作日、休假／容量例外及交付日放入同一原子 config 草稿；重新計算可預覽交付日或容量單獨變更，全域儲存仍走既有 multi-file transaction；
- 容量例外的公開說明可以編輯，既有私人理由只保留、不顯示也不修改；待遮蔽歷史契約擴充後才考慮開放敏感欄位。
- 交付日變更要求修改原因；client 不產生歷史值或指紋，edit host 依 canonical before／after 建立遮蔽事件並將私有歷史加入同一 rollback transaction；
- 交付日風險預覽以同一 session 的 report／config／estimates 草稿在 OS 暫存目錄執行正式分析器，不碰 canonical files；Svelte 顯示前後期限、風險與容量差異，只有敏感交付日變更會在全域儲存前開啟 native confirmation dialog；
- Vite `base: "./"`，建置結果使用相對資產 URL，可放在 GitHub Pages 子路徑。
- 歷史階段曾由同一建置產生 host-only `editor.html`；同頁 Viewer 完成後，此入口及 capability URL 已退場。

正式 Host 路徑解析接入後，共用 App chunk 約為 93.19 kB JavaScript（gzip 33.50 kB）與 46.56 kB CSS（gzip 8.91 kB），兩個入口 wrapper 各小於 0.2 kB；CSS 數字包含重用的完整 Viewer stylesheet，不是最終裁切結果。

## Dependency and license policy

- Svelte、Vite 與 Svelte Vite plugin 只列為 repository `devDependencies`；版本由 `package-lock.json` 固定。
- 不提交 `node_modules` 或 spike 的 `dist`。
- `BuildEditor.cmd` 的正式路徑先執行 `npm ci`，再建立並驗證雙入口；`Publish.cmd` 必須先通過這個 gate 才能執行 Launcher publish。開發者只有在依賴已由其他鎖定流程安裝時可暫時以 `TASK_PROGRESS_SKIP_NPM_CI=1` 驗證，不得用於正式發布。
- build verifier 拒絕遠端／絕對資產、動態程式建構、敏感本機檔名與編譯時本機絕對路徑。Editor `dist/` 位於 `experiments/` 且被忽略；docs sparse checkout 與通知 workflow 只涵蓋 `viewer/`，Pages artifact 不包含 Editor framework。
- 升級依賴前執行完整 Node suite、production build、依賴安全檢查與授權檢查。
- 正式 Editor 若採用 Svelte，必須保留 MIT notices；不從公開 CDN 載入 runtime。

## Verification and next gate

- Node：157/157，包含 Svelte adapter／loader、原子 time-settings draft、capacity-only preview、private time draft、preview transport、config initialization，以及本機 build／Publish／Pages 隔離契約。
- Python edit host：26/26，包含缺少 build 時保留 legacy editor capability、暫存目錄預覽不修改 canonical files、session 保留、遮蔽歷史、首次 analysis 路由註冊與 transaction rollback。
- Svelte production build：通過，輸出相對資產路徑。
- `BuildEditor.cmd`：正式 `npm ci` 與跳過重裝的已鎖定依賴路徑均通過；Release .NET Launcher real integration 通過。本段沒有執行 publish。
- 建置產物掃描：未出現 `eval`／`new Function`、edit-host capability、private-history 或 Developer overlay 字串。
- npm install audit：0 vulnerabilities。
- 隔離瀏覽器 gate：暫存實檔的桌面與 390px 流程通過；確認視窗預設聚焦 `返回修改`、Escape 可返回且保留草稿，確認儲存產生遮蔽歷史；分析失敗與來源 revision 衝突均保留草稿，390px 無水平溢位且固定 SaveBar 對齊內容面板，console 無 warning／error。此 gate 使用確定性 QA analyzer adapter，不取代正式 Viewer Host 的正式分析器端對端驗證。
- 正式 Host／分析器 gate：隔離真實 TaskProgress edit host 搭配發布版 analyzer executable，通過 Viewer 導向、host-only report 解析、8/8/8 config 初始化、preview、人工確認、multi-file save、遮蔽歷史、首次 analysis exact-route 註冊及 reload 工時投影；console 無 warning／error，正式資料與既有服務未變更。

Svelte shell 已支援真實 report/time 契約、受保護 edit session、統一時間設定、版本化人工估算、遮蔽修改原因、風險預覽及儲存確認。2026-08-04 起，本機 Viewer 是唯一入口：Svelte Editor 以同源全 viewport frame 在原 URL 內啟動，取消回到 Viewer，儲存後於同一入口 reload；公開 Pages 仍沒有此能力。這只是低風險的導航收斂層，並非最終 UI 架構。下一關是把 Viewer 預覽的頁首、進度摘要、狀態篩選與 TaskCard 逐區移入同一 Svelte App，最後移除 frame 邊界，使預覽／編輯只切換元件 state。Demo 只保留 fixture adapter，不再發展獨立 UX。
