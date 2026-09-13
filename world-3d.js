// 3D 魔法書齋世界與謎題互動引擎 (World3D)
// 基於 Three.js 打造溫馨奇幻《葬送的芙莉蓮》與《童趣森林》風格

class World3D {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouseCoord = new THREE.Vector2(0, 0);

    // 玩家物理與視角
    this.player = {
      pos: new THREE.Vector3(0, 1.6, 2.5),
      yaw: 0,
      pitch: 0,
      speed: 3.6,
      radius: 0.45
    };

    // 互動道具與動畫清單
    this.interactables = [];
    this.animators = [];
    this.hoveredObject = null;

    // 謎題階段與遊戲狀態
    this.gameState = {
      candleLit: false,
      bookOpened: false,
      hasKey: false,
      drawerOpened: false,
      hasRedPotion: false,
      hasBluePotion: false,
      alchemyMixed: false,
      hasStarStone: false,
      hasFish: false,
      catPracticed: false,
      mimicFed: false,
      hasFlowerStone: false,
      doorSocketsFilled: false,
      doorStonePlaced: false,
      doorOpened: false,
      escaped: false,
      inventory: [],
      xp: 0,
      level: 1
    };

    this.clock = new THREE.Clock();
    this.activeZoneGroup = new THREE.Group();
    this.initScene();
    this.scene.add(this.activeZoneGroup);

    if (window.SpatialZoneManager) {
      this.zoneManager = new SpatialZoneManager(this);
    }

    this.buildAtelierRoom(this.activeZoneGroup);
    this.buildProps(this.activeZoneGroup);
    this.buildOutsideMeadow(this.activeZoneGroup);
    this.setupEvents();
    this.initCloudSync();

    if (window.MinimapManager) {
      this.minimap = new MinimapManager(this);
    }

    if (window.ScavengerHuntManager) {
      this.scavengerHunt = new ScavengerHuntManager(this);
      window.scavengerHuntManager = this.scavengerHunt;
      setTimeout(() => {
        if (typeof this.showToast === 'function') {
          this.showToast('🧭【情境聽力尋寶】已就緒！點擊右上角「聽力尋寶」按鈕或按 [H] 鍵即可啟動！');
        }
      }, 1500);
    }

    this.animate();
  }

  switchZone(zoneId) {
    if (this.zoneManager) {
      return this.zoneManager.switchZone(zoneId);
    }
  }

  initScene() {
    const canvas = document.getElementById('renderCanvas');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdce8f5); // 柔和天空淡藍
    this.scene.fog = new THREE.FogExp2(0xf0e6d6, 0.025);

    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.copy(this.player.pos);

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 溫暖陽光與環境光
    const hemiLight = new THREE.HemisphereLight(0xfff3db, 0xa0856c, 0.85);
    this.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    sunLight.position.set(5, 8, -4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    this.scene.add(sunLight);

    // 漂浮魔力塵埃粒子 (Frieren 暖光微塵)
    const dustCount = 180;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 12;
      dustPos[i + 1] = Math.random() * 4;
      dustPos[i + 2] = (Math.random() - 0.5) * 12;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffe89e,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    this.dustParticles = new THREE.Points(dustGeo, dustMat);
    this.scene.add(this.dustParticles);
  }

  // 打造溫馨木造與石砌魔法書齋
  buildAtelierRoom(parentGroup) {
    const container = parentGroup || this.activeZoneGroup || this.scene;
    const roomGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // 1. 溫潤古木地板 (AI 精緻木紋皮膚)
    const floorTex = textureLoader.load('assets/textures/tex-wood-floor.jpg');
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(4, 4);
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.55,
      metalness: 0.05
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // 2. 天花板與深木橫樑 (木紋皮膚)
    const beamTex = textureLoader.load('assets/textures/tex-wood-desk.jpg');
    const ceilingGeo = new THREE.PlaneGeometry(12, 12);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x3d291d, roughness: 0.85 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = 4.2;
    ceiling.rotation.x = Math.PI / 2;
    roomGroup.add(ceiling);

    // 木質橫樑
    for (let z = -4; z <= 4; z += 2.5) {
      const beamGeo = new THREE.BoxGeometry(12, 0.25, 0.35);
      const beamMat = new THREE.MeshStandardMaterial({ map: beamTex, roughness: 0.6 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 4.05, z);
      roomGroup.add(beam);
    }

    // 3. 牆壁材質 (AI 精緻古石磚牆皮膚)
    const wallTex = textureLoader.load('assets/textures/tex-stone-wall.jpg');
    wallTex.wrapS = THREE.RepeatWrapping;
    wallTex.wrapT = THREE.RepeatWrapping;
    wallTex.repeat.set(3, 2);
    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTex,
      roughness: 0.85,
      metalness: 0.05
    });

    // 北牆 (有大拱窗)
    const northWallLeft = new THREE.Mesh(new THREE.BoxGeometry(4, 4.2, 0.4), wallMat);
    northWallLeft.position.set(-4, 2.1, -6);
    roomGroup.add(northWallLeft);

    const northWallRight = new THREE.Mesh(new THREE.BoxGeometry(4, 4.2, 0.4), wallMat);
    northWallRight.position.set(4, 2.1, -6);
    roomGroup.add(northWallRight);

    const northWallTop = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 0.4), wallMat);
    northWallTop.position.set(0, 3.6, -6);
    roomGroup.add(northWallTop);

    // 大拱窗窗框
    const frameMat = new THREE.MeshStandardMaterial({ map: beamTex, roughness: 0.5 });
    const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(3.9, 2.9, 0.2), frameMat);
    windowFrame.position.set(0, 1.5, -6);
    roomGroup.add(windowFrame);

    // 窗外風景立體背板 (芙莉蓮風格陽光花田與遠景)
    const bgGeo = new THREE.PlaneGeometry(16, 9);
    const bgTex = textureLoader.load('assets/textures/atelier-window-view.jpg');
    const bgMat = new THREE.MeshBasicMaterial({ map: bgTex });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 2.5, -11.5);
    roomGroup.add(bgMesh);

    // 4. 地面中央華麗魔導圓形地毯 (Magic Circle Rug)
    const rugTex = textureLoader.load('assets/textures/magic-circle-rug.jpg');
    const rugGeo = new THREE.CircleGeometry(2.3, 32);
    const rugMat = new THREE.MeshStandardMaterial({
      map: rugTex,
      roughness: 0.8,
      metalness: 0.05
    });
    const rugMesh = new THREE.Mesh(rugGeo, rugMat);
    rugMesh.rotation.x = -Math.PI / 2;
    rugMesh.position.set(0, 0.02, -0.6);
    rugMesh.receiveShadow = true;
    roomGroup.add(rugMesh);

    // 5. 西側石壁懸掛古老魔導「蒼月草植物圖鑑」畫框 (Botanical Herb Painting)
    const paintingTex = textureLoader.load('assets/textures/botanical-flower-painting.jpg');
    const paintingGeo = new THREE.PlaneGeometry(2.6, 1.95);
    const paintingMat = new THREE.MeshStandardMaterial({
      map: paintingTex,
      roughness: 0.45,
      metalness: 0.1
    });
    const paintingMesh = new THREE.Mesh(paintingGeo, paintingMat);
    paintingMesh.position.set(-5.75, 2.2, 1.6);
    paintingMesh.rotation.y = Math.PI / 2;
    roomGroup.add(paintingMesh);

    // 東西牆壁
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, 12), wallMat);
    eastWall.position.set(6, 2.1, 0);
    roomGroup.add(eastWall);

    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, 12), wallMat);
    westWall.position.set(-6, 2.1, 0);
    roomGroup.add(westWall);

    // 南牆 (大門兩側石柱)
    const southWallLeft = new THREE.Mesh(new THREE.BoxGeometry(4.5, 4.2, 0.4), wallMat);
    southWallLeft.position.set(-3.75, 2.1, 6);
    roomGroup.add(southWallLeft);

    const southWallRight = new THREE.Mesh(new THREE.BoxGeometry(4.5, 4.2, 0.4), wallMat);
    southWallRight.position.set(3.75, 2.1, 6);
    roomGroup.add(southWallRight);

    const southWallTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 0.4), wallMat);
    southWallTop.position.set(0, 3.6, 6);
    roomGroup.add(southWallTop);

    // 高聳書架
    this.buildBookshelf(roomGroup, -5.6, 0, -2, Math.PI / 2);
    this.buildBookshelf(roomGroup, 5.6, 0, -2, -Math.PI / 2);

    container.add(roomGroup);
  }

  buildBookshelf(parent, x, y, z, rotY) {
    const shelfGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    const woodTex = textureLoader.load('assets/textures/tex-wood-desk.jpg');
    const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.6 });

    // 書架主體
    const frame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.6, 0.6), woodMat);
    frame.position.y = 1.8;
    shelfGroup.add(frame);

    // 書本排置
    const colors = [0x993333, 0x2b4c7e, 0x2d6a4f, 0xc27ba0, 0xd4a373];
    for (let row = 0; row < 4; row++) {
      for (let b = 0; b < 9; b++) {
        const h = 0.4 + Math.random() * 0.15;
        const bookMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, h, 0.4),
          new THREE.MeshStandardMaterial({ color: colors[b % colors.length] })
        );
        bookMesh.position.set(-1.2 + b * 0.3, 0.6 + row * 0.8 + h / 2, 0.05);
        shelfGroup.add(bookMesh);
      }
    }

    shelfGroup.position.set(x, y, z);
    shelfGroup.rotation.y = rotY;
    parent.add(shelfGroup);
  }

  // 建造各項解謎互動道具
  buildProps(parentGroup) {
    const container = parentGroup || this.activeZoneGroup || this.scene;
    const textureLoader = new THREE.TextureLoader();
    const deskWoodTex = textureLoader.load('assets/textures/tex-wood-desk.jpg');
    const grimoireTex = textureLoader.load('assets/textures/tex-grimoire-book.jpg');
    const slateTex = textureLoader.load('assets/textures/tex-alchemy-slate.jpg');

    // ==========================================
    // 1. 銅燭台 (Candle -> LIGHT)
    // ==========================================
    const candleGroup = new THREE.Group();
    const standMat = new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.7, roughness: 0.25 });

    // 小圓茶几 (木紋皮膚)
    const tableMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.55, 0.85, 16),
      new THREE.MeshStandardMaterial({ map: deskWoodTex, roughness: 0.5, metalness: 0.1 })
    );
    tableMesh.position.set(-3.2, 0.42, -3.5);
    container.add(tableMesh);

    // 燭台底座
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.06, 12), standMat);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.25, 8), standMat);
    stem.position.y = 0.14;
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8), new THREE.MeshStandardMaterial({ color: 0xfffdd0 }));
    wax.position.y = 0.32;

    candleGroup.add(base, stem, wax);

    // 燭火網格
    const flameGeo = new THREE.ConeGeometry(0.04, 0.1, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffcc33, transparent: true, opacity: 0 });
    this.candleFlame = new THREE.Mesh(flameGeo, flameMat);
    this.candleFlame.position.y = 0.46;
    candleGroup.add(this.candleFlame);

    // 燭火點光源
    this.candleLight = new THREE.PointLight(0xffb74d, 0, 8);
    this.candleLight.position.set(0, 0.5, 0);
    candleGroup.add(this.candleLight);

    candleGroup.position.set(-3.2, 0.85, -3.5);
    candleGroup.userData = { id: 'candle', name: '古銅燭台', hint: '點亮房間的微光 (LIGHT)' };
    container.add(candleGroup);
    this.interactables.push(candleGroup);

    // ==========================================
    // 2. 書桌與漂浮古書 (Desk & Floating Book -> BOOK & KEY)
    // ==========================================
    const deskGroup = new THREE.Group();
    // 書桌面板 (AI 精緻深木雕花邊框皮膚)
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.1, 1.2),
      new THREE.MeshStandardMaterial({ map: deskWoodTex, roughness: 0.45, metalness: 0.1 })
    );
    deskTop.position.set(0, 0.95, -3.8);
    deskTop.castShadow = true;
    deskGroup.add(deskTop);

    // 桌腳
    const legGeo = new THREE.BoxGeometry(0.12, 0.95, 0.12);
    const legMat = new THREE.MeshStandardMaterial({ map: deskWoodTex, roughness: 0.6 });
    [[-1.1, -3.3], [1.1, -3.3], [-1.1, -4.3], [1.1, -4.3]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 0.475, lz);
      deskGroup.add(leg);
    });

    // 抽屜組 (木紋皮膚)
    this.drawerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.25, 0.9),
      new THREE.MeshStandardMaterial({ map: deskWoodTex, roughness: 0.45, metalness: 0.1 })
    );
    this.drawerMesh.position.set(0.6, 0.8, -3.8);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), standMat);
    knob.position.set(0, 0, 0.47);
    this.drawerMesh.add(knob);
    deskGroup.add(this.drawerMesh);

    // 抽屜可互動
    this.drawerMesh.userData = { id: 'drawer', name: '上鎖的書桌抽屜', hint: '需要黃銅鑰匙 (KEY)' };
    this.interactables.push(this.drawerMesh);

    // 漂浮魔導書 (AI 燙金星月皮革法典皮膚)
    this.bookGroup = new THREE.Group();
    const coverMat = new THREE.MeshStandardMaterial({
      map: grimoireTex,
      roughness: 0.35,
      metalness: 0.2
    });
    const bookMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.35), coverMat);
    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.32), new THREE.MeshStandardMaterial({ color: 0xfdf6e2 }));
    pages.position.set(0.01, 0, 0);
    this.bookGroup.add(bookMesh, pages);

    this.bookGroup.position.set(-0.5, 1.25, -3.8);
    this.bookGroup.rotation.y = 0.2;
    this.bookGroup.userData = { id: 'book', name: '漂浮魔導書', hint: '記載遠古智慧 (BOOK)' };
    container.add(this.bookGroup);
    this.interactables.push(this.bookGroup);

    // 浮空鑰匙 (預設隱形)
    this.keyMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.06, 0.018, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 })
    );
    const keyShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14), this.keyMesh.material);
    keyShaft.position.set(0, -0.1, 0);
    this.keyMesh.add(keyShaft);
    this.keyMesh.position.set(-0.5, 1.15, -3.8);
    this.keyMesh.visible = false;
    container.add(this.keyMesh);

    container.add(deskGroup);

    // ==========================================
    // 3. 元素煉金台 (Alchemy Table -> RED, BLUE, STAR)
    // ==========================================
    const alchemyGroup = new THREE.Group();
    // 煉金石台面 (AI 黑色玄武岩黃金鍊金陣法石板皮膚)
    const tableA = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.85, 1.0),
      new THREE.MeshStandardMaterial({ map: slateTex, roughness: 0.5, metalness: 0.2 })
    );
    tableA.position.set(-4.5, 0.425, 0);
    alchemyGroup.add(tableA);

    // 燒瓶與魔藥
    const flaskGeo = new THREE.ConeGeometry(0.18, 0.35, 16);
    this.flaskLiquid = new THREE.Mesh(flaskGeo, new THREE.MeshStandardMaterial({ color: 0x999999, transparent: true, opacity: 0.85, roughness: 0.1 }));
    this.flaskLiquid.position.set(-4.5, 0.95, 0);
    alchemyGroup.add(this.flaskLiquid);

    // 星芒之石 (調配完成後浮出)
    this.starStone = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.15, 0),
      new THREE.MeshStandardMaterial({ color: 0xffe600, emissive: 0xffaa00, emissiveIntensity: 0.8, roughness: 0.2 })
    );
    this.starStone.position.set(-4.5, 1.25, 0);
    this.starStone.visible = false;
    container.add(this.starStone);

    alchemyGroup.userData = { id: 'alchemy', name: '元素煉金台', hint: '調配魔藥 (RED, BLUE)' };
    container.add(alchemyGroup);
    this.interactables.push(alchemyGroup);

    // ==========================================
    // 4. 貓咪寶箱怪 (Cat Mimic -> CAT, FISH)
    // ==========================================
    this.mimicGroup = new THREE.Group();
    // 寶箱本體 (深木雕紋皮膚)
    const chestBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.45, 0.5),
      new THREE.MeshStandardMaterial({ map: deskWoodTex, roughness: 0.5, metalness: 0.15 })
    );
    chestBody.position.y = 0.225;
    this.mimicGroup.add(chestBody);

    // 寶箱蓋
    this.mimicLid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.7, 16, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ map: deskWoodTex, roughness: 0.5, metalness: 0.15 })
    );
    this.mimicLid.rotation.z = Math.PI / 2;
    this.mimicLid.position.set(0, 0.45, 0);
    this.mimicGroup.add(this.mimicLid);

    // 可愛貓耳朵 (三角錐)
    const earGeo = new THREE.ConeGeometry(0.08, 0.16, 4);
    const earMat = new THREE.MeshStandardMaterial({ color: 0xde9b72 });
    const earL = new THREE.Mesh(earGeo, earMat);
    earL.position.set(-0.22, 0.65, 0);
    earL.rotation.z = 0.2;
    const earR = new THREE.Mesh(earGeo, earMat);
    earR.position.set(0.22, 0.65, 0);
    earR.rotation.z = -0.2;
    this.mimicGroup.add(earL, earR);

    // 大眼睛
    const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.16, 0.35, 0.26);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.16, 0.35, 0.26);
    this.mimicGroup.add(eyeL, eyeR);

    // 蒼月花之石刻 (FLOWER_STONE)
    this.flowerStone = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.14, 0),
      new THREE.MeshStandardMaterial({ color: 0x4da6ff, emissive: 0x0066cc, emissiveIntensity: 0.9, roughness: 0.2 })
    );
    this.flowerStone.position.set(4.5, 0.9, 2.5);
    this.flowerStone.visible = false;
    container.add(this.flowerStone);

    this.mimicGroup.position.set(4.5, 0, 2.5);
    this.mimicGroup.rotation.y = -Math.PI / 4;
    this.mimicGroup.userData = { id: 'mimic', name: '貓咪寶箱怪 Mimic', hint: '愛吃魚的貪睡小怪 (CAT, FISH)' };
    container.add(this.mimicGroup);
    this.interactables.push(this.mimicGroup);

    // 寶箱怪旁邊東側牆壁上的可愛貓咪掛畫
    const mimicPicTex = textureLoader.load('assets/textures/cute-cat-mimic.jpg');
    const mimicPic = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 1.1),
      new THREE.MeshStandardMaterial({ map: mimicPicTex, roughness: 0.5 })
    );
    mimicPic.position.set(5.78, 1.9, 2.5);
    mimicPic.rotation.y = -Math.PI / 2;
    container.add(mimicPic);

    // ==========================================
    // 5. 遠古石門 (Ancient Stone Door -> DOOR, OPEN)
    // ==========================================
    this.doorGroup = new THREE.Group();

    // 門框拱門
    const archMat = new THREE.MeshStandardMaterial({ color: 0x8a8479, roughness: 0.9 });
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 0.5), archMat);
    archTop.position.set(0, 3.1, 5.8);
    this.doorGroup.add(archTop);

    // 左右門扇專用古老星芒與蒼月花符文雕刻材質
    const doorTexLeft = textureLoader.load('assets/textures/ancient-stone-door.jpg');
    doorTexLeft.repeat.set(0.5, 1);
    doorTexLeft.offset.set(0, 0);
    const doorLeafMatLeft = new THREE.MeshStandardMaterial({
      map: doorTexLeft,
      roughness: 0.75,
      metalness: 0.15
    });

    const doorTexRight = textureLoader.load('assets/textures/ancient-stone-door.jpg');
    doorTexRight.repeat.set(0.5, 1);
    doorTexRight.offset.set(0.5, 0);
    const doorLeafMatRight = new THREE.MeshStandardMaterial({
      map: doorTexRight,
      roughness: 0.75,
      metalness: 0.15
    });

    this.doorLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.9, 0.2), doorLeafMatLeft);
    this.doorLeft.position.set(-0.6, 1.45, 5.8);
    this.doorRight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.9, 0.2), doorLeafMatRight);
    this.doorRight.position.set(0.6, 1.45, 5.8);

    // 門上凹槽 (星芒槽與花朵槽)
    const socketMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    this.socketStar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 8), socketMat);
    this.socketStar.rotation.x = Math.PI / 2;
    this.socketStar.position.set(-0.35, 1.6, 5.7);

    this.socketFlower = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 8), socketMat);
    this.socketFlower.rotation.x = Math.PI / 2;
    this.socketFlower.position.set(0.35, 1.6, 5.7);

    this.doorGroup.add(this.doorLeft, this.doorRight, this.socketStar, this.socketFlower);
    this.doorGroup.userData = { id: 'door', name: '遠古石門', hint: '需要星芒石與蒼月花石 (DOOR, OPEN)' };
    container.add(this.doorGroup);
    this.interactables.push(this.doorGroup);
  }

  // 建造門外的陽光蒼月花田 (芙莉蓮的寧靜花田風景)
  buildOutsideMeadow(parentGroup) {
    const container = parentGroup || this.activeZoneGroup || this.scene;
    this.meadowGroup = new THREE.Group();

    // 廣袤綠意草地
    const meadowGeo = new THREE.PlaneGeometry(30, 30);
    const meadowMat = new THREE.MeshStandardMaterial({ color: 0x68a357, roughness: 0.9 });
    const meadow = new THREE.Mesh(meadowGeo, meadowMat);
    meadow.rotation.x = -Math.PI / 2;
    meadow.position.set(0, -0.05, 18);
    this.meadowGroup.add(meadow);

    // 盛開的蒼月藍花與朝陽黃花 (數百朵低多邊形花朵)
    const flowerColors = [0x4da6ff, 0x3385ff, 0xffd13b, 0xffffff];
    for (let i = 0; i < 220; i++) {
      const col = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      const petalGeo = new THREE.SphereGeometry(0.1, 5, 5);
      const petalMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.5 });
      const fMesh = new THREE.Mesh(petalGeo, petalMat);

      const fx = (Math.random() - 0.5) * 20;
      const fz = 7 + Math.random() * 18;
      fMesh.position.set(fx, 0.1, fz);
      this.meadowGroup.add(fMesh);
    }

    // 1. 蜿蜒石板步道 (由石門一路通往遠方林道)
    const stepStoneMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85 });
    for (let sz = 6.0; sz <= 13.5; sz += 0.85) {
      const step = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.06, 8), stepStoneMat);
      step.position.set(Math.sin((sz - 6) * 0.7) * 0.35, 0.02, sz);
      step.receiveShadow = true;
      this.meadowGroup.add(step);
    }

    // 2. 邊境木質路標與通往市集傳送石門 (🌸 前往陽光微風市集)
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const postMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.2, 8), woodMat);
    postMesh.position.set(1.1, 1.1, 12.0);
    this.meadowGroup.add(postMesh);

    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.08), woodMat);
    signBoard.position.set(1.1, 1.9, 12.0);
    signBoard.rotation.y = -0.2;
    this.meadowGroup.add(signBoard);

    // 兩側迎賓古石柱
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85 });
    [-1.8, 1.8].forEach(px => {
      const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 3.2, 8), pillarMat);
      pil.position.set(px, 1.6, 13.0);
      this.meadowGroup.add(pil);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.8), pillarMat);
      cap.position.set(px, 3.3, 13.0);
      this.meadowGroup.add(cap);
    });

    // 陽光林道微光光幕
    const auraMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const aura = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.0), auraMat);
    aura.position.set(0, 1.5, 13.0);
    this.meadowGroup.add(aura);

    // 互動點與傳送門 Hitbox
    const portalHitBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.5, 2.0), new THREE.MeshBasicMaterial({ visible: false }));
    portalHitBox.position.set(0, 1.6, 12.5);
    portalHitBox.userData = {
      id: 'exit_portal_zone1',
      name: '🌸 陽光花海古徑',
      hint: '通往下一關【陽光微風市集】(點擊前往)',
      onClick: () => {
        if (this.zoneManager) {
          this.showToast('🚀 踏上陽光花海古徑，前往陽光微風市集！');
          this.switchZone('zone2');
        }
      }
    };
    this.meadowGroup.add(portalHitBox);
    this.interactables.push(portalHitBox);

    // 花田上方陽光直射點光源
    this.meadowSun = new THREE.PointLight(0xfffae0, 2.0, 30);
    this.meadowSun.position.set(0, 5, 12);
    this.meadowGroup.add(this.meadowSun);

    container.add(this.meadowGroup);
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let pointerDownPos = { x: 0, y: 0 };
    let pointerDownTime = 0;

    window.addEventListener('pointerdown', (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      pointerDownTime = Date.now();
    });

    // 點擊 3D 畫面觸發互動 (只在短促點擊 Tap/Click 且不是滑動轉視角時觸發)
    window.addEventListener('pointerup', (e) => {
      // 避免點擊任何 UI、彈窗或觸控按鈕時誤觸 3D 空間互動
      if (e.target.closest('#speechModal') ||
          e.target.closest('#guardianTrialModal') ||
          e.target.closest('#worldMapModal') ||
          e.target.closest('#passportModal') ||
          e.target.closest('#studentModal') ||
          e.target.closest('#leaderboardModal') ||
          e.target.closest('#cloudConfigModal') ||
          e.target.closest('#guideModal') ||
          e.target.closest('#victoryModal') ||
          e.target.closest('#systemDrawer') ||
          e.target.closest('.system-drawer-backdrop') ||
          e.target.closest('#hudBar') ||
          e.target.closest('#touchControlsLayer') ||
          e.target.closest('#inventoryContainer') ||
          e.target.closest('#toastNotice')) {
        return;
      }

      // 若畫面上已有任何彈窗開啟，絕不觸發背景 3D 物件互動
      if (this.isAnyModalOpen()) return;

      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      const elapsed = Date.now() - pointerDownTime;

      // 若滑動距離大於 12px 或按壓超過 300ms，判定為轉動視角/滑動螢幕，絕不觸發互動
      if (dist > 12 || elapsed > 300) return;

      if (this.hoveredObject) {
        this.triggerInteraction(this.hoveredObject);
      }
    });

    // 鍵盤快速鍵與彈窗控制
    window.addEventListener('keydown', (e) => {
      // 按 H 鍵快速開啟/關閉聽力尋寶任務
      if ((e.code === 'KeyH' || e.key === 'h' || e.key === 'H') && !e.repeat) {
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
          return;
        }
        const huntModal = document.getElementById('scavengerHuntModal');
        if (huntModal && huntModal.style.display === 'flex') {
          if (typeof window.closeScavengerModal === 'function') window.closeScavengerModal();
        } else if (!this.isAnyModalOpen()) {
          if (typeof window.openScavengerModal === 'function') window.openScavengerModal();
        }
      }

      if (e.code === 'Escape') {
        this.closeSpeechCard();
        const guideModal = document.getElementById('guideModal');
        if (guideModal && guideModal.style.display === 'flex') {
          guideModal.style.display = 'none';
        }
        if (typeof window.closeGuardianTrialModal === 'function') {
          window.closeGuardianTrialModal();
        }
        const mapModal = document.getElementById('worldMapModal');
        if (mapModal && mapModal.style.display === 'flex') {
          mapModal.style.display = 'none';
        }
        const scavengerModal = document.getElementById('scavengerHuntModal');
        if (scavengerModal && scavengerModal.style.display === 'flex') {
          if (typeof window.closeScavengerModal === 'function') window.closeScavengerModal();
        }
        const scavengerVictModal = document.getElementById('scavengerVictoryModal');
        if (scavengerVictModal && scavengerVictModal.style.display === 'flex') {
          if (typeof window.closeScavengerVictory === 'function') window.closeScavengerVictory();
        }
      }
    });

    // 吐司通知點擊直接關閉
    const toast = document.getElementById('toastNotice');
    if (toast) {
      toast.addEventListener('click', () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 20px)';
      });
    }
  }

  // 精準空間碰撞偵測：判定位置 (x, z) 是否與外邊界、實體建築、圍牆、火車與障礙物衝突
  isPositionBlocked(x, z, radius = 0.45) {
    // 1. 空間外邊界檢查
    const bounds = (this.zoneManager && typeof this.zoneManager.getZoneBounds === 'function')
      ? this.zoneManager.getZoneBounds()
      : { minX: -5.4, maxX: 5.4, minZ: -5.4, maxZ: (this.gameState && this.gameState.doorOpened ? 20.0 : 5.2) };

    // Zone 1 見習書齋密室特殊邊界：若石門開啟並走向花田 (z > 5.2)
    if ((!this.zoneManager || this.zoneManager.currentZoneId === 'zone1') && z > 5.2) {
      if (x - radius < -4.5 || x + radius > 4.5 || z + radius > bounds.maxZ) {
        return true;
      }
    } else {
      if (x - radius < bounds.minX || x + radius > bounds.maxX ||
          z - radius < bounds.minZ || z + radius > bounds.maxZ) {
        return true;
      }
    }

    // 2. 空間障礙物碰撞體檢查 (Box AABB 與 Circle 圓柱實體)
    const colliders = (this.zoneManager && typeof this.zoneManager.getColliders === 'function')
      ? this.zoneManager.getColliders()
      : [];

    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      if (c.type === 'box') {
        if (x + radius > c.minX && x - radius < c.maxX &&
            z + radius > c.minZ && z - radius < c.maxZ) {
          return true;
        }
      } else if (c.type === 'circle') {
        const dx = x - c.x;
        const dz = z - c.z;
        const minDist = c.radius + radius;
        if (dx * dx + dz * dz < minDist * minDist) {
          return true;
        }
      }
    }

    return false;
  }

  // 檢查畫面上是否有任何全螢幕或對話彈窗開啟中
  isAnyModalOpen() {
    const modalIds = [
      'speechModal',
      'guardianTrialModal',
      'worldMapModal',
      'magicPassportModal',
      'passportModal',
      'studentLoginModal',
      'studentModal',
      'leaderboardModal',
      'cloudConfigModal',
      'guideModal',
      'victoryModal',
      'scavengerHuntModal',
      'scavengerVictoryModal'
    ];
    for (let i = 0; i < modalIds.length; i++) {
      const el = document.getElementById(modalIds[i]);
      if (el && el.style.display && el.style.display !== 'none') {
        return true;
      }
    }
    const drawer = document.getElementById('systemDrawer');
    if (drawer && drawer.classList.contains('open')) return true;
    return false;
  }

  // 推進第一人稱移動與實體障礙物碰撞 (支援平滑滑牆 Smooth Wall-Sliding，徹底防止穿牆穿火車)
  updatePlayer(delta) {
    // 彈窗開啟時暫停視角旋轉與走動，防止誤觸
    if (this.isAnyModalOpen()) {
      if (window.touchControls) {
        window.touchControls.consumeInteract();
        window.touchControls.getLookDelta();
      }
      return;
    }

    if (window.touchControls) {
      window.touchControls.update();

      // 視角旋轉
      const look = window.touchControls.getLookDelta();
      this.player.yaw += look.yaw;
      this.player.pitch += look.pitch;
      // 限制抬頭俯角
      this.player.pitch = Math.max(-1.3, Math.min(1.3, this.player.pitch));

      this.camera.rotation.set(0, 0, 0);
      this.camera.rotation.order = 'YXZ';
      this.camera.rotation.y = this.player.yaw;
      this.camera.rotation.x = this.player.pitch;

      // 移動
      const move = window.touchControls.moveVector;
      if (move.forward !== 0 || move.right !== 0) {
        const forwardDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.yaw);
        const rightDir = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.yaw);

        const moveStep = new THREE.Vector3()
          .addScaledVector(forwardDir, move.forward * this.player.speed * delta)
          .addScaledVector(rightDir, move.right * this.player.speed * delta);

        const currentX = this.player.pos.x;
        const currentZ = this.player.pos.z;
        const targetX = currentX + moveStep.x;
        const targetZ = currentZ + moveStep.z;
        const radius = this.player.radius || 0.45;

        let newX = currentX;
        let newZ = currentZ;

        // 1. 若全向移動不受阻，直接前進
        if (!this.isPositionBlocked(targetX, targetZ, radius)) {
          newX = targetX;
          newZ = targetZ;
        } else {
          // 2. 遭遇固體障礙物阻擋：進行獨立軸向滑行計算 (Smooth Wall-Sliding)
          if (!this.isPositionBlocked(targetX, currentZ, radius)) {
            newX = targetX;
          }
          if (!this.isPositionBlocked(currentX, targetZ, radius)) {
            newZ = targetZ;
          }
        }

        this.player.pos.x = newX;
        this.player.pos.z = newZ;

        // 走入花田檢查 (僅在 Zone 1 見習書齋密室通關時觸發)
        if ((!this.zoneManager || this.zoneManager.currentZoneId === 'zone1') && this.player.pos.z > 8.0 && !this.gameState.escaped) {
          this.triggerEscapeCelebration();
        }
      }

      this.camera.position.copy(this.player.pos);

      // 檢查互動鍵 (E、手機互動鈕 或 滑鼠點擊)
      if (window.touchControls.consumeInteract()) {
        let target = this.hoveredObject;
        if (!target) {
          target = this.findNearbyInteractable(3.8);
        }
        if (target) {
          this.triggerInteraction(target);
        } else {
          this.showToast('請靠近並對準魔法物件再按下互動鍵！');
        }
      }
    }
  }

  // 尋找玩家身邊最近的可互動目標 (半徑容錯輔助，防止準心微偏時按 E 或點擊沒反應)
  findNearbyInteractable(maxDist = 3.8) {
    if (!this.interactables || this.interactables.length === 0) return null;
    let closest = null;
    let minDist = maxDist;
    const playerPos = this.player.pos;
    const tempVec = new THREE.Vector3();

    for (let i = 0; i < this.interactables.length; i++) {
      const obj = this.interactables[i];
      if (!obj || !obj.userData || !obj.userData.id) continue;
      obj.getWorldPosition(tempVec);
      const dist = Math.hypot(tempVec.x - playerPos.x, tempVec.z - playerPos.z);
      if (dist < minDist) {
        minDist = dist;
        closest = obj;
      }
    }
    return closest;
  }

  // 射線偵測滑鼠/螢幕正中心的物件
  updateRaycast() {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactables, true);

    const tooltip = document.getElementById('interactPrompt');
    const crosshair = document.getElementById('crosshair');

    if (intersects.length > 0 && intersects[0].distance < 4.5) {
      let root = intersects[0].object;
      while (root.parent && !root.userData.id && root !== this.scene) {
        root = root.parent;
      }

      if (root.userData && root.userData.id) {
        this.hoveredObject = root;
        if (tooltip) {
          tooltip.style.display = 'block';
          const title = root.userData.name || root.userData.label || '謎之物件';
          const hint = root.userData.hint ? ` • ${root.userData.hint}` : '';
          tooltip.textContent = `[ 點擊 / 互動 ] ${title}${hint}`;
        }
        if (crosshair) crosshair.classList.add('focused');
        return;
      }
    }

    this.hoveredObject = null;
    if (tooltip) tooltip.style.display = 'none';
    if (crosshair) crosshair.classList.remove('focused');
  }

  // 觸發解謎口說練習互動
  triggerInteraction(target) {
    if (!target || !target.userData) return;

    // 若畫面上已有任何彈窗或對話介面，絕不觸發背景 3D 物件互動
    if (this.isAnyModalOpen()) return;

    if (window.audioManager) window.audioManager.playSfx('interact');

    // 若尋寶任務進行中，優先判定是否命中尋寶目標
    if (this.scavengerHunt && this.scavengerHunt.isQuestActive()) {
      const q = this.scavengerHunt.currentQuest;
      const targetId = (target.userData.id || '').toLowerCase();
      const targetLabel = (target.userData.label || target.userData.name || '').toUpperCase();
      const qWord = q.targetWord.toUpperCase();
      const zone1Map = { 'candle': 'LIGHT', 'book': 'BOOK', 'key': 'KEY', 'drawer': 'RED', 'alchemy': 'BLUE', 'cat': 'CAT', 'mimic': 'CAT', 'door': 'OPEN' };
      const resolvedWord = zone1Map[targetId] || targetId.toUpperCase();
      if (resolvedWord === qWord || targetLabel.includes(qWord) || targetId.includes(qWord.toLowerCase())) {
        this.scavengerHunt.handleQuestSuccess();
        return;
      }
    }

    // 支援通用空間物件自訂點擊回呼 (Zone 2~9 POIs & Portals)
    if (typeof target.userData.onClick === 'function') {
      target.userData.onClick();
      return;
    }

    const id = target.userData.id;

    switch (id) {
      case 'candle':
        if (!this.gameState.candleLit) {
          this.openSpeechCard('LIGHT', () => {
            this.gameState.candleLit = true;
            this.candleFlame.material.opacity = 1;
            this.candleLight.intensity = 1.8;
            this.addXP(50);
            this.showToast('✨ 燭台點亮了！溫暖的光芒照耀著書桌角落。');
          });
        } else {
          this.showToast('燭台正散發著柔和溫暖的金光。');
        }
        break;

      case 'book':
        if (!this.gameState.candleLit) {
          this.showToast('周圍太暗了，請先點燃旁邊的燭台 (LIGHT)！');
          return;
        }
        if (!this.gameState.bookOpened) {
          this.openSpeechCard('BOOK', () => {
            this.gameState.bookOpened = true;
            this.keyMesh.visible = true;
            this.addXP(50);
            this.showToast('📖 魔導書翻開了！裡面夾著一把黃銅鑰匙 (KEY)！');
            setTimeout(() => {
              this.openSpeechCard('KEY', () => {
                this.gameState.hasKey = true;
                this.keyMesh.visible = false;
                this.addInventory('KEY', '🔑 黃銅鑰匙', '#ecc94b');
                this.addXP(50);
                this.showToast('🔑 獲得道具：黃銅鑰匙！可用來打開書桌抽屜。');
              });
            }, 500);
          });
        } else if (!this.gameState.hasKey && !this.gameState.inventory.some(i => i.id === 'KEY')) {
          this.openSpeechCard('KEY', () => {
            this.gameState.hasKey = true;
            this.keyMesh.visible = false;
            this.addInventory('KEY', '🔑 黃銅鑰匙', '#ecc94b');
            this.addXP(50);
            this.showToast('🔑 獲得道具：黃銅鑰匙！可用來打開書桌抽屜。');
          });
        } else {
          this.showToast('魔導書記載著古老的真名魔法。');
        }
        break;

      case 'drawer':
        const hasKeyInBag = this.gameState.hasKey || this.gameState.inventory.some(i => i.id === 'KEY');
        if (!hasKeyInBag) {
          this.showToast('抽屜緊緊鎖著，需要黃銅鑰匙 (KEY) 才能開啟！');
          return;
        }
        if (!this.gameState.drawerOpened) {
          this.gameState.drawerOpened = true;
          this.animators.push({
            update: (dt) => {
              if (this.drawerMesh.position.z < -3.3) {
                this.drawerMesh.position.z += 1.2 * dt;
                return true;
              }
              return false;
            }
          });
          this.showToast('🔓 抽屜打開了！發現了一瓶深紅色魔藥 (RED)！');
          setTimeout(() => {
            this.openSpeechCard('RED', () => {
              this.gameState.hasRedPotion = true;
              this.addInventory('RED', '🧪 火紅魔藥', '#fc8181');
              this.addXP(50);
              this.showToast('獲得火紅魔藥！去調劑台與水之魔藥融合吧。');
            });
          }, 400);
        } else if (!this.gameState.hasRedPotion && !this.gameState.inventory.some(i => i.id === 'RED')) {
          this.openSpeechCard('RED', () => {
            this.gameState.hasRedPotion = true;
            this.addInventory('RED', '🧪 火紅魔藥', '#fc8181');
            this.addXP(50);
            this.showToast('獲得火紅魔藥！去調劑台與水之魔藥融合吧。');
          });
        } else {
          this.showToast('抽屜裡已經空了。');
        }
        break;

      case 'alchemy':
        const hasRedInBag = this.gameState.hasRedPotion || this.gameState.inventory.some(i => i.id === 'RED');
        if (!hasRedInBag) {
          this.showToast('調劑台上需要火紅魔藥 (RED) 作為反應基底。');
          return;
        }
        if (!this.gameState.alchemyMixed) {
          const hasBlue = this.gameState.hasBluePotion || this.gameState.inventory.some(i => i.id === 'BLUE');
          if (!hasBlue) {
            this.openSpeechCard('BLUE', () => {
              this.gameState.hasBluePotion = true;
              this.addInventory('BLUE', '💧 蒼藍之水', '#63b3ed');
              if (window.audioManager) window.audioManager.playSfx('potionMix');
              this.flaskLiquid.material.color.setHex(0x9955ff); // 變紫魔力混合

              setTimeout(() => {
                this.openSpeechCard('STAR', () => {
                  this.gameState.alchemyMixed = true;
                  this.gameState.hasStarStone = true;
                  this.gameState.hasFish = true; // 關鍵修復：確保 hasFish 為 true
                  this.starStone.visible = true;
                  this.addInventory('STAR', '⭐ 星芒之石', '#f6e05e');
                  this.addInventory('FISH', '🐟 魔法小魚乾', '#4fd1c5');
                  this.addXP(70);
                  this.showToast('⭐ 成功調配出星芒之石，並在底座發現了小魚乾 (FISH)！');
                });
              }, 500);
            });
          } else {
            this.openSpeechCard('STAR', () => {
              this.gameState.alchemyMixed = true;
              this.gameState.hasStarStone = true;
              this.gameState.hasFish = true; // 關鍵修復：確保 hasFish 為 true
              this.starStone.visible = true;
              this.addInventory('STAR', '⭐ 星芒之石', '#f6e05e');
              this.addInventory('FISH', '🐟 魔法小魚乾', '#4fd1c5');
              this.addXP(70);
              this.showToast('⭐ 成功調配出星芒之石，並在底座發現了小魚乾 (FISH)！');
            });
          }
        } else {
          this.showToast('煉金調劑台散發著淡紫色的星芒魔力。');
        }
        break;

      case 'mimic':
        const hasFishInBag = this.gameState.hasFish || this.gameState.inventory.some(i => i.id === 'FISH');

        if (!this.gameState.mimicFed) {
          if (!this.gameState.catPracticed) {
            // 第一次互動：先練習認識貓咪寶箱怪 (CAT)
            this.openSpeechCard('CAT', () => {
              this.gameState.catPracticed = true;
              if (hasFishInBag) {
                this.showToast('😺 寶箱怪肚子咕嚕嚕叫，聞到你身上的小魚乾了！');
                setTimeout(() => {
                  this.openSpeechCard('FISH', () => {
                    this.feedMimicSuccess();
                  });
                }, 500);
              } else {
                this.showToast('😺 寶箱怪肚子咕嚕嚕叫，牠想吃香噴噴的小魚乾 (FISH)！快去煉金台調配魔藥！');
              }
            });
          } else {
            // 已經練習過 CAT：若有魚乾直接餵食，若沒有則提示
            if (hasFishInBag) {
              this.openSpeechCard('FISH', () => {
                this.feedMimicSuccess();
              });
            } else {
              this.showToast('😺 寶箱怪正眼巴巴地等著小魚乾，快去煉金台調配魔藥獲取小魚乾吧！');
            }
          }
        } else {
          this.showToast('😺 貓咪寶箱怪吃得飽飽的，正在心滿意足地打呼嚕：Purr, purr...');
        }
        break;

      case 'door':
        const hasStarInBag = this.gameState.hasStarStone || this.gameState.inventory.some(i => i.id === 'STAR');
        const hasFlowerInBag = this.gameState.hasFlowerStone || this.gameState.inventory.some(i => i.id === 'FLOWER');

        if (!hasStarInBag || !hasFlowerInBag) {
          if (!hasStarInBag && !hasFlowerInBag) {
            this.showToast('石門的大鎖需要「星芒之石 (STAR)」與「蒼月花石刻 (FLOWER)」！');
          } else if (!hasStarInBag) {
            this.showToast('石門左側凹槽缺少「星芒之石 (STAR)」！去煉金台調配吧！');
          } else {
            this.showToast('石門右側凹槽缺少「蒼月花石刻 (FLOWER)」！去餵飽貓咪寶箱怪吧！');
          }
          return;
        }

        if (!this.gameState.doorOpened) {
          if (!this.gameState.doorStonePlaced) {
            this.openSpeechCard('DOOR', () => {
              this.gameState.doorStonePlaced = true;
              this.socketStar.material.color.setHex(0xffe600);
              this.socketFlower.material.color.setHex(0x4da6ff);
              this.showToast('🗝️ 兩顆魔法石完美契入！請詠唱最後的開門咒語 (OPEN)！');

              setTimeout(() => {
                this.openSpeechCard('OPEN', () => {
                  this.openStoneDoorSuccess();
                });
              }, 500);
            });
          } else {
            this.openSpeechCard('OPEN', () => {
              this.openStoneDoorSuccess();
            });
          }
        } else {
          this.showToast('石門已敞開，走進花田迎接陽光吧！');
        }
        break;
    }
  }

  feedMimicSuccess() {
    this.gameState.mimicFed = true;
    this.gameState.hasFlowerStone = true;
    this.flowerStone.visible = true;
    this.mimicLid.rotation.x = -Math.PI / 3;
    this.addInventory('FLOWER', '🌸 蒼月花石刻', '#63b3ed');
    this.addXP(80);
    this.showToast('🌸 貓咪寶箱怪吃飽飽，開心地吐出了蒼月花石刻 (FLOWER)！');
  }

  openStoneDoorSuccess() {
    this.gameState.doorOpened = true;
    if (window.audioManager) window.audioManager.playSfx('doorOpen');
    this.animators.push({
      update: (dt) => {
        let stillMoving = false;
        if (this.doorLeft.position.x > -1.7) {
          this.doorLeft.position.x -= 0.8 * dt;
          stillMoving = true;
        }
        if (this.doorRight.position.x < 1.7) {
          this.doorRight.position.x += 0.8 * dt;
          stillMoving = true;
        }
        return stillMoving;
      }
    });
    this.addXP(100);
    this.showToast('🚪 遠古石門敞開了！微風與花香飄進來，快走到花田迎接朝陽！');
  }

  // 開啟單字練習對話視窗
  openSpeechCard(wordKey, onComplete) {
    const modal = document.getElementById('speechModal');
    let data = VOCAB_DATA[wordKey];

    // 查詢 706 校本英語護照庫，取得音節拆解 Chunks 與情境例句
    let passportWord = null;
    if (window.PassportBankHelper) {
      passportWord = window.PassportBankHelper.findByWord(wordKey);
    }

    // 若非固定核心詞，從 706 護照庫動態合成單字卡資料
    if (!data && passportWord) {
      data = {
        word: passportWord.word,
        phonics: `${passportWord.phonetic || ''} • ${passportWord.word.split('').join('-')}`,
        zh: passportWord.zh || passportWord.chinese || '',
        category: passportWord.topic || '新港英語冒險',
        mascot: 'foxy',
        mascotName: '精靈導師 Foxy',
        mascotImg: 'assets/textures/fox-guide.png',
        dialogue: passportWord.sentence ? `“${passportWord.sentence}”` : `“Let's practice saying '${passportWord.word}' together!”`,
        dialogueZh: passportWord.sentenceZh ? `「${passportWord.sentenceZh}」` : `「讓我們一起練習 ${passportWord.zh || passportWord.chinese || ''} 的英語發音吧！」`,
        prompt: `請看著互動目標，大聲唸出：${passportWord.word}！`,
        puzzleHint: `練習空間魔法詞彙：${passportWord.zh || passportWord.chinese || ''}`,
        matchKeywords: [passportWord.word.toLowerCase()],
        xp: 60,
        color: '#38bdf8'
      };
    } else if (!data) {
      data = {
        word: wordKey,
        phonics: `• ${wordKey.split('').join('-')}`,
        zh: '',
        category: '英語冒險',
        mascot: 'foxy',
        mascotName: '精靈導師 Foxy',
        mascotImg: 'assets/textures/fox-guide.png',
        dialogue: `“Let's practice the magic word: ${wordKey}!”`,
        dialogueZh: `「讓我們一起練習魔法單字：${wordKey}！」`,
        prompt: `請大聲唸出：${wordKey}！`,
        puzzleHint: `練習單字：${wordKey}`,
        matchKeywords: [wordKey.toLowerCase()],
        xp: 50,
        color: '#38bdf8'
      };
    }

    if (!modal) return;

    // 填入吉祥物與單字資料
    document.getElementById('modalMascotImg').src = data.mascotImg;
    document.getElementById('modalMascotName').textContent = data.mascotName;
    document.getElementById('modalWord').textContent = data.word;
    document.getElementById('modalPhonics').textContent = data.phonics;
    document.getElementById('modalZh').textContent = data.zh;
    document.getElementById('modalDialogue').textContent = data.dialogue;
    document.getElementById('modalDialogueZh').textContent = data.dialogueZh;
    document.getElementById('modalPrompt').textContent = data.prompt;

    // 渲染音節按鈕 (Chunks Syllables)
    const chunksContainer = document.getElementById('modalChunksContainer');
    if (chunksContainer) {
      chunksContainer.innerHTML = '';
      const chunks = (passportWord && passportWord.chunks && passportWord.chunks.length > 0)
        ? passportWord.chunks
        : [data.word];

      chunks.forEach(chunk => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chunk-btn';
        btn.textContent = chunk;
        btn.title = `點擊聆聽 [ ${chunk} ] 發音`;
        btn.onclick = (e) => {
          e.stopPropagation();
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(chunk);
            u.lang = 'en-US';
            u.rate = 0.85;
            window.speechSynthesis.speak(u);
          }
          if (window.audioManager) window.audioManager.playSfx('click');
        };
        chunksContainer.appendChild(btn);
      });
    }

    // 渲染情境雙語例句
    const sentenceBox = document.getElementById('modalSentenceBox');
    const sentenceEn = document.getElementById('modalSentenceEn');
    const sentenceZh = document.getElementById('modalSentenceZh');
    if (sentenceBox && sentenceEn && sentenceZh) {
      if (passportWord && passportWord.sentence) {
        sentenceEn.textContent = `💬 "${passportWord.sentence}"`;
        sentenceZh.textContent = passportWord.sentenceZh || '';
        sentenceBox.style.display = 'block';
      } else {
        sentenceBox.style.display = 'none';
      }
    }

    modal.style.display = 'flex';

    // 每次開啟單字卡時，重置錄音狀態與按鈕外觀
    if (window.speechManager) {
      window.speechManager.stopListening();
    }
    const micBtn = document.getElementById('micButton');
    if (micBtn) {
      micBtn.className = 'btn-mic';
      micBtn.style.background = '';
      micBtn.innerHTML = '<span>🎙️ 按下開始口說挑戰 (Speak)</span>';
    }
    const statusBox = document.getElementById('speechStatus');
    if (statusBox) {
      statusBox.textContent = '點擊上方「開始口說挑戰」，靠近麥克風唸出單字！';
      statusBox.className = 'speech-status';
    }

    // 自動播放一次外師發音
    if (window.speechManager) {
      window.speechManager.playWordVoice(wordKey);
    }

    // 綁定發音按鈕
    const voiceBtn = document.getElementById('playVoiceBtn');
    voiceBtn.onclick = (e) => {
      if (e) e.stopPropagation();
      if (window.speechManager) window.speechManager.playWordVoice(wordKey);
    };

    // 綁定麥克風口說辨識
    micBtn.onclick = (e) => {
      if (e) e.stopPropagation();
      if (window.speechManager) {
        window.speechManager.startListening(wordKey, (success) => {
          if (success) {
            modal.style.display = 'none';
            if (window.cloudSyncManager) {
              window.cloudSyncManager.recordWordPass(wordKey, data.xp || 50, false);
            }
            this.showToast(`📘 英語護照已蓋上簽證印章：【${wordKey}】！`);
            if (onComplete) onComplete();
            if (this.zoneManager && this.zoneManager.checkZoneCompletionStatus) {
              this.zoneManager.checkZoneCompletionStatus();
            }
          }
        });
      }
    };

    // 綁定教師/備用過關按鈕 (免於雜音卡關)
    const passBtn = document.getElementById('teacherPassBtn');
    passBtn.onclick = (e) => {
      if (e) e.stopPropagation();
      if (window.speechManager) {
        window.speechManager.forcePass();
        if (window.cloudSyncManager) {
          window.cloudSyncManager.recordWordPass(wordKey, data.xp || 50, true);
        }
        this.showToast(`✨ 教師驗證通過：已認證【${wordKey}】！`);
        setTimeout(() => {
          modal.style.display = 'none';
          if (onComplete) onComplete();
          if (this.zoneManager && this.zoneManager.checkZoneCompletionStatus) {
            this.zoneManager.checkZoneCompletionStatus();
          }
        }, 300);
      }
    };
  }

  closeSpeechCard() {
    const modal = document.getElementById('speechModal');
    if (modal) modal.style.display = 'none';
    if (window.speechManager) {
      window.speechManager.stopListening();
    }
    if (window.audioManager) {
      window.audioManager.playSfx('click');
    }
  }

  // 開啟關卡主英語問句三重試煉
  openGuardianTrial(zoneId) {
    if (typeof window.startGuardianTrial === 'function') {
      window.startGuardianTrial(zoneId);
    } else {
      this.showToast('⚓ 關卡主英語問句試煉系統已就緒！');
    }
  }

  // 初始化雲端身分與排行榜同步監聽
  initCloudSync() {
    if (window.cloudSyncManager) {
      if (window.cloudSyncManager.profile) {
        this.gameState.xp = window.cloudSyncManager.profile.xp;
        this.gameState.level = window.cloudSyncManager.profile.level;
        this.updateHUDFromProfile(window.cloudSyncManager.profile);
      }

      window.cloudSyncManager.onProfileUpdated((profile) => {
        this.gameState.xp = profile.xp;
        this.gameState.level = profile.level;
        this.updateHUDFromProfile(profile);
      });
      window.cloudSyncManager.updateCloudStatusIndicator();
    }
  }

  updateHUDFromProfile(profile) {
    if (!profile) return;
    const xpLabel = document.getElementById('hudXpLabel');
    const xpFill = document.getElementById('hudXpFill');
    const levelLabel = document.getElementById('hudLevelLabel');
    const studentLabel = document.getElementById('studentProfileBtnLabel');

    if (xpLabel) xpLabel.textContent = `${profile.xp} XP`;
    if (levelLabel) levelLabel.textContent = `Lv.${profile.level} 魔法使`;
    if (xpFill) {
      const pct = Math.min(100, (profile.xp % 100));
      xpFill.style.width = `${pct}%`;
    }
    if (studentLabel) {
      if (profile.isGuest) {
        studentLabel.textContent = `見習使 (點此登入)`;
      } else {
        studentLabel.textContent = `${profile.classId}班 ${profile.seatNo}號 ${profile.name}`;
      }
    }
  }

  // 走入花田迎接朝陽 (SUN 通關慶典)
  triggerEscapeCelebration() {
    this.gameState.escaped = true;
    this.openSpeechCard('SUN', () => {
      this.addXP(100);
      if (window.audioManager) window.audioManager.playSfx('magicSuccess');

      // 彈出大勝利結算卡
      const victoryModal = document.getElementById('victoryModal');
      if (victoryModal) {
        document.getElementById('finalScoreText').textContent = `冒險成就：${this.gameState.xp} XP • 等級 ${this.gameState.level} 一級大魔法使`;
        victoryModal.style.display = 'flex';
      }
    });
  }

  addInventory(id, name, color) {
    this.gameState.inventory.push({ id, name, color });
    const invContainer = document.getElementById('inventoryList');
    if (!invContainer) return;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'inventory-item';
    itemDiv.style.borderColor = color;
    itemDiv.innerHTML = `<span>${name}</span>`;
    invContainer.appendChild(itemDiv);

    if (window.audioManager) window.audioManager.playSfx('pickup');
  }

  addXP(amount) {
    this.gameState.xp += amount;
    if (window.cloudSyncManager && typeof window.cloudSyncManager.calculateLevel === 'function') {
      this.gameState.level = window.cloudSyncManager.calculateLevel(this.gameState.xp);
    } else {
      this.gameState.level = Math.floor(this.gameState.xp / 100) + 1;
    }

    if (window.cloudSyncManager && window.cloudSyncManager.profile) {
      window.cloudSyncManager.profile.xp = this.gameState.xp;
      window.cloudSyncManager.profile.level = this.gameState.level;
      window.cloudSyncManager.notifyListeners();
    } else {
      const xpLabel = document.getElementById('hudXpLabel');
      const xpFill = document.getElementById('hudXpFill');
      const levelLabel = document.getElementById('hudLevelLabel');

      if (xpLabel) xpLabel.textContent = `${this.gameState.xp} XP`;
      if (levelLabel) levelLabel.textContent = `Lv.${this.gameState.level} 魔法使`;
      if (xpFill) {
        let nextLevelXp = 100 * Math.pow(this.gameState.level, 1.35);
        let curLevelBaseXp = this.gameState.level > 1 ? 100 * Math.pow(this.gameState.level - 1, 1.35) : 0;
        let range = Math.max(1, nextLevelXp - curLevelBaseXp);
        let pct = Math.min(100, Math.max(0, ((this.gameState.xp - curLevelBaseXp) / range) * 100));
        xpFill.style.width = `${pct}%`;
      }
    }
  }

  showToast(msg) {
    const toast = document.getElementById('toastNotice');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 20px)';
    }, 2200);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 更新動畫 (支援持續函數 anim(time, dt) 與單次物件 anim.update(dt))
    for (let i = this.animators.length - 1; i >= 0; i--) {
      const anim = this.animators[i];
      if (typeof anim === 'function') {
        anim(elapsedTime, delta);
      } else if (anim && typeof anim.update === 'function') {
        if (!anim.update(delta)) {
          this.animators.splice(i, 1);
        }
      }
    }

    // 漂浮魔導書與微光起伏
    if (this.bookGroup && !this.gameState.bookOpened) {
      this.bookGroup.position.y = 1.25 + Math.sin(elapsedTime * 2.0) * 0.05;
      this.bookGroup.rotation.y = 0.2 + Math.cos(elapsedTime * 1.5) * 0.04;
    }

    // 旋轉星芒之石
    if (this.starStone && this.starStone.visible) {
      this.starStone.rotation.y += delta * 1.2;
      this.starStone.rotation.x += delta * 0.8;
    }

    // 旋轉花之石
    if (this.flowerStone && this.flowerStone.visible) {
      this.flowerStone.rotation.y += delta * 1.2;
      this.flowerStone.rotation.z += delta * 0.6;
    }

    // 粒子緩慢漂浮
    if (this.dustParticles) {
      this.dustParticles.rotation.y = elapsedTime * 0.02;
    }

    this.updatePlayer(delta);
    this.updateRaycast();

    if (this.minimap) {
      this.minimap.update();
    }

    if (this.scavengerHunt) {
      this.scavengerHunt.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.world3D = new World3D();
});
