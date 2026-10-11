/* Connected restaurant chapter. Pure state also runs in the checkpoint validator. */
(function(root){
 'use strict';
 const initial=()=>({accepted:false,key:false,pantryOpen:false,ingredients:[0,0,0],step:0,cooked:false,served:false,spokenSteps:[],deliverySpoken:false});
 const exact=s=>s.ingredients[0]===2&&s.ingredients[1]===1&&s.ingredients[2]===0;
 function validate(raw){
  if(!raw||['accepted','key','pantryOpen','cooked','served'].some(k=>typeof raw[k]!=='boolean')||!Array.isArray(raw.ingredients)||raw.ingredients.length!==3||!raw.ingredients.every(n=>Number.isInteger(n)&&n>=0&&n<=3)||!Number.isInteger(raw.step)||raw.step<0||raw.step>3)return null;
  const s={...initial(),...Object.fromEntries(Object.keys(initial()).map(k=>[k,k==='ingredients'?[...raw[k]]:k==='spokenSteps'?[]:k==='deliverySpoken'?false:raw[k]]))};
  if(!s.accepted){s.key=false;s.pantryOpen=false;s.ingredients=[0,0,0];}
  if(!s.key)s.pantryOpen=false;
  if(!s.pantryOpen)s.ingredients=[0,0,0];
  if(raw.spokenSteps!==undefined&&(!Array.isArray(raw.spokenSteps)||raw.spokenSteps.length>3||raw.spokenSteps.some((w,i)=>w!==['WASH','PUT','COOK'][i])))return null;
  s.spokenSteps=Array.isArray(raw.spokenSteps)?[...raw.spokenSteps]:[];s.deliverySpoken=raw.deliverySpoken===true;
  s.step=Math.min(s.step,s.spokenSteps.length);if(!s.pantryOpen||!exact(s))s.step=0;
  s.spokenSteps=s.spokenSteps.slice(0,s.step);s.cooked=s.cooked&&s.step===3;s.served=s.served&&s.cooked&&s.deliverySpoken;if(!s.served)s.deliverySpoken=false;
  return s;
 }
 const solved=s=>!!validate(s)?.served;
 function requiredWord(a){return a?.type==='order'||a?.type==='serve'?'SOUP':a?.type==='key'?'KEY':a?.type==='door'?'OPEN':a?.type==='ingredient'?['EGG','PUMPKIN','LEMON'][a.index]:a?.type==='prepare'&&['WASH','PUT','COOK'].includes(a.value)?a.value:null;}
 function canPerform(raw,a){const s=validate(raw)||initial();if(s.served)return false;switch(a?.type){case 'order':return !s.accepted;case 'key':return s.accepted&&!s.key;case 'door':return s.key&&!s.pantryOpen;case 'ingredient':return s.pantryOpen&&!s.cooked&&Number.isInteger(a.index)&&a.index>=0&&a.index<3&&[-1,1].includes(a.delta)&&s.ingredients[a.index]+a.delta>=0&&s.ingredients[a.index]+a.delta<=3;case 'prepare':return s.pantryOpen&&exact(s)&&!s.cooked&&a.value===['WASH','PUT','COOK'][s.step];case 'serve':return s.cooked&&!s.served;default:return false;}}
 function transition(raw,a){
  const s=validate(raw)||initial();let message='看看英語線索，再試下一步。';
  if(!a)return {state:s,message};if(s.served)return {state:s,message:'熱湯已送達！可以返回陽光微風市集，或繼續練習英語。'};
  const word=requiredWord(a);if(word&&a.verifiedWord!==word)return {state:s,message:'請先口說 '+word+' 並通過辨識，才會完成這個步驟。'};
  if(a.type==='order'){s.accepted=true;message='訂單已接下：Two eggs and one pumpkin, please.';}
  else if(!s.accepted)message='先到餐廳的訂單台接下任務。';
  else if(a.type==='key'){s.key=true;message='找到椅子下的 KEY！拿它到廚房東側打開儲藏室。';}
  else if(a.type==='door'){if(s.key){s.pantryOpen=true;message='儲藏室已打開。依訂單選食材，選錯也能放回。';}else message='Find the key under the chair. 鑰匙在餐廳的椅子下。';}
  else if(a.type==='ingredient'&&s.pantryOpen&&!s.cooked&&Number.isInteger(a.index)&&a.index>=0&&a.index<3&&[-1,1].includes(a.delta)){s.ingredients[a.index]=Math.max(0,Math.min(3,s.ingredients[a.index]+a.delta));s.step=0;s.spokenSteps=[];message='籃子：雞蛋 '+s.ingredients[0]+'、南瓜 '+s.ingredients[1]+'、檸檬 '+s.ingredients[2]+'。';}
  else if(a.type==='prepare'&&!s.cooked){if(!exact(s)||!s.pantryOpen)message='先依訂單準備兩顆雞蛋、一顆南瓜；不需要檸檬。';else if(a.value===['WASH','PUT','COOK'][s.step]){s.spokenSteps.push(a.value);s.step++;s.cooked=s.step===3;message=s.cooked?'湯煮好了！回餐廳的訂單台送餐。':'完成 '+a.value+'！下一步是 '+['WASH','PUT','COOK'][s.step]+'。';}else {s.step=0;s.spokenSteps=[];message='順序不同，再從 WASH → PUT → COOK 試試，食材仍在籃子裡。';}}
  else if(a.type==='serve'){if(s.cooked){s.served=true;s.deliverySpoken=true;message='Here is your soup. 客人收到熱湯，魔法餐廳任務完成！';}else message='熱湯還沒準備好，先到廚房依步驟料理。';}
  return {state:s,message};
 }
 function hint(raw){const s=validate(raw)||initial();let id='restaurant_order',clues=['先到餐廳的訂單台接單。','Two eggs and one pumpkin, please.'];if(!s.accepted)return {key:'zone11:order',word:null,targetId:id,clues};if(!s.key){id='restaurant_key';clues=['Find the key under the chair.','看看餐廳左側椅子的下方；可以拖曳向下看。'];}else if(s.key&&!s.pantryOpen){id='restaurant_door';clues=['拿鑰匙打開廚房東側的儲藏室。','穿過 KITCHEN 門口，往右找到 PANTRY。'];}else if(s.pantryOpen&&!exact(s)){id='restaurant_ingredient_'+(s.ingredients[2]?'2':s.ingredients[0]!==2?'0':'1');clues=['訂單需要兩顆雞蛋與一顆南瓜。','在儲藏室靠近食材箱取用；多拿的食材可以放回。'];}else if(!s.cooked){id='restaurant_'+['wash','put','cook'][s.step];clues=['WASH first. PUT next. COOK last.','依序到水槽、備料台、爐台互動。'];}else {id='restaurant_order';clues=s.served?['魔法餐廳任務完成！','可以返回陽光微風市集，或靠近物件練習英語。']:['Here is your soup.','回到餐廳的訂單台，把熱湯送給客人。'];}return {key:'zone11:'+JSON.stringify(s),word:null,targetId:id,clues};}
 const api={initial,validate,solved,transition,hint,requiredWord,canPerform};root.RestaurantChapter=api;if(typeof module!=='undefined')module.exports=api;
  if(!root.document)return;
 let place='journal',focus=null,english='';
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;
 function state(){const w=world();const map=w.gameState.realmPuzzles||(w.gameState.realmPuzzles={});return map.zone11||(map.zone11=initial());}
 function button(text,action){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=action;return b;}
 function sync(){const s=state(),w=world();if(w.zoneManager.currentZoneId!=='zone11')return;const refs=w.restaurantRefs;if(refs){refs.door.visible=!s.pantryOpen;refs.key.visible=!s.key;refs.soup.visible=s.cooked&&!s.served;refs.delivery.visible=s.served;}$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.served?'✓ 餐廳任務完成':'餐廳任務手冊';}
 function beginAction(a){const w=world(),word=requiredWord(a);if(!w||w.zoneManager.currentZoneId!=='zone11')return;if(!word||!canPerform(state(),a)){render(a.type==='prepare'?'先核對食材，依序完成 WASH → PUT → COOK 的口說。':'先完成前面的任務，或檢查食材數量。');return;}const before=JSON.stringify(validate(state())),group=w.activeZoneGroup,returnPlace=place;let used=false;close();w.openSpeechCard(word,()=>{if(used||w.zoneManager.currentZoneId!=='zone11'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;act({...a,verifiedWord:word});open(returnPlace);},{requireRecognition:true});}
 function act(a){if(world().zoneManager.currentZoneId!=='zone11')return;const r=transition(state(),a);world().gameState.realmPuzzles.zone11=r.state;sync();world().hintController?.clear();world().adventureProgress?.save(true);render(r.message);root.audioManager?.playSfx(r.state.served?'magicSuccess':'click');}
 function close(){ $('realmQuestModal').style.display='none';root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function render(message=''){
  const s=state(),area=$('realmQuestControls');area.replaceChildren();$('realmQuestKicker').textContent='陽光微風市集 · 餐廳委託';$('realmQuestWin').hidden=!s.served;$('realmQuestNext').textContent='跨房間任務完成。你可以繼續練習食物與料理英語，或返回陽光微風市集。';$('realmQuestResult').textContent=message;
  const add=(t,a)=>area.append(button(t+' · 口說 '+requiredWord(a),()=>beginAction(a)));let word=null;
  if(place==='order'){ $('realmQuestTitle').textContent='餐廳訂單台';english=s.cooked?'Here is your soup.':'Two eggs and one pumpkin, please.';$('realmQuestBrief').textContent='市集店主邀請你幫忙；小客人點了雞蛋南瓜湯。先接單，再尋找鑰匙與食材，到廚房完成料理後回來送餐。';if(!s.accepted)add('接下訂單',{type:'order'});else if(!s.served)add('送出熱湯',{type:'serve'});word='SOUP';area.append(button('練習 SPOON',()=>{close();world().openSpeechCard('SPOON',()=>world().addXP(50));}));}
  else if(place==='key'){$('realmQuestTitle').textContent='椅子下的黃銅鑰匙';english='The key is under the chair.';$('realmQuestBrief').textContent=s.accepted?'這是儲藏室的鑰匙。拿起它，再到廚房東側尋找 PANTRY。':'先到訂單台接單，再來拿鑰匙。';if(s.accepted&&!s.key)add('拿起鑰匙',{type:'key'});word=null;}
  else if(place==='door'){$('realmQuestTitle').textContent='食材儲藏室';english='Find the key under the chair.';$('realmQuestBrief').textContent=s.pantryOpen?'門已打開，可以走進儲藏室選食材。':'門鎖住了。依英文線索尋找餐廳椅子下的鑰匙。';if(!s.pantryOpen)add('用鑰匙開門',{type:'door'});}
  else if(/^ingredient[0-2]$/.test(place)){const i=Number(place.slice(-1)),names=['雞蛋','南瓜','檸檬'];word=['EGG','PUMPKIN','LEMON'][i];$('realmQuestTitle').textContent='食材箱 · '+names[i];english='Two eggs and one pumpkin, please.';$('realmQuestBrief').textContent='籃子目前：雞蛋 '+s.ingredients[0]+'、南瓜 '+s.ingredients[1]+'、檸檬 '+s.ingredients[2]+'。可以取用與放回，煮好後不再更換。';if(!s.cooked){add('取一份 '+names[i],{type:'ingredient',index:i,delta:1});add('放回一份 '+names[i],{type:'ingredient',index:i,delta:-1});}}
  else if(['wash','put','cook'].includes(place)){word=place.toUpperCase();$('realmQuestTitle').textContent={wash:'水槽 · 洗菜',put:'備料台 · 放入食材',cook:'爐台 · 煮湯'}[place];english='WASH first. PUT next. COOK last.';$('realmQuestBrief').textContent=s.cooked?'熱湯已完成，請回餐廳送餐。':'先核對食材，再依序洗菜、放入食材、煮湯。口說通過才會記錄步驟；目前完成 '+s.step+' / 3 步。';if(!s.cooked)add('進行 '+word,{type:'prepare',value:word});}
  else {$('realmQuestTitle').textContent='一碗熱湯的冒險';english=!s.accepted?'Two eggs and one pumpkin, please.':!s.key?'Find the key under the chair.':!s.pantryOpen?'Open the pantry door.':!s.cooked?'WASH first. PUT next. COOK last.':'Here is your soup.';$('realmQuestBrief').textContent=hint(s).clues.join(' ');const p=root.document.createElement('p');p.textContent='進度：'+[s.accepted?'✓ 接單':'○ 接單',s.key?'✓ 鑰匙':'○ 鑰匙',s.pantryOpen?'✓ 開門':'○ 開門','料理 '+s.step+'/3',s.served?'✓ 送餐':'○ 送餐'].join(' → ');area.append(p);area.append(button('返回陽光微風市集',()=>{close();world().zoneManager.switchZone('zone2');world().adventureProgress?.save(true);}));}
  $('realmQuestEnglish').textContent=english;if(word)area.append(button('練習 '+word,()=>{close();world().openSpeechCard(word,()=>world().addXP(50));}));
 }
 function open(p='journal'){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone11'||w.isAnyModalOpen())return;place=p;focus=root.document.activeElement;render();$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();}
 api.open=open;api.sync=sync;api.beginAction=beginAction;api.listen=()=>root.speechManager?.playSentenceVoice(english);
 root.addEventListener('load',()=>{for(const id of ['realmQuestClose','realmQuestExplore'])$(id).addEventListener('click',()=>{if(world()?.zoneManager.currentZoneId==='zone11')close();});});
})(typeof window!=='undefined'?window:globalThis);
