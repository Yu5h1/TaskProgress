# 預估成本模組（Cost — estimated）

> 狀態：Draft 0.3；2026-08-28 依使用者的模組化定案修訂邊界。v1 切片的 CLI 側已於 2026-08-26 實作（`CostEstimationGenerator`／`cost.analysis.json`），但它是在舊邊界下寫的——見〈邊界修訂〉。
>
> 與其他文件的關係：`ExtensionModuleArchitecturePlan.md` 擁有 manifest、共同 envelope、trusted registry、Viewer slots、生命週期與隔離契約；`AssessmentModuleArchitecturePlan.md` 擁有人工／AI／歷史依據、逐層加總與跨模組末端結算的共用設計。本文件只擁有 Cost `estimated` 切片的原生輸入、金錢算法、資源風險與呈現。實作排程仍記錄在 `handoff.md`。

## 系統階層與關係

```text
TaskProgress
└─ Extension module system
   └─ Assessment module family
      ├─ taskprogress.time（獨立，無依賴）
      ├─ 材料模組（獨立，無依賴；type 暫名，尚未設計）
      ├─ 人工模組（獨立，無依賴；type 暫名，尚未設計）
      └─ taskprogress.cost（本文件）
         ├─ depends_on：時間、人工、材料（軟依賴，缺席即忽略）
         ├─ 私有輸入：cost.config／cost.estimates.json
         ├─ Analyzer：CostEstimationGenerator
         └─ Viewer 投影：cost.analysis.json
```

## 邊界修訂（2026-08-28 使用者決策）

使用者在模組化討論中定案兩點，直接改寫本文件先前的核心邊界：

1. **材料與人工各自是獨立模組**，彼此無依賴，也不是 Cost 的內建分類。判準是它們有自己的生命週期。
2. **估價（本模組）依賴時間、人工、材料**，「才能全部一起算」。Cost 因此從「自己算錢的原生模組」變成**合成端**。

這**推翻**了 2026-08-25 的「Cost 不讀 Time」決定，以及 `handoff.md#ruled-out-directions` 中對應的那條。當時的三個反對理由現在有兩個已被 `ExtensionModuleArchitecturePlan.md#模組依賴與重算` 解掉：新鮮度有了定義好的機制（`content_revision` 比對與 dirty 傳遞），失敗隔離有了明確語意（軟依賴缺席即忽略並在畫面上明說未計入）。第三個理由——「工時 × 時薪」該由誰擁有——**尚未解決**，見〈尚未決定〉。

### 人工與材料兩個模組的方向（2026-08-28，方向不是定案）

使用者明確表示「目前依然有點模糊，先按照這個方向前進」。以下是**行進方向**，不是凍結的設計；實作前仍須以真實案例收斂。兩個模組落地時各自擁有獨立文件，本節屆時搬出——暫記於此只因為它們是 Cost 的上游。

**人工模組提供算式，估價模組做計算。** 這是本輪最重要的一句，它同時回答了「`工時 × 時薪` 歸誰」：

- **時間模組**提供工時，維持既有職責不變。
- **人工模組**計算能力、年資與額外契約，最終產出的可能是時薪、月薪、年薪，或以任務完成計費。它產出的是**計價算式**，不是最終金額。
- **估價模組**讀入工時與人工的算式，執行計算。

因此不需要另立 `LaborCostSettlement`：估價模組本身就是結算點。`## 決策理由與替代方案` 中「跨模組換算另立末端結算」那條可以正式收掉，等這個方向被真實案例驗證後再刪。

**「算式」必須是具名、參數化、由可信任實作解讀的資料，不得是任意可執行運算式。** `ExtensionModuleArchitecturePlan.md#安全與隱私` 規定 manifest 與 sidecar 只包含 JSON 資料，`#Descriptor 欄位` 也明文不接受可執行公式。人工模組送出的應該是「哪一種計價方式 + 它的參數」（例如 `hourly` 加上費率與幣別），由估價模組的可信任實作決定怎麼算；不能是一段由資料提供、由產品求值的運算式。

**材料模組是一份清單。** 使用者選擇彈性較大的陣列項目，每一項填材料名稱、單價與數量，金額為單價 × 數量。

- 這與 Cost v1「刻意沒有 `quantity × 單價`」相反。當時的理由是讓 Cost 的葉節點與 Time 的葉節點同形以驗證共用層，那個理由只約束 Cost 自己的葉節點，不約束一個獨立的材料模組。
- **庫存不是材料的計價方式。** 使用者判斷即使要處理庫存，計價仍然是單價 × 數量。天臺案例的「工具壞掉可以加入重新計算」因此是「清單多一項」，不是庫存／採購追蹤系統。

### 初版試跑：天臺案例（2026-08-28）

使用者的判斷是「實際跑一輪就知道缺什麼」。以 `reports/rooftop` 的真實報告為 fixture，把材料與人工兩份輸入實際填出來（`reports/rooftop/material.estimates.json`、`labor.rates.json`，草稿，**沒有任何 manifest 指向它們，產品不會載入**），再依新邊界手算一次合成。

初版採用的形狀（依 2026-08-28 討論）：

- **材料**：`lines[]`，每行 `task_id`／`item_id`／`name`／`unit`／`quantity`／`unit_price_minor_units`／`price_basis`／選用 `note`。金額 = 數量 × 單價。
- **`price_basis` 是具名分類**（`market_quote`／`inventory`／`estimate`），不是自由文字。使用者的「因為從庫存獲取，所以比市面價格低廉」拆成 `price_basis: "inventory"` 加一行 `note`。理由：自由文字答不出「哪些項目用了庫存價、共多少錢」，而那是之後一定會問的問題；這也與既有「分類來自固定表、不現場發明」的原則一致。營建估價實務同樣要求逐行記錄價格來源。
- **人工**：`rates[]`，每筆 `pricing_model`（`hourly`／`monthly`／`annual`／`per_task`）加 `parameters`。**用詞從「算式」改為「計價方式」**——時薪是 rate、按任務完成是 lump sum，兩者是不同的計價模型，不是同一條公式代不同參數；這同時滿足「不得是任意可執行運算式」的約束。

#### 試跑結果：兩個真問題

以 `hourly = 300`、Time 的每項 `likely_minutes` 與上述材料明細合成：

| item | 材料 | 人工 | 合計 |
|---|---|---|---|
| breakdown（企劃） | 0 | 2,400 | 2,400 |
| sweep（打掃） | 0 | 2,400 | 2,400 |
| clean-tools（工具添購） | 800 | 2,400 | 3,200 |
| filler-material（補土材料） | 1,500 | 2,400 | 3,900 |
| paint-material（防水漆材料） | 6,400 | 2,400 | 8,800 |
| paint-tools（施工工具） | 390 | 2,400 | 2,790 |
| **專案合計** | | | **23,490** |

預算是 20,000，所以這份報告會宣告超出預算。**但超出的部分是憑空生出來的。**

**問題一：Time 為每個 item 一律代入 480 分鐘預設值。** `time.config.json` 的 `estimate_defaults.unplanned_item_likely_minutes: 480` 讓每個沒有估計的 item 都拿到 8 小時。上表六項全部是 2,400 元人工，包括三項純採購。共 9,600 元、佔總額 41% 的人工費完全是編造的；扣掉後總額 13,490，在預算內。

這與 `AssessmentModuleArchitecturePlan.md#可加總數量的逐層彙總` 的明文規定衝突：沒有 active estimate 的 item 應排除於加總之外並使 coverage 成為 partial，**不得代入任何領域預設值**。Cost 遵守這條，Time 不遵守。舊邊界下兩者不相乘，這個矛盾沒有後果；新邊界下它直接變成錢。

**這不必然是 Time 的錯。** 對排程而言「還沒估的工作仍然要佔時間」是合理的規劃預設；對金錢而言「還沒估的成本是未知，不是某個數字」才對。所以真正的問題是**兩個模組對缺資料的政策相反，而合成端把它們相乘**。要修的是哪一端尚未決定：讓 Time 區分「真實估計」與「規劃預設」並只讓前者參與跨模組合成，或讓合成端自己排除帶有預設來源的工時。前者較乾淨，因為 provenance 本來就該跟著數值走。

**問題二：`report.json` 的 item 同時放了工作項與採購項。** 「防水漆材料」「施工工具」「補土材料」是買東西，不是做事，卻都被指派了工時。這是問題一之所以會產生具體金額的結構原因——即使 Time 改成不補預設值，只要有人替採購項填了工時，同樣會算出人工費。營建估價實務的明細行就是工作項，材料是工作項的資源，不是與工作項並列的另一種項目。

#### 試跑同時暴露的四個缺口

1. **「誰做這個工作」沒有 owner。** 人工模組出費率，但費率該套到哪個 item 由誰決定沒有定義。`time.config.json` 只有 `executor_count: 1`，沒有執行者身分。單一費率時被 `default_rate_id` 蓋過去，一旦有第二種費率就卡住。
2. **幣別歸誰。** 三個模組各自獨立、各自宣告 `currency`，不一致時誰說了算未定義；而軟依賴又不允許下游假設上游一定在。
3. **工具與耗材沒有區分。** 滾筒、掃把重複使用，油漆用完就沒了。使用者的「工具壞掉可以加入重新計算」屬於前者，但目前兩者在同一個 `lines[]` 裡沒有區別。
4. **單位。** 材料有包／桶／支，Cost v1 完全沒有單位概念。

#### 材料的價格／用量不對稱（已知，刻意保留）

時間模組出工時（用量）、人工模組出費率（價格），材料模組則同時持有單價與數量。實務的切法是橫的——資源主檔／單價書持有價格，估價明細持有用量——而不是縱的材料 vs 人工。

第一版**刻意保留這個不對稱**，不做價格主檔。理由是現在連一個真實案例都還沒跑完，拆成價格側與用量側是過度設計。**會逼我們改的觸發點寫在這裡**：當同一種材料出現在多個項目、而它漲價時，得改 N 行。那一刻就是價格主檔該出現的時候。

本文件其餘章節仍是在舊邊界下寫的。凡是敘述「Cost 不讀 Time」「原生耗材與 Cost-local 人工由 Cost 擁有」「跨模組換算另立末端結算」之處，都以本節為準；逐段改寫等材料／人工兩個模組各自的設計落地後一次完成，以免現在就對還沒設計的形狀作假設。

## 摘要

Cost 的第一個切片回答「以目前 Cost 輸入，這個項目、任務與專案的原生預估成本是多少，以及目前金錢資源是否足夠」。人工、AI 與歷史參考可以共同形成估計，但最終只保留一個 active money result 參與加總。

第一版原生成本只處理耗材、Cost-local 人工、複雜度調整及其他直接成本。Cost 與 Time 使用相同的評估互動與 item → task → project rollup 形狀，但不共享公式、不共享單位，也沒有資料依賴。

## 問題與目標

要解決的問題：

- 專案目前無法記錄可追溯的預估金額、成本組成與金錢資源餘額。
- 舊草案把 Time projection 當成 Cost 的選用輸入，使「Cost 自己估什麼」與「跨模組如何換算」混在同一個 analyzer。
- 只做 project／task 加總無法驗證使用者提出的「子項加總 = 任務卡加總 = 模組總計」。

設計目標：

- Cost 不依賴 Time 也能獨立估算、驗證、呈現與降級。
- 以 stable item 為主要 leaf，將同幣別 active results 加總至 task 與 project。
- 支援人工、AI、歷史參考三種 contributors，以及明確 method、confidence 與 human confirmation。
- 讓耗材、人工、複雜度與其他成本的計算基準可追溯，避免重複計價。
- 以可用金錢資源減去未完成預估成本，產生 Cost 自己的 balance 與 risk。

明確非目標：

- 不在 Cost 內讀取 `time.analysis.json` 或重算 Time 工時。
- 不在第一版處理實際付款、發票、合約、交易、匯率或多幣別合併。
- `actual`、`committed`、`replacement` 類別延後；本文件只固定 `estimated`。
- 不把 complexity 變成一個無條件套用的全域倍率。
- 不提前排程實作；Cost 仍在 Time trusted module 遷移完成後開始。

## 責任邊界

> 2026-08-28 邊界修訂後，本節的分割已部分失效——材料與人工移出 Cost，成為獨立模組。以〈邊界修訂〉為準，本節保留為修訂前的紀錄，等材料／人工設計落地後改寫。

Cost 擁有：

- ~~Cost-local inputs~~（材料、人工移出）、參考、估計版本與可用金錢資源；
- 貨幣、成本分類、原生 calculator、捨入與 completeness 規則；
- item／task／project monetary rollup；
- Cost balance、risk threshold、摘要與 detail 顯示。

Cost 不擁有：

- Time 工時、容量或期限風險（**但現在會讀取**，見〈邊界修訂〉）；
- ~~time-rate labor conversion~~（歸屬未定，見〈尚未決定〉）；
- report 的 task／item identity 與進度事實；
- 真實金流、付款或法律狀態。

Core 不新增 Cost 欄位、固定 sidecar 名稱或領域分支。Cost 只透過 Descriptor、common envelope、subject index 與 slots 接入。

## 設計

### 私有輸入

#### v1 已凍結（2026-08-26 使用者決策；2026-08-28 部分被取代）

> 本小節描述的葉節點形狀已實作並在運作，但它是在材料／人工尚未獨立時寫的。葉節點金額在新邊界下的角色未定——它可能退化為「其他直接成本」，也可能整個被材料與人工模組取代。見〈邊界修訂〉與〈尚未決定〉。v1 的實作不因此立即改動，它仍是第二個真實模組的存在證據。

Cost 的葉節點就是**一個金額**，與 Time 的葉節點是一個分鐘數同形。它由人工填寫，日後也可由 AI 或歷史參考產生，但那是 contributors 的差別，不是形狀的差別。

v1 刻意**沒有** rate card、沒有 `quantity × 單價`、沒有 complexity 倍率。理由是 Cost 在此階段的任務是當第二個真實模組，驗證共用的 assessment 加總、未設置排除、partial coverage 與膠囊／面板契約；若一開始就給它一套 Time 沒有的計價機制，兩個模組長得不像，反而測不出共用層是否正確。

`cost.config.json`：

```json
{
  "schema_version": "0.1",
  "scope_id": "task-progress",
  "updated_at": "2026-08-26T12:00:00+08:00",
  "currency": "TWD",
  "currency_symbol": "$",
  "available_resource_minor_units": 20000000,
  "risk_thresholds": {
    "at_risk_remaining_ratio": 0.2
  }
}
```

`cost.estimates.json`：

```json
{
  "schema_version": "0.1",
  "scope_id": "task-progress",
  "updated_at": "2026-08-26T12:00:00+08:00",
  "estimates": [
    {
      "estimate_id": "cost-item-a-v1",
      "task_id": "task-a",
      "item_id": "item-a",
      "active": true,
      "contributors": ["human"],
      "amount_minor_units": 150000,
      "confidence": "medium",
      "human_confirmed": true
    }
  ]
}
```

輸入規則：

- 金額一律以**最小貨幣單位整數**保存，顯示時才換回主單位。世界上的幣別小數位不一，資料存細節、膠囊顯示粗略，是這兩件事各自的職責。
- 沒有 active estimate 的 item **排除於加總之外**並使該層 coverage 成為 partial。不得補零，也不得代入任何領域預設值——見 `AssessmentModuleArchitecturePlan.md#可加總數量的逐層彙總`。
- 同一 item 只能有一筆 `active` estimate。
- 幣別符號預設 `$`，可代表 NT$；正式幣別代碼另存於 `currency`。

#### 縮寫與顯示（2026-08-26 使用者決策）

顯示採國際通用縮寫，與 YouTube 觀看次數同一套：`K` = 1,000、`M` = 1,000,000、`B` = 1,000,000,000。**不使用「萬」**，因為它只在中文圈成立，而幣別本身就是跨區域的。

#### 記錄但不實作

以下三項已有方向，v1 不做，等 v1 證明共用抽象成立後再各自以真實案例決定：

1. ~~**父層定義分類、葉節點填值。**~~ **2026-08-28 已被取代**：材料與人工不是 Cost 的分類，而是各自獨立的模組（見〈邊界修訂〉）。以下為原文紀錄。由 Cost 在專案層定義一組具名成本分類（材料、工程、⋯，可增列），子項面板則顯示這些分類讓人逐項填值。好處是分類只定義一次，子項不各自發明名稱。這個模式也可能適合處理特殊開銷——直接填「理由 + 數值」，不需要複雜系統。使用者認為它甚至可能屬於模組核心而非 Cost 專屬；但那需要第二個模組也真的需要它才能判斷，因此先記不做。
2. **complexity 以倍率表達，不以獨立成本項表達。** 中文語境慣用「漲幾成」，倍率是自然的形式。落地時必須指明 basis（只乘人工小計、只乘材料小計，或乘總額），且同一個加成不得既列為成本項又乘進總額。
3. **可用金錢資源先只做 project 層預算**，不拆到 task；等真實需求出現再決定是否拆分。

### `CostEstimationGenerator`

Analyzer 只讀 `report.json`、Cost 私有輸入及 Cost 的歷史／參考資料：

1. 依 report 的 stable task／item identity 驗證每筆 active Cost estimate。
2. 使用 estimate 指定的 rate card 與具版本 Cost calculator 計算 item money result。
3. 同一 item 只能有一筆 active result；舊版本透過 `supersedes_estimate_id` 保留 lineage，不被重複加總。
4. 加總 item leaf results 得到 task total；只有沒有 leaf coverage 時才允許 task-level fallback，且不得與相同 coverage 的 item 再相加。
5. 加總 task totals 與明示的 project-only adjustments，得到 project estimated total。
6. 依目前 report 完成狀態或 Cost 明示的 remaining policy 計算 unfinished estimated cost；不能直接用原總額減去付款紀錄假裝剩餘成本。
7. 以可用金錢資源比較 unfinished cost，產生 balance、risk basis 與 tone。
8. 輸出符合 common envelope 的 `cost.analysis.json`。

### 金錢資源風險

第一版先採同單位的直接可行性比較：

```text
cost_balance_minor_units
= available_resource_minor_units
 - unfinished_estimated_minor_units
```

最低邊界：

- `balance < 0`：`critical`，資源不足；
- `balance >= 0` 但剩餘比例低於設定門檻：至少 `at_risk`；
- 其餘可為 `on_track`；
- 成本 coverage 不完整或資源未知：不宣稱 on track，顯示 `unknown`／`partial`。

正式門檻要用真實案例調整。Cost risk 不使用 Time deadline、工作容量或 progress pressure；跨模組合併後的預算風險屬於末端財務結算。

### Viewer 投影

`cost.analysis.json` 概念形狀：

```json
{
  "module_type": "taskprogress.cost",
  "schema_version": "0.1",
  "module_id": "cost",
  "report_id": "task-progress-report",
  "scope_id": "task-progress",
  "report_revision": "sha256:<report.json hash>",
  "generated_at": "2026-08-25T18:00:00+08:00",
  "generator": {
    "id": "taskprogress-cost-analyzer",
    "version": "0.1"
  },
  "data": {
    "currency": "TWD",
    "summary": {
      "estimated_minor_units": 1250000,
      "unfinished_estimated_minor_units": 850000,
      "available_resource_minor_units": 1000000,
      "balance_minor_units": 150000,
      "risk": "at_risk",
      "coverage": "complete",
      "confidence": "medium"
    },
    "tasks": [
      {
        "task_id": "task-a",
        "estimated_minor_units": 480000,
        "coverage": "complete",
        "items": [
          {
            "item_id": "item-a",
            "estimated_minor_units": 180000,
            "breakdown": [
              { "category": "material", "minor_units": 45000 },
              { "category": "labor", "minor_units": 120000 },
              { "category": "complexity-adjustment", "minor_units": 15000 }
            ],
            "confidence": "medium"
          }
        ]
      }
    ]
  }
}
```

投影不含 Time identity 或 `time_input_revision`，因為 Cost 沒有讀取 Time。需要 time-rate lineage 的 projection 由末端結算擁有。

### Viewer 呈現

Cost 使用既有共用 module strip、capsule 與 detail shell，但提供自己的領域 props：

| 層級 | 摘要 | Detail |
|---|---|---|
| project | 預估成本、balance tone、chevron | 總額、未完成成本、資源餘額、breakdown、coverage、方法與依據 |
| task | task 預估成本 | task breakdown、item rollup、fallback／partial 診斷 |
| item | item 預估成本 | 人工／AI／歷史 contributors、Cost inputs、公式、confidence 與確認 |

顯示文字、貨幣格式、risk tone 與 Cost editor 都由 Cost module 提供；共用 strip／dialog 不判讀金額。

## 案例

1. **只有耗材。** 每個 item 使用數量 × 單價，逐層加總。沒有 labor 或 complexity 時不建立零元分類。
2. **Cost-local 人工與複雜度。** item 以 deliverable 數量 × 計價，再對 labor subtotal 套用具版本 complexity adjustment；breakdown 能重現，不 double count。
3. **人工、AI、歷史共同估價。** AI 參考可比歷史提出參數，人類調整並確認一個 active result；rollup 只計一次。
4. **部分項目待估。** task／project 顯示 partial coverage，不把待估補零，也不以不完整數字宣稱資源安全。
5. **同時存在 Time。** Time 與 Cost 各自正常顯示，沒有任何隱式換算；只有 scope 額外宣告末端 settlement 時才出現 time-rate labor 與合併財務結果。

## 決策理由與替代方案

- ~~**Cost 與 Time 解耦。**~~ **2026-08-28 推翻**，見〈邊界修訂〉。原文：原生 Cost 有耗材、直接人工、訂閱與複雜度等不依賴工程工時的輸入；把 Time 變成 Cost 的選用輸入會讓相同模組同時承擔原生估價與跨領域結算。
- ~~**跨模組換算另立末端結算。**~~ **2026-08-28 起存疑**：它的兩個好處（保存兩邊 input revisions、獨立 stale）現在由 `ExtensionModuleArchitecturePlan.md#模組依賴與重算` 的通用契約提供，而「不要求 Core 認識模組依賴圖」這個前提已不成立——Core 現在就是認識依賴圖。末端結算是否還需要獨立存在，列入〈尚未決定〉。
- **第一版涵蓋 item。** 使用者已把 leaf → task → project 加總確立為共用機制；若 Cost 只做 project／task，就無法用第二模組驗證這條共用能力。
- **complexity 不是自由倍率。** 沒有明示 basis 的倍率無法重現，也容易對已含複雜度的 labor 再乘一次。
- **先做 estimated。** actual／committed 牽涉真實金流來源與交易邊界；replacement 需要地區、基準日與市場資料。它們不是驗證評估共用層的最小案例。

## 驗收與遷移

設計驗收：

- 沒有 Time 時，Cost 可從自己的 item inputs 產生 task／project total 與 resource risk。
- 人工、AI、歷史是同一結果的 contributors，不是三份重複金額。
- Cost-local labor 與 complexity 的 basis 可重現且不 double count。
- 缺估、fallback、project-only adjustments 與 partial coverage 有明確行為。
- Cost projection 不含 Time lineage；time-rate lineage 只出現在末端結算。
- Viewer Core 不出現 Cost 特例，Cost 失敗不影響 report 或 Time。

實作順序：

1. 等 Time 的 trusted module／registry／provider 垂直切片完成。
2. 以一組真實 Cost item 凍結 rate unit、complexity basis 與 Cost input Schema。
3. 實作 Cost 獨立 item → task → project rollup、risk 與 Viewer 三層掛載。
4. 驗證 Cost 單獨存在及與 Time 並存但互不依賴。
5. 最後另立 time-rate settlement，驗證跨模組 revisions、freshness、coverage 與去重。

## 尚未決定

0. **2026-08-28 邊界修訂帶出的剩餘項（「工時 × 時薪 歸誰」已於同日定向，見〈人工與材料兩個模組的方向〉）：**
   - **兩個模組的 type 名稱與私有輸入 Schema。** 方向已定（人工出算式、材料是單價 × 數量的清單），但欄位形狀、人工那四種計價方式各自的參數、以及「以任務完成計費」如何對應 subject，都還沒有可重現的真實案例。
   - **v1 葉節點金額在新邊界下的角色。** 材料與人工移出後，Cost 自己的葉節點剩下什麼——可能是「其他直接成本」，也可能整個消失。
   - **材料項的「低價寫理由」該怎麼落地。** 使用者提到「價格低廉寫理由」，但這是指單價異常低時要填說明欄位，還是指零星低價材料不逐項列、以一行理由帶過，尚未確認。
1. Cost-local labor 第一版採哪一種真實計價單位；在 Phase 4 開始時用實際專案案例決定，不預先建立所有單位。
2. complexity 的第一個具名公式與允許 basis；必須先有可重現案例，不能只定一個任意倍率欄位。
3. available money resource 是單一 project budget，或需 task allocation；第一版傾向 project-only，再由真實需求決定是否拆分。
4. single-report 多幣別、週期成本換算與 actual／committed／replacement 的資料形狀仍延後。
