# 工程交接手冊 — v2.8.0（本機開發版）

更新：2026-10-23（本機開發版）。遊戲名稱：《英語魔法探險家：秘境逃脫任務》。本文件取代先前五場景／舊名稱的現行部署說明；歷史設計見 Git 基底 d0493078002a27c46088073f40661117c3f868f7。

## 空間與入口

zone1–zone10 為主線；zone11 魔法餐廳與 zone19 魔法數字嘉年華由市集任務接入；zone12 新港國小由操場任務接入；zone13 口琴展示館接續校園；zone14 玻璃溫室接續花園照護任務；zone15 雲雨氣象觀測台接續雲頂觀測站；zone16 香山潮間帶接續氣象站；本機開發版 zone17 圖書館、zone18 創客工坊及 zone20 校慶舞獅彩繪工坊均接在校園迎賓之後。zone18 與 zone20 是教學用想像場景，不代表新港國小有同名實體教室。zone19 使用 GEPT 13–20 數字詞；zone20 使用八個 GEPT 校園美術詞；每步都要求實物線索與口說通過。learningHub 為自由選題學習空間，亦有首頁與選單入口。正式模式仍檢查支線解鎖條件；本機 ?dev=1 巡檢使用還原模式切換，不是正式通關捷徑。本機共有二十個遊戲場景及一個學習大廳。

## 模組責任

| 檔案 | 責任與修改注意事項 |
| --- | --- |
| world-3d.js | 3D／圖卡啟動、移動、物件互動、第一關、口說卡。新增互動須使用共用 availability 與口說完成入口，勿在題目 callback 再發 XP。 |
| spatial-zone-manager.js | 二十個遊戲場景資料、建構、切換、解鎖與貼圖快取。getUnlockedZoneIds 排除大廳並保留支線門檻。metadataOnly 用於地圖備援。 |
| title-screen.js、index.html、style.css | 首頁、game-entered 狀態、彈窗、守護者試煉與入口。守護者必須有當次句型成功才可結算。 |
| speech-manager.js、audio-manager.js | 語音辨識生命週期、朗讀人聲與音樂音量協調；示範語音會中止麥克風。 |
| scavenger-hunt-manager.js | 只在題目指定場景比對物件；兩個單字以單一事件領固定 XP，保存成功後才結算。 |
| restaurant-chapter.js、school-chapter.js、harmonica-chapter.js、weather-chapter.js、coastal-chapter.js、library-chapter.js、makerspace-chapter.js、carnival-chapter.js、realm-quests.js | 題目與機關資料。新章節仍要求指定口說；新增字庫須核對參考範圍及重複配置。 |
| weather-scene.js、coastal-scene.js、library-scene.js、makerspace-scene.js、carnival-scene.js、realm-landscape.js | 氣象站、香山潮間帶、新港圖書館、創客工坊與數字嘉年華場景、材質及依空間切換的光照。切換場景後必須恢復共用光照。 |
| greenhouse-chapter.js、greenhouse-scene.js | 溫室八步口說、照護與分類證據、曲面葉片、玻璃結構、實體入口、碰撞與批次繪製。PICK UP 使用完整片語比對。 |
| learning-hub.js、learning-rewards.js、learning-data.js、weather-learning-data.js、coastal-learning-data.js、library-learning-data.js、makerspace-learning-data.js、carnival-learning-data.js、art-workshop-learning-data.js、makerspace-vocabulary.js、carnival-vocabulary.js、art-workshop-vocabulary.js | 大廳 UI、純獎勵規則、622 詞項／140 句型／15 主題；章節核心詞與 GEPT 詞目在前端、後台產生器及字表檢查中共同維護；4 個字表外科技詞僅作標示清楚的選修補充。大廳獎勵由後台重算。 |
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

## 新關卡相容性

adventureCapabilities 另回傳 schemaZones；若存檔含 zone14–zone20 而後台未宣告支援，前端停止這份跨裝置上傳並顯示本機保留，包含離開新關卡後仍攜帶機關狀態的情況。不得只用 adventure-v1 就推論舊後台能保存新關卡。舊關卡未含新狀態的存檔仍可照常使用。

完整 GAS 產生器在局部 window/globalThis 命名空間內執行純規則，避免舊 helper 汙染；新增測試實際保存／讀回單檔版的新關卡檢查點，不能只測 capabilities。

## 2026-10-23 本機未發佈場景增補

zone12 校舍、zone14 溫室、zone15 氣象觀測台、zone16 潮間帶、zone17 圖書館、zone18 創客工坊、zone19 嘉年華與 zone20 舞獅彩繪工坊的材質／視覺增補、來源、素材雜湊與驗證，記錄於各場景交接文件。本機產生的 GAS 單檔後台待建置後含 zone20 與 622／140 學習資料；目前只在開發工作目錄，未更新 GitHub Pages 或正式 GAS。最新全專案測試 322/322 通過；zone20 已完成本機瀏覽器初始視角檢查，麥克風、手機畫面與低效能設備仍待實機驗收。詳見 [場景寫實度增補交接紀錄](SCENE_REALISM_HANDOVER_2026-10-23.md)、[zone19 嘉年華增補紀錄](ZONE19_CARNIVAL_HANDOVER.md) 與 [zone20 彩繪工坊交接](ZONE20_ART_WORKSHOP_HANDOVER.md)。
# 2026-10-24 世界地圖分區更新

本機地圖已改為全域總覽與五個分區，包含關卡短名稱、向量圖示、前後站與支線入口定位。詳細修改範圍、驗證與部署狀態見 [世界地圖分區改版交接](WORLD_MAP_REGIONS_HANDOVER_2026-10-24.md)。
