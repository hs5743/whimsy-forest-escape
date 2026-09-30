// 高階音效與多軌交響/八音盒背景音樂管理器 (AudioManager)
// 基於 Web Audio API 純程序化即時音訊合成，具備程序化空間殘響 (Convolution Reverb)、
// 溫暖弦樂和弦墊 (Atmospheric Warm Pad)、多音色鈴蘭主旋律與十界場景專屬主題音樂 (Zone-Themed Soundtracks)
// 100% 零外部音效檔依賴，無延遲、離線可用、跨平台相容

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.dryGain = null;
    this.reverbNode = null;
    this.reverbFilter = null;
    this.reverbGain = null;

    this.isBgmPlaying = false;
    this.isMuted = false;
    this.isDucked = false;
    this.normalBgmVolume = 0.22;
    this.bgmTimeout = null;
    this.currentNoteIndex = 0;
    this.currentChordIndex = 0;
    this.currentThemeKey = 'study';

    // 十大奇幻星界專屬主題曲庫 (Zone-Themed Musical Themes)
    this.zoneThemes = {
      // Zone 1: 見習學徒書齋 (悠閒溫暖、八音盒與大提琴和弦墊)
      'study': {
        name: '見習書齋 • 蒼月之約 (C Major / Lydian)',
        tempoMs: 760,
        chords: [
          { root: 65.41, notes: [261.63, 329.63, 392.00, 493.88] }, // Cmaj7
          { root: 55.00, notes: [220.00, 261.63, 329.63, 392.00] }, // Am7
          { root: 43.65, notes: [174.61, 261.63, 329.63, 349.23] }, // Fmaj7
          { root: 49.00, notes: [196.00, 261.63, 293.66, 392.00] }  // Gsus4
        ],
        melody: [
          { f: 523.25, d: 1 }, { f: 659.25, d: 1 }, { f: 783.99, d: 1.5 }, { f: 659.25, d: 0.8 },
          { f: 587.33, d: 1 }, { f: 440.00, d: 1 }, { f: 523.25, d: 2 },
          { f: 392.00, d: 1 }, { f: 440.00, d: 1 }, { f: 523.25, d: 1 }, { f: 659.25, d: 1 },
          { f: 587.33, d: 2.4 },
          { f: 523.25, d: 1 }, { f: 659.25, d: 1 }, { f: 783.99, d: 1.5 }, { f: 880.00, d: 0.8 },
          { f: 783.99, d: 1 }, { f: 659.25, d: 1 }, { f: 523.25, d: 2 },
          { f: 440.00, d: 1 }, { f: 523.25, d: 1 }, { f: 587.33, d: 1 }, { f: 493.88, d: 1 },
          { f: 523.25, d: 3 }
        ]
      },
      // Zone 2 & 4: 陽光市集與冒險操場 (輕快跳躍、活力短音符、溫暖民謠風)
      'pastoral': {
        name: '陽光市集與操場 • 綠茵躍動 (G Major)',
        tempoMs: 640,
        chords: [
          { root: 49.00, notes: [196.00, 246.94, 293.66, 392.00] }, // G
          { root: 46.25, notes: [185.00, 220.00, 293.66, 370.00] }, // D/F#
          { root: 41.20, notes: [164.81, 246.94, 293.66, 329.63] }, // Em7
          { root: 65.41, notes: [261.63, 329.63, 392.00, 523.25] }  // C
        ],
        melody: [
          { f: 587.33, d: 0.8 }, { f: 783.99, d: 0.8 }, { f: 880.00, d: 1.2 }, { f: 987.77, d: 1.2 },
          { f: 880.00, d: 0.8 }, { f: 783.99, d: 0.8 }, { f: 587.33, d: 1.6 },
          { f: 659.25, d: 0.8 }, { f: 783.99, d: 0.8 }, { f: 880.00, d: 0.8 }, { f: 659.25, d: 0.8 },
          { f: 783.99, d: 2.2 },
          { f: 880.00, d: 0.8 }, { f: 987.77, d: 0.8 }, { f: 1174.66, d: 1.5 }, { f: 987.77, d: 0.8 },
          { f: 783.99, d: 1.0 }, { f: 659.25, d: 1.0 }, { f: 783.99, d: 2.5 }
        ]
      },
      // Zone 3: 守護獸之森花園 (空靈晨曦、清澈泉水、精靈風鈴與豎琴)
      'sanctuary': {
        name: '守護獸森林 • 晨曦空靈 (F Major Pentatonic)',
        tempoMs: 820,
        chords: [
          { root: 43.65, notes: [174.61, 220.00, 261.63, 349.23] }, // Fmaj7
          { root: 36.71, notes: [146.83, 220.00, 261.63, 329.63] }, // Dm7
          { root: 58.27, notes: [233.08, 293.66, 349.23, 440.00] }, // Bbmaj7
          { root: 65.41, notes: [261.63, 329.63, 392.00, 523.25] }  // C
        ],
        melody: [
          { f: 698.46, d: 1.2 }, { f: 783.99, d: 0.8 }, { f: 880.00, d: 1.6 },
          { f: 1046.50, d: 1.2 }, { f: 880.00, d: 0.8 }, { f: 698.46, d: 2.0 },
          { f: 587.33, d: 1.0 }, { f: 698.46, d: 1.0 }, { f: 880.00, d: 1.5 }, { f: 783.99, d: 0.8 },
          { f: 698.46, d: 2.8 }
        ]
      },
      // Zone 5 & 6: 星光車站與蔚藍海港 (汽笛與海風、浪漫遠航、波浪起伏)
      'voyage': {
        name: '星光鐵道與海港 • 遠航華爾滋 (D Major 3/4 Waltz)',
        tempoMs: 740,
        chords: [
          { root: 73.42, notes: [293.66, 369.99, 440.00, 587.33] }, // D
          { root: 61.74, notes: [246.94, 293.66, 369.99, 440.00] }, // Bm
          { root: 49.00, notes: [196.00, 246.94, 293.66, 392.00] }, // G
          { root: 55.00, notes: [220.00, 277.18, 329.63, 440.00] }  // A
        ],
        melody: [
          { f: 587.33, d: 1.5 }, { f: 739.99, d: 0.75 }, { f: 880.00, d: 0.75 },
          { f: 1174.66, d: 2.0 }, { f: 987.77, d: 1.0 },
          { f: 880.00, d: 1.5 }, { f: 739.99, d: 0.75 }, { f: 587.33, d: 0.75 },
          { f: 739.99, d: 2.8 }
        ]
      },
      // Zone 7 & 9: 觀測站與萬神殿堂 (浩瀚星海、宏偉宇宙神殿、水晶鐘鳴)
      'celestial': {
        name: '觀測站與萬神殿堂 • 宇宙星穹 (A Dorian / E Aeolian)',
        tempoMs: 880,
        chords: [
          { root: 55.00, notes: [220.00, 261.63, 329.63, 392.00, 493.88] }, // Am9
          { root: 46.25, notes: [185.00, 220.00, 261.63, 329.63] },         // F#m7b5
          { root: 41.20, notes: [164.81, 246.94, 329.63, 392.00, 493.88] }, // Em9
          { root: 73.42, notes: [293.66, 369.99, 440.00, 587.33] }          // Dmaj7
        ],
        melody: [
          { f: 880.00, d: 1.5 }, { f: 987.77, d: 1.0 }, { f: 1046.50, d: 2.0 },
          { f: 1318.51, d: 1.5 }, { f: 1174.66, d: 1.0 }, { f: 880.00, d: 2.5 },
          { f: 987.77, d: 1.0 }, { f: 783.99, d: 1.0 }, { f: 659.25, d: 1.5 }, { f: 587.33, d: 1.0 },
          { f: 880.00, d: 3.5 }
        ]
      },
      // Zone 8 & 10: 極光冰雪與蒼穹空島 (極光晶瑩、天界虹彩、冰晶八音琴)
      'aurora': {
        name: '極光冰雪與蒼穹空島 • 晶瑩天籟 (E Lydian)',
        tempoMs: 800,
        chords: [
          { root: 41.20, notes: [164.81, 246.94, 329.63, 392.00, 493.88] }, // Emaj7
          { root: 34.65, notes: [138.59, 207.65, 277.18, 329.63] },         // C#m7
          { root: 55.00, notes: [220.00, 277.18, 329.63, 440.00] },         // Amaj7
          { root: 61.74, notes: [246.94, 311.13, 369.99, 493.88] }          // B7
        ],
        melody: [
          { f: 1318.51, d: 1.2 }, { f: 1479.98, d: 0.8 }, { f: 1661.22, d: 1.5 },
          { f: 1975.53, d: 1.5 }, { f: 1661.22, d: 1.0 }, { f: 1318.51, d: 2.0 },
          { f: 1108.73, d: 1.0 }, { f: 1244.51, d: 1.0 }, { f: 1318.51, d: 1.5 }, { f: 987.77, d: 0.8 },
          { f: 1318.51, d: 3.0 }
        ]
      }
    };

    this.currentTheme = this.zoneThemes['study'];

    // 向下相容既有自定義旋律陣列引用
    this.lullabyMelody = this.zoneThemes['study'].melody;
  }

  // 初始化音訊圖 (Audio Graph) 與程序化殘響節點
  init() {
    if (!this.ctx) {
      const AudioContext = (typeof window !== 'undefined') && (window.AudioContext || window.webkitAudioContext);
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.buildAudioGraph();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  buildAudioGraph() {
    if (!this.ctx) return;

    try {
      // 1. 總輸出 Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // 2. 乾音 Bus (Dry Bus)
      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.setValueAtTime(0.78, this.ctx.currentTime);
      this.dryGain.connect(this.masterGain);

      // 3. 程序化空間殘響 Bus (Convolution Reverb)
      try {
        this.reverbNode = this.createConvolver(2.4, 2.7);
        this.reverbFilter = this.ctx.createBiquadFilter();
        this.reverbFilter.type = 'lowpass';
        this.reverbFilter.frequency.setValueAtTime(3800, this.ctx.currentTime);

        this.reverbGain = this.ctx.createGain();
        this.reverbGain.gain.setValueAtTime(0.38, this.ctx.currentTime);

        this.reverbNode.connect(this.reverbFilter);
        this.reverbFilter.connect(this.reverbGain);
        this.reverbGain.connect(this.masterGain);
      } catch (err) {
        console.warn("AudioManager: Convolver unavailable, fallback to dry mode:", err);
        this.reverbNode = null;
      }

      // 4. 背景音樂子混音器 (BGM Sub-Mixer)
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.normalBgmVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.dryGain);
      if (this.reverbNode) {
        const bgmReverbSend = this.ctx.createGain();
        bgmReverbSend.gain.setValueAtTime(0.42, this.ctx.currentTime);
        this.bgmGain.connect(bgmReverbSend);
        bgmReverbSend.connect(this.reverbNode);
      }

      // 5. 特殊音效子混音器 (SFX Sub-Mixer)
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.sfxGain.connect(this.dryGain);
      if (this.reverbNode) {
        const sfxReverbSend = this.ctx.createGain();
        sfxReverbSend.gain.setValueAtTime(0.32, this.ctx.currentTime);
        this.sfxGain.connect(sfxReverbSend);
        sfxReverbSend.connect(this.reverbNode);
      }
    } catch (e) {
      console.warn("AudioManager: audio graph build warning:", e);
    }
  }

  // 演算法程序化生成高品質雙聲道音樂廳空間脈衝響應 (Stereo Impulse Response)
  createConvolver(duration = 2.4, decay = 2.7) {
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * duration);
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      const envelope = Math.pow(1 - n, decay);
      // 早期反射散射 + 晚期自然擴散立體聲解相關
      const noiseL = (Math.random() * 2 - 1);
      const noiseR = (Math.random() * 2 - 1);
      left[i] = noiseL * envelope;
      right[i] = noiseR * envelope;
    }

    const convolver = this.ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  // 空間場景切換：平滑切換專屬主題曲
  setZone(zoneId) {
    const mapping = {
      'zone1': 'study',
      'zone2': 'pastoral',
      'zone3': 'sanctuary',
      'zone4': 'pastoral',
      'zone5': 'voyage',
      'zone6': 'voyage',
      'zone7': 'celestial',
      'zone8': 'aurora',
      'zone9': 'celestial',
      'zone10': 'aurora'
    };
    const themeKey = mapping[zoneId] || 'study';
    if (this.currentThemeKey === themeKey) return;

    this.currentThemeKey = themeKey;
    this.currentTheme = this.zoneThemes[themeKey] || this.zoneThemes['study'];
    this.currentNoteIndex = 0;
    this.currentChordIndex = 0;
  }

  // 智慧教學音訊避讓 (Smart Audio Ducking)
  // 當外師朗讀或學生口說辨識啟動時，BGM 柔和自動降低至 30%，結束後自動平滑回升
  duckBgm(factor = 0.3, duration = 0.25) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;
    this.isDucked = true;
    const now = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.linearRampToValueAtTime(this.normalBgmVolume * factor, now + duration);
  }

  unduckBgm(duration = 0.6) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;
    this.isDucked = false;
    const now = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.linearRampToValueAtTime(this.normalBgmVolume, now + duration);
  }

  // 演奏主旋律八音盒/豎琴複音 (Lead Celesta & Bell Pluck)
  playMelodyNote(freq, duration = 1.0, isBass = false) {
    if (!this.ctx || this.isMuted || !this.bgmGain) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // 基礎正弦音 (基音)
    osc1.type = isBass ? 'triangle' : 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // 泛音八度微音程 (豐富晶瑩金屬音箱共鳴)
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * (isBass ? 0.5 : 2.002), now);

    // 低通濾波器消除刺耳高頻噪點
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isBass ? 800 : Math.min(freq * 3.5, 6000), now);

    const peakVolume = isBass ? 0.09 : 0.16;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(peakVolume, now + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.1, duration));

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.bgmGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // 演奏溫暖弦樂氛圍和弦墊 (Atmospheric Warm Pad)
  playChordPad(chordNotes, duration = 3.5) {
    if (!this.ctx || this.isMuted || !this.bgmGain || !chordNotes || chordNotes.length === 0) return;

    const now = this.ctx.currentTime;
    const padGain = this.ctx.createGain();
    const padFilter = this.ctx.createBiquadFilter();

    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(680, now);
    padFilter.frequency.linearRampToValueAtTime(850, now + duration * 0.4);
    padFilter.frequency.linearRampToValueAtTime(550, now + duration);

    // 慢啟動 (1.0s) 與長釋放 (1.6s) 帶來如交響樂團般的氣勢與流暢銜接
    padGain.gain.setValueAtTime(0.0001, now);
    padGain.gain.linearRampToValueAtTime(0.08, now + 1.0);
    padGain.gain.linearRampToValueAtTime(0.0001, now + duration);

    padFilter.connect(padGain);
    padGain.connect(this.bgmGain);

    chordNotes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = (idx % 2 === 0) ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // 微小立體聲失諧 (Detune $\pm 4$ cents)，創造溫暖厚度
      osc.detune.setValueAtTime((idx % 2 === 0) ? 4 : -4, now);
      osc.connect(padFilter);
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // 演奏低音大提琴深沉基底 (Warm Sub Bass)
  playBassNote(rootFreq, duration = 3.0) {
    if (!this.ctx || this.isMuted || !this.bgmGain || !rootFreq) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(rootFreq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  // 演奏晶瑩星塵風鈴琶音 (Sparkling Wind Chimes)
  playSparkleArpeggio(notes, delayMs = 90) {
    if (!this.ctx || this.isMuted || !this.bgmGain || !notes) return;

    const now = this.ctx.currentTime;
    notes.forEach((freq, i) => {
      const startTime = now + (i * delayMs) / 1000;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.06, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  }

  // 向下相容既有單音播放介面
  playMusicBoxNote(freq, duration = 1.0, isBass = false) {
    this.playMelodyNote(freq, duration, isBass);
  }

  startBgm() {
    this.init();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.scheduleNextBgmStep();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }

  toggleBgm() {
    this.init();
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  // 多軌音樂節奏調度器 (Multi-Track Musical Beat Scheduler)
  scheduleNextBgmStep() {
    if (!this.isBgmPlaying) return;

    const theme = this.currentTheme || this.zoneThemes['study'];
    const melody = theme.melody;
    const chords = theme.chords;
    const tempoMs = theme.tempoMs || 760;

    const note = melody[this.currentNoteIndex];
    const noteDuration = note.d * (tempoMs / 1000) * 1.5;

    // 1. 播放主旋律音符
    this.playMelodyNote(note.f, noteDuration, false);

    // 2. 每 4 個音符或小節頭觸發溫暖和弦墊與低音
    if (this.currentNoteIndex % 4 === 0 && chords.length > 0) {
      const chord = chords[this.currentChordIndex];
      const chordDuration = (tempoMs * 4 * 1.25) / 1000;
      this.playChordPad(chord.notes, chordDuration);
      this.playBassNote(chord.root, chordDuration);
      this.currentChordIndex = (this.currentChordIndex + 1) % chords.length;
    }

    // 3. 每 8 個音符或特定樂句段落飄落精靈星塵風鈴
    if (this.currentNoteIndex % 8 === 0) {
      const sparkleNotes = [note.f * 2, note.f * 2.5, note.f * 3, note.f * 4];
      this.playSparkleArpeggio(sparkleNotes, 85);
    }

    this.currentNoteIndex = (this.currentNoteIndex + 1) % melody.length;

    const delayMs = note.d * tempoMs;
    this.bgmTimeout = setTimeout(() => {
      this.scheduleNextBgmStep();
    }, delayMs);
  }

  // 重構極致高質感遊戲音效 (Remastered High-Fidelity SFX)
  playSfx(type) {
    this.init();
    if (this.isMuted || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    switch (type) {
      case 'magicSuccess': {
        // 成功音效：多八度水晶琶音 + 溫暖次低音重擊 + 璀璨空間殘響尾韻
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.065);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.065);
          gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.065 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.065 + 1.2);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now + idx * 0.065);
          osc.stop(now + idx * 0.065 + 1.2);
        });

        // 溫和次低音魔法共振 (Sub-bass impact)
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(95, now);
        subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.5);

        subGain.gain.setValueAtTime(0.18, now);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        subOsc.connect(subGain);
        subGain.connect(this.sfxGain);
        subOsc.start(now);
        subOsc.stop(now + 0.6);
        break;
      }

      case 'interact': {
        // 互動調查：細緻雙音水晶鈴 (E6 -> B6) 帶有悠揚殘響
        [1318.51, 1975.53].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.16, now + idx * 0.07 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.55);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.55);
        });
        break;
      }

      case 'pickup': {
        // 獲得道具：大三度和弦跳躍 (A4 -> C#5 -> E5)
        [440.00, 554.37, 659.25].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
          gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.06 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.6);
        });
        break;
      }

      case 'click': {
        // 點擊 UI：清脆軟木觸感 (Acoustic Keytap)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(2.0, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'doorOpen': {
        // 開門震撼：低頻石造滑動隆隆聲 (Cinematic Sub Rumble)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(55, now);
        osc1.frequency.linearRampToValueAtTime(40, now + 2.2);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(80, now);
        osc2.frequency.linearRampToValueAtTime(50, now + 2.0);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.3);
        osc2.stop(now + 2.3);
        break;
      }

      case 'potionMix': {
        // 調配藥水：魔力液體晶透氣泡 (Fluid Resonance)
        [0, 0.07, 0.15, 0.22, 0.30].forEach((offset, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'sine';
          const startF = 450 + i * 160;
          const endF = 950 + i * 120;
          osc.frequency.setValueAtTime(startF, now + offset);
          osc.frequency.exponentialRampToValueAtTime(endF, now + offset + 0.09);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(endF, now + offset);
          filter.Q.setValueAtTime(3.0, now + offset);

          gain.gain.setValueAtTime(0.14, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.11);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now + offset);
          osc.stop(now + offset + 0.11);
        });
        break;
      }

      case 'zoneTravel': {
        // 傳送門穿越音效：星界微風與晶石旋風呼嘯 (Star Portal Whoosh)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.8);
        osc.frequency.exponentialRampToValueAtTime(220, now + 1.8);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(350, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 0.8);
        filter.frequency.exponentialRampToValueAtTime(300, now + 1.8);
        filter.Q.setValueAtTime(4.0, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 1.8);
        break;
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.audioManager = new AudioManager();
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioManager;
}
