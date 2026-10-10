/* Local-only acceptance metrics. No telemetry or network submission. */
(function(root) {
  class FrameWindow {
    constructor(capacity = 1800) { if (!Number.isInteger(capacity) || capacity < 1) throw new RangeError('Frame capacity must be a positive integer'); this.values = new Float32Array(capacity); this.capacity = capacity; this.cursor = 0; this.count = 0; this.totalFrames = 0; this.longFrames = 0; this.totalMs = 0; }
    record(ms) {
      if (!Number.isFinite(ms) || ms <= 0) return;
      this.values[this.cursor] = ms; this.cursor = (this.cursor + 1) % this.capacity;
      this.count = Math.min(this.count + 1, this.capacity);
      this.totalFrames++; this.totalMs += ms; if (ms > 50) this.longFrames++;
    }
    summary() {
      const samples = Array.from(this.values.subarray(0, this.count)).sort((a,b) => a-b);
      const mean = samples.length ? samples.reduce((a,b) => a+b,0) / samples.length : 0;
      return { samples: samples.length, meanMs: +mean.toFixed(2), p95Ms: samples.length ? +samples[Math.ceil(samples.length*.95)-1].toFixed(2) : 0, totalFrames: this.totalFrames, longFrames: this.longFrames, observedSeconds: +(this.totalMs/1000).toFixed(1) };
    }
  }
  function sweepPlan(zones) {
    return [0,1,2].flatMap(round => zones.map(zone => ({zone,round,warmup:round === 0})));
  }
  const api = { FrameWindow, sweepPlan };
  if (typeof module !== 'undefined') module.exports = api;
  root.GameDiagnostics = api;
  if (!root.document) return;
  root.addEventListener('load', () => {
    const world = root.world3D;
    if (!world?.devMode) return;
    const frames = world.frameMetrics = new FrameWindow();
    const panel = root.document.getElementById('devZonePanel');
    const section = root.document.createElement('section');
    section.className = 'acceptance-tools';
    section.innerHTML = '<h3>穩定性檢查</h3><p>僅限本機預覽，不寫入學習成績。幀時間統計僅納入可見遊戲畫面。</p><output id="acceptanceStatus" aria-live="polite">尚未開始場景巡檢</output><div><button type="button" id="startSceneSoak">暖機＋巡檢十界兩輪</button><button type="button" id="stopSceneSoak" hidden>停止巡檢</button><button type="button" id="exportAcceptance">下載檢查紀錄</button></div>';
    panel.append(section);
    const status = section.querySelector('output');
    const start = section.querySelector('#startSceneSoak'), stop = section.querySelector('#stopSceneSoak');
    let active = false, runId = 0, samples = [], outcome = '尚未執行';
    const sample = () => ({ zone:world.zoneManager.currentZoneId, quality:world.graphicQuality, geometries:world.renderer.info.memory.geometries, textures:world.renderer.info.memory.textures, drawCalls:world.renderer.info.render.calls, frame:frames.summary() });
    const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));
    start.addEventListener('click', async () => {
      if (active) return;
      const cover = root.document.getElementById('gameCoverScreen');
      if (!cover.classList.contains('fade-out')) { status.textContent = '請先進入遊戲，再開始巡檢。'; return; }
      active = true; start.disabled = true; stop.hidden = false; samples = []; outcome = '執行中';
      const token = ++runId, originalZone = world.zoneManager.currentZoneId;
      const zones = Object.keys(world.zoneManager.zones);
      const plan = sweepPlan(zones);
      root.closeSystemMenu?.();
      try {
        for (let i=0;i<plan.length;i++) {
          if (!active || token !== runId) break;
          if (root.document.hidden) { outcome = '已中止：頁面切換至背景'; break; }
          world.closeSpeechCard(); world.switchZone(plan[i].zone);
          const deadline = performance.now()+18000;
          while ([...world.zoneManager.activeTextures].some(t=>world.zoneManager.textureStatus.get(t)==='loading') && performance.now()<deadline && active) await sleep(200);
          if (!active) break;
          await sleep(1000);
          if (!active || token !== runId) break;
          const result = sample();
          result.round = plan[i].round;
          result.warmup = plan[i].warmup;
          result.failedTextures = [...world.zoneManager.activeTextures].filter(t=>world.zoneManager.textureStatus.get(t)==='failed').length;
          samples.push(result); status.textContent = '巡檢 '+samples.length+' / '+plan.length+' · '+world.zoneManager.zones[result.zone].name;
        }
        if (outcome === '執行中') outcome = active && samples.length === plan.length ? '巡檢完成' : '已停止';
      } catch(error) { outcome = '巡檢中斷：'+error.message; }
      finally {
        active = false; start.disabled = false; stop.hidden = true;
        world.switchZone(originalZone);
        const select = root.document.getElementById('devZoneSelect'); if (select) select.value = originalZone;
        status.textContent = outcome+' · 共 '+samples.length+' 次切換。可下載紀錄比較同一場景的資源數量。';
        if (root.document.getElementById('systemMenuDrawer').style.display === 'none') root.document.getElementById('systemMenuBtn').click();
      }
    });
    stop.addEventListener('click', () => {active = false; outcome = '已停止'; status.textContent = '正在停止巡檢…';});
    section.querySelector('#exportAcceptance').addEventListener('click', () => {
      const report = { version:1, capturedAt:new Date().toISOString(), outcome, viewport:{width:root.innerWidth,height:root.innerHeight,pixelRatio:root.devicePixelRatio}, current:sample(), samples, limitations:'本機瀏覽器觀察；繪圖資源數不等於完整 GPU 記憶體；背景、封面和選單幀不納入；不能代替真實裝置、麥克風和 30 分鐘驗收。' };
      const url = URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));
      const link = root.document.createElement('a'); link.href=url; link.download='whimsy-acceptance.json'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
