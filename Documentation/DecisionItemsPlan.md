# 決策項目應用實作計畫

> Task ID: decision-items
>
> 具名 `.decisions` 文件採 JSON 內容，與 Checklist 共用渲染方式；本文為實作契約，驗證與部署狀態見 `../handoff.md`。
> 本文件擁有決策資料與操作契約。共用卡片行為沿用 `CardDisclosurePlan.md`，UI 單一來源原則沿用 `UIConvergenceOneSourcePlan.md`。

## 系統階層與關係

```text
TaskProgress
├─ Report：顯示待決策數量、連到指定任務的決策清單
├─ ChecklistApp：驗收工作項目 → 檢查內容與結果
├─ DecisionApp：決策清單 → 問題、選項、答案與歷史
│  ├─ <名稱>.decisions：具名決策文件，可獨立開啟
│  ├─ Decision session：選擇草稿與提交狀態
│  └─ Decision service／store：驗證、revision、確認、重新開啟
└─ 共用 Svelte 渲染元件
   ├─ CardList／CardDisclosure：列表、排序、可見性、收展
   ├─ FilterStrip／ThemeControl：篩選與外觀
   └─ DialogShell 與共用表單樣式：對話框、輸入及錯誤呈現
```

兩個應用提供各自的資料、卡片內容與 callback，共用元件負責外觀與列表互動。共用元件不解析 .decisions 或 .checklist，也不判斷答案是否有效。

## 目標與範圍

使用者直接打開待決策清單，就能閱讀背景、選擇方案並留下答案，不必每次請 Agent 從對話與文件重新列出未決事項。Agent 接續時讀取同一份資料，將已確認決策落實到其擁有的計畫或程式。

第一版包含單選、建議選項、其他文字輸入、逐項確認、重新開啟與歷史檢視；Report 提供數量與導航。回答者只需選擇或填寫其他方案，補充條件與理由統一寫在「其他」，不另設選擇理由欄。Agent 可直接編寫尚無歷史的新題目；已有歷史的題目由 D-01 的 revise 入口修訂，UI 專注回答。

第一版不含多選、多人投票、條件分支問卷、批次確認、自動執行程式、通知排程或從自然語言自動抽取全部決策。公開 Report 不自動發布決策資料。

## 現有實作與共用邊界

`ChecklistApp.svelte` 已組合 CardList、CardDisclosure、FilterStrip、DialogShell、ThemeControl、SaveBar 等元件，並由 host 注入 transport。卡片內的 MarkerBox、Action／Expect、manual／agent 結果與清空流程仍是 Checklist 專屬。

| 部位 | 決策項目的做法 |
|---|---|
| 列表、卡片標題、收展、排序、可見性 | 直接使用既有 CardList／CardDisclosure |
| 篩選與下一項 | 共用篩選控制；Decision session 決定待決策順序 |
| 內容 | DecisionCardBody 顯示背景、原生 radio 與其他輸入 |
| 狀態 | 顯示待決策／已決策，不能映射成通過／失敗 |
| 確認／重開對話框 | 使用 DialogShell；語意及 callback 由 DecisionApp 提供 |
| 草稿與保存 | Decision session 明確確認才提交，不繼承 Checklist 自動保存答案行為 |
| 主題、間距、輸入樣式 | 使用既有設計 token；相同樣式抽至共用來源 |

不複製整個 ChecklistApp 再改字，也不把它改成到處判斷 `isDecision` 的應用。只有確實重複的頁面結構才抽取小型共用外殼，以 slots／內容插槽組合兩種卡片。A／B／C 是文字選項，不使用工具列 IconChoice 的短按循環語意。

## 獨立格式

Report 由資料夾承載專案或 scope 名稱，因此資料夾內固定使用 `report.json`。Checklist 與決策項目則由個別文件承載名稱，使用 `<名稱>.checklist` 與 `<名稱>.decisions`；決策資料不集中成 scope 根目錄的一份固定 JSON 檔。

建議按任務放置，讓檔名與任務對應：

```text
<scope-folder>/
├─ report.json
├─ checklists/
│  └─ report-cli.checklist
└─ decisions/
   └─ report-cli.decisions
```

一份 `.decisions` 可包含同一任務的多個問題，能以明確路徑獨立開啟，不要求先存在 Report。上述目錄為 Report 整合時的約定；直接開檔以使用者指定的精確文件為準。檔案不存在代表尚未建立，不因查看而建立空檔；檔案無效則顯示錯誤，不能當成零項。

副檔名為 `.decisions`，內部採 UTF-8 JSON，以 `schemas/decisions.schema.json` 驗證。選擇 JSON 是為了明確表達選項 ID、答案、版本與歷史，減少自行定義文字解析規則；Checklist 維持原有 Markdown 語法。渲染元件只接收解析後模型，不依賴副檔名或 JSON 文字。

以下為文件範例。讀取拒絕重複 JSON property、未知欄位及不支援的 schema_version；writer 保留字串內容與陣列順序，以一致縮排及換行輸出，不要求保留原始空白排版。revision 以原始檔案位元組計算。

```json
{
  "schema_version": "1.0",
  "task_id": "report-cli",
  "updated_at": "2026-09-24T10:00:00+08:00",
  "decisions": [
    {
      "id": "report-cli-input",
      "version": 1,
      "question": "Report CLI 第一版提供哪種輸入方式？",
      "context": "批次 JSON 適合 Agent；簡短命令方便手動操作。",
      "source_ref": "Documentation/ReportCliUpdatePlan.md",
      "options": [
        { "id": "batch", "label": "批次 JSON", "description": "一次提交多項修改" },
        { "id": "short", "label": "簡短命令", "description": "一行更新一個目標" },
        { "id": "both", "label": "兩種都提供", "description": "共用同一套修改規則" }
      ],
      "recommendation": {
        "option_id": "batch",
        "reason": "先完成批次契約，可減少第一版入口數量。"
      },
      "allow_other": true,
      "status": "pending",
      "answer": null,
      "history": []
    }
  ]
}
```

- `id` 在文件內唯一；跨文件以文件定位＋decision ID 識別。文件層 `task_id` 是關聯引用，不是另一份任務身分宣告。有 Report 時須對應既有普通任務；獨立決策檔可先存在，未能解析的任務連結須顯示診斷。Report 整合時檔名 stem 與 task_id 不一致須報錯，不猜測關聯。
- option ID 穩定且在該題唯一；A／B／C 由顯示順序產生，答案保存 option ID，不保存字母或索引。
- 第一版至少兩個選項；推薦最多一個，必須引用存在的選項。推薦不代表使用者已選取，初次打開不預選答案。
- `answer` 為互斥型別：`{kind: "option", option_id, confirmed_at}` 或 `{kind: "other", text, confirmed_at}`。其他答案必須允許且去除空白後非空。既有資料的可選 reason 保留相容讀取與歷史顯示；新 UI 不編輯或送出此欄位。推薦選項的 recommendation.reason 仍由出題者提供。
- pending 必須沒有當前答案；decided 必須有合法 answer。後端產生確認時間與歷史事件；未知格式版本及未知欄位由格式驗證拒絕。
- `version` 是題目版本，與整份文件的 revision 不同；變更規則由 D-01 擁有。
- history 保存 confirm／reopen／revise 事件及當時題目、選項與答案快照，供理解舊答案；它是操作紀錄，不宣稱具備不可竄改或使用者身分認證能力。

## 畫面與操作

```text
決策項目                待決策 2／全部 3
[全部] [待決策] [已決策]       收展／排序／可見性

▼ Report CLI 第一版提供哪種輸入方式？    待決策
  背景：批次 JSON 適合 Agent；簡短命令方便手動操作。
  ○ A  批次 JSON（建議）
       一次提交多項修改
  ○ B  簡短命令
  ○ C  兩種都提供
  ○ 其他 [輸入你的方案……]
  [捨棄草稿] [確認決策]
```

1. 預設查看待決策。選項與其他文字先保留在本頁草稿；radio／輸入操作不觸發卡片拖曳、選取或收合。
2. 選擇「其他」後聚焦輸入框；切換回選項保留本頁輸入供再次切換，但提交只送目前選擇的答案。
3. 每題按「確認決策」提交該題，依 D-02 保留其他題草稿。成功才顯示已決策；失敗保留草稿與錯誤，不自動重送；回應不明時依 D-03 查核。
4. 已決策卡顯示答案、時間與歷史；舊資料若有理由仍保留顯示。修改答案先按「重新開啟」，在共用對話框確認後追加歷史並回 pending；不刪除舊答案紀錄，不提供一鍵清空所有答案。
5. 「下一項」先揭露被隱藏的目標、展開卡片並處理篩選，再聚焦問題；參照 Checklist 的揭露行為，不自動選答案或確認。
6. 全體統計取完整資料；隱藏、排序與篩選只影響呈現。沒有 pending 時顯示「目前沒有待決策項目」，仍可查看已決策。
7. 頁面有草稿、提交或確認對話框時，沿用前景刷新保護；離開提示尚未保存。第一版草稿僅存記憶體，刷新或關閉仍可能遺失，介面須明示未確認狀態。
8. 原生 radio 支援方向鍵、Tab 與 Space；其他輸入有 label，錯誤連到對應欄位。對話框關閉後焦點回到原按鈕；手機窄版選項與輸入自然換行。

## 保存與應用入口

Decision service 擁有 parse／validate／confirm／reopen／revise，Decision store 擁有精確檔案讀寫、revision 與原子替換。採用與 Checklist 相同的 C# 核心＋host adapter 方向；只有可獨立抽取的檔案保存機制共用，Checklist parser、manual 規則及 bridge message 不混用。

- Browser 第一階段接入既有本機服務，提案入口為 `/decisions/?scope=<id>&task=<task-id>`，定位該 scope 的 `decisions/<task-id>.decisions`。task 省略時列出該目錄直接包含的決策文件與待決策摘要，不遞迴掃描；壞檔個別報錯，不使其他文件消失。路由驗證 task ID 與解析後路徑，拒絕目錄穿越及越出授權目錄的連結，不接受任意路徑。
- Browser 的資料 transport 提供 load／confirm／reopen，request 包含文件定位、decision ID、題目 version、expected revision 與 request ID；服務回傳該文件的新 snapshot 及 revision。scope 摘要頁只聚合讀取，不提供跨文件提交。
- 同一檔案的合作 writer 共用跨程序鎖，鎖內核對 revision 再保存。過期題目或檔案整筆拒絕；畫面保留草稿供人工比較，不自動覆蓋或合併答案。
- request ID 的保存、重送及最新狀態回傳遵循 D-03。
- 沿用 Browser 的本機授權邊界，不因新增決策路由放寬現有 gate。第一版不新增第三方寫入 token 能力；靜態公開 Viewer 不含決策檔與編輯端點。
- Desktop 後續用相同 DecisionApp 與 domain service，只換 transport；精確授權所開啟的 `.decisions` 文件。直接開檔與副檔名關聯皆到同一入口，不要求登記 scope。Browser／Desktop 不各寫一套 radio 或確認畫面。

Report 導航與資料載入失敗要分開顯示。卡片待決策數量由對應 `.decisions` 文件計算，scope 總數由直接列出的文件聚合，不複製寫進 report.json。來源無法讀取時顯示統計不完整，不把錯誤當零項。文件 revision、鎖與呈現狀態皆按文件隔離；task query 是文件定位，授權仍由 host 的 scope／精確路徑檢查負責。

## D-01 題目修訂契約

`revise` 是給 Agent 的明確文件寫入操作，由 Decision service 執行；本機一次性 request adapter 接收精確文件路徑與 JSON 請求，不依賴 Browser token，也不在第一版增加題目編輯畫面。請求包含 decision ID、expected revision、expected 題目 version、request ID 及完整的新題目定義。新定義只包含 question、context、source_ref、options、recommendation、allow_other；ID、答案與歷史不得由呼叫端替換。

- 首次建立且 history 為空的題目可由 Agent 編寫；已有任何歷史（包括重新開啟後的 pending）均須透過 revise 改題，不直接覆寫檔案中的題目與歷史。
- 在同一檔案鎖與保存操作內，驗證新定義、記錄修訂前後快照、將 version 加一、status 設為 pending、answer 設為 null。舊 confirm 事件與答案完整保留。
- 任何定義欄位變更均採相同規則，包括改字、選項排序及推薦變更；不靠程式猜測是否改變語意。正規化後完全相同則回 no-op，不新增事件、時間戳或 version。
- confirm 只接受 pending；reopen 只接受 decided，保留定義與 version 並清除當前答案、追加事件。revise 可作用於任一狀態。成功請求的重送依 D-03 判斷，不能當成新的狀態轉換。
- 讀取時核對當前定義、version、狀態與最新歷史事件的一致性。外部直接修改受歷史保護的內容造成不一致時，回 `history_mismatch` 並拒絕寫入，不嘗試補造無法取得的舊快照；這不是防竄改機制。

驗收：確認 A 後 revise 選項，題目回 pending 且 version 加一；歷史仍可還原原題與 A。舊 version 的確認拒絕；相同定義 revise 不產生異動。

## D-02 多題草稿與衝突契約

Decision session 將「伺服器 snapshot」與「每題草稿」分開保存。草稿記錄建立時的題目定義、version、狀態、答案與該題歷史位置作為比較基準，不只記錄整份文件 revision。

- 同一 session、同一文件一次最多送一筆修改；其他題仍可編輯草稿，但提交按鈕暫時停用。提交中的題目停止編輯，避免回應清掉送出後新增的文字。
- 確認成功後只清除對應請求的草稿。其他題若與其基準一致，保留草稿並接受最新文件 revision；這允許確認第一題後繼續確認第二題。
- 其他題若被修訂、回答、重開或移除，保留本地草稿並標示衝突、停用提交。即使狀態最後回到 pending，也不能忽略中間新增的歷史。
- 衝突時顯示最新內容及原草稿，使用者可捨棄草稿，或在最新題目仍為 pending 時明確重新核對並建立新草稿；已移除的選項不可自動替代，不可只換成新 revision 就重送。
- 收到 revision 衝突時可重新讀取 snapshot 以比較，不能自動再次寫入。讀取失敗仍保留原 snapshot、草稿及診斷。

驗收：同頁兩題有草稿，確認第一題後第二題文字完整保留且可提交；若另一分頁已修改第二題，第一題成功後第二題仍保留草稿但必須先處理衝突。

## D-03 重送與最新狀態契約

confirm／reopen／revise 每筆邏輯請求使用一個 request ID。成功事件保存 request ID 與正規化請求的 SHA-256 指紋（操作、decision ID、expected revision／version、payload）；欄位順序與 JSON 排版不影響指紋。有效 no-op 不寫事件；它若因後續來源改變而重送，依一般 revision 衝突處理。

- 在授權、請求格式及來源一致性檢查後，於檔案鎖內先查 request ID，再做新請求的 revision 與狀態轉換檢查。已成功的相同請求不因舊 revision 被誤認為未執行。
- 相同 ID＋相同指紋回 `already_applied`、原事件識別，以及鎖內讀取的**最新 snapshot／revision**；不得回傳舊事件當時的 snapshot。相同 ID＋不同指紋回 `request_id_conflict`，不寫入。
- 新請求才核對 revision／version 並執行；事件、答案與 request 記錄在同一次原子替換中保存，失敗不留下半筆成功紀錄。第一版不裁切歷史與重送識別記錄。
- 回應遺失或逾時時，畫面顯示結果未確認，保留原 request ID 與請求內容。使用者可查核最新來源或明確重試原請求，不自動產生新 ID 重複提交；改變答案屬於新操作，須先釐清原操作結果。
- 收到 already_applied 時表示該操作曾成功，不代表題目目前仍已決策；UI 以最新 snapshot 呈現，依 D-02 合併草稿。若後續有人重開，畫面保持 pending。

驗收：確認成功但回應遺失，原請求重送只保留一筆 confirm；其間若已 reopen，重送回傳 pending 的最新 snapshot。相同 ID 改成另一答案則拒絕。

## 與計畫、Agent 工作流的關係

具名 `.decisions` 文件擁有可回答的問題、選項、答案與歷史。計畫文件擁有落實後的設計與理由，以文件連結＋decision ID 追溯來源。report.dev.json 既有 decisions 欄位保留相容性；不再把同一題的可編輯副本同步進去。

Agent 新增待決策問題時更新對應任務的 `.decisions` 文件，列出推薦及理由。接續工作時先讀該任務文件的 pending 與已確認答案；需要總覽才讀 scope 文件摘要，再回到 source_ref；不用使用者再次要求整理。確認答案只保存決策，不自動執行命令、不授予部署或跨專案修改權限，也不把任務或驗收標為完成。

既有 Markdown 未決問題採逐項遷移：先核對問題與選項、建立 stable ID，再把原文改成指向該決策的路由；不靠文字相似度自動合併。共享協作規則仍要求 handoff 的 Open decisions 路由，正式採用新格式時需協調其擁有範圍的規則更新；本專案不擅自修改跨專案規則。

## 分階段實作

| 階段 | 交付 | 完成門檻 |
|---|---|---|
| 1 格式與狀態 | JSON Schema、parser／writer、範例、驗證、D-01 狀態與歷史模型 | 讀寫往返、無效引用、空白其他、非法轉換與題目改版測試通過 |
| 2 共用渲染 | DecisionApp／CardBody、最小必要共用外殼、fixture transport、D-02 session | Checklist 外觀與操作回歸；單選、草稿、確認、重開及跨題衝突可操作 |
| 3 真實保存 | Store、revision、鎖、D-03 request ID、本機 request adapter 與 Browser adapter | 真實落盤、revise、並行衝突、回應遺失重送與最新狀態測試通過 |
| 4 集中入口 | Report 計數與文件導航、scope 文件摘要、Agent 使用指引 | 打開 Report 即可找到待決策；多文件與壞檔診斷正確 |
| 5 Desktop 一致性 | 同畫面搭配 Desktop transport、具名文件開啟／副檔名關聯、打包 | Browser／Desktop 相同題目操作結果一致；獨立開檔不依賴 Report |

最小端到端切片：一個 scope、一題 A／B／C／其他，在 Browser 選擇並確認，重新載入答案仍在，Report 的待決策數減一。
延伸驗證：同一題重新開啟並選其他，歷史保留前次答案；同時開啟的另一分頁不能以舊 revision 覆蓋。

規模：中至大型；新增格式、domain service、畫面及兩種 transport，影響跨模組契約。初估接觸 12–20 個來源／測試／文件，實際抽取量在階段 1 盤點後修正。共用卡片與 Checklist transport 有先例；決策狀態模型及歷史為新能力。採模組化設計，先完成 Browser 最小切片，再接 Desktop。

## 驗收與遷移

- 推薦選項不等於已選答案；只有確認成功才減少待決策數。
- option ID 不受顯示字母與排序變動影響；其他空白不能提交。
- 收合、篩選、拖曳與切換可見性不更改答案或遺失本頁草稿。
- 重開保留舊答案，題目語意改版不沿用舊確認；歷史可讀到當時問題。
- 同一 revision 的兩筆競爭寫入只有一筆成功；相同 request 重送不重複記錄。
- D-01～D-03 各節的驗收案例全部通過，包含歷史不一致拒絕、其他題草稿保留、重送後不回退至舊 snapshot。
- 保存失敗、來源損壞、未授權與檔案不存在有不同診斷，不以空清單掩蓋錯誤。
- 一個共用元件修改可同時反映在 Checklist 與決策頁；既有驗收結果與 .checklist 格式不變。
- Report 待決策數不受頁面篩選影響；公開部署不攜帶決策背景或答案。
- 同 scope 的多份 `.decisions` 分別保存；不同文件的相同 decision ID 不混淆，損壞一份不阻擋其他文件。
- 具名 `.decisions` 可獨立開啟；Report 仍以資料夾下的 `report.json` 為入口。
- 實際鍵盤、焦點、窄版、刷新保護及 Browser／Desktop 一致性列入人工驗收；狀態與保存契約使用定向測試。

新格式為可選附檔，不要求舊專案遷移才能繼續使用 Checklist 或 Report。執行與驗收由 `../checklists/decision-items.checklist` 記錄；操作入口見 [使用方式](DecisionItemsUsage.md)。

## 尚未決定

無。`.decisions` 採 JSON 內容；D-01～D-03 為實作契約，不需要使用者另行提供操作或建議。
