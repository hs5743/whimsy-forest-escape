// 情境聽力尋寶任務管理器 (ScavengerHuntManager)
// 結合 3D 空間目標與 706 英語護照庫，提供語音聆聽、雷達導航、雙軌詞彙學習與每日三連挑戰

(function(root) {
  'use strict';

  // 9 大空間情境聽力線索資料庫 (54+ 題，每題結合 3D POI 錨點與 706 英語護照前階生活詞彙)
  const SCAVENGER_CLUES = [
    // ==========================================
    // Zone 1: 見習學徒書齋 (Atelier Room)
    // ==========================================
    {
      id: 'z1_light',
      zoneId: 'zone1',
      targetWord: 'LIGHT',
      targetLabel: '古典黃銅燭台',
      targetPos: [-0.7, -3.8],
      companionWord: 'NIGHT',
      companionZh: '夜晚',
      companionPhonetic: '/naɪt/',
      companionSentence: 'The stars shine brightly in the dark night.',
      companionSentenceZh: '星星在黑暗的夜晚中閃閃發光。',
      clueEn: 'When the dark night comes and shadows fall, strike a tiny match to bring a warm golden light upon the desk! Find me!',
      clueZh: '當黑暗的夜晚降臨、陰影落下時，擦亮一根小火柴，在書桌上帶來溫暖的金光！快找到我！',
      keywords: ['dark', 'night', 'flame', 'golden', 'light'],
      phoneticHint: 'Starts with L • /laɪt/'
    },
    {
      id: 'z1_book',
      zoneId: 'zone1',
      targetWord: 'BOOK',
      targetLabel: '古老羊皮紙魔導書',
      targetPos: [0.5, -3.7],
      companionWord: 'STUDENT',
      companionZh: '學生',
      companionPhonetic: '/ˈstjuː.dənt/',
      companionSentence: 'Every student likes reading funny stories in class.',
      companionSentenceZh: '每個學生都喜歡在課堂上讀有趣的故事。',
      clueEn: 'Every good student loves turning my paper pages to read ancient spells and fantasy stories. Open me on the wooden desk!',
      clueZh: '每位好學生都喜歡翻開我的紙質書頁來閱讀古代法術與奇幻故事。在木書桌上打開我吧！',
      keywords: ['student', 'paper', 'pages', 'read', 'stories'],
      phoneticHint: 'Starts with B • /bʊk/'
    },
    {
      id: 'z1_key',
      zoneId: 'zone1',
      targetWord: 'KEY',
      targetLabel: '黃銅古典鑰匙',
      targetPos: [0.5, -3.7],
      companionWord: 'DOOR',
      companionZh: '大門',
      companionPhonetic: '/dɔːr/',
      companionSentence: 'Please open the door with a magic key.',
      companionSentenceZh: '請用魔法鑰匙打開大門。',
      clueEn: 'I am small and made of shining yellow brass. Insert my teeth into a heavy lock to open a secret desk drawer! Find me!',
      clueZh: '我小巧玲瓏，由閃亮的黃銅製成。將我的齒痕插入沉重的鎖孔，就能打開書桌抽屜！快找到我！',
      keywords: ['brass', 'lock', 'drawer', 'open', 'unlock'],
      phoneticHint: 'Starts with K • /kiː/'
    },
    {
      id: 'z1_red',
      zoneId: 'zone1',
      targetWord: 'RED',
      targetLabel: '抽屜裡的火紅魔藥',
      targetPos: [-0.8, -3.5],
      companionWord: 'COLOR',
      companionZh: '顏色',
      companionPhonetic: '/ˈkʌl.ɚ/',
      companionSentence: 'What is your favorite color in the rainbow?',
      companionSentenceZh: '彩虹中你最喜歡哪種顏色？',
      clueEn: 'Look inside the unlocked drawer! I am a magical potion glowing with the bright warm color of ripe apples and strawberries. What color am I?',
      clueZh: '看看解開的抽屜裡面！我是一瓶散發著如成熟蘋果與草莓般明亮溫暖顏色的魔法藥水。我是什麼顏色？',
      keywords: ['drawer', 'potion', 'color', 'apple', 'strawberry'],
      phoneticHint: 'Starts with R • /rɛd/'
    },
    {
      id: 'z1_blue',
      zoneId: 'zone1',
      targetWord: 'BLUE',
      targetLabel: '煉金調劑台上的蒼藍之水',
      targetPos: [-3.3, 0.4],
      companionWord: 'WATER',
      companionZh: '水',
      companionPhonetic: '/ˈwɔː.tɚ/',
      companionSentence: 'We drink fresh water when we feel thirsty.',
      companionSentenceZh: '當我們感到口渴時會喝新鮮的水。',
      clueEn: 'On the alchemy table, clear mountain water sparkles with the calm color of the summer ocean and sky. Find this cool bottle!',
      clueZh: '在煉金調劑台上，清澈的山泉水閃爍著夏日海洋與晴空般寧靜的顏色。找到這瓶清涼的藥水！',
      keywords: ['alchemy', 'water', 'ocean', 'sky', 'color'],
      phoneticHint: 'Starts with B • /bluː/'
    },
    {
      id: 'z1_cat',
      zoneId: 'zone1',
      targetWord: 'CAT',
      targetLabel: '打呼嚕的貓咪寶箱怪',
      targetPos: [4.6, 2.0],
      companionWord: 'PET',
      companionZh: '寵物',
      companionPhonetic: '/pɛt/',
      companionSentence: 'I take care of my little pet with love.',
      companionSentenceZh: '我充滿愛心地照顧我的小寵物。',
      clueEn: 'Meow! I am a playful pet with whiskers, pointy ears, and sharp teeth hiding inside a wooden treasure box. Come say hello!',
      clueZh: '喵！我是一隻調皮的寵物，有著鬍鬚、尖耳朵和鋒利牙齒，藏在木寶箱裡面。快來跟我打招呼！',
      keywords: ['pet', 'whiskers', 'ears', 'box', 'meow'],
      phoneticHint: 'Starts with C • /kæt/'
    },

    // ==========================================
    // Zone 2: 陽光微風市集 (Bazaar Marketplace)
    // ==========================================
    {
      id: 'z2_apple',
      zoneId: 'zone2',
      targetWord: 'APPLE',
      targetLabel: '甜美紅蘋果攤位',
      targetPos: [-4.5, -1.0],
      companionWord: 'FRUIT',
      companionZh: '水果',
      companionPhonetic: '/fruːt/',
      companionSentence: 'Eating fresh fruit every day keeps you healthy.',
      companionSentenceZh: '每天吃新鮮水果能讓你保持健康。',
      clueEn: 'I am a sweet and crunchy fruit picked from orchard trees. Eating one a day keeps the doctor away! Visit my wooden fruit stall!',
      clueZh: '我是從果園樹上採摘的香甜清脆水果。一天一顆能讓你遠離醫生！快來我的木製水果攤！',
      keywords: ['fruit', 'sweet', 'crunchy', 'tree', 'doctor'],
      phoneticHint: 'Starts with A • /ˈæp.l̩/'
    },
    {
      id: 'z2_banana',
      zoneId: 'zone2',
      targetWord: 'BANANA',
      targetLabel: '活力金香蕉攤位',
      targetPos: [4.2, 1.2],
      companionWord: 'MONKEY',
      companionZh: '猴子',
      companionPhonetic: '/ˈmʌŋ.ki/',
      companionSentence: 'A little monkey jumps happily in the green tree.',
      companionSentenceZh: '小猴子在綠樹上開心地跳躍。',
      clueEn: 'Monkeys in the forest love to peel my yellow skin for an energy snack. Go to the market table piled high with yellow crescent fruit!',
      clueZh: '森林裡的猴子最喜歡剝開我的黃色外皮當點心補充活力。快去市集上堆滿黃色新月形水果的桌子旁！',
      keywords: ['monkey', 'yellow', 'peel', 'snack', 'fruit'],
      phoneticHint: 'Starts with B • /bəˈnæn.ə/'
    },
    {
      id: 'z2_bread',
      zoneId: 'zone2',
      targetWord: 'BREAD',
      targetLabel: '剛出爐的烤麵包推車',
      targetPos: [-3.2, -5.2],
      companionWord: 'BREAKFAST',
      companionZh: '早餐',
      companionPhonetic: '/ˈbrɛk.fəst/',
      companionSentence: 'We eat delicious eggs and toast for breakfast.',
      companionSentenceZh: '我們早餐吃美味的雞蛋與吐司。',
      clueEn: 'Smell that golden wheat aroma? Bakers bake me fresh every morning for a warm breakfast baguette. Follow your nose to the wooden cart!',
      clueZh: '聞到那股金黃麥香了嗎？麵包師傅每天清晨現烤出爐，作為溫暖的長棍早餐。循著香氣前往木推車！',
      keywords: ['breakfast', 'bake', 'wheat', 'morning', 'cart'],
      phoneticHint: 'Starts with B • /brɛd/'
    },
    {
      id: 'z2_milk',
      zoneId: 'zone2',
      targetWord: 'MILK',
      targetLabel: '香濃鮮牛奶推車',
      targetPos: [3.5, -3.5],
      companionWord: 'COW',
      companionZh: '母牛/乳牛',
      companionPhonetic: '/kaʊ/',
      companionSentence: 'A gentle cow gives healthy white milk on the farm.',
      companionSentenceZh: '農場裡溫順的乳牛產出健康的白牛奶。',
      clueEn: 'A black-and-white farm cow gives this wholesome white drink full of calcium. Drink a cold glass at the dairy cart!',
      clueZh: '黑白斑紋的農場乳牛產出這種富含鈣質的健康白色飲品。快到乳製品手推車前喝上一杯！',
      keywords: ['cow', 'farm', 'white', 'drink', 'calcium'],
      phoneticHint: 'Starts with M • /mɪlk/'
    },
    {
      id: 'z2_water',
      zoneId: 'zone2',
      targetWord: 'WATER',
      targetLabel: '微風廣場中央噴泉活水',
      targetPos: [0.0, 2.8],
      companionWord: 'CLEAN',
      companionZh: '乾淨的/清潔',
      companionPhonetic: '/kliːn/',
      companionSentence: 'Wash your hands with clean water before eating.',
      companionSentenceZh: '用餐前請用乾淨的水洗手。',
      clueEn: 'In the center of the town square, pure clean water bubbles from a stone fountain basin. Listen to the splashing droplets!',
      clueZh: '在城鎮廣場的中心，純淨清澈的活水正從石雕噴泉池中汩汩冒出。快去聆聽水滴飛濺的清脆聲響！',
      keywords: ['clean', 'pure', 'fountain', 'splashing', 'square'],
      phoneticHint: 'Starts with W • /ˈwɔː.tɚ/'
    },
    {
      id: 'z2_open',
      zoneId: 'zone2',
      targetWord: 'OPEN',
      targetLabel: '微風市集城門吊橋',
      targetPos: [6.8, -8.0],
      companionWord: 'GATE',
      companionZh: '城門/大門',
      companionPhonetic: '/ɡeɪt/',
      companionSentence: 'Lower the heavy wooden gate to cross the bridge.',
      companionSentenceZh: '放下沉重的木造大門穿過橋樑。',
      clueEn: 'Lower the heavy fortress drawbridge and unlock the town gate to journey into the mysterious beast forest! What magical action opens the way?',
      clueZh: '降下要塞沉重的吊橋，解開城門踏入神秘的守護獸之森！是什麼魔法動作打開了道路？',
      keywords: ['gate', 'bridge', 'fortress', 'drawbridge', 'journey'],
      phoneticHint: 'Starts with O • /ˈoʊ.pən/'
    },

    // ==========================================
    // Zone 3: 守護獸之森花園 (Beast Sanctuary Garden)
    // ==========================================
    {
      id: 'z3_tree',
      zoneId: 'zone3',
      targetWord: 'TREE',
      targetLabel: '精靈古樹與發光提燈',
      targetPos: [0.0, 0.0],
      companionWord: 'FOREST',
      companionZh: '森林',
      companionPhonetic: '/ˈfɔːr.ɪst/',
      companionSentence: 'Tall green trees grow thick in the magical forest.',
      companionSentenceZh: '高大的綠樹在魔法森林裡茂密生長。',
      clueEn: 'I have strong wooden roots dug deep into the forest earth and large green boughs holding fairy crystal lanterns. Hug my giant trunk!',
      clueZh: '我的木質強健根系深扎於森林大地，巨大的綠色枝椏上懸掛著精靈水晶提燈。快來擁抱我巨大的樹幹！',
      keywords: ['forest', 'roots', 'leaves', 'lanterns', 'trunk'],
      phoneticHint: 'Starts with T • /triː/'
    },
    {
      id: 'z3_flower',
      zoneId: 'zone3',
      targetWord: 'FLOWER',
      targetLabel: '彩虹蒼月花壇',
      targetPos: [-5.5, 4.0],
      companionWord: 'GARDEN',
      companionZh: '花園',
      companionPhonetic: '/ˈɡɑːr.dən/',
      companionSentence: 'Colorful flowers blossom brightly in our school garden.',
      companionSentenceZh: '五彩繽紛的花朵在我們學校花園裡燦爛盛開。',
      clueEn: 'Bees and butterflies dance gently around our colorful petals in the sanctuary garden. Smell our sweet floral fragrance near the stone path!',
      clueZh: '蜜蜂與蝴蝶在庇護所花園裡圍繞著我們彩色的花瓣輕柔飛舞。循著石板路聞聞我們甜美的花香！',
      keywords: ['garden', 'petals', 'butterflies', 'fragrance', 'bloom'],
      phoneticHint: 'Starts with F • /ˈflaʊ.ɚ/'
    },
    {
      id: 'z3_bird',
      zoneId: 'zone3',
      targetWord: 'BIRD',
      targetLabel: '金色翠鳥水缽',
      targetPos: [5.5, -3.5],
      companionWord: 'SING',
      companionZh: '唱歌/鳴囀',
      companionPhonetic: '/sɪŋ/',
      companionSentence: 'The little birds sing a cheerful song at sunrise.',
      companionSentenceZh: '小鳥在日出時唱著歡快的歌。',
      clueEn: 'Chirp chirp! Feathered friends sing cheerful melodies in the morning. Find the golden songbird resting upon the marble bird bath!',
      clueZh: '啾啾！長著羽毛的小伙伴在晨光中唱著歡快的旋律。快找到停在漢白玉鳥食水缽上的金色鳴鳥！',
      keywords: ['sing', 'feather', 'wings', 'chirp', 'bath'],
      phoneticHint: 'Starts with B • /bɜːrd/'
    },
    {
      id: 'z3_rabbit',
      zoneId: 'zone3',
      targetWord: 'RABBIT',
      targetLabel: '草叢裡的白兔洞',
      targetPos: [3.8, 4.2],
      companionWord: 'CARROT',
      companionZh: '胡蘿蔔',
      companionPhonetic: '/ˈkær.ət/',
      companionSentence: 'Rabbits love eating sweet orange carrots.',
      companionSentenceZh: '兔子最喜歡吃甜甜的橘色胡蘿蔔。',
      clueEn: 'Hop, hop! I have long soft ears, a fluffy white tail, and I love crunching crisp orange carrots. Come find my burrow in the flowers!',
      clueZh: '跳呀跳！我有著長長柔軟的耳朵、毛茸茸的白尾巴，而且最喜歡嚼香脆的橘色胡蘿蔔。快來花叢裡找我的小窩！',
      keywords: ['carrot', 'ears', 'tail', 'hop', 'burrow'],
      phoneticHint: 'Starts with R • /ˈræb.ɪt/'
    },
    {
      id: 'z3_grass',
      zoneId: 'zone3',
      targetWord: 'GRASS',
      targetLabel: '翠綠野餐草坪',
      targetPos: [-4.2, -4.5],
      companionWord: 'GREEN',
      companionZh: '綠色的',
      companionPhonetic: '/ɡriːn/',
      companionSentence: 'Spring makes the fields turn fresh and green.',
      companionSentenceZh: '春天讓田野變得清新翠綠。',
      clueEn: 'Take off your heavy boots and feel the soft, cool green blades beneath your feet. Walk across the emerald garden lawn!',
      clueZh: '脫下厚重的靴子，感受腳下柔軟清涼的綠色葉片。漫步走過花園這片翠綠的草坪吧！',
      keywords: ['green', 'lawn', 'soft', 'lawn', 'field'],
      phoneticHint: 'Starts with G • /ɡræs/'
    },
    {
      id: 'z3_open',
      zoneId: 'zone3',
      targetWord: 'OPEN',
      targetLabel: '玫瑰花園出入口拱門',
      targetPos: [-8.5, 8.5],
      companionWord: 'ROSE',
      companionZh: '玫瑰花',
      companionPhonetic: '/roʊz/',
      companionSentence: 'Red roses bloom along the stone archway.',
      companionSentenceZh: '紅玫瑰沿著石拱門盛開。',
      clueEn: 'Follow the winding gravel trail past fragrant roses and push through the floral portal toward the athletic sports stadium! Unlock the garden arch!',
      clueZh: '沿著蜿蜒的碎石小徑穿過芳香的玫瑰，推開花卉拱門前往活力體育場！解開花園拱門！',
      keywords: ['rose', 'trail', 'arch', 'portal', 'stadium'],
      phoneticHint: 'Starts with O • /ˈoʊ.pən/'
    },

    // ==========================================
    // Zone 4: 活力冒險操場 (Athletic Sports Field)
    // ==========================================
    {
      id: 'z4_ball',
      zoneId: 'zone4',
      targetWord: 'BALL',
      targetLabel: '綠茵場上的足球與球門',
      targetPos: [0.0, -8.5],
      companionWord: 'GAME',
      companionZh: '遊戲/比賽',
      companionPhonetic: '/ɡeɪm/',
      companionSentence: 'Let us play a friendly soccer game together.',
      companionSentenceZh: '讓我們一起來踢一場友誼足球賽吧。',
      clueEn: 'I am round with black and white hexagonal patches. Kick me straight into the net to score a goal in our school game! Find me near the goalposts!',
      clueZh: '我是圓形的，帶有黑白相間的六角形斑塊。將我筆直踢入球網為校際比賽得分！快到球門柱旁找到我！',
      keywords: ['game', 'round', 'kick', 'goal', 'soccer'],
      phoneticHint: 'Starts with B • /bɔːl/'
    },
    {
      id: 'z4_run',
      zoneId: 'zone4',
      targetWord: 'RUN',
      targetLabel: '第 1 分道起跑線助跑塊',
      targetPos: [-7.3, 4.0],
      companionWord: 'FAST',
      companionZh: '快速的/迅速地',
      companionPhonetic: '/fæst/',
      companionSentence: 'Cheetahs can run super fast across the plains.',
      companionSentenceZh: '獵豹能在平原上跑得超級飛快。',
      clueEn: 'On your mark, get set, go! Lace up your sneakers and race fast down the red rubber sprint track. Sprint to the starting blocks!',
      clueZh: '各就各位，預備，跑！繫緊你的運動鞋，在紅色橡膠跑道上飛速奔馳。衝向起跑架！',
      keywords: ['fast', 'speed', 'track', 'sprint', 'blocks'],
      phoneticHint: 'Starts with R • /rʌn/'
    },
    {
      id: 'z4_jump',
      zoneId: 'zone4',
      targetWord: 'JUMP',
      targetLabel: '跳高海綿墊與跳箱區',
      targetPos: [2.8, 3.2],
      companionWord: 'HIGH',
      companionZh: '高的/高高地',
      companionPhonetic: '/haɪ/',
      companionSentence: 'Kangaroos jump high into the air.',
      companionSentenceZh: '袋鼠能高高地躍向空中。',
      clueEn: 'Bend your knees, push off with all your might, and soar high into the air over the sports hurdles! Land safely on the blue foam mats!',
      clueZh: '彎曲雙膝，使出全身力氣起跳，像袋鼠一樣高高越過運動跨欄！安全落在藍色海綿墊上！',
      keywords: ['high', 'air', 'hurdles', 'mat', 'knees'],
      phoneticHint: 'Starts with J • /dʒʌmp/'
    },
    {
      id: 'z4_play',
      zoneId: 'zone4',
      targetWord: 'PLAY',
      targetLabel: 'LED 運動大記分板與看台',
      targetPos: [-3.5, 7.5],
      companionWord: 'FRIEND',
      companionZh: '朋友',
      companionPhonetic: '/frɛnd/',
      companionSentence: 'I share my toys and play with my best friend.',
      companionSentenceZh: '我分享玩具並與我最好的朋友一起玩。',
      clueEn: 'Recess bell is ringing! Gather your classmates and friends to play outdoor sports beneath the glowing scoreboard. Run to the team bench!',
      clueZh: '下課鐘聲響起了！召集你的同班同學與好友，在發光記分板下暢玩戶外運動。奔向隊員長椅！',
      keywords: ['friend', 'recess', 'classmates', 'scoreboard', 'bench'],
      phoneticHint: 'Starts with P • /pleɪ/'
    },
    {
      id: 'z4_fast',
      zoneId: 'zone4',
      targetWord: 'FAST',
      targetLabel: '勝利接力棒傳遞區',
      targetPos: [5.5, -2.5],
      companionWord: 'RELAY',
      companionZh: '接力賽',
      companionPhonetic: '/ˈriː.leɪ/',
      companionSentence: 'Our team won the 400-meter relay race.',
      companionSentenceZh: '我們隊伍贏得了 400 公尺接力賽。',
      clueEn: 'Swift as the wind! Pass the shining golden relay baton from hand to hand to beat the clock! Find the speed marker by the lane bend!',
      clueZh: '快如疾風！將閃耀的金色接力棒一棒傳一棒，刷新計時紀錄！快在跑道彎道旁找到速度標記！',
      keywords: ['relay', 'wind', 'baton', 'clock', 'speed'],
      phoneticHint: 'Starts with F • /fæst/'
    },
    {
      id: 'z4_open',
      zoneId: 'zone4',
      targetWord: 'OPEN',
      targetLabel: '終點衝線冠軍金色拱門',
      targetPos: [8.5, -6.0],
      companionWord: 'WIN',
      companionZh: '獲勝/贏得',
      companionPhonetic: '/wɪn/',
      companionSentence: 'Our sports team worked hard to win the trophy.',
      companionSentenceZh: '我們的運動隊伍努力訓練以贏得獎盃。',
      clueEn: 'Dash across the finish line under the golden triumphal trophy arch to win the championship! What action opens the gate to the train station?',
      clueZh: '衝過金色凱旋獎盃拱門下的終點線以贏得冠軍！是什麼動作打開通往火車站的大門？',
      keywords: ['win', 'trophy', 'championship', 'finish', 'arch'],
      phoneticHint: 'Starts with O • /ˈoʊ.pən/'
    },

    // ==========================================
    // Zone 5: 星光鐘樓車站 (Clocktower Train Station)
    // ==========================================
    {
      id: 'z5_train',
      zoneId: 'zone5',
      targetWord: 'TRAIN',
      targetLabel: '魔法星光蒸汽特快車頭',
      targetPos: [5.2, -3.2],
      companionWord: 'TRAVEL',
      companionZh: '旅行',
      companionPhonetic: '/ˈtræv.əl/',
      companionSentence: 'We travel to famous cities by comfortable rail.',
      companionSentenceZh: '我們搭乘舒適的鐵道前往著名城市旅行。',
      clueEn: 'Choo choo! Puffing white steam and rolling on iron tracks, this giant locomotive is ready to travel to wizard academies. Climb to the engine!',
      clueZh: '火車鳴笛汽笛長鳴！吐出陣陣白蒸氣，在鐵軌上滾滾前行，這輛巨型火車頭已準備好啟程旅行。快走向火車頭！',
      keywords: ['travel', 'steam', 'locomotive', 'tracks', 'engine'],
      phoneticHint: 'Starts with T • /treɪn/'
    },
    {
      id: 'z5_time',
      zoneId: 'zone5',
      targetWord: 'TIME',
      targetLabel: '天球儀天文鐘樓',
      targetPos: [-3.8, -6.5],
      companionWord: 'CLOCK',
      companionZh: '時鐘',
      companionPhonetic: '/klɑːk/',
      companionSentence: 'Look at the wall clock to see what time it is.',
      companionSentenceZh: '看看牆上的時鐘，看看現在幾點了。',
      clueEn: 'Tick-tock, tick-tock! Roman numerals and golden clock hands tell everyone the exact departure time. Look up at the giant clock face!',
      clueZh: '滴答、滴答！羅馬數字與黃金鐘針為每個人報出準確的發車時間。仰望這座巨型鐘樓表面！',
      keywords: ['clock', 'hands', 'numerals', 'departure', 'tick'],
      phoneticHint: 'Starts with T • /taɪm/'
    },
    {
      id: 'z5_ticket',
      zoneId: 'zone5',
      targetWord: 'TICKET',
      targetLabel: '月台復古黃銅售票窗口',
      targetPos: [-9.7, -2.5],
      companionWord: 'MONEY',
      companionZh: '金錢/零錢',
      companionPhonetic: '/ˈmʌn.i/',
      companionSentence: 'Keep your pocket money safe when buying goods.',
      companionSentenceZh: '購買物品時請收好你的零用錢。',
      clueEn: 'Step up to the brass barred window and hand over your stamped pass to receive your passenger boarding ticket! Check the counter!',
      clueZh: '走到黃銅欄杆窗口前，出示你蓋滿印章的護照，領取乘客乘車票！快去櫃檯前查看！',
      keywords: ['boarding', 'brass', 'counter', 'pass', 'conductor'],
      phoneticHint: 'Starts with T • /ˈtɪk.ɪt/'
    },
    {
      id: 'z5_morning',
      zoneId: 'zone5',
      targetWord: 'MORNING',
      targetLabel: '晨曦煤氣月台路燈與長椅',
      targetPos: [-4.5, 1.0],
      companionWord: 'SUNRISE',
      companionZh: '日出/朝陽',
      companionPhonetic: '/ˈsʌn.raɪz/',
      companionSentence: 'Early morning sunrise paints the clouds in orange.',
      companionSentenceZh: '清晨的日出將雲彩染成橘色。',
      clueEn: 'Good morning, travelers! When early morning dawn breaks, this warm antique gas lamp shines bright for passengers waiting on the bench. Find it!',
      clueZh: '早安，旅人們！當清晨的第一道曙光破曉時，這盞復古煤氣燈為長椅上等候的乘客照亮道路。快去找到它！',
      keywords: ['sunrise', 'dawn', 'bench', 'gas lamp', 'travelers'],
      phoneticHint: 'Starts with M • /ˈmɔːr.nɪŋ/'
    },
    {
      id: 'z5_clock',
      zoneId: 'zone5',
      targetWord: 'CLOCK',
      targetLabel: '古典青銅天文大時鐘',
      targetPos: [-3.8, -6.5],
      companionWord: 'WATCH',
      companionZh: '手錶',
      companionPhonetic: '/wɑːtʃ/',
      companionSentence: 'My grandfather wears a gold watch on his wrist.',
      companionSentenceZh: '我爺爺在手腕上戴著一隻金手錶。',
      clueEn: 'Tick-tock! Look up at the giant brass astronomical clock dial perched upon the train terminal tower! What timepiece measures the hours?',
      clueZh: '滴答、滴答！抬頭仰望火車站塔樓頂部的巨型黃銅天文鐘面！是用什麼時計來測量時光？',
      keywords: ['watch', 'dial', 'tower', 'hours', 'timepiece'],
      phoneticHint: 'Starts with C • /klɑːk/'
    },
    {
      id: 'z5_open',
      zoneId: 'zone5',
      targetWord: 'OPEN',
      targetLabel: '特快車車廂登車門',
      targetPos: [4.8, 2.2],
      companionWord: 'CARRIAGE',
      companionZh: '車廂/客車',
      companionPhonetic: '/ˈkær.ɪdʒ/',
      companionSentence: 'The passenger carriage is warm and comfortable.',
      companionSentenceZh: '客運車廂溫暖又舒適。',
      clueEn: 'Walk across the red carpet, climb the iron footsteps, and step into the passenger carriage! What magic word unlocks the grand train doors?',
      clueZh: '走過紅地毯，登上鐵階梯，走進客車車廂！是什麼魔法單字打開了宏偉的列車大門？',
      keywords: ['carriage', 'carpet', 'passengers', 'steps', 'door'],
      phoneticHint: 'Starts with O • /ˈoʊ.pən/'
    },

    // ==========================================
    // Zone 6: 蔚藍秘境海港 (Harbor Haven)
    // ==========================================
    {
      id: 'z6_boat',
      zoneId: 'zone6',
      targetWord: 'BOAT',
      targetLabel: '海港木棧道小木舟',
      targetPos: [-6.5, 2.5],
      companionWord: 'LAKE',
      companionZh: '湖泊',
      companionPhonetic: '/leɪk/',
      companionSentence: 'We rowed a wooden boat across the peaceful lake.',
      companionSentenceZh: '我們划著小木舟穿過了平靜的湖泊。',
      clueEn: 'Tied gently with hemp ropes to the wooden harbor dock, this little rowboat floats peacefully on the waves. Step onto the dock pier!',
      clueZh: '用麻繩輕輕繫在木製碼頭棧道旁，這艘小木舟在浪濤中平靜漂浮。快踏上海港棧橋！',
      keywords: ['lake', 'dock', 'ropes', 'waves', 'row'],
      phoneticHint: 'Starts with B • /boʊt/'
    },
    {
      id: 'z6_fish',
      zoneId: 'zone6',
      targetWord: 'FISH',
      targetLabel: '鮮魚木桶與漁網',
      targetPos: [-3.5, -4.8],
      companionWord: 'SWIM',
      companionZh: '游泳',
      companionPhonetic: '/swɪm/',
      companionSentence: 'Little goldfish swim happily in fresh water.',
      companionSentenceZh: '小金魚在清澈的水中快活用游。',
      clueEn: 'With shiny silver scales and swimming fins, fishermen caught these fresh from the sea into wooden barrels. Head to the fish stall!',
      clueZh: '長著閃亮的銀色魚鱗與游動鰭條，漁夫剛從大海捕撈進木桶裡。快前往鮮魚攤位！',
      keywords: ['swim', 'scales', 'barrel', 'fisherman', 'sea'],
      phoneticHint: 'Starts with F • /fɪʃ/'
    },
    {
      id: 'z6_ship',
      zoneId: 'zone6',
      targetWord: 'SHIP',
      targetLabel: '皇家無畏號巨型三桅帆船',
      targetPos: [6.8, -2.5],
      companionWord: 'OCEAN',
      companionZh: '海洋',
      companionPhonetic: '/ˈoʊ.ʃən/',
      companionSentence: 'Huge ships sail across the wide blue ocean.',
      companionSentenceZh: '巨大的輪船航行穿過遼闊的藍色海洋。',
      clueEn: 'Behold the three towering masts, billowing white canvas sails, and golden cannons of this grand royal vessel sailing the ocean! Board the gangway!',
      clueZh: '看看這艘航行於大洋上的皇家旗艦，擁有三根高聳桅杆、鼓滿風的白帆與金色大砲！快踏上登船跳板！',
      keywords: ['ocean', 'masts', 'sails', 'cannons', 'galleon'],
      phoneticHint: 'Starts with S • /ʃɪp/'
    },
    {
      id: 'z6_wind',
      zoneId: 'zone6',
      targetWord: 'WIND',
      targetLabel: '紅白條紋燈塔與風向雞儀',
      targetPos: [8.5, 4.5],
      companionWord: 'WEATHER',
      companionZh: '天氣',
      companionPhonetic: '/ˈwɛð.ɚ/',
      companionSentence: 'Check the weather report before going sailing.',
      companionSentenceZh: '出海航行前請先查看天氣預報。',
      clueEn: 'Whoosh! You cannot see it, but you can feel it blow against your hair and spin the brass rooster vane on the tall lighthouse. Look up!',
      clueZh: '呼呼！你看不見它，但能感受它拂過你的髮絲，並轉動高聳燈塔頂端的黃銅公雞風向標。抬頭望望！',
      keywords: ['weather', 'blow', 'breeze', 'lighthouse', 'vane'],
      phoneticHint: 'Starts with W • /wɪnd/'
    },
    {
      id: 'z6_sea',
      zoneId: 'zone6',
      targetWord: 'SEA',
      targetLabel: '木造棧橋觀景露台',
      targetPos: [0.0, -10.0],
      companionWord: 'BLUE',
      companionZh: '藍色的',
      companionPhonetic: '/bluː/',
      companionSentence: 'The deep blue sea sparkles under warm sunshine.',
      companionSentenceZh: '深藍色的大海在溫暖陽光下波光粼粼。',
      clueEn: 'Gaze out past the wooden pier to where salt spray splashes against the rocks! What vast body of blue water stretches to the horizon?',
      clueZh: '穿過木造棧橋遠眺，浪花四濺拍打在礁石上！是哪片浩瀚無垠的藍色水域一直延伸到地平線？',
      keywords: ['blue', 'salt', 'spray', 'waves', 'horizon'],
      phoneticHint: 'Starts with S • /siː/'
    },
    {
      id: 'z6_open',
      zoneId: 'zone6',
      targetWord: 'OPEN',
      targetLabel: '海港星光穿梭空橋',
      targetPos: [0.0, 11.0],
      companionWord: 'BRIDGE',
      companionZh: '橋樑',
      companionPhonetic: '/brɪdʒ/',
      companionSentence: 'We walked across the rainbow bridge into the sky.',
      companionSentenceZh: '我們走過彩虹橋邁入天空。',
      clueEn: 'At the south platform of the harbor, a shimmering starlight skybridge reaches high toward the clouds! What word opens this soaring bridge?',
      clueZh: '在海港南側月台上，一座微光閃爍的星光天橋直通雲霄！是什麼單字開啟了這座高聳入雲的空橋？',
      keywords: ['bridge', 'clouds', 'skybridge', 'starlight', 'platform'],
      phoneticHint: 'Starts with O • /ˈoʊ.pən/'
    },

    // ==========================================
    // Zone 7: 雲頂星空觀測站 (Celestial Observatory)
    // ==========================================
    {
      id: 'z7_sky',
      zoneId: 'zone7',
      targetWord: 'SKY',
      targetLabel: '維多利亞赤道儀望遠鏡',
      targetPos: [0.0, -6.5],
      companionWord: 'NIGHT',
      companionZh: '夜晚',
      companionPhonetic: '/naɪt/',
      companionSentence: 'The dark night sky is full of sparkling stars.',
      companionSentenceZh: '漆黑的夜空充滿了閃爍的星辰。',
      clueEn: 'Look through the brass telescope high above the clouds! What deep indigo vault holds planets, nebulae, and the Big Dipper constellation?',
      clueZh: '透過高聳於雲海之上的黃銅望遠鏡凝視！是哪片深邃靛藍的穹頂容納了行星、星雲與北斗七星？',
      keywords: ['telescope', 'planets', 'clouds', 'stars', 'vault'],
      phoneticHint: 'Starts with S • /skaɪ/'
    },
    {
      id: 'z7_star',
      zoneId: 'zone7',
      targetWord: 'STAR',
      targetLabel: '多軸鐘動渾天儀與遠古星羅盤',
      targetPos: [-6.5, -1.0],
      companionWord: 'LIGHT',
      companionZh: '光芒',
      companionPhonetic: '/laɪt/',
      companionSentence: 'Starlight twinkles from millions of miles away.',
      companionSentenceZh: '星光自數百萬英里之外閃爍而來。',
      clueEn: 'Twinkle, twinkle! Inside the spinning brass armillary sphere, a radiant cosmic core glows with pure starlight. Touch the astrolabe!',
      clueZh: '一閃一閃亮晶晶！在旋轉的黃銅渾天儀內部，一顆發光的宇宙星核正散發純淨星光。快觸碰這座星盤！',
      keywords: ['starlight', 'twinkle', 'sphere', 'astrolabe', 'core'],
      phoneticHint: 'Starts with S • /stɑːr/'
    },
    {
      id: 'z7_moon',
      zoneId: 'zone7',
      targetWord: 'MOON',
      targetLabel: '蒼月潮汐日晷儀',
      targetPos: [6.5, -1.0],
      companionWord: 'NIGHT',
      companionZh: '夜晚',
      companionPhonetic: '/naɪt/',
      companionSentence: 'The bright moon glows softly in the dark night.',
      companionSentenceZh: '明月在漆黑的夜晚溫柔發光。',
      clueEn: 'Crescent, quarter, or full! This silver marble dial tracks the changing phases of our celestial night companion. Walk to the silver dial!',
      clueZh: '蛾眉月、上弦月還是滿月！這座銀白大理石日晷記錄著我們夜空良伴的月相盈虧。走向銀色表盤！',
      keywords: ['phases', 'crescent', 'silver', 'night', 'dial'],
      phoneticHint: 'Starts with M • /muːn/'
    },
    {
      id: 'z7_sun',
      zoneId: 'zone7',
      targetWord: 'SUN',
      targetLabel: '日冕分光三棱鏡與光譜投射台',
      targetPos: [-5.0, 4.0],
      companionWord: 'RAINBOW',
      companionZh: '彩虹',
      companionPhonetic: '/ˈreɪn.boʊ/',
      companionSentence: 'A seven-colored rainbow appeared after the rain.',
      companionSentenceZh: '雨後出現了一道七彩斑斕的彩虹。',
      clueEn: 'When brilliant morning rays pass through the quartz prism, pure solar light splits into a glorious 3D rainbow spectrum! Find the prism!',
      clueZh: '當燦爛的晨曦光束穿過石英棱鏡時，純淨的日光折射分裂成壯麗的 3D 彩虹光譜！快找到三棱鏡！',
      keywords: ['rainbow', 'prism', 'spectrum', 'quartz', 'solar'],
      phoneticHint: 'Starts with S • /sʌn/'
    },
    {
      id: 'z7_cloud',
      zoneId: 'zone7',
      targetWord: 'CLOUD',
      targetLabel: '雲海氣象風琴台',
      targetPos: [5.0, 4.0],
      companionWord: 'RAIN',
      companionZh: '下雨',
      companionPhonetic: '/reɪn/',
      companionSentence: 'Dark grey clouds bring cool rain to the forest.',
      companionSentenceZh: '深灰色的烏雲為森林帶來了涼爽的雨水。',
      clueEn: 'Floating like fluffy white cotton candy high in the stratosphere, these billowy mists make weather melodies on the organ pipes. Explore here!',
      clueZh: '如蓬鬆的白棉花糖般漂浮在高空平流層，這些翻湧的雲霧在風琴管上奏響氣象旋律。快來此處探索！',
      keywords: ['rain', 'fluffy', 'mist', 'cotton', 'organ'],
      phoneticHint: 'Starts with C • /klaʊd/'
    },
    {
      id: 'z7_open',
      zoneId: 'zone7',
      targetWord: 'OPEN',
      targetLabel: '星界凱旋雙拱星門',
      targetPos: [0.0, 10.5],
      companionWord: 'PORTAL',
      companionZh: '傳送門',
      companionPhonetic: '/ˈpɔːr.təl/',
      companionSentence: 'Step through the glowing portal to enter a new world.',
      companionSentenceZh: '跨過發光的傳送門以進入全新世界。',
      clueEn: 'Twin marble arches frame the swirling starlight aurora bridge! What word unseals this cosmic portal to ascend toward the glacial heights?',
      clueZh: '雙重大理石拱門環抱著旋轉的星光極光橋！是什麼單字解開這座宇宙傳送門，讓人攀登極地雪山之巔？',
      keywords: ['portal', 'aurora', 'cosmic', 'arch', 'ascend'],
      phoneticHint: 'Starts with O • /ˈoʊ.pən/'
    },

    // ==========================================
    // Zone 8: 極光冰雪聖域 (Glacial Sanctuary)
    // ==========================================
    {
      id: 'z8_snow',
      zoneId: 'zone8',
      targetWord: 'SNOW',
      targetLabel: '3D 碎形雪花風向儀與冰晶祭壇',
      targetPos: [0.0, -6.5],
      companionWord: 'WINTER',
      companionZh: '冬天',
      companionPhonetic: '/ˈwɪn.tɚ/',
      companionSentence: 'Cold winter brings soft white snow everywhere.',
      companionSentenceZh: '寒冷的冬天在各處帶來了柔軟的白雪。',
      clueEn: 'Brrr! Every single six-pointed crystal falling from winter skies is uniquely crafted by nature. Approach the glowing snowflake altar!',
      clueZh: '好冷呀！從冬日天空飄落的每一片六芒冰晶都是大自然獨一無二的傑作。快靠近這座發光的雪花祭壇！',
      keywords: ['winter', 'crystal', 'snowflake', 'altar', 'nature'],
      phoneticHint: 'Starts with S • /snoʊ/'
    },
    {
      id: 'z8_cold',
      zoneId: 'zone8',
      targetWord: 'COLD',
      targetLabel: '極寒破裂玄冰方尖碑與鎖鏈',
      targetPos: [-6.5, -1.0],
      companionWord: 'ICE',
      companionZh: '冰塊/結冰',
      companionPhonetic: '/aɪs/',
      companionSentence: 'The freezing river turned into solid blue ice.',
      companionSentenceZh: '冰凍的河流結成了堅硬的藍色冰塊。',
      clueEn: 'Shiver! Wrapped in frozen iron chains, this ancient iceberg obelisk is frozen solid below zero degrees. Touch the icy monolith!',
      clueZh: '打個寒顫！纏繞著冰封鐵鍊，這座遠古玄冰方尖碑在零度以下凍成堅冰。快觸碰這座極寒的巨石！',
      keywords: ['ice', 'freezing', 'zero', 'chains', 'obelisk'],
      phoneticHint: 'Starts with C • /koʊld/'
    },
    {
      id: 'z8_winter',
      zoneId: 'zone8',
      targetWord: 'WINTER',
      targetLabel: '蒼古極地冬松與防風提燈',
      targetPos: [6.5, -1.0],
      companionWord: 'SEASON',
      companionZh: '季節',
      companionPhonetic: '/ˈsiː.zən/',
      companionSentence: 'My favorite season is chilly winter with holidays.',
      companionSentenceZh: '我最喜歡的季節是帶著假期的涼爽冬季。',
      clueEn: 'Which cold season brings frosty mornings, holidays, and pine boughs weighted down by soft white snow? Gather under the ancient pine!',
      clueZh: '是哪一個寒冷的季節帶來霜凍晨曦、假期，以及被軟雪壓彎枝頭的松樹？快聚集到蒼古冬松之下！',
      keywords: ['season', 'frosty', 'pine', 'snow', 'holidays'],
      phoneticHint: 'Starts with W • /ˈwɪn.tɚ/'
    },
    {
      id: 'z8_white',
      zoneId: 'zone8',
      targetWord: 'WHITE',
      targetLabel: '手工毛線暖裝雪人與雪兔伴侶',
      targetPos: [-5.0, 4.0],
      companionWord: 'SNOWMAN',
      companionZh: '雪人',
      companionPhonetic: '/ˈsnoʊ.mæn/',
      companionSentence: 'Children build a smiling snowman in the yard.',
      companionSentenceZh: '孩子們在院子裡堆起微笑的雪人。',
      clueEn: 'Wearing a knitted blue beanie and scarf, this jolly snowman is rolled out of pure spotless powder snow. What color is his body?',
      clueZh: '戴著編織毛線帽與圍巾，這位討人喜歡的雪人是由純淨無瑕的白粉雪滾成的。他的身體是什麼顏色？',
      keywords: ['snowman', 'powder', 'color', 'beanie', 'carrot'],
      phoneticHint: 'Starts with W • /waɪt/'
    },
    {
      id: 'z8_warm',
      zoneId: 'zone8',
      targetWord: 'WARM',
      targetLabel: '極地探險營火、柴堆與熱水銅壺',
      targetPos: [5.0, 4.0],
      companionWord: 'FIRE',
      companionZh: '火焰/火堆',
      companionPhonetic: '/faɪr/',
      companionSentence: 'A crackling camp fire gives off cozy heat.',
      companionSentenceZh: '劈啪作響的營火散發出舒適溫暖的熱度。',
      clueEn: 'Rub your frosty mittens together! Red glowing embers and boiling steam from a copper kettle make this polar campsite cozy. Warm up by the fire!',
      clueZh: '搓搓你凍僵的手套！紅彤彤的餘燼與銅水壺升騰的蒸汽讓這座極地營地格外舒適。快到火堆旁暖暖身子！',
      keywords: ['fire', 'embers', 'kettle', 'steam', 'cozy'],
      phoneticHint: 'Starts with W • /wɔːrm/'
    },
    {
      id: 'z8_climb',
      zoneId: 'zone8',
      targetWord: 'CLIMB',
      targetLabel: '極光之巔冰封攀登天梯',
      targetPos: [-8.5, -3.8],
      companionWord: 'MOUNTAIN',
      companionZh: '山峰',
      companionPhonetic: '/ˈmaʊn.tən/',
      companionSentence: 'Brave explorers hike up the high mountain summit.',
      companionSentenceZh: '勇敢的探險家徒步攀登高聳的山峰頂端。',
      clueEn: 'Step by step, lift your knees and ascend the steep glacial staircase toward the glowing astral heavens! Journey to the peak!',
      clueZh: '一步接一步，抬起雙膝，沿著陡峭的冰川階梯登上發光的星界天庭！踏上通往山巔的旅途！',
      keywords: ['mountain', 'staircase', 'ascend', 'summit', 'peak'],
      phoneticHint: 'Starts with C • /klaɪm/'
    },

    // ==========================================
    // Zone 9: 星界萬神殿堂：智慧大圖書館 (The Grand Astral Pantheon)
    // ==========================================
    {
      id: 'z9_library',
      zoneId: 'zone9',
      targetWord: 'LIBRARY',
      targetLabel: '雙層弧形紅木萬卷藏書閣',
      targetPos: [0.0, -6.5],
      companionWord: 'SCHOOL',
      companionZh: '學校',
      companionPhonetic: '/skuːl/',
      companionSentence: 'Our school has thousands of good books to read.',
      companionSentenceZh: '我們學校有成千上萬本好書可以閱讀。',
      clueEn: 'Shh! Walk softly among towering mahogany shelves filled with leather grimoires, rolling ladders, and quiet study alcoves. Welcome to the sanctuary of books!',
      clueZh: '噓！輕聲漫步在高聳的紅木書架之間，架上擺滿了精裝古籍、滑動爬梯與寧靜的研讀座。歡迎來到典籍的聖域！',
      keywords: ['school', 'shelves', 'grimoires', 'quiet', 'books'],
      phoneticHint: 'Starts with L • /ˈlaɪ.brər.i/'
    },
    {
      id: 'z9_read',
      zoneId: 'zone9',
      targetWord: 'READ',
      targetLabel: '漢白玉雄鷹雕花講台與懸浮大典',
      targetPos: [-6.5, -1.0],
      companionWord: 'STORY',
      companionZh: '故事',
      companionPhonetic: '/ˈstɔːr.i/',
      companionSentence: 'Grandmother tells a bedtime story every evening.',
      companionSentenceZh: '祖母每天晚上都會講一個睡前故事。',
      clueEn: 'Above the stone eagle lectern, an ancient spellbook floats and turns its glowing parchment pages. Open your eyes and read the words!',
      clueZh: '在石雕雄鷹講台上方，一本遠古魔法典籍正在半空中翻動發光的羊皮紙書頁。張開你的雙眼，細細品讀文字！',
      keywords: ['story', 'spellbook', 'pages', 'lectern', 'words'],
      phoneticHint: 'Starts with R • /riːd/'
    },
    {
      id: 'z9_write',
      zoneId: 'zone9',
      targetWord: 'WRITE',
      targetLabel: '黑曜石與櫻桃木銘刻書桌',
      targetPos: [6.5, -1.0],
      companionWord: 'LETTER',
      companionZh: '信件/字母',
      companionPhonetic: '/ˈlɛt.ɚ/',
      companionSentence: 'I write a thank-you letter to my teacher.',
      companionSentenceZh: '我寫了一封感謝信給我的老師。',
      clueEn: 'Dip the golden peacock feather quill into the crystal inkwell and pen magical runes upon the unrolled parchment scroll! Head to the scribe desk!',
      clueZh: '將金色孔雀羽毛筆浸入水晶墨水瓶中，在展開的羊皮紙卷軸上書寫魔法符文！快走向書吏銘刻書桌！',
      keywords: ['letter', 'quill', 'inkwell', 'scroll', 'pen'],
      phoneticHint: 'Starts with W • /raɪt/'
    },
    {
      id: 'z9_think',
      zoneId: 'zone9',
      targetWord: 'THINK',
      targetLabel: '八角漢白玉倒影哲思活泉',
      targetPos: [-5.0, 4.0],
      companionWord: 'BRAIN',
      companionZh: '大腦/思維',
      companionPhonetic: '/breɪn/',
      companionSentence: 'Use your clever brain to solve challenging puzzles.',
      companionSentenceZh: '運用你聰明的大腦來解開具有挑戰性的謎題。',
      clueEn: 'Gaze into the starlit reflection pool as a crystal dodecahedron spins slowly in the air. Pause, breathe, and ponder wise questions!',
      clueZh: '凝望倒映星光的哲思活泉，半空中一顆晶體十二面體正緩慢自轉。停下腳步、深呼吸，沉思智慧的哲理！',
      keywords: ['brain', 'pool', 'crystal', 'ponder', 'puzzle'],
      phoneticHint: 'Starts with T • /θɪŋk/'
    },
    {
      id: 'z9_smart',
      zoneId: 'zone9',
      targetWord: 'SMART',
      targetLabel: '拋光黃銅古希臘真理天平',
      targetPos: [5.0, 4.0],
      companionWord: 'CLEVER',
      companionZh: '聰穎的/機靈的',
      companionPhonetic: '/ˈklɛv.ɚ/',
      companionSentence: 'The clever student got full marks on the exam.',
      companionSentenceZh: '這位聰穎的學生在測驗中拿到了滿分。',
      clueEn: 'On the left plate rests a gleaming golden brain, balanced against a starlight prism. Master your lessons and prove how clever you are!',
      clueZh: '左邊托盤上擺放著一座閃閃發光的金色大腦模型，與右邊的星棱水晶精準平衡。精通你的課業，證明你是多麼博學聰慧！',
      keywords: ['clever', 'scales', 'brain', 'balance', 'wisdom'],
      phoneticHint: 'Starts with S • /smɑːrt/'
    },
    {
      id: 'z9_fly',
      zoneId: 'zone9',
      targetWord: 'FLY',
      targetLabel: '破空凌虛飛翔露台與金鷹',
      targetPos: [0.0, -12.5],
      companionWord: 'WING',
      companionZh: '翅膀',
      companionPhonetic: '/wɪŋ/',
      companionSentence: 'Eagles spread their wide wings and fly over mountains.',
      companionSentenceZh: '雄鷹展開寬闊的雙翼，飛越崇山峻嶺。',
      clueEn: 'Stand upon the marble terrace flanked by twin golden eagles, spread your luminous wings of light, and soar into the astral heavens! Complete your journey!',
      clueZh: '站在兩隻金雕護衛的大理石露台上，展開你璀璨的光之羽翼，翱翔直上星界九天！完成你的尋寶壯舉！',
      keywords: ['wing', 'eagles', 'terrace', 'soar', 'sky'],
      phoneticHint: 'Starts with F • /flaɪ/'
    },
    {
      id: 'zone10_island',
      zoneId: 'zone10',
      targetWord: 'ISLAND',
      targetLabel: '蒼穹浮空主島迎賓方尖碑',
      targetPos: [0.0, 5.0],
      companionWord: 'GARDEN',
      companionZh: '花園/園地',
      companionPhonetic: '/ˈɡɑːr.dən/',
      companionSentence: 'Flowers bloom happily in our sunny garden.',
      companionSentenceZh: '花朵在陽光明媚的花園裡歡欣盛開。',
      clueEn: 'Floating high above boundless white clouds, a lush emerald paradise drifts in the sky. Touch the welcoming monolith on this magical floating land!',
      clueZh: '懸浮在無邊無際的白雲之上，一座翠綠翡翠仙境在天際漂浮。快去觸碰這座漂浮仙境的迎賓方尖碑！',
      keywords: ['clouds', 'floating', 'emerald', 'sky', 'land'],
      phoneticHint: 'Starts with I • /ˈaɪ.lənd/'
    },
    {
      id: 'zone10_rainbow',
      zoneId: 'zone10',
      targetWord: 'RAINBOW',
      targetLabel: '七彩虹霓以太天橋',
      targetPos: [0.0, 0.0],
      companionWord: 'COLOR',
      companionZh: '顏色/色彩',
      companionPhonetic: '/ˈkʌl.ɚ/',
      companionSentence: 'Yellow is the bright color of the morning sun.',
      companionSentenceZh: '黃色是清晨朝陽明亮的色彩。',
      clueEn: 'After the spring shower, seven glowing colors arch across the open sky. Walk along the luminous bridge of light spanning between the floating isles!',
      clueZh: '春雨過後，七種璀璨的色彩在開闊的天空中劃出一道光弧。快走上橫跨空島之間的七彩光芒天橋！',
      keywords: ['colors', 'bridge', 'sky', 'light', 'arch'],
      phoneticHint: 'Starts with R • /ˈreɪn.boʊ/'
    },
    {
      id: 'zone10_music',
      zoneId: 'zone10',
      targetWord: 'MUSIC',
      targetLabel: '浮空涼亭天籟水晶星琴',
      targetPos: [7.5, -2.5],
      companionWord: 'HAPPY',
      companionZh: '快樂的高興的',
      companionPhonetic: '/ˈhæp.i/',
      companionSentence: 'Singing songs always makes the children very happy.',
      companionSentenceZh: '唱歌總是讓孩子們感到非常快樂。',
      clueEn: 'Step into the open-air marble gazebo where crystal piano keys play themselves and golden notes float in the gentle breeze. Listen to the sweet melody!',
      clueZh: '走進這座露天大理石涼亭，水晶鋼琴鍵正自行彈奏，金色音符在微風中輕盈飄揚。快聆聽這段甜美的旋律！',
      keywords: ['piano', 'melody', 'keys', 'gazebo', 'notes'],
      phoneticHint: 'Starts with M • /ˈmjuː.zɪk/'
    },
    {
      id: 'zone10_sing',
      zoneId: 'zone10',
      targetWord: 'SING',
      targetLabel: '天青靈鳥歌詠鳥居',
      targetPos: [8.5, 2.5],
      companionWord: 'SPRING',
      companionZh: '春天/泉水',
      companionPhonetic: '/sprɪŋ/',
      companionSentence: 'Swallows return and flowers bloom in warm spring.',
      companionSentenceZh: '燕子歸來，花朵在溫暖的春天盛開。',
      clueEn: 'Perched upon the golden torii arch, a brilliant sapphire skybird spreads its wings and chirps joyful tunes to welcome the dawn. Raise your voice and join the bird!',
      clueZh: '棲息在金色鳥居之上，一隻璀璨的天青靈鳥展開雙翼，歡快地啼鳴以迎接破曉。快靠近靈鳥，大聲詠唱！',
      keywords: ['bird', 'wings', 'tunes', 'voice', 'dawn'],
      phoneticHint: 'Starts with S • /sɪŋ/'
    },
    {
      id: 'zone10_dance',
      zoneId: 'zone10',
      targetWord: 'DANCE',
      targetLabel: '星光石英律動舞池',
      targetPos: [-7.5, -2.5],
      companionWord: 'BEE',
      companionZh: '蜜蜂',
      companionPhonetic: '/biː/',
      companionSentence: 'The busy bee dances around sweet blossoms.',
      companionSentenceZh: '勤勞的蜜蜂在香甜的花朵周圍跳舞。',
      clueEn: 'Step rhythmically onto the circular quartz plaza. With every step you take, illuminated stepping pads light up with rainbow colors and chime like bells!',
      clueZh: '跟隨節奏踏上這座圓形石英舞池。你踏出的每一步，發光的踏板都會亮起彩虹色彩並發出如風鈴般的清脆聲響！',
      keywords: ['rhythm', 'quartz', 'pads', 'colors', 'step'],
      phoneticHint: 'Starts with D • /dæns/'
    },
    {
      id: 'zone10_dream',
      zoneId: 'zone10',
      targetWord: 'DREAM',
      targetLabel: '蒼穹祈願星泉落雲飛瀑',
      targetPos: [-8.5, 2.5],
      companionWord: 'HOPE',
      companionZh: '希望/盼望',
      companionPhonetic: '/hoʊp/',
      companionSentence: 'We study with great hope for a bright future.',
      companionSentenceZh: '我們懷抱著對光明未來的巨大希望努力學習。',
      clueEn: 'At the edge of the sky island, an octagonal starlight basin pours clear water into endless cloud waterfalls. Close your eyes, make a wish, and reach for your aspirations!',
      clueZh: '在空島的邊緣，一座八角星光天池將清泉傾瀉成無盡的落雲飛瀑。閉上雙眼，在此許下心願，擁抱你最遠大的志向！',
      keywords: ['basin', 'waterfall', 'wish', 'aspirations', 'clouds'],
      phoneticHint: 'Starts with D • /driːm/'
    }
  ];

  class ScavengerHuntManager {
    constructor(world) {
      this.world = world;
      this.clues = SCAVENGER_CLUES;
      this.currentQuest = null;
      this.questMode = 'zone'; // 'zone' | 'streak' | 'all'
      this.streakCount = 0;
      this.targetStreak = 3;
      this.coins = 0;
      this.totalFound = 0;
      this.solvedClueIds = new Set();
      this.isVoicePlaying = false;
      this.currentVoiceRate = 0.85;

      this.lastRadarState = 'idle'; // 'cold' | 'warm' | 'hot'
      this.tempVector = (typeof THREE !== 'undefined' && THREE.Vector3) ? new THREE.Vector3() : { x: 0, y: 0, z: 0 };

      this.loadSavedProgress();
      this.bindDOM();
    }

    loadSavedProgress() {
      if (typeof localStorage === 'undefined') return;
      try {
        const savedCoins = localStorage.getItem('scavenger_coins_count');
        if (savedCoins) this.coins = parseInt(savedCoins, 10) || 0;
        const savedTotal = localStorage.getItem('scavenger_total_found');
        if (savedTotal) this.totalFound = parseInt(savedTotal, 10) || 0;
        const savedSolved = localStorage.getItem('scavenger_solved_ids');
        if (savedSolved) this.solvedClueIds = new Set(JSON.parse(savedSolved));
      } catch (e) {}
    }

    saveProgress() {
      if (typeof localStorage === 'undefined') return;
      try {
        localStorage.setItem('scavenger_coins_count', String(this.coins));
        localStorage.setItem('scavenger_total_found', String(this.totalFound));
        localStorage.setItem('scavenger_solved_ids', JSON.stringify([...this.solvedClueIds]));
      } catch (e) {}
    }

    bindDOM() {
      // 綁定全域函式供 HTML 按鈕調用
      if (typeof window !== 'undefined') {
        window.openScavengerModal = () => this.openScavengerModal();
        window.closeScavengerModal = () => this.closeScavengerModal();
        window.startScavengerHunt = (mode) => this.startHunt(mode);
        window.playScavengerClueVoice = (rate) => this.playClueVoice(rate);
        window.toggleScavengerClueText = () => this.toggleClueText();
        window.abandonScavengerQuest = () => this.abandonQuest();
        window.verifyCurrentScavengerTarget = () => this.verifyCurrentTargetManual();
        window.closeScavengerVictory = () => this.closeVictoryModal();
      }
    }

    isQuestActive() {
      return this.currentQuest !== null;
    }

    getCurrentZoneId() {
      if (this.world && this.world.zoneManager) {
        return this.world.zoneManager.currentZoneId || 'zone1';
      }
      return 'zone1';
    }

    // 啟動尋寶任務
    startHunt(mode = 'zone') {
      this.questMode = mode;
      const curZone = this.getCurrentZoneId();

      let candidateClues = [];
      if (mode === 'zone') {
        candidateClues = this.clues.filter(c => c.zoneId === curZone);
      } else if (mode === 'streak') {
        // 每日三連：優先挑選當前空間或已解鎖空間
        const unlocked = (this.world && this.world.zoneManager) ? this.world.zoneManager.getUnlockedZoneIds() : [curZone];
        candidateClues = this.clues.filter(c => unlocked.includes(c.zoneId));
      } else {
        // all: 全境隨機
        const unlocked = (this.world && this.world.zoneManager) ? this.world.zoneManager.getUnlockedZoneIds() : [curZone];
        candidateClues = this.clues.filter(c => unlocked.includes(c.zoneId));
      }

      if (candidateClues.length === 0) {
        candidateClues = this.clues.filter(c => c.zoneId === curZone);
      }

      // 優先挑選未解過的題目
      const unsolved = candidateClues.filter(c => !this.solvedClueIds.has(c.id));
      const pool = unsolved.length > 0 ? unsolved : candidateClues;

      const pick = pool[Math.floor(Math.random() * pool.length)];
      this.currentQuest = {
        ...pick,
        startTime: Date.now(),
        hintsUsed: 0
      };

      this.closeScavengerModal();
      this.showTrackerBar();
      this.updateTrackerDisplay();

      // 播放一次提示音效並朗讀英語線索
      if (this.world && window.audioManager) {
        window.audioManager.playSfx('interact');
      }
      setTimeout(() => {
        this.playClueVoice(0.85);
      }, 400);

      if (this.world) {
        this.world.showToast(`🧭 聽力尋寶任務啟動！請仔細聆聽外師線索，找出藏在空間裡的寶物！`);
      }
    }

    // 播放英語線索外師語音 (支援正常速度 0.85x 與慢速 0.65x)
    playClueVoice(rate = 0.85) {
      if (!this.currentQuest) return;
      this.currentVoiceRate = rate;

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(this.currentQuest.clueEn);
          utter.lang = 'en-US';
          utter.rate = rate;
          utter.pitch = 1.05;

          utter.onstart = () => {
            this.isVoicePlaying = true;
            this.updateVoiceVisualizer(true);
          };
          utter.onend = () => {
            this.isVoicePlaying = false;
            this.updateVoiceVisualizer(false);
          };
          utter.onerror = () => {
            this.isVoicePlaying = false;
            this.updateVoiceVisualizer(false);
          };

          window.speechSynthesis.speak(utter);
        } catch (e) {
          console.warn('Speech synthesis playback error:', e);
        }
      }
    }

    stopClueVoice() {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
      }
      this.isVoicePlaying = false;
      this.updateVoiceVisualizer(false);
    }

    // 每幀更新雷達距離計算 (Euclidean Distance)
    update(delta) {
      if (!this.currentQuest || !this.world || !this.world.player) return;

      const playerPos = this.world.player.pos;
      const curZone = this.getCurrentZoneId();
      const targetZone = this.currentQuest.zoneId;

      const radarLabel = document.getElementById('scavengerRadarDist');
      const radarPill = document.getElementById('scavengerRadarPill');
      const verifyBtn = document.getElementById('scavengerVerifyBtn');

      // 若玩家身處不同空間，提示傳送前往
      if (curZone !== targetZone) {
        const zoneName = (this.world.zoneManager && this.world.zoneManager.zones[targetZone])
          ? this.world.zoneManager.zones[targetZone].name
          : targetZone;
        if (radarLabel) radarLabel.textContent = `線索位於【${zoneName}】`;
        if (radarPill) {
          radarPill.className = 'radar-pill radar-cross-zone';
          radarPill.innerHTML = `<span>🚀</span> 前往 ${zoneName}`;
        }
        if (verifyBtn) verifyBtn.style.display = 'none';
        return;
      }

      // 同空間計算距離
      const dx = playerPos.x - this.currentQuest.targetPos[0];
      const dz = playerPos.z - this.currentQuest.targetPos[1];
      const dist = Math.hypot(dx, dz);

      let state = 'cold';
      let stateText = '';
      if (dist > 12.0) {
        state = 'cold';
        stateText = `❄️ 距離：${dist.toFixed(1)}m (尚遠)`;
      } else if (dist > 3.5) {
        state = 'warm';
        stateText = `🟡 距離：${dist.toFixed(1)}m (接近中！)`;
      } else {
        state = 'hot';
        stateText = `🔴 距離：${dist.toFixed(1)}m (就在身邊！)`;
      }

      if (radarLabel) radarLabel.textContent = stateText;
      if (radarPill) {
        radarPill.className = `radar-pill radar-${state}`;
      }
      if (verifyBtn) {
        verifyBtn.style.display = (dist <= 3.5) ? 'flex' : 'none';
      }
    }

    // 驗證玩家互動目標是否為當前尋寶標的
    verifyTarget(targetWordOrId) {
      if (!this.currentQuest) return false;

      const normInput = (targetWordOrId || '').toUpperCase().trim();
      const targetWord = this.currentQuest.targetWord.toUpperCase().trim();

      // 檢查是否匹配單字本身、物件 ID 或別名
      const isMatch = (normInput === targetWord) ||
                      (normInput.includes(targetWord)) ||
                      (this.currentQuest.id.toUpperCase().includes(normInput));

      if (isMatch) {
        this.handleQuestSuccess();
        return true;
      } else {
        if (this.world) {
          this.world.showToast(`🧐 這是【${normInput}】喔！再仔細聽一次外師線索，找出不同的寶物吧！`);
        }
        return false;
      }
    }

    // 尋寶成功結算
    handleQuestSuccess() {
      const q = this.currentQuest;
      if (!q) return;

      this.stopClueVoice();
      this.solvedClueIds.add(q.id);
      this.totalFound++;
      this.coins++;
      this.streakCount++;

      this.saveProgress();

      // 經驗值獎勵：基礎 80 XP，若 streak 達成 3 題額外贈送 150 XP
      let bonusXp = 80;
      let isStreakAchieved = false;
      if (this.questMode === 'streak' && this.streakCount >= this.targetStreak) {
        bonusXp += 150;
        this.coins += 2;
        isStreakAchieved = true;
      }

      if (this.world) {
        this.world.addXP(bonusXp);
      }

      // 同步寫入雲端護照與本機單字庫 (目標詞 + 護照延伸生活詞)
      if (typeof window !== 'undefined' && window.cloudSyncManager && typeof window.cloudSyncManager.recordWordPass === 'function') {
        window.cloudSyncManager.recordWordPass(q.targetWord, 50, false);
        window.cloudSyncManager.recordWordPass(q.companionWord, 50, false);
      }

      if (this.world && window.audioManager) {
        window.audioManager.playSfx('magicSuccess');
      }

      // 彈出「🎉 尋寶成功！」雙軌學習卡
      this.showVictoryModal(q, bonusXp, isStreakAchieved);

      // 重設或輪轉下一題
      if (this.questMode === 'streak' && !isStreakAchieved) {
        // 繼續下一道連題
        this.currentQuest = null;
      } else {
        if (isStreakAchieved) this.streakCount = 0;
        this.currentQuest = null;
      }

      this.hideTrackerBar();
    }

    verifyCurrentTargetManual() {
      if (!this.currentQuest || !this.world || !this.world.player) return;
      const playerPos = this.world.player.pos;
      const dx = playerPos.x - this.currentQuest.targetPos[0];
      const dz = playerPos.z - this.currentQuest.targetPos[1];
      const dist = Math.hypot(dx, dz);

      if (dist <= 3.8) {
        this.handleQuestSuccess();
      } else {
        if (this.world) {
          this.world.showToast(`再靠近一點！目前距離寶物還有 ${dist.toFixed(1)}m。`);
        }
      }
    }

    abandonQuest() {
      this.stopClueVoice();
      this.currentQuest = null;
      this.streakCount = 0;
      this.hideTrackerBar();
      if (this.world) {
        this.world.showToast('已暫停當前聽力尋寶任務。');
      }
    }

    // ==========================================
    // UI 顯示控制
    // ==========================================

    openScavengerModal() {
      const modal = document.getElementById('scavengerHuntModal');
      if (!modal) return;
      modal.style.display = 'flex';

      const curZone = this.getCurrentZoneId();
      const zoneName = (this.world && this.world.zoneManager && this.world.zoneManager.zones[curZone])
        ? this.world.zoneManager.zones[curZone].name
        : '當前空間';

      const zoneTitleEl = document.getElementById('scavengerZoneModeTitle');
      if (zoneTitleEl) zoneTitleEl.textContent = `📍 在【${zoneName}】尋寶`;

      const streakBadge = document.getElementById('scavengerStreakBadge');
      if (streakBadge) streakBadge.textContent = `🔥 連續尋寶：${this.streakCount} / 3 題`;

      const coinsBadge = document.getElementById('scavengerCoinsTotal');
      if (coinsBadge) coinsBadge.textContent = `🪙 尋寶金幣：${this.coins} 枚`;

      if (this.world && window.audioManager) window.audioManager.playSfx('click');
    }

    closeScavengerModal() {
      const modal = document.getElementById('scavengerHuntModal');
      if (!modal) return;
      modal.style.display = 'none';
      if (this.world && window.audioManager) window.audioManager.playSfx('click');
    }

    showTrackerBar() {
      const tracker = document.getElementById('scavengerTrackerBar');
      if (tracker) tracker.style.display = 'flex';
    }

    hideTrackerBar() {
      const tracker = document.getElementById('scavengerTrackerBar');
      if (tracker) tracker.style.display = 'none';
    }

    updateTrackerDisplay() {
      if (!this.currentQuest) return;
      const targetLabel = document.getElementById('scavengerTargetHintText');
      if (targetLabel) {
        targetLabel.textContent = `🎧 聽力謎題進行中 (${this.currentQuest.phoneticHint})`;
      }
      const clueBox = document.getElementById('scavengerClueTextBox');
      if (clueBox) {
        clueBox.textContent = `“${this.currentQuest.clueEn}”`;
        clueBox.style.display = 'none'; // 預設盲聽，保持挑戰性
      }
      const zhBox = document.getElementById('scavengerClueZhBox');
      if (zhBox) {
        zhBox.textContent = `（中文釋義：${this.currentQuest.clueZh}）`;
        zhBox.style.display = 'none';
      }
    }

    toggleClueText() {
      const clueBox = document.getElementById('scavengerClueTextBox');
      const zhBox = document.getElementById('scavengerClueZhBox');
      const btn = document.getElementById('btnToggleClueText');
      if (!clueBox) return;

      const isHidden = (clueBox.style.display === 'none');
      clueBox.style.display = isHidden ? 'block' : 'none';
      if (zhBox) zhBox.style.display = isHidden ? 'block' : 'none';
      if (btn) btn.textContent = isHidden ? '🙈 隱藏文字' : '👁️ 看線索文字';
    }

    updateVoiceVisualizer(isPlaying) {
      const viz = document.getElementById('scavengerVoiceViz');
      if (viz) {
        viz.className = isPlaying ? 'voice-viz playing' : 'voice-viz';
      }
    }

    showVictoryModal(quest, xpEarned, isStreakAchieved) {
      const modal = document.getElementById('scavengerVictoryModal');
      if (!modal) return;

      // 1. 填入尋獲目標詞 (Anchor Word)
      const targetWordEl = document.getElementById('scavengerVictTargetWord');
      const targetZhEl = document.getElementById('scavengerVictTargetZh');
      const targetLabelEl = document.getElementById('scavengerVictTargetLabel');
      if (targetWordEl) targetWordEl.textContent = quest.targetWord;
      if (targetZhEl) targetZhEl.textContent = quest.targetLabel;
      if (targetLabelEl) targetLabelEl.textContent = quest.phoneticHint;

      // 2. 填入 706 護照延伸生活單字 (Companion Word)
      const compWordEl = document.getElementById('scavengerVictCompWord');
      const compZhEl = document.getElementById('scavengerVictCompZh');
      const compPhoneticEl = document.getElementById('scavengerVictCompPhonetic');
      const compSentenceEl = document.getElementById('scavengerVictCompSentence');
      if (compWordEl) compWordEl.textContent = quest.companionWord;
      if (compZhEl) compZhEl.textContent = quest.companionZh;
      if (compPhoneticEl) compPhoneticEl.textContent = quest.companionPhonetic;
      if (compSentenceEl) compSentenceEl.textContent = `💬 "${quest.companionSentence}" (${quest.companionSentenceZh})`;

      // 3. 獎勵數字
      const xpEl = document.getElementById('scavengerVictXpText');
      if (xpEl) xpEl.textContent = `+${xpEarned} XP`;
      const coinsEl = document.getElementById('scavengerVictCoinsText');
      if (coinsEl) coinsEl.textContent = isStreakAchieved ? '+3 🪙 尋寶金幣 (包含三連達成獎勵！)' : '+1 🪙 尋寶金幣';

      // 4. 三連達成賀詞
      const streakNotice = document.getElementById('scavengerVictStreakNotice');
      if (streakNotice) {
        streakNotice.style.display = isStreakAchieved ? 'block' : 'none';
      }

      modal.style.display = 'flex';
    }

    closeVictoryModal() {
      const modal = document.getElementById('scavengerVictoryModal');
      if (!modal) return;
      modal.style.display = 'none';
      if (this.world && window.audioManager) window.audioManager.playSfx('click');

      // 若在三連尋寶中且尚未滿 3 題，自動啟動下一題
      if (this.questMode === 'streak' && this.streakCount > 0 && this.streakCount < this.targetStreak) {
        setTimeout(() => {
          this.startHunt('streak');
        }, 300);
      }
    }
  }

  // 掛載至全域
  root.SCAVENGER_CLUES = SCAVENGER_CLUES;
  root.ScavengerHuntManager = ScavengerHuntManager;

})(typeof window !== 'undefined' ? window : global);
