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
      },
      'zone6': {
        id: 'zone6',
        name: '蔚藍秘境海港',
        englishName: 'Azure Fantasy Harbor',
        icon: '⚓',
        topic: 'Ocean, Transport & Weather',
        reqLevel: 6,
        desc: '碧海晴空下的航海貿易大港，三桅帆船破浪而立，旋轉燈塔在海岸邊指引方向！',
        words: ['SHIP', 'BOAT', 'WIND', 'FISH', 'WATER', 'OPEN'],
        spawnPos: [0, 1.6, 6.0],
        spawnYaw: 0
      },
      'zone7': {
        id: 'zone7',
        name: '雲頂星空觀測站',
        englishName: 'Celestial Starlight Observatory',
        icon: '🔭',
        topic: 'Sky, Weather & Celestial Wonders',
        reqLevel: 7,
        desc: '懸浮於浩瀚雲海與璀璨星河之上的蒼穹天文台，巨型折射望遠鏡指向星空深處！',
        words: ['STAR', 'MOON', 'CLOUD', 'SUN', 'SKY', 'OPEN'],
        spawnPos: [0, 1.6, 7.5],
        spawnYaw: 0
      },
      'zone8': {
        id: 'zone8',
        name: '極光冰雪聖域',
        englishName: 'Aurora Frost Sanctuary',
        icon: '❄️',
        topic: 'Winter, Climate & Arctic Nature',
        reqLevel: 8,
        desc: '懸浮於大陸極峰的萬年寒冰聖域，翡翠綠與紫羅蘭色的極光在夜空中輕盈起伏！',
        words: ['SNOW', 'COLD', 'WINTER', 'WHITE', 'WARM', 'CLIMB'],
        spawnPos: [0, 1.6, 7.5],
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
      ],
      'zone6': [
        // 1. 海岸燈塔石造巨塔圓形碰撞 (半徑 2.6m)
        { type: 'circle', x: 8.5, z: -8.0, radius: 2.6 },
        // 2. 停泊遠洋三桅帆船船體實體 (阻止玩家掉入深海或穿入船體內部)
        { type: 'box', minX: -13.5, maxX: -4.5, minZ: -12.0, maxZ: 10.0 },
        // 3. 碼頭木箱與鮮魚木桶貨物堆
        { type: 'box', minX: 3.7, maxX: 6.3, minZ: 1.4, maxZ: 3.0 },
        // 4. 東側海面防護木欄
        { type: 'box', minX: 13.5, maxX: 16.0, minZ: -14.0, maxZ: 14.0 },
        // 5. 西側外海安全邊界
        { type: 'box', minX: -16.0, maxX: -13.5, minZ: -14.0, maxZ: 14.0 },
        // 6. 北側深海邊界
        { type: 'box', minX: -14.0, maxX: 14.0, minZ: -16.0, maxZ: -13.5 },
        // 7. 南側鐵道聯絡門石牆左右翼
        { type: 'box', minX: -14.0, maxX: -2.5, minZ: 12.0, maxZ: 14.0 },
        { type: 'box', minX: 2.5, maxX: 14.0, minZ: 12.0, maxZ: 14.0 }
      ],
      'zone7': [
        // 1. 巨型星穹折射望遠鏡基座實體 (SKY POI, 中心: 0, -6.5, 半徑 2.2)
        { type: 'box', minX: -2.0, maxX: 2.0, minZ: -8.5, maxZ: -4.5 },
        // 2. 遠古星辰羅盤儀基座實體 (STAR POI, 中心: -6.5, -1.0, 半徑 1.6)
        { type: 'box', minX: -8.0, maxX: -5.0, minZ: -2.5, maxZ: 0.5 },
        // 3. 蒼月潮汐日晷儀基座實體 (MOON POI, 中心: 6.5, -1.0, 半徑 1.6)
        { type: 'box', minX: 5.0, maxX: 8.0, minZ: -2.5, maxZ: 0.5 },
        // 4. 日冕分光鏡基座實體 (SUN POI, 中心: -5.0, 4.0, 半徑 1.4)
        { type: 'box', minX: -6.2, maxX: -3.8, minZ: 2.8, maxZ: 5.2 },
        // 5. 雲海浮島祭壇基座實體 (CLOUD POI, 中心: 5.0, 4.0, 半徑 1.5)
        { type: 'box', minX: 3.8, maxX: 6.2, minZ: 2.8, maxZ: 5.2 },
        // 6. 西側浮島空域安全護欄邊界 (防跌落虛空)
        { type: 'box', minX: -16.5, maxX: -13.8, minZ: -14.5, maxZ: 14.5 },
        // 7. 東側浮島空域安全護欄邊界 (防跌落虛空)
        { type: 'box', minX: 13.8, maxX: 16.5, minZ: -14.5, maxZ: 14.5 },
        // 8. 北側星界星門兩側邊界 (防跌落虛空)
        { type: 'box', minX: -14.5, maxX: 14.5, minZ: -16.5, maxZ: -13.8 },
        // 9. 南側空橋出入口石柱兩側防跌落邊界
        { type: 'box', minX: -14.5, maxX: -2.4, minZ: 12.0, maxZ: 14.5 },
        { type: 'box', minX: 2.4, maxX: 14.5, minZ: 12.0, maxZ: 14.5 }
      ],
      'zone8': [
        // 1. 冰雪結晶風向儀基座實體 (SNOW POI, 中心: 0, -6.5, 半徑 2.0)
        { type: 'box', minX: -2.0, maxX: 2.0, minZ: -8.5, maxZ: -4.5 },
        // 2. 極寒玄冰方尖碑基座實體 (COLD POI, 中心: -6.5, -1.0, 半徑 1.6)
        { type: 'box', minX: -8.0, maxX: -5.0, minZ: -2.5, maxZ: 0.5 },
        // 3. 冬之永凍常青松樹幹基座 (WINTER POI, 中心: 6.5, -1.0, 半徑 1.6)
        { type: 'box', minX: 5.0, maxX: 8.0, minZ: -2.5, maxZ: 0.5 },
        // 4. 純白雪境雪精靈守護者 (WHITE POI, 中心: -5.0, 4.0, 半徑 1.4)
        { type: 'box', minX: -6.2, maxX: -3.8, minZ: 2.8, maxZ: 5.2 },
        // 5. 極光暖心魔法火爐基座 (WARM POI, 中心: 5.0, 4.0, 半徑 1.5)
        { type: 'box', minX: 3.8, maxX: 6.2, minZ: 2.8, maxZ: 5.2 },
        // 6. 西側冰崖空域安全護欄邊界 (防跌落虛空)
        { type: 'box', minX: -16.5, maxX: -13.8, minZ: -14.5, maxZ: 14.5 },
        // 7. 東側冰崖空域安全護欄邊界 (防跌落虛空)
        { type: 'box', minX: 13.8, maxX: 16.5, minZ: -14.5, maxZ: 14.5 },
        // 8. 北側終極冰階兩側邊界 (防跌落虛空)
        { type: 'box', minX: -14.5, maxX: 14.5, minZ: -16.5, maxZ: -13.8 },
        // 9. 南側接駁空橋出入口石柱兩側防跌落邊界
        { type: 'box', minX: -14.5, maxX: -2.4, minZ: 12.0, maxZ: 14.5 },
        { type: 'box', minX: 2.4, maxX: 14.5, minZ: 12.0, maxZ: 14.5 }
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
      alchemySlate: loader.load('assets/textures/tex-alchemy-slate.jpg'),
      dockWood: loader.load('assets/textures/harbor_dock_wood.jpg'),
      lighthouseBrick: loader.load('assets/textures/lighthouse_brick.jpg'),
      galleonHull: loader.load('assets/textures/galleon_hull.jpg'),
      celestialMarble: loader.load('assets/textures/celestial_marble.jpg'),
      astrolabeBrass: loader.load('assets/textures/astrolabe_brass.jpg'),
      glacialIce: loader.load('assets/textures/glacial_ice.jpg'),
      snowFrost: loader.load('assets/textures/snow_frost.jpg')
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

    if (this.tex.dockWood) {
      this.tex.dockWood.wrapS = THREE.RepeatWrapping;
      this.tex.dockWood.wrapT = THREE.RepeatWrapping;
      this.tex.dockWood.repeat.set(8, 8);
    }
    if (this.tex.lighthouseBrick) {
      this.tex.lighthouseBrick.wrapS = THREE.RepeatWrapping;
      this.tex.lighthouseBrick.wrapT = THREE.RepeatWrapping;
      this.tex.lighthouseBrick.repeat.set(3, 8);
    }
    if (this.tex.galleonHull) {
      this.tex.galleonHull.wrapS = THREE.RepeatWrapping;
      this.tex.galleonHull.wrapT = THREE.RepeatWrapping;
      this.tex.galleonHull.repeat.set(4, 2);
    }
    if (this.tex.celestialMarble) {
      this.tex.celestialMarble.wrapS = THREE.RepeatWrapping;
      this.tex.celestialMarble.wrapT = THREE.RepeatWrapping;
      this.tex.celestialMarble.repeat.set(2, 2);
    }
    if (this.tex.astrolabeBrass) {
      this.tex.astrolabeBrass.wrapS = THREE.RepeatWrapping;
      this.tex.astrolabeBrass.wrapT = THREE.RepeatWrapping;
      this.tex.astrolabeBrass.repeat.set(1, 1);
    }
    if (this.tex.glacialIce) {
      this.tex.glacialIce.wrapS = THREE.RepeatWrapping;
      this.tex.glacialIce.wrapT = THREE.RepeatWrapping;
      this.tex.glacialIce.repeat.set(2, 2);
    }
    if (this.tex.snowFrost) {
      this.tex.snowFrost.wrapS = THREE.RepeatWrapping;
      this.tex.snowFrost.wrapT = THREE.RepeatWrapping;
      this.tex.snowFrost.repeat.set(3, 3);
    }

    // 初始化高階程序化畫布貼圖 (黃道星盤、古雅星盤刻度、玄冰符文、針織粗毛線、松樹皮、炭火床)
    if (!this.tex.zodiacFloor) this.tex.zodiacFloor = this.createZodiacFloorTexture();
    if (!this.tex.astrolabeDial) this.tex.astrolabeDial = this.createAstrolabeDialTexture();
    if (!this.tex.frostRune) this.tex.frostRune = this.createFrostRuneTexture();
    if (!this.tex.knittedWool) this.tex.knittedWool = this.createKnittedWoolTexture();
    if (!this.tex.pineBark) this.tex.pineBark = this.createPineBarkTexture();
    if (!this.tex.emberBed) this.tex.emberBed = this.createEmberBedTexture();

    this.texturesLoaded = true;
  }

  // =======================================================
  // 高解析程序化畫布紋理生成器 (Procedural High-Res Textures)
  // 提供向量級精緻紋理，徹底告別原始幾何純色！
  // =======================================================

  // 1. 黃道十二宮星象金嵌大理石地坪紋理 (1024x1024)
  createZodiacFloorTexture() {
    if (typeof document === 'undefined' || !document.createElement) {
      return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : { wrapS: 0, wrapT: 0, repeat: { set: () => {} } };
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : null;

    const cx = 512;
    const cy = 512;

    // 深邃青藍大理石徑向漸層底色
    const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 512);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.25, '#0f172a');
    grad.addColorStop(0.55, '#09152b');
    grad.addColorStop(0.85, '#040d1e');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 大理石裂紋與星雲微光紋理
    ctx.save();
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.09)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 45; i++) {
      ctx.beginPath();
      let x = Math.random() * 1024;
      let y = Math.random() * 1024;
      ctx.moveTo(x, y);
      for (let j = 0; j < 4; j++) {
        x += (Math.random() - 0.5) * 180;
        y += (Math.random() - 0.5) * 180;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();

    // 繪製多層金嵌黃銅同心圓環 (Concentric Brass Inlay Rings)
    const rings = [502, 480, 440, 360, 260, 160, 68];
    rings.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = (idx % 2 === 0) ? '#f59e0b' : '#fde047';
      ctx.lineWidth = (idx === 0 || idx === 3) ? 6 : 3;
      ctx.stroke();
    });

    // 外圈：360度天文刻度 (Degree Ticks)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
    for (let d = 0; d < 360; d += 2) {
      const rad = (d * Math.PI) / 180;
      const isMajor = (d % 10 === 0);
      const isCard = (d % 30 === 0);
      const rInner = isCard ? 450 : (isMajor ? 465 : 472);
      const rOuter = 480;
      ctx.lineWidth = isCard ? 3 : (isMajor ? 2 : 1);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * rInner, cy + Math.sin(rad) * rInner);
      ctx.lineTo(cx + Math.cos(rad) * rOuter, cy + Math.sin(rad) * rOuter);
      ctx.stroke();
    }

    // 次外圈：十二宮分區隔線與羅馬數字
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    ctx.font = 'bold 20px "Cinzel", "Times New Roman", serif';
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 12; i++) {
      const ang = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * 360, cy + Math.sin(ang) * 360);
      ctx.lineTo(cx + Math.cos(ang) * 440, cy + Math.sin(ang) * 440);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();

      const textAng = ang + Math.PI / 12;
      const tx = cx + Math.cos(textAng) * 400;
      const ty = cy + Math.sin(textAng) * 400;
      ctx.fillText(roman[i], tx, ty);
    }

    // 中圈：黃道十二宮天文符號 (Zodiac Constellation Glyphs)
    const zodiacSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    ctx.font = 'bold 40px sans-serif';
    for (let i = 0; i < 12; i++) {
      const textAng = (i * Math.PI) / 6 + Math.PI / 12;
      const tx = cx + Math.cos(textAng) * 310;
      const ty = cy + Math.sin(textAng) * 310;
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = 'rgba(250, 204, 21, 0.6)';
      ctx.shadowBlur = 10;
      ctx.fillText(zodiacSymbols[i], tx, ty);
      ctx.shadowBlur = 0;
    }

    // 內圈：星辰八芒星羅盤圖騰 (8-Pointed Celestial Compass Star)
    ctx.save();
    ctx.translate(cx, cy);
    for (let p = 0; p < 8; p++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-14, -60);
      ctx.lineTo(0, (p % 2 === 0) ? -230 : -180);
      ctx.fillStyle = (p % 2 === 0) ? '#f59e0b' : '#b45309';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(14, -60);
      ctx.lineTo(0, (p % 2 === 0) ? -230 : -180);
      ctx.fillStyle = (p % 2 === 0) ? '#fde047' : '#d97706';
      ctx.fill();
    }
    ctx.restore();

    // 核心金色日冕圓形封章
    ctx.beginPath();
    ctx.arc(cx, cy, 46, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4;
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // 2. 古董黃銅星盤刻度面板紋理 (512x512)
  createAstrolabeDialTexture() {
    if (typeof document === 'undefined' || !document.createElement) {
      return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : { wrapS: 0, wrapT: 0, repeat: { set: () => {} } };
    }
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : null;

    const cx = 256;
    const cy = 256;

    // 古董黃銅金屬同心漸層底色
    const grad = ctx.createRadialGradient(cx, cy, 15, cx, cy, 256);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.35, '#eab308');
    grad.addColorStop(0.7, '#ca8a04');
    grad.addColorStop(1, '#78350f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // 金屬拉絲環
    ctx.strokeStyle = 'rgba(113, 63, 18, 0.15)';
    ctx.lineWidth = 1;
    for (let r = 8; r < 256; r += 3) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 星盤方位與地平高度線 (Almucantars)
    ctx.strokeStyle = 'rgba(69, 26, 3, 0.75)';
    [245, 215, 180, 145, 105, 65, 30].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 放射狀方位角線
    for (let a = 0; a < 24; a++) {
      const rad = (a * Math.PI) / 12;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * 30, cy + Math.sin(rad) * 30);
      ctx.lineTo(cx + Math.cos(rad) * 245, cy + Math.sin(rad) * 245);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 羅馬數字時標
    const roman = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    ctx.font = 'bold 15px serif';
    ctx.fillStyle = '#451a03';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 12; i++) {
      const rad = (i * Math.PI) / 6 - Math.PI / 2;
      const tx = cx + Math.cos(rad) * 230;
      const ty = cy + Math.sin(rad) * 230;
      ctx.fillText(roman[i], tx, ty);
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  // 3. 北歐玄冰發光符文紋理 (512x512)
  createFrostRuneTexture() {
    if (typeof document === 'undefined' || !document.createElement) {
      return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : { wrapS: 0, wrapT: 0, repeat: { set: () => {} } };
    }
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : null;

    // 深邃玄冰結晶底色
    ctx.fillStyle = '#051b30';
    ctx.fillRect(0, 0, 512, 512);

    // 冰晶裂紋
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 35; i++) {
      ctx.beginPath();
      let x = Math.random() * 512;
      let y = Math.random() * 512;
      ctx.moveTo(x, y);
      for (let j = 0; j < 3; j++) {
        x += (Math.random() - 0.5) * 120;
        y += (Math.random() - 0.5) * 120;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 發光北歐冰霜符文條帶
    const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#e0f2fe';

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        const rune = runes[(row * 6 + col) % runes.length];
        ctx.fillText(rune, 42 + col * 85, 64 + row * 128);
      }
    }
    ctx.shadowBlur = 0;

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // 4. 針織保暖粗毛線紋理 (256x256)
  createKnittedWoolTexture() {
    if (typeof document === 'undefined' || !document.createElement) {
      return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : { wrapS: 0, wrapT: 0, repeat: { set: () => {} } };
    }
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : null;

    // 蔚藍毛線底色
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, 256, 256);

    // 針織麻花針紋 (Cable-knit chevron pattern)
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    for (let y = 0; y < 256; y += 16) {
      ctx.beginPath();
      for (let x = 0; x <= 256; x += 16) {
        ctx.lineTo(x, y + ((x / 16) % 2 === 0 ? 0 : 8));
      }
      ctx.stroke();
    }

    // 金橙色費爾島針織裝飾條帶
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 110, 256, 36);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    for (let x = 0; x < 256; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 110);
      ctx.lineTo(x + 6, 146);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  // 5. 永凍古松粗獷樹皮紋理 (512x512)
  createPineBarkTexture() {
    if (typeof document === 'undefined' || !document.createElement) {
      return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : { wrapS: 0, wrapT: 0, repeat: { set: () => {} } };
    }
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : null;

    ctx.fillStyle = '#26140b';
    ctx.fillRect(0, 0, 512, 512);

    // 樹皮裂溝
    for (let x = 0; x < 512; x += 14) {
      ctx.fillStyle = (x % 28 === 0) ? '#170c07' : '#3e2316';
      ctx.fillRect(x + Math.sin(x * 0.1) * 4, 0, 9, 512);
    }

    // 白雪微霜條紋
    ctx.fillStyle = 'rgba(224, 242, 254, 0.28)';
    for (let i = 0; i < 45; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.fillRect(rx, ry, 6, 40);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 4);
    return tex;
  }

  // 6. 暖冬炭火灼熱裂紋紋理 (512x512)
  createEmberBedTexture() {
    if (typeof document === 'undefined' || !document.createElement) {
      return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : { wrapS: 0, wrapT: 0, repeat: { set: () => {} } };
    }
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return (typeof THREE !== 'undefined' && THREE.CanvasTexture) ? new THREE.CanvasTexture() : null;

    ctx.fillStyle = '#0a0302';
    ctx.fillRect(0, 0, 512, 512);

    // 灼熱炭火核心
    for (let i = 0; i < 55; i++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 512;
      const rad = 15 + Math.random() * 28;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rad);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.35, '#f97316');
      grad.addColorStop(0.75, '#b91c1c');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
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
    } else if (zoneId === 'zone6') {
      this.buildZone6_Harbor(group);
    } else if (zoneId === 'zone7') {
      this.buildZone7_Observatory(group);
    } else if (zoneId === 'zone8') {
      this.buildZone8_GlacialSanctuary(group);
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

    if (zoneId === 'zone8') {
      // 極光冰雪聖域：極夜深邃青藍微光與清朗薄霜
      skyColorTop = 0x07152b;
      fogColor = 0x0a1d38;
      fogDensity = 0.005;
    } else if (zoneId === 'zone7') {
      // 雲頂星空觀測站：深邃宇宙星海與微光薄霧
      skyColorTop = 0x060919;
      fogColor = 0x0f172a;
      fogDensity = 0.007;
    } else if (zoneId === 'zone5') {
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
    } else if (zoneId === 'zone6') {
      // 蔚藍秘境海港：陽光海岸海天一色與遠洋微風
      skyColorTop = 0x0284c7;
      fogColor = 0xbae6fd;
      fogDensity = 0.009;
    } else {
      // 陽光微風市集：地中海溫暖日光藍天
      skyColorTop = 0x38bdf8;
      fogColor = 0xfef3c7;
      fogDensity = 0.012;
    }

    this.world.scene.background = new THREE.Color(skyColorTop);
    this.world.scene.fog = new THREE.FogExp2(fogColor, fogDensity);

    // 建立 3D 半球形天頂 (Sky Dome, 內表面渲染 - Zone 7 與 Zone 8 擁有專屬廣闊星穹天景，不覆蓋封閉天頂)
    if (zoneId !== 'zone7' && zoneId !== 'zone8') {
      const skyGeo = new THREE.SphereGeometry(65, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const skyMat = new THREE.MeshBasicMaterial({
        color: skyColorTop,
        side: THREE.BackSide
      });
      const skyDome = new THREE.Mesh(skyGeo, skyMat);
      skyDome.position.y = -2;
      group.add(skyDome);
    }

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

    // 北側鐵道專線閘門 (前往 Zone 6 蔚藍秘境海港)
    this.buildStationNorthHarborGate(group, 0.0, 0, -12.5, '⚓ 海港貨運專線 ➔ 前往【蔚藍秘境海港】 (Zone 6)', () => {
      this.world.showToast('⚓ 穿越海港鐵道專線，啟程前往【蔚藍秘境海港】！');
      this.switchZone('zone6');
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

  // ==========================================
  // Zone 5 ➔ Zone 6 鐵道聯絡專線閘門
  // ==========================================
  buildStationNorthHarborGate(group, x, y, z, label, onTravel) {
    const arch = new THREE.Group();
    arch.position.set(x, y, z);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.2 });

    [-1.8, 1.8].forEach(px => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.2, 0.5), steelMat);
      col.position.set(px, 2.1, 0);
      arch.add(col);

      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), brassMat);
      cap.position.set(px, 4.3, 0);
      arch.add(cap);
    });

    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 0.35), steelMat);
    crossBeam.position.set(0, 4.0, 0);
    arch.add(crossBeam);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.8),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    glow.position.set(0, 2.0, 0);
    arch.add(glow);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(4.0, 4.2, 2.5), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.1;
    hitBox.userData = {
      id: 'travel_portal_zone6',
      label,
      onClick: () => {
        if (onTravel) onTravel();
      }
    };
    arch.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      glow.material.opacity = 0.35 + Math.sin(time * 3.5) * 0.18;
    });

    group.add(arch);
  }

  // =========================================================================
  // Zone 6: 蔚藍秘境海港 (Azure Fantasy Harbor)
  // =========================================================================
  buildZone6_Harbor(group) {
    this.initTextures();

    // 1. 陽光海洋明亮光照
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.15);
    sunLight.position.set(16, 28, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f766e, 0.75);
    group.add(hemiLight);

    // 2. 動態蔚藍海洋水面 (160m x 160m, 附波浪漣漪)
    this.buildHarborDynamicOcean(group);

    // 3. 碼頭厚木石造棧道 (Wharf Pier Platform, 24m x 26m)
    this.buildHarborWharfPlatform(group);

    // 4. 停靠遠洋三桅帆船 (Galleon Ship, x: -8.6, z: -2.0) - SHIP POI
    this.buildHarborGalleonShip(group, -8.6, -0.65, -2.0);

    // 5. 海岸導航燈塔 (Coastal Lighthouse, x: 8.5, z: -8.0) - WIND POI
    this.buildHarborLighthouse(group, 8.5, 0, -8.0);

    // 6. 碼頭木造巡邏小艇 (BOAT POI)
    this.buildHarborRowboat(group, 3.8, -0.5, -3.5);

    // 7. 碼頭鮮魚貨物堆疊區 (FISH POI)
    this.buildHarborCargoArea(group, 5.0, 0, 2.2);

    // 8. 碼頭海平線觀景台 (WATER POI)
    this.buildHarborWaterOverlook(group, 0.0, 0, -10.5);

    // 9. 航向新世界海關拱門 (OPEN POI)
    this.buildHarborGrandArchPortal(group, 0.0, 0, -13.0, '🚪 航向新世界海關拱門 (OPEN)', 'OPEN', () => {
      this.world.openSpeechCard('OPEN', () => {
        this.world.addXP(80);
        this.checkZoneCompletionStatus();
      });
    });

    // 10. 南側鐵道聯絡門 (返回 Zone 5 星光鐘樓車站)
    this.buildHarborSouthRailwayGate(group, 0.0, 0, 12.0, '🚂 港口鐵道月台 ➔ 返回【星光鐘樓車站】', () => {
      this.world.showToast('🚂 穿越鐵道閘門，返回星光鐘樓車站！');
      this.switchZone('zone5');
    });

    // 10b. 燈塔雲霄星光空橋 (登上 Zone 7 雲頂星空觀測站)
    this.buildHarborObservatoryAscensionGate(group, 8.5, 0, -3.8, '🌟 燈塔雲霄星光空橋 ➔ 登上【雲頂星空觀測站】', () => {
      this.world.showToast('🌟 踏上燈塔指引光柱，躍升至雲頂星空觀測站！');
      this.switchZone('zone7');
    });

    // 11. 👑 關卡主 NPC：皇家海港總督・瑪琳娜船長 (Captain Marina)
    this.buildHarborGuardianNPC(group, 1.5, 0, -5.0);

    // 12. 海港環境微風光點粒子與海鷗
    this.addFloatingParticles(group, 0x38bdf8, 160, 32, 6);
    this.buildHarborSeagulls(group);
  }

  // 1. 動態海洋水面
  buildHarborDynamicOcean(group) {
    const oceanGeo = new THREE.PlaneGeometry(160, 160, 24, 24);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.4,
      transparent: true,
      opacity: 0.88
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.65;
    ocean.receiveShadow = true;
    group.add(ocean);

    // 浮動海浪漣漪網格
    const rippleGeo = new THREE.RingGeometry(2.0, 2.5, 16);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const ripples = [];
    const ripplePositions = [[-8, -1.0], [5, -4.0], [0, -11.0], [9, -7.0]];
    ripplePositions.forEach(pos => {
      const rip = new THREE.Mesh(rippleGeo, rippleMat.clone());
      rip.rotation.x = -Math.PI / 2;
      rip.position.set(pos[0], -0.62, pos[1]);
      group.add(rip);
      ripples.push(rip);
    });

    this.world.animators.push((time) => {
      ocean.position.y = -0.65 + Math.sin(time * 1.8) * 0.08;
      ripples.forEach((rip, idx) => {
        const s = 1.0 + Math.sin(time * 2.2 + idx * 1.5) * 0.4;
        rip.scale.set(s, s, s);
        rip.material.opacity = 0.25 + Math.sin(time * 2.2 + idx * 1.5) * 0.2;
      });
    });
  }

  // 2. 碼頭厚木石造棧道 (Wharf Pier Platform)
  buildHarborWharfPlatform(group) {
    const wharfMat = new THREE.MeshStandardMaterial({
      map: this.tex.dockWood,
      roughness: 0.8,
      metalness: 0.1
    });
    const woodPilingMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.9
    });
    const ironBollardMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.25
    });

    // 碼頭中央木棧平台 (22m 寬 x 26m 長)
    const pier = new THREE.Mesh(new THREE.PlaneGeometry(22, 26), wharfMat);
    pier.rotation.x = -Math.PI / 2;
    pier.position.set(1.0, 0, 0);
    pier.receiveShadow = true;
    group.add(pier);

    // 碼頭底座厚度厚板 (側面防穿幫)
    const apronMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
    const apronNorth = new THREE.Mesh(new THREE.BoxGeometry(22, 0.7, 0.4), apronMat);
    apronNorth.position.set(1.0, -0.35, -13.0);
    group.add(apronNorth);

    const apronWest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 26), apronMat);
    apronWest.position.set(-10.0, -0.35, 0);
    group.add(apronWest);

    const apronEast = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 26), apronMat);
    apronEast.position.set(12.0, -0.35, 0);
    group.add(apronEast);

    // 碼頭邊緣繫纜木樁 (Pilings)
    for (let z = -12; z <= 12; z += 3) {
      // 西側樁
      const pWest = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 2.2, 8), woodPilingMat);
      pWest.position.set(-10.0, 0.3, z);
      pWest.castShadow = true;
      group.add(pWest);

      // 東側樁
      const pEast = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 2.2, 8), woodPilingMat);
      pEast.position.set(12.0, 0.3, z);
      pEast.castShadow = true;
      group.add(pEast);
    }

    // 碼頭鑄鐵繫纜樁 (Mooring Bollards)
    const bollardCoords = [[-9.8, -8], [-9.8, -2], [-9.8, 4], [11.8, -6], [11.8, 2]];
    bollardCoords.forEach(c => {
      const bollard = new THREE.Group();
      bollard.position.set(c[0], 0, c[1]);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.45, 8), ironBollardMat);
      base.position.y = 0.22;
      bollard.add(base);

      const top = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.25, 0.25, 8), ironBollardMat);
      top.position.y = 0.55;
      bollard.add(top);

      const crossBar = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.1), ironBollardMat);
      crossBar.position.y = 0.45;
      bollard.add(crossBar);

      group.add(bollard);
    });

    // 碼頭救生圈裝飾
    const lifesaverMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    const whiteBandMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    [-9.8, 11.8].forEach((bx, idx) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 8, 16), lifesaverMat);
      ring.position.set(bx, 0.7, idx === 0 ? 1.0 : -2.0);
      ring.rotation.y = Math.PI / 2;
      group.add(ring);
    });
  }

  // 3. 停靠遠洋三桅大帆船 (Galleon Ship, SHIP POI)
  buildHarborGalleonShip(group, x, y, z) {
    const ship = new THREE.Group();
    ship.position.set(x, y, z);

    const hullMat = new THREE.MeshStandardMaterial({
      map: this.tex.galleonHull,
      roughness: 0.75,
      metalness: 0.15
    });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.85 });
    const sailMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9, side: THREE.DoubleSide });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });

    // 船身下層主船體 (Main Lower Hull)
    const hullLower = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.2, 17.0), hullMat);
    hullLower.position.y = 1.6;
    hullLower.castShadow = true;
    ship.add(hullLower);

    // 船頭尖削尖角 (Bow)
    const bow = new THREE.Mesh(new THREE.ConeGeometry(2.7, 4.5, 4), hullMat);
    bow.rotation.x = -Math.PI / 2;
    bow.rotation.y = Math.PI / 4;
    bow.position.set(0, 1.8, -10.0);
    bow.castShadow = true;
    ship.add(bow);

    // 前伸斜桅 (Bowsprit Spar)
    const bowsprit = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 6.0, 8), darkWoodMat);
    bowsprit.rotation.x = -Math.PI / 3.2;
    bowsprit.position.set(0, 3.2, -13.5);
    ship.add(bowsprit);

    // 船尾高聳船長室 (Sterncastle & Captain Cabin)
    const sternCastle = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.4, 5.2), hullMat);
    sternCastle.position.set(0, 3.5, 6.2);
    sternCastle.castShadow = true;
    ship.add(sternCastle);

    // 船長室彩繪玻璃窗
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 });
    const cabinWin = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 0.2), windowMat);
    cabinWin.position.set(0, 3.6, 8.85);
    ship.add(cabinWin);

    // 船舷兩側金色雕飾條
    const trimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 17.2), goldTrimMat);
    trimLeft.position.set(-2.75, 3.0, 0);
    ship.add(trimLeft);

    const trimRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 17.2), goldTrimMat);
    trimRight.position.set(2.75, 3.0, 0);
    ship.add(trimRight);

    // 船尾黃銅舵輪 (Ship's Wheel)
    const wheelStand = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.3), darkWoodMat);
    wheelStand.position.set(0, 5.5, 4.5);
    ship.add(wheelStand);

    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 6, 12), brassMat);
    wheel.position.set(0, 6.0, 4.4);
    ship.add(wheel);

    // 船尾皇家海軍旗幟
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.5, 8), darkWoodMat);
    flagPole.position.set(0, 6.8, 8.4);
    ship.add(flagPole);

    const navyFlag = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, side: THREE.DoubleSide }));
    navyFlag.position.set(0.8, 7.5, 8.4);
    ship.add(navyFlag);

    // 三座巍峨高聳桅杆 (Three Masts)
    const mastData = [
      { z: -5.0, height: 13.0, radius: 0.24, yardWidth: 4.8, yardHeight: 8.5 }, // 前桅 (Foremast)
      { z: 0.0, height: 16.5, radius: 0.28, yardWidth: 5.6, yardHeight: 10.5 }, // 主桅 (Mainmast)
      { z: 4.5, height: 11.5, radius: 0.22, yardWidth: 4.2, yardHeight: 7.5 }   // 後桅 (Mizzenmast)
    ];

    mastData.forEach(m => {
      // 桅杆柱
      const mastPole = new THREE.Mesh(new THREE.CylinderGeometry(m.radius * 0.7, m.radius, m.height, 8), darkWoodMat);
      mastPole.position.set(0, m.height / 2 + 2.5, m.z);
      mastPole.castShadow = true;
      ship.add(mastPole);

      // 橫桁 (Yard)
      const yard = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, m.yardWidth, 8), darkWoodMat);
      yard.rotation.z = Math.PI / 2;
      yard.position.set(0, m.yardHeight, m.z);
      ship.add(yard);

      // 鼓脹白帆 (Sail)
      const sail = new THREE.Mesh(new THREE.PlaneGeometry(m.yardWidth * 0.9, 4.0, 6, 4), sailMat);
      sail.position.set(0, m.yardHeight - 2.0, m.z - 0.2);
      ship.add(sail);

      // 瞭望台 (Crow's Nest)
      const crowNest = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.55, 0.8, 8), darkWoodMat);
      crowNest.position.set(0, m.yardHeight + 1.2, m.z);
      ship.add(crowNest);
    });

    // 碼頭通往帆船跳板木橋 (Gangway Plank, x: -4.0 到 x: -6.5)
    const gangway = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.18, 1.8), darkWoodMat);
    gangway.position.set(3.4, 2.1, 0.5);
    gangway.rotation.z = 0.22;
    gangway.castShadow = true;
    ship.add(gangway);

    // 帆船巨大鐵錨 (Anchor)
    const anchorRing = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.08, 6, 12), brassMat);
    anchorRing.position.set(2.8, 1.5, -8.5);
    ship.add(anchorRing);

    // 互動點 POI: SHIP
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(4.0, 4.5, 4.0), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.set(3.0, 2.5, 0.5);
    hitBox.userData = {
      id: 'poi_SHIP',
      label: '🚢 皇家遠洋三桅帆船 (SHIP)',
      onClick: () => {
        this.world.openSpeechCard('SHIP', () => {
          this.world.addXP(80);
          this.checkZoneCompletionStatus();
        });
      }
    };
    ship.add(hitBox);
    this.world.interactables.push(hitBox);

    // 船身隨海浪輕微擺動動畫
    this.world.animators.push((time) => {
      ship.rotation.z = Math.sin(time * 1.5) * 0.03;
      ship.rotation.x = Math.cos(time * 1.2) * 0.02;
    });

    group.add(ship);
  }

  // 4. 海岸導航燈塔 (Coastal Lighthouse, WIND POI)
  buildHarborLighthouse(group, x, y, z) {
    const lighthouse = new THREE.Group();
    lighthouse.position.set(x, y, z);

    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    const brickMat = new THREE.MeshStandardMaterial({ map: this.tex.lighthouseBrick, roughness: 0.75 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3 });
    const redTrimMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 });

    // 1. 巨大基座花崗岩台階 (Octagonal Foundation)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.5, 1.6, 8), stoneMat);
    base.position.y = 0.8;
    base.castShadow = true;
    base.receiveShadow = true;
    lighthouse.add(base);

    // 2. 圓錐紅白色環石砌塔身 (Tapered Shaft, 高 13m)
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.6, 13.0, 16), brickMat);
    shaft.position.y = 8.1;
    shaft.castShadow = true;
    lighthouse.add(shaft);

    // 3. 頂部環形觀景走廊 (Gallery Deck)
    const gallery = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.0, 0.6, 16), redTrimMat);
    gallery.position.y = 14.8;
    lighthouse.add(gallery);

    // 走廊黑色鑄鐵護欄 (Railings)
    for (let i = 0; i < 12; i++) {
      const rad = (i / 12) * Math.PI * 2;
      const rx = Math.cos(rad) * 2.1;
      const rz = Math.sin(rad) * 2.1;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6), ironMat);
      post.position.set(rx, 15.4, rz);
      lighthouse.add(post);
    }

    // 4. 玻璃燈室 (Lantern Room)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65
    });
    const lanternRoom = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 2.0, 12), glassMat);
    lanternRoom.position.y = 16.0;
    lighthouse.add(lanternRoom);

    // 5. 燈塔圓頂與避雷針 (Dome Roof & Finial)
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.65, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), redTrimMat);
    dome.position.y = 17.0;
    lighthouse.add(dome);

    const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 1.6, 8), brassMat);
    finial.position.y = 18.8;
    lighthouse.add(finial);

    // 6. 航海風向標與風向旗 (WIND POI 核心道具)
    const vaneGroup = new THREE.Group();
    vaneGroup.position.set(0, 19.4, 0);

    const vaneArrow = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 4), brassMat);
    vaneArrow.rotation.z = -Math.PI / 2;
    vaneArrow.position.x = 0.45;
    vaneGroup.add(vaneArrow);

    const vaneTail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.5), brassMat);
    vaneTail.position.x = -0.45;
    vaneGroup.add(vaneTail);

    const windFlag = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshStandardMaterial({ color: 0xef4444, side: THREE.DoubleSide }));
    windFlag.position.set(-0.9, 0, 0);
    vaneGroup.add(windFlag);

    lighthouse.add(vaneGroup);

    // 7. 燈塔旋轉光束 (Rotating Light Beam)
    const beamGroup = new THREE.Group();
    beamGroup.position.set(0, 16.0, 0);

    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(new THREE.ConeGeometry(3.5, 32.0, 16, 1, true), beamMat);
    beam.rotation.x = Math.PI / 2;
    beam.position.z = -16.0;
    beamGroup.add(beam);

    const lanternLight = new THREE.PointLight(0xfef08a, 2.5, 35);
    beamGroup.add(lanternLight);

    lighthouse.add(beamGroup);

    // 互動點 POI: WIND
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.0, 3.2), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.set(0, 2.2, 2.5);
    hitBox.userData = {
      id: 'poi_WIND',
      label: '🌬️ 燈塔航海風向標 (WIND)',
      onClick: () => {
        this.world.openSpeechCard('WIND', () => {
          this.world.addXP(80);
          this.checkZoneCompletionStatus();
        });
      }
    };
    lighthouse.add(hitBox);
    this.world.interactables.push(hitBox);

    // 動畫：光束與風向標旋轉
    this.world.animators.push((time) => {
      beamGroup.rotation.y = time * 0.9;
      vaneGroup.rotation.y = Math.sin(time * 0.6) * 0.6 + 0.3;
    });

    group.add(lighthouse);
  }

  // 5. 碼頭巡邏小艇 (BOAT POI)
  buildHarborRowboat(group, x, y, z) {
    const boat = new THREE.Group();
    boat.position.set(x, y, z);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const oarMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });

    // 小艇木造船身
    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 3.8), woodMat);
    hull.position.y = 0.4;
    boat.add(hull);

    // 尖船頭
    const prow = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.2, 4), woodMat);
    prow.rotation.x = -Math.PI / 2;
    prow.rotation.y = Math.PI / 4;
    prow.position.set(0, 0.4, -2.4);
    boat.add(prow);

    // 木長椅 (Thwarts)
    [-0.6, 0.6].forEach(bz => {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.4), seatMat);
      bench.position.set(0, 0.7, bz);
      boat.add(bench);
    });

    // 划槳一對 (Oars)
    const oar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 2.2, 8), oarMat);
    oar1.rotation.z = 0.5;
    oar1.rotation.y = 0.2;
    oar1.position.set(-0.8, 0.9, 0);
    boat.add(oar1);

    const oar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 2.2, 8), oarMat);
    oar2.rotation.z = -0.5;
    oar2.rotation.y = -0.2;
    oar2.position.set(0.8, 0.9, 0);
    boat.add(oar2);

    // 繫纜麻繩 (Mooring Rope)
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.95 });
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6), ropeMat);
    rope.position.set(0.6, 0.7, -1.8);
    rope.rotation.z = -0.6;
    boat.add(rope);

    // 互動點 POI: BOAT
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 4.2), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.set(0, 0.8, 0);
    hitBox.userData = {
      id: 'poi_BOAT',
      label: '🛶 碼頭木造巡邏小艇 (BOAT)',
      onClick: () => {
        this.world.openSpeechCard('BOAT', () => {
          this.world.addXP(80);
          this.checkZoneCompletionStatus();
        });
      }
    };
    boat.add(hitBox);
    this.world.interactables.push(hitBox);

    // 隨波浪輕晃
    this.world.animators.push((time) => {
      boat.position.y = y + Math.sin(time * 2.0) * 0.05;
      boat.rotation.z = Math.sin(time * 1.8) * 0.04;
    });

    group.add(boat);
  }

  // 6. 碼頭鮮魚貨物堆疊區 (FISH POI)
  buildHarborCargoArea(group, x, y, z) {
    const cargo = new THREE.Group();
    cargo.position.set(x, y, z);

    const woodBoxMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.8 });
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const ironBandMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const fishSilverMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, metalness: 0.7, roughness: 0.3 });

    // 堆疊木箱 (Cargo Crates)
    const crateCoords = [
      [-0.6, 0.45, 0, 0.9],
      [0.5, 0.45, -0.4, 0.9],
      [-0.1, 1.25, -0.2, 0.8]
    ];
    crateCoords.forEach(c => {
      const box = new THREE.Mesh(new THREE.BoxGeometry(c[3], c[3], c[3]), woodBoxMat);
      box.position.set(c[0], c[1], c[2]);
      box.castShadow = true;
      cargo.add(box);
    });

    // 鮮魚木桶 (Fish Barrels)
    const barrelCoords = [[-1.2, 0.5, 0.6], [0.8, 0.5, 0.6]];
    barrelCoords.forEach(b => {
      const tub = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 0.95, 10), barrelMat);
      tub.position.set(b[0], b[1], b[2]);
      tub.castShadow = true;
      cargo.add(tub);

      // 鐵箍
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.08, 10), ironBandMat);
      band.position.set(b[0], b[1], b[2]);
      cargo.add(band);

      // 桶頂銀光閃閃鮮魚
      for (let f = 0; f < 3; f++) {
        const fish = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.45, 6), fishSilverMat);
        fish.rotation.x = Math.PI / 2 + f * 0.3;
        fish.position.set(b[0] + (f - 1) * 0.15, b[1] + 0.5, b[2]);
        cargo.add(fish);
      }
    });

    // 互動點 POI: FISH
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.5, 3.0), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.set(0, 1.2, 0);
    hitBox.userData = {
      id: 'poi_FISH',
      label: '🐟 鮮美漁獲貨箱 (FISH)',
      onClick: () => {
        this.world.openSpeechCard('FISH', () => {
          this.world.addXP(80);
          this.checkZoneCompletionStatus();
        });
      }
    };
    cargo.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(cargo);
  }

  // 7. 碼頭海平線觀景台 (WATER POI)
  buildHarborWaterOverlook(group, x, y, z) {
    const overlook = new THREE.Group();
    overlook.position.set(x, y, z);

    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });

    // 半圓石造欄杆觀景平台
    const balustrade = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1.0, 12, 1, true, 0, Math.PI), stoneMat);
    balustrade.position.y = 0.5;
    balustrade.rotation.y = Math.PI / 2;
    overlook.add(balustrade);

    // 黃銅觀景單筒望遠鏡 (Scenic Telescope)
    const tripod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.25, 1.3, 3), brassMat);
    tripod.position.set(0, 0.65, 0);
    overlook.add(tripod);

    const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.9, 8), brassMat);
    scope.rotation.x = -Math.PI / 3;
    scope.position.set(0, 1.35, -0.1);
    overlook.add(scope);

    // 水波微光標記 (Water Glyph)
    const glyphMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const glyph = new THREE.Mesh(new THREE.RingGeometry(0.6, 0.85, 16), glyphMat);
    glyph.rotation.x = -Math.PI / 2;
    glyph.position.set(0, 0.04, 0);
    overlook.add(glyph);

    // 互動點 POI: WATER
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.0, 3.0), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.set(0, 1.5, 0);
    hitBox.userData = {
      id: 'poi_WATER',
      label: '🌊 澄澈碧藍港灣 (WATER)',
      onClick: () => {
        this.world.openSpeechCard('WATER', () => {
          this.world.addXP(80);
          this.checkZoneCompletionStatus();
        });
      }
    };
    overlook.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      glyph.rotation.z = time * 0.8;
      glyphMat.opacity = 0.4 + Math.sin(time * 2.5) * 0.25;
    });

    group.add(overlook);
  }

  // 8. 航向新世界海關凱旋拱門 (OPEN POI)
  buildHarborGrandArchPortal(group, x, y, z, label, id, onClick) {
    const arch = new THREE.Group();
    arch.position.set(x, y, z);

    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.8 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });

    // 兩側巨大海港石柱立柱
    [-2.2, 2.2].forEach(px => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.9, 5.0, 0.9), stoneMat);
      col.position.set(px, 2.5, 0);
      col.castShadow = true;
      arch.add(col);

      const anchorInsignia = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 6, 12), brassMat);
      anchorInsignia.position.set(px, 3.8, 0.48);
      arch.add(anchorInsignia);
    });

    // 頂部大理石橫梁拱架
    const beam = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.8, 1.0), stoneMat);
    beam.position.set(0, 4.8, 0);
    beam.castShadow = true;
    arch.add(beam);

    // 拱門正中央黃金徽章牌匾 (OPEN)
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.15), brassMat);
    plaque.position.set(0, 4.8, 0.52);
    arch.add(plaque);

    // 湛藍旋渦時空傳送光門 (Azure Portal Vortex)
    const portalMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });
    const portal = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 4.3), portalMat);
    portal.position.set(0, 2.2, 0);
    arch.add(portal);

    // 傳送門互動 Hitbox
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.8, 2.4), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.4;
    hitBox.userData = { id, label, onClick };
    arch.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      portalMat.opacity = 0.45 + Math.sin(time * 3.2) * 0.2;
    });

    group.add(arch);
  }

  // 9. 南側海港鐵道聯絡門 (返回 Zone 5)
  buildHarborSouthRailwayGate(group, x, y, z, label, onTravel) {
    const gate = new THREE.Group();
    gate.position.set(x, y, z);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });

    [-1.8, 1.8].forEach(px => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.0, 0.5), steelMat);
      col.position.set(px, 2.0, 0);
      gate.add(col);

      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), brassMat);
      cap.position.set(px, 4.2, 0);
      gate.add(cap);
    });

    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.3, 0.3), steelMat);
    crossBeam.position.set(0, 3.9, 0);
    gate.add(crossBeam);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.6),
      new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
    );
    glow.position.set(0, 1.9, 0);
    gate.add(glow);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.8, 4.0, 2.4), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'return_portal_zone5_from_harbor',
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

  // 9b. 燈塔雲霄星光空橋傳送陣 (通往 Zone 7 雲頂星空觀測站)
  buildHarborObservatoryAscensionGate(group, x, y, z, label, onTravel) {
    const gate = new THREE.Group();
    gate.position.set(x, y, z);

    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, roughness: 0.1, transparent: true, opacity: 0.85 });

    // 光芒符文魔法台座
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.35, 16), brassMat);
    base.position.y = 0.18;
    gate.add(base);

    // 向上穿透雲霄的垂直星光光柱
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 16, 16, 1, true), beamMat);
    beam.position.y = 8.0;
    gate.add(beam);

    // 環繞光柱旋轉的星芒微粒水晶
    const orbitCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), crystalMat);
    orbitCrystal.position.set(1.2, 1.6, 0);
    gate.add(orbitCrystal);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.0, 3.2), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'travel_portal_zone7_from_harbor',
      label,
      onClick: () => {
        if (onTravel) onTravel();
      }
    };
    gate.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      beamMat.opacity = 0.35 + Math.sin(time * 3) * 0.15;
      orbitCrystal.position.x = Math.cos(time * 2) * 1.2;
      orbitCrystal.position.z = Math.sin(time * 2) * 1.2;
      orbitCrystal.position.y = 1.6 + Math.sin(time * 3) * 0.3;
      orbitCrystal.rotation.y = time * 2;
    });

    group.add(gate);
  }

  // 10. 👑 關卡主 NPC：皇家海港總督・瑪琳娜船長 (Captain Marina)
  buildHarborGuardianNPC(group, x, y, z) {
    const npc = new THREE.Group();
    npc.position.set(x, y, z);

    const navyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.8 });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });

    // 羅盤雕花底座 (Compass Rose Pedestal)
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.2, 16), goldMat);
    pedestal.position.y = 0.1;
    pedestal.receiveShadow = true;
    npc.add(pedestal);

    // 守護者腳下光環 (Aura Ring)
    const auraMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const aura = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.5, 24), auraMat);
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.12;
    npc.add(aura);

    // 雙腿長靴
    [-0.22, 0.22].forEach(lx => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.1, 8), hatMat);
      leg.position.set(lx, 0.75, 0);
      leg.castShadow = true;
      npc.add(leg);
    });

    // 海軍大衣身體軀幹 (Navy Frock Coat)
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 1.1, 8), navyMat);
    torso.position.y = 1.8;
    torso.castShadow = true;
    npc.add(torso);

    // 大衣金色雙排扣與飾邊
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.08), goldMat);
    trim.position.set(0, 1.8, 0.35);
    npc.add(trim);

    // 金色肩章 (Epaulets)
    [-0.42, 0.42].forEach(ex => {
      const epaulet = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.28), goldMat);
      epaulet.position.set(ex, 2.3, 0);
      npc.add(epaulet);
    });

    // 白色領結襯衫 (Jabot Cravat)
    const cravat = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.05), whiteMat);
    cravat.position.set(0, 2.22, 0.34);
    npc.add(cravat);

    // 頭部與金色捲髮 (Head & Hair)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), skinMat);
    head.position.y = 2.58;
    head.castShadow = true;
    npc.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.29, 8, 8), hairMat);
    hair.position.set(0, 2.62, -0.05);
    npc.add(hair);

    // 船長三角雙角帽 (Captain's Bicorne Hat)
    const hat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.42), hatMat);
    hat.position.set(0, 2.86, 0);
    hat.rotation.y = Math.PI / 10;
    npc.add(hat);

    const hatCockade = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), goldMat);
    hatCockade.position.set(0.25, 2.92, 0.2);
    npc.add(hatCockade);

    // 右手拿著黃銅單筒望遠鏡 (Spyglass)
    const spyglass = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.75, 8), goldMat);
    spyglass.rotation.x = -Math.PI / 3;
    spyglass.rotation.z = -0.3;
    spyglass.position.set(0.48, 1.9, 0.25);
    npc.add(spyglass);

    // 頭頂懸浮動態稱號牌 (Billboard)
    const billboard = this.createGuardianBillboard('zone6', '瑪琳娜船長');
    billboard.position.set(0, 3.4, 0);
    npc.add(billboard);

    // 互動 HitBox: 點擊或 E 鍵挑戰關卡主
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.6, 2.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.8;
    hitBox.userData = {
      id: 'guardian_zone6',
      label: '💬 [E] 與關卡主・瑪琳娜船長對話 (Captain Marina)',
      onClick: () => {
        this.handleGuardianInteraction('zone6');
      }
    };
    npc.add(hitBox);
    this.world.interactables.push(hitBox);

    // 關卡主周身光環呼吸動畫
    this.world.animators.push((time) => {
      aura.rotation.z = time * 0.5;
      const s = 1.0 + Math.sin(time * 2.5) * 0.08;
      aura.scale.set(s, s, s);
      billboard.position.y = 3.4 + Math.sin(time * 2.0) * 0.06;
    });

    group.add(npc);
  }

  // 關卡主動態畫布稱號牌 (Canvas Billboard)
  createGuardianBillboard(zoneId, name) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Group();

    const p = (window.cloudSyncManager && window.cloudSyncManager.profile)
      ? window.cloudSyncManager.profile
      : { completedWords: [] };
    const completedList = (p.completedWords || []).map(w => w.toUpperCase());
    const zone = this.zones[zoneId] || { words: [] };
    const isReady = zone.words.every(w => completedList.includes(w.toUpperCase()));

    // 背景氣泡圓角
    ctx.fillStyle = isReady ? 'rgba(15, 23, 42, 0.88)' : 'rgba(30, 41, 59, 0.75)';
    ctx.strokeStyle = isReady ? '#facc15' : '#64748b';
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 20);
    ctx.fill();
    ctx.stroke();

    // 文字
    ctx.textAlign = 'center';
    const isZone8 = (zoneId === 'zone8');
    const isZone7 = (zoneId === 'zone7');
    const bossIcon = isZone8 ? '❄️' : (isZone7 ? '🔭' : '⚓');
    const bossEn = isZone8 ? 'Archmage Frost' : (isZone7 ? 'Astrologer Aethel' : 'Captain Marina');
    const bossAction = isZone8 ? '💬 [E] 與長老對話 / 接受試煉' : (isZone7 ? '💬 [E] 與賢者對話 / 接受試煉' : '💬 [E] 與船長對話 / 接受試煉');

    if (isReady) {
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('👑 [E] 挑戰關卡主試煉！', 256, 55);
      ctx.fillStyle = '#67e8f9';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`${bossIcon} ${name} (${bossEn})`, 256, 95);
    } else {
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`${bossIcon} 關卡主・${name}`, 256, 52);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(bossAction, 256, 92);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;

    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(3.2, 0.8, 1);
    return sprite;
  }

  // POI 標籤安全防護方法 (若有外部呼叫亦不產生例外)
  createPoiNameplate(text) {
    return new THREE.Group();
  }

  // 關卡主互動決策 (Guardian Interaction Handler)
  handleGuardianInteraction(zoneId) {
    const zone = this.zones[zoneId];
    if (!zone) return;

    // 直接與關卡主面對面對話！由對話彈窗提供親切引導與問句挑戰
    if (typeof window.openGuardianTrial === 'function') {
      window.openGuardianTrial(zoneId);
    } else if (this.world && typeof this.world.openGuardianTrial === 'function') {
      this.world.openGuardianTrial(zoneId);
    } else {
      this.world.showToast('⚓ 關卡主對話已就緒！');
    }
  }

  // 檢查關卡探索完成狀態
  checkZoneCompletionStatus() {
    const curZone = this.zones[this.currentZoneId];
    if (!curZone) return;

    const p = (window.cloudSyncManager && window.cloudSyncManager.profile)
      ? window.cloudSyncManager.profile
      : { completedWords: [] };
    const completedList = (p.completedWords || []).map(w => w.toUpperCase());

    const remaining = curZone.words.filter(w => !completedList.includes(w.toUpperCase()));
    if (remaining.length === 0) {
      if (window.audioManager) window.audioManager.playSfx('magicSuccess');
      this.world.showToast(`🎉【${curZone.name}】所有單字已全數集齊！關卡主頭頂已綻放金色皇冠，快去接受英語問句挑戰！`);
    }
  }

  // 11. 海港天際海鷗動態 (Harbor Seagulls)
  buildHarborSeagulls(group) {
    const gullGroup = new THREE.Group();
    const gullMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    const gulls = [];
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group();
      // 兩片海鷗翅膀
      const wingLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.25), gullMat);
      wingLeft.position.x = -0.3;
      wingLeft.rotation.z = 0.25;
      g.add(wingLeft);

      const wingRight = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.25), gullMat);
      wingRight.position.x = 0.3;
      wingRight.rotation.z = -0.25;
      g.add(wingRight);

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.5, 6), gullMat);
      body.rotation.x = Math.PI / 2;
      g.add(body);

      g.position.set(
        Math.cos((i / 4) * Math.PI * 2) * 14,
        12 + i * 1.2,
        Math.sin((i / 4) * Math.PI * 2) * 14
      );
      gullGroup.add(g);
      gulls.push({ mesh: g, angle: (i / 4) * Math.PI * 2, radius: 14 + i * 2, speed: 0.4 + i * 0.1 });
    }

    this.world.animators.push((time) => {
      gulls.forEach(g => {
        g.angle += g.speed * 0.02;
        g.mesh.position.x = Math.cos(g.angle) * g.radius;
        g.mesh.position.z = Math.sin(g.angle) * g.radius;
        g.mesh.rotation.y = -g.angle;
      });
    });

    group.add(gullGroup);
  }

  // =========================================================================
  // Zone 7: 雲頂星空觀測站 (Celestial Starlight Observatory)
  // =========================================================================
  buildZone7_Observatory(group) {
    this.initTextures();

    // 1. 光照系統 (深邃星夜、柔和半球光、星芒高光與列柱暖燈)
    this.buildObservatoryLighting(group);

    // 2. 浩瀚宇宙天體奇觀 (環狀氣態巨行星、自轉月球、真實星座星軌連線、600星芒、動態流星群)
    this.buildObservatoryCosmicSky(group);

    // 3. 古典星穹列柱迴廊、黃道十二宮金嵌大理石地坪與浮石浮島
    this.buildObservatoryFloatingTerrace(group);

    // 4. 巨型星穹折射望遠鏡 (SKY POI, x: 0, z: -6.5) - 皇家赤道儀與階梯觀測台
    this.buildObservatoryTelescope(group, 0.0, 0, -6.5);

    // 5. 遠古星辰渾天儀 / 渾象儀 (STAR POI, x: -6.5, z: -1.0) - 多軸嵌套黃銅刻度環與齒輪傳動
    this.buildObservatoryStarAstrolabe(group, -6.5, 0, -1.0);

    // 6. 蒼月潮汐日晷與月相儀 (MOON POI, x: 6.5, z: -1.0) - 月相盈虧、銀質水銀潮汐盆與星盤刻度
    this.buildObservatoryMoonSundial(group, 6.5, 0, -1.0);

    // 7. 日冕光學分光鏡與太陽儀 (SUN POI, x: -5.0, z: 4.0) - 純淨石英三稜鏡與 3D 彩虹色散光譜
    this.buildObservatorySunPrism(group, -5.0, 0, 4.0);

    // 8. 雲海氣象星盤與風之琴 (CLOUD POI, x: 5.0, z: 4.0) - 四方風向標、水銀氣壓計與立體風鳴琴
    this.buildObservatoryCloudAltar(group, 5.0, 0, 4.0);

    // 9. 星界凱旋星門 (OPEN POI, x: 0.0, z: -12.5) - 雙柱古典大理石凱旋門與事件視界漩渦
    this.buildObservatoryStargatePortal(group, 0.0, 0, -12.5, '🚪 星界凱旋星門 (OPEN)', 'OPEN', () => {
      this.world.openSpeechCard('OPEN', () => {
        this.world.addXP(100);
        this.checkZoneCompletionStatus();
      });
    });

    // 9b. 璀璨極光冰橋 (通往 Zone 8 極光冰雪聖域, x: -8.5, z: -3.8)
    this.buildObservatorySanctuaryGate(group, -8.5, 0, -3.8, '❄️ 璀璨極光冰橋 ➔ 登上【極光冰雪聖域】', () => {
      this.world.showToast('❄️ 踏上極光冰橋，躍升至極光冰雪聖域！');
      this.switchZone('zone8');
    });

    // 10. 南側降落星光空橋 (返回 Zone 6 蔚藍秘境海港, x: 0.0, z: 11.8)
    this.buildObservatoryHarborSkybridgeGate(group, 0.0, 0, 11.8, '⚓ 降落星光空橋 ➔ 返回【蔚藍秘境海港】', () => {
      this.world.showToast('⚓ 沿著星光空橋緩降，返回蔚藍秘境海港！');
      this.switchZone('zone6');
    });

    // 11. 👑 關卡主 NPC：星象總監・艾瑟爾賢者 (Astrologer Aethel, x: 1.5, z: -3.5)
    this.buildObservatoryGuardianNPC(group, 1.5, 0, -3.5);

    // 12. 飄浮星塵微粒 (Celestial Stardust)
    this.addFloatingParticles(group, 0xfde047, 220, 36, 7);
  }

  // 1. 光照系統 (深邃星夜與古典列柱暖燈)
  buildObservatoryLighting(group) {
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 0.95);
    group.add(hemiLight);

    const starlight = new THREE.DirectionalLight(0xfffaed, 1.25);
    starlight.position.set(16, 32, 14);
    starlight.castShadow = true;
    starlight.shadow.mapSize.width = 1024;
    starlight.shadow.mapSize.height = 1024;
    group.add(starlight);

    // 中央黃道星盤暖光
    const centerGlow = new THREE.PointLight(0xfacc15, 1.3, 20);
    centerGlow.position.set(0, 2.8, 0);
    group.add(centerGlow);

    // 列柱迴廊古典暖色星燈
    [[-8.0, 3.5, -9.0], [0.0, 3.5, -11.5], [8.0, 3.5, -9.0]].forEach(pos => {
      const lampGlow = new THREE.PointLight(0xfde047, 0.85, 12);
      lampGlow.position.set(pos[0], pos[1], pos[2]);
      group.add(lampGlow);
    });
  }

  // 2. 浩瀚宇宙天體奇觀 (環狀氣態巨行星、自轉月球、真實星座星軌連線、600星芒、動態流星群)
  buildObservatoryCosmicSky(group) {
    const skyGroup = new THREE.Group();

    // 遙遠天際的巨型環狀氣態巨行星 (Ringed Celestial Giant)
    const planetGroup = new THREE.Group();
    planetGroup.position.set(62, 36, -82);

    // 行星本體：大氣條帶漸層感
    const planetGeo = new THREE.SphereGeometry(14, 32, 32);
    const planetMat = new THREE.MeshStandardMaterial({
      color: 0x3b0764,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.5,
      roughness: 0.55
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planet);

    // 行星多層光環 (Planetary Rings)
    const ringGeoInner = new THREE.RingGeometry(17, 23, 48);
    const ringMatInner = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.68
    });
    const ringInner = new THREE.Mesh(ringGeoInner, ringMatInner);
    ringInner.rotation.x = Math.PI * 0.38;
    ringInner.rotation.y = Math.PI * 0.12;
    planetGroup.add(ringInner);

    const ringGeoOuter = new THREE.RingGeometry(24, 29, 48);
    const ringMatOuter = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const ringOuter = new THREE.Mesh(ringGeoOuter, ringMatOuter);
    ringOuter.rotation.x = Math.PI * 0.38;
    ringOuter.rotation.y = Math.PI * 0.12;
    planetGroup.add(ringOuter);

    skyGroup.add(planetGroup);

    // 銀藍色明亮滿月 (Silver Moon with Craters)
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-58, 40, -62);
    const moonGeo = new THREE.SphereGeometry(9, 24, 24);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.48,
      roughness: 0.45
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moon);

    // 月華光暈
    const haloGeo = new THREE.RingGeometry(9.5, 14.5, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.lookAt(-58, 40, 60);
    moonGroup.add(halo);

    skyGroup.add(moonGroup);

    // 600 顆立體星辰 (Twinkling Cosmic Stars)
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 85 + Math.random() * 45;
      const sinPhi = Math.sin(phi);
      starPos[i * 3] = r * sinPhi * Math.cos(theta);
      starPos[i * 3 + 1] = Math.max(5, r * Math.cos(phi));
      starPos[i * 3 + 2] = r * sinPhi * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starPointsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.4,
      transparent: true,
      opacity: 0.92
    });
    const starPoints = new THREE.Points(starGeo, starPointsMat);
    skyGroup.add(starPoints);

    // 穹頂金色星座星軌連線 (Constellation Line Segments: 北斗七星與獵戶座)
    const constellationMat = new THREE.LineBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    // 北斗七星 7 個星點與連線
    const dipperPts = [
      new THREE.Vector3(-30, 48, -70),
      new THREE.Vector3(-24, 52, -72),
      new THREE.Vector3(-18, 50, -75),
      new THREE.Vector3(-14, 44, -76),
      new THREE.Vector3(-8, 45, -78),
      new THREE.Vector3(-6, 38, -78),
      new THREE.Vector3(-13, 37, -76)
    ];
    const dipperLineGeo = new THREE.BufferGeometry();
    const dipperLineCoords = [];
    for (let i = 0; i < dipperPts.length - 1; i++) {
      dipperLineCoords.push(dipperPts[i].x, dipperPts[i].y, dipperPts[i].z);
      dipperLineCoords.push(dipperPts[i + 1].x, dipperPts[i + 1].y, dipperPts[i + 1].z);
    }
    // 杓口閉合線
    dipperLineCoords.push(dipperPts[6].x, dipperPts[6].y, dipperPts[6].z);
    dipperLineCoords.push(dipperPts[3].x, dipperPts[3].y, dipperPts[3].z);

    dipperLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(dipperLineCoords, 3));
    const dipperLine = new THREE.LineSegments(dipperLineGeo, constellationMat);
    skyGroup.add(dipperLine);

    // 星點鑽石微粒
    const starStarMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    dipperPts.forEach(pt => {
      const starNode = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), starStarMat);
      starNode.position.copy(pt);
      skyGroup.add(starNode);
    });

    // 動態流星 (Shooting Stars)
    const meteors = [];
    const meteorMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let m = 0; m < 4; m++) {
      const mMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.02, 4.5, 4), meteorMat);
      mMesh.rotation.z = Math.PI / 4;
      skyGroup.add(mMesh);
      const meteorObj = {
        mesh: mMesh,
        speed: 35 + Math.random() * 25,
        reset: () => {
          mMesh.position.set(
            (Math.random() - 0.5) * 80,
            40 + Math.random() * 20,
            -30 - Math.random() * 50
          );
        }
      };
      meteorObj.reset();
      meteors.push(meteorObj);
    }

    this.world.animators.push((time, delta) => {
      planetGroup.rotation.y = time * 0.03;
      moonGroup.rotation.y = -time * 0.02;
      starPoints.rotation.y = time * 0.005;

      const dt = delta || 0.016;
      meteors.forEach(m => {
        m.mesh.position.x += m.speed * dt * 0.8;
        m.mesh.position.y -= m.speed * dt * 0.6;
        if (m.mesh.position.y < 10 || m.mesh.position.x > 70) {
          m.reset();
        }
      });
    });

    group.add(skyGroup);
  }

  // 3. 古典星穹列柱迴廊、黃道十二宮金嵌大理石地坪與浮石浮島
  buildObservatoryFloatingTerrace(group) {
    const terraceGroup = new THREE.Group();

    const marbleTileMat = new THREE.MeshStandardMaterial({
      map: this.tex.celestialMarble,
      roughness: 0.45,
      metalness: 0.15
    });
    const brassTrimMat = new THREE.MeshStandardMaterial({
      map: this.tex.astrolabeBrass,
      roughness: 0.35,
      metalness: 0.85
    });
    const stoneBaseMat = new THREE.MeshStandardMaterial({
      map: this.tex.stoneWall,
      roughness: 0.85
    });
    const flutedPillarMat = new THREE.MeshStandardMaterial({
      map: this.tex.celestialMarble,
      roughness: 0.4,
      metalness: 0.1
    });
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.2
    });

    // 下層主浮島圓形基座 (Main Floating Terrace, 半徑 14.8m, 厚 2.2m)
    const islandGeo = new THREE.CylinderGeometry(14.8, 12.5, 2.2, 40);
    const island = new THREE.Mesh(islandGeo, marbleTileMat);
    island.position.y = -1.1;
    island.receiveShadow = true;
    terraceGroup.add(island);

    // 浮島底部層疊岩石浮石錐 (Layered Floating Keystone)
    const rockConeGeo = new THREE.ConeGeometry(12.5, 7.5, 16);
    const rockCone = new THREE.Mesh(rockConeGeo, stoneBaseMat);
    rockCone.rotation.x = Math.PI;
    rockCone.position.y = -5.95;
    terraceGroup.add(rockCone);

    // 浮島底部垂懸星芒發光晶簇 (Hanging Celestial Crystals)
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.65,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.9
    });
    for (let i = 0; i < 8; i++) {
      const cAngle = (i / 8) * Math.PI * 2;
      const cDist = 4.5 + (i % 3) * 2.2;
      const cSpike = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.8 + (i % 2) * 1.2, 6), crystalMat);
      cSpike.position.set(Math.cos(cAngle) * cDist, -6.5 - (i % 3) * 0.8, Math.sin(cAngle) * cDist);
      cSpike.rotation.x = Math.PI;
      terraceGroup.add(cSpike);
    }

    // 上層黃道十二宮金嵌大理石觀星高台 (Raised Zodiac Dais, 半徑 8.0m, 高 0.38m)
    const daisMat = new THREE.MeshStandardMaterial({
      map: this.tex.zodiacFloor,
      roughness: 0.35,
      metalness: 0.25
    });
    const daisGeo = new THREE.CylinderGeometry(8.0, 8.2, 0.38, 48);
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.y = 0.19;
    dais.receiveShadow = true;
    terraceGroup.add(dais);

    // 觀星高台金嵌外緣飾邊 (Brass Beveled Rim)
    const daisRimMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeBrass, metalness: 0.9, roughness: 0.25 });
    const daisRim = new THREE.Mesh(new THREE.TorusGeometry(8.08, 0.12, 8, 48), daisRimMat);
    daisRim.rotation.x = Math.PI / 2;
    daisRim.position.y = 0.38;
    terraceGroup.add(daisRim);

    // ==========================================
    // 北側古典星穹凹槽列柱迴廊 (Classical Fluted Colonnade)
    // 8 根柱身帶有古典凹槽飾線、柱頭雕花與連通拱樑，氣勢恢宏！
    // ==========================================
    const colonnadeGroup = new THREE.Group();
    const pillarAngles = [
      Math.PI * 0.62, Math.PI * 0.72, Math.PI * 0.82, Math.PI * 0.92,
      Math.PI * 1.08, Math.PI * 1.18, Math.PI * 1.28, Math.PI * 1.38
    ];
    const pillarCoords = [];

    pillarAngles.forEach((ang) => {
      const px = Math.cos(ang) * 13.6;
      const pz = Math.sin(ang) * 13.6;
      pillarCoords.push([px, pz]);

      const pillarObj = new THREE.Group();
      pillarObj.position.set(px, 0, pz);

      // 八角柱基座 (Pedestal)
      const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.45, 8), flutedPillarMat);
      pBase.position.y = 0.22;
      pBase.castShadow = true;
      pillarObj.add(pBase);

      // 古典凹槽主柱身 (Fluted Shaft, 高 4.8m)
      const pShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 4.8, 16), flutedPillarMat);
      pShaft.position.y = 2.85;
      pShaft.castShadow = true;
      pillarObj.add(pShaft);

      // 柱頭愛奧尼克 / 柯林斯複合雕花頂 (Capital)
      const pCap = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.45, 0.45, 8), brassTrimMat);
      pCap.position.y = 5.45;
      pCap.castShadow = true;
      pillarObj.add(pCap);

      colonnadeGroup.add(pillarObj);
    });

    // 柱頂橫跨大理石額枋橫樑 (Architrave Frieze)
    for (let i = 0; i < pillarCoords.length - 1; i++) {
      if (i === 3) continue; // 中間留出正北凱旋星門通道
      const p1 = pillarCoords[i];
      const p2 = pillarCoords[i + 1];
      const midX = (p1[0] + p2[0]) / 2;
      const midZ = (p1[1] + p2[1]) / 2;
      const beamLen = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const beamAng = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);

      const beam = new THREE.Mesh(new THREE.BoxGeometry(beamLen + 0.3, 0.4, 0.7), flutedPillarMat);
      beam.position.set(midX, 5.85, midZ);
      beam.rotation.y = -beamAng;
      beam.castShadow = true;
      colonnadeGroup.add(beam);

      // 橫樑下懸掛黃銅星象提燈 (Hanging Starlight Lantern)
      const lantern = new THREE.Group();
      lantern.position.set(midX, 5.0, midZ);

      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6), brassTrimMat);
      chain.position.y = 0.35;
      lantern.add(chain);

      const lampBody = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), lanternMat);
      lantern.add(lampBody);

      colonnadeGroup.add(lantern);
    }

    terraceGroup.add(colonnadeGroup);

    // ==========================================
    // 古典雕花大理石與黃銅連續圍欄 (Continuous Balustrade)
    // ==========================================
    const railGroup = new THREE.Group();
    const railCount = 32;
    for (let i = 0; i < railCount; i++) {
      const angle = (i / railCount) * Math.PI * 2;
      const px = Math.cos(angle) * 14.4;
      const pz = Math.sin(angle) * 14.4;

      // 避開主要出入口：正北星門、西北極光冰橋、正南降落空橋
      if (Math.abs(px) < 3.2 && (pz > 10 || pz < -10)) continue;
      if (px < -6.5 && pz < -2.0 && pz > -5.5) continue;

      // 瓶狀花瓶雕花欄杆柱 (Baluster)
      const baluster = new THREE.Group();
      baluster.position.set(px, 0, pz);

      const bBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.2, 8), flutedPillarMat);
      bBase.position.y = 0.1;
      baluster.add(bBase);

      const bBody = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.7, 8), flutedPillarMat);
      bBody.position.y = 0.55;
      baluster.add(bBody);

      const bTop = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.15, 8), flutedPillarMat);
      bTop.position.y = 0.98;
      baluster.add(bTop);

      railGroup.add(baluster);
    }

    // 圓弧型頂部大理石扶手 (Continuous Handrail Ring)
    const handrailGeo = new THREE.TorusGeometry(14.4, 0.1, 8, 48, Math.PI * 1.8);
    const handrail = new THREE.Mesh(handrailGeo, brassTrimMat);
    handrail.rotation.x = Math.PI / 2;
    handrail.rotation.z = Math.PI * 0.1;
    handrail.position.y = 1.08;
    railGroup.add(handrail);

    terraceGroup.add(railGroup);

    // 圍繞浮島周邊翻湧的 3D 棉花雲海 (Fluffy Cloud Clusters)
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.88
    });
    const cloudPuffs = [];
    for (let c = 0; c < 24; c++) {
      const cAngle = (c / 24) * Math.PI * 2;
      const cDist = 15.5 + Math.random() * 5.0;
      const cloudPuff = new THREE.Group();
      cloudPuff.position.set(
        Math.cos(cAngle) * cDist,
        -1.5 + (Math.random() - 0.5) * 1.8,
        Math.sin(cAngle) * cDist
      );

      for (let p = 0; p < 4; p++) {
        const rad = 1.4 + Math.random() * 1.5;
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(rad, 10, 10), cloudMat);
        sphere.position.set(
          (Math.random() - 0.5) * 2.2,
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 2.2
        );
        cloudPuff.add(sphere);
      }
      terraceGroup.add(cloudPuff);
      cloudPuffs.push({
        group: cloudPuff,
        baseY: cloudPuff.position.y,
        speed: 1.0 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2
      });
    }

    this.world.animators.push((time) => {
      cloudPuffs.forEach(cp => {
        cp.group.position.y = cp.baseY + Math.sin(time * cp.speed + cp.offset) * 0.4;
      });
    });

    group.add(terraceGroup);
  }

  // 4. 巨型星穹折射望遠鏡 (SKY POI) - 皇家赤道儀與階梯觀測台
  buildObservatoryTelescope(group, x, y, z) {
    const telescope = new THREE.Group();
    telescope.position.set(x, y, z);

    const brassMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeBrass, metalness: 0.88, roughness: 0.28 });
    const navyMat = new THREE.MeshStandardMaterial({ color: 0x0a1128, metalness: 0.8, roughness: 0.3 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.05, metalness: 0.95, transparent: true, opacity: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.75 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.25 });

    // 八角大理石赤道儀台座 (Octagonal Mounting Pedestal)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, 0.7, 8), navyMat);
    base.position.y = 0.35;
    base.castShadow = true;
    telescope.add(base);

    const baseTrim = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.12, 8), brassMat);
    baseTrim.position.y = 0.72;
    telescope.add(baseTrim);

    // 雙叉鑄鐵旋轉支架與極軸箱 (Fork Mount & Polar Axis Housing)
    const polarHousing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.4), ironMat);
    polarHousing.position.set(0, 1.35, 0);
    telescope.add(polarHousing);

    [-0.95, 0.95].forEach(fx => {
      const forkArm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.6, 0.55), ironMat);
      forkArm.position.set(fx, 2.4, 0);
      forkArm.castShadow = true;
      telescope.add(forkArm);

      // 赤緯刻度盤 (Setting Circles)
      const settingCircle = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 16), brassMat);
      settingCircle.position.set(fx * 1.15, 3.2, 0);
      settingCircle.rotation.z = Math.PI / 2;
      telescope.add(settingCircle);
    });

    // 望遠鏡鏡筒總成 (Main Optical Tube Assembly, 指向天空 48度)
    const ota = new THREE.Group();
    ota.position.set(0, 3.2, 0);
    ota.rotation.x = -Math.PI * 0.26;

    // 主鏡筒 (Main Tube, 長 7.5m)
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.88, 7.5, 20), navyMat);
    tube.castShadow = true;
    ota.add(tube);

    // 4 道加固黃銅箍帶 (Brass Reinforcement Hoops)
    [-2.4, -0.8, 0.8, 2.4].forEach(ty => {
      const hoop = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.16, 20), brassMat);
      hoop.position.y = ty;
      ota.add(hoop);
    });

    // 前端大口徑凸透物鏡與防露罩 (Dew Shield & Large Objective Lens)
    const dewShield = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.7, 0.6, 20), brassMat);
    dewShield.position.y = 3.9;
    ota.add(dewShield);

    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 20), lensMat);
    lens.position.y = 3.95;
    ota.add(lens);

    // 側邊高精度尋星鏡 (Precision Finder Scope)
    const finder = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 3.2, 10), brassMat);
    finder.position.set(0.78, 0.6, 0.35);
    ota.add(finder);

    // 尾部多目鏡旋轉轉盤與對焦手輪 (Eyepiece Turret & Focus Wheels)
    const eyepieceTurret = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.35, 12), brassMat);
    eyepieceTurret.position.y = -3.9;
    ota.add(eyepieceTurret);

    const eyepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.75, 8), brassMat);
    eyepiece.position.set(0, -4.3, 0);
    ota.add(eyepiece);

    telescope.add(ota);

    // 天文學家木造觀測梯台 (Observing Platform Steps)
    const stairGroup = new THREE.Group();
    stairGroup.position.set(1.6, 0, 1.0);
    for (let s = 0; s < 4; s++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 0.45), woodMat);
      step.position.set(0, 0.125 + s * 0.25, -s * 0.4);
      step.castShadow = true;
      stairGroup.add(step);
    }
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6), brassMat);
    rail.position.set(0.55, 1.1, -0.6);
    rail.rotation.x = 0.5;
    stairGroup.add(rail);
    telescope.add(stairGroup);

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.6, 3.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.2;
    hitBox.userData = {
      id: 'vocab_sky',
      label: '🔭 觀測星穹巨型折射望遠鏡 (SKY)',
      onClick: () => {
        this.world.openSpeechCard('SKY', () => {
          this.world.addXP(50);
          this.checkZoneCompletionStatus();
        });
      }
    };
    telescope.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      ota.rotation.y = Math.sin(time * 0.4) * 0.08;
      ota.rotation.x = -Math.PI * 0.26 + Math.cos(time * 0.3) * 0.04;
    });

    group.add(telescope);
  }

  // 5. 遠古星辰渾天儀 / 渾象儀 (STAR POI) - 多軸嵌套黃銅刻度環與齒輪傳動
  buildObservatoryStarAstrolabe(group, x, y, z) {
    const astrolabe = new THREE.Group();
    astrolabe.position.set(x, y, z);

    const brassDialMat = new THREE.MeshStandardMaterial({
      map: this.tex.astrolabeDial,
      metalness: 0.9,
      roughness: 0.22
    });
    const polishedGoldMat = new THREE.MeshStandardMaterial({
      map: this.tex.astrolabeBrass,
      metalness: 0.92,
      roughness: 0.18
    });
    const starCrystalMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.75,
      roughness: 0.15,
      metalness: 0.4
    });
    const marbleMat = new THREE.MeshStandardMaterial({ map: this.tex.celestialMarble, roughness: 0.4 });

    // 八角大理石雕花基座 (Octagonal Marble Plinth)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.85, 0.55, 8), marbleMat);
    base.position.y = 0.28;
    base.castShadow = true;
    astrolabe.add(base);

    // 四爪黃銅神獸支架 (Brass Claw Feet)
    for (let c = 0; c < 4; c++) {
      const clawAng = (c / 4) * Math.PI * 2 + Math.PI / 4;
      const claw = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.45, 0.45), polishedGoldMat);
      claw.position.set(Math.cos(clawAng) * 1.45, 0.35, Math.sin(clawAng) * 1.45);
      claw.rotation.y = -clawAng;
      astrolabe.add(claw);
    }

    // 齒輪傳動箱 (Clockwork Gear Housing)
    const gearBox = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.4, 12), polishedGoldMat);
    gearBox.position.y = 0.75;
    astrolabe.add(gearBox);

    // 支撐雙叉立柱 (Meridian Support Pillar)
    const mainPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.2, 8), polishedGoldMat);
    mainPillar.position.y = 1.45;
    astrolabe.add(mainPillar);

    // 渾天儀多軸嵌套環總成 (Armillary Rings Assembly, 中心高 2.6m)
    const ringAssembly = new THREE.Group();
    ringAssembly.position.y = 2.6;

    // 1. 固定子午環 (Fixed Meridian Ring)
    const meridianRing = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.08, 8, 36), brassDialMat);
    ringAssembly.add(meridianRing);

    // 2. 赤道環 (Celestial Equator Ring)
    const equatorRing = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.07, 8, 36), polishedGoldMat);
    equatorRing.rotation.x = Math.PI / 2;
    ringAssembly.add(equatorRing);

    // 3. 黃道十二宮帶 (Tilted Zodiac Ecliptic Band, 寬環)
    const zodiacBand = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.22, 32, 1, true), brassDialMat);
    zodiacBand.rotation.x = Math.PI * 0.32;
    ringAssembly.add(zodiacBand);

    // 4. 二至圈與二分圈 (Colure Rings)
    const colureRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.06, 8, 32), polishedGoldMat);
    ringAssembly.add(colureRing);

    // 極軸貫穿金矛 (Polar Axis Spear)
    const axisSpear = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.4, 8), polishedGoldMat);
    axisSpear.rotation.x = Math.PI * 0.32;
    ringAssembly.add(axisSpear);

    // 核心懸浮 12 面體極光星辰晶體 (Pulsing Star Crystal)
    const starCrystal = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 0), starCrystalMat);
    ringAssembly.add(starCrystal);

    astrolabe.add(ringAssembly);

    const starLight = new THREE.PointLight(0xfde047, 1.35, 12);
    starLight.position.y = 2.6;
    astrolabe.add(starLight);

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.8, 3.0), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'vocab_star',
      label: '⭐ 轉動遠古星辰渾天儀 (STAR)',
      onClick: () => {
        this.world.openSpeechCard('STAR', () => {
          this.world.addXP(60);
          this.checkZoneCompletionStatus();
        });
      }
    };
    astrolabe.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      meridianRing.rotation.y = time * 0.3;
      equatorRing.rotation.z = time * 0.5;
      zodiacBand.rotation.y = time * 0.7;
      colureRing.rotation.x = time * 0.9;
      starCrystal.rotation.y = time * 1.6;
      starCrystal.rotation.z = time * 0.8;
      const pulse = 1.0 + Math.sin(time * 3.5) * 0.08;
      starCrystal.scale.set(pulse, pulse, pulse);
    });

    group.add(astrolabe);
  }

  // 6. 蒼月潮汐日晷與月相儀 (MOON POI) - 月相盈虧、銀質水銀潮汐盆與星盤刻度
  buildObservatoryMoonSundial(group, x, y, z) {
    const sundial = new THREE.Group();
    sundial.position.set(x, y, z);

    const marbleMat = new THREE.MeshStandardMaterial({ map: this.tex.celestialMarble, roughness: 0.4 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, metalness: 0.92, roughness: 0.18 });
    const dialPlateMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeDial, roughness: 0.35 });
    const moonGlowMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.65,
      roughness: 0.3
    });
    const tidalWaterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.85,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    // 階梯白色大理石台座 (Stepped Marble Base)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.85, 0.6, 16), marbleMat);
    base.position.y = 0.3;
    base.castShadow = true;
    sundial.add(base);

    // 水銀潮汐盆 (Silver Mercury Tidal Basin)
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.2, 0.25, 24), silverMat);
    basin.position.y = 0.65;
    sundial.add(basin);

    const tidalPool = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.05, 24), tidalWaterMat);
    tidalPool.position.y = 0.76;
    sundial.add(tidalPool);

    // 潮汐同心波紋環 (Tidal Ripples)
    const rippleMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const ripple = new THREE.Mesh(new THREE.RingGeometry(0.4, 1.2, 24), rippleMat);
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.y = 0.78;
    sundial.add(ripple);

    // 日晷羅盤刻度盤 (Astrolabe Sundial Plate)
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.08, 24), dialPlateMat);
    plate.position.y = 0.82;
    sundial.add(plate);

    // 銀質彎月日晷晷針 (Crescent Gnomon)
    const gnomon = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.65, 16, 1, 0, Math.PI), silverMat);
    gnomon.position.set(0, 1.2, 0);
    gnomon.rotation.y = Math.PI / 2;
    gnomon.castShadow = true;
    sundial.add(gnomon);

    // 核心懸浮 3D 皎潔滿月月球 (Luminescent Sphere Moon, 高 2.2m)
    const moonSphere = new THREE.Mesh(new THREE.SphereGeometry(0.58, 20, 20), moonGlowMat);
    moonSphere.position.y = 2.2;
    moonSphere.castShadow = true;
    sundial.add(moonSphere);

    // 環繞月球的銀色月環
    const moonRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 6, 24), silverMat);
    moonRing.position.y = 2.2;
    moonRing.rotation.x = Math.PI * 0.35;
    sundial.add(moonRing);

    const moonLight = new THREE.PointLight(0x93c5fd, 1.25, 9);
    moonLight.position.y = 2.2;
    sundial.add(moonLight);

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.6, 2.8), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'vocab_moon',
      label: '🌙 凝望蒼月潮汐日晷儀 (MOON)',
      onClick: () => {
        this.world.openSpeechCard('MOON', () => {
          this.world.addXP(60);
          this.checkZoneCompletionStatus();
        });
      }
    };
    sundial.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      moonSphere.position.y = 2.2 + Math.sin(time * 2.0) * 0.1;
      moonSphere.rotation.y = time * 0.4;
      moonRing.position.y = moonSphere.position.y;
      moonRing.rotation.z = time * 0.6;
      ripple.scale.set(1.0 + Math.sin(time * 2.5) * 0.2, 1.0 + Math.sin(time * 2.5) * 0.2, 1.0);
    });

    group.add(sundial);
  }

  // 7. 日冕光學分光鏡與太陽儀 (SUN POI) - 純淨石英三稜鏡與 3D 彩虹色散光譜
  buildObservatorySunPrism(group, x, y, z) {
    const sunPrism = new THREE.Group();
    sunPrism.position.set(x, y, z);

    const goldMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeBrass, metalness: 0.9, roughness: 0.25 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.75 });
    const quartzMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.82
    });

    // 實木實驗光學儀器台座 (Apparatus Bench)
    const baseBench = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.5, 12), woodMat);
    baseBench.position.y = 0.25;
    baseBench.castShadow = true;
    sunPrism.add(baseBench);

    const brassPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.1, 16), goldMat);
    brassPlate.position.y = 0.55;
    sunPrism.add(brassPlate);

    // 黃銅準直入射鏡筒 (Collimator Tube)
    const collimator = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.4, 12), goldMat);
    collimator.position.set(-0.8, 1.5, 0);
    collimator.rotation.z = -Math.PI / 3;
    sunPrism.add(collimator);

    // 測角旋轉載物台 (Goniometer Stage)
    const stagePillar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.1, 8), goldMat);
    stagePillar.position.y = 1.1;
    sunPrism.add(stagePillar);

    const prismTurntable = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.12, 16), goldMat);
    prismTurntable.position.y = 1.7;
    sunPrism.add(prismTurntable);

    // 光學純淨石英三稜鏡 (Quartz Equilateral Prism, 橫向正三棱柱)
    const prismMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.9, 3), quartzMat);
    prismMesh.position.y = 2.2;
    prismMesh.rotation.x = Math.PI / 2;
    prismMesh.castShadow = true;
    sunPrism.add(prismMesh);

    // 聚光金黃入射光束 (Incoming Solar Ray)
    const incomingRayMat = new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.75 });
    const inRay = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 6), incomingRayMat);
    inRay.position.set(-0.6, 1.85, 0);
    inRay.rotation.z = -Math.PI / 3;
    sunPrism.add(inRay);

    // 3D 扇形立體彩虹折射光譜 (3D Refracted Rainbow Spectrum Fan)
    const spectrumGroup = new THREE.Group();
    spectrumGroup.position.set(0.15, 2.2, 0);

    const rainbowColors = [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x06b6d4, 0x3b82f6, 0x8b5cf6];
    rainbowColors.forEach((col, idx) => {
      const rayAngle = -0.3 + (idx / 6) * 0.6;
      const rayGeo = new THREE.PlaneGeometry(1.6, 0.12);
      const rayMat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const rayMesh = new THREE.Mesh(rayGeo, rayMat);
      rayMesh.position.set(Math.cos(rayAngle) * 0.85, Math.sin(rayAngle) * 0.35, 0);
      rayMesh.rotation.z = rayAngle;
      spectrumGroup.add(rayMesh);
    });

    sunPrism.add(spectrumGroup);

    // 弧形光譜測量刻度屏 (Curved Measurement Scale)
    const scaleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const scaleScreen = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.6, 16, 1, true, 0, Math.PI * 0.4), scaleMat);
    scaleScreen.position.set(0.6, 2.2, 0);
    scaleScreen.rotation.y = -Math.PI * 0.2;
    sunPrism.add(scaleScreen);

    // 核心陽光暖光
    const sunLight = new THREE.PointLight(0xfbbf24, 1.35, 9);
    sunLight.position.y = 2.2;
    sunPrism.add(sunLight);

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.6, 2.8), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'vocab_sun',
      label: '☀️ 調校日冕光學分光鏡 (SUN)',
      onClick: () => {
        this.world.openSpeechCard('SUN', () => {
          this.world.addXP(50);
          this.checkZoneCompletionStatus();
        });
      }
    };
    sunPrism.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      prismMesh.rotation.z = time * 0.5;
      spectrumGroup.rotation.z = Math.sin(time * 1.5) * 0.1;
    });

    group.add(sunPrism);
  }

  // 8. 雲海氣象星盤與風之琴 (CLOUD POI) - 四方風向標、水銀氣壓計與立體風鳴琴
  buildObservatoryCloudAltar(group, x, y, z) {
    const altar = new THREE.Group();
    altar.position.set(x, y, z);

    const marbleMat = new THREE.MeshStandardMaterial({ map: this.tex.celestialMarble, roughness: 0.45 });
    const brassMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeBrass, metalness: 0.88, roughness: 0.25 });
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.95,
      transparent: true,
      opacity: 0.92
    });

    // 雙層圓形大理石氣象祭壇 (Meteorological Dais)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 0.5, 16), marbleMat);
    base.position.y = 0.25;
    base.castShadow = true;
    altar.add(base);

    // 古雅黃銅四方風向標與氣壓座 (Brass Weather Pillar)
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 1.6, 8), brassMat);
    pillar.position.y = 1.25;
    altar.add(pillar);

    // 東西南北方位指示十字標 (Cardinal Cross)
    const crossBarX = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.08), brassMat);
    crossBarX.position.y = 1.95;
    altar.add(crossBarX);

    const crossBarZ = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.4), brassMat);
    crossBarZ.position.y = 1.95;
    altar.add(crossBarZ);

    // 風鳴琴豎立琴弦 (Aeolian Harp Strings)
    const harpStrings = [];
    for (let s = -3; s <= 3; s++) {
      const hStr = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 4), brassMat);
      hStr.position.set(s * 0.12, 1.35, 0);
      altar.add(hStr);
      harpStrings.push(hStr);
    }

    // 祭壇上方懸浮動態多層立體雲朵簇 (Floating Volumetric Cloud Cluster)
    const cloudCluster = new THREE.Group();
    cloudCluster.position.y = 2.3;

    const cloudPuffCoords = [
      [0, 0, 0, 0.58],
      [-0.45, 0.12, 0.2, 0.44],
      [0.45, 0.08, -0.15, 0.46],
      [0.2, -0.1, 0.35, 0.38],
      [-0.32, -0.08, -0.32, 0.38]
    ];
    cloudPuffCoords.forEach(cp => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(cp[3], 12, 12), cloudMat);
      puff.position.set(cp[0], cp[1], cp[2]);
      cloudCluster.add(puff);
    });

    altar.add(cloudCluster);

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.6, 2.8), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'vocab_cloud',
      label: '☁️ 聆聽雲海氣象祭壇之風 (CLOUD)',
      onClick: () => {
        this.world.openSpeechCard('CLOUD', () => {
          this.world.addXP(50);
          this.checkZoneCompletionStatus();
        });
      }
    };
    altar.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      cloudCluster.position.y = 2.3 + Math.sin(time * 2.2) * 0.15;
      cloudCluster.rotation.y = time * 0.35;
      harpStrings.forEach((str, idx) => {
        str.rotation.z = Math.sin(time * 5.0 + idx) * 0.04;
      });
    });

    group.add(altar);
  }

  // 9. 星界凱旋星門 (OPEN POI) - 雙柱古典大理石凱旋門與事件視界漩渦
  buildObservatoryStargatePortal(group, x, y, z, label, word, onOpen) {
    const stargate = new THREE.Group();
    stargate.position.set(x, y, z);

    const brassMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeBrass, metalness: 0.9, roughness: 0.22 });
    const marbleMat = new THREE.MeshStandardMaterial({ map: this.tex.celestialMarble, roughness: 0.4 });
    const runeRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.65,
      side: THREE.DoubleSide
    });

    // 寬闊大理石階台 (Plinth)
    const base = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.45, 2.2), marbleMat);
    base.position.y = 0.22;
    base.receiveShadow = true;
    stargate.add(base);

    // 雙座古典凹槽大理石列柱門柱 (Fluted Portal Columns)
    [-2.2, 2.2].forEach(px => {
      const colBase = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.35, 12), brassMat);
      colBase.position.set(px, 0.58, 0);
      stargate.add(colBase);

      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 4.6, 16), marbleMat);
      col.position.set(px, 3.0, 0);
      col.castShadow = true;
      stargate.add(col);

      const colCap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.42, 0.35, 12), brassMat);
      colCap.position.set(px, 5.45, 0);
      stargate.add(colCap);

      const capSphere = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12), brassMat);
      capSphere.position.set(px, 5.9, 0);
      stargate.add(capSphere);
    });

    // 古典橫樑與三角楣飾 (Architrave & Pediment)
    const beam = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.5, 0.6), marbleMat);
    beam.position.set(0, 5.45, 0);
    stargate.add(beam);

    const pediment = new THREE.Mesh(new THREE.ConeGeometry(2.8, 0.9, 4), brassMat);
    pediment.position.set(0, 6.15, 0);
    pediment.rotation.y = Math.PI / 4;
    stargate.add(pediment);

    // 門心事件視界星雲漩渦 (Event Horizon Cosmic Vortex)
    const vortexGeo = new THREE.RingGeometry(0.6, 2.3, 36);
    const vortexMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide
    });
    const vortex = new THREE.Mesh(vortexGeo, vortexMat);
    vortex.position.set(0, 2.8, 0);
    stargate.add(vortex);

    // 外環發光星象符文環 (Runic Ring)
    const runeRing = new THREE.Mesh(new THREE.RingGeometry(2.35, 2.55, 36), runeRingMat);
    runeRing.position.set(0, 2.8, 0);
    stargate.add(runeRing);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.8, 5.0, 2.2), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.6;
    hitBox.userData = {
      id: 'stargate_open_zone7',
      label,
      onClick: () => {
        if (onOpen) onOpen();
      }
    };
    stargate.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      vortex.rotation.z = -time * 1.5;
      runeRing.rotation.z = time * 0.8;
      vortexMat.opacity = 0.6 + Math.sin(time * 3.0) * 0.18;
    });

    group.add(stargate);
  }

  // 9b. 極光冰橋光柱傳送門 (通往 Zone 8 極光冰雪聖域)
  buildObservatorySanctuaryGate(group, x, y, z, label, onTravel) {
    const gate = new THREE.Group();
    gate.position.set(x, y, z);

    const brassMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeBrass, metalness: 0.88, roughness: 0.22 });
    const iceMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.88 });

    // 極光基座
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.85, 0.38, 16), brassMat);
    base.position.y = 0.19;
    gate.add(base);

    // 極光翡翠藍直衝天際光柱
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.48, side: THREE.DoubleSide });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.25, 16, 16, 1, true), beamMat);
    beam.position.y = 8.0;
    gate.add(beam);

    // 冰晶微粒
    const orbitCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), iceMat);
    orbitCrystal.position.set(1.2, 1.6, 0);
    gate.add(orbitCrystal);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.0, 3.2), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'travel_portal_zone8_from_observatory',
      label,
      onClick: () => {
        if (onTravel) onTravel();
      }
    };
    gate.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      beamMat.opacity = 0.42 + Math.sin(time * 2.5) * 0.15;
      orbitCrystal.rotation.y = time * 2.0;
      orbitCrystal.position.x = Math.cos(time * 1.5) * 1.2;
      orbitCrystal.position.z = Math.sin(time * 1.5) * 1.2;
      orbitCrystal.position.y = 1.6 + Math.sin(time * 3.0) * 0.2;
    });

    group.add(gate);
  }

  // 10. 南側降落星光空橋 (返回 Zone 6 蔚藍秘境海港)
  buildObservatoryHarborSkybridgeGate(group, x, y, z, label, onTravel) {
    const gate = new THREE.Group();
    gate.position.set(x, y, z);

    const brassMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeBrass, metalness: 0.88, roughness: 0.25 });
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.42, side: THREE.DoubleSide });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.85, 0.35, 16), brassMat);
    base.position.y = 0.18;
    gate.add(base);

    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 12, 16, 1, true), beamMat);
    beam.position.y = -4.0;
    gate.add(beam);

    [-1.6, 1.6].forEach(px => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 3.2, 8), brassMat);
      p.position.set(px, 1.6, 0);
      gate.add(p);
    });

    const glowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 3.0),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
    );
    glowPlane.position.set(0, 1.6, 0);
    gate.add(glowPlane);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.0, 2.5), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.8;
    hitBox.userData = {
      id: 'return_portal_zone6_from_observatory',
      label,
      onClick: () => {
        if (onTravel) onTravel();
      }
    };
    gate.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      glowPlane.material.opacity = 0.35 + Math.sin(time * 3.0) * 0.15;
    });

    group.add(gate);
  }

  // 11. 👑 關卡主 NPC：星象總監・艾瑟爾賢者 (Astrologer Aethel)
  buildObservatoryGuardianNPC(group, x, y, z) {
    const npc = new THREE.Group();
    npc.position.set(x, y, z);

    const robeMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.55 });
    const capeMat = new THREE.MeshStandardMaterial({ color: 0x312e81, roughness: 0.65 });
    const goldMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeBrass, metalness: 0.9, roughness: 0.2 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.75 });

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.22, 16), goldMat);
    pedestal.position.y = 0.11;
    pedestal.receiveShadow = true;
    npc.add(pedestal);

    const auraMat = new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const aura = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.55, 24), auraMat);
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.12;
    npc.add(aura);

    // 占星長袍 (Astrologer Robe)
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.55, 1.8, 12), robeMat);
    robe.position.y = 1.05;
    robe.castShadow = true;
    npc.add(robe);

    // 星圖披肩 (Celestial Mantle)
    const cape = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 1.4, 10, 1, true), capeMat);
    cape.position.y = 1.35;
    npc.add(cape);

    // 賢者頭部 (Head & Hair)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), skinMat);
    head.position.y = 2.22;
    head.castShadow = true;
    npc.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), hairMat);
    hair.position.set(0, 2.26, -0.06);
    npc.add(hair);

    // 古雅黃銅單片眼鏡 (Brass Monocle)
    const monocle = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 6, 12), goldMat);
    monocle.position.set(0.12, 2.25, 0.24);
    npc.add(monocle);

    // 星象冠冕 (Diadem)
    const diadem = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 6, 16), goldMat);
    diadem.rotation.x = Math.PI / 2;
    diadem.position.set(0, 2.32, 0);
    npc.add(diadem);

    // 陀螺星盤法杖 (Gyroscopic Starlight Staff)
    const staff = new THREE.Group();
    staff.position.set(0.48, 1.5, 0.2);

    const staffPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), goldMat);
    staff.add(staffPole);

    const staffRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.03, 6, 16), goldMat);
    staffRing1.position.y = 1.1;
    staff.add(staffRing1);

    const staffRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 6, 16), goldMat);
    staffRing2.position.y = 1.1;
    staffRing2.rotation.x = Math.PI / 2;
    staff.add(staffRing2);

    const staffGem = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), crystalMat);
    staffGem.position.y = 1.1;
    staff.add(staffGem);

    npc.add(staff);

    // 關卡主專屬懸浮銘牌
    const billboard = this.createGuardianBillboard('zone7', '艾瑟爾賢者');
    billboard.position.set(0, 3.2, 0);
    npc.add(billboard);

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.6, 2.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.8;
    hitBox.userData = {
      id: 'guardian_zone7',
      label: '💬 [E] 與關卡主・艾瑟爾賢者對話 (Astrologer Aethel)',
      onClick: () => {
        this.handleGuardianInteraction('zone7');
      }
    };
    npc.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      aura.rotation.z = time * 0.5;
      const s = 1.0 + Math.sin(time * 2.5) * 0.08;
      aura.scale.set(s, s, s);
      billboard.position.y = 3.2 + Math.sin(time * 2.0) * 0.06;
      staffRing1.rotation.y = time * 1.5;
      staffRing2.rotation.z = time * 1.2;
    });

    group.add(npc);
  }

  // =========================================================================
  // Zone 8: 極光冰雪聖域 (Aurora Frost Sanctuary)
  // =========================================================================
  buildZone8_GlacialSanctuary(group) {
    this.initTextures();

    // 1. 光照系統 (極光幽藍、微霜冷光、水晶祭壇藍光與暖心魔火營地強暖光)
    this.buildGlacialLighting(group);

    // 2. 翡翠綠與紫羅蘭極光帷幕、雪峰天際線、600極星
    this.buildGlacialAuroraSky(group);

    // 3. 鋸齒萬年冰川浮島、遠古寒霜神廟殘垣、冰川斷崖與垂懸晶簇
    this.buildGlacialFloatingTerrace(group);

    // 4. 全域動態漫天飄雪系統 (Drifting Snowflakes System)
    this.buildDriftingSnowfallSystem(group);

    // 5. 冰雪結晶風向儀祭壇 (SNOW POI, x: 0.0, z: -6.5) - 分形六芒雪晶與旋轉符文環
    this.buildGlacialSnowflakeShrine(group, 0.0, 0, -6.5);

    // 6. 極寒玄冰方尖碑 (COLD POI, x: -6.5, z: -1.0) - 冰裂切面、寒鐵鎖鏈與自轉晶體
    this.buildGlacialColdObelisk(group, -6.5, 0, -1.0);

    // 7. 冬之永凍遠古常青松 (WINTER POI, x: 6.5, z: -1.0) - 蒼勁樹皮、厚雪壓枝、冰錐與鍛鐵風燈
    this.buildGlacialWinterPine(group, 6.5, 0, -1.0);

    // 8. 純白雪境雪精靈守護者 (WHITE POI, x: -5.0, z: 4.0) - 針織圍巾禮帽、胡蘿蔔鼻與陪伴雪兔
    this.buildGlacialSnowman(group, -5.0, 0, 4.0);

    // 9. 極光暖心魔火營地 (WARM POI, x: 5.0, z: 4.0) - 灼熱炭火床、三腳架銅壺、劈砍柴堆與長椅
    this.buildGlacialWarmHearth(group, 5.0, 0, 4.0);

    // 10. 寒霜極光攀登冰階 (CLIMB POI, x: 0.0, z: -12.5) - 符文階梯、冰雕扶手與極光巨石天門
    this.buildGlacialClimbStaircase(group, 0.0, 0, -12.5, '🪜 極光寒霜冰階 (CLIMB)', 'CLIMB', () => {
      this.world.openSpeechCard('CLIMB', () => {
        this.world.addXP(100);
        this.checkZoneCompletionStatus();
      });
    });

    // 11. 南側極光冰橋傳送門 (返回 Zone 7 雲頂星空觀測站, x: 0.0, z: 11.8)
    this.buildGlacialObservatoryReturnGate(group, 0.0, 0, 11.8, '🔭 降落極光冰橋 ➔ 返回【雲頂星空觀測站】', () => {
      this.world.showToast('🔭 沿著極光冰橋平穩降落，返回雲頂星空觀測站！');
      this.switchZone('zone7');
    });

    // 12. 👑 關卡主 NPC：極光冬之賢者・佛洛斯特長老 (Archmage Frost, x: 1.5, z: -3.5)
    this.buildGlacialGuardianNPC(group, 1.5, 0, -3.5);

    // 13. 飄浮鑽石雪晶微粒
    this.addFloatingParticles(group, 0xe0f2fe, 260, 36, 8);
  }

  // 1. 光照系統
  buildGlacialLighting(group) {
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1e3a5f, 1.35);
    group.add(hemiLight);

    const polarStarLight = new THREE.DirectionalLight(0xf0f9ff, 1.4);
    polarStarLight.position.set(16, 32, 10);
    polarStarLight.castShadow = true;
    polarStarLight.shadow.mapSize.width = 1024;
    polarStarLight.shadow.mapSize.height = 1024;
    group.add(polarStarLight);

    // 核心玄冰祭壇幽藍光
    const centerGlow = new THREE.PointLight(0x38bdf8, 1.9, 32);
    centerGlow.position.set(0, 3.5, 0);
    group.add(centerGlow);

    // 營地暖心魔火強金橙光 (點亮周圍雪地與柴堆)
    const hearthGlow = new THREE.PointLight(0xf97316, 2.8, 18);
    hearthGlow.position.set(5.0, 1.8, 4.0);
    group.add(hearthGlow);

    // 冰雪風向儀神聖青藍光
    const shrineGlow = new THREE.PointLight(0x38bdf8, 1.4, 12);
    shrineGlow.position.set(0, 2.5, -6.5);
    group.add(shrineGlow);
  }

  // 2. 翡翠綠與紫羅蘭極光帷幕、雪峰天際線、600星芒
  buildGlacialAuroraSky(group) {
    const skyGroup = new THREE.Group();

    // 翡翠綠極光絲帶 1 (發光疊加模式)
    const auroraMat1 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const ribbonGeo1 = new THREE.PlaneGeometry(90, 20, 28, 4);
    const pos1 = ribbonGeo1.attributes.position;
    for (let i = 0; i < pos1.count; i++) {
      const vx = pos1.getX(i);
      const vz = Math.sin((vx / 90) * Math.PI * 3) * 10;
      pos1.setZ(i, vz);
    }
    ribbonGeo1.computeVertexNormals();
    const ribbon1 = new THREE.Mesh(ribbonGeo1, auroraMat1);
    ribbon1.position.set(0, 28, -32);
    ribbon1.rotation.x = 0.2;
    skyGroup.add(ribbon1);

    // 青翠碧藍極光絲帶 2
    const auroraMat2 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.58,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const ribbonGeo2 = new THREE.PlaneGeometry(80, 18, 24, 4);
    const pos2 = ribbonGeo2.attributes.position;
    for (let i = 0; i < pos2.count; i++) {
      const vx = pos2.getX(i);
      const vz = Math.cos((vx / 80) * Math.PI * 3.5) * 8;
      pos2.setZ(i, vz);
    }
    ribbonGeo2.computeVertexNormals();
    const ribbon2 = new THREE.Mesh(ribbonGeo2, auroraMat2);
    ribbon2.position.set(8, 34, -26);
    ribbon2.rotation.x = 0.15;
    ribbon2.rotation.y = -0.15;
    skyGroup.add(ribbon2);

    // 紫羅蘭極光絲帶 3
    const auroraMat3 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const ribbonGeo3 = new THREE.PlaneGeometry(95, 22, 26, 4);
    const pos3 = ribbonGeo3.attributes.position;
    for (let i = 0; i < pos3.count; i++) {
      const vx = pos3.getX(i);
      const vz = Math.sin((vx / 95) * Math.PI * 2.5 + 1.0) * 12;
      pos3.setZ(i, vz);
    }
    ribbonGeo3.computeVertexNormals();
    const ribbon3 = new THREE.Mesh(ribbonGeo3, auroraMat3);
    ribbon3.position.set(-10, 38, -38);
    ribbon3.rotation.x = 0.22;
    skyGroup.add(ribbon3);

    // 遙遠天際稜角雪山群峰 (Distant Snowy Mountain Peaks)
    const peakMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.1
    });
    const peakSnowMat = new THREE.MeshStandardMaterial({
      map: this.tex.snowFrost,
      roughness: 0.45,
      metalness: 0.1
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dist = 52 + (i % 3) * 6;
      const px = Math.cos(angle) * dist;
      const pz = Math.sin(angle) * dist;
      const h = 20 + (i % 4) * 5;
      const r = 12 + (i % 3) * 3;

      const mountain = new THREE.Mesh(new THREE.ConeGeometry(r, h, 6), peakMat);
      mountain.position.set(px, h / 2 - 6, pz);
      mountain.rotation.y = angle + 0.4;
      skyGroup.add(mountain);

      const snowCap = new THREE.Mesh(new THREE.ConeGeometry(r * 0.42, h * 0.42, 6), peakSnowMat);
      snowCap.position.set(px, h - 6 - (h * 0.42) / 2, pz);
      snowCap.rotation.y = angle + 0.4;
      skyGroup.add(snowCap);
    }

    // 寒霜蒼穹 450 星芒
    const starCount = 450;
    const starGeo = new THREE.BufferGeometry();
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / starCount);
      const theta = Math.sqrt(starCount * Math.PI) * phi;
      const r = 58 + (i % 12);
      starCoords[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      starCoords[i * 3 + 1] = Math.max(8, r * Math.cos(phi));
      starCoords[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.18,
      transparent: true,
      opacity: 0.85
    });
    const starField = new THREE.Points(starGeo, starMat);
    skyGroup.add(starField);

    // 冰晶極地滿月 (Pale Ice Moon)
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(4.5, 16, 16), moonMat);
    moon.position.set(-25, 28, -42);
    skyGroup.add(moon);

    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const halo = new THREE.Mesh(new THREE.RingGeometry(5.0, 9.5, 32), haloMat);
    halo.position.set(-25, 28, -41.5);
    skyGroup.add(halo);

    this.world.animators.push((time) => {
      ribbon1.rotation.z = Math.sin(time * 0.4) * 0.05;
      ribbon1.position.y = 28 + Math.sin(time * 0.6) * 1.5;
      auroraMat1.opacity = 0.58 + Math.sin(time * 0.8) * 0.12;

      ribbon2.rotation.z = Math.cos(time * 0.35) * 0.06;
      ribbon2.position.y = 34 + Math.cos(time * 0.5) * 1.8;
      auroraMat2.opacity = 0.52 + Math.cos(time * 0.7) * 0.14;

      ribbon3.rotation.z = -Math.sin(time * 0.3) * 0.04;
      auroraMat3.opacity = 0.48 + Math.sin(time * 0.55) * 0.10;
    });

    group.add(skyGroup);
  }

  // 3. 鋸齒萬年冰川浮島、遠古寒霜神廟殘垣、冰川斷崖與垂懸晶簇
  buildGlacialFloatingTerrace(group) {
    const terraceGroup = new THREE.Group();

    const iceMat = new THREE.MeshStandardMaterial({
      map: this.tex.glacialIce,
      color: 0x38bdf8,
      roughness: 0.12,
      metalness: 0.35,
      transparent: true,
      opacity: 0.92
    });

    const snowPlateauMat = new THREE.MeshStandardMaterial({
      map: this.tex.snowFrost,
      roughness: 0.6,
      metalness: 0.05
    });

    const frostRuneMat = new THREE.MeshStandardMaterial({
      map: this.tex.frostRune,
      roughness: 0.3,
      metalness: 0.25
    });

    const ruinStoneMat = new THREE.MeshStandardMaterial({
      map: this.tex.stoneWall,
      roughness: 0.85
    });

    // 主浮島上層粉雪地表 (16邊形自然島嶼)
    const islandGeo = new THREE.CylinderGeometry(14.2, 14.8, 1.4, 16);
    const island = new THREE.Mesh(islandGeo, snowPlateauMat);
    island.position.y = -0.65;
    island.receiveShadow = true;
    terraceGroup.add(island);

    // 浮島中央神聖玄冰符文階台 (Raised Frost Rune Dais, 半徑 7.5m, 高 0.32m)
    const daisGeo = new THREE.CylinderGeometry(7.5, 7.8, 0.32, 16);
    const dais = new THREE.Mesh(daisGeo, frostRuneMat);
    dais.position.y = 0.16;
    dais.receiveShadow = true;
    terraceGroup.add(dais);

    // 浮島下層懸垂尖刺冰晶基座 (Tapered Glacial Underbelly)
    const coneGeo = new THREE.ConeGeometry(14.2, 9.8, 16);
    const underbelly = new THREE.Mesh(coneGeo, iceMat);
    underbelly.position.y = -6.2;
    underbelly.rotation.x = Math.PI;
    terraceGroup.add(underbelly);

    // 浮島底部懸垂長尖冰錐晶簇 (Hanging Stalactite Spikes)
    for (let i = 0; i < 10; i++) {
      const cAngle = (i / 10) * Math.PI * 2;
      const cDist = 5.0 + (i % 3) * 2.5;
      const cSpike = new THREE.Mesh(new THREE.ConeGeometry(0.45, 3.2 + (i % 2) * 1.5, 6), iceMat);
      cSpike.position.set(Math.cos(cAngle) * cDist, -6.8 - (i % 3) * 1.0, Math.sin(cAngle) * cDist);
      cSpike.rotation.x = Math.PI;
      terraceGroup.add(cSpike);
    }

    // ==========================================
    // 遠古寒霜神廟殘垣 (Ancient Frost Temple Ruins)
    // 6 根覆雪風化巨石立柱、頂部積雪包與垂懸冰錐，營造蒼涼史詩感！
    // ==========================================
    const pillarCoords = [
      [-11.5, -6.0], [-12.5, 0.0], [-11.0, 6.0],
      [11.5, -6.0], [12.5, 0.0], [11.0, 6.0]
    ];
    pillarCoords.forEach((pc, idx) => {
      const pillarGroup = new THREE.Group();
      pillarGroup.position.set(pc[0], 0, pc[1]);

      const pBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), ruinStoneMat);
      pBase.position.y = 0.25;
      pBase.castShadow = true;
      pillarGroup.add(pBase);

      const pHeight = 3.6 + (idx % 3) * 0.8;
      const pShaft = new THREE.Mesh(new THREE.BoxGeometry(0.8, pHeight, 0.8), ruinStoneMat);
      pShaft.position.y = 0.5 + pHeight / 2;
      pShaft.castShadow = true;
      pillarGroup.add(pShaft);

      // 柱頂厚積雪
      const pSnow = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.35, 0.95), snowPlateauMat);
      pSnow.position.y = 0.5 + pHeight + 0.15;
      pillarGroup.add(pSnow);

      // 柱頂垂掛小冰錐
      for (let ic = 0; ic < 3; ic++) {
        const icicle = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.5, 4), iceMat);
        icicle.position.set((ic - 1) * 0.3, 0.5 + pHeight - 0.2, 0.42);
        icicle.rotation.x = Math.PI;
        pillarGroup.add(icicle);
      }

      terraceGroup.add(pillarGroup);
    });

    // 邊緣簇狀晶瑩冰錐 (Glacial Seracs & Ice Shards)
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const x = Math.cos(angle) * 14.0;
      const z = Math.sin(angle) * 14.0;

      if (Math.abs(x) < 3.0 && Math.abs(z) > 10.0) continue;

      const serac = new THREE.Mesh(new THREE.ConeGeometry(0.48, 2.2 + (i % 3) * 0.5, 6), iceMat);
      serac.position.set(x, 1.1, z);
      serac.rotation.y = angle;
      serac.rotation.z = (i % 2 === 0 ? 0.08 : -0.08);
      serac.castShadow = true;
      terraceGroup.add(serac);

      const subShard = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), iceMat);
      subShard.position.set(x * 0.94, 0.35, z * 0.94);
      terraceGroup.add(subShard);
    }

    group.add(terraceGroup);
  }

  // 4. 全域動態漫天飄雪系統 (Drifting Snowflakes System)
  buildDriftingSnowfallSystem(group) {
    const flakeCount = 280;
    const flakeGeo = new THREE.BufferGeometry();
    const flakePos = new Float32Array(flakeCount * 3);
    const flakeVel = [];

    for (let i = 0; i < flakeCount; i++) {
      flakePos[i * 3] = (Math.random() - 0.5) * 36;
      flakePos[i * 3 + 1] = Math.random() * 22;
      flakePos[i * 3 + 2] = (Math.random() - 0.5) * 36;
      flakeVel.push({
        fallSpeed: 1.8 + Math.random() * 1.6,
        driftSpeed: 0.8 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2
      });
    }

    flakeGeo.setAttribute('position', new THREE.BufferAttribute(flakePos, 3));
    const flakeMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.18,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const snowfall = new THREE.Points(flakeGeo, flakeMat);
    group.add(snowfall);

    this.world.animators.push((time, delta) => {
      const dt = delta || 0.016;
      const positions = flakeGeo.attributes.position.array;
      for (let i = 0; i < flakeCount; i++) {
        const v = flakeVel[i];
        positions[i * 3 + 1] -= v.fallSpeed * dt;
        positions[i * 3] += Math.sin(time * v.driftSpeed + v.offset) * 0.03;

        // 當雪花飄落地表以下時循環重生回天頂
        if (positions[i * 3 + 1] < -0.5) {
          positions[i * 3 + 1] = 20.0 + Math.random() * 2.0;
          positions[i * 3] = (Math.random() - 0.5) * 36;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 36;
        }
      }
      flakeGeo.attributes.position.needsUpdate = true;
    });
  }

  // 5. 冰雪結晶風向儀祭壇 (SNOW POI) - 分形六芒雪晶與旋轉符文環
  buildGlacialSnowflakeShrine(group, x, y, z) {
    const shrine = new THREE.Group();
    shrine.position.set(x, y, z);

    const runeStoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    const iceMat = new THREE.MeshStandardMaterial({
      map: this.tex.glacialIce,
      color: 0x7dd3fc,
      roughness: 0.12,
      metalness: 0.35,
      transparent: true,
      opacity: 0.92
    });
    const runePlateMat = new THREE.MeshStandardMaterial({ map: this.tex.frostRune, roughness: 0.3 });

    // 六角形分層祭壇基座 (Hexagonal Altar Dais)
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.2, 0.45, 6), runeStoneMat);
    base1.position.y = 0.22;
    base1.receiveShadow = true;
    shrine.add(base1);

    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.35, 6), runePlateMat);
    base2.position.y = 0.6;
    base2.receiveShadow = true;
    shrine.add(base2);

    // 懸浮分形立體六芒雪晶總成 (Fractal 3D Snowflake, 高 2.3m)
    const snowflake = new THREE.Group();
    snowflake.position.y = 2.3;

    // 中心 12 面體冰晶核心
    const coreCrystal = new THREE.Mesh(new THREE.DodecahedronGeometry(0.48, 0), iceMat);
    snowflake.add(coreCrystal);

    // 六支主要分形雪晶分枝 (6 Fractal Arms with Secondary/Tertiary Needles)
    for (let i = 0; i < 6; i++) {
      const armAngle = (i / 6) * Math.PI * 2;
      const armGroup = new THREE.Group();
      armGroup.rotation.z = armAngle;

      const armShaft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.12), iceMat);
      armShaft.position.y = 0.9;
      armShaft.castShadow = true;
      armGroup.add(armShaft);

      // 二級倒鉤晶針 (Chevron Shards)
      [-0.24, 0.24].forEach(ox => {
        const shard1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), iceMat);
        shard1.position.set(ox, 1.25, 0);
        shard1.rotation.z = (ox > 0 ? -1 : 1) * 0.65;
        armGroup.add(shard1);

        const shard2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.08), iceMat);
        shard2.position.set(ox * 0.8, 0.75, 0);
        shard2.rotation.z = (ox > 0 ? -1 : 1) * 0.65;
        armGroup.add(shard2);
      });

      // 三級末端鑽石晶尖 (Diamond Finials)
      const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), iceMat);
      finial.position.y = 1.85;
      armGroup.add(finial);

      snowflake.add(armGroup);
    }

    shrine.add(snowflake);

    // 雙重旋轉冰晶符文光環 (Double Counter-Rotating Rings)
    const haloRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.05, 6, 24), iceMat);
    haloRing1.position.y = 2.3;
    shrine.add(haloRing1);

    const haloRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.04, 6, 24), iceMat);
    haloRing2.position.y = 2.3;
    haloRing2.rotation.x = Math.PI / 3;
    shrine.add(haloRing2);

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.2, 3.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.0;
    hitBox.userData = {
      id: 'interact_SNOW',
      label: '❄️ 觸碰冰雪結晶風向儀 (SNOW)',
      onClick: () => {
        this.world.openSpeechCard('SNOW', () => {
          this.world.addXP(50);
          this.checkZoneCompletionStatus();
        });
      }
    };
    shrine.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      snowflake.rotation.z = time * 0.6;
      snowflake.rotation.y = Math.sin(time * 0.8) * 0.2;
      snowflake.position.y = 2.3 + Math.sin(time * 2.0) * 0.12;
      haloRing1.rotation.y = -time * 0.8;
      haloRing2.rotation.z = time * 0.6;
    });

    group.add(shrine);
  }

  // 6. 極寒玄冰方尖碑 (COLD POI) - 冰裂切面、寒鐵鎖鏈與自轉晶體
  buildGlacialColdObelisk(group, x, y, z) {
    const obeliskGroup = new THREE.Group();
    obeliskGroup.position.set(x, y, z);

    const iceMat = new THREE.MeshStandardMaterial({
      map: this.tex.glacialIce,
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.4,
      transparent: true,
      opacity: 0.92
    });
    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.3 });
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });

    // 粗石基座與永凍冰台 (Stone Pedestal)
    const baseStone = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 2.6), stoneMat);
    baseStone.position.y = 0.22;
    baseStone.receiveShadow = true;
    obeliskGroup.add(baseStone);

    const baseIce = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.35, 2.1), iceMat);
    baseIce.position.y = 0.6;
    obeliskGroup.add(baseIce);

    // 寒鐵鎖鏈束縛裝飾 (Frozen Iron Chains)
    for (let c = 0; c < 4; c++) {
      const cAngle = (c / 4) * Math.PI * 2;
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), ironMat);
      chain.position.set(Math.cos(cAngle) * 0.85, 0.85, Math.sin(cAngle) * 0.85);
      chain.rotation.z = 0.3;
      obeliskGroup.add(chain);
    }

    // 尖聳玄冰方尖碑本體 (Chiseled Obelisk Shaft, 高 4.8m)
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.95, 4.8, 4), iceMat);
    shaft.position.y = 3.0;
    shaft.rotation.y = Math.PI / 4;
    shaft.castShadow = true;
    obeliskGroup.add(shaft);

    // 金字塔尖頂 (Pyramidion Capstone)
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.48 * Math.SQRT2, 0.95, 4), iceMat);
    cap.position.y = 5.75;
    cap.rotation.y = Math.PI / 4;
    obeliskGroup.add(cap);

    // 3 顆環繞飛行的玄冰晶體 (Orbiting Shards with Trails)
    const shards = [];
    for (let i = 0; i < 3; i++) {
      const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 0), glowMat);
      obeliskGroup.add(shard);
      shards.push({ mesh: shard, angle: (i / 3) * Math.PI * 2, radius: 1.5 + (i % 2) * 0.3, yOffset: 2.4 + i * 0.9 });
    }

    // 地面冰霧光環
    const mistRing = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.3, 24), glowMat);
    mistRing.rotation.x = -Math.PI / 2;
    mistRing.position.y = 0.08;
    obeliskGroup.add(mistRing);

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.0, 5.5, 3.0), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.7;
    hitBox.userData = {
      id: 'interact_COLD',
      label: '🧊 觸碰極寒玄冰方尖碑 (COLD)',
      onClick: () => {
        this.world.openSpeechCard('COLD', () => {
          this.world.addXP(50);
          this.checkZoneCompletionStatus();
        });
      }
    };
    obeliskGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      shards.forEach((s, idx) => {
        const curAngle = s.angle + time * (1.2 + idx * 0.2);
        s.mesh.position.x = Math.cos(curAngle) * s.radius;
        s.mesh.position.z = Math.sin(curAngle) * s.radius;
        s.mesh.position.y = s.yOffset + Math.sin(time * 2.5 + idx) * 0.25;
        s.mesh.rotation.y = curAngle * 2;
      });
      mistRing.material.opacity = 0.45 + Math.sin(time * 3.0) * 0.2;
    });

    group.add(obeliskGroup);
  }

  // 7. 冬之永凍遠古常青松 (WINTER POI) - 蒼勁樹皮、厚雪壓枝、冰錐與鍛鐵風燈
  buildGlacialWinterPine(group, x, y, z) {
    const pine = new THREE.Group();
    pine.position.set(x, y, z);

    const trunkMat = new THREE.MeshStandardMaterial({ map: this.tex.pineBark, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.8 });
    const snowCapMat = new THREE.MeshStandardMaterial({ map: this.tex.snowFrost, roughness: 0.5, metalness: 0.05 });
    const icicleMat = new THREE.MeshStandardMaterial({
      map: this.tex.glacialIce,
      color: 0xbae6fd,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88
    });
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.25
    });

    // 蒼勁虯曲樹幹與延伸樹根 (Gnarled Trunk & Snow Roots)
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.58, 6.2, 10), trunkMat);
    trunk.position.y = 3.1;
    trunk.castShadow = true;
    pine.add(trunk);

    // 4 根延伸抓地樹根
    for (let r = 0; r < 4; r++) {
      const rAngle = (r / 4) * Math.PI * 2 + 0.3;
      const root = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 1.4, 6), trunkMat);
      root.position.set(Math.cos(rAngle) * 0.6, 0.25, Math.sin(rAngle) * 0.6);
      root.rotation.z = 0.5;
      root.rotation.y = -rAngle;
      pine.add(root);
    }

    // 4 層綠意松枝與厚雪起伏包 (Tiered Boughs with Volumetric Snowdrifts)
    const tiers = [
      { y: 2.3, r: 2.5, h: 2.0 },
      { y: 3.5, r: 2.0, h: 1.8 },
      { y: 4.6, r: 1.5, h: 1.6 },
      { y: 5.6, r: 1.0, h: 1.4 }
    ];

    tiers.forEach((t, idx) => {
      // 綠意松針錐體
      const foliage = new THREE.Mesh(new THREE.ConeGeometry(t.r, t.h, 10), foliageMat);
      foliage.position.y = t.y;
      foliage.castShadow = true;
      pine.add(foliage);

      // 上層厚重白雪覆蓋包
      const snow = new THREE.Mesh(new THREE.ConeGeometry(t.r * 0.94, t.h * 0.68, 10), snowCapMat);
      snow.position.y = t.y + t.h * 0.18;
      pine.add(snow);

      // 垂掛晶瑩冰錐 (Icicles)
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + idx * 0.5;
        const ix = Math.cos(angle) * (t.r * 0.86);
        const iz = Math.sin(angle) * (t.r * 0.86);
        const icicle = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.48, 4), icicleMat);
        icicle.position.set(ix, t.y - t.h * 0.45, iz);
        icicle.rotation.x = Math.PI;
        pine.add(icicle);
      }
    });

    // 枝頭懸掛鍛鐵暖冬提燈 (Hanging Lanterns)
    const lanternAngles = [0.8, 2.8, 4.8];
    const lanterns = [];
    lanternAngles.forEach((ang) => {
      const lx = Math.cos(ang) * 1.55;
      const lz = Math.sin(ang) * 1.55;
      const lanternGroup = new THREE.Group();
      lanternGroup.position.set(lx, 2.7, lz);

      const lamp = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), lanternMat);
      lanternGroup.add(lamp);

      pine.add(lanternGroup);
      lanterns.push(lanternGroup);
    });

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 6.6, 3.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 3.2;
    hitBox.userData = {
      id: 'interact_WINTER',
      label: '🌲 仰望冬之永凍常青松 (WINTER)',
      onClick: () => {
        this.world.openSpeechCard('WINTER', () => {
          this.world.addXP(60);
          this.checkZoneCompletionStatus();
        });
      }
    };
    pine.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      lanterns.forEach((l, idx) => {
        l.rotation.z = Math.sin(time * 2.0 + idx) * 0.15;
      });
    });

    group.add(pine);
  }

  // 8. 純白雪境雪精靈守護者 (WHITE POI) - 針織圍巾禮帽、胡蘿蔔鼻與陪伴雪兔
  buildGlacialSnowman(group, x, y, z) {
    const snowman = new THREE.Group();
    snowman.position.set(x, y, z);

    const snowMat = new THREE.MeshStandardMaterial({ map: this.tex.snowFrost, roughness: 0.55, metalness: 0.05 });
    const scarfMat = new THREE.MeshStandardMaterial({ map: this.tex.knittedWool, roughness: 0.7 });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const goldMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeBrass, metalness: 0.85, roughness: 0.2 });
    const carrotMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
    const coalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const branchMat = new THREE.MeshStandardMaterial({ map: this.tex.pineBark, roughness: 0.9 });

    // 底層大雪球 (Base)
    const baseSnow = new THREE.Mesh(new THREE.SphereGeometry(1.05, 18, 18), snowMat);
    baseSnow.position.y = 0.95;
    baseSnow.castShadow = true;
    snowman.add(baseSnow);

    // 中層身體雪球 (Torso)
    const torsoSnow = new THREE.Mesh(new THREE.SphereGeometry(0.75, 18, 18), snowMat);
    torsoSnow.position.y = 2.15;
    torsoSnow.castShadow = true;
    snowman.add(torsoSnow);

    // 頂層頭部雪球 (Head)
    const headSnow = new THREE.Mesh(new THREE.SphereGeometry(0.54, 18, 18), snowMat);
    headSnow.position.y = 3.08;
    headSnow.castShadow = true;
    snowman.add(headSnow);

    // 藍金雙色針織保暖圍巾 (Knitted Scarf)
    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.14, 8, 20), scarfMat);
    scarf.rotation.x = Math.PI / 2;
    scarf.position.y = 2.7;
    snowman.add(scarf);

    const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.1), scarfMat);
    scarfTail.position.set(0.28, 2.38, 0.52);
    scarfTail.rotation.z = -0.22;
    snowman.add(scarfTail);

    // 英倫毛呢紳士禮帽 (Top Hat)
    const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.08, 16), hatMat);
    hatBrim.position.y = 3.52;
    snowman.add(hatBrim);

    const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.68, 16), hatMat);
    hatCrown.position.y = 3.88;
    snowman.add(hatCrown);

    const hatRibbon = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.12, 16), goldMat);
    hatRibbon.position.y = 3.62;
    snowman.add(hatRibbon);

    // 黑曜石眼睛 (Coal Eyes)
    [-0.16, 0.16].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), coalMat);
      eye.position.set(ex, 3.2, 0.5);
      snowman.add(eye);
    });

    // 胡蘿蔔鼻子 (Carrot Nose)
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.42, 8), carrotMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 3.08, 0.68);
    snowman.add(nose);

    // 笑容煤炭鈕扣 (Smile Dots)
    for (let i = -2; i <= 2; i++) {
      const sx = i * 0.08;
      const sy = 2.94 + Math.abs(i) * 0.03;
      const smileDot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), coalMat);
      smileDot.position.set(sx, sy, 0.51);
      snowman.add(smileDot);
    }

    // 樹枝手臂 (Branch Arms)
    const armLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), branchMat);
    armLeft.position.set(-1.05, 2.25, 0);
    armLeft.rotation.z = 0.8;
    snowman.add(armLeft);

    const armRight = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), branchMat);
    armRight.position.set(1.05, 2.25, 0);
    armRight.rotation.z = -0.8;
    snowman.add(armRight);

    // 伴隨的小雪兔 (Baby Snow Bunny)
    const bunnyGroup = new THREE.Group();
    bunnyGroup.position.set(1.1, 0, 0.8);
    const bunnyBody = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), snowMat);
    bunnyBody.position.y = 0.22;
    bunnyGroup.add(bunnyBody);
    const bunnyHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), snowMat);
    bunnyHead.position.set(0, 0.38, 0.1);
    bunnyGroup.add(bunnyHead);
    [-0.05, 0.05].forEach(bx => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 6), snowMat);
      ear.position.set(bx, 0.52, 0.06);
      bunnyGroup.add(ear);
    });
    snowman.add(bunnyGroup);

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.4, 2.8), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.2;
    hitBox.userData = {
      id: 'interact_WHITE',
      label: '⛄ 拜訪純白雪境雪精靈守護者 (WHITE)',
      onClick: () => {
        this.world.openSpeechCard('WHITE', () => {
          this.world.addXP(50);
          this.checkZoneCompletionStatus();
        });
      }
    };
    snowman.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      const breath = 1.0 + Math.sin(time * 2.2) * 0.025;
      torsoSnow.scale.set(breath, breath, breath);
      headSnow.position.y = 3.08 + Math.sin(time * 2.2) * 0.04;
      hatBrim.position.y = 3.52 + Math.sin(time * 2.2) * 0.04;
      hatCrown.position.y = 3.88 + Math.sin(time * 2.2) * 0.04;
      hatRibbon.position.y = 3.62 + Math.sin(time * 2.2) * 0.04;
      armLeft.rotation.z = 0.8 + Math.sin(time * 1.5) * 0.08;
      armRight.rotation.z = -0.8 - Math.sin(time * 1.5) * 0.08;
      bunnyGroup.position.y = Math.abs(Math.sin(time * 3.0)) * 0.08;
    });

    group.add(snowman);
  }

  // 9. 極光暖心魔火營地 (WARM POI) - 灼熱炭火床、三腳架銅壺、劈砍柴堆與長椅
  buildGlacialWarmHearth(group, x, y, z) {
    const hearth = new THREE.Group();
    hearth.position.set(x, y, z);

    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.8 });
    const birchBarkMat = new THREE.MeshStandardMaterial({ map: this.tex.pineBark, roughness: 0.85 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.3 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const emberMat = new THREE.MeshStandardMaterial({
      map: this.tex.emberBed,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.9,
      roughness: 0.4
    });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.9, side: THREE.DoubleSide });

    // 環形圓石火塘 (Cobblestone Hearth Ring)
    const stoneRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.28, 8, 20), stoneMat);
    stoneRing.rotation.x = Math.PI / 2;
    stoneRing.position.y = 0.28;
    stoneRing.receiveShadow = true;
    hearth.add(stoneRing);

    // 塘底灼熱炭火床 (Glowing Ember Bed)
    const emberBed = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, 0.2, 16), emberMat);
    emberBed.position.y = 0.15;
    hearth.add(emberBed);

    // 圍繞火塘的白樺木柴 (Firewood Logs)
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.2, 6), birchBarkMat);
      log.position.set(Math.cos(ang) * 0.45, 0.35, Math.sin(ang) * 0.45);
      log.rotation.z = 0.4;
      log.rotation.y = ang;
      hearth.add(log);
    }

    // 鑄鐵營火三腳架 (Campfire Tripod)
    for (let t = 0; t < 3; t++) {
      const tAngle = (t / 3) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 2.5, 6), ironMat);
      leg.position.set(Math.cos(tAngle) * 0.95, 1.15, Math.sin(tAngle) * 0.95);
      leg.rotation.z = 0.4;
      leg.rotation.y = -tAngle;
      hearth.add(leg);
    }

    // 懸掛紅銅燒水茶壺 (Hanging Copper Kettle with Steam)
    const kettle = new THREE.Group();
    kettle.position.set(0, 1.35, 0);

    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 4), ironMat);
    chain.position.y = 0.35;
    kettle.add(chain);

    const potBody = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), copperMat);
    kettle.add(potBody);

    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.3, 6), copperMat);
    spout.position.set(0.24, 0.1, 0);
    spout.rotation.z = -0.8;
    kettle.add(spout);

    hearth.add(kettle);

    // 躍動雙層魔火 (Multi-layer Pulsing Flame)
    const flameOuter = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.8, 8), flameMat);
    flameOuter.position.y = 1.05;
    hearth.add(flameOuter);

    const flameInner = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.4, 8), innerFlameMat);
    flameInner.position.y = 0.85;
    hearth.add(flameInner);

    // 旁邊堆疊劈砍整齊的木柴堆與嵌著斧頭的樹樁 (Chopping Stump with Axe)
    const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.55, 8), birchBarkMat);
    stump.position.set(-1.8, 0.28, 0.5);
    stump.castShadow = true;
    hearth.add(stump);

    const axeHead = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.28), ironMat);
    axeHead.position.set(-1.8, 0.65, 0.5);
    hearth.add(axeHead);

    const axeHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 0.05), woodMat);
    axeHandle.position.set(-1.8, 0.85, 0.4);
    axeHandle.rotation.x = -0.3;
    hearth.add(axeHandle);

    // 休憩防寒原木長椅 (Rustic Wood Bench)
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.14, 0.6), woodMat);
    bench.position.set(0, 0.45, 1.8);
    bench.castShadow = true;
    hearth.add(bench);
    [-0.85, 0.85].forEach(bx => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.45, 6), woodMat);
      leg.position.set(bx, 0.22, 1.8);
      hearth.add(leg);
    });

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.6, 3.4), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.6;
    hitBox.userData = {
      id: 'interact_WARM',
      label: '🔥 伸手靠近極光暖心魔爐 (WARM)',
      onClick: () => {
        this.world.openSpeechCard('WARM', () => {
          this.world.addXP(60);
          this.checkZoneCompletionStatus();
        });
      }
    };
    hearth.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      const s = 1.0 + Math.sin(time * 8.0) * 0.12;
      const s2 = 1.0 + Math.cos(time * 10.0) * 0.15;
      flameOuter.scale.set(s, s2, s);
      flameOuter.rotation.y = time * 2.0;
      flameInner.scale.set(s2, s, s2);
      flameInner.rotation.y = -time * 2.5;
      kettle.rotation.z = Math.sin(time * 3.0) * 0.04;
    });

    group.add(hearth);
  }

  // 10. 寒霜極光攀登冰階 (CLIMB POI) - 符文階梯、冰雕扶手與極光巨石天門
  buildGlacialClimbStaircase(group, x, y, z, label, word, onOpen) {
    const stairGroup = new THREE.Group();
    stairGroup.position.set(x, y, z);

    const iceMat = new THREE.MeshStandardMaterial({
      map: this.tex.glacialIce,
      color: 0x38bdf8,
      roughness: 0.12,
      metalness: 0.4,
      transparent: true,
      opacity: 0.92
    });
    const runePlateMat = new THREE.MeshStandardMaterial({ map: this.tex.frostRune, roughness: 0.3 });
    const portalGlowMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });

    // 兩側寒霜凱旋巨石柱 (Twin Glacial Megaliths)
    [-2.2, 2.2].forEach(px => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.75, 4.8, 0.75), iceMat);
      col.position.set(px, 2.4, 0);
      col.castShadow = true;
      stairGroup.add(col);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.55 * Math.SQRT2, 0.8, 4), iceMat);
      cap.position.set(px, 5.2, 0);
      cap.rotation.y = Math.PI / 4;
      stairGroup.add(cap);
    });

    // 連接頂部晶瑩冰樑
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.45, 0.6), iceMat);
    topBeam.position.set(0, 4.8, 0);
    stairGroup.add(topBeam);

    // 8 階微光旋轉上升寒冰天梯 (Ascension Ice Stairs)
    for (let s = 0; s < 8; s++) {
      const stepMat = (s % 2 === 0) ? runePlateMat : iceMat;
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.4 - s * 0.1, 0.28, 0.55), stepMat);
      step.position.set(0, 0.14 + s * 0.32, -s * 0.45);
      step.castShadow = true;
      stairGroup.add(step);
    }

    // 傳送門極光漩渦 (Ascension Aurora Vortex)
    const portalGeo = new THREE.RingGeometry(0.5, 2.2, 32);
    const portal = new THREE.Mesh(portalGeo, portalGlowMat);
    portal.position.set(0, 2.8, -1.2);
    stairGroup.add(portal);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 5.0, 3.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 2.4;
    hitBox.userData = {
      id: 'glacial_stairs_climb',
      label,
      onClick: () => {
        if (onOpen) onOpen();
      }
    };
    stairGroup.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      portal.rotation.z = -time * 1.8;
      portalGlowMat.opacity = 0.55 + Math.sin(time * 3.5) * 0.2;
    });

    group.add(stairGroup);
  }

  // 11. 南側降落極光冰橋門戶 (返回 Zone 7 雲頂星空觀測站)
  buildGlacialObservatoryReturnGate(group, x, y, z, label, onTravel) {
    const gate = new THREE.Group();
    gate.position.set(x, y, z);

    const iceMat = new THREE.MeshStandardMaterial({
      map: this.tex.glacialIce,
      color: 0x38bdf8,
      roughness: 0.12,
      transparent: true,
      opacity: 0.9
    });
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, side: THREE.DoubleSide });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.85, 0.38, 16), iceMat);
    base.position.y = 0.19;
    gate.add(base);

    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 12, 16, 1, true), beamMat);
    beam.position.y = -4.0;
    gate.add(beam);

    [-1.6, 1.6].forEach(px => {
      const p = new THREE.Mesh(new THREE.ConeGeometry(0.2, 3.2, 6), iceMat);
      p.position.set(px, 1.6, 0);
      gate.add(p);
    });

    const glowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 3.0),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.42, side: THREE.DoubleSide })
    );
    glowPlane.position.set(0, 1.6, 0);
    gate.add(glowPlane);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.0, 2.5), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.8;
    hitBox.userData = {
      id: 'return_portal_zone7_from_sanctuary',
      label,
      onClick: () => {
        if (onTravel) onTravel();
      }
    };
    gate.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      glowPlane.material.opacity = 0.35 + Math.sin(time * 3.0) * 0.15;
    });

    group.add(gate);
  }

  // 12. 👑 關卡主 NPC：極光冬之賢者・佛洛斯特長老 (Archmage Frost)
  buildGlacialGuardianNPC(group, x, y, z) {
    const npc = new THREE.Group();
    npc.position.set(x, y, z);

    const robeMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.55 });
    const furMat = new THREE.MeshStandardMaterial({ map: this.tex.snowFrost, roughness: 0.8 });
    const goldMat = new THREE.MeshStandardMaterial({ map: this.tex.astrolabeBrass, metalness: 0.88, roughness: 0.22 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.8 });
    const beardMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.55 });
    const iceCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.3
    });

    // 雕花玄冰祭台 (Dais)
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.35, 0.22, 16), goldMat);
    pedestal.position.y = 0.11;
    pedestal.receiveShadow = true;
    npc.add(pedestal);

    // 腳下極光微光魔法陣
    const auraMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const aura = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.55, 24), auraMat);
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.12;
    npc.add(aura);

    // 大魔導士長袍 (Archmage Robe)
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.58, 1.8, 12), robeMat);
    robe.position.y = 1.05;
    robe.castShadow = true;
    npc.add(robe);

    // 白雪毛皮鑲邊披肩 (Fur-trimmed Mantle)
    const mantle = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.52, 0.6, 12), furMat);
    mantle.position.y = 1.8;
    npc.add(mantle);

    // 頭部與雪白飄逸鬍鬚 (Head & Long Beard)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), skinMat);
    head.position.y = 2.22;
    head.castShadow = true;
    npc.add(head);

    const beard = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.85, 8), beardMat);
    beard.position.set(0, 1.75, 0.18);
    beard.rotation.x = -0.2;
    npc.add(beard);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), beardMat);
    hair.position.set(0, 2.26, -0.06);
    npc.add(hair);

    // 寒霜冰冠 (Frost Crown)
    const diadem = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 6, 16), goldMat);
    diadem.rotation.x = Math.PI / 2;
    diadem.position.set(0, 2.32, 0);
    npc.add(diadem);

    const diademShard = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.28, 4), iceCrystalMat);
    diademShard.position.set(0, 2.48, 0.26);
    npc.add(diademShard);

    // 冰霜魔導法杖 (Frost Archmage Staff)
    const staff = new THREE.Group();
    staff.position.set(0.48, 1.5, 0.2);

    const staffPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), goldMat);
    staff.add(staffPole);

    const staffRing = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.03, 6, 16), goldMat);
    staffRing.position.y = 1.1;
    staff.add(staffRing);

    // 法杖頂端懸浮六芒冰晶星 (Spinning Frost Crystal)
    const staffStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), iceCrystalMat);
    staffStar.position.y = 1.1;
    staff.add(staffStar);

    npc.add(staff);

    // 關卡主專屬懸浮銘牌
    const billboard = this.createGuardianBillboard('zone8', '佛洛斯特長老');
    billboard.position.set(0, 3.2, 0);
    npc.add(billboard);

    // 互動點擊判定盒
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.6, 2.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 1.8;
    hitBox.userData = {
      id: 'guardian_zone8',
      label: '💬 [E] 與關卡主・佛洛斯特長老對話 (Archmage Frost)',
      onClick: () => {
        this.handleGuardianInteraction('zone8');
      }
    };
    npc.add(hitBox);
    this.world.interactables.push(hitBox);

    this.world.animators.push((time) => {
      aura.rotation.z = time * 0.5;
      const s = 1.0 + Math.sin(time * 2.5) * 0.08;
      aura.scale.set(s, s, s);
      billboard.position.y = 3.2 + Math.sin(time * 2.0) * 0.06;
      staffStar.rotation.y = time * 2.0;
      staffStar.rotation.z = time * 1.5;
      staffRing.rotation.y = time * 1.0;
    });

    group.add(npc);
  }
}

// 建立全域空間實例
window.SpatialZoneManager = SpatialZoneManager;


