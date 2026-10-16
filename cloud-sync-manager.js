// 預設校本官方 Google 試算表 (GAS) 網址（學童進入網頁直接自動連線，完全免手動輸入）
const DEFAULT_OFFICIAL_GAS_URL = 'https://script.google.com/macros/s/AKfycbxMzYX-1b-fxlC6QN41uEdywDl0O-rRkt6Hw9AxypGdJB7FC3Ns7rpdvXryJwLULR01/exec';
// Public client marker. Teacher maintenance authorization is validated by GAS.
const APP_CLIENT_SECURITY_TOKEN = 'whimsy_forest_escape_2026';

// 雲端資料同步與學生護照歷程管理器 (CloudSyncManager)
class CloudSyncManager {
  constructor() {
    this.devMode = window.GamePolish?.isLocalPreview() || false;
    this.storageKey = 'whimsy_student_profile';
    this.queueKey = 'whimsy_pending_logs';
    this.gasUrlKey = 'whimsy_gas_url';
    this.defaultGasUrl = DEFAULT_OFFICIAL_GAS_URL;
    this.clientToken = APP_CLIENT_SECURITY_TOKEN;
    this.outbox = window.RecordOutbox ? new window.RecordOutbox(localStorage, this.queueKey) : null;
    this.teacherSession = null;
    this.recordProtocol = null;

    // 優先讀取本地端 GAS 網址；若未設定或為空，直接預設採用校本官方網址
    let localGas=null;
    try{localGas=localStorage.getItem(this.gasUrlKey);}catch(_){this.lastStorageError='無法存取此裝置儲存空間';}
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

    this.profile.accessLevel=Math.max(this.profile.accessLevel||1,this.profile.level||1,this.calculateLevel(this.profile.xp));
    this.profile.level=this.calculateLevel(this.profile.xp);
    this.currentStreak = 0;
    this.listeners = [];
    this.isSyncing = false;
    this.recoverPendingProfile();

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
    if(this.devMode)return true;
    try {
      const value=JSON.stringify(this.profile);localStorage.setItem(this.storageKey,value);
      if(localStorage.getItem(this.storageKey)!==value)return false;
      try{localStorage.setItem(this.storageKey+':'+this.profile.studentId,value);}catch(_){}
      return true;
    } catch(_){return false;}
  }

  // 設定或更新 GAS Web App 網址
  setGasUrl(url) {
    const cleanUrl = (url || '').trim();
    this.gasUrl = cleanUrl || this.defaultGasUrl;
    this.recordProtocol = null; this.teacherSession = null;
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

  // Maintenance sessions stay in memory and are validated by the backend.
  async verifyTeacherPassword(passcode) {
    if (this.devMode || !this.gasUrl || !navigator.onLine) return false;
    try {
      const response = await fetch(this.gasUrl, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'teacherAuthenticate',token:this.clientToken,passcode})});
      const data = await response.json();
      if (data.status !== 'success' || data.protocol !== 'teacher-v1' || !/^[a-f0-9]{64}$/.test(data.session || '')) { this.teacherAuthError=data.message || '請先更新並設定教師後台'; return false; }
      this.teacherSession={token:data.session,expires:Date.now()+Math.min(600,Number(data.expiresIn)||0)*1000,url:this.gasUrl};return true;
    } catch (_) { this.teacherAuthError='無法連接教師驗證服務，請稍後重試';return false; }
  }

  // 安全測試 GAS 連線 (帶上 Security Token)
  async testPing(customUrl = null) {
    if(this.devMode) return {success:false, message:"本機場景檢查停用雲端連線"};
    const targetUrl = (customUrl || this.gasUrl || '').trim();
    if (!targetUrl) return { success: false, message: '未設定 GAS 網址' };
    try {
      const res = await fetch(`${targetUrl}?action=ping&token=${encodeURIComponent(this.clientToken)}`);
      const json = await res.json();
      if (json.status === 'success') {
        return { success: true, message: json.message || '連線正常' };
      }
      return { success: false, message: json.message || '後端回應異常' };
    } catch (e) {
      return { success: false, message: e.message || '連線失敗，請確認網路或試算表設定' };
    }
  }

  // Public display-name masking; this is not student authentication.
  static maskStudentName(name) {
    const str = String(name || '').trim();
    if (!str || str.startsWith('見習')) return str;
    if (str.length === 2) {
      return str[0] + '○';
    } else if (str.length === 3) {
      return str[0] + '○' + str[2];
    } else if (str.length === 4) {
      return str[0] + '○○' + str[3];
    } else if (str.length > 4) {
      return str.slice(0, 1) + '***' + str.slice(-1);
    }
    return str;
  }

  // 學生登入 / 切換身分
  async login(grade, classId, seatNo, name) {
    if(this.devMode) return {success:false, message:"本機場景檢查停用雲端連線"};
    const paddedSeat = String(seatNo || '01').padStart(2, '0');
    const studentId = `${classId}${paddedSeat}`;
    this.saveLocalProfile();
    let savedStudent=null;
    try{savedStudent=JSON.parse(localStorage.getItem(this.storageKey+':'+studentId)||'null');if(savedStudent?.studentId!==studentId)savedStudent=null;}catch(_){}
    const localProgress=this.profile.isGuest?this.profile:savedStudent;

    this.profile = {
      studentId: studentId,
      grade: String(grade || '5'),
      classId: String(classId || '501'),
      seatNo: paddedSeat,
      name: String(name || '學生').trim(),
      xp: localProgress?.xp || 0,
      level: localProgress?.level || 1,
      accessLevel: Math.max(localProgress?.accessLevel||1,localProgress?.level||1),
      stars: localProgress?.stars || 0,
      completedWords: [...(localProgress?.completedWords || [])],
      badgesCount: localProgress?.badgesCount || 0,
      wordMastery: localProgress?.wordMastery || {},
      appliedPassEvents: [...(localProgress?.appliedPassEvents || [])],
      isGuest: false
    };

    this.recoverPendingProfile();
    this.notifyListeners();
    const loginOwner=this.profile.studentId;
    this.lastLoginSync={owner:loginOwner,state:'local'};

    // 若已串接 GAS，向雲端嘗試同步
    if (this.gasUrl) {
      try {
        const res = await fetch(this.gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'loginOrRegister',
            token: this.clientToken,
            grade: this.profile.grade,
            classId: this.profile.classId,
            seatNo: this.profile.seatNo,
            name: this.profile.name,
            studentId: this.profile.studentId
          })
        });

        const json = await res.json();
        if (this.profile.studentId===loginOwner && json.status === 'success' && json.student) {
          // 合併雲端進度
          const s = json.student;
          this.profile.xp = Math.max(this.profile.xp, s.xp || 0);
          this.profile.level = this.calculateLevel(this.profile.xp);
          this.profile.accessLevel=Math.max(this.profile.accessLevel||1,s.accessLevel||s.level||1,this.profile.level);
          this.lastLoginSync={owner:loginOwner,state:'synced'};
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
        if(this.profile.studentId===loginOwner)this.lastLoginSync={owner:loginOwner,state:'offline'};
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

  // A pass is saved before its network request; the profile is its local projection.
  recordWordPass(wordKey, baseXP = 50, isTeacherPass = false, zone = 'zone1', options = {}) {
    if(this.devMode) return {saved:true,preview:true};
    const word=String(wordKey||'').trim().toUpperCase();
    if(!word || word.length>35 || !Number.isFinite(baseXP) || baseXP<0)return {saved:false};
    const streak=options.streak===false?this.currentStreak:isTeacherPass?0:this.currentStreak+1,multiplier=options.streak===false?1:streak>=5?1.5:streak>=3?1.2:1;
    const companionWord=String(options.companionWord||'').trim().toUpperCase();
    const words=[...new Set([word,...(companionWord?[companionWord]:[])])];
    if(words.some(w=>w.length>35))return {saved:false};
    const actualXP=Math.min(300,Math.round(baseXP*multiplier));
    const eventId=window.crypto?.randomUUID?.() || ('pass_'+Date.now()+'_'+Math.random().toString(36).slice(2));
    const payload={action:'recordPass',eventId,token:this.clientToken,studentId:this.profile.studentId,word,companionWord,xp:actualXP,isTeacherPass,zone,projection:true,ua:(navigator.userAgent||'').slice(0,80),destination:this.gasUrl};
    const oldProfile=this.profile,oldStreak=this.currentStreak,p=JSON.parse(JSON.stringify(oldProfile));
    const isFirstTime=!p.completedWords.includes(word);
    if(!p.isGuest && !this.enqueue(payload))return {saved:false};
    p.xp+=actualXP;p.level=this.calculateLevel(p.xp);p.accessLevel=Math.max(p.accessLevel||1,p.level);p.wordMastery||={};
    for(const entry of words){const mastery=p.wordMastery[entry]||{stars:0,times:0};mastery.times++;
      mastery.stars=isTeacherPass?Math.max(1,mastery.stars):Math.min(5,mastery.stars+1);mastery.lastPassedAt=Date.now();p.wordMastery[entry]=mastery;
      if(!p.completedWords.includes(entry))p.completedWords.push(entry);
    }
    const mastery=p.wordMastery[word];p.stars=p.completedWords.length;p.badgesCount=Math.floor(p.stars/3);
    p.appliedPassEvents=[...(p.appliedPassEvents||[]),eventId];this.profile=p;this.currentStreak=streak;
    if(p.isGuest && !this.saveLocalProfile()){this.profile=oldProfile;this.currentStreak=oldStreak;this.lastStorageError='此裝置無法保存紀錄，請檢查儲存空間';return {saved:false};}
    this.notifyListeners();if(!p.isGuest)void this.flushQueue();
    return {saved:true,isFirstTime,actualXP,streak,streakMultiplier:multiplier,mastery,profile:this.profile};
  }

  recoverPendingProfile() {
    if(this.devMode || !this.outbox || this.profile.isGuest)return;
    try {
      const p=this.profile,applied=new Set(p.appliedPassEvents||[]);let changed=false;
      for(const e of this.outbox.entries())if(e.projection===true && e.studentId===p.studentId && !applied.has(e.eventId)){
        p.xp+=e.xp;for(const word of [e.word,e.companionWord].filter(Boolean))if(!p.completedWords.includes(word))p.completedWords.push(word);applied.add(e.eventId);changed=true;
      }
      if(changed){p.appliedPassEvents=[...applied];p.level=this.calculateLevel(p.xp);p.stars=p.completedWords.length;p.badgesCount=Math.floor(p.stars/3);this.saveLocalProfile();}
    }catch(e){this.lastStorageError=e.message;}
  }

  enqueue(payload) {
    if(this.devMode)return false;
    try { if(!this.outbox)throw Error('同步模組尚未載入');this.outbox.put(payload);this.lastStorageError='';this.updateCloudStatusIndicator();return true; }
    catch(e){this.lastStorageError=e.message||'無法保存待傳紀錄';this.updateCloudStatusIndicator();return false;}
  }
  async sendOrQueue(payload) {if(!this.devMode && this.enqueue(payload))await this.flushQueue();}
  async ensureRecordProtocol() {
    if(this.recordProtocol?.url===this.gasUrl && Date.now()<this.recordProtocol.until)return this.recordProtocol.ready;
    const url=this.gasUrl;
    try {
      const response=await fetch(url+'?action=ping');const data=await response.json();
      const ready=data.status==='success'&&data.recordProtocol==='record-v2';
      this.recordProtocol={url,ready,until:Date.now()+(ready?60000:10000)};return ready;
    } catch(_){return null;}
  }
  async flushQueue() {
    if(this.devMode || !this.outbox || !this.gasUrl || !navigator.onLine || this.isSyncing)return;
    this.isSyncing=true;
    try {
      const snapshot=this.outbox.entries().filter(e=>!String(e.studentId).startsWith('guest_')&&(!e.destination||e.destination===this.gasUrl)).slice(0,25);if(!snapshot.length)return;
      // Persist legacy array entries with stable IDs before the first request.
      for(const item of snapshot)this.outbox.put(item);
      const ready=await this.ensureRecordProtocol();
      if(ready!==true){this.backendNeedsUpdate=ready===false;return;}
      this.backendNeedsUpdate=false;
      for(const item of snapshot){
        if(item.destination && item.destination!==this.gasUrl)continue;
        if(String(item.studentId).startsWith('guest_'))continue;
        try {
          const response=await fetch(this.gasUrl,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(item)});
          const data=await response.json();
          if(data.status!=='success'||data.protocol!=='record-v2'||data.eventId!==item.eventId)continue;
          if(this.profile.studentId===item.studentId && data.updatedProfile){
            const p=this.profile;p.xp=Math.max(p.xp,Number(data.updatedProfile.xp)||0);p.level=this.calculateLevel(p.xp);
            p.completedWords=[...new Set([...p.completedWords,...(data.updatedProfile.completedWords||[])])];p.stars=p.completedWords.length;p.badgesCount=Math.floor(p.stars/3);this.notifyListeners();
          }
          this.outbox.acknowledge(item.eventId);
          if(this.profile.studentId===item.studentId){this.profile.appliedPassEvents=(this.profile.appliedPassEvents||[]).filter(id=>id!==item.eventId);this.saveLocalProfile();}
        }catch(e){console.warn('紀錄保留，等待安全重試:',e.message);}
      }
    } catch(e){this.lastStorageError=e.message||'無法讀取待傳紀錄';}
    finally{this.isSyncing=false;this.updateCloudStatusIndicator();}
  }

  // 查詢排行榜
  async getLeaderboard(classFilter = '') {
    if(this.devMode) return [];
    // 若有串接 GAS，向雲端撈取
    if (this.gasUrl && navigator.onLine) {
      try {
        const url = `${this.gasUrl}?action=getLeaderboard&classId=${encodeURIComponent(classFilter)}&token=${encodeURIComponent(this.clientToken)}`;
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
    if(this.devMode) { const pill=document.getElementById("cloudStatusPill"); if(pill) pill.textContent="本機場景檢查 · 不同步成績"; return; }
    const indicator = document.getElementById('cloudStatusPill');
    const dot = document.getElementById('cloudStatusDot');

    let pendingCount = 0;
    try { pendingCount=this.outbox?.entries().filter(e=>!String(e.studentId).startsWith('guest_')).length||0; } catch(e) { this.lastStorageError=e.message; }
    if(this.lastStorageError){if(indicator)indicator.textContent='儲存待確認 · '+this.lastStorageError;return;}


    if (!this.gasUrl) {
      if (indicator) {
        indicator.innerHTML = `<span>⚪</span> 單機模式`;
        indicator.title = '未設定 GAS 網址，紀錄僅保存在此設備。點此設定雲端連線。';
        indicator.className = 'cloud-status-pill mode-local';
      }
      if (dot) {
        dot.className = 'status-dot dot-local';
        dot.title = '雲端連線：單機模式';
      }
    } else if (pendingCount > 0) {
      if (indicator) {
        indicator.textContent = this.backendNeedsUpdate ? `本機已保存 · ${pendingCount} 筆等待後台更新` : `暫存 ${pendingCount} 筆待傳`;
        indicator.title = `有 ${pendingCount} 筆通關資料將在連線順暢時自動補傳。`;
        indicator.className = 'cloud-status-pill mode-pending';
      }
      if (dot) {
        dot.className = 'status-dot dot-pending';
        dot.title = `雲端連線：暫存 ${pendingCount} 筆待傳`;
      }
    } else {
      if (indicator) {
        indicator.textContent = justSent ? '🟢 原關卡紀錄已送達' : '⚪ 雲端服務已設定';
        indicator.title = '原關卡英語學習服務已設定。大廳紀錄的同步狀態請查看大廳視窗；冒險存檔請查看跨裝置續玩。';
        indicator.className = 'cloud-status-pill mode-online';
      }
      if (dot) {
        dot.className = 'status-dot dot-online';
        dot.title = justSent ? '原關卡紀錄已送達' : '雲端服務已設定；尚無本次傳送確認';
      }
    }
  }
}

// 建立全域單例
window.cloudSyncManager = new CloudSyncManager();
