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

## 發布與線上驗收結果

- 整合提交：43a68cfd880baffdf36f7eea3fe3538082883d12，已推送 origin/main。
- GitHub Pages run 39987319990：build、deploy、report-build-status 全部成功。
- 本機 22 空間暖機及兩輪巡檢，共 66 次場景切換完成，console error 0。
- 正式站 https://hs5743.github.io/whimsy-forest-escape/?release=43a68cf 已實際開啟；素材就緒、進入遊戲、開啟分區地圖，確認 22 個地點、雲海星穹機場與森林海岸氣象台；console error 0。
- 未以真人麥克風完成所有口說關卡；未更新正式 GAS，也未宣稱新關卡跨裝置存檔已完成線上驗收。
- 正式驗收截圖：validation/live-integration-2026-10-24.png。

## 關卡錯位修正 — 2026-10-24

逐一檢查 21 個冒險區域的 metadata 與場景 dispatch：22 個地點（含學習大廳）皆存在，所有支線 parentZone 均指向已登錄的父關卡；airport/weather/coast 的任務、場景、提示、語音、音樂、地圖及後台 schema 使用正確 ID。機場仍為 zone15，氣象台為 zone21，潮間帶 zone16 的父關卡是 zone21。

修正舊版「區域列表」將機場錯標為「完成市集採買解鎖」；修正星穹地圖把機場排在鐘樓車站之前；地圖卡與本機巡檢下拉改按關卡編號排列，學習大廳置末。當前版本自動化測試 339/339 通過；本機 22 場景暖機與 66 次場景切換已完成，瀏覽器 error 0。此筆排列與文案修正待部署。
