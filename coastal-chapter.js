/* Xiangshan wetland chapter: interpret a field clue, then pass fresh oral recognition. */
(function(root){
 'use strict';
 const words=['BEACH','SEA','SCIENCE','DIFFERENT','INTERESTING','IN FRONT OF','LOOK','TRASH'];
 const places=['beach','sea','science','habitats','finding','position','look','trash'];
 const choices=[['','BEACH','RIVER'],['','SEA','LAKE'],['','SCIENCE','MUSIC'],['','DIFFERENT','SAME'],['','INTERESTING','BORING'],['','IN FRONT OF','BEHIND'],['','LOOK','LISTEN'],['','TRASH','BAG']];
 const lessons=[
  ['海灘地景','We walk on the beach.','從架高步道辨認海水與陸地相接的開闊沙泥岸，選 BEACH。'],
  ['認識海面','The sea is calm today.','望向泥灘之外開闊的海面；沿著步道觀察，不踏入棲地，選 SEA。'],
  ['海岸科學','Science helps us learn about nature.','看看野外紀錄桌、圖鑑和觀察工具。用科學方法留下觀察紀錄，選 SCIENCE。'],
  ['比較棲地','The two places look different.','對照乾濕泥灘和淺水池：兩處景觀不一樣，選 DIFFERENT。'],
  ['有趣的發現','It is very interesting.','仔細看看潮池和招潮蟹洞留下的線索；這個發現很有趣，選 INTERESTING。'],
  ['描述方位','The sea is in front of the station.','站在入口觀察站面向海岸，海面就在觀測站前方。選 IN FRONT OF。'],
  ['仔細觀察','Look at the sea.','使用觀景望遠鏡從安全步道仔細觀察，不走進泥灘，也不碰觸生物。'],
  ['整理垃圾','Do not leave trash here.','找到分類回收桶，把垃圾放進桶內；不要留在海岸上。']
 ];
 const initial=()=>({stage:0,spoken:[],choices:Array(8).fill('')});
 function validate(raw){if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((v,i)=>v!==words[i])||!Array.isArray(raw.choices)||raw.choices.length!==8||raw.choices.some((v,i)=>!choices[i].includes(v)))return null;const s={stage:Math.min(raw.stage,raw.spoken.length),spoken:raw.spoken.slice(),choices:raw.choices.slice()};for(let i=0;i<s.stage;i++)if(s.choices[i]!==words[i]){s.stage=i;break;}s.spoken=s.spoken.slice(0,s.stage);return s;}
 const proof=(s,n)=>s.choices[n]===words[n],solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<8&&word===words[s.stage]&&proof(s,s.stage);}
 function transition(raw,action){const s=validate(raw)||initial();let message='先讀取海岸線索，再口說完成目前步驟。';if(s.stage===8)return{state:s,message:'潮間帶觀察完成！你已學會沿步道探索並守護海岸。'};if(action?.type==='choice'&&action.index===s.stage&&choices[s.stage].includes(action.value)){s.choices[s.stage]=action.value;message=proof(s,s.stage)?'線索正確！接著口說 '+words[s.stage]+'。':'再觀察圖卡和現場線索，換一個答案。';}else if(action?.type==='speak'){if(!canSpeak(s,action.word))message='請先完成目前的觀察選擇，再繼續口說。';else if(action.verifiedWord!==action.word)message='請先口說 '+action.word+' 並通過辨識。';else{s.spoken.push(action.word);s.stage++;message=s.stage===8?'Excellent! 海岸觀察紀錄完成。':'口說通過！下一個觀察詞：'+words[s.stage]+'。';}}return{state:s,message};}
 function hint(raw){const s=validate(raw)||initial();return{key:'zone16:'+JSON.stringify(s),word:null,targetId:'coast_'+(places[s.stage]||'exit'),clues:s.stage===8?['潮間帶觀察完成。','沿南側步道返回雲雨氣象觀測台。']:[lessons[s.stage][2],'完成觀察後，還要口說 '+words[s.stage]+'。']};}
 const api={words,places,choices,lessons,initial,validate,solved,canSpeak,transition,hint};root.CoastChapter=api;if(typeof module!=='undefined')module.exports=api;
 if(!root.document)return;
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;let place='journal',focus=null,english='',session=0;
 function state(){const w=world();w.gameState.realmPuzzles||={};return w.gameState.realmPuzzles.zone16||(w.gameState.realmPuzzles.zone16=initial());}
 function close(){session++;$('realmQuestModal').style.display='none';root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function sync(){const w=world();if(w?.zoneManager.currentZoneId!=='zone16')return;const s=validate(state())||initial();$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.stage===8?'✓ 海岸觀察完成':'潮間帶觀察任務';}
 function commit(action){if(world()?.zoneManager.currentZoneId!=='zone16')return;const r=transition(state(),action);world().gameState.realmPuzzles.zone16=r.state;sync();world().hintController?.clear();world().adventureProgress?.save(true);render(r.message);}
 function beginSpeech(word){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone16'||!canSpeak(state(),word))return;const before=JSON.stringify(validate(state())),group=w.activeZoneGroup,back=place;close();const own=++session;let used=false;w.openSpeechCard(word,()=>{if(used||own!==session||w.zoneManager.currentZoneId!=='zone16'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;commit({type:'speak',word,verifiedWord:word});open(back);},{requireRecognition:true});}
 function button(text,fn){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
 function render(message=''){const s=validate(state())||initial(),area=$('realmQuestControls'),n=places.indexOf(place),lesson=lessons[n];area.replaceChildren();$('realmQuestKicker').textContent='雲雨氣象觀測台支線 · 香山潮間帶';$('realmQuestTitle').textContent=lesson?.[0]||'香山潮間帶：沿步道觀察海岸';english=lesson?.[1]||'Walk and look. Keep the coast clean.';$('realmQuestEnglish').textContent=english;$('realmQuestBrief').textContent=(lesson?.[2]||hint(s).clues.join(' '))+' 口說完成 '+s.stage+' / 8。';$('realmQuestResult').textContent=message;$('realmQuestWin').hidden=s.stage!==8;$('realmQuestNext').textContent='潮間帶觀察完成！沿南側步道返回雲雨氣象觀測台。';if(n===s.stage){choices[n].slice(1).forEach(value=>{const b=button(value,()=>commit({type:'choice',index:n,value}));b.setAttribute('aria-pressed',String(s.choices[n]===value));area.append(b);});const speak=button('口說 '+words[n]+' · 完成此步驟',()=>beginSpeech(words[n]));speak.disabled=!canSpeak(s,words[n]);area.append(speak);}else if(n>=0){const p=root.document.createElement('p');p.textContent=n<s.stage?'✓ '+words[n]+' 已完成。':'先完成 '+words[s.stage]+'，再來探索這一站。';area.append(p);if(n<s.stage)area.append(button('再聽 '+words[n],()=>root.speechManager?.playSentenceVoice(words[n])));}area.append(button(s.stage===8?'查看返程出口':'查看目前任務',()=>{place=s.stage===8?'journal':places[s.stage];render();}));if(place==='journal'||s.stage===8)area.append(button('返回雲雨氣象觀測台',()=>{close();if(world().zoneManager.switchZone('zone15'))world().adventureProgress?.save(true);}));}
 function open(p='journal'){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone16'||w.isAnyModalOpen())return;place=p;focus=root.document.activeElement;render();$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();}
 Object.assign(api,{open,close,sync,beginSpeech,listen:()=>root.speechManager?.playSentenceVoice(english)});
 root.addEventListener('load',()=>{for(const id of ['realmQuestClose','realmQuestExplore'])$(id).addEventListener('click',()=>{if(world()?.zoneManager.currentZoneId==='zone16')close();});});
})(typeof window!=='undefined'?window:globalThis);
