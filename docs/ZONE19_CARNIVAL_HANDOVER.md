# zone19 魔法數字嘉年華交接

版本：2.8.0 本機開發版。更新日期：2026-10-23。此紀錄對應同一工作樹內的場景、字彙、地圖路線、後台 schema 及測試；尚未發布到 GitHub Pages 或正式 Apps Script。

## 設計與遊戲流程

嘉年華是舊世界冒險星圖中由陽光微風市集延伸的支線。完成市集採買任務並符合等級條件後，從地圖選擇支線；場景出口會返回市集。場景已改成藍調時刻的開放式校園園遊會：石板步道、低矮開放圍欄、三面分布的獨立帆布遊戲攤、手縫彩旗、適量串燈與中央星輪。南側入口不再被攤位背板阻擋，玩家可直接看到中央廣場和北側三座攤位。

七個攤位分別放置 13–19 枚可實際點數的立體星籌，最後一站托盤圖樣放置 20 枚。場景不以數字招牌洩漏答案。每站必須先選正確數量、再通過當次口說辨識才會前進；重複或過期回呼不能重複完成。區域星圖新增市集支線節點，避免新場景成為脫離舊世界的獨立入口。

新增 GEPT Kids 核心詞 `THIRTEEN, FOURTEEN, FIFTEEN, SIXTEEN, SEVENTEEN, EIGHTEEN, NINETEEN, TWENTY`，並逐詞核對參考字表及既有關卡核心字，沒有重複。嘉年華支線新增 8 張情境句卡及 `number-carnival` 主題；連同後續創客工坊內容，目前完整學習大廳總量為 622 個詞項（618 個 GEPT 詞及 4 個明確標示的創客延伸詞）、140 張句型卡與 15 個主題。

## 素材來源與校驗值

下表的 v1 材質是前一版素材，仍留在專案中作為回溯；新版場景載入 v2 地面、帆布與攤位木材。生成 PNG 原檔保存在本機 Codex 生成目錄；遊戲套件只使用優化後的 WebP。

### 目前場景素材（v2）

| 專案資產 | 尺寸 | 位元組 | SHA-256 | 材質方向 |
|---|---:|---:|---|---|
| [carnival-floor-v2.webp](../assets/textures/carnival-floor-v2.webp) | 1254×1254 | 632,954 | `0AB6F9E10A6A87F8A329BF7F835ADDDD5B7523D42015F52996C7849D65743048` | 戶外園遊會廣場的灰褐色石材鋪面 |
| [carnival-canopy-v2.webp](../assets/textures/carnival-canopy-v2.webp) | 1254×1254 | 642,052 | `475DC7A499AE45FB034AC3FAB39B16FEABEEE88D86D515C7E579D9EA950F3168` | 象牙白、褪色藍紅條紋的織布帳篷 |
| [carnival-booth-v2.webp](../assets/textures/carnival-booth-v2.webp) | 1254×1254 | 326,748 | `68FBBBD5013839D99298C4C80851AF8386B3CA6BD2BABA1FD672FAB1CFA2DACC` | 深色直向木板、低彩度攤位木作 |

三張 v2 材質均由本機生成式素材流程製作，並轉為 RGB WebP（quality 86、method 6）；原始 PNG 位於使用者本機 Codex 生成素材資料夾，未放入遊戲套件。生成方向分別為平視正上方、均勻漫射光的戶外石板；可重複使用的象牙白織布與低彩度褪色條紋；以及有細緻木紋和輕微使用痕跡的深色木板。這些文字是提示方向摘要，不是逐字保留的生成 prompt，也不是實地掃描材質。

### 前版素材（v1，現未由場景載入）

| 專案資產 | 位元組 | SHA-256 | 本機 PNG 原檔 |
|---|---:|---|---|
| [carnival-floor-v1.webp](../assets/textures/carnival-floor-v1.webp) | 605,246 | `1B6A5CC5B2923B1FC7EFAB6F96FE4E0309B53BE751844725CF25741CA181251A` | `C:\Users\wsyeu\.codex\generated_images\01a120af-6f70-7a13-b71a-6288be677ddf\exec-2372592a-3c05-4c39-bdef-336b30b8b212.png` |
| [carnival-canopy-v1.webp](../assets/textures/carnival-canopy-v1.webp) | 745,098 | `78BF4FC281D6F0EAFEA7A71302196A6CC9E737724624AECD7283FF3551861749` | `C:\Users\wsyeu\.codex\generated_images\01a120af-6f70-7a13-b71a-6288be677ddf\exec-81000269-cebc-4310-9814-9030e270c5bc.png` |
| [carnival-booth-v1.webp](../assets/textures/carnival-booth-v1.webp) | 466,058 | `3F878682AA10437F6760550EF8F23ABBF22AEA6BF087828F70E966BD8E6A0889` | `C:\Users\wsyeu\.codex\generated_images\01a120af-6f70-7a13-b71a-6288be677ddf\exec-65cac55b-dfdb-47e8-9159-66a41232a280.png` |
| [carnival-star-tray-v1.webp](../assets/textures/carnival-star-tray-v1.webp) | 365,704 | `E6BB7AD107253C23A66585347660FB85D41B431C90A65A5F98E97FACFE6C9F8E` | `C:\Users\wsyeu\.codex\generated_images\01a120af-6f70-7a13-b71a-6288be677ddf\exec-74eb60a1-8a21-4aec-9e93-3a70b4ac43cc.png` |

下列是 v1 素材歷史提示詞，供回溯，不代表目前畫面所用材質：

**Floor:** `Use case: seamless material texture for a high-quality 3D children's adventure game environment. Asset type: physically based seamless square floor albedo texture. Primary request: a richly detailed indoor magical number carnival floor made of deep peacock-teal painted timber planks with understated brass compass-star inlays and tiny worn gold flecks, real wood grain, fine scuffs, soft warm practical-light reflections. Palette: deep teal, muted indigo, aged warm brass, restrained coral accents. Composition: perfectly top-down texture, uniform scale, edge-to-edge tileable, no perspective, no shadows cast by objects, no scene, no text, no symbols shaped like letters or digits, no logos, no borders. Style: believable premium game material, subtle and tactile, not cartoon illustration. Output: square 1024x1024 texture.`

**Canopy:** `Use case: seamless material texture for a polished 3D children's adventure game carnival environment. Asset type: tileable square woven canopy textile albedo texture. Primary request: finely woven heavy festival canvas, alternating midnight indigo and peacock teal stripes with thin warm ivory and muted coral threads, slight natural fabric irregularity, exquisite thread detail and gently faded dye. Composition: perfectly flat close-up material, uniform scale, seamlessly repeatable on all four edges, no perspective, no folds, no scene, no props, no readable text, no numbers, no logos, no border. Style: realistic handcrafted material that feels tactile and premium, restrained color saturation. Output: square 1024x1024 texture.`

**Booth:** `Use case: seamless material texture for a 3D environment in a premium children's fantasy adventure game. Asset type: square tileable painted wood panel albedo texture. Primary request: hand-finished dark walnut carnival booth wood, broad vertical boards with fine grain, deep teal and warm coral painted edge motifs, small worn brass pin details, tasteful age and realistic matte varnish. Composition: front-facing flat material close-up, even texture scale, tileable on all edges, no perspective, no furniture or scene, no text, no letters, no numerals, no logo, no border. Style: believable high-quality real wood material with subtle craft details, not a flat graphic. Output: square 1024x1024 texture.`

**Star tray:** `Use case: a project-bound transparent visual prop texture for a premium 3D children's learning adventure game. Asset type: one isolated overhead three-quarter view still-life of a small shallow carved walnut counting tray holding exactly twenty polished brass and blue enamel star tokens in tidy rows, every star fully visible, child-safe rounded edges, physically realistic contact shadows on the tray, exquisitely detailed wood grain and enamel, warm studio light. Composition: centered object filling most of canvas, camera slightly above and in front, isolated on a fully transparent background, clean silhouette, no hands, no people, no text, no letters, no numerals, no labels, no logos, no extra objects. Style: premium tactile game prop, believable materials, crisp focus, restrained jewel colors. Preserve alpha transparency. Output: square 1024x1024 RGBA PNG.`

## 驗證與限制

`tests/carnival-chapter.cjs` 檢查字表範圍與去重、進度檢核、選數量及口說門檻、支線解鎖、地圖節點、場景邊界、碰撞、四張材質與互動數。`npm run build:gas` 產生的 GAS 檔僅為本機待審查更新，不代表正式服務已支援 zone19。真實麥克風、不同裝置畫面與效能仍需實機驗收。

## 追加精修：開放式園遊會與入口構圖

本輪依真實園遊會／夜市的攤位分區與人流通道概念，重新安排場景動線；設計只借用空間組織線索，不複製任何一個市集場址或照片。參考[臺中市觀光旅遊局大坑九號夜市圖集](https://travel.taichung.gov.tw/en/multimedia/album/14965)及[臺北市政府饒河街觀光夜市介紹](https://english.gov.taipei/News_Content.aspx?n=460F7826293CF0BA&s=B5AA9E1F8B583A2F&sms=07D68BC61ECBFF67)。

- 將過大的連續棚頂拆成七座各自有支柱、織布頂、木櫃檯與彩旗的獨立攤位，中央天空保持開放；入口面朝星輪與北側攤位，兩側攤位留出中央步道。
- 調整為藍調時刻的戶外廣場，加入遠處樹線、低矮邊界、適量暖色串燈與不同顏色的布面；降低重複棚架造成的封閉感。
- 13–19 的七組可數物件使用立體浮雕星籌，最後一站以二十枚托盤圖示作結。保留九個互動目標、選數量後口說過關、支線出口及原有單字，不改變解謎步驟。
- 瀏覽器 `?dev=1` 預覽在 zone19 實際確認開放天空、石材廣場、分散攤位和清楚入口；瀏覽器 console error/warn 為空。單一桌面裝置畫面約 69 FPS，僅是瞬間讀值，不能當作低階設備效能保證。
- `tests/carnival-chapter.cjs` 對七座獨立攤位、入口可行走／視線、有限幾何、九個唯一互動目標及口說防重複流程的檢查全數通過；本輪全套測試 **322/322 通過**。
- 專案中新增的 PNG 與重複 WebP 轉檔中間檔只供本次工作流程使用；runtime 僅讀取上表三張 v2 WebP 及既有 `carnival-star-tray-v1.webp`。
- 變更仍只在本機工作樹；未修改 GitHub、GitHub Pages 或正式 Apps Script。正式部署及麥克風、手機驗收尚未進行。
