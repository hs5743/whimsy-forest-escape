// 新港國小英語護照 706 單字核心題庫資料庫 (VocabPassportBank)
// 自動同步自校本資料庫，包含 IPA 音標、Chunks 音節拆解與情境雙例句
(function(root) {
  const bank = [
  {
    "id": "passport-apple",
    "word": "apple",
    "zh": "蘋果",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈæp.l̩/",
    "chunks": [
      "ap",
      "ple"
    ],
    "sentence": "I have a red apple in my schoolbag.",
    "sentenceZh": "我的書包裡有一顆紅蘋果。",
    "sentence2": "She cut the sweet apple into small pieces.",
    "sentence2Zh": "她把那顆甜蘋果切成小塊。"
  },
  {
    "id": "passport-banana",
    "word": "banana",
    "zh": "香蕉",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bəˈnæn.ə/",
    "chunks": [
      "ba",
      "na",
      "na"
    ],
    "sentence": "The yellow banana is very sweet.",
    "sentenceZh": "這根黃色的香蕉很甜。",
    "sentence2": "I like to eat a banana after running.",
    "sentence2Zh": "我喜歡在跑步後吃一根香蕉。"
  },
  {
    "id": "passport-rabbit",
    "word": "rabbit",
    "zh": "兔子",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈræb.ɪt/",
    "chunks": [
      "rab",
      "bit"
    ],
    "sentence": "Look at that cute rabbit in the grass.",
    "sentenceZh": "看看草地上那隻可愛的兔子。",
    "sentence2": "The little rabbit likes eating fresh carrots.",
    "sentence2Zh": "小兔子喜歡吃新鮮的胡蘿蔔。"
  },
  {
    "id": "passport-tiger",
    "word": "tiger",
    "zh": "老虎",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtaɪ.ɡɚ/",
    "chunks": [
      "ti",
      "ger"
    ],
    "sentence": "The tiger is a strong animal.",
    "sentenceZh": "老虎是一種強壯的動物。",
    "sentence2": "A tiger can run very fast in the forest.",
    "sentence2Zh": "老虎能在森林裡跑得很快。"
  },
  {
    "id": "passport-father",
    "word": "father",
    "zh": "爸爸",
    "topic": "Family",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ˈfɑː.ðɚ/",
    "chunks": [
      "fa",
      "ther"
    ],
    "sentence": "My father goes to work by bus every morning.",
    "sentenceZh": "我爸爸每天早上搭公車去上班。",
    "sentence2": "My father reads a storybook to me every night.",
    "sentence2Zh": "我爸爸每天晚上讀故事書給我聽。"
  },
  {
    "id": "passport-mother",
    "word": "mother",
    "zh": "媽媽",
    "topic": "Family",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ˈmʌð.ɚ/",
    "chunks": [
      "mo",
      "ther"
    ],
    "sentence": "My mother cooks dinner for our family.",
    "sentenceZh": "我媽媽為我們全家煮晚餐。",
    "sentence2": "My mother helps me with my homework after school.",
    "sentence2Zh": "放學後，我媽媽會指導我寫功課。"
  },
  {
    "id": "elementary-sister",
    "word": "sister",
    "zh": "姊姊／妹妹",
    "topic": "Family",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ˈsɪs.tɚ/",
    "chunks": [
      "sis",
      "ter"
    ],
    "sentence": "My sister likes to draw pictures in her notebook.",
    "sentenceZh": "我的姊姊喜歡在筆記本裡畫圖。",
    "sentence2": "My sister teaches me how to ride a bicycle.",
    "sentence2Zh": "我的姊姊教我騎腳踏車。"
  },
  {
    "id": "elementary-brother",
    "word": "brother",
    "zh": "哥哥／弟弟",
    "topic": "Family",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ˈbrʌð.ɚ/",
    "chunks": [
      "bro",
      "ther"
    ],
    "sentence": "My brother teaches me how to play soccer.",
    "sentenceZh": "我的哥哥教我踢足球。",
    "sentence2": "My brother always shares his toys with me.",
    "sentence2Zh": "我的弟弟總是和我分享他的玩具。"
  },
  {
    "id": "elementary-sunny",
    "word": "sunny",
    "zh": "晴朗的",
    "topic": "Weather",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ˈsʌn.i/",
    "chunks": [
      "sun",
      "ny"
    ],
    "sentence": "We can go for a picnic on a sunny day.",
    "sentenceZh": "我們可以在晴朗的日子去野餐。",
    "sentence2": "It is sunny, so I am wearing a hat.",
    "sentence2Zh": "天氣晴朗，所以我戴著帽子。"
  },
  {
    "id": "elementary-rainy",
    "word": "rainy",
    "zh": "下雨的",
    "topic": "Weather",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ˈreɪn.i/",
    "chunks": [
      "rain",
      "y"
    ],
    "sentence": "I stay home and read books on rainy days.",
    "sentenceZh": "下雨天時，我待在家裡看書。",
    "sentence2": "Do not forget your raincoat on a rainy day.",
    "sentence2Zh": "下雨天別忘了帶雨衣。"
  },
  {
    "id": "elementary-teacher",
    "word": "teacher",
    "zh": "老師／教師",
    "topic": "School",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/ˈtiː.tʃɚ/",
    "chunks": [
      "tea",
      "cher"
    ],
    "sentence": "Our English teacher is very kind and patient.",
    "sentenceZh": "我們的英文老師非常親切又有耐心。",
    "sentence2": "The teacher shows us how to read the new words.",
    "sentence2Zh": "老師教我們如何讀這些新單字。"
  },
  {
    "id": "elementary-student",
    "word": "student",
    "zh": "學生",
    "topic": "School",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/ˈstjuː.dənt/",
    "chunks": [
      "stu",
      "dent"
    ],
    "sentence": "Every student in the class has a storybook.",
    "sentenceZh": "班上的每位學生都有一本故事書。",
    "sentence2": "The new student sits next to me.",
    "sentence2Zh": "那位新學生坐在我旁邊。"
  },
  {
    "id": "passport-bathroom",
    "word": "bathroom",
    "zh": "浴室",
    "topic": "House",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/ˈbæθ.ruːm/",
    "chunks": [
      "bath",
      "room"
    ],
    "sentence": "You should wash your hands in the bathroom.",
    "sentenceZh": "你應該在浴室裡洗手。",
    "sentence2": "Please keep the bathroom clean and dry.",
    "sentence2Zh": "請保持浴室乾淨與乾燥。"
  },
  {
    "id": "elementary-kitchen",
    "word": "kitchen",
    "zh": "廚房",
    "topic": "House",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/ˈkɪtʃ.ən/",
    "chunks": [
      "kitch",
      "en"
    ],
    "sentence": "Mom is baking a cake in the kitchen.",
    "sentenceZh": "媽媽正在廚房烤蛋糕。",
    "sentence2": "Dad is cleaning the kitchen after dinner.",
    "sentence2Zh": "晚餐後，爸爸正在打掃廚房。"
  },
  {
    "id": "elementary-doctor",
    "word": "doctor",
    "zh": "醫生",
    "topic": "Occupations",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/ˈdɑːk.tɚ/",
    "chunks": [
      "doc",
      "tor"
    ],
    "sentence": "The doctor tells me to drink more water.",
    "sentenceZh": "醫生告訴我要多喝水。",
    "sentence2": "A doctor helps people when they are sick.",
    "sentence2Zh": "人們生病時，醫生會幫助他們。"
  },
  {
    "id": "elementary-nurse",
    "word": "nurse",
    "zh": "護理師",
    "topic": "Occupations",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/nɝːs/",
    "chunks": [
      "nurse"
    ],
    "sentence": "The kind nurse takes care of sick children.",
    "sentenceZh": "那位親切的護理師照顧生病的孩子。",
    "sentence2": "The school nurse cleaned the cut on my knee.",
    "sentence2Zh": "學校護理師清理了我膝蓋上的傷口。"
  },
  {
    "id": "passport-homework",
    "word": "homework",
    "zh": "功課／回家作業",
    "topic": "School",
    "gradeBand": "G6",
    "grade": 6,
    "phonetic": "/ˈhoʊm.wɝːk/",
    "chunks": [
      "home",
      "work"
    ],
    "sentence": "Remember to finish your English homework before dinner.",
    "sentenceZh": "記得在晚餐前完成英文作業。",
    "sentence2": "I finished my homework and went outside to play.",
    "sentence2Zh": "我寫完功課後就到外面玩。"
  },
  {
    "id": "elementary-supermarket",
    "word": "supermarket",
    "zh": "超級市場",
    "topic": "Place",
    "gradeBand": "G6",
    "grade": 6,
    "phonetic": "/ˈsuː.pɚˌmɑːr.kɪt/",
    "chunks": [
      "su",
      "per",
      "mar",
      "ket"
    ],
    "sentence": "We bought some fresh juice at the supermarket.",
    "sentenceZh": "我們在超級市場買了一些新鮮果汁。",
    "sentence2": "My mother bought some apples at the supermarket.",
    "sentence2Zh": "我媽媽在超級市場買了一些蘋果。"
  },
  {
    "id": "junior-beautiful",
    "word": "beautiful",
    "zh": "美麗的／漂亮的",
    "topic": "Adjectives",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈbjuː.t̬ə.fəl/",
    "chunks": [
      "beau",
      "ti",
      "ful"
    ],
    "sentence": "The sunset over the beach is beautiful.",
    "sentenceZh": "海灘上的夕陽很美麗。",
    "sentence2": "The flowers in our school garden are beautiful.",
    "sentence2Zh": "我們學校花園裡的花很漂亮。"
  },
  {
    "id": "junior-weekend",
    "word": "weekend",
    "zh": "週末",
    "topic": "Time",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈwiːk.end/",
    "chunks": [
      "week",
      "end"
    ],
    "sentence": "What are you going to do this weekend?",
    "sentenceZh": "你這個週末要做什麼？",
    "sentence2": "We visited our grandparents over the weekend.",
    "sentence2Zh": "我們週末去拜訪了祖父母。"
  },
  {
    "id": "passport-book",
    "word": "book",
    "zh": "書/書籍",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bʊk/",
    "chunks": [
      "book"
    ],
    "sentence": "I am reading an interesting book about animals.",
    "sentenceZh": "我正在讀一本關於動物的有趣書籍。",
    "sentence2": "I borrowed a storybook from the library.",
    "sentence2Zh": "我從圖書館借了一本故事書。"
  },
  {
    "id": "passport-pencil",
    "word": "pencil",
    "zh": "鉛筆",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpen.səl/",
    "chunks": [
      "pen",
      "cil"
    ],
    "sentence": "Can I borrow a pencil to write my name?",
    "sentenceZh": "我可以借一支鉛筆來寫我的名字嗎？",
    "sentence2": "May I borrow your pencil to draw a star?",
    "sentence2Zh": "我可以借你的鉛筆畫一顆星星嗎？"
  },
  {
    "id": "elementary-desk",
    "word": "desk",
    "zh": "書桌",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/desk/",
    "chunks": [
      "desk"
    ],
    "sentence": "Please put your books back on your desk.",
    "sentenceZh": "請把書放回你的課桌上。",
    "sentence2": "My pencils are in the desk drawer.",
    "sentence2Zh": "我的鉛筆在書桌抽屜裡。"
  },
  {
    "id": "elementary-chair",
    "word": "chair",
    "zh": "椅子",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tʃer/",
    "chunks": [
      "chair"
    ],
    "sentence": "Tim sits on the wooden chair next to the window.",
    "sentenceZh": "提姆坐在靠窗的木椅上。",
    "sentence2": "The cat sat on the chair and slept all afternoon.",
    "sentence2Zh": "貓咪坐在椅子上睡了整個下午。"
  },
  {
    "id": "passport-dog",
    "word": "dog",
    "zh": "狗",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dɑːɡ/",
    "chunks": [
      "dog"
    ],
    "sentence": "The friendly dog is wagging its tail at us.",
    "sentenceZh": "那隻友好的狗正在向我們搖尾巴。",
    "sentence2": "My friendly dog runs to me when I come home.",
    "sentence2Zh": "當我回到家時，我那友善的狗會跑向我。"
  },
  {
    "id": "passport-cat",
    "word": "cat",
    "zh": "貓",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kæt/",
    "chunks": [
      "cat"
    ],
    "sentence": "A small black cat is sleeping under the table.",
    "sentenceZh": "一隻黑色的小貓正在桌子底下睡覺。",
    "sentence2": "The cat looks warm and comfortable.",
    "sentence2Zh": "那隻貓看起來既溫暖又舒適。"
  },
  {
    "id": "elementary-bird",
    "word": "bird",
    "zh": "鳥",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bɝːd/",
    "chunks": [
      "bird"
    ],
    "sentence": "A beautiful blue bird is singing in the tree.",
    "sentenceZh": "一隻美麗的藍鳥正在樹上唱歌。",
    "sentence2": "We can hear a little bird singing outside the window.",
    "sentence2Zh": "我們可以聽到窗外有一隻小鳥在唱歌。"
  },
  {
    "id": "elementary-fish",
    "word": "fish",
    "zh": "魚",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fɪʃ/",
    "chunks": [
      "fish"
    ],
    "sentence": "There are many colorful fish swimming in the pond.",
    "sentenceZh": "池塘裡有許多色彩繽紛的魚在游泳。",
    "sentence2": "My grandpa has three goldfish in a bowl.",
    "sentence2Zh": "我爺爺在魚缸裡養了三隻金魚。"
  },
  {
    "id": "passport-milk",
    "word": "milk",
    "zh": "牛奶",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mɪlk/",
    "chunks": [
      "milk"
    ],
    "sentence": "I drink a glass of warm milk before bed.",
    "sentenceZh": "我睡前會喝一杯溫牛奶。",
    "sentence2": "Milk helps our bones grow strong.",
    "sentence2Zh": "牛奶能幫助我們的骨骼長得強壯。"
  },
  {
    "id": "passport-water",
    "word": "water",
    "zh": "水",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwɑː.tɚ/",
    "chunks": [
      "wa",
      "ter"
    ],
    "sentence": "Please give me a glass of cold water.",
    "sentenceZh": "請給我一杯冰水。",
    "sentence2": "You should drink warm water every morning.",
    "sentence2Zh": "你應該每天早上喝溫開水。"
  },
  {
    "id": "elementary-rice",
    "word": "rice",
    "zh": "米飯/飯",
    "topic": "Food",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/raɪs/",
    "chunks": [
      "rice"
    ],
    "sentence": "We usually eat rice and vegetables for dinner.",
    "sentenceZh": "我們晚餐通常吃米飯和蔬菜。",
    "sentence2": "We eat rice and fish for lunch at school.",
    "sentence2Zh": "我們在學校午餐吃米飯和魚。"
  },
  {
    "id": "elementary-noodles",
    "word": "noodles",
    "zh": "麵條/麵",
    "topic": "Food",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ˈnuː.dļz/",
    "chunks": [
      "noo",
      "dles"
    ],
    "sentence": "Grandpa likes to eat hot beef noodles for lunch.",
    "sentenceZh": "爺爺中午喜歡吃熱牛肉麵。",
    "sentence2": "My sister likes to eat delicious noodles with soup.",
    "sentence2Zh": "我妹妹喜歡吃美味的湯麵。"
  },
  {
    "id": "passport-red",
    "word": "red",
    "zh": "紅色/紅色的",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/red/",
    "chunks": [
      "red"
    ],
    "sentence": "She wore a pretty red dress to the party.",
    "sentenceZh": "她穿著一件漂亮的紅洋裝去參加派對。",
    "sentence2": "The red crayon in my box is used to draw the sun.",
    "sentence2Zh": "我盒子裡的紅蠟筆是用來畫太陽的。"
  },
  {
    "id": "passport-blue",
    "word": "blue",
    "zh": "藍色/藍色的",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bluː/",
    "chunks": [
      "blue"
    ],
    "sentence": "The sky is very clear and blue today.",
    "sentenceZh": "今天的晴空非常清澈且蔚藍。",
    "sentence2": "I draw a blue bird flying high in the sky.",
    "sentence2Zh": "我畫了一隻在空中高飛的藍鳥。"
  },
  {
    "id": "passport-green",
    "word": "green",
    "zh": "綠色/綠色的",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡriːn/",
    "chunks": [
      "green"
    ],
    "sentence": "The frogs are sitting on a big green leaf.",
    "sentenceZh": "青蛙正坐在一個綠色的大葉子上。",
    "sentence2": "The tree leaves are green and fresh in spring.",
    "sentence2Zh": "春天的樹葉又綠又新鮮。"
  },
  {
    "id": "passport-yellow",
    "word": "yellow",
    "zh": "黃色/黃色的",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈjel.oʊ/",
    "chunks": [
      "yel",
      "low"
    ],
    "sentence": "The yellow school bus stops in front of my house.",
    "sentenceZh": "黃色的校車停在我家前面。",
    "sentence2": "My brother's favorite color is bright yellow.",
    "sentence2Zh": "我弟弟最喜歡的顏色是明亮的黃色。"
  },
  {
    "id": "elementary-one",
    "word": "one",
    "zh": "一/一個",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wʌn/",
    "chunks": [
      "one"
    ],
    "sentence": "I have only one apple left in my bag.",
    "sentenceZh": "我的包包裡只剩下一個蘋果。",
    "sentence2": "I got one correct answer and felt very happy.",
    "sentence2Zh": "我得到一個正確答案，感覺非常高興。"
  },
  {
    "id": "elementary-two",
    "word": "two",
    "zh": "二/兩個",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tuː/",
    "chunks": [
      "two"
    ],
    "sentence": "There are two birds flying in the sky.",
    "sentenceZh": "天上有兩隻鳥在飛。",
    "sentence2": "Two students walked into the library together.",
    "sentence2Zh": "兩個學生一起走進了圖書館。"
  },
  {
    "id": "elementary-three",
    "word": "three",
    "zh": "三/三個",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/θriː/",
    "chunks": [
      "three"
    ],
    "sentence": "He has three storybooks in his desk drawer.",
    "sentenceZh": "他的書桌抽屜裡有三本故事書。",
    "sentence2": "Grandfather bought three sweet red apples for us.",
    "sentence2Zh": "爺爺為我們買了三個甜紅蘋果。"
  },
  {
    "id": "elementary-four",
    "word": "four",
    "zh": "四/四個",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fɔːr/",
    "chunks": [
      "four"
    ],
    "sentence": "A year is divided into four different seasons.",
    "sentenceZh": "一年被分為四個不同的季節。",
    "sentence2": "Four birds are sitting on the school roof.",
    "sentence2Zh": "四隻鳥停在學校屋頂上。"
  },
  {
    "id": "passport-head",
    "word": "head",
    "zh": "頭",
    "topic": "Body",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/hed/",
    "chunks": [
      "head"
    ],
    "sentence": "You should wear a helmet to protect your head.",
    "sentenceZh": "你應該戴安全帽來保護你的頭部。",
    "sentence2": "Please wear a hat to protect your head from the hot sun.",
    "sentence2Zh": "請戴上帽子以保護你的頭部不受烈日曬傷。"
  },
  {
    "id": "passport-hand",
    "word": "hand",
    "zh": "手",
    "topic": "Body",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/hænd/",
    "chunks": [
      "hand"
    ],
    "sentence": "Please raise your hand if you know the answer.",
    "sentenceZh": "如果你知道答案，請舉手。",
    "sentence2": "We must wash our hands before having lunch.",
    "sentence2Zh": "我們午餐前必須洗手。"
  },
  {
    "id": "elementary-eye",
    "word": "eye",
    "zh": "眼睛",
    "topic": "Body",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/aɪ/",
    "chunks": [
      "eye"
    ],
    "sentence": "Keep your eyes open and look at the screen.",
    "sentenceZh": "張開眼睛看著螢幕。",
    "sentence2": "Please close your eyes and listen to the quiet music.",
    "sentence2Zh": "請閉上眼睛，聆聽這平靜的音樂。"
  },
  {
    "id": "elementary-foot",
    "word": "foot",
    "zh": "腳(單數)",
    "topic": "Body",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/fʊt/",
    "chunks": [
      "foot"
    ],
    "sentence": "He hurt his left foot while playing soccer.",
    "sentenceZh": "他在踢足球時弄傷了左腳。",
    "sentence2": "My foot feels cold, so I want to wear socks.",
    "sentence2Zh": "我的腳感覺冷，所以我想穿襪子。"
  },
  {
    "id": "passport-run",
    "word": "run",
    "zh": "跑/奔跑",
    "topic": "Actions",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/rʌn/",
    "chunks": [
      "run"
    ],
    "sentence": "Do not run in the hallway; it is dangerous.",
    "sentenceZh": "不要在走廊上奔跑，那很危險。",
    "sentence2": "Do not run too fast in the classroom.",
    "sentence2Zh": "不要在教室裡跑得太快。"
  },
  {
    "id": "passport-jump",
    "word": "jump",
    "zh": "跳/跳躍",
    "topic": "Actions",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/dʒʌmp/",
    "chunks": [
      "jump"
    ],
    "sentence": "The energetic children love to jump on the trampoline.",
    "sentenceZh": "精力充沛的孩子們喜歡在彈簧床上跳躍。",
    "sentence2": "The frog can jump very high into the air.",
    "sentence2Zh": "青蛙可以跳得非常高。"
  },
  {
    "id": "elementary-read",
    "word": "read",
    "zh": "閱讀/讀",
    "topic": "Actions",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/riːd/",
    "chunks": [
      "read"
    ],
    "sentence": "We read English stories in class every Tuesday.",
    "sentenceZh": "我們每個星期二在課堂上讀英文故事。",
    "sentence2": "Reading books every day makes us smarter.",
    "sentence2Zh": "每天讀書會讓我們更聰明。"
  },
  {
    "id": "elementary-write",
    "word": "write",
    "zh": "寫/書寫",
    "topic": "Actions",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/raɪt/",
    "chunks": [
      "write"
    ],
    "sentence": "You need to write your name on this paper.",
    "sentenceZh": "你需要在這張紙上寫下名字。",
    "sentence2": "Please write your answer in the notebook.",
    "sentence2Zh": "請把答案寫在筆記本裡。"
  },
  {
    "id": "passport-morning",
    "word": "morning",
    "zh": "早上/上午",
    "topic": "Time",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/ˈmɔːr.nɪŋ/",
    "chunks": [
      "morn",
      "ing"
    ],
    "sentence": "We say good morning to our teachers at school.",
    "sentenceZh": "我們在學校跟老師們說早安。",
    "sentence2": "I enjoy the fresh air during my morning run.",
    "sentence2Zh": "我享受晨跑時的新鮮空氣。"
  },
  {
    "id": "elementary-afternoon",
    "word": "afternoon",
    "zh": "下午",
    "topic": "Time",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/ˌæf.tɚˈnuːn/",
    "chunks": [
      "af",
      "ter",
      "noon"
    ],
    "sentence": "Let us play basketball in the playground this afternoon.",
    "sentenceZh": "我們今天下午去操場打籃球吧。",
    "sentence2": "We have an exciting art lesson this afternoon.",
    "sentence2Zh": "我們今天下午有一堂精彩的美勞課。"
  },
  {
    "id": "elementary-today",
    "word": "today",
    "zh": "今天",
    "topic": "Time",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/təˈdeɪ/",
    "chunks": [
      "to",
      "day"
    ],
    "sentence": "What is the weather like in Taipei today?",
    "sentenceZh": "今天台北的天氣怎麼樣？",
    "sentence2": "Today is a great day to learn new English words.",
    "sentence2Zh": "今天是學習新英文單字的好日子。"
  },
  {
    "id": "junior-happy",
    "word": "happy",
    "zh": "快樂的/高興的",
    "topic": "Adjectives",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈhæp.i/",
    "chunks": [
      "hap",
      "py"
    ],
    "sentence": "We are very happy to hear the good news.",
    "sentenceZh": "我們聽到這個好消息感到非常高興。",
    "sentence2": "My parents are happy when I share my stories with them.",
    "sentence2Zh": "當我和父母分享我的故事時，他們會很高興。"
  },
  {
    "id": "junior-difficult",
    "word": "difficult",
    "zh": "困難的/難的",
    "topic": "Adjectives",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈdɪf.ə.kəlt/",
    "chunks": [
      "dif",
      "fi",
      "cult"
    ],
    "sentence": "This math question is difficult for me.",
    "sentenceZh": "這道數學題對我來說很難。",
    "sentence2": "This game is difficult, but I will keep trying.",
    "sentence2Zh": "這個遊戲很難，但我會繼續嘗試。"
  },
  {
    "id": "passport-bee",
    "word": "bee",
    "zh": "蜜蜂",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/biː/",
    "chunks": [
      "bee"
    ],
    "sentence": "A busy bee is flying around the colorful flowers.",
    "sentenceZh": "一隻忙碌的蜜蜂正在繽紛的花朵旁飛舞。",
    "sentence2": "The little bee works hard to make honey.",
    "sentence2Zh": "小蜜蜂辛勤地工作製造蜂蜜。"
  },
  {
    "id": "passport-cow",
    "word": "cow",
    "zh": "母牛/乳牛",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kaʊ/",
    "chunks": [
      "cow"
    ],
    "sentence": "The cow eats green grass on the beautiful farm.",
    "sentenceZh": "母牛在美麗的農場上吃綠草。",
    "sentence2": "The cow on the farm gives us fresh milk.",
    "sentence2Zh": "農場上的乳牛為我們提供新鮮牛奶。"
  },
  {
    "id": "passport-pet",
    "word": "pet",
    "zh": "寵物",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pet/",
    "chunks": [
      "pet"
    ],
    "sentence": "A rabbit can be a wonderful pet for children.",
    "sentenceZh": "兔子可以是孩子們極佳的寵物。",
    "sentence2": "My pet cat likes to sleep on my lap.",
    "sentence2Zh": "我的寵物貓喜歡在我的大腿上睡覺。"
  },
  {
    "id": "elementary-pig",
    "word": "pig",
    "zh": "豬",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pɪɡ/",
    "chunks": [
      "pig"
    ],
    "sentence": "The pink pig is playing happily in the mud.",
    "sentenceZh": "這隻粉紅色的豬正在泥巴裡玩得很高興。",
    "sentence2": "The cute pig lives with other animals on the farm.",
    "sentence2Zh": "那隻可愛的豬和農場上的其他動物生活在一起。"
  },
  {
    "id": "junior-bear",
    "word": "bear",
    "zh": "熊",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ber/",
    "chunks": [
      "bear"
    ],
    "sentence": "We saw a big brown bear sleeping in the cave.",
    "sentenceZh": "我們看到一隻大棕熊在洞穴裡睡覺。",
    "sentence2": "A bear eats fish and berries in the forest.",
    "sentence2Zh": "熊在森林裡吃魚和莓果。"
  },
  {
    "id": "passport-duck",
    "word": "duck",
    "zh": "鴨/鴨子",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dʌk/",
    "chunks": [
      "duck"
    ],
    "sentence": "The little duck swims behind its mother in the pond.",
    "sentenceZh": "小鴨在池塘裡跟在牠媽媽後面游泳。",
    "sentence2": "The white duck made a funny sound in the water.",
    "sentence2Zh": "白鴨在水裡發出了有趣的聲音。"
  },
  {
    "id": "passport-frog",
    "word": "frog",
    "zh": "青蛙",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/frɑːɡ/",
    "chunks": [
      "frog"
    ],
    "sentence": "A green frog jumped out of the clean water.",
    "sentenceZh": "一隻綠色的青蛙從乾淨的水中跳了出來。",
    "sentence2": "A green frog is sitting peacefully on a wet stone.",
    "sentence2Zh": "一隻綠色青蛙正安靜地坐在濕石頭上。"
  },
  {
    "id": "elementary-lion",
    "word": "lion",
    "zh": "獅子",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈlaɪ.ən/",
    "chunks": [
      "li",
      "on"
    ],
    "sentence": "The lion is known as the king of the forest.",
    "sentenceZh": "獅子被稱為森林之王。",
    "sentence2": "We saw a big lion walking slowly in the zoo.",
    "sentence2Zh": "我們看到一隻大獅子在動物園裡慢慢走動。"
  },
  {
    "id": "passport-mice",
    "word": "mice",
    "zh": "老鼠(複數)",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/maɪs/",
    "chunks": [
      "mice"
    ],
    "sentence": "Our cat caught three small mice last night.",
    "sentenceZh": "我們的小貓昨晚抓到了三隻小老鼠。",
    "sentence2": "The mice ran away quickly when they saw the big cat.",
    "sentence2Zh": "老鼠們看到大貓時飛快地逃跑了。"
  },
  {
    "id": "passport-hippo",
    "word": "hippo",
    "zh": "河馬",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈhɪp.oʊ/",
    "chunks": [
      "hip",
      "po"
    ],
    "sentence": "The hippo stays in the water to keep cool.",
    "sentenceZh": "河馬待在水裡以保持涼爽。",
    "sentence2": "The hippo opened its huge mouth to eat fruit.",
    "sentence2Zh": "河馬張開牠的大嘴巴吃水果。"
  },
  {
    "id": "passport-horse",
    "word": "horse",
    "zh": "馬",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hɔːrs/",
    "chunks": [
      "horse"
    ],
    "sentence": "The cowboy rode a fast black horse yesterday.",
    "sentenceZh": "牛仔昨天騎著一隻跑得很快的黑馬。",
    "sentence2": "The horse ran across the green field very quickly.",
    "sentence2Zh": "那匹馬非常快速地跑過綠色草地。"
  },
  {
    "id": "passport-koala",
    "word": "koala",
    "zh": "無尾熊",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/koʊˈɑː.lə/",
    "chunks": [
      "koala"
    ],
    "sentence": "A cute koala is hugging a tree.",
    "sentenceZh": "一隻可愛的無尾熊正抱著一棵樹。",
    "sentence2": "The koala is eating leaves in the tree.",
    "sentence2Zh": "那隻無尾熊正在樹上吃葉子。"
  },
  {
    "id": "passport-mouse",
    "word": "mouse",
    "zh": "老鼠(單數)",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/maʊs/",
    "chunks": [
      "mouse"
    ],
    "sentence": "The clever little mouse escaped from the cat.",
    "sentenceZh": "聰明的小老鼠從貓咪手裡逃脫了。",
    "sentence2": "A tiny mouse is eating a piece of cheese quietly.",
    "sentence2Zh": "一隻小老鼠正在安靜地吃一片起司。"
  },
  {
    "id": "passport-panda",
    "word": "panda",
    "zh": "大貓熊/熊貓",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpæn.də/",
    "chunks": [
      "pan",
      "da"
    ],
    "sentence": "The giant panda is eating fresh bamboo leaves.",
    "sentenceZh": "大貓熊正在吃新鮮的竹葉。",
    "sentence2": "The baby panda is playing with a small wood block.",
    "sentence2Zh": "熊貓寶寶正在玩一塊小木頭。"
  },
  {
    "id": "passport-sheep",
    "word": "sheep",
    "zh": "綿羊/羊",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʃiːp/",
    "chunks": [
      "sheep"
    ],
    "sentence": "A group of white sheep is grazing on the hill.",
    "sentenceZh": "一群白色的綿羊正在山坡上吃草。",
    "sentence2": "The farmer cuts the wool from the sheep in summer.",
    "sentence2Zh": "農夫在夏天剪下綿羊的羊毛。"
  },
  {
    "id": "passport-snake",
    "word": "snake",
    "zh": "蛇",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sneɪk/",
    "chunks": [
      "snake"
    ],
    "sentence": "Be careful! There is a long snake in the grass.",
    "sentenceZh": "小心！草叢裡有一條長蛇。",
    "sentence2": "A green snake is climbing up a tall tree.",
    "sentence2Zh": "一條綠蛇正往高樹上爬。"
  },
  {
    "id": "passport-whale",
    "word": "whale",
    "zh": "鯨魚",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/weɪl/",
    "chunks": [
      "whale"
    ],
    "sentence": "The blue whale is the largest animal in the ocean.",
    "sentenceZh": "藍鯨是海洋中最大的動物。",
    "sentence2": "The huge whale made a big splash in the ocean.",
    "sentence2Zh": "巨大的鯨魚在海洋中激起了大水花。"
  },
  {
    "id": "passport-zebra",
    "word": "zebra",
    "zh": "斑馬",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈziː.brə/",
    "chunks": [
      "ze",
      "bra"
    ],
    "sentence": "The zebra has beautiful black and white stripes.",
    "sentenceZh": "斑馬有美麗的黑白條紋。",
    "sentence2": "We took a picture of a beautiful zebra yesterday.",
    "sentence2Zh": "我們昨天拍了一隻美麗斑馬的照片。"
  },
  {
    "id": "junior-animal",
    "word": "animal",
    "zh": "動物",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈæn.ɪ.məl/",
    "chunks": [
      "an",
      "i",
      "mal"
    ],
    "sentence": "We should protect wild animals and their forests.",
    "sentenceZh": "我們應該保護野生動物和牠們的森林。",
    "sentence2": "A dog is a very helpful animal to humans.",
    "sentence2Zh": "狗是對人類非常有幫助的動物。"
  },
  {
    "id": "junior-monkey",
    "word": "monkey",
    "zh": "猴子",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmʌŋ.ki/",
    "chunks": [
      "mon",
      "key"
    ],
    "sentence": "The funny monkey is climbing the tall banana tree.",
    "sentenceZh": "這隻有趣的猴子正在爬高高的香蕉樹。",
    "sentence2": "The clever monkey is playing with a round orange.",
    "sentence2Zh": "聰明的猴子正在玩一顆圓圓的橘子。"
  },
  {
    "id": "passport-spider",
    "word": "spider",
    "zh": "蜘蛛",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈspaɪ.dɚ/",
    "chunks": [
      "spi",
      "der"
    ],
    "sentence": "A spider is spinning a web in the corner.",
    "sentenceZh": "一隻蜘蛛正在角落裡結網。",
    "sentence2": "A little spider is making its web on the wall.",
    "sentence2Zh": "一隻小蜘蛛正在牆上結網。"
  },
  {
    "id": "passport-turtle",
    "word": "turtle",
    "zh": "烏龜/海龜",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtɝː.t̬əl/",
    "chunks": [
      "tur",
      "tle"
    ],
    "sentence": "The turtle walks very slowly but can swim fast.",
    "sentenceZh": "烏龜爬得很慢但是游得很快。",
    "sentence2": "The small turtle rests on a rock in the park pond.",
    "sentence2Zh": "小烏龜在公園池塘的岩石上休息。"
  },
  {
    "id": "junior-chicken",
    "word": "chicken",
    "zh": "雞/雞肉",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtʃɪk.ɪn/",
    "chunks": [
      "chick",
      "en"
    ],
    "sentence": "The farmer feeds the hungry chickens every morning.",
    "sentenceZh": "農夫每天早上餵飢餓的雞。",
    "sentence2": "The hen walks with three baby chickens in the yard.",
    "sentence2Zh": "母雞帶著三隻小雞在院子裡走動。"
  },
  {
    "id": "passport-elephant",
    "word": "elephant",
    "zh": "大象",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈel.ə.fənt/",
    "chunks": [
      "ele",
      "phant"
    ],
    "sentence": "The elephant is spraying water with its long trunk.",
    "sentenceZh": "那隻大象正用長鼻子噴水。",
    "sentence2": "The elephant uses its trunk to pick up leaves.",
    "sentence2Zh": "大象用長鼻子撿起葉子。"
  },
  {
    "id": "passport-butterfly",
    "word": "butterfly",
    "zh": "蝴蝶",
    "topic": "Animals",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈbʌt̬.ɚ.flaɪ/",
    "chunks": [
      "but",
      "ter",
      "fly"
    ],
    "sentence": "A beautiful butterfly is sitting on the yellow flower.",
    "sentenceZh": "一隻美麗的蝴蝶停在黃色的花朵上。",
    "sentence2": "A beautiful butterfly landed on my sister's shoulder.",
    "sentence2Zh": "一隻美麗的蝴蝶停在我姊姊的肩膀上。"
  },
  {
    "id": "elementary-bag",
    "word": "bag",
    "zh": "書包/提袋",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bæɡ/",
    "chunks": [
      "bag"
    ],
    "sentence": "Put your pencil box and textbooks into your bag.",
    "sentenceZh": "把你的鉛筆盒和教科書放進包包裡。",
    "sentence2": "She packed her lunchbox inside her school bag.",
    "sentence2Zh": "她把便當盒裝進書包裡。"
  },
  {
    "id": "passport-cap",
    "word": "cap",
    "zh": "帽子/便帽",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kæp/",
    "chunks": [
      "cap"
    ],
    "sentence": "You should wear a cap to block the hot sun.",
    "sentenceZh": "你應該戴一頂棒球帽來遮擋炎熱的太陽。",
    "sentence2": "He wore a blue baseball cap to school today.",
    "sentence2Zh": "他今天戴了一頂藍色棒球帽上學。"
  },
  {
    "id": "junior-hat",
    "word": "hat",
    "zh": "帽子(有邊的)",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hæt/",
    "chunks": [
      "hat"
    ],
    "sentence": "The magician pulled a cute rabbit out of his hat.",
    "sentenceZh": "魔術師從他的帽子裡拉出一隻可愛的兔子。",
    "sentence2": "She wore a straw hat to protect her face from the sun.",
    "sentence2Zh": "她戴了一頂草帽以遮陽。"
  },
  {
    "id": "junior-coat",
    "word": "coat",
    "zh": "外套/大衣",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/koʊt/",
    "chunks": [
      "coat"
    ],
    "sentence": "Put on your warm coat before going outside.",
    "sentenceZh": "出去之前穿上你溫暖的大衣。",
    "sentence2": "Please wear your thick coat because it is cold outside.",
    "sentence2Zh": "因為外面很冷，請穿上你的厚外套。"
  },
  {
    "id": "junior-wear",
    "word": "wear",
    "zh": "穿/戴",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wer/",
    "chunks": [
      "wear"
    ],
    "sentence": "I like to wear comfortable T-shirts on weekends.",
    "sentenceZh": "我週末喜歡穿舒適的T恤。",
    "sentence2": "Please wear your helmet when you ride a bicycle.",
    "sentence2Zh": "當你騎自行車時請戴安全帽。"
  },
  {
    "id": "elementary-dress",
    "word": "dress",
    "zh": "洋裝/禮服",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dres/",
    "chunks": [
      "dress"
    ],
    "sentence": "She chose a beautiful blue dress for her birthday.",
    "sentenceZh": "她為她的生日選了一件美麗的藍色洋裝。",
    "sentence2": "My sister wore a white dress to the piano concert.",
    "sentence2Zh": "我妹妹穿著一件白色洋裝去鋼琴音樂會。"
  },
  {
    "id": "junior-pants",
    "word": "pants",
    "zh": "長褲",
    "topic": "Clothing",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/pænts/",
    "chunks": [
      "pants"
    ],
    "sentence": "My father bought a new pair of black pants.",
    "sentenceZh": "我爸爸買了一條新的黑色長褲。",
    "sentence2": "He wore brown pants and a green sweater today.",
    "sentence2Zh": "他今天穿著棕色長褲和綠色毛衣。"
  },
  {
    "id": "junior-shirt",
    "word": "shirt",
    "zh": "襯衫/男襯衫",
    "topic": "Clothing",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ʃɝːt/",
    "chunks": [
      "shirt"
    ],
    "sentence": "He wore a clean white shirt to school today.",
    "sentenceZh": "他今天穿著乾淨的白襯衫去學校。",
    "sentence2": "My father wears a clean white shirt to work.",
    "sentence2Zh": "我爸爸穿著一件乾淨的白襯衫去工作。"
  },
  {
    "id": "elementary-t-shirt",
    "word": "T-shirt",
    "zh": "T恤/短袖圓領運動衫",
    "topic": "Clothing",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/ˈtiː.ʃɝːt/",
    "chunks": [
      "T",
      "shirt"
    ],
    "sentence": "We all wear yellow T-shirts for the school sports day.",
    "sentenceZh": "我們在學校運動會那天都穿黃色T恤。",
    "sentence2": "My brother wears a white T-shirt to play basketball.",
    "sentence2Zh": "我弟弟穿著一件白色T恤去打籃球。"
  },
  {
    "id": "elementary-skirt",
    "word": "skirt",
    "zh": "裙子",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/skɝːt/",
    "chunks": [
      "skirt"
    ],
    "sentence": "The school girls wear navy blue skirts as uniforms.",
    "sentenceZh": "學校的女學生穿深藍色的裙子作為制服。",
    "sentence2": "The girls wore blue skirts for the school show.",
    "sentence2Zh": "女孩們穿著藍色裙子參加學校表演。"
  },
  {
    "id": "junior-socks",
    "word": "socks",
    "zh": "襪子(複數)",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sɑːks/",
    "chunks": [
      "socks"
    ],
    "sentence": "I need to buy some warm socks for winter.",
    "sentenceZh": "我需要為冬天買一些溫暖的襪子。",
    "sentence2": "I bought two pairs of colorful socks yesterday.",
    "sentence2Zh": "我昨天買了兩雙色彩繽紛的襪子。"
  },
  {
    "id": "elementary-jacket",
    "word": "jacket",
    "zh": "夾克/外套",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdʒæk.ɪt/",
    "chunks": [
      "jack",
      "et"
    ],
    "sentence": "It is cool today, so you should bring a jacket.",
    "sentenceZh": "今天很涼爽，所以你應該帶件外套。",
    "sentence2": "He forgot his warm jacket at the school playground.",
    "sentence2Zh": "他把保暖夾克忘在學校操場上了。"
  },
  {
    "id": "passport-pocket",
    "word": "pocket",
    "zh": "口袋",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpɑː.kɪt/",
    "chunks": [
      "pock",
      "et"
    ],
    "sentence": "He put the keys into his coat pocket.",
    "sentenceZh": "他把鑰匙放進大衣口袋裡。",
    "sentence2": "I put my library card in my coat pocket.",
    "sentence2Zh": "我把我的借書證放進了外套口袋。"
  },
  {
    "id": "junior-shorts",
    "word": "shorts",
    "zh": "短褲",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʃɔːrts/",
    "chunks": [
      "shorts"
    ],
    "sentence": "We like to wear cool shorts during summer vacation.",
    "sentenceZh": "我們暑假喜歡穿涼爽的短褲。",
    "sentence2": "We wear shorts and T-shirts in summer because it is hot.",
    "sentence2Zh": "因為夏天很熱，所以我們穿短褲和T恤。"
  },
  {
    "id": "elementary-shoes",
    "word": "shoes",
    "zh": "鞋子(複數)",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʃuːz/",
    "chunks": [
      "shoes"
    ],
    "sentence": "Take off your shoes before entering the living room.",
    "sentenceZh": "進客廳前請先脫鞋。",
    "sentence2": "Please take off your shoes before entering the house.",
    "sentence2Zh": "進屋前請先脫鞋。"
  },
  {
    "id": "passport-clothes",
    "word": "clothes",
    "zh": "衣服/服裝",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kloʊðz/",
    "chunks": [
      "clothes"
    ],
    "sentence": "Please help me fold and put away the clean clothes.",
    "sentenceZh": "請幫我摺疊並收好乾淨的衣服。",
    "sentence2": "Please hang your clean clothes in the wardrobe.",
    "sentence2Zh": "請把你的乾淨衣服掛進衣櫃裡。"
  },
  {
    "id": "junior-glasses",
    "word": "glasses",
    "zh": "眼鏡/玻璃杯(複數)",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɡlæs.ɪz/",
    "chunks": [
      "glass",
      "es"
    ],
    "sentence": "Grandpa needs his reading glasses to read the newspaper.",
    "sentenceZh": "爺爺需要他的老花眼鏡來讀報紙。",
    "sentence2": "My grandfather wears reading glasses to read the newspaper.",
    "sentence2Zh": "我爺爺戴著老花眼鏡看報紙。"
  },
  {
    "id": "junior-sweater",
    "word": "sweater",
    "zh": "毛衣/針織衫",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈswet.ɚ/",
    "chunks": [
      "sweater"
    ],
    "sentence": "My grandma knitted a warm red sweater for me.",
    "sentenceZh": "我奶奶為我織了一件溫暖的紅毛衣。",
    "sentence2": "I wore a soft woolen sweater on the cold windy day.",
    "sentence2Zh": "在寒冷有風的日子我穿了一件柔軟的毛衣。"
  },
  {
    "id": "junior-umbrella",
    "word": "umbrella",
    "zh": "雨傘",
    "topic": "Clothing",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʌmˈbrel.ə/",
    "chunks": [
      "um",
      "brel",
      "la"
    ],
    "sentence": "Do not forget your umbrella because it is going to rain.",
    "sentenceZh": "別忘了帶雨傘，因為快要下雨了。",
    "sentence2": "She shared her big umbrella with a classmate in the rain.",
    "sentence2Zh": "下雨時，她和一位同學共撐一把大雨傘。"
  },
  {
    "id": "elementary-color",
    "word": "color",
    "zh": "顏色/色彩",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈkʌl.ɚ/",
    "chunks": [
      "col",
      "or"
    ],
    "sentence": "What is your favorite color, blue or green?",
    "sentenceZh": "你最喜歡什麼顏色，藍色還是綠色？",
    "sentence2": "We use different colors to paint the school wall.",
    "sentence2Zh": "我們用不同的顏色來油漆學校的牆壁。"
  },
  {
    "id": "passport-gray",
    "word": "gray",
    "zh": "灰色/灰色的",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡreɪ/",
    "chunks": [
      "gray"
    ],
    "sentence": "The sky turned gray before the heavy rain started.",
    "sentenceZh": "在大雨開始前，天空變成了灰色。",
    "sentence2": "A little gray mouse ran under the classroom door.",
    "sentence2Zh": "一隻小灰鼠跑進了教室門底下。"
  },
  {
    "id": "junior-pink",
    "word": "pink",
    "zh": "粉紅色/粉紅色的",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pɪŋk/",
    "chunks": [
      "pink"
    ],
    "sentence": "Her room is decorated with pink curtains and toys.",
    "sentenceZh": "她的房間裝飾著粉紅色的窗簾和玩具。",
    "sentence2": "My sister likes to wear her pink shoes to play.",
    "sentence2Zh": "我妹妹喜歡穿她的粉紅色鞋子出去玩。"
  },
  {
    "id": "elementary-black",
    "word": "black",
    "zh": "黑色/黑色的",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/blæk/",
    "chunks": [
      "black"
    ],
    "sentence": "The cat has soft black fur.",
    "sentenceZh": "那隻貓有柔軟的黑色毛。",
    "sentence2": "Please use a black pen to write your name.",
    "sentence2Zh": "請用黑色原子筆寫下你的名字。"
  },
  {
    "id": "passport-brown",
    "word": "brown",
    "zh": "棕色/棕色的/褐色",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/braʊn/",
    "chunks": [
      "brown"
    ],
    "sentence": "A cute brown squirrel is eating a nut in the tree.",
    "sentenceZh": "一隻可愛的棕色松鼠正在樹上吃堅果。",
    "sentence2": "A cute brown rabbit is hopping on the lawn.",
    "sentence2Zh": "一隻可愛的棕色兔子正在草坪上跳躍。"
  },
  {
    "id": "elementary-white",
    "word": "white",
    "zh": "白色/白色的",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/waɪt/",
    "chunks": [
      "white"
    ],
    "sentence": "A white cloud is floating in the blue sky.",
    "sentenceZh": "一朵白雲正飄在藍天中。",
    "sentence2": "She wrote on the blackboard with white chalk.",
    "sentence2Zh": "她用白色粉筆在黑板上寫字。"
  },
  {
    "id": "junior-orange",
    "word": "orange",
    "zh": "柳橙/橘色/橘色的",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɔːr.ɪndʒ/",
    "chunks": [
      "or",
      "ange"
    ],
    "sentence": "The orange juice we drank yesterday was sweet.",
    "sentenceZh": "我們昨天喝的橘子汁很甜。",
    "sentence2": "The sunset sky is a beautiful warm orange today.",
    "sentence2Zh": "今天落日的天空是美麗的溫暖橘色。"
  },
  {
    "id": "passport-purple",
    "word": "purple",
    "zh": "紫色/紫色的",
    "topic": "Colors",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpɝː.pəl/",
    "chunks": [
      "pur",
      "ple"
    ],
    "sentence": "My mother bought some sweet purple grapes.",
    "sentenceZh": "我媽媽買了一些甜甜的紫葡萄。",
    "sentence2": "My mother wore a beautiful purple scarf today.",
    "sentence2Zh": "我媽媽今天戴了一條美麗的紫色圍巾。"
  },
  {
    "id": "junior-dad",
    "word": "dad",
    "zh": "爸爸",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dæd/",
    "chunks": [
      "dad"
    ],
    "sentence": "My dad took me to the library last Sunday.",
    "sentenceZh": "我爸爸上星期天帶我去圖書館。",
    "sentence2": "My dad helps me fix my broken toy car.",
    "sentence2Zh": "我爸爸幫我修好壞掉的玩具車。"
  },
  {
    "id": "passport-daddy",
    "word": "daddy",
    "zh": "爸爸",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdæd.i/",
    "chunks": [
      "dad",
      "dy"
    ],
    "sentence": "Goodnight, daddy, sleep well and have a good dream.",
    "sentenceZh": "晚安，爸爸，睡個好覺，做個好夢。",
    "sentence2": "Daddy and I built a small wooden birdhouse yesterday.",
    "sentence2Zh": "爸爸和我昨天建了一個小木鳥屋。"
  },
  {
    "id": "junior-mom",
    "word": "mom",
    "zh": "媽媽",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mɑːm/",
    "chunks": [
      "mom"
    ],
    "sentence": "My mom cooks healthy vegetables for us every day.",
    "sentenceZh": "我媽媽每天為我們做健康的蔬菜。",
    "sentence2": "My mom tells me to eat more fresh fruit.",
    "sentence2Zh": "我媽媽叫我多吃新鮮水果。"
  },
  {
    "id": "passport-mommy",
    "word": "mommy",
    "zh": "媽媽",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmɑː.mi/",
    "chunks": [
      "mom",
      "my"
    ],
    "sentence": "Mommy, can you read this bedtime story for me?",
    "sentenceZh": "媽媽，你可以讀這個床邊故事給我聽嗎？",
    "sentence2": "Mommy, look at the cute puppy playing in the yard!",
    "sentence2Zh": "媽媽，你看院子裡玩耍的可愛小狗！"
  },
  {
    "id": "passport-parent",
    "word": "parent",
    "zh": "家長/雙親/父母",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈper.ənt/",
    "chunks": [
      "par",
      "ent"
    ],
    "sentence": "My parents went to the school meeting yesterday.",
    "sentenceZh": "我父母昨天去參加了學校的會議。",
    "sentence2": "We should always show respect to our parents.",
    "sentence2Zh": "我們應該要孝順/尊重我們的父母。"
  },
  {
    "id": "junior-son",
    "word": "son",
    "zh": "兒子",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sʌn/",
    "chunks": [
      "son"
    ],
    "sentence": "Mr. Wang is very proud of his hard-working son.",
    "sentenceZh": "王先生對他勤奮的兒子感到非常驕傲。",
    "sentence2": "My uncle is very proud of his helpful son.",
    "sentence2Zh": "我叔叔為他樂於助人的兒子感到非常自豪。"
  },
  {
    "id": "junior-daughter",
    "word": "daughter",
    "zh": "女兒",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdɑː.t̬ɚ/",
    "chunks": [
      "daugh",
      "ter"
    ],
    "sentence": "They have a young daughter who goes to elementary school.",
    "sentenceZh": "他們有一個讀國小的小女兒。",
    "sentence2": "The mother and her daughter are drawing pictures together.",
    "sentence2Zh": "母親和她的女兒正在一起畫畫。"
  },
  {
    "id": "junior-family",
    "word": "family",
    "zh": "家庭/家人",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfæm.ə.li/",
    "chunks": [
      "fam",
      "i",
      "ly"
    ],
    "sentence": "We are a happy family and support each other.",
    "sentenceZh": "我們是一個快樂的家庭，互相支持。",
    "sentence2": "Family support is very important when we face challenges.",
    "sentence2Zh": "當我們面對挑戰時，家人的支持非常重要。"
  },
  {
    "id": "junior-grandfather",
    "word": "grandfather",
    "zh": "爺爺/外公",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɡræn.fɑː.ðɚ/",
    "chunks": [
      "grand",
      "fa",
      "ther"
    ],
    "sentence": "My grandfather likes to practice Tai Chi in the park.",
    "sentenceZh": "我祖父喜歡在公園裡練太極拳。",
    "sentence2": "My grandfather walks with a cane in the garden.",
    "sentence2Zh": "我祖父/爺爺拿著拐杖在花園裡散步。"
  },
  {
    "id": "passport-grandpa",
    "word": "grandpa",
    "zh": "爺爺/外公",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɡræn.pɑː/",
    "chunks": [
      "grand",
      "pa"
    ],
    "sentence": "Grandpa tells us exciting stories from his childhood.",
    "sentenceZh": "爺爺跟我們講他童年時的精彩故事。",
    "sentence2": "Grandpa teaches me how to play chess on weekends.",
    "sentence2Zh": "爺爺週末教我如何下棋。"
  },
  {
    "id": "junior-grandmother",
    "word": "grandmother",
    "zh": "奶奶/外婆",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɡræn.mʌð.ɚ/",
    "chunks": [
      "grand",
      "moth",
      "er"
    ],
    "sentence": "My grandmother grows beautiful roses in her garden.",
    "sentenceZh": "我的奶奶在花園裡種植美麗的玫瑰。",
    "sentence2": "My grandmother makes delicious soup for us.",
    "sentence2Zh": "我的外婆為我們煮美味的湯。"
  },
  {
    "id": "passport-grandma",
    "word": "grandma",
    "zh": "奶奶/外婆",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɡræn.mɑː/",
    "chunks": [
      "grand",
      "ma"
    ],
    "sentence": "My grandma knitted a pair of wool socks for me.",
    "sentenceZh": "我奶奶為我織了一雙羊毛襪。",
    "sentence2": "Grandma baked some sweet cookies for my birthday party.",
    "sentence2Zh": "奶奶為我的生日派對烤了一些甜餅乾。"
  },
  {
    "id": "junior-aunt",
    "word": "aunt",
    "zh": "阿姨/姑姑/嬸嬸/伯母/舅媽",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ænt/",
    "chunks": [
      "aunt"
    ],
    "sentence": "My aunt bought me a new schoolbag for my birthday.",
    "sentenceZh": "我的姑姑買了一個新書包當作我的生日禮物。",
    "sentence2": "My aunt invited us to her home for dinner.",
    "sentence2Zh": "我的阿姨邀請我們去她家吃晚餐。"
  },
  {
    "id": "junior-uncle",
    "word": "uncle",
    "zh": "叔叔/伯伯/舅舅/姑丈",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈʌŋ.kəl/",
    "chunks": [
      "un",
      "cle"
    ],
    "sentence": "My uncle lives in New York and works in a bank.",
    "sentenceZh": "我叔叔住在紐約，在銀行工作。",
    "sentence2": "My uncle works as a kind doctor in the hospital.",
    "sentence2Zh": "我叔叔在醫院裡當一名親切的醫生。"
  },
  {
    "id": "junior-grow",
    "word": "grow",
    "zh": "種植/生長/成長",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡroʊ/",
    "chunks": [
      "grow"
    ],
    "sentence": "Vegetables need clean water and sunshine to grow.",
    "sentenceZh": "蔬菜需要乾淨的水和陽光才能生長。",
    "sentence2": "We can watch the green seeds grow into tall plants.",
    "sentence2Zh": "我們可以看著綠色的種子長成高大的植物。"
  },
  {
    "id": "passport-cousin",
    "word": "cousin",
    "zh": "堂兄弟姊妹/表兄弟姊妹",
    "topic": "Family",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈkʌz.ən/",
    "chunks": [
      "cousin"
    ],
    "sentence": "My cousin is coming to stay with us next week.",
    "sentenceZh": "我的表哥下週要來和我們一起住。",
    "sentence2": "My cousin and I like the same storybook.",
    "sentence2Zh": "我和表姊喜歡同一本故事書。"
  },
  {
    "id": "junior-live",
    "word": "live",
    "zh": "居住/生活/活的",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/lɪv/",
    "chunks": [
      "live"
    ],
    "sentence": "Polar bears live in the cold Arctic region.",
    "sentenceZh": "北極熊居住在寒冷的北極地區。",
    "sentence2": "We live in a beautiful and clean neighborhood.",
    "sentence2Zh": "我們住在一個美麗且乾淨的社區。"
  },
  {
    "id": "junior-fruit",
    "word": "fruit",
    "zh": "水果",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fruːt/",
    "chunks": [
      "fruit"
    ],
    "sentence": "Eating fresh fruit is very good for your health.",
    "sentenceZh": "吃新鮮水果對你的健康非常有益。",
    "sentence2": "We should eat fresh fruit every day to stay healthy.",
    "sentence2Zh": "我們應該每天吃新鮮水果來保持健康。"
  },
  {
    "id": "passport-peach",
    "word": "peach",
    "zh": "桃子/水蜜桃",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/piːtʃ/",
    "chunks": [
      "peach"
    ],
    "sentence": "The pink peach is soft, juicy and very sweet.",
    "sentenceZh": "粉紅色的桃子又軟、又多汁而且非常甜。",
    "sentence2": "This ripe peach tastes sweet and is full of juice.",
    "sentence2Zh": "這顆成熟的桃子嚐起來很甜，而且多汁。"
  },
  {
    "id": "passport-lemon",
    "word": "lemon",
    "zh": "檸檬",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈlem.ən/",
    "chunks": [
      "lemon"
    ],
    "sentence": "Lemon juice tastes sour but smells fresh.",
    "sentenceZh": "檸檬汁喝起來酸酸的，但聞起來很清香。",
    "sentence2": "A lemon tastes very sour.",
    "sentence2Zh": "檸檬嚐起來非常酸。"
  },
  {
    "id": "passport-grape",
    "word": "grape",
    "zh": "葡萄",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡreɪp/",
    "chunks": [
      "grape"
    ],
    "sentence": "She washed a bowl of purple grapes for her guests.",
    "sentenceZh": "她為客人洗了一碗紫葡萄。",
    "sentence2": "My sister shared a bunch of sweet purple grapes with me.",
    "sentence2Zh": "我妹妹和我分享了一串甜甜的紫葡萄。"
  },
  {
    "id": "passport-strawberry",
    "word": "strawberry",
    "zh": "草莓",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈstrɑː.ber.i/",
    "chunks": [
      "straw",
      "ber",
      "ry"
    ],
    "sentence": "I like to eat strawberry ice cream in summer.",
    "sentenceZh": "我夏天喜歡吃草莓冰淇淋。",
    "sentence2": "We like to put fresh strawberries on our ice cream.",
    "sentence2Zh": "我們喜歡在冰淇淋上放新鮮草莓。"
  },
  {
    "id": "passport-watermelon",
    "word": "watermelon",
    "zh": "西瓜",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwɑː.t̬ɚˌmel.ən/",
    "chunks": [
      "wa",
      "ter",
      "mel",
      "on"
    ],
    "sentence": "Cold watermelon tastes good on a hot summer day.",
    "sentenceZh": "炎熱的夏日裡，冰涼的西瓜吃起來很美味。",
    "sentence2": "We shared a large watermelon after lunch.",
    "sentence2Zh": "午餐後，我們一起分享了一顆大西瓜。"
  },
  {
    "id": "junior-breakfast",
    "word": "breakfast",
    "zh": "早餐",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈbrek.fəst/",
    "chunks": [
      "break",
      "fast"
    ],
    "sentence": "What did you have for breakfast this morning?",
    "sentenceZh": "你今天早餐吃了什麼？",
    "sentence2": "I always eat a healthy breakfast before school.",
    "sentence2Zh": "我上學前總是會吃一頓健康的早餐。"
  },
  {
    "id": "elementary-lunch",
    "word": "lunch",
    "zh": "午餐",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/lʌntʃ/",
    "chunks": [
      "lunch"
    ],
    "sentence": "We usually have lunch at the school cafeteria.",
    "sentenceZh": "我們通常在學校食堂吃午餐。",
    "sentence2": "All students have lunch together in the classroom at noon.",
    "sentence2Zh": "中午所有學生都在教室裡一起吃午餐。"
  },
  {
    "id": "junior-dinner",
    "word": "dinner",
    "zh": "晚餐",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdɪn.ɚ/",
    "chunks": [
      "din",
      "ner"
    ],
    "sentence": "The family sits together to enjoy their dinner.",
    "sentenceZh": "全家人坐在一起享受他們的晚餐。",
    "sentence2": "Our family sits at the table and talks during dinner.",
    "sentence2Zh": "晚餐時我們全家人坐在桌子旁聊天。"
  },
  {
    "id": "passport-drink",
    "word": "drink",
    "zh": "喝/飲料",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/drɪŋk/",
    "chunks": [
      "drink"
    ],
    "sentence": "You should drink a cup of warm water first.",
    "sentenceZh": "你應該先喝一杯溫開水。",
    "sentence2": "I always drink warm water after PE class.",
    "sentence2Zh": "體育課後我總是喝溫開水。"
  },
  {
    "id": "elementary-tea",
    "word": "tea",
    "zh": "茶",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tiː/",
    "chunks": [
      "tea"
    ],
    "sentence": "My grandmother likes to drink hot black tea.",
    "sentenceZh": "我祖母喜歡喝熱紅茶。",
    "sentence2": "My grandfather likes to drink hot tea in the afternoon.",
    "sentence2Zh": "我爺爺下午喜歡喝熱茶。"
  },
  {
    "id": "elementary-egg",
    "word": "egg",
    "zh": "蛋/雞蛋",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/eɡ/",
    "chunks": [
      "egg"
    ],
    "sentence": "I eat a boiled egg every morning for breakfast.",
    "sentenceZh": "我每天早上吃一個水煮蛋當早餐。",
    "sentence2": "We eat a boiled egg every morning for protein.",
    "sentence2Zh": "我們每天早上吃一個水煮蛋來補充蛋白質。"
  },
  {
    "id": "junior-bread",
    "word": "bread",
    "zh": "麵包",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bred/",
    "chunks": [
      "bread"
    ],
    "sentence": "The baker makes delicious fresh bread every morning.",
    "sentenceZh": "麵包師每天早上做出美味的新鮮麵包。",
    "sentence2": "She spreads sweet strawberry jam on the bread.",
    "sentence2Zh": "她在麵包上塗抹甜草莓醬。"
  },
  {
    "id": "elementary-pie",
    "word": "pie",
    "zh": "派/餡餅",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/paɪ/",
    "chunks": [
      "pie"
    ],
    "sentence": "Grandma baked an apple pie for our family dinner.",
    "sentenceZh": "阿嬤為我們的家庭晚餐烤了一個蘋果派。",
    "sentence2": "My grandma is baking a hot apple pie in the kitchen.",
    "sentence2Zh": "我奶奶正在廚房裡烤熱騰騰的蘋果派。"
  },
  {
    "id": "elementary-eat",
    "word": "eat",
    "zh": "吃",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/iːt/",
    "chunks": [
      "eat"
    ],
    "sentence": "Remember to wash your hands before you eat.",
    "sentenceZh": "吃東西前記得先洗手。",
    "sentence2": "Remember to eat some fresh fruit every day.",
    "sentence2Zh": "記得每天吃一些新鮮水果。"
  },
  {
    "id": "elementary-cook",
    "word": "cook",
    "zh": "廚師/烹調/煮",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kʊk/",
    "chunks": [
      "cook"
    ],
    "sentence": "My father likes to cook spaghetti on weekends.",
    "sentenceZh": "我爸爸週末喜歡煮義大利麵。",
    "sentence2": "The school cook prepares healthy food for our lunch.",
    "sentence2Zh": "學校廚師為我們的午餐準備健康的食物。"
  },
  {
    "id": "junior-soup",
    "word": "soup",
    "zh": "湯",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/suːp/",
    "chunks": [
      "soup"
    ],
    "sentence": "Hot corn soup is perfect for a cold winter day.",
    "sentenceZh": "熱玉米濃湯很適合寒冷的冬日。",
    "sentence2": "This pumpkin soup tastes wonderful on a cold day.",
    "sentence2Zh": "在冷天裡，這碗南瓜湯嚐起來很美味。"
  },
  {
    "id": "junior-food",
    "word": "food",
    "zh": "食物",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fuːd/",
    "chunks": [
      "food"
    ],
    "sentence": "Taiwan is famous for its delicious street food.",
    "sentenceZh": "台灣以美味的街頭小吃聞名。",
    "sentence2": "We should not waste any food during our school lunch.",
    "sentence2Zh": "我們在學校吃午餐時不應該浪費任何食物。"
  },
  {
    "id": "junior-beef",
    "word": "beef",
    "zh": "牛肉",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/biːf/",
    "chunks": [
      "beef"
    ],
    "sentence": "We ordered some beef noodles at the restaurant.",
    "sentenceZh": "我們在餐廳點了一些牛肉麵。",
    "sentence2": "My mother makes delicious beef curry for our dinner.",
    "sentence2Zh": "我媽媽為我們的晚餐做了美味的咖哩牛肉。"
  },
  {
    "id": "junior-pork",
    "word": "pork",
    "zh": "豬肉",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pɔːrk/",
    "chunks": [
      "pork"
    ],
    "sentence": "Pork dumplings are very popular in this restaurant.",
    "sentenceZh": "豬肉餃子在這家餐廳非常受歡迎。",
    "sentence2": "Pork is the main ingredient in these fresh dumplings.",
    "sentence2Zh": "豬肉是這些新鮮水餃的主要內餡。"
  },
  {
    "id": "elementary-cake",
    "word": "cake",
    "zh": "蛋糕",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/keɪk/",
    "chunks": [
      "cake"
    ],
    "sentence": "She blew out the candles on her birthday cake.",
    "sentenceZh": "她吹熄了生日蛋糕上的蠟燭。",
    "sentence2": "We baked a sweet apple cake for our mother's birthday.",
    "sentence2Zh": "我們為媽媽的生日烤了一個甜蘋果蛋糕。"
  },
  {
    "id": "passport-coke",
    "word": "Coke",
    "zh": "可樂",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/koʊk/",
    "chunks": [
      "Coke"
    ],
    "sentence": "Drinking too much Coke is bad for your teeth.",
    "sentenceZh": "喝太多可樂對牙齒不好。",
    "sentence2": "Drinking water is healthier than drinking Coke.",
    "sentence2Zh": "喝水比喝可樂健康。"
  },
  {
    "id": "passport-meal",
    "word": "meal",
    "zh": "餐/一餐",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/miːl/",
    "chunks": [
      "meal"
    ],
    "sentence": "Breakfast is an important meal of the day.",
    "sentenceZh": "早餐是一天中很重要的一餐。",
    "sentence2": "We sat together to enjoy a warm family meal.",
    "sentence2Zh": "我們坐在一起享用溫馨的家庭餐點。"
  },
  {
    "id": "elementary-juice",
    "word": "juice",
    "zh": "果汁",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dʒuːs/",
    "chunks": [
      "juice"
    ],
    "sentence": "Fresh orange juice is full of vitamins.",
    "sentenceZh": "新鮮的柳橙汁富含維他命。",
    "sentence2": "My parents bought some fresh grape juice at the store.",
    "sentence2Zh": "我父母在商店買了一些新鮮的葡萄汁。"
  },
  {
    "id": "passport-candy",
    "word": "candy",
    "zh": "糖果",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈkæn.di/",
    "chunks": [
      "can",
      "dy"
    ],
    "sentence": "Do not eat too much candy before bed.",
    "sentenceZh": "睡前不要吃太多糖果。",
    "sentence2": "The child smiled when she got a piece of candy.",
    "sentence2Zh": "那個孩子得到一顆糖果時笑了。"
  },
  {
    "id": "junior-salad",
    "word": "salad",
    "zh": "沙拉",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsæl.əd/",
    "chunks": [
      "sal",
      "ad"
    ],
    "sentence": "She prepared a fresh vegetable salad for lunch.",
    "sentenceZh": "她午餐準備了一份新鮮的蔬菜沙拉。",
    "sentence2": "Eating fresh salad every day is good for our health.",
    "sentence2Zh": "每天吃新鮮沙拉對我們的健康有益。"
  },
  {
    "id": "elementary-pizza",
    "word": "pizza",
    "zh": "披薩",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpiːt.sə/",
    "chunks": [
      "piz",
      "za"
    ],
    "sentence": "We ordered a large cheese pizza for the party.",
    "sentenceZh": "我們為派對點了一個大起司披薩。",
    "sentence2": "My classmates and I share a hot pizza on Friday.",
    "sentence2Zh": "星期五我和同學一起分享熱騰騰的披薩。"
  },
  {
    "id": "passport-full",
    "word": "full",
    "zh": "飽的/滿的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fʊl/",
    "chunks": [
      "full"
    ],
    "sentence": "I am full after eating three bowls of rice.",
    "sentenceZh": "吃了三碗飯後，我已經飽了。",
    "sentence2": "The school bus is full of students going home.",
    "sentence2Zh": "校車上坐滿了要回家的學生。"
  },
  {
    "id": "passport-dumpling",
    "word": "dumpling",
    "zh": "水餃/餃子",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdʌm.plɪŋ/",
    "chunks": [
      "dumpling"
    ],
    "sentence": "My mom makes delicious pork dumplings on weekends.",
    "sentenceZh": "我媽媽週末會包美味的豬肉水餃。",
    "sentence2": "Eating hot dumplings on a cold day makes us warm.",
    "sentence2Zh": "在冷天吃熱水餃讓我們感到溫暖。"
  },
  {
    "id": "junior-hungry",
    "word": "hungry",
    "zh": "飢餓的/餓的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈhʌŋ.ɡri/",
    "chunks": [
      "hun",
      "gry"
    ],
    "sentence": "If you are hungry, you can eat these biscuits.",
    "sentenceZh": "如果你餓了，你可以吃這些餅乾。",
    "sentence2": "The hungry little puppy barked to ask for food.",
    "sentence2Zh": "飢餓的小狗汪汪叫著要食物。"
  },
  {
    "id": "junior-taste",
    "word": "taste",
    "zh": "嚐起來/味道/品嚐",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/teɪst/",
    "chunks": [
      "taste"
    ],
    "sentence": "The soup tastes delicious but a little bit salty.",
    "sentenceZh": "這湯喝起來很美味，但有一點鹹。",
    "sentence2": "These red strawberries taste sweet and a bit sour.",
    "sentence2Zh": "這些紅草莓嚐起來很甜，帶有一點酸味。"
  },
  {
    "id": "passport-thirsty",
    "word": "thirsty",
    "zh": "口渴的/渴的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈθɝː.sti/",
    "chunks": [
      "thirsty"
    ],
    "sentence": "After playing soccer, the boys were very thirsty.",
    "sentenceZh": "踢完足球後，男孩子們都非常口渴。",
    "sentence2": "I always feel thirsty after running on the playground.",
    "sentence2Zh": "在操場跑步後我總是感到口渴。"
  },
  {
    "id": "passport-yummy",
    "word": "yummy",
    "zh": "美味的/好吃的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈjʌm.i/",
    "chunks": [
      "yum",
      "my"
    ],
    "sentence": "The chocolate cake Grandma made was very yummy.",
    "sentenceZh": "阿嬤做的巧克力蛋糕非常美味。",
    "sentence2": "This hot noodle soup is really yummy and warm.",
    "sentence2Zh": "這碗熱麵湯真的很美味又溫暖。"
  },
  {
    "id": "passport-pumpkin",
    "word": "pumpkin",
    "zh": "南瓜",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpʌmp.kɪn/",
    "chunks": [
      "pump",
      "kin"
    ],
    "sentence": "We carved a funny face on the Halloween pumpkin.",
    "sentenceZh": "我們在萬聖節南瓜上雕刻了一個有趣的臉。",
    "sentence2": "My grandmother makes sweet pumpkin pie for dessert.",
    "sentence2Zh": "我祖母做甜南瓜派當甜點。"
  },
  {
    "id": "junior-ice-cream",
    "word": "ice cream",
    "zh": "冰淇淋",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈaɪs.kriːm/",
    "chunks": [
      "ice",
      "cream"
    ],
    "sentence": "Children love to eat sweet vanilla ice cream in summer.",
    "sentenceZh": "孩子們夏天喜歡吃甜香草冰淇淋。",
    "sentence2": "Vanilla ice cream is my brother's favorite treat.",
    "sentence2Zh": "香草冰淇淋是我弟弟最喜歡的甜點。"
  },
  {
    "id": "passport-sweet",
    "word": "sweet",
    "zh": "甜的/溫柔的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/swiːt/",
    "chunks": [
      "sweet"
    ],
    "sentence": "These ripe strawberries are very red and sweet.",
    "sentenceZh": "這些熟透的草莓又紅又甜。",
    "sentence2": "She made a sweet card to thank her kind teacher.",
    "sentence2Zh": "她做了一張貼心的卡片來感謝她親切的老師。"
  },
  {
    "id": "junior-sandwich",
    "word": "sandwich",
    "zh": "三明治",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsæn.wɪtʃ/",
    "chunks": [
      "sand",
      "wich"
    ],
    "sentence": "I made a ham and cheese sandwich for my lunch.",
    "sentenceZh": "我為我的午餐做了一個火腿起司三明治。",
    "sentence2": "My mother packed a fresh sandwich in my lunchbox.",
    "sentence2Zh": "我媽媽在我的便當盒裡裝了一個新鮮三明治。"
  },
  {
    "id": "passport-chocolate",
    "word": "chocolate",
    "zh": "巧克力",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtʃɑːk.lət/",
    "chunks": [
      "choco",
      "late"
    ],
    "sentence": "She bought a box of dark chocolate from Belgium.",
    "sentenceZh": "她買了一盒比利時黑巧克力。",
    "sentence2": "We share a chocolate bar after playing basketball.",
    "sentence2Zh": "打完籃球後我們一起分享一條巧克力棒。"
  },
  {
    "id": "junior-hamburger",
    "word": "hamburger",
    "zh": "漢堡",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈhæm.bɝː.ɡɚ/",
    "chunks": [
      "ham",
      "burg",
      "er"
    ],
    "sentence": "He ordered a beef hamburger and some French fries.",
    "sentenceZh": "他點了一個牛肉漢堡和一些薯條。",
    "sentence2": "A hamburger with fresh lettuce tastes delicious.",
    "sentence2Zh": "夾著新鮮萵苣的漢堡吃起來很美味。"
  },
  {
    "id": "passport-french",
    "word": "French",
    "zh": "法國的/法語的/法國人",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/frentʃ/",
    "chunks": [
      "French"
    ],
    "sentence": "French is one of the languages spoken in France.",
    "sentenceZh": "法語是法國使用的語言之一。",
    "sentence2": "Our new classmate can speak English and French.",
    "sentence2Zh": "我們的新同學會說英語和法語。"
  },
  {
    "id": "passport-fries",
    "word": "fries",
    "zh": "薯條/炸薯條",
    "topic": "Food",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fraɪz/",
    "chunks": [
      "fries"
    ],
    "sentence": "The crispy fries taste great with tomato sauce.",
    "sentenceZh": "酥脆的薯條搭配番茄醬很好吃。",
    "sentence2": "These hot fries are crispy and delicious.",
    "sentence2Zh": "這些熱薯條香脆又美味。"
  },
  {
    "id": "elementary-name",
    "word": "name",
    "zh": "名字/姓名",
    "topic": "Forms",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/neɪm/",
    "chunks": [
      "name"
    ],
    "sentence": "Please write down your name and phone number here.",
    "sentenceZh": "請在這裡寫下您的名字和電話號碼。",
    "sentence2": "I wrote my name on the first page of the book.",
    "sentence2Zh": "我在書的第一頁寫下了我的名字。"
  },
  {
    "id": "passport-miss-ms",
    "word": "Miss/Ms",
    "zh": "小姐/女士",
    "topic": "Forms",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mɪs/",
    "chunks": [
      "Mis",
      "s",
      "Ms"
    ],
    "sentence": "Ms. Lin is our new school principal this year.",
    "sentenceZh": "林女士是我們今年新來的學校校長。",
    "sentence2": "Miss Lin is very patient when she teaches us math.",
    "sentence2Zh": "林老師教我們數學時非常耐心。"
  },
  {
    "id": "passport-mr",
    "word": "Mr",
    "zh": "先生",
    "topic": "Forms",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmɪs.tɚ/",
    "chunks": [
      "Mr"
    ],
    "sentence": "Mr. Brown teaches us math and is very funny.",
    "sentenceZh": "布朗先生教我們數學而且非常幽默。",
    "sentence2": "Mr. Wang helps us clean the school playground every Friday.",
    "sentence2Zh": "王先生每個星期五都幫我們清理學校操場。"
  },
  {
    "id": "passport-mrs",
    "word": "Mrs",
    "zh": "太太/女士(已婚)",
    "topic": "Forms",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmɪs.ɪz/",
    "chunks": [
      "Mrs"
    ],
    "sentence": "Mrs. Green gave us some sweet cookies yesterday.",
    "sentenceZh": "格林太太昨天給了我們一些甜餅乾。",
    "sentence2": "Mrs. Lee teaches science and always answers our questions.",
    "sentence2Zh": "李太太教自然科學，而且總是回答我們的問題。"
  },
  {
    "id": "junior-sea",
    "word": "sea",
    "zh": "海洋/海",
    "topic": "Geographical",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/siː/",
    "chunks": [
      "sea"
    ],
    "sentence": "We saw a big ship sailing on the blue sea.",
    "sentenceZh": "我們看到一艘大船在藍色的大海上航行。",
    "sentence2": "We collected shells on the beach near the sea.",
    "sentence2Zh": "我們在海邊的沙灘上撿貝殼。"
  },
  {
    "id": "passport-lake",
    "word": "lake",
    "zh": "湖泊/湖",
    "topic": "Geographical",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/leɪk/",
    "chunks": [
      "lake"
    ],
    "sentence": "The water in the lake is clear and calm.",
    "sentenceZh": "湖水非常清澈而且平靜。",
    "sentence2": "We rode a boat on the lake during our family trip.",
    "sentence2Zh": "在我們的家庭旅行中，我們在湖上划船。"
  },
  {
    "id": "junior-beach",
    "word": "beach",
    "zh": "海灘/沙灘",
    "topic": "Geographical",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/biːtʃ/",
    "chunks": [
      "beach"
    ],
    "sentence": "We built a tall sandcastle on the sandy beach.",
    "sentenceZh": "我們在沙灘上建了一座高高的沙堡。",
    "sentence2": "We built a big sandcastle on the beach in the afternoon.",
    "sentence2Zh": "下午我們在海灘上建了一座大沙堡。"
  },
  {
    "id": "passport-river",
    "word": "river",
    "zh": "河流/河",
    "topic": "Geographical",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈrɪv.ɚ/",
    "chunks": [
      "riv",
      "er"
    ],
    "sentence": "Many fish are swimming in this clean mountain river.",
    "sentenceZh": "許多魚在這條乾淨的山區河流中游泳。",
    "sentence2": "The clean river flows slowly through our beautiful town.",
    "sentence2Zh": "乾淨的河流緩緩流過我們美麗的小鎮。"
  },
  {
    "id": "passport-mountain",
    "word": "mountain",
    "zh": "山/山脈",
    "topic": "Geographical",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmaʊn.tən/",
    "chunks": [
      "moun",
      "tain"
    ],
    "sentence": "They plan to climb the highest mountain in Taiwan.",
    "sentenceZh": "他們計劃攀登台灣最高的山。",
    "sentence2": "We went hiking on a high mountain last weekend.",
    "sentence2Zh": "上週末我們去了一座高山健行。"
  },
  {
    "id": "passport-forest",
    "word": "forest",
    "zh": "森林",
    "topic": "Geographical",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfɔːr.ɪst/",
    "chunks": [
      "for",
      "est"
    ],
    "sentence": "There are many tall green trees in the forest.",
    "sentenceZh": "森林裡有許多高大的綠樹。",
    "sentence2": "Many wild animals make their homes in the deep forest.",
    "sentence2Zh": "許多野生動物在深山森林裡安家。"
  },
  {
    "id": "passport-volcano",
    "word": "volcano",
    "zh": "火山",
    "topic": "Geographical",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/vɑːlˈkeɪ.noʊ/",
    "chunks": [
      "vol",
      "cano"
    ],
    "sentence": "The volcano has not erupted for a thousand years.",
    "sentenceZh": "這座火山已經一千年沒有噴發了。",
    "sentence2": "We saw a picture of an active volcano in our science book.",
    "sentence2Zh": "我們在自然科學書裡看到了一張活火山的照片。"
  },
  {
    "id": "passport-desert",
    "word": "desert",
    "zh": "沙漠",
    "topic": "Geographical",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdez.ɚt/",
    "chunks": [
      "desert"
    ],
    "sentence": "Camels can walk in the hot desert without water.",
    "sentenceZh": "駱駝可以在炎熱的沙漠中行走而不需要水。",
    "sentence2": "It is dry and hot in the desert, but camels can live there.",
    "sentence2Zh": "沙漠裡又乾又熱，但是駱駝可以在那裡生存。"
  },
  {
    "id": "passport-island",
    "word": "island",
    "zh": "島嶼/島",
    "topic": "Geographical",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈaɪ.lənd/",
    "chunks": [
      "is",
      "land"
    ],
    "sentence": "They spent their summer vacation on a tropical island.",
    "sentenceZh": "他們在一個熱帶島嶼上度過了暑假。",
    "sentence2": "Taiwan is a beautiful island surrounded by blue oceans.",
    "sentence2Zh": "台灣是一個被藍色海洋包圍的美麗島嶼。"
  },
  {
    "id": "passport-easter",
    "word": "Easter",
    "zh": "復活節",
    "topic": "Holidays",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈiː.stɚ/",
    "chunks": [
      "East",
      "er"
    ],
    "sentence": "Children love to search for colorful Easter eggs.",
    "sentenceZh": "孩子們喜歡尋找色彩繽紛的復活節彩蛋。",
    "sentence2": "Children search for colorful eggs during Easter.",
    "sentence2Zh": "孩子們在復活節期間尋找彩色的蛋。"
  },
  {
    "id": "passport-halloween",
    "word": "Halloween",
    "zh": "萬聖節/萬聖節前夕",
    "topic": "Holidays",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˌhæl.oʊˈiːn/",
    "chunks": [
      "Hal",
      "loween"
    ],
    "sentence": "We dressed up in scary clothes for Halloween.",
    "sentenceZh": "我們在萬聖節穿上了可怕的衣服裝扮。",
    "sentence2": "We dressed up as funny ghosts for Halloween last year.",
    "sentence2Zh": "去年萬聖節我們裝扮成搞笑的鬼魂。"
  },
  {
    "id": "passport-christmas",
    "word": "Christmas",
    "zh": "耶誕節/聖誕節",
    "topic": "Holidays",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈkrɪs.məs/",
    "chunks": [
      "Christ",
      "mas"
    ],
    "sentence": "We decorated the big Christmas tree with sparkling lights.",
    "sentenceZh": "我們用閃閃發光的燈飾裝飾了大聖誕樹。",
    "sentence2": "We decorated the classroom tree for Christmas.",
    "sentence2Zh": "我們裝飾了教室裡的聖誕樹來迎接耶誕節。"
  },
  {
    "id": "passport-moon",
    "word": "moon",
    "zh": "月亮",
    "topic": "Weather & nature",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/muːn/",
    "chunks": [
      "Moon"
    ],
    "sentence": "The moon shines brightly in the clear night sky.",
    "sentenceZh": "月亮在晴朗的夜空中明亮地照耀著。",
    "sentence2": "The moon is round and bright during the Mid-Autumn Festival.",
    "sentence2Zh": "中秋節期間的月亮又圓又亮。"
  },
  {
    "id": "passport-festival",
    "word": "festival",
    "zh": "節日/慶典",
    "topic": "Holidays",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfes.tə.vəl/",
    "chunks": [
      "Fes",
      "ti",
      "val"
    ],
    "sentence": "The Mid-Autumn Festival is a time for family reunion.",
    "sentenceZh": "中秋節是家人團圓的時刻。",
    "sentence2": "The school sports festival is full of exciting games.",
    "sentence2Zh": "學校運動會/體育節充滿了精彩的比賽。"
  },
  {
    "id": "junior-well",
    "word": "well",
    "zh": "很好地/健康的/井",
    "topic": "Health",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wel/",
    "chunks": [
      "well"
    ],
    "sentence": "My grandmother feels well after resting in bed.",
    "sentenceZh": "我奶奶在床上休息後感覺好多了。",
    "sentence2": "My brother plays the piano very well because he practices.",
    "sentence2Zh": "我弟弟鋼琴彈得很好，因為他有練習。"
  },
  {
    "id": "junior-sick",
    "word": "sick",
    "zh": "生病的/有病的",
    "topic": "Health",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sɪk/",
    "chunks": [
      "sick"
    ],
    "sentence": "He did not go to school because he was sick.",
    "sentenceZh": "他因為生病而沒有去上學。",
    "sentence2": "If you feel sick, you should rest and drink warm water.",
    "sentence2Zh": "如果你感覺生病了，你應該休息並喝溫開水。"
  },
  {
    "id": "elementary-cold",
    "word": "cold",
    "zh": "冷的/感冒/寒冷的",
    "topic": "Health",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/koʊld/",
    "chunks": [
      "cold"
    ],
    "sentence": "Drink hot soup when you have a bad cold.",
    "sentenceZh": "當你感冒嚴重時，多喝熱湯。",
    "sentence2": "Drinking hot tea makes us feel good when we have a cold.",
    "sentence2Zh": "感冒時喝熱茶會讓我們感覺舒服些。"
  },
  {
    "id": "junior-strong",
    "word": "strong",
    "zh": "強壯的/強烈的",
    "topic": "Health",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/strɑːŋ/",
    "chunks": [
      "strong"
    ],
    "sentence": "He is strong enough to lift the heavy box.",
    "sentenceZh": "他足夠強壯以搬起這個重箱子。",
    "sentence2": "A strong wind can bend the branches of tall trees.",
    "sentence2Zh": "強風會吹彎高樹的枝條。"
  },
  {
    "id": "elementary-tired",
    "word": "tired",
    "zh": "疲倦的/累的",
    "topic": "Health",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/taɪərd/",
    "chunks": [
      "tired"
    ],
    "sentence": "I was tired after riding my bike for two hours.",
    "sentenceZh": "騎了兩小時腳踏車後，我感到很累。",
    "sentence2": "I felt tired after running around the playground.",
    "sentence2Zh": "在操場跑了幾圈後我感到累了。"
  },
  {
    "id": "passport-toothache",
    "word": "toothache",
    "zh": "牙痛",
    "topic": "Health",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtuːθ.eɪk/",
    "chunks": [
      "toothache"
    ],
    "sentence": "The little girl cried because she had a toothache.",
    "sentenceZh": "小女孩哭了，因為她牙痛。",
    "sentence2": "Eating too much sweet candy might cause a toothache.",
    "sentence2Zh": "吃太多甜糖果可能會導致牙痛。"
  },
  {
    "id": "passport-headache",
    "word": "headache",
    "zh": "頭痛",
    "topic": "Health",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈhed.eɪk/",
    "chunks": [
      "headache"
    ],
    "sentence": "My mother has a bad headache today.",
    "sentenceZh": "我媽媽今天頭痛得很厲害。",
    "sentence2": "The loud noise gave me a headache.",
    "sentence2Zh": "巨大的噪音讓我頭痛。"
  },
  {
    "id": "junior-key",
    "word": "key",
    "zh": "鑰匙/關鍵",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kiː/",
    "chunks": [
      "key"
    ],
    "sentence": "I cannot find the key to my bedroom door.",
    "sentenceZh": "我找不到我臥室門的鑰匙。",
    "sentence2": "He keeps the classroom key in his pencil case.",
    "sentence2Zh": "他把教室的鑰匙收在筆袋裡。"
  },
  {
    "id": "passport-fan",
    "word": "fan",
    "zh": "風扇/電風扇/迷",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fæn/",
    "chunks": [
      "fan"
    ],
    "sentence": "Please turn on the fan because the classroom is hot.",
    "sentenceZh": "教室很熱，請打開電風扇。",
    "sentence2": "The electric fan makes the room cooler.",
    "sentence2Zh": "電風扇讓房間更涼爽。"
  },
  {
    "id": "elementary-bed",
    "word": "bed",
    "zh": "床",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bed/",
    "chunks": [
      "bed"
    ],
    "sentence": "It is time to go to bed; goodnight, children.",
    "sentenceZh": "該去睡覺了；晚安，孩子們。",
    "sentence2": "I jumped onto my soft bed and felt very relaxed.",
    "sentence2Zh": "我跳上柔軟的床，感到非常放鬆。"
  },
  {
    "id": "junior-house",
    "word": "house",
    "zh": "房子/住宅",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/haʊs/",
    "chunks": [
      "house"
    ],
    "sentence": "They live in a beautiful house with a garden.",
    "sentenceZh": "他們住在一棟帶花園的美麗房子裡。",
    "sentence2": "My family lives in a cozy house near the school.",
    "sentence2Zh": "我們家住在學校附近的一間溫馨房子裡。"
  },
  {
    "id": "junior-wall",
    "word": "wall",
    "zh": "牆壁/圍牆",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɑːl/",
    "chunks": [
      "wall"
    ],
    "sentence": "We hung a big map of Taiwan on the classroom wall.",
    "sentenceZh": "我們在教室的牆上掛了一幅台灣大地圖。",
    "sentence2": "We hung our class paintings on the classroom wall.",
    "sentence2Zh": "我們把我們班的畫掛在教室牆壁上。"
  },
  {
    "id": "passport-mop",
    "word": "mop",
    "zh": "拖把/拖地",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mɑːp/",
    "chunks": [
      "mop"
    ],
    "sentence": "Use the clean mop to clean the kitchen floor.",
    "sentenceZh": "用乾淨的拖把來清潔廚房地板。",
    "sentence2": "Please use a mop to clean the dirty floor.",
    "sentence2Zh": "請用拖把清理骯髒的地板。"
  },
  {
    "id": "junior-door",
    "word": "door",
    "zh": "門",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dɔːr/",
    "chunks": [
      "door"
    ],
    "sentence": "Please close the door behind you when you leave.",
    "sentenceZh": "你離開時請隨手關門。",
    "sentence2": "Please close the door quietly when you leave.",
    "sentence2Zh": "你離開時請輕輕關上門。"
  },
  {
    "id": "passport-lamp",
    "word": "lamp",
    "zh": "燈/檯燈",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/læmp/",
    "chunks": [
      "lamp"
    ],
    "sentence": "He reads a book under the bright desk lamp.",
    "sentenceZh": "他在明亮的檯燈下看書。",
    "sentence2": "I turn on the desk lamp when I read at night.",
    "sentence2Zh": "我晚上讀書時會打開檯燈。"
  },
  {
    "id": "passport-sweep",
    "word": "sweep",
    "zh": "掃/打掃/掃除",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/swiːp/",
    "chunks": [
      "sweep"
    ],
    "sentence": "Please help me sweep the leaves on the ground.",
    "sentenceZh": "請幫我掃地上的樹葉。",
    "sentence2": "We sweep the classroom floor together after school.",
    "sentence2Zh": "放學後我們一起打掃教室地板。"
  },
  {
    "id": "junior-wash",
    "word": "wash",
    "zh": "清洗/洗",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɑːʃ/",
    "chunks": [
      "wash"
    ],
    "sentence": "You should wash your hands before eating dinner.",
    "sentenceZh": "你在吃晚餐前應該要洗手。",
    "sentence2": "We wash our hands before eating lunch at school.",
    "sentence2Zh": "我們在學校吃午餐前會洗手。"
  },
  {
    "id": "elementary-home",
    "word": "home",
    "zh": "家/在家",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hoʊm/",
    "chunks": [
      "home"
    ],
    "sentence": "I will stay at home and watch TV tonight.",
    "sentenceZh": "我今天晚上會待在家裡看電視。",
    "sentence2": "We went home together after school.",
    "sentence2Zh": "放學後，我們一起回家。"
  },
  {
    "id": "junior-table",
    "word": "table",
    "zh": "桌子/餐桌",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈteɪ.bəl/",
    "chunks": [
      "ta",
      "ble"
    ],
    "sentence": "We put the vase of flowers on the wooden table.",
    "sentenceZh": "我們把花瓶放在木桌上。",
    "sentence2": "Please help set the dining table before dinner.",
    "sentence2Zh": "請在晚餐前幫忙擺餐桌。"
  },
  {
    "id": "passport-towel",
    "word": "towel",
    "zh": "毛巾/手巾",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtaʊ.əl/",
    "chunks": [
      "tow",
      "el"
    ],
    "sentence": "Dry your face with a clean and soft towel.",
    "sentenceZh": "用乾淨又柔軟的毛巾擦乾你的臉。",
    "sentence2": "Dry your wet face with a clean soft towel.",
    "sentence2Zh": "用乾淨柔軟的毛巾擦乾你那濕漉漉的臉。"
  },
  {
    "id": "junior-floor",
    "word": "floor",
    "zh": "地板/樓層",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/flɔːr/",
    "chunks": [
      "floor"
    ],
    "sentence": "The clean floor is too slippery; walk carefully.",
    "sentenceZh": "乾淨的地板太滑了，走路請小心。",
    "sentence2": "Keep your books off the floor and on your desk.",
    "sentence2Zh": "把你的書從地板上拿起來放在書桌上。"
  },
  {
    "id": "passport-shelf",
    "word": "shelf",
    "zh": "書架/架子",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʃelf/",
    "chunks": [
      "shelf"
    ],
    "sentence": "I put my new books on the top shelf.",
    "sentenceZh": "我把新書放在最上層的架子上。",
    "sentence2": "Please put the storybook back on the wooden shelf.",
    "sentence2Zh": "請把故事書放回木製書架上。"
  },
  {
    "id": "passport-garden",
    "word": "garden",
    "zh": "花園/園地",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɡɑːr.dən/",
    "chunks": [
      "gar",
      "den"
    ],
    "sentence": "Grandpa grows sweet red strawberries in his garden.",
    "sentenceZh": "爺爺在他的花園裡種植甜甜的紅草莓。",
    "sentence2": "The school garden has many colorful flowers.",
    "sentence2Zh": "學校花園裡有許多色彩繽紛的花朵。"
  },
  {
    "id": "passport-shower",
    "word": "shower",
    "zh": "陣雨/淋浴",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈʃaʊ.ɚ/",
    "chunks": [
      "show",
      "er"
    ],
    "sentence": "I take a warm shower after playing basketball.",
    "sentenceZh": "我打完籃球後會洗個熱水澡。",
    "sentence2": "A quick summer shower cooled down the hot streets.",
    "sentence2Zh": "一場短暫的夏日陣雨讓發熱的街道降溫了。"
  },
  {
    "id": "elementary-tv",
    "word": "TV",
    "zh": "電視/電視機",
    "topic": "House",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/ˌtiːˈviː/",
    "chunks": [
      "TV"
    ],
    "sentence": "We watched an interesting science show on TV.",
    "sentenceZh": "我們在電視上觀看了一個有趣的科學節目。",
    "sentence2": "Our parents allow us to watch TV for thirty minutes.",
    "sentence2Zh": "我父母允許我們看三十分鐘的電視。"
  },
  {
    "id": "junior-computer",
    "word": "computer",
    "zh": "電腦",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kəmˈpjuː.t̬ɚ/",
    "chunks": [
      "com",
      "put",
      "er"
    ],
    "sentence": "We use the computer to look up English words.",
    "sentenceZh": "我們使用電腦來查詢英文單字。",
    "sentence2": "We learn how to type on the computer in class.",
    "sentence2Zh": "我們在課堂上學習如何在電腦上打字。"
  },
  {
    "id": "passport-refrigerator",
    "word": "refrigerator",
    "zh": "冰箱",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/rɪˈfrɪdʒ.ə.reɪ.t̬ɚ/",
    "chunks": [
      "re",
      "frig",
      "er",
      "a",
      "tor"
    ],
    "sentence": "Keep the fresh milk and cheese in the refrigerator.",
    "sentenceZh": "把新鮮牛奶和起司保存在冰箱裡。",
    "sentence2": "Put the fresh milk back in the refrigerator to keep it cool.",
    "sentence2Zh": "把鮮牛奶放回冰箱以保持冰涼。"
  },
  {
    "id": "junior-clean",
    "word": "clean",
    "zh": "乾淨的/清潔/打掃",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kliːn/",
    "chunks": [
      "clean"
    ],
    "sentence": "Please help me clean the dirty windows this afternoon.",
    "sentenceZh": "今天下午請幫我清潔髒窗戶。",
    "sentence2": "We must clean our study desks before we go home.",
    "sentence2Zh": "我們回家前必須打掃乾淨我們的書桌。"
  },
  {
    "id": "elementary-bedroom",
    "word": "bedroom",
    "zh": "臥室/臥房",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈbed.ruːm/",
    "chunks": [
      "bed",
      "room"
    ],
    "sentence": "My bedroom has a small desk and a warm bed.",
    "sentenceZh": "我的臥室有一張小書桌和一張溫暖的床。",
    "sentence2": "I sleep peacefully in my quiet bedroom.",
    "sentence2Zh": "我在安靜的臥室裡安穩地睡覺。"
  },
  {
    "id": "passport-dining",
    "word": "dining",
    "zh": "用餐/進餐",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdaɪ.nɪŋ/",
    "chunks": [
      "din",
      "ing"
    ],
    "sentence": "The family had dinner together in the dining room.",
    "sentenceZh": "全家人在餐廳一起吃晚餐。",
    "sentence2": "We gathered in the dining area to share the food.",
    "sentence2Zh": "我們在用餐區聚集分享食物。"
  },
  {
    "id": "passport-room",
    "word": "room",
    "zh": "房間/空間",
    "topic": "House",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ruːm/",
    "chunks": [
      "room"
    ],
    "sentence": "Our living room is very bright and cozy.",
    "sentenceZh": "我們的客廳非常明亮而且溫馨。",
    "sentence2": "My room has a soft bed and a tidy bookshelf.",
    "sentence2Zh": "我的房間有一張柔軟的床和整齊的書架。"
  },
  {
    "id": "junior-buy",
    "word": "buy",
    "zh": "購買/買",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/baɪ/",
    "chunks": [
      "buy"
    ],
    "sentence": "I want to buy a new box of crayons.",
    "sentenceZh": "我想買一盒新的蠟筆。",
    "sentence2": "I want to buy a new pencil case at the shop.",
    "sentence2Zh": "我想在商店買一個新的筆袋。"
  },
  {
    "id": "junior-free",
    "word": "free",
    "zh": "免費的/自由的/空閒的",
    "topic": "Money",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/friː/",
    "chunks": [
      "free"
    ],
    "sentence": "Children under six can enter the zoo for free.",
    "sentenceZh": "六歲以下的孩子可以免費進入動物園。",
    "sentence2": "You are free to join our English game club.",
    "sentence2Zh": "你可以自由加入我們的英文遊戲社團。"
  },
  {
    "id": "junior-money",
    "word": "money",
    "zh": "錢/貨幣",
    "topic": "Money",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmʌn.i/",
    "chunks": [
      "mon",
      "ey"
    ],
    "sentence": "She saved some money to buy a storybook.",
    "sentenceZh": "她存了一些錢來買一本故事書。",
    "sentence2": "Saving money helps us buy things we really need later.",
    "sentence2Zh": "存錢可以幫助我們在以後購買真正需要的東西。"
  },
  {
    "id": "junior-dollar",
    "word": "dollar",
    "zh": "元/美元",
    "topic": "Money",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdɑː.lɚ/",
    "chunks": [
      "dol",
      "lar"
    ],
    "sentence": "A cup of bubble tea costs fifty New Taiwan dollars.",
    "sentenceZh": "一杯珍珠奶茶要新臺幣五十元。",
    "sentence2": "A cup of hot tea costs one dollar at the stand.",
    "sentence2Zh": "攤位上的一杯熱茶要一美元。"
  },
  {
    "id": "junior-new",
    "word": "new",
    "zh": "新的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/nuː/",
    "chunks": [
      "new"
    ],
    "sentence": "He has a new blue schoolbag for the school year.",
    "sentenceZh": "他新學年有一個新的藍色書包。",
    "sentence2": "Welcome our new classmate with a warm hello.",
    "sentence2Zh": "用溫馨的問候歡迎我們的新同學。"
  },
  {
    "id": "junior-number",
    "word": "number",
    "zh": "數字/號碼",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈnʌm.bɚ/",
    "chunks": [
      "num",
      "ber"
    ],
    "sentence": "Seven is my sister's favorite and lucky number.",
    "sentenceZh": "七是我妹妹最喜歡且幸運的數字。",
    "sentence2": "Please write the number of students in the blank.",
    "sentence2Zh": "請在空格內寫上學生的數量。"
  },
  {
    "id": "junior-all",
    "word": "all",
    "zh": "全部的/所有的/全部/所有",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɑːl/",
    "chunks": [
      "all"
    ],
    "sentence": "The students in the classroom were all quiet.",
    "sentenceZh": "教室裡的學生們全都非常安靜。",
    "sentence2": "All students did a wonderful job on the test today.",
    "sentence2Zh": "今天所有學生在測驗中都表現得很好。"
  },
  {
    "id": "junior-both",
    "word": "both",
    "zh": "兩者都/雙方的",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/boʊθ/",
    "chunks": [
      "both"
    ],
    "sentence": "Both of my brothers like to play basketball.",
    "sentenceZh": "我的兩個哥哥都喜歡打籃球。",
    "sentence2": "Both of my dogs love to play with the ball.",
    "sentence2Zh": "我的兩隻狗都很喜歡玩這顆球。"
  },
  {
    "id": "junior-much",
    "word": "much",
    "zh": "許多的/非常地(加不可數)",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mʌtʃ/",
    "chunks": [
      "much"
    ],
    "sentence": "How much water should we drink every day?",
    "sentenceZh": "我們每天應該喝多少水？",
    "sentence2": "Thank you very much for your kind help.",
    "sentence2Zh": "非常感謝你親切的幫助。"
  },
  {
    "id": "junior-many",
    "word": "many",
    "zh": "許多的/很多的",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmen.i/",
    "chunks": [
      "many"
    ],
    "sentence": "How many students are there in your class?",
    "sentenceZh": "你們班上有多少位學生？",
    "sentence2": "There are many tall trees in our school playground.",
    "sentence2Zh": "我們學校操場上有許多高樹。"
  },
  {
    "id": "passport-more",
    "word": "more",
    "zh": "更多的/較多的/更",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mɔːr/",
    "chunks": [
      "more"
    ],
    "sentence": "I want to read more books during the holiday.",
    "sentenceZh": "我希望在假期期間讀更多的書。",
    "sentence2": "Reading more books can help you learn new words.",
    "sentence2Zh": "多讀書可以幫助你學習新單字。"
  },
  {
    "id": "junior-some",
    "word": "some",
    "zh": "一些的/一些/某些",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sʌm/",
    "chunks": [
      "some"
    ],
    "sentence": "My mom prepared some fresh fruit for us.",
    "sentenceZh": "我媽媽為我們準備了一些新鮮水果。",
    "sentence2": "Can you give me some paper to write on, please?",
    "sentence2Zh": "可以請你給我一些紙寫字嗎？"
  },
  {
    "id": "passport-first",
    "word": "first",
    "zh": "第一/首先/第一的",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fɝːst/",
    "chunks": [
      "first"
    ],
    "sentence": "He won the first prize in the English speaking contest.",
    "sentenceZh": "他在英語演講比賽中贏得了一等獎。",
    "sentence2": "Safety first is our number one rule when hiking.",
    "sentence2Zh": "健行時，安全第一是我們的首要規則。"
  },
  {
    "id": "passport-second",
    "word": "second",
    "zh": "第二/秒/第二的",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsek.ənd/",
    "chunks": [
      "sec",
      "ond"
    ],
    "sentence": "This is the second time I have visited this museum.",
    "sentenceZh": "這是我第二次參觀這座博物館。",
    "sentence2": "February is the second month of the year.",
    "sentence2Zh": "二月是一年中的第二個月。"
  },
  {
    "id": "passport-third",
    "word": "third",
    "zh": "第三/第三的",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/θɝːd/",
    "chunks": [
      "third"
    ],
    "sentence": "Her classroom is on the third floor.",
    "sentenceZh": "她的教室在三樓。",
    "sentence2": "He got third place in the running race.",
    "sentence2Zh": "他在賽跑中得到第三名。"
  },
  {
    "id": "junior-last",
    "word": "last",
    "zh": "最後的/持續/上一個",
    "topic": "Numbers",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/læst/",
    "chunks": [
      "last"
    ],
    "sentence": "December is the last month of the year.",
    "sentenceZh": "十二月是一年中的最後一個月。",
    "sentence2": "This is the last question of our daily challenge.",
    "sentence2Zh": "這是我們每日挑戰的最後一個問題。"
  },
  {
    "id": "passport-job",
    "word": "job",
    "zh": "工作/職務",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dʒɑːb/",
    "chunks": [
      "job"
    ],
    "sentence": "A teacher's job is to help students learn.",
    "sentenceZh": "老師的工作是幫助學生學習。",
    "sentence2": "Cleaning the blackboard is my classroom job today.",
    "sentence2Zh": "今天擦黑板是我的班級工作。"
  },
  {
    "id": "junior-work",
    "word": "work",
    "zh": "工作/勞作",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɝːk/",
    "chunks": [
      "work"
    ],
    "sentence": "Our parents work hard to take care of the family.",
    "sentenceZh": "我們的父母努力工作以照顧家庭。",
    "sentence2": "My parents go to work early in the morning.",
    "sentence2Zh": "我父母早上很早去工作。"
  },
  {
    "id": "passport-worker",
    "word": "worker",
    "zh": "工人/工作者",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwɝː.kɚ/",
    "chunks": [
      "work",
      "er"
    ],
    "sentence": "The factory workers wear blue uniforms and helmets.",
    "sentenceZh": "工廠工人穿著藍色制服並戴著安全帽。",
    "sentence2": "The construction worker wears an orange helmet.",
    "sentence2Zh": "那位建築工人戴著橘色安全帽。"
  },
  {
    "id": "passport-actor",
    "word": "actor",
    "zh": "男演員/演員",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈæk.tɚ/",
    "chunks": [
      "ac",
      "tor"
    ],
    "sentence": "He wants to be a famous movie actor when he grows up.",
    "sentenceZh": "他長大後想成為一名著名的電影演員。",
    "sentence2": "The actor played the hero in the movie.",
    "sentence2Zh": "那位男演員在電影裡扮演英雄。"
  },
  {
    "id": "passport-actress",
    "word": "actress",
    "zh": "女演員",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈæk.trəs/",
    "chunks": [
      "ac",
      "tress"
    ],
    "sentence": "The actress wore a beautiful red dress on stage.",
    "sentenceZh": "這位女演員在舞台上穿著一件美麗的紅洋裝。",
    "sentence2": "She wants to be a famous actress when she grows up.",
    "sentence2Zh": "她長大後想成為一名著名的女演員。"
  },
  {
    "id": "junior-singer",
    "word": "singer",
    "zh": "歌手/歌唱家",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsɪŋ.ɚ/",
    "chunks": [
      "singer"
    ],
    "sentence": "The young singer has a very beautiful voice.",
    "sentenceZh": "這位年輕的歌手擁有非常美麗的嗓音。",
    "sentence2": "The popular singer sang a beautiful song at the concert.",
    "sentence2Zh": "那位受歡迎的歌手在演唱會上唱了一首美麗的歌。"
  },
  {
    "id": "junior-driver",
    "word": "driver",
    "zh": "司機/駕駛",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdraɪ.vɚ/",
    "chunks": [
      "driv",
      "er"
    ],
    "sentence": "The bus driver is polite and always smiles.",
    "sentenceZh": "那位公車司機很有禮貌，而且總是面帶微笑。",
    "sentence2": "Our school bus driver drives safely.",
    "sentence2Zh": "我們的校車司機開車很安全。"
  },
  {
    "id": "passport-farmer",
    "word": "farmer",
    "zh": "農夫/農民",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfɑːr.mɚ/",
    "chunks": [
      "farmer"
    ],
    "sentence": "The farmer grows fresh vegetables and rice on his farm.",
    "sentenceZh": "農夫在他的農場上種植新鮮蔬菜和稻米。",
    "sentence2": "The farmer grows sweet fruit and fresh vegetables.",
    "sentence2Zh": "農夫種植甜美的水果和新鮮的蔬菜。"
  },
  {
    "id": "passport-mailman",
    "word": "mailman",
    "zh": "郵差/信差",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmeɪl.mæn/",
    "chunks": [
      "mail",
      "man"
    ],
    "sentence": "The mailman delivered a package to our house yesterday.",
    "sentenceZh": "郵差昨天送了一個包裹到我們家。",
    "sentence2": "The mailman delivered a letter to my grandmother today.",
    "sentence2Zh": "郵差今天送了一封信給我祖母。"
  },
  {
    "id": "passport-waiter",
    "word": "waiter",
    "zh": "男服務生/侍者",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈweɪ.t̬ɚ/",
    "chunks": [
      "wait",
      "er"
    ],
    "sentence": "The waiter in the restaurant is very helpful.",
    "sentenceZh": "這家餐廳的服務生非常熱心。",
    "sentence2": "The friendly waiter brought us a glass of cold water.",
    "sentence2Zh": "友善的男服務生給我們倒了一杯冰水。"
  },
  {
    "id": "passport-waitress",
    "word": "waitress",
    "zh": "女服務生/女侍",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈweɪ.trəs/",
    "chunks": [
      "wait",
      "ress"
    ],
    "sentence": "The waitress served us hot corn soup and bread.",
    "sentenceZh": "女服務生為我們端來熱玉米濃湯和麵包。",
    "sentence2": "The waitress is serving hot soup to the customers.",
    "sentence2Zh": "女服務生正在給顧客端上熱湯。"
  },
  {
    "id": "passport-soldier",
    "word": "soldier",
    "zh": "軍人/士兵",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsoʊl.dʒɚ/",
    "chunks": [
      "sol",
      "dier"
    ],
    "sentence": "The brave soldiers protect their country and people.",
    "sentenceZh": "勇敢的士兵們保護他們的國家和人民。",
    "sentence2": "The brave soldier protects our country from danger.",
    "sentence2Zh": "勇敢的軍人保護我們的國家免受危險。"
  },
  {
    "id": "passport-police-officer",
    "word": "police officer",
    "zh": "警察/警官",
    "topic": "Occupations",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pəˈliːs ˌɑː.fɪ.sɚ/",
    "chunks": [
      "po",
      "lice",
      "of",
      "fi",
      "cer"
    ],
    "sentence": "The police officer helped the lost boy find his mother.",
    "sentenceZh": "警察幫助迷路的小男孩找到了他的媽媽。",
    "sentence2": "The police officer guided the children across the street.",
    "sentence2Zh": "警察引導孩子們過馬路。"
  },
  {
    "id": "junior-hair",
    "word": "hair",
    "zh": "頭髮/毛髮",
    "topic": "Body",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/her/",
    "chunks": [
      "hair"
    ],
    "sentence": "Her sister has long black hair and big eyes.",
    "sentenceZh": "她姐姐有長長的黑髮和大眼睛。",
    "sentence2": "My mother washes her long hair every evening.",
    "sentence2Zh": "我媽媽每天晚上洗她的長髮。"
  },
  {
    "id": "junior-face",
    "word": "face",
    "zh": "臉/面孔",
    "topic": "Body",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/feɪs/",
    "chunks": [
      "face"
    ],
    "sentence": "Remember to wash your face every morning.",
    "sentenceZh": "記得每天早上洗臉。",
    "sentence2": "She has a big smile on her face when she draws.",
    "sentence2Zh": "她畫畫時臉上帶著燦爛的笑容。"
  },
  {
    "id": "elementary-nose",
    "word": "nose",
    "zh": "鼻子",
    "topic": "Body",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/noʊz/",
    "chunks": [
      "nose"
    ],
    "sentence": "My nose is red because I have a cold.",
    "sentenceZh": "因為感冒，我的鼻子紅紅的。",
    "sentence2": "My dog has a black nose and a wagging tail.",
    "sentence2Zh": "我的狗有黑色的鼻子和一條搖擺的尾巴。"
  },
  {
    "id": "elementary-ear",
    "word": "ear",
    "zh": "耳朵",
    "topic": "Body",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɪr/",
    "chunks": [
      "ear"
    ],
    "sentence": "We have two ears to listen to beautiful music.",
    "sentenceZh": "我們有兩隻耳朵來聽美妙的音樂。",
    "sentence2": "A rabbit has long ears to hear tiny sounds.",
    "sentence2Zh": "兔子長著長耳朵來聆聽微弱的聲音。"
  },
  {
    "id": "elementary-mouth",
    "word": "mouth",
    "zh": "嘴巴/口",
    "topic": "Body",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/maʊθ/",
    "chunks": [
      "mouth"
    ],
    "sentence": "Open your mouth and show me your white teeth.",
    "sentenceZh": "張開你的嘴，讓我看看你白白的牙齒。",
    "sentence2": "Please open your mouth and drink some warm water.",
    "sentence2Zh": "請張開嘴巴喝些溫開水。"
  },
  {
    "id": "passport-tooth",
    "word": "tooth",
    "zh": "牙齒(單數)",
    "topic": "Body",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tuːθ/",
    "chunks": [
      "tooth"
    ],
    "sentence": "He lost a baby tooth and put it under his pillow.",
    "sentenceZh": "他掉了一顆乳牙，把它放在枕頭底下。",
    "sentence2": "I brush my teeth and wash my face before sleep.",
    "sentence2Zh": "我睡前刷牙洗臉。"
  },
  {
    "id": "junior-leg",
    "word": "leg",
    "zh": "腿/下肢",
    "topic": "Body",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/leɡ/",
    "chunks": [
      "leg"
    ],
    "sentence": "Flamingos stand on one leg when they rest.",
    "sentenceZh": "紅鶴休息時會單腿站立。",
    "sentence2": "A hippo has short legs but can walk fast in water.",
    "sentence2Zh": "河馬的腿很短，但在水裡能走得很快。"
  },
  {
    "id": "passport-teeth",
    "word": "teeth",
    "zh": "牙齒(複數)",
    "topic": "Body",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tiːθ/",
    "chunks": [
      "teeth"
    ],
    "sentence": "You should brush your teeth at least twice a day.",
    "sentenceZh": "你每天應該至少刷牙兩次。",
    "sentence2": "We must brush our teeth twice a day.",
    "sentence2Zh": "我們每天必須刷牙兩次。"
  },
  {
    "id": "passport-feet",
    "word": "feet",
    "zh": "腳(複數)/英尺",
    "topic": "Body",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fiːt/",
    "chunks": [
      "feet"
    ],
    "sentence": "He washed his dirty feet after playing in the mud.",
    "sentenceZh": "他在泥巴裡玩耍後，把髒腳洗乾淨了。",
    "sentence2": "Wipe your wet feet on the mat before entering.",
    "sentence2Zh": "進門前先在地墊上把溼腳擦乾。"
  },
  {
    "id": "passport-back",
    "word": "back",
    "zh": "背部/後面/返回",
    "topic": "Body",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bæk/",
    "chunks": [
      "back"
    ],
    "sentence": "Please write your name on the back of the paper.",
    "sentenceZh": "請在紙的背面寫下你的名字。",
    "sentence2": "We carry our heavy bags on our backs to school.",
    "sentence2Zh": "我們背著重重的書包上學。"
  },
  {
    "id": "passport-person",
    "word": "person",
    "zh": "人(單數)",
    "topic": "People",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpɝː.sən/",
    "chunks": [
      "per",
      "son"
    ],
    "sentence": "Each person in our class must prepare a short story.",
    "sentenceZh": "我們班上的每個人都必須準備一個短篇故事。",
    "sentence2": "Benson is a very kind and friendly person.",
    "sentence2Zh": "班森是一個非常親切且友善的人。"
  },
  {
    "id": "junior-people",
    "word": "people",
    "zh": "人們/人(複數)",
    "topic": "People",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpiː.pəl/",
    "chunks": [
      "peo",
      "ple"
    ],
    "sentence": "Many people go to the park to practice Tai Chi.",
    "sentenceZh": "許多人去公園練習太極拳。",
    "sentence2": "Many people in the park are flying colorful kites.",
    "sentence2Zh": "公園裡的許多人正在放彩色的風箏。"
  },
  {
    "id": "passport-baby",
    "word": "baby",
    "zh": "嬰兒/寶貝",
    "topic": "People",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈbeɪ.bi/",
    "chunks": [
      "ba",
      "by"
    ],
    "sentence": "The baby fell asleep in her mother's arms.",
    "sentenceZh": "嬰兒在媽媽的懷抱裡睡著了。",
    "sentence2": "The baby is sitting safely in the chair.",
    "sentence2Zh": "嬰兒安全地坐在椅子上。"
  },
  {
    "id": "passport-kid",
    "word": "kid",
    "zh": "小孩/開玩笑",
    "topic": "People",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kɪd/",
    "chunks": [
      "kid"
    ],
    "sentence": "The kids are playing hide-and-seek under the tree.",
    "sentenceZh": "孩子們正在樹下玩捉迷藏。",
    "sentence2": "Every kid loves to play games on the playground.",
    "sentence2Zh": "每個小孩都喜歡在操場上玩遊戲。"
  },
  {
    "id": "elementary-boy",
    "word": "boy",
    "zh": "男孩",
    "topic": "People",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bɔɪ/",
    "chunks": [
      "boy"
    ],
    "sentence": "The boy over there is my brother's classmate.",
    "sentenceZh": "那邊那個男孩是我哥哥的同學。",
    "sentence2": "The active boy jumped high to catch the basketball.",
    "sentence2Zh": "那個活潑的男孩跳得很高去接籃球。"
  },
  {
    "id": "elementary-girl",
    "word": "girl",
    "zh": "女孩",
    "topic": "People",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡɝːl/",
    "chunks": [
      "girl"
    ],
    "sentence": "The young girl wore a pink hat to school.",
    "sentenceZh": "這個年輕的女孩戴著粉紅色的帽子去上學。",
    "sentence2": "She is a smart girl who always does her homework.",
    "sentence2Zh": "她是一個總是寫作業的聰明女孩。"
  },
  {
    "id": "junior-woman",
    "word": "woman",
    "zh": "女人/婦女(單數)",
    "topic": "People",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwʊm.ən/",
    "chunks": [
      "wom",
      "an"
    ],
    "sentence": "A kind woman helped me find the train station.",
    "sentenceZh": "一位好心的女士幫我找到了火車站。",
    "sentence2": "The woman standing next to the door is our teacher.",
    "sentence2Zh": "站在門旁邊的那位女士/婦女是我們的老師。"
  },
  {
    "id": "passport-women",
    "word": "women",
    "zh": "女人/婦女(複數)",
    "topic": "People",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwɪm.ɪn/",
    "chunks": [
      "wom",
      "en"
    ],
    "sentence": "The two women are talking near the flower shop.",
    "sentenceZh": "這兩位女士正在花店附近說話。",
    "sentence2": "Three women walked into the library together.",
    "sentence2Zh": "三位女士/婦女一起走進了圖書館。"
  },
  {
    "id": "junior-bad",
    "word": "bad",
    "zh": "壞的/不好的/嚴重的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bæd/",
    "chunks": [
      "bad"
    ],
    "sentence": "Eating too much candy is bad for your teeth.",
    "sentenceZh": "吃太多糖果對你的牙齒不好。",
    "sentence2": "Eating too much salt is bad for your health.",
    "sentence2Zh": "吃太多鹽對你的健康不好。"
  },
  {
    "id": "junior-good",
    "word": "good",
    "zh": "好的/優秀的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡʊd/",
    "chunks": [
      "good"
    ],
    "sentence": "It is a good habit to wash hands before meals.",
    "sentenceZh": "飯前洗手是個好習慣。",
    "sentence2": "Reading is a good habit that helps us learn.",
    "sentence2Zh": "讀書是一個能幫助我們學習的好習慣。"
  },
  {
    "id": "passport-nice",
    "word": "nice",
    "zh": "親切的/友善的/美好的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/naɪs/",
    "chunks": [
      "nice"
    ],
    "sentence": "We had a very nice trip to the zoo yesterday.",
    "sentenceZh": "我們昨天去動物園玩得很愉快。",
    "sentence2": "It is nice of you to share your drawing crayons.",
    "sentence2Zh": "你真好，願意分享你的繪圖蠟筆。"
  },
  {
    "id": "passport-lazy",
    "word": "lazy",
    "zh": "懶惰的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈleɪ.zi/",
    "chunks": [
      "lazy"
    ],
    "sentence": "The lazy dog did not want to go out for a walk.",
    "sentenceZh": "這隻懶惰的狗不想出去散步。",
    "sentence2": "Do not be lazy; keep working on your dreams.",
    "sentence2Zh": "不要懶惰，為你的夢想努力奮鬥吧。"
  },
  {
    "id": "junior-cute",
    "word": "cute",
    "zh": "可愛的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kjuːt/",
    "chunks": [
      "cute"
    ],
    "sentence": "Look at that cute rabbit eating a carrot.",
    "sentenceZh": "看看那隻正在吃胡蘿蔔的可愛兔子。",
    "sentence2": "The cute koala is sleeping in a tree.",
    "sentence2Zh": "那隻可愛的無尾熊正在樹上睡覺。"
  },
  {
    "id": "passport-smart",
    "word": "smart",
    "zh": "聰明的/時髦的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/smɑːrt/",
    "chunks": [
      "smart"
    ],
    "sentence": "The smart dolphin can do tricks with a ball.",
    "sentenceZh": "這隻聰明的海豚會用球做特技。",
    "sentence2": "A smart dog can learn many tricks from its owner.",
    "sentence2Zh": "聰明的狗可以從主人那裡學會很多把戲。"
  },
  {
    "id": "junior-old",
    "word": "old",
    "zh": "老的/舊的/年老的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/oʊld/",
    "chunks": [
      "old"
    ],
    "sentence": "An old tree stands beside our school.",
    "sentenceZh": "我們學校旁邊有一棵老樹。",
    "sentence2": "I found an old map of our school in the library.",
    "sentence2Zh": "我在圖書館找到一張學校的舊地圖。"
  },
  {
    "id": "elementary-tall",
    "word": "tall",
    "zh": "高的(高聳的)",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tɑːl/",
    "chunks": [
      "tall"
    ],
    "sentence": "He is very tall and plays basketball very well.",
    "sentenceZh": "他很高，而且籃球打得很好。",
    "sentence2": "Giraffes are the tallest animals on land.",
    "sentence2Zh": "長頸鹿是陸地上最高的動物。"
  },
  {
    "id": "elementary-short",
    "word": "short",
    "zh": "矮的/短的",
    "topic": "Sizes & measurements",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʃɔːrt/",
    "chunks": [
      "short"
    ],
    "sentence": "She wrote a short story about her pet.",
    "sentenceZh": "她寫了一篇關於寵物的短篇故事。",
    "sentence2": "He wrote a short English paragraph in his notebook.",
    "sentence2Zh": "他在筆記本裡寫了一小段英文。"
  },
  {
    "id": "elementary-thin",
    "word": "thin",
    "zh": "薄的/瘦的/稀薄的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/θɪn/",
    "chunks": [
      "thin"
    ],
    "sentence": "The cat looks thin, so we should feed it.",
    "sentenceZh": "那隻貓看起來很瘦，所以我們應該餵牠。",
    "sentence2": "Please write on this thin sheet of paper.",
    "sentence2Zh": "請寫在這張薄紙上。"
  },
  {
    "id": "junior-heavy",
    "word": "heavy",
    "zh": "重的/沉重的/大量的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈhev.i/",
    "chunks": [
      "heavy"
    ],
    "sentence": "The heavy box is full of English books.",
    "sentenceZh": "這個重箱子裝滿了英文書。",
    "sentence2": "Heavy rain made large puddles on the playground.",
    "sentence2Zh": "大雨讓操場上出現了大水窪。"
  },
  {
    "id": "passport-pretty",
    "word": "pretty",
    "zh": "漂亮的/相當",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈprɪt.i/",
    "chunks": [
      "pret",
      "ty"
    ],
    "sentence": "She bought a pretty pink dress for the party.",
    "sentenceZh": "她為派對買了一件漂亮的粉紅色洋裝。",
    "sentence2": "She painted a pretty butterfly on the card.",
    "sentence2Zh": "她在卡片上畫了一隻漂亮的蝴蝶。"
  },
  {
    "id": "passport-angry",
    "word": "angry",
    "zh": "生氣的/憤怒的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈæŋ.ɡri/",
    "chunks": [
      "an",
      "gry"
    ],
    "sentence": "My mom was angry because I broke the window.",
    "sentenceZh": "我媽媽很生氣，因為我打破了窗戶。",
    "sentence2": "He was angry with himself for making a silly mistake.",
    "sentence2Zh": "他因為犯了一個愚蠢的錯誤而生氣。"
  },
  {
    "id": "passport-mad",
    "word": "mad",
    "zh": "生氣的/發瘋的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mæd/",
    "chunks": [
      "mad"
    ],
    "sentence": "Dad got mad when he saw the dirty floor.",
    "sentenceZh": "爸爸看到髒地板時生氣了。",
    "sentence2": "Please do not be mad; let us talk about the problem.",
    "sentence2Zh": "請不要生氣，讓我們談談這個問題。"
  },
  {
    "id": "passport-excited",
    "word": "excited",
    "zh": "興奮的/激動的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɪkˈsaɪ.t̬ɪd/",
    "chunks": [
      "ex",
      "cit",
      "ed"
    ],
    "sentence": "The students are excited about the school trip.",
    "sentenceZh": "學生們對學校旅行感到很興奮。",
    "sentence2": "The students were excited about the field trip.",
    "sentence2Zh": "學生們對戶外教學感到非常興奮。"
  },
  {
    "id": "passport-bored",
    "word": "bored",
    "zh": "感到無聊的/無趣的",
    "topic": "Personal",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bɔːrd/",
    "chunks": [
      "bored"
    ],
    "sentence": "I felt bored because the movie was too long.",
    "sentenceZh": "我感到很無聊，因為電影太長了。",
    "sentence2": "I felt bored, so I went out to play basketball.",
    "sentence2Zh": "我感到無聊，所以出去打籃球。"
  },
  {
    "id": "passport-there",
    "word": "there",
    "zh": "那裡/那兒",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðer/",
    "chunks": [
      "there"
    ],
    "sentence": "Please put the box over there.",
    "sentenceZh": "請把箱子放到那裡。",
    "sentence2": "Look at the tall tree over there.",
    "sentence2Zh": "看看那邊那棵高樹。"
  },
  {
    "id": "junior-left",
    "word": "left",
    "zh": "左邊/左方的/留下",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/left/",
    "chunks": [
      "left"
    ],
    "sentence": "Please turn left at the next street corner.",
    "sentenceZh": "請在下一個路口往左轉。",
    "sentence2": "There are only three apples left in the basket.",
    "sentence2Zh": "籃子裡只剩下三個蘋果了。"
  },
  {
    "id": "junior-right",
    "word": "right",
    "zh": "右邊/右方的/正確的",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/raɪt/",
    "chunks": [
      "right"
    ],
    "sentence": "He wrote down the answer with his right hand.",
    "sentenceZh": "他用右手寫下答案。",
    "sentence2": "Turn right at the bookstore to find the playground.",
    "sentence2Zh": "在書店右轉即可找到操場。"
  },
  {
    "id": "junior-here",
    "word": "here",
    "zh": "這裡/這兒",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hɪr/",
    "chunks": [
      "here"
    ],
    "sentence": "Come here and look at this funny picture.",
    "sentenceZh": "過來這裡看這張有趣的圖片。",
    "sentence2": "Please sit here next to me and share the book.",
    "sentence2Zh": "請坐在我旁邊，一起分享這本書。"
  },
  {
    "id": "passport-bank",
    "word": "bank",
    "zh": "銀行/河岸",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bæŋk/",
    "chunks": [
      "bank"
    ],
    "sentence": "My mother works as a teller in a bank.",
    "sentenceZh": "我媽媽在銀行擔任櫃檯人員。",
    "sentence2": "My mother went to the bank to save some money.",
    "sentence2Zh": "我媽媽去銀行存了一些錢。"
  },
  {
    "id": "elementary-park",
    "word": "park",
    "zh": "公園/停車",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pɑːrk/",
    "chunks": [
      "park"
    ],
    "sentence": "We love to play soccer in the park on weekends.",
    "sentenceZh": "我們週末喜歡在公園踢足球。",
    "sentence2": "Let's fly our new kites in the park this weekend.",
    "sentence2Zh": "這個週末我們去公園放我們的新風箏吧。"
  },
  {
    "id": "elementary-zoo",
    "word": "zoo",
    "zh": "動物園",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/zuː/",
    "chunks": [
      "zoo"
    ],
    "sentence": "We saw many wild animals at the Taipei Zoo.",
    "sentenceZh": "我們在臺北市立動物園看到許多野生動物。",
    "sentence2": "We can see monkeys climbing trees at the zoo.",
    "sentence2Zh": "我們可以在動物園看到猴子爬樹。"
  },
  {
    "id": "junior-shop",
    "word": "shop",
    "zh": "商店/購物",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʃɑːp/",
    "chunks": [
      "shop"
    ],
    "sentence": "She bought some cute pencil cases in the shop.",
    "sentenceZh": "她在商店裡買了一些可愛的筆袋。",
    "sentence2": "My sister likes to shop for cute stickers at the bookstore.",
    "sentence2Zh": "我妹妹喜歡去書店購買可愛的貼紙。"
  },
  {
    "id": "passport-store",
    "word": "store",
    "zh": "商店/儲存",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/stɔːr/",
    "chunks": [
      "store"
    ],
    "sentence": "The toy store is closed on Monday morning.",
    "sentenceZh": "這家玩具店在星期一早上休息。",
    "sentence2": "We bought fresh milk at the corner grocery store.",
    "sentence2Zh": "我們在轉角的雜貨店買了新鮮牛奶。"
  },
  {
    "id": "elementary-bookstore",
    "word": "bookstore",
    "zh": "書店",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈbʊk.stɔːr/",
    "chunks": [
      "book",
      "store"
    ],
    "sentence": "I bought this English dictionary from the bookstore.",
    "sentenceZh": "我從書店買了這本英文字典。",
    "sentence2": "I found an interesting book about stars at the bookstore.",
    "sentence2Zh": "我在書店找到一本關於星星的有趣書籍。"
  },
  {
    "id": "passport-market",
    "word": "market",
    "zh": "市場/超市",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmɑːr.kɪt/",
    "chunks": [
      "mar",
      "ket"
    ],
    "sentence": "Grandma bought fresh vegetables at the morning market.",
    "sentenceZh": "阿嬤在早市買了新鮮蔬菜。",
    "sentence2": "The farmer sells fresh red apples in the morning market.",
    "sentence2Zh": "農夫在早市販賣新鮮的紅蘋果。"
  },
  {
    "id": "junior-office",
    "word": "office",
    "zh": "辦公室",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɑː.fɪs/",
    "chunks": [
      "of",
      "fice"
    ],
    "sentence": "The principal is working in his school office.",
    "sentenceZh": "校長正在他的學校辦公室裡工作。",
    "sentence2": "Please deliver this message to the teacher's office.",
    "sentence2Zh": "請把這個消息送到教師辦公室。"
  },
  {
    "id": "passport-post-office",
    "word": "post office",
    "zh": "郵局",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpoʊst ˌɑː.fɪs/",
    "chunks": [
      "post",
      "of",
      "fice"
    ],
    "sentence": "He went to the post office to mail a letter.",
    "sentenceZh": "他去郵局寄信。",
    "sentence2": "I bought some beautiful stamps at the post office.",
    "sentence2Zh": "我在郵局買了一些美麗的郵票。"
  },
  {
    "id": "passport-restroom",
    "word": "restroom",
    "zh": "洗手間/廁所",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈrest.ruːm/",
    "chunks": [
      "re",
      "stroom"
    ],
    "sentence": "Excuse me, where is the restroom in this library?",
    "sentenceZh": "不好意思，這家圖書館的廁所在哪裡？",
    "sentence2": "Please wash your hands when you leave the restroom.",
    "sentence2Zh": "離開洗手間時請洗手。"
  },
  {
    "id": "passport-restaurant",
    "word": "restaurant",
    "zh": "餐廳/餐館",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈres.tə.rɑːnt/",
    "chunks": [
      "restau",
      "rant"
    ],
    "sentence": "We had a delicious dinner at the Italian restaurant.",
    "sentenceZh": "我們在義大利餐廳吃了一頓美味的晚餐。",
    "sentence2": "We sat together to enjoy a warm dinner at the restaurant.",
    "sentence2Zh": "我們在餐廳裡坐在一起享用溫馨的晚餐。"
  },
  {
    "id": "passport-museum",
    "word": "museum",
    "zh": "博物館",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mjuːˈziː.əm/",
    "chunks": [
      "mu",
      "se",
      "um"
    ],
    "sentence": "We learned about dinosaurs at the science museum.",
    "sentenceZh": "我們在自然科學博物館學習了關於恐龍的知識。",
    "sentence2": "The art museum has many colorful paintings by children.",
    "sentence2Zh": "美術館/博物館裡有許多孩子們畫的彩色畫作。"
  },
  {
    "id": "junior-hospital",
    "word": "hospital",
    "zh": "醫院",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈhɑːs.pɪ.təl/",
    "chunks": [
      "hos",
      "pi",
      "tal"
    ],
    "sentence": "The sick boy had to stay in the hospital.",
    "sentenceZh": "生病的小男孩必須住在醫院裡。",
    "sentence2": "My father went to the hospital to visit a sick friend.",
    "sentence2Zh": "我爸爸去醫院探望一位生病的朋友。"
  },
  {
    "id": "passport-fire-station",
    "word": "fire station",
    "zh": "消防局/消防站",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfaɪr ˌsteɪ.ʃən/",
    "chunks": [
      "fire",
      "sta",
      "tion"
    ],
    "sentence": "A red fire engine left the fire station quickly.",
    "sentenceZh": "一輛紅色的消防車迅速離開了消防局。",
    "sentence2": "We visited the local fire station and met the brave firefighters.",
    "sentence2Zh": "我們參觀了當地的消防局並遇到了勇敢的消防員。"
  },
  {
    "id": "passport-movie-theater",
    "word": "movie theater",
    "zh": "電影院",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmuː.vi ˌθɪr.ə.t̬ɚ/",
    "chunks": [
      "movie",
      "the",
      "ater"
    ],
    "sentence": "We watched an animated movie in the movie theater.",
    "sentenceZh": "我們在電影院看了一部動畫電影。",
    "sentence2": "The movie theater is crowded on Saturday evening.",
    "sentence2Zh": "星期六晚上，電影院裡人很多。"
  },
  {
    "id": "passport-police-station",
    "word": "police station",
    "zh": "警察局/派出所",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pəˈliːs ˌsteɪ.ʃən/",
    "chunks": [
      "po",
      "lice",
      "sta",
      "tion"
    ],
    "sentence": "The police station is next to the post office.",
    "sentenceZh": "警察局在郵局旁邊。",
    "sentence2": "The lost child waited safely at the police station.",
    "sentence2Zh": "迷路的孩子安全地在警察局等候。"
  },
  {
    "id": "passport-department-store",
    "word": "department store",
    "zh": "百貨公司",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dɪˈpɑːrt.mənt ˌstɔːr/",
    "chunks": [
      "de",
      "part",
      "ment",
      "store"
    ],
    "sentence": "Mom bought a new bag at the department store.",
    "sentenceZh": "媽媽在百貨公司買了一個新皮包。",
    "sentence2": "We bought a new warm coat at the department store.",
    "sentence2Zh": "我們在百貨公司買了一件新的保暖外套。"
  },
  {
    "id": "elementary-taiwan",
    "word": "Taiwan",
    "zh": "台灣/臺灣",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtaɪ.wɑːn/",
    "chunks": [
      "Tai",
      "wan"
    ],
    "sentence": "Taiwan is a beautiful island with friendly people.",
    "sentenceZh": "台灣是一個有著友善人民的美麗島嶼。",
    "sentence2": "Taiwan is famous for its delicious fruit and night markets.",
    "sentence2Zh": "台灣以其美味的水果和夜市而聞名。"
  },
  {
    "id": "passport-the-uk",
    "word": "the UK",
    "zh": "英國",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðə ˌjuːˈkeɪ/",
    "chunks": [
      "the",
      "UK"
    ],
    "sentence": "London is the capital city of the UK.",
    "sentenceZh": "倫敦是英國的首都。",
    "sentence2": "He is planning to study English in the UK next year.",
    "sentence2Zh": "他計劃明年去英國學習英文。"
  },
  {
    "id": "passport-the-usa",
    "word": "the USA",
    "zh": "美國",
    "topic": "Places",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðə ˌjuː.esˈeɪ/",
    "chunks": [
      "the",
      "USA"
    ],
    "sentence": "My uncle lives in California in the USA.",
    "sentenceZh": "我叔叔住在美國的加州。",
    "sentence2": "We want to visit the Grand Canyon in the USA.",
    "sentence2Zh": "我們想去參觀美國的大峽谷。"
  },
  {
    "id": "passport-germany",
    "word": "Germany",
    "zh": "德國",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdʒɝː.mə.ni/",
    "chunks": [
      "Ger",
      "many"
    ],
    "sentence": "Berlin is the capital of Germany.",
    "sentenceZh": "柏林是德國的首都。",
    "sentence2": "My uncle sent me a toy car from Germany.",
    "sentence2Zh": "我叔叔從德國寄給我一輛玩具車。"
  },
  {
    "id": "passport-france",
    "word": "France",
    "zh": "法國",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fræns/",
    "chunks": [
      "France"
    ],
    "sentence": "They plan to visit Paris in France next summer.",
    "sentenceZh": "他們計劃明年夏天訪問法國的巴黎。",
    "sentence2": "The Eiffel Tower is a very famous landmark in France.",
    "sentence2Zh": "艾菲爾鐵塔是法國非常著名的地標。"
  },
  {
    "id": "passport-japan",
    "word": "Japan",
    "zh": "日本",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dʒəˈpæn/",
    "chunks": [
      "Japan"
    ],
    "sentence": "We ate delicious sushi during our trip to Japan.",
    "sentenceZh": "我們在日本旅行期間吃了美味的壽司。",
    "sentence2": "Cherry blossoms are very beautiful in Japan during spring.",
    "sentence2Zh": "春天時日本的櫻花非常美麗。"
  },
  {
    "id": "passport-korea",
    "word": "Korea",
    "zh": "韓國/南韓",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kəˈriː.ə/",
    "chunks": [
      "Ko",
      "rea"
    ],
    "sentence": "K-pop music is very popular in Korea and Taiwan.",
    "sentenceZh": "韓國流行音樂在韓國和台灣非常流行。",
    "sentence2": "My aunt taught me how to make traditional food from Korea.",
    "sentence2Zh": "我阿姨教我如何做韓國傳統食物。"
  },
  {
    "id": "passport-philippines",
    "word": "Philippines",
    "zh": "菲律賓",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfɪl.ɪ.piːnz/",
    "chunks": [
      "Philip",
      "pines"
    ],
    "sentence": "The Philippines has many beautiful islands.",
    "sentenceZh": "菲律賓有許多美麗的島嶼。",
    "sentence2": "My cousin went to the Philippines for a holiday.",
    "sentence2Zh": "我的表哥去菲律賓度假。"
  },
  {
    "id": "passport-vietnam",
    "word": "Vietnam",
    "zh": "越南",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˌvjet.ˈnæm/",
    "chunks": [
      "Viet",
      "nam"
    ],
    "sentence": "Vietnam is a country in Southeast Asia.",
    "sentenceZh": "越南是東南亞的一個國家。",
    "sentence2": "He bought a traditional hat from Vietnam as a gift.",
    "sentence2Zh": "他買了一頂越南傳統帽子當作禮物。"
  },
  {
    "id": "passport-india",
    "word": "India",
    "zh": "印度",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɪn.di.ə/",
    "chunks": [
      "In",
      "dia"
    ],
    "sentence": "The Taj Mahal is a famous building in India.",
    "sentenceZh": "泰姬瑪哈陵是印度著名的建築。",
    "sentence2": "Yoga is an ancient exercise from India.",
    "sentence2Zh": "瑜伽是一種源自印度的古老運動。"
  },
  {
    "id": "passport-singapore",
    "word": "Singapore",
    "zh": "新加坡",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsɪŋ.ə.pɔːr/",
    "chunks": [
      "Sin",
      "ga",
      "pore"
    ],
    "sentence": "Singapore is a clean and green city-state.",
    "sentenceZh": "新加坡是一個乾淨且綠意盎然的城市國家。",
    "sentence2": "We visited the beautiful Merlion Park in Singapore.",
    "sentence2Zh": "我們參觀了新加坡美麗的魚尾獅公園。"
  },
  {
    "id": "passport-uganda",
    "word": "Uganda",
    "zh": "烏干達",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/juːˈɡæn.də/",
    "chunks": [
      "Ugan",
      "da"
    ],
    "sentence": "Uganda is a country in East Africa.",
    "sentenceZh": "烏干達是東非的一個國家。",
    "sentence2": "Part of Lake Victoria is in Uganda.",
    "sentence2Zh": "維多利亞湖的一部分位於烏干達。"
  },
  {
    "id": "passport-thailand",
    "word": "Thailand",
    "zh": "泰國",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtaɪ.lænd/",
    "chunks": [
      "Thai",
      "land"
    ],
    "sentence": "We saw many elephants during our visit to Thailand.",
    "sentenceZh": "我們到泰國旅行時看到了許多大象。",
    "sentence2": "Thailand is a country in Southeast Asia.",
    "sentence2Zh": "泰國是東南亞的一個國家。"
  },
  {
    "id": "passport-canada",
    "word": "Canada",
    "zh": "加拿大",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈkæn.ə.də/",
    "chunks": [
      "Cana",
      "da"
    ],
    "sentence": "Niagara Falls lies between Canada and the USA.",
    "sentenceZh": "尼加拉瀑布位於加拿大與美國之間。",
    "sentence2": "A maple leaf is shown on the flag of Canada.",
    "sentence2Zh": "加拿大國旗上有一片楓葉。"
  },
  {
    "id": "passport-italy",
    "word": "Italy",
    "zh": "義大利",
    "topic": "Place",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɪt.ə.li/",
    "chunks": [
      "Italy"
    ],
    "sentence": "Pizza and spaghetti are famous foods from Italy.",
    "sentenceZh": "披薩和義大利麵是來自義大利的著名食物。",
    "sentence2": "Italy is famous for its history, art, and pizza.",
    "sentence2Zh": "義大利以其歷史、藝術和披薩而聞名。"
  },
  {
    "id": "elementary-school",
    "word": "school",
    "zh": "學校",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/skuːl/",
    "chunks": [
      "school"
    ],
    "sentence": "We go to school from Monday to Friday.",
    "sentenceZh": "我們星期一到星期五去上學。",
    "sentence2": "We walk to school together every morning.",
    "sentence2Zh": "我們每天早上一起走路去學校。"
  },
  {
    "id": "junior-class",
    "word": "class",
    "zh": "班級/課堂",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/klæs/",
    "chunks": [
      "class"
    ],
    "sentence": "Please be quiet because the English class has started.",
    "sentenceZh": "英文課已經開始，請保持安靜。",
    "sentence2": "We listen patiently to the teacher in class.",
    "sentence2Zh": "我們在課堂上耐心聽老師講課。"
  },
  {
    "id": "passport-pe",
    "word": "PE",
    "zh": "體育/體育課",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˌpiːˈiː/",
    "chunks": [
      "PE"
    ],
    "sentence": "We played basketball in our PE class today.",
    "sentenceZh": "我們今天在體育課打了籃球。",
    "sentence2": "We play soccer and run races in PE class.",
    "sentence2Zh": "我們在體育課上踢足球和進行跑步比賽。"
  },
  {
    "id": "elementary-art",
    "word": "art",
    "zh": "美勞/藝術/美術",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɑːrt/",
    "chunks": [
      "art"
    ],
    "sentence": "I like art class because I can draw animals.",
    "sentenceZh": "我喜歡美術課，因為可以畫動物。",
    "sentence2": "I drew a beautiful sunset during art class.",
    "sentence2Zh": "我在美術課畫了一幅美麗的夕陽。"
  },
  {
    "id": "elementary-draw",
    "word": "draw",
    "zh": "畫/繪製/拉",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/drɑː/",
    "chunks": [
      "draw"
    ],
    "sentence": "She loves to draw pictures of flowers and trees.",
    "sentenceZh": "她熱愛畫花草樹木的圖片。",
    "sentence2": "I want to draw a picture of my family.",
    "sentence2Zh": "我想畫一張我們全家人的畫。"
  },
  {
    "id": "elementary-math",
    "word": "math",
    "zh": "數學",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mæθ/",
    "chunks": [
      "math"
    ],
    "sentence": "We learned how to add numbers in math class.",
    "sentenceZh": "我們在數學課學習了如何做數字加法。",
    "sentence2": "Math is a very interesting subject that helps us think.",
    "sentence2Zh": "數學是一門非常有趣的學科，能幫助我們思考。"
  },
  {
    "id": "elementary-music",
    "word": "music",
    "zh": "音樂",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmjuː.zɪk/",
    "chunks": [
      "mu",
      "sic"
    ],
    "sentence": "We learned to play the recorder in music class.",
    "sentenceZh": "我們在音樂課學習了吹直笛。",
    "sentence2": "Listening to soft music makes me feel relaxed.",
    "sentence2Zh": "聽輕柔的音樂讓我感到放鬆。"
  },
  {
    "id": "elementary-english",
    "word": "English",
    "zh": "英文/英語/英國的",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɪŋ.ɡlɪʃ/",
    "chunks": [
      "Eng",
      "lish"
    ],
    "sentence": "We practice speaking English every day.",
    "sentenceZh": "我們每天練習說英語。",
    "sentence2": "This English book has many short stories.",
    "sentence2Zh": "這本英文書有許多短篇故事。"
  },
  {
    "id": "elementary-chinese",
    "word": "Chinese",
    "zh": "中文/漢語/中國人/中國的",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tʃaɪˈniːz/",
    "chunks": [
      "Chi",
      "nese"
    ],
    "sentence": "Chinese characters have a long history.",
    "sentenceZh": "中文字有悠久的歷史。",
    "sentence2": "We learn how to write Chinese characters.",
    "sentence2Zh": "我們學習如何寫中文字。"
  },
  {
    "id": "junior-ask",
    "word": "ask",
    "zh": "詢問/要求/問",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/æsk/",
    "chunks": [
      "ask"
    ],
    "sentence": "Do not be afraid to ask questions in class.",
    "sentenceZh": "在課堂上不要害怕發問。",
    "sentence2": "Please ask the teacher if you have any questions.",
    "sentence2Zh": "如果你有任何問題請詢問老師。"
  },
  {
    "id": "passport-answer",
    "word": "answer",
    "zh": "回答/答案/答覆",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈæn.sɚ/",
    "chunks": [
      "an",
      "swer"
    ],
    "sentence": "Who knows the correct answer to this question?",
    "sentenceZh": "誰知道這個問題的正確答案？",
    "sentence2": "She raised her hand to answer the English question.",
    "sentence2Zh": "她舉手回答英文問題。"
  },
  {
    "id": "junior-say",
    "word": "say",
    "zh": "說/講",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/seɪ/",
    "chunks": [
      "say"
    ],
    "sentence": "What did the teacher say about the homework?",
    "sentenceZh": "老師對作業說了些什麼？",
    "sentence2": "Please say your name clearly.",
    "sentence2Zh": "請清楚說出你的名字。"
  },
  {
    "id": "junior-speak",
    "word": "speak",
    "zh": "說話/演講/講(語言)",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/spiːk/",
    "chunks": [
      "speak"
    ],
    "sentence": "Our English teacher can speak three different languages.",
    "sentenceZh": "我們的英文老師會說三種不同的語言。",
    "sentence2": "Please speak English slowly so everyone can hear clearly.",
    "sentence2Zh": "請慢慢說英語，這樣大家才能聽得清楚。"
  },
  {
    "id": "junior-talk",
    "word": "talk",
    "zh": "談話/說話/交談",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tɑːk/",
    "chunks": [
      "talk"
    ],
    "sentence": "Please do not talk when the teacher is speaking.",
    "sentenceZh": "老師說話時請不要交談。",
    "sentence2": "We sat on the bench to talk about our weekend.",
    "sentence2Zh": "我們坐在長椅上聊我們的週末。"
  },
  {
    "id": "junior-spell",
    "word": "spell",
    "zh": "拼字/拼寫",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/spel/",
    "chunks": [
      "spell"
    ],
    "sentence": "Can you spell the word 'elephant' for me?",
    "sentenceZh": "你能幫我拚寫 'elephant' 這個字嗎？",
    "sentence2": "Can you show me how to spell the word elephant?",
    "sentence2Zh": "你能教我大象這個單字怎麼拼嗎？"
  },
  {
    "id": "junior-listen",
    "word": "listen",
    "zh": "聽/聆聽/聽從",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈlɪs.ən/",
    "chunks": [
      "lis",
      "ten"
    ],
    "sentence": "Listen carefully to the recording and write down answers.",
    "sentenceZh": "仔細聽錄音並寫下答案。",
    "sentence2": "We must listen carefully to our classmates' reports.",
    "sentence2Zh": "我們必須仔細聆聽同學的報告。"
  },
  {
    "id": "junior-study",
    "word": "study",
    "zh": "學習/研讀/書房",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈstʌd.i/",
    "chunks": [
      "study"
    ],
    "sentence": "We need to study hard for the English test.",
    "sentenceZh": "我們需要為英文考試努力學習。",
    "sentence2": "We study hard to prepare for the quiz tomorrow.",
    "sentence2Zh": "我們努力學習準備明天的測驗。"
  },
  {
    "id": "passport-test",
    "word": "test",
    "zh": "測試/考試",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/test/",
    "chunks": [
      "test"
    ],
    "sentence": "We have a spelling test every Friday morning.",
    "sentenceZh": "我們每個星期五早上都有拼字測驗。",
    "sentence2": "Do not worry about the test; just try your best.",
    "sentence2Zh": "不要擔心考試，盡力而為就好。"
  },
  {
    "id": "passport-question",
    "word": "question",
    "zh": "問題/詢問",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈkwes.tʃən/",
    "chunks": [
      "ques",
      "tion"
    ],
    "sentence": "If you have a question, please raise your hand.",
    "sentenceZh": "如果你有問題，請舉手。",
    "sentence2": "This is a good question that makes us think.",
    "sentence2Zh": "這是一個能讓我們思考的好問題。"
  },
  {
    "id": "passport-glue",
    "word": "glue",
    "zh": "膠水/黏貼",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡluː/",
    "chunks": [
      "glue"
    ],
    "sentence": "Use the glue to stick the picture onto paper.",
    "sentenceZh": "用膠水將圖片貼在紙上。",
    "sentence2": "Use a little glue to stick the picture on the card.",
    "sentence2Zh": "用一點膠水把圖片貼在卡片上。"
  },
  {
    "id": "elementary-pen",
    "word": "pen",
    "zh": "原子筆/筆",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pen/",
    "chunks": [
      "pen"
    ],
    "sentence": "Can I borrow a blue pen to write notes?",
    "sentenceZh": "我可以借一支藍色原子筆來寫筆記嗎？",
    "sentence2": "My teacher writes notes with a red ink pen.",
    "sentence2Zh": "我的老師用紅色原子筆寫評語。"
  },
  {
    "id": "elementary-marker",
    "word": "marker",
    "zh": "白板筆/麥克筆/標記",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmɑːr.kɚ/",
    "chunks": [
      "mark",
      "er"
    ],
    "sentence": "The teacher wrote the sentences with a black marker.",
    "sentenceZh": "老師用黑色麥克筆寫下了句子。",
    "sentence2": "She picked a green marker to write on the whiteboard.",
    "sentence2Zh": "她拿了一支綠色白板筆在白板上寫字。"
  },
  {
    "id": "junior-eraser",
    "word": "eraser",
    "zh": "橡皮擦",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɪˈreɪ.sɚ/",
    "chunks": [
      "eras",
      "er"
    ],
    "sentence": "I used my eraser to rub out the mistake.",
    "sentenceZh": "我用橡皮擦擦掉錯誤。",
    "sentence2": "My eraser is under the desk.",
    "sentence2Zh": "我的橡皮擦在桌子下面。"
  },
  {
    "id": "passport-paper",
    "word": "paper",
    "zh": "紙/報紙",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpeɪ.pɚ/",
    "chunks": [
      "pa",
      "per"
    ],
    "sentence": "He drew a beautiful map on a sheet of paper.",
    "sentenceZh": "他在一張紙上畫了一幅美麗的地圖。",
    "sentence2": "Please write down your thoughts on this sheet of paper.",
    "sentence2Zh": "請在這張紙上寫下你的想法。"
  },
  {
    "id": "elementary-ruler",
    "word": "ruler",
    "zh": "尺/統治者",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈruː.lɚ/",
    "chunks": [
      "ruler"
    ],
    "sentence": "Use a ruler to draw a straight line here.",
    "sentenceZh": "在這裡用直尺畫一條直線。",
    "sentence2": "We use a ruler to draw straight lines in math class.",
    "sentence2Zh": "我們在數學課上用尺來畫直線。"
  },
  {
    "id": "junior-friend",
    "word": "friend",
    "zh": "朋友",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/frend/",
    "chunks": [
      "friend"
    ],
    "sentence": "We should be friendly to our classmates and friends.",
    "sentenceZh": "我們應該對我們的同學和朋友友善。",
    "sentence2": "A good friend always helps you when you are in trouble.",
    "sentence2Zh": "好朋友總是在你遇到困難時幫助你。"
  },
  {
    "id": "passport-story",
    "word": "story",
    "zh": "故事/樓層",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈstɔːr.i/",
    "chunks": [
      "sto",
      "ry"
    ],
    "sentence": "My grandfather told us a funny story last night.",
    "sentenceZh": "我爺爺昨晚跟我們講了一個有趣的故事。",
    "sentence2": "My mom told me a wonderful story before I slept.",
    "sentence2Zh": "我睡前媽媽給我講了一個精采的故事。"
  },
  {
    "id": "junior-picture",
    "word": "picture",
    "zh": "圖畫/照片/影像",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpɪk.tʃɚ/",
    "chunks": [
      "pic",
      "ture"
    ],
    "sentence": "She hung a beautiful picture of a forest here.",
    "sentenceZh": "她在這裡掛了一幅美麗的森林圖畫。",
    "sentence2": "I took a beautiful picture of the green mountain.",
    "sentence2Zh": "我拍了一張美麗的綠色山景照片。"
  },
  {
    "id": "passport-blackboard",
    "word": "blackboard",
    "zh": "黑板",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈblæk.bɔːrd/",
    "chunks": [
      "black",
      "board"
    ],
    "sentence": "Please look at the blackboard and read the sentences.",
    "sentenceZh": "請看黑板並朗讀句子。",
    "sentence2": "He wiped the blackboard clean for the next teacher.",
    "sentence2Zh": "他把黑板擦乾淨，好給下一位老師使用。"
  },
  {
    "id": "passport-classroom",
    "word": "classroom",
    "zh": "教室",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈklæs.ruːm/",
    "chunks": [
      "class",
      "room"
    ],
    "sentence": "The students are cleaning their classroom after school today.",
    "sentenceZh": "學生們今天放學後正在打掃他們的教室。",
    "sentence2": "We decorated our classroom with colorful paintings.",
    "sentence2Zh": "我們用色彩繽紛的畫作裝飾教室。"
  },
  {
    "id": "passport-vacation",
    "word": "vacation",
    "zh": "假期/休假",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/veɪˈkeɪ.ʃən/",
    "chunks": [
      "va",
      "ca",
      "tion"
    ],
    "sentence": "We plan to go to the beach during summer vacation.",
    "sentenceZh": "我們計劃暑假期間去海灘。",
    "sentence2": "Our family plans to travel during summer vacation.",
    "sentence2Zh": "我們全家計劃在暑假期間去旅遊。"
  },
  {
    "id": "passport-holiday",
    "word": "holiday",
    "zh": "假日/節日",
    "topic": "School",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈhɑː.lə.deɪ/",
    "chunks": [
      "hol",
      "i",
      "day"
    ],
    "sentence": "Christmas is my favorite holiday of the year.",
    "sentenceZh": "聖誕節是我一年中最喜愛的節日。",
    "sentence2": "We rested at home during the national holiday.",
    "sentence2Zh": "國定假日期間，我們在家休息。"
  },
  {
    "id": "elementary-big",
    "word": "big",
    "zh": "大的/重大的",
    "topic": "Sizes & measurements",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bɪɡ/",
    "chunks": [
      "big"
    ],
    "sentence": "The elephant is a big animal with a long trunk.",
    "sentenceZh": "大象是有長鼻子的大型動物。",
    "sentence2": "A big elephant can carry heavy logs with its trunk.",
    "sentence2Zh": "大象能用長鼻子搬運沉重的木頭。"
  },
  {
    "id": "elementary-small",
    "word": "small",
    "zh": "小的/微弱的",
    "topic": "Sizes & measurements",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/smɑːl/",
    "chunks": [
      "small"
    ],
    "sentence": "A small ant is carrying a bread crumb slowly.",
    "sentenceZh": "一隻小螞蟻正在緩慢地搬運麵包屑。",
    "sentence2": "The small mouse ran quickly into a tiny hole.",
    "sentence2Zh": "小老鼠快速跑進了一個小洞裡。"
  },
  {
    "id": "elementary-long",
    "word": "long",
    "zh": "長期的/長的/渴望",
    "topic": "Sizes & measurements",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/lɑːŋ/",
    "chunks": [
      "long"
    ],
    "sentence": "Giraffes have a very long neck to eat leaves.",
    "sentenceZh": "長頸鹿有很長的脖子以吃樹葉。",
    "sentence2": "A giraffe has a very long neck to reach high leaves.",
    "sentence2Zh": "長頸鹿有著很長脖子來吃到高處的葉子。"
  },
  {
    "id": "passport-light",
    "word": "light",
    "zh": "輕的/明亮的/光線/點燃",
    "topic": "Sizes & measurements",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/laɪt/",
    "chunks": [
      "light"
    ],
    "sentence": "The feather is light, but the rock is heavy.",
    "sentenceZh": "羽毛很輕，但石頭很重。",
    "sentence2": "Sunlight filled the room with warm light.",
    "sentence2Zh": "陽光讓房間充滿溫暖的光線。"
  },
  {
    "id": "passport-high",
    "word": "high",
    "zh": "高的/高地/高度",
    "topic": "Sizes & measurements",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/haɪ/",
    "chunks": [
      "high"
    ],
    "sentence": "The eagle is flying high above the green mountains.",
    "sentenceZh": "老鷹正飛在高高的青山之上。",
    "sentence2": "The bird is flying high above the white clouds.",
    "sentence2Zh": "鳥在白雲高空飛翔。"
  },
  {
    "id": "passport-pair",
    "word": "pair",
    "zh": "一雙/一對",
    "topic": "Sizes & measurements",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/per/",
    "chunks": [
      "pair"
    ],
    "sentence": "He bought a new pair of sports shoes yesterday.",
    "sentenceZh": "他昨天買了一雙新運動鞋。",
    "sentence2": "I need a pair of scissors for art class.",
    "sentence2Zh": "美術課時，我需要一把剪刀。"
  },
  {
    "id": "elementary-play",
    "word": "play",
    "zh": "玩/打(球)/玩耍",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pleɪ/",
    "chunks": [
      "play"
    ],
    "sentence": "Children love to play games on the school playground.",
    "sentenceZh": "孩子們喜歡在學校操場上玩遊戲。",
    "sentence2": "The children play happily on the school swings.",
    "sentence2Zh": "孩子們在學校鞦韆上玩得很高興。"
  },
  {
    "id": "elementary-sing",
    "word": "sing",
    "zh": "唱歌/吟唱",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sɪŋ/",
    "chunks": [
      "sing"
    ],
    "sentence": "The students sing songs happily in the music class.",
    "sentenceZh": "學生們在音樂課上快樂地唱歌。",
    "sentence2": "My sister sings a sweet song for our grandmother.",
    "sentence2Zh": "我妹妹為我們的祖母唱了一首甜美的歌。"
  },
  {
    "id": "elementary-dance",
    "word": "dance",
    "zh": "跳舞/舞蹈",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dæns/",
    "chunks": [
      "dance"
    ],
    "sentence": "She likes to dance to the lively pop music.",
    "sentenceZh": "她喜歡隨著輕快的流行音樂跳舞。",
    "sentence2": "The children love to dance to the cheerful music.",
    "sentence2Zh": "孩子們很喜歡跟著輕快的音樂跳舞。"
  },
  {
    "id": "passport-paint",
    "word": "paint",
    "zh": "繪畫/油漆/顏料",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/peɪnt/",
    "chunks": [
      "paint"
    ],
    "sentence": "He wants to paint the bird cage yellow.",
    "sentenceZh": "他想把鳥籠漆成黃色。",
    "sentence2": "We use watercolor paint to make school posters.",
    "sentence2Zh": "我們用水彩顏料製作學校海報。"
  },
  {
    "id": "junior-hike",
    "word": "hike",
    "zh": "健行/徒步旅行",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/haɪk/",
    "chunks": [
      "hike"
    ],
    "sentence": "We love to hike in the mountains on sunny weekends.",
    "sentenceZh": "我們喜歡在晴朗的週末到山裡健行。",
    "sentence2": "Bring enough water for the long hike.",
    "sentence2Zh": "長途健行時要帶足夠的水。"
  },
  {
    "id": "elementary-swim",
    "word": "swim",
    "zh": "游泳",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/swɪm/",
    "chunks": [
      "swim"
    ],
    "sentence": "Polar bears can swim fast in the cold ocean.",
    "sentenceZh": "北極熊可以在寒冷的海洋中游得很快。",
    "sentence2": "We swim in the school pool during summer.",
    "sentence2Zh": "我們夏天在學校游泳池游泳。"
  },
  {
    "id": "passport-climb",
    "word": "climb",
    "zh": "攀爬/爬/攀登",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/klaɪm/",
    "chunks": [
      "climb"
    ],
    "sentence": "The monkeys like to climb trees and jump around.",
    "sentenceZh": "猴子們喜歡爬樹並跳來跳去。",
    "sentence2": "The clever monkey can climb trees very fast.",
    "sentence2Zh": "聰明的猴子爬樹可以爬得很快。"
  },
  {
    "id": "junior-ball",
    "word": "ball",
    "zh": "球",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bɑːl/",
    "chunks": [
      "ball"
    ],
    "sentence": "Throw the ball to me and I will catch it.",
    "sentenceZh": "把球丟給我，我會接住它。",
    "sentence2": "He kicked the ball straight into the goal.",
    "sentence2Zh": "他把球直接踢進了球門。"
  },
  {
    "id": "junior-baseball",
    "word": "baseball",
    "zh": "棒球/棒球運動",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈbeɪs.bɑːl/",
    "chunks": [
      "base",
      "ball"
    ],
    "sentence": "Baseball is one of the most popular sports in Taiwan.",
    "sentenceZh": "棒球是台灣最受歡迎的運動之一。",
    "sentence2": "We played baseball in the park yesterday afternoon.",
    "sentence2Zh": "我們昨天下午在公園打了棒球。"
  },
  {
    "id": "junior-basketball",
    "word": "basketball",
    "zh": "籃球/籃球運動",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈbæs.kət.bɑːl/",
    "chunks": [
      "bas",
      "ket",
      "ball"
    ],
    "sentence": "They practice playing basketball after school every Tuesday afternoon.",
    "sentenceZh": "他們每個星期二下午放學後練習打籃球。",
    "sentence2": "My brother trains hard to be a good basketball player.",
    "sentence2Zh": "我哥哥努力訓練想成為一名優秀的籃球員。"
  },
  {
    "id": "passport-football",
    "word": "football",
    "zh": "美式足球/足球",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfʊt.bɑːl/",
    "chunks": [
      "foot",
      "ball"
    ],
    "sentence": "In the UK, people call soccer football.",
    "sentenceZh": "在英國，人們把足球稱為 football。",
    "sentence2": "In the USA, football is played with an oval ball.",
    "sentence2Zh": "在美國，美式足球使用橢圓形的球。"
  },
  {
    "id": "passport-soccer",
    "word": "soccer",
    "zh": "足球",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsɑː.kɚ/",
    "chunks": [
      "soc",
      "cer"
    ],
    "sentence": "We have a friendly soccer game with another school.",
    "sentenceZh": "我們和另一所學校有一場友誼足球賽。",
    "sentence2": "We play soccer together on the school field during recess.",
    "sentence2Zh": "下課時間我們在學校操場上一起踢足球。"
  },
  {
    "id": "junior-sport",
    "word": "sport",
    "zh": "運動/體育活動",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/spɔːrt/",
    "chunks": [
      "sport"
    ],
    "sentence": "Running and swimming are good sports for our health.",
    "sentenceZh": "跑步和游泳是有益健康的運動。",
    "sentence2": "Running is a simple sport that keeps you healthy.",
    "sentence2Zh": "跑步是一項能讓你保持健康的簡單運動。"
  },
  {
    "id": "junior-toy",
    "word": "toy",
    "zh": "玩具/玩物",
    "topic": "Other nouns",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/tɔɪ/",
    "chunks": [
      "toy"
    ],
    "sentence": "He shared his new toy car with his little brother.",
    "sentenceZh": "他和弟弟分享了他的新玩具車。",
    "sentence2": "Please share your toys with your younger brother.",
    "sentence2Zh": "請和你的弟弟分享你的玩具。"
  },
  {
    "id": "passport-doll",
    "word": "doll",
    "zh": "洋娃娃/玩偶",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dɑːl/",
    "chunks": [
      "doll"
    ],
    "sentence": "My little sister put her cute doll to bed.",
    "sentenceZh": "我妹妹把她可愛的玩偶放上床睡覺。",
    "sentence2": "My sister likes to dress up her favorite doll.",
    "sentence2Zh": "我妹妹喜歡給她最喜愛的洋娃娃裝扮。"
  },
  {
    "id": "passport-yo-yo",
    "word": "yo-yo",
    "zh": "溜溜球",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈjoʊ.joʊ/",
    "chunks": [
      "yo",
      "yo"
    ],
    "sentence": "He showed us a cool trick with his red yo-yo.",
    "sentenceZh": "他用他的紅溜溜球向我們展示了一個炫酷的特技。",
    "sentence2": "My grandfather taught me a cool trick with the yo-yo.",
    "sentence2Zh": "我爺爺教了我一個很酷的溜溜球把戲。"
  },
  {
    "id": "passport-win",
    "word": "win",
    "zh": "贏得/獲勝",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɪn/",
    "chunks": [
      "win"
    ],
    "sentence": "Our school team hopes to win the soccer game.",
    "sentenceZh": "我們校隊希望能贏得這場足球賽。",
    "sentence2": "If we work together, we can win this game.",
    "sentence2Zh": "如果我們合作，我們就能贏得這場比賽。"
  },
  {
    "id": "passport-trip",
    "word": "trip",
    "zh": "旅行/旅程/跌倒",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/trɪp/",
    "chunks": [
      "trip"
    ],
    "sentence": "We are planning a short day trip to Yilan.",
    "sentenceZh": "我們正在計劃去宜蘭的短途一日遊。",
    "sentence2": "We had a wonderful family trip to Hualien last month.",
    "sentence2Zh": "上個月我們去花蓮進行了一次美好的家庭旅行。"
  },
  {
    "id": "junior-card",
    "word": "card",
    "zh": "卡片/紙牌",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kɑːrd/",
    "chunks": [
      "card"
    ],
    "sentence": "She sent a handmade birthday card to her teacher.",
    "sentenceZh": "她寄了一張手工製作的生日卡片給老師。",
    "sentence2": "I made a colorful card to wish my grandpa a happy birthday.",
    "sentence2Zh": "我做了一張彩色的卡片祝我爺爺生日快樂。"
  },
  {
    "id": "passport-drum",
    "word": "drum",
    "zh": "鼓/打鼓",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/drʌm/",
    "chunks": [
      "drum"
    ],
    "sentence": "He plays the drum loudly in the school band.",
    "sentenceZh": "他在學校樂隊裡大聲地敲鼓。",
    "sentence2": "He plays the drum in our school music band.",
    "sentence2Zh": "他在我們學校的管樂隊裡打鼓。"
  },
  {
    "id": "junior-game",
    "word": "game",
    "zh": "遊戲/比賽",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡeɪm/",
    "chunks": [
      "game"
    ],
    "sentence": "Let us play an interesting board game together tonight.",
    "sentenceZh": "我們今天晚上一起玩一個有趣的桌遊吧。",
    "sentence2": "We played a fun English spelling game in class today.",
    "sentence2Zh": "我們今天在課堂上玩了一個有趣的英文拼字遊戲。"
  },
  {
    "id": "passport-kite",
    "word": "kite",
    "zh": "風箏",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kaɪt/",
    "chunks": [
      "kite"
    ],
    "sentence": "A strong wind makes the colorful kite fly high.",
    "sentenceZh": "強風讓色彩繽紛的風箏飛得很高。",
    "sentence2": "A colorful kite is flying high in the blue sky.",
    "sentence2Zh": "一隻彩色的風箏在藍天中高飛。"
  },
  {
    "id": "junior-song",
    "word": "song",
    "zh": "歌曲/歌",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sɑːŋ/",
    "chunks": [
      "song"
    ],
    "sentence": "Let us sing a traditional English song together now.",
    "sentenceZh": "我們現在一起唱一首傳統的英文歌曲吧。",
    "sentence2": "Let's sing a happy song together to start class.",
    "sentence2Zh": "讓我們一起唱首快樂的歌開始上課。"
  },
  {
    "id": "passport-movie",
    "word": "movie",
    "zh": "電影",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmuː.vi/",
    "chunks": [
      "movie"
    ],
    "sentence": "We watched a funny animation movie last night.",
    "sentenceZh": "我們昨晚看了一部有趣的動畫電影。",
    "sentence2": "We watched a funny animation movie in the theater.",
    "sentence2Zh": "我們在電影院看了一部有趣的動畫電影。"
  },
  {
    "id": "passport-piano",
    "word": "piano",
    "zh": "鋼琴",
    "topic": "Sports",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/piˈæn.oʊ/",
    "chunks": [
      "pi",
      "ano"
    ],
    "sentence": "She practices playing the piano for one hour daily.",
    "sentenceZh": "她每天練習彈鋼琴一個小時。",
    "sentence2": "She practices the piano for one hour every evening.",
    "sentence2Zh": "她每天晚上練習彈鋼琴一個小時。"
  },
  {
    "id": "passport-cup",
    "word": "cup",
    "zh": "杯子/獎盃",
    "topic": "Tableware",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kʌp/",
    "chunks": [
      "cup"
    ],
    "sentence": "He drank a cup of warm water this morning.",
    "sentenceZh": "他今天早上喝了一杯溫開水。",
    "sentence2": "Would you like a cup of warm milk before bed?",
    "sentence2Zh": "睡前要來一杯溫牛奶嗎？"
  },
  {
    "id": "junior-dish",
    "word": "dish",
    "zh": "碟子/盤子/菜餚",
    "topic": "Tableware",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dɪʃ/",
    "chunks": [
      "dish"
    ],
    "sentence": "Please help me wash the dirty dishes after dinner.",
    "sentenceZh": "晚餐後請幫我清洗髒盤子。",
    "sentence2": "Please put your dish beside the sink after lunch.",
    "sentence2Zh": "午餐後請把餐盤放在水槽旁。"
  },
  {
    "id": "passport-glass",
    "word": "glass",
    "zh": "玻璃杯/玻璃/眼鏡(複數)",
    "topic": "Tableware",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡlæs/",
    "chunks": [
      "glass"
    ],
    "sentence": "A glass of fresh orange juice tastes very good.",
    "sentenceZh": "一杯新鮮的柳橙汁味道非常好。",
    "sentence2": "Please fill this glass with cold water, thank you.",
    "sentence2Zh": "請把這個玻璃杯裝滿冷水，謝謝。"
  },
  {
    "id": "passport-fork",
    "word": "fork",
    "zh": "叉子",
    "topic": "Tableware",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fɔːrk/",
    "chunks": [
      "fork"
    ],
    "sentence": "We use a fork and spoon to eat spaghetti.",
    "sentenceZh": "我們使用叉子和湯匙來吃義大利麵。",
    "sentence2": "We use a fork and a knife to eat steak.",
    "sentence2Zh": "我們用叉子和刀吃牛排。"
  },
  {
    "id": "passport-spoon",
    "word": "spoon",
    "zh": "湯匙/匙",
    "topic": "Tableware",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/spuːn/",
    "chunks": [
      "spoon"
    ],
    "sentence": "Give me a small spoon for the pudding.",
    "sentenceZh": "給我一支小湯匙吃布丁。",
    "sentence2": "Use a spoon to eat the pumpkin soup carefully.",
    "sentence2Zh": "用湯匙小心地喝南瓜湯。"
  },
  {
    "id": "passport-knife",
    "word": "knife",
    "zh": "刀子/餐刀",
    "topic": "Tableware",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/naɪf/",
    "chunks": [
      "knife"
    ],
    "sentence": "Be careful! Do not play with the sharp knife.",
    "sentenceZh": "小心！不要玩鋒利的刀子。",
    "sentence2": "Be careful, the kitchen knife is very sharp.",
    "sentence2Zh": "小心，這把菜刀非常鋒利。"
  },
  {
    "id": "passport-chopsticks",
    "word": "chopsticks",
    "zh": "筷子(複數)",
    "topic": "Tableware",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtʃɑːp.stɪks/",
    "chunks": [
      "chop",
      "sticks"
    ],
    "sentence": "In Taiwan, we use chopsticks to eat rice and noodles.",
    "sentenceZh": "在台灣，我們使用筷子來吃米飯和麵條。",
    "sentence2": "We usually use chopsticks to eat noodles for lunch.",
    "sentence2Zh": "我們午餐通常用筷子吃麵條。"
  },
  {
    "id": "passport-mug",
    "word": "mug",
    "zh": "馬克杯/大杯子",
    "topic": "Tableware",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mʌɡ/",
    "chunks": [
      "mug"
    ],
    "sentence": "Grandpa made a mug of hot coffee for himself.",
    "sentenceZh": "爺爺為自己泡了一大杯熱咖啡。",
    "sentence2": "My dad drinks coffee from his blue mug every morning.",
    "sentence2Zh": "我爸爸每天早上用藍色馬克杯喝咖啡。"
  },
  {
    "id": "junior-evening",
    "word": "evening",
    "zh": "傍晚/晚上",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈiːv.nɪŋ/",
    "chunks": [
      "evening"
    ],
    "sentence": "We usually do our homework in the early evening.",
    "sentenceZh": "我們通常在傍晚做功課。",
    "sentence2": "We gather in the living room to talk in the evening.",
    "sentence2Zh": "我們晚上在客廳聚集聊天。"
  },
  {
    "id": "junior-night",
    "word": "night",
    "zh": "夜晚/晚上",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/naɪt/",
    "chunks": [
      "night"
    ],
    "sentence": "The stars shine brightly in the dark sky at night.",
    "sentenceZh": "夜裡星星在黑暗的天空中明亮地照耀著。",
    "sentence2": "The moon shines brightly in the dark night sky.",
    "sentence2Zh": "月亮在黑夜的天空中明亮地照耀著。"
  },
  {
    "id": "junior-now",
    "word": "now",
    "zh": "現在/立刻",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/naʊ/",
    "chunks": [
      "now"
    ],
    "sentence": "Please come into the classroom and sit down now.",
    "sentenceZh": "現在請進教室坐好。",
    "sentence2": "It is time to go to school now.",
    "sentence2Zh": "現在是去學校的時候了。"
  },
  {
    "id": "junior-tomorrow",
    "word": "tomorrow",
    "zh": "明天",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/təˈmɑːr.oʊ/",
    "chunks": [
      "to",
      "mor",
      "row"
    ],
    "sentence": "Tomorrow is Sunday, so we do not go to school.",
    "sentenceZh": "明天是星期天，所以我們不上學。",
    "sentence2": "We will have a science experiment tomorrow morning.",
    "sentence2Zh": "我們明天早上有一堂自然科學實驗課。"
  },
  {
    "id": "junior-day",
    "word": "day",
    "zh": "白天/天/一日",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/deɪ/",
    "chunks": [
      "day"
    ],
    "sentence": "We went to the beach on a warm sunny day.",
    "sentenceZh": "我們在一個溫暖的晴天去了海灘。",
    "sentence2": "I hope you have a happy and wonderful day today.",
    "sentence2Zh": "我希望你今天度過快樂又美好的一天。"
  },
  {
    "id": "junior-yesterday",
    "word": "yesterday",
    "zh": "昨天",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈjes.tɚ.deɪ/",
    "chunks": [
      "yes",
      "ter",
      "day"
    ],
    "sentence": "I finished reading the whole book yesterday afternoon.",
    "sentenceZh": "我昨天下午讀完了整本書。",
    "sentence2": "We played basketball in the park yesterday afternoon.",
    "sentence2Zh": "我們昨天下午在公園打了籃球。"
  },
  {
    "id": "junior-early",
    "word": "early",
    "zh": "早的/早地/提早的",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɝː.li/",
    "chunks": [
      "ear",
      "ly"
    ],
    "sentence": "The diligent student always arrives at school very early.",
    "sentenceZh": "勤奮的學生總是早早就到學校。",
    "sentence2": "I wake up early in the morning to see the sunrise.",
    "sentence2Zh": "我清晨早起看日出。"
  },
  {
    "id": "junior-late",
    "word": "late",
    "zh": "晚的/遲的/晚地",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/leɪt/",
    "chunks": [
      "late"
    ],
    "sentence": "Hurry up! We are going to be late for class.",
    "sentenceZh": "快一點！我們上課要遲到了。",
    "sentence2": "Please hurry so we will not be late for the school bus.",
    "sentence2Zh": "請快一點，這樣我們才不會錯過校車。"
  },
  {
    "id": "elementary-time",
    "word": "time",
    "zh": "時間/次數",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/taɪm/",
    "chunks": [
      "time"
    ],
    "sentence": "What time does the school library open on weekdays?",
    "sentenceZh": "學校圖書館在工作日幾點開放？",
    "sentence2": "It is time to go to bed now. Good night!",
    "sentence2Zh": "現在是睡覺時間了。晚安！"
  },
  {
    "id": "elementary-watch",
    "word": "watch",
    "zh": "手錶/看/觀察/注意",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɑːtʃ/",
    "chunks": [
      "watch"
    ],
    "sentence": "My dad bought me a nice watch for my birthday.",
    "sentenceZh": "我爸爸買了一隻漂亮的手錶送我當生日禮物。",
    "sentence2": "My grandfather gave me a nice digital watch as a gift.",
    "sentence2Zh": "我爺爺送我一隻精美的手錶當作禮物。"
  },
  {
    "id": "junior-year",
    "word": "year",
    "zh": "年/年份",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/jɪr/",
    "chunks": [
      "year"
    ],
    "sentence": "We are looking forward to a wonderful new year.",
    "sentenceZh": "我們正期待著美好的一年。",
    "sentence2": "This school year is going to be full of fun learning.",
    "sentence2Zh": "這個學年將會充滿有趣的學習。"
  },
  {
    "id": "junior-clock",
    "word": "clock",
    "zh": "時鐘/鐘",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/klɑːk/",
    "chunks": [
      "clock"
    ],
    "sentence": "The clock on the wall shows eight o'clock.",
    "sentenceZh": "牆上的時鐘顯示八點鐘。",
    "sentence2": "Our classroom clock is five minutes fast.",
    "sentence2Zh": "我們教室的時鐘快五分鐘。"
  },
  {
    "id": "elementary-o-clock",
    "word": "o'clock",
    "zh": "點鐘",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/əˈklɑːk/",
    "chunks": [
      "o'",
      "clock"
    ],
    "sentence": "The school sports day starts at nine o'clock sharp.",
    "sentenceZh": "學校運動會在九點整準時開始。",
    "sentence2": "We have an English lesson at nine o'clock today.",
    "sentence2Zh": "我們今天九點鐘有一堂英文課。"
  },
  {
    "id": "junior-spring",
    "word": "spring",
    "zh": "春天/泉水/彈簧",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sprɪŋ/",
    "chunks": [
      "spring"
    ],
    "sentence": "Many flowers bloom in spring.",
    "sentenceZh": "許多花朵在春天盛開。",
    "sentence2": "Clean water flows from the mountain spring.",
    "sentence2Zh": "乾淨的水從山泉流出。"
  },
  {
    "id": "junior-summer",
    "word": "summer",
    "zh": "夏天/夏季",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsʌm.ɚ/",
    "chunks": [
      "sum",
      "mer"
    ],
    "sentence": "We love to eat cold watermelon in the hot summer.",
    "sentenceZh": "我們在炎熱的夏天熱愛吃冰西瓜。",
    "sentence2": "Summer is hot, and we love to eat cold ice cream.",
    "sentence2Zh": "夏天很熱，我們很喜歡吃冰涼的冰淇淋。"
  },
  {
    "id": "junior-fall",
    "word": "fall",
    "zh": "落下/跌倒/秋天/降臨",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fɑːl/",
    "chunks": [
      "fall"
    ],
    "sentence": "Leaves turn yellow and fall from trees in autumn.",
    "sentenceZh": "秋天時葉子變黃並從樹上落下。",
    "sentence2": "Watch your step so you do not fall on the wet grass.",
    "sentence2Zh": "看好你的腳步，才不會在濕草地上跌倒。"
  },
  {
    "id": "junior-winter",
    "word": "winter",
    "zh": "冬天/冬季",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwɪn.tɚ/",
    "chunks": [
      "win",
      "ter"
    ],
    "sentence": "It is very cold and sometimes snows in winter.",
    "sentenceZh": "冬天非常冷，有時候還會下雪。",
    "sentence2": "It gets very cold in winter, so we wear warm coats.",
    "sentence2Zh": "冬天的天氣變得很冷，所以我們穿溫暖的外套。"
  },
  {
    "id": "passport-season",
    "word": "season",
    "zh": "季節",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsiː.zən/",
    "chunks": [
      "sea",
      "son"
    ],
    "sentence": "My favorite season is autumn.",
    "sentenceZh": "我最喜歡的季節是秋天。",
    "sentence2": "Winter is the coldest season of the year.",
    "sentence2Zh": "冬天是一年中最寒冷的季節。"
  },
  {
    "id": "junior-monday",
    "word": "Monday",
    "zh": "星期一",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmʌn.deɪ/",
    "chunks": [
      "Mon",
      "day"
    ],
    "sentence": "Monday is the first school day of the week.",
    "sentenceZh": "星期一是這一週的第一個上學日。",
    "sentence2": "We sing the school song together on Monday morning.",
    "sentence2Zh": "我們在星期一早上一起唱校歌。"
  },
  {
    "id": "junior-tuesday",
    "word": "Tuesday",
    "zh": "星期二",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtuːz.deɪ/",
    "chunks": [
      "Tues",
      "day"
    ],
    "sentence": "We have a music class every Tuesday afternoon.",
    "sentenceZh": "我們每個星期二下午有一節音樂課。",
    "sentence2": "We have a PE lesson and play soccer on Tuesday.",
    "sentence2Zh": "我們在星期二有一堂體育課並踢足球。"
  },
  {
    "id": "junior-wednesday",
    "word": "Wednesday",
    "zh": "星期三",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwenz.deɪ/",
    "chunks": [
      "Wednes",
      "day"
    ],
    "sentence": "Wednesday afternoon is our club time.",
    "sentenceZh": "星期三下午是我們的社團時間。",
    "sentence2": "We return our library books on Wednesday.",
    "sentence2Zh": "我們星期三歸還圖書館的書。"
  },
  {
    "id": "junior-thursday",
    "word": "Thursday",
    "zh": "星期四",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈθɝːz.deɪ/",
    "chunks": [
      "Thurs",
      "day"
    ],
    "sentence": "We will visit the science museum next Thursday morning.",
    "sentenceZh": "我們下星期四早上將造訪自然科學博物館。",
    "sentence2": "I borrow new storybooks from the library on Thursday.",
    "sentence2Zh": "我星期四在圖書館借新的故事書。"
  },
  {
    "id": "junior-friday",
    "word": "Friday",
    "zh": "星期五",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfraɪ.deɪ/",
    "chunks": [
      "Fri",
      "day"
    ],
    "sentence": "Friday is the last school day before the weekend.",
    "sentenceZh": "星期五是週末前的最後一個上學日。",
    "sentence2": "Friday is my favorite day because the weekend is near.",
    "sentence2Zh": "星期五是我最喜歡的一天，因為週末快到了。"
  },
  {
    "id": "junior-saturday",
    "word": "Saturday",
    "zh": "星期六",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsæt̬.ɚ.deɪ/",
    "chunks": [
      "Sat",
      "ur",
      "day"
    ],
    "sentence": "I like to go hiking with my family on Saturday.",
    "sentenceZh": "我星期六喜歡和家人一起去健行。",
    "sentence2": "I love to eat hot pancakes on Saturday morning.",
    "sentence2Zh": "我喜歡在星期六早上吃熱鬆餅。"
  },
  {
    "id": "junior-sunday",
    "word": "Sunday",
    "zh": "星期日",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsʌn.deɪ/",
    "chunks": [
      "Sun",
      "day"
    ],
    "sentence": "Sunday is a holiday, and we can rest at home.",
    "sentenceZh": "星期天是假日，我們可以留在家裡休息。",
    "sentence2": "We go hiking on the mountain with family on Sunday.",
    "sentence2Zh": "我們星期日和家人一起去山上健行。"
  },
  {
    "id": "junior-week",
    "word": "week",
    "zh": "星期/週",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wiːk/",
    "chunks": [
      "week"
    ],
    "sentence": "There are seven days in a week.",
    "sentenceZh": "一星期有七天。",
    "sentence2": "We have music class twice a week.",
    "sentence2Zh": "我們每週上兩次音樂課。"
  },
  {
    "id": "passport-january",
    "word": "January",
    "zh": "一月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdʒæn.ju.er.i/",
    "chunks": [
      "Jan",
      "u",
      "ary"
    ],
    "sentence": "January is the very first month of the year.",
    "sentenceZh": "一月是一年當中的第一個月份。",
    "sentence2": "January first is the beginning of a new year.",
    "sentence2Zh": "一月一日是一年的開始。"
  },
  {
    "id": "passport-february",
    "word": "February",
    "zh": "二月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfeb.ru.er.i/",
    "chunks": [
      "Feb",
      "ru",
      "ary"
    ],
    "sentence": "February usually has twenty-eight days in a year.",
    "sentenceZh": "二月份在一年中通常只有二十八天。",
    "sentence2": "February is the second and shortest month of the year.",
    "sentence2Zh": "二月是一年中第二個也是最短的月份。"
  },
  {
    "id": "passport-march",
    "word": "March",
    "zh": "三月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mɑːrtʃ/",
    "chunks": [
      "March"
    ],
    "sentence": "The weather starts to turn warm in March here.",
    "sentenceZh": "這裡的天氣在三月份開始轉暖。",
    "sentence2": "Spring usually starts to arrive in March.",
    "sentence2Zh": "春天通常在三月份開始到來。"
  },
  {
    "id": "passport-april",
    "word": "April",
    "zh": "四月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈeɪ.prəl/",
    "chunks": [
      "April"
    ],
    "sentence": "April showers bring beautiful flowers in spring.",
    "sentenceZh": "四月的雨水在春天帶來了美麗的花朵。",
    "sentence2": "My cousin has a birthday party in April.",
    "sentence2Zh": "我表弟/表妹在四月舉辦生日派對。"
  },
  {
    "id": "passport-may",
    "word": "May",
    "zh": "可能/可以/五月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/meɪ/",
    "chunks": [
      "May"
    ],
    "sentence": "Mother's Day is celebrated on the second Sunday of May.",
    "sentenceZh": "母親節在五月的第二個星期日慶祝。",
    "sentence2": "May I borrow your green marker for my painting?",
    "sentence2Zh": "我畫畫可以借你的綠色白板筆嗎？"
  },
  {
    "id": "passport-june",
    "word": "June",
    "zh": "六月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dʒuːn/",
    "chunks": [
      "June"
    ],
    "sentence": "Summer vacation usually begins in late June.",
    "sentenceZh": "暑假通常在六月下旬開始。",
    "sentence2": "The school year ends in June.",
    "sentence2Zh": "學年在六月結束。"
  },
  {
    "id": "passport-july",
    "word": "July",
    "zh": "七月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dʒuˈlaɪ/",
    "chunks": [
      "Ju",
      "ly"
    ],
    "sentence": "July is a very hot month of the summer holiday.",
    "sentenceZh": "七月是暑假中一個非常炎熱的月份。",
    "sentence2": "It is hot in July, and we go swimming.",
    "sentence2Zh": "七月天氣很熱，我們去游泳。"
  },
  {
    "id": "passport-august",
    "word": "August",
    "zh": "八月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɑːˈɡʌst/",
    "chunks": [
      "Au",
      "gust"
    ],
    "sentence": "Father's Day in Taiwan is on the eighth of August.",
    "sentenceZh": "台灣的父親節是在八月八日。",
    "sentence2": "August is the last month of our summer vacation.",
    "sentence2Zh": "八月是我們暑假的最後一個月。"
  },
  {
    "id": "passport-september",
    "word": "September",
    "zh": "九月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sepˈtem.bɚ/",
    "chunks": [
      "Sep",
      "tem",
      "ber"
    ],
    "sentence": "Students go back to school in September in Taiwan.",
    "sentenceZh": "台灣的學生在九月份返校上課。",
    "sentence2": "We go back to school in September to meet our friends.",
    "sentence2Zh": "我們在九月回學校和朋友見面。"
  },
  {
    "id": "passport-october",
    "word": "October",
    "zh": "十月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɑːkˈtoʊ.bɚ/",
    "chunks": [
      "Oc",
      "to",
      "ber"
    ],
    "sentence": "Halloween is on the last day of October.",
    "sentenceZh": "萬聖節在十月的最後一天。",
    "sentence2": "The weather becomes cooler in October.",
    "sentence2Zh": "十月時天氣變得比較涼爽。"
  },
  {
    "id": "passport-november",
    "word": "November",
    "zh": "十一月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/noʊˈvem.bɚ/",
    "chunks": [
      "No",
      "vem",
      "ber"
    ],
    "sentence": "The weather turns cool and pleasant in November.",
    "sentenceZh": "天氣在十一月份變得涼爽宜人。",
    "sentence2": "The weather gets cool in November in Taiwan.",
    "sentence2Zh": "台灣在十一月時天氣變涼。"
  },
  {
    "id": "passport-december",
    "word": "December",
    "zh": "十二月",
    "topic": "Time",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/dɪˈsem.bɚ/",
    "chunks": [
      "De",
      "cem",
      "ber"
    ],
    "sentence": "Christmas is celebrated on the twenty-fifth of December.",
    "sentenceZh": "聖誕節在十二月二十五日慶祝。",
    "sentence2": "We decorate the classroom for Christmas in December.",
    "sentence2Zh": "我們在十二月裝飾教室準備過耶誕節。"
  },
  {
    "id": "elementary-ride",
    "word": "ride",
    "zh": "騎(馬、車等)",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/raɪd/",
    "chunks": [
      "ride"
    ],
    "sentence": "I want to learn how to ride a bike.",
    "sentenceZh": "我想學習如何騎腳踏車。",
    "sentence2": "My sister likes to ride her kick scooter in the park.",
    "sentence2Zh": "我妹妹喜歡在公園裡騎她的滑板車。"
  },
  {
    "id": "elementary-fly",
    "word": "fly",
    "zh": "飛/飛行/蒼蠅",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/flaɪ/",
    "chunks": [
      "fly"
    ],
    "sentence": "Many birds fly to warm places in winter.",
    "sentenceZh": "許多鳥在冬天飛往溫暖的地方。",
    "sentence2": "A big airplane can fly high above the white clouds.",
    "sentence2Zh": "大飛機可以在白雲高空飛行。"
  },
  {
    "id": "junior-drive",
    "word": "drive",
    "zh": "駕駛/開車",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/draɪv/",
    "chunks": [
      "drive"
    ],
    "sentence": "My mother drives a blue car to work daily.",
    "sentenceZh": "我媽媽每天開著藍色車子去上班。",
    "sentence2": "Please drive slowly when you pass the school gate.",
    "sentence2Zh": "路過校門口時請減速慢行/慢速駕駛。"
  },
  {
    "id": "junior-turn",
    "word": "turn",
    "zh": "轉彎/轉動/輪流",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tɝːn/",
    "chunks": [
      "turn"
    ],
    "sentence": "Please turn right when you see the post office.",
    "sentenceZh": "當你看到郵局時請右轉。",
    "sentence2": "It is your turn to answer the English question now.",
    "sentence2Zh": "現在輪到你回答英文問題了。"
  },
  {
    "id": "elementary-car",
    "word": "car",
    "zh": "車子/汽車",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kɑːr/",
    "chunks": [
      "car"
    ],
    "sentence": "My father parked the red car near our house.",
    "sentenceZh": "我爸爸把紅色的車子停在我們家附近。",
    "sentence2": "My parents bought a new green car last month.",
    "sentence2Zh": "我父母上個月買了一輛綠色的新車。"
  },
  {
    "id": "elementary-bus",
    "word": "bus",
    "zh": "公車/巴士",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bʌs/",
    "chunks": [
      "bus"
    ],
    "sentence": "We take the school bus to school every morning.",
    "sentenceZh": "我們每天早上搭校車去上學。",
    "sentence2": "We must stand in line to get on the school bus.",
    "sentence2Zh": "我們必須排隊搭乘校車。"
  },
  {
    "id": "passport-bus-stop",
    "word": "bus stop",
    "zh": "公車站/公車站牌",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈbʌs ˌstɑːp/",
    "chunks": [
      "bus",
      "stop"
    ],
    "sentence": "The students are waiting patiently at the bus stop.",
    "sentenceZh": "學生們正在公車站耐心等待。",
    "sentence2": "The bus stop is just a few steps away from our house.",
    "sentence2Zh": "公車站離我們家只有幾步之遙。"
  },
  {
    "id": "junior-taxi",
    "word": "taxi",
    "zh": "計程車",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtæk.si/",
    "chunks": [
      "taxi"
    ],
    "sentence": "We took a taxi because we were very late.",
    "sentenceZh": "我們搭了計程車，因為我們遲到了。",
    "sentence2": "The yellow taxi stopped in front of the train station.",
    "sentence2Zh": "黃色的計程車停在火車站前。"
  },
  {
    "id": "passport-airport",
    "word": "airport",
    "zh": "機場",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈer.pɔːrt/",
    "chunks": [
      "air",
      "port"
    ],
    "sentence": "The airplane landed safely at Taoyuan Airport.",
    "sentenceZh": "飛機安全降落在桃園機場。",
    "sentence2": "We went to the airport to welcome our grandfather.",
    "sentence2Zh": "我們去機場迎接爺爺。"
  },
  {
    "id": "passport-ship",
    "word": "ship",
    "zh": "船(大型)",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʃɪp/",
    "chunks": [
      "ship"
    ],
    "sentence": "A large cargo ship is sailing across the ocean.",
    "sentenceZh": "一艘大型貨輪正在橫渡大洋。",
    "sentence2": "A giant cruise ship is resting in the quiet harbor.",
    "sentence2Zh": "一艘巨型郵輪停泊在安靜的港口。"
  },
  {
    "id": "junior-boat",
    "word": "boat",
    "zh": "小船/船",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/boʊt/",
    "chunks": [
      "boat"
    ],
    "sentence": "We rowed a small wooden boat across the lake.",
    "sentenceZh": "我們划著一艘木製小船穿過湖面。",
    "sentence2": "My grandpa owns a small fishing boat.",
    "sentence2Zh": "我爺爺有一艘小漁船。"
  },
  {
    "id": "junior-station",
    "word": "station",
    "zh": "車站/站/局",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsteɪ.ʃən/",
    "chunks": [
      "sta",
      "tion"
    ],
    "sentence": "The train arrived at the station on time.",
    "sentenceZh": "火車準時抵達了車站。",
    "sentence2": "We met our friends at the bus station this morning.",
    "sentence2Zh": "我們今天早上在公車站和朋友見面。"
  },
  {
    "id": "passport-motorcycle",
    "word": "motorcycle",
    "zh": "機車/摩托車",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmoʊ.t̬ɚˌsaɪ.kəl/",
    "chunks": [
      "mo",
      "tor",
      "cy",
      "cle"
    ],
    "sentence": "Riding a motorcycle is common in Taiwan.",
    "sentenceZh": "在臺灣騎機車很普遍。",
    "sentence2": "My father wears a safe helmet when he rides his motorcycle.",
    "sentence2Zh": "我爸爸騎機車時會戴安全帽。"
  },
  {
    "id": "passport-mrt",
    "word": "MRT",
    "zh": "捷運",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˌem.ɑːr.ˈtiː/",
    "chunks": [
      "MRT"
    ],
    "sentence": "The Taipei MRT is very clean and convenient.",
    "sentenceZh": "台北捷運非常乾淨且方便。",
    "sentence2": "Taking the MRT is a safe way to travel around the city.",
    "sentence2Zh": "搭乘捷運是在城市裡旅遊的安全方式。"
  },
  {
    "id": "junior-scooter",
    "word": "scooter",
    "zh": "機車/滑板車",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈskuː.t̬ɚ/",
    "chunks": [
      "scoot",
      "er"
    ],
    "sentence": "She rides a motor scooter to the market.",
    "sentenceZh": "她騎機車去市場。",
    "sentence2": "The child rides a pink kick scooter in the park.",
    "sentence2Zh": "那個孩子在公園裡騎粉紅色滑板車。"
  },
  {
    "id": "junior-fast",
    "word": "fast",
    "zh": "快的/快地",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fæst/",
    "chunks": [
      "fast"
    ],
    "sentence": "Cheetahs can run very fast.",
    "sentenceZh": "獵豹可以跑得非常快。",
    "sentence2": "If you walk fast, you can catch up with the group.",
    "sentence2Zh": "如果你走得快，就能趕上隊伍。"
  },
  {
    "id": "passport-slow",
    "word": "slow",
    "zh": "慢的/緩慢的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sloʊ/",
    "chunks": [
      "slow"
    ],
    "sentence": "The slow turtle finally finished the long race.",
    "sentenceZh": "慢吞吞的烏龜終於完成了這場長途比賽。",
    "sentence2": "The slow train stops at every station along the way.",
    "sentence2Zh": "這慢車沿途在每個車站都停靠。"
  },
  {
    "id": "passport-truck",
    "word": "truck",
    "zh": "卡車/貨車",
    "topic": "Transportation",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/trʌk/",
    "chunks": [
      "truck"
    ],
    "sentence": "A large blue truck is carrying heavy boxes.",
    "sentenceZh": "一輛藍色大卡車正載運著重重的箱子。",
    "sentence2": "The farmer filled the truck with sweet pumpkins.",
    "sentence2Zh": "農夫在卡車上裝滿了甜南瓜。"
  },
  {
    "id": "junior-weather",
    "word": "weather",
    "zh": "天氣",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈweð.ɚ/",
    "chunks": [
      "weath",
      "er"
    ],
    "sentence": "What is the weather like in New York today?",
    "sentenceZh": "今天紐約的天氣怎麼樣？",
    "sentence2": "The warm weather is perfect for playing soccer outdoors.",
    "sentence2Zh": "溫暖的天氣非常適合在戶外踢足球。"
  },
  {
    "id": "passport-sky",
    "word": "sky",
    "zh": "天空",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/skaɪ/",
    "chunks": [
      "sky"
    ],
    "sentence": "The sky is clear and full of bright stars.",
    "sentenceZh": "天空非常清朗，而且佈滿了明亮的星星。",
    "sentence2": "The blue sky has no clouds at all this morning.",
    "sentence2Zh": "今天早上蔚藍的天空一點雲也沒有。"
  },
  {
    "id": "passport-sun",
    "word": "sun",
    "zh": "太陽",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sʌn/",
    "chunks": [
      "sun"
    ],
    "sentence": "The sun is shining brightly in the sky today.",
    "sentenceZh": "今天太陽在天空中明亮地照耀著。",
    "sentence2": "The warm sun keeps us comfortable during winter.",
    "sentence2Zh": "溫暖的太陽讓我們在冬天感到舒服。"
  },
  {
    "id": "passport-star",
    "word": "star",
    "zh": "星星/明星",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/stɑːr/",
    "chunks": [
      "star"
    ],
    "sentence": "A bright star is shining in the night sky.",
    "sentenceZh": "一顆明亮的星星在夜空中閃耀。",
    "sentence2": "She got a gold star on her homework.",
    "sentence2Zh": "她的作業得到了一顆金星。"
  },
  {
    "id": "passport-wind",
    "word": "wind",
    "zh": "風",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɪnd/",
    "chunks": [
      "wind"
    ],
    "sentence": "The strong wind blew away my favorite paper hat.",
    "sentenceZh": "強風吹走了我最愛的紙帽子。",
    "sentence2": "The cold wind started to blow in the late afternoon.",
    "sentence2Zh": "傍晚時分，冷風開始吹了起來。"
  },
  {
    "id": "junior-windy",
    "word": "windy",
    "zh": "風大的/多風的",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwɪn.di/",
    "chunks": [
      "windy"
    ],
    "sentence": "It is very windy today, so let us fly kites.",
    "sentenceZh": "今天風很大，我們去放風箏吧。",
    "sentence2": "Hold your hat on a windy day so it doesn't fly away.",
    "sentence2Zh": "在有風的日子拉好帽子，以免它被吹走。"
  },
  {
    "id": "passport-typhoon",
    "word": "typhoon",
    "zh": "颱風",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/taɪˈfuːn/",
    "chunks": [
      "ty",
      "phoon"
    ],
    "sentence": "Schools were closed yesterday because of the strong typhoon.",
    "sentenceZh": "學校昨天因為強烈颱風停課。",
    "sentence2": "We stayed safe inside our house during the typhoon.",
    "sentence2Zh": "颱風期間我們安全地待在屋子裡。"
  },
  {
    "id": "junior-rain",
    "word": "rain",
    "zh": "雨/下雨",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/reɪ/",
    "chunks": [
      "rain"
    ],
    "sentence": "I love the fresh smell of grass after rain.",
    "sentenceZh": "我喜歡雨後草地清新的味道。",
    "sentence2": "The grass needs rain to grow green and fresh.",
    "sentence2Zh": "草地需要雨水來生長得又綠又鮮嫩。"
  },
  {
    "id": "passport-rainbow",
    "word": "rainbow",
    "zh": "彩虹",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈreɪn.boʊ/",
    "chunks": [
      "rain",
      "bow"
    ],
    "sentence": "A colorful rainbow appeared in the sky after rain.",
    "sentenceZh": "雨後天空出現了一道色彩繽紛的彩虹。",
    "sentence2": "Let's draw a beautiful seven-color rainbow on the card.",
    "sentence2Zh": "我們在卡片上畫一道美麗的七彩彩虹吧。"
  },
  {
    "id": "passport-snow",
    "word": "snow",
    "zh": "雪/下雪",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/snoʊ/",
    "chunks": [
      "snow"
    ],
    "sentence": "The white snow covered the mountains like a blanket.",
    "sentenceZh": "白雪像毯子一樣覆蓋了山脈。",
    "sentence2": "It is fun to make a round snowman in the snow.",
    "sentence2Zh": "在雪中做一個圓圓的雪人很有趣。"
  },
  {
    "id": "junior-snowy",
    "word": "snowy",
    "zh": "下雪的/多雪的",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsnoʊ.i/",
    "chunks": [
      "snowy"
    ],
    "sentence": "We wore warm gloves on that cold snowy day.",
    "sentenceZh": "我們在那個寒冷的下雪天戴了溫暖的手套。",
    "sentence2": "The mountains turned white on a cold snowy morning.",
    "sentence2Zh": "在一個寒冷下雪的早上，山脈變白了。"
  },
  {
    "id": "junior-wet",
    "word": "wet",
    "zh": "濕的/潮濕的",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wet/",
    "chunks": [
      "wet"
    ],
    "sentence": "My shoes got completely wet in the heavy rain.",
    "sentenceZh": "我的鞋子在大雨中完全濕透了。",
    "sentence2": "Use a towel to wipe your wet hands before lunch.",
    "sentence2Zh": "午餐前用毛巾擦乾你濕漉漉的手。"
  },
  {
    "id": "junior-cloudy",
    "word": "cloudy",
    "zh": "多雲的/陰天的",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈklaʊ.di/",
    "chunks": [
      "cloudy"
    ],
    "sentence": "It is cloudy today, so the sun is hidden.",
    "sentenceZh": "今天是陰天，所以太陽躲起來了。",
    "sentence2": "We can go for a walk since it is cloudy and cool.",
    "sentence2Zh": "因為天氣多雲涼爽，我們可以出去散步。"
  },
  {
    "id": "elementary-hot",
    "word": "hot",
    "zh": "熱的/辣的",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hɑːt/",
    "chunks": [
      "hot"
    ],
    "sentence": "Drink plenty of water on hot summer days.",
    "sentenceZh": "炎熱的夏日要喝充足的水。",
    "sentence2": "Be careful because the soup is hot.",
    "sentence2Zh": "小心，因為湯很燙。"
  },
  {
    "id": "elementary-warm",
    "word": "warm",
    "zh": "溫暖的/使溫暖",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɔːrm/",
    "chunks": [
      "warm"
    ],
    "sentence": "The spring weather is very warm and pleasant here.",
    "sentenceZh": "這裡春天的天氣非常溫暖且宜人。",
    "sentence2": "The mother bird keeps her baby chicks warm in the nest.",
    "sentence2Zh": "母鳥在鳥巢裡為牠的小雞保暖。"
  },
  {
    "id": "elementary-cool",
    "word": "cool",
    "zh": "涼爽的/酷的",
    "topic": "Weather",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kuːl/",
    "chunks": [
      "cool"
    ],
    "sentence": "The autumn breeze is very cool and refreshing.",
    "sentenceZh": "秋天的微風非常涼爽而且提神。",
    "sentence2": "His new bicycle looks really cool and fast.",
    "sentence2Zh": "他的新自行車看起來真的很酷、很快。"
  },
  {
    "id": "elementary-a",
    "word": "a",
    "zh": "一個/一種",
    "topic": "Articles",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/eɪ/",
    "chunks": [
      "a"
    ],
    "sentence": "I saw a small squirrel eating a nut yesterday.",
    "sentenceZh": "我昨天看到一隻小松鼠在吃堅果。",
    "sentence2": "I have a friendly puppy that loves to chase balls.",
    "sentence2Zh": "我有一隻很喜歡追球的友善小狗。"
  },
  {
    "id": "elementary-an",
    "word": "an",
    "zh": "一個/一種(加母音開頭)",
    "topic": "Articles",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/æn/",
    "chunks": [
      "an"
    ],
    "sentence": "She brought an orange and an apple for lunch.",
    "sentenceZh": "她帶了一個橘子和一個蘋果當午餐。",
    "sentence2": "She shared an orange with her brother after lunch.",
    "sentence2Zh": "她午餐後和她哥哥分享了一顆柳橙。"
  },
  {
    "id": "junior-every",
    "word": "every",
    "zh": "每個/每一的",
    "topic": "Articles",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈev.ri/",
    "chunks": [
      "ev",
      "ery"
    ],
    "sentence": "He practices speaking English every single day.",
    "sentenceZh": "他每一天都練習說英文。",
    "sentence2": "We should drink water every day to keep healthy.",
    "sentence2Zh": "我們應該每天喝水來保持健康。"
  },
  {
    "id": "elementary-the",
    "word": "the",
    "zh": "這/那/這些/那些",
    "topic": "Articles",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðə/",
    "chunks": [
      "the"
    ],
    "sentence": "The dog in the garden belongs to our neighbor.",
    "sentenceZh": "花園裡的那隻狗是我們鄰居的。",
    "sentence2": "The sky looks very clear and bright tonight.",
    "sentence2Zh": "今天晚上的天空看起來非常清朗且明亮。"
  },
  {
    "id": "elementary-this",
    "word": "this",
    "zh": "這/這個",
    "topic": "Articles",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðɪs/",
    "chunks": [
      "this"
    ],
    "sentence": "This storybook is very interesting and has nice pictures.",
    "sentenceZh": "這本故事書非常有趣，而且有漂亮的圖片。",
    "sentence2": "This English book belongs to the school library.",
    "sentence2Zh": "這本英文書屬於學校圖書館。"
  },
  {
    "id": "elementary-that",
    "word": "that",
    "zh": "那/那個",
    "topic": "Articles",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðæt/",
    "chunks": [
      "that"
    ],
    "sentence": "That tall tree in the park is a banyan.",
    "sentenceZh": "公園裡那棵高大的樹是一棵榕樹。",
    "sentence2": "That big black dog over there is very friendly.",
    "sentence2Zh": "那邊那隻黑大狗非常友善。"
  },
  {
    "id": "passport-those",
    "word": "those",
    "zh": "那些",
    "topic": "Articles",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðoʊz/",
    "chunks": [
      "those"
    ],
    "sentence": "Those sweet grapes in the kitchen are for you.",
    "sentenceZh": "廚房裡的那些甜葡萄是給你的。",
    "sentence2": "Those tall trees in the yard block the hot sun.",
    "sentence2Zh": "院子裡那些高大樹木遮擋了烈日。"
  },
  {
    "id": "passport-these",
    "word": "these",
    "zh": "這些",
    "topic": "Articles",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðiːz/",
    "chunks": [
      "these"
    ],
    "sentence": "These colorful markers on the desk are mine.",
    "sentenceZh": "書桌上的這些彩色麥克筆是我的。",
    "sentence2": "These crayons are for you to paint your drawing.",
    "sentence2Zh": "這些蠟筆是給你畫畫上色用的。"
  },
  {
    "id": "elementary-i",
    "word": "I",
    "zh": "我(主格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/aɪ/",
    "chunks": [
      "I"
    ],
    "sentence": "I want to learn how to play the piano.",
    "sentenceZh": "我想學習如何彈鋼琴。",
    "sentence2": "I love reading interesting stories before bed.",
    "sentence2Zh": "我喜歡在睡前閱讀有趣的故事。"
  },
  {
    "id": "elementary-he",
    "word": "he",
    "zh": "他(主格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hiː/",
    "chunks": [
      "he"
    ],
    "sentence": "He is the tallest boy on our school team.",
    "sentenceZh": "他是我們校隊裡最高的男孩。",
    "sentence2": "He is my best friend at Xingang Elementary School.",
    "sentence2Zh": "他是我在新港國小最好的朋友。"
  },
  {
    "id": "elementary-she",
    "word": "she",
    "zh": "她(主格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʃiː/",
    "chunks": [
      "she"
    ],
    "sentence": "She wrote a beautiful poem for her kind mother.",
    "sentenceZh": "她為她親切的母親寫了一首美麗的詩。",
    "sentence2": "She draws beautiful pictures of flowers in her book.",
    "sentence2Zh": "她在書上畫了美麗的花朵圖畫。"
  },
  {
    "id": "junior-me",
    "word": "me",
    "zh": "我(受格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/miː/",
    "chunks": [
      "me"
    ],
    "sentence": "Please give me the English book on the table.",
    "sentenceZh": "請把桌上的英文書給我。",
    "sentence2": "Please show me how to write this English word.",
    "sentence2Zh": "請教我怎麼寫這個英文單字。"
  },
  {
    "id": "passport-him",
    "word": "him",
    "zh": "他(受格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hɪm/",
    "chunks": [
      "him"
    ],
    "sentence": "I sent him an email about the party.",
    "sentenceZh": "我寄了一封關於派對的電子郵件給他。",
    "sentence2": "I saw him playing basketball in the playground.",
    "sentence2Zh": "我看到他在操場上打籃球。"
  },
  {
    "id": "junior-her",
    "word": "her",
    "zh": "她(受格)/她的(所有格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hɝː/",
    "chunks": [
      "her"
    ],
    "sentence": "We gave her a birthday gift.",
    "sentenceZh": "我們送給她一份生日禮物。",
    "sentence2": "Her mother works at the hospital.",
    "sentence2Zh": "她的媽媽在醫院工作。"
  },
  {
    "id": "elementary-you",
    "word": "you",
    "zh": "你/你們(主格/受格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/juː/",
    "chunks": [
      "you"
    ],
    "sentence": "You should wash your hands before eating dinner.",
    "sentenceZh": "你在吃晚餐前應該要洗手。",
    "sentence2": "You did a wonderful job on your math quiz today.",
    "sentence2Zh": "你今天的數學小考做得非常好。"
  },
  {
    "id": "junior-we",
    "word": "we",
    "zh": "我們(主格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wiː/",
    "chunks": [
      "we"
    ],
    "sentence": "We walked to the park and played games together.",
    "sentenceZh": "我們走路去公園並一起玩遊戲。",
    "sentence2": "We clean our classroom together after school.",
    "sentence2Zh": "我們放學後一起打掃教室。"
  },
  {
    "id": "junior-us",
    "word": "us",
    "zh": "我們(受格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʌs/",
    "chunks": [
      "us"
    ],
    "sentence": "The teacher read us an interesting story in class.",
    "sentenceZh": "老師在課堂上給我們讀了一個有趣的故事。",
    "sentence2": "The English teacher gave us some colorful stickers.",
    "sentence2Zh": "英文老師給了我們一些彩色的貼紙。"
  },
  {
    "id": "elementary-it",
    "word": "it",
    "zh": "牠/它(主格/受格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɪt/",
    "chunks": [
      "it"
    ],
    "sentence": "The cat is sleeping, so please do not wake it.",
    "sentenceZh": "貓咪正在睡覺，所以請不要喚醒牠。",
    "sentence2": "I bought a new toy car and it is very fast.",
    "sentence2Zh": "我買了一輛新玩具車，它跑得非常快。"
  },
  {
    "id": "passport-they",
    "word": "they",
    "zh": "他們/她們/它們(主格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðeɪ/",
    "chunks": [
      "they"
    ],
    "sentence": "They went to the library to study together yesterday.",
    "sentenceZh": "他們昨天去圖書館一起學習。",
    "sentence2": "They run happily on the school grass field.",
    "sentence2Zh": "他們在學校的草地上快樂地奔跑。"
  },
  {
    "id": "junior-them",
    "word": "them",
    "zh": "他們/她們/它們(受格)",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðem/",
    "chunks": [
      "them"
    ],
    "sentence": "We invited them to join our English club tomorrow.",
    "sentenceZh": "我們邀請他們明天加入我們的英文社團。",
    "sentence2": "Please tell them to clean up their study desks.",
    "sentence2Zh": "請告訴他們整理好他們的書桌。"
  },
  {
    "id": "passport-nothing",
    "word": "nothing",
    "zh": "沒有什麼/無事/無物",
    "topic": "Pronouns",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈnʌθ.ɪŋ/",
    "chunks": [
      "noth",
      "ing"
    ],
    "sentence": "There is nothing in the box; it is empty.",
    "sentenceZh": "箱子裡什麼都沒有，它是空的。",
    "sentence2": "There is nothing inside the small gift box.",
    "sentence2Zh": "小禮物盒裡什麼也沒有。"
  },
  {
    "id": "junior-be",
    "word": "be",
    "zh": "是/在/存在",
    "topic": "Be & Auxiliaries",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/biː/",
    "chunks": [
      "be"
    ],
    "sentence": "Please be quiet when the teacher is speaking.",
    "sentenceZh": "老師說話時請保持安靜。",
    "sentence2": "Try to be a helpful student in your class.",
    "sentence2Zh": "試著在班上當一名樂於助人的學生。"
  },
  {
    "id": "elementary-do",
    "word": "do",
    "zh": "做/助動詞",
    "topic": "Be & Auxiliaries",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/duː/",
    "chunks": [
      "do"
    ],
    "sentence": "What do you want to do after class today?",
    "sentenceZh": "你今天下課後想要做什麼？",
    "sentence2": "Please do your homework before playing games.",
    "sentence2Zh": "玩遊戲前請先做完功課。"
  },
  {
    "id": "elementary-can",
    "word": "can",
    "zh": "能/會/罐頭/可以",
    "topic": "Be & Auxiliaries",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kæn/",
    "chunks": [
      "can"
    ],
    "sentence": "I can play the recorder well now.",
    "sentenceZh": "我現在會把直笛吹得很好。",
    "sentence2": "Can I borrow your green marker?",
    "sentence2Zh": "我可以借你的綠色麥克筆嗎？"
  },
  {
    "id": "junior-will",
    "word": "will",
    "zh": "將/會/意志",
    "topic": "Be & Auxiliaries",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɪl/",
    "chunks": [
      "will"
    ],
    "sentence": "I will go to the zoo with my family.",
    "sentenceZh": "我將會和我的家人一起去動物園。",
    "sentence2": "I will show you my new storybook tomorrow.",
    "sentence2Zh": "我明天會展示我的新故事書給你看。"
  },
  {
    "id": "junior-and",
    "word": "and",
    "zh": "和/並且",
    "topic": "Conjunctions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ænd/",
    "chunks": [
      "and"
    ],
    "sentence": "I bought a blue pen and a red pencil.",
    "sentenceZh": "我買了一支藍色筆和一支紅色鉛筆。",
    "sentence2": "My sister and I draw pictures together on weekends.",
    "sentence2Zh": "我妹妹和我週末一起畫畫。"
  },
  {
    "id": "junior-but",
    "word": "but",
    "zh": "但是/然而",
    "topic": "Conjunctions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bʌt/",
    "chunks": [
      "but"
    ],
    "sentence": "He ran fast but still missed the school bus.",
    "sentenceZh": "他跑得很快，但還是錯過了校車。",
    "sentence2": "He tried hard but could not solve the math problem.",
    "sentence2Zh": "他很努力，但是無法解出這道數學題。"
  },
  {
    "id": "passport-because",
    "word": "because",
    "zh": "因為",
    "topic": "Conjunctions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bɪˈkəz/",
    "chunks": [
      "be",
      "cause"
    ],
    "sentence": "We stayed home because it was raining heavily.",
    "sentenceZh": "我們待在家裡，因為雨下得很大。",
    "sentence2": "I went to bed early because I felt tired.",
    "sentence2Zh": "我很早睡覺，因為覺得累了。"
  },
  {
    "id": "passport-hi",
    "word": "hi",
    "zh": "嗨/你好",
    "topic": "Interjections",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/haɪ/",
    "chunks": [
      "hi"
    ],
    "sentence": "Hi, Tim! How are you doing today?",
    "sentenceZh": "嗨，提姆！你今天好嗎？",
    "sentence2": "Hi, how are you doing in school today?",
    "sentence2Zh": "嗨，你今天在學校過得怎麼樣？"
  },
  {
    "id": "passport-hello",
    "word": "hello",
    "zh": "你好/哈囉",
    "topic": "Interjections",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/həˈloʊ/",
    "chunks": [
      "hel",
      "lo"
    ],
    "sentence": "Say hello to your grandparents when you see them.",
    "sentenceZh": "看到爺爺奶奶時要跟他們問好。",
    "sentence2": "Say hello to our new classmate with a smile.",
    "sentence2Zh": "用微笑跟我們的新同學說你好。"
  },
  {
    "id": "junior-please",
    "word": "please",
    "zh": "請/使高興",
    "topic": "Interjections",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pliːz/",
    "chunks": [
      "please"
    ],
    "sentence": "Please pass me the salt on the dining table.",
    "sentenceZh": "請把餐桌上的鹽遞給我。",
    "sentence2": "Please show me the way to the school gym.",
    "sentence2Zh": "請指引我去學校體育館的路。"
  },
  {
    "id": "passport-excuse-me",
    "word": "excuse me",
    "zh": "不好意思/請原諒我",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɪkˈskjuːz ˌmiː/",
    "chunks": [
      "ex",
      "cuse",
      "me"
    ],
    "sentence": "Excuse me, where is the nearest MRT station?",
    "sentenceZh": "不好意思，請問最近的捷運站在哪裡？",
    "sentence2": "Excuse me, could you please repeat the English sentence?",
    "sentence2Zh": "不好意思，可以請您再重複一次英文句子嗎？"
  },
  {
    "id": "elementary-at",
    "word": "at",
    "zh": "在...地方/在...時刻",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/æt/",
    "chunks": [
      "at"
    ],
    "sentence": "We arrived at the zoo at ten o'clock.",
    "sentenceZh": "我們在十點鐘抵達了動物園。",
    "sentence2": "We eat our lunch together at noon.",
    "sentence2Zh": "我們在中午一起吃午餐。"
  },
  {
    "id": "elementary-in",
    "word": "in",
    "zh": "在...裡面",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɪn/",
    "chunks": [
      "in"
    ],
    "sentence": "The keys are in the pocket of my coat.",
    "sentenceZh": "鑰匙在我大衣的口袋裡。",
    "sentence2": "There are three pencils and an eraser in my box.",
    "sentence2Zh": "我的鉛筆盒裡有三支鉛筆和一個橡皮擦。"
  },
  {
    "id": "passport-of",
    "word": "of",
    "zh": "的/屬於/關於",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʌv/",
    "chunks": [
      "of"
    ],
    "sentence": "The color of the school bag is navy blue.",
    "sentenceZh": "書包的顏色是深藍色。",
    "sentence2": "She is the class leader of our fifth-grade class.",
    "sentence2Zh": "她是我們五年級班上的班長。"
  },
  {
    "id": "passport-out",
    "word": "out",
    "zh": "在外面/出/離",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/aʊt/",
    "chunks": [
      "out"
    ],
    "sentence": "He looked out the window and saw a bird.",
    "sentenceZh": "他向窗外看，看到一隻鳥。",
    "sentence2": "The students ran out to play during recess.",
    "sentence2Zh": "學生下課時跑出去玩。"
  },
  {
    "id": "junior-for",
    "word": "for",
    "zh": "為了/給/適合/因為",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fɔːr/",
    "chunks": [
      "for"
    ],
    "sentence": "This blue bicycle is a birthday gift for you.",
    "sentenceZh": "這輛藍色腳踏車是送給你的生日禮物。",
    "sentence2": "I made this card for my sister's birthday.",
    "sentence2Zh": "我做這張卡片是為了我妹妹的生日。"
  },
  {
    "id": "passport-near",
    "word": "near",
    "zh": "靠近/在...附近",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/nɪr/",
    "chunks": [
      "near"
    ],
    "sentence": "The convenience store is located near our school.",
    "sentenceZh": "這家便利商店位於我們學校附近。",
    "sentence2": "Our school is near the public library and the park.",
    "sentence2Zh": "我們學校在公共圖書館和公園附近。"
  },
  {
    "id": "junior-by",
    "word": "by",
    "zh": "藉由/在...旁邊/被",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/baɪ/",
    "chunks": [
      "by"
    ],
    "sentence": "We went to the beautiful beach by train yesterday.",
    "sentenceZh": "我們昨天坐火車去美麗的海灘。",
    "sentence2": "He goes to school by school bus every morning.",
    "sentence2Zh": "他每天早上搭乘校車上學。"
  },
  {
    "id": "elementary-on",
    "word": "on",
    "zh": "在...上面/在...之時",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɑːn/",
    "chunks": [
      "on"
    ],
    "sentence": "The book is on the desk next to the computer.",
    "sentenceZh": "書在電腦旁邊的桌上。",
    "sentence2": "Please put your homework on my desk.",
    "sentence2Zh": "請把你的作業放在我的桌上。"
  },
  {
    "id": "passport-behind",
    "word": "behind",
    "zh": "在...後面",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bɪˈhaɪnd/",
    "chunks": [
      "be",
      "hind"
    ],
    "sentence": "The cat is hiding behind the bedroom door.",
    "sentenceZh": "貓咪正躲在臥室門的後面。",
    "sentence2": "The little cat is sleeping behind the sofa.",
    "sentence2Zh": "小貓咪正在沙發後面睡覺。"
  },
  {
    "id": "junior-from",
    "word": "from",
    "zh": "來自/從",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/frʌm/",
    "chunks": [
      "from"
    ],
    "sentence": "Where are you from, Taiwan or the USA?",
    "sentenceZh": "你來自哪裡，台灣還是美國？",
    "sentence2": "This fresh red apple comes from a local orchard.",
    "sentence2Zh": "這顆新鮮的紅蘋果來自當地的果園。"
  },
  {
    "id": "passport-off",
    "word": "off",
    "zh": "離開/脫落/關掉",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɑːf/",
    "chunks": [
      "off"
    ],
    "sentence": "Remember to turn off the lights before you leave.",
    "sentenceZh": "離開前記得關燈。",
    "sentence2": "Please get off the bus at the next stop.",
    "sentence2Zh": "請在下一站下公車。"
  },
  {
    "id": "passport-to",
    "word": "to",
    "zh": "向/往/給/到",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tuː/",
    "chunks": [
      "to"
    ],
    "sentence": "I walked to the library to borrow some books.",
    "sentenceZh": "我走路去圖書館借一些書。",
    "sentence2": "We listen carefully to the English teacher.",
    "sentence2Zh": "我們仔細聆聽英文老師說話。"
  },
  {
    "id": "passport-up",
    "word": "up",
    "zh": "向上/往上",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʌp/",
    "chunks": [
      "up"
    ],
    "sentence": "Look up at the stars in the sky.",
    "sentenceZh": "抬頭看看天空中的星星。",
    "sentence2": "Hold up your hand if you know the answer.",
    "sentence2Zh": "如果知道答案，請舉手。"
  },
  {
    "id": "passport-over",
    "word": "over",
    "zh": "在...上方/越過/結束",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈoʊ.vɚ/",
    "chunks": [
      "over"
    ],
    "sentence": "The white bird is flying over the calm lake.",
    "sentenceZh": "那隻白鳥正飛越平靜的湖面上方。",
    "sentence2": "The class is over, and we can go to play soccer.",
    "sentence2Zh": "下課了，我們可以去踢足球。"
  },
  {
    "id": "junior-than",
    "word": "than",
    "zh": "比/比較",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðæn/",
    "chunks": [
      "than"
    ],
    "sentence": "An elephant is much bigger than a tiger.",
    "sentenceZh": "大象比老虎大得多。",
    "sentence2": "An elephant is much bigger than a horse.",
    "sentence2Zh": "大象比馬大得多。"
  },
  {
    "id": "junior-with",
    "word": "with",
    "zh": "與...一起/具有/用",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɪð/",
    "chunks": [
      "with"
    ],
    "sentence": "I went to the library with my classmates yesterday.",
    "sentenceZh": "我昨天和同學們一起去圖書館。",
    "sentence2": "We write the new English sentences with a pencil.",
    "sentence2Zh": "我們用鉛筆寫下新的英文句子。"
  },
  {
    "id": "elementary-under",
    "word": "under",
    "zh": "在...下面",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈʌn.dɚ/",
    "chunks": [
      "un",
      "der"
    ],
    "sentence": "The small puppy is sleeping under the wooden chair.",
    "sentenceZh": "小狗正在木椅下面睡覺。",
    "sentence2": "A sleepy puppy is resting under the table.",
    "sentence2Zh": "一隻想睡的小狗正在桌子下面休息。"
  },
  {
    "id": "junior-next-to",
    "word": "next to",
    "zh": "在...旁邊/緊鄰",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/nekst tuː/",
    "chunks": [
      "next",
      "to"
    ],
    "sentence": "The school bookstore is next to the post office.",
    "sentenceZh": "學校書店在郵局旁邊。",
    "sentence2": "Tim sits next to me in the English class.",
    "sentence2Zh": "提姆在英文課上坐在我旁邊。"
  },
  {
    "id": "junior-about",
    "word": "about",
    "zh": "關於/大約",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/əˈbaʊt/",
    "chunks": [
      "about"
    ],
    "sentence": "She told us an interesting story about a brave monkey.",
    "sentenceZh": "她跟我們講了一個關於勇敢猴子的有趣故事。",
    "sentence2": "This story is about a brave little dog and a cat.",
    "sentence2Zh": "這個故事是關於一隻勇敢的小狗和貓咪。"
  },
  {
    "id": "passport-inside",
    "word": "inside",
    "zh": "在...裡面/內部",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɪnˈsaɪd/",
    "chunks": [
      "in",
      "side"
    ],
    "sentence": "It is raining, so please play inside the classroom.",
    "sentenceZh": "外面在下雨，所以請在教室裡面玩。",
    "sentence2": "We stayed inside our house during the heavy typhoon.",
    "sentence2Zh": "強颱風期間我們待在屋子裡。"
  },
  {
    "id": "passport-outside",
    "word": "outside",
    "zh": "在...外面/外部",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/aʊtˈsaɪd/",
    "chunks": [
      "out",
      "side"
    ],
    "sentence": "The children are playing tag outside the house.",
    "sentenceZh": "孩子們正在房子外面玩捉人遊戲。",
    "sentence2": "Let's play basketball outside on this sunny day.",
    "sentence2Zh": "在這個晴天，我們去外面打籃球吧。"
  },
  {
    "id": "junior-after",
    "word": "after",
    "zh": "在...之後",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈæf.tɚ/",
    "chunks": [
      "af",
      "ter"
    ],
    "sentence": "Remember to wash your hands after using the restroom.",
    "sentenceZh": "上完廁所後記得洗手。",
    "sentence2": "We wash our hands after playing soccer.",
    "sentence2Zh": "我們踢完足球後會洗手。"
  },
  {
    "id": "junior-front",
    "word": "front",
    "zh": "前面/前方的/鋒面",
    "topic": "Prepositions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/frʌnt/",
    "chunks": [
      "front"
    ],
    "sentence": "The bus stop is right in front of our school gate.",
    "sentenceZh": "公車站就在我們學校大門口前面。",
    "sentence2": "A cold front is coming, so the weather will turn chilly.",
    "sentence2Zh": "冷鋒即將到來，所以天氣會變涼。"
  },
  {
    "id": "elementary-box",
    "word": "box",
    "zh": "盒子/箱子",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/bɑːks/",
    "chunks": [
      "box"
    ],
    "sentence": "He put all his colorful markers into the wooden box.",
    "sentenceZh": "他把所有彩色麥克筆放進木箱裡。",
    "sentence2": "I keep my red crayons inside this wooden box.",
    "sentence2Zh": "我把紅色蠟筆收在這個木盒裡。"
  },
  {
    "id": "passport-bottle",
    "word": "bottle",
    "zh": "瓶子",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈbɑː.t̬əl/",
    "chunks": [
      "bot",
      "tle"
    ],
    "sentence": "Please bring a bottle of water to the playground.",
    "sentenceZh": "請帶一瓶水去操場。",
    "sentence2": "Bring a bottle of warm water with you to school.",
    "sentence2Zh": "帶一瓶溫水去學校。"
  },
  {
    "id": "junior-gift",
    "word": "gift",
    "zh": "禮物/天賦",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡɪft/",
    "chunks": [
      "gift"
    ],
    "sentence": "This beautiful drawing is a birthday gift for my mom.",
    "sentenceZh": "這幅美麗的圖畫是送給我媽媽的生日禮物。",
    "sentence2": "I made a pretty card to go with the birthday gift.",
    "sentence2Zh": "我做了一張漂亮的卡片來搭配生日禮物。"
  },
  {
    "id": "passport-mail",
    "word": "mail",
    "zh": "信件/寄信/郵件",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/meɪl/",
    "chunks": [
      "mail"
    ],
    "sentence": "Did we receive any mail or packages this morning?",
    "sentenceZh": "我們今天早上有收到任何信件或包裹嗎？",
    "sentence2": "The mailman delivered some mail to my grandparents.",
    "sentence2Zh": "郵差送了一些信件給我祖父母。"
  },
  {
    "id": "passport-email",
    "word": "email",
    "zh": "電子郵件/發電子郵件",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈiː.meɪl/",
    "chunks": [
      "email"
    ],
    "sentence": "I sent an email to invite my cousin to our house.",
    "sentenceZh": "我寄了一封電子郵件邀請我表哥來我們家。",
    "sentence2": "My sister sent an email to thank her English teacher.",
    "sentence2Zh": "我妹妹發了一封電子郵件來感謝她的英文老師。"
  },
  {
    "id": "junior-tree",
    "word": "tree",
    "zh": "樹/樹木",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/triː/",
    "chunks": [
      "tree"
    ],
    "sentence": "The boys are climbing the big banyan tree in the park.",
    "sentenceZh": "男孩們正在爬公園裡的大榕樹。",
    "sentence2": "A small bird built its nest in the tall tree.",
    "sentence2Zh": "一隻小鳥在樹上建造了牠的巢。"
  },
  {
    "id": "passport-way",
    "word": "way",
    "zh": "路/方法/方向",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/weɪ/",
    "chunks": [
      "way"
    ],
    "sentence": "Excuse me, which is the correct way to the train station?",
    "sentenceZh": "不好意思，請問哪一條是去火車站的路？",
    "sentence2": "Do you know the way to the public library?",
    "sentence2Zh": "你知道去公共圖書館的路嗎？"
  },
  {
    "id": "passport-word",
    "word": "word",
    "zh": "字/單字/詞",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɝːd/",
    "chunks": [
      "word"
    ],
    "sentence": "Try to write a new sentence with this English word.",
    "sentenceZh": "嘗試用這個英文單字寫一個新句子。",
    "sentence2": "We must practice spelling these new English words.",
    "sentence2Zh": "我們必須練習拼寫這些新的英文單字。"
  },
  {
    "id": "passport-sale",
    "word": "sale",
    "zh": "特賣/拍賣/出售",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/seɪl/",
    "chunks": [
      "sale"
    ],
    "sentence": "Those toys are on sale today.",
    "sentenceZh": "那些玩具今天特價。",
    "sentence2": "This bookstore has a big book sale today.",
    "sentence2Zh": "這家書店今天舉辦圖書大特賣。"
  },
  {
    "id": "junior-fun",
    "word": "fun",
    "zh": "樂趣/有趣的/好玩的",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fʌn/",
    "chunks": [
      "fun"
    ],
    "sentence": "Playing card games with friends is always full of fun.",
    "sentenceZh": "和朋友一起玩卡牌遊戲總是充滿樂趣。",
    "sentence2": "Playing board games with family is very fun.",
    "sentence2Zh": "和家人一起玩桌遊非常有趣。"
  },
  {
    "id": "passport-thing",
    "word": "thing",
    "zh": "東西/事物/事情",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/θɪŋ/",
    "chunks": [
      "thing"
    ],
    "sentence": "Please put your personal things into your school bag.",
    "sentenceZh": "請把你的個人東西放進你的書包裡。",
    "sentence2": "Sharing is a good thing that makes us happy.",
    "sentence2Zh": "分享是一件會讓我們快樂的好事。"
  },
  {
    "id": "passport-ticket",
    "word": "ticket",
    "zh": "票/券/罰單",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈtɪk.ɪt/",
    "chunks": [
      "tick",
      "et"
    ],
    "sentence": "We need to buy a train ticket to go to Hualien.",
    "sentenceZh": "我們需要買一張火車票去花蓮。",
    "sentence2": "My father bought three train tickets to Hualien.",
    "sentence2Zh": "我爸爸買了三張去花蓮的火車票。"
  },
  {
    "id": "passport-dream",
    "word": "dream",
    "zh": "夢/夢想/做夢",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/driːm/",
    "chunks": [
      "dream"
    ],
    "sentence": "I had a funny dream about flying in the sky last night.",
    "sentenceZh": "我昨晚做了一個關於在天空中飛翔的有趣夢境。",
    "sentence2": "My dream is to become a helpful doctor.",
    "sentence2Zh": "我的夢想是成為一名樂於助人的醫生。"
  },
  {
    "id": "junior-party",
    "word": "party",
    "zh": "派對/宴會/黨派",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈpɑːr.t̬i/",
    "chunks": [
      "par",
      "ty"
    ],
    "sentence": "All the students wore funny hats to the birthday party.",
    "sentenceZh": "所有的學生都戴著有趣的帽子去參加生日派對。",
    "sentence2": "We decorated the classroom for our Christmas party.",
    "sentence2Zh": "我們為聖誕派對裝飾了教室。"
  },
  {
    "id": "passport-photo",
    "word": "photo",
    "zh": "照片/相片",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfoʊ.t̬oʊ/",
    "chunks": [
      "pho",
      "to"
    ],
    "sentence": "He showed me a group photo of his family.",
    "sentenceZh": "他向我展示了一張他家人的合照。",
    "sentence2": "I took a nice photo of the orange sunset.",
    "sentence2Zh": "我拍了一張美麗的橘色日落照片。"
  },
  {
    "id": "passport-robot",
    "word": "robot",
    "zh": "機器人",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈroʊ.bɑːt/",
    "chunks": [
      "ro",
      "bot"
    ],
    "sentence": "He built a robot with LEGO bricks yesterday.",
    "sentenceZh": "他昨天用樂高積木組裝了一個機器人。",
    "sentence2": "He loves to build toy robots with plastic blocks.",
    "sentence2Zh": "他喜歡用塑膠積木建造玩具機器人。"
  },
  {
    "id": "junior-flower",
    "word": "flower",
    "zh": "花/花朵/開花",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈflaʊ.ɚ/",
    "chunks": [
      "flow",
      "er"
    ],
    "sentence": "A yellow flower is growing beside the wall.",
    "sentenceZh": "牆邊長著一朵黃花。",
    "sentence2": "A busy bee is visiting a colorful flower.",
    "sentence2Zh": "一隻忙碌的蜜蜂正在一朵彩色花朵上採蜜。"
  },
  {
    "id": "junior-cellphone",
    "word": "cellphone",
    "zh": "手機/行動電話",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsel.foʊn/",
    "chunks": [
      "cell",
      "phone"
    ],
    "sentence": "Please turn off your cellphone before the test starts.",
    "sentenceZh": "請在考試開始前關閉手機。",
    "sentence2": "Please ask for permission before using your parents' cellphone.",
    "sentence2Zh": "使用父母的手機前請先詢問許可。"
  },
  {
    "id": "junior-birthday",
    "word": "birthday",
    "zh": "生日",
    "topic": "Other",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈbɝːθ.deɪ/",
    "chunks": [
      "birth",
      "day"
    ],
    "sentence": "What gift do you want for your tenth birthday?",
    "sentenceZh": "你十歲生日想要什麼禮物？",
    "sentence2": "We sang a birthday song to our grandmother.",
    "sentence2Zh": "我們為祖母唱了生日歌。"
  },
  {
    "id": "elementary-go",
    "word": "go",
    "zh": "去/前進/出發",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡoʊ/",
    "chunks": [
      "go"
    ],
    "sentence": "We will go for a hike in Yangmingshan this weekend.",
    "sentenceZh": "我們這週末要去陽明山健行。",
    "sentence2": "Let's go to the school library to borrow books.",
    "sentence2Zh": "我們去學校圖書館借書吧。"
  },
  {
    "id": "junior-get",
    "word": "get",
    "zh": "得到/獲得/到達/拿到",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡet/",
    "chunks": [
      "get"
    ],
    "sentence": "I hope you can get good grades on the test.",
    "sentenceZh": "我希望你考試能取得好成績。",
    "sentence2": "Did you get a gold star on your homework today?",
    "sentence2Zh": "你今天的作業有得到金星獎章嗎？"
  },
  {
    "id": "passport-cry",
    "word": "cry",
    "zh": "哭/哭泣/叫喊",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kraɪ/",
    "chunks": [
      "cry"
    ],
    "sentence": "The baby started to cry because he was hungry.",
    "sentenceZh": "嬰兒因為肚子餓而開始哭。",
    "sentence2": "The baby stopped crying when his mother held him.",
    "sentence2Zh": "媽媽抱起嬰兒時，他停止了哭泣。"
  },
  {
    "id": "junior-hit",
    "word": "hit",
    "zh": "打/擊中/打擊",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hɪt/",
    "chunks": [
      "hit"
    ],
    "sentence": "He hit the baseball with his new bat yesterday.",
    "sentenceZh": "他昨天用他的新球棒擊中了棒球。",
    "sentence2": "Benson hit the baseball far into the grass field.",
    "sentence2Zh": "班森把棒球遠遠地擊入草地裡。"
  },
  {
    "id": "junior-put",
    "word": "put",
    "zh": "放置/擺放",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pʊt/",
    "chunks": [
      "put"
    ],
    "sentence": "Please put the dirty clothes into the laundry basket.",
    "sentenceZh": "請把髒衣服放進洗衣籃裡。",
    "sentence2": "Please put your English books back into your schoolbag.",
    "sentence2Zh": "請把你的英文書放回書包裡。"
  },
  {
    "id": "elementary-see",
    "word": "see",
    "zh": "看見/看到/明白",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/siː/",
    "chunks": [
      "see"
    ],
    "sentence": "I can see a beautiful rainbow over the mountain.",
    "sentenceZh": "我能看到山那邊有一道美麗的彩虹。",
    "sentence2": "I see a beautiful blue bird singing in the tree.",
    "sentence2Zh": "我看見一隻美麗的藍鳥在樹上唱歌。"
  },
  {
    "id": "junior-sit",
    "word": "sit",
    "zh": "坐/坐下",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sɪt/",
    "chunks": [
      "sit"
    ],
    "sentence": "Sit down and listen to the teacher carefully, please.",
    "sentenceZh": "請坐好並仔細聽老師說話。",
    "sentence2": "Sit down on your chair and get ready for class.",
    "sentence2Zh": "坐在你的椅子上準備上課。"
  },
  {
    "id": "junior-try",
    "word": "try",
    "zh": "嘗試/努力/試圖",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/traɪ/",
    "chunks": [
      "try"
    ],
    "sentence": "You should try to practice speaking English every day.",
    "sentenceZh": "你應該嘗試每天練習說英文。",
    "sentence2": "Always try your best even if the question is hard.",
    "sentence2Zh": "即使問題很難，也要總是盡力而為。"
  },
  {
    "id": "junior-call",
    "word": "call",
    "zh": "呼叫/打電話/打給/稱呼",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kɑːl/",
    "chunks": [
      "call"
    ],
    "sentence": "I will call you when I arrive at the station.",
    "sentenceZh": "我抵達車站後會打電話給你。",
    "sentence2": "We can call our grandparents to say hello.",
    "sentence2Zh": "我們可以打電話給我們的祖父母問好。"
  },
  {
    "id": "junior-come",
    "word": "come",
    "zh": "來/來到",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kʌm/",
    "chunks": [
      "come"
    ],
    "sentence": "Please come to my house and play games this Saturday.",
    "sentenceZh": "這星期六請來我家玩遊戲。",
    "sentence2": "Please come to my desk and share this storybook.",
    "sentence2Zh": "請到我的書桌旁一起分享這本故事書。"
  },
  {
    "id": "junior-find",
    "word": "find",
    "zh": "尋找/發現/找到",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/faɪnd/",
    "chunks": [
      "find"
    ],
    "sentence": "Did you find the key to your desk drawer?",
    "sentenceZh": "你找到你的書桌抽屜鑰匙了嗎？",
    "sentence2": "I found my lost blue marker under the desk.",
    "sentence2Zh": "我在書桌底下找到了我遺失的藍色白板筆。"
  },
  {
    "id": "junior-feel",
    "word": "feel",
    "zh": "感覺/覺得/觸摸",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/fiːl/",
    "chunks": [
      "feel"
    ],
    "sentence": "I feel very happy because tomorrow is my birthday.",
    "sentenceZh": "我感到非常高興，因為明天是我的生日。",
    "sentence2": "I feel very happy when I play soccer with friends.",
    "sentence2Zh": "當我和朋友踢足球時，我感到很高興。"
  },
  {
    "id": "elementary-have",
    "word": "have",
    "zh": "擁有/有/吃",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hæv/",
    "chunks": [
      "have"
    ],
    "sentence": "We have a fun art class every Wednesday morning.",
    "sentenceZh": "我們每個星期三早上有一節有趣的美術課。",
    "sentence2": "Do you have any questions about this English word?",
    "sentence2Zh": "你對這個英文單字有任何疑問嗎？"
  },
  {
    "id": "junior-help",
    "word": "help",
    "zh": "幫助/幫忙/協助",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/help/",
    "chunks": [
      "help"
    ],
    "sentence": "Can you help me clean the blackboard after class?",
    "sentenceZh": "下課後你能幫我擦黑板嗎？",
    "sentence2": "My brother helps me pack my heavy schoolbag.",
    "sentence2Zh": "我哥哥幫我整理我重重的書包。"
  },
  {
    "id": "passport-hope",
    "word": "hope",
    "zh": "希望/盼望",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hoʊp/",
    "chunks": [
      "hope"
    ],
    "sentence": "I hope the weather turns sunny for our picnic tomorrow.",
    "sentenceZh": "我希望明天的天氣放晴以便我們去野餐。",
    "sentence2": "I hope you have a happy and wonderful weekend.",
    "sentence2Zh": "我希望你度過一個快樂而美好的週末。"
  },
  {
    "id": "passport-hurt",
    "word": "hurt",
    "zh": "受傷/疼痛/傷害",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hɝːt/",
    "chunks": [
      "hurt"
    ],
    "sentence": "He fell off his bike and hurt his right knee.",
    "sentenceZh": "他從腳踏車上摔下來，弄傷了右膝蓋。",
    "sentence2": "He hurt his knee when he fell on the playground.",
    "sentence2Zh": "他在操場上跌倒時弄傷了膝蓋。"
  },
  {
    "id": "junior-know",
    "word": "know",
    "zh": "知道/認識/了解",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/noʊ/",
    "chunks": [
      "know"
    ],
    "sentence": "Do you know how to write this difficult English word?",
    "sentenceZh": "你知道怎麼寫這個難懂的英文單字嗎？",
    "sentence2": "I know how to write all the spelling words today.",
    "sentence2Zh": "我知道今天所有的拼字怎麼寫。"
  },
  {
    "id": "elementary-like",
    "word": "like",
    "zh": "喜歡/像",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/laɪk/",
    "chunks": [
      "like"
    ],
    "sentence": "I like reading interesting stories about space and stars.",
    "sentenceZh": "我喜歡讀關於太空和星星的有趣故事。",
    "sentence2": "I like to draw flowers and trees in my notebook.",
    "sentence2Zh": "我喜歡在我的筆記本上畫花和樹木。"
  },
  {
    "id": "junior-look",
    "word": "look",
    "zh": "看/看起來/注視",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/lʊk/",
    "chunks": [
      "look"
    ],
    "sentence": "Look at the white clouds floating in the sky.",
    "sentenceZh": "看看天空中飄浮的白雲。",
    "sentence2": "The soup looks hot and delicious.",
    "sentence2Zh": "這碗湯看起來又熱又美味。"
  },
  {
    "id": "junior-love",
    "word": "love",
    "zh": "愛/熱愛/喜愛",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/lʌv/",
    "chunks": [
      "love"
    ],
    "sentence": "Children love to play in the cool water during summer.",
    "sentenceZh": "孩子們夏天熱愛在涼爽的水中玩耍。",
    "sentence2": "We love our warm family and supportive classmates.",
    "sentence2Zh": "我們愛我們溫馨的家庭和互相支持的同學。"
  },
  {
    "id": "passport-meet",
    "word": "meet",
    "zh": "遇見/會面/迎接",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/miːt/",
    "chunks": [
      "meet"
    ],
    "sentence": "We will meet at the park entrance at nine o'clock.",
    "sentenceZh": "我們九點鐘在公園入口見面。",
    "sentence2": "I was happy to meet my new teacher.",
    "sentence2Zh": "我很高興見到新老師。"
  },
  {
    "id": "passport-miss",
    "word": "miss",
    "zh": "想念/錯過",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/mɪs/",
    "chunks": [
      "miss"
    ],
    "sentence": "I will miss my friendly classmates during summer holiday.",
    "sentenceZh": "暑假期間我會想念我的友善同學。",
    "sentence2": "I will miss my friendly teacher during summer holidays.",
    "sentence2Zh": "暑假期間我會想念我那友善的老師。"
  },
  {
    "id": "junior-need",
    "word": "need",
    "zh": "需要/必須",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/niːd/",
    "chunks": [
      "need"
    ],
    "sentence": "We need to buy some fresh eggs to bake the cake.",
    "sentenceZh": "我們需要買一些新鮮雞蛋來烤蛋糕。",
    "sentence2": "I need some clean paper to write my homework.",
    "sentence2Zh": "我需要一些乾淨的紙寫作業。"
  },
  {
    "id": "junior-open",
    "word": "open",
    "zh": "打開/開的/營業的",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈoʊ.pən/",
    "chunks": [
      "open"
    ],
    "sentence": "Please open the window to let the fresh air in.",
    "sentenceZh": "請打開窗戶讓新鮮空氣進來。",
    "sentence2": "Please open your workbook and read page three aloud.",
    "sentence2Zh": "請打開你的練習本/習作並大聲朗讀第三頁。"
  },
  {
    "id": "passport-stop",
    "word": "stop",
    "zh": "停止/站牌/車站",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/stɑːp/",
    "chunks": [
      "stop"
    ],
    "sentence": "The yellow school bus stops in front of the gate.",
    "sentenceZh": "黃色校車停在大門前面。",
    "sentence2": "The cars must stop when the traffic light turns red.",
    "sentence2Zh": "當紅綠燈變紅時，汽車必須停止。"
  },
  {
    "id": "junior-tell",
    "word": "tell",
    "zh": "告訴/講述/吩咐",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tel/",
    "chunks": [
      "tell"
    ],
    "sentence": "Can you tell me the way to the school library?",
    "sentenceZh": "你能告訴我前往學校圖書館的路嗎？",
    "sentence2": "My grandmother likes to tell us interesting stories.",
    "sentence2Zh": "我祖母很喜歡給我們講有趣的故事。"
  },
  {
    "id": "junior-wait",
    "word": "wait",
    "zh": "等待/等候",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/weɪt/",
    "chunks": [
      "wait"
    ],
    "sentence": "Wait for me at the post office after school.",
    "sentenceZh": "放學後在郵局等我。",
    "sentence2": "Please wait for me near the school library gate.",
    "sentence2Zh": "請在學校圖書館門口附近等我。"
  },
  {
    "id": "elementary-walk",
    "word": "walk",
    "zh": "散步/走路",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɑːk/",
    "chunks": [
      "walk"
    ],
    "sentence": "We walk to school together every morning.",
    "sentenceZh": "我們每天早上一起走路去學校。",
    "sentence2": "I walk home with my classmates after school.",
    "sentence2Zh": "放學後我和同學一起走路回家。"
  },
  {
    "id": "elementary-want",
    "word": "want",
    "zh": "想要/需要",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɑːnt/",
    "chunks": [
      "want"
    ],
    "sentence": "I want to buy a box of chocolate cookies.",
    "sentenceZh": "我想買一盒巧克力餅乾。",
    "sentence2": "I want to draw a picture of a giant elephant.",
    "sentence2Zh": "我想畫一張大象的畫。"
  },
  {
    "id": "junior-give",
    "word": "give",
    "zh": "給/給予/贈送",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡɪv/",
    "chunks": [
      "give"
    ],
    "sentence": "Please give me the red marker on the desk.",
    "sentenceZh": "請把書桌上的紅色麥克筆給我。",
    "sentence2": "Please give this green pencil case to your sister.",
    "sentence2Zh": "請把這個綠色筆袋給你妹妹/姊姊。"
  },
  {
    "id": "junior-make",
    "word": "make",
    "zh": "製作/做/使",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/meɪk/",
    "chunks": [
      "make"
    ],
    "sentence": "We will make a paper kite in art class tomorrow.",
    "sentenceZh": "我們明天美術課要做一個紙風箏。",
    "sentence2": "We make healthy salad together in our cooking class.",
    "sentence2Zh": "我們在烹飪課上一起製作健康的沙拉。"
  },
  {
    "id": "passport-brush",
    "word": "brush",
    "zh": "刷/刷子/畫筆/刷淨",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/brʌʃ/",
    "chunks": [
      "brush"
    ],
    "sentence": "Remember to brush your teeth before bed.",
    "sentenceZh": "記得睡前刷牙。",
    "sentence2": "Use this brush to clean your shoes.",
    "sentence2Zh": "用這把刷子清潔鞋子。"
  },
  {
    "id": "passport-hurry",
    "word": "hurry",
    "zh": "趕快/急忙",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈhɝː.i/",
    "chunks": [
      "hur",
      "ry"
    ],
    "sentence": "Hurry up, the school bus is coming down the road.",
    "sentenceZh": "快點，校車已經開過來了。",
    "sentence2": "Please hurry, or we will be late for class.",
    "sentence2Zh": "請快一點，否則我們上課會遲到。"
  },
  {
    "id": "passport-laugh",
    "word": "laugh",
    "zh": "笑/大笑",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/læf/",
    "chunks": [
      "laugh"
    ],
    "sentence": "The funny cartoon made all the children laugh out loud.",
    "sentenceZh": "有趣的卡通讓所有的孩子大笑出聲。",
    "sentence2": "His funny facial expressions make everyone laugh.",
    "sentence2Zh": "他滑稽的表情逗得每個人哈哈大笑。"
  },
  {
    "id": "junior-close",
    "word": "close",
    "zh": "關閉/關上/接近的",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/kloʊz/",
    "chunks": [
      "close"
    ],
    "sentence": "Please close the bedroom door quietly when you leave.",
    "sentenceZh": "離開時請輕輕地關上臥室門。",
    "sentence2": "The supermarket will close in ten minutes.",
    "sentence2Zh": "超級市場將在十分鐘內關門。"
  },
  {
    "id": "passport-show",
    "word": "show",
    "zh": "給...看/展示/表演",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʃoʊ/",
    "chunks": [
      "show"
    ],
    "sentence": "Please show me your beautiful drawings after class.",
    "sentenceZh": "下課後請展示你美麗的畫作給我看。",
    "sentence2": "Let's show our appreciation to our parents today.",
    "sentence2Zh": "今天讓我們向父母表達我們的感謝。"
  },
  {
    "id": "elementary-sleep",
    "word": "sleep",
    "zh": "睡覺/睡眠",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/sliːp/",
    "chunks": [
      "sleep"
    ],
    "sentence": "Baby pandas sleep for many hours every single day.",
    "sentenceZh": "貓熊寶寶每天都要睡很多個小時。",
    "sentence2": "I always sleep with my soft puppy plush toy.",
    "sentence2Zh": "我總是抱著我柔軟的小狗玩偶睡覺。"
  },
  {
    "id": "junior-smell",
    "word": "smell",
    "zh": "聞起來/氣味",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/smel/",
    "chunks": [
      "smell"
    ],
    "sentence": "These fresh flowers smell sweet.",
    "sentenceZh": "這些鮮花聞起來很香。",
    "sentence2": "The freshly baked bread smells wonderful.",
    "sentence2Zh": "剛烤好的麵包聞起來很香。"
  },
  {
    "id": "junior-stand",
    "word": "stand",
    "zh": "站立/站/看台",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/stænd/",
    "chunks": [
      "stand"
    ],
    "sentence": "Please stand up when the teacher enters.",
    "sentenceZh": "老師進來時請站起來。",
    "sentence2": "We stand in a straight line to wait for the school bus.",
    "sentence2Zh": "我們排成一直線等校車。"
  },
  {
    "id": "junior-start",
    "word": "start",
    "zh": "開始/出發",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/stɑːrt/",
    "chunks": [
      "start"
    ],
    "sentence": "The English movie will start in five minutes.",
    "sentenceZh": "這部英文電影將在五分鐘內開始。",
    "sentence2": "Let's start our day with a warm smile.",
    "sentence2Zh": "讓我們用溫暖的微笑開始我們的一天。"
  },
  {
    "id": "junior-take",
    "word": "take",
    "zh": "拿取/攜帶/搭乘/花費(時間)",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/teɪk/",
    "chunks": [
      "take"
    ],
    "sentence": "Remember to take your warm jacket with you today.",
    "sentenceZh": "今天記得隨身帶上你溫暖的外套。",
    "sentence2": "It takes me fifteen minutes to walk to school.",
    "sentence2Zh": "我走路去學校花費十五分鐘。"
  },
  {
    "id": "passport-thank",
    "word": "thank",
    "zh": "感謝/謝謝",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/θæŋk/",
    "chunks": [
      "thank"
    ],
    "sentence": "I want to thank my teacher for helping me.",
    "sentenceZh": "我要感謝老師對我的幫助。",
    "sentence2": "We should thank the school doctor for checking our health.",
    "sentence2Zh": "我們應該感謝校醫為我們檢查身體健康。"
  },
  {
    "id": "passport-touch",
    "word": "touch",
    "zh": "觸碰/碰",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tʌtʃ/",
    "chunks": [
      "touch"
    ],
    "sentence": "Please do not touch the clean glass window.",
    "sentenceZh": "請不要觸碰乾淨的玻璃窗。",
    "sentence2": "Do not touch the hot soup; it might burn you.",
    "sentence2Zh": "不要碰熱湯，它可能會燙傷你。"
  },
  {
    "id": "passport-wake",
    "word": "wake",
    "zh": "醒來/喚醒",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/weɪk/",
    "chunks": [
      "wake"
    ],
    "sentence": "My mom wakes me up at seven o'clock every morning.",
    "sentenceZh": "我媽媽每天早上七點鐘喚醒我。",
    "sentence2": "I wake up early to see the beautiful sunrise.",
    "sentence2Zh": "我早起觀賞美麗的日出。"
  },
  {
    "id": "passport-worry",
    "word": "worry",
    "zh": "擔心/憂慮",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwɝː.i/",
    "chunks": [
      "wor",
      "ry"
    ],
    "sentence": "Do not worry, we still have enough time to finish.",
    "sentenceZh": "不用擔心，我們仍有充足的時間來完成。",
    "sentence2": "Do not worry about the game, just do your best.",
    "sentence2Zh": "不要擔心比賽，盡力而為就好。"
  },
  {
    "id": "passport-enjoy",
    "word": "enjoy",
    "zh": "享受/喜愛",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɪnˈdʒɔɪ/",
    "chunks": [
      "en",
      "joy"
    ],
    "sentence": "We enjoy reading English books in the library.",
    "sentenceZh": "我們喜歡在圖書館讀英文書。",
    "sentence2": "We enjoy the cool breeze on the summer beach.",
    "sentence2Zh": "我們享受夏日海灘上的涼爽微風。"
  },
  {
    "id": "passport-welcome",
    "word": "welcome",
    "zh": "歡迎/受歡迎的",
    "topic": "Interjections",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwel.kəm/",
    "chunks": [
      "wel",
      "come"
    ],
    "sentence": "You are always welcome to join our sports club.",
    "sentenceZh": "非常歡迎你加入我們的體育社團。",
    "sentence2": "We welcome the new student to join our class.",
    "sentence2Zh": "我們歡迎新同學加入我們班。"
  },
  {
    "id": "passport-pick-up",
    "word": "pick up",
    "zh": "拾起/接送/撿起",
    "topic": "Actions",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/pɪk ʌp/",
    "chunks": [
      "pick",
      "up"
    ],
    "sentence": "Please pick up the paper trash on the classroom floor.",
    "sentenceZh": "請撿起教室地板上的紙屑垃圾。",
    "sentence2": "Please pick up your crayons from the floor.",
    "sentence2Zh": "請把你的蠟筆從地板上撿起來。"
  },
  {
    "id": "passport-ok",
    "word": "OK",
    "zh": "好的/可以的",
    "topic": "Interjections",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/oʊˈkeɪ/",
    "chunks": [
      "OK"
    ],
    "sentence": "Is it OK to play soccer on the grass?",
    "sentenceZh": "在草地上踢足球可以嗎？",
    "sentence2": "Is it OK if I use your blue pencil case?",
    "sentence2Zh": "我可以用你的藍色鉛筆盒嗎？"
  },
  {
    "id": "junior-easy",
    "word": "easy",
    "zh": "簡單的/容易的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈiː.zi/",
    "chunks": [
      "easy"
    ],
    "sentence": "This spelling test is very easy, and I got ten points.",
    "sentenceZh": "這個拼字測驗非常簡單，我拿了十分。",
    "sentence2": "Solving this riddle is easy if you read it carefully.",
    "sentence2Zh": "如果你仔細閱讀，解開這個謎題很容易。"
  },
  {
    "id": "junior-fine",
    "word": "fine",
    "zh": "好的/晴朗的/細緻的/罰款",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/faɪn/",
    "chunks": [
      "fine"
    ],
    "sentence": "The weather is fine today, so let us go hiking.",
    "sentenceZh": "今天天氣晴朗，所以我們去健行吧。",
    "sentence2": "I am feeling fine today.",
    "sentence2Zh": "我今天感覺很好。"
  },
  {
    "id": "junior-hard",
    "word": "hard",
    "zh": "困難的/堅硬的/努力地",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/hɑːrd/",
    "chunks": [
      "hard"
    ],
    "sentence": "He works hard to practice playing the piano daily.",
    "sentenceZh": "他每天努力練習彈鋼琴。",
    "sentence2": "The shell of a coconut is very hard to open.",
    "sentence2Zh": "椰子的殼非常堅硬，很難打開。"
  },
  {
    "id": "junior-only",
    "word": "only",
    "zh": "只有/僅有的/唯一的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈoʊn.li/",
    "chunks": [
      "on",
      "ly"
    ],
    "sentence": "I have only one red pen in my pencil case.",
    "sentenceZh": "我筆袋裡只有一支紅色原子筆。",
    "sentence2": "He is the only student who knows the answer.",
    "sentence2Zh": "他是唯一一個知道答案的學生。"
  },
  {
    "id": "junior-sure",
    "word": "sure",
    "zh": "確定的/當然",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ʃʊr/",
    "chunks": [
      "sure"
    ],
    "sentence": "Are you sure you put the keys in your pocket?",
    "sentenceZh": "你確定有把鑰匙放在你的口袋裡嗎？",
    "sentence2": "I am sure we will have a great time at the zoo.",
    "sentence2Zh": "我確定我們在動物園會玩得很高興。"
  },
  {
    "id": "junior-dirty",
    "word": "dirty",
    "zh": "骯髒的/髒的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈdɝː.ti/",
    "chunks": [
      "dirty"
    ],
    "sentence": "Wash your dirty hands with soap before dinner.",
    "sentenceZh": "晚餐前用肥皂清洗你髒髒的手。",
    "sentence2": "Please put your dirty socks into the laundry bag.",
    "sentence2Zh": "請把你的髒襪子放進洗衣袋裡。"
  },
  {
    "id": "junior-great",
    "word": "great",
    "zh": "很棒的/巨大的/偉大的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɡreɪt/",
    "chunks": [
      "great"
    ],
    "sentence": "Having a picnic in the park is a great idea.",
    "sentenceZh": "在公園野餐是個極棒的主意。",
    "sentence2": "My grandparents tell great stories about their childhood.",
    "sentence2Zh": "我祖父母講了許多關於他們童年的精彩故事。"
  },
  {
    "id": "passport-other",
    "word": "other",
    "zh": "其他的/另外的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈʌð.ɚ/",
    "chunks": [
      "oth",
      "er"
    ],
    "sentence": "Where are the other students of our class?",
    "sentenceZh": "我們班上的其他學生在哪裡？",
    "sentence2": "Some students like art, while others prefer PE.",
    "sentence2Zh": "有些學生喜歡美勞，而另外一些則更偏愛體育。"
  },
  {
    "id": "passport-quiet",
    "word": "quiet",
    "zh": "安靜的/沉靜的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈkwaɪ.ət/",
    "chunks": [
      "qui",
      "et"
    ],
    "sentence": "The library is very quiet, so walk slowly.",
    "sentenceZh": "圖書館非常安靜，所以請放輕腳步。",
    "sentence2": "We must stay quiet when the teacher is speaking.",
    "sentence2Zh": "老師在說話時我們必須保持安靜。"
  },
  {
    "id": "passport-ready",
    "word": "ready",
    "zh": "準備好的/樂意的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈred.i/",
    "chunks": [
      "ready"
    ],
    "sentence": "Are you ready for the spelling contest tomorrow?",
    "sentenceZh": "你為明天的拼字比賽準備好了嗎？",
    "sentence2": "The team is ready to compete in the race.",
    "sentence2Zh": "隊伍已經準備好參加比賽了。"
  },
  {
    "id": "passport-wonderful",
    "word": "wonderful",
    "zh": "極好的/精彩的/奇妙的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈwʌn.dɚ.fəl/",
    "chunks": [
      "won",
      "der",
      "ful"
    ],
    "sentence": "We had a wonderful time at the zoo yesterday.",
    "sentenceZh": "我們昨天在動物園度過了美好的時光。",
    "sentence2": "It is a wonderful thing to share with others.",
    "sentence2Zh": "與他人分享是一件極好的事。"
  },
  {
    "id": "passport-favorite",
    "word": "favorite",
    "zh": "最喜愛的/最喜歡的",
    "topic": "Adjectives",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfeɪ.vər.ɪt/",
    "chunks": [
      "fa",
      "vorite"
    ],
    "sentence": "Benson's favorite sport is baseball.",
    "sentenceZh": "班森最喜愛的運動是棒球。",
    "sentence2": "Vanilla ice cream is my sister's favorite dessert.",
    "sentence2Zh": "香草冰淇淋是我妹妹最喜愛的甜點。"
  },
  {
    "id": "elementary-no",
    "word": "no",
    "zh": "不/沒有",
    "topic": "Interjections",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/noʊ/",
    "chunks": [
      "no"
    ],
    "sentence": "There is no milk left in the refrigerator.",
    "sentenceZh": "冰箱裡沒有剩下任何牛奶了。",
    "sentence2": "No student should run in the narrow hallways.",
    "sentence2Zh": "學生不應該在狹窄的走廊上奔跑。"
  },
  {
    "id": "junior-so",
    "word": "so",
    "zh": "如此/所以/那麼",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/soʊ/",
    "chunks": [
      "so"
    ],
    "sentence": "It was raining, so we stayed home all day.",
    "sentenceZh": "那時正下著雨，所以我們整天待在家。",
    "sentence2": "I was very thirsty, so I drank a glass of water.",
    "sentence2Zh": "我很渴，所以我喝了一杯水。"
  },
  {
    "id": "elementary-yes",
    "word": "yes",
    "zh": "是/是的",
    "topic": "Interjections",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/jes/",
    "chunks": [
      "yes"
    ],
    "sentence": "Yes, I can speak English and Chinese very well.",
    "sentenceZh": "是的，我會說英文和中文而且說得很好。",
    "sentence2": "Yes, I would love to join the sports club.",
    "sentence2Zh": "是的，我很樂意加入這個體育社團。"
  },
  {
    "id": "junior-too",
    "word": "too",
    "zh": "也/太",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/tuː/",
    "chunks": [
      "too"
    ],
    "sentence": "I bought a blue pen, and my brother bought one too.",
    "sentenceZh": "我買了一支藍色原子筆，我哥哥也買了一支。",
    "sentence2": "This schoolbag is too heavy for me to carry alone.",
    "sentence2Zh": "這個書包太重了，我一個人背不動。"
  },
  {
    "id": "junior-very",
    "word": "very",
    "zh": "非常地/很",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈver.i/",
    "chunks": [
      "very"
    ],
    "sentence": "The weather in winter is very cold in Taipei.",
    "sentenceZh": "台北冬天的天氣非常寒冷。",
    "sentence2": "The math teacher is very kind and patient with us.",
    "sentence2Zh": "數學老師對我們非常親切且有耐心。"
  },
  {
    "id": "passport-then",
    "word": "then",
    "zh": "然後/那時/那麼",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ðen/",
    "chunks": [
      "then"
    ],
    "sentence": "We finished our homework and then went to play.",
    "sentenceZh": "我們完成了功課，然後出去玩。",
    "sentence2": "First finish your homework, and then you can play.",
    "sentence2Zh": "先做完功課，然後你就可以去玩了。"
  },
  {
    "id": "passport-still",
    "word": "still",
    "zh": "仍然/仍然的/靜止的",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/stɪl/",
    "chunks": [
      "still"
    ],
    "sentence": "The bird is still sitting on the tree branch.",
    "sentenceZh": "那隻鳥仍然停在樹枝上。",
    "sentence2": "Even on rainy days, we can still learn at home.",
    "sentence2Zh": "即使下雨天，我們仍然可以在家學習。"
  },
  {
    "id": "elementary-not",
    "word": "not",
    "zh": "不/沒有",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/nɑːt/",
    "chunks": [
      "not"
    ],
    "sentence": "She is not at home; she went to the bookstore.",
    "sentenceZh": "她不在家，她去書店了。",
    "sentence2": "This blue pencil is not mine; it belongs to Benson.",
    "sentence2Zh": "這支藍色鉛筆不是我的，它是班森的。"
  },
  {
    "id": "junior-never",
    "word": "never",
    "zh": "從不/絕不",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈnev.ɚ/",
    "chunks": [
      "nev",
      "er"
    ],
    "sentence": "My sister has never ridden a bicycle before.",
    "sentenceZh": "我妹妹以前從未騎過腳踏車。",
    "sentence2": "Never give up when you face a difficult problem.",
    "sentence2Zh": "當你面對困難問題時，絕不要放棄。"
  },
  {
    "id": "passport-away",
    "word": "away",
    "zh": "離開/離去/遠離",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/əˈweɪ/",
    "chunks": [
      "away"
    ],
    "sentence": "Please put away your toys before going to bed.",
    "sentenceZh": "睡覺前請收好你的玩具。",
    "sentence2": "An apple a day keeps the doctor away.",
    "sentence2Zh": "一天一蘋果，醫生遠離我。"
  },
  {
    "id": "junior-always",
    "word": "always",
    "zh": "總是/經常",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈɑːl.weɪz/",
    "chunks": [
      "al",
      "ways"
    ],
    "sentence": "He always washes his hands before lunch.",
    "sentenceZh": "他午餐前總是洗手。",
    "sentence2": "Always remember to do your best at school.",
    "sentence2Zh": "永遠記得在學校要盡力而為。"
  },
  {
    "id": "junior-together",
    "word": "together",
    "zh": "一起/共同",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/təˈɡeð.ɚ/",
    "chunks": [
      "to",
      "geth",
      "er"
    ],
    "sentence": "We studied English together at the library.",
    "sentenceZh": "我們在圖書館一起學英文。",
    "sentence2": "Let us work together to finish the picture.",
    "sentence2Zh": "讓我們一起完成這幅圖。"
  },
  {
    "id": "junior-again",
    "word": "again",
    "zh": "再次/重新/又",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/əˈɡen/",
    "chunks": [
      "again"
    ],
    "sentence": "Can you read this interesting story for me again?",
    "sentenceZh": "你能再為我讀一遍這個有趣的故事嗎？",
    "sentence2": "Let's read the storybook again to learn more words.",
    "sentence2Zh": "讓我們重新讀一遍故事書以學習更多單字。"
  },
  {
    "id": "passport-maybe",
    "word": "maybe",
    "zh": "也許/大概/可能",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈmeɪ.bi/",
    "chunks": [
      "maybe"
    ],
    "sentence": "Maybe we can visit the zoo next Saturday morning.",
    "sentenceZh": "也許我們下星期六早上可以造訪動物園。",
    "sentence2": "Maybe we can go hiking in the park next Saturday.",
    "sentence2Zh": "也許我們下個星期六可以去公園健行。"
  },
  {
    "id": "junior-really",
    "word": "really",
    "zh": "真正地/實在/很",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈrɪ.li/",
    "chunks": [
      "re",
      "al",
      "ly"
    ],
    "sentence": "The chocolate cake Grandma made was really yummy.",
    "sentenceZh": "阿嬤做的巧克力蛋糕真的非常美味。",
    "sentence2": "The story Grandma told us was really interesting.",
    "sentence2Zh": "阿嬤跟我們講的故事真的很有趣。"
  },
  {
    "id": "junior-sometimes",
    "word": "sometimes",
    "zh": "有時候/偶爾",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈsʌm.taɪmz/",
    "chunks": [
      "some",
      "times"
    ],
    "sentence": "Sometimes we go for a walk in the park after dinner.",
    "sentenceZh": "有時候我們晚餐後會去公園散步。",
    "sentence2": "Sometimes we go hiking on weekends.",
    "sentence2Zh": "有時候我們週末會去健行。"
  },
  {
    "id": "junior-usually",
    "word": "usually",
    "zh": "通常/平常",
    "topic": "Other adverbs",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈjuː.ʒu.ə.li/",
    "chunks": [
      "usu",
      "al",
      "ly"
    ],
    "sentence": "I usually read storybooks before going to sleep.",
    "sentenceZh": "我通常在睡覺前讀故事書。",
    "sentence2": "I usually do my homework right after coming home.",
    "sentence2Zh": "我通常一回到家就立刻寫功課。"
  },
  {
    "id": "passport-how",
    "word": "how",
    "zh": "如何/怎麼樣/多麼",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/haʊ/",
    "chunks": [
      "how"
    ],
    "sentence": "How do you spell this long English word?",
    "sentenceZh": "你怎麼拚寫這個長英文單字？",
    "sentence2": "How do you spell your English name, please?",
    "sentence2Zh": "請教一下，你的英文名字怎麼拼？"
  },
  {
    "id": "junior-who",
    "word": "who",
    "zh": "誰(主格)",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/huː/",
    "chunks": [
      "who"
    ],
    "sentence": "Who is the boy sitting next to the teacher?",
    "sentenceZh": "坐在老師旁邊的那個男孩是誰？",
    "sentence2": "Who is the teacher standing near the school gate?",
    "sentence2Zh": "站在校門口附近的老師是誰？"
  },
  {
    "id": "junior-why",
    "word": "why",
    "zh": "為什麼",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/waɪ/",
    "chunks": [
      "why"
    ],
    "sentence": "Why are you late for class this morning?",
    "sentenceZh": "你今天早上上課為什麼遲到？",
    "sentence2": "Why did you choose this beautiful red book?",
    "sentence2Zh": "你為什麼選擇這本美麗的紅書？"
  },
  {
    "id": "junior-what",
    "word": "what",
    "zh": "什麼",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɑːt/",
    "chunks": [
      "what"
    ],
    "sentence": "What is your favorite color, blue or green?",
    "sentenceZh": "你最喜歡什麼顏色，藍色還是綠色？",
    "sentence2": "What are you going to draw in art class today?",
    "sentence2Zh": "你今天美勞課打算畫什麼？"
  },
  {
    "id": "junior-when",
    "word": "when",
    "zh": "當...之時/何時",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wen/",
    "chunks": [
      "when"
    ],
    "sentence": "When does the school library open on weekends?",
    "sentenceZh": "學校圖書館在週末幾點開放？",
    "sentence2": "I feel happy when I learn new English words.",
    "sentence2Zh": "當我學習新的英文單字時，我感到很高興。"
  },
  {
    "id": "junior-where",
    "word": "where",
    "zh": "哪裡/何處",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wer/",
    "chunks": [
      "where"
    ],
    "sentence": "Where did you buy this cute dog notebook?",
    "sentenceZh": "你在哪裡買的這本可愛的狗筆記本？",
    "sentence2": "Where did you put your school English homework?",
    "sentence2Zh": "你把學校英文功課放在哪裡了？"
  },
  {
    "id": "passport-which",
    "word": "which",
    "zh": "哪一個/哪些的",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/wɪtʃ/",
    "chunks": [
      "which"
    ],
    "sentence": "Which book do you want to read tonight?",
    "sentenceZh": "你今晚想讀哪一本書？",
    "sentence2": "Which crayon do you want to use, red or blue?",
    "sentence2Zh": "你想用哪一支蠟筆，紅色還是藍色？"
  },
  {
    "id": "passport-whose",
    "word": "whose",
    "zh": "誰的(所有格)",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/huːz/",
    "chunks": [
      "whose"
    ],
    "sentence": "Whose pencil case is this on the floor?",
    "sentenceZh": "地板上的這個筆袋是誰的？",
    "sentence2": "Whose blue pencil box is this under the table?",
    "sentence2Zh": "桌子底下這藍色鉛筆盒是誰的？"
  },
  {
    "id": "passport-o",
    "word": "O",
    "zh": "字母O/噢(感嘆詞)",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/oʊ/",
    "chunks": [
      "o"
    ],
    "sentence": "O is a letter in the English alphabet.",
    "sentenceZh": "O 是英文字母表中的一個字母。",
    "sentence2": "O is the first letter in the word orange.",
    "sentence2Zh": "O 是 orange 這個單字的第一個字母。"
  },
  {
    "id": "passport-e",
    "word": "E",
    "zh": "字母E/電子化的",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/iː/",
    "chunks": [
      "e"
    ],
    "sentence": "E is the fifth letter of the English alphabet.",
    "sentenceZh": "E 是英文字母表中的第五個字母。",
    "sentence2": "We use e-books to read English stories.",
    "sentence2Zh": "我們使用電子書閱讀英文故事。"
  },
  {
    "id": "passport-phonics",
    "word": "phonics",
    "zh": "自然發音/字母拼讀法",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ˈfɑː.nɪks/",
    "chunks": [
      "phon",
      "ics"
    ],
    "sentence": "Phonics helps us learn how to pronounce words.",
    "sentenceZh": "自然拼讀幫助我們學習如何發音單字。",
    "sentence2": "Learning phonics helps us spell English words easily.",
    "sentence2Zh": "學習自然發音/字母拼讀法可以幫助我們輕鬆拼寫英文單字。"
  },
  {
    "id": "passport-expansion",
    "word": "Expansion",
    "zh": "拓展/擴大/擴展",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɪkˈspæn.ʃən/",
    "chunks": [
      "Ex",
      "pan",
      "sion"
    ],
    "sentence": "This book is an expansion of the first story.",
    "sentenceZh": "這本書是第一個故事的擴展。",
    "sentence2": "The expansion of the school library brings more storybooks.",
    "sentence2Zh": "學校圖書館的擴建帶來了更多故事書。"
  },
  {
    "id": "passport-page",
    "word": "page",
    "zh": "頁/頁碼",
    "topic": "Wh-words",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/peɪdʒ/",
    "chunks": [
      "Page"
    ],
    "sentence": "Please turn to page ten of the textbook.",
    "sentenceZh": "請翻到教科書的第十頁。",
    "sentence2": "Please open your workbook to page ten and start reading.",
    "sentence2Zh": "請打開你的練習本/習作第十頁並開始閱讀。"
  },
  {
    "id": "elementary-is",
    "word": "is",
    "zh": "是(單數動詞)",
    "topic": "Be & Auxiliaries",
    "gradeBand": "G3",
    "grade": 3,
    "phonetic": "/ɪz/",
    "chunks": [
      "is"
    ],
    "sentence": "My brother is the tallest boy in his class.",
    "sentenceZh": "我哥哥是班上最高的男孩。",
    "sentence2": "My puppy is playing with a small ball.",
    "sentence2Zh": "我的小狗正在玩一顆小球。"
  },
  {
    "id": "elementary-am",
    "word": "am",
    "zh": "是(第一人稱單數動詞)",
    "topic": "Be & Auxiliaries",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/æm/",
    "chunks": [
      "am"
    ],
    "sentence": "I am very excited about the school trip tomorrow.",
    "sentenceZh": "我對明天的學校旅行感到非常興奮。",
    "sentence2": "I am very happy to see my classmates again today.",
    "sentence2Zh": "我今天很高興能再次見到我的同學們。"
  },
  {
    "id": "elementary-are",
    "word": "are",
    "zh": "是(複數與第二人稱動詞)",
    "topic": "Be & Auxiliaries",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ɑːr/",
    "chunks": [
      "are"
    ],
    "sentence": "The children are playing tag in the park happily.",
    "sentenceZh": "孩子們正在公園裡高興地玩捉人遊戲。",
    "sentence2": "They are cleaning the classroom floor together.",
    "sentence2Zh": "他們正在一起打掃教室地板。"
  },
  {
    "id": "elementary-eight",
    "word": "eight",
    "zh": "八/八個",
    "topic": "Numbers",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/eɪt/",
    "chunks": [
      "eight"
    ],
    "sentence": "We have eight classes in total every school day.",
    "sentenceZh": "我們每個上學日總共有八節課。",
    "sentence2": "Eight white swans are swimming in the calm lake.",
    "sentence2Zh": "八隻白天鵝正在平靜的湖面游泳。"
  },
  {
    "id": "elementary-eleven",
    "word": "eleven",
    "zh": "十一/十一個",
    "topic": "Numbers",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ɪˈlev.ən/",
    "chunks": [
      "eleven"
    ],
    "sentence": "There are eleven players on the soccer field.",
    "sentenceZh": "足球場上有十一名球員。",
    "sentence2": "There are eleven players in a soccer team.",
    "sentence2Zh": "足球隊裡有十一名球員。"
  },
  {
    "id": "elementary-five",
    "word": "five",
    "zh": "五/五個",
    "topic": "Numbers",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/faɪv/",
    "chunks": [
      "five"
    ],
    "sentence": "I bought five notebooks from the bookstore.",
    "sentenceZh": "我從書店買了五本筆記本。",
    "sentence2": "He gave me five crayons of different colors.",
    "sentence2Zh": "他給了我五支不同顏色的蠟筆。"
  },
  {
    "id": "elementary-nine",
    "word": "nine",
    "zh": "九/九個",
    "topic": "Numbers",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/naɪn/",
    "chunks": [
      "nine"
    ],
    "sentence": "The school library closes at nine o'clock sharp.",
    "sentenceZh": "學校圖書館在九點整關閉。",
    "sentence2": "There are nine storybooks in my desk drawer.",
    "sentence2Zh": "我的書桌抽屜裡有九本故事書。"
  },
  {
    "id": "elementary-sad",
    "word": "sad",
    "zh": "悲傷的/難過的",
    "topic": "Personal characteristics",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/sæd/",
    "chunks": [
      "sad"
    ],
    "sentence": "She felt sad because she lost her pet rabbit.",
    "sentenceZh": "她感到很悲傷，因為她弄丟了她的寵物兔。",
    "sentence2": "Do not be sad; we can try the game again.",
    "sentence2Zh": "不要難過，我們可以重新嘗試這個遊戲。"
  },
  {
    "id": "elementary-seven",
    "word": "seven",
    "zh": "七/七個",
    "topic": "Numbers",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ˈsev.ən/",
    "chunks": [
      "sev",
      "en"
    ],
    "sentence": "There are seven days in a single week.",
    "sentenceZh": "一週總共有七天。",
    "sentence2": "She read seven English storybooks this month.",
    "sentence2Zh": "她這個月讀了七本英文故事書。"
  },
  {
    "id": "elementary-six",
    "word": "six",
    "zh": "六/六個",
    "topic": "Numbers",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/sɪks/",
    "chunks": [
      "six"
    ],
    "sentence": "He has six storybooks in his backpack.",
    "sentenceZh": "他的背包裡有六本故事書。",
    "sentence2": "We have six different subjects on Mondays.",
    "sentence2Zh": "星期一我們有六個不同的學科。"
  },
  {
    "id": "elementary-ten",
    "word": "ten",
    "zh": "十/十個",
    "topic": "Numbers",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/ten/",
    "chunks": [
      "ten"
    ],
    "sentence": "The test has ten questions in total today.",
    "sentenceZh": "今天的測驗總共有十道題。",
    "sentence2": "He scored ten points in the basketball match.",
    "sentence2Zh": "他在籃球賽中拿到了十分。"
  },
  {
    "id": "elementary-twelve",
    "word": "twelve",
    "zh": "十二/十二個",
    "topic": "Numbers",
    "gradeBand": "G4",
    "grade": 4,
    "phonetic": "/twelv/",
    "chunks": [
      "twelve"
    ],
    "sentence": "There are twelve months in a year.",
    "sentenceZh": "一年有十二個月。",
    "sentence2": "The clock has twelve numbers.",
    "sentence2Zh": "時鐘上有十二個數字。"
  },
  {
    "id": "elementary-bike",
    "word": "bike",
    "zh": "腳踏車/自行車",
    "topic": "Transportation",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/baɪk/",
    "chunks": [
      "bike"
    ],
    "sentence": "He rides his red bike to school every morning.",
    "sentenceZh": "他每天早上騎著他的紅色腳踏車去上學。",
    "sentence2": "I ride my red bike to school every morning.",
    "sentence2Zh": "我每天早上騎我那輛紅色的腳踏車上學。"
  },
  {
    "id": "elementary-living-room",
    "word": "living room",
    "zh": "客廳",
    "topic": "House",
    "gradeBand": "G5",
    "grade": 5,
    "phonetic": "/ˈlɪv.ɪŋ ˌruːm/",
    "chunks": [
      "liv",
      "ing",
      "room"
    ],
    "sentence": "We watched a fun movie together in the living room.",
    "sentenceZh": "我們在客廳一起看了一部有趣的電影。",
    "sentence2": "Our family sits in the living room and talks about school.",
    "sentence2Zh": "我們全家人坐在客廳裡聊天談學校生活。"
  },
  {
    "id": "junior-any",
    "word": "any",
    "zh": "任何的/一些",
    "topic": "Articles",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈen.i/",
    "chunks": [
      "any"
    ],
    "sentence": "Do you have any questions about the English test?",
    "sentenceZh": "關於英文測驗，你還有任何問題嗎？",
    "sentence2": "Do you have any crayons to paint this flower?",
    "sentence2Zh": "你有任何蠟筆可以為這朵花上色嗎？"
  },
  {
    "id": "junior-catch",
    "word": "catch",
    "zh": "接住/抓取/捕獲",
    "topic": "Actions",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/kætʃ/",
    "chunks": [
      "catch"
    ],
    "sentence": "Throw the ball to me and I will catch it.",
    "sentenceZh": "把球丟給我，我會接住它。",
    "sentence2": "Try to catch the tennis ball with both hands.",
    "sentence2Zh": "試著用雙手接住網球。"
  },
  {
    "id": "junior-goodbye",
    "word": "goodbye",
    "zh": "再見/告別",
    "topic": "Interjections",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˌɡʊdˈbaɪ/",
    "chunks": [
      "good",
      "bye"
    ],
    "sentence": "He said goodbye to his friends at the gate.",
    "sentenceZh": "他在大門口跟他的朋友們道別。",
    "sentence2": "We waved and said goodbye to our kind teacher.",
    "sentence2Zh": "我們揮手並跟我們親切的老師說再見。"
  },
  {
    "id": "junior-handsome",
    "word": "handsome",
    "zh": "英俊的/帥氣的",
    "topic": "Personal characteristics",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈhæn.səm/",
    "chunks": [
      "hand",
      "some"
    ],
    "sentence": "The movie actor looked very handsome in the film.",
    "sentenceZh": "電影演員在影片中看起來非常英俊。",
    "sentence2": "My big brother looks handsome in his white shirt.",
    "sentence2Zh": "我哥哥穿他的白襯衫看起來很帥。"
  },
  {
    "id": "junior-hot-dog",
    "word": "hot dog",
    "zh": "熱狗",
    "topic": "Food",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈhɑːt ˌdɔːɡ/",
    "chunks": [
      "hot",
      "dog"
    ],
    "sentence": "He ate a hot dog and drank some cola for lunch.",
    "sentenceZh": "他午餐吃了一個熱狗並喝了一些可樂。",
    "sentence2": "We shared a delicious hot dog at the sports day.",
    "sentence2Zh": "我們在運動會上分享了一個美味的熱狗。"
  },
  {
    "id": "junior-invite",
    "word": "invite",
    "zh": "邀請",
    "topic": "Actions",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ɪnˈvaɪt/",
    "chunks": [
      "in",
      "vite"
    ],
    "sentence": "I want to invite my classmates to my birthday party.",
    "sentenceZh": "我想邀請同學參加生日派對。",
    "sentence2": "We invited Grandma to dinner on Sunday.",
    "sentence2Zh": "我們邀請奶奶星期日來吃晚餐。"
  },
  {
    "id": "junior-learn",
    "word": "learn",
    "zh": "學習/學會/得知",
    "topic": "Actions",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/lɝːn/",
    "chunks": [
      "learn"
    ],
    "sentence": "We learn how to speak English at school.",
    "sentenceZh": "我們在學校學習說英語。",
    "sentence2": "I learned how to ride a bike last year.",
    "sentence2Zh": "我去年學會了騎腳踏車。"
  },
  {
    "id": "junior-library",
    "word": "library",
    "zh": "圖書館",
    "topic": "Places",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈlaɪ.brer.i/",
    "chunks": [
      "li",
      "brary"
    ],
    "sentence": "The students are studying quietly in the school library.",
    "sentenceZh": "學生們正在學校圖書館安靜地學習。",
    "sentence2": "We should stay quiet when reading in the library.",
    "sentence2Zh": "在圖書館讀書時我們應該保持安靜。"
  },
  {
    "id": "junior-month",
    "word": "month",
    "zh": "月份/月",
    "topic": "Time",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/mʌnθ/",
    "chunks": [
      "month"
    ],
    "sentence": "December is the last month of the year.",
    "sentenceZh": "十二月是一年中的最後一個月。",
    "sentence2": "My birthday is next month.",
    "sentence2Zh": "我的生日在下個月。"
  },
  {
    "id": "junior-next",
    "word": "next",
    "zh": "下一個的/隔壁的/接著",
    "topic": "Time",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/nekst/",
    "chunks": [
      "next"
    ],
    "sentence": "We will visit the zoo next Saturday morning.",
    "sentenceZh": "我們下星期六早上將造訪動物園。",
    "sentence2": "Our next class is PE, and we will play soccer.",
    "sentence2Zh": "我們的下一堂課是體育課，我們將會踢足球。"
  },
  {
    "id": "junior-man",
    "word": "man",
    "zh": "男人/人/人類(單數)",
    "topic": "People",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/mæn/",
    "chunks": [
      "man"
    ],
    "sentence": "A kind man helped the old lady cross the street.",
    "sentenceZh": "一位好心的男子幫助老婦人過馬路。",
    "sentence2": "The man standing near the library is my uncle.",
    "sentence2Zh": "站在圖書館附近的那位先生/男人是我叔叔。"
  },
  {
    "id": "junior-noodle",
    "word": "noodle",
    "zh": "麵條/麵",
    "topic": "Food",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈnuː.dļ/",
    "chunks": [
      "noo",
      "dle"
    ],
    "sentence": "Grandpa likes to eat hot beef noodles for lunch.",
    "sentenceZh": "爺爺中午喜歡吃熱牛肉麵。",
    "sentence2": "My grandmother makes beef noodle soup for dinner.",
    "sentence2Zh": "我祖母晚餐做牛肉麵湯。"
  },
  {
    "id": "junior-or",
    "word": "or",
    "zh": "或者/否則",
    "topic": "Conjunctions",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ɔːr/",
    "chunks": [
      "or"
    ],
    "sentence": "Do you want to play soccer or basketball?",
    "sentenceZh": "你想踢足球還是打籃球？",
    "sentence2": "Do you want to play basketball or soccer today?",
    "sentence2Zh": "你今天想打籃球還是踢足球？"
  },
  {
    "id": "junior-place",
    "word": "place",
    "zh": "地方/處所",
    "topic": "Places",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/pleɪs/",
    "chunks": [
      "place"
    ],
    "sentence": "Taipei is a very busy and interesting place.",
    "sentenceZh": "台北是一個非常忙碌且有趣的地方。",
    "sentence2": "This beautiful park is my favorite place to relax.",
    "sentence2Zh": "這個美麗的公園是我最喜歡的放鬆地方。"
  },
  {
    "id": "junior-plane",
    "word": "plane",
    "zh": "飛機/平面",
    "topic": "Transportation",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/pleɪn/",
    "chunks": [
      "plane"
    ],
    "sentence": "The passenger plane is flying high in the blue sky.",
    "sentenceZh": "客機正高高地飛在藍天中。",
    "sentence2": "We saw a giant passenger plane flying in the sky.",
    "sentence2Zh": "我們看到一架巨大的客機在天空中飛行。"
  },
  {
    "id": "junior-post",
    "word": "post",
    "zh": "郵政/張貼/張貼處/柱子",
    "topic": "Other verbs",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/poʊst/",
    "chunks": [
      "post"
    ],
    "sentence": "He went to the post office to mail a letter.",
    "sentenceZh": "他去郵局寄信。",
    "sentence2": "Please post this notice on the school bulletin board.",
    "sentence2Zh": "請把這個公告張貼在學校公佈欄上。"
  },
  {
    "id": "junior-my",
    "word": "my",
    "zh": "我的(所有格)",
    "topic": "Pronouns",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/maɪ/",
    "chunks": [
      "my"
    ],
    "sentence": "This is my new blue backpack for school.",
    "sentenceZh": "這是我的新藍色上學背包。",
    "sentence2": "My dog is very friendly and never barks at guests.",
    "sentence2Zh": "我的狗非常親切，從不對客人吠叫。"
  },
  {
    "id": "junior-practice",
    "word": "practice",
    "zh": "練習/實踐",
    "topic": "Actions",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈpræk.tɪs/",
    "chunks": [
      "prac",
      "tice"
    ],
    "sentence": "You should practice speaking English every single day.",
    "sentenceZh": "你應該每一天都練習說英文。",
    "sentence2": "Daily practice makes your English spelling much better.",
    "sentence2Zh": "每日練習能讓你的英文拼寫更好。"
  },
  {
    "id": "junior-road",
    "word": "road",
    "zh": "路/道路/途徑",
    "topic": "Places",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/roʊd/",
    "chunks": [
      "road"
    ],
    "sentence": "Walk carefully because the road is very wet.",
    "sentenceZh": "請小心行走，因為道路非常潮濕。",
    "sentence2": "Look both ways before you walk across the road.",
    "sentence2Zh": "橫穿道路前請看好左右兩邊。"
  },
  {
    "id": "junior-our",
    "word": "our",
    "zh": "我們的(所有格)",
    "topic": "Pronouns",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈaʊ.ɚ/",
    "chunks": [
      "our"
    ],
    "sentence": "Our teacher gave us some sweet cookies yesterday.",
    "sentenceZh": "我們的老師昨天給了我們一些甜餅乾。",
    "sentence2": "Our classroom wall is decorated with sweet paintings.",
    "sentence2Zh": "我們的教室牆壁裝飾著溫馨的畫作。"
  },
  {
    "id": "junior-phone",
    "word": "phone",
    "zh": "電話/打電話",
    "topic": "Other nouns",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/foʊn/",
    "chunks": [
      "phone"
    ],
    "sentence": "She used the phone to call her grandmother.",
    "sentenceZh": "她用電話打給她的祖母。",
    "sentence2": "Please turn off your phone when the class starts.",
    "sentence2Zh": "上課開始時請關掉你的電話。"
  },
  {
    "id": "junior-sofa",
    "word": "sofa",
    "zh": "沙發",
    "topic": "House",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈsoʊ.fə/",
    "chunks": [
      "so",
      "fa"
    ],
    "sentence": "We sat on the comfortable sofa and watched TV.",
    "sentenceZh": "我們坐在舒適的沙發上看電視。",
    "sentence2": "We sat on the comfortable sofa and watched a video.",
    "sentence2Zh": "我們坐在舒服的沙發上看影片。"
  },
  {
    "id": "junior-sorry",
    "word": "sorry",
    "zh": "抱歉的/遺憾的",
    "topic": "Interjections",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈsɑːr.i/",
    "chunks": [
      "sor",
      "ry"
    ],
    "sentence": "I am sorry that I broke your marker.",
    "sentenceZh": "很抱歉，我弄壞了你的麥克筆。",
    "sentence2": "Sorry, I took your pencil by mistake.",
    "sentence2Zh": "抱歉，我不小心拿了你的鉛筆。"
  },
  {
    "id": "junior-teach",
    "word": "teach",
    "zh": "教導/教學/教",
    "topic": "Actions",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/tiːtʃ/",
    "chunks": [
      "teach"
    ],
    "sentence": "Our English teacher teaches us interesting songs.",
    "sentenceZh": "我們的英文老師教我們有趣的歌曲。",
    "sentence2": "Our teachers teach us how to solve math problems.",
    "sentence2Zh": "我們的老師教我們如何解答數學題。"
  },
  {
    "id": "junior-window",
    "word": "window",
    "zh": "窗戶",
    "topic": "House",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/ˈwɪn.doʊ/",
    "chunks": [
      "win",
      "dow"
    ],
    "sentence": "Please open the window to let the fresh air in.",
    "sentenceZh": "請打開窗戶讓新鮮空氣進來。",
    "sentence2": "We can look at the tall trees outside the window.",
    "sentence2Zh": "我們可以看著窗外的高樹。"
  },
  {
    "id": "junior-young",
    "word": "young",
    "zh": "年輕的/幼小的",
    "topic": "Personal characteristics",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/jʌŋ/",
    "chunks": [
      "young"
    ],
    "sentence": "A young girl is reading a book under the tree.",
    "sentenceZh": "一個年輕的女孩正在樹下看書。",
    "sentence2": "The young plants need sunshine and clean water to grow.",
    "sentence2Zh": "幼小的植物需要陽光和乾淨的水來生長。"
  },
  {
    "id": "junior-your",
    "word": "your",
    "zh": "你/你們的(所有格)",
    "topic": "Pronouns",
    "gradeBand": "G7",
    "grade": 7,
    "phonetic": "/jɔːr/",
    "chunks": [
      "your"
    ],
    "sentence": "Please write your name on this paper.",
    "sentenceZh": "請在這張紙上寫下你的名字。",
    "sentence2": "Is this green pencil case your favorite school item?",
    "sentence2Zh": "這個綠色筆袋是你最喜歡的學用品嗎？"
  },
  {
    "id": "junior-a-lot-of",
    "word": "a lot of",
    "zh": "許多的/很多的",
    "topic": "Articles",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/ə lɑːt ʌv/",
    "chunks": [
      "a",
      "lot",
      "of"
    ],
    "sentence": "There are a lot of colorful fish in the pond.",
    "sentenceZh": "池塘裡有許多色彩繽紛的魚。",
    "sentence2": "We bought a lot of red apples at the morning market.",
    "sentence2Zh": "我們在早市買了許多紅蘋果。"
  },
  {
    "id": "junior-across",
    "word": "across",
    "zh": "橫過/在...對面/穿過",
    "topic": "Prepositions",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/əˈkrɑːs/",
    "chunks": [
      "across"
    ],
    "sentence": "The dog ran across the street to chase a ball.",
    "sentenceZh": "狗跑過街道去追一個球。",
    "sentence2": "The friendly dog ran across the grass field to play.",
    "sentence2Zh": "那隻友善的狗跑過草地去玩耍。"
  },
  {
    "id": "junior-ago",
    "word": "ago",
    "zh": "在...以前",
    "topic": "Time",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/əˈɡoʊ/",
    "chunks": [
      "ago"
    ],
    "sentence": "He moved to New York three years ago.",
    "sentenceZh": "他三年前搬到了紐約。",
    "sentence2": "I started learning English three years ago.",
    "sentence2Zh": "我三年前開始學習英文。"
  },
  {
    "id": "junior-along",
    "word": "along",
    "zh": "沿著/順著/一起",
    "topic": "Prepositions",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/əˈlɑːŋ/",
    "chunks": [
      "along"
    ],
    "sentence": "We walked along the river and saw a ship.",
    "sentenceZh": "我們沿著河流散步並看到了一艘船。",
    "sentence2": "We walked slowly along the clean river bank.",
    "sentence2Zh": "我們沿著乾淨的河岸慢慢散步。"
  },
  {
    "id": "junior-before",
    "word": "before",
    "zh": "在...之前/以前",
    "topic": "Prepositions",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/bɪˈfɔːr/",
    "chunks": [
      "be",
      "fore"
    ],
    "sentence": "Wash your hands before you eat the apple.",
    "sentenceZh": "吃蘋果前請先洗手。",
    "sentence2": "Remember to wash your hands before eating dinner.",
    "sentence2Zh": "記得在吃晚餐前先洗手。"
  },
  {
    "id": "junior-between",
    "word": "between",
    "zh": "在...兩者之間",
    "topic": "Prepositions",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/bɪˈtwiːn/",
    "chunks": [
      "be",
      "tween"
    ],
    "sentence": "The bookstore is located between the post office and the bank.",
    "sentenceZh": "書店位於郵局和銀行之間。",
    "sentence2": "The library is located between the gym and the school gate.",
    "sentence2Zh": "圖書館位於體育館和校門之間。"
  },
  {
    "id": "junior-coffee",
    "word": "coffee",
    "zh": "咖啡",
    "topic": "Food",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/ˈkɑː.fi/",
    "chunks": [
      "cof",
      "fee"
    ],
    "sentence": "My father drank a cup of hot coffee this morning.",
    "sentenceZh": "我爸爸今天早上喝了一杯熱咖啡。",
    "sentence2": "My mother makes a hot cup of coffee every morning.",
    "sentence2Zh": "我媽媽每天早上泡一杯熱咖啡。"
  },
  {
    "id": "junior-dry",
    "word": "dry",
    "zh": "乾的/乾燥的/使乾燥",
    "topic": "Other adjectives",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/draɪ/",
    "chunks": [
      "dry"
    ],
    "sentence": "Hang your wet clothes outside to make them dry.",
    "sentenceZh": "把濕衣服掛在外面讓它們變乾。",
    "sentence2": "Put your wet shoes under the sun to dry them.",
    "sentence2Zh": "把濕鞋子放在太陽底下曬乾。"
  },
  {
    "id": "junior-everyone",
    "word": "everyone",
    "zh": "每個人/大家",
    "topic": "Pronouns",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/ˈev.ri.wʌn/",
    "chunks": [
      "ev",
      "ery",
      "one"
    ],
    "sentence": "Everyone in our class likes the kind teacher.",
    "sentenceZh": "我們班上的每個人都喜歡這位親切的老師。",
    "sentence2": "Everyone in our class got a gold star today.",
    "sentence2Zh": "我們班上的每個人今天都得到了一個金星獎章。"
  },
  {
    "id": "junior-gym",
    "word": "gym",
    "zh": "體育館/健身房",
    "topic": "Places",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/dʒɪm/",
    "chunks": [
      "gym"
    ],
    "sentence": "We played basketball in the school gym today.",
    "sentenceZh": "我們今天在學校體育館打了籃球。",
    "sentence2": "We practice volleyball in the school gym on rainy days.",
    "sentence2Zh": "下雨天我們在學校體育館練習排球。"
  },
  {
    "id": "junior-street",
    "word": "street",
    "zh": "街道",
    "topic": "Places",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/striːt/",
    "chunks": [
      "street"
    ],
    "sentence": "This busy street is full of cars and buses.",
    "sentenceZh": "這條忙碌的街道擠滿了汽車和公車。",
    "sentence2": "Please hold your parent's hand when crossing the street.",
    "sentence2Zh": "過馬路時請牽著父母的手。"
  },
  {
    "id": "junior-train",
    "word": "train",
    "zh": "火車/列車/訓練",
    "topic": "Transportation",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/treɪn/",
    "chunks": [
      "train"
    ],
    "sentence": "We took a fast train to go to Hualien.",
    "sentenceZh": "我們搭乘火車前往花蓮。",
    "sentence2": "We took a train to visit our grandparents last Sunday.",
    "sentence2Zh": "我們上星期天搭火車去拜訪我們的祖父母。"
  },
  {
    "id": "junior-was",
    "word": "was",
    "zh": "是/在(單數過去式)",
    "topic": "Be & Auxiliaries",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/wʌz/",
    "chunks": [
      "was"
    ],
    "sentence": "He was sick yesterday, so he stayed home.",
    "sentenceZh": "他昨天生病了，所以待在家。",
    "sentence2": "The weather was sunny and warm yesterday afternoon.",
    "sentence2Zh": "昨天下午的天氣晴朗且溫暖。"
  },
  {
    "id": "junior-were",
    "word": "were",
    "zh": "是/在(複數與第二人稱過去式)",
    "topic": "Be & Auxiliaries",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/wɝː/",
    "chunks": [
      "were"
    ],
    "sentence": "They were very excited about the school trip.",
    "sentenceZh": "他們對學校旅行感到非常興奮。",
    "sentence2": "The children were very excited about the sports festival.",
    "sentence2Zh": "孩子們對體育節/運動會感到非常興奮。"
  },
  {
    "id": "junior-wore",
    "word": "wore",
    "zh": "穿戴(過去式)",
    "topic": "Actions",
    "gradeBand": "G8",
    "grade": 8,
    "phonetic": "/wɔːr/",
    "chunks": [
      "wore"
    ],
    "sentence": "She wore a pretty blue dress to the party.",
    "sentenceZh": "她穿著一件漂亮的藍色洋裝去參加派對。",
    "sentence2": "She wore a warm yellow sweater on the chilly morning.",
    "sentence2Zh": "她在這寒冷的早上穿了一件保暖的黃色毛衣。"
  },
  {
    "id": "junior-already",
    "word": "already",
    "zh": "已經/早已",
    "topic": "Other adverbs",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ɑːlˈred.i/",
    "chunks": [
      "al",
      "ready"
    ],
    "sentence": "I have already finished all my homework today.",
    "sentenceZh": "我今天已經完成了所有的作業。",
    "sentence2": "I have already finished all my English spelling homework.",
    "sentence2Zh": "我早已完成了所有的英文拼字作業。"
  },
  {
    "id": "junior-also",
    "word": "also",
    "zh": "也/並且/此外",
    "topic": "Other adverbs",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ˈɑːl.soʊ/",
    "chunks": [
      "al",
      "so"
    ],
    "sentence": "He likes soccer, and he also plays baseball.",
    "sentenceZh": "他喜歡足球，而且他也打棒球。",
    "sentence2": "My brother plays the piano, and he also plays the drum.",
    "sentence2Zh": "我哥哥會彈鋼琴，他也會打鼓。"
  },
  {
    "id": "junior-been",
    "word": "been",
    "zh": "是/在(過去分詞)",
    "topic": "Be & Auxiliaries",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/bɪn/",
    "chunks": [
      "been"
    ],
    "sentence": "Have you ever been to the Taipei zoo?",
    "sentenceZh": "你曾去過台北動物園嗎？",
    "sentence2": "I have been to the Merlion Park in Singapore once.",
    "sentence2Zh": "我曾去過一次新加坡的魚尾獅公園。"
  },
  {
    "id": "junior-bring",
    "word": "bring",
    "zh": "帶來/拿來/攜帶",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/brɪŋ/",
    "chunks": [
      "bring"
    ],
    "sentence": "Remember to bring your English dictionary tomorrow.",
    "sentenceZh": "明天記得帶上你的英文字典。",
    "sentence2": "Remember to bring your water bottle to school daily.",
    "sentence2Zh": "記得每天帶你的水瓶上學。"
  },
  {
    "id": "junior-busy",
    "word": "busy",
    "zh": "忙碌的/繁忙的",
    "topic": "Personal characteristics",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ˈbɪz.i/",
    "chunks": [
      "busy"
    ],
    "sentence": "Our teacher is very busy grading the papers.",
    "sentenceZh": "我們的老師忙著批改考卷。",
    "sentence2": "The busy bee travels from flower to flower for honey.",
    "sentence2Zh": "忙碌的蜜蜂在花朵間採蜜。"
  },
  {
    "id": "junior-cheese",
    "word": "cheese",
    "zh": "起司/乾酪",
    "topic": "Food",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/tʃiːz/",
    "chunks": [
      "cheese"
    ],
    "sentence": "Put a slice of cheese on the hot hamburger.",
    "sentenceZh": "在熱漢堡上放一片起司。",
    "sentence2": "My sister likes to eat ham and cheese sandwiches.",
    "sentence2Zh": "我妹妹喜歡吃火腿起司三明治。"
  },
  {
    "id": "junior-expensive",
    "word": "expensive",
    "zh": "昂貴的/貴的",
    "topic": "Other adjectives",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ɪkˈspen.sɪv/",
    "chunks": [
      "ex",
      "pen",
      "sive"
    ],
    "sentence": "This computer is too expensive for me to buy.",
    "sentenceZh": "這台電腦太昂貴了，我買不起。",
    "sentence2": "This new electronic toy is too expensive to buy.",
    "sentence2Zh": "這個新電子玩具太貴了買不起。"
  },
  {
    "id": "junior-finish",
    "word": "finish",
    "zh": "完成/結束/吃完",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ˈfɪn.ɪʃ/",
    "chunks": [
      "fin",
      "ish"
    ],
    "sentence": "We must finish our work before going home.",
    "sentenceZh": "我們回家前必須完成我們的工作。",
    "sentence2": "I always finish my daily tasks before playing soccer.",
    "sentence2Zh": "我總是踢足球前完成我每日的任務。"
  },
  {
    "id": "junior-hear",
    "word": "hear",
    "zh": "聽到/聽見/聽說",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/hɪr/",
    "chunks": [
      "hear"
    ],
    "sentence": "Did you hear the birds singing in the tree?",
    "sentenceZh": "你聽到樹上鳥兒在唱歌了嗎？",
    "sentence2": "I hear the cheerful sounds of children playing outside.",
    "sentence2Zh": "我聽到外面孩子們玩耍的歡快聲音。"
  },
  {
    "id": "junior-just",
    "word": "just",
    "zh": "剛剛/僅僅/只是/公正的",
    "topic": "Other adverbs",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/dʒʌst/",
    "chunks": [
      "just"
    ],
    "sentence": "I just saw a cute squirrel in the garden.",
    "sentenceZh": "我剛剛在花園裡看到一隻可愛的松鼠。",
    "sentence2": "He just finished his homework a few minutes ago.",
    "sentence2Zh": "他幾分鐘前剛寫完功課。"
  },
  {
    "id": "junior-large",
    "word": "large",
    "zh": "大的/巨大的",
    "topic": "Sizes & measurements",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/lɑːrdʒ/",
    "chunks": [
      "large"
    ],
    "sentence": "They live in a large house with a garden.",
    "sentenceZh": "他們住在一棟帶花園的寬敞房子裡。",
    "sentence2": "We have a large grass field to play soccer at school.",
    "sentence2Zh": "我們學校有一個大草地可以踢足球。"
  },
  {
    "id": "junior-lucky",
    "word": "lucky",
    "zh": "幸運的/吉祥的",
    "topic": "Personal characteristics",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ˈlʌk.i/",
    "chunks": [
      "lucky"
    ],
    "sentence": "You are very lucky to win the first prize.",
    "sentenceZh": "你非常幸運能贏得一等獎。",
    "sentence2": "I got a lucky gold star card from our principal today.",
    "sentence2Zh": "我今天從校長那裡得到了一張幸運的金星卡。"
  },
  {
    "id": "junior-often",
    "word": "often",
    "zh": "常常/經常",
    "topic": "Other adverbs",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ˈɑːf.tən/",
    "chunks": [
      "of",
      "ten"
    ],
    "sentence": "We often play games together on weekends.",
    "sentenceZh": "我們週末經常一起玩遊戲。",
    "sentence2": "We often visit the library to read new books.",
    "sentence2Zh": "我們經常造訪圖書館閱讀新書。"
  },
  {
    "id": "junior-popular",
    "word": "popular",
    "zh": "受歡迎的/流行的",
    "topic": "Personal characteristics",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ˈpɑː.pjə.lɚ/",
    "chunks": [
      "pop",
      "u",
      "lar"
    ],
    "sentence": "Benson is a very popular student in our school.",
    "sentenceZh": "班森是我們學校非常受歡迎的學生。",
    "sentence2": "Baseball is a very popular sport among students here.",
    "sentence2Zh": "棒球是這裡學生中非常受歡迎的運動。"
  },
  {
    "id": "junior-since",
    "word": "since",
    "zh": "自從/自...以來/因為",
    "topic": "Prepositions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/sɪns/",
    "chunks": [
      "since"
    ],
    "sentence": "I have studied English since I was seven.",
    "sentenceZh": "我自從七歲起就學習英文。",
    "sentence2": "I have been learning English since I was seven.",
    "sentence2Zh": "我自從七歲起就一直在學習英文。"
  },
  {
    "id": "junior-subject",
    "word": "subject",
    "zh": "學科/科目/主題",
    "topic": "School",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ˈsʌb.dʒekt/",
    "chunks": [
      "sub",
      "ject"
    ],
    "sentence": "What is your favorite subject, math or science?",
    "sentenceZh": "你最喜歡的學科是什麼，數學還是自然科學？",
    "sentence2": "English is my favorite subject because it is fun.",
    "sentence2Zh": "英文是我最喜歡的學科，因為很有趣。"
  },
  {
    "id": "junior-think",
    "word": "think",
    "zh": "想/思考/認為/以為",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/θɪŋk/",
    "chunks": [
      "think"
    ],
    "sentence": "I think reading books is a great hobby.",
    "sentenceZh": "我認為閱讀書籍是一個極佳的嗜好。",
    "sentence2": "Think carefully before writing down your final answer.",
    "sentence2Zh": "寫下最終答案前請仔細思考。"
  },
  {
    "id": "junior-tomato",
    "word": "tomato",
    "zh": "番茄",
    "topic": "Food",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/təˈmeɪ.t̬oʊ/",
    "chunks": [
      "toma",
      "to"
    ],
    "sentence": "We need some fresh tomatoes to make the salad.",
    "sentenceZh": "我們需要一些新鮮番茄來製作沙拉。",
    "sentence2": "We picked some fresh red tomatoes from the farm garden.",
    "sentence2Zh": "我們在農場花園裡摘了一些新鮮的紅番茄。"
  },
  {
    "id": "junior-use",
    "word": "use",
    "zh": "使用/用途",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/juːz/",
    "chunks": [
      "use"
    ],
    "sentence": "Do you know how to use this dictionary?",
    "sentenceZh": "你知道如何使用這本字典嗎？",
    "sentence2": "May I use your ruler to draw a straight line, please?",
    "sentence2Zh": "我可以用你的尺來畫一條直線嗎？"
  },
  {
    "id": "junior-caught",
    "word": "caught",
    "zh": "接住/抓住(過去式/過去分詞)",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/kɑːt/",
    "chunks": [
      "caught"
    ],
    "sentence": "The goalkeeper caught the soccer ball successfully.",
    "sentenceZh": "守門員成功接住了足球。",
    "sentence2": "The goalie caught the soccer ball with a quick dive.",
    "sentence2Zh": "守門員一個快速飛身接住了足球。"
  },
  {
    "id": "junior-flown",
    "word": "flown",
    "zh": "飛/飛行(過去分詞)",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/floʊn/",
    "chunks": [
      "flown"
    ],
    "sentence": "Many birds have flown to warm places in winter.",
    "sentenceZh": "許多鳥在冬天已經飛往溫暖的地方。",
    "sentence2": "The wild geese have already flown to warm areas.",
    "sentence2Zh": "大雁們已經飛往溫暖的地區。"
  },
  {
    "id": "junior-felt",
    "word": "felt",
    "zh": "感覺(過去式/過去分詞)",
    "topic": "Other verbs",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/felt/",
    "chunks": [
      "felt"
    ],
    "sentence": "He felt very happy when he won the game.",
    "sentenceZh": "當他贏了比賽時感到非常高興。",
    "sentence2": "I felt very warm after drinking a cup of hot milk.",
    "sentence2Zh": "喝了一杯熱牛奶後我感覺非常溫暖。"
  },
  {
    "id": "junior-found",
    "word": "found",
    "zh": "找到(過去式/過去分詞)/建立",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/faʊnd/",
    "chunks": [
      "found"
    ],
    "sentence": "She found her lost key under the kitchen table.",
    "sentenceZh": "她在廚房桌子底下找到了她遺失的鑰匙。",
    "sentence2": "She found a beautiful shell in the sand yesterday.",
    "sentence2Zh": "她昨天在沙灘上找到了一個美麗的貝殼。"
  },
  {
    "id": "junior-grown",
    "word": "grown",
    "zh": "生長/成長(過去分詞)/成年的",
    "topic": "Other verbs",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ɡroʊn/",
    "chunks": [
      "grown"
    ],
    "sentence": "The little tree has grown tall in the garden.",
    "sentenceZh": "那棵小樹在花園裡已經長高了。",
    "sentence2": "The small seeds have grown into beautiful yellow flowers.",
    "sentence2Zh": "小種子已經長成了美麗的黃花。"
  },
  {
    "id": "junior-grew",
    "word": "grew",
    "zh": "生長/成長(過去式)",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ɡruː/",
    "chunks": [
      "grew"
    ],
    "sentence": "The small puppy grew into a big strong dog.",
    "sentenceZh": "小狗長大成了一隻強壯的大狗。",
    "sentence2": "The baby puppy grew very fast in just three months.",
    "sentence2Zh": "幼犬寶寶在短短三個月內就長得非常快。"
  },
  {
    "id": "junior-heard",
    "word": "heard",
    "zh": "聽見(過去式)",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/hɝːd/",
    "chunks": [
      "heard"
    ],
    "sentence": "I heard someone knocking on the door yesterday.",
    "sentenceZh": "我昨天聽到有人在敲門。",
    "sentence2": "We heard a beautiful bird singing in the garden.",
    "sentence2Zh": "我們聽到一隻美麗的鳥在花園裡唱歌。"
  },
  {
    "id": "junior-known",
    "word": "known",
    "zh": "知道/認識(過去分詞)",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/noʊn/",
    "chunks": [
      "known"
    ],
    "sentence": "He has been known as a kind doctor here.",
    "sentenceZh": "他一直以來在這裡被知曉是一位親切的醫生。",
    "sentence2": "This school is well known for its physical education club.",
    "sentence2Zh": "這所學校以其體育社團而聞名。"
  },
  {
    "id": "junior-spoken",
    "word": "spoken",
    "zh": "說/講(過去分詞)",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ˈspoʊ.kən/",
    "chunks": [
      "spo",
      "ken"
    ],
    "sentence": "English is spoken by many people in the world.",
    "sentenceZh": "英語被世界上許多人所說。",
    "sentence2": "The spoken words of gratitude made mother very happy.",
    "sentence2Zh": "口頭說出的感激之言讓媽媽非常高興。"
  },
  {
    "id": "junior-stood",
    "word": "stood",
    "zh": "站立(過去式)",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/stʊd/",
    "chunks": [
      "stood"
    ],
    "sentence": "The students stood up when the teacher walked in.",
    "sentenceZh": "當老師走進來時，學生們站了起來。",
    "sentence2": "He stood by the school gate to welcome the students.",
    "sentence2Zh": "他站在校門口迎接學生。"
  },
  {
    "id": "junior-thought",
    "word": "thought",
    "zh": "想/思考/想法(過去式)",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/θɑːt/",
    "chunks": [
      "thought"
    ],
    "sentence": "I thought the English test was very easy.",
    "sentenceZh": "我本來以為英文測驗很簡單。",
    "sentence2": "I thought about your wonderful idea all afternoon.",
    "sentence2Zh": "我整個下午都在思考你那極棒的主意。"
  },
  {
    "id": "junior-written",
    "word": "written",
    "zh": "寫/書寫(過去分詞)",
    "topic": "Actions",
    "gradeBand": "G9",
    "grade": 9,
    "phonetic": "/ˈrɪt.ən/",
    "chunks": [
      "writ",
      "ten"
    ],
    "sentence": "She has written many interesting stories for kids.",
    "sentenceZh": "她已經為孩子們寫了許多有趣的故事。",
    "sentence2": "All the new English words are written on the blackboard.",
    "sentence2Zh": "所有的新英文單字都寫在黑板上。"
  }
];

  const helper = {
    getAll() { return bank; },
    getTopics() {
      const counts = {};
      bank.forEach(w => { counts[w.topic] = (counts[w.topic] || 0) + 1; });
      return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    },
    getByTopic(topic) {
      if (!topic || topic === 'all') return bank;
      return bank.filter(w => w.topic.toLowerCase() === topic.toLowerCase());
    },
    getByGrade(gradeBand) {
      if (!gradeBand || gradeBand === 'all') return bank;
      return bank.filter(w => w.gradeBand.toLowerCase() === gradeBand.toLowerCase());
    },
    findByWord(word) {
      if (!word) return null;
      const clean = word.trim().toLowerCase();
      return bank.find(w => w.word.toLowerCase() === clean);
    }
  };

  root.PASSPORT_WORD_BANK = bank;
  root.PassportBankHelper = helper;
})(typeof window !== 'undefined' ? window : global);
