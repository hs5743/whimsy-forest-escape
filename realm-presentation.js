/* Compact geographic route with a keyboard-friendly details panel. */
(function(root){
  'use strict';
  const positions=[[14,80],[32,73],[21,52],[41,43],[54,62],[75,77],[84,51],[76,26],[53,20],[32,15],[53,87],[7,32],[7,12],[52,43],[9,65],[92,57],[90,35],[5,20],[18,20],[38,91],[18,43]];
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
  symbols.push('<path d="M4 10h16l-2 9H6L4 10Zm3-5v3m5-4v4m5-3v3"/>','<path d="m3 10 9-7 9 7H3Zm2 0v11h14V10M10 21v-6h4v6M7 12h2m6 0h2M7 2h4"/>');
  symbols.push('<path d="M3 8h16v9H3V8Zm3 3v3m3-3v3m3-3v3m3-3v3m3-3v3M19 12h3"/>');
  symbols.push('<path d="M3 5h7l2 3 2-3h7v15h-7l-2 2-2-2H3V5Zm9 3v14M6 9h3m-3 4h3m6-4h3m-3 4h3"/>');
  symbols.push('<path d="M3 21V8l9-6 9 6v13H3ZM12 2v19M3 8h18M7 21v-6m10 6v-6M8 12h8"/>');
  symbols.push('<path d="M3 17h18M5 14h14l-2-4H7l-2 4Zm3 0v4m8-4v4m-7-9 2-3 2 3m2-5v3m-7-2-2-2m11 0 2-2"/>','<path d="M4 17c3-7 5-7 8 0s5 7 8 0M3 20h18M7 8l5-5 5 5M12 3v7"/>');
  symbols.push('<path d="M4 20V9l8-6 8 6v11M3 9h18M8 20v-5h8v5M12 3V1m-5 4-2-2m12 2 2-2"/>');
  const lockLabel=zone=>zone.parentZone==='zone5'?'完成車站驗票任務解鎖':zone.parentZone==='zone3'?'完成花園照護任務解鎖':zone.parentZone==='zone12'?'完成新港迎賓任務解鎖':zone.parentZone==='zone4'?'完成操場任務解鎖':zone.parentZone==='zone7'?'完成雲頂觀測任務解鎖':zone.parentZone==='zone21'?'完成氣象觀測任務解鎖':'完成市集採買解鎖';
  function model(zm,profile) {
    const completed=new Set((profile?.completedWords || []).map(w=>String(w).toUpperCase()));
    return Object.values(zm.zones).map((zone,i)=>({...zone,position:positions[i] || [50,50],current:zone.id===zm.currentZoneId,unlocked:zm.isZoneUnlocked(zone.id),done:zone.words.filter(w=>completed.has(w.toUpperCase())).length,total:zone.words.length}));
  }
  const regions=[
    {id:'town',name:'城鎮慶典',caption:'採買・料理・數字',ids:['zone1','zone2','zone11','zone19'],color:'#527b70'},
    {id:'nature',name:'森林海岸',caption:'花園・航海・自然觀測',ids:['zone3','zone14','zone6','zone21','zone16'],color:'#537a5e'},
    {id:'school',name:'新港校園',caption:'運動・閱讀・音樂・創作',ids:['zone4','zone12','zone13','zone17','zone18','zone20'],color:'#957354'},
    {id:'sky',name:'雲海星穹',caption:'鐵道・星空・冰雪・虹光',ids:['zone5','zone15','zone7','zone8','zone9','zone10'],color:'#657a9c'},
    {id:'lounge',name:'學習大廳',caption:'自由選題・反覆練習',ids:['learningHub'],color:'#846d98'}
  ];
  const names={zone15:'星光機場',zone1:'魔法書齋',zone2:'陽光市集',zone3:'守護獸花園',zone4:'冒險操場',zone5:'鐘樓車站',zone6:'蔚藍海港',zone7:'星空觀測站',zone8:'極光冰雪',zone9:'星界殿堂',zone10:'虹光空島',zone11:'魔法餐廳',zone12:'新港迎賓',zone13:'口琴展館',zone14:'玻璃溫室',zone21:'氣象觀測台',zone16:'香山潮間帶',zone17:'故事圖書館',zone18:'機器人工坊',zone19:'數字嘉年華',zone20:'舞獅彩繪',learningHub:'學習大廳'};
  function regionFor(zone,zones,seen=new Set()) {
    const known=regions.find(r=>r.ids.includes(zone.id));if(known)return known;
    if(zone.parentZone&&!seen.has(zone.id)){seen.add(zone.id);const parent=zones.find(z=>z.id===zone.parentZone);if(parent)return regionFor(parent,zones,seen);}
    return regions[0];
  }
  function layout(count,compact=false){const cols=compact?2:3,rows=Math.ceil(count/cols);return Array.from({length:count},(_,i)=>[count===1?50:(i%cols+.5)*100/cols,(Math.floor(i/cols)+.5)*100/rows]);}
  function render(container,zm,profile,travel) {
    const zones=model(zm,profile),current=zones.find(z=>z.current)||zones[0];if(!current)return;
    container.className='realm-atlas atlas-regional';container.replaceChildren();
    let selected=current;
    function el(tag,cls,text){const node=document.createElement(tag);node.className=cls;if(text!==undefined)node.textContent=text;return node;}
    function button(cls,text,action){const node=el('button',cls,text);node.type='button';node.onclick=action;return node;}
    const nav=el('nav','atlas-regions');nav.setAttribute('aria-label','地圖分區');container.append(nav);
    const summary=el('div','atlas-summary');container.append(summary);
    const map=el('div','atlas-land');map.setAttribute('aria-label','分區探索地圖');container.append(map);
    const legend=el('p','atlas-legend','金框：目前位置　虛線：尚未解鎖　數字：已學單字');container.append(legend);
    const detail=el('section','atlas-detail');detail.setAttribute('aria-label','選取區域詳情');container.append(detail);
    const buttons=new Map(),tabs=new Map();
    tabs.set('all',button('atlas-region-tab','全域總覽',()=>draw(null)));nav.append(tabs.get('all'));
    for(const r of regions){const tab=button('atlas-region-tab',r.name,()=>draw(r));tabs.set(r.id,tab);nav.append(tab);}
    function short(zone){return names[zone.id]||zone.name.split('：')[0];}
    function select(zone){
      selected=zone;for(const [id,node] of buttons)node.setAttribute('aria-pressed',String(id===zone.id));
      detail.replaceChildren();const copy=el('div','atlas-detail-copy');copy.append(el('h3','',zone.name));copy.append(el('p','',zone.desc));
      copy.append(el('span','atlas-progress',zone.isLearningHub?'自由選題・口說・句型・收藏':'已學單字 '+zone.done+' / '+zone.total+' · '+zone.topic));
      if(zone.parentZone){const parent=zones.find(z=>z.id===zone.parentZone);if(parent)copy.append(button('atlas-parent','入口：'+short(parent)+' →',()=>{draw(regionFor(parent,zones),parent);buttons.get(parent.id)?.focus?.();}));}
      if(!zone.parentZone&&!zone.isLearningHub){const main=zones.filter(z=>!z.parentZone&&!z.isLearningHub),i=main.findIndex(z=>z.id===zone.id);for(const [label,dest] of [['前站',main[i-1]],['下一站',main[i+1]]])if(dest)copy.append(button('atlas-parent',label+'：'+short(dest)+' →',()=>{draw(regionFor(dest,zones),dest);buttons.get(dest.id)?.focus?.();}));}
      detail.append(copy);const action=button('atlas-travel',zone.current?'目前位置':zone.unlocked?'傳送前往':zone.parentZone?lockLabel(zone):'Lv.'+zone.reqLevel+' 解鎖',()=>{if(zm.isZoneUnlocked(zone.id))travel(zone.id);});action.disabled=zone.current||!zone.unlocked;detail.append(action);
    }
    function draw(region,focusZone){
      buttons.clear();summary.replaceChildren();map.replaceChildren();
      for(const [id,node] of tabs)node.setAttribute('aria-pressed',String(id===(region?.id||'all')));
      summary.append(el('span','',region?region.name+' · 選擇地標查看任務':'探索世界 · '+zones.length+' 個地點'));
      summary.append(button('atlas-next','定位：'+short(current),()=>{draw(regionFor(current,zones),current);buttons.get(current.id)?.focus?.();}));
      legend.textContent=region?'金框：目前位置　虛線：尚未解鎖　數字：已學單字':'金框：所在區域　數字：已開放地點 / 全區地點';
      const visible=region?[
        ...region.ids.map(id=>zones.find(z=>z.id===id)).filter(Boolean),
        ...zones.filter(z=>regionFor(z,zones).id===region.id&&!region.ids.includes(z.id))
      ]:regions;
      const points=layout(visible.length),small=layout(visible.length,true);
      map.style.setProperty('--atlas-rows',Math.ceil(visible.length/3));map.style.setProperty('--atlas-mobile-rows',Math.ceil(visible.length/2));
      const links=[];if(region){const main=zones.filter(z=>!z.parentZone&&!z.isLearningHub);for(const z of visible){const parent=z.parentZone||main[main.indexOf(z)-1]?.id;if(parent&&visible.some(v=>v.id===parent))links.push([visible.findIndex(v=>v.id===parent),visible.indexOf(z)]);}}
      const path=pts=>links.map(([a,b])=>'M '+pts[a][0]*10+' '+pts[a][1]*6+' L '+pts[b][0]*10+' '+pts[b][1]*6).join(' ');
      map.innerHTML='<svg class="atlas-landscape" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><rect width="1000" height="600" rx="24" fill="#193b48"/><path d="M35 480Q-20 250 200 135T600 115Q960 40 960 350T600 540Q350 630 35 480" fill="'+(region?.color||'#587768')+'" opacity=".6"/><g fill="none" stroke="#c1d9cc" opacity=".12" stroke-width="2"><path d="M60 410Q150 150 400 140T920 220M70 440Q150 180 400 170T930 250M80 470Q150 210 400 200T940 280M90 500Q150 240 400 230T950 310"/></g><path class="atlas-desktop-trail" d="'+path(points)+'" fill="none" stroke="#e5c788" stroke-width="3" stroke-dasharray="7 9"/><path class="atlas-compact-trail" d="'+path(small)+'" fill="none" stroke="#e5c788" stroke-width="3" stroke-dasharray="7 9"/></svg>';
      visible.forEach((item,i)=>{
        const node=button('atlas-node'+(!region?' atlas-region-node':'')+(item.current?' is-current':'')+(region&&!item.unlocked?' is-locked':''),'',()=>region?select(item):draw(item));
        for(const [key,value] of [['--atlas-x',points[i][0]],['--atlas-y',points[i][1]],['--compact-x',small[i][0]],['--compact-y',small[i][1]]])node.style.setProperty(key,value+'%');
        const iconIndex=region?zones.indexOf(item):[1,2,11,6,13][i];
        const custom={zone15:'<path d="m3 14 8-5V3h2v6l8 5v2l-8-2v5l3 2H8l3-2v-5l-8 2Z"/>',zone17:'<path d="M3 5h7l2 3 2-3h7v15h-7l-2 2-2-2H3V5Zm9 3v14"/>',zone18:'<rect x="4" y="6" width="16" height="14" rx="3"/><path d="M12 2v4M8 11h1m6 0h1M8 16h8"/>',zone19:'<path d="m3 10 9-8 9 8H3Zm2 0v12m14-12v12M2 22h20M10 22v-7h4v7"/>',zone20:'<path d="m4 20 12-16 4 3L8 22H3v-5M14 7l4 3M3 5h7"/>'};
        node.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+(custom[item.id]||symbols[iconIndex]||symbols[0])+'</svg>';
        node.append(el('span','',region?short(item):item.name));
        const members=region?[]:zones.filter(z=>regionFor(z,zones).id===item.id);
        const state=region?(item.current?'目前位置':item.unlocked?(item.isLearningHub?'自由學習':item.done+'/'+item.total):'未解鎖'):members.filter(z=>z.unlocked).length+'/'+members.length+' 已開放';
        node.append(el('small','',state));node.setAttribute('aria-label',(region?item.name:item.name+'分區')+'，'+state);node.setAttribute('aria-pressed','false');
        if(!region&&members.some(z=>z.current))node.className+=' is-current';buttons.set(item.id,node);map.append(node);
      });
      if(region)select(focusZone||visible.find(z=>z.id===selected.id)||visible.find(z=>z.current)||visible[0]);
      else {detail.replaceChildren();const copy=el('div','atlas-detail-copy');copy.append(el('h3','','先選一個區域，再選關卡'));copy.append(el('p','','每個地標只顯示短名稱與學習進度。選取後可查看完整任務、入口與傳送條件。'));detail.append(copy);}
    }
    draw(null);
  }
  root.RealmPresentation={model,render,regions,regionFor,layout};if(typeof module!=='undefined') module.exports=root.RealmPresentation;
})(typeof window!=='undefined'?window:globalThis);

