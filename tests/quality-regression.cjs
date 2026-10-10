const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const THREE=require('../three.min.js');
global.THREE=THREE;
const P=require('../game-polish.js');
const base=path.resolve(__dirname,'..');
function fixture() {
 const scene=new THREE.Scene(),group=new THREE.Group();scene.add(group);
 const camera=new THREE.PerspectiveCamera(65,1,.1,100);camera.updateMatrixWorld(true);
 return {scene,activeZoneGroup:group,camera,mouseCoord:new THREE.Vector2(),raycaster:new THREE.Raycaster(),interactables:[]};
}
function target(w,x=0,z=-2) {const o=new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.2),new THREE.MeshBasicMaterial());o.position.set(x,0,z);o.userData.id='target';w.activeZoneGroup.add(o);w.interactables.push(o);return o;}
function context() {
 const listeners={},elements={}; const localStorage={getItem:()=>null,setItem:()=>{}};
 const document={activeElement:{tagName:'BODY'},getElementById:id=>elements[id]||null,addEventListener:()=>{}};
 const window={document,localStorage,addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn),audioManager:null};
 const timers=[];const ctx=vm.createContext({window,document,navigator:{maxTouchPoints:0},performance:{now:()=>100},localStorage,console,GamePolish:P,VOCAB_DATA:{},THREE,location:{hostname:'127.0.0.1',search:'?dev=1'},URLSearchParams,setTimeout:fn=>(timers.push(fn),timers.length),clearTimeout:()=>{},setInterval:()=>{},getComputedStyle:()=>({display:'none'}),fetch:()=>{throw Error('Unexpected network call');}});
 return {ctx,window,document,listeners,elements,timers};
}
function load(c,file,exportName) {vm.runInContext(fs.readFileSync(path.join(base,file),'utf8')+';window.Exported='+exportName+';',c.ctx);return c.window.Exported;}
test('corrupt or blocked settings fall back safely',()=>{const s=P.loadSettings({getItem:()=>{throw Error('blocked');}});assert.equal(s.quality,'auto');assert.equal(s.voice,1);});
test('settings are bounded and invalid quality rejected',()=>{const s=P.loadSettings({getItem:()=>JSON.stringify({quality:'ultra',sensitivity:10,music:-2})});assert.equal(s.quality,'auto');assert.equal(s.sensitivity,1.5);assert.equal(s.music,0);});
test('stall frame movement is bounded',()=>{const p={pos:{x:0,z:0},yaw:0,speed:3.6,radius:.45};P.movePlayer(p,{forward:1,right:0},30,()=>false);assert.ok(Math.abs(p.pos.z+.18)<1e-9);});
test('substeps cannot cross a thin obstacle',()=>{const p={pos:{x:0,z:0},yaw:0,speed:20,radius:.01};P.movePlayer(p,{forward:1,right:0},.05,(x,z)=>z<-.3&&z>-.5);assert.ok(p.pos.z>=-.3);});
test('wall sliding evaluates second axis at updated position',()=>{const p={pos:{x:0,z:0},yaw:0,speed:3.6};P.movePlayer(p,{forward:1,right:1},.05,(x,z)=>x>.03);assert.ok(p.pos.x<=.03);assert.ok(p.pos.z<-.1);});
test('non-finite and negative time cannot move a player',()=>{assert.equal(P.frameDelta(NaN),0);assert.equal(P.frameDelta(-1),0);assert.equal(P.frameDelta(Infinity),0);});
test('direct aim selects an object',()=>{const w=fixture(),o=target(w);assert.equal(P.resolveTarget(w),o);});
test('aim assistance selects a small nearby object',()=>{const w=fixture(),o=target(w,.25);assert.equal(P.resolveTarget(w),o);});
test('objects behind the player are excluded',()=>{const w=fixture();target(w,0,1);assert.equal(P.resolveTarget(w),null);});
test('objects outside interaction range are excluded',()=>{const w=fixture();target(w,0,-6);assert.equal(P.resolveTarget(w),null);});
test('a wall blocks both direct and assisted interaction',()=>{const w=fixture();target(w,.2);const wall=new THREE.Mesh(new THREE.BoxGeometry(2,2,.1),new THREE.MeshBasicMaterial());wall.position.z=-1;w.activeZoneGroup.add(wall);assert.equal(P.resolveTarget(w),null);});
test('hidden ancestors exclude their targets',()=>{const w=fixture(),o=target(w);const hidden=new THREE.Group();hidden.visible=false;hidden.add(o);w.activeZoneGroup.add(hidden);assert.equal(P.resolveTarget(w),null);});
test('decorative transparent effects do not block interaction',()=>{const w=fixture(),o=target(w);const effect=new THREE.Mesh(new THREE.PlaneGeometry(3,3),new THREE.MeshBasicMaterial({transparent:true,opacity:.03}));effect.position.z=-1;w.activeZoneGroup.add(effect);assert.equal(P.resolveTarget(w),o);});
test('shared scene resources are preserved and exclusive ones disposed once',()=>{const group=new THREE.Group(),g=new THREE.BoxGeometry(),shared=new THREE.Texture(),owned=new THREE.Texture(),mat=new THREE.MeshBasicMaterial({map:shared,alphaMap:owned});let gs=0,ms=0,ts=0,ss=0;g.addEventListener('dispose',()=>gs++);mat.addEventListener('dispose',()=>ms++);owned.addEventListener('dispose',()=>ts++);shared.addEventListener('dispose',()=>ss++);group.add(new THREE.Mesh(g,mat),new THREE.Mesh(g,mat));P.releaseGroup(group,new Set([shared]));assert.deepEqual([gs,ms,ts,ss],[1,1,1,0]);});
test('UI surfaces never request world interaction',()=>{const c=context();load(c,'touch-controls.js','TouchControls');c.listeners.pointerdown[0]({target:{id:'systemMenuBtn'},isPrimary:true,button:0,pointerId:1,clientX:0,clientY:0});c.listeners.pointerup[0]({target:{id:'systemMenuBtn'},pointerId:1});assert.equal(c.window.touchControls.consumeInteract(),false);});
test('one short tap produces exactly one action',()=>{const c=context();load(c,'touch-controls.js','TouchControls');const e={target:{id:'renderCanvas'},isPrimary:true,button:0,pointerId:1,clientX:0,clientY:0};c.listeners.pointerdown[0](e);c.listeners.pointerup[0](e);assert.equal(c.window.touchControls.consumeInteract(),true);assert.equal(c.window.touchControls.consumeInteract(),false);});
test('a drag returning to origin is never a tap',()=>{const c=context();load(c,'touch-controls.js','TouchControls');const e={target:{id:'renderCanvas'},isPrimary:true,button:0,pointerId:1,clientX:0,clientY:0};c.listeners.pointerdown[0](e);c.listeners.pointermove[0]({...e,clientX:30});c.listeners.pointerup[0](e);assert.equal(c.window.touchControls.consumeInteract(),false);});
test('key repeat cannot repeatedly activate E',()=>{const c=context();load(c,'touch-controls.js','TouchControls');c.listeners.keydown[0]({code:'KeyE',key:'e',repeat:true});assert.equal(c.window.touchControls.consumeInteract(),false);});
test('blur resets keys, gestures and queued interaction',()=>{const c=context();load(c,'touch-controls.js','TouchControls');const controls=c.window.touchControls;controls.keys.KeyW=true;controls.interactRequested=true;controls.lookDelta.yaw=3;c.listeners.blur[0]();controls.update();assert.equal(controls.moveVector.forward,0);assert.equal(controls.consumeInteract(),false);assert.equal(controls.getLookDelta().yaw,0);});
test('cancelled speech cannot invoke a later session callback',()=>{const c=context(),Speech=load(c,'speech-manager.js','SpeechManager');const s=new Speech();let calls=0;s.defer(()=>calls++,900);s.stopListening();c.timers.forEach(fn=>fn());assert.equal(calls,0);});
test('local preview disables cloud writes, retries and login',async()=>{const c=context();c.ctx.GamePolish={...P,isLocalPreview:()=>true};c.window.GamePolish=c.ctx.GamePolish;const Cloud=load(c,'cloud-sync-manager.js','CloudSyncManager');const manager=new Cloud();await manager.recordWordPass('LIGHT');await manager.flushQueue();await manager.sendOrQueue({});const result=await manager.login('5','501','01','test');assert.equal(result.success,false);});
test('zone-bound delayed actions cannot affect a replacement scene',()=>{const c=context(),World=load(c,'world-3d.js','World3D');const w=Object.create(World.prototype);w.zoneTimers=new Set();w.activeZoneGroup={};let calls=0;w.scheduleZoneAction(()=>calls++,500);w.activeZoneGroup={};c.timers.forEach(fn=>fn());assert.equal(calls,0);});
test('inventory stays unique on repeated pickup',()=>{const c=context(),World=load(c,'world-3d.js','World3D');const w=Object.create(World.prototype);w.gameState={inventory:[]};w.addInventory('KEY','Key','#fff');w.addInventory('KEY','Key','#fff');assert.equal(w.gameState.inventory.length,1);});
test('all local JavaScript and inline scripts parse',()=>{for(const file of fs.readdirSync(base).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(base,file),'utf8'),{filename:file});const html=fs.readFileSync(path.join(base,'index.html'),'utf8');for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);});

for(const method of ['buildMarbleFountain','buildSteamLocomotive','buildObservatoryCosmicSky','buildGlacialAuroraSky','buildDriftingSnowfallSystem']) test(method+' particle buffers animate safely',()=>{
 const c=context(),Manager=load(c,'spatial-zone-manager.js','SpatialZoneManager'),m=Object.create(Manager.prototype);
 m.tex={marbleFountain:new THREE.Texture(),locomotivePlate:new THREE.Texture(),locomotive:new THREE.Texture()};m.world={animators:[],interactables:[]};m.getSoftParticleTexture=()=>null;
 const group=new THREE.Group();m[method](group,0,0,0,'test','TEST',()=>{});
 let count=0;group.traverse(o=>{if(o.isPoints) {assert.ok(o.geometry.attributes.position?.count>0);count++;}});assert.ok(count>0);
 m.world.animators.forEach(fn=>fn(1,1/60));
});
test('quality tiers change all local shadow casters and particle counts',()=>{
 const w=fixture();w.graphicQuality='medium';w.settings={reducedMotion:false};w.sunLight=new THREE.DirectionalLight();w.scene.add(w.sunLight);
 const local=new THREE.DirectionalLight(),accent=new THREE.PointLight();accent.castShadow=true;w.activeZoneGroup.add(local,accent);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(300),3));const points=new THREE.Points(geometry,new THREE.PointsMaterial());w.activeZoneGroup.add(points);
 P.applyQuality(w);assert.equal(local.shadow.mapSize.width,1024);assert.equal(local.castShadow,true);assert.equal(w.sunLight.castShadow,false);assert.equal(accent.castShadow,false);assert.equal(geometry.drawRange.count,50);
 w.graphicQuality='low';P.applyQuality(w);assert.equal(local.castShadow,false);assert.equal(geometry.drawRange.count,15);
 w.settings.reducedMotion=true;P.applyQuality(w);assert.equal(points.visible,false);
});

test('mouse look works over the touch look surface',()=>{const c=context();load(c,'touch-controls.js','TouchControls');c.listeners.mousedown[0]({button:0,target:{id:'touchLookArea'},clientX:100,clientY:100});c.listeners.mousemove[0]({clientX:110,clientY:120});assert.ok(c.window.touchControls.getLookDelta().yaw<0);});

test('environment cache evicts render targets and rebuilds safely',()=>{const c=context(),World=load(c,'world-3d.js','World3D'),w=Object.create(World.prototype);let disposed=0;w.scene={};w.graphicQuality='high';w.envMapCache={};w.zoneManager={currentZoneId:'zone2'};w.pmremGenerator={fromEquirectangular:()=>({texture:{},dispose:()=>disposed++})};for(const id of ['zone2','zone3','zone4']) {w.zoneManager.currentZoneId=id;w.updateEnvironmentFromTexture({image:{width:4}},id);}assert.equal(Object.keys(w.envMapCache).length,2);assert.equal(disposed,1);w.zoneManager.currentZoneId='zone2';w.updateEnvironmentFromTexture({image:{width:4}},'zone2');assert.equal(Object.keys(w.envMapCache).length,2);assert.equal(disposed,2);w.graphicQuality='low';w.updateEnvironmentFromTexture({image:{width:4}},'zone2');assert.equal(w.scene.environment,null);});

test('Escape ignores a speech dialog that is initially hidden by CSS',()=>{const c=context(),World=load(c,'world-3d.js','World3D'),w=Object.create(World.prototype);w.renderer={domElement:{addEventListener:()=>{}}};let closed=0;w.closeSpeechCard=()=>closed++;c.elements.speechModal={style:{display:''}};w.setupEvents();c.listeners.keydown[0]({code:'Escape'});assert.equal(closed,0);});

function textureFixture() {
 const c=context(),Manager=load(c,'spatial-zone-manager.js','SpatialZoneManager');
 const zm=Object.create(Manager.prototype);
 Object.assign(zm,{textureSources:new Map(),textureStatus:new Map(),textureManager:{},activeTextures:new Set(),world:{renderer:{capabilities:{getMaxAnisotropy:()=>8}}},refreshZoneEnvironment:()=>{}});
 c.document.createElement=()=>({width:2,height:2,getContext:()=>({fillRect:()=>{}})});
 const requests=[];vm.runInContext('THREE=Object.create(THREE)',c.ctx);
 c.ctx.THREE.ImageLoader=class {load(url,success,progress,error){requests.push({url,success,error});}};
 c.elements.assetLoadStatus={textContent:''};c.elements.sceneLoadNotice={hidden:true};c.elements.sceneLoadLabel={textContent:''};c.elements.sceneLoadRetry={hidden:true};
 return {...c,zm,requests};
}
test('texture variants reuse identical maps but isolate door UVs',()=>{
 const {zm}=textureFixture();const left=zm.getTexture('door.jpg','left'),right=zm.getTexture('door.jpg','right');
 assert.equal(zm.getTexture('door.jpg','left'),left);assert.notEqual(left,right);left.offset.x=.5;assert.equal(right.offset.x,0);
 assert.equal(zm.textureSources.size,2);
});
test('only scene textures are requested and duplicate requests are suppressed',()=>{
 const {zm,requests}=textureFixture(),active=zm.getTexture('active.jpg'),unused=zm.getTexture('unused.jpg');
 const group=new THREE.Group();group.add(new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({map:active})));
 zm.loadSceneTextures(group);zm.ensureTexture(active);assert.equal(requests.length,1);assert.equal(requests[0].url,'active.jpg');assert.equal(zm.textureStatus.has(unused),false);
});
test('texture timeout remains retryable and late callbacks cannot overwrite retry',()=>{
 const {zm,requests,timers,elements}=textureFixture(),texture=zm.getTexture('late.jpg');zm.activeTextures.add(texture);zm.ensureTexture(texture);
 timers[0]();assert.equal(zm.textureStatus.get(texture),'failed');assert.equal(elements.sceneLoadRetry.hidden,false);
 zm.retryTextures();assert.equal(requests.length,2);requests[0].success({width:8,height:8});assert.equal(zm.textureStatus.get(texture),'loading');
 requests[1].success({width:16,height:16});assert.equal(texture.image.width,16);assert.equal(zm.textureStatus.get(texture),'ready');assert.equal(elements.sceneLoadNotice.hidden,true);
});
test('retry targets failed active maps without reloading ready or inactive maps',()=>{
 const {zm,requests}=textureFixture(),failed=zm.getTexture('fail.jpg'),ready=zm.getTexture('ready.jpg'),old=zm.getTexture('old.jpg');
 zm.activeTextures=new Set([failed,ready]);zm.textureStatus.set(failed,'failed');zm.textureStatus.set(ready,'ready');zm.textureStatus.set(old,'failed');zm.retryTextures();
 assert.equal(requests.length,1);assert.equal(requests[0].url,'fail.jpg');
});
test('returning to study clears the previous outdoor reflection',()=>{
 const c=context(),Manager=load(c,'spatial-zone-manager.js','SpatialZoneManager'),calls=[];
 const zm=Object.create(Manager.prototype);Object.assign(zm,{tex:{},world:{updateEnvironmentFromTexture:(...args)=>calls.push(args)},ensureTexture:()=>{}});
 zm.setupZoneEnvironment('zone1');assert.equal(calls[0][0],null);assert.equal(calls[0][1],'zone1');
});
test('every realm has calibrated light and no doubled global fill',()=>{
 for(const id of Object.keys(P.sceneProfiles)) {
  const w=fixture();w.renderer={};w.sunLight=new THREE.DirectionalLight();w.hemiLight=new THREE.HemisphereLight();
  const sun=new THREE.DirectionalLight(),fill=new THREE.HemisphereLight();w.activeZoneGroup.add(sun,fill);
  P.applySceneStyle(w,id);assert.equal(w.hemiLight.intensity,0);assert.equal(fill.intensity,P.sceneProfiles[id].fill);assert.equal(sun.intensity,P.sceneProfiles[id].intensity);assert.ok(w.renderer.toneMappingExposure>0);
 }
});
test('shadow budget excludes floors and panoramic basic materials',()=>{
 const w=fixture();w.renderer={};w.sunLight=new THREE.DirectionalLight();w.hemiLight=new THREE.HemisphereLight();
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshStandardMaterial());
 const prop=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());
 const sky=new THREE.Mesh(new THREE.CylinderGeometry(90,90,75,32),new THREE.MeshBasicMaterial());w.activeZoneGroup.add(floor,prop,sky);
 P.applySceneStyle(w,'zone2');assert.equal(floor.castShadow,false);assert.equal(floor.receiveShadow,true);assert.equal(prop.castShadow,true);assert.equal(sky.castShadow,false);
});
test('selection ring follows the target and clears hidden or removed objects',()=>{
 const w=fixture(),o=target(w),focus=new P.TargetFocus(w.scene);focus.select(o);assert.equal(focus.ring.visible,true);
 o.position.x=1;w.scene.updateMatrixWorld(true);focus.update(0,true);assert.equal(focus.ring.position.x,1);assert.equal(focus.ring.material.opacity,.65);
 o.visible=false;focus.update(1,false);assert.equal(focus.ring.visible,false);assert.equal(focus.target,null);focus.dispose();assert.equal(focus.ring.parent,null);
});
test('atlas progress uses zone definitions and preserves unlock requirements',()=>{
 const atlas=require('../realm-presentation.js');const zm={currentZoneId:'zone1',zones:{zone1:{id:'zone1',words:['LIGHT','BOOK']},zone2:{id:'zone2',words:['APPLE']}},isZoneUnlocked:id=>id==='zone1'};
 const m=atlas.model(zm,{completedWords:['light']});assert.equal(m[0].done,1);assert.equal(m[0].total,2);assert.equal(m[1].unlocked,false);assert.equal(m[1].current,false);
});

function questFixture() {
 const c=context(),World=load(c,'world-3d.js','World3D'),w=Object.create(World.prototype),cards=[],timers=[];
 w.gameState={inventory:[],xp:0,level:1};w.settings={reducedMotion:true};w.devMode=true;w.animators=[];w.isAnyModalOpen=()=>false;w.showToast=()=>{};
 const mesh=()=>new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());
 for(const key of ['candleFlame','keyMesh','drawerMesh','flaskLiquid','starStone','flowerStone','mimicLid','socketStar','socketFlower','doorLeft','doorRight']) w[key]=mesh();
 w.candleLight=new THREE.PointLight();w.openSpeechCard=(word,callback)=>cards.push({word,callback});w.scheduleZoneAction=callback=>timers.push(callback);
 const pass=word=>{const card=cards.shift();assert.equal(card?.word,word);card.callback();while(timers.length) timers.shift()();};
 const interact=id=>{w.triggerInteraction({userData:{id}});while(timers.length) timers.shift()();};
 c.elements.victoryModal={style:{}};c.elements.finalScoreText={textContent:''};
 return {w,c,cards,pass,interact};
}
test('study quest reaches all twelve words without skipped FLOWER or premature escape',()=>{
 const {w,c,pass,interact}=questFixture();
 interact('candle');pass('LIGHT');interact('book');pass('BOOK');pass('KEY');
 interact('drawer');pass('RED');assert.equal(w.drawerMesh.position.z,-3.3);
 interact('alchemy');pass('BLUE');pass('STAR');interact('mimic');pass('CAT');pass('FISH');
 assert.equal(w.gameState.mimicFed,true);assert.equal(!!w.gameState.hasFlowerStone,false);pass('FLOWER');
 assert.equal(w.gameState.hasFlowerStone,true);interact('door');pass('DOOR');pass('OPEN');
 assert.equal(w.doorLeft.position.x,-1.7);assert.equal(w.doorRight.position.x,1.7);
 w.triggerEscapeCelebration();assert.equal(!!w.gameState.escaped,false);pass('SUN');
 assert.equal(w.gameState.escaped,true);assert.equal(c.elements.victoryModal.style.display,'flex');assert.equal(w.gameState.inventory.filter(i=>i.id==='FLOWER').length,1);
});
test('cancelled FLOWER collection can resume from mimic without repeating feeding',()=>{
 const {w,cards,pass,interact}=questFixture();w.gameState.mimicFed=true;
 w.collectFlowerStone();cards.shift();assert.equal(!!w.gameState.hasFlowerStone,false);
 interact('mimic');pass('FLOWER');const xp=w.gameState.xp;interact('mimic');w.collectFlowerStone();assert.equal(w.gameState.xp,xp);assert.equal(cards.length,0);
});
test('cancelled SUN can be retried and the completion reward runs once',()=>{
 const {w,cards,pass}=questFixture();w.triggerEscapeCelebration();cards.shift();assert.equal(!!w.gameState.escaped,false);
 w.triggerEscapeCelebration();pass('SUN');const xp=w.gameState.xp;w.triggerEscapeCelebration();assert.equal(cards.length,0);assert.equal(w.gameState.xp,xp);
});
test('stone door opening reward cannot run twice',()=>{
 const {w}=questFixture();w.openStoneDoorSuccess();const xp=w.gameState.xp;w.openStoneDoorSuccess();assert.equal(w.gameState.xp,xp);
});

function speechFixture() {
 const c=context(), instances=[], statuses=[];
 c.window.SpeechRecognition=class {
  constructor(){ instances.push(this); }
  start(){ this.started=true; }
  abort(){ this.aborted=true; }
 };
 let ducked=false;
 c.window.audioManager={duckBgm:()=>{ducked=true;},unduckBgm:()=>{ducked=false;},playSfx:()=>{}};
 const Speech=load(c,'speech-manager.js','SpeechManager'),speech=new Speech();
 speech.updateUIStatus=(state,msg)=>statuses.push({state,msg});
 speech.updateSentenceUI=(state,msg)=>statuses.push({state,msg});
 return {...c,speech,instances,statuses,get ducked(){return ducked;}};
}
function speechResult(text,index=0) {
 const first=[{transcript:text}];first.isFinal=true;
 return {resultIndex:index,results:index ? [Object.assign([{transcript:'interim'}],{isFinal:false}),first] : [first]};
}
test('a recognition event after cancellation cannot complete or duck a later card',()=>{
 const c=speechFixture();let calls=0;c.speech.startListening('LIGHT',()=>calls++);
 const old=c.speech.recognition;c.speech.stopListening();
 old.onstart();old.onresult(speechResult('light'));old.onerror({error:'network'});old.onend();
 c.timers.forEach(fn=>fn());assert.equal(calls,0);assert.equal(c.ducked,false);
 assert.equal(c.statuses.at(-1).state,'listening');
});
test('a previous recognition session cannot overwrite a new sentence session',()=>{
 const c=speechFixture();c.speech.startListening('LIGHT',()=>{});const old=c.speech.recognition;
 c.speech.startSentenceListening('Where is the light?',[],80,()=>{});
 const statusCount=c.statuses.length;old.onresult(speechResult('light'));old.onerror({error:'not-allowed'});
 assert.equal(c.statuses.length,statusCount);assert.equal(c.speech.mode,'sentence');
});
for(const error of ['not-allowed','service-not-allowed','audio-capture','network','no-speech']) test('recognition '+error+' restores audio and gives a retry path',()=>{
 const c=speechFixture();c.speech.startListening('LIGHT',()=>{});const recognition=c.speech.recognition;
 recognition.onstart();assert.equal(c.ducked,true);recognition.onerror({error});
 assert.equal(c.speech.isListening,false);assert.equal(c.ducked,false);assert.equal(c.statuses.at(-1).state,'error');
 assert.ok(!c.statuses.at(-1).msg.includes('辨識提示：'));assert.equal(recognition.aborted,true);
 c.speech.startListening('LIGHT',()=>{});assert.equal(c.speech.recognition.started,true);
});
test('a recognition ending without a final result resets the listening UI',()=>{
 const c=speechFixture();c.speech.startListening('LIGHT',()=>{});const recognition=c.speech.recognition;
 recognition.onstart();recognition.onend();assert.equal(c.statuses.at(-1).state,'retry');assert.equal(c.speech.isListening,false);assert.equal(c.ducked,false);
});
test('a microphone that never starts times out without leaving a recording button',()=>{
 const c=speechFixture();c.speech.startListening('LIGHT',()=>{});c.timers.at(-1)();
 assert.equal(c.statuses.at(-1).state,'error');assert.equal(c.speech.recognition,null);assert.equal(c.speech.isListening,false);
});
test('a synchronous recognition start failure offers recovery',()=>{
 const c=speechFixture();c.window.SpeechRecognition.prototype.start=()=>{throw Error('cannot start');};
 c.speech.startListening('LIGHT',()=>{});assert.equal(c.statuses.at(-1).state,'error');assert.equal(c.speech.isListening,false);
});
test('a final result after resultIndex zero is evaluated exactly once',()=>{
 const c=speechFixture();c.speech.startListening('LIGHT',()=>{});const recognition=c.speech.recognition;
 recognition.onresult(speechResult('light',1));recognition.onresult(speechResult('light',1));
 assert.equal(c.statuses.filter(s=>s.state==='success').length,1);
 recognition.onend();assert.equal(c.statuses.at(-1).state,'success');
});
test('word recognition respects word boundaries and accepts contextual phrases',()=>{
 const c=speechFixture();c.speech.targetData={word:'LIGHT',matchKeywords:['light']};
 c.speech.evaluatePronunciation('flight');assert.equal(c.statuses.at(-1).state,'retry');
 c.speech.evaluatePronunciation('Light the candle!');assert.equal(c.statuses.at(-1).state,'success');
 c.speech.targetData={word:'RED',matchKeywords:['red']};c.speech.evaluatePronunciation('tired');assert.equal(c.statuses.at(-1).state,'retry');
});
test('listening to a model cancels microphone input before it can recognize the model',()=>{
 const c=speechFixture();c.speech.startListening('LIGHT',()=>{});const old=c.speech.recognition;
 c.speech.playWordVoice('LIGHT');const count=c.statuses.length;old.onresult(speechResult('light'));
 assert.equal(c.speech.isListening,false);assert.equal(c.statuses.length,count);assert.equal(old.aborted,true);
});
test('teacher verification cannot be overwritten by a pending microphone error',()=>{
 const c=speechFixture();c.speech.startListening('LIGHT',()=>{});const old=c.speech.recognition;
 c.speech.forcePass(false);old.onerror({error:'no-speech'});assert.equal(c.statuses.at(-1).state,'success');assert.equal(c.speech.isListening,false);
});
test('unsupported recognition preserves listening examples and teacher fallback',()=>{
 const c=context(),Speech=load(c,'speech-manager.js','SpeechManager'),speech=new Speech();let state;
 speech.updateUIStatus=s=>state=s;speech.startListening('LIGHT',()=>{});assert.equal(state,'unsupported');assert.equal(speech.isListening,false);
});
test('frame statistics report p95 and lifetime long frames without growing their buffer',()=>{
 const {FrameWindow}=require('../game-diagnostics.js');const frames=new FrameWindow(100);
 for(let i=1;i<=100;i++) frames.record(i);let stats=frames.summary();
 assert.equal(stats.p95Ms,95);assert.equal(stats.longFrames,50);assert.equal(stats.meanMs,50.5);
 for(let i=0;i<10000;i++) frames.record(16);stats=frames.summary();
 assert.equal(stats.samples,100);assert.equal(frames.values.length,100);assert.equal(stats.p95Ms,16);assert.equal(stats.totalFrames,10100);
 frames.record(NaN);frames.record(0);assert.equal(frames.summary().totalFrames,10100);
});

test('scene acceptance plans one warmup and two complete measured passes',()=>{
 const {sweepPlan}=require('../game-diagnostics.js');
 const zones=Array.from({length:10},(_,i)=>'zone'+(i+1));
 const plan=sweepPlan(zones);assert.equal(plan.length,30);
 for(const round of [0,1,2]) {
  const pass=plan.filter(row=>row.round===round);
  assert.deepEqual(pass.map(row=>row.zone),zones);
  assert.equal(pass.every(row=>row.warmup),round===0);
 }
});

test('teacher sentence verification is not presented as a fabricated recognition percentage',()=>{
 const c=speechFixture();let result;
 c.speech.targetSentence='Where is the library?';
 c.speech.updateSentenceUI=(state,msg,value)=>{result=value;};
 c.speech.forceSentencePass();
 assert.equal(result.passed,true);assert.equal(result.teacherVerified,true);
 assert.equal(result.accuracy,null);assert.equal(result.userTranscript,'');
});


test('reading backgrounds render at most twenty times a second without gameplay samples',()=>{
 const gate=new P.FrameCadence();let rendered=0;
 for(let now=0;now<1000;now+=10) {if(gate.shouldRender(now,false,false,true)) rendered++;assert.equal(gate.sample,false);}
 assert.equal(rendered,20);
 assert.equal(gate.shouldRender(1001,false,false,false),true);assert.equal(gate.resumed,true);assert.equal(gate.sample,false);
 assert.equal(gate.shouldRender(1017,false,false,false),true);assert.equal(gate.sample,true);
});
test('hidden and lost-context frames cannot pollute resumed gameplay',()=>{
 for(const reason of ['hidden','context']) {
  const gate=new P.FrameCadence();gate.shouldRender(0,false,false,false);gate.shouldRender(16,false,false,false);
  assert.equal(gate.shouldRender(100,reason==='hidden',reason==='context',false),false);
  assert.equal(gate.shouldRender(30100,false,false,false),true);assert.equal(gate.resumed,true);assert.equal(gate.sample,false);
  gate.shouldRender(30116,false,false,false);assert.equal(gate.sample,true);
 }
});
test('target selection reuses scratch arrays and releases scene references',()=>{
 const w=fixture(),o=target(w);const arrays=[];const original=w.raycaster.intersectObjects.bind(w.raycaster);
 w.raycaster.intersectObjects=(objects,recursive,out)=>{arrays.push(out);return original(objects,recursive,out);};
 w.raycaster.far=20;assert.equal(P.resolveTarget(w),o);assert.equal(P.resolveTarget(w),o);
 assert.equal(arrays[0],arrays[1]);assert.equal(arrays[0].length,0);assert.equal(w.raycaster.far,20);
 w.activeZoneGroup.remove(o);w.interactables=[];assert.equal(P.resolveTarget(w),null);
});
test('target selection restores ray range if geometry processing fails',()=>{
 const w=fixture();target(w);w.raycaster.far=8;w.raycaster.intersectObjects=()=>{throw Error('bad geometry');};
 assert.throws(()=>P.resolveTarget(w),/bad geometry/);assert.equal(w.raycaster.far,8);
 assert.equal(P.resolveTarget(w,NaN),null);assert.equal(P.resolveTarget(w,-1),null);
});
test('animation resume does not jump or include paused time in performance metrics',()=>{
 const c=context(),World=load(c,'world-3d.js','World3D'),w=Object.create(World.prototype);
 c.ctx.requestAnimationFrame=()=>{};let now=100;c.ctx.performance={now:()=>now};c.document.hidden=false;
 let modal=true,moves=[],samples=[];w.frameCadence=new P.FrameCadence();w.isAnyModalOpen=()=>modal;
 w.clock={getDelta:()=>30,elapsedTime:30};w.settings={quality:'auto',reducedMotion:true};w.animators=[];w.gameState={};
 w.rollingFps=60;w.lastFrameTimestamp=0;w.lastFpsUiUpdateTime=100;w.lowFpsDuration=0;w.graphicQuality='high';
 w.updatePlayer=dt=>moves.push(dt);w.updateRaycast=()=>{};w.updateFpsPillUI=()=>{};w.renderer={render:()=>{}};w.frameMetrics={record:dt=>samples.push(dt)};
 w.dustParticles={rotation:{y:7},position:{y:8}};
 w.animate();now=120;w.animate();assert.equal(moves.length,1);assert.equal(w.rollingFps,60);assert.equal(samples.length,0);
 modal=false;now=121;w.animate();assert.equal(moves[1],0);assert.equal(samples.length,0);
 assert.equal(w.dustParticles.rotation.y,7);assert.equal(w.dustParticles.position.y,8);
});

test('context loss clears pending controls and restoration starts a fresh frame',()=>{
 const c=context(),World=load(c,'world-3d.js','World3D'),w=Object.create(World.prototype),handlers={};
 let resets=0,stops=0,qualities=0,prevented=0;
 c.window.touchControls={reset:()=>resets++};c.window.speechManager={stopListening:()=>stops++};
 w.renderer={domElement:{addEventListener:(name,fn)=>handlers[name]=fn}};w.clock={getDelta:()=>0};w.frameCadence=new P.FrameCadence();
 w.frameCadence.shouldRender(0,false,false,false);w.graphicQuality='medium';w.showToast=()=>{};
 w.setGraphicQuality=(q,automatic)=>{assert.equal(q,'medium');assert.equal(automatic,true);qualities++;};w.setupEvents();
 handlers.webglcontextlost({preventDefault:()=>prevented++});assert.equal(w.contextLost,true);assert.equal(stops,1);assert.equal(resets,1);
 handlers.webglcontextrestored();assert.equal(w.contextLost,false);assert.equal(resets,2);assert.equal(qualities,1);assert.equal(prevented,1);
 w.frameCadence.shouldRender(100,false,false,false);assert.equal(w.frameCadence.resumed,true);assert.equal(w.frameCadence.sample,false);
});
