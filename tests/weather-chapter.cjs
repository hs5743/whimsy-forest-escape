const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const C=require('../weather-chapter.js'),T=require('../three.min.js'),V=require('../gept-kids-vocabulary.js'),base=path.resolve(__dirname,'..');
globalThis.WeatherChapter=C;
const Q=require('../realm-quests.js');globalThis.RealmQuests=Q;
const Progress=require('../adventure-progress.js');
function at(n){let s=C.initial();for(let i=0;i<n;i++){s=C.transition(s,{type:'choice',index:i,value:C.choices[i][1]}).state;s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;}return s;}

test('each weather step requires its physical clue followed by fresh oral recognition',()=>{
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

test('checkpoint validation truncates unproved weather progress and rejects malformed data',()=>{
 for(let i=0;i<=8;i++)assert.deepEqual(C.validate(JSON.parse(JSON.stringify(at(i)))),at(i));
 assert.equal(C.solved({...at(8),spoken:[]}),false);
 for(const raw of [{...at(0),stage:9},{...at(0),choices:['WEATHER']},{...at(2),spoken:['WEATHER','RAIN']},{...at(0),choices:Array(8).fill('not a choice')}])assert.equal(C.validate(raw),null);
});

test('weather vocabulary is in the supplied GEPT reference and unique among new chapter cores',()=>{
 const context=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',context);context.window.Manager.prototype.initTextures=()=>{};
 const zones=new context.window.Manager({}).zones,earlier=new Set(Object.values(zones).filter(z=>z.id!=='zone21').flatMap(z=>Array.from(z.words)));
 assert.deepEqual(Array.from(zones.zone21.words),C.words);assert.deepEqual(Array.from(V.weatherCore),C.words);assert.equal(zones.zone21.parentZone,'zone7');
 for(const word of C.words){assert.ok(V.entries[word]?.pages.length,word);assert.equal(earlier.has(word),false,word);}
 const vocabContext=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(base,'vocab-data.js'),'utf8')+'\n'+fs.readFileSync(path.join(base,'weather-vocabulary.js'),'utf8')+';this.V=VOCAB_DATA;',vocabContext);
 for(const word of C.words){assert.ok(vocabContext.V[word]?.zh,word);assert.ok(vocabContext.V[word]?.sentence,word);assert.deepEqual(Array.from(vocabContext.V[word].matchKeywords),[word.toLowerCase()]);}
 require('../coastal-learning-data.js');const data=require('../weather-learning-data.js');assert.equal(data.entries.length,608);assert.equal(data.sentences.length,104);assert.equal(data.topics.find(t=>t.id==='weather').words.length,8);
 for(const word of C.words){assert.ok(data.find(word.toLowerCase()));assert.ok(data.sentences.some(s=>s.id==='weather:'+word));}
});

test('weather branch opens only after the cloud observatory puzzle and returns to its parent',()=>{
 let s=Q.initial('zone7');s=Q.transition('zone7',s,{type:'object',value:'MOON'}).state;s=Q.transition('zone7',s,{type:'rotate'}).state;s=Q.transition('zone7',s,{type:'align'}).state;
 assert.equal(Q.solved('zone7',s),true);assert.equal(Q.canTravel('zone7','zone21',{}),false);assert.equal(Q.canTravel('zone7','zone21',{zone7:s}),true);
 assert.equal(Q.canTravel('zone21','zone7',{}),true);assert.equal(Q.canTravel('zone21','zone3',{}),false);
 const map=Q.sanitizeMap({zone21:at(5)});assert.equal(map.zone21.stage,5);
});

function scene(){
 const ctx2d=new Proxy({},{get:(o,k)=>o[k]||(()=>{})}),landscapes=[];const context=vm.createContext({THREE:T,WeatherChapter:C,RealmLandscape:{build:(...args)=>landscapes.push(args)},document:{createElement:()=>({getContext:()=>ctx2d})}});
 vm.runInContext(fs.readFileSync(path.join(base,'weather-scene.js'),'utf8'),context);
 const g=new T.Group(),world={interactables:[],animators:[],settings:{},gameState:{realmPuzzles:{}},adventureProgress:{save(){}}};
 const texture=new T.Texture(),yardTexture=new T.Texture(),weatherSky=new T.Texture(),landscapeDaySky=new T.Texture(),manager={world,tex:{schoolConcrete:texture,greenhouseFrame:texture,schoolTrack:texture,schoolTerrazzo:texture,greenhouseGlass:texture,weatherYardGrass:yardTexture,weatherGravel:texture,coastalConcrete:texture,weatherYardSky:weatherSky,landscapeDaySky},switchZone:()=>true};
 return{context,g,world,manager,api:context.WeatherScene,yardTexture,landscapes,weatherSky};
}
test('weather station geometry is deterministic, finite, targetable and keeps the walking lane clear',()=>{
 const f=scene(),S=f.api;S.build(f.manager,f.g);let meshes=0,instances=0;
 assert.equal(f.landscapes[0][2],'zone21');assert.equal(f.landscapes[0][3],f.weatherSky,'the weather yard uses its generated local panorama');
 f.g.traverse(o=>{if(!o.isMesh)return;meshes++;for(const value of o.geometry.attributes.position.array)assert.ok(Number.isFinite(value));if(o.isInstancedMesh){instances+=o.count;for(const value of o.instanceMatrix.array)assert.ok(Number.isFinite(value));}});
 assert.ok(meshes<180,meshes);assert.ok(instances>120,instances);assert.equal(f.world.interactables.length,10);
 let yardGrassUsed=false,hasOversizedRoof=false;f.g.traverse(o=>{if(o.isMesh&&o.material?.map===f.yardTexture)yardGrassUsed=true;if(o.geometry?.type==='BoxGeometry'&&o.position.y>3.5&&o.geometry.parameters.width*o.scale.x>8&&o.geometry.parameters.depth*o.scale.z>5)hasOversizedRoof=true;});assert.ok(yardGrassUsed,'yard grass is rendered from the dedicated grass texture');assert.equal(hasOversizedRoof,false,'the measuring field remains open to the sky');
 assert.doesNotMatch(fs.readFileSync(path.join(base,'weather-scene.js'),'utf8'),/CanvasTexture|OPEN AIR OBSERVATORY|WEATHER OBSERVATION|CLOUD WINDOW|RAIN GAUGE|WIND METER|THERMOMETER/);
 for(let i=0;i<=8;i++)assert.ok(f.world.interactables.some(o=>o.userData.id===C.hint(at(i)).targetId),C.hint(at(i)).targetId);
 const blocked=(x,z)=>S.colliders().some(c=>x>c.minX-.3&&x<c.maxX+.3&&z>c.minZ-.3&&z<c.maxZ+.3);
 for(const p of [[0,11.2],[0,13.1],[0,6.8],[0,-7.8]])assert.equal(blocked(...p),false,p.join(','));
 for(const p of [[-9.2,0],[7.1,-7.7],[-6.8,-7.5]])assert.equal(blocked(...p),true,p.join(','));
});

function ui(){
 const nodes={},node=()=>({style:{display:'none'},append(){},replaceChildren(){},setAttribute(){},focus(){},isConnected:false}),cards=[];
 const w={activeZoneGroup:{},zoneManager:{currentZoneId:'zone21'},gameState:{realmPuzzles:{zone21:C.initial()}},isAnyModalOpen:()=>false,openSpeechCard:(word,pass,options)=>cards.push({word,pass,options}),hintController:{clear(){}},adventureProgress:{save(){}}};
 const ctx=vm.createContext({world3D:w,document:{createElement:node,getElementById:id=>nodes[id]||(nodes[id]=node())},addEventListener(){}});
 vm.runInContext(fs.readFileSync(path.join(base,'weather-chapter.js'),'utf8'),ctx);return{ctx,w,cards,api:ctx.WeatherChapter};
}
test('weather UI requires recognition and discards duplicate, stale and old-scene callbacks',()=>{
 const f=ui();f.w.gameState.realmPuzzles.zone21=C.transition(C.initial(),{type:'choice',index:0,value:'WEATHER'}).state;
 f.api.beginSpeech('WEATHER');assert.equal(f.cards[0].options.requireRecognition,true);assert.equal(f.w.gameState.realmPuzzles.zone21.stage,0);
 f.cards[0].pass();f.cards[0].pass();assert.equal(f.w.gameState.realmPuzzles.zone21.stage,1);
 f.w.gameState.realmPuzzles.zone21=C.transition(at(1),{type:'choice',index:1,value:'CLOUDY'}).state;f.api.beginSpeech('CLOUDY');f.api.close();f.cards[1].pass();assert.equal(f.w.gameState.realmPuzzles.zone21.stage,1);
 f.api.beginSpeech('CLOUDY');f.w.activeZoneGroup={};f.cards[2].pass();assert.equal(f.w.gameState.realmPuzzles.zone21.stage,1);
});

function checkpoint(){const state={xp:0,inventory:[],practicedWordsByZone:{zone21:['WEATHER']},realmPuzzles:{zone21:at(5)}};for(const flag of Progress.flags)state[flag]=false;return{version:1,owner:'guest',zone:'zone21',savedAt:1,state,player:{x:0,y:1.6,z:11.2,yaw:0,pitch:0}};}
test('generated single-file GAS schema roundtrips zone21 and protects its weather puzzle state',()=>{
 const server=require('./helpers/backend.cjs')({bundle:true}),caps=server.post({action:'adventureCapabilities'});assert.ok(caps.schemaZones.includes('zone21'));
 const packet={action:'saveAdventure',owner:'guest',checkpointId:'a'.repeat(32),secret:'b'.repeat(64),requestId:'c'.repeat(32),expectedRevision:0,snapshot:checkpoint()};
 const saved=server.post(packet);assert.equal(saved.status,'success',JSON.stringify(saved));const loaded=server.post({...packet,action:'getAdventure'});assert.equal(loaded.snapshot.state.realmPuzzles.zone21.stage,5);assert.equal(server.post(packet).replayed,true);
});

test('older cloud schemas keep a zone21 checkpoint local instead of stripping it',async()=>{
 const storage=require('./helpers/storage.cjs')(),zones={zone7:{id:'zone7',words:[]},zone21:{id:'zone21',words:C.words}};let writes=0;
 const client=new (require('../adventure-cloud.js').CloudCheckpointClient)({storage:storage.storage,crypto:crypto.webcrypto,owner:'guest',zones,endpoint:'fixture',send:async payload=>{if(payload.action==='saveAdventure'){writes++;return{status:'success',revision:1};}return{status:'success',protocol:'adventure-v1',schemaZones:['zone7']};}});
 assert.equal(await client.probe(),true);assert.equal(await client.enable(checkpoint()),false);assert.equal(client.state,'schema_unsupported');assert.equal(writes,0);
});
