/* Compact geographic route with a keyboard-friendly details panel. */
(function(root){
  'use strict';
  const positions=[[14,80],[32,73],[21,52],[41,43],[54,62],[75,77],[84,51],[76,26],[53,20],[32,15]];
  const compactPositions=[[22,89],[74,89],[74,70],[22,70],[22,51],[74,51],[74,32],[22,32],[22,13],[74,13]];
  const symbols=[
    '<path d="M5 20V9l7-5 7 5v11M8 20v-5h8v5M4 9h16M10 8v3m4-3v3"/>',
    '<path d="M4 9h16l-2-5H6L4 9Zm1 0v11h14V9M9 20v-7h6v7M4 9q2 4 4 0 2 4 4 0 2 4 4 0 2 4 4 0"/>',
    '<path d="m12 3-7 9h4l-5 6h7v3h2v-3h7l-5-6h4L12 3Z"/>',
    '<circle cx="12" cy="12" r="9"/><path d="m12 7 5 4-2 6H9l-2-6 5-4ZM12 7V3m5 8 4-2m-6 8 2 3m-8-3-2 3m0-9L3 9"/>',
    '<path d="M7 17v4m10-4v4M7 5h10v13H7V5ZM8 18l-3 3m11-3 3 3M9 9h6m-7 5h1m6 0h1M12 2v3"/>',
    '<path d="M5 14h14l-2 5H7l-2-5ZM12 3v11M12 4l6 8h-6M4 21q2-2 4 0 2-2 4 0 2-2 4 0 2-2 4 0"/>',
    '<path d="m3 11 12-7 3 5-12 7-3-5Zm4 5 5-3m0 0v8m0-8 6 8m-6-8-5 8M17 3l3-1 2 4-3 2"/>',
    '<path d="M12 2v20M3 7l18 10M3 17 21 7M8 4l4 3 4-3M8 20l4-3 4 3M3 11l4-1V6m14 5-4-1V6M3 13l4 1v4m14-5-4 1v4"/>',
    '<path d="m3 8 9-5 9 5H3Zm2 3v8m5-8v8m4-8v8m5-8v8M3 21h18M2 9h20"/>',
    '<path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.3-4.2 6-.9L12 3Z"/>'
  ];
  function model(zm,profile) {
    const completed=new Set((profile?.completedWords || []).map(w=>String(w).toUpperCase()));
    return Object.values(zm.zones).map((zone,i)=>({...zone,position:positions[i] || [50,50],current:zone.id===zm.currentZoneId,unlocked:zm.isZoneUnlocked(zone.id),done:zone.words.filter(w=>completed.has(w.toUpperCase())).length,total:zone.words.length}));
  }
  function render(container,zm,profile,travel) {
    const zones=model(zm,profile),current=zones.find(z=>z.current)||zones[0];
    if(!current) return;
    container.className='realm-atlas';container.replaceChildren();
    const summary=document.createElement('div');summary.className='atlas-summary';
    const currentLabel=document.createElement('span');currentLabel.textContent='目前位置 · '+current.name;summary.append(currentLabel);
    const next=zones[zones.indexOf(current)+1];
    if(next) {const button=document.createElement('button');button.type='button';button.className='atlas-next';button.textContent='下一站 · '+next.name;button.onclick=()=>select(next,true);summary.append(button);}
    container.append(summary);
    const map=document.createElement('div');map.className='atlas-land';map.setAttribute('aria-label','十界探索路線');
    const compactPath=compactPositions.map((p,i)=>(i?'L':'M')+' '+p[0]*10+' '+p[1]*6).join(' ');
    const path=zones.map((z,i)=>(i?'L':'M')+' '+z.position[0]*10+' '+z.position[1]*6).join(' ');
    map.innerHTML='<svg class="atlas-landscape" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="atlasSea" x2="0" y2="1"><stop stop-color="#172d43"/><stop offset="1" stop-color="#2e5960"/></linearGradient></defs><rect width="1000" height="600" rx="30" fill="url(#atlasSea)"/><path d="M40 470Q20 290 130 210Q230 170 360 215Q520 205 580 350Q530 520 350 545Q170 565 40 470Z" fill="#5d7660"/><path d="M430 450Q520 300 680 310Q820 325 855 465Q790 550 615 545Z" fill="#7b8f70"/><path d="M185 150Q200 10 385 15Q545-5 640 85Q760 90 840 185Q840 245 755 256Q620 215 505 245Q320 250 185 150Z" fill="#a4bec6" opacity=".24"/><g fill="none" stroke="#bad4d0" stroke-opacity=".2" stroke-width="2"><path d="M20 580Q120 545 205 580T410 580M610 285Q720 260 845 290T1000 285M840 570Q920 540 1000 570"/></g><g fill="#304f45" opacity=".65"><path d="m80 390 30-80 30 80Zm130-70 30-80 30 80Zm115 35 30-80 30 80Z"/></g><g fill="#7e96a8" opacity=".5"><path d="m650 140 50-100 60 100Zm65 35 65-110 70 110Z"/></g><path class="atlas-desktop-trail" d="'+path+'" fill="none" stroke="#101e2b" stroke-opacity=".4" stroke-width="12"/><path class="atlas-desktop-trail" d="'+path+'" fill="none" stroke="#e6cb8f" stroke-width="4" stroke-dasharray="8 8"/><path class="atlas-compact-trail" d="'+compactPath+'" fill="none" stroke="#e6cb8f" stroke-width="4" stroke-dasharray="8 8"/><text x="350" y="565" fill="#d4e0c8" font-size="22" text-anchor="middle">林野與城鎮</text><text x="670" y="580" fill="#d4e0c8" font-size="22" text-anchor="middle">海岸與遠洋</text><text x="360" y="40" fill="#d4e0e8" font-size="20" text-anchor="middle">雲海與星穹</text></svg>';
    const buttons=new Map();
    zones.forEach((zone,i)=>{
      const button=document.createElement('button');button.type='button';button.className='atlas-node'+(zone.current?' is-current':'')+(!zone.unlocked?' is-locked':'');
      button.style.setProperty('--atlas-x',zone.position[0]+'%');button.style.setProperty('--atlas-y',zone.position[1]+'%');button.style.setProperty('--compact-x',compactPositions[i][0]+'%');button.style.setProperty('--compact-y',compactPositions[i][1]+'%');button.setAttribute('aria-pressed','false');
      button.setAttribute('aria-label',zone.name+'，'+(zone.current?'目前位置，':zone.unlocked?'已解鎖，':'等級 '+zone.reqLevel+' 解鎖，')+'單字 '+zone.done+' / '+zone.total);
      button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'+symbols[i]+'</svg>';
      const name=document.createElement('span');name.textContent=zone.name;button.append(name);
      const badge=document.createElement('small');badge.textContent=zone.current?'目前位置':zone.unlocked?zone.done+'/'+zone.total:'Lv.'+zone.reqLevel;button.append(badge);
      button.onclick=()=>select(zone,true);buttons.set(zone.id,button);map.append(button);
    });
    container.append(map);
    const detail=document.createElement('section');detail.className='atlas-detail';detail.setAttribute('aria-label','選取區域詳情');container.append(detail);
    function select(zone,reveal=false) {
      for(const [id,button] of buttons) button.setAttribute('aria-pressed',String(id===zone.id));
      detail.replaceChildren();
      const content=document.createElement('div');content.className='atlas-detail-copy';
      const title=document.createElement('h3');title.textContent=zone.name+' · '+zone.englishName;content.append(title);
      const desc=document.createElement('p');desc.textContent=zone.desc;content.append(desc);
      const progress=document.createElement('span');progress.className='atlas-progress';progress.textContent='單字收集 '+zone.done+' / '+zone.total+' · '+zone.topic;content.append(progress);
      detail.append(content);
      const action=document.createElement('button');action.type='button';action.className='atlas-travel';action.disabled=zone.current||!zone.unlocked;
      action.textContent=zone.current?'正在此處冒險':zone.unlocked?'傳送前往':'Lv.'+zone.reqLevel+' 解鎖';
      action.onclick=()=>{if(zm.isZoneUnlocked(zone.id)) travel(zone.id);};detail.append(action);
      if(reveal) detail.scrollIntoView({block:'nearest',behavior:'auto'});
    }
    select(current);
  }
  root.RealmPresentation={model,render};if(typeof module!=='undefined') module.exports=root.RealmPresentation;
})(typeof window!=='undefined'?window:globalThis);
