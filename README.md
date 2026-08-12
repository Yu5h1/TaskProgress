# TaskProgress

TaskProgress 將不同專案或 Agent scope 的任務狀態整理成可分享、唯讀的報告。公開模式與本機模式共用同一份 Viewer；本機 Launcher 透過 LocalWebService 將各專案的報告掛入同一個 localhost Viewer。

目前 MVP 包含：

- `report.json` 與 `report.dev.json` 的 JSON Schema，以及可選的時間分析 sidecar。
- 可從專案 report 與選用時間輸入確定性產生 `time.analysis.json` 的 Launcher 分析器。
- 位於 `reports/example/` 的公開報告範例。
- 由 `?scope=`、`?report=`、`?dev=` 自動載入資料的 `viewer/index.html`；本機 scope 預設合併存在的 Developer report。
- 僅綁定 loopback、可啟動或重用 LocalWebService 的 C# `task-progress.exe`，以及只對 Launcher 精確註冊 scope 開放的安全本機編輯 Host。

## 快速開始

第一次設定 Windows 捷徑或 Chrome 書籤，請參考 [Windows Launcher 使用指南](Documentation/WindowsLauncherGuide.md)。

在 CMD 或 PowerShell 輸入：

```cmd
.\Build\win-x64\task-progress.exe ".\reports\example"
```

Launcher 會自動讀取資料夾內的 `report.json`，並在存在時一併載入 `report.dev.json` 與 `time.analysis.json`。若資料夾包含 `time.config.json`、`time.estimates.json` 或 `time.events.json`，`open`／`start` 會先重新產生分析快照；沒有任何時間輸入的舊專案不會被自動加入時間資料。加入 `--no-browser` 可只輸出連結，`--port` 可選擇另一個固定 port。

第一次執行會在 `127.0.0.1:8001` 啟動 LocalWebService；之後開啟其他 scope 會重用同一個 process，並透過受保護的控制 API 註冊精確 JSON 路徑。Launcher 結束不會停止服務。

本機 Viewer 在確認目前 scope 是由 Launcher 精確註冊後，頁首才會出現「預覽模式／編輯模式」。編輯資料先留在記憶體；切回預覽會直接放棄草稿，只有固定在內容面板右下方的「儲存」會寫回 canonical files。服務以短效 scope session、來源 revision、完整 Schema 驗證、重複 ID 檢查與同目錄原子取代保護來源；另一分頁或 Agent 已修改檔案時會拒絕覆寫。公開網站沒有編輯 API，因此不會顯示編輯選項。本機 Svelte Editor 可修改交付日，以及每個穩定子項目的人工工時、人工依據與獨立人工確認；人工估算會在 `time.estimates.json` 建立新版本並 supersede 舊 active version，儲存後由既有分析器重新產生 `time.analysis.json`。

檢查或停止服務：

```cmd
.\Build\win-x64\task-progress.exe service status
.\Build\win-x64\task-progress.exe service stop
```

本機 scope 可以登記一次後重複使用：

```cmd
.\Build\win-x64\task-progress.exe scope add "C:\Project\yu5h1lib"

REM 或明確指定 scope
.\Build\win-x64\task-progress.exe scope add yu5h1lib "C:\Project\yu5h1lib"
.\Build\win-x64\task-progress.exe open --scope yu5h1lib
```

要把 Launcher 當成服務入口，載入 `scopes.json` 內的所有 scope：

```cmd
.\Build\win-x64\task-progress.exe start
```

`start` 會驗證所有已登記報告、以獨立 Console 啟動 LocalWebService、註冊每個 base/developer/time-analysis report，並開啟 `http://127.0.0.1:8001/`。首頁會顯示匿名化的 scope 清單，不會公開專案磁碟路徑；在服務 Console 按 `Ctrl+C` 可正常停止服務。若服務已經存在，`start` 會沿用該 process 並同步 scope，但無法替既有的背景 process 補上視窗。

## 自動產生時間分析

只要 `report.json` 的任務卡與工作項目使用穩定資料（兩層皆可另帶 `priority`），即可明確執行：

```cmd
.\Build\win-x64\task-progress.exe analyze "C:\Project\your-project"
```

分析器會在同一目錄原子更新 `time.analysis.json`。也可使用已登記 scope，或固定分析時間以重現結果：

```cmd
.\Build\win-x64\task-progress.exe analyze --scope your-project
.\Build\win-x64\task-progress.exe analyze "C:\Project\your-project" --as-of "2026-07-24T21:30:00+08:00"
```

輸入檔案皆為選用：

- `time.config.json`：8／8／8 容量、工作日、公開例外標籤與選用交付日。
- `time.estimates.json`：人工、混合、AI 或歷史證據形成的 active estimate。
- `time.events.json`：實際工作 session 與狀態事件。

只有 `report.json` 時，明確執行 `analyze` 會為具穩定 ID 且沒有估算的項目建立低信心預設工時，並產生「交付日未定」快照。若 config 設有 `delivery_at`，分析器再建立逐日容量時間線與期限風險。AI 不在 Launcher 內執行；AI／人工可更新 `time.estimates.json` 的工程判斷，之後由相同確定性算法重新加總。完整可執行範例位於 `experiments/time-reference/examples/`。

要從 Chrome 書籤啟動，先註冊目前的 EXE：

```cmd
.\Build\win-x64\task-progress.exe protocol install
```

之後書籤可使用：

```text
task-progress://open?scope=yu5h1lib
```

## Viewer 連結

本機以 `task-progress.exe start` 啟動時，Viewer 首頁會列出所有已載入的 scope。公開部署或明確連結仍可透過查詢參數指定資料：

```text
?scope=yu5h1lib
?scope=yu5h1lib&dev=none
?report=../reports/project-a/report.json
?report=../reports/project-a/report.json&dev=../reports/project-a/report.dev.json
```

`scope=yu5h1lib` 會固定載入 Viewer 上一層的 `reports/yu5h1lib/report.json`。在 `localhost`／`127.0.0.1` 上，它也會自動嘗試載入同目錄的 `report.dev.json`；檔案不存在時安靜保留基本報告。公開網站不會自動載入 Developer report。使用 `dev=none` 可在本機強制只顯示基本報告；明確的 `dev=<path>` 仍可指定其他 overlay。當 `scope` 與 `report` 同時存在時，以明確指定的 `report` 為準。scope 只接受小寫英數字，以及點、底線或連字號。

`report.dev.json` 是選用 overlay。遺失、無法載入或找不到對應 task 時，基本觀看者報告仍可使用，Viewer 會顯示診斷而不猜測資料。

`time.analysis.json` 也是選用 sidecar，預設從 `report.json` 同一個資料夾載入。沒有檔案時不顯示任何時間元件，也不視為錯誤。有工程估算但沒有期限時，Viewer 顯示中性的 `交付日未定 ›`、task/item 工時及工程估算面板，不建立燈號、倒數或容量頁；存在有效期限時才加入 `M/D 交付 ● ›` 與「評估流程／工程估算／工作容量」三個切換頁。期限區塊無效時只隔離期限並保留有效估算。可用 `?time=none` 明確停用，或以 `?time=<path>` 指定其他來源。

期限風險會在 Viewer 初始化、每分鐘、頁面恢復與回到前景時，依瀏覽當下時間重新計算。這只更新時間進度與燈號，不執行 AI，也不改寫已發布的工程估算。工作容量只在本機全域編輯模式顯示設定表單；「重新計算」更新記憶體預覽，全域「儲存」成功後才提交 loopback 瀏覽器的 `localStorage`，切回預覽或 report 儲存失敗會回復。公開網站保持唯讀。

## Viewer 主題

頁首的「主題」選單支援系統選擇、亮色、暗色與自訂。系統選擇是預設值，會使用瀏覽器的 `prefers-color-scheme` 跟隨作業系統設定；固定亮色、固定暗色與自訂 palette 會保存在目前瀏覽器的 `localStorage`。

預設暗色採 Obsidian 風格的石墨藍灰背景與低飽和霧藍強調色；綠、紅、黃只保留給完成、受阻與警告等語意狀態。

自訂模式可選擇亮色或暗色狀態基底，再調整頁面背景、面板背景、大標題、面板標題、項目文字、次要文字、邊框與強調色。Viewer 會提示低於 4.5:1 的文字對比；任務狀態色沿用基底，避免自訂配色讓完成、進行中與受阻失去辨識度。主題是觀看者偏好，不會寫入或改變 `report.json` schema。

瀏覽器的 `fetch` 不適合直接以 `file://` 載入本機 JSON；本機使用情境請使用 launcher。

開發工作區預設將 `LocalWebService` 視為 `TaskProgress` 的相鄰資料夾。不同配置可使用：

- `TASK_PROGRESS_LOCAL_WEB_SERVICE`：`localHost.py` 絕對路徑。
- `TASK_PROGRESS_EDIT_HOST`：TaskProgress `service/taskprogress_host.py` 的絕對路徑。
- `TASK_PROGRESS_REPORT_SCHEMA`：`schemas/report.schema.json` 的絕對路徑。
- `TASK_PROGRESS_VIEWER_ROOT`：`viewer/` 的絕對路徑；其中包含 `index.html` 與 `assets/`。
- `TASK_PROGRESS_PYTHON`：Python 執行檔或命令。
- `TASK_PROGRESS_HOME`：scope 設定與服務 state 的使用者資料目錄。
- `TASK_PROGRESS_SERVICE_STATE`：需要自訂時使用的完整 state file 路徑。

Viewer 原始碼位於 `viewer/`，報告位於 repository 頂層的 `reports/`。公開網站可將 `viewer/` 的內容部署至任一個位於網站根目錄下一層的路徑，並保持 `reports/` 在網站根目錄：

```text
https://<user>.github.io/<repository>/task-progress/?scope=yu5h1lib
```

建議由內容網站的 GitHub Actions 對本 repository 執行 `sparse-checkout: viewer`，再只把 `viewer/` 複製到 Pages artifact。`src/`、`tests/`、`Documentation/`、`Build/` 與其他 CLI 檔案不會被取回或進入公開 artifact。

本 repository 的 `.github/workflows/notify-docs.yml` 會在 `main` 的 `viewer/**` 更新時，以 `repository_dispatch` 通知 `Yu5h1/docs` 重新部署。跨 repository 通知需要在本 repository 設定可存取 docs 的 `DOCS_DISPATCH_TOKEN` secret。

## 資料格式

正式契約位於：

- `schemas/report.schema.json`
- `schemas/report.dev.schema.json`
- `experiments/time-reference/schemas/time.analysis.schema.json`（Draft 0.2）

觀看者 task 的必要欄位是 `id`、`title`、`status` 與 `summary`。狀態支援 `planned`、`in_progress`、`blocked`、`done`、`archive`；`done` 與 `archive` 會分開統計。

Viewer 會優先依 `completed_items` 與 `pending_items` 的實際項目數顯示進度；沒有列出工作項目時，才使用來源提供的 `progress.completed` 與 `progress.total`。兩者都沒有時，則依任務狀態顯示單一進度單位。

任務卡與工作項目的 `priority` 都可省略，資料只保存 `0` 到 `4`；缺少欄位的舊資料以 `4`「未指定」投影，新建任務與子項目則預設 `2`「一般」。顯示名稱由共享 `viewer/assets/priority-policy.js` 統一提供，目前為「立即、優先、一般、次要、未指定」；正常預覽不顯示「未指定」標籤，但編輯下拉仍可選擇。policy 會完整驗證 minimum 到 maximum 的標籤；任何標籤缺漏、空白或重複造成設定不完整時，暫停隱藏規則並將所有層級統一降級為 `P0` 到 `Pmax`，排序與數值不受影響。Viewer 先依狀態群組，再於同組內依 priority 穩定排序。工作項目仍接受舊版純字串；要把 item 工時與分析結果可靠對齊時，改用 `{ "id": "stable-item-id", "title": "顯示文字", "priority": 0 }`。優先級不是過濾器，也不從 title 前綴解析。同一 task 內的 item id 必須唯一。時間資料缺少或只使用舊字串項目時，基本進度顯示不受影響。

## 驗證

```powershell
dotnet build .\src\TaskProgress.Cli\TaskProgress.Cli.csproj -c Release
dotnet run --project .\tests\TaskProgress.Cli.Tests\TaskProgress.Cli.Tests.csproj -c Release
npm.cmd test
npm.cmd run viewer:ui:build
```

C# launcher 的原始碼位於 `src\TaskProgress.Cli`。正式本機編輯功能與 Viewer 共用同一頁及同一份 Svelte 元件；edit host capability 只授權已精確註冊的 scope，不再提供獨立 `editor.html`。`experiments/editor-svelte-spike/index.html` 僅保留為隔離開發入口。

發布 Windows x64 single-file EXE 時使用根目錄 `Publish.cmd`；Viewer UI bundle 由 `npm.cmd run viewer:ui:build` 獨立產生並由既有 CI staleness gate 檢查：

```powershell
.\Publish.cmd
```

發布後 `Build\win-x64` 仍只包含 `task-progress.exe`；Viewer 與 edit host 由 repository 提供，公開 Pages 只取得 `viewer/` 產物。

Launcher 整合測試會啟動真實 LocalWebService、註冊多個 scope 與選用的時間 sidecar、確認共用 process 與授權 shutdown；Viewer 測試涵蓋兩層報告合併、scope 路徑、版本相容、時間重算與本機容量政策。

## 授權

TaskProgress 以 [MIT License](LICENSE) 授權。

Copyright (c) 2026 Yu5h1
