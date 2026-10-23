/* Spoken vocabulary for the makerspace; the four STEM extension words are explicitly outside the supplied GEPT Kids core. */
(function(root){
 'use strict';
 const entries={
  ROBOT:{zh:'機器人',phonics:'/ˈroʊ.bɑːt/',sentence:'This is a robot.',sentenceZh:'這是一台機器人。',chunks:['ro','bot'],category:'創客工坊',source:'GEPT Kids p.15'},
  MAKE:{zh:'製作；做',phonics:'/meɪk/',sentence:'We make a robot.',sentenceZh:'我們製作一台機器人。',chunks:['make'],category:'創客工坊',source:'GEPT Kids p.16'},
  FAST:{zh:'快的；快地',phonics:'/fæst/',sentence:'The small gear is fast.',sentenceZh:'小齒輪轉得很快。',chunks:['fast'],category:'創客工坊',source:'GEPT Kids p.12'},
  SLOW:{zh:'慢的；慢地',phonics:'/sloʊ/',sentence:'The large gear is slow.',sentenceZh:'大齒輪轉得很慢。',chunks:['slow'],category:'創客工坊',source:'GEPT Kids p.12'},
  TURN:{zh:'轉彎；轉動',phonics:'/tɝːn/',sentence:'The robot can turn.',sentenceZh:'機器人會轉彎。',chunks:['turn'],category:'創客工坊',source:'GEPT Kids p.13'},
  WORK:{zh:'工作；運作',phonics:'/wɝːk/',sentence:'We work together.',sentenceZh:'我們一起合作。',chunks:['work'],category:'創客工坊',source:'GEPT Kids p.7'},
  READY:{zh:'準備好的',phonics:'/ˈred.i/',sentence:'The robot is ready.',sentenceZh:'機器人準備好了。',chunks:['read','y'],category:'創客工坊',source:'GEPT Kids p.17'},
  START:{zh:'開始；出發',phonics:'/stɑːrt/',sentence:"Let's start!",sentenceZh:'我們開始吧！',chunks:['start'],category:'創客工坊',source:'GEPT Kids p.16'},
  MOTOR:{zh:'馬達',phonics:'/ˈmoʊ.t̬ɚ/',sentence:'The motor turns the wheel.',sentenceZh:'馬達帶動車輪。',chunks:['mo','tor'],category:'創客延伸詞',source:'補充詞彙，非 GEPT Kids 核心'},
  WHEEL:{zh:'車輪',phonics:'/wiːl/',sentence:'The wheel moves the robot.',sentenceZh:'車輪帶動機器人前進。',chunks:['wheel'],category:'創客延伸詞',source:'補充詞彙，非 GEPT Kids 核心'},
  BATTERY:{zh:'電池',phonics:'/ˈbæt̬.ɚ.i/',sentence:'The battery is full.',sentenceZh:'電池電量充足。',chunks:['bat','ter','y'],category:'創客延伸詞',source:'補充詞彙，非 GEPT Kids 核心'},
  SENSOR:{zh:'感測器',phonics:'/ˈsen.sɚ/',sentence:'The sensor sees the line.',sentenceZh:'感測器會辨識地面線。',chunks:['sen','sor'],category:'創客延伸詞',source:'補充詞彙，非 GEPT Kids 核心'}
 };
 const vocab=root.VOCAB_DATA||(typeof VOCAB_DATA!=='undefined'?VOCAB_DATA:null);if(!vocab)throw new Error('VOCAB_DATA must load before makerspace-vocabulary.js');
 for(const [word,e]of Object.entries(entries))vocab[word]={...(vocab[word]||{}),word,zh:e.zh,phonics:e.phonics,sentence:e.sentence,sentenceZh:e.sentenceZh,category:e.category,source:e.source,mascot:'owl',mascotName:'創客工坊導師 Ollie',mascotImg:'assets/textures/owl-guide.png',dialogue:e.sentence,dialogueZh:e.sentenceZh,prompt:'先觀察創客工坊的零件，再聽示範並口說 '+word+'。',matchKeywords:[word.toLowerCase()],xp:50,color:word.length%2?'#397b79':'#486e91',chunks:e.chunks};
 root.MakerspaceVocabulary=entries;
})(typeof window!=='undefined'?window:globalThis);
