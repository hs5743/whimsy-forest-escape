// 空間情境管理器 (SpatialZoneManager)
// 支援五大多元生活與奇幻空間動態切換：書齋、市集、花園、操場、車站
// 全面搭載高品質 AI 材質皮膚 (Cobblestone, Awning, Grass, Marble, Track, Brick, Clock, Locomotive)

class SpatialZoneManager {
  constructor(world) {
    this.world = world;
    this.currentZoneId = 'zone1';
    this.texturesLoaded = false;
    this.tex = {};

    this.zones = {
      'zone1': {
        id: 'zone1',
        name: '見習學徒書齋',
        englishName: 'Apprentice Study',
        icon: '🏰',
        topic: 'School & Prepositions',
        reqLevel: 1,
        desc: '古老而溫暖的魔法書齋，在此學習書本、燭光、鑰匙與方位介係詞。',
        words: ['LIGHT', 'BOOK', 'KEY', 'RED', 'BLUE', 'STAR', 'CAT', 'FISH', 'DOOR', 'FLOWER', 'OPEN', 'SUN'],
        spawnPos: [0, 1.6, 2.5],
        spawnYaw: 0
      },
      'zone2': {
        id: 'zone2',
        name: '陽光微風市集',
        englishName: 'Bazaar Marketplace',
        icon: '🍎',
        topic: 'Food, Numbers & Adjectives',
        reqLevel: 2,
        desc: '洋溢著果香與笑聲的戶外市集，在蔬果攤位與天平秤間學習食物與數字！',
        words: ['APPLE', 'BANANA', 'BREAD', 'MILK', 'SWEET', 'OPEN'],
        spawnPos: [0, 1.6, 3.5],
        spawnYaw: 0
      },
      'zone3': {
        id: 'zone3',
        name: '守護獸之森花園',
        englishName: 'Beast Sanctuary Garden',
        icon: '🐰',
        topic: 'Animals, Nature & Actions',
        reqLevel: 3,
        desc: '繁花盛開的精靈花園，圍繞著石造噴泉，與可愛兔子和飛鳥練習口說！',
        words: ['RABBIT', 'BIRD', 'TREE', 'WATER', 'OPEN'],
        spawnPos: [0, 1.6, 3.5],
        spawnYaw: 0
      },
      'zone4': {
        id: 'zone4',
        name: '活力冒險操場',
        englishName: 'Athletic Sports Field',
        icon: '⚽',
        topic: 'Sports, Actions & Body',
        reqLevel: 4,
        desc: '彩色旗幟飄揚的體育操場，沿著跑道挑戰運動指令，衝向終點冠軍拱門！',
        words: ['SOCCER', 'BALL', 'RUN', 'JUMP', 'OPEN'],
        spawnPos: [0, 1.6, 3.5],
        spawnYaw: 0
      },
      'zone5': {
        id: 'zone5',
        name: '星光鐘樓車站',
        englishName: 'Clocktower Train Station',
        icon: '🚂',
        topic: 'Time, Places & Transport',
        reqLevel: 5,
        desc: '暮色下佇立著巨型時鐘的復古車站，準備登上通往大魔導士殿堂的列車！',
        words: ['TIME', 'CLOCK', 'TRAIN', 'MORNING', 'OPEN'],
        spawnPos: [0, 1.6, 3.5],
        spawnYaw: 0
      }
    };

    this.initTextures();
  }

  // 初始化並快取 AI 寫實材質皮膚
  initTextures() {
    if (this.texturesLoaded) return;
    const loader = new THREE.TextureLoader();

    this.tex = {
      marketCobble: loader.load('assets/textures/tex-market-cobble.jpg'),
      marketAwning: loader.load('assets/textures/tex-market-awning.jpg'),
      gardenGrass: loader.load('assets/textures/tex-garden-grass.jpg'),
      marbleFountain: loader.load('assets/textures/tex-marble-fountain.jpg'),
      runningTrack: loader.load('assets/textures/tex-running-track.jpg'),
      stationBrick: loader.load('assets/textures/tex-station-brick.jpg'),
      clockFace: loader.load('assets/textures/tex-clocktower-face.jpg'),
      locomotive: loader.load('assets/textures/tex-locomotive-train.jpg'),
      stoneWall: loader.load('assets/textures/tex-stone-wall.jpg'),
      woodDesk: loader.load('assets/textures/tex-wood-desk.jpg'),
      woodFloor: loader.load('assets/textures/tex-wood-floor.jpg'),
      alchemySlate: loader.load('assets/textures/tex-alchemy-slate.jpg')
    };

    // 配置紋理重複與平鋪模式
    this.tex.marketCobble.wrapS = THREE.RepeatWrapping;
    this.tex.marketCobble.wrapT = THREE.RepeatWrapping;
    this.tex.marketCobble.repeat.set(7, 7);

    this.tex.marketAwning.wrapS = THREE.RepeatWrapping;
    this.tex.marketAwning.wrapT = THREE.RepeatWrapping;
    this.tex.marketAwning.repeat.set(2, 1);

    this.tex.gardenGrass.wrapS = THREE.RepeatWrapping;
    this.tex.gardenGrass.wrapT = THREE.RepeatWrapping;
    this.tex.gardenGrass.repeat.set(8, 8);

    this.tex.marbleFountain.wrapS = THREE.RepeatWrapping;
    this.tex.marbleFountain.wrapT = THREE.RepeatWrapping;
    this.tex.marbleFountain.repeat.set(2, 2);

    this.tex.runningTrack.wrapS = THREE.RepeatWrapping;
    this.tex.runningTrack.wrapT = THREE.RepeatWrapping;
    this.tex.runningTrack.repeat.set(6, 6);

    this.tex.stationBrick.wrapS = THREE.RepeatWrapping;
    this.tex.stationBrick.wrapT = THREE.RepeatWrapping;
    this.tex.stationBrick.repeat.set(5, 5);

    this.tex.stoneWall.wrapS = THREE.RepeatWrapping;
    this.tex.stoneWall.wrapT = THREE.RepeatWrapping;
    this.tex.stoneWall.repeat.set(4, 2);

    this.tex.woodDesk.wrapS = THREE.RepeatWrapping;
    this.tex.woodDesk.wrapT = THREE.RepeatWrapping;

    this.texturesLoaded = true;
  }

  // 取得目前空間資訊
  getCurrentZone() {
    return this.zones[this.currentZoneId] || this.zones['zone1'];
  }

  // 檢查空間是否已解鎖
  isZoneUnlocked(zoneId) {
    const zone = this.zones[zoneId];
    if (!zone) return false;
    const userLevel = (window.cloudSyncManager && window.cloudSyncManager.profile) 
      ? window.cloudSyncManager.profile.level 
      : 1;
    return userLevel >= zone.reqLevel;
  }

  // 切換至指定空間
  switchZone(zoneId) {
    if (!this.zones[zoneId]) return false;
    if (!this.isZoneUnlocked(zoneId)) {
      if (this.world) {
        this.world.showToast(`🔒 冒險者等級未達 Lv.${this.zones[zoneId].reqLevel}，請先完成前序空間！`);
      }
      return false;
    }

    this.currentZoneId = zoneId;
    const zone = this.zones[zoneId];

    // 清空現有場景物件與互動清單
    if (this.world.activeZoneGroup) {
      this.world.scene.remove(this.world.activeZoneGroup);
    }
    this.world.interactables = [];
    this.world.animators = [];
    this.world.hoveredObject = null;

    // 建立新的空間群組
    const group = new THREE.Group();
    this.world.activeZoneGroup = group;

    // 依空間 ID 建造專屬 3D 景致
    if (zoneId === 'zone1') {
      this.buildZone1_Study(group);
    } else if (zoneId === 'zone2') {
      this.buildZone2_Market(group);
    } else if (zoneId === 'zone3') {
      this.buildZone3_Garden(group);
    } else if (zoneId === 'zone4') {
      this.buildZone4_Athletic(group);
    } else if (zoneId === 'zone5') {
      this.buildZone5_Station(group);
    }

    this.world.scene.add(group);

    // 重設玩家生成點與朝向
    this.world.player.pos.set(...zone.spawnPos);
    this.world.player.yaw = zone.spawnYaw;
    this.world.player.pitch = 0;

    // 播放音效與歡迎提示
    if (window.audioManager) window.audioManager.playSfx('magicSuccess');
    if (this.world) {
      this.world.showToast(`🌟 抵達【${zone.name}】！主題：${zone.topic}`);
    }

    // 更新 HUD 空間標籤
    const tag = document.getElementById('hudCurrentZoneLabel');
    if (tag) tag.textContent = `${zone.icon} ${zone.name}`;

    return true;
  }

  // ==========================================
  // Zone 1: 見習學徒書齋 (Apprentice Study)
  // ==========================================
  buildZone1_Study(group) {
    this.world.buildAtelierRoom(group);
    this.world.buildProps(group);
    this.world.buildOutsideMeadow(group);
  }

  // ==========================================
  // Zone 2: 陽光微風市集 (Bazaar Marketplace)
  // ==========================================
  buildZone2_Market(group) {
    this.initTextures();

    // 1. 光照：溫暖金黃日光與天光
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.35);
    sunLight.position.set(12, 18, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xffedd5, 0x9a3412, 0.65);
    group.add(hemiLight);

    // 2. 地面：歐風陽光鵝卵石露天廣場 (AI 寫實鵝卵石皮膚)
    const groundGeo = new THREE.PlaneGeometry(28, 28);
    const groundMat = new THREE.MeshStandardMaterial({
      map: this.tex.marketCobble,
      roughness: 0.85,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    group.add(ground);

    // 3. 邊界：古石牆基底與木柵欄與轉角鐵藝燈柱
    this.buildMarketPerimeter(group, 14);

    // 4. 水果帳篷攤位 A (左側：蘋果與水果區 - APPLE)
    this.buildDetailedMarketStall(group, -4.5, 0, -1.2, 'apple', '🍎 甜美紅蘋果攤 (APPLE)', 'stall_apple', () => {
      this.world.openSpeechCard('APPLE', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_APPLE', '🍎 甜脆紅蘋果', '#ef4444');
      });
    });

    // 5. 水果帳篷攤位 B (右側：香蕉與黃色水果區 - BANANA)
    this.buildDetailedMarketStall(group, 4.5, 0, -1.2, 'banana', '🍌 活力金香蕉 (BANANA)', 'stall_banana', () => {
      this.world.openSpeechCard('BANANA', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_BANANA', '🍌 香甜金香蕉', '#eab308');
      });
    });

    // 6. 烘焙長棍手推車 (中央左側：BREAD)
    this.buildDetailedCart(group, -2.0, 0, -4.0, 'bread', '🥖 剛出爐的烤麵包 (BREAD)', 'cart_bread', () => {
      this.world.openSpeechCard('BREAD', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_BREAD', '🥖 麥香長法棍', '#b45309');
      });
    });

    // 7. 牧場鮮奶與蜂蜜推車 (中央右側：MILK)
    this.buildDetailedCart(group, 2.0, 0, -4.0, 'milk', '🥛 香濃鮮牛奶 (MILK)', 'cart_milk', () => {
      this.world.openSpeechCard('MILK', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_MILK', '🥛 牧場鮮牛奶', '#60a5fa');
      });
    });

    // 8. 攤位間彩色三角形慶典吊旗
    this.buildBuntingFlags(group, [-4.5, 2.7, -1.2], [4.5, 2.7, -1.2]);

    // 9. 出口通道：堅固石橋木造吊橋閘門 (OPEN)
    this.buildDrawbridgePortal(group, 0, 0, -7.0, '🏰 市集通往精靈花園的吊橋 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 恭喜！市集商人讚許你的英語發音，放下吊橋，解鎖前往花園！');
      this.switchZone('zone3');
    });

    // 市集陽光浮塵粒子
    this.addFloatingParticles(group, 0xffedd5, 120, 24, 5);
  }

  // ==========================================
  // Zone 3: 守護獸之森花園 (Beast Sanctuary Garden)
  // ==========================================
  buildZone3_Garden(group) {
    this.initTextures();

    // 1. 光照：晨曦柔和天光與林間光斑
    const sunLight = new THREE.DirectionalLight(0xfef9c3, 1.2);
    sunLight.position.set(8, 16, 6);
    sunLight.castShadow = true;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xdcfce7, 0x14532d, 0.75);
    group.add(hemiLight);

    // 2. 地面：童話野花繁生茵茵草坪 (AI 寫實草坪皮膚)
    const grassGeo = new THREE.PlaneGeometry(28, 28);
    const grassMat = new THREE.MeshStandardMaterial({
      map: this.tex.gardenGrass,
      roughness: 0.9,
      metalness: 0.02
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    group.add(grass);

    // 3. 鋪設弧形石板步道
    this.buildGardenStonePaths(group);

    // 4. 邊界：歐風白色石雕古典欄杆與轉角雕花石盆
    this.buildGardenBalustrade(group, 14);

    // 5. 散落草地的 3D 盛開小花叢
    this.buildScatteredFlowers(group);

    // 6. 中央雙層雕花大理石噴泉 (WATER)
    this.buildMarbleFountain(group, 0, 0, -0.5, '⛲ 清涼純淨的活泉水 (WATER)', 'poi_water', () => {
      this.world.openSpeechCard('WATER', () => {
        this.world.addXP(60);
      });
    });

    // 7. 草地上毛茸茸的白兔抱著胡蘿蔔 (RABBIT)
    this.buildSculptedRabbit(group, -3.8, 0, -1.8, '🐰 正在草地上蹦跳的兔子 (RABBIT)', 'RABBIT', () => {
      this.world.openSpeechCard('RABBIT', () => {
        this.world.addXP(70);
      });
    });

    // 8. 棲息於常春藤羅馬石柱上的歌唱青鳥 (BIRD)
    this.buildBirdOnPedestal(group, 3.8, 0, -1.8, '🐦 枝頭歌唱的青鳥 (BIRD)', 'BIRD', () => {
      this.world.openSpeechCard('BIRD', () => {
        this.world.addXP(70);
      });
    });

    // 9. 盤根錯節的千年精靈守護巨樹 (TREE)
    this.buildAncientWorldTree(group, -5.2, 0, 2.5, '🌳 茂密的精靈古樹 (TREE)', 'TREE', () => {
      this.world.openSpeechCard('TREE', () => {
        this.world.addXP(60);
      });
    });

    // 10. 出口通道：攀附盛開玫瑰的鐵藝拱門 (OPEN)
    this.buildRoseArchPortal(group, 0, 0, -7.0, '🌸 繁花纏繞的精靈拱門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 花園小精靈施展魔法推開拱門，解鎖前往操場！');
      this.switchZone('zone4');
    });

    // 綠意精靈螢火微光
    this.addFloatingParticles(group, 0x86efac, 140, 24, 4.5);
  }

  // ==========================================
  // Zone 4: 活力冒險操場 (Athletic Sports Field)
  // ==========================================
  buildZone4_Athletic(group) {
    this.initTextures();

    // 1. 光照：晴空萬里體育場日光
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(10, 22, 10);
    sunLight.castShadow = true;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x15803d, 0.7);
    group.add(hemiLight);

    // 2. 地面：外部紅色標準 PU 跑道 (AI 寫實跑道皮膚)
    const trackGeo = new THREE.PlaneGeometry(28, 28);
    const trackMat = new THREE.MeshStandardMaterial({
      map: this.tex.runningTrack,
      roughness: 0.82,
      metalness: 0.05
    });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.rotation.x = -Math.PI / 2;
    track.receiveShadow = true;
    group.add(track);

    // 3. 中央足球修剪綠茵草坪
    const innerTurfGeo = new THREE.PlaneGeometry(16, 16);
    const innerTurfMat = new THREE.MeshStandardMaterial({
      map: this.tex.gardenGrass,
      roughness: 0.85
    });
    const innerTurf = new THREE.Mesh(innerTurfGeo, innerTurfMat);
    innerTurf.rotation.x = -Math.PI / 2;
    innerTurf.position.y = 0.03;
    innerTurf.receiveShadow = true;
    group.add(innerTurf);

    // 草坪白色邊線與禁區劃線
    this.buildSoccerFieldLines(group);

    // 4. 四角體育館高聳照明燈塔與看台
    this.buildStadiumStructures(group, 14);

    // 5. 3D 擬真足球門與經典黑白五角皮革足球 (BALL / SOCCER)
    this.buildSoccerGoalAndBall(group, 0, 0, -4.5, '⚽ 草地上的足球 (SOCCER / BALL)', 'BALL', () => {
      this.world.openSpeechCard('BALL', () => {
        this.world.addXP(60);
      });
    });

    // 6. 跑道起跑線金屬助跑器與接力棒 (RUN)
    this.buildStartingBlocks(group, -4.2, 0, 0, '🏃 起跑線加速奔跑 (RUN)', 'RUN', () => {
      this.world.openSpeechCard('RUN', () => {
        this.world.addXP(60);
      });
    });

    // 7. 體育跳高安全海綿厚墊與木質跳箱 (JUMP)
    this.buildJumpEquipment(group, 4.2, 0, 0, '🦘 體育跳箱與跳躍 (JUMP)', 'JUMP', () => {
      this.world.openSpeechCard('JUMP', () => {
        this.world.addXP(60);
      });
    });

    // 8. 出口通道：金色凱旋桂冠勝利拱門 (OPEN)
    this.buildTrophyArchPortal(group, 0, 0, -7.0, '🏆 終點冠軍金色拱門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 裁判揮舞旗幟，恭喜突破體育操場，前往星光車站！');
      this.switchZone('zone5');
    });
  }

  // ==========================================
  // Zone 5: 星光鐘樓車站 (Clocktower Train Station)
  // ==========================================
  buildZone5_Station(group) {
    this.initTextures();

    // 1. 光照：深邃暮色與月台煤氣燈暖光
    const moonLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    moonLight.position.set(10, 18, -10);
    group.add(moonLight);

    const hemiLight = new THREE.HemisphereLight(0x312e81, 0x1e1b4b, 0.5);
    group.add(hemiLight);

    // 2. 地面：維多利亞月台復古紅磚 (AI 寫實紅磚皮膚)
    const platGeo = new THREE.PlaneGeometry(28, 28);
    const platMat = new THREE.MeshStandardMaterial({
      map: this.tex.stationBrick,
      roughness: 0.8,
      metalness: 0.08
    });
    const platform = new THREE.Mesh(platGeo, platMat);
    platform.rotation.x = -Math.PI / 2;
    platform.receiveShadow = true;
    group.add(platform);

    // 3. 雙軌火車鐵道、枕木與碎石基床 (右側延伸)
    this.buildTrainRailwayBed(group, 5.5);

    // 4. 月台黃黑警戒斑馬線與鑄鐵安全護欄
    this.buildStationPerimeter(group, 14);

    // 5. 巨型四層維多利亞紅磚天文時鐘塔 (TIME / CLOCK)
    this.buildAstronomicalClockTower(group, 0, 0, -5.5, '🕰️ 月台巨型天文時鐘 (TIME / CLOCK)', 'TIME', () => {
      this.world.openSpeechCard('TIME', () => {
        this.world.addXP(80);
      });
    });

    // 6. 3D 魔法極光蒸汽火車頭 (TRAIN)
    this.buildSteamLocomotive(group, 5.5, 0, -2.5, '🚂 魔法星光特快列車 (TRAIN)', 'TRAIN', () => {
      this.world.openSpeechCard('TRAIN', () => {
        this.world.addXP(80);
      });
    });

    // 7. 復古鑄鐵晨曦煤氣路燈與候車長椅 (MORNING)
    this.buildGasLampAndBench(group, -4.2, 0, 0, '🌅 照亮晨曦的月台路燈 (MORNING)', 'MORNING', () => {
      this.world.openSpeechCard('MORNING', () => {
        this.world.addXP(80);
      });
    });

    // 8. 出口通道：列車頭等車廂登車門 (OPEN)
    this.buildTrainCarriageDoorPortal(group, 0, 0, 6.0, '🚂 前往大魔導士殿堂的列車門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 汽笛長鳴！恭喜完成全維度英語護照試煉！');
      if (this.world) this.world.triggerEscapeCelebration();
    });

    // 飄浮星塵微粒
    this.addFloatingParticles(group, 0xfde047, 160, 24, 6);
  }

  // ==========================================
  // 模組化精緻景物建造器 (High-Fidelity Builders)
  // ==========================================

  // [市集] 石牆基底與木柵欄與轉角燈柱
  buildMarketPerimeter(group, halfSize) {
    const stoneWallMat = new THREE.MeshStandardMaterial({
      map: this.tex.stoneWall,
      roughness: 0.85
    });
    const woodMat = new THREE.MeshStandardMaterial({
      map: this.tex.woodDesk,
      roughness: 0.7
    });

    // 四周矮石牆基座
    const wallThick = 0.5;
    const wallHeight = 0.8;
    const wallLength = halfSize * 2;

    const nWall = new THREE.Mesh(new THREE.BoxGeometry(wallLength, wallHeight, wallThick), stoneWallMat);
    nWall.position.set(0, wallHeight / 2, -halfSize);
    group.add(nWall);

    const sWall = new THREE.Mesh(new THREE.BoxGeometry(wallLength, wallHeight, wallThick), stoneWallMat);
    sWall.position.set(0, wallHeight / 2, halfSize);
    group.add(sWall);

    const eWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallHeight, wallLength), stoneWallMat);
    eWall.position.set(halfSize, wallHeight / 2, 0);
    group.add(eWall);

    const wWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallHeight, wallLength), stoneWallMat);
    wWall.position.set(-halfSize, wallHeight / 2, 0);
    group.add(wWall);

    // 石牆上的木質圍欄柱
    for (let i = -halfSize + 2; i < halfSize; i += 2.5) {
      if (Math.abs(i) < 2) continue; // 留出通道空隙
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8), woodMat);
      post.position.set(i, wallHeight + 0.4, -halfSize);
      group.add(post);

      const rail = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.06), woodMat);
      rail.position.set(i + 1.25, wallHeight + 0.6, -halfSize);
      group.add(rail);
    }

    // 四角柱石造燈台
    const corners = [
      [-halfSize, -halfSize],
      [halfSize, -halfSize],
      [-halfSize, halfSize],
      [halfSize, halfSize]
    ];
    corners.forEach(([cx, cz]) => {
      const pColumn = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.8), stoneWallMat);
      pColumn.position.set(cx, 0.9, cz);
      group.add(pColumn);

      const lantern = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.15, 0.45, 6),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.6 })
      );
      lantern.position.set(cx, 2.05, cz);
      group.add(lantern);

      const pLight = new THREE.PointLight(0xfde68a, 0.8, 8);
      pLight.position.set(cx, 2.1, cz);
      group.add(pLight);
    });
  }

  // [市集] 擬真水果帳篷攤位 (蘋果/香蕉)
  buildDetailedMarketStall(group, x, y, z, fruitType, label, id, onClick) {
    const stall = new THREE.Group();
    stall.position.set(x, y, z);

    const woodMat = new THREE.MeshStandardMaterial({
      map: this.tex.woodDesk,
      roughness: 0.65
    });

    // 1. 厚實木質櫃檯與腳架
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.15, 1.6), woodMat);
    tableTop.position.set(0, 0.95, 0);
    tableTop.castShadow = true;
    stall.add(tableTop);

    // 4 根支撐桌腳
    const legGeo = new THREE.BoxGeometry(0.12, 0.95, 0.12);
    [[-1.35, -0.65], [1.35, -0.65], [-1.35, 0.65], [1.35, 0.65]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(lx, 0.475, lz);
      stall.add(leg);
    });

    // 2. 攤位 4 根挑高頂棚立柱
    const poleGeo = new THREE.BoxGeometry(0.1, 1.8, 0.1);
    [[-1.35, -0.65], [1.35, -0.65], [-1.35, 0.65], [1.35, 0.65]].forEach(([px, pz]) => {
      const pole = new THREE.Mesh(poleGeo, woodMat);
      pole.position.set(px, 1.85, pz);
      stall.add(pole);
    });

    // 3. 彩色條紋帆布遮陽棚 (AI 寫實布料皮膚)
    const canopyMat = new THREE.MeshStandardMaterial({
      map: this.tex.marketAwning,
      roughness: 0.7,
      side: THREE.DoubleSide
    });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.3, 0.9, 4), canopyMat);
    roof.position.set(0, 3.1, 0);
    roof.rotation.y = Math.PI / 4;
    stall.add(roof);

    // 垂墜荷葉邊 (Front Scalloped Valance)
    const valance = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.25, 0.05), canopyMat);
    valance.position.set(0, 2.7, 0.85);
    stall.add(valance);

    // 4. 木質蔬果板條箱
    const crateMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.8 });
    const crate1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.8), crateMat);
    crate1.position.set(-0.65, 1.15, 0);
    crate1.rotation.x = 0.15;
    stall.add(crate1);

    const crate2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.8), crateMat);
    crate2.position.set(0.65, 1.15, 0);
    crate2.rotation.x = 0.15;
    stall.add(crate2);

    // 5. 蔬果精緻 3D 模型
    if (fruitType === 'apple') {
      const appleMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.1 });
      const appleMatGreen = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.4 });
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });

      // 堆滿一顆顆帶果蒂與葉子的紅蘋果與青蘋果
      for (let i = 0; i < 9; i++) {
        const appleGroup = new THREE.Group();
        const isGreen = (i % 4 === 0);
        const appleBody = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), isGreen ? appleMatGreen : appleMatRed);
        appleGroup.add(appleBody);

        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.07, 6), stemMat);
        stem.position.y = 0.13;
        stem.rotation.z = 0.2;
        appleGroup.add(stem);

        const col = i % 3;
        const row = Math.floor(i / 3);
        appleGroup.position.set(-0.95 + col * 0.28, 1.35 + (row > 1 ? 0.12 : 0), -0.2 + (row % 2) * 0.25);
        stall.add(appleGroup);
      }
    } else if (fruitType === 'banana') {
      // 鮮黃彎月形香蕉串與黃銅天平秤
      const bananaMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.45 });
      const tipMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f });

      for (let b = 0; b < 6; b++) {
        const banana = new THREE.Group();
        const curveMesh = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.045, 8, 12, Math.PI * 0.7), bananaMat);
        curveMesh.rotation.z = Math.PI * 0.3;
        banana.add(curveMesh);

        const stem = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.05), tipMat);
        stem.position.set(0.14, 0.12, 0);
        banana.add(stem);

        banana.position.set(-0.9 + (b % 3) * 0.3, 1.35, -0.15 + Math.floor(b / 3) * 0.25);
        stall.add(banana);
      }

      // 黃銅商人天平秤 (Balance Scale)
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.85, roughness: 0.25 });
      const scaleStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.7, 12), brassMat);
      scaleStand.position.set(0.65, 1.35, 0);
      stall.add(scaleStand);

      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.03), brassMat);
      crossBeam.position.set(0.65, 1.65, 0);
      stall.add(crossBeam);

      [-0.35, 0.35].forEach(sx => {
        const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.03, 12), brassMat);
        pan.position.set(0.65 + sx, 1.42, 0);
        stall.add(pan);
      });
    }

    // 6. 互動感應外盒
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 3.0, 2.0),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 1.5;
    hitBox.userData = { id, label, onClick };
    stall.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(stall);
  }

  // [市集] 擬真雙輪木造推車 (烤麵包/鮮奶蜂蜜)
  buildDetailedCart(group, x, y, z, cartType, label, id, onClick) {
    const cart = new THREE.Group();
    cart.position.set(x, y, z);

    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });

    // 1. 推車底盤與把手
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 1.1), woodMat);
    chassis.position.y = 0.65;
    cart.add(chassis);

    // 兩根斜把手
    const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), woodMat);
    handleL.position.set(-0.6, 0.7, 0.9);
    handleL.rotation.x = -0.5;
    cart.add(handleL);

    const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), woodMat);
    handleR.position.set(0.6, 0.7, 0.9);
    handleR.rotation.x = -0.5;
    cart.add(handleR);

    // 2. 兩側復古輪輻木大輪 (8 根木輪輻 + 鐵輪框)
    [-0.9, 0.9].forEach(wx => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, 0.5, 0);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.05, 8, 24), ironMat);
      wheelGroup.add(rim);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 12), woodMat);
      hub.rotation.z = Math.PI / 2;
      wheelGroup.add(hub);

      for (let s = 0; s < 4; s++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.9, 0.03), woodMat);
        spoke.rotation.z = (s * Math.PI) / 4;
        wheelGroup.add(spoke);
      }

      cart.add(wheelGroup);
    });

    // 3. 貨物與裝飾
    if (cartType === 'bread') {
      // 編織藤籃與金黃長法棍、圓形酸種麵包
      const basketMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 0.35, 12), basketMat);
      basket.position.set(0, 0.9, 0);
      cart.add(basket);

      const crustMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 });
      // 法棍麵包 (Baguettes)
      [-0.15, 0, 0.15].forEach((bx, idx) => {
        const baguette = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 10), crustMat);
        baguette.position.set(bx, 1.2, (idx - 1) * 0.08);
        baguette.rotation.x = 0.35 + idx * 0.1;
        baguette.rotation.z = -0.2 + idx * 0.15;
        cart.add(baguette);
      });
    } else if (cartType === 'milk') {
      // 玻璃牛奶瓶 (透亮白色) 與金黃琥珀蜂蜜罐
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
      });
      const milkLiquidMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const honeyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, transparent: true, opacity: 0.9 });

      // 4 瓶鮮奶
      [[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.2], [0.3, 0.2]].forEach(([mx, mz]) => {
        const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.42, 12), milkLiquidMat);
        bottle.position.set(mx, 0.95, mz);
        cart.add(bottle);

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 8), new THREE.MeshStandardMaterial({ color: 0x92400e }));
        cap.position.set(mx, 1.18, mz);
        cart.add(cap);
      });

      // 中央一罈黃金蜂蜜
      const honeyPot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), honeyMat);
      honeyPot.position.set(0, 0.95, 0);
      cart.add(honeyPot);
    }

    // 4. 互動包圍盒
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.8, 1.6),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 0.9;
    hitBox.userData = { id, label, onClick };
    cart.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(cart);
  }

  // [市集] 彩色慶典吊旗三角旗繩
  buildBuntingFlags(group, startPos, endPos) {
    const flagColors = [0xef4444, 0x3b82f6, 0xf59e0b, 0x10b981, 0x8b5cf6];
    const dx = (endPos[0] - startPos[0]) / 8;
    const dy = (endPos[1] - startPos[1]) / 8;
    const dz = (endPos[2] - startPos[2]) / 8;

    for (let i = 0; i < 8; i++) {
      const px = startPos[0] + dx * i + dx / 2;
      const py = startPos[1] + dy * i - Math.sin((i / 8) * Math.PI) * 0.4;
      const pz = startPos[2] + dz * i;

      const flag = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.3, 3),
        new THREE.MeshStandardMaterial({ color: flagColors[i % flagColors.length], side: THREE.DoubleSide })
      );
      flag.position.set(px, py, pz);
      flag.rotation.z = Math.PI;
      group.add(flag);
    }
  }

  // [市集] 古堡護城石橋木造吊橋大門 (Exit Drawbridge)
  buildDrawbridgePortal(group, x, y, z, label, exitWord, onUnlocked) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);

    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });

    // 兩側拱門防禦石塔
    const towerL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.8, 1.2), stoneMat);
    towerL.position.set(-2.2, 2.4, 0);
    portal.add(towerL);

    const towerR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.8, 1.2), stoneMat);
    towerR.position.set(2.2, 2.4, 0);
    portal.add(towerR);

    // 頂部石拱橋過梁
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.8, 1.0), stoneMat);
    lintel.position.set(0, 4.4, 0);
    portal.add(lintel);

    // 重型鐵條鑲嵌木製吊橋門板
    const gateDoor = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.8, 0.2), woodMat);
    gateDoor.position.set(0, 2.0, 0);
    portal.add(gateDoor);

    // 兩根斜拉沉重鐵鍊
    [-1.5, 1.5].forEach(cx => {
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4.2, 6), ironMat);
      chain.position.set(cx, 2.6, 0.6);
      chain.rotation.x = 0.35;
      portal.add(chain);
    });

    // 兩座燃燒火盆
    [-2.2, 2.2].forEach(tx => {
      const brazier = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.3, 8), ironMat);
      brazier.position.set(tx, 2.8, 0.7);
      portal.add(brazier);

      const fireCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xef4444, emissiveIntensity: 0.9 })
      );
      fireCore.position.set(tx, 3.0, 0.7);
      portal.add(fireCore);

      const fLight = new THREE.PointLight(0xf97316, 1.2, 6);
      fLight.position.set(tx, 3.1, 0.7);
      portal.add(fLight);
    });

    // 發光解鎖魔法結界
    const runeBarrier = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 3.6),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.3
      })
    );
    runeBarrier.position.set(0, 2.0, 0.15);
    portal.add(runeBarrier);

    // 互動包圍盒
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 4.0, 1.8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'exit_portal_' + this.currentZoneId,
      label,
      onClick: () => {
        this.world.openSpeechCard(exitWord, () => {
          if (onUnlocked) onUnlocked();
        });
      }
    };
    portal.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      runeBarrier.material.opacity = 0.5 + Math.sin(time * 3) * 0.2;
    });

    group.add(portal);
  }

  // [花園] 白色古典雕花石欄杆與雕花石盆 (Balustrade)
  buildGardenBalustrade(group, halfSize) {
    const marbleMat = new THREE.MeshStandardMaterial({
      map: this.tex.marbleFountain,
      roughness: 0.45,
      metalness: 0.05
    });

    const railGeo = new THREE.BoxGeometry(halfSize * 2, 0.18, 0.25);
    const baseGeo = new THREE.BoxGeometry(halfSize * 2, 0.2, 0.3);

    // 南北基石與扶手
    [-halfSize, halfSize].forEach(z => {
      const base = new THREE.Mesh(baseGeo, marbleMat);
      base.position.set(0, 0.1, z);
      group.add(base);

      const rail = new THREE.Mesh(railGeo, marbleMat);
      rail.position.set(0, 0.85, z);
      group.add(rail);

      // 細長花瓶柱 (Balusters)
      for (let x = -halfSize + 1.2; x < halfSize; x += 1.6) {
        if (Math.abs(x) < 2.5 && z < 0) continue; // 北邊出口預留寬通道
        const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8), marbleMat);
        baluster.position.set(x, 0.48, z);
        group.add(baluster);
      }
    });

    // 東西兩側基石與扶手
    [-halfSize, halfSize].forEach(x => {
      const baseE = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, halfSize * 2), marbleMat);
      baseE.position.set(x, 0.1, 0);
      group.add(baseE);

      const railE = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.18, halfSize * 2), marbleMat);
      railE.position.set(x, 0.85, 0);
      group.add(railE);

      for (let z = -halfSize + 1.2; z < halfSize; z += 1.6) {
        const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8), marbleMat);
        baluster.position.set(x, 0.48, z);
        group.add(baluster);
      }
    });

    // 四角柱石花盆 (Urns with Flowers)
    const corners = [
      [-halfSize, -halfSize], [halfSize, -halfSize],
      [-halfSize, halfSize], [halfSize, halfSize]
    ];
    corners.forEach(([cx, cz]) => {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.7), marbleMat);
      plinth.position.set(cx, 0.55, cz);
      group.add(plinth);

      const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.15, 0.4, 12), marbleMat);
      urn.position.set(cx, 1.25, cz);
      group.add(urn);

      // 石盆內盛開紅粉小花
      const flowerBush = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.32),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.8 })
      );
      flowerBush.position.set(cx, 1.5, cz);
      group.add(flowerBush);
    });
  }

  // [花園] 弧形碎石踏步石板路
  buildGardenStonePaths(group) {
    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    // 從玩家起點 (0, 0, 3.5) 鋪往中央噴泉 (0, 0, 0)
    for (let z = 3.5; z >= -0.5; z -= 0.7) {
      const step = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.04, 8), stoneMat);
      step.position.set(Math.sin(z * 2) * 0.15, 0.02, z);
      step.receiveShadow = true;
      group.add(step);
    }
  }

  // [花園] 散落花園草坪的 3D 盛開小花
  buildScatteredFlowers(group) {
    const petalMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const petalMatBlue = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.6 });
    const centerMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.4 });

    const flowerCoords = [
      [-2.5, -0.8], [-1.8, 1.5], [2.2, 1.2], [3.0, -1.0],
      [-4.0, 1.0], [4.5, 0.5], [-2.0, -3.2], [2.5, -3.5]
    ];

    flowerCoords.forEach(([fx, fz], idx) => {
      const patch = new THREE.Group();
      patch.position.set(fx, 0, fz);

      for (let p = 0; p < 5; p++) {
        const ox = (Math.random() - 0.5) * 0.6;
        const oz = (Math.random() - 0.5) * 0.6;
        const flower = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 6), (idx % 2 === 0) ? petalMatWhite : petalMatBlue);
        flower.position.set(ox, 0.04, oz);
        patch.add(flower);

        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), centerMat);
        eye.position.set(ox, 0.06, oz);
        patch.add(eye);
      }
      group.add(patch);
    });
  }

  // [花園] 雙層雕花大理石水景噴泉 (WATER)
  buildMarbleFountain(group, x, y, z, label, id, onClick) {
    const fountain = new THREE.Group();
    fountain.position.set(x, y, z);

    const marbleMat = new THREE.MeshStandardMaterial({
      map: this.tex.marbleFountain,
      roughness: 0.35,
      metalness: 0.08
    });

    // 1. 底層八角形雕花大水池
    const baseBasin = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.6, 16), marbleMat);
    baseBasin.position.y = 0.3;
    baseBasin.castShadow = true;
    fountain.add(baseBasin);

    // 水池清澈水面 (Shimmering Water)
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.08,
      metalness: 0.2,
      transparent: true,
      opacity: 0.8
    });
    const poolWater = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.05, 16), waterMat);
    poolWater.position.y = 0.55;
    fountain.add(poolWater);

    // 2. 中央雕花羅馬柱座
    const centralPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.4, 12), marbleMat);
    centralPillar.position.y = 1.2;
    fountain.add(centralPillar);

    // 3. 上層精巧小水盤
    const upperBasin = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.9, 0.3, 16), marbleMat);
    upperBasin.position.y = 1.9;
    fountain.add(upperBasin);

    const upperWater = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.04, 16), waterMat);
    upperWater.position.y = 2.02;
    fountain.add(upperWater);

    // 4. 頂端蓮蓬出水噴頭 (Spout Finial)
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), marbleMat);
    finial.position.y = 2.2;
    fountain.add(finial);

    // 5. 噴泉動態湧水微粒
    const sprayCount = 45;
    const sprayGeo = new THREE.BufferGeometry();
    const sprayPos = new Float32Array(sprayCount * 3);
    for (let i = 0; i < sprayCount * 3; i += 3) {
      sprayPos[i] = (Math.random() - 0.5) * 0.4;
      sprayPos[i + 1] = 2.2 + Math.random() * 0.8;
      sprayPos[i + 2] = (Math.random() - 0.5) * 0.4;
    }
    sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
    const sprayMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.06,
      transparent: true,
      opacity: 0.85
    });
    const sprayPoints = new THREE.Points(sprayGeo, sprayMat);
    fountain.add(sprayPoints);

    // 水滴跳動動畫
    this.world.animators.push((time) => {
      const pos = sprayGeo.attributes.position.array;
      for (let i = 0; i < sprayCount * 3; i += 3) {
        pos[i + 1] += 0.02;
        if (pos[i + 1] > 3.1) pos[i + 1] = 2.2;
      }
      sprayGeo.attributes.position.needsUpdate = true;
      poolWater.position.y = 0.55 + Math.sin(time * 3) * 0.01;
    });

    // 6. 互動感應外盒
    const hitBox = new THREE.Mesh(
      new THREE.CylinderGeometry(2.8, 2.8, 2.6, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 1.3;
    hitBox.userData = { id, label, onClick };
    fountain.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(fountain);
  }

  // [花園] 擬真可愛小白兔抱胡蘿蔔 (RABBIT)
  buildSculptedRabbit(group, x, y, z, label, id, onClick) {
    const rabbit = new THREE.Group();
    rabbit.position.set(x, y, z);

    const furMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.65 });
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.5 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.2 });
    const carrotMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.45 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 });

    // 1. 綠色小丘底座
    const mound = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.1, 0.25, 12),
      new THREE.MeshStandardMaterial({ map: this.tex.gardenGrass, roughness: 0.9 })
    );
    mound.position.y = 0.125;
    rabbit.add(mound);

    // 2. 兔子本體 (身體 + 圓頭)
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 14), furMat);
    body.position.y = 0.48;
    body.scale.set(1.0, 1.1, 1.15);
    rabbit.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), furMat);
    head.position.set(0, 0.82, 0.2);
    rabbit.add(head);

    // 3. 兩隻豎起長耳朵 (帶粉紅內耳)
    [-0.1, 0.1].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.05), furMat);
      ear.position.set(ex, 1.15, 0.15);
      ear.rotation.z = -ex * 1.5;
      rabbit.add(ear);

      const inEar = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.25, 0.02), innerEarMat);
      inEar.position.set(ex, 1.15, 0.18);
      inEar.rotation.z = -ex * 1.5;
      rabbit.add(inEar);
    });

    // 4. 眼睛與小圓尾巴
    [-0.1, 0.1].forEach(eyeX => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
      eye.position.set(eyeX, 0.88, 0.42);
      rabbit.add(eye);
    });

    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), furMat);
    tail.position.set(0, 0.45, -0.4);
    rabbit.add(tail);

    // 5. 懷中抱著的大胡蘿蔔
    const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.35, 8), carrotMat);
    carrot.position.set(0.15, 0.58, 0.35);
    carrot.rotation.z = -0.5;
    rabbit.add(carrot);

    const carrotTop = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 6), greenMat);
    carrotTop.position.set(0.24, 0.74, 0.35);
    carrotTop.rotation.z = -0.5;
    rabbit.add(carrotTop);

    // 6. 互動包圍盒
    const hitBox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 1.5, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 0.75;
    hitBox.userData = { id, label, onClick };
    rabbit.add(hitBox);
    this.world.interactables.push(hitBox);

    // 兔子輕微呼吸與蹦跳動畫
    this.world.animators.push((time) => {
      head.rotation.y = Math.sin(time * 2) * 0.12;
      body.position.y = 0.48 + Math.abs(Math.sin(time * 3)) * 0.04;
    });

    group.add(rabbit);
  }

  // [花園] 常春藤羅馬石柱與歌唱青鳥 (BIRD)
  buildBirdOnPedestal(group, x, y, z, label, id, onClick) {
    const birdGroup = new THREE.Group();
    birdGroup.position.set(x, y, z);

    const marbleMat = new THREE.MeshStandardMaterial({
      map: this.tex.marbleFountain,
      roughness: 0.4
    });

    // 1. 羅馬雕花石柱
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), marbleMat);
    plinth.position.y = 0.15;
    birdGroup.add(plinth);

    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.8, 12), marbleMat);
    column.position.y = 1.2;
    birdGroup.add(column);

    const capital = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.7), marbleMat);
    capital.position.y = 2.2;
    birdGroup.add(capital);

    // 常春藤綠葉環繞
    const ivyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    for (let v = 0; v < 6; v++) {
      const ivy = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12), ivyMat);
      ivy.position.set(
        Math.sin(v * 1.3) * 0.3,
        0.5 + v * 0.28,
        Math.cos(v * 1.3) * 0.3
      );
      birdGroup.add(ivy);
    }

    // 2. 歌唱青鳥 (Bluebird)
    const bird = new THREE.Group();
    bird.position.set(0, 2.45, 0);

    const blueFeatherMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.4 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });

    // 身軀與圓頭
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), blueFeatherMat);
    body.scale.set(1.0, 1.1, 1.4);
    bird.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), bellyMat);
    belly.position.set(0, -0.04, 0.08);
    bird.add(belly);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), blueFeatherMat);
    head.position.set(0, 0.15, 0.14);
    bird.add(head);

    // 鳥喙
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 6), beakMat);
    beak.position.set(0, 0.14, 0.28);
    beak.rotation.x = Math.PI / 2;
    bird.add(beak);

    // 尾羽
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.22), blueFeatherMat);
    tail.position.set(0, 0.02, -0.22);
    tail.rotation.x = -0.3;
    bird.add(tail);

    birdGroup.add(bird);

    // 3. 互動感應外盒
    const hitBox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 2.8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 1.4;
    hitBox.userData = { id, label, onClick };
    birdGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    // 鳥兒擺頭唱歌動畫
    this.world.animators.push((time) => {
      head.rotation.y = Math.sin(time * 3) * 0.25;
      bird.position.y = 2.45 + Math.sin(time * 4) * 0.02;
    });

    group.add(birdGroup);
  }

  // [花園] 盤根錯節的精靈守護大樹 (TREE)
  buildAncientWorldTree(group, x, y, z, label, id, onClick) {
    const tree = new THREE.Group();
    tree.position.set(x, y, z);

    const woodMat = new THREE.MeshStandardMaterial({
      map: this.tex.woodDesk,
      roughness: 0.85
    });
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.75
    });

    // 1. 粗壯主樹幹與巨大根系
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.95, 3.2, 10), woodMat);
    trunk.position.y = 1.6;
    trunk.castShadow = true;
    tree.add(trunk);

    // 四向突出的大樹根
    [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(ang => {
      const root = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 1.4), woodMat);
      root.position.set(Math.sin(ang) * 0.9, 0.25, Math.cos(ang) * 0.9);
      root.rotation.y = ang;
      tree.add(root);
    });

    // 2. 多重分層茂密樹冠 (Layered Organic Canopies)
    const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4), leafMat);
    canopy1.position.set(0, 4.0, 0);
    tree.add(canopy1);

    const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8), leafMat);
    canopy2.position.set(-0.8, 4.8, 0.4);
    tree.add(canopy2);

    const canopy3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.7), leafMat);
    canopy3.position.set(0.9, 4.6, -0.5);
    tree.add(canopy3);

    // 3. 樹枝懸掛的溫暖發光精靈吊燈
    const lanternMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.8 });
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), lanternMat);
    lamp.position.set(1.2, 3.0, 0.5);
    tree.add(lamp);

    const lampLight = new THREE.PointLight(0xfef08a, 1.2, 7);
    lampLight.position.set(1.2, 3.0, 0.5);
    tree.add(lampLight);

    // 4. 互動包圍盒
    const hitBox = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.2, 4.8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 2.4;
    hitBox.userData = { id, label, onClick };
    tree.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(tree);
  }

  // [花園] 玫瑰攀藤鍛鐵拱門通道 (Exit Rose Arch)
  buildRoseArchPortal(group, x, y, z, label, exitWord, onUnlocked) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const roseMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });

    // 左右兩根鐵藝雙圓管立柱
    [-1.6, 1.6].forEach(px => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.8, 8), ironMat);
      pillar.position.set(px, 1.9, 0);
      portal.add(pillar);
    });

    // 頂部拱圈
    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.08, 8, 16, Math.PI), ironMat);
    arch.position.set(0, 3.8, 0);
    portal.add(arch);

    // 蔓生綠藤與粉紅玫瑰
    for (let r = 0; r < 12; r++) {
      const ang = (r / 12) * Math.PI;
      const rx = Math.cos(ang) * 1.6;
      const ry = 3.8 + Math.sin(ang) * 1.6;
      const rose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), roseMat);
      rose.position.set(rx, ry, 0.05);
      portal.add(rose);

      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.05), leafMat);
      leaf.position.set(rx - 0.1, ry - 0.05, 0.04);
      portal.add(leaf);
    }

    // 花園自然微光結界門扉
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 3.8),
      new THREE.MeshStandardMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.55,
        roughness: 0.1,
        emissive: 0x22c55e,
        emissiveIntensity: 0.25
      })
    );
    door.position.y = 1.9;
    portal.add(door);

    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 4.2, 1.6),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 2.1;
    hitBox.userData = {
      id: 'exit_portal_' + this.currentZoneId,
      label,
      onClick: () => {
        this.world.openSpeechCard(exitWord, () => {
          if (onUnlocked) onUnlocked();
        });
      }
    };
    portal.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      door.material.opacity = 0.45 + Math.sin(time * 3) * 0.2;
    });

    group.add(portal);
  }

  // [操場] 草坪足球白色邊線與禁區線
  buildSoccerFieldLines(group) {
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // 外邊線
    const border = new THREE.Mesh(new THREE.RingGeometry(7.8, 7.9, 4), lineMat);
    border.rotation.x = -Math.PI / 2;
    border.rotation.z = Math.PI / 4;
    border.position.y = 0.035;
    group.add(border);

    // 中圈
    const centerCircle = new THREE.Mesh(new THREE.RingGeometry(2.4, 2.48, 24), lineMat);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.y = 0.035;
    group.add(centerCircle);
  }

  // [操場] 體育場四角照明燈塔與側邊看台
  buildStadiumStructures(group, halfSize) {
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });

    // 四角高聳投光燈架
    const corners = [
      [-halfSize + 1.5, -halfSize + 1.5], [halfSize - 1.5, -halfSize + 1.5],
      [-halfSize + 1.5, halfSize - 1.5], [halfSize - 1.5, halfSize - 1.5]
    ];
    corners.forEach(([tx, tz]) => {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 7.0, 8), steelMat);
      tower.position.set(tx, 3.5, tz);
      group.add(tower);

      const lampHead = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.4), steelMat);
      lampHead.position.set(tx, 7.0, tz);
      lampHead.lookAt(0, 0, 0);
      group.add(lampHead);

      const bulb = new THREE.Mesh(
        new THREE.PlaneGeometry(1.0, 0.4),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      bulb.position.set(tx, 7.0, tz);
      bulb.lookAt(0, 0, 0);
      group.add(bulb);
    });

    // 西側木造觀眾階梯看台 (Bleachers)
    for (let row = 0; row < 3; row++) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 8.0), woodMat);
      bench.position.set(-halfSize + 2.0 + row * 0.7, 0.4 + row * 0.4, 0);
      group.add(bench);
    }
  }

  // [操場] 擬真足球門與經典黑白五角足球 (SOCCER / BALL)
  buildSoccerGoalAndBall(group, x, y, z, label, id, onClick) {
    const goalGroup = new THREE.Group();
    goalGroup.position.set(x, y, z);

    const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const netMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, wireframe: true, transparent: true, opacity: 0.4 });

    // 門柱 (2 根直柱 + 1 根橫樑)
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 12), postMat);
    postL.position.set(-2.0, 1.2, 0);
    goalGroup.add(postL);

    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 12), postMat);
    postR.position.set(2.0, 1.2, 0);
    goalGroup.add(postR);

    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.16, 12), postMat);
    crossbar.position.set(0, 2.4, 0);
    crossbar.rotation.z = Math.PI / 2;
    goalGroup.add(crossbar);

    // 後方球網罩 (Net)
    const netBox = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.4, 1.4), netMat);
    netBox.position.set(0, 1.2, -0.7);
    goalGroup.add(netBox);

    // 經典黑白足球 (Classic Soccer Ball)
    const ballGroup = new THREE.Group();
    ballGroup.position.set(0, 0.24, 1.2);

    const ballMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const ballMatBlack = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35 });

    const ballBase = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), ballMatWhite);
    ballGroup.add(ballBase);

    // 五角黑色皮塊
    for (let p = 0; p < 6; p++) {
      const patch = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 5), ballMatBlack);
      patch.position.set(
        Math.sin(p * 1.05) * 0.22,
        Math.cos(p * 1.05) * 0.22,
        (p % 2 === 0 ? 0.08 : -0.08)
      );
      patch.lookAt(ballGroup.position);
      ballGroup.add(patch);
    }
    goalGroup.add(ballGroup);

    // 互動包圍盒
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 2.8, 3.0),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 1.3;
    hitBox.userData = { id, label, onClick };
    goalGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(goalGroup);
  }

  // [操場] 起跑線助跑塊與接力棒 (RUN)
  buildStartingBlocks(group, x, y, z, label, id, onClick) {
    const runGroup = new THREE.Group();
    runGroup.position.set(x, y, z);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
    const batonMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7, roughness: 0.2 });

    // 地面白色起跑線
    const startLine = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.02, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    startLine.position.set(0, 0.02, 0);
    runGroup.add(startLine);

    // 左右兩只斜角助跑踏板 (Starting Blocks)
    [-0.3, 0.3].forEach(bx => {
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.3), steelMat);
      block.position.set(bx, 0.08, 0.35);
      block.rotation.x = -0.4;
      runGroup.add(block);
    });

    // 鮮紅金屬接力棒 (Relay Baton)
    const baton = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12), batonMat);
    baton.position.set(0, 0.18, -0.4);
    baton.rotation.z = Math.PI / 2;
    runGroup.add(baton);

    // 互動包圍盒
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.2, 2.0),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 0.5;
    hitBox.userData = { id, label, onClick };
    runGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(runGroup);
  }

  // [操場] 體育跳高安全海綿墊與木質跳箱 (JUMP)
  buildJumpEquipment(group, x, y, z, label, id, onClick) {
    const jumpGroup = new THREE.Group();
    jumpGroup.position.set(x, y, z);

    // 1. 藍色厚實高跳防跌落海綿墊 (Crash Mat)
    const matMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.5, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 })
    );
    matMesh.position.set(0, 0.25, 0);
    jumpGroup.add(matMesh);

    // 2. 兩側刻度立柱與紅白色橫竿
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7 });
    [-1.2, 1.2].forEach(px => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), poleMat);
      pole.position.set(px, 0.9, -1.0);
      jumpGroup.add(pole);
    });

    const crossbar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 2.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xef4444 })
    );
    crossbar.position.set(0, 1.35, -1.0);
    crossbar.rotation.z = Math.PI / 2;
    jumpGroup.add(crossbar);

    // 3. 旁邊的瑞典四層木質跳箱 (Vaulting Box)
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const vaultTopMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });

    const vaultBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.65, 1.2), woodMat);
    vaultBox.position.set(-1.8, 0.325, 0.2);
    jumpGroup.add(vaultBox);

    const leatherTop = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.15, 1.25), vaultTopMat);
    leatherTop.position.set(-1.8, 0.725, 0.2);
    jumpGroup.add(leatherTop);

    // 4. 互動包圍盒
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 2.2, 3.0),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 1.0;
    hitBox.userData = { id, label, onClick };
    jumpGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(jumpGroup);
  }

  // [操場] 金色凱旋桂冠勝利拱門 (Exit Trophy Arch)
  buildTrophyArchPortal(group, x, y, z, label, exitWord, onUnlocked) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.85,
      roughness: 0.25
    });

    // 兩側羅馬式雕花金柱
    [-1.8, 1.8].forEach(px => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 4.0, 12), goldMat);
      pillar.position.set(px, 2.0, 0);
      portal.add(pillar);
    });

    // 拱形橫樑與中央巨大金色獎盃桂冠飾徽
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.7, 0.8), goldMat);
    topBar.position.set(0, 4.35, 0);
    portal.add(topBar);

    const starEmblem = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45), goldMat);
    starEmblem.position.set(0, 5.0, 0);
    portal.add(starEmblem);

    // 兩側奧林匹克勝利火炬台
    [-1.8, 1.8].forEach(tx => {
      const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.15, 0.5, 8), goldMat);
      torch.position.set(tx, 4.2, 0.5);
      portal.add(torch);

      const flame = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xef4444, emissiveIntensity: 0.9 })
      );
      flame.position.set(tx, 4.5, 0.5);
      portal.add(flame);
    });

    // 燦爛金色通關結界
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 4.0),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.35
      })
    );
    door.position.y = 2.0;
    portal.add(door);

    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 4.5, 1.6),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 2.2;
    hitBox.userData = {
      id: 'exit_portal_' + this.currentZoneId,
      label,
      onClick: () => {
        this.world.openSpeechCard(exitWord, () => {
          if (onUnlocked) onUnlocked();
        });
      }
    };
    portal.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      door.material.opacity = 0.5 + Math.sin(time * 3) * 0.2;
    });

    group.add(portal);
  }

  // [車站] 雙軌火車鐵道、枕木與碎石基床
  buildTrainRailwayBed(group, trackX) {
    const gravelMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 });
    const sleeperMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.85 });
    const steelRailMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });

    // 碎石基床道碴 (Ballast)
    const bed = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.1, 28), gravelMat);
    bed.position.set(trackX, 0.05, 0);
    bed.receiveShadow = true;
    group.add(bed);

    // 深色木質軌枕 (Sleepers)
    for (let z = -14; z <= 14; z += 1.1) {
      const sleeper = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.14, 0.3), sleeperMat);
      sleeper.position.set(trackX, 0.12, z);
      group.add(sleeper);
    }

    // 兩條銀白鋼軌 (Steel Rails)
    [-0.9, 0.9].forEach(rx => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 28), steelRailMat);
      rail.position.set(trackX + rx, 0.24, 0);
      group.add(rail);
    });
  }

  // [車站] 月台黃黑警戒斑馬線與鑄鐵圍欄
  buildStationPerimeter(group, halfSize) {
    const cautionMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });
    const curbMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.8 });

    // 月台邊緣石階 (與鐵軌接壤處)
    const curb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, halfSize * 2), curbMat);
    curb.position.set(3.2, 0.15, 0);
    group.add(curb);

    // 黃色安全線條
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.15, halfSize * 2), cautionMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(2.8, 0.02, 0);
    group.add(line);
  }

  // [車站] 巨型維多利亞四層天文時鐘塔 (TIME / CLOCK)
  buildAstronomicalClockTower(group, x, y, z, label, id, onClick) {
    const tower = new THREE.Group();
    tower.position.set(x, y, z);

    const brickMat = new THREE.MeshStandardMaterial({
      map: this.tex.stationBrick,
      roughness: 0.8
    });
    const stoneTrimMat = new THREE.MeshStandardMaterial({
      map: this.tex.stoneWall,
      roughness: 0.6
    });
    const roofCopperMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      metalness: 0.5,
      roughness: 0.4
    });

    // 1. 四層紅磚塔身
    const towerBody = new THREE.Mesh(new THREE.BoxGeometry(3.6, 8.5, 3.6), brickMat);
    towerBody.position.y = 4.25;
    towerBody.castShadow = true;
    tower.add(towerBody);

    // 石造腰線飾帶
    [2.8, 5.8].forEach(ly => {
      const trim = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.25, 3.8), stoneTrimMat);
      trim.position.y = ly;
      tower.add(trim);
    });

    // 2. 尖頂青銅瓦屋頂 (Copper Mansard Spire)
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 3.5, 4), roofCopperMat);
    roof.position.y = 10.25;
    roof.rotation.y = Math.PI / 4;
    tower.add(roof);

    // 3. 巨型正面星光天文時鐘盤 (AI 寫實天文鐘面皮膚)
    const dialMat = new THREE.MeshStandardMaterial({
      map: this.tex.clockFace,
      roughness: 0.35,
      metalness: 0.25
    });
    const clockDial = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.12, 24), dialMat);
    clockDial.rotation.x = Math.PI / 2;
    clockDial.position.set(0, 6.2, 1.86);
    tower.add(clockDial);

    // 3D 黃銅時針與分針 (動態旋轉)
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.8, roughness: 0.2 });
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.04), brassMat);
    hourHand.position.set(0, 6.2, 1.95);
    tower.add(hourHand);

    const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.04), brassMat);
    minuteHand.position.set(0, 6.2, 1.96);
    tower.add(minuteHand);

    // 4. 互動包圍盒
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 9.0, 4.2),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 4.5;
    hitBox.userData = { id, label, onClick };
    tower.add(hitBox);
    this.world.interactables.push(hitBox);

    // 時鐘動態走時動畫
    this.world.animators.push((time) => {
      minuteHand.rotation.z = -time * 0.8;
      hourHand.rotation.z = -time * 0.06;
    });

    group.add(tower);
  }

  // [車站] 擬真 3D 復古蒸汽火車頭 (TRAIN)
  buildSteamLocomotive(group, x, y, z, label, id, onClick) {
    const train = new THREE.Group();
    train.position.set(x, y, z);

    const blackIronMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.7 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.85 });
    const frontTexMat = new THREE.MeshStandardMaterial({
      map: this.tex.locomotive,
      roughness: 0.5,
      metalness: 0.3
    });

    // 1. 巨大圓柱形蒸汽鍋爐 (Boiler)
    const boiler = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 5.0, 16), blackIronMat);
    boiler.rotation.x = Math.PI / 2;
    boiler.position.set(0, 1.6, 0);
    train.add(boiler);

    // 黃銅加固圈 (Brass Bands)
    [-1.5, 0, 1.5].forEach(bz => {
      const band = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.04, 8, 20), brassMat);
      band.position.set(0, 1.6, bz);
      train.add(band);
    });

    // 2. 火車頭正面圓形蓋板 (AI 寫實火車頭正面皮膚)
    const frontDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.2, 20), frontTexMat);
    frontDisc.rotation.x = Math.PI / 2;
    frontDisc.position.set(0, 1.6, 2.5);
    train.add(frontDisc);

    // 3. 耀眼車頭大燈 (Headlight) 與前射光束
    const headlight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.22, 0.4, 12),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 1.0 })
    );
    headlight.rotation.x = Math.PI / 2;
    headlight.position.set(0, 2.5, 2.4);
    train.add(headlight);

    const headSpot = new THREE.SpotLight(0xfef08a, 2.2, 18, Math.PI / 6, 0.4);
    headSpot.position.set(0, 2.5, 2.5);
    headSpot.target.position.set(0, 1.0, 10.0);
    train.add(headSpot);
    train.add(headSpot.target);

    // 4. 排障鐵柵 (Cowcatcher / Pilot Grill)
    const cowcatcher = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.0, 4), blackIronMat);
    cowcatcher.position.set(0, 0.5, 2.8);
    cowcatcher.rotation.x = Math.PI / 4;
    train.add(cowcatcher);

    // 5. 煙囪與動態蒸汽微粒 (Smokestack & Steam)
    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.2, 0.9, 12), blackIronMat);
    chimney.position.set(0, 2.9, 1.6);
    train.add(chimney);

    // 蒸汽微粒
    const steamCount = 30;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount * 3; i += 3) {
      steamPos[i] = (Math.random() - 0.5) * 0.3;
      steamPos[i + 1] = 3.3 + Math.random() * 1.5;
      steamPos[i + 2] = 1.6 + (Math.random() - 0.5) * 0.4;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xf1f5f9,
      size: 0.22,
      transparent: true,
      opacity: 0.65
    });
    const steamPoints = new THREE.Points(steamGeo, steamMat);
    train.add(steamPoints);

    // 6. 巨大鐵動輪 (6 個大鋼輪)
    [-1.15, 1.15].forEach(wx => {
      [-1.6, 0, 1.6].forEach(wz => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.15, 16), blackIronMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.55, wz);
        train.add(wheel);
      });
    });

    // 7. 後方駕駛室 (Cab)
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 2.0), blackIronMat);
    cab.position.set(0, 2.0, -2.4);
    train.add(cab);

    // 8. 互動感應外盒
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 3.6, 6.5),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 1.8;
    hitBox.userData = { id, label, onClick };
    train.add(hitBox);
    this.world.interactables.push(hitBox);

    // 蒸汽緩緩上升動畫
    this.world.animators.push((time) => {
      const pos = steamGeo.attributes.position.array;
      for (let i = 0; i < steamCount * 3; i += 3) {
        pos[i + 1] += 0.015;
        if (pos[i + 1] > 4.8) pos[i + 1] = 3.3;
      }
      steamGeo.attributes.position.needsUpdate = true;
    });

    group.add(train);
  }

  // [車站] 鑄鐵晨曦煤氣路燈與候車長椅 (MORNING)
  buildGasLampAndBench(group, x, y, z, label, id, onClick) {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(x, y, z);

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });

    // 1. 維多利亞雕花燈柱
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 3.4, 8), ironMat);
    post.position.y = 1.7;
    lampGroup.add(post);

    // 六角玻璃煤氣燈頭
    const lantern = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.16, 0.5, 6),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.8,
        roughness: 0.2
      })
    );
    lantern.position.y = 3.5;
    lampGroup.add(lantern);

    const pLight = new THREE.PointLight(0xfde047, 1.5, 9);
    pLight.position.y = 3.5;
    lampGroup.add(pLight);

    // 2. 候車深木鑄鐵長椅 (Bench)
    const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.5), woodMat);
    benchSeat.position.set(0, 0.45, 0.6);
    lampGroup.add(benchSeat);

    const benchBack = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.08), woodMat);
    benchBack.position.set(0, 0.8, 0.82);
    lampGroup.add(benchBack);

    // 3. 互動感應外盒
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 3.8, 1.8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 1.9;
    hitBox.userData = { id, label, onClick };
    lampGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(lampGroup);
  }

  // [車站] 列車頭等車廂登車大門 (Exit Carriage Portal)
  buildTrainCarriageDoorPortal(group, x, y, z, label, exitWord, onUnlocked) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);

    const coachMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.4, metalness: 0.2 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 });

    // 車廂兩側金邊木門框
    const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.6, 0.4), coachMat);
    frameL.position.set(-1.4, 1.8, 0);
    portal.add(frameL);

    const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.6, 0.4), coachMat);
    frameR.position.set(1.4, 1.8, 0);
    portal.add(frameR);

    const topArch = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 0.4), coachMat);
    topArch.position.set(0, 3.6, 0);
    portal.add(topArch);

    // 黃銅迎賓扶手
    [-1.2, 1.2].forEach(hx => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), brassMat);
      rail.position.set(hx, 1.5, 0.3);
      portal.add(rail);
    });

    // 敞開的金色星光登車結界門 (OPEN)
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 3.3),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        emissive: 0xfbbf24,
        emissiveIntensity: 0.4
      })
    );
    door.position.y = 1.65;
    portal.add(door);

    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 3.8, 1.6),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 1.9;
    hitBox.userData = {
      id: 'exit_portal_' + this.currentZoneId,
      label,
      onClick: () => {
        this.world.openSpeechCard(exitWord, () => {
          if (onUnlocked) onUnlocked();
        });
      }
    };
    portal.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      door.material.opacity = 0.55 + Math.sin(time * 3) * 0.2;
    });

    group.add(portal);
  }

  // [通用] 飄浮發光魔法微塵粒子
  addFloatingParticles(group, colorHex, count, range, maxHeight) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * range;
      pos[i + 1] = Math.random() * maxHeight;
      pos[i + 2] = (Math.random() - 0.5) * range;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.09,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geo, mat);
    group.add(points);

    this.world.animators.push((time) => {
      const p = geo.attributes.position.array;
      for (let i = 0; i < count * 3; i += 3) {
        p[i + 1] += Math.sin(time * 2 + i) * 0.005;
      }
      geo.attributes.position.needsUpdate = true;
    });
  }
}

// 建立全域空間實例
window.SpatialZoneManager = SpatialZoneManager;
