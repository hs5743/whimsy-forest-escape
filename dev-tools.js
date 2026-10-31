/* Developer level-select & stage-jump tools.
   Active when world3D.devMode is true (?dev=1 on localhost, file://, or hs5743.github.io).
   Dev mode writes to an isolated save slot and never uploads to student cloud records.

   URL shortcuts:
     ?dev=1                       open the game with the floating DEV panel (toggle with ` or F2)
     ?dev=1&zone=zone15           skip the cover screen and jump straight into a zone
     ?dev=1&zone=zone15&stage=5   ...with that zone's chapter set to stage 5
     ?dev=1&zone=zone5&stage=max  ...with the zone's puzzle already solved
*/
(function(root){
 'use strict';
 const speak=(C,s,word)=>C.transition(s,{type:'speak',word,verifiedWord:word}).state;
 const replay=(C,steps,prepare)=>n=>{let s=C.initial();for(let i=0;i<n;i++){s=prepare(s,i);s=speak(C,s,C.words[i]);}return s;};

 // Each chapter recipe returns a valid state reached through the chapter's own transition rules.
 const chapters={
  zone15:{module:'AirportChapter',steps:8,build:C=>{const ans=['AIRPORT','PLANE','TICKET','','WAIT','','TAXI','LATE'];return replay(C,8,s=>{if([0,1,2,4,6,7].includes(s.stage))return C.transition(s,{type:'choice',index:s.stage,value:ans[s.stage]}).state;if(s.stage===3)for(let index=0;index<3;index++)s=C.transition(s,{type:'collect',index}).state;if(s.stage===5)for(const key of ['gate','call'])s=C.transition(s,{type:'condition',key,value:2}).state;return s;});}},
  zone14:{module:'GreenhouseChapter',steps:8,build:C=>{const ans=['GARDEN','GREEN','BEE','BUTTERFLY','','GENTLY','','BEAUTIFUL'];return replay(C,8,s=>{if([0,1,2,3,5,7].includes(s.stage))return C.transition(s,{type:'choice',index:s.stage,value:ans[s.stage]}).state;if(s.stage===4)for(const key of ['water','light'])s=C.transition(s,{type:'condition',key,value:2}).state;if(s.stage===6)for(let index=0;index<3;index++)s=C.transition(s,{type:'collect',index}).state;return s;});}},
  zone13:{module:'HarmonicaChapter',steps:8,build:C=>{const ans=['SLIDE','MOUTHPIECE','REED','LEFT','RIGHT','HALF'];return replay(C,8,s=>{let r=s;if(r.stage<6)r=C.transition(r,{type:'choice',index:r.stage,value:ans[r.stage]}).state;if(r.stage===5)for(const air of ['BLOW','DRAW'])for(const slide of [false,true])r=C.transition(r,{type:'note',hole:1,air,slide}).state;if(r.stage===6)for(const v of C.melody)r=C.transition(r,{type:'note',...v}).state;return r;});}},
  zone12:{module:'SchoolChapter',steps:8,build:C=>replay(C,8,(s,i)=>{if(i===2)s=C.transition(s,{type:'history',value:1963}).state;if(i===4)s=C.transition(s,{type:'drawing',value:'LION'}).state;if(i===6)for(const value of [1,1,2])s=C.transition(s,{type:'beat',value}).state;return s;})},
  zone11:{module:'RestaurantChapter',steps:10,build:C=>{const seq=[{type:'order'},{type:'key'},{type:'door'},{type:'ingredient',index:0,delta:1},{type:'ingredient',index:0,delta:1},{type:'ingredient',index:1,delta:1},{type:'prepare',value:'WASH'},{type:'prepare',value:'PUT'},{type:'prepare',value:'COOK'},{type:'serve'}];return n=>{let s=C.initial();for(const a of seq.slice(0,n))s=C.transition(s,{...a,verifiedWord:C.requiredWord(a)}).state;return s;};}},
  zone21:{module:'WeatherChapter',steps:8,build:C=>replay(C,8,(s,i)=>C.transition(s,{type:'choice',index:i,value:C.choices[i][1]}).state)},
  zone16:{module:'CoastChapter',steps:8,build:C=>replay(C,8,(s,i)=>C.transition(s,{type:'choice',index:i,value:C.words[i]}).state)},
  zone17:{module:'LibraryChapter',steps:8,build:C=>replay(C,8,(s,i)=>C.transition(s,{type:'choice',index:i,value:C.choices[i][1]}).state)},
  zone18:{module:'MakerspaceChapter',steps:8,build:C=>replay(C,8,(s,i)=>C.transition(s,{type:'choice',index:i,value:C.words[i]}).state)},
  zone19:{module:'CarnivalChapter',steps:8,build:C=>replay(C,8,(s,i)=>C.transition(s,{type:'choice',index:i,value:C.words[i]}).state)},
  zone20:{module:'ArtWorkshopChapter',steps:8,build:C=>replay(C,8,(s,i)=>C.transition(s,{type:'touch',index:i}).state)}
 };
 // Mainline realm mechanisms: stage 0 = fresh, stage 1 = solved.
 const quests={
  zone2:[{type:'speak',value:'APPLE'},{type:'speak',value:'APPLE'},{type:'speak',value:'MILK'},{type:'quantity',index:0,value:2},{type:'quantity',index:1,value:1},{type:'pay'}],
  zone3:[0,1,2].flatMap(index=>[{type:'tool',value:['WATER','LEAF','SEEDS'][index]},{type:'speak',value:['TREE','RABBIT','BIRD'][index]}]),
  zone4:[{type:'equipment',value:'BALL'},{type:'speak',value:'BALL'},{type:'speak',value:'RUN'},{type:'speak',value:'JUMP'},{type:'speak',value:'SOCCER'}],
  zone5:[{type:'speak',value:'TIME'},{type:'speak',value:'TRAIN'},{type:'set',key:'hour',value:8},{type:'set',key:'minute',value:30},{type:'set',key:'platform',value:2},{type:'board'}],
  zone6:'search',
  zone7:[{type:'object',value:'MOON'},{type:'speak',value:'MOON'},{type:'rotate'},{type:'align'}],
  zone8:[{type:'speak',value:'COAT'},{type:'speak',value:'GLOVES'},{type:'speak',value:'BOOTS'},{type:'speak',value:'WARM'},{type:'heat',value:1},{type:'heat',value:1},{type:'depart'}],
  zone9:[{type:'speak',value:'READ'},{type:'speak',value:'THINK'},{type:'speak',value:'WRITE'},{type:'seal'}],
  zone10:[{type:'speak',value:'MUSIC'},{type:'note',value:'C'},{type:'note',value:'E'},{type:'note',value:'G'},{type:'note',value:'C'},{type:'play'}]
 };
 function solveQuest(R,id){
  const script=quests[id];
  if(Array.isArray(script)){let s=R.initial(id);for(const a of script)s=R.transition(id,s,a).state;return s;}
  let start=R.transition(id,R.initial(id),{type:'speak',value:'BOAT'}).state;
  const seen=new Set([JSON.stringify(start)]),queue=[start];
  while(queue.length){
   const s=queue.shift();
   const wind=R.transition(id,s,{type:'speak',value:'WIND'}).state;
   if(R.solved(id,wind))return wind;
   for(const value of ['north','east','south','west']){const n=R.transition(id,s,{type:'sail',value}).state,k=JSON.stringify(n);if(!seen.has(k)){seen.add(k);queue.push(n);}}
  }
  return start;
 }
 function stageCount(id){return chapters[id]?chapters[id].steps:quests[id]?1:0;}
 function stateAt(id,stage,mods=root){
  const max=stageCount(id);if(!max)return null;
  const n=stage==='max'?max:Math.max(0,Math.min(max,Number(stage)||0));
  if(chapters[id]){const C=mods[chapters[id].module];return C?chapters[id].build(C)(n):null;}
  const R=mods.RealmQuests;if(!R)return null;
  return n>=1?solveQuest(R,id):R.initial(id);
 }
 const api={chapters,quests,stageCount,stateAt};
 root.DevTools=api;if(typeof module!=='undefined')module.exports=api;
 if(!root.document)return;

 // ---------------- Browser panel ----------------
 const regionOrder=[
  ['林野與城鎮',['zone1','zone2','zone19','zone11','zone3','zone14','zone4','zone12','zone17','zone18','zone20','zone13','learningHub']],
  ['鐵道與遠洋',['zone5','zone15','zone6','zone16']],
  ['雲海與星穹',['zone7','zone21','zone8','zone9','zone10']]
 ];
 function world(){return root.world3D;}
 function applyStage(id,stage){
  const w=world(),s=stateAt(id,stage);if(!w||!s)return false;
  w.gameState.realmPuzzles||={};w.gameState.realmPuzzles[id]=s;return true;
 }
 function enter(id,stage){
  const w=world();if(!w?.zoneManager?.zones[id])return false;
  for(const req of (root.RealmQuests?.prerequisitesFor?.(id)||[])){
   if(stageCount(req)&&!w.gameState.realmPuzzles?.[req])applyStage(req,'max');
  }
  if(stage!==undefined&&stage!==null&&stage!=='')applyStage(id,stage);
  const ok=w.switchZone(id,{directAccess:true});
  if(ok&&id==='learningHub')setTimeout(()=>root.LearningHub?.open?.(),120);
  w.adventureProgress?.save(true);render();return ok;
 }
 function markWords(done){
  const w=world(),id=w.zoneManager.currentZoneId,zone=w.zoneManager.zones[id];if(!zone)return;
  w.gameState.practicedWordsByZone||={};w.gameState.practicedWordsByZone[id]=done?Array.from(zone.words||[]):[];
  enter(id);w.showToast(done?'[DEV] 本區單字已全部標記完成':'[DEV] 本區單字紀錄已清除');
 }
 let panel=null;
 function button(text,fn,cls=''){const b=root.document.createElement('button');b.type='button';b.textContent=text;if(cls)b.className=cls;b.onclick=fn;return b;}
 function render(){
  if(!panel)return;const w=world(),zm=w?.zoneManager;if(!zm)return;
  const cur=zm.currentZoneId,body=panel.querySelector('.dev-body');body.replaceChildren();
  const head=root.document.createElement('p');head.className='dev-current';head.textContent='目前：'+(zm.zones[cur]?.name||cur)+'（'+cur+'）';body.append(head);
  for(const [title,ids]of regionOrder){
   const h=root.document.createElement('h4');h.textContent=title;body.append(h);
   const row=root.document.createElement('div');row.className='dev-grid';
   for(const id of ids){if(!zm.zones[id])continue;const b=button(zm.zones[id].name,()=>enter(id),id===cur?'is-current':'');b.title=id;row.append(b);}
   body.append(row);
  }
  const max=stageCount(cur);
  if(max){
   const h=root.document.createElement('h4');h.textContent=max===1?'本區謎題':'本區章節進度（跳到第幾步）';body.append(h);
   const row=root.document.createElement('div');row.className='dev-grid dev-stages';
   const now=w.gameState.realmPuzzles?.[cur];
   const label=max===1?['未解','已解']:null;
   for(let n=0;n<=max;n++){const b=button(label?label[n]:String(n),()=>{enter(cur,n);w.showToast('[DEV] '+cur+' → '+(label?label[n]:'第 '+n+' 步'));});if(JSON.stringify(stateAt(cur,n))===JSON.stringify(now))b.className='is-current';row.append(b);}
   body.append(row);
  }
  const h=root.document.createElement('h4');h.textContent='本區單字';body.append(h);
  const row=root.document.createElement('div');row.className='dev-grid';
  row.append(button('全部標記完成',()=>markWords(true)),button('清除',()=>markWords(false)));body.append(row);
  const tip=root.document.createElement('p');tip.className='dev-tip';tip.textContent='按 ` 或 F2 開關。開發者存檔與學生紀錄分開，不會上傳雲端。網址可加 &zone=zone15&stage=5 直接進入。';body.append(tip);
 }
 function toggle(force){if(!panel)return;const show=force??panel.hidden;panel.hidden=!show;if(show)render();}
 function mount(){
  const css=root.document.createElement('style');
  css.textContent='#devToolsPanel{position:fixed;top:72px;left:12px;z-index:9999;width:340px;max-height:calc(100vh - 96px);overflow:auto;background:rgba(15,23,42,.95);color:#e2e8f0;border:1px solid #38bdf8;border-radius:12px;padding:10px 12px;font:13px/1.4 system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4)}#devToolsPanel header{display:flex;justify-content:space-between;align-items:center;font-weight:700;color:#38bdf8}#devToolsPanel h4{margin:10px 0 4px;font-size:12px;color:#fbbf24}#devToolsPanel .dev-grid{display:flex;flex-wrap:wrap;gap:4px}#devToolsPanel button{background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:4px 7px;font-size:12px;cursor:pointer}#devToolsPanel button:hover{border-color:#38bdf8}#devToolsPanel button.is-current{background:#0369a1;border-color:#38bdf8}#devToolsPanel .dev-stages button{min-width:30px}#devToolsPanel .dev-current{margin:6px 0 0;color:#94a3b8}#devToolsPanel .dev-tip{margin:10px 0 0;color:#64748b;font-size:11px}#devToolsPill{position:fixed;left:12px;bottom:12px;z-index:9999;background:#0369a1;color:#fff;border:0;border-radius:999px;padding:6px 12px;font:700 12px system-ui;cursor:pointer}';
  root.document.head.append(css);
  panel=root.document.createElement('section');panel.id='devToolsPanel';panel.hidden=true;
  panel.innerHTML='<header><span>🛠 DEV 關卡跳轉</span></header><div class="dev-body"></div>';
  panel.querySelector('header').append(button('✕',()=>toggle(false)));
  const pill=button('DEV',()=>toggle());pill.id='devToolsPill';
  root.document.body.append(panel,pill);
  root.addEventListener('keydown',e=>{if(e.key==='`'||e.key==='F2'){if(/input|textarea|select/i.test(e.target?.tagName||''))return;e.preventDefault();toggle();}});
 }
 root.addEventListener('load',()=>{
  const w=world();if(!w?.devMode)return;
  mount();
  const q=new URLSearchParams(root.location.search),zone=q.get('zone');
  if(zone){
   root.completeOnboardingAndEnterGame?.();
   let tries=0;const go=()=>{if(world()?.zoneManager?.zones[zone]){enter(zone,q.get('stage'));}else if(++tries<60)setTimeout(go,100);};
   setTimeout(go,150);
  }
  const _switch=w.switchZone.bind(w);w.switchZone=(...a)=>{const r=_switch(...a);if(!panel.hidden)setTimeout(render,0);return r;};
 });
})(typeof window!=='undefined'?window:globalThis);
