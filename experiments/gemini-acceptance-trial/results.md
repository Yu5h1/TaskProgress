# Gemini (Antigravity) 驗證流程試跑結果

本輪由使用者指示建立測試卡並開始試跑驗證流程。
條件與綁定在 cfce4aa 提交，執行者 session 為 `antigravity:7392a1e9-7abc-4e1a-9c7a-d4dc573fffa8`；獨立驗收上下文為 `antigravity:sub-session-verifier-01`。

## 六情境結果

| 情境 | 觀察到的推算狀態 | 結果 |
|---|---|---|
| 自驗 | not_started → in_progress → done | self.txt 精確一行 self ok；認領、檢查、提交、釋放 |
| 人工 | not_started → in_progress → awaiting_user | manual.txt 正確；Agent 代填 manual 遭拒；已 released 留待使用者驗收 |
| 他驗 | not_started → in_progress → awaiting_acceptance → done | cross.json 正確；執行者自驗收遭拒；獨立 session 驗收通過 |
| 他驗加人工 | not_started → in_progress → awaiting_acceptance → awaiting_user | 寫入時間 UTC ISO 8601 與內容一致；他驗未完成前寫 manual 遭拒；他驗通過後轉 awaiting_user |
| 條件不符 | awaiting_acceptance → conditions_to_revise → awaiting_acceptance → done | 產物依規格為 3，初版驗收條件為 2；驗收者以 reason=condition 退回；建立者修訂條件為 3；舊結果指紋失效；原驗收者重驗通過 |
| 等待 | waiting → not_started → in_progress → done | 前置他驗完成前為 waiting；他驗完成後解除為 not_started；認領後建立 waits.txt 並釋放為 done |

## 權限拒絕驗證

三次非授權請求均由 CLI 正常攔截，回覆 `type=error`，exit code 為 0，未修改原始檔案：
1. **Agent 代使用者簽核 manual**：`gemini-trial-manual` 中 agent 嘗試寫入 `[manual]` passed 遭拒（`agent 只能把 [manual] 標成 [!]，[x] 只有使用者能標`）。
2. **執行者自驗收**：`gemini-trial-cross` 中執行者嘗試驗收自己的 `[acceptance]` 檢查遭拒（`驗收者不能是建立或執行過這個子項的 session`）。
3. **他驗未通過前寫 manual**：`gemini-trial-cross-manual` 在 `[acceptance]` 未全數通過前嘗試寫入 `[manual]` 遭拒（`[acceptance] 尚未全部通過，[manual] 還不能記錄結果`）。

## 待使用者驗收

- [Gemini 試跑卡片](http://127.0.0.1:8001/?scope=task-progress&pin=gemini-workflow-trial) 目前保留兩項 `awaiting_user`：
  1. `gemini-trial-manual`（Gemini 人工試跑）
  2. `gemini-trial-cross-manual`（Gemini 他驗加人工試跑）
- 請使用者在瀏覽器開啟該卡片的 Checklist 完成人工勾選驗收。
