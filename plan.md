# 任務進展系統計畫

> 狀態：核心 MVP 已實作；時間參考擴充完成初步設計，尚未實作。

## 定位

任務進展系統用來整理並顯示不同專案或 Agent scope 的任務狀態。它應可套用於 `Yu5h1Lib\.agents`、`Yu5h1Lib\Unity\.agents` 與其他 UnityProject，而不綁定單一 repository、單一目錄名稱或 GitHub。

系統的核心是共用資料格式與顯示方式。HTML 是供人閱讀的 View，不是 Agent 狀態的唯一來源；各 scope 的 `tasks.md` 負責把 tracked task 導向 canonical entry，`handoff.md`、plan、實作與驗證結果則提供報告事實。

## 命名

| 用途 | 名稱 |
|---|---|
| 產品與 repository 工作名 | `TaskProgress` |
| Web 顯示元件 | `TaskProgress Viewer` |
| HTML 入口 | `TaskProgressViewer.html`（部署時可為 `index.html`） |
| 本機 CLI / Launcher | `task-progress` |
| 觀看者資料 | `report.json` |
| 開發者擴充資料 | `report.dev.json` |

以上名稱先作為正式實作名稱。若未來公開成為通用 package，再評估 `task-progress` 是否需要更具識別性的發佈名稱。

## 已確定的產品方向

- 支援多個彼此獨立的專案與 scope。
- 一個產品包含 Viewer 與 CLI/Launcher 兩個元件，但兩者共用同一套 Viewer 原始碼與 JSON schema。
- Viewer 是唯讀報告介面；UI 會依觀看需求持續調整，不應反過來綁死資料來源格式。
- 主要 UX 採 link-first：公開報告使用可分享 URL，本機報告使用捷徑一鍵開啟，不以選擇檔案作為正常流程。
- 每個 scope 只保存資料，不複製 Viewer HTML。
- `report.json` 提供觀看者所需的基本進展；`report.dev.json` 是選用的開發者擴充。
- `done` 與 `archive` 分開：完成不等於退出日常 View，封存也不刪除歷史。
- GitHub Pages 可託管同一套 Viewer 與選擇公開的 `report.json`。
- 沒有 GitHub remote 的本機專案仍可透過 `task-progress` 完整使用。
- GitHub Projects、Backlog.md 或其他任務系統未來可成為 Adapter，不是核心前提。

## 架構

```text
同一份 TaskProgress Viewer source
├─ GitHub Pages
│    └─ Link → Viewer → 公開 report.json
└─ task-progress CLI
     └─ Windows 捷徑 → localhost Viewer → 本機 report.json + report.dev.json
```

線上與本機模式只更換資料取得方式，不重新開發 UI。

### GitHub Pages 模式

```text
https://<user>.github.io/task-progress/?scope=project-a
```

或：

```text
https://<user>.github.io/task-progress/
  ?report=reports/project-a/report.json
```

Viewer 根據連結自動讀取資料，不顯示檔案選擇器。只有確認可公開的資料才能部署至 Pages；`report.dev.json` 預設不發布。

### 本機捷徑模式

概念命令：

```text
task-progress open
  --report "C:\ProjectA\.agents\report.json"
  --dev "C:\ProjectA\.agents\report.dev.json"
```

CLI 啟動只綁定 loopback 的短期本機 server，提供同一套 Viewer 與指定資料，再自動開啟瀏覽器。每個專案可用 `.lnk` 保存命令與路徑；不需要 `ProjectA.html`。

## 兩層報告資料

### `report.json`：觀看者報告

用來顯示：

- scope 與報告名稱。
- 任務標題、簡短摘要與目前狀態。
- 已完成與尚未完成的工作。
- 明確存在子任務時的完成數量。
- 最後更新時間。

第一版最小欄位：

| 欄位 | 用途 |
|---|---|
| `schema_version` | 驗證資料與 Viewer 相容性 |
| `report_id` | 配對基本報告與開發者資料 |
| `scope_id` | 區分 Yu5h1Lib、Unity scope 或其他專案 |
| `title` | 報告名稱 |
| `updated_at` | 資料最後更新時間 |
| `tasks` | 觀看者可見的任務集合 |

觀看者任務至少包含穩定 `id`、`title`、`status` 與 `summary`。沒有明確分母時不產生虛假百分比。

### `report.dev.json`：開發者擴充

透過相同的 `report_id` 與 task `id`，為觀看者已存在的任務補充：

- 一個或多個 next steps。
- 預先討論的開發決策與來源 reference。
- 尚未完成的候選路線、相依關係與排除原因。
- 阻塞與待決事項。
- Agent claim、worktree 與內部來源位置。

`next step` 可能包含有價值的設計結果，因此完整決策不能只存在於容易被覆蓋的短文字欄位。plan 或其他決策來源保存完整內容，Developer Report 保存摘要與 reference，Viewer 將兩者整理成可讀內容。

### 合併規則

- `schema_version` 必須相容。
- `report_id` 必須一致。
- task 使用穩定 `id` 配對。
- Developer Report 主要增加細節，不任意覆蓋觀看者標題與狀態。
- 找不到對應 task 時顯示診斷，不猜測。
- 缺少 `report.dev.json` 時，觀看者功能仍完整可用。

## 現成工具評估結論

Backlog.md 已提供 Agent-friendly Markdown tasks、CLI、JSON 與本機 Web board，但它的可編輯任務管理流程不符合目前個人工作習慣，也不等同於供他人透過公開 Link 觀看、且 UI 可獨立持續演化的報告產品。因此第一版不採用 Backlog.md 作為核心；未來若有需要，可透過 Adapter 讀取其輸出。

本產品的核心價值放在：

- 觀看者與開發者資料分層。
- Pages 與本機捷徑共用同一介面。
- 公開 Link 與唯讀報告體驗。
- 可持續調整的 Viewer UI。
- 透過 `tasks.md` 找到 canonical entry，再與 `handoff.md`、plans、實作或其他事實來源整合。

## 分階段計畫

### Phase 1：Schema 與範例資料

- 定義 `report.json` 與 `report.dev.json` schema。
- 建立相同 `report_id`、task id 的最小配對範例。
- 驗證缺少 Developer Report、版本不符、孤立 task 等錯誤情境。

完成條件：同一份格式能表達 Yu5h1Lib scope 與另一個 UnityProject。

### Phase 2：Link-first Viewer MVP

- 實作 `TaskProgressViewer.html` 與必要 assets。
- 支援 `?report=` 自動載入基本報告。
- 支援選用的 `?dev=` 開發者擴充。
- 顯示進展、已完成、尚未完成與更新時間。
- Developer 資料存在時才顯示 next steps、決策、路線與內部資訊。
- 保持 Viewer 唯讀，並讓 UI 元件可持續迭代。

完成條件：透過一個 URL 直接開啟報告，不要求使用者選擇檔案。

### Phase 3：本機 `task-progress` Launcher

- 接收基本與 Developer JSON 的絕對路徑。
- 驗證檔案存在與 schema 相容性。
- 啟動 loopback、短生命週期的本機 server。
- 自動開啟同一套 Viewer。
- 支援 Windows `.lnk` 一鍵啟動。

完成條件：雙擊專案捷徑後直接看到對應報告，沒有選檔步驟，也不需每個專案放 HTML。

### Phase 4：GitHub Pages 與公開報告

- 將 Viewer 靜態產物部署至 Pages。
- 以 `reports/<scope-id>/report.json` 提供選擇公開的報告。
- 支援 `?scope=` 簡短連結或穩定的 `?report=` 相對 URL。
- 避免將 Developer Report、絕對路徑或內部資料發布到公開 Pages。

### Phase 5：來源 Adapters 與 Agent 工作流

- 使用 `tasks.md` 解析 tracked task ID、ownership 與 canonical entry，再從 `handoff.md`、plan、repository state 或既有 JSON 產生報告。
- 將不同來源轉成兩層報告格式。
- 對無法可靠解析的自由格式內容顯示明確診斷，不猜測狀態。
- 視需要加入 Git、worktree、GitHub Projects 或 Backlog.md Adapter。
- 穩定後將 Agent 操作方式整理成共用 skill。

## 新工作區的第一個實作順序

1. 建立獨立 `TaskProgress` workspace/repository。
2. 新增兩份 JSON schema 與最小範例。
3. 實作只讀 Viewer，先完成 `?report=`。
4. 加入 `report.dev.json` overlay 與 Developer View。
5. 實作 `task-progress open` 與 localhost 啟動。
6. 建立一個 Windows 捷徑驗證本機 link-first UX。
7. 最後再部署 GitHub Pages。

## 驗收原則

- Pages 報告可以由可分享 Link 直接開啟，不出現正常流程不需要的選擇器。
- 本機報告可以由捷徑直接開啟，不要求每個專案保存 HTML。
- Pages 與 localhost 使用同一份 Viewer 原始碼。
- 只載入 `report.json` 時呈現完整觀看者模式。
- 載入相容 `report.dev.json` 後才顯示開發者資訊。
- Developer Report 不會因隱藏 UI 而誤被視為具有存取控制；不應公開的檔案不得部署。
- 報告資料可追溯至原始來源，且指出最後更新時間。
- `done` 與 `archive` 不混為同一狀態。
- 沒有明確子任務時不產生虛假完成百分比。
- 資料缺失或不相容時提供可理解的診斷。
- 第一版不要求背景服務長時間運行。

## 尚待實作時決定

1. `task-progress` 使用 PowerShell、.NET CLI 或其他實作方式。
2. localhost server 的 port、session token、安全 allowlist 與結束條件。
3. JSON 是 Agent 直接維護的原始狀態，還是由既有 plan/handoff 產生的 snapshot。
4. `?scope=` 的索引資料放置方式與跨 scope 總覽是否進入第一版。
5. Viewer 第一版的視覺層級、卡片／列表形式與行動裝置支援程度。

## 人類任務編輯器擴充計畫

### 目標與邊界

編輯器的目標是讓人類與 Agent 共同維護任務，但不把 Viewer、Agent 協調檔與 Git 工作流混成同一層。公開 Pages 維持唯讀；只有由 localhost Launcher 開啟、且取得目前 scope 寫入能力的工作階段，才能進入編輯器。

第一版編輯範圍限定為：

- `report.json`：任務的公開欄位、狀態與工作項目。
- `report.dev.json`：next step、blocker、decision、route 等進階開發資訊。
- `tasks.md`：只維護 task id、canonical entry 與 routing note，不保存進度快照。

`handoff.md`、plan 與 canonical entry 仍由既有 Agent／人工文件流程維護。編輯器可顯示它們的連結與衝突提示，但第一版不直接改寫任意 Markdown 內容，也不把 `report.dev.json` 的 claim 當成即時鎖定來源。

### 介面決策

主頁頂端新增兩個同層 Tab：`進度總覽` 與 `任務編輯器`。第一版採獨立編輯器 Tab，不在 Viewer 卡片上全面切換原地編輯模式，原因是讀取與寫入權限、未儲存狀態、驗證錯誤和 Git 衝突都需要清楚的操作邊界。日後可在 Viewer 加入「快速修改狀態」入口，但仍導向同一套編輯交易。

公開模式不顯示編輯 Tab；本機服務沒有有效 edit capability 時也只顯示 Viewer。編輯器建議使用主從式版面：

- 左側：任務搜尋、狀態篩選、排序、新增任務，以及未儲存／衝突標記。
- 右側：目前任務表單、任務項目清單、Developer 資訊與 Routing 進階區。
- 頂端固定列：目前 scope、Git 保護狀態、其他來源已變更提示、復原、放棄與儲存。
- 行動裝置：先顯示任務清單，選取後進入單一任務編輯頁，避免雙欄壓縮。

表單採明確儲存，不因每次輸入立即改寫檔案；尚未儲存的內容可暫存在目前瀏覽器，僅用於頁面重載或瀏覽器意外關閉後恢復草稿，不作為正式歷史紀錄。

### 資料角色與寫入規則

| 資料 | 人類可編輯內容 | 寫入規則 |
|---|---|---|
| `report.json` | task title、status、summary、task items、顯示順序 | 所有觀看者欄位的主要編輯入口；儲存時更新 `updated_at` |
| `report.dev.json` | next step、blockers、decisions、routes | 收在「開發資訊」區；沒有內容時不必建立 overlay task |
| `tasks.md` | task id、canonical entry、routing note | 只有新增、改名、移除路由或修改 canonical entry 時才更新；一般進度與 item 變更不得觸碰 |

一次「儲存」可能同時產生三個檔案的變更，必須視為單一交易：先在記憶體中產生結果、驗證 schema 與跨檔案關係，再以暫存檔和 replace 寫入；其中任一檔案失敗時，不得留下半套結果。

### 任務編輯需求

每個 task 需要支援：

1. **新增任務**：輸入 title 後產生建議 id；正式儲存前檢查 scope 內唯一性。建立 tracked task 時可同時填 canonical entry 與 routing note。
2. **編輯基本欄位**：title、summary、status 與顯示順序。狀態維持 `planned`、`in_progress`、`blocked`、`done`、`archive`。
3. **穩定識別**：task id 第一次儲存後預設唯讀。改 id 是進階操作，必須預覽並同步遷移 `report.dev.json` 和 `tasks.md` 的對應 id。
4. **狀態保護**：仍有 pending item 時把 task 設為 `done` 要警告；所有 item 完成時只提示是否把 task 設為 `done`，不自動改狀態。
5. **封存優先**：一般移除使用 `archive`。永久刪除需二次確認，顯示會受影響的公開資料、Developer overlay 與 routing row，且只能在 Git checkpoint 可建立時執行。
6. **Developer 資訊**：next step 使用單一主要欄位；blockers、decisions 與 candidate／selected／rejected routes 使用可增刪、排序的結構化輸入。claim 僅顯示「可能有 Agent 正在處理」的提醒，不作為阻止儲存的唯一依據。
7. **Routing 資訊**：顯示 task 是否存在對應 `tasks.md` row、canonical entry 是否可解析。普通使用者可選擇既有路徑；直接輸入任意路徑與修改 routing note 放在進階區。
8. **即時驗證**：顯示必填、長度、id 格式、重複 id、Developer report 配對與孤立 overlay 錯誤；錯誤要定位到欄位，不只顯示原始 JSON 訊息。

### 任務項目編輯需求

目前 schema 將 `completed_items` 與 `pending_items` 保存為純字串陣列。這足以顯示，但無法可靠判斷兩個人或 Agent 編輯的是不是同一個 item，也不利於重新命名、排序和三方合併。正式開放共同編輯前，應先提供具有穩定 item id 的新版資料模型，例如：

```json
{
  "id": "validate-local-launch",
  "title": "驗證本機啟動流程",
  "state": "pending"
}
```

Viewer 在過渡期同時讀取舊字串陣列與新版 items；舊報告只有在使用者預覽並確認遷移後才改寫，避免開啟編輯器就產生大面積 diff。

每個 task item 需要支援：

1. **快速新增**：單筆新增，以及貼上多行後拆成多筆；空白與完全重複項目要提示。
2. **文字編輯**：直接修改 title，保留穩定 id，不因改字造成刪除加新增。
3. **完成切換**：勾選 pending／done；切換只改 state，不移除 item。
4. **排序與移動**：鍵盤按鈕與拖曳排序；跨 task 移動需顯示來源與目的 task，並保留 item id。
5. **刪除與復原**：刪除先進入本次編輯交易的可復原狀態；儲存後由 Git 歷史復原，不另建永久垃圾桶。
6. **批次操作**：批次完成、改為 pending、移動與刪除；大於一筆的刪除需確認數量。
7. **進度推導**：存在 items 時，由非封存 items 自動計算 completed／total，使用者不另填一份可能不一致的 progress。沒有 item 時維持「無明確分母」，不製造百分比。
8. **併發合併**：不同 item id 的修改可自動合併；同一 item 的文字、state 或刪除同時被修改時，必須逐項讓使用者選擇本地版、外部版或手動合併。

### Agent 與人類同時編輯

編輯器不依賴長時間檔案鎖，而採 optimistic concurrency：

1. 載入時記住 `report.json`、`report.dev.json`、`tasks.md` 的內容雜湊與 Git revision。
2. 儲存前由本機服務重新讀取三個檔案；雜湊一致才可直接寫入。
3. 若 Agent 或其他編輯器已改檔，先依 task id 與 item id 做三方合併；不能安全合併時停止寫入並顯示欄位級 diff。
4. 使用者解決衝突後，以最新內容為新 base 再送出一次完整交易。
5. 儲存 API 只能改 Launcher 已登記 scope 的精確檔案，必須驗證 localhost origin、短期 edit capability、schema 和允許路徑；GitHub Pages 不提供任何寫入端點。

這套規則也涵蓋未透過編輯器、由 Agent 直接修改檔案的情況。Developer Report 中的 claim 可以提供人類判斷，但真正避免覆蓋的是雜湊、穩定 id 與三方合併。

### Git 紀錄與意外復原

採 **Git-first，不另建長期變更紀錄資料庫**。Git 要能承擔安全紀錄，必須同時符合：

- 三個受管檔案已被 Git 追蹤，且至少存在一個 baseline commit。
- 每次成功儲存都建立一個 checkpoint commit，只 stage 本次實際變更的受管檔案，不夾帶 repository 內其他修改。
- commit message 包含 scope、task id 與人類可讀摘要；可加入 editor actor／change id trailer 供日後辨識。
- 若受管檔案在編輯器載入前就有未提交修改，先顯示差異並要求處理，不得靜默納入人類的 checkpoint。
- Git commit 失敗時，這次操作不得顯示為「已受保護」；介面保留草稿與清楚的修復方式。

目前 TaskProgress repository 尚無任何 commit，且現有檔案都未追蹤，因此此刻 Git 尚不能提供復原保障。正式啟用寫入前需要先建立 baseline。對沒有 Git、檔案未追蹤或無 baseline 的 scope，第一版預設只讀；若未來允許寫入，才需要另設明確 opt-in 的本機 snapshot fallback。

編輯器需提供：

- 查看最近 checkpoint 的時間、作者、摘要與逐欄差異。
- 復原單一 task 或 item，不使用整個 repository reset。
- 「復原上次儲存」以新 commit 記錄反向變更，保留完整歷史。
- 未儲存草稿恢復；草稿只處理瀏覽器／頁面意外，不取代 Git。

### 分階段實作

#### Editor Phase 1：契約與安全基礎

- 決定新版 item schema、舊資料相容與明確遷移流程。
- 定義三檔案 transaction、雜湊 precondition、欄位級 patch 與錯誤格式。
- 建立 baseline／tracked file／dirty managed file 的 Git preflight。
- 增加跨檔案驗證測試，但尚不開放寫入 UI。

#### Editor Phase 2：任務與項目 MVP

- 新增頂端 `任務編輯器` Tab 與本機 capability 判斷。
- 完成 task 新增、基本欄位、狀態、archive、item 新增／編輯／完成／排序／刪除。
- 加入表單驗證、未儲存提示、瀏覽器草稿與儲存前 diff。
- 儲存時原子更新 `report.json`，必要時同步既有 Developer overlay。

#### Editor Phase 3：Developer 與 Routing

- 加入 next step、blocker、decision、route 的結構化編輯。
- 加入 `tasks.md` route 建立、遷移與移除，保持既有章節和人工文字不被重新格式化。
- 支援 task id 改名的跨檔案預覽與交易。

#### Editor Phase 4：Git 與共同編輯

- 每次儲存建立精確 checkpoint commit，提供 history、diff 和單一 task／item 復原。
- 實作外部變更偵測、可安全自動合併與欄位級衝突處理。
- 驗證 Agent 直接改檔、人類仍在編輯、commit 失敗、服務中斷和多檔案寫入失敗等情境。

### MVP 驗收條件

- 公開 Pages 永遠無法進入寫入模式；本機無 capability 時也維持唯讀。
- 人類可在不接觸 JSON／Markdown 語法的情況下新增與編輯 task、切換狀態並整理 task items。
- 普通 item 變更不會改寫 `tasks.md`；task identity 或 canonical route 變更才會更新 routing row。
- 任何儲存前都能看到變更摘要；schema 或跨檔案關係錯誤時不寫入任何檔案。
- Agent 在人類編輯期間改檔時，不會被最後寫入者靜默覆蓋。
- 已儲存的誤刪可以從 Git UI 復原為一個新的 checkpoint，且不影響其他 repository 檔案。
- `report.json`、`report.dev.json` 與 `tasks.md` 的人工既有排版／非目標內容不因一次小修改而被全面重寫。

### 實作前需確認的產品選擇

1. checkpoint 預設直接建立在目前 branch，或使用 TaskProgress 專用 history branch；建議第一版直接提交目前 branch，行為最透明且 Git 工具都看得到。
2. 新增 task 時是否強制提供 canonical entry；建議允許先建立未路由的 draft task，但標記為「尚未追蹤」，正式進入 `in_progress` 前必須完成 routing。
3. 是否接受先升級 item schema 再做編輯 UI；建議接受，否則只能安全支援單一寫入者，無法完整處理 Agent 與人類同時編輯。

## 時間參考擴充計畫

### 目標與定位

時間參考用來回答三個不同問題：一段期間內理論上有多少時間可使用、實際投入了多少時間，以及依現有證據判斷任務是否能在限制內完成。三者必須分開保存，避免把每日 8 小時工作上限、實際專注時間與預測完成時間混成同一個數字。

TaskProgress 仍是唯讀報告與分析介面，不直接成為行事曆或計時器。原始時間資料由 Agent、Adapter、人工紀錄或其他工具提供；Viewer 顯示整理後的快照、依據與診斷。

核心原則是「限制描述可用容量、事件保存實際證據、公式產生可重算結果、AI 處理尚未形式化的判斷」。隨著分析規則逐漸明確，已穩定的判斷應移入具版本的公式，縮小 AI 需要解讀的範圍。

### 兩類主要因素

#### 既定時間與容量限制

既定時間表示在工作開始前就已知的限制或預算，包括：

- 每日固定分配，例如 8 小時睡眠、8 小時生活、最多 8 小時工作。
- 任務截止日期、可開始日期與不可使用的日期或時段。
- 已承諾給其他任務的時間。
- 臨時例外，例如休假、就醫、外出或某日額外可工作時間。
- 任務本身的 timebox；例如只允許投入 4 小時研究，不等同於要求 4 小時後必須完成。

8／8／8 是容量規則，不是產能保證。每日最多 8 小時工作只代表可排程上限；其中仍可能包含切換成本、溝通、等待與低專注時段。第一版先保留「可排程工作容量」與「實際有效投入」兩個數值，日後再由紀錄校正兩者的關係。

時間限制至少區分：

| 限制 | 語意 |
|---|---|
| `deadline` | 必須或期望完成的日期／時間 |
| `not_before` | 在此之前不能或不應開始 |
| `work_cap` | 一段期間可分配給工作的最大容量 |
| `timebox` | 此任務允許投入的最大工作量 |
| `commitment` | 已被其他任務占用的容量 |

`deadline` 應標示 `hard` 或 `soft`。只有日期意義的期限保存為日期，不虛構成當天某個精確時刻。

#### 實際運作時間紀錄

實際紀錄描述已經發生的事情，至少包含：

- 任務建立、開始、暫停、恢復、完成與封存。
- 一段工作 session 的開始與結束。
- 狀態、截止日期或預估的修改。
- 阻塞開始、解除及等待外部回應的期間。
- 紀錄來源與紀錄時間，區分事件發生時間與事後補登時間。

「從開始到現在的日曆時間」與「實際投入的工作時間」分開計算。任務開始三天不代表投入三天；Agent claim 存在多久也不能直接當成有效工作時間。

實際紀錄以不可變事件為優先，而不是不斷覆寫單一累計值。概念事件格式包含穩定 event id、task id、事件種類、`occurred_at`、`recorded_at`、來源與事件資料。若日後需要修正舊紀錄，新增更正事件並保留原始證據。

### 資料分層

時間資料依公開程度與用途分成四層：

1. **容量與限制來源**：保存時區、每日時間預算、週期規則、例外日與硬／軟限制。這可能包含個人作息，預設只保存在本機。
2. **事件紀錄來源**：保存工作 session、狀態轉換、阻塞與預估修訂，作為分析的主要證據。
3. **分析快照**：由固定的 `as_of` 時間計算容量、投入、偏差、風險與預測範圍；結果附帶公式或分析版本。
4. **Viewer 投影**：`report.json` 只包含可公開的任務時間事實與簡要結果；`report.dev.json` 才包含內部預估、假設、信心、證據 reference 與較完整診斷。

容量與事件來源可先採獨立 sidecar，暫定概念名稱為 `time.context.json` 與 `time.events.json`，最終檔名在 schema 設計階段決定。這些來源不應因 Viewer 未顯示就被誤認為可公開。

觀看者任務未來可選擇性呈現開始時間、最後活動、目標日期、經過時間與是否超期。個人睡眠／生活分配、逐段工作紀錄及 AI 內部分析預設不進入公開報告。

### 第一版評估公式

第一版只實作能由明確資料重算的結果。所有結果都以分析快照的 `as_of` 為基準，避免同一份報告在不同時間得到無法追溯的結果。

```text
每日可排程工作容量
  = 24 小時
  - 睡眠預算
  - 生活預算
  - 其他固定不可工作時間

期限前剩餘容量
  = 各日可排程工作容量與例外調整的總和
  - 已承諾容量
  - 保留緩衝

實際投入時間
  = 所有有效工作 session 的時間總和
  - 明確記錄的暫停時間

日曆經過時間
  = 完成時間或 as_of
  - 開始時間

容量負載率
  = 預估剩餘工作量
  / 期限前剩餘容量
```

容量負載率小於或等於 1 只表示在目前假設下容量足夠，不保證能完成；大於 1 則表示現有計畫已明確超載。未知資料不得以 0 代替，應標示為資料不足。

第一版可另外提供：

- 距離截止日期的剩餘日曆時間。
- 最後活動距今多久及可能停滯的提示。
- 已完成任務的 cycle time 與實際投入時間。
- 初始／最近預估和實際投入的差異。
- 阻塞與等待時間，但不將其算成有效投入時間。

任務的數量進度不能直接換算時間進度。現有子項目可能大小不同，因此不使用「已花時間除以完成百分比」來推算完工時間。

### AI 分析與公式收斂

AI 適合先處理尚未能用固定公式表達的因素，例如任務複雜度、未知風險、依賴關係、上下文切換、描述中的隱含工作，以及多種排程方案的取捨。AI 不直接改寫原始事件，也不能把沒有證據的推測標成事實。

每次 AI 分析至少輸出：

- 分析的 `as_of`、輸入範圍與 reference。
- 使用的假設與缺少的資料。
- 結果範圍，而不是只給單一精確時間。
- 信心等級與主要風險。
- 使用的分析規則或模型版本。
- 哪些結果來自固定公式，哪些仍是 AI 判斷。

演進方式採逐步收斂：

1. AI 從完整任務描述、限制與事件中提出分析。
2. 重複出現且可驗證的判斷整理成具名稱與版本的公式。
3. 公式直接處理穩定部分，AI 只接收公式結果、例外與未結構化因素。
4. 將預測與後來的實際結果比較，校正公式、任務分類與信心範圍。
5. 保留舊版分析的版本與依據，使算法改善不會改寫歷史結論。

當相似任務累積足夠歷史資料後，才評估 rolling median、P50／P80 cycle time 或 Monte Carlo 等預測方式。樣本不足時應明確顯示資料不足，先使用人工區間與 AI 風險分析，不產生看似精準的完成日期。

### 隱私、時間語意與驗證

- 所有 date-time 使用含 UTC offset 的 ISO 8601；scope 另外保存 IANA 時區，例如 `Asia/Taipei`，供每日容量與日期界線計算。
- 工作用量以整數分鐘保存，避免浮點小時；純日期限制與精確時間點分開。
- `created_at <= started_at <= completed_at`；不完整或重疊 session 必須產生診斷。
- 未知值省略或明確標示 unknown，不以零或目前時間猜測。
- 預估修改保留修訂紀錄，不覆蓋初始預估。
- 個人作息、逐段活動及內部效率分析預設為 Developer／本機資料。
- 公開報告只能使用明確允許的摘要，不得從內部時間資料自動洩漏個人生活模式。

### 分階段實作

#### Time Phase 1：語意與 Schema

- 定義容量、限制、事件、session、預估與分析快照的 schema。
- 決定 sidecar 的正式檔名及其與 `report_id`、task id 的配對規則。
- 為正常工作日、8／8／8、例外日、硬期限、soft target、timebox 與未知資料建立範例。
- 定義 schema 版本升級與舊 Viewer 的相容策略。

完成條件：同一套資料能分別表達「最多可排 8 小時」、「實際工作 4.5 小時」及「AI 判斷仍需 6 至 10 小時」，且三者不互相覆蓋。

#### Time Phase 2：紀錄與確定性分析

- 先支援人工或 Agent 寫入事件，不急著建立完整計時器 UI。
- 實作 session 驗證、容量計算、期限前剩餘容量、實際投入與負載率。
- 將結果輸出為帶 `as_of`、輸入 reference 與算法版本的快照。
- 建立跨時區、跨午夜、未關閉 session、重疊 session 與事後補登測試。

完成條件：對同一份輸入與同一個 `as_of`，分析結果可重現且不依賴 AI。

#### Time Phase 3：Viewer 時間參考

- 公開 View 顯示安全的開始、目標、最後活動、經過時間與超期狀態。
- Developer View 顯示容量、投入、預估範圍、信心、假設與資料不足診斷。
- 不以時間條取代現有工作項目進度，也不將兩者混成單一百分比。
- 讓使用者能追溯分析結果所使用的資料時間與方法版本。

完成條件：觀看者能理解何時開始、何時受限與目前風險；開發者能看見計算依據。

#### Time Phase 4：AI 分析迴圈

- 定義 AI 可讀的最小分析輸入，避免每次讀取所有原始內容。
- 要求 AI 區分事實、公式結果、假設與推測。
- 保存預測範圍與最終實際結果，建立回測資料。
- 將已穩定的 AI 判斷逐步移入版本化公式與規則。

完成條件：算法改善後，AI 分析範圍比前一版更小且可說明；舊結果仍可依其版本追溯。

#### Time Phase 5：歷史校正與預測

- 依任務類型、大小或其他可驗證特徵分組，避免混用不可比較的歷史樣本。
- 比較預估、可用容量、實際投入、日曆經過與完成結果。
- 在樣本量與品質足夠時提供 P50／P80 或模擬結果。
- 持續檢查預測誤差與校準程度，必要時退回資料不足狀態。

完成條件：預測顯示範圍、信心、樣本基礎與版本，不只顯示單一日期。

### 尚待決定

1. 8／8／8 是全域預設、使用者 profile，還是每個 scope 可覆寫的規則。
2. 「生活 8 小時」是否包含固定行程，或固定行程要作為另一類扣除項目。
3. 工作 session 由 Agent 自動產生、人工確認，或整合外部工具；自動紀錄的可信度如何標示。
4. 任務的剩餘工作量使用單點、三點估算，或一律使用範圍。
5. 哪些時間摘要可進入公開 `report.json`，以及是否允許 scope 個別設定公開政策。
6. 第一版的停滯門檻與保留緩衝採固定設定，還是只顯示原始數值不做判斷。
