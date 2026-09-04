# 第三方 Checklist 單項寫入計畫

本檔擁有「非瀏覽器呼叫端如何把單一 check 標記為結果」這件事的設計。需求來源是
`W:\UnityProject\HealthAI\docs\Requirements.TaskProgress.md` 的 HEALTHAI-TASKPROGRESS-1／2／3。
Status 欄由提出方擁有，本檔不寫它；本檔只描述目標方要建什麼、為什麼、以及怎麼算通過。
實作狀態與下一步由 `report.json`／`report.dev.json` 記錄。

## 現況量測（2026-09-05，讀碼確認）

三條需求的 Evidence 逐條核對過，兩條完全成立、一條需要修正：

- **沒有第三方寫入入口——成立。** `service/taskprogress_host.py:895` 的
  `POST /__taskprogress/v1/checklists/{scope}/{task}` 先過 `_browser_write_allowed`（同檔 `:650`），
  它要求 `Origin` 正好等於 `http://127.0.0.1:<port>` 或 `http://localhost:<port>`（`:643`）**且**
  `X-TaskProgress-Editor: 1`。非瀏覽器客戶端沒有 `Origin`，403。同一個 gate 在該檔用了 7 次，
  是刻意邊界。`task-progress checklist request --file` 雖然存在，但呼叫端必須自行組出完整的
  bridge message，且需要 spawn 行程。
- **會覆蓋使用者的重設——成立，且現有的 revision 保護擋不到它。** `ChecklistBridge.cs:110` 的
  `save` 有整檔 revision 比對，擋的是 lost update。天真的寫入端 `load` 拿到**最新** revision 再
  `save`，revision 必然吻合，於是使用者剛 cycle 回 `[ ]` 的那格被安靜寫回 `[x]`。缺的是
  **每格的前提條件**，那是現有機制沒有的維度。
- **端點探索——需求方的 Evidence 需要修正：狀態檔其實已經存在。** `start` 已寫出
  `%LOCALAPPDATA%\TaskProgress\localwebservice-<port>.json`（`LauncherSettings.cs:53`），
  內含 `host`／`port`／`pid`。但它不能直接當對外契約：檔名本身帶 port（要找到它得先知道 port，
  正是要解決的問題）、內含 LocalWebService 的 control bearer token（授權檔案註冊與 **shutdown**，
  不能交給第三方）、且從未對外承諾過形狀。所以 #3 的範圍比提出方估的小：不是從零做探索機制，
  是把已存在的內部狀態切出一個安全、port-independent、有文件的對外投影。

`ApplyManualResults`（`ChecklistDocument.cs:226`）已經免費提供 #1 Acceptance 要的全部三條規則：
agent check 唯讀、`[!]` 必須附 `Observed`、父項狀態由 `DeriveStatus` 衍生。新入口只要走進這個函式，
Acceptance 自動成立。**這是本計畫的核心約束：不新增第二套語意，把新入口接到既有的那一個 parser
上。** `taskprogress_host.py:884` 的註解已把理由寫死——Python 側再解析一次 Markdown，就是
`ChecklistDocument.cs` 旁邊的第二個 parser，而那正是本專案已經修過一次的 drift 來源。

## 兩條不可動搖的性質

這兩條決定了下面所有設計取捨，先寫在前面：

1. **自動標記只能少、不能錯。** 入口失敗（服務沒開、HTTP 不通、前提不符）時，檔案原封不動，
   該格維持 `[ ]`，使用者照原本的方式手動勾。自動標記是省力，不是唯一路徑；它永遠不可以造成
   一個**與事實不符的標記**，也永遠不可以擋住人工標記。
2. **人工標記永遠是後路，且不需要任何額外動作。** 瀏覽器頁面與 WPF host 走的是同一個 parser，
   它們不知道也不在乎這格先前是不是工具寫的。動作完成但自動標記沒成功時，使用者打開頁面勾起來
   即可，沒有需要清理或解鎖的狀態。

## 契約前提：誰可以記錄 manual 結果

`checklist-round/SKILL.md:126` 目前寫的是「the agent runs and records every untagged check；
**the user** interacts only with `[manual]` checks」，流程第 4 步也是「**The user** records and may
later revise each manual check」。提出方的論證（執行者是人、記錄者可以是那個被人操作的工具）成立，
但**目前的文件契約沒有這句話**。先開入口、事後補契約，會做出一個入口與規則互相矛盾的狀態。

因此第 0 階段先改契約，且不需要任何程式碼。要加的限定是：

- manual 結果的記錄者可以是**使用者當下正在操作的互動工具**，前提是該工具能完整見證該 check 的
  `Expect`；
- **測試行程與批次執行器永遠不得寫入 checklist 狀態。** 記錄者是執行後的 agent，不是測試行程；
  測試若寫入，等於每跑一次套件就改動被追蹤的檔案。

`[manual]` 規範的是誰執行、誰提供能力，不是誰把 `[x]` 打上去——這句話要進契約，否則下一個讀到
入口的人會自行推論出別的意思。

## 設計

### 1. 呼叫端的宣告義務（不進文件格式）

**「哪些項目會被自動標記」由實作端擁有，不寫進 `.checklist`。**（2026-09-05 使用者決策）

那個事實是工具或測試單元的性質：程式改一行它就變了，而文件裡的一行字不會跟著變。文件與程式碼
各記一份、由不同的人在不同時機更新，正是本專案已經踩過的 drift 形狀。工具是唯一知道答案的人，
所以由它自己在**執行時**說出來：

```
TestWindow 開始 CheckList 驗證，本次驗證包含項目：1, 2, 3, 7, 10
```

寫成對呼叫端的義務（文件約定，入口不強制）：

- 自動寫入端在一次執行開始時，必須向使用者宣告它這一輪涵蓋哪些 work item／check；
- 只寫它宣告過的那些格子；
- 沒被宣告的項目就是人工項目，工具不碰。

入口本身**不驗證**呼叫端是否有資格寫某一格。理由：會寫錯格子只可能是工具自己的 bug，而宣告與
實作出自同一個作者，文件端的白名單防的是同一個人自己的錯，價值有限；真正會傷害使用者的情境是
「跟使用者搶方向盤」，那由執行者主導的「清空後重跑」流程處理（見設計第 3 節），與資格無關。

### 2. `set`：單格、帶前提的 bridge message

在 `ChecklistBridge.cs:37` 的 `load`／`save` 旁邊加第三種 `set`：

```json
{ "version": 1, "id": "unity-debug-window-1",
  "type": "set",
  "payload": { "workItemId": 1, "checkIndex": 0,
               "status": "passed" } }
```

- **沒有寫入前提。** 早期設計曾要求呼叫端附上 `ifStatus`（「我相信這格目前是 `[ ]`，不是就別寫」），
  2026-09-05 由使用者裁掉——見「決策理由與替代方案」。重跑是執行者刻意發動的，防它沒有意義；
  真正的問題是陳舊，由下一節的 `reset` 處理。
- **呼叫端不需要知道 revision 這個概念。** 服務端自己 load → apply → save 閉環。
  `ChecklistDocumentStore.Save`（`ChecklistDocument.cs:494`）仍會在寫入前重驗一次雜湊，所以兩個
  併發寫入交錯時，輸的一方拿到 `revision_conflict` 而不是覆蓋。低頻寫入下重試一次即可，這是
  刻意的取捨：本入口服務的是單項寫入，不是批次寫入 API。
- `observed`／`resolved` 的規則不重寫，直接落到 `ApplyManualResults` 的既有例外：標成 `failed`
  必須附 `observed`，agent check 一律拒絕，父項狀態由 `DeriveStatus` 衍生。

### 3. `reset`：清空後重跑

**要解的問題是陳舊，不是覆蓋。** 沒有清空機制的話，三次執行前留下的 `[x]` 與這次剛跑出來的 `[x]`
長得一模一樣；更糟的是某項這次根本沒被跑到（程式改壞、分支沒進去），它卻還頂著上一輪的 `[x]`
——**看起來通過，其實沒驗**。執行者需要的是「清空 → 重跑一遍 → 這一輪的結果就是畫面上的全部」。

```json
{ "version": 1, "id": "run-42", "type": "reset", "payload": {} }
```

- 預設把**全部 `[manual]` check** 清回 `[ ]`，連同 `Observed`／`Resolved` 一起清；
- 可選 `targets: [{ "workItemId": 1, "checkIndex": 0 }, …]` 只清指定幾格。工具在重跑前清掉自己
  涵蓋的那些，使用者手動勾的人工項目不受影響；
- **agent check 一格都不動。** `checklist-round/SKILL.md` 寫明 agent 結果是不可變的執行證據、
  resolved 後永不回到 `[ ]`。`reset` 只是把瀏覽器頁面上早就允許使用者一格一格做的事（manual 結果
  本來就可以 cycle 回 `[ ]`）一次做完，這條界線不能鬆——否則清空就變成擦掉證據；
- 父項標記在清空後由 `DeriveStatus` 自動回到 `[ ]`，不需要也不允許呼叫端指定。

`reset` 與 `set` 走同一條 HTTP 路由與同一個授權路徑；發動者是執行者（使用者本人，或未來透過 MCP
操作的 agent），不是被動觸發的工具。

**瀏覽器頁面也提供一個清空按鈕，但必須先彈出確認**（2026-09-05 使用者決策）。這是本專案唯一一個
「一次改很多格」的 UI 動作，所以保險寫在設計裡而不是留給實作決定：

- 確認對話框要說出**這次會清掉幾格**，以及**agent 結果不受影響**；
- 使用者取消時不得發出任何請求；
- 頁面走既有的瀏覽器同源 gate，不需要 token——它本來就是可信編輯器；
- 不做 undo。`.checklist` 是 git 追蹤的檔案，誤觸的復原路徑是 git，不是應用程式內的第二套歷史。

`task-progress checklist request --file` **因此不必改一行**就同時支援 `set` 與 `reset`——它只是把
stdin 餵給 `Handle()`。不另外新增 CLI 寫入 verb（2026-09-05 使用者決策）：呼叫端大多在 web server
環境執行，HTTP 入口已足夠，多一個 verb 就是同一件事的第二個入口。

### 4. HTTP 授權路徑

在 host 新增 `_local_client_allowed(request)`，與現有 `_browser_write_allowed` **並聯**，
且**只用於 checklists 路由**（其他 6 處 gate 不動）：

- 要求 `Authorization: Bearer <client_token>`，token 由 `start` 產生並寫進端點探索檔；
- 且**拒絕任何帶 `Origin` 標頭的請求**——瀏覽器一律走原本那條同源路徑，兩條路徑不重疊。

用 token 而不是「自訂標頭 + 沒有 Origin」：後者實際上是拿 CORS preflight 的行為當安全邊界，太脆弱。
token 放在只有該使用者能讀的 `%LOCALAPPDATA%` 下，網頁讀不到，且可獨立於 LocalWebService 的
control token 撤銷。

### 5. 端點探索

新增 `%LOCALAPPDATA%\TaskProgress\endpoints\<port>.json`，由 `start` 寫、`service stop` 刪：

```json
{ "service": "taskprogress", "api_version": 1,
  "host": "127.0.0.1", "port": 8001,
  "base_url": "http://127.0.0.1:8001",
  "api_prefix": "/__taskprogress/v1",
  "pid": 5820, "client_token": "…", "started_at": "…" }
```

**不含** LocalWebService 的 control token，因此讀到它的第三方無法關閉服務或註冊檔案路由。
用目錄列舉而不是單一 `service.json`，是因為這台機器上已經出現過 8001 與 8123 兩個 port 的殘留
狀態檔，多實例是實況不是假想。

判活步驟寫成文件契約：列舉目錄 → 對候選打 `GET /__taskprogress/v1/health` → **確認回應的 `service`
欄位是 `taskprogress-edit-host`** → 否則視為未啟動。**不看 PID**，避免 PID 重用誤判。
「連得上就算數」不夠：服務當機後那個 port 可能被別的程式佔用，它會回它自己的東西。

陳舊檔案由**下一次 `start` 在寫入前刪掉同 port 的舊檔**——它本來就要寫那個路徑，零額外機制。
不掃描其他 port 的孤兒檔：判活已經會擋掉它們，最壞情況是一次浪費掉的 HTTP 嘗試，
為此加一個定期清理反而是多出來的東西。

呼叫端每次觸發的代價因此是「讀一個小 JSON + 一次 loopback HTTP」，不 spawn 行程、不硬寫 8001。

### 6. 呼叫端看到的東西：一個 HTTP POST

**入口是純 HTTP，語言無關。** 任何能發 HTTP 的東西都能呼叫——C#、Python、PowerShell、Node、
curl 皆同；不同語言的測試單元只是同一個請求的不同寫法，沒有各自的 SDK 需要維護。

```
POST http://127.0.0.1:8001/__taskprogress/v1/checklists/healthai/unity-editor-debug-window
Authorization: Bearer <endpoints/8001.json 的 client_token>
Content-Type: application/json

{"version":1,"id":"debug-window-1","type":"set",
 "payload":{"workItemId":1,"checkIndex":0,"status":"passed"}}
```

`healthai` 是 scope，`unity-editor-debug-window` 是 checklist 檔名（不含副檔名），`workItemId` 是
文件裡的編號，`checkIndex` 是該項底下第幾個 check（從 0 起算）。一次執行的完整形狀是先發一個
`reset`（帶 `targets` 或不帶），再對每個通過的項目各發一個 `set`。

兩種回應，呼叫端各自的處置：

| 回應 | 意義 | 呼叫端該做什麼 |
|---|---|---|
| `type:"result"` | 已寫入 | 什麼都不用做 |
| 連不上／403／`type:"error"` | 服務沒開、設定不對，或該格不可寫 | 安靜略過，該格留給人工 |

兩者都不應該中斷呼叫端自己的流程——見「兩條不可動搖的性質」第 1 條。

不能發 HTTP 的呼叫端仍有既有的行程入口：把同一個 JSON 從 stdin 餵給
`task-progress checklist request --file <path>`，形狀完全相同。它不需要 token 與探索檔，
但需要 spawn 行程，且要自己知道檔案路徑。

## 分階段

| 階段 | 內容 | 交付 |
|---|---|---|
| 0 | 修訂 `checklist-round/SKILL.md` 的記錄者條款與呼叫端宣告義務 | 只有文件，無程式碼 |
| 1 | `ChecklistBridge` 新增 `set` 與 `reset` | #1 規則面 ＋ 清空重跑 |
| 2 | host `_local_client_allowed` ＋ token 產生 ＋ 只改 checklists 路由的 gate | #1 傳輸面 |
| 3 | `endpoints/<port>.json` 寫入／刪除 ＋ 判活契約 | #3 |
| 4 | `taskprogress-capabilities/SKILL.md` 入口表新增一列、handoff 與 report 記錄 | 路由 |

階段 1 完成後，提出方就能用 `checklist request` CLI 先驗規則面；階段 2 之後才是它要的無行程路徑。

**不另外寫一份操作教學 skill**（2026-09-05 使用者決策）：入口就是一個 HTTP POST，形狀已完整寫在
本檔第 6 節，需要時直接讀這裡。階段 4 只補入口表那一列——本專案記錄過兩次「入口已存在但沒人找得到，
於是被重造一次」（2026-09-02 的 Artifact 清單、2026-09-04 的 Checklist 檢視器），那一列是防第三次的
最低成本，且**不得在階段 2 完成前加**：一份指向尚不存在的入口的路由，會讓下一個 session 照著做卻失敗。

## 驗證

- **C#**（`tests/TaskProgress.Checklist.Tests`）：`set` 寫入成功、agent check 被拒、`[!]` 缺
  `Observed` 被拒、父項衍生正確；`reset` 清空全部 manual、`targets` 只清指定幾格、
  **agent check 在兩種 `reset` 下都未被改動**、清空後父項回到 `[ ]`、`Observed`／`Resolved` 一併清除。
- **Python**（`tests/test_taskprogress_host.py`）：token 正確、token 錯誤、無 token、帶 `Origin`
  的 token 請求須拒、既有瀏覽器路徑未回歸。
- **端到端**：對 `healthai` scope 實跑。它已登記在 `scopes.json` 指向 `W:\UnityProject\HealthAI`，
  路由算出的 `W:\UnityProject\HealthAI\checklists\<task>.checklist` 直接可用。跨磁碟不影響——
  暫存檔與目標同目錄，`File.Replace` 在同一磁碟區內。
- **人工後路**：自動寫入後，同一格仍可在瀏覽器頁面上被 cycle 回 `[ ]`；服務停止時工具的呼叫失敗
  而檔案未被改動。這兩條對應「兩條不可動搖的性質」，必須實測而非推論。
- **頁面清空按鈕**：確認對話框顯示正確的格數；取消時不發出任何請求、檔案未被改動；確認後 agent
  結果未被改動。
- **端點判活**：停掉服務後留下孤兒檔，另起一個不相干的 HTTP 服務佔用同一個 port，呼叫端必須因
  `service` 欄位不符而判定未啟動——這是「連得上就算數」會漏掉的那個案例。
- 最後由提出方對它自己的 Acceptance 驗過，**再由該檔自己**把 Status 改成 implemented；
  本專案不寫那個欄位。

## 決策理由與替代方案

- **不在 Python 側解析 Markdown。** 那會建立 `ChecklistDocument.cs` 旁邊的第二個 parser，
  `taskprogress_host.py:884` 已警告過；本專案已因兩份 parser drift 修過一次 round-anchor 格式 bug。
- **不在 `.checklist` 裡新增 `Witness` 之類的欄位宣告「哪些項目可自動標記」**（2026-09-05
  使用者決策，推翻同日稍早的提案）。該事實由實作端擁有，文件再記一份就是第二個 owner，
  工具改一行程式碼文件就過期。改由工具在執行時自行宣告，見設計第 1 節。連帶放棄的是「入口依文件
  白名單拒絕越權寫入」這個副作用——衡量後不划算，理由同節。
- **不做 `ifStatus` 寫入前提**（2026-09-05 使用者決策，推翻同日稍早的提案）。原設計要求每個 `set`
  附上「我相信這格目前是什麼狀態」，不吻合就回 `precondition_failed`。它防的是「工具在使用者不知情時
  被重複觸發」，而該情境的唯一證據（Unity `OnEnable` 每次 domain reload 重跑）已由使用者收回為
  不精確的例子。實際流程裡重跑是**執行者刻意發動的**，防它沒有意義；換來的是每個呼叫端都要為一個
  不會發生的保護多想一個必填欄位。真正存在的問題是**陳舊**（舊結果與本輪結果無法區分），由 `reset`
  處理。
  **這表示本設計不滿足 HEALTHAI-TASKPROGRESS-2**，其 Acceptance 正是「能發出帶前提的寫入請求並
  觀察到被拒絕」。本檔只記錄這個設計事實與理由；`Requirements.TaskProgress.md` 由提出方擁有，
  本專案不寫它，提出方依本設計自行修正該檔。評估過但未採用的中間路線是把 `ifStatus` 做成選填——
  那會留下一段沒有呼叫者的程式碼。
- **不在文件格式裡區分「工具寫的」與「人點的」結果**（2026-09-05 使用者決策）。那會動到格式與所有
  consumer。工具與使用者互搶的情境改由「執行者清空、再重跑」的流程處理，不由格式或寫入前提處理。
- **不新增 CLI 寫入 verb**（2026-09-05 使用者決策）。呼叫端大多在 web server 環境，HTTP 已足夠。
- **不寫操作教學 skill**（2026-09-05 使用者決策）。入口是一個 HTTP POST，形狀寫在本檔第 6 節即可。
- **不提供 C# client helper／SDK。** 入口是一個 HTTP POST，各語言自己接即可；一個 helper 會變成
  第二個需要跟著 bridge 契約同步演進的東西。此項未被要求，僅記錄邊界。
- **不重用 LocalWebService 的 control token。** 它授權 shutdown 與檔案註冊；交給第三方等於交出
  關閉服務的權力。
- **不放寬其他 6 處 `_browser_write_allowed`。** report 編輯 session 有自己的信任模型，本計畫
  不碰它。

## 未決事項

無。2026-09-05 全部定案，本檔即設計全文。實作狀態與下一步由 `report.json`／`report.dev.json` 與
`handoff.md` 的 Next steps 記錄，不寫在這裡。
