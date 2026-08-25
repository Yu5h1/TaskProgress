# 預估成本模組（Cost — estimated）

> 狀態：Draft 0.2；2026-08-25 依新的模組邊界修訂，尚未實作。
>
> 與其他文件的關係：`ExtensionModuleArchitecturePlan.md` 擁有 manifest、共同 envelope、trusted registry、Viewer slots、生命週期與隔離契約；`AssessmentModuleArchitecturePlan.md` 擁有人工／AI／歷史依據、逐層加總與跨模組末端結算的共用設計。本文件只擁有 Cost `estimated` 切片的原生輸入、金錢算法、資源風險與呈現。實作排程仍記錄在 `handoff.md`。

## 系統階層與關係

```text
TaskProgress
└─ Extension module system
   └─ Assessment module family
      ├─ taskprogress.cost（本文件）
      │  ├─ 私有輸入：cost.config／cost.estimates.json
      │  ├─ Analyzer：CostEstimationGenerator
      │  └─ Viewer 投影：cost.analysis.json
      ├─ taskprogress.time（同級、互不依賴）
      └─ 末端複合結算（另一份投影）
         └─ 選用讀取 Time 與費率，產生 time-rate labor contribution
```

Cost 不讀 Time 才能產生自己的 estimated projection。若產品需要「工時 × 時薪」或把 Time 與 Cost 合併後再評估預算，由末端結算明示讀取兩份已提交投影；結果不回灌 Cost。

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

Cost 擁有：

- Cost-local inputs、參考、估計版本與可用金錢資源；
- 貨幣、成本分類、原生 calculator、捨入與 completeness 規則；
- item／task／project monetary rollup；
- Cost balance、risk threshold、摘要與 detail 顯示。

Cost 不擁有：

- Time 工時、容量或期限風險；
- time-rate labor conversion；
- report 的 task／item identity 與進度事實；
- 真實金流、付款或法律狀態。

Core 不新增 Cost 欄位、固定 sidecar 名稱或領域分支。Cost 只透過 Descriptor、common envelope、subject index 與 slots 接入。

## 設計

### 私有輸入

第一版將 policy／resource 與逐項 estimate 分開，避免每次估計版本更新都重寫整份設定。

`cost.config.json` 概念形狀：

```json
{
  "schema_version": "0.1",
  "currency": "TWD",
  "available_resource_minor_units": 2000000,
  "risk_thresholds": {
    "at_risk_remaining_ratio": 0.2
  },
  "rate_cards": [
    {
      "id": "material-standard",
      "kind": "material",
      "unit": "piece",
      "minor_units_per_unit": 15000
    },
    {
      "id": "labor-deliverable-standard",
      "kind": "labor",
      "unit": "deliverable",
      "minor_units_per_unit": 60000
    }
  ]
}
```

`cost.estimates.json` 概念形狀：

```json
{
  "schema_version": "0.1",
  "scope_id": "task-progress",
  "estimates": [
    {
      "estimate_id": "cost-item-a-v1",
      "task_id": "task-a",
      "item_id": "item-a",
      "active": true,
      "contributors": ["human", "historical-reference"],
      "inputs": [
        {
          "kind": "material",
          "quantity": 3,
          "rate_card_id": "material-standard"
        },
        {
          "kind": "labor",
          "quantity": 2,
          "rate_card_id": "labor-deliverable-standard"
        },
        {
          "kind": "complexity",
          "basis": "labor-subtotal",
          "factor_millis": 1250
        }
      ],
      "confidence": "medium",
      "human_confirmed": true
    }
  ]
}
```

這只是 Phase 4 起點，不是已凍結 Schema。正式設計需補齊 reference、revision、supersedes、notes、範圍與整數上限。

輸入規則：

- money 使用最小貨幣單位整數。
- quantity 與 rate 的單位必須相容；換算由具版本 calculator 執行。
- Cost-local labor 可以是工件、班次、角色單位、固定人工金額或其他 Cost 定義的計價量，但不能暗中讀取 Time 的工程分鐘。
- complexity 是具名 calculator 的參數或明示 adjustment。它必須指出套用基準，例如只套用 labor subtotal；不能一面列為成本項、一面又乘進總額。
- 歷史／網路參考遵守 `AssessmentModuleArchitecturePlan.md` 的可比性與 provenance 規則。

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

- **Cost 與 Time 解耦。** 原生 Cost 有耗材、直接人工、訂閱與複雜度等不依賴工程工時的輸入；把 Time 變成 Cost 的選用輸入會讓相同模組同時承擔原生估價與跨領域結算。
- **跨模組換算另立末端結算。** 它能保存兩邊 input revisions、獨立 stale，且不要求 Core 認識模組依賴圖。
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

1. Cost-local labor 第一版採哪一種真實計價單位；在 Phase 4 開始時用實際專案案例決定，不預先建立所有單位。
2. complexity 的第一個具名公式與允許 basis；必須先有可重現案例，不能只定一個任意倍率欄位。
3. available money resource 是單一 project budget，或需 task allocation；第一版傾向 project-only，再由真實需求決定是否拆分。
4. single-report 多幣別、週期成本換算與 actual／committed／replacement 的資料形狀仍延後。
