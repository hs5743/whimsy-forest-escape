// 空間情境管理器 (SpatialZoneManager)
// 支援五大多元生活與奇幻空間動態切換：書齋、市集、花園、操場、車站
// 全面實作：全景天空頂穹 (Sky Dome)、標準幾何奧林匹克跑道、精準障礙物防穿透實體碰撞 (Solid Collision)

class SpatialZoneManager {
  constructor(world) {
    this.world = world;
    this.currentZoneId = 'zone1';
    this.texturesLoaded = false;
    this.tex = {};
    this.colliders = {};

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
        desc: '歐陸童話城鎮廣場，四周環繞磚木老街屋，在蔬果攤位與天平秤間探索學習！',
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
        desc: '晨曦蔚藍晴空下的開闊森林秘境，巨木奇石環抱，與小白兔與青鳥快樂對話！',
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
        desc: '開闊晴空下的標準田徑體育場，四道筆直紅白跑道，衝向終點勝利拱門！',
        words: ['SOCCER', 'BALL', 'RUN', 'JUMP', 'OPEN'],
        spawnPos: [0, 1.6, 2.0],
        spawnYaw: 0
      },
      'zone5': {
        id: 'zone5',
        name: '星光鐘樓車站',
        englishName: 'Clocktower Train Station',
        icon: '🚂',
        topic: 'Time, Places & Transport',
        reqLevel: 5,
        desc: '繁星閃爍的午夜鐵道月台，鋼軌伸向遠方，蒸汽特快車正蓄勢待發！',
        words: ['TIME', 'CLOCK', 'TRAIN', 'MORNING', 'OPEN'],
        spawnPos: [-1.0, 1.6, 3.0],
        spawnYaw: 0
      }
    };

    this.initTextures();
    this.initColliders();
  }

  // 初始化空間內部固體障礙物碰撞體 (徹底杜絕穿牆與穿火車！)
  initColliders() {
    this.colliders = {
      'zone1': [
        { type: 'box', minX: -1.3, maxX: 1.3, minZ: -4.5, maxZ: -3.1 }, // 大書桌
        { type: 'box', minX: -4.5, maxX: -2.3, minZ: -0.8, maxZ: 1.4 },  // 鍊金台
        { type: 'box', minX: 4.8, maxX: 5.8, minZ: -4.0, maxZ: 1.0 },     // 大書架
        { type: 'box', minX: -6.0, maxX: -1.6, minZ: 5.6, maxZ: 6.4 },   // 南石牆左翼
        { type: 'box', minX: 1.6, maxX: 6.0, minZ: 5.6, maxZ: 6.4 }      // 南石牆右翼
      ],
      'zone2': [
        // 北側街屋建築實體
        { type: 'box', minX: -14.0, maxX: 4.5, minZ: -14.0, maxZ: -8.8 },
        // 西側街屋建築實體
        { type: 'box', minX: -14.0, maxX: -9.5, minZ: -12.0, maxZ: 12.0 },
        // 南側街屋建築實體
        { type: 'box', minX: -14.0, maxX: 6.0, minZ: 9.3, maxZ: 14.0 },
        // 東北城門左側城牆石塔
        { type: 'box', minX: 4.5, maxX: 5.6, minZ: -11.0, maxZ: -7.0 },
        // 東北城門右側城牆石塔與延伸牆
        { type: 'box', minX: 8.0, maxX: 14.0, minZ: -11.0, maxZ: -7.0 },
        // 東北城門實體木門 (阻止未解鎖前穿門)
        { type: 'box', minX: 5.6, maxX: 8.0, minZ: -8.3, maxZ: -7.7 },
        // 蘋果攤位實體
        { type: 'box', minX: -6.0, maxX: -3.2, minZ: -2.0, maxZ: 0.4 },
        // 香蕉攤位實體
        { type: 'box', minX: 3.0, maxX: 5.8, minZ: -0.2, maxZ: 2.6 },
        // 麵包推車實體
        { type: 'box', minX: -4.4, maxX: -2.0, minZ: -6.4, maxZ: -4.0 },
        // 鮮奶蜂蜜攤實體
        { type: 'box', minX: 2.2, maxX: 4.8, minZ: -4.6, maxZ: -2.2 }
      ],
      'zone3': [
        // 中央雙層大理石噴泉 (圓形實體)
        { type: 'circle', x: -0.5, z: -1.2, radius: 2.6 },
        // 千年精靈古樹主幹
        { type: 'circle', x: 4.8, z: -4.5, radius: 1.6 },
        // 羅馬石柱基座
        { type: 'circle', x: -4.5, z: 1.5, radius: 0.8 },
        // 兔子花丘
        { type: 'circle', x: 3.8, z: 0.6, radius: 0.8 },
        // 林間大苔蘚巨石群
        { type: 'circle', x: -9.0, z: -3.5, radius: 1.5 },
        { type: 'circle', x: 8.5, z: 6.0, radius: 1.5 },
        { type: 'circle', x: 7.0, z: -9.0, radius: 1.5 }
      ],
      'zone4': [
        // 西側階梯看台大建築
        { type: 'box', minX: -14.5, maxX: -11.0, minZ: -9.0, maxZ: 9.0 },
        // 北側電子記分牌柱與底盤
        { type: 'box', minX: -4.2, maxX: 4.2, minZ: -14.5, maxZ: -12.5 },
        // 足球門立柱與球網實體
        { type: 'box', minX: -3.4, maxX: 1.0, minZ: -5.5, maxZ: -3.5 },
        // 體育跳高墊與跳箱
        { type: 'box', minX: 2.2, maxX: 5.4, minZ: -0.2, maxZ: 2.6 }
      ],
      'zone5': [
        // 蒸汽特快車 - 黑色鍋爐、排障器與車頭連接部 (絕對無法穿透火車車頭！)
        { type: 'box', minX: 3.6, maxX: 7.5, minZ: -6.8, maxZ: 1.6 },
        // 蒸汽特快車 - 車廂登車大門後方鐵道軌道 (阻止穿越車門到對面鐵軌)
        { type: 'box', minX: 4.8, maxX: 7.5, minZ: 1.6, maxZ: 2.8 },
        // 蒸汽特快車 - 後方客車車廂實體
        { type: 'box', minX: 3.6, maxX: 7.5, minZ: 2.8, maxZ: 14.0 },
        // 西側候車大廳紅磚牆
        { type: 'box', minX: -14.0, maxX: -9.5, minZ: -14.0, maxZ: 14.0 },
        // 巨型四層天文時鐘塔主體
        { type: 'box', minX: -5.0, maxX: -0.6, minZ: -10.8, maxZ: -6.2 },
        // 候車長椅與燈柱
        { type: 'box', minX: -5.5, maxX: -3.5, minZ: 0.6, maxZ: 2.0 }
      ]
    };
  }

  // 取得各空間邊界限制
  getZoneBounds() {
    if (this.currentZoneId === 'zone1') {
      return {
        minX: -5.4,
        maxX: 5.4,
        minZ: -5.4,
        maxZ: this.world.gameState.doorOpened ? 20.0 : 5.2
      };
    }
    return {
      minX: -13.5,
      maxX: 13.5,
      minZ: -13.5,
      maxZ: 13.5
    };
  }

  // 取得目前空間所有障礙物碰撞體
  getColliders() {
    return this.colliders[this.currentZoneId] || [];
  }

  // 初始化並快取 AI 寫實材質皮膚
  initTextures() {
    if (this.texturesLoaded) return;
    const loader = new THREE.TextureLoader();

    this.tex = {
      marketCobble: loader.load('assets/textures/tex-market-cobble.jpg'),
      marketAwning: loader.load('assets/textures/tex-market-awning.jpg'),
      townFacade: loader.load('assets/textures/tex-town-facade.jpg'),
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

    this.tex.marketCobble.wrapS = THREE.RepeatWrapping;
    this.tex.marketCobble.wrapT = THREE.RepeatWrapping;
    this.tex.marketCobble.repeat.set(10, 10);

    this.tex.marketAwning.wrapS = THREE.RepeatWrapping;
    this.tex.marketAwning.wrapT = THREE.RepeatWrapping;
    this.tex.marketAwning.repeat.set(2, 1);

    this.tex.gardenGrass.wrapS = THREE.RepeatWrapping;
    this.tex.gardenGrass.wrapT = THREE.RepeatWrapping;
    this.tex.gardenGrass.repeat.set(12, 12);

    this.tex.marbleFountain.wrapS = THREE.RepeatWrapping;
    this.tex.marbleFountain.wrapT = THREE.RepeatWrapping;
    this.tex.marbleFountain.repeat.set(2, 2);

    this.tex.runningTrack.wrapS = THREE.RepeatWrapping;
    this.tex.runningTrack.wrapT = THREE.RepeatWrapping;

    this.tex.stationBrick.wrapS = THREE.RepeatWrapping;
    this.tex.stationBrick.wrapT = THREE.RepeatWrapping;
    this.tex.stationBrick.repeat.set(8, 8);

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

    // 設定該空間專屬真實天空穹頂 (Sky Dome) 與大氣霧氣
    this.setupZoneSkyAndAtmosphere(group, zoneId);

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

  // 設定空間專屬 3D 天空穹頂與大氣效果 (徹底消除天空變成地板的錯誤！)
  setupZoneSkyAndAtmosphere(group, zoneId) {
    if (zoneId === 'zone1') {
      this.world.scene.background = new THREE.Color(0xdce8f5);
      this.world.scene.fog = new THREE.FogExp2(0xf0e6d6, 0.025);
      return;
    }

    let skyColorTop = 0x38bdf8;
    let fogColor = 0xe0f2fe;
    let fogDensity = 0.012;

    if (zoneId === 'zone5') {
      // 星光鐘樓車站：深邃午夜星空
      skyColorTop = 0x090d16;
      fogColor = 0x111827;
      fogDensity = 0.016;
    } else if (zoneId === 'zone3') {
      // 守護獸花園：晨曦天藍與清透薄霧
      skyColorTop = 0x7dd3fc;
      fogColor = 0xdcfce7;
      fogDensity = 0.012;
    } else if (zoneId === 'zone4') {
      // 活力操場：明亮晴空碧藍
      skyColorTop = 0x60a5fa;
      fogColor = 0xe0f2fe;
      fogDensity = 0.01;
    } else {
      // 陽光微風市集：地中海溫暖日光藍天
      skyColorTop = 0x38bdf8;
      fogColor = 0xfef3c7;
      fogDensity = 0.012;
    }

    this.world.scene.background = new THREE.Color(skyColorTop);
    this.world.scene.fog = new THREE.FogExp2(fogColor, fogDensity);

    // 建立 3D 半球形天頂 (Sky Dome, 內表面渲染)
    const skyGeo = new THREE.SphereGeometry(65, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const skyMat = new THREE.MeshBasicMaterial({
      color: skyColorTop,
      side: THREE.BackSide
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    skyDome.position.y = -2;
    group.add(skyDome);

    // 星光車站加入星宿微光粒子
    if (zoneId === 'zone5') {
      const starGeo = new THREE.BufferGeometry();
      const starCount = 320;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.46;
        starPos[i] = Math.sin(phi) * Math.cos(theta) * 58;
        starPos[i + 1] = Math.cos(phi) * 58;
        starPos[i + 2] = Math.sin(phi) * Math.sin(theta) * 58;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.16, transparent: true, opacity: 0.9 })
      );
      group.add(stars);
    }
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

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(16, 22, 14);
    sunLight.castShadow = true;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xffedd5, 0x9a3412, 0.7);
    group.add(hemiLight);

    // 開闊歐陸古鎮鵝卵石街區
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(64, 64),
      new THREE.MeshStandardMaterial({ map: this.tex.marketCobble, roughness: 0.85, metalness: 0.05 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    group.add(ground);

    // 城鎮立面建築群 (尺寸適中，屋頂絕不覆蓋玩家頭頂)
    this.buildTownStreetBlocks(group);

    // 蔬果與烘焙攤位 (自然有機分布)
    this.buildDetailedMarketStall(group, -4.5, 0, -1.0, 'apple', '🍎 甜美紅蘋果攤 (APPLE)', 'stall_apple', () => {
      this.world.openSpeechCard('APPLE', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_APPLE', '🍎 甜脆紅蘋果', '#ef4444');
      });
    }, 0.2);

    this.buildDetailedMarketStall(group, 4.2, 0, 1.2, 'banana', '🍌 活力金香蕉 (BANANA)', 'stall_banana', () => {
      this.world.openSpeechCard('BANANA', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_BANANA', '🍌 香甜金香蕉', '#eab308');
      });
    }, -0.3);

    this.buildDetailedCart(group, -3.2, 0, -5.2, 'bread', '🥖 剛出爐的烤麵包 (BREAD)', 'cart_bread', () => {
      this.world.openSpeechCard('BREAD', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_BREAD', '🥖 麥香長法棍', '#b45309');
      });
    }, 0.2);

    this.buildDetailedCart(group, 3.5, 0, -3.5, 'milk', '🥛 香濃鮮牛奶 (MILK)', 'cart_milk', () => {
      this.world.openSpeechCard('MILK', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_MILK', '🥛 牧場鮮牛奶', '#60a5fa');
      });
    }, -0.15);

    this.buildBuntingFlags(group, [-4.5, 3.2, -1.0], [4.2, 3.2, 1.2]);

    // 東北角城門吊橋 (OPEN)
    this.buildDrawbridgePortal(group, 6.8, 0, -8.0, '🏰 前往精靈花園的城門吊橋 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 恭喜！市集衛兵降下城門吊橋，解鎖前往精靈花園！');
      this.switchZone('zone3');
    }, -0.35);

    this.addFloatingParticles(group, 0xffedd5, 140, 36, 6);
  }

  // [市集] 城鎮真實街屋建築群 (山牆斜屋頂嚴格限制在建築本體上方)
  buildTownStreetBlocks(group) {
    const facadeMat = new THREE.MeshStandardMaterial({ map: this.tex.townFacade, roughness: 0.8 });
    const slateRoofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });

    // 1. 北側街屋
    const northBlock = new THREE.Group();
    northBlock.position.set(-4.5, 0, -11.0);

    const nBody = new THREE.Mesh(new THREE.BoxGeometry(17, 6.8, 3.8), facadeMat);
    nBody.position.y = 3.4;
    northBlock.add(nBody);

    const nRoof = new THREE.Mesh(new THREE.BoxGeometry(17.2, 1.8, 4.2), slateRoofMat);
    nRoof.position.y = 7.7;
    northBlock.add(nRoof);

    [-4.0, 3.0].forEach(cx => {
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.6, 0.7), stoneMat);
      chimney.position.set(cx, 8.8, 0);
      northBlock.add(chimney);
    });
    group.add(northBlock);

    // 2. 西側街屋
    const westBlock = new THREE.Group();
    westBlock.position.set(-11.5, 0, 0);

    const wBody = new THREE.Mesh(new THREE.BoxGeometry(3.8, 6.8, 20), facadeMat);
    wBody.position.y = 3.4;
    westBlock.add(wBody);

    const wRoof = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 20.2), slateRoofMat);
    wRoof.position.y = 7.7;
    westBlock.add(wRoof);
    group.add(westBlock);

    // 3. 南側街屋
    const southBlock = new THREE.Group();
    southBlock.position.set(-3.5, 0, 11.5);

    const sBody = new THREE.Mesh(new THREE.BoxGeometry(17, 6.8, 3.8), facadeMat);
    sBody.position.y = 3.4;
    southBlock.add(sBody);

    const sRoof = new THREE.Mesh(new THREE.BoxGeometry(17.2, 1.8, 4.2), slateRoofMat);
    sRoof.position.y = 7.7;
    southBlock.add(sRoof);
    group.add(southBlock);
  }

  // ==========================================
  // Zone 3: 守護獸之森花園 (Beast Sanctuary Garden)
  // ==========================================
  buildZone3_Garden(group) {
    this.initTextures();

    const sunLight = new THREE.DirectionalLight(0xfef9c3, 1.3);
    sunLight.position.set(12, 20, 8);
    sunLight.castShadow = true;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xdcfce7, 0x14532d, 0.8);
    group.add(hemiLight);

    // 開闊草坪 (72m x 72m)
    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(72, 72),
      new THREE.MeshStandardMaterial({ map: this.tex.gardenGrass, roughness: 0.9, metalness: 0.02 })
    );
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    group.add(grass);

    // 自然林線 (無死板圍欄)
    this.buildOrganicForestPerimeter(group);

    // 蜿蜒石板路
    this.buildWindingStonePath(group);

    // 散落小花
    this.buildScatteredFlowers(group);

    // 中央大理石噴泉 (WATER)
    this.buildMarbleFountain(group, -0.5, 0, -1.2, '⛲ 清涼純淨的活泉水 (WATER)', 'poi_water', () => {
      this.world.openSpeechCard('WATER', () => {
        this.world.addXP(60);
      });
    });

    // 守護白兔 (RABBIT)
    this.buildSculptedRabbit(group, 3.8, 0, 0.6, '🐰 正在草地上蹦跳的兔子 (RABBIT)', 'RABBIT', () => {
      this.world.openSpeechCard('RABBIT', () => {
        this.world.addXP(70);
      });
    });

    // 歌唱青鳥 (BIRD)
    this.buildBirdOnPedestal(group, -4.5, 0, 1.5, '🐦 枝頭歌唱的青鳥 (BIRD)', 'BIRD', () => {
      this.world.openSpeechCard('BIRD', () => {
        this.world.addXP(70);
      });
    });

    // 精靈古樹 (TREE)
    this.buildAncientWorldTree(group, 4.8, 0, -4.5, '🌳 茂密的精靈古樹 (TREE)', 'TREE', () => {
      this.world.openSpeechCard('TREE', () => {
        this.world.addXP(60);
      });
    });

    // 西北側自然林道拱門 (OPEN)
    this.buildRoseArchPortal(group, -6.5, 0, -8.0, '🌸 通往冒險操場的精靈古徑 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 森林古樹撥開枝枒，微風輕拂，解鎖前往活力操場！');
      this.switchZone('zone4');
    }, 0.35);

    this.addFloatingParticles(group, 0x86efac, 160, 36, 5.5);
  }

  // [花園] 自然有機林線與苔石
  buildOrganicForestPerimeter(group) {
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.85 });
    const pineLeafMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 });
    const oakLeafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 });
    const rockMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.9 });

    for (let i = 0; i < 26; i++) {
      const angle = (i / 26) * Math.PI * 2;
      const radius = 13.0 + Math.sin(i * 1.8) * 2.2;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius;

      if (tx < -4.5 && tz < -6.5) continue; // 留出西北出徑

      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, 0, tz);

      const height = 5.0 + Math.random() * 3.0;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, height * 0.4, 8), woodMat);
      trunk.position.y = height * 0.2;
      treeGroup.add(trunk);

      if (i % 2 === 0) {
        for (let t = 0; t < 3; t++) {
          const cone = new THREE.Mesh(new THREE.ConeGeometry(1.8 - t * 0.35, 2.0, 8), pineLeafMat);
          cone.position.y = height * 0.35 + t * 1.3;
          treeGroup.add(cone);
        }
      } else {
        const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0), oakLeafMat);
        bush.position.y = height * 0.5;
        treeGroup.add(bush);
      }
      group.add(treeGroup);
    }

    // 苔蘚巨石
    [[-9.0, -3.5], [8.5, 6.0], [7.0, -9.0]].forEach(([rx, rz]) => {
      const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4), rockMat);
      boulder.position.set(rx, 0.7, rz);
      group.add(boulder);
    });
  }

  // ==========================================
  // Zone 4: 活力冒險操場 (Athletic Sports Field)
  // 核心修復：幾何精準奧林匹克跑道 (徹底消除貼圖混亂！)
  // ==========================================
  buildZone4_Athletic(group) {
    this.initTextures();

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.45);
    sunLight.position.set(14, 25, 12);
    sunLight.castShadow = true;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x15803d, 0.75);
    group.add(hemiLight);

    // 外圍校園草坪 (72m x 72m)
    const outerGrass = new THREE.Mesh(
      new THREE.PlaneGeometry(72, 72),
      new THREE.MeshStandardMaterial({ map: this.tex.gardenGrass, roughness: 0.88 })
    );
    outerGrass.rotation.x = -Math.PI / 2;
    outerGrass.receiveShadow = true;
    group.add(outerGrass);

    // 幾何標準田徑跑道 (兩條直道 + 兩端半圓彎道，清晰白色 4 分道)
    this.buildOlympicRunningTrack(group);

    // 中央足球綠茵草坪
    const innerTurf = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 20),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 })
    );
    innerTurf.rotation.x = -Math.PI / 2;
    innerTurf.position.y = 0.03;
    innerTurf.receiveShadow = true;
    group.add(innerTurf);

    this.buildSoccerFieldLines(group);

    // 看台與設施
    this.buildStadiumSurroundings(group);

    // 足球與球門 (BALL / SOCCER)
    this.buildSoccerGoalAndBall(group, 0, 0, -4.0, '⚽ 草地上的足球 (SOCCER / BALL)', 'BALL', () => {
      this.world.openSpeechCard('BALL', () => {
        this.world.addXP(60);
      });
    });

    // 直道起跑點與助跑塊 (RUN) - 位於西直道
    this.buildStartingBlocks(group, -8.5, 0, 4.0, '🏃 起跑線加速奔跑 (RUN)', 'RUN', () => {
      this.world.openSpeechCard('RUN', () => {
        this.world.addXP(60);
      });
    });

    // 跳躍運動區 (JUMP) - 位於內場草坪
    this.buildJumpEquipment(group, 3.5, 0, 2.0, '🦘 體育跳箱與跳躍 (JUMP)', 'JUMP', () => {
      this.world.openSpeechCard('JUMP', () => {
        this.world.addXP(60);
      });
    });

    // 終點凱旋拱門 (OPEN) - 位於東直道衝刺終點線
    this.buildTrophyArchPortal(group, 8.5, 0, -6.0, '🏆 終點衝線冠軍金色拱門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 裁判長鳴哨！以驚人速度衝過終點線，前往星光車站！');
      this.switchZone('zone5');
    });
  }

  // [操場] 構建幾何精準奧林匹克跑道 (兩條直道 + 兩端半圓彎道，無任何貼圖扭曲)
  buildOlympicRunningTrack(group) {
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.85 });
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 西側直道 (寬 4.8m，長 24m)
    const straightW = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 24), rubberMat);
    straightW.rotation.x = -Math.PI / 2;
    straightW.position.set(-8.5, 0.02, 0);
    straightW.receiveShadow = true;
    group.add(straightW);

    // 東側直道 (寬 4.8m，長 24m)
    const straightE = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 24), rubberMat);
    straightE.rotation.x = -Math.PI / 2;
    straightE.position.set(8.5, 0.02, 0);
    straightE.receiveShadow = true;
    group.add(straightE);

    // 北端半圓彎道
    const curveN = new THREE.Mesh(new THREE.RingGeometry(6.1, 10.9, 32, 1, 0, Math.PI), rubberMat);
    curveN.rotation.x = -Math.PI / 2;
    curveN.rotation.z = Math.PI;
    curveN.position.set(0, 0.02, -12);
    curveN.receiveShadow = true;
    group.add(curveN);

    // 南端半圓彎道
    const curveS = new THREE.Mesh(new THREE.RingGeometry(6.1, 10.9, 32, 1, 0, Math.PI), rubberMat);
    curveS.rotation.x = -Math.PI / 2;
    curveS.position.set(0, 0.02, 12);
    curveS.receiveShadow = true;
    group.add(curveS);

    // 直道分道白線 (4 分道)
    [-1.8, -0.6, 0.6, 1.8].forEach(offset => {
      const lineW = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 24), whiteLineMat);
      lineW.rotation.x = -Math.PI / 2;
      lineW.position.set(-8.5 + offset, 0.025, 0);
      group.add(lineW);

      const lineE = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 24), whiteLineMat);
      lineE.rotation.x = -Math.PI / 2;
      lineE.position.set(8.5 + offset, 0.025, 0);
      group.add(lineE);
    });

    // 彎道同心分道白線
    [6.1, 7.3, 8.5, 9.7, 10.9].forEach(r => {
      const lN = new THREE.Mesh(new THREE.RingGeometry(r - 0.04, r + 0.04, 32, 1, 0, Math.PI), whiteLineMat);
      lN.rotation.x = -Math.PI / 2;
      lN.rotation.z = Math.PI;
      lN.position.set(0, 0.025, -12);
      group.add(lN);

      const lS = new THREE.Mesh(new THREE.RingGeometry(r - 0.04, r + 0.04, 32, 1, 0, Math.PI), whiteLineMat);
      lS.rotation.x = -Math.PI / 2;
      lS.position.set(0, 0.025, 12);
      group.add(lS);
    });

    // 起跑白斑線與終點衝線標記
    const startStripe = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.25), whiteLineMat);
    startStripe.rotation.x = -Math.PI / 2;
    startStripe.position.set(-8.5, 0.028, 6.0);
    group.add(startStripe);

    const finishStripe = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.25), whiteLineMat);
    finishStripe.rotation.x = -Math.PI / 2;
    finishStripe.position.set(8.5, 0.028, -6.0);
    group.add(finishStripe);
  }

  // ==========================================
  // Zone 5: 星光鐘樓車站 (Clocktower Train Station)
  // ==========================================
  buildZone5_Station(group) {
    this.initTextures();

    const moonLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
    moonLight.position.set(12, 22, -10);
    group.add(moonLight);

    const hemiLight = new THREE.HemisphereLight(0x312e81, 0x1e1b4b, 0.6);
    group.add(hemiLight);

    // 月台復古紅磚地面 (64m x 64m)
    const platform = new THREE.Mesh(
      new THREE.PlaneGeometry(64, 64),
      new THREE.MeshStandardMaterial({ map: this.tex.stationBrick, roughness: 0.8, metalness: 0.08 })
    );
    platform.rotation.x = -Math.PI / 2;
    platform.receiveShadow = true;
    group.add(platform);

    // 雙軌火車鐵道、枕木與碎石床 (貫穿延伸)
    this.buildTrainRailwayBed(group, 5.2);

    // 維多利亞鐵道鋼構拱架
    this.buildStationRoofStructure(group);

    // 西側候車大廳紅磚建築
    this.buildStationTerminalBuilding(group);

    // 巨型天文時鐘塔 (TIME / CLOCK)
    this.buildAstronomicalClockTower(group, -2.8, 0, -8.5, '🕰️ 月台巨型天文時鐘 (TIME / CLOCK)', 'TIME', () => {
      this.world.openSpeechCard('TIME', () => {
        this.world.addXP(80);
      });
    });

    // 3D 蒸汽特快車頭 (TRAIN) - 具備實體碰撞
    this.buildSteamLocomotive(group, 5.2, 0, -3.2, '🚂 魔法星光特快列車 (TRAIN)', 'TRAIN', () => {
      this.world.openSpeechCard('TRAIN', () => {
        this.world.addXP(80);
      });
    });

    // 晨曦煤氣路燈與長椅 (MORNING)
    this.buildGasLampAndBench(group, -4.5, 0, 1.0, '🌅 照亮晨曦的月台路燈 (MORNING)', 'MORNING', () => {
      this.world.openSpeechCard('MORNING', () => {
        this.world.addXP(80);
      });
    });

    // 客車登車大門 (OPEN) - 迎賓紅毯通往車廂
    this.buildTrainCarriageDoorPortal(group, 4.8, 0, 2.2, '🚂 登上通往大魔導士殿堂的列車門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 汽笛長鳴！恭喜完成全維度英語護照試煉！');
      if (this.world) this.world.triggerEscapeCelebration();
    });

    this.addFloatingParticles(group, 0xfde047, 180, 36, 7);
  }

  // [通用] 建造蜿蜒步道
  buildWindingStonePath(group) {
    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    for (let t = 0; t < 16; t++) {
      const z = 4.0 - t * 0.75;
      const x = Math.sin(t * 0.45) * 1.8;
      const step = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.05, 8), stoneMat);
      step.position.set(x, 0.03, z);
      step.receiveShadow = true;
      group.add(step);
    }
  }

  // [操場] 圍繞看台與設施
  buildStadiumSurroundings(group) {
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

    // 西側大看台
    const grandstand = new THREE.Group();
    grandstand.position.set(-13.5, 0, 0);
    for (let r = 0; r < 4; r++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45 * (r + 1), 16), steelMat);
      step.position.set(r * 1.0, (0.45 * (r + 1)) / 2, 0);
      grandstand.add(step);

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 15.6), woodMat);
      seat.position.set(r * 1.0, 0.45 * (r + 1) + 0.05, 0);
      grandstand.add(seat);
    }
    group.add(grandstand);

    // 北面記分牌
    const scoreboard = new THREE.Group();
    scoreboard.position.set(0, 0, -14.0);
    [-3.0, 3.0].forEach(px => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 6.0, 8), steelMat);
      pole.position.set(px, 3.0, 0);
      scoreboard.add(pole);
    });
    const board = new THREE.Mesh(new THREE.BoxGeometry(7.2, 3.2, 0.4), boardMat);
    board.position.set(0, 5.0, 0);
    scoreboard.add(board);
    group.add(scoreboard);
  }

  // [車站] 雨棚鋼架
  buildStationRoofStructure(group) {
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3 });
    [-8, -2, 4, 10].forEach(z => {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(7.2, 0.14, 8, 20, Math.PI), ironMat);
      arch.position.set(0.5, 5.2, z);
      group.add(arch);

      [-6.5, 7.5].forEach(x => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 5.5, 8), ironMat);
        col.position.set(x, 2.75, z);
        group.add(col);
      });
    });
  }

  // [車站] 西側月台候車大廳
  buildStationTerminalBuilding(group) {
    const brickMat = new THREE.MeshStandardMaterial({ map: this.tex.stationBrick, roughness: 0.8 });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7.5, 24), brickMat);
    wall.position.set(-10.5, 3.75, 0);
    group.add(wall);

    const windowMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.65,
      roughness: 0.3
    });
    [-6, 0, 6].forEach(wz => {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 2.8), windowMat);
      win.position.set(-9.85, 4.2, wz);
      win.rotation.y = Math.PI / 2;
      group.add(win);
    });
  }

  // [市集] 擬真水果帳篷攤位
  buildDetailedMarketStall(group, x, y, z, fruitType, label, id, onClick, rotationY = 0) {
    const stall = new THREE.Group();
    stall.position.set(x, y, z);
    stall.rotation.y = rotationY;

    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.65 });
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.15, 1.6), woodMat);
    tableTop.position.set(0, 0.95, 0);
    tableTop.castShadow = true;
    stall.add(tableTop);

    const legGeo = new THREE.BoxGeometry(0.12, 0.95, 0.12);
    [[-1.35, -0.65], [1.35, -0.65], [-1.35, 0.65], [1.35, 0.65]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(lx, 0.475, lz);
      stall.add(leg);
    });

    const poleGeo = new THREE.BoxGeometry(0.1, 1.8, 0.1);
    [[-1.35, -0.65], [1.35, -0.65], [-1.35, 0.65], [1.35, 0.65]].forEach(([px, pz]) => {
      const pole = new THREE.Mesh(poleGeo, woodMat);
      pole.position.set(px, 1.85, pz);
      stall.add(pole);
    });

    const canopyMat = new THREE.MeshStandardMaterial({ map: this.tex.marketAwning, roughness: 0.7, side: THREE.DoubleSide });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.3, 0.9, 4), canopyMat);
    roof.position.set(0, 3.1, 0);
    roof.rotation.y = Math.PI / 4;
    stall.add(roof);

    const valance = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.25, 0.05), canopyMat);
    valance.position.set(0, 2.7, 0.85);
    stall.add(valance);

    const crateMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.8 });
    [-0.65, 0.65].forEach(cx => {
      const crate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.8), crateMat);
      crate.position.set(cx, 1.15, 0);
      crate.rotation.x = 0.15;
      stall.add(crate);
    });

    if (fruitType === 'apple') {
      const appleMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
      const appleMatGreen = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.4 });
      for (let i = 0; i < 9; i++) {
        const apple = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), (i % 4 === 0) ? appleMatGreen : appleMatRed);
        const col = i % 3;
        const row = Math.floor(i / 3);
        apple.position.set(-0.95 + col * 0.28, 1.35 + (row > 1 ? 0.12 : 0), -0.2 + (row % 2) * 0.25);
        stall.add(apple);
      }
    } else if (fruitType === 'banana') {
      const bananaMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.45 });
      for (let b = 0; b < 6; b++) {
        const banana = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.045, 8, 12, Math.PI * 0.7), bananaMat);
        banana.rotation.z = Math.PI * 0.3;
        banana.position.set(-0.9 + (b % 3) * 0.3, 1.35, -0.15 + Math.floor(b / 3) * 0.25);
        stall.add(banana);
      }

      const brassMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.85, roughness: 0.25 });
      const scaleStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.7, 12), brassMat);
      scaleStand.position.set(0.65, 1.35, 0);
      stall.add(scaleStand);

      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.03), brassMat);
      crossBeam.position.set(0.65, 1.65, 0);
      stall.add(crossBeam);
    }

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.0, 2.0), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.5;
    hitBox.userData = { id, label, onClick };
    stall.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(stall);
  }

  // [市集] 擬真雙輪木造推車
  buildDetailedCart(group, x, y, z, cartType, label, id, onClick, rotationY = 0) {
    const cart = new THREE.Group();
    cart.position.set(x, y, z);
    cart.rotation.y = rotationY;

    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 1.1), woodMat);
    chassis.position.y = 0.65;
    cart.add(chassis);

    [-0.9, 0.9].forEach(wx => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, 0.5, 0);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.05, 8, 20), ironMat);
      wheelGroup.add(rim);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 10), woodMat);
      hub.rotation.z = Math.PI / 2;
      wheelGroup.add(hub);
      cart.add(wheelGroup);
    });

    if (cartType === 'bread') {
      const crustMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 });
      [-0.15, 0, 0.15].forEach((bx, idx) => {
        const baguette = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8), crustMat);
        baguette.position.set(bx, 1.1, (idx - 1) * 0.08);
        baguette.rotation.x = 0.35 + idx * 0.1;
        cart.add(baguette);
      });
    } else if (cartType === 'milk') {
      const milkLiquidMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      [[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.2], [0.3, 0.2]].forEach(([mx, mz]) => {
        const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.42, 10), milkLiquidMat);
        bottle.position.set(mx, 0.95, mz);
        cart.add(bottle);
      });
    }

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 1.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 0.9;
    hitBox.userData = { id, label, onClick };
    cart.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(cart);
  }

  // [市集] 節慶吊旗
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

  // [市集] 城門吊橋傳送門
  buildDrawbridgePortal(group, x, y, z, label, exitWord, onUnlocked, rotationY = 0) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);
    portal.rotation.y = rotationY;

    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });

    [-2.2, 2.2].forEach(tx => {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.2, 1.4), stoneMat);
      tower.position.set(tx, 2.6, 0);
      portal.add(tower);
    });

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.9, 1.2), stoneMat);
    lintel.position.set(0, 4.8, 0);
    portal.add(lintel);

    const gateDoor = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.0, 0.25), woodMat);
    gateDoor.position.set(0, 2.0, 0);
    portal.add(gateDoor);

    const runeBarrier = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 3.8),
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

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.2, 2.0), new THREE.MeshBasicMaterial({ visible: false }));
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

  // [花園] 散落野花
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

  // [花園] 大理石噴泉 (WATER)
  buildMarbleFountain(group, x, y, z, label, id, onClick) {
    const fountain = new THREE.Group();
    fountain.position.set(x, y, z);

    const marbleMat = new THREE.MeshStandardMaterial({ map: this.tex.marbleFountain, roughness: 0.35, metalness: 0.08 });
    const baseBasin = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.6, 16), marbleMat);
    baseBasin.position.y = 0.3;
    baseBasin.castShadow = true;
    fountain.add(baseBasin);

    const waterMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.8 });
    const poolWater = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.05, 16), waterMat);
    poolWater.position.y = 0.55;
    fountain.add(poolWater);

    const centralPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.4, 12), marbleMat);
    centralPillar.position.y = 1.2;
    fountain.add(centralPillar);

    const upperBasin = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.9, 0.3, 16), marbleMat);
    upperBasin.position.y = 1.9;
    fountain.add(upperBasin);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), marbleMat);
    finial.position.y = 2.2;
    fountain.add(finial);

    const sprayCount = 45;
    const sprayGeo = new THREE.BufferGeometry();
    const sprayPos = new Float32Array(sprayCount * 3);
    for (let i = 0; i < sprayCount * 3; i += 3) {
      sprayPos[i] = (Math.random() - 0.5) * 0.4;
      sprayPos[i + 1] = 2.2 + Math.random() * 0.8;
      sprayPos[i + 2] = (Math.random() - 0.5) * 0.4;
    }
    sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
    const sprayPoints = new THREE.Points(sprayGeo, new THREE.PointsMaterial({ color: 0xe0f2fe, size: 0.06, transparent: true, opacity: 0.85 }));
    fountain.add(sprayPoints);

    this.world.animators.push((time) => {
      const pos = sprayGeo.attributes.position.array;
      for (let i = 0; i < sprayCount * 3; i += 3) {
        pos[i + 1] += 0.02;
        if (pos[i + 1] > 3.1) pos[i + 1] = 2.2;
      }
      sprayGeo.attributes.position.needsUpdate = true;
      poolWater.position.y = 0.55 + Math.sin(time * 3) * 0.01;
    });

    const hitBox = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 2.6, 12), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.3;
    hitBox.userData = { id, label, onClick };
    fountain.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(fountain);
  }

  // [花園] 兔子 (RABBIT)
  buildSculptedRabbit(group, x, y, z, label, id, onClick) {
    const rabbit = new THREE.Group();
    rabbit.position.set(x, y, z);

    const furMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.65 });
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.5 });
    const carrotMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.45 });

    const mound = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.25, 12), new THREE.MeshStandardMaterial({ map: this.tex.gardenGrass, roughness: 0.9 }));
    mound.position.y = 0.125;
    rabbit.add(mound);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 14), furMat);
    body.position.y = 0.48;
    body.scale.set(1.0, 1.1, 1.15);
    rabbit.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), furMat);
    head.position.set(0, 0.82, 0.2);
    rabbit.add(head);

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

    const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.35, 8), carrotMat);
    carrot.position.set(0.15, 0.58, 0.35);
    carrot.rotation.z = -0.5;
    rabbit.add(carrot);

    const hitBox = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.5, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 0.75;
    hitBox.userData = { id, label, onClick };
    rabbit.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      head.rotation.y = Math.sin(time * 2) * 0.12;
      body.position.y = 0.48 + Math.abs(Math.sin(time * 3)) * 0.04;
    });

    group.add(rabbit);
  }

  // [花園] 青鳥 (BIRD)
  buildBirdOnPedestal(group, x, y, z, label, id, onClick) {
    const birdGroup = new THREE.Group();
    birdGroup.position.set(x, y, z);

    const marbleMat = new THREE.MeshStandardMaterial({ map: this.tex.marbleFountain, roughness: 0.4 });
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), marbleMat);
    plinth.position.y = 0.15;
    birdGroup.add(plinth);

    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.8, 12), marbleMat);
    column.position.y = 1.2;
    birdGroup.add(column);

    const capital = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.7), marbleMat);
    capital.position.y = 2.2;
    birdGroup.add(capital);

    const bird = new THREE.Group();
    bird.position.set(0, 2.45, 0);

    const blueFeatherMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.4 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), blueFeatherMat);
    body.scale.set(1.0, 1.1, 1.4);
    bird.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), blueFeatherMat);
    head.position.set(0, 0.15, 0.14);
    bird.add(head);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 6), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    beak.position.set(0, 0.14, 0.28);
    beak.rotation.x = Math.PI / 2;
    bird.add(beak);

    birdGroup.add(bird);

    const hitBox = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.4;
    hitBox.userData = { id, label, onClick };
    birdGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      head.rotation.y = Math.sin(time * 3) * 0.25;
      bird.position.y = 2.45 + Math.sin(time * 4) * 0.02;
    });

    group.add(birdGroup);
  }

  // [花園] 古樹 (TREE)
  buildAncientWorldTree(group, x, y, z, label, id, onClick) {
    const tree = new THREE.Group();
    tree.position.set(x, y, z);

    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.85 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.75 });

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.95, 3.2, 10), woodMat);
    trunk.position.y = 1.6;
    trunk.castShadow = true;
    tree.add(trunk);

    const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4), leafMat);
    canopy1.position.set(0, 4.0, 0);
    tree.add(canopy1);

    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.8 }));
    lamp.position.set(1.2, 3.0, 0.5);
    tree.add(lamp);

    const hitBox = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 4.8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.4;
    hitBox.userData = { id, label, onClick };
    tree.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(tree);
  }

  // [花園] 玫瑰拱門傳送門
  buildRoseArchPortal(group, x, y, z, label, exitWord, onUnlocked, rotationY = 0) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);
    portal.rotation.y = rotationY;

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const roseMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 });

    [-1.6, 1.6].forEach(px => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.8, 8), ironMat);
      pillar.position.set(px, 1.9, 0);
      portal.add(pillar);
    });

    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.08, 8, 16, Math.PI), ironMat);
    arch.position.set(0, 3.8, 0);
    portal.add(arch);

    for (let r = 0; r < 12; r++) {
      const ang = (r / 12) * Math.PI;
      const rx = Math.cos(ang) * 1.6;
      const ry = 3.8 + Math.sin(ang) * 1.6;
      const rose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), roseMat);
      rose.position.set(rx, ry, 0.05);
      portal.add(rose);
    }

    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 3.8),
      new THREE.MeshStandardMaterial({ color: 0x4ade80, transparent: true, opacity: 0.55, roughness: 0.1, emissive: 0x22c55e, emissiveIntensity: 0.25 })
    );
    door.position.y = 1.9;
    portal.add(door);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.2, 1.6), new THREE.MeshBasicMaterial({ visible: false }));
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

  // [操場] 足球劃線
  buildSoccerFieldLines(group) {
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const border = new THREE.Mesh(new THREE.RingGeometry(5.8, 5.9, 4), lineMat);
    border.rotation.x = -Math.PI / 2;
    border.rotation.z = Math.PI / 4;
    border.position.y = 0.035;
    group.add(border);

    const centerCircle = new THREE.Mesh(new THREE.RingGeometry(2.0, 2.08, 24), lineMat);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.y = 0.035;
    group.add(centerCircle);
  }

  // [操場] 足球門與足球 (BALL)
  buildSoccerGoalAndBall(group, x, y, z, label, id, onClick) {
    const goalGroup = new THREE.Group();
    goalGroup.position.set(x, y, z);

    const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const netMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, wireframe: true, transparent: true, opacity: 0.4 });

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

    const netBox = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.4, 1.4), netMat);
    netBox.position.set(0, 1.2, -0.7);
    goalGroup.add(netBox);

    // 足球
    const ballGroup = new THREE.Group();
    ballGroup.position.set(0, 0.24, 1.2);
    const ballBase = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 }));
    ballGroup.add(ballBase);

    const ballMatBlack = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35 });
    for (let p = 0; p < 6; p++) {
      const patch = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 5), ballMatBlack);
      patch.position.set(Math.sin(p * 1.05) * 0.22, Math.cos(p * 1.05) * 0.22, (p % 2 === 0 ? 0.08 : -0.08));
      patch.lookAt(ballGroup.position);
      ballGroup.add(patch);
    }
    goalGroup.add(ballGroup);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.8, 3.0), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.3;
    hitBox.userData = { id, label, onClick };
    goalGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(goalGroup);
  }

  // [操場] 跑道起跑線與接力棒 (RUN)
  buildStartingBlocks(group, x, y, z, label, id, onClick) {
    const runGroup = new THREE.Group();
    runGroup.position.set(x, y, z);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
    const batonMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7, roughness: 0.2 });

    [-0.3, 0.3].forEach(bx => {
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.3), steelMat);
      block.position.set(bx, 0.08, 0.35);
      block.rotation.x = -0.4;
      runGroup.add(block);
    });

    const baton = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12), batonMat);
    baton.position.set(0, 0.18, -0.4);
    baton.rotation.z = Math.PI / 2;
    runGroup.add(baton);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 2.0), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 0.5;
    hitBox.userData = { id, label, onClick };
    runGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(runGroup);
  }

  // [操場] 跳箱跳高設備 (JUMP)
  buildJumpEquipment(group, x, y, z, label, id, onClick) {
    const jumpGroup = new THREE.Group();
    jumpGroup.position.set(x, y, z);

    const matMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 1.8), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 }));
    matMesh.position.set(0, 0.25, 0);
    jumpGroup.add(matMesh);

    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.4, 8), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    crossbar.position.set(0, 1.35, -1.0);
    crossbar.rotation.z = Math.PI / 2;
    jumpGroup.add(crossbar);

    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const vaultBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.65, 1.2), woodMat);
    vaultBox.position.set(-1.8, 0.325, 0.2);
    jumpGroup.add(vaultBox);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 3.0), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.0;
    hitBox.userData = { id, label, onClick };
    jumpGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(jumpGroup);
  }

  // [操場] 終點凱旋拱門 (OPEN)
  buildTrophyArchPortal(group, x, y, z, label, exitWord, onUnlocked, rotationY = 0) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);
    portal.rotation.y = rotationY;

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.25 });
    [-1.8, 1.8].forEach(px => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 4.0, 12), goldMat);
      pillar.position.set(px, 2.0, 0);
      portal.add(pillar);
    });

    const topBar = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.7, 0.8), goldMat);
    topBar.position.set(0, 4.35, 0);
    portal.add(topBar);

    const starEmblem = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45), goldMat);
    starEmblem.position.set(0, 5.0, 0);
    portal.add(starEmblem);

    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 4.0),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, transparent: true, opacity: 0.6, roughness: 0.1, emissive: 0xf59e0b, emissiveIntensity: 0.35 })
    );
    door.position.y = 2.0;
    portal.add(door);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.5, 1.6), new THREE.MeshBasicMaterial({ visible: false }));
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

  // [車站] 火車鐵道與枕木
  buildTrainRailwayBed(group, trackX) {
    const gravelMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 });
    const sleeperMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.85 });
    const steelRailMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });

    const bed = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.12, 60), gravelMat);
    bed.position.set(trackX, 0.06, 0);
    bed.receiveShadow = true;
    group.add(bed);

    for (let z = -28; z <= 28; z += 1.2) {
      const sleeper = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.14, 0.32), sleeperMat);
      sleeper.position.set(trackX, 0.14, z);
      group.add(sleeper);
    }

    [-0.95, 0.95].forEach(rx => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 60), steelRailMat);
      rail.position.set(trackX + rx, 0.26, 0);
      group.add(rail);
    });
  }

  // [車站] 天文時鐘塔 (TIME)
  buildAstronomicalClockTower(group, x, y, z, label, id, onClick) {
    const tower = new THREE.Group();
    tower.position.set(x, y, z);

    const brickMat = new THREE.MeshStandardMaterial({ map: this.tex.stationBrick, roughness: 0.8 });
    const roofCopperMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, metalness: 0.5, roughness: 0.4 });

    const towerBody = new THREE.Mesh(new THREE.BoxGeometry(3.8, 9.5, 3.8), brickMat);
    towerBody.position.y = 4.75;
    towerBody.castShadow = true;
    tower.add(towerBody);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.0, 4.0, 4), roofCopperMat);
    roof.position.y = 11.5;
    roof.rotation.y = Math.PI / 4;
    tower.add(roof);

    const dialMat = new THREE.MeshStandardMaterial({ map: this.tex.clockFace, roughness: 0.35, metalness: 0.25 });
    const clockDial = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.12, 24), dialMat);
    clockDial.rotation.x = Math.PI / 2;
    clockDial.position.set(0, 7.2, 1.96);
    tower.add(clockDial);

    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.8, roughness: 0.2 });
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.04), brassMat);
    hourHand.position.set(0, 7.2, 2.05);
    tower.add(hourHand);

    const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.95, 0.04), brassMat);
    minuteHand.position.set(0, 7.2, 2.06);
    tower.add(minuteHand);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(4.5, 10.0, 4.5), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 5.0;
    hitBox.userData = { id, label, onClick };
    tower.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      minuteHand.rotation.z = -time * 0.8;
      hourHand.rotation.z = -time * 0.06;
    });

    group.add(tower);
  }

  // [車站] 蒸汽火車頭 (TRAIN)
  buildSteamLocomotive(group, x, y, z, label, id, onClick) {
    const train = new THREE.Group();
    train.position.set(x, y, z);

    const blackIronMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.7 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.85 });
    const frontTexMat = new THREE.MeshStandardMaterial({ map: this.tex.locomotive, roughness: 0.5, metalness: 0.3 });

    const boiler = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 5.2, 16), blackIronMat);
    boiler.rotation.x = Math.PI / 2;
    boiler.position.set(0, 1.6, 0);
    train.add(boiler);

    [-1.5, 0, 1.5].forEach(bz => {
      const band = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.04, 8, 20), brassMat);
      band.position.set(0, 1.6, bz);
      train.add(band);
    });

    const frontDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.2, 20), frontTexMat);
    frontDisc.rotation.x = Math.PI / 2;
    frontDisc.position.set(0, 1.6, 2.6);
    train.add(frontDisc);

    const headlight = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.4, 12), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 1.0 }));
    headlight.rotation.x = Math.PI / 2;
    headlight.position.set(0, 2.5, 2.5);
    train.add(headlight);

    const headSpot = new THREE.SpotLight(0xfef08a, 2.2, 20, Math.PI / 6, 0.4);
    headSpot.position.set(0, 2.5, 2.6);
    headSpot.target.position.set(0, 1.0, 12.0);
    train.add(headSpot);
    train.add(headSpot.target);

    const cowcatcher = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.0, 4), blackIronMat);
    cowcatcher.position.set(0, 0.5, 2.9);
    cowcatcher.rotation.x = Math.PI / 4;
    train.add(cowcatcher);

    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.2, 0.9, 12), blackIronMat);
    chimney.position.set(0, 2.9, 1.6);
    train.add(chimney);

    const steamCount = 30;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount * 3; i += 3) {
      steamPos[i] = (Math.random() - 0.5) * 0.3;
      steamPos[i + 1] = 3.3 + Math.random() * 1.5;
      steamPos[i + 2] = 1.6 + (Math.random() - 0.5) * 0.4;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamPoints = new THREE.Points(steamGeo, new THREE.PointsMaterial({ color: 0xf1f5f9, size: 0.22, transparent: true, opacity: 0.65 }));
    train.add(steamPoints);

    [-1.15, 1.15].forEach(wx => {
      [-1.6, 0, 1.6].forEach(wz => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.15, 16), blackIronMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.55, wz);
        train.add(wheel);
      });
    });

    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 2.0), blackIronMat);
    cab.position.set(0, 2.0, -2.4);
    train.add(cab);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.6, 6.8), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.8;
    hitBox.userData = { id, label, onClick };
    train.add(hitBox);
    this.world.interactables.push(hitBox);

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

  // [車站] 煤氣路燈與長椅 (MORNING)
  buildGasLampAndBench(group, x, y, z, label, id, onClick) {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(x, y, z);

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 3.4, 8), ironMat);
    post.position.y = 1.7;
    lampGroup.add(post);

    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.16, 0.5, 6), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.8, roughness: 0.2 }));
    lantern.position.y = 3.5;
    lampGroup.add(lantern);

    const pLight = new THREE.PointLight(0xfde047, 1.5, 9);
    pLight.position.y = 3.5;
    lampGroup.add(pLight);

    const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.5), woodMat);
    benchSeat.position.set(0, 0.45, 0.6);
    lampGroup.add(benchSeat);

    const benchBack = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.08), woodMat);
    benchBack.position.set(0, 0.8, 0.82);
    lampGroup.add(benchBack);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.8, 1.8), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.9;
    hitBox.userData = { id, label, onClick };
    lampGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(lampGroup);
  }

  // [車站] 客車車廂登車門 (OPEN)
  buildTrainCarriageDoorPortal(group, x, y, z, label, exitWord, onUnlocked) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);

    const coachMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.4, metalness: 0.2 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 });

    const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.3), coachMat);
    frameL.position.set(-1.1, 1.6, 0);
    portal.add(frameL);

    const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.3), coachMat);
    frameR.position.set(1.1, 1.6, 0);
    portal.add(frameR);

    const topArch = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 0.3), coachMat);
    topArch.position.set(0, 3.2, 0);
    portal.add(topArch);

    [-0.9, 0.9].forEach(hx => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8), brassMat);
      rail.position.set(hx, 1.2, 0.3);
      portal.add(rail);
    });

    const carpet = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 3.0), new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 }));
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.03, 1.5);
    portal.add(carpet);

    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 2.9),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, transparent: true, opacity: 0.65, roughness: 0.1, emissive: 0xfbbf24, emissiveIntensity: 0.4 })
    );
    door.position.y = 1.5;
    portal.add(door);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.6, 2.0), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.6;
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

  // [通用] 發光浮游粒子
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
