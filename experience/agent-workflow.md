# agent-workflow 經驗紀錄

- [promoted → task-progress-items〈Close-out review〉〈Accept〉] 2026-10-25 claude › goal-flow-implementation › missing：卡片最後一個工作子項有 [acceptance] 時，沒寫明由誰做收尾檢討；通過的驗收結果不能附 observed，範例沒說（獨立驗收者回報）
- [dismissed：handoff〈Gotcha: `dotnet run`/`build` without `-r win-x64`…〉早已記載，問題在沒讀到，不另寫規則] 2026-10-25 claude › goal-flow-implementation › environment：在 TaskProgress 跑 `dotnet build`／`dotnet run` 測試會改寫 `src/TaskProgress.Cli/packages.lock.json`（不帶 RID 的 restore 拿掉發佈用項目），提交前要還原 → handoff 的 gotchas 或測試說明
- [promoted → task-progress-items〈Plan against the goal〉] 2026-10-25 claude › goal-flow-implementation › missing：子項建立後計畫又新增規則（「等外部交付」晚 35 分鐘寫進計畫），checklist 不會跟著補；沒有規則要求計畫改動時檢查已建立的子項 → task-progress-items〈Plan against the goal〉
- [dismissed：只和本 session 用 Bash heredoc 產生 Python 字串的寫法有關，不影響流程] 2026-10-25 claude › goal-flow-implementation › environment：heredoc 裡的 `\\n` 被寫成真正的換行
- [promoted → ItemState.cs 與 item-state.js 的不通過時間改看檔案標記] 2026-10-25 claude › acceptance-flow-trial › judgment：被等子項修正後一釋放，使用者的不通過就失效，已開始的等待者因此不必重做；設計試跑步驟時發現
- [promoted → task-progress-items〈Queues and sessions〉] 2026-10-25 claude › acceptance-flow-trial › judgment：使用者判被等項不通過時，等待者同時顯示「需修正」，run 可能在被等項修正前就先重做等待者；試跑中先修 W 再重做 L，但規則沒要求這個順序 → task-progress-items〈Execute〉或狀態推算（被等項未修好前顯示等待中）

指標：驗收不通過 0／3、重做 0、重講目標 4、週期 4 天
