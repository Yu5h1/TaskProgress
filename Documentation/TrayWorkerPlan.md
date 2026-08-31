# TaskProgress Tray Worker 計畫

> 狀態：設計已於 2026-08-27 定案；Phase 1（`worker` role）已實作並通過不啟動服務的測試，Phase 2–5 未開始。
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

TrayHost 擁有的 process 只有 `task-progress.exe worker` 一個。LocalWebService 是 worker 的子孫 process，TrayHost 既不啟動也不終止它；tray 看到的伺服器狀態，全部是 worker 回報的觀測結果。依賴方向固定為 TrayHost → worker → LocalWebService，反向沒有依賴。

## 摘要

TaskProgress 現在只有一次性 CLI：使用者執行 `task-progress start`，它確認服務、註冊報告、開瀏覽器，然後 process 結束。這份計畫替 `task-progress.exe` 新增第二個 process role —— 常駐的 `worker` —— 讓 Winform 的 TrayHost 能以既有的 manifest／JSON Lines 契約把它當成 owned worker 託管，並在系統匣持續顯示 LocalWebService 是否正在執行。

生命週期是綁定的：**tray 在，服務就該在；tray Exit，服務就停。** tray 圖示本身就是開關，所以選單裡不再有 Start／Stop。這也讓 standalone 選單維持 TrayApp 契約原本的 Restart／Exit 兩項，不需要為本專案破例。

## 目標流程

以下是五個階段全部完成後的樣子，不是目前狀態。

### 啟用（第一次）

```text
使用者：task-progress start --tray
│
├─ task-progress.exe（短命，前景 Console）
│  └─ 執行 Yu5h1Lib.TrayHost.exe invoke <manifest> --standalone -- status
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

worker 進入迴圈後，最初那個 status request 才被回應：

```text
invoke ──status──► TrayHost ──► worker ──► "Ready | 127.0.0.1:8001 | PID 1234 | 4 scopes"
│
├─ 把該行印到 Console
├─ 開啟 http://127.0.0.1:8001/（除非 --no-browser）
└─ 短命 process 結束，Console 關閉
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

hover 圖示、開啟 tray 選單、Settings 的 Refresh，以及 60 秒的背景保險，各自觸發一次 `status`。畫面先顯示上一次結果，再以回應更新。

### 日常使用

| 動作 | 發生什麼 |
|---|---|
| 再次 `start --tray` | mutex 已存在，invoke 直接走 pipe，不啟動任何 process，重用同一組 tray／worker／python，然後開瀏覽器 |
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
再啟動一個 host（不是走 start --tray）
├─ 取不到 mutex
├─ 送 activate 到既有 instance pipe
├─ 既有 instance 浮出 Settings 視窗
└─ 第二個 process 結束
```

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

這不是擴充 `start`，而是在它旁邊新增一個 process role，重用它已經擁有的能力。

`start` 的三個步驟（確認服務、註冊報告與 catalog、開啟 Viewer）確實就是 tray 需要的動作，`worker` 會直接呼叫同一組函式。但 `start` 有三項語意與 worker 相斥，不能靠加參數解決：

| `start` 現況 | worker 的要求 |
|---|---|
| 做完就結束 process | 必須常駐，等待並回應 request |
| 人看的訊息寫進 **stdout**（`Console.WriteLine`） | stdout 是 protocol channel，只能有 JSON lines；一行人類訊息就會讓 `TrayAppJsonLinesProtocol.ParseOutputLine` 抛 `JsonException` |
| 以 `ServiceLaunchMode.VisibleConsole` 開一個獨立 Python console | TrayHost 以 `CreateNoWindow=true` 啟動 worker；tray-only 的用法不應該再彈出視窗 |

另外 `start` 在沒有登記任何 scope 時直接抛 `CliException`。worker 不能這樣：伺服器或設定有問題時，tray 仍必須起得來並把問題顯示出來，否則使用者連看見錯誤的地方都沒有。

因此 `start` 不帶新選項時行為與輸出保持不變，`worker` 是新增的第三個 role（現有兩個是一次性 CLI 與 `task-progress://` protocol 啟動）。`start` 只多一個 `--tray` 選項作為 tray 的啟動入口，見下面「啟動入口」。

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

### 啟動入口：`start --tray`

使用者不需要記 TrayHost 的命令列。

```text
task-progress start --tray [--no-browser]
```

它不自己確認服務，而是轉呼叫 TrayHost 的 lazy bootstrap：

```text
Yu5h1Lib.TrayHost.exe invoke <manifest> --standalone -- status
```

`TrayAppInvoker` 已經完整處理了「pipe 不在就啟動 host、等 pipe、送一次 request、印出結果、結束」。因此 `start --tray` 天生冪等：第一次把 tray 叫起來，之後每一次都只是跟既有的 tray 講話。**單一實例的保證直接來自 TrayHost，本專案不另做一套。**

- 印出 invoke 回傳的 `status` 那一行，使用者立刻看到服務起來了沒。
- 未指定 `--no-browser` 時，在 invoke 成功後開啟 Viewer root，與現有 `start` 的行為一致。
- invoke 失敗（TrayHost 找不到、worker 起不來、manifest 無效）以非零 exit code 與 stderr 訊息結束，不留下半開的狀態。

TrayHost executable 的位置沿用本專案既有的探索方式：先看 `TASK_PROGRESS_TRAY_HOST` 環境變數，再向上搜尋同層的 Winform 專案 —— 與 LocalWebService 的尋找規則同一套，不新增第二種探索邏輯。

`--tray` 與 `--port` 互斥。tray 的 port 由 manifest 的 `process.environment` 決定（TrayApp 契約禁止透過 IPC 覆寫啟動參數），命令列給的 port 不會生效，所以直接以錯誤拒絕，而不是安靜忽略。

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

沒有 `start` 與 `stop` 操作。服務的啟動屬於 worker 啟動流程、停止屬於 worker 結束流程，兩者都由 tray 的存在與否決定；把它們再開放成 request，等於把「tray 在但服務停著」變成可達狀態。要重啟服務就用 standalone 選單既有的 `Restart` —— 它重啟 worker，服務隨之重來，不必新增任何選單項目。

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

**這裡需要 Winform 端的改動**：目前 `TrayHostOptions` 只允許 App 提供 icon 與命令文字，Core 沒有讓 App 設定 tooltip 的入口。計畫是加一個與既有 `SetIcon` 對稱的 `SetStatusText`，內容完全由 App 決定。Core 因此仍然不認識任何產品 schema。

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
| `start --tray` 走 TrayHost 的 `invoke` 而不是 `host`（2026-08-27 使用者決策） | `invoke` 本來就是 lazy bootstrap：不在就啟動、在就重用。走 `host` 等於在本專案再寫一次「已經開著就不要重開」，而那正是 TrayHost identity 已經保證的事 |

**已排除：讓 TrayHost 直接以 service profile 託管 python（2026-08-27 使用者決策）。** Winform 的 `Documentation/TrayHost.md` 有一份 `task-progress` service profile 草圖（HTTP health probe + `localwebservice-control` shutdown adapter），由 TrayHost App 直接啟動 `localHost.py`。它需要在 C# 的 TrayHost App 內重建 health identity 驗證、ownership 證據比對與授權 shutdown —— 全部是 `LocalWebServiceClient` 已經有的東西，而且 trayhost skill 明確要求把服務專屬的 launch、health、identity、ownership 與 shutdown 留在擁有該服務的 client adapter。

## 驗收與遷移

分階段，前兩階段完全在 TaskProgress 內，不需要 Winform 有任何改動即可驗證：

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
- `Program.cs`：`--tray` 選項、與 `--port` 互斥、`StartTrayAsync`。
- **只呼叫 `invoke`，不呼叫 `host`。** 單一實例由 TrayHost identity 保證，本專案不寫第二套。

### Phase 3 之前要修的 Winform 問題

TrayHost 的 `invoke` 以系統 ANSI codepage 輸出 `payload.stdout`（實測 CP950），任何非 ASCII 字元對 UTF-8 讀取端都會變成亂碼。這不只影響本專案——任何 worker 回傳非 ASCII 都會被 mangle。修法是在 TrayHost 的進入點設定 `Console.OutputEncoding = Encoding.UTF8`，與 `task-progress` 自己的 `Main` 一致。屬於 Winform 的共用行為，隨 Phase 3 一起處理。

### Phase 3：Winform 端觀測

- Core 新增 `SetStatusText` seam；App 在選單開啟、Settings Refresh 與低頻保險時查詢 `status`，顯示於 tooltip 與 Settings。
- 驗收：worker `Ready` 但服務 `Stopped` 時，兩個狀態分別正確顯示。

### Phase 4：Winform 端重複啟動

- `activate` broker request；第二次啟動浮出既有 Settings 視窗後結束。
- 驗收：重複執行 `host --standalone` 只留下一個 tray、一個 worker。

### Phase 5：手動 gate

依 trayhost skill，tray 互動與 no-window process 屬於手動驗證，不能以 build 或 headless 檢查代替：

- tray 出現時服務已經起來；tooltip 隨服務起停更新。
- 重複啟動的實際行為。
- 手動終止 python process 後，tooltip 在下一次查詢內變成 `Stopped`；`Restart` 能復原。
- Exit 時服務被停止，兩種來源都要各驗一次：worker 自己啟動的，以及先用 `task-progress start` 開好、由 worker 捕捉的。
- Exit 後沒有殘留的 `task-progress.exe` 或 python process。

### 完成條件

- `start`、`open`、`service`、`scope`、`analyze` 的輸出與 exit code 與改動前逐字相同。
- worker 的 stdout 在任何路徑下都只有 protocol lines。
- 同一份 manifest 在同一 session 只會有一個 tray 與一個 worker。
- LocalWebService 的 health、ownership 與 shutdown 規則在整個 repository 仍只有一份實作。

## 尚未決定

無。
