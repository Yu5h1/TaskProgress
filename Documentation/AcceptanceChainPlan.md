# 他驗流程：`[acceptance]` 串接驗收 checklist

> Task ID: checklist-acceptance-chain

Report：task-progress › agent-workflow › checklist-acceptance-chain。

```text
規劃者（session A）寫兩份 checklist 與兩個子項
├─ 執行 checklist：執行者的檢查 ……，最後一個工作項目只放 [acceptance] → 綁定驗收 checklist
└─ 驗收 checklist：驗收條件（從原始需求推導，不是從執行步驟推導）

執行者（session B ≠ A）勾完自己的檢查 → 執行 checklist 顯示「待驗收」
驗收者（session C ≠ B）勾完驗收 checklist → [acceptance] 讀取時推導為 [x] → 兩個子項完成
驗收有 [!] → [acceptance] 推導為 [!] → 退回執行者修正 → 驗收者重跑該項
```

## 為什麼

Agent 自己寫步驟、自己執行時，交給更高階的模型驗收後，約兩成項目是做錯或沒對齊需求意圖（不是沒做）。由更強的模型先寫好步驟再交給 agent 執行，幾乎完全正確，偏差出在把意圖轉成步驟的那一段。Report 目前不分「已執行」與「已驗收」，做錯的項目看起來和完成的一樣。沒有畫面的項目（重構、文件、skill、資料格式）沒有任何驗收關卡；通過 UX 驗收也不代表實作對齊規格。

## 已決定

2026-10-21 使用者核准：

1. 狀態分「已執行」與「已驗收」，只有已驗收才算完成。
2. 驗收條件在規劃階段定下，由寫步驟的人附上，從原始需求推導。
3. 兩份 checklist 串接：執行者的 checklist 保留，最後一項連到另一份驗收 checklist；驗收 checklist 的內容就是第 2 點的驗收條件，不能由執行者撰寫。
4. 驗收者必須和執行者不同；UX 驗收的 actor 是使用者。（判定單位由第 12 點取代）
5. 沒有 UX 畫面的項目：能自動檢查的就自動檢查，其餘由另一個 agent 對照驗收條件審查。
6. 驗收不通過時退回執行者修正，修正後重新送驗收。
7. TaskProgress 清楚區分已執行和已驗收；使用者只需要看兩類：要他做 UX 驗收的，以及驗收沒通過的。

2026-10-22 使用者決定：

8. 仿照 `[manual]` 新增 `[acceptance]` 檢查標記。
9. `[acceptance]` 禁止 agent 與人工標記狀態；狀態由它綁定的另一份 checklist 決定。
10. 驗收 checklist 的 actor 不能與執行者相同。
11. Report 或 checklist 開啟時讀取結果。
12. 「不同 actor」以 session 為單位（AC-01）：不同 session 即算不同，人工（使用者）也算不同，不同機器當然不同。
13. UX 人工驗收維持現行人工 checklist，不走 `[acceptance]`（AC-02）。`[acceptance]` 串接是人工二次流程的同一個形狀，多了綁定。
14. 串接是進階的「執行＋驗收」流程。高階模型多半能在執行階段自行驗收通過，所以現行流程保留；工作流是選項，以短語觸發，未來可能有更多變體。
15. 兩套流程名為「自驗流程」與「他驗流程」，未來的變體也以它和既有流程的差別命名（AC-03）。
16. 他驗流程由使用者以短語指定，在既有短語加流程名，例如「寫成他驗可執行項目」「請評估 <scope> 並建立他驗可執行項目」。評估時 agent 可在報告中點名建議改用他驗的項目，不自行套用（AC-04）。
17. 改動已發布規格、設計資料、案例或程式碼的項目，自動使用他驗流程，取代現行「另一個 agent 審查 diff、結果寫在 handoff」的做法（AC-05）。這是第 16 點唯一的例外：依項目內容套用，不由 agent 判斷。

## 工作流選項

| 流程 | 做法 | 何時使用 |
|---|---|---|
| 自驗流程 | 一份 checklist，執行者自己跑完全部檢查 | 不指定時；只改文件、skill 等不屬於第 17 點的項目 |
| 他驗流程 | 規劃時寫兩份 checklist，執行 checklist 以 `[acceptance]` 綁定驗收 checklist，由另一個 session 驗收 | 使用者以短語指定，或項目屬於第 17 點 |

- 一個項目用的是哪一套，看它的 checklist 有沒有 `[acceptance]` 就知道，Report 不另加欄位。
- 既有項目不遷移，維持建立時的流程。
- 「寫成可執行項目並執行」只適用自驗流程（見〈撰寫者不得執行〉）。

## 設計

以下細節依現有實作或已決定事項推導，各附依據。

### 標記與語法

```markdown
- [ ] **3. 驗收**
  Depends on: 1, 2.
  Outcome: 另一個 session 依驗收條件確認本輪結果。
  Checks:
    - [ ] **驗收清單通過** `[acceptance]`
      - Action: 依 [NumericField 驗收條件](/checklist/?scope=ux&task=numericfield-goal-1-acceptance) 逐項驗收。
      - Expect: 驗收清單每一項都是 [x]。
      - Accepted by: `numericfield-goal-1-acceptance`.
```

- 標記寫在檢查標題後，與 `[manual]` 同位置，兩者互斥。依據：`ChecklistDocument` 以同一個 regex 尾端可選群組辨識 `[manual]`，加一個互斥群組改動最小。
- `[acceptance]` 只能放在執行 checklist 最後一個工作項目，這個工作項目只含 `[acceptance]` 檢查，並以 `Depends on` 依賴其他全部工作項目；validate 檢查這三點。依據：與「`[manual]` 不和 agent 檢查並列」同理，混在一起就無法判斷「其餘檢查已完成、只差驗收」。
- 綁定欄位 `Accepted by` 只寫 `<stem>`，指向同一 scope 的 `checklists/<stem>.checklist`，緊接在 `Expect` 之後（`[acceptance]` 沒有 `Reason`）。依據：驗收子項與執行子項在同一張卡，同一張卡只屬於一個 scope；限定同 scope 也避開跨 repository 寫入與 scope 登記查詢，桌面編輯器只讀相鄰檔案即可推導。
- `Action` 放驗收清單的連結供人點過去；推導只讀 `Accepted by`，不解析連結。
- 一個執行 checklist 可有多個 `[acceptance]`，各自綁定一份驗收 checklist。

### 狀態只在讀取時推導

- 檔案中 `[acceptance]` 的標記必須維持 `[ ]`。`checklist validate` 與載入遇到 `[x]`／`[!]` 時拒絕整份文件並指出行號。依據：agent 直接編輯 `.checklist` 文字，沒有 CLI 關卡可攔；讓錯誤標記變成看得見的載入錯誤，比默默忽略更容易被發現。
- 推導：綁定的驗收 checklist 每項 `[x]` → `[x]`；任一 `[!]` → `[!]`；其他（含檔案不存在、無法解析）→ `[ ]`，並在載入結果附上原因。
- 推導在 C# `ChecklistDocument` 載入時完成，Browser checklist、桌面編輯器、`checklist validate` 與 Report 的文件綁定都經過這一層，結果一致。依據：Report 的 `document-binding.js` 已依載入結果的 checks 計算完成度，推導放在來源端就不必在 Viewer 另寫一份。
- 不允許巢狀：驗收 checklist 不得含 `[acceptance]`，validate 拒絕。依據：目前沒有多層驗收的需求，禁止可直接排除循環綁定。

### 寫入禁止

- `[acceptance]` 不屬於 manual，`ApplyManualResults` 已拒絕非 manual 檢查的寫入；Browser 與桌面 UI 把它顯示為唯讀，與 agent 檢查相同。
- 「清空結果」不寫入 `[acceptance]`（檔案中本來就是 `[ ]`）。

### 驗收 checklist 有自己的 Report 子項

- 驗收 checklist 依 checklist-round 的 Report binding 綁定自己的子項，與執行子項在同一張卡。依據：每一輪都要綁子項才看得到（checklist-round § Report binding）；驗收者需要可認領的項目，認領才會留下 actor 與 session 紀錄（`ItemActivityLog`）。
- 驗收子項標題以「驗收：」開頭，不另加圖示；兩份都是 agent checklist，Viewer 照常顯示 🤖。
- 驗收 checklist 的 `Current round` 與執行 checklist 指向同一份規格段落：兩者驗的是同一個需求。
- 驗收 checklist 只放 agent 檢查。使用者親自判斷的部分走人工 checklist（第 13 點）。

### 子項狀態的生命週期

Report 的 `status` 是儲存值，時間分析、`report get` 與進度統計都讀它；Viewer 的文件綁定投影只影響畫面。所以儲存值不能比驗收先變成 `done`。

- 執行者完成自己的檢查後，執行子項維持 `in_progress`，不設 `done`。
- 驗收者把驗收子項設為 `done` 時，Report CLI 在同一次寫入把執行子項也設為 `done`，活動紀錄記為驗收者的 `accepted` 事件。依據：只有這個時點兩者同時成立；交給執行者回來改，執行者的 session 可能已經結束。
- 驗收不通過時兩個子項都維持 `in_progress`。修正者若不是原執行者，以 `takeover` 接手執行子項，之後的身分比對以新的執行者為準。

### 撰寫者不得執行

驗收條件不能由執行者撰寫（第 3 點），所以建立這兩個子項的 session 不得成為執行者：Report CLI 在執行子項設為 `in_progress` 或 `takeover` 時，比對驗收子項 `created` 的 session，相同就拒絕。撰寫者可以擔任驗收者。

### 執行者與驗收者不同

Checklist 檔不記錄是誰標記的，能核對身分的只有 Report 子項的活動紀錄。

- 執行者：執行子項最後一筆 `started`／`takeover` 的 actor 與 `session_id`。
- 判定以 session 為單位（第 12 點）：`session_id` 不同即視為不同 actor；actor 為 `user`（Viewer 的人工操作）一律視為不同。
- 他驗流程的每個寫入都必須帶 `session_id`。沒有內建 session ID 的工具，在 session 開始時自行產生一個 UUID 並全程沿用。缺少時沿用既有 `claim_unverified` 拒絕。
- Report CLI 在驗收子項的 `item.update`（`in_progress`、`done`）與認領時，找出綁定它的執行 checklist（掃描同 scope 的 `Accepted by`），比對執行子項的執行者；相同時拒絕，回傳新錯誤碼。執行子項沒有 `started` 紀錄時同樣拒絕。
- 執行 checklist 中 `[acceptance]` 以外的檢查還沒全部 `[x]` 時，驗收子項不可設為 `in_progress`。
- 「請執行 <scope> report 的可執行項目」的佇列跳過自己是執行者的驗收子項，也跳過自己撰寫的執行子項。

### 驗收者要知道驗什麼

驗收 checklist 在執行前寫好，寫不出執行者會改哪些檔案。

- 他驗流程中，執行者的每個提交訊息帶執行子項 ID；驗收者以 `git log --grep <item-id>` 找出要審查的變更。
- 驗收 checklist 的第一個檢查固定為：確認驗收 checklist 自建立後只有標記變動。以 `git log -p` 檢查該檔，撰寫者提交之後若有人改了 `Outcome`、`Action` 或 `Expect`，記 `[!]`。依據：checklist-round 只在第一個結果寫入後凍結內容，執行者在驗收開始前仍能改寫驗收條件，而系統無從阻擋。

### 退回循環

- 驗收者記 `[!]` 與 `Observed`，`[acceptance]` 推導為 `[!]`，執行子項顯示驗收未通過。
- 執行者修正並提交；執行 checklist 不新增項目（`Expect` 沒變，依 checklist-round 第 8 條）。
- 驗收者重跑失敗的檢查，通過時改 `[x]` 並保留 `Observed`、加上 `Resolved`（既有 agent 檢查規則）。驗收者若自己動手修正，就成了執行者，必須以 `takeover` 接手執行子項，並交給另一個 session 驗收。

### Viewer 呈現

- 文件綁定的評估結果增加「已執行」：除 `[acceptance]` 以外全部 `[x]`、`[acceptance]` 仍是 `[ ]`。子項顯示「待驗收」標示，與已完成、未開始區隔。
- 驗收未通過（`[acceptance]` 推導為 `[!]`）沿用既有失敗呈現，列入使用者要看的那一類。

### 快取

服務的 checklist 載入快取目前只以該檔自己的 `(mtime, size)` 為鍵。執行 checklist 的結果依賴驗收 checklist，只改驗收檔時，快取會繼續回傳舊結果。快取鍵要加入每個 `Accepted by` 目標的指紋，沿用 Decision 載入已有的 `sources_fp` 做法；寫入驗收 checklist 時，也要讓指向它的執行 checklist 快取失效。

## 已知限制

- 身分是自報的：actor 與 session 由請求帶入，只能擋住誠實的失誤，擋不住刻意冒用。
- 驗收條件是否真的從原始需求推導，系統無從核對，只能靠 skill 規則與撰寫者不得執行。
- 驗收者直接修改程式而不接手執行子項時，系統看不出來。
- 同一個模型換 session 驗收，仍可能帶著同樣的理解偏差；他驗流程的效果主要來自規劃時寫好的驗收條件。

## 實作順序

1. `ChecklistDocument`：`[acceptance]` 解析、`Accepted by`、檔內標記必須 `[ ]`、只能在最後一個專用工作項目、禁止巢狀、載入時推導；`checklist validate` 輸出推導來源。
2. 服務：快取鍵加入綁定目標指紋與反向失效。
3. Checklist UI（Browser 與桌面共用 `ChecklistApp`）：`[acceptance]` 唯讀，顯示推導狀態與驗收清單連結。
4. Report CLI：驗收子項的執行者比對、撰寫者不得執行、前置條件、驗收完成時一併完成執行子項（`accepted` 事件）、新錯誤碼。
5. Viewer：文件綁定評估加入「已執行」，子項顯示「待驗收」。
6. Skill：checklist-round 加 `[acceptance]` 規則；agent-executable-items 改寫為自驗與他驗兩套流程與觸發短語，第 17 點的項目自動使用他驗，刪除「第二個 agent 驗收後寫在 handoff」；他驗流程的提交訊息帶子項 ID；佇列跳過自己的執行與驗收子項。

## 驗收

- `checklist validate`：`[acceptance]` 檔內非 `[ ]`、缺 `Accepted by`、目標不存在、不在最後的專用工作項目、巢狀、與 `[manual]` 並用，都回非零並指出行號。
- 推導：驗收清單全 `[x]`、含 `[!]`、未完成、檔案缺失四種情況，Browser、桌面、Report 三處顯示一致。
- 只修改驗收 checklist 後重新載入執行 checklist，結果立即更新（快取）。
- Report CLI：與執行者同一 session 認領驗收子項被拒；撰寫者的 session 開始執行被拒；缺 `session_id` 被拒；執行未完成時驗收設 `in_progress` 被拒；不同 session 或 `user` 可正常完成，且執行子項同時變成 `done`。
- Viewer：執行完成、等待驗收的子項顯示「待驗收」；驗收不通過顯示失敗；驗收通過後兩個子項都顯示完成。
- 端到端：以一個實際項目跑完整他驗流程，見 Report 子項 `acceptance-flow-trial`。

## 未決事項

無。AC-01～AC-05 已於 2026-10-22 決定，見已決定第 12～17 點。
