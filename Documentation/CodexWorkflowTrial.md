# 共用任務 skill 與 Codex 驗證流程試跑

> Task ID: codex-workflow-trial

## 範圍與關係

```text
TaskProgress
├─ 驗證流程契約：AcceptanceChainPlan.md
├─ 共用任務 skill（入口文件路由）
│  ├─ 共用：建立、綁定、認領、執行、釋放、驗收
│  └─ agent 差異：入口、actor、session 身分與子 session 能力
└─ Codex 試跑
   ├─ 獨立任務卡、checklist 與實驗產物
   └─ 對照既有驗證流程的六種情境
```

## 目標

使用者要求參考 report 驗證流程，建立 Codex 版任務卡並由 Codex 試跑；測試前先確認 skill 設計，避免 Claude、Gemini、Codex 各維護一份流程。

驗證語意沿用 [驗證流程選項](AcceptanceChainPlan.md)。既有 [Claude 試跑規格](../experiments/acceptance-trial/spec.md) 提供六種情境的參考；Codex 不改寫或執行 Claude 的試跑項目。

## 共用設計

流程本體由 TaskProgress 維護，唯一來源為 `.agents/skills/task-progress-items/`。各 agent 的命令語法、actor、session 身分取得與子 session 能力分開說明，共用流程不寫死 Claude hook 或命令語法。

本機路由採使用者層入口文件，不使用符號連結：

| 入口 | 目的地或用途 |
|---|---|
| `C:\Users\Yu5h1\.agents\skills\task-progress-items` | 入口文件指向本專案共用 skill，供 Codex 與 Gemini 發現 |
| `C:\Users\Yu5h1\.claude\skills\task-progress-items` | 入口文件指向同一份 skill，保留 Claude 的命令入口 |

Codex 官方文件列出使用者層 `.agents/skills`，因此此提案不要求新增 `.codex/skills` 副本；Gemini 也支援 `.agents/skills`。安裝時須確認現有同名入口與實際工具版本，保留既有內容，不覆蓋其他 agent 的檔案。

依據：[Codex skills](https://learn.chatgpt.com/docs/build-skills)、[Claude Code skills](https://code.claude.com/docs/en/skills)、[Gemini CLI skills](https://geminicli.com/docs/cli/using-agent-skills/)。官方支援不等於本機路由已驗證。

## 試跑與驗收範圍

設計確認且 skill 可用後，先建立並提交 Codex 專用試跑規格、各子項 checklist 與綁定，再執行。產物使用 `experiments/codex-acceptance-trial/`，子項與 checklist 使用 `codex-trial-` 前綴。

- 自驗：Codex 認領、產生檔案、自驗並釋放，狀態推算為完成。
- 人工：Codex 完成執行後顯示待使用者；人工結果由使用者記錄。
- 他驗：執行者無法驗收自己的項目，符合共用規範的獨立驗收上下文記錄驗收結果；未繼承父對話且未參與建立、實作或修正的子 agent 可以擔任。
- 他驗加人工：他驗通過前人工檢查鎖住，通過後才交給使用者。
- 條件不符：驗收者指出條件與規格不符，由建立者修訂並提交，再由驗收者確認。
- 等待：前置項目未完成時顯示等待中，不被執行佇列挑選；完成後解除。

每項對照 report 狀態、活動紀錄與 checklist 證據；不以改換 session ID 模擬獨立驗收。能力不足或尚待使用者的步驟保留未完成，不宣稱整輪通過。

## 不包含

Codex 只初始化自己的使用者層入口，不改其他 provider 的入口、不發布或重啟服務。人工驗收留給使用者。

## 尚未決定

無。共用來源與使用者層入口文件路由已由使用者確認；初始化依 taskprogress-capabilities 執行。

## 本輪試跑規格

[Codex 六情境規格](../experiments/codex-acceptance-trial/spec.md) 定義產物與每一步預期狀態。Codex 執行者與獨立驗收者依該規格記錄結果；桌面命令選單的熱載入不以入口檔存在代替驗證。
