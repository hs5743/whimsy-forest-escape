// 預設校本官方 Google 試算表 (GAS) 網址（學童進入網頁直接自動連線，完全免手動輸入）
const DEFAULT_OFFICIAL_GAS_URL = 'https://script.google.com/macros/s/AKfycbxMzYX-1b-fxlC6QN41uEdywDl0O-rRkt6Hw9AxypGdJB7FC3Ns7rpdvXryJwLULR01/exec';

// 雲端資料同步與學生護照歷程管理器 (CloudSyncManager)
class CloudSyncManager {
  constructor() {
    this.storageKey = 'whimsy_student_profile';
    this.queueKey = 'whimsy_pending_logs';
    this.gasUrlKey = 'whimsy_gas_url';
    this.defaultGasUrl = DEFAULT_OFFICIAL_GAS_URL;

    // 優先讀取本地端 GAS 網址；若未設定或為空，直接預設採用校本官方網址
    const localGas = localStorage.getItem(this.gasUrlKey);
    this.gasUrl = (localGas && localGas.trim() !== '') ? localGas.trim() : this.defaultGasUrl;
    try {
      if (!localGas || localGas.trim() === '') {
        localStorage.setItem(this.gasUrlKey, this.defaultGasUrl);
      }
    } catch (e) {}

    // 讀取當前登入學生檔案，若無則為訪客/遊客狀態
    this.profile = this.loadLocalProfile() || {
      studentId: 'guest_' + Math.floor(Math.random() * 10000),
      grade: '5',
      classId: '501',
      seatNo: '00',
      name: '見習冒險者',
      xp: 0,
      level: 1,
      stars: 0,
      completedWords: [],
      badgesCount: 0,
      wordMastery: {},
      isGuest: true
    };

    if (!this.profile.wordMastery) {
      this.profile.wordMastery = {};
    }

    this.currentStreak = 0;
    this.listeners = [];
    this.isSyncing = false;

    // 啟動離線重試佇列計時器 (每 25 秒檢查一次)
    setInterval(() => this.flushQueue(), 25000);
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('online', () => this.flushQueue());
    }
  }

  // 溫和冪次等級成長曲線計算：Level = floor((XP / 100) ^ (1 / 1.35)) + 1
  calculateLevel(xp) {
    if (!xp || xp < 100) return 1;
    return Math.floor(Math.pow(xp / 100, 1 / 1.35)) + 1;
  }

  getXpForLevel(lvl) {
    return Math.floor(100 * Math.pow(lvl, 1.35));
  }

  // 註冊狀態變更監聽器 (用於更新 HUD)
  onProfileUpdated(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.saveLocalProfile();
    this.listeners.forEach(cb => {
      try { cb(this.profile); } catch (e) { console.warn(e); }
    });
    this.updateCloudStatusIndicator();
  }

  // 讀取本地學生存檔
  loadLocalProfile() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  saveLocalProfile() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
    } catch (e) {}
  }

  // 設定或更新 GAS Web App 網址
  setGasUrl(url) {
    const cleanUrl = (url || '').trim();
    this.gasUrl = cleanUrl || this.defaultGasUrl;
    try {
      localStorage.setItem(this.gasUrlKey, this.gasUrl);
    } catch (e) {}
    this.updateCloudStatusIndicator();
  }

  // 恢復校本官方預設 GAS 網址
  resetToDefaultGasUrl() {
    this.setGasUrl(this.defaultGasUrl);
    return this.defaultGasUrl;
  }

  // 學生登入 / 切換身分
  async login(grade, classId, seatNo, name) {
    const paddedSeat = String(seatNo || '01').padStart(2, '0');
    const studentId = `${classId}${paddedSeat}`;

    this.profile = {
      studentId: studentId,
      grade: String(grade || '5'),
      classId: String(classId || '501'),
      seatNo: paddedSeat,
      name: String(name || '學生').trim(),
      xp: this.profile.isGuest ? this.profile.xp : 0,
      level: this.profile.isGuest ? this.profile.level : 1,
      stars: this.profile.isGuest ? this.profile.stars : 0,
      completedWords: this.profile.isGuest ? this.profile.completedWords : [],
      badgesCount: this.profile.isGuest ? this.profile.badgesCount : 0,
      isGuest: false
    };

    this.notifyListeners();

    // 若已串接 GAS，向雲端嘗試同步
    if (this.gasUrl) {
      try {
        const res = await fetch(this.gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'loginOrRegister',
            grade: this.profile.grade,
            classId: this.profile.classId,
            seatNo: this.profile.seatNo,
            name: this.profile.name,
            studentId: this.profile.studentId
          })
        });

        const json = await res.json();
        if (json.status === 'success' && json.student) {
          // 合併雲端進度
          const s = json.student;
          this.profile.xp = Math.max(this.profile.xp, s.xp || 0);
          this.profile.level = Math.max(this.profile.level, s.level || 1);
          this.profile.stars = Math.max(this.profile.stars, s.stars || 0);
          this.profile.badgesCount = Math.max(this.profile.badgesCount, s.badgesCount || 0);
          
          if (Array.isArray(s.completedWords)) {
            s.completedWords.forEach(w => {
              if (!this.profile.completedWords.includes(w)) {
                this.profile.completedWords.push(w);
              }
            });
          }
          this.notifyListeners();
        }
      } catch (err) {
        console.warn('GAS 登入雲端同步略過，維持本地進度:', err);
      }
    }

    return this.profile;
  }

  // 訪客快速登入
  loginGuest() {
    this.profile = {
      studentId: 'guest_' + Math.floor(Math.random() * 10000),
      grade: '5',
      classId: '501',
      seatNo: '00',
      name: '見習冒險者',
      xp: 0,
      level: 1,
      stars: 0,
      completedWords: [],
      badgesCount: 0,
      isGuest: true
    };
    this.notifyListeners();
    return this.profile;
  }

  // 記錄單字過關並寫入雲端與本地 (含連擊倍率與五星精熟度)
  async recordWordPass(wordKey, baseXP = 50, isTeacherPass = false, zone = 'Zone 1: 見習學徒書齋') {
    const word = String(wordKey || '').toUpperCase();
    
    // 1. 計算連續答對連擊加成 (Streak Multiplier)
    let streakMultiplier = 1.0;
    if (isTeacherPass) {
      this.currentStreak = 0;
    } else {
      this.currentStreak++;
      if (this.currentStreak >= 5) {
        streakMultiplier = 1.5; // 5 連擊 1.5x 加成
      } else if (this.currentStreak >= 3) {
        streakMultiplier = 1.2; // 3 連擊 1.2x 加成
      }
    }

    const actualXP = Math.round(baseXP * streakMultiplier);

    // 2. 更新本地經驗值與溫和冪次等級
    this.profile.xp += actualXP;
    this.profile.level = this.calculateLevel(this.profile.xp);

    // 3. 更新五星精熟度 (5-Star Mastery)
    if (!this.profile.wordMastery) this.profile.wordMastery = {};
    const curMastery = this.profile.wordMastery[word] || { stars: 0, times: 0 };
    curMastery.times++;
    if (!isTeacherPass && curMastery.stars < 5) {
      curMastery.stars = Math.min(5, curMastery.stars + 1);
    } else if (curMastery.stars === 0) {
      curMastery.stars = 1;
    }
    curMastery.lastPassedAt = Date.now();
    this.profile.wordMastery[word] = curMastery;

    let isFirstTime = false;
    if (!this.profile.completedWords.includes(word)) {
      this.profile.completedWords.push(word);
      this.profile.stars = this.profile.completedWords.length;
      this.profile.badgesCount = Math.floor(this.profile.stars / 3);
      isFirstTime = true;
    }

    this.notifyListeners();

    // 4. 構建通關資料包
    const payload = {
      action: 'recordPass',
      studentId: this.profile.studentId,
      grade: this.profile.grade,
      classId: this.profile.classId,
      seatNo: this.profile.seatNo,
      name: this.profile.name,
      word: word,
      xp: actualXP,
      isTeacherPass: isTeacherPass,
      streak: this.currentStreak,
      streakMultiplier: streakMultiplier,
      zone: zone,
      ua: navigator.userAgent.substring(0, 80)
    };

    // 5. 若有 GAS 網址則嘗試傳送，失敗則加入離線重試佇列
    if (this.gasUrl) {
      this.sendOrQueue(payload);
    }

    return {
      isFirstTime,
      actualXP,
      streak: this.currentStreak,
      streakMultiplier,
      mastery: curMastery,
      profile: this.profile
    };
  }

  // 發送或存入離線佇列
  async sendOrQueue(payload) {
    if (!navigator.onLine) {
      this.enqueue(payload);
      return;
    }

    try {
      const res = await fetch(this.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status !== 'success') {
        this.enqueue(payload);
      } else {
        this.updateCloudStatusIndicator(true);
      }
    } catch (e) {
      this.enqueue(payload);
    }
  }

  enqueue(payload) {
    try {
      const q = JSON.parse(localStorage.getItem(this.queueKey) || '[]');
      q.push({ ...payload, queuedAt: Date.now() });
      localStorage.setItem(this.queueKey, JSON.stringify(q));
      this.updateCloudStatusIndicator();
    } catch (e) {}
  }

  // 清空並補傳離線日誌
  async flushQueue() {
    if (!this.gasUrl || !navigator.onLine || this.isSyncing) return;
    
    let q = [];
    try {
      q = JSON.parse(localStorage.getItem(this.queueKey) || '[]');
    } catch (e) { q = []; }

    if (q.length === 0) return;

    this.isSyncing = true;
    const remaining = [];

    for (let i = 0; i < q.length; i++) {
      const item = q[i];
      try {
        const res = await fetch(this.gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(item)
        });
        const data = await res.json();
        if (data.status !== 'success') {
          remaining.push(item);
        }
      } catch (err) {
        remaining.push(item);
      }
    }

    localStorage.setItem(this.queueKey, JSON.stringify(remaining));
    this.isSyncing = false;
    this.updateCloudStatusIndicator();
  }

  // 查詢排行榜
  async getLeaderboard(classFilter = '') {
    // 若有串接 GAS，向雲端撈取
    if (this.gasUrl && navigator.onLine) {
      try {
        const url = `${this.gasUrl}?action=getLeaderboard&classId=${encodeURIComponent(classFilter)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.leaderboard)) {
          return data.leaderboard;
        }
      } catch (err) {
        console.warn('無法從 GAS 取得排行榜，使用本地模擬資料:', err);
      }
    }

    // 離線/未設定時之本機模擬排行榜
    const mockList = [
      { rank: 1, name: '小狐狸 Foxy', classId: '501', seatNo: '01', xp: 550, level: 6, stars: 12, badgesCount: 4 },
      { rank: 2, name: '小兔 Bunny', classId: '501', seatNo: '02', xp: 350, level: 4, stars: 8, badgesCount: 2 },
      { rank: 3, name: '長老 Ollie', classId: '502', seatNo: '15', xp: 250, level: 3, stars: 6, badgesCount: 2 },
      { rank: 4, name: '貓咪 Mimic', classId: '501', seatNo: '09', xp: 150, level: 2, stars: 4, badgesCount: 1 }
    ];

    // 如果目前登入的學生有分數，插入並重新排名
    if (this.profile && this.profile.xp > 0) {
      mockList.push({
        rank: 0,
        name: this.profile.name + ' (你)',
        classId: this.profile.classId,
        seatNo: this.profile.seatNo,
        xp: this.profile.xp,
        level: this.profile.level,
        stars: this.profile.stars,
        badgesCount: this.profile.badgesCount,
        isMe: true
      });
      mockList.sort((a, b) => b.xp - a.xp);
      mockList.forEach((item, idx) => item.rank = idx + 1);
    }

    return mockList.filter(item => !classFilter || item.classId === classFilter);
  }

  // 更新 HUD 上面的雲端連線狀態圖示
  updateCloudStatusIndicator(justSent = false) {
    const indicator = document.getElementById('cloudStatusPill');
    if (!indicator) return;

    let pendingCount = 0;
    try {
      const q = JSON.parse(localStorage.getItem(this.queueKey) || '[]');
      pendingCount = q.length;
    } catch (e) {}

    if (!this.gasUrl) {
      indicator.innerHTML = `<span>⚪</span> 單機模式`;
      indicator.title = '未設定 GAS 網址，紀錄僅保存在此設備。點此設定雲端連線。';
      indicator.className = 'cloud-status-pill mode-local';
    } else if (pendingCount > 0) {
      indicator.innerHTML = `<span>🟡</span> 暫存 ${pendingCount} 筆待傳`;
      indicator.title = `有 ${pendingCount} 筆通關資料將在連線順暢時自動補傳。`;
      indicator.className = 'cloud-status-pill mode-pending';
    } else {
      indicator.innerHTML = `<span>🟢</span> 雲端已同步`;
      indicator.title = '已成功連線至 Google 試算表！';
      indicator.className = 'cloud-status-pill mode-online';
    }
  }
}

// 建立全域單例
window.cloudSyncManager = new CloudSyncManager();
