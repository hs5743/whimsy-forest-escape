/* Chapter 20 vocabulary is selected from GEPTKid_wordlist02.pdf. */
(function(root){
 'use strict';
 const entries={
  BLACKBOARD:{zh:'黑板',phonics:'/ˈblæk.bɔːrd/',sentence:'The blackboard shows our art plan.',sentenceZh:'黑板上有我們的美術計畫。',chunks:['black','board']},
  PICTURE:{zh:'圖畫；照片',phonics:'/ˈpɪk.tʃɚ/',sentence:'Look at the lion picture.',sentenceZh:'看看這張獅子圖畫。',chunks:['pic','ture']},
  PENCIL:{zh:'鉛筆',phonics:'/ˈpen.səl/',sentence:'I draw with a pencil.',sentenceZh:'我用鉛筆畫圖。',chunks:['pen','cil']},
  RULER:{zh:'尺',phonics:'/ˈruː.lɚ/',sentence:'The ruler is long.',sentenceZh:'這把尺很長。',chunks:['rul','er']},
  GLUE:{zh:'膠水；黏著',phonics:'/ɡluː/',sentence:'Use glue to join the paper scales.',sentenceZh:'用膠水把紙鱗片黏起來。',chunks:['glue']},
  MARKER:{zh:'彩色筆；麥克筆',phonics:'/ˈmɑːr.kɚ/',sentence:'Color the lion with a marker.',sentenceZh:'用彩色筆替獅子上色。',chunks:['mark','er']},
  ART:{zh:'美術；藝術',phonics:'/ɑːrt/',sentence:'Art is fun.',sentenceZh:'美術創作很好玩。',chunks:['art']},
  ENGLISH:{zh:'英語；英文',phonics:'/ˈɪŋ.ɡlɪʃ/',sentence:'Read the English cards.',sentenceZh:'讀一讀英語卡片。',chunks:['Eng','lish']}
 };
 for(const [word,e]of Object.entries(entries))if(!VOCAB_DATA[word])VOCAB_DATA[word]={word,zh:e.zh,phonics:e.phonics,sentence:e.sentence,sentenceZh:e.sentenceZh,category:'新港校園藝術工坊',mascot:'owl',mascotName:'貓頭鷹美術老師 Ollie',mascotImg:'assets/textures/owl-guide.png',dialogue:e.sentence,dialogueZh:e.sentenceZh,prompt:'先在工坊裡找到實物，再聽示範並口說 '+word+'。',matchKeywords:[word.toLowerCase()],xp:50,color:'#b76a4d',chunks:e.chunks};
 root.ArtWorkshopVocabulary=entries;
})(typeof window!=='undefined'?window:globalThis);
