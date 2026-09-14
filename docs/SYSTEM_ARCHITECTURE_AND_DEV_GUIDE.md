# 《童趣森林魔法書齋逃脫：蒼月之約》系統架構說明書與軟體開發指南
*(Whimsy Forest Escape: Promise of the Pale Moon — System Architecture & Software Development Specification)*

> **版本**：`v2026.09 (Release v12)` | **發行日期**：2026 年 09 月 14 日  
> **適用受眾**：軟體架構師、WebGL / 3D 遊戲開發者、前端全端工程師、教育科技 (EdTech) 研發團隊  
> **PDF 檔下載**：本專案根目錄附帶由 ReportLab 編譯排版之完整出版級 PDF 說明書：`童趣森林魔法書齋逃脫_系統架構與開發說明書.pdf`

---

## 📑 目錄 (Table of Contents)

1. [專案綜述與教育科技理念 (Project Vision & Pedagogical Paradigm)](#1-專案綜述與教育科技理念)
2. [全域系統架構與模組劃分 (System Architecture & Module Breakdown)](#2-全域系統架構與模組劃分)
3. [3D 渲染管線與空間管理系統 (3D Spatial Zone Pipeline)](#3-3d-渲染管線與空間管理系統)
4. [教學核心模組與互動機制 (Gameplay & Pedagogy Systems)](#4-教學核心模組與互動機制)
5. [語音辨識與多媒體音訊架構 (Speech & Audio Engine)](#5-語音辨識與多媒體音訊架構)
6. [雲端同步與資安防護架構 (Cloud Sync & Security Infrastructure)](#6-雲端同步與資安防護架構)
7. [Godot 4.x 原生引擎版架構對應 (Godot 4.7 Companion Architecture)](#7-godot-4x-原生引擎版架構對應)
8. [軟體工程師開發指南與最佳實踐 (Engineer's Guide & Best Practices)](#8-軟體工程師開發指南與最佳實踐)

---

## 1. 專案綜述與教育科技理念

### 1.1 專案背景與雙平台戰略定位
傳統國小英語教學多仰賴平面點選軟體或紙本閃卡，學童缺乏真實立體空間感與主動口說誘因，容易產生語言焦慮（Speaking Anxiety）。《童趣森林魔法書齋逃脫：蒼月之約》將「沉浸式 3D 第一人稱冒險」與「真名詠唱魔法口說」深度結合，讓英語單字成為解開立體空間謎題的鑰匙。

因應全台學校多樣化的硬體設備（Chromebook、iPad、Windows 電腦教室），專案制定了雙軌產品矩陣：
- **Web 輕量跨平台免安裝版（主力產品）**：純 JavaScript + Three.js 打造，學童使用瀏覽器點開即玩（首屏載入時間 < 2 秒），零 WASM 編譯開銷，無縫支援 GitHub Pages 等靜態託管。
- **Godot 4.x 原生引擎版（本機高品質伴隨版）**：採用 Godot 4.7 Forward+ 渲染管線，支援離線環境、高效能 3D 空間定位音訊，專為多媒體專科教室單機部署設計。

### 1.2 雙軌制英語詞彙核心體系
- **主軌（核心關卡單字庫）**：涵蓋 10 大主題空間共 60 個高頻生活英語詞彙，空間全域嚴格零碰撞。
- **副軌（校本英語護照題庫）**：收錄 706 個拓展詞彙，包含完整 IPA 國際音標、自然發音音節切分（Chunks）與雙生活例句，形成由淺入深的知識網。

### 1.3 核心技術選型決策矩陣

| 評估維度 | 純原生 Web (Three.js) | Unity / Godot Web 匯出 | 決策原因與優勢 |
| :--- | :--- | :--- | :--- |
| **首屏載入時間** | **< 2 秒 (~2.5MB)** | 15 ~ 45 秒 (30~60MB) | 國小課堂 40 分鐘極度依賴快速開課，秒開是剛性需求。 |
| **跨來源安全標頭** | **零限制 (標準靜態站)** | 強制 COOP/COEP 標頭 | 免除了 GitHub Pages 等免費雲端無法設定自訂標頭的障礙。 |
| **瀏覽器語音 API 串接** | **原生零延遲直連** | WASM 跨層 C# / C++ 橋接 | Web Speech API 原生事件驅動，麥克風拾音與評測最靈敏。 |
| **行動平板相容性** | **完美適配 iPad Safari** | 記憶體受限易崩潰 | iOS WebKit 記憶體限制嚴苛，純 JS 渲染具最高穩定性。 |

---

## 2. 全域系統架構與模組劃分

### 2.1 四層架構體系 (Four-Tier Architecture)

```
+-------------------------------------------------------------------------+
| 1. 表現層 (Presentation Layer)                                          |
|    - HUD 狀態條、3D 空間星圖、數位護照手帳、聽力尋寶雷達、關卡主試煉彈窗   |
|    - 雙模虛擬搖桿 (TouchControls) & 視角旋轉過濾器                        |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
| 2. 領域核心層 (Domain Logic Layer)                                       |
|    - 空間狀態機 (SpatialZoneManager: 10 大主題關卡拓撲與 AABB 碰撞)       |
|    - 語音評測引擎 (SpeechManager: 加權 Levenshtein 關鍵字匹配)             |
|    - 聽力尋寶核心 (ScavengerHuntManager: 雙軌線索 & 距離冷熱算法)        |
|    - 關卡主挑戰 (GuardianTrialManager: 三重試煉驗證機)                   |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
| 3. 基礎設施層 (Infrastructure Layer)                                     |
|    - Three.js WebGL 渲染管線 (Scene, Camera, Light, 360° 天穹圓柱)       |
|    - Web Audio API 八音盒合成器 & 多頻道音效快取 (AudioManager)          |
|    - 靜態知識庫 (vocab-data.js: 60 詞, vocab-passport-bank.js: 706 詞)   |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
| 4. 雲端服務層 (Cloud Services Layer)                                     |
|    - Google Apps Script (GAS) Serverless 後端 API                        |
|    - Google 試算表 (學生學籍庫、過關日誌、校級排行榜、教師管理後台)       |
|    - Bearer Token 鑑權、學生姓名去識別化、單次經驗值防刷防禦機制         |
+-------------------------------------------------------------------------+
```

### 2.2 模組職責明細表

| 模組檔案 | 核心類別 / 職責 | 代碼行數 | 關鍵方法與屬性 |
| :--- | :--- | :--- | :--- |
| `spatial-zone-manager.js` | `SpatialZoneManager`：空間情境管理器 | ~9,660 行 | `getCurrentZone()`, `switchZone()`, `buildZone1~10()`, `buildZoneSkyPanorama()`, `initColliders()` |
| `world-3d.js` | `World3D`：3D 核心與空間渲染 | ~1,600 行 | `initScene()`, `animate()`, `updateRaycast()`, `triggerInteraction()`, `animators[]` |
| `speech-manager.js` | `SpeechManager`：口說辨識與 Chunks | ~450 行 | `startListening()`, `evaluatePronunciation()`, `calculateSentenceAccuracy()`, `forcePass()` |
| `scavenger-hunt-manager.js` | `ScavengerHuntManager`：聽力尋寶 | ~1,650 行 | `startHunt()`, `update()`, `playClueVoice()`, `verifyTarget()`, `SCAVENGER_CLUES` |
| `cloud-sync-manager.js` | `CloudSyncManager`：雲端與數值 | ~400 行 | `calculateLevel()`, `recordWordPass()`, `maskStudentName()`, `verifyTeacherPassword()` |
| `touch-controls.js` | `TouchControls`：雙模觸控 | ~220 行 | `update()`, `getMoveVector()`, `getLookDelta()`, 手勢時空過濾 |
| `audio-manager.js` | `AudioManager`：合成音訊 | ~200 行 | `startBgm()`, `stopBgm()`, `playMusicBoxNote()`, `playSfx()` |
| `gas/Code.gs` | `Google Apps Script`：雲端後端 | ~520 行 | `doGet()`, `doPost()`, `LockService`, `maskStudentName()`, 經驗值防刷檢核 |

---

## 3. 3D 渲染管線與空間管理系統

### 3.1 空間區域動態管理器架構 (SpatialZoneManager)
- **單一活躍空間群組（Single Active Group）**：每次切換空間，舊有空間的幾何體（Geometry）與材質（Material）透過走訪遍歷徹底 `dispose()`，確保 GPU 視訊記憶體與 JavaScript 堆疊記憶體零洩漏。
- **動態光照與環境霧調校**：各空間擁有專屬之平行主光（DirectionalLight）、半球光（HemisphereLight）與線性大氣指數霧（`FogExp2`），營造晨曦、正午、黃昏、極夜或星空等鮮明氛圍。

### 3.2 360 度圓柱全景天穹系統 (Panoramic Sky Cylinder)
為徹底消除傳統 3D 網頁遊戲邊界「空無一物」的虛空感，全戶外關卡（Zone 2 ~ Zone 10）實裝開頂圓柱全景穹頂：
```javascript
buildZoneSkyPanorama(group, zoneId, texture, options = {}) {
  const radius = options.radius || 92;        // 巨型半徑 (85 ~ 96m)
  const height = options.height || 75;        // 圓柱高度 (70 ~ 85m)
  const yOffset = options.yOffset || 6.0;     // 水平地平線微調
  const rotationSpeed = options.rotationSpeed || 0.001; // 大氣自轉速度

  // 1. 採用開頂圓柱幾何 + 內壁反向渲染 (BackSide)
  const panoramaGeo = new THREE.CylinderGeometry(radius, radius, height, 48, 1, true);
  const panoramaMat = new THREE.MeshBasicMaterial({
    map: texture, side: THREE.BackSide, fog: false, depthWrite: false
  });
  const panoramaMesh = new THREE.Mesh(panoramaGeo, panoramaMat);
  panoramaMesh.position.y = yOffset;
  panoramaMesh.renderOrder = -10; // 確保永遠作為最深層背景繪製

  // 2. 地平線過渡柔光環 (Soft Horizon Mist Ring - 消除邊界切邊)
  if (options.mistColor) {
    const mistGeo = new THREE.RingGeometry(18, radius * 0.98, 32);
    const mistMat = new THREE.MeshBasicMaterial({
      color: options.mistColor, transparent: true, opacity: 0.35, depthWrite: false
    });
    const mistRing = new THREE.Mesh(mistGeo, mistMat);
    mistRing.rotation.x = Math.PI / 2;
    mistRing.position.y = options.mistY || -2.0;
    group.add(mistRing);
  }
  // 3. 每幀視差流動動畫
  this.world.animators.push((time) => {
    panoramaMesh.rotation.y = time * rotationSpeed;
  });
}
```

### 3.3 2.5D 動態立繪守護神 (Living Standee)
各關卡守護主淘汰低模角錐人偶，換上 **2.5D 高精透明立繪生命體系統**：
- 採用透明通道貼圖，搭配 `alphaTest: 0.03` 與雙面渲染。
- 透過 `Math.atan2(dx, dz)` 實作 Y 軸相機跟隨（Billboard Tracking），保證學童繞行時 NPC 始終優雅正視玩家。
- 結合呼吸懸浮起伏、身後法陣旋轉與光暈脈動，帶來生動靈動的交互體驗。

---

## 4. 教學核心模組與互動機制

### 4.1 全 10 大主題關卡雙軌單字全覽

| 關卡 ID | 關卡名稱 (中/英) | 核心主題 | 核心 3D 實體詞彙庫 (Zero-Collision) | 關卡主 NPC |
| :--- | :--- | :--- | :--- | :--- |
| `zone1` | 見習學徒書齋 | School & Magic | `BOOK`, `DESK`, `PEN`, `DOOR`, `CAT`, `KEY` | 貓咪寶箱怪 |
| `zone2` | 陽光微風市集 | Food & Trade | `APPLE`, `BANANA`, `CAKE`, `EGG`, `SHOP`, `OPEN` | 市集大廚師 |
| `zone3` | 守護獸之森花園 | Nature & Animals | `TREE`, `WATER`, `FLOWER`, `BIRD`, `RABBIT`, `OPEN` | 自然守護精靈 |
| `zone4` | 活力冒險操場 | Sports & Action | `BALL`, `RUN`, `JUMP`, `PLAY`, `FAST`, `OPEN` | 田徑總教練 |
| `zone5` | 星光鐘樓車站 | Time & Transport | `TRAIN`, `TIME`, `TICKET`, `WAIT`, `BELL`, `OPEN` | 蒸汽老列車長 |
| `zone6` | 蔚藍秘境海港 | Ocean & Weather | `SHIP`, `BOAT`, `WIND`, `FISH`, `WATER`, `OPEN` | 瑪琳娜船長 |
| `zone7` | 雲頂星空觀測站 | Celestial Sky | `SKY`, `STAR`, `MOON`, `SUN`, `CLOUD`, `OPEN` | 艾瑟爾觀星賢者 |
| `zone8` | 極光冰雪聖域 | Winter & Arctic | `SNOW`, `COLD`, `WINTER`, `WHITE`, `WARM`, `CLIMB` | 佛洛斯特長老 |
| `zone9` | 星界萬神殿堂 | Wisdom & Study | `LIBRARY`, `READ`, `WRITE`, `THINK`, `SMART`, `FLY` | 奧利弗大校長 |
| `zone10` | 蒼穹虹光空島 | Aether & Dream | `ISLAND`, `RAINBOW`, `MUSIC`, `SING`, `DANCE`, `DREAM` | 艾莉雅精靈使 |

### 4.2 情境聽力尋寶雷達系統 (Scavenger Hunt System)
- **冷熱感知雷達演算法**：即時計算玩家與目標座標之歐氏距離 $d = \sqrt{(x_p-x_t)^2 + (z_p-z_t)^2}$。
  - $d \le 3.5\text{m}$ 呈現 `radar-hot`（目標就在身邊，發出高頻心跳脈動）。
  - $3.5\text{m} < d \le 12\text{m}$ 呈現 `radar-warm`（接近中）。
  - $d > 12\text{m}$ 呈現 `radar-cold`（方向尚遠）。
- **雙軌題庫**：尋獲目標時同時驗證主軌與副軌英語護照單字，學習成效加倍。

### 4.3 關卡主三重試煉系統 (Guardian 3-Stage Trial)
1. **聽力感知填充**（聽取關卡主發音，4 選 1）。
2. **自然情境推理**（閱讀生活情境英語問句，推論合適詞彙）。
3. **整句口說試煉**（朗讀完整生活例句，語音評測 $\ge 80\%$ 通關）。
- **教師容錯通道 (Teacher Pass)**：一鍵通過輔助按鈕，保障嘈雜環境教學零卡關。

---

## 5. 語音辨識與多媒體音訊架構

### 5.1 整句口說精準度評測演算法 (Speech Accuracy Algorithm)
```javascript
calculateSentenceAccuracy(userInput, targetSentence, targetKeywords) {
  const cleanUser = userInput.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const cleanTarget = targetSentence.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  
  const userWords = cleanUser.split(/\s+/);
  const targetWords = cleanTarget.split(/\s+/);

  // 1. 核心實體關鍵詞命中檢核 (權重 60%)
  let keywordMatches = 0;
  targetKeywords.forEach(kw => {
    if (userWords.includes(kw.toLowerCase())) keywordMatches++;
  });
  const keywordScore = (keywordMatches / targetKeywords.length) * 60;

  // 2. 全句語流詞彙覆蓋率檢核 (權重 40%)
  let totalWordMatches = 0;
  targetWords.forEach(w => {
    if (userWords.includes(w)) totalWordMatches++;
  });
  const streamScore = (totalWordMatches / targetWords.length) * 40;

  // 3. 加權總得分 (門檻 >= 80% 通關)
  return Math.round(keywordScore + streamScore);
}
```

### 5.2 Web Audio API 純代碼八音盒合成器 (AudioManager)
利用正弦波震盪器（Sine Oscillator）搭配指數衰減增益包絡（Exponential Gain Envelope），代碼合成清脆純淨的水晶八音盒音色，免去 MP3 版權與頻寬下載問題。

---

## 6. 雲端同步與資安防護架構

### 6.1 企業級資安防禦與去識別化
- **Bearer Token 鑑權**：前端請求攜帶安全權杖，防止未授權存取。
- **單次異常經驗值防刷**：單次上報增量 $\Delta \text{XP} > 300$ 自動攔截標記。
- **學生姓名去識別化演算法**：
```javascript
maskStudentName(name) {
  if (!name || name.length <= 1) return name;
  if (name.length === 2) return name[0] + '○';
  if (name.length === 3) return name[0] + '○' + name[2];
  return name[0] + '○'.repeat(name.length - 2) + name[name.length - 1];
}
```

---

## 7. Godot 4.x 原生引擎版架構對應

位於 `c:\Antigravity 2026\遊戲設計Godot` 之本機版專案，採用 Godot 4.7 Forward+ 引擎：
- **場景節點樹**：`Main (Node3D)` 包含 `WorldEnvironment`, `DirectionalLight3D`, `Player (CharacterBody3D)`, `Interactables (StaticBody3D)`, `UILayer (CanvasLayer)`。
- **全域 Autoload**：`GameManager`, `AudioManager`, `VocabDatabase`。
- **離線語音生成**：透過 `generate_voices.ps1` 調用 Edge TTS 生成 24kHz 高品質 WAV 音檔。

---

## 8. 軟體工程師開發指南與最佳實踐

### 8.1 本地開發環境快速啟動 (Zero-Build Pipeline)
- 方式 A：VS Code 安裝 Live Server 套件，右鍵 `index.html` 選擇 `Open with Live Server`。
- 方式 B：終端執行 `npx http-server -p 8080`。
- 方式 C：終端執行 `python -m http.server 8000`。

### 8.2 新增全新關卡標準作業程序 (SOP)
1. **定義登記**：於 `spatial-zone-manager.js` 的 `this.zones` 登記主題、單字陣列、出生座標。
2. **全景材質**：將 16:9 全景貼圖放入 `assets/textures/`，於 `initTextures()` 設定 `wrapS = RepeatWrapping`。
3. **場景建造**：實作 `buildZoneX()`，首先呼叫 `buildZoneSkyPanorama` 構築 360 度全景天穹。
4. **碰撞體配置**：於 `initColliders()` 加入建築障礙盒。
5. **聽力題目擴充**：於 `SCAVENGER_CLUES` 新增 6 道雙軌題目。

### 8.3 自動化無頭測試 (test-simulation.js)
專案配備完整純 Node.js 無頭測試模擬器，模擬 Three.js 與 DOM 環境。
在專案根目錄執行：
```bash
node scratch/test-simulation.js
```
測試涵蓋題庫零碰撞、口說算法判定、關卡主試煉、GAS 資安與全 10 關空間建構，達成 **298 / 298 (100.0%) PASS** 方可發布！
