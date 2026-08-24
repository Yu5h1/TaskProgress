# 預估成本模組（Cost — estimated）

> 狀態：設計草稿，方向已與使用者確認（2026-08-24）；尚未進入實作。
>
> 與其他文件的關係：`Documentation/ExtensionModuleArchitecturePlan.md` 擁有擴充模組系統的共同契約（manifest、common envelope、Viewer slots、生命週期、錯誤與安全政策）與 Cost 作為 Phase 4 第二驗證模組的排程門檻，本文件不重複那些規則。本文件只收斂 Cost 模組第一個切片——`estimated`（依目前輸入預估的未來成本）——的領域設計：資料形狀、輸入來源、分析邏輯與跨模組新鮮度。`actual`／`committed`／`replacement` 三類、item 層級掛載，以及本文件以外的架構決策，仍由 `ExtensionModuleArchitecturePlan.md` 的既有段落定義並延後。實作排程仍記錄在 `handoff.md`。

## 系統階層與關係

```text
TaskProgress
└─ Extension module system（ExtensionModuleArchitecturePlan.md）
   └─ taskprogress.cost（Phase 4 第二驗證模組）
      └─ 本文件：estimated 切片（v0.1）
         ├─ 私有輸入：cost.config.json（費率、固定成本項）
         ├─ 選用輸入：Time 模組的 time.analysis.json 投影（版本化讀取，非依賴）
         ├─ Analyzer：CostEstimationGenerator（確定性）
         └─ Viewer 投影：cost.analysis.json
            └─ 掛載於既有 project-summary／task-header／task-body／project-detail／task-detail slots
```

Cost 讀 Time 的公開投影作為輸入，但 Time 不知道 Cost 存在；這條依賴方向與 `ExtensionModuleArchitecturePlan.md` 的「依賴方向固定為 Host → Module Contract ← Trusted Module」一致，Cost Analyzer 只是把 Time 的投影當成一份具版本的資料來源，不是兩個 Renderer 互相呼叫。

## 摘要

Cost 模組的第一個切片，只回答「以目前輸入預估，這個專案／任務未來大概要花多少錢」，透過既有的模組共同接口掛進 Viewer，不新增 Core 責任。它可以在沒有 Time 模組時，僅呈現外包／訂閱等固定成本；若 Time 模組存在，則進一步把工時估算乘上費率並入 labor 成本。

## 問題與目標

- 要解決的問題：目前沒有任何地方能看到一個任務或專案的預估金額；成本相關的資訊完全不在 TaskProgress 範圍內。
- 設計目標：
  - 用 estimated 這一類最小驗證 Cost 模組的三層 subject 對應、商業資料隱私裁切與跨模組讀取這幾個 Phase 4 完成條件要求的能力，且成本最低、不牽涉真實金流資料。
  - 讓 Cost 在沒有 Time 模組時仍可用（至少呈現固定成本）。
  - 讓 Cost 明確讀取 Time 的投影作為版本化輸入，而不是重新猜測或複製 Time 的估算邏輯。
- 明確非目標：
  - `actual`（已發生）、`committed`（已承諾）、`replacement`（重製估價）三類不在本文件範圍，留給 `ExtensionModuleArchitecturePlan.md` 既有段落，待 estimated 切片驗證後再設計。
  - item 層級的成本掛載不在本文件範圍；v0.1 只做 project／task 兩層。
  - 不處理付款、發票、合約簽署或多幣別換算；那些屬於外部系統或之後才評估。
  - 不改變 Phase 1–3 的排程門檻——本文件是設計準備，不是要求提前進 Phase 4。

## 責任邊界

- Cost 模組擁有：`cost.config.json` 的費率／固定成本語意、`CostEstimationGenerator` 的計算方法、`cost.analysis.json` 的 `data` schema、estimated 分類的 breakdown 呈現。
- Cost 模組不擁有：Time 的估算算法或資料（只讀取其公開投影）、report 的任務／進度事實、真實金流／發票／合約狀態。
- Core（`report.json` 與模組系統）不新增 Cost 或 estimated 相關欄位、檔名或分支；Cost 只透過既有 Descriptor、common envelope 與 Viewer slots 接入。
- 資料跨界只有一個方向：`cost.analysis.json` 讀 `time.analysis.json` 的內容（若存在）與自己的私有輸入，產生新的獨立投影；Time 不讀、不呈現、不感知 Cost。

## 設計

### 私有輸入：`cost.config.json`

與 `time.config.json` 同層級的選用私有輸入，定義費率與固定成本項，不進入任何公開投影：

```json
{
  "schema_version": "0.1",
  "currency": "TWD",
  "rates": {
    "roles": [
      { "role": "developer", "hourly_minor_unit_amount": 60000 }
    ]
  },
  "fixed_items": [
    {
      "id": "ai-subscription",
      "category": "subscription",
      "label": "AI 開發訂閱",
      "minor_unit_amount": 300000,
      "period": "monthly",
      "task_id": null
    }
  ]
}
```

- `rates.roles`：角色對應每小時費率，供 labor 成本換算；沒有角色資訊的工時項目無法換算，只計入診斷，不臆測費率。
- `fixed_items`：訂閱、外包、硬體折舊等不經工時換算的固定成本；`task_id` 為 `null` 時計入 project 層，否則計入指定 task。
- 金額一律整數最小貨幣單位（分／cents 等），不使用浮點金額；理由與 `ExtensionModuleArchitecturePlan.md` 的通用金額慣例一致。

### Analyzer：`CostEstimationGenerator`

確定性產生 `cost.analysis.json`，輸入為 `report.json`（任務結構）、`cost.config.json`（必要）、`time.analysis.json`（選用，若存在則讀取其 task／item 工時估算）：

1. 讀取 `report.json`，建立 task 清單。
2. 讀取 `cost.config.json`；缺少時整個模組視為 `HasInputs = false`，不產生投影（與 Time 模組「沒有輸入不自動建立資料」的既有政策一致）。
3. 若 `time.analysis.json` 存在且可解析，記錄其 `report_revision`／自身 envelope 版本作為 `time_input_revision`；工時估算依角色費率換算為 labor 金額。
4. 依 `fixed_items` 的 `task_id` 分攤固定成本到對應 task 或 project 層。
5. 加總得出每個 task 的 `estimated` 金額與 breakdown（`labor`／`subscription`／`hardware`／`power`／`outsourcing`／`other`），project 層為所有 task 加總。
6. 輸出符合共同 envelope 的 `cost.analysis.json`，`module_type` 固定 `taskprogress.cost`。

### Viewer 投影：`cost.analysis.json`

```json
{
  "module_type": "taskprogress.cost",
  "schema_version": "0.1",
  "module_id": "cost",
  "report_id": "task-progress-report",
  "scope_id": "task-progress",
  "report_revision": "sha256:<report.json 的雜湊>",
  "generated_at": "2026-08-24T18:00:00+08:00",
  "generator": { "id": "taskprogress-cost-analyzer", "version": "0.1" },
  "data": {
    "currency": "TWD",
    "summary": {
      "estimated": {
        "minor_unit_amount": 1250000,
        "as_of": "2026-08-24",
        "confidence": "medium",
        "time_input_revision": "sha256:<time.analysis.json 的 report_revision>",
        "time_input_freshness": "current"
      }
    },
    "tasks": [
      {
        "task_id": "extension-module-phase1",
        "estimated": {
          "minor_unit_amount": 480000,
          "method": "time-rate-product",
          "scope_included": ["labor"],
          "breakdown": [
            { "category": "labor", "minor_unit_amount": 480000, "basis": "role-rate" }
          ],
          "confidence": "medium",
          "time_input_revision": "sha256:<same as above>"
        }
      }
    ]
  }
}
```

- 只有 `estimated` 分類，`summary`／每個 task 節點都留下同一個 key 名稱，之後加入 `actual`／`committed`／`replacement` 時是新增同層 key，不是改變既有 `estimated` 形狀——相容的小版本演進，不需要破壞性 schema。
- `time_input_revision`／`time_input_freshness` 是 Cost 自己的欄位，不是 Core 的通用 stale 機制：Core 只比對 `cost.analysis.json` 的 `report_revision` 對不對得上目前 `report.json`；「Time 估算是否比這份成本投影新」是 Cost 領域內的新鮮度問題，由 Cost 自己記錄與呈現，Core 不需要認識 Time 與 Cost 的關係。
- 沒有可換算的工時輸入時，`scope_included` 只列出固定成本分類（如 `["subscription"]`），不出現 `labor`，也不虛構零元的 labor 項目。

### Viewer 呈現

沿用既有 slot 與兩種膠囊分類（`ExtensionModuleArchitecturePlan.md` 的主面板／子項膠囊表），v0.1 只用主面板層級：

| | 主面板膠囊按鈕 |
|---|---|
| 掛載元件 | 新的 `CostSummaryButton`（顯示「預估成本 NT$12,500 ›」或無費率輸入時的中性文案） |
| 對應 slot | `project-summary`（專案層）／`task-header`（task 層） |
| 開啟的面板 | 新的 Cost detail 面板：金額、幣別、`as_of`、breakdown 表、`method`、Time 輸入新鮮度提示 |

item-inline 子項膠囊不在 v0.1 範圍，因為工時估算已在 item 層存在，先驗證 project／task 兩層匯總即可涵蓋「三層對應」完成條件的前兩層；加入 item 層屬於之後的擴充，不是本切片的驗證目標。

## 案例

1. **沒有 Time 模組，只有固定成本。** `cost.config.json` 只有 `fixed_items`（例如訂閱），沒有 `time.analysis.json`。Analyzer 產生 `estimated` 投影，`scope_included` 只含 `subscription`，不含 `labor`，`time_input_revision` 不出現。驗證「沒有 Time 時仍可呈現直接成本」的完成條件。
2. **Time 與費率都存在。** `time.analysis.json` 提供 task 的工時估算，`cost.config.json` 提供角色費率。Task 層 `estimated` 同時含 `labor`（工時 × 費率）與任何指定給該 task 的 `fixed_items`，`time_input_revision` 記錄目前讀到的 Time 投影版本。驗證「cost 明確讀取 time 投影作為輸入」的完成條件。
3. **Time 重新估算之後，Cost 還沒重算。** `report.json` 未變（`report_revision` 仍相符，Core 判定投影不 stale），但 Time 已產生新的 `time.analysis.json`。Cost 自己比對記錄的 `time_input_revision` 與 Time 目前投影不符，在 detail 面板標示「labor 金額依舊版工時估算」，而不是靜默顯示過期數字，也不是把整個 Cost 模組判定為 Core 定義的 `stale`（Core 的 stale 只管 Cost 相對 `report.json` 本身，不管 Cost 相對 Time）。

## 決策理由與替代方案

- **先做 estimated，不是四類一起做。** `actual`／`committed` 會牽涉真實付款與合約狀態，隱私裁切與來源信任的複雜度高出一截；`replacement` 需要地區費率與重製方法論，目前沒有真實需求驅動。estimated 只需要「工時 × 費率」與固定成本兩種最小資料，最適合先驗證模組契約本身（三層對應、跨模組讀取、隱私裁切）。四類一起做會讓第一次驗證同時揹上還沒被真實需求逼出來的設計，違反 Phase 4 完成條件本身「不使用假想變體擴張第一版契約」的精神。
- **先寫設計、不搶排程。** `ExtensionModuleArchitecturePlan.md` 已經把 Cost 排在 Time 完成 Phase 1–3 遷移之後，理由是要用同一套 trusted registry／manifest／Renderer 邊界先在 Time 上跑過一輪，再用 Cost 驗證這套邊界對「不同領域」是否仍然成立。如果現在就把 Cost 排到 Time 前面，等於在模組系統邊界還沒被證明之前，就要為 Cost 重新摸索一次同樣的邊界問題——兩邊各自摸索容易產生兩份不同的「暫時性模組載入方式」，之後要合併回同一契約反而更貴。這正是架構文件「功能唯一性」原則要避免的重複。所以本文件停在設計階段，實作等 Phase 1–3 的退出條件通過再開始。
- **v0.1 不做 item 層。** Time 模組已經在 item 層有人工工時輸入；Cost 若同時要在 item 層呈現金額，会在還沒验证 project／task 两层前就叠加第三层的呈现与排序问题。先在 project／task 两层验证三层对应的其中两层，item 层留给之后的迭代。
- **`time_input_revision` 放在 Cost 自己的資料裡，不是 Core 的新機制。** 曾經考慮讓 Core 的通用 stale 機制認識「這個模組的輸入還依賴另一個模組」，但那會讓 Core 認識 Cost 與 Time 的關係，違反「Core 不依賴 Time 或 Cost」的核心決策。改為 Cost 自己在 `data` 裡記錄並呈現，Core 完全不需要修改。

## 驗收與遷移

本文件本身的驗收，是設計是否可以在 Phase 4 開始時直接採用，而不是產出可執行程式：

- `cost.config.json` 與 `cost.analysis.json` 的 v0.1 形狀已寫下，可作為 Phase 4 的起點 Schema 草案。
- 三個案例證明「無 Time」「有 Time」「Time 領先於 Cost」都有明確、不臆測的行為。
- 沒有在 Core、`report.json` 或 Viewer 核心載入器引入 Cost 或 estimated 特例；所有掛載都透過既有 Descriptor／envelope／slots 完成。

尚未滿足、且本文件不試圖滿足的門檻（仍在 `ExtensionModuleArchitecturePlan.md` 與 `handoff.md`）：

- `ExtensionModuleArchitecturePlan.md` Phase 1（manifest／common envelope Schema、純模型、registry）尚未開始。
- Phase 2（Viewer trusted registry 與 Time 遷移）、Phase 3（Launcher provider 與 Time analyzer 遷移）尚未開始；Cost 需要這兩個 Phase 建立的 registry／provider 才能真正掛進 Viewer 與 Launcher。
- 本文件的 v0.1 estimated 設計要等上述 Phase 通過退出條件後，才作為 Phase 4 的第一個實作切片起點；`actual`／`committed`／`replacement`／item 層仍在 `ExtensionModuleArchitecturePlan.md` 既有段落，作為 Phase 4 之後的延伸。

## 尚未決定

1. `rates.roles` 是角色費率還是具名 contributor 費率——目前草案用角色，因為 report 目前沒有穩定的 contributor identity 欄位；若之後需要個人費率，需要先有 contributor 的穩定 ID 來源。
2. 單一 report 是否需要支援多幣別——目前假設一個 report 一種幣別，遇到真實跨幣別需求再擴充 schema。
3. Cost 是否需要與 Time 相同的「每分鐘／`pageshow`／foreground」重算節奏，還是金額類資訊改成明確手動觸發重算更合適——金額比排程日期更敏感，先傾向明確觸發，但需要使用者確認。
4. `fixed_items` 的 `period`（如 `monthly`）如何換算進單一 `as_of` 的預估金額（例如專案剩餘月數 × 月費）——目前只示意欄位存在，換算公式未定。
