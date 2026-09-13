// RPG 即時雷達小地圖管理器 (MinimapManager)
// 支援即時 2D Canvas 渲染、地勢建築輪廓、玩家坐標與視野朝向錐 (FOV)、POI 發光標記與傳送門

class MinimapManager {
  constructor(world) {
    this.world = world;
    this.canvas = null;
    this.ctx = null;
    this.size = 140; // 預設畫布寬高
    this.scale = 4.2; // 縮放係數 (像素/米)
    this.container = null;
    this.lastRenderTime = 0;
    this.fpsLimit = 25; // 限制 25 FPS 以節省平板/手機電力
    this.isCollapsed = false;

    this.initDOM();
  }

  initDOM() {
    // 建立小地圖外容器
    let container = document.getElementById('minimapContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'minimapContainer';
      container.className = 'minimap-wrapper';
      container.innerHTML = `
        <div class="minimap-header">
          <div class="minimap-title-wrap" onclick="toggleWorldMapModal()" title="點擊展開大地圖世界">
            <span id="minimapZoneName" class="minimap-zone-title">🏰 見習書齋</span>
            <span class="minimap-expand-hint">🗺️ 大地圖</span>
          </div>
          <button id="minimapToggleBtn" class="minimap-toggle-btn" type="button" title="收合/展開小地圖" onclick="if(window.world3D && window.world3D.minimap) window.world3D.minimap.toggleCollapse(event)">▾</button>
        </div>
        <div class="minimap-frame" onclick="toggleWorldMapModal()" title="點擊展開大地圖世界">
          <canvas id="minimapCanvas" width="140" height="140"></canvas>
          <div class="minimap-compass-n">N</div>
          <div class="minimap-crosshair-center"></div>
        </div>
        <div class="minimap-coord-bar">
          <span id="minimapCoords">X: 0.0 | Z: 2.5</span>
        </div>
      `;
      document.body.appendChild(container);
    }

    this.container = container;
    this.canvas = document.getElementById('minimapCanvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.size = this.canvas.width;
    }
  }

  toggleCollapse(e) {
    if (e) e.stopPropagation();
    this.isCollapsed = !this.isCollapsed;
    if (this.container) {
      if (this.isCollapsed) {
        this.container.classList.add('minimap-collapsed');
      } else {
        this.container.classList.remove('minimap-collapsed');
      }
    }
    const btn = document.getElementById('minimapToggleBtn');
    if (btn) {
      btn.textContent = this.isCollapsed ? '▴' : '▾';
    }
  }

  // 取得當前空間 POI 互動標記清單
  getZonePoiList() {
    const zm = this.world.zoneManager;
    const curZone = zm ? zm.currentZoneId : 'zone1';

    // 依空間定義 POI 地理坐標與圖標
    const poiDict = {
      'zone1': [
        { x: 0, z: -3.8, label: '書桌/魔導書', icon: '📖', color: '#f59e0b' },
        { x: 1.2, z: -3.8, label: '古銅燭台', icon: '🕯️', color: '#facc15' },
        { x: -3.4, z: 0.3, label: '元素煉金台', icon: '⚗️', color: '#ec4899' },
        { x: 4.8, z: -1.5, label: '貓咪寶箱怪', icon: '🐱', color: '#38bdf8' },
        { x: 0, z: 5.6, label: '遠古石門', icon: '🚪', color: '#10b981', isPortal: true },
        { x: 0, z: 12.0, label: '蒼月花田/往市集', icon: '🌸', color: '#3b82f6', isPortal: true }
      ],
      'zone2': [
        { x: -4.5, z: -1.0, label: '紅蘋果攤', icon: '🍎', color: '#ef4444' },
        { x: 4.2, z: 1.2, label: '金香蕉攤', icon: '🍌', color: '#eab308' },
        { x: -3.2, z: -5.2, label: '烤麵包車', icon: '🥖', color: '#b45309' },
        { x: 3.5, z: -3.5, label: '鮮牛奶車', icon: '🥛', color: '#60a5fa' },
        { x: 6.8, z: -8.0, label: '要塞城門/往花園', icon: '🏰', color: '#10b981', isPortal: true },
        { x: 0.0, z: 10.5, label: '城鎮驛站/往書齋', icon: '🚪', color: '#a855f7', isPortal: true }
      ],
      'zone3': [
        { x: -0.5, z: -1.2, label: '活泉噴泉', icon: '⛲', color: '#0ea5e9' },
        { x: 3.8, z: 0.6, label: '守護白兔', icon: '🐰', color: '#f472b6' },
        { x: -4.5, z: 1.5, label: '歌唱青鳥', icon: '🐦', color: '#38bdf8' },
        { x: 4.8, z: -4.5, label: '精靈古樹', icon: '🌳', color: '#22c55e' },
        { x: -6.5, z: -8.0, label: '古徑拱門/往操場', icon: '🌸', color: '#10b981', isPortal: true },
        { x: 0.0, z: 11.5, label: '花園門扉/往市集', icon: '🚪', color: '#a855f7', isPortal: true }
      ],
      'zone4': [
        { x: 0, z: -8.5, label: '足球門/足球', icon: '⚽', color: '#3b82f6' },
        { x: -7.3, z: 4.0, label: '起跑線加速', icon: '🏃', color: '#ef4444' },
        { x: 2.8, z: 3.2, label: '跳箱/跳躍區', icon: '🦘', color: '#f59e0b' },
        { x: 0, z: -14.5, label: 'LED記分大屏', icon: '📺', color: '#8b5cf6' },
        { x: -13.0, z: 0.0, label: '大主看台', icon: '🪑', color: '#64748b' },
        { x: 8.5, z: -6.0, label: '凱旋拱門/往車站', icon: '🏆', color: '#10b981', isPortal: true },
        { x: -7.5, z: 11.0, label: '入場合成門/往花園', icon: '🚪', color: '#a855f7', isPortal: true }
      ],
      'zone5': [
        { x: 5.2, z: -3.2, label: '蒸汽特快車', icon: '🚂', color: '#f59e0b' },
        { x: -2.8, z: -8.5, label: '天文時鐘塔', icon: '🕰️', color: '#38bdf8' },
        { x: -4.5, z: 1.0, label: '路燈長椅', icon: '🌅', color: '#eab308' },
        { x: 4.8, z: 2.2, label: '特快車登車門', icon: '✨', color: '#10b981', isPortal: true },
        { x: 0.0, z: -12.5, label: '海港貨運閘門/往海港', icon: '⚓', color: '#0284c7', isPortal: true },
        { x: -1.0, z: 12.0, label: '南側出站口/往操場', icon: '🚪', color: '#a855f7', isPortal: true }
      ],
      'zone6': [
        { x: -5.5, z: -2.0, label: '遠洋三桅帆船', icon: '🚢', color: '#0284c7' },
        { x: 3.8, z: -3.5, label: '巡邏小艇', icon: '🛶', color: '#f59e0b' },
        { x: 8.5, z: -5.5, label: '燈塔風向標', icon: '🌬️', color: '#38bdf8' },
        { x: 5.0, z: 2.2, label: '鮮美漁獲貨堆', icon: '🐟', color: '#06b6d4' },
        { x: 0.0, z: -10.5, label: '港灣觀景台', icon: '🌊', color: '#3b82f6' },
        { x: 0.0, z: -13.0, label: '海關凱旋門/往新世界', icon: '🚪', color: '#10b981', isPortal: true },
        { x: 8.5, z: -3.8, label: '雲霄星光空橋/往觀測站', icon: '🌟', color: '#facc15', isPortal: true },
        { x: 1.5, z: -5.0, label: '關卡主・瑪琳娜船長', icon: '👑', color: '#facc15', isGuardian: true },
        { x: 0.0, z: 12.0, label: '南側鐵道閘門/往車站', icon: '🚂', color: '#a855f7', isPortal: true }
      ],
      'zone7': [
        { x: 0.0, z: -6.5, label: '星穹折射望遠鏡', icon: '🔭', color: '#38bdf8' },
        { x: -6.5, z: -1.0, label: '遠古星辰羅盤儀', icon: '⭐', color: '#facc15' },
        { x: 6.5, z: -1.0, label: '蒼月潮汐日晷儀', icon: '🌙', color: '#93c5fd' },
        { x: -5.0, z: 4.0, label: '日冕三棱分光鏡', icon: '☀️', color: '#fbbf24' },
        { x: 5.0, z: 4.0, label: '雲海浮島祭壇', icon: '☁️', color: '#e2e8f0' },
        { x: 0.0, z: -12.5, label: '星界凱旋星門/往榮譽殿堂', icon: '🚪', color: '#10b981', isPortal: true },
        { x: -8.5, z: -3.8, label: '極光冰橋/往冰雪聖域', icon: '❄️', color: '#38bdf8', isPortal: true },
        { x: 1.5, z: -3.5, label: '關卡主・艾瑟爾賢者', icon: '👑', color: '#facc15', isGuardian: true },
        { x: 0.0, z: 11.8, label: '降落星光空橋/往海港', icon: '⚓', color: '#0284c7', isPortal: true }
      ],
      'zone8': [
        { x: 0.0, z: -6.5, label: '冰雪結晶風向儀 (SNOW)', icon: '❄️', color: '#38bdf8' },
        { x: -6.5, z: -1.0, label: '極寒玄冰方尖碑 (COLD)', icon: '🧊', color: '#0284c7' },
        { x: 6.5, z: -1.0, label: '冬之常青松 (WINTER)', icon: '🌲', color: '#93c5fd' },
        { x: -5.0, z: 4.0, label: '雪境雪精靈守護者 (WHITE)', icon: '⛄', color: '#f8fafc' },
        { x: 5.0, z: 4.0, label: '極光暖心魔法火爐 (WARM)', icon: '🔥', color: '#f59e0b' },
        { x: 0.0, z: -12.5, label: '極光寒霜冰階 (CLIMB)', icon: '🪜', color: '#a855f7', isPortal: true },
        { x: 1.5, z: -3.5, label: '關卡主・佛洛斯特長老', icon: '👑', color: '#facc15', isGuardian: true },
        { x: 0.0, z: 11.8, label: '降落極光冰橋/往觀測站', icon: '🔭', color: '#38bdf8', isPortal: true }
      ]
    };

    return poiDict[curZone] || [];
  }

  // 繪製當前空間的幾何地圖輪廓
  drawZoneGeometry(ctx, cx, cy, curZone) {
    const s = this.scale;

    ctx.save();
    ctx.translate(cx, cy);

    if (curZone === 'zone1') {
      // 見習書齋：室內長方形房間 (12m x 12m)
      ctx.fillStyle = '#fdf6e2';
      ctx.fillRect(-6 * s, -6 * s, 12 * s, 12 * s);
      ctx.strokeStyle = '#8c6d48';
      ctx.lineWidth = 2;
      ctx.strokeRect(-6 * s, -6 * s, 12 * s, 12 * s);

      // 書桌幾何
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-1.3 * s, -4.5 * s, 2.6 * s, 1.4 * s);

      // 調劑台
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-4.5 * s, -0.8 * s, 2.2 * s, 2.2 * s);

      // 書架
      ctx.fillStyle = '#78350f';
      ctx.fillRect(4.8 * s, -4.0 * s, 1.0 * s, 5.0 * s);

      // 南側花田 (石門以南)
      ctx.fillStyle = '#bbf7d0';
      ctx.fillRect(-5 * s, 6 * s, 10 * s, 12 * s);
      ctx.strokeStyle = '#22c55e';
      ctx.strokeRect(-5 * s, 6 * s, 10 * s, 12 * s);

    } else if (curZone === 'zone2') {
      // 陽光市集：中心鵝卵石街道與三面街屋
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(-14 * s, -14 * s, 28 * s, 28 * s);

      // 北側街屋
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-14 * s, -14 * s, 19 * s, 5.2 * s);

      // 西側街屋
      ctx.fillRect(-14 * s, -12 * s, 4.5 * s, 24 * s);

      // 南側街屋
      ctx.fillRect(-14 * s, 9.3 * s, 20 * s, 4.7 * s);

      // 東北城門防禦塔
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(4.5 * s, -11 * s, 1.5 * s, 4 * s);
      ctx.fillRect(8.0 * s, -11 * s, 6 * s, 4 * s);

    } else if (curZone === 'zone3') {
      // 守護花園：圓形綠茵與中央噴泉
      ctx.fillStyle = '#dcfce7';
      ctx.beginPath();
      ctx.arc(0, 0, 14 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 中央噴泉池 (半徑 2.6m)
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.arc(-0.5 * s, -1.2 * s, 2.6 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.stroke();

      // 精靈古樹冠
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(4.8 * s, -4.5 * s, 2.4 * s, 0, Math.PI * 2);
      ctx.fill();

    } else if (curZone === 'zone4') {
      // 活力操場：橢圓跑道與中央草皮
      ctx.fillStyle = '#f0fdf4';
      ctx.fillRect(-15 * s, -18 * s, 30 * s, 36 * s);

      // 紅色跑道外環
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4.8 * s;
      ctx.beginPath();
      // 西直道
      ctx.moveTo(-8.5 * s, 12 * s);
      ctx.lineTo(-8.5 * s, -12 * s);
      // 北彎道
      ctx.arc(0, -12 * s, 8.5 * s, Math.PI, 0, false);
      // 東直道
      ctx.lineTo(8.5 * s, 12 * s);
      // 南彎道
      ctx.arc(0, 12 * s, 8.5 * s, 0, Math.PI, false);
      ctx.stroke();

      // 中央足球草皮
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(-5.6 * s, -11.2 * s, 11.2 * s, 22.4 * s);

      // 西側大看台
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-15.5 * s, -14 * s, 4.5 * s, 28 * s);

    } else if (curZone === 'zone5') {
      // 星光車站：月台與平行雙軌鐵道
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-14 * s, -16 * s, 28 * s, 32 * s);

      // 西側候車大廳磚牆
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(-14 * s, -14 * s, 4.5 * s, 28 * s);

      // 月台主體
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-9.5 * s, -14 * s, 12.5 * s, 28 * s);

      // 鐵道路基
      ctx.fillStyle = '#334155';
      ctx.fillRect(3.0 * s, -18 * s, 5.0 * s, 36 * s);

      // 蒸汽火車車體
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(4.0 * s, -6.8 * s, 3.2 * s, 8.4 * s);

      // 天文時鐘塔
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-5.0 * s, -10.8 * s, 4.2 * s, 4.2 * s);

    } else if (curZone === 'zone6') {
      // 蔚藍海港：蔚藍海水底色 + 木棧道平台 + 大帆船 + 燈塔圓形
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-16 * s, -18 * s, 32 * s, 36 * s);

      // 木造碼頭主平台 (22m x 26m)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-10 * s, -13 * s, 22 * s, 26 * s);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-10 * s, -13 * s, 22 * s, 26 * s);

      // 西側大帆船輪廓 (長條與尖頭)
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(-11.5 * s, -8 * s, 5.4 * s, 16 * s);
      ctx.beginPath();
      ctx.moveTo(-11.5 * s, -8 * s);
      ctx.lineTo(-8.8 * s, -12 * s);
      ctx.lineTo(-6.1 * s, -8 * s);
      ctx.closePath();
      ctx.fill();

      // 東北側海岸燈塔 (八角/圓形石塔)
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(8.5 * s, -8.0 * s, 2.8 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(8.5 * s, -8.0 * s, 1.2 * s, 0, Math.PI * 2);
      ctx.fill();
    } else if (curZone === 'zone7') {
      // 雲頂星空觀測站：深邃宇宙星海底色 + 大理石柱廊 + 黃道十二宮星圖台 + 儀器陣列
      ctx.fillStyle = '#050814';
      ctx.fillRect(-18 * s, -18 * s, 36 * s, 36 * s);

      // 背景微光星芒 (Tiny stars)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const bgStars = [[-12, -10], [14, -8], [-10, 12], [11, 13], [-14, 0], [13, 2], [0, -15]];
      bgStars.forEach(([sx, sy]) => {
        ctx.fillRect(sx * s, sy * s, 1.5, 1.5);
      });

      // 下層圓形主浮島 (半徑 14.5m)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 14.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 外圍大理石迴廊欄杆圈 (Balustrade Ring, R = 13.8m)
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(0, 0, 13.8 * s, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 古典愛奧尼柱廊 (8根大理石柱, R = 11.5m)
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const cx = Math.cos(ang) * 11.5 * s;
        const cy = Math.sin(ang) * 11.5 * s;
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(cx, cy, 0.9 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 上層同心圓黃道十二宮觀星高台 (半徑 7.5m, 青金石青藍底色)
      ctx.fillStyle = '#172554';
      ctx.beginPath();
      ctx.arc(0, 0, 7.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 黃道十二宮金色同心圈與八芒星羅盤指針
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 5.0 * s, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * 4.8 * s, Math.sin(ang) * 4.8 * s);
        ctx.stroke();
      }

      // 1. SKY 望遠鏡基座與鏡筒 (北側, [0, -6.5])
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-1.8 * s, -7.8 * s, 3.6 * s, 2.6 * s);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, -6.5 * s, 1.2 * s, 0, Math.PI * 2);
      ctx.fill();
      // 鏡筒斜向
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-0.5 * s, -6.0 * s);
      ctx.lineTo(1.2 * s, -8.2 * s);
      ctx.stroke();

      // 2. STAR 遠古星羅盤儀 (西側, [-6.5, -1])
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(-6.5 * s, -1.0 * s, 1.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 3. MOON 蒼月日晷儀 (東側, [6.5, -1])
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(6.5 * s, -1.0 * s, 1.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#93c5fd';
      ctx.beginPath();
      ctx.arc(6.2 * s, -1.0 * s, 1.1 * s, -0.5 * Math.PI, 0.5 * Math.PI, false);
      ctx.fill();

      // 4. SUN 日冕分光三棱鏡 (西南, [-5, 4])
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-5.0 * s, 3.0 * s);
      ctx.lineTo(-3.8 * s, 4.8 * s);
      ctx.lineTo(-6.2 * s, 4.8 * s);
      ctx.closePath();
      ctx.fill();

      // 5. CLOUD 雲海風琴祭壇 (東南, [5, 4])
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(5.0 * s, 4.0 * s, 1.4 * s, 0, Math.PI * 2);
      ctx.fill();

      // 6. OPEN 雙拱星門 (南側, [0, -12.5])
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-2.2 * s, -13.0 * s, 4.4 * s, 1.0 * s);

    } else if (curZone === 'zone8') {
      // 極光冰雪聖域：極夜深邃青黑底色 + 鋸齒冰川浮島 + 翡翠紫羅蘭極光弧線 + 符文冰台 + 營火與遺跡
      ctx.fillStyle = '#020617';
      ctx.fillRect(-18 * s, -18 * s, 36 * s, 36 * s);

      // 極光輝光弧 (Aurora Arcs)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 3.2 * s;
      ctx.beginPath();
      ctx.arc(0, -18 * s, 16 * s, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.beginPath();
      ctx.arc(0, -22 * s, 18 * s, 0.25 * Math.PI, 0.75 * Math.PI);
      ctx.stroke();

      // 鋸齒不規則寒冰浮島多邊形主體 (Jagged Glacial Polygon, 16邊形)
      ctx.fillStyle = '#082f49';
      ctx.beginPath();
      const numPts = 16;
      const baseR = 14.2 * s;
      const jagRadii = [1.0, 0.94, 1.04, 0.96, 1.02, 0.92, 1.05, 0.95, 1.01, 0.93, 1.03, 0.95, 1.04, 0.91, 1.02, 0.95];
      for (let i = 0; i < numPts; i++) {
        const angle = (i / numPts) * Math.PI * 2;
        const r = baseR * jagRadii[i];
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 遠古風化遺跡殘柱 (6根雪染巨石柱, R = 11.2m)
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 + 0.3;
        const px = Math.cos(ang) * 11.2 * s;
        const py = Math.sin(ang) * 11.2 * s;
        ctx.fillStyle = '#475569';
        ctx.fillRect(px - 0.7 * s, py - 0.7 * s, 1.4 * s, 1.4 * s);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(px - 0.5 * s, py - 0.7 * s, 1.0 * s, 0.4 * s);
      }

      // 中央神聖冰霜符文台 (R = 6.5m)
      ctx.fillStyle = '#0c4a6e';
      ctx.beginPath();
      ctx.arc(0, 0, 6.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 符文六芒冰霜內芒
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * 5.0 * s, Math.sin(ang) * 5.0 * s);
        ctx.stroke();
      }

      // 1. SNOW 3D碎形雪花風向儀與冰晶祭壇 (北側, [0, -6.5])
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.arc(0.0 * s, -6.5 * s, 1.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 2. COLD 極寒玄冰方尖碑與鏈條碎屑 (西側, [-6.5, -1])
      ctx.fillStyle = '#0369a1';
      ctx.beginPath();
      ctx.moveTo(-6.5 * s, -2.5 * s);
      ctx.lineTo(-5.3 * s, -1.0 * s);
      ctx.lineTo(-6.5 * s, 0.5 * s);
      ctx.lineTo(-7.7 * s, -1.0 * s);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // 3. WINTER 冬之常青松 (東側, [6.5, -1])
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.arc(6.5 * s, -1.0 * s, 2.0 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(6.5 * s, -1.0 * s, 1.0 * s, 0, Math.PI * 2);
      ctx.fill();

      // 4. WHITE 圍巾雪人與小雪兔 (西南, [-5, 4])
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-5.0 * s, 4.0 * s, 1.3 * s, 0, Math.PI * 2);
      ctx.fill();
      // 紅色小圍巾點
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-5.0 * s, 4.0 * s, 0.5 * s, 0, Math.PI * 2);
      ctx.fill();

      // 5. WARM 極地營火、柴堆與鐵壺 (東南, [5, 4])
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(5.0 * s, 4.0 * s, 1.6 * s, 0, Math.PI * 2);
      ctx.fill();
      // 炭火微光
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(5.0 * s, 4.0 * s, 0.8 * s, 0, Math.PI * 2);
      ctx.fill();

      // 6. CLIMB 登頂冰階與雙巨石拱門 (南側, [0, -12.5])
      ctx.fillStyle = '#38bdf8';
      for (let st = 0; st < 3; st++) {
        ctx.fillRect(-1.6 * s, (-11.8 - st * 0.8) * s, 3.2 * s, 0.6 * s);
      }
    } else if (curZone === 'zone9') {
      // 星界萬神殿堂：深邃星海金輝底色 + 圓形萬神殿堂 + 8根科林斯大理石圓柱 + 智慧大書架 + 魔法大典 + 金羽書桌 + 沉思之泉 + 天秤儀 + 展翅天台
      ctx.fillStyle = '#090a1a';
      ctx.fillRect(-18 * s, -18 * s, 36 * s, 36 * s);

      // 外圍星光雲海環
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.arc(0, 0, 15.2 * s, 0, Math.PI * 2);
      ctx.stroke();

      // 主殿堂圓形大理石基台 (半徑 14.5m)
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(0, 0, 14.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 8 根科林斯大理石立柱 (半徑 11.8m)
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const px = Math.cos(ang) * 11.8 * s;
        const py = Math.sin(ang) * 11.8 * s;
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(px, py, 1.0 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 中央神聖同心幾何地坪與萬神天頂光束圈 (半徑 7.0m)
      ctx.fillStyle = '#312e81';
      ctx.beginPath();
      ctx.arc(0, 0, 7.0 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // 十二芒星射線
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * 6.5 * s, Math.sin(ang) * 6.5 * s);
        ctx.stroke();
      }

      // 1. LIBRARY 弧形大書架 (北側, [0, -6.5])
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(0, -6.5 * s, 2.2 * s, Math.PI * 0.8, Math.PI * 0.2, true);
      ctx.lineTo(1.8 * s, -6.5 * s);
      ctx.arc(0, -6.5 * s, 1.4 * s, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. READ 遠古懸浮魔法大典 (西側, [-6.5, -1])
      ctx.fillStyle = '#4338ca';
      ctx.fillRect(-7.5 * s, -1.8 * s, 2.0 * s, 1.6 * s);
      ctx.strokeStyle = '#a5b4fc';
      ctx.strokeRect(-7.5 * s, -1.8 * s, 2.0 * s, 1.6 * s);

      // 3. WRITE 金羽書寫台 (東側, [6.5, -1])
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(5.5 * s, -1.8 * s, 2.0 * s, 1.6 * s);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(6.5 * s, -1.0 * s, 0.4 * s, 0, Math.PI * 2);
      ctx.fill();

      // 4. THINK 深思水晶沉思之泉 (西南, [-5, 4])
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(-5.0 * s, 4.0 * s, 1.6 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 5. SMART 智慧賢者之冠天秤儀 (東南, [5, 4])
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(5.0 * s, 4.0 * s, 1.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.stroke();

      // 6. FLY 星界榮耀展翅天台 (正北, [0, -12.5])
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.moveTo(-2.5 * s, -12.5 * s);
      ctx.lineTo(0, -14.2 * s);
      ctx.lineTo(2.5 * s, -12.5 * s);
      ctx.lineTo(1.5 * s, -11.5 * s);
      ctx.lineTo(-1.5 * s, -11.5 * s);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  // 每幀更新小地圖 (由 World3D.animate 調用)
  update() {
    if (!this.canvas || !this.ctx || !this.world) return;

    const now = performance.now();
    if (now - this.lastRenderTime < 1000 / this.fpsLimit) return;
    this.lastRenderTime = now;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const s = this.scale;

    const player = this.world.player;
    if (!player) return;

    const px = player.pos.x;
    const pz = player.pos.z;
    const yaw = player.yaw;

    const zm = this.world.zoneManager;
    const curZone = zm ? zm.currentZoneId : 'zone1';
    const zoneInfo = zm ? zm.getCurrentZone() : { name: '見習學徒書齋', icon: '🏰' };

    // 1. 清空畫布 (圓形透明裁剪底色)
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    // 限制在圓形雷達視野內
    ctx.beginPath();
    ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2);
    ctx.clip();

    // 背景底色
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // 2. 世界幾何輪廓 (固定正北朝上，地圖中心對齊當前玩家)
    ctx.save();
    // 將世界座標以玩家為中心反向位移
    ctx.translate(cx - px * s, cy - pz * s);

    // 繪製格線 (每 5 米一道)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = -30; x <= 30; x += 5) {
      ctx.beginPath();
      ctx.moveTo(x * s, -30 * s);
      ctx.lineTo(x * s, 30 * s);
      ctx.stroke();
    }
    for (let z = -30; z <= 30; z += 5) {
      ctx.beginPath();
      ctx.moveTo(-30 * s, z * s);
      ctx.lineTo(30 * s, z * s);
      ctx.stroke();
    }

    // 繪製空間建築與地形幾何
    this.drawZoneGeometry(ctx, 0, 0, curZone);

    // 繪製 POI 互動標記與傳送門
    const pois = this.getZonePoiList();
    const timeSec = now * 0.003;

    pois.forEach(poi => {
      const ix = poi.x * s;
      const iz = poi.z * s;

      // 距離玩家距離
      const dist = Math.hypot(poi.x - px, poi.z - pz);
      const isNearby = dist < 3.5;

      // 外圍微光脈衝 (若為關卡主、傳送門或玩家靠近)
      if (poi.isGuardian) {
        ctx.beginPath();
        const pulseR = 11 + Math.sin(timeSec * 5) * 4;
        ctx.arc(ix, iz, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (poi.isPortal || isNearby) {
        ctx.beginPath();
        const pulseR = 9 + Math.sin(timeSec * 4) * 3;
        ctx.arc(ix, iz, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = poi.color ? `${poi.color}44` : 'rgba(16, 185, 129, 0.25)';
        ctx.fill();
      }

      // 實心節點
      ctx.beginPath();
      ctx.arc(ix, iz, poi.isPortal ? 5.5 : 4, 0, Math.PI * 2);
      ctx.fillStyle = poi.color || '#facc15';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 圖標文字
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(poi.icon, ix, iz - 3);
    });

    ctx.restore(); // 結束地圖世界位移

    // 3. 玩家視野錐 (FOV Cone)
    ctx.save();
    ctx.translate(cx, cy);

    // 視線扇形 (約 65 度視角)
    const fovHalf = 0.55;
    const fovLen = 34;
    // Three.js 視角: 0 朝向 -Z (地圖上方)
    const lookAngle = -yaw - Math.PI / 2;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, fovLen, lookAngle - fovHalf, lookAngle + fovHalf);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 玩家本體標記 (金色導向箭頭)
    ctx.rotate(lookAngle + Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 5);
    ctx.lineTo(0, 2.5);
    ctx.lineTo(-5, 5);
    ctx.closePath();
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore(); // 結束玩家繪製

    ctx.restore(); // 結束剪裁

    // 4. 外圈裝飾羅盤邊框
    ctx.beginPath();
    ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 5. 更新 DOM 標籤
    const nameEl = document.getElementById('minimapZoneName');
    if (nameEl) nameEl.textContent = `${zoneInfo.icon} ${zoneInfo.name}`;

    const coordEl = document.getElementById('minimapCoords');
    if (coordEl) coordEl.textContent = `X: ${px.toFixed(1)} | Z: ${pz.toFixed(1)}`;
  }
}

window.MinimapManager = MinimapManager;
