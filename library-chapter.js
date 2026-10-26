/* Xin-gang library branch: follow the reading clue, then pass fresh oral recognition. */
(function(root){
 'use strict';
 const words=['SHELF','STORY','STUDENT','TEACHER','STUDY','QUIET','BORING','EXCITING'];
 const places=['shelf','story','student','teacher','study','quiet','boring','exciting'];
 const choices=[['','SHELF','TABLE'],['','STORY','PICTURE'],['','STUDENT','TEACHER'],['','TEACHER','STUDENT'],['','STUDY','PLAY'],['','QUIET','LOUD'],['','BORING','EXCITING'],['','EXCITING','BORING']];
 const lessons=[
  ['階梯書架','The books are on the shelf.','沿著橘色階梯側邊的書架找一排故事書；放書的層架是 SHELF。'],
  ['故事封面','This is an exciting story.','看看故事展示架上的封面圖卡。封面引出一個 STORY。'],
  ['閱讀座位','Students read here.','觀察橘色與綠色閱讀座位和旁邊的書架，選出在這裡閱讀的 STUDENT；本關沒有學生 NPC。'],
  ['服務櫃台','This is the teacher’s desk.','觀察圖書館服務桌與教學用品，選 TEACHER；這裡是靜態展示，沒有老師 NPC 對話。'],
  ['共讀桌','We study together.','木桌旁有座位與閱讀材料；學生在這裡一起 STUDY。'],
  ['安靜閱讀角','Please be quiet.','進入靠窗閱讀角時放輕聲音，保持 QUIET。'],
  ['故事心情卡','This story is boring.','比較兩張讀後心情卡，選出令人覺得無聊的故事，再口說 BORING。'],
  ['精彩結局','The ending is exciting!','最後一頁翻開彩色結局插圖；令人期待、精彩的是 EXCITING。']
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
  const s=validate(raw)||initial();let message='先觀察圖書館線索，再口說完成目前步驟。';
  if(s.stage===8)return{state:s,message:'圖書館閱讀任務完成！你已找到故事，也學會在閱讀空間互相照顧。'};
  if(action?.type==='choice'&&action.index===s.stage&&choices[s.stage].includes(action.value)){
   s.choices[s.stage]=action.value;message=proof(s,s.stage)?'線索正確！接著口說 '+words[s.stage]+'。':'再看看書架、座位和故事圖卡，換一個答案。';
  }else if(action?.type==='speak'){
   if(!canSpeak(s,action.word))message='請先完成目前的圖書館線索，再繼續口說。';
   else if(action.verifiedWord!==action.word)message='請先口說 '+action.word+' 並通過辨識。';
   else{s.spoken.push(action.word);s.stage++;message=s.stage===8?'Excellent! 圖書館閱讀任務完成。':'口說通過！下一個閱讀線索：'+words[s.stage]+'。';}
  }
  return{state:s,message};
 }
 function hint(raw){const s=validate(raw)||initial();return{key:'zone17:'+JSON.stringify(s),word:null,targetId:'library_'+(places[s.stage]||'exit'),clues:s.stage===8?['圖書館閱讀任務已完成。','沿入口樓梯回到新港國小校園。']:[lessons[s.stage][2],'完成線索後，還要口說 '+words[s.stage]+'。']};}
 const api={words,places,choices,lessons,initial,validate,solved,canSpeak,transition,hint};root.LibraryChapter=api;if(typeof module!=='undefined')module.exports=api;
 if(!root.document)return;
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;let place='journal',focus=null,english='',session=0;
 function state(){const w=world();w.gameState.realmPuzzles||={};return w.gameState.realmPuzzles.zone17||(w.gameState.realmPuzzles.zone17=initial());}
 function close(){session++;$('realmQuestModal').style.display='none';root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function sync(){const w=world();if(w?.zoneManager.currentZoneId!=='zone17')return;const s=validate(state())||initial();$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.stage===8?'✓ 圖書館任務完成':'圖書館閱讀任務';}
 function commit(action){if(world()?.zoneManager.currentZoneId!=='zone17')return;const r=transition(state(),action);world().gameState.realmPuzzles.zone17=r.state;sync();world().hintController?.clear();world().adventureProgress?.save(true);render(r.message);}
 function beginSpeech(word){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone17'||!canSpeak(state(),word))return;const before=JSON.stringify(validate(state())),group=w.activeZoneGroup,back=place;close();const own=++session;let used=false;w.openSpeechCard(word,()=>{if(used||own!==session||w.zoneManager.currentZoneId!=='zone17'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;commit({type:'speak',word,verifiedWord:word});open(back);},{requireRecognition:true});}
 function button(text,fn){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
 function render(message=''){
  const s=validate(state())||initial(),area=$('realmQuestControls'),n=places.indexOf(place),lesson=lessons[n];area.replaceChildren();$('realmQuestKicker').textContent='新港國小校園支線 · 二樓圖書館';$('realmQuestTitle').textContent=lesson?.[0]||'二樓圖書館：找到故事的線索';english=lesson?.[1]||'Choose a book and enjoy the story.';$('realmQuestEnglish').textContent=english;$('realmQuestBrief').textContent=(lesson?.[2]||hint(s).clues.join(' '))+' 口說完成 '+s.stage+' / 8。';$('realmQuestResult').textContent=message;$('realmQuestWin').hidden=s.stage!==8;$('realmQuestNext').textContent='圖書館任務完成！沿入口樓梯回新港國小校園。';
  if(n===s.stage){choices[n].slice(1).forEach(value=>{const b=button(value,()=>commit({type:'choice',index:n,value}));b.setAttribute('aria-pressed',String(s.choices[n]===value));area.append(b);});const speak=button('口說 '+words[n]+' · 完成此步驟',()=>beginSpeech(words[n]));speak.disabled=!canSpeak(s,words[n]);area.append(speak);}
  else if(n>=0){const p=root.document.createElement('p');p.textContent=n<s.stage?'✓ '+words[n]+' 已完成。':'先完成 '+words[s.stage]+'，再來探索這一站。';area.append(p);if(n<s.stage)area.append(button('再聽 '+words[n],()=>root.speechManager?.playSentenceVoice(words[n])));}
  area.append(button(s.stage===8?'查看返程樓梯':'查看目前任務',()=>{place=s.stage===8?'journal':places[s.stage];render();}));
  if(place==='journal'||s.stage===8)area.append(button('返回新港國小校園',()=>{close();if(world().zoneManager.switchZone('zone12'))world().adventureProgress?.save(true);}));
 }
 function open(p='journal'){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone17'||w.isAnyModalOpen())return;place=p;focus=root.document.activeElement;render();$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();}
 Object.assign(api,{open,close,sync,beginSpeech,listen:()=>root.speechManager?.playSentenceVoice(english)});
 root.addEventListener('load',()=>{for(const id of ['realmQuestClose','realmQuestExplore'])$(id).addEventListener('click',()=>{if(world()?.zoneManager.currentZoneId==='zone17')close();});});
})(typeof window!=='undefined'?window:globalThis);
