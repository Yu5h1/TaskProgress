# Implementation Checklist

Current round: `plan.md#report-指路任務卡與單層-scope-導航`.

本輪只做該設計的階段 1–2（相容 reader 與 tagged fixtures、集中式 variant dispatch 與單層投影），並一併完成 `plan.md#report-摘要欄位與編輯-ux` 的編輯部分。

Run every Agent check once. If a check fails, mark it `[!]`, add `Observed`, and pause automatic retries plus dependent work. After an intervention, the user may request one new verification attempt; success changes the same check to `[x]` while preserving `Observed` and adding `Resolved`. Manual checks remain user-editable through the shared marker cycle; Agent results do not. Continue independent work when safe. Create a new item only when the outcome or acceptance contract changes. The parent marker is derived from its checks. This file contains only the active round; git history owns prior rounds.

本輪不含指路卡的 resolver、Viewer 卡片、導航與遷移階段：它們分別被 handoff「Open decisions」裡的導航機制與 `report_ref` 建立方式擋住。

- [x] **1. 帶 `kind` 的互斥 variant 與 1.0／1.1 相容 reader**
  Outcome: Report Schema 以 `kind` 鑑別的 `oneOf` 表達一般任務卡與 Report 指路任務卡，Viewer、CLI 與 Python edit host 三個 reader 同時接受 `1.0` 與 `1.1`；`1.0` 的未標記 task 一律視為 `standard`，指路卡不得保存衍生欄位，且沒有任何 reader 靠 `report_ref` 是否存在來猜種類。
  Checks:
    - [x] **Schema variant 契約**
      - Action: 執行 `node --test tests/report-variant.test.mjs`。
      - Expect: `schema_version` 同時接受 `1.0` 與 `1.1`；`tasks` 走 `oneOf` 兩個 `$defs`，各以 `kind.const` 選定分支；`report_pointer` 分支只允許 `id`、`title`、`kind`、`report_ref`；未標記 `kind` 的 task 仍通過 `standard` 分支；帶 `report_ref` 的 `standard` task 被拒絕。
    - [x] **共用 fixture 通過三個 reader**
      - Action: 執行 `node --test tests/report-variant.test.mjs tests/report-model.test.mjs`。
      - Expect: `tests/fixtures/` 下的 1.0 未標記與 1.1 tagged fixture 都通過 JSON Schema 與 `validateReport()`；未知 `kind`、指路卡保存 `status`／`summary`／項目、`report_ref` 指向目前 scope 自身、以及重複 `id` 各自產生一筆可辨識的錯誤，且不影響其餘 task 的驗證。
    - [x] **Viewer 版本閘門**
      - Action: 執行 `node --test tests/report-variant.test.mjs tests/report-model.test.mjs tests/report-summary.test.mjs`。
      - Expect: 版本判斷來自 `report-model.js` 單一 `SUPPORTED_SCHEMA_VERSIONS`，`app.js` 與 spike data-loader 都不再各自比對字串常數；`2.0` 之類的版本仍被擋下並顯示可理解訊息。
    - [x] **CLI reader 相容**
      - Action: 執行 `dotnet run --project tests/TaskProgress.Cli.Tests`。
      - Expect: `ReportFolder` 接受 1.0 與 1.1 的 `report.json`，拒絕其他版本，`report.dev.json` 仍必須與 base report 同版本；既有 CLI 檢查全數通過。
    - [x] **Python edit host 相容**
      - Action: 執行 `python -c "import sys,unittest,importlib.util; sys.path.insert(0,'.'); spec=importlib.util.spec_from_file_location('taskprogress_host_tests','tests/test_taskprogress_host.py'); m=importlib.util.module_from_spec(spec); sys.modules[spec.name]=m; spec.loader.exec_module(m); unittest.main(module=m, argv=['run','-v'], exit=False)"`（site-packages 另有一個 `tests` 套件會遮蔽本地目錄，所以不能用 `python -m unittest tests....`）。
      - Expect: host 沿用同一份 schema 檔，1.1 tagged fixture 通過驗證，既有 host 檢查全數通過，且沒有第二份版本清單被加進 Python。

- [x] **2. 集中式 variant dispatch 與單層投影**
  Depends on: 1.
  Outcome: 一個集中式 `deriveReportStatus(tasks)` 與唯讀投影建構器，重用既有 `calculateProjectProgress`，只投影目標 report 頂層 task 的 `id`、`title`、`status`，且不快取目標 report。
  Checks:
    - [x] **集中式狀態推導**
      - Action: 執行 `node --test tests/report-projection.test.mjs`。
      - Expect: 全部完成為 `done`，有 `in_progress` 為 `in_progress`，未完成工作全部受阻才為 `blocked`，其餘為 `planned`；`archive` 只代表明確封存，不計入完成，也不被用來假裝完成；同一份 tasks 只有這一個函式會回答狀態。
    - [x] **單層投影邊界**
      - Action: 執行 `node --test tests/report-projection.test.mjs`。
      - Expect: 投影出的項目數等於目標 report 頂層 task 數並保留完整 `status`，不轉成已完成／待處理二分；投影不讀取 base report 以外的任何資料（Developer overlay、時間 sidecar、更深層 report），也不把目標 task 的項目或 Developer 內容帶出卡片；目標內若還有指路卡，只取其標題與可得狀態而不解析它指向的 report。計畫第 1 條要求重用唯一的專案進度規則，而該規則本來就以項目計數為輸入，因此讀取已載入 base report 的項目陣列僅限於算出這個進度。
    - [x] **重用與無快取**
      - Action: 執行 `node --test tests/report-projection.test.mjs tests/report-model.test.mjs`。
      - Expect: 進度來自既有 `calculateProjectProgress`，指路功能沒有第二套百分比公式；模組不保存目標 report，重複投影時每次都用呼叫端提供的最新資料，且投影結果為凍結的唯讀物件。

- [x] **3. Report 摘要可在 Viewer 編輯**
  Outcome: 編輯模式能修改與清空 report 層級 `summary`，走既有 Editor Core draft／validation／Undo／Redo 與同一條全域儲存路徑；清空後回到以任務數產生的說明。
  Checks:
    - [x] **Editor Core report 欄位命令**
      - Action: 執行 `node --test tests/editor-core.test.mjs`。
      - Expect: 新增的 report 欄位命令只接受白名單欄位；連續輸入合併為一筆 Undo；Undo／Redo 可還原；清空會移除欄位而不是寫入空字串，`prepareSave()` 的輸出因此仍通過 schema；diff 會回報 report 層級變更並標記 `dirty`，且不觸發時間資料失效。
    - [x] **共用標頭區塊與單一儲存路徑**
      - Action: 執行 `node --test tests/report-summary.test.mjs tests/ui-host.test.mjs tests/local-edit-interface.test.mjs`。
      - Expect: 摘要在預覽與編輯都由同一個共用元件渲染，起始畫面、scope 目錄與錯誤畫面也走同一條 region，`app.js` 不再直接寫入該節點的 textContent；沒有新增第二條儲存或驗證路徑；fallback 文字只有一個實作來源。
    - [x] **Viewer 產品包實測** `[manual]`
      - Action: 以 `Build/win-x64/task-progress.exe start --no-browser` 啟動本機 edit host，開啟 `http://127.0.0.1:8001/?scope=task-progress`，進入編輯模式修改摘要並儲存；再清空摘要並儲存一次。桌面與 390px 各看一次。
      - Expect: 修改後重新載入仍顯示新摘要；清空後顯示以任務數產生的原句；沒有水平溢出，鍵盤可聚焦該欄位。
      - Reason: 需要使用者本機的 edit host 與真實瀏覽器互動判斷。

- [x] **4. Schema 改動不需重啟 edit host，驗證失敗會指認自己**
  Outcome: Python edit host 依 `schemas/report.schema.json` 檔案本身驗證，而不是啟動時取的副本；report 驗證失敗的訊息附上該 schema 的指紋與讀取時間，過期時能被看出來。
  Checks:
    - [x] **Schema 熱讀**
      - Action: 執行 `python -c "import sys,unittest,importlib.util; sys.path.insert(0,'.'); spec=importlib.util.spec_from_file_location('taskprogress_host_tests','tests/test_taskprogress_host.py'); m=importlib.util.module_from_spec(spec); sys.modules[spec.name]=m; spec.loader.exec_module(m); unittest.main(module=m, argv=['run','-v'], exit=False)"`。
      - Expect: 在服務執行中修改 schema 檔後，原本被拒絕的儲存立刻通過，過程不重啟進程；schema 檔暫時無法解析時沿用上一份可用的 validator，不讓半寫入的檔案中斷編輯。
    - [x] **失敗訊息指認 schema**
      - Action: 同上一則測試指令。
      - Expect: report 驗證失敗的 `detail` 以 `[report.schema.json@<12 碼指紋> loaded <時間>]` 結尾；原始碼中不再有啟動時凍結的 validator，五個 report 驗證入口都改讀同一個來源並共用同一個標註函式。
