const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../coastal-chapter.js'),V=require('../gept-kids-vocabulary.js'),base=path.resolve(__dirname,'..');
globalThis.CoastChapter=C;globalThis.WeatherChapter=require('../weather-chapter.js');
const Q=require('../realm-quests.js');globalThis.RealmQuests=Q;

function at(n){let s=C.initial();for(let i=0;i<n;i++){s=C.transition(s,{type:'choice',index:i,value:C.words[i]}).state;s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;}return s;}
function weatherAt(n){const W=globalThis.WeatherChapter;let s=W.initial();for(let i=0;i<n;i++){s=W.transition(s,{type:'choice',index:i,value:W.words[i]}).state;s=W.transition(s,{type:'speak',word:W.words[i],verifiedWord:W.words[i]}).state;}return s;}

test('each coast step requires the matching field clue and verified speech in order',()=>{
 for(let i=0;i<C.words.length;i++){
  let s=at(i);assert.equal(C.canSpeak(s,C.words[i]),false);
  s=C.transition(s,{type:'choice',index:i,value:C.choices[i][2]}).state;assert.equal(C.canSpeak(s,C.words[i]),false);
  s=C.transition(s,{type:'choice',index:i,value:C.words[i]}).state;assert.equal(C.canSpeak(s,C.words[i]),true);
  assert.equal(C.transition(s,{type:'speak',word:C.words[i]}).state.stage,i);
  assert.equal(C.transition(s,{type:'speak',word:C.words[i],verifiedWord:'NO'}).state.stage,i);
  assert.equal(C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state.stage,i+1);
 }
 assert.equal(C.solved(at(8)),true);
});

test('coast checkpoints reject malformed claims and trim progress without matching spoken proof',()=>{
 for(let i=0;i<=8;i++)assert.deepEqual(C.validate(JSON.parse(JSON.stringify(at(i)))),at(i));
 assert.equal(C.solved({...at(8),spoken:[]}),false);
 assert.equal(C.validate({...at(0),stage:9}),null);
 const unsafe={...at(3),choices:[...at(3).choices]};unsafe.choices[1]='LAKE';assert.equal(C.validate(unsafe).stage,1);
});

test('the new coastal branch follows the completed weather chapter and returns to it',()=>{
 assert.equal(Q.canTravel('zone21','zone16',{zone21:weatherAt(7)}),false);
 assert.equal(Q.canTravel('zone21','zone16',{zone21:weatherAt(8)}),true);
 assert.equal(Q.canTravel('zone16','zone21',{}),true);
 assert.equal(Q.canTravel('zone16','zone7',{zone16:at(8)}),false);
 assert.equal(Q.sanitizeMap({zone16:at(5)}).zone16.stage,5);
 const context=vm.createContext({window:{}});
 for(const file of ['spatial-zone-manager.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8')+';window.Manager=SpatialZoneManager;',context);
 context.window.Manager.prototype.initTextures=()=>{};const zones=new context.window.Manager({}).zones;
 assert.equal(zones.zone16.parentZone,'zone21');assert.deepEqual(Array.from(zones.zone16.words),C.words);
});

test('the eight coast words are in the supplied GEPT list, unique across chapter cores and add five learning entries',()=>{
 const context=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',context);context.window.Manager.prototype.initTextures=()=>{};
 const zones=new context.window.Manager({}).zones,earlier=new Set(Object.values(zones).filter(z=>z.id!=='zone16'&&!z.isLearningHub).flatMap(z=>Array.from(z.words)));
 assert.deepEqual(Array.from(zones.zone16.words),V.coastCore);
 for(const word of C.words){assert.ok(V.entries[word]?.pages?.length,word);assert.equal(earlier.has(V.aliases[word]||word),false,word);}
 require('../weather-learning-data.js');const data=require('../coastal-learning-data.js');
 assert.equal(data.entries.length,608);assert.equal(data.sentences.length,104);
 assert.equal(data.topics.find(t=>t.id==='coast').words.length,8);
 for(const word of C.words){assert.ok(data.find(word.toLowerCase()));assert.ok(data.sentences.some(s=>s.id==='coast:'+word));}
 assert.deepEqual(Array.from(data.entries.slice(-5),e=>e.word.toUpperCase()),['SCIENCE','DIFFERENT','INTERESTING','IN FRONT OF','TRASH']);
});

test('coastal vocabulary entries attach to the browser lexical vocabulary registry',()=>{
 const context=vm.createContext({window:{},VOCAB_DATA:{BEACH:{word:'BEACH',category:'existing'}}});
 vm.runInContext(fs.readFileSync(path.join(base,'coast-vocabulary.js'),'utf8'),context);
 assert.equal(context.window.VOCAB_DATA.BEACH.category,'香山潮間帶');
 for(const word of C.words){assert.equal(context.window.VOCAB_DATA[word].word,word);assert.ok(context.window.VOCAB_DATA[word].sentence);assert.deepEqual(Array.from(context.window.VOCAB_DATA[word].matchKeywords),[word.toLowerCase()]);}
});

test('coast speech dialog requires recognition and discards duplicate or stale callbacks',()=>{
 const nodes={},node=()=>({style:{display:'none'},append(){},replaceChildren(){},setAttribute(){},focus(){},isConnected:false}),cards=[];
 const w={activeZoneGroup:{},zoneManager:{currentZoneId:'zone16',switchZone:()=>true},gameState:{realmPuzzles:{zone16:C.initial()}},isAnyModalOpen:()=>false,openSpeechCard:(word,pass,options)=>cards.push({word,pass,options}),hintController:{clear(){}},adventureProgress:{save(){}}};
 const ctx=vm.createContext({world3D:w,document:{activeElement:{},createElement:node,getElementById:id=>nodes[id]||(nodes[id]=node())},addEventListener(){}});
 vm.runInContext(fs.readFileSync(path.join(base,'coastal-chapter.js'),'utf8'),ctx);const api=ctx.CoastChapter;
 w.gameState.realmPuzzles.zone16=C.transition(C.initial(),{type:'choice',index:0,value:'BEACH'}).state;
 api.beginSpeech('BEACH');assert.equal(cards[0].options.requireRecognition,true);cards[0].pass();cards[0].pass();assert.equal(w.gameState.realmPuzzles.zone16.stage,1);
 w.gameState.realmPuzzles.zone16=C.transition(at(1),{type:'choice',index:1,value:'SEA'}).state;api.beginSpeech('SEA');api.close();cards[1].pass();assert.equal(w.gameState.realmPuzzles.zone16.stage,1);
});

test('coastal scene builds its textured mudflat, target stations and walkable route',()=>{
 const T=require('../three.min.js'),ctx2d=new Proxy({},{get:(o,k)=>o[k]||(()=>{})}),landscapes=[],context=vm.createContext({THREE:T,document:{createElement:()=>({getContext:()=>ctx2d})},CoastChapter:C,RealmLandscape:{build:(...args)=>landscapes.push(args)}});
 vm.runInContext(fs.readFileSync(path.join(base,'coastal-scene.js'),'utf8'),context);
 const g=new T.Group(),texture=new T.Texture(),world={interactables:[],animators:[],gameState:{realmPuzzles:{}},settings:{},adventureProgress:{save(){}}};
 const tidalWater=new T.Texture(),wetlandSky=new T.Texture(),saltmarsh=new T.Texture(),crabCutout=new T.Texture(),manager={world,tex:{tidalMudflat:texture,tidalWater,weatherGravel:texture,coastalConcrete:texture,gardenGrass:texture,landscapeDaySky:texture,xiangshanWetlandSky:wetlandSky,xiangshanSaltmarsh:saltmarsh,fiddlerCrabCutout:crabCutout},switchZone:()=>true};
 context.CoastalScene.build(manager,g);let meshCount=0,instanceCount=0;g.traverse(o=>{if(!o.isMesh)return;meshCount++;for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));if(o.isInstancedMesh){instanceCount+=o.count;for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}});
 assert.ok(meshCount<750,meshCount);assert.equal(world.interactables.length,9);assert.ok(instanceCount>20,instanceCount);
 assert.ok(g.children.some(o=>o.isMesh&&o.geometry.type==='TubeGeometry'),'the curved observation trail has continuous handrails');
 assert.equal(landscapes[0][2],'zone16');assert.equal(landscapes[0][3],wetlandSky,'the scene uses its generated local environment panorama');
 let texturedWater=false,texturedMud=false,photoPlants=0,photoCrabs=0,crabModels=[];g.traverse(o=>{if(o.isMesh&&o.material?.map===tidalWater){texturedWater=true;assert.ok(o.geometry.attributes.uv,'tide water carries texture coordinates');}if(o.isMesh&&o.material?.map===texture&&o.material.roughness>=.9)texturedMud=true;if(o.isMesh&&o.material?.map===saltmarsh)photoPlants++;if(o.isMesh&&o.material?.map===crabCutout)photoCrabs++;if(o.userData?.sceneRole==='3d-fiddler-crab')crabModels.push(o);});assert.ok(texturedWater,'tide pools use the generated water-surface material');assert.ok(texturedMud,'mudflat uses its terrain texture');assert.equal(photoPlants,0,'marsh plants are modeled geometry, not flat photo cards');assert.equal(photoCrabs,0,'fiddler crabs are modeled geometry, not photo cutouts');assert.equal(crabModels.length,4,'all four visible fiddler crabs are 3D scene objects');for(const crab of crabModels){let parts=0;crab.traverse(o=>{if(o.isMesh)parts++;});assert.ok(parts>=20,`a crab has visible articulated detail (${parts} parts)`);}
 assert.doesNotMatch(fs.readFileSync(path.join(base,'coastal-scene.js'),'utf8'),/CanvasTexture|FIELD GUIDE|FIELD SCIENCE|TIDE-WALK FIELD MAP|marshPhoto|crabPhoto/);
 assert.equal(world.coastRefs.crabs.length,4);const bob=world.animators.at(-1),body=world.coastRefs.crabs[0].children[0],restY=body.position.y;bob(1.2);assert.notEqual(body.position.y,restY,'modeled crabs move subtly with the scene');world.settings.reducedMotion=true;bob(1.2);assert.equal(body.position.y,.22,'reduced-motion setting keeps wildlife still');
 const Chapter=context.CoastChapter||C;for(let i=0;i<=8;i++)assert.ok(world.interactables.some(o=>o.userData.id===Chapter.hint(at(i)).targetId),Chapter.hint(at(i)).targetId);
 assert.equal(context.CoastalScene.colliders().length,0);
});
