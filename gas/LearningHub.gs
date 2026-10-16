// Hall and adventure writes share the same durable record under Code.gs's ScriptLock.
function learningHubAction(payload,ss){
 const store=studentRecordLoad(ss,String(payload.studentId||''));if(store.error)return {status:'error',message:store.error};
 const record=store.record,student=store.student;
 if(payload.action==='learningEvent'){
  const raw=payload.event||{},event={id:raw.id,kind:raw.kind,word:LearningRewards.key(raw.word),time:Date.now()};
  if(typeof event.id!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(event.id))throw Error('Invalid event id');
  if(!LEARNING_WORDS.includes(event.word))throw Error('Word outside reference');
  if(event.kind==='sentence'){const sentence=LEARNING_SENTENCES.find(s=>s.id===raw.sentence&&s.word===event.word);if(!sentence)throw Error('Invalid sentence');event.sentence=sentence.id;}
  if(event.kind==='favorite'){if(typeof raw.value!=='boolean')throw Error('Invalid favorite');event.value=raw.value;}
  if(!['word','meaning','sentence','favorite'].includes(event.kind))throw Error('Invalid kind');
  const fingerprint=JSON.stringify([event.kind,event.word,event.sentence||'',event.value===true]);
  if(Object.prototype.hasOwnProperty.call(record.hashes,event.id)&&record.hashes[event.id]!==fingerprint)throw Error('Event id conflict');
  const result=LearningRewards.apply(record.learning,event,student.completedWords);record.learning=result.state;
  Object.defineProperty(record.hashes,event.id,{enumerable:true,configurable:true,writable:true,value:fingerprint});
  student.xp+=result.xp;if(event.kind==='word'&&!student.completedWords.includes(event.word))student.completedWords.push(event.word);
  studentRecordSave(store);
 }
 studentRecordFinish(store);
 return {status:'success',protocol:'learning-v1',learning:record.learning,student:student};
}
