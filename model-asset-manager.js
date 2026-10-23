/**
 * ModelAssetManager
 * 負責載入與管理 Blender 製作的高質感 GLTF/GLB 3D 模型資產
 * 無縫注入現有 Three.js 世界與各章節生活冒險場景，並完整保留原本的所有遊戲邏輯、語音辨識、GEPT 題庫與互動事件。
 */
(function(root) {
  'use strict';

  class ModelAssetManager {
    constructor() {
      this.models = new Map();
      this.loadingPromises = new Map();
      this.loader = null;
      this.isReady = false;

      this.manifest = {
        // Zone 1: Apprentice Study (見習學徒書齋)
        grimoire: 'assets/models/grimoire.glb',
        cat_mimic: 'assets/models/cat_mimic.glb',
        candlestick: 'assets/models/candlestick.glb',
        alchemy_table: 'assets/models/alchemy_table.glb',
        study_desk: 'assets/models/study_desk.glb',
        grand_bookshelf: 'assets/models/grand_bookshelf.glb',
        study_exit_door: 'assets/models/study_exit_door.glb',

        // Zone 2: Bazaar Marketplace (陽光微風市集)
        market_stall: 'assets/models/market_stall.glb',
        market_cart: 'assets/models/market_cart.glb',

        // Zone 3: Beast Sanctuary Garden (守護獸之森花園)
        marble_fountain: 'assets/models/marble_fountain.glb',

        // Zone 5: Clocktower Train Station (星光鐘樓車站)
        steam_locomotive: 'assets/models/steam_locomotive.glb',
        station_clocktower: 'assets/models/station_clocktower.glb',

        // Zone 6: Azure Fantasy Harbor (蔚藍秘境海港)
        harbor_galleon: 'assets/models/harbor_galleon.glb',
        harbor_lighthouse: 'assets/models/harbor_lighthouse.glb',

        // Zone 7: Celestial Starlight Observatory (雲頂星空觀測站)
        celestial_telescope: 'assets/models/celestial_telescope.glb',
        astrolabe_sphere: 'assets/models/astrolabe_sphere.glb',

        // Zone 8: Aurora Frost Sanctuary (極光冰雪聖域)
        glacial_obelisk: 'assets/models/glacial_obelisk.glb',

        // Zone 11: Magic Restaurant (魔法餐廳：一碗熱湯的冒險)
        restaurant_kitchen_hearth: 'assets/models/restaurant_kitchen_hearth.glb',
        tavern_dining_table: 'assets/models/tavern_dining_table.glb',

        // Zone 12: School Adventure (新港國小舞獅與節慶大鼓)
        lion_head: 'assets/models/lion_head.glb',
        festival_drum: 'assets/models/festival_drum.glb',

        // Zone 13: Chromatic Harmonica Gallery (半音階口琴展館)
        chromatic_harmonica: 'assets/models/chromatic_harmonica.glb',

        // Zone 14: Glass Conservatory (玻璃溫室奇幻蘭花與蜜蜂)
        greenhouse_botanical: 'assets/models/greenhouse_botanical.glb',

        // Zone 15: Starlight Airport (星光國際機場噴射客機)
        airport_plane: 'assets/models/airport_plane.glb'
      };
    }

    getLoader() {
      if (!this.loader && root.THREE && root.THREE.GLTFLoader) {
        this.loader = new root.THREE.GLTFLoader();
      }
      return this.loader;
    }

    load(key) {
      if (this.models.has(key)) {
        return Promise.resolve(this.models.get(key));
      }
      if (this.loadingPromises.has(key)) {
        return this.loadingPromises.get(key);
      }
      const url = this.manifest[key];
      if (!url) {
        return Promise.reject(new Error(`Model key not found in manifest: ${key}`));
      }

      const loader = this.getLoader();
      if (!loader) {
        return Promise.reject(new Error('THREE.GLTFLoader is not available. Ensure GLTFLoader.js is loaded.'));
      }

      const promise = new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            const scene = gltf.scene;
            scene.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  child.material.roughness = Math.min(1.0, (child.material.roughness ?? 0.5));
                }
              }
            });
            this.models.set(key, gltf);
            resolve(gltf);
          },
          undefined,
          (err) => {
            console.warn(`[ModelAssetManager] Failed to load ${url}:`, err);
            reject(err);
          }
        );
      });

      this.loadingPromises.set(key, promise);
      return promise;
    }

    loadAll() {
      const keys = Object.keys(this.manifest);
      return Promise.allSettled(keys.map((k) => this.load(k))).then(() => {
        this.isReady = true;
        console.log(`[ModelAssetManager] High-quality Blender PBR models ready (${this.models.size}/${keys.length} loaded).`);
      });
    }

    cloneModel(key) {
      const gltf = this.models.get(key);
      if (!gltf || !gltf.scene) return null;
      return gltf.scene.clone(true);
    }

    /**
     * 升級 Zone 1 魔法書齋物件 (書桌、魔導書、古銅燭台、煉金台、貓咪寶箱怪、遠古石門、大書架)
     */
    upgradeStudyRoom(world3D) {
      if (!world3D) return;
      const T = root.THREE;

      // 1. 漂浮魔導書 (Grimoire)
      if (this.models.has('grimoire') && world3D.bookGroup) {
        const bookGltf = this.cloneModel('grimoire');
        if (bookGltf) {
          while (world3D.bookGroup.children.length > 0) {
            world3D.bookGroup.remove(world3D.bookGroup.children[0]);
          }
          bookGltf.scale.set(1.0, 1.0, 1.0);
          world3D.bookGroup.add(bookGltf);

          const hinge = bookGltf.getObjectByName('BookCoverHinge');
          if (hinge) {
            world3D.bookCoverHinge = hinge;
          }
          const key = bookGltf.getObjectByName('KeyMesh');
          if (key) {
            world3D.keyMesh = key;
            key.visible = world3D.gameState.bookOpened && !world3D.gameState.hasKey;
          }
        }
      }

      // 2. 貓咪寶箱怪 (Cat Mimic)
      if (this.models.has('cat_mimic') && world3D.mimicGroup) {
        const mimicGltf = this.cloneModel('cat_mimic');
        if (mimicGltf) {
          while (world3D.mimicGroup.children.length > 0) {
            world3D.mimicGroup.remove(world3D.mimicGroup.children[0]);
          }
          mimicGltf.scale.set(1.0, 1.0, 1.0);
          world3D.mimicGroup.add(mimicGltf);

          const lid = mimicGltf.getObjectByName('MimicLid');
          if (lid) {
            world3D.mimicLid = lid;
            if (world3D.gameState.mimicFed) {
              lid.rotation.x = -Math.PI / 3;
            }
          }
        }
      }

      // 3. 古銅燭台與圓几 (Candlestick)
      if (this.models.has('candlestick')) {
        const candleGltf = this.cloneModel('candlestick');
        if (candleGltf && world3D.candleGroup) {
          while (world3D.candleGroup.children.length > 0) {
            world3D.candleGroup.remove(world3D.candleGroup.children[0]);
          }
          candleGltf.scale.set(1.0, 1.0, 1.0);
          // The PBR asset contains its own round table. Keep the original
          // procedural candle anchor, but remove the standalone fallback table.
          world3D.candleGroup.position.set(-3.2, 0, -3.5);
          if (world3D.candleTableMesh) {
            world3D.candleTableMesh.parent?.remove(world3D.candleTableMesh);
            world3D.candleTableMesh = null;
          }
          world3D.candleGroup.add(candleGltf);

          const flame = candleGltf.getObjectByName('CandleFlame');
          if (flame) {
            world3D.candleFlame = flame;
            flame.material.transparent = true;
            flame.material.opacity = world3D.gameState.candleLit ? 1 : 0;
          }
          if (world3D.candleLight) {
            world3D.candleGroup.add(world3D.candleLight);
          }
        }
      }

      // 4. 元素煉金台 (Alchemy Table)
      if (this.models.has('alchemy_table') && world3D.alchemyGroup) {
        const tableGltf = this.cloneModel('alchemy_table');
        if (tableGltf) {
          while (world3D.alchemyGroup.children.length > 0) {
            world3D.alchemyGroup.remove(world3D.alchemyGroup.children[0]);
          }
          tableGltf.scale.set(1.0, 1.0, 1.0);
          // Procedural props stored their room coordinates in each child;
          // the imported model is authored around a local origin instead.
          world3D.alchemyGroup.position.set(-4.5, 0, 0);
          world3D.alchemyGroup.add(tableGltf);

          const liquid = tableGltf.getObjectByName('FlaskLiquid');
          if (liquid) {
            world3D.flaskLiquid = liquid;
            if (world3D.gameState.hasBluePotion) {
              liquid.material.color.setHex(0x9955ff);
            }
          }
          const star = tableGltf.getObjectByName('StarStone');
          if (star) {
            world3D.starStone = star;
            star.visible = world3D.gameState.alchemyMixed && !world3D.gameState.hasStarStone;
          }
        }
      }

      // 5. 書桌 (Study Desk)
      if (this.models.has('study_desk') && world3D.deskGroup) {
        const deskGltf = this.cloneModel('study_desk');
        if (deskGltf) {
          while (world3D.deskGroup.children.length > 0) {
            world3D.deskGroup.remove(world3D.deskGroup.children[0]);
          }
          deskGltf.scale.set(1.0, 1.0, 1.0);
          deskGltf.position.set(0, 0, -3.8);
          world3D.deskGroup.add(deskGltf);

          const drawer = deskGltf.getObjectByName('DrawerMesh');
          if (drawer) {
            world3D.drawerMesh = drawer;
            drawer.userData = { id: 'drawer', name: '上鎖的書桌抽屜', hint: '需要黃銅鑰匙 (KEY)' };
            world3D.drawerTravel = { closedZ: 0, openZ: 0.5 };
            if (!world3D.interactables.includes(drawer)) {
              world3D.interactables.push(drawer);
            }
            if (world3D.gameState.drawerOpened) {
              drawer.position.z = world3D.drawerTravel.openZ;
            }
          }
        }
      }

      // 6. 遠古石門 (Study Exit Door)
      if (this.models.has('study_exit_door') && world3D.doorGroup) {
        const doorGltf = this.cloneModel('study_exit_door');
        if (doorGltf) {
          while (world3D.doorGroup.children.length > 0) {
            world3D.doorGroup.remove(world3D.doorGroup.children[0]);
          }
          doorGltf.scale.set(1.0, 1.0, 1.0);
          doorGltf.position.set(0, 0, 5.8);
          world3D.doorGroup.add(doorGltf);

          const dLeft = doorGltf.getObjectByName('DoorLeft');
          const dRight = doorGltf.getObjectByName('DoorRight');
          const sStar = doorGltf.getObjectByName('SocketStar');
          const sFlower = doorGltf.getObjectByName('SocketFlower');

          if (dLeft) world3D.doorLeft = dLeft;
          if (dRight) world3D.doorRight = dRight;
          if (sStar) world3D.socketStar = sStar;
          if (sFlower) world3D.socketFlower = sFlower;

          if (world3D.gameState.doorStonePlaced && sStar && sFlower) {
            sStar.material.color.setHex(0xffe600);
            sFlower.material.color.setHex(0x4da6ff);
          }
          if (world3D.gameState.doorOpened && dLeft && dRight) {
            dLeft.position.x = -1.7;
            dRight.position.x = 1.7;
          }
        }
      }

      console.log('[ModelAssetManager] Zone 1 Study Room upgraded with Blender models successfully!');
    }

    /**
     * 升級 Zone 2 陽光微風市集 (水果攤位與手推車)
     */
    upgradeMarketStall(stallGroup, fruitType) {
      if (!stallGroup || !this.models.has('market_stall')) return;
      const stallModel = this.cloneModel('market_stall');
      if (!stallModel) return;

      // 隱藏原本簡化方塊與圓柱，保留 hitBox 判定
      stallGroup.children.forEach((child) => {
        if (!child.userData || !child.userData.id) {
          child.visible = false;
        }
      });

      stallModel.scale.set(1.15, 1.15, 1.15);
      stallGroup.add(stallModel);
      console.log(`[ModelAssetManager] Market Stall (${fruitType}) upgraded with Blender PBR model!`);
    }

    upgradeMarketCart(cartGroup, cartType) {
      if (!cartGroup || !this.models.has('market_cart')) return;
      const cartModel = this.cloneModel('market_cart');
      if (!cartModel) return;

      cartGroup.children.forEach((child) => {
        if (!child.userData || !child.userData.id) {
          child.visible = false;
        }
      });

      cartModel.scale.set(1.1, 1.1, 1.1);
      cartGroup.add(cartModel);
      console.log(`[ModelAssetManager] Market Cart (${cartType}) upgraded with Blender PBR model!`);
    }

    /**
     * 升級 Zone 3 守護獸花園大理石噴泉
     */
    upgradeGardenFountain(fountainGroup) {
      if (!fountainGroup || !this.models.has('marble_fountain')) return;
      const fountainModel = this.cloneModel('marble_fountain');
      if (!fountainModel) return;

      // 隱藏原本的三維幾何，保留 hitBox 與 sprayPoints 水花粒子
      fountainGroup.children.forEach((child) => {
        if (child.isMesh && (!child.userData || !child.userData.id)) {
          child.visible = false;
        }
      });

      fountainModel.scale.set(1.0, 1.0, 1.0);
      fountainGroup.add(fountainModel);
      console.log('[ModelAssetManager] Beast Garden Marble Fountain upgraded with Blender PBR model!');
    }

    /**
     * 升級 Zone 5 星光鐘樓車站 (蒸汽火車頭與天文時鐘塔)
     */
    upgradeSteamLocomotive(trainGroup) {
      if (!trainGroup || !this.models.has('steam_locomotive')) return;
      const locoModel = this.cloneModel('steam_locomotive');
      if (!locoModel) return;

      trainGroup.children.forEach((child) => {
        if (child.isMesh && (!child.userData || !child.userData.id)) {
          child.visible = false;
        }
      });

      // 旋轉並對齊鐵道
      locoModel.rotation.y = Math.PI / 2;
      locoModel.scale.set(1.05, 1.05, 1.05);
      trainGroup.add(locoModel);
      console.log('[ModelAssetManager] Steam Locomotive upgraded with Blender PBR model!');
    }

    upgradeClockTower(towerGroup) {
      if (!towerGroup || !this.models.has('station_clocktower')) return;
      const towerModel = this.cloneModel('station_clocktower');
      if (!towerModel) return;

      towerGroup.children.forEach((child) => {
        if (child.isMesh && (!child.userData || !child.userData.id)) {
          child.visible = false;
        }
      });

      towerModel.scale.set(1.0, 1.0, 1.0);
      towerGroup.add(towerModel);
      console.log('[ModelAssetManager] Station Clocktower upgraded with Blender PBR model!');
    }

    /**
     * 升級 Zone 6 蔚藍秘境海港 (三桅帆船與旋轉燈塔)
     */
    upgradeGalleonShip(shipGroup) {
      if (!shipGroup || !this.models.has('harbor_galleon')) return;
      const galleonModel = this.cloneModel('harbor_galleon');
      if (!galleonModel) return;

      shipGroup.children.forEach((child) => {
        if (child.isMesh && (!child.userData || !child.userData.id)) {
          child.visible = false;
        }
      });

      galleonModel.rotation.y = Math.PI;
      galleonModel.scale.set(1.15, 1.15, 1.15);
      shipGroup.add(galleonModel);
      console.log('[ModelAssetManager] Harbor Galleon Ship upgraded with Blender PBR model!');
    }

    upgradeHarborLighthouse(lighthouseGroup) {
      if (!lighthouseGroup || !this.models.has('harbor_lighthouse')) return;
      const lighthouseModel = this.cloneModel('harbor_lighthouse');
      if (!lighthouseModel) return;

      lighthouseGroup.children.forEach((child) => {
        if (child.isMesh && (!child.userData || !child.userData.id)) {
          child.visible = false;
        }
      });

      lighthouseModel.scale.set(1.0, 1.0, 1.0);
      lighthouseGroup.add(lighthouseModel);
      console.log('[ModelAssetManager] Coastal Lighthouse upgraded with Blender PBR model!');
    }

    /**
     * 升級 Zone 7 雲頂星空觀測站 (巨型折射望遠鏡與渾天儀)
     */
    upgradeTelescope(telescopeGroup) {
      if (!telescopeGroup || !this.models.has('celestial_telescope')) return;
      const telescopeModel = this.cloneModel('celestial_telescope');
      if (!telescopeModel) return;

      telescopeGroup.children.forEach((child) => {
        if (child.isMesh && (!child.userData || !child.userData.id)) {
          child.visible = false;
        }
      });

      telescopeModel.scale.set(1.2, 1.2, 1.2);
      telescopeGroup.add(telescopeModel);
      console.log('[ModelAssetManager] Grand Refractor Telescope upgraded with Blender PBR model!');
    }

    upgradeAstrolabe(astrolabeGroup) {
      if (!astrolabeGroup || !this.models.has('astrolabe_sphere')) return;
      const astrolabeModel = this.cloneModel('astrolabe_sphere');
      if (!astrolabeModel) return;

      astrolabeGroup.children.forEach((child) => {
        if (child.isMesh && (!child.userData || !child.userData.id)) {
          child.visible = false;
        }
      });

      astrolabeModel.scale.set(1.15, 1.15, 1.15);
      astrolabeGroup.add(astrolabeModel);
      console.log('[ModelAssetManager] Celestial Astrolabe Sphere upgraded with Blender PBR model!');
    }

    /**
     * 升級 Zone 8 極光冰雪聖域 (極寒玄冰方尖碑)
     */
    upgradeGlacialObelisk(obeliskGroup) {
      if (!obeliskGroup || !this.models.has('glacial_obelisk')) return;
      const obeliskModel = this.cloneModel('glacial_obelisk');
      if (!obeliskModel) return;

      obeliskGroup.children.forEach((child) => {
        if (child.isMesh && (!child.userData || !child.userData.id)) {
          child.visible = false;
        }
      });

      obeliskModel.scale.set(1.0, 1.0, 1.0);
      obeliskGroup.add(obeliskModel);
      console.log('[ModelAssetManager] Glacial Ice Obelisk upgraded with Blender PBR model!');
    }

    /**
     * 升級 Zone 11 魔法餐廳 (烹飪爐灶、大湯鍋與餐桌)
     */
    upgradeRestaurantScene(group, refs) {
      if (!group) return;
      if (this.models.has('restaurant_kitchen_hearth')) {
        const hearthModel = this.cloneModel('restaurant_kitchen_hearth');
        if (hearthModel) {
          hearthModel.position.set(0, 0, -4.5);
          hearthModel.scale.set(1.1, 1.1, 1.1);
          group.add(hearthModel);
          console.log('[ModelAssetManager] Restaurant Cooking Hearth & Cauldron upgraded!');
        }
      }

      if (this.models.has('tavern_dining_table')) {
        const tableModel = this.cloneModel('tavern_dining_table');
        if (tableModel) {
          tableModel.position.set(0, 0, 1.5);
          tableModel.scale.set(1.0, 1.0, 1.0);
          group.add(tableModel);
          console.log('[ModelAssetManager] Tavern Dining Table upgraded!');
        }
      }
    }

    /**
     * 升級 Zone 12 新港國小舞獅與大鼓
     */
    upgradeSchoolScene(headGroup, drumGroup, world3D) {
      if (headGroup && this.models.has('lion_head')) {
        const lionGltf = this.cloneModel('lion_head');
        if (lionGltf) {
          while (headGroup.children.length > 0) {
            headGroup.remove(headGroup.children[0]);
          }
          lionGltf.scale.set(1.1, 1.1, 1.1);
          headGroup.add(lionGltf);
          console.log('[ModelAssetManager] Traditional Southern Lion Head upgraded!');
        }
      }

      if (drumGroup && this.models.has('festival_drum')) {
        const drumGltf = this.cloneModel('festival_drum');
        if (drumGltf) {
          while (drumGroup.children.length > 0) {
            drumGroup.remove(drumGroup.children[0]);
          }
          drumGltf.scale.set(1.0, 1.0, 1.0);
          drumGroup.add(drumGltf);
          console.log('[ModelAssetManager] Traditional Festival Drum upgraded!');
        }
      }
    }

    /**
     * 升級 Zone 13 口琴展館中央展台口琴
     */
    upgradeHarmonicaScene(heroContainer) {
      if (heroContainer && this.models.has('chromatic_harmonica')) {
        const harmonicaGltf = this.cloneModel('chromatic_harmonica');
        if (harmonicaGltf) {
          while (heroContainer.children.length > 0) {
            heroContainer.remove(heroContainer.children[0]);
          }
          harmonicaGltf.scale.set(1.8, 1.8, 1.8);
          heroContainer.add(harmonicaGltf);
          console.log('[ModelAssetManager] Hero Chromatic Harmonica upgraded!');
        }
      }
    }

    /**
     * 升級 Zone 14 玻璃溫室魔法蘭花與熊蜂
     */
    upgradeGreenhouseScene(group) {
      if (group && this.models.has('greenhouse_botanical')) {
        const botGltf = this.cloneModel('greenhouse_botanical');
        if (botGltf) {
          botGltf.position.set(0, 0, -10);
          botGltf.scale.set(1.4, 1.4, 1.4);
          group.add(botGltf);
          console.log('[ModelAssetManager] Greenhouse Orchid & Bumblebee upgraded!');
        }
      }
    }

    /**
     * 升級 Zone 15 星光國際機場噴射客機
     */
    upgradeAirportScene(group) {
      if (group && this.models.has('airport_plane')) {
        const planeGltf = this.cloneModel('airport_plane');
        if (planeGltf) {
          planeGltf.position.set(0, 0.25, -10);
          planeGltf.scale.set(1.15, 1.15, 1.15);
          group.add(planeGltf);
          console.log('[ModelAssetManager] Starlight Airport Airliner upgraded!');
        }
      }
    }
  }

  root.ModelAssetManager = new ModelAssetManager();
  if (typeof module !== 'undefined') {
    module.exports = root.ModelAssetManager;
  }
})(typeof window !== 'undefined' ? window : globalThis);
