(function(root){
  'use strict';
  const protocol='adventure-v1';
  function parseCode(text){const match=typeof text==='string'&&/^EME1\.([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(text.trim());return match?{checkpointId:match[1],secret:match[2],code:match[0]}:null;}
  function randomHex(crypto,length){if(!crypto?.getRandomValues)throw Error('Secure continuation codes are unavailable');return Array.from(crypto.getRandomValues(new Uint8Array(length)),n=>n.toString(16).padStart(2,'0')).join('');}
  function generateCode(crypto){return 'EME1.'+randomHex(crypto,16)+'.'+randomHex(crypto,32);}
  const signature=record=>JSON.stringify({...record,savedAt:0});
  class CloudCheckpointClient{
    constructor({storage,crypto,send,owner,zones,endpoint}){
      Object.assign(this,{storage,crypto,send,owner,zones,endpoint});this.key='whimsy.adventure.cloud.v1:'+encodeURIComponent(endpoint)+'|'+encodeURIComponent(owner);this.link=null;this.state='unchecked';this.supported=false;this.busy=false;this.lastSignature=null;this.conflictRevision=null;this.unreadable=null;this.cloudSavedAt=null;
      let raw=null;try{raw=storage.getItem(this.key);if(raw){const link=JSON.parse(raw);if(link.version===1&&link.owner===owner&&parseCode(link.code)&&Number.isInteger(link.revision)&&link.revision>=0&&link.revision<=100000000){this.link={version:1,owner,code:link.code,revision:link.revision,autoUpload:link.autoUpload===true,pending:null};
        if(link.pending){const p=link.pending,snapshot=root.AdventureProgress.validate(p.snapshot,owner,zones);if(snapshot&&/^[a-f0-9]{32}$/.test(p.requestId)&&p.expectedRevision===link.revision)this.link.pending={snapshot,requestId:p.requestId,expectedRevision:p.expectedRevision};else {this.unreadable=raw;this.link=null;this.state='link_invalid';}}
      }else {this.unreadable=raw;this.state='link_invalid';}}}catch(error){this.unreadable=raw;this.state=raw!==null?'link_invalid':'storage_error';}
    }
    persist(){try{if(this.unreadable!==null){this.storage.setItem(this.key+':unreadable',this.unreadable);this.unreadable=null;}this.storage.setItem(this.key,JSON.stringify(this.link));return true;}catch(error){this.state='storage_error';return false;}}
    async probe(){if(this.busy)return false;this.busy=true;try{const data=await this.send({action:'adventureCapabilities'});this.supported=data.status==='success'&&data.protocol===protocol;this.state=this.supported?(this.conflictRevision!==null?'conflict':this.link?'connected':'available'):data.status==='busy'?'busy':data.status==='error'&&!/^Unknown action:/.test(data.message||'')?'connection_error':'unsupported';return this.supported;}catch(error){this.state='offline';return false;}finally{this.busy=false;}}
    async enable(snapshot){if(!this.supported||this.busy||this.link)return false;try{this.link={version:1,owner:this.owner,code:generateCode(this.crypto),revision:0,autoUpload:true,pending:null};}catch(error){this.state='unavailable';return false;}if(!this.persist()){this.link=null;return false;}return this.push(snapshot,true);}
    async push(raw,force=false){
      if(!this.supported||!this.link||this.busy||this.conflictRevision!==null)return false;
      const snapshot=root.AdventureProgress.validate(raw,this.owner,this.zones);if(!snapshot||JSON.stringify(snapshot).length>20000){this.state='invalid_snapshot';return false;}
      if(!force&&!this.link.pending&&this.lastSignature===signature(snapshot))return true;
      this.busy=true;this.state='uploading';
      try{
        // Flush the exact pending write first. Never change the body under an existing request ID.
        for(let attempt=0;attempt<2;attempt++){
          if(!this.link.pending){this.link.pending={snapshot,expectedRevision:this.link.revision,requestId:randomHex(this.crypto,16)};if(!this.persist())return false;}
          const pending=this.link.pending,credential=parseCode(this.link.code);
          const data=await this.send({action:'saveAdventure',owner:this.owner,checkpointId:credential.checkpointId,secret:credential.secret,...pending});
          if(data.status==='conflict'&&Number.isInteger(data.revision)&&data.revision>=0&&data.revision<=100000000){this.conflictRevision=data.revision;this.state='conflict';return false;}
          if(data.status!=='success'||!Number.isInteger(data.revision)||data.revision<=this.link.revision||data.revision>100000000){this.state=data.code==='access'?'access_error':data.code==='invalid'||data.code==='too_large'?'invalid_snapshot':'offline';return false;}
          const previous={...this.link};this.link={...this.link,revision:data.revision,pending:null};
          if(!this.persist()){this.link=previous;return false;}
          this.lastSignature=signature(pending.snapshot);this.cloudSavedAt=Number(data.savedAt)||null;
          if(this.lastSignature===signature(snapshot))break;
        }
        this.state='synced';return true;
      }catch(error){this.state='offline';return false;}finally{this.busy=false;}
    }
    async download(text=this.link?.code){
      if(!this.supported||this.busy)return null;const credential=parseCode(text);if(!credential){this.state='invalid_code';return null;}
      this.busy=true;try{
        const data=await this.send({action:'getAdventure',owner:this.owner,checkpointId:credential.checkpointId,secret:credential.secret});
        if(data.status!=='success'||!Number.isInteger(data.revision)||data.revision<1||data.revision>100000000){this.state=data.status==='missing'?'missing':data.code==='access'?'access_error':data.code==='corrupt'?'invalid_snapshot':'offline';return null;}
        const snapshot=root.AdventureProgress.validate(data.snapshot,this.owner,this.zones);if(!snapshot){this.state='invalid_snapshot';return null;}
        this.state='preview';return {code:credential.code,revision:data.revision,snapshot,updatedAt:Number(data.updatedAt)||null};
      }catch(error){this.state='offline';return null;}finally{this.busy=false;}
    }
    adopt(downloaded){
      if(!downloaded||!parseCode(downloaded.code)||!Number.isInteger(downloaded.revision)||downloaded.revision<1||downloaded.revision>100000000||!root.AdventureProgress.validate(downloaded.snapshot,this.owner,this.zones))return false;
      const previous=this.link;
      try{if(previous&&previous.code!==downloaded.code)this.storage.setItem(this.key+':previous-link',JSON.stringify(previous));}catch(error){this.state='storage_error';return false;}
      this.link={version:1,owner:this.owner,code:downloaded.code,revision:downloaded.revision,autoUpload:true,pending:null};
      if(!this.persist()){this.link=previous;return false;}this.lastSignature=signature(downloaded.snapshot);this.cloudSavedAt=downloaded.updatedAt;this.conflictRevision=null;this.state='synced';return true;
    }
    async keepLocal(snapshot){if(this.conflictRevision===null||this.busy||!Number.isInteger(this.conflictRevision))return false;const previous={...this.link};this.link={...this.link,revision:this.conflictRevision,pending:null};if(!this.persist()){this.link=previous;return false;}this.conflictRevision=null;this.state='connected';this.lastSignature=null;return this.push(snapshot,true);}
    setAuto(enabled){if(!this.link)return false;const previous=this.link.autoUpload;this.link.autoUpload=enabled===true;if(!this.persist()){this.link.autoUpload=previous;return false;}return true;}
  }
  root.AdventureCloud={parseCode,generateCode,CloudCheckpointClient};if(typeof module!=='undefined')module.exports=root.AdventureCloud;
  if(!root.document)return;
  root.addEventListener('load',()=>{
    const world=root.world3D;if(!world?.adventureProgress)return;
    const $=id=>root.document.getElementById(id);let client=null,preview=null,previewClient=null;
    const copy={busy:'雲端正在忙碌，請稍後再檢查。',connection_error:'雲端服務無法接受請求，請確認連接設定或稍後重試。',unchecked:'先檢查雲端服務，確認是否支援跨裝置續玩。',available:'雲端服務已支援。啟用後即可取得續玩代碼。',connected:'續玩代碼已連接，等待下一次保存。',uploading:'正在上傳冒險進度…',synced:'機關、道具與位置已保存至雲端。',unsupported:'目前後端尚未支援跨裝置冒險存檔；此裝置存檔仍正常使用。',offline:'暫時無法連接雲端，進度保留在此裝置，可稍後重試。',conflict:'另一台裝置已有較新的存檔。請選擇從雲端續玩，或明確保存這台的版本。',storage_error:'此瀏覽器無法保存續玩代碼或重試資料，請確認網站儲存權限。',unavailable:'此瀏覽器無法產生安全的續玩代碼。',invalid_snapshot:'這份存檔格式無法使用；本機進度不受影響。',invalid_code:'請輸入完整的 EME1 續玩代碼。',access_error:'代碼或登入學生與這份存檔不同，請確認後重試。',missing:'尚未找到此代碼的雲端存檔。請先在原裝置完成上傳。',link_invalid:'此裝置的續玩連接資訊無法讀取，請使用原續玩代碼重新連接。',preview:'雲端存檔已讀取，請確認是否接續。'};
    function paint(){
      if(world.devMode){$('adventureCloudStatus').textContent='本機場景檢查不連接雲端存檔。';for(const control of $('adventureCloudPanel').querySelectorAll('button,input'))control.disabled=true;return;}
      $('adventureCloudStatus').textContent=client.busy?(client.state==='uploading'?copy.uploading:'正在檢查或讀取雲端存檔…'):client.conflictRevision!==null&&client.supported?copy.conflict:client.state==='local_restored'?'已回復本機備份，這次變更尚未上傳。':copy[client.state]||copy.unchecked;
      $('adventureCloudCode').value=client.link?.code||'';
      $('adventureCloudCheck').disabled=client.busy;$('adventureCloudEnable').disabled=!client.supported||client.busy||!!client.link;
      $('adventureCloudUpload').disabled=!client.supported||client.busy||!client.link||client.conflictRevision!==null;
      $('adventureCloudLoad').disabled=!client.supported||client.busy;
      $('adventureCloudCopy').disabled=!client.link;$('adventureCloudAuto').disabled=!client.supported||!client.link||client.busy;
      $('adventureCloudAuto').checked=client.link?.autoUpload===true;
      $('adventureCloudKeep').hidden=client.conflictRevision===null||!client.supported;$('adventureCloudKeep').disabled=client.busy;
      $('adventureCloudUndo').disabled=!world.adventureProgress.hasCloudBackup();
    }
    function select(){
      if(world.devMode){paint();return;}
      const manager=root.cloudSyncManager,owner=world.adventureProgress.store().owner,endpoint=manager?.gasUrl||'';
      if(client?.owner===owner&&client.endpoint===endpoint)return;
      $('cloudRestoreModal').style.display='none';preview=null;previewClient=null;
      client=new CloudCheckpointClient({storage:root.localStorage,crypto:root.crypto,owner,zones:world.zoneManager.zones,endpoint,send:async payload=>{
        if(!endpoint)throw Error('Cloud endpoint unavailable');const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),18000);
        try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({...payload,token:manager.clientToken}),signal:controller.signal});if(!response.ok)throw Error('Cloud request failed');return await response.json();}finally{clearTimeout(timeout);}
      }});paint();
      if(client.link){const current=client;current.probe().then(()=>{if(current===client)paint();});}
    }
    async function run(action){const current=client;if(!current)return;try{const task=action(current);paint();await task;}finally{if(current===client)paint();}}
    $('adventureCloudCheck').addEventListener('click',()=>run(c=>c.probe()));
    $('adventureCloudEnable').addEventListener('click',()=>run(c=>c.enable(world.adventureProgress.snapshot())));
    $('adventureCloudUpload').addEventListener('click',()=>run(c=>c.push(world.adventureProgress.snapshot(),true)));
    $('adventureCloudKeep').addEventListener('click',()=>run(c=>c.keepLocal(world.adventureProgress.snapshot())));
    $('adventureCloudAuto').addEventListener('change',()=>{client?.setAuto($('adventureCloudAuto').checked);paint();});
    $('adventureCloudCopy').addEventListener('click',async()=>{try{await root.navigator.clipboard.writeText(client.link.code);world.showToast('續玩代碼已複製。在另一台裝置登入同一學生後，輸入此代碼。');}catch(error){$('adventureCloudCode').select();world.showToast('請自行複製選取的續玩代碼。');}});
    $('adventureCloudLoad').addEventListener('click',()=>run(async c=>{
      const downloaded=await c.download($('adventureCloudInput').value.trim()||c.link?.code);if(c!==client||!downloaded)return;
      preview=downloaded;previewClient=c;
      $('cloudRestoreCopy').textContent='雲端關卡：'+world.zoneManager.zones[downloaded.snapshot.zone].name+'；保存時間：'+new Date(downloaded.snapshot.savedAt).toLocaleString('zh-TW')+'。確認後會接續這份進度；目前此裝置的版本會先備份。';
      root.closeSystemMenu?.();$('cloudRestoreModal').style.display='flex';root.touchControls?.reset();
    }));
    $('cloudRestoreConfirm').addEventListener('click',()=>{
      if(!preview||previewClient!==client){$('cloudRestoreModal').style.display='none';return;}
      if(client.link&&!client.setAuto(false)){paint();return;}
      if(!world.adventureProgress.importCloud(preview.snapshot)){client.state='storage_error';paint();return;}
      const adopted=client.adopt(preview);$('cloudRestoreModal').style.display='none';preview=null;previewClient=null;paint();world.showToast(adopted?'已接續雲端冒險。原本機版本已保留備份。':'冒險已恢復至本機，雲端連接尚未完成。');
    });
    $('cloudRestoreCancel').addEventListener('click',()=>{$('cloudRestoreModal').style.display='none';preview=null;previewClient=null;if(client)client.state=client.conflictRevision!==null?'conflict':client.link?'connected':'available';paint();$('systemMenuBtn').focus({preventScroll:true});});
    $('adventureCloudUndo').addEventListener('click',()=>{if(client?.link&&!client.setAuto(false)){paint();return;}if(world.adventureProgress.restoreCloudBackup()){if(client)client.state='local_restored';paint();world.showToast('已回復上次本機備份，自動上傳已暫停；可以手動保存至雲端。');}});
    root.cloudSyncManager?.onProfileUpdated(select);select();
    root.setInterval(()=>{
      select();if(!client?.supported||!client.link?.autoUpload||client.busy||client.conflictRevision!==null||preview||root.document.hidden||!$('gameCoverScreen').inert)return;
      run(c=>c.push(world.adventureProgress.snapshot()));
    },20000);
    world.adventureCloud={client:()=>client};
  });
})(typeof window!=='undefined'?window:globalThis);
