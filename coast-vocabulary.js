/* Chapter 16 target words checked against GEPTKid_wordlist02.pdf. */
(function(root){
 'use strict';
 const entries={
  BEACH:{zh:'海灘',phonics:'/biːtʃ/',sentence:'We walk on the beach.',sentenceZh:'我們在海灘上散步。',chunks:['beach']},
  SEA:{zh:'海；海洋',phonics:'/siː/',sentence:'The sea is calm today.',sentenceZh:'今天海面很平靜。',chunks:['sea']},
  SCIENCE:{zh:'科學',phonics:'/ˈsaɪ.əns/',sentence:'Science helps us learn about nature.',sentenceZh:'科學幫助我們認識自然。',chunks:['sci','ence']},
  DIFFERENT:{zh:'不同的',phonics:'/ˈdɪf.ɚ.ənt/',sentence:'The two places look different.',sentenceZh:'這兩個地方看起來不同。',chunks:['dif','fer','ent']},
  INTERESTING:{zh:'有趣的',phonics:'/ˈɪn.trə.stɪŋ/',sentence:'It is very interesting.',sentenceZh:'這非常有趣。',chunks:['in','ter','est','ing']},
  'IN FRONT OF':{zh:'在……前面',phonics:'/ɪn frʌnt əv/',sentence:'The sea is in front of the station.',sentenceZh:'海面在觀測站前方。',chunks:['in','front','of']},
  LOOK:{zh:'看；注視',phonics:'/lʊk/',sentence:'Look at the sea.',sentenceZh:'看看海面。',chunks:['look']},
  TRASH:{zh:'垃圾',phonics:'/træʃ/',sentence:'Do not leave trash here.',sentenceZh:'不要把垃圾留在這裡。',chunks:['trash']}
 };
 const vocab=root.VOCAB_DATA||(typeof VOCAB_DATA!=='undefined'?VOCAB_DATA:null);
 if(!vocab)throw new Error('VOCAB_DATA must load before coast-vocabulary.js');
 for(const [word,e]of Object.entries(entries))vocab[word]={...(vocab[word]||{}),word,zh:e.zh,phonics:e.phonics,sentence:e.sentence,sentenceZh:e.sentenceZh,category:'香山潮間帶',mascot:'owl',mascotName:'濕地觀察員 Ollie',mascotImg:'assets/textures/owl-guide.png',dialogue:e.sentence,dialogueZh:e.sentenceZh,prompt:'沿著步道讀線索，想一想海岸環境，再口說 '+word+'。',matchKeywords:[word.toLowerCase()],xp:50,color:'#397b78',chunks:e.chunks};
 root.VOCAB_DATA=vocab;
 root.CoastVocabulary=entries;
})(typeof window!=='undefined'?window:globalThis);
