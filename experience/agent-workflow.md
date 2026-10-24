# agent-workflow 經驗紀錄

- [promoted → task-progress-items〈Close-out review〉〈Accept〉] 2026-10-25 claude › goal-flow-implementation › missing：卡片最後一個工作子項有 [acceptance] 時，沒寫明由誰做收尾檢討；通過的驗收結果不能附 observed，範例沒說（獨立驗收者回報）
- [open] 2026-10-25 claude › goal-flow-implementation › environment：在 TaskProgress 跑 `dotnet build`／`dotnet run` 測試會改寫 `src/TaskProgress.Cli/packages.lock.json`（不帶 RID 的 restore 拿掉發佈用項目），提交前要還原 → handoff 的 gotchas 或測試說明
- [open] 2026-10-25 claude › goal-flow-implementation › missing：子項建立後計畫又新增規則（「等外部交付」晚 35 分鐘寫進計畫），checklist 不會跟著補；沒有規則要求計畫改動時檢查已建立的子項 → task-progress-items〈Plan against the goal〉
- [dismissed：只和本 session 用 Bash heredoc 產生 Python 字串的寫法有關，不影響流程] 2026-10-25 claude › goal-flow-implementation › environment：heredoc 裡的 `\\n` 被寫成真正的換行
