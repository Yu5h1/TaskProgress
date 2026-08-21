# 任務進展系統計畫

> 狀態：核心 MVP 已實作；時間參考 Draft 0.2 已接入正式 Viewer，確定性分析器與無截止日模式已完成；擴充資訊模組接口已完成 Draft 0.1 架構計畫，尚未進入實作。

## 定位

任務進展系統用來整理並顯示不同專案或 Agent scope 的任務狀態。它應可套用於 `Yu5h1Lib\.agents`、`Yu5h1Lib\Unity\.agents` 與其他 UnityProject，而不綁定單一 repository、單一目錄名稱或 GitHub。

系統的核心是共用資料格式與顯示方式。HTML 是供人閱讀的 View；各 scope 的 `tasks.md` 只負責路由，plan／handoff 維持 canonical entry，並可用路徑與 Task ID 指向 `report.json`／`report.dev.json` 的結構化內容而不重複抄寫。

## 命名

| 用途 | 名稱 |
|---|---|
| 產品與 repository 工作名 | `TaskProgress` |
| Web 顯示元件 | `TaskProgress Viewer` |
| HTML 入口 | `TaskProgressViewer.html`（部署時可為 `index.html`） |
| 本機 CLI / Launcher | `task-progress` |
| 觀看者資料 | `report.json` |
| 開發者擴充資料 | `report.dev.json` |
| 選用時間分析投影 | `time.analysis.json` |

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

### 擴充資訊模組方向

TaskProgress 未來需要接入專案難度、價值、成本、估價及其他目前未知的資訊，但這些領域不得持續擴張 `report.json` 或在核心載入器加入個別特例。既有 `time.analysis.json` 已證明選用 sidecar 可以獨立驗證、呈現與降級；它是第一個具有模組特性的內建功能，但目前 Viewer、Launcher、LocalWebService 與分析器仍直接知道 time 的檔名及流程，尚不是通用模組接口。

模組架構採以下方向：

- `report.json` 保持任務與進度核心；新領域使用獨立 sidecar。
- scope 以選用 manifest 宣告模組資料，Viewer 再透過可信任的內建 registry 配對 Validator、Adapter、Renderer 與 Runtime Controller。
- 外部工具可以產生 JSON 投影，但 manifest 不得指定任意 JavaScript、HTML、CSS 或可執行公式。
- 模組以 `scope_id`、`task_id` 與 stable `item_id` 對應主報告，並各自保存 Schema、版本、來源、信心及產生時間。
- 任一模組缺少、未知、過期或無效時只隔離該模組，不使基本 Viewer 失敗。
- time 先遷移為第一個正式模組，再以 cost 作為第二個模組，驗證 project／task／item 對應、商業資料隱私及跨模組分析，而不讓核心新增成本特例。Cost 與 Time 同級；可明確讀取時間估算作為分析輸入，但投影與 Renderer 必須獨立載入、驗證及降級。第一版成本語意區分 actual、committed、estimated 與 replacement，並保存幣別、基準日、分類、分攤方法、來源及 confidence；付款與交易仍由外部系統負責。
- 交易、付款、身份認證與電子簽署由外部系統負責；TaskProgress 只顯示經裁切的狀態投影與 reference。

完整 Draft 0.1、概念接口、遷移階段、安全政策及驗證矩陣見 `Documentation/ExtensionModuleArchitecturePlan.md`。實作狀態與下一步由 `report.json`／`report.dev.json` 的 `extension-modules` task 記錄。

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

#### 部署來源與自動同步

Viewer 的唯一原始碼保留在 `Yu5h1/TaskProgress` 的 `viewer/`，不在內容網站保存第二份複本，也不使用 submodule。`Yu5h1/docs` 的 Pages workflow 在 runner 中只 sparse-checkout `viewer/`，組裝為公開的 `task-progress/`，並將 docs repository 頂層的 `reports/` 保持在網站根目錄。

`TaskProgress/.github/workflows/notify-docs.yml` 只在 `viewer/**` 或通知 workflow 本身更新時觸發，透過 `repository_dispatch` 通知 docs 部署。docs 自己的 reports、pages 或網站設定 push 則直接觸發其 Pages workflow。公開 artifact 必須排除 CLI、tests、Documentation、schemas、Build 與 `report.dev.json`；更新 handoff、plan 等內部文件不應造成 Viewer 部署。

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
- 本機 loopback 的 `?scope=` 預設嘗試合併同 scope 的 Developer Report；公開來源維持基本報告，`?dev=none` 可明確停用本機 overlay。
- 顯示進展、已完成、尚未完成與更新時間。
- Developer 資料存在時才顯示 next steps、決策、路線與內部資訊。
- 保持 Viewer 唯讀，並讓 UI 元件可持續迭代。

完成條件：透過一個 URL 直接開啟報告，不要求使用者選擇檔案。

### Phase 3：本機 `task-progress` Launcher

- 接收基本與 Developer JSON 的絕對路徑。
- 驗證檔案存在與 schema 相容性。
- 啟動 loopback、短生命週期的本機 server。
- 以乾淨的 `?scope=<id>` URL 自動開啟同一套 Viewer，不把 Developer 路徑暴露在 Launcher URL。
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
- 將 `task-progress report apply` 保留為延後設計的 Agent-safe 非互動寫入介面；它只處理 TaskProgress 領域操作，不發展成通用標記語言 CLI，目前不因單份報告大小或單純節省 token 而實作。
- 當反覆讀寫完整報告已明顯占用 Agent context、跨檔同步或驗證錯誤重複發生，或第二個獨立工作流需要相同 mutation 時，Agent 應提醒使用者進入設計討論。屆時再核定 compact JSON result、stable ID 操作、source revision、`--dry-run`、Schema／跨檔驗證與原子提交契約。
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

## Report 指路任務卡與單層 Scope 導航

> 計畫狀態：需求與 tagged variant 契約已核定，尚未實作。需求核定日期：2026-08-18；variant 契約核定日期：2026-08-19。

### 系統階層與邊界

```text
Viewer（同一時間只有一個目前 scope／目前 report）
├─ 一般任務卡
│  └─ 顯示卡片本身保存的狀態、摘要與項目
└─ Report 指路任務卡
   ├─ 一層讀取被指向 report 的整體狀態與進度
   ├─ 一層列出被指向 report 的所有任務卡狀態
   ├─ 不讀取那些任務卡自己的 completed／pending items
   └─ 開啟後把被指向 report 設為目前 report，整個畫面重新載入
```

這項設計讓上層 `report.json` 成為多專案入口，但不在上層複製各子專案的進度資料，也不把現有二層卡片 UI 改造成遞迴樹。上層任務卡只負責「指路與一層預覽」；被指向的子專案 report 仍是其內容的唯一事實來源。

### 任務卡的兩種資料語意

| 類型 | Canonical 資料 | Viewer 卡片內容 | 卡片項目 | 可否開啟另一份 report |
|---|---|---|---|---|
| 一般任務卡 | 自身的 `status`、`summary`、`completed_items`、`pending_items` | 顯示自身資料 | 顯示自身項目 | 否 |
| Report 指路任務卡 | 穩定 `id`、`title` 與 `report_ref.scope_id` | 即時衍生目標 report 的整體狀態、進度與摘要 | 只投影目標 report 每張任務卡的 `id`、`title`、`status` | 是 |

Report 指路任務卡不得再人工保存衍生的 `status`、`summary`、百分比或項目清單。若同一份資訊同時存在上層卡片與子專案 report，兩份資料一定會漂移，因此 Schema 應以互斥 variant 表達兩種卡片，而不是讓 `report_ref` 只成為普通任務卡上的可選連結。

核定的資料契約採用帶有 `kind` 鑑別欄位的互斥 variant。`kind` 是穩定的序列化契約，不保存 JavaScript 或 C# 類別名稱：

```json
{
  "id": "viewer-editor",
  "title": "Viewer Editor",
  "kind": "standard",
  "status": "in_progress",
  "summary": "本機編輯流程已可使用。",
  "completed_items": [],
  "pending_items": []
}
```

```json
{
  "id": "winform",
  "title": "Yu5h1Lib.WinForm",
  "kind": "report_pointer",
  "report_ref": {
    "scope_id": "winform"
  }
}
```

- 共同契約只有 `id`、`title` 與 `kind`。`standard` variant 擁有自身的 `status`、`summary`、項目及可選進度；`report_pointer` variant 擁有 `report_ref`，並禁止保存由目標 report 衍生的欄位。
- Report Schema 以 `oneOf` 分開兩個 `$defs`，各自使用 `kind.const` 選定分支。`kind` 負責指出種類，`oneOf` 負責驗證該種類允許及禁止的欄位；不得靠是否碰巧存在 `report_ref` 來猜種類。
- JavaScript 資料層依 `kind` 分派 validation、projection 與 presentation model；Svelte 使用各 variant 的呈現元件。JSON 解析結果不需要先轉成 JavaScript `class`，但邊界等同於 C# 的基礎契約與兩個具體型別。
- 現有 `schema_version: "1.0"` report 沒有 `kind`。相容讀取時只把 1.0 的既有 task 視為 `standard`；Report 指路卡只存在於新版契約。新版 writer 不再產生未標記種類的 task。
- 新契約使用 `schema_version: "1.1"`，Viewer／validator 在遷移期同時讀取 1.0 與 1.1；`report.dev.json` 的版本契約同步更新並繼續與 base report 相符。必須先部署相容 reader，再遷移既有 report，不能在仍宣告 1.0 時偷偷加入 required 欄位。
- `scope_id` 由 Launcher 的既有 scope catalog／安全 resolver 對應到實際 `report.json`；公開資料與 URL 不保存或暴露本機絕對路徑。
- `id` 必須在目前 report 內穩定且唯一；`report_ref.scope_id` 必須可解析且不能直接指向目前 scope 本身。
- 未註冊、無法載入、Schema 不相容或自我指向的 reference 只讓該卡顯示可理解診斷，不得使目前 report 其餘內容失效。

### 單層摘要投影規則

Report 指路任務卡載入目標 base `report.json` 後，必須建立唯讀 projection，不得把 projection 寫回上層 report：

1. 卡片整體進度重用 TaskProgress 唯一的專案進度計算規則，不另外在 Report 指路功能實作第二套百分比公式。
2. 卡片整體狀態由同一個集中式 derivation 依目標 report 的頂層 tasks 計算；不得由 UI 元件各自猜測。全部完成時為 `done`，有執行中工作時為 `in_progress`，尚未開始且仍有可執行工作時為 `planned`；只有所有未完成工作都無法推進時才投影為 `blocked`。`archive` 仍只代表明確封存，不用來假裝完成。
3. 卡片項目逐一保留目標 report 頂層 task 的 stable `id`、`title` 與完整 `status`。這是專案任務狀態列，不得強迫轉成一般任務卡的「已完成／待處理」二分法；必要時使用專用唯讀 row view model。
4. Projection 到此為止：不得讀取或顯示目標 task 的 `completed_items`、`pending_items`、Developer overlay、時間 sidecar 或更深層 report reference。
5. 若目標 report 的某張 task 本身也是 Report 指路任務卡，上層預覽只顯示該 task 的標題與其可得狀態，不再解析它指向的 report。使用者真正導航到該 scope 後，新的目前 report 才能進行自己的一層預覽。

這裡的「沒有遞迴」是資料讀取與 UI 契約，不只是視覺上收合：一次上層預覽最多讀取目標 report 的頂層 tasks，不能暗中抓完整樹後再隱藏。

### 開啟與整頁換頁行為

- 指路卡必須提供明確且可聚焦的「開啟專案報告」操作；卡片標題可同時作為連結。雙擊可以是桌面快捷方式，但不得成為唯一入口，確保鍵盤、觸控與輔助科技可用。
- 開啟後 canonical URL 變成目標 `?scope=<scope_id>`，並沿用正常 report loader 完整替換目前 scope、標題、摘要、任務卡、Developer／時間附加資料與錯誤狀態；不得保留上一個專案的殘留 state。
- 瀏覽器上一頁／下一頁必須能回到先前 scope。實作可採頁內 navigation 或真正 reload，但對使用者與資料狀態而言必須等同重新載入整個目標專案，不是在原卡片內展開第三層。
- 目標 reference 載入失敗時維持目前 report 可用並在來源卡片附近顯示診斷；不得先清空整頁才回報錯誤。

### 編輯、安全與一致性

- Report 指路卡的衍生內容在上層 scope 一律唯讀。要修改任務狀態、摘要或項目，使用者必須先開啟目標 report，再沿用該 scope 的既有編輯能力與 revision／capability 保護。
- 第一版不在一般任務編輯表單中提供任意本機路徑或 URL 欄位。建立或更換 `report_ref` 應由受保護、scope allowlist 限定的路由操作處理。
- Reference preview 只取得 Viewer 本來可讀的 base report；不得因上層預覽而取得目標 scope 的私有 Developer 資料、編輯 capability、控制 token 或本機敏感路徑。
- 上層報告不建立由 generator 定期複製的第二份總覽 manifest。狀態與進度在讀取時由被指向 report 衍生，目標 report 始終是唯一事實來源。

### 實作範圍與驗收條件

這是跨 Report Schema、Viewer、Launcher／scope catalog、驗證與編輯語意的 system-level 變更，不能只新增一個卡片按鈕。建議依序完成：1.0／1.1 相容 reader 與 tagged Schema fixtures、集中式 variant dispatch 與 projection／aggregate、Launcher reference resolver、Viewer 卡片與 navigation、錯誤隔離、編輯唯讀邊界，最後才遷移既有 report 並接上 Yu5h1Lib 整體報告。

- Yu5h1Lib 上層 report 能以一張 Report 指路卡表示一個子專案，且上層 JSON 不保存該子專案的衍生進度快照。
- 指路卡內容會隨目標 report 改變而更新；不需要同步修改上層 report。
- 指路卡的項目數與目標 report 的頂層任務卡數一致，並正確顯示每張任務卡狀態；測試同時證明沒有請求或渲染那些任務卡自己的項目。
- 開啟指路卡後 URL、目前 scope 與整個畫面都切換到目標 report；上一頁能回到原 scope。
- 一般任務卡行為與既有 report 相容；Report 指路卡不會進入一般 task／item 編輯流程，也不會把 projection 序列化回 report。
- 缺少 scope、目標 404、無效 Schema、自我指向、重複 ID 及目標內含另一個 report reference 時都有測試，且錯誤不會破壞目前 report。
- 桌面、390px、鍵盤、觸控與 screen-reader 可辨識操作均通過；不得要求使用者知道雙擊技巧。

## 尚待實作時決定

1. Report 指路卡的 reference cache 與失效策略：目標 report 是每次檢視取得、每次導航取得，或快取後依規則失效。`?scope=` catalog 的實體放置方式已隨 scope store 實作定案，跨 scope 總覽亦已核定使用 Report 指路任務卡與單層投影。

## 人類任務編輯器擴充計畫

### 目標與邊界

編輯器的目標是讓人類與 Agent 共同維護任務，但不把 Viewer、Agent 協調檔與 Git 工作流混成同一層。公開 Pages 維持唯讀；只有由 localhost Launcher 開啟、且取得目前 scope 寫入能力的工作階段，才能進入編輯器。

第一版編輯範圍限定為：

- `report.json`：任務的公開欄位、狀態與工作項目。
- `report.dev.json`：next step、blocker、decision、route 等進階開發資訊。
- `tasks.md`：只維護 task id、canonical entry 與 routing note，不保存進度快照。

`handoff.md`、plan 與 canonical entry 仍由既有 Agent／人工文件流程維護。編輯器可顯示它們的連結與衝突提示，但第一版不直接改寫任意 Markdown 內容，也不把 `report.dev.json` 的 claim 當成即時鎖定來源。

### 結構化 Checklist 編輯 Draft 0.1（2026-08-13）

`implementation-checklist.md` 後續由獨立的本機桌面入口編輯，但它不是任意 Markdown 編輯器。Markdown 保持唯一資料來源；Editor 只解析及寫回固定的 checklist 結構，公開 Viewer 維持唯讀，也不承擔 Checklist 文件編輯責任。

```text
TaskProgress desktop tool
└─ task-progress.exe checklist <implementation-checklist.md>
   ├─ WPF Window + WebView2（不啟動 LocalWebService）
   │  └─ shared Svelte Checklist UI
   ├─ restricted EXE ↔ WebView bridge
   └─ Checklist parser／writer
      └─ implementation-checklist.md（唯一資料來源）
         └─ Work item（狀態唯讀、自動彙總）
            ├─ Title：要完成的工作
            ├─ Outcome：可觀察的完成結果
            └─ Checks
               ├─ Agent check（預設）
               └─ Manual check `[manual]`（例外）
```

#### 桌面入口與責任邊界（2026-08-14 決策）

- 第一版命令為 `task-progress.exe checklist <file>`。每次啟動只授權 CLI 明確指定的一個 `implementation-checklist.md`，不提供任意檔案瀏覽器。
- EXE 建立 WPF 視窗，使用 WebView2 載入隨程式發布的 Svelte 資產。WPF 只負責桌面視窗、生命週期與 WebView 容器；Checklist 內容仍由共用 Svelte UI 呈現。介面不透過 HTTP 載入，因此不啟動 LocalWebService、不占用 port，也不需要防火牆規則。
- Checklist 是獨立桌面入口，不加入 Report Viewer 的頁面或資料模型；兩者仍共用適用的 Svelte UI 元件、Editor transaction、Undo／Redo、主題與 SaveBar，不能複製另一套控制實作。
- WebView 只取得解析後的 checklist snapshot、顯示名稱與 revision，不取得任意檔案系統能力。所有讀寫由 EXE 處理；UI 只能透過受限 bridge 提交目前文件的結構化草稿。
- 儲存時 EXE 先驗證格式、ID、衍生父狀態、凍結結果與來源 revision，再於同一目錄執行原子替換。來源已被外部修改時拒絕覆寫，保留使用者草稿並顯示衝突。
- 關閉沒有修改的視窗可直接結束；存在未儲存草稿時必須提供繼續編輯或放棄的明確選擇。視窗關閉不牽涉伺服器生命週期。
- WebView2 是新的 Windows runtime／套件邊界；實作前須依共享 dependency safety 規則確認官方套件、固定版本、來源與發布方式，再取得安裝授權。

##### 與 Yu5h1Lib.WPF 的邊界

`C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib\WPF\Yu5h1Lib.WPF.csproj` 同時提供 `net48` 與 `net9.0-windows`，TaskProgress 技術上可透過 `ProjectReference` 使用其 `net9.0-windows` DLL。目前該庫沒有 WebView2 Host，也沒有 Checklist Desktop 所需的現成共用抽象，因此第一版不為了單一視窗強制引用整個庫。

- TaskProgress 擁有 WPF application shell、Checklist window composition、bridge allowlist 與 TaskProgress 專用生命週期。
- Checklist、Markdown、Editor Core 與 TaskProgress commands 不得進入 `Yu5h1Lib.WPF`。
- 只有與產品無關、具有至少第二個實際使用者的 WPF 擴充才下沉到 `Yu5h1Lib.WPF`，例如通用的 WebView runtime detection、受限 bridge transport 或視窗生命週期 helper。
- 若後續抽出共用擴充，先在 `Yu5h1Lib.WPF` 定義及驗證，再由 TaskProgress 以 `ProjectReference` 引用；不得在兩邊各保留一份實作。

#### Web-first 雙入口與優先順序（2026-08-14 決策）

LocalWebService 是正式 Web 路線的一部分，不因 Desktop Host 出現而退場。本機 Browser Viewer 及未來線上 Backend 以 HTTP adapter 使用同一份 Edit Application Contract；Desktop Host 透過受限 WebView bridge 使用相同 commands、responses 與 application service。Svelte UI 與 Editor Core 不得知道目前使用 HTTP 或 WebView transport。

優先順序如下：

1. **優先：TaskProgress 專案既有工作與 Checklist 介面。** 先完成 checklist 文件契約、parser／writer、最小 Desktop Host、受限 bridge 與人工 checks 介面。建立最小 Desktop Host 是 Checklist 入口的必要基礎，不代表同時搬移完整 Report Editor。
2. **一般：完整 Report Editor 雙入口。** Checklist 路徑穩定後，再抽出 HTTP endpoint 與 Desktop bridge 共用的 Edit Application Service，讓 Browser Viewer 與 TaskProgress Desktop 使用同一套 Report 編輯能力。
3. **保留：LocalWebService 與 Web 發布路線。** Browser 本機編輯仍由 LocalWebService／HTTP contract 支援；未來線上版以具身分驗證與持久化能力的 Backend 實作相同 contract。靜態 GitHub Pages 維持唯讀。

完整雙入口不得延後 Checklist 介面，也不得為 Desktop 複製現有 Viewer、Editor Core、transaction 或重新分析邏輯。

- 文件開頭的 `Current round: <plan anchor>` 是 round identity，指向這一輪的核定規格。`implementation-checklist.md` 只保存一個 active round；舊 round 由 git history 保存。
- 每個 work item 使用簡單的數字 ID，例如 `1`、`2`、`3`。ID 只需在當前 round 內唯一，代表項目身分而非畫面順序；修改標題或排序時不得重新編號。修復若仍以原本的 `Outcome` 與 `Expect` 為目標，就留在同一項；只有工作範圍或驗收合約實質改變才使用新 ID。新 round 可以重新從 `1` 開始。
- Markdown 內容維持英文，介面控制與提示可以本地化。句子採受控寫法：一個標題只表達一項工作，`Outcome` 只描述可觀察結果，不使用「正確處理」或「適當顯示」等無法驗收的詞。
- work item 不再同時保存 `Acceptance` 與 `Verification`。它只有 `Title`、`Outcome` 與一個以上的 `Checks`；每個 check 只有 `Action` 與 `Expect`。URL、命令與人工步驟都寫入 `Action`，不再建立重複的 `Entry` 欄位。
- 每個 check 欄位使用一個巢狀 Markdown list entry，固定格式為 `      - Field: value`；適用於必要的 `Action`、`Expect` 與可選的 `Reason`、`Observed`、`Resolved`。work item 若有相依關係，使用可選的 `  Depends on: 1, 2.`，ID 必須指向同一 round 內的其他項目。
- 未標記的 check 預設由 Agent 執行。只有真實裝置、使用者環境、受保護資料或直接 UX 判斷才加 `[manual]`，並附簡短 `Reason`；「人工比較快」不是有效理由。移除 `By` 與 `Why not agent`。
- check 狀態固定為 `[ ]` 尚未執行、`[x]` 已執行且符合 `Expect`、`[!]` 已執行但不符合 `Expect`。父 work item 的狀態不可點擊：所有 checks 都是 `[x]` 才自動為 `[x]`；任一 check 是 `[!]` 則自動為 `[!]`；其餘為 `[ ]`。
- Checklist 面板中，使用者只操作 `[manual]` check。每個人工 check 只在原本左側 marker 位置提供一個控制，依 `[ ]` → `[x]` → `[!]` → `[ ]` 循環；右側不再放第二組通過／失敗按鈕。Agent checks 與 work item 的衍生 marker 維持唯讀。
- manual check 選擇 `!` 時必須填寫 `Observed`，只記錄實際看到的結果，不要求使用者診斷原因。人工 `[!]` 存在時暫停相依工作；不相依的項目可繼續。Agent 在收到要求後區分實作、規格或環境問題並提出方向，人工排解過程不需要為每次嘗試建立清單項目。
- 任一結果儲存後，該 work item 的 Title、Outcome、Action 與 Expect 凍結。Agent-owned `[!]` 不得自動重跑；介入後明確重驗通過時保留 `Observed` 並新增 `Resolved`，也不得清回 `[ ]`。人工 check 的結果例外保持可編輯：可循環回 `[ ]`，此時清除 `Observed`／`Resolved`；再次選擇 `[!]` 時必須填入新的 `Observed`。Git／文件版本歷史負責保留先前人工結果。
- UI 只提供上述結構化欄位與狀態控制。所有修改都先通過既有 Editor transaction 與受限 WebView bridge，由 EXE 驗證格式、衍生父狀態、ID 與來源 revision，再原子寫回 Markdown；實際提交時機由下方 persistence mode 決定。
- Source revision 是載入時原始 UTF-8 檔案 bytes 的 SHA-256。Writer 保留 preamble、換行樣式與 BOM 狀態；managed checklist 結構以固定格式輸出，遇到未知或不完整結構時拒絕寫入而不靜默刪除內容。儲存先寫同目錄暫存檔，再以原子取代提交；目前檔案 bytes 與來源 revision 不符時回傳 conflict 並保留草稿。
- 第一階段維持 Markdown 為唯一資料來源，不建立重複的 JSON checklist。文件格式與 parser／writer 契約穩定後，再以同一模型承接本機面板。

#### 編輯持久化模式與 Checklist 標記（2026-08-15 決策）

具寫入 capability 的介面共用 `auto`／`cautious` 兩種 persistence mode；這是儲存策略，不取代公開 Viewer 的唯讀能力邊界，也不建立第二套 Editor Core。

- 預設為 `auto`。離散操作立即提交；文字輸入在最後一次有效輸入後短暫 debounce 再提交。Undo／Redo 也是新的修改，沿用同一自動提交流程。
- 自動模式不顯示「儲存」或「放棄」。固定狀態列保留 Undo／Redo、`謹慎模式` toggle，以及「儲存中／已儲存／衝突／錯誤」狀態。
- `cautious` 模式維持記憶體草稿，狀態列才顯示「儲存」與「放棄」。開啟謹慎模式前先等待現有自動儲存完成；存在未提交草稿時，不得直接關閉謹慎模式，必須先儲存或放棄。
- 使用者偏好以 boolean `task-progress.cautious-mode.v1` 保存在目前 Browser／WebView profile 的 cache，預設 `false`；不得寫入 report、Checklist Markdown 或專案設定。Desktop Host 必須使用穩定的 per-user WebView profile，使重開 App 後偏好仍存在。
- 衝突或寫入錯誤不得丟失畫面草稿。自動模式暫停後續提交並顯示錯誤；使用者解決來源衝突後再重試。高影響操作如交付日與永久刪除仍可在自動模式中保留預覽或確認 gate。
- Checklist 人工 check 在兩種模式都一直可編輯。左側單一 marker 循環 `[ ]` → `[x]` → `[!]` → `[ ]`；切到 `[!]` 時先展開 inline `Observed`，內容有效後才可提交。Agent marker 與 work-item marker 不可點擊。

```text
Execution size: medium
Architectural impact: system-level — changes shared persistence ownership, serialized manual-result mutation, and the common SaveBar contract
Precedent: existing Editor transaction, restricted bridge, SaveBar, revision conflict handling, and WebView-local profile storage
Proof: persistence-mode state tests | manual-result mutation tests | bridge conflict tests | asset build | disposable WPF interaction
```

```markdown
- [ ] **1. Make the child-item description fill the available width**
  Outcome: The description fills the available space and truncated text has a tooltip.
  Checks:
    - [ ] **Source contract**
      - Action: Run the focused presentation tests.
      - Expect: All focused tests pass.
    - [ ] **Rendered Viewer** `[manual]`
      - Action: Check Preview and Edit at desktop width and 390px.
      - Expect: The description fills correctly and the tooltip shows the full text.
      - Reason: Requires direct visual and pointer-hover inspection.
```

```text
Execution size: medium
Architectural impact: system-level — adds a WPF desktop host boundary and a restricted EXE／WebView contract
Volume: touches parser／writer、CLI／WPF／WebView2 host、shared Svelte panel、tests and documentation
Precedent: existing Editor transaction and shared Svelte components；new Markdown round-trip and WebView bridge contracts
Proof: parser round-trip tests | derived-status tests | frozen-result rejection | malformed-input rejection | revision conflict test | bridge allowlist test | desktop-window interaction
```

#### 進度摘要與下一步卡片的共用（2026-08-15，目前行為）

任務進度與實作清單各自要回答同一個問題：整體到哪了，接下來該做什麼。這兩塊改由同一份實作與樣式提供，維護一個地方兩邊都會變；畫面其餘部分維持各自的呈現。

```text
共用（一份實作，兩個畫面都用）
├─ 進度摘要
│  ├─ 數量統計：總數／已完成／待處理
│  ├─ 進度條
│  └─ 一行文字進度，例如「13 / 14 checks 通過」
└─ 下一步卡片：目前唯一該處理的項目

各自實作（不納入共用）
├─ 任務進度：任務卡與子項目列
└─ 實作清單：work item 卡與 check 列
```

- 兩邊的資料結構不同（一邊是任務與子項目，一邊是 work item 與 checks），所以共用的部分只接收算好的數字與現成的文字，不自己去讀報告或 checklist 結構。欄位名稱由呼叫的畫面提供：實作清單顯示「工作項目／已完成／待驗證」，任務進度用它自己的說法。
- 進度條提供兩種形式，由呼叫的畫面選擇：**分段式**每個項目一格，項目只有十幾個時能一眼看出剩幾個；**連續式**適合項目多、只關心比例的情況。分段式是這次實際驗證過好用的形式，但不是唯一形式。
- 下一步卡片一次只顯示一個項目：目前唯一未完成、而且沒有被相依項目擋住的工作。卡片寫該做什麼與怎樣算通過；需要跑指令時，指令直接放在卡片裡。
- 待處理用既有佈景的警示色（黃）：左緣色條加淡底色；已完成用既有的成功色。顏色一律取自現有語意色，不新增寫死色碼，換自訂佈景時才不會失去語意。
- 任務卡片與 work item 卡片的內容結構不同，暫不納入共用範圍。

此節是核定方向，尚未實作：目前實作清單介面沒有進度摘要與下一步卡片，任務進度的既有摘要也還沒抽成共用實作。形式來自 2026-08-15 用同一份 checklist 內容做的一次介面試作。

#### 標記方塊與主題控制的共用（2026-08-15，目前行為）

- **標記方塊**是獨立的共用元件，任何要表達「未執行／通過／失敗」的畫面都用它，不各自畫一個。呈現是方形外框，外框本身就是那對括號：未執行是空格，通過是勾，失敗是驚嘆號。可點擊時每按一次前進一個狀態；唯讀與衍生標記是同一個元件不開啟互動，不是第二種實作。狀態色沿用既有語意色。
- **主題控制**維持原本的一份實作（模型、儲存轉接、共用選單），實作清單只是接上它：視窗右上角提供系統／亮色／暗色／自訂，偏好與任務進度共用同一份設定。實作清單先前在自己的樣式表寫死暗色，等於在讀取偏好前就先決定了配色，已移除。

#### 元件顏色的分類與唯一來源（2026-08-15，目前行為）

共用元件不直接引用主題 token，改為引用具名的**用途角色**；每個角色再解析到 Viewer 既有的 token。同一類用途只有一個來源，改一次全部跟著改。

```text
角色（元件只認這一層）
├─ 填色：進度填色起訖、軌道、危險填色
└─ 狀態：通過／失敗／待處理／中性 各有文字色與柔和底色
      ↓ 解析到
Viewer 既有主題 token（不新增任何色碼，自訂佈景照常運作）
```

- 分類的理由是**強度不能互換**：文字色是為了在頁面上被讀取而調的，底色是為了襯在文字後面。把任一種當成大面積填色，深色模式就會褪色。這正是先前分段進度條看起來灰綠、待處理格變泥褐的原因。
- 進度填色以任務進度儀表為來源，因此分段格子與連續儀表不可能各走各的。
- 狀態色塊沿用 Viewer 既有的狀態卡寫法：語意文字色配上它自己的柔和底色。

#### 篩選與排序目前的行為（2026-08-16）

> 這一節記錄的是**目前的行為**,不是定案。介面會隨著實際使用一直改;只有經過大量真實驗證的部分才值得寫成不可違反的規則。下面的表格描述「現在是這樣」,不宣稱「應該永遠這樣」。
>
> 相對地,少數幾條是**資料正確性**而不是介面品味,它們不隨介面改版鬆動:篩選不得改變統計數字、篩選不得改變順序、work item 編號是身分不是位置、儲存一律經過 revision 驗證。

一條膠囊列上有兩種手勢,各管一件事,不互相干擾:**點擊決定誰顯示,拖曳決定什麼順序**。先前反覆出現的篩選錯誤,全都來自這兩件事被混在一起。

膠囊的內容由呼叫的畫面提供,兩個畫面不需要對齊 —— 任務進度用它的任務狀態(含已封存),實作清單用 check 狀態。鎖死成同一組會失去這個功能的擴充彈性。

**「預設」膠囊**固定在膠囊列最前面的位置上,是一顆全選開關,本身不對應任何狀態:

| 情境 | 結果 |
|---|---|
| 初始 | 全部選取,預設亮,全部顯示 |
| 點暗的預設 | 全部選取 → 全部顯示 |
| 點亮的預設 | 全部取消 → 一張卡都不顯示 |
| 其他膠囊剛好全被選取 | 預設自動亮 |
| 任一膠囊被取消 | 預設自動暗 |

沒有任何膠囊被選取時,沒有卡片的狀態落在選取集合裡,所以畫面上不會有卡片。這個結果沒有實用價值,但它必須符合操作的語意。

**排序由「預設」的位置決定:**

| 預設的位置 | 分組 | 組內順序 |
|---|---|---|
| 第一顆 | 不分組,整份是一個序列 | 資料原本的順序 |
| 不是第一顆 | 依膠囊由左到右分組 | 優先級,同優先級照資料原順序 |

優先級永遠只在組內排序,所以它不受篩選影響;預設模式下沒有組,因此也不套用優先級,呈現的就是報告或文件寫下來的次序。

**篩選同時作用在容器與其子項**:容器有任一子項符合就留下,並且只顯示符合的子項。實作清單依此檢視每一個 check,而不是只看 work item 那顆衍生 marker —— 衍生狀態取最壞的一個,只看它會讓「還有未執行工作」被失敗遮蔽。

數量為 0 的膠囊一律顯示並標示 0。隱藏它們會讓膠囊集合隨資料變動,使用者沒有碰過篩選,畫面卻自己改變。

子項目前只有未完成與已完成兩種狀態,所以選到「進行中」時卡內沒有子項符合,子項不顯示。要讓子項也能有「進行中」必須新增子項狀態欄位,屬於後續獨立的一輪。

#### 篩選列的共用（2026-08-15，目前行為）

實作清單也需要任務進度那樣的篩選列。篩選列由同一份實作提供，分類由呼叫的畫面給；應用層只描述自己有哪些分類，不再各自維護一套篩選介面。

```text
共用（一份實作）
├─ 膠囊列的呈現與互動：滑鼠、觸控、鍵盤
├─ 選取狀態與清除
└─ 每個分類的數量與狀態色

各自提供（呼叫的畫面決定）
├─ 分類定義：任務進度用任務狀態；實作清單用 check 狀態與負責對象
├─ 實際的篩選邏輯：留在各自的資料模型
└─ 偏好儲存：各自的鍵，元件本身不碰瀏覽器儲存
```

- 共用的部分只收「分類清單（名稱、數量、狀態色）與目前選取」加上回呼，不認得任務也不認得 check。膠囊列的滑鼠／觸控／鍵盤互動已經只有一份實作，這次是把分類從裡面拿出來，不是再寫一個。
- 實作清單的分類是兩組：check 狀態（未執行／通過／失敗）與負責對象（Agent／需人工）。任務進度維持既有的任務狀態分類。
- **重新排序是選項**：任務進度需要它並且會保存順序；實作清單的顯示順序由文件決定，關閉重排。work item 的編號是身分不是順序，不能因為篩選或排序而改變。
- **篩選只改變看到什麼，不改變存什麼**。進度摘要的數字一律以整份文件計算，不隨篩選變動，否則摘要會說謊；被篩掉的失敗項目仍然照常擋住相依工作。
- 觸控拖曳目前只有來源斷言、沒有在實體裝置上跑過（見 `handoff.md` 的 blockers）。共用之後兩個畫面走同一條路徑，實機驗一次兩邊都算數。

收斂後的工作順序：

1. **把分類抽出來**：篩選列改成由外部提供分類與選取狀態。
2. **任務進度改用它**：行為與既有一致，包含順序保存。
3. **實作清單接上**：加入 check 狀態與負責對象兩組分類，不開啟重排。

```text
Execution size: medium
Architectural impact: 元件層 — 篩選列不再自己定義分類，應用層只描述資料
Precedent: 既有的膠囊列互動實作、狀態順序模型與瀏覽器儲存轉接做法
Proof: 篩選列來源測試 | 兩個畫面的分類測試 | 實機觸控拖曳（一次，兩邊共用）
```

此節是核定方向，尚未實作。

#### AI 工具預覽面板的操作路徑（2026-08-15 決策）

> 2026-08-19 決策：這一節的階段 2、3 是「Checklist 支援 loopback Web 版」，不是現有 Report Viewer。現有 Report Web 編輯維持不變；Checklist Web 版目前擱置，不排實作時程，也不先決定 CLI 子命令、HTTP 授權或檔案 allowlist。已完成的階段 1 傳輸接縫保留供桌面 Checklist 與測試使用。

目標是讓報告與實作清單能在 AI 工具的右側預覽面板裡直接看、直接操作，而且共用元件改過、重新整理就看得到。做法是沿用「一份 UI、一份編輯契約、換傳輸方式」的既有方向，不為每個面板各做一套介面或一座橋。

```text
共用 Svelte UI ＋ Editor Core（不知道自己走哪一種傳輸）
└─ 編輯契約（commands／responses／revision 驗證）
   ├─ WebView2 bridge — 已完成，桌面 Checklist App
   ├─ loopback HTTP（LocalWebService）
   │  ├─ 報告：已完成，面板載入 127.0.0.1 即可操作
   │  └─ 實作清單：未實作，這是目前的缺口
   └─ 快照＋結果匯出 — 未定，給連不到本機的沙箱面板
```

- 面板分兩種，需要的東西不同。**能載入網址的面板**（Codex、VS Code、Claude Code 的瀏覽器窗格）不需要新機制，LocalWebService 已經是那座橋；缺的只是實作清單還沒有 HTTP 入口。**沙箱面板**（claude.ai artifact）連不到本機，只能載入烤進頁面的快照，操作結果以既有的儲存 payload 匯出，再由既有 C# writer 套用；三個產品問題未決前不進入實作，見 `handoff.md` 的 next steps。
- 兩種傳輸共用同一套授權邊界：只授權明確指定的檔案、只綁 loopback、儲存前比對來源 revision 再原子寫回。多一個面板不放寬任何一條。
- 「重新整理就看到」是這條路徑的驗收條件之一：面板載入的是建置後的資產，所以共用元件改完必須重新建置；資產檔名固定又沒有版本參數時面板會吃到快取，因此本機服務提供的資產需要版本化或明確不快取。

收斂後的工作順序：

1. **傳輸接縫**：Checklist 介面改成接收傳輸方式，不自己去抓 WebView 物件。這是其餘階段的前提，改動最小。
2. **抽出共用編輯服務**：HTTP endpoint 與桌面 bridge 底下共用同一套編輯服務，即既有的雙入口項目。
3. **實作清單的 loopback HTTP 入口**：沿用階段 2 的服務與既有的精確檔案授權，讓能載入網址的面板可以直接操作實作清單。
4. **沙箱面板的快照與匯出**：待前述產品問題決定後再排。

```text
Execution size: large — 分四階段，前三階段可各自獨立驗收
Architectural impact: system-level — 把傳輸方式從介面抽開，並讓實作清單多一個入口
Precedent: 既有 WebView2 bridge、LocalWebService HTTP 契約、可注入的傳輸參數與 transport-agnostic 持久化控制
Proof: 傳輸契約測試 | 精確檔案授權測試 | 面板實測（載入、操作、重新整理看到新版本）
```

此節是核定方向，尚未實作。要進 `implementation-checklist.md` 需先結束目前 round 並核定各階段規格。

##### 階段 3 的傳輸設計（2026-08-16 討論，2026-08-19 擱置）

> 狀態：**擱置，不排程**。以下保留研究結論，只有日後重新核定 Checklist loopback Web 版時才恢復規格討論。

實作清單的 parser 與寫入在 C#(`ChecklistDocument.cs`),LocalWebService 是 Python。**Python 不得自己解析 Markdown** —— 那會是第二份 parser。除此之外的安排都是開放的,曾評估三種:

| | HTTP 入口 | 解析與寫入 | 結論 |
|---|---|---|---|
| C# 自己起 loopback HTTP | 新增第二個 | C# | 帶來新的 port、新的信任邊界與新的生命週期問題 |
| Python 路由 + **常駐** C# 子程序 | 沿用既有 | C# | 需要 stdio 分幀、子程序監管、重啟與關閉時機 |
| **Python 路由 + 每次請求呼叫 CLI** | 沿用既有 | C# | **建議** |

推翻常駐方案的是兩個可查證的事實:

- **Python 早就在呼叫 C# CLI**:`service/taskprogress_host.py` 以 `subprocess.run([*analyzer_command, "analyze", folder], timeout=120)` 執行時間分析。所以「Python 啟動 C#」不是新方向,是既有模式。
- **`ChecklistBridge` 沒有跨請求狀態**:`Load` 每次重讀檔案,`Save` 也重讀、比對 revision、原子寫回。它是 (檔案, 請求) 的純函式,因此常駐 process 只省下啟動時間,不保護任何東西。

一併更正討論中的一個錯誤主張:「每次請求呼叫會讓 revision 檢查跨越 process 邊界而產生競態」是錯的。競態取決於「讀→比對→寫」是否被序列化,與 process 身分無關;常駐方案在並行請求下同樣需要處理。

代價是每次請求約多出一次 CLI 啟動時間。若日後量到延遲確實擾人,再加上常駐模式即可 —— **bridge 契約不變**(`Handle` 兩種傳輸都一樣),所以那是加法,不是重做。

重新啟動本階段時再決定：

1. **子命令形狀** —— 例如 `checklist request --file <path>`,stdin 收 JSON、stdout 回 JSON,使日後新增常駐模式不必更動契約。
2. **授權** —— 沿用既有 bearer session 與 loopback／Host allowlist／Origin 拒絕,或另設。
3. **哪些檔案可被開啟** —— 三項中最重要。桌面版的授權是「CLI 明確指定的那一個檔案」;改走 HTTP 後路由需要接受路徑參數,因此必須有允許清單,否則任意檔案都可被讀寫。既有的 scope 註冊機制是可能的沿用對象。

#### 共用元件與傳輸接縫 Round（2026-08-15 核定）

前一輪（結構化 Checklist 編輯）已結束。這一輪把上面幾節核定的方向實作出來，範圍是共用元件層加上一個最小的傳輸接縫：

- 進度摘要與下一步卡片：見「進度摘要與下一步卡片的共用」，兩個畫面都改用同一份實作。
- 篩選列：見「篩選列的共用」，把分類從元件裡拿出來，再讓實作清單接上自己的分類。
- 預覽面板路徑的階段 1：見「AI 工具預覽面板的操作路徑」，介面改成接收傳輸方式。

明確不在這一輪：預覽面板路徑的階段 2（共用編輯服務）與階段 3（實作清單的 loopback HTTP 入口）留給下一輪，階段 4 仍未決定。實機觸控驗證維持既有的優先級 3，不列為本輪驗收條件。

### 介面決策

頁首在主題控制旁提供一個頁面層級模式選單：`預覽模式` 與 `編輯模式`。第一版先在隔離 Demo 驗證全域模式；切到編輯模式後，任務描述、子項目新增／編輯／刪除、人工估算參數與工作容量使用同一個 capability 解鎖，不再由每個時間面板各放一個「編輯」入口。切回預覽模式時，自動模式先等待有效修改提交完成；謹慎模式若仍有草稿，必須先儲存或放棄，不能以切換模式暗中丟棄。

公開模式與沒有有效 edit capability 的本機服務固定在預覽模式，不能只靠 CSS 隱藏寫入控制。若未來任務欄位增加到不適合卡片原地編輯，仍可在全域編輯模式內使用主從式工作區：

- 左側：任務搜尋、狀態篩選、排序、新增任務，以及未儲存／衝突標記。
- 右側：目前任務表單、任務項目清單、Developer 資訊與 Routing 進階區。
- 頂端固定列：目前 scope、Git 保護狀態、其他來源已變更提示、復原／重做、持久化狀態與謹慎模式；儲存／放棄只在謹慎模式出現。
- 行動裝置：先顯示任務清單，選取後進入單一任務編輯頁，避免雙欄壓縮。

表單預設自動儲存；謹慎模式才採明確儲存。尚未提交或因衝突保留的內容可暫存在目前 Browser／WebView profile，只用於畫面恢復，不作為正式歷史紀錄。

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

目前 schema 同時接受 legacy 純字串及具有穩定 ID 的 item 物件；任務卡與 item 物件都可保存五級整數 priority。正式共同編輯使用物件格式，避免靠顯示名稱判斷兩個人或 Agent 編輯的是不是同一個 item，也支援可靠的重新命名、排序和三方合併，例如：

```json
{
  "id": "validate-local-launch",
  "title": "驗證本機啟動流程",
  "priority": 0
}
```

完成狀態仍由 item 所在的 `completed_items`／`pending_items` 清單表達。Viewer 在過渡期同時讀取舊字串與穩定 item 物件；舊報告只有在使用者預覽並確認遷移後才改寫，避免開啟編輯器就產生大面積 diff。

每個 task item 需要支援：

1. **快速新增**：單筆新增，以及貼上多行後拆成多筆；空白與完全重複項目要提示。
2. **文字與優先級編輯**：直接修改 title 及「立即／優先／一般／次要／未指定」，保留穩定 id，不因改字造成刪除加新增。
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

時間參考用來回答兩個最終問題：工程約需要多少日，以及能否在期限內完成。評估輸入分成三類：標準時間分配、項目規模與技術分析、實際執行校正；期限則是拿來和評估結果比較的外部限制。這些資料必須分開保存，避免把每日 8 小時工作上限、工程所需工時、實際效率與截止日期混成同一個數字。

TaskProgress 仍是唯讀報告與分析介面，不直接成為行事曆或計時器。原始時間資料由 Agent、Adapter、人工紀錄或其他工具提供；Viewer 顯示整理後的快照、依據與診斷。

核心原則是「標準分配把工時換成日數、項目分析估算工程工時、執行紀錄校正理論值、期限決定急迫程度」。公式產生可重算結果，AI 處理尚未形式化的工程判斷；隨著分析規則逐漸明確，已穩定的判斷應移入具版本的公式，縮小 AI 需要解讀的範圍。

### 已確認的第一版契約決策

- 不建立個人 profile，也不保存執行者身分；第一版只處理專案層級的標準容量。
- 一名標準執行者每天理論容量為 8 小時；專案保存 `executor_count`，第一版正式支援值為 1。
- `capacity_minutes_per_executor_day`（每日工作容量）與 `unplanned_item_likely_minutes`（沒有工程資料時的預設項目工時）是兩個獨立功能參數；範例剛好同為 480 分鐘，不代表必須相等。前者負責小時／工作日換算及產生容量時間線，後者只在分析器缺少 item 估算時建立一筆低信心預設值。
- 執行者數量與執行校正分開。理論容量是 `executor_count × 每人容量`，執行校正才反映實際紀錄；多人平行效率留待後續排程階段。
- 執行校正依專案累積，初始為 100% 中性基準與低信心；第一版只記錄，不自動調整。
- `time.config.json` 保存標準容量、執行者數量、期限、預設項目 8 小時及顯示政策。每日分配明確保存睡眠、生活、其他固定不可工作時間與最後衍生的工作容量；四者合計必須等於 24 小時。
- 個別子項目估算不混入 config，另由 `time.estimates.json` 保存估算輸入、參與者、分析方法、版本化公式、信心、版本關係與選用的低／常態／高工時。人工參數、AI 分析、歷史證據、系統預設與固定公式可以共同形成一個結果，不再以單一互斥 `source` 表示真實來源。
- 有工程依據時允許保存估算範圍，但 Viewer 只顯示 `likely` 約數；沒有依據時只使用預設 8 小時與低信心，不虛構範圍。
- 估算溯源使用 `contributors` 表達參與角色，至少可包含 `human_estimate`、`human_parameter`、`ai_analysis`、`historical_evidence`、`system_default` 與 `deterministic_formula`；`inputs` 保存具單位與提供者的參數，`analysis_method` 與 `calculation` 分別保存分析方法及可重算公式。
- `human_confirmed` 只表示人工是否接受最後估算結果，與任何 contributor 完全獨立。人工提供參數不等於確認結果；人工直接輸入最後工時也必須另行決定是否標記已確認。
- AI 負責辨識工作、提出假設、選擇分析方法與解釋未結構化因素；確定的乘法、加總、容量換算由具版本的固定公式執行，不能讓不可重算的 AI 文字直接成為唯一計算器。
- 每個 task 與 item 必須有穩定 id；`task_id`／`item_id` 辨識工作本身，與設計／開發／測試等工作類型分類無關。每次估算另有可換版的 `estimate_id`，顯示文字或估算版本改變時不更換工作 id。
- 不保存可被人工維護的獨立「剩餘工時」欄位；交付界線固定，實際投入也不從工程總估算逐分鐘扣除。Viewer 可用目前校正後總工作量乘上 `(1 - work_progress_ratio)`，即時計算僅供摘要閱讀的「未完成工作量」；估算若改變，仍以新版本與 `supersedes` 關係保存。
- 主畫面綠／黃／紅表示工作進度相對於已消耗可用時間的期限壓力；當前日期只是計算時間進度的基準，不單獨決定顏色。預測信心、估算範圍與計算依據放在點擊後的面板。
- 第一版只有不可延後的 `delivery_at`。交付時間一到即不能繼續工作；沒有交付期限時使用 Theme 預設 Label 顏色。
- 時間分析契約保留在 `experiments/time-reference/` 以 Draft 0.2 演進；正式 Viewer 與 CLI 已用可選 `time.analysis.json` sidecar 接入，不把時間欄位強塞進基本 `report.json`。
- 第一版確定性分析器已先整合進 `task-progress.exe`，提供 `analyze` 命令並在 `open`／`start` 發現時間輸入時自動刷新。日期、容量與壓力算法保持可抽離邊界；未來需要跨平台時區資料庫或獨立套件時再拆成 `TaskProgress.TimeForecast` 並評估 NodaTime，OR-Tools 只保留給多人、依賴與資源競爭等複雜排程。

### 三類評估資料與時間期限

#### 1. 時間影響：標準分配

標準分配描述一名標準執行者一天有多少時間能真正排入工程。初始基準採 8／8／8：8 小時睡眠、8 小時日常生活、最多 8 小時工作。這是沒有個人身分的系統規則，負責將工程工時換算成工作日，不直接判斷工程規模。

第一版基準明確滿足 `24 hr - 8 hr 睡眠 - 8 hr 生活 - 0 hr 其他固定不可工作時間 = 8 hr 每日工作容量`。這個扣除由本機分析器依 config 做一次並展開為 `capacity_timeline`；靜態 Viewer 只讀取已產生的每日容量，不再次扣除，避免重複計算。

既定規則包括：

- 每日固定分配，例如 8 小時睡眠、8 小時生活、最多 8 小時工作。
- 可開始日期、不可使用的日期或時段。
- 已承諾給其他任務的時間。
- 臨時例外，例如休假、就醫、外出或某日額外可工作時間。
- 任務本身的 timebox；例如只允許投入 4 小時研究，不等同於要求 4 小時後必須完成。

8／8／8 是容量規則，不是產能保證。每日最多 8 小時工作只代表可排程上限；其中仍可能包含切換成本、溝通、等待與低專注時段。第一版先保留「可排程工作容量」與「實際有效投入」兩個數值，日後再由紀錄校正兩者的關係。

標準工作日暫定為 8 小時。它是估算項目工作量時的固定換算單位；實際某日可排容量則可能因生活安排、其他承諾與例外日而低於 8 小時。固定工作量與每日可用容量必須分開，避免同一個「一日」隨行程改變而改寫工程估算。

容量限制至少區分：

| 限制 | 語意 |
|---|---|
| `not_before` | 在此之前不能或不應開始 |
| `work_cap` | 一段期間可分配給工作的最大容量 |
| `timebox` | 此任務允許投入的最大工作量 |
| `commitment` | 已被其他任務占用的容量 |

#### 2. 時間影響：項目分析

項目分析回答「工程本身需要多少工時」。每個子項目可由工程計畫或 AI 分析估算，至少考慮：

- 項目規模與工作步驟數量。
- 技術難度與整合複雜度。
- 已掌握技術可直接實作的時間。
- 尚未掌握技術所需的探索、試作、失敗與驗證時間。
- 外部依賴、測試、修正與交付成本。
- 已知風險的緩衝，但不得和執行校正重複計算。

子項目可以是人工直接估算，也可以由人工參數、歷史證據、AI 工程分析與固定公式共同得出。沒有足夠資料時才採一個標準工作日，也就是 8 小時，並以 `system_default` contributor 與低信心標記，不能偽裝成經過工程分析的精確估算。人工若補充或修正參數，產生新估算版本並保留 `supersedes` 關係，但不自動把 `human_confirmed` 改為 true。

任務總估算是其所有子項目目前有效估算的總和；專案總估算是所有任務估算的總和。`deterministic-capacity-feasibility` v0.3 不從已投入 session 時間扣除工程估算，而是直接加總目前未完成項目的有效估算，再套用一次執行校準，得到 `remaining_estimated_minutes`。若只有 task-level estimate，才依該任務的可驗證完成比例分配剩餘量。若任務沒有子項目，該任務本身視為一個估算單位，沒有歷史模板且 AI 無法分析時同樣使用預設 8 小時。

#### 3. 執行校正：實際運作紀錄

「執行校正」描述理論工程工時與實際執行能力之間的差異。它不是對人的績效評分，也不負責補上技術探索；技術未知已在項目分析計算，執行校正只處理可從實際運作觀察到的偏差，例如中斷、上下文切換、估算過度樂觀或一段工作時間未能形成有效進展。

沒有歷史資料時，校正係數以 100% 作為中性基準，但同時標記為「尚無數據／低信心」。未知不直接扣分，也不能將 100% 顯示成已證實的高效率。累積資料後，才依固定觀察窗口逐步校正；若未來證據顯示能穩定快於基準，也應允許高於 100%，避免模型只能愈扣愈低。

樣本量影響採收縮估計：`n_eff` 是依任務相似度與資料品質加權的有效樣本數，`k` 是先驗等效樣本數。資料權重 `w = n_eff / (n_eff + k)`，最終校準因子為 `(1 - w) × 1.0 + w × 歷史樣本因子`。樣本少時結果靠近中性基準，樣本增加後才逐漸靠近歷史觀察；第一版 config 暫定 `k = 10`。

實際紀錄描述已經發生的事情，至少包含：

- 任務建立、開始、暫停、恢復、完成與封存。
- 一段工作 session 的開始與結束。
- 狀態、截止日期或預估的修改。
- 阻塞開始、解除及等待外部回應的期間。
- 紀錄來源與紀錄時間，區分事件發生時間與事後補登時間。

「從開始到現在的日曆時間」與「實際投入的工作時間」分開計算。任務開始三天不代表投入三天；Agent claim 存在多久也不能直接當成有效工作時間。

實際紀錄以不可變事件為優先，而不是不斷覆寫單一累計值。概念事件格式包含穩定 event id、task id、事件種類、`occurred_at`、`recorded_at`、來源與事件資料。若日後需要修正舊紀錄，新增更正事件並保留原始證據。

項目分析與執行校正必須避免重複歸因。例如，因第一次接觸某項技術而多花的探索時間，優先用來改善該類項目的技術估算；只有跨多種任務持續出現的執行差異，才用來調整一般執行係數。

#### 時間期限與急迫程度

期限本身不增加或減少工程工時，而是提供固定交付界線。第一版只使用含 UTC offset 的 `delivery_at`，沒有 soft/hard 分類；例如 `2026-08-01T00:00:00+08:00` 表示 8/1 一開始即交付，最後可工作時間在 7/31。v0.3 先比較剩餘工程需求與交付前剩餘容量，再以從開始到交付前的時間進度 `t` 與實際工作進度 `p` 補充進度趨勢。

| 狀態 | 建議條件 | 顯示 |
|---|---|---|
| 可行 | 剩餘需求不高於 80% 剩餘容量，且進度壓力不高於綠色門檻 | 綠色＋「交付可行」 |
| 風險 | 剩餘需求使用超過 80% 容量但尚未超額，或進度壓力進入黃色區間 | 黃色＋「交付有風險」 |
| 不可行 | 剩餘需求超過剩餘容量、進度壓力進入紅色區間，或已到交付時間仍未完成 | 紅色＋「交付不可行」 |
| 無期限 | 未設定 `delivery_at` | Theme 預設 Label 顏色 |
| 完成 | 工作進度已達 100% | 完成狀態色 |

時間進度由已消耗可用容量除以開始至交付前的全部可用容量；可用容量依工作日與例外計算。容量可行性比率為 `remaining_estimated_minutes / remaining_capacity_minutes`：大於 1 直接紅燈，超過 0.8 至 1 至少黃燈。容量足夠時再計算進度壓力 `(1 - p) / (1 - t)`：不高於 1.10 為綠色、超過 1.10 至 1.50 為黃色、超過 1.50 為紅色。兩者取較嚴重結果；容量缺口不再只是參考。顏色只作輔助，必須提供無障礙文字；信心不改變顏色，只在點擊後面板說明。

### 資料分層

三類評估輸入依公開程度與用途投影成五層資料：

1. **標準分配來源**：`time.config.json` 保存時區、無身分的單一執行者容量、專案執行者數量、例外日、承諾與固定 `delivery_at`，預設只保存在本機。
2. **項目估算來源鏈**：保存每個 task item 的輸入參數與單位、contributors、AI 或固定規則的分析方法、版本化公式、獨立的人工確認狀態、信心、evidence reference 與版本關係。
3. **執行紀錄來源**：保存工作 session、狀態轉換、阻塞與估算修訂，作為執行校正的主要證據。
4. **分析快照**：由固定的 `as_of` 時間保存發布時的原始工時、校正工時、直接加總的剩餘工時、工作日數、工作進度、時間進度、進度壓力、容量餘裕／缺口、風險依據與急迫程度，並附帶公式版本、可供說明的 `capacity_profile`，以及可供靜態 Viewer 重算期限風險的容量時間線。`capacity_profile` 是本機 config 的公開投影，包含 8／8／8、工作日及休假例外；例外只投影人工確認可公開的 `public_label`（例如「休假」），私人行程或醫療細節不得從 config 原樣發布。Viewer 仍以已展開的 `capacity_timeline` 計算，不再次扣除。瀏覽器產生的 `evaluated_at` 只代表本次預覽計算時間，不回寫發布快照。
5. **Viewer 投影**：`report.json` 只包含可公開的時間摘要與狀態；`report.dev.json` 才包含內部估算、假設、信心、證據 reference 與較完整診斷。

隔離原型使用四份契約：`time.config.json` 保存政策與專案設定、`time.estimates.json` 保存個別工程估算、`time.events.json` 保存實際證據、`time.analysis.json` 保存可重算結果。這些來源不應因 Viewer 未顯示就被誤認為可公開。

觀看者任務未來可選擇性呈現預估工時（hr）、交付界線與急迫燈號；Developer 資料才呈現開始時間、最後活動、實際投入、執行校正與完整假設。詳細容量分配、逐段工作紀錄及 AI 內部分析預設不進入公開報告。

### 第一版評估公式

第一版只實作能由明確資料重算的結果。所有結果都以分析快照的 `as_of` 為基準，避免同一份報告在不同時間得到無法追溯的結果。

```text
每日可排程工作容量
  = 24 小時
  - 睡眠預算
  - 生活預算
  - 其他固定不可工作時間

子項目估算工時
  = 具來源與單位的 inputs
  + AI 或固定規則選擇的 analysis_method
  + 具版本、可重算的 calculation
  若完全沒有足夠依據則使用 system_default 8 小時
  human_confirmed 只記錄人工是否接受最後結果，不參與工時計算

任務原始工時
  = 任務內所有子項目估算工時總和

專案原始總工時
  = 所有任務原始工時總和

校正後預估總工時
  = 專案原始總工時
  / 執行校正係數

執行校正係數
  = (1 - 樣本權重) × 1.0
  + 樣本權重 × 歷史樣本因子

樣本權重
  = 有效樣本數 n_eff
  / (有效樣本數 n_eff + 先驗等效樣本數 k)

時間進度 t
  = 從開始至 as_of 已消耗的可用容量
  / 從開始至 delivery_at 前的全部可用容量

工作進度 p
  = TaskProgress 依穩定 task/item id 計算的現有進度

進度壓力
  = (1 - p)
  / (1 - t)

約耗時工作日
  = 將校正後預估總工時
  依每日可排程容量換算的整體預估日數

實際投入時間
  = 所有有效工作 session 的時間總和
  - 明確記錄的暫停時間

日曆經過時間
  = 完成時間或 as_of
  - 開始時間

```

執行校正係數不得為零。100% 表示按目前工程估算執行，80% 表示相同工程量預期需要 `原始工時 / 0.8`；它不是完成百分比。第一版不保存獨立剩餘工時，也不以實際投入時間自動扣減總估算；「未完成工作量」只是 `校正後總工作量 × (1 - 工作進度)` 的顯示衍生值。時間進度的分母為零、已到交付時間、沒有期限或缺少開始時間時，必須使用明確的邊界狀態，不能產生無限值或以零猜測。

第一版可另外提供：

- 距離交付時間的剩餘日曆時間。
- 最後活動距今多久及可能停滯的提示。
- 已完成任務的 cycle time 與實際投入時間。
- 初始／最近預估和實際投入的差異。
- 阻塞與等待時間，但不將其算成有效投入時間。

任務的數量進度不能直接換算時間進度。現有子項目可能大小不同，因此不使用「已花時間除以完成百分比」來推算完工時間。

### Viewer 極簡呈現規格

Viewer 表面只呈現使用者立即需要的結果；公式、分配與期限比較藏在點擊後的說明中，原始 session 與逐筆事件不進入一般 Viewer。

#### 專案總覽

既有整體進度百分比維持原語意，不和時間估算混成同一個百分比。時間資訊另用一個可點擊的「工期摘要按鈕」呈現，例如：

```text
[專案標題]  [8/1 交付 ● ›]      整體約 75%
────────────────────── 進度條 ──────────────────────
```

- `75%` 仍表示現有工作項目進度。
- 寬螢幕時，專案標題、時間 Label 與整體進度在同一列垂直置中；進度條與最後更新／report id 維持在下一列，不因時間功能改變原順序。
- 工期摘要按鈕沿用主題選擇器與狀態標籤的圓弧控制語言，但使用透明背景、Theme 中性邊框與完全膠囊圓角；沒有灰色填色、額外方形背景或包裹面板。
- 工程量不放在外部按鈕，避免和交付倒數混淆；「進度報告」內的工程總量、未完成量與剩餘容量統一使用 `hr`，不再並列「約 N 工作日」。task 卡片是否保留工作日是獨立的既有呈現決策。
- 期限顏色先使用直接加總的未完成工程需求與交付前剩餘容量，再以工作進度與容量時間進度補充趨勢；容量缺口會直接改為紅燈。
- `deterministic-capacity-feasibility` v0.3 的容量比率大於 1 為紅燈，超過 0.8 至 1 至少為黃燈；容量足夠時仍保留 v0.2 的進度壓力門檻，兩者取較嚴重結果。睡眠、生活時間、工作日與例外先在容量時間線扣除一次，Viewer 不得重複扣除。
- 日數採整數約數；完整精度保留在計算資料，不在表面製造假精度。
- 有期限時同列顯示 `M/D 交付`；沒有期限時只顯示約工作日，按鈕使用 Theme 預設顏色。
- Label 外部只以圓形燈號對應綠、黃、紅或中性狀態，不顯示「進度有風險」等判定文字；點擊後的面板保留「目前判定」與完整文字，燈號另有螢幕閱讀器可讀的顏色名稱。
- 沒有任何可用估算時不顯示約需工作日，不以零日代替。
- 中等寬度時時間 Label 可移到標題區下一行、整體進度仍靠右；手機依序垂直排列專案標題、時間 Label、整體進度，避免截斷文字。

點擊專案時間 Label 後開啟標題為「進度報告」的面板；`約 N 工作日` 不再作為 dialog title。面板採兩層閱讀：

1. **預覽者摘要**：預設顯示距離交付、直接加總未完成項目估算所得的「預估未完成工時（hr）」、對應燈號的風險評估與最後回報時間。容量缺口使用「容量不足」，其他期限前紅色使用「預計超期」，到達交付時間後才使用「已逾期」。
2. **詳細資訊**：展開後固定保留三個 Tab 並共用同一內容區。`評估流程` 以雙軌節點圖說明工程需求與工作容量如何形成未完成工時、剩餘容量、容量餘裕／缺口及現行風險；`工程估算` 顯示工程總預估工時、預估未完成工時、時間／工作進度、壓力、本次風險計算時間、公式、執行校準與互斥估算組成；`工作容量` 顯示每日容量、交付前總／剩餘容量、8／8／8 分配、工作日、時區及休假／其他例外。工程量欄位統一使用 `hr`。缺少交付日時仍保留 Tab 列並選中 `工程估算`，需要期限資料的 `評估流程`／`工作容量` 顯示為 disabled，不能被選取。

即時摘要永遠位於 Tab 上方，不因切換內容而消失。詳細資訊第一次開啟預設顯示 `評估流程`，切換後在本次頁面生命週期保留最後選擇；三個 Tab 使用同一面板位置，不同內容不並排堆疊。`評估流程` 必須明確標示 v0.3 的容量優先規則：容量缺口直接紅燈，剩餘需求使用超過 80% 容量時至少黃燈，容量足夠時再採進度壓力。`工作容量` 是唯讀觀看名稱，不在公開頁面誤稱為可寫入設定；本機環境才於 Tab 內顯示「編輯」。專案進度報告與所有子項目面板共用同一個頁面層級 `timeDetailsExpanded` flag；任一面板展開或收合後，其他時間面板沿用相同狀態。關閉 dialog 不重置，重新載入頁面才恢復預設收合。編輯狀態不共用。

#### 任務卡片

每張任務卡維持兩層閱讀順序：第一行先顯示狀態，完成數固定靠右；第二行是任務標題，標題後接任務總預估工時：

```text
● 進行中                                      2 / 5
建立時間參考原型  ·  約需 24 hr
```

- 狀態放在卡片開頭，方便垂直掃描多張任務卡；完成數 `completed / total` 保持在第一行右側，不和時間合併。
- 狀態只讓圓點使用語意色：進行中為藍色、已完成為綠色、受阻為紅色、待處理／封存為灰色；狀態文字使用 Theme 的普通或次要文字色。黃色保留給期限風險，不用作一般任務狀態。
- 顏色只是輔助，圓點後必須保留「進行中／已完成／受阻／待處理／已封存」文字，不能只靠顏色辨識。資料值 `planned` 在 Viewer 顯示為「待處理」。
- `約需 N hr` 緊接任務標題，使用中性、非互動的輕量文字；沒有期限、燈號、箭頭或獨立外框。
- 任務工時等於其所有子項目估算工時總和；已完成項目仍包含在總耗時中。
- 任務卡片總和不套用個人執行校正，確保它能由右下各項 `hr` 直接相加驗證；專案層才整合實際紀錄、每日容量與期限。
- 此處只是總和，不提供額外說明或第二層彈窗，保持卡片簡潔。
- 沒有子項目的任務以任務本身估算；仍無計畫時使用預設 `8 hr`。
- 卡片統一使用 `hr`，不顯示工作日、週、月或複合單位；手機寬度不足時，時間文字換到標題下一行，狀態與完成數仍保留第一行兩端排列。

#### 子項目列

每個子項目在名稱後顯示估算工時，最右側保留狀態：

```text
建立時間 schema  6 hr                         [進行中]
驗證未知技術路線  30 hr                       [待做]
```

- 子項目永遠使用 `hr`，即使超過 24 小時也不轉成日，讓任務總和可直接相加。
- 工時值使用無背景、無邊框的輕量文字按鈕；仍可點擊並以鍵盤操作，彈出簡短依據，例如「依工程計畫：schema、驗證與測試，約 6 hr」。
- `進行中`、`已完成`、`受阻`、`待做` 等子項目狀態固定靠右，使用有邊框的膠囊標籤；進行中／完成／受阻分別使用藍／綠／紅語意色，待做使用 Theme 灰色。
- 沒有工程計畫時顯示預設 `8 hr`；點開說明為「沒有可用計畫，依預設一個標準工作日估算」。
- 子項目面板的預設層只顯示信心、單一預估工時及「估算依據」；同一列左側依序顯示 `預估工時` 與實際參與角色的膠囊標籤，例如 `[人工估算]`、`[人工參數] [AI 分析]` 或 `[預設]`，時間值固定靠最右。固定公式留在詳細資訊，不增加表面標籤。
- `人工確認` 不再混入估算參與標籤；詳細資訊以獨立的是／否欄位呈現。人工參數與人工確認可以同時分別為「有」與「否」。
- 穩定 `item_id`、可換版 `estimate_id`、低／高範圍、人工確認、完整 contributors、輸入參數、分析方法、計算公式、reference 與歷史紀錄收進「詳細資訊」切換；預設層不並列「最可能工時」與「估算範圍」，避免看起來像兩種互相競爭的答案。
- 歷史資料是可以和其他角色並存的 evidence contributor；只有分析器確實對多筆相似樣本計算權重時，才使用具版本的方法名稱「歷史加權估算」。
- 依據只說明工時從何而來，不展開完整工程文件；需要時在詳細資訊提供 reference。
- 預設值與經分析值在表面可使用低調符號或無障礙文字區分，但不增加另一排說明。
- 「詳細資訊」採頁面層級的共用 `timeDetailsExpanded` flag，而不是每個面板各自保存；專案進度報告或任一子項目展開後，關閉面板再開啟其他時間面板仍保持詳細模式，任一處收合後也同步沿用收合模式。關閉 dialog 不重置此 flag，重新載入頁面才回到預設收合。

#### 動態重算與人工編輯

- `time.analysis.json` 是可選 sidecar：有且通過驗證時才掛載專案工期摘要、task 總工時與 item 工時；檔案不存在時視為正常的「無時間資料」，原版 Viewer 照常顯示且不保留空白占位。
- 缺少時間資料時 Viewer 不自行補 `0 hr` 或預設 8 小時；預設工時只能由分析器建立一筆明確的 `system_default` 估算。sidecar 存在但無效時，時間功能整體降級為不顯示並留下診斷，不使 `report.json` 或整個 Viewer 失敗。
- 靜態發布採兩層計算。本機分析器負責 AI／人工工程估算、公式選擇、直接加總 `remaining_estimated_minutes`、工作進度快照與期限前每日容量時間線；靜態 Viewer 依已發布的剩餘工程需求、`work_progress_ratio`、`delivery_at`、時區、工作時段、容量時間線與門檻，在瀏覽器目前時間重新計算剩餘容量、容量缺口、可行性比率、進度壓力、邊界狀態與燈號。
- Viewer 在初始化／reload 時計算一次；頁面保持開啟時每分鐘更新，分頁由背景回到前景或從瀏覽器快取恢復時立即更新。這些觸發只更新會隨時鐘前進的期限風險，不呼叫 AI、不改寫 sidecar，也不改變工程工時或最後回報的工作進度。
- 若沒有新狀態回報，工作進度維持發布快照而時間繼續前進，風險可以自然提高；Viewer 必須同時保留報告最後更新時間與本次風險計算時間，讓觀看者區分「資料何時回報」和「燈號何時計算」。
- 時間結果是衍生快照，不是人工維護的固定文字。截止日期、可用容量、人工參數、算法版本或工作進度改變時，系統依受影響的依賴重新計算；重新整理只負責取得最新快照，不應是唯一計算觸發方式。
- 截止日期改變只重算容量時間線、剩餘容量、可行性與進度壓力，不改寫工程所需工時。人工估算參數改變則重算 item、task、project 與剩餘工程需求，因此可能直接改變燈號。
- AI 選擇 `algorithm_id`、整理參數與解釋方法；公式引擎只執行已登錄、具輸入契約與版本的算法。AI 回傳的任意字串公式不得以 `eval` 或同等方式直接執行。
- 當參數值改變但 `algorithm_id` 與輸入結構仍有效時，不再呼叫 AI，直接由固定算法重算。只有任務本質、輸入結構、方法適用性或缺少資料發生變化，或使用者主動要求時，才重新進行 AI 分析。
- 全域編輯模式對具有人工輸入的子項目直接顯示可編輯表單，只開放 `origin: human` 的參數及獨立 `human_note`；AI 分析、歷史證據與公式版本保持唯讀。
- 專案進度報告的 `工作容量` Tab 在相同全域編輯模式直接顯示容量表單。可調整睡眠、生活、其他固定不可工作時間、每週工作日及逐日例外；每日工作容量固定由 `24 hr - 睡眠 - 生活 - 其他固定不可工作時間` 衍生，不能同時輸入互相矛盾的第四個值。
- 本機 config 的休假與例外採 `date + available_minutes + reason`；公開分析快照只保存經確認的 `public_label`。`0 hr` 表示整日不可工作，非零值可表達半日請假或額外可工作時間。儲存後立即重建從開始日至交付日前的 `capacity_timeline`，再用既有確定性期限算法重算容量進度與燈號，不呼叫 AI。
- 第一版編輯環境政策只允許 `file://`、`localhost`、`127.0.0.1` 與 IPv6 loopback；非本機來源不顯示「編輯」按鈕，也不讀取或套用瀏覽器中的 Demo 覆寫。這是可替換的環境政策，不把未來正式授權綁死在 `report.dev.json` 是否存在。
- 人工估算與容量表單不提供局部「取消」，但保留「重新計算」作為未儲存預覽：只以記憶體草稿更新畫面與期限風險，不寫入 localStorage、不更新正式 `as_of`、不建立下一個 `estimate_id`。切回預覽模式即統一放棄所有未儲存草稿；按下頁面唯一的全域「儲存」時必須再次驗證及重新計算，成功後才建立版本、更新分析時間並寫入；任一草稿無效時不部分提交。
- 隔離 Demo 的未儲存人工估算、理由與工作容量只暫存在目前頁面記憶體；全域儲存成功後才寫入瀏覽器本機儲存。敏感草稿不得進入 persistent cache／localStorage；若未來需要 reload／crash recovery，必須另行採遮蔽、期限與明確同意的 session draft。正式 Viewer 的持久化仍必須由未來本機寫入服務驗證 Schema、原子保存並建立版本。

#### 隱式細節與互動邊界

- 專案 Label 解釋總體分配、校正與期限；子項目工時解釋該項目的估算依據。
- 任務標題後的 `N hr` 只是子項目最可能工時的總和，不重複提供說明或轉換成日數。
- 一般 Viewer 不顯示逐筆 session、歷史效率曲線、模型 prompt 或完整 AI 推理。
- Developer View 才能查看來源、信心、算法版本、實際投入與診斷。
- 所有可點擊 Label 必須能以鍵盤操作，使用真正的 button 語意並提供 focus 狀態。

### AI 分析與公式收斂

Agent 先依穩定 task/item id 與可驗證特徵尋找相似歷史資料，再由 AI 一併分析工程計畫中尚未能用固定公式表達的因素，例如規模、技術難度、未知技術的探索範圍、依賴關係、描述中的隱含工作，以及多種工程路線的取捨。人工參數、歷史證據、AI 分析與固定公式都以不同 contributor／欄位保存，不能壓縮成單一來源字串。AI 提出的方法與參數必須交給固定公式重算；仍無足夠依據時才使用 `system_default` 8 小時。系統完成結果後允許人工確認、補充參數或修正估值，三種行為必須分開記錄。人工有效版本不得被後續 Agent、AI 或預設值覆蓋。上下文切換與一般執行偏差優先由實際紀錄校正，避免 AI、人工緩衝與效率係數重複加成。AI 不直接改寫原始事件，也不能把沒有證據的推測標成事實。

每次 AI 分析至少輸出：

- 分析的 `as_of`、輸入範圍與 reference。
- 使用的假設與缺少的資料。
- 結果範圍，而不是只給單一精確時間。
- 信心等級與主要風險。
- 使用的分析規則或模型版本。
- 哪些結果來自固定公式，哪些仍是 AI 判斷。
- 專案工時依人工直接／混合／純 AI／預設等互斥結果模式的組成；contributors 另列，不作可相加的工時占比。

演進方式採逐步收斂：

1. Agent 先以任務類型、技術、規模、難度、新穎度與資料品質檢索歷史證據，再和人工參數、工程計畫一併交由 AI 分析。
2. AI 提出方法與未結構化判斷；確定的數值運算交由版本化公式，資料不足時使用 `system_default` 8 小時。
3. 人工可補參數、修改最後估值或確認結果；三者分別更新 inputs、估算版本或 `human_confirmed`，不可互相暗示。
4. 重複出現且可驗證的判斷整理成具名稱與版本的公式，AI 只接收例外與未結構化因素。
5. 將預測與後來的實際結果比較，校正公式、任務分類、有效樣本權重與信心範圍；算法改善不得改寫歷史結論。

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

- 在 `experiments/time-reference/` 定義 `time.config`、`time.estimates`、`time.events` 與 `time.analysis` 四份 Draft Schema。
- 定義四份 sidecar 與 `scope_id`、task id、穩定 item id 的配對規則；正式 item schema 升級前不接入現有字串項目。
- 為正常工作日、8／8／8、例外日、歷史證據、人工參數＋AI 分析＋固定公式的混合估算、預設 8 hr、人工直接估算、未知技術探索、固定交付界線、timebox 與未知資料建立範例。
- 定義 item 工時、task 日數、project 日數、收縮校準係數、時間進度、工作進度、進度壓力、急迫狀態、估算 contributors 與公式版本。
- 定義 schema 版本升級與舊 Viewer 的相容策略。
- 保留 NodaTime 為分析器抽成跨平台 library 時的候選依賴、OR-Tools 為多人排程的延後選用依賴；目前第一版不需要外部 package，未實際引用就不加入 third-party notices。

完成條件：同一套資料能分別表達「每日最多可排 8 小時」、「人工直接估算 6 小時」、「人工提供參數、AI 選擇方法、公式算出 30 小時但尚未人工確認」、「沒有計畫所以預設 8 小時」、「近期執行校正 85%」及「8/1 截止」，且各值不互相覆蓋或重複加總。

#### Time Phase 2：紀錄與確定性分析

- 狀態：`task-progress analyze` 的第一版確定性投影已完成；歷史相似度、完成樣本校準與進階 session 品質檢查仍待後續版本。
- 先支援人工或 Agent 寫入事件，不急著建立完整計時器 UI。
- 實作子項目估算版本選擇、預設一日、session 驗證、容量計算、收縮校準、工作日換算、時間進度與進度壓力。
- 將結果輸出為帶 `as_of`、輸入 reference 與算法版本的快照。
- 建立跨時區、跨午夜、未關閉 session、重疊 session 與事後補登測試。
- 建立無歷史資料時維持 100% 低信心基準、技術探索不重複扣除及期限顏色邊界的測試。

完成條件：對同一份輸入與同一個 `as_of`，分析結果可重現且不依賴 AI。

#### Time Phase 3：極簡 Viewer 時間參考

- 狀態：第一版已接入正式 Viewer；缺少 sidecar 時保持舊版畫面與資料相容。
- 工程估算與交付期限解耦已完成隔離 Demo 與正式 Viewer：未設定截止日時顯示「交付日未定」、保留工時分析並停用期限風險；期限區塊部分無效時也只隔離期限。詳細設計與驗證見 `Documentation/TimeEstimateDeadlineDecouplingPlan.md`。
- 正式整合前先用 `experiments/time-reference/demo/` 引用現有 Viewer stylesheet 與主要 DOM class；不得用另一套獨立 Dashboard 視覺判斷間距，實驗 CSS 只補時間元件。
- 專案總覽加入可點擊的「M/D 交付 ● ›」摘要按鈕；外部只顯示交付日與燈號，工程總預估工時及文字化判定放在點擊後面板。
- 任務卡第一行顯示有語意色的狀態膠囊與靠右的 `completed / total`；第二行在標題尾部顯示子項目總和的「約需 N hr」，不混用工作日換算。
- 子項目列永遠以 `hr` 顯示，點擊後區分 contributors、輸入參數、AI／規則方法、固定公式、估算依據與人工確認。
- 共用進度報告面板先顯示距離交付、預估未完成工時與風險，再以 `評估流程`、`工程估算`、`工作容量` 三個 tab 收納算法、容量、執行校正、預估組成與例外。
- 不以時間條取代現有工作項目進度，也不將兩者混成單一百分比。
- 讓使用者能追溯分析結果所使用的資料時間與方法版本。
- 驗證桌面與行動裝置密度、鍵盤操作、非顏色辨識及長工時數字不造成水平溢出。

完成條件：正式 Viewer 以可選 sidecar 顯示專案交付膠囊、task 工時、穩定 item 工時與三個總覽 tab；初始化及恢復預覽時重算風險；沒有或無效的時間資料不使基本報告失敗。第一版已達成。

#### Time Phase 4：AI 分析迴圈

- 定義 AI 可讀的最小分析輸入，避免每次讀取所有原始內容。
- 要求 AI 區分事實、公式結果、假設與推測。
- 保存預測範圍與最終實際結果，建立回測資料。
- 將已穩定的 AI 判斷逐步移入版本化公式與規則。

完成條件：算法改善後，AI 分析範圍比前一版更小且可說明；舊結果仍可依其版本追溯。

#### Time Phase 5：歷史校正與預測

- 依任務類型、技術、大小、難度、新穎度或其他可驗證特徵分組，並以相似度與資料品質計算有效樣本數，避免混用不可比較的歷史樣本。
- 比較預估、可用容量、實際投入、日曆經過與完成結果。
- 在樣本量與品質足夠時提供 P50／P80 或模擬結果。
- 持續檢查預測誤差與校準程度，必要時退回資料不足狀態。

完成條件：預測顯示範圍、信心、樣本基礎與版本，不只顯示單一日期。

### 尚待決定

以下事項不阻擋隔離 Draft Schema，留待原型檢視或後續 Phase 決定：

1. 工作 session 最終由 Agent 自動產生、人工確認或外部計時工具匯入，以及更正紀錄的操作流程。
2. 有效樣本相似度與資料品質的精確評分方式、歷史觀察窗口，以及 `k = 10` 是否適合；第一版固定不自動調整。
3. 多名執行者的平行效率、技術差異與溝通成本模型；第一版只驗證 `executor_count = 1`。
4. `time.analysis.json` Draft 何時移入正式 `schemas/` 並升為穩定版本；第一版已決定維持獨立投影，不放入 `report.json`。
5. 進度壓力 1.10／1.50 門檻是否經實際回測後需要調整；信心始終留在彈出面板，不改變主畫面顏色。

## 本機任務編輯 Draft 0.1

> 任務狀態、完成／待處理項目：`report.json` 的 `local-task-editing`；Developer 下一步、阻礙與決策：`report.dev.json` 的同 ID entry。

### 目標與第一版範圍

第一版只在可信任的本機 Viewer 提供編輯能力，公開 GitHub Pages 與非 loopback 網址繼續維持唯讀。既有報告載入、Developer overlay、時間 sidecar 與舊版字串項目仍須相容。

目前將需求解讀為：

- 使用單一頁面層級 toggle，固定於 viewport 頂部中央且不隨內容捲動；預覽時顯示「預覽模式」，按下進入編輯並改顯示「編輯模式」，再次按下直接放棄草稿回到預覽。
- 未開啟編輯模式時，不顯示刪除、單項編輯與新增控制。
- 開啟編輯模式後，每個子項目直接變成單列輸入列，包含明確的「刪除」、priority、描述輸入、既有工時膠囊與狀態；不再建立單項 task-content 編輯模式。工時膠囊目前只開啟唯讀估算明細。
- 任務卡的描述（目前資料欄位為 `task.summary`）在全域編輯模式直接變成 textarea，不提供局部「編輯描述」、取消或獨立儲存。
- `×` 只表示關閉 Dialog 並在圓形關閉按鈕置中；任務與子任務刪除使用明確的「刪除」文字鍵。全域儲存固定使用深色背景與白字，不能受亮色主題控制色影響而變成白底白字。
- 每張任務卡只在全部已完成／待處理子項目之後顯示一個膠囊狀「＋」；它不跟隨兩個子面板各自重複出現。按下後就地顯示輸入欄，新增項目歸屬於該任務卡並一律進入 `pending_items`／待處理。
- 工作項目清單底部另有最外層任務「＋」；新任務必填 title 與 summary，使用不依名稱的 stable task ID，預設狀態為 `planned`／待處理。
- 不受編輯模式限制，可拖曳狀態標籤調整優先序；「全部」固定不動。正式 Viewer 支援 `planned`、`in_progress`、`blocked`、`done`、`archive`，順序同步套用摘要卡與整張任務卡，因此卡片內的子面板會跟著移動；Demo 另會排序具有狀態的子項目。
- 排序屬於獨立的 browser-local 檢視偏好，拖曳後立即保存；它不修改任務資料、不讓全域「儲存」出現，也不寫入 `__task_content`。鍵盤可用 `Alt + ←／→` 移動目前標籤。
- Demo 的人工估算參數、正式 Svelte Editor 的 item estimate 與正式 Viewer 的工作容量沿用同一個全域模式；編輯模式開啟時直接顯示適用表單，不再顯示各自的局部「編輯」或取消按鈕。「重新計算」只預覽目前記憶體草稿；頁面唯一的全域「儲存」會再次重新計算，成功後才真正寫入與更新分析時間。正式 item estimate 已透過版本化 `time.estimates.json` 交易提供人工工時、依據與獨立確認。
- 新增內容先做 Unicode trim；空字串、只有空白或只有標點／特殊符號時不建立項目並結束新增。只要含有至少一個 Unicode 字母或數字，描述內的正常空白與標點可保留。
- Enter 儲存，Escape 或明確取消按鈕取消；失焦不默默建立空項目。
- 新增項目使用獨立於描述的穩定 ID，格式符合既有 schema；不從中文描述硬轉 slug，避免空 ID、碰撞或修改描述導致 ID 改變。

第一版不包含：

- 修改 task stable ID、Developer overlay 或正式時間估算參數；task title、summary、status 與 priority 已納入本機 Editor。
- 在公開網址開放寫入。
- 因新增項目而猜測 `0 hr`、預設工時或自動執行 AI。

### 本機與公開能力邊界

編輯控制不能只靠 CSS 隱藏。Viewer 必須先通過獨立的本機編輯政策，至少限制為由 Launcher 啟動的 exact loopback origin；公開來源不顯示編輯入口，也不讀取或套用本機編輯資料。

僅判斷 `localhost`／`127.0.0.1` 仍不足以授予檔案寫入權，因為其他本機網頁可能對 loopback 發出請求。若第一版需要真正寫檔，必須另設瀏覽器可使用、scope 限定、短生命週期的 edit capability，並保留現有 control token 不進入 URL、HTML、JavaScript 或瀏覽器儲存。

2026-07-30 已實作此邊界。TaskProgress Launcher 不修改共用 LocalWebService 的領域規則，而是啟動 `service/taskprogress_host.py` 包裝其通用 exact-file registry。只有被 Launcher 精確註冊且 `scope_id` 相符的 `report.json` 會回覆 capability；公開靜態部署沒有這組 API，因此頁首模式選單與儲存列保持 `hidden`。建立編輯工作階段及寫入要求都必須來自同一 loopback origin，並帶明確的 Editor header；短效 token 只保存在頁面記憶體，桌面 control token 不進入瀏覽器。

### 保存模型決策

`report.json` 是 canonical entry 可引用的結構化任務紀錄，但公開 Viewer 仍是唯讀介面。正式本機 Editor 已選定「直接回寫被 Launcher 精確註冊的來源 `report.json`」；隔離 Demo 的 browser-local overlay 繼續作為展示與回退，不宣稱修改專案報告。曾評估的方案如下：

1. **瀏覽器本機 overlay（建議作為 UI MVP）**：以 `report_id + scope_id` 與來源版本指紋保存於 `localStorage`。優點是不擴充服務、不碰來源檔；缺點是只在同一瀏覽器可見，Agent 與其他裝置讀不到。
2. **獨立 `report.local.json` sidecar（建議作為可交換的正式本機方案）**：本機服務原子寫入 overlay，Viewer 將它合併到 `report.json`。優點是保留原始投影且可由 Agent 讀取；缺點是需要定義 overlay schema、衝突規則與安全寫入 API。
3. **直接回寫 `report.json`（正式本機 Viewer 已採用）**：只有被 Launcher exact registry 註冊、檔案內 scope/report identity 相符時可寫。服務驗證完整 Draft 2020-12 Schema 與重複 ID，使用 SHA-256 revision／`If-Match` compare-and-swap，限制 1 MiB，同目錄 temporary file、flush、fsync 後原子取代；來源已變更、分析失敗或寫入失敗時拒絕提交並保留草稿。

在保存成功前，畫面不得先永久改變；失敗時保留輸入、顯示可行動的錯誤並允許重試或取消。成功後才更新目前 state、進度分數、篩選數量與 `updated_at` 顯示。若採本機 overlay，介面需顯示「本機修改」狀態並提供清除／還原來源資料的入口。

report 與時間輸入的正式儲存均已完成：全域模式可修改 task title／summary／status／priority、子項目 title／priority、新增或刪除兩層任務，也可修改交付日，以及穩定子項目的人工工時、人工依據與獨立人工確認。每張卡只在最底部保留一個新增待處理項目的「＋」。切回預覽直接從 persisted snapshot 重建，離頁只在 dirty 時警告。全域儲存以同一 transaction 更新 canonical report／config／estimates、建立 estimate supersede version、寫入遮蔽歷史並呼叫既有 analyzer；任一步驟失敗都回復全部來源。

工作容量介面不再持有第二套編輯狀態。預覽模式的「工作容量」頁完全唯讀；進入全域編輯後，標題精簡為「設定」的容量表單直接置於該頁最上方，不顯示「編輯工作容量」、局部「編輯中」或「取消」。面板內唯一動作是「重新計算」，它只把驗證後的容量 profile 套到記憶體分析並更新期限預覽，同時將全域草稿標為 dirty。全域儲存開始時才暫存 localStorage 變更；report 寫入成功後提交，失敗則回復原 localStorage。切回預覽會用 persisted capacity profile 還原分析及畫面。

### 正式人工估算編輯契約

正式 item estimate Editor 的第一個人工表單只提供三個可寫欄位：人工工時、人工依據與人工確認。人工直接輸入最可能工時時，系統以 `direct-human-estimate` 的版本化固定公式換算為該 estimate version 的 `likely_minutes`；`human_note` 保存人工原始依據，`human_confirmed` 只表示是否接受最後結果，不能由「曾填人工參數」自動推定。

AI 分析與同類歷史不各自產生一個數字再和人工工時平均。它們以 `contributors`、`analysis_method`、`template_id`、`effective_sample_count` 或具來源的 inputs 提供方法與證據；最後顯示值永遠來自同一 target 唯一 `active: true` estimate 的 `likely_minutes`。人工修改工時或依據時建立新的 `estimate_id`，以 `supersedes_estimate_id` 指向舊版，不覆寫歷史。資料完全不足時才採 `system_default` 8 小時與低信心。

介面中 AI 依據、歷史樣本、固定公式、估算範圍與 contributors 初版保持唯讀。按下「重新計算」只更新記憶體預覽；全域「儲存」必須在同一 scope/revision 交易中驗證並版本化寫入 `time.estimates.json`、重新產生 `time.analysis.json`，任一階段失敗都不得只提交 `report.json` 或部分時間資料。

2026-08-03 已完成正式 UX：工時與人工依據可以先套用為未確認草稿，只有明確勾選才寫入 `human_confirmed: true`；未勾選仍保留人工估算及依據，不會把「曾輸入人工資料」誤解為核定。隔離真實 Host 驗證先保存 10.5 hr 未確認版本，再以 11 hr 已確認版本 supersede，舊版失效、新版 active，正式分析器與 reload 都投影 11 hr。

### Editor 框架化與大改 Draft 0.1

> 這是正式 Editor 的後續架構計畫，不是停止或拆除目前 Demo 的通知。實作狀態與優先序仍由 `report.json`／`report.dev.json` 的 `local-task-editing` entry 指路。

目前的原生 Demo 已證明全域預覽／編輯模式、任務與子項目編輯、五級優先級、狀態排序、時間重新計算預覽、統一儲存及放棄草稿等互動方向。它仍是一套可使用的 UI MVP：

- 可直接從 `file://` 或 exact loopback 開啟。
- 編輯資料先停留在記憶體，成功儲存後才寫入該瀏覽器的 `localStorage`。
- 切回預覽模式會放棄未儲存內容並還原 persisted snapshot。
- 不會安全寫回 canonical `report.json`、`time.config.json` 或修改歷史，因此不能宣稱是正式跨工具 Editor。
- 唯讀 Viewer、公開 Pages 與既有 Launcher 流程不依賴框架改造，框架遷移失敗時仍可回到目前 Demo。

框架化的原因不是目前 UI 不直觀，而是狀態與交易邊界逐漸超出手動 DOM 更新適合承擔的範圍。正式 Editor 將同時處理 persisted／draft、跨檔案驗證、重新計算預覽、放棄、Undo／Redo、來源 revision、衝突、敏感歷史及寫入失敗恢復；若繼續把這些責任集中在單一 `app.js`，每次欄位新增都需要人工同步多組陣列、DOM 與 derived state，回歸風險會持續增加。

#### 目前實作盤點（2026-07-30）

目前不是完全未分層的「暴力寫法」。`report-model.js`、`time-model.js`、`status-order.js`、`priority-policy.js` 與本機 Host 已各自承擔純計算、policy 或安全寫入責任；scope capability、revision compare-and-swap、schema 驗證、原子取代及分析失敗回復也沒有混入畫面元件。

Editor UI 尚未模組化完成，但已不再從零開始。正式 Viewer 與 Demo 現在共用 Editor Core 的 `DraftSession`／commands／validation／diff／derived state／Undo／Redo，也完成 Editor Surface 的 `TaskCard` shell、`ItemRow`、優先級、全域模式 toggle、AddControl、欄位 validation、SaveBar 與 history controls 主要桌面契約；`app.js`、Demo `app.js` 與 `time-view.js` 只保留 domain validation、persistence 與時間插槽 adapter。本機 edit host 已提供可恢復的多檔案 transaction adapter，交付日、估算與私有遮蔽歷史 payload 均已接入。

因此目前定位是「單一 report 編輯核心、安全邊界、完整命令歷史、可恢復 multi-file 交易、Svelte 編輯元件、完整時間設定與人工估算，以及不改變 Viewer URL 的同頁本機編輯入口已完成，並有 157 項 Node、26 項 edit-host Python 測試保護」。入口統一不代表 UI 已統一：目前預覽由 `viewer/assets/app.js` 渲染，編輯是覆蓋在其上的同源 iframe，兩者是兩份 DOM、兩份樣式與兩個 header。這是先前架構邊界把「唯讀」和「編輯」切成兩層的結果，實際成本是每個共同畫面元素都要人工對齊一次，且對齊項目只會愈來愈多。下一步依新的架構邊界收斂成單一元件集，逐區搬移頁首、進度摘要、狀態篩選與任務卡；時間參考 Demo 自 2026-08-04 起凍結，不再作為開發目標。既有 Core、Schema、capability 與 transaction 邊界不得搬入 UI 元件。

#### Svelte 遷移 UX parity gate

Svelte 是 UI 組合技術的替換，不是重新設計。每個區塊開始實作前，先以既有 Viewer 為基準列出並凍結：內容順序、垂直／水平結構、按鈕目的地、Dialog 流程、文字、焦點與鍵盤、主題，以及桌面與 390px 行為。新元件只有在自動測試與實際畫面比對都通過後，才能取代舊 Surface。

目前時間區塊必須先恢復三項契約：

- 交付日位於時間設定最上方，其後才是每日分配、工作日及休假／容量例外。
- 時間設定的面板標題與編輯內容垂直排列，不使用左右兩欄重新詮釋既有版面。
- 任務項目的工時維持可點擊膠囊，點擊後進入既有時間彈出面板；人工工時、人工依據與人工確認放在彈出面板內，不在項目列展開 inline details。

若 parity matrix 尚未建立或畫面比對失敗，不繼續搬移下一個 Viewer 區塊，也不刪除舊實作。

##### 時間編輯 UX parity 修復 Draft 0.1（2026-08-10）

這一輪是既有 Viewer 操作的 settled port，不是新介面設計。實作入口為 `implementation-checklist.md`；以下規格是驗收依據，清單只追蹤本輪執行狀態。

**決策與理由**

- `TimeSettingsEditor` 使用單一垂直資訊流：標題、交付日、每日分配／工作日、休假與容量例外、重新計算。交付日影響後續所有估算，因此先於容量細節；標題與內容不可形成左右欄。
- `ItemRow` 的時間膠囊在預覽與編輯模式保持同一位置與同一入口。點擊後開啟既有的共享 `TimeDialog`，不在列內展開第二套人工估算表單。
- 人工工時、人工依據與人工確認在 `TimeDialog` 的項目內容中編輯。現有顯示值轉為可編輯狀態，不在唯讀內容後方追加重複表單。
- 套用人工估算只更新記憶體中的共用 draft 並標記全域編輯工作階段為 dirty；不直接寫檔。全域儲存才執行驗證、重新分析與交易寫入，切回預覽則放棄草稿。
- Host 只提供資料與 callbacks；共享 Svelte 元件持有 markup。不得為 Viewer、實驗入口或模式新增分支版 UI。

**驗收清單**

- [ ] 桌面與 390px 寬度下，時間設定標題與內容皆垂直排列，交付日是第一個可編輯區塊，沒有水平溢位。
- [ ] 有時間資料的項目在預覽／編輯模式都顯示同一顆可由滑鼠與鍵盤啟動的時間膠囊，位置不因模式改變。
- [ ] 編輯模式點擊膠囊後，人工工時、人工依據與人工確認出現在既有項目 `TimeDialog`；項目列不再出現 inline `<details>`。
- [ ] Dialog 以目前 draft 初始化欄位；合法套用後更新畫面與全域 dirty 狀態，錯誤留在 Dialog 內且不修改 draft。
- [ ] 關閉 Dialog 不等於儲存；離開全域編輯模式仍依既有 discard 契約還原，正式儲存仍走既有 preview／confirmation／transaction 流程。
- [ ] 關閉 Dialog 後焦點回到啟動它的時間膠囊；既有 Escape、關閉按鈕與背景關閉行為不退化。
- [ ] 原始 Svelte 元件、Viewer committed bundle 與針對性契約測試一致；沒有新增第二個時間 Dialog 或 host-specific markup。

**明確排除**

- 不修復或復活 `experiments/time-reference/demo/`；它仍是 retired reference。
- 不在本輪移除 standalone editor build，也不搬移其他 Viewer 區塊。
- 不決定無估算項目的「待估」建立入口、描述點擊入口、module 排序或 priority/status module 化。
- 不加入休假理由編輯、敏感歷史新欄位或新的 server transaction contract。
- 390px 只驗證 responsive layout 與鍵盤／滑鼠流程；真實觸控拖曳與行動裝置編輯仍屬獨立 P1 驗證。

**工作規模**

```text
Volume: deletes ~40–70 lines / touches 8–10 files / adds ~120–200 lines（含測試；另有 generated bundle）
Precedent: settled port；既有 ItemRow 時間膠囊與共享 TimeDialog 是 reference implementation
Proof: targeted Node tests | viewer:ui:build bundle parity | desktop browser | 390px browser
```

##### Standalone Editor 退場 Draft 0.1（2026-08-12）

同頁 Viewer 已是唯一正式編輯入口，host-only `editor.html` 不再有呼叫端。本輪刪除第二套入口及其發布負擔，但保留共用 Svelte 元件、Viewer bundle，以及隔離 spike 的 `index.html`／`main.js` 開發入口。

**驗收清單**

- [ ] 刪除 `editor.html`、`viewer-main.js`、`BuildEditor.cmd` 與專用 build verifier；package scripts 不再提供 standalone editor build。
- [ ] `Publish.cmd` 直接發布 Launcher，不再安裝 npm 依賴或要求 editor dist。
- [ ] edit host capability 只回傳同頁編輯所需資料，不再提供 `editor_surface_url`；`/__taskprogress/v1/editor/**` 路由完全退場。
- [ ] 移除 host-only URL 解析及綁定舊入口的測試，保留隔離 spike 與 production Viewer 的共享元件契約。
- [ ] README 與框架決策文件描述同頁 Viewer 為正式入口，並將獨立 Editor 建置標為已退場。
- [ ] 針對性 Node 與 Python 契約測試通過；不執行完整 test suite、Publish 或實機觸控驗證。

**明確排除**

- 不刪除 `experiments/editor-svelte-spike/index.html`、`src/main.js`、`App.svelte` 或共享 Svelte 元件。
- 不改變 edit session、revision、transaction、analysis 或公開唯讀 Viewer 契約。
- 不處理 Svelte accessibility warnings、行動裝置 pointer capture 或 retired time-reference Demo。

```text
Volume: deletes ~250 lines / touches 12–16 files / adds ~40–80 lines（主要為測試與文件）
Precedent: settled retirement；same-page Viewer 已是 reference implementation
Proof: targeted Node tests | targeted Python tests | source reference scan
```

##### 子項目狀態與模組膠囊列 Draft 0.1（2026-08-13）

子項目在預覽與編輯模式使用同一個 `ItemRow` 幾何結構；編輯只把相同位置的 priority、描述與狀態顯示切換成控制項，不重新排列欄位。第一版排列如下：

```text
Preview  ○  (優先級可省略) [描述：靠左且填滿]  {右側面板 [(模組膠囊…水平捲動)] (狀態)}
Edit     ○  [優先級]       [描述：靠左且填滿]  {右側面板 [(模組膠囊…水平捲動)] [狀態] [刪除]}
```

- 左側是自然內容流：項目標記、可選 priority、可伸縮描述。預覽時「未指定」priority 不建立空容器，描述立即靠左補位；編輯時 priority 下拉正常佔位。priority 與狀態不經過 module loader，模組失敗不得使它們消失。
- 描述取得右側 utility panel 以外的全部剩餘寬度。文字因空間不足而省略時，原生 tooltip 顯示完整描述；編輯 input 也使用同一個可用寬度。
- 有顯示的 priority badge 與編輯下拉使用相同寬度，避免不同標籤讓描述起點逐列晃動。左側項目標記同時表達狀態：待處理為 `○`、已完成為 `✓`，必須與右側狀態一致。
- 右側是一個共同 utility panel，固定依 `module strip → status → edit-only delete` 排列並整體靠右。狀態膠囊與狀態下拉在列高內垂直置中；Delete 插入狀態右側時，狀態可向左讓位，不預留空白 action 欄。
- 子項目第一版只有 `待處理` 與 `已完成` 兩個狀態。狀態命令移動同一個 stable item 至 `pending_items` 或 `completed_items`，保留 ID、title、priority、時間估算對應與 Undo／Redo；儲存後重算 task/project progress 並使受影響的時間投影失效。
- `item-inline` 模組膠囊集中在描述與狀態之間的右側 strip。內容保持單列、不壓縮核心狀態；寬度不足時 strip 自己水平捲動，不讓整張卡片產生水平 overflow。
- `time` 是第一個 module capsule reference。之後新增模組只向 strip 提供膠囊資料與 action，不修改 `ItemRow` markup。
- Core 擁有模組型別的預設順序與允許清單；使用者調整的左右順序是 browser-local view preference，不寫入 `report.json`、不觸發全域儲存。manifest 與 Renderer 都不能指定自己覆蓋其他模組的位置。
- 膠囊排序沿用既有 `StatusFilters` UX 與同一套純資料排序模型：滑鼠拖曳、觸控 Pointer Events（移動超過 8px 且鎖定水平軸後才視為拖曳）及鍵盤 `Alt + ←／→`。未超過拖曳門檻的點擊仍執行膠囊原本 action；調整後立即寫入 browser-local preference，並恢復目前膠囊的 focus。
- 文字「刪除」固定在狀態之後，只在編輯模式顯示且不屬於 module strip。預覽與編輯共用相同的水平順序與右側 panel；兩種模式的 control 外觀可以不同，不要求狀態在 Delete 出現前後維持完全相同的 X 座標。
- 共用 SaveBar 提供明確的「放棄」動作，沿用全域模式 toggle 已有的 discard 流程：關閉 edit session、還原 persisted snapshot 並返回預覽模式，不建立第二套草稿處理邏輯。

**驗收方向**

- 編輯子項目狀態後，同一 stable item 可在待處理／已完成間往返，保存、放棄、Undo／Redo、derived progress 與 time invalidation 都一致。
- 預覽與編輯共用 marker → optional priority → flexible description → right utility panel 的水平順序；priority 隱藏時不留空白，描述靠左，狀態控制垂直置中且只顯示一次。
- 沒有 time 或任何 module 時，strip 不留下空白膠囊；核心描述與狀態仍正常呈現。
- 多顆模組膠囊在桌面與 390px 維持右側單列 strip，可水平捲動，並可用與 `StatusFilters` 相同的拖曳、觸控及鍵盤操作改變 browser-local 順序；整頁沒有水平 overflow。
- 預覽模式不顯示刪除；切至編輯模式後刪除插入狀態右側最末端，右側 panel 仍靠右，狀態自然向左讓位。

**本輪不包含**

- 不把 task 的 `planned`／`in_progress`／`blocked`／`done`／`archive` 五態直接加入 item schema。
- 不在 manifest 保存 UI 排序，也不讓 module Renderer 直接操作 `ItemRow` DOM。
- 不實作第二個領域模組；Time 只作為第一個 capsule adapter 與排列驗證案例。

```text
Volume: touches ~8–12 files / adds ~180–300 lines（含 Core command、共享元件、樣式與測試）
Precedent: bounded extension of Editor Core + new shared module-strip pattern
Proof: targeted Editor Core tests | ItemRow source/DOM contract tests | viewer:ui:build | desktop and 390px browser
```

本機編輯能力由 TaskProgress edit host 對精確註冊且 `scope_id` 相符的報告動態回傳，不在 scope 設定或 `report.json` 保存 `editable`。Viewer、發布後 Launcher 與 edit host 必須版本一致；若舊版 Launcher 只啟動普通 LocalWebService，Viewer 會因 capability endpoint 不存在而安全地隱藏編輯入口。

#### 不變的產品與介面契約

- 保留目前以卡片為中心的直觀介面，不因換框架改成後台表格或多頁精靈。
- 頁首仍只有全域「預覽模式／編輯模式」，不恢復每個欄位的獨立編輯模式。
- 任務卡、子項目、優先級、時間表單、重新計算與固定持久化狀態列維持共用元件來源。
- 切回預覽模式遵循 persistence mode：自動模式等待提交完成；謹慎模式要求先儲存或放棄未提交草稿。
- 狀態標籤排序仍是立即保存的 view preference，不混入任務資料交易。
- 第一版正式 Editor 以本機桌面滑鼠與鍵盤為 P0；390px 版面與觸控編輯驗證列為 P1，不阻擋桌面版。

#### 架構邊界

預覽與編輯是同一份介面的兩個狀態，不是兩份實作。一張任務卡、一列子項目、一個時間面板欄位，在兩種模式下是同一個元件，差別只在它現在能不能編輯 —— 就像 UI 框架裡的 InputField 切換 `editable`，控制項本身不會換掉，位置與大小也不該改變。

```text
editor-core/
  DraftSession、EditCommand、Undo／Redo、validation、diff、derived progress、time invalidation

ui-components/
  任務卡、子項目、優先級、時間面板、表單、dialog、save bar、錯誤呈現
  每個元件同時負責預覽與編輯兩種狀態

local-service/
  transaction adapters、edit capability、scope/revision、原子寫入、重新分析、歷史與恢復
```

公開部署仍然只提供唯讀報告，但這是**打包範圍**的問題，不是架構分界：建置時分割，公開產物不含編輯分支，本機取得 capability 後才載入。先前把「Viewer 不載入編輯 UI」寫成架構規則，等於要求同一張卡片存在兩份實作，兩份就會各自漂移；輕量與共用應該同時成立，而不是二選一。

判斷準則：**如果一個畫面元素在預覽和編輯都看得到，它只能有一份實作。** 只在編輯模式出現的東西（刪除鍵、儲存列、新增控制）是同一份元件的編輯狀態，不是另一套介面。

Editor state 至少拆成四層：

```js
{
  persisted: { reports, timeConfig, revision },
  draft: { tasks, items, priorities, estimates, capacity, delivery },
  derived: { dirty, diff, progress, validation, timePreview },
  session: { mode, filter, expandedPanels, focusTarget }
}
```

`persisted` 只能在載入或成功提交後改變；所有輸入先產生 action 更新 `draft`，`derived` 由純函式重算。放棄等同以 `persisted` 重建 `draft`；儲存失敗不得把 staged state 誤標為 persisted。框架只負責讓 UI 成為 state 的投影，不能持有另一份隱藏的 canonical state。

#### 第三方方案候選

| 候選 | 適合點 | 主要疑慮 | 初步定位 |
|---|---|---|---|
| 保留原生 JavaScript | 零依賴、直接 `file://`、既有 Demo 已可用 | 複雜 draft、交易與元件生命週期仍需自建 | 保留為基準與可回退 Demo，不作正式大改首選 |
| Svelte | 元件語法接近 HTML，適合保留目前卡片版面；編譯後輸出靜態資產 | 需要新建置鏈、測試與團隊維護規則 | 2026-08-02 已完成第一個隔離 spike；尚未核准 production migration |
| Vue | template 與表單模型清楚，狀態與元件生態成熟 | runtime 與應用規範較目前更重，需要避免把 domain logic 寫進 component | 暫不安裝；只有 Svelte 無法達到 parity 時才啟動比較 |
| React | 生態、測試與複雜應用案例充足 | 對目前 HTML-first 介面可能帶來較多樣板與狀態選型成本 | 若未來需要更大型團隊或既有 React 整合再採用 |
| Lit／Web Components | 可逐元件嵌入現有頁面，Viewer 與 Editor 可能共享 custom elements | 複雜應用 state、交易與路由仍需自行建立約束 | 適合局部漸進升級，不先假設能取代完整 Editor 架構 |

候選比較不得只看 bundle 大小。Spike 必須以同一段真實流程實作：切換編輯、修改 task summary、修改子項目 priority、新增／刪除／復原、重新計算預覽、放棄、儲存失敗保留草稿。比較項目包括元件清晰度、純 core 可測性、鍵盤與 focus、錯誤隔離、建置輸出、CSP、依賴更新成本及與 LocalWebService 的整合。

正式 Editor 本來就需要 loopback 寫入服務，因此不要求框架版繼續以 `file://` 作為正式執行方式；`file://` 支援由現有 Demo 保留，作為互動展示與緊急回退。框架建置產物仍須是可由 LocalWebService 靜態提供的相對路徑資產，不得依賴公開 CDN 或把 capability 寫進 bundle。

#### 遷移階段

1. **Framework Phase 0—凍結可用基準**
   - 保留目前 Demo、正式本機 Editor 及原先 102 項 Node 基準測試；Editor Core、Editor Surface、共用 presentation contract 與 Svelte adapter／loader／time draft／delivery preview 契約測試擴充後目前共 155 項。
   - 桌面滑鼠／鍵盤的草稿放棄、固定儲存列與真實檔案儲存 E2E 已完成；行動版與觸控另列 P1。
   - 把目前畫面、文字、模式切換、儲存與放棄語意視為遷移驗收規格。

2. **Framework Phase 1—抽離 framework-neutral core**
   - 從 `app.js` 抽出 editor state、actions、dirty/diff、discard、validation、progress recalculation 與 time invalidation。
   - 純 core 不讀 DOM、`localStorage` 或 framework API；以 task/item stable ID 定位。
   - 目前 Demo 先改用相同 core，證明抽離沒有改變 UI。
   - 2026-07-30 已完成第一段：新增 `viewer/assets/editor-core.js`，抽出 report DraftSession、task／item stable-ID commands、dirty、discard、commit 與獨立 save snapshot；正式 Viewer 的任務／子項目 mutation 與儲存準備已改走此 core，且純 Node 測試覆蓋 clone、legacy item 正規化、修改、刪除、放棄、dirty 回復、save snapshot 及錯誤 command。
   - 2026-07-30 第二段已完成：Core 以既有 `report-model.js` 規則產生 validation 與 task/project derived progress，並輸出 stable-ID diff 及精確的 time invalidation targets。正式 Viewer 已改讀 derived progress；新增、刪除、task status/progress 或 pending/completed 歸屬變更會停用舊工時投影並顯示「時間待重新分析」，只修改 title、summary 或 priority 則保留有效估算。
   - 2026-07-30 第三段已完成：將 Core 主體移至可由傳統 `<script>` 使用的 `viewer/assets/editor-core-runtime.js`，`viewer/assets/editor-core.js` 保留為正式 Viewer 的 ES module wrapper。file／loopback Demo 透過 adapter 將既有 task definitions、子項目與 base progress 投影為 report draft，所有描述／優先級／新增／刪除／復原 mutation、dirty、整體進度、時間失效、儲存 commit 與切回預覽 discard 均使用同一 DraftSession；localStorage 與程序式 DOM 仍留在 Demo 邊界。
   - 2026-07-30 第四段已完成：新增 classic-compatible `editor-surface-runtime.js` 與正式 Viewer ES module wrapper，讓兩個 host 共用 `TaskCard` shell、狀態／fraction／task ID 無障礙結構，以及優先級徽章與下拉；各自的狀態外觀與 class 暫由 presentation adapter 保留。
   - 2026-08-02 第五段已完成：依下列 parity matrix 抽出共用 `ItemRow`。Surface 統一 row、title、priority badge/select、編輯 input、文字刪除、無障礙文字與 callback；Viewer／Demo 只透過 presentation adapter 保留 class／排列差異，並以 extension slots 注入工時、`待估` 與 Demo 狀態文字，沒有 host identity 分支。
   - 2026-08-02 第六段已完成：抽出共用 `ModeController`，統一預覽／編輯 toggle 的 current-mode 文字、`aria-pressed`、切換提示、available／busy、root `data-view-mode` 與 host transition callback。Demo 移除模式 dropdown，改用與正式 Viewer 相同的再次按下即回預覽／放棄草稿語意；capability 與 draft lifecycle 仍留在 host adapter。
   - 2026-08-02 第七段已完成：抽出共用 `AddControl`，統一 collapsed `＋`、子項目／最外層任務表單、欄位順序、建立時優先級、取消／Escape、focus、錯誤 alert 與無障礙文字；Viewer／Demo presentation adapter 保留 class 差異，host callback 保留 Unicode 驗證、stable ID 與 Editor Core command。Viewer 新資料使用 `creationDefaultValue`，不再誤用 legacy fallback。
   - 2026-08-02 第八段已完成：抽出共用欄位 validation 與 `SaveBar`。Surface 統一 native validity／`aria-invalid`、第一個錯誤 focus／report、重新輸入即清除舊錯誤，以及 clean／dirty／saving／error、按鈕 disabled、`aria-live`／`aria-busy` 與狀態文字；Viewer 保留 scope/revision HTTP 寫入，Demo 保留 localStorage／time preview adapter。
   - 2026-08-02 第九段已完成：Editor Core 加入上限可控的 Undo／Redo snapshot history，同一 task／item 欄位的連續輸入合併為一筆、分支修改清除 redo，discard／commit 會清空歷史。Viewer 與 Demo 的共用 SaveBar 顯示「復原／重做」，並支援 `Ctrl/Cmd+Z`、`Ctrl/Cmd+Shift+Z` 與 `Ctrl/Cmd+Y`；Demo 原本僅能復原最後一次刪除的提示已由完整 command history 取代。
   - 2026-08-02 第十段已完成：本機 edit host 新增同資料夾、允許清單限定的 `LocalFileTransaction`。它先執行 staged validators，為 `report.json`、`time.config.json`、`time.estimates.json`、`time.analysis.json` 與私有 `taskprogress.local.json` 建立隱藏備份及 journal，再提供 apply／commit／rollback；prepared／applying 中斷會在下一次 capability、session 或 save 前恢復，committed journal 只清理。既有 report save 已改用此 adapter，分析器失敗會同時復原 report 與原有 analysis。
   - Phase 1 的主要桌面 Surface、report command history 與跨檔案交易邊界已完成；第一個隔離 Svelte parity spike 也已完成。四張靜態 fixture 卡不阻擋下一個真實資料 shell 階段。

#### ItemRow parity matrix

ItemRow 是每張任務卡內的一筆子項目。這份矩陣已於 2026-08-02 凍結並落地；它先把兩個 host 的差異分成三類，避免共用模組內出現環境名稱判斷：

2026-08-04 補上單一排列契約：**ItemRow 只有一種排列。預覽與編輯的差別只在欄位是否可編輯，不在順序，也不在結構。** 排列固定為 `優先 → 標題 → 內容 → 尾端`，`刪除` 只在編輯模式存在並固定接在共用欄位之後，因此切換模式時共用欄位不會移位。這條刻意不開放給 host 設定：先前的 `itemEditOrder` 旋鈕讓同一個共用元件長出三種順序（預覽一種、Viewer 編輯一種、Demo 編輯一種），旋鈕本身就是漂移來源，值改回來只是治標。

| 項目 | 共用契約 | Host 差異處理 |
|---|---|---|
| 欄位排列 | `ITEM_ROW_ORDER` 常數，兩種模式、兩個 host 共用 | 不可設定；host 無法覆寫順序 |
| row、title、priority、編輯 input、刪除按鈕與無障礙文字 | 由 Editor Surface 建立 | class 由 presentation adapter 提供 |
| title／priority／delete 事件 | Surface 只發出 callback | Viewer 與 Demo 各自轉成 Editor Core command |
| 工時膠囊、`待估` 與狀態文字 | 定義為尾端 extension slots | Demo 可放工時與狀態；Viewer 依 time sidecar 放工時，完成狀態仍由所屬面板表達 |
| legacy string item | 支援唯讀 title | 進入編輯 session 後仍由 Editor Core 正規化為 stable item |
| 新增列、Undo／Redo | 不屬於 ItemRow | 已由共用 AddControl、SaveBar history controls 與 Editor Core command history 處理 |

3. **Framework Phase 2—候選 spike 與決策**
   - 2026-08-02 已選 Svelte 作第一候選，於 `experiments/editor-svelte-spike/` 實作 `App`／`TaskCard`／`ItemRow`／adapter；直接委派正式 Editor Core，涵蓋 task／item 欄位、priority、add／delete、Undo／Redo、validation、discard 與 memory commit。
   - Svelte、Vite 與 plugin 僅為 devDependencies；`package-lock.json` 固定版本，`base: "./"` 產生 GitHub Pages／LocalWebService 可用的相對資產。155 項 Node 與 production build 通過，npm audit 為 0 vulnerabilities；結果與後續 gate 記錄在 `Documentation/EditorFrameworkDecision.md`。
   - Vue 暫不安裝。若 Svelte 在真實 Viewer data、鍵盤／focus、CSP、儲存錯誤或行動版 parity 失敗，才啟動 Vue 比較；未通過這些 gate 前不開始整頁搬移。

4. **Framework Phase 3—Editor shell parity**
   - 2026-08-02 已完成第一段：隔離 Svelte shell 沿用 Viewer 的 query precedence、report schema 與 time inspection，支援 `?scope=`／`?report=`、多任務、optional time 404、無效 time／deadline 隔離及 task／item 工時膠囊；以 `reports/example` 真實資料契約測試，編輯仍只 memory commit。
   - 2026-08-03 已完成第二段：Svelte shell 會探測 scope capability，只有受保護 session 才取得 private config／estimates；交付日與人工工時／依據各自進入 time-input draft，與 report draft 共用全域模式及單一儲存。人工估算以新 version supersede 舊 active estimate，沒有直接改寫衍生 analysis。
   - 2026-08-03 已完成第三段：config 缺檔時 edit host 依 session 提供的瀏覽器 timezone 建立並自行 Schema 驗證 8/8/8 模板，只回傳於 private `input_defaults`，不寫檔。Svelte 明示單人、平日 09:00–17:00 與 8/8/8 內容；使用者按下建立才複製到 draft，仍可切回預覽放棄，最後沿用 multi-file save 寫入。
   - 2026-08-03 已完成第四段：交付日套用草稿時必須填修改原因，UI 明示原因不得包含敏感原文；回復 persisted 交付日會移除待送 history request。client 只送 field path／reason／actor，前後值與指紋由服務端依 canonical source 產生。
   - 2026-08-03 已完成第五段：`POST /__taskprogress/v1/edit-sessions/{scope}/preview` 在 revision 保護下，把同一份 report／config／estimates 草稿與只讀 events 複製到暫存目錄，再執行正式分析器；canonical files 與 edit session 都不變。Svelte 顯示原／新交付日、風險、剩餘容量、餘裕／缺口與非敏感原因；全域儲存只對實際交付日變更開啟 native dialog，`返回修改` 保留草稿，`確認儲存` 才進入原有 transaction。任何 report、time input 或欄位變更都會讓舊預覽失效。
   - 2026-08-03 已完成第六段隔離瀏覽器 gate：以暫存實檔跑完桌面與 390px 的預覽／返回／確認，確認視窗預設聚焦較安全的 `返回修改` 且 Escape 會關閉並保留草稿；分析失敗與來源 revision 衝突也保留草稿。確認儲存會寫入暫存 canonical files 並建立不含日期原文的遮蔽歷史。390px 無水平溢位、固定 SaveBar 對齊內容面板、console 無 warning／error；過程修正確認視窗 Escape handler 與行動版 time editor desktop-grid 殘留。這項 gate 使用確定性 QA analyzer adapter，不等同正式分析器端對端驗證。
   - 2026-08-03 已完成第七段本機 Viewer 接合層：Vite 同時產生隔離 spike 與 host-only `editor.html`，正式入口要求 capability 才顯示模式控制。TaskProgress edit host 只有在建置入口存在時才於 capability 回傳固定同源 `editor_surface_url`，並以 traversal-safe、`no-store` 路由提供資產；正式 Viewer 只接受 `/__taskprogress/v1/editor/` 下的同源 URL 並在使用者按全域模式 toggle 後導向。沒有建置時仍沿用舊編輯器，公開 Pages 沒有 API、路由或入口。
   - 2026-08-03 已完成第八段正式 Host／分析器端對端 gate：隔離真實 edit host 由 Viewer toggle 導向 host-only Svelte；建立缺檔 8/8/8 config、交付日草稿、正式 analyzer preview、儲存前確認與 multi-file transaction 均成功。驗證修正兩個接合缺口：host API 深層路徑下 scope report 必須解析至同源 `/reports/`；首次產生 `time.analysis.json` 後 edit host 必須同步註冊公開唯讀 exact route。reload 後載入六張 task 工時，私有 history 不含日期原文，console 無 warning／error；隔離服務與全部暫存檔已清除。
   - 2026-08-03 已完成第九段可重現封裝：新增 `BuildEditor.cmd`，正式路徑先依 `package-lock.json` 執行 `npm ci`，再由 Vite 產生隔離／host-only 雙入口並檢查相對資產、遠端載入、動態程式、敏感檔名與本機絕對路徑。`Publish.cmd` 只有在此 gate 成功後才執行 `dotnet publish`；輸出仍在忽略的 `experiments/editor-svelte-spike/dist/`，docs sparse checkout 與 dispatch 只涵蓋 `viewer/`，因此 Pages 不取得 Editor bundle。本段實際驗證兩種 BuildEditor 路徑與 Launcher integration，但沒有發布 EXE 或 Pages。
   - 2026-08-03 已完成每個穩定 item 的人工工時、人工依據與獨立確認 UX，並通過正式 Host 的 version supersede／重新分析／reload gate；下一步補實機觸控。正式切換前 Viewer／Demo 都保留。
   - 2026-08-03 已抽出 `viewer/assets/editor-presentation.css` 作為 framework-neutral geometry contract；Viewer、Demo 與 Svelte 共用 960px 內容 shell、頂部 mode dock、卡片間距／padding／radius 與子項目基準尺寸，host stylesheet 僅保留主題色與 domain-only 面板。之後遇到多 host 的新 UI 行為，先在 Core／Surface／presentation contract 建立單一來源，再由 host adapter 接入，不複製實作。
   - 沿用目前 CSS token 與可見版面，不同時進行視覺重新設計。
   - 以 feature flag 或獨立本機路徑保留舊 Demo，兩者可並行比較。

5. **Framework Phase 4—安全寫入整合**
   - report.json 已接上 scope 限定、短生命週期 capability、revision compare-and-swap、schema 驗證與可恢復 transaction adapter。
   - 2026-08-03 第一段已完成：建立 edit session 時才讀取 `time.config.json`／`time.estimates.json`，逐檔執行 Draft 0.2 Schema、scope、大小與 JSON 驗證，回傳 private `inputs` 與獨立 SHA-256 `inputs_revision`；公開 capability 不回傳內容，session 後外部修改任一輸入會讓 report save 拒絕覆蓋。缺少檔案以 `null` 表示，讓後續 Editor Core 可安全建立初始模板。
   - 2026-08-03 第二段已完成：`PUT /__taskprogress/v1/edit-sessions/{scope}` 接受完整 report、`inputs_revision` 與選擇性的 config／estimates replacement。缺少的 input key 表示保留原檔，不提供刪檔語意；服務同時檢查 report `If-Match` 與 private inputs revision，逐檔限制大小並再次 staged validate，將 report／config／estimates／analysis 放入同一 transaction，分析失敗整批 rollback，成功才回傳最新 inputs 與旋轉後 token／雙 revision。舊 report-only route 委派同一 commit path，保持相容。
   - 2026-08-03 第三段已完成：新增 `schemas/taskprogress.local.schema.json`。multi-file save 要求獨立 `local_revision`，交付日實際變更必須且只能帶一筆原因；服務端建立 `set`／`change`／`clear` 事件、actor、redacted flag、存在狀態及前後 SHA-256 指紋，不保存 delivery 原文，並拒絕原因中的 ISO 日期。`taskprogress.local.json` 與 report／config／estimates／analysis 同一 transaction；私有歷史寫入失敗會整批 rollback，外部歷史修改也會拒絕 stale session。
   - 2026-08-03 第四段已完成：交付日 preview route 重用相同 session、report `If-Match`、`inputs_revision` 與 `local_revision`，但只在 OS 暫存目錄執行分析，不旋轉 session、不建立歷史，也不接觸 canonical transaction；預覽失敗只回傳錯誤並保留原草稿。
   - 下一步把同一 history contract 擴充到其他核定敏感欄位；目前只允許 `time.config.project.delivery_at`，不接受任意 client field path。
   - 儲存成功後才更新 persisted；衝突、分析失敗或歷史失敗時保留 draft。
   - 完成交付日、敏感修改歷史及跨檔案 diff 後，才宣稱正式 Editor 可取代 browser-local Demo。

6. **Framework Phase 5—切換與收斂**
   - 桌面正式流程通過後，由 Launcher 導向新 Editor；唯讀 Viewer 不變。
   - 舊 Demo 保留為 experiment/reference，直到新 Editor 完整覆蓋所有已核定互動及回退演練。
   - 移除舊路徑前必須確認沒有唯一功能、唯一資料遷移能力或未轉移測試。

#### 大改驗收條件

- 使用者可不重新學習操作完成目前 Demo 的全部流程。
- 任一 action 可用純 core 測試重現；UI 不直接修改 canonical report object。
- 切回預覽、Undo／Redo、儲存成功、儲存失敗與來源衝突各有單一且可驗證的 state transition。
- framework bundle 不含 control token、private reason、來源絕對路徑或動態可執行 report code。
- 公開 Viewer bundle、公開報告 schema 與既有 link-first URL 不因 Editor 框架化而變重或失效。
- 舊 Demo 在遷移期間持續可用；任何階段未達 parity 都不得以未完成框架版取代它。

### 交付日編輯與敏感修改歷史 Draft 0.1

> 實作狀態與待處理項目：`report.json` 的 `local-task-editing`；Developer 下一步與阻礙：`report.dev.json` 的同 ID entry。

交付日的 canonical 輸入是 `time.config.json` 的 `project.delivery_at`；`time.analysis.json` 是分析器產生的公開衍生快照，不得由 Viewer 直接修改。初版必須支援設定、修改及清除期限為「交付日未定」，並以日期、時間與目前 timezone 明確呈現排他的截止瞬間，不能只用日期猜測當日 `00:00` 或 `23:59`。

編輯模式中的初版互動：

- 交付膠囊與時間報告面板在全域編輯模式顯示日期、時間、唯讀 timezone、交付日未定切換及修改原因。
- 尚未儲存時使用 draft 重建容量時間線及期限風險，只作預覽，不改寫來源或歷史。
- 與其他任務修改共用固定於 viewport 底部、右緣對齊內容面板的全域「儲存」；離開或 reload 前沿用未儲存內容保護，切回預覽模式則直接放棄草稿。
- 儲存時檢查 `scope_id`、來源 `updated_at`／內容指紋及目前 revision，禁止另一分頁或 Agent 更新後仍採最後寫入者覆蓋。
- 服務先驗證 staged `time.config`，執行既有確定性 `task-progress analyze` 並驗證新 `time.analysis.json`；全部成功後才提交。估算工時不因交付日改變而重算，容量時間線、時間進度與期限風險必須重算。

敏感修改歷史：

- 歷史只存在本機且不得註冊為 Viewer 靜態路由、寫入 `report.json`／`report.dev.json`、投影到公開 `time.analysis.json` 或發布至 Pages。
- 一般欄位可記錄 before／after；敏感欄位只記錄欄位路徑、操作、時間、操作者類型、修改原因、遮蔽標記及前後值指紋，不保存可還原的原始舊值。
- 第一版操作者只區分 `human`／`agent`／`system`；瀏覽器無法可靠證明真實身分，因此這是可追蹤修改歷史，不宣稱為法律或資安稽核身分證明。
- 建議以 scope 限定的 `taskprogress.local.json` 同時保存目前 override、來源 revision 與 append-only history，讓一次原子取代可同時提交有效值與對應事件。若最終選擇直接回寫 `time.config.json`，必須另設 prepared／committed journal 或可回復交易，避免資料已變更但歷史遺失。
- 一般交付日期可從歷史建立「還原此版本」草稿；敏感值因不保存原文，歷史不能自動還原，只能再次輸入新值。

2026-08-03 初版已落地於 `schemas/taskprogress.local.schema.json` 與 edit host：目前 delivery 視為敏感欄位，只保存遮蔽事件及指紋，因此不提供從歷史自動還原原值；若日後將一般交付日改列非敏感，必須另行版本化 Schema 與遷移規則，不能讓既有遮蔽事件突然取得原文。

初版完成條件：

- exact loopback 之外沒有編輯或歷史入口，loopback 也必須取得 scope 限定、短生命週期的 edit capability。
- 設定、修改、清除交付日後能產生有效且版本相符的分析快照；任一步驟失敗時保留舊資料。
- 歷史與目前 override 同一 revision 提交，敏感值不會出現在瀏覽器儲存、URL、公開報告、診斷或歷史原文。
- 通過日期／時區／過期期限、無期限、來源衝突、分析失敗、歷史寫入失敗、桌面、390px、鍵盤與 reload 測試。

### 任務入口與報告更新規則

- `tasks.md` 只保存穩定 Task ID 與 canonical entry 的路由，不保存進度、估算、需求、下一步或驗證結果。
- `plan.md`／`handoff.md` 依共用規則維持 canonical：plan 保存長期產品設計、架構理由、資料契約與驗收條件；handoff 保存目前狀態入口、即時 claim、工作樹、服務狀態與交接注意事項。
- canonical entry 可以用報告路徑及 Task ID 指向 `report.json` 的 task 狀態、項目與進度，或指向 `report.dev.json` 的 next step、blocker、decision 與 route。這個指路本身就是 canonical 紀錄，不必再複製被指向的內容。
- `report.json`／`report.dev.json` 仍是 Viewer 投影；當 canonical entry 已明確指向它們時，plan／handoff 不保留第二份相同清單。
- 時間來源與分析結果同樣由 canonical entry 指向 `time.config.json`、`time.estimates.json`、`time.events.json` 及 `time.analysis.json`，不在 plan／handoff 複製數值。
- 沒有對應 report 時，plan 或 handoff 必須完整記錄 task／Developer 狀態。report 建立並由 canonical entry 接受為目標後，原處改成指路；若 report 移除或失效，canonical entry 必須恢復足以交接的完整內容。
- 若 report 與 repository／測試事實不一致，以可驗證的 repository reality 為準並修正 report；不能用在 plan／handoff 再寫一份不同內容來迴避衝突。
- 不建立額外 `task.json`。只有未來 Viewer／外部工具需要直接建立及修改 canonical 任務，而且 Markdown 已無法可靠交換時，才另行設計具版本、穩定 ID、衝突與 Schema 驗證的 task entry 格式。
- 當人類提供足以確認 scope、Task ID、目標、目前狀態與已驗證事實的描述時，Agent 更新 canonical entry 指向的資料，並維持指路有效，不做跨檔同步複製。只有提供或維護時間輸入，或明確要求估算／期限風險時，才執行分析器更新 `time.analysis.json`；不能只因任務文字改變就猜測工時或期限。

### 編輯互動與資料操作

編輯模式是頁面層級狀態，重新載入後預設關閉。切換篩選器或重繪任務卡時不得遺失尚未送出的輸入；使用者切回預覽模式代表明確放棄本次未保存內容，直接還原 persisted snapshot，不再以驗證訊息阻止模式切換。

隔離 Demo 採 browser-local overlay 驗證互動，並以以下原型決策實作：新增的是卡片內尚未完成子項目；每張卡片底部使用一個 `＋`；刪除後提供「復原」；`summary` 與所有 item title 都直接受全域編輯模式控制，並共用一個固定在 viewport 底部、右緣對齊內容面板且不隨內容捲動的全域「儲存」；描述至少包含一個 Unicode 字母或數字。這些決策不自動核准正式 Viewer 的持久化模型。

狀態排序（檢視偏好，不是資料編輯）：

- 正式 Viewer 與 Demo 都能拖曳狀態標籤；「全部」維持固定，其他標籤的普通 click 仍然執行過濾。
- 正式 Viewer 將 `planned` 任務與 `pending_items` 統一投影為「待處理」檢視群組，但 `archive` 維持「已封存」且不加入待處理。標籤數量是符合條件的任務卡數量，避免混合 task 與 item 兩種單位。
- 點擊「待處理」會顯示狀態為 `planned`，或至少有一個 `pending_item` 的任務；因此它是可與「進行中」重疊的工作檢視，不改寫任務的原始狀態。
- 正式 Viewer 的標籤順序同步套用到摘要卡與整張任務卡；卡片內的「待處理／已完成」子面板也依兩個標籤的相對順序排列。同一狀態群組內先依 priority、同級再依報告原始順序穩定排列。Demo 另會同步排序狀態可辨識的子項目。
- 正式 Viewer 立即寫入獨立的 `taskprogress.viewer.status-order.v1` localStorage key；Demo 使用 `taskprogress.time-reference-demo.status-order.v1`。兩者都不修改 report、不進入 `__task_content`、不受本機 edit capability 限制，也不觸發全域「儲存」。
- Demo 舊版若曾把 `status_order` 寫入 `__task_content`，第一次載入可作為遷移來源；後續只讀寫獨立檢視偏好。
- 桌面可使用原生拖曳，觸控以 Pointer Events 支援水平拖曳；鍵盤使用者可用 `Alt + ←／→` 移動目前標籤。三者共用相同的純資料排序模型。

#### 優先級資料與排序

- 優先級是 task 與 item 各自的資料屬性，不是狀態過濾器，也不得從 `title`／itemName 前綴解析。兩層只保存 `priority: 0 | 1 | 2 | 3 | 4`；共享 `viewer/assets/priority-policy.js` 統一提供 minimum、maximum、預設值、名稱、格式與色彩語意。
- 目前投影為「立即、優先、一般、次要、未指定」；只有標籤設定失效時才顯示 `P0` 到 `Pmax`。task、`completed_items` 與 `pending_items` 繼續相容缺少 priority 的舊資料；缺少欄位與新建任務／子項目都使用 `4`「未指定」，只有使用者明確選擇才保存較高優先級。
- 正常預覽不為「未指定」建立標籤，但編輯下拉保留「未指定」。共享 policy 必須確認 minimum 到 maximum 每個整數都有唯一且非空白的標籤；任一標籤設定不完整時，暫停隱藏規則，任務卡、子項目與編輯下拉統一只顯示 `P0` 到 `Pmax`，不得影響原始數值、排序或儲存。
- 正式 Viewer 先依可拖曳的狀態順序排列任務卡，再於同狀態內依 priority 穩定排序；每個已完成／待處理面板也使用相同五級排序。同級維持 report 原始順序，不新增優先級過濾器。
- Demo 編輯模式用原生選單同時修改任務卡與子項目的五級 priority，新任務及新子項目預設「未指定」。task／item priority 與 item status 下拉先用 policy／清單歸屬正規化並以受控值初始化，缺少 priority 不得讓原生 select 自動落到第一項「立即」。下拉與可見預覽標籤都由共享 policy 格式化；有效標籤只顯示名稱，不加 `P0` 等數值前綴，改標籤文字不修改 report、排序或既有任務資料。
- priority 變更與 title、子項目及時間草稿由同一個全域儲存提交。優先級是可見資料提示與排序依據，不是完成狀態；P0 等開發工作優先簡稱仍可存在於計畫文字，但不得作為 Viewer 的顯示名稱。

任務描述編輯：

- 在全域編輯模式中，對應任務卡的 `summary` 直接替換為輸入欄；不顯示局部編輯按鈕、取消或第二個儲存動作。
- 套用與新增項目相同的文字規則，並遵守 schema 的 1–1000 字元上限。
- 由頁面唯一的全域「儲存」一起提交描述、子項目、人工估算參數與工作容量草稿；全部驗證成功後才保存並統一重新計算。儲存後不改變 task ID、status、title 或 Developer overlay。

子項目編輯：

- 編輯可改 `title` 與 `priority`，不改 stable item ID，也不在「已完成」與「尚未完成」間自動移動。
- legacy string item 第一次成功修改時，在本機編輯層正規化為 `{id, title, priority}`；產生的 ID 必須在該 task 的兩份清單間唯一。
- 新增項目一律是按下「＋」所在任務卡的尚未完成項目；Demo 立即更新該卡 fraction，新項目的時間顯示為「待估」。

子項目刪除：

- 「刪除」只在編輯模式顯示，且有包含子項目描述的明確 accessible name。
- 刪除必須有可恢復機制。第一版採「刪除後顯示復原，尚未離開頁面前可撤銷」或「刪除前確認」其中一種，不做無法復原的單擊刪除。
- 刪除最後一個子項目後，progress 會依既有 fallback 規則改以 `task.progress` 或 task status 計算；是否同時移除可能已過期的 explicit `progress` 必須另行決定。

### 與時間參考的同步

`time.analysis.json` 以 stable item ID 參照工程估算。只修改項目描述可安全保留原估算；新增、刪除或移動項目則會讓目前時間分析快照過期。

第一版不得繼續顯示看似已同步的 task／project 工時。發生結構變更後應：

- 標記時間參考為「資料已變更，等待重新分析」。
- 隱藏或停用受影響的 item、task 與 project 工時數值，不能補零或沿用錯誤加總。
- 保留交付日期等不依賴項目組成的資訊與診斷。
- 等新的 `time.analysis.json` 版本與目前 report／overlay 指紋相符後，再恢復完整時間顯示。

若第一版無法建立可靠的版本配對契約，較安全的降級方式是在偵測到結構性本機修改時停用整個時間 sidecar，並清楚說明原因。

### 衝突、驗證與恢復

- 保存前再次執行與 `report-model.js`／JSON Schema 等價的文字、ID、重複項目與長度驗證。
- 本機 overlay 必須記錄來源 `report_id`、`scope_id`、`updated_at` 或內容雜湊；來源變更後不得把舊的 index-based 修改靜默套到新資料。
- 所有 mutation 以 task ID 與 stable item ID 定位，不以畫面索引定位。
- 同一項目若已在另一頁籤或由 Agent 更新，顯示衝突並要求重新載入或人工選擇，不採最後寫入者直接覆蓋。
- 若選擇檔案 sidecar／直接寫檔，服務先寫同目錄 temporary file、flush、驗證，再原子取代；失敗不得留下半份 JSON。

### 實作階段

#### Edit Phase 0：需求核准

- 確認「任務」指最外層 task 或卡片內的子項目。
- 選定保存模型、刪除恢復方式、`＋` 所屬清單及空清單的呈現。
- 確認時間 sidecar 過期時的降級體驗。
- 以桌面與手機線框確認「×、編輯、描述、狀態膠囊與工時按鈕」不互相擠壓。

完成條件：下方「實作前疑慮」全部有答案，Draft 狀態改為核准。

#### Edit Phase 1：純資料模型與測試

- 建立本機編輯政策、Unicode 描述判斷、穩定 ID 產生、overlay mutation、衝突偵測與時間分析失效等純函式。
- 測試 CJK、emoji、空白、標點、最大長度、重複 ID、legacy string、來源版本變更及 archived／filtered task。
- 若選 sidecar 或直接寫檔，再建立服務端 schema 驗證、scope 限定 capability、原子保存、衝突與恢復測試。

完成條件：所有 mutation 可在不操作 DOM 的情況下重現並通過邊界測試。

#### Edit Phase 2：Viewer 互動

- 加入頁面編輯 toggle、任務描述 inline editor、子項目「×／編輯」控制及清單底部「＋」。
- 保存成功後以單一 state 更新路徑重繪，避免 Developer overlay、篩選狀態與時間按鈕重複掛載。
- 完成鍵盤、focus、screen reader label、錯誤訊息與行動版不溢出驗證。

完成條件：公開頁面沒有編輯入口；本機頁面可完成新增、修改、取消、刪除／恢復及 reload 驗證。

#### Edit Phase 3：整合與文件

- 驗證 Launcher 啟動、scope catalog、明確 `?report=`、有／無 Developer overlay 及有／無時間 sidecar。
- 更新 README、handoff 與必要的 Launcher／LocalWebService 相容說明。
- 執行 Node、.NET 與若涉及 LocalWebService 的 Python 測試，再做桌面與 390px 瀏覽器 QA。

完成條件：既有唯讀流程與公開部署不回歸，本機修改的保存範圍、恢復方式及限制均有文件。

### 已核定互動決策

1. 工作項目清單底部的「＋」新增最外層 task；每張卡片子面板底部的「＋」新增該卡片的 pending child item。
2. 新最外層 task 必填 title 與 summary，使用獨立 stable task ID 並預設為 `planned`；空白 title／summary 不建立，Escape 或取消按鈕關閉新增表單。
3. 子項目刪除後提供復原；任務描述欄位是 summary，既有 task title 不在此階段修改。
4. 描述至少包含一個 Unicode 字母或數字；emoji-only／純標點不接受。
5. 結構變更立即重算狀態數、task fraction 與 project progress，並停止顯示受影響的 item／task／project 時間投影直到重新分析。
6. Demo 儲存以單一 payload 寫入，失敗時保留全部草稿且不更新 persisted snapshot；正式保存仍必須改用 scope 限定 capability、來源 revision、原子檔案取代與衝突拒絕。

## 編輯 iframe 收斂 Draft 0.1

**已完成（2026-08-07）。** 六項驗收條件全數通過，已對真實 port-8001 服務手動驗證（見 `handoff.md` Current state）。以下設計紀錄保留供參考；`editor.html` 與其獨立建置（`spike:svelte:build`／`editor:svelte:build`）本身未退場——那是這次選中的 Design A 的自然後續，不在本輪驗收範圍內，留給下一輪判斷。

目標是讓預覽與編輯成為同一頁的兩個模式，移除 `#editor-surface-overlay` 的 iframe。前置條件（預覽元素全部單一實作）已於 2026-08-06 達成。

### 現況實測（2026-08-06，真實 port-8001 服務）

重啟已發布 EXE 後 capability 恢復（`editable: true`、`editor_surface_url: /__taskprogress/v1/editor/editor.html`），本 session 首次能真正進入編輯模式。實際觀察到：

- iframe 同源，`contentDocument` 可存取，內部渲染 6 張任務卡。
- `editor-surface-open` class 套在 root 上鎖背景捲動；退出時正確移除。
- postMessage 交握正常：編輯器內按模式切換 → Viewer 收到 `taskprogress:editor-close` → 關閉 overlay、還原 toggle。
- 編輯器內另有 97 個逐項人工估算編輯器（`.spike-estimate-editor`）與時間設定面板（此 scope 尚無 time config，顯示「建立 8/8/8 預設設定」引導）。

### 核心問題：`App.svelte` 是第二個應用，不是元件

`app.js` 的 `startEditing()` 有兩條路徑，但只要 capability 提供 `surfaceUrl`，第一條就提早 return——**頁內編輯路徑在正式環境實際上從未執行**。兩條路徑的能力差距是這次收斂的真正工作量：

| 能力 | `app.js` 頁內路徑 | iframe 內 `App.svelte` |
|---|---|---|
| 任務／子項目 CRUD、優先級、狀態 | 有（`createReportEditorSession`） | 有（共用同一個 Editor Core） |
| 報告載入與 scope 解析 | 有 | **自己再做一次**（`loadRequestedData`） |
| capability discovery | 有 | **自己再做一次**（`editClient.discover()`） |
| 主題控制 | 有 | **自己再建一個**（`createThemeControl()`） |
| 時間設定／交付日編輯 | 無 | 有（`TimeSettingsEditor` 223 行） |
| 時間輸入草稿、版本化人工估算 | 無 | 有（`time-input-draft.js` 406 行） |
| 雙 revision 多檔存檔 | 無（只存 report） | 有（`edit-host-client.js` 144 行） |
| 交付日風險預覽／儲存確認 | 無 | 有（125 行） |

iframe 之所以存在，正是因為 `App.svelte` 重複了 Viewer 已有的載入、探索、主題等職責。移除 iframe 不是搬 DOM，是要決定這個重複如何消解。

### 候選設計

- **A：把編輯器能力併進 Viewer host。** `time-input-draft.js`、`edit-host-client.js` 移入 host 層，`TimeSettingsEditor`／`DeliveryRiskPreview`／`DeliverySaveConfirmation` 註冊為 region，`onManualEstimate` 接進既有共用 `ItemRow`。結果是單一應用、單一載入路徑，`editor.html` 與其獨立建置隨之退場。代價：`app.js` 由 1,030 行成長至約 1,600 行，且存檔路徑要從「只存 report」合併為「report＋config＋estimates 三檔雙 revision」。
- **B：以編輯器取代 Viewer。** 違反「本機 Viewer 是唯一使用者入口」的既有決定，不採用。
- **C：不用 iframe，但仍把 `App.svelte` 當整個 app 掛進同一份 document。** 保留現有程式碼切分，但兩個 app 共存於一頁會有兩次報告載入、兩個 theme control、兩套 capability 狀態，等於把 iframe 的隔離拿掉卻留下它要隔離的東西。

### 建議

採 A。它是唯一真正消除重複的選項，也和專案既有方向一致——所有共用元素都已經走 region 邊界，時間設定與交付日流程是最後三個還沒走的。B 已被既有決定排除，C 只移除隔離而不移除重複。

### 驗收條件

1. 編輯 toggle 不再建立 iframe；`#editor-surface-overlay`、`#editor-surface-frame`、`taskprogress:editor-close` 監聽與 `editor-surface-open` class 全數移除。
2. 編輯模式在同一份 document 內進入，外層 URL 不變，報告只載入一次。
3. 時間設定、交付日草稿與風險預覽、儲存確認、逐項人工估算在頁內可用，行為與 iframe 版一致。
4. 存檔走既有雙 revision 多檔契約（report `If-Match` ＋ `inputs_revision` ＋ `local_revision`），失敗時整批回滾。
5. 背景捲動鎖定若仍需要，改由模式狀態驅動，不依賴 overlay 元素。
6. 桌面與 390px 皆通過；真實 port-8001 服務驗證，不只靠獨立 Svelte surface。

### 明確排除

- 不在此階段改動存檔的伺服器端契約或 `taskprogress.local.json` 的敏感歷史格式。
- 不處理行動裝置觸控編輯（仍為既有未驗證項目）。
- 不重建已退役的 `experiments/time-reference/demo/`。
