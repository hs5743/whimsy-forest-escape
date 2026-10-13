/* Pure, shared learning policy. Oral results are content matching, not phonetic scoring. */
(function(root){
 'use strict';
 const key=w=>String(w||'').trim().toUpperCase();
 const day=t=>new Date(Number(t)+8*3600000).toISOString().slice(0,10);
 const empty=()=>({version:1,words:{},sentences:{},favorites:[],events:[],practices:0,xp:0});
 function normalize(s){return String(s||'').toLowerCase().replace(/[’]/g,"'").replace(/\bit's\b/g,'it is').replace(/\bthat's\b/g,'that is').replace(/\bdon't\b/g,'do not').replace(/[^a-z0-9']/g,' ').replace(/\s+/g,' ').trim();}
 function matches(a,b){return !!normalize(b)&&normalize(a)===normalize(b);}
 function apply(raw,e,completed=[]){
  const s=JSON.parse(JSON.stringify(raw||empty()));
  s.words=s.words||{};s.sentences=s.sentences||{};s.favorites=s.favorites||[];s.events=s.events||[];
  if(!e||typeof e.id!=='string'||!e.id||e.id.length>100)throw Error('Invalid event');
  if(s.events.includes(e.id))return {state:s,xp:0,duplicate:true};
  const word=key(e.word),today=day(e.time),known=completed.map(key).includes(word);
  let xp=0,first=false;
  if(e.kind==='favorite'){
   if(e.value&&!s.favorites.includes(word))s.favorites.push(word);
   if(!e.value)s.favorites=s.favorites.filter(w=>w!==word);
  }else if(e.kind==='word'||e.kind==='meaning'){
   const w=s.words[word]||{times:0,days:[],reviews:{},meaning:0,context:0,learned:known};
   if(e.kind==='meaning')w.meaning++;
   else{
    first=!w.learned&&!known;
    if(first){xp=50;w.learned=true;}
    else if((w.reviews[today]||0)<2){xp=10;w.reviews[today]=(w.reviews[today]||0)+1;}
    w.times++;if(!w.days.includes(today))w.days.push(today);w.last=e.time;
   }
   s.words[word]=w;s.practices=(s.practices||0)+1;
  }else if(e.kind==='sentence'){
   const v=s.sentences[e.sentence]||{times:0,days:[]};first=v.times===0;xp=first?30:0;v.times++;
   if(!v.days.includes(today))v.days.push(today);v.last=e.time;s.sentences[e.sentence]=v;
   if(s.words[word]?.learned)s.words[word].context++;s.practices=(s.practices||0)+1;
  }else throw Error('Invalid kind');
  s.xp=(s.xp||0)+xp;s.events.push(e.id); // Never discard receipts: retries must remain idempotent.
  return {state:s,xp,first,duplicate:false};
 }
 function mastery(w){return !w?.learned?0:1+Number(w.times>=3)+Number(w.days.length>=2)+Number(w.meaning>0)+Number(w.context>0&&w.days.length>=3);}
 root.LearningRewards={key,day,empty,normalize,matches,apply,mastery};if(typeof module!=='undefined')module.exports=root.LearningRewards;
})(typeof window!=='undefined'?window:globalThis);
