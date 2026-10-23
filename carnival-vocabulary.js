/* Local presentation vocabulary for the GEPT-number carnival chapter. */
(function(root){
 'use strict';
 const rows={
  THIRTEEN:['十三','/ˌθɝːˈtiːn/','Thirteen stars shine.','十三枚星籌發亮。',['thirteen']],
  FOURTEEN:['十四','/ˌfɔːrˈtiːn/','Fourteen stars glow.','十四顆星星發光。',['fourteen']],
  FIFTEEN:['十五','/ˌfɪfˈtiːn/','Fifteen stars sparkle.','十五枚星籌閃耀。',['fifteen']],
  SIXTEEN:['十六','/ˌsɪkˈstiːn/','Sixteen stars shine bright.','十六枚星籌閃閃發亮。',['sixteen']],
  SEVENTEEN:['十七','/ˌsev.ənˈtiːn/','Seventeen stars glow blue.','十七枚藍色星籌發光。',['seventeen']],
  EIGHTEEN:['十八','/ˌeɪˈtiːn/','Eighteen stars light the booth.','十八枚星籌照亮攤位。',['eighteen']],
  NINETEEN:['十九','/ˌnaɪnˈtiːn/','Nineteen stars form a ring.','十九枚星籌排成一圈。',['nineteen']],
  TWENTY:['二十','/ˈtwen.t̬i/','Twenty stars fill the tray.','二十枚星籌排滿托盤。',['twenty']]
 };
 for(const [word,[zh,phonetics,sentence,sentenceZh,matchKeywords]]of Object.entries(rows))if(!root.VOCAB_DATA[word])root.VOCAB_DATA[word]={word,zh,phonetics,sentence,sentenceZh,category:'嘉年華數字 13–20',mascot:'rabbit',mascotName:'兔子計數員 Pip',dialogue:sentence,dialogueZh:sentenceZh,prompt:'先數清現場的燈或星籌，再完整口說 '+word+'。',matchKeywords,xp:50,color:'#8664a8',chunks:matchKeywords[0].split(/(?=[aeiou])/)};
 root.CarnivalVocabulary=rows;
})(typeof window!=='undefined'?window:globalThis);
