# Report CLI 修改

使用含 `report` 命令的 TaskProgress CLI，搭配專案 `service/`、`schemas/` 及已安裝 jsonschema 的 Python。需要指定 Python 時設定 `TASK_PROGRESS_PYTHON`；指定專案位置時設定 `TASK_PROGRESS_VIEWER_ROOT` 為本專案的 `viewer` 目錄。命令不啟動本機服務。

## 讀取與驗證

```powershell
task-progress.exe report get "C:\Project" --task feature-a
task-progress.exe report validate "C:\Project"
task-progress.exe report get --scope project
```

`get` 回傳 `revision`，局部讀取仍使用整組來源的 revision。`developer` 是對應 overlay，缺少時為 null。

## 更新卡片及子項

先讀取 → 將實際 revision 填入 `changes.json` → 預覽 → 提交：

```json
{
  "version": "1",
  "expected_revision": "填入 get 回傳的 revision",
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

## stdin 與結果

```powershell
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
Get-Content -Raw -Encoding UTF8 changes.json | task-progress.exe report apply "C:\Project" --input -
```

stdout 固定為單一 JSON；exit code：0 成功、2 輸入／驗證錯誤、3 revision 衝突、4 執行／保存／分析／回復失敗。錯誤中的 operation_index 從 0 起算。

dry-run 不寫入來源或分析；它只顯示預期異動及是否會分析。待回復交易會回 recovery_required，正式 apply 才在鎖內回復並重新核對 revision。

完整操作與交易邊界見 [Report CLI 計畫](ReportCliUpdatePlan.md#第一版補充契約)。
