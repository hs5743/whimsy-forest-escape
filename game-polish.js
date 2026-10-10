/* Shared runtime policies. No account or unlock data is stored here. */
(function (root) {
  'use strict';
  const defaults = { quality: 'auto', master:1, music:1, effects:1, voice:1, sensitivity: 1, reducedMotion: !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches) };
  function loadSettings(storage) {
    try { const s = JSON.parse(storage.getItem('whimsy.settings.v1')) || {};
      return { quality: ['auto','high','medium','low'].includes(s.quality) ? s.quality : 'auto',
        master: Number.isFinite(s.master) ? Math.max(0,Math.min(1,s.master)) : 1,
        music: Number.isFinite(s.music) ? Math.max(0,Math.min(1,s.music)) : 1,
        effects: Number.isFinite(s.effects) ? Math.max(0,Math.min(1,s.effects)) : 1,
        voice: Number.isFinite(s.voice) ? Math.max(0,Math.min(1,s.voice)) : 1,
        sensitivity: Number.isFinite(s.sensitivity) ? Math.max(.5, Math.min(1.5, s.sensitivity)) : 1,
        reducedMotion: typeof s.reducedMotion === 'boolean' ? s.reducedMotion : defaults.reducedMotion };
    } catch (_) { return {...defaults}; }
  }
  function frameDelta(delta) { return Number.isFinite(delta) ? Math.max(0, Math.min(.05, delta)) : 0; }
  function movePlayer(player, move, delta, blocked) {
    const dt = frameDelta(delta), steps = Math.max(1, Math.ceil(dt / (1 / 120)));
    const s = Math.sin(player.yaw), c = Math.cos(player.yaw);
    const dx = (-s * move.forward + c * move.right) * player.speed * dt / steps;
    const dz = (-c * move.forward - s * move.right) * player.speed * dt / steps;
    for (let i=0;i<steps;i++) {
      const x=player.pos.x, z=player.pos.z, r=player.radius || .45;
      if (!blocked(x+dx,z+dz,r)) { player.pos.x+=dx; player.pos.z+=dz; }
      else { if (!blocked(x+dx,z,r)) player.pos.x+=dx;
        if (!blocked(player.pos.x,z+dz,r)) player.pos.z+=dz; }
    }
  }
  function visible(obj) { for (let n=obj;n;n=n.parent) if (!n.visible) return false; return true; }
  function owner(obj, targets) { for(let n=obj;n;n=n.parent) if(targets.includes(n)) return n; return null; }
  function solid(hit) {
    const o=hit.object; if (!o.isMesh || !visible(o) || o.userData.nonBlocking) return false;
    const m=Array.isArray(o.material) ? o.material[hit.face ? hit.face.materialIndex : 0] : o.material;
    return m && m.visible && (!m.transparent || m.opacity > .25);
  }
  // Each world owns its scratch state; no retained targets after a scene switch.
  const targetScratch = new WeakMap();
  function resolveTarget(world, maxDistance=4) {
    if (!Number.isFinite(maxDistance) || maxDistance<=0) return null;
    const T=root.THREE;
    let s=targetScratch.get(world);
    if(!s) {s={targets:[],hits:[],blockers:[],forward:new T.Vector3(),box:new T.Box3(),center:new T.Vector3(),direction:new T.Vector3()};targetScratch.set(world,s);}
    const {targets,hits,blockers,forward,box,center,direction}=s;
    targets.length=hits.length=blockers.length=0;
    for(const o of world.interactables) if(visible(o)) targets.push(o);
    if(!targets.length) return null;
    world.scene.updateMatrixWorld(true); world.camera.updateMatrixWorld(true);
    const ray=world.raycaster,previousFar=ray.far;
    ray.far=maxDistance;
    try {
      ray.setFromCamera(world.mouseCoord,world.camera);
      ray.intersectObjects(targets,true,hits);
      ray.intersectObject(world.activeZoneGroup,true,blockers);
      const first=hits.find(h=>visible(h.object)),blocker=blockers.find(solid);
      if(first && (!blocker || blocker.distance>=first.distance-.03 || owner(blocker.object,targets)===owner(first.object,targets))) return owner(first.object,targets);
      world.camera.getWorldDirection(forward);
      const origin=world.camera.position;
      let best=null,bestScore=Infinity;
      for(const target of targets) {
        box.setFromObject(target); if(box.isEmpty()) continue; box.getCenter(center);
        direction.copy(center).sub(origin); const distance=direction.length();
        if(distance>0 && distance<=maxDistance) {
          direction.normalize(); const alignment=direction.dot(forward);
          if(alignment<Math.cos(12*Math.PI/180)) continue;
          ray.set(origin,direction); blockers.length=0;
          ray.intersectObject(world.activeZoneGroup,true,blockers);
          const obstruction=blockers.find(solid);
          if(obstruction && obstruction.distance<distance-.03 && owner(obstruction.object,targets)!==target) continue;
          const score=(1-alignment)*20+distance*.06;
          if(score<bestScore) {bestScore=score;best=target;}
        }
      }
      return best;
    } finally {
      ray.far=previousFar;
      targets.length=hits.length=blockers.length=0;
    }
  }
  class FrameCadence {
    constructor() {this.mode=null;this.lastRender=null;this.sample=false;this.resumed=false;}
    reset() {this.mode=null;this.lastRender=null;this.sample=false;this.resumed=false;}
    shouldRender(now,hidden,contextLost,modalOpen) {
      this.sample=false;this.resumed=false;
      const mode=hidden||contextLost?'paused':modalOpen?'reading':'playing';
      const changed=mode!==this.mode;
      this.mode=mode;
      if(mode==='paused' || !Number.isFinite(now)) {this.lastRender=null;return false;}
      if(mode==='reading' && !changed && this.lastRender!==null && now>=this.lastRender && now-this.lastRender<50) return false;
      this.resumed=changed;
      this.sample=mode==='playing'&&!changed;
      this.lastRender=now;
      return true;
    }
  }
  function releaseGroup(group, sharedTextures) {
    const geometries=new Set(), materials=new Set(), textures=new Set();
    group.traverse(o=>{ if(o.geometry) geometries.add(o.geometry);
      for(const m of (Array.isArray(o.material)?o.material:[o.material])) if(m) materials.add(m);
      if(o.shadow && o.shadow.map) { o.shadow.map.dispose(); o.shadow.map=null; }
    });
    for(const m of materials) {
      for(const value of Object.values(m)) if(value && value.isTexture && !sharedTextures.has(value)) textures.add(value);
      if(m.uniforms) for(const u of Object.values(m.uniforms)) if(u.value && u.value.isTexture && !sharedTextures.has(u.value)) textures.add(u.value);
      m.dispose();
    }
    textures.forEach(t=>t.dispose()); geometries.forEach(g=>g.dispose());
  }
  function applyQuality(world) {
    const q=world.graphicQuality, size=q==='high'?2048:q==='medium'?1024:512;
    // One directional shadow caster per zone; local accent lights keep their colour.
    let chosen=null;
    world.activeZoneGroup.traverse(o=>{ if(o.isDirectionalLight && !chosen) chosen=o; });
    world.sunLight.intensity=chosen?0:(sceneProfiles[world.zoneManager?.currentZoneId || 'zone1']?.intensity || 1.15); world.sunLight.castShadow=!chosen && q!=='low';
    const lights=[world.sunLight]; world.activeZoneGroup.traverse(o=>{if(o.isLight) lights.push(o);});
    for(const light of lights) if(light.shadow) {
      light.castShadow=q!=='low' && (light===chosen || (!chosen && light===world.sunLight));
      if(light.shadow.mapSize.width!==size || !light.castShadow) {
        if(light.shadow.map) { light.shadow.map.dispose(); light.shadow.map=null; }
        light.shadow.mapSize.set(size,size);
      }
      light.shadow.bias=-.0003; light.shadow.normalBias=.025;
      if(light===chosen) { const c=light.shadow.camera; c.left=c.bottom=-35; c.right=c.top=35; c.far=120; c.updateProjectionMatrix(); }
    }
    if(world.dustParticles) {
      world.dustParticles.geometry.setDrawRange(0,q==='high'?100:q==='medium'?45:0);
      world.dustParticles.material.opacity=.28;
      world.dustParticles.visible=!world.settings.reducedMotion && q!=='low';
    }
    world.activeZoneGroup.traverse(o=>{
      if(o.isPoints && o.geometry.attributes.position && !o.userData.fullCount) o.userData.fullCount=o.geometry.attributes.position.count;
      if(o.isPoints && o.geometry.attributes.position) { o.geometry.setDrawRange(0,Math.floor(o.userData.fullCount*(q==='high'?1:q==='medium'?.5:.15))); o.visible=!world.settings.reducedMotion; }
    });
  }
  function actionText(world, target) {
    const s=world.gameState;
    const actions={candle:s.candleLit?'查看燭台':'點亮燭台',book:s.bookOpened&&!s.hasKey?'取得鑰匙':'閱讀魔導書',drawer:s.drawerOpened?'查看抽屜':'用鑰匙開啟抽屜',alchemy:'調配魔藥',flower:'取得蒼月花石刻',mimic:s.mimicFed?'和寶箱怪打招呼':s.hasFish?'餵食貓咪寶箱怪':'查看貓咪寶箱怪',door:s.doorOpened?'查看敞開的石門':'解開石門封印'};
    return actions[target.userData.id] || target.userData.name || target.userData.label || '探索魔法物件';
  }
  function taskText(state,zone) {
    if(zone!=='zone1') return '探索附近的魔法物件 · 對準後按 E 或互動';
    if(!state.candleLit) return '第一步 · 找到銅燭台，詠唱 LIGHT';
    if(!state.hasKey) return '第二步 · 閱讀魔導書，取得 KEY';
    if(!state.hasRedPotion) return '第三步 · 用鑰匙打開抽屜，取得 RED';
    if(!state.alchemyMixed) return '第四步 · 在煉金台融合魔藥，取得 STAR';
    if(!state.hasFlowerStone) return state.mimicFed?'第五步 · 對準花石刻，詠唱 FLOWER':'第五步 · 餵飽貓咪寶箱怪，取得 FLOWER';
    if(!state.doorOpened) return '最後一步 · 對準石門，詠唱 DOOR 與 OPEN';
    return state.escaped?'書齋完成 · 沿花田路標前往微風市集':'石門已開 · 走進花田，詠唱 SUN';
  }
  function isLocalPreview() { return typeof location !== 'undefined' && ['localhost','127.0.0.1','[::1]'].includes(location.hostname) && new URLSearchParams(location.search).get('dev') === '1'; }
  const sceneProfiles={
    zone1:{exposure:1.08,key:0xfffaed,intensity:1.15,sky:0xfff6e8,ground:0x8f7259,fill:.65},
    zone2:{exposure:1,key:0xffedce,intensity:1.25,sky:0xffedd5,ground:0x65513b,fill:.75},
    zone3:{exposure:1,key:0xfff2ce,intensity:1.2,sky:0xd9f2f4,ground:0x425c3f,fill:.75},
    zone4:{exposure:1,key:0xfff7e5,intensity:1.25,sky:0xe0f2fe,ground:0x466144,fill:.75},
    zone5:{exposure:1.1,key:0xabc9ff,intensity:.8,sky:0x647ca4,ground:0x26263b,fill:.7},
    zone6:{exposure:1,key:0xffefd7,intensity:1.15,sky:0xbae6ed,ground:0x335a61,fill:.8},
    zone7:{exposure:1.06,key:0xbed9ff,intensity:.85,sky:0x6f88ba,ground:0x292947,fill:.8},
    zone8:{exposure:1.03,key:0xd7ebff,intensity:1,sky:0xabcddb,ground:0x34455f,fill:.85},
    zone9:{exposure:1,key:0xffedc4,intensity:1.1,sky:0xc4d1e8,ground:0x34314d,fill:.85},
    zone10:{exposure:.98,key:0xfff3da,intensity:1.15,sky:0xdaedf3,ground:0x416879,fill:.85}
  };
  function applySceneStyle(world,zoneId) {
    const profile=sceneProfiles[zoneId] || sceneProfiles.zone1;
    let localFill=null,keyLight=null;
    world.activeZoneGroup.updateMatrixWorld(true);
    world.activeZoneGroup.traverse(o=>{
      if(o.isHemisphereLight && !localFill) localFill=o;
      if(o.isDirectionalLight && !keyLight) keyLight=o;
      if(!o.isMesh) return;
      const materials=Array.isArray(o.material)?o.material:[o.material];
      const lit=materials.some(m=>m?.isMeshStandardMaterial || m?.isMeshPhongMaterial || m?.isMeshLambertMaterial);
      o.receiveShadow=lit;
      if(lit && o.geometry) {
        o.geometry.computeBoundingSphere();
        const radius=o.geometry.boundingSphere.radius*Math.max(Math.abs(o.scale.x),Math.abs(o.scale.y),Math.abs(o.scale.z));
        o.castShadow=radius>.06&&radius<18&&!['PlaneGeometry','CircleGeometry','RingGeometry'].includes(o.geometry.type)&&materials.some(m=>m&&!m.transparent);
      } else o.castShadow=false;
      for(const m of materials) if(m?.isMeshStandardMaterial) m.envMapIntensity=zoneId==='zone1'?.35:.55;
    });
    const fill=localFill || world.hemiLight;
    if(world.hemiLight) world.hemiLight.intensity=localFill?0:profile.fill;
    if(fill) {fill.color.setHex(profile.sky);fill.groundColor.setHex(profile.ground);fill.intensity=profile.fill;}
    const sun=keyLight || world.sunLight;
    if(sun) {sun.color.setHex(profile.key);sun.intensity=profile.intensity;}
    world.renderer.toneMappingExposure=profile.exposure;
  }
  class TargetFocus {
    constructor(scene) {
      const T=root.THREE;
      this.box=new T.Box3();this.center=new T.Vector3();this.size=new T.Vector3();
      this.ring=new T.Mesh(new T.RingGeometry(.92,1,48),new T.MeshBasicMaterial({color:0xffe4a3,transparent:true,opacity:.65,depthWrite:false,side:T.DoubleSide}));
      this.ring.rotation.x=-Math.PI/2;this.ring.visible=false;this.ring.userData.nonBlocking=true;
      scene.add(this.ring);this.scene=scene;
    }
    select(target) {this.target=target;this.ring.visible=!!target;if(target) this.update(0,true);}
    update(time,reducedMotion) {
      if(!this.target) return;
      if(!visible(this.target) || !this.target.parent) {this.select(null);return;}
      this.box.setFromObject(this.target);if(this.box.isEmpty()) {this.ring.visible=false;return;}
      this.box.getCenter(this.center);this.box.getSize(this.size);
      const radius=Math.max(.35,Math.min(1.25,Math.max(this.size.x,this.size.z)*.7));
      this.ring.position.set(this.center.x,this.box.min.y+.025,this.center.z);
      this.ring.scale.set(radius,radius,1);this.ring.material.opacity=reducedMotion?.65:.6+Math.sin(time*2)*.08;
    }
    dispose() {this.scene.remove(this.ring);this.ring.geometry.dispose();this.ring.material.dispose();this.target=null;}
  }
  const api={FrameCadence,applySceneStyle,sceneProfiles,TargetFocus,isLocalPreview,loadSettings,frameDelta,movePlayer,resolveTarget,releaseGroup,applyQuality,actionText,taskText};
  root.GamePolish=api; if(typeof module!=='undefined') module.exports=api;
  if(root.document) root.addEventListener('load',()=>{
    const world=root.world3D; if(!world) return;
    root.document.body.classList.toggle("dev-preview",world.devMode);
    const card=root.document.getElementById('playerAdventurerPill');
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ') {e.preventDefault();card.click();}});
    const dialogStates=new Map();
    function syncDialogs(trigger) {
      for(const modal of root.document.querySelectorAll('[id$="Modal"],#systemMenuDrawer')) {
        if(modal.id==='speechModal') continue;
        const state=dialogStates.get(modal)||{shown:false,returnFocus:null};
        const visible=getComputedStyle(modal).display!=='none';
        if(visible && !state.shown) {
          state.returnFocus=trigger || root.document.activeElement;
          modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
          const heading=modal.querySelector('h1,h2,h3,.drawer-title');
          modal.setAttribute('aria-label',heading?.textContent || '冒險視窗');
          modal.querySelector('button,select,input')?.focus({preventScroll:true});
        } else if(!visible && state.shown) {
          modal.removeAttribute('aria-modal');
          if(state.returnFocus?.isConnected && state.returnFocus.getClientRects().length) state.returnFocus.focus({preventScroll:true});
          else root.document.getElementById('renderCanvas')?.focus({preventScroll:true});
        }
        state.shown=visible;dialogStates.set(modal,state);
      }
    }
    root.document.addEventListener('click',e=>{const trigger=e.target.closest('button,[role="button"]');queueMicrotask(()=>syncDialogs(trigger));});
    root.addEventListener('keyup',()=>queueMicrotask(()=>syncDialogs(null)));
    root.document.addEventListener('keydown',e=>{
      if(e.key==='Escape') {
        const dialog=Array.from(root.document.querySelectorAll('[aria-modal=true]')).find(el=>getComputedStyle(el).display!=='none');
        if(dialog && dialog.id!=='speechModal') dialog.querySelector('button.modal-close-btn,button[aria-label="關閉"]')?.click();
      }
      if(e.key!=='Tab') return;
      const modal = Array.from(root.document.querySelectorAll('[aria-modal=true]')).find(el=>getComputedStyle(el).display!=='none');
      if(!modal) return;
      const controls=Array.from(modal.querySelectorAll('button,select,input,a[href],[tabindex="0"]')).filter(el=>!el.disabled && el.getClientRects().length);
      if(!controls.length) return;
      const first=controls[0],last=controls[controls.length-1];
      if(e.shiftKey && root.document.activeElement===first) {e.preventDefault();last.focus();}
      else if(!e.shiftKey && root.document.activeElement===last) {e.preventDefault();first.focus();}
    });
    const select=root.document.getElementById('qualityPreference'); select.value=world.settings.quality;
    select.addEventListener('change',()=>world.setQualityPreference(select.value));
    const sensitivity=root.document.getElementById('lookSensitivity'); sensitivity.value=world.settings.sensitivity;
    sensitivity.addEventListener('input',()=>{world.settings.sensitivity=Number(sensitivity.value);world.saveSettings();});
    const motion=root.document.getElementById('reduceMotion'); motion.checked=world.settings.reducedMotion;
    motion.addEventListener('change',()=>{world.settings.reducedMotion=motion.checked;world.saveSettings();api.applyQuality(world);});
    for(const key of ['master','music','effects','voice']) {
      const slider=root.document.getElementById('volume-'+key); slider.value=world.settings[key];
      slider.addEventListener('input',()=>{world.settings[key]=Number(slider.value);world.saveSettings();root.audioManager?.applyVolumes(world.settings);root.speechManager?.applyVoiceVolume();});
    }
    root.audioManager?.applyVolumes(world.settings);
    if(world.devMode) {
      const panel=root.document.getElementById('devZonePanel'); panel.hidden=false;
      const zones=root.document.getElementById('devZoneSelect');
      for(const [id,zone] of Object.entries(world.zoneManager.zones)) zones.add(new Option(zone.name,id));
      zones.addEventListener('change',()=>world.switchZone(zones.value));
    }
  });
})(typeof window!=='undefined'?window:globalThis);
