/* Realm-specific mechanisms. Puzzle actions never write grades or award XP. */
(function(root){
  'use strict';
  const specs={
    zone2:{title:'市集採買：四枚金幣',english:'Two apples and one milk, please.',brief:'野餐清單：蘋果兩顆、牛奶一瓶。蘋果每顆 1 枚、牛奶每瓶 2 枚、麵包每個 2 枚。你有 4 枚金幣；先找到食物並口說，再裝好購物籃結帳。BANANA 是延伸練習，不列入本次訂單。',clues:['先到蘋果攤口說兩次 APPLE，再到牛奶攤口說一次 MILK。','選兩顆蘋果、一瓶牛奶與零個麵包，總價正好 4 枚；完成口說後才能結帳。']},
    zone3:{title:'花園照護：三位小夥伴',english:'Water the tree. Feed the rabbit. Help the bird.',brief:'樹木缺水，小兔子想吃葉子，青鳥想吃種子。先在任務板選照護用品，再到場景找到夥伴並口說名稱；只有用品配對正確才算完成照護。',clues:['水給 TREE、葉子給 RABBIT、種子給 BIRD。','選好用品後，逐一找到樹、兔子與青鳥，口說 TREE、RABBIT、BIRD。']},
    zone4:{title:'運動接力：跨越終點',english:'Take the ball. Run, jump, then play soccer.',brief:'先在任務板選 BALL，再到場景依序口說 BALL、RUN、JUMP、SOCCER。順序錯誤時接力會從 RUN 重新開始；不計時，可以慢慢看線索。',clues:['選 BALL 後，到足球區口說 BALL。','沿跑道找到 RUN 與 JUMP，依序口說，再口說 SOCCER 完成接力。']},
    zone5:{title:'車站解謎：準時上車',english:'The train leaves at eight thirty. Go to platform two.',brief:'車票寫著 08:30、月台 2。先到鐘樓口說 TIME、到列車口說 TRAIN，再調整鐘面與月台並驗票。',clues:['先找到天文時鐘與星光列車，分別口說 TIME、TRAIN。','Eight thirty 是 08:30，platform two 是月台 2；完成口說後才能驗票上車。']},
    zone6:{title:'海港導航：避礁靠岸',english:'Sail to the lighthouse. Keep away from the rocks.',brief:'先在碼頭找到小艇並口說 BOAT，再依海圖使用方向鍵航行到右上方燈塔。抵達後口說 WIND，避開礁石並留在海圖範圍內。',clues:['看看海圖中礁石的位置，找一條連續的水路。','到達燈塔後口說 WIND；船每次只移動一格。']},
    zone7:{title:'觀測站：對準東方月亮',english:'Find the moon in the east.',brief:'先在日晷儀前口說 MOON，再根據觀測筆記調整方向；北 0°、東 90°、南 180°、西 270°。',clues:['筆記同時提到天體與方向。','口說 MOON，把觀測儀轉到東方 90°，再確認對準。']},
    zone8:{title:'冰雪準備：溫暖出發',english:'Wear a coat, gloves and boots. Keep warm.',brief:'在裝備面板逐一口說並選擇外套 COAT、手套 GLOVES 與雪靴 BOOTS（手套、雪靴是延伸詞）；再到營火前口說 WARM。最後把火候調到 2 格才可出發。',clues:['短褲與涼鞋可作為辨認干擾項，但不需要選取。','需要 COAT、GLOVES、BOOTS；GLOVES 與 BOOTS 是延伸詞。到營火口說 WARM，並把熱度調到 2 格。']},
    zone9:{title:'智慧殿堂：修復故事卷軸',english:'Read first. Think next. Write last.',brief:'找到大典、沉思之泉與書寫台，依序口說 READ、THINK、WRITE，讓卷軸記下正確步驟；放錯可以取回重排。',clues:['First、next、last 告訴你先後順序。','逐一找到場景中的三個目標並口說 READ、THINK、WRITE；完成後回面板蓋章。']},
    zone10:{title:'虹光空島：奏響回家之歌',english:'Listen to the music. Sing the song.',brief:'先到浮空星琴前口說 MUSIC，解鎖琴鍵練習；聽示範後用琴鍵重現 C → E → G → C，讓回家的虹橋亮起。',clues:['先找到星琴並口說 MUSIC。','聽示範旋律，留意最後一個音與第一個音相同；再依序按 C、E、G、C。']}
  };
  specs.zone15={title:'星光國際機場：啟航任務',english:'Welcome to the airport.',brief:'確認飛機、機票、行李與登機時刻表；每一步要口說完成。',clues:['先在航廈迎賓櫃檯接下啟航任務。','觀察線索後，口說完成每一步。']};
  specs.zone14={title:'玻璃溫室：花園復甦任務',english:'The garden is beautiful.',brief:'觀察昆蟲、照護幼苗與整理環境；每一步要口說完成。',clues:['先在入口接下花園委託。','探索線索後，口說完成每一步。']};
  specs.zone21={title:'雲雨氣象觀測台：尋回天氣紀錄',english:'We study the weather.',brief:'讀取雲況、雨量、日照、風力與溫度儀器；每一站都要先解讀線索，再口說過關。',clues:['先到工作單接下觀測任務。','查看目前儀器線索，再口說目標單字。']};
  specs.zone16={title:'香山潮間帶：沿著步道觀察海岸',english:'Walk and look. Keep the coast clean.',brief:'沿架高步道觀察海岸地景與泥灘棲地；尊重潮間帶生物，只在安全步道上觀察。',clues:['先在入口領取濕地觀察卡。','讀取每個現場線索，再口說新詞。']};
  specs.zone17={title:'新港國小圖書館：故事階梯尋書任務',english:'Choose a book and enjoy the story.',brief:'走進挑高圖書館，探索階梯書架、閱讀座位與故事心情卡；每一步都要口說完成。',clues:['沿著橘色階梯找到圖書館線索。','觀察空間線索，再口說目標單字。']};
  specs.zone18={title:'新港國小創客工坊：小小機器人任務',english:'We study a robot.',brief:'在遊戲化科技創作工坊裡觀察機器人、轉動齒輪和工作台；先看實物線索，再選答案並口說完成每一步。',clues:['先完成新港國小迎賓任務，校園工坊才會開放。','比較工作桌上成對齒輪的轉速，再依現場線索完成英語口說。']};
  specs.zone19={title:'魔法數字嘉年華：星環計數任務',english:'Thirteen stars shine.',brief:'沿著舊城市集的冒險星圖，進入夜間嘉年華。觀察每一站的燈環和星星籌碼，選出數量，再口說數字詞完成關卡。',clues:['先完成陽光微風市集採買，嘉年華入口才會開啟。','每站都有實際可數的燈或星星籌碼；先選數量，再口說正確的數字。']};
  specs.zone20={title:'新港校慶：舞獅彩繪工坊',english:'Let’s make art for the school festival.',brief:'在實體工作室找到黑板、舞獅壁畫與美術工具；每一個新字都要先找到物件，再口說辨識通過。',clues:['先完成新港國小舞獅迎賓任務，校慶工坊才會開放。','依工作桌與展示牆上的實物線索，找到工具後再口說完成。']};
  specs.zone13={title:'半音階口琴：掌心音樂展示館',english:'Play a song on the harmonica.',brief:'造型、簧片、滑鍵與吹吸練習。',clues:['找到完整口琴。','探索線索後，口說完成每一步。']};
  specs.zone12={title:'新港國小：舞獅迎賓任務',english:'Welcome to our school!',brief:'校史尋寶、迎賓圖卡、鼓點與舞獅口說任務。',clues:['到校門迎賓桌接下任務。','口說辨識通過才完成步驟。']};
  specs.zone11={title:'魔法餐廳：一碗熱湯的冒險',english:'Two eggs and one pumpkin, please.',brief:'穿梭三個房間，依訂單準備食材並送餐。',clues:['先到訂單台接單。','依英語線索找鑰匙、取食材、料理與送餐。']};
  const defaults={
    zone2:{cart:[0,0,0],paid:false,spoken:{APPLE:0,MILK:0}},
    zone3:{tool:'WATER',care:[false,false,false],pendingCare:null,spoken:[]},
    zone4:{equipment:'',stage:0,ballSpoken:false,pendingMove:null},
    zone5:{hour:6,minute:0,platform:1,boarded:false,spoken:[]},
    zone6:{x:0,y:2,boatSpoken:false,windSpoken:false},
    zone7:{object:'STAR',angle:0,aligned:false,moonSpoken:false},
    zone8:{gear:[],heat:0,ready:false,spokenGear:[],warmSpoken:false},
    zone9:{order:[],spoken:[],sealed:false},
    zone10:{notes:[],played:false,musicSpoken:false}
  };
  defaults.zone15={stage:0,spoken:[],choices:['','','','','','','',''],gate:0,call:0,collected:[]};
  defaults.zone14={stage:0,spoken:[],choices:['','','','','','','',''],water:0,light:0,collected:[]};
  defaults.zone21={stage:0,spoken:[],choices:['','','','','','','','']};
  defaults.zone16={stage:0,spoken:[],choices:['','','','','','','','']};
  defaults.zone17={stage:0,spoken:[],choices:['','','','','','','','']};
  defaults.zone18={stage:0,spoken:[],choices:['','','','','','','','']};
  defaults.zone19={stage:0,spoken:[],choices:['','','','','','','','']};
  defaults.zone20={stage:0,spoken:[],found:null};
  defaults.zone13={stage:0,spoken:[],choices:['','','','','',''],explored:[],melody:[]};
  defaults.zone12={stage:0,spoken:[],history:null,drawing:null,rhythm:[]};
  defaults.zone11={accepted:false,key:false,pantryOpen:false,ingredients:[0,0,0],step:0,cooked:false,served:false};
  const clone=x=>JSON.parse(JSON.stringify(x));
  const isInt=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
  const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function initial(id){if(id==='zone20')return root.ArtWorkshopChapter?.initial()||clone(defaults.zone20);if(id==='zone19')return root.CarnivalChapter?.initial()||clone(defaults.zone19);if(id==='zone18')return root.MakerspaceChapter?.initial()||clone(defaults.zone18);if(id==='zone17')return root.LibraryChapter?.initial()||clone(defaults.zone17);if(id==='zone16')return root.CoastChapter?.initial()||clone(defaults.zone16);if(id==='zone21')return root.WeatherChapter?.initial()||clone(defaults.zone21);return defaults[id]?clone(defaults[id]):null;}
  function solved(id,s){
    if(id==='zone20')return root.ArtWorkshopChapter?.solved(s)||false;
    if(id==='zone19')return root.CarnivalChapter?.solved(s)||false;
    if(id==='zone18')return root.MakerspaceChapter?.solved(s)||false;
    if(id==='zone17')return root.LibraryChapter?.solved(s)||false;
    if(id==='zone16')return root.CoastChapter?.solved(s)||false;
    if(id==='zone21')return root.WeatherChapter?.solved(s)||false;
    if(id==='zone15')return root.AirportChapter?.solved(s)||false;
    if(id==='zone14')return root.GreenhouseChapter?.solved(s)||false;
    if(id==='zone13')return root.HarmonicaChapter?.solved(s)||false;
    if(id==='zone12')return root.SchoolChapter?.solved(s)||false;
    if(id==='zone11')return root.RestaurantChapter?.solved(s)||false;
    if(!s)return false;
    switch(id){
      case 'zone2':return s.paid===true&&eq(s.cart,[2,1,0])&&s.spoken?.APPLE>=2&&s.spoken?.MILK>=1;
      case 'zone3':return eq(s.care,[true,true,true])&&['TREE','RABBIT','BIRD'].every(word=>s.spoken?.includes(word));
      case 'zone4':return s.equipment==='BALL'&&s.ballSpoken===true&&s.stage===3;
      case 'zone5':return s.boarded===true&&s.hour===8&&s.minute===30&&s.platform===2&&['TIME','TRAIN'].every(w=>s.spoken?.includes(w));
      case 'zone6':return s.x===3&&s.y===0&&s.boatSpoken===true&&s.windSpoken===true;
      case 'zone7':return s.aligned===true&&s.object==='MOON'&&s.angle===90&&s.moonSpoken===true;
      case 'zone8':return s.ready===true&&s.heat===2&&eq([...s.gear].sort(),['BOOTS','COAT','GLOVES'])&&s.warmSpoken===true;
      case 'zone9':return s.sealed===true&&eq(s.order,['READ','THINK','WRITE'])&&eq(s.spoken,['READ','THINK','WRITE']);
      case 'zone10':return s.played===true&&eq(s.notes,['C','E','G','C'])&&s.musicSpoken===true;
      default:return false;
    }
  }
  function validateState(id,raw){
    if(id==='zone20')return root.ArtWorkshopChapter?.validate(raw)||null;
    if(id==='zone19')return root.CarnivalChapter?.validate(raw)||null;
    if(id==='zone18')return root.MakerspaceChapter?.validate(raw)||null;
    if(id==='zone17')return root.LibraryChapter?.validate(raw)||null;
    if(id==='zone16')return root.CoastChapter?.validate(raw)||null;
    if(id==='zone21')return root.WeatherChapter?.validate(raw)||null;
    if(id==='zone15')return root.AirportChapter?.validate(raw)||null;
    if(id==='zone14')return root.GreenhouseChapter?.validate(raw)||null;
    if(id==='zone13')return root.HarmonicaChapter?.validate(raw)||null;
    if(id==='zone12')return root.SchoolChapter?.validate(raw)||null;
    if(id==='zone11')return root.RestaurantChapter?.validate(raw)||null;
    if(!raw||!defaults[id])return null;
    let ok=false;
    switch(id){
      case 'zone2':ok=Array.isArray(raw.cart)&&raw.cart.length===3&&raw.cart.every(n=>isInt(n,0,3))&&typeof raw.paid==='boolean'&&(!raw.spoken||(Number.isInteger(raw.spoken.APPLE)&&isInt(raw.spoken.APPLE,0,2)&&Number.isInteger(raw.spoken.MILK)&&isInt(raw.spoken.MILK,0,1)));break;
      case 'zone3':ok=['WATER','LEAF','SEEDS'].includes(raw.tool)&&Array.isArray(raw.care)&&raw.care.length===3&&raw.care.every(b=>typeof b==='boolean')&&(raw.pendingCare===undefined||raw.pendingCare===null||isInt(raw.pendingCare,0,2))&&(raw.spoken===undefined||(Array.isArray(raw.spoken)&&new Set(raw.spoken).size===raw.spoken.length&&raw.spoken.every(w=>['TREE','RABBIT','BIRD'].includes(w))));break;
      case 'zone4':ok=['','BALL','BOOK','CLOCK'].includes(raw.equipment)&&isInt(raw.stage,0,3)&&(raw.ballSpoken===undefined||typeof raw.ballSpoken==='boolean')&&(raw.pendingMove===undefined||raw.pendingMove===null||['RUN','JUMP','SOCCER'].includes(raw.pendingMove));break;
      case 'zone5':ok=[6,8,10].includes(raw.hour)&&[0,30,45].includes(raw.minute)&&isInt(raw.platform,1,3)&&typeof raw.boarded==='boolean'&&(raw.spoken===undefined||(Array.isArray(raw.spoken)&&new Set(raw.spoken).size===raw.spoken.length&&raw.spoken.every(w=>['TIME','TRAIN'].includes(w))));break;
      case 'zone6':ok=isInt(raw.x,0,3)&&isInt(raw.y,0,2)&&!((raw.x===1&&raw.y===1)||(raw.x===2&&raw.y===2))&&(raw.boatSpoken===undefined||typeof raw.boatSpoken==='boolean')&&(raw.windSpoken===undefined||typeof raw.windSpoken==='boolean');break;
      case 'zone7':ok=['STAR','MOON','SUN'].includes(raw.object)&&[0,90,180,270].includes(raw.angle)&&typeof raw.aligned==='boolean'&&(raw.moonSpoken===undefined||typeof raw.moonSpoken==='boolean');break;
      case 'zone8':ok=Array.isArray(raw.gear)&&raw.gear.length<=5&&new Set(raw.gear).size===raw.gear.length&&raw.gear.every(g=>['COAT','GLOVES','BOOTS','SHORTS','SANDALS'].includes(g))&&isInt(raw.heat,0,3)&&typeof raw.ready==='boolean'&&(raw.spokenGear===undefined||(Array.isArray(raw.spokenGear)&&raw.spokenGear.length<=8&&raw.spokenGear.every(g=>['COAT','GLOVES','BOOTS','SHORTS','SANDALS'].includes(g))))&&(raw.warmSpoken===undefined||typeof raw.warmSpoken==='boolean');break;
      case 'zone9':ok=Array.isArray(raw.order)&&raw.order.length<=3&&new Set(raw.order).size===raw.order.length&&raw.order.every(w=>['READ','THINK','WRITE'].includes(w))&&typeof raw.sealed==='boolean'&&(raw.spoken===undefined||(Array.isArray(raw.spoken)&&new Set(raw.spoken).size===raw.spoken.length&&raw.spoken.every(w=>['READ','THINK','WRITE'].includes(w))));break;
      case 'zone10':ok=Array.isArray(raw.notes)&&raw.notes.length<=4&&raw.notes.every(n=>['C','E','G'].includes(n))&&typeof raw.played==='boolean'&&(raw.musicSpoken===undefined||typeof raw.musicSpoken==='boolean');break;
    }
    if(!ok)return null;
    const s=initial(id);for(const key of Object.keys(s))if(Object.prototype.hasOwnProperty.call(raw,key))s[key]=clone(raw[key]);
    // A stale success flag cannot bypass a changed configuration.
    for(const key of ['paid','boarded','aligned','ready','sealed','played'])if(key in s&&!solved(id,s))s[key]=false;
    return s;
  }
  function sanitizeMap(map){const result={};if(!map||typeof map!=='object')return result;for(const id of Object.keys(defaults)){const state=validateState(id,map[id]);if(state)result[id]=state;}return result;}
  function transition(id,raw,action){
    if(id==='zone20')return root.ArtWorkshopChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入新港校慶彩繪工坊。'};
    if(id==='zone19')return root.CarnivalChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入魔法數字嘉年華。'};
    if(id==='zone18')return root.MakerspaceChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入創客工坊。'};
    if(id==='zone17')return root.LibraryChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入圖書館任務。'};
    if(id==='zone16')return root.CoastChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入香山潮間帶。'};
    if(id==='zone21')return root.WeatherChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入氣象觀測台。'};
    if(id==='zone15')return root.AirportChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入國際機場。'};
    if(id==='zone14')return root.GreenhouseChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入溫室。'};
    if(id==='zone13')return root.HarmonicaChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入口琴展示館。'};
    if(id==='zone12')return root.SchoolChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入校園任務。'};
    if(id==='zone11')return root.RestaurantChapter?.transition(raw,action)||{state:initial(id),message:'請重新載入餐廳章節。'};
    const s=validateState(id,raw)||initial(id);if(!s||!action)return {state:s,message:'請先閱讀任務線索。'};
    if(solved(id,s))return {state:s,message:'任務已完成，可以回到秘境探索。'};
    let message='已更新，看看線索再試下一步。';
    switch(id){
      case 'zone2':
        if(action.type==='quantity'&&isInt(action.index,0,2)&&isInt(action.value,0,3))s.cart[action.index]=action.value;
        if(action.type==='speak'&&action.value==='APPLE'&&s.spoken.APPLE<2)s.spoken.APPLE++;
        if(action.type==='speak'&&action.value==='MILK'&&s.spoken.MILK<1)s.spoken.MILK++;
        if(action.type==='pay'){s.paid=eq(s.cart,[2,1,0])&&s.spoken.APPLE>=2&&s.spoken.MILK>=1;message=s.paid?'購物清單、口說食物與 4 枚金幣剛好相符！':s.spoken.APPLE<2||s.spoken.MILK<1?'先到蘋果攤口說兩次 APPLE、到牛奶攤口說一次 MILK，再回來結帳。':'還不能結帳：請核對食物數量與金幣總額。';}break;
      case 'zone3':
        if(action.type==='tool'&&['WATER','LEAF','SEEDS'].includes(action.value))s.tool=action.value;
        if(action.type==='care'&&isInt(action.index,0,2))message='請到花園裡找到夥伴並口說牠的英文名稱，才算完成照護。';
        if(action.type==='speak'&&['TREE','RABBIT','BIRD'].includes(action.value)){const i={TREE:0,RABBIT:1,BIRD:2}[action.value],tool=['WATER','LEAF','SEEDS'][i];if(s.tool===tool){s.care[i]=true;if(!s.spoken.includes(action.value))s.spoken.push(action.value);message=action.value+' 已完成口說與照護！';}else message=action.value+' 需要 '+tool+'；先選正確照護用品，再重新口說。';}break;
      case 'zone4':
        if(action.type==='equipment'&&['BALL','BOOK','CLOCK'].includes(action.value)){s.equipment=action.value;if(action.value!=='BALL'){s.ballSpoken=false;s.stage=0;}}
        if(action.type==='move'&&['RUN','JUMP','SOCCER'].includes(action.value))message='請到跑道或足球區口說這個動作，才會推進接力。';
        if(action.type==='speak'&&action.value==='BALL')s.ballSpoken=true;
        if(action.type==='speak'&&['RUN','JUMP','SOCCER'].includes(action.value)){if(s.equipment!=='BALL'||!s.ballSpoken)message='先選擇 BALL 並到足球區口說 BALL。';else if(action.value===['RUN','JUMP','SOCCER'][s.stage]){s.stage++;message='口說完成 '+action.value+'！接力進度 '+s.stage+' / 3。';}else{s.stage=0;message='順序不符，進度回到起點；請從 RUN 重新口說。';}}break;
      case 'zone5':
        if(action.type==='set'&&((action.key==='hour'&&[6,8,10].includes(action.value))||(action.key==='minute'&&[0,30,45].includes(action.value))||(action.key==='platform'&&isInt(action.value,1,3))))s[action.key]=action.value;
        if(action.type==='speak'&&['TIME','TRAIN'].includes(action.value)&&!s.spoken.includes(action.value))s.spoken.push(action.value);
        if(action.type==='board'){s.boarded=s.hour===8&&s.minute===30&&s.platform===2&&['TIME','TRAIN'].every(w=>s.spoken.includes(w));message=s.boarded?'時間、月台與口說單字都正確，車票驗證成功！':!['TIME','TRAIN'].every(w=>s.spoken.includes(w))?'先到鐘樓口說 TIME、到列車口說 TRAIN，再回來驗票。':'時間或月台與車票不同，再看看車票。';}break;
      case 'zone6':{
        const delta={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]}[action.value];
        if(action.type==='speak'&&action.value==='BOAT')s.boatSpoken=true;
        if(action.type==='speak'&&action.value==='WIND'){if(s.x===3&&s.y===0)s.windSpoken=true;else message='抵達燈塔後才能口說 WIND。';}
        if(action.type==='sail'&&delta){if(!s.boatSpoken)message='先到碼頭口說 BOAT，再開始看海圖航行。';else {const x=s.x+delta[0],y=s.y+delta[1];if(!isInt(x,0,3)||!isInt(y,0,2))message='岸邊不能通過，換個方向航行。';else if((x===1&&y===1)||(x===2&&y===2))message='前方有礁石，請找另一條水路。';else {s.x=x;s.y=y;message='已航行一格。';}}}break;
      }
      case 'zone7':
        if(action.type==='object'&&['STAR','MOON','SUN'].includes(action.value))s.object=action.value;
        if(action.type==='rotate')s.angle=(s.angle+90)%360;
        if(action.type==='speak'&&action.value==='MOON')s.moonSpoken=true;
        if(action.type==='align'){s.aligned=s.object==='MOON'&&s.angle===90&&s.moonSpoken;message=s.aligned?'觀測儀已對準並口說辨識東方月亮！':!s.moonSpoken?'先到日晷口說 MOON，再確認觀測方向。':'天體或方向與筆記不同，再觀察一次。';}break;
      case 'zone8':
        if(action.type==='gear'&&['COAT','GLOVES','BOOTS','SHORTS','SANDALS'].includes(action.value))message='請先口說裝備名稱，再選擇裝備。';
        if(action.type==='speak'&&['COAT','GLOVES','BOOTS','SHORTS','SANDALS'].includes(action.value)){s.gear=s.gear.includes(action.value)?s.gear.filter(g=>g!==action.value):[...s.gear,action.value];if(!s.spokenGear.includes(action.value))s.spokenGear.push(action.value);message='已口說並更新裝備：'+action.value+'。';}
        if(action.type==='speak'&&action.value==='WARM')s.warmSpoken=true;
        if(action.type==='heat'&&[-1,1].includes(action.value))s.heat=Math.min(3,Math.max(0,s.heat+action.value));
        if(action.type==='depart'){s.ready=s.heat===2&&eq([...s.gear].sort(),['BOOTS','COAT','GLOVES'])&&s.warmSpoken;message=s.ready?'保暖裝備、營火與 WARM 口說都準備好了！':!s.warmSpoken?'先到營火前口說 WARM，再準備出發。':'請核對保暖裝備，並讓營火維持 2 格熱度。';}break;
      case 'zone9':
        if(action.type==='card'&&['READ','THINK','WRITE'].includes(action.value))message='請口說故事卡上的英文動詞，卡片才會放回卷軸。';
        if(action.type==='speak'&&['READ','THINK','WRITE'].includes(action.value)&&!s.order.includes(action.value)&&s.order.length<3){s.order.push(action.value);s.spoken.push(action.value);message='已口說並放入 '+action.value+'。';}
        if(action.type==='clear'){s.order=[];s.spoken=[];}
        if(action.type==='seal'){s.sealed=eq(s.order,['READ','THINK','WRITE']);message=s.sealed?'卷軸恢復了正確的故事步驟！':'順序與 first、next、last 不同，可以取回重排。';}break;
      case 'zone10':
        if(action.type==='speak'&&action.value==='MUSIC')s.musicSpoken=true;
        if(action.type==='note'&&['C','E','G'].includes(action.value)&&s.musicSpoken&&s.notes.length<4)s.notes.push(action.value);
        if(action.type==='clear')s.notes=[];
        if(action.type==='play'){s.played=s.musicSpoken&&eq(s.notes,['C','E','G','C']);message=s.played?'回家的旋律響起，虹橋亮了！':!s.musicSpoken?'先到浮空星琴前口說 MUSIC，再彈奏旋律。':'旋律有一點不同，先聽示範再清空重彈。';}break;
    }
    return {state:s,message:solved(id,s)?'秘境任務完成！ '+message:message};
  }
  const branchParents={zone11:'zone2',zone12:'zone4',zone13:'zone12',zone14:'zone3',zone15:'zone5',zone16:'zone21',zone17:'zone12',zone18:'zone12',zone19:'zone2',zone20:'zone12',zone21:'zone7'};
  function prerequisitesFor(zoneId){
    const id=String(zoneId||'');if(!/^zone\d+$/.test(id)||id==='zone1')return [];
    const chain=[],seen=new Set();let cursor=id;
    while(cursor!=='zone1'&&!seen.has(cursor)){
      seen.add(cursor);const parent=branchParents[cursor]||(Number(cursor.slice(4))>1?'zone'+(Number(cursor.slice(4))-1):null);
      if(!parent)break;chain.unshift(parent);cursor=parent;
    }
    return [...new Set(chain)];
  }
  function canTravel(from,to,map,{restore=false,dev=false,zone1Complete=false}={}){
    if(restore||dev)return true;
    if(to==='learningHub'||from==='learningHub')return true;
    const target=String(to||'');
    const targetNumber=Number(target.slice(4));
    if(!/^zone\d+$/.test(target)||!Number.isInteger(targetNumber))return false;
    const source=String(from||''),fromNumber=Number(source.slice(4)),sourceParent=branchParents[source];
    if(sourceParent){
      if(target===sourceParent)return true;
      if(branchParents[target]===source)return solved(source,map?.[source]);
      if(branchParents[target]&&branchParents[target]===sourceParent)return solved(sourceParent,map?.[sourceParent]);
      return false;
    }
    if(!branchParents[target]&&/^zone\d+$/.test(source)&&fromNumber>=targetNumber)return true;
    if(branchParents[target]&&source!==branchParents[target])return false;
    // Portals check their immediate story edge; the manager additionally checks the full
    // saved route lineage so direct map travel cannot leap over unfinished mainline stops.
    const prerequisite=branchParents[target]||(targetNumber>1?'zone'+(targetNumber-1):null);
    if(!prerequisite)return true;
    return prerequisite==='zone1'?zone1Complete===true:solved(prerequisite,map?.[prerequisite]);
  }
  const api={specs,initial,solved,validateState,sanitizeMap,transition,canTravel,prerequisitesFor};root.RealmQuests=api;if(typeof module!=='undefined')module.exports=api;
  if(!root.document)return;
  root.addEventListener('load',()=>{
    const world=root.world3D;if(!world)return;
    const $=id=>root.document.getElementById(id),modal=$('realmQuestModal'),area=$('realmQuestControls');let active=null,returnFocus=null;
    const tones=[];let rewardTimer=null,board=null;
    function states(){return world.gameState.realmPuzzles||(world.gameState.realmPuzzles={});}
    function state(id){return states()[id]||(states()[id]=initial(id));}
    function button(text,action,pressed){const b=root.document.createElement('button');b.type='button';b.textContent=text;if(pressed!==undefined)b.setAttribute('aria-pressed',String(pressed));b.addEventListener('click',()=>act(action));return b;}
    function speechButton(label,word){const b=button(label,null);b.addEventListener('click',()=>world.openSpeechCard(word,()=>recordSpokenWord(word),{requireRecognition:true}));return b;}
    function row(...children){const r=root.document.createElement('div');r.className='quest-row';r.append(...children);area.append(r);return r;}
    function text(value,cls='quest-readout'){const el=root.document.createElement('p');el.className=cls;textContent(el,value);area.append(el);return el;}
    function textContent(el,value){el.textContent=value;}
    function select(label,values,current,action){const wrap=root.document.createElement('label');wrap.textContent=label;const control=root.document.createElement('select');for(const [value,name]of values){const option=root.document.createElement('option');option.value=value;option.textContent=name;option.selected=String(value)===String(current);control.append(option);}control.addEventListener('change',()=>act(action(control.value)));wrap.append(control);area.append(wrap);}
    function svg(markup){const panel=root.document.createElement('div');panel.className='quest-diagram';panel.innerHTML=markup;area.append(panel);}
    function render(){
      const s=state(active),done=solved(active,s);area.replaceChildren();
      switch(active){
        case 'zone2':
          ['🍎 APPLE · 每顆 1 枚','🥛 MILK · 每瓶 2 枚','🍞 BREAD · 每個 2 枚'].forEach((label,i)=>select(label,[0,1,2,3].map(n=>[n,String(n)]),s.cart[i],v=>({type:'quantity',index:i,value:Number(v)})));
          text('口說進度：APPLE '+s.spoken.APPLE+'/2 · MILK '+s.spoken.MILK+'/1');row(speechButton('練習 APPLE','APPLE'),speechButton('練習 MILK','MILK'));
          text('購物籃 '+(s.cart[0]+s.cart[1]*2+s.cart[2]*2)+' / 4 枚金幣');row(button('用 4 枚金幣結帳',{type:'pay'}));if(done)text('店主：採買完成了！請到市集西南側的微風餐廳，幫小客人準備熱湯；也可以繼續往花園冒險。');break;
        case 'zone3':
          row(...[['WATER','💧 水'],['LEAF','🍃 葉子'],['SEEDS','🌾 種子']].map(([value,label])=>button(label,{type:'tool',value},s.tool===value)));
          row(...[['🌳 TREE','TREE'],['🐰 RABBIT','RABBIT'],['🐦 BIRD','BIRD']].map(([label,word],i)=>speechButton((s.care[i]?'✓ ':'')+label,word)));text('已口說並照護 '+s.care.filter(Boolean).length+' / 3 位夥伴；用品依序是水、葉子、種子。');if(done)text('三位夥伴都照顧好了！花園西南側的玻璃溫室，正在招募小小照護員。');break;
        case 'zone4':
          row(...['BALL','BOOK','CLOCK'].map(value=>button(value,{type:'equipment',value},s.equipment===value)));
          text('接力進度 '+s.stage+' / 3 · '+(s.ballSpoken?'BALL 已口說':'先口說 BALL'));row(speechButton('⚽ 口說 BALL','BALL'),speechButton('🏃 口說 RUN','RUN'),speechButton('🦘 口說 JUMP','JUMP'),speechButton('⚽ 口說 SOCCER','SOCCER'));if(done)text('接力完成！沿南側林蔭小徑到新港國小，協助準備舞獅迎賓；也可以繼續前往星光車站。');break;
        case 'zone5':{
          const minute=s.minute*6,hour=(s.hour%12)*30+s.minute*.5;
          svg('<svg viewBox="0 0 160 160" role="img" aria-label="鐘面 '+s.hour+' 點 '+s.minute+' 分"><circle cx="80" cy="80" r="70" fill="#fff7df" stroke="#297d79" stroke-width="4"/><text x="72" y="27">12</text><text x="135" y="86">3</text><text x="76" y="145">6</text><text x="17" y="86">9</text><line x1="80" y1="80" x2="80" y2="40" stroke="#183f3a" stroke-width="6" transform="rotate('+hour+' 80 80)"/><line x1="80" y1="80" x2="80" y2="24" stroke="#ba7137" stroke-width="3" transform="rotate('+minute+' 80 80)"/></svg>');
          text('口說進度：TIME '+(s.spoken.includes('TIME')?'✓':'○')+' · TRAIN '+(s.spoken.includes('TRAIN')?'✓':'○'));row(speechButton('🕰️ 口說 TIME','TIME'),speechButton('🚂 口說 TRAIN','TRAIN'));
          for(const [key,label,values]of [['hour','時',[6,8,10]],['minute','分',[0,30,45]],['platform','月台',[1,2,3]]])select(label,values.map(n=>[n,String(n).padStart(2,'0')]),s[key],v=>({type:'set',key,value:Number(v)}));row(button('驗票上車',{type:'board'}));if(done)text('驗票完成！西南側的星光機場快線已開放，可前往星光國際機場展開啟航任務；也可以往海港前進。');break;
        }
        case 'zone6':{
          const grid=root.document.createElement('div');grid.className='quest-sea';grid.setAttribute('role','img');grid.setAttribute('aria-label','海圖：船在第 '+(s.y+1)+' 排、第 '+(s.x+1)+' 欄；燈塔在右上方，礁石在第二排第二欄與第三排第三欄。');
          for(let y=0;y<3;y++)for(let x=0;x<4;x++){const cell=root.document.createElement('span');cell.textContent=s.x===x&&s.y===y?'⛵':x===3&&y===0?'🗼':(x===1&&y===1)||(x===2&&y===2)?'🪨':'〰';grid.append(cell);}area.append(grid);
          text(s.boatSpoken?'BOAT 已口說 · 航行中':'先到碼頭口說 BOAT；抵達燈塔後還要口說 WIND。');row(speechButton('🛶 口說 BOAT','BOAT'),speechButton('🌬️ 口說 WIND','WIND'));
          row(...[['north','↑ 北 North'],['west','← 西 West'],['east','→ 東 East'],['south','↓ 南 South']].map(([value,label])=>button(label,{type:'sail',value})));break;
        }
        case 'zone7':
          row(...['STAR','MOON','SUN'].map(value=>button(value,{type:'object',value},s.object===value)));
          svg('<svg viewBox="0 0 160 160" role="img" aria-label="觀測方向 '+s.angle+' 度"><circle cx="80" cy="80" r="65" fill="#eef4fe" stroke="#485879"/><text x="65" y="28">N 0°</text><text x="115" y="83">E 90°</text><text x="60" y="143">S 180°</text><text x="0" y="83">W 270°</text><path d="M 80 40 L 72 68 L 80 62 L 88 68 Z" fill="#be7a31" transform="rotate('+s.angle+' 80 80)"/><circle cx="80" cy="80" r="5" fill="#be7a31"/></svg>');
          text('觀測儀 '+s.angle+'° · MOON '+(s.moonSpoken?'已口說':'尚未口說'));row(speechButton('🌙 口說 MOON','MOON'),button('順時針轉 90°',{type:'rotate'}),button('確認對準',{type:'align'}));break;
        case 'zone8':
          row(...[['COAT','🧥 外套 Coat'],['GLOVES','🧤 手套 Gloves（延伸詞）'],['BOOTS','🥾 雪靴 Boots（延伸詞）'],['SHORTS','🩳 短褲 Shorts'],['SANDALS','🩴 涼鞋 Sandals（延伸詞）']].map(([value,label])=>speechButton((s.gear.includes(value)?'✓ ':'')+label,value)));
          text('營火熱度 '+['□ □ □','■ □ □','■ ■ □','■ ■ ■'][s.heat]+' · '+['太冷','微暖','溫暖','太熱'][s.heat]+' · WARM '+(s.warmSpoken?'已口說':'尚未口說'));row(speechButton('🔥 口說 WARM','WARM'),button('加一份木柴 +1',{type:'heat',value:1}),button('減少木柴 −1',{type:'heat',value:-1}),button('準備出發',{type:'depart'}));break;
        case 'zone9':
          text('故事卷軸：'+(s.order.join(' → ')||'等待口說三張卡'));
          row(...['READ','THINK','WRITE'].map(value=>speechButton((s.order.includes(value)?'✓ ':'')+value,value)));row(button('取回重排',{type:'clear'}),button('蓋上印章',{type:'seal'}));break;
        case 'zone10':
          text('你的琴譜：'+(s.notes.join(' → ')||'等待第一個音'));const demo=button('♫ 聽示範 C → E → G → C',null);demo.addEventListener('click',()=>playNotes(['C','E','G','C']));row(demo);
          row(speechButton(s.musicSpoken?'✓ 已口說 MUSIC':'🎵 口說 MUSIC','MUSIC'));
          row(...['C','E','G'].map(value=>button('♫ '+value,{type:'note',value})));row(button('清空琴譜',{type:'clear'}),button('奏響虹橋',{type:'play'}));break;
      }
      $('realmQuestWin').hidden=!done;$('realmQuestNext').textContent=active==='zone10'?'回家的虹橋已亮起！空島的旋律任務完成了，也可以返回其他秘境繼續探索與練習。':'任務已解開。回到場景練習英語、探索守護者，再沿出口前往下一個秘境。';
      if(done)for(const control of area.querySelectorAll('button,select'))control.disabled=true;
    }
    function stopNotes(){for(const o of tones.splice(0))try{o.stop();}catch(error){}}
    function playNotes(notes){
      stopNotes();const audio=root.audioManager;audio?.init?.();const ctx=audio?.ctx;if(!ctx||!audio.sfxGain)return;
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
      notes.forEach((n,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+i*.42;o.type='sine';o.frequency.value={C:523.25,E:659.25,G:783.99}[n];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(audio.sfxGain);o.onended=()=>{o.disconnect();g.disconnect();const ix=tones.indexOf(o);if(ix>=0)tones.splice(ix,1);};tones.push(o);o.start(t);o.stop(t+.38);});
    }
    function reward(title,next){
      clearTimeout(rewardTimer);$('adventureRewardTitle').textContent=title;$('adventureRewardNext').textContent=next;$('adventureReward').hidden=false;
      $('adventureReward').style.animation=world.settings.reducedMotion?'none':'';
      rewardTimer=root.setTimeout(()=>$('adventureReward').hidden=true,5500);
    }
    function updateMechanism(){
      if(world.zoneManager.currentZoneId!=='zone10')return;
      const complete=solved('zone10',state('zone10'));
      world.activeZoneGroup.traverse(object=>{if(object.userData.realmQuestRainbow)object.material.opacity=complete ? 0.8 : 0.14;});
    }
    function applyAction(id,action,showPanel){
      if(!action||id!==world.zoneManager.currentZoneId||!specs[id])return false;
      active=id;
      const focusIndex=showPanel?Array.from(area.querySelectorAll('button,select')).indexOf(root.document.activeElement):-1;
      const result=transition(id,state(id),action);states()[id]=result.state;
      if(showPanel){render();$('realmQuestResult').textContent=result.message;}
      // Keep keyboard focus at the corresponding action after controls are rebuilt.
      if(showPanel){if(solved(id,result.state))$('realmQuestExplore').focus({preventScroll:true});else area.querySelectorAll('button,select')[Math.max(0,focusIndex)]?.focus({preventScroll:true});}
      if(action.type==='note')playNotes([action.value]);
      if(solved(id,result.state)){root.audioManager?.playSfx('magicSuccess');reward('秘境任務完成：'+specs[id].title,id==='zone10'?'回家的虹橋亮起了！':id==='zone2'?'微風餐廳店主在西南側等你；花園出口也已準備好。':id==='zone4'?'新港國小的舞獅迎賓委託已開放，入口在南側林蔭小徑。':id==='zone5'?'星光國際機場快線已開放，入口在月台西南側。':'出口已準備好，回到場景繼續探索。');world.hintController?.clear();$('realmQuestBtn').textContent='✓ 秘境任務完成';if(board)board.material.color.setHex(0x68c9a7);}
      updateMechanism();
      world.adventureProgress?.save(true);
      return true;
    }
    function act(action){if(active!==world.zoneManager.currentZoneId)return false;return applyAction(active,action,modal.style.display!=='none');}
    function recordSpokenWord(word){
      const id=world.zoneManager.currentZoneId;
      if(!specs[id]||!['APPLE','MILK','TREE','RABBIT','BIRD','BALL','RUN','JUMP','SOCCER','TIME','TRAIN','BOAT','WIND','MOON','COAT','GLOVES','BOOTS','SHORTS','SANDALS','WARM','READ','THINK','WRITE','MUSIC'].includes(word))return false;
      return applyAction(id,{type:'speak',value:word},active===id&&modal.style.display!=='none');
    }
    function open(){if(world.zoneManager.currentZoneId==='zone15'){root.AirportChapter.open();return;}if(world.zoneManager.currentZoneId==='zone20'){root.ArtWorkshopChapter.open();return;}if(world.zoneManager.currentZoneId==='zone19'){root.CarnivalChapter.open();return;}if(world.zoneManager.currentZoneId==='zone18'){root.MakerspaceChapter.open();return;}if(world.zoneManager.currentZoneId==='zone17'){root.LibraryChapter.open();return;}if(world.zoneManager.currentZoneId==='zone16'){root.CoastChapter.open();return;}if(world.zoneManager.currentZoneId==='zone21'){root.WeatherChapter.open();return;}if(world.zoneManager.currentZoneId==='zone14'){root.GreenhouseChapter.open();return;}if(world.zoneManager.currentZoneId==='zone13'){root.HarmonicaChapter.open();return;}if(world.zoneManager.currentZoneId==='zone12'){root.SchoolChapter.open();return;}if(world.zoneManager.currentZoneId==='zone11'){root.RestaurantChapter.open();return;}if(world.isAnyModalOpen())return;active=world.zoneManager.currentZoneId;if(!specs[active])return;returnFocus=root.document.activeElement;$('realmQuestKicker').textContent='秘境 '+active.slice(4)+' · 生活英語解謎';$('realmQuestTitle').textContent=specs[active].title;$('realmQuestEnglish').textContent=specs[active].english;$('realmQuestBrief').textContent=specs[active].brief;$('realmQuestResult').textContent='';render();modal.style.display='flex';root.touchControls?.reset();world.targetFocus?.select(null);}
    function close(){modal.style.display='none';stopNotes();root.speechManager?.stopVoice();returnFocus?.isConnected&&returnFocus.focus({preventScroll:true});}
    function sync(){
      const id=world.zoneManager.currentZoneId;$('realmQuestBtn').hidden=!specs[id];
      if(modal.style.display!=='none')close();board=null;
      clearTimeout(rewardTimer);$('adventureReward').hidden=true;
      if(!specs[id])return;
      if(id==='zone19'){root.CarnivalChapter.sync();return;}
      if(id==='zone20'){root.ArtWorkshopChapter.sync();return;}
      if(id==='zone18'){root.MakerspaceChapter.sync();return;}
      root.HarmonicaChapter?.stopTones?.();
      if(id==='zone15'){root.AirportChapter.sync();return;}
      if(id==='zone14'){root.GreenhouseChapter.sync();return;}
      if(id==='zone21'){root.WeatherChapter.sync();return;}
      if(id==='zone16'){root.CoastChapter.sync();return;}
      if(id==='zone17'){root.LibraryChapter.sync();return;}
      if(id==='zone13'){root.HarmonicaChapter.sync();return;}
      if(id==='zone12'){root.SchoolChapter.sync();return;}
      if(id==='zone11'){root.RestaurantChapter.sync();return;}
      updateMechanism();
      $('realmQuestBtn').textContent=solved(id,state(id))?'✓ 秘境任務完成':'秘境任務';
      const p=world.player.pos;const offset=[[2,0],[-2,0],[0,-2]].find(([x,z])=>!world.isPositionBlocked(p.x+x,p.z+z,.35));if(!offset)return;
      const ring=new root.THREE.Mesh(new root.THREE.TorusGeometry(.35,.07,8,24),new root.THREE.MeshStandardMaterial({color:solved(id,state(id))?0x68c9a7:0xe9b768,emissive:0x483118,roughness:.4}));ring.position.set(p.x+offset[0],1.25,p.z+offset[1]);ring.userData={id:'quest_'+id,name:specs[id].title,label:'秘境任務 · '+specs[id].title,hint:'互動以閱讀英語線索、操作解謎',onClick:open};world.activeZoneGroup.add(ring);world.interactables.push(ring);board=ring;
    }
    $('realmQuestBtn').addEventListener('click',open);$('realmQuestClose').addEventListener('click',close);$('realmQuestExplore').addEventListener('click',close);$('realmQuestListen').addEventListener('click',()=>world.zoneManager.currentZoneId==='zone15'?root.AirportChapter.listen():world.zoneManager.currentZoneId==='zone20'?root.ArtWorkshopChapter.listen():world.zoneManager.currentZoneId==='zone19'?root.CarnivalChapter.listen():world.zoneManager.currentZoneId==='zone18'?root.MakerspaceChapter.listen():world.zoneManager.currentZoneId==='zone17'?root.LibraryChapter.listen():world.zoneManager.currentZoneId==='zone16'?root.CoastChapter.listen():world.zoneManager.currentZoneId==='zone21'?root.WeatherChapter.listen():world.zoneManager.currentZoneId==='zone14'?root.GreenhouseChapter.listen():world.zoneManager.currentZoneId==='zone13'?root.HarmonicaChapter.listen():world.zoneManager.currentZoneId==='zone12'?root.SchoolChapter.listen():world.zoneManager.currentZoneId==='zone11'?root.RestaurantChapter.listen():root.speechManager?.playSentenceVoice(specs[active]?.english||''));
    $('devQuestReset').addEventListener('click',()=>{
      const id=world.zoneManager.currentZoneId;if(!world.devMode||!specs[id])return;
      states()[id]=initial(id);$('realmQuestBtn').textContent='秘境任務';if(board)board.material.color.setHex(0xe9b768);
      if(id==='zone15')root.AirportChapter.sync();
      if(id==='zone19')root.CarnivalChapter.sync();
      if(id==='zone20')root.ArtWorkshopChapter.sync();
      if(id==='zone18')root.MakerspaceChapter.sync();
      if(id==='zone14')root.GreenhouseChapter.sync();
      if(id==='zone21')root.WeatherChapter.sync();
      if(id==='zone16')root.CoastChapter.sync();
      if(id==='zone17')root.LibraryChapter.sync();
      if(id==='zone13')root.HarmonicaChapter.sync();
      if(id==='zone12')root.SchoolChapter.sync();
      if(id==='zone11')root.RestaurantChapter.sync();
      updateMechanism();world.hintController?.clear();world.adventureProgress?.save(true);world.showToast('此關本機測試機關已重置；學習成績不受影響。');
    });
    root.document.addEventListener('visibilitychange',()=>{if(root.document.hidden){stopNotes();$('adventureReward').hidden=true;}});
    world.realmQuests={sync,open,reward,close,recordSpokenWord};sync();
  });
})(typeof window!=='undefined'?window:globalThis);
