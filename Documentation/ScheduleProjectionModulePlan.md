# 排程資料與甘特圖投影計畫

> 狀態：Draft 0.1；方向已定案，尚未實作。
>
> 與其他文件的關係：`report.json` 繼續擁有 task／item identity、狀態與進度；`time.analysis.json` 擁有工程工時、容量與期限風險；`ExtensionModuleArchitecturePlan.md` 擁有 manifest、共同 envelope、trusted registry、Viewer slots、生命週期與隔離契約。本文件只擁有 Schedule 的工作圖、日期限制、資源配置、確定性排程結果及甘特圖投影。實作狀態與排程仍記錄在 `handoff.md`。

## 系統階層與關係

```text
TaskProgress
├─ Core report
│  └─ report.json：task／item identity、狀態、進度
├─ Time module
│  ├─ 工程需求與工作容量
│  └─ time.analysis.json：選用的工時／容量投影
└─ Schedule module（本文件）
   ├─ 私有輸入：schedule.plan.json
   │  ├─ 工作節點與前置依賴
   │  ├─ 日期限制與固定里程碑
   │  └─ 資源、指派與占用規則
   ├─ Analyzer：確定性 forward scheduler
   │  └─ 選用讀取已提交的 Time 投影或 Schedule-local duration
   └─ Viewer 投影：schedule.analysis.json
      ├─ 每個工作的排定開始／結束
      ├─ 衝突、未排程原因與 input revisions
      └─ 里程碑跑道／預估時間線／甘特圖 detail
```

依賴方向為 `Report + Schedule plan + optional committed Time projection → Schedule analysis`。Schedule 是依賴圖末端的組合模組：它可以明示讀取 Time 的已提交投影與 revision，但不修改 Time、report 或其他上游資料；Time 不知道 Schedule 存在。沒有 Time 時，Schedule 仍可使用自己明確提供的 duration，或只顯示固定日期與里程碑。

## 摘要

TaskProgress 現有資料足以排列任務與顯示工時，但不足以產生有排程意義的甘特圖。缺少的是「工作何時可開始、何時必須完成、誰能執行、哪些工作互相等待，以及哪些日期不可移動」。

Schedule 第一版補上這些事實與限制，並由確定性分析器產生每個工作的排定開始／結束時間。Viewer 只消費驗證過的投影，不在瀏覽器臨時猜測排程。甘特圖是 Schedule 投影的一種 detail 呈現，不是新的核心任務模型。

預設首頁仍以里程碑跑道與風險例外為主；完整甘特圖只在使用者需要檢查工作順序、重疊、資源衝突或固定日期時展開。

## 問題與目標

要解決的資料缺口：

1. 每個工作沒有明確的排定開始與結束時間。
2. 無法表達「B 必須等 A 完成」等前置依賴。
3. 無法判斷工作可以平行，還是因業務或資源限制只能依序。
4. 沒有負責人、團隊、設備等資源指派與占用資料。
5. 無法區分可重新排程的日期、不得早於的日期、固定日期與不可移動的里程碑。

設計目標：

- 以 stable task／item ID 建立可驗證的有向工作圖，不以標題或畫面順序猜測。
- 區分人工輸入的限制與分析器產生的開始／結束結果。
- 讓沒有前置關係且資源足夠的工作自然平行；有 dependency 或資源互斥時自然串行。
- 讓工時 demand、每日 capacity 與 calendar 可選擇沿用 Time 投影，但保存明確 input revision。
- 固定日期與固定里程碑發生衝突時產生診斷，不由分析器偷偷移動。
- 缺少估算、資源或日期時允許部分投影，明確標記 `unscheduled`，不補零或虛構日期。
- 讓同一份投影可以支援極簡里程碑跑道、預估時間線及完整甘特圖三種呈現。

明確非目標：

- 不把排程欄位加入 `report.json`，也不改變 task／item status 的語意。
- 不讓 Schedule 自動修改 report 狀態、priority、Time estimate 或交付日。
- 第一版不處理成本最佳化、技能匹配、跨專案資源市場或自動指派人員。
- 第一版不導入 OR-Tools；先以可重現的簡單 forward scheduling 證明資料契約。
- 第一版不建立拖曳甘特條後立即寫檔的互動，也不把圖上的位置當成 canonical 資料。
- 第一版不處理 baseline 對照、實際工時回放、Monte Carlo 模擬或 earned value management。
- 不遞迴排程 Report 指路卡指向的其他 scope；每份 Schedule 只處理自己的 scope。

## 責任邊界

Schedule 擁有：

- 工作節點、dependency graph 與排程限制；
- resource identity、公開 label、capacity reference 與 assignment；
- 固定日期、最早開始日、最晚完成日及固定里程碑；
- 排程政策、確定性排程結果、衝突與未排程診斷；
- Schedule 自己的 projection、freshness 與 Viewer detail。

Schedule 不擁有：

- report 的 task／item title、狀態、進度與 priority；
- Time 的工程估算、capacity profile、事件或 deadline risk；
- 人員身份驗證、HR 工時、私密請假原因或完整個人行事曆；
- Cost、付款、合約及跨 scope portfolio 排程。

Core 只透過 module descriptor、共同 envelope、subject index、slot 與 diagnostics 接入 Schedule，不新增 `schedule` 固定檔名或領域判斷。Schedule Renderer 不能直接呼叫 Time Renderer；Analyzer 若讀取 Time，必須把 Time artifact identity、revision、coverage 與 freshness 寫進自己的 lineage。

## 設計

### 資料層次

Schedule 使用一份人工／外部工具可維護的私有輸入，以及一份可發布的衍生投影：

| Artifact | 角色 | 是否人工維護 | 是否可發布 |
|---|---|---:|---:|
| `report.json` | task／item identity、狀態、進度 | 是 | 可 |
| `time.analysis.json` | 選用的工時、容量與期限投影 | 否 | 依發布政策 |
| `schedule.plan.json` | dependency、日期限制、資源與指派 | 是 | 預設 local／developer |
| `schedule.analysis.json` | 排定日期、衝突、lineage 與甘特圖資料 | 否 | 經裁切後可 |

`schedule.plan.json` 不保存 Renderer 座標、欄寬、色彩或折疊狀態。這些是 Viewer preference，不是排程事實。

### 工作 identity 與粒度

Schedule 以 `work_id` 作為 scope 內穩定 identity，每個工作節點再指向一個 report subject：

```json
{
  "work_id": "work-api-migration",
  "subject": {
    "kind": "task",
    "task_id": "api-migration"
  }
}
```

```json
{
  "work_id": "work-api-contract-tests",
  "subject": {
    "kind": "item",
    "task_id": "api-migration",
    "item_id": "api-contract-tests"
  }
}
```

- task 與 item 使用同一種 work node，不建立兩套排程引擎。
- 同一 report subject 第一版只能由一個 active work node 擁有，避免兩份日期競爭。
- milestone 可以沒有 report subject；它以自己的 milestone identity 存在。
- 找不到 task／item 時產生 orphan diagnostic，不以 title 猜測。
- `archive` subject 預設不進入 active schedule；`done` subject保留結果但不再消耗未來容量。

### 輸入格式

`schedule.plan.json` 的概念形狀：

```json
{
  "schema_version": "0.1",
  "schedule_id": "task-progress-schedule",
  "scope_id": "task-progress",
  "timezone": "Asia/Taipei",
  "planning_started_at": "2026-09-01T09:00:00+08:00",
  "policy": {
    "algorithm": "deterministic-forward",
    "version": "0.1"
  },
  "resources": [
    {
      "id": "team-viewer",
      "kind": "team",
      "public_label": "Viewer",
      "capacity_source": {
        "kind": "time_projection",
        "resource_id": "executor-default"
      }
    },
    {
      "id": "qa-device",
      "kind": "equipment",
      "public_label": "測試裝置",
      "capacity_source": {
        "kind": "schedule_local",
        "minutes_per_workday": 480
      }
    }
  ],
  "works": [
    {
      "work_id": "work-api-migration",
      "kind": "work",
      "subject": {
        "kind": "task",
        "task_id": "api-migration"
      },
      "duration_source": {
        "kind": "time_projection",
        "task_id": "api-migration"
      },
      "dependencies": [],
      "constraints": [
        {
          "kind": "start_no_earlier_than",
          "at": "2026-09-03T09:00:00+08:00"
        }
      ],
      "assignments": [
        {
          "resource_id": "team-viewer",
          "allocation_percent": 100,
          "exclusive": true
        }
      ]
    },
    {
      "work_id": "work-integration-test",
      "kind": "work",
      "subject": {
        "kind": "item",
        "task_id": "integration",
        "item_id": "integration-test"
      },
      "duration_source": {
        "kind": "schedule_local",
        "likely_minutes": 960,
        "confidence": "medium"
      },
      "dependencies": [
        {
          "predecessor_work_id": "work-api-migration",
          "type": "finish_to_start",
          "lag_minutes": 0
        }
      ],
      "constraints": [],
      "assignments": [
        {
          "resource_id": "qa-device",
          "allocation_percent": 100,
          "exclusive": true
        }
      ]
    },
    {
      "work_id": "milestone-release",
      "kind": "milestone",
      "label": "正式發布",
      "fixed_at": "2026-09-20T10:00:00+08:00",
      "movable": false,
      "dependencies": [
        {
          "predecessor_work_id": "work-integration-test",
          "type": "finish_to_start",
          "lag_minutes": 0
        }
      ]
    }
  ]
}
```

此範例固定的是資料語意，不是最終 JSON Schema；實作前仍需以 `$defs`、`oneOf`、`additionalProperties: false`、數量上限及字串長度完成 Draft Schema。

### 日期語意

輸入日期與輸出日期必須分開：

| 日期 | 所屬 | 語意 |
|---|---|---|
| `planning_started_at` | Schedule input | 此輪排程可以使用容量的起點 |
| `start_no_earlier_than` | Work constraint | 可以更晚開始，不得更早 |
| `start_fixed` | Work constraint | 必須在指定時間開始 |
| `finish_no_later_than` | Work constraint | 可更早完成，不得更晚 |
| `finish_fixed` | Work constraint | 必須在指定時間完成 |
| `fixed_at` | Milestone input | 不可移動且 duration 為零的事件 |
| `scheduled_start_at` | Analysis output | 分析器依目前輸入排出的開始時間 |
| `scheduled_finish_at` | Analysis output | 分析器依目前輸入排出的完成時間 |

所有 timestamp 必須含 UTC offset；`timezone` 用來建立工作日與呈現，不用來猜測缺少 offset 的時間。

一般工作不要求人工同時填開始與結束。人工只提供真正固定的事實與限制；分析器產生 `scheduled_start_at`／`scheduled_finish_at`。若把分析結果再次寫回輸入，延誤後就會出現兩份互相競爭的 canonical 日期。

### 前置依賴

Draft 0.1 只接受 `finish_to_start`：前置工作完成後，後續工作才可開始。

```text
A.finish + lag <= B.start
```

- `predecessor_work_id` 必須指向同 scope 內存在的 work 或 milestone。
- `lag_minutes` 第一版接受零或正整數，用來表達等待、交接或冷卻時間。
- dependency graph 必須無循環；cycle 使受影響工作全部 `unscheduled`，並列出完整 cycle path。
- 不以 works array 順序形成隱藏依賴。沒有 edge 就代表業務上可同時候選。
- `start_to_start`、`finish_to_finish` 與負 lag 等出現真實需求後再升級契約，不在 0.1 預留含糊行為。

### 平行與串行

平行性不是單一 `parallel: true` 欄位，而是兩組規則的結果：

1. **業務順序**：dependency edge 決定哪些工作必須等待。
2. **資源可用性**：assignment、allocation 與 exclusive 決定候選工作能否同時占用資源。

沒有 dependency 且使用不同資源的工作可以平行。同一個 `exclusive: true` 資源在同一分鐘只能分配給一個工作，因此會自然串行。非 exclusive assignment 可以依 `allocation_percent` 分享容量，但同一資源同一時段的總 allocation 不得超過 100%；超過時產生 `resource_overallocated`，不偷偷縮放每個工作。

### 資源與占用

Resource 第一版支援：

- `person`：單一執行者的抽象 identity；
- `team`：以團隊容量排程，不展開成個人名單；
- `equipment`：測試裝置、場地、授權席次等不可同時重複使用的資源。

Resource `id` 是排程 identity，不是登入帳號。公開 projection 只保留核准的 `public_label`，不得包含私人姓名、個人每日行程、請假原因或 HR 資料。

Capacity 有兩種來源：

- `time_projection`：讀取已提交的 Time capacity timeline，並保存 artifact revision；
- `schedule_local`：Schedule 自己保存簡單工作日容量，適合設備或沒有 Time 的 scope。

同一份容量不能同時由兩個來源加總。Time 的 sleep／life／exception 已經反映在 capacity timeline，Schedule 不得再次扣除。

### 工時與日曆時間

Schedule 使用 duration demand，但不擁有 Time estimate：

- `time_projection` 讀取 Time 的 task／item `likely_minutes`；
- `schedule_local` 只在 scope 沒有適用 Time estimate 時提供明確的 `likely_minutes` 與 confidence；
- 未設定 duration 時，工作為 `unscheduled`，不套用領域預設工時；
- effort minutes 不能直接當成日曆分鐘。排定完成時間必須沿資源 capacity timeline 累積可用分鐘；
- allocation 低於 100% 時，該工作每個工作日可取得的容量按比例降低，而不是修改原始 demand。

### 固定日期與里程碑

- `start_fixed`、`finish_fixed` 與 milestone `fixed_at` 都是 hard constraint。
- `finish_no_later_than` 是期限限制，不代表分析器可以縮短 duration。
- 固定里程碑永遠是零 duration、`movable: false`；若 dependency 或容量推算無法在它之前完成，里程碑保持原位並產生 `fixed_milestone_missed`。
- Time `delivery_at` 可由 Analyzer 明示投影成 project delivery milestone，但 Schedule input 不複製一份相同日期；lineage 必須指出其來源。
- 第一版沒有 soft milestone。提醒日或期待日期若可移動，使用一般 work constraint 或 Viewer annotation，不能冒充 hard fact。

### 確定性排程算法

第一版採 deterministic forward scheduling：

1. 以 stable `work_id` 驗證並建立 dependency graph。
2. 拓撲排序；同一層以 report priority，再以 report 原始順序，最後以 `work_id` 作穩定 tie-breaker。
3. 每個工作的 earliest candidate 是 `planning_started_at`、所有 predecessor finish + lag 及 `start_no_earlier_than` 的最大值。
4. 依 assignments 找出所有資源同時可用的最早 capacity slots，累積至滿足 duration demand。
5. 套用 fixed／no-later-than constraints；hard constraint 不可滿足時保留輸入並產生 conflict。
6. 完成全部可排工作後產生 projection、resource utilization、milestone state 與 diagnostics。

對相同 report bytes、Schedule input、Time input revisions 與 `as_of`，結果必須 byte-level 可重現；算法不呼叫 AI。AI 或 Agent 可以建議 dependency、duration 或 assignment，但只能產生待驗證的輸入草稿，不能直接取代確定性算法。

第一版只求可解釋與可重現，不宣稱產生全域最佳排程。當實際案例證明 greedy scheduling 無法處理多人、技能、複雜資源競爭或最佳化目標時，再評估 OR-Tools；不能因為要畫甘特圖就先加入 solver dependency。

### Viewer 投影

`schedule.analysis.json` 使用 Extension Module common envelope，`module_type` 為 `taskprogress.schedule`。概念 `data`：

```json
{
  "input_lineage": {
    "schedule_plan_revision": "sha256:...",
    "time_module_revision": "sha256:...",
    "time_coverage": "partial"
  },
  "summary": {
    "scheduled_work_count": 7,
    "unscheduled_work_count": 2,
    "conflict_count": 1,
    "forecast_finish_at": "2026-09-24T17:00:00+08:00"
  },
  "works": [
    {
      "work_id": "work-api-migration",
      "subject": {
        "kind": "task",
        "task_id": "api-migration"
      },
      "state": "scheduled",
      "scheduled_start_at": "2026-09-03T09:00:00+08:00",
      "scheduled_finish_at": "2026-09-08T17:00:00+08:00",
      "duration_minutes": 2400,
      "confidence": "medium",
      "resource_ids": ["team-viewer"]
    }
  ],
  "milestones": [
    {
      "work_id": "milestone-release",
      "fixed_at": "2026-09-20T10:00:00+08:00",
      "state": "at_risk"
    }
  ],
  "diagnostics": []
}
```

共同 envelope 另保存 `report_revision`、`generated_at` 與 generator version。Schedule data 必須保存每個實際讀取的 Time／Schedule input revision；任何上游 revision 改變即 stale，Viewer 不得繼續顯示舊日期像仍然有效。

Projection 的 `state` 至少包含：

- `scheduled`：有完整開始／結束且沒有 hard conflict；
- `fixed`：日期由 hard constraint 決定；
- `completed`：report 已完成，結果保留但不占未來容量；
- `unscheduled`：缺少 duration、resource、capacity 或 predecessor result；
- `conflict`：資料完整但 hard constraints 互相矛盾。

### 顯示模式

同一份投影提供三層呈現，不建立三種資料格式：

1. **里程碑跑道**：預設摘要，只顯示今天、預估完成區間、固定交付點與風險數量。
2. **預估時間線**：以 task 為列，顯示排定區間、信心、未排程與資源衝突。
3. **甘特圖 detail**：展開 task／item、dependency connector、資源占用及固定 milestone。

沒有 Schedule 模組時完全不顯示空殼或甘特圖入口。只有固定 milestone、沒有完整排程時仍可顯示里程碑跑道；只有 Time、沒有 Schedule plan 時繼續使用既有工時／期限摘要，不假裝已有 task-level 排程。

### 診斷與降級

最低診斷碼：

- `schedule_cycle`
- `orphan_subject`
- `missing_duration`
- `missing_resource`
- `missing_capacity`
- `resource_overallocated`
- `constraint_conflict`
- `fixed_milestone_missed`
- `upstream_time_stale`
- `schedule_projection_stale`

一個工作無法排程不應丟棄其他有效工作。Summary 必須分開計數 scheduled／unscheduled／conflict，不能把部分排程宣稱為完整甘特圖。

公開 Viewer 只顯示安全、可行動的短句，例如「2 項尚未排程」；localhost／Developer detail 才顯示 work ID、constraint、resource 與裁切後的原因。診斷不得包含本機路徑、私人行事曆或未核准的 resource label。

### 驗證規則

Schema 與純模型至少驗證：

- `schedule_id`／`scope_id`／module envelope identity 一致；
- `work_id`、resource ID 唯一且符合長度／字元限制；
- task／item subject 可解析且沒有重複 active owner；
- dependency 與 assignment reference 存在；
- dependency graph 無 cycle；
- timestamp 含 offset，constraint 的時間順序有效；
- work duration 為正整數分鐘，milestone duration 為零；
- allocation 為 1–100，同資源同時段不超過 100%；
- fixed start／finish、duration、dependency 與 milestone 之間不矛盾；
- Time capacity 與 duration 只讀一次，不重複扣除或加總；
- report、Schedule plan、Time revisions 相符；
- output 的每個 scheduled work 都可由同一組輸入重算。

## 案例

### A 完成後才能做 B，C 可以平行

```text
A ───────┐
         └─ B ─────
C ────────────────
```

A → B 有 `finish_to_start` edge；C 沒有 edge 且使用不同資源，因此可以與 A／B 平行。Works array 的前後順序不改變這個結果。

### 沒有 dependency，但共用不可重複資源

```text
裝置 QA 1 ─────
裝置 QA 2      ─────
```

兩項工作都指派 `qa-device` 且 `exclusive: true`。即使沒有 dependency，也會因資源互斥而串行；這是資源限制，不應偽造 A → B 的業務依賴。

### 固定發布日無法達成

```text
推算完成：9/24
固定發布：9/20
```

milestone 保持在 9/20，工作仍顯示推算至 9/24；系統產生 `fixed_milestone_missed`。不得把 milestone 移到 9/24，也不得把工作條壓縮到 9/20。

### 缺少估算

一個 work 有 subject、dependency 與 resource，但沒有可用 duration。該 work 顯示 `unscheduled / missing_duration`，依賴它的後續 work 也無法取得開始時間。其他不相依的工作仍正常排程。

### 只有月曆戳

scope 只提供三個固定 milestone，沒有 duration、dependency 或 resource。Viewer 顯示簡潔里程碑跑道，不產生空白甘特條，也不要求使用者先建立完整排程。

## 決策理由與替代方案

- **選擇獨立 Schedule 模組。** 排程包含 dependency、resource、calendar 與 constraint，若加入 `report.json` 會讓所有 scope 被迫承擔複雜欄位，並讓核心進度模型與排程模型互相綁死。
- **分開 input 與 projection。** 人工擁有事實與限制，分析器擁有可重算結果；把 scheduled dates 寫回輸入會形成第二份過期事實。
- **Schedule 可以明示讀取 Time，但位於依賴圖末端。** Duration／capacity 應只有一個 owner；Schedule 保存 upstream revisions 並可獨立 stale，不把結果回灌 Time。
- **不用單一 parallel flag。** 平行與串行是 dependency graph 及 resource availability 的共同結果，布林值無法解釋原因，也容易與實際排程矛盾。
- **固定日期用 hard constraint。** 分析器遇到不可行排程時回報衝突，不能為了讓圖看起來整齊而改動承諾。
- **第一版不用最佳化 solver。** 確定性 forward scheduler 足以驗證 identity、依賴、容量、日期與降級；OR-Tools 只有在真實案例需要複雜最佳化時才值得加入。
- **甘特圖是 detail，不是首頁。** 首頁回答進度、預估與風險；完整圖只在依賴與資源關係值得檢查時使用。

## 驗收與遷移

### 規模

```text
Execution size       : large
Architectural impact : system-level
Evidence             : 新增 serialized input／projection、dependency graph、resource ownership、Analyzer、trusted module、Viewer detail 與 stale lineage
Precedent             : manifest／common envelope／Time input-projection 分層已存在；Schedule graph 與 resource scheduler 是新模式
Proof                 : JSON Schema fixtures、cycle／constraint／resource 純模型測試、固定 as_of 重現、Launcher integration、localhost／Pages Viewer、390px／鍵盤／螢幕閱讀器人工驗證
```

### 分階段計畫

#### Phase 0：契約與案例

- 完成本文件、Draft Schema 欄位表與最小 fixtures。
- 以「A → B、C 平行」、「資源互斥」、「固定 milestone miss」、「缺少 duration」四個案例反證契約。
- 確認 Schedule 作為末端組合模組，不修改 Report／Time owners。

完成條件：不寫 production code，也能用資料明確回答五項缺口，且同一輸入只有一種排程語意。

#### Phase 1：Schema 與純模型

- 建立 `schedule.plan.schema.json` 與 `schedule.analysis.schema.json`。
- 建立 identity、reference、cycle、constraint、allocation、revision 驗證。
- 建立無 DOM、無服務、無檔案 mutation 的 deterministic scheduler。
- 固定 `as_of` 驗證重現性與 partial scheduling。

完成條件：所有結果可由 fixtures 重算；缺少資料只產生明確 `unscheduled`／diagnostic，不產生假日期。

#### Phase 2：Analysis module 與 Host

- 透過既有 `IAnalysisModule`／provider 邊界發現 Schedule inputs、驗證並產生投影。
- 以 common envelope 保存 report、Schedule plan、Time input revisions。
- 驗證多 scope、route 安全、stale route 清理、Time 缺少／無效／過期及原子輸出。

完成條件：`analyze`／`open`／`start` 可以選用產生 Schedule projection，但沒有 Schedule input 的 scope 完全不變。

#### Phase 3：Viewer 呈現

- 註冊 `taskprogress.schedule` trusted module。
- 先做里程碑跑道，再做 task-level 預估時間線，最後才做可展開的甘特圖 detail。
- 驗證 partial／stale／conflict／unknown version 隔離，以及與 Time 並存但 Renderer 互不呼叫。

完成條件：首頁保持極簡；完整甘特圖只在有足夠排程資料時出現；Schedule 失敗不影響基本 report 與 Time。

#### Phase 4：編輯與進階排程評估

- 只有前三階段證明讀取與排程語意後，才設計 dependency、constraint、resource 的安全編輯 UX。
- 只有真實專案證明 deterministic forward scheduling 不足，才評估 OR-Tools、多人技能、最佳化目標及 baseline。
- 任何編輯仍需 scope-limited capability、revision、原子保存、undo／discard 與 stale 重算。

完成條件：另立核准計畫；本 Draft 不授權此階段實作。

### 驗收清單

1. 只有 `report.json` 時，Viewer 與 Launcher 行為完全不變。
2. `schedule.plan.json` 可用 stable ID 表達 task、item、dependency、resource、constraint 與 milestone。
3. 每個可排 work 都產生含 offset 的 `scheduled_start_at`／`scheduled_finish_at`；不可排者有明確原因。
4. A → B、獨立 C、共享 exclusive resource 三種關係得到可解釋且可重現的不同結果。
5. Cycle、orphan、缺 duration、缺 capacity、allocation 超額與 hard constraint 衝突都有獨立診斷。
6. 固定 milestone 發生延遲時保持原日期，工作仍保留真實推算結果。
7. Schedule 使用 Time 時保存其 revision、coverage 與 freshness；Time 更新後舊 Schedule projection 進入 stale。
8. 沒有 Time 時，Schedule-local duration／capacity 仍可運作；兩者皆無時只顯示固定 milestone 或 `unscheduled`。
9. 公開投影不包含私人姓名、行事曆、請假原因、本機路徑或未裁切診斷。
10. 一個 work 或整個 Schedule 模組失敗，不影響 report、Time 或其他模組。
11. 里程碑跑道、預估時間線與甘特圖 detail 共用同一 projection，不重複排程公式。
12. 由未參與實作者逐項判定 met／unmet；不以只跑完整測試取代架構驗收。

## 尚未決定

無。多人技能匹配、其他 dependency type、soft milestone、baseline、實際工時回放與最佳化 solver 都是明確延後的獨立需求，不阻塞 Draft 0.1。
