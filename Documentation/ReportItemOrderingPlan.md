# Report 子項目排序與更新計畫

> Task ID: report-item-ordering
>
> 本文件定義子項目排序與 CLI 位置操作；實作與部署進度由 handoff.md 記錄。既有 CLI 交易契約由 [Report CLI 計畫](ReportCliUpdatePlan.md) 擁有。

## 系統階層與關係

```text
TaskProgress Report
├─ report.json：子項目 ID、priority、status 與陣列順序
├─ Viewer：未完成項目的優先級投影、已完成項目的完成順序
├─ Report CLI：新增、更新狀態、指定陣列位置
│  └─ 既有 report operations／revision／驗證／保存交易
└─ report skill：依工作進度更新資料，引用 CLI 操作文件
```

陣列是同級項目順序的唯一資料來源。Viewer 排序只產生顯示投影，不回寫陣列；CLI 位置操作由既有 Report 後端負責，不新增另一套保存流程。

## 目標與現況依據

使用者可以同時表達工作的重要程度與同級工作的先後順序。全部未指定優先級時，只需安排陣列位置，不必為了移動位置提高 priority。

- [priority policy](../viewer/assets/priority-policy.js) 定義 0 立即、1 優先、2 一般、3 次要、4 未指定；缺省為 4，預覽隱藏未指定標籤。
- [report model](../viewer/assets/report-model.js) 擁有 `stableSortTaskItemsByPriority`；[TaskCard](../experiments/editor-svelte-spike/src/TaskCard.svelte) 共用此排序。
- [Report operations](../service/report_operations.py) 擁有新增、狀態更新與位置操作；省略位置時未完成新增至尾端，完成新增或轉入時置頂。
- 子項目 status 與 priority 由既有 schema 驗證；[report skill](../.agents/skills/task-progress-report/SKILL.md) 提供子項目生命週期與順序指引。

UX session 曾否寫入 priority 5 及其實際錯誤畫面尚未重現，不作為本計畫的已驗證事故。

## 排序規則

1. 未完成項目先按 priority 由 0 到 4 排序；同級維持來源陣列順序。缺省與明示 4 同級。
2. 例如來源 A(4)、B(1)、C(4)，顯示為 B、A、C；把 C 移到 A 前方後顯示為 B、C、A。全部為 4 時，顯示順序完全等於陣列順序。
3. 不按 planned／in_progress／blocked／archive 再分組；status 表達工作狀態，priority 與陣列位置表達排序。
4. 已完成項目維持完成堆疊，不按 priority 排序；新完成、重新完成、直接新增 done 置頂，重複設為 done 不移位。
5. 預覽與編輯使用同一排序投影，修改 priority 後更新顯示；保留 stable ID，避免用顯示索引定位編輯目標。Undo／Redo 還原資料後重新投影。

## CLI 位置操作設計

操作範例與執行入口見 [Report CLI 用法](ReportCliUsage.md#子項目位置與狀態)。

| 操作 | 擴充 |
|---|---|
| item.add | 可選 `position: {before: "item-id"}` 或 `{after: "item-id"}`，指定未完成新項目的陣列位置 |
| item.move | 使用 `task_id`、`item_id` 與必填 position，移動既有未完成子項目 |

- position 必須且只能有 before 或 after 一個鍵，以同一 task 的 pending_items 內穩定 ID 定位；不接受數字索引、標題、自身、其他任務、已完成或不存在的參照項目。
- 位置表示原始陣列中的相對位置；跨 priority 移動不改 priority，也不保證跨級的視覺相鄰。要安排同級順序，應以同級項目為參照。
- 不帶 position 的 item.add 保留既有預設；done 的 item.add 帶 position，或 item.move 指向已完成項目，回明確驗證錯誤，保護完成順序。
- item.move 不改 status、priority、ID 或其他欄位。移到目前位置為 no-op；空陣列新增不需 position。
- 批次依序執行，參照可為前面操作新增的項目。done 恢復為未完成後，可在同批以 item.move 安排位置。
- 沿用 get revision → apply --dry-run → apply、整批驗證、衝突拒絕、原子保存與分析更新邊界；任何位置錯誤都不留下部分寫入。
- 不增加獨立排序欄位，也不改 report schema。命令 help 與操作文件須能辨認支援本擴充的版本；舊版不支援時明確停止該位置操作，不繞過驗證手改 JSON。

## 工作拆分

1. **Viewer 接線。** 在共用任務卡的未完成項目投影接入既有排序函式；保留完成堆疊，重建正式 Viewer bundle。
2. **CLI 位置操作。** 在既有 operations 邊界加入 position／item.move，補輸入驗證、結果摘要與 no-op；確認發布 CLI 使用的後端與文件版本一致。
3. **文件與 skill。** 在 [Report CLI 用法](ReportCliUsage.md) 集中描述新操作；skill 只寫 priority 語意、排序規則及工作生命週期，引用操作文件。開始處理設 in_progress、受阻設 blocked、完成並驗證後設 done；恢復工作依事實更新。一般具 ID 子項目更新使用 CLI；保留新建報告、舊字串遷移等既有不支援範圍，禁止捏造 revision。
4. **驗證與交付。** 依下節形成執行用 checklist；按 skill 撰寫流程驗證修改後的 skill 格式與連結，更新 handoff 的部署狀態與驗證限制。

功能工作預估為中型，約 8–12 個原始碼、測試與文件檔案，另有產生的 bundle；新增約 200–350 行，刪除量預估低於 30 行。排序與交易已有先例，位置操作為既有請求契約擴充。驗證需要定向 Node／Python 測試及 Browser 實際顯示核查；不另建 CLI 框架或資料 owner。

## 驗收條件

- 全部缺省或 priority 4 時，Viewer 順序等於 pending_items；混合 priority 時先按級別、同級穩定排序，原 JSON 不因顯示排序被重寫。
- 編輯 priority、Undo／Redo、保存及重載後順序一致，操作仍命中相同 stable ID。
- CLI 可以在同級參照前／後新增或移動項目；省略 position 保留既有新增行為，重複相同移動為 no-op。
- 無效位置、越界 priority、舊 revision、批次後段失敗均拒絕保存；dry-run 不修改來源與衍生檔案。
- planned → in_progress → done，以及 done → in_progress 後再移動，皆保留 ID，沒有重複、遺失或 status／陣列矛盾。
- 完成堆疊在新增 done、完成、重做、重複 done 後仍符合既有規則。
- 測試涵蓋實際 TaskCard 排序接線及 CLI 保存往返，不只驗證未被呼叫的工具函式；Browser 確認正式 bundle 與原始碼行為一致。
- skill、CLI 文件與實際發布能力一致，連結可解析，不把新增的請求契約描述成舊版本已支援。

## 編輯模式拖曳換位

> Task ID: report-item-copy-reorder（拖曳部分）；驗收 `checklists/report-item-copy-reorder.checklist`。

- 只在編輯模式提供。未完成子項列首的狀態圓點換成拖曳把手（同寬，不移動版面）；已完成項目沒有把手，維持完成順序。
- 只能放到同一卡片、同一優先級的未完成項目前後；跨優先級的目標不接受放置。依據：位置操作不改 priority，跨級移動在投影上會被排序拉回原級別。
- 放置後以 Editor Core 的 `reorder-item`（`position: {before|after: 穩定 ID}`）改陣列位置，語意與 CLI `item.move` 相同：不改 status、priority 或 ID，移到原位不送命令；可 Undo／Redo，並沿用編輯模式的保存流程。
- 鍵盤：聚焦把手後按 Alt+↑／↓，與同級相鄰項目交換，焦點留在原項目的把手。
- 使用 HTML 拖放；觸控裝置沒有拖曳，與卡片自由排序相同。

## 預覽模式拖曳換位

> Task ID: preview-item-reorder；驗收 `checklists/preview-item-reorder.checklist`。互動語彙沿用 UX 草案 [集合換位](../../UX/Documentation/ModuleSpec/Collections/CollectionSwitchPosition.md)（`direct` 啟動、`vacate` 讓位預覽）。

- 只在偵測到本機編輯服務時啟用（與能否切到編輯模式的條件相同）；公開部署或無編輯服務時預覽維持唯讀，沒有抓取游標。
- 規則與編輯模式相同：只有同一卡片、同一優先級的未完成子項可互換；已完成項目、舊式文字子項不可移動。
- 啟動：滑鼠在子項列的空白處按住拖曳（游標為可抓取）；文字、連結與按鈕上維持原本的選取與點擊。列首 ○ 不變。觸控長按尚未提供，等 UX 第 69 題（把手拖曳與長按換位）有結論。
- 回饋：被拖曳的列變淡留在原位；可放的位置以約 150ms 動畫空出一列高的空位（減少動態時直接出現），不可放的位置不空出位置，游標為禁止。前後判斷以描述區中線為準，避免空位展開時來回跳動。
- 鍵盤：焦點在該列的複製按鈕時，Alt+↑／↓ 與同級相鄰項目交換，焦點留在原項目。
- 儲存：放下即寫入，沒有復原，也不顯示儲存列。寫入前建立編輯工作階段並重新讀取 `report.json`，與畫面內容不同就不寫入、重新載入並提示「請再拖一次」；相同時只調整該卡 `pending_items` 的陣列位置（`viewer/assets/item-reorder.js`，舊式文字子項原樣保留）並更新 `updated_at`，由工作階段的 `If-Match` 擋下期間的外部變更。
- 編輯模式維持把手與插入線，不使用讓位預覽。

## 範圍界線

本計畫不增加整張卡的位置操作、跨任務搬移、跨優先級拖曳或已完成項目的任意排序；不自動推測 priority 或工作是否開始。非法 Report 的錯誤畫面改善須先重現，再另行評估。
