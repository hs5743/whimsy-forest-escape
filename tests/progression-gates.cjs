const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');

function context(){
  const context={console,performance:{now:()=>0},window:null};
  context.window=context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'realm-quests.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(root,'spatial-zone-manager.js'),'utf8')+';globalThis.Manager=SpatialZoneManager;',context);
  return context;
}

test('mainline destinations require the previous solved quest, including the spoken first-chapter escape',()=>{
  const {RealmQuests:Q}=context();
  assert.equal(Q.canTravel('zone1','zone2',{}),false);
  assert.equal(Q.canTravel('zone1','zone2',{}, {zone1Complete:true}),true);
  assert.equal(Q.canTravel('zone1','zone8',{}, {zone1Complete:true}),false);
  assert.equal(Q.canTravel('zone1','zone8',{zone7:{object:'MOON',angle:90,aligned:true,moonSpoken:true}}, {zone1Complete:true}),true,'the local exit checks its immediate route edge');
  assert.equal(Q.canTravel('zone1','zone8',{zone7:{object:'MOON',angle:90,aligned:true,moonSpoken:true},zone2:{cart:[2,1,0],paid:true,spoken:{APPLE:2,MILK:1}},zone3:{care:[true,true,true],spoken:['TREE','RABBIT','BIRD']},zone4:{equipment:'BALL',stage:3,ballSpoken:true},zone5:{hour:8,minute:30,platform:2,boarded:true,spoken:['TIME','TRAIN']},zone6:{x:3,y:0,boatSpoken:true,windSpoken:true}}, {zone1Complete:true}),true);
  assert.equal(Q.canTravel('zone6','zone5',{}),true,'previous chapters stay available for review');
});

test('side destinations require their named parent quest even when the player level is high',()=>{
  const {RealmQuests:Q}=context();
  const parents={zone11:'zone2',zone12:'zone4',zone13:'zone12',zone14:'zone3',zone15:'zone5',zone16:'zone21',zone17:'zone12',zone18:'zone12',zone19:'zone2',zone20:'zone12',zone21:'zone7'};
  for(const [branch,parent] of Object.entries(parents)){
    assert.equal(Q.canTravel('zone1',branch,{}),false,branch+' stays locked without '+parent);
    const state=Q.initial(parent);
    assert.ok(state,parent+' has an initial quest state');
  }
  const market={cart:[2,1,0],paid:true,spoken:{APPLE:2,MILK:1}};
  assert.equal(Q.canTravel('zone2','zone11',{zone2:market}),true);
  assert.equal(Q.canTravel('zone2','zone19',{zone2:market}),true);
  assert.equal(Q.canTravel('zone2','zone11',{zone2:{...market,paid:false}}),false);
});

test('zone unlock reasons name both the level and story task that still block progress',()=>{
  const c=context();c.cloudSyncManager={profile:{level:10,accessLevel:1}};
  const manager=new c.Manager({gameState:{escaped:false,realmPuzzles:{}}},{metadataOnly:true});
  assert.deepEqual(Array.from(manager.getZoneUnlockReasons('zone2')),['先完成「見習學徒書齋」的秘境任務']);
  manager.world.gameState.escaped=true;
  assert.equal(manager.isZoneUnlocked('zone2'),true);
  assert.match(manager.getZoneUnlockReasons('zone3').join(' '),/陽光微風市集/);
  manager.world.gameState.realmPuzzles.zone2={cart:[2,1,0],paid:true,spoken:{APPLE:2,MILK:1}};
  assert.equal(manager.isZoneUnlocked('zone3'),true);
  assert.match(manager.getZoneUnlockReasons('zone14').join(' '),/守護獸之森花園/);
  assert.equal(manager.zones.zone14.reqLevel,manager.zones.zone3.reqLevel);
  assert.equal(manager.zones.zone21.reqLevel,manager.zones.zone7.reqLevel);
  assert.equal(manager.zones.zone16.reqLevel,manager.zones.zone21.reqLevel);
  assert.equal(manager.zones.zone17.reqLevel,manager.zones.zone12.reqLevel);
  assert.equal(manager.zones.zone18.reqLevel,manager.zones.zone12.reqLevel);
  const partial=new c.Manager({gameState:{escaped:true,realmPuzzles:{zone7:{object:'MOON',angle:90,aligned:true,moonSpoken:true}}}},{metadataOnly:true});
  assert.equal(partial.isZoneUnlocked('zone8'),false,'a completed late puzzle cannot stand in for unfinished earlier route stops');
  const completed={
    zone2:{cart:[2,1,0],paid:true,spoken:{APPLE:2,MILK:1}},zone3:{tool:'WATER',care:[true,true,true],spoken:['TREE','RABBIT','BIRD']},
    zone4:{equipment:'BALL',stage:3,ballSpoken:true},zone5:{hour:8,minute:30,platform:2,boarded:true,spoken:['TIME','TRAIN']},
    zone6:{x:3,y:0,boatSpoken:true,windSpoken:true},zone7:{object:'MOON',angle:90,aligned:true,moonSpoken:true}
  };
  const validRoute=new c.Manager({gameState:{escaped:true,realmPuzzles:completed}},{metadataOnly:true});
  assert.equal(validRoute.isZoneUnlocked('zone8'),true);
});

test('direct map and quick-entry flags cannot bypass the same story gates used by portals',()=>{
  const c=context(),Q=c.RealmQuests;
  let toast='';
  const manager={
    zones:{zone1:{id:'zone1',reqLevel:1},zone2:{id:'zone2',reqLevel:2}},
    currentZoneId:'zone1',
    world:{devMode:false,gameState:{escaped:false,realmPuzzles:{}},showToast:message=>toast=message}
  };
  manager.isZoneUnlocked=c.Manager.prototype.isZoneUnlocked;
  manager.getZoneUnlockReasons=c.Manager.prototype.getZoneUnlockReasons;
  const full=c.Manager.prototype.isZoneUnlocked;
  const getReasons=c.Manager.prototype.getZoneUnlockReasons;
  // Use the real zone metadata while keeping scene setup outside this gate test.
  const metadata=new c.Manager(manager.world,{metadataOnly:true});
  manager.zones=metadata.zones;
  manager.isZoneUnlocked=full.bind(manager);
  manager.getZoneUnlockReasons=getReasons.bind(manager);
  c.cloudSyncManager={profile:{level:10,accessLevel:1}};
  assert.equal(c.Manager.prototype.switchZone.call(manager,'zone2',{directAccess:true}),false);
  assert.match(toast,/見習學徒書齋/);
  assert.equal(manager.currentZoneId,'zone1');
  assert.equal(Q.canTravel('zone1','zone2',manager.world.gameState.realmPuzzles,{zone1Complete:false}),false);
});
