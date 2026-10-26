/* New-gang school arts branch: find a real workshop object, then pass oral recognition. */
(function(root){
 'use strict';
 const words=['BLACKBOARD','PICTURE','PENCIL','RULER','GLUE','MARKER','ART','ENGLISH'];
 const places=['blackboard','mural','pencil','ruler','glue','marker','art','english'];
 const lessons=[
  ['黑板 · 設計工作單','The blackboard shows our art plan.','點選牆上的黑板，觀察舞獅彩繪工作單，再口說 BLACKBOARD。'],
  ['舞獅壁畫 · 配色靈感','Look at the lion picture.','點選工作室後牆的龍、鳳與獅子彩繪壁畫，再口說 PICTURE。'],
  ['鉛筆 · 描繪工具','I draw with a pencil.','點選桌面工具杯裡的鉛筆，辨認畫圖工具，再口說 PENCIL；這是展品辨認，不會實際繪圖。'],
  ['尺 · 測量工具','The ruler is long.','點選工作桌上的長尺，觀察刻度並口說 RULER；不需移動或量測旗布。'],
  ['膠水 · 黏合工具','Use glue to join the paper.','點選桌面上的固體膠，辨認黏合紙張的工具，再口說 GLUE；本步不會實際黏貼紙鱗片。'],
  ['彩色筆 · 著色工具','Color the picture with a marker.','點選色彩工具架上的彩色筆，再口說 MARKER；此步辨認工具，不會替圖案著色。'],
  ['美術桌 · 工具與作品','Art is fun.','點選展示桌，觀察畫紙、布料與顏料，辨認 ART 並口說通過；作品是場景陳列，不會在本關生成新畫作。'],
  ['雙語小展台 · 英語標示','Read the English cards.','點選作品旁的英語學習卡，辨認 ENGLISH 並口說完成；本步是詞彙展示，不會進行 NPC 對話。']
 ];
 const initial=()=>({stage:0,spoken:[],found:null});
 function validate(raw){
  if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((v,i)=>v!==words[i])||!(raw.found===null||words.includes(raw.found)))return null;
  const stage=Math.min(raw.stage,raw.spoken.length),spoken=raw.spoken.slice(0,stage);
  return{stage,spoken,found:stage<8&&raw.found===words[stage]?raw.found:null};
 }
 const solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<8&&word===words[s.stage]&&s.found===word;}
 function transition(raw,action){
  const s=validate(raw)||initial();let message='沿著工作桌和展示牆尋找目前步驟的實物線索，再口說完成。';
  if(s.stage===8)return{state:s,message:'舞獅彩繪工坊展品探索完成！八個步驟都已找到對應展品並口說通過，沿入口返回新港校園。'};
  if(action?.type==='touch'){
   if(action.index===s.stage){s.found=words[s.stage];message='點選 '+words[s.stage]+' 展品！觀察它的用途，再口說 '+words[s.stage]+'。';}
   else message='這不是目前步驟的工具。查看工作單上的英文線索，再找一次。';
  }else if(action?.type==='speak'){
   if(!canSpeak(s,action.word))message='先在工坊找到 '+words[s.stage]+'，再口說完成這個步驟。';
   else if(action.verifiedWord!==action.word)message='請先口說 '+action.word+' 並通過辨識。';
   else{s.spoken.push(action.word);s.stage++;s.found=null;message=s.stage===8?'Excellent! 舞獅彩繪工具辨識完成。':'口說通過！下一項展品是 '+words[s.stage]+'。';}
  }
  return{state:s,message};
 }
 function hint(raw){
  const s=validate(raw)||initial();
  return{key:'zone20:'+JSON.stringify(s),word:null,targetId:'artwork_'+(places[s.stage]||'exit'),clues:s.stage===8?['工坊展品探索完成，沿南側校園走廊返回新港國小。','也可以留在工坊聽句子，或前往英語學習大廳自由複習。']:[lessons[s.stage][2],'點選正確展品後，還要口說 '+words[s.stage]+' 才能完成。']};
 }
 const api={words,places,lessons,initial,validate,solved,canSpeak,transition,hint};root.ArtWorkshopChapter=api;if(typeof module!=='undefined')module.exports=api;
 if(!root.document)return;
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;let place='journal',focus=null,english='',session=0;
 function state(){const w=world();w.gameState.realmPuzzles||={};return w.gameState.realmPuzzles.zone20||(w.gameState.realmPuzzles.zone20=initial());}
 function close(){session++;$('realmQuestModal').style.display='none';root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function sync(){const w=world();if(w?.zoneManager.currentZoneId!=='zone20')return;const s=validate(state())||initial();$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.stage===8?'✓ 工坊展品探索完成':'校慶彩繪工坊任務';}
 function commit(action){if(world()?.zoneManager.currentZoneId!=='zone20')return;const r=transition(state(),action);world().gameState.realmPuzzles.zone20=r.state;sync();world().hintController?.clear();world().adventureProgress?.save(true);render(r.message);root.audioManager?.playSfx(r.state.stage===8?'magicSuccess':'click');}
 function beginSpeech(word){
  const w=world();if(!w||w.zoneManager.currentZoneId!=='zone20'||!canSpeak(state(),word)){render('先在工坊找到 '+(words[state().stage]||'目前工具')+'，再口說完成。');return;}
  const before=JSON.stringify(validate(state())),group=w.activeZoneGroup;close();const own=++session;let used=false;
  w.openSpeechCard(word,()=>{if(used||own!==session||w.zoneManager.currentZoneId!=='zone20'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;commit({type:'speak',word,verifiedWord:word});place='journal';$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();},{requireRecognition:true});
 }
 function button(text,fn){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
 function render(message=''){
  const s=validate(state())||initial(),area=$('realmQuestControls'),n=s.stage,lesson=lessons[n];area.replaceChildren();
  $('realmQuestKicker').textContent='新港國小校園支線 · 校慶舞獅彩繪工坊';$('realmQuestTitle').textContent=lesson?.[0]||'工坊展品探索完成';english=lesson?.[1]||'We explored the art workshop.';$('realmQuestEnglish').textContent=english;
  $('realmQuestBrief').textContent=(lesson?.[2]||hint(s).clues.join(' '))+' 已口說 '+s.stage+' / 8。';$('realmQuestResult').textContent=message;$('realmQuestWin').hidden=s.stage!==8;$('realmQuestNext').textContent='展品探索完成！沿南側入口返回新港校園，也可到學習大廳自由複習。';
  if(s.stage<8){
   if(s.found===words[s.stage]){const speak=button('口說 '+words[s.stage]+' · 完成此步驟',()=>beginSpeech(words[s.stage]));speak.disabled=!canSpeak(s,words[s.stage]);area.append(speak);}
   else{const p=root.document.createElement('p');p.textContent='目前步驟：'+words[s.stage]+'。請點選工坊裡對應的實物。';area.append(p);}
  }
  if(place==='journal'||s.stage===8)area.append(button('返回新港國小校園',()=>{close();if(world().zoneManager.switchZone('zone12')){world().player.pos.set(8.1,1.6,8.2);world().player.yaw=Math.PI;world().adventureProgress?.save(true);}}));
  if(s.stage<8)area.append(button('聽示範句',()=>root.speechManager?.playSentenceVoice(english)));
 }
 function open(p='journal'){
  const w=world();if(!w||w.zoneManager.currentZoneId!=='zone20'||w.isAnyModalOpen())return;
  place=p;focus=root.document.activeElement;
  const index=places.indexOf(p);if(index>=0){const previous=state(),r=transition(previous,{type:'touch',index});w.gameState.realmPuzzles.zone20=r.state;if(r.state.found===words[index]&&previous.found!==r.state.found){w.adventureProgress?.save(true);w.hintController?.clear();}render(r.message);}
  else render();
  $('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();
 }
 Object.assign(api,{open,close,sync,beginSpeech,listen:()=>root.speechManager?.playSentenceVoice(english)});
 root.addEventListener('load',()=>{for(const id of ['realmQuestClose','realmQuestExplore'])$(id).addEventListener('click',()=>{if(world()?.zoneManager.currentZoneId==='zone20')close();});});
})(typeof window!=='undefined'?window:globalThis);
