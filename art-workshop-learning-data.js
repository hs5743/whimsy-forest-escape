/* Add the new school-art topic, fresh sentence cards and review content to the learning lounge. */
(function(root){
 'use strict';
 const words=[
  ['BLACKBOARD','黑板','/ˈblæk.bɔːrd/',['black','board'],'The blackboard shows our art plan.','黑板上有我們的美術計畫。'],
  ['PICTURE','圖畫；照片','/ˈpɪk.tʃɚ/',['pic','ture'],'Look at the lion picture.','看看這張獅子圖畫。'],
  ['PENCIL','鉛筆','/ˈpen.səl/',['pen','cil'],'I draw with a pencil.','我用鉛筆畫圖。'],
  ['RULER','尺','/ˈruː.lɚ/',['rul','er'],'The ruler is long.','這把尺很長。'],
  ['GLUE','膠水；黏著','/ɡluː/',['glue'],'Use glue to join the paper scales.','用膠水把紙鱗片黏起來。'],
  ['MARKER','彩色筆；麥克筆','/ˈmɑːr.kɚ/',['mark','er'],'Color the lion with a marker.','用彩色筆替獅子上色。'],
  ['ART','美術；藝術','/ɑːrt/',['art'],'Art is fun.','美術創作很好玩。'],
  ['ENGLISH','英語；英文','/ˈɪŋ.ɡlɪʃ/',['Eng','lish'],'Read the English cards.','讀一讀英語卡片。']
 ];
 const data=root.LearningData||(typeof module!=='undefined'?require('./learning-data.js'):null);
 if(!data)throw new Error('LearningData must load before art-workshop-learning-data.js');
 const topic={id:'school-art',icon:'🦁',name:'校園美術與舞獅創作',words:words.map(([word])=>word)};
 if(!data.topics.some(t=>t.id===topic.id))data.topics.push(topic);
 for(const [word,zh,phonetic,chunks,en,sentenceZh]of words){
  if(!data.entries.some(e=>e.word.toUpperCase()===word))data.entries.push({id:'school-art-'+word.toLowerCase(),word,zh,topic:'School Art',gradeBand:'G4',grade:4,phonetic,chunks,sentence:en,sentenceZh,sentence2:en,sentence2Zh:sentenceZh});
  const id='school-art:'+word;
  if(!data.sentences.some(s=>s.id===id))data.sentences.push({id,template:'school-art',word,en,zh:sentenceZh});
 }
 if(!data.templates.some(t=>t.id==='school-art'))data.templates.push({id:'school-art',label:'Let’s make school art …',zh:'一起做校園美術作品……',words:words.map(([word])=>word.toLowerCase())});
 root.LearningData=data;
 if(typeof module!=='undefined')module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
