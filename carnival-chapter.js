/* Number Carnival: count a visible set, choose its number, then pass fresh oral recognition. */
(function(root){
 'use strict';
 const words=['THIRTEEN','FOURTEEN','FIFTEEN','SIXTEEN','SEVENTEEN','EIGHTEEN','NINETEEN','TWENTY'];
 const counts=[13,14,15,16,17,18,19,20];
 const places=['thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
 const choices=[['THIRTEEN','THIRTY'],['FOURTEEN','FORTY'],['FIFTEEN','FIFTY'],['SIXTEEN','SIXTY'],['SEVENTEEN','SEVENTY'],['EIGHTEEN','EIGHTY'],['NINETEEN','NINETY'],['TWENTY','TWELVE']];
 const lessons=[
  ['十三枚星籌','Thirteen stars shine.','數一數第一座遊戲攤上的藍金星籌，選 THIRTEEN。'],
  ['十四枚星籌','Fourteen stars glow.','第二座攤位有十四枚星籌；注意 FOURTEEN 和 FORTY 的差別。'],
  ['十五枚星籌','Fifteen stars sparkle.','第三座攤位的星籌共有十五枚，先數清楚再選 FIFTEEN。'],
  ['十六枚星籌','Sixteen stars shine bright.','第四座攤位排著十六枚星籌；選 SIXTEEN，不是 SIXTY。'],
  ['十七枚星籌','Seventeen stars glow blue.','第五座攤位有十七枚星籌，逐一數完再選 SEVENTEEN。'],
  ['十八枚星籌','Eighteen stars light the booth.','第六座攤位的星籌共有十八枚；選 EIGHTEEN。'],
  ['十九枚星籌','Nineteen stars form a ring.','第七座攤位排著十九枚星籌；選 NINETEEN。'],
  ['二十枚星籌','Twenty stars fill the tray.','最後一站的木托盤排滿二十枚星籌。選 TWENTY，口說通過後嘉年華就會亮起。']
 ];
 const initial=()=>({stage:0,spoken:[],choices:Array(8).fill('')});
 const proof=(s,n)=>s.choices[n]===words[n];
 function validate(raw){
  if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((v,i)=>v!==words[i])||!Array.isArray(raw.choices)||raw.choices.length!==8||raw.choices.some((v,i)=>v!==''&&!choices[i].includes(v)))return null;
  const s={stage:Math.min(raw.stage,raw.spoken.length),spoken:raw.spoken.slice(),choices:raw.choices.slice()};
  for(let n=0;n<s.stage;n++)if(!proof(s,n)){s.stage=n;break;}
  s.spoken=s.spoken.slice(0,s.stage);return s;
 }
 const solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<8&&word===words[s.stage]&&proof(s,s.stage);}
 function transition(raw,action){
  const s=validate(raw)||initial();let message='先數清現場的燈或星籌，再口說完成步驟。';
  if(s.stage===8)return {state:s,message:'嘉年華星環全數點亮！可以回市集，或到學習大廳複習。'};
  if(action?.type==='choice'&&action.index===s.stage&&choices[s.stage].includes(action.value)){
   s.choices[s.stage]=action.value;
   message=proof(s,s.stage)?'數量正確！接著口說 '+words[s.stage]+'。':'再數一次現場的燈或星籌，換一個答案。';
  }else if(action?.type==='speak'){
   if(!canSpeak(s,action.word))message='先完成目前的數量線索，不能跳過前面的步驟。';
   else if(action.verifiedWord!==action.word)message='請先口說 '+action.word+' 並通過辨識。';
   else{s.spoken.push(action.word);s.stage++;message=s.stage===8?'Excellent! 星環嘉年華完成。':'口說通過！下一站：'+words[s.stage]+'。';}
  }
  return {state:s,message};
 }
 function hint(raw){const s=validate(raw)||initial();return {key:'zone19:'+JSON.stringify(s),word:s.stage<8?words[s.stage]:null,targetId:'carnival_'+(places[s.stage]||'exit'),clues:s.stage===8?['八個數字任務都完成了。','走到南側拱門返回陽光微風市集。']:[lessons[s.stage][2],'數量線索正確後，還要口說 '+words[s.stage]+'。']};}
 const api={words,counts,places,choices,lessons,initial,validate,solved,canSpeak,transition,hint};root.CarnivalChapter=api;if(typeof module!=='undefined')module.exports=api;
 if(!root.document)return;
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;let place='thirteen',focus=null,english='',session=0;
 function state(){const w=world();w.gameState.realmPuzzles||={};return w.gameState.realmPuzzles.zone19||(w.gameState.realmPuzzles.zone19=initial());}
 function close(){session++;$('realmQuestModal').style.display='none';root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function sync(){const w=world();if(w?.zoneManager.currentZoneId!=='zone19')return;const s=validate(state())||initial();$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.stage===8?'✓ 嘉年華計數完成':'數字嘉年華任務';}
 function commit(action){if(world()?.zoneManager.currentZoneId!=='zone19')return;const r=transition(state(),action);world().gameState.realmPuzzles.zone19=r.state;sync();world().hintController?.clear();world().adventureProgress?.save(true);render(r.message);}
 function beginSpeech(word){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone19'||!canSpeak(state(),word))return;const before=JSON.stringify(validate(state())),group=w.activeZoneGroup,back=place;close();const own=++session;let used=false;w.openSpeechCard(word,()=>{if(used||own!==session||w.zoneManager.currentZoneId!=='zone19'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;commit({type:'speak',word,verifiedWord:word});open(back);},{requireRecognition:true});}
 function button(text,fn){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
 function render(message=''){
  const s=validate(state())||initial(),area=$('realmQuestControls'),n=places.indexOf(place),lesson=lessons[n];area.replaceChildren();$('realmQuestKicker').textContent='陽光微風市集支線 · 星環數字嘉年華';$('realmQuestTitle').textContent=lesson?.[0]||'魔法數字嘉年華：星環計數任務';english=lesson?.[1]||'Thirteen stars shine.';$('realmQuestEnglish').textContent=english;$('realmQuestBrief').textContent=(lesson?.[2]||hint(s).clues.join(' '))+' 口說完成 '+s.stage+' / 8。';$('realmQuestResult').textContent=message;$('realmQuestWin').hidden=s.stage!==8;$('realmQuestNext').textContent='八個數字任務都完成了！從南側拱門回到陽光微風市集。';
  if(n===s.stage){choices[n].forEach(value=>{const b=button(value+' · '+(value===words[n]?'正確數量':'再數一次'),()=>commit({type:'choice',index:n,value}));b.setAttribute('aria-pressed',String(s.choices[n]===value));area.append(b);});const speak=button('口說 '+words[n]+' · 完成此步驟',()=>beginSpeech(words[n]));speak.disabled=!canSpeak(s,words[n]);area.append(speak);}
  else if(n>=0){const p=root.document.createElement('p');p.textContent=n<s.stage?'✓ '+words[n]+' 已完成。':'先完成 '+words[s.stage]+'，再來探索這一站。';area.append(p);if(n<s.stage)area.append(button('再聽 '+words[n],()=>root.speechManager?.playSentenceVoice(words[n])));}
  area.append(button(s.stage===8?'查看返程拱門':'查看目前任務',()=>{place=s.stage===8?'exit':places[s.stage];render();}));
  if(place==='thirteen'||place==='exit')area.append(button('返回陽光微風市集',()=>{close();if(world().zoneManager.switchZone('zone2'))world().adventureProgress?.save(true);}));
 }
 function open(p='thirteen'){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone19'||w.isAnyModalOpen())return;place=p;focus=root.document.activeElement;render();$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();}
 Object.assign(api,{open,close,sync,beginSpeech,listen:()=>root.speechManager?.playSentenceVoice(english)});
 root.addEventListener('load',()=>{for(const id of ['realmQuestClose','realmQuestExplore'])$(id).addEventListener('click',()=>{if(world()?.zoneManager.currentZoneId==='zone19')close();});});
})(typeof window!=='undefined'?window:globalThis);
