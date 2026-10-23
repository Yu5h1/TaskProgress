# 已完成集合的堆疊

> Task ID: completed-stacking
>
> 來源：使用者 2026-10-23 決定。Report 子項已有同一規則（[ReportItemOrderingPlan](ReportItemOrderingPlan.md)）；本文把它延伸到 Checklist 與 Decision 頁。

```text
Checklist 頁、Decision 頁
└─ 顯示順序（投影，不改檔案）
   ├─ 未完成：維持檔案順序
   └─ 已完成：堆疊在未完成之後，最晚完成的在最上面
```

## 已決定

1. **只改顯示，不改檔案。** `.checklist` 與 `.decisions` 的內容順序不動；堆疊是頁面讀取後的排列，和 Report 子項的完成堆疊同一做法。
2. **Decision 頁。** 未回答的題目維持檔案順序在前；已回答的依 `answer.confirmed_at` 由新到舊堆疊在後。重新開啟（reopen）的題目回到未完成區。
3. **Checklist 頁。** 工作項目層：未完成的維持檔案順序在前；全部檢查 `[x]` 的工作項目依它最新一筆有效 `Recorded` 時間由新到舊堆疊在後。只含不標檢查、沒有任何 `Recorded` 的工作項目沒有完成時間，排在有時間的已完成項目之後、彼此維持檔案順序。失效（需重驗）的結果不算完成，項目留在未完成區。
4. **篩選不變。** 既有的狀態篩選與「只顯示我能操作的檢查」照常作用，堆疊只決定同一區內的先後。

## 尚未決定

無。

## 驗收

- Decision 頁：三題已答（不同 `confirmed_at`）、兩題未答時，未答在前依檔案順序，已答在後由新到舊；reopen 一題後它回到未答區；檔案位元組不變。
- Checklist 頁：已完成工作項目依最新 `Recorded` 由新到舊；無 `Recorded` 的已完成項目排在其後並維持檔案順序；一筆結果失效後該項目回到未完成區；檔案位元組不變。
