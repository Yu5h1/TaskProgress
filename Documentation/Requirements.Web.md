# TaskProgress 對 Web 的需求

Target: Web；Requester: TaskProgress。目前透過固定公開 UI 產物及跨 scope Report／Checklist 引用 Web。Outstanding: 1。Date: 2026-10-27。

## TASKPROGRESS-WEB-2：OptionPicker 共用呈現

- Status: Delivered，2026-10-27；公開元件與產品接線已交付，人工外觀驗收留在消費端 checklist。
- Requirement: 提供可接受宿主選項與圖示、受控目前值及動作的共用 OptionPicker，不讓 TaskProgress 自行組裝面板或維護取消生命週期。
- Acceptance: 排序與可見性兩個 caller 使用同一公開元件，保留循環／長按／鍵盤／reset；中性檢視模式也可使用，無產品名稱分支。資料更新、卸載與晚到事件不提交過期選取。
- Scope: Web 契約與元件；TaskProgress 保留產品狀態、持久化與回呼。驗收及採用由 [本地計畫](WebUiReplacementPlan.md#optionpicker-共用元件採用) 擁有。

## TASKPROGRESS-WEB-1：遷移追蹤文件可讀性

- Status: Outstanding，2026-10-27 提出。
- Requirement: 修復 Web 已提交的 report.json 與 handoff.md 編碼／內容損壞，保留原卡片、綁定及驗收歷史。
- Evidence: 工作樹兩檔均無變更；UTF-8 嚴格解碼分別在 byte 125（0x80）與 byte 241（0x8f）失敗，Report 使用替代字元解碼後亦無法解析 JSON。未以重新編碼或覆寫方式修復。
- Acceptance: 兩檔能嚴格 UTF-8 解碼，report validate 通過；對照可恢復來源確認卡片 ID、綁定、使用者結果未遺失，更新與本次效能拆分相衝突的舊狀態文字。
- Impact: Web 任務卡更新及消費端跨 scope 狀態解析；不代表 Web UI runtime 故障。
- Workaround: 本輪更新有效的 Web 計畫／Checklist，在 TaskProgress 自有退役卡核對必要功能證據，不修改損壞檔案；待 Web 擁有者修復後同步彙整卡。
