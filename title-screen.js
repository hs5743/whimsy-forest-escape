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
    selectGuidePlatform(matchMedia('(pointer: coarse)').matches ? 'touch' : 'desktop');
    document.querySelector('.guide-tabs').addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const mode = event.key === 'Home' ? 'desktop' : event.key === 'End' ? 'touch' : document.getElementById('guideDesktopTab').getAttribute('aria-selected') === 'true' ? 'touch' : 'desktop';
      selectGuidePlatform(mode);
      document.getElementById(mode === 'desktop' ? 'guideDesktopTab' : 'guideTouchTab').focus();
    });
    document.getElementById('instructionsModal').setAttribute('aria-labelledby', 'guideTitle');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

// Keep a slow or failed script load from exposing an empty game canvas.
window.addEventListener('load', () => {
  const ready = !!window.world3D?.renderer;
  for (const id of ['btnCoverStartJourney', 'btnCoverDirectPlay', 'btnEnterGameFinal']) document.getElementById(id).disabled = !ready;
  if (!ready) {
    document.getElementById('assetLoadStatus').textContent = '魔法世界未能啟動，請檢查連線後重新準備。';
    document.getElementById('btnBootRetry').hidden = false;
  }
});
