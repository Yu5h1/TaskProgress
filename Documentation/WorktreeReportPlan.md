# 同一 repo 的多 agent 平行執行

> Task ID: worktree-report
>
> 狀態：方向已定案，尚未實作。目標由使用者對齊（2026-10-24）；已決定的 10 點來自 [worktree-report.decisions](../decisions/worktree-report.decisions) 第 1～10 題（使用者 2026-10-24）；共用外部資源（第 11 題）待決。
>
> 與其他文件的關係：綁定見 [DocumentBindingPlan](DocumentBindingPlan.md)；認領、釋放與他驗見 [AcceptanceChainPlan](AcceptanceChainPlan.md)；Next 見 [NextMarkerPlan](NextMarkerPlan.md)。

## 系統階層與關係

```text
TaskProgress
└─ 平行執行（一個已註冊 scope、一個 repo）
   ├─ 規劃：評估把項目分成可平行的組（不碰同一批檔案）與必須依序的組
   ├─ 分派：每組一個 agent、一個 worktree 與分支；同組依序，組與組同時進行
   ├─ 認領：同一項目同時只有一個 agent
   ├─ 追蹤：Report 唯讀顯示 worktree 進度，決策題可作答
   ├─ 合併：依依賴順序合併回主線，合併時寫入執行紀錄，之後才他驗
   └─ 共用資源：主線 report.json 只有一個寫入者；單一檔案產物合併後重建
        ↑
   git（記錄所有 worktree）＋ 服務（127.0.0.1:8001，掃描 worktree）
```

規劃決定哪些項目能同時做；分派讓它們在各自的 worktree 同時進行；合併把成果安全帶回主線。追蹤只是讓使用者在過程中看得到，不是平行本身的前提。

## 問題與目標

**問題。** 同一個 repo 多處同時修改會衝突，現在只能一次一個 agent 做一個 scope，阻礙發展。worktree 能分開工作目錄，但只靠它不夠：現行規則禁止同一 scope 平行；Report 看不到 worktree；兩個 worktree 改到同一個檔案，衝突只是延到合併時才發生。

**目標。** agent 規劃出可以平行的多個項目，交給不同 agent 在同一個 repo 同時執行，完成後安全合併回主線；過程中使用者能在 Report 上追蹤。

**明確非目標。** 不支援另外 clone 的資料夾或其他電腦；不讓使用者在 Viewer 裡修改 worktree 的程式；會改到同一批檔案的項目不平行，依序做。

## 已決定

使用者 2026-10-24 在 [worktree-report.decisions](../decisions/worktree-report.decisions) 第 1～10 題選定：

1. **worktree 文件。** Report 唯讀顯示 worktree 裡的驗收清單；只有決策題可以在 Report 作答，因為決策常在工作途中就需要。
2. **項目歸屬。** worktree 裡的文件在開頭寫一行 `Report: <卡片代號>` 表示屬於哪張卡；檔名不承擔歸屬。
3. **認領。** 某個 worktree 裡有某項目的文件，就算它認領了那一項；worktree 合併或刪除後認領自動消失。被丟著不管的 worktree 在 Report 上可見，由使用者清除。
4. **同一份文件兩個版本。** 內容相同只算主線；不同時顯示 worktree 那份並標分支名。
5. **執行紀錄。** worktree 階段只做執行；合併回主線時，由驗收者在 report.json 一次寫入建立、執行與釋放紀錄，之後才開始他驗。他驗規則本身不改。
6. **階段順序。** 先做第 1 階段（平行執行），再做第 2 階段（追蹤）。
7. **檔案範圍。** 每個項目在驗收清單開頭寫一行 `Paths:`，列出會改的檔案或資料夾範圍；分組依此判斷。
8. **合併。** 由分派者（主線上開 session 的那個）依依賴順序合併各組、重建產物、寫入執行紀錄。
9. **分派期間的認領。** 分派者在主線 report 上先標記項目已分派給哪一組，第 1 階段就能防止別的 agent 拿走同一項；主線 report 仍只有分派者寫入。
10. **單一檔案產物。** 分支只提交原始檔，不提交重建的產物；合併後由合併者在主線重建一次並提交。

## 已知問題

1. **現行規則禁止平行。** task-progress-items〈Queues and sessions〉規定每個 scope 一次只開一個 session、做一項；agent-executable-items〈One writer per scope〉規定有 session 在寫一個 scope 時，不得把項目交給別人。不改這兩條，其他做得再多也不能平行。
2. **衝突只是延到合併。** 兩組改到同一個原始碼檔案，合併時仍會衝突。要在規劃時依「會改哪些檔案」分組（agent-work-route〈Work alongside another agent〉：依能否合併分工，不依任務分工）。
3. **單一檔案產物無法合併。** 例如 TaskProgress 的 `viewer/assets/viewer-ui.js` 與兩個 checklist／decision bundle、lockfile：兩個分支各自重建後無法合併。
4. **誰合併、順序與衝突。** 多組完成後由誰合併、依什麼順序、合併衝突交給誰修。
5. **規劃要能判斷平行。** 項目要能說明自己會改哪些檔案，評估才能分組；說明不準時，合併才會發現。
6. **主線 report.json 的寫入者。** worktree 裡的 agent 不寫 report.json；平行期間的分派、Next、新項目要有一個主線上的寫入者。
7. **分派到合併之間的認領。** 已決定 3 依靠 Report 掃描 worktree；在掃描做好之前，其他 agent 看不到哪些項目已被分派。
8. **agent 能力差異。** Claude 桌面版能自己開 worktree session 分派；Codex、Antigravity 尚未記載，需要使用者手動開 session。
9. **殘留 worktree、掃描成本與範圍。** 掃描不能拖慢 Viewer；非 git 的 scope、資料夾已刪除的 worktree（git 標為 prunable）要略過。
10. **共用外部資源（使用者 2026-10-24 提出）。** worktree 只分開工作目錄，不分開同一時間只能一個人用的資源（agent-work-route〈Work alongside another agent〉）。Unity 是主要案例：
    - 一個 Unity Editor 只開一個專案資料夾；每個 worktree 是不同資料夾，要同時跑就要各開一個 Editor，且每個 worktree 都要重新匯入 `Library`，大專案耗時又吃記憶體。
    - MCP 一次呼叫只操作一個 Editor；unity-mcp 雖能連多個實例（以 `set_active_instance` 指定），多個 session 同時切換目標會互相干擾。
    - Editor 視窗與 Play 模式會搶畫面，違反驗收「不佔用使用者畫面」的規則。
    - 同類的還有固定 port 的服務（例如 TaskProgress 的 8001）、常駐程序、共用的輸出資料夾。

## 設計（草稿）

以下對應〈尚未決定〉的選項；已決定的部分照〈已決定〉。

- **規劃。** 每個項目在 checklist 開頭寫一行 `Paths:`（已決定 7）。兩個項目範圍重疊，或都會碰到同一個單一檔案產物，就放進同一組依序做；不重疊的分到不同組。跨組的依賴用既有 `waits_for`，被等的那組排前面。
- **共用資源（待第 11 題）。** 候選做法：再寫一行 `Needs:` 宣告需要的共用資源（例如 `unity-editor`）；需要同一資源的項目全部排進同一組依序做，同一時間只有一個 session 用 Unity Editor 與 MCP。只需編譯或跑測試的 Unity 步驟可改用 batchmode（`-batchmode -nographics -runTests`），不開視窗、不搶畫面，但仍要等該 worktree 的 `Library` 匯入完成。
- **分派。** `run`／`auto` 每組開一個 session，各自一個 worktree 與分支；同組依序，組與組同時進行。主線上開 session 的那個 session（分派者）是平行期間唯一寫主線 report.json 的人。
- **worktree 裡的寫入。** 只寫自己的程式與文件，不寫 report.json，不重建單一檔案產物。
- **追蹤。** 服務以 `git worktree list` 找出同一 repo 的 worktree，依已決定 1、2、4 顯示；決策題可作答。
- **合併。** 每組完成後依依賴順序合併回主線，在主線重建單一檔案產物，寫入執行紀錄（已決定 5），再進入他驗。合併衝突：停下回報，交回那一組在它的分支修正。

## 可行性評估

**可行。第一個能交付「平行」的階段主要是規則與流程，程式改動很少；Report 讀 worktree 的成本在後面的階段。**

| 部分 | 現況（量測） | 評估 |
|---|---|---|
| 放寬平行規則 | 兩條規則各一段文字 | 低。改寫 task-progress-items 與 agent-executable-items |
| 依檔案分組 | 沒有前例；agent-work-route 已有「依能否合併分工」原則 | 中，有風險：`Paths:` 宣告可能漏寫，漏掉的檔案在合併時才衝突 |
| 分派到 worktree | Claude 桌面版已能開 worktree session（本專案在用） | Claude 低；其他 agent 要使用者手動開 session |
| 合併 | referenced-module-acceptance 已有「驗收者合併分支、刪除 worktree」的流程 | 中。沿用該流程，加上依賴順序與產物重建 |
| 單一檔案產物 | TaskProgress CI 會檢查 bundle 是否過期 | 低到中。分支不提交產物、合併後在主線重建，CI 照常檢查主線 |
| 他驗 | 已決定 5：合併時寫入 | 低。他驗規則不改 |
| Report 讀 worktree | checklist／decision 路由只讀主線資料夾（`taskprogress_host.py`）；推算在 `document-binding.js`、`item-state.js` 與 C# `ItemStateResolver` | 中。路由要能指定 worktree；項目來源分主線與 worktree 兩種 |
| 掃描 worktree | 服務已會呼叫外部程式；git 可用 | 低。處理非 git scope、prunable 與快取 |
| 共用外部資源（Unity） | 一個 Editor 一個專案資料夾；MCP 一次一個目標；Editor 會搶畫面 | 中。需要 Editor 的項目排同一組依序做，平行只發生在其他組；batchmode 能讓編譯與測試不搶畫面，但 worktree 的 `Library` 匯入成本高 |

規模（依 agent-work-route〈Size the work in the spec〉）：

```
Volume:    第 1 階段：2～3 份 skill 文字；第 2、3 階段：服務、CLI、Viewer 約 6 個檔案、約 3,300 行既有程式
Precedent: 合併流程有先例；依檔案分組與 worktree 掃描是新做法
Proof:     第 1 階段要實際讓兩個 agent 平行做兩個不重疊的項目並合併；第 2 階段需要瀏覽器實測
```

**階段**（順序依已決定 6）：

1. **平行執行。** 放寬兩條規則；`Paths:` 宣告與分組；分派者開 worktree session；合併、產物重建與衝突處理規則。Report 暫時看不到 worktree 進度，由分派者回報。
2. **追蹤。** 服務掃描 worktree，Report 唯讀顯示進度，決策題可作答（已決定 1、4）。
3. **worktree 內新增項目。** 以檔頭歸屬（已決定 2），worktree 即認領（已決定 3），worktree 不寫 report.json 也能新增項目。

完成標準（第 1 階段）：兩個 agent 同時在兩個 worktree 各做一個 `Paths:` 不重疊、也不需要同一共用資源的項目，依順序合併回主線且沒有衝突，產物在主線重建，執行紀錄在合併時寫入，之後他驗照常進行。

## 尚未決定

[worktree-report.decisions](../decisions/worktree-report.decisions) 第 11 題：需要 Unity Editor 這類共用資源的項目怎麼排。
