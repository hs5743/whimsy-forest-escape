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
      mimicFed: false,
      hasFlowerStone: false,
      doorSocketsFilled: false,
      doorOpened: false,
      escaped: false,
      inventory: [],
      xp: 0,
      level: 1
    };

    this.clock = new THREE.Clock();
    this.initScene();
    this.buildAtelierRoom();
    this.buildProps();
    this.buildOutsideMeadow();
    this.setupEvents();
    this.animate();
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
  buildAtelierRoom() {
    const roomGroup = new THREE.Group();

    // 1. 溫潤木地板
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xa27b5c,
      roughness: 0.6,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // 2. 天花板與橫樑
    const ceilingGeo = new THREE.PlaneGeometry(12, 12);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x5a4233, roughness: 0.8 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = 4.2;
    ceiling.rotation.x = Math.PI / 2;
    roomGroup.add(ceiling);

    // 木質橫樑
    for (let z = -4; z <= 4; z += 2.5) {
      const beamGeo = new THREE.BoxGeometry(12, 0.25, 0.35);
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x422d20, roughness: 0.7 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 4.05, z);
      roomGroup.add(beam);
    }

    // 3. 牆壁材質 (米黃石砌質感)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xddd3c4, roughness: 0.85 });

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
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x6e4e37, roughness: 0.5 });
    const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(3.9, 2.9, 0.2), frameMat);
    windowFrame.position.set(0, 1.5, -6);
    roomGroup.add(windowFrame);

    // 窗外風景立體背板 (童趣森林遠景)
    const bgGeo = new THREE.PlaneGeometry(16, 9);
    const textureLoader = new THREE.TextureLoader();
    const bgTex = textureLoader.load('assets/textures/bg-home-forest.png');
    const bgMat = new THREE.MeshBasicMaterial({ map: bgTex });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 3, -12);
    roomGroup.add(bgMesh);

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

    this.scene.add(roomGroup);
  }

  buildBookshelf(parent, x, y, z, rotY) {
    const shelfGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5a3e2a, roughness: 0.6 });

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
  buildProps() {
    // ==========================================
    // 1. 銅燭台 (Candle -> LIGHT)
    // ==========================================
    const candleGroup = new THREE.Group();
    const standMat = new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.6, roughness: 0.3 });

    // 小圓茶几
    const tableMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.85, 16), new THREE.MeshStandardMaterial({ color: 0x6e4e37 }));
    tableMesh.position.set(-3.2, 0.42, -3.5);
    this.scene.add(tableMesh);

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
    this.scene.add(candleGroup);
    this.interactables.push(candleGroup);

    // ==========================================
    // 2. 書桌與漂浮古書 (Desk & Floating Book -> BOOK & KEY)
    // ==========================================
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.2), new THREE.MeshStandardMaterial({ color: 0x7c5335 }));
    deskTop.position.set(0, 0.95, -3.8);
    deskTop.castShadow = true;
    deskGroup.add(deskTop);

    // 桌腳
    const legGeo = new THREE.BoxGeometry(0.12, 0.95, 0.12);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x543620 });
    [[-1.1, -3.3], [1.1, -3.3], [-1.1, -4.3], [1.1, -4.3]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 0.475, lz);
      deskGroup.add(leg);
    });

    // 抽屜組
    this.drawerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.9), new THREE.MeshStandardMaterial({ color: 0x5c3b24 }));
    this.drawerMesh.position.set(0.6, 0.8, -3.8);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), standMat);
    knob.position.set(0, 0, 0.47);
    this.drawerMesh.add(knob);
    deskGroup.add(this.drawerMesh);

    // 抽屜可互動
    this.drawerMesh.userData = { id: 'drawer', name: '上鎖的書桌抽屜', hint: '需要黃銅鑰匙 (KEY)' };
    this.interactables.push(this.drawerMesh);

    // 漂浮魔導書
    this.bookGroup = new THREE.Group();
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
    const bookMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.35), coverMat);
    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.32), new THREE.MeshStandardMaterial({ color: 0xfdf6e2 }));
    pages.position.set(0.01, 0, 0);
    this.bookGroup.add(bookMesh, pages);

    this.bookGroup.position.set(-0.5, 1.25, -3.8);
    this.bookGroup.rotation.y = 0.2;
    this.bookGroup.userData = { id: 'book', name: '漂浮魔導書', hint: '記載遠古智慧 (BOOK)' };
    this.scene.add(this.bookGroup);
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
    this.scene.add(this.keyMesh);

    this.scene.add(deskGroup);

    // ==========================================
    // 3. 元素煉金台 (Alchemy Table -> RED, BLUE, STAR)
    // ==========================================
    const alchemyGroup = new THREE.Group();
    const tableA = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.85, 1.0), new THREE.MeshStandardMaterial({ color: 0x4a3525 }));
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
    this.scene.add(this.starStone);

    alchemyGroup.userData = { id: 'alchemy', name: '元素煉金台', hint: '調配魔藥 (RED, BLUE)' };
    this.scene.add(alchemyGroup);
    this.interactables.push(alchemyGroup);

    // ==========================================
    // 4. 貓咪寶箱怪 (Cat Mimic -> CAT, FISH)
    // ==========================================
    this.mimicGroup = new THREE.Group();
    const chestBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.5), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.5 }));
    chestBody.position.y = 0.225;
    this.mimicGroup.add(chestBody);

    // 寶箱蓋
    this.mimicLid = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.7, 16, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0x6e3b15 }));
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
    this.scene.add(this.flowerStone);

    this.mimicGroup.position.set(4.5, 0, 2.5);
    this.mimicGroup.rotation.y = -Math.PI / 4;
    this.mimicGroup.userData = { id: 'mimic', name: '貓咪寶箱怪 Mimic', hint: '愛吃魚的貪睡小怪 (CAT, FISH)' };
    this.scene.add(this.mimicGroup);
    this.interactables.push(this.mimicGroup);

    // ==========================================
    // 5. 遠古石門 (Ancient Stone Door -> DOOR, OPEN)
    // ==========================================
    this.doorGroup = new THREE.Group();

    // 門框拱門
    const archMat = new THREE.MeshStandardMaterial({ color: 0x8a8479, roughness: 0.9 });
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 0.5), archMat);
    archTop.position.set(0, 3.1, 5.8);
    this.doorGroup.add(archTop);

    // 雙開石門扇 (Left & Right)
    const doorLeafMat = new THREE.MeshStandardMaterial({ color: 0x5a554d, roughness: 0.8 });
    this.doorLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.9, 0.2), doorLeafMat);
    this.doorLeft.position.set(-0.6, 1.45, 5.8);
    this.doorRight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.9, 0.2), doorLeafMat);
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
    this.scene.add(this.doorGroup);
    this.interactables.push(this.doorGroup);
  }

  // 建造門外的陽光蒼月花田 (芙莉蓮的寧靜花田風景)
  buildOutsideMeadow() {
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

    // 花田上方陽光直射點光源
    this.meadowSun = new THREE.PointLight(0xfffae0, 2.0, 30);
    this.meadowSun.position.set(0, 5, 12);
    this.meadowGroup.add(this.meadowSun);

    this.scene.add(this.meadowGroup);
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 點擊 3D 畫面觸發互動
    window.addEventListener('pointerup', (e) => {
      // 避免點擊UI時觸發
      if (e.target.closest('#uiLayer') || e.target.closest('#speechModal') || e.target.closest('.touch-button')) return;
      if (this.hoveredObject) {
        this.triggerInteraction(this.hoveredObject);
      }
    });
  }

  // 推進第一人稱移動與碰撞邊界
  updatePlayer(delta) {
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

        const nextPos = this.player.pos.clone().add(moveStep);

        // 房間碰撞邊界 (若門已開，允許往南走出花田)
        const minX = -5.4, maxX = 5.4;
        const minZ = -5.4;
        const maxZ = this.gameState.doorOpened ? 20.0 : 5.2;

        if (nextPos.x > minX && nextPos.x < maxX) {
          this.player.pos.x = nextPos.x;
        }
        if (nextPos.z > minZ && nextPos.z < maxZ) {
          this.player.pos.z = nextPos.z;
        }

        // 走入花田檢查 (通關 SUN)
        if (this.player.pos.z > 8.0 && !this.gameState.escaped) {
          this.triggerEscapeCelebration();
        }
      }

      this.camera.position.copy(this.player.pos);

      // 檢查互動鍵 (E 或 手機互動鈕)
      if (window.touchControls.consumeInteract() && this.hoveredObject) {
        this.triggerInteraction(this.hoveredObject);
      }
    }
  }

  // 射線偵測滑鼠/螢幕正中心的物件
  updateRaycast() {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactables, true);

    const tooltip = document.getElementById('interactPrompt');
    const crosshair = document.getElementById('crosshair');

    if (intersects.length > 0 && intersects[0].distance < 4.2) {
      let root = intersects[0].object;
      while (root.parent && !root.userData.id && root !== this.scene) {
        root = root.parent;
      }

      if (root.userData && root.userData.id) {
        this.hoveredObject = root;
        if (tooltip) {
          tooltip.style.display = 'block';
          tooltip.textContent = `[ 點擊 / 互動 ] ${root.userData.name} • ${root.userData.hint}`;
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
    const id = target.userData.id;
    if (window.audioManager) window.audioManager.playSfx('interact');

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
            // 接著練習 KEY
            setTimeout(() => {
              this.openSpeechCard('KEY', () => {
                this.gameState.hasKey = true;
                this.keyMesh.visible = false;
                this.addInventory('KEY', '🔑 黃銅鑰匙', '#ecc94b');
                this.addXP(50);
                this.showToast('🔑 獲得道具：黃銅鑰匙！可用來打開書桌抽屜。');
              });
            }, 600);
          });
        } else {
          this.showToast('魔導書記載著古老的真名魔法。');
        }
        break;

      case 'drawer':
        if (!this.gameState.hasKey) {
          this.showToast('抽屜緊緊鎖著，需要黃銅鑰匙 (KEY) 才能開啟！');
          return;
        }
        if (!this.gameState.drawerOpened) {
          this.gameState.drawerOpened = true;
          // 抽屜滑出動畫
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
        } else {
          this.showToast('抽屜裡已經空了。');
        }
        break;

      case 'alchemy':
        if (!this.gameState.hasRedPotion) {
          this.showToast('調劑台上需要火紅魔藥 (RED) 作為反應基底。');
          return;
        }
        if (!this.gameState.alchemyMixed) {
          this.openSpeechCard('BLUE', () => {
            this.gameState.hasBluePotion = true;
            if (window.audioManager) window.audioManager.playSfx('potionMix');
            this.flaskLiquid.material.color.setHex(0x9955ff); // 變紫魔力混合

            setTimeout(() => {
              this.openSpeechCard('STAR', () => {
                this.gameState.alchemyMixed = true;
                this.gameState.hasStarStone = true;
                this.starStone.visible = true;
                this.addInventory('STAR', '⭐ 星芒之石', '#f6e05e');
                this.addInventory('FISH', '🐟 魔法小魚乾', '#4fd1c5');
                this.addXP(70);
                this.showToast('⭐ 成功調配出星芒之石，並在底座發現了小魚乾 (FISH)！');
              });
            }, 600);
          });
        } else {
          this.showToast('煉金調劑台散發著淡紫色的星芒魔力。');
        }
        break;

      case 'mimic':
        if (!this.gameState.mimicFed) {
          this.openSpeechCard('CAT', () => {
            this.showToast('😺 貓咪寶箱怪伸了個懶腰，肚子咕嚕嚕叫，牠想吃美食 (FISH)！');
            if (this.gameState.hasFish) {
              setTimeout(() => {
                this.openSpeechCard('FISH', () => {
                  this.gameState.mimicFed = true;
                  this.gameState.hasFlowerStone = true;
                  this.flowerStone.visible = true;
                  // 寶箱大開動畫
                  this.mimicLid.rotation.x = -Math.PI / 3;
                  this.addInventory('FLOWER', '🌸 蒼月花石刻', '#63b3ed');
                  this.addXP(80);
                  this.showToast('🌸 貓咪寶箱怪吃得飽飽的，開心地吐出了蒼月花石刻！');
                });
              }, 600);
            } else {
              this.showToast('你身上沒有小魚乾，先去煉金台看看吧！');
            }
          });
        } else {
          this.showToast('貓咪寶箱怪正在心滿意足地打呼嚕：Purr, purr...');
        }
        break;

      case 'door':
        if (!this.gameState.hasStarStone || !this.gameState.hasFlowerStone) {
          this.showToast('石門的大鎖凹槽需要「星芒之石 (STAR)」與「蒼月花石刻 (FLOWER)」！');
          return;
        }
        if (!this.gameState.doorOpened) {
          this.openSpeechCard('DOOR', () => {
            this.socketStar.material.color.setHex(0xffe600);
            this.socketFlower.material.color.setHex(0x4da6ff);
            this.showToast('🗝️ 兩顆魔法石完美契入！請詠唱最後的開門咒語 (OPEN)！');

            setTimeout(() => {
              this.openSpeechCard('OPEN', () => {
                this.gameState.doorOpened = true;
                if (window.audioManager) window.audioManager.playSfx('doorOpen');
                // 石門開啟滑動動畫
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
              });
            }, 600);
          });
        } else {
          this.showToast('石門已敞開，走進花田吧！');
        }
        break;
    }
  }

  // 開啟單字練習對話視窗
  openSpeechCard(wordKey, onComplete) {
    const modal = document.getElementById('speechModal');
    const data = VOCAB_DATA[wordKey];
    if (!modal || !data) return;

    // 填入吉祥物與單字資料
    document.getElementById('modalMascotImg').src = data.mascotImg;
    document.getElementById('modalMascotName').textContent = data.mascotName;
    document.getElementById('modalWord').textContent = data.word;
    document.getElementById('modalPhonics').textContent = data.phonics;
    document.getElementById('modalZh').textContent = data.zh;
    document.getElementById('modalDialogue').textContent = data.dialogue;
    document.getElementById('modalDialogueZh').textContent = data.dialogueZh;
    document.getElementById('modalPrompt').textContent = data.prompt;

    modal.style.display = 'flex';

    // 自動播放一次外師發音
    if (window.speechManager) {
      window.speechManager.playWordVoice(wordKey);
    }

    // 綁定發音按鈕
    const voiceBtn = document.getElementById('playVoiceBtn');
    voiceBtn.onclick = () => {
      if (window.speechManager) window.speechManager.playWordVoice(wordKey);
    };

    // 綁定麥克風口說辨識
    const micBtn = document.getElementById('micButton');
    micBtn.onclick = () => {
      if (window.speechManager) {
        window.speechManager.startListening(wordKey, (success) => {
          if (success) {
            modal.style.display = 'none';
            if (onComplete) onComplete();
          }
        });
      }
    };

    // 綁定教師/備用過關按鈕 (免於雜音卡關)
    const passBtn = document.getElementById('teacherPassBtn');
    passBtn.onclick = () => {
      if (window.speechManager) {
        window.speechManager.forcePass();
        setTimeout(() => {
          modal.style.display = 'none';
          if (onComplete) onComplete();
        }, 300);
      }
    };
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
    this.gameState.level = Math.floor(this.gameState.xp / 100) + 1;

    const xpLabel = document.getElementById('hudXpLabel');
    const xpFill = document.getElementById('hudXpFill');
    const levelLabel = document.getElementById('hudLevelLabel');

    if (xpLabel) xpLabel.textContent = `${this.gameState.xp} XP`;
    if (levelLabel) levelLabel.textContent = `等級 ${this.gameState.level} • 童趣魔法使`;
    if (xpFill) {
      const pct = Math.min(100, (this.gameState.xp % 100));
      xpFill.style.width = `${pct}%`;
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
    }, 3200);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 更新動畫
    for (let i = this.animators.length - 1; i >= 0; i--) {
      if (!this.animators[i].update(delta)) {
        this.animators.splice(i, 1);
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

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.world3D = new World3D();
});
