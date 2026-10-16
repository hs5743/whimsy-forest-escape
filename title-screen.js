/* Platform tabs for the illustrated adventure guide. */
(() => {
  const modes = ['desktop', 'touch'];
  window.selectGuidePlatform = mode => {
    if (!modes.includes(mode)) return;
    modes.forEach(value => {
      const active = value === mode;
      const tab = document.getElementById(value === 'desktop' ? 'guideDesktopTab' : 'guideTouchTab');
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(value === 'desktop' ? 'guideDesktop' : 'guideTouch').hidden = !active;
    });
  };
  const init = () => {
    window.selectGuidePlatform(matchMedia('(pointer: coarse)').matches ? 'touch' : 'desktop');
    document.querySelector('.guide-tabs').addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const mode = event.key === 'Home' ? 'desktop' : event.key === 'End' ? 'touch' : document.getElementById('guideDesktopTab').getAttribute('aria-selected') === 'true' ? 'touch' : 'desktop';
      window.selectGuidePlatform(mode);
      document.getElementById(mode === 'desktop' ? 'guideDesktopTab' : 'guideTouchTab').focus();
    });
    document.getElementById('instructionsModal').setAttribute('aria-labelledby', 'guideTitle');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

// Keep a slow or failed script load from exposing an empty game canvas, and support 2D fallback & retry.
function syncBootReadiness() {
  if (!window.world3D && typeof World3D === 'function') {
    try { window.world3D = new World3D(); } catch (e) { console.warn('World3D boot retry failed:', e); }
  }
  const w = window.world3D;
  const ready = !!(w && (w.renderer || w.zoneManager));
  for (const id of ['btnCoverStartJourney', 'btnCoverDirectPlay', 'btnEnterGameFinal']) {
    const el = document.getElementById(id);
    if (el) el.disabled = !ready;
  }
  const statusEl = document.getElementById('assetLoadStatus');
  const retryBtn = document.getElementById('btnBootRetry');
  if (!ready) {
    if (statusEl) statusEl.textContent = '3D 魔法世界未能啟動（可能為網路中斷或瀏覽器未開啟 WebGL 硬體加速），請點擊下方重新準備。';
    if (retryBtn) retryBtn.hidden = false;
  } else if (w.isFallback2D) {
    if (statusEl) statusEl.textContent = '已自動啟用「2D 圖卡互動模式」（此裝置未開啟 WebGL 3D 加速，可使用圖卡練習英語與探索線索）。';
    if (retryBtn) retryBtn.hidden = false;
  } else {
    w.zoneManager?.updateLoadStatus?.();
    if (retryBtn) retryBtn.hidden = true;
  }
  return ready;
}
window.retryBootWorld = () => {
  const statusEl = document.getElementById('assetLoadStatus');
  if (statusEl) statusEl.textContent = '正在重新準備魔法世界與場景素材…';
  if (window.world3D?.zoneManager && typeof window.world3D.zoneManager.retryTextures === 'function') {
    window.world3D.zoneManager.retryTextures();
  }
  const ok = syncBootReadiness();
  if (!ok && typeof World3D === 'function') {
    try {
      window.world3D = new World3D();
    } catch (_) {}
  }
  if (window.world3D?.isFallback2D) {
    window.world3D.tryRestore3D?.();
    window.world3D.renderFallback2DPanel?.();
  }
  return syncBootReadiness();
};
window.addEventListener('load', syncBootReadiness);
