/* GEPT Kid numbers from the supplied source index; eight new core words for zone19. */
(function(root){
 'use strict';
 const core=[
  ['THIRTEEN','十三','/ˌθɝːˈtiːn/',['thir','teen'],'Thirteen stars shine.','十三枚星籌發亮。'],
  ['FOURTEEN','十四','/ˌfɔːrˈtiːn/',['four','teen'],'Fourteen stars glow.','十四顆星星發光。'],
  ['FIFTEEN','十五','/ˌfɪfˈtiːn/',['fif','teen'],'Fifteen stars sparkle.','十五枚星籌閃耀。'],
  ['SIXTEEN','十六','/ˌsɪkˈstiːn/',['six','teen'],'Sixteen stars shine bright.','十六枚星籌閃閃發亮。'],
  ['SEVENTEEN','十七','/ˌsev.ənˈtiːn/',['sev','en','teen'],'Seventeen stars glow blue.','十七枚藍色星籌發光。'],
  ['EIGHTEEN','十八','/ˌeɪˈtiːn/',['eigh','teen'],'Eighteen stars light the booth.','十八枚星籌照亮攤位。'],
  ['NINETEEN','十九','/ˌnaɪnˈtiːn/',['nine','teen'],'Nineteen stars form a ring.','十九枚星籌排成一圈。'],
  ['TWENTY','二十','/ˈtwen.t̬i/',['twen','ty'],'Twenty stars fill the tray.','二十枚星籌排滿托盤。']
 ];
 const data=root.LearningData||(typeof module!=='undefined'?require('./learning-data.js'):null);if(!data)throw new Error('LearningData must load before carnival-learning-data.js');
 const topic={id:'number-carnival',icon:'🎪',name:'嘉年華數字 13–20',words:core.map(([word])=>word)};
 if(!data.topics.some(t=>t.id===topic.id))data.topics.push(topic);
 for(const [word,zh,phonetic,chunks,en,sentenceZh]of core){
  if(!data.entries.some(e=>e.word.toUpperCase()===word))data.entries.push({id:'carnival-'+word.toLowerCase(),word,zh,topic:'Numbers & Counting',gradeBand:'G5',grade:5,phonetic,chunks,sentence:en,sentenceZh,sentence2:en,sentence2Zh:sentenceZh});
  const id='carnival:'+word;if(!data.sentences.some(s=>s.id===id))data.sentences.push({id,template:'number-carnival',word,en,zh:sentenceZh});
 }
 if(!data.templates.some(t=>t.id===topic.id))data.templates.push({id:topic.id,label:'At the carnival …',zh:'在嘉年華……',words:core.map(([word])=>word.toLowerCase())});
 root.LearningData=data;if(typeof module!=='undefined')module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
