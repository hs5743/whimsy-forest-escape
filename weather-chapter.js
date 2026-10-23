/* Weather station branch: read an instrument clue, then pass fresh oral recognition. */
(function(root){
 'use strict';
 const words=['WEATHER','CLOUDY','RAIN','RAINY','SUNNY','WINDY','HOT','WET'];
 const places=['station','clouds','rain','diary','sun','wind','temperature','coat'];
 const choices=[['','WEATHER','SPACE'],['','CLOUDY','SUNNY'],['','RAIN','WINDY'],['','RAINY','CLOUDY'],['','SUNNY','CLOUDY'],['','WINDY','WET'],['','HOT','COLD'],['','WET','DRY']];
 const initial=()=>({stage:0,spoken:[],choices:Array(8).fill('')});
 const proof=(s,n)=>s.choices[n]===words[n];
 function validate(raw){
  if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((v,i)=>v!==words[i])||!Array.isArray(raw.choices)||raw.choices.length!==8||raw.choices.some((v,i)=>!choices[i].includes(v)))return null;
  const s={stage:Math.min(raw.stage,raw.spoken.length),spoken:raw.spoken.slice(),choices:raw.choices.slice()};
  for(let n=0;n<s.stage;n++)if(!proof(s,n)){s.stage=n;break;}
  s.spoken=s.spoken.slice(0,s.stage);return s;
 }
 const solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<8&&word===words[s.stage]&&proof(s,s.stage);}
 function transition(raw,action){
  const s=validate(raw)||initial();let message='先觀察氣象儀器的線索，再口說完成步驟。';
  if(s.stage===8)return {state:s,message:'天氣紀錄完成！可以回雲頂觀測站，或到學習大廳複習。'};
  if(action?.type==='choice'&&action.index===s.stage&&choices[s.stage].includes(action.value)){
   s.choices[s.stage]=action.value;
   message=proof(s,s.stage)?'觀測線索正確！接著口說 '+words[s.stage]+'。':'再看看圖示、數字和英文句子，換一個答案。';
  }else if(action?.type==='speak'){
   if(!canSpeak(s,action.word))message='先完成目前的觀測線索，不能跳過前面的步驟。';
   else if(action.verifiedWord!==action.word)message='請先口說 '+action.word+' 並通過辨識。';
   else{s.spoken.push(action.word);s.stage++;message=s.stage===8?'Excellent! 天氣觀測紀錄完成。':'口說通過！下一站：'+words[s.stage]+'。';}
  }
  return {state:s,message};
 }
 const lessons=[
  ['觀測任務','We study the weather.','氣象觀測員邀請你整理今天的紀錄。先查看觀測台工作單，認出本次任務主題，再口說 WEATHER。'],
  ['雲況觀察','It is cloudy today.','觀察圓頂天窗：厚雲遮住大部分天空，陽光變得柔和。選 CLOUDY，然後口說 CLOUDY。'],
  ['雨量紀錄','Rain falls into the gauge.','看雨量筒中落下的水滴。這裡觀察的是從天空落下的水，不是風，選 RAIN 再口說 RAIN。'],
  ['今日天氣日誌','It is rainy today.','查看日誌上的句子。RAIN 是雨；RAINY 用來形容下雨的天氣。日誌要填入形容詞 RAINY。'],
  ['日照觀測','It is sunny now.','日照板旁的天空轉晴，太陽照亮觀測台。選 SUNNY 描述晴朗的天氣。'],
  ['風力觀測','It is windy on the hill.','風杯正在旋轉，風向袋也被吹起。選 WINDY 描述風勢明顯的天氣。'],
  ['溫度讀值','It is hot today.','溫度計停在 31°C。依照牌上的圖例，這個讀值是 HOT，不是 COLD。'],
  ['雨滴觸感','The raincoat is wet.','觀察雨衣表面的水珠。摸起來有水、不是乾燥的，選 WET 並口說 WET。']
 ];
 function hint(raw){const s=validate(raw)||initial();return {key:'zone21:'+JSON.stringify(s),word:null,targetId:'weather_'+(places[s.stage]||'exit'),clues:s.stage===8?['今日天氣紀錄已完成。','沿南側出口返回雲頂觀測站，或回大廳複習八個新字。']:[lessons[s.stage][2],'觀測完成後，還要口說 '+words[s.stage]+'。']};}
 const api={words,places,choices,lessons,initial,validate,solved,canSpeak,transition,hint};root.WeatherChapter=api;if(typeof module!=='undefined')module.exports=api;
 if(!root.document)return;
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;let place='journal',focus=null,english='',session=0;
 function state(){const w=world();w.gameState.realmPuzzles||={};return w.gameState.realmPuzzles.zone21||(w.gameState.realmPuzzles.zone21=initial());}
 function close(){session++;$('realmQuestModal').style.display='none';root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function sync(){const w=world();if(w?.zoneManager.currentZoneId!=='zone21')return;const s=validate(state())||initial();$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.stage===8?'✓ 天氣紀錄完成':'天氣觀測任務';if(w.weatherRefs){w.weatherRefs.vane.rotation.y=w.settings?.reducedMotion?0:Math.sin((w.clock?.elapsedTime||0)*.35)*.18;}}
 function commit(action){if(world()?.zoneManager.currentZoneId!=='zone21')return;const r=transition(state(),action);world().gameState.realmPuzzles.zone21=r.state;sync();world().hintController?.clear();world().adventureProgress?.save(true);render(r.message);}
 function beginSpeech(word){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone21'||!canSpeak(state(),word))return;const before=JSON.stringify(validate(state())),group=w.activeZoneGroup,back=place;close();const own=++session;let used=false;w.openSpeechCard(word,()=>{if(used||own!==session||w.zoneManager.currentZoneId!=='zone21'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;commit({type:'speak',word,verifiedWord:word});open(back);},{requireRecognition:true});}
 function button(text,fn){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
 function render(message=''){
  const s=validate(state())||initial(),area=$('realmQuestControls'),n=places.indexOf(place),lesson=lessons[n];area.replaceChildren();$('realmQuestKicker').textContent='雲頂觀測站支線 · 雲雨氣象觀測台';$('realmQuestTitle').textContent=lesson?.[0]||'雲雨氣象觀測台：找回天氣紀錄';english=lesson?.[1]||'We study the weather.';$('realmQuestEnglish').textContent=english;$('realmQuestBrief').textContent=(lesson?.[2]||hint(s).clues.join(' '))+' 口說完成 '+s.stage+' / 8。';$('realmQuestResult').textContent=message;$('realmQuestWin').hidden=s.stage!==8;$('realmQuestNext').textContent='八個天氣新字都完成了！從南側出口回雲頂觀測站。';
  if(n===s.stage){
   choices[n].slice(1).forEach(value=>{const b=button(value+' · '+(value===words[n]?'正確觀測':'再觀察'),()=>commit({type:'choice',index:n,value}));b.setAttribute('aria-pressed',String(s.choices[n]===value));area.append(b);});
   const speak=button('口說 '+words[n]+' · 完成此步驟',()=>beginSpeech(words[n]));speak.disabled=!canSpeak(s,words[n]);area.append(speak);
  }else if(n>=0){const p=root.document.createElement('p');p.textContent=n<s.stage?'✓ '+words[n]+' 已完成。':('先完成 '+words[s.stage]+'，再來探索這一站。');area.append(p);if(n<s.stage)area.append(button('再聽 '+words[n],()=>root.speechManager?.playSentenceVoice(words[n])));}
  area.append(button(s.stage===8?'查看返程出口':'查看目前任務',()=>{place=s.stage===8?'journal':places[s.stage];render();}));
  if(place==='journal'||s.stage===8)area.append(button('返回雲頂觀測站',()=>{close();if(world().zoneManager.switchZone('zone7'))world().adventureProgress?.save(true);}));
 }
 function open(p='journal'){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone21'||w.isAnyModalOpen())return;place=p;focus=root.document.activeElement;render();$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();}
 Object.assign(api,{open,close,sync,beginSpeech,listen:()=>root.speechManager?.playSentenceVoice(english)});
 root.addEventListener('load',()=>{for(const id of ['realmQuestClose','realmQuestExplore'])$(id).addEventListener('click',()=>{if(world()?.zoneManager.currentZoneId==='zone21')close();});});
})(typeof window!=='undefined'?window:globalThis);
