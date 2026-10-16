const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const base=path.resolve(__dirname,'../..');
function backend({bundle=false}={}){
 const counters={writes:0,flushes:0,locks:0},properties=new Map(),cache=new Map();let clock=Date.now(),flushFailure=0;
 class Sheet{
  constructor(name,rows=[]){this.name=name;this.rows=rows;this.writeFailures=[];this.appendFailures=[];}
  getDataRange(){return {getValues:()=>this.rows.map(r=>r.slice())};}
  getLastRow(){return this.rows.length;}setFrozenRows(){}
  appendRow(r){const failure=this.appendFailures.shift();if(failure==='before')throw Error('injected '+this.name+' append');this.rows.push(r.slice());if(failure==='after')throw Error('injected '+this.name+' append acknowledgement');}
  getRange(row,col,height=1,width=1){
   const sheet=this;
   return {getValues:()=>Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>sheet.rows[row-1+y]?.[col-1+x]??'')),setValue:v=>this.getRange(row,col,1,1).setValues([[v]]),setValues(values){
    const failure=sheet.writeFailures.shift();if(failure==='before')throw Error('injected '+sheet.name+' write');
    for(let y=0;y<height;y++){sheet.rows[row-1+y]||=[];for(let x=0;x<width;x++)sheet.rows[row-1+y][col-1+x]=values[y][x];}counters.writes++;
    if(failure==='after')throw Error('injected '+sheet.name+' write acknowledgement');return this;
   },createTextFinder(text){const hits=[];for(let y=0;y<height;y++)if(String(sheet.rows[row-1+y]?.[col-1]||'')===text)hits.push({getRow:()=>row+y});return {matchEntireCell(){return this;},findNext:()=>hits[0]||null,findAll:()=>hits};}};
  }
 }
 const sheets={Students:new Sheet('Students',[['ID','Grade','Class','Seat','Name','XP','Level','Stars','Words','Badges','Updated','Created'],['50101','5','501','01','王小明',100,2,1,'BOOK',0,'',''],['50102','5','501','02','李小華',20,1,0,'',0,'','']]),Passport_Logs:new Sheet('Passport_Logs',[['Time','ID','Grade','Class','Seat','Name','Zone','Word','XP','Teacher','UA','eventId']])};
 const ss={getSheetByName:n=>sheets[n]||null,insertSheet:n=>sheets[n]=new Sheet(n)};
 const context={console,SpreadsheetApp:{getActiveSpreadsheet:()=>ss,flush(){counters.flushes++;if(flushFailure===counters.flushes)throw Error('injected flush');}},LockService:{getScriptLock:()=>({tryLock(){counters.locks++;return true;},releaseLock(){}})},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({text,setMimeType(){return this;}})},PropertiesService:{getScriptProperties:()=>({getProperty:k=>properties.get(k)||null,setProperties:o=>Object.entries(o).forEach(([k,v])=>properties.set(k,v))})},CacheService:{getScriptCache:()=>({get:k=>{const e=cache.get(k);return e&&clock<e.until?e.value:null;},put:(k,value,seconds)=>cache.set(k,{value,until:clock+seconds*1000}),remove:k=>cache.delete(k)})},Utilities:{getUuid:()=>crypto.randomUUID(),DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(algorithm,text)=>[...crypto.createHash('sha256').update(text).digest()].map(n=>n>127?n-256:n),formatDate:()=>new Date(clock).toISOString()}};
 const c=vm.createContext(context);
 const files=bundle?['../gas-release/Code.gs']:['LearningSchema.gs','StudentRecords.gs','LearningHub.gs','TeacherAccess.gs','AdventureSchema.gs','AdventureCheckpoints.gs','Code.gs'];
 for(const file of files)vm.runInContext(fs.readFileSync(path.join(base,'gas',file),'utf8'),c,{filename:file});
 const post=(p)=>JSON.parse(c.doPost({postData:{contents:JSON.stringify({token:'whimsy_forest_escape_2026',...p})}}).text);
 const get=(p)=>JSON.parse(c.doGet({parameter:{token:'whimsy_forest_escape_2026',...p}}).text);
 return {c,ss,sheets,counters,properties,post,get,advance:ms=>clock+=ms,failFlush:n=>flushFailure=counters.flushes+n};
}
module.exports=backend;
