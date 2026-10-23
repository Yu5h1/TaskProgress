# 專案缺口盤點

> Task ID: gap-scan
>
> 狀態：討論中。問題由使用者提出（2026-10-24）；設計是待決草稿，決策題在 [gap-scan.decisions](../decisions/gap-scan.decisions)，決定前不實作。
>
> 與其他文件的關係：評估的現行規則在 [agent-executable-items〈Evaluate a scope〉](../../.agents/skills/agent-executable-items/SKILL.md#evaluate-a-scope)；跨平台模組的候選盤點在 [cross-platform-module-spec〈Select scope〉](../../.agents/skills/cross-platform-module-spec/SKILL.md#select-scope)；命令集合在 [AcceptanceChainPlan〈命令〉](AcceptanceChainPlan.md#命令)。

## 系統階層與關係

```text
TaskProgress 可執行項目流程（task-progress-items）
├─ 盤點（本計畫新增）：找出還沒人排定的缺口 → 一份決策題，由使用者選
│     ↓ 使用者選定的缺口成為規格目標、計畫段落或卡片
├─ 評估（plan）：只找已排定、已定案的工作 → 子項、決策題、Next
├─ 執行（run）與驗收（accept）
└─ 既有來源：handoff、Requirements、規格目標、現有子項、決策檔
```

盤點負責「該不該做、做哪個」的候選；評估負責「已決定要做的，拆成可執行的子項」。兩者分開，是因為下一個做什麼由使用者決定。

## 問題與目標

**問題。** 用 `/task-progress-items` 評估時，agent 只會從已經排定的工作裡找項目，不會發現專案還缺什麼。例如 Web 有某個功能、UX 還沒有對應規格，除非使用者明確說「把 ## 整合進 UX」，否則沒有人會提出；就算寫出規格，也不會自動有任務卡和子項，要再評估一次才會出現。

**目標。** 提供一個盤點步驟，從計畫目標、規格與各平台實作、其他專案提出的需求等來源找出缺口，整理成使用者可以選的候選；使用者選定後，接上現有的「評估 → 執行 → 驗收」流程。

**明確非目標。** 盤點不自行建立子項、不設定 Next、不開始任何工作；選擇權在使用者。

## 現況（2026-10-24）

- **評估刻意不找新工作。** agent-executable-items〈Evaluate a scope〉第一句：評估只找已排定、已定案的工作，不找 agent 自己想做的工作。讀的來源是 handoff 的下一步與待決、Requirements、規格目前的目標、friction log、現有子項與決策檔。
- **缺口發現只有一個零散入口。** cross-platform-module-spec〈Select scope〉的「整個庫的候選盤點」：列一張表（能力、使用情境、實作證據、現有涵蓋、相依、建議範圍），等使用者選。限制：
  - 只涵蓋跨平台模組；規格只做到一半、某平台還沒實作、計畫目標沒人負責等缺口不在範圍內。
  - 結果是對話裡的一張表，選定後寫進擁有者的計畫，不產生決策題、卡片或子項。
  - 不能從 task-progress-items 啟動，要另外下「把 ## 整合進 UX」。
- **選定後的銜接已經存在。** 規格目標一旦寫好，評估會讀到「規格目前的目標」並建立子項；scope 沒有對應卡片時，評估會為這項工作建一張卡。

## 設計（草稿）

對應〈尚未決定〉的選項。

- **入口。** task-progress-items 新增一個動詞（名稱待決），例如 `/task-progress-items scan [scope|all]`。
- **來源。** 依盤點範圍（待決），候選來源包括：計畫目標與實際實作的落差；規格的目標與各平台實作的落差（哪個平台還沒做、做到哪一版）；其他專案對本專案提出、仍未處理的 Requirements；跨平台模組候選（某平台已有、規格擁有者還沒有）。
- **產出。** 每個候選附上證據（檔案、呼叫點、現有涵蓋）與建議；寫成一份決策題，綁在 scope 的一張卡片上，使用者在決策頁選。
- **選定之後。** 被選中的缺口寫成規格目標、計畫段落或卡片；下一次 `plan` 照現行評估規則拆成子項。跨平台模組候選選定後，照 cross-platform-module-spec 撰寫規格。
- **既有規則不變。** 一次只進行一個模組、下一個由使用者點名；盤點只提出候選，不違反這條。

## 尚未決定

[gap-scan.decisions](../decisions/gap-scan.decisions) 第 1～6 題：

1. 盤點的範圍。
2. 是否允許一次盤點所有 scope。
3. 和「把 ## 整合進 UX」的關係。
4. 盤點結果的形式。
5. 使用者選定之後，缺口落在哪裡。
6. 動詞名稱。
