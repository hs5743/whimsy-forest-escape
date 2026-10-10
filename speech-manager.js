// 語音識別與口說評測管理器 (SpeechManager)
// 支援 Web Speech API (webkitSpeechRecognition)、平板瀏覽器麥克風互動與課堂容錯機制

class SpeechManager {
  constructor() {
    this.session = 0;
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
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = new Recognition();
    const session = this.session;
    this.recognition = recognition;
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    const current = () => this.recognition === recognition && this.session === session;
    recognition.onstart = () => {
      if (!current()) return;
      clearTimeout(this.recognitionWatchdog);
      this.isListening = true;
      this.setRecognitionStatus('listening', this.mode === 'sentence' ? '正在聆聽，請朗讀完整句子。' : '正在聆聽，請唸出單字。');
      window.audioManager?.duckBgm(.2);
      this.recognitionWatchdog = setTimeout(() => {
        if (!current()) return;
        this.failRecognition('timeout');
      }, 20000);
    };
    recognition.onresult = event => {
      if (!current() || this.recognitionResolved) return;
      let transcript = '', final = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + ' ';
        final = final || event.results[i].isFinal;
      }
      transcript = transcript.trim();
      this.setRecognitionStatus('detecting', '聽到你說：「' + transcript + '」');
      if (!final) return;
      this.recognitionResolved = true;
      clearTimeout(this.recognitionWatchdog);
      if (this.mode === 'sentence') this.evaluateSentencePronunciation(transcript);
      else this.evaluatePronunciation(transcript);
    };
    recognition.onerror = event => {
      if (!current() || this.recognitionResolved) return;
      this.failRecognition(event.error);
    };
    recognition.onend = () => {
      if (!current()) return;
      clearTimeout(this.recognitionWatchdog);
      this.isListening = false;
      window.audioManager?.unduckBgm();
      if (!this.recognitionResolved) {
        this.recognitionResolved = true;
        this.setRecognitionStatus('retry', '沒有收到完整辨識結果，請點擊朗讀再試一次。');
      }
    };
  }

  setRecognitionStatus(state, message) {
    if (this.mode === 'sentence') this.updateSentenceUI(state, message);
    else this.updateUIStatus(state, message);
  }

  cancelRecognition() {
    clearTimeout(this.recognitionWatchdog);
    const previous = this.recognition;
    this.recognition = null;
    this.isListening = false;
    if (previous) { try { previous.abort(); } catch (_) {} }
    window.audioManager?.unduckBgm();
  }

  failRecognition(error) {
    const messages = {
      'not-allowed': '麥克風未獲允許。請在瀏覽器設定允許後重試，也可請老師協助驗證。',
      'service-not-allowed': '此瀏覽器無法使用辨識服務，可改用支援的瀏覽器或請老師協助驗證。',
      'audio-capture': '找不到可用的麥克風。請檢查連接與裝置設定後重試。',
      'network': '語音辨識暫時連不上網路。請檢查連線後重試，也可先聽示範。',
      'no-speech': '沒有聽到聲音，請靠近麥克風，再點擊朗讀試一次。',
      'aborted': '朗讀已停止，可以再試一次。',
      'timeout': '辨識等待時間較長，已停止錄音。請檢查麥克風或網路後重試。',
      'start-failed': '無法啟動錄音，請稍後重試或請老師協助驗證。'
    };
    this.recognitionResolved = true;
    this.cancelRecognition();
    this.setRecognitionStatus('error', messages[error] || '辨識暫時無法完成，請重新朗讀或請老師協助驗證。');
  }

  beginRecognition() {
    this.cancelRecognition();
    this.recognitionResolved = false;
    this.initRecognition();
    if (!this.recognition) {
      this.setRecognitionStatus('unsupported', '此瀏覽器不支援語音辨識。仍可聽示範，並請老師協助驗證。');
      return;
    }
    this.isListening = true;
    this.setRecognitionStatus('listening', '正在準備麥克風… 若出現權限提示，請選擇允許。');
    const recognition = this.recognition;
    const session = this.session;
    this.recognitionWatchdog = setTimeout(() => {
      if (this.recognition === recognition && this.session === session) this.failRecognition('timeout');
    }, 8000);
    try { recognition.start(); }
    catch (_) { this.failRecognition('start-failed'); }
  }

  preloadAudios() {
    for (let key in VOCAB_DATA) {
      const item = VOCAB_DATA[key];
      if (item.audioFile) {
        const a = new Audio(item.audioFile);
        a.preload = "none";
        this.audioCache[key] = a;
      }
    }
  }

  playWordVoice(wordKey) {
    this.interruptForVoice();
    this.stopVoice();
    this.applyVoiceVolume();
    const key = wordKey.toUpperCase();
    if (this.audioCache[key]) {
      this.currentVoice = this.audioCache[key];
      window.audioManager?.duckBgm(.25);
      const voice = this.currentVoice;
      voice.onended = () => { if (this.currentVoice === voice) window.audioManager?.unduckBgm(); };
      voice.onerror = () => { if (this.currentVoice === voice) this.fallbackSpeechSynthesis(key); };
      this.audioCache[key].currentTime = 0;
      this.audioCache[key].play().catch(() => {
        if (this.currentVoice === voice) this.fallbackSpeechSynthesis(key);
      });
    } else {
      this.fallbackSpeechSynthesis(key);
    }
  }

  interruptForVoice() {
    if (!this.isListening) return;
    this.setRecognitionStatus('idle', '已停止錄音，可先聽示範再朗讀。');
    this.stopListening();
  }

  applyVoiceVolume() {
    const settings=window.world3D?.settings || GamePolish.loadSettings(localStorage);
    for(const audio of Object.values(this.audioCache)) audio.volume=settings.master*settings.voice;
  }
  stopVoice() {
    if(this.currentVoice) {this.currentVoice.pause();this.currentVoice.currentTime=0;this.currentVoice=null;}
    if('speechSynthesis' in window) window.speechSynthesis.cancel();
    window.audioManager?.unduckBgm();
  }
  defer(callback, delay) { const session=this.session; return setTimeout(()=>{if(session===this.session) callback();},delay); }
  fallbackSpeechSynthesis(word) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word.toLowerCase());
      utter.lang = 'en-US';
      utter.rate = 0.85;
      const settings=window.world3D?.settings || GamePolish.loadSettings(localStorage); utter.volume=settings.master*settings.voice;
      utter.onstart = () => {
        if (window.audioManager && typeof window.audioManager.duckBgm === 'function') {
          window.audioManager.duckBgm(0.25);
        }
      };
      utter.onend = () => {
        if (window.audioManager && typeof window.audioManager.unduckBgm === 'function') {
          window.audioManager.unduckBgm();
        }
      };
      utter.onerror = () => {
        if (window.audioManager && typeof window.audioManager.unduckBgm === 'function') {
          window.audioManager.unduckBgm();
        }
      };
      window.speechSynthesis.speak(utter);
    }
  }

  startListening(wordKey, callback) {
    this.session++; this.stopVoice();
    // 關鍵修復 1：明確將狀態切換回單字評測模式，杜絕被問句朗讀殘留的 mode 干擾
    this.mode = 'word';
    this.currentWordKey = (wordKey || "").toUpperCase();
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

    // 關鍵修復 2：停止正在播放的外師或系統 TTS，避免干擾麥克風錄音
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    this.beginRecognition();
  }

  stopListening() {
    this.session++;
    this.cancelRecognition();
    this.stopVoice();
    this.mode = 'word';
  }

  evaluatePronunciation(userTranscript) {
    if (!this.targetData) return;

    const normalize = text => String(text).toLowerCase().replace(/[^a-z0-9']/g, ' ').replace(/\s+/g, ' ').trim();
    const cleanInput = normalize(userTranscript);
    const targetWord = normalize(this.targetData.word);
    const matchWords = [targetWord, ...(this.targetData.matchKeywords || []).map(normalize)].filter(Boolean);
    // Match whole words or phrases; “flight” must not pass “light”.
    const isMatch = matchWords.some(word => (' ' + cleanInput + ' ').includes(' ' + word + ' '));

    if (isMatch) {
      this.updateUIStatus("success", `✨ 辨識成功！聽到了「${this.targetData.word}」！魔法共鳴！`);
      if (window.audioManager) {
        window.audioManager.playSfx("magicSuccess");
      }
      this.defer(() => {
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

  forcePass(notify = true) {
    if (!this.targetData) return;
    this.session++; this.cancelRecognition();
    this.updateUIStatus("success", `✨ 課堂口說驗證通過：【${this.targetData.word}】！`);
    if (window.audioManager) {
      window.audioManager.playSfx("magicSuccess");
    }
    if (!notify) return;
    this.defer(() => {
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
        micBtn.classList.remove("success");
        micBtn.style.background = "";
        micBtn.innerHTML = "<span>正在聆聽…</span>";
      } else if (state === "detecting") {
        micBtn.classList.add("pulsing");
        micBtn.classList.remove("success");
        micBtn.style.background = "";
        micBtn.innerHTML = "<span>辨識中…</span>";
      } else if (state === "success") {
        micBtn.classList.remove("pulsing");
        micBtn.classList.add("success");
        micBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
        micBtn.innerHTML = "<span>✅ 辨識成功！</span>";
      } else if (state === "unsupported") {
        micBtn.classList.remove("pulsing");
        micBtn.classList.remove("success");
        micBtn.style.background = "linear-gradient(135deg, #64748b, #475569)";
        micBtn.innerHTML = "<span>語音暫不可用</span>";
      } else if (state === "error") {
        micBtn.classList.remove("pulsing");
        micBtn.classList.remove("success");
        micBtn.style.background = "linear-gradient(135deg, #ef4444, #b91c1c)";
        micBtn.innerHTML = "<span>重新朗讀</span>";
      } else {
        micBtn.classList.remove("pulsing");
        micBtn.classList.remove("success");
        micBtn.style.background = "";
        micBtn.innerHTML = "<span>開始朗讀</span>";
      }
    }
  }

  // ==========================================
  // 關卡主英語問句整句朗讀試煉 (Sentence Trial)
  // ==========================================

  playSentenceVoice(sentence) {
    this.interruptForVoice();
    this.stopVoice();
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(sentence);
        utter.lang = 'en-US';
        utter.rate = 0.85;
      const settings=window.world3D?.settings || GamePolish.loadSettings(localStorage); utter.volume=settings.master*settings.voice;
        utter.pitch = 1.05;
        utter.onstart = () => {
          if (window.audioManager && typeof window.audioManager.duckBgm === 'function') {
            window.audioManager.duckBgm(0.25);
          }
        };
        utter.onend = () => {
          if (window.audioManager && typeof window.audioManager.unduckBgm === 'function') {
            window.audioManager.unduckBgm();
          }
        };
        utter.onerror = () => {
          if (window.audioManager && typeof window.audioManager.unduckBgm === 'function') {
            window.audioManager.unduckBgm();
          }
        };
        window.speechSynthesis.speak(utter);
      } catch (err) {
        console.warn("Speech synthesis error:", err);
      }
    }
  }

  startSentenceListening(targetSentence, keywords = [], reqAccuracy = 80, callback) {
    this.session++; this.stopVoice();
    this.mode = 'sentence';
    this.targetSentence = targetSentence;
    this.sentenceKeywords = (keywords && keywords.length > 0)
      ? keywords
      : targetSentence.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    this.sentenceRequiredAcc = reqAccuracy || 80;
    this.onSentenceResultCallback = callback;

    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    this.beginRecognition();
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
      feedback = `🎯 辨識文字符合度 ${accuracy}% (門檻 ${requiredAccuracy}%)！英語問句朗讀達標！`;
    } else {
      feedback = `目前文字符合度 ${accuracy}% (要求 ≥ ${requiredAccuracy}%)，加強清楚唸出：【${missedWords.join(', ')}】！`;
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
      this.defer(() => {
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
    this.session++; this.cancelRecognition();
    const result = {
      accuracy: null,
      teacherVerified: true,
      passed: true,
      matchedWords: this.sentenceKeywords || [],
      missedWords: [],
      userTranscript: '',
      targetSentence: this.targetSentence,
      feedback: '✨ 課堂教師驗證通過！'
    };
    this.updateSentenceUI("success", "✨ 課堂教師驗證通過！英語問句試煉過關！", result);
    if (window.audioManager) window.audioManager.playSfx("magicSuccess");
    this.defer(() => {
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
        meter.style.width = result.teacherVerified ? '100%' : `${result.accuracy}%`;
        meter.style.backgroundColor = result.passed ? '#22c55e' : '#f59e0b';
      }
      if (percentText) {
        percentText.textContent = result.teacherVerified ? '教師驗證' : `${result.accuracy}%`;
        percentText.style.color = result.passed ? '#15803d' : '#b45309';
      }
      if (feedbackBox && result.teacherVerified) {
        feedbackBox.textContent = '教師已協助確認本次口說練習。';
      } else if (feedbackBox) {
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
