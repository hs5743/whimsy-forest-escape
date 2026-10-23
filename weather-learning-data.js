/* Add new weather words and oral sentence cards to the free-learning lounge. */
(function(root){
 'use strict';
 const words=[
  ['WEATHER','天氣','/ˈweð.ɚ/',['weath','er'],'How is the weather today?','今天天氣如何？'],
  ['CLOUDY','多雲的','/ˈklaʊ.di/',['cloud','y'],'It is cloudy today.','今天多雲。'],
  ['RAIN','雨；下雨','/reɪn/',['rain'],'I hear the rain.','我聽見雨聲。'],
  ['RAINY','下雨的','/ˈreɪ.ni/',['rain','y'],'It is rainy today.','今天下雨。'],
  ['SUNNY','晴朗的','/ˈsʌn.i/',['sun','ny'],'It is sunny today.','今天晴朗。'],
  ['WINDY','有風的','/ˈwɪn.di/',['wind','y'],'It is windy today.','今天風很大。'],
  ['HOT','熱的','/hɑːt/',['hot'],'It is hot today.','今天很熱。'],
  ['WET','濕的','/wet/',['wet'],'My coat is wet.','我的外套濕了。']
 ];
 const data=root.LearningData||(typeof module!=='undefined'?require('./learning-data.js'):null);
 if(!data)throw new Error('LearningData must load before weather-learning-data.js');
 const topic={id:'weather',icon:'🌦️',name:'天氣與氣象',words:words.map(([word])=>word)};
 if(!data.topics.some(t=>t.id===topic.id))data.topics.push(topic);
 for(const [word,zh,phonetic,chunks,en,sentenceZh]of words){
  if(!data.entries.some(e=>e.word.toUpperCase()===word))data.entries.push({id:'weather-'+word.toLowerCase(),word,zh,topic:'Weather',gradeBand:'G4',grade:4,phonetic,chunks,sentence:en,sentenceZh,sentence2:en,sentence2Zh:sentenceZh});
  const id='weather:'+word;
  if(!data.sentences.some(s=>s.id===id))data.sentences.push({id,template:'weather',word,en,zh:sentenceZh});
 }
 if(!data.templates.some(t=>t.id==='weather'))data.templates.push({id:'weather',label:'Today’s weather …',zh:'今天天氣……',words:words.map(([word])=>word.toLowerCase())});
 root.LearningData=data;
 if(typeof module!=='undefined')module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
