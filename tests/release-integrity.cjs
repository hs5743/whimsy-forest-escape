const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const backend=require('./helpers/backend.cjs'),storage=require('./helpers/storage.cjs'),Outbox=require('../record-outbox.js');
const base=path.resolve(__dirname,'..');
const pass=(extra={})=>({action:'recordPass',eventId:'release_pass_0001',studentId:'50101',word:'LIGHT',xp:50,zone:'zone1',...extra});
const hall=(extra={})=>({action:'learningEvent',studentId:'50101',event:{id:'release_hall_0001',kind:'word',word:'APPLE',...extra}});

for(const where of ['before','after'])test('adventure receipt repairs an interrupted Students write '+where,()=>{
 const f=backend();f.sheets.Students.writeFailures.push(where);
 assert.equal(f.post(pass()).status,'error');const retry=f.post(pass());
 assert.equal(retry.status,'success');assert.equal(retry.replayed,true);assert.equal(retry.updatedProfile.xp,150);
 assert.equal(f.sheets.Students.rows[1][5],150);assert.equal(f.sheets.Passport_Logs.rows.length,2);
 assert.equal(f.post(pass()).updatedProfile.xp,150);
});
for(const where of ['before','after'])test('log append failure '+where+' never repeats XP or creates two logs',()=>{
 const f=backend();f.sheets.Passport_Logs.appendFailures.push(where);
 assert.equal(f.post(pass()).status,'error');assert.equal(f.sheets.Students.rows[1][5],150);
 assert.equal(f.post(pass()).status,'success');assert.equal(f.sheets.Passport_Logs.rows.length,2);assert.equal(f.sheets.Students.rows[1][5],150);
});
for(const step of [1,2,3,4])test('flush interruption at commit boundary '+step+' recovers exactly once',()=>{
 const f=backend();f.failFlush(step);assert.equal(f.post(pass()).status,'error');
 const r=f.post(pass());assert.equal(r.status,'success');assert.equal(r.updatedProfile.xp,150);assert.equal(f.sheets.Passport_Logs.rows.length,2);
});
test('a hall event between interrupted adventure writes retains both rewards',()=>{
 const f=backend();f.sheets.Students.writeFailures.push('before');assert.equal(f.post(pass()).status,'error');
 assert.equal(f.post(hall()).student.xp,200);assert.equal(f.post(pass()).updatedProfile.xp,200);
 assert.equal(f.post(hall()).student.xp,200);assert.equal(f.sheets.Passport_Logs.rows.length,2);
});
test('an adventure pass repairs a pending hall commit without losing either reward',()=>{
 const f=backend();f.sheets.Students.writeFailures.push('before');assert.equal(f.post(hall()).status,'error');
 assert.equal(f.post(pass()).updatedProfile.xp,200);assert.equal(f.post(hall()).student.xp,200);
});
test('changed receipt payloads are rejected, including XP and source zone',()=>{
 const f=backend();assert.equal(f.post(pass()).status,'success');
 for(const extra of [{word:'CAT'},{xp:60},{zone:'zone2'},{isTeacherPass:true}])assert.equal(f.post(pass(extra)).status,'error');
 assert.equal(f.sheets.Students.rows[1][5],150);
});
test('separate student records cannot import another student XP',()=>{
 const f=backend();f.post(pass());const second=f.post(pass({studentId:'50102',eventId:'release_pass_0002'}));
 assert.equal(second.updatedProfile.xp,70);assert.equal(f.sheets.Students.rows[1][5],150);
});
test('old requests without event IDs fail safely and zero XP is preserved',()=>{
 const f=backend();assert.equal(f.post(pass({eventId:''})).code,'upgrade_required');assert.equal(f.sheets.LearningProfiles,undefined);
 assert.equal(f.post(pass({xp:0})).updatedProfile.xp,100);
});
test('legacy learning profile chunks, favorites and sentences survive an adventure pass',()=>{
 const f=backend();f.post(hall());f.post(hall({id:'favorite_existing',kind:'favorite',value:true}));
 f.post(hall({id:'sentence_existing',kind:'sentence',sentence:'like:APPLE'}));
 const r=f.post(pass());assert.equal(r.updatedProfile.xp,230);
 const learned=f.post({action:'learningGet',studentId:'50101'});assert.deepEqual(learned.learning.favorites,['APPLE']);assert.equal(learned.learning.sentences['like:APPLE'].times,1);
});
test('unregistered students and invalid tokens cannot create history',()=>{
 const f=backend();assert.equal(f.post(pass({studentId:'guest_1'})).status,'error');assert.equal(f.post(pass({studentId:'99999'})).status,'error');
 assert.equal(f.post({...pass(),token:'invalid'}).status,'error');assert.equal(f.sheets.LearningProfiles,undefined);assert.equal(f.sheets.Passport_Logs.rows.length,1);
});

test('complete single-file backend is generated from modules and retains every protocol',()=>{
 const generator=require('../scripts/build-gas-bundle.cjs');assert.equal(fs.readFileSync(path.join(base,'gas-release/Code.gs'),'utf8'),generator.generate());
 const f=backend({bundle:true});assert.equal(f.get({action:'ping'}).recordProtocol,'record-v2');assert.equal(f.get({action:'ping'}).learningWords,603);
 assert.equal(f.post({action:'adventureCapabilities'}).protocol,'adventure-v1');assert.equal(f.post(pass()).updatedProfile.xp,150);assert.equal(f.post(hall()).student.xp,200);
});
test('single-file backend remains private beside existing separate helper modules',()=>{
 const f=backend();vm.runInContext(fs.readFileSync(path.join(base,'gas-release/Code.gs'),'utf8'),f.c);
 assert.equal(f.post(pass()).updatedProfile.xp,150);assert.equal(f.post(hall()).student.xp,200);
});
test('teacher reports reject public tokens alone, sessions expire and password rotation invalidates them',()=>{
 const f=backend();assert.equal(f.get({action:'generateReport'}).code,'teacher_required');assert.equal(f.post({action:'generateReport'}).code,'teacher_required');
 assert.equal(f.post({action:'teacherAuthenticate',passcode:'test'}).code,'teacher_not_configured');
 const salt='fixture_salt',secret='review_fixture_secret_123';f.properties.set('WHIMSY_TEACHER_SALT',salt);f.properties.set('WHIMSY_TEACHER_HASH',f.c.teacherDigest(salt+':'+secret));
 assert.equal(f.post({action:'teacherAuthenticate',passcode:'wrong'}).status,'error');
 const session=f.post({action:'teacherAuthenticate',passcode:secret});assert.equal(session.protocol,'teacher-v1');
 const r=f.post({action:'generateReport',teacherSession:session.session});assert.equal(r.status,'success');assert.equal(r.report.classStats['501'].topStudent.name,'王○明');
 f.advance(601000);assert.equal(f.post({action:'generateReport',teacherSession:session.session}).code,'teacher_required');
 const renewed=f.post({action:'teacherAuthenticate',passcode:secret});f.properties.set('WHIMSY_TEACHER_HASH','rotated');
 assert.equal(f.post({action:'generateReport',teacherSession:renewed.session}).code,'teacher_required');
});

test('two tabs sharing an outbox never overwrite each other event keys',()=>{
 const s=storage(),a=new Outbox(s.storage),b=new Outbox(s.storage);a.put(pass());b.put(pass({eventId:'release_pass_0002',word:'CAT'}));
 a.acknowledge('release_pass_0001');assert.deepEqual(b.entries().map(e=>e.eventId),['release_pass_0002']);
});
test('legacy array migration is stable between tabs, retains its backup, and cannot resurrect acknowledged entries',()=>{
 const original=[{action:'recordPass',studentId:'50101',word:'LIGHT',xp:50,queuedAt:1234}];const s=storage({whimsy_pending_logs:JSON.stringify(original)}),a=new Outbox(s.storage),b=new Outbox(s.storage);
 const event=a.entries()[0];assert.equal(event.eventId,b.entries()[0].eventId);a.put(event);b.put(event);a.acknowledge(event.eventId);
 assert.equal(b.entries().length,0);assert.deepEqual(JSON.parse(s.storage.getItem('whimsy_pending_logs')),original);
});
test('same-millisecond legacy events receive distinct stable IDs',()=>{
 const e={studentId:'50101',word:'LIGHT',xp:50,queuedAt:1234};const s=storage({whimsy_pending_logs:JSON.stringify([e,e])}),a=new Outbox(s.storage);
 const ids=a.entries().map(e=>e.eventId);assert.equal(new Set(ids).size,2);assert.deepEqual(new Outbox(s.storage).entries().map(e=>e.eventId),ids);
});
test('quota and corrupt storage never silently discard the original queue',()=>{
 const s=storage(),o=new Outbox(s.storage);s.fail(true);assert.throws(()=>o.put(pass()),/quota/);s.fail(false);
 s.storage.setItem('whimsy_pending_logs','broken');assert.throws(()=>o.entries());assert.equal(s.storage.getItem('whimsy_pending_logs'),'broken');
});

function client(options={}){
 const s=storage(),requests=[],nodes={cloudStatusPill:{},cloudStatusDot:{}};
 const c={window:{RecordOutbox:Outbox,GamePolish:{isLocalPreview:()=>false},addEventListener(){}},localStorage:s.storage,navigator:{onLine:false,userAgent:'Fixture'},document:{getElementById:id=>nodes[id]||null},setInterval(){},console,fetch:(url,options)=>new Promise(resolve=>requests.push({url,payload:options&&JSON.parse(options.body),reply:data=>resolve({json:async()=>data})}))};
 if(options.storage)c.localStorage=options.storage;
 vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(base,'cloud-sync-manager.js'),'utf8'),c);
 const m=c.window.cloudSyncManager;m.profile={studentId:'50101',isGuest:false,xp:100,level:2,completedWords:['BOOK'],stars:1,badgesCount:0,wordMastery:{}};
 return {c,m,s,requests,nodes};
}
test('a pass is durably pending before any request and an old backend cannot discard it',async()=>{
 const f=client();assert.equal(f.m.recordWordPass('LIGHT').saved,true);assert.equal(f.m.outbox.entries().length,1);assert.equal(f.requests.length,0);
 f.c.navigator.onLine=true;const work=f.m.flushQueue();assert.match(f.requests[0].url,/action=ping/);f.requests[0].reply({status:'success'});await work;
 assert.equal(f.m.outbox.entries().length,1);assert.equal(f.m.backendNeedsUpdate,true);assert.match(f.nodes.cloudStatusPill.textContent,/等待後台更新/);
});
test('a full local store never grants a new pass or claims completion',()=>{
 const f=client();f.s.fail(true);assert.equal(f.m.recordWordPass('LIGHT').saved,false);assert.equal(f.m.profile.xp,100);assert.equal(f.m.profile.completedWords.includes('LIGHT'),false);
});
test('a response from a previously selected student cannot replace the new profile',async()=>{
 const f=client();f.m.recordWordPass('LIGHT');const id=f.m.outbox.entries()[0].eventId;f.c.navigator.onLine=true;
 f.m.recordProtocol={url:f.m.gasUrl,ready:true,until:Date.now()+60000};const work=f.m.flushQueue();await Promise.resolve();
 f.m.profile={studentId:'50102',xp:20,level:1,completedWords:[],isGuest:false};f.requests[0].reply({status:'success',protocol:'record-v2',eventId:id,updatedProfile:{xp:999,completedWords:['CAT']}});await work;
 assert.equal(f.m.profile.xp,20);assert.deepEqual(f.m.profile.completedWords,[]);assert.equal(f.m.outbox.entries().length,0);
});
test('an unrelated or legacy success response cannot acknowledge a pending record',async()=>{
 const f=client();f.m.recordWordPass('LIGHT');f.c.navigator.onLine=true;f.m.recordProtocol={url:f.m.gasUrl,ready:true,until:Date.now()+60000};
 const work=f.m.flushQueue();await Promise.resolve();f.requests[0].reply({status:'success',protocol:'record-v2',eventId:'some_other_event'});await work;assert.equal(f.m.outbox.entries().length,1);
});

test('legacy displayed levels are recalculated without removing previously unlocked realm access',()=>{
 const f=backend();f.sheets.Students.rows[1][5]=550;f.sheets.Students.rows[1][6]=6;
 const read=f.post({action:'learningGet',studentId:'50101'});assert.equal(read.student.level,4);assert.equal(read.student.accessLevel,6);
 const replay=f.post({action:'learningGet',studentId:'50101'});assert.equal(replay.student.accessLevel,6);assert.equal(replay.student.xp,550);
 const login=f.post({action:'loginOrRegister',studentId:'50101',grade:'5',classId:'501',seatNo:'01',name:'TEST'});assert.equal(login.student.level,4);assert.equal(login.student.accessLevel,6);
});
test('receipt IDs reused by another student keep separate log rows',()=>{
 const f=backend();f.post(pass());assert.equal(f.post(pass({studentId:'50102'})).updatedProfile.xp,70);assert.equal(f.sheets.Passport_Logs.rows.length,3);
});
test('a two-word scavenger reward is one durable event with one fixed XP amount',()=>{
 const f=client();f.m.currentStreak=7;const r=f.m.recordWordPass('LIGHT',230,false,'zone1',{streak:false,companionWord:'LAMP'});
 assert.equal(r.actualXP,230);assert.equal(f.m.profile.xp,330);assert.equal(f.m.outbox.entries().length,1);assert.equal(f.m.profile.completedWords.includes('LAMP'),true);
 const server=backend(),event=f.m.outbox.entries()[0];assert.equal(server.post(event).updatedProfile.xp,330);assert.equal(server.post(event).updatedProfile.xp,330);assert.equal(server.post(event).updatedProfile.completedWords.includes('LAMP'),true);
 assert.equal(server.post({...event,companionWord:'CAT'}).status,'error');
});
function guardianFixture(){
 const elements={},node=()=>({style:{},classList:{add(){},remove(){}},setAttribute(){},addEventListener(){},querySelector:()=>null,querySelectorAll:()=>[],value:''});
 let callback,calls=0,allowSave=true;const c={window:{addEventListener(){},audioManager:null,world3D:{devMode:false,showToast(){}},cloudSyncManager:{recordWordPass(){calls++;return {saved:allowSave};}},speechManager:{stopListening(){},startSentenceListening(a,b,d,fn){callback=fn;}}},document:{addEventListener(){},getElementById:id=>elements[id]||(elements[id]=node()),querySelectorAll:()=>[]},console,setTimeout(){},clearTimeout(){}};
 vm.createContext(c);const html=fs.readFileSync(path.join(base,'index.html'),'utf8');for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(match[1].trim())vm.runInContext(match[1],c);
 vm.runInContext("currentGuardianTrial={rewardXP:200,questions:[{},{},{targetSentence:'I like apples.',targetKeywords:['like','apples']}]};currentTrialStep=3;",c);
 return {c,calls:()=>calls,save:v=>allowSave=v,finish:()=>callback({passed:true})};
}
test('guardian rewards require a current verified sentence and cannot repeat on double clicks',()=>{
 const f=guardianFixture();f.c.proceedToVictoryCelebration();assert.equal(f.calls(),0);f.c.startGuardianSpeechReading();f.finish();f.c.proceedToVictoryCelebration();f.c.proceedToVictoryCelebration();assert.equal(f.calls(),1);
});
test('closing a guardian session invalidates its sentence callback',()=>{
 const f=guardianFixture();f.c.startGuardianSpeechReading();f.c.closeGuardianTrialModal();f.finish();f.c.proceedToVictoryCelebration();assert.equal(f.calls(),0);
});
test('guardian storage failure retains the completed sentence and permits a safe retry',()=>{
 const f=guardianFixture();f.c.startGuardianSpeechReading();f.finish();f.save(false);f.c.proceedToVictoryCelebration();assert.equal(vm.runInContext('currentTrialStep',f.c),3);
 f.save(true);f.c.proceedToVictoryCelebration();f.c.proceedToVictoryCelebration();assert.equal(f.calls(),2);assert.equal(vm.runInContext('currentTrialStep',f.c),4);
});

test('denied storage leaves the client usable and never claims a saved pass',()=>{
 const denied={getItem(){throw Error('storage denied');},setItem(){throw Error('storage denied');},key(){throw Error('storage denied');},get length(){return 0;}};
 const f=client({storage:denied});assert.equal(f.m.recordWordPass('LIGHT').saved,false);assert.equal(f.m.profile.xp,100);
});
test('a persisted event restores a profile after an interrupted local projection exactly once',()=>{
 const f=client();f.m.outbox.put({...pass(),projection:true});f.m.recoverPendingProfile();f.m.recoverPendingProfile();assert.equal(f.m.profile.xp,150);
 assert.equal(f.m.profile.completedWords.includes('LIGHT'),true);assert.equal(f.m.outbox.entries().length,1);
});
test('guest legacy events remain available as backups but never become student uploads',async()=>{
 const f=client();f.s.storage.setItem('whimsy_pending_logs',JSON.stringify([{...pass(),studentId:'guest_1'}]));f.c.navigator.onLine=true;await f.m.flushQueue();
 assert.equal(f.requests.length,0);assert.equal(f.m.outbox.entries().length,1);
});
test('the plain-text complete backend is identical to the generated Code.gs',()=>{
 assert.equal(fs.readFileSync(path.join(base,'gas-release/完整主程式_直接貼上.txt'),'utf8'),fs.readFileSync(path.join(base,'gas-release/Code.gs'),'utf8'));
});
