const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const C=require('../airport-chapter.js'),S=require('../airport-scene.js'),T=require('../three.min.js'),base=path.resolve(__dirname,'..');
const answers=['AIRPORT','PLANE','TICKET','','WAIT','','TAXI','LATE'];
function prepare(s){if([0,1,2,4,6,7].includes(s.stage))return C.transition(s,{type:'choice',index:s.stage,value:answers[s.stage]}).state;if(s.stage===3)for(let index=0;index<3;index++)s=C.transition(s,{type:'collect',index}).state;if(s.stage===5)for(const key of ['gate','call'])s=C.transition(s,{type:'condition',key,value:2}).state;return s;}
function at(n){let s=C.initial();for(let i=0;i<n;i++){s=prepare(s);s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;}return s;}
test('every airport step requires its observation proof and current spoken word',()=>{
 for(let i=0;i<8;i++){const s=at(i);assert.equal(C.canSpeak(s,C.words[i]),false);const ready=prepare(s);assert.equal(C.canSpeak(ready,C.words[i]),true);assert.equal(C.transition(ready,{type:'speak',word:C.words[i]}).state.stage,i);assert.equal(C.transition(ready,{type:'speak',word:C.words[i],verifiedWord:'WRONG'}).state.stage,i);assert.equal(C.transition(ready,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state.stage,i+1);}assert.equal(C.solved(at(8)),true);
});
test('wrong transport, ticket, lounge and gate settings do not progress; retries retain earlier oral steps',()=>{
 for(const [n,value]of [[1,'TRAIN'],[2,'BOOK'],[4,'RUN'],[6,'SHIP'],[7,'WRONG']]){const s=C.transition(at(n),{type:'choice',index:n,value}).state;assert.equal(C.canSpeak(s,C.words[n]),false);assert.equal(s.spoken.length,n);}
 let s=at(5);s=C.transition(s,{type:'condition',key:'gate',value:3}).state;s=C.transition(s,{type:'condition',key:'call',value:2}).state;assert.equal(C.canSpeak(s,'HURRY'),false);s=C.transition(s,{type:'condition',key:'gate',value:2}).state;assert.equal(C.canSpeak(s,'HURRY'),true);assert.equal(s.stage,5);
});
test('baggage check counts unique items and requires spoken BAG',()=>{
 let s=at(3);for(let i=0;i<4;i++)s=C.transition(s,{type:'collect',index:0}).state;assert.equal(s.collected.length,1);assert.equal(C.canSpeak(s,'BAG'),false);s=prepare(s);assert.equal(C.canSpeak(s,'BAG'),true);assert.equal(C.transition(s,{type:'speak',word:'BAG',verifiedWord:'BAG'}).state.stage,4);
});
test('checkpoints roundtrip every phase and truncate forged progress without proof',()=>{
 for(let i=0;i<=8;i++)assert.deepEqual(C.validate(JSON.parse(JSON.stringify(at(i)))),at(i));assert.equal(C.validate({...at(8),collected:[]}).stage,3);assert.equal(C.validate({...at(8),gate:0}).stage,5);assert.equal(C.solved({...at(8),spoken:[]}),false);
 for(const value of [{...at(3),collected:[0,0]},{...at(0),stage:9},{...at(0),gate:NaN},{...at(0),choices:[]},{...at(2),spoken:['PLANE','AIRPORT']}])assert.equal(C.validate(value),null);
 assert.deepEqual(C.transition(at(0),{type:'choice',index:7,value:'LATE'}).state,at(0));
});
function pure(){const c=vm.createContext({});for(const f of ['restaurant-chapter.js','school-chapter.js','harmonica-chapter.js','greenhouse-chapter.js','airport-chapter.js','realm-quests.js','adventure-progress.js'])vm.runInContext(fs.readFileSync(path.join(base,f),'utf8'),c);return c;}
test('the airport branches from the completed station and cannot bypass the mainline',()=>{
 const {RealmQuests:R}=pure(),map={zone5:{hour:8,minute:30,platform:2,boarded:true,spoken:['TIME','TRAIN']}};assert.equal(R.canTravel('zone5','zone15',{}),false);assert.equal(R.canTravel('zone5','zone15',map),true);assert.equal(R.canTravel('zone4','zone15',map),false);assert.equal(R.canTravel('zone15','zone5',{}),true);assert.equal(R.canTravel('zone15','zone6',{zone15:at(8)}),false);assert.equal(R.sanitizeMap({zone15:at(5)}).zone15.stage,5);
});
test('eight airport words are source indexed, fully translated and absent from every earlier core',()=>{
 const V=require('../gept-kids-vocabulary.js'),c=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.M=SpatialZoneManager;',c);c.window.M.prototype.initTextures=()=>{};const zones=new c.window.M({}).zones,old=new Set(Object.values(zones).filter(z=>z.id!=='zone15').flatMap(z=>Array.from(z.words)));assert.deepEqual(Array.from(zones.zone15.words),C.words);assert.equal(zones.zone15.parentZone,'zone5');
 const v=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(base,'vocab-data.js'),'utf8')+';this.V=VOCAB_DATA;',v);for(const word of C.words){assert.ok(V.entries[word]?.pages.length);assert.equal(old.has(V.aliases[word]||word),false);assert.ok(v.V[word].zh);assert.ok(v.V[word].sentence);assert.deepEqual(Array.from(v.V[word].matchKeywords),[word.toLowerCase()]);}
});
function geometry(){const ctx2d=new Proxy({},{get:(o,k)=>o[k]||(()=>{})}),c=vm.createContext({THREE:T,document:{createElement:()=>({getContext:()=>ctx2d})},AirportChapter:{sync(){}},RealmLandscape:{random:require('../realm-landscape.js').random},RealmQuests:{solved:()=>false}});vm.runInContext(fs.readFileSync(path.join(base,'airport-scene.js'),'utf8'),c);const g=new T.Group(),w={interactables:[],animators:[],settings:{},gameState:{realmPuzzles:{}},showToast(){},adventureProgress:{save(){}}},manager={world:w,tex:{},switchZone:()=>true};return{c,g,w,manager};}
test('the airport terminal has deterministic finite batches, all nine targets and traversable aisles',()=>{
 const counts=[];for(let i=0;i<2;i++){const f=geometry();f.c.AirportScene.build(f.manager,f.g);let meshes=0,instances=0;f.g.traverse(o=>{if(!o.isMesh)return;meshes++;for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));if(o.isInstancedMesh){instances+=o.count;for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}});assert.ok(meshes<220,meshes);assert.ok(instances>1400,instances);assert.equal(f.w.interactables.length,9);assert.equal(new Set(f.w.interactables.map(o=>o.userData.id)).size,9);for(let n=0;n<=8;n++)assert.ok(f.w.interactables.some(o=>o.userData.id===C.hint(at(n)).targetId));counts.push([meshes,instances]);f.w.animators.forEach(fn=>fn(10));}assert.deepEqual(counts[0],counts[1]);
 const blocked=(x,z)=>S.colliders().some(c=>x>c.minX-.3&&x<c.maxX+.3&&z>c.minZ-.3&&z<c.maxZ+.3);for(const p of [[0,11.5],[0,13.1],[0,-7.8],[-3.5,6],[3.5,-2],[-6.8,.1]])assert.equal(blocked(...p),false,p.join(','));for(const p of [[-6.8,6],[6.8,-2],[0,-10],[-11,0]])assert.equal(blocked(...p),true,p.join(','));
});
test('the physical station entrance enforces boarding ticket completion and return preserves the parent route',()=>{
 const f=geometry(),trips=[];f.manager.switchZone=id=>(trips.push(id),true);f.c.AirportScene.buildEntrance(f.manager,f.g);f.w.interactables[0].userData.onClick();assert.deepEqual(trips,[]);f.c.RealmQuests.solved=()=>true;f.w.interactables[0].userData.onClick();assert.deepEqual(trips,['zone15']);f.w.interactables=[];f.c.AirportScene.build(f.manager,f.g);f.w.interactables.find(o=>o.userData.id==='airport_exit').userData.onClick();assert.deepEqual(trips,['zone15','zone5']);
});
function ui(){const nodes={},node=()=>({style:{display:'none'},append(){},replaceChildren(){},setAttribute(){},focus(){},isConnected:false}),cards=[];const w={activeZoneGroup:{},zoneManager:{currentZoneId:'zone15'},gameState:{realmPuzzles:{zone15:prepare(at(0))}},isAnyModalOpen:()=>false,openSpeechCard:(word,pass,options)=>cards.push({word,pass,options})};const c=vm.createContext({world3D:w,document:{createElement:node,getElementById:id=>nodes[id]||(nodes[id]=node())},addEventListener(){}});vm.runInContext(fs.readFileSync(path.join(base,'airport-chapter.js'),'utf8'),c);return{c,w,cards,api:c.AirportChapter};}
test('fresh recognition is required; double callbacks, closed cards and previous scenes cannot complete a step',()=>{
 const f=ui();f.api.beginSpeech('AIRPORT');assert.equal(f.cards[0].options.requireRecognition,true);assert.equal(f.w.gameState.realmPuzzles.zone15.stage,0);f.api.beginSpeech('AIRPORT');f.cards[1].pass();f.cards[1].pass();f.cards[0].pass();assert.equal(f.w.gameState.realmPuzzles.zone15.stage,1);f.w.gameState.realmPuzzles.zone15=prepare(at(1));f.api.beginSpeech('PLANE');f.api.close();f.cards[2].pass();assert.equal(f.w.gameState.realmPuzzles.zone15.stage,1);f.api.beginSpeech('PLANE');f.w.activeZoneGroup={};f.cards[3].pass();assert.equal(f.w.gameState.realmPuzzles.zone15.stage,1);
});
function checkpoint(){const A=pure().AdventureProgress,state={xp:0,inventory:[],practicedWordsByZone:{zone15:['AIRPORT']},realmPuzzles:{zone15:at(5)}};for(const flag of A.flags)state[flag]=false;return{version:1,owner:'guest',zone:'zone15',savedAt:1,state,player:{x:0,y:1.6,z:11.5,yaw:0,pitch:0}};}
test('complete single-file GAS preserves airport checkpoints and keeps its module globals private',()=>{
 const server=require('./helpers/backend.cjs')({bundle:true}),caps=server.post({action:'adventureCapabilities'});assert.ok(caps.schemaZones.includes('zone15'));assert.equal(server.c.AirportChapter,undefined);const packet={action:'saveAdventure',owner:'guest',checkpointId:'a'.repeat(32),secret:'b'.repeat(64),requestId:'c'.repeat(32),expectedRevision:0,snapshot:checkpoint()};const saved=server.post(packet);assert.equal(saved.status,'success',JSON.stringify(saved));const loaded=server.post({...packet,action:'getAdventure'});assert.equal(loaded.snapshot.state.realmPuzzles.zone15.stage,5);assert.equal(server.post(packet).replayed,true);
});
test('regional overworld atlas groups realms by region tabs and prevents crowded node overlap',()=>{
 const c=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.M=SpatialZoneManager;',c);c.window.M.prototype.initTextures=()=>{};const zm=new c.window.M({});zm.currentZoneId='zone15';zm.isZoneUnlocked=()=>true;
 const el=(tag='div')=>({tag,className:'',dataset:{},children:[],attrs:{},props:{},set innerHTML(v){this._html=v;this.children=[];},get innerHTML(){return this._html||'';},style:{setProperty(k,v){this.props[k]=v;},props:{}},append(...xs){this.children.push(...xs);},replaceChildren(...xs){this.children=xs;},setAttribute(k,v){this.attrs[k]=v;},classList:{toggle(){}},scrollIntoView(){}});
 const doc={createElement:el};
 const atlasCtx=vm.createContext({document:doc});vm.runInContext(fs.readFileSync(path.join(base,'realm-presentation.js'),'utf8'),atlasCtx);
 const rootEl=el();atlasCtx.RealmPresentation.render(rootEl,zm,{completedWords:['AIRPORT','PLANE']},()=>{});
 const tabs=rootEl.children.find(n=>n.className==='atlas-regions');assert.ok(tabs);assert.equal(tabs.children.length,6);
 const map=rootEl.children.find(n=>n.className==='atlas-land');assert.equal(map.children.length,5);
 tabs.children.find(n=>n.textContent==='雲海星穹').onclick();assert.equal(map.children.length,6);
 assert.ok(map.children.some(n=>n.attrs['aria-label'].includes('星光國際機場')));
 for(const compact of [false,true]){const pts=atlasCtx.RealmPresentation.layout(6,compact);assert.equal(new Set(pts.map(p=>p.join(','))).size,6);}
});
