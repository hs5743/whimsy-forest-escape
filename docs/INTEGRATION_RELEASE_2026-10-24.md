# GitHub 與本機整合交接 — 2026-10-24

## 來源與範圍

- 正式來源：origin/main fc1baa4，保留機場、GLTF 載入器、Blender PBR 模型及場景整合。
- 本機保存點：b4a5174；氣象編號調整：09381d7。
- 整合後：21 個冒險關卡 + 1 個學習大廳；五個地圖分區。
- 機場保留 zone15，氣象觀測台改為 zone21；潮間帶仍為 zone16，其父入口改為 zone21。
- index.html 更新所有現有版本查詢字串，避免混用舊快取腳本。

## 存檔與後台

AdventureProgress 在驗證前辨識舊氣象資料（符合 WeatherChapter 驗證器，且不包含機場 gate/call/collected 欄位）。遷移目前位置、機關與區域練習單字，保留原輸入。CheckpointStore 在轉換前保存 before-zone21-migration 備份。若 zone21 已存在，拒絕猜測覆蓋；機場資料不遷移。

gas-release/完整主程式_直接貼上.txt 已重新產生，但 GitHub Pages 發布不會自動更新 Google Apps Script 部署。前端逐一檢查 zone14–zone21 支援狀態；舊後台不支援時保留本機進度，避免傳送後被舊格式丟棄。正式 GAS 需另行更新及建立部署版本。

## 驗證

- 339 項自動測試全通過，含兩項新舊存檔辨識／衝突保護測試。
- index.html 內嵌程式通過語法檢查，所有本機 JS/CSS 引用存在。
- 瀏覽器正在執行 22 空間暖機 + 兩輪巡檢；部署與最終線上驗收結果於後續紀錄補充。
