/* Private capability checkpoints, separate from Students and Logs. */
var ADVENTURE_CHECKPOINT_SHEET='AdventureCheckpoints';
function adventureDigest(value){
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,value,Utilities.Charset.UTF_8).map(function(byte){return ((byte+256)%256).toString(16).padStart(2,'0');}).join('');
}
function adventureOwnerValid(owner){return typeof owner==='string'&&(owner==='guest'||(/^student:.+/.test(owner)&&owner.length<=108&&!/[\x00-\x1f]/.test(owner)));}
function adventureCheckpointAction(payload,ss){
  if(payload.action==='adventureCapabilities')return {status:'success',protocol:'adventure-v1',maxSnapshotChars:20000};
  var id=payload.checkpointId,secret=payload.secret,owner=payload.owner;
  if(typeof id!=='string'||!/^[a-f0-9]{32}$/.test(id)||typeof secret!=='string'||!/^[a-f0-9]{64}$/.test(secret)||!adventureOwnerValid(owner))return {status:'error',code:'invalid',message:'Invalid checkpoint request'};
  var isSave=payload.action==='saveAdventure';
  if(!isSave&&payload.action!=='getAdventure')return {status:'error',code:'invalid',message:'Unsupported checkpoint action'};
  var record=null,body='',bodyHash='';
  if(isSave){
    if(!Number.isInteger(payload.expectedRevision)||payload.expectedRevision<0||payload.expectedRevision>100000000||typeof payload.requestId!=='string'||!/^[a-f0-9]{32}$/.test(payload.requestId))return {status:'error',code:'invalid',message:'Invalid checkpoint revision'};
    try{if(JSON.stringify(payload.snapshot).length>20000)return {status:'error',code:'too_large',message:'Checkpoint too large'};}catch(error){return {status:'error',code:'invalid',message:'Invalid checkpoint'};}
    record=AdventureProgress.validate(payload.snapshot,owner,ADVENTURE_CHECKPOINT_ZONES);
    if(!record)return {status:'error',code:'invalid',message:'Invalid checkpoint'};
    body=JSON.stringify(record);bodyHash=adventureDigest(body);
  }
  var sheet=ss.getSheetByName(ADVENTURE_CHECKPOINT_SHEET),rows=sheet?sheet.getDataRange().getValues():[],index=-1;
  for(var i=1;i<rows.length;i++)if(String(rows[i][0])===id){index=i;break;}
  var secretHash=adventureDigest(secret),ownerHash=adventureDigest(owner),revision=index>=0?Number(rows[index][3]):0;
  if(index>=0&&(String(rows[index][1])!==secretHash||String(rows[index][2])!==ownerHash))return {status:'error',code:'access',message:'Checkpoint unavailable for this continuation code and profile'};
  if(!isSave){
    if(index<0)return {status:'missing',message:'Checkpoint not found'};
    try{record=AdventureProgress.validate(JSON.parse(String(rows[index][6])),owner,ADVENTURE_CHECKPOINT_ZONES);}catch(error){record=null;}
    if(!record)return {status:'error',code:'corrupt',message:'Stored checkpoint cannot be restored'};
    return {status:'success',revision:revision,snapshot:record,updatedAt:new Date(rows[index][7]).getTime()};
  }
  // A timed-out write may be retried, but a reused request ID cannot change its body.
  if(index>=0&&String(rows[index][4])===payload.requestId){
    if(String(rows[index][5])!==bodyHash)return {status:'error',code:'request_reused',message:'Request identifier was reused for a different checkpoint'};
    return {status:'success',revision:revision,savedAt:new Date(rows[index][7]).getTime(),replayed:true};
  }
  if(payload.expectedRevision!==revision)return {status:'conflict',revision:revision,message:'A newer checkpoint exists on another device'};
  if(!Number.isInteger(revision)||revision<0||revision>=100000000)return {status:'error',code:'invalid',message:'Checkpoint revision cannot be advanced'};
  if(!sheet){sheet=ss.insertSheet(ADVENTURE_CHECKPOINT_SHEET);sheet.appendRow(['checkpointId','secretHash','ownerHash','revision','lastRequestId','bodyHash','checkpointJSON','updatedAt']);sheet.setFrozenRows(1);}
  var now=new Date(),values=[id,secretHash,ownerHash,revision+1,payload.requestId,bodyHash,body,now];
  if(index>=0)sheet.getRange(index+1,1,1,values.length).setValues([values]);else sheet.appendRow(values);
  return {status:'success',revision:revision+1,savedAt:now.getTime()};
}
