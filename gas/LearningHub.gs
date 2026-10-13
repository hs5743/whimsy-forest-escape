// Additive learning service. Called under the existing doPost script lock.
// One authoritative profile row is committed before Students is reconciled to absolute totals.
// A retry after an interrupted Students update repairs it without granting XP again.
function learningHubAction(payload,ss){
 const id=String(payload.studentId||'');
 if(!/^[0-9]{3,12}$/.test(id))return {status:'error',message:'請先登入學生身分'};
 const studentSheet=ss.getSheetByName('Students');
 if(!studentSheet)return {status:'error',message:'Students sheet missing'};
 const rows=studentSheet.getDataRange().getValues();const index=rows.findIndex((r,i)=>i>0&&String(r[0])===id);
 if(index<1)return {status:'error',message:'Student not registered'};
 const row=rows[index],student={xp:Number(row[5])||0,level:Number(row[6])||1,stars:Number(row[7])||0,completedWords:String(row[8]||'').split(',').filter(Boolean),badgesCount:Number(row[9])||0};
 let sheet=ss.getSheetByName('LearningProfiles');
 if(!sheet){sheet=ss.insertSheet('LearningProfiles');sheet.getRange(1,1,1,26).setValues([['studentId',...Array.from({length:24},(_,i)=>'profileChunk'+(i+1)),'updatedAt']]);sheet.setFrozenRows(1);}
 const records=sheet.getDataRange().getValues();let n=records.findIndex((r,i)=>i>0&&String(r[0])===id);
 let record=n>0?JSON.parse(records[n].slice(1,25).join('')):{learning:LearningRewards.empty(),targetXP:student.xp,words:student.completedWords,hashes:{}};
 // Repair an interrupted prior commit, while preserving legitimate legacy adventure XP.
 student.xp=Math.max(student.xp,record.targetXP);student.completedWords=[...new Set([...student.completedWords,...record.words])];
 if(payload.action==='learningEvent'){
  const raw=payload.event||{},event={id:raw.id,kind:raw.kind,word:LearningRewards.key(raw.word),time:Date.now()};
  if(typeof event.id!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(event.id))throw Error('Invalid event id');
  if(!LEARNING_WORDS.includes(event.word))throw Error('Word outside reference');
  if(event.kind==='sentence'){const sentence=LEARNING_SENTENCES.find(s=>s.id===raw.sentence&&s.word===event.word);if(!sentence)throw Error('Invalid sentence');event.sentence=sentence.id;}
  if(event.kind==='favorite'){if(typeof raw.value!=='boolean')throw Error('Invalid favorite');event.value=raw.value;}
  if(!['word','meaning','sentence','favorite'].includes(event.kind))throw Error('Invalid kind');
  const fingerprint=JSON.stringify([event.kind,event.word,event.sentence||'',event.value===true]);
  if(record.hashes[event.id]&&record.hashes[event.id]!==fingerprint)throw Error('Event id conflict');
  const result=LearningRewards.apply(record.learning,event,student.completedWords);record.learning=result.state;record.hashes[event.id]=fingerprint;
  student.xp+=result.xp;if(event.kind==='word'&&!student.completedWords.includes(event.word))student.completedWords.push(event.word);
  record.targetXP=student.xp;record.words=student.completedWords;
  const json=JSON.stringify(record),chunks=[];for(let i=0;i<json.length;i+=40000)chunks.push(json.slice(i,i+40000));
  if(chunks.length>24)throw Error('Learning history storage limit; local record retained');
  while(chunks.length<24)chunks.push('');if(n<1)n=Math.max(1,records.length);
  sheet.getRange(n+1,1,1,26).setValues([[id,...chunks,new Date()]]);
  SpreadsheetApp.flush(); // Event receipt and target totals become durable before changing Students.
 }
 student.level=student.xp<100?1:Math.floor(Math.pow(student.xp/100,1/1.35))+1;student.stars=student.completedWords.length;student.badgesCount=Math.floor(student.stars/3);
 studentSheet.getRange(index+1,6,1,5).setValues([[student.xp,student.level,student.stars,student.completedWords.join(','),student.badgesCount]]);
 return {status:'success',protocol:'learning-v1',learning:record.learning,student};
}
