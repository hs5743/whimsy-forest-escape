# v2.5.1 開發交接與驗收紀錄

日期：2026-10-17。基底：正式 main **718703c5b00dcc7b5ccf57b64eb31b6054e1e790**。外部 v2.5.0 ZIP SHA-256：02e6d20607419c612330334cea2886727f8c6b43a7397c28270f5c61a85c716c。逐項整合，未整包覆蓋。

## 已完成

| 次序 | 行為 | 主要檔案 |
| --- | --- | --- |
| 1 | 單字取消第二次 XP；守護者須當次句型成功且只領一次；尋寶兩字以單一事件領固定 XP | world-3d.js、spatial-zone-manager.js、index.html、scavenger-hunt-manager.js |
| 2 | 2D／3D 共用可見性與通關條件；出口未解鎖不能點；保留進度重試 3D | world-3d.js、title-screen.js、game-polish.css |
| 3 | 每事件獨立佇列；回條先保存，再修復名冊／日誌；大廳與冒險共用總額 | record-outbox.js、cloud-sync-manager.js、gas/StudentRecords.gs、gas/LearningHub.gs |
| 4 | 後台驗證教師雜湊與短期工作階段；報表不接受公開 GET；公開姓名遮罩 | gas/TeacherAccess.gs、gas/Code.gs、index.html |
| 5 | 首頁遮罩、HUD、彈窗層級、主要關閉／箭頭 SVG、自然英語人聲與音量協調 | index.html、style.css、speech-manager.js、scavenger-hunt-manager.js |
| 6 | 四張角色圖壓縮、刪七個無引用貼圖與重複英文 PDF；保留天穹備援 | assets/textures、根目錄重複 PDF |
| 7 | 可重建的完整 GAS 單檔、現行工程手冊、測試及復原說明 | scripts/build-gas-bundle.cjs、gas-release/、README、工程手冊 |

## 與外部包的差異

正式原版為 211/211；外部包原樣實測 217/219。測試替身缺漏與真實缺陷分開修正，未採其「219/219 即已全部解決」的結論。

不以六欄批次寫入冒稱跨分頁交易，改為可恢復回條；不以前端密碼雜湊作教師權限；不讓通用圖卡直接略過機關 callback；不刪仍有備援用途的天空程式。scratch/build-bank.js 原本被 Git 忽略，本機工具保留。

素材檔合計減少約 7.12 MiB；完整專案另新增後台、測試與文件，總量以交付清單為準。高解析角色母檔保留在基底 Git 歷史，另備份於本機審查資料夾 original-portrait-masters。

## 已驗證

- **261/261 自動測試通過**，無跳過；[原始結果](validation/v2.5.1-tests.txt)。包含寫入前後故障、四個 flush 邊界、日誌重試、跨模式合併、兩分頁佇列、舊資料遷移、學生切換、儲存拒絕、教師期限及完整單檔相容。
- 真正瀏覽器 WebGL 失敗後，以圖卡完成第一關十二字、機關、SUN 與前往市集；門未開出口不可用。辨識採本機模擬事件，不連正式學生資料庫。
- 從圖卡恢復真正 WebGL 後，市集、680 XP、道具與機關保留，沒有重建整個世界。
- medium 固定畫質，十四空間三輪 **42 次切換**，failedTextures 全為 0；[巡檢原始紀錄](validation/v2.5.1-scenes.json)。後兩輪貼圖數全一致，12 場景的幾何／繪製數完全一致；zone1 幾何 +5／繪製 +2、zone6 幾何 -1／繪製 +1，列為後續追蹤，不能宣稱零洩漏。
- 巡檢版面 2560×1440、渲染 pixelRatio 0.75。最終累積 1711 個可見幀、p95 37.1ms，包含切換成本，非各場景獨立穩態 FPS。
- 小尺寸大廳搜尋 apple、選題、題卡與關閉入口正常，DOM 寬度與內容寬度均 480px。工具最低實際寬度 480px，未宣稱完成 390px 手機／多點觸控驗收。
- 未對正式學生送測試成績，未初始化正式試算表。

## 發布及後台交付

開發前已核對正式本機、GitHub 與網站：171 個追蹤檔、17 個主要線上前端檔一致；發布前再次確認遠端 main 仍為基底且正式本機乾淨。發布後 commit、Pages 作業及檔案比對另存交付包旁「部署驗證紀錄.json」，不將預期部署寫成成功。

公開 GAS ping 仍回報 **20261014-main**，learning-v1／603 字／88 句型，沒有 record-v2。**後台尚未更新**；新版原關卡事件會保留在裝置並顯示等待更新。管理者按 [完整後台操作說明](../gas-release/README.md) 更新原部署，保留 URL 與權限，勿執行 initSpreadsheet。

可直接貼上 gas-release/Code.gs 或同內容的「完整主程式_直接貼上.txt」。來源包含七個模組，npm run build:gas 可重建；單獨 gas/Code.gs 並不完整。教師密碼由管理者在 configureTeacherAccess 手動設定，不需交給開發者。

## 復原與下次工作

網站回退用 Git revert 新提交發布，勿強制改寫 main；基底 commit 可取回原檔。GAS 可切回原部署版本，新版網站會保留待傳事件。回退不會撤銷已入帳分數；資料復原前先停寫、備份並核對期間事件，勿刪本機佇列或 LearningProfiles 回條。

舊版已發生但沒有收據的事件不能由新協定證明是否入帳；有舊帳差異須另外對帳。顯示等級依 XP 重算，既有 accessLevel 保留進入資格，不送 XP，也不略過支線機關。

下一輪依序：管理者更新正式 GAS 並以指定測試身分驗收 → 真實麥克風／手機與各支線通關 → 30 分鐘固定設備效能並追蹤 zone1 幾何 → 長期事件保存與強學生身分驗證。LearningProfiles 上限為 24×40,000 字元，達上限保留本機事件並回報，不自動刪除防重歷史。
