# 部署前差異檢查 — 2026-10-24

本次沒有推送或覆蓋正式站。

## 已查證

- 本機 HEAD：525514b，另有尚未提交的新章節、材質與分區地圖。
- 重新 fetch 後遠端 main：fc1baa4。
- 遠端新增四筆提交：a58f87b、f36f737（Blender PBR 模型）、02d0d2b（機場與分區地圖）、fc1baa4（機場建築改善）。
- GitHub Pages API：status=built，來源 main 根目錄，正式網址 https://hs5743.github.io/whimsy-forest-escape/ 。這只確認既有部署狀態，不表示本次改版已上線或遊戲已通過線上操作驗收。
- 遠端 spatial-zone-manager.js 將 zone15 定義為 Starlight Airport，入口 zone5。
- 本機 spatial-zone-manager.js 將 zone15 定義為氣象觀測台，入口 zone7。
- 遠端 gas/AdventureSchema.gs 同樣把 zone15 驗證器與單字配置綁定 AirportChapter。
- 本機上一輪完整測試 326/326；不代表與遠端合併後會通過。

## 判斷與待決策

兩條開發線存在實際關卡 ID 與後台驗證衝突。直接以本機取代 main 會移除機場及遠端模型整合，且 zone15 存檔可能被錯誤解讀。尚未讀取任何真實玩家存檔，無法斷言是否已有受影響玩家。

建議保留正式站機場 zone15，把本機氣象台改用新的唯一 ID，維護其海岸支線連結，合併材質與 PBR 模型更新，並為可辨認的本機舊氣象存檔加入遷移；無法辨認的存檔須保留原資料，不可猜測。完成前後端驗證器一致性測試後，再更新 GAS、推送 Pages 並驗收正式網址。

替代方案是用本機版本取代遠端機場／模型更新，但會移除既有線上功能，不建議採用，且需要使用者明確選擇。
