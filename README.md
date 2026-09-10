# 🌲 童趣森林魔法書齋逃脫：蒼月之約 (Whimsy Forest 3D Escape)

> 一款結合國小英語單字學習、學生即時口說辨識、支援平板觸控與桌機操作的 3D 第一人稱密室逃脫冒險網頁遊戲。  
> 整體風格致敬《童趣森林英語》與《葬送的芙莉蓮》的溫馨恬淡奇幻世界觀。

👉 **線上直接遊玩網址**：[https://hs5743.github.io/whimsy-forest-escape/](https://hs5743.github.io/whimsy-forest-escape/)  
🌿 **童趣森林英語首頁**：[https://hs5743.github.io/Whimsy_Forest_English/](https://hs5743.github.io/Whimsy_Forest_English/)

---

## 🌟 核心特色 (Key Features)

1. **🎙️ 學生口說實戰辨識與 Chunks 音節拆解（Speech Recognition & Interactive Drill-down）**
   - 整合 Web Speech API（`webkitSpeechRecognition`），學生必須大聲唸出英語單字才能啟動魔法陣與解鎖機關。
   - 口說彈窗內嵌「音節拆解按鈕（Chunks Buttons）」，學童可點擊單獨音節聆聽自然發音，輕鬆征服多音節單字。
   - 內建 13 組外師真人發音與 Web Speech 語音合成雙軌備援，隨時可點擊「🔊 聽示範發音」。
   - 貼心設計「✨ 老師驗證通過（Teacher Pass）」按鈕，面對教室嘈雜環境或個別無麥克風設備時皆能順暢體驗。

2. **🗺️ 五大多元生活情境空間與空間星圖（Spatial Bounded Zones & Overworld Map）**
   - 突破傳統狹隘單一密室限制！以「邊界圍欄 + 互動點 + 出口閘門」建構五大多元學習空間：
     - **🏰 Zone 1: 見習學徒書齋** (School & Prepositions)
     - **🍎 Zone 2: 陽光微風市集** (Food, Numbers & Adjectives)
     - **🐰 Zone 3: 守護獸之森花園** (Animals, Nature & Actions)
     - **⚽ Zone 4: 活力冒險操場** (Sports, Actions & Body)
     - **🚂 Zone 5: 星光鐘樓車站** (Time, Places & Transport)
   - 隨時開啟「🗺️ 空間星圖」，以等級解鎖並自由傳送跨空間學習！

3. **📘 校本 706 單字英語護照與數位手帳（School Passport & Digital Flip-Book）**
   - 完整整合新港國小 706 個英語單字題庫、國際音標 IPA、音節拆解 Chunks 與情境雙例句。
   - 遊戲內建雙頁復古羊皮紙「數位魔法冒險護照」，包含個人學籍證、12 主題分類篩選與動態蓋上的 3x3 魔法簽證印章。

4. **📱 跨平台與平板觸控最佳化（Tablet & Mobile Friendly）**
   - 支援 iPad、Chromebook、Android 平板與電腦瀏覽器。
   - **平板/手機觸控**：左下角動態虛擬搖桿（走位）、右半螢幕滑動（旋轉環顧視角）、右下角「✋ 互動」大圓鈕。
   - **桌機操作**：標準 `W` `A` `S` `D` 移動，滑鼠按住拖曳環視，`E` 鍵互動。

5. **🎒 學生英語護照、RPG 平滑升級與 Google 試算表雲端同步 (Google Apps Script)**
   - 內建學童身分登入機制（年級 ➔ 班級 ➔ 座號 ➔ 姓名），無密碼負擔。
   - 套用溫和冪次等級曲線（$\text{RequiredXP} = \lfloor 100 \times \text{Level}^{1.35} \rfloor$），每通過單字獲得經驗值晉升階級。
   - 口說過關即時回傳至後端 Google 試算表，支援 `LockService` 併發寫入保護與離線暫存重傳。
   - 提供「🌐 全校榮譽榜」與「🏫 本班排行榜」，並支援教師在後端一鍵產出全校各班護照認證通過率報表 (`action=generateReport`)。

6. **🎵 治癒系純程序八音盒背景音樂（Web Audio API）**
   - 零外部大型音訊檔負擔，由瀏覽器即時合成溫馨舒緩的八音盒與和弦音效，營造放鬆專注的學習氛圍。

---

## 📚 學習核心單字 (Target Vocabulary)

| 關卡區域 | 關鍵單字 | 音標自然發音 | 涵義 | 解謎融入情境 | 森林導師 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Zone 1: 書桌與燭光** | `LIGHT` | `/laɪt/` | 光芒、點亮 | 點燃古銅燭台，驅散晨曦陰影 | 小狐狸 Foxy |
| | `BOOK` | `/bʊk/` | 書本、魔導書 | 翻開漂浮的古代魔導書 | 小狐狸 Foxy |
| | `KEY` | `/kiː/` | 鑰匙、關鍵 | 魔導書中掉落的黃銅鑰匙 | 小狐狸 Foxy |
| **Zone 2: 元素調劑台** | `RED` | `/red/` | 紅色、火紅 | 從書桌抽屜中取出火紅魔藥 | 小兔 Bunny |
| | `BLUE` | `/bluː/` | 藍色、蒼藍 | 將蒼藍之水注入煉金燒瓶 | 小兔 Bunny |
| | `STAR` | `/stɑːr/` | 星星、星芒 | 魔藥交融升騰而出的星芒之石 | 小兔 Bunny |
| **Zone 3: 呆萌寶箱怪** | `CAT` | `/kæt/` | 貓咪 | 喚醒長著貓耳朵的可愛寶箱怪 | 貓咪寶箱怪 Mimic |
| | `FISH` | `/fɪʃ/` | 魚、小魚乾 | 餵食寶箱怪愛吃的小魚乾 | 貓咪寶箱怪 Mimic |
| **Zone 4: 封印石門** | `FLOWER` | `/ˈflaʊ.ər/` | 花朵、蒼月花 | 寶箱怪吃飽後開心地吐出花朵石刻 | 貓頭鷹長老 Ollie |
| | `DOOR` | `/dɔːr/` | 大門、門扉 | 鑲嵌雙重魔法石於遠古石門凹槽 | 貓頭鷹長老 Ollie |
| | `OPEN` | `/ˈoʊ.pən/` | 打開、開啟 | 頌唱開門咒語，石門轟然敞開 | 貓頭鷹長老 Ollie |
| **Zone 5: 破關花田** | `SUN` | `/sʌn/` | 太陽、朝陽 | 走出石門，步入沐浴在晨光中的花田 | 全體吉祥物祝賀 |

---

## 🚀 本地開發與測試

可在本專案目錄下啟動任意本地 HTTP 靜態伺服器：

```bash
# Python 3
python -m http.server 8080

# 或使用 Node.js http-server
npx http-server -p 8080
```

開啟瀏覽器前往 `http://localhost:8080` 即可遊玩。

## 🛠️ 開發者參考與架構規格 (For Developers & AI Agents)

本專案將所有技術細節、模組解耦、手勢校準與發布管線沉澱為完整技術文件，方便其他開發者或 AI Agent 複用與擴充：

- 📘 **[技術架構與完整開發者手冊 (DEVELOPER_GUIDE.md)](DEVELOPER_GUIDE.md)**：包含模組劃分、Web Speech API 模糊容錯、雙模觸控手勢防誤觸演算法、AI 文生圖材質皮膚管線與 GitHub Pages 發布詳解。
- ☁️ **[Google Apps Script 後端腳本 (gas/Code.gs)](gas/Code.gs)**：提供全校免維護成本之 Google 試算表雲端 API，含試算表初始化、LockService 併發保護與即時排行榜。
- 🤖 **[Agent Skill 規範文件 (SKILL.md)](SKILL.md)**：專為 Google Antigravity / Gemini 編寫的標準 Skill 模式，可一鍵讓 AI 助理掌握本套 3D 教育遊戲開發能力。

---

## 📜 授權與版權 (License)

MIT License © 2026 hs5743. All rights reserved.  
特別致敬：《童趣森林英語》（Whimsy Forest English）與《葬送的芙莉蓮》（Sousou no Frieren）。
