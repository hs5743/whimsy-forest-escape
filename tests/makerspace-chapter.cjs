const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.resolve(__dirname,'..'),C=require('../makerspace-chapter.js'),V=require('../gept-kids-vocabulary.js');
globalThis.MakerspaceChapter=C;const School=require('../school-chapter.js');globalThis.SchoolChapter=School;const Q=require('../realm-quests.js');globalThis.RealmQuests=Q;
function at(n){let s=C.initial();for(let i=0;i<n;i++){s=C.transition(s,{type:'choice',index:i,value:C.words[i]}).state;s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;}return s;}

test('makerspace stations require the correct physical clue and fresh oral recognition before progress',()=>{
 for(let i=0;i<C.words.length;i++){
  let s=at(i);assert.equal(C.canSpeak(s,C.words[i]),false);
  s=C.transition(s,{type:'choice',index:i,value:C.choices[i][2]}).state;assert.equal(C.canSpeak(s,C.words[i]),false);
  s=C.transition(s,{type:'choice',index:i,value:C.words[i]}).state;assert.equal(C.canSpeak(s,C.words[i]),true);
  assert.equal(C.transition(s,{type:'speak',word:C.words[i]}).state.stage,i);
  assert.equal(C.transition(s,{type:'speak',word:C.words[i],verifiedWord:'WRONG'}).state.stage,i);
  assert.equal(C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state.stage,i+1);
 }
 assert.equal(C.solved(at(8)),true);
});

test('maker progress rejects malformed or forged completion and safely truncates changed clues',()=>{
 for(let i=0;i<=8;i++)assert.deepEqual(C.validate(JSON.parse(JSON.stringify(at(i)))),at(i));
 assert.equal(C.solved({...at(8),spoken:[]}),false);
 assert.equal(C.validate({...at(4),choices:['ROBOT','MAKE','FAST','SLOW','TURN','WORK','READY','START']}).stage,4);
 for(const raw of [{...at(0),stage:9},{...at(0),choices:['ROBOT']},{...at(2),spoken:['MAKE','ROBOT']},{...at(0),choices:Array(8).fill('wrong')}])assert.equal(C.validate(raw),null);
});

test('maker core vocabulary is GEPT Kids listed, unique across chapter cores and connected to the school branch',()=>{
 const context=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',context);context.window.Manager.prototype.initTextures=()=>{};
 const zones=new context.window.Manager({}).zones,earlier=new Set(Object.values(zones).filter(z=>z.id!=='zone18'&&!z.isLearningHub).flatMap(z=>Array.from(z.words)));
 assert.deepEqual(Array.from(zones.zone18.words),C.words);assert.equal(zones.zone18.parentZone,'zone12');
 for(const word of C.words){assert.ok(V.entries[word]?.pages.length,word);assert.equal(earlier.has(word),false,word);}
 const vocab=vm.createContext({});for(const file of ['vocab-data.js','weather-vocabulary.js','coast-vocabulary.js','library-vocabulary.js','makerspace-vocabulary.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),vocab);
 for(const word of C.words){assert.ok(vocab.VOCAB_DATA[word]?.zh,word);assert.ok(vocab.VOCAB_DATA[word]?.phonics,word);assert.equal(vocab.VOCAB_DATA[word].matchKeywords[0],word.toLowerCase());}
 for(const word of ['MOTOR','WHEEL','BATTERY','SENSOR'])assert.equal(vocab.MakerspaceVocabulary[word].source,'補充詞彙，非 GEPT Kids 核心');
});

test('school branch opens the makerspace only after its own welcome mission is solved',()=>{
 let s=School.initial();for(let i=0;i<School.words.length;i++){
  if(i===2)s=School.transition(s,{type:'history',value:1963}).state;
  if(i===4)s=School.transition(s,{type:'drawing',value:'LION'}).state;
  if(i===6)for(const value of [1,1,2])s=School.transition(s,{type:'beat',value}).state;
  s=School.transition(s,{type:'speak',word:School.words[i],verifiedWord:School.words[i]}).state;
 }
 assert.equal(School.solved(s),true);assert.equal(Q.canTravel('zone12','zone18',{}),false);assert.equal(Q.canTravel('zone12','zone18',{zone12:s}),true);
 assert.equal(Q.canTravel('zone18','zone12',{}),true);assert.equal(Q.canTravel('zone18','zone4',{}),false);
 assert.equal(Q.sanitizeMap({zone18:at(5)}).zone18.stage,5);
});

test('makerspace extends the lobby with one GEPT practice topic and a clearly separate four-word STEM supplement',()=>{
 require('../weather-learning-data.js');require('../coastal-learning-data.js');require('../library-learning-data.js');require('../carnival-learning-data.js');const D=require('../makerspace-learning-data.js');
 assert.equal(D.entries.length,622);assert.equal(D.sentences.length,132);assert.equal(D.topics.length,14);
 assert.deepEqual(Array.from(D.topics.find(t=>t.id==='makerspace').words),C.words);
 assert.deepEqual(Array.from(D.topics.find(t=>t.id==='maker-tools').words),['MOTOR','WHEEL','BATTERY','SENSOR']);
 for(const word of C.words)assert.ok(D.sentences.some(s=>s.id==='makerspace:'+word));
 for(const word of ['MOTOR','WHEEL','BATTERY','SENSOR'])assert.ok(D.sentences.some(s=>s.id==='maker-tools:'+word));
});

test('workshop is bounded, walkable through its school door and exposes one physical target per lesson',()=>{
 const T=require('../three.min.js'),context=vm.createContext({THREE:T,MakerspaceChapter:C});vm.runInContext(fs.readFileSync(path.join(base,'makerspace-scene.js'),'utf8'),context);
 const group=new T.Group(),world={interactables:[],animators:[],settings:{},player:{pos:{set(){}},yaw:0},gameState:{realmPuzzles:{zone18:C.initial()}},adventureProgress:{save(){}}};
 const tx=()=>new T.Texture(),floor=tx(),wall=tx(),wood=tx(),peg=tx(),mat=tx();
 const manager={world,tex:{libraryTerrazzo:floor,libraryWall:wall,libraryWood:wood,makerspacePegboard:peg,makerspaceWorkMat:mat},switchZone:()=>true};
 context.MakerspaceScene.build(manager,group);let meshes=0,usesFloor=false,usesWall=false,usesWood=false,usesPegboard=false,usesMat=false;
 group.traverse(o=>{if(!o.isMesh)return;meshes++;for(const value of o.geometry.attributes.position.array)assert.ok(Number.isFinite(value));if(o.material?.map===floor)usesFloor=true;if(o.material?.map===wall)usesWall=true;if(o.material?.map===wood)usesWood=true;if(o.material?.map===peg)usesPegboard=true;if(o.material?.map===mat)usesMat=true;});
 assert.ok(meshes<120,meshes);assert.equal(world.interactables.length,9);assert.equal(new Set(world.interactables.map(o=>o.userData.id)).size,9);
 assert.ok(usesFloor&&usesWall&&usesWood&&usesPegboard&&usesMat);for(let n=0;n<=8;n++)assert.ok(world.interactables.some(o=>o.userData.id===C.hint(at(n)).targetId),C.hint(at(n)).targetId);
 assert.equal(context.MakerspaceScene.bounds.maxZ,12.5);assert.ok(context.MakerspaceScene.colliders().length>=8);
});

test('workshop uses its own tactile material atlas, real window openings and an assembled desktop printer',()=>{
 const T=require('../three.min.js'),context=vm.createContext({THREE:T,MakerspaceChapter:C});vm.runInContext(fs.readFileSync(path.join(base,'makerspace-scene.js'),'utf8'),context);
 const group=new T.Group(),world={interactables:[],animators:[],settings:{},player:{pos:{set(){}},yaw:0},gameState:{realmPuzzles:{zone18:C.initial()}},adventureProgress:{save(){}}},names=new Set(),courtyard=new T.Texture();
 const manager={world,tex:{libraryWall:new T.Texture(),libraryTerrazzo:new T.Texture(),libraryWood:new T.Texture(),makerspacePegboard:new T.Texture(),makerspaceWorkMat:new T.Texture(),libraryCourtyardWindow:courtyard,makerspaceMaterialAtlas:new T.Texture()},getAtlasTexture:(key,row,column)=>{const texture=new T.Texture();texture.name=key+':'+row+':'+column;return texture;},switchZone:()=>true};
 context.MakerspaceScene.build(manager,group);let backdrops=0;group.traverse(o=>{if(o.isMesh){if(o.material?.map?.name)names.add(o.material.map.name);if(o.userData.libraryExteriorBackdrop){backdrops++;assert.equal(o.material.map,courtyard);}}});
 const printer=group.getObjectByName('maker_3d_printer');assert.ok(printer);assert.ok(printer.children.length>=18);assert.equal(backdrops,3);
 for(const region of ['makerspaceMaterialAtlas:0:0','makerspaceMaterialAtlas:0:1','makerspaceMaterialAtlas:1:0','makerspaceMaterialAtlas:1:1'])assert.ok(names.has(region),region);
});

test('maker upper wall is usable daylight glazing and physical parts storage rather than illustrated project cards',()=>{
 const T=require('../three.min.js'),painted=[],ctx=new Proxy({}, {get:(target,key)=>key==='fillText'?(...args)=>painted.push(args[0]):(..._args)=>{},set:(target,key,value)=>{target[key]=value;return true;}});
 const context=vm.createContext({THREE:T,MakerspaceChapter:C,document:{createElement:()=>({width:0,height:0,getContext:()=>ctx})}});vm.runInContext(fs.readFileSync(path.join(base,'makerspace-scene.js'),'utf8'),context);
 const group=new T.Group(),world={interactables:[],animators:[],settings:{},player:{pos:{set(){}},yaw:0},gameState:{realmPuzzles:{zone18:C.initial()}},adventureProgress:{save(){}}};
 const texture=new T.Texture(),manager={world,tex:{libraryTerrazzo:texture,libraryWall:texture,libraryWood:texture,makerspacePegboard:texture,makerspaceWorkMat:texture},switchZone:()=>true};
 context.MakerspaceScene.build(manager,group);const canvases=[];group.traverse(o=>{if(o.isMesh&&o.material?.map?.image?.width===768)canvases.push(o);});
 assert.equal(canvases.length,0);assert.equal(painted.length,0);
 assert.ok(group.children.some(o=>o.isInstancedMesh&&o.count>=5));
 assert.ok(group.children.some(o=>o.isMesh&&o.material?.transparent&&o.material?.opacity<.5));
});

test('spoken-result callbacks are single-use and cannot finish after the scene closes or changes',()=>{
 const nodes={},cards=[],node=()=>({style:{display:'none'},hidden:false,textContent:'',isConnected:false,append(){},replaceChildren(){},setAttribute(){},focus(){}});
 const w={activeZoneGroup:{},zoneManager:{currentZoneId:'zone18',switchZone:()=>true},gameState:{realmPuzzles:{zone18:C.transition(C.initial(),{type:'choice',index:0,value:'ROBOT'}).state}},isAnyModalOpen:()=>false,openSpeechCard:(word,pass,options)=>cards.push({word,pass,options}),hintController:{clear(){}},adventureProgress:{save(){}}};
 const context=vm.createContext({world3D:w,document:{activeElement:null,createElement:node,getElementById:id=>nodes[id]||(nodes[id]=node())},addEventListener(){},speechManager:{stopVoice(){}}});vm.runInContext(fs.readFileSync(path.join(base,'makerspace-chapter.js'),'utf8'),context);
 const api=context.MakerspaceChapter;api.beginSpeech('ROBOT');assert.equal(cards[0].options.requireRecognition,true);cards[0].pass();cards[0].pass();assert.equal(w.gameState.realmPuzzles.zone18.stage,1);
 w.gameState.realmPuzzles.zone18=C.transition(at(1),{type:'choice',index:1,value:'MAKE'}).state;api.beginSpeech('MAKE');api.close();cards[1].pass();assert.equal(w.gameState.realmPuzzles.zone18.stage,1);
 api.beginSpeech('MAKE');w.activeZoneGroup={};cards[2].pass();assert.equal(w.gameState.realmPuzzles.zone18.stage,1);
});
