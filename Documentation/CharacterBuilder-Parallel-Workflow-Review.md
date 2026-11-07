# CharacterBuilder A–F 跨平台協作檢討

```text
既有 TaskProgress
├─ 任務卡／項目 → 目標、相依、文件連結與分派紀錄
├─ checklist → 同一項目的指示、執行、返工及他驗證據
├─ 分派者 → 認領、分組、收件、合併與主線紀錄
└─ 平台 session → 實際執行與獨立驗收
   └─ 無接續通道時，由使用者啟動；內容仍從文件取得
```

## 問題與範圍

使用者於 2026-11-07 要求核對這輪 A–F：哪些是分派者沒有照既有流程做、哪些是規則不足、哪些是平台限制，並提出最小改善。目標是讓 agent 讀取共同的指示與開發方向，減少使用者轉貼與接續協調。「請繼續 A」只是例子，不是固定命令或成功標準。

本紀錄屬於[同一 repo 的多 agent 平行執行](WorktreeReportPlan.md)卡片。檢討沿用 `character-builder-abcdef-workflow-retrospective`，後續試行沿用 `document-driven-session-continuation`；進度由 Report 擁有。先前檢討與唯讀試行的範圍及證據見下文；使用者後續授權將已驗證部分補入既有共用規則，入口見〈已驗證做法的共用入口〉。未新增服務，也不追補虛構的 A–F 認領或他驗紀錄。

## 核對依據與適用邊界

| 既有來源 | 已有要求 |
|---|---|
| [task-progress：Verification and its checklist](../.agents/skills/task-progress/SKILL.md#verification-and-its-checklist) | 執行前提交 checklist 與綁定，指示與可觀察條件放在同一項目 |
| [agent-executable-items：Where an item lives](../../.agents/skills/agent-executable-items/SKILL.md#where-an-item-lives)、[One writer on the main line, one per worktree](../../.agents/skills/agent-executable-items/SKILL.md#one-writer-on-the-main-line-one-per-worktree) | 沿用工作所屬任務卡，接手者經 Report 讀項目及 checklist，不讀轉貼摘要；主線只有分派者寫入 |
| [task-progress：Queues and sessions](../.agents/skills/task-progress/SKILL.md#queues-and-sessions) | 依 Paths／Needs 分組，分派前認領；分派者依相依合併、重建並記錄，再進獨立他驗 |
| [task-progress：Execute](../.agents/skills/task-progress/SKILL.md#execute-run-and-the-instruction-form)、[Independent acceptance](../.agents/skills/task-progress/SKILL.md#independent-acceptance) | 返工沿用同項目；改做後舊的通過結果失效；建立、執行或修改條件的上下文不能擔任他驗 |
| [agent-work-route：Work alongside another agent](../../.agents/skills/agent-work-route/SKILL.md#work-alongside-another-agent)、[Keep work a person takes part in on the main line](../../.agents/skills/agent-work-route/SKILL.md#keep-work-a-person-takes-part-in-on-the-main-line) | 一般開發也要按可合併範圍分工；分派者負責主線；使用者參與的畫面驗證在主線進行 |

完整 task-progress 流程以明確 invocation 啟動。這輪聊天沒有該 invocation，所以「沒有完整綁定」應判為**沒有採用已有機制及一般分派接續不足**，不能一概說成違反已啟動的 task-progress 隊列。一般開發仍受 agent-work-route 與共享紀錄責任約束；未啟動隊列也不能讓交付只存在聊天。

2026-11-07 核對結果：

- `report get` 的 `worktree-report-decisions`、`parallel-rules` 均為 `derived_state: done`；不能因儲存值仍為 planned 就重做已完成的規則。
- CharacterBuilder 沒有本地 `report.json` 或 `checklists/`，handoff 將進度指向 data-driven 的 `limb-system-foundation`。該 Report 中未找到這輪 A–F 的對應分支或交付檔參照，六個分支也沒有 checklist 交付；檢討文字不能取代正式的項目紀錄。
- data-driven 該卡另有既存規範項目，不能把它們當作這輪 A–F，更不能為了補歷史而複製建立 A–F。
- 跨 repo 的 checklist 寫入限制已由既有 `document-binding/cross-scope-checklist-recorder` 追蹤，見 [handoff](../handoff.md)。這次不另開相同問題、不擴充此機制；試行先選有本地 Report 與有效綁定的既有項目。

## 後續主線整合（2026-11-07）

使用者另行授權合併 B～F 後，CharacterBuilder 主線已在 `ff3f880` 包含全部六個分支；76 項定向測試與三種 GLB 命令驗證通過。合併提交、驗證範圍、需備份的兩個 repo 及六個保留 worktree，由 [CharacterBuilder 整合與備份紀錄](file:///W:/Yu5h1Lib/CharacterBuilder/Documentation/Parallel-Work-Integration.md) 擁有。此處保留下面 `f142cdd` 時點的歷史核對，不再把那時尚未合併的狀態當成目前狀態。

## A–F 對照

下表是 2026-11-07 的歷史核對，CharacterBuilder 主線為 `f142cdd`。聊天技術檢查及使用者對 C／E 的確認仍是本輪證據；沒有把它們追認為 CLI 已記錄的獨立他驗。

| 項目 | 實際證據 | 判定與責任 |
|---|---|---|
| A：窄面板 | `5bf146d` 實作、`acc5a85` 文件修正；合併 `7664b6b` 後才完成 8090 畫面驗證，`f142cdd` 記錄 | **我未接完主線階段。** 已有主線驗證規則，仍留待使用者催辦；不是平台不能操作畫面 |
| B：裙子來源 | `2973bfa` 交付，`b5a1422` 補 GLB／描述檔逐位元組比較；分支另提交 bin 下產物 | **我未建立原項目的返工入口。** 修正要求靠另一份聊天指示；單一產物主線重建已有規則，未在分派中落實，不能歸咎工作者 |
| C：三角面調查 | 起初查無固定交付，後以 `d5571ec` 提交 `Documentation/Triangle-Quadrangulation-Investigation.md` | **我未先指定可收件成果。** 唯讀不代表沒有交付文件；後來要求使用者再提供內容，是前面分派與路由不足的代價 |
| D：凍結 GLB 測試 | `38c9314` 僅交付 `skin/frozen-glb-roundtrip.test.mjs`，先前定向測試 5/5 | 隔離與測試有成果；**共同缺口是未接 Report／checklist 的接續紀錄**，沒有證據顯示需要新增測試流程 |
| E：skin 文件 | `7c868f6` 交付，`7d59192` 修正歷史驗收日期；使用者確認 C／E 已驗收 | **我未讓返工回到同一文件入口。** 日期是一般正確性問題；反覆要求轉貼是協作問題，兩者不應混為平台限制 |
| F：輸出保留測試 | `186ecff` 僅交付 `authoring/output-preservation.test.mjs`，先前定向測試 6/6 | 隔離與測試有成果；與 D 相同，**未接正式接續紀錄**，不能因此說實作本身未完成 |

另有兩項共同回報缺失：

1. 當時只有 A 已合入主線；B～F 的分支尖端均非主線祖先。我用「A～F 全部通過」概括了分支檢查、使用者確認、合併與主線驗證，應改報各自證據範圍。這次不重做測試、不自行合併其他分支。
2. 本 chat 參與分派及條件整理，不能把自己的檢查稱為 task-progress 的獨立他驗。已有規則足夠清楚；問題是我沒有區分技術預檢與正式他驗。本次分類不推翻使用者確認，也不虛構其他平台已符合獨立性。

## 三類原因

| 類別 | 核對結論 | 最小處理 |
|---|---|---|
| 我沒有落實已有安排 | 分派先變成聊天長文；交付位置、同項目返工及主線收尾沒接上；不同完成階段被混稱通過 | 直接使用既有卡、項目、checklist、分派者及獨立他驗規則；不新增制度 |
| 規則接續不足 | 一般自然語言分派不啟動完整隊列，但 agent-work-route 的一般委派段沒有明確要求先留下唯一接續入口；跨平台人工啟動後如何回既有項目收件也未寫清 | 建議僅在一般委派規則補「先落檔再交辦」，在 Queues 的無啟動能力分支補「文件收件與人工喚醒邊界」；本輪先提出文字，不改共用技能 |
| 能力紀錄不足 | Agent specifics 仍把 Codex 啟動 session 視為未記載；本宿主實際提供 chat 管理工具 | 更新時以當前宿主工具及授權條件為據，不把某平台一律寫成不能，也不推定外部平台能互通 |
| 平台限制 | 本宿主可查閱／等待既有 Codex chat，傳訊需使用者明確授權；目前工具沒有連到 Claude／Antigravity 的傳訊入口 | 未授權時不發訊；沒有外部通道時保留人工啟動，內容與成果仍落文件。工具存在不等於本輪已實測互通 |
| 既有產品限制 | worktree 自動追蹤仍屬 WorktreeReportPlan 後續階段；跨 repo acceptance 寫入另有既有問題項目 | 活躍分派者直接讀已知 worktree／提交；試行避開跨 repo 寫入限制，不新建掃描或通知服務 |

## 最小試行方案

沿用既有工作安排，先在一個已有本地 Report、有效 checklist 綁定的 scope 選兩個現成且範圍不重疊的項目。這是後續試行的建議，不是本輪已啟動執行。

| 時點 | 沿用的動作 | 能接續到哪裡、何時需要使用者 |
|---|---|---|
| 開始前 | 分派者核對原項目的目標、文件、Paths／Needs、固定成果位置、相依及驗收資格，主線先記分派；沿用穩定項目參照 | agent 可完成資料核對與分組。若要啟動整個 task-progress 隊列，仍需既有明確 invocation；不用每項重新交代內容 |
| 工作者啟動 | 從 Report 讀原項目及指示，只改自己的 worktree；依原位置提交成果與定向驗證 | 同一份已授權工作中的實作與自測由 agent 接續。沒有平台啟動通道時，由使用者開啟工作 chat，交項目參照即可 |
| 收件／返工 | 活躍分派者直接讀已知 worktree、提交與 checklist；分支預檢失敗回原項目，指向未滿足的原條件 | 分派者可自行查找交付，不要求使用者轉貼回報；若分派者已結束而外部平台不能喚醒它，仍需使用者喚醒一次，可合併一批通知 |
| 合併／他驗 | 分支預檢後由分派者依依賴合併、主線重建並記錄，再交獨立上下文他驗；失敗回同項目修正，重新驗證 | 在已授權且 session 活躍時可接續既有操作；缺少獨立上下文或啟動通道時，使用者仍須啟動驗收 chat；不讓建立者自己驗過 |
| 主線收尾 | 完成真正頁面／產物驗證，按原項目記錄結果與下一步 | 可量測的畫面與行為由 agent 驗；產品取捨、真正需要人工的檢查、接管衝突及既有安全閘門才交使用者 |

這個方案能消除完整指示重貼、成果全文轉貼、每次返工重建任務及另催主線收尾；它不能在無接續通道時消除外部 chat 的人工啟動，也不能保證兩個已停止的 session 自動互相喚醒。共享文件提供可接續狀態，活躍的執行上下文才會讀它並做下一步。

### 已驗證做法的共用入口

兩輪文件交接、直接收件與同參照重讀的做法，由 [agent-work-route〈Hand off through the existing item〉](../../.agents/skills/agent-work-route/SKILL.md#hand-off-through-the-existing-item) 擁有；[task-progress〈Queues and sessions〉](../.agents/skills/task-progress/SKILL.md#queues-and-sessions) 引用該段，不另抄一套程序。本文件保留試行證據。

外部平台通知、停止 session 的喚醒、完整開發返工與合併仍需實測；沒有將這些未驗證部分升格成已具備的能力，也沒有調整 invocation、認領或正式他驗規則。

試行沿用 `document-driven-session-continuation`，不另建協調卡或狀態檔。以一輪實際的「分派、交付、一次返工、他驗、主線驗證」核對：使用者不轉貼完整指示或成果；每次人工啟動皆能說明缺少哪個通道；所有 agent 能從原項目找到同一份指示、成果與未完成條件。完整開發與跨平台階段需各自取得實測證據，不能由文件交接結果推定通過。

## 文件接續試行（2026-11-07）

### 本輪指示與交付

使用者以 `$task-progress run document-driven-session-continuation` 啟動，範圍是既有試行項目；沿用現有卡片、項目與文件，不新增服務、不重做已完成項目，先驗證可省掉哪些手動轉貼，未驗證部分保留未完成。

- **唯一項目參照**：`task-progress › worktree-report › document-driven-session-continuation`。權威 Report 在 `C:\Users\Yu5h1\Dev\VSProjects\Yu5h1Lib\TaskProgress\report.json`；狀態以 `report get` 的 `derived_state` 為準，不以本文件當成第二份狀態檔。
- **本輪動作**：分派者只提供項目參照與 repo 位置，讓不繼承本聊天的唯讀上下文，經 Report 自行找到本節、交付位置、下一步與驗證限制；不讓該讀取者認領、啟動隊列或改其他項目。
- **固定交付位置**：本文件下節〈本輪證據與接續〉。唯讀上下文回傳來源與缺口，分派者直接收件寫入；如有真正缺口，修正原文件後，仍以同一項目參照請它重讀，不由使用者搬運內容。
- **本輪核對者的交付**：指出它實際使用的檔案與章節、解析到的本輪目標／交付位置／下一步、缺少的資訊，以及有無需要完整聊天才能判定的部分；不能用「文件有寫」推論完整開發或跨平台互通已通過。
- **可用上下文的界線**：本次可使用 Codex 宿主內不繼承聊天的唯讀子 agent；這不是 Claude／Antigravity 的跨平台通知實測，也不是綁定 checklist 的 CLI 獨立他驗。
- **本輪之後的下一步**：先整理上述實際交接證據與手動訊息次數；完整兩項平行、實作返工、分支合併、正式獨立他驗及外部平台喚醒，須等有適合的現成未完成項目及實際通道才驗證，不重置已完成項目製造情境。

### 本輪證據與接續

本節只記本次試行實際發生的動作、來源版本、交接結果與其限制。項目的持續進度仍由既有 Report 擁有。

第一輪在指示提交 `dc00441` 上執行。分派者以 Codex 宿主的 `spawn_agent` 啟動 `fork_turns: none` 的唯讀上下文 `continuation_reader`，委派內容只有 repo、項目參照、規則入口與唯讀限制，沒有貼上本輪指示或預期結論。

該上下文自行使用正式 CLI `report get --scope task-progress --task worktree-report`，讀到 revision `37c29414581c65382075e5d8d94d924b1a4affe96204cc1db6869af727e5d9e8`、原項目 `derived_state: in_progress`，再經 title 找到本節。它回報本輪目標、固定交付位置、下一步及未驗證範圍均可由文件解析，不需要原聊天；並指出交付章節當時尚未記錄實際收件與訊息統計。分派者直接收到回覆，將這份證據寫回同一交付章節，沒有請使用者轉貼。

它實際讀取的來源鏈為：AgentsRule／AgentsKnowledgeIndex → TaskProgress handoff → CLI Report → 原項目 title → 本文件〈文件接續試行〉；另由 WorktreeReportPlan 的 Task ID 與連結核對卡片歸屬。首次讀取的本文件 SHA-256 為 `cfb33fcb8be73cf6a966984a8aa4cf9c88b021675ab22c7e8f341133cd4665c3`。此結果是唯讀交接證據，沒有對已完成項目改狀態。

| 訊息或操作 | 第一輪觀察 | 能證明的範圍 |
|---|---|---|
| 使用者重新貼完整工作指示 | 明確 invocation 後 0 次 | 讀取者能從原項目找到本輪工作，不需原聊天 |
| 使用者轉貼成果全文／交付路徑 | 0 次 | 分派者透過宿主子 agent 回傳直接收件，再寫原文件 |
| 分派者轉貼完整工作指示或成果正文 | 0 份 | 路由資訊及唯讀動作仍需給出，但未複製原任務內容 |
| 既有項目／文件 | 原項目及原文件持續使用 | 沒有另建試行卡、取代項目或狀態檔 |
| 前一輪的啟動摩擦 | 使用者被要求額外重送 1 次明確 invocation | 上面的 0 次不包含這次摩擦；既有啟動規則未改，分派者應在一開始就辨認入口，避免先承諾執行再要求重送 |

以上跨本聊天的訊息數由分派者依實際工具及對話記錄計數；唯讀上下文只見證它自己收到的委派，沒有被宣稱能獨立核對使用者的整輪訊息總數。

第一輪還發現既存的狀態文字過期：handoff 與決策項目 title 仍說第 11 題待答，但 canonical plan 及 CLI `derived_state: done` 表示決策已完成。本輪依 CLI 狀態讀取，沒有重做決策；此既存問題依 AgentsRule 記在原 worktree-report 卡，未順手修改已完成項目或 handoff。

本次沒有真正的開發實作返工，沒有合併分支，也沒有測試 Claude／Antigravity 或已停止的 chat 被喚醒。讀到文件足夠，不代表這些階段已驗證。

第二輪以 `followup_task` 傳送同一項目參照及「重讀固定交付位置」的唯讀動作，沒有附上首次回報或新增證據正文。讀取者從原路由重讀，確認文件提交 `4cb96fe` 已包含首次收件；Report revision 為 `33b15b4fa410f4379ecca40141254a108c8d8422b5eadd79ba8f8e544f4f1f74`。它回報來源鏈、首次 revision／雜湊及限制與自身首次回報一致，新增內容足以接續，未發現需要使用者補貼完整聊天的缺口。該次文件 SHA-256 為 `3d1dbbf27aeee798e886f030a35e73baf54556715432a3b9a259ebccd94143d4`。

兩輪共發生 1 次工具委派、1 次工具接續及 2 次直接收件；明確 invocation 之後，使用者額外轉貼指示、成果或補錄內容均為 0 次。這證實在本次 Codex 宿主內，可以省掉「重貼長指示」「人工轉寄成果」「把補入的內容再貼回讀取者」三種搬運。父 agent 實際接收並保存結果，不以聊天裡的完成宣告取代文件。

本輪證據僅到「項目參照 → 文件解析 → 直接收件 → 原文件補錄 → 同參照重讀」。補錄後重讀不是開發實作返工；工具接續不是外部平台通知。完整兩項平行、實作返工、分支合併、正式獨立他驗、Claude／Antigravity 通訊及停止 chat 的喚醒都沒有在本輪驗證，原試行項目不因此標成完成。
