# 工程交接手冊 — v2.6.0

更新：2026-10-17。遊戲名稱：《英語魔法探險家：秘境逃脫任務》。本文件取代先前五場景／舊名稱的現行部署說明；歷史設計見 Git 基底 d0493078002a27c46088073f40661117c3f868f7。

## 空間與入口

zone1–zone10 為主線；zone11 魔法餐廳由市集任務接入；zone12 新港國小由操場任務接入；zone13 口琴展示館接續校園。zone14 玻璃溫室接續第三關花園照護任務，只能返回原花園，並可透過星圖查看入口條件。learningHub 為自由學習空間，亦有首頁與選單入口。正式模式仍檢查支線解鎖條件；本機 ?dev=1 巡檢使用還原模式切換，不是正式通關捷徑。

## 模組責任

| 檔案 | 責任與修改注意事項 |
| --- | --- |
| world-3d.js | 3D／圖卡啟動、移動、物件互動、第一關、口說卡。新增互動須使用共用 availability 與口說完成入口，勿在題目 callback 再發 XP。 |
| spatial-zone-manager.js | 十五空間資料、建構、切換、解鎖與貼圖快取。getUnlockedZoneIds 排除大廳並保留支線門檻。metadataOnly 用於地圖備援。 |
| title-screen.js、index.html、style.css | 首頁、game-entered 狀態、彈窗、守護者試煉與入口。守護者必須有當次句型成功才可結算。 |
| speech-manager.js、audio-manager.js | 語音辨識生命週期、朗讀人聲與音樂音量協調；示範語音會中止麥克風。 |
| scavenger-hunt-manager.js | 只在題目指定場景比對物件；兩個單字以單一事件領固定 XP，保存成功後才結算。 |
| restaurant-chapter.js、school-chapter.js、harmonica-chapter.js、realm-quests.js | 題目與機關資料。新章節仍要求指定口說；新增字庫須核對參考範圍及重複配置。 |
| greenhouse-chapter.js、greenhouse-scene.js | 溫室八步口說、照護與分類證據、曲面葉片、玻璃結構、實體入口、碰撞與批次繪製。PICK UP 使用完整片語比對。 |
| learning-hub.js、learning-rewards.js、learning-data.js | 大廳 UI、純獎勵規則、603 字／88 句型；大廳獎勵由後台重算。 |
| record-outbox.js、cloud-sync-manager.js | 每筆事件獨立保存、協定確認、重試與學生護照本機投影。不得改回整份陣列覆寫或先刪除再傳送。 |
| adventure-progress.js、adventure-cloud.js | 道具、機關、位置及跨裝置冒險續玩；與護照通關佇列分開。 |
| gas/StudentRecords.gs、gas/LearningHub.gs | 共用 LearningProfiles 可恢復總額與事件回條；Students、Passport_Logs 是可修復投影。 |
| gas/TeacherAccess.gs | 教師報表工作階段、鹽值雜湊、到期及錯誤嘗試限制。 |
| scripts/build-gas-bundle.cjs | 由七個來源模組產出單檔完整後台；不可只交付其中一個來源模組。 |
| game-diagnostics.js、tests/ | 本機巡檢與自動化測試，不使用正式學生資料。 |

## 計分與存檔約定

等級統一採 floor((XP/100)^(1/1.35))+1，XP 小於 100 為 1。HUD 依當級區間顯示百分比。舊帳號原有的解鎖等級另存 accessLevel，保留進入資格，不補發 XP，也不因此略過支線機關。

原關卡口說由共用完成入口發獎；守護者、尋寶使用固定獎勵，不再疊加一般單字連勝倍率。每次合法練習仍可得分，事件 ID 防止的是同一次請求重送造成的重複入帳，不是禁止後續重練。

已綁定學生先將事件寫到 localStorage 的獨立鍵，再更新本機護照及傳送；後台以 eventId 與內容核對。確認成功必須同時符合 record-v2 與相同 eventId。舊後台、斷線、錯誤回應不會清除待傳資料。訪客不送往學生後台；切換學生不接收上一位的回應。

GAS 所有寫入持有 ScriptLock。先保存 LearningProfiles 回條與目標總額，再批次更新 Students，最後補寫日誌並標記已完成；重試會修復先前中斷處。這是可恢復的多步寫入，不宣稱 Google Sheets 提供跨分頁資料庫交易。

保留舊版待傳陣列作復原來源，遷移使用穩定 ID 與確認標記。升級前已發生但缺少收據的舊版本重複或漏算，不能由新協定自動證明；需另行核對舊日誌，勿直接刪除資料或重設 XP。

## 安全邊界

公開 token 不保密；班級座號選擇不是強身分驗證。姓名遮罩僅減少公開顯示資訊，不能宣稱完整去識別化、法規合規或考試防作弊。原有課堂口說協助機制仍保留，新章節 requireRecognition 題目不能用它完成。

教師維護密碼由管理者在 GAS 的 configureTeacherAccess 手動設定，至少 12 字；只保存鹽值雜湊，不發送給開發者。前端工作階段只留記憶體、十分鐘失效。GET generateReport 不再公開；受保護報表須 POST 並攜帶 teacherSession。公開瀏覽器不存在可信任的管理權限判斷。

## 建置與發布

先執行 npm run build:gas，再執行 npm test，檢查生成來源一致性。GitHub Pages 部署靜態檔案；Apps Script 更新必須另外完成。完整操作見 ../gas-release/README.md。

發布前確認遠端 main、目前正式副本與開發基底一致；不要整包覆蓋未核對的使用者修改。發布後比對主要 JS／HTML 的 SHA-256 與 Pages 部署 commit。後台只做公開 ping 檢查，不送測試成績到學生資料庫。

## 後續維護限制

LearningProfiles 每位學生最多 24 個 40,000 字元區塊；回條目前不自動刪除。達上限會保留本機待傳並回報錯誤；大量長期使用應再設計獨立事件表、保存期限與可驗證封存。不要為瘦身刪掉防重回條。

圖卡模式依現有可互動物件顯示題目，並非獨立重製的所有 3D 視覺體驗。真實辨識品質、多點觸控、全支線完整實機通關及 30 分鐘效能仍列為設備驗收。45 次切換的資源數只能觀察趨勢，不能證明沒有記憶體洩漏。

本次具體採用／未採用項目、測試證據及復原方式見 RELEASE_2_6_0_HANDOVER.md。

## v2.6 新關卡相容性

adventureCapabilities 另回傳 schemaZones；若存檔含 zone14 而後台未宣告支援，前端停止這份跨裝置上傳並顯示本機保留，包含離開溫室後仍攜帶新機關狀態的情況。不得只用 adventure-v1 就推論舊後台能保存新關卡。舊關卡未含新狀態的存檔仍可照常使用。

完整 GAS 產生器在局部 window/globalThis 命名空間內執行純規則，避免舊 helper 汙染；新增測試實際保存／讀回單檔版的新關卡檢查點，不能只測 capabilities。
