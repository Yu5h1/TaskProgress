# TaskProgress UI Workflow 替換計畫

> Task ID: web-ui-replacement
>
> 目標：以 Yu5h1Lib.Web 的 UI Workflow 與 TypeScript＋Lit 呈現取代 Svelte。本文擁有 TaskProgress 的採用範圍、接線、驗收與回退；共用 API 由 Web 擁有。實作進度與待答事項見 [handoff](../handoff.md)。

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

整體為大型遷移：40 個來源元件、1 個 Viewer adapter、4 個建置入口及相關載入／複製規則。第一批僅基準與隔離試接，預估 6～10 個檔案、約 300～600 行；實際開工按當時來源重新估量。既有 Web probe 為先例；證明需要真實產品保存及 Browser／WebView2，不只編譯。

| 階段 | 工作 | 完成條件 |
|---|---|---|
| P0 基準 | 記錄兩庫 revision、來源／入口／資產映射，固定資料量、環境和預算 | 能重現舊畫面與量測；未使用的元件有 caller 證據而非直接刪除 |
| P1 隔離真實流程 | 列表 → Dialog 編輯 → 驗證 → 保存 → 刷新／衝突；使用產品控制器與測試資料副本 | Web G0 證據核對，TaskProgress M1 六項逐項有結果；正式入口仍原版 |
| P2 葉端 | DialogShell、ExpandableText wrapper；再逐項評估 SaveBar、Theme、選項控件 | 共用 API 可表達原語意；鍵盤、焦點、暫態及銷毀通過 |
| P3 Viewer | 先簡單 region，再 TaskList／CardList／ItemRow，最後 Time／Cost／交付表單 | 全部 16 regions 接上；排序、pin、編輯、刷新、模組與窄版相容 |
| P4 Checklist | 共用 Checklist 畫面，分別接 Browser 與 Desktop | manual marker、自動／謹慎保存、版本衝突、清空確認等原契約通過 |
| P5 Decisions | 共用決策畫面與兩個 transport | 選項／其他輸入、確認／重開、草稿及衝突行為通過 |
| P6 收斂 | 重建全部交付產物、移除無 caller 的 Svelte source／plugin／依賴與過渡 adapter | M2 通過；乾淨建置無 Svelte runtime 或舊 bundle 載入，回退可用 |

每批失敗只恢復該批接線與對應資產，使用 Git 已記錄版本與可重建產物；不 reset 其他工作、不回退使用者資料。同一正式功能不長期維護兩套 renderer。Web 缺口記在本專案 `Documentation/Requirements.Web.md`，提出可重現案例與驗收後由 Web 實作；本計畫不直接修改 Web repository。

## 驗證與核查

自動檢查涵蓋命令映射、revision、失敗重試、取消／晚到回應、穩定節點身份、單一 DOM owner、多實例卸載、純文字安全、資料保存相容及發布資產解析。既有相關定向測試沿用，不為新模板另造重複業務測試。

畫面核查包含 hover／選取、行尾更多、窄版、pin／拖曳、鍵盤 Tab／Escape、中文 IME、保存時焦點、WebView2、實體觸控／筆（若列為目標裝置）。集中交付一輪核查，已自動驗證者也列出讓使用者確認；使用者未核查的項目不代勾。

量測比較同一資料、viewport、機器及操作：初次顯示、批次更新、連續掛載回收、原始／gzip JS+CSS、一次代表性表單修改所需檔案與重複程式。建議預算初稿：時間指標不超過基準 1.2 倍、交付 gzip 不超過 1.2 倍；資源回收後無持續增加 listener／observer／DOM。這是待確認預算，不是已量測結果。

## 尚未決定

- **WUI-01 目標環境與資料量**：建議先以目前使用的 Windows Browser＋WebView2 為必要目標，記錄確切版本；正常 fixture 與大型 fixture 分別量測。大型 fixture 的 task／item 數量需依實際使用確認；觸控／筆是否為本輪必要範圍一併固定。
- **WUI-02 成本預算**：確認上述 1.2 倍初稿或提供更嚴格門檻；實測基準與誤差記錄完成前不宣告效能通過。
- **WUI-03 依賴交付**：建議採 Web 已建置的版本化產物＋明確來源指紋，由 TaskProgress bundle/copy 腳本收集；若工作區已有統一 private package 配送方式則沿用。實作前固定取得方式與 Lit runtime 打包策略，禁止自行發明 Web 公開 export。

上述事項不阻擋文件分析與只讀盤點；會影響試點／正式採用的驗收。本輪只產生計畫，未授權切換正式 UI 或移除 Svelte。
