/* Durable per-event outbox. Separate keys avoid whole-array overwrite races across tabs.
 * The old array is retained as a recovery source; legacy acknowledgements are tombstones.
 */
(function(root){
 'use strict';
 const meaning=e=>JSON.stringify([e.action,e.studentId,e.word,e.xp,e.isTeacherPass===true,e.zone||'zone1',e.companionWord||'']);
 function stableId(text){
  const h=[2166136261,2246822507,3266489909,668265263];
  for(let i=0;i<text.length;i++)for(let j=0;j<4;j++)h[j]=Math.imul(h[j]^text.charCodeAt(i),16777619+j*2)>>>0;
  return h.map(n=>n.toString(16).padStart(8,'0')).join('');
 }
 class RecordOutbox{
  constructor(storage,key='whimsy_pending_logs'){this.storage=storage;this.key=key;this.prefix=key+':event:';this.acks=key+':ack:';}
  entries(){
   const found=new Map(),raw=this.storage.getItem(this.key),legacy=raw?JSON.parse(raw):[];
   if(!Array.isArray(legacy))throw Error('舊版待傳資料無法讀取，已保留原始內容');
   const counts=new Map();
   for(const e of legacy){
    if(!e||typeof e!=='object')throw Error('待傳資料格式損壞，已保留原始內容');
    const text=JSON.stringify(e),n=counts.get(text)||0;counts.set(text,n+1);
    const event={...e,eventId:e.eventId||'legacy_'+stableId(text+':'+n)};
    if(this.storage.getItem(this.acks+event.eventId)!=='ack')found.set(event.eventId,event);
   }
   for(let i=0;i<this.storage.length;i++){
    const key=this.storage.key(i);if(!key?.startsWith(this.prefix))continue;
    const e=JSON.parse(this.storage.getItem(key));
    if(!e||key!==this.prefix+e.eventId)throw Error('待傳事件無法讀取，已保留原始內容');
    if(this.storage.getItem(this.acks+e.eventId)!=='ack')found.set(e.eventId,e);
   }
   return [...found.values()];
  }
  put(payload){
   if(!/^[a-zA-Z0-9_-]{8,100}$/.test(payload.eventId||''))throw Error('Invalid event id');
   const key=this.prefix+payload.eventId,old=this.storage.getItem(key);
   if(old){if(meaning(JSON.parse(old))!==meaning(payload))throw Error('Event id conflict');return;}
   const text=JSON.stringify({...payload,queuedAt:payload.queuedAt||Date.now()});
   this.storage.setItem(key,text);if(this.storage.getItem(key)!==text)throw Error('無法保存待傳紀錄');
  }
  acknowledge(id){
   if(id.startsWith('legacy_')){this.storage.setItem(this.acks+id,'ack');if(this.storage.getItem(this.acks+id)!=='ack')throw Error('無法保存傳送確認');}
   this.storage.removeItem(this.prefix+id);
  }
 }
 root.RecordOutbox=RecordOutbox;if(typeof module!=='undefined')module.exports=RecordOutbox;
})(typeof window!=='undefined'?window:globalThis);
