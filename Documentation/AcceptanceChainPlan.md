# 驗證流程選項：`[acceptance]` 與 `[manual]`

> Task ID: checklist-acceptance-chain

Report：task-progress › agent-workflow。

一個可執行項目綁定一份 checklist。checklist 裡有哪些檢查標籤，就決定這個項目要經過哪些驗證：

```text
執行者跑完自己的檢查（不標）
├─ 有 [acceptance] → 另一個 agent 驗收
└─ 有 [manual]     → 使用者驗收
全部 [x] → 子項完成
```

## 為什麼

Agent 自己寫步驟、自己執行時，交給更高階的模型驗收後，約兩成項目是做錯或沒對齊需求意圖（不是沒做）。Report 目前分不出「執行者做完」和「驗收通過」，做錯的項目看起來和完成的一樣。高階模型多半能在執行時自行驗收通過，所以獨立驗收是可選的，不是每一項都要。

## 已決定

使用者於 2026-10-21、22 決定：

1. 只有「驗收通過」才算完成；Report 要分得出執行者做完、等待驗收、驗收不通過。
2. 檢查標籤是權限標籤，只接受程式登記過的標籤：不標（執行者）、`[manual]`（使用者）、`[acceptance]`（執行者以外的 agent）。
3. 一個可執行項目只綁一份 checklist，執行、他驗、人工檢查都在同一份。
4. `[acceptance]` 的檢查條件在規劃時寫好，從原始需求推導；寫的人不能是執行者。
5. 「執行者以外」以 session 為單位判定：不同 session 就算不同。
6. `[acceptance]` 主要由 agent 記錄。使用者可以在面板改它的結果，改之前跳出確認「確認修改 agent 紀錄嗎？」。
7. 每個 `[acceptance]` 結果都記下記錄者（agent 的 session，或 `user`），沒有記錄者的結果不算數。
8. `[manual]` 檢查在執行者自己的檢查全部完成後才加入。執行者與驗收者發現缺漏時都可以補上或調整；它的目的始終是「使用者能不能接受這件事完成」。
9. 執行者與驗收者不能把 `[manual]` 標成 `[x]`，只能標 `[!]`，意思是「需要使用者再驗一次」，並在 `Observed` 寫明原因。只有使用者能標 `[x]`。
10. 入口是一個 Claude skill，斜線命令 `/task-progress-items`（見〈命令〉）。其他工具的對齊由使用者另外處理。
11. 沒有指定驗證方式時，由 agent 依〈驗證方式的判斷依據〉替每一項選擇，並在回報中寫出每一項的選擇與理由。使用者想強制時，在指示前加 `self`、`manual`、`cross` 或 `cross manual`。
12. 驗證流程只在觸發時使用，不依項目內容自動套用。現行「改動規格或程式碼時，另一個 agent 審查並寫在 handoff」的規則刪除，需要獨立驗收時改用 `[acceptance]`。
13. 只有他驗需要另一個 session：寫 `[acceptance]` 條件的 session 不得執行，驗收者不得是執行者。自驗與人工可以在同一個 session 規劃並執行，與過去相同。
14. 一次處理多個項目時，能開子 session 就每項開一個；同一個 scope 一次一個，前一個通知完成才開下一個；不同 scope 可以同時。不能開子 session 時，`run`、`accept` 做完一項就停，列出下一個候補，等使用者說繼續；`auto` 一路做下去，遇到他驗項目停下，請使用者開新 session 執行。
15. `run`、`accept` 不帶代號時處理全部可處理的項目；帶卡片代號只處理那張卡，帶項目代號只處理那一項。

## 一份 checklist 的樣子

```markdown
- [ ] **1. 數值欄位支援小數位**
  Outcome: 設定欄位依規格顯示與提交小數。
  Checks:
    - [ ] **單元測試**
      - Action: 執行 numeric-field 測試。
      - Expect: 全部通過。

- [ ] **2. 他驗**
  Depends on: 1.
  Outcome: 執行者以外的 agent 依原始需求確認結果。
  Checks:
    - [ ] **驗收條件未被改動** `[acceptance]`
      - Action: 以 git 檢查本檔第 2 項自規劃者提交後的變更。
      - Expect: 只有標記與記錄者變動。
    - [ ] **小數位與規格一致** `[acceptance]`
      - Action: 對照規格的小數位表，審查 `git log --grep <子項 ID>` 列出的變更。
      - Expect: 每一列都有對應實作與測試。

- [ ] **3. 人工驗收**
  Depends on: 1.
  Outcome: 使用者接受這項修改。
  Checks:
    - [ ] **設定分頁的小數輸入** `[manual]`
      - Action: 開啟 [Apps 設定分頁](http://127.0.0.1:8015/demo/apps/)，輸入 1.25 並離開欄位。
      - Expect: 顯示 1.25，越界時有提示。
      - Reason: 操作感受由使用者判。
```

記錄者欄位的名稱與位置在實作時決定，見〈實作項目〉第 1 項。

## 命令

scope 預設是目前所在的專案，只有需要時才另外指定。

```text
/task-progress-items                       評估目前專案，建立項目
/task-progress-items <指示>                 把使用者說的一件事寫成項目
/task-progress-items run [卡片或項目代號]    執行
/task-progress-items accept [卡片或項目代號] 驗收
/task-progress-items auto                  評估、執行、驗收全部做
```

- 「指示」是一句描述具體工作的話，例如「修正 NumericField 越界時沒有提示」。agent 判斷它屬於哪張卡，在那張卡新增項目並寫好 checklist，只處理這一件。不帶參數時則由 agent 評估整個專案，自己找出要做的事。
- 在指示前加 `self`、`manual`、`cross` 或 `cross manual` 可以強制驗證方式，例如 `/task-progress-items cross 修正 X`。平常不加。

### 驗證方式

| 方式 | checklist 內容 | 需要的 session |
|---|---|---|
| `self` 自驗 | 只有不標的檢查 | 1 |
| `manual` 人工 | 不標＋`[manual]` | 1，另加使用者 |
| `cross` 他驗 | 不標＋`[acceptance]` | 2：規劃兼驗收、執行 |
| `cross manual` 他驗＋人工 | 三種都有 | 2，另加使用者 |

### 驗證方式的判斷依據

沒有指定時，agent 依下列依據替每一項選擇：

- 結果有只有使用者能判斷的部分（外觀、操作感受、要在使用者裝置上確認）→ 加人工。
- 需求容易被理解錯：要從規格推導實作，或改動已發布的規格、設計資料、案例、程式碼 → 加他驗。
- 其他 → 自驗。

### `run` 與 `accept` 處理哪些項目

- `run`：綁定 checklist、執行者的檢查還沒全部完成的項目。跳過沒有綁定 checklist 的一般項目、別的 session 正在做的項目、卡在 `[!]` 等使用者處理的項目，以及這個 session 自己寫了 `[acceptance]` 條件的項目。
- `accept`：執行者的檢查已完成、`[acceptance]` 還沒完成的項目，跳過自己是執行者的項目。
- 順序：優先級高的先做，同優先級依卡片在 Report 中的順序。一項做完並提交後才做下一項；遇到需要使用者處理的 `[!]` 就停在那一項，其他項目照常進行。

### 一次處理多個項目

| 情況 | 做法 |
|---|---|
| 指定一個項目代號 | 在目前的 session 直接做 |
| 多個項目，能開子 session | 每項開一個子 session；同一個 scope 一次一個，收到前一個完成的通知才開下一個；不同 scope 可以同時 |
| 多個項目，不能開子 session，`run`／`accept` | 做完一項就停，列出下一個候補，等使用者說繼續 |
| 多個項目，不能開子 session，`auto` | 一路做下去；遇到他驗項目停下，請使用者開新 session 以 `run` 接手 |

同一個 scope 不同時開多個子 session，是因為每一項都會改同一份 `report.json`、handoff 與程式碼，同時寫會互相覆蓋或混進對方的提交；各自開工作目錄（worktree）則本機服務看不到進度，合併時 `report.json` 也幾乎必定衝突。子 session 由父 session 依序開啟、收集結果，最後給使用者一份簡短回報。有些宿主開子 session 需要使用者在畫面上確認一次。

## 規則

### 寫入與記錄者

- 不標的檢查照現行做法，由執行者直接編輯檔案記錄。
- `[acceptance]` 與 `[manual]` 的結果只經 CLI（`checklist request`，帶 actor 與 session）或面板寫入。寫入時檢查權限：
  - `[acceptance]`：session 與執行者相同時拒絕；使用者經面板寫入時先確認。
  - `[manual]`：agent 只能寫 `[!]`，且必須附 `Observed`。
- `[acceptance]` 的結果寫入時同時記下記錄者。驗證時，有 `[x]`／`[!]` 卻沒有記錄者的 `[acceptance]` 會讓整份 checklist 不通過，指出行號；這擋的是執行者順手把它打勾。
- 執行者的身分取自綁定這份 checklist 的 Report 子項：最後一筆 `started`／`takeover` 的 session。checklist 沒有綁定子項時，標籤檢查一律拒絕寫入。

### 依賴鎖

`[acceptance]` 與 `[manual]` 所在工作項目的 `Depends on` 由 CLI 與面板強制：依賴的工作項目還沒全部 `[x]` 時，拒絕寫入結果。這也保證「`[manual]` 在執行者完成後才加入、才開始驗」。

### 內容凍結

- 不標的檢查與 `[acceptance]`：記過結果後凍結標題、`Action`、`Expect`（現行規則）。
- `[manual]`：記過結果後仍可修改或新增。內容一改，原結果失效，該項改為 `[!]` 並在 `Observed` 寫明改了什麼；新增的檢查從 `[ ]` 開始。

### 撰寫者不得執行

選了他驗時，撰寫 `[acceptance]` 條件的 session（Report 子項的 `created`）不得開始執行：Report CLI 在該子項設為 `in_progress` 或 `takeover` 時，比對 `created` 的 session，相同就拒絕。撰寫者可以擔任驗收者。

### 子項狀態

- 執行者開始時把子項設為 `in_progress`。
- 含標籤檢查的子項，Report CLI 拒絕手動設為 `done`；由完成整份 checklist 的那一次標籤寫入，把子項設為 `done`，活動紀錄記為記錄者的事件。只有不標檢查的子項（自驗），照現行做法由執行者設 `done`。
- 驗收者寫結果不改變子項的執行者紀錄（不經 `takeover`）。

### 驗收者要知道驗什麼

- 選了他驗時，執行者每個提交訊息都帶子項 ID，驗收者以 `git log --grep <子項 ID>` 找出變更。
- 他驗工作項目的第一個檢查固定是「驗收條件未被改動」：以 git 確認 `[acceptance]` 檢查的內容自規劃者提交後沒有被改。

### 驗收不通過

- 驗收者記 `[!]` 與 `Observed`，子項顯示「需處理」。
- 執行者修正並提交，不新增工作項目。
- 驗收者重跑失敗的檢查，通過時改 `[x]`，保留 `Observed` 並加上 `Resolved`。驗收者若自己動手修正，就成了執行者，須以 `takeover` 接手子項，交給另一個 session 驗收。
- 修正改到 `[manual]` 已驗過的內容時，執行者把那幾項標 `[!]`，請使用者再驗。

## 面板與 Viewer

- Checklist 面板：顯示每項的標籤與記錄者；依賴未完成時鎖住；`[acceptance]` 可點，但先跳出確認；提供「只顯示我能操作的檢查」。
- Report 子項狀態：執行中、待他驗（執行者的檢查完成、`[acceptance]` 未完成）、待人工（`[manual]` 未完成）、需處理（任何 `[!]`）、完成。待他驗與待人工可以同時成立。

## 取代的現行規則

實作完成後，以下現行規則改寫或刪除：

| 現行規則 | 所在 | 改為 |
|---|---|---|
| `[manual]` 檢查必須另開檔案，每個頁面一份，各綁一個子項；agent 那一輪完成後才建立，檔案存在就代表可以開始人工驗收 | checklist-round 的 Manual checklists；agent-executable-items 的 Run an item 第 5 步 | `[manual]` 放在同一份 checklist 的工作項目裡，用依賴鎖控制開始時機 |
| 使用者正在操作的工具，能看到整個 `Expect` 時可以代記人工結果 | checklist-round 的 Recording manual results | agent 一律只能記 `[!]` |
| 改動規格或程式碼的項目由另一個 agent 審查 diff，結果寫在 handoff | agent-executable-items 的 Run an item 第 4 步 | 刪除；需要時選他驗 |
| 觸發表按意思比對短語 | agent-executable-items 的 Trigger phrases | 以 `/task-progress-items` 與參數觸發 |
| 執行佇列在同一個 session 依序跑完所有 🤖 項目 | agent-executable-items 的 Trigger phrases | 依〈一次處理多個項目〉開子 session 或逐項停下 |

既有的 checklist 與子項不遷移，維持建立時的形式。

## 已知限制

- 身分是自報的：actor 與 session 由請求帶入，只能擋住誠實的失誤，擋不住刻意冒用。
- 不標檢查由執行者直接編輯檔案，系統不知道是誰勾的；`[manual]` 被 agent 直接改成 `[x]` 時也無法察覺，這兩點與現況相同。
- 驗收者直接修改程式而不接手子項時，系統看不出來。
- 同一個模型換 session 驗收，仍可能帶著同樣的理解偏差；他驗的效果主要來自規劃時寫好的條件。

## 實作項目

對應 Report agent-workflow 卡的子項：

1. `checklist-acceptance-chain`：checklist 格式。登記 `[acceptance]`，未登記的標籤拒絕；`[acceptance]` 記錄者欄位；依賴鎖的驗證；`[manual]` 內容修改的規則；`checklist validate` 對應錯誤。
2. `acceptance-checklist-write`：標籤寫入。`checklist request` 帶 actor／session；從綁定子項取得執行者；`[acceptance]` 與 `[manual]` 的權限；完成時把子項設為 `done`。
3. `acceptance-report-cli`：Report CLI。撰寫者不得執行；含標籤檢查的子項不可手動設 `done`。
4. `acceptance-checklist-panel`：Checklist 面板。標籤與記錄者顯示、依賴鎖、`[acceptance]` 覆寫確認、只顯示我能操作的檢查。
5. `acceptance-viewer-states`：Report 子項狀態（待他驗、待人工、需處理）。
6. `acceptance-skills`：skill。改寫 checklist-round 與 agent-executable-items（依〈取代的現行規則〉）；新增 Claude skill `/task-progress-items`（命令、判斷依據、佇列範圍、子 session）；他驗提交訊息帶子項 ID。
7. `acceptance-flow-trial`：端到端試跑。

## 驗收

- `checklist validate`：未登記的標籤、沒有記錄者的 `[acceptance]` 結果、依賴未完成就有標籤結果，都回非零並指出行號。
- 寫入：與執行者同 session 寫 `[acceptance]` 被拒；agent 寫 `[manual]` `[x]` 被拒、寫 `[!]` 沒有 `Observed` 被拒；依賴未完成時寫入被拒；未綁定子項時寫入被拒；使用者經面板改 `[acceptance]` 會先確認。
- Report CLI：撰寫者的 session 開始執行被拒；含標籤檢查的子項手動設 `done` 被拒；完成 checklist 的那次寫入讓子項變成 `done`。
- 面板與 Viewer：五種子項狀態各自正確顯示；「只顯示我能操作的檢查」對使用者只留 `[manual]` 與 `[acceptance]`。
- 試跑：以「他驗＋人工」實際做一個小項目，三個 session 分別撰寫、執行、驗收，途中讓一項 `[acceptance]` 與一項 `[manual]` 各標一次 `[!]` 走完修正流程。

## 未決事項

無。
