# 擴充資訊模組架構計畫

> 狀態：Draft 0.2；Phase 0 合約決策已收斂，Phase 1（Schema／純模型）已完成；Phase 2 的 registry／slot contract 切片已完成。Time 遷移目前只完成「渲染層」抽出（`time-viewer-module.js`，經 fixture／real-browser passive shadow／production cutover 三階段驗證，2026-08-25 已接進 `app.js` 正式路徑，待使用者做桌面／375px／編輯回歸確認），编輯 session 狀態擁有權仍在 `app.js`、尚未走 module capability；把它註冊進 `module-registry.js` 成為真正的 `taskprogress.time` trusted module，以及 manifest-driven dispatch，都還沒開始。Phase 3 尚未開始。
> 文件目的：定義 TaskProgress 如何在不擴張核心報告責任的前提下，接入目前尚未出現的專案資訊。  
> 第一個參考實作：既有 `time.analysis.json` 時間分析功能。

## 系統位置

```text
TaskProgress
├─ Core report：report.json、report.dev.json
│  └─ 擁有 scope、task、stable item、狀態與進度事實
├─ Extension module system（本計畫）
│  ├─ Discovery：report.modules.json
│  ├─ Trusted runtime：registry、validator、subject index、slots、diagnostics
│  ├─ First module：Time
│  │  ├─ 私有輸入：time.config／estimates／events.json
│  │  └─ Viewer 投影：time.analysis.json
│  └─ Second proof：Cost
│     └─ 只透過共同接口接入，不讓 Core 認識成本語意
└─ Hosts and producers
   ├─ Viewer：載入與呈現可信任模組
   ├─ Launcher／LocalWebService：驗證並註冊精確 artifact
   └─ Analyzer／外部工具：產生可發布投影
```

依賴方向固定為 `Host → Module Contract ← Trusted Module`。Core 不依賴 Time 或 Cost；Cost 分析器可以把 Time 投影當作具版本的輸入，但 Cost Renderer 不依賴 Time Renderer。

補充視覺（同一件事的圖示版，不取代上面的 text tree）：[assets/module-contract-map.svg](assets/module-contract-map.svg)，用 Time／Cost 兩個具體模組畫出 Core 只透過共同模組接口互動、彼此不直接連線的關係。

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

## 執行架構

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

Phase 0 將 Descriptor identity 固定如下：

- 正式檔名為 `report.modules.json`；它是與 `report.json` 同目錄的選用 manifest。
- 第一版一個 scope 內同一 `type` 只允許一個 instance；`id` 仍保留為穩定實例 identity，但重複 `id` 或重複 `type` 都拒絕整份 manifest。多 instance 等出現實際需求與命名 UX 後再升級契約。
- `source` 必須是正規化後仍位於 report folder 內的同源相對 JSON 路徑；不得接受 query、fragment、絕對路徑或 `..`。
- Descriptor 第一版不保存由作者提供的 sidecar digest。Loader 讀取後自行計算 artifact SHA-256，供快取、診斷與同一次載入的一致性檢查；digest 不作為授權或簽章。
- `visibility` 決定 artifact 組裝邊界：公開部署產生的 manifest 只能列出 `public` entries；Developer／local entries 必須從公開 artifact 實際排除，而不是只靠 Viewer 隱藏。
- Descriptor 不提供 slot order。Core 擁有 module type 的預設順序，browser-local preference 只能重排 Core 已允許的類型。

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
  "report_revision": "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
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

`report_revision` 是產生投影時所讀取之 `report.json` 原始 bytes 的 SHA-256，格式固定為 `sha256:<64 lowercase hex>`。它用來判斷投影是否對應目前報告，不取代 sidecar 自己的 `schema_version`、`generated_at` 或來源 revision。legacy Time adapter 在遷移期可缺少此欄位；缺少時只記錄 `freshness_unknown`，不得宣稱投影已驗證為最新。

### Subject 對應規則

- project-level 資料以共同 `scope_id` 對應。
- task-level 資料使用 `task_id` 對應 `report.json` task。
- item-level 資料使用 `task_id + item_id` 對應 stable item。
- 不使用畫面索引、陣列位置或顯示文字作為 identity。
- 找不到 subject 時產生 orphan diagnostic，不猜測最相近項目。
- 依賴 report 結構的模組應保存來源 revision、`updated_at` 或內容指紋，以偵測過期投影。

### Stale 最低政策

- `report_revision` 相符：可正常呈現。
- revision 缺少：模組可呈現，但詳細診斷標示 `freshness_unknown`；這只適用於 legacy 遷移，不是新模組的合法輸出。
- revision 不符：共同狀態為 `stale`。Core 隱藏 task／item inline 值、停止 action 與 runtime controller，只允許 detail slot 顯示「資料待重算」及投影時間；不得用過期資料產生期限燈號或可編輯預覽。
- orphan subjects 與 stale 是不同診斷；不得因一個 orphan 丟棄其餘仍能對應的 subject。
- Analyzer 成功重算並通過驗證後才清除 stale；Viewer 不自行改寫 revision，也不以目前時間猜測資料已恢復。

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

### 兩種膠囊按鈕：主面板與子項

每個模組的摘要膠囊只有兩種宿主層級，對應到上表的兩組 slot pairing，第一版不再細分：

- **模組主面板膠囊按鈕**：掛在 `project-summary`／`task-header`／`task-body`，代表整個 subject（專案或 task）在該模組的狀態；點擊開啟同一 subject 的 `project-detail`／`task-detail` 主面板。
- **模組子項膠囊按鈕**：掛在 `item-inline`，代表單一 stable item 在該模組的狀態；點擊開啟該 item 的 `item-detail` 面板。

兩者共用同一條規則：**膠囊顯示的欄位與面板內的編輯欄位必須同位置，不得分成兩處各自維護一份。** 膠囊只是面板的開關與摘要，不是面板內容的另一份副本；面板內沒有對應摘要欄位的編輯項，膠囊也不該單獨顯示它。

Time 模組是這個分類的第一個真實案例，即使它尚未走 manifest／registry 接口，仍先建立正確的先例讓 Phase 1 直接套用：

| | 主面板膠囊按鈕 | 子項膠囊按鈕 |
|---|---|---|
| 現況元件 | `TimeSummaryButton.svelte`（「交付日」） | `ItemRow` 內的 `time` module capsule |
| 對應 slot | `project-summary` | `item-inline` |
| 開啟的面板 | `TimeDialog` 的 project detail（評估流程／工程估算／工作容量） | `TimeDialog` 的 item detail（人工工時、依據、確認） |
| 面板擁有的編輯 | 交付日、每日分配、工作日、休假／容量例外 | 人工工時、人工依據、人工確認 |

`plan.md#時間編輯入口與面板-ux-draft-02-2026-08-23` 是這條規則在 Time 上的落地規格；子項欄位已符合，主面板欄位（交付日與容量設定）目前不符合，見該節的驗收清單與 handoff 的待處理項目。

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

### 主面板與子項共用同一個 Strip 元件（2026-08-25 使用者決策）

主面板膠囊列與子項膠囊列不是兩套獨立機制，是同一個共用元件掛在兩個不同 slot：`HorizontalCapsuleStrip.svelte`（今天透過 `ModuleCapsuleStrip.svelte` 給 `item-inline` 使用；CSS class `.horizontal-capsule-strip`，`overflow-x: auto` 做自身範圍內的水平捲動，`justify-content: flex-end` 靠右對齊）。這是既有「One UI source」專案規則（同一個畫面元素只能有一份實作）在膠囊列這件事上的具體套用：兩個 slot 的膠囊列外觀、排序互動、捲動行為必須是同一份程式碼，不是分開維護的兩份相似邏輯。

**已完成（2026-08-25）**：兩個 slot 現在都走 `ModuleCapsuleStrip` → `HorizontalCapsuleStrip`。主面板的 `project-module-strip` region 與子項的 `item-module-strip` 是同一份元件，只有呼叫端給的膠囊清單與 `aria-label` 不同；排序也共用同一個 `moduleOrderControl`，所以在任一列拖曳都會同時改變兩列。交付膠囊保留自己的 `time-summary-button` class，因此 strip 提供版面／排序／捲動，模組保有外觀——這正是 slot 契約要的分工。共用 strip 為此新增了兩個**通用**膠囊裝飾：`showDot`（狀態圓點）與 `showChevron`（此膠囊會開啟面板），兩者都不是 Time 專屬概念，Cost 同樣會用到。

**空間不足時的展開／更多控件**：若要在捲動之外，額外提供一個展開／更多按鈕讓使用者看到被擠出視窗的膠囊，這個能力要做成 `HorizontalCapsuleStrip` 本身的選用功能（例如一個 overflow-affordance prop），讓兩個 slot 都能取得，而不是只在主面板另外接一個獨立元件。子項膠囊列今天不一定需要這個功能，但共用元件的原則不因此改變——要不要啟用由呼叫端決定，實作只能有一份。

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
- `?modules=none` 是第一版唯一共同 override，停用所有模組但不影響基本報告。既有 `?time=none` 在遷移期保留為只停用 `taskprogress.time` 的相容 alias；第一版不新增任意 per-module query 語法。

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

診斷分級固定為：

- 公開 Viewer 的主報告不顯示技術細節；只有當使用者已看見模組入口但該模組之後失效時，顯示低干擾的「部分擴充資訊無法使用」。
- localhost／Developer 模式提供結構化 module diagnostics，包括 module ID、階段、錯誤碼與安全裁切後的訊息。
- Console 可以記錄相同錯誤碼，但不得輸出 local path、private source 或未裁切 payload。
- unknown type 在公開模式靜默跳過，在 localhost／Developer 模式記錄 `unsupported_module_type`。

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

### Legacy sidecar 的 envelope 轉接（2026-08-25 使用者決策）

manifest 的 `source` 指向既有的 `time.analysis.json`，但那份檔案是 Draft 0.2 的扁平結構，不帶共同 envelope 的根欄位。這個落差原本沒有被本文件解決，現在的決策是：**讀取時轉接，不改磁碟上的檔案格式**。分析器維持原輸出，公開報告與既有 Viewer 不受影響；轉接只發生在記憶體中，由 Viewer 端一個純函式完成。

轉接層是獨立的純轉換模組（法規上等同 Adapter：輸入 legacy 物件，輸出 envelope 物件，不做 I/O、不碰 DOM）。它服務的是 manifest 載入路徑；目前的 legacy discovery 路徑不需要 envelope 形狀，因此不強制改走轉接層。

#### 欄位對應

| envelope 欄位 | 來源 | 說明 |
|---|---|---|
| `module_type` | 固定 `taskprogress.time` | 由轉接層供給 |
| `module_id` | manifest descriptor 的 `id`；legacy 路徑用 `time` | |
| `schema_version` | legacy 根層 `schema_version`（如 `0.2`）直接沿用 | 兩者語意相同，都是「該 module type 的資料契約版本」 |
| `scope_id` | legacy 根層 `scope_id` | 唯一由來源真正攜帶並可驗證的 identity |
| `report_id` | **來源沒有** | 見下方「不得偽造的 identity」 |
| `report_revision` | **來源沒有** | 依既有規則記 `freshness_unknown`，不得宣稱已驗證為最新 |
| `generated_at` | 由 legacy `as_of` 供給，但標記為近似值 | 見下方「兩個不得混同的語意」 |
| `generator` | 由轉接層自述（轉接層 id 與版本） | 見下方 |
| `data` | **整份 legacy 文件原封放入**，包含同時被提升到 envelope 根層的 `schema_version` 與 `scope_id` | 領域內容不改寫、不裁切；重複是刻意的，見下方「`data` 必須是完整副本」 |

#### `data` 必須是完整副本

`schema_version` 與 `scope_id` 會同時出現在 envelope 根層與 `data` 內。這個重複是必要的：`inspectTimeAnalysis` 是既有且已驗證的 Time 領域驗證器，它正好會讀這兩個欄位；若為了避免重複而把它們從 `data` 裡拿掉，`data` 就無法再交給唯一為它而生的驗證器檢查。因此 `data` 保持與來源檔案逐欄位相同，轉接層只新增 envelope 根層欄位，不對領域內容做任何增刪。

#### 不得偽造的 identity

`report_id` 只存在於 `report.json`，legacy sidecar 從來沒有這個欄位。**轉接層不得從 `report.json` 複製一份填進去**：envelope 驗證的用途正是比對 sidecar 與 report 的 identity 是否相符，若值本身就是從比對對象複製來的，這項檢查會恆為真，變成一個看起來有做、實際上沒有效力的驗證。

處理方式沿用本文件對 `report_revision` 既有的原則——缺少就誠實記為未驗證，不假裝有。轉接產生的 envelope 必須攜帶 provenance 標記，區分哪些欄位是來源真正攜帶的、哪些是轉接層供給的。legacy Time 的 identity 綁定實際強度只到 scope 層級（`inspectTimeAnalysis` 已經在做 `scope_id` 比對），這一點必須在診斷中可見，不得被轉接動作掩蓋。

#### 兩個不得混同的語意

- **`as_of` 不等於 `generated_at`**。`as_of` 是分析採用的基準時鐘，`analyze --as-of <ISO>` 可以刻意固定它以取得可重現的結果；`generated_at` 是投影產生的時間。使用 `--as-of` 時兩者確實不同。轉接層以 `as_of` 供給 `generated_at` 是不得已的近似，必須在 provenance 標記，且 `data` 內保留原本的 `as_of` 作為權威值。
- **`method` 不等於 `generator`**。`method`（`deterministic-capacity-feasibility` v0.3）是演算法身分，`generator` 是產生工具身分。若把 `method` 直接當成 `generator`，「換工具但演算法不變」與「換演算法」在資料上將無法區分。`method` 留在 `data` 內不動；`generator` 由轉接層據實自述為轉接層本身——因為在讀取時轉接的模型下，這個 envelope 確實是轉接層產生的。

#### provenance 不進入 envelope 契約

轉接產生的 provenance（哪些欄位是來源攜帶、哪些由轉接層供給、identity 綁定只到 scope 層級）**不加進共同 envelope 的欄位**。轉接層回傳兩個並列的東西：一份符合現有契約、可直接送進 `validateModuleEnvelope` 的 envelope，以及一份描述這次轉接的 provenance；診斷由後者產生。

理由是責任歸屬：provenance 描述的是「這份 envelope 是怎麼被轉接出來的」，屬於讀取時的一次性事實，不是模組資料契約的一部分。真正原生輸出 envelope 的模組（例如 Cost）根本沒有轉接行為，也就沒有這種欄位可填；若把它放進共同 envelope，等於為了 legacy 遷移期的暫時狀況，永久擴張每個模組都要面對的契約。共同 envelope 的欄位維持不變，轉接層不因此取得修改共同契約的權力。

### Time-first 垂直切片

Time 不整包搬遷；依能力由低到高驗證同一契約：

1. **唯讀 estimate-only**：manifest 發現既有 Draft 0.2 sidecar，建立 project／task／item index，顯示「交付日未定」摘要、item capsule 與估算 detail。這是最小 end-to-end case，不啟動 deadline runtime，也不改本機寫入。
2. **完整 deadline**：沿用同一 Time Module 增加容量、風險、每分鐘／`pageshow`／foreground refresh 與 `dispose()`，證明 Runtime Controller 不洩漏到 Core。
3. **本機編輯與 preview**：在 Launcher provider 與 analysis module 完成後，讓共享 Time Dialog 的草稿、重新計算、multi-file transaction 走 module capability；公開 Viewer 仍沒有寫入能力。
4. **legacy parity gate**：對相同 `time.analysis.json`，manifest 路徑與 legacy discovery 的可見模型、診斷、無障礙名稱及風險計算相同；只有載入來源不同。

若第一切片仍要求 `app.js`、`ReportFolder` 或 route registration 新增 Time 專用分支，先修正共同接口，不進入 deadline 或編輯切片。

### 實驗性遷移與功能唯一性

實驗版本可以與正式版本同時存在於 source tree，但不得同時成為功能權威。功能唯一性以「一次執行只有一個資料擁有者、一個 Renderer、一個 Runtime Controller 與一條寫入路徑」判定，不以「repository 只能出現一個 adapter class」判定。

Time 的共用邊界固定如下：

```text
Legacy discovery adapter ─┐
                          ├─ Normalized Module Input
Manifest module loader ───┘          │
                                     ▼
                              Shared Time Module
                              ├─ time-model／validator／subject index
                              ├─ TimeDialog／capsule／detail Renderer
                              ├─ deadline runtime
                              └─ preview／save capability adapter
```

- Legacy 與 manifest 路徑只負責「如何找到並正規化 artifact」，不得各自複製 Time Schema 驗證、估算算法、TimeDialog、capsule、deadline runtime 或編輯 transaction。
- Loader 對 sidecar 只讀取一次，再把不可變 snapshot 交給選定的 adapter；不得讓兩條路徑各自 fetch 後形成不同時間點的狀態。
- Production composition root 每次只啟用一個 discovery adapter。manifest 存在時選 manifest；不存在時選 legacy。兩者最後註冊同一個可信任 Time Module。
- 實驗 registry 選擇由 test harness 或 exact-loopback Developer host 注入，不寫入 report／manifest，也不成為公開 URL capability；資料檔不能要求 Viewer 啟用實驗程式。
- 新舊 adapter 的選擇只能存在於 composition root，不得散布成 `if experimental`、`if legacy` 或產品名稱分支。

實驗依序使用四種模式：

1. **Fixture mode**：新 loader 只跑純模型與 contract fixtures，不載入 production Viewer。
2. **Passive shadow mode**：正式 legacy adapter 繼續擁有畫面與 runtime；新 loader 對同一不可變輸入產生 normalized result，僅記錄安全裁切後的差異。Shadow 不得呼叫 `render()`、`start()`、preview、save 或 route mutation。
3. **Isolated preview mode**：只在測試或 exact-loopback Developer host 中，由新 loader 單獨成為 active adapter；legacy adapter 完全不啟動。它仍使用同一個 Time Module 與共享 UI，讓人可操作測試但不產生第二套介面。
4. **Production cutover**：parity gate 通過後，composition root 將 manifest loader 設為正式路徑；legacy adapter 僅保留為無 manifest scope 的相容 fallback，直到移除條件成立。

Shadow 比對使用固定 `as_of`，比較 schema version、identity、subject index、capability、估算數值、風險結果、diagnostic code 與可執行 action 集合；排除 fetch timing、物件順序及非語意性的產生時間。若新版刻意改變產品行為，差異必須先成為明確的新驗收規格，不得把它列入 parity 例外後靜默放行。

實驗性遷移的退出條件：

- source scan 證明 Time UI 與領域算法各只有一份 production implementation；
- instrumentation 證明一次 scope load 只有一個 active adapter、一個 Time Module instance 與一個 deadline timer；
- shadow mode 無 DOM、timer、network mutation、route mutation 或檔案寫入能力；
- isolated preview 關閉後不留下 module state、event listener、timer 或 edit session；
- 相同 fixture 在 legacy 與 manifest 路徑產生相同 normalized semantic result；
- 切換 adapter 不改 `report.json`、Time sidecar 或共享 UI contract，回退只需切回 composition selection。

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

`estimated` 分類的領域設計草稿（`cost.config.json`、`cost.analysis.json` 形狀、Analyzer 邏輯、與 Time 的跨模組新鮮度處理）在 `Documentation/CostEstimationModulePlan.md`；本節只保留排程與跨領域邊界決策，避免與該文件重複維護同一份 schema。

## 分階段實作

### 規模與依賴

```text
Phase 0 契約凍結（本 Draft 已完成）
└─ Phase 1 Schema／純模型
   ├─ Phase 2 Viewer／Time 遷移
   ├─ Phase 3 Launcher／Analyzer 遷移
   └─ Gate：Phase 2＋3 的 Time parity 都通過
      └─ Phase 4 Cost 第二模組驗證
         └─ Phase 5 Generic metrics／SDK 評估
```

```text
Execution size       : large
Architectural impact : system-level
Evidence             : 現有 Time 特例至少分布於 17 個 JS／Svelte／Node 檔與 7 個 C#／Python 檔，並跨 Viewer、CLI、LocalWebService、Analyzer、Schema 與發布流程
Precedent             : Phase 1 是新共同契約；Phase 2／3 是保行為的既有 Time 移植；Phase 4 是第二案例的抽象驗證
Proof                 : Schema／純模型單元測試、Node 與 .NET 整合測試、實際 localhost Viewer、靜態 Pages 路徑與 390px／鍵盤／螢幕閱讀器人工驗證
```

整體工作不可視為一次大改。每個 Phase 必須能獨立合併、保留基本報告可用，且前一 Phase 的退出條件通過後才進下一 Phase。Phase 2 與 Phase 3 可以分支開發，但 Time 遷移的完成判定必須同時滿足 Viewer 與 Host／Analyzer 兩側。

### Phase 0：語意與邊界

- 採 `report.modules.json`，第一版每個 module type 每 scope 一個 instance。
- manifest、共同 envelope 與領域 Schema 各自版本化；新模組必須提供 `report_revision`。
- public／developer／local 由 artifact 組裝與 route 註冊真正分離。
- unknown module 只在 localhost／Developer diagnostics 顯示技術資訊。
- stale projection 停止 inline、action 與 runtime，只保留待重算的 detail 說明。
- Core 固定預設顯示順序；manifest 與 Renderer 不得控制 slot order。

完成條件：不依賴 Time 欄位即可描述一個模組及其生命週期，且上述決策已由本 Draft 固定。此 Phase 不產生 production code。

### Phase 1：Schema 與純模型

- 建立 manifest JSON Schema。
- 建立 common envelope Schema 或可重用 `$defs`。
- 建立安全 source resolver。
- 建立 registry、version negotiation、diagnostic 與 subject index 純函式。
- 為未知 type、版本不符、identity 不符、orphan、stale 與部分失敗建立測試。

交付物：manifest Schema、common `$defs`、module loader 純模型、diagnostic code 表與 fixture matrix。

完成條件：不操作 DOM、不啟動服務即可完整驗證模組發現、版本協商、路徑限制、identity、revision 與 subject 配對；無效 manifest 不影響獨立的 `report.json` 驗證。

**已完成（2026-08-24）：** `schemas/report.modules.schema.json`（manifest Schema，`schema_version` 固定 `"0.1"`）、`schemas/module-envelope.schema.json`（common envelope `$defs`，供未來領域 Schema 以 `$ref` 引用、`data` 保持開放）、`viewer/assets/module-model.js`（`validateModuleManifest`、`validateModuleEnvelope`、`isSafeModuleSource`／`resolveModuleSource`、`evaluateProjectionFreshness`、`createSubjectIndex`、`loadReportModules` 純函式，`MODULE_DIAGNOSTIC_CODES` 診斷代碼表）、`tests/module-model.test.mjs`（27 個 fixture，涵蓋 unknown type、版本不符、identity 不符、orphan、stale、一個模組失敗不影響另一個）。純模型完全獨立於 `report-model.js` 與任何 Renderer；尚未被 `app.js`、Viewer registry 或 Launcher 引用——那是 Phase 2／3 的範圍。

### Phase 2：Viewer Registry 與 Time 遷移

- 建立可信任 Viewer module registry。
- 定義 slots 與 Renderer context。
- 先將 time-model、共享 Time UI 與 deadline runtime 包裝成唯一的 Time Viewer Module，讓 legacy discovery adapter 呼叫它而不改行為。
- 再加入 manifest loader、passive shadow 與 isolated preview composition；兩條 discovery 路徑只能產生同一 normalized module input。
- 保持既有時間功能及視覺回歸測試。
- 增加單一 Renderer 失敗不影響其他模組與基本報告的測試。

交付物：可信任 registry、slot contract、唯一 Time Viewer Module、legacy／manifest discovery adapters、shadow comparator、Developer preview composition 與 runtime dispose 測試。

完成條件：核心 `app.js` 不再直接包含時間領域載入流程；有 manifest Time、legacy Time、無 Time 三條路徑的可見行為與現況一致；一次只啟用一個 adapter／Renderer／controller，且模組例外不移除 task／item 核心內容。

**registry／slot contract 切片已完成（2026-08-24），Time 遷移本身尚未開始。** `viewer/assets/module-registry.js` 提供 `VIEWER_MODULE_SLOTS`（八個 slot 名稱）與 `createTrustedModuleRegistry(definitions)`：驗證每個 module type 的 `supportedSchemaVersions`、宣告的 slots 屬於白名單、`attach()` 必備、`render`／`start`／`dispose` 若存在必須是函式；重複 type 或格式錯誤在註冊時直接 throw（build-time 契約問題，不是 report 資料，不走 per-module 診斷隔離）。`supportedVersionsMap()` 的輸出形狀與 Phase 1 `loadReportModules({ registrySupportedVersions })` 的參數完全一致，`tests/module-registry.test.mjs` 有一個測試直接把 registry 接上 loader 證明兩者契合。**這個切片刻意不含**：把 `time-model.js`、共享 Time UI 與 deadline runtime 包成唯一 Time Viewer Module、legacy／manifest discovery adapters、shadow comparator——原因是探查 `app.js` 後發現時間邏輯與編輯功能（`state.editor.timeDraft`、`state.editor.deliveryPreview`、`state.editor.confirmingDeliverySave`、人工工時編輯）深度交織，直接包裝屬於改動已驗證正式程式碼的大範圍重構，使用者決定先只做風險與 Phase 1 相當的純新增部分，Time 包裝留待下一次單獨確認範圍。`app.js` 目前不 import `module-registry.js` 或 `module-model.js`，此切片不影響任何現有行為。

### Phase 3：Launcher Provider 與 Time Analyzer 遷移

- 建立安全 manifest/module artifact discovery。
- 建立本機精確 route 註冊與 stale route 清理。
- 將時間輸入發現與產生包裝成 analysis module。
- 保留沒有時間輸入時不自動建立資料的政策。
- 驗證多 scope、多模組、路由衝突與目錄逃逸。

交付物：module provider、analysis-module registry、Time provider／analyzer adapter、精確 route 註冊與 stale route 清理。

完成條件：新增純資料模組時，不必修改 `ReportFolder` record 或 LocalWebService 固定檔名白名單；`analyze`、`open`、`start` 的 Time 行為與原有輸出保持相容，目錄逃逸與衝突在任何 service mutation 前失敗。

### Phase 4：Cost 第二模組

- 建立 cost Draft Schema，固定 actual／committed／estimated／replacement、幣別、基準日、分類、分攤與 provenance 語意。
- 建立最小分析快照與 Renderer。
- 驗證 project/task/item 三層掛載。
- 驗證 time 與 cost 同時存在、cost 明確讀取 time 投影、任一模組失敗及顯示順序。

交付物：Cost Draft Schema、最小 analyzer／外部投影 fixture、Renderer 與跨模組 lineage 測試。

完成條件：第二模組只透過共同接口接入，Core 沒有 Cost 領域名稱、固定檔名或 Time Renderer 相依；沒有 Time 時仍能顯示直接成本，有 Time 時能以明確 input revision 重算 estimated／replacement 成本。

`estimated` 切片的第一版 Schema 草案與案例見 `Documentation/CostEstimationModulePlan.md`；此 Phase 開始時以該文件為起點，`actual`／`committed`／`replacement` 與 item 層仍依本節既有範圍延伸。

### Phase 5：一般指標與開發套件評估

- 評估受限 `taskprogress.metrics` Renderer。
- 整理模組範例、Schema 模板與測試 helper。
- 只有在第三方確實需要獨立開發模組時，才評估外部 SDK、套件載入與安裝流程。
- 動態程式模組若進入設計，必須另行處理簽章、來源信任、權限、更新與隔離，不沿用資料 manifest 直接執行。

此 Phase 不阻塞 Time／Cost。`taskprogress.metrics` 白名單、外部 SDK 與多 instance 支援只有在出現第三個真實案例後才設計，避免用假想變體擴張第一版契約。

## 遷移與回退

- Phase 1 只新增純模型，不接管 production 載入路徑；回退是停止呼叫新模型，基本報告與 Time 不受影響。
- Phase 2／3 期間先由 legacy adapter 接上唯一 Time Module，再以 passive shadow 驗證 manifest loader。新路徑發生回歸時，關閉 Developer composition 或移除 `report.modules.json` 即回到 legacy discovery；不得要求修改 `report.json`。
- manifest 存在時以 manifest 為唯一 discovery 來源，不再執行 legacy filename discovery；manifest 不存在時才自動尋找既有 `time.analysis.json`。同一 sidecar 不得被載入或顯示兩次。
- legacy discovery 至少保留到 Cost 完成、公開 Pages 與 localhost 都通過一個 release cycle；移除必須另立遷移決策、版本與升級說明。
- 每個 Phase 的 schema、source 與產出 bundle 必須同一變更交付；已提交的 Viewer bundle 不得落後於 registry／Renderer source。

## 驗證矩陣

至少覆蓋：

- 無 manifest、空 manifest、有效 manifest、無效 manifest；
- legacy time、有 manifest time、兩者同時存在；
- fixture、passive shadow、isolated preview 與 production composition；
- shadow 嘗試 render、start、preview、save 或 route mutation 時必須被 capability boundary 拒絕；
- legacy／manifest adapter 對相同 snapshot 的 normalized parity，以及固定 `as_of` 的 deadline parity；
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

## 驗收清單

1. 以只有 `report.json` 的 fixture 證明零模組路徑不增加錯誤或空 UI。
2. 以 manifest Time fixture 證明工程估算、estimate-only、deadline、容量編輯與 runtime refresh 保持行為。
3. 以 legacy Time fixture 證明遷移期間不要求既有 scope 先改資料。
4. 以 instrumentation 證明新舊 adapter 可留在 source tree，但一次只存在一個 active Renderer、controller、timer 與寫入能力。
5. 以 shadow capability tests 證明實驗路徑不能產生 DOM、timer、network／route mutation 或檔案寫入。
6. 以未知、無效、stale 與 Renderer exception fixtures 證明錯誤只隔離單一模組。
7. 以路徑 traversal、cross-origin、過大 payload 與重複 identity fixtures 證明資料不能擴權。
8. 以 Cost fixture 證明三層 subject、visibility 裁切、Time 可選輸入與無 Time 降級。
9. 以 source scan 證明 Core loader、`ReportFolder` 與 route whitelist 不含 `cost` 特例；Time UI／算法只有一份 production source，adapter 選擇只存在於 composition root。
10. 以實際 localhost 與靜態相對路徑驗證 manifest、sidecar、query override、scope switch 與 stale route 清理。
11. 以 390px、鍵盤與螢幕閱讀器驗證 capsule strip、detail、diagnostic 與 focus restoration。
12. 由未參與實作者逐項對照本清單，任何一項可判為 unmet；不以「全部測試有跑」取代架構驗收。

## 延後但不阻塞的決策

1. 同一 module type 的多 instance 支援：等出現真實命名與比較需求後另行升級 manifest major version。
2. `taskprogress.metrics` 的元件白名單與無障礙限制：在 Phase 5 由第三個真實模組案例決定。
3. 外部開發 SDK 與動態 Renderer：Time／Cost 只驗證內建可信任 registry，不因此承諾套件安裝系統。
4. 對外穩定 Schema：manifest 與 common envelope 在 Time 遷移及 Cost 驗證期間維持 repository-internal Draft；Phase 4 通過並有升級／相容指南後才評估 1.0。
5. legacy Time discovery 的移除版本：必須取得至少一個 release cycle 的雙 host 證據後另行決定。
