# 重複功能維護收斂計畫

狀態：2026-08-23 已核准，按順序執行。

本輪要把「同一項行為由多套實作維護」收斂成明確的唯一擁有者，同時保留必要的執行環境邊界。工作規模為大型，架構影響屬系統層級；每一步都以聚焦測試及可檢查的產物證據完成，不在本輪擴張新入口或重新設計介面。

## 系統位置

```text
Report Editor
├─ 正式 Viewer 入口
├─ 共用 Svelte 元件
└─ 共用 persistence owner

Checklist
├─ taskprogress.exe 入口
├─ 共用 Svelte 元件
├─ C#：檔案與伺服器端最終驗證
└─ JavaScript：前端即時互動

Committed UI bundles
├─ Viewer bundle ────────┐
└─ Checklist bundle ─────┴─ 同一套 stale guard
```

## 目標與擁有權

### 1. 退休隔離的 Svelte Spike 應用

`experiments/editor-svelte-spike` 不再保留第二套完整 Report Editor 應用、fixture、資料載入流程與獨立開發入口。正式 Viewer 是 Report Editor 唯一應用入口；現有共用 Svelte 元件及 Viewer／Checklist 的正式建置入口保留。

測試應轉為檢查共用元件與正式入口，不再把已退休的 Spike 應用當成產品實作。

### 2. 讓兩套已提交 bundle 共用 stale guard

CI 必須重新建置並比對下列已提交產物：

- `viewer/assets/viewer-ui.js`
- `src/TaskProgress.Cli/checklist-ui/checklist-ui.js`
- `src/TaskProgress.Cli/checklist-ui/checklist-ui.css`

任一產物與來源不同步都應讓檢查失敗。這是同一個「提交生成物不可過期」政策，不再只保護 Viewer。

### 3. Report Editor 改用共用 persistence owner

所有可寫入介面都由 `persistence-mode.js` 的控制器管理 dirty、排程儲存、Save、Discard、Undo、Redo 與失敗狀態。Report Editor 不再保留另一套平行的儲存狀態機。

已決定的行為如下：

- 預設使用 `auto`；一般離散操作立即排程儲存，文字輸入採 debounce。
- `cautious` 模式保留明確的 Save／Discard；`auto` 模式隱藏這兩個操作。
- Undo／Redo 在兩種模式下都由同一控制器處理。
- 使用者偏好保存於 `task-progress.cautious-mode.v1`。
- 儲存失敗時保留草稿並暫停自動儲存，直到使用者明確重試或後續行為解除失敗狀態。
- 高影響變更仍保留防護：交付日期變更需要預覽／確認，永久刪除維持既有確認流程。

Report 專屬的傳輸與高風險確認可作為邊界 adapter，但不能重新擁有通用 persistence 狀態。

### 4. 建立 Checklist JavaScript／C# 語意同調防線

C# 繼續擁有檔案解析、寫回與伺服器端最終驗證；JavaScript 繼續提供前端即時互動。這是跨執行環境的必要邊界，不強行合併成單一語言實作。

兩端必須共用同一組契約案例，至少涵蓋：

- 狀態推導優先序。
- manual 項目的 pending／passed／failed 轉換。
- failed 必須帶 observed，非 failed 不得殘留 observed。
- agent 項目不可由人工結果流程修改。
- 清除失敗時 observed／resolved 的清理規則。

契約案例有差異時，聚焦測試必須失敗，避免兩端逐步漂移。

## 執行順序

1. 移除隔離 Spike 應用與其專屬入口，保留並驗證共用元件。
2. 擴充 CI bundle stale guard，覆蓋 Viewer 與 Checklist。
3. 將 Report Editor 儲存流程遷移到共用 persistence owner。
4. 加入 JavaScript／C# 共用的 Checklist 語意契約案例。
5. 執行聚焦自動檢查，並保留一次正式 Viewer 的人工互動驗證。

每一步完成後才進入下一步；若發現目前未提交且非本輪產生的檔案，必須避開，不得納入本輪提交。

## 本輪不處理

- 不新增 Web Checklist 入口或 `taskprogress.exe -> Viewer` 入口。
- 不變更 Report 或 Checklist schema。
- 不重新設計 Viewer／Checklist 視覺介面。
- 不合併 HTTP 與 WebView 傳輸 adapter。
- 不執行完整測試套件、發佈流程或批次人工驗證；若需要，另行取得明確確認。
- 不修改本輪開始前已存在且未提交的 `plan.md`、`report.json`、`report.dev.json`、`handoff.md` 與 `.claude/`。

## Acceptance

- 專案不再含可啟動的第二套完整 Svelte Report Editor 應用或其 root script。
- 共用 Svelte 元件仍由正式 Viewer／Checklist 建置與聚焦測試使用。
- CI 能同時發現 Viewer 與 Checklist 已提交 bundle 過期。
- Report Editor 的 dirty、auto／cautious、Save／Discard、Undo／Redo 與失敗狀態由共用 persistence controller 擁有。
- Report 的交付日期與永久刪除防護沒有因遷移而消失。
- JavaScript 與 C# 會對同一份 Checklist 語意案例給出一致結果。
- 所有聚焦檢查通過，人工 Viewer 驗證結果記錄於本輪 `.checklist`。
- 提交內容只包含本輪檔案，不混入開始前既有的未提交工作。
