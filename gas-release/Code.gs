/** GENERATED complete v2.6.0 backend. Replace Code.gs; retain the existing deployment URL.
 * Do not run initSpreadsheet on an existing database. Old separate helper files may remain.
 * Every module below is private so it cannot collide with old helper declarations.
 */
var WHIMSY_BACKEND_20261017=(function(){
var window={},globalThis=window;

// --- Code.gs ---
/**
 * 《英語魔法探險家：秘境逃脫任務》v2.6.0 GAS source module.
 * Existing service: paste the complete generated gas-release/Code.gs into Code.gs,
 * then update the existing Web App deployment version. Keep its URL and permissions.
 * Never run initSpreadsheet against an existing student database.
 * Module-based development requires every module listed in build-gas-bundle.cjs.
 * User instructions: gas-release/README.md.
 */

// 試算表分頁名稱定義
const SHEET_STUDENTS = "Students";
const SHEET_LOGS = "Passport_Logs";
const SHEET_CONFIG = "Config";

// 校本前端安全防護 Token (需與前端 CloudSyncManager 一致)
const APP_SECURITY_TOKEN = "whimsy_forest_escape_2026";

/**
 * 學生公開顯示姓名遮罩（不等同完整去識別化或身分驗證）
 */
function maskStudentName(name) {
  const str = String(name || "").trim();
  if (!str || str.startsWith("見習")) return str;
  if (str.length === 2) {
    return str[0] + "○";
  } else if (str.length === 3) {
    return str[0] + "○" + str[2];
  } else if (str.length === 4) {
    return str[0] + "○○" + str[3];
  } else if (str.length > 4) {
    return str.slice(0, 1) + "***" + str.slice(-1);
  }
  return str;
}

/**
 * 試算表自動初始化函數 (初次使用時執行一次即可)
 */
function initSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. 初始化學生名冊與存檔表
  let studentSheet = ss.getSheetByName(SHEET_STUDENTS);
  if (!studentSheet) {
    studentSheet = ss.insertSheet(SHEET_STUDENTS);
    studentSheet.appendRow([
      "學號/識別碼", "年級", "班級", "座號", "姓名",
      "總經驗值(XP)", "冒險者等級", "累計星數", "已通過單字清單",
      "獲得徽章數", "最後遊玩時間", "建立時間"
    ]);
    studentSheet.getRange("A1:L1").setBackground("#4a5568").setFontColor("#ffffff").setFontWeight("bold");
    studentSheet.setFrozenRows(1);
  }

  // 2. 初始化通關流水帳日誌表
  let logSheet = ss.getSheetByName(SHEET_LOGS);
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEET_LOGS);
    logSheet.appendRow([
      "時間戳記", "學號", "年級", "班級", "座號", "姓名",
      "關卡空間", "挑戰單字", "獲得XP", "是否教師跳過", "用戶代理"
    ]);
    logSheet.getRange("A1:K1").setBackground("#2b6cb0").setFontColor("#ffffff").setFontWeight("bold");
    logSheet.setFrozenRows(1);
  }

  // 3. 初始化數值設定表
  let configSheet = ss.getSheetByName(SHEET_CONFIG);
  if (!configSheet) {
    configSheet = ss.insertSheet(SHEET_CONFIG);
    configSheet.appendRow(["設定項目 (Key)", "數值 (Value)", "說明 (Description)"]);
    // Teacher credentials belong to Script Properties; configureTeacherAccess sets them.
    configSheet.appendRow(["speech_pass_threshold", "0.75", "口說信心度及格門檻 (0.5~1.0)"]);
    configSheet.appendRow(["base_word_xp", "50", "每個單字基礎經驗值"]);
    configSheet.appendRow(["game_title", "新港魔法學院：英語冒險護照", "遊戲全銜"]);
    configSheet.getRange("A1:C1").setBackground("#2c7a7b").setFontColor("#ffffff").setFontWeight("bold");
    configSheet.setFrozenRows(1);
  }

  // 插入一筆預設示範榜單資料
  if (studentSheet.getLastRow() === 1) {
    studentSheet.appendRow([
      "50101", "5", "501", "01", "小狐狸 Foxy", 550, 6, 12, "LIGHT,BOOK,KEY,RED,BLUE,STAR,CAT,FISH,DOOR,FLOWER,OPEN,SUN", 5, new Date(), new Date()
    ]);
    studentSheet.appendRow([
      "50102", "5", "501", "02", "小兔 Bunny", 350, 4, 8, "LIGHT,BOOK,KEY,RED,BLUE,STAR,CAT,FISH", 3, new Date(), new Date()
    ]);
  }
}

/**
 * 處理 GET 請求 (查詢排行榜、學生存檔、遊戲設定)
 */
function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const action = params.action || "ping";
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. 健康檢查 Ping (允許無 Token 偵測伺服器存活)
    if (action === "ping") {
      return makeJsonResponse({ status: "success", message: "Whimsy Forest GAS API is active!", learningProtocol: "learning-v1", learningWords: LEARNING_WORDS.length, learningSentences: LEARNING_SENTENCES.length, recordProtocol: "record-v2", teacherProtocol: "teacher-v1", adventureZones:Object.keys(ADVENTURE_CHECKPOINT_ZONES), build: "20261017-v2.6.0", timestamp: new Date() });
    }

    // 安全性 Token 驗證 (除 ping 外，其餘操作皆需檢驗校本密鑰)
    const token = params.token || "";
    if (token !== APP_SECURITY_TOKEN) {
      return makeJsonResponse({ status: "error", message: "Unauthorized access: Invalid security token" });
    }

    // 2. 取得排行榜 (依年級、班級或全校)
    if (action === "getLeaderboard") {
      const classFilter = params.classId || "";
      const studentSheet = ss.getSheetByName(SHEET_STUDENTS);
      if (!studentSheet) {
        return makeJsonResponse({ status: "error", message: "Students sheet not found" });
      }

      const rows = studentSheet.getDataRange().getValues();
      if (rows.length <= 1) {
        return makeJsonResponse({ status: "success", leaderboard: [] });
      }

      const students = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const student = {
          studentId: String(r[0] || ""),
          grade: String(r[1] || ""),
          classId: String(r[2] || ""),
          seatNo: String(r[3] || ""),
          name: maskStudentName(r[4] || "無名魔法使"), // 個資去識別化保護
          xp: Number(r[5] || 0),
          level: Number(r[6] || 1),
          stars: Number(r[7] || 0),
          passedCount: r[8] ? String(r[8]).split(",").filter(Boolean).length : 0,
          badgesCount: Number(r[9] || 0),
          lastActive: r[10] ? Utilities.formatDate(new Date(r[10]), "GMT+8", "yyyy/MM/dd HH:mm") : ""
        };

        if (!classFilter || student.classId === classFilter) {
          students.push(student);
        }
      }

      // 依總 XP 降冪排序
      students.sort((a, b) => b.xp - a.xp);

      // 取前 50 名
      const leaderboard = students.slice(0, 50).map((s, idx) => ({
        rank: idx + 1,
        ...s
      }));

      return makeJsonResponse({ status: "success", leaderboard: leaderboard, totalCount: students.length });
    }

    // 3. 取得個別學生檔案
    if (action === "getStudent") {
      const studentId = params.studentId;
      if (!studentId) {
        return makeJsonResponse({ status: "error", message: "Missing studentId" });
      }

      const studentSheet = ss.getSheetByName(SHEET_STUDENTS);
      const rows = studentSheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(studentId)) {
          const r = rows[i];
          return makeJsonResponse({
            status: "success",
            student: {
              studentId: String(r[0]),
              grade: String(r[1]),
              classId: String(r[2]),
              seatNo: String(r[3]),
              name: maskStudentName(r[4]),
              xp: Number(r[5]),
              level: Number(r[6]),
              stars: Number(r[7]),
              completedWords: r[8] ? String(r[8]).split(",").filter(Boolean) : [],
              badgesCount: Number(r[9])
            }
          });
        }
      }

      return makeJsonResponse({ status: "not_found", message: "Student record not found" });
    }

    // 4. 教師後台一鍵統計報表 (generateReport)
    if (action === 'generateReport') return makeJsonResponse({status:'error',message:'請以教師工作階段查詢報表',code:'teacher_required'});

    return makeJsonResponse({ status: "error", message: "Unknown action: " + action });

  } catch (err) {
    return makeJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * 處理 POST 請求 (登入/註冊學生、寫入口說通關紀錄)
 */
function doPost(e) {
  // 關鍵保護：使用 LockService 防止全班學生同時點選過關造成寫入衝突
  const lock = LockService.getScriptLock();
  const successLock = lock.tryLock(15000); // 最多等待 15 秒

  if (!successLock) {
    return makeJsonResponse({ status: "busy", message: "Server busy, please retry later." });
  }

  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter || {};
    }

    const action = payload.action;
    const token = payload.token || "";
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 安全性 Token 驗證：POST 請求必須附帶校本安全密鑰
    if (token !== APP_SECURITY_TOKEN) {
      return makeJsonResponse({ status: "error", message: "Unauthorized access: Invalid security token" });
    }

    if(action==='teacherAuthenticate')return makeJsonResponse(teacherAuthenticate(payload));
    if(action==='generateReport'){
      if(!teacherAuthorized(payload))return makeJsonResponse({status:'error',code:'teacher_required',message:'請先完成教師驗證'});
      return teacherReportResponse(payload,ss);
    }

    // Learning requests must pass the same token verification above as all other POST requests.
    if (action === 'learningGet' || action === 'learningEvent') {
      return makeJsonResponse(learningHubAction(payload, ss));
    }

    // Separate puzzle checkpoint protocol. The existing script lock protects revisions.
    if (["adventureCapabilities", "saveAdventure", "getAdventure"].includes(action)) {
      return makeJsonResponse(adventureCheckpointAction(payload, ss));
    }

    // 1. 學生登入或建立帳號
    if (action === "loginOrRegister") {
      const grade = String(payload.grade || "5");
      const classId = String(payload.classId || "501");
      const seatNo = String(payload.seatNo || "01").padStart(2, "0");
      const name = String(payload.name || "學生").trim();
      const studentId = String(payload.studentId || (classId + seatNo));

      const studentSheet = ss.getSheetByName(SHEET_STUDENTS);
      const rows = studentSheet.getDataRange().getValues();
      let foundIndex = -1;

      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === studentId) {
          foundIndex = i + 1; // 1-based index
          break;
        }
      }

      const now = new Date();

      if (foundIndex > 0) {
        // 更新最後登入時間
        studentSheet.getRange(foundIndex, 11).setValue(now);
        const store = studentRecordLoad(ss, studentId);
        studentRecordFinish(store);
        const r = studentSheet.getDataRange().getValues()[foundIndex - 1];
        return makeJsonResponse({
          status: "success",
          isNew: false,
          student: {
            studentId: String(r[0]),
            grade: String(r[1]),
            classId: String(r[2]),
            seatNo: String(r[3]),
            name: String(r[4]),
            xp: Number(r[5]),
            level: Number(r[6]),
            accessLevel: store.student.accessLevel,
            stars: Number(r[7]),
            completedWords: r[8] ? String(r[8]).split(",").filter(Boolean) : [],
            badgesCount: Number(r[9])
          }
        });
      } else {
        // 新建學生記錄
        studentSheet.appendRow([
          studentId, grade, classId, seatNo, name,
          0, 1, 0, "", 0, now, now
        ]);

        return makeJsonResponse({
          status: "success",
          isNew: true,
          student: {
            studentId: studentId,
            grade: grade,
            classId: classId,
            seatNo: seatNo,
            name: name,
            xp: 0,
            level: 1,
            stars: 0,
            completedWords: [],
            badgesCount: 0
          }
        });
      }
    }

    if (action === 'recordPass') return makeJsonResponse(recordPassAction(payload, ss));

    return makeJsonResponse({ status: "error", message: "Unknown action: " + action });

  } catch (err) {
    return makeJsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * 輔助函數：包裝標準 JSON 響應
 */
function makeJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function teacherReportResponse(params,ss){

      const classFilter = params.classId || "";
      const studentSheet = ss.getSheetByName(SHEET_STUDENTS);
      if (!studentSheet) {
        return makeJsonResponse({ status: "error", message: "Students sheet not found" });
      }

      const rows = studentSheet.getDataRange().getValues();
      if (rows.length <= 1) {
        return makeJsonResponse({ status: "success", report: { totalStudents: 0, classStats: {} } });
      }

      const classStats = {};
      let totalSchoolXP = 0;
      let totalSchoolWordsPassed = 0;

      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const cid = String(r[2] || "未指定");
        const xp = Number(r[5] || 0);
        const level = Number(r[6] || 1);
        const words = r[8] ? String(r[8]).split(",").filter(Boolean) : [];
        const wordsCount = words.length;

        if (!classStats[cid]) {
          classStats[cid] = {
            classId: cid,
            grade: String(r[1] || ""),
            studentCount: 0,
            totalXP: 0,
            avgXP: 0,
            avgLevel: 0,
            totalWordsPassed: 0,
            avgWordsPassed: 0,
            certifiedCount: 0, // 達 10 個單字以上獲得認證之學生
            topStudent: null
          };
        }

        const cs = classStats[cid];
        cs.studentCount++;
        cs.totalXP += xp;
        cs.totalWordsPassed += wordsCount;
        if (wordsCount >= 10) cs.certifiedCount++;

        if (!cs.topStudent || xp > cs.topStudent.xp) {
          cs.topStudent = { name: maskStudentName(r[4] || ""), seatNo: String(r[3] || ""), xp: xp, level: level };
        }

        totalSchoolXP += xp;
        totalSchoolWordsPassed += wordsCount;
      }

      // 計算平均值與通過率
      Object.keys(classStats).forEach(cid => {
        const cs = classStats[cid];
        cs.avgXP = Math.round(cs.totalXP / cs.studentCount);
        cs.avgWordsPassed = (cs.totalWordsPassed / cs.studentCount).toFixed(1);
        cs.certificationRate = `${Math.round((cs.certifiedCount / cs.studentCount) * 100)}%`;
      });

      return makeJsonResponse({
        status: "success",
        generatedAt: Utilities.formatDate(new Date(), "GMT+8", "yyyy/MM/dd HH:mm:ss"),
        report: {
          totalRegisteredStudents: rows.length - 1,
          totalSchoolXP: totalSchoolXP,
          totalSchoolWordsPassed: totalSchoolWordsPassed,
          classStats: classFilter ? { [classFilter]: classStats[classFilter] || null } : classStats
        }
      });

}


// --- AdventureSchema.gs ---
// GENERATED by scripts/build-gas-schema.cjs. Do not edit independently.
/* Connected restaurant chapter. Pure state also runs in the checkpoint validator. */
(function(root){
 'use strict';
 const initial=()=>({accepted:false,key:false,pantryOpen:false,ingredients:[0,0,0],step:0,cooked:false,served:false,spokenSteps:[],deliverySpoken:false});
 const exact=s=>s.ingredients[0]===2&&s.ingredients[1]===1&&s.ingredients[2]===0;
 function validate(raw){
  if(!raw||['accepted','key','pantryOpen','cooked','served'].some(k=>typeof raw[k]!=='boolean')||!Array.isArray(raw.ingredients)||raw.ingredients.length!==3||!raw.ingredients.every(n=>Number.isInteger(n)&&n>=0&&n<=3)||!Number.isInteger(raw.step)||raw.step<0||raw.step>3)return null;
  const s={...initial(),...Object.fromEntries(Object.keys(initial()).map(k=>[k,k==='ingredients'?[...raw[k]]:k==='spokenSteps'?[]:k==='deliverySpoken'?false:raw[k]]))};
  if(!s.accepted){s.key=false;s.pantryOpen=false;s.ingredients=[0,0,0];}
  if(!s.key)s.pantryOpen=false;
  if(!s.pantryOpen)s.ingredients=[0,0,0];
  if(raw.spokenSteps!==undefined&&(!Array.isArray(raw.spokenSteps)||raw.spokenSteps.length>3||raw.spokenSteps.some((w,i)=>w!==['WASH','PUT','COOK'][i])))return null;
  s.spokenSteps=Array.isArray(raw.spokenSteps)?[...raw.spokenSteps]:[];s.deliverySpoken=raw.deliverySpoken===true;
  s.step=Math.min(s.step,s.spokenSteps.length);if(!s.pantryOpen||!exact(s))s.step=0;
  s.spokenSteps=s.spokenSteps.slice(0,s.step);s.cooked=s.cooked&&s.step===3;s.served=s.served&&s.cooked&&s.deliverySpoken;if(!s.served)s.deliverySpoken=false;
  return s;
 }
 const solved=s=>!!validate(s)?.served;
 function requiredWord(a){return a?.type==='order'||a?.type==='serve'?'SOUP':a?.type==='key'?'KEY':a?.type==='door'?'OPEN':a?.type==='ingredient'?['EGG','PUMPKIN','LEMON'][a.index]:a?.type==='prepare'&&['WASH','PUT','COOK'].includes(a.value)?a.value:null;}
 function canPerform(raw,a){const s=validate(raw)||initial();if(s.served)return false;switch(a?.type){case 'order':return !s.accepted;case 'key':return s.accepted&&!s.key;case 'door':return s.key&&!s.pantryOpen;case 'ingredient':return s.pantryOpen&&!s.cooked&&Number.isInteger(a.index)&&a.index>=0&&a.index<3&&[-1,1].includes(a.delta)&&s.ingredients[a.index]+a.delta>=0&&s.ingredients[a.index]+a.delta<=3;case 'prepare':return s.pantryOpen&&exact(s)&&!s.cooked&&a.value===['WASH','PUT','COOK'][s.step];case 'serve':return s.cooked&&!s.served;default:return false;}}
 function transition(raw,a){
  const s=validate(raw)||initial();let message='看看英語線索，再試下一步。';
  if(!a)return {state:s,message};if(s.served)return {state:s,message:'熱湯已送達！可以返回陽光微風市集，或繼續練習英語。'};
  const word=requiredWord(a);if(word&&a.verifiedWord!==word)return {state:s,message:'請先口說 '+word+' 並通過辨識，才會完成這個步驟。'};
  if(a.type==='order'){s.accepted=true;message='訂單已接下：Two eggs and one pumpkin, please.';}
  else if(!s.accepted)message='先到餐廳的訂單台接下任務。';
  else if(a.type==='key'){s.key=true;message='找到椅子下的 KEY！拿它到廚房東側打開儲藏室。';}
  else if(a.type==='door'){if(s.key){s.pantryOpen=true;message='儲藏室已打開。依訂單選食材，選錯也能放回。';}else message='Find the key under the chair. 鑰匙在餐廳的椅子下。';}
  else if(a.type==='ingredient'&&s.pantryOpen&&!s.cooked&&Number.isInteger(a.index)&&a.index>=0&&a.index<3&&[-1,1].includes(a.delta)){s.ingredients[a.index]=Math.max(0,Math.min(3,s.ingredients[a.index]+a.delta));s.step=0;s.spokenSteps=[];message='籃子：雞蛋 '+s.ingredients[0]+'、南瓜 '+s.ingredients[1]+'、檸檬 '+s.ingredients[2]+'。';}
  else if(a.type==='prepare'&&!s.cooked){if(!exact(s)||!s.pantryOpen)message='先依訂單準備兩顆雞蛋、一顆南瓜；不需要檸檬。';else if(a.value===['WASH','PUT','COOK'][s.step]){s.spokenSteps.push(a.value);s.step++;s.cooked=s.step===3;message=s.cooked?'湯煮好了！回餐廳的訂單台送餐。':'完成 '+a.value+'！下一步是 '+['WASH','PUT','COOK'][s.step]+'。';}else {s.step=0;s.spokenSteps=[];message='順序不同，再從 WASH → PUT → COOK 試試，食材仍在籃子裡。';}}
  else if(a.type==='serve'){if(s.cooked){s.served=true;s.deliverySpoken=true;message='Here is your soup. 客人收到熱湯，魔法餐廳任務完成！';}else message='熱湯還沒準備好，先到廚房依步驟料理。';}
  return {state:s,message};
 }
 function hint(raw){const s=validate(raw)||initial();let id='restaurant_order',clues=['先到餐廳的訂單台接單。','Two eggs and one pumpkin, please.'];if(!s.accepted)return {key:'zone11:order',word:null,targetId:id,clues};if(!s.key){id='restaurant_key';clues=['Find the key under the chair.','看看餐廳左側椅子的下方；可以拖曳向下看。'];}else if(s.key&&!s.pantryOpen){id='restaurant_door';clues=['拿鑰匙打開廚房東側的儲藏室。','穿過 KITCHEN 門口，往右找到 PANTRY。'];}else if(s.pantryOpen&&!exact(s)){id='restaurant_ingredient_'+(s.ingredients[2]?'2':s.ingredients[0]!==2?'0':'1');clues=['訂單需要兩顆雞蛋與一顆南瓜。','在儲藏室靠近食材箱取用；多拿的食材可以放回。'];}else if(!s.cooked){id='restaurant_'+['wash','put','cook'][s.step];clues=['WASH first. PUT next. COOK last.','依序到水槽、備料台、爐台互動。'];}else {id='restaurant_order';clues=s.served?['魔法餐廳任務完成！','可以返回陽光微風市集，或靠近物件練習英語。']:['Here is your soup.','回到餐廳的訂單台，把熱湯送給客人。'];}return {key:'zone11:'+JSON.stringify(s),word:null,targetId:id,clues};}
 const api={initial,validate,solved,transition,hint,requiredWord,canPerform};root.RestaurantChapter=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
/* School-inspired adventure; facts and fictional tasks are documented separately. */
(function(root){
 'use strict';
 const words=['SCHOOL','LISTEN','CLASSROOM','PAPER','DRAW','DRUM','LION','WELCOME'];
 const initial=()=>({stage:0,spoken:[],history:null,drawing:null,rhythm:[]});
 const rhythmOK=s=>JSON.stringify(s.rhythm)==='[1,1,2]';
 function validate(raw){
  if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((w,i)=>w!==words[i])||![null,1960,1963,2021].includes(raw.history)||![null,'LION','RABBIT','FISH'].includes(raw.drawing)||!Array.isArray(raw.rhythm)||raw.rhythm.length>3||raw.rhythm.some(n=>n!==1&&n!==2))return null;
  const s={stage:Math.min(raw.stage,raw.spoken.length),spoken:[...raw.spoken],history:raw.history,drawing:raw.drawing,rhythm:[...raw.rhythm]};
  if(s.stage>2&&s.history!==1963)s.stage=2;if(s.stage>4&&s.drawing!=='LION')s.stage=4;if(s.stage>6&&!rhythmOK(s))s.stage=6;s.spoken=s.spoken.slice(0,s.stage);return s;
 }
 const solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<words.length&&typeof word==='string'&&word===words[s.stage]&&(s.stage!==2||s.history===1963)&&(s.stage!==4||s.drawing==='LION')&&(s.stage!==6||rhythmOK(s));}
 function transition(raw,a){const s=validate(raw)||initial();let message='依任務手冊尋找校園線索。';
  if(s.stage===8)return {state:s,message:'迎賓準備完成！可以返回冒險操場。'};
  if(a?.type==='speak'){if(!canSpeak(s,a.word))message='先完成線索與前一個口說步驟。';else if(a.verifiedWord!==a.word)message='請先口說 '+a.word+' 並通過辨識。';else{s.spoken.push(a.word);s.stage++;message=s.stage===8?'Welcome! 舞獅迎賓任務完成！':'口說 '+a.word+' 通過！下一個線索是 '+words[s.stage]+'。';}}
  else if(a?.type==='history'&&s.stage===2&&[1960,1963,2021].includes(a.value)){s.history=a.value;message=a.value===1963?'答對了！1963 年獨立設校。接著到右側教室口說 CLASSROOM。':'1960 年是設分校；2021 年是新教學大樓落成。再找找獨立設校的年份。';}
  else if(a?.type==='drawing'&&s.stage===4&&['LION','RABBIT','FISH'].includes(a.value)){s.drawing=a.value;message=a.value==='LION'?'獅子圖卡選好了，口說 DRAW 才會完成製作。':'迎賓主題是舞獅，請找獅子圖案。';}
  else if(a?.type==='beat'&&s.stage===6&&[1,2].includes(a.value)){if(s.rhythm.length===3)s.rhythm=[];s.rhythm.push(a.value);message=s.rhythm.length===3?(rhythmOK(s)?'鼓點正確！靠近獅頭，口說 LION。':'鼓點不同，按重試後照「咚、咚、鏘」再敲一次。'):'鼓點 '+s.rhythm.length+' / 3';}
  else if(a?.type==='resetBeat'&&s.stage===6){s.rhythm=[];message='鼓點已清空，依咚、咚、鏘重試。';}
  return {state:s,message};
 }
 function hint(raw){const s=validate(raw)||initial(),targets=['school_school','school_listen','school_classroom','school_paper','school_draw','school_drum','school_lion','school_welcome'],clues=[['在校門迎賓桌口說 SCHOOL，接下校園任務。','新竹縣竹北市新港國小邀請小小探險家協助迎賓。'],['穿過北側左邊門口，到閱讀角口說 LISTEN。','聽校史線索，注意分校與獨立設校的年份。'],['在閱讀角選出獨立設校年份，再到右側門口口說 CLASSROOM。','1960 設分校；1963 獨立設校；2021 新教學大樓落成剪綵。'],['在教室的紙張桌口說 PAPER，領取圖卡材料。','右側桌上有一疊白紙。'],['選獅子圖案，再到畫圖桌口說 DRAW。','圖卡要配合學校舞獅迎賓主題。'],['回庭院的鼓台口說 DRUM，準備節奏。','閱讀示範：咚、咚、鏘。'],['在鼓台敲咚、咚、鏘，再靠近獅頭口說 LION。','鼓點錯了可以重試，前面的口說進度保留。'],['到庭院迎賓台口說 WELCOME。','讓獅頭向來賓點頭，完成迎賓！'],['新港迎賓完成！校舍中間的口琴展示館已開放。','從校舍中間的金框入口探索音樂翼，或由南側校門回操場。']];return {key:'zone12:'+JSON.stringify(s),word:null,targetId:s.stage===2&&s.history!==1963?'school_listen':s.stage===6&&!rhythmOK(s)?'school_drum':targets[s.stage]||'school_harmonica_entry',clues:clues[s.stage]};}
 const api={words,initial,validate,solved,transition,hint,canSpeak};root.SchoolChapter=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
/* C-solo 12-hole chromatic harmonica learning adventure. */
(function(root){
 'use strict';
 const words=['SMALL','MOUTH','HAND','LEFT','RIGHT','HIGH','PLAY','SONG'];
 const blow=[60,64,67,72,72,76,79,84,84,88,91,96],draw=[62,65,69,71,74,77,81,83,86,89,93,95];
 const melody=[{hole:1,air:'BLOW',slide:false},{hole:1,air:'DRAW',slide:false},{hole:2,air:'BLOW',slide:false},{hole:2,air:'DRAW',slide:false},{hole:3,air:'BLOW',slide:false}];
 const allowed=[['','SLIDE','DIATONIC','RECORDER'],['','MOUTHPIECE','COVER','BUTTON'],['','REED','COVER','VALVE'],['','LEFT','RIGHT'],['','LEFT','RIGHT'],['','HALF','OCTAVE','VOLUME']];
 const correct=['SLIDE','MOUTHPIECE','REED','LEFT','RIGHT','HALF'],experiments=['BLOW:0','DRAW:0','BLOW:1','DRAW:1'];
 const initial=()=>({stage:0,spoken:[],choices:['','','','','',''],explored:[],melody:[]});
 const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 function note(hole,air,slide){if(!Number.isInteger(hole)||hole<1||hole>12||!['BLOW','DRAW'].includes(air)||typeof slide!=='boolean')return null;if(hole===12&&air==='DRAW'&&slide)return 98;return (air==='BLOW'?blow:draw)[hole-1]+(slide?1:0);}
 function noteName(midi){return typeof midi==='number'&&Number.isInteger(midi)?['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][((midi%12)+12)%12]+(Math.floor(midi/12)-1):'';}
 function proof(s,n){return n<6?s.choices[n]===correct[n]&&(n!==5||s.explored.length===4):n===6?s.melody.length===5:true;}
 function validate(raw){
  if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((w,i)=>w!==words[i])||!Array.isArray(raw.choices)||raw.choices.length!==6||raw.choices.some((v,i)=>!allowed[i].includes(v))||!Array.isArray(raw.explored)||raw.explored.length>4||new Set(raw.explored).size!==raw.explored.length||raw.explored.some(x=>!experiments.includes(x))||!Array.isArray(raw.melody)||raw.melody.length>5||raw.melody.some((v,i)=>!eq(v,melody[i])))return null;
  const s={stage:Math.min(raw.stage,raw.spoken.length),spoken:[...raw.spoken],choices:[...raw.choices],explored:[...raw.explored],melody:raw.melody.map(v=>({...v}))};
  for(let n=0;n<s.stage;n++)if(!proof(s,n)){s.stage=n;break;}s.spoken=s.spoken.slice(0,s.stage);return s;
 }
 const solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<8&&typeof word==='string'&&word===words[s.stage]&&proof(s,s.stage);}
 function transition(raw,a){
  const s=validate(raw)||initial();let message='先探索展品，再口說完成這一步。';
  if(s.stage===8)return {state:s,message:'展演完成！可返回新港校園。'};
  if(a?.type==='choice'&&s.stage<6&&a.index===s.stage&&allowed[s.stage].includes(a.value)&&a.value!==''){s.choices[s.stage]=a.value;message=a.value===correct[s.stage]?'線索正確，接著口說 '+words[s.stage]+'。':'再觀察展品與說明，試另一個答案。';}
  else if(a?.type==='note'&&note(a.hole,a.air,a.slide)!==null){
   if(s.stage===5&&a.hole===1){const key=a.air+':'+Number(a.slide);if(!s.explored.includes(key))s.explored.push(key);message='第 1 孔：'+noteName(note(a.hole,a.air,a.slide))+'。比較吹／吸與滑鍵放開／按下，共 '+s.explored.length+' / 4 種。';}
   else if(s.stage===5)message='這一步先用第 1 孔比較 C、D、C♯、D♯ 四種音。';
   else if(s.stage===6){const value={hole:a.hole,air:a.air,slide:a.slide};if(s.melody.length===5)message='五音練習已完成，口說 PLAY。';else if(eq(value,melody[s.melody.length])){s.melody.push(value);message=s.melody.length===5?'C D E F G 完成！口說 PLAY。':'正確！下一音：'+noteName(note(melody[s.melody.length].hole,melody[s.melody.length].air,false))+'。';}else{s.melody=[];message='重新從 C 開始。放開滑鍵：1 吹、1 吸、2 吹、2 吸、3 吹。';}}
   else message='示範音：'+noteName(note(a.hole,a.air,a.slide))+'。可以自由試奏，任務依口說順序進行。';
  }else if(a?.type==='reset'&&s.stage===6){s.melody=[];message='從 C 重新練習，口說進度保留。';}
  else if(a?.type==='speak'){if(!canSpeak(s,a.word))message='先完成展品線索與前一個口說步驟。';else if(a.verifiedWord!==a.word)message='請口說 '+a.word+' 並通過辨識。';else{s.spoken.push(a.word);s.stage++;message=s.stage===8?'口琴小小展演完成！':'口說通過！下一步：'+words[s.stage]+'。';}}
  return {state:s,message};
 }
 const places=['small','mouth','hand','left','right','high','play','song'];
 const clues=[
 ['在入口選出有側邊滑鍵的半音階口琴，再口說 SMALL。','它體積小，卻能演奏半音；常見 12 孔款有 48 片簧片。'],
 ['找出嘴巴接觸與氣流進出的吹嘴，再口說 MOUTH。','吹嘴孔通往琴格與簧片，不是側邊滑鍵。'],
 ['在分層展示找出會振動發聲的金屬簧片，再口說 HAND。','琴蓋保護內部；琴格分隔氣道；簧片發聲；常见音閥協助控制漏氣。'],
 ['從演奏者視角找較低音的左側，再口說 LEFT。','此館採常見 C 調獨奏排列：左低、右高。'],
 ['找出較高音的右側，再口說 RIGHT。','吹嘴朝向自己，滑鍵按鈕在右手側。'],
 ['在變音台試第 1 孔四種吹吸／滑鍵組合，選按鍵變化，再口說 HIGH。','C→C♯、D→D♯：滑鍵切換另一組簧片，升高半音。'],
 ['在練習台依序奏 C D E F G，再口說 PLAY。','放開滑鍵：1 吹、1 吸、2 吹、2 吸、3 吹；按示範可重聽。'],
 ['到小舞台口說 SONG，完成展演。','已能辨識外形、結構、方向與滑鍵，帶著五個音回校園分享。'],
 ['口琴展示館任務完成！','由南側入口回新港國小。']
 ];
 function hint(raw){const s=validate(raw)||initial();return {key:'zone13:'+JSON.stringify(s),word:null,targetId:'harmonica_'+(places[s.stage]||'exit'),clues:clues[s.stage]};}
 const api={words,initial,validate,solved,transition,hint,canSpeak,note,noteName,melody};root.HarmonicaChapter=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
/* Garden branch: observed clues plus fresh oral recognition, never click-only completion. */
(function(root){
 'use strict';
 const words=['GARDEN','GREEN','BEE','BUTTERFLY','GROW','SMELL','PICK UP','BEAUTIFUL'];
 const places=['garden','green','bee','butterfly','grow','smell','pickup','beautiful'];
 const correct=['GARDEN','GREEN','BEE','BUTTERFLY','','GENTLY','','BEAUTIFUL'];
 const choices=[['','GARDEN'],['','GREEN','BLUE','PURPLE'],['','BEE','SPIDER','BIRD'],['','BUTTERFLY','BEE','BIRD'],[''],['','GENTLY','PULL'],[''],['','BEAUTIFUL','DIRTY']];
 const initial=()=>({stage:0,spoken:[],choices:['','','','','','','',''],water:0,light:0,collected:[]});
 const proof=(s,n)=>n===4?s.water===2&&s.light===2:n===6?s.collected.length===3:s.choices[n]===correct[n];
 function validate(raw){
  if(!raw||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>8||!Array.isArray(raw.spoken)||raw.spoken.length>8||raw.spoken.some((v,i)=>v!==words[i])||!Array.isArray(raw.choices)||raw.choices.length!==8||raw.choices.some((v,i)=>!choices[i].includes(v))||![0,1,2,3].includes(raw.water)||![0,1,2,3].includes(raw.light)||!Array.isArray(raw.collected)||raw.collected.length>3||new Set(raw.collected).size!==raw.collected.length||raw.collected.some(v=>![0,1,2].includes(v)))return null;
  const s={stage:Math.min(raw.stage,raw.spoken.length),spoken:raw.spoken.slice(),choices:raw.choices.slice(),water:raw.water,light:raw.light,collected:raw.collected.slice()};
  for(let n=0;n<s.stage;n++)if(!proof(s,n)){s.stage=n;break;}s.spoken=s.spoken.slice(0,s.stage);return s;
 }
 const solved=raw=>validate(raw)?.stage===8;
 function canSpeak(raw,word){const s=validate(raw)||initial();return s.stage<8&&word===words[s.stage]&&proof(s,s.stage);}
 function transition(raw,a){
  const s=validate(raw)||initial();let message='先觀察展品、完成線索，再口說完成步驟。';
  if(s.stage===8)return {state:s,message:'花園已復甦！可返回守護獸花園，或再聽單字示範。'};
  if(a?.type==='choice'&&a.index===s.stage&&a.value!==''&&choices[s.stage].includes(a.value)){s.choices[s.stage]=a.value;message=proof(s,s.stage)?'線索正確！接著口說 '+words[s.stage]+'。':'再觀察圖示與英文線索，試另一個答案。';}
  else if(a?.type==='condition'&&s.stage===4&&['water','light'].includes(a.key)&&[0,1,2,3].includes(a.value)){s[a.key]=a.value;message=proof(s,4)?'水分與光線都在 2 格；口說 GROW，讓幼苗長大。':'照護卡：兩格水分、兩格光線。調好後還要口說 GROW。';}
  else if(a?.type==='collect'&&s.stage===6&&[0,1,2].includes(a.index)){if(!s.collected.includes(a.index))s.collected.push(a.index);message=s.collected.length===3?'三件遺落物已分類，口說 PICK UP 才完成整理。':'已分類 '+s.collected.length+' / 3 件。';}
  else if(a?.type==='speak'){if(!canSpeak(s,a.word))message='先完成當前線索，不能跳過前面的步驟。';else if(a.verifiedWord!==a.word)message='請先口說 '+a.word+' 並通過辨識。';else{s.spoken.push(a.word);s.stage++;message=s.stage===8?'The garden is beautiful! 溫室復甦完成。':'口說通過！下一步：'+words[s.stage]+'。';}}
  return {state:s,message};
 }
 const lessons=[
  ['入口委託','This is our garden.','歡迎來到玻璃溫室。花園照護員請你觀察昆蟲、照顧幼苗，最後整理環境。先接下委託。'],
  ['葉片的顏色','The leaves are green.','觀察左側植栽台。選出與葉片相同的顏色，再口說 GREEN。'],
  ['訪花的小幫手','A bee visits the flower.','蜜蜂有六隻腳與觸角，飛到花朵間採集花蜜與花粉。選出黃色、黑色條紋的小昆蟲。'],
  ['花間的翅膀','Look at the butterfly.','看右側昆蟲展示：寬大的對稱翅膀上有斑點。找出蝴蝶，再口說 BUTTERFLY。'],
  ['讓幼苗長大','Plants need water and light to grow.','這盆魔法幼苗的照護卡標示：水分 2 格、光線 2 格。數值是本關的解謎設定，不是所有植物共同的澆水標準。調好後口說 GROW。'],
  ['溫柔聞花香','I can smell the flowers.','看香草台的小圖卡：輕輕靠近聞花香，讓花朵留在枝上。選出溫柔觀察的方法，再口說 SMELL。'],
  ['整理花園','Pick up the litter.','地上有三件遺落物：紙張、空瓶與包裝。逐一分類，再完整說出 PICK UP；只說 PICK 或 UP 不會完成。'],
  ['留一張花園明信片','The garden is beautiful.','選出形容整理後花園的句子，再口說 BEAUTIFUL。恭喜你讓溫室重新綻放！']
 ];
 function hint(raw){const s=validate(raw)||initial();return {key:'zone14:'+JSON.stringify(s),word:null,targetId:'greenhouse_'+(places[s.stage]||'exit'),clues:s.stage===8?['溫室任務完成，由入口返回守護獸花園。','也可以回大廳複習八個新字。']:[lessons[s.stage][2],'先完成線索，再口說 '+words[s.stage]+'。']};}
 const api={words,places,initial,validate,solved,canSpeak,transition,hint};root.GreenhouseChapter=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
/* Realm-specific mechanisms. Puzzle actions never write grades or award XP. */
(function(root){
  'use strict';
  const specs={
    zone2:{title:'市集採買：四枚金幣',english:'Two apples and one milk, please.',brief:'野餐清單：蘋果兩顆、牛奶一瓶。蘋果每顆 1 枚、牛奶每瓶 2 枚、麵包每個 2 枚。你有 4 枚金幣；裝好購物籃再結帳。',clues:['先看看清單上的食物數量與價格。','兩顆蘋果花 2 枚，一瓶牛奶花 2 枚；想想籃子裡要留下哪些食物。']},
    zone3:{title:'花園照護：三位小夥伴',english:'Water the tree. Feed the rabbit. Help the bird.',brief:'樹木缺水，小兔子想吃葉子，青鳥想吃種子。先選照護工具，再點選要幫忙的夥伴。',clues:['每位夥伴需要的東西不一樣。','水給 TREE，葉子給 RABBIT，種子給 BIRD；先選工具再選夥伴。']},
    zone4:{title:'運動接力：跨越終點',english:'Take the ball. Run, jump, then play soccer.',brief:'選好接力器材，再依跑道上的指示完成三個動作。不計時，可以慢慢看線索。',clues:['先選能踢的器材，再看英語動作順序。','需要 BALL；動作依序是 RUN、JUMP、SOCCER。']},
    zone5:{title:'車站解謎：準時上車',english:'The train leaves at eight thirty. Go to platform two.',brief:'車票寫著 08:30、月台 2。調整鐘面的時與分，選對月台再驗票。',clues:['車票的時間與月台必須同時符合。','Eight thirty 是 08:30，platform two 是月台 2。']},
    zone6:{title:'海港導航：避礁靠岸',english:'Sail to the lighthouse. Keep away from the rocks.',brief:'從左下方的小船出發，使用四個方向航行到右上方燈塔。礁石不能通過，岸邊也不能越界。',clues:['看看海圖中礁石的位置，找一條連續的水路。','先沿左側往北，到最上方後往東；船每次只移動一格。']},
    zone7:{title:'觀測站：對準東方月亮',english:'Find the moon in the east.',brief:'觀測筆記：東方的月亮是星門鑰匙。選擇天體，再轉動觀測儀；北 0°、東 90°、南 180°、西 270°。',clues:['筆記同時提到天體與方向。','選 MOON，把觀測儀轉到東方 90°，再確認對準。']},
    zone8:{title:'冰雪準備：溫暖出發',english:'Wear a coat, gloves and boots. Keep warm.',brief:'帶上外套、手套與雪靴。營火需要溫暖的 2 格熱度，太冷或太熱都不能出發。',clues:['裝備與營火都要準備好，才適合走進雪地。','留下外套、手套、雪靴，取消短褲與涼鞋；把熱度調到 2 格。']},
    zone9:{title:'智慧殿堂：修復故事卷軸',english:'Read first. Think next. Write last.',brief:'卷軸的步驟散開了。依英文線索把三張卡依序放回；放錯可以取回重排。',clues:['First、next、last 告訴你先後順序。','先 READ，再 THINK，最後 WRITE；排好後蓋上印章。']},
    zone10:{title:'虹光空島：奏響回家之歌',english:'Listen to the music. Sing the song.',brief:'彩虹琴譜：C → E → G → C。先聽四個音，再用琴鍵重現旋律，讓回家的虹橋亮起。',clues:['聽示範旋律，留意最後一個音與第一個音相同。','依序按 C、E、G、C；按錯可以清空琴譜重來。']}
  };
  specs.zone14={title:'玻璃溫室：花園復甦任務',english:'The garden is beautiful.',brief:'觀察昆蟲、照護幼苗與整理環境；每一步要口說完成。',clues:['先在入口接下花園委託。','探索線索後，口說完成每一步。']};
  specs.zone13={title:'半音階口琴：掌心音樂展示館',english:'Play a song on the harmonica.',brief:'造型、簧片、滑鍵與吹吸練習。',clues:['找到完整口琴。','探索線索後，口說完成每一步。']};
  specs.zone12={title:'新港國小：舞獅迎賓任務',english:'Welcome to our school!',brief:'校史尋寶、迎賓圖卡、鼓點與舞獅口說任務。',clues:['到校門迎賓桌接下任務。','口說辨識通過才完成步驟。']};
  specs.zone11={title:'魔法餐廳：一碗熱湯的冒險',english:'Two eggs and one pumpkin, please.',brief:'穿梭三個房間，依訂單準備食材並送餐。',clues:['先到訂單台接單。','依英語線索找鑰匙、取食材、料理與送餐。']};
  const defaults={zone2:{cart:[0,0,0],paid:false},zone3:{tool:'WATER',care:[false,false,false]},zone4:{equipment:'',stage:0},zone5:{hour:6,minute:0,platform:1,boarded:false},zone6:{x:0,y:2},zone7:{object:'STAR',angle:0,aligned:false},zone8:{gear:[],heat:0,ready:false},zone9:{order:[],sealed:false},zone10:{notes:[],played:false}};
  defaults.zone14={stage:0,spoken:[],choices:['','','','','','','',''],water:0,light:0,collected:[]};
  defaults.zone13={stage:0,spoken:[],choices:['','','','','',''],explored:[],melody:[]};
  defaults.zone12={stage:0,spoken:[],history:null,drawing:null,rhythm:[]};
  defaults.zone11={accepted:false,key:false,pantryOpen:false,ingredients:[0,0,0],step:0,cooked:false,served:false};
  const clone=x=>JSON.parse(JSON.stringify(x));
  const isInt=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
  const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function initial(id){return defaults[id]?clone(defaults[id]):null;}
  function solved(id,s){
    if(id==='zone14')return root.GreenhouseChapter?.solved(s)||false;
    if(id==='zone13')return root.HarmonicaChapter?.solved(s)||false;
    if(id==='zone12')return root.SchoolChapter?.solved(s)||false;
    if(id==='zone11')return root.RestaurantChapter?.solved(s)||false;
    if(!s)return false;
    switch(id){
      case 'zone2':return s.paid===true&&eq(s.cart,[2,1,0]);
      case 'zone3':return eq(s.care,[true,true,true]);
      case 'zone4':return s.equipment==='BALL'&&s.stage===3;
      case 'zone5':return s.boarded===true&&s.hour===8&&s.minute===30&&s.platform===2;
      case 'zone6':return s.x===3&&s.y===0;
      case 'zone7':return s.aligned===true&&s.object==='MOON'&&s.angle===90;
      case 'zone8':return s.ready===true&&s.heat===2&&eq([...s.gear].sort(),['BOOTS','COAT','GLOVES']);
      case 'zone9':return s.sealed===true&&eq(s.order,['READ','THINK','WRITE']);
      case 'zone10':return s.played===true&&eq(s.notes,['C','E','G','C']);
      default:return false;
    }
  }
  function validateState(id,raw){
    if(id==='zone14')return root.GreenhouseChapter?.validate(raw)||null;
    if(id==='zone13')return root.HarmonicaChapter?.validate(raw)||null;
    if(id==='zone12')return root.SchoolChapter?.validate(raw)||null;
    if(id==='zone11')return root.RestaurantChapter?.validate(raw)||null;
    if(!raw||!defaults[id])return null;
    let ok=false;
    switch(id){
      case 'zone2':ok=Array.isArray(raw.cart)&&raw.cart.length===3&&raw.cart.every(n=>isInt(n,0,3))&&typeof raw.paid==='boolean';break;
      case 'zone3':ok=['WATER','LEAF','SEEDS'].includes(raw.tool)&&Array.isArray(raw.care)&&raw.care.length===3&&raw.care.every(b=>typeof b==='boolean');break;
      case 'zone4':ok=['','BALL','BOOK','CLOCK'].includes(raw.equipment)&&isInt(raw.stage,0,3);break;
      case 'zone5':ok=[6,8,10].includes(raw.hour)&&[0,30,45].includes(raw.minute)&&isInt(raw.platform,1,3)&&typeof raw.boarded==='boolean';break;
      case 'zone6':ok=isInt(raw.x,0,3)&&isInt(raw.y,0,2)&&!((raw.x===1&&raw.y===1)||(raw.x===2&&raw.y===2));break;
      case 'zone7':ok=['STAR','MOON','SUN'].includes(raw.object)&&[0,90,180,270].includes(raw.angle)&&typeof raw.aligned==='boolean';break;
      case 'zone8':ok=Array.isArray(raw.gear)&&raw.gear.length<=5&&new Set(raw.gear).size===raw.gear.length&&raw.gear.every(g=>['COAT','GLOVES','BOOTS','SHORTS','SANDALS'].includes(g))&&isInt(raw.heat,0,3)&&typeof raw.ready==='boolean';break;
      case 'zone9':ok=Array.isArray(raw.order)&&raw.order.length<=3&&new Set(raw.order).size===raw.order.length&&raw.order.every(w=>['READ','THINK','WRITE'].includes(w))&&typeof raw.sealed==='boolean';break;
      case 'zone10':ok=Array.isArray(raw.notes)&&raw.notes.length<=4&&raw.notes.every(n=>['C','E','G'].includes(n))&&typeof raw.played==='boolean';break;
    }
    if(!ok)return null;
    const s=initial(id);for(const key of Object.keys(s))s[key]=clone(raw[key]);
    // A stale success flag cannot bypass a changed configuration.
    for(const key of ['paid','boarded','aligned','ready','sealed','played'])if(key in s&&!solved(id,s))s[key]=false;
    return s;
  }
  function sanitizeMap(map){const result={};if(!map||typeof map!=='object')return result;for(const id of Object.keys(defaults)){const state=validateState(id,map[id]);if(state)result[id]=state;}return result;}
  function transition(id,raw,action){
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
        if(action.type==='pay'){s.paid=eq(s.cart,[2,1,0]);message=s.paid?'購物清單與 4 枚金幣剛好相符！':'還不能結帳：請核對食物數量與金幣總額。';}break;
      case 'zone3':
        if(action.type==='tool'&&['WATER','LEAF','SEEDS'].includes(action.value))s.tool=action.value;
        if(action.type==='care'&&isInt(action.index,0,2)){if(s.tool===['WATER','LEAF','SEEDS'][action.index]){s.care[action.index]=true;message='這位夥伴已經得到需要的照護！';}else message='這位夥伴需要別的東西；可以換一個工具再試。';}break;
      case 'zone4':
        if(action.type==='equipment'&&['BALL','BOOK','CLOCK'].includes(action.value)){s.equipment=action.value;s.stage=0;}
        if(action.type==='move'&&['RUN','JUMP','SOCCER'].includes(action.value)){if(s.equipment!=='BALL')message='接力還需要一顆球，先選器材。';else if(action.value===['RUN','JUMP','SOCCER'][s.stage]){s.stage++;message='完成第 '+s.stage+' 個動作！';}else {s.stage=0;message='順序有一點不同，再從 RUN 開始試試。';}}break;
      case 'zone5':
        if(action.type==='set'&&((action.key==='hour'&&[6,8,10].includes(action.value))||(action.key==='minute'&&[0,30,45].includes(action.value))||(action.key==='platform'&&isInt(action.value,1,3))))s[action.key]=action.value;
        if(action.type==='board'){s.boarded=s.hour===8&&s.minute===30&&s.platform===2;message=s.boarded?'時間與月台正確，車票驗證成功！':'時間或月台與車票不同，再看看車票。';}break;
      case 'zone6':{
        const delta={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]}[action.value];
        if(action.type==='sail'&&delta){const x=s.x+delta[0],y=s.y+delta[1];if(!isInt(x,0,3)||!isInt(y,0,2))message='岸邊不能通過，換個方向航行。';else if((x===1&&y===1)||(x===2&&y===2))message='前方有礁石，請找另一條水路。';else {s.x=x;s.y=y;message='已航行一格。';}}break;
      }
      case 'zone7':
        if(action.type==='object'&&['STAR','MOON','SUN'].includes(action.value))s.object=action.value;
        if(action.type==='rotate')s.angle=(s.angle+90)%360;
        if(action.type==='align'){s.aligned=s.object==='MOON'&&s.angle===90;message=s.aligned?'觀測儀已對準東方月亮！':'天體或方向與筆記不同，再觀察一次。';}break;
      case 'zone8':
        if(action.type==='gear'&&['COAT','GLOVES','BOOTS','SHORTS','SANDALS'].includes(action.value))s.gear=s.gear.includes(action.value)?s.gear.filter(g=>g!==action.value):[...s.gear,action.value];
        if(action.type==='heat'&&[-1,1].includes(action.value))s.heat=Math.min(3,Math.max(0,s.heat+action.value));
        if(action.type==='depart'){s.ready=s.heat===2&&eq([...s.gear].sort(),['BOOTS','COAT','GLOVES']);message=s.ready?'保暖裝備與營火都準備好了！':'請核對保暖裝備，並讓營火維持 2 格熱度。';}break;
      case 'zone9':
        if(action.type==='card'&&['READ','THINK','WRITE'].includes(action.value)&&!s.order.includes(action.value)&&s.order.length<3)s.order.push(action.value);
        if(action.type==='clear')s.order=[];
        if(action.type==='seal'){s.sealed=eq(s.order,['READ','THINK','WRITE']);message=s.sealed?'卷軸恢復了正確的故事步驟！':'順序與 first、next、last 不同，可以取回重排。';}break;
      case 'zone10':
        if(action.type==='note'&&['C','E','G'].includes(action.value)&&s.notes.length<4)s.notes.push(action.value);
        if(action.type==='clear')s.notes=[];
        if(action.type==='play'){s.played=eq(s.notes,['C','E','G','C']);message=s.played?'回家的旋律響起，虹橋亮了！':'旋律有一點不同，先聽示範再清空重彈。';}break;
    }
    return {state:s,message:solved(id,s)?'秘境任務完成！ '+message:message};
  }
  function canTravel(from,to,map,{restore=false,dev=false}={}){if(restore||dev)return true;if(to==='learningHub'||from==='learningHub')return true;if(to==='zone14')return solved('zone3',map?.zone3);if(from==='zone14')return to==='zone3';if(to==='zone13')return solved('zone12',map?.zone12);if(from==='zone13')return to==='zone12';if(to==='zone12')return solved('zone4',map?.zone4);if(from==='zone12')return to==='zone4';if(to==='zone11')return solved('zone2',map?.zone2);if(from==='zone11')return to==='zone2';return !specs[from]||Number(to.slice(4))<=Number(from.slice(4))||solved(from,map?.[from]);}
  const api={specs,initial,solved,validateState,sanitizeMap,transition,canTravel};root.RealmQuests=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
/* Puzzle checkpoints are separate from the learning-record service. */
(function(root) {
  'use strict';
  const flags=['candleLit','bookOpened','hasKey','drawerOpened','hasRedPotion','hasBluePotion','alchemyMixed','hasStarStone','hasFish','catPracticed','mimicFed','hasFlowerStone','doorSocketsFilled','doorStonePlaced','doorOpened','escaped'];
  const number=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
  function ownerKey(profile,preview=false) {return preview?'preview':!profile||profile.isGuest?'guest':'student:'+String(profile.studentId||'').slice(0,100);}
  function validate(raw,owner,zones) {
    if(!raw||raw.version!==1||raw.owner!==owner||!zones[raw.zone]||!number(raw.savedAt,0,1e14))return null;
    const s=raw.state,p=raw.player;
    if(!s||!p||!number(s.xp,0,1000000)||!Array.isArray(s.inventory)||s.inventory.length>128)return null;
    if(!number(p.x,-1000,1000)||!number(p.z,-1000,1000)||!number(p.y,0,100)||!number(p.yaw,-1e6,1e6)||!number(p.pitch,-1.6,1.6))return null;
    const state={xp:Math.floor(s.xp),inventory:[],practicedWordsByZone:{},realmPuzzles:root.RealmQuests?.sanitizeMap(s.realmPuzzles)||{}};
    for(const key of flags){if(typeof s[key]!=='boolean')return null;state[key]=s[key];}
    const ids=new Set();
    for(const item of s.inventory){
      if(!item||typeof item.id!=='string'||!/^[A-Z0-9_]{1,48}$/.test(item.id)||typeof item.name!=='string'||item.name.length>80)return null;
      if(ids.has(item.id))continue;ids.add(item.id);
      state.inventory.push({id:item.id,name:item.name,color:typeof item.color==='string'&&/^#[0-9a-f]{3,8}$/i.test(item.color)?item.color:'#ecc94b'});
    }
    for(const [id,zone] of Object.entries(zones)){
      const list=s.practicedWordsByZone?.[id];
      if(Array.isArray(list))state.practicedWordsByZone[id]=[...new Set(list.filter(word=>zone.words.includes(word)))];
    }
    return {version:1,owner,zone:raw.zone,savedAt:raw.savedAt,state,player:{x:p.x,y:p.y,z:p.z,yaw:p.yaw,pitch:p.pitch}};
  }
  function capture(world,owner,now=Date.now()) {
    const state={xp:world.gameState.xp,inventory:world.gameState.inventory,practicedWordsByZone:world.gameState.practicedWordsByZone||{},realmPuzzles:world.gameState.realmPuzzles||{}};
    for(const key of flags)state[key]=world.gameState[key]===true;
    return {version:1,owner,zone:world.zoneManager.currentZoneId,savedAt:now,state,player:{x:world.player.pos.x,y:world.player.pos.y,z:world.player.pos.z,yaw:world.player.yaw,pitch:world.player.pitch}};
  }
  function applySavedPosition(player,saved,blocked) {
    if(!saved||!number(saved.x,-1000,1000)||!number(saved.z,-1000,1000)||!number(saved.yaw,-1e6,1e6)||!number(saved.pitch,-1.6,1.6)||blocked(saved.x,saved.z,player.radius))return false;
    player.pos.set(saved.x,1.6,saved.z);player.yaw=saved.yaw;player.pitch=saved.pitch;return true;
  }
  class CheckpointStore {
    constructor(storage,owner,zones){this.storage=storage;this.owner=owner;this.zones=zones;this.key='whimsy.adventure.v1:'+encodeURIComponent(owner);this.status='empty';this.savedAt=null;this.unreadable=null;}
    load(){
      try{
        const text=this.storage.getItem(this.key);if(!text){this.status='empty';return null;}
        let record=null;try{record=text.length<=256000?validate(JSON.parse(text),this.owner,this.zones):null;}catch(error){};
        if(!record){this.unreadable=text.slice(0,256000);this.status='invalid';return null;}
        this.savedAt=record.savedAt;this.status='saved';return record;
      }catch(error){this.status='unavailable';return null;}
    }
    save(snapshot){
      const record=validate(snapshot,this.owner,this.zones);if(!record){this.status='invalid';return false;}
      try{
        if(this.unreadable!==null){this.storage.setItem(this.key+':unreadable',this.unreadable);this.unreadable=null;}
        this.storage.setItem(this.key,JSON.stringify(record));this.savedAt=record.savedAt;this.status='saved';return true;
      }catch(error){this.status='unavailable';return false;}
    }
  }
  const api={flags,ownerKey,validate,capture,applySavedPosition,CheckpointStore};root.AdventureProgress=api;
  if(typeof module!=='undefined')module.exports=api;
})(globalThis);
var ADVENTURE_CHECKPOINT_ZONES={"zone1":{"id":"zone1","words":["LIGHT","BOOK","KEY","RED","BLUE","STAR","CAT","FISH","DOOR","FLOWER","OPEN","SUN"]},"zone2":{"id":"zone2","words":["APPLE","BANANA","BREAD","MILK","SWEET","OPEN"]},"zone3":{"id":"zone3","words":["RABBIT","BIRD","TREE","WATER","OPEN"]},"zone4":{"id":"zone4","words":["SOCCER","BALL","RUN","JUMP","OPEN"]},"zone5":{"id":"zone5","words":["TIME","CLOCK","TRAIN","MORNING","OPEN"]},"zone6":{"id":"zone6","words":["SHIP","BOAT","WIND","FISH","WATER","OPEN"]},"zone7":{"id":"zone7","words":["STAR","MOON","CLOUD","SUN","SKY","OPEN"]},"zone8":{"id":"zone8","words":["SNOW","COLD","WINTER","WHITE","WARM","CLIMB"]},"zone9":{"id":"zone9","words":["LIBRARY","READ","WRITE","THINK","SMART","FLY"]},"zone10":{"id":"zone10","words":["ISLAND","RAINBOW","MUSIC","SING","DANCE","DREAM"]},"zone11":{"id":"zone11","words":["EGG","PUMPKIN","LEMON","SOUP","WASH","PUT","COOK","SPOON"]},"zone12":{"id":"zone12","words":["SCHOOL","CLASSROOM","PAPER","DRAW","LISTEN","DRUM","LION","WELCOME"]},"zone13":{"id":"zone13","words":["SMALL","MOUTH","HAND","LEFT","RIGHT","HIGH","PLAY","SONG"]},"learningHub":{"id":"learningHub","words":[]},"zone14":{"id":"zone14","words":["GARDEN","GREEN","BEE","BUTTERFLY","GROW","SMELL","PICK UP","BEAUTIFUL"]}};

var GreenhouseChapter=window.GreenhouseChapter,RestaurantChapter=window.RestaurantChapter,SchoolChapter=window.SchoolChapter,HarmonicaChapter=window.HarmonicaChapter,RealmQuests=window.RealmQuests,AdventureProgress=window.AdventureProgress;

// --- AdventureCheckpoints.gs ---
/* Private capability checkpoints, separate from Students and Logs. */
var ADVENTURE_CHECKPOINT_SHEET='AdventureCheckpoints';
function adventureDigest(value){
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,value,Utilities.Charset.UTF_8).map(function(byte){return ((byte+256)%256).toString(16).padStart(2,'0');}).join('');
}
function adventureOwnerValid(owner){return typeof owner==='string'&&(owner==='guest'||(/^student:.+/.test(owner)&&owner.length<=108&&!/[\x00-\x1f]/.test(owner)));}
function adventureCheckpointAction(payload,ss){
  if(payload.action==='adventureCapabilities')return {status:'success',protocol:'adventure-v1',maxSnapshotChars:20000,schemaZones:Object.keys(ADVENTURE_CHECKPOINT_ZONES)};
  var id=payload.checkpointId,secret=payload.secret,owner=payload.owner;
  if(typeof id!=='string'||!/^[a-f0-9]{32}$/.test(id)||typeof secret!=='string'||!/^[a-f0-9]{64}$/.test(secret)||!adventureOwnerValid(owner))return {status:'error',code:'invalid',message:'Invalid checkpoint request'};
  var isSave=payload.action==='saveAdventure';
  if(!isSave&&payload.action!=='getAdventure')return {status:'error',code:'invalid',message:'Unsupported checkpoint action'};
  var record=null,body='',bodyHash='';
  if(isSave){
    if(!Number.isInteger(payload.expectedRevision)||payload.expectedRevision<0||payload.expectedRevision>100000000||typeof payload.requestId!=='string'||!/^[a-f0-9]{32}$/.test(payload.requestId))return {status:'error',code:'invalid',message:'Invalid checkpoint revision'};
    try{if(JSON.stringify(payload.snapshot).length>20000)return {status:'error',code:'too_large',message:'Checkpoint too large'};}catch(error){return {status:'error',code:'invalid',message:'Invalid checkpoint'};}
    record=AdventureProgress.validate(payload.snapshot,owner,ADVENTURE_CHECKPOINT_ZONES);
    if(!record)return {status:'error',code:'invalid',message:'Invalid checkpoint'};
    body=JSON.stringify(record);bodyHash=adventureDigest(body);
  }
  var sheet=ss.getSheetByName(ADVENTURE_CHECKPOINT_SHEET),rows=sheet?sheet.getDataRange().getValues():[],index=-1;
  for(var i=1;i<rows.length;i++)if(String(rows[i][0])===id){index=i;break;}
  var secretHash=adventureDigest(secret),ownerHash=adventureDigest(owner),revision=index>=0?Number(rows[index][3]):0;
  if(index>=0&&(String(rows[index][1])!==secretHash||String(rows[index][2])!==ownerHash))return {status:'error',code:'access',message:'Checkpoint unavailable for this continuation code and profile'};
  if(!isSave){
    if(index<0)return {status:'missing',message:'Checkpoint not found'};
    try{record=AdventureProgress.validate(JSON.parse(String(rows[index][6])),owner,ADVENTURE_CHECKPOINT_ZONES);}catch(error){record=null;}
    if(!record)return {status:'error',code:'corrupt',message:'Stored checkpoint cannot be restored'};
    return {status:'success',revision:revision,snapshot:record,updatedAt:new Date(rows[index][7]).getTime()};
  }
  // A timed-out write may be retried, but a reused request ID cannot change its body.
  if(index>=0&&String(rows[index][4])===payload.requestId){
    if(String(rows[index][5])!==bodyHash)return {status:'error',code:'request_reused',message:'Request identifier was reused for a different checkpoint'};
    return {status:'success',revision:revision,savedAt:new Date(rows[index][7]).getTime(),replayed:true};
  }
  if(payload.expectedRevision!==revision)return {status:'conflict',revision:revision,message:'A newer checkpoint exists on another device'};
  if(!Number.isInteger(revision)||revision<0||revision>=100000000)return {status:'error',code:'invalid',message:'Checkpoint revision cannot be advanced'};
  if(!sheet){sheet=ss.insertSheet(ADVENTURE_CHECKPOINT_SHEET);sheet.appendRow(['checkpointId','secretHash','ownerHash','revision','lastRequestId','bodyHash','checkpointJSON','updatedAt']);sheet.setFrozenRows(1);}
  var now=new Date(),values=[id,secretHash,ownerHash,revision+1,payload.requestId,bodyHash,body,now];
  if(index>=0)sheet.getRange(index+1,1,1,values.length).setValues([values]);else sheet.appendRow(values);
  return {status:'success',revision:revision+1,savedAt:now.getTime()};
}


// --- LearningSchema.gs ---
// GENERATED by scripts/build-learning-schema.cjs
/* Pure, shared learning policy. Oral results are content matching, not phonetic scoring. */
(function(root){
 'use strict';
 const key=w=>String(w||'').trim().toUpperCase();
 const day=t=>new Date(Number(t)+8*3600000).toISOString().slice(0,10);
 const empty=()=>({version:1,words:{},sentences:{},favorites:[],events:[],practices:0,xp:0});
 function normalize(s){return String(s||'').toLowerCase().replace(/[’]/g,"'").replace(/\bit's\b/g,'it is').replace(/\bthat's\b/g,'that is').replace(/\bdon't\b/g,'do not').replace(/[^a-z0-9']/g,' ').replace(/\s+/g,' ').trim();}
 function matches(a,b){return !!normalize(b)&&normalize(a)===normalize(b);}
 function apply(raw,e,completed=[]){
  const s=JSON.parse(JSON.stringify(raw||empty()));
  s.words=s.words||{};s.sentences=s.sentences||{};s.favorites=s.favorites||[];s.events=s.events||[];
  if(!e||typeof e.id!=='string'||!e.id||e.id.length>100)throw Error('Invalid event');
  if(s.events.includes(e.id))return {state:s,xp:0,duplicate:true};
  const word=key(e.word),today=day(e.time),known=completed.map(key).includes(word);
  let xp=0,first=false;
  if(e.kind==='favorite'){
   if(e.value&&!s.favorites.includes(word))s.favorites.push(word);
   if(!e.value)s.favorites=s.favorites.filter(w=>w!==word);
  }else if(e.kind==='word'||e.kind==='meaning'){
   const w=s.words[word]||{times:0,days:[],reviews:{},meaning:0,context:0,learned:known};
   if(e.kind==='meaning')w.meaning++;
   else{
    first=!w.learned&&!known;
    if(first){xp=50;w.learned=true;}
    else if((w.reviews[today]||0)<2){xp=10;w.reviews[today]=(w.reviews[today]||0)+1;}
    w.times++;if(!w.days.includes(today))w.days.push(today);w.last=e.time;
   }
   s.words[word]=w;s.practices=(s.practices||0)+1;
  }else if(e.kind==='sentence'){
   const v=s.sentences[e.sentence]||{times:0,days:[]};first=v.times===0;xp=first?30:0;v.times++;
   if(!v.days.includes(today))v.days.push(today);v.last=e.time;s.sentences[e.sentence]=v;
   if(s.words[word]?.learned)s.words[word].context++;s.practices=(s.practices||0)+1;
  }else throw Error('Invalid kind');
  s.xp=(s.xp||0)+xp;s.events.push(e.id); // Never discard receipts: retries must remain idempotent.
  return {state:s,xp,first,duplicate:false};
 }
 function mastery(w){return !w?.learned?0:1+Number(w.times>=3)+Number(w.days.length>=2)+Number(w.meaning>0)+Number(w.context>0&&w.days.length>=3);}
 root.LearningRewards={key,day,empty,normalize,matches,apply,mastery};if(typeof module!=='undefined')module.exports=root.LearningRewards;
})(typeof window!=='undefined'?window:globalThis);

var LEARNING_WORDS=["APPLE","BANANA","RABBIT","TIGER","FATHER","MOTHER","SISTER","BROTHER","SUNNY","RAINY","TEACHER","STUDENT","BATHROOM","KITCHEN","DOCTOR","NURSE","HOMEWORK","SUPERMARKET","BEAUTIFUL","BOOK","PENCIL","DESK","CHAIR","DOG","CAT","BIRD","FISH","MILK","WATER","RICE","NOODLES","RED","BLUE","GREEN","YELLOW","ONE","TWO","THREE","FOUR","HEAD","HAND","EYE","FOOT","RUN","JUMP","READ","WRITE","MORNING","AFTERNOON","TODAY","HAPPY","BEE","COW","PET","PIG","BEAR","DUCK","FROG","LION","MICE","HIPPO","HORSE","KOALA","MOUSE","PANDA","SHEEP","SNAKE","WHALE","ZEBRA","ANIMAL","MONKEY","SPIDER","TURTLE","CHICKEN","ELEPHANT","BUTTERFLY","BAG","CAP","HAT","COAT","WEAR","DRESS","PANTS","SHIRT","SKIRT","SOCKS","JACKET","POCKET","SHORTS","SHOES","CLOTHES","GLASSES","SWEATER","UMBRELLA","COLOR","GRAY","PINK","BLACK","BROWN","WHITE","ORANGE","PURPLE","DAD","DADDY","MOM","MOMMY","PARENT","SON","DAUGHTER","FAMILY","GRANDFATHER","GRANDPA","GRANDMOTHER","GRANDMA","AUNT","UNCLE","GROW","COUSIN","LIVE","FRUIT","PEACH","LEMON","GRAPE","STRAWBERRY","WATERMELON","BREAKFAST","LUNCH","DINNER","DRINK","TEA","EGG","BREAD","PIE","EAT","COOK","SOUP","FOOD","BEEF","PORK","CAKE","COKE","MEAL","JUICE","CANDY","SALAD","PIZZA","FULL","DUMPLING","HUNGRY","TASTE","THIRSTY","YUMMY","PUMPKIN","ICE CREAM","SWEET","SANDWICH","CHOCOLATE","HAMBURGER","NAME","SEA","LAKE","BEACH","RIVER","MOUNTAIN","EASTER","HALLOWEEN","CHRISTMAS","MOON","WELL","SICK","COLD","STRONG","TIRED","TOOTHACHE","HEADACHE","KEY","FAN","BED","HOUSE","WALL","MOP","DOOR","LAMP","SWEEP","WASH","HOME","TABLE","TOWEL","FLOOR","SHELF","GARDEN","SHOWER","TV","COMPUTER","REFRIGERATOR","CLEAN","BEDROOM","BUY","FREE","MONEY","DOLLAR","NEW","NUMBER","ALL","BOTH","MUCH","MANY","MORE","SOME","FIRST","SECOND","THIRD","LAST","JOB","WORK","WORKER","ACTOR","ACTRESS","SINGER","DRIVER","FARMER","MAILMAN","WAITER","WAITRESS","SOLDIER","POLICE OFFICER","HAIR","FACE","NOSE","EAR","MOUTH","TOOTH","LEG","TEETH","FEET","BACK","PERSON","PEOPLE","BABY","KID","BOY","GIRL","WOMAN","WOMEN","BAD","GOOD","NICE","LAZY","CUTE","SMART","TALL","SHORT","THIN","HEAVY","PRETTY","ANGRY","MAD","EXCITED","BORED","THERE","LEFT","RIGHT","HERE","BANK","PARK","ZOO","SHOP","STORE","BOOKSTORE","MARKET","OFFICE","POST OFFICE","RESTROOM","RESTAURANT","MUSEUM","HOSPITAL","FIRE STATION","MOVIE THEATER","POLICE STATION","DEPARTMENT STORE","TAIWAN","JAPAN","SCHOOL","CLASS","PE","ART","DRAW","MATH","MUSIC","ENGLISH","CHINESE","ASK","ANSWER","SAY","SPEAK","TALK","SPELL","LISTEN","STUDY","TEST","QUESTION","GLUE","PEN","MARKER","ERASER","PAPER","RULER","FRIEND","STORY","PICTURE","BLACKBOARD","CLASSROOM","VACATION","BIG","SMALL","LONG","LIGHT","HIGH","PAIR","PLAY","SING","DANCE","PAINT","HIKE","SWIM","CLIMB","BALL","BASEBALL","BASKETBALL","FOOTBALL","SOCCER","SPORT","TOY","DOLL","YO-YO","WIN","CARD","DRUM","GAME","KITE","SONG","MOVIE","PIANO","CUP","DISH","GLASS","FORK","SPOON","KNIFE","CHOPSTICKS","EVENING","NIGHT","NOW","TOMORROW","DAY","YESTERDAY","EARLY","LATE","TIME","WATCH","YEAR","CLOCK","SPRING","SUMMER","FALL","WINTER","SEASON","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY","WEEK","JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER","RIDE","FLY","DRIVE","TURN","CAR","BUS","BUS STOP","TAXI","AIRPORT","BOAT","STATION","MOTORCYCLE","MRT","SCOOTER","FAST","SLOW","TRUCK","WEATHER","SKY","SUN","STAR","WIND","WINDY","TYPHOON","RAIN","RAINBOW","SNOW","WET","CLOUDY","HOT","WARM","COOL","A","AN","EVERY","THE","THIS","THAT","THOSE","THESE","I","HE","SHE","ME","HIM","HER","YOU","WE","US","IT","THEY","THEM","NOTHING","BE","DO","CAN","WILL","AND","BUT","BECAUSE","HI","HELLO","PLEASE","EXCUSE ME","AT","IN","OUT","FOR","NEAR","BY","ON","BEHIND","FROM","OFF","TO","UP","OVER","THAN","WITH","UNDER","NEXT TO","INSIDE","OUTSIDE","AFTER","BOX","BOTTLE","GIFT","MAIL","EMAIL","TREE","WAY","WORD","SALE","FUN","THING","TICKET","DREAM","PARTY","PHOTO","ROBOT","FLOWER","CELLPHONE","BIRTHDAY","GO","GET","CRY","HIT","PUT","SEE","SIT","TRY","CALL","COME","FIND","FEEL","HAVE","HELP","HOPE","HURT","KNOW","LIKE","LOOK","LOVE","MEET","MISS","NEED","OPEN","STOP","TELL","WAIT","WALK","WANT","GIVE","MAKE","BRUSH","HURRY","LAUGH","CLOSE","SHOW","SLEEP","SMELL","STAND","START","TAKE","THANK","TOUCH","WAKE","WORRY","ENJOY","WELCOME","PICK UP","OK","EASY","FINE","HARD","ONLY","SURE","DIRTY","GREAT","OTHER","QUIET","READY","WONDERFUL","FAVORITE","NO","SO","YES","VERY","THEN","STILL","NOT","NEVER","AWAY","ALWAYS","TOGETHER","AGAIN","MAYBE","REALLY","SOMETIMES","USUALLY","HOW","WHO","WHY","WHAT","WHEN","WHERE","WHICH","WHOSE","EIGHT","ELEVEN","FIVE","NINE","SAD","SEVEN","SIX","TEN","TWELVE","BIKE","LIVING ROOM","GOODBYE","LIBRARY","MONTH","MAN","PLANE","MY","OUR","SOFA","SORRY","WINDOW","YOUNG","YOUR","BEFORE","COFFEE","STREET","TRAIN","BUSY"];
var LEARNING_SENTENCES=[{"id":"this:APPLE","word":"APPLE"},{"id":"this:ORANGE","word":"ORANGE"},{"id":"this:ERASER","word":"ERASER"},{"id":"this:BOOK","word":"BOOK"},{"id":"this:BAG","word":"BAG"},{"id":"this:PEN","word":"PEN"},{"id":"this:PENCIL","word":"PENCIL"},{"id":"this:RULER","word":"RULER"},{"id":"this:CAT","word":"CAT"},{"id":"this:DOG","word":"DOG"},{"id":"this:RABBIT","word":"RABBIT"},{"id":"this:BIRD","word":"BIRD"},{"id":"this:BALL","word":"BALL"},{"id":"this:BIKE","word":"BIKE"},{"id":"this:KEY","word":"KEY"},{"id":"this:LION","word":"LION"},{"id":"this:TIGER","word":"TIGER"},{"id":"this:ELEPHANT","word":"ELEPHANT"},{"id":"have:APPLE","word":"APPLE"},{"id":"have:ORANGE","word":"ORANGE"},{"id":"have:ERASER","word":"ERASER"},{"id":"have:BOOK","word":"BOOK"},{"id":"have:BAG","word":"BAG"},{"id":"have:PEN","word":"PEN"},{"id":"have:PENCIL","word":"PENCIL"},{"id":"have:RULER","word":"RULER"},{"id":"have:CAT","word":"CAT"},{"id":"have:DOG","word":"DOG"},{"id":"have:RABBIT","word":"RABBIT"},{"id":"have:BIRD","word":"BIRD"},{"id":"have:BALL","word":"BALL"},{"id":"have:BIKE","word":"BIKE"},{"id":"have:KEY","word":"KEY"},{"id":"have:LION","word":"LION"},{"id":"have:TIGER","word":"TIGER"},{"id":"have:ELEPHANT","word":"ELEPHANT"},{"id":"like:APPLE","word":"APPLE"},{"id":"like:BANANA","word":"BANANA"},{"id":"like:ORANGE","word":"ORANGE"},{"id":"like:EGG","word":"EGG"},{"id":"like:MILK","word":"MILK"},{"id":"like:BREAD","word":"BREAD"},{"id":"like:WATER","word":"WATER"},{"id":"like:SOUP","word":"SOUP"},{"id":"like:RICE","word":"RICE"},{"id":"like:FISH","word":"FISH"},{"id":"like:CHICKEN","word":"CHICKEN"},{"id":"can:RUN","word":"RUN"},{"id":"can:JUMP","word":"JUMP"},{"id":"can:READ","word":"READ"},{"id":"can:WRITE","word":"WRITE"},{"id":"can:SING","word":"SING"},{"id":"can:DANCE","word":"DANCE"},{"id":"can:COOK","word":"COOK"},{"id":"can:DRAW","word":"DRAW"},{"id":"can:SWIM","word":"SWIM"},{"id":"can:PLAY","word":"PLAY"},{"id":"can:WALK","word":"WALK"},{"id":"can:FLY","word":"FLY"},{"id":"where:APPLE","word":"APPLE"},{"id":"where:ORANGE","word":"ORANGE"},{"id":"where:ERASER","word":"ERASER"},{"id":"where:BOOK","word":"BOOK"},{"id":"where:BAG","word":"BAG"},{"id":"where:PEN","word":"PEN"},{"id":"where:PENCIL","word":"PENCIL"},{"id":"where:RULER","word":"RULER"},{"id":"where:CAT","word":"CAT"},{"id":"where:DOG","word":"DOG"},{"id":"where:RABBIT","word":"RABBIT"},{"id":"where:BIRD","word":"BIRD"},{"id":"where:BALL","word":"BALL"},{"id":"where:BIKE","word":"BIKE"},{"id":"where:KEY","word":"KEY"},{"id":"where:LION","word":"LION"},{"id":"where:TIGER","word":"TIGER"},{"id":"where:ELEPHANT","word":"ELEPHANT"},{"id":"do:APPLE","word":"APPLE"},{"id":"do:BANANA","word":"BANANA"},{"id":"do:ORANGE","word":"ORANGE"},{"id":"do:EGG","word":"EGG"},{"id":"do:MILK","word":"MILK"},{"id":"do:BREAD","word":"BREAD"},{"id":"do:WATER","word":"WATER"},{"id":"do:SOUP","word":"SOUP"},{"id":"do:RICE","word":"RICE"},{"id":"do:FISH","word":"FISH"},{"id":"do:CHICKEN","word":"CHICKEN"}];

var LearningRewards=window.LearningRewards;

// --- StudentRecords.gs ---
/* Adventure passes and the hall share a durable LearningProfiles record.
 * Callers hold Code.gs's ScriptLock. Students and Logs are repairable projections.
 */
function studentRecordLoad(ss,id){
 if(!/^[0-9]{3,12}$/.test(id))return {error:'請先登入學生身分'};
 var students=ss.getSheetByName('Students');if(!students)return {error:'Students sheet missing'};
 var rows=students.getDataRange().getValues(),index=rows.findIndex(function(r,i){return i>0&&String(r[0])===id;});
 if(index<1)return {error:'Student not registered'};
 var row=rows[index],words=String(row[8]||'').split(',').filter(Boolean),sheet=ss.getSheetByName('LearningProfiles');
 if(!sheet){sheet=ss.insertSheet('LearningProfiles');sheet.getRange(1,1,1,26).setValues([['studentId'].concat(Array.from({length:24},function(_,i){return 'profileChunk'+(i+1);}),['updatedAt'])]);sheet.setFrozenRows(1);}
 var records=sheet.getDataRange().getValues(),n=records.findIndex(function(r,i){return i>0&&String(r[0])===id;});
 var record=n>0?JSON.parse(records[n].slice(1,25).join('')):{learning:LearningRewards.empty(),targetXP:Number(row[5])||0,words:words,hashes:{}};
 if(!record.learning||!Array.isArray(record.words)||!Number.isFinite(record.targetXP)||!record.hashes)throw Error('Learning profile needs recovery; original data retained');
 record.passReceipts=record.passReceipts||{};
 var priorAccess=Number(record.accessLevel)||Number(row[6])||1;
 var student={accessLevel:Math.max(priorAccess,Number(row[6])||1),xp:Math.max(Number(row[5])||0,record.targetXP),completedWords:Array.from(new Set(words.concat(record.words)))};
 return {needsSave:n<1||!record.accessLevel,id:id,ss:ss,students:students,studentIndex:index,row:row,sheet:sheet,recordIndex:n>0?n:Math.max(1,records.length),record:record,student:student};
}
function studentRecordSave(store){
 store.record.targetXP=store.student.xp;store.record.words=store.student.completedWords.slice();
 store.student.accessLevel=Math.max(store.student.accessLevel||1,store.student.xp<100?1:Math.floor(Math.pow(store.student.xp/100,1/1.35))+1);store.record.accessLevel=store.student.accessLevel;
 var json=JSON.stringify(store.record),chunks=[];for(var i=0;i<json.length;i+=40000)chunks.push(json.slice(i,i+40000));
 if(chunks.length>24)throw Error('Learning history storage limit; local event retained');
 while(chunks.length<24)chunks.push('');
 store.sheet.getRange(store.recordIndex+1,1,1,26).setValues([[store.id].concat(chunks,[new Date()])]);SpreadsheetApp.flush();store.needsSave=false;
}
function studentRecordLogExists(sheet,id,studentId){
 if(typeof sheet.getLastRow==='function'&&sheet.getLastRow()>1){var range=sheet.getRange(2,12,sheet.getLastRow()-1,1);if(typeof range.createTextFinder==='function')return range.createTextFinder(id).matchEntireCell(true).findAll().some(function(hit){return String(sheet.getRange(hit.getRow(),2,1,1).getValues()[0][0])===studentId;});}
 return sheet.getDataRange().getValues().some(function(r,i){return i>0&&String(r[11]||'')===id&&String(r[1])===studentId;});
}
function studentRecordFinish(store){
 if(store.needsSave){studentRecordSave(store);store.needsSave=false;}
 var s=store.student;s.level=s.xp<100?1:Math.floor(Math.pow(s.xp/100,1/1.35))+1;s.accessLevel=Math.max(s.accessLevel||1,s.level);s.stars=s.completedWords.length;s.badgesCount=Math.floor(s.stars/3);
 store.students.getRange(store.studentIndex+1,6,1,6).setValues([[s.xp,s.level,s.stars,s.completedWords.join(','),s.badgesCount,new Date()]]);SpreadsheetApp.flush();
 var pending=Object.keys(store.record.passReceipts).filter(function(id){return !store.record.passReceipts[id].logged;});if(!pending.length)return;
 var logs=store.ss.getSheetByName('Passport_Logs');
 if(!logs){logs=store.ss.insertSheet('Passport_Logs');logs.appendRow(['時間戳記','學號','年級','班級','座號','姓名','關卡空間','挑戰單字','獲得XP','是否教師跳過','用戶代理','eventId']);}
 logs.getRange(1,12,1,1).setValues([['eventId']]);
 pending.forEach(function(id){var receipt=store.record.passReceipts[id];if(!studentRecordLogExists(logs,id,store.id)){var entry=receipt.log.slice();entry[0]=new Date(entry[0]);logs.appendRow(entry);SpreadsheetApp.flush();}receipt.logged=true;delete receipt.log;});
 studentRecordSave(store);
}
function recordPassAction(payload,ss){
 var id=String(payload.studentId||''),eventId=String(payload.eventId||''),word=String(payload.word||'').trim().toUpperCase(),xp=payload.xp===undefined?50:Number(payload.xp);
 if(!/^[a-zA-Z0-9_-]{8,100}$/.test(eventId))return {status:'error',code:'upgrade_required',message:'請更新遊戲頁面，學習紀錄保留在原裝置'};
 if(!/^[A-Z][A-Z0-9 _'-]{0,34}$/.test(word)||!Number.isFinite(xp)||xp<0||xp>300)return {status:'error',message:'Invalid word or XP payload'};
 var companion=String(payload.companionWord||'').trim().toUpperCase();
 if(companion&&!/^[A-Z][A-Z0-9 _'-]{0,34}$/.test(companion))return {status:'error',message:'Invalid companion word'};
 var store=studentRecordLoad(ss,id);if(store.error)return {status:'error',message:store.error};
 var teacher=payload.isTeacherPass===true,zone=String(payload.zone||'zone1').slice(0,200),fingerprint=JSON.stringify([word,xp,teacher,zone,companion]);
 var exists=Object.prototype.hasOwnProperty.call(store.record.passReceipts,eventId);
 if(exists&&store.record.passReceipts[eventId].fingerprint!==fingerprint)return {status:'error',message:'EventId conflict'};
 var first=!store.student.completedWords.includes(word);
 if(!exists){
  store.student.xp+=xp;if(first)store.student.completedWords.push(word);if(companion&&!store.student.completedWords.includes(companion))store.student.completedWords.push(companion);var r=store.row;
  Object.defineProperty(store.record.passReceipts,eventId,{enumerable:true,configurable:true,writable:true,value:{fingerprint:fingerprint,logged:false,log:[new Date().toISOString(),id,String(r[1]),String(r[2]),String(r[3]),String(r[4]),zone,word,xp,teacher?'YES':'NO',String(payload.ua||'').slice(0,200),eventId]}});
  studentRecordSave(store);
 }
 studentRecordFinish(store);
 return {status:'success',protocol:'record-v2',eventId:eventId,replayed:exists,isFirstTime:!exists&&first,updatedProfile:store.student};
}


// --- LearningHub.gs ---
// Hall and adventure writes share the same durable record under Code.gs's ScriptLock.
function learningHubAction(payload,ss){
 const store=studentRecordLoad(ss,String(payload.studentId||''));if(store.error)return {status:'error',message:store.error};
 const record=store.record,student=store.student;
 if(payload.action==='learningEvent'){
  const raw=payload.event||{},event={id:raw.id,kind:raw.kind,word:LearningRewards.key(raw.word),time:Date.now()};
  if(typeof event.id!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(event.id))throw Error('Invalid event id');
  if(!LEARNING_WORDS.includes(event.word))throw Error('Word outside reference');
  if(event.kind==='sentence'){const sentence=LEARNING_SENTENCES.find(s=>s.id===raw.sentence&&s.word===event.word);if(!sentence)throw Error('Invalid sentence');event.sentence=sentence.id;}
  if(event.kind==='favorite'){if(typeof raw.value!=='boolean')throw Error('Invalid favorite');event.value=raw.value;}
  if(!['word','meaning','sentence','favorite'].includes(event.kind))throw Error('Invalid kind');
  const fingerprint=JSON.stringify([event.kind,event.word,event.sentence||'',event.value===true]);
  if(Object.prototype.hasOwnProperty.call(record.hashes,event.id)&&record.hashes[event.id]!==fingerprint)throw Error('Event id conflict');
  const result=LearningRewards.apply(record.learning,event,student.completedWords);record.learning=result.state;
  Object.defineProperty(record.hashes,event.id,{enumerable:true,configurable:true,writable:true,value:fingerprint});
  student.xp+=result.xp;if(event.kind==='word'&&!student.completedWords.includes(event.word))student.completedWords.push(event.word);
  studentRecordSave(store);
 }
 studentRecordFinish(store);
 return {status:'success',protocol:'learning-v1',learning:record.learning,student:student};
}


// --- TeacherAccess.gs ---
/* Teacher maintenance authorization is server-side. Never embed a default password in the game. */
function teacherDigest(text){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8).map(function(b){return ((b+256)%256).toString(16).padStart(2,'0');}).join('');}
function configureTeacherAccess(){
 var ui=SpreadsheetApp.getUi(),answer=ui.prompt('設定教師維護密碼','請輸入至少 12 個字元的新密碼；僅儲存加鹽雜湊。',ui.ButtonSet.OK_CANCEL);
 if(answer.getSelectedButton()!==ui.Button.OK)return;
 var pass=answer.getResponseText();if(pass.length<12||pass.length>200)throw Error('密碼需為 12～200 個字元');
 var salt=Utilities.getUuid(),props=PropertiesService.getScriptProperties();
 props.setProperties({WHIMSY_TEACHER_SALT:salt,WHIMSY_TEACHER_HASH:teacherDigest(salt+':'+pass)});
 ui.alert('已設定。原有教師工作階段已失效，請重新驗證。');
}
function teacherAuthenticate(payload){
 var props=PropertiesService.getScriptProperties(),salt=props.getProperty('WHIMSY_TEACHER_SALT'),expected=props.getProperty('WHIMSY_TEACHER_HASH');
 if(!salt||!expected)return {status:'error',code:'teacher_not_configured',message:'請老師先在後台執行 configureTeacherAccess 設定維護密碼'};
 var cache=CacheService.getScriptCache(),attempts=Number(cache.get('whimsy_teacher_attempts')||0);
 if(attempts>=5)return {status:'error',message:'嘗試次數過多，請稍後再試'};
 var pass=String(payload.passcode||'');
 if(pass.length>200||teacherDigest(salt+':'+pass)!==expected){cache.put('whimsy_teacher_attempts',String(attempts+1),60);return {status:'error',message:'教師維護密碼不正確'};}
 var session=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');
 cache.put('whimsy_teacher:'+teacherDigest(session),expected,600);cache.remove('whimsy_teacher_attempts');
 return {status:'success',protocol:'teacher-v1',session:session,expiresIn:600};
}
function teacherAuthorized(payload){
 var token=String(payload.teacherSession||'');if(!/^[a-f0-9]{64}$/.test(token))return false;
 var expected=PropertiesService.getScriptProperties().getProperty('WHIMSY_TEACHER_HASH');
 return !!expected&&CacheService.getScriptCache().get('whimsy_teacher:'+teacherDigest(token))===expected;
}

return {get:doGet,post:doPost,initialize:initSpreadsheet,configureTeacher:configureTeacherAccess};
})();
function doGet(e){return WHIMSY_BACKEND_20261017.get(e);}
function doPost(e){return WHIMSY_BACKEND_20261017.post(e);}
function initSpreadsheet(){return WHIMSY_BACKEND_20261017.initialize();}
function configureTeacherAccess(){return WHIMSY_BACKEND_20261017.configureTeacher();}
