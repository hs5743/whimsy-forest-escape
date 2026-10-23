/* Register the school-library chapter words with the spoken vocabulary cards. */
(function(root){
 'use strict';
 const entries={
  SHELF:{zh:'架子；層架',phonics:'/ʃelf/ • S-H-E-L-F',sentence:'The books are on the shelf.',sentenceZh:'書本放在層架上。',chunks:['shelf']},
  STORY:{zh:'故事',phonics:'/ˈstɔː.ri/ • S-T-O-R-Y',sentence:'This is an exciting story.',sentenceZh:'這是一個精彩的故事。',chunks:['sto','ry']},
  STUDENT:{zh:'學生',phonics:'/ˈstuː.dənt/ • S-T-U-D-E-N-T',sentence:'The student is reading.',sentenceZh:'學生正在閱讀。',chunks:['stu','dent']},
  TEACHER:{zh:'老師',phonics:'/ˈtiː.tʃɚ/ • T-E-A-C-H-E-R',sentence:'The teacher can help us.',sentenceZh:'老師可以幫助我們。',chunks:['teach','er']},
  STUDY:{zh:'學習；研讀',phonics:'/ˈstʌd.i/ • S-T-U-D-Y',sentence:'We study together.',sentenceZh:'我們一起學習。',chunks:['stud','y']},
  QUIET:{zh:'安靜的',phonics:'/ˈkwaɪ.ət/ • Q-U-I-E-T',sentence:'Please be quiet.',sentenceZh:'請保持安靜。',chunks:['qui','et']},
  BORING:{zh:'無聊的',phonics:'/ˈbɔː.rɪŋ/ • B-O-R-I-N-G',sentence:'The story is not boring.',sentenceZh:'這個故事並不無聊。',chunks:['bor','ing']},
  EXCITING:{zh:'令人興奮的；精彩的',phonics:'/ɪkˈsaɪ.tɪŋ/ • E-X-C-I-T-I-N-G',sentence:'The ending is exciting!',sentenceZh:'結局真精彩！',chunks:['ex','cit','ing']}
 };
 for(const [word,e]of Object.entries(entries))root.VOCAB_DATA[word]={...(root.VOCAB_DATA[word]||{}),word,zh:e.zh,phonics:e.phonics,sentence:e.sentence,sentenceZh:e.sentenceZh,category:'新港國小圖書館',mascot:'owl',mascotName:'貓頭鷹圖書館老師 Ollie',mascotImg:'assets/textures/owl-guide.png',dialogue:e.sentence,dialogueZh:e.sentenceZh,prompt:'先聽示範，再看圖書館線索，完整口說 '+word+'。',matchKeywords:[word.toLowerCase()],xp:50,color:'#496b70',chunks:e.chunks};
 root.LibraryVocabulary=entries;
})(typeof window!=='undefined'?window:globalThis);
