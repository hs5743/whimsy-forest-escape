/* Puzzle checkpoints are separate from the learning-record service. */
(function(root) {
  'use strict';
  const flags=['candleLit','bookOpened','hasKey','drawerOpened','hasRedPotion','hasBluePotion','alchemyMixed','hasStarStone','hasFish','catPracticed','mimicFed','hasFlowerStone','doorSocketsFilled','doorStonePlaced','doorOpened','escaped'];
  const number=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
  function ownerKey(profile,preview=false) {return preview?'preview':!profile||profile.isGuest?'guest':'student:'+String(profile.studentId||'').slice(0,100);}
  function validate(raw,owner,zones) {
    if(!raw||raw.version!==1||raw.owner!==owner||!zones[raw.zone]||!number(raw.savedAt,0,1e14))return null;
    const s=raw.state,p=raw.player;
    if(!s||!p||!number(s.xp,0,1000000)||!Array.isArray(s.inventory)||s.inventory.length>128)return null;
    if(!number(p.x,-1000,1000)||!number(p.z,-1000,1000)||!number(p.y,0,100)||!number(p.yaw,-1e6,1e6)||!number(p.pitch,-1.6,1.6))return null;
    const state={xp:Math.floor(s.xp),inventory:[],practicedWordsByZone:{}};
    for(const key of flags){if(typeof s[key]!=='boolean')return null;state[key]=s[key];}
    const ids=new Set();
    for(const item of s.inventory){
      if(!item||typeof item.id!=='string'||!/^[A-Z0-9_]{1,48}$/.test(item.id)||typeof item.name!=='string'||item.name.length>80)return null;
      if(ids.has(item.id))continue;ids.add(item.id);
      state.inventory.push({id:item.id,name:item.name,color:typeof item.color==='string'&&/^#[0-9a-f]{3,8}$/i.test(item.color)?item.color:'#ecc94b'});
    }
    for(const [id,zone] of Object.entries(zones)){
      const list=s.practicedWordsByZone?.[id];
      if(Array.isArray(list))state.practicedWordsByZone[id]=[...new Set(list.filter(word=>zone.words.includes(word)))];
    }
    return {version:1,owner,zone:raw.zone,savedAt:raw.savedAt,state,player:{x:p.x,y:p.y,z:p.z,yaw:p.yaw,pitch:p.pitch}};
  }
  function capture(world,owner,now=Date.now()) {
    const state={xp:world.gameState.xp,inventory:world.gameState.inventory,practicedWordsByZone:world.gameState.practicedWordsByZone||{}};
    for(const key of flags)state[key]=world.gameState[key]===true;
    return {version:1,owner,zone:world.zoneManager.currentZoneId,savedAt:now,state,player:{x:world.player.pos.x,y:world.player.pos.y,z:world.player.pos.z,yaw:world.player.yaw,pitch:world.player.pitch}};
  }
  function applySavedPosition(player,saved,blocked) {
    if(!saved||!number(saved.x,-1000,1000)||!number(saved.z,-1000,1000)||!number(saved.yaw,-1e6,1e6)||!number(saved.pitch,-1.6,1.6)||blocked(saved.x,saved.z,player.radius))return false;
    player.pos.set(saved.x,1.6,saved.z);player.yaw=saved.yaw;player.pitch=saved.pitch;return true;
  }
  class CheckpointStore {
    constructor(storage,owner,zones){this.storage=storage;this.owner=owner;this.zones=zones;this.key='whimsy.adventure.v1:'+encodeURIComponent(owner);this.status='empty';this.savedAt=null;this.unreadable=null;}
    load(){
      try{
        const text=this.storage.getItem(this.key);if(!text){this.status='empty';return null;}
        let record=null;try{record=text.length<=256000?validate(JSON.parse(text),this.owner,this.zones):null;}catch(error){};
        if(!record){this.unreadable=text.slice(0,256000);this.status='invalid';return null;}
        this.savedAt=record.savedAt;this.status='saved';return record;
      }catch(error){this.status='unavailable';return null;}
    }
    save(snapshot){
      const record=validate(snapshot,this.owner,this.zones);if(!record){this.status='invalid';return false;}
      try{
        if(this.unreadable!==null){this.storage.setItem(this.key+':unreadable',this.unreadable);this.unreadable=null;}
        this.storage.setItem(this.key,JSON.stringify(record));this.savedAt=record.savedAt;this.status='saved';return true;
      }catch(error){this.status='unavailable';return false;}
    }
  }
  const api={flags,ownerKey,validate,capture,applySavedPosition,CheckpointStore};root.AdventureProgress=api;
  if(typeof module!=='undefined')module.exports=api;
  if(!root.document)return;
  root.addEventListener('load',()=>{
    const world=root.world3D;if(!world?.zoneManager)return;
    const zones=world.zoneManager.zones,$=id=>root.document.getElementById(id);
    let store=null,signature=null,ready=false;
    function paint(){
      const who=world.devMode?'本機測試':store.owner==='guest'?'本機訪客':'此登入學生';
      const time=store.savedAt?new Date(store.savedAt).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'';
      $('adventureSaveStatus').textContent=store.status==='unavailable'?'此瀏覽器無法保存冒險進度；遊戲仍可繼續。':store.status==='invalid'?'原存檔無法使用；原始資料已保留，下一次成功存檔將建立新進度。':time?who+' · 已存此裝置 '+time:who+' · 開始探索後自動保存';
      $('adventureSaveScope').textContent='道具、機關與位置存於這台裝置。英語學習紀錄的雲端同步另由護照管理。';
    }
    function rebuildInventory(){
      const box=$('inventoryList');box.replaceChildren();
      for(const item of world.gameState.inventory){const el=root.document.createElement('div');el.className='inventory-item';el.style.borderColor=item.color;el.textContent=item.name;box.appendChild(el);}
    }
    function restore(record,profile,resetScene=false){
      const currentXp=world.devMode?0:Number(profile?.xp)||0;
      const state=record?.state||{xp:currentXp,inventory:[],practicedWordsByZone:{}};
      world.gameState={...state};
      for(const flag of flags)world.gameState[flag]=state[flag]===true;
      world.gameState.xp=Math.max(currentXp,state.xp||0);
      world.gameState.level=root.cloudSyncManager?.calculateLevel(world.gameState.xp)||Math.floor(world.gameState.xp/100)+1;
      if(!world.devMode&&profile){profile.xp=world.gameState.xp;profile.level=Math.max(Number(profile.level)||1,world.gameState.level);}
      world.hintController?.clear();root.speechManager?.stopListening();
      const wanted=record?.zone||'zone1';
      if(resetScene||record||world.zoneManager.currentZoneId!==wanted){if(!world.switchZone(wanted))world.switchZone('zone1');}
      else if(wanted==='zone1')world.restoreStudyState();
      if(record&&world.zoneManager.currentZoneId===wanted){
        const p=record.player;
        applySavedPosition(world.player,p,(x,z,r)=>world.isPositionBlocked(x,z,r));
      }
      world.camera.position.copy(world.player.pos);world.camera.rotation.set(world.player.pitch,world.player.yaw,0,'YXZ');
      world.clock.getDelta();world.frameCadence.reset();root.touchControls?.reset();rebuildInventory();
      world.updateHUDFromProfile({isGuest:true,...profile,xp:world.gameState.xp,level:world.gameState.level});
      const start=$('btnCoverStartJourney').querySelector('span');if(start)start.textContent=record?'繼續冒險':'開始冒險';
      const entered=$('btnEnterGameFinal');entered.textContent=record?'繼續我的冒險 →':'進入魔法書齋 →';
    }
    function selectProfile(profile){
      const owner=ownerKey(profile,world.devMode);if(store?.owner===owner)return;
      const resetScene=!!store;
      ready=false;store=new CheckpointStore(root.localStorage,owner,zones);signature=null;
      const record=store.load();restore(record,profile,resetScene);ready=true;paint();
    }
    function save(force=false){
      if(!ready)return false;
      const cover=$('gameCoverScreen');if(!force&&cover&&!cover.inert)return false;
      const snapshot=capture(world,store.owner);
      const next=JSON.stringify({...snapshot,savedAt:0});
      if(!force&&next===signature)return true;
      const saved=store.save(snapshot);if(saved)signature=next;paint();return saved;
    }
    selectProfile(root.cloudSyncManager?.profile);
    root.cloudSyncManager?.onProfileUpdated(selectProfile);
    $('adventureSaveNow').addEventListener('click',()=>{const saved=save(true);world.showToast(saved?'冒險進度已存於此裝置。':'無法存檔，請確認瀏覽器允許網站儲存資料。');});
    root.setInterval(()=>save(),1000);
    root.document.addEventListener('visibilitychange',()=>{if(root.document.hidden)save();});
    root.addEventListener('pagehide',()=>save());
    world.adventureProgress={save,restore,store:()=>store};
  });
})(typeof window!=='undefined'?window:globalThis);
