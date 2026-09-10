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
        // 南側街屋建築實體 (左翼與右翼，中間保留寬敞驛站出入口)
        { type: 'box', minX: -14.0, maxX: -1.8, minZ: 9.3, maxZ: 14.0 },
        { type: 'box', minX: 1.8, maxX: 8.0, minZ: 9.3, maxZ: 14.0 },
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
        // 西側宏偉主看台大建築群 (階梯朝東、後方安全牆朝西)
        { type: 'box', minX: -16.5, maxX: -10.8, minZ: -14.5, maxZ: 14.5 },
        // 北側大型數位記分大屏幕與鋼架
        { type: 'box', minX: -4.8, maxX: 4.8, minZ: -15.8, maxZ: -13.5 },
        // 足球門立柱與球網實體
        { type: 'box', minX: -2.5, maxX: 2.5, minZ: -10.2, maxZ: -8.0 },
        // 躍動跳高墊、跳箱與沙坑
        { type: 'box', minX: 1.8, maxX: 4.8, minZ: 2.0, maxZ: 5.2 },
        // 東側球員教練替補席
        { type: 'box', minX: 4.6, maxX: 6.0, minZ: -2.2, maxZ: 2.2 }
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

    // 東北角城門吊橋 (OPEN -> 前往 Zone 3 守護獸花園)
    this.buildDrawbridgePortal(group, 6.8, 0, -8.0, '🏰 前往精靈花園的城門吊橋 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 恭喜！市集衛兵降下城門吊橋，解鎖前往精靈花園！');
      this.switchZone('zone3');
    }, -0.35);

    // 南側驛站拱門 (返回 Zone 1 見習學徒書齋)
    this.buildTownSouthEntrance(group, 0, 0, 10.5, '🏰 驛站古道 ➔ 返回【見習學徒書齋】', () => {
      this.world.showToast('🧭 穿過驛站石板古徑，返回見習學徒書齋！');
      this.switchZone('zone1');
    });

    // 市集生活感道具 (木桶、木箱、店鋪招牌、鑄鐵路燈)
    this.buildMarketStreetProps(group);

    this.addFloatingParticles(group, 0xffedd5, 140, 36, 6);
  }

  // [市集] 城鎮真實街屋建築群 (山牆斜屋頂嚴格限制在建築本體上方，南側保留驛站拱門通道)
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

    // 3. 南側街屋 (左翼與右翼，中間保留 3.6m 寬中央拱門通道)
    const southBlock = new THREE.Group();
    southBlock.position.set(0, 0, 11.5);

    // 左翼
    const sBodyL = new THREE.Mesh(new THREE.BoxGeometry(11, 6.8, 3.8), facadeMat);
    sBodyL.position.set(-7.5, 3.4, 0);
    southBlock.add(sBodyL);

    const sRoofL = new THREE.Mesh(new THREE.BoxGeometry(11.2, 1.8, 4.2), slateRoofMat);
    sRoofL.position.set(-7.5, 7.7, 0);
    southBlock.add(sRoofL);

    // 右翼
    const sBodyR = new THREE.Mesh(new THREE.BoxGeometry(6, 6.8, 3.8), facadeMat);
    sBodyR.position.set(5.0, 3.4, 0);
    southBlock.add(sBodyR);

    const sRoofR = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.8, 4.2), slateRoofMat);
    sRoofR.position.set(5.0, 7.7, 0);
    southBlock.add(sRoofR);

    // 連接中央拱門石樑
    const sArchBeam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.6, 4.0), stoneMat);
    sArchBeam.position.set(0, 6.0, 0);
    southBlock.add(sArchBeam);

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

    // 西北側自然林道拱門 (OPEN -> 前往 Zone 4 操場)
    this.buildRoseArchPortal(group, -6.5, 0, -8.0, '🌸 通往冒險操場的精靈古徑 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 森林古樹撥開枝枒，微風輕拂，解鎖前往活力操場！');
      this.switchZone('zone4');
    }, 0.35);

    // 南側入園花廊 (返回 Zone 2 陽光微風市集)
    this.buildGardenSouthEntrance(group, 0, 0, 11.5, '🍎 林間小徑 ➔ 返回【陽光微風市集】', () => {
      this.world.showToast('🧭 沿著林間小徑漫步，返回陽光微風市集！');
      this.switchZone('zone2');
    });

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
      if (Math.abs(tx) < 2.5 && tz > 9.5) continue; // 留出南方出徑 (往市集)

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
  // 全面旗艦級升級：奧林匹克標準紅土跑道、正規綠茵足球場、東向全景大看台與挑高遮雨棚
  // ==========================================
  buildZone4_Athletic(group) {
    this.initTextures();

    // 陽光與環境光
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.35);
    sunLight.position.set(16, 28, 14);
    sunLight.castShadow = true;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x15803d, 0.7);
    group.add(hemiLight);

    // 外圍校園草坪 (76m x 76m)
    const outerGrass = new THREE.Mesh(
      new THREE.PlaneGeometry(76, 76),
      new THREE.MeshStandardMaterial({ map: this.tex.gardenGrass, roughness: 0.9 })
    );
    outerGrass.rotation.x = -Math.PI / 2;
    outerGrass.receiveShadow = true;
    group.add(outerGrass);

    // 幾何標準田徑跑道 (奧林匹克 4 分道，向外延展無交叉，附帶清晰跑道數字 1~4)
    this.buildOlympicRunningTrack(group);

    // 中央雙色條紋足球綠茵草坪 (11m x 22m)
    const turfMat = new THREE.MeshStandardMaterial({
      map: this.createSoccerTurfTexture(),
      roughness: 0.75
    });
    const innerTurf = new THREE.Mesh(new THREE.PlaneGeometry(11.2, 22.4), turfMat);
    innerTurf.rotation.x = -Math.PI / 2;
    innerTurf.position.y = 0.03;
    innerTurf.receiveShadow = true;
    group.add(innerTurf);

    // 國際標準足球場劃線 (白線、中圈、禁區與角旗)
    this.buildSoccerFieldLines(group);

    // 西側面向操場之宏偉主看台、挑高遮陽雨棚、北側大型 LED 記分板、4 座夜間投光燈塔、替補席與林蔭
    this.buildStadiumSurroundings(group);

    // 足球與標準球門 (BALL / SOCCER) - 位於北側禁區
    this.buildSoccerGoalAndBall(group, 0, 0, -8.5, '⚽ 綠茵場上的足球 (SOCCER / BALL)', 'BALL', () => {
      this.world.openSpeechCard('BALL', () => {
        this.world.addXP(60);
      });
    });

    // 直道起跑點、助跑塊與接力棒 (RUN) - 位於西直道第 1 分道
    this.buildStartingBlocks(group, -7.3, 0, 4.0, '🏃 起跑線加速奔跑 (RUN)', 'RUN', () => {
      this.world.openSpeechCard('RUN', () => {
        this.world.addXP(60);
      });
    });

    // 跳躍運動區 (JUMP) - 位於內場跳高墊、跳箱與沙坑
    this.buildJumpEquipment(group, 2.8, 0, 3.2, '🦘 體育跳箱與跳躍 (JUMP)', 'JUMP', () => {
      this.world.openSpeechCard('JUMP', () => {
        this.world.addXP(60);
      });
    });

    // 終點衝刺凱旋拱門 (OPEN -> 前往 Zone 5 星光車站)
    this.buildTrophyArchPortal(group, 8.5, 0, -6.0, '🏆 終點衝線冠軍金色拱門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 裁判長鳴哨！以驚人速度衝過終點線，解鎖星光車站！');
      this.switchZone('zone5');
    });

    // 西南側入場合成拱門 (返回 Zone 3 守護獸之森花園)
    this.buildStadiumEntryArch(group, -7.5, 0, 11.0, '🐰 校園林蔭 ➔ 返回【守護獸之森花園】', () => {
      this.world.showToast('🧭 漫步穿過校園林蔭，返回守護獸之森花園！');
      this.switchZone('zone3');
    });

    this.addFloatingParticles(group, 0x67e8f9, 140, 36, 6);
  }

  // [操場] 構建標準幾何奧林匹克跑道 (兩條直道 + 兩端半圓彎道外凸，零貼圖扭曲與交叉)
  buildOlympicRunningTrack(group) {
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.85 });
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 西側直道 (寬 4.8m，涵蓋 X: -10.9 ~ -6.1，長 24m)
    const straightW = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 24), rubberMat);
    straightW.rotation.x = -Math.PI / 2;
    straightW.position.set(-8.5, 0.02, 0);
    straightW.receiveShadow = true;
    group.add(straightW);

    // 東側直道 (寬 4.8m，涵蓋 X: 6.1 ~ 10.9，長 24m)
    const straightE = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 24), rubberMat);
    straightE.rotation.x = -Math.PI / 2;
    straightE.position.set(8.5, 0.02, 0);
    straightE.receiveShadow = true;
    group.add(straightE);

    // 北端半圓彎道 (中心在 Z = -12，幾何外凸向北 Z <= -12，絕不往內侵入球場)
    const curveN = new THREE.Mesh(new THREE.RingGeometry(6.1, 10.9, 48, 1, 0, Math.PI), rubberMat);
    curveN.rotation.x = -Math.PI / 2;
    curveN.position.set(0, 0.02, -12);
    curveN.receiveShadow = true;
    group.add(curveN);

    // 南端半圓彎道 (中心在 Z = +12，幾何外凸向南 Z >= 12，絕不往內侵入球場)
    const curveS = new THREE.Mesh(new THREE.RingGeometry(6.1, 10.9, 48, 1, Math.PI, Math.PI), rubberMat);
    curveS.rotation.x = -Math.PI / 2;
    curveS.position.set(0, 0.02, 12);
    curveS.receiveShadow = true;
    group.add(curveS);

    // 直道分道白線 (4 分道，5 條分道標線，每道寬 1.2m)
    [-2.4, -1.2, 0, 1.2, 2.4].forEach(offset => {
      const lineW = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 24), whiteLineMat);
      lineW.rotation.x = -Math.PI / 2;
      lineW.position.set(-8.5 + offset, 0.025, 0);
      group.add(lineW);

      const lineE = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 24), whiteLineMat);
      lineE.rotation.x = -Math.PI / 2;
      lineE.position.set(8.5 + offset, 0.025, 0);
      group.add(lineE);
    });

    // 彎道同心分道白線 (外凸弧線完美接合直道)
    [6.1, 7.3, 8.5, 9.7, 10.9].forEach(r => {
      const lN = new THREE.Mesh(new THREE.RingGeometry(r - 0.035, r + 0.035, 48, 1, 0, Math.PI), whiteLineMat);
      lN.rotation.x = -Math.PI / 2;
      lN.position.set(0, 0.026, -12);
      group.add(lN);

      const lS = new THREE.Mesh(new THREE.RingGeometry(r - 0.035, r + 0.035, 48, 1, Math.PI, Math.PI), whiteLineMat);
      lS.rotation.x = -Math.PI / 2;
      lS.position.set(0, 0.026, 12);
      group.add(lS);
    });

    // 跑道起跑數字標記 (1, 2, 3, 4) - 位於西直道南端起跑區
    ['1', '2', '3', '4'].forEach((numStr, idx) => {
      // 內道至外道 X 分布: -7.3, -8.5, -9.7, -10.3
      const laneX = -6.7 - idx * 1.2;
      const numTex = this.createTrackLaneNumberTexture(numStr);
      if (numTex) {
        const numMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(0.8, 1.3),
          new THREE.MeshBasicMaterial({ map: numTex, transparent: true, opacity: 0.92 })
        );
        numMesh.rotation.x = -Math.PI / 2;
        numMesh.position.set(laneX, 0.028, 5.5);
        group.add(numMesh);
      }
    });

    // 起跑白斑線與終點衝線標記
    const startStripe = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.25), whiteLineMat);
    startStripe.rotation.x = -Math.PI / 2;
    startStripe.position.set(-8.5, 0.028, 6.2);
    group.add(startStripe);

    const finishStripe = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.35), whiteLineMat);
    finishStripe.rotation.x = -Math.PI / 2;
    finishStripe.position.set(8.5, 0.028, -6.0);
    group.add(finishStripe);

    // 在直道第 3、4 分道設置奧林匹克跨欄 (Hurdles) 增添運動氛圍
    this.buildOlympicHurdle(group, -9.7, 0, 0);
    this.buildOlympicHurdle(group, -8.5, 0, -3.5);
  }

  // [操場] 專業奧林匹克田徑跨欄
  buildOlympicHurdle(group, x, y, z) {
    const hurdle = new THREE.Group();
    hurdle.position.set(x, y, z);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    const barMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 兩側 L 型立柱底座
    [-0.5, 0.5].forEach(hx => {
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.6), steelMat);
      foot.position.set(hx, 0.025, 0);
      hurdle.add(foot);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.85, 8), steelMat);
      post.position.set(hx, 0.45, 0.15);
      hurdle.add(post);
    });

    // 橫向木製/泡棉跨欄頂板
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.12, 0.04), barMat);
    topBar.position.set(0, 0.88, 0.15);
    hurdle.add(topBar);

    // 頂板黑白斑馬標紋
    [-0.35, 0, 0.35].forEach(sx => {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.12), stripeMat);
      s.position.set(sx, 0.88, 0.172);
      hurdle.add(s);
    });

    group.add(hurdle);
  }

  // [操場] 生成跑道數字貼圖 CanvasTexture
  createTrackLaneNumberTexture(numStr) {
    if (typeof document === 'undefined' || !document.createElement) return null;
    const canvas = document.createElement('canvas');
    if (!canvas || !canvas.getContext) return null;
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 256, 512);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 320px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(numStr, 128, 256);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  // [操場] 生成條紋草坪貼圖 CanvasTexture
  createSoccerTurfTexture() {
    if (typeof document === 'undefined' || !document.createElement) return null;
    const canvas = document.createElement('canvas');
    if (!canvas || !canvas.getContext) return null;
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const stripeHeight = 64;
    for (let y = 0; y < 1024; y += stripeHeight) {
      ctx.fillStyle = (y / stripeHeight) % 2 === 0 ? '#15803d' : '#16a34a';
      ctx.fillRect(0, y, 512, stripeHeight);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    tex.needsUpdate = true;
    return tex;
  }

  // [操場] 生成大型數位記分大屏幕 LED 貼圖
  createScoreboardTexture() {
    if (typeof document === 'undefined' || !document.createElement) return null;
    const canvas = document.createElement('canvas');
    if (!canvas || !canvas.getContext) return null;
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 12;
    ctx.strokeRect(12, 12, 1000, 488);

    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(20, 20, 984, 80);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 38px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 XINGANG SPORTS FESTIVAL • 活力校園運動會 🏃', 512, 75);

    ctx.fillStyle = '#111827';
    ctx.fillRect(40, 120, 430, 260);
    ctx.fillRect(554, 120, 430, 260);

    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('HOME • 勇者隊', 255, 175);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 110px "Courier New", monospace';
    ctx.fillText('03', 255, 310);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('VS', 512, 260);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('GUEST • 精靈隊', 769, 175);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 110px "Courier New", monospace';
    ctx.fillText('02', 769, 310);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(40, 400, 944, 80);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.fillText('⏱️ TIME: 88:26   |   STAGE: ZONE 4 ATHLETIC   |   LEVEL: 4', 512, 452);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
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

    // 客車登車大門 (OPEN) - 迎賓紅毯通往車廂 (通往大魔導士殿堂)
    this.buildTrainCarriageDoorPortal(group, 4.8, 0, 2.2, '🚂 登上通往大魔導士殿堂的列車門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 汽笛長鳴！恭喜完成全維度英語護照試煉！');
      if (this.world) this.world.triggerEscapeCelebration();
    });

    // 南側出站口閘門 (返回 Zone 4 活力冒險操場)
    this.buildStationSouthExitGate(group, -1.0, 0, 12.0, '⚽ 車站出站閘口 ➔ 返回【活力冒險操場】', () => {
      this.world.showToast('🧭 穿過古典出站閘口，返回活力冒險操場！');
      this.switchZone('zone4');
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

  // [操場] 圍繞看台與設施：西側面向球場宏偉主看台、挑高遮陽雨棚、北側高科技 LED 屏幕、4 座巨型燈塔與校園林蔭
  buildStadiumSurroundings(group) {
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.75 });
    const blueSeatMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35 });
    const amberSeatMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.25 });
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, side: THREE.DoubleSide });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });

    // ==========================================
    // 1. 西側宏偉主看台 (全方位修正：階梯朝東面向球場，向西逐層攀升！)
    // ==========================================
    const grandstand = new THREE.Group();
    // 看台面寬 28m (Z: -14 ~ 14)
    // 5 層台階，向西 (負 X 方向) 漸次升高：
    // Row 0 (前排最近跑道 X = -11.4): 高 0.45m
    // Row 1 (X = -12.4): 高 0.85m
    // Row 2 (X = -13.4): 高 1.25m
    // Row 3 (X = -14.4): 高 1.65m
    // Row 4 (後排 X = -15.4): 高 2.05m
    for (let r = 0; r < 5; r++) {
      const stepX = -11.4 - r * 1.0;
      const stepH = 0.45 + r * 0.40;

      // 混凝土看台階梯基座
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, stepH, 28), concreteMat);
      stepMesh.position.set(stepX, stepH / 2, 0);
      stepMesh.receiveShadow = true;
      grandstand.add(stepMesh);

      // 看台座位：藍黃相間的專業塑膠桶型座椅 (面向東邊操場！)
      const seatMat = (r % 2 === 0) ? blueSeatMat : amberSeatMat;
      for (let z = -13.0; z <= 13.0; z += 1.0) {
        if (Math.abs(z) < 1.0) continue; // 留出中央走道 (Aisle)
        const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.65), seatMat);
        seatBase.position.set(stepX, stepH + 0.04, z);
        grandstand.add(seatBase);

        // 靠背 (面向東方 +X，靠背位於西方 -X)
        const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.65), seatMat);
        seatBack.position.set(stepX - 0.22, stepH + 0.22, z);
        grandstand.add(seatBack);
      }
    }

    // 中央安全走道與黃黑警示條紋
    const aisleMesh = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.02, 1.8), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }));
    aisleMesh.position.set(-13.4, 0.03, 0);
    grandstand.add(aisleMesh);

    // 走道不鏽鋼安全扶手
    [-0.8, 0.8].forEach(az => {
      for (let rx = -11.4; rx >= -15.4; rx -= 1.0) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 8), chromeMat);
        const curH = 0.45 + Math.abs(rx - (-11.4)) * 0.40;
        post.position.set(rx, curH + 0.425, az);
        grandstand.add(post);
      }
      const rail = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.05, 0.05), chromeMat);
      rail.position.set(-13.4, 1.7, az);
      rail.rotation.z = 0.38;
      grandstand.add(rail);
    });

    // 看台後方護牆 (X = -16.0)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.2, 28), concreteMat);
    backWall.position.set(-16.0, 1.6, 0);
    grandstand.add(backWall);

    // 看台南北端側山牆
    [-14.0, 14.0].forEach(ez => {
      const endWall = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.6, 0.4), concreteMat);
      endWall.position.set(-13.4, 1.3, ez);
      grandstand.add(endWall);
    });

    // 挑高弧形懸臂鋼構雨棚 (Cantilever Stadium Canopy，挑高 5.8m 遮雨棚覆蓋座位)
    [-10, -3.5, 3.5, 10].forEach(cz => {
      // 垂直支撐鋼柱
      const pCol = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 6.0, 12), steelMat);
      pCol.position.set(-16.0, 3.0, cz);
      grandstand.add(pCol);

      // 前伸斜桁架 (Cantilever Truss)
      const truss = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.2, 0.2), steelMat);
      truss.position.set(-13.0, 5.8, cz);
      truss.rotation.z = -0.08;
      grandstand.add(truss);
    });

    // 白色流線型雨棚頂板
    const canopyRoof = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 29), canopyMat);
    canopyRoof.position.set(-13.0, 5.9, 0);
    canopyRoof.rotation.x = -Math.PI / 2;
    canopyRoof.rotation.y = 0.08;
    grandstand.add(canopyRoof);

    group.add(grandstand);

    // ==========================================
    // 2. 北側高科技 LED 數位電子記分大屏幕
    // ==========================================
    const scoreboardGroup = new THREE.Group();
    scoreboardGroup.position.set(0, 0, -14.8);

    // 兩座雙重金屬桁架支撐柱
    [-3.5, 3.5].forEach(px => {
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 7.2, 8), steelMat);
      p1.position.set(px - 0.2, 3.6, 0);
      scoreboardGroup.add(p1);
      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 7.2, 8), steelMat);
      p2.position.set(px + 0.2, 3.6, 0);
      scoreboardGroup.add(p2);
    });

    // 屏幕本體外殼
    const screenCase = new THREE.Mesh(new THREE.BoxGeometry(8.4, 4.4, 0.6), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 }));
    screenCase.position.set(0, 5.0, 0);
    scoreboardGroup.add(screenCase);

    // LED 高亮顯示面
    const boardTex = this.createScoreboardTexture();
    const screenFaceMat = boardTex
      ? new THREE.MeshBasicMaterial({ map: boardTex })
      : new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
    const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 4.0), screenFaceMat);
    screenFace.position.set(0, 5.0, 0.32);
    scoreboardGroup.add(screenFace);

    group.add(scoreboardGroup);

    // ==========================================
    // 3. 四座巨型體育場投光燈塔 (四角高聳 Floodlight Towers)
    // ==========================================
    [[-15.0, -15.0], [15.0, -15.0], [-15.0, 15.0], [15.0, 15.0]].forEach(([lx, lz]) => {
      const mastGroup = new THREE.Group();
      mastGroup.position.set(lx, 0, lz);

      // 高聳鋼構主柱 (13.5m 高)
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.5, 13.5, 8), steelMat);
      mast.position.y = 6.75;
      mastGroup.add(mast);

      // 頂部燈架平台
      const headFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 0.4), steelMat);
      headFrame.position.set(0, 13.5, 0);
      headFrame.lookAt(0, 0, 0);
      mastGroup.add(headFrame);

      // 6 盞高亮投光燈矩陣
      const lampMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfef08a,
        emissiveIntensity: 1.2
      });
      [-0.8, 0, 0.8].forEach(lampX => {
        [-0.4, 0.4].forEach(lampY => {
          const lampMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.3, 8), lampMat);
          lampMesh.position.set(lampX, 13.5 + lampY, 0.2);
          lampMesh.rotation.x = Math.PI / 4;
          mastGroup.add(lampMesh);
        });
      });

      // 照向球場的照明光源
      const light = new THREE.PointLight(0xfffaed, 0.65, 26);
      light.position.set(0, 12, 0);
      mastGroup.add(light);

      group.add(mastGroup);
    });

    // ==========================================
    // 4. 東側球員教練遮棚替補席 (Team Dugout)
    // ==========================================
    const dugout = new THREE.Group();
    dugout.position.set(5.2, 0, 0);

    const shelterFrame = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 3.8, 16, 1, true, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4, roughness: 0.1, side: THREE.DoubleSide })
    );
    shelterFrame.position.set(0, 1.2, 0);
    shelterFrame.rotation.z = Math.PI / 2;
    shelterFrame.rotation.y = Math.PI / 2;
    dugout.add(shelterFrame);

    // 替補席長椅與座椅
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a });
    for (let bz = -1.4; bz <= 1.4; bz += 0.7) {
      const bSeat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.5), benchMat);
      bSeat.position.set(0, 0.225, bz);
      dugout.add(bSeat);
    }
    group.add(dugout);

    // ==========================================
    // 5. 校園體育園區景觀樹木與紅磚圍欄 (告別空蕩虛空)
    // ==========================================
    const brickMat = new THREE.MeshStandardMaterial({ map: this.tex.stationBrick, roughness: 0.8 });
    const pineMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 });
    const trunkMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.8 });

    // 南北外圍景觀矮牆與校園綠樹
    [-17, 17].forEach(wz => {
      const pWall = new THREE.Mesh(new THREE.BoxGeometry(36, 1.4, 0.8), brickMat);
      pWall.position.set(0, 0.7, wz);
      group.add(pWall);

      // 種植校園柏樹
      for (let tx = -14; tx <= 14; tx += 4.5) {
        const tree = new THREE.Group();
        tree.position.set(tx, 0, wz + (wz > 0 ? 1.5 : -1.5));
        const tTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 2.0, 6), trunkMat);
        tTrunk.position.y = 1.0;
        tree.add(tTrunk);
        const tCrown = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.8, 7), pineMat);
        tCrown.position.y = 3.2;
        tree.add(tCrown);
        group.add(tree);
      }
    });
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

    // 1. 大型火車班次發車時刻表看板 (Timetable Blackboard)
    const timeTex = this.createTimetableTexture();
    const boardMat = timeTex
      ? new THREE.MeshBasicMaterial({ map: timeTex })
      : new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const timetableBoard = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), boardMat);
    timetableBoard.position.set(-9.85, 3.8, 2.5);
    timetableBoard.rotation.y = Math.PI / 2;
    group.add(timetableBoard);

    // 2. 月台售票窗口 (Ticket Window)
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.65 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 });

    const ticketCounter = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 1.8), woodMat);
    ticketCounter.position.set(-9.7, 0.45, -2.5);
    group.add(ticketCounter);

    for (let b = -0.7; b <= 0.7; b += 0.2) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), brassMat);
      bar.position.set(-9.7, 1.5, -2.5 + b);
      group.add(bar);
    }

    // 3. 月台行李推車與復古皮箱 (Luggage Trolley & Trunks)
    const trolleyGroup = new THREE.Group();
    trolleyGroup.position.set(-5.5, 0, -2.0);

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85 });
    const tBed = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.9), woodMat);
    tBed.position.y = 0.35;
    trolleyGroup.add(tBed);

    [-0.6, 0.6].forEach(wx => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 12), ironMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.18, 0.45);
      trolleyGroup.add(wheel);
      const wheelR = wheel.clone();
      wheelR.position.z = -0.45;
      trolleyGroup.add(wheelR);
    });

    // 堆疊皮革行李箱
    const trunkMat1 = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const trunkMat2 = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 });

    const trunk1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.5), trunkMat1);
    trunk1.position.set(-0.2, 0.58, 0);
    trolleyGroup.add(trunk1);

    const trunk2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.3, 0.4), trunkMat2);
    trunk2.position.set(-0.15, 0.9, 0);
    trunk2.rotation.y = 0.15;
    trolleyGroup.add(trunk2);

    group.add(trolleyGroup);
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

    // 枝頭懸掛 4 盞發光精靈水晶提燈 (Fairy Crystal Lanterns)
    const lanternColors = [0x38bdf8, 0xfde047, 0xf472b6, 0x4ade80];
    const lanternOffsets = [[1.4, 3.1, 0.6], [-1.2, 3.4, 0.8], [0.5, 3.0, -1.3], [-0.8, 2.9, -1.0]];
    const lanternGroup = new THREE.Group();

    lanternOffsets.forEach(([lx, ly, lz], idx) => {
      const col = lanternColors[idx % lanternColors.length];
      const singleLantern = new THREE.Group();
      singleLantern.position.set(lx, ly, lz);

      // 細吊鍊
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 4), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 }));
      chain.position.y = 0.3;
      singleLantern.add(chain);

      // 水晶多面體燈身
      const crystal = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.2),
        new THREE.MeshStandardMaterial({
          color: col,
          emissive: col,
          emissiveIntensity: 0.9,
          roughness: 0.15,
          transparent: true,
          opacity: 0.9
        })
      );
      singleLantern.add(crystal);

      // 柔和點光源
      const pLight = new THREE.PointLight(col, 0.65, 5);
      singleLantern.add(pLight);

      lanternGroup.add(singleLantern);
    });
    tree.add(lanternGroup);

    this.world.animators.push((time) => {
      lanternGroup.children.forEach((l, i) => {
        l.rotation.z = Math.sin(time * 2 + i * 1.5) * 0.12;
        l.rotation.x = Math.cos(time * 2 + i * 1.5) * 0.08;
      });
    });

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

  // [操場] 國際標準足球場標線 (白線邊界、中場線、中圈、禁區、點球點與四角角旗)
  buildSoccerFieldLines(group) {
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 1. 球場外圍邊界白線 (11.2m x 22.4m)
    [-5.6, 5.6].forEach(bx => {
      const touchline = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 22.4), lineMat);
      touchline.rotation.x = -Math.PI / 2;
      touchline.position.set(bx, 0.035, 0);
      group.add(touchline);
    });
    [-11.2, 11.2].forEach(bz => {
      const goalline = new THREE.Mesh(new THREE.PlaneGeometry(11.2, 0.08), lineMat);
      goalline.rotation.x = -Math.PI / 2;
      goalline.position.set(0, 0.035, bz);
      group.add(goalline);
    });

    // 2. 中場線與中圈 (Center Circle & Halfway Line)
    const halfway = new THREE.Mesh(new THREE.PlaneGeometry(11.2, 0.08), lineMat);
    halfway.rotation.x = -Math.PI / 2;
    halfway.position.set(0, 0.035, 0);
    group.add(halfway);

    const centerCircle = new THREE.Mesh(new THREE.RingGeometry(2.36, 2.44, 32), lineMat);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.set(0, 0.036, 0);
    group.add(centerCircle);

    const kickoffSpot = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), lineMat);
    kickoffSpot.rotation.x = -Math.PI / 2;
    kickoffSpot.position.set(0, 0.037, 0);
    group.add(kickoffSpot);

    // 3. 南北兩側大禁區 (Penalty Areas)
    [-11.2, 11.2].forEach(pz => {
      const sign = pz < 0 ? 1 : -1;
      // 禁區橫線
      const pCross = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 0.08), lineMat);
      pCross.rotation.x = -Math.PI / 2;
      pCross.position.set(0, 0.035, pz + sign * 3.6);
      group.add(pCross);

      // 禁區兩側縱線
      [-3.0, 3.0].forEach(px => {
        const pSide = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 3.6), lineMat);
        pSide.rotation.x = -Math.PI / 2;
        pSide.position.set(px, 0.035, pz + sign * 1.8);
        group.add(pSide);
      });

      // 點球點 (Penalty Spot)
      const pSpot = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), lineMat);
      pSpot.rotation.x = -Math.PI / 2;
      pSpot.position.set(0, 0.037, pz + sign * 2.4);
      group.add(pSpot);
    });

    // 4. 四座角旗 (Corner Flags)
    [[-5.6, -11.2], [5.6, -11.2], [-5.6, 11.2], [5.6, 11.2]].forEach(([fx, fz]) => {
      const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      flagPole.position.set(fx, 0.75, fz);
      group.add(flagPole);

      const flagCloth = new THREE.Mesh(
        new THREE.PlaneGeometry(0.35, 0.25),
        new THREE.MeshStandardMaterial({ color: 0xef4444, side: THREE.DoubleSide })
      );
      flagCloth.position.set(fx + 0.175, 1.35, fz);
      group.add(flagCloth);
    });
  }

  // [操場] 專業鋼管足球門與 3D 擬真足球 (BALL / SOCCER)
  buildSoccerGoalAndBall(group, x, y, z, label, id, onClick) {
    const goalGroup = new THREE.Group();
    goalGroup.position.set(x, y, z);

    const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.1 });
    const netMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, wireframe: true, transparent: true, opacity: 0.45 });

    // 前側兩根立柱 (門寬 4.4m，門高 2.4m)
    [-2.2, 2.2].forEach(gx => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.4, 16), postMat);
      post.position.set(gx, 1.2, 0);
      post.castShadow = true;
      goalGroup.add(post);

      // 後側斜向支撐鋼架
      const stay = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8), postMat);
      stay.position.set(gx, 1.2, -0.85);
      stay.rotation.x = -0.65;
      goalGroup.add(stay);
    });

    // 橫向頂桿 (Crossbar)
    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 4.54, 16), postMat);
    crossbar.position.set(0, 2.4, 0);
    crossbar.rotation.z = Math.PI / 2;
    goalGroup.add(crossbar);

    // 後方球網 (3D 三角斜度球網)
    const netMesh = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.35, 1.7), netMat);
    netMesh.position.set(0, 1.18, -0.85);
    goalGroup.add(netMesh);

    // 經典黑白五角星 3D 足球 (放置於球門前罰球區)
    const ballGroup = new THREE.Group();
    ballGroup.position.set(0, 0.24, 2.0); // 距球門前方 2m
    const ballBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 })
    );
    ballGroup.add(ballBase);

    const patchMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35 });
    // 五角黑色色塊
    for (let p = 0; p < 8; p++) {
      const ang = p * (Math.PI / 4);
      const patch = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 5), patchMat);
      patch.position.set(Math.sin(ang) * 0.21, Math.cos(ang) * (p % 2 === 0 ? 0.18 : -0.18), 0.12);
      patch.lookAt(ballGroup.position);
      ballGroup.add(patch);
    }
    goalGroup.add(ballGroup);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.8, 3.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.set(0, 1.3, 0.8);
    hitBox.userData = { id, label, onClick };
    goalGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(goalGroup);
  }

  // [操場] 跑道起跑線、助跑塊與接力棒 (RUN)
  buildStartingBlocks(group, x, y, z, label, id, onClick) {
    const runGroup = new THREE.Group();
    runGroup.position.set(x, y, z);

    const aluMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    const padMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const batonMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7, roughness: 0.25 });

    // 鋁合金中心導軌
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.9), aluMat);
    rail.position.set(0, 0.03, 0);
    runGroup.add(rail);

    // 左右腳助跑踏板
    [[-0.22, 0.15], [0.22, -0.15]].forEach(([bx, bz]) => {
      const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.26), padMat);
      pedal.position.set(bx, 0.08, bz);
      pedal.rotation.x = -0.42;
      runGroup.add(pedal);
    });

    // 鮮紅金屬運動接力棒
    const baton = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.52, 12), batonMat);
    baton.position.set(0, 0.22, -0.45);
    baton.rotation.z = Math.PI / 2;
    runGroup.add(baton);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 2.2), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 0.6;
    hitBox.userData = { id, label, onClick };
    runGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(runGroup);
  }

  // [操場] 躍動跳高設備、跳箱與長跳沙坑 (JUMP)
  buildJumpEquipment(group, x, y, z, label, id, onClick) {
    const jumpGroup = new THREE.Group();
    jumpGroup.position.set(x, y, z);

    // 1. 加厚皇家藍跳高防護海綿軟墊 (2.8m x 2.0m x 0.55m)
    const matCoverMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.55 });
    const crashMat = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.55, 2.0), matCoverMat);
    crashMat.position.set(0, 0.275, 0);
    jumpGroup.add(crashMat);

    // 軟墊白色十字降落標靶
    const targetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const target1 = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.15), targetMat);
    target1.rotation.x = -Math.PI / 2;
    target1.position.set(0, 0.555, 0);
    jumpGroup.add(target1);
    const target2 = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 1.2), targetMat);
    target2.rotation.x = -Math.PI / 2;
    target2.position.set(0, 0.555, 0);
    jumpGroup.add(target2);

    // 2. 兩座黃色帶刻度跳高立柱 (Upright Stands)
    const standMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.7, roughness: 0.3 });
    [-1.5, 1.5].forEach(sx => {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.4), standMat);
      base.position.set(sx, 0.04, -1.05);
      jumpGroup.add(base);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.0, 8), standMat);
      pole.position.set(sx, 1.0, -1.05);
      jumpGroup.add(pole);
    });

    // 橫跨兩柱的鮮紅跳高橫桿 (Crossbar)
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3.05, 8), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    bar.position.set(0, 1.45, -1.05);
    bar.rotation.z = Math.PI / 2;
    jumpGroup.add(bar);

    // 3. 經典四層實木體育跳箱 (Vaulting Box)
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
    const vGroup = new THREE.Group();
    vGroup.position.set(-2.0, 0, 0.3);

    for (let t = 0; t < 4; t++) {
      const layer = new THREE.Mesh(new THREE.BoxGeometry(0.9 - t * 0.06, 0.16, 1.3 - t * 0.08), woodMat);
      layer.position.y = 0.08 + t * 0.16;
      vGroup.add(layer);
    }
    const vTop = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 1.02), leatherMat);
    vTop.position.y = 0.70;
    vGroup.add(vTop);
    jumpGroup.add(vGroup);

    // 4. 跳遠沙坑 (Long Jump Sand Pit)
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.95 });
    const sandBorderMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const pit = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 4.0), sandMat);
    pit.rotation.x = -Math.PI / 2;
    pit.position.set(2.4, 0.028, 0.5);
    jumpGroup.add(pit);

    const pitFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 4.2), sandBorderMat);
    pitFrame.position.set(2.4, 0.03, 0.5);
    jumpGroup.add(pitFrame);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.4, 3.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.1;
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
  // ==========================================
  // RPG 雙向穿梭門扉與世界路標建構器 (Bi-directional Portals)
  // ==========================================

  // [市集] 南側驛站拱門 (返回 Zone 1 見習書齋)
  buildTownSouthEntrance(group, x, y, z, label, onTravel) {
    const arch = new THREE.Group();
    arch.position.set(x, y, z);

    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });

    // 兩側拱門基石立柱
    [-1.6, 1.6].forEach(px => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.7, 4.2, 0.7), stoneMat);
      col.position.set(px, 2.1, 0);
      arch.add(col);

      // 溫暖路燈
      const lamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 0.35, 6),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.8 })
      );
      lamp.position.set(px, 4.35, 0);
      arch.add(lamp);

      const light = new THREE.PointLight(0xfef08a, 0.8, 8);
      light.position.set(px, 4.35, 0);
      arch.add(light);
    });

    // 頂部石拱頂樑
    const beam = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.6, 0.9), stoneMat);
    beam.position.set(0, 4.4, 0);
    arch.add(beam);

    // 懸掛木雕路標牌
    const sign = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.08), woodMat);
    sign.position.set(0, 3.8, 0);
    arch.add(sign);

    // 穿梭光暈微光
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 3.8),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    glow.position.set(0, 2.0, 0);
    arch.add(glow);

    // 互動點與傳送門 Hitbox
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4.2, 2.4), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.1;
    hitBox.userData = {
      id: 'return_portal_zone2',
      label,
      onClick: () => {
        if (onTravel) onTravel();
      }
    };
    arch.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      glow.material.opacity = 0.3 + Math.sin(time * 2.5) * 0.15;
    });

    group.add(arch);
  }

  // [花園] 南側入園花廊 (返回 Zone 2 微風市集)
  buildGardenSouthEntrance(group, x, y, z, label, onTravel) {
    const arbor = new THREE.Group();
    arbor.position.set(x, y, z);

    const marbleMat = new THREE.MeshStandardMaterial({ map: this.tex.marbleFountain, roughness: 0.4 });
    const ivyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

    [-1.6, 1.6].forEach(px => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 3.8, 12), marbleMat);
      col.position.set(px, 1.9, 0);
      arbor.add(col);

      // 常春藤葉團
      const ivy = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55), ivyMat);
      ivy.position.set(px, 3.6, 0);
      arbor.add(ivy);
    });

    const topArch = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.12, 8, 16, Math.PI), marbleMat);
    topArch.position.set(0, 3.8, 0);
    arbor.add(topArch);

    // 路標木牌
    const sign = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 0.08), new THREE.MeshStandardMaterial({ map: this.tex.woodDesk }));
    sign.position.set(0, 3.3, 0);
    arbor.add(sign);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 3.5),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    glow.position.set(0, 1.8, 0);
    arbor.add(glow);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4.0, 2.2), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'return_portal_zone3',
      label,
      onClick: () => {
        if (onTravel) onTravel();
      }
    };
    arbor.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      glow.material.opacity = 0.3 + Math.sin(time * 3) * 0.15;
    });

    group.add(arbor);
  }

  // [操場] 西南側校園林蔭門 (返回 Zone 3 守護獸花園)
  buildStadiumEntryArch(group, x, y, z, label, onTravel) {
    const arch = new THREE.Group();
    arch.position.set(x, y, z);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5, metalness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.8 });

    [-1.6, 1.6].forEach(px => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.8, 10), steelMat);
      col.position.set(px, 1.9, 0);
      arch.add(col);

      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), goldMat);
      cap.position.set(px, 3.9, 0);
      arch.add(cap);
    });

    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 0.3), steelMat);
    crossBeam.position.set(0, 3.8, 0);
    arch.add(crossBeam);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.08), goldMat);
    sign.position.set(0, 3.4, 0);
    arch.add(sign);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 3.5),
      new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    glow.position.set(0, 1.8, 0);
    arch.add(glow);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4.0, 2.2), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'return_portal_zone4',
      label,
      onClick: () => {
        if (onTravel) onTravel();
      }
    };
    arch.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      glow.material.opacity = 0.3 + Math.sin(time * 3) * 0.15;
    });

    group.add(arch);
  }

  // [車站] 南側出站口古典鐵藝閘門 (返回 Zone 4 操場)
  buildStationSouthExitGate(group, x, y, z, label, onTravel) {
    const gate = new THREE.Group();
    gate.position.set(x, y, z);

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.25 });

    [-1.6, 1.6].forEach(px => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 4.2, 8), ironMat);
      col.position.set(px, 2.1, 0);
      gate.add(col);

      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 6), brassMat);
      finial.position.set(px, 4.4, 0);
      gate.add(finial);

      const lamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.1, 0.35, 6),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.8 })
      );
      lamp.position.set(px, 3.8, 0.2);
      gate.add(lamp);
    });

    const topArch = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.08, 6, 16, Math.PI), ironMat);
    topArch.position.set(0, 4.0, 0);
    gate.add(topArch);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.08), brassMat);
    sign.position.set(0, 3.6, 0);
    gate.add(sign);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 3.6),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    glow.position.set(0, 1.9, 0);
    gate.add(glow);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4.0, 2.2), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'return_portal_zone5',
      label,
      onClick: () => {
        if (onTravel) onTravel();
      }
    };
    gate.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      glow.material.opacity = 0.3 + Math.sin(time * 3) * 0.15;
    });

    group.add(gate);
  }

  // [市集] 精緻生活道具群 (木箱、酒桶、麻布袋、招牌、路燈)
  buildMarketStreetProps(group) {
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.3 });
    const sackMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.95 });

    // 1. 堆疊蔬果木箱 (在蘋果攤與香蕉攤旁)
    const crateCoords = [
      [-5.8, 0, -1.8], [-5.8, 0.4, -1.8], [-6.2, 0, -1.2],
      [5.4, 0, 0.4], [5.4, 0.4, 0.4], [5.8, 0, 1.0]
    ];
    crateCoords.forEach(([cx, cy, cz]) => {
      const crate = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.4, 0.65), crateMat);
      crate.position.set(cx, cy + 0.2, cz);
      crate.castShadow = true;
      group.add(crate);
    });

    // 2. 釀酒橡木桶 (在麵包車與轉角處)
    const barrelCoords = [[-4.8, 0, -4.2], [-5.2, 0, -3.5], [4.5, 0, -2.2]];
    barrelCoords.forEach(([bx, by, bz]) => {
      const barrel = new THREE.Group();
      barrel.position.set(bx, by, bz);

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.9, 12), woodMat);
      body.position.y = 0.45;
      barrel.add(body);

      [-0.25, 0.25].forEach(hy => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.02, 6, 16), ironMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.45 + hy;
        barrel.add(ring);
      });
      group.add(barrel);
    });

    // 3. 黃麻麵粉布袋 (在麵包車旁)
    const sackCoords = [[-2.2, 0, -5.8], [-1.8, 0, -5.4]];
    sackCoords.forEach(([sx, sy, sz]) => {
      const sack = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35), sackMat);
      sack.scale.set(1.1, 0.8, 0.9);
      sack.position.set(sx, sy + 0.25, sz);
      group.add(sack);
    });

    // 4. 兩座古典鑄鐵街燈 (廣場東西兩側)
    [[-8.0, -4.0], [7.5, 4.0]].forEach(([lx, lz]) => {
      const lamp = new THREE.Group();
      lamp.position.set(lx, 0, lz);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 3.6, 8), ironMat);
      post.position.y = 1.8;
      lamp.add(post);

      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.15, 0.45, 6),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.9 })
      );
      glass.position.y = 3.7;
      lamp.add(glass);

      const pLight = new THREE.PointLight(0xffedd5, 1.2, 12);
      pLight.position.y = 3.7;
      lamp.add(pLight);

      group.add(lamp);
    });
  }

  // [車站] 動態火車時刻表畫布材質
  createTimetableTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 深色復古黑板底
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 506, 250);

    // 金色標題
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ STARLIGHT EXPRESS TIMETABLE ★', 256, 38);

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 52);
    ctx.lineTo(492, 52);
    ctx.stroke();

    // 時刻表班次
    const schedule = [
      { no: 'EXP-01', time: '21:00', dest: 'MAGE CITADEL (終點)', status: 'BOARDING', color: '#10b981' },
      { no: 'LOC-02', time: '22:30', dest: 'ATHLETIC STADIUM', status: 'ON TIME', color: '#38bdf8' },
      { no: 'LOC-03', time: '06:15', dest: 'SUNLIT BAZAAR', status: 'ON TIME', color: '#38bdf8' },
      { no: 'EXP-04', time: '08:00', dest: 'APPRENTICE TOWER', status: 'WAITING', color: '#f59e0b' }
    ];

    ctx.font = 'bold 15px monospace';
    schedule.forEach((row, idx) => {
      const y = 88 + idx * 38;
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.fillText(`${row.no}  ${row.time}  ${row.dest}`, 25, y);
      ctx.fillStyle = row.color;
      ctx.textAlign = 'right';
      ctx.fillText(row.status, 485, y);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }
}

// 建立全域空間實例
window.SpatialZoneManager = SpatialZoneManager;

