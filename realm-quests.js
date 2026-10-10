/* Realm-specific mechanisms. Puzzle actions never write grades or award XP. */
(function(root){
  'use strict';
  const specs={
    zone2:{title:'市集採買：四枚金幣',english:'Two apples and one milk, please.',brief:'野餐清單：蘋果兩顆、牛奶一瓶。蘋果每顆 1 枚、牛奶每瓶 2 枚、麵包每個 2 枚。你有 4 枚金幣；裝好購物籃再結帳。',clues:['先看看清單上的食物數量與價格。','兩顆蘋果花 2 枚，一瓶牛奶花 2 枚；想想籃子裡要留下哪些食物。']},
    zone3:{title:'花園照護：三位小夥伴',english:'Water the tree. Feed the rabbit. Help the bird.',brief:'樹木缺水，小兔子想吃葉子，青鳥想吃種子。先選照護工具，再點選要幫忙的夥伴。',clues:['每位夥伴需要的東西不一樣。','水給 TREE，葉子給 RABBIT，種子給 BIRD；先選工具再選夥伴。']},
    zone4:{title:'運動接力：跨越終點',english:'Take the ball. Run, jump, then play soccer.',brief:'選好接力器材，再依跑道上的指示完成三個動作。不計時，可以慢慢看線索。',clues:['先選能踢的器材，再看英語動作順序。','需要 BALL；動作依序是 RUN、JUMP、SOCCER。']},
    zone5:{title:'車站解謎：準時上車',english:'The train leaves at eight thirty. Go to platform two.',brief:'車票寫著 08:30、月台 2。調整鐘面的時與分，選對月台再驗票。',clues:['車票的時間與月台必須同時符合。','Eight thirty 是 08:30，platform two 是月台 2。']},
    zone6:{title:'海港導航：避礁靠岸',english:'Sail to the lighthouse. Keep away from the rocks.',brief:'從左下方的小船出發，使用四個方向航行到右上方燈塔。礁石不能通過，岸邊也不能越界。',clues:['看看海圖中礁石的位置，找一條連續的水路。','先沿左側往北，到最上方後往東；船每次只移動一格。']},
    zone7:{title:'觀測站：對準東方月亮',english:'Find the moon in the east.',brief:'觀測筆記：東方的月亮是星門鑰匙。選擇天體，再轉動觀測儀；北 0°、東 90°、南 180°、西 270°。',clues:['筆記同時提到天體與方向。','選 MOON，把觀測儀轉到東方 90°，再確認對準。']},
    zone8:{title:'冰雪準備：溫暖出發',english:'Wear a coat, gloves and boots. Keep warm.',brief:'帶上外套、手套與雪靴。營火需要溫暖的 2 格熱度，太冷或太熱都不能出發。',clues:['裝備與營火都要準備好，才適合走進雪地。','留下外套、手套、雪靴，取消短褲與涼鞋；把熱度調到 2 格。']},
    zone9:{title:'智慧殿堂：修復故事卷軸',english:'Read first. Think next. Write last.',brief:'卷軸的步驟散開了。依英文線索把三張卡依序放回；放錯可以取回重排。',clues:['First、next、last 告訴你先後順序。','先 READ，再 THINK，最後 WRITE；排好後蓋上印章。']},
    zone10:{title:'虹光空島：奏響回家之歌',english:'Listen to the music. Sing the song.',brief:'彩虹琴譜：C → E → G → C。先聽四個音，再用琴鍵重現旋律，讓回家的虹橋亮起。',clues:['聽示範旋律，留意最後一個音與第一個音相同。','依序按 C、E、G、C；按錯可以清空琴譜重來。']}
  };
  const defaults={zone2:{cart:[0,0,0],paid:false},zone3:{tool:'WATER',care:[false,false,false]},zone4:{equipment:'',stage:0},zone5:{hour:6,minute:0,platform:1,boarded:false},zone6:{x:0,y:2},zone7:{object:'STAR',angle:0,aligned:false},zone8:{gear:[],heat:0,ready:false},zone9:{order:[],sealed:false},zone10:{notes:[],played:false}};
  const clone=x=>JSON.parse(JSON.stringify(x));
  const isInt=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
  const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function initial(id){return defaults[id]?clone(defaults[id]):null;}
  function solved(id,s){
    if(!s)return false;
    switch(id){
      case 'zone2':return s.paid===true&&eq(s.cart,[2,1,0]);
      case 'zone3':return eq(s.care,[true,true,true]);
      case 'zone4':return s.equipment==='BALL'&&s.stage===3;
      case 'zone5':return s.boarded===true&&s.hour===8&&s.minute===30&&s.platform===2;
      case 'zone6':return s.x===3&&s.y===0;
      case 'zone7':return s.aligned===true&&s.object==='MOON'&&s.angle===90;
      case 'zone8':return s.ready===true&&s.heat===2&&eq([...s.gear].sort(),['BOOTS','COAT','GLOVES']);
      case 'zone9':return s.sealed===true&&eq(s.order,['READ','THINK','WRITE']);
      case 'zone10':return s.played===true&&eq(s.notes,['C','E','G','C']);
      default:return false;
    }
  }
  function validateState(id,raw){
    if(!raw||!defaults[id])return null;
    let ok=false;
    switch(id){
      case 'zone2':ok=Array.isArray(raw.cart)&&raw.cart.length===3&&raw.cart.every(n=>isInt(n,0,3))&&typeof raw.paid==='boolean';break;
      case 'zone3':ok=['WATER','LEAF','SEEDS'].includes(raw.tool)&&Array.isArray(raw.care)&&raw.care.length===3&&raw.care.every(b=>typeof b==='boolean');break;
      case 'zone4':ok=['','BALL','BOOK','CLOCK'].includes(raw.equipment)&&isInt(raw.stage,0,3);break;
      case 'zone5':ok=[6,8,10].includes(raw.hour)&&[0,30,45].includes(raw.minute)&&isInt(raw.platform,1,3)&&typeof raw.boarded==='boolean';break;
      case 'zone6':ok=isInt(raw.x,0,3)&&isInt(raw.y,0,2)&&!((raw.x===1&&raw.y===1)||(raw.x===2&&raw.y===2));break;
      case 'zone7':ok=['STAR','MOON','SUN'].includes(raw.object)&&[0,90,180,270].includes(raw.angle)&&typeof raw.aligned==='boolean';break;
      case 'zone8':ok=Array.isArray(raw.gear)&&raw.gear.length<=5&&new Set(raw.gear).size===raw.gear.length&&raw.gear.every(g=>['COAT','GLOVES','BOOTS','SHORTS','SANDALS'].includes(g))&&isInt(raw.heat,0,3)&&typeof raw.ready==='boolean';break;
      case 'zone9':ok=Array.isArray(raw.order)&&raw.order.length<=3&&new Set(raw.order).size===raw.order.length&&raw.order.every(w=>['READ','THINK','WRITE'].includes(w))&&typeof raw.sealed==='boolean';break;
      case 'zone10':ok=Array.isArray(raw.notes)&&raw.notes.length<=4&&raw.notes.every(n=>['C','E','G'].includes(n))&&typeof raw.played==='boolean';break;
    }
    if(!ok)return null;
    const s=initial(id);for(const key of Object.keys(s))s[key]=clone(raw[key]);
    // A stale success flag cannot bypass a changed configuration.
    for(const key of ['paid','boarded','aligned','ready','sealed','played'])if(key in s&&!solved(id,s))s[key]=false;
    return s;
  }
  function sanitizeMap(map){const result={};if(!map||typeof map!=='object')return result;for(const id of Object.keys(defaults)){const state=validateState(id,map[id]);if(state)result[id]=state;}return result;}
  function transition(id,raw,action){
    const s=validateState(id,raw)||initial(id);if(!s||!action)return {state:s,message:'請先閱讀任務線索。'};
    if(solved(id,s))return {state:s,message:'任務已完成，可以回到秘境探索。'};
    let message='已更新，看看線索再試下一步。';
    switch(id){
      case 'zone2':
        if(action.type==='quantity'&&isInt(action.index,0,2)&&isInt(action.value,0,3))s.cart[action.index]=action.value;
        if(action.type==='pay'){s.paid=eq(s.cart,[2,1,0]);message=s.paid?'購物清單與 4 枚金幣剛好相符！':'還不能結帳：請核對食物數量與金幣總額。';}break;
      case 'zone3':
        if(action.type==='tool'&&['WATER','LEAF','SEEDS'].includes(action.value))s.tool=action.value;
        if(action.type==='care'&&isInt(action.index,0,2)){if(s.tool===['WATER','LEAF','SEEDS'][action.index]){s.care[action.index]=true;message='這位夥伴已經得到需要的照護！';}else message='這位夥伴需要別的東西；可以換一個工具再試。';}break;
      case 'zone4':
        if(action.type==='equipment'&&['BALL','BOOK','CLOCK'].includes(action.value)){s.equipment=action.value;s.stage=0;}
        if(action.type==='move'&&['RUN','JUMP','SOCCER'].includes(action.value)){if(s.equipment!=='BALL')message='接力還需要一顆球，先選器材。';else if(action.value===['RUN','JUMP','SOCCER'][s.stage]){s.stage++;message='完成第 '+s.stage+' 個動作！';}else {s.stage=0;message='順序有一點不同，再從 RUN 開始試試。';}}break;
      case 'zone5':
        if(action.type==='set'&&((action.key==='hour'&&[6,8,10].includes(action.value))||(action.key==='minute'&&[0,30,45].includes(action.value))||(action.key==='platform'&&isInt(action.value,1,3))))s[action.key]=action.value;
        if(action.type==='board'){s.boarded=s.hour===8&&s.minute===30&&s.platform===2;message=s.boarded?'時間與月台正確，車票驗證成功！':'時間或月台與車票不同，再看看車票。';}break;
      case 'zone6':{
        const delta={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]}[action.value];
        if(action.type==='sail'&&delta){const x=s.x+delta[0],y=s.y+delta[1];if(!isInt(x,0,3)||!isInt(y,0,2))message='岸邊不能通過，換個方向航行。';else if((x===1&&y===1)||(x===2&&y===2))message='前方有礁石，請找另一條水路。';else {s.x=x;s.y=y;message='已航行一格。';}}break;
      }
      case 'zone7':
        if(action.type==='object'&&['STAR','MOON','SUN'].includes(action.value))s.object=action.value;
        if(action.type==='rotate')s.angle=(s.angle+90)%360;
        if(action.type==='align'){s.aligned=s.object==='MOON'&&s.angle===90;message=s.aligned?'觀測儀已對準東方月亮！':'天體或方向與筆記不同，再觀察一次。';}break;
      case 'zone8':
        if(action.type==='gear'&&['COAT','GLOVES','BOOTS','SHORTS','SANDALS'].includes(action.value))s.gear=s.gear.includes(action.value)?s.gear.filter(g=>g!==action.value):[...s.gear,action.value];
        if(action.type==='heat'&&[-1,1].includes(action.value))s.heat=Math.min(3,Math.max(0,s.heat+action.value));
        if(action.type==='depart'){s.ready=s.heat===2&&eq([...s.gear].sort(),['BOOTS','COAT','GLOVES']);message=s.ready?'保暖裝備與營火都準備好了！':'請核對保暖裝備，並讓營火維持 2 格熱度。';}break;
      case 'zone9':
        if(action.type==='card'&&['READ','THINK','WRITE'].includes(action.value)&&!s.order.includes(action.value)&&s.order.length<3)s.order.push(action.value);
        if(action.type==='clear')s.order=[];
        if(action.type==='seal'){s.sealed=eq(s.order,['READ','THINK','WRITE']);message=s.sealed?'卷軸恢復了正確的故事步驟！':'順序與 first、next、last 不同，可以取回重排。';}break;
      case 'zone10':
        if(action.type==='note'&&['C','E','G'].includes(action.value)&&s.notes.length<4)s.notes.push(action.value);
        if(action.type==='clear')s.notes=[];
        if(action.type==='play'){s.played=eq(s.notes,['C','E','G','C']);message=s.played?'回家的旋律響起，虹橋亮了！':'旋律有一點不同，先聽示範再清空重彈。';}break;
    }
    return {state:s,message:solved(id,s)?'秘境任務完成！ '+message:message};
  }
  function canTravel(from,to,map,{restore=false,dev=false}={}){return restore||dev||!specs[from]||Number(to.slice(4))<=Number(from.slice(4))||solved(from,map?.[from]);}
  const api={specs,initial,solved,validateState,sanitizeMap,transition,canTravel};root.RealmQuests=api;if(typeof module!=='undefined')module.exports=api;
  if(!root.document)return;
  root.addEventListener('load',()=>{
    const world=root.world3D;if(!world)return;
    const $=id=>root.document.getElementById(id),modal=$('realmQuestModal'),area=$('realmQuestControls');let active=null,returnFocus=null;
    const tones=[];let rewardTimer=null,board=null;
    function states(){return world.gameState.realmPuzzles||(world.gameState.realmPuzzles={});}
    function state(id){return states()[id]||(states()[id]=initial(id));}
    function button(text,action,pressed){const b=root.document.createElement('button');b.type='button';b.textContent=text;if(pressed!==undefined)b.setAttribute('aria-pressed',String(pressed));b.addEventListener('click',()=>act(action));return b;}
    function row(...children){const r=root.document.createElement('div');r.className='quest-row';r.append(...children);area.append(r);return r;}
    function text(value,cls='quest-readout'){const el=root.document.createElement('p');el.className=cls;el.textContent=value;area.append(el);return el;}
    function select(label,values,current,action){const wrap=root.document.createElement('label');wrap.textContent=label;const control=root.document.createElement('select');for(const [value,name]of values){const option=root.document.createElement('option');option.value=value;option.textContent=name;option.selected=String(value)===String(current);control.append(option);}control.addEventListener('change',()=>act(action(control.value)));wrap.append(control);area.append(wrap);}
    function svg(markup){const panel=root.document.createElement('div');panel.className='quest-diagram';panel.innerHTML=markup;area.append(panel);}
    function render(){
      const s=state(active),done=solved(active,s);area.replaceChildren();
      switch(active){
        case 'zone2':
          ['🍎 APPLE · 每顆 1 枚','🥛 MILK · 每瓶 2 枚','🍞 BREAD · 每個 2 枚'].forEach((label,i)=>select(label,[0,1,2,3].map(n=>[n,String(n)]),s.cart[i],v=>({type:'quantity',index:i,value:Number(v)})));
          text('購物籃 '+(s.cart[0]+s.cart[1]*2+s.cart[2]*2)+' / 4 枚金幣');row(button('用 4 枚金幣結帳',{type:'pay'}));break;
        case 'zone3':
          row(...[['WATER','💧 水'],['LEAF','🍃 葉子'],['SEEDS','🌾 種子']].map(([value,label])=>button(label,{type:'tool',value},s.tool===value)));
          row(...['🌳 TREE','🐰 RABBIT','🐦 BIRD'].map((label,i)=>button((s.care[i]?'✓ ':'')+label,{type:'care',index:i},s.care[i])));text('已照護 '+s.care.filter(Boolean).length+' / 3 位夥伴');break;
        case 'zone4':
          row(...['BALL','BOOK','CLOCK'].map(value=>button(value,{type:'equipment',value},s.equipment===value)));
          text('接力進度 '+s.stage+' / 3');row(...['RUN','JUMP','SOCCER'].map(value=>button(value,{type:'move',value})));break;
        case 'zone5':{
          const minute=s.minute*6,hour=(s.hour%12)*30+s.minute*.5;
          svg('<svg viewBox="0 0 160 160" role="img" aria-label="鐘面 '+s.hour+' 點 '+s.minute+' 分"><circle cx="80" cy="80" r="70" fill="#fff7df" stroke="#297d79" stroke-width="4"/><text x="72" y="27">12</text><text x="135" y="86">3</text><text x="76" y="145">6</text><text x="17" y="86">9</text><line x1="80" y1="80" x2="80" y2="40" stroke="#183f3a" stroke-width="6" transform="rotate('+hour+' 80 80)"/><line x1="80" y1="80" x2="80" y2="24" stroke="#ba7137" stroke-width="3" transform="rotate('+minute+' 80 80)"/></svg>');
          for(const [key,label,values]of [['hour','時',[6,8,10]],['minute','分',[0,30,45]],['platform','月台',[1,2,3]]])select(label,values.map(n=>[n,String(n).padStart(2,'0')]),s[key],v=>({type:'set',key,value:Number(v)}));row(button('驗票上車',{type:'board'}));break;
        }
        case 'zone6':{
          const grid=root.document.createElement('div');grid.className='quest-sea';grid.setAttribute('role','img');grid.setAttribute('aria-label','海圖：船在第 '+(s.y+1)+' 排、第 '+(s.x+1)+' 欄；燈塔在右上方，礁石在第二排第二欄與第三排第三欄。');
          for(let y=0;y<3;y++)for(let x=0;x<4;x++){const cell=root.document.createElement('span');cell.textContent=s.x===x&&s.y===y?'⛵':x===3&&y===0?'🗼':(x===1&&y===1)||(x===2&&y===2)?'🪨':'〰';grid.append(cell);}area.append(grid);
          row(...[['north','↑ 北 North'],['west','← 西 West'],['east','→ 東 East'],['south','↓ 南 South']].map(([value,label])=>button(label,{type:'sail',value})));break;
        }
        case 'zone7':
          row(...['STAR','MOON','SUN'].map(value=>button(value,{type:'object',value},s.object===value)));
          svg('<svg viewBox="0 0 160 160" role="img" aria-label="觀測方向 '+s.angle+' 度"><circle cx="80" cy="80" r="65" fill="#eef4fe" stroke="#485879"/><text x="65" y="28">N 0°</text><text x="115" y="83">E 90°</text><text x="60" y="143">S 180°</text><text x="0" y="83">W 270°</text><path d="M 80 40 L 72 68 L 80 62 L 88 68 Z" fill="#be7a31" transform="rotate('+s.angle+' 80 80)"/><circle cx="80" cy="80" r="5" fill="#be7a31"/></svg>');
          text('觀測儀 '+s.angle+'°');row(button('順時針轉 90°',{type:'rotate'}),button('確認對準',{type:'align'}));break;
        case 'zone8':
          row(...[['COAT','🧥 外套 Coat'],['GLOVES','🧤 手套 Gloves'],['BOOTS','🥾 雪靴 Boots'],['SHORTS','🩳 短褲 Shorts'],['SANDALS','🩴 涼鞋 Sandals']].map(([value,label])=>button(label,{type:'gear',value},s.gear.includes(value))));
          text('營火熱度 '+['□ □ □','■ □ □','■ ■ □','■ ■ ■'][s.heat]+' · '+['太冷','微暖','溫暖','太熱'][s.heat]);row(button('加一份木柴 +1',{type:'heat',value:1}),button('減少木柴 −1',{type:'heat',value:-1}),button('準備出發',{type:'depart'}));break;
        case 'zone9':
          text('故事卷軸：'+(s.order.join(' → ')||'等待放入三張卡'));
          row(...['READ','THINK','WRITE'].map(value=>button(value,{type:'card',value},s.order.includes(value))));row(button('取回重排',{type:'clear'}),button('蓋上印章',{type:'seal'}));break;
        case 'zone10':
          text('你的琴譜：'+(s.notes.join(' → ')||'等待第一個音'));const demo=button('♫ 聽示範 C → E → G → C',null);demo.addEventListener('click',()=>playNotes(['C','E','G','C']));row(demo);
          row(...['C','E','G'].map(value=>button('♫ '+value,{type:'note',value})));row(button('清空琴譜',{type:'clear'}),button('奏響虹橋',{type:'play'}));break;
      }
      $('realmQuestWin').hidden=!done;$('realmQuestNext').textContent=active==='zone10'?'回家的虹橋已亮起！空島的旋律任務完成了，也可以返回其他秘境繼續探索與練習。':'任務已解開。回到場景練習英語、探索守護者，再沿出口前往下一個秘境。';
      if(done)for(const control of area.querySelectorAll('button,select'))control.disabled=true;
    }
    function stopNotes(){for(const o of tones.splice(0))try{o.stop();}catch(error){}}
    function playNotes(notes){
      stopNotes();const audio=root.audioManager;audio?.init?.();const ctx=audio?.ctx;if(!ctx||!audio.sfxGain)return;
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
      notes.forEach((n,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+i*.42;o.type='sine';o.frequency.value={C:523.25,E:659.25,G:783.99}[n];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(audio.sfxGain);o.onended=()=>{o.disconnect();g.disconnect();const ix=tones.indexOf(o);if(ix>=0)tones.splice(ix,1);};tones.push(o);o.start(t);o.stop(t+.38);});
    }
    function reward(title,next){
      clearTimeout(rewardTimer);$('adventureRewardTitle').textContent=title;$('adventureRewardNext').textContent=next;$('adventureReward').hidden=false;
      $('adventureReward').style.animation=world.settings.reducedMotion?'none':'';
      rewardTimer=root.setTimeout(()=>$('adventureReward').hidden=true,5500);
    }
    function updateMechanism(){
      if(world.zoneManager.currentZoneId!=='zone10')return;
      const complete=solved('zone10',state('zone10'));
      world.activeZoneGroup.traverse(object=>{if(object.userData.realmQuestRainbow)object.material.opacity=complete ? 0.8 : 0.14;});
    }
    function act(action){
      if(!action||active!==world.zoneManager.currentZoneId)return;
      const focusIndex=Array.from(area.querySelectorAll('button,select')).indexOf(root.document.activeElement);
      const result=transition(active,state(active),action);states()[active]=result.state;render();$('realmQuestResult').textContent=result.message;
      // Keep keyboard focus at the corresponding action after controls are rebuilt.
      if(solved(active,result.state))$('realmQuestExplore').focus({preventScroll:true});
      else area.querySelectorAll('button,select')[Math.max(0,focusIndex)]?.focus({preventScroll:true});
      if(action.type==='note')playNotes([action.value]);
      if(solved(active,result.state)){root.audioManager?.playSfx('magicSuccess');reward('秘境任務完成：'+specs[active].title,active==='zone10'?'回家的虹橋亮起了！':'出口已準備好，回到場景繼續探索。');world.hintController?.clear();$('realmQuestBtn').textContent='✓ 秘境任務完成';if(board)board.material.color.setHex(0x68c9a7);}
      updateMechanism();
      world.adventureProgress?.save(true);
    }
    function open(){if(world.isAnyModalOpen())return;active=world.zoneManager.currentZoneId;if(!specs[active])return;returnFocus=root.document.activeElement;$('realmQuestKicker').textContent='秘境 '+active.slice(4)+' · 生活英語解謎';$('realmQuestTitle').textContent=specs[active].title;$('realmQuestEnglish').textContent=specs[active].english;$('realmQuestBrief').textContent=specs[active].brief;$('realmQuestResult').textContent='';render();modal.style.display='flex';root.touchControls?.reset();world.targetFocus?.select(null);}
    function close(){modal.style.display='none';stopNotes();root.speechManager?.stopVoice();returnFocus?.isConnected&&returnFocus.focus({preventScroll:true});}
    function sync(){
      const id=world.zoneManager.currentZoneId;$('realmQuestBtn').hidden=!specs[id];
      if(modal.style.display!=='none')close();board=null;
      clearTimeout(rewardTimer);$('adventureReward').hidden=true;
      if(!specs[id])return;
      updateMechanism();
      $('realmQuestBtn').textContent=solved(id,state(id))?'✓ 秘境任務完成':'秘境任務';
      const p=world.player.pos;const offset=[[2,0],[-2,0],[0,-2]].find(([x,z])=>!world.isPositionBlocked(p.x+x,p.z+z,.35));if(!offset)return;
      const ring=new root.THREE.Mesh(new root.THREE.TorusGeometry(.35,.07,8,24),new root.THREE.MeshStandardMaterial({color:solved(id,state(id))?0x68c9a7:0xe9b768,emissive:0x483118,roughness:.4}));ring.position.set(p.x+offset[0],1.25,p.z+offset[1]);ring.userData={id:'quest_'+id,name:specs[id].title,label:'秘境任務 · '+specs[id].title,hint:'互動以閱讀英語線索、操作解謎',onClick:open};world.activeZoneGroup.add(ring);world.interactables.push(ring);board=ring;
    }
    $('realmQuestBtn').addEventListener('click',open);$('realmQuestClose').addEventListener('click',close);$('realmQuestExplore').addEventListener('click',close);$('realmQuestListen').addEventListener('click',()=>root.speechManager?.playSentenceVoice(specs[active].english));
    $('devQuestReset').addEventListener('click',()=>{
      const id=world.zoneManager.currentZoneId;if(!world.devMode||!specs[id])return;
      states()[id]=initial(id);$('realmQuestBtn').textContent='秘境任務';if(board)board.material.color.setHex(0xe9b768);
      updateMechanism();world.hintController?.clear();world.adventureProgress?.save(true);world.showToast('此關本機測試機關已重置；學習成績不受影響。');
    });
    root.document.addEventListener('visibilitychange',()=>{if(root.document.hidden){stopNotes();$('adventureReward').hidden=true;}});
    world.realmQuests={sync,open,reward,close};sync();
  });
})(typeof window!=='undefined'?window:globalThis);
