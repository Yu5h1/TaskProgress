# TaskProgress Tray Worker 計畫

> 實作與驗證狀態見 handoff.md。TrayHost 共用能力的需求由 [Requirements.Winform.md](Requirements.Winform.md) 記錄，本專案只擁有 TaskProgress worker 與入口。
>
> 與其他文件的關係：Launcher 與 LocalWebService 控制契約見 [LauncherPlan.md](LauncherPlan.md)；TrayHost 元件與 App 責任邊界見 Winform 的 `Documentation/TrayHost.md`；manifest、`host`／`invoke` 與 standalone identity 契約見 Winform 的 `Documentation/TrayApp.md`。已建置與待驗證狀態見 [../handoff.md](../handoff.md)。

## 系統階層與關係

```text
Yu5h1Lib.TrayHost.exe（Winform 專案擁有）
├─ standalone instance identity（manifest id + canonical path）
├─ Tray：icon、Restart／Exit、狀態顯示
├─ Settings 視窗：worker 狀態與 LocalWebService 觀測結果
└─ Winform Core TrayHost
   └─ owned worker：task-progress.exe worker（TrayHost 唯一啟動的 process）
      └─ TaskProgress Launcher 既有能力（本專案擁有）
         ├─ LauncherSettings：viewer root、python、state file、port
         ├─ LocalWebServiceClient：health identity、ownership、註冊、授權 shutdown
         └─ LocalWebService（python localHost.py）── 由 worker 擁有，TrayHost 不直接接觸
```

**專案邊界：本專案不修改 Winform。** TrayHost 一律以**已發布的 Release binary** 使用，需要它改變的行為列在 [Requirements.Winform.md](Requirements.Winform.md)，由該專案自行決定是否與何時實作。本文件的實作階段只涵蓋 TaskProgress 這一側。

TrayHost 擁有的 process 只有 `task-progress.exe worker` 一個。LocalWebService 是 worker 的子孫 process，TrayHost 既不啟動也不終止它；tray 看到的伺服器狀態，全部是 worker 回報的觀測結果。依賴方向固定為 TrayHost → worker → LocalWebService，反向沒有依賴。

## 摘要

TaskProgress 由短命的啟動入口與常駐 `worker` 組成。使用者雙擊或執行 `task-progress start` 時確認服務並註冊報告；只有明確指定 `--browser` 才開啟瀏覽器。常駐的 `worker` 讓 Winform 的 TrayHost 能以既有的 manifest／JSON Lines 契約把它當成 owned worker 託管，並在系統匣持續顯示 LocalWebService 是否正在執行。

生命週期是綁定的：**tray 在，服務就該在；tray Exit，服務就停。** tray 圖示本身就是開關，所以選單裡不再有 Start／Stop。這也讓 standalone 選單維持 TrayApp 契約原本的 Restart／Exit 兩項，不需要為本專案破例。

## 目標流程

### Manifest 路徑與取消契約

TaskProgress 只解析並提供與自身 executable 同目錄的完整 `taskprogress.trayapp.json` 路徑。`ResolveManifest` 不以檔案存在與否阻擋呼叫，也不建立、複製、編輯或驗證 manifest 內容。

TrayHost 單一擁有缺檔初始化、schema 2 草稿、Manifest Editor、Save 驗證與取消語意。缺檔時由 TrayHost 開啟編輯器；Save 驗證成功後繼續原命令。既有文件的編輯與驗證結果也由 TrayHost 決定；TaskProgress 只依取消或失敗結果處理，不提供自動覆寫或 fallback。需要具備此契約的 TrayHost 版本，不能以 TaskProgress 的純測試推定外部 binary 已支援。

TaskProgress 提供自己擁有的 Worker 恢復提示：`--init-executable task-progress.exe --init-argument worker`。每次 invoke 都以 ArgumentList 將提示放在獨立 `--` 前；TrayHost 只在缺檔時用它預填 executable 與啟動參數，相對 executable 由 manifest 所在目錄解析。既有 manifest 完全忽略提示；正常 build／publish 仍攜帶專案的 canonical manifest。TaskProgress 不檢查缺檔、不寫入草稿，也不複製 TrayHost 驗證邏輯。

完整呼叫為 `invoke <完整 manifest 路徑> --standalone --buildIcon --init-executable task-progress.exe --init-argument worker [--no-notify] -- <Worker request arguments>`。standalone、通知與 request payload 維持原契約。TaskProgress 的處理如下：

| TrayHost 結果 | TaskProgress 行為 |
|---|---|
| exit 0 | 保留既有 stdout 輸出與成功流程；指定 --console 才接續觀察日誌 |
| exit 1（關閉／Cancel Manifest Editor） | 正常傳回取消結果，TaskProgress exit 1；不輸出啟動失敗、不拋 CliException、不顯示失敗對話框、不進日誌觀察或任何 fallback |
| 其他非零 exit | 沿用 CliException 錯誤流程，保留 stderr 詳情；stderr 空白時回報 exit code |
| executable 解析、程序啟動或權限例外 | 沿用既有錯誤處理，不視為使用者取消 |

範圍為既有 launcher 內的小幅整合修改，不新增狀態或 manifest 資料來源。Focused contract tests 以程序呼叫替身驗證缺檔／既有檔、參數與 output、不寫 manifest、取消與錯誤分流；`--tray-launcher-only` 不啟動子程序、GUI 或服務。真實缺檔編輯器、Save 後繼續、Cancel／關閉及損壞文件的 TrayHost 實機流程另外核查。

以下是完整可用時的樣子。標示「需要 Winform」的部分尚未具備，其餘實作與驗證狀態見 handoff.md。

### 啟用（第一次）

```text
使用者：task-progress start
│
├─ task-progress.exe（WinExe，預設無視窗）
│  └─ 執行 Yu5h1Lib.TrayHost.exe invoke <manifest> --standalone --buildIcon -- start
│     ├─ 查 standalone mutex → 不存在
│     ├─ 啟動 Yu5h1Lib.TrayHost.exe host <manifest> --standalone
│     └─ 等 instance pipe 出現
│
├─ TrayHost host（常駐，WinForms）
│  ├─ 取得 mutex ← 單一實例在這裡成立
│  ├─ 依 Windows 亮暗模式載入 icon → 系統匣出現圖示
│  ├─ 開啟 instance pipe
│  └─ 啟動 owned worker：task-progress.exe worker（CreateNoWindow）
│
└─ task-progress.exe worker（常駐，無視窗）
   ├─ 1. 立刻送出 ready ──► TrayHost 認定 worker Ready
   ├─ 2. EnsureAsync → 啟動 python（無視窗）→ 等 health 通過
   ├─ 3. 註冊所有 scope 的 report 路由與 catalog
   └─ 4. 進入 request 迴圈
```

worker 進入迴圈後，最初的 start request 才執行並回應：

```text
invoke ──start──► TrayHost ──► worker ──► 確認服務／註冊 scope → 回傳結果／通知
│
├─ 把該行印到 Console
├─ 指定 --browser 才開啟 http://127.0.0.1:8001/
└─ 預設結束；指定 --console 則持續唯讀觀察日誌
```

因為 ensure 是等待完成的，這一行 status 反映的已經是服務起來之後的狀態，不是啟動中的暫態。

### 常駐

```text
Yu5h1Lib.TrayHost.exe          常駐   系統匣圖示
└─ task-progress.exe worker    常駐   無視窗
   └─ python（LocalWebService） 常駐   無視窗
```

一個圖示、零個視窗、三個 process。

### 觀測

hover 圖示、開啟 tray 選單、Settings 的 Refresh，以及低頻背景保險，各自觸發一次 `status`。畫面先顯示上一次結果，再以回應更新。**（需要 `TP-WINFORM-2`。目前服務狀態只出現在 `start` 的 Console 輸出。）**

### 日常使用

| 動作 | 發生什麼 |
|---|---|
| 再次 `start` | mutex 已存在，invoke 直接走 pipe，不啟動任何 process，重用同一組 tray／worker／python，然後開瀏覽器 |
| Explorer 捷徑 | `invoke <manifest> --standalone -- open --scope <id>`，同上，開該 scope |
| 直接開瀏覽器 | 服務已在，直接連 `127.0.0.1:8001` |

### 異常

| 狀況 | 結果 |
|---|---|
| python crash | 下一次 `status` 回報 `Stopped`；tray 的 `Restart` 重啟 worker，worker 重新 ensure |
| worker crash | TrayHost 顯示 `Faulted`；`Restart` 重來 |
| port 被別的程式占用 | `status` 回報 `Conflict`，不接管、不 kill、不覆寫 state |

### 重複啟動

```text
再啟動一個 host（不是走 start）
├─ 取不到 mutex
├─ 送 activate 到既有 instance pipe      ← 需要 TP-WINFORM-3
├─ 既有 instance 浮出 Settings 視窗
└─ 第二個 process 結束
```

走 `start` 的路徑不受影響：它用 `invoke`，重複執行本來就是跟既有 tray 講話。

### 結束

```text
tray → Exit
├─ TrayHost 停止接收 request
├─ 送 cooperative shutdown 到 worker 的 stdin
├─ worker：呼叫授權 shutdown → python 正常結束
├─ worker 結束
├─ TrayHost 釋放 pipe、icon、Settings 視窗
└─ 圖示消失，三個 process 歸零
```

不論 python 是這次 worker 啟動的，或是啟動時捕捉到的既有 process，Exit 都會停掉它。整段要在 manifest 的 `shutdownSeconds`（15 秒）內完成，逾時 TrayHost 才會 force-stop worker，那時 python 會變成孤兒留下來。

## 與 `start` 的關係

`start` 是短命的命令入口，透過 TrayHost invoke 將命令交給常駐 worker。TrayHost 擁有單一實例、啟動與等待 ready；worker 擁有服務啟動、scope／catalog 註冊與就緒判斷。CLI 不另開 Python console，也不複製常駐管理機制。

`checklist <file>` 與雙擊 `.checklist` 仍直接開啟本地 WPF，不需要 Web 或 Tray。`checklist validate/request` 保持純命令；Browser 的 `/checklist` 才需要本地服務。其他 `open`／protocol 入口維持既有契約。

## 問題與目標

### 問題

- 每次要看報告都得執行一次 `start`，開一個 Console 視窗，看完就沒有常駐入口。
- 沒有任何常駐介面能回答「LocalWebService 現在還活著嗎」，只能再跑一次 `task-progress service status`。
- 服務在背景 crash 時沒有任何可見訊號。

### 目標

- `task-progress.exe` 提供符合 `trayhost-jsonlines-v1` 的常駐 worker，能被 TrayHost 以 manifest 託管。
- Tray 出現代表服務已啟動，tray Exit 代表服務已停止；中間服務若異常結束，tray 要看得出來。
- Tray 與 Settings 視窗顯示的是 LocalWebService 的實際狀態，不是 worker process 的狀態。
- 同一份 manifest 在同一個使用者 session 只會有一個 tray instance 與一個 worker。
- LocalWebService 的所有 launch、health、identity、ownership 與 shutdown 規則仍然只有一份實作。

### 非目標

- 不在 tray 選單增加 Start／Stop：tray 的存在與否就是那個開關，多一組內部開關只會製造「tray 在但服務停著」這種需要額外解釋的狀態。
- 不在 TrayHost App 內重新實作 LocalWebService 的 health probe、state file 或授權 shutdown。
- 不從 worker 開啟任何 GUI（Checklist 的 WebView2 視窗在 worker 模式一律拒絕）。
- 不改動 `start`、`open`、`service`、`scope`、`analyze` 現有的行為與輸出。`start` 只新增一個選項，不帶該選項時逐字不變。
- 不讓 tray 接管或停止**無法證明擁有權**的 LocalWebService（`Conflict`）。能以 state file 與 token 證明的，捕捉與停止都是允許的。

## 責任邊界

| 元件 | 擁有 | 不擁有 |
|---|---|---|
| TrayHost App（Winform） | tray icon、standalone 單一實例、Settings 視窗、worker process 生命週期、狀態查詢節奏 | LocalWebService 的啟動、health 判斷、token、state file、shutdown |
| `task-progress worker` | 常駐迴圈、JSON Lines framing、把 request 轉成既有 CLI 命令、輸出通道隔離 | tray UI、單一實例規則、icon |
| `LocalWebServiceClient` | 現有全部：探測、身分驗證、註冊、路由清理、授權 shutdown、port 衝突拒絕 | 顯示、查詢節奏 |
| LocalWebService（python） | 靜態檔案與控制 API | 呼叫端如何顯示它 |

狀態資料的流向是單向的：`LocalWebServiceClient` 觀測 → worker 序列化成一行文字 → TrayHost App 當成不透明字串顯示。TrayHost 不解析 TaskProgress 的 schema，這是它不會被綁進本專案領域的原因。

## 設計

### 新增 process role

```text
task-progress worker
```

沒有其他參數。啟動後：

1. 立刻在 stdout 輸出 `{"protocol":1,"type":"ready"}` 並 flush。**在做任何服務工作之前**，因為 tray 必須先能顯示出來，才有地方報告後續的錯誤。
2. 執行一次 `EnsureAsync` + 註冊全部 scope 與 catalog（等同現有 `start`，但用 no-window 模式且不開瀏覽器）。成功或失敗都寫進目前狀態，供 `status` 讀取。
3. 逐行讀 stdin，每行是一個 request，序列處理。
4. stdin 讀到 EOF 時結束 process。這是 host 異常死亡時的孤兒防護。

第 1 步與第 2 步的順序是刻意的。若先確認服務再回報 ready，服務啟動失敗時 tray 根本不會出現，使用者會看到「什麼都沒發生」而不是錯誤訊息。

第 2 步是**等待完成**而不是丟到背景。ready 已經送出，tray 早就在了，所以背景化換不到任何可見性，卻會帶來兩個代價：request 與 ensure 並行存取同一份狀態，以及 ensure 途中抵達的 `status` 會短暫回報 `Stopped`。等待期間送來的 request 留在 stdin pipe 裡，並不會遺失。

**這一步不能有任何會抛出的東西逃到外面。** 設定解析失敗（例如 viewer root 找不到）同樣要被記下來並由 `status` 回報 `Error`，不能讓 worker 死掉——那會連帶讓 tray 消失，正好在最需要顯示錯誤的時候。

### 啟動入口：`start`

> Task ID: startup-observer

Volume: touches ~15 files / adds ~250 lines.
Precedent: existing TrayHost output contract; new read-only log observer.
Proof: targeted unit/process tests; Windows Tray/Console UX requires manual checks.

```text
task-progress [start [--browser] [--console]]
  → TrayHost invoke <manifest> --standalone --buildIcon -- start [--browser]
  → 不存在則啟動 Host，等待 broker／worker ready
  → worker 確認服務與註冊 scope，確認服務可連線
  → 回傳結果並通知；指定 --browser 時開啟 Viewer
```

- 已存在的 TrayHost 直接接收命令；單一實例與 ready 等待由既有 `TrayAppInvoker`／TrayHost 管理，不另建輪詢或第二個啟動器。
- `--tray` 已移除，使用舊參數會回錯誤。`--no-open` 保留為 `--no-browser` 的別名。
- `start` 不接受 `--port`；目前 worker 使用 `LauncherSettings.DefaultPort`。其他命令的 port 選項保持原契約。
- worker 的 protocol ready 只表示可接收命令，不表示本地 Web 服務已就緒。`start` 必須等服務可連線才回成功與 Viewer 連結；啟動失敗回非零，worker 保留錯誤供 `status` 查詢。
- `status` 仍是觀察命令，不會重新啟動服務。`start` 則會重新確認服務並更新已註冊 scopes。
- 空 scope 清單沿用 worker 契約，可啟動並顯示空目錄。
- 首次 worker 初始化會啟動服務；隨後 start 命令會再確認並註冊一次。服務由既有 ownership 檢查重用，仍有重複分析／註冊成本。
- 發布此版本後，需先由使用者關閉舊 TrayHost，再啟動新版本，使常駐 worker 載入新增的 start 命令。CLI 不自動強制重啟舊實例。

TrayHost executable 先由 `TASK_PROGRESS_TRAY_HOST` 指定，否則向上搜尋 Winform 的 Release 輸出。一般使用者權限即可運作；agent 的沙箱外啟動流程由 TaskProgress capabilities skill 擁有。

#### 日誌與觀察器

TaskProgress Host 層捕捉 LocalWebService stdout／stderr 至 state 同目錄的 `.log`，不修改共用 LocalWebService。每檔約 1 MiB、最多兩份備份；檔頭 generation 供觀察器辨識輪替，完整 UTF-8 行才輸出。拒絕把日誌放在公開 Viewer root。磁碟寫入失敗不遞迴記錄自身錯誤，也不停止服務。原有 visible-console 啟動路徑會同步輸出至 Console。

`--console` 留在呼叫端，定期讀取日誌與既有健康狀態；不取得服務所有權、不呼叫 shutdown。舊服務沒有日誌時提示需更新重啟。Tray、worker、LocalServer 沿用原有生命週期；不增加第二套 Tray 或服務管理器。不新增 Tray 選單與跨專案功能。

CLI 保留管線輸出；Windows GUI subsystem 在互動 cmd.exe 不保證 shell 等待。需要依序執行並讀取退出碼時，使用 PowerShell 或 cmd 的 `start "" /wait task-progress.exe <命令>`。純查詢使用 `--help`，不能再以無參數列舉能力。

核查清單：[startup-observer.checklist](../checklists/startup-observer.checklist)。發布時 manifest 已變更，舊 Host 須先 Exit 再啟動新版本；此操作與實機驗收分開授權。

#### 驗收

- 無參數與 start 預設只啟動 Tray／服務；--browser 才開啟 Viewer。接受 no-browser／no-open，拒絕 tray、port 與未知參數。
- WinExe 不自動建立 Console；--console 附加既有 Console 或建立觀察窗，持續顯示 LocalServer 日誌。關閉／Ctrl+C 只結束觀察，服務仍由 Tray 管理。
- 啟動通知的時機與文案由 TrayApp 擁有。TaskProgress Worker 只確認服務就緒並回傳網址或錯誤，不追蹤通知狀態，也不產生「已啟動／已在執行」通知文案；manifest 的 output 政策仍由 TrayApp 解讀。
- 管線 stdin／stdout、退出碼與 checklist／decisions 檔案啟用維持相容。
- 服務啟動失敗回 command_failed，不印出就緒連結、不開瀏覽器；worker 仍可回答 status。
- TrayHost 不存在時啟動並等待 ready；存在時沿用同一實例。服務停止後再次 start 可恢復。
- checklist 開檔／validate／request 維持無 Tray 依賴。
- 實機啟動、沿用、Exit 與瀏覽器行為另作人工驗收。

### 輸出通道隔離

worker 模式下：

- **stdout**：只有 protocol JSON lines。
- **stderr**：診斷訊息。
- 命令本身的人類可讀輸出：寫進注入的 `TextWriter`，最後成為 response 的 `payload.stdout`。

實作方式是 worker 啟動時**一次性**把 `Console.Out` 導向一個緩衝區，真正的 stdout 在導向之前就被取走，成為唯一寫得出 protocol line 的 handle。命令主體一行都不用改。

原本的草案是把 writer 一路傳進每個命令主體。放棄它的理由是保證強度不同：傳 writer 的話，呼叫圖裡**任何一處**漏掉的 `Console.WriteLine`——包括之後才寫的程式——都會直接污染 protocol 而讓對面拋出一個看起來毫不相干的 `JsonException`；一次性導向則讓漏網變成不可能，漏掉的輸出只會落進 response payload。protocol 的正確性是全有全無的，這種地方要的是結構保證，不是紀律。

命令主體因此完全不知道自己在 worker 裡執行，這也是 `start` 的輸出能逐字不變的原因。

### 操作集合

request 的 `payload.arguments` 就是既有的 CLI 參數向量，worker 不發明第二套命令語彙：

| arguments | 行為 |
|---|---|
| `["status"]` | 回報 LocalWebService 觀測結果。**永遠不啟動任何 process。** |
| `["open", "--scope", "<id>"]` | 開啟該 scope 的 Viewer URL |
| `["scope", "list"]` | 列出已登記 scope |

`start` 只確認服務並同步註冊；沒有獨立 `stop` request。服務的啟動屬於 worker 啟動流程、停止屬於 worker 結束流程，兩者都由 tray 的存在與否決定；把它們再開放成 request，等於把「tray 在但服務停著」變成可達狀態。要重啟服務就用 standalone 選單既有的 `Restart` —— 它重啟 worker，服務隨之重來，不必新增任何選單項目。

未知的 arguments 回傳 `error.code = "unknown_operation"`，不停止 worker。單次 request 失敗（例如 port 被別的程式占用）同樣只是失敗的 response，worker 保持 `Ready`。

`checklist` 與任何會開視窗的命令在 worker 模式一律拒絕。

### `status` 的內容

`status` 走 `LocalWebServiceClient.TryConnectAsync`，它已經包含 health identity 與 instance／root 驗證，所以「port 上有東西」與「那是我們的服務」是分開的。回傳一行摘要，例如：

```text
Ready | 127.0.0.1:8001 | PID 12345 | 4 scopes
Stopped | 127.0.0.1:8001
Conflict | 127.0.0.1:8001 | <診斷>
```

前綴是固定字彙（`Ready`／`Stopped`／`Conflict`／`Error`），後面是人看的細節。

**分隔符刻意用 ASCII。** 這一行會經過 TrayHost 的 `invoke` 轉手，而它以系統 ANSI codepage 輸出——實測 `—` 變成 CP950 的 `a1 58`，被 UTF-8 讀取端解成亂碼。ASCII 不受任何 codepage 影響。TrayHost App 只需要能顯示整行；若之後要依狀態換 icon，再讀前綴即可，這是刻意留的最小結構。

### 結束與擁有權

worker 收到 cooperative shutdown（tray Exit 或 Restart）時停止它正在服務的那個 LocalWebService，**不論那是它自己啟動的，或是它啟動時捕捉到的既有 process**。

擁有權證據是「連得上」本身，不是「我 spawn 的」。`LocalWebServiceClient` 要連上就必須先通過 health instance_id、受保護 state file、其中的 token 與 web root 四項比對；那正是 `TrayHost.md` 對「安全 reattach，繼續管理」所要求的證據，而繼續管理本來就包含停止。反過來說，連不上的服務也停不掉——沒有 token 就呼叫不了授權 shutdown——所以外來 process 不需要另一條規則保護，它在機制上就已經碰不到。

因此不需要保留 `StartedNewProcess` 作為關閉條件。實際效果：先用 `task-progress start` 開了 Console 版服務，再啟動 tray，tray 會捕捉它；之後 tray Exit 會把它一起停掉。這是刻意的——同一個 root 與 port 上只會有一個 LocalWebService，而 tray 是那一段期間的擁有者。

唯一不會被停止的是 `Conflict`：port 上的東西不是我們的服務，從頭到尾就沒有被管理過。

### 服務狀態怎麼被觀測到

每次 `status` 都重新走一次 `TryConnectAsync`，回應即為當下的權威答案。它已經包含 health identity 與 instance／root 驗證，因此不需要另外維護一份被推斷出來的狀態。

TrayHost App 端向 worker 送 `status` request，把回傳的整行字串當成**不透明文字**顯示於 `NotifyIcon` tooltip 與 Settings 視窗的一個欄位。查詢時機是選單開啟、Settings Refresh，以及一個低頻的背景保險（預設 60 秒）。畫面先畫上一次的結果，再以完成結果更新，查詢不在 UI thread 執行。

`status` 必須維持便宜且沒有副作用 —— 它不啟動任何東西。

**原本規劃以 `Process.Exited` 作為主訊號，Phase 1 沒有採用。** 服務確實是 worker 的子 process，worker 也拿得到 `Process`，但 `trayhost-jsonlines-v1` 只有 ready、response 與 fatal，**沒有 worker 主動推送的通道**。worker 提早知道服務掛了，並不會讓 tray 提早看到——tray 仍然要等到自己來問。因此那個訂閱在有推送路徑之前不會產生任何可見效果，Phase 1 不實作，`LocalWebServiceClient` 也因此完全沒有被改動。真正決定偵測延遲的是 App 端的查詢時機。

**這一段依賴 Winform 提供能力，本專案不實作它**：目前 `TrayHostOptions` 只允許 App 提供 icon 與命令文字，Core 沒有讓 App 設定 tooltip 的入口。需求與理由見 `TP-WINFORM-2`。在那之前，服務狀態只能由 `task-progress start` 印在 Console，tray 本身顯示不出來。

### 單一實例

TrayHost 已有 standalone 的互斥機制：identity 由 manifest 的 `id` 與 canonical path 推導，`host` 模式取不到 mutex 就結束。要讓「不能重複」成立，還需要補三件事：

1. **只保留一份 manifest。** identity 含 canonical path 是刻意的（避免不同專案的同名 manifest 互連），所以同一份 manifest 被複製到兩個位置就會產生兩個 tray、兩個 worker，並同時搶 port 8001。對策是規定 `taskprogress.trayapp.json` 只放在 `Build/win-x64/`，與 `task-progress.exe` 同目錄，由 `Publish.cmd` 一起輸出。不要改 Winform 的 identity 規則來繞過這點。
2. **重複啟動要浮出既有 instance，而不是靜默結束。** 現在第二個 process 直接 `return 0`，使用者會以為沒反應而再點一次。計畫是在既有的 instance pipe 上新增一個 `activate` broker request，第二個 process 送出後由既有 instance 打開 Settings 視窗，再結束自己。
3. **worker 必須在 stdin EOF 時自己結束。** 否則 host 異常死亡後殘留的 worker 會讓下一次啟動變成兩個 worker。

伺服器層的重複由既有機制擋住，不需要第二套防護：state file 與 port 已經保證同一個 root 只有一個 LocalWebService，外來的 listener 會被判為衝突而不是被接管。

已知限制：mutex 是 `Local\` 前綴，只在同一個 Windows session 內互斥。快速使用者切換或 RDP 的第二個 session 會有自己的 tray，兩者搶同一個 port 時由既有的衝突路徑拒絕接管。

### Manifest

`Build/win-x64/taskprogress.trayapp.json`：

```json
{
  "schema": 2,
  "id": "task-progress",
  "displayName": "TaskProgress Local Server",
  "icon": {
    "light": "light.ico",
    "dark": "dark.ico"
  },
  "protocol": "trayhost-jsonlines-v1",
  "process": {
    "executable": "task-progress.exe",
    "arguments": ["worker"],
    "workingDirectory": "."
  },
  "timeouts": {
    "startupSeconds": 30,
    "requestSeconds": 60,
    "shutdownSeconds": 15
  }
}
```

啟動方式固定使用 standalone 的 `invoke`（見「啟動入口」）。不要使用 `host` 直接啟動，也不要使用 TrayHost 的 legacy 無動詞啟動 —— 後者用的是另一個 mutex 名稱，不受上面的單一實例規則保護。

## 案例

**看一眼服務還在不在。** 使用者把游標移到 tray icon，tooltip 顯示 `Ready | 127.0.0.1:8001 | PID 12345 | 4 scopes`。沒有任何視窗被開啟，沒有 process 被啟動。

**服務背景 crash。** python process 結束的瞬間 `Process.Exited` 觸發，worker 狀態改為 `Stopped`，tooltip 隨下一次查詢更新。worker 本身仍是 `Ready`，因為 worker 沒有掛 —— 這正是 worker 狀態與服務狀態必須分開顯示的理由。使用者要復原就按 tray 的 `Restart`。

**結束。** 使用者在 tray 選 `Exit`。TrayHost 送出 cooperative shutdown，worker 停掉它服務中的 LocalWebService，再結束自己；tray 消失時服務已經停了。

**Explorer 捷徑開啟報告。** 捷徑執行 `invoke <manifest> --standalone -- open --scope task-progress`。tray 沒起來時它先啟動 host，起來後直接重用同一個 worker 與同一個 LocalWebService，不會多開 process。

## 決策理由與替代方案

| 決策 | 理由 |
|---|---|
| worker 是新的 role，不是 `start` 的參數 | 輸出通道、生命週期與失敗語意三者都相反，共用同一個進入點只會讓兩邊都變成特例 |
| LocalWebService 的擁有權留在 `task-progress.exe` | 探測、身分、token、state file、衝突判斷已經是一份 659 行的實作；搬進 TrayHost App 等於做出第二份 |
| tray 顯示的是不透明字串 | Core 與 App 都不需要認識 TaskProgress 的 schema，換成其他服務時同一條路徑仍然成立 |
| 操作集合直接用既有 CLI 參數向量 | 不產生第二套命令語彙，也不需要維護兩份說明 |
| `status` 不啟動任何東西 | 它是被反覆查詢的觀測操作；有副作用的觀測會變成無法預期的重啟來源 |
| Exit 停止服務不分「啟動的」或「捕捉的」（2026-08-27 使用者決策） | 使用者要的是「tray 沒了服務就沒了」，沒有例外。而且連得上就代表 identity、state file、token 與 root 都比對過，那就是擁有權證據；連不上的本來就停不掉，不需要第二條規則 |
| 生命週期綁在 tray 上，選單不放 Start／Stop（2026-08-27 使用者決策） | tray 圖示本身就是開關。多一組內部開關會讓「tray 在但服務停著」變成合法狀態，而那個狀態沒有任何使用者價值，卻要在 UI、文件與測試三處各解釋一次。服務重啟由 standalone 選單既有的 `Restart` 提供 |
| 服務存活以 `Process.Exited` 為主訊號，health 查詢只當保險 | 服務是 worker 的子 process，事件即時且不花成本；把定時查詢當主訊號會在偵測延遲與查詢頻率之間做一個不必要的取捨 |
| `start` 走 TrayHost 的 `invoke` 而不是 `host`（2026-08-27 使用者決策） | `invoke` 本來就是 lazy bootstrap：不在就啟動、在就重用。走 `host` 等於在本專案再寫一次「已經開著就不要重開」，而那正是 TrayHost identity 已經保證的事 |

**已排除：讓 TrayHost 直接以 service profile 託管 python（2026-08-27 使用者決策）。** Winform 的 `Documentation/TrayHost.md` 有一份 `task-progress` service profile 草圖（HTTP health probe + `localwebservice-control` shutdown adapter），由 TrayHost App 直接啟動 `localHost.py`。它需要在 C# 的 TrayHost App 內重建 health identity 驗證、ownership 證據比對與授權 shutdown —— 全部是 `LocalWebServiceClient` 已經有的東西，而且 trayhost skill 明確要求把服務專屬的 launch、health、identity、ownership 與 shutdown 留在擁有該服務的 client adapter。

### Phase 1：worker role（純新增）—— 已實作，待實機驗證

- `WorkerProtocol.cs`：ready、request 解析、success／failure 序列化。
- `WorkerCommand.cs`：一次性 stdout 導向、ready-first、ensure、request 迴圈、stdin EOF 結束、結束時停止服務（不分啟動或捕捉）、`WorkerSession` 保存 endpoint 與啟動錯誤。
- `Program.cs`：抽出 `LoadRegisteredReports` 與 `EnsureServiceAsync` 供 `start` 與 worker 共用（`start` 行為不變），新增 `worker` 分派與說明。
- `LocalWebServiceClient` 未改動，理由見「服務狀態怎麼被觀測到」。
- 測試（`tests/TaskProgress.Cli.Tests/WorkerTests.cs`，全部不啟動服務）：ready 單行、request 解析與拒絕、多行輸出仍是單行 protocol line 且可還原、failure code、空 scope store 可正常啟動、設定無法解析時回報 `Error` 而非死掉、stdout 由導向而非紀律保護。
- 測試 harness 新增 `--pure`，只跑不啟動服務的套件。
- **待驗證**：實際以管道灌 JSON lines 跑一次 `task-progress worker`。它會以 no-window 方式啟動 Python，屬於需要使用者授權的執行，未由 agent 執行。

### Phase 2：manifest 與發布 —— 已實作

- `src/TaskProgress.Cli/taskprogress.trayapp.json`（schema 2）與 `light.ico`／`dark.ico` 為簽入來源，csproj 以 `Content` 複製到輸出與發布目錄，因此 `Build/win-x64/` 由既有的 `Publish.cmd` 自動帶出，不需要改它。icon 由 TrayHost 的 `--BuildIcon` 產生，取 `displayName` 首字 `T`。
- `TrayHostLauncher.cs`：executable 探索（`TASK_PROGRESS_TRAY_HOST` → 向上找 `Winform/bin/TrayHost/{Release,Debug}/`）、manifest 解析（與自己的 executable 同目錄）、轉呼叫 `invoke ... --standalone -- <args>`。
- `Program.cs`：start 參數與 TrayHost invoke 分派。
- **只呼叫 `invoke`，不呼叫 `host`。** 單一實例由 TrayHost identity 保證，本專案不寫第二套。

## 對 Winform 的需求

本專案不修改 Winform，也不建置它——TrayHost 以 `Winform/bin/TrayHost/Release/` 的已發布 binary 使用。tray 要完整可用所缺的目標專案能力，連同量到的證據、驗收條件與本專案目前的繞法，列在 [Requirements.Winform.md](Requirements.Winform.md)：`TP-WINFORM-1` UTF-8 輸出、`TP-WINFORM-2` App 可設定的 tray 狀態文字、`TP-WINFORM-3` 重複啟動浮出既有 instance、`TP-WINFORM-4` 小圖示尺寸載入。

該檔是那些需求的唯一來源，此處不重述內容。

## 驗收與遷移（TaskProgress 這一側）

### Phase 5：手動 gate

依 trayhost skill，tray 互動與 no-window process 屬於手動驗證，不能以 build 或 headless 檢查代替：

- tray 出現時服務已經起來。（tooltip 隨服務起停更新要等 `TP-WINFORM-2`。）
- 重複啟動的實際行為。
- 手動終止 python process 後，tooltip 在下一次查詢內變成 `Stopped`；`Restart` 能復原。
- Exit 時服務被停止，兩種來源都要各驗一次：worker 自己啟動的，以及先用 `task-progress start` 開好、由 worker 捕捉的。
- Exit 後沒有殘留的 `task-progress.exe` 或 python process。

### 完成條件

- `open`、`service`、`scope`、`analyze` 維持原契約；start 契約依「啟動入口」驗收。
- worker 的 stdout 在任何路徑下都只有 protocol lines。
- 同一份 manifest 在同一 session 只會有一個 tray 與一個 worker。
- LocalWebService 的 health、ownership 與 shutdown 規則在整個 repository 仍只有一份實作。

## 尚未決定

無。
