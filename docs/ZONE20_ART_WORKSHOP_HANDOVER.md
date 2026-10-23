# zone20 新港校慶舞獅彩繪工坊交接

**更新日期：2026-10-24**  
**狀態：本機開發版，尚未部署至 GitHub Pages 或正式 GAS**

## 設計依據與範圍

使用者提供的新港國小照片作為校園外觀參考：草地與紅色跑道、灰色教學大樓、彩色窗框、旗桿與松樹；圖書館照片另作室內空間比例和採光參考。校園場景已把大片紅地面改為草地前景與橢圓跑道，並補上旗桿、旗幟、松樹、花台及校舍窗格。這是依照片特徵改編的遊戲場景，不是測繪復刻。

新增的 zone20「新港校慶：舞獅彩繪工坊」是接在 zone12 新港校園迎賓任務後的遊戲支線。教育部的新港國小報導將龍鳳舞獅與鼓樂、團隊合作列為學校特色；新竹縣政府的校慶報導亦提及舞獅表演與學校傳統。因此支線設計成校慶彩繪準備，而非宣稱校內存在這間實體工坊。[教育部報導](https://depart.moe.gov.tw/ED2600/News_Content.aspx?Create=1&n=E491D1720010EE05&s=1FA805842AD079FE)；[新竹縣政府校慶報導](https://www.hsinchu.gov.tw/News_Content.aspx?n=153&s=251221)

房間以挑高窗、工作桌、材料櫃、布料卷、工具盤、黑板、畫架和大型舞獅壁畫呈現展示工坊感。校園草地與壁畫材質是為遊戲生成的素材，不是假冒實地照片：

| 素材 | 位元組 | SHA-256 | 用途 |
|---|---:|---|---|
| `assets/textures/school-lawn-v1.webp` | 644,860 | `CBC11DCC6482E8B79F7BD862930D92B1B3F75B527B1C774DBEC95BE6145B90AA` | 校園草地無縫材質 |
| `assets/textures/school-lion-mural-v1.webp` | 395,764 | `A84613287656B225AEDB1534F69D870C892ED820BEDC81F7D25BEFF3AF657FC2` | 工坊後牆龍鳳舞獅壁畫 |

## 2026-10-23 場景精修追加

本次把 zone20 從陳列式房間改成有明確工作流程的美術教室：先在雙槽洗手台清洗畫具，再把濕作品放到四層活動晾畫架。新增四張兒童高度工作凳；收納櫃門、金屬把手、排水彎管、水龍頭、龍頭旋鈕、晾架網格和腳輪讓設備更接近可使用的家具。入口中央調色桌縮窄並向後移，保留寬通道與入口視線。新設備沒有增加或改動八個口說目標，也沒有改變通關規則。

兩側原本封閉的牆面改為分段牆體，四扇窗各有完整窗洞、窗台、窗框和玻璃；窗外沿用專案既有生成式校園景圖 `assets/textures/library-courtyard-window-v1.png`，從室內可以看到樹蔭、校舍與跑道。它是之前為圖書館／創客工坊生成的景圖，不是新港國小照片，也不是本次重製的新素材。三種新材質則分別負責磨石子地板、暖白灰泥牆與淺楓木桌面。貼圖複製後以 sRGB 色彩空間顯示，避免材質明暗偏色；各場景材質仍使用獨立 repeat 設定。

設計依據是[教育部《國民中小學設備基準》美術科設備表（第 28 頁）](https://icmp-ws.chiayi.gov.tw/Download.ashx?n=6Kit5YKZ5%2B65rqW6L6m5rOVLnBkZ3%3D%3D&u=LzAwMS9VcGxvYWQvNDMzL1JlbEZpbGUvMTIxOTcvNTcwNzAwL%2BioreWCmeWfuua6lui%2BpuazlS5wZGY%3D)，其中列有畫架、畫具、作品展示與美術教學用品；另參考[臺灣校園美感設計實踐計畫的永安國小美術教室案例](https://campusfield.design.org.tw/zh-TW/redesign_case/4)作為兒童美術教室的空間呈現參考。水槽與晾畫設備的形式參考[教育部高中職設備基準的藝術工場設備表（第 162 頁）](https://www.bmsh.tn.edu.tw/uploads/1764146033791p91OGSP3.pdf)；這是高中職規格，只作為工作流程的視覺參考，不代表國小設備規範，也不表示新港國小有此工坊。

| 輸出材質 | 尺寸／大小 | SHA-256 | 功能 | 生成輸出 PNG |
|---|---:|---|---|---|
| `assets/textures/art-studio-terrazzo-v1.webp` | 1254×1254／490,524 bytes | `83A34F7AC5810D905BD18BB514D845D8E3C6E2C3D3ABB771D1B1A32B5244579F` | 淺暖灰磨石子地坪、細小接縫與微磨耗 | `C:\Users\wsyeu\.codex\generated_images\01a120af-6f70-7a13-b71a-6288be677ddf\exec-d098dae2-e620-46a5-889d-f4bcb071fad2.png` |
| `assets/textures/art-studio-plaster-v1.webp` | 1254×1254／338,522 bytes | `BDE20985BE85EC8363C347E45BA3611055ADE561570DC8CA25B3F856327CF276` | 暖白細灰泥，低對比水彩擦痕 | `C:\Users\wsyeu\.codex\generated_images\01a120af-6f70-7a13-b71a-6288be677ddf\exec-e8611952-34aa-4721-892c-8d665720c536.png` |
| `assets/textures/art-studio-maple-v1.webp` | 1254×1254／124,968 bytes | `9B89BFA7F46D5144557A6D8900D78DCDF5D67BC1F1A7A511CE6D22B275E5A554` | 淺楓木桌面，細木紋與輕微使用痕跡 | `C:\Users\wsyeu\.codex\generated_images\01a120af-6f70-7a13-b71a-6288be677ddf\exec-717eeb34-f56e-4121-8111-450ad8126633.png` |

以下是三張材質實際生成時使用的 prompt：

**磨石子地坪**
> Use case: photorealistic-natural. Asset type: seamless square PBR base-color texture for an immersive 3D elementary school art workshop floor. Primary request: create a believable, clean-but-used Taiwanese school art-room floor material, not a photo of a specific school. Scene/backdrop: flat top-down material scan, uniform scale. Subject and materials/textures: pale warm-gray terrazzo or matte ceramic floor tiles with fine natural aggregate, subtle 60-centimeter tile joints, tiny pinholes and gentle mop wear; understated and practical for a classroom where students paint and wash tools. Lighting/mood: diffuse neutral daylight, evenly lit, no directional cast shadows or glossy glare. Composition/framing: square, tileable on all four edges, repeat pattern remains low contrast and believable. Constraints: no perspective, horizon, vignette, border, furniture, objects, paint jars, writing, letters, logos, people, or dramatic cracks.

**牆面灰泥**
> Use case: photorealistic-natural. Asset type: seamless square PBR base-color texture for the walls of a real elementary school art classroom in a 3D game. Primary request: create a tactile warm off-white painted plaster wall with realistic maintenance and use, not a picture of a room. Scene/backdrop: straight-on flat material scan. Subject and materials/textures: soft ivory water-based paint over fine plaster, slight roller grain, delicate unevenness, a few extremely faint cleanable watercolor rub marks and age at lower-wall height; no distinct blotches, no wall trim or objects. Style/medium: restrained real school interior material, matte, finely detailed. Lighting/mood: broad diffuse indoor daylight, uniform exposure, no directional shadows. Composition/framing: square and tileable across all four edges, low-frequency detail suitable for broad wall surfaces. Constraints: no perspective, room, baseboard, window, artwork, furniture, text, symbols, logos, dramatic stains, vignette, or border.

**楓木桌面**
> Use case: photorealistic-natural. Asset type: seamless square PBR base-color texture for child-height worktables in an elementary school art room game. Primary request: a realistic durable pale maple-birch laminated tabletop surface used daily by children for drawing and painting. Scene/backdrop: flat top-down material scan, uniform scale. Subject and materials/textures: fine straight light maple grain, satin matte school-grade laminate, tiny fine scratches and a few almost imperceptible wiped watercolor traces; well maintained, not showroom-perfect, no visible table edge. Lighting/mood: diffuse neutral classroom daylight, even color, no cast shadows or glossy hotspots. Composition/framing: square, tileable on all four edges, subtle grain direction that repeats without obvious seams. Constraints: no objects, paintbrushes, paper, jars, hands, perspective, room, text, letters, logos, large stains, vignette, or border.

## 關卡與學習資料

支線共有八個步驟：`BLACKBOARD, PICTURE, PENCIL, RULER, GLUE, MARKER, ART, ENGLISH`。每一步都必須先碰觸當前正確的場景物件，再通過指定單字的口說辨識；碰錯物件、提前口說、錯字或過期的語音回呼都不會推進。通關後由工作室出口返回 zone12；入口只在新港迎賓任務完成後開放。

這八個詞都屬使用者提供的 GEPT Kids 詞表，並未與 zone11–zone19 的章節核心詞重複。它們原先已存在於學習大廳的完整 GEPT 字庫，所以詞項總數維持 622；本支線新增 8 張情境句卡和「校園美術與舞獅創作」主題。總量為 **622 個詞項、140 張句型卡、15 個主題**，其中 618 個為 GEPT Kids 詞彙，另 4 個是有清楚標示的創客延伸詞。

`realm-presentation.js` 為新支線加入獨立星圖座標和「彩繪工坊支線」鎖定標籤；`adventure-assist.js` 會依當前步驟指向實際工具。局部與遠端 GAS schema 產生器已列入 zone20，執行 `npm run build:gas` 後更新本機 `gas/` 與 `gas-release/` 檔案。這只是待審查的本機後台更新，正式 GAS 仍須由管理者貼上並重新部署。

## 驗證

- `tests/art-workshop-chapter.cjs` 檢查 GEPT 字表範圍、前章核心詞去重、實物與口說門檻、存檔還原、支線解鎖、地圖節點、提示目標、語音回呼與學習大廳句卡。
- `tests/school-chapter.cjs` 檢查新草地與跑道貼圖、有限場景幾何，以及校園互動目標與工坊入口。
- 場景材質由 `SpatialZoneManager.getTexture(url, variant)` 建立並登錄給素材載入器；若直接複製 `Texture`，載入器不會追蹤複本，瀏覽器便會顯示預設色而非新材質。工坊地坪、牆面、桌面目前各用獨立的登錄變體與重複比例。
- 工坊桌面展示卡移至入口側邊，出生點改為南側 `[0, 1.6, 10.2]` 並朝北，避免入場正對出口或讓近景工作桌遮住舞獅壁畫。
- 2026-10-24 本機瀏覽器重新載入確認磨石子地板紋理和接縫、牆面灰泥、窗外樹蔭景圖及舞獅壁畫正常顯示；轉向可見雙槽水槽、櫃體與龍頭，瀏覽器錯誤／警告為 0。最新本機預覽使用 `http://127.0.0.1:8774/?dev=1&realism=4`。該網址只在開發環境有效。
- `npm test`：322/322 通過（2026-10-24）；`node scripts/check-vocabulary.cjs` 確認 zone11–zone20 核心字無重複且都在參考字表範圍。
- 麥克風辨識、手機畫面與低效能裝置效能仍需實機試玩；正式網站與 GAS 尚未更新。
