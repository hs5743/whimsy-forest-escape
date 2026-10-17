/**
 * ModelAssetManager
 * 負責載入與管理 Blender 製作的高質感 GLTF/GLB 3D 模型資產
 * 無縫注入現有 Three.js 世界與章節場景，並完整保留原本的所有遊戲邏輯與互動事件。
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
        grimoire: 'assets/models/grimoire.glb',
        cat_mimic: 'assets/models/cat_mimic.glb',
        candlestick: 'assets/models/candlestick.glb',
        alchemy_table: 'assets/models/alchemy_table.glb',
        study_desk: 'assets/models/study_desk.glb',
        grand_bookshelf: 'assets/models/grand_bookshelf.glb',
        study_exit_door: 'assets/models/study_exit_door.glb',
        lion_head: 'assets/models/lion_head.glb',
        festival_drum: 'assets/models/festival_drum.glb',
        chromatic_harmonica: 'assets/models/chromatic_harmonica.glb',
        greenhouse_botanical: 'assets/models/greenhouse_botanical.glb'
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
        console.log(`[ModelAssetManager] High-quality Blender models ready (${this.models.size}/${keys.length} loaded).`);
      });
    }

    cloneModel(key) {
      const gltf = this.models.get(key);
      if (!gltf || !gltf.scene) return null;
      return gltf.scene.clone(true);
    }

    /**
     * 升級 Zone 1 魔法書屋物件 (書桌、魔導書、古銅燭台、煉金台、貓咪寶箱怪、遠古石門、大書架)
     */
    upgradeStudyRoom(world3D) {
      if (!world3D) return;
      const T = root.THREE;

      // 1. 漂浮魔導書 (Grimoire)
      if (this.models.has('grimoire') && world3D.bookGroup) {
        const bookGltf = this.cloneModel('grimoire');
        if (bookGltf) {
          // 清除原本的 BoxGeometry 假書
          while (world3D.bookGroup.children.length > 0) {
            world3D.bookGroup.remove(world3D.bookGroup.children[0]);
          }

          bookGltf.scale.set(1.0, 1.0, 1.0);
          world3D.bookGroup.add(bookGltf);

          // 重新綁定鉸鏈與鑰匙
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
          world3D.deskGroup.add(deskGltf);

          const drawer = deskGltf.getObjectByName('DrawerMesh');
          if (drawer) {
            world3D.drawerMesh = drawer;
            drawer.userData = { id: 'drawer', name: '上鎖的書桌抽屜', hint: '需要黃銅鑰匙 (KEY)' };
            if (!world3D.interactables.includes(drawer)) {
              world3D.interactables.push(drawer);
            }
            if (world3D.gameState.drawerOpened) {
              drawer.position.y = -0.5; // Slide open forward
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
  }

  root.ModelAssetManager = new ModelAssetManager();
  if (typeof module !== 'undefined') {
    module.exports = root.ModelAssetManager;
  }
})(typeof window !== 'undefined' ? window : globalThis);
