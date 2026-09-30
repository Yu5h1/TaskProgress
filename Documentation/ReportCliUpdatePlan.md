# Report CLI 修改命令更新計畫

> Task ID: report-cli-update

> 範圍為透過 CLI 更新既有 Report。以下為第一版實作契約；實機整合驗收集中於實作完成後進行。
> 本文件細化根目錄 `plan.md`「Phase 5：來源 Adapters 與 Agent 工作流」保留的 `report apply` 方向。

## 系統階層與關係

```text
TaskProgress
├─ Report CLI：定位 scope、讀取、提交領域操作、回傳 JSON
├─ Report Viewer：互動編輯與顯示
└─ 共用 Report 編輯服務（本次抽取）
   ├─ Schema、identity 與資料關聯驗證
   ├─ revision 檢查與同一 scope 的寫入協調
   ├─ 檔案交易與失敗回復
   └─ 既有分析模組：來源變更後重算衍生資料
```

CLI 與 Viewer 共用驗證及保存規則。CLI 的領域操作先產生候選 Report，再交給共用編輯服務；HTTP session、UI 草稿與終端輸出各自留在入口層。

## 目標與現況

讓人或 Agent 依穩定 ID 修改指定任務、項目與開發者欄位，不必每次讀回及重寫整份報告。保留現有 JSON 格式、Viewer 行為與既有 CLI 命令。

C# `ReportCommand` 負責參數與一次性 Python 程序。`service/report_store.py` 擁有共用驗證、可回復交易與時間分析呼叫；`report_operations.py` 只產生候選資料，`report_cli.py` 協調 CLI 的 revision／保存。HTTP 與 CLI 共用 `report_lock.py` 的 scope 鎖；HTTP 另保留 session 與 UI 草稿契約。

第一版涵蓋既有 Report 的普通任務與具 ID 項目。新建整份報告、刪除／改名 ID、修改指路卡關係、Checklist、時間估算輸入及任意 JSON 路徑修改留待後續。

## 命令

| 命令 | 用途 |
|---|---|
| `report get <folder> [--task <id>]` | 取得全份或單一任務，以及可供寫入的來源 revision |
| `report validate <folder>` | 驗證 Report、存在的 developer overlay 及相關 ID 關係 |
| `report apply <folder> --input <changes.json>` | 一次提交一組操作 |
| `report apply <folder> --input -` | 從 UTF-8 stdin 接收相同 JSON |
| `report apply <folder> --input <changes.json> --dry-run` | 驗證並回傳預計差異，不寫入 |

每個命令也接受 `--scope <scope-id>` 取代 `<folder>`，兩者互斥。明確路徑不要求先登記 scope；不遞迴尋找 Report、不自動開 Viewer。

`get --task` 回傳該任務、對應 developer overlay（若存在）及整組來源 revision。stdout 固定為 JSON，診斷走 stderr；失敗必須回非零 exit code，不能要求呼叫端只靠文字判斷成功。

## 第一版操作集合

| 操作 | 契約 |
|---|---|
| `report.update` | 更新 Report 的 title、summary |
| `task.add` | 新增明確 ID 的普通任務；重複 ID 拒絕 |
| `task.update` | 更新 title、summary、status、priority、progress；ID 不可變 |
| `item.add` | 在指定任務新增具 ID 的項目 |
| `item.update` | 依 task ID＋item ID 更新 title、status、priority |
| `dev.update` | 更新指定任務的 next_step、blockers、decisions、routes |

更新只套用列出的欄位。省略代表保留；清除可選欄位使用明確 `unset` 清單，拒絕對同一欄位同時 set 與 unset。未知操作與未知欄位一律拒絕。`claim` 是協作狀態的投影，第一版不提供任意修改入口。

項目 status 為 done 時歸入 completed_items，其餘歸入 pending_items；移動保留 ID 與未修改的內容，遵循既有 Viewer 的排序及狀態規則。舊字串項目保留，但不能用文字或陣列索引猜測寫入目標；需要編輯時回明確診斷，由後續獨立遷移補 ID。

task status 與明示 progress 不因單一項目完成而自行推定。若使用者要更新 progress，須提供完整 completed／total，且 completed 不得大於 total；延續目前欄位語意。

## 請求與結果

以下是請求格式；revision 必須使用 `get` 的實際回傳值：

```json
{
  "version": "1",
  "expected_revision": "<get 回傳的 revision>",
  "operations": [
    {
      "op": "task.update",
      "task_id": "report-cli",
      "set": { "status": "in_progress", "summary": "正在實作 CLI 修改入口" }
    },
    {
      "op": "dev.update",
      "task_id": "report-cli",
      "set": { "next_step": "完成 revision 衝突驗證" }
    }
  ]
}
```

一批操作依序套用到記憶體候選資料，全部通過才保存；後面的操作可以引用同批新增的任務。任一操作失敗，整批不寫入，錯誤包含 operation index、code 與欄位位置。

成功結果只回傳來源／新 revision、是否實際修改、異動 task IDs、欄位摘要及分析結果狀態，不回傳完整 Report 或私人欄位內容。固定 exit code：0 成功、2 輸入或驗證錯誤、3 revision 衝突、4 保存／分析／回復失敗。發生需要復原的錯誤時必須明示，不能回成功。

## 共用保存邊界

1. 讀取並驗證來源，保留 schema_version、report_id、scope_id 及未修改資料。既有無效來源先報錯，不藉本命令暗中修復。
2. revision 至少涵蓋 report.json、report.dev.json 的原始內容與不存在狀態；若交易會重算分析，亦涵蓋讀取的分析輸入。局部 get 仍使用整組 revision。
3. 取得以正規化 scope 路徑識別的跨程序鎖，在鎖內重新核對 revision，再保存。Viewer 與 CLI 的所有共用保存入口必須參與同一協定；不宣稱能阻止不遵守協定的外部編輯器。
4. 共用 Schema、重複 ID、項目 status／所在陣列、progress 及 developer overlay 關聯驗證。developer overlay 的 report_id／schema_version 必須與主檔一致，任務 ID 必須存在。
5. 只有明確 `dev.update` 才建立缺少的 report.dev.json；保存時更新實際異動檔案的 updated_at。無實質變更不更新時間戳或 revision。
6. 沿用並擴充既有可回復交易機制，讓 Report 與 overlay 不會留下「只更新一半卻回成功」的結果。多檔案 replace 不等同所有外部讀取者都能看到原子快照；合作讀寫入口需共用鎖與回復流程。
7. Report 變更影響已存在的分析投影時，沿用既有模組重算機制。先驗證重算及回復邊界，失敗不得留下舊分析卻宣稱完整成功；不在此修改估算判斷或擴張模組架構。

一次性 Python adapter 與 HTTP 共用保存模組，由 C# 管理參數與程序邊界。沿用本專案的部署形態：EXE 搭配專案 service／schemas 檔案及已安裝 jsonschema 的 Python；不宣稱單獨複製 EXE 即可執行 Report 編輯。Python 由 TASK_PROGRESS_PYTHON 或 PATH 尋找，專案由 EXE／工作目錄的祖先或 TASK_PROGRESS_VIEWER_ROOT 定位。不安裝依賴、不啟動常駐服務；CLI 的 Python 與時間分析子程序不建立 Console 視窗，結果及錯誤仍經 stdin／stdout／stderr 管線與 exit code 回傳；不影響 start --console 的服務觀察視窗。

`--dry-run` 不寫入來源、時間戳、分析輸出或交易日誌；遇到待回復交易時回診斷，不能偷偷執行回復。它顯示預期差異與會觸發的分析，正式 apply 仍重新檢查 revision，不保證預覽後來源不變。

## 實作順序與完成條件

| 階段 | 工作 | 完成條件 |
|---|---|---|
| 1 | 確認 CLI adapter／發布路徑，抽取共用驗證與保存服務 | Viewer 原有保存、衝突與回復定向測試通過 |
| 2 | 加入 report get／validate、revision 與 JSON 輸出 | 以 fixture 查詢局部任務，正確診斷 overlay mismatch 與重複 ID |
| 3 | 加入 apply／dry-run 及操作白名單 | 普通任務、項目移動與 dev 更新可完成一輪，無關資料保留 |
| 4 | 接齊跨程序鎖、批次交易、分析重算及錯誤契約 | 競爭寫入只有一方成功；注入失敗可回復且不回假成功 |
| 5 | 更新 help、使用文件與 Report skill | 使用者可只讀一個任務並完成修改，不必傳回整份 Report |

執行規模：中型、跨 CLI／Python host／測試／文件，初估 8–12 個檔案；實際新增量待階段 1 的抽取盤點後確定。
先例：保存與驗證已有實作；領域操作、overlay 交易及跨入口鎖是新增契約。
驗證：fixture 定向測試、真實 CLI stdin／stdout、雙程序競爭測試，以及既有 Viewer 保存回歸。

## 驗收案例

- 中文、空白路徑及多行文字可從 input file／stdin 往返，stdout 是單一可解析 JSON。
- 單一 task 更新不改其他任務、ID、schema_version 或未指定欄位；相同值重送為 no-op。
- item 完成與恢復待辦保留 ID，無重複、遺失或矛盾陣列狀態。
- dry-run 前後所有來源與衍生檔案位元組相同。
- 批次中某個操作錯誤，前面的有效操作也不落盤。
- 舊 revision、兩個 CLI 或 CLI／Viewer 同時提交不靜默覆蓋。
- 主檔與 overlay 保存／分析重算失敗，以及程序中斷後回復都有明確結果。
- Report 1.0／1.1、既有指路卡與字串項目可讀取並保留；不支援的修改回明確錯誤。

定向驗證與集中整合驗收見 `checklists/report-cli-update.checklist`；實機驗收未通過前不宣稱發布版本具備本功能。


## 第一版補充契約

- `task.add` 使用 `value` 提供完整普通任務；`item.add` 使用 `task_id` 與 `value` 提供具 ID 項目，省略 status 時為 planned。新增內容仍須通過 Schema。
- `item.update` 的定位欄位為 `task_id`＋`item_id`。跨完成／待辦陣列移動時附加至目標陣列末端，同陣列保留位置；不提供 unset status，避免含糊的狀態回退。
- `dev.update` 不覆蓋 claim；指定 next_step 時移除同一 overlay 的舊 next_steps。只有實際新增內容才建立缺少的 overlay，清除不存在欄位為 no-op。
- 每批 1–1000 操作，請求最多 4 MiB；Report 與 overlay 各最多 1 MiB。UTF-8 JSON 拒絕重複欄位與 NaN／Infinity。
- revision 包含 Report、overlay、time.config／estimates／events／analysis 與私有 local 狀態的原始位元組或缺少狀態。CLI get 不恢復交易；有待回復交易時，get／validate／dry-run 回 recovery_required，明確 apply 在鎖內先恢復再檢查 revision。
- 目前共用分析保存邊界涵蓋既有 Time 模組；只有 Report 實際變更且存在時間輸入或投影才重算，純 overlay 更新不重算。只呼叫 `analyze --module time`，不觸及其他模組輸出。
- 成功 `get` 回 `{ok, revision, report, developer}`；局部 get 以 task 取代 report。`validate` 回 `{ok, revision}`。apply／dry-run 回 `{ok, source_revision, revision, changed, dry_run, task_ids, changes, analysis}`；dry-run 的 revision 維持來源值，analysis 可為 planned／updated／not_required。
- 錯誤回 `{ok:false,error:{code,message,operation_index?,field?}}`；operation_index 從 0 起算。批次操作結果摘要不含欄位值。stdout 只有單一 JSON。
- 跨程序鎖以正規化資料夾路徑建立 Windows named mutex；同事件迴圈另加 scope lock 防止 mutex 的執行緒重入。鎖等待上限 10 秒。HTTP 編輯 session 亦比對 overlay／events 變更，取消分析請求時等待分析完成並回復後才釋放鎖。
