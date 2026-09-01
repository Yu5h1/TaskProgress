# 對 Winform 的需求

> 需求對象：Winform（`Yu5h1Lib.WinForm` Core 元件與 `Yu5h1Lib.TrayHost` 可執行 App）
> 提出方：TaskProgress
> 消費方式：`Winform/bin/TrayHost/Release/` 的已發布 binary。提出方不修改、不建置、也不綁定該專案的 Debug 輸出。
> 狀態：4 項待處理、0 項已實作
> 最後更新：2026-08-31

這些是 TaskProgress 的系統匣整合實作完成後，仍然缺少的目標專案能力。每一項都附上量到的證據與可驗收條件；提出方已用註明的方式繞過或直接缺著，因此沒有任何一項會擋住目標專案的既有工作。

背景設計見 [TrayWorkerPlan.md](TrayWorkerPlan.md)。狀態欄位由提出方維護：目標專案實作後，由提出方以下列驗收條件確認過才會改成「已實作」。

## TP-WINFORM-1｜`invoke` 的輸出要用 UTF-8

- **狀態**：待處理（提出 2026-08-31）
- **需求**：`invoke` 印出 `payload.stdout` 時使用 UTF-8，而不是系統 ANSI codepage。
- **證據**：worker 回傳的 `—`（U+2014）經 `invoke` 輸出後實測為 `a1 58`，即 CP950 的編碼；UTF-8 讀取端解成亂碼。修法應為在 TrayHost 進入點設定 `Console.OutputEncoding = Encoding.UTF8`，與呼叫端 `task-progress` 自己的 `Main` 一致。
- **驗收**：worker 回傳含中文或日文的 `payload.stdout`，`invoke` 的呼叫端逐字取得相同字串。
- **影響範圍**：所有 cooperative worker，不只提出方。任何 worker 回傳非 ASCII 都會被破壞。
- **提出方的繞法**：狀態行只使用 ASCII 分隔符。錯誤訊息中的中文仍會亂碼。

## TP-WINFORM-2｜一個由 App 設定的 tray 狀態文字

- **狀態**：待處理（提出 2026-08-31）
- **需求**：Core TrayHost 提供一個讓 App 設定 `NotifyIcon` 顯示文字的入口，與既有的 `SetIcon` 對稱（例如 `SetStatusText`）。內容是 App 給的不透明字串，Core 不解讀、不解析呼叫端的領域資料。
- **證據**：`TrayHostOptions` 目前只接受 icon 與命令文字，Core 沒有任何設定 tooltip 的公開途徑。因此 tray 能顯示的只有 **worker process 的狀態**（`Starting`／`Ready`／`Faulted`），而那與**被管理服務的狀態**是兩回事：worker 活著時，它啟動的服務仍可能已經停止。使用者實測在 Settings 只看得到 worker 的 `Starting → Ready`，看不到服務的端點或 PID。
- **驗收**：worker 為 `Ready` 而服務為 `Stopped` 時，兩者分別顯示且不互相冒充。
- **影響範圍**：任何管理外部服務的 worker。worker 存活與服務可用是不同的事實，目前只表達得出前者。
- **提出方的繞法**：無。服務狀態目前只能由 `task-progress start --tray` 印在 Console，tray 本身顯示不出來。

## TP-WINFORM-3｜重複啟動要浮出既有 instance

- **狀態**：待處理（提出 2026-08-31）
- **需求**：`host --standalone` 取不到 single-instance mutex 時，通知既有 instance 顯示其 Settings 視窗，然後才結束自己。
- **證據**：目前第二個 process 直接 `return 0`，畫面上完全沒有反應。使用者無法分辨「已經開著」與「啟動失敗」，因而會重複點擊。instance pipe 已經存在，缺的是一個 activate 類的 broker request。
- **驗收**：連續執行兩次 `host --standalone`，只留下一個 tray，且第二次會讓既有 Settings 視窗浮出並取得焦點。
- **影響範圍**：所有 standalone Host 的使用者。
- **提出方的繞法**：提出方的入口 `start --tray` 走 `invoke` 而非 `host`，而 `invoke` 本來就會重用既有 instance，因此這條路徑不受影響。直接執行 `host` 的使用者才會遇到。

## TP-WINFORM-4｜以小圖示尺寸載入 tray icon

- **狀態**：待處理（提出 2026-08-31）
- **需求**：載入 tray icon 時指定 `SystemInformation.SmallIconSize`，而不是讓 `new Icon(stream)` 自行挑選。
- **證據**：`new Icon(stream)` 在多尺寸 `.ico` 上取到 32×32，再由 Windows 縮到 16×16 顯示；該檔案本身含有 16×16 frame，直接命中會更銳利。以 `new Icon(path, SystemInformation.SmallIconSize)` 實測可正確取得 16×16 frame 且 handle 有效。
- **驗收**：多尺寸 `.ico` 在系統匣顯示時使用其 16×16 frame。
- **影響範圍**：所有使用多尺寸 icon 的 Host。純顯示品質，不影響功能。
- **提出方的繞法**：不需要。目前的顯示可接受。
