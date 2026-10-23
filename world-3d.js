// 3D 魔法書齋世界與謎題互動引擎 (World3D)
// 基於 Three.js 打造溫馨奇幻《葬送的芙莉蓮》與《童趣森林》風格

class World3D {
  constructor() {
    this.settings = GamePolish.loadSettings(window.localStorage);
    this.devMode = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname) && new URLSearchParams(location.search).get("dev") === "1";
    this.zoneTimers = new Set();
    this.frameCadence = new GamePolish.FrameCadence();
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
    this.zoneManager.loadSceneTextures(this.activeZoneGroup);
    GamePolish.applySceneStyle(this,'zone1');
    this.targetFocus = new GamePolish.TargetFocus(this.scene);
    this.restoreStudyState();
    this.setQualityPreference(this.settings.quality);
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

    if (this.isFallback2D) {
      this.renderFallback2DPanel();
    }
    this.animate();
  }

  createFallback2DRenderer(canvas) {
    const domElement = canvas || (typeof document !== 'undefined' ? document.createElement('canvas') : { addEventListener: () => {} }); if (domElement && typeof domElement.addEventListener !== 'function') domElement.addEventListener = () => {};
    return {
      domElement,
      isFallback2D: true,
      outputEncoding: null,
      toneMapping: null,
      toneMappingExposure: 1.0,
      shadowMap: { enabled: false, type: null },
      capabilities: { getMaxAnisotropy: () => 1 },
      info: { memory: { geometries: 0, textures: 0 }, render: { calls: 0 } },
      setSize: () => {},
      setPixelRatio: () => {},
      render: () => {},
      dispose: () => {}
    };
  }

  interactionAvailability(target) {
    if(!target?.userData)return {available:false};
    for(let p=target;p;p=p.parent)if(p.visible===false)return {available:false,hidden:true};
    if(target.userData.id==='exit_portal_zone1' && !this.gameState.doorOpened && !this.gameState.escaped)
      return {available:false,reason:'先完成石門機關，再前往花田。'};
    return {available:true};
  }

  tryRestore3D() {
    if(!this.isFallback2D)return true;
    const previous=this.renderer,canvas=previous.domElement;let renderer;
    for(const antialias of [true,false]){try{renderer=new THREE.WebGLRenderer({canvas,antialias,alpha:false});break;}catch(_){}}
    if(!renderer)return false;
    try{
      this.renderer=renderer;renderer.setSize(window.innerWidth,window.innerHeight);
      renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
      this.isFallback2D=false;this.contextLost=false;this.setGraphicQuality(this.graphicQuality||'medium');
      if(typeof THREE.PMREMGenerator==='function')try{this.pmremGenerator=new THREE.PMREMGenerator(renderer);this.zoneManager?.refreshZoneEnvironment?.();}catch(_){}
      previous.dispose();window.touchControls?.reset();this.frameCadence.reset();this.clock.getDelta();this.renderFallback2DPanel();return true;
    }catch(error){renderer.dispose();this.renderer=previous;this.isFallback2D=true;return false;}
  }

  toggleFallback2DMode(forceState) {
    this.isFallback2D = typeof forceState === 'boolean' ? forceState : !this.isFallback2D;
    this.renderFallback2DPanel();
    return this.isFallback2D;
  }

  renderFallback2DPanel() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    document.body?.classList?.toggle('fallback-2d',!!this.isFallback2D);
    let panel = document.getElementById('fallback2DPanel');
    if (!this.isFallback2D) {
      if (panel) panel.style.display = 'none';
      return;
    }
    if (!panel && document.body && typeof document.createElement === 'function') {
      panel = document.createElement('section');
      panel.id = 'fallback2DPanel';
      panel.className = 'fallback-2d-panel';
      panel.setAttribute('aria-label', '2D 圖卡探索與單字練習模式');
      document.body.appendChild(panel);
    }
    if (!panel) return;
    panel.style.display = 'flex';
    const zm = this.zoneManager;
    const curZone = zm ? zm.getCurrentZone() : { id: 'zone1', name: '見習學徒書齋', englishName: 'Apprentice Study', icon: '🏰', topic: 'School & Prepositions', desc: '古老而溫暖的魔法書齋，點擊下方圖卡即可直接進行英語發音與解謎互動！' };
    const seen = new Set();
    const items = [];
    for (const obj of (this.interactables || [])) {
      if (!obj || !obj.userData) continue;
      const availability=this.interactionAvailability(obj);if(availability.hidden)continue;
      const key = obj.userData.id || obj.userData.name || obj.userData.label;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      items.push({
        key,
        title: (window.GamePolish && typeof window.GamePolish.actionText === 'function') ? window.GamePolish.actionText(this, obj) : (obj.userData.name || obj.userData.label || key),
        hint: obj.userData.hint || obj.userData.label || '點擊開始英語互動',
        obj, availability
      });
    }
    const goal=window.GamePolish?.taskText?.(this.gameState,curZone.id)||'';
    const signature=curZone.id+'|'+goal+'|'+items.map(i=>[i.key,i.title,i.availability.available,i.hint].join(':')).join('|');
    if(this.fallbackSignature===signature && panel.children.length)return;
    this.fallbackSignature=signature;
    const focusKey=document.activeElement?.getAttribute?.('data-fallback-key');
    panel.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'fallback-2d-card';
    const header = document.createElement('div');
    header.className = 'fallback-2d-header';
    header.innerHTML = `<div class="fallback-2d-badge">🖼️ 2D 輕量圖卡互動模式（免 3D 硬體加速）</div><h2>${curZone.icon || '🏰'} ${curZone.name} <small>${curZone.englishName || ''}</small></h2><p>${curZone.desc || ''}</p><p class="fallback-current-goal">${goal}</p>`;
    card.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'fallback-2d-grid';
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fallback-2d-item-btn';
      btn.setAttribute('data-fallback-key',item.key);btn.disabled=!item.availability.available;
      if(item.availability.reason)btn.title=item.availability.reason;
      btn.innerHTML = `<strong>✨ ${item.title}</strong><span>${item.hint}</span>`;
      btn.onclick = () => { this.triggerInteraction(item.obj); this.renderFallback2DPanel(); };
      grid.appendChild(btn);
    });
    card.appendChild(grid);

    const footer = document.createElement('div');
    footer.className = 'fallback-2d-actions';
    const mapBtn = document.createElement('button');
    mapBtn.type = 'button';
    mapBtn.textContent = '🗺️ 開啟空間星圖（切換關卡）';
    mapBtn.onclick = () => window.toggleWorldMapModal?.();
    const hubBtn = document.createElement('button');
    hubBtn.type = 'button';
    hubBtn.textContent = '📚 探險家學習大廳';
    hubBtn.onclick = () => {
      if (curZone.id === 'learningHub') window.LearningHub?.open?.();
      else { window.LearningHub?.enter?.(); setTimeout(() => window.LearningHub?.open?.(), 150); }
    };
    const huntBtn = document.createElement('button');
    huntBtn.type = 'button';
    huntBtn.textContent = '🧭 聽力尋寶任務';
    huntBtn.onclick = () => window.openScavengerModal?.();
    const retryBtn=document.createElement('button');retryBtn.type='button';retryBtn.textContent='重新嘗試 3D';
    retryBtn.onclick=()=>{const restored=this.tryRestore3D();this.showToast(restored?'已恢復 3D 探索，關卡進度完整保留。':'目前仍無法使用 3D，可以繼續圖卡探索。');};
    const hintBtn=document.createElement('button');hintBtn.type='button';hintBtn.textContent='需要一點提示？';hintBtn.onclick=()=>document.getElementById('adventureHintBtn')?.click();
    footer.append(mapBtn,hubBtn,huntBtn,retryBtn,hintBtn);
    card.appendChild(footer);
    panel.appendChild(card);
    if(focusKey)for(const b of (panel.querySelectorAll?.('[data-fallback-key]')||[]))if(b.getAttribute('data-fallback-key')===focusKey)b.focus();
  }

  switchZone(zoneId, options = {}) {
    if (this.zoneManager) {
      const switched = this.zoneManager.switchZone(zoneId, options);
      if (this.isFallback2D) this.renderFallback2DPanel();
      return switched;
    }
  }

  initScene() {
    const canvas = document.getElementById('renderCanvas');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdce8f5); // 柔和天空淡藍
    this.scene.fog = new THREE.FogExp2(0xf0e6d6, 0.025);

    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 400);
    this.camera.position.copy(this.player.pos);

    this.isFallback2D = false;
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
    } catch (errHigh) {
      try {
        this.renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: false,
          alpha: false
        });
      } catch (errLow) {
        console.warn('WebGL unavailable, activating 2D interactive fallback mode:', errLow);
        this.isFallback2D = true;
        this.renderer = this.createFallback2DRenderer(canvas);
      }
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.sRGBEncoding) {
      this.renderer.outputEncoding = THREE.sRGBEncoding;
    }
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    if (this.renderer.shadowMap) {
      this.renderer.shadowMap.enabled = !this.isFallback2D;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // 畫質分級與效能監測系統 (高 / 中 / 低 + 自動降級)
    this.graphicQuality = 'high'; // 'high' | 'medium' | 'low'
    this.rollingFps = 60;
    this.lastFrameTimestamp = (typeof performance !== 'undefined') ? performance.now() : Date.now();
    this.lastFpsUiUpdateTime = 0;
    this.lowFpsDuration = 0;
    this.envMapCache = {};

    // PMREMGenerator 環境反射貼圖編譯器 (Three.js IBL 空間反射)
    this.pmremGenerator = null;
    if (!this.isFallback2D && typeof THREE.PMREMGenerator === 'function') {
      try {
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        if (typeof this.pmremGenerator.compileEquirectangularShader === 'function') {
          this.pmremGenerator.compileEquirectangularShader();
        }
      } catch (e) {
        console.warn('PMREMGenerator initialization skipped:', e);
        this.pmremGenerator = null;
      }
    }

    // 溫暖陽光與環境光
    const hemiLight = new THREE.HemisphereLight(0xfff6e8, 0x8f7259, 0.95);
    this.hemiLight = hemiLight;
    hemiLight.intensity = 0.65;
    this.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.25);
    sunLight.position.set(6, 10, -4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 30;
    sunLight.shadow.camera.left = -14;
    sunLight.shadow.camera.right = 14;
    sunLight.shadow.camera.top = 14;
    sunLight.shadow.camera.bottom = -14;
    sunLight.shadow.bias = -0.0004;
    this.sunLight = sunLight;
    this.scene.add(sunLight);

    // 漂浮魔力塵埃粒子 (Frieren 暖光微塵 - 升級柔邊圓形發光粒子)
    const dustCount = 220;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 14;
      dustPos[i + 1] = Math.random() * 4.2;
      dustPos[i + 2] = (Math.random() - 0.5) * 14;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustTex = this.createSoftCircleParticleTexture();
    const dustMat = new THREE.PointsMaterial({
      color: 0xffe89e,
      size: 0.055,
      transparent: true,
      opacity: 0.28,
      map: dustTex || null,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.dustParticles = new THREE.Points(dustGeo, dustMat);
    this.scene.add(this.dustParticles);
  }

  // 打造溫馨木造與石砌魔法書齋
  buildAtelierRoom(parentGroup) {
    const container = parentGroup || this.activeZoneGroup || this.scene;
    const roomGroup = new THREE.Group();
    // 1. 溫潤古木地板 (AI 精緻木紋皮膚)
    const floorTex = this.zoneManager.getTexture('assets/textures/tex-wood-floor.jpg','atelier-floor');
    floorTex.encoding = THREE.sRGBEncoding;
    floorTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(4, 4);
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.78,
      metalness: 0.0
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // 2. 天花板與深木橫樑 (木紋皮膚)
    const beamTex = this.zoneManager.getTexture('assets/textures/tex-wood-desk.jpg','atelier-wood');
    beamTex.encoding = THREE.sRGBEncoding;
    beamTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
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
    const wallTex = this.zoneManager.getTexture('assets/textures/tex-stone-wall.jpg','atelier-wall');
    wallTex.encoding = THREE.sRGBEncoding;
    wallTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
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
    const bgTex = this.zoneManager.getTexture('assets/textures/atelier-window-view.jpg');
    bgTex.encoding = THREE.sRGBEncoding;
    bgTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    const bgMat = new THREE.MeshBasicMaterial({ map: bgTex });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 2.5, -11.5);
    roomGroup.add(bgMesh);

    // 溫暖晨曦拱窗斜射光束 (Soft Volumetric Sunbeam / Godray)
    const beamGeo = new THREE.CylinderGeometry(0.7, 2.3, 5.8, 16, 1, true);
    const beamMat = new THREE.ShaderMaterial({
      transparent:true,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false,
      uniforms:{tint:{value:new THREE.Color(0xfff3db)}},
      vertexShader:'varying vec2 beamUv; varying vec3 beamNormal; varying vec3 viewDirection; void main(){beamUv=uv; vec4 viewPosition=modelViewMatrix*vec4(position,1.0); beamNormal=normalMatrix*normal; viewDirection=-viewPosition.xyz; gl_Position=projectionMatrix*viewPosition;}',
      fragmentShader:'uniform vec3 tint; varying vec2 beamUv; varying vec3 beamNormal; varying vec3 viewDirection; void main(){float edge=pow(abs(dot(normalize(beamNormal),normalize(viewDirection))),1.5); float lengthFade=pow(sin(3.14159265*beamUv.y),2.0); gl_FragColor=vec4(tint,.055*edge*lengthFade);}'
    });
    beamMat.opacity=.055;
    const sunbeam = new THREE.Mesh(beamGeo, beamMat);
    sunbeam.position.set(0.1, 2.0, -3.2);
    sunbeam.rotation.x = Math.PI / 4.2;
    sunbeam.userData.nonBlocking = true;
    roomGroup.add(sunbeam);

    // 4. 地面中央華麗魔導圓形地毯 (Magic Circle Rug)
    const rugTex = this.zoneManager.getTexture('assets/textures/magic-circle-rug.jpg');
    rugTex.encoding = THREE.sRGBEncoding;
    rugTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
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
    const paintingTex = this.zoneManager.getTexture('assets/textures/botanical-flower-painting.jpg');
    paintingTex.encoding = THREE.sRGBEncoding;
    paintingTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
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
    const woodTex = this.zoneManager.getTexture('assets/textures/tex-wood-desk.jpg','atelier-wood');
    woodTex.encoding = THREE.sRGBEncoding;
    woodTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
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
    const deskWoodTex = this.zoneManager.getTexture('assets/textures/tex-wood-desk.jpg','atelier-wood');
    deskWoodTex.encoding = THREE.sRGBEncoding;
    deskWoodTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    const grimoireTex = this.zoneManager.getTexture('assets/textures/tex-grimoire-book.jpg');
    grimoireTex.encoding = THREE.sRGBEncoding;
    grimoireTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    const slateTex = this.zoneManager.getTexture('assets/textures/tex-alchemy-slate.jpg');
    slateTex.encoding = THREE.sRGBEncoding;
    slateTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());

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
    // Turned brass rings and soft wax drips read clearly at close range.
    [0.04, 0.10, 0.23].forEach(y => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(y===.04?.12:.045,.012,8,24), standMat);
      ring.rotation.x=Math.PI/2; ring.position.y=y; candleGroup.add(ring);
    });
    for(let i=0;i<4;i++) {
      const drip = new THREE.Mesh(new THREE.SphereGeometry(.018,8,6), wax.material);
      const angle=i*Math.PI/2; drip.position.set(Math.cos(angle)*.048,.37-i*.009,Math.sin(angle)*.048);
      drip.scale.y=1.8; candleGroup.add(drip);
    }

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
    const bookMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.014, 0.35), coverMat);
    this.bookCoverHinge = new THREE.Group(); this.bookCoverHinge.position.set(-.225,.043,0);
    bookMesh.position.x=.225; this.bookCoverHinge.add(bookMesh);
    const backCover=new THREE.Mesh(bookMesh.geometry,coverMat); backCover.position.y=-.043;
    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.32), new THREE.MeshStandardMaterial({ color: 0xfdf6e2 }));
    pages.position.set(0.01, 0, 0);
    this.bookGroup.add(this.bookCoverHinge, backCover, pages);
    // Separate paper edges, leather spine and brass fittings, rather than a printed box.
    for(let i=0;i<5;i++) {
      const pageEdge = new THREE.Mesh(new THREE.BoxGeometry(.42,.002,.32), new THREE.MeshStandardMaterial({color:i%2?0xe2d1ac:0xf8efd7,roughness:.92}));
      pageEdge.position.set(.01,-.023+i*.01,0); this.bookGroup.add(pageEdge);
    }
    [-1,1].forEach(x=>[-1,1].forEach(z=>{
      const corner=new THREE.Mesh(new THREE.BoxGeometry(.055,.014,.055),standMat);
      corner.position.set(.225+x*.193,.01,z*.145); this.bookCoverHinge.add(corner);
    }));
    const spine=new THREE.Mesh(new THREE.CylinderGeometry(.042,.042,.35,16),coverMat);
    spine.rotation.x=Math.PI/2; spine.position.x=-.22; this.bookGroup.add(spine);

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
    [-1,1].forEach(side=>{
      const trim=new THREE.Mesh(new THREE.BoxGeometry(2.42,.035,.028),standMat);
      trim.position.set(0,.935,-3.8+side*.60); deskGroup.add(trim);
    });
    this.addContactShadow(container, -3.2, -3.5, .7, .7);
    this.addContactShadow(container, 0, -3.8, 1.5, .9);
    this.addContactShadow(container, -4.5, 0, 1.05, .75);
    this.addContactShadow(container, 4.5, 2.5, .6, .48);

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

    const bottle = new THREE.Mesh(new THREE.LatheGeometry([
      new THREE.Vector2(.03,-.18),new THREE.Vector2(.16,-.14),new THREE.Vector2(.20,-.03),new THREE.Vector2(.15,.12),new THREE.Vector2(.055,.20),new THREE.Vector2(.055,.29)
    ],24),new THREE.MeshStandardMaterial({color:0xc7e8ef,transparent:true,opacity:.25,roughness:.18,metalness:.05,side:THREE.DoubleSide,depthWrite:false}));
    bottle.position.copy(this.flaskLiquid.position); bottle.userData.nonBlocking=true; alchemyGroup.add(bottle);
    const stopper = new THREE.Mesh(new THREE.CylinderGeometry(.058,.05,.06,12),new THREE.MeshStandardMaterial({color:0x94734e,roughness:.95}));
    stopper.position.set(-4.5,1.27,0); alchemyGroup.add(stopper);

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
    this.flowerStone.userData={id:'flower',name:'蒼月花石刻 (FLOWER)'};
    container.add(this.flowerStone);
    this.interactables.push(this.flowerStone);

    this.mimicGroup.position.set(4.5, 0, 2.5);
    this.mimicGroup.rotation.y = -Math.PI / 4;
    this.mimicGroup.userData = { id: 'mimic', name: '貓咪寶箱怪 Mimic', hint: '愛吃魚的貪睡小怪 (CAT, FISH)' };
    container.add(this.mimicGroup);
    this.interactables.push(this.mimicGroup);

    // 寶箱怪旁邊東側牆壁上的可愛貓咪掛畫
    const mimicPicTex = this.zoneManager.getTexture('assets/textures/cute-cat-mimic.jpg');
    mimicPicTex.encoding = THREE.sRGBEncoding;
    mimicPicTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
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

    // 左右門扇專用古老星芒與蒼月花符文雕刻材質 (室內朝 +Z 南向觀看時，+X 為畫面左側、-X 為畫面右側)
    const doorTexLeft = this.zoneManager.getTexture('assets/textures/ancient-stone-door.jpg','door-left');
    doorTexLeft.encoding = THREE.sRGBEncoding;
    doorTexLeft.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    doorTexLeft.repeat.set(0.30, 0.90);
    doorTexLeft.offset.set(0.50, 0.02);
    const doorLeafMatLeft = new THREE.MeshStandardMaterial({
      map: doorTexLeft,
      roughness: 0.75,
      metalness: 0.15
    });

    const doorTexRight = this.zoneManager.getTexture('assets/textures/ancient-stone-door.jpg','door-right');
    doorTexRight.encoding = THREE.sRGBEncoding;
    doorTexRight.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    doorTexRight.repeat.set(0.30, 0.90);
    doorTexRight.offset.set(0.20, 0.02);
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
        if (!this.gameState.escaped) { this.triggerEscapeCelebration(); return; }
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

    // A single input queue owns clicks, taps and E; no duplicate pointerup path.
    window.addEventListener('blur', () => window.touchControls?.reset());
    document.addEventListener('visibilitychange', () => {
      window.touchControls?.reset();
      if (document.hidden) window.speechManager?.stopListening();
      this.clock.getDelta(); this.lastFrameTimestamp = performance.now(); this.lowFpsDuration = 0;
    });
    const canvas = this.renderer.domElement;
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.contextLost = true; window.touchControls?.reset(); window.speechManager?.stopListening(); this.showToast('畫面暫時中斷，請等待顯示恢復。'); });
    canvas.addEventListener('webglcontextrestored', () => { this.contextLost = false; window.touchControls?.reset(); this.frameCadence.reset(); this.clock.getDelta(); this.setGraphicQuality(this.graphicQuality, true); });

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
        const speech = document.getElementById('speechModal');
        if (speech && speech.style.display === 'flex') this.closeSpeechCard();
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
      'storyPrologueModal',
      'instructionsModal',
      'hintModal',
      'realmQuestModal',
      'cloudRestoreModal',
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
    const drawer = document.getElementById('systemMenuDrawer');
    if (drawer && drawer.style.display !== 'none') return true;
    const cover = document.getElementById('gameCoverScreen');
    if (cover && getComputedStyle(cover).display !== 'none' && getComputedStyle(cover).visibility !== 'hidden') return true;
    return false;
  }

  // 推進第一人稱移動與實體障礙物碰撞 (支援平滑滑牆 Smooth Wall-Sliding，徹底防止穿牆穿火車)
  updatePlayer(delta) {
    // 彈窗開啟時暫停視角旋轉與走動，防止誤觸
    if (this.isAnyModalOpen()) {
      if (window.touchControls) {
        window.touchControls.reset();
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
      const previousZ = this.player.pos.z;
      if (move.forward !== 0 || move.right !== 0) {
        GamePolish.movePlayer(this.player, move, delta, (x,z,r) => this.isPositionBlocked(x,z,r));

        // 走入花田檢查 (僅在 Zone 1 見習書齋密室通關時觸發)
        if ((!this.zoneManager || this.zoneManager.currentZoneId === 'zone1') && previousZ <= 8.0 && this.player.pos.z > 8.0 && !this.gameState.escaped) {
          this.triggerEscapeCelebration();
        }
      }

      this.camera.position.copy(this.player.pos);

      // 檢查互動鍵 (E、手機互動鈕 或 滑鼠點擊)
      if (window.touchControls.consumeInteract()) {
        const target = GamePolish.resolveTarget(this);
        if (target) {
          this.triggerInteraction(target);
        } else {
          this.showToast('請靠近並對準魔法物件再按下互動鍵！');
        }
      }
    }
  }

  // 尋找玩家身邊最近的可互動目標 (半徑容錯輔助，防止準心微偏時按 E 或點擊沒反應)
  findNearbyInteractable(maxDist = 4) { return GamePolish.resolveTarget(this, maxDist); }

  updateRaycast() {
    const now=performance.now(); if(now-(this.lastRaycastTime || 0)<65) return; this.lastRaycastTime=now;
    const root = this.isAnyModalOpen() ? null : GamePolish.resolveTarget(this);
    if (root === this.hoveredObject) return;
    this.hoveredObject = root;
    this.targetFocus?.select(root);
    const tooltip = document.getElementById('interactPrompt');
    const crosshair = document.getElementById('crosshair');
    if (tooltip) {
      tooltip.style.display = root ? 'block' : 'none';
      if (root) tooltip.textContent = 'E / 互動 · ' + GamePolish.actionText(this, root);
    }
    if (crosshair) crosshair.classList.toggle('focused', !!root);
  }

  // 觸發解謎口說練習互動
  triggerInteraction(target) {
    if (!target || !target.userData) return;
    const availability=this.interactionAvailability(target);
    if(!availability.available){if(availability.reason)this.showToast(availability.reason);return;}

    // 若畫面上已有任何彈窗或對話介面，絕不觸發背景 3D 物件互動
    if (this.isAnyModalOpen()) return;

    if (window.audioManager) window.audioManager.playSfx('interact');

    // 若尋寶任務進行中，優先判定是否命中尋寶目標
    if (this.scavengerHunt && this.scavengerHunt.isQuestActive() && this.scavengerHunt.currentQuest?.targetWord && this.scavengerHunt.currentQuest.zoneId===(this.zoneManager?.currentZoneId||'zone1')) {
      const q = this.scavengerHunt.currentQuest;
      const targetId = (target.userData.id || '').toLowerCase();
      const targetLabel = (target.userData.label || target.userData.name || '').toUpperCase();
      const qWord = String(q.targetWord).toUpperCase();
      const zone1Map = { 'candle': 'LIGHT', 'book': 'BOOK', 'key': 'KEY', 'drawer': 'RED', 'alchemy': 'BLUE', 'cat': 'CAT', 'mimic': 'CAT', 'door': 'OPEN' };
      const resolvedWord = ((this.zoneManager?.currentZoneId||'zone1')==='zone1' ? zone1Map[targetId] : '') || targetId.toUpperCase();
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
            this.showToast('✨ 燭台點亮了！溫暖的光芒照耀著書桌角落。');
          });
        } else {
          this.showToast('燭台正散發著柔和溫暖的金光。');
        }
        break;

      case 'book':
        if (!this.gameState.candleLit) {
          this.showToast('魔導書的封印尚未甦醒，請先點亮旁邊的燭台 (LIGHT)！');
          return;
        }
        if (!this.gameState.bookOpened) {
          this.openSpeechCard('BOOK', () => {
            this.gameState.bookOpened = true;
            this.keyMesh.visible = true;
            const duration=this.settings.reducedMotion ? .01 : .55; let progress=0;
            this.animators.push({update:dt=>{ progress=Math.min(1,progress+dt/duration); const ease=1-Math.pow(1-progress,3); this.bookCoverHinge.rotation.z=ease*2.35; this.keyMesh.position.y=1.15+ease*.35; return progress<1; }});
            if(window.audioManager) window.audioManager.playSfx('pickup');
            this.showToast('📖 魔導書翻開了！裡面夾著一把黃銅鑰匙 (KEY)！');
            this.scheduleZoneAction(() => {
              this.openSpeechCard('KEY', () => {
                this.gameState.hasKey = true;
                this.keyMesh.visible = false;
                this.addInventory('KEY', '🔑 黃銅鑰匙', '#ecc94b');
                this.showToast('🔑 獲得道具：黃銅鑰匙！可用來打開書桌抽屜。');
              });
            }, 500);
          });
        } else if (!this.gameState.hasKey && !this.gameState.inventory.some(i => i.id === 'KEY')) {
          this.openSpeechCard('KEY', () => {
            this.gameState.hasKey = true;
            this.keyMesh.visible = false;
            this.addInventory('KEY', '🔑 黃銅鑰匙', '#ecc94b');
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
          if(this.settings.reducedMotion) this.drawerMesh.position.z=-3.3;
          else this.animators.push({
            update: (dt) => {
              if (this.drawerMesh.position.z < -3.3) {
                this.drawerMesh.position.z += 1.2 * dt;
                return true;
              }
              return false;
            }
          });
          this.showToast('🔓 抽屜打開了！發現了一瓶深紅色魔藥 (RED)！');
          this.scheduleZoneAction(() => {
            this.openSpeechCard('RED', () => {
              this.gameState.hasRedPotion = true;
              this.addInventory('RED', '🧪 火紅魔藥', '#fc8181');
              this.showToast('獲得火紅魔藥！去調劑台與水之魔藥融合吧。');
            });
          }, 400);
        } else if (!this.gameState.hasRedPotion && !this.gameState.inventory.some(i => i.id === 'RED')) {
          this.openSpeechCard('RED', () => {
            this.gameState.hasRedPotion = true;
            this.addInventory('RED', '🧪 火紅魔藥', '#fc8181');
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

              this.scheduleZoneAction(() => {
                this.openSpeechCard('STAR', () => {
                  this.gameState.alchemyMixed = true;
                  this.gameState.hasStarStone = true;
                  this.gameState.hasFish = true; // 關鍵修復：確保 hasFish 為 true
                  this.starStone.visible = true;
                  this.addInventory('STAR', '⭐ 星芒之石', '#f6e05e');
                  this.addInventory('FISH', '🐟 魔法小魚乾', '#4fd1c5');
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
                this.scheduleZoneAction(() => {
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
        } else if(!this.gameState.hasFlowerStone) {
          this.collectFlowerStone();
        } else {
          this.showToast('😺 貓咪寶箱怪吃得飽飽的，正在心滿意足地打呼嚕：Purr, purr...');
        }
        break;

      case 'flower':
        if(this.gameState.mimicFed && !this.gameState.hasFlowerStone) this.collectFlowerStone();
        else this.showToast('蒼月花石刻已收入背包，帶它前往石門吧。');
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

              this.scheduleZoneAction(() => {
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
    if(this.gameState.mimicFed) return;
    this.gameState.mimicFed = true;
    this.flowerStone.visible = true;
    if(this.settings.reducedMotion) this.mimicLid.rotation.x=-Math.PI/3;
    else {let time=0;this.animators.push({update:dt=>{time=Math.min(1,time+dt/.45);this.mimicLid.rotation.x=-Math.PI/3*(1-Math.pow(1-time,3));return time<1;}});}
    this.showToast('寶箱怪吃飽了！發現蒼月花石刻，詠唱 FLOWER 將它收入背包。');
    this.scheduleZoneAction(()=>this.collectFlowerStone(),500);
  }
  collectFlowerStone() {
    if(!this.gameState.mimicFed || this.gameState.hasFlowerStone) return;
    this.openSpeechCard('FLOWER',()=>{
      if(this.gameState.hasFlowerStone) return;
      this.gameState.hasFlowerStone=true;this.flowerStone.visible=false;
      this.addInventory('FLOWER','🌸 蒼月花石刻','#63b3ed');
      window.audioManager?.playSfx('pickup');
      this.showToast('獲得蒼月花石刻！帶著兩顆魔法石前往石門。');
    });
  }

  openStoneDoorSuccess() {
    if(this.gameState.doorOpened) return;
    this.gameState.doorOpened = true;
    if (window.audioManager) window.audioManager.playSfx('doorOpen');
    if(this.settings.reducedMotion) {this.doorLeft.position.x=-1.7;this.doorRight.position.x=1.7;}
    else this.animators.push({
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
    this.showToast('🚪 遠古石門敞開了！微風與花香飄進來，快走到花田迎接朝陽！');
  }

  // 開啟單字練習對話視窗
  openSpeechCard(wordKey, onComplete, options = {}) {
    this.speechReturnFocus = document.activeElement;
    this.teacherPassPending = false;
    const cardToken = Symbol(wordKey); this.speechCardToken = cardToken;
    const activeGroup = this.activeZoneGroup;
    const practiceZoneId = this.zoneManager?.currentZoneId || 'zone1';
    const isCurrent = () => this.speechCardToken === cardToken && this.activeZoneGroup === activeGroup;
    const complete = onComplete; let completed=false;
    onComplete = (teacher=false) => {
      if (!isCurrent() || completed) return false;
      if (!this.awardWordPractice(wordKey, data.xp || 50, teacher, zoneLabel)) {
        const message='紀錄無法保存，請確認儲存空間後重試；這次尚未完成步驟。';
        if(window.speechManager?.updateUIStatus)window.speechManager.updateUIStatus('error',message);
        else {const status=document.getElementById('speechStatus');if(status)status.textContent=message;}return false;
      }
      completed=true;modal.style.display='none';this.restoreSpeechFocus();
      if(complete)complete();this.notePracticeCompletion(wordKey,practiceZoneId);
      if(this.isFallback2D)this.renderFallback2DPanel();return true;
    };
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

    // 依當前秘境區域動態對齊專屬守護者立繪與導師肖像
    const currentZone = this.zoneManager?.currentZoneId || 'zone1';
    const zonePortraits = {
      'zone1': { name: '貓頭鷹長老 Ollie', img: 'assets/textures/owl-guide.png' },
      'zone6': { name: '瑪琳娜船長 Marina', img: 'assets/textures/captain_marina_portrait.jpg' },
      'zone7': { name: '艾瑟爾賢者 Aethel', img: 'assets/textures/astrologer_aethel_portrait.jpg' },
      'zone8': { name: '佛洛斯特長老 Frost', img: 'assets/textures/archmage_frost_portrait.jpg' },
      'zone9': { name: '奧利弗大校長 Oliver', img: 'assets/textures/grand_archmage_oliver_portrait.jpg' },
      'zone10': { name: '艾莉雅精靈使 Aria', img: 'assets/textures/aria_guardian_portrait.png' }
    };
    if (zonePortraits[currentZone] && (!data.mascotImg || data.mascotImg.includes('fox-guide'))) {
      data.mascotName = zonePortraits[currentZone].name;
      data.mascotImg = zonePortraits[currentZone].img;
    }

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
          if(window.speechManager) {window.speechManager.stopVoice();window.speechManager.playSentenceVoice(chunk);}
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
      if (data.sentence || (passportWord && passportWord.sentence)) {
        sentenceEn.textContent = `💬 "${data.sentence || passportWord.sentence}"`;
        sentenceZh.textContent = data.sentenceZh || passportWord.sentenceZh || '';
        sentenceBox.style.display = 'block';
      } else {
        sentenceBox.style.display = 'none';
      }
    }

    modal.querySelector('.practice-details')?.removeAttribute('open');
    modal.style.display = 'flex';
    modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-labelledby','modalWord');
    document.getElementById('playVoiceBtn')?.focus();

    // 每次開啟單字卡時，重置錄音狀態與按鈕外觀
    if (window.speechManager) {
      window.speechManager.stopListening();
    }
    const micBtn = document.getElementById('micButton');
    if (micBtn) {
      micBtn.className = 'btn-mic';
      micBtn.style.background = '';
      micBtn.innerHTML = '<span>開始朗讀</span>';
    }
    const statusBox = document.getElementById('speechStatus');
    if (statusBox) {
      statusBox.textContent = '先聽示範，再點擊「開始朗讀」唸出單字。';
      statusBox.className = 'speech-status';
    }

    // 自動播放一次外師發音
    if (window.speechManager) {
      window.speechManager.playWordVoice(wordKey);
    }

    // 綁定發音按鈕 (正常速 0.95x 與慢速示範 0.65x)
    const voiceBtn = document.getElementById('playVoiceBtn');
    if (voiceBtn) {
      voiceBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        if (window.speechManager) window.speechManager.playWordVoice(wordKey, 0.95);
      };
    }
    const slowVoiceBtn = document.getElementById('btnSlowVoice');
    if (slowVoiceBtn) {
      slowVoiceBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        if (window.speechManager) window.speechManager.playWordVoice(wordKey, 0.65);
      };
    }

    const zoneLabel = this.zoneManager?.zones?.[practiceZoneId]
      ? `${this.zoneManager.zones[practiceZoneId].id}: ${this.zoneManager.zones[practiceZoneId].name}`
      : practiceZoneId;

    // Only the current successful oral callback can persist a reward and advance the puzzle.
    micBtn.onclick = e => {
      e?.stopPropagation();
      window.speechManager?.startListening(wordKey, success => {
        if(success && isCurrent() && !completed){
          onComplete(false);
          if(!this.devMode)this.zoneManager?.checkZoneCompletionStatus?.();
        }
      });
    };
    const passBtn=document.getElementById('teacherPassBtn');
    const fallback=passBtn.closest?.('.fallback-pass-container');
    if(fallback){fallback.hidden=options.requireRecognition===true;fallback.style.display=options.requireRecognition?'none':'';}
    passBtn.hidden=options.requireRecognition===true;
    passBtn.onclick=e=>{
      e?.stopPropagation();
      if(options.requireRecognition || !window.speechManager || !isCurrent() || completed || this.teacherPassPending)return;
      this.teacherPassPending=true;window.speechManager.targetData=data;window.speechManager.forcePass(false);
      this.scheduleZoneAction(()=>{this.teacherPassPending=false;if(isCurrent())onComplete(true);},300);
    };
  }

  awardWordPractice(word, amount, teacher, zone) {
    if(!this.devMode && window.cloudSyncManager){
      const result=window.cloudSyncManager.recordWordPass(word,amount,teacher,zone);
      return result?.saved!==false;
    }
    if(this.gameState && Number.isFinite(this.gameState.xp))this.addXP(amount);
    return true;
  }

  notePracticeCompletion(wordKey,practiceZoneId) {
    const zone=practiceZoneId || this.zoneManager?.currentZoneId || 'zone1';
    const words=this.gameState.practicedWordsByZone || (this.gameState.practicedWordsByZone={});
    const completed=words[zone] || (words[zone]=[]);
    if(!completed.includes(wordKey)) completed.push(wordKey);
    this.hintController?.clear();
    const zoneInfo=this.zoneManager?.zones?.[zone];
    const next=window.AdventureAssist?.hintPlan(this.gameState,zoneInfo,completed);
    if(zone===this.zoneManager?.currentZoneId) this.realmQuests?.reward('英語線索完成 · '+wordKey,next?.clues?.[0] || '看看下一個可以探索的魔法物件。');
  }

  restoreSpeechFocus() {
    if(this.speechReturnFocus?.isConnected && this.speechReturnFocus.getClientRects().length && this.speechReturnFocus !== document.body) this.speechReturnFocus.focus();
    else document.getElementById('renderCanvas')?.focus({preventScroll:true});
  }
  closeSpeechCard() {
    this.speechCardToken = null; this.teacherPassPending = false;
    this.restoreSpeechFocus();
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
    if (this.devMode) return;
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
      const lvl = Math.max(1, Number(profile.level) || 1);
      const nextLevelXp = 100 * Math.pow(lvl, 1.35);
      const curLevelBaseXp = lvl > 1 ? 100 * Math.pow(lvl - 1, 1.35) : 0;
      const range = Math.max(1, nextLevelXp - curLevelBaseXp);
      const pct = Math.min(100, Math.max(0, (((Number(profile.xp) || 0) - curLevelBaseXp) / range) * 100));
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
    if(this.gameState.escaped || this.isAnyModalOpen()) return;
    if(!this.gameState.doorOpened){this.showToast('請先完成石門機關，再前往花田。');return;}
    this.openSpeechCard('SUN', () => {
      if(this.gameState.escaped) return;
      this.gameState.escaped = true;
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
    if (this.gameState.inventory.some(item => item.id === id)) return;
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

    if (!this.devMode && window.cloudSyncManager && window.cloudSyncManager.profile) {
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

  // 生成程序化柔和圓形漸層微粒貼圖 (徹底消除方形像素微粒，實現電影級夢幻光斑)
  createSoftCircleParticleTexture() {
    if (this._softCircleParticleTexture) {
      return this._softCircleParticleTexture;
    }
    if (typeof document === 'undefined' || !document.createElement) {
      return null;
    }
    try {
      const size = 64;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const center = size / 2;
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
      gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
      gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.35)');
      gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      this._softCircleParticleTexture = texture;
      return texture;
    } catch (e) {
      console.warn('Could not generate soft particle texture:', e);
      return null;
    }
  }

  // 透過 PMREMGenerator 由全景圖動態生成次世代 Image-Based Lighting (IBL) 環境反射光
  updateEnvironmentFromTexture(texture, zoneId) {
    if (!this.scene || this.graphicQuality === 'low' || !texture) { this.scene.environment=null; return; }
    const current = this.zoneManager?.currentZoneId || 'zone1'; if (zoneId !== current) return;
    if (this.envMapCache[zoneId]) { this.scene.environment=this.envMapCache[zoneId].texture; return; }
    // LoadingManager retries after textures arrive; never compile an incomplete image.
    if (!texture.image || !(texture.image.width > 0) || !this.pmremGenerator) { this.scene.environment=null; return; }
    try {
      const target=this.pmremGenerator.fromEquirectangular(texture);
      this.envMapCache[zoneId]=target; this.scene.environment=target.texture;
      const keys=Object.keys(this.envMapCache);
      while(keys.length>2) { const key=keys.shift(); this.envMapCache[key].dispose(); delete this.envMapCache[key]; }
    } catch (err) { console.warn('Environment reflection skipped:',err); this.scene.environment=null; }
  }

  // 畫質分級控制系統 (高 / 中 / 低)
  setGraphicQuality(quality, isAuto = false) {
    if (!['high', 'medium', 'low'].includes(quality)) return;
    this.graphicQuality = quality;

    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1;

    if (this.renderer) {
      if (quality === 'high') {
        this.renderer.setPixelRatio(Math.min(dpr, 2.0));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      } else if (quality === 'medium') {
        this.renderer.setPixelRatio(Math.min(dpr, 1.5));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap || THREE.PCFSoftShadowMap;
      } else {
        this.renderer.setPixelRatio(1.0);
        this.renderer.shadowMap.enabled = false;
      }
      if (typeof window !== 'undefined' && window.innerWidth) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }

    // 陰影貼圖解析度階層調整
    if (this.sunLight && this.sunLight.shadow) {
      const mapSize = quality === 'high' ? 2048 : (quality === 'medium' ? 1024 : 512);
      this.sunLight.shadow.mapSize.width = mapSize;
      this.sunLight.shadow.mapSize.height = mapSize;
      if (this.sunLight.shadow.map) {
        this.sunLight.shadow.map.dispose();
        this.sunLight.shadow.map = null;
      }
    }

    // 塵埃微粒透明度調整
    if (this.dustParticles && this.dustParticles.material) {
      this.dustParticles.material.opacity = quality === 'high' ? 0.75 : (quality === 'medium' ? 0.5 : 0.25);
    }

    // PMREM 環境光反射切換
    if (quality === 'low') {
      if (this.scene) this.scene.environment = null;
    } else {
      const curZone = (this.zoneManager && this.zoneManager.currentZoneId) ? this.zoneManager.currentZoneId : 'zone1';
      if (this.envMapCache && this.envMapCache[curZone]) {
        this.scene.environment = this.envMapCache[curZone].texture;
      } else if (this.zoneManager && typeof this.zoneManager.refreshZoneEnvironment === 'function') {
        this.zoneManager.refreshZoneEnvironment();
      }
    }

    GamePolish.applyQuality(this);
    this.updateFpsPillUI();

    const names = {
      high: '高畫質 (High - 2048px柔和陰影+次世代環境反射)',
      medium: '中畫質 (Balanced - 1024px陰影+全景反射)',
      low: '流暢低畫質 (Performance - 關閉陰影，極致流暢)'
    };
    if (isAuto) {
      if (typeof this.showToast === 'function') {
        this.showToast(`⚡ 系統偵測到幀率偏低，已自動調降為【${names[quality]}】以保持遊戲流暢！`);
      }
    }
  }

  // 循環切換畫質
  addContactShadow(group, x, z, width, depth) {
    const material = new THREE.MeshBasicMaterial({map:this.createSoftCircleParticleTexture(),color:0x20160f,transparent:true,opacity:.26,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width*2,depth*2),material);
    mesh.rotation.x=-Math.PI/2; mesh.position.set(x,.012,z); mesh.userData.nonBlocking=true; group.add(mesh);
  }
  saveSettings() { try { localStorage.setItem('whimsy.settings.v1', JSON.stringify(this.settings)); } catch (_) {} }
  setQualityPreference(preference) {
    if (!['auto','high','medium','low'].includes(preference)) return;
    this.settings.quality = preference; this.lowFpsDuration = 0; this.saveSettings();
    this.setGraphicQuality(preference === 'auto' ? (navigator.maxTouchPoints > 0 ? 'medium' : 'high') : preference);
    const select = document.getElementById('qualityPreference'); if (select) select.value = preference;
  }
  cycleQuality() {
    const cycle = { auto:'high', high:'medium', medium:'low', low:'auto' };
    this.setQualityPreference(cycle[this.settings.quality]);
    this.showToast('畫質偏好已儲存 · ' + ({auto:'自動調整',high:'精緻',medium:'均衡',low:'流暢'}[this.settings.quality]));
  }
  scheduleZoneAction(callback, delay) {
    const group = this.activeZoneGroup;
    const timer = setTimeout(() => { this.zoneTimers.delete(timer); if (this.activeZoneGroup === group) callback(); }, delay);
    this.zoneTimers.add(timer);
  }
  restoreStudyState() {
    const s = this.gameState;
    this.candleFlame.material.opacity = s.candleLit ? 1 : 0;
    this.candleLight.intensity = s.candleLit ? 1.8 : 0;
    this.bookCoverHinge.rotation.z = s.bookOpened ? 2.35 : 0;
    this.keyMesh.position.y = s.bookOpened ? 1.5 : 1.15;
    this.keyMesh.visible = s.bookOpened && !s.hasKey;
    this.starStone.visible = s.alchemyMixed && !s.hasStarStone; this.flowerStone.visible = s.mimicFed && !s.hasFlowerStone;
    if (s.drawerOpened) this.drawerMesh.position.z = -3.3;
    if (s.hasBluePotion) this.flaskLiquid.material.color.setHex(0x9955ff);
    if (s.mimicFed) this.mimicLid.rotation.x = -Math.PI / 3;
    if (s.doorStonePlaced) { this.socketStar.material.color.setHex(0xffe600); this.socketFlower.material.color.setHex(0x4da6ff); }
    if (s.doorOpened) { this.doorLeft.position.x=-1.7; this.doorRight.position.x=1.7; }
  }

  getGraphicQuality() {
    return this.graphicQuality;
  }

  // 更新 HUD 頂部 FPS 與畫質膠囊面板
  updateFpsPillUI() {
    if (typeof document === 'undefined') return;
    const pill = document.getElementById('fpsQualityPill');
    if (!pill) return;
    const diagnostics = document.getElementById('devDiagnostics');
    if(this.devMode && diagnostics) {
      const frame = this.frameMetrics?.summary();
      diagnostics.textContent = '幾何 ' + this.renderer.info.memory.geometries + ' · 貼圖 ' + this.renderer.info.memory.textures + ' · 繪製 ' + this.renderer.info.render.calls + (frame ? ' · P95 ' + frame.p95Ms + 'ms · 長幀 ' + frame.longFrames : '') + ' · 場景建立 ' + Math.round(this.sceneBuildMs||0) + 'ms';
    }
    const task = document.getElementById('currentObjective');
    if (task) {
      const id=this.zoneManager?.currentZoneId || 'zone1',quest=window.RealmQuests?.specs[id];
      let text=GamePolish.taskText(this.gameState,id);
      if(quest&&id!=='zone11'&&id!=='zone12'&&id!=='zone13'&&id!=='zone14'&&id!=='zone15'&&id!=='zone16'&&id!=='zone17'&&id!=='zone18'){
        const done=window.RealmQuests.solved(id,this.gameState.realmPuzzles?.[id]);
        const next=this.zoneManager.zones[id].words.find(word=>!this.gameState.practicedWordsByZone?.[id]?.includes(word));
        text=!done?'秘境任務 · '+quest.title:next?'機關已解開 · 探索並練習 '+next:'任務與英語線索完成 · 探索守護者或下一個出口';
      }
      if(task.textContent!==text)task.textContent=text;
    }
    const fpsVal = Math.round(this.rollingFps || 60);
    const fpsEl = document.getElementById('fpsPillText');
    const qualEl = document.getElementById('qualityPillText');
    const qualLabels = { high: '高畫質', medium: '中畫質', low: '低畫質' };

    if (fpsEl) {
      fpsEl.textContent = this.isFallback2D ? '圖卡探索' : this.frameCadence?.mode === 'reading' ? '閱讀中 · 背景省電' : `⚡ FPS: ${fpsVal}`;
      fpsEl.className = fpsVal >= 45 ? 'fps-good' : (fpsVal >= 28 ? 'fps-med' : 'fps-low');
    }
    if (qualEl) {
      qualEl.textContent = this.isFallback2D ? '免 3D 加速' : (this.settings.quality === 'auto' ? '自動 · ' : '') + (qualLabels[this.graphicQuality] || '高畫質');
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const nowTime = performance.now();
    if(this.isFallback2D){
      if(!document.hidden && nowTime-(this.lastFallbackUpdate||0)>250){
        this.lastFallbackUpdate=nowTime;
        if(!this.isAnyModalOpen())this.renderFallback2DPanel();
        this.scavengerHunt?.update(0);
        this.updateFpsPillUI();
      }
      return;
    }
    const modalOpen = this.isAnyModalOpen();
    if (!this.frameCadence.shouldRender(nowTime,document.hidden,this.contextLost,modalOpen)) return;
    const clockDelta = this.clock.getDelta();
    const rawDelta = this.frameCadence.resumed ? 0 : clockDelta;
    const delta = GamePolish.frameDelta(rawDelta);
    const elapsedTime = this.clock.elapsedTime;
    // Reading/cover frames and the first resumed frame never influence auto quality.
    const frameDt = (nowTime - this.lastFrameTimestamp) / 1000;
    this.lastFrameTimestamp = nowTime;
    if (this.frameCadence.resumed) this.lowFpsDuration = 0;
    if (this.frameCadence.sample && frameDt > 0 && frameDt < 1.0) {
      this.rollingFps = this.rollingFps * 0.92 + (1 / frameDt) * 0.08;
    }

    // 每 450ms 刷新一次頂部 HUD 顯示
    if (nowTime - this.lastFpsUiUpdateTime > 450) {
      this.lastFpsUiUpdateTime = nowTime;
      this.updateFpsPillUI();
    }

    // 當幀率連續低於 28 FPS 逾 4 秒且高於低畫質時，自動降級以維護流暢度
    if (this.settings.quality === 'auto' && this.frameCadence.sample && this.rollingFps < 28 && this.graphicQuality !== 'low') {
      this.lowFpsDuration += delta;
      if (this.lowFpsDuration > 4.0) {
        this.lowFpsDuration = 0;
        const nextQuality = this.graphicQuality === 'high' ? 'medium' : 'low';
        this.setGraphicQuality(nextQuality, true);
      }
    } else {
      this.lowFpsDuration = 0;
    }

    // 更新動畫 (支援持續函數 anim(time, dt) 與單次物件 anim.update(dt))
    for (let i = this.animators.length - 1; i >= 0; i--) {
      const anim = this.animators[i];
      if (typeof anim === 'function') {
        if(!this.settings.reducedMotion) anim(elapsedTime, delta);
      } else if (anim && typeof anim.update === 'function') {
        if (!anim.update(delta)) {
          this.animators.splice(i, 1);
        }
      }
    }

    // 漂浮魔導書與微光起伏
    if (this.bookGroup && !this.gameState.bookOpened && !this.settings.reducedMotion) {
      this.bookGroup.position.y = 1.25 + Math.sin(elapsedTime * 2.0) * 0.05;
      this.bookGroup.rotation.y = 0.2 + Math.cos(elapsedTime * 1.5) * 0.04;
    }

    // 旋轉星芒之石
    if (this.starStone && this.starStone.visible && !this.settings.reducedMotion) {
      this.starStone.rotation.y += delta * 1.2;
      this.starStone.rotation.x += delta * 0.8;
    }

    // 旋轉花之石
    if (this.flowerStone && this.flowerStone.visible && !this.settings.reducedMotion) {
      this.flowerStone.rotation.y += delta * 1.2;
      this.flowerStone.rotation.z += delta * 0.6;
    }

    // 粒子緩慢漂浮與微風浮動
    if (this.dustParticles && !this.settings.reducedMotion) {
      this.dustParticles.rotation.y = elapsedTime * 0.025;
      this.dustParticles.position.y = Math.sin(elapsedTime * 0.6) * 0.12;
    }

    if (this.candleLight && this.gameState.candleLit) {
      this.candleLight.intensity = this.settings.reducedMotion ? 1.8 : 1.75 + Math.sin(elapsedTime*9)*.07;
      this.candleFlame.scale.y = this.settings.reducedMotion ? 1 : 1+Math.sin(elapsedTime*11)*.08;
    }
    this.updatePlayer(delta);
    this.updateRaycast();

    if (this.minimap) {
      this.minimap.update();
    }

    if (this.scavengerHunt) {
      this.scavengerHunt.update(delta);
    }

    this.targetFocus?.update(elapsedTime,this.settings.reducedMotion);
    this.renderer.render(this.scene, this.camera);
    if (this.frameMetrics && this.frameCadence.sample) this.frameMetrics.record(rawDelta * 1000);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.world3D = new World3D();
});
