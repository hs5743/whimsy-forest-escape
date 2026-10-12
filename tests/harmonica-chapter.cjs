const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../harmonica-chapter.js'),S=require('../harmonica-scene.js');
const correct=['SLIDE','MOUTHPIECE','REED','LEFT','RIGHT','HALF'];
function prepared(s){let r=s;if(r.stage<6)r=C.transition(r,{type:'choice',index:r.stage,value:correct[r.stage]}).state;if(r.stage===5)for(const air of ['BLOW','DRAW'])for(const slide of [false,true])r=C.transition(r,{type:'note',hole:1,air,slide}).state;if(r.stage===6)for(const v of C.melody)r=C.transition(r,{type:'note',...v}).state;return r;}
function at(n){let s=C.initial();for(let i=0;i<n;i++){s=prepared(s);s=C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state;}return s;}
test('C solo tuning repeats its main pattern and preserves the special highest draw note',()=>{
const expectedBlow=[60,64,67,72,72,76,79,84,84,88,91,96],expectedDraw=[62,65,69,71,74,77,81,83,86,89,93,95];
for(let n=1;n<=12;n++){assert.equal(C.note(n,'BLOW',false),expectedBlow[n-1]);assert.equal(C.note(n,'DRAW',false),expectedDraw[n-1]);assert.equal(C.note(n,'BLOW',true),expectedBlow[n-1]+1);assert.equal(C.note(n,'DRAW',true),n===12?98:expectedDraw[n-1]+1);}assert.equal(C.noteName(61),'C♯4');assert.equal(C.noteName(65),'F4');for(const args of [[0,'BLOW',false],[13,'DRAW',false],[1.5,'BLOW',false],[1,'SUCK',false],[1,'BLOW',1]])assert.equal(C.note(...args),null);
});
test('all eight gallery steps require both their learning proof and fresh recognition',()=>{
for(let i=0;i<8;i++){const s=prepared(at(i));assert.equal(C.transition(s,{type:'speak',word:C.words[i]}).state.stage,i);assert.equal(C.transition(s,{type:'speak',word:C.words[i],verifiedWord:'WRONG'}).state.stage,i);assert.equal(C.transition(s,{type:'speak',word:C.words[i],verifiedWord:C.words[i]}).state.stage,i+1);}assert.equal(C.solved(at(8)),true);assert.equal(C.canSpeak(at(8),undefined),false);assert.equal(C.canSpeak(C.initial(),'SMALL'),false);
});
test('wrong exhibit answers and premature choices never advance or unlock the next word',()=>{
let s=C.transition(C.initial(),{type:'choice',index:0,value:'DIATONIC'}).state;assert.equal(C.canSpeak(s,'SMALL'),false);s=C.transition(s,{type:'choice',index:1,value:'MOUTHPIECE'}).state;assert.equal(s.choices[1],'');s=C.transition(s,{type:'choice',index:0,value:'SLIDE'}).state;assert.equal(s.stage,0);assert.equal(C.canSpeak(s,'SMALL'),true);
});
test('slide lesson requires all four combinations on hole one, not repeated clicks or a high hole',()=>{
let s=at(5);s=C.transition(s,{type:'choice',index:5,value:'HALF'}).state;for(let i=0;i<5;i++)s=C.transition(s,{type:'note',hole:1,air:'BLOW',slide:false}).state;assert.equal(s.explored.length,1);assert.equal(C.canSpeak(s,'HIGH'),false);s=C.transition(s,{type:'note',hole:12,air:'DRAW',slide:true}).state;assert.equal(s.explored.length,1);s=prepared(s);assert.equal(C.canSpeak(s,'HIGH'),true);s=C.transition(s,{type:'choice',index:5,value:'VOLUME'}).state;assert.equal(C.canSpeak(s,'HIGH'),false);
});
test('five-note exercise enforces hole, airflow and released slide; retries preserve oral progress',()=>{
let s=at(6);s=C.transition(s,{type:'note',...C.melody[0]}).state;assert.equal(s.melody.length,1);s=C.transition(s,{type:'note',hole:1,air:'DRAW',slide:true}).state;assert.equal(s.melody.length,0);assert.equal(s.stage,6);assert.equal(s.spoken.length,6);s=prepared(s);assert.equal(C.canSpeak(s,'PLAY'),true);assert.equal(s.stage,6);s=C.transition(s,{type:'reset'}).state;assert.equal(C.canSpeak(s,'PLAY'),false);assert.equal(s.stage,6);
});
test('gallery checkpoints preserve genuine progress and truncate inconsistent completion',()=>{
for(let n=0;n<=8;n++)assert.deepEqual(C.validate(JSON.parse(JSON.stringify(at(n)))),at(n));assert.equal(C.solved({...at(8),spoken:[]}),false);assert.equal(C.validate({...at(8),choices:['DIATONIC',...at(8).choices.slice(1)]}).stage,0);assert.equal(C.validate({...at(8),explored:['BLOW:0']}).stage,5);assert.equal(C.validate({...at(8),melody:[]}).stage,6);for(const raw of [{...at(6),explored:['BLOW:0','BLOW:0']},{...at(7),melody:[{hole:13,air:'BLOW',slide:false}]},{...at(8),spoken:['SONG']},{...at(0),choices:[]}])assert.equal(C.validate(raw),null);
});
function pure(){const ctx=vm.createContext({});for(const f of ['restaurant-chapter.js','school-chapter.js','harmonica-chapter.js','realm-quests.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),ctx);return ctx;}
test('gallery travels through the completed school branch and preserves old route restrictions',()=>{
const ctx=pure(),R=ctx.RealmQuests,school=ctx.SchoolChapter;let s=school.initial();for(const w of school.words){if(w==='CLASSROOM')s=school.transition(s,{type:'history',value:1963}).state;if(w==='DRAW')s=school.transition(s,{type:'drawing',value:'LION'}).state;if(w==='LION')for(const v of [1,1,2])s=school.transition(s,{type:'beat',value:v}).state;s=school.transition(s,{type:'speak',word:w,verifiedWord:w}).state;}
assert.equal(R.canTravel('zone12','zone13',{}),false);assert.equal(R.canTravel('zone12','zone13',{zone12:s}),true);assert.equal(R.canTravel('zone13','zone12',{}),true);assert.equal(R.canTravel('zone13','zone10',{}),false);assert.equal(R.canTravel('zone12','zone10',{zone12:s}),false);assert.equal(R.canTravel('zone12','zone4',{}),true);assert.equal(R.solved('zone13',at(8)),true);assert.equal(R.sanitizeMap({zone13:at(6)}).zone13.stage,6);
});
test('gallery core stays within the supplied GEPT reference and adds no old chapter words',()=>{
const V=require('../gept-kids-vocabulary.js'),ctx=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(__dirname,'../spatial-zone-manager.js'),'utf8')+';window.M=SpatialZoneManager;',ctx);ctx.window.M.prototype.initTextures=()=>{};const zones=new ctx.window.M({}).zones,old=new Set(Object.values(zones).filter(z=>z.id!=='zone13').flatMap(z=>Array.from(z.words)));assert.deepEqual(Array.from(zones.zone13.words),V.harmonicaCore);for(const word of C.words){assert.ok(V.entries[word]?.pages.length);assert.equal(old.has(word),false);}assert.equal(zones.zone13.parentZone,'zone12');
});
function geometryFixture(){
const T=require('../three.min.js'),ctx2d=new Proxy({},{get:(o,k)=>o[k]||(()=>{})}),ctx=vm.createContext({THREE:T,document:{createElement:()=>({getContext:()=>ctx2d})},HarmonicaChapter:{sync(){},solved:()=>false},SchoolChapter:{solved:()=>false}});vm.runInContext(fs.readFileSync(path.join(__dirname,'../harmonica-scene.js'),'utf8'),ctx);const g=new T.Group(),w={interactables:[],animators:[],gameState:{realmPuzzles:{}},player:{pos:new T.Vector3(),yaw:0},showToast(){},adventureProgress:{save(){}}},manager={world:w,tex:{restaurantPlaster:new T.Texture(),restaurantWood:new T.Texture()},switchZone:()=>true};return {ctx,g,w,manager,T};}
test('gallery geometry is finite, draw batches bounded and every learning station physically represented',()=>{
const {ctx,g,w,manager}=geometryFixture();ctx.HarmonicaScene.build(manager,g);let meshes=0,instances=0;g.traverse(o=>{if(o.isMesh){meshes++;for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));if(o.isInstancedMesh){instances+=o.count;for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}}});assert.ok(meshes<100,meshes);assert.ok(instances>500,instances);assert.equal(w.interactables.length,9);assert.equal(new Set(w.interactables.map(o=>o.userData.id)).size,9);assert.equal(w.harmonicaRefs.banner.visible,false);for(let n=0;n<=8;n++)assert.ok(w.interactables.some(o=>o.userData.id===C.hint(at(n)).targetId));
});
test('gallery aisles, inner doorway and exits remain walkable while exhibit furniture blocks',()=>{
const blocked=(x,z)=>S.colliders().some(c=>x>c.minX-.3&&x<c.maxX+.3&&z>c.minZ-.3&&z<c.maxZ+.3);
for(const p of [[0,9.4],[0,10.1],[0,-8],[-4.5,-2],[4.5,-2],[0,-13]])assert.equal(blocked(...p),false,p.join(','));for(const p of [[0,-2],[-8,-13],[8,-13],[0,-17],[-14,0]])assert.equal(blocked(...p),true,p.join(','));
});
test('school exhibition entrance enforces parent completion and exits return to the same school',()=>{
const f=geometryFixture(),trips=[];f.manager.switchZone=id=>(trips.push(id),true);f.ctx.HarmonicaScene.buildEntrance(f.manager,f.g);f.w.interactables[0].userData.onClick();assert.deepEqual(trips,[]);f.ctx.SchoolChapter.solved=()=>true;f.w.interactables[0].userData.onClick();assert.deepEqual(trips,['zone13']);f.w.interactables=[];f.ctx.HarmonicaScene.build(f.manager,f.g);f.w.interactables.find(o=>o.userData.id==='harmonica_exit').userData.onClick();assert.deepEqual(trips,['zone13','zone12']);assert.equal(f.w.player.pos.z,-7.8);
});
function ui(){
const elements={},cards=[],node=()=>({style:{display:'none'},append(){},replaceChildren(){},setAttribute(){},focus(){},isConnected:false});const w={activeZoneGroup:{},zoneManager:{currentZoneId:'zone13'},gameState:{realmPuzzles:{zone13:prepared(C.initial())}},isAnyModalOpen:()=>false,openSpeechCard:(word,pass,options)=>cards.push({word,pass,options})};const ctx=vm.createContext({world3D:w,document:{createElement:node,getElementById:id=>elements[id]||(elements[id]=node())},addEventListener(){}});vm.runInContext(fs.readFileSync(path.join(__dirname,'../harmonica-chapter.js'),'utf8'),ctx);return {w,cards,api:ctx.HarmonicaChapter,ctx};
}
test('oral UI requires recognition and rejects duplicate, cancelled and stale scene callbacks',()=>{
const f=ui();f.api.beginSpeech('SMALL');assert.equal(f.w.gameState.realmPuzzles.zone13.stage,0);assert.equal(f.cards[0].options.requireRecognition,true);f.api.beginSpeech('SMALL');f.cards[1].pass();f.cards[1].pass();f.cards[0].pass();assert.equal(f.w.gameState.realmPuzzles.zone13.stage,1);f.w.gameState.realmPuzzles.zone13=prepared(at(1));f.api.beginSpeech('MOUTH');f.w.activeZoneGroup={};f.cards[2].pass();assert.equal(f.w.gameState.realmPuzzles.zone13.stage,1);
});
test('gallery tone preview is monophonic and releases all audio nodes on stop or exit',()=>{
const f=ui(),nodes=[],param={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};const node=()=>{const n={frequency:{...param},gain:{...param},connect(){},disconnect(){this.disconnected=true;},start(){},stop(){this.stopped=true;}};nodes.push(n);return n;};f.ctx.audioManager={init(){},sfxGain:{},ctx:{currentTime:0,createOscillator:node,createBiquadFilter:node,createGain:node}};
f.api.playTone(60);f.api.playTone(62);assert.ok(nodes.slice(0,3).every(n=>n.disconnected));f.api.stopTones();assert.ok(nodes.every(n=>n.disconnected));const count=nodes.length;f.w.zoneManager.currentZoneId='zone12';f.api.playTone(60);assert.equal(nodes.length,count);
});
