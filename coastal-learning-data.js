/* Add chapter 16 words and sentence cards to the free-learning lounge. */
(function(root){
 'use strict';
 const words=[
  ['BEACH','海灘','/biːtʃ/',['beach'],'We walk on the beach.','我們在海灘上散步。'],
  ['SEA','海；海洋','/siː/',['sea'],'The sea is calm today.','今天海面很平靜。'],
  ['SCIENCE','科學','/ˈsaɪ.əns/',['sci','ence'],'Science helps us learn about nature.','科學幫助我們認識自然。'],
  ['DIFFERENT','不同的','/ˈdɪf.ɚ.ənt/',['dif','fer','ent'],'The two places look different.','這兩個地方看起來不同。'],
  ['INTERESTING','有趣的','/ˈɪn.trə.stɪŋ/',['in','ter','est','ing'],'It is very interesting.','這非常有趣。'],
  ['IN FRONT OF','在……前面','/ɪn frʌnt əv/',['in','front','of'],'The sea is in front of the station.','海面在觀測站前方。'],
  ['LOOK','看；注視','/lʊk/',['look'],'Look at the sea.','看看海面。'],
  ['TRASH','垃圾','/træʃ/',['trash'],'Do not leave trash here.','不要把垃圾留在這裡。']
 ];
 const data=root.LearningData||(typeof module!=='undefined'?require('./learning-data.js'):null);
 if(!data)throw new Error('LearningData must load before coastal-learning-data.js');
 const topic={id:'coast',icon:'🦀',name:'海岸與自然觀察',words:words.map(([word])=>word)};
 if(!data.topics.some(t=>t.id===topic.id))data.topics.push(topic);
 for(const [word,zh,phonetic,chunks,en,sentenceZh]of words){
  if(!data.entries.some(e=>e.word.toUpperCase()===word))data.entries.push({id:'coast-'+word.toLowerCase(),word,zh,topic:'Coast & Nature',gradeBand:'G4',grade:4,phonetic,chunks,sentence:en,sentenceZh,sentence2:en,sentence2Zh:sentenceZh});
  const id='coast:'+word;
  if(!data.sentences.some(s=>s.id===id))data.sentences.push({id,template:'coast',word,en,zh:sentenceZh});
 }
 if(!data.templates.some(t=>t.id==='coast'))data.templates.push({id:'coast',label:'Coastal nature …',zh:'海岸自然……',words:words.map(([word])=>word.toLowerCase())});
 root.LearningData=data;
 if(typeof module!=='undefined')module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
