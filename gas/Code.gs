/**
 * 《童趣森林魔法書齋逃脫：英語冒險護照》
 * Google Apps Script (GAS) 雲端資料庫後端 API (Code.gs)
 * 
 * 【部署說明】：
 * 1. 建立一個全新的 Google 試算表（例如命名為「新港國小英語冒險護照後端」）。
 * 2. 點選試算表上方選單「擴充功能」->「Apps Script」。
 * 3. 將本檔案全部內容複製貼上至 Code.gs，並儲存。
 * 4. 點擊「執行」-> 選擇「initSpreadsheet」進行試算表分頁與欄位自動初始化。
 * 5. 點擊右上角「部署」->「新增部署作業」：
 *    - 種類選擇「網頁應用程式 (Web App)」
 *    - 說明填寫「v1.0」
 *    - 誰可以存取：選擇「所有人 (Anyone)」（重要！否則前端無法跨域呼叫）
 * 6. 複製取得的「網頁應用程式網址 (Web App URL)」，貼入遊戲前端的雲端設定即可！
 */

// 試算表分頁名稱定義
const SHEET_STUDENTS = "Students";
const SHEET_LOGS = "Passport_Logs";
const SHEET_CONFIG = "Config";

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
    configSheet.appendRow(["teacher_pass_key", "teacherpass", "教室吵雜環境免麥克風過關密鑰"]);
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

    // 1. 健康檢查 Ping
    if (action === "ping") {
      return makeJsonResponse({ status: "success", message: "Whimsy Forest GAS API is active!", timestamp: new Date() });
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
          name: String(r[4] || "無名魔法使"),
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
              name: String(r[4]),
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
    if (action === "generateReport") {
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
          cs.topStudent = { name: String(r[4] || ""), seatNo: String(r[3] || ""), xp: xp, level: level };
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
    const ss = SpreadsheetApp.getActiveSpreadsheet();

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
        const r = rows[foundIndex - 1];
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

    // 2. 記錄單字口說過關 (Word Pass)
    if (action === "recordPass") {
      const studentId = String(payload.studentId || "");
      const word = String(payload.word || "").toUpperCase();
      const xpGained = Number(payload.xp || 50);
      const isTeacherPass = Boolean(payload.isTeacherPass);
      const zone = String(payload.zone || "Zone 1: 見習學徒書齋");
      const ua = String(payload.ua || "");

      if (!studentId || !word) {
        return makeJsonResponse({ status: "error", message: "Missing studentId or word" });
      }

      const now = new Date();

      // 2.1 寫入通關流水帳日誌 (Logs)
      const logSheet = ss.getSheetByName(SHEET_LOGS);
      const studentSheet = ss.getSheetByName(SHEET_STUDENTS);
      const rows = studentSheet.getDataRange().getValues();
      let studentRow = -1;

      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === studentId) {
          studentRow = i + 1;
          break;
        }
      }

      let grade = "", classId = "", seatNo = "", name = "";
      if (studentRow > 0) {
        grade = String(rows[studentRow - 1][1]);
        classId = String(rows[studentRow - 1][2]);
        seatNo = String(rows[studentRow - 1][3]);
        name = String(rows[studentRow - 1][4]);
      }

      logSheet.appendRow([
        now, studentId, grade, classId, seatNo, name,
        zone, word, xpGained, isTeacherPass ? "YES" : "NO", ua
      ]);

      // 2.2 更新學生總表
      if (studentRow > 0) {
        const curXP = Number(rows[studentRow - 1][5] || 0) + xpGained;
        const curLevel = Math.floor(curXP / 100) + 1;
        let wordsList = rows[studentRow - 1][8] ? String(rows[studentRow - 1][8]).split(",").filter(Boolean) : [];
        
        let isFirstTime = false;
        if (!wordsList.includes(word)) {
          wordsList.push(word);
          isFirstTime = true;
        }

        const curStars = wordsList.length; // 每個新單字計 1 顆星
        const curBadges = Math.floor(wordsList.length / 3); // 每 3 個單字獲 1 徽章

        studentSheet.getRange(studentRow, 6).setValue(curXP);
        studentSheet.getRange(studentRow, 7).setValue(curLevel);
        studentSheet.getRange(studentRow, 8).setValue(curStars);
        studentSheet.getRange(studentRow, 9).setValue(wordsList.join(","));
        studentSheet.getRange(studentRow, 10).setValue(curBadges);
        studentSheet.getRange(studentRow, 11).setValue(now);

        return makeJsonResponse({
          status: "success",
          isFirstTime: isFirstTime,
          updatedProfile: {
            xp: curXP,
            level: curLevel,
            stars: curStars,
            completedWords: wordsList,
            badgesCount: curBadges
          }
        });
      }

      return makeJsonResponse({ status: "success", message: "Logged without student profile update" });
    }

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
