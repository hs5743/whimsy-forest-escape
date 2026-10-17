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
