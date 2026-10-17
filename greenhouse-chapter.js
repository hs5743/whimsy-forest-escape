/* Garden branch: observed clues plus fresh oral recognition, never click-only completion. */
(function(root){
 'use strict';
 const words=['GARDEN','GREEN','BEE','BUTTERFLY','GROW','SMELL','PICK UP','BEAUTIFUL'];
 const places=['garden','green','bee','butterfly','grow','smell','pickup','beautiful'];
 const correct=['GARDEN','GREEN','BEE','BUTTERFLY','','GENTLY','','BEAUTIFUL'];
 const choices=[['','GARDEN'],['','GREEN','BLUE','PURPLE'],['','BEE','SPIDER','BIRD'],['','BUTTERFLY','BEE','BIRD'],[''],['','GENTLY','PULL'],[''],['','BEAUTIFUL','DIRTY']];
 const initial=()=>({stage:0,spoken:[],choices:['','','','','','','',''],water:0,light:0,collected:[]});
 const proof=(s,n)=>n===4?s.water===2&&s.light===2:n===6?s.collected.length===3:s.choices[n]===correct[n];
 function validate(raw){
  if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((v,i)=>v!==words[i])||!Array.isArray(raw.choices)||raw.choices.length!==8||raw.choices.some((v,i)=>!choices[i].includes(v))||![0,1,2,3].includes(raw.water)||![0,1,2,3].includes(raw.light)||!Array.isArray(raw.collected)||raw.collected.length>3||new Set(raw.collected).size!==raw.collected.length||raw.collected.some(v=>![0,1,2].includes(v)))return null;
  const s={stage:Math.min(raw.stage,raw.spoken.length),spoken:raw.spoken.slice(),choices:raw.choices.slice(),water:raw.water,light:raw.light,collected:raw.collected.slice()};
  for(let n=0;n<s.stage;n++)if(!proof(s,n)){s.stage=n;break;}s.spoken=s.spoken.slice(0,s.stage);return s;
 }
 const solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<8&&word===words[s.stage]&&proof(s,s.stage);}
 function transition(raw,a){
  const s=validate(raw)||initial();let message='先觀察展品、完成線索，再口說完成步驟。';
  if(s.stage===8)return {state:s,message:'花園已復甦！可返回守護獸花園，或再聽單字示範。'};
  if(a?.type==='choice'&&a.index===s.stage&&a.value!==''&&choices[s.stage].includes(a.value)){s.choices[s.stage]=a.value;message=proof(s,s.stage)?'線索正確！接著口說 '+words[s.stage]+'。':'再觀察圖示與英文線索，試另一個答案。';}
  else if(a?.type==='condition'&&s.stage===4&&['water','light'].includes(a.key)&&[0,1,2,3].includes(a.value)){s[a.key]=a.value;message=proof(s,4)?'水分與光線都在 2 格；口說 GROW，讓幼苗長大。':'照護卡：兩格水分、兩格光線。調好後還要口說 GROW。';}
  else if(a?.type==='collect'&&s.stage===6&&[0,1,2].includes(a.index)){if(!s.collected.includes(a.index))s.collected.push(a.index);message=s.collected.length===3?'三件遺落物已分類，口說 PICK UP 才完成整理。':'已分類 '+s.collected.length+' / 3 件。';}
  else if(a?.type==='speak'){if(!canSpeak(s,a.word))message='先完成當前線索，不能跳過前面的步驟。';else if(a.verifiedWord!==a.word)message='請先口說 '+a.word+' 並通過辨識。';else{s.spoken.push(a.word);s.stage++;message=s.stage===8?'The garden is beautiful! 溫室復甦完成。':'口說通過！下一步：'+words[s.stage]+'。';}}
  return {state:s,message};
 }
 const lessons=[
  ['入口委託','This is our garden.','歡迎來到玻璃溫室。花園照護員請你觀察昆蟲、照顧幼苗，最後整理環境。先接下委託。'],
  ['葉片的顏色','The leaves are green.','觀察左側植栽台。選出與葉片相同的顏色，再口說 GREEN。'],
  ['訪花的小幫手','A bee visits the flower.','蜜蜂有六隻腳與觸角，飛到花朵間採集花蜜與花粉。選出黃色、黑色條紋的小昆蟲。'],
  ['花間的翅膀','Look at the butterfly.','看右側昆蟲展示：寬大的對稱翅膀上有斑點。找出蝴蝶，再口說 BUTTERFLY。'],
  ['讓幼苗長大','Plants need water and light to grow.','這盆魔法幼苗的照護卡標示：水分 2 格、光線 2 格。數值是本關的解謎設定，不是所有植物共同的澆水標準。調好後口說 GROW。'],
  ['溫柔聞花香','I can smell the flowers.','看香草台的小圖卡：輕輕靠近聞花香，讓花朵留在枝上。選出溫柔觀察的方法，再口說 SMELL。'],
  ['整理花園','Pick up the litter.','地上有三件遺落物：紙張、空瓶與包裝。逐一分類，再完整說出 PICK UP；只說 PICK 或 UP 不會完成。'],
  ['留一張花園明信片','The garden is beautiful.','選出形容整理後花園的句子，再口說 BEAUTIFUL。恭喜你讓溫室重新綻放！']
 ];
 function hint(raw){const s=validate(raw)||initial();return {key:'zone14:'+JSON.stringify(s),word:null,targetId:'greenhouse_'+(places[s.stage]||'exit'),clues:s.stage===8?['溫室任務完成，由入口返回守護獸花園。','也可以回大廳複習八個新字。']:[lessons[s.stage][2],'先完成線索，再口說 '+words[s.stage]+'。']};}
 const api={words,places,initial,validate,solved,canSpeak,transition,hint};root.GreenhouseChapter=api;if(typeof module!=='undefined')module.exports=api;
  if(!root.document)return;
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;
 let place='journal',focus=null,english='',session=0;
 function state(){const w=world();w.gameState.realmPuzzles||={};return w.gameState.realmPuzzles.zone14||(w.gameState.realmPuzzles.zone14=initial());}
 function close(){session++;$('realmQuestModal').style.display='none';root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function sync(){const w=world();if(w?.zoneManager.currentZoneId!=='zone14')return;const s=validate(state())||initial();$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.stage===8?'✓ 溫室復甦完成':'溫室復甦任務';const refs=w.greenhouseRefs;if(refs){refs.sapling.scale.setScalar(s.stage>4?1.55:1);refs.bloom.visible=s.stage===8;refs.litter.forEach((o,i)=>{o.visible=s.stage<7;o.material.opacity=s.collected.includes(i)?.25:1;});}}
 function commit(action){if(world()?.zoneManager.currentZoneId!=='zone14')return;const r=transition(state(),action);world().gameState.realmPuzzles.zone14=r.state;sync();world().hintController?.clear();world().adventureProgress?.save(true);render(r.message);}
 function beginSpeech(word){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone14'||!canSpeak(state(),word))return;const before=JSON.stringify(validate(state())),group=w.activeZoneGroup,back=place;close();const own=++session;let used=false;w.openSpeechCard(word,()=>{if(used||own!==session||w.zoneManager.currentZoneId!=='zone14'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;commit({type:'speak',word,verifiedWord:word});open(back);},{requireRecognition:true});}
 function button(text,fn){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
 const labels=[['接下花園委託'],['綠色 · GREEN','藍色 · BLUE','紫色 · PURPLE'],['蜜蜂 · BEE','蜘蛛 · SPIDER','小鳥 · BIRD'],['蝴蝶 · BUTTERFLY','蜜蜂 · BEE','小鳥 · BIRD'],[],['輕輕靠近，花留在枝上','用力拉下花朵'],[],['The garden is beautiful.','The garden is dirty.']];
 function render(message=''){
  const s=validate(state())||initial(),area=$('realmQuestControls'),n=places.indexOf(place),lesson=lessons[n];area.replaceChildren();$('realmQuestKicker').textContent='守護獸花園支線 · 玻璃溫室';$('realmQuestTitle').textContent=lesson?.[0]||'玻璃溫室：花園復甦任務';english=lesson?.[1]||'The garden is beautiful.';$('realmQuestEnglish').textContent=english;$('realmQuestBrief').textContent=(lesson?.[2]||hint(s).clues.join(' '))+' 口說完成 '+s.stage+' / 8。';$('realmQuestResult').textContent=message;$('realmQuestWin').hidden=s.stage!==8;$('realmQuestNext').textContent='八個新字都完成了！從南側入口回守護獸花園。';
  if(n===s.stage){
   choices[n].slice(1).forEach((value,i)=>{const b=button(labels[n][i],()=>commit({type:'choice',index:n,value}));b.setAttribute('aria-pressed',String(s.choices[n]===value));area.append(b);});
   if(n===4)for(const [key,label]of [['water','水分'],['light','光線']]){const row=root.document.createElement('div');row.className='greenhouse-controls';const p=root.document.createElement('p');p.textContent=label+'：'+s[key]+' / 3 格（照護卡目標 2）';row.append(p);for(let value=0;value<=3;value++){const b=button(String(value)+' 格',()=>commit({type:'condition',key,value}));b.setAttribute('aria-label',label+' '+value+' 格');b.setAttribute('aria-pressed',String(s[key]===value));row.append(b);}area.append(row);}
   if(n===6)for(let i=0;i<3;i++){const b=button((s.collected.includes(i)?'✓ 已分類：':'分類：')+['紙張','空瓶','包裝'][i],()=>commit({type:'collect',index:i}));b.disabled=s.collected.includes(i);area.append(b);}
   const speak=button('口說 '+words[n]+' · 完成此步驟',()=>beginSpeech(words[n]));speak.disabled=!canSpeak(s,words[n]);area.append(speak);
  }else if(n>=0){const p=root.document.createElement('p');p.textContent=n<s.stage?'✓ '+words[n]+' 已完成。':('先完成 '+words[s.stage]+'，再來探索這一站。');area.append(p);if(n<s.stage)area.append(button('再聽 '+words[n],()=>root.speechManager?.playSentenceVoice(words[n])));}
  const next=button(s.stage===8?'查看返程入口':'查看目前任務',()=>{place=s.stage===8?'journal':places[s.stage];render();});area.append(next);
  if(place==='journal'||s.stage===8)area.append(button('返回守護獸花園',()=>{close();if(world().zoneManager.switchZone('zone3'))world().adventureProgress?.save(true);}));
 }
 function open(p='journal'){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone14'||w.isAnyModalOpen())return;place=p;focus=root.document.activeElement;render();$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();}
 Object.assign(api,{open,close,sync,beginSpeech,listen:()=>root.speechManager?.playSentenceVoice(english)});
 root.addEventListener('load',()=>{for(const id of ['realmQuestClose','realmQuestExplore'])$(id).addEventListener('click',()=>{if(world()?.zoneManager.currentZoneId==='zone14')close();});});
})(typeof window!=='undefined'?window:globalThis);
