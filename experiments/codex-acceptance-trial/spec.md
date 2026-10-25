# Codex 驗證流程試跑規格

## 範圍

```text
TaskProgress 共用任務 skill
└─ Codex 試跑卡 codex-workflow-trial
   ├─ 六份獨立 checklist
   ├─ 本資料夾內的產物
   └─ report get 狀態、拒絕回覆與人工面板
```

本輪沿用 Documentation/CodexWorkflowTrial.md；不修改 Claude 試跑檔案。驗收條件先提交再執行。自驗與等待採 self；人工採 manual；他驗與條件不符採 cross；他驗加人工採 cross manual，因為這些情境分別測試對應的權限與狀態。

## 自驗試跑

建立本資料夾的 self.txt，只有一行 self ok。認領後 in_progress；檢查通過並 released 後 done。

## 人工試跑

建立 manual.txt，只有一行 manual ok。released 後 awaiting_user；agent 不得代使用者寫 passed。使用者在面板記錄通過後才為 done。

## 他驗試跑

建立 cross.json，恰有三個欄位：name="cross"、decimals=2、rounding="half-up"。released 後 awaiting_acceptance；執行者的驗收請求遭拒且原檔不變；獨立 session 驗收後 done。

## 他驗與人工試跑

建立 cross-manual.txt，第一行 cross manual ok，第二行是寫入當下的 UTC ISO 8601 時間（與寫入時間相差不超過兩秒）。released 後 awaiting_acceptance；他驗尚未全通過前，人工結果寫入遭拒且原檔不變；他驗全通過後 awaiting_user，使用者才確認面板的他驗標籤、記錄者與人工操作。

## 條件不符試跑

建立 condition.txt，只有一行數字 3。初版 checklist 的數值驗收條件故意寫成 2。獨立驗收者回頭對照本節，記錄 reason=condition 後為 conditions_to_revise；建立者修訂同一檢查為 3 並提交「條件修訂」；舊結果指紋失效後為 awaiting_acceptance；原驗收者重驗，保留 Observed 並加入 Resolved，最後 done。

## 等待試跑

等待 codex-trial-cross。他驗項目未完成前，derived_state=waiting 且 waits.txt 不存在；他驗完成後 not_started，才建立 waits.txt，只有一行 waited，執行並 released 後 done。

## 本機入口

確認 C:/Users/Yu5h1/.agents/skills/task-progress/SKILL.md 與 capabilities 模板一致、指向存在的共用來源；再次初始化不改檔。從 Web 工作目錄讀入口時，仍解析為指定的 Web scope；只做唯讀檢查，不寫 Web report。獨立 agent 回報是否在啟動技能清單看見此使用者層入口；未驗證的 UI 選單熱載入如實列出。

## 限制

人工通過只由使用者記錄。未獲人工結果時，兩個 manual 子項保持 awaiting_user，整張卡保留未完成。試跑不覆蓋 run 的逐項子 session 排程、auto 的全 scope 評估、接手或 disputed 分支。
