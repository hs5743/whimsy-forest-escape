/* Add the library topic and its GEPT Kids vocabulary and sentence cards. */
(function(root){
 'use strict';
 const words=[
  ['SHELF','架子；層架','/ʃelf/',['shelf'],'The books are on the shelf.','書本放在層架上。'],
  ['STORY','故事','/ˈstɔː.ri/',['sto','ry'],'This is an exciting story.','這是一個精彩的故事。'],
  ['STUDENT','學生','/ˈstuː.dənt/',['stu','dent'],'The student is reading.','學生正在閱讀。'],
  ['TEACHER','老師','/ˈtiː.tʃɚ/',['teach','er'],'The teacher can help us.','老師可以幫助我們。'],
  ['STUDY','學習；研讀','/ˈstʌd.i/',['stud','y'],'We study together.','我們一起學習。'],
  ['QUIET','安靜的','/ˈkwaɪ.ət/',['qui','et'],'Please be quiet.','請保持安靜。'],
  ['BORING','無聊的','/ˈbɔː.rɪŋ/',['bor','ing'],'The story is not boring.','這個故事並不無聊。'],
  ['EXCITING','令人興奮的；精彩的','/ɪkˈsaɪ.tɪŋ/',['ex','cit','ing'],'The ending is exciting!','結局真精彩！']
 ];
 const data=root.LearningData||(typeof module!=='undefined'?require('./learning-data.js'):null);
 if(!data)throw new Error('LearningData must load before library-learning-data.js');
 const topic={id:'library',icon:'📖',name:'閱讀與故事',words:words.map(([word])=>word)};
 if(!data.topics.some(t=>t.id===topic.id))data.topics.push(topic);
 for(const [word,zh,phonetic,chunks,en,sentenceZh]of words){
  if(!data.entries.some(e=>e.word.toUpperCase()===word))data.entries.push({id:'library-'+word.toLowerCase(),word,zh,topic:'School & Reading',gradeBand:'G5',grade:5,phonetic,chunks,sentence:en,sentenceZh,sentence2:en,sentence2Zh:sentenceZh});
  const id='library:'+word;
  if(!data.sentences.some(s=>s.id===id))data.sentences.push({id,template:'library',word,en,zh:sentenceZh});
 }
 if(!data.templates.some(t=>t.id==='library'))data.templates.push({id:'library',label:'In the library …',zh:'在圖書館……',words:words.map(([word])=>word.toLowerCase())});
 root.LearningData=data;if(typeof module!=='undefined')module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
