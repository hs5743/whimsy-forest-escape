(function(root){
 'use strict';
 const R=root.LearningRewards,D=root.LearningData,$=id=>root.document.getElementById(id);
 let store,owner='',generation=0,selected=null,mode='words',topic='food',query='',busy=false,meaningChoice=false,focusBefore=null,syncing=false;
 const profile=()=>root.cloudSyncManager?.profile||{};
 const storageKey=id=>'whimsy_learning_v1:'+encodeURIComponent(id);
 function read(id){const fallback={state:R.empty(),pending:[],returnTo:null};let raw;try{raw=localStorage.getItem(storageKey(id));if(!raw)return fallback;const v=JSON.parse(raw);if(v.state?.version!==1||!v.state.words||!v.state.sentences||!Array.isArray(v.state.events)||!Array.isArray(v.state.favorites)||!Array.isArray(v.pending))throw Error('Corrupt learning save');return v;}catch(_){if(raw)try{localStorage.setItem(storageKey(id)+':recovery',raw);}catch(_){}return fallback;}}
 function save(s){if(root.world3D?.devMode){store=s;return true;}try{localStorage.setItem(storageKey(owner),JSON.stringify(s));store=s;return true;}catch(_){status('此裝置無法保存紀錄，這次不增加積分。請檢查儲存空間。');return false;}}
 function load(){const id=String(profile().studentId||'visitor');if(owner!==id){cancel();owner=id;store=read(id);selected=null;generation++;}else if(!root.world3D?.devMode)store=read(id);return store;}
 function status(t){const e=$('hubStatus');if(e)e.textContent=t;}
 function cancel(){generation++;root.speechManager?.stopListening();busy=false;}
 function event(kind,word,extra={}){
  load();const e={id:root.crypto?.randomUUID?.()||Date.now()+'-'+Math.random().toString(36).slice(2),kind,word:R.key(word),time:Date.now(),...extra};
  const result=R.apply(store.state,e,profile().completedWords||[]),next={...store,state:result.state,pending:[...store.pending,e]};
  if(!save(next))return null;
  const p=profile();p.xp=(p.xp||0)+result.xp;p.level=root.cloudSyncManager.calculateLevel(p.xp);
  if(kind==='word'&&!p.completedWords.includes(e.word)){p.completedWords.push(e.word);p.stars=p.completedWords.length;p.badgesCount=Math.floor(p.stars/3);}
  root.cloudSyncManager.notifyListeners();renderStats();sync();return result;
 }
 function renderStats(){if(!$('hubStats'))return;const s=load().state;const learned=new Set((profile().completedWords||[]).map(R.key));for(const [k,v]of Object.entries(s.words))if(v.learned)learned.add(k);$('hubStats').textContent='學習積分 '+(profile().xp||0)+' · 已學單字 '+learned.size+' · 已學句型 '+Object.keys(s.sentences).length+' · 練習 '+(s.practices||0)+' 次';$('hubSync').textContent=root.world3D?.devMode?'本機預覽 · 成績不傳送':profile().isGuest?'訪客紀錄保存在此裝置':store.pending.length?'此裝置已保存 · '+store.pending.length+' 筆待同步':'此裝置已保存';}
 function visibleWords(){const s=load().state;let words=mode==='review'?D.entries.filter(e=>s.words[R.key(e.word)]?.learned||(profile().completedWords||[]).includes(R.key(e.word))).sort((a,b)=>(s.words[R.key(a.word)]?.last||0)-(s.words[R.key(b.word)]?.last||0)):mode==='collection'?D.entries.filter(e=>s.favorites.includes(R.key(e.word))):query?D.entries:D.entries.filter(e=>D.topics.find(t=>t.id===topic)?.words.includes(R.key(e.word)));return words.filter(e=>!query||e.word.toLowerCase().includes(query.toLowerCase())||e.zh.includes(query));}
 function button(text,fn,cls=''){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=cls;b.onclick=fn;return b;}
 function renderList(){
  const list=$('hubList');list.replaceChildren();
  if(mode==='sentences'){
   for(const t of D.templates){const h=document.createElement('h3');h.textContent=t.label+' · '+t.zh;list.append(h);for(const s of D.sentences.filter(s=>s.template===t.id))list.append(button(s.en,()=>select(s),'hub-list-word'+(selected?.id===s.id?' selected':'')));}
  }else{
   const words=visibleWords();$('hubCount').textContent=words.length+' 個單字 · 可搜尋完整 '+D.entries.length+' 字參考範圍';
   for(const e of words){const learned=store.state.words[R.key(e.word)]?.learned||(profile().completedWords||[]).includes(R.key(e.word));list.append(button((learned?'✓ ':'')+e.word+' · '+e.zh,()=>select(e),'hub-list-word'+(selected?.word===e.word?' selected':'')));}
   if(!words.length){const p=document.createElement('p');p.textContent=mode==='review'?'先口說學會一些單字，再回來請兔子教練陪你複習。':mode==='collection'?'點單字卡的「收藏」，就能整理自己想學的字。':'沒有符合的單字，試試其他英文或中文。';list.append(p);}
  }
 }
 function select(item){cancel();selected=item;meaningChoice=false;renderCard();renderList();if(root.matchMedia?.('(max-width:700px)').matches)$('hubCard').scrollIntoView({block:'nearest',behavior:'auto'});}
 function speak(rate){cancel();root.speechManager?.playSentenceVoice(selected?.en||selected?.word||'',rate);status('先聽示範，再點「開始朗讀」。');}
 function renderCard(){
  const card=$('hubCard');card.replaceChildren();if(!selected){const p=document.createElement('p');p.textContent='選擇想練的單字或句型。可以隨時換題、聽示範，依自己的速度學習。';card.append(p);return;}
  const sentence=!!selected.en,word=sentence?selected.word:R.key(selected.word),item=D.find(word),w=store.state.words[word];
  const kicker=document.createElement('small');kicker.textContent=sentence?'貓頭鷹老師 · 完整句型朗讀':'狐狸館長 · '+(item?.topic||'主題單字');card.append(kicker);
  const h=document.createElement('h2');h.textContent=selected.en||selected.word;card.append(h);const p=document.createElement('p');p.className='hub-translation';p.textContent=selected.zh;card.append(p);
  if(!sentence){const phon=document.createElement('p');phon.textContent=(item?.phonetic||'')+'  '+(item?.chunks||[]).join(' · ');card.append(phon);const evidence=document.createElement('p');evidence.textContent='熟悉度 '+R.mastery(w)+' / 5 · 口說 '+(w?.times||0)+' 次 · 練習 '+(w?.days?.length||0)+' 天';card.append(evidence);}
  const actions=document.createElement('div');actions.className='hub-card-actions';actions.append(button('▶ 聽示範',()=>speak(.85)),button('🐢 慢速',()=>speak(.55)),button('🎙 開始朗讀',listen,'hub-primary'));if(!sentence)actions.append(button(store.state.favorites.includes(word)?'★ 已收藏':'☆ 收藏',()=>{const r=event('favorite',word,{value:!store.state.favorites.includes(word)});if(r)renderCard();}));card.append(actions);
  const note=document.createElement('p');note.className='hub-note';note.textContent=sentence?'第一次完整口說 +30 積分；重練仍會累積次數。辨識會檢查句子內容與順序。':'首次口說 +50 積分；每日前兩次複習各 +10。之後仍可不限次數練習。熟悉度也需要跨日、字義與句型的證據。';card.append(note);
  if(!sentence){const example=document.createElement('p');example.textContent=item?.sentence||'';card.append(example);const translated=document.createElement('p');translated.textContent=item?.sentenceZh||'';card.append(translated);const meaning=document.createElement('div');meaning.className='hub-meaning';const label=document.createElement('p');label.textContent='字義小檢查：這個字是什麼意思？';meaning.append(label);const distract=D.entries.filter(e=>e.zh!==item.zh);const opts=[item,distract[(word.length*13)%distract.length],distract[(word.length*29+7)%distract.length]].sort((a,b)=>a.zh.localeCompare(b.zh));for(const option of opts)meaning.append(button(option.zh,()=>{if(meaningChoice)return;if(option===item){const r=event('meaning',word);if(r){meaningChoice=true;status('字義答對！已記錄理解證據，口說通過才增加積分。');}}else status('再看一下單字的中文意思，然後試一次。');}));card.append(meaning);}
  const nav=document.createElement('div');nav.className='hub-card-actions';nav.append(button('回選題',()=>{cancel();$('hubList').scrollIntoView({block:'nearest',behavior:'auto'});}),button('再練一次',()=>{cancel();status('準備好了就點「開始朗讀」。');}),button('下一題 →',()=>{const items=sentence?D.sentences:visibleWords(),index=items.findIndex(e=>sentence?e.id===selected.id:e.word===selected.word);if(items.length)select(items[(index+1)%items.length]);}));card.append(nav);
 }
 function listen(){if(!selected)return;cancel();load();const token=++generation,id=owner,item=selected;busy=true;root.touchControls?.reset();root.speechManager.startHubListening(item.en||item.word,()=>{
   if(token!==generation||owner!==id||profile().studentId!==id||selected!==item||!busy||$('learningHubModal').style.display==='none')return;busy=false;
   const r=event(item.en?'sentence':'word',item.word,{...(item.en?{sentence:item.id}:{})});if(!r)return;
   status('口說內容通過！'+(r.xp?' +'+r.xp+' 積分':' 本題獎勵已領取，練習次數仍已累積。'));root.audioManager?.playSfx('magicSuccess');renderCard();
  },(state,message)=>{if(token===generation&&owner===id){status(message.replace(/，?並請老師協助驗證|，?也可請老師協助驗證|或請老師協助驗證/g,'；仍可聽示範、閱讀與收藏'));if(['error','unsupported','retry'].includes(state))busy=false;}});}
 function open(tab='words'){
  const w=root.world3D;if(!w||w.zoneManager.currentZoneId!=='learningHub')return;
  load();focusBefore=document.activeElement;mode=tab;selected=null;query='';$('hubSearch').value='';$('learningHubModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);render();$('hubSearch').focus();sync();
 }
 function close(){cancel();$('learningHubModal').style.display='none';if(focusBefore?.isConnected)focusBefore.focus();}
 function render(){renderStats();$('hubTitle').textContent=mode==='sentences'?'貓頭鷹的句型工作坊':mode==='review'?'兔子的複習花園':mode==='collection'?'我的單字收藏牆':'狐狸的主題單字館';$('hubCount').textContent=mode==='sentences'?D.sentences.length+' 組可口說句型':'';for(const b of $('hubNav').children)b.setAttribute('aria-pressed',String(b.dataset.tab===mode));$('hubTopics').hidden=mode==='sentences';$('hubTopicSelect').hidden=mode==='sentences';$('hubSearch').hidden=mode==='sentences';renderList();renderCard();}
 function enter(){const w=root.world3D;if(!w)return false;root.closeSystemMenu?.();return w.switchZone('learningHub');}
 function remember(w){load();return save({...store,returnTo:{zone:w.zoneManager.currentZoneId,pos:w.player.pos.toArray(),yaw:w.player.yaw,pitch:w.player.pitch}});}
 function returnTarget(){load();const r=store.returnTo,w=root.world3D;if(r&&w.zoneManager.zones[r.zone]&&!w.zoneManager.zones[r.zone].isLearningHub&&Array.isArray(r.pos)&&r.pos.length===3&&r.pos.every(Number.isFinite)&&Number.isFinite(r.yaw)&&Number.isFinite(r.pitch))return r;return {zone:'zone1',pos:null,yaw:0,pitch:0};}
 function leave(){close();const r=returnTarget();root.world3D.switchZone(r.zone,{fromLearningHub:true});}
 async function sync(){
  load();if(syncing||root.world3D?.devMode||profile().isGuest||!navigator.onLine)return;
  const id=owner,manager=root.cloudSyncManager;syncing=true;
  try{
   const send=async body=>(await fetch(manager.gasUrl,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({...body,token:manager.clientToken,studentId:id})})).json();
   const valid=r=>r?.status==='success'&&r.protocol==='learning-v1'&&r.learning?.version===1&&Array.isArray(r.learning.events)&&Array.isArray(r.learning.favorites)&&r.learning.words&&r.learning.sentences&&Number.isFinite(r.student?.xp)&&r.student.xp>=0&&Array.isArray(r.student.completedWords);
   let data=await send({action:'learningGet'});
   if(!valid(data)){if(owner===id)$('hubSync').textContent='此裝置已保存 · 雲端大廳服務尚未更新';return;}
   const reconcile=(response,ack=null)=>{
    if(owner!==id||profile().studentId!==id)return;
    const current=read(id);if(root.world3D?.devMode)return;
    const pending=current.pending.filter(e=>e.id!==ack);let state=response.learning,extra=0;const completed=[...(response.student.completedWords||[])];
    for(const e of pending){const r=R.apply(state,e,completed);state=r.state;extra+=r.xp;if(e.kind==='word'&&!completed.includes(e.word))completed.push(e.word);}
    if(save({...current,state,pending})){Object.assign(profile(),response.student,{xp:response.student.xp+extra,completedWords:completed});profile().level=manager.calculateLevel(profile().xp);profile().stars=completed.length;profile().badgesCount=Math.floor(completed.length/3);manager.notifyListeners();renderStats();}
   };
   reconcile(data);
   for(const e of [...read(id).pending]){data=await send({action:'learningEvent',event:e});if(!valid(data))throw Error(data.message||'同步未完成');reconcile(data,e.id);}
   if(owner===id)$('hubSync').textContent=store.pending.length?'此裝置已保存 · 待同步':'大廳紀錄已同步至雲端';
  }catch(_){if(owner===id)$('hubSync').textContent='此裝置已保存 · 連線恢復後再同步';}finally{syncing=false;}
 }
 function syncNavigation(){const hub=root.world3D?.zoneManager.currentZoneId==='learningHub';for(const [id,show]of [['learningHubMenuBtn',!hub],['learningHubPracticeBtn',hub],['learningHubReturnBtn',hub]])if($(id))$(id).hidden=!show;}
 function init(){
  const modal=document.createElement('div');modal.id='learningHubModal';modal.className='hub-modal';modal.style.display='none';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','hubTitle');modal.innerHTML='<section class="hub-panel"><header><div><small>EXPLORER LANGUAGE LOUNGE</small><h1 id="hubTitle">英語探險家學習大廳</h1><p id="hubStats"></p></div><button id="hubClose" type="button" aria-label="返回大廳">✕</button></header><nav id="hubNav" aria-label="學習方式"></nav><div id="hubTopics" class="hub-topics"></div><select id="hubTopicSelect" aria-label="單字主題"></select><label class="hub-search-label">搜尋英文或中文<input id="hubSearch" type="search" placeholder="例如 apple、蘋果、school" autocomplete="off"></label><p id="hubCount"></p><div class="hub-workspace"><section id="hubList" aria-label="學習題目"></section><article id="hubCard"></article></div><footer><p id="hubStatus" role="status" aria-live="polite">口說內容辨識會受麥克風與網路影響；可以先聽、再練。</p><span id="hubSync"></span><button id="hubRetrySync" type="button">重試同步</button></footer></section>';document.body.append(modal);
  for(const [tab,label]of [['words','🦊 主題單字'],['sentences','🦉 句型工作坊'],['review','🐇 複習'],['collection','★ 收藏牆']]){const b=button(label,()=>{cancel();mode=tab;selected=null;render();});b.dataset.tab=tab;$('hubNav').append(b);}
  for(const t of D.topics)$('hubTopics').append(button(t.icon+' '+t.name,()=>{cancel();topic=t.id;query='';$('hubSearch').value='';selected=null;mode='words';render();}));
  for(const t of D.topics){const option=document.createElement('option');option.value=t.id;option.textContent=t.icon+' '+t.name;$('hubTopicSelect').append(option);}
  $('hubTopicSelect').onchange=e=>{cancel();topic=e.target.value;mode='words';query='';$('hubSearch').value='';selected=null;render();};
  $('hubSearch').oninput=e=>{query=e.target.value.trim();renderList();};$('hubClose').onclick=close;$('hubRetrySync').onclick=sync;
  modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close();}if(e.key==='Tab'){const els=[...modal.querySelectorAll('button,input')].filter(e=>!e.disabled&&e.getClientRects().length);const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  root.cloudSyncManager?.onProfileUpdated(()=>{
   if(owner&&owner!==profile().studentId){
    const guest=owner.startsWith('guest_')?store:null;close();owner='';load();
    if(guest&&!profile().isGuest){
     let state=store.state;const ids=new Set(store.pending.map(e=>e.id)),pending=[...store.pending];
     for(const e of guest.pending){state=R.apply(state,e,[]).state;if(!ids.has(e.id)){pending.push(e);ids.add(e.id);}}
     save({...store,state,pending});
    }
   }
   if(modal.style.display!=='none')renderStats();
  });root.addEventListener('online',sync);setInterval(sync,25000);syncNavigation();
 }
 root.LearningHub={open,close,enter,leave,remember,returnTarget,sync,syncNavigation};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(window);
