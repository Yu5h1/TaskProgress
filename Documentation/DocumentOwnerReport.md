# 文件的擁有者 Report

> Task ID: document-owner-report

## 行為

Checklist 與 Decision 網頁標題下方顯示「擁有者：報告名稱」，點擊回到同一 scope 的 Report。Decision 的 scope 總覽也適用。不以文件 stem 推測 Report 任務卡。

文件成功載入後，透過既有 scope Report 路由獨立查詢名稱，確認 scope 相符及基本報告結構才顯示連結。Report 不存在、回應無效、查詢失敗或逾時時不顯示連結，文件載入、編輯與保存仍正常。原生連結保留另開分頁操作，Decision 沿用既有未保存離頁提醒；Checklist 原本沒有此提醒，本次不新增。

獨立 Desktop 檔案沒有已確認的服務 scope，維持不顯示擁有者連結；由 CLI 分流到網頁的文件套用上述行為。不新增服務路由或修改資料格式。

## 實作與驗收

Volume: touches 5 existing source files / adds ~60 source and test lines, plus generated bundles.
Precedent: existing scope Report routes and optional transport capability.
Proof: targeted owner resolution tests, Checklist and Decision builds, manual navigation.

擁有者查詢由 `viewer/assets/owner-report.js` 擁有；HTTP transport 提供選用能力，共用頁面負責顯示。驗收見 `checklists/document-owner-report.checklist`。
