/* Station branch: observed airport clues plus fresh oral recognition, never click-only completion. */
(function(root){
 'use strict';
 const words=['AIRPORT','PLANE','TICKET','BAG','WAIT','HURRY','TAXI','LATE'];
 const places=['airport','plane','ticket','bag','wait','hurry','taxi','late'];
 const correct=['AIRPORT','PLANE','TICKET','','WAIT','','TAXI','LATE'];
 const choices=[['','AIRPORT'],['','PLANE','TRAIN','BOAT'],['','TICKET','BOOK','PAPER'],[''],['','WAIT','RUN','JUMP'],[''],['','TAXI','SHIP','BICYCLE'],['','LATE','WRONG']];
 const initial=()=>({stage:0,spoken:[],choices:['','','','','','','',''],gate:0,call:0,collected:[]});
 const proof=(s,n)=>n===3?s.collected.length===3:n===5?s.gate===2&&s.call===2:s.choices[n]===correct[n];
 function validate(raw){
  if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((v,i)=>v!==words[i])||!Array.isArray(raw.choices)||raw.choices.length!==8||raw.choices.some((v,i)=>!choices[i].includes(v))||![0,1,2,3].includes(raw.gate)||![0,1,2,3].includes(raw.call)||!Array.isArray(raw.collected)||raw.collected.length>3||new Set(raw.collected).size!==raw.collected.length||raw.collected.some(v=>![0,1,2].includes(v)))return null;
  const s={stage:Math.min(raw.stage,raw.spoken.length),spoken:raw.spoken.slice(),choices:raw.choices.slice(),gate:raw.gate,call:raw.call,collected:raw.collected.slice()};
  for(let n=0;n<s.stage;n++)if(!proof(s,n)){s.stage=n;break;}s.spoken=s.spoken.slice(0,s.stage);return s;
 }
 const solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<8&&word===words[s.stage]&&proof(s,s.stage);}
 function transition(raw,a){
  const s=validate(raw)||initial();let message='先觀察航廈線索、完成步驟，再口說完成任務。';
  if(s.stage===8)return {state:s,message:'啟航任務已完成！可返回星光鐘樓車站，或再聽單字示範。'};
  if(a?.type==='choice'&&a.index===s.stage&&a.value!==''&&choices[s.stage].includes(a.value)){s.choices[s.stage]=a.value;message=proof(s,s.stage)?'線索正確！接著口說 '+words[s.stage]+'。':'再觀察航廈標示與英文線索，試另一個答案。';}
  else if(a?.type==='collect'&&s.stage===3&&[0,1,2].includes(a.index)){if(!s.collected.includes(a.index))s.collected.push(a.index);message=s.collected.length===3?'三件隨身與託運行李已確認，口說 BAG 完成行李託運。':'已確認 '+s.collected.length+' / 3 件行李。';}
  else if(a?.type==='condition'&&s.stage===5&&['gate','call'].includes(a.key)&&[0,1,2,3].includes(a.value)){s[a.key]=a.value;message=proof(s,5)?'登機門 2 號與廣播召集 2 格已對齊；口說 HURRY 前往登機。':'航班卡：登機門 2 號、召集燈 2 格。調好後還要口說 HURRY。';}
  else if(a?.type==='speak'){if(!canSpeak(s,a.word))message='先完成當前線索，不能跳過前面的步驟。';else if(a.verifiedWord!==a.word)message='請先口說 '+a.word+' 並通過辨識。';else{s.spoken.push(a.word);s.stage++;message=s.stage===8?'We are not late for the flight! 機場啟航任務完成。':'口說通過！下一步：'+words[s.stage]+'。';}}
  return {state:s,message};
 }
 const lessons=[
  ['航廈迎賓櫃檯','Welcome to the airport.','歡迎來到星光國際機場。地勤人員請你依序確認飛機、登機證、行李與時刻表。先接下啟航任務。'],
  ['停機坪觀景窗','Look at the big plane.','透過大片落地窗望向跑道，找找擁有雙翼與噴射引擎的客機，選出正確交通工具再口說 PLANE。'],
  ['自助報到機','Show your ticket at the gate.','登機前要出示印有座位與登機門編號的機票。選出正確憑證，再口說 TICKET。'],
  ['行李輸送帶','Put your bag on the belt.','依序點選登機箱、隨身包與行李名牌完成三件行李確認，再口說 BAG。'],
  ['候機室指示燈','Please wait by the gate.','候機室亮起琥珀色等待燈號時，請在座位區安靜等候。選出正確行動，再口說 WAIT。'],
  ['登機門廣播台','Hurry to the boarding gate.','航班看板顯示：登機門 2 號、召集進度 2 格。將兩項設定都調到 2，再口說 HURRY。'],
  ['航廈計程車乘車處','Take a yellow taxi.','航廈外排班區停著黃色計程車，能接送旅客往返市區。選出計程車，再口說 TAXI。'],
  ['航班準點電子鐘','We are not late for the flight.','核對出發時刻表，選出準時抵達不遲到的句子，再口說 LATE 完成啟航任務！']
 ];
 function hint(raw){const s=validate(raw)||initial();return {key:'zone15:'+JSON.stringify(s),word:null,targetId:'airport_'+(places[s.stage]||'exit'),clues:s.stage===8?['機場任務完成，由航廈南門返回星光鐘樓車站。','也可以回大廳複習八個機場旅遊單字。']:[lessons[s.stage][2],'先完成線索，再口說 '+words[s.stage]+'。']};}
 const api={words,places,initial,validate,solved,canSpeak,transition,hint};root.AirportChapter=api;if(typeof module!=='undefined')module.exports=api;
  if(!root.document)return;
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;
 let place='journal',focus=null,english='',session=0;
 function state(){const w=world();w.gameState.realmPuzzles||={};return w.gameState.realmPuzzles.zone15||(w.gameState.realmPuzzles.zone15=initial());}
 function close(){session++;$('realmQuestModal').style.display='none';root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function sync(){const w=world();if(w?.zoneManager.currentZoneId!=='zone15')return;const s=validate(state())||initial();$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.stage===8?'✓ 啟航任務完成':'機場啟航任務';const refs=w.airportRefs;if(refs){if(refs.plane)refs.plane.position.z=s.stage===8?-13.5:-10;if(refs.beacon)refs.beacon.visible=s.stage>=5;if(refs.bags)refs.bags.forEach((o,i)=>{o.visible=true;o.material.opacity=s.collected.includes(i)?1:.45;});}}
 function commit(action){if(world()?.zoneManager.currentZoneId!=='zone15')return;const r=transition(state(),action);world().gameState.realmPuzzles.zone15=r.state;sync();world().hintController?.clear();world().adventureProgress?.save(true);render(r.message);}
 function beginSpeech(word){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone15'||!canSpeak(state(),word))return;const before=JSON.stringify(validate(state())),group=w.activeZoneGroup,back=place;close();const own=++session;let used=false;w.openSpeechCard(word,()=>{if(used||own!==session||w.zoneManager.currentZoneId!=='zone15'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;commit({type:'speak',word,verifiedWord:word});open(back);},{requireRecognition:true});}
 function button(text,fn){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
 const labels=[['接下機場啟航任務'],['飛機 · PLANE','火車 · TRAIN','小船 · BOAT'],['機票 · TICKET','書本 · BOOK','白紙 · PAPER'],[],['安靜等候 · WAIT','奔跑 · RUN','跳躍 · JUMP'],[],['計程車 · TAXI','輪船 · SHIP','腳踏車 · BICYCLE'],['We are not late for the flight.','We miss the plane.']];
 function render(message=''){
  const s=validate(state())||initial(),area=$('realmQuestControls'),n=places.indexOf(place),lesson=lessons[n];area.replaceChildren();$('realmQuestKicker').textContent='星光車站支線 · 星光國際機場';$('realmQuestTitle').textContent=lesson?.[0]||'星光國際機場：啟航任務';english=lesson?.[1]||'Welcome to the airport.';$('realmQuestEnglish').textContent=english;$('realmQuestBrief').textContent=(lesson?.[2]||hint(s).clues.join(' '))+' 口說完成 '+s.stage+' / 8。';$('realmQuestResult').textContent=message;$('realmQuestWin').hidden=s.stage!==8;$('realmQuestNext').textContent='八個機場新字都完成了！從南側航廈閘門返回星光鐘樓車站。';
  if(n===s.stage){
   choices[n].slice(1).forEach((value,i)=>{const b=button(labels[n][i],()=>commit({type:'choice',index:n,value}));b.setAttribute('aria-pressed',String(s.choices[n]===value));area.append(b);});
   if(n===3)for(let i=0;i<3;i++){const b=button((s.collected.includes(i)?'✓ 已確認：':'確認：')+['登機箱','隨身背包','行李名牌'][i],()=>commit({type:'collect',index:i}));b.disabled=s.collected.includes(i);area.append(b);}
   if(n===5)for(const [key,label]of [['gate','登機門編號'],['call','廣播召集燈']]){const row=root.document.createElement('div');row.className='greenhouse-controls';const p=root.document.createElement('p');p.textContent=label+'：'+s[key]+' / 3（航班卡目標 2）';row.append(p);for(let value=0;value<=3;value++){const b=button(String(value),()=>commit({type:'condition',key,value}));b.setAttribute('aria-label',label+' '+value);b.setAttribute('aria-pressed',String(s[key]===value));row.append(b);}area.append(row);}
   const speak=button('口說 '+words[n]+' · 完成此步驟',()=>beginSpeech(words[n]));speak.disabled=!canSpeak(s,words[n]);area.append(speak);
  }else if(n>=0){const p=root.document.createElement('p');p.textContent=n<s.stage?'✓ '+words[n]+' 已完成。':('先完成 '+words[s.stage]+'，再來探索這一站。');area.append(p);if(n<s.stage)area.append(button('再聽 '+words[n],()=>root.speechManager?.playSentenceVoice(words[n])));}
  const next=button(s.stage===8?'查看返程閘門':'查看目前任務',()=>{place=s.stage===8?'journal':places[s.stage];render();});area.append(next);
  if(place==='journal'||s.stage===8)area.append(button('返回星光鐘樓車站',()=>{close();if(world().zoneManager.switchZone('zone5'))world().adventureProgress?.save(true);}));
 }
 function open(p='journal'){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone15'||w.isAnyModalOpen())return;place=p;focus=root.document.activeElement;render();$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();}
 Object.assign(api,{open,close,sync,beginSpeech,listen:()=>root.speechManager?.playSentenceVoice(english)});
 root.addEventListener('load',()=>{for(const id of ['realmQuestClose','realmQuestExplore'])$(id).addEventListener('click',()=>{if(world()?.zoneManager.currentZoneId==='zone15')close();});});
})(typeof window!=='undefined'?window:globalThis);
