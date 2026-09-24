# Report CLI 修改命令更新計畫

> 討論草案。範圍為透過 CLI 更新 Report；命令與第一版操作集合為建議設計，尚未實作。
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

目前 `Program.cs` 沒有 `report` 分支。`service/taskprogress_host.py` 已有 Report Schema 驗證、重複 ID 檢查、revision、`commit_edit` 與 `LocalFileTransaction`。這些能力可作為抽取起點，但目前的 `asyncio.Lock` 屬於單一 host 實例，不能保護獨立 CLI 程序；也不能把既有保存路徑直接視為已支援 `report.dev.json`。

第一版涵蓋既有 Report 的普通任務與具 ID 項目。新建整份報告、刪除／改名 ID、修改指路卡關係、Checklist、時間估算輸入及任意 JSON 路徑修改留待後續。

## 建議命令

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

| 操作 | 建議契約 |
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

以下是提案格式；revision 必須使用 `get` 的實際回傳值：

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

成功結果只回傳來源／新 revision、是否實際修改、異動 task IDs、欄位摘要及分析結果狀態，不回傳完整 Report 或私人欄位內容。建議固定 exit code：0 成功、2 輸入或驗證錯誤、3 revision 衝突、4 保存／分析／回復失敗。發生需要復原的錯誤時必須明示，不能回成功。

## 共用保存邊界

1. 讀取並驗證來源，保留 schema_version、report_id、scope_id 及未修改資料。既有無效來源先報錯，不藉本命令暗中修復。
2. revision 至少涵蓋 report.json、report.dev.json 的原始內容與不存在狀態；若交易會重算分析，亦涵蓋讀取的分析輸入。局部 get 仍使用整組 revision。
3. 取得以正規化 scope 路徑識別的跨程序鎖，在鎖內重新核對 revision，再保存。Viewer 與 CLI 的所有共用保存入口必須參與同一協定；不宣稱能阻止不遵守協定的外部編輯器。
4. 共用 Schema、重複 ID、項目 status／所在陣列、progress 及 developer overlay 關聯驗證。developer overlay 的 report_id／schema_version 必須與主檔一致，任務 ID 必須存在。
5. 只有明確 `dev.update` 才建立缺少的 report.dev.json；保存時更新實際異動檔案的 updated_at。無實質變更不更新時間戳或 revision。
6. 沿用並擴充既有可回復交易機制，讓 Report 與 overlay 不會留下「只更新一半卻回成功」的結果。多檔案 replace 不等同所有外部讀取者都能看到原子快照；合作讀寫入口需共用鎖與回復流程。
7. Report 變更影響已存在的分析投影時，沿用既有模組重算機制。先驗證重算及回復邊界，失敗不得留下舊分析卻宣稱完整成功；不在此修改估算判斷或擴張模組架構。

建議抽取既有 Python 保存能力供 HTTP 與一次性 CLI adapter 使用，由 C# CLI 管理參數與程序邊界，避免重寫第二套保存器。第一階段需確認 runtime／發布可攜性；若既有發布方式無法支援離線 adapter，先修訂本段，再進入實作。CLI 操作不應為了改檔而啟動常駐服務。

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

本輪交付為此更新計畫。實作起點為階段 1；操作集合及 adapter 方向先按本草案討論定案，再建立執行 checklist。
