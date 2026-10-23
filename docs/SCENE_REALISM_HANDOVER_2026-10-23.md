# 場景寫實度增補交接紀錄

日期：2026-10-23（Asia/Taipei）  
本機基底：`525514bf4c6d6ed9d582d0e8a248352f34702cc9`（GitHub `main` 當時的 v2.6.0）  
狀態：本機開發修改，尚未提交、推送或部署。正式網站不受影響。

## 這一輪修改

### zone14 玻璃溫室

- 以鋼構拱肋、縱向檁條、弧形屋頂玻璃、側牆玻璃、端牆、排水管、通風扇及灌溉管組成可辨認的溫室空間；讓空間結構本身說明「這裡是溫室」，不依賴大型漂浮招牌。
- 使用石材步道、磚砌花床、深綠粉體塗裝鋼構、帶水痕玻璃及葉脈材質；改用連續地板與實例化重複物件，減少拼接痕跡與重複方塊。
- 降低陽光強度，並把吊盆降低，避免從初始視角裁切。
- 實際瀏覽器預覽：FPS 約 32–54（個別畫格會變動；這不是穩態效能基準）。尚需在較低效能裝置檢查。

### zone12 新港國小

- 新增清水混凝土、紅色橡膠跑道、圖書館磨石子三種材質，分別套用到校舍外牆、跑道及地坪。
- 在跑道加入白色分道線。
- 把校門任務桌從正中視線移到入口側邊，縮小成可使用的迎賓桌，讓校舍正面與中央通道重新成為畫面焦點。
- 場景沿用使用者提供的校門、校舍、跑道、司令台與圖書館照片線索；幾何是遊戲化重構，並非建築測繪或現況複製。新材質是依照片中的材質類型另行生成，沒有把照片直接加工或混入遊戲。

## 外部場景研究

溫室只借用公開案例可驗證的結構線索，並未仿製單一建築：

- [Hortus Botanicus Amsterdam 溫室，ZJA](https://www.zja.nl/en/Hortus)：鋼與玻璃構成、依氣候分區的植物空間。
- [科隆 Flora 植物園展覽溫室，Dlubal](https://www.dlubal.com/en/downloads-and-information/references/customer-projects/001263)：拱形鋼構與玻璃分翼；頁面列出主要鋼樑約 3 公尺間距，作為遊戲拱肋節奏的參考。
- [Taiyuan Botanical Garden Greenhouse，DMAA](https://www.dmaa.at/work/taiyuan-botanical-garden-greenhouse)：曲面、分層構造與沉浸式參觀動線。

以上是設計參考，不表示遊戲場景是上述建築的精確模型。學校場景依據使用者提供的校園照片與既有公開校史資訊。

## 生成材質與來源

所有下列材質已轉為 WebP（Pillow，quality 89、method 6）並放在 `assets/textures/`。雜湊為輸出檔 SHA-256，便於後續確認素材未被替換。

| 輸出素材 | 像素 | SHA-256 | 生成方向與原始輸出 |
|---|---:|---|---|
| `greenhouse-floor-v1.webp` | 1254×1254 | `47D6CCE1E0295D4FE7FA0CE32BDB507DE41DDE3CFF958BCE11DCA06B7F92854F` | 無方向性陰影的舊化淺灰石灰岩鋪面；原始 PNG `exec-efdd2f3a-1fde-444e-8885-f41bbce18811.png` |
| `greenhouse-brick-v1.webp` | 1254×1254 | `3B8AD47D7B9CFEAF878DC3015AF41655E74AD2548636E064AD1F8A6EEE0D61E7` | 紅陶磚、跑馬砌法、細微風化；原始 PNG `exec-d7e165f2-424d-45f5-8499-e9f590f4bb55.png` |
| `greenhouse-glass-v1.webp` | 1254×1254 | `6D6048004394F0686587593DCB06D37808B1005495DBE74CBE27EF36DDA0EB05` | 近透明玻璃、淡水痕與礦物痕跡，不含窗框；原始 PNG `exec-202cb5aa-dec5-468a-8b7f-4091a6b3a38f.png` |
| `greenhouse-leaf-v1.webp` | 1774×887 | `A32644B422C41FAD2341C006C18F3461E5821391DE5B286A4D6FA353034092A3` | 葉片近拍、中央葉脈與細側脈；原始 PNG `exec-5263e8e5-b26d-4d77-be45-636f5fb623c8.png` |
| `greenhouse-frame-v1.webp` | 1254×1254 | `BEE6E53ABFB654D6DC88289BA1FAA0CEA19766E2CBFBCDB3F23F93909FC2321F` | 深森林綠粉體塗裝鋼材、細橘皮紋與微磨耗；原始 PNG `exec-d8fcf415-2ca3-4895-8219-3b4a0e5e08bb.png` |
| `school-concrete-v1.webp` | 1254×1254 | `585F9744F0C8D88347C368B62260C8419F10B6E00B8B6E4EC2660CD88D121562` | 無縫、方形 PBR 清水混凝土：細水泥粒、模板色差、微小氣孔與礦物斑點。原始 PNG `exec-11ad17aa-f4b0-4ef6-8c6d-a282f634bea2.png` |
| `school-track-v1.webp` | 1254×1254 | `A3A7B6E5847D37252E8711CCB7BEC458F5134BECD85F2F9378D7788043FAE6C1` | 無縫、方形 PBR 紅色 EPDM 橡膠顆粒；不含跑道線。原始 PNG `exec-f22f4301-b2e9-4f51-9ac5-6d0e88ba85aa.png` |
| `school-terrazzo-v1.webp` | 1254×1254 | `204BCE3408FDEA591DE4CA8665AEDE8AE2EE8A118D7B9BEF8D893C43A00FD58B` | 無縫、方形 PBR 圖書館磨石子：灰色水泥與淺灰、米色、炭灰石粒。原始 PNG `exec-207715e0-e884-4174-961c-3d73a09c7172.png` |

本機生成 PNG 位於 `C:\Users\wsyeu\.codex\generated_images\01a120af-6f70-7a13-b71a-6288be677ddf\`；網站實際使用的是上表列出的專案 WebP。前五項沿用本輪之前建立的材質；上一輪沒有把逐字 prompt 存入專案，因此上表如實記錄已保存的生成方向與原始輸出名稱，不把摘要宣稱為逐字 prompt。

本輪新生成素材所用完整 prompt：

1. `school-concrete-v1.webp`：`Create a seamless tileable PBR base-color texture, square 1024x1024, for a contemporary Taiwanese elementary-school exterior made from fair-faced reinforced concrete. Fine close-grained gray cement, subtle formwork tone variation, tiny pinholes and mineral flecks, gently weathered but maintained, realistic neutral overcast daylight, no strong cast shadows. Uniform scale. No windows, no seams, no text, no logos, no architecture, no objects, no perspective, no vignette.`
2. `school-track-v1.webp`：`Create a seamless tileable square 1024x1024 PBR base-color material texture for a Taiwanese elementary-school running track, made of red EPDM rubber granules. Deep brick-red / muted vermilion surface with fine dense rubber crumbs and subtle outdoor wear, slight tone variation only. Flat orthographic material scan, evenly lit, no directional shadows, no white lane markings, no text, no objects, no perspective, no vignette.`
3. `school-terrazzo-v1.webp`：`Create a seamless tileable square 1024x1024 PBR base-color material texture for a polished but gently worn gray terrazzo floor in a contemporary elementary-school library. Small irregular pale gray, warm beige and charcoal stone chips embedded in medium gray cement, subtle mottling, clean maintained school, realistic close-up, uniform scale, flat orthographic, evenly lit. No grout lines, no furniture, no books, no text, no perspective, no vignette.`

## 新關卡 zone15「雲雨氣象觀測台」

從 zone7 雲頂星空觀測站延伸一條實際的地面氣象站支線；完成「東方月亮」觀測後解鎖，並可循原路返回。場內配置雲況觀察窗、雨量筒、日誌、日照感測板、風向風速計、百葉箱與雨衣展示。八個步驟都要求先讀取當前儀器線索，再完成新一輪口說辨識，包含重試、過關回饋與場景切換時作廢的舊回呼。

核心字 `WEATHER, CLOUDY, RAIN, RAINY, SUNNY, WINDY, HOT, WET` 已核對 GEPTKid 字表頁 13，互不重複於 zone11–zone14。這些詞原本已在 603 詞大廳字庫內；此輪新增一個八詞主題與八張句型練習卡，因此字庫總詞數仍是 603，學習句型／配詞項目從 88 增為 96。氣象器材設計參考[中央氣象署測站介紹](https://etour.cwa.gov.tw/station_inpage.php?stn_id=3)與[國立臺灣科學教育館氣象觀測說明](https://www.ntsec.edu.tw/liveSupply/detail.aspx?a=6829&cat=6841&lid=6865&p=1&print=1)。

此場景沿用 zone12／zone14 已生成的混凝土、鋼材、跑道與磨石子貼圖，沒有新增無法追溯的圖庫素材。支線純驗證規則已納入 GAS schema 產生器，更新後可保存 zone15 檢查點；正式 Apps Script 尚未更新。舊後台不支援 zone15 時，冒險跨裝置同步會停在本機保留狀態，不會靜默丟棄進度。

## 驗證與剩餘工作

- `npm run build:gas` 通過；生成的後台版本仍需管理者自行更新既有 Apps Script，正式後台未變。
- 新增 `tests/weather-chapter.cjs`，驗證 8 步線索＋口說、檢查點、父關卡解鎖、碰撞／目標、舊後台保留及完整 GAS 存讀。
- `node scripts/check-vocabulary.cjs` 通過，zone11–zone15 核心字皆在參考範圍內且互不重複。
- 本機預覽仍需做 zone15 視覺與實際入口驗看；FPS 讀值只代表當次測試，未在低階設備或手機建立效能基準。跨裝置雲端同步仍需另外更新正式 Apps Script 後驗證。
- 本機預覽使用 `http://127.0.0.1:8774/?dev=1&realism=4`；新素材需一併部署才會出現在雲端。
- 本機瀏覽器已實際開啟 zone15，確認入口任務提示、天氣專屬音樂、巡檢選單與觀測工作單正常；第一次視覺檢查後縮小並後移遮雨棚、改成圖像化觀測板與立體雨衣，並把採樣球移到紀錄桌以免遮板。控制台沒有 JavaScript error/warning。當次 HUD 讀數約 56–79 FPS，僅是此裝置及場景瞬間值，不作硬體效能承諾。
- 全套 `npm test` 共 280 項通過；`npm run build:gas`、`git diff --check` 及 GEPT 重複字檢查通過。開發選單的十六空間巡檢也完成 48 次場景切換，瀏覽器控制台無 error/warning。
- 現場入口仍須在正式模式通過 zone7 的月亮觀測任務；本機 `?dev=1` 直接切關只用於品質檢查。麥克風實際辨識與低階手機效能尚未在真實設備驗證。
- 正式網站、GitHub、Google Apps Script 後台本輪都未修改；不能將本機效果描述為已上線。

## 追加開發：zone16「香山潮間帶」與學習字庫擴充

### 關卡與場景

- zone16 接在 zone15 雲雨氣象觀測台支線後，須完成氣象關卡八步口說任務才可進入；完成後可沿場景出口回 zone15。雲端純狀態驗證也包含新支線，並由 `npm run build:gas` 產生本機可貼入的後台版本；正式 Apps Script 尚未更新。
- 以潮濕泥灘、潮池、水道、濱海草叢、架高混凝土賞蟹步道、觀景棚、野外紀錄桌、雙筒望遠鏡與分類回收桶組織空間。另有小型招潮蟹作為棲地線索；任務提示要求留在步道觀察、不踩入棲地。這是基於公開教育線索所做的遊戲化場景設計，並非香山濕地現場的精準測繪或複製。
- 以正式教育資料作生態與參訪動線線索：[新竹市教育新聞網的泥灘生物觀察活動](https://schnews.hc.edu.tw/News/Details/220002)、[香山濕地賞蟹步道教育活動](https://schnews.hc.edu.tw/News/Details/172777)，以及[香山濕地學習單](https://www.nlps.hc.edu.tw/uploads/1703139314690qJj2o7rX.pdf)。本次沒有下載或直接使用網頁照片。
- 視覺校正已收窄並降低步道高光、移除孤立遠景樹，並修正通用場景設定覆寫 zone16 柔光的問題；zone16 使用較低曝光、較深的遠景色與獨立光照，離開該區仍恢復其他場景設定。最新本機畫面已確認遠景層次和步道對比改善；仍是風格化 3D 重建，不代表完成真實場址測繪。

### GEPT 字表核對與學習量

- 完整讀取使用者提供的 18 頁《「小學英檢」GEPT Kids 參考字表（按主題分類）》PDF。檔案 `C:\Users\wsyeu\Downloads\GEPTKid_wordlist02.pdf`，內部建立時間 2026-01-21，LTTC © 2026，SHA-256 `CD07356A9A30E157A04EB1FAE4A35D95900433A004164425177D13CCD9B28C37`；此記錄可用於確認來源版本。沒有修改或複製原始 PDF。
- zone16 的八個關卡核心詞均在 PDF 內且不重複先前關卡核心詞：`BEACH`（p.4，名詞）、`SEA`（p.4，名詞）、`SCIENCE`（p.10，名詞）、`DIFFERENT`（p.17，形容詞）、`INTERESTING`（p.17，形容詞）、`IN FRONT OF`（p.15，介系詞片語）、`LOOK`（p.16，動詞）及 `TRASH`（p.15，名詞）。
- 其中五個項目原本不在遊戲現有 603 詞學習字庫：`SCIENCE, DIFFERENT, INTERESTING, IN FRONT OF, TRASH`。加入後為 608 詞、十個主題、104 張學習句卡（潮間帶主題八張）；另外三個關卡詞已在字庫中，仍用於本關練習但不重複計入新增量。`coastCore` 對照詞表及自動化測試均涵蓋字表來源與跨關卡去重。

### 新增無縫材質

以下 WebP 均為本專案場景用途生成的材質，不是實地照片；以 Pillow quality 89、method 6 轉檔。生成 PNG 保存在本機 Codex 生成素材目錄，專案只依賴下列輸出。

| 專案材質 | 尺寸 | SHA-256 | 用途 |
|---|---:|---|---|
| `assets/textures/tidal-mudflat-v1.webp` | 1254×1254 | `F9F686617663D828EC5CEBDE479B5C74B7DAE5D0CBC3E5C21F1E19970ABE6A6B` | 細灰褐淤泥、微小貝殼屑與淺水濕痕 |
| `assets/textures/weather-gravel-v1.webp` | 1254×1254 | `E8B7D8478C24A75A5FBF3F9C957B8D5380CD25E5430058614A3BF15229472878` | 天氣站小徑礫石；同步替換先前不適合延伸到自然觀測區的紅色跑道 |
| `assets/textures/coastal-concrete-v1.webp` | 1254×1254 | `51ED2A7CB53A7AF7BD2D0A0849B02DDCEB24E9EAAF03FC6ABAC06012C6EBD69E` | 淺暖灰色、含細骨材的濱海步道混凝土 |

逐字生成 prompt：

1. 泥灘：`Use case: photorealistic-natural. Asset type: seamless game-world PBR base-color tile texture, square. Primary request: a high-detail realistic Hsinchu coastal tidal mudflat surface for a child-friendly ecology exploration game. Scene/backdrop: uniformly framed close-up ground material, as if scanned straight down at low tide. Materials/textures: fine gray-brown silt, irregular shallow water sheen, tiny natural shell fragments and subtle tiny crab-hole dimples, restrained wet/dry patches, believable scale. Lighting: diffuse overcast coastal daylight, evenly lit with no directional cast shadow. Constraints: seamless tileable edges on all sides, no horizon, no perspective, no vignette. Avoid: animals or large shells, footprints, plants, words, labels, symbols, people, architecture, hard division lines, dramatic puddles, exaggerated stylization.`
2. 礫石：`Use case: photorealistic-natural. Asset type: seamless tileable game material texture, square PBR base color. Primary request: realistic compacted pale gray coastal station gravel and fine pebble surface, suitable for a small outdoor weather observation area. Scene/backdrop: flat close-up top-down material scan. Materials/textures: mixed fine river gravel, subtle sandy dust, a few tiny irregular stones, lightly weathered but maintained, natural gray-tan palette, realistic consistent grain scale. Lighting: diffuse even daylight, no directional shadows. Constraints: seamless edges on all sides, uniform scale, no perspective, no vignette. Avoid: track stripes, painted markings, large rocks, plants, text, objects, footprints, architecture, dramatic shadows.`
3. 步道混凝土：`Use case: photorealistic-natural. Asset type: seamless tileable game PBR base-color texture, square. Primary request: the pale, weather-exposed concrete walking surface of a raised coastal wetland observation trail in northern Taiwan. Scene/backdrop: flat top-down material scan. Materials/textures: light warm gray poured concrete with fine sand aggregate, subtle salt-air mottling, soft shoe wear, tiny pinholes, gently rounded aggregate; believable clean public boardwalk, not polished. Lighting: diffuse overcast seaside daylight, even across the surface. Constraints: perfectly tileable all edges, uniform scale, no cast shadow, no perspective, no vignette. Avoid: painted line markings, cracks that form seams, large stones, objects, text, logos, people, architecture.`

### 本機驗證與交付邊界

- 全套 `npm test`：287 項通過、0 失敗；`npm run build:gas`、`node scripts/check-vocabulary.cjs` 與 `git diff --check` 通過。測試輸出中的 WebGL 禁用訊息是 2D 降級測試的預期模擬；少數 `map` 警告來自既有測試材質 fixture。
- 本機瀏覽器以 `?dev=1&realism=4&cache=20261023p` 開啟 zone16，確認場景、HUD、潮間帶任務面板與進度文字出現；目前任務選項不洩漏正解，須先選線索，口說按鈕才可用。畫面顯示約 59 FPS 的瞬間讀值，非穩態效能測試。未啟用麥克風，亦未在低階手機驗收。
- 較早一次預覽曾出現 `coast-vocabulary.js` 載入錯誤；程式已修正並由「詞彙登錄」回歸測試覆蓋。最新 `20261023p` 預覽檢查未發現瀏覽器 console error。
- 正式網站、GitHub 與正式 GAS 資料庫未更改或部署；新場景、材質及字庫只在本機工作樹內。正式跨裝置檢查點要等管理者貼入重新產生的 GAS 程式並部署新版本後才能驗證。

## 追加：氣象觀測台與香山潮間帶場景質感修整

本輪將兩個已接入遊戲與學習大廳的場景再做一次結構與材質整理。這些場景是依公開資料製作的風格化 3D 教學場景，並非場址測繪，也不使用來源頁面的實景照片。

- **zone16 香山潮間帶**：以一條連續彎曲的混凝土賞蟹步道串接場域，加入完整欄杆、立柱與伸縮縫；兩側改為較自然的不規則泥灘、水池與蜿蜒潮溝，沿棲地邊緣配置草叢及小型生物線索。任務仍引導學生在步道上觀察，不進入棲地。設計參考[新竹市教育新聞網的香山濕地賞蟹步道活動](https://schnews.hc.edu.tw/News/Details/172777)及[臺灣觀光署香山濕地賞蟹步道資料](https://www.tad.gov.tw/m1.aspx?id=A12-00635&sNo=0001109)；後者指出步道以架高曲線動線深入濕地，觀察潮間帶生物時須考量潮汐、風況與棲地干擾。
- **zone15 雲雨氣象觀測台**：以開放的觀測草地及周界網格圍欄呈現氣象站空間，清除占據視線的大型棚頂與場址看板，保留雨量筒、百葉箱、風向風速設備及小型紀錄桌。器材配置參照[中央氣象署氣象觀測科普資料](https://pweb.cwa.gov.tw/PopularScience/wt/wt_37.html)與[中央氣象署觀測場導覽](https://etour.cwa.gov.tw/guide_inpage.php?floor_id=18&spot_id=21&stn_id=11)；這是器材用途和觀測空間的參考，不代表複製任何特定測站。
- 質感材質改用低頻、少重複的大面積貼圖配置：泥灘與觀測草地各覆蓋主要地面一次；步道按伸縮縫分段重複混凝土材質，讓接縫有合理的建築節奏。生成素材不應描述成實地掃描或完美無縫材質；目前已量測貼圖四邊差異，邊緣仍有些微明暗變化，因此避免在大面積平面上高頻重複。

| 本輪素材 | 尺寸 | SHA-256 | 用途 |
|---|---:|---|---|
| `assets/textures/tidal-mudflat-v2.webp` | 1254×1254 | `A8DFDF9CA267F738E185DCA2B2E388C88FD417DDE2B0FAA574213A35681362D9` | 香山濕地主要泥灘面；單次大面積鋪設，降低可見重複 |
| `assets/textures/coastal-concrete-v2.webp` | 1254×1254 | `7C7BAE896C6B960C9D36ED8C80D2C5318D758DEF629237BD66237CF962CC0A2D` | 彎曲步道；依伸縮縫分段使用 |
| `assets/textures/weather-yard-grass-v1.webp` | 1254×1254 | `684721E17BB8EEE2728D2299805C8FE37AEEA1EC6D35DFA07EDBD20DFD476022` | 氣象站觀測草地；單次覆蓋主場地 |

三張材質的 ImageGen 原始 PNG 分別為 `exec-38b2cbbf-6155-4875-84f3-f5ccfaa2c3c5.png`、`exec-d4911397-cfc8-4441-8a72-3a6b7cb0aab7.png`、`exec-9ee422ee-5221-4a7a-9511-045ce2c51275.png`，保存於使用者本機 Codex 生成素材目錄；專案 runtime 使用上表所列 WebP。此輪交接記錄保存了素材輸出名稱、尺寸與雜湊，但未保存可核對的逐字 ImageGen prompt，因此不把上述方向文字宣稱為原始 prompt。

### 單字與學習大廳

兩關都保留八步線索與口說完成的原有流程，並同步加入學習大廳主題與句型卡。字庫目前為 **608 個單字、104 張句型卡、10 個主題**；其中潮間帶新增 `SCIENCE`、`DIFFERENT`、`INTERESTING`、`IN FRONT OF`、`TRASH` 五個 GEPT Kids 字表詞，氣象關卡詞已存在於原字庫，不重複灌入。字表來源與跨關卡去重規則仍見上文的 zone16 GEPT 核對記錄。

### 本輪驗證與未完成驗收

- `npm run build:gas`、`npm test`（287/287）、`node scripts/check-vocabulary.cjs` 及 `git diff --check` 通過；新場景測試仍檢查 8 步口說、開鎖、互動物件與字庫登錄。
- 瀏覽器已在本機 `?dev=1` 預覽香山潮間帶，確認彎曲步道、欄杆、潮池與 HUD；當次頁面顯示約 57 FPS，僅為單一裝置的瞬間讀值。該畫面仍有風格化遠景與水面水平帶，不能據此宣稱已達照片寫實或完成多裝置效能驗收。
- 本輪 zone15 的修改已由自動化場景測試覆蓋；本次瀏覽器檢視停在 zone16，未以繞過鎖定的方式直接強制進入氣象站。未在真實麥克風、低階手機或正式模式完整通關驗收。
- 本輪沒有變更正式網站、GitHub 或 Google Apps Script 部署；新場景與素材仍只在本機工作目錄。

## 追加開發：新港國小圖書館支線 zone17

依使用者提供的新港國小圖書館照片，延續 zone12 校園迎賓任務建置二樓圖書館支線。這是依照片特徵重建的遊戲場景，不是校舍測繪或實景複製；照片本身沒有直接貼入遊戲。空間保留挑高窗面、橘色階梯與階梯下書架、藍色網格欄板、木桌、書架以及橘綠閱讀座，並補上封閉天花、圖書展示板、暖色吊燈與柔和室內補光。圖書館只在完成 zone12 校園任務後由樓梯入口解鎖；完成後沿原入口返回 zone12，不影響主線進度。

八個學習步驟依序為 `SHELF, STORY, STUDENT, TEACHER, STUDY, QUIET, BORING, EXCITING`。每一步都先辨認場景線索，再完成新一輪口說辨識；重複或過期的語音回呼不會推進進度。詞彙已按 GEPT Kids 字表核對，並與既有支線核心詞去重：六個詞原已存在於大廳，新增 `BORING`、`EXCITING` 兩詞；另加入八張句型卡及一個主題，總量更新為 **610 個單字、112 張句型卡、11 個主題**。

本機視覺驗收使用 `?dev=1` 冒險選單中的「本機場景檢查」進入 zone17，未繞過正式遊戲鎖定。實際畫面可見挑高閱覽室、階梯、書架列、木桌和閱讀座；任務 UI 顯示 `The books are on the shelf.`，選對 `SHELF` 後才啟用「口說 SHELF」按鈕。這次沒有啟動麥克風，也沒有把模擬口說當成真實辨識驗收。室內畫面仍有風格化幾何與程序材質，尚未在低階手機或不同顯示器做視覺及效能比較。

驗證結果：`npm test` 共 **295/295 通過**，包含 `tests/library-chapter.cjs` 的線索＋口說門檻、檢查點防偽、父關卡解鎖、GEPT 核對、字庫註冊與場景幾何／目標檢查；`node scripts/check-vocabulary.cjs`、`npm run build:gas` 及 `git diff --check` 通過。測試及 GAS 產生器只更新本機工作樹；GitHub Pages、GitHub 遠端與正式 Apps Script 都沒有部署或修改。新版檔案須另行審查與部署，雲端檢查點要在正式 GAS 更新後才能驗收。

## 追加精修：圖書館窗景與創客工坊材質

本輪以使用者提供的新港國小圖書館照片作為圖書館線索，並把創客工坊維持為承接校園主線的虛構教學場景。沒有把提供的校園照片直接貼進遊戲；窗外環境與材質為另行生成素材。

- **zone17 圖書館**：使用 2×2 材質圖集，分別取出磨石子地面、淺橡木飾面、橘色樓梯塗裝及藍綠穿孔金屬欄板；把背牆與側牆改為窗洞分段結構，加入窗外校園樹蔭、校舍與操場的連續景圖。背面六扇窗與側面五扇窗各使用全景相鄰裁切，並以獨立透明深度排序處理，避免材質被窗洞牆層遮住；將貼圖設為 sRGB、玻璃覆蓋率降至 0.09，並柔化室內環境光，保留窗景與家具材質色彩。
- **zone18 創客工坊**：另用 2×2 材質圖集區分淺灰工作地坪、樺木工作檯、穿孔工具板與深色防滑工作墊；背面與側牆加入窗洞和校園景圖。新增桌上型 3D 列印機模型，具備安全窗、鋁擠型框架、列印滑軌、噴頭與線材輪，補足科技工坊的辨識度。
- 材質圖集透過 `getAtlasTexture()` 裁切為共用的四個區塊，素材只載入一次；圖書館與創客工坊場景測試驗證材質區塊、十一個窗景面板的相鄰裁切與繪製層級、窗洞結構及列印機模型。圖書館腳本快取參數同步更新，預覽重載後可確認生成的校園景色真正出現在窗內。

| 素材 | 尺寸 | SHA-256 | 用途 |
|---|---:|---|---|
| `library-material-atlas-v1.png` | 1254×1254 | `FB6D1CA4237A30B6AB9D14680559536124D302BB60EBC9055B4D1779A8E64CFD` | 圖書館磨石子、橡木、橘色塗裝與穿孔欄板四格材質圖集 |
| `library-courtyard-window-v1.png` | 2172×724 | `0DB2A36D95D8552071986BCDE941BC30C46DB7BDC9DD2B0E270F214F4139EF2C` | 由圖書館／工坊窗戶看見的生成式校園樹蔭、校舍及操場景圖 |
| `makerspace-material-atlas-v1.png` | 1254×1254 | `BDC7D92E6A7FF8C628EDD5932036A878A7E68A9A3FE5E5256F0AB1F1FE9CA1C9` | 創客工坊地坪、樺木、工具板與工作墊四格材質圖集 |

三張素材的 ImageGen 原始 PNG 位於本機 Codex 生成素材資料夾，檔名分別為 `exec-bed9389b-a04b-47a8-883c-d0641cde5c21.png`、`exec-92c81dd9-05c4-4c27-bfec-237cc03bdcc6.png`、`exec-e1d9a36b-6863-4a33-bc2a-669810b32005.png`。前兩張是圖書館材質與窗外校園景圖，第三張是創客工坊材質圖集；原始尺寸與專案素材相同。

### 驗收與部署狀態

- 本機 `?dev=1` 場景選單已分別驗收 zone17 與 zone18。圖書館背窗及側窗可見校園景圖；創客工坊畫面可見多面窗景、工具板、工作桌、中央小車測試道與機器人。前景畫面約 50–69 FPS，讀取背景分頁時會顯示省電狀態；這些是單一裝置的瞬時讀值，不作跨裝置效能保證。
- 最新 `npm test`：**314/314 通過**；`node scripts/check-vocabulary.cjs`、場景 JavaScript 語法檢查及 `git diff --check` 通過。
- 所有變動仍在本機未提交工作樹。未修改 GitHub、GitHub Pages 或 Apps Script，亦未部署。瀏覽器預覽最後停在 zone18，方便接續驗收；要發布仍需依既有交接流程審查整體工作樹後再部署。

## 追加精修：zone19 魔法數字嘉年華

本次續作集中修整已存在的園遊會支線，並未新開脫離原世界地圖的入口。設計參考[臺中市觀光旅遊局大坑九號夜市圖集](https://travel.taichung.gov.tw/en/multimedia/album/14965)與[臺北市政府饒河街觀光夜市介紹](https://english.gov.taipei/News_Content.aspx?n=460F7826293CF0BA&s=B5AA9E1F8B583A2F&sms=07D68BC61ECBFF67)，只取用多攤位分布、戶外廣場與清晰通行動線概念；場景是遊戲化園遊會，不是上述場址的複製。

- 把連續過大的棚頂改為七座獨立帆布攤位，採北側三座、東西兩側各兩座，保留南側入口與中央步道；重新面向攤位櫃檯，入口視角能看見廣場內部。
- 以三張生成材質替換地面、帳篷與木櫃檯舊貼圖；輸出為 1254×1254 RGB WebP，尺寸分別為 632,954、642,052、326,748 bytes。SHA-256 依序為 `0AB6F9E10A6A87F8A329BF7F835ADDDD5B7523D42015F52996C7849D65743048`、`475DC7A499AE45FB034AC3FAB39B16FEABEEE88D86D515C7E579D9EA950F3168`、`68FBBBD5013839D99298C4C80851AF8386B3CA6BD2BABA1FD672FAB1CFA2DACC`。材質方向與本機原始素材說明見 [zone19 嘉年華交接紀錄](ZONE19_CARNIVAL_HANDOVER.md)。
- 保留七站數數與口說步驟，以真正立體的浮雕星籌替代平面球體；不在招牌上揭露答案。場景 9 個互動目標與市集支線往返維持原規則。
- 使用 `?dev=1` 的本機場景檢查預覽實際查看入口、攤位分布與廣場材質。當次 browser console 沒有 error/warn；約 69 FPS 是單機瞬間值，未代表低階設備或跨平台效能。
- `npm test` **322/322 通過**；場景腳本語法檢查及 `git diff --check` 通過。所有修改僅在本機工作樹，尚未部署或更新雲端資料庫。

## 追加開發：zone18 創客工坊與場景細節

新港國小支線延伸出 zone18「新港國小創客工坊：小小機器人任務」。這是承接校園迎賓任務的**虛構教學場景**，不是新港國小現有實驗室的描述或實景複製。設計取材於國小科技教育常見的動手做、零件辨識與低速機器人測試；[國立臺灣科學教育館 2026 年兒童營隊資訊](https://www.ntsec.gov.tw/article/detail.aspx?a=6044)提到面向國小三至六年級的 AI、micro:bit 與機器人實作活動，僅作年齡和教學形式參考。

場景包含四張上方圖解牌（`POWER`、`GEARS`、`ROBOT`、`TEST`），把電池、齒輪、組裝與測試順序放入牆面；補上穿孔工具板、防靜電工作墊、四張分組工作桌、零件箱、轉向與齒輪測試座，以及有實體玻璃窗與把手的校園返程門。圖解牌由程式繪製到 CanvasTexture，採 sRGB 編碼；無 Canvas 支援的測試環境會退回素色牌面。固定場景物件會合併為 instanced meshes，避免裝飾細節逐件增加繪製呼叫。

每一步均先觀察並選對實體線索，再要求新一輪英語口說辨識才推進。八個核心字為 `ROBOT, MAKE, FAST, SLOW, TURN, WORK, READY, START`，皆在使用者提供的 GEPT Kids 參考字表中，且不與先前支線核心字重複；另有 `MOTOR, WHEEL, BATTERY, SENSOR` 四個字表外補充詞，清楚標作選修，不混入 GEPT 核心。新增一個核心主題、一個補充主題與十二張情境句卡；學習大廳合計 **614 個詞項（610 個 GEPT 參考詞 + 4 個延伸詞）、124 張句型卡、13 個主題**。

新增兩張生成材質，來源 PNG 在本機 Codex 生成目錄（本機檔名分別為 `exec-90b69b26-8afb-42e0-824b-812dad16911c.png` 與 `exec-c702ca3b-4ca7-4784-8f26-40f3f666d32a.png`）；專案 runtime 使用下列 WebP。PNG 來源不是實地掃描，且不打包在遊戲內。

| 專案材質 | 尺寸 | 位元組 | SHA-256 | 用途 |
|---|---:|---:|---|---|
| `assets/textures/makerspace-pegboard-v1.webp` | 1254×1254 | 177,420 | `B7AF48C693E4511588CC463CF5567C433E300AD9E51E4BC00BF67B0E7927D70F` | 淺灰粉體烤漆穿孔工具板 |
| `assets/textures/makerspace-work-mat-v1.webp` | 1254×1254 | 334,580 | `545BA9DA0DA17E562B8AE279F34A395E182855F652B2A42BD54710666C1517D1` | 消光藍綠色防滑工作墊與低對比網格 |

素材生成描述記錄：

- 工具板：`Use case: photorealistic-natural; Asset type: seamless square PBR base-color material texture for a school makerspace wall; Primary request: a realistic matte perforated storage wall panel used in a tidy elementary school technology workshop. Subject: warm light-gray powder-coated steel pegboard with evenly spaced small round holes, subtle depth at each hole, fine powder coat grain and restrained wear. The grid is precise and the hole spacing stays constant through all four edges. Scene/backdrop: straight-on flat material scan only, no room or mounted tools. Style: realistic game-ready material, low contrast, square. Lighting: even diffuse indoor light, no directional cast shadows or highlights. Constraints: seamless on all edges; no shelves, tools, hooks, objects, text, logos, readable markings, perspective, vignette, or border.`
- 工作墊：`Use case: photorealistic-natural; Asset type: seamless square PBR material texture for a children's school maker-space workbench mat; Primary request: a believable durable anti-static rubber work surface used for assembling small classroom robots. Scene/backdrop: flat top-down material scan only. Subject: deep muted teal blue-green silicone/rubber mat, very fine low-contrast 10 mm grid marks, tiny realistic surface grain, faint use marks, matte finish; no readable letters or numbers. Style/medium: realistic game-ready base-color texture, square. Composition/framing: straight overhead, even and tileable on all four edges; grid spacing uniform and consistent across seams. Lighting/mood: diffuse neutral indoor light, no directional cast shadows, no glare. Constraints: no objects, tools, circuit diagrams, electronics, text, logos, hands, perspective, vignette, or obvious border. Avoid high-contrast lines and avoid isolated markings that make tiling obvious.`

### 本機驗收與狀態

- `?dev=1` 的「本機場景檢查」可直接進入 zone18；正式路線仍要求先完成 zone12 舞獅迎賓任務。瀏覽器已確認房間、互動 HUD、任務名稱與獨立背景音樂載入；QA 畫質下單次畫面約 57 FPS，只作該裝置的瞬時讀值。
- `tests/makerspace-chapter.cjs` 覆蓋口說關卡、檢查點、GEPT 去重、校園解鎖、大廳資料、場景邊界／互動目標與四張色彩管理圖解牌。
- 本機 GAS 單檔與 schema 產生器加入 zone18 和 614／124 學習總量；這是待審查的本機開發檔，沒有操作正式 Apps Script、GitHub 或 GitHub Pages。部署前仍須由管理者更新正式 GAS，然後才可驗證跨裝置存檔。

## 追加精修：zone20 新港校慶彩繪工坊

這輪依教育部《國民中小學設備基準》第 28 頁的美術設備項目補足可辨認的教室工作流程，並參考永安國小美術教室校園美感案例；水槽與晾架的細節參考教育部高中職藝術工場設備表第 162 頁，僅借用設備形式，不延伸成國小規範或新港國小現況。來源、使用範圍與存取限制詳見 [zone20 交接紀錄](ZONE20_ART_WORKSHOP_HANDOVER.md)。

- 把兩側牆拆為真正的窗洞，補上窗台、金屬窗框、玻璃與既有校園外景貼圖；本機遊戲視角已確認樹蔭景色可穿過窗戶顯示。
- 新增雙槽洗滌台、龍頭與排水管、低位磁磚背板、四層移動晾畫架、四張兒童高度工作凳；調色桌縮窄並後移，以減少入口視線受阻。
- 新增三張 ImageGen 無縫材質：`art-studio-terrazzo-v1.webp`、`art-studio-plaster-v1.webp`、`art-studio-maple-v1.webp`。生成提示全文、原始 PNG 路徑、輸出雜湊與大小列在 zone20 交接紀錄。
- `tests/art-workshop-chapter.cjs` 維持 9 個互動目標與原有「實物線索＋口說」關卡流程，並增加材質色彩空間、8 個窗景面板、雙槽、四層晾架及工作凳檢查。
- 本機瀏覽器檢視窗景與設備，當次 FPS 約 59–67，只代表當時裝置的短暫讀數。正式網站、GitHub 與 Apps Script 本輪未更新。
- 2026-10-24 後續檢查修正了新材質未顯示的載入追蹤問題：工坊專屬紋理改由場景材質管理器登錄，避免複製貼圖失去載入器追蹤；重新載入後可見地坪紋理和接縫，控制台無錯誤或警告。全套測試 322/322、GEPT 詞彙去重檢查通過；細節見 [zone20 交接紀錄](ZONE20_ART_WORKSHOP_HANDOVER.md)。
