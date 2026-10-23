const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.resolve(__dirname,'..'),C=require('../art-workshop-chapter.js'),S=require('../art-workshop-scene.js'),V=require('../gept-kids-vocabulary.js');
function complete(s=C.initial()){
 for(let i=s.stage;i<8;i++){
  s=C.transition(s,{type:'touch',index:i}).state;
  s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;
 }
 return s;
}
function at(stage){let s=C.initial();for(let i=0;i<stage;i++){s=C.transition(s,{type:'touch',index:i}).state;s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;}return s;}
function completeSchool(){
 const S=require('../school-chapter.js');let s=S.initial();
 for(let i=0;i<8;i++){
  if(i===2)s=S.transition(s,{type:'history',value:1963}).state;
  if(i===4)s=S.transition(s,{type:'drawing',value:'LION'}).state;
  if(i===6)for(const value of [1,1,2])s=S.transition(s,{type:'beat',value}).state;
  s=S.transition(s,{type:'speak',word:S.words[i],verifiedWord:S.words[i]}).state;
 }
 return s;
}

test('art workshop uses eight fresh GEPT chapter words with no overlap in earlier chapter cores',()=>{
 const context=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',context);context.window.Manager.prototype.initTextures=()=>{};
 const zones=new context.window.Manager({metadataOnly:true}).zones,previous=new Set(Object.values(zones).filter(z=>z.id!=='zone20').flatMap(z=>Array.from(z.words)));
 assert.deepEqual(Array.from(zones.zone20.words),C.words);assert.equal(zones.zone20.parentZone,'zone12');assert.equal(zones.zone20.spawnPos[2],10.2,'the player should enter from the south side with a clear view across the work area');assert.ok(Math.abs(zones.zone20.spawnYaw)<1e-6,'the south entrance should face north toward the workshop mural and activity area');
 for(const word of C.words){assert.ok(V.entries[word]?.pages.length,word);assert.equal(previous.has(word),false,word);}
});

test('every art step needs the current physical clue and a verified matching spoken word',()=>{
 let s=C.initial();
 assert.equal(C.transition(s,{type:'speak',word:C.words[0],verifiedWord:C.words[0]}).state.stage,0);
 s=C.transition(s,{type:'touch',index:2}).state;assert.equal(s.found,null);
 s=C.transition(s,{type:'touch',index:0}).state;assert.equal(s.found,'BLACKBOARD');
 assert.equal(C.transition(s,{type:'speak',word:'BLACKBOARD'}).state.stage,0);
 assert.equal(C.transition(s,{type:'speak',word:'PICTURE',verifiedWord:'PICTURE'}).state.stage,0);
 for(let i=0;i<8;i++){
  if(i>0)s=C.transition(s,{type:'touch',index:i}).state;
  assert.equal(C.canSpeak(s,C.words[i]),true);
  s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;
  assert.equal(s.stage,i+1);
 }
 assert.equal(C.solved(s),true);assert.equal(C.solved({...s,spoken:[]}),false);
});

test('checkpoint validation rejects forged progress and hints point to the actual pending prop',()=>{
 for(let i=0;i<=8;i++)assert.deepEqual(C.validate(JSON.parse(JSON.stringify(at(i)))),at(i));
 assert.equal(C.validate({stage:8,spoken:[],found:null}).stage,0);
 assert.equal(C.validate({stage:1,spoken:['PICTURE'],found:null}),null);
 assert.equal(C.hint(C.initial()).targetId,'artwork_blackboard');
 let s=C.transition(C.initial(),{type:'touch',index:0}).state;assert.equal(C.hint(s).targetId,'artwork_blackboard');
 assert.equal(C.hint(complete()).targetId,'artwork_exit');
});

test('school route stays locked until the campus welcome quest is complete, then returns to zone12',()=>{
 const context=vm.createContext({});for(const file of ['school-chapter.js','art-workshop-chapter.js','realm-quests.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context);
 const R=context.RealmQuests;assert.equal(R.canTravel('zone12','zone20',{}),false);assert.equal(R.canTravel('zone20','zone12',{}),true);
 assert.equal(R.canTravel('zone12','zone20',{zone12:completeSchool()}),true);
 const saved=R.sanitizeMap({zone20:complete()});assert.equal(R.solved('zone20',saved.zone20),true);
});

test('adventure map assigns a distinct route node and the assist guide points to the current studio prop',()=>{
 const context=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',context);context.window.Manager.prototype.initTextures=()=>{};
 vm.runInContext(fs.readFileSync(path.join(base,'realm-presentation.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(base,'art-workshop-chapter.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(base,'adventure-assist.js'),'utf8'),context);
 const manager=new context.window.Manager(null,{metadataOnly:true});manager.currentZoneId='zone12';manager.isZoneUnlocked=()=>true;
 const node=context.window.RealmPresentation.model(manager,{completedWords:[]}).find(zone=>zone.id==='zone20');assert.equal(node.parentZone,'zone12');assert.deepEqual(Array.from(node.position),[18,43]);
 const state={realmPuzzles:{zone20:at(3)}};const plan=context.window.AdventureAssist.hintPlan(state,manager.zones.zone20,[]);assert.equal(plan.targetId,'artwork_ruler');assert.equal(plan.word,null);
});

test('art studio builds textured school surfaces, real courtyard window views and reachable workshop fixtures',()=>{
 const T=require('../three.min.js'),ctx=vm.createContext({THREE:T,ArtWorkshopChapter:C});vm.runInContext(fs.readFileSync(path.join(base,'art-workshop-scene.js'),'utf8'),ctx);
 const world={interactables:[],gameState:{realmPuzzles:{zone20:C.initial()}}},texture=()=>{const item=new T.Texture();item.image={};return item;},textures={libraryWall:texture(),libraryTerrazzo:texture(),schoolConcrete:texture(),libraryWood:texture(),restaurantWood:texture(),schoolLionMural:texture(),libraryCourtyardWindow:texture(),artStudioWall:texture(),artStudioTerrazzo:texture(),artStudioMaple:texture()},textureByPath={'assets/textures/art-studio-terrazzo-v1.webp':textures.artStudioTerrazzo,'assets/textures/art-studio-plaster-v1.webp':textures.artStudioWall,'assets/textures/art-studio-maple-v1.webp':textures.artStudioMaple},textureRequests=[];
 const group=new T.Group(),manager={world,tex:textures,switchZone:()=>true,getTexture:(url,variant)=>{textureRequests.push({url,variant});return textureByPath[url];}};ctx.ArtWorkshopScene.build(manager,group);let count=0,used=new Set();group.traverse(o=>{if(!o.isMesh)return;count++;for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));if(o.material?.map)used.add(o.material.map);if(o.isInstancedMesh)for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));});
 assert.ok(count<240,count);assert.ok(used.has(textures.schoolLionMural));assert.ok(Array.from(used).some(map=>map.image===textures.artStudioWall.image));assert.ok(Array.from(used).some(map=>map.image===textures.artStudioTerrazzo.image));assert.ok(Array.from(used).some(map=>map.image===textures.artStudioMaple.image));assert.ok(used.has(textures.libraryCourtyardWindow));assert.ok(Array.from(used).some(map=>map.image===textures.artStudioTerrazzo.image&&map.repeat?.x===18&&map.repeat?.y===20));
 if(T.sRGBEncoding!==undefined)for(const map of used)if([textures.artStudioWall.image,textures.artStudioTerrazzo.image,textures.artStudioMaple.image].includes(map.image))assert.equal(map.encoding,T.sRGBEncoding);
 assert.deepEqual({...group.userData.artWorkshopDetails},{courtyardWindows:8,stools:4,sinkBasins:2,dryingRackShelves:4});
 assert.deepEqual(textureRequests,[{url:'assets/textures/art-studio-terrazzo-v1.webp',variant:'zone20-floor'},{url:'assets/textures/art-studio-plaster-v1.webp',variant:'zone20-wall'},{url:'assets/textures/art-studio-maple-v1.webp',variant:'zone20-maple'}]);
 assert.equal(world.interactables.length,9);assert.equal(new Set(world.interactables.map(o=>o.userData.id)).size,9);assert.equal(world.interactables.at(-1).userData.id,'artwork_exit');
 assert.equal(S.bounds.minX,-10.35);assert.ok(S.colliders().length>=10);
 for(const file of ['school-lion-mural-v1.webp','school-lawn-v1.webp','art-studio-plaster-v1.webp','art-studio-terrazzo-v1.webp','art-studio-maple-v1.webp','library-courtyard-window-v1.png'])assert.ok(fs.statSync(path.join(base,'assets/textures',file)).size>1000,file);
});

test('speech success reopens the quest on the next step and stale recognition cannot advance it',()=>{
 const elements={},cards=[],node=()=>({style:{display:'none'},hidden:false,textContent:'',isConnected:false,append(){},replaceChildren(){},focus(){}});
 const found=C.transition(C.initial(),{type:'touch',index:0}).state;
 const world={activeZoneGroup:{},zoneManager:{currentZoneId:'zone20'},gameState:{realmPuzzles:{zone20:found}},isAnyModalOpen:()=>false,openSpeechCard:(word,pass,options)=>cards.push({word,pass,options}),hintController:{clear(){}},adventureProgress:{save(){}},targetFocus:{select(){}},audioManager:{playSfx(){}}};
 const context=vm.createContext({world3D:world,document:{activeElement:null,createElement:node,getElementById:id=>elements[id]||(elements[id]=node())},addEventListener(){},speechManager:{stopVoice(){}}});vm.runInContext(fs.readFileSync(path.join(base,'art-workshop-chapter.js'),'utf8'),context);
 const api=context.ArtWorkshopChapter;api.beginSpeech('BLACKBOARD');assert.equal(cards[0].options.requireRecognition,true);assert.equal(world.gameState.realmPuzzles.zone20.stage,0);
 cards[0].pass();cards[0].pass();assert.equal(world.gameState.realmPuzzles.zone20.stage,1);assert.equal(elements.realmQuestModal.style.display,'flex');
 world.gameState.realmPuzzles.zone20=C.transition(world.gameState.realmPuzzles.zone20,{type:'touch',index:1}).state;api.beginSpeech('PICTURE');world.activeZoneGroup={};cards[1].pass();assert.equal(world.gameState.realmPuzzles.zone20.stage,1);
});

test('learning lounge adds one art topic and eight useful, correctly linked sentence cards',()=>{
 const D=require('../learning-data.js');require('../weather-learning-data.js');require('../coastal-learning-data.js');require('../library-learning-data.js');require('../makerspace-learning-data.js');require('../carnival-learning-data.js');require('../art-workshop-learning-data.js');
 assert.equal(D.entries.length,622);assert.equal(D.sentences.length,140);assert.equal(D.topics.length,15);assert.equal(D.templates.length,13);
 assert.deepEqual(Array.from(D.topics.find(t=>t.id==='school-art').words),C.words);
 for(const word of C.words){const card=D.sentences.find(s=>s.id==='school-art:'+word);assert.ok(card,word);assert.ok(D.find(card.word));assert.ok(card.zh);assert.match(card.en,/[.?!]$/);}
});
