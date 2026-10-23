/* New-gang school arts branch: find a real workshop object, then pass oral recognition. */
(function(root){
 'use strict';
 const words=['BLACKBOARD','PICTURE','PENCIL','RULER','GLUE','MARKER','ART','ENGLISH'];
 const places=['blackboard','mural','pencil','ruler','glue','marker','art','english'];
 const lessons=[
  ['黑板 · 設計工作單','The blackboard shows our art plan.','找到牆上的黑板，看看舞獅彩繪的步驟，再口說 BLACKBOARD。'],
  ['舞獅壁畫 · 配色靈感','Look at the lion picture.','沿著工作室後牆觀察龍、鳳與獅子的彩繪壁畫，再口說 PICTURE。'],
  ['鉛筆 · 描繪輪廓','I draw with a pencil.','在桌面工具杯找到削好的鉛筆；先描輪廓，再口說 PENCIL。'],
  ['尺 · 量出旗布寬度','The ruler is long.','把桌上的長尺貼齊布旗邊緣，量好圖案位置，再口說 RULER。'],
  ['膠水 · 黏合紙鱗片','Use glue to join the paper scales.','找到安全固體膠，把紙鱗片黏上舞獅彩旗，再口說 GLUE。'],
  ['彩色筆 · 添上細節','Color the lion with a marker.','在色彩工具架挑出彩色筆，為圖案補上眼睛與鱗片，再口說 MARKER。'],
  ['美術桌 · 完成創作','Art is fun.','看看畫紙、布料與顏料組成的作品桌，完成最後的彩繪，再口說 ART。'],
  ['雙語小展台 · 分享作品','Read the English cards.','找到作品旁的英語學習卡，準備向同學介紹舞獅圖畫，再口說 ENGLISH。']
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
  if(s.stage===8)return{state:s,message:'舞獅彩繪工坊完成！作品已準備好，從入口返回新港校園。'};
  if(action?.type==='touch'){
   if(action.index===s.stage){s.found=words[s.stage];message='找到 '+words[s.stage]+'！仔細看它的用途，再口說 '+words[s.stage]+'。';}
   else message='這不是目前步驟的工具。查看工作單上的英文線索，再找一次。';
  }else if(action?.type==='speak'){
   if(!canSpeak(s,action.word))message='先在工坊找到 '+words[s.stage]+'，再口說完成這個步驟。';
   else if(action.verifiedWord!==action.word)message='請先口說 '+action.word+' 並通過辨識。';
   else{s.spoken.push(action.word);s.stage++;s.found=null;message=s.stage===8?'Excellent! 舞獅彩繪作品完成。':'口說通過！下一項工具是 '+words[s.stage]+'。';}
  }
  return{state:s,message};
 }
 function hint(raw){
  const s=validate(raw)||initial();
  return{key:'zone20:'+JSON.stringify(s),word:null,targetId:'artwork_'+(places[s.stage]||'exit'),clues:s.stage===8?['彩繪作品完成，沿南側校園走廊返回新港國小。','也可以留在工坊聽句子，或前往英語學習大廳自由複習。']:[lessons[s.stage][2],'摸到正確物件後，還要口說 '+words[s.stage]+' 才能完成。']};
 }
 const api={words,places,lessons,initial,validate,solved,canSpeak,transition,hint};root.ArtWorkshopChapter=api;if(typeof module!=='undefined')module.exports=api;
 if(!root.document)return;
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;let place='journal',focus=null,english='',session=0;
 function state(){const w=world();w.gameState.realmPuzzles||={};return w.gameState.realmPuzzles.zone20||(w.gameState.realmPuzzles.zone20=initial());}
 function close(){session++;$('realmQuestModal').style.display='none';root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function sync(){const w=world();if(w?.zoneManager.currentZoneId!=='zone20')return;const s=validate(state())||initial();$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.stage===8?'✓ 舞獅彩繪完成':'校慶彩繪工坊任務';}
 function commit(action){if(world()?.zoneManager.currentZoneId!=='zone20')return;const r=transition(state(),action);world().gameState.realmPuzzles.zone20=r.state;sync();world().hintController?.clear();world().adventureProgress?.save(true);render(r.message);root.audioManager?.playSfx(r.state.stage===8?'magicSuccess':'click');}
 function beginSpeech(word){
  const w=world();if(!w||w.zoneManager.currentZoneId!=='zone20'||!canSpeak(state(),word)){render('先在工坊找到 '+(words[state().stage]||'目前工具')+'，再口說完成。');return;}
  const before=JSON.stringify(validate(state())),group=w.activeZoneGroup;close();const own=++session;let used=false;
  w.openSpeechCard(word,()=>{if(used||own!==session||w.zoneManager.currentZoneId!=='zone20'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;commit({type:'speak',word,verifiedWord:word});place='journal';$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();},{requireRecognition:true});
 }
 function button(text,fn){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
 function render(message=''){
  const s=validate(state())||initial(),area=$('realmQuestControls'),n=s.stage,lesson=lessons[n];area.replaceChildren();
  $('realmQuestKicker').textContent='新港國小校園支線 · 校慶舞獅彩繪工坊';$('realmQuestTitle').textContent=lesson?.[0]||'舞獅彩繪作品完成';english=lesson?.[1]||'Our art is ready for the school festival.';$('realmQuestEnglish').textContent=english;
  $('realmQuestBrief').textContent=(lesson?.[2]||hint(s).clues.join(' '))+' 已口說 '+s.stage+' / 8。';$('realmQuestResult').textContent=message;$('realmQuestWin').hidden=s.stage!==8;$('realmQuestNext').textContent='作品完成！沿南側入口返回新港校園，也可到學習大廳自由複習。';
  if(s.stage<8){
   if(s.found===words[s.stage]){const speak=button('口說 '+words[s.stage]+' · 完成此步驟',()=>beginSpeech(words[s.stage]));speak.disabled=!canSpeak(s,words[s.stage]);area.append(speak);}
   else{const p=root.document.createElement('p');p.textContent='目前步驟：'+words[s.stage]+'。請在工坊找到對應的實物。';area.append(p);}
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
