/* Makerspace lesson cards: GEPT Kids core words plus an explicitly separate STEM extension topic. */
(function(root){
 'use strict';
 const core=[
  ['ROBOT','機器人','/ˈroʊ.bɑːt/',['ro','bot'],'This is a robot.','這是一台機器人。'],
  ['MAKE','製作；做','/meɪk/',['make'],'We make a robot.','我們製作一台機器人。'],
  ['FAST','快的；快地','/fæst/',['fast'],'The robot is fast.','機器人很快。'],
  ['SLOW','慢的；慢地','/sloʊ/',['slow'],'The robot is slow.','機器人很慢。'],
  ['TURN','轉彎；轉動','/tɝːn/',['turn'],'The robot can turn.','機器人會轉彎。'],
  ['WORK','工作；運作','/wɝːk/',['work'],'We work together.','我們一起合作。'],
  ['READY','準備好的','/ˈred.i/',['read','y'],'The robot is ready.','機器人準備好了。'],
  ['START','開始；出發','/stɑːrt/',['start'],"Let's start!",'我們開始吧！']
 ];
 const extension=[
  ['MOTOR','馬達','/ˈmoʊ.t̬ɚ/',['mo','tor'],'The motor turns the wheel.','馬達帶動車輪。'],
  ['WHEEL','車輪','/wiːl/',['wheel'],'The wheel moves the robot.','車輪帶動機器人前進。'],
  ['BATTERY','電池','/ˈbæt̬.ɚ.i/',['bat','ter','y'],'The battery is full.','電池電量充足。'],
  ['SENSOR','感測器','/ˈsen.sɚ/',['sen','sor'],'The sensor sees the line.','感測器會辨識地面線。']
 ];
 const data=root.LearningData||(typeof module!=='undefined'?require('./learning-data.js'):null);if(!data)throw new Error('LearningData must load before makerspace-learning-data.js');
 const topics=[{id:'makerspace',icon:'🤖',name:'機器人與創作',words:core.map(([word])=>word)},{id:'maker-tools',icon:'⚙️',name:'創客工具延伸詞',words:extension.map(([word])=>word)}];
 for(const topic of topics)if(!data.topics.some(t=>t.id===topic.id))data.topics.push(topic);
 for(const [group,template,topicName]of [[core,'makerspace','Robots & Making'],[extension,'maker-tools','Maker Tools · Extension']])for(const [word,zh,phonetic,chunks,en,sentenceZh]of group){
  if(!data.entries.some(e=>e.word.toUpperCase()===word))data.entries.push({id:'maker-'+word.toLowerCase(),word,zh,topic:topicName,gradeBand:'G5',grade:5,phonetic,chunks,sentence:en,sentenceZh,sentence2:en,sentence2Zh:sentenceZh});
  const id=template+':'+word;if(!data.sentences.some(s=>s.id===id))data.sentences.push({id,template,word,en,zh:sentenceZh});
 }
 for(const [topic,label,zh,group]of [[topics[0],'At the robot table …','在機器人工作桌……',core],[topics[1],'Robot parts …','機器人零件……',extension]])if(!data.templates.some(t=>t.id===topic.id))data.templates.push({id:topic.id,label,zh,words:group.map(([word])=>word.toLowerCase())});
 root.LearningData=data;if(typeof module!=='undefined')module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
