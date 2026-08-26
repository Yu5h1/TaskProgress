# Viewer 圖像總覽與漸進展開需求

> 狀態：Requirements Draft 0.1；視覺方向已由使用者提出，尚未形成完整實作計畫，也尚未實作。
>
> 與其他文件的關係：`UIConvergenceOneSourcePlan.md` 擁有「同一 UI 元素只有一份實作」的收斂規則；`ExtensionModuleArchitecturePlan.md` 擁有 module slots 與失敗隔離；`ScheduleProjectionModulePlan.md` 擁有未來甘特圖所需的排程資料；sibling workspace `..\Dandelion\Documentation\CoreInteractionArchitecturePlan.md` 擁有可跨產品重用的 anchor／line／node／route／transition contract。本文件只擁有 Viewer 的圖像優先總覽、向下漸進展開、detail shell 與 TaskProgress 圖層語意。現行任務卡、filter、Time detail 與編輯能力仍由既有設計擁有。

## 系統階層與關係

```text
TaskProgress Viewer
├─ Minimal overview（預設收合）
│  └─ Progress visualization
│     ├─ 專案起點／截止點
│     ├─ 今日、進度、速度與風險圖層
│     └─ 展開／detail 控制
└─ Detail surface（向下展開）
   ├─ View tabs
   │  ├─ 任務卡（現行 UI，第一個可用 view）
   │  └─ 甘特圖（待 Schedule 設計成熟）
   ├─ Module／filter bar
   │  └─ 各項對應自己的 detail panel
   └─ Existing task cards and module details
      └─ 保留現有閱讀、篩選與編輯能力
```

Detail surface 是同一頁內由總覽向下展開的共用容器，不是第二個 Dashboard，也不是重新製作一套任務卡。資料仍由 Report、Time、Schedule 與其他模組擁有；視覺層只組合它們已驗證的投影。

## 摘要

Viewer 的預設入口改採「圖像先於文字」：收合時只顯示一個極簡進度圖表，讓使用者先判斷專案走到哪裡、今天位於工期何處、速度層級與風險是否接近。標題、解釋、公式與大量數值不在第一層堆疊。

這不是放棄現有 Viewer。使用者按下展開、detail 或圖示後，圖表下方向下展開 detail surface；現有任務卡是第一個 detail view，之後才加入甘特圖與各模組面板。因此重構改變的是資訊階層，不是刪除既有功能。

## 已確定的需求

### 圖像優先、文字最少

- 收合狀態只保留進度圖表、必要圖示與可操作的展開入口。
- 起始日、今日、截止日等短標示只在辨識座標時出現；更完整的數字、公式與說明放入 tooltip、accessible label 或展開後面板。
- 不以三張 KPI 卡片、密集表格或長句作為極簡首頁。
- 圖示不能取代可存取名稱；鍵盤與螢幕閱讀器仍能讀出進度、日期、速度與風險語意。

### 階層式向下展開

- Minimal overview 是預設第一層。
- 點擊展開／detail／圖示後，在同一頁向下揭露 Detail surface，不以全畫面換頁取代目前內容。
- 展開後第一個可用 view 是現有任務卡；任務卡的狀態、子項目、filter、模組膠囊與編輯能力不得因新總覽遺失。
- 再次收合只隱藏 detail surface，不清除使用者已選的 tab、filter 或模組 panel；重新載入時才回到產品核定的預設狀態。
- 動畫服務於階層理解：內容由進度線附近淡入並向外／向下展開，不做裝飾性的大幅移動。

### 圖表與細節面板分工

Viewer 分成兩個責任：

1. **圖表**：顯示可在一眼內判讀的進度、時間、速度與風險關係。
2. **細節面板**：保存任務卡、甘特圖、各模組數值、算法說明、編輯與診斷。

圖表不重新實作 Time 或 Schedule 算法；細節面板也不複製另一份摘要公式。兩者消費同一份 projection，只是資訊密度不同。

## 進度圖表需求

### 基本視覺結構

概念結構：

```text
        其他資訊                                     今日
            ┆                       當前進度            ┆
起始日      ┆                          ┆     風險        截止日
●────────── 🔥 ─────────────── 🐢／🐇／🐎／🐆 ──────────●
```

- 水平主線表達專案從起始邊界到截止邊界的整體跨度。
- 今日使用獨立垂直虛線，不能和工作進度 marker 混成同一事實。
- 進度 marker 的水平位置表達工作完成位置。
- 動物圖示暫作速度層級的圖像語彙：烏龜、兔子、馬、豹同時承擔「目前進度位置」與「運行速度類別」兩種辨識。
- 火圖示暫作反向的時間／容量風險訊號；它的算法與精確位置尚未定義。
- 其他模組資訊可以用 marker 加入，但不能讓主線退化成塞滿標籤的時間表。

### 兩種座標語意

時間與工作進度不能在資料上混為同一個百分比：

```text
time position     = (現在 - 專案開始) / (截止 - 專案開始)
work position     = 已完成工作量 / 全部可計進度工作量
```

兩者可以共享同一條視覺基線，但必須是可辨識、可開關的不同圖層：

- **時間圖層**：起始日、今日、截止日與時間剩餘。
- **進度圖層**：當前完成位置與進度變化。
- **速度圖層**：以動物 glyph 或後續核定圖像表示 pace class。
- **風險圖層**：以火或後續核定圖像表示模組提供的風險狀態。
- **其他資訊圖層**：模組化 marker，不直接擴張 Core 圖表邏輯。

若同時顯示，今日與進度 marker 使用不同垂直 lane、虛線或 glyph；不能因兩者碰巧重疊就只保留一個 marker。只顯示其中一層時，另一層以 fade-out 離開，而不是把座標重新解釋成另一種數值。

### Marker 疊加

- 多個資訊落在相同或接近的水平位置時，以垂直虛線向上堆疊成 lanes。
- 每個 marker 保留獨立 hit target、focus target 與 accessible name。
- 預設只顯示 glyph；hover、focus、點擊或 detail 展開後才提供文字。
- marker 數量超過可讀範圍時先依圖層開關與重要性收斂，不在主線上自動塞入縮小文字。

### 圖層開關與動態

- 進度、時程、速度、風險與其他模組資訊可分別開關。
- 開啟時從主線附近向外移動並 fade-in；關閉時反向收回並 fade-out。
- 圖層切換不重新載入資料、不改變 report，也不觸發分析器。
- 同一頁生命週期保留圖層選擇；是否持久化至 browser preference 留待完整計畫決定。
- 遵守 `prefers-reduced-motion`；減少動態時只做立即或極短淡入淡出，不以位移傳達唯一語意。

## Detail surface 初步邊界

Detail surface 先定義容器責任，不提前定義甘特圖內容：

```text
Detail surface
├─ View tabs：切換主要呈現方式
├─ Filter／module bar：選擇範圍或模組資訊
└─ Detail panel slot：呈現目前 view／filter／module 的內容
```

- `任務卡` 與未來 `甘特圖` 是不同 view，不是兩份同時堆疊的頁面。
- 任務卡 view 直接掛載現有 TaskCard／ItemRow 單一來源元件。
- 甘特圖 view 只有 `ScheduleProjectionModulePlan.md` 的資料與互動契約成熟後才設計。
- Filter bar 的每一個可操作項目都要有明確的 detail panel 或篩選結果；不能出現可按但沒有內容責任的膠囊。
- 模組 detail 透過共用 shell／slot 接入；Core 不新增 Time、Schedule、Cost 等逐一硬編碼的面板分支。
- tab、filter 與 module selection 是三種不同狀態，完整計畫必須決定它們的組合與復原規則，不能用同一組 active class 混在一起。

## 與現有 UI 的相容原則

- `UIConvergenceOneSourcePlan.md` 的 One UI Source 規則不變；新總覽不能另做一份平行 TaskCard 或 filterbar。
- 現有 Viewer 是展開後 detail 的起點，不是刪除標的。
- 現有 Time capsule／detail、任務卡、子項目、狀態 filter、編輯 session、Undo／Redo 與 SaveBar 保持資料和控制語意。
- 新圖表只是 projection layer；不能接管 report mutation、Time risk 計算、Schedule 排程或 module draft。
- 未來若採用 Dandelion，TaskProgress 只把 progress／today／risk／module marker 註冊成 anchors／nodes；通用 line routing、vertical lanes 與 enter／exit transition 不在 Viewer 內另做第二份。
- 沒有 Time、Schedule 或其他模組時，不顯示空 marker、零值、假日期或無內容 tab。
- 模組 stale／invalid 時，對應圖層 marker 隱藏或顯示通用待重算狀態，不以最後一次位置假裝仍有效。

## 資料來源初步對應

| 圖像 | 第一個可用來源 | UI 不擁有的部分 |
|---|---|---|
| 起始／截止 | Time deadline projection | 日期、時區與容量規則 |
| 今日 | Viewer runtime clock + Time timezone | 工作進度 |
| 進度位置 | Report progress projection | 工時或期限推算 |
| 速度 glyph | 待定的 pace projection | 門檻與歷史校準 |
| 火／風險 | Time 或後續 risk module | 風險算法、門檻與 evidence |
| 甘特圖 | Schedule projection | dependency、resource 與排程算法 |
| 其他 marker | Extension module slots | 模組資料與驗證 |

既有 `deterministic-capacity-feasibility` v0.3 可以作為第一個風險輸入，但火圖示如何表達嚴重度、距離或變化仍需另行決定。UI 不建立第二套風險公式。

## 規模與驗證方向

```text
Execution size       : large（未排程）
Architectural impact : system-level
Evidence             : 新增總覽層、detail shell、view tabs、module filters、動畫狀態與未來 Schedule view，並重組現有 TaskCard 的頁面位置
Precedent             : One UI Source、module slots、Time detail 與現有 TaskCard 可重用；圖像多圖層軸與共用 detail shell 是新模式
Proof                 : interaction model tests、現有元件單一來源檢查、實際桌面／390px、鍵盤、螢幕閱讀器、reduced-motion 與視覺人工驗證
```

本輪不拆 Phase，也不建立 checklist。甘特圖、風險圖像與圖層預設仍有設計問題，現在排實作順序會過早固定錯誤邊界。

## 需求驗收基準

1. 預設收合畫面以進度圖表為主，不以 KPI 卡片與長文字構成首頁。
2. 一次明確操作可向下展開現有任務卡，不換掉或複製現有 Viewer。
3. 今日與進度位置能同時存在、分層顯示並分別關閉，資料語意不混成一個百分比。
4. marker 重疊時使用垂直 lanes／虛線保持可辨識，且每個 marker 可用鍵盤與螢幕閱讀器操作。
5. 圖層切換使用低干擾 fade／位移，並提供 reduced-motion 降級。
6. 任務卡 view 保留現有 filter、module detail 與編輯能力；收合再展開不遺失頁面內選擇。
7. 甘特圖與其他模組使用共用 Detail surface／slot，不在 Core 複製領域面板。
8. 缺少、過期或無效模組資料時不顯示假 marker、零值或空 detail tab。
9. 桌面與 390px 都能辨識主線、今日、進度與展開入口，且沒有水平頁面溢出。

## 本輪未定義

以下項目保留在 `handoff.md#open-decisions`，不在 Requirements Draft 中假裝已有答案：

- 火圖示究竟表示風險等級、風險距離、容量燃燒或其他量，以及如何由既有風險資料映射。
- 預設顯示時間、進度或交錯 overlay，與兩者重疊時的精確 lane 規則。
- 烏龜／兔子／馬／豹的正式視覺、速度門檻與是否需要更換圖像語彙。
- Filter／module bar 每一項的 panel contract、組合狀態與行動版互動。
- 甘特圖 view 的列層級、縮放、dependency 與資源視覺；由 Schedule 設計後續承接。
