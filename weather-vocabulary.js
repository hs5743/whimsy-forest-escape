/* Chapter 15 vocabulary cards; words are verified against GEPTKid_wordlist02.pdf. */
(function(root){
 'use strict';
 const entries={
  WEATHER:{zh:'天氣',phonics:'/ˈweð.ɚ/',sentence:'How is the weather today?',sentenceZh:'今天天氣如何？',chunks:['weath','er']},
  CLOUDY:{zh:'多雲的',phonics:'/ˈklaʊ.di/',sentence:'It is cloudy today.',sentenceZh:'今天多雲。',chunks:['cloud','y']},
  RAIN:{zh:'雨；下雨',phonics:'/reɪn/',sentence:'I hear the rain.',sentenceZh:'我聽見雨聲。',chunks:['rain']},
  RAINY:{zh:'下雨的',phonics:'/ˈreɪ.ni/',sentence:'It is rainy today.',sentenceZh:'今天下雨。',chunks:['rain','y']},
  SUNNY:{zh:'晴朗的',phonics:'/ˈsʌn.i/',sentence:'It is sunny today.',sentenceZh:'今天晴朗。',chunks:['sun','ny']},
  WINDY:{zh:'有風的',phonics:'/ˈwɪn.di/',sentence:'It is windy today.',sentenceZh:'今天風很大。',chunks:['wind','y']},
  HOT:{zh:'熱的',phonics:'/hɑːt/',sentence:'It is hot today.',sentenceZh:'今天很熱。',chunks:['hot']},
  WET:{zh:'濕的',phonics:'/wet/',sentence:'My coat is wet.',sentenceZh:'我的外套濕了。',chunks:['wet']}
 };
 for(const [word,e]of Object.entries(entries))if(!VOCAB_DATA[word])VOCAB_DATA[word]={word,zh:e.zh,phonics:e.phonics,sentence:e.sentence,sentenceZh:e.sentenceZh,category:'雲雨氣象觀測台',mascot:'owl',mascotName:'貓頭鷹氣象老師 Ollie',mascotImg:'assets/textures/owl-guide.png',dialogue:e.sentence,dialogueZh:e.sentenceZh,prompt:'先聽示範，再看天氣線索，完整口說 '+word+'。',matchKeywords:[word.toLowerCase()],xp:50,color:'#466f83',chunks:e.chunks};
 root.WeatherVocabulary=entries;
})(typeof window!=='undefined'?window:globalThis);
