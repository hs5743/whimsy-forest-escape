// 語音識別與口說評測管理器 (SpeechManager)
// 支援 Web Speech API (webkitSpeechRecognition)、平板瀏覽器麥克風互動與課堂容錯機制

class SpeechManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.mode = 'word'; // 'word' | 'sentence'
    this.currentWordKey = "";
    this.targetData = null;
    this.targetSentence = "";
    this.sentenceKeywords = [];
    this.sentenceRequiredAcc = 80;
    this.onResultCallback = null;
    this.onSentenceResultCallback = null;
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
        if (this.mode === 'sentence') {
          this.updateSentenceUI("listening", "🎙️ 正在聆聽問句... 請完整大聲朗讀！");
        } else {
          this.updateUIStatus("listening", "🎙️ 正在聆聽... 請大聲唸出單字！");
        }
      };

      this.recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        transcript = transcript.trim();

        if (this.mode === 'sentence') {
          this.updateSentenceUI("detecting", `聽到你說：「${transcript}」`);
          if (event.results[0].isFinal) {
            this.evaluateSentencePronunciation(transcript);
          }
        } else {
          const lower = transcript.toLowerCase();
          this.updateUIStatus("detecting", `聽到你說：「${lower}」`);
          if (event.results[0].isFinal) {
            this.evaluatePronunciation(lower);
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.isListening = false;
        const errorMsg = (event.error === 'not-allowed')
          ? "⚠️ 請允許麥克風權限以進行口說練習，或點擊「老師驗證通過」過關。"
          : (event.error === 'no-speech')
            ? "沒聽清楚，請靠近麥克風再試一次喔！"
            : `辨識提示：${event.error}，可再試一次或點擊老師驗證通過。`;

        if (this.mode === 'sentence') {
          this.updateSentenceUI("error", errorMsg);
        } else {
          this.updateUIStatus("error", errorMsg);
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

    if (!this.targetData && window.PassportBankHelper) {
      const pw = window.PassportBankHelper.findByWord(this.currentWordKey);
      if (pw) {
        this.targetData = {
          word: pw.word,
          zh: pw.zh || pw.chinese || '',
          matchKeywords: [pw.word.toLowerCase()]
        };
      }
    }
    if (!this.targetData) {
      this.targetData = {
        word: this.currentWordKey,
        zh: '',
        matchKeywords: [this.currentWordKey.toLowerCase()]
      };
    }

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

  // ==========================================
  // 關卡主英語問句整句朗讀試煉 (Sentence Trial)
  // ==========================================

  playSentenceVoice(sentence) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(sentence);
      utter.lang = 'en-US';
      utter.rate = 0.85;
      utter.pitch = 1.05;
      window.speechSynthesis.speak(utter);
    }
  }

  startSentenceListening(targetSentence, keywords = [], reqAccuracy = 80, callback) {
    this.mode = 'sentence';
    this.targetSentence = targetSentence;
    this.sentenceKeywords = (keywords && keywords.length > 0)
      ? keywords
      : targetSentence.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    this.sentenceRequiredAcc = reqAccuracy || 80;
    this.onSentenceResultCallback = callback;

    if (!this.recognition) {
      this.updateSentenceUI("unsupported", "⚠️ 瀏覽器未支援語音辨識，可點擊「老師驗證通過」按鈕。");
      return;
    }

    try {
      if (this.isListening) {
        this.recognition.stop();
      }
      this.recognition.start();
    } catch (e) {
      console.warn("Sentence recognition start error:", e);
    }
  }

  // 整句口說精準度評測 (Word Alignment + Levenshtein Distance)
  // 返回：{ accuracy: number, passed: boolean, matchedWords: string[], missedWords: string[], feedback: string }
  evaluateSentenceAccuracy(userTranscript, targetSentence, targetKeywords = [], requiredAccuracy = 80) {
    if (!userTranscript || !targetSentence) {
      return {
        accuracy: 0,
        passed: false,
        matchedWords: [],
        missedWords: targetKeywords.length ? [...targetKeywords] : targetSentence.split(/\s+/),
        userTranscript: userTranscript || '',
        targetSentence,
        feedback: '未偵測到聲音，請靠近麥克風再朗讀一次！'
      };
    }

    const cleanUser = userTranscript.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const cleanTarget = targetSentence.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

    const userTokens = cleanUser ? cleanUser.split(' ') : [];
    const targetTokens = cleanTarget ? cleanTarget.split(' ') : [];

    if (targetTokens.length === 0) {
      return { accuracy: 100, passed: true, matchedWords: [], missedWords: [], feedback: '完美！' };
    }

    const matchedWords = [];
    const missedWords = [];
    let matchedTokenCount = 0;
    const remainingUserTokens = [...userTokens];

    targetTokens.forEach(targetWord => {
      let foundIndex = remainingUserTokens.indexOf(targetWord);
      if (foundIndex === -1 && targetWord.length >= 4) {
        for (let i = 0; i < remainingUserTokens.length; i++) {
          const uWord = remainingUserTokens[i];
          if (this.levenshteinDistance(targetWord, uWord) <= 1) {
            foundIndex = i;
            break;
          }
        }
      }

      if (foundIndex !== -1) {
        matchedWords.push(targetWord);
        matchedTokenCount++;
        remainingUserTokens.splice(foundIndex, 1);
      } else {
        missedWords.push(targetWord);
      }
    });

    const tokenRatio = (matchedTokenCount / targetTokens.length) * 100;
    const strSim = this.stringSimilarity(cleanUser, cleanTarget) * 100;

    let accuracy = Math.round(tokenRatio * 0.65 + strSim * 0.35);
    if (missedWords.length === 0) {
      accuracy = Math.max(accuracy, 95);
    }
    accuracy = Math.max(0, Math.min(100, accuracy));

    const passed = accuracy >= requiredAccuracy;
    let feedback = '';
    if (passed) {
      feedback = `🎯 準確度 ${accuracy}% (門檻 ${requiredAccuracy}%)！英語問句朗讀達標！`;
    } else {
      feedback = `目前準確度 ${accuracy}% (要求 ≥ ${requiredAccuracy}%)，加強清楚唸出：【${missedWords.join(', ')}】！`;
    }

    return {
      accuracy,
      passed,
      matchedWords,
      missedWords,
      userTranscript,
      targetSentence,
      feedback
    };
  }

  evaluateSentencePronunciation(transcript) {
    const result = this.evaluateSentenceAccuracy(
      transcript,
      this.targetSentence,
      this.sentenceKeywords,
      this.sentenceRequiredAcc
    );

    if (result.passed) {
      this.updateSentenceUI("success", `🎉 太棒了！${result.feedback}`, result);
      if (window.audioManager) window.audioManager.playSfx("magicSuccess");
      setTimeout(() => {
        if (this.onSentenceResultCallback) {
          this.onSentenceResultCallback(result);
        }
      }, 1000);
    } else {
      this.updateSentenceUI("retry", `⚡ ${result.feedback} 請再唸一次！`, result);
      if (window.audioManager) window.audioManager.playSfx("click");
    }
  }

  forceSentencePass() {
    const result = {
      accuracy: 95,
      passed: true,
      matchedWords: this.sentenceKeywords || [],
      missedWords: [],
      userTranscript: this.targetSentence,
      targetSentence: this.targetSentence,
      feedback: '✨ 課堂教師驗證通過 (95%)！'
    };
    this.updateSentenceUI("success", "✨ 課堂教師驗證通過！英語問句試煉過關！", result);
    if (window.audioManager) window.audioManager.playSfx("magicSuccess");
    setTimeout(() => {
      if (this.onSentenceResultCallback) {
        this.onSentenceResultCallback(result);
      }
    }, 600);
  }

  updateSentenceUI(state, msg, result = null) {
    const statusBox = document.getElementById("guardianSpeechStatus");
    const micBtn = document.getElementById("btnGuardianMic");
    const meter = document.getElementById("guardianAccuracyBar");
    const percentText = document.getElementById("guardianAccuracyPercent");
    const feedbackBox = document.getElementById("guardianSentenceFeedback");

    if (statusBox) {
      statusBox.textContent = msg;
      statusBox.className = `guardian-speech-status status-${state}`;
    }

    if (micBtn) {
      if (state === "listening") {
        micBtn.classList.add("pulsing");
        micBtn.innerHTML = "<span>🔴 正在聆聽問句... (請開口)</span>";
      } else {
        micBtn.classList.remove("pulsing");
        micBtn.innerHTML = "<span>🎙️ 按下開始問句朗讀 (Speak Sentence)</span>";
      }
    }

    if (result) {
      if (meter) {
        meter.style.width = `${result.accuracy}%`;
        meter.style.backgroundColor = result.passed ? '#22c55e' : '#f59e0b';
      }
      if (percentText) {
        percentText.textContent = `${result.accuracy}%`;
        percentText.style.color = result.passed ? '#15803d' : '#b45309';
      }
      if (feedbackBox) {
        // 渲染單字逐字高亮
        const targetTokens = this.targetSentence.split(/\s+/);
        feedbackBox.innerHTML = targetTokens.map(w => {
          const cleanW = w.toLowerCase().replace(/[^a-z0-9]/g, '');
          const isMatched = result.matchedWords.includes(cleanW);
          return `<span class="sentence-word-token ${isMatched ? 'token-matched' : 'token-missed'}">${w}</span>`;
        }).join(' ');
      }
    }
  }

  levenshteinDistance(a, b) {
    if (!a || !b) return (a || b) ? Math.max(a.length, b.length) : 0;
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + 1
          );
        }
      }
    }
    return dp[m][n];
  }

  stringSimilarity(a, b) {
    if (a === b) return 1.0;
    if (!a || !b) return 0.0;
    const dist = this.levenshteinDistance(a, b);
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1.0;
    return Math.max(0, (maxLen - dist) / maxLen);
  }
}

window.speechManager = new SpeechManager();
