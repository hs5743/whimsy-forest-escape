/* C-solo 12-hole chromatic harmonica learning adventure. */
(function(root){
 'use strict';
 const words=['SMALL','MOUTH','HAND','LEFT','RIGHT','HIGH','PLAY','SONG'];
 const blow=[60,64,67,72,72,76,79,84,84,88,91,96],draw=[62,65,69,71,74,77,81,83,86,89,93,95];
 const melody=[{hole:1,air:'BLOW',slide:false},{hole:1,air:'DRAW',slide:false},{hole:2,air:'BLOW',slide:false},{hole:2,air:'DRAW',slide:false},{hole:3,air:'BLOW',slide:false}];
 const allowed=[['','SLIDE','DIATONIC','RECORDER'],['','MOUTHPIECE','COVER','BUTTON'],['','HAND','HEAD','FOOT','REED','COVER','VALVE'],['','LEFT','RIGHT'],['','LEFT','RIGHT'],['','HALF','OCTAVE','VOLUME']];
 const correct=['SLIDE','MOUTHPIECE','HAND','LEFT','RIGHT','HALF'],experiments=['BLOW:0','DRAW:0','BLOW:1','DRAW:1'];
 const initial=()=>({stage:0,spoken:[],choices:['','','','','',''],explored:[],melody:[]});
 const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 function note(hole,air,slide){if(!Number.isInteger(hole)||hole<1||hole>12||!['BLOW','DRAW'].includes(air)||typeof slide!=='boolean')return null;if(hole===12&&air==='DRAW'&&slide)return 98;return (air==='BLOW'?blow:draw)[hole-1]+(slide?1:0);}
 function noteName(midi){return typeof midi==='number'&&Number.isInteger(midi)?['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][((midi%12)+12)%12]+(Math.floor(midi/12)-1):'';}
 function proof(s,n){return n<6?s.choices[n]===correct[n]&&(n!==5||s.explored.length===4):n===6?s.melody.length===5:true;}
 function validate(raw){
  if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((w,i)=>w!==words[i])||!Array.isArray(raw.choices)||raw.choices.length!==6||raw.choices.some((v,i)=>!allowed[i].includes(v))||!Array.isArray(raw.explored)||raw.explored.length>4||new Set(raw.explored).size!==raw.explored.length||raw.explored.some(x=>!experiments.includes(x))||!Array.isArray(raw.melody)||raw.melody.length>5||raw.melody.some((v,i)=>!eq(v,melody[i])))return null;
  const choices=[...raw.choices];if(choices[2]==='REED')choices[2]='HAND';
  const s={stage:Math.min(raw.stage,raw.spoken.length),spoken:[...raw.spoken],choices,explored:[...raw.explored],melody:raw.melody.map(v=>({...v}))};
  for(let n=0;n<s.stage;n++)if(!proof(s,n)){s.stage=n;break;}s.spoken=s.spoken.slice(0,s.stage);return s;
 }
 const solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<8&&typeof word==='string'&&word===words[s.stage]&&proof(s,s.stage);}
 function transition(raw,a){
  const s=validate(raw)||initial();let message='先探索展品，再口說完成這一步。';
  if(s.stage===8)return {state:s,message:'展演完成！可返回新港校園。'};
  if(a?.type==='choice'&&s.stage<6&&a.index===s.stage&&allowed[s.stage].includes(a.value)&&a.value!==''){s.choices[s.stage]=a.value;message=a.value===correct[s.stage]?'線索正確，接著口說 '+words[s.stage]+'。':'再觀察展品與說明，試另一個答案。';}
  else if(a?.type==='note'&&note(a.hole,a.air,a.slide)!==null){
   if(s.stage===5&&a.hole===1){const key=a.air+':'+Number(a.slide);if(!s.explored.includes(key))s.explored.push(key);message='第 1 孔：'+noteName(note(a.hole,a.air,a.slide))+'。比較吹／吸與滑鍵放開／按下，共 '+s.explored.length+' / 4 種。';}
   else if(s.stage===5)message='這一步先用第 1 孔比較 C、D、C♯、D♯ 四種音。';
   else if(s.stage===6){const value={hole:a.hole,air:a.air,slide:a.slide};if(s.melody.length===5)message='五音練習已完成，口說 PLAY。';else if(eq(value,melody[s.melody.length])){s.melody.push(value);message=s.melody.length===5?'C D E F G 完成！口說 PLAY。':'正確！下一音：'+noteName(note(melody[s.melody.length].hole,melody[s.melody.length].air,false))+'。';}else{s.melody=[];message='重新從 C 開始。放開滑鍵：1 吹、1 吸、2 吹、2 吸、3 吹。';}}
   else message='示範音：'+noteName(note(a.hole,a.air,a.slide))+'。可以自由試奏，任務依口說順序進行。';
  }else if(a?.type==='reset'&&s.stage===6){s.melody=[];message='從 C 重新練習，口說進度保留。';}
  else if(a?.type==='speak'){if(!canSpeak(s,a.word))message='先完成展品線索與前一個口說步驟。';else if(a.verifiedWord!==a.word)message='請口說 '+a.word+' 並通過辨識。';else{s.spoken.push(a.word);s.stage++;message=s.stage===8?'口琴小小展演完成！':'口說通過！下一步：'+words[s.stage]+'。';}}
  return {state:s,message};
 }
 const places=['small','mouth','hand','left','right','high','play','song'];
 const clues=[
 ['在入口選出有側邊滑鍵的半音階口琴，再口說 SMALL。','它體積小，卻能演奏半音；常見 12 孔款有 48 片簧片。'],
 ['找出嘴巴接觸與氣流進出的吹嘴，再口說 MOUTH。','吹嘴孔通往琴格與簧片，不是側邊滑鍵。'],
 ['觀察握琴姿勢圖示，選出演奏者用來握住口琴的 HAND，再口說 HAND。','口琴由雙手持握；內部的金屬簧片受氣流振動發聲。圖示說明姿勢，遊戲不偵測手部動作。'],
 ['從演奏者視角找較低音的左側，再口說 LEFT。','此館採常見 C 調獨奏排列：左低、右高。'],
 ['找出較高音的右側，再口說 RIGHT。','吹嘴朝向自己，滑鍵按鈕在右手側。'],
 ['在變音台試第 1 孔四種吹吸／滑鍵組合，選按鍵變化，再口說 HIGH。','C→C♯、D→D♯：滑鍵切換另一組簧片，升高半音。'],
 ['在練習台依序奏 C D E F G，再口說 PLAY。','放開滑鍵：1 吹、1 吸、2 吹、2 吸、3 吹；按示範可重聽。'],
 ['到小舞台口說 SONG，完成展演。','已能辨識外形、結構、方向與滑鍵，帶著五個音回校園分享。'],
 ['口琴展示館任務完成！','由南側入口回新港國小。']
 ];
 function hint(raw){const s=validate(raw)||initial();return {key:'zone13:'+JSON.stringify(s),word:null,targetId:'harmonica_'+(places[s.stage]||'exit'),clues:clues[s.stage]};}
 const api={words,initial,validate,solved,transition,hint,canSpeak,note,noteName,melody};root.HarmonicaChapter=api;if(typeof module!=='undefined')module.exports=api;
  if(!root.document)return;
 const $=id=>root.document.getElementById(id),world=()=>root.world3D;
 let place='journal',english='',focus=null,hole=1,slide=false,lastAir='BLOW';const tones=new Set();
 function state(){return world().gameState.realmPuzzles.zone13||(world().gameState.realmPuzzles.zone13=initial());}
 function stopTones(){for(const t of [...tones]){try{t.source.stop();}catch(e){}t.source.disconnect();t.filter.disconnect();t.gain.disconnect();tones.delete(t);}}
 function tone(midi){const w=world();if(w?.zoneManager.currentZoneId!=='zone13'||!Number.isInteger(midi)||midi<48||midi>108)return;stopTones();api.demoUntil=Date.now()+550;const audio=root.audioManager;audio?.init?.();const ctx=audio?.ctx;if(!ctx||!audio.sfxGain)return;
  const source=ctx.createOscillator(),filter=ctx.createBiquadFilter(),gain=ctx.createGain(),t=ctx.currentTime;source.type='sawtooth';source.frequency.setValueAtTime(440*Math.pow(2,(midi-69)/12),t);filter.type='lowpass';filter.frequency.value=1800;gain.gain.setValueAtTime(.001,t);gain.gain.linearRampToValueAtTime(.13,t+.035);gain.gain.setValueAtTime(.11,t+.34);gain.gain.exponentialRampToValueAtTime(.001,t+.5);source.connect(filter);filter.connect(gain);gain.connect(audio.sfxGain);const entry={source,filter,gain};tones.add(entry);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();tones.delete(entry);};source.start(t);source.stop(t+.52);
 }
 function close(){$('realmQuestModal').style.display='none';stopTones();root.speechManager?.stopVoice();if(focus?.isConnected)focus.focus({preventScroll:true});}
 function sync(){const w=world();if(w?.zoneManager.currentZoneId!=='zone13')return;const s=validate(state())||initial();$('realmQuestBtn').hidden=false;$('realmQuestBtn').textContent=s.stage===8?'✓ 口琴展演完成':'口琴展示館任務';if(w.harmonicaRefs){w.harmonicaRefs.banner.visible=s.stage===8;w.harmonicaRefs.slide.position.x=slide?w.harmonicaRefs.restX-.18:w.harmonicaRefs.restX;w.harmonicaRefs.reed.material.emissive.setHex(lastAir==='BLOW'?0x14605d:0x633021);}}
 function commit(a){const w=world();if(w?.zoneManager.currentZoneId!=='zone13')return;const r=transition(state(),a);w.gameState.realmPuzzles.zone13=r.state;sync();w.hintController?.clear();w.adventureProgress?.save(true);render(r.message);}
 function beginSpeech(word){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone13')return;if(!canSpeak(state(),word)){render('先完成展品線索。');return;}const before=JSON.stringify(validate(state())),group=w.activeZoneGroup,back=place;let used=false;close();w.openSpeechCard(word,()=>{if(used||w.zoneManager.currentZoneId!=='zone13'||w.activeZoneGroup!==group||JSON.stringify(validate(state()))!==before)return;used=true;commit({type:'speak',word,verifiedWord:word});open(back);},{requireRecognition:true});}
 function button(text,fn){const b=root.document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
 const info=[
 ['01 · 掌心裡的樂器','This is a small harmonica.','常見半音階口琴有金屬琴蓋、排列整齊的吹嘴孔，與側邊滑鍵按鈕。本館的放大模型是 12 孔 C 調口琴。'],
 ['02 · 吹嘴與氣流','Put the harmonica near your mouth.','吹氣與吸氣都能演奏。嘴唇放鬆包住吹嘴，保持自然呼吸；單音練習一次選一孔。這裡用按鈕模擬吹吸，不偵測真實呼吸。'],
 ['03 · 簧片的祕密','Hold it gently in your hand.','看分層模型：琴蓋、簧板與簧片、琴格、吹嘴與滑鍵。氣流讓金屬簧片振動發聲；音閥不是簧片。用手握琴身，勿碰細薄簧片。'],
 ['04 · 低音方向','The lower notes are on the left.','從演奏者視角看吹嘴：左側是較低音，右側是較高音。孔位編號由左往右 1 到 12。此說明適用於本館的常見獨奏排列。'],
 ['05 · 高音方向','The higher notes are on the right.','右手可操作側邊按鈕；姿勢放鬆，避免用力吹吸。身體坐直或站直，先練習穩定單音。'],
 ['06 · 滑鍵變音實驗','Press the slide for a higher note.','第 1 孔放開滑鍵：吹 C4、吸 D4；按下滑鍵：吹 C♯4、吸 D♯4。滑鍵切換氣道與另一組簧片，不是把同一片簧片壓彎。先試四種組合。最高第 12 孔吸音另有特殊排列：B6→D7。'],
 ['07 · 我的五音練習','Play five notes.','放開滑鍵，奏出 C4 D4 E4 F4 G4：第 1 孔吹、第 1 孔吸、第 2 孔吹、第 2 孔吸、第 3 孔吹。聲音為合成示範，協助辨認音高與吹吸順序。'],
 ['08 · 小小展演','This is our song.','將探索成果化成一段五音旋律。口說 SONG，讓小舞台亮起，完成展示館任務。演奏前後保持吹嘴清潔，個人口琴不共用。']
 ];
 function instrument(area,s){
  const p=root.document.createElement('p');p.className='harmonica-note-readout';p.textContent='第 '+hole+' 孔 · 滑鍵'+(slide?'按下':'放開')+(hole===12?' · 最高孔特殊音位':'')+' · 吹 '+noteName(note(hole,'BLOW',slide))+' / 吸 '+noteName(note(hole,'DRAW',slide));area.append(p);
  const holes=root.document.createElement('div');holes.className='harmonica-hole-grid';for(let n=1;n<=12;n++){const b=button(String(n),()=>{hole=n;sync();render();});b.setAttribute('aria-label','選第 '+n+' 孔');b.setAttribute('aria-pressed',String(n===hole));holes.append(b);}area.append(holes);
  const toggle=button(slide?'放開滑鍵':'按下滑鍵 · 比較音高',()=>{slide=!slide;sync();render();});toggle.setAttribute('aria-pressed',String(slide));area.append(toggle);
  for(const air of ['BLOW','DRAW'])area.append(button(air==='BLOW'?'吹氣 · BLOW':'吸氣 · DRAW',()=>{lastAir=air;tone(note(hole,air,slide));commit({type:'note',hole,air,slide});}));
  if(place==='high'){const p=root.document.createElement('p');p.textContent=s.stage===5?'第 1 孔比較：'+s.explored.length+' / 4 種已試奏':'可先自由試奏；完成前五個口說任務後，開始記錄四種組合。';area.append(p);}
  if(place==='play'){area.append(button('聽五音示範 C D E F G',()=>{for(const [i,m]of melody.entries())world().scheduleZoneAction(()=>tone(note(m.hole,m.air,m.slide)),i*650);}));area.append(button('重新練習',()=>commit({type:'reset'})));const p=root.document.createElement('p');p.textContent=(s.stage<6?'可先試奏；完成前六個口說任務後開始練習。 ':'')+'目前五音：'+s.melody.map(m=>noteName(note(m.hole,m.air,m.slide))).join(' → ')+'（'+s.melody.length+' / 5）';area.append(p);}
 }
 function render(message=''){
  const s=validate(state())||initial(),area=$('realmQuestControls'),n=places.indexOf(place),i=info[n];area.replaceChildren();$('realmQuestKicker').textContent='新港校園音樂翼 · 半音階口琴展示館';$('realmQuestTitle').textContent=i?.[0]||'半音階口琴：掌心裡的音樂祕境';english=i?.[1]||'Play a song on the harmonica.';$('realmQuestEnglish').textContent=english;$('realmQuestBrief').textContent=(i?.[2]||hint(s).clues.join(' '))+' 口說完成 '+s.stage+' / 8。';$('realmQuestResult').textContent=message;$('realmQuestWin').hidden=s.stage!==8;$('realmQuestNext').textContent='展演完成！可由南側入口回到新港校園，繼續冒險。';
  if(n>=0&&s.stage<8){if(s.spoken.includes(words[n])){const p=root.document.createElement('p');p.textContent='✓ '+words[n]+' 已口說通過。下一步：'+words[s.stage]+'。';area.append(p);}else{const b=button('口說 '+words[n]+' · 完成此步驟',()=>beginSpeech(words[n]));b.disabled=!canSpeak(s,words[n]);area.append(b);}}
  const answers=[['有側邊滑鍵的口琴','十孔藍調口琴','直笛'],['吹嘴與吹嘴孔','外面的琴蓋','側邊按鈕'],['金屬簧片','琴蓋','塑膠音閥'],['左側較低音','右側較低音'],['左側較高音','右側較高音'],['切換簧片，升高半音','升高一個八度','只會增加音量']];
  if(n<6&&n===s.stage)for(let j=1;j<allowed[n].length;j++){const value=allowed[n][j],b=button(answers[n][j-1],()=>commit({type:'choice',index:n,value}));b.setAttribute('aria-pressed',String(s.choices[n]===value));area.append(b);}
  if(place==='high'||place==='play')instrument(area,s);
  if(place==='journal'){const p=root.document.createElement('p');p.textContent='已口說：'+(s.spoken.join(' → ')||'尚未開始');area.append(p);area.append(button('返回新港國小',()=>{close();if(world().zoneManager.switchZone('zone12'))world().adventureProgress?.save(true);}));}
 }
 function open(p='journal'){const w=world();if(!w||w.zoneManager.currentZoneId!=='zone13'||w.isAnyModalOpen())return;place=p;focus=root.document.activeElement;render();$('realmQuestModal').style.display='flex';root.touchControls?.reset();w.targetFocus?.select(null);$('realmQuestClose').focus();}
 Object.assign(api,{open,sync,beginSpeech,playTone:tone,stopTones,listen:()=>root.speechManager?.playSentenceVoice(english)});
 root.addEventListener('load',()=>{for(const id of ['realmQuestClose','realmQuestExplore'])$(id).addEventListener('click',()=>{if(world()?.zoneManager.currentZoneId==='zone13')close();});});
})(typeof window!=='undefined'?window:globalThis);
