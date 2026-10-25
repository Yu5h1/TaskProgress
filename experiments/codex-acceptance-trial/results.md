# Codex 共用任務 skill 試跑結果

本輪由使用者明確呼叫 task-progress auto 處理 codex-workflow-trial。條件與綁定先在 5028820 提交，執行者為 codex:365a4d62-02ee-4e28-9da7-63783c089d24；獨立驗收 agent 為 codex:887a8491-503f-416d-862a-6cba624dd45e。同一 scope 逐段交接，沒有同時寫入。

## 六情境結果

| 情境 | 觀察到的推算狀態 | 結果 |
|---|---|---|
| 自驗 | not_started → in_progress → done | self.txt 精確一行 self ok；認領後檢查、提交、釋放 |
| 人工 | not_started → in_progress → awaiting_user → done | manual.txt 正確；使用者已在面板記錄通過（2026-10-22 21:45:40 +08:00） |
| 他驗 | not_started → in_progress → awaiting_acceptance → done | 三欄位 JSON 正確；獨立驗收提交 85d996c |
| 他驗加人工 | not_started → in_progress → awaiting_acceptance → awaiting_user → done | 寫入時間與內容時間相差 0.004087 秒；他驗後，使用者已在面板記錄通過（2026-10-22 21:45:47 +08:00） |
| 條件不符 | awaiting_acceptance → conditions_to_revise → awaiting_acceptance → done | 先依規格產生 3，原驗收條件為 2；驗收者以 reason=condition 退回，ff20814 提交「條件修訂」，原驗收者在 c31e330 通過 |
| 等待 | waiting → not_started → in_progress → done | 前置他驗通過前 waits.txt 不存在；通過後才建立一行 waited |

條件修訂後，原失敗結果的 validity=fingerprint、effectiveStatus=pending；原驗收者重驗時保留 Observed、補上 Resolved，並由 CLI 重新記錄指紋。每份 checklist 都通過格式驗證，Report 驗證 ok=true。

## 權限拒絕

以下三次請求均回 type=error、code=invalid_request，CLI exit code 為 0；逐次比較檔案 SHA-256 確認未寫入：

- 執行者為 codex-trial-cross 寫 acceptance passed：驗收者不能是執行過這個子項的 session。
- agent 為 codex-trial-manual 寫 manual passed：只有使用者能標記通過。
- 他驗尚未通過時為 codex-trial-cross-manual 寫 manual failed：acceptance 尚未全部通過，manual 還不能記錄結果。

## 使用者層入口

建立 C:/Users/Yu5h1/.agents/skills/task-progress/SKILL.md，內容與 capabilities 模板逐字一致，只有路由；重複檢查保持雜湊不變。獨立 agent 啟動時的技能清單自動出現使用者入口（r0），也出現專案共用來源（r11）；兩個同名項目的來源已明確記錄，未自行移除任何入口。

實際以 Web 為工作目錄唯讀執行 report get，scope_id 為 yu5h1lib-web；入口仍解析到 TaskProgress 的共用來源，沒有改寫 Web report。

## 獨立驗收資格與收尾

依更新後 task-progress § Independent acceptance 與 AcceptanceChainPlan〈獨立驗收上下文〉核對：本輪驗收 agent 以 fork_turns="none" 啟動，未繼承父對話歷史，也未參與項目建立、實作或條件修訂；它自行對照原始規格與提交紀錄，並曾以條件不符退回。因此它符合獨立驗收上下文要求，無須另開 Codex chat；UUID 只記錄身分，並不作為獨立性的證明。

新增的「釋放使舊通過結果失效」規則讓 codex-trial-condition 的第一筆驗收顯示 validity=released、derived_state=awaiting_acceptance。原獨立驗收者依新規範重新檢查原始規格與提交紀錄，以相同穩定身分透過 CLI 記錄，提交 b75bba0；兩項 acceptance 均為 validity=valid，子項恢復 done。既有 Observed 與 Resolved 保留，沒有修改驗收標準或產物。

六個試跑子項現在全部 done，兩筆人工結果的記錄者均為 user；Report 卡片完成。本卡沒有待驗收事項。

## 驗證限制

- Codex 命令選單在原 session 的熱載入未驗證；新 agent 的自動發現已驗證。
- 本輪用既有 Debug DLL 經 dotnet 呼叫 CLI；Build/win-x64 的 WinExe 在先前沙箱內讀取未回傳，不以本輪 DLL 測試代表發布版驗證。開啟卡片另以已發布 EXE 的 open 命令經既有 Tray 執行。
- 子 agent 的沙箱 scope registry 不包含註冊資料，改用 report get 的既有 folder 參數；未修改 registry。
- 只執行此卡片的定向試跑，沒有執行全 scope auto 評估、run 的逐項子 session 排程、接手或 disputed 分支。
- 原先人工面板檢查已由使用者透過 [Codex 試跑卡片](http://127.0.0.1:8001/?scope=task-progress&pin=codex-workflow-trial) 記錄通過；本輪核對有效結果，不替使用者操作或重寫人工紀錄。
