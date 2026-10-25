# 連結帶入的選取色

> Task ID: link-selection

```text
TaskProgress
└─ 狀態關聯連結
   ├─ 子項狀態、來源與文字連結：攜帶來源狀態色
   └─ Report／Checklist／Decision：共用卡片選取
      └─ 取消選取：清除這次連結帶入的顏色
```

## 行為

站內狀態關聯連結開啟頁面後，選取並定位關聯卡片，以來源狀態色顯示外框與淡底色。例如受阻使用 danger，等待中使用 warning。顏色持續到取消選取，不使用動畫或計時器；目標資料尚未載入時保留定位請求。

Report 沿用 `pin` 指定卡片；Checklist 的 `work_item` 可指定工作項目，Decision 的 `decision` 可指定題目。整份文件的連結選取第一個顯示的卡片；若篩選隱藏全部，暫時顯示文件的第一項，提供可選取的目標。指定目標也暫時豁免篩選，取消選取後恢復篩選。

按 Esc、點卡片外、焦點移出、視窗失焦或選取另一張卡片，都會結束這次選取色。重新選取原卡片使用一般選取色；同頁資料刷新不會重新套用來源色。重新開啟帶參數的網址視為新的跳轉。

## 實作範圍

`viewer/assets/link-selection.js` 擁有網址參數與 pending／active／cleared 生命週期；`CardList.svelte` 接上既有選取與焦點。`link-tone` 僅接受既有語意色名稱，外部網址與其他站內路由保持原連結。顏色沿用主題 token，不改寫 Report 或文件的狀態。

此次修改為中等執行量、有限架構影響，沿用共用 CardList 與既有連結繪製入口；不新增選取系統、動畫或跨分頁遙控。

## 驗證

`tests/link-selection.test.mjs` 檢查延遲載入、取消後不重放、整份文件的目標與網址邊界；既有膠囊、綁定、篩選、選取與文字連結測試涵蓋相鄰行為。

2026-10-26 本輪：75 項定向 Node 測試通過，四個 UI 建置通過。Browser 實測 Report 的紅色選取、Esc 清除、重新選取恢復藍色；已完成 Decision 在預設待決策篩選下仍能選取並顯示 success；Checklist 指定第 1 項以 danger 選取。Desktop bundle 已建置及發布，未操作桌面視窗。
