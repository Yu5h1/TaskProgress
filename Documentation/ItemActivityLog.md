# 子項活動紀錄

> Task ID: item-activity-log

## 用途

每個子項記下誰在何時建立、開始、修改、完成或接手它。兩個用途：

- 追查變更來源。不同工具（Claude、Codex、Antigravity）的 commit 作者都是同一個使用者，git 分不出是哪個 agent 寫的。
- 防止兩個 session 同時處理同一個子項。這是 AgentsRule「保留其他 agent 的工作」在 Report 上的落實。

記的是事件，不是角色。建立者是第一筆 `created`，執行者是每一筆 `started`／`takeover`，修改者是 `updated`；`released` 表示執行者交出認領，`disputed` 表示建立者不同意驗收者對條件的質疑（[驗證流程選項](AcceptanceChainPlan.md)）。以後要多一種角色時加事件，不必改欄位。

## 資料

子項物件的 `activity` 陣列，每筆：

| 欄位 | 內容 |
|---|---|
| `event` | `created`、`started`、`updated`、`done`、`takeover`、`released`、`disputed` |
| `actor` | 寫入的工具，小寫英文，例如 `claude`、`codex`、`antigravity`；Viewer 寫入為 `user` |
| `session` | 選填。寫入 session 的名稱（工具畫面上顯示的標題），給人看；Viewer tooltip 顯示它 |
| `session_id` | 選填。寫入 session 的 ID，給認領比對與追查紀錄用；Viewer 不顯示 |
| `at` | ISO 時間 |
| `note` | 選填。`disputed` 必填，寫明不同意的理由（最多 300 字） |

- 保留規則：第一筆 `created` 與每一筆 `started`、`takeover` 永久保留，執行過的 session 才不會被擠掉；`released`、`disputed` 各保留最近一筆；其他事件只留最近 3 筆（常數，暫不提供設定）。schema 的 `maxItems` 為 64。JS（`viewer/assets/item-activity.js`）、Python（`service/report_operations.py`）與 schema 一致，由測試核對。
- 紀錄由寫入端自動產生，不能在 `item.add`／`task.add` 的值裡自行提供。既有子項不回填。
- 2026-10-21 起 `session` 改為名稱、ID 移到 `session_id`；當時 TaskProgress 與 UX report 裡以 `session` 存 ID 的舊紀錄已一次遷移，名稱取自各 session 的標題。
- 只有實際改變內容或位置的寫入才記一筆；no-op 仍是 no-op。

## 寫入者

- **Report CLI**：`report apply` 的請求必須帶 `actor`，`session`（名稱）與 `session_id` 可省略，知道就填。新增記 `created`（新增時狀態為 `in_progress`／`done` 再記 `started`／`done`）；`item.update` 改成 `in_progress` 記 `started`、改成 `done` 記 `done`，其他改變記 `updated`；`item.move` 實際換位記 `updated`。格式見 [Report CLI 修改](ReportCliUsage.md#身分與認領)。
- **Viewer**：編輯模式存檔與預覽拖曳換位，對新增、改變或換位的子項各記一筆 `user`。只因別項移動而位置平移的子項不記。紀錄一律接在已存檔的版本後面，舊草稿不會蓋掉別人寫的紀錄。使用者寫入不受認領檢查阻擋。

## 認領

子項狀態為 `in_progress` 時，最後一筆 `started`／`takeover` 的寫入者是目前的執行者，除非它之後有一筆 `released`。`item.event` 的 `released` 會把狀態改回 `planned`，下一個接手的 session 設 `in_progress` 時重新記 `started`。CLI 對該子項的 `item.update`／`item.move` 先比對：

| 情況 | 判定 | 寫入方式 |
|---|---|---|
| 工具相同，且雙方都有 `session_id` 並相同 | 自己 | 照常寫入 |
| 工具不同，或雙方 `session_id` 都有但不同 | 別人（`claim_conflict`） | 先問使用者；同意後帶 `claim: "takeover"`，記一筆 `takeover` |
| 工具相同，但任一方沒有 `session_id` | 分不出來（`claim_unverified`） | agent 自己認得是它開始的就帶 `claim: "own"`；認不出來就問使用者，再帶 `claim: "takeover"` |

認領只比對 `session_id`，不比對名稱：名稱可以重複或改名，不能證明是同一個 session。

只檢查寫入，不擋讀取；不鎖整張卡，其他子項照常寫入。狀態不是 `in_progress` 時沒有執行者，不檢查。

刻意不做逾時自動解除：仍在執行的長任務會被別人接走，造成兩邊同時改。停擺的子項由使用者看 tooltip 的時間判斷，一句話授權接手。

## 顯示

Viewer 預覽模式滑鼠停在子項上時，以 tooltip 列出紀錄，一筆一行，格式為「事件：actor (session 名稱) · 多久前」；沒有名稱時只顯示 actor，不顯示 session ID。例如：

```text
建立：antigravity · 3 小時前
開始：codex (Web 驗收) · 30 分鐘前
```

## 驗收

- Python：新增／開始／完成與保留 3 筆、no-op、缺少 actor、自帶 activity、認領的四種判定（`tests/test_report_cli.py`）。
- Node：保留規則、Viewer 只記改變與換位的子項、驗證、tooltip 文字、三處保留數一致（`tests/item-activity.test.mjs`）。
