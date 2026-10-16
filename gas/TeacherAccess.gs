/* Teacher maintenance authorization is server-side. Never embed a default password in the game. */
function teacherDigest(text){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8).map(function(b){return ((b+256)%256).toString(16).padStart(2,'0');}).join('');}
function configureTeacherAccess(){
 var ui=SpreadsheetApp.getUi(),answer=ui.prompt('設定教師維護密碼','請輸入至少 12 個字元的新密碼；僅儲存加鹽雜湊。',ui.ButtonSet.OK_CANCEL);
 if(answer.getSelectedButton()!==ui.Button.OK)return;
 var pass=answer.getResponseText();if(pass.length<12||pass.length>200)throw Error('密碼需為 12～200 個字元');
 var salt=Utilities.getUuid(),props=PropertiesService.getScriptProperties();
 props.setProperties({WHIMSY_TEACHER_SALT:salt,WHIMSY_TEACHER_HASH:teacherDigest(salt+':'+pass)});
 ui.alert('已設定。原有教師工作階段已失效，請重新驗證。');
}
function teacherAuthenticate(payload){
 var props=PropertiesService.getScriptProperties(),salt=props.getProperty('WHIMSY_TEACHER_SALT'),expected=props.getProperty('WHIMSY_TEACHER_HASH');
 if(!salt||!expected)return {status:'error',code:'teacher_not_configured',message:'請老師先在後台執行 configureTeacherAccess 設定維護密碼'};
 var cache=CacheService.getScriptCache(),attempts=Number(cache.get('whimsy_teacher_attempts')||0);
 if(attempts>=5)return {status:'error',message:'嘗試次數過多，請稍後再試'};
 var pass=String(payload.passcode||'');
 if(pass.length>200||teacherDigest(salt+':'+pass)!==expected){cache.put('whimsy_teacher_attempts',String(attempts+1),60);return {status:'error',message:'教師維護密碼不正確'};}
 var session=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');
 cache.put('whimsy_teacher:'+teacherDigest(session),expected,600);cache.remove('whimsy_teacher_attempts');
 return {status:'success',protocol:'teacher-v1',session:session,expiresIn:600};
}
function teacherAuthorized(payload){
 var token=String(payload.teacherSession||'');if(!/^[a-f0-9]{64}$/.test(token))return false;
 var expected=PropertiesService.getScriptProperties().getProperty('WHIMSY_TEACHER_HASH');
 return !!expected&&CacheService.getScriptCache().get('whimsy_teacher:'+teacherDigest(token))===expected;
}
