# 工時估算與交付期限解耦計畫

> 狀態：隔離 Demo 與正式 Viewer 均已完成；完整期限模式及無 sidecar 模式保持相容。

## 正式上線里程碑（2026-07-24）

- production `time-model.js` 已把工程估算核心錯誤與期限 capability 錯誤分開。
- 無 deadline 時正式 Viewer 顯示中性的「交付日未定 ›」，保留 project/task/item 工時、工作進度、來源、信心、校準與公式。
- 缺少期限時不建立風險燈號、倒數、容量面板或 deadline runtime；期限區塊部分無效時只隔離期限並留下診斷。
- `task-progress analyze` 已能產生 estimate-only 或完整 deadline 快照；`open`／`start` 發現任一時間輸入時會自動刷新。
- Node 與 .NET 整合測試覆蓋 estimate-only、部分無效期限、完整期限、公開容量標籤與私密 reason 隔離。

## Demo 展示里程碑（2026-07-24）

隔離的 `experiments/time-reference/demo/` 先完成以下可展示版本，之後已同邏輯提升至正式 Viewer：

- `情境` 選單預設為「交付日未定」，可切回完整的 `8/1 交付` 模式比較。
- 時間資料政策分開回傳估算核心狀態與 deadline capability；缺少 deadline 是正常狀態，期限只填一半時保留工程估算並隔離期限錯誤。
- 無期限時保留 project、task、item 工時與估算細節，隱藏倒數、容量、時間進度、風險公式及燈號。
- Demo 加入穩定項目 `decouple-estimates-from-deadline`，估算 `12 hr`，整體示例工程總工時為 `56 hr`。
- `?time=none` 的無 sidecar 降級與完整 deadline 模式維持原行為。

這個里程碑先證明介面與資料能力拆分可行；其結果現已依本文後續順序移植至 production `time-model.js`、`time-view.js` 與正式載入流程。

## 目標

工程所需工時與交付期限是兩種獨立資料。沒有截止日時，TaskProgress 仍應顯示 item、task 與 project 的工時估算；只有依賴交付日期的容量進度與風險燈號停止計算。

第一版未設定截止日時，專案標籤固定顯示：

```text
交付日未定 ›
```

這個狀態不顯示綠／黃／紅燈號，避免把「尚未設定期限」誤解為安全或危險。

## 顯示規則

| 可用資料 | 專案標籤 | 可顯示內容 | 不顯示內容 |
| --- | --- | --- | --- |
| 沒有時間 sidecar | 不顯示 | 原本的進度報告 | 所有時間資訊 |
| 有工時、沒有截止日 | `交付日未定 ›` | 工程總工時、未完成工時、task/item 工時、來源、信心與公式 | 倒數、時間進度、剩餘期限容量、風險燈號 |
| 有工時及有效截止日 | `M/D 交付 ● ›` | 完整工程估算、容量與期限風險 | 無 |
| 工時有效、截止日區塊無效 | `交付日未定 ›` 並顯示診斷 | 有效的工程估算 | 無效期限及其衍生結果 |

沒有截止日的進度報告先顯示：

- 工程總預估工時。
- 依目前工作進度衍生的預估未完成工時。
- `交付日期：交付日未定`。
- 最後估算或狀態回報時間。

展開詳細資訊後只顯示可成立的工程估算內容。期限流程、壓力公式與交付前容量不以空值占位；未來若容量設定獨立於期限，再另行開放無截止日的容量頁。

## 資料契約

Draft 0.2 的 `summary.deadline` 在 Schema 中已是選用欄位，第一階段不升級 Schema，先讓正式 Viewer 遵守既有契約。

時間分析拆成兩個驗證層級：

1. **工程估算核心**
   - `scope_id`、method、summary、calibration、總工時、composition、tasks 與 items。
   - 核心無效時，整個時間介面不載入。
2. **選用期限分析**
   - `deadline`、schedule、capacity timeline、progress pressure、boundary state 與 urgency。
   - 欄位不存在時是正常的「交付日未定」。
   - 欄位存在但無效時，只忽略期限功能並留下診斷，不丟棄有效工程估算。

`work_progress_ratio` 不再只能從 `summary.deadline` 取得。Viewer 優先使用目前 `report.json` 工作項目計算出的進度；發布快照中的期限進度只用於重現與交叉檢查。

未完成工時維持確定性公式：

```text
unfinished_minutes
= calibrated_total_minutes × (1 - current_work_progress_ratio)
```

它不依賴交付日期、容量時間線或風險門檻。

## Viewer 解耦

目前時間 controller 在初始化、摘要按鈕、未完成工時計算、dialog、容量編輯與 refresh 都直接存取 `summary.deadline`。修改時分成三種能力：

- `estimateAvailable`：控制 task/item 工時及工程估算面板。
- `deadlineAvailable`：控制交付日期、倒數、風險燈號與期限公式。
- `capacityTimelineAvailable`：控制交付前總容量、剩餘容量及本機容量重算。

預定調整：

1. `validateTimeAnalysis` 回傳核心錯誤與期限錯誤，不再把期限缺省視為整份 sidecar 無效。
2. controller 先掛載工程估算，再依能力決定是否建立 deadline runtime。
3. `remainingWorkload` 改接收獨立的工作進度，不再接收 deadline。
4. 摘要按鈕新增中性的 `undated` 樣式，只顯示「交付日未定 ›」。
5. 沒有有效期限時，不執行 `calculateDeadlineRisk`、每分鐘 risk refresh 或容量時間線重建。
6. task 總工時與穩定 item 工時不受期限存在與否影響。
7. 本機容量編輯第一階段仍只在有效 deadline schedule 存在時開放，避免把容量資料臨時塞進不相容位置。

## 相容策略

- 現有包含完整 deadline 的 Draft 0.2 sidecar 顯示與算法保持不變。
- 沒有 `time.analysis.json` 的舊報告保持完全不顯示時間介面。
- 新的 estimate-only sidecar 可省略 `summary.deadline`。
- `?time=none` 仍明確停用所有時間功能。
- `report.json` 的舊版字串 item 仍可顯示基本進度；只有具穩定 `{id, title}` 的 item 才掛載 item 工時。
- 靜態網站仍只在瀏覽器重算有效期限的風險，不執行 AI 或重新估算工程工時。

## 驗證案例

至少新增以下測試：

1. estimate-only sidecar 通過驗證並建立工程工時索引。
2. 無 deadline 時顯示「交付日未定 ›」，且 DOM 中沒有風險燈號。
3. 無 deadline 時 task/item 工時與工程估算面板仍可使用。
4. 未完成工時使用目前 report 進度計算。
5. 無 deadline 時不呼叫 deadline risk engine。
6. deadline 存在但無效時保留工程估算並產生期限診斷。
7. 完整 Draft 0.2 sidecar 的現有交付膠囊、三個 tab、容量編輯與每分鐘更新保持不變。
8. 完全缺少 sidecar 時保持原始 Viewer，沒有空白按鈕或時間占位。
9. 桌面與行動版的「交付日未定」膠囊均不溢出，鍵盤可開啟工程估算面板。

## 實作順序

1. 先修改時間資料驗證與 capability 結果，補模型測試。
2. 解耦未完成工時及 controller 初始化。
3. 加入「交付日未定」摘要與無期限面板。
4. 隔離 deadline refresh、風險與容量編輯。
5. 補完整／缺省／部分無效三種 sidecar 的回歸測試。
6. 更新範例、TaskProgress report skill、README 與 handoff。

## 完成條件

- 沒有截止日的有效工程估算不再被 Viewer 忽略。
- 主畫面清楚顯示「交付日未定」，且沒有風險色。
- 工時、來源、信心、公式與穩定 ID 仍可查看。
- 所有期限衍生值只在有效 deadline 存在時出現。
- 目前完整期限模式及沒有時間資料的舊模式均通過回歸驗證。
