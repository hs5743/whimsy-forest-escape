# 📘 3D 第一人稱英語教育密室逃脫開發者手冊 (Developer & Architecture Guide)

> 本手冊整理自《童趣森林魔法書齋逃脫：蒼月之約》（Whimsy Forest 3D Escape）之完整開發實踐。  
> 涵蓋**模組架構、技術形式、核心功能、AI 文生圖材質皮膚管線、觸控手勢避坑指南與 GitHub Pages 自動化部署流程**，旨在為教育遊戲、網頁 3D 及語言學習應用開發者提供標準架構與實戰指引。

---

## 📑 目錄 (Table of Contents)

1. [專案架構與模組劃分 (Module Architecture)](#1-專案架構與模組劃分-module-architecture)
2. [技術選型與形式優勢 (Technical Paradigm)](#2-技術選型與形式優勢-technical-paradigm)
3. [核心功能與口說學習機制 (Core Features & Speech Engine)](#3-核心功能與口說學習機制-core-features--speech-engine)
4. [平板雙模觸控與手勢防誤觸 (Touch Controls & Interaction Calibration)](#4-平板雙模觸控與手勢防誤觸-touch-controls--interaction-calibration)
5. [AI 文生圖材質皮膚管線 (AI Texture Skins Pipeline)](#5-ai-文生圖材質皮膚管線-ai-texture-skins-pipeline)
6. [解謎狀態機與容錯設計 (State Machine & Fault Tolerance)](#6-解謎狀態機與容錯設計-state-machine--fault-tolerance)
7. [GitHub Pages 自動化公開發布 (Deployment Pipeline)](#7-github-pages-自動化公開發布-deployment-pipeline)
8. [未來擴充與複用建議 (Extensibility & Future Work)](#8-未來擴充與複用建議-extensibility--future-work)

---

## 1. 專案架構與模組劃分 (Module Architecture)

本專案採**高度解耦、高內聚**的模組化 JavaScript 架構，完全零大型建構工具負擔，純靜態即可直接執行：

```
whimsy-forest-escape/
├── assets/
│   ├── sounds/
│   │   └── vocab/            # 13 個單字之外師真人發音 WAV 音檔
│   └── textures/             # 吉祥物立繪、窗外全景、AI 生成之高解析度無縫皮膚貼圖
├── audio-manager.js          # Web Audio API 純程序化音效與八音盒 BGM 合成器
├── speech-manager.js         # Web Speech API 語音辨識、關鍵字容錯與語音合成
├── touch-controls.js         # 虛擬搖桿（走位）、滑動環視（視角）與鍵盤滑鼠雙模適配器
├── vocab-data.js             # 國小英語單字資料庫、自然發音、例句、匹配關鍵字與吉祥物配置
├── world-3d.js               # Three.js 3D 渲染場景、道具建造、射線偵測與解謎邏輯
├── style.css                 # 響應式奇幻羊皮紙 UI、觸控按鈕、大字體單字卡與動畫樣式
├── index.html                # 主網頁進入點、HUD 結構與各類互動彈窗
├── DEVELOPER_GUIDE.md        # 本技術架構指南
├── SKILL.md                  # 可被 AI Agent 讀取的標準 Skill 規格書
└── README.md                 # 專案公開說明文件
```

### 模組職責明細表

| 模組檔案 | 核心類別 / 職責 | 關鍵方法與屬性 |
| :--- | :--- | :--- |
| `world-3d.js` | `World3D`：3D 核心 | `initScene()`, `buildAtelierRoom()`, `buildProps()`, `updateRaycast()`, `triggerInteraction()` |
| `speech-manager.js` | `SpeechManager`：口說辨識 | `startListening()`, `evaluatePronunciation()`, `playWordVoice()`, `forcePass()` |
| `touch-controls.js` | `TouchControls`：雙模輸入 | `update()`, `getMoveVector()`, `getLookDelta()`, `consumeInteract()` |
| `audio-manager.js` | `AudioManager`：合成音訊 | `startBgm()`, `stopBgm()`, `toggleBgm()`, `playSfx(type)`, `playMusicBoxNote()` |
| `vocab-data.js` | `VOCAB_DATA`：教學資料庫 | 定義 `word`, `phonics`, `zh`, `category`, `mascot`, `matchKeywords`, `audioFile`, `xp` |

---

## 2. 技術選型與形式優勢 (Technical Paradigm)

### 為什麼選擇 Three.js + Web Speech API 而非傳統遊戲引擎 Web 匯出？

在教育場域（國小課堂、iPad 行動載具推廣、遠距線上練習）中，傳統引擎（如 Godot 4 Web 匯出）常面臨以下瓶頸：

1. **COOP / COEP 標頭限制**：Godot 4 的 Web 匯出預設需要 `SharedArrayBuffer` 與多執行緒支援，必須伺服器設定 `Cross-Origin-Opener-Policy: same-origin` 與 `Cross-Origin-Embedder-Policy: require-corp`，導致無法直接在 GitHub Pages 等免費用戶靜態站點秒開。
2. **麥克風與 Web Speech API 串接困難**：原生 Web 具備現成的 `webkitSpeechRecognition` 與高音質合成引擎，以 JavaScript 原生驅動可零延遲串接，不受 WASM 隔離沙盒限制。
3. **平板載入速度**：以 Three.js（單一壓縮檔 ~600KB）打造的純靜態專案，總體首屏載入時間 < 2 秒，學童無需下載龐大 WASM 檔案，節省校園頻寬。

---

## 3. 核心功能與口說學習機制 (Core Features & Speech Engine)

### 3.1 「真名詠唱」口說通關機制 (True-Name Incantation)
遊戲顛覆傳統「點擊道具即解開」的模式，將解謎核心綁定於英語口說練習：
- 學生靠近燭台：必須唸出 `LIGHT` 才能點亮燭火。
- 翻開漂浮魔導書：必須唸出 `BOOK`，拾取鑰匙必須唸出 `KEY`。
- 調配星象藥水：必須依序詠唱顏色單字 `RED` 與 `BLUE`，喚醒 `STAR` 之石。
- 餵食貓咪寶箱怪：必須先辨識 `CAT`，再用小魚乾詠唱 `FISH` 餵食。
- 開啟遠古大門：必須鑲嵌魔法石並詠唱 `DOOR` 與開門咒語 `OPEN`。
- 步入晨曦花田：沐浴在陽光下詠唱 `SUN` 迎來破關結算。

### 3.2 模糊匹配與自然發音評測 (Fuzzy Matching & Phonics)
學童發音或語音辨識器常有連音誤差，`speech-manager.js` 採用多重關鍵字命中機制：
```javascript
evaluatePronunciation(userTranscript) {
  const cleanInput = userTranscript.replace(/[.,?!]/g, '').toLowerCase().trim();
  const targetWord = this.targetData.word.toLowerCase();
  const matchWords = this.targetData.matchKeywords || [targetWord];

  let isMatch = cleanInput.includes(targetWord);
  if (!isMatch) {
    for (let kw of matchWords) {
      if (cleanInput.includes(kw)) {
        isMatch = true;
        break;
      }
    }
  }
  // 命中時播放向上 major 琶音與動畫，未命中時溫柔提示並允許再次練習
}
```

### 3.3 課堂嘈雜容錯機制 (Teacher Pass)
在 30 人的學校電腦教室或平板課堂中，背景噪音極可能造成語音辨識困難。
- 介面提供隱密且友善的 `[ ✨ 老師驗證通過 (Teacher Pass) ]` 按鈕。
- 老師可親自聽學生口頭朗讀後一鍵確認過關，**徹底杜絕學生因硬體限制而卡關挫折**。

---

## 4. 平板雙模觸控與手勢防誤觸 (Touch Controls & Interaction Calibration)

### 4.1 雙觸控佈局 (Dual-Touch Tablet Interface)
- **左半螢幕（螢幕寬度 45% 以內）**：動態虛擬搖桿。玩家手指在左側任意位置按下，搖桿基座便自動定位於該點，拖曳生成歸一化向量 `(forward, right)`，鬆手即銷毀。
- **右半螢幕（螢幕寬度 55% 以內）**：旋轉環視觸控區。滑動手勢直接換算為攝影機水平偏航角（Yaw）與垂直俯仰角（Pitch）。
- **右下角專屬按鈕**：直徑 72px 大圓型「✋ 互動」按鈕，學童隨時可單手大拇指快速點擊。

### 4.2 避免「滑動旋轉視角被誤判為點擊互動」之關鍵校準
在 3D 第一人稱網頁開發中，若僅依賴 `pointerup` 或 `click` 事件，使用者在螢幕上滑動轉視角、手指抬起時，極易因準心正好掠過物件而**誤觸非預期的事件**。

**最佳解法**：手勢位移距離（Distance）與按壓時長（Elapsed Time）雙重過濾：
```javascript
let pointerDownPos = { x: 0, y: 0 };
let pointerDownTime = 0;

window.addEventListener('pointerdown', (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
  pointerDownTime = Date.now();
});

window.addEventListener('pointerup', (e) => {
  // 排除點擊 UI 與按鈕
  if (e.target.closest('#speechModal') || e.target.closest('#touchControlsLayer')) return;

  const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
  const elapsed = Date.now() - pointerDownTime;

  // 滑動超過 12px 或持續超過 300ms，判定為轉動視角，絕不觸發互動
  if (dist > 12 || elapsed > 300) return;

  // 只有短促輕點 (Tap) 且準心對準物件時才觸發
  if (this.hoveredObject) {
    this.triggerInteraction(this.hoveredObject);
  }
});
```

### 4.3 彈窗開啟時的輸入凍結 (Modal Input Lock)
當單字練習彈窗、說明指南或勝利結算畫面開啟時，必須在主迴圈中強制暫停人物移動與視角轉向，避免學童在練習朗讀時視角飄移或人物走位：
```javascript
if (modal && modal.style.display === 'flex') {
  if (window.touchControls) {
    window.touchControls.consumeInteract();
    window.touchControls.getLookDelta(); // 清空殘留 delta
  }
  return;
}
```

---

## 5. AI 文生圖材質皮膚管線 (AI Texture Skins Pipeline)

為了擺脫低多邊形網頁遊戲常有的「單調平塗塑膠感」，本專案引入 AI 文生圖生成**專屬材質皮膚（Texture Skins）**：

### 5.1 貼圖皮膚規格與提示詞範例

| 皮膚資產名稱 | 提示詞設計要點 (Prompt Pattern) | 貼圖應用方式 |
| :--- | :--- | :--- |
| `tex-stone-wall.jpg` | `"Seamless texture of cozy ancient medieval stone wall, warm cream sandstone ashlar bricks with soft mortar and subtle moss, flat direct view, tileable seamless"` | 3x2 重複平鋪於四周石牆與石拱門 |
| `tex-wood-floor.jpg` | `"Seamless texture of warm polished vintage oak timber wood floor planks, cozy antique golden amber wood grain, flat top-down, tileable seamless"` | 4x4 重複平鋪於地板，提供溫潤漫反射 |
| `tex-wood-desk.jpg` | `"Seamless texture of antique carved mahogany wood tabletop, rich dark amber brown wood grain with subtle carved brass filigree inlay borders, flat top-down"` | 應用於書桌面板、拉門、書架、天花板粗木樑與寶箱怪箱身 |
| `tex-grimoire-book.jpg` | `"Antique fantasy grimoire leather book cover texture, midnight blue aged leather with ornate embossed golden celestial star symbols, crescent moon, brass filigree corners"` | 貼於漂浮魔導書封面封底 |
| `tex-alchemy-slate.jpg` | `"Seamless texture of antique alchemical stone slate tabletop, dark charcoal slate stone etched with glowing golden alchemical transmutation circles and planetary symbols"` | 貼於元素調劑台操作檯面 |

### 5.2 雙開石門 UV 左右分割法 (Texture Splitting for Double Doors)
生成的古代符文浮雕大門貼圖為整張對稱圖像，透過 Three.js 的 `repeat` 與 `offset`，可零成本拆分為左門扇與右門扇：
```javascript
// 左門扇：取貼圖左半部 (0% ~ 50%)
const doorTexLeft = textureLoader.load('assets/textures/ancient-stone-door.jpg');
doorTexLeft.repeat.set(0.5, 1);
doorTexLeft.offset.set(0, 0);

// 右門扇：取貼圖右半部 (50% ~ 100%)
const doorTexRight = textureLoader.load('assets/textures/ancient-stone-door.jpg');
doorTexRight.repeat.set(0.5, 1);
doorTexRight.offset.set(0.5, 0);
```

---

## 6. 解謎狀態機與容錯設計 (State Machine & Fault Tolerance)

在長流程解謎中，若狀態變數（如 `hasFish`）與背包清單（`inventory`）不一致，玩家極易陷入「道具看得到卻被系統判定沒有」的嚴重 Bug。

### 6.1 狀態雙重核驗準則 (Double-Check Principle)
所有涉及背包道具的條件判定，均採用**布林變數 + 背包道具清單**雙重核對：
```javascript
const hasFishInBag = this.gameState.hasFish || 
                     this.gameState.inventory.some(i => i.id === 'FISH');
```

### 6.2 冪等性與中途退出接續 (Idempotent Progression)
學生若在練習單字中途點擊「✕」關閉彈窗，系統必須記錄微進度（Micro-state），下次點擊同一道具時不應重複前置步驟：
- 翻開魔導書後中途關閉 `KEY` 練習：下次點擊魔導書直接進入 `KEY`，不需再念 `BOOK`。
- 與貓咪寶箱怪完成 `CAT` 對話：下次獲得小魚乾後點擊寶箱怪，直接進入 `FISH` 餵食階段。
- 石門鑲嵌雙魔法石後關閉：下次點擊直接頌唱開門咒語 `OPEN`。

---

## 7. GitHub Pages 自動化公開發布 (Deployment Pipeline)

本專案全面使用 GitHub CLI (`gh`) 實現一鍵遠端倉庫建立與公開部署：

```bash
# 1. 初始化 Git 倉庫與主分支
git init
git branch -M main
git add .
git commit -m "feat: complete release with speech recognition, touch controls, and AI textures"

# 2. 建立遠端公開倉庫並推送源碼
gh repo create <your-username>/whimsy-forest-escape --public --source=. --push

# 3. 啟用 GitHub Pages 靜態託管（以 main 分支根目錄為發布來源）
gh api --method POST /repos/<your-username>/whimsy-forest-escape/pages \
  -f "source[branch]=main" \
  -f "source[path]=/"

# 4. 監控部署進度直到成功
gh run list --repo <your-username>/whimsy-forest-escape
```
完成後即可於 `https://<your-username>.github.io/whimsy-forest-escape/` 免費公開訪問，並具備標準 HTTPS 憑證（滿足 iOS/Android 麥克風安全連線規範）。

---

## 8. 未來擴充與複用建議 (Extensibility & Future Work)

1. **更換教材單字庫**：直接編輯 `vocab-data.js`，修改單字、例句、匹配詞與配對音檔，即可直接改造成不同學年（如中年級 300 字、高年級 1200 字）之題庫。
2. **多關卡擴充**：本架構的房間幾何生成於 `buildAtelierRoom()`，可擴充為雙層閣樓、地下鍊金密室或戶外森林迷宮，只需新增 `roomGroup` 並依序觸發傳送點。
3. **學習歷程回傳 (LMS Integration)**：在 `triggerEscapeCelebration()` 通關時，可透過 `fetch()` 將學生的通關時間、答題嘗試次數與 XP 成績傳送回學校後台（如 Google Sheets、Canvas 或自建學習系統）。
