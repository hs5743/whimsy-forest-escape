// 高階音效與多軌交響/八音盒背景音樂管理器 (AudioManager)
// 基於 Web Audio API 純程序化即時音訊合成，具備程序化空間殘響 (Convolution Reverb)、
// 溫暖弦樂和弦墊 (Atmospheric Warm Pad)、多音色鈴蘭主旋律與十界場景專屬主題音樂 (Zone-Themed Soundtracks)
// 使用瀏覽器 Web Audio 合成原創音樂，不需要下載外部曲目。

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
    this.volumeSettings = GamePolish.loadSettings(window.localStorage);
    this.normalBgmVolume = 0.22 * this.volumeSettings.music;
    this.bgmTimeout = null;

    this.zoneThemes = window.SceneMusic.themes;
    this.currentThemeKey = 'zone1';
    this.currentTheme = this.zoneThemes.zone1;
    this.musicBus = null;
    this.retiringMusicBuses = [];
    this.musicStep = 0;
    this.nextMusicTime = 0;
    this.manualBgmChoice = false;
    try { this.manualBgmChoice = window.localStorage?.getItem('eme.musicEnabled') === 'off'; } catch (_) {}
    this.duckFactor = 1;
    window.document?.addEventListener('visibilitychange', () => {
      if (!this.isBgmPlaying) return;
      this.clearMusicTimer();
      this.retireMusicBus(this.musicBus, .3);
      this.musicBus = null;
      if (!window.document.hidden) this.beginMusicPhrase();
    });
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
      this.ctx.resume()?.catch(() => { this.stopBgm(); });
    }
  }

  buildAudioGraph() {
    if (!this.ctx) return;

    try {
      // 1. 總輸出 Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85 * this.volumeSettings.master, this.ctx.currentTime);
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
      this.bgmGain.gain.setValueAtTime(this.normalBgmVolume * this.duckFactor, this.ctx.currentTime);
      this.bgmGain.connect(this.dryGain);
      if (this.reverbNode) {
        const bgmReverbSend = this.ctx.createGain();
        bgmReverbSend.gain.setValueAtTime(0.42, this.ctx.currentTime);
        this.bgmGain.connect(bgmReverbSend);
        bgmReverbSend.connect(this.reverbNode);
      }

      // 5. 特殊音效子混音器 (SFX Sub-Mixer)
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.35 * this.volumeSettings.effects, this.ctx.currentTime);
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

  // Each scene has its own score; crossfade buses isolate old notes from new notes.
  setZone(zoneId) {
    const key = this.zoneThemes[zoneId] ? zoneId : 'zone1';
    if (this.currentThemeKey === key) return;
    this.currentThemeKey = key;
    this.currentTheme = this.zoneThemes[key];
    this.musicStep = 0;
    this.syncMusicLabel();
    if (this.isBgmPlaying) {
      this.clearMusicTimer();
      this.retireMusicBus(this.musicBus, 1.1);
      this.musicBus = null;
      this.beginMusicPhrase();
    }
  }

  // 智慧教學音訊避讓 (Smart Audio Ducking)
  // 當外師朗讀或學生口說辨識啟動時，BGM 柔和自動降低至 30%，結束後自動平滑回升
  applyVolumes(settings) {
    this.volumeSettings = settings; this.normalBgmVolume = .22 * settings.music;
    if(!this.ctx) return;
    const now=this.ctx.currentTime;
    for(const [node, value] of [[this.masterGain,.85*settings.master],[this.sfxGain,.35*settings.effects],[this.bgmGain,this.normalBgmVolume*this.duckFactor]]) {
      if(node) {node.gain.cancelScheduledValues(now);node.gain.setTargetAtTime(value,now,.04);}
    }
  }

  duckBgm(factor = 0.3, duration = 0.25) {
    this.isDucked = true;
    this.duckFactor = factor;
    if (!this.ctx || !this.bgmGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.linearRampToValueAtTime(this.normalBgmVolume * factor, now + duration);
  }

  unduckBgm(duration = 0.6) {
    this.isDucked = false;
    this.duckFactor = 1;
    if (!this.ctx || !this.bgmGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.linearRampToValueAtTime(this.normalBgmVolume, now + duration);
  }

  syncMusicLabel() {
    const doc = window.document;
    const label = doc?.getElementById('bgmThemeLabel');
    if (label) label.textContent = this.currentTheme.name + ' · ' + this.currentTheme.style;
    const status = doc?.getElementById('bgmStatusLabel');
    if (status) status.textContent = this.isBgmPlaying ? '播放中（點擊關閉）' : '已關閉（點擊播放）';
    const icon = doc?.getElementById('bgmIcon');
    if (icon) icon.textContent = this.isBgmPlaying ? '🔊' : '🔇';
  }

  clearMusicTimer() {
    if (this.bgmTimeout !== null) clearTimeout(this.bgmTimeout);
    this.bgmTimeout = null;
  }

  retireMusicBus(bus, seconds) {
    if (!bus || bus.retired) return;
    bus.retired = true;
    const now = this.ctx.currentTime;
    bus.gain.gain.cancelScheduledValues(now);
    bus.gain.gain.setValueAtTime(bus.gain.gain.value, now);
    bus.gain.gain.linearRampToValueAtTime(0, now + seconds);
    for (const osc of bus.voices) osc.stop(now + seconds + .04);
    if (!bus.voices.size) bus.gain.disconnect();
    this.retiringMusicBuses = this.retiringMusicBuses.filter(b => b.voices.size);
    this.retiringMusicBuses.push(bus);
    // Rapid scene changes may retain at most two fading phrases.
    while (this.retiringMusicBuses.length > 2) {
      const oldest = this.retiringMusicBuses.shift();
      oldest.gain.disconnect();
      for (const osc of oldest.voices) osc.stop(now);
    }
  }

  beginMusicPhrase() {
    if (!this.ctx || !this.bgmGain || !this.isBgmPlaying || window.document?.hidden) return;
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + 1.1);
    gain.connect(this.bgmGain);
    this.musicBus = {gain, voices:new Set(), retired:false};
    this.nextMusicTime = now + .04;
    this.scheduleNextBgmStep();
  }

  playScoreTone(event, when, bus) {
    if (!bus || bus.retired || (!bus.offline && bus.voices.size >= 96)) return;
    const voice = window.SceneMusic.voices[event.voice];
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const blend = this.ctx.createGain();
    const first = this.ctx.createOscillator();
    const second = this.ctx.createOscillator();
    const duration = event.duration + voice.release;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(voice.cutoff, when);
    blend.gain.setValueAtTime(voice.blend, when);
    first.type = voice.wave; second.type = voice.overtone;
    first.frequency.setValueAtTime(event.frequency, when);
    second.frequency.setValueAtTime(event.frequency * voice.ratio, when);
    gain.gain.setValueAtTime(.0001, when);
    gain.gain.linearRampToValueAtTime(event.level, when + voice.attack);
    gain.gain.exponentialRampToValueAtTime(.0001, when + Math.max(duration,voice.attack+.05));
    first.connect(filter); second.connect(blend); blend.connect(filter); filter.connect(gain);
    const pan = this.ctx.createStereoPanner?.();
    if (pan) {pan.pan.setValueAtTime(event.pan,when);gain.connect(pan);pan.connect(bus.gain);} else gain.connect(bus.gain);
    let ended = 0;
    for (const osc of [first,second]) {
      bus.voices.add(osc);
      osc.onended = () => {
        bus.voices.delete(osc); osc.disconnect();
        if (++ended === 2) {gain.disconnect();filter.disconnect();blend.disconnect();pan?.disconnect();}
        if (bus.retired && !bus.voices.size) bus.gain.disconnect();
      };
      osc.start(when);osc.stop(when + duration + .02);
    }
  }

  // Short lookahead uses the audio clock, avoiding browser timer rhythm drift.
  scheduleNextBgmStep() {
    if (!this.isBgmPlaying || !this.musicBus || window.document?.hidden) return;
    const now = this.ctx.currentTime;
    if (this.nextMusicTime < now - .15) this.nextMusicTime = now + .04;
    while (this.nextMusicTime < now + .12) {
      const plan = window.SceneMusic.events(this.currentTheme, this.musicStep++);
      if (!this.isMuted) for (const event of plan.events) this.playScoreTone(event,this.nextMusicTime,this.musicBus);
      this.nextMusicTime += plan.stepSeconds;
    }
    this.bgmTimeout = setTimeout(() => {this.bgmTimeout=null;this.scheduleNextBgmStep();},25);
  }

  playMusicBoxNote(freq, duration = 1, isBass = false) {
    if(this.musicBus && !this.isMuted) this.playScoreTone({frequency:freq,voice:isBass?'bass':'bell',duration,level:.1,pan:0},this.ctx.currentTime,this.musicBus);
  }

  startBgm() {
    this.init();
    if (!this.ctx || !this.bgmGain || this.isBgmPlaying) return false;
    this.isBgmPlaying = true;
    this.beginMusicPhrase();
    this.syncMusicLabel();
    return true;
  }

  stopBgm() {
    this.isBgmPlaying = false;
    this.clearMusicTimer();
    this.retireMusicBus(this.musicBus,.3);
    this.musicBus = null;
    this.syncMusicLabel();
  }

  toggleBgm() {
    this.manualBgmChoice = true;
    if (this.isBgmPlaying) this.stopBgm(); else this.startBgm();
    try { window.localStorage?.setItem('eme.musicEnabled',this.isBgmPlaying ? 'on' : 'off'); } catch (_) {}
    return this.isBgmPlaying;
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
