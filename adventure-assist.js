/* Child-requested clues. Hints never grade, grant items, or move the player. */
(function(root) {
  'use strict';
  const studySteps = [
    ['candleLit','LIGHT','candle','看看書桌旁邊，有沒有還沒亮起來的小物件。','靠近銅燭台，互動後先聽 LIGHT 的示範，再開口練習。'],
    ['bookOpened','BOOK','book','第一道光亮了，找找桌上可以閱讀的物件。','對準桌上的魔導書，練習 BOOK；打開書本後留意出現的物品。'],
    ['hasKey','KEY','key','書本打開後，有一樣小物品可以幫你開鎖。','對準書上方的黃銅鑰匙，練習 KEY，把它收入背包。'],
    ['hasRedPotion','RED','drawer','拿到鑰匙後，看看書桌上哪個地方需要開鎖。','用鑰匙打開抽屜，再練習 RED，取得紅色魔藥。'],
    ['hasBluePotion','BLUE','alchemy','另一種魔藥藏在可以調配藥水的地方。','找到煉金調劑台，練習 BLUE，觀察藥水顏色的變化。'],
    ['hasStarStone','STAR','alchemy','調配完成後，再看看煉金台上出現了什麼。','再次與煉金台互動，練習 STAR，收下星芒石與小魚乾。'],
    ['catPracticed','CAT','mimic','有個像寶箱的小夥伴正等著你認識牠。','對準貓咪寶箱怪，先練習 CAT。'],
    ['mimicFed','FISH','mimic','小夥伴肚子餓了，看看背包裡有沒有牠想吃的食物。','與貓咪寶箱怪互動，練習 FISH，餵牠小魚乾。'],
    ['hasFlowerStone','FLOWER','flower','吃飽的小夥伴送了你一樣像花朵的禮物。','對準花石刻，練習 FLOWER；也可以再次與寶箱怪互動。'],
    ['doorStonePlaced','DOOR','door','背包中的兩顆魔法石，能放在哪裡呢？','前往石門，練習 DOOR，把星芒石與花石刻放進凹槽。'],
    ['doorOpened','OPEN','door','石門上的兩個凹槽亮起來了，試著再與門互動。','再次對準石門，練習 OPEN，打開出口。'],
    ['escaped','SUN','exit_portal_zone1','門外的陽光在等你，沿著花田小路前進。','走向門外花田，練習 SUN，完成書齋的逃脫任務。']
  ];
  const places = {
    zone2:'逛逛蔬果與烘焙攤位，留意食物、飲品和招牌。',
    zone3:'看看花園裡的小動物、樹木與噴泉。',
    zone4:'走向操場上的球門、跑道和跳躍器材。',
    zone5:'找找月台的時鐘、火車與時間線索。',
    zone6:'留意碼頭、帆船、燈塔和海風。',
    zone7:'看看望遠鏡、星空與觀測站的天文裝置。',
    zone8:'找找雪地、冰山和能帶來溫暖的物件。',
    zone9:'探索殿堂的書本、卷軸與智慧裝置。',
    zone10:'看看空島的彩虹、雲朵與漂浮的魔法物件。'
  };
  function hintPlan(state,zone,completed=[]) {
    if(!zone || !Array.isArray(zone.words)) return null;
    if(zone.id==='zone1') {
      const step=studySteps.find(row=>!state[row[0]]);
      if(!step) return {key:'zone1:done',word:null,targetId:'exit_portal_zone1',clues:['書齋已完成！找找通往下一個秘境的路標。','沿花田路標前往微風市集，展開下一個任務。']};
      return {key:'zone1:'+step[0],word:step[1],targetId:step[2],clues:[step[3],step[4]]};
    }
    const passed=new Set(completed.map(w=>String(w).toUpperCase()));
    const word=zone.words.find(w=>!passed.has(w));
    return word ? {key:zone.id+':'+word,word,targetId:null,clues:[places[zone.id]||'看看附近能互動的魔法物件。','這次找與 '+word+' 有關的物件。靠近後互動，先聽示範再練習；不清楚可以重試。']} :
      {key:zone.id+':done',word:null,targetId:'guardian_'+zone.id,clues:['這個秘境的單字已完成，看看守護者或通往下一關的路標。','與守護者對話接受試煉，或沿路標前往下一個秘境。']};
  }
  function visible(object) {for(let o=object;o;o=o.parent) if(!o.visible)return false;return true;}
  function findHintTarget(world,plan) {
    if(!plan) return null;
    const targets=world.interactables.filter(visible);
    if(plan.targetId) {
      const exact=targets.find(o=>o.userData.id===plan.targetId);
      if(exact) return exact;
      if(plan.word==='FLOWER') return targets.find(o=>o.userData.id==='mimic')||null;
    }
    if(!plan.word)return targets.find(o=>o.userData.id==='OPEN'||(/前往|下一|Next/.test(o.userData.label||'')&&!/返回/.test(o.userData.label||'')))||null;
    const pattern=new RegExp('(^|[^A-Z])'+plan.word+'([^A-Z]|$)');
    return targets.find(o=>pattern.test((o.userData.id+' '+(o.userData.label||'')+' '+(o.userData.name||'')).toUpperCase()))||null;
  }
  function directionText(player,target) {
    const dx=target.x-player.pos.x,dz=target.z-player.pos.z;
    const distance=Math.hypot(dx,dz);
    if(distance<1)return '就在附近 · 靠近並對準後互動';
    const angle=Math.atan2(dx,-dz)+player.yaw;
    const normalized=Math.atan2(Math.sin(angle),Math.cos(angle));
    const direction=Math.abs(normalized)<Math.PI/6?'前方':Math.abs(normalized)>Math.PI*5/6?'後方':normalized>0?'右側':'左側';
    return direction+' · 約 '+Math.ceil(distance)+' 公尺 · 可用滑動或拖曳轉向';
  }
  const api={hintPlan,findHintTarget,directionText,studySteps};
  root.AdventureAssist=api;
  if(typeof module!=='undefined')module.exports=api;
  if(!root.document)return;
  root.addEventListener('load',()=>{
    const world=root.world3D;if(!world)return;
    const $=id=>root.document.getElementById(id),modal=$('hintModal');
    let plan=null,level=1,target=null,zoneGroup=null,ring=null;
    const center=new root.THREE.Vector3(),box=new root.THREE.Box3();
    const progress=new Map();
    function clearMarker() {
      target=null;zoneGroup=null;$('hintDirection').hidden=true;
      if(ring){world.scene.remove(ring);ring.geometry.dispose();ring.material.dispose();ring=null;}
    }
    function currentPlan() {
      const zone=world.zoneManager.zones[world.zoneManager.currentZoneId];
      const completed=world.gameState.practicedWordsByZone?.[zone.id]||root.cloudSyncManager?.profile?.completedWords||[];
      return hintPlan(world.gameState,zone,completed);
    }
    function paint() {
      $('hintLevel').textContent='提示 '+Math.min(level,3)+' / 3';
      $('hintCopy').textContent=level===1?plan.clues[0]:plan.clues[1];
      $('hintMore').textContent=level===1?'再給我一點提示':level===2?'幫我標示方向':'方向已標示';
      $('hintMore').disabled=level>=3;
    }
    function open() {
      if(world.isAnyModalOpen())return;
      plan=currentPlan();if(!plan)return;
      level=progress.get(plan.key)||1;paint();
      modal.style.display='flex';world.targetFocus?.select(null);root.touchControls?.reset();
    }
    function close(){modal.style.display='none';$('adventureHintBtn').focus({preventScroll:true});}
    $('adventureHintBtn').addEventListener('click',open);
    $('hintClose').addEventListener('click',close);
    $('hintContinue').addEventListener('click',close);
    $('hintStop').addEventListener('click',clearMarker);
    $('hintMore').addEventListener('click',()=>{
      const fresh=currentPlan();
      if(fresh.key!==plan.key){clearMarker();plan=fresh;level=1;paint();return;}
      level=Math.min(3,level+1);progress.set(plan.key,level);paint();
      if(level===3){
        clearMarker();target=findHintTarget(world,plan);zoneGroup=world.activeZoneGroup;
        if(!target){$('hintCopy').textContent+=' 這個目標暫時沒有方向標記，請留意附近路標或守護者。';return;}
        ring=new root.THREE.Mesh(new root.THREE.RingGeometry(.65,.8,32),new root.THREE.MeshBasicMaterial({color:0xffd65a,side:root.THREE.DoubleSide,transparent:true,opacity:.9,depthWrite:false}));
        ring.rotation.x=-Math.PI/2;ring.userData.nonBlocking=true;world.scene.add(ring);
        $('hintDirection').hidden=false;close();update();
      }
    });
    function update(){
      if(!target || root.document.hidden)return;
      if(world.activeZoneGroup!==zoneGroup || !visible(target) || !target.parent || currentPlan().key!==plan.key){clearMarker();return;}
      box.setFromObject(target);box.getCenter(center);
      ring.position.set(center.x,box.min.y+.03,center.z);
      ring.visible=!world.isAnyModalOpen();
      $('hintDirectionCopy').textContent=directionText(world.player,center);
    }
    root.setInterval(update,250);
    root.document.addEventListener('visibilitychange',()=>{if(root.document.hidden&&ring)ring.visible=false;});
    world.hintController={clear:clearMarker};
  });
})(typeof window!=='undefined'?window:globalThis);
