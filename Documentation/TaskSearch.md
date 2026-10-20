# 任務卡搜尋

> Task ID: report-search
>
> 驗收 `checklists/report-search.checklist`。

## 行為

- 搜尋框位於工作項目的狀態篩選列右側，輸入即過濾，清空即還原。
- 比對任務卡名稱、卡片摘要與子項描述，不分大小寫；以空白分隔的多個詞必須全部命中，可以分散在卡片與同一個子項上（例如「工作流 PB01」）。行內連結比對顯示文字，不比對網址。
- 兩層過濾，沿用狀態篩選的慣例：卡片名稱或摘要命中時整張卡保留；否則只保留命中的子項，沒有任何命中的卡片隱藏。只隱藏，不改排序。
- 與狀態篩選同時生效：先依狀態，再依搜尋。被 pin 的卡片照狀態篩選的慣例一律保留。
- 查詢只存在目前頁面，重新整理後清空。
- ID 參與比對（[決策 id-match](../decisions/report-search.decisions) 選 include）：卡片 ID 與有穩定 ID 的子項 ID 視同可比對文字；舊式子項的暫代 ID 不比對。
- 貼上[複製參照](ItemReference.md)（`scope › 卡片 › 子項「…」`）時改用 ID 定位：只留該卡的該子項，標題部分忽略；只有 `scope › 卡片` 時保留整張卡；scope 不是目前 Report 時沒有結果。參照仍與狀態篩選同時生效。

由 `viewer/assets/task-search.js`（`searchTerms`、`searchTask`、`parseReference`、`referenceTask`）實作，`viewer/assets/app.js` 的 `renderTasks` 套用。

## 驗收

- 名稱、摘要、子項、跨卡片與子項的多詞、連結文字、舊式文字子項與無結果案例正確；網址不命中。
- ID 命中與參照定位：子項 ID、卡片 ID、完整參照、只有卡片的參照、其他 scope 的參照。
- Browser：搜尋框在狀態篩選列右側；輸入後只剩命中的卡片與子項，無結果時顯示空狀態，清空還原全部，輸入時焦點留在搜尋框。
