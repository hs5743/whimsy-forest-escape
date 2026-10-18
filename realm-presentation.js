/* Regional tabbed overworld atlas with uncrowded mainline/branch layouts and a keyboard-friendly details panel. */
(function(root){
  'use strict';
  const allPositions={
    zone1:[14,76],zone2:[32,76],zone3:[50,76],zone4:[68,76],zone5:[86,76],
    zone6:[78,44],zone7:[74,16],zone8:[54,16],zone9:[34,16],zone10:[14,16],
    learningHub:[14,44],zone11:[30,44],zone14:[46,44],zone15:[62,44],zone12:[90,44],zone13:[90,16]
  };
  const allCompact={
    zone1:[20,90],learningHub:[50,90],zone2:[80,90],
    zone11:[20,76],zone3:[50,76],zone14:[80,76],
    zone4:[20,62],zone12:[50,62],zone13:[80,62],
    zone5:[20,46],zone15:[50,46],zone6:[80,46],
    zone7:[20,30],zone8:[50,30],zone9:[80,30],zone10:[50,14]
  };
  const regions=[
    {
      id:'forest',
      name:'林野與城鎮',
      subtitle:'Zone 1–4 主線與四大生活支線',
      zones:['zone1','learningHub','zone2','zone11','zone3','zone14','zone4','zone12','zone13'],
      positions:{
        zone1:[14,68],learningHub:[14,24],
        zone2:[38,68],zone11:[38,24],
        zone3:[62,68],zone14:[62,24],
        zone4:[86,68],zone12:[86,40],zone13:[86,14]
      },
      compact:{
        zone1:[22,86],learningHub:[76,86],
        zone2:[22,68],zone11:[76,68],
        zone3:[22,50],zone14:[76,50],
        zone4:[22,32],zone12:[76,32],zone13:[76,14]
      }
    },
    {
      id:'coast',
      name:'鐵道與遠洋',
      subtitle:'Zone 5–6 鐵道海港與國際機場支線',
      zones:['zone5','zone15','zone6'],
      positions:{zone5:[28,68],zone15:[28,24],zone6:[74,52]},
      compact:{zone5:[28,76],zone15:[74,48],zone6:[28,24]}
    },
    {
      id:'sky',
      name:'雲海與星穹',
      subtitle:'Zone 7–10 蒼穹觀測、極光、神殿與空島',
      zones:['zone7','zone8','zone9','zone10'],
      positions:{zone7:[16,66],zone8:[40,34],zone9:[64,62],zone10:[86,26]},
      compact:{zone7:[26,82],zone8:[74,62],zone9:[26,42],zone10:[74,20]}
    },
    {
      id:'all',
      name:'全境總覽',
      subtitle:'16 座奇幻秘境與生活章節全圖',
      zones:null,
      positions:allPositions,
      compact:allCompact
    }
  ];
  const symbols={
    zone1:'<path d="M5 20V9l7-5 7 5v11M8 20v-5h8v5M4 9h16M10 8v3m4-3v3"/>',
    zone2:'<path d="M4 9h16l-2-5H6L4 9Zm1 0v11h14V9M9 20v-7h6v7M4 9q2 4 4 0 2 4 4 0 2 4 4 0 2 4 4 0"/>',
    zone3:'<path d="m12 3-7 9h4l-5 6h7v3h2v-3h7l-5-6h4L12 3Z"/>',
    zone4:'<circle cx="12" cy="12" r="9"/><path d="m12 7 5 4-2 6H9l-2-6 5-4ZM12 7V3m5 8 4-2m-6 8 2 3m-8-3-2 3m0-9L3 9"/>',
    zone5:'<path d="M7 17v4m10-4v4M7 5h10v13H7V5ZM8 18l-3 3m11-3 3 3M9 9h6m-7 5h1m6 0h1M12 2v3"/>',
    zone6:'<path d="M5 14h14l-2 5H7l-2-5ZM12 3v11M12 4l6 8h-6M4 21q2-2 4 0 2-2 4 0 2-2 4 0 2-2 4 0"/>',
    zone7:'<path d="m3 11 12-7 3 5-12 7-3-5Zm4 5 5-3m0 0v8m0-8 6 8m-6-8-5 8M17 3l3-1 2 4-3 2"/>',
    zone8:'<path d="M12 2v20M3 7l18 10M3 17 21 7M8 4l4 3 4-3M8 20l4-3 4 3M3 11l4-1V6m14 5-4-1V6M3 13l4 1v4m14-5-4 1v4"/>',
    zone9:'<path d="m3 8 9-5 9 5H3Zm2 3v8m5-8v8m4-8v8m5-8v8M3 21h18M2 9h20"/>',
    zone10:'<path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.3-4.2 6-.9L12 3Z"/>',
    zone11:'<path d="M4 10h16l-2 9H6L4 10Zm3-5v3m5-4v4m5-3v3"/>',
    zone12:'<path d="m3 10 9-7 9 7H3Zm2 0v11h14V10M10 21v-6h4v6M7 12h2m6 0h2M7 2h4"/>',
    zone13:'<path d="M3 8h16v9H3V8Zm3 3v3m3-3v3m3-3v3m3-3v3m3-3v3M19 12h3"/>',
    learningHub:'<path d="M3 5h7l2 3 2-3h7v15h-7l-2 2-2-2H3V5Zm9 3v14M6 9h3m-3 4h3m6-4h3m-3 4h3"/>',
    zone14:'<path d="M3 21V8l9-6 9 6v13H3ZM12 2v19M3 8h18M7 21v-6m10 6v-6M8 12h8"/>',
    zone15:'<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z"/>'
  };
  const lockLabel=zone=>zone.parentZone==='zone5'?'完成車站驗票任務解鎖':zone.parentZone==='zone3'?'完成花園照護任務解鎖':zone.parentZone==='zone12'?'完成新港迎賓任務解鎖':zone.parentZone==='zone4'?'完成操場任務解鎖':'完成市集採買解鎖';
  const branchBadge=zone=>zone.parentZone==='zone5'?'機場支線':zone.parentZone==='zone3'?'溫室支線':zone.parentZone==='zone12'?'音樂支線':zone.parentZone==='zone4'?'校園支線':'餐廳支線';
  function regionForZone(zoneId){
    for(const r of regions)if(r.zones&&r.zones.includes(zoneId))return r.id;
    return 'all';
  }
  function model(zm,profile) {
    const completed=new Set((profile?.completedWords || []).map(w=>String(w).toUpperCase()));
    return Object.values(zm.zones).map((zone,i)=>({
      ...zone,
      region:regionForZone(zone.id),
      position:allPositions[zone.id] || [14+(i%5)*18, 20+Math.floor(i/5)*26],
      compactPosition:allCompact[zone.id] || [22+(i%3)*28, 88-Math.floor(i/3)*16],
      current:zone.id===zm.currentZoneId,
      unlocked:zm.isZoneUnlocked(zone.id),
      done:zone.words.filter(w=>completed.has(w.toUpperCase())).length,
      total:zone.words.length
    }));
  }
  function render(container,zm,profile,travel,options={}) {
    const zones=model(zm,profile),current=zones.find(z=>z.current)||zones[0];
    if(!current) return;
    let activeRegionId=options.region||(zones.length<=4?'all':regionForZone(current.id));
    container.className='realm-atlas';container.replaceChildren();
    const summary=document.createElement('div');summary.className='atlas-summary';
    const currentLabel=document.createElement('span');currentLabel.textContent='目前位置 · '+current.name;summary.append(currentLabel);
    const mainline=zones.filter(z=>!z.parentZone&&!z.isLearningHub);
    const next=current.isLearningHub?null:current.parentZone?zones.find(z=>z.id===current.parentZone):mainline[mainline.indexOf(current)+1];
    if(next) {
      const button=document.createElement('button');button.type='button';button.className='atlas-next';button.textContent='下一站 · '+next.name;
      button.onclick=()=>{
        const targetRegion=regionForZone(next.id);
        if(activeRegionId!=='all'&&activeRegionId!==targetRegion){activeRegionId=targetRegion;paintRegion(next,true);}
        else select(next,true);
      };
      summary.append(button);
    }
    container.append(summary);

    // Region filter tabs keep each map view spacious and easy to read.
    const tabBar=document.createElement('div');tabBar.className='atlas-region-tabs';tabBar.setAttribute('role','tablist');tabBar.setAttribute('aria-label','大陸分區切換');
    const tabButtons=new Map();
    regions.forEach(reg=>{
      const regZones=reg.zones?zones.filter(z=>reg.zones.includes(z.id)):zones;
      if(!regZones.length)return;
      const doneCount=regZones.reduce((acc,z)=>acc+z.done,0),totalCount=regZones.reduce((acc,z)=>acc+z.total,0);
      const btn=document.createElement('button');btn.type='button';btn.className='atlas-region-tab';btn.setAttribute('role','tab');
      btn.dataset.region=reg.id;
      const hasCurrent=regZones.some(z=>z.current);
      btn.textContent=reg.name+(hasCurrent?' 📍':'')+' ('+doneCount+'/'+totalCount+')';
      btn.onclick=()=>{activeRegionId=reg.id;const pick=regZones.find(z=>z.current)||regZones[0];paintRegion(pick,false);};
      tabButtons.set(reg.id,btn);tabBar.append(btn);
    });
    if(zones.length>4)container.append(tabBar);

    const map=document.createElement('div');map.className='atlas-land';map.setAttribute('aria-label','秘境與章節探索路線');
    container.append(map);
    const detail=document.createElement('section');detail.className='atlas-detail';detail.setAttribute('aria-label','選取區域詳情');container.append(detail);
    let buttons=new Map();

    function select(zone,reveal=false) {
      for(const [id,button] of buttons) button.setAttribute('aria-pressed',String(id===zone.id));
      detail.replaceChildren();
      const content=document.createElement('div');content.className='atlas-detail-copy';
      const title=document.createElement('h3');title.textContent=zone.name+' · '+zone.englishName;content.append(title);
      const desc=document.createElement('p');desc.textContent=zone.desc;content.append(desc);
      const progress=document.createElement('span');progress.className='atlas-progress';progress.textContent=zone.isLearningHub?'隨時選題 · 反覆練習 · 收藏與跨日複習':'單字收集 '+zone.done+' / '+zone.total+' · '+zone.topic+(zone.words.length?' ('+zone.words.join(', ')+')':'');content.append(progress);
      detail.append(content);
      const action=document.createElement('button');action.type='button';action.className='atlas-travel';action.disabled=zone.current||!zone.unlocked;
      action.textContent=zone.current?'正在此處冒險':zone.unlocked?'傳送前往':zone.parentZone?lockLabel(zone):'Lv.'+zone.reqLevel+' 解鎖';
      action.onclick=()=>{if(zm.isZoneUnlocked(zone.id)) travel(zone.id);};detail.append(action);
      if(reveal) detail.scrollIntoView({block:'nearest',behavior:'auto'});
    }

    function paintRegion(selectedZone,reveal=false){
      const reg=regions.find(r=>r.id===activeRegionId)||regions[3];
      for(const [id,btn] of tabButtons){
        const active=id===reg.id;
        btn.classList.toggle('is-active',active);
        btn.setAttribute('aria-selected',String(active));
      }
      const visibleZones=reg.zones?zones.filter(z=>reg.zones.includes(z.id)):zones;
      const visibleSet=new Set(visibleZones.map(z=>z.id));
      const posOf=z=>reg.positions[z.id]||z.position;
      const compactOf=z=>reg.compact[z.id]||z.compactPosition;
      const regMainline=mainline.filter(z=>visibleSet.has(z.id));
      const regBranches=visibleZones.filter(z=>z.parentZone&&visibleSet.has(z.parentZone));
      const regHubs=visibleZones.filter(z=>z.isLearningHub&&visibleSet.has('zone1'));

      const path=regMainline.map((z,i)=>(i?'L':'M')+' '+posOf(z)[0]*10+' '+posOf(z)[1]*6).join(' ')
        +regBranches.map(z=>{const p=posOf(zones.find(x=>x.id===z.parentZone)),q=posOf(z);return ' M '+p[0]*10+' '+p[1]*6+' L '+q[0]*10+' '+q[1]*6;}).join('')
        +regHubs.map(z=>{const p=posOf(zones.find(x=>x.id==='zone1')),q=posOf(z);return ' M '+p[0]*10+' '+p[1]*6+' L '+q[0]*10+' '+q[1]*6;}).join('');
      const compactPath=regMainline.map((z,i)=>(i?'L':'M')+' '+compactOf(z)[0]*10+' '+compactOf(z)[1]*6).join(' ')
        +regBranches.map(z=>{const p=compactOf(zones.find(x=>x.id===z.parentZone)),q=compactOf(z);return ' M '+p[0]*10+' '+p[1]*6+' L '+q[0]*10+' '+q[1]*6;}).join('');

      map.className='atlas-land'+(reg.id!=='all'?' is-regional-view':'');
      map.innerHTML='<svg class="atlas-landscape" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="atlasSea" x2="0" y2="1"><stop stop-color="#172d43"/><stop offset="1" stop-color="#2e5960"/></linearGradient></defs><rect width="1000" height="600" rx="30" fill="url(#atlasSea)"/><path d="M40 470Q20 290 130 210Q230 170 360 215Q520 205 580 350Q530 520 350 545Q170 565 40 470Z" fill="#5d7660"/><path d="M430 450Q520 300 680 310Q820 325 855 465Q790 550 615 545Z" fill="#7b8f70"/><path d="M185 150Q200 10 385 15Q545-5 640 85Q760 90 840 185Q840 245 755 256Q620 215 505 245Q320 250 185 150Z" fill="#a4bec6" opacity=".24"/><g fill="none" stroke="#bad4d0" stroke-opacity=".2" stroke-width="2"><path d="M20 580Q120 545 205 580T410 580M610 285Q720 260 845 290T1000 285M840 570Q920 540 1000 570"/></g><path class="atlas-desktop-trail" d="'+path+'" fill="none" stroke="#101e2b" stroke-opacity=".45" stroke-width="12"/><path class="atlas-desktop-trail" d="'+path+'" fill="none" stroke="#e6cb8f" stroke-width="4" stroke-dasharray="8 8"/><path class="atlas-compact-trail" d="'+compactPath+'" fill="none" stroke="#e6cb8f" stroke-width="4" stroke-dasharray="8 8"/><text x="500" y="575" fill="#d4e0c8" font-size="20" text-anchor="middle">'+reg.name+' · '+reg.subtitle+'</text></svg>';

      buttons=new Map();
      visibleZones.forEach(zone=>{
        const p=posOf(zone),cp=compactOf(zone);
        const button=document.createElement('button');button.type='button';
        button.className='atlas-node'+(zone.isLearningHub?' is-learning-hub':zone.parentZone?' is-branch':' is-mainline')+(zone.current?' is-current':'')+(!zone.unlocked?' is-locked':'');
        button.style.setProperty('--atlas-x',p[0]+'%');button.style.setProperty('--atlas-y',p[1]+'%');button.style.setProperty('--compact-x',cp[0]+'%');button.style.setProperty('--compact-y',cp[1]+'%');button.setAttribute('aria-pressed','false');
        button.setAttribute('aria-label',zone.name+'，'+(zone.current?'目前位置，':zone.unlocked?'已解鎖，':zone.parentZone?lockLabel(zone)+'，':'等級 '+zone.reqLevel+' 解鎖，')+(zone.isLearningHub?'自由選題學習':'單字 '+zone.done+' / '+zone.total));
        button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'+(symbols[zone.id]||'<path d="M4 10h16l-2 9H6L4 10Zm3-5v3m5-4v4m5-3v3"/>')+'</svg>';
        const name=document.createElement('span');name.textContent=zone.name;button.append(name);
        const badge=document.createElement('small');badge.textContent=zone.current?'目前位置':zone.unlocked?zone.isLearningHub?'自由學習':(zone.parentZone?branchBadge(zone)+' · ':'')+zone.done+'/'+zone.total:zone.parentZone?branchBadge(zone):'Lv.'+zone.reqLevel;button.append(badge);
        button.onclick=()=>select(zone,true);buttons.set(zone.id,button);map.append(button);
      });
      select(selectedZone||visibleZones[0],reveal);
    }

    paintRegion(current,false);
  }
  root.RealmPresentation={regions,regionForZone,model,render};if(typeof module!=='undefined') module.exports=root.RealmPresentation;
})(typeof window!=='undefined'?window:globalThis);
