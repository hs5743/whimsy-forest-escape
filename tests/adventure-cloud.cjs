const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
require('../realm-quests.js');
const Progress=require('../adventure-progress.js');
const Cloud=require('../adventure-cloud.js');
const base=path.resolve(__dirname,'..');
const zones={zone1:{id:'zone1',words:['LIGHT','BOOK']},zone2:{id:'zone2',words:['APPLE']},zone5:{id:'zone5',words:['TIME','TRAIN']}};
function snapshot(owner='guest'){
 const state={xp:350,inventory:[{id:'KEY',name:'黃銅鑰匙',color:'#abc'}],practicedWordsByZone:{zone1:['LIGHT']},realmPuzzles:{zone5:{hour:8,minute:30,platform:1,boarded:false}}};
 for(const flag of Progress.flags)state[flag]=false;state.candleLit=true;
 return {version:1,owner,zone:'zone5',savedAt:1000,state,player:{x:1,y:1.6,z:3,yaw:.2,pitch:.1}};
}
function storage(){const map=new Map();return {map,getItem:key=>map.get(key)||null,setItem:(key,value)=>map.set(key,value)};}
function backend(){
 const sheets=new Map();let writes=0,releases=0,locked=false;
 function sheet(){const rows=[];return {rows,getDataRange:()=>({getValues:()=>rows.map(r=>r.slice())}),appendRow:r=>{rows.push(r.slice());writes++;},setFrozenRows:()=>{},getRange:(r,c,h=1,w=1)=>({setValues:values=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++){rows[r+y-1]??=[];rows[r+y-1][c+x-1]=values[y][x];}writes++;},setValue:value=>{rows[r-1]??=[];rows[r-1][c-1]=value;writes++;}})};}
 const ss={getSheetByName:name=>sheets.get(name)||null,insertSheet:name=>{const s=sheet();sheets.set(name,s);return s;}};
 const ctx=vm.createContext({console,SpreadsheetApp:{getActiveSpreadsheet:()=>ss},LockService:{getScriptLock:()=>({tryLock:()=>!locked,releaseLock:()=>releases++})},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({text,setMimeType(){return this;}})},Utilities:{DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(algorithm,value)=>Array.from(crypto.createHash('sha256').update(value,'utf8').digest(),n=>n>127?n-256:n)}});
 for(const name of ['AdventureSchema.gs','AdventureCheckpoints.gs','Code.gs']){
  let source=fs.readFileSync(path.join(base,'gas',name),'utf8');if(name==='Code.gs')source=source.replace(/const APP_SECURITY_TOKEN = [^\n]+/,'const APP_SECURITY_TOKEN = "test-auth";');vm.runInContext(source,ctx,{filename:name});
 }
 const call=payload=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify({token:'test-auth',...payload})}}).text);
 return {call,sheets,ss,ctx,writes:()=>writes,releases:()=>releases,setLocked:value=>locked=value};
}
function client(server,owner='guest',local=storage(),send=payload=>Promise.resolve(server.call(payload))){return new Cloud.CloudCheckpointClient({storage:local,crypto:crypto.webcrypto,send,owner,zones,endpoint:'https://example.test/exec'});}
function packet(record=snapshot()){return {action:'saveAdventure',owner:record.owner,checkpointId:'a'.repeat(32),secret:'b'.repeat(64),expectedRevision:0,requestId:'c'.repeat(32),snapshot:record};}

test('generated backend validators match the current gameplay source and vocabulary definitions',()=>{
 assert.equal(fs.readFileSync(path.join(base,'gas/AdventureSchema.gs'),'utf8'),require('../scripts/build-gas-schema.cjs')());
 for(const name of fs.readdirSync(path.join(base,'gas')).filter(n=>n.endsWith('.gs')))new vm.Script(fs.readFileSync(path.join(base,'gas',name),'utf8'),{filename:name});
});
test('continuation codes use secure random bytes and cannot be generated with an insecure fallback',()=>{
 const a=Cloud.generateCode(crypto.webcrypto),b=Cloud.generateCode(crypto.webcrypto);assert.ok(Cloud.parseCode(a));assert.notEqual(a,b);assert.equal(Cloud.parseCode('https://example.test/?code='+a),null);assert.throws(()=>Cloud.generateCode({}));
});
test('capability checks and unauthorized requests cannot create or write checkpoint sheets',()=>{
 const server=backend();assert.equal(server.call({action:'adventureCapabilities'}).protocol,'adventure-v1');assert.equal(server.writes(),0);
 assert.equal(server.call({...packet(),token:'wrong'}).status,'error');assert.equal(server.writes(),0);assert.equal(server.releases(),2);
 server.setLocked(true);assert.equal(server.call(packet()).status,'busy');assert.equal(server.writes(),0);
});
test('backend stores only digests for access keys and roundtrips the complete puzzle checkpoint',()=>{
 const server=backend(),p=packet();const result=server.call(p);assert.equal(result.status,'success');assert.equal(result.revision,1);
 const rows=server.sheets.get('AdventureCheckpoints').rows;assert.equal(rows.length,2);assert.notEqual(rows[1][1],p.secret);assert.equal(rows[1][1].length,64);assert.notEqual(rows[1][2],p.owner);
 const loaded=server.call({...p,action:'getAdventure'});assert.equal(loaded.snapshot.state.inventory[0].name,'黃銅鑰匙');assert.equal(loaded.snapshot.state.realmPuzzles.zone5.minute,30);assert.equal(loaded.snapshot.player.yaw,.2);
 assert.equal(server.sheets.size,1); // No Students, Logs or learning record is touched.
});
test('wrong continuation keys and different student identities cannot read or modify a saved adventure',()=>{
 const server=backend(),p=packet(snapshot('student:50101'));assert.equal(server.call(p).status,'success');const writes=server.writes();
 for(const mutation of [{secret:'d'.repeat(64)},{owner:'student:50102'},{owner:'guest'}]){
  const denied=server.call({...p,...mutation,action:'getAdventure'});assert.equal(denied.code,'access');assert.equal(denied.snapshot,undefined);
  assert.equal(server.call({...p,...mutation,snapshot:{...p.snapshot,owner:mutation.owner||p.owner},expectedRevision:1,requestId:'e'.repeat(32)}).code,'access');
 }assert.equal(server.writes(),writes);
});
test('stale revisions and reused request identifiers cannot overwrite another device checkpoint',()=>{
 const server=backend(),p=packet();assert.equal(server.call(p).revision,1);assert.equal(server.call(p).replayed,true);const writes=server.writes();
 const different=structuredClone(p);different.snapshot.player.x=7;assert.equal(server.call(different).code,'request_reused');
 const stale=server.call({...different,requestId:'d'.repeat(32)});assert.equal(stale.status,'conflict');assert.equal(stale.revision,1);assert.equal(server.writes(),writes);
});
test('malformed and oversized snapshots are rejected before creating a cloud row',()=>{
 const server=backend();for(const change of [p=>p.snapshot.player.x=Infinity,p=>p.snapshot.state.candleLit='yes',p=>p.snapshot.zone='zone99',p=>p.snapshot.owner='student:other',p=>p.snapshot.extra='x'.repeat(21000),p=>p.expectedRevision=-1]){
  const p=packet();change(p);assert.equal(server.call(p).status,'error');
 }assert.equal(server.writes(),0);
});
test('two independent device clients transfer a checkpoint and make conflicts explicit',async()=>{
 const server=backend(),a=client(server),b=client(server);assert.equal(await a.probe(),true);assert.equal(await b.probe(),true);assert.equal(await a.enable(snapshot()),true);
 const loaded=await b.download(a.link.code);assert.equal(loaded.snapshot.state.realmPuzzles.zone5.platform,1);assert.equal(b.link,null);assert.equal(b.adopt(loaded),true);
 const first=snapshot();first.player.x=5;assert.equal(await a.push(first),true);
 const second=snapshot();second.player.z=7;assert.equal(await b.push(second),false);assert.equal(b.state,'conflict');assert.equal((await a.download()).snapshot.player.x,5);
 assert.equal(await b.keepLocal(second),true);assert.equal(b.link.revision,3);assert.equal((await a.download()).snapshot.player.z,7);
 assert.equal(await a.push(snapshot()),false);assert.equal(a.state,'conflict');const chosen=await a.download();assert.equal(a.adopt(chosen),true);assert.equal(a.link.revision,3);
});
test('a lost acknowledgement survives reload and retries the exact request before newer local changes',async()=>{
 const server=backend(),local=storage();let lost=true;const sent=[];const send=async payload=>{const response=server.call(payload);if(payload.action==='saveAdventure'){sent.push(structuredClone(payload));if(lost){lost=false;throw Error('Lost acknowledgement');}}return response;};
 const a=client(server,'guest',local,send);await a.probe();assert.equal(await a.enable(snapshot()),false);assert.equal(a.state,'offline');assert.ok(a.link.pending);
 const b=client(server,'guest',local,send);await b.probe();const newer=snapshot();newer.player.x=8;assert.equal(await b.push(newer),true);assert.equal(b.link.revision,2);assert.equal(sent[0].requestId,sent[1].requestId);assert.deepEqual(sent[0].snapshot,sent[1].snapshot);assert.notEqual(sent[1].requestId,sent[2].requestId);assert.equal(sent[2].expectedRevision,1);
});
test('unsupported, busy and unauthenticated services never claim successful synchronization',async()=>{
 for(const [response,state]of [[{status:'error',message:'Unknown action: adventureCapabilities'},'unsupported'],[{status:'busy'},'busy'],[{status:'error',message:'Unauthorized'},'connection_error']]){
  let writes=0;const c=client(backend(),'guest',storage(),async payload=>{if(payload.action==='saveAdventure')writes++;return response;});assert.equal(await c.probe(),false);assert.equal(c.state,state);assert.equal(await c.enable(snapshot()),false);assert.equal(writes,0);assert.equal(c.link,null);
 }
});
test('storage failures do not send cloud writes or lose the only continuation code',async()=>{
 const server=backend(),c=client(server,'guest',{getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('quota');}});await c.probe();assert.equal(await c.enable(snapshot()),false);assert.equal(c.state,'storage_error');assert.equal(server.writes(),0);assert.equal(c.link,null);
});
test('corrupt stored connection metadata is retained before creating a new connection',async()=>{
 const server=backend(),local=storage(),seed=client(server,'guest',local);local.setItem(seed.key,'{broken');const c=client(server,'guest',local);assert.equal(c.state,'link_invalid');await c.probe();assert.equal(await c.enable(snapshot()),true);assert.equal(local.getItem(c.key+':unreadable'),'{broken');
});
test('endpoint and student changes have separate continuation credentials and pending writes',async()=>{
 const server=backend(),local=storage(),a=client(server,'student:50101',local);await a.probe();await a.enable(snapshot('student:50101'));const b=client(server,'student:50102',local);assert.equal(b.link,null);await b.probe();assert.equal(await b.download(a.link.code),null);assert.equal(b.state,'access_error');
 const other=new Cloud.CloudCheckpointClient({storage:local,crypto:crypto.webcrypto,send:async()=>({}),owner:a.owner,zones,endpoint:'https://other.test/exec'});assert.equal(other.link,null);assert.notEqual(other.key,a.key);
});
test('pausing automatic upload remains paused after reopening the game',async()=>{
 const server=backend(),local=storage(),a=client(server,'guest',local);await a.probe();await a.enable(snapshot());assert.equal(a.setAuto(false),true);const b=client(server,'guest',local);assert.equal(b.link.autoUpload,false);
});
test('invalid recovery codes and corrupt remote records never return a restorable snapshot',async()=>{
 const server=backend(),c=client(server);await c.probe();assert.equal(await c.download('bad'),null);assert.equal(c.state,'invalid_code');await c.enable(snapshot());server.sheets.get('AdventureCheckpoints').rows[1][6]='{broken';assert.equal(await c.download(),null);
});
test('an in-flight save cannot be replaced by a second request from the same client',async()=>{
 const server=backend();let release;const c=client(server,'guest',storage(),payload=>payload.action==='saveAdventure'?new Promise(resolve=>{release=()=>resolve(server.call(payload));}):Promise.resolve(server.call(payload)));await c.probe();const pending=c.enable(snapshot());assert.equal(c.busy,true);const newer=snapshot();newer.player.x=4;assert.equal(await c.push(newer),false);release();assert.equal(await pending,true);assert.equal(c.link.revision,1);
});

function browserProgress(local=storage()){
 const elements=new Map(),events={},profiles=[];
 const element=id=>{if(!elements.has(id))elements.set(id,{style:{},inert:true,textContent:'',value:'',handlers:{},focus(){},addEventListener(name,cb){this.handlers[name]=cb;},replaceChildren(){},appendChild(){},querySelector(){return {textContent:''};}});return elements.get(id);};
 const vector=()=>({x:0,y:1.6,z:0,set(x,y,z){Object.assign(this,{x,y,z});},copy(p){Object.assign(this,{x:p.x,y:p.y,z:p.z});}});
 const world={devMode:false,gameState:{},zoneManager:{zones,currentZoneId:'zone1'},player:{pos:vector(),yaw:0,pitch:0,radius:.45},camera:{position:vector(),rotation:{set(){}}},clock:{getDelta(){}},frameCadence:{reset(){}},restoreStudyState(){},updateHUDFromProfile(){},isPositionBlocked(){return false;},showToast(){},switchZone(id){this.zoneManager.currentZoneId=id;this.player.pos.set(0,1.6,0);return true;}};
 const manager={profile:{isGuest:true,xp:10,level:1},calculateLevel:xp=>Math.floor(xp/100)+1,onProfileUpdated:cb=>profiles.push(cb)};
 const window={document:{getElementById:element,createElement:()=>({style:{}}),addEventListener(){}},localStorage:local,RealmQuests:globalThis.RealmQuests,world3D:world,cloudSyncManager:manager,addEventListener:(name,cb)=>events[name]=cb,setInterval(){}};
 vm.runInContext(fs.readFileSync(path.join(base,'adventure-progress.js'),'utf8'),vm.createContext({window,console}));events.load();
 return {world,local,manager,window,element,events,api:world.adventureProgress,changeProfile(profile){manager.profile=profile;for(const cb of profiles)cb(profile);}};
}
test('cloud restoration backs up the live puzzle before applying it and can undo without rolling back learning XP',()=>{
 const f=browserProgress(),old=snapshot();old.zone='zone2';old.player.x=6;old.state.inventory=[{id:'FISH',name:'魚',color:'#abc'}];old.state.xp=40;
 f.world.gameState=structuredClone(old.state);f.world.zoneManager.currentZoneId=old.zone;f.world.player.pos.set(6,1.6,3);
 assert.equal(f.api.importCloud(snapshot()),true);assert.equal(f.world.zoneManager.currentZoneId,'zone5');assert.equal(f.world.gameState.realmPuzzles.zone5.platform,1);assert.equal(f.world.gameState.inventory[0].id,'KEY');assert.equal(f.api.hasCloudBackup(),true);
 assert.equal(f.api.restoreCloudBackup(),true);assert.equal(f.world.zoneManager.currentZoneId,'zone2');assert.equal(f.world.player.pos.x,6);assert.equal(f.world.gameState.inventory[0].id,'FISH');assert.equal(f.world.gameState.xp,350);
});
test('another student cannot import or undo a guest backup and switching back retains the guest checkpoint',()=>{
 const f=browserProgress();assert.equal(f.api.importCloud(snapshot()),true);const backup=f.local.getItem(f.api.store().key+':before-cloud');
 assert.equal(f.api.importCloud(snapshot('student:50101')),false);assert.equal(f.local.getItem(f.api.store().key+':before-cloud'),backup);
 f.changeProfile({isGuest:false,studentId:'50101',xp:0,level:1});assert.equal(f.api.store().owner,'student:50101');assert.equal(f.api.hasCloudBackup(),false);assert.equal(f.api.restoreCloudBackup(),false);assert.equal(f.world.zoneManager.currentZoneId,'zone1');
 f.changeProfile({isGuest:true,xp:350,level:4});assert.equal(f.world.zoneManager.currentZoneId,'zone5');assert.equal(f.api.hasCloudBackup(),true);
});
test('failed pre-restore backup leaves the live world and local checkpoint unchanged',()=>{
 const local=storage(),f=browserProgress(local);assert.equal(f.api.save(true),true);const before=JSON.stringify(f.api.snapshot()),stored=local.getItem(f.api.store().key),write=local.setItem;
 local.setItem=(key,value)=>{if(key.endsWith(':before-cloud'))throw Error('quota');return write(key,value);};
 assert.equal(f.api.importCloud(snapshot()),false);assert.equal(f.world.zoneManager.currentZoneId,'zone1');assert.equal(f.world.gameState.inventory.length,0);assert.equal(local.getItem(f.api.store().key),stored);assert.equal(JSON.parse(before).zone,'zone1');
});
test('the maximum backend revision cannot create a checkpoint the client cannot read',()=>{
 const server=backend(),p=packet();server.call(p);server.sheets.get('AdventureCheckpoints').rows[1][3]=100000000;const writes=server.writes();
 assert.equal(server.call({...p,requestId:'f'.repeat(32),expectedRevision:100000000}).code,'invalid');assert.equal(server.writes(),writes);
});

function browserCloud(server,send=payload=>Promise.resolve(server.call(payload))){
 const f=browserProgress();f.manager.gasUrl='https://example.test/exec';f.manager.clientToken='test-auth';f.window.crypto=crypto.webcrypto;f.window.closeSystemMenu=()=>{};
 const ctx=vm.createContext({window:f.window,console,AbortController,setTimeout,clearTimeout,fetch:async(_url,options)=>({ok:true,json:()=>send(JSON.parse(options.body))})});
 vm.runInContext(fs.readFileSync(path.join(base,'adventure-cloud.js'),'utf8'),ctx);f.events.load();
 return {...f,click:async id=>f.element(id).handlers.click(),client:()=>f.world.adventureCloud.client()};
}
test('cancelling a cloud preview keeps local gameplay and an existing version conflict unchanged',async()=>{
 const server=backend(),f=browserCloud(server);await f.click('adventureCloudCheck');await f.click('adventureCloudEnable');const c=f.client(),p=packet(snapshot());Object.assign(p,Cloud.parseCode(c.link.code));p.expectedRevision=1;p.requestId='d'.repeat(32);server.call(p);
 await f.click('adventureCloudUpload');assert.equal(c.state,'conflict');const writes=server.writes(),before=JSON.stringify(f.api.snapshot().state);
 await f.click('adventureCloudLoad');assert.equal(f.element('cloudRestoreModal').style.display,'flex');assert.equal(f.api.hasCloudBackup(),false);
 await f.click('cloudRestoreCancel');assert.equal(f.element('cloudRestoreModal').style.display,'none');assert.equal(c.state,'conflict');assert.equal(c.conflictRevision,2);assert.equal(JSON.stringify(f.api.snapshot().state),before);assert.equal(server.writes(),writes);assert.equal(f.api.hasCloudBackup(),false);
});
test('switching students during a cloud read cannot present or apply the previous student checkpoint',async()=>{
 const server=backend();let release;const f=browserCloud(server,payload=>payload.action==='getAdventure'?new Promise(resolve=>release=()=>resolve(server.call(payload))):Promise.resolve(server.call(payload)));
 await f.click('adventureCloudCheck');await f.click('adventureCloudEnable');const pending=f.click('adventureCloudLoad');await new Promise(resolve=>setImmediate(resolve));assert.equal(typeof release,'function');
 f.changeProfile({isGuest:false,studentId:'50101',xp:0,level:1});release();await pending;
 assert.equal(f.client().owner,'student:50101');assert.equal(f.element('cloudRestoreModal').style.display,'none');assert.equal(f.world.zoneManager.currentZoneId,'zone1');assert.equal(f.api.hasCloudBackup(),false);assert.equal(f.client().link,null);
});
test('confirming a cloud preview restores gameplay only after preserving the local version',async()=>{
 const server=backend(),p=packet();server.call(p);const f=browserCloud(server);await f.click('adventureCloudCheck');f.element('adventureCloudInput').value='EME1.'+p.checkpointId+'.'+p.secret;
 await f.click('adventureCloudLoad');assert.equal(f.world.zoneManager.currentZoneId,'zone1');await f.click('cloudRestoreConfirm');
 assert.equal(f.world.zoneManager.currentZoneId,'zone5');assert.equal(f.world.gameState.realmPuzzles.zone5.platform,1);assert.equal(f.api.hasCloudBackup(),true);assert.equal(f.client().state,'synced');
 await f.click('adventureCloudUndo');assert.equal(f.world.zoneManager.currentZoneId,'zone1');assert.equal(f.client().link.autoUpload,false);assert.equal(f.client().state,'local_restored');assert.equal(server.call({...p,action:'getAdventure'}).snapshot.zone,'zone5');
});
