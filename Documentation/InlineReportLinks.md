# Report 描述行內連結

> Task ID: report-inline-links

```text
Report 任務摘要／子項描述／指路卡摘要
└─ ExpandableText
   ├─ inline-links：解析簡短文字與安全 URL
   ├─ 行內 anchor：底線與原生導覽
   └─ 更多／收合：測量顯示文字，完整保留連結
```

## 格式與行為

既有字串欄位支援 `[顯示文字](URL)`，例如：

```markdown
決定細節待決策 D1、D3、D6 [前往](/decisions/?scope=ux&task=ux-foundation)，完成後繼續驗收。
依據 [驗收清單](/checklist/?scope=task-progress&task=decision-items) 逐項確認。
參考 [教學](https://example.com/guide)、[影片](https://example.com/video)，或 [下載](https://example.com/files/example.zip)。
```

連結可放在任意位置，一段可有多個。方括號內的顯示文字由作者自由指定，「前往」只是範例，並非固定按鈕名稱。顯示文字有底線，使用與「更多」相同的連結顏色；原生 anchor 在目前頁面導覽，保留鍵盤 Enter 與瀏覽器開新分頁操作。文字標為「下載」不會強制下載，仍由目標 URL 與瀏覽器處理。相對 URL 以目前頁面 URL 為基準；建議使用 `/checklist/`、`/decisions/` 這類根路徑，scope 與 task 必須實際存在。編輯模式仍編輯原始字串，保存格式及欄位字數限制不變。

只解析行內連結，不提供完整 Markdown、HTML、圖片或裸 URL 自動轉換。支援 HTTP(S)、相對 URL 與 `#fragment`，URL 內空白需編碼。危險協定、格式不完整的語法與其他 HTML 皆保留為文字，不執行。這個功能不查核目標是否存在，也不等同決策 source_ref 的來源檢查。

## 收合與焦點

摘要維持兩行，子項維持一行。測量依顯示文字及實際連結寬度，不計入 Markdown 語法長度。連結是完整單位，收合空間不足時整個留到展開後顯示，不能留下部分可點擊標籤。長標籤展開後可自然換行。

測量在不可互動的隱藏容器進行，不重建目前連結；相同文字更新保留節點。焦點在連結上時縮窄版面會保持展開，避免焦點所在連結被隱藏。卡片既有互動元素排除規則適用，點連結不開始拖曳或收合卡片。

## 驗收

- 多連結、中文、相對路徑、含括號 URL 與片段可解析；不安全協定及 HTML 不執行。
- 收合不截斷連結，展開可見完整內容，更新／縮放不遺失連結焦點。
- Browser 實際核查：描述中間的「前往」有底線、可點開既有 Checklist／Decision，更多／收合與卡片選取仍正常。
