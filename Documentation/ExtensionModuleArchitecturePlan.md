# 擴充資訊模組架構計畫

> 狀態：Draft 0.1  
> 文件目的：定義 TaskProgress 如何在不擴張核心報告責任的前提下，接入目前尚未出現的專案資訊。  
> 第一個參考實作：既有 `time.analysis.json` 時間分析功能。

## 背景

TaskProgress 目前以 `report.json` 表達任務、狀態、完成項目與進度，並以選用的 `report.dev.json` 補充開發資訊。時間功能進一步使用獨立的 `time.analysis.json` sidecar，在不改變基本報告契約的情況下加入工程估算、工作容量與期限風險。

這個方向已證明 sidecar 可以讓功能獨立演進、驗證與降級。然而目前 Viewer、Launcher、LocalWebService 與分析器都直接知道 `time.analysis.json` 的檔名、路由、模型和載入流程。若新增專案難度、專案價值、成本、估價、品質、安全性或其他尚未預見的資訊，仍需逐一修改核心載入程式。

因此目前的時間功能是第一個「具有模組特性的內建功能」，但 TaskProgress 尚未具備正式、通用的擴充資訊模組接口。

## 核心決策

1. `report.json` 繼續只承擔穩定的任務與進度事實，不加入所有新領域的欄位。
2. 新領域以選用 sidecar 提供資料，並透過共同的模組描述檔發現。
3. 模組資料可以由外部工具產生，但 Viewer 只執行隨 TaskProgress 發布或明確安裝的可信任 Renderer。
4. 第一版採「內建模組登錄表」，不建立可從報告下載並執行任意 JavaScript 的 plugin 系統。
5. 每個模組獨立驗證、載入、呈現與降級；單一模組失敗不得使基本報告失效。
6. `time` 應遷移為第一個正式模組，再以 `cost` 作為第二個實作來驗證接口的通用性；difficulty 與 value 留待共同接口成立後擴充。
7. 交易、付款、身份驗證及電子簽署仍屬外部系統；TaskProgress 模組只接收其可公開或可授權觀看的狀態投影。

## 目標

- 讓未知的新資訊能在有需要時掛入一個 scope。
- 保持沒有任何模組的舊報告完全可用。
- 讓模組能針對 project、task 或 stable item 提供資訊。
- 讓不同模組使用自己的 Schema、版本、分析方法與發布政策。
- 讓 Viewer 以一致方式處理模組發現、錯誤、診斷、載入順序與生命週期。
- 讓 Launcher 以一致方式發現、驗證及註冊模組資料。
- 保留公開 Pages、本機唯讀與未來本機編輯能力之間的安全邊界。
- 避免 TaskProgress 核心依賴專案難度、價值、估價或其他特定領域算法。

## 非目標

- 第一版不允許報告指定遠端 JavaScript、WebAssembly 或其他可執行程式。
- 第一版不建立公開模組市集、套件下載器或自動安裝機制。
- 不要求 TaskProgress 自動理解任意 JSON 的業務語意。
- 不以模組描述檔作為存取控制或資料加密機制。
- 不讓模組資料自動取得檔案寫入、網路呼叫或 edit capability。
- 不把合約正文、簽章私鑰、付款憑證、完整個資或第三方認證證據保存進公開報告。
- 不為了通用化而立即重寫已驗證的時間算法。

## 設計原則

### 核心穩定、領域可替換

TaskProgress Core 只需要理解：

- scope、report 與 stable subject identity；
- 模組描述與共同資料 envelope；
- 模組載入與失敗隔離；
- Viewer 可使用的呈現位置；
- 公開、本機與 Developer 資料的基本邊界。

時間、難度、價值與估價的算法、輸入、證據及詳細畫面由各模組自行負責。

### 資料擴充與程式擴充分離

一份 scope 可以宣告它有哪些模組資料，但不能藉此要求 Viewer 執行任意程式。

```text
報告提供者
└─ 提供 JSON 模組資料

TaskProgress 發布／安裝程序
└─ 提供經信任的 Validator、Adapter 與 Renderer
```

Viewer 遇到有資料但沒有可信任 Renderer 的模組時，只回報「不支援此模組」，不猜測資料內容，也不執行資料內的 HTML 或程式碼。

### 來源、分析結果與 Viewer 投影分離

模組可以有多份私有來源及一份可發布投影。例如：

```text
difficulty.config.json
difficulty.evidence.json
        │
        ▼
difficulty.analysis.json
        │
        ▼
TaskProgress Viewer
```

共同模組接口只規範 Viewer 投影與發現方式，不要求所有模組使用相同的來源模型。

### 顯示不代表權限

`visibility`、隱藏按鈕或模組是否展開都不是存取控制。不能公開的資料不得進入 Pages artifact，也不得註冊到不適當的本機靜態路由。

## 建議架構

```text
report.json
report.dev.json
report.modules.json
├─ time.analysis.json
├─ difficulty.analysis.json
├─ value.analysis.json
├─ pricing.snapshot.json
└─ agreement.status.json
        │
        ▼
Module Discovery
        │
        ▼
Trusted Module Registry
├─ Validator
├─ Subject Adapter
├─ Renderer
└─ Optional Runtime Controller
        │
        ▼
Viewer Slots
├─ Project Summary
├─ Task Header / Task Body
├─ Item Row
├─ Detail Dialog
└─ Diagnostics
```

### 元件責任

| 元件 | 責任 |
|---|---|
| `report.json` | 任務、狀態、進度與 stable IDs |
| `report.modules.json` | 宣告這個 scope 可用的模組投影 |
| Module sidecar | 保存某個領域的可交換 Viewer 投影 |
| Viewer Module Registry | 將可信任 module type 配對到實作 |
| Module Validator | 驗證共同 envelope 與領域資料 |
| Subject Adapter | 依 scope、task、item ID 建立索引 |
| Renderer | 將資料掛到允許的 Viewer slots |
| Runtime Controller | 處理時間推進等需要生命週期的確定性更新 |
| Launcher Module Provider | 發現、驗證並註冊本機 sidecar |
| Analysis Module | 從模組來源確定性產生 Viewer 投影 |

## 模組描述檔

建議使用與 `report.json` 同目錄的選用 `report.modules.json`。檔案不存在表示沒有宣告模組；在遷移期間，Viewer 可以保留既有 `time.analysis.json` 自動發現行為。

概念範例：

```json
{
  "schema_version": "0.1",
  "report_id": "task-progress-report",
  "scope_id": "task-progress",
  "updated_at": "2026-07-29T18:00:00+08:00",
  "modules": [
    {
      "id": "time",
      "type": "taskprogress.time",
      "source": "time.analysis.json",
      "optional": true,
      "visibility": "public"
    },
    {
      "id": "difficulty",
      "type": "taskprogress.difficulty",
      "source": "difficulty.analysis.json",
      "optional": true,
      "visibility": "developer"
    }
  ]
}
```

### Descriptor 欄位

| 欄位 | 規則 |
|---|---|
| `id` | scope 內穩定且唯一的模組實例 ID |
| `type` | 穩定的模組類型，用來查找可信任實作 |
| `source` | 相對於 manifest 的同源 JSON 路徑 |
| `optional` | 載入失敗是否只產生模組診斷；第一版只接受 `true` |
| `visibility` | `public`、`developer` 或 `local` 發布分類，不是授權機制 |

第一版不在 Descriptor 中接受：

- script URL；
- HTML template；
- CSS URL；
- 任意網路 endpoint；
- 檔案系統絕對路徑；
- 可執行公式；
- 權限或 capability token。

## 共同資料 Envelope

每個模組保留自己的領域 Schema，但根節點應提供共同 identity 與 provenance：

```json
{
  "module_type": "taskprogress.difficulty",
  "schema_version": "0.1",
  "module_id": "difficulty",
  "report_id": "task-progress-report",
  "scope_id": "task-progress",
  "generated_at": "2026-07-29T18:00:00+08:00",
  "generator": {
    "id": "taskprogress-difficulty-analyzer",
    "version": "0.1"
  },
  "data": {
    "summary": {},
    "tasks": []
  }
}
```

共同欄位負責配對及追溯，`data` 由模組自己的 Schema 定義。模組不得假設其他模組的欄位存在；跨模組分析應由上游分析器明確讀取多個來源並產生新的獨立投影。

### Subject 對應規則

- project-level 資料以共同 `scope_id` 對應。
- task-level 資料使用 `task_id` 對應 `report.json` task。
- item-level 資料使用 `task_id + item_id` 對應 stable item。
- 不使用畫面索引、陣列位置或顯示文字作為 identity。
- 找不到 subject 時產生 orphan diagnostic，不猜測最相近項目。
- 依賴 report 結構的模組應保存來源 revision、`updated_at` 或內容指紋，以偵測過期投影。

## Viewer 模組接口

第一版採建置時登錄的可信任 registry。以下只描述責任，實際 JavaScript API 應在 Phase 1 以測試固定：

```text
ViewerModule
├─ type
├─ supportedSchemaVersions
├─ validateEnvelope()
├─ validateData()
├─ createSubjectIndex()
├─ attach()
├─ render()
├─ start()
└─ dispose()
```

### 建議生命週期

1. 載入並驗證 `report.json`。
2. 解析選用的 `report.modules.json`。
3. 檢查 `report_id`、`scope_id` 與 manifest 版本。
4. 依 Descriptor type 查找可信任 registry。
5. 不支援的 type 產生診斷，不執行或猜測。
6. 解析安全的相對、同源 source。
7. 載入 JSON，驗證共同 envelope。
8. 執行模組領域驗證。
9. 建立 subject index，記錄 orphan 或 stale diagnostics。
10. 將資料掛入允許的 Viewer slots。
11. Viewer render 完成後啟動需要時鐘或頁面事件的 runtime controller。
12. scope 切換、重新載入或頁面卸載時呼叫 `dispose()`。

### Viewer Slots

核心應提供有限且穩定的掛載位置，避免模組任意操作整個 DOM：

| Slot | 用途 |
|---|---|
| `project-summary` | 專案層級的精簡摘要或膠囊 |
| `task-header` | task 標題附近的短資訊 |
| `task-body` | task 卡片內的模組摘要 |
| `item-inline` | stable item 列的短值 |
| `project-detail` | 專案層級詳細面板 |
| `task-detail` | task 詳細面板 |
| `item-detail` | item 詳細面板 |
| `diagnostics` | 模組錯誤、過期與相容性訊息 |

核心控制插入順序、無障礙要求、行動版限制與模組可用空間。Renderer 不直接覆蓋其他模組或核心內容。

### Item inline 膠囊列

`item-inline` 不讓每個 Renderer 各自插入 DOM。Viewer Core 收集通過驗證的膠囊描述，再交給共享 `ItemRow` 的單一 module strip 呈現：

```text
ItemRow
├─ 左側內容流：項目標記、optional priority、flexible 描述
└─ 右側 utility panel
   ├─ Module capsule strip：time、未來模組……
   ├─ 核心：status
   └─ Edit-only action：刪除
```

- Strip 靠右、保持單列，空間不足時只在自身範圍水平捲動；不得推走 status 或讓卡片產生水平 overflow。
- `time` 是第一顆 reference capsule。新增模組只提供 capsule label、accessibility text、tone 與 action，不取得 `ItemRow` DOM。
- Core 定義可信任 module type 的預設順序與允許清單。使用者可用 browser-local view preference 調整已知模組的左右順序；manifest、sidecar 與 Renderer 不得宣告較高權限的版面順序。
- 排序互動直接沿用 `StatusFilters` 契約：滑鼠拖曳、超過 8px 且鎖定水平軸後才成立的 Pointer Events 觸控拖曳，以及 `Alt + ←／→` 鍵盤移動；三種入口共用同一套純資料 reorder model。短點擊仍啟動 capsule action，排序後立即保存並恢復 focus，不加入 Editor transaction。
- Priority 與 status 是報告核心欄位，不屬於 module strip。單一 module 載入、驗證或 render 失敗時，描述、priority 與 status 必須照常顯示。
- 沒有任何 module capsule 時不保留空 strip。Preview／Edit 共用同一個靠右 utility panel 與 `module → status → delete` 順序，只有核心欄位是否可編輯與 module action 是否取得本機 capability 的差異。刪除只在 Edit 插入 status 右側，不在 Preview 預留空欄；左側未指定 priority 也不保留空容器，描述取得釋放的空間。

### 一般資訊模組

真正未知的資訊不一定值得建立專用 Renderer。未來可提供一個受限的 `taskprogress.metrics` 內建模組，只接受白名單資料元件：

- label/value/unit；
- status badge；
- 短文字說明；
- key-value list；
- 小型資料表；
- reference link。

它不得接受 HTML、CSS、script 或任意版面指令。簡單的新指標可先透過這個模組顯示；需要特殊算法、互動或詳細解釋時，再升級為具專用 Renderer 的 module type。

## Launcher 與分析器接口

Viewer 模組化後，Launcher 也必須移除對每個 sidecar 的個別硬編碼。概念接口分為兩類。

### `IReportModuleProvider`

```text
IReportModuleProvider
├─ Type
├─ Discover(reportFolder, descriptor)
├─ ValidateIdentity(reportIdentity, artifact)
├─ GetArtifacts()
└─ GetRoutes(scope)
```

責任：

- 只解析 Launcher 已授權 report folder 內的精確檔案；
- 阻止 `..`、絕對路徑、符號連結逃逸及路徑衝突；
- 驗證 manifest、report 與 sidecar identity；
- 將通過驗證的 JSON 註冊到固定 scope route；
- sidecar 消失時移除舊 route；
- 不因未知模組而自動取得額外檔案權限。

### `IAnalysisModule`

```text
IAnalysisModule
├─ Type
├─ HasInputs(reportFolder)
├─ ValidateInputs()
├─ Generate(asOf)
└─ ValidateOutput()
```

分析模組不是所有 Viewer 模組的必要條件。外部系統可以直接提供合法投影；只有需要由 TaskProgress CLI 重算的內建領域才實作分析接口。

`TimeAnalysisGenerator` 可先包裝成第一個 `IAnalysisModule`，但算法內容及既有輸入檔不必同時重寫。

## 模組類別

| 類別 | 範例 | TaskProgress 的責任 |
|---|---|---|
| Analysis | time、difficulty、quality、risk | 驗證並顯示分析快照 |
| Evaluation | value、priority、impact | 顯示方法、分數、信心與依據 |
| Commercial projection | cost、pricing snapshot | 顯示幣別、基準日、範圍與來源 |
| External status | quote、agreement、certification | 顯示外部系統狀態與安全 reference |
| Generic metrics | 任意簡單指標 | 使用受限通用 Renderer |

External status 模組不得讓 TaskProgress 成為交易或法律事實的 canonical source。Viewer 中的「已簽署」只能是外部系統在某個時間點產生的狀態投影，並應包含來源、時間與可驗證 reference。

## 版本與相容策略

- `report.json`、manifest 與每個 module schema 各自版本化。
- 新增模組不升級 `report.json` schema。
- Module type 是穩定 identity；資料 Schema 版本描述該 type 的資料契約。
- Renderer 明確宣告支援的版本，不以「看起來欄位差不多」猜測相容。
- 相容的小版本可由模組 Adapter 正規化；破壞性變更使用新 major schema。
- 未知 type、未知版本或無效資料只停用該模組。
- manifest 不存在時保持基本報告；遷移期仍可沿用既有時間 sidecar 自動發現。
- 明確停用全部模組時可考慮 `?modules=none`；個別模組停用的 URL 介面留待 Phase 1 決定。

## 錯誤與降級政策

| 情境 | 結果 |
|---|---|
| 沒有 manifest | 顯示基本報告；遷移期可載入 legacy time |
| manifest 無效 | 忽略所有宣告模組，保留基本報告並顯示診斷 |
| module type 未安裝 | 不載入 Renderer，顯示不支援診斷 |
| sidecar 404 | 選用模組不顯示，必要時產生低干擾診斷 |
| envelope identity 不符 | 隔離該模組 |
| module data schema 無效 | 隔離該模組 |
| task/item 找不到 | 保留有效部分並列出 orphan diagnostic |
| 投影落後於 report revision | 標示 stale 或依模組政策暫停顯示 |
| Renderer 發生例外 | 捕捉於模組邊界，清理該模組 UI |
| Runtime controller 失敗 | 停止動態更新，保留仍可信的靜態資料或隔離模組 |

模組不得自行吞掉錯誤後顯示虛構的零值、預設值或成功狀態。預設值必須由來源或分析器明確產生，並攜帶 provenance 與 confidence。

## 安全與隱私

- manifest 與 sidecar 只包含 JSON 資料。
- 所有文字以文字節點呈現，不直接注入 HTML。
- 公開 Viewer 預設只載入同源相對路徑。
- LocalWebService 只註冊通過 scope、目錄、路徑及 identity 驗證的精確檔案。
- 設定每個 manifest 與 sidecar 的檔案大小、module 數量及 subject 數量上限。
- 模組不能取得 control token、edit capability 或其他模組的私有來源。
- `visibility` 僅供發布與註冊流程判斷；部署工具仍須真正排除非公開檔案。
- public、developer、local 三種資料應在產生投影時完成隱私裁切。
- 外部 URL 必須經協定與 origin 政策驗證；第一版可只允許安全的 `https` reference。
- Pricing、agreement 等模組避免放入客戶個資、完整合約及未公開商業條款。

## `time` 模組遷移

`time` 是驗證新接口的第一個實作，但遷移應保持既有 UI、算法與相容行為。

### 保留

- `time.config.json`、`time.estimates.json`、`time.events.json` 輸入；
- `time.analysis.json` Draft 0.2 投影；
- `TimeAnalysisGenerator` 確定性算法；
- estimate-only 與 deadline capability 分離；
- 本機容量 override；
- 每分鐘、`pageshow` 與 foreground 重算；
- 沒有 sidecar 時完全不顯示時間 UI；
- 現有 query 與公開報告相容性。

### 抽離

- 將 `app.js` 的時間載入流程移入 module loader 與 Time Viewer Module。
- 將 `ReportFolder.TimeAnalysisPath` 的特例改由 module provider 表達。
- 將 LocalWebService 的固定 time route 註冊改由驗證後的 module artifact 提供。
- 將 `TimeAnalysisGenerator.HasInputs/Generate` 包裝為 analysis module。
- 將時間專用診斷轉成共同 module diagnostic，再保留領域細節。

### 遷移相容

第一階段同時支援：

1. 有 `report.modules.json`，由 manifest 載入 time；
2. 沒有 manifest，但存在既有 `time.analysis.json`，沿用 legacy 自動載入；
3. 完全沒有 time，保持基本 Viewer。

完成公開報告、Launcher 與 tests 的遷移後，再決定何時停止 legacy discovery。停止前必須有明確版本及升級說明。

## 第二個驗證模組：Cost

完成 time 遷移後，以 `taskprogress.cost` 驗證 project／task／item 三層對應、商業資料隱私與跨模組分析，同時不得讓核心新增成本領域特例。

Cost 是 Time 的同級模組，不是 Time 的附屬欄位。成本分析器可以明確讀取時間估算及費率作為輸入，但產生的成本投影與 Renderer 必須能獨立驗證、載入及降級；沒有 Time 時仍可呈現外包、訂閱或其他直接成本。

第一版成本語意至少區分：

- `actual`：已發生的成本；
- `committed`：已承諾但尚未支付的成本；
- `estimated`：依目前輸入預估的未來成本；
- `replacement`：以指定地區、費率及基準日計算的重製估價，不得與實際成本混合。

投影應保存幣別、最小貨幣單位整數、基準日、計算方法、納入範圍、來源、confidence、revision，以及可選的人力、AI 訂閱、硬體折舊、電力、外包與其他分類。所有金額都必須說明是直接現金、分攤成本或分析估值。public／developer／local 投影在產生時完成裁切；付款、發票及交易紀錄仍由外部系統保存。

若新增 cost 時仍需在核心程式加入大量 `if cost`、固定檔名或 Time Renderer 相依，表示模組接口尚未真正成立。

## 分階段實作

### Phase 0：語意與邊界

- 確認 `report.modules.json` 命名與位置。
- 確認 module type、instance ID、schema version 與 report identity 規則。
- 確認 public、developer、local 的發布語意。
- 決定 unknown module 是否顯示低干擾診斷。
- 決定 stale projection 的共同最低行為。

完成條件：不依賴 time 欄位即可描述一個模組及其生命週期。

### Phase 1：Schema 與純模型

- 建立 manifest JSON Schema。
- 建立 common envelope Schema 或可重用 `$defs`。
- 建立安全 source resolver。
- 建立 registry、version negotiation、diagnostic 與 subject index 純函式。
- 為未知 type、版本不符、identity 不符、orphan、stale 與部分失敗建立測試。

完成條件：不操作 DOM、不啟動服務即可完整驗證模組發現與配對。

### Phase 2：Viewer Registry 與 Time 遷移

- 建立可信任 Viewer module registry。
- 定義 slots 與 Renderer context。
- 將 time-model、time-view 與 deadline runtime 包裝成 Time Viewer Module。
- 保持既有時間功能及視覺回歸測試。
- 增加單一 Renderer 失敗不影響其他模組與基本報告的測試。

完成條件：核心 `app.js` 不再直接包含時間領域載入流程。

### Phase 3：Launcher Provider 與 Time Analyzer 遷移

- 建立安全 manifest/module artifact discovery。
- 建立本機精確 route 註冊與 stale route 清理。
- 將時間輸入發現與產生包裝成 analysis module。
- 保留沒有時間輸入時不自動建立資料的政策。
- 驗證多 scope、多模組、路由衝突與目錄逃逸。

完成條件：新增純資料模組時，不必修改 `ReportFolder` record 或 LocalWebService 固定檔名白名單。

### Phase 4：Cost 第二模組

- 建立 cost Draft Schema，固定 actual／committed／estimated／replacement、幣別、基準日、分類、分攤與 provenance 語意。
- 建立最小分析快照與 Renderer。
- 驗證 project/task/item 三層掛載。
- 驗證 time 與 cost 同時存在、cost 明確讀取 time 投影、任一模組失敗及顯示順序。

完成條件：第二模組只透過共同接口接入，核心沒有領域名稱特例。

### Phase 5：一般指標與開發套件評估

- 評估受限 `taskprogress.metrics` Renderer。
- 整理模組範例、Schema 模板與測試 helper。
- 只有在第三方確實需要獨立開發模組時，才評估外部 SDK、套件載入與安裝流程。
- 動態程式模組若進入設計，必須另行處理簽章、來源信任、權限、更新與隔離，不沿用資料 manifest 直接執行。

## 驗證矩陣

至少覆蓋：

- 無 manifest、空 manifest、有效 manifest、無效 manifest；
- legacy time、有 manifest time、兩者同時存在；
- 未知 module type；
- 支援及不支援的 module schema version；
- module/report identity 相符與不符；
- project、task、item 資料；
- orphan task、orphan item、duplicate module ID；
- public、developer、local 發布分類；
- sidecar 404、無效 JSON、過大檔案與載入逾時；
- 一個模組失敗、其他模組仍正常；
- 多個模組競爭相同 slot；
- report 結構改變後的 stale projection；
- localhost、本機明確 report、Pages 相對路徑與 `modules=none`；
- 桌面、行動版、鍵盤與螢幕閱讀器；
- scope 切換、reload、`pageshow`、visibility change 與 controller dispose；
- 路徑 traversal、跨 origin source、HTML 注入與未授權本機檔案。

## 完成條件

- `report.json` 不因新增模組而改版。
- `time` 能透過共同接口載入，現有功能與測試保持相容。
- cost 第二模組不修改核心載入器的領域判斷，且不依賴 Time Renderer 才能顯示。
- 缺少、未知、過期或無效模組不使基本 Viewer 失敗。
- Viewer 不執行 manifest 或 sidecar 指定的任意程式。
- Launcher 不為 manifest 擴張到 report folder 之外的檔案權限。
- 模組能可靠對應 project、task 與 stable item，且不以顯示文字猜測。
- 公開與非公開模組資料在部署及本機註冊層真正分離。
- 文件能清楚區分「模組資料」、「可信任 Renderer」、「分析器」與「外部交易系統」。

## 尚待決定

1. manifest 正式採 `report.modules.json`、`modules.json` 或其他名稱。
2. Descriptor 是否保存 sidecar digest，以驗證內容配對及快取。
3. 同一 module type 是否允許多個 instance，以及 UI 如何命名。
4. 模組在同一 slot 的順序由核心、registry 或 manifest 哪一方決定。
5. unknown module 診斷預設只進開發診斷，或也向一般觀看者顯示。
6. stale projection 的共同欄位採 report `updated_at`、內容 digest 或獨立 revision。
7. manifest 是否需要 Developer overlay，或由單一 manifest 配合發布流程裁切。
8. `?time=` 等 legacy query 如何映射到共同 module override。
9. 一般指標 Renderer 的資料元件白名單與無障礙限制。
10. 模組 Schema 何時從 repository 內部契約升為可供外部工具使用的穩定規格。
