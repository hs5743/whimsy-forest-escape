// 音效與溫馨八音盒背景音樂管理器 (AudioManager)
// 基於 Web Audio API 純程序化合成，完全零外部音效檔依賴，跨平台且支援平板節省流量

class AudioManager {
  constructor() {
    this.ctx = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.isBgmPlaying = false;
    this.isMuted = false;
    this.bgmTimeout = null;
    this.currentNoteIndex = 0;

    // 溫馨八音盒旋律 (葬送的芙莉蓮 / 童趣森林 悠閒風格 C大調/G大調旋律)
    this.lullabyMelody = [
      { f: 523.3, d: 0.8 }, { f: 659.3, d: 0.8 }, { f: 784.0, d: 1.2 }, { f: 659.3, d: 0.6 },
      { f: 587.3, d: 0.8 }, { f: 440.0, d: 0.8 }, { f: 523.3, d: 1.6 },
      { f: 392.0, d: 0.8 }, { f: 440.0, d: 0.8 }, { f: 523.3, d: 0.8 }, { f: 659.3, d: 0.8 },
      { f: 587.3, d: 2.0 },
      { f: 523.3, d: 0.8 }, { f: 659.3, d: 0.8 }, { f: 784.0, d: 1.2 }, { f: 880.0, d: 0.6 },
      { f: 784.0, d: 0.8 }, { f: 659.3, d: 0.8 }, { f: 523.3, d: 1.6 },
      { f: 440.0, d: 0.8 }, { f: 523.3, d: 0.8 }, { f: 587.3, d: 0.8 }, { f: 493.9, d: 0.8 },
      { f: 523.3, d: 2.4 }
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 播放純音或八音盒和弦音
  playMusicBoxNote(freq, duration = 1.0, isBass = false) {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isBass ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    const peakVolume = isBass ? 0.08 : 0.15;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peakVolume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + duration);
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

  scheduleNextBgmStep() {
    if (!this.isBgmPlaying) return;

    const note = this.lullabyMelody[this.currentNoteIndex];
    this.playMusicBoxNote(note.f, note.d * 1.5, false);

    // 偶數拍配上柔和低音根音
    if (this.currentNoteIndex % 2 === 0) {
      this.playMusicBoxNote(note.f * 0.5, note.d * 2.0, true);
    }

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.lullabyMelody.length;

    const delayMs = note.d * 750;
    this.bgmTimeout = setTimeout(() => {
      this.scheduleNextBgmStep();
    }, delayMs);
  }

  // 特殊音效
  playSfx(type) {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;

    switch (type) {
      case 'magicSuccess': {
        // 成功音效：清脆向上琶音 (C5, E5, G5, C6) + 魔法泛音
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.9);
        });
        break;
      }

      case 'interact': {
        // 互動調查：輕巧的水晶叮鈴
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case 'pickup': {
        // 獲得道具：溫暖向上跳音
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case 'click': {
        // 點擊UI：清爽軟木按鍵聲
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case 'doorOpen': {
        // 開門震撼：低沈溫和石門隆隆聲
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(70, now + 2.0);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 2.2);
        break;
      }

      case 'potionMix': {
        // 調配藥水：魔力泡泡聲音
        [0, 0.08, 0.16, 0.24].forEach((offset, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(500 + i * 150, now + offset);
          osc.frequency.exponentialRampToValueAtTime(900 + i * 100, now + offset + 0.1);

          gain.gain.setValueAtTime(0.12, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now + offset);
          osc.stop(now + offset + 0.12);
        });
        break;
      }
    }
  }
}

window.audioManager = new AudioManager();
