const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../carnival-chapter.js'),S=require('../carnival-scene.js'),V=require('../gept-kids-vocabulary.js');
const base=path.resolve(__dirname,'..');
function complete(s){for(let i=s.stage;i<8;i++){s=C.transition(s,{type:'choice',index:i,value:C.words[i]}).state;s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;}return s;}

test('carnival words come from the supplied GEPT list and do not repeat an earlier core word',()=>{
 const context=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',context);context.window.Manager.prototype.initTextures=()=>{};
 const zones=new context.window.Manager({metadataOnly:true}).zones,earlier=new Set(Object.values(zones).filter(z=>z.id!=='zone19').flatMap(z=>Array.from(z.words)));
 assert.deepEqual(Array.from(zones.zone19.words),C.words);for(const word of C.words){assert.ok(V.entries[word]?.pages.length,word);assert.equal(earlier.has(word),false,word);}
 assert.equal(zones.zone19.parentZone,'zone2');assert.deepEqual(C.counts,[13,14,15,16,17,18,19,20]);
});

test('each number step requires its current count choice and fresh spoken word',()=>{
 let s=C.initial();for(let i=0;i<8;i++){
  assert.equal(C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state.stage,i);
  const wrong=C.choices[i].find(x=>x!==C.words[i]);s=C.transition(s,{type:'choice',index:i,value:wrong}).state;assert.equal(C.canSpeak(s,C.words[i]),false);
  s=C.transition(s,{type:'choice',index:i,value:C.words[i]}).state;assert.equal(C.canSpeak(s,C.words[i]),true);
  assert.equal(C.transition(s,{type:'speak',word:C.words[i]}).state.stage,i);
  s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;assert.equal(s.stage,i+1);
 }
 assert.equal(C.solved(s),true);assert.deepEqual(C.validate(JSON.parse(JSON.stringify(s))),s);assert.equal(C.solved({...s,spoken:[]}),false);
});

test('carnival hint names the current vocabulary and its matching physical station',()=>{
 const hint=C.hint(C.initial());assert.equal(hint.word,'THIRTEEN');assert.equal(hint.targetId,'carnival_thirteen');assert.match(hint.clues.join(' '),/THIRTEEN/);
 const done=C.hint(complete(C.initial()));assert.equal(done.word,null);assert.equal(done.targetId,'carnival_exit');
});

test('market route stays locked until the market quest is solved and returns to its parent',()=>{
 const ctx=vm.createContext({});for(const f of ['restaurant-chapter.js','carnival-chapter.js','realm-quests.js'])vm.runInContext(fs.readFileSync(path.join(base,f),'utf8'),ctx);
 const R=ctx.RealmQuests;assert.equal(R.canTravel('zone2','zone19',{}),false);assert.equal(R.canTravel('zone19','zone2',{}),true);
 const market={cart:[2,1,0],paid:true};assert.equal(R.solved('zone2',market),true);assert.equal(R.canTravel('zone2','zone19',{zone2:market}),true);
 const map=R.sanitizeMap({zone19:complete(C.initial())});assert.equal(R.solved('zone19',map.zone19),true);
});

test('open-air night fair builds finite geometry, uses its tactile maps and exposes nine unique interactions',()=>{
 const T=require('../three.min.js'),drawnText=[],ctx2d={fillRect(){},strokeRect(){},fillText(text){drawnText.push(String(text));}},context=vm.createContext({THREE:T,CarnivalChapter:C,document:{createElement:()=>({width:0,height:0,getContext:()=>ctx2d})}});
 vm.runInContext(fs.readFileSync(path.join(base,'carnival-scene.js'),'utf8'),context);
 const world={interactables:[],player:{pos:{set(){}},yaw:0},adventureProgress:{save(){}},settings:{},gameState:{realmPuzzles:{zone19:C.initial()}}},textures={floor:new T.Texture(),canopy:new T.Texture(),wood:new T.Texture(),tray:new T.Texture()};
 const manager={world,tex:{carnivalFloor:textures.floor,carnivalCanopy:textures.canopy,carnivalBooth:textures.wood,carnivalStarTray:textures.tray},switchZone:()=>true};
 const group=new T.Group(),layout=context.CarnivalScene.build(manager,group);let meshes=0,used=new Set(),tokenInstances=0;const visibleCounts=[],tokenGeometryTypes=[];
 group.traverse(o=>{if(!o.isMesh)return;meshes++;for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));if(o.material?.map)used.add(o.material.map);if(o.isInstancedMesh){tokenInstances+=o.count;if(o.userData.carnivalCount){visibleCounts.push(o.userData.carnivalCount);tokenGeometryTypes.push(o.geometry.type);}for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}});
 assert.ok(meshes<160,meshes);assert.ok(tokenInstances>=112,tokenInstances);for(const texture of Object.values(textures))assert.ok(used.has(texture));assert.ok(used.size>=4);
 assert.deepEqual(visibleCounts.sort((a,b)=>a-b),[13,14,15,16,17,18,19]);
 assert.deepEqual(tokenGeometryTypes,Array(7).fill('ExtrudeGeometry'));assert.equal(layout.openAir,true);assert.equal(layout.individualStalls,7);assert.equal(layout.clearEntry,true);
 assert.equal(S.colliders().some(c=>c.minX<2&&c.maxX>-2&&c.minZ<11&&c.maxZ>7),false,'the south gate must have an unobstructed sightline and walking lane');
 assert.equal(drawnText.some(text=>/^\d+$/.test(text)),false,'booth signs must not reveal the count before the player counts the tokens');
 assert.equal(world.interactables.length,9);assert.equal(new Set(world.interactables.map(o=>o.userData.id)).size,9);assert.equal(S.bounds.maxX,12.5);assert.ok(S.colliders().length>=12);
 for(const name of ['carnival-floor-v2.webp','carnival-canopy-v2.webp','carnival-booth-v2.webp','carnival-star-tray-v1.webp'])assert.ok(fs.statSync(path.join(base,'assets/textures',name)).size>1000,name);
});

test('the world map assigns and renders a finite route position for the new market branch',()=>{
 const context=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',context);vm.runInContext(fs.readFileSync(path.join(base,'realm-presentation.js'),'utf8'),context);
 context.window.Manager.prototype.initTextures=()=>{};const manager=new context.window.Manager(null,{metadataOnly:true});manager.currentZoneId='zone2';manager.isZoneUnlocked=()=>true;
 const el=()=>({style:{setProperty(){}},children:[],append(child){this.children.push(child);},replaceChildren(){this.children=[];},setAttribute(){},scrollIntoView(){}}),container=el();
 context.document={createElement:el};context.window.RealmPresentation.render(container,manager,{completedWords:[]},()=>{});
 const map=container.children.find(child=>child.className==='atlas-land');assert.ok(map);assert.doesNotMatch(map.innerHTML,/NaN|undefined/);
 const branch=context.window.RealmPresentation.model(manager,{completedWords:[]}).find(zone=>zone.id==='zone19');assert.equal(branch.parentZone,'zone2');assert.ok(branch.position.every(Number.isFinite));
});

test('zone19 speech callbacks require recognition and ignore stale or duplicate results',()=>{
 const elements={},cards=[],node=()=>({style:{display:'none'},hidden:false,textContent:'',isConnected:false,append(){},replaceChildren(){},setAttribute(){},focus(){}});
 const w={activeZoneGroup:{},zoneManager:{currentZoneId:'zone19',switchZone:()=>true},gameState:{realmPuzzles:{zone19:C.transition(C.initial(),{type:'choice',index:0,value:'THIRTEEN'}).state}},isAnyModalOpen:()=>false,openSpeechCard:(word,pass,options)=>cards.push({word,pass,options}),hintController:{clear(){}},adventureProgress:{save(){}}};
 const context=vm.createContext({world3D:w,document:{activeElement:null,createElement:node,getElementById:id=>elements[id]||(elements[id]=node())},addEventListener(){},speechManager:{stopVoice(){}}});vm.runInContext(fs.readFileSync(path.join(base,'carnival-chapter.js'),'utf8'),context);
 const api=context.CarnivalChapter;api.beginSpeech('THIRTEEN');assert.equal(cards[0].options.requireRecognition,true);cards[0].pass();cards[0].pass();assert.equal(w.gameState.realmPuzzles.zone19.stage,1);
 w.gameState.realmPuzzles.zone19=C.transition(w.gameState.realmPuzzles.zone19,{type:'choice',index:1,value:'FOURTEEN'}).state;api.beginSpeech('FOURTEEN');api.close();cards[1].pass();assert.equal(w.gameState.realmPuzzles.zone19.stage,1);
});

test('carnival data adds eight new GEPT words, eight useful sentences and one topic',()=>{
 const D=require('../learning-data.js');require('../weather-learning-data.js');require('../coastal-learning-data.js');require('../library-learning-data.js');require('../makerspace-learning-data.js');require('../carnival-learning-data.js');
 assert.equal(D.entries.length,622);assert.equal(D.sentences.length,132);assert.equal(D.topics.length,14);assert.deepEqual(Array.from(D.topics.find(t=>t.id==='number-carnival').words),C.words);
 for(const word of C.words){assert.ok(D.find(word));assert.ok(D.sentences.some(s=>s.id==='carnival:'+word));assert.ok(V.entries[word]);assert.match(D.sentences.find(s=>s.id==='carnival:'+word).en,/star|tray/i);}
});
