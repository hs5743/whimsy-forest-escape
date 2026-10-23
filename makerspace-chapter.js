/* A fictional school makerspace branch. Every station clue must be followed by fresh oral recognition. */
(function(root){
 'use strict';
 const words=['ROBOT','MAKE','FAST','SLOW','TURN','WORK','READY','START'];
 const places=['robot','make','fast','slow','turn','work','ready','start'];
 const choices=[
  ['','ROBOT','TOOL'],['','MAKE','READ'],['','FAST','SLOW'],['','SLOW','FAST'],
  ['','TURN','STOP'],['','WORK','PLAY'],['','READY','WET'],['','START','CLOSE']
 ];
 const lessons=[
  ['小車本體','This is a robot.','工作桌上的小車有車身、輪子與感測器；這是一台 ROBOT。'],
  ['組裝工作墊','We make a robot.','把車身與輪子零件放到防滑工作墊上，動手 MAKE 一台小車。'],
  ['小齒輪轉速','The small gear is fast.','比較正在轉動的小齒輪；轉得快的是 FAST。'],
  ['大齒輪轉速','The large gear is slow.','比較較大的齒輪；轉得慢的是 SLOW。'],
  ['轉向伺服器','The robot can turn.','看小車前輪與轉向伺服器；要改變方向時，機器人會 TURN。'],
  ['共用工作桌','We work together.','工具、零件和空位都留給同組使用；大家一起 WORK。'],
  ['電池檢查座','The robot is ready.','確認電池已放妥，安全護蓋也扣好；準備好的狀態是 READY。'],
  ['啟動區','Let’s start!','把小車對準地面測試線，確認四周清空後再 START。']
 ];
 const initial=()=>({stage:0,spoken:[],choices:Array(8).fill('')});
 function validate(raw){
  if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((v,i)=>v!==words[i])||!Array.isArray(raw.choices)||raw.choices.length!==8||raw.choices.some((v,i)=>!choices[i].includes(v)))return null;
  const s={stage:Math.min(raw.stage,raw.spoken.length),spoken:raw.spoken.slice(),choices:raw.choices.slice()};
  for(let i=0;i<s.stage;i++)if(s.choices[i]!==words[i]){s.stage=i;break;}
  s.spoken=s.spoken.slice(0,s.stage);return s;
 }
 const proof=(s,n)=>s.choices[n]===words[n],solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<8&&word===words[s.stage]&&proof(s,s.stage);}
 function transition(raw,action){
  const s=validate(raw)||initial();let message='先觀察工坊裡的實物線索，再口說完成目前步驟。';
  if(s.stage===8)return{state:s,message:'機器人測試完成！你已經組裝、檢查並啟動小車。'};
  if(action?.type==='choice'&&action.index===s.stage&&choices[s.stage].includes(action.value)){
   s.choices[s.stage]=action.value;message=proof(s,s.stage)?'線索正確！接著口說 '+words[s.stage]+'。':'再看看工作桌上的零件與操作線索，換一個答案。';
  }else if(action?.type==='speak'){
   if(!canSpeak(s,action.word))message='請先完成目前的工坊線索，再繼續口說。';
   else if(action.verifiedWord!==action.word)message='請先口說 '+action.word+' 並通過辨識。';
   else{s.spoken.push(action.word);s.stage++;message=s.stage===8?'Excellent! 機器人測試完成。':'口說通過！下一個實作線索：'+words[s.stage]+'。';}
  }
  return{state:s,message};
 }
 function hint(raw){const s=validate(raw)||initial();return{key:'zone18:'+JSON.stringify(s),word:null,targetId:'maker_'+(places[s.stage]||'exit'),clues:s.stage===8?['機器人任務已完成。','沿校園工坊入口返回新港國小。']:[lessons[s.stage][2],'完成實物線索後，還要口說 '+words[s.stage]+'。']};}
 const api={words,places,choices,lessons,initial,validate,solved,canSpeak,transition,hint};root.MakerspaceChapter=api;if(typeof module!=='undefined')module.exports=api;
 if(!root.document)return;
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;let place='robot',focus=null,english='',session=0;
 function state(){const w=world();w.gameState.realmPuzzles||={};return w.gameState.realmPuzzles.zone18||(w.gameState.realmPuzzles.zone18=initial());}
 function close(){session++;$('realmQuestModal').style.display='none';root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function sync(){const w=world();if(w?.zoneManager.currentZoneId!=='zone18')return;const s=validate(state())||initial();$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.stage===8?'✓ 創客工坊任務完成':'機器人創作任務';}
 function commit(action){if(world()?.zoneManager.currentZoneId!=='zone18')return;const r=transition(state(),action);world().gameState.realmPuzzles.zone18=r.state;sync();world().hintController?.clear();world().adventureProgress?.save(true);render(r.message);}
 function beginSpeech(word){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone18'||!canSpeak(state(),word))return;const before=JSON.stringify(validate(state())),group=w.activeZoneGroup,back=place;close();const own=++session;let used=false;w.openSpeechCard(word,()=>{if(used||own!==session||w.zoneManager.currentZoneId!=='zone18'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;commit({type:'speak',word,verifiedWord:word});open(back);},{requireRecognition:true});}
 function button(text,fn){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
 function render(message=''){
  const s=validate(state())||initial(),area=$('realmQuestControls'),n=places.indexOf(place),lesson=lessons[n];area.replaceChildren();$('realmQuestKicker').textContent='新港國小校園支線 · 科技創作工坊';$('realmQuestTitle').textContent=lesson?.[0]||'小小機器人：組裝與測試';english=lesson?.[1]||'We make a robot.';$('realmQuestEnglish').textContent=english;$('realmQuestBrief').textContent=(lesson?.[2]||hint(s).clues.join(' '))+' 口說完成 '+s.stage+' / 8。';$('realmQuestResult').textContent=message;$('realmQuestWin').hidden=s.stage!==8;$('realmQuestNext').textContent='創客工坊任務完成！沿入口返回校園。';
  if(n===s.stage){choices[n].slice(1).forEach(value=>{const b=button(value,()=>commit({type:'choice',index:n,value}));b.setAttribute('aria-pressed',String(s.choices[n]===value));area.append(b);});const speak=button('口說 '+words[n]+' · 完成此步驟',()=>beginSpeech(words[n]));speak.disabled=!canSpeak(s,words[n]);area.append(speak);}
  else if(n>=0){const p=root.document.createElement('p');p.textContent=n<s.stage?'✓ '+words[n]+' 已完成。':'先完成 '+words[s.stage]+'，再來探索這一站。';area.append(p);if(n<s.stage)area.append(button('再聽 '+words[n],()=>root.speechManager?.playSentenceVoice(words[n])));}
  area.append(button(s.stage===8?'查看返程出口':'查看目前任務',()=>{place=s.stage===8?'robot':places[s.stage];render();}));
  if(place==='robot'||s.stage===8)area.append(button('返回新港國小校園',()=>{close();if(world().zoneManager.switchZone('zone12'))world().adventureProgress?.save(true);}));
 }
 function open(p='robot'){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone18'||w.isAnyModalOpen())return;place=p;focus=root.document.activeElement;render();$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();}
 Object.assign(api,{open,close,sync,beginSpeech,listen:()=>root.speechManager?.playSentenceVoice(english)});
 root.addEventListener('load',()=>{for(const id of ['realmQuestClose','realmQuestExplore'])$(id).addEventListener('click',()=>{if(world()?.zoneManager.currentZoneId==='zone18')close();});});
})(typeof window!=='undefined'?window:globalThis);
