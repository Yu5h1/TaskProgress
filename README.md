# TaskProgress

TaskProgress 將不同專案或 Agent scope 的任務狀態整理成可分享、唯讀的報告。公開模式與本機模式共用同一份 Viewer；本機 Launcher 透過 LocalWebService 將各專案的報告掛入同一個 localhost Viewer。

目前 MVP 包含：

- `report.json` 與 `report.dev.json` 的 JSON Schema。
- 兩個不同 scope 的配對範例與錯誤案例。
- 由 `?scope=`、`?report=`、`?dev=` 自動載入資料的 `index.html`。
- 僅綁定 loopback、可啟動或重用 LocalWebService 的 C# `task-progress.exe`。

## 快速開始

第一次設定 Windows 捷徑或 Chrome 書籤，請參考 [Windows Launcher 使用指南](Documentation/WindowsLauncherGuide.md)。

在 CMD 或 PowerShell 輸入：

```cmd
.\Build\win-x64\task-progress.exe ".\examples\yu5h1lib"
```

Launcher 會自動讀取資料夾內的 `report.json` 與選用的 `report.dev.json`。加入 `--no-browser` 可只輸出連結，`--port` 可選擇另一個固定 port。

第一次執行會在 `127.0.0.1:8001` 啟動 LocalWebService；之後開啟其他 scope 會重用同一個 process，並透過受保護的控制 API 註冊精確 JSON 路徑。Launcher 結束不會停止服務。

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

`start` 會驗證所有已登記報告、以獨立 Console 啟動 LocalWebService、註冊每個 base/developer report，並開啟 `http://127.0.0.1:8001/`。首頁會顯示匿名化的 scope 清單，不會公開專案磁碟路徑；在服務 Console 按 `Ctrl+C` 可正常停止服務。若服務已經存在，`start` 會沿用該 process 並同步 scope，但無法替既有的背景 process 補上視窗。

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
?report=reports/project-a/report.json
?report=reports/project-a/report.json&dev=reports/project-a/report.dev.json
```

`scope=yu5h1lib` 會固定載入 `reports/yu5h1lib/report.json`。當 `scope` 與 `report` 同時存在時，以明確指定的 `report` 為準。scope 只接受小寫英數字，以及點、底線或連字號。

`report.dev.json` 是選用 overlay。遺失、無法載入或找不到對應 task 時，基本觀看者報告仍可使用，Viewer 會顯示診斷而不猜測資料。

## Viewer 主題

頁首的「主題」選單支援系統選擇、亮色、暗色與自訂。系統選擇是預設值，會使用瀏覽器的 `prefers-color-scheme` 跟隨作業系統設定；固定亮色、固定暗色與自訂 palette 會保存在目前瀏覽器的 `localStorage`。

自訂模式可選擇亮色或暗色狀態基底，再調整頁面背景、面板背景、大標題、面板標題、項目文字、次要文字、邊框與強調色。Viewer 會提示低於 4.5:1 的文字對比；任務狀態色沿用基底，避免自訂配色讓完成、進行中與受阻失去辨識度。主題是觀看者偏好，不會寫入或改變 `report.json` schema。

瀏覽器的 `fetch` 不適合直接以 `file://` 載入本機 JSON；本機使用情境請使用 launcher。

開發工作區預設將 `LocalWebService` 視為 `TaskProgress` 的相鄰資料夾。不同配置可使用：

- `TASK_PROGRESS_LOCAL_WEB_SERVICE`：`localHost.py` 絕對路徑。
- `TASK_PROGRESS_VIEWER_ROOT`：包含 `index.html` 與 `assets/` 的 Viewer root。
- `TASK_PROGRESS_PYTHON`：Python 執行檔或命令。
- `TASK_PROGRESS_HOME`：scope 設定與服務 state 的使用者資料目錄。
- `TASK_PROGRESS_SERVICE_STATE`：需要自訂時使用的完整 state file 路徑。

GitHub Pages 可直接從 repository 根目錄發布，入口是根目錄的 `index.html`：

```text
https://<user>.github.io/<repository>/?scope=yu5h1lib
```

## 資料格式

正式契約位於：

- `schemas/report.schema.json`
- `schemas/report.dev.schema.json`

觀看者 task 的必要欄位是 `id`、`title`、`status` 與 `summary`。狀態支援 `planned`、`in_progress`、`blocked`、`done`、`archive`；`done` 與 `archive` 會分開統計。

只有來源明確提供 `progress.completed` 與 `progress.total` 時，Viewer 才顯示數量進展。沒有明確分母時不推算百分比。

## 驗證

```powershell
dotnet build .\src\TaskProgress.Cli\TaskProgress.Cli.csproj -c Release
dotnet run --project .\tests\TaskProgress.Cli.Tests\TaskProgress.Cli.Tests.csproj -c Release
npm.cmd test
```

C# launcher 的原始碼位於 `src\TaskProgress.Cli`。發布 Windows x64 single-file EXE：

```powershell
dotnet publish .\src\TaskProgress.Cli\TaskProgress.Cli.csproj -c Release -o .\Build\win-x64
```

發布後 `Build\win-x64` 只包含 `task-progress.exe`。Launcher 整合測試會啟動真實 LocalWebService、連續註冊兩個 scope、確認共用 process 與授權 shutdown；Viewer 測試涵蓋兩層報告合併、scope 路徑、版本不符與不安全 scope。
