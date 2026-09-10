// 語音識別與口說評測管理器 (SpeechManager)
// 支援 Web Speech API (webkitSpeechRecognition)、平板瀏覽器麥克風互動與課堂容錯機制

class SpeechManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.currentWordKey = "";
    this.targetData = null;
    this.onResultCallback = null;
    this.audioCache = {};

    this.initRecognition();
    this.preloadAudios();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateUIStatus("listening", "🎙️ 正在聆聽... 請大聲唸出單字！");
      };

      this.recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        transcript = transcript.trim().toLowerCase();
        this.updateUIStatus("detecting", `聽到你說：「${transcript}」`);

        if (event.results[0].isFinal) {
          this.evaluatePronunciation(transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.isListening = false;
        if (event.error === 'not-allowed') {
          this.updateUIStatus("error", "⚠️ 請允許麥克風權限以進行口說練習，或點擊下方備用按鈕過關。");
        } else if (event.error === 'no-speech') {
          this.updateUIStatus("idle", "沒聽清楚，請靠近麥克風再試一次喔！");
        } else {
          this.updateUIStatus("error", `辨識提示：${event.error}，可再試一次或手動通過。`);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    } else {
      console.warn("Web Speech API not supported on this browser.");
    }
  }

  preloadAudios() {
    for (let key in VOCAB_DATA) {
      const item = VOCAB_DATA[key];
      if (item.audioFile) {
        const a = new Audio(item.audioFile);
        a.preload = "auto";
        this.audioCache[key] = a;
      }
    }
  }

  playWordVoice(wordKey) {
    const key = wordKey.toUpperCase();
    if (this.audioCache[key]) {
      this.audioCache[key].currentTime = 0;
      this.audioCache[key].play().catch(() => {
        this.fallbackSpeechSynthesis(key);
      });
    } else {
      this.fallbackSpeechSynthesis(key);
    }
  }

  fallbackSpeechSynthesis(word) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word.toLowerCase());
      utter.lang = 'en-US';
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  }

  startListening(wordKey, callback) {
    this.currentWordKey = wordKey.toUpperCase();
    this.targetData = VOCAB_DATA[this.currentWordKey];
    this.onResultCallback = callback;

    if (!this.recognition) {
      this.updateUIStatus("unsupported", "⚠️ 瀏覽器未支援語音辨識，請使用下方「發音驗證通過」按鈕。");
      return;
    }

    try {
      if (this.isListening) {
        this.recognition.stop();
      }
      this.recognition.start();
    } catch (e) {
      console.warn("Recognition start error:", e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  evaluatePronunciation(userTranscript) {
    if (!this.targetData) return;

    const cleanInput = userTranscript.replace(/[.,?!]/g, '').toLowerCase().trim();
    const targetWord = this.targetData.word.toLowerCase();
    const matchWords = this.targetData.matchKeywords || [targetWord];

    // 檢查是否命中單字
    let isMatch = false;
    if (cleanInput.includes(targetWord)) {
      isMatch = true;
    } else {
      for (let kw of matchWords) {
        if (cleanInput.includes(kw)) {
          isMatch = true;
          break;
        }
      }
    }

    if (isMatch) {
      this.updateUIStatus("success", `✨ 辨識成功！聽到了「${this.targetData.word}」！魔法共鳴！`);
      if (window.audioManager) {
        window.audioManager.playSfx("magicSuccess");
      }
      setTimeout(() => {
        if (this.onResultCallback) {
          this.onResultCallback(true, this.targetData);
        }
      }, 900);
    } else {
      this.updateUIStatus("retry", `聽到了「${cleanInput}」，跟目標單字【${this.targetData.word}】差一點點，再唸一次試試看！`);
      if (window.audioManager) {
        window.audioManager.playSfx("click");
      }
    }
  }

  forcePass() {
    if (!this.targetData) return;
    this.updateUIStatus("success", `✨ 課堂口說驗證通過：【${this.targetData.word}】！`);
    if (window.audioManager) {
      window.audioManager.playSfx("magicSuccess");
    }
    setTimeout(() => {
      if (this.onResultCallback) {
        this.onResultCallback(true, this.targetData);
      }
    }, 600);
  }

  updateUIStatus(state, msg) {
    const statusBox = document.getElementById("speechStatus");
    const micBtn = document.getElementById("micButton");
    if (!statusBox) return;

    statusBox.textContent = msg;
    statusBox.className = `speech-status status-${state}`;

    if (micBtn) {
      if (state === "listening") {
        micBtn.classList.add("pulsing");
        micBtn.innerHTML = "<span>🔴 正在錄音... (請開口)</span>";
      } else {
        micBtn.classList.remove("pulsing");
        micBtn.innerHTML = "<span>🎙️ 按下開始口說挑戰 (Speak)</span>";
      }
    }
  }
}

window.speechManager = new SpeechManager();
