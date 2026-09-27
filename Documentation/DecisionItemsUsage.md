# 決策項目使用方式

具名 `<名稱>.decisions` 使用 UTF-8 JSON，格式見 [實作計畫](DecisionItemsPlan.md#獨立格式) 與 [Schema](../schemas/decisions.schema.json)。範例為 [decision-example.decisions](../tests/fixtures/decision-example.decisions)；先複製再操作，避免修改測試 fixture。

## 開啟文件

使用包含此功能的 CLI：

```powershell
task-progress.exe decisions "C:\Project\decisions\task-a.decisions"
task-progress.exe decisions validate "C:\Project\decisions\task-a.decisions"
```

第一行直接開啟 Desktop，不需要 Report 或本機服務。第二行僅驗證並輸出 JSON；失敗回非零 exit code。

需要雙擊開啟時，用已發布的 EXE 執行 `decisions install` 註冊目前使用者的檔案關聯；`decisions uninstall` 可移除本應用擁有的關聯。

## Browser 與 Report

將文件放在已登記 scope 的 `decisions/<task-id>.decisions`；檔名、文件的 task_id 與 Report 普通任務 ID 必須相同。使用包含新路由與 UI 資產的服務版本。

- 指定任務：`/decisions/?scope=<scope-id>&task=<task-id>`。
- scope 總覽：`/decisions/?scope=<scope-id>`。
- 本機 Report 卡片會顯示對應文件的待決策數量與連結。

選取選項，或直接在「其他方案」輸入文字（自動選中「其他」）→「確認決策」。只有成功確認才保存。草稿僅保留本頁，重新載入或關閉可能遺失。

修改已確認的答案 →「重新開啟」→ 確認 → 重新選擇答案。目前答案會清除；版本追溯使用 Git。

若顯示衝突，先核對最新問題，再選擇捨棄或保留草稿；若顯示結果未確認，使用「查核／重試原請求」，避免重複發動新操作。

## 本機操作範例

> Task ID: decision-example

操作檔：[decisions/decision-example.decisions](../decisions/decision-example.decisions)。此檔與測試 fixture 分開，答案僅供驗收，不作為正式設計決策。

啟動本機服務 → 開啟 [Web 範例](http://127.0.0.1:8001/decisions/?scope=task-progress&task=decision-example) → 直接在「其他方案」輸入文字 → 確認「其他」自動選中 → 按「確認決策」。

重新載入 → 確認答案仍在 →「重新開啟」→ 確認 → 檢查題目回到待決策且目前答案清空。

Desktop 可雙擊操作檔，或以 `Build/win-x64/task-progress.exe decisions decisions/decision-example.decisions` 開啟。

## Agent 與本機請求

Agent 開始或接續任務時，先檢查 `decisions/<task-id>.decisions`；pending 為需要使用者回答的問題，decided 為已確認答案。題目與答案以文件連結＋decision ID 引用，不複製建立第二份可編輯來源。題目不存在與檔案損壞必須區分。

本機 stdin／stdout 入口：

```powershell
Get-Content -Raw -Encoding UTF8 request.json | task-progress.exe decisions request --file "C:\Project\decisions\task-a.decisions"
```

呼叫程式須以 UTF-8 寫入 stdin。Windows PowerShell 5 的管線另受 `$OutputEncoding` 影響，呼叫前應設為 UTF-8。

先送 `{"operation":"load"}` 取得 document、revision 與 document_key。修改請求使用下列結構：

```json
{
  "operation": "confirm",
  "decision_id": "input",
  "expected_revision": "<load 回傳的 revision>",
  "expected_version": 1,
  "request_id": "<每筆邏輯請求的唯一 ID>",
  "payload": { "kind": "option", "option_id": "batch" }
}
```

- `confirm`：payload 是 option 或 other 答案。需要補充條件或理由時，選「其他」並直接寫入答案；畫面不另設理由欄。
- `reopen`：payload 為 `{}`。
- `revise`：payload 為完整題目定義，欄位見計畫 D-01；既有問題使用此操作可保留衝突檢查。
- `request` 的 exit code 0 代表已輸出 JSON，必須再檢查 `ok`；錯誤代號在 `error.code`。入口無法產生 JSON 時才回非零。
- 重試原請求保留完全相同的 request ID 與內容。`already_applied` 回傳最新狀態，不代表題目現在仍已決策。

答案確認只記錄選擇；不代表程式已實作、驗收已通過，亦不觸發部署。
