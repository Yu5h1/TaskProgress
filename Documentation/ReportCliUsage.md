# Report CLI 修改

使用含 `report` 命令的 TaskProgress CLI，搭配專案 `service/`、`schemas/` 及已安裝 jsonschema 的 Python。需要指定 Python 時設定 `TASK_PROGRESS_PYTHON`；指定專案位置時設定 `TASK_PROGRESS_VIEWER_ROOT` 為本專案的 `viewer` 目錄。命令不啟動本機服務。

## 讀取與驗證

```powershell
task-progress.exe report get "C:\Project" --task feature-a
task-progress.exe report validate "C:\Project"
task-progress.exe report get --scope project
```

`get` 回傳 `revision`，局部讀取仍使用整組來源的 revision。每個物件子項另附 `derived_state`；根層另附 `next_effective`（`task_id`、`item_id`）：存著的 Next 仍有效時就是它，失效或清除時為 null，與 Viewer 顯示的 Next 相同。`developer` 是對應 overlay，缺少時為 null。

## 更新卡片及子項

先讀取 → 將實際 revision 填入 `changes.json` → 預覽 → 提交：

```json
{
  "version": "1",
  "expected_revision": "填入 get 回傳的 revision",
  "actor": "codex",
  "session": "選填：session 名稱（工具畫面上的標題）",
  "session_id": "選填：session ID",
  "operations": [
    {
      "op": "task.update",
      "task_id": "feature-a",
      "set": { "summary": "已完成主要實作", "status": "in_progress" }
    },
    {
      "op": "item.update",
      "task_id": "feature-a",
      "item_id": "implementation",
      "set": { "status": "done" }
    },
    {
      "op": "dev.update",
      "task_id": "feature-a",
      "set": { "next_step": "集中驗收" },
      "unset": ["blockers"]
    }
  ]
}
```

```powershell
task-progress.exe report apply "C:\Project" --input changes.json --dry-run
task-progress.exe report apply "C:\Project" --input changes.json
```

卡片可用 `task.update` 綁定或解除自己的經驗紀錄（檔案須已存在於 `experience/<stem>.md`，scope 須為卡片所在的 scope；欄位見 [Report 技能〈Keep a card's experience record〉](../.agents/skills/task-progress-report/SKILL.md#keep-a-cards-experience-record)）：

```json
{ "op": "task.update", "task_id": "feature-a",
  "set": { "document_ref": { "kind": "experience", "scope_id": "<scope>", "task": "feature-a" } } }
```

使用者確認退場的子項，以 `obsolete`（附取代者：子項，或 scope 內的設計文件 `{"document": "路徑#段落"}`）或 `discontinued`（附理由）寫入；規則見 [Report 技能〈Maintain child items〉](../.agents/skills/task-progress-report/SKILL.md#maintain-child-items)：

```json
{ "op": "item.update", "task_id": "feature-a", "item_id": "old-step",
  "set": { "status": "obsolete", "retirement": { "replaced_by": { "scope_id": "<scope>", "task_id": "feature-a", "item_id": "new-step" } } } }
```

子項的 `waits_for` 可在等待子項的項目加 `"strict": true`，表示要等到使用者人工驗收也完成；其他值一律拒絕。等待規則見 [Report 技能〈Maintain child items〉](../.agents/skills/task-progress-report/SKILL.md#maintain-child-items)。

確認：`ok` 為 true；`changed` 表示是否實際修改。重複設定相同內容為 no-op。來源已改變時會回 revision_conflict，重新讀取並核對後再產生請求。

## 新增卡片或子項

在 operations 中使用：

```json
[
  {
    "op": "task.add",
    "value": { "id": "feature-b", "title": "新功能", "status": "planned", "summary": "待實作" }
  },
  {
    "op": "item.add",
    "task_id": "feature-b",
    "value": { "id": "implementation", "title": "完成實作" }
  }
]
```

後面的操作可引用同批新增的 ID。舊字串子項必須先另行遷移為具 ID 物件，不能用顯示文字或陣列位置定位。第一版不提供刪除、改名 ID 或修改指路卡。

## 子項目位置與狀態

未完成子項目顯示時先依 priority，再依陣列順序；全部未指定（缺省或 4）時就是陣列順序。位置操作不改 priority，也不保證不同優先級的項目在畫面相鄰。

`item.add` 可帶 position，`item.move` 必須帶 position；before／after 二選一，以同一任務 pending_items 內既有穩定 ID 為參照。以下操作放入同一份 apply 請求，仍依前述 get → dry-run → apply 流程提交：

```json
[
  {
    "op": "item.add",
    "task_id": "feature-b",
    "value": { "id": "design", "title": "確認設計", "status": "planned" },
    "position": { "before": "implementation" }
  },
  {
    "op": "item.move",
    "task_id": "feature-b",
    "item_id": "implementation",
    "position": { "after": "design" }
  },
  {
    "op": "item.update",
    "task_id": "feature-b",
    "item_id": "design",
    "set": { "status": "in_progress" }
  }
]
```

省略 position 的新增操作：非 done 加在 pending_items 尾端；done 加在 completed_items 頂端。`item.update` 改成 done 時自動轉入完成清單頂端，恢復為其他狀態時轉入待處理清單尾端，可再以 item.move 排位。重複 done 不移位，重複相同位置為 no-op。

不接受已完成項目移位、done 新增時指定 position、自身或跨任務參照、不存在的 ID、標題與數字索引。位置錯誤拒絕整批保存。move 不變更其他欄位；結果 changes 的 item_id 定位子項目，fields 中的 position 表示位置操作，不含參照值。

位置操作由專案的 `service/report_operations.py` 提供；CLI `--help` 列出 item.move／position 的版本包含相應說明。部署須配套同版 service 與 schemas；可用 `python service/report_cli.py --help` 確認實際後端入口，並用 dry-run 驗證請求。舊後端不支援時先更新，不以手改 JSON 繞過。

## Next 標記

每個 scope 一個 `next`，指向一個未完成的子項（設計：[NextMarkerPlan](NextMarkerPlan.md)）。設新的就取代舊的；指向不存在、已完成或舊字串子項時拒絕。設定時在該子項記一筆 `updated`。清除不帶 `task_id`。

```json
[
  { "op": "next.set", "task_id": "feature-b", "item_id": "implementation" },
  { "op": "next.clear" }
]
```

子項完成、等待中或執行中時，`next` 仍留在檔案裡但失效，Viewer 不顯示也不自行補位。要依規則補位時用 `report next`：

```powershell
task-progress.exe report next "C:\Project" --actor codex [--task feature-b] [--session <名稱>] [--session-id <id>] [--dry-run]
```

它讀取目前 revision，依 NextMarkerPlan 第 3 點的規則挑出第一個未完成、不在等待、沒人在做的子項（`--task` 只在該卡內挑），再以一般 apply 路徑寫入 `next.set`，所以 revision 檢查與子項活動紀錄照常。Next 仍有效或只是執行中時拒絕改寫；沒有可挑的子項時回錯誤。

## 身分與認領

每個 apply 請求都要帶 `actor`（寫入的工具，小寫英文，例如 `claude`、`codex`、`antigravity`）；`session`（session 名稱，顯示用）與 `session_id`（session ID，認領比對用）知道就填。CLI 依此在子項的 `activity` 自動記錄建立、開始、修改、完成與接手，不能在新增的值裡自帶 `activity`。

子項為 `in_progress` 且最後一筆 `started`／`takeover` 不是自己時，`item.update`／`item.move` 會被拒絕（exit code 2）：

- `claim_conflict`：別的工具或別的 session 正在執行。先問使用者，同意後在該操作加 `"claim": "takeover"`。
- `claim_unverified`：同一工具但缺少 `session_id` 無法比對（名稱不算）。確定是自己開始的就加 `"claim": "own"`，否則先問使用者再用 `takeover`。

```json
{ "op": "item.update", "task_id": "feature-a", "item_id": "implementation", "set": { "status": "done" }, "claim": "own" }
```

`item.event` 的 `released` 也照同樣判定，只能釋放自己的認領；`claim` 只接受 `own` 或 `recover`。認領者的 session 已結束、工作已提交只差釋放時，先問使用者，同意後加 `"claim": "recover"` 代為釋放。代為釋放不記 `takeover`，釋放的 session 不會因此成為執行者。`disputed` 不帶 `claim`。

判定與保留規則見 [子項活動紀錄](ItemActivityLog.md)。

## stdin 與結果

```powershell
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
Get-Content -Raw -Encoding UTF8 changes.json | task-progress.exe report apply "C:\Project" --input -
```

stdout 固定為單一 JSON；exit code：0 成功、2 輸入／驗證錯誤、3 revision 衝突、4 執行／保存／分析／回復失敗。錯誤中的 operation_index 從 0 起算。

dry-run 不寫入來源或分析；它只顯示預期異動及是否會分析。待回復交易會回 recovery_required，正式 apply 才在鎖內回復並重新核對 revision。

完整操作與交易邊界見 [Report CLI 計畫](ReportCliUpdatePlan.md#第一版補充契約)。
