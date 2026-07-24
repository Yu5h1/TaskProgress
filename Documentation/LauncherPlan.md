# TaskProgress Launcher 計畫

> 狀態：LocalWebService 通用控制面與 C# 薄 Launcher 已完成；發布版 EXE、自動化整合與 BonghuoVR 瀏覽器驗證均已通過。

## 目標

Launcher 負責將「專案資料夾」轉換成可直接開啟的 TaskProgress 網址。

使用者只需要執行：

```text
task-progress.exe "W:\UnityProject\BonghuoVR"
```

Launcher 自動完成：

1. 讀取專案根目錄的 `report.json` 與選用的 `report.dev.json`。
2. 存在 `time.config.json`、`time.estimates.json` 或 `time.events.json` 時，先確定性更新 `time.analysis.json`。
3. 驗證報告的 scope、版本與配對關係。
4. 確認指定 port 是否已有正確的 LocalWebService。
5. 服務不存在時啟動它；已存在時重複使用同一個 process。
6. 將該 scope 的 base、Developer 與時間快照註冊為精確 URL 路徑。
7. 開啟對應的 Viewer URL。

本機 Viewer 使用 `?scope=` 時會自動嘗試載入該 scope 已註冊的 Developer report；`?dev=none` 可強制只看基本報告。公開網站不會自動載入 Developer overlay。

## 使用流程

```text
專案捷徑
    ↓
Launcher 讀取 report.json
    ↓
檢查 http://127.0.0.1:8001 的服務身分
    ├─ 未啟動 → 啟動 LocalWebService → 等待 health check
    ├─ 正確服務 → 繼續使用
    └─ 其他程式 → 停止並回報 port 衝突
    ↓
註冊 /reports/<scope>/report.json
註冊選用的 /reports/<scope>/report.dev.json
    ↓
開啟 http://127.0.0.1:8001/?scope=<scope>
```

Launcher 每次開啟專案都會重新確認註冊，因此專案移動後不需手動編輯 Viewer。

## 元件邊界

### TaskProgress Launcher

Launcher 了解 TaskProgress 的語意，負責：

- 尋找 `report.json` 與 `report.dev.json`。
- 提供 `analyze` 命令，並在 `open`／`start` 發現時間輸入時自動重建衍生快照。
- 沒有任何時間輸入時保持舊專案原狀，不因 Viewer 支援時間就擅自建立 sidecar。
- 讀取並驗證 `scope_id`、`schema_version` 與 `report_id`。
- 將 scope 轉成 Viewer 需要的 URL 路徑。
- 檢查、啟動與呼叫 LocalWebService。
- 組合 URL 並開啟預設瀏覽器。

### LocalWebService

LocalWebService 保持通用，不解析 TaskProgress schema。它負責：

- 提供 Viewer root 與精確檔案路由。
- 提供受保護的本機控制 API，讓 Launcher 在服務啟動後增加精確檔案。
- 拒絕未列入路由的同目錄檔案。
- 保留現有 CLI、`create_app(...)` 與 `serve(...)` 的相容性。

### TaskProgress Viewer

Viewer 維持純讀取：

```text
?scope=bonghuo-vr
  → reports/bonghuo-vr/report.json
```

本機 `?scope=bonghuo-vr` 會自動嘗試讀取 `reports/bonghuo-vr/report.dev.json`；使用 `?scope=bonghuo-vr&dev=none` 可停用 overlay。

Viewer 不負責啟動服務、選擇本機路徑或註冊 scope。

## LocalWebService 必要擴充

原有 `--file` 只在服務啟動時讀取。LocalWebService 現已加入通用的動態精確檔案 registry，讓 Launcher 能重複使用同一個 process。

已實作的版本 1 接口：

```http
GET    /__localwebservice/v1/health
GET    /__localwebservice/v1/status
GET    /__localwebservice/v1/files
POST   /__localwebservice/v1/files
GET    /__localwebservice/v1/files/{registration_id}
DELETE /__localwebservice/v1/files/{registration_id}
POST   /__localwebservice/v1/shutdown
```

`health` 只提供 `service`、`api_version` 與 `instance_id`，讓 Launcher 分辨 port 上是否為相容的 LocalWebService。`status`、files 與 shutdown 都必須帶 bearer token；Launcher 由 `status.web_root` 確認目前 process 提供的是預期 TaskProgress Viewer root。

`POST` 請求範例：

```json
{
  "url_path": "/reports/bonghuo-vr/report.json",
  "file_path": "W:\\UnityProject\\BonghuoVR\\report.json"
}
```

註冊規則：

- 新註冊回傳 `201 Created`、registration ID 與 `Location`。
- 相同 URL 與相同檔案重複註冊時回傳相同 registration ID 與 `200 OK`。
- 相同 URL 指向不同檔案時回傳 `409 Conflict`；第一版沒有 `replace` 參數，也不靜默取代。
- Launcher 要解除註冊時，先從註冊回應或受保護的 files 列表取得 registration ID，再呼叫對應的 `DELETE`。
- 只允許精確檔案；第一版不開放動態資料夾 mount。
- 繼續拒絕 traversal、編碼路徑、保留路徑、不存在檔案與目錄。
- 註冊後每次 HTTP 讀取原始檔案，Agent 更新 JSON 後只需重新整理 Viewer。
- API 錯誤使用 `application/problem+json` 與穩定 `code`，Launcher 應依 HTTP status／code 顯示可行動訊息，不解析英文錯誤文字。

## 安全設計

loopback 只限制連線來自本機，不能單獨當作控制 API 的授權。任意網頁仍可能嘗試連線 localhost。

第一版必須同時採用：

- 只綁定 `127.0.0.1`。
- 只接受 `localhost`、`127.0.0.1` 與實際 port 的 Host。
- 啟動時產生隨機 control token。
- token、`instance_id`、pid、host、port 與 Viewer root 放在使用者專屬的 state file，不放在 URL。
- state file 不可位於 Viewer root 或任何公開 mount；LocalWebService 不覆寫既有 state file，正常結束時也只移除仍屬於自身 `instance_id` 的檔案。
- 控制 API 必須使用 `Authorization` header，不回傳 CORS header。
- 控制 API 拒絕任何帶 `Origin` 的請求；unknown／encoded control path 不會落入 Viewer root。
- TaskProgress 資料路由使用 same-origin；為了相容舊用法，LocalWebService 新增可設定 CORS，而非全面改掉舊預設。
- 控制模式停用舊的未授權 `GET /shutdown`，Launcher `stop` 使用帶 token 的 `POST /__localwebservice/v1/shutdown`；非控制模式仍保留舊行為。
- 不提供「把本機絕對路徑放在 query 就直接讀取」的 API。

token 用來防止瀏覽器中的其他網站註冊敏感檔案；它不防範已經取得同一 Windows 使用者權限的惡意程式。

## Launcher 命令與設定

第一版直接改造既有 C# `task-progress.exe`。EXE 保留報告驗證、scope store、Windows protocol 與瀏覽器入口；Python 只負責執行 LocalWebService，不再由 C# 維護第二套 Web Server。

目前命令：

```text
task-progress.exe <project-folder>
task-progress.exe <project-folder> --no-browser
task-progress.exe service status
task-progress.exe service stop
```

Launcher 自動探索或由環境變數取得：

- TaskProgress Viewer root。
- LocalWebService `localHost.py` 路徑。
- Python 執行檔路徑。
- host，預設 `127.0.0.1`。
- port，預設 `8001`。
- 使用者專屬 state file 路徑，例如 `%LOCALAPPDATA%` 下的 Launcher 狀態目錄。

設定不應寫死 `C:\Users\Yu5h1` 或特定磁碟；捷徑只需保存 Launcher 與專案路徑。

## 錯誤處理

Launcher 應輸出可行動的原因：

- 找不到 `report.json`。
- JSON 格式無效或 schema 版本不支援。
- `report.dev.json` 的 `report_id` 不匹配。
- scope 不符合 Viewer 規則。
- port 已被非 LocalWebService 程式佔用。
- port 上是 LocalWebService，但 Viewer root 不是 TaskProgress。
- state file 過期、process 已結束或 token 不一致。
- state file 已存在時，Launcher 必須先以 health、`instance_id`、pid 與 port 證明它可重用或已過期；不可直接覆寫，也不可刪除仍屬於存活 instance 的 state file。
- 相同 scope 已指向另一個尚存在的專案。

Launcher 不會自動關閉不明 process、取代不同專案的 scope，或換用其他 port 後不告知使用者。

## 實作階段

### Phase 1：LocalWebService 控制面（已完成）

- 已將現有 exact-file 尋找改為 process 內可安全更新的 thread-safe registry。
- 已實作版本化 health、status、files CRUD 與 shutdown API。
- 已加入 token、instance ID、Host 驗證、控制 API Origin/CORS 限制與安全 state file 生命週期。
- 已保留現有 `--file` 作為啟動時的 initial registry。
- 已保留 legacy CLI、`create_app(...)`、`serve(...)`、LAN 模式與舊 CORS 預設。

### Phase 2：C# 薄 Launcher（已完成）

- 已重用既有專案路徑解析、JSON 驗證、scope store 與 Windows protocol。
- 已實作 health check、Python process 啟動等待、state file 與 port 衝突處理。
- 已實作 scope 精確檔案註冊與缺少 Developer Report 時的舊路由解除註冊。
- 已實作瀏覽器開啟、`--no-browser`、`service status` 與授權 `service stop`。
- 已移除 C# Kestrel、內嵌 Viewer assets、短期 token URL 與 timeout server。

### Phase 3：Windows 捷徑

- 實際專案捷徑只需保存發布版 EXE 與專案路徑。
- 已連續開啟兩個不同 scope，確認共用同一個 LocalWebService process。
- 已以 BonghuoVR 真實報告確認 Viewer、Developer overlay、reload 與 Console。

### Phase 4：舊實作整理

- C# `task-progress.exe` 已改為呼叫控制 API 的薄層入口。
- README 與 TaskProgress report skill 已同步目前捷徑、可選時間 sidecar 與 Viewer 驗證流程。
- Windows protocol 保留；其他舊入口只在新流程完成驗收後整理。

## 驗證計畫

### LocalWebService

- 未帶 token 或 token 錯誤的控制請求必須失敗。
- 合法的新精確檔案註冊回傳 `201`；相同註冊重送回傳 `200` 與同一 ID。
- 未註冊的同目錄檔案與 traversal 請求回傳 `404`。
- 同路徑不同檔案回傳 `409`。
- hostile Host、任何 control Origin、encoded／unknown control path 必須失敗且沒有控制 CORS header。
- 授權 shutdown 回傳 `202`、process 結束，且 matching state file 移除。
- 現有 14 項測試加上控制面與 CLI help 測試共 25 項全部通過；另已完成真實 process HTTP smoke test。

### Launcher

- 服務未啟動時，一次執行可完成啟動、註冊與開頁。
- 服務已啟動時，不產生第二個 process。
- 連續開啟兩個 scope 後，兩個 URL 都能讀取對應報告。
- 缺少 `report.dev.json` 時仍可開啟完整的觀看者模式。
- 異常 port、過期 state file 與 scope 衝突都有明確錯誤。

### 端到端

- 以 BonghuoVR 真實報告在瀏覽器驗證 Viewer、Developer overlay 與 reload。
- 檢查瀏覽器 Console 無錯誤與警告。
- 確認只暴露 Viewer assets 與已註冊的 JSON，不暴露專案其他檔案。

## 完成條件

- 雙擊任一專案捷徑都能開啟對應 scope。
- 多個 TaskProgress scope 共用同一個 `127.0.0.1:8001` process。
- Launcher 可分辨「服務未啟動」、「正確服務已啟動」與「port 被其他程式佔用」。
- 新 scope 可在不重啟 LocalWebService 的情況下導入。
- Agent 更新原始 JSON 後，Viewer reload 會讀到新內容。
- 現有 Viewer URL 契約與 GitHub Pages 流程不受影響。
- LocalWebService 舊用法與 TaskProgress 現有 Launcher 在整併前仍可使用。
