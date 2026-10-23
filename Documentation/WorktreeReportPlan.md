# Report 讀取 worktree

> Task ID: worktree-report
>
> 狀態：討論中。目標與已知問題由使用者提出（2026-10-23）；設計與可行性評估是待決草稿，決定前不實作。
>
> 與其他文件的關係：綁定現況見 [DocumentBindingPlan](DocumentBindingPlan.md)；認領、釋放與他驗規則見 [AcceptanceChainPlan](AcceptanceChainPlan.md)；Next 見 [NextMarkerPlan](NextMarkerPlan.md)。

## 系統階層與關係

```text
TaskProgress
└─ Report（一個已註冊 scope）
   ├─ main line：report.json、checklists/、decisions/（現在唯一的來源）
   ├─ worktree 掃描：git 記錄的同一 repo 其他工作目錄 ← 本計畫新增
   │  └─ 依命名辨識的 checklist／decision → 顯示為該卡片的項目（唯讀）
   ├─ 認領：同一項目同時只有一個 agent
   └─ 依賴：waits_for（已存在）＋ worktree 項目自己宣告的等待
        ↑
   服務（127.0.0.1:8001，所有 worktree 與 main line 唯一共用的程序）
```

服務是掃描與認領的擁有者：每個 worktree 都是獨立資料夾，只有服務能同時看到全部。Viewer 與 `report get` 只讀服務整理後的結果。

## 問題與目標

**問題。** 多個 agent 在同一個 repo 工作時會互相衝突。改用 worktree 能分開工作目錄，但 Report 只讀 main line 的資料夾，worktree 裡的工作看不到、無法追蹤；而要讓它被看到，就得寫 main line 的 `report.json`，多個 agent 同時寫同一份檔案又會衝突。

**目標。**

1. Report 能讀取 worktree 的工作狀態，讓 agent 在 worktree 工作時，使用者仍能在 Report 上追蹤。
2. Report 能表達項目之間的依賴關係，包括 worktree 裡的項目。
3. 以上不需要 worktree 裡的 agent 寫 main line 的 `report.json`，使同一 repo 能同時有多個 agent 工作。

**明確非目標。** 不支援另外 clone 的資料夾或其他電腦上的工作；不讓使用者在 Viewer 裡直接修改 worktree 裡的程式。

## 已知問題

由使用者提出：

1. **認領。** 同一個項目不得有多個 agent 處理；項目所依賴的其他項目，也不得被別的 agent 同時處理。

討論中發現：

2. **worktree 裡的文件寫入。** 使用者在 Viewer 勾選 checklist、回答 decision，現在寫入 main line 的檔案。worktree 裡的檔案若可寫，可能和該 worktree 的 agent 同時修改同一份檔案；若唯讀，使用者在工作途中就無法回答決策題。
3. **他驗與釋放依賴 report.json。** 「誰建立、誰執行、誰不能驗收」與「釋放之前的結果失效」都讀 `report.json` 子項的活動紀錄（CLI `ChecklistBinding`、`ItemStateResolver`；Viewer `document-binding.js`）。worktree 的 agent 不寫 report.json，這些紀錄就沒有地方寫。
4. **同一份文件有兩個版本。** worktree 從 main line 分出時帶著舊檔；worktree 推進後，main 與 worktree 各有一份同名檔案，Report 要決定顯示哪一份。
5. **由檔名推導項目。** 卡片改 ID 時檔名要跟著改；命名不能用 PowerShell 會當萬用字元的 `[` `]`。
6. **合併時的轉換。** worktree 的項目合併回 main 後，要成為正式項目，ID 不能改變，Next、`waits_for` 才不會斷。
7. **殘留的 worktree。** 被丟著不管的 worktree 會一直顯示為「有人在做」。
8. **掃描成本與範圍。** 每次重新整理都執行 git 會拖慢 Viewer；非 git 的 scope、已刪除資料夾的 worktree（git 標為 prunable）要略過。

## 設計（草稿）

以下皆為候選做法，對應的選擇列在〈尚未決定〉。

- **找到 worktree。** 服務對每個已註冊 scope 執行 `git worktree list --porcelain`，用 scope 相對 repo 根目錄的路徑換算出每個 worktree 裡的同一個 scope。只在 `.git/worktrees/` 或 worktree 的 `checklists/`、`decisions/` 有變動時重新掃描。
- **辨識參與的 worktree。** 不需要登記：worktree 的 `checklists/`、`decisions/` 裡有 `<卡片ID>--<名稱>.checklist`／`.decisions` 命名的檔案，就是在處理那張卡；沒有就是一般 worktree（例如只用來 build），不顯示。
- **認領。** 一個 worktree 裡有某項目的檔案，就代表這個 worktree 認領了它；worktree 移除或合併，認領自動消失。兩個 worktree 出現同一項目的檔案時，Report 標示衝突。agent 開工前以 `report get` 查詢，結果要包含 worktree 的認領。
- **依賴。** 既有的 `waits_for` 已能指向任何 scope 的子項與 checklist 工作項目。worktree 裡的新項目沒有 report.json 可寫，改在 checklist 檔頭宣告等待（例如 `Waits for: <scope> › <卡片> › <項目>`），由服務一併推算「等待中」。
- **認領涵蓋依賴。** 已被認領項目所等待的項目，不再交給其他 agent 處理；`run` 的佇列與 Report 都要顯示這層關係。
- **他驗與釋放。** worktree 階段只做執行；合併回 main line 時，由合併的人（驗收者）在 report.json 一次寫入建立、執行與釋放紀錄，之後才進入他驗。

## 可行性評估

**能做到，技術上沒有阻礙；成本集中在認領與他驗那一層。**

| 部分 | 現況（量測） | 評估 |
|---|---|---|
| 找到 worktree | 服務已在多處以 `subprocess` 呼叫外部程式；git 在本機可用 | 低成本。要處理非 git scope、prunable、快取 |
| 讀取 worktree 文件 | checklist 路由固定讀 `<report 資料夾>/checklists/<stem>.checklist`（`taskprogress_host.py`，1,948 行），decision 路由同樣 | 中等。路由要能指定 worktree，且只接受 git 列出的路徑，安全邊界要重新檢查 |
| 顯示 worktree 項目 | Viewer 綁定與推算在 `document-binding.js`（527 行）、`item-state.js`（104 行） | 中等。項目要分「report.json 裡的」與「由檔案推導的」兩種來源，CLI `report get` 要同樣推導 |
| 依賴 | `waits_for` 已支援跨 scope 子項與 checklist 工作項目，CLI 與 Viewer 同一規則 | 低到中。只需加入檔頭宣告的來源 |
| 認領 | 認領記在 report.json 子項活動，CLI `check_claim` 擋衝突（`report_operations.py`） | 中等。worktree 認領是新來源，兩種要合併判斷 |
| 他驗與釋放 | 驗收資格與結果失效都讀 report.json 活動（`ChecklistBinding.cs` 94 行、`ItemState.cs` 210 行） | **最高**。改動 AcceptanceChainPlan 的核心規則；建議以「合併時才寫入」避開，不改他驗本身 |

規模（依 agent-work-route〈Size the work in the spec〉）：

```
Volume:    觸及服務、CLI、Viewer 約 6 個檔案、約 3,300 行的既有程式；新增掃描與推導約數百行
Precedent: worktree 掃描與檔名推導是新做法；waits_for、綁定推算有既有實作可沿用
Proof:     單元測試可涵蓋推導與認領；worktree 顯示需要瀏覽器實測
```

**建議分三階段**，每一階段都能單獨交付：

1. **只讀顯示。** 服務掃描 worktree，Report 把 worktree 裡、已綁定在既有項目上的 checklist 進度顯示出來（唯讀，標示分支）。不改認領、不推導新項目。
2. **認領與依賴。** worktree 即認領、衝突標示、檔頭宣告的等待；`report get` 與佇列一併採用。
3. **由檔名推導項目。** worktree 不必寫 report.json 就能新增項目；合併時轉為正式項目。

## 尚未決定

1. **worktree 文件能不能從 Viewer 寫入。** 全部唯讀／只允許回答 decision／checklist 與 decision 都可寫。建議：只允許回答 decision，因為決策常在工作途中需要；checklist 勾選等合併後。
2. **項目來源。** 由檔名推導（`<卡片ID>--<名稱>`）／由檔頭宣告（例如 `Report: <卡片ID>`）。建議：檔頭宣告，卡片改 ID 時不必改檔名；命名只作為快速篩選。
3. **認領的位置。** worktree 存在即認領／另由服務維護一份有期限、需續約的登記。建議：worktree 存在即認領，不會留下過期登記；殘留的 worktree 在 Report 上可見，由使用者清除。
4. **同名文件兩個版本時顯示哪一份。** 一律顯示 worktree 版並標示分支／main 與 worktree 並列。建議：內容相同只算 main；不同時顯示 worktree 版並標示分支。
5. **他驗紀錄何時寫入。** 合併時由驗收者寫入 report.json／把活動紀錄搬進 checklist 檔案。建議：合併時寫入，不改他驗規則。
6. **是否照三階段進行。** 建議先做第 1 階段，用實際的 worktree 工作驗證後再決定第 2、3 階段。
