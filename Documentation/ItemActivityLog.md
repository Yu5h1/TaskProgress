# 子項活動紀錄

> Task ID: item-activity-log

## 用途

每個子項記下誰在何時建立、開始、修改、完成或接手它。兩個用途：

- 追查變更來源。不同工具（Claude、Codex、Antigravity）的 commit 作者都是同一個使用者，git 分不出是哪個 agent 寫的。
- 防止兩個 session 同時處理同一個子項。這是 AgentsRule「保留其他 agent 的工作」在 Report 上的落實。

記的是事件，不是角色。建立者是第一筆 `created`，執行者是 `started`／`takeover`，修改者是 `updated`。以後要多一種角色時加事件，不必改欄位。

## 資料

子項物件的 `activity` 陣列，每筆：

| 欄位 | 內容 |
|---|---|
| `event` | `created`、`started`、`updated`、`done`、`takeover` |
| `actor` | 寫入的工具，小寫英文，例如 `claude`、`codex`、`antigravity`；Viewer 寫入為 `user` |
| `session` | 選填。寫入者知道自己的 session ID 就填，不知道就省略，靠時間去各工具紀錄找 |
| `at` | ISO 時間 |

- 保留規則：第一筆 `created` 永久保留，其餘只留最近 3 筆（常數，暫不提供設定）。JS（`viewer/assets/item-activity.js`）、Python（`service/report_operations.py`）與 schema 的 `maxItems` 一致，由測試核對。
- 紀錄由寫入端自動產生，不能在 `item.add`／`task.add` 的值裡自行提供。既有子項不回填。
- 只有實際改變內容或位置的寫入才記一筆；no-op 仍是 no-op。

## 寫入者

- **Report CLI**：`report apply` 的請求必須帶 `actor`，`session` 可省略。新增記 `created`（新增時狀態為 `in_progress`／`done` 再記 `started`／`done`）；`item.update` 改成 `in_progress` 記 `started`、改成 `done` 記 `done`，其他改變記 `updated`；`item.move` 實際換位記 `updated`。格式見 [Report CLI 修改](ReportCliUsage.md#身分與認領)。
- **Viewer**：編輯模式存檔與預覽拖曳換位，對新增、改變或換位的子項各記一筆 `user`。只因別項移動而位置平移的子項不記。紀錄一律接在已存檔的版本後面，舊草稿不會蓋掉別人寫的紀錄。使用者寫入不受認領檢查阻擋。

## 認領

子項狀態為 `in_progress` 時，最後一筆 `started`／`takeover` 的寫入者是目前的執行者。CLI 對該子項的 `item.update`／`item.move` 先比對：

| 情況 | 判定 | 寫入方式 |
|---|---|---|
| 工具相同，且雙方都有 session ID 並相同 | 自己 | 照常寫入 |
| 工具不同，或雙方 session ID 都有但不同 | 別人（`claim_conflict`） | 先問使用者；同意後帶 `claim: "takeover"`，記一筆 `takeover` |
| 工具相同，但任一方沒有 session ID | 分不出來（`claim_unverified`） | agent 自己認得是它開始的就帶 `claim: "own"`；認不出來就問使用者，再帶 `claim: "takeover"` |

只檢查寫入，不擋讀取；不鎖整張卡，其他子項照常寫入。狀態不是 `in_progress` 時沒有執行者，不檢查。

刻意不做逾時自動解除：仍在執行的長任務會被別人接走，造成兩邊同時改。停擺的子項由使用者看 tooltip 的時間判斷，一句話授權接手。

## 顯示

Viewer 預覽模式滑鼠停在子項上時，以 tooltip 列出紀錄，一筆一行，例如：

```text
建立：antigravity · 3 小時前
開始：codex (01a15c8a) · 30 分鐘前
```

## 驗收

- Python：新增／開始／完成與保留 3 筆、no-op、缺少 actor、自帶 activity、認領的四種判定（`tests/test_report_cli.py`）。
- Node：保留規則、Viewer 只記改變與換位的子項、驗證、tooltip 文字、三處保留數一致（`tests/item-activity.test.mjs`）。
