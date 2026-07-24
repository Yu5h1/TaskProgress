# TaskProgress Windows Launcher 使用指南

TaskProgress Launcher 讓你從 Windows 捷徑或 Chrome 書籤開啟本機專案報告。Launcher 會檢查 LocalWebService、登記專案的 JSON，然後開啟同一套 TaskProgress Viewer。

本指南使用 BonghuoVR 作為範例：

```text
W:\UnityProject\BonghuoVR
├─ report.json
├─ report.dev.json      選用
├─ time.config.json     選用的時間政策／期限輸入
├─ time.estimates.json  選用的工程估算輸入
├─ time.events.json     選用的執行事件輸入
└─ time.analysis.json   自動產生的選用公開快照
```

## 選擇使用方式

| 使用方式 | 適合情境 | 是否需要 Registry |
|---|---|---|
| `task-progress.exe start` | 將所有已登記 scope 當成一個本機服務啟動 | 不需要 |
| Windows 專案捷徑 | 最簡單，雙擊直接開啟一個專案 | 不需要 |
| Chrome `task-progress://` 書籤 | 希望從 Chrome 書籤啟動服務與報告 | 需要註冊一次 |
| HTTP 書籤 | 服務已經啟動，且 scope 已經登記 | 不需要，但不能自行啟動服務 |

第一次使用建議先建立 Windows 專案捷徑。確認運作後，再設定 Chrome 書籤。

## 使用前確認

發布版 Launcher 位於：

```text
C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib\TaskProgress\Build\win-x64\task-progress.exe
```

LocalWebService 預設位於 TaskProgress 的相鄰資料夾：

```text
C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib
├─ TaskProgress
└─ LocalWebService
   └─ localHost.py
```

確認 Python 可以執行：

```powershell
python --version
```

## 建議方式：啟動所有已登記 Scope

先依下方步驟使用 `scope add` 登記各個報告資料夾，之後執行：

```powershell
.\Build\win-x64\task-progress.exe start
```

Launcher 會一次完成：

1. 讀取 `%LOCALAPPDATA%\TaskProgress\scopes.json`。
2. 若存在任一時間輸入，先確定性更新 `time.analysis.json`；沒有時間輸入時不建立新資料。
3. 驗證所有已登記資料夾的 `report.json` 與選用的 `report.dev.json`，並掛載存在的 `time.analysis.json`。
4. 在獨立 Console 啟動 LocalWebService。
5. 註冊所有 scope 的精確報告 URL。
6. 產生不包含本機路徑的 scope catalog。
7. 開啟 `http://127.0.0.1:8001/`，由首頁選擇報告。

從首頁或 `open --scope` 開啟的網址只需要 `?scope=<id>`。本機 Viewer 會自動載入已註冊且存在的 `report.dev.json`；若只想查看基本報告，可在網址加入 `&dev=none`。

LocalWebService Console 必須保持開啟。要正常停止服務，可在該視窗按 `Ctrl+C`，或另外執行 `task-progress.exe service stop`。加入 `--no-browser` 可只啟動服務與 Console。

`task-progress.exe` 本身是 Launcher；持續提供網頁的是 Python `localHost.py`。

## 產生時間分析

需要手動確認或只更新一個專案時，可直接執行：

```powershell
.\Build\win-x64\task-progress.exe analyze "W:\UnityProject\BonghuoVR"
```

若 scope 已登記：

```powershell
.\Build\win-x64\task-progress.exe analyze --scope bonghuo-vr
```

分析器會讀取 `report.json`，以及存在的 `time.config.json`、`time.estimates.json`、`time.events.json`，再原子更新同目錄的 `time.analysis.json`。只有 report 時，明確執行 `analyze` 會以每個穩定 item 的低信心預設工時產生「交付日未定」快照；有 `delivery_at` 才加入容量與期限風險。

一般不必在每次觀看前手動執行：`open` 與 `start` 發現任一時間輸入時會先自動更新。Viewer reload 只重算會隨目前時間改變的期限燈號，不會執行 AI 或改寫工程估算。

## 方法一：建立 Windows 專案捷徑

### 1. 建立捷徑

在桌面空白處按滑鼠右鍵，選擇：

```text
新增 → 捷徑
```

### 2. 填入項目位置

完整貼上以下一行：

```text
"C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib\TaskProgress\Build\win-x64\task-progress.exe" "W:\UnityProject\BonghuoVR"
```

兩個路徑都保留雙引號。第一個路徑是 Launcher，第二個路徑是包含 `report.json` 的專案資料夾。

### 3. 輸入捷徑名稱

例如：

```text
BonghuoVR TaskProgress
```

### 4. 設定開始位置

建立完成後，在捷徑上按滑鼠右鍵，選擇「內容」。

「目標」保持：

```text
"C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib\TaskProgress\Build\win-x64\task-progress.exe" "W:\UnityProject\BonghuoVR"
```

「開始位置」填入：

```text
C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib\TaskProgress
```

### 5. 雙擊捷徑

Launcher 會自動：

1. 發現時間輸入時先更新 `time.analysis.json`，再驗證 report 並掛載存在的 sidecar。
2. 檢查 `127.0.0.1:8001`。
3. 必要時啟動 LocalWebService。
4. 登記 BonghuoVR 的精確 JSON 路徑。
5. 開啟 Viewer。
6. 結束 `task-progress.exe`。

LocalWebService 會繼續執行，供其他專案 scope 重用。

## 方法二：建立 Chrome 書籤

Chrome 不能直接執行檔案路徑或 PowerShell 命令。要從 Chrome 啟動 Launcher，需要先註冊 `task-progress://` Windows protocol。

### 1. 開啟 PowerShell

```powershell
cd "C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib\TaskProgress"
```

### 2. 登記 scope

最簡單的寫法只需要提供報告資料夾。Launcher 會把資料夾名稱轉成小寫連字號格式，例如 `BonghuoVR` 會成為 `bonghuo-vr`：

```powershell
.\Build\win-x64\task-progress.exe scope add "W:\UnityProject\BonghuoVR"
```

資料夾內 `report.json` 的 `scope_id` 必須與轉換結果一致。若需要使用不同名稱，也可以明確指定 scope：

```powershell
.\Build\win-x64\task-progress.exe scope add bonghuo-vr "W:\UnityProject\BonghuoVR"
```

scope 必須使用小寫英數字，可包含連字號、底線或點。

確認登記結果：

```powershell
.\Build\win-x64\task-progress.exe scope list
```

應該看到：

```text
bonghuo-vr -> W:\UnityProject\BonghuoVR
```

### 3. 註冊 Windows protocol

```powershell
.\Build\win-x64\task-progress.exe protocol install
```

這會寫入目前 Windows 使用者的 Registry：

```text
HKEY_CURRENT_USER\Software\Classes\task-progress
```

不需要系統管理員權限，也不需要手動開啟 `regedit`。

### 4. 新增 Chrome 書籤

書籤名稱：

```text
BonghuoVR TaskProgress
```

書籤網址：

```text
task-progress://open?scope=bonghuo-vr
```

### 5. 第一次點擊書籤

Chrome 會詢問是否允許開啟 `task-progress`。選擇「開啟」。如果 Chrome 提供「一律允許」選項，可依個人需求勾選。

之後點擊書籤時，Windows 會執行 `task-progress.exe`。Launcher 會啟動或重用 LocalWebService、登記 scope，然後開啟 HTTP Viewer。

## 查看服務是否仍在執行

```powershell
& "C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib\TaskProgress\Build\win-x64\task-progress.exe" service status
```

執行中會顯示 PID、Viewer root 與已登記檔案數量。未執行時會顯示服務尚未啟動。

## 正確關閉 LocalWebService

關閉 Chrome 分頁目前不會自動停止 LocalWebService。要完整停止服務，執行：

```powershell
& "C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib\TaskProgress\Build\win-x64\task-progress.exe" service stop
```

成功時會顯示：

```text
LocalWebService 已停止。
```

也可以建立一個停止捷徑。

「目標」：

```text
"C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib\TaskProgress\Build\win-x64\task-progress.exe" service stop
```

「名稱」：

```text
Stop TaskProgress Service
```

## HTTP 書籤的限制

以下網址可以直接加入 Chrome 書籤：

```text
http://127.0.0.1:8001/?scope=bonghuo-vr
```

但 HTTP 書籤只能連線到已經執行的服務。它不會執行 `task-progress.exe`。先執行 `task-progress.exe start`，即可一次載入所有已登記 scope，並直接從 `http://127.0.0.1:8001/` 首頁選擇。

需要自行啟動服務時，使用 Windows 專案捷徑或 `task-progress://` 書籤。

## EXE 移動後重新註冊

Windows protocol 保存的是 `task-progress.exe` 的絕對路徑。如果移動 EXE 或改變發布位置，請從新位置重新執行：

```powershell
.\task-progress.exe protocol install
```

新的路徑會取代原本的 Registry command。

## 取消 Chrome protocol

```powershell
.\Build\win-x64\task-progress.exe protocol uninstall
```

這只會移除 `task-progress://` Registry 登記，不會刪除 EXE、scope 設定或報告，也不會停止目前正在執行的 LocalWebService。

## 常見問題

### Windows 顯示捷徑目標無效

確認「目標」的第一段是 `task-progress.exe`，而不是 `localHost.py` 或資料夾。EXE 與專案路徑分別使用雙引號：

```text
"完整的 task-progress.exe 路徑" "完整的專案資料夾路徑"
```

### 顯示找不到 report.json

確認專案資料夾最上層存在：

```text
<project>\report.json
```

### 顯示找不到 LocalWebService

確認 `TaskProgress` 與 `LocalWebService` 是相鄰資料夾。自訂位置可設定：

```powershell
$env:TASK_PROGRESS_LOCAL_WEB_SERVICE = "C:\Path\To\LocalWebService\localHost.py"
```

### 顯示無法執行 Python

先確認：

```powershell
python --version
```

需要指定 Python 時：

```powershell
$env:TASK_PROGRESS_PYTHON = "C:\Path\To\python.exe"
```

### Chrome 書籤沒有作用

確認 protocol command：

```powershell
reg query "HKCU\Software\Classes\task-progress\shell\open\command"
```

如果路徑錯誤或 EXE 已移動，重新執行 `protocol install`。

### Port 8001 被其他程式占用

先檢查 TaskProgress 服務：

```powershell
.\Build\win-x64\task-progress.exe service status
```

Launcher 不會關閉或接管無法辨識的 process。需要測試其他 port 時：

```powershell
.\Build\win-x64\task-progress.exe "W:\UnityProject\BonghuoVR" --port 18001
```
