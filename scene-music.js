/* Original procedural scores; no external music downloads. */
(function(root){
 const voices={
  reed:{wave:'sawtooth',overtone:'sine',ratio:2,blend:.08,attack:.05,release:.5,cutoff:1400},
  felt:{wave:'triangle',overtone:'sine',ratio:2,blend:.12,attack:.018,release:1.1,cutoff:1600},
  pluck:{wave:'triangle',overtone:'sine',ratio:2,blend:.24,attack:.012,release:.6,cutoff:2300},
  flute:{wave:'sine',overtone:'sine',ratio:2,blend:.08,attack:.09,release:.7,cutoff:1800},
  mallet:{wave:'sine',overtone:'sine',ratio:3,blend:.16,attack:.008,release:.42,cutoff:3200},
  bell:{wave:'sine',overtone:'sine',ratio:2.76,blend:.10,attack:.008,release:1.6,cutoff:4200},
  glass:{wave:'sine',overtone:'sine',ratio:3.99,blend:.06,attack:.018,release:1.8,cutoff:4800},
  strings:{wave:'triangle',overtone:'sine',ratio:1.002,blend:.2,attack:.28,release:1.2,cutoff:900},
  bass:{wave:'sine',overtone:'triangle',ratio:2,blend:.08,attack:.025,release:.3,cutoff:440},
  pulse:{wave:'sine',overtone:'sine',ratio:2,blend:.03,attack:.006,release:.09,cutoff:600}
 };
 const spec=[
  ['zone21','氣象台｜雲縫間的風鈴','微風鈴音・輕柔木琴',76,4,'flute','glass',[60,57,53,55],[[0,4,7,11],[0,3,7,10],[0,4,7],[0,4,7,11]],[76,null,79,null,81,79,null,76,74,null,76,null,72,null,74,null],.006],
  ['zone16','潮間帶｜暮潮觀察小曲','潮聲般留白・柔和木琴與長笛',72,6,'flute','glass',[55,60,52,57],[[0,4,7,11],[0,3,7,10],[0,4,7],[0,4,7,11]],[72,null,76,79,null,76,74,null,72,null,67,null,69,72,null,null],.004],
  ['zone17','圖書館｜橘階故事時光','溫暖毛氈琴・木笛短句與安靜長音',68,4,'felt','flute',[57,53,60,55],[[0,4,7,11],[0,3,7,10],[0,4,7],[0,5,7,11]],[76,null,79,81,null,79,76,null,72,null,74,76,null,72,null,null],.0],
  ['zone18','創客工坊｜小車測試節拍','木琴點擊・輕柔電子脈衝',96,4,'mallet','pluck',[62,59,55,57],[[0,4,7,11],[0,3,7,10],[0,4,7],[0,4,7,11]],[76,79,null,81,79,null,76,74,72,null,74,76,null,72,null,null],.012],
  ['zone19','嘉年華｜星星點燈','明亮木琴與旋轉鈴音・輕快三拍',112,3,'mallet','bell',[60,64,67,72],[[0,4,7,11],[0,3,7,10],[0,4,7],[0,4,7,11]],[72,76,79,null,81,79,76,null,79,83,84,null,83,79,76,null],.014],
  ['zone20','彩繪工坊｜龍鳳紙鳶','溫暖木琴與柔和笛音・手作節奏',84,4,'felt','flute',[60,57,53,55],[[0,4,7,11],[0,3,7,10],[0,4,7],[0,4,7,11]],[72,null,76,79,null,81,79,null,76,null,74,72,null,69,72,null],.008],
  ['zone14','溫室｜葉影與玻璃晨光','疏朗玻璃音・溫暖撥弦',74,3,'glass','pluck',[65,62,58,60],[[0,4,7,11],[0,3,7,10],[0,4,7],[0,4,7,11]],[81,null,84,86,null,84,81,null,79,77,null,81],.0],
  ['learningHub','大廳｜午後語言花園','柔軟琴音・輕柔撥弦',78,4,'felt','pluck',[65,62,58,60],[[0,4,7,11],[0,3,7,10],[0,4,7,11],[0,4,7]],[77,null,81,null,84,null,81,79,77,null,74,null,72,74,null,null],.0],
  ['zone1','書齋｜暖光小夜曲','柔軟琴音・慢板',76,4,'felt','strings',[60,57,53,55],[[0,4,7,11],[0,3,7,10],[0,4,7,11],[0,5,7,10]],[72,null,76,null,79,76,null,74,72,null,69,null,72,null,67,null],.0],
  ['zone2','市集｜陽光散步','撥弦・輕快民謠',104,4,'pluck','felt',[55,52,60,62],[[0,4,7],[0,3,7],[0,4,7],[0,4,7]],[74,79,null,81,79,76,74,null,76,79,83,null,81,79,74,null],.018],
  ['zone3','花園｜泉水與晨風','笛音・柔和豎琴感',70,4,'flute','pluck',[53,50,58,60],[[0,4,7],[0,3,7],[0,4,7],[0,4,7]],[77,null,null,79,81,null,84,null,81,null,77,null,74,null,null,77],.0],
  ['zone4','操場｜小小接力隊','木琴・明亮節拍',118,4,'mallet','pluck',[60,65,57,55],[[0,4,7],[0,4,7],[0,3,7],[0,4,7]],[72,76,79,null,79,81,79,76,74,77,81,null,79,76,72,null],.034],
  ['zone5','車站｜星光三拍舞','柔軟琴音・三拍華爾滋',92,3,'felt','strings',[62,59,55,57],[[0,4,7],[0,3,7],[0,4,7],[0,4,7]],[74,null,78,81,null,78,83,null,81,78,74,null],.012],
  ['zone6','海港｜乘風出航','撥弦・六八拍搖曳',90,3,'pluck','flute',[55,60,52,62],[[0,4,7],[0,4,7],[0,3,7],[0,4,7]],[79,81,83,86,null,83,81,79,76,74,null,79],.019],
  ['zone7','觀測站｜星軌漫遊','玻璃音・疏朗氛圍',62,4,'glass','strings',[57,53,60,55],[[0,3,7,14],[0,4,7,11],[0,4,7,11],[0,5,7,10]],[81,null,null,null,83,null,84,null,88,null,null,86,84,null,null,null],.0],
  ['zone8','冰雪｜極光結晶','冰晶鈴音・緩慢旋律',66,4,'bell','glass',[64,61,57,59],[[0,4,7,11],[0,3,7],[0,4,7],[0,4,7]],[88,null,90,null,92,null,null,95,92,null,88,null,85,null,null,null],.0],
  ['zone9','殿堂｜古老星辰之門','弦音・莊重和聲',72,4,'strings','felt',[52,48,55,50],[[0,3,7],[0,4,7],[0,4,7],[0,4,7]],[76,null,null,79,83,null,81,null,79,null,76,null,74,null,null,null],.008],
  ['zone13','口琴館｜掌心小奏鳴','簧片音色・柔和展館小品',82,4,'reed','felt',[60,65,57,55],[[0,4,7,11],[0,4,7,11],[0,3,7],[0,4,7]],[72,null,74,76,77,null,79,null,76,null,74,72,71,null,72,null],.0],
  ['zone12','校園｜迎賓小鼓隊','木琴・五聲旋律與輕鼓點',100,4,'mallet','flute',[60,65,62,55],[[0,4,7],[0,4,7],[0,3,7],[0,4,7]],[72,74,76,null,79,81,79,null,76,74,72,null,74,76,79,null],.024],
  ['zone11','餐廳｜暖湯小舞曲','撥弦・輕柔餐桌舞曲',96,3,'pluck','felt',[60,57,65,55],[[0,4,7,11],[0,3,7,10],[0,4,7,11],[0,4,7,10]],[76,null,79,81,null,79,77,76,null,74,72,null],.009],
  ['zone10','空島｜虹光歸途','鐘琴・明朗冒險',108,4,'bell','pluck',[60,57,65,55],[[0,4,7],[0,3,7],[0,4,7],[0,4,7]],[72,76,79,null,84,null,83,79,81,79,76,null,74,76,72,null],.022]
 ];
 const themes=Object.fromEntries(spec.map(([key,name,style,bpm,meter,lead,accompaniment,roots,intervals,motif,rhythm])=>[key,{key,name,style,bpm,meter,lead,accompaniment,roots,intervals,motif,rhythm}]));
 function frequency(midi){return 440*Math.pow(2,(midi-69)/12);}
 function events(theme,step){
  const perBar=theme.meter*2,bar=Math.floor(step/perBar),inBar=step%perBar,section=Math.floor(bar/4)%4,cycle=Math.floor(bar/16),ci=bar%4,rootNote=theme.roots[ci],chord=theme.intervals[ci].map(i=>rootNote+i),result=[];
  const add=(note,voice,duration,level,pan=0)=>result.push({frequency:frequency(note),voice,duration,level,pan});
  const beat=60/theme.bpm,stepSeconds=beat/2;
  // A / B / quieter A / full B form. Alternate loops alter register and answer phrases.
  const index=(step+(section%2?theme.motif.length/2:0))%theme.motif.length;
  const note=theme.motif[index];
  if(note!==null && !(section===2 && inBar%4===3))add(note+(cycle%2 && section===3?-12:0),theme.lead,beat*(theme.lead==='strings'?1.7:.85),.13,Math.sin(bar)*.12);
  if(inBar===0){add(rootNote-24,'bass',beat*1.8,.12);if(section!==2)chord.slice(0,3).forEach((n,i)=>add(n,theme.accompaniment,beat*(theme.meter-.3),.032,(i-1)*.25));}
  if(inBar%2===0 && inBar>0)add(chord[(inBar/2+bar)%chord.length]+(theme.accompaniment==='glass'?12:0),theme.accompaniment,beat*.8,.047,inBar%4?.3:-.3);
  if(theme.rhythm && (inBar===0 || inBar===theme.meter))add(inBar===0?36:48,'pulse',.12,theme.rhythm);
  if(section===3 && inBar===perBar-1)add(chord[(bar+1)%chord.length]+12,theme.accompaniment,beat,.04,-.2);
  return {events:result,stepSeconds,section,cycle};
 }
 const api={themes,voices,frequency,events};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.SceneMusic=api;
})(typeof window!=='undefined'?window:globalThis);
