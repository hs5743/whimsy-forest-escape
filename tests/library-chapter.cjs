const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.resolve(__dirname,'..'),C=require('../library-chapter.js'),V=require('../gept-kids-vocabulary.js');
globalThis.LibraryChapter=C;const School=require('../school-chapter.js');globalThis.SchoolChapter=School;const Q=require('../realm-quests.js');globalThis.RealmQuests=Q;
function at(n){let s=C.initial();for(let i=0;i<n;i++){s=C.transition(s,{type:'choice',index:i,value:C.choices[i][1]}).state;s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;}return s;}

test('every Xin-gang library checkpoint requires its correct scene clue and fresh oral recognition',()=>{
 for(let i=0;i<C.words.length;i++){
  let s=at(i);assert.equal(C.canSpeak(s,C.words[i]),false);
  s=C.transition(s,{type:'choice',index:i,value:C.choices[i][2]}).state;assert.equal(C.canSpeak(s,C.words[i]),false);
  s=C.transition(s,{type:'choice',index:i,value:C.choices[i][1]}).state;assert.equal(C.canSpeak(s,C.words[i]),true);
  assert.equal(C.transition(s,{type:'speak',word:C.words[i]}).state.stage,i);
  assert.equal(C.transition(s,{type:'speak',word:C.words[i],verifiedWord:'WRONG'}).state.stage,i);
  assert.equal(C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state.stage,i+1);
 }
 assert.equal(C.solved(at(8)),true);
});

test('library checkpoints truncate unproved progress and reject malformed or stale state',()=>{
 for(let i=0;i<=8;i++)assert.deepEqual(C.validate(JSON.parse(JSON.stringify(at(i)))),at(i));
 assert.equal(C.solved({...at(8),spoken:[]}),false);
 assert.equal(C.validate({...at(4),choices:['SHELF','STORY','STUDENT','TEACHER','STUDY','QUIET','BORING','EXCITING']} ).stage,4);
 for(const raw of [{...at(0),stage:9},{...at(0),choices:['SHELF']},{...at(2),spoken:['STORY','SHELF']},{...at(0),choices:Array(8).fill('not a choice')}])assert.equal(C.validate(raw),null);
});

test('library core words match the supplied GEPT scope and add no repeated later-chapter core',()=>{
 const c=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',c);c.window.Manager.prototype.initTextures=()=>{};
 const zones=new c.window.Manager({}).zones,earlier=new Set(Object.values(zones).filter(z=>z.id!=='zone17'&&!z.isLearningHub).flatMap(z=>Array.from(z.words)));
 assert.deepEqual(Array.from(V.libraryCore),C.words);assert.deepEqual(Array.from(zones.zone17.words),C.words);assert.equal(zones.zone17.parentZone,'zone12');
 for(const word of C.words){assert.ok(V.entries[word]?.pages.length,word);assert.equal(earlier.has(word),false,word);}
 const vocab=vm.createContext({});for(const file of ['vocab-data.js','weather-vocabulary.js','coast-vocabulary.js','library-vocabulary.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),vocab);
 for(const word of C.words){assert.ok(vocab.VOCAB_DATA[word]?.zh,word);assert.ok(vocab.VOCAB_DATA[word]?.phonics,word);assert.equal(vocab.VOCAB_DATA[word].matchKeywords[0],word.toLowerCase());}
});

test('the library branch opens only after the school mission and returns only to its parent',()=>{
 let s=School.initial();
 for(let i=0;i<School.words.length;i++){
  if(i===2)s=School.transition(s,{type:'history',value:1963}).state;
  if(i===4)s=School.transition(s,{type:'drawing',value:'LION'}).state;
  if(i===6)for(const value of [1,1,2])s=School.transition(s,{type:'beat',value}).state;
  s=School.transition(s,{type:'speak',word:School.words[i],verifiedWord:School.words[i]}).state;
 }
 assert.equal(School.solved(s),true);assert.equal(Q.canTravel('zone12','zone17',{}),false);assert.equal(Q.canTravel('zone12','zone17',{zone12:s}),true);
 assert.equal(Q.canTravel('zone17','zone12',{}),true);assert.equal(Q.canTravel('zone17','zone4',{}),false);
 assert.equal(Q.sanitizeMap({zone17:at(5)}).zone17.stage,5);
});

test('the library extension raises the learning hall to 610 words, 112 sentence cards and eleven topics',()=>{
 require('../weather-learning-data.js');require('../coastal-learning-data.js');const D=require('../library-learning-data.js');
 assert.equal(D.entries.length,610);assert.equal(D.sentences.length,112);assert.equal(D.topics.length,11);assert.deepEqual(Array.from(D.topics.find(t=>t.id==='library').words),C.words);
 for(const word of C.words){assert.ok(D.find(word.toLowerCase()));assert.ok(D.sentences.some(s=>s.id==='library:'+word));}
});

test('library room geometry stays finite, targetable, bounded and reasonably batched',()=>{
 const T=require('../three.min.js'),context=vm.createContext({THREE:T,LibraryChapter:C});vm.runInContext(fs.readFileSync(path.join(base,'library-scene.js'),'utf8'),context);
 const group=new T.Group(),world={interactables:[],animators:[],settings:{},gameState:{realmPuzzles:{zone17:C.initial()}},adventureProgress:{save(){}}},texture=new T.Texture(),libraryFloor=new T.Texture(),libraryWall=new T.Texture(),libraryWood=new T.Texture(),bookSpines=new T.Texture(),manager={world,tex:{schoolTerrazzo:texture,libraryTerrazzo:libraryFloor,libraryWall,restaurantPlaster:texture,restaurantWood:texture,libraryWood,libraryBookSpines:bookSpines},switchZone:()=>true};
 context.LibraryScene.build(manager,group);let meshes=0,instances=0,ceiling=false,usesLibraryFloor=false,usesLibraryWall=false,usesLibraryWood=false,bookPanelCount=0;group.traverse(o=>{if(!o.isMesh)return;meshes++;for(const value of o.geometry.attributes.position.array)assert.ok(Number.isFinite(value));if(o.material?.map===libraryFloor)usesLibraryFloor=true;if(o.material?.map===libraryWall)usesLibraryWall=true;if(o.material?.map===libraryWood)usesLibraryWood=true;if(o.material?.map===bookSpines)bookPanelCount+=o.isInstancedMesh?o.count:1;if(o.isInstancedMesh){instances+=o.count;for(const value of o.instanceMatrix.array)assert.ok(Number.isFinite(value));for(let i=0;i<o.count;i++){const matrix=new T.Matrix4().fromArray(o.instanceMatrix.array,i*16),position=new T.Vector3(),rotation=new T.Quaternion(),scale=new T.Vector3();matrix.decompose(position,rotation,scale);if(position.y>7.5&&scale.x>22&&scale.z>24)ceiling=true;}}});
 assert.ok(meshes<220,meshes);assert.ok(instances>120,instances);assert.equal(world.interactables.length,9);assert.equal(new Set(world.interactables.map(o=>o.userData.id)).size,9);
 assert.ok(usesLibraryFloor,'the floor uses its dedicated generated terrazzo');assert.ok(usesLibraryWall,'the room uses a dedicated low-contrast plaster finish');assert.ok(usesLibraryWood,'woodwork uses the library veneer');assert.ok(bookPanelCount>=10,'real book-spine atlas panels are built into the shelf rows');
 assert.deepEqual(JSON.parse(JSON.stringify(group.userData.libraryPhysicalExhibits)),{boring:{kind:'sleepy-reader-open-storybook',object:'library-storybook-boring'},exciting:{kind:'pop-up-adventure-storybook',object:'library-storybook-exciting'}});
 for(const role of ['boring','exciting']){const exhibit=group.getObjectByName('library-storybook-'+role);let parts=0;exhibit.traverse(o=>{if(o.isMesh)parts++;});assert.ok(parts>=8,role+' is a modeled tabletop story scene');}
 assert.equal(world.interactables.find(o=>o.userData.id==='library_boring').userData.name,'睡眼故事書 · BORING');assert.equal(world.interactables.find(o=>o.userData.id==='library_exciting').userData.name,'立體冒險繪本 · EXCITING');
 for(let n=0;n<=8;n++)assert.ok(world.interactables.some(o=>o.userData.id===C.hint(at(n)).targetId),C.hint(at(n)).targetId);
 assert.equal(ceiling,true,'the room has a closed high ceiling');
 assert.equal(context.LibraryScene.bounds.maxZ,12.35);assert.ok(context.LibraryScene.colliders().length>=6);
});

test('library window openings reveal a continuous courtyard and dedicated finish atlas crops',()=>{
 const T=require('../three.min.js'),context=vm.createContext({THREE:T,LibraryChapter:C});vm.runInContext(fs.readFileSync(path.join(base,'library-scene.js'),'utf8'),context);
 const group=new T.Group(),world={interactables:[],animators:[],settings:{},gameState:{realmPuzzles:{zone17:C.initial()}},adventureProgress:{save(){}}},courtyard=new T.Texture(),atlas=new T.Texture(),crops=new Map();
 const manager={world,tex:{libraryWall:new T.Texture(),libraryTerrazzo:new T.Texture(),libraryWood:new T.Texture(),libraryBookSpines:new T.Texture(),libraryMaterialAtlas:atlas,libraryCourtyardWindow:courtyard},getAtlasTexture:(key,row,column)=>{const id=key+':'+row+':'+column;if(!crops.has(id)){const texture=new T.Texture();texture.name=id;crops.set(id,texture);}return crops.get(id);},switchZone:()=>true};
 context.LibraryScene.build(manager,group);const exterior=[],materials=new Set(),solidBackSlab=[];group.traverse(o=>{if(!o.isMesh)return;if(o.userData.libraryExteriorBackdrop)exterior.push(o);if(o.material?.map?.name)materials.add(o.material.map.name);const instances=o.isInstancedMesh?o.count:1;for(let i=0;i<instances;i++){let position=o.position,scale=o.scale;if(o.isInstancedMesh){const m=new T.Matrix4().fromArray(o.instanceMatrix.array,i*16),rotation=new T.Quaternion();position=new T.Vector3();scale=new T.Vector3();m.decompose(position,rotation,scale);}if(Math.abs(position.z+12.25)<.02&&scale.x>22&&scale.y>7&&scale.z<.4)solidBackSlab.push(o);}});
 assert.equal(exterior.length,11);assert.ok(exterior.every(o=>o.material.map===courtyard));assert.ok(exterior.every(o=>o.material.depthTest===false&&o.material.depthWrite===false&&o.renderOrder===100));assert.equal(exterior.filter(o=>o.name.includes('_back_')).length,6);assert.equal(exterior.filter(o=>o.name.includes('_side_')).length,5);
 for(const view of exterior){const uv=Array.from(view.geometry.attributes.uv.array),uValues=uv.filter((_,i)=>i%2===0);assert.ok(Math.abs(Math.max(...uValues)-Math.min(...uValues)-1/view.userData.windowCrop.count)<1e-5);}
 assert.equal(solidBackSlab.length,0,'the back-window apertures are not covered by a full plaster slab');
 for(const region of ['libraryMaterialAtlas:0:0','libraryMaterialAtlas:0:1','libraryMaterialAtlas:1:0','libraryMaterialAtlas:1:1'])assert.ok(materials.has(region),region);
});

test('speech callback is single-use and becomes stale when the modal closes or the scene changes',()=>{
 const nodes={},cards=[],node=()=>({style:{display:'none'},hidden:false,textContent:'',isConnected:false,append(){},replaceChildren(){},setAttribute(){},focus(){}});
 const w={activeZoneGroup:{},zoneManager:{currentZoneId:'zone17',switchZone:()=>true},gameState:{realmPuzzles:{zone17:C.transition(C.initial(),{type:'choice',index:0,value:'SHELF'}).state}},isAnyModalOpen:()=>false,openSpeechCard:(word,pass,options)=>cards.push({word,pass,options}),hintController:{clear(){}},adventureProgress:{save(){}}};
 const context=vm.createContext({world3D:w,document:{activeElement:null,createElement:node,getElementById:id=>nodes[id]||(nodes[id]=node())},addEventListener(){},speechManager:{stopVoice(){}}});vm.runInContext(fs.readFileSync(path.join(base,'library-chapter.js'),'utf8'),context);
 const api=context.LibraryChapter;api.beginSpeech('SHELF');assert.equal(cards[0].options.requireRecognition,true);cards[0].pass();cards[0].pass();assert.equal(w.gameState.realmPuzzles.zone17.stage,1);
 w.gameState.realmPuzzles.zone17=C.transition(at(1),{type:'choice',index:1,value:'STORY'}).state;api.beginSpeech('STORY');api.close();cards[1].pass();assert.equal(w.gameState.realmPuzzles.zone17.stage,1);
 api.beginSpeech('STORY');w.activeZoneGroup={};cards[2].pass();assert.equal(w.gameState.realmPuzzles.zone17.stage,1);
});
