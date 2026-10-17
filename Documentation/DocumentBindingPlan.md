# Report 子項目文件綁定

> Task ID: document-binding

```text
Report
├─ 任務卡：摘要與子項目進度
└─ 子項目：document_ref → Checklist／Decision
   └─ Viewer 讀取來源 → 推導顯示狀態與來源連結
```

## 子項目綁定契約

只有物件型子項目可設定 `document_ref`；欄位與來源完成條件由 [Report 技能](../.agents/skills/task-progress-report/SKILL.md#bind-checklist-and-decision-documents-document_ref) 維護。任務卡摘要保留一般超連結，不顯示專用文件徽章或待決策計數，也不自行綁定文件。

來源完成時，非封存子項目顯示完成；來源重新開啟、空白或讀取失敗時，恢復原本未完成狀態，原始為完成者改顯示進行中。封存狀態保留。讀取失敗另顯示來源不可用。

含綁定子項目的卡片彙總全部非封存子項目；未綁定卡片維持既有行為。投影不回寫 Report，編輯與儲存依穩定 ID 定位原始項目。

## 驗收

本輪驗收入口為 [document-binding.checklist](../checklists/document-binding.checklist)。程式檢查涵蓋來源重新開啟、缺失與空文件、封存、混合項目彙總、未綁定卡片及原始資料不變；人工檢查涵蓋實際頁面入口、導覽與回焦連動。執行結果與待辦由 handoff、Checklist 與 Report 記錄。
