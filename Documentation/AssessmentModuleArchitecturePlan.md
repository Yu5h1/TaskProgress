# 評估型模組與跨模組結算設計

> 狀態：Draft 0.1；方向已於 2026-08-25 與使用者討論並收斂，尚未實作。
>
> 與其他文件的關係：`ExtensionModuleArchitecturePlan.md` 擁有所有擴充模組都必須遵守的 manifest、共同 envelope、trusted registry、slot、生命週期與隔離契約；本文件只定義「需要人工／AI／歷史依據、逐層加總與風險分析」這一類評估型模組可共用的互動與資料責任。`TimeEstimateDeadlineDecouplingPlan.md` 與 `CostEstimationModulePlan.md` 分別擁有 Time、Cost 的領域規則。實作狀態與下一步仍由 `handoff.md` 記錄。

## 系統階層與關係

```text
TaskProgress
└─ Extension module system
   ├─ 通用模組契約：discovery、envelope、registry、slots、diagnostics
   └─ Assessment module family（本文件）
      ├─ 共用評估互動
      │  ├─ 人工輸入
      │  ├─ AI 分析提案
      │  └─ 歷史／外部參考導入
      ├─ 共用加總模型
      │  └─ item leaf → task total → module project total
      ├─ 獨立領域模組
      │  ├─ Time：工時需求、工作容量、期限風險
      │  └─ Cost：耗材、人工、複雜度與金錢資源風險
      └─ 末端複合結算
         └─ 明示讀取多個已提交投影，例如「Time 工時 × 費率」
```

依賴方向是 `共用評估能力 ← Time／Cost`，以及 `Time 投影＋費率／Cost 投影 → 末端結算投影`。Time 與 Cost 互不讀取、互不改寫；複合結算也不把結果回灌成任一上游模組的原始事實。

## 摘要

評估型模組共享的是「如何取得依據、如何形成一個可確認的估計、以及如何將同單位的子項逐層加總」，不是共享一條萬用領域公式。人工、AI 與歷史資料都是估計的 contributors；Time 與 Cost 各自決定輸入欄位、單位、公式、風險門檻及顯示方式。

需要跨領域換算時，不在 Time 或 Cost 之間建立隱藏橋樑。`工時 × 時薪` 這類計算放在依賴圖末端的複合結算，由它明示保存所讀取的投影版本、換算方法與新鮮度。這讓 Time、Cost 能各自獨立存在、失敗及演進，也讓混合結果的責任可追溯。

## 問題與目標

要解決的問題：

- Time 與 Cost 都會出現人工輸入、AI 分析、歷史參考、確認、逐層加總與診斷；若各自完整重做，互動與 provenance 會漂移。
- 若把所有相似處都塞進擴充模組核心，外部狀態、一般指標等非評估模組會被迫承擔不相干的欄位與生命週期。
- 若 Cost 直接依賴 Time，沒有 Time 就無法成立，且工時投影更新會使 Cost 的核心責任與新鮮度變得不清楚。

設計目標：

- 抽出可重用的評估互動與加總規則，但保留 Time、Cost 的領域所有權。
- 讓每個估計能說明來源、方法、信心、確認狀態與資料版本。
- 讓同單位數值以 stable subject identity 從 item 加總到 task，再加總到 project。
- 讓跨模組計算成為獨立、可版本化、可失效的末端結算，不產生循環依賴。
- 讓 Viewer 能共用互動殼層，同時由模組決定摘要文字、格式、tone、詳細資訊與風險算法。

明確非目標：

- 不把所有擴充模組都改成 assessment module。
- 不建立可由 manifest 提供並執行的任意公式；算法仍須由可信任 analyzer／module implementation 提供。
- 不把 AI 或網路搜尋放進公開 Viewer runtime。AI 與外部資料只在上游準備階段產生提案或參考快照。
- 不用一個通用 `risk` 公式同時解釋時間、金錢、品質或其他領域。
- 本文件不排程實作，也不改動現有 Time sidecar 或分析器。

## 責任邊界

### 擴充模組通用契約

只擁有模組發現、共同 identity、來源路徑安全、版本協商、subject 對應、slot、生命週期、stale／orphan 診斷及失敗隔離。它不知道人工、AI、工時、貨幣、費率或風險公式。

### 評估型模組共用層

只擁有以下可重用語意：

- 評估草稿與已提交投影的分離；
- contributors、typed inputs、references、analysis method、calculation、confidence、human confirmation；
- 同單位 leaf result 的逐層加總與 coverage／completeness；
- 共用的檢視、編輯、分析／導入、審閱、確認、儲存、錯誤與放棄互動狀態；
- 共用 shell 可呈現的依據、信心、完整度與診斷區塊。

它不決定欄位名稱、輸入單位、估計公式、風險門檻、摘要文案或顏色語意。

### 領域模組

Time 與 Cost 分別擁有自己的 input schema、result schema、單位、calculator、風險與 projection formatter。領域模組可以選用評估共用層；不需要評估互動的模組不受此契約約束。

### 末端複合結算

複合結算是獨立的 derived module／analysis，而不是通用模組核心中的特殊分支。它擁有：

- 明示的上游 module type、module ID、schema version 與 artifact revision；
- 跨單位換算的可信任公式與額外輸入，例如費率；
- 輸入 coverage、freshness、去重規則與結算範圍；
- 自己的投影、顯示與風險結果。

它不得改寫上游投影，也不得讓上游 Renderer 直接互相呼叫。

## 共用評估設計

### 來源是 contributors，不是三份互斥結果

人工、AI 與歷史參考可以同時影響一次估計，因此它們是 contributors；最終只能有一個 active result，避免 project composition 重複計算。

一筆評估至少能表達：

```text
Assessment record
├─ subject：scope／task／item stable identity
├─ contributors：human／ai／historical-reference
├─ inputs：值、單位、來源、revision、備註
├─ references：來源、擷取時間、可比性、品質與採用狀態
├─ analysis_method：如何解讀非結構化資訊
├─ calculation：可信任算法 ID、版本、公式說明
├─ result：單一 active value，可選合理範圍
├─ confidence：證據對結果的支持程度
└─ human_confirmed：人類是否接受這個最終結果
```

`human_confirmed` 與 `contributors` 分開。有人填過參數不代表他已接受最後結果；AI 提案或歷史樣本也不能自動成為已確認值。

### 三種入口的共同互動

1. **人工填寫**：直接建立或修改 typed input，進入同一份 module draft。
2. **AI 分析**：依目前任務語意與可用輸入產生 proposal、方法與信心；只更新草稿，不自動提交。
3. **歷史／外部參考導入**：保存可追溯 reference、擷取時間、可比性與是否採用。網路資料必須先由可信任上游取得及裁切，Viewer 不自行搜尋。
4. **審閱與確認**：在同一個 detail panel 比較 contributors、參考與最終結果；人類可接受、調整或排除。
5. **儲存與重算**：成功驗證後才提交 module inputs，並由該模組的可信任 analyzer 產生 projection；失敗保留原 projection 與草稿。

輸入欄位與顯示值使用同一個 panel 位置；膠囊只提供摘要與入口，不另存第二份可編輯值。這沿用既有主面板／子項膠囊契約與 one-UI-source 規則。

#### AI 與歷史參考的產出者：外部工具（2026-08-25 使用者決策）

第 2、3 兩種 contributor 由**完全外部的工具**產生，寫入該模組的 `*.estimates.json`；TaskProgress 只讀取結果，不執行 AI，也不發出網路請求。

| | 責任 |
|---|---|
| 外部工具 | 呼叫 AI／查詢歷史來源、判斷可比性、**在寫檔前完成隱私裁切**、寫入 estimates 檔 |
| TaskProgress | 讀取、驗證、呈現、讓人類審閱與確認 |

固定的規則：

- **TaskProgress 不因此增加任何執行面。** 不新增 CLI 子命令、不新增 analysis module、不新增網路呼叫；模組系統的「不執行報告指定的程式」原則不受影響。
- **讀入的資料一律驗證，不因為來自自家工具就信任。** estimates 檔走與人工輸入相同的 schema 與可比性檢查；工具產出的 proposal 進來後仍是**草稿**，`human_confirmed` 只能由人在 Viewer 內給。
- **裁切在寫入前完成。** 外部來源的原文、查詢字串、完整個資不得進入 estimates 檔——它是會被 analyzer 讀取並可能影響公開投影的資料。
- **estimates 檔就是契約。** 工具與 TaskProgress 之間只靠這個檔案形狀溝通，沒有其他約定。

選這條路的理由：在模組契約本身還在變動的期間，把 AI 完全留在產品邊界之外，變動只影響一個檔案格式而不是一條執行路徑。日後若要升級成 `task-progress.exe` 子命令或 analysis module，**資料形狀不必改**——改的只是誰去產生它，所以這個決定不會把後面的選項鎖死。

### 歷史與網路資料的最低品質

歷史參考只有在任務類型、技術、規模、難度、方法與資料品質可比時才可影響估計。每筆參考至少保存：

- 可識別但經隱私裁切的來源或 reference；
- `captured_at`／`accessed_at` 與資料適用期間；
- 可比性條件及被採用或排除的原因；
- 原始單位與正規化方式；
- 來源 revision 或內容指紋（可取得時）。

證據不足時，模組應回報缺資料或明確的低信心預設，不能顯示虛構的精確值，也不能用零代表未知。

### 可加總數量的逐層彙總

共用加總只處理「同一模組、同一計量維度、可相加」的 active result：

```text
task_total
= sum(item leaf active results belonging to the task)

module_project_total
= sum(task totals)
 + explicit project-only adjustments
```

規則：

- duration 使用整數分鐘；money 使用同幣別的最小貨幣單位整數。
- 不同幣別、不同計量維度或語意不相容的值不能由共用 rollup 強行相加。
- task-level estimate 若是 item 資料不足時的 fallback，不得再與已涵蓋的 item 加總；否則會 double count。
- task／project 直接調整必須標記 coverage 與原因，例如 project-only 訂閱或 overhead，不能偽裝成子項加總。
- 任一 leaf 缺值時，總數必須標示 `partial` 或依領域政策暫停顯示；不能把缺值補零。
- **未設置不是零，也不是領域預設值（2026-08-25 使用者決策）。** 沒有 active result 的 leaf 一律排除於加總之外，並使該層 coverage 成為 partial；不得先代入一個領域預設值再計入總數。代入預設值比補零更難察覺：補零至少讓總數偏低而顯眼，代入預設值卻會產出一個看起來完整、實際上沒有任何依據的數字。Time 現況正是這個反例——`estimate_defaults.unplanned_item_likely_minutes` 使每個未估算 item 得到 8 小時，本專案自身報告的 54240 分鐘因此 100% 來自預設，113 個 item 全部是 `mode: "default"`，而畫面上呈現為與真實估算無異的「約需 88 hr」。改為排除後，同一份報告的時間數字會直接消失，而不是換成另一個佔位文字。

排除之後各層的顯示，依「有沒有真實資料可讀」判斷，不是全有全無：

| 層級 | 情況 | 顯示 |
|---|---|---|
| leaf（子項） | 未設置 | 預覽不顯示膠囊；編輯模式才顯示未設置標記 |
| task／project | **部分** leaf 已設置 | **顯示已設置那些的加總**，並標記 coverage 為 partial——那是真實資料，只是不完整 |
| task／project | **全部** leaf 皆未設置 | **不顯示**該數值 |

最後一列是重點：全數未設置時要做的是**不顯示**，而不是顯示「尚無估算」「待估」之類的字樣。那類字樣是把一個佔位符換成另一個佔位符，仍然違反「預覽只呈現有實際參考意義的資料」。編輯模式另有未設置標記作為入口，該顯示的地方已經顯示了。
- risk、confidence、ratio 與 tone 不是可加總數量，由領域模組重新計算或歸納。

共用 rollup 可以提供 stable subject traversal、去重、coverage 與整數加總，但由模組提供 value selector、unit compatibility、fallback policy 與 formatter。

## 領域設計

### Time：需求、容量與期限風險

Time 的 leaf quantity 是工程需求分鐘。人工、AI、歷史依據先形成 item／task 的工時結果，再逐層加總為 project demand。

作息與生活時間不是加到工程工時上的第二種 demand；它們用來扣除每日不可工作的容量：

```text
daily_available_minutes
= 1440
 - sleep_minutes
 - life_minutes
 - other_unavailable_minutes
```

實際需要的日曆時間，是從排程時間線累積可用分鐘，直到足以容納未完成 demand 的最早時間點。期限風險以同一單位比較：

```text
capacity_balance_minutes
= remaining_scheduled_capacity_minutes
 - unfinished_demand_minutes
```

天數、日期與燈號都是這組分鐘事實的衍生顯示。Time 自己擁有 working weekdays、例外、deadline boundary、pressure／feasibility 門檻及顯示方式；共用評估層不理解這些語意。

### Cost：原生成本與金錢資源風險

Cost 的 leaf quantity 是單一幣別的最小貨幣單位。第一個獨立切片可使用 Cost 自己的 typed inputs：

- 耗材：數量 × 單價；
- 人工：Cost 內直接輸入的工種數量／計價單位 × 單價，或直接人工金額；
- 複雜度：可信任 Cost 公式的參數或調整項，必須說明套用基準，不能同時當獨立成本分類又重複乘入；
- 其他直接成本：訂閱、外包、硬體、電力或明示的 project-only adjustment。

Cost 不讀取 Time 才能成立。即使兩者都存在，Cost 的原生估計仍只由 Cost 自己的輸入與算法產生。

Cost 的資源風險同樣以貨幣比較：

```text
cost_balance_minor_units
= available_money_resource
 - unfinished_estimated_cost
```

幣別、可用資源定義、是否計入已承諾／已發生成本、複雜度公式與風險門檻全部由 Cost 擁有。

## 末端複合結算

### 第一個具體案例：工時換算人工成本

若需要以 Time 工時換算時薪，不在 Cost Analyzer 裡加入可選 Time 讀取，而建立末端的 `LaborCostSettlement`（名稱為設計角色，正式 module type／檔名於實作前再凍結）：

```text
Time projection（minutes） ─┐
                            ├─ LaborCostSettlement ─→ money contribution
Rate input（money/hour） ───┘
```

它至少保存：

- Time module identity、schema version、artifact revision 與所用 task／item coverage；
- 費率資料的 revision、幣別與適用角色／subject；
- 分鐘轉小時與捨入規則；
- 產生的 labor contribution、confidence、freshness 與 calculation version。

沒有費率、subject 對不上、Time stale 或幣別不相容時，只使這份結算缺失或過期；Time 與 Cost 仍各自正常顯示。

### 合併後的財務結算

需要回答「把 Cost 原生估計與 time-rate labor 都算進去後，預算是否足夠」時，再由末端財務結算讀取兩份已提交投影：

```text
Cost projection ────────────┐
LaborCostSettlement ────────┼─ Financial settlement → combined total／balance／risk
Available money resource ───┘
```

結算必須標記各 contribution 的 identity、coverage 與去重規則。若 Cost 原生估計已包含某段人工，不得再加上相同 coverage 的 time-rate contribution。合併 risk 屬於結算投影，不覆蓋 Cost 原生風險。

第一版只需要證明一個真實的 time-rate 案例；在第二個跨模組公式出現前，不建立可執行任意公式的通用結算語言。

## 顯示責任

共用 shell 可以提供：

- 主面板／子項膠囊列與 detail panel 容器；
- contributor／reference 清單；
- confidence、coverage、freshness 與 diagnostics 區塊；
- draft／analyzing／reviewing／saving／error 狀態及確認／放棄行為。

每個領域模組仍提供：

- 膠囊 label、值格式、accessible name 與 detail section；
- 單位、幣別、分類與公式說明；
- neutral／on-track／at-risk／critical tone 的領域映射；
- stale 時哪些 inline 值或 actions 必須停用；
- risk 的計算與解釋。

共用元件可以接收 tone，但不能根據數值替 Time 或 Cost 決定 tone。

### 未設置的值：預覽不顯示，編輯才顯示（2026-08-25 使用者決策）

一般原則：**預覽模式只呈現有實際參考意義的資料。未設置的值沒有參考意義，因此不顯示**；編輯模式顯示它，是因為需要一條進入編輯的路。

套用到膠囊：

| 模式 | 未設置的子項 | 理由 |
|---|---|---|
| 預覽 | **不出現膠囊** | 沒有值可讀，一個空殼膠囊只會佔位並讓讀者以為有資料 |
| 編輯（且該模組的設定檔存在） | 顯示 `(-hr)`／模組對應的未設置標記 | 這是開啟該子項編輯面板的入口；沒有它就無法為未估算項目建立第一筆估算 |
| 編輯（模組設定檔不存在） | 不出現膠囊 | 還沒有可寫入的目的地，先顯示入口只會導向一個不存在的面板 |

未設置標記顯示的是「未設置」這件事本身，不是一個數值，因此不參與加總、不影響 tone，也不得被誤讀為零。這同時解掉既有的「`待估` 不可點選，未估算子項無法從列上取得估算」缺口——那個缺口的成因正是未估算項目被填入預設值後看起來已有估算，於是沒有任何入口去真正設定它。

各模組自行決定未設置標記的文字與單位（Time 用 `-hr`，Cost 用其幣別的對應形式）；共用 shell 只負責在正確的模式下顯示或隱藏它。

### 狀態歸屬：殼層持有通用狀態，模組持有自己的草稿（2026-08-25 使用者決策）

| 持有者 | 狀態 | 理由 |
|---|---|---|
| 共用 shell | `idle`／`analyzing`／`saving`／`error`／`dirty` 這類**與領域無關**的互動狀態，以及它們之間的轉換與可否關閉面板 | 每個評估模組的這段行為完全相同；分散實作會讓「儲存中不能關閉」這種規則在各模組漂移 |
| 領域模組 | **自己的草稿值**、欄位驗證、什麼算「已套用」、以及送出時要提交什麼 | 只有模組知道自己的單位、欄位相依與合法範圍 |

殼層不讀草稿內容，只知道它是否 dirty、目前處於哪個通用狀態；模組不畫面板外框、不管關閉行為。

被排除的兩個選項與理由：

- **殼層持有全部互動狀態（含草稿）**：殼層會被迫理解各模組的欄位與驗證規則，等於變成通用表單引擎。第一版只有 Time 一個真實案例，用單一案例長出來的「通用」表單幾乎必然是錯的抽象。
- **模組持有全部狀態、殼層只管版面**：`saving`／`error` 與關閉保護會在每個模組各寫一次，正是 one-UI-source 規則要避免的重複。

實作路徑：以 Time 現有的 `TimeDialog`／`ManualEstimateEditor` 為**唯一**真實案例抽出契約，不在只有一個案例時泛化。特別注意 Time 的編輯草稿目前存在 `app.js`（`state.editor.timeDraft`），把它搬進模組會同時觸發尚未決定的 runtime controller 擁有權問題——因此第一版允許草稿仍由 host 持有並透過 callback 提供，只要殼層／模組的責任分界照上表成立即可。

## 案例

1. **只有人工估時。** 人類填寫每個 stable item 的分鐘數並確認；Time rollup 產生 task／project demand。沒有 deadline 時仍顯示需求，不產生期限 risk。
2. **AI 提案加歷史參考。** AI 根據任務內容與兩筆可比歷史資料提出結果；使用者排除一筆品質不足的參考後確認。projection 保留 contributors、採用依據與 confidence，但只加總單一 active result。
3. **Cost 獨立存在。** 沒有 Time，Cost 仍可用耗材、Cost-local 人工與複雜度公式產生 task／project 金額及預算餘額。
4. **需要工時換算。** Time、費率與 Cost 都已提交；末端 labor settlement 產生獨立 money contribution，財務結算再明示合併並檢查 coverage。Cost 本身沒有 Time dependency。
5. **Time 更新、結算未更新。** Time 顯示最新估算，Cost 顯示自己的最新原生估計；labor／financial settlement 因 input revision 不符標為 stale，不用舊工時更新金額，也不拖垮兩個上游模組。

## 決策理由與替代方案

- **評估共用層位於模組契約之上。** manifest／envelope 是所有模組的最低契約；人工、AI、歷史與加總只適用於 assessment family。把兩者合併會讓外部狀態與一般指標背負錯誤語意。
- **來源與結果分開。** 人工、AI、歷史可以共同支持一次估計；若把它們當三份可加總結果，總工時與總成本會重複。
- **Time 與 Cost 平行。** 兩者使用不同單位與風險資源，獨立存在的產品價值也成立。Cost 直接選用 Time 會把一個具體換算需求變成核心依賴。
- **跨模組計算放在末端。** 明示 input revisions 可精確回答哪個結果過期；獨立降級也不會把上游模組一起停用。
- **不先做通用公式引擎。** 可信任的具名 analyzer 足以驗證第一個 time-rate 案例，且不把資料 manifest 變成程式執行入口。

## 驗收與遷移

設計驗收：

- 人工、AI、歷史參考能形成同一筆 active assessment，不會被重複加總。
- item → task → project 的加總只接受同單位 active result，並能表達 fallback、project-only adjustment 與 partial coverage。
- Time 的工時 demand、容量與期限 risk 分層清楚；作息／生活只改變容量，不加進 demand。
- Cost 在完全沒有 Time 時仍能產生原生成本與自身的金錢資源 risk。
- `工時 × 時薪` 只存在於末端結算角色，保存 input revisions，且不回灌 Time 或 Cost。
- 各模組與結算可獨立 stale、失敗及降級；Core 不含 Time、Cost 或 time-rate 特例。
- 共用 Viewer 元件只擁有互動 shell，領域顯示與算法仍由各模組提供。

遷移順序：

1. 先完成既有 Time 的 trusted module 遷移，不改算法。
2. 以 Time 現有 contributors／inputs／calculation 欄位驗證 assessment record 能力，不急著改公開 sidecar。
3. 以不讀 Time 的 Cost estimated 切片驗證共用互動與 additive rollup。
4. Time、Cost 都能獨立運作後，再以一個 time-rate settlement 驗證跨模組 lineage、freshness 與去重。
5. 只有第二個真實複合公式出現後，才判斷是否值得抽出更通用的 settlement profile。

## 尚未決定

- 共用 shell 的**對話框層**已於 2026-08-26 抽出為 `DialogShell.svelte`，形狀來自 `TimeDialog` 與 `ThemeControl` 兩個真實 host：`open`／`id`／`dialogClass`／`kicker`／`title`／`titleId`／`closeLabel`／`onClose` 加一個 slot。剩下未定的是**評估專屬層**——膠囊列與 detail panel 容器、contributor／reference 清單、confidence／coverage／freshness 區塊要以什麼 props 接。它仍然只有 Time 一個真實案例，等 Cost 的 estimated 切片出現後一起定，不預先擬定。
- 上述狀態機（`idle`／`analyzing`／`saving`／`error`／`dirty`）刻意**還沒**進 `DialogShell`。Time 的對話框沒有自己的儲存，草稿套進全域 edit session 由 SaveBar 負責，所以這組狀態目前只有 `DeliverySaveConfirmation.svelte` 的 `busy` 一個真實案例。責任歸屬照「狀態歸屬」一節不變，落點等第二個真實案例。
- assessment record 應成為可重用 JSON Schema `$defs`，或先只作可信任 module implementation 的內部 contract；等 Time 遷移時以現有資料形狀驗證後決定。
- Cost-local 人工的第一版計價單位與複雜度調整公式；由 Cost 領域設計在實作前以真實案例凍結。
- `LaborCostSettlement` 與財務結算是同一個 module type 的兩個 capability，或兩個獨立投影；先以最小端到端案例決定，不能讓這項命名阻塞 Time／Cost 獨立化。
