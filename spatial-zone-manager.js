// 空間情境管理器 (SpatialZoneManager)
// 支援五大多元生活與奇幻空間動態切換：書齋、市集、花園、操場、車站
// 突破死板四方邊框！打造開闊全景地平線、自然有機邊界與情境化邊緣傳送大門

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
        desc: '歐陸童話城鎮廣場，四周環繞磚木老街屋，在蔬果攤位與天平秤間探索學習！',
        words: ['APPLE', 'BANANA', 'BREAD', 'MILK', 'SWEET', 'OPEN'],
        spawnPos: [0, 1.6, 4.0],
        spawnYaw: 0
      },
      'zone3': {
        id: 'zone3',
        name: '守護獸之森花園',
        englishName: 'Beast Sanctuary Garden',
        icon: '🐰',
        topic: 'Animals, Nature & Actions',
        reqLevel: 3,
        desc: '背倚遠古群山晴空的開闊森林秘境，巨木奇石環抱，與小白兔與青鳥快樂對話！',
        words: ['RABBIT', 'BIRD', 'TREE', 'WATER', 'OPEN'],
        spawnPos: [0, 1.6, 4.0],
        spawnYaw: 0
      },
      'zone4': {
        id: 'zone4',
        name: '活力冒險操場',
        englishName: 'Athletic Sports Field',
        icon: '⚽',
        topic: 'Sports, Actions & Body',
        reqLevel: 4,
        desc: '開闊的校園標準運動場，西側看台彩旗飄揚，沿環形跑道奔向終點勝利拱門！',
        words: ['SOCCER', 'BALL', 'RUN', 'JUMP', 'OPEN'],
        spawnPos: [0, 1.6, 4.0],
        spawnYaw: 0
      },
      'zone5': {
        id: 'zone5',
        name: '星光鐘樓車站',
        englishName: 'Clocktower Train Station',
        icon: '🚂',
        topic: 'Time, Places & Transport',
        reqLevel: 5,
        desc: '暮色下巨型鐵道穹頂月台，雙軌鋼軌延伸至星空群山，蒸汽特快車正蓄勢待發！',
        words: ['TIME', 'CLOCK', 'TRAIN', 'MORNING', 'OPEN'],
        spawnPos: [-1.0, 1.6, 4.0],
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
      townFacade: loader.load('assets/textures/tex-town-facade.jpg'),
      gardenGrass: loader.load('assets/textures/tex-garden-grass.jpg'),
      marbleFountain: loader.load('assets/textures/tex-marble-fountain.jpg'),
      forestVista: loader.load('assets/textures/tex-forest-vista.jpg'),
      runningTrack: loader.load('assets/textures/tex-running-track.jpg'),
      stationBrick: loader.load('assets/textures/tex-station-brick.jpg'),
      clockFace: loader.load('assets/textures/tex-clocktower-face.jpg'),
      locomotive: loader.load('assets/textures/tex-locomotive-train.jpg'),
      stoneWall: loader.load('assets/textures/tex-stone-wall.jpg'),
      woodDesk: loader.load('assets/textures/tex-wood-desk.jpg'),
      woodFloor: loader.load('assets/textures/tex-wood-floor.jpg'),
      alchemySlate: loader.load('assets/textures/tex-alchemy-slate.jpg')
    };

    // 配置紋理重複平鋪
    this.tex.marketCobble.wrapS = THREE.RepeatWrapping;
    this.tex.marketCobble.wrapT = THREE.RepeatWrapping;
    this.tex.marketCobble.repeat.set(10, 10);

    this.tex.marketAwning.wrapS = THREE.RepeatWrapping;
    this.tex.marketAwning.wrapT = THREE.RepeatWrapping;
    this.tex.marketAwning.repeat.set(2, 1);

    this.tex.townFacade.wrapS = THREE.RepeatWrapping;
    this.tex.townFacade.wrapT = THREE.RepeatWrapping;
    this.tex.townFacade.repeat.set(1, 1);

    this.tex.gardenGrass.wrapS = THREE.RepeatWrapping;
    this.tex.gardenGrass.wrapT = THREE.RepeatWrapping;
    this.tex.gardenGrass.repeat.set(12, 12);

    this.tex.marbleFountain.wrapS = THREE.RepeatWrapping;
    this.tex.marbleFountain.wrapT = THREE.RepeatWrapping;
    this.tex.marbleFountain.repeat.set(2, 2);

    this.tex.runningTrack.wrapS = THREE.RepeatWrapping;
    this.tex.runningTrack.wrapT = THREE.RepeatWrapping;
    this.tex.runningTrack.repeat.set(8, 8);

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
  // 概念：歐陸中世紀城鎮廣場，三面圍繞老街屋街景，東側城門通往城外
  // ==========================================
  buildZone2_Market(group) {
    this.initTextures();

    // 1. 光照：溫暖地中海午後斜陽
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(16, 22, 14);
    sunLight.castShadow = true;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xffedd5, 0x9a3412, 0.7);
    group.add(hemiLight);

    // 2. 地面：開闊無盡的歐陸古鎮鵝卵石街區 (60m x 60m 廣闊無死板方框)
    const groundGeo = new THREE.PlaneGeometry(64, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      map: this.tex.marketCobble,
      roughness: 0.85,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    group.add(ground);

    // 3. 城鎮真實街屋立面建築群 (Townhouse Blocks) - 形成天然開闊市集背景
    this.buildTownStreetBlocks(group);

    // 4. 自然有機分布的市集攤位 (Asymmetrical Organic Layout)
    // 蘋果攤位 (左前方，稍微斜向中央)
    this.buildDetailedMarketStall(group, -4.6, 0, -0.8, 'apple', '🍎 甜美紅蘋果攤 (APPLE)', 'stall_apple', () => {
      this.world.openSpeechCard('APPLE', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_APPLE', '🍎 甜脆紅蘋果', '#ef4444');
      });
    }, 0.25);

    // 香蕉天平攤位 (右側前方，斜向廣場)
    this.buildDetailedMarketStall(group, 4.5, 0, 1.2, 'banana', '🍌 活力金香蕉 (BANANA)', 'stall_banana', () => {
      this.world.openSpeechCard('BANANA', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_BANANA', '🍌 香甜金香蕉', '#eab308');
      });
    }, -0.35);

    // 烘焙手推車 (左後方街角屋簷下)
    this.buildDetailedCart(group, -3.2, 0, -5.2, 'bread', '🥖 剛出爐的烤麵包 (BREAD)', 'cart_bread', () => {
      this.world.openSpeechCard('BREAD', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_BREAD', '🥖 麥香長法棍', '#b45309');
      });
    }, 0.2);

    // 牧場鮮奶與蜂蜜台 (右後方街角)
    this.buildDetailedCart(group, 3.6, 0, -3.5, 'milk', '🥛 香濃鮮牛奶 (MILK)', 'cart_milk', () => {
      this.world.openSpeechCard('MILK', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_MILK', '🥛 牧場鮮牛奶', '#60a5fa');
      });
    }, -0.15);

    // 5. 街屋與攤位間交錯懸掛的節慶三角彩旗
    this.buildBuntingFlags(group, [-4.6, 3.2, -0.8], [4.5, 3.2, 1.2]);
    this.buildBuntingFlags(group, [-7.0, 4.5, -4.0], [-3.2, 2.6, -5.2]);

    // 6. 城鎮石造防禦城門吊橋 (移至東北角邊緣，融入城鎮城牆！)
    this.buildDrawbridgePortal(group, 6.8, 0, -8.0, '🏰 前往精靈花園的城門吊橋 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 恭喜！市集衛兵降下城門吊橋，解鎖前往精靈花園！');
      this.switchZone('zone3');
    }, -0.35);

    // 市集陽光浮塵粒子
    this.addFloatingParticles(group, 0xffedd5, 140, 36, 6);
  }

  // [市集] 建造周圍圍繞的歐風中世紀街屋與巷道 (打破方框)
  buildTownStreetBlocks(group) {
    const facadeMat = new THREE.MeshStandardMaterial({
      map: this.tex.townFacade,
      roughness: 0.8
    });
    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });

    // 北面連排街屋 (留出東北向城門開口)
    const northBuilding = new THREE.Group();
    northBuilding.position.set(-4.0, 0, -10.5);

    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(16, 7.5, 3.5), facadeMat);
    mainBody.position.y = 3.75;
    mainBody.castShadow = true;
    northBuilding.add(mainBody);

    // 歐風斜屋頂 (Sloping Roof with Slate)
    const roof = new THREE.Mesh(new THREE.ConeGeometry(11.5, 3.0, 4), stoneMat);
    roof.position.y = 8.5;
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.1, 1.0, 0.45);
    northBuilding.add(roof);

    // 煙囪 (Chimneys)
    [-4.0, 2.5].forEach(cx => {
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.2, 0.7), stoneMat);
      chimney.position.set(cx, 9.5, 0);
      northBuilding.add(chimney);
    });
    group.add(northBuilding);

    // 西面街屋街區 (沿西側延伸)
    const westBuilding = new THREE.Group();
    westBuilding.position.set(-11.5, 0, 0);
    westBuilding.rotation.y = Math.PI / 2;

    const westBody = new THREE.Mesh(new THREE.BoxGeometry(18, 7.2, 3.5), facadeMat);
    westBody.position.y = 3.6;
    westBuilding.add(westBody);

    const westRoof = new THREE.Mesh(new THREE.ConeGeometry(12.8, 2.8, 4), stoneMat);
    westRoof.position.y = 8.2;
    westRoof.rotation.y = Math.PI / 4;
    westRoof.scale.set(1.1, 1.0, 0.45);
    westBuilding.add(westRoof);
    group.add(westBuilding);

    // 南側入口街景 (身後是有深度的小巷街角)
    const southBlock = new THREE.Group();
    southBlock.position.set(-3.0, 0, 11.5);

    const southBody = new THREE.Mesh(new THREE.BoxGeometry(14, 6.8, 3.0), facadeMat);
    southBody.position.y = 3.4;
    southBlock.add(southBody);
    group.add(southBlock);

    // 街道散落的木桶、木箱、路燈 (增加生動真實感)
    const barrelCoords = [[-6.8, -3.0], [-7.2, 1.0], [5.5, 4.5], [2.2, -7.5]];
    barrelCoords.forEach(([bx, bz]) => {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.9, 10), woodMat);
      barrel.position.set(bx, 0.45, bz);
      group.add(barrel);
    });

    // 廣場典雅黑鐵路燈
    const lampCoords = [[-3.5, 2.5], [3.2, 3.5], [-2.0, -7.2], [5.8, -4.5]];
    lampCoords.forEach(([lx, lz]) => {
      const lampPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.2, 8), woodMat);
      lampPost.position.set(lx, 1.6, lz);
      group.add(lampPost);

      const lampHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.14, 0.45, 6),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.7 })
      );
      lampHead.position.set(lx, 3.3, lz);
      group.add(lampHead);

      const lampLight = new THREE.PointLight(0xfde68a, 1.1, 8);
      lampLight.position.set(lx, 3.3, lz);
      group.add(lampLight);
    });
  }

  // ==========================================
  // Zone 3: 守護獸之森花園 (Beast Sanctuary Garden)
  // 概念：廣袤自然精靈林間空地，背倚無垠蒼翠群山全景，巨木怪石自然環抱
  // ==========================================
  buildZone3_Garden(group) {
    this.initTextures();

    // 1. 光照：晨曦透過林間灑落的柔和金色光斑
    const sunLight = new THREE.DirectionalLight(0xfef9c3, 1.3);
    sunLight.position.set(12, 20, 8);
    sunLight.castShadow = true;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xdcfce7, 0x14532d, 0.8);
    group.add(hemiLight);

    // 2. 地面：開闊無界限的童話綠茵野花草坪 (70m x 70m)
    const grassGeo = new THREE.PlaneGeometry(72, 72);
    const grassMat = new THREE.MeshStandardMaterial({
      map: this.tex.gardenGrass,
      roughness: 0.9,
      metalness: 0.02
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    group.add(grass);

    // 3. 北面遠景群山與陽光全景立體天幕 (Panoramic Mountain Vista)
    this.buildPanoramicHorizon(group);

    // 4. 自然林線與巨石群 (徹底取代死板圍欄，呈現自然森林邊緣)
    this.buildOrganicForestPerimeter(group);

    // 5. 蜿蜒自然的碎石石板步道
    this.buildWindingStonePath(group);

    // 6. 散落各處的 3D 盛開野花叢
    this.buildScatteredFlowers(group);

    // 7. 奇幻自然景觀與互動對象 (非對稱自然分布)
    // 中央微偏左：雙層雕花大理石噴泉 (WATER)
    this.buildMarbleFountain(group, -0.5, 0, -1.2, '⛲ 清涼純淨的活泉水 (WATER)', 'poi_water', () => {
      this.world.openSpeechCard('WATER', () => {
        this.world.addXP(60);
      });
    });

    // 右前方野花丘陵：守護白兔抱胡蘿蔔 (RABBIT)
    this.buildSculptedRabbit(group, 3.8, 0, 0.6, '🐰 正在草地上蹦跳的兔子 (RABBIT)', 'RABBIT', () => {
      this.world.openSpeechCard('RABBIT', () => {
        this.world.addXP(70);
      });
    });

    // 左側青草地：常春藤羅馬石柱與青鳥 (BIRD)
    this.buildBirdOnPedestal(group, -4.5, 0, 1.5, '🐦 枝頭歌唱的青鳥 (BIRD)', 'BIRD', () => {
      this.world.openSpeechCard('BIRD', () => {
        this.world.addXP(70);
      });
    });

    // 右後方：千年精靈古樹 (TREE) - 高聳入雲，樹枝掛提燈
    this.buildAncientWorldTree(group, 4.8, 0, -4.5, '🌳 茂密的精靈古樹 (TREE)', 'TREE', () => {
      this.world.openSpeechCard('TREE', () => {
        this.world.addXP(60);
      });
    });

    // 8. 自然林間穿梭拱門 (西北側幽徑出口，隱現於古木與玫瑰藤蔓間！)
    this.buildRoseArchPortal(group, -6.5, 0, -8.0, '🌸 通往冒險操場的精靈古徑 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 森林古樹撥開枝枒，微風輕拂，解鎖前往活力操場！');
      this.switchZone('zone4');
    }, 0.35);

    // 飄浮發光精靈孢子微粒
    this.addFloatingParticles(group, 0x86efac, 160, 36, 5.5);
  }

  // [花園] 建造遠方綿延群山與晨光天幕 (Panoramic Horizon Backdrop)
  buildPanoramicHorizon(group) {
    const vistaGeo = new THREE.PlaneGeometry(68, 26);
    const vistaMat = new THREE.MeshBasicMaterial({
      map: this.tex.forestVista,
      transparent: true,
      opacity: 0.95
    });
    const vistaMesh = new THREE.Mesh(vistaGeo, vistaMat);
    vistaMesh.position.set(0, 12, -26);
    group.add(vistaMesh);
  }

  // [花園] 自然有機林線與苔石環抱 (取代四方圍欄)
  buildOrganicForestPerimeter(group) {
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.85 });
    const pineLeafMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 });
    const oakLeafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 });
    const rockMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.9 });

    // 沿著周圍不規則環狀排列 24+ 棵松樹與闊葉巨木
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const radius = 13.5 + Math.sin(i * 1.8) * 2.5; // 自然波浪狀起伏半徑
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius;

      // 避開西北方出口通道
      if (tx < -4 && tz < -6) continue;

      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, 0, tz);

      const height = 5.5 + Math.random() * 3.5;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, height * 0.4, 8), woodMat);
      trunk.position.y = height * 0.2;
      treeGroup.add(trunk);

      if (i % 2 === 0) {
        // 松樹造型 (多層圓錐)
        for (let t = 0; t < 3; t++) {
          const cone = new THREE.Mesh(
            new THREE.ConeGeometry(2.0 - t * 0.4, 2.2, 8),
            pineLeafMat
          );
          cone.position.y = height * 0.35 + t * 1.4;
          treeGroup.add(cone);
        }
      } else {
        // 闊葉古木造型 (多面體葉叢)
        const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2), oakLeafMat);
        bush.position.y = height * 0.55;
        treeGroup.add(bush);
      }
      group.add(treeGroup);
    }

    // 周圍錯落安放苔蘚巨石 (Mossy Boulders)
    const boulderCoords = [
      [-9.0, -3.5], [-8.5, 4.0], [-2.0, 11.5], [8.5, 6.0],
      [9.5, -2.5], [7.0, -9.0], [-3.5, -11.0]
    ];
    boulderCoords.forEach(([rx, rz]) => {
      const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4), rockMat);
      boulder.position.set(rx, 0.7, rz);
      boulder.rotation.set(Math.random(), Math.random(), Math.random());
      group.add(boulder);
    });
  }

  // [花園] 蜿蜒自然的石板步道
  buildWindingStonePath(group) {
    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    // 從玩家起點 (0, 0, 4) 蜿蜒穿行至噴泉與林間
    for (let t = 0; t < 16; t++) {
      const z = 4.0 - t * 0.75;
      const x = Math.sin(t * 0.45) * 1.8;
      const step = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.05, 8), stoneMat);
      step.position.set(x, 0.03, z);
      step.receiveShadow = true;
      group.add(step);
    }
  }

  // ==========================================
  // Zone 4: 活力冒險操場 (Athletic Sports Field)
  // 概念：開闊的校園體育場，西側看台、北側記分板，跑道終點金色拱門
  // ==========================================
  buildZone4_Athletic(group) {
    this.initTextures();

    // 1. 光照：晴朗運動場清晨烈日
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.45);
    sunLight.position.set(14, 25, 12);
    sunLight.castShadow = true;
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x15803d, 0.75);
    group.add(hemiLight);

    // 2. 地面：開闊校園草坪 (70m x 70m)
    const outerGrass = new THREE.Mesh(
      new THREE.PlaneGeometry(72, 72),
      new THREE.MeshStandardMaterial({ map: this.tex.gardenGrass, roughness: 0.88 })
    );
    outerGrass.rotation.x = -Math.PI / 2;
    outerGrass.receiveShadow = true;
    group.add(outerGrass);

    // 3. 橢圓形標準紅色 PU 跑道 (AI 寫實跑道皮膚)
    const trackGeo = new THREE.RingGeometry(8.5, 14.5, 32);
    const trackMat = new THREE.MeshStandardMaterial({
      map: this.tex.runningTrack,
      roughness: 0.82
    });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.rotation.x = -Math.PI / 2;
    track.position.y = 0.02;
    track.receiveShadow = true;
    group.add(track);

    // 4. 中央足球綠茵草坪
    const innerTurf = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 })
    );
    innerTurf.rotation.x = -Math.PI / 2;
    innerTurf.position.y = 0.03;
    innerTurf.receiveShadow = true;
    group.add(innerTurf);

    this.buildSoccerFieldLines(group);

    // 5. 體育場設施（西側階梯看台、高聳投光燈架、記分牌）
    this.buildStadiumSurroundings(group);

    // 6. 運動器材與球門 (合理自然分布)
    // 球門與足球 (位於內場偏北方)
    this.buildSoccerGoalAndBall(group, -1.2, 0, -4.0, '⚽ 草地上的足球 (SOCCER / BALL)', 'BALL', () => {
      this.world.openSpeechCard('BALL', () => {
        this.world.addXP(60);
      });
    });

    // 跑道直道上的起跑助跑線 (左側直道跑道)
    this.buildStartingBlocks(group, -5.2, 0, 1.2, '🏃 起跑線加速奔跑 (RUN)', 'RUN', () => {
      this.world.openSpeechCard('RUN', () => {
        this.world.addXP(60);
      });
    });

    // 田徑跳躍場 (右側草坪區)
    this.buildJumpEquipment(group, 3.8, 0, 1.2, '🦘 體育跳箱與跳躍 (JUMP)', 'JUMP', () => {
      this.world.openSpeechCard('JUMP', () => {
        this.world.addXP(60);
      });
    });

    // 7. 出口通道：田徑跑道衝刺終點「冠軍金色拱門」(移至東北側彎道終點線！)
    this.buildTrophyArchPortal(group, 7.2, 0, -6.5, '🏆 終點衝線冠軍金色拱門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 裁判長鳴哨！以驚人速度衝過終點線，前往星光車站！');
      this.switchZone('zone5');
    }, -0.4);
  }

  // [操場] 西側觀眾階梯看台與高聳照明燈塔
  buildStadiumSurroundings(group) {
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

    // 西側大看台 (Bleachers Grandstand) - 階梯式座位
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

    // 北面巨型電子記分牌 (Electronic Scoreboard)
    const scoreboard = new THREE.Group();
    scoreboard.position.set(0, 0, -14.0);

    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 6.0, 8), steelMat);
    p1.position.set(-3.0, 3.0, 0);
    scoreboard.add(p1);

    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 6.0, 8), steelMat);
    p2.position.set(3.0, 3.0, 0);
    scoreboard.add(p2);

    const board = new THREE.Mesh(new THREE.BoxGeometry(7.2, 3.2, 0.4), boardMat);
    board.position.set(0, 5.0, 0);
    scoreboard.add(board);

    // 記分牌頂部彩旗
    this.buildBuntingFlags(scoreboard, [-3.5, 6.8, 0], [3.5, 6.8, 0]);
    group.add(scoreboard);

    // 四座高聳金屬格構投光燈柱
    const lightTowers = [[-12.0, -11.0], [12.0, -11.0], [-12.0, 11.0], [12.0, 11.0]];
    lightTowers.forEach(([lx, lz]) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 9.0, 8), steelMat);
      p.position.set(lx, 4.5, lz);
      group.add(p);

      const head = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 0.6), steelMat);
      head.position.set(lx, 9.0, lz);
      head.lookAt(0, 0, 0);
      group.add(head);

      const bulb = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      bulb.position.set(lx, 9.0, lz);
      bulb.lookAt(0, 0, 0);
      group.add(bulb);
    });
  }

  // ==========================================
  // Zone 5: 星光鐘樓車站 (Clocktower Train Station)
  // 概念：開闊的星空鐵道樞紐，大鐘樓聳立北端，蒸汽列車停靠右側，登車門即終點
  // ==========================================
  buildZone5_Station(group) {
    this.initTextures();

    // 1. 光照：深邃午夜星光與月台煤氣燈暖光
    const moonLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
    moonLight.position.set(12, 22, -10);
    group.add(moonLight);

    const hemiLight = new THREE.HemisphereLight(0x312e81, 0x1e1b4b, 0.6);
    group.add(hemiLight);

    // 2. 地面：開闊月台復古紅磚與延伸至遠方的軌道基底 (64m x 64m)
    const platGeo = new THREE.PlaneGeometry(64, 64);
    const platMat = new THREE.MeshStandardMaterial({
      map: this.tex.stationBrick,
      roughness: 0.8,
      metalness: 0.08
    });
    const platform = new THREE.Mesh(platGeo, platMat);
    platform.rotation.x = -Math.PI / 2;
    platform.receiveShadow = true;
    group.add(platform);

    // 3. 雙軌火車鐵道、枕木與碎石基床 (自月台右側貫穿延伸至遠方隧道)
    this.buildTrainRailwayBed(group, 5.2);

    // 4. 維多利亞拱頂鐵道鋼構雨棚 (Overhead Iron Truss Roof Frame)
    this.buildStationRoofStructure(group);

    // 5. 西側候車大廳紅磚建築立面
    this.buildStationTerminalBuilding(group);

    // 6. 巨型四層維多利亞紅磚天文時鐘塔 (TIME / CLOCK) - 矗立於月台北側樞紐
    this.buildAstronomicalClockTower(group, -2.8, 0, -8.5, '🕰️ 月台巨型天文時鐘 (TIME / CLOCK)', 'TIME', () => {
      this.world.openSpeechCard('TIME', () => {
        this.world.addXP(80);
      });
    });

    // 7. 3D 魔法星光蒸汽特快車頭 (TRAIN) - 停泊於鐵道上
    this.buildSteamLocomotive(group, 5.2, 0, -3.2, '🚂 魔法星光特快列車 (TRAIN)', 'TRAIN', () => {
      this.world.openSpeechCard('TRAIN', () => {
        this.world.addXP(80);
      });
    });

    // 8. 鑄鐵晨曦煤氣路燈與候車長椅 (MORNING) - 位於月台左側步道
    this.buildGasLampAndBench(group, -4.5, 0, 1.0, '🌅 照亮晨曦的月台路燈 (MORNING)', 'MORNING', () => {
      this.world.openSpeechCard('MORNING', () => {
        this.world.addXP(80);
      });
    });

    // 9. 出口通道：蒸汽列車「頭等客車登車大門」(移至火車車廂側門，自然登車體驗！)
    this.buildTrainCarriageDoorPortal(group, 4.8, 0, 2.2, '🚂 登上通往大魔導士殿堂的列車門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 汽笛長鳴！恭喜完成全維度英語護照試煉！');
      if (this.world) this.world.triggerEscapeCelebration();
    });

    // 飄浮星光塵埃微粒
    this.addFloatingParticles(group, 0xfde047, 180, 36, 7);
  }

  // [車站] 建造維多利亞鋼鐵拱型雨棚桁架 (打破四方方框，營造宏偉車站感)
  buildStationRoofStructure(group) {
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3 });

    // 4 跨巨大的鐵道圓拱鋼架 (橫跨月台與鐵軌)
    [-8, -2, 4, 10].forEach(z => {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(7.2, 0.14, 8, 20, Math.PI), ironMat);
      arch.position.set(0.5, 5.2, z);
      arch.rotation.z = 0;
      group.add(arch);

      // 支撐鋼柱
      [-6.5, 7.5].forEach(x => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 5.5, 8), ironMat);
        col.position.set(x, 2.75, z);
        group.add(col);
      });
    });
  }

  // [車站] 建造西側月台大廳牆面與窗景
  buildStationTerminalBuilding(group) {
    const brickMat = new THREE.MeshStandardMaterial({ map: this.tex.stationBrick, roughness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });

    const wall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7.5, 24), brickMat);
    wall.position.set(-10.5, 3.75, 0);
    group.add(wall);

    // 發光暖黃拱窗
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

    // 車站時刻表木牌 (Timetable Board)
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.6, 2.4), woodMat);
    board.position.set(-9.8, 3.2, -3.0);
    group.add(board);
  }

  // ==========================================
  // 模組化精緻景物建造器 (High-Fidelity Builders)
  // ==========================================

  // [市集] 擬真水果帳篷攤位 (蘋果/香蕉)
  buildDetailedMarketStall(group, x, y, z, fruitType, label, id, onClick, rotationY = 0) {
    const stall = new THREE.Group();
    stall.position.set(x, y, z);
    stall.rotation.y = rotationY;

    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.65 });

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

    // 2. 攤位 4 根挑高立柱
    const poleGeo = new THREE.BoxGeometry(0.1, 1.8, 0.1);
    [[-1.35, -0.65], [1.35, -0.65], [-1.35, 0.65], [1.35, 0.65]].forEach(([px, pz]) => {
      const pole = new THREE.Mesh(poleGeo, woodMat);
      pole.position.set(px, 1.85, pz);
      stall.add(pole);
    });

    // 3. 紅白條紋遮陽棚
    const canopyMat = new THREE.MeshStandardMaterial({
      map: this.tex.marketAwning,
      roughness: 0.7,
      side: THREE.DoubleSide
    });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.3, 0.9, 4), canopyMat);
    roof.position.set(0, 3.1, 0);
    roof.rotation.y = Math.PI / 4;
    stall.add(roof);

    // 垂墜荷葉邊
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
  buildDetailedCart(group, x, y, z, cartType, label, id, onClick, rotationY = 0) {
    const cart = new THREE.Group();
    cart.position.set(x, y, z);
    cart.rotation.y = rotationY;

    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });

    // 底盤與把手
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 1.1), woodMat);
    chassis.position.y = 0.65;
    cart.add(chassis);

    // 大車輪
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

    if (cartType === 'bread') {
      const basketMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 0.35, 12), basketMat);
      basket.position.set(0, 0.9, 0);
      cart.add(basket);

      const crustMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 });
      [-0.15, 0, 0.15].forEach((bx, idx) => {
        const baguette = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 10), crustMat);
        baguette.position.set(bx, 1.2, (idx - 1) * 0.08);
        baguette.rotation.x = 0.35 + idx * 0.1;
        cart.add(baguette);
      });
    } else if (cartType === 'milk') {
      const milkLiquidMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const honeyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, transparent: true, opacity: 0.9 });

      [[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.2], [0.3, 0.2]].forEach(([mx, mz]) => {
        const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.42, 12), milkLiquidMat);
        bottle.position.set(mx, 0.95, mz);
        cart.add(bottle);

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 8), new THREE.MeshStandardMaterial({ color: 0x92400e }));
        cap.position.set(mx, 1.18, mz);
        cart.add(cap);
      });

      const honeyPot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), honeyMat);
      honeyPot.position.set(0, 0.95, 0);
      cart.add(honeyPot);
    }

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

  // [市集] 彩色慶典吊旗
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

  // [市集] 古堡護城石橋木造吊橋大門 (Exit Portal - 融入邊緣城牆)
  buildDrawbridgePortal(group, x, y, z, label, exitWord, onUnlocked, rotationY = 0) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);
    portal.rotation.y = rotationY;

    const stoneMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });

    // 兩側防禦石塔
    const towerL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.2, 1.4), stoneMat);
    towerL.position.set(-2.2, 2.6, 0);
    portal.add(towerL);

    const towerR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.2, 1.4), stoneMat);
    towerR.position.set(2.2, 2.6, 0);
    portal.add(towerR);

    // 石拱過梁
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.9, 1.2), stoneMat);
    lintel.position.set(0, 4.8, 0);
    portal.add(lintel);

    // 吊橋門板
    const gateDoor = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.0, 0.25), woodMat);
    gateDoor.position.set(0, 2.0, 0);
    portal.add(gateDoor);

    // 斜拉鐵鍊
    [-1.5, 1.5].forEach(cx => {
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4.2, 6), ironMat);
      chain.position.set(cx, 2.6, 0.6);
      chain.rotation.x = 0.35;
      portal.add(chain);
    });

    // 燃燒火盆
    [-2.2, 2.2].forEach(tx => {
      const brazier = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.3, 8), ironMat);
      brazier.position.set(tx, 3.2, 0.8);
      portal.add(brazier);

      const fLight = new THREE.PointLight(0xf97316, 1.3, 6);
      fLight.position.set(tx, 3.5, 0.8);
      portal.add(fLight);
    });

    // 發光解鎖魔法結界
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

    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 4.2, 2.0),
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

  // [花園] 散落花園草坪的 3D 盛開小花
  buildScatteredFlowers(group) {
    const petalMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const petalMatBlue = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.6 });
    const centerMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.4 });

    const flowerCoords = [
      [-2.5, -0.8], [-1.8, 1.5], [2.2, 1.2], [3.0, -1.0],
      [-4.0, 1.0], [4.5, 0.5], [-2.0, -3.2], [2.5, -3.5],
      [-5.5, 3.5], [5.0, 3.2], [0.5, 2.8], [-3.2, -5.5]
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

    const baseBasin = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.6, 16), marbleMat);
    baseBasin.position.y = 0.3;
    baseBasin.castShadow = true;
    fountain.add(baseBasin);

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

    const centralPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.4, 12), marbleMat);
    centralPillar.position.y = 1.2;
    fountain.add(centralPillar);

    const upperBasin = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.9, 0.3, 16), marbleMat);
    upperBasin.position.y = 1.9;
    fountain.add(upperBasin);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), marbleMat);
    finial.position.y = 2.2;
    fountain.add(finial);

    // 湧水微粒
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

    // 綠色花草小丘
    const mound = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.1, 0.25, 12),
      new THREE.MeshStandardMaterial({ map: this.tex.gardenGrass, roughness: 0.9 })
    );
    mound.position.y = 0.125;
    rabbit.add(mound);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 14), furMat);
    body.position.y = 0.48;
    body.scale.set(1.0, 1.1, 1.15);
    rabbit.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), furMat);
    head.position.set(0, 0.82, 0.2);
    rabbit.add(head);

    // 長耳朵
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

    // 眼睛與尾巴
    [-0.1, 0.1].forEach(eyeX => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
      eye.position.set(eyeX, 0.88, 0.42);
      rabbit.add(eye);
    });

    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), furMat);
    tail.position.set(0, 0.45, -0.4);
    rabbit.add(tail);

    // 懷中抱著的大胡蘿蔔
    const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.35, 8), carrotMat);
    carrot.position.set(0.15, 0.58, 0.35);
    carrot.rotation.z = -0.5;
    rabbit.add(carrot);

    const carrotTop = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 6), greenMat);
    carrotTop.position.set(0.24, 0.74, 0.35);
    carrotTop.rotation.z = -0.5;
    rabbit.add(carrotTop);

    const hitBox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 1.5, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
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

  // [花園] 常春藤羅馬石柱與歌唱青鳥 (BIRD)
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

    // 常春藤綠葉
    const ivyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    for (let v = 0; v < 6; v++) {
      const ivy = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12), ivyMat);
      ivy.position.set(Math.sin(v * 1.3) * 0.3, 0.5 + v * 0.28, Math.cos(v * 1.3) * 0.3);
      birdGroup.add(ivy);
    }

    // 青鳥
    const bird = new THREE.Group();
    bird.position.set(0, 2.45, 0);

    const blueFeatherMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.4 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), blueFeatherMat);
    body.scale.set(1.0, 1.1, 1.4);
    bird.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), bellyMat);
    belly.position.set(0, -0.04, 0.08);
    bird.add(belly);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), blueFeatherMat);
    head.position.set(0, 0.15, 0.14);
    bird.add(head);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 6), beakMat);
    beak.position.set(0, 0.14, 0.28);
    beak.rotation.x = Math.PI / 2;
    bird.add(beak);

    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.22), blueFeatherMat);
    tail.position.set(0, 0.02, -0.22);
    tail.rotation.x = -0.3;
    bird.add(tail);

    birdGroup.add(bird);

    const hitBox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 2.8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
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

  // [花園] 盤根錯節的精靈守護大樹 (TREE)
  buildAncientWorldTree(group, x, y, z, label, id, onClick) {
    const tree = new THREE.Group();
    tree.position.set(x, y, z);

    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.85 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.75 });

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.95, 3.2, 10), woodMat);
    trunk.position.y = 1.6;
    trunk.castShadow = true;
    tree.add(trunk);

    [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(ang => {
      const root = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 1.4), woodMat);
      root.position.set(Math.sin(ang) * 0.9, 0.25, Math.cos(ang) * 0.9);
      root.rotation.y = ang;
      tree.add(root);
    });

    const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4), leafMat);
    canopy1.position.set(0, 4.0, 0);
    tree.add(canopy1);

    const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8), leafMat);
    canopy2.position.set(-0.8, 4.8, 0.4);
    tree.add(canopy2);

    const canopy3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.7), leafMat);
    canopy3.position.set(0.9, 4.6, -0.5);
    tree.add(canopy3);

    // 精靈提燈
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.8 })
    );
    lamp.position.set(1.2, 3.0, 0.5);
    tree.add(lamp);

    const lampLight = new THREE.PointLight(0xfef08a, 1.2, 7);
    lampLight.position.set(1.2, 3.0, 0.5);
    tree.add(lampLight);

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

  // [花園] 玫瑰攀藤鍛鐵古樹拱門 (Exit Portal - 自然林間穿梭路徑)
  buildRoseArchPortal(group, x, y, z, label, exitWord, onUnlocked, rotationY = 0) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);
    portal.rotation.y = rotationY;

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const roseMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });

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

      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.05), leafMat);
      leaf.position.set(rx - 0.1, ry - 0.05, 0.04);
      portal.add(leaf);
    }

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

  // [操場] 足球劃線
  buildSoccerFieldLines(group) {
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const border = new THREE.Mesh(new THREE.RingGeometry(7.8, 7.9, 4), lineMat);
    border.rotation.x = -Math.PI / 2;
    border.rotation.z = Math.PI / 4;
    border.position.y = 0.035;
    group.add(border);

    const centerCircle = new THREE.Mesh(new THREE.RingGeometry(2.4, 2.48, 24), lineMat);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.y = 0.035;
    group.add(centerCircle);
  }

  // [操場] 擬真足球門與經典黑白五角足球 (SOCCER / BALL)
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

    // 經典足球
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

    const startLine = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 0.2), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    startLine.position.set(0, 0.02, 0);
    runGroup.add(startLine);

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

  // [操場] 體育跳高海綿墊與木質跳箱 (JUMP)
  buildJumpEquipment(group, x, y, z, label, id, onClick) {
    const jumpGroup = new THREE.Group();
    jumpGroup.position.set(x, y, z);

    const matMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.5, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 })
    );
    matMesh.position.set(0, 0.25, 0);
    jumpGroup.add(matMesh);

    const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7 });
    [-1.2, 1.2].forEach(px => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), poleMat);
      pole.position.set(px, 0.9, -1.0);
      jumpGroup.add(pole);
    });

    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.4, 8), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    crossbar.position.set(0, 1.35, -1.0);
    crossbar.rotation.z = Math.PI / 2;
    jumpGroup.add(crossbar);

    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });
    const vaultBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.65, 1.2), woodMat);
    vaultBox.position.set(-1.8, 0.325, 0.2);
    jumpGroup.add(vaultBox);

    const leatherTop = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.15, 1.25), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 }));
    leatherTop.position.set(-1.8, 0.725, 0.2);
    jumpGroup.add(leatherTop);

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

  // [操場] 金色凱旋桂冠勝利拱門 (Exit Portal - 移至跑道終點線邊緣)
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

    [-1.8, 1.8].forEach(tx => {
      const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.15, 0.5, 8), goldMat);
      torch.position.set(tx, 4.2, 0.5);
      portal.add(torch);

      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xef4444, emissiveIntensity: 0.9 }));
      flame.position.set(tx, 4.5, 0.5);
      portal.add(flame);
    });

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

  // [車站] 雙軌火車鐵道、枕木與碎石基床 (貫通延伸至遠方)
  buildTrainRailwayBed(group, trackX) {
    const gravelMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 });
    const sleeperMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.85 });
    const steelRailMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });

    // 碎石基床道碴 (長達 60 米)
    const bed = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.12, 60), gravelMat);
    bed.position.set(trackX, 0.06, 0);
    bed.receiveShadow = true;
    group.add(bed);

    // 深色木枕木
    for (let z = -28; z <= 28; z += 1.2) {
      const sleeper = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.14, 0.32), sleeperMat);
      sleeper.position.set(trackX, 0.14, z);
      group.add(sleeper);
    }

    // 兩條銀白鋼軌
    [-0.95, 0.95].forEach(rx => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 60), steelRailMat);
      rail.position.set(trackX + rx, 0.26, 0);
      group.add(rail);
    });

    // 遠端山洞隧道剪影 (Tunnel Entrance Silhouette)
    const tunnel = new THREE.Mesh(
      new THREE.RingGeometry(2.8, 6.5, 16),
      new THREE.MeshStandardMaterial({ map: this.tex.stationBrick, roughness: 0.9 })
    );
    tunnel.position.set(trackX, 3.2, -29.8);
    group.add(tunnel);
  }

  // [車站] 巨型維多利亞四層天文時鐘塔 (TIME / CLOCK)
  buildAstronomicalClockTower(group, x, y, z, label, id, onClick) {
    const tower = new THREE.Group();
    tower.position.set(x, y, z);

    const brickMat = new THREE.MeshStandardMaterial({ map: this.tex.stationBrick, roughness: 0.8 });
    const stoneTrimMat = new THREE.MeshStandardMaterial({ map: this.tex.stoneWall, roughness: 0.6 });
    const roofCopperMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, metalness: 0.5, roughness: 0.4 });

    const towerBody = new THREE.Mesh(new THREE.BoxGeometry(3.8, 9.5, 3.8), brickMat);
    towerBody.position.y = 4.75;
    towerBody.castShadow = true;
    tower.add(towerBody);

    [3.2, 6.8].forEach(ly => {
      const trim = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.3, 4.1), stoneTrimMat);
      trim.position.y = ly;
      tower.add(trim);
    });

    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.0, 4.0, 4), roofCopperMat);
    roof.position.y = 11.5;
    roof.rotation.y = Math.PI / 4;
    tower.add(roof);

    // 正面天文鐘面
    const dialMat = new THREE.MeshStandardMaterial({ map: this.tex.clockFace, roughness: 0.35, metalness: 0.25 });
    const clockDial = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.12, 24), dialMat);
    clockDial.rotation.x = Math.PI / 2;
    clockDial.position.set(0, 7.2, 1.96);
    tower.add(clockDial);

    // 3D 黃銅時針與分針 (動態旋轉走時)
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.8, roughness: 0.2 });
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.04), brassMat);
    hourHand.position.set(0, 7.2, 2.05);
    tower.add(hourHand);

    const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.95, 0.04), brassMat);
    minuteHand.position.set(0, 7.2, 2.06);
    tower.add(minuteHand);

    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 10.0, 4.5),
      new THREE.MeshBasicMaterial({ visible: false })
    );
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

  // [車站] 擬真 3D 復古蒸汽火車頭 (TRAIN)
  buildSteamLocomotive(group, x, y, z, label, id, onClick) {
    const train = new THREE.Group();
    train.position.set(x, y, z);

    const blackIronMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.7 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.85 });
    const frontTexMat = new THREE.MeshStandardMaterial({ map: this.tex.locomotive, roughness: 0.5, metalness: 0.3 });

    // 圓筒蒸汽鍋爐
    const boiler = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 5.2, 16), blackIronMat);
    boiler.rotation.x = Math.PI / 2;
    boiler.position.set(0, 1.6, 0);
    train.add(boiler);

    [-1.5, 0, 1.5].forEach(bz => {
      const band = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.04, 8, 20), brassMat);
      band.position.set(0, 1.6, bz);
      train.add(band);
    });

    // 車頭蓋板
    const frontDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.2, 20), frontTexMat);
    frontDisc.rotation.x = Math.PI / 2;
    frontDisc.position.set(0, 1.6, 2.6);
    train.add(frontDisc);

    // 車頭大燈
    const headlight = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.4, 12), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 1.0 }));
    headlight.rotation.x = Math.PI / 2;
    headlight.position.set(0, 2.5, 2.5);
    train.add(headlight);

    const headSpot = new THREE.SpotLight(0xfef08a, 2.2, 20, Math.PI / 6, 0.4);
    headSpot.position.set(0, 2.5, 2.6);
    headSpot.target.position.set(0, 1.0, 12.0);
    train.add(headSpot);
    train.add(headSpot.target);

    // 排障器
    const cowcatcher = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.0, 4), blackIronMat);
    cowcatcher.position.set(0, 0.5, 2.9);
    cowcatcher.rotation.x = Math.PI / 4;
    train.add(cowcatcher);

    // 煙囪與動態蒸汽
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

    // 6 具大動輪
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

    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 3.6, 6.8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
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

  // [車站] 鑄鐵晨曦煤氣路燈與候車長椅 (MORNING)
  buildGasLampAndBench(group, x, y, z, label, id, onClick) {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(x, y, z);

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.tex.woodDesk, roughness: 0.7 });

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 3.4, 8), ironMat);
    post.position.y = 1.7;
    lampGroup.add(post);

    const lantern = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.16, 0.5, 6),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.8, roughness: 0.2 })
    );
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

  // [車站] 蒸汽列車「客車登車門」作為通關傳送門 (自然情境化出口)
  buildTrainCarriageDoorPortal(group, x, y, z, label, exitWord, onUnlocked) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);

    const coachMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.4, metalness: 0.2 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 });

    // 車廂側門框
    const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.3), coachMat);
    frameL.position.set(-1.1, 1.6, 0);
    portal.add(frameL);

    const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.3), coachMat);
    frameR.position.set(1.1, 1.6, 0);
    portal.add(frameR);

    const topArch = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 0.3), coachMat);
    topArch.position.set(0, 3.2, 0);
    portal.add(topArch);

    // 黃銅迎賓把手與迎賓紅地毯
    [-0.9, 0.9].forEach(hx => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8), brassMat);
      rail.position.set(hx, 1.2, 0.3);
      portal.add(rail);
    });

    const carpet = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 3.0),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 })
    );
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.03, 1.5);
    portal.add(carpet);

    // 敞開的金色星光車門結界
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 2.9),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        emissive: 0xfbbf24,
        emissiveIntensity: 0.4
      })
    );
    door.position.y = 1.5;
    portal.add(door);

    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 3.6, 2.0),
      new THREE.MeshBasicMaterial({ visible: false })
    );
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
