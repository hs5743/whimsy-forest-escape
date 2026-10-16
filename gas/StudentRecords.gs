/* Adventure passes and the hall share a durable LearningProfiles record.
 * Callers hold Code.gs's ScriptLock. Students and Logs are repairable projections.
 */
function studentRecordLoad(ss,id){
 if(!/^[0-9]{3,12}$/.test(id))return {error:'請先登入學生身分'};
 var students=ss.getSheetByName('Students');if(!students)return {error:'Students sheet missing'};
 var rows=students.getDataRange().getValues(),index=rows.findIndex(function(r,i){return i>0&&String(r[0])===id;});
 if(index<1)return {error:'Student not registered'};
 var row=rows[index],words=String(row[8]||'').split(',').filter(Boolean),sheet=ss.getSheetByName('LearningProfiles');
 if(!sheet){sheet=ss.insertSheet('LearningProfiles');sheet.getRange(1,1,1,26).setValues([['studentId'].concat(Array.from({length:24},function(_,i){return 'profileChunk'+(i+1);}),['updatedAt'])]);sheet.setFrozenRows(1);}
 var records=sheet.getDataRange().getValues(),n=records.findIndex(function(r,i){return i>0&&String(r[0])===id;});
 var record=n>0?JSON.parse(records[n].slice(1,25).join('')):{learning:LearningRewards.empty(),targetXP:Number(row[5])||0,words:words,hashes:{}};
 if(!record.learning||!Array.isArray(record.words)||!Number.isFinite(record.targetXP)||!record.hashes)throw Error('Learning profile needs recovery; original data retained');
 record.passReceipts=record.passReceipts||{};
 var priorAccess=Number(record.accessLevel)||Number(row[6])||1;
 var student={accessLevel:Math.max(priorAccess,Number(row[6])||1),xp:Math.max(Number(row[5])||0,record.targetXP),completedWords:Array.from(new Set(words.concat(record.words)))};
 return {needsSave:n<1||!record.accessLevel,id:id,ss:ss,students:students,studentIndex:index,row:row,sheet:sheet,recordIndex:n>0?n:Math.max(1,records.length),record:record,student:student};
}
function studentRecordSave(store){
 store.record.targetXP=store.student.xp;store.record.words=store.student.completedWords.slice();
 store.student.accessLevel=Math.max(store.student.accessLevel||1,store.student.xp<100?1:Math.floor(Math.pow(store.student.xp/100,1/1.35))+1);store.record.accessLevel=store.student.accessLevel;
 var json=JSON.stringify(store.record),chunks=[];for(var i=0;i<json.length;i+=40000)chunks.push(json.slice(i,i+40000));
 if(chunks.length>24)throw Error('Learning history storage limit; local event retained');
 while(chunks.length<24)chunks.push('');
 store.sheet.getRange(store.recordIndex+1,1,1,26).setValues([[store.id].concat(chunks,[new Date()])]);SpreadsheetApp.flush();store.needsSave=false;
}
function studentRecordLogExists(sheet,id,studentId){
 if(typeof sheet.getLastRow==='function'&&sheet.getLastRow()>1){var range=sheet.getRange(2,12,sheet.getLastRow()-1,1);if(typeof range.createTextFinder==='function')return range.createTextFinder(id).matchEntireCell(true).findAll().some(function(hit){return String(sheet.getRange(hit.getRow(),2,1,1).getValues()[0][0])===studentId;});}
 return sheet.getDataRange().getValues().some(function(r,i){return i>0&&String(r[11]||'')===id&&String(r[1])===studentId;});
}
function studentRecordFinish(store){
 if(store.needsSave){studentRecordSave(store);store.needsSave=false;}
 var s=store.student;s.level=s.xp<100?1:Math.floor(Math.pow(s.xp/100,1/1.35))+1;s.accessLevel=Math.max(s.accessLevel||1,s.level);s.stars=s.completedWords.length;s.badgesCount=Math.floor(s.stars/3);
 store.students.getRange(store.studentIndex+1,6,1,6).setValues([[s.xp,s.level,s.stars,s.completedWords.join(','),s.badgesCount,new Date()]]);SpreadsheetApp.flush();
 var pending=Object.keys(store.record.passReceipts).filter(function(id){return !store.record.passReceipts[id].logged;});if(!pending.length)return;
 var logs=store.ss.getSheetByName('Passport_Logs');
 if(!logs){logs=store.ss.insertSheet('Passport_Logs');logs.appendRow(['時間戳記','學號','年級','班級','座號','姓名','關卡空間','挑戰單字','獲得XP','是否教師跳過','用戶代理','eventId']);}
 logs.getRange(1,12,1,1).setValues([['eventId']]);
 pending.forEach(function(id){var receipt=store.record.passReceipts[id];if(!studentRecordLogExists(logs,id,store.id)){var entry=receipt.log.slice();entry[0]=new Date(entry[0]);logs.appendRow(entry);SpreadsheetApp.flush();}receipt.logged=true;delete receipt.log;});
 studentRecordSave(store);
}
function recordPassAction(payload,ss){
 var id=String(payload.studentId||''),eventId=String(payload.eventId||''),word=String(payload.word||'').trim().toUpperCase(),xp=payload.xp===undefined?50:Number(payload.xp);
 if(!/^[a-zA-Z0-9_-]{8,100}$/.test(eventId))return {status:'error',code:'upgrade_required',message:'請更新遊戲頁面，學習紀錄保留在原裝置'};
 if(!/^[A-Z][A-Z0-9 _'-]{0,34}$/.test(word)||!Number.isFinite(xp)||xp<0||xp>300)return {status:'error',message:'Invalid word or XP payload'};
 var companion=String(payload.companionWord||'').trim().toUpperCase();
 if(companion&&!/^[A-Z][A-Z0-9 _'-]{0,34}$/.test(companion))return {status:'error',message:'Invalid companion word'};
 var store=studentRecordLoad(ss,id);if(store.error)return {status:'error',message:store.error};
 var teacher=payload.isTeacherPass===true,zone=String(payload.zone||'zone1').slice(0,200),fingerprint=JSON.stringify([word,xp,teacher,zone,companion]);
 var exists=Object.prototype.hasOwnProperty.call(store.record.passReceipts,eventId);
 if(exists&&store.record.passReceipts[eventId].fingerprint!==fingerprint)return {status:'error',message:'EventId conflict'};
 var first=!store.student.completedWords.includes(word);
 if(!exists){
  store.student.xp+=xp;if(first)store.student.completedWords.push(word);if(companion&&!store.student.completedWords.includes(companion))store.student.completedWords.push(companion);var r=store.row;
  Object.defineProperty(store.record.passReceipts,eventId,{enumerable:true,configurable:true,writable:true,value:{fingerprint:fingerprint,logged:false,log:[new Date().toISOString(),id,String(r[1]),String(r[2]),String(r[3]),String(r[4]),zone,word,xp,teacher?'YES':'NO',String(payload.ua||'').slice(0,200),eventId]}});
  studentRecordSave(store);
 }
 studentRecordFinish(store);
 return {status:'success',protocol:'record-v2',eventId:eventId,replayed:exists,isFirstTime:!exists&&first,updatedProfile:store.student};
}
