// 空間情境管理器 (SpatialZoneManager)
// 支援五大多元生活與奇幻空間動態切換：書齋、市集、花園、操場、車站
class SpatialZoneManager {
  constructor(world) {
    this.world = world;
    this.currentZoneId = 'zone1';
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
    const texLoader = new THREE.TextureLoader();
    const woodTex = texLoader.load('assets/textures/tex-wood-desk.jpg');
    const stoneTex = texLoader.load('assets/textures/tex-stone-wall.jpg');

    // 1. 地面：暖色鵝卵石露天廣場
    const groundGeo = new THREE.PlaneGeometry(24, 24);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#d4a373',
      roughness: 0.85
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    group.add(ground);

    // 2. 邊界：木柵欄與矮石牆 (四周環繞)
    this.buildPerimeterFence(group, 12, '#8b5a2b');

    // 3. 水果帳篷攤位 A (左側：蘋果與水果區)
    this.buildMarketStall(group, -4, 0, -1, '#ef4444', '🍎 甜美紅蘋果攤 (APPLE)', 'stall_apple', () => {
      this.world.openSpeechCard('APPLE', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_APPLE', '🍎 甜脆紅蘋果', '#ef4444');
      });
    });

    // 4. 水果帳篷攤位 B (右側：香蕉與黃色水果)
    this.buildMarketStall(group, 4, 0, -1, '#eab308', '🍌 活力金香蕉 (BANANA)', 'stall_banana', () => {
      this.world.openSpeechCard('BANANA', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_BANANA', '🍌 香甜金香蕉', '#eab308');
      });
    });

    // 5. 烘焙麵包推車 (中央左側：BREAD)
    this.buildCart(group, -1.8, 0, -3.5, '🥖 剛出爐的烤麵包 (BREAD)', 'cart_bread', () => {
      this.world.openSpeechCard('BREAD', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_BREAD', '🥖 麥香長法棍', '#b45309');
      });
    });

    // 6. 鮮奶與蜂蜜攤位 (中央右側：MILK & SWEET)
    this.buildCart(group, 1.8, 0, -3.5, '🥛 香濃鮮牛奶 (MILK)', 'cart_milk', () => {
      this.world.openSpeechCard('MILK', () => {
        this.world.addXP(60);
        this.world.addInventory('ITEM_MILK', '🥛 牧場鮮牛奶', '#60a5fa');
      });
    });

    // 7. 出口通道：市集拱形護城吊橋閘門 (OPEN)
    this.buildExitPortal(group, 0, 0, -6, '🏰 市集通往精靈花園的吊橋 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 恭喜！市集商人讚許你的英語發音，放下吊橋，解鎖前往花園！');
      this.switchZone('zone3');
    });

    // 溫暖陽光與彩旗裝飾
    const sunLight = new THREE.DirectionalLight('#fff7ed', 1.6);
    sunLight.position.set(10, 20, 10);
    group.add(sunLight);
  }

  // ==========================================
  // Zone 3: 守護獸之森花園 (Beast Garden)
  // ==========================================
  buildZone3_Garden(group) {
    // 1. 地面：翠綠草坪
    const grassGeo = new THREE.PlaneGeometry(24, 24);
    const grassMat = new THREE.MeshStandardMaterial({ color: '#4ade80', roughness: 0.9 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    group.add(grass);

    // 2. 邊界：白色木柵欄與玫瑰花籬
    this.buildPerimeterFence(group, 12, '#ffffff');

    // 3. 中央石造噴泉 (WATER)
    const fountain = this.buildFountain(group, 0, 0, 0, '⛲ 清涼純淨的活泉水 (WATER)', 'poi_water', () => {
      this.world.openSpeechCard('WATER', () => {
        this.world.addXP(60);
      });
    });

    // 4. 花叢中的可愛小白兔 (RABBIT)
    this.buildCritter(group, -3.5, 0.4, -2, '#fef08a', '🐰 正在草地上蹦跳的兔子 (RABBIT)', 'RABBIT', () => {
      this.world.openSpeechCard('RABBIT', () => {
        this.world.addXP(70);
      });
    });

    // 5. 棲息在石柱上的青鳥 (BIRD)
    this.buildCritter(group, 3.5, 1.6, -2, '#38bdf8', '🐦 枝頭歌唱的青鳥 (BIRD)', 'BIRD', () => {
      this.world.openSpeechCard('BIRD', () => {
        this.world.addXP(70);
      });
    });

    // 6. 遠古長青大樹 (TREE)
    this.buildTree(group, -4.5, 0, 2, '🌳 茂密的精靈古樹 (TREE)', 'TREE', () => {
      this.world.openSpeechCard('TREE', () => {
        this.world.addXP(60);
      });
    });

    // 7. 出口通道：藤蔓百花鐵藝拱門 (OPEN)
    this.buildExitPortal(group, 0, 0, -6, '🌸 繁花纏繞的精靈拱門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 花園小精靈施展魔法推開拱門，解鎖前往操場！');
      this.switchZone('zone4');
    });
  }

  // ==========================================
  // Zone 4: 活力冒險操場 (Athletic Field)
  // ==========================================
  buildZone4_Athletic(group) {
    // 1. 地面：中央草坪 + 外部紅色跑道
    const fieldGeo = new THREE.PlaneGeometry(24, 24);
    const fieldMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.8 });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.rotation.x = -Math.PI / 2;
    group.add(field);

    const innerTurf = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshStandardMaterial({ color: '#16a34a' }));
    innerTurf.rotation.x = -Math.PI / 2;
    innerTurf.position.y = 0.02;
    group.add(innerTurf);

    this.buildPerimeterFence(group, 12, '#3b82f6');

    // 2. 足球門與黑白足球 (SOCCER / BALL)
    this.buildSportsProp(group, 0, 0.4, -2.5, '⚽ 草地上的足球 (SOCCER / BALL)', 'BALL', () => {
      this.world.openSpeechCard('BALL', () => {
        this.world.addXP(60);
      });
    });

    // 3. 起跑線助跑板 (RUN)
    this.buildSportsProp(group, -3.5, 0.1, 0, '🏃 起跑線加速奔跑 (RUN)', 'RUN', () => {
      this.world.openSpeechCard('RUN', () => {
        this.world.addXP(60);
      });
    });

    // 4. 跳高彩色海綿墊 (JUMP)
    this.buildSportsProp(group, 3.5, 0.3, 0, '🦘 體育跳箱與跳躍 (JUMP)', 'JUMP', () => {
      this.world.openSpeechCard('JUMP', () => {
        this.world.addXP(60);
      });
    });

    // 5. 出口通道：冠軍金色拱門閘門 (OPEN)
    this.buildExitPortal(group, 0, 0, -6, '🏆 終點冠軍金色拱門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 裁判揮舞旗幟，恭喜突破體育操場，前往星光車站！');
      this.switchZone('zone5');
    });
  }

  // ==========================================
  // Zone 5: 星光鐘樓車站 (Clocktower Station)
  // ==========================================
  buildZone5_Station(group) {
    // 1. 地面：火車月台紅磚
    const platGeo = new THREE.PlaneGeometry(24, 24);
    const platMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.7 });
    const plat = new THREE.Mesh(platGeo, platMat);
    plat.rotation.x = -Math.PI / 2;
    group.add(plat);

    this.buildPerimeterFence(group, 12, '#1e293b');

    // 2. 巨型紅磚時鐘塔 (CLOCK / TIME)
    this.buildClockTower(group, 0, 0, -4, '🕰️ 月台巨型天文時鐘 (TIME / CLOCK)', 'TIME', () => {
      this.world.openSpeechCard('TIME', () => {
        this.world.addXP(80);
      });
    });

    // 3. 復古售票小木屋 (TRAIN)
    this.buildSportsProp(group, -4, 1.2, 0, '🎫 魔法列車售票亭 (TRAIN)', 'TRAIN', () => {
      this.world.openSpeechCard('TRAIN', () => {
        this.world.addXP(80);
      });
    });

    // 4. 清晨日光路燈 (MORNING)
    this.buildSportsProp(group, 4, 1.8, 0, '🌅 照亮晨曦的月台路燈 (MORNING)', 'MORNING', () => {
      this.world.openSpeechCard('MORNING', () => {
        this.world.addXP(80);
      });
    });

    // 5. 出口通道：星月列車登車大門 (OPEN)
    this.buildExitPortal(group, 0, 0, 5, '🚂 前往大魔導士殿堂的列車門 (OPEN)', 'OPEN', () => {
      this.world.showToast('🎉 汽笛長鳴！恭喜完成全維度英語護照試煉！');
      if (this.world) this.world.triggerEscapeCelebration();
    });
  }

  // ==========================================
  // 通用空間景物建造器 (Helpers)
  // ==========================================
  buildPerimeterFence(group, halfSize, color) {
    const postMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.6 });
    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.5, 8);
    const railMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 });

    for (let i = -halfSize; i <= halfSize; i += 3) {
      // 北邊與南邊柱子
      const pN = new THREE.Mesh(postGeo, postMat);
      pN.position.set(i, 0.75, -halfSize);
      group.add(pN);

      const pS = new THREE.Mesh(postGeo, postMat);
      pS.position.set(i, 0.75, halfSize);
      group.add(pS);

      // 東邊與西邊柱子
      const pE = new THREE.Mesh(postGeo, postMat);
      pE.position.set(halfSize, 0.75, i);
      group.add(pE);

      const pW = new THREE.Mesh(postGeo, postMat);
      pW.position.set(-halfSize, 0.75, i);
      group.add(pW);
    }
  }

  buildMarketStall(group, x, y, z, color, label, id, onClick) {
    const stall = new THREE.Group();
    stall.position.set(x, y, z);

    // 櫃檯木架
    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.0, 1.4),
      new THREE.MeshStandardMaterial({ color: '#a16207', roughness: 0.7 })
    );
    counter.position.y = 0.5;
    stall.add(counter);

    // 彩色條紋遮陽棚
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(1.8, 0.8, 4),
      new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 })
    );
    roof.position.y = 2.0;
    roof.rotation.y = Math.PI / 4;
    stall.add(roof);

    // 互動包圍盒
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 2.4, 1.6),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 1.2;
    hitBox.userData = { id, label, onClick };
    stall.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(stall);
  }

  buildCart(group, x, y, z, label, id, onClick) {
    const cart = new THREE.Group();
    cart.position.set(x, y, z);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.8, 1.0),
      new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.6 })
    );
    box.position.y = 0.5;
    cart.add(box);

    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.2, 1.2),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 0.6;
    hitBox.userData = { id, label, onClick };
    cart.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(cart);
  }

  buildFountain(group, x, y, z, label, id, onClick) {
    const fountain = new THREE.Group();
    fountain.position.set(x, y, z);

    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 2.0, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.4 })
    );
    basin.position.y = 0.3;
    fountain.add(basin);

    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.1, metalness: 0.8 })
    );
    water.position.y = 0.55;
    fountain.add(water);

    const hitBox = new THREE.Mesh(
      new THREE.CylinderGeometry(2.0, 2.0, 1.2, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 0.6;
    hitBox.userData = { id, label, onClick };
    fountain.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(fountain);
  }

  buildCritter(group, x, y, z, color, label, id, onClick) {
    const critter = new THREE.Group();
    critter.position.set(x, y, z);

    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 12),
      new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 })
    );
    critter.add(body);

    const hitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.userData = { id, label, onClick };
    critter.add(hitBox);
    this.world.interactables.push(hitBox);

    // 輕微上下浮動動畫
    this.world.animators.push((time) => {
      critter.position.y = y + Math.sin(time * 3 + x) * 0.08;
    });

    group.add(critter);
  }

  buildTree(group, x, y, z, label, id, onClick) {
    const tree = new THREE.Group();
    tree.position.set(x, y, z);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 2.2, 8),
      new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.8 })
    );
    trunk.position.y = 1.1;
    tree.add(trunk);

    const leaves = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.4),
      new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.7 })
    );
    leaves.position.y = 2.8;
    tree.add(leaves);

    const hitBox = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 3.2, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 1.6;
    hitBox.userData = { id: 'poi_tree', label, onClick };
    tree.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(tree);
  }

  buildSportsProp(group, x, y, z, label, id, onClick) {
    const prop = new THREE.Group();
    prop.position.set(x, y, z);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 12, 12),
      new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.4 })
    );
    prop.add(mesh);

    const hitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.userData = { id, label, onClick };
    prop.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(prop);
  }

  buildClockTower(group, x, y, z, label, id, onClick) {
    const tower = new THREE.Group();
    tower.position.set(x, y, z);

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 6.0, 2.4),
      new THREE.MeshStandardMaterial({ color: '#991b1b', roughness: 0.8 })
    );
    body.position.y = 3.0;
    tower.add(body);

    const clock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.3 })
    );
    clock.rotation.x = Math.PI / 2;
    clock.position.set(0, 4.2, 1.25);
    tower.add(clock);

    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 6.0, 3.0),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 3.0;
    hitBox.userData = { id, label, onClick };
    tower.add(hitBox);
    this.world.interactables.push(hitBox);

    group.add(tower);
  }

  buildExitPortal(group, x, y, z, label, exitWord, onUnlocked) {
    const portal = new THREE.Group();
    portal.position.set(x, y, z);

    // 拱門兩側石柱與門頂
    const pillarMat = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.4, metalness: 0.3 });
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.2, 0.5), pillarMat);
    p1.position.set(-1.4, 1.6, 0);
    portal.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.2, 0.5), pillarMat);
    p2.position.set(1.4, 1.6, 0);
    portal.add(p2);

    const top = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.6, 0.6), pillarMat);
    top.position.set(0, 3.2, 0);
    portal.add(top);

    // 魔法結界門扉
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 2.9),
      new THREE.MeshStandardMaterial({
        color: '#60a5fa',
        transparent: true,
        opacity: 0.6,
        roughness: 0.1
      })
    );
    door.position.y = 1.45;
    portal.add(door);

    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 3.2, 1.0),
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

    // 光芒微粒旋轉動畫
    this.world.animators.push((time) => {
      door.material.opacity = 0.5 + Math.sin(time * 3) * 0.2;
    });

    group.add(portal);
  }
}

// 建立全域空間實例
window.SpatialZoneManager = SpatialZoneManager;
