# 對 agents 共用規則 scope 的需求

> 需求對象：Yu5h1Lib/.agents（scope_id：agents）
> 提出方：TaskProgress
> 消費方式：task-progress-items 透過共用索引讀取 agent-executable-items 與領域技能。
> 待處理：1 項
> 日期：2026-10-25

## TASKPROGRESS-AGENTS-1｜讓共用規則接上已確認的目標導向流程

- **Status**：Outstanding，2026-10-25 提出。
- **Requirement**：依 [AcceptanceChainPlan〈目標與流程〉](AcceptanceChainPlan.md#目標與流程) 與 [GapScanPlan〈已決定〉](GapScanPlan.md#已決定)，更新 agents scope 擁有的執行項目準則與跨平台模組技能，使其採用 TaskProgress 的目標確認、分層 plan 與經驗流程，領域方法由原領域技能保留。
- **Evidence**：`../.agents/skills/agent-executable-items/SKILL.md`〈Evaluate a scope〉仍限定評估只找已排定工作，來源仍有 friction log；原始決策已要求從已確認目標推得出的缺口直接建工作、改讀卡片經驗。AcceptanceChainPlan〈落實時要改的地方〉另明定 cross-platform-module-spec 保留 UX 盤點方法，移除等使用者選與重複的通用目標確認；`../.agents/handoff.md`〈Module-workflow review〉仍持有需接回新流程的 light-lane 提案與 friction log。
- **Acceptance**：agent-executable-items 能依已確認目標建立必要工作，改讀卡片經驗；cross-platform-module-spec 保留模組目標欄位、消費端證據、適配表與候選盤點方法，流程改引用 task-progress-items；module-workflow-review 的重疊內容回到單一擁有者；三者與 TaskProgress 技能不再要求矛盾的停點或重複確認。從全新上下文走過已定目標、未定目標、目標內缺口與擴充目標四種情境，路由與產出符合原始設計。
- **Impact**：所有經 TaskProgress 執行項目入口規劃工作的 scope，以及跨平台模組規格流程。TaskProgress 的 goal-flow-implementation 串接檢查需消費此交付。
- **Workaround**：目前直接引用已確認的目標與流程作為本輪規劃依據；共用規則尚未更新前，不宣稱整條流程已落實。

需求狀態由 TaskProgress 在收到交付、依上述 Acceptance 確認後更新。agents scope 的規劃入口是在 `Yu5h1Lib/.agents` 執行 `/task-progress-items plan module-workflow-review`；本需求不授權提出方修改該 scope。
