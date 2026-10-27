# TaskProgress UI Workflow 替換計畫

> Task ID: web-ui-replacement
>
> 目標：以 Yu5h1Lib.Web 的 UI Workflow 與 TypeScript＋Lit 呈現取代 Svelte。本文擁有 TaskProgress 的採用範圍、接線、驗收與回退；共用 API 由 Web 擁有。實作進度與待答事項見 [handoff](../handoff.md)。

## OptionPicker 共用元件採用

本片承接 Svelte 退役後的共用元件抽取：來源基準 `888aa56`，caller 是 `ui/web-workflow/common.mjs` 的 `Cards` 排序與可見性工具列，供 Viewer／Checklist／Decision 共用。改用 Web 公開 `ui-option-picker`，產品只傳選項、圖示、目前值與請求回呼；排序模式、隱藏卡片與 reset 意義仍由 `Cards` 維護。

Web 的元件契約與中性案例由 [共用庫計畫](../../Web/Documentation/LibraryIntegrationPlan.md#optionpicker-元件採用) 擁有。採用前以隔離 fixture 檢查兩個工具列模式，包含點擊循環、長按選擇、鍵盤、Escape、失焦、資料刷新及重新掛載。通過後更新 `vendor/web-ui/manifest.json` 的來源與檔案雜湊、重建五個場景，再核對正式公開入口。回退恢復本片之前的 vendor pin 與 common.mjs，重建發布；不更動 report／checklist／decision 資料。已退役的 Svelte 不參與此回退。

本片驗收由 [消費端 checklist](../checklists/shared-option-picker.checklist) 記錄，Web 檢查不代替消費端功能或人工外觀結論。

更新產物使用 `node scripts/import-web-ui.mjs <Web/dist>` 預覽，確認後加 `--apply`。匯入器核對公開 delivery manifest 與檔案雜湊，記錄來源 revision、source_dirty 及來源檔案雜湊；套用前將舊產物備份至 `bin/Migration/OptionPicker/`。執行期只引用本地 vendor。舊 `icon-choice.js` 已無 caller，連同其獨立測試移除；建置與發布會清除各交付目錄的舊副本。

## 系統階層與關係

```text
TaskProgress
├─ 產品資料與命令：Report／Checklist／Decisions／Time／Cost
├─ 保存與 transport：Browser LocalWebService／Desktop WebView2 bridge
└─ UI 接入與產品畫面（TaskProgress 擁有）
   ├─ Viewer region adapter：mount／update／destroy
   ├─ Checklist 與 Decisions：各一份畫面，供雙宿主使用
   └─ TypeScript＋Lit 產品模板
      ├─ Yu5h1Lib.Web 公開 UI／Theme／互動能力
      └─ 既有原生控制器：ExpandableText、排序投影等

資料與命令由宿主送入；畫面回傳意圖，保存仍由產品控制器執行。
Web 不反向 import TaskProgress，也不保存 Report／Checklist／Decisions。
```

## 依據與適用性

主要依據是 Web 的 [原生 UI 元件與資料更新工具計畫](../../Web/Documentation/NativeUIAndDataUpdatePlan.md)，其中 M1 規定開始正式替換的條件，M2 規定移除 Svelte 的条件。[共用庫整合計畫](../../Web/Documentation/LibraryIntegrationPlan.md) 管 ownership 遷移、正式引用與回退；[web-ui-workflow skill](../../Web/.agents/skills/web-ui-workflow/SKILL.md) 管消費端採用流程。

**評估：適合，但需有界試接。** 既有 ui-host 將資料與畫面分開，適合保留控制器而換 renderer。Web 已有公開元件與來源對照案例，但其獨立 demo 不等於 TaskProgress 正式接線驗收。替換 `.svelte` 後仍有 TypeScript／Lit 與建置流程，不以自製模板引擎取代。

| TaskProgress 需求 | 可引用能力與證據 | 本專案尚需證明 |
|---|---|---|
| Dialog 與焦點 | `@yu5h1/web/ui` 的 UiDialog | 子內容、巢狀呼叫、Escape、關閉返回焦點與 WebView2 |
| 列表與編輯 | UiItemList、普通 snapshot、item-change | 通用列表不是 TaskCard 替身；保留產品模板、命令與保存規則 |
| 保存控制 | UiSaveBar；既有 editor core／transport | undo、discard、自動／謹慎模式、revision 衝突與晚到回應 |
| Theme | 公開 theme entry、ui-provider、UiThemeControl | 舊八色偏好、首次繪製與 Shadow DOM 樣式映射 |
| 長按與排序 | bindLongPress、bindChoicePicker、bindReorder | pin、群組優先級、完成堆疊、隱藏項目與拖曳拒絕由宿主保留 |
| 摘要／子項展開 | TaskProgress 原生 expandableText；Web UI-C18 試接證據 | 摘要兩行、子項一行、行尾更多、收合間距及銷毀 |
| Browser／Desktop 交付 | 建置後 `ui/index.js` 與相鄰 Theme 資產 | Pages、loopback、WebView2 的實際載入與 CSP／路徑 |

Web 的 [TaskProgress 試接證據](../../Web/tests/taskprogress-ui/README.md) 已針對來源 `7a0d07f` 重盤點 40 個 Svelte 元件與四個建置入口。後續實作須重新比對當時 HEAD；不能沿用舊通過數字判定目前 M1 已完成。公開 UI exports 以 [Web src/ui/index.ts](../../Web/src/ui/index.ts) 與 package exports 為準；不把私有 Motion 或 demo 模擬保存當成正式 API。

## 範圍與保留契約

| 入口 | 現有接線 | 替換後 |
|---|---|---|
| Report Viewer | viewer-ui.js → viewer-adapter.svelte.js → 16 個 region | 同一 ui-host 契約，改為 Web UI adapter 與產品 Lit 模板 |
| Checklist Browser | checklist-browser-main.js → ChecklistApp.svelte | Checklist 共用新畫面＋原 HTTP transport |
| Checklist Desktop | checklist-main.js → 同一 ChecklistApp | 同一新畫面＋原 WebView2 transport |
| Decisions Browser／Desktop | decisions-main.js → DecisionApp.svelte，共用產物複製 | 同一新畫面＋原 transport 選擇與持久化契約 |

四個建置入口涵蓋五個執行場景；不能只換 Viewer 就刪除 Svelte。盤點也必須包含間接巢狀元件、`.svelte.js`、測試與 demo 載入者。

保留 report、checklist、decisions 的格式與服務 API；保留 editor core、版本檢查、原子保存、權限及前景刷新保護。TaskProgress 特有的卡片、決策選項、manual marker、Time／Cost 表單留在產品模板。UiSettingsPanel 可承接設定容器，但不以 ConfigStore 替換產品文件保存。

保留使用者已定義行為：群組內優先級、完成先後堆疊、最新 pin 最優先、CLI pin 定位、標籤亮暗與 hover、已完成預覽一項、摘要兩行／子項一行、更多只有文字有底線，以及收合前 0.5em 間距。浮動 toolbar 另案，不在遷移時臆測新增操作。

## 接線設計

### 單一 DOM 與資料 owner

沿用 `viewer/assets/ui-host.js` 的 mount／update／destroy 與 region 名稱。正式頁只有一個 active adapter；過渡期若分批切 region，使用一個過渡 adapter 在 mount 時選 renderer，instance 記住 renderer，update／destroy 委派回原 owner。禁止讓兩個全域 adapter 互相覆蓋 activeId，或讓 Svelte／Lit 操作同一子樹。

巢狀 DialogShell 不會因頂層 adapter 改變而自動被替換。葉端試接由 Svelte wrapper 擁有空容器，Web 元件擁有內部；全部呼叫者切換後移除 wrapper。ExpandableText 沿用原生 action，由 Lit wrapper 掛載、更新、銷毀；不把字串截短算法重寫到模板。

畫面接收完整 snapshot 與穩定 task／item／decision ID。原 adapter 的 Object.assign 有 patch 語意，遷移前逐 region 核對呼叫者，不能直接換成全量替換而遺失 callback。逐元件盤點草稿 owner：產品控制器已有的草稿／快照保留；TaskCard／ItemRow 等 Svelte-local 輸入暫態明確遷至對應產品 Lit 元件，不假設都已在 editor core。避免 property 更新蓋掉 IME 組字、游標與選取。

公開 Web 事件轉成既有產品命令。若使用 item-change 的非同步 respondWith，dispatch 期間只回應一次，保存前核對 revision／signal，接受快照後才 resolve；遠端已保存的結果不能因畫面取消而宣稱撤回。具體錯誤與重試 UI 保持原行為。

### 樣式、主題與交付

產品模板以 Light DOM 與既有 class/token 優先保留排版；Web 公開元件的 Shadow DOM 透過 CSS variables／明列 parts 調整，不穿透私有 DOM。`editor-presentation.css` 繼續只管幾何，theme 管色彩；不能因 renderer 改變再複製一套樣式。Theme 採用時另讀 Web web-theme skill，保存 key 與偏好版本須有相容測試。

Web package 目前 private，不能假設可從公開 npm 安裝。建議消費已驗證、帶 revision／雜湊的 built UI 發布產物，以受控腳本收集到 TaskProgress 交付資料夾；保留 `ui/index.js` 與 `theme/index.js` 相鄰關係、授權及實際 transitive assets。產品 Lit 模板所用 runtime 與 Web 元件相容性須由試點確認，不直接 import Web 私有 TypeScript 或重建其公開控件。

正式部署不得依賴 sibling Web source、開發 server 或遠端 CDN。Viewer、兩份 Checklist、Decisions 複製流程及 C# Content 清單逐一檢查。`ui-host.js` 維持外部單例，避免打包出第二份 registry。Svelte 專用 plugin 最後移除，Vite 等仍有用途的工具保留。

## 分段替換與完成條件

### 先行 Browser 並行試點

使用者已明確授權先啟動隔離試點。此授權允許在 Web 開始條件尚未全數驗收時建立消費端試點及補證，不代表 G0、M1 或 M2 已通過；正式切換與移除 Svelte 依本計畫下方修訂後的功能、交付與資料安全條件。

第一批使用 TaskProgress 現有宿主、CLI 與版本檢查，搭配 Web 已建置的完整三頁副刻作產品 adapter 移交快照；尚不把副刻模板當成 Web 公開 API。產物固定 Web revision、TaskProgress revision 與逐檔指紋，來源 host assets 漂移時拒絕準備。這是受控短期移交；通過試點後將產品 adapter 原始碼接回本專案的正式建置，Web 只維護通用能力及回歸案例。

```text
TaskProgress 正式 Svelte／8001（保留）
TaskProgress Browser 試點／8017
├─ 固定交付：Web 公開 UI／Theme＋產品 adapter 快照＋現有宿主資產
├─ 現有 TaskProgress API／CLI → 試點資料副本
└─ 同一三頁入口／原版比較入口；獨立啟用，可直接停止試點
```

`scripts/web_ui_pilot.py --import-delivery --web-dist ../Web/dist` 收集第一份已建置產物，記錄於 `experiments/web-ui-workflow/delivery.json`；後續 `--prepare` 必須重現同一指紋，變更須明確重新匯入。產物及資料位於忽略的 `bin/Migration/WebUiWorkflow/`，資料位於靜態站點之外；重開保留修改，不自動覆寫或重設。只掛載指定 report exact-file 路由，不註冊正式 scope、不修改 8001、檔案關聯或正式發布資產。共用安裝環境與現有 LocalWebService Python API 維持原用法。

`Start Web UI Pilot.cmd` 以前景服務啟動 8017 → 開啟 `http://127.0.0.1:8017/demo/taskprogress/?scope=task-progress`。正式版仍由原啟用方式開啟。第一次須先準備交付；之後啟動不讀 Web sibling 或開發服務。Ctrl+C 停止試點，回原入口即回正式 Svelte；不回退任何使用者資料。

本批證據由 [Browser 試點清單](../checklists/web-ui-browser-pilot.checklist) 擁有。先核對三頁載入、真實保存及 revision 衝突、隔離及產物完整性；Desktop／WebView2、完整工作負載、人工操作與正式產品替換仍是後續範圍。

### Viewer 試點人工驗收

使用者的試點操作驗收登錄在 `svelte-retirement` 任務卡的 `web-ui-pilot-manual` 子項，綁定 [Viewer 試點人工清單](../checklists/viewer-web-ui-pilot-manual.checklist)。核對同資料原版的外觀與操作、單一主題與返回、卡片操作，以及三頁草稿／保存／重載和實際中文輸入。驗收紀錄保存在正式 TaskProgress 清單；8017 的文件和勾選都是測試副本，不能作為驗收紀錄。這份清單收集此批人工結果，既有 Browser 試點的獨立審查及正式替換條件各由原清單繼續擁有。

整體為大型遷移：40 個來源元件、1 個 Viewer adapter、4 個建置入口及相關載入／複製規則。第一批僅基準與隔離試接，預估 6～10 個檔案、約 300～600 行；實際開工按當時來源重新估量。既有 Web probe 為先例；證明需要真實產品保存及 Browser／WebView2，不只編譯。

| 階段 | 工作 | 完成條件 |
|---|---|---|
| P0 基準 | 記錄兩庫 revision、來源／入口／資產映射，固定功能對照資料與目標環境 | 能重現舊畫面與操作；未使用的元件有 caller 證據而非直接刪除 |
| P1 隔離真實流程 | 列表 → Dialog 編輯 → 驗證 → 保存 → 刷新／衝突；使用產品控制器與測試資料副本 | Web G0 證據核對，TaskProgress M1 六項逐項有結果；正式入口仍原版 |
| P2 葉端 | DialogShell、ExpandableText wrapper；再逐項評估 SaveBar、Theme、選項控件 | 共用 API 可表達原語意；鍵盤、焦點、暫態及銷毀通過 |
| P3 Viewer | 先簡單 region，再 TaskList／CardList／ItemRow，最後 Time／Cost／交付表單 | 全部 16 regions 接上；排序、pin、編輯、刷新、模組與窄版相容 |
| P4 Checklist | 共用 Checklist 畫面，分別接 Browser 與 Desktop | manual marker、自動／謹慎保存、版本衝突、清空確認等原契約通過 |
| P5 Decisions | 共用決策畫面與兩個 transport | 選項／其他輸入、確認／重開、草稿及衝突行為通過 |
| P6 收斂 | 重建全部交付產物、移除無 caller 的 Svelte source／plugin／依賴與過渡 adapter | M2 通過；乾淨建置無 Svelte runtime 或舊 bundle 載入，回退可用 |

每批失敗只恢復該批接線與對應資產，使用 Git 已記錄版本與可重建產物；不 reset 其他工作、不回退使用者資料。同一正式功能不長期維護兩套 renderer。Web 缺口記在本專案 `Documentation/Requirements.Web.md`，提出可重現案例與驗收後由 Web 實作；本計畫不直接修改 Web repository。

## Svelte 退役與 Web UI Workflow 正式接管

> Task ID: svelte-retirement

本卡擁有 TaskProgress 的正式建置接管、全入口替換、發布驗證與 Svelte 退役；`web-ui-replacement` 保留採用準備與隔離試點，Web 遷移卡彙整其提供能力及消費端證據。同一工作只有一個實作 owner。

```text
試點人工驗收＋Web 遷移準備及試點證據
└─ 正式建置接管
   └─ Browser／Desktop 全入口替換與驗收
      └─ 正式發布回歸、Svelte 退役與結案
```

| 子項 | 工作與通過條件 |
|---|---|
| web-ui-pilot-manual | 沿用既有試點人工清單，保留全部結果；完成此項只代表該批試點操作通過。 |
| production-build | 將產品 adapter 原始碼、Lit 與 Web 公開產物接入 TaskProgress 正式建置／複製規則，取代臨時 demo 產物來源；可在獨立啟用方式下重建，正式交付不依賴 Web sibling 或開發服務，Svelte 回退入口保留。開始前核對既有 Web 啟動條件及試點證據。 |
| all-entry-replacement | 按原 P2～P5 切換 Report Viewer、Checklist Browser／Desktop、Decision Browser／Desktop，逐批取得資料、保存、互動、Theme、焦點及實際宿主證據；全部支援入口有結果，失敗可回退。 |
| release-validation-and-retirement | 在正式發布候選完成原 M2 的功能與保存回歸、乾淨建置與回退核查；確認所有正式載入者均已切換後，才移除 Svelte runtime、編譯依賴、舊來源及專屬設定，保留其他仍使用的工具。無 Svelte 的重建與載入檢查通過後才結案。 |

### 必要退役條件（2026-10-27 條件修訂）

依使用者決定，效能最佳化獨立為 `web-ui-performance`，不再作為 G0、M1、M2 或本卡的前置條件。100 ms／16 ms、記憶體倍率、資產大小與維護成本仍追蹤，但缺少量測或超出數值預算不阻擋退役。造成操作無法完成、當機、資料遺失或資源持續洩漏的問題仍屬功能／可靠性缺陷，必須處理。

真正必要的條件只有以下五類；每類沿用適用的既有證據，變更版本與入口只補差異，不要求使用者重做全部已通過項目：

1. **功能等價**：Report、Checklist、Decision 的顯示、編輯、排序、選取、刷新與既有命令符合基準；差異已修正或經使用者明確接受。
2. **資料安全**：沿用產品保存器與 transport；保存、取消、衝突、失敗重試、晚到回應及重載不遺失或覆蓋資料，偏好／文件格式相容。
3. **全部入口接管**：四個建置入口、五個 Browser／Desktop 執行場景及正式複製／載入規則均改用 Web UI Workflow；不能只驗證 Browser demo。
4. **必要操作與環境相容**：已約定的瀏覽器／WebView2、Theme、鍵盤／焦點、中文 IME、無障礙及必要實體輸入有對應證據；缺少的實測不能用效能拆分來豁免。
5. **交付與回退完整**：產品 CSS 不再從 `.svelte` 取得；從鎖定依賴乾淨重建，發布候選無 Svelte 編譯／runtime／舊 bundle；原版可由已記錄版本與產物恢復，且不回退使用者資料。

執行順序：已通過的試點與候選建置 → [全入口接管清單](../checklists/svelte-retirement-entries.checklist) → [發布與退役清單](../checklists/svelte-retirement-release.checklist)。Report 的 all-entry-replacement 僅等待消費端 production-build；其清單核對必要 G0／M1 功能證據，不再等待 Web 整張試點彙整或效能卡。release-validation-and-retirement 嚴格等待全入口清單完成。這次修訂不宣告任一缺證項通過，也不執行正式部署或刪除 Svelte。

### 正式建置、發布與回退

正式 UI 原始碼由 `ui/web-workflow/` 擁有，`shells/*.html` 是三頁 HTML 模板，`component-styles.css` 保存驗收候選的原始樣式；不再讀取 `.svelte`。共用控制器及保存規則繼續由 `viewer/assets/` 擁有，Web 公開模組由固定指紋的 `vendor/web-ui/` 提供。

`npm ci --ignore-scripts` 還原鎖定依賴，`npm run ui:build` 建置並複製 Browser 與兩個 Desktop 根目錄；舊的四個 UI build 命令保留為同一建置的別名。`Publish.cmd --nopause --restart` 先建置 UI，成功後經 TrayHost 正常退出、發布原生宿主並同步全部已註冊 scope。正式入口仍為 8001；不更換 scope registry，也不從 demo 資料覆蓋正式報告。公開 Viewer 沿用 Pages 的 `index.html`＋`assets/` 遞迴複製契約；公開 Web 模組、CSS 與 theme bootstrap 全部放入 `assets/`。本機另外交付 Checklist／Decision 兩個子目錄。

原版回退基準為 `ca05a3f`；本機產物保存在忽略的 `bin/Migration/SvelteRetirement/rollback-ca05a3f/`，含原 `viewer/` 與 `win-x64/`，不含待回退的報告資料。回退時經 TrayHost 正常退出服務，恢復這兩個資產目錄後以原 EXE 的 `start --no-browser` 啟動並同步 scope；不得回退 report、checklist、decision 或使用者偏好。歷史來源可由 Git 的該 revision 重建；效能比較使用已固定的歷史候選，不將 Svelte 再帶回正式依賴。

### 產品原始碼與候選建置（退役前交付設計）

建置準備在消費端 Browser 試點的獨立審查與人工操作通過後進行；完整 Web M1 證據仍在全入口正式切換前核對。候選建置只寫 `bin/Migration/WebUiWorkflow/`，不覆寫 `viewer/`、Desktop 交付或 8001，因此準備產物與正式啟用分開。

TaskProgress 的 `ui/web-workflow/` 擁有產品模板與 bootstrap，沿用現有 `viewer/assets/` 控制器。公開 UI／Theme 從試點已固定的 Web 交付收集為本庫 `vendor/web-ui/`，帶逐檔指紋與授權；建置不再讀 Web sibling 或 Web demo。Lit 3.3.3 固定在本庫 lockfile，使用既有 Vite 建置。保留 `ui-host.js` 的執行期單例；產物相依圖拒絕 Svelte、外部路徑與開發機位置。

本批先交付三個 Browser 入口。產品 Theme 保留原 `task-progress.theme.v1` 與八色模型，掛載共用選擇器；不引入展示站儲存鍵、fixture fetch 攔截或預設測試 scope。現有 Svelte 元件內 CSS 暫由候選建置抽取，保留原作用範圍；退役階段才轉移其最終樣式來源。Desktop transport、正式 Content／Pages 複製與入口切換由下一項擁有。

通過條件由 [候選建置清單](../checklists/svelte-retirement-build.checklist) 擁有。規模：移交既有產品模板約一千行，新增候選建置及 Theme 接線；既有副刻為先例，證據包含獨立建置、相依圖、三頁載入與保存、舊入口資產保持。

在 TaskProgress 根目錄建置 → 啟動前景候選 → 開啟終端顯示的位址：

```powershell
npm run web-ui:build
python scripts/web_ui_pilot.py --serve --candidate --port 8018
```

也可在建置後開啟 `Start Web UI Candidate.cmd`。候選入口為 [8018 Viewer](http://127.0.0.1:8018/demo/taskprogress/?scope=task-progress)，使用獨立的 `candidate-data`；第一次複製資料後不自動同步。按 Ctrl+C 停止候選；8001 正式版與 8017 已匯入試點各自保留。

### 五個執行場景的候選交付

同一份產品畫面透過 `viewer/assets/document-transport.js` 選擇現有 HTTP 或 WebView2 bridge。Checklist bridge 由產品 assets 擁有，舊 Svelte 入口僅 re-export；Decision 沿用原有 transport，不建立第二個保存器。Desktop 無 scope 查詢字串仍可編輯，不呼叫 HTTP capabilities，也不顯示無目的地的返回連結。

`npm run web-ui:build` 同時產生 Browser 三頁、`desktop/checklist-ui`、`desktop/decisions-ui`，以及供發布驗證使用的 `release/viewer` 目錄。每個 Desktop virtual host 有自己的完整 UI／Theme／host assets；產物與原始來源雜湊記在同一 candidate manifest。`release/viewer` 是待啟用的正式目錄形狀，仍帶候選標示，不能直接當作已發布；移除標示、正式複製與切換由發布清單擁有。

準備 Desktop 候選：在 TaskProgress 根目錄執行 `node scripts/prepare-web-ui-desktop.mjs`。它以既有 .NET 依賴 `--no-restore` 建置原生宿主，透過 `WebUiCandidateAssets` 選用候選 Content，只寫 `bin/Migration/WebUiWorkflow/desktop-host/<identity>/`。未指定此屬性的正式建置仍使用原入口；不得在未驗收時改變預設。`desktop-data` 只在文件缺少時複製測試 fixture，重新準備不覆蓋使用者的測試結果。

開啟 `Start Web UI Checklist Candidate.cmd` 或 `Start Web UI Decision Candidate.cmd` → 在原生視窗操作測試副本。Browser 仍以 `Start Web UI Candidate.cmd` 開啟 8018。三個頁面各自的人工清單綁在同一退役卡；它們核對新版宿主與尚缺的目標環境，適用的已通過試點結果不重做。頁面上的 fixture 勾選／答案只是保存驗證，真正驗收記錄在正式任務卡的清單。

本批規模為中型、有界接線：沿用既有三頁、transport、WPF/WebView2、Content 複製與 candidate manifest；證據由全入口清單擁有。自動證據與人工結果分開，沒有實測的環境不由 API 探測或來源審查代替。

## TaskProgress UI 效能最佳化

> Task ID: web-ui-performance

### 問題與目標

大型清單更新仍有排版與排程成本，需獨立定位及改善；本卡擁有 TaskProgress 產品模板與 action 的效能，不把產品業務抽入 Web。沿用既有對照工具及原始證據，完成條件由 [效能清單](../checklists/web-ui-performance.checklist) 擁有。與 `svelte-retirement` 無前置相依，兩者可分開結案；效能追蹤暫停的續作狀態只記 handoff。

```text
固定資料／候選版本與量測邊界
└─ 定位與減量 → 原門檻重測 → 跨目標環境／記憶體對照
   └─ 行為回歸與獨立審查
Svelte 退役：另走功能、入口、保存、交付與回退清單
```

### 卡片渲染視窗與排程

三頁保留完整資料與穩定卡片 DOM，使用原生 `content-visibility:auto` 略過視窗外文章的排版／繪製，以記住的高度及初始估計高度維持捲動範圍。釘選、選取框與拖曳標記留在文章外；滑鼠、焦點或拖曳中的卡片解除內容隔離，讓選單能超出卡片。離屏文字不強制讀取幾何，重新可見時恢復截斷量測。文字的量測子樹與 grapheme 切分延後到可見量測；純文字由 Lit 直接呈現，可能含 Markdown 連結才使用 action。單批 NativeAction 更新合併至一個 microtask，保留卸載清理、最新選項及錯誤隔離；停用的長按／子項排序不建立 binding。純排序保留穩定 item 身分並重用未變內文，其他資料、能力、回呼或收展更新仍失效重繪。

本獨立任務的門檻維持首次渲染 100 ms、批次更新 16 ms、記憶體不大於同條件 Svelte 的 1.2 倍，資料量維持 50／100／100。視窗化驗證包含完整資料與 ID、逐卡捲動、搜尋離屏內容、焦點與鍵盤移動、捲動取消拖曳與重新投放、選單及窄視窗。工具保留原時間起終點；診斷探針不作為通過證據。渲染門檻只代表指定操作的完成時間，不涵蓋尚未執行的離屏呈現；回歸另驗證內容進入畫面後的行為。

不支援原生內容視窗化的環境使用完整渲染，功能回退與效能必須分開驗收；不因較新 Chromium 達標而提高或宣稱已覆蓋既定瀏覽器最低版本。記憶體對照、環境結果與時間數據由 [Web 效能紀錄](../../Web/tests/taskprogress-performance/README.md) 擁有；候選回歸由 [建置清單](../checklists/svelte-retirement-build.checklist) 擁有。共用元件抽取仍遵守退役後才開始的約束。

## 驗證與核查

自動檢查涵蓋命令映射、revision、失敗重試、取消／晚到回應、穩定節點身份、單一 DOM owner、多實例卸載、純文字安全、資料保存相容及發布資產解析。既有相關定向測試沿用，不為新模板另造重複業務測試。

畫面核查包含 hover／選取、行尾更多、窄版、pin／拖曳、鍵盤 Tab／Escape、中文 IME、保存時焦點、WebView2、實體觸控／筆（若列為目標裝置）。集中交付一輪核查，已自動驗證者也列出讓使用者確認；使用者未核查的項目不代勾。

獨立效能任務比較同一資料、viewport、機器及操作：初次顯示、批次更新、連續掛載回收、原始／gzip JS+CSS、一次代表性表單修改所需檔案與重複程式。預算以 [遷移決策](../../Web/decisions/taskprogress-web-ui-migration.decisions) 已選的 standard-workload 為準，不再沿用初稿的時間／gzip 倍數建議。生命週期正確性仍屬退役功能條件：資源回收後無持續增加 listener／observer／DOM。

## 已固定的決策與後續界線

目標環境沿用 Web 遷移決策已選的 modern-evergreen：Chromium／Edge ≥114、Firefox ≥125、Safari ≥17 與 Evergreen WebView2，不因效能任務拆分而縮小支援範圍。資料量及數值預算沿用 standard-workload，改由獨立效能卡驗收。依賴交付已採本庫鎖定 Lit 與帶指紋的 Web built 產物，無須再次決定這三項。

實機輸入與尚缺環境證據按既有人工清單及全入口清單補齊；觸控／筆只按原先約定的必要裝置驗收，不新增硬體要求。正式服務切換仍遵循發布流程，不能由本次條件修訂推定已驗收或已部署。
