/* ================================================================
   FoundationLearn — app.js
   Main application logic for the 192-session study tracker.
   Milestones M1–M5 implemented.
   ================================================================ */

'use strict';

// ================================================================
// 1. I18N
// ================================================================
const I18N = {
  zh: {
    navDashboard: '儀表板',
    navMap: '課程地圖',
    navPractice: '練習',
    navProgress: '紀錄',
    navSettings: '設定',
    loading: '載入中…',
    errorLoad: '⚠ 無法載入課程資料，請確認本機伺服器已啟動。',
    contentInProgress: '📝 內容建置中 / Content in progress',
    contentInProgressSub: '本節內容仍在撰寫中，但您已可勾選完成。',
    completeLesson: '完成本節',
    alreadyDone: '✓ 已完成',
    completedAt: '完成時間',
    checkpoints: '檢核點',
    summary: '本節評語',
    summaryPlaceholder: '想補充嘅話寫低…（選填）',
    reflectHint: '揀一個或幾個（可多選）：',
    summaryOptional: '想補充？（選填）',
    fieldLink: '🏭 現場連結',
    resources: '學習資源',
    prevLesson: '← 上一節',
    nextLesson: '下一節 →',
    backToMap: '← 返回課程地圖',
    toPlatform: '前往平台 ▸',
    objective: '🎯 學習目標',
    streak: '連續天數',
    streakDays: '天',
    longestStreak: '最長',
    continueBtn: '繼續上次',
    weekProg: '本週進度',
    coreWeeks: '🔒 必保核心週',
    todoTitle: '待補清單',
    todoPlaceholder: '記下之後要回頭的概念…',
    todoAdd: '新增',
    stageProgress: '各階段進度',
    exportJSON: '匯出學習記錄 JSON',
    importJSON: '匯入',
    importSuccess: '✓ 已成功匯入學習記錄！',
    importFail: '⚠ 匯入失敗，請確認檔案格式正確。',
    exportDone: '✓ 已匯出',
    completed: '已完成',
    completedMsg: '✓ 本節完成！',
    wrongBook: '錯題本',
    yourAnswer: '你的答案',
    correctAnswer: '正確答案',
    quizScore: '得分',
    quizItems: '題',
    practiceTitle: '練習 & 自測',
    selectScope: '選擇範圍：',
    startPractice: '開始測驗',
    allSessions: '全部',
    journalTitle: '學習日誌',
    summaryList: '評語彙整',
    achievementsTitle: '成就徽章',
    settingsTitle: '設定',
    storageModeTitle: '儲存方式',
    langTitle: '介面語言',
    themeTitle: '主題',
    dark: '深色',
    storage_memory: '記憶體（重整清空）',
    storage_local: 'Local（永久儲存）',
    storage_drive: 'Google Drive 同步',
    noWrong: '🎉 目前沒有錯題！繼續保持。',
    noJournal: '尚無學習記錄。完成第一節後這裡會出現日誌。',
    noSummary: '尚無評語。完成節次並點選評語後會出現在這裡。',
    draftSuffix: '建置中',
    coreSuffix: '★',
    weeks: '週',
  },
  en: {
    navDashboard: 'Dashboard',
    navMap: 'Course Map',
    navPractice: 'Practice',
    navProgress: 'Records',
    navSettings: 'Settings',
    loading: 'Loading…',
    errorLoad: '⚠ Failed to load course data. Please make sure a local server is running.',
    contentInProgress: '📝 Content in progress',
    contentInProgressSub: 'This session\'s content is still being written, but you can already check it off.',
    completeLesson: 'Complete Session',
    alreadyDone: '✓ Completed',
    completedAt: 'Completed at',
    checkpoints: 'Checkpoints',
    summary: 'Lesson Reflection',
    summaryPlaceholder: 'Add a note if you like… (optional)',
    reflectHint: 'Tap one or more:',
    summaryOptional: 'Add a note? (optional)',
    fieldLink: '🏭 Field Connection',
    resources: 'Resources',
    prevLesson: '← Previous',
    nextLesson: 'Next →',
    backToMap: '← Back to Map',
    toPlatform: 'Go to Platform ▸',
    objective: '🎯 Objective',
    streak: 'Streak',
    streakDays: ' days',
    longestStreak: 'Best',
    continueBtn: 'Continue Last',
    weekProg: 'This Week',
    coreWeeks: '🔒 Core Weeks',
    todoTitle: 'Follow-up List',
    todoPlaceholder: 'Note a concept to revisit later…',
    todoAdd: 'Add',
    stageProgress: 'Stage Progress',
    exportJSON: 'Export Records JSON',
    importJSON: 'Import',
    importSuccess: '✓ Records imported successfully!',
    importFail: '⚠ Import failed. Please check file format.',
    exportDone: '✓ Exported',
    completed: 'Completed',
    completedMsg: '✓ Session completed!',
    wrongBook: 'Wrong Answers',
    yourAnswer: 'Your answer',
    correctAnswer: 'Correct answer',
    quizScore: 'Score',
    quizItems: ' items',
    practiceTitle: 'Practice & Quiz',
    selectScope: 'Scope:',
    startPractice: 'Start Quiz',
    allSessions: 'All',
    journalTitle: 'Learning Journal',
    summaryList: 'Summaries',
    achievementsTitle: 'Achievements',
    settingsTitle: 'Settings',
    storageModeTitle: 'Storage Mode',
    langTitle: 'Interface Language',
    themeTitle: 'Theme',
    dark: 'Dark',
    storage_memory: 'Memory (clears on reload)',
    storage_local: 'Local (permanent)',
    storage_drive: 'Google Drive Sync',
    noWrong: '🎉 No wrong answers yet! Keep it up.',
    noJournal: 'No learning records yet. Complete your first session to see the journal.',
    noSummary: 'No reflections yet. Tap a reflection chip after completing a session.',
    draftSuffix: 'draft',
    coreSuffix: '★',
    weeks: ' week',
  }
};

function t(key) {
  const lang = appState.settings.lang;
  return (I18N[lang] && I18N[lang][key]) || I18N.zh[key] || key;
}

// ----------------------------------------------------------------
// 本節評語標籤（點選式，取代手打三句總結）
// 選中的 key 存進 userState.sessions[id].summaryTags（陣列）
// ----------------------------------------------------------------
const REFLECT_CHIPS = [
  { key: 'got',    zh: '✅ 完全懂咗', en: '✅ Fully understood', color: 'var(--accent-green)' },
  { key: 'mostly', zh: '🙂 大致明',   en: '🙂 Mostly clear',     color: 'var(--accent-blue)' },
  { key: 'stuck',  zh: '🤔 有位卡住', en: '🤔 Got stuck',        color: 'var(--accent-gold)' },
  { key: 'review', zh: '🔁 要再複習', en: '🔁 Need review',      color: 'var(--accent-purple)' },
];
function reflectChipLabel(key) {
  const c = REFLECT_CHIPS.find(x => x.key === key);
  if (!c) return key;
  return appState.settings.lang === 'en' ? c.en : c.zh;
}
// 把一節的評語（標籤＋選填補充）組成顯示字串，供日誌/彙整用
function reflectSummaryText(s) {
  if (!s) return '';
  const parts = [];
  const tags = (s.summaryTags || []).map(reflectChipLabel);
  if (tags.length) parts.push(tags.join(' · '));
  if (s.summary && s.summary.trim()) parts.push(s.summary.trim());
  return parts.join('　—　');
}
// 一節是否有任何評語（標籤或補充文字）
function hasReflect(s) {
  return !!(s && (((s.summaryTags || []).length) || (s.summary && s.summary.trim())));
}

// ================================================================
// 2. DEFAULT USER STATE
// ================================================================
function defaultUserState() {
  return {
    sessions: {},
    streak: { current: 0, longest: 0, lastStudyDate: null },
    totalMinutes: 0,
    wrongBook: [],
    glossary: [],
    todo: [],
    achievements: [],
    confidenceLog: [],
    srs: {},
    milestones: {},
    settings: { theme: 'dark', lang: 'zh', storageMode: 'local' }
  };
}

// ================================================================
// 2b. STATE MERGE (防資料遺失：合併兩份進度，永不弄丟任何一邊)
// ================================================================
// 一個「空白」狀態（全新裝置）：沒有任何已完成節次、沒有學習分鐘、沒有成就/錯題。
function isEmptyUserState(s) {
  if (!s) return true;
  const anyCompleted = Object.values(s.sessions || {}).some(v => v && v.completed);
  return !anyCompleted
    && !(s.totalMinutes > 0)
    && !((s.achievements || []).length)
    && !((s.wrongBook || []).length);
}

// 兩段文字衝突時，挑「較晚編輯 / 較長」的那一份（不直接丟棄）。
function _pickText(x, y, xt, yt) {
  x = x || ''; y = y || '';
  if (!x) return y;
  if (!y || x === y) return x;
  if (xt && yt) return (xt >= yt) ? x : y;
  return x.length >= y.length ? x : y;
}

// 陣列依 stringify 做聯集去重（保守、無損：最壞情況留下近似重複，但絕不弄丟）。
function _unionArr(a, b) {
  const map = new Map();
  for (const it of (a || [])) map.set(JSON.stringify(it), it);
  for (const it of (b || [])) { const k = JSON.stringify(it); if (!map.has(k)) map.set(k, it); }
  return [...map.values()];
}

// 合併單一節次：完成狀態取 OR、檢核點取聯集、計數取最大、文字挑較新。
function _mergeSession(a, b) {
  if (!a) return b;
  if (!b) return a;
  const out = {};
  out.completed = !!(a.completed || b.completed);
  const dones = [a.completedAt, b.completedAt].filter(Boolean).sort();
  if (dones.length) out.completedAt = dones[0];            // 最早完成時間
  const touched = [a.lastTouched, b.lastTouched].filter(Boolean).sort();
  if (touched.length) out.lastTouched = touched[touched.length - 1]; // 最後接觸時間
  // 檢核點：每個 key 取 OR（已勾的永不變回未勾）
  out.checkpoints = {};
  const cpKeys = new Set([...Object.keys(a.checkpoints || {}), ...Object.keys(b.checkpoints || {})]);
  for (const k of cpKeys) out.checkpoints[k] = !!(a.checkpoints?.[k] || b.checkpoints?.[k]);
  // 三句話總結（選填補充文字）：挑較新/較長
  const sum = _pickText(a.summary, b.summary, a.lastTouched, b.lastTouched);
  if (sum) out.summary = sum;
  // 評語標籤：兩邊都有就取較新一側（比 lastTouched），只有一邊有就取嗰邊
  const aTags = a.summaryTags || [], bTags = b.summaryTags || [];
  const mergedTags = (aTags.length && bTags.length)
    ? (((a.lastTouched || '') >= (b.lastTouched || '')) ? aTags : bTags)
    : (aTags.length ? aTags : bTags);
  if (mergedTags.length) out.summaryTags = mergedTags;
  // 個人筆記：挑較新/較長
  const nt = _pickText(a.note, b.note, a.lastTouched, b.lastTouched);
  if (nt) out.note = nt;
  // 自由作答：逐題挑較新/較長
  out.freeAnswers = {};
  const faKeys = new Set([...Object.keys(a.freeAnswers || {}), ...Object.keys(b.freeAnswers || {})]);
  for (const k of faKeys) out.freeAnswers[k] = _pickText(a.freeAnswers?.[k], b.freeAnswers?.[k], a.lastTouched, b.lastTouched);
  return out;
}

// 合併兩份完整 userState：聯集所有進度，任何一邊有的都保留。順序無關。
function mergeUserStates(a, b) {
  a = a || defaultUserState();
  b = b || defaultUserState();
  const out = defaultUserState();

  // sessions：聯集所有 id，逐節合併
  const ids = new Set([...Object.keys(a.sessions || {}), ...Object.keys(b.sessions || {})]);
  for (const id of ids) out.sessions[id] = _mergeSession(a.sessions?.[id], b.sessions?.[id]);

  // streak：longest 取最大；current/lastStudyDate 取較近一次學習
  out.streak.longest = Math.max(a.streak?.longest || 0, b.streak?.longest || 0);
  const aD = a.streak?.lastStudyDate || '', bD = b.streak?.lastStudyDate || '';
  if (aD >= bD) { out.streak.current = a.streak?.current || 0; out.streak.lastStudyDate = aD || null; }
  else          { out.streak.current = b.streak?.current || 0; out.streak.lastStudyDate = bD || null; }

  // 學習分鐘：取最大（避免重複裝置相加灌水，且永不縮水）
  out.totalMinutes = Math.max(a.totalMinutes || 0, b.totalMinutes || 0);

  // 清單類：聯集
  out.wrongBook    = _unionArr(a.wrongBook,  b.wrongBook);
  out.glossary     = _unionArr(a.glossary,   b.glossary);
  out.todo         = _unionArr(a.todo,       b.todo);
  out.achievements = [...new Set([...(a.achievements || []), ...(b.achievements || [])])];

  // confidenceLog：依 sessionId+qi 去重，保留較新的一筆
  const cmap = new Map();
  for (const e of [...(a.confidenceLog || []), ...(b.confidenceLog || [])]) {
    const k = e.sessionId + '|' + e.qi;
    const prev = cmap.get(k);
    if (!prev || (e.at || '') >= (prev.at || '')) cmap.set(k, e);
  }
  out.confidenceLog = [...cmap.values()];

  // srs：依 sessionId 合併，保留較近一次複習的排程
  out.srs = {};
  const srsIds = new Set([...Object.keys(a.srs || {}), ...Object.keys(b.srs || {})]);
  for (const id of srsIds) {
    const ea = a.srs?.[id], eb = b.srs?.[id];
    if (!ea) out.srs[id] = eb;
    else if (!eb) out.srs[id] = ea;
    else out.srs[id] = (ea.lastReview || '') >= (eb.lastReview || '') ? ea : eb;
  }

  // milestones：聯集，保留較早通過時間
  out.milestones = {};
  const msKeys = new Set([...Object.keys(a.milestones || {}), ...Object.keys(b.milestones || {})]);
  for (const k of msKeys) {
    const va = a.milestones?.[k], vb = b.milestones?.[k];
    out.milestones[k] = (va && vb) ? (va < vb ? va : vb) : (va || vb);
  }

  // 設定：以 a（當前裝置）為主，缺的用 b 補
  out.settings = Object.assign({}, b.settings, a.settings);
  return out;
}

// ── #6 間隔複習（SRS，SM-2 簡化版）──────────────────────────────
function srsSeed(id, dueToday) {
  userState.srs = userState.srs || {};
  if (userState.srs[id]) return;
  const d = new Date(); d.setDate(d.getDate() + (dueToday ? 0 : 1));
  userState.srs[id] = { interval: 1, ease: 2.3, reps: 0, due: d.toISOString().slice(0, 10), lastReview: null };
}
function srsReview(id, grade) {  // grade: 'again' | 'good' | 'easy'
  userState.srs = userState.srs || {};
  const e = userState.srs[id] || { interval: 1, ease: 2.3, reps: 0 };
  if (grade === 'again') {
    e.reps = 0; e.interval = 1; e.ease = Math.max(1.3, (e.ease || 2.3) - 0.2);
  } else {
    if (e.reps === 0)      e.interval = grade === 'easy' ? 3 : 1;
    else if (e.reps === 1) e.interval = grade === 'easy' ? 7 : 3;
    else                   e.interval = Math.max(1, Math.round(e.interval * (grade === 'easy' ? (e.ease + 0.15) : e.ease)));
    if (grade === 'easy') e.ease = Math.min(3.0, (e.ease || 2.3) + 0.15);
    e.reps = (e.reps || 0) + 1;
  }
  const d = new Date(); d.setDate(d.getDate() + e.interval);
  e.due = d.toISOString().slice(0, 10);
  e.lastReview = new Date().toISOString();
  userState.srs[id] = e;
  flog('RECORD', `srs review: ${id} grade=${grade} → next ${e.due} (${e.interval}d)`);
  save();
}
// 已完成但沒排程的節次，補種為「今天到期」，讓既有進度也進複習佇列
function srsSeedCompleted() {
  for (const [id, s] of Object.entries(userState.sessions || {})) {
    if (s.completed && !userState.srs?.[id]) srsSeed(id, true);
  }
}
function srsDueIds() {
  const td = today();
  return Object.keys(userState.srs || {})
    .filter(id => (userState.srs[id].due || '') <= td && userState.sessions[id]?.completed)
    .sort((a, b) => (userState.srs[a].due || '').localeCompare(userState.srs[b].due || ''));
}

// ================================================================
// 3. STORAGE ADAPTERS
// ================================================================
const MemoryStore = {
  _data: null,
  load()  { return this._data ? deepClone(this._data) : defaultUserState(); },
  save(s) { this._data = deepClone(s); }
};

const LocalStore = {
  KEY: 'fl_v1',
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : defaultUserState();
    } catch (e) { return defaultUserState(); }
  },
  save(s) {
    try { localStorage.setItem(this.KEY, JSON.stringify(s)); }
    catch (e) { console.error('LocalStore save failed', e); }
  }
};

const DriveStore = (() => {
  // ── Config (separate from user data, survives fl_v1 clears) ───
  const CFG_KEY   = 'fl_config';
  const SCOPE     = 'https://www.googleapis.com/auth/drive.appdata';
  const FILE_NAME = 'fl_userstate.json';

  let _token     = null;   // { value, expiry }
  let _fileId    = null;
  let _saveTimer = null;
  let _status    = 'idle'; // 'idle'|'syncing'|'ok'|'error'

  function _cfg()         { try { return JSON.parse(localStorage.getItem(CFG_KEY)||'{}'); } catch { return {}; } }
  function _setCfg(patch) { localStorage.setItem(CFG_KEY, JSON.stringify({..._cfg(),...patch})); }
  function _clientId()    { return _cfg().driveClientId || ''; }
  function _tokenOk()     { return !!(_token?.value && Date.now() < _token.expiry - 60000); }

  async function _requestToken(prompt='') {
    return new Promise((resolve, reject) => {
      if (typeof google === 'undefined' || !google.accounts?.oauth2)
        return reject(new Error('Google Identity Services 尚未載入'));
      google.accounts.oauth2.initTokenClient({
        client_id: _clientId(),
        scope: SCOPE,
        callback(r) {
          if (r.error) return reject(new Error(r.error_description || r.error));
          _token = { value: r.access_token, expiry: Date.now() + (r.expires_in||3600)*1000 };
          _setCfg({ driveConnected: true, driveLastAuth: new Date().toISOString() });
          resolve(_token.value);
        },
        error_callback(e) { reject(new Error(e?.message||'OAuth error')); }
      }).requestAccessToken({ prompt });
    });
  }

  async function _tok() {
    if (_tokenOk()) return _token.value;
    try { return await _requestToken('none'); } catch {}
    return await _requestToken('');
  }

  async function _api(method, path, { params, json, raw, rawType }={}) {
    const t = await _tok();
    const isUpload = raw !== undefined;
    const base = isUpload
      ? 'https://www.googleapis.com/upload/drive/v3'
      : 'https://www.googleapis.com/drive/v3';
    const url = new URL(`${base}/${path}`);
    if (params) Object.entries(params).forEach(([k,v]) => url.searchParams.set(k,v));
    const headers = { Authorization: `Bearer ${t}` };
    let body;
    if (isUpload) {
      body = raw;
      headers['Content-Type'] = rawType || 'application/json';
    } else if (json !== undefined) {
      body = JSON.stringify(json);
      headers['Content-Type'] = 'application/json';
    }
    const r = await fetch(url.toString(), { method, headers, body });
    if (!r.ok) { const e = await r.text().catch(()=>''); throw new Error(`Drive ${method} ${path}: ${r.status} ${e.slice(0,120)}`); }
    const text = await r.text();
    try { return text ? JSON.parse(text) : null; } catch { return null; }
  }

  async function _findFile() {
    if (_fileId) return _fileId;
    const res = await _api('GET', 'files', { params: {
      q: `name='${FILE_NAME}' and 'appDataFolder' in parents and trashed=false`,
      spaces: 'appDataFolder', fields: 'files(id)'
    }});
    _fileId = res?.files?.[0]?.id || null;
    return _fileId;
  }

  async function _createFile(data) {
    const meta = JSON.stringify({ name: FILE_NAME, parents: ['appDataFolder'] });
    const body = JSON.stringify(data);
    const b    = '----FLboundary' + Math.random().toString(36).slice(2);
    const mp   = `--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${b}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${b}--`;
    const res  = await _api('POST', 'files', {
      params: { uploadType: 'multipart', fields: 'id' },
      raw: mp, rawType: `multipart/related; boundary=${b}`
    });
    _fileId = res?.id || null;
  }

  async function _updateFile(data) {
    await _api('PATCH', `files/${_fileId}`, {
      params: { uploadType: 'media' }, raw: JSON.stringify(data), rawType: 'application/json'
    });
  }

  async function _downloadFile(id) {
    const t = await _tok();
    const r = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
      { headers: { Authorization: `Bearer ${t}` } });
    if (!r.ok) throw new Error(`Drive download: ${r.status}`);
    return r.text();
  }

  function _setStatus(s, ts) {
    _status = s;
    if (ts) _setCfg({ driveLastSync: ts });
    // Refresh Drive UI row if visible
    const el = document.getElementById('drive-cfg-inner');
    if (el) el.innerHTML = _pub.configHtml();
  }

  // 蓋上同步時間戳（不動原物件）
  function _stamp(s) {
    return Object.assign({}, s, { _meta: { updatedAt: new Date().toISOString() } });
  }

  const _pub = {
    configured() { return !!_clientId(); },
    connected()  { return _tokenOk(); },
    status()     { return _status; },
    lastSync()   { return _cfg().driveLastSync || null; },
    clientId()   { return _clientId(); },

    setClientId(id) {
      _setCfg({ driveClientId: id.trim() });
      _fileId = null;
      flog('STORAGE', 'DriveStore: Client ID saved');
    },

    async connect() {
      if (!this.configured()) throw new Error('請先輸入 Google Client ID');
      _setStatus('syncing');
      await _requestToken('');
      _setStatus('ok', new Date().toISOString());
      flog('STORAGE', 'DriveStore.connect: authorized');
      showToast('✓ 已連接 Google Drive', 'success');
    },

    disconnect() {
      if (_token?.value && typeof google !== 'undefined')
        google.accounts.oauth2.revoke(_token.value, ()=>{});
      _token = null; _fileId = null;
      _setCfg({ driveConnected: false });
      _setStatus('idle');
      flog('STORAGE', 'DriveStore.disconnect: revoked');
      showToast('已中斷 Google Drive 連接', 'info');
    },

    // 載入＝把 Drive 的進度與本機進度「合併」，不是單向覆蓋。
    async load() {
      const local = LocalStore.load();
      if (!this.configured() || !this.connected()) return local;
      try {
        _setStatus('syncing');
        const id = await _findFile();
        if (!id) {
          // Drive 還沒有檔案：若本機有進度就建立並上傳，否則先不建立空檔
          if (!isEmptyUserState(local)) await _createFile(_stamp(local));
          _setStatus('ok', new Date().toISOString());
          flog('STORAGE', 'DriveStore.load: no remote file, pushed local');
          return local;
        }
        const remote = JSON.parse(await _downloadFile(id));
        const merged = mergeUserStates(local, remote);   // ← 合併，永不弄丟
        LocalStore.save(merged);
        // 若合併後比 Drive 多（本機有額外進度），把合併結果寫回 Drive
        await _updateFile(_stamp(merged));
        _setStatus('ok', new Date().toISOString());
        flog('STORAGE', 'DriveStore.load: merged local+remote', {
          localDone:  Object.values(local.sessions  || {}).filter(v => v.completed).length,
          remoteDone: Object.values(remote.sessions || {}).filter(v => v.completed).length,
          mergedDone: Object.values(merged.sessions || {}).filter(v => v.completed).length
        });
        return merged;
      } catch(e) {
        flogErr('STORAGE', 'DriveStore.load merge failed', e);
        _setStatus('error');
        return local;
      }
    },

    // 儲存＝先寫本機，再（去抖動後）把「本機與 Drive 的合併結果」寫回 Drive。
    save(s) {
      LocalStore.save(s); // always local-first
      if (!this.configured() || !this.connected()) return;
      clearTimeout(_saveTimer);
      _saveTimer = setTimeout(async () => {
        try {
          _setStatus('syncing');
          const id = await _findFile();
          if (!id) {
            if (isEmptyUserState(s)) { _setStatus('idle'); return; } // 不為空狀態建立檔案
            await _createFile(_stamp(s));
          } else {
            // 推送前先抓 Drive 現況合併，避免覆蓋其他裝置的進度
            let remote = null;
            try { remote = JSON.parse(await _downloadFile(id)); } catch {}
            const merged = remote ? mergeUserStates(s, remote) : s;
            // 安全閘：絕不用空白狀態覆蓋非空的 Drive
            if (isEmptyUserState(merged)) { _setStatus('idle'); return; }
            await _updateFile(_stamp(merged));
            LocalStore.save(merged); // 本機也補上 Drive 端的額外進度（下次導航即顯示）
          }
          _setStatus('ok', new Date().toISOString());
          flog('STORAGE', 'DriveStore.save: merged & synced', { fileId: _fileId });
        } catch(e) {
          flogErr('STORAGE', 'DriveStore.save failed', e);
          _setStatus('error');
        }
      }, 3000); // debounce 3 s
    },

    // HTML fragment for settings UI (called by renderSettings)
    configHtml() {
      const cid   = this.clientId();
      const conn  = this.connected();
      const st    = this.status();
      const ls    = this.lastSync();
      const lsFmt = ls ? new Date(ls).toLocaleString('zh-TW',{dateStyle:'short',timeStyle:'short'}) : '從未';
      const stBadge = st==='ok' ? `<span style="color:var(--accent-green)">✓ 已同步</span>`
                    : st==='syncing' ? `<span style="color:var(--accent-gold)">⟳ 同步中…</span>`
                    : st==='error'   ? `<span style="color:var(--accent-red)">✗ 同步失敗</span>`
                    : `<span style="color:var(--text-muted)">未連接</span>`;
      return `
        <div style="margin-bottom:14px;">
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">
            Google OAuth Client ID
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener"
               style="color:var(--accent-blue);margin-left:6px;font-size:11px;">📖 設定說明</a>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <input id="drive-cid-input" type="text" value="${esc(cid)}"
              placeholder="xxxxxxxx.apps.googleusercontent.com"
              style="flex:1;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;
                     padding:8px 10px;color:var(--text-primary);font-size:12px;font-family:monospace;"
              oninput="document.getElementById('drive-cid-save').style.opacity='1'">
            <button id="drive-cid-save" onclick="driveSaveClientId()"
              style="opacity:${cid?'1':'0.5'};background:var(--accent-blue);color:#fff;border:none;
                     border-radius:6px;padding:8px 14px;font-size:12px;cursor:pointer;transition:opacity 0.2s;">
              儲存
            </button>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
          <div style="font-size:12px;">
            ${stBadge}
            ${conn ? `<span style="color:var(--text-muted);margin-left:8px;">上次：${lsFmt}</span>` : ''}
          </div>
          <div style="display:flex;gap:8px;">
            ${conn
              ? `<button onclick="driveSync()" style="background:var(--bg-input);color:var(--accent-teal);
                   border:1px solid var(--accent-teal);border-radius:6px;padding:7px 14px;font-size:12px;cursor:pointer;">
                   ⟳ 立即同步</button>
                 <button onclick="driveDisconnect()" style="background:var(--bg-input);color:var(--accent-red);
                   border:1px solid var(--accent-red);border-radius:6px;padding:7px 14px;font-size:12px;cursor:pointer;">
                   中斷連接</button>`
              : `<button onclick="driveConnect()" ${!cid?'disabled':''} style="background:${cid?'#1a3a6e':'var(--bg-input)'};
                   color:${cid?'var(--accent-blue)':'var(--text-muted)'};border:1px solid ${cid?'var(--accent-blue)':'var(--border)'};
                   border-radius:6px;padding:7px 14px;font-size:12px;cursor:${cid?'pointer':'not-allowed'};">
                   連接 Google Drive</button>`}
          </div>
        </div>
        <details style="margin-top:14px;">
          <summary style="font-size:11px;color:var(--text-muted);cursor:pointer;">📖 如何取得 Client ID？（展開說明）</summary>
          <ol style="font-size:11px;color:var(--text-secondary);margin-top:8px;padding-left:18px;line-height:2;">
            <li>前往 <a href="https://console.cloud.google.com/" target="_blank" style="color:var(--accent-blue);">console.cloud.google.com</a>，用你的 Google 帳號登入</li>
            <li>建立新專案（名稱隨意，如 FoundationLearn）</li>
            <li>左側選單 → API 和服務 → 啟用 API → 搜尋「Google Drive API」→ 啟用</li>
            <li>左側 → OAuth 同意畫面 → 選「外部」→ 填入應用程式名稱 → 儲存</li>
            <li>左側 → 憑證 → 建立憑證 → OAuth 用戶端 ID → 選「Web 應用程式」</li>
            <li>已授權的 JavaScript 來源：加入 <code style="background:var(--bg-input);padding:2px 4px;border-radius:3px;">http://localhost:8080</code></li>
            <li>若已部署 GitHub Pages 也加入那個網址</li>
            <li>建立後複製「用戶端 ID」（格式：xxxxxxxx.apps.googleusercontent.com）</li>
            <li>貼到上方輸入框，按儲存，再按「連接 Google Drive」</li>
          </ol>
        </details>`;
    }
  };
  return _pub;
})();

// ================================================================
// 4. APP STATE
// ================================================================
const appState = {
  manifest: null,
  storage: null,
  settings: { lang: 'zh', storageMode: 'local' },
  sessionCache: {},
  currentPage: 'pg-dashboard',
  currentSessionId: null,
  mapScrollY: 0,
  enterTime: 0,
  _charts: {}
};

let userState = defaultUserState();

// ================================================================
// 5. UTILITY FUNCTIONS
// ================================================================
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function today() { return new Date().toISOString().slice(0, 10); }

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function showToast(msg, type = 'info', duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.classList.remove('show'); }, duration);
}

function showLoader(msg) {
  const el = document.getElementById('loader');
  const msgEl = document.getElementById('loader-msg');
  if (msgEl) msgEl.textContent = msg || t('loading');
  el.classList.remove('hidden');
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}

function el(id)    { return document.getElementById(id); }
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx){ return [...(ctx || document).querySelectorAll(sel)]; }

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function save() {
  userState.settings.lang = appState.settings.lang;
  userState.settings.storageMode = appState.settings.storageMode;
  try {
    appState.storage.save(userState);
    flog('STORAGE', `save: OK mode=${appState.settings.storageMode}`, {
      sessions: Object.keys(userState.sessions).length,
      wrongBook: userState.wrongBook?.length || 0
    });
  } catch(e) {
    flogErr('STORAGE', `save: FAILED — ${e.message}`, e);
  }
}

function getSessionOrder(id) {
  const meta = appState.manifest?.sessionMeta?.[id];
  if (!meta) return 0;
  return parseInt(id.replace('S', ''), 10);
}

function getAllSessionIds() {
  const ids = [];
  if (!appState.manifest) return ids;
  for (const stage of appState.manifest.stages)
    for (const week of stage.weeks)
      ids.push(...week.sessionIds);
  return ids;
}

function getWeekForSession(id) {
  if (!appState.manifest) return null;
  for (const stage of appState.manifest.stages)
    for (const week of stage.weeks)
      if (week.sessionIds.includes(id))
        return { stage, week };
  return null;
}

function countCompleted() {
  return Object.values(userState.sessions).filter(s => s.completed).length;
}

function countCompletedInWeek(sessionIds) {
  return sessionIds.filter(id => userState.sessions[id]?.completed).length;
}

function getLastTouchedSession() {
  let best = null, bestTime = '';
  for (const [id, s] of Object.entries(userState.sessions)) {
    const t = s.completedAt || s.lastTouched || '';
    if (t > bestTime) { bestTime = t; best = id; }
  }
  return best;
}

// ================================================================
// 6. ROUTER
// ================================================================
function navigate(pageId, params = {}) {
  flog('UI', `navigate: ${appState.currentPage || '?'} → ${pageId}`, params && Object.keys(params).length ? params : undefined);

  // Track time spent
  if (appState.currentPage === 'pg-lesson' && appState.enterTime) {
    const mins = Math.min(90, Math.round((Date.now() - appState.enterTime) / 60000));
    if (mins > 0) {
      flog('RECORD', `time tracked: ${mins} min on ${appState.currentSessionId}`);
      userState.totalMinutes = (userState.totalMinutes || 0) + mins; save();
    }
  }

  if (appState.currentPage === 'pg-map') {
    appState.mapScrollY = window.scrollY;
  }

  // Hide lesson-specific overlays when leaving lesson page
  if (appState.currentPage === 'pg-lesson') {
    const bar = el('reading-bar');
    if (bar) bar.style.display = 'none';
    const fs = el('formula-sidebar'); if (fs) fs.remove();
    const ft = el('formula-tab');     if (ft) ft.remove();
    window.removeEventListener('scroll', window._readScroll);
  }

  qsa('.page').forEach(p => p.classList.remove('active'));
  qsa('.nav-btn[data-page], .bnav-btn[data-page]').forEach(b => b.classList.remove('active'));

  const page = el(pageId);
  if (!page) return;
  page.classList.add('active');

  qsa(`[data-page="${pageId}"]`).forEach(b => b.classList.add('active'));

  appState.currentPage = pageId;
  window.scrollTo(0, 0);
  history.pushState({ page: pageId, params }, '', `#${pageId}`);

  switch (pageId) {
    case 'pg-dashboard': renderDashboard(); break;
    case 'pg-map':       renderCourseMap(); break;
    case 'pg-lesson':    renderLesson(params.id); break;
    case 'pg-practice':  renderPractice(params); break;
    case 'pg-progress':  renderProgress(); break;
    case 'pg-resources': renderResources(); break;
    case 'pg-settings':  renderSettings(); break;
  }
}

window.addEventListener('popstate', e => {
  if (e.state?.page) navigate(e.state.page, e.state.params || {});
});

// ================================================================
// 7. MANIFEST LOADING
// ================================================================
async function loadManifest() {
  flog('CONTENT', 'loadManifest: fetching manifest.json…');
  showLoader(t('loading'));
  try {
    const t0 = Date.now();
    const res = await fetch('./data/manifest.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    appState.manifest = await res.json();
    const total = appState.manifest?.meta?.totalSessions || 0;
    flog('CONTENT', `loadManifest: OK in ${Date.now()-t0}ms`, { sessions: total, stages: appState.manifest?.stages?.length });
  } catch (err) {
    flogErr('CONTENT', `loadManifest: FAILED — ${err.message}`, err);
    hideLoader();
    el('pg-dashboard').classList.add('active');
    el('pg-dashboard').innerHTML = `<div class="card" style="text-align:center;padding:40px;">
      <p style="font-size:18px;margin-bottom:10px;">⚠</p>
      <p>${t('errorLoad')}</p>
      <p style="font-size:12px;color:var(--text-muted);margin-top:8px;">fetch error: ${err.message}</p>
    </div>`;
    return false;
  }
  return true;
}

// ================================================================
// 8. SESSION LOADING
// ================================================================
// U29: LRU cache — max 30 sessions
const _LRU_MAX = 30;
const _lruOrder = [];
function _lruTouch(id) {
  const idx = _lruOrder.indexOf(id);
  if (idx !== -1) _lruOrder.splice(idx, 1);
  _lruOrder.push(id);
  if (_lruOrder.length > _LRU_MAX) {
    const evict = _lruOrder.shift();
    delete appState.sessionCache[evict];
  }
}

async function loadSession(id) {
  if (appState.sessionCache[id]) {
    flog('CONTENT', `loadSession: cache hit ${id}`);
    _lruTouch(id); return appState.sessionCache[id];
  }
  flog('CONTENT', `loadSession: fetching ${id}…`);
  try {
    const t0 = Date.now();
    const res = await fetch(`./data/sessions/${id}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    appState.sessionCache[id] = data;
    _lruTouch(id);
    flog('CONTENT', `loadSession: ${id} loaded in ${Date.now()-t0}ms`, { status: data.status, quiz: data.quiz?.length, charts: data.charts?.length });
    return data;
  } catch (e) {
    flogWarn('CONTENT', `loadSession: ${id} not found — showing draft fallback`, { error: e.message });
    // Return a minimal draft object for missing/404 sessions
    const meta = appState.manifest?.sessionMeta?.[id] || {};
    const wk = getWeekForSession(id);
    const draft = {
      id, stage: wk?.stage?.id || 1, week: wk?.week?.id || 1,
      order: parseInt(id.replace('S',''),10),
      title: meta.title || id,
      titleEn: meta.titleEn || id,
      platform: meta.platform || 'self',
      objective: '',
      isCore: meta.isCore || false,
      status: 'draft',
      content: '', fieldLink: '',
      checkpoints: [{ id:'c1', text: t('contentInProgressSub') }],
      resources: [], charts: [], quiz: []
    };
    appState.sessionCache[id] = draft;
    return draft;
  }
}

// ================================================================
// 9. PROGRESS SYSTEM
// ================================================================
function updateStreak() {
  const td = today();
  const s = userState.streak;
  const before = s.current;
  if (s.lastStudyDate === td) return;
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  const yd = yesterday.toISOString().slice(0,10);
  // U18: grace period — allow day-before-yesterday as fallback (once per week)
  const twoDaysAgo = new Date(); twoDaysAgo.setDate(twoDaysAgo.getDate()-2);
  const tda = twoDaysAgo.toISOString().slice(0,10);
  const graceUsed = userState.streak._graceUsedWeek === _weekNum(td);

  if (s.lastStudyDate === yd) {
    s.current++;
  } else if (s.lastStudyDate === tda && !graceUsed) {
    // grace: missed one day, forgiven
    s.current++;
    userState.streak._graceUsedWeek = _weekNum(td);
    showToast('⚡ 補做寬限已套用，Streak 保住了！', 'warn', 3500);
  } else {
    s.current = 1;
  }
  s.longest = Math.max(s.longest, s.current);
  s.lastStudyDate = td;
  flog('RECORD', `updateStreak: ${before} → ${s.current}`, { longest: s.longest, date: td });
}

function _weekNum(dateStr) {
  const d = new Date(dateStr);
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
}

function checkAchievements() {
  const unlocked = new Set(userState.achievements);
  const done = new Set(Object.entries(userState.sessions).filter(([,v])=>v.completed).map(([k])=>k));
  const newBadges = [];

  const check = (id, cond) => {
    if (!unlocked.has(id) && cond) { newBadges.push(id); unlocked.add(id); }
  };

  check('first_step',   done.size >= 1);
  check('week1_done',   appState.manifest?.stages[0]?.weeks[0]?.sessionIds.every(id=>done.has(id)));
  check('week6_done',   appState.manifest?.stages[1]?.weeks[1]?.sessionIds.every(id=>done.has(id)));
  check('week7_done',   appState.manifest?.stages[1]?.weeks[2]?.sessionIds.every(id=>done.has(id)));
  check('week9_done',   appState.manifest?.stages[2]?.weeks[0]?.sessionIds.every(id=>done.has(id)));
  check('stage1_done',  appState.manifest?.stages[0]?.weeks.flatMap(w=>w.sessionIds).every(id=>done.has(id)));
  check('stage2_done',  appState.manifest?.stages[1]?.weeks.flatMap(w=>w.sessionIds).every(id=>done.has(id)));
  check('stage3_done',  appState.manifest?.stages[2]?.weeks.flatMap(w=>w.sessionIds).every(id=>done.has(id)));
  check('streak_7',     (userState.streak?.current || 0) >= 7);
  check('streak_30',    (userState.streak?.current || 0) >= 30);
  check('s90_s91',      done.has('S90') && done.has('S91'));
  check('finish',       done.has('S192'));

  if (newBadges.length) {
    flog('RECORD', `achievements unlocked: ${newBadges.join(', ')}`, { total: [...unlocked].length });
    userState.achievements = [...unlocked];
    const NAMES = {
      first_step: '第一步', week1_done: '微積分入門', week6_done: '擴散達人',
      week7_done: '相圖大師', week9_done: '熱力學入門',
      stage1_done: '第一階段完成', stage2_done: '第二階段完成', stage3_done: '第三階段完成',
      streak_7: '連續 7 天', streak_30: '連續 30 天',
      s90_s91: 'Arrhenius 達人', finish: '🎓 準備就緒'
    };
    for (const b of newBadges) {
      showToast(`🏆 解鎖成就：${NAMES[b] || b}`, 'success', 4000);
    }
  }
}

// ================================================================
// 10. DASHBOARD
// ================================================================
function renderDashboard() {
  const pg = el('pg-dashboard');
  const total = 192;
  const done  = countCompleted();
  const pct   = total ? Math.round(done / total * 100) : 0;
  const circ  = 2 * Math.PI * 54;

  // U15: update page title
  document.title = `[${pct}%] FoundationLearn`;

  // U14: pace prediction
  const pacePredHTML = _buildPacePrediction(done, total);

  // U16: weekly goal
  const weekGoal = userState.settings?.weeklyGoal || 12;

  // Stage progress
  const stages = appState.manifest?.stages || [];
  const stageBars = stages.map((st,i) => {
    const ids = st.weeks.flatMap(w=>w.sessionIds);
    const c = ids.filter(id => userState.sessions[id]?.completed).length;
    const accentClass = `s${i+1}`;
    const color = i===0 ? 'var(--stage-1-accent)' : i===1 ? 'var(--stage-2-accent)' : 'var(--stage-3-accent)';
    return `<div class="stage-bar-row">
      <div class="stage-bar-label">
        <span>${esc(st.title)}</span>
        <span>${c}/${ids.length}</span>
      </div>
      <div class="stage-bar-track">
        <div class="stage-bar-fill ${accentClass}" style="width:${Math.round(c/ids.length*100)}%"></div>
      </div>
    </div>`;
  }).join('');

  // Core weeks + U19 school countdown
  const schoolDate = userState.settings?.schoolDate ? new Date(userState.settings.schoolDate) : null;
  const daysLeft = schoolDate ? Math.ceil((schoolDate - new Date()) / 86400000) : null;

  const coreWeekData = [
    { wk: 1, label: 'Week 1 微積分 I',    ids: stages[0]?.weeks[0]?.sessionIds || [] },
    { wk: 2, label: 'Week 2 微積分 II',   ids: stages[0]?.weeks[1]?.sessionIds || [] },
    { wk: 6, label: 'Week 6 擴散 ★',     ids: stages[1]?.weeks[1]?.sessionIds || [] },
    { wk: 7, label: 'Week 7 相圖 ★',     ids: stages[1]?.weeks[2]?.sessionIds || [] },
    { wk: 9, label: 'Week 9 熱力學 ★',   ids: stages[2]?.weeks[0]?.sessionIds || [] },
  ];
  const coreItems = coreWeekData.map(({ label, ids }) => {
    const c = ids.filter(id => userState.sessions[id]?.completed).length;
    const behind = ids.length > 0 && c / ids.length < 0.5;
    const urgent = behind && daysLeft !== null && daysLeft < 21;
    return `<div class="core-week-item${behind ? ' behind' : ''}${urgent ? ' urgent' : ''}">
      <div class="cw-label">${esc(label)}</div>
      <div class="cw-prog">${c}/${ids.length} 節${urgent ? ` <span style="color:var(--accent-red);font-size:10px;">⚠ 剩${daysLeft}天</span>` : ''}</div>
    </div>`;
  }).join('');

  // U16: this-week goal progress
  const thisWeekIds = _getCurrentWeekIds();
  const thisWeekDone = thisWeekIds.filter(id => userState.sessions[id]?.completed).length;
  const weekGoalPct = Math.min(100, Math.round(thisWeekDone / weekGoal * 100));
  const weekGoalHTML = `<div style="margin-top:10px;">
    <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:4px;">
      <span>本週目標</span><span>${thisWeekDone}/${weekGoal}</span>
    </div>
    <div class="stage-bar-track"><div class="stage-bar-fill s1" style="width:${weekGoalPct}%"></div></div>
  </div>`;

  // Continue button
  const lastId = getLastTouchedSession();
  const continueMeta = lastId ? appState.manifest?.sessionMeta?.[lastId] : null;
  const continueHTML = lastId
    ? `<button class="continue-btn" onclick="navigate('pg-lesson',{id:'${lastId}'})">
        <div>
          <div class="continue-id">${esc(lastId)}</div>
          <div>${esc(continueMeta?.title || lastId)}</div>
        </div>
        <span style="margin-left:auto">→</span>
      </button>`
    : `<button class="continue-btn" onclick="navigate('pg-map')">
        <div>${appState.settings.lang==='zh' ? '開始學習' : 'Start Learning'}</div>
        <span style="margin-left:auto">→</span>
      </button>`;

  // Todo
  const todoItems = (userState.todo || []).map((item, i) =>
    `<li class="todo-item">
      <span>• ${esc(item)}</span>
      <button class="todo-del" onclick="todoDelete(${i})" title="刪除">✕</button>
    </li>`
  ).join('');

  // Streak emoji
  const streakCur = userState.streak?.current || 0;
  const streakIcon = streakCur >= 7 ? '🔥' : streakCur >= 3 ? '⚡' : '📅';

  pg.innerHTML = `
  <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
    <h1 style="font-size:20px;font-weight:800;">FoundationLearn</h1>
    <span style="font-size:13px;color:var(--text-muted)">三個月入學前補底計劃</span>
  </div>
  <div class="dashboard-grid">
    <!-- Progress Ring -->
    <div class="card ring-card">
      <p class="card-title">${t('completed')}</p>
      <div class="ring-wrap">
        <svg class="ring-svg" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#4a9eff"/>
              <stop offset="100%" stop-color="#2dd4bf"/>
            </linearGradient>
          </defs>
          <circle class="ring-bg" cx="60" cy="60" r="54"/>
          <circle class="ring-progress" id="ring-progress" cx="60" cy="60" r="54"
            stroke-dasharray="${circ.toFixed(1)}"
            stroke-dashoffset="${circ.toFixed(1)}"/>
        </svg>
        <div class="ring-text">
          <div class="ring-pct" id="ring-pct">0%</div>
          <div class="ring-frac" id="ring-frac">0/192</div>
        </div>
      </div>
    </div>

    <!-- Streak -->
    <div class="card streak-card">
      <p class="card-title">${t('streak')}</p>
      <div class="streak-icon" id="streak-icon">${streakIcon}</div>
      <div class="streak-nums">
        <div class="streak-main" id="streak-main">${streakCur}</div>
        <div class="streak-sub">${t('streakDays')} &nbsp;｜ ${t('longestStreak')} ${userState.streak?.longest || 0}${t('streakDays')}</div>
      </div>
    </div>

    <!-- Pace prediction U14 -->
    ${pacePredHTML ? `<div class="card" style="grid-column:1/-1;">${pacePredHTML}</div>` : ''}

    <!-- Continue -->
    <div class="card">
      <p class="card-title">${t('continueBtn')}</p>
      ${continueHTML}
    </div>

    <!-- Stage Progress + U16 weekly goal -->
    <div class="card">
      <p class="card-title">${t('stageProgress')}</p>
      <div class="stage-bars">${stageBars}</div>
      ${weekGoalHTML}
    </div>

    <!-- Core Weeks -->
    <div class="card">
      <p class="card-title">${t('coreWeeks')}</p>
      <div class="core-weeks-grid">${coreItems}</div>
    </div>

    <!-- Todo -->
    <div class="card">
      <p class="card-title">${t('todoTitle')}</p>
      <ul class="todo-list">${todoItems || `<li style="font-size:12px;color:var(--text-muted)">— 空 —</li>`}</ul>
      <div class="todo-add-row">
        <input class="todo-input" id="todo-input" placeholder="${t('todoPlaceholder')}" onkeydown="if(event.key==='Enter')todoAdd()">
        <button class="btn-sm" onclick="todoAdd()">${t('todoAdd')}</button>
      </div>
    </div>
  </div>`;

  // Animate ring after DOM insert
  requestAnimationFrame(() => {
    animateRing(done, total, circ);
  });
}

function animateRing(done, total, circ) {
  const ring = el('ring-progress');
  const pctEl = el('ring-pct');
  const fracEl = el('ring-frac');
  if (!ring) return;
  const target = total > 0 ? done / total : 0;
  const prevPct = Math.round((appState._lastRingPct || 0) * 100);
  let cur = appState._lastRingPct || 0;

  const MILESTONES = [25, 50, 75, 100];
  const celebrated = new Set(userState._celebratedMilestones || []);

  const step = () => {
    cur = Math.min(cur + 0.015, target);
    const offset = circ * (1 - cur);
    ring.style.strokeDashoffset = offset;
    pctEl.textContent = Math.round(cur * 100) + '%';
    fracEl.textContent = `${Math.round(cur * total)}/192`;

    const curPct = Math.round(cur * 100);
    for (const m of MILESTONES) {
      if (curPct >= m && !celebrated.has(m) && prevPct < m) {
        celebrated.add(m);
        userState._celebratedMilestones = [...celebrated];
        save();
        setTimeout(() => {
          showToast(`🎉 已完成 ${m}%！繼續保持！`, 'success', 4000);
          _ringFlash();
        }, 300);
      }
    }
    if (cur < target) requestAnimationFrame(step);
    else appState._lastRingPct = target;
  };
  requestAnimationFrame(step);
}

function _ringFlash() {
  const wrap = qs('.ring-wrap');
  if (!wrap) return;
  wrap.style.transition = 'transform 0.15s';
  wrap.style.transform = 'scale(1.08)';
  setTimeout(() => { wrap.style.transform = 'scale(1)'; }, 300);
}

function todoAdd() {
  const input = el('todo-input');
  const txt = input?.value.trim();
  if (!txt) return;
  userState.todo = userState.todo || [];
  userState.todo.push(txt);
  save();
  input.value = '';
  renderDashboard();
}

function todoDelete(i) {
  userState.todo.splice(i, 1);
  save();
  renderDashboard();
}

// U14: pace prediction helper
function _buildPacePrediction(done, total) {
  if (done < 3) return '';
  const completed = Object.values(userState.sessions).filter(s => s.completed && s.completedAt);
  if (completed.length < 3) return '';
  const recent = completed.sort((a,b) => b.completedAt > a.completedAt ? 1 : -1).slice(0, 14);
  const dates = [...new Set(recent.map(s => fmtDate(s.completedAt)))];
  if (dates.length < 2) return '';
  const daysSpanned = Math.max(1, dates.length);
  const rate = recent.length / daysSpanned; // 近期每「有讀書的日子」完成幾節（分子分母同窗口）
  const remaining = total - done;
  const daysNeeded = rate > 0 ? Math.ceil(remaining / rate) : null;
  if (!daysNeeded) return '';
  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + daysNeeded);
  const schoolDate = userState.settings?.schoolDate ? new Date(userState.settings.schoolDate) : null;
  const bufDays = schoolDate ? Math.floor((schoolDate - finishDate) / 86400000) : null;
  const bufMsg = bufDays !== null
    ? (bufDays >= 0
        ? `<span style="color:var(--accent-green);">距開學還有 ${bufDays} 天緩衝 ✓</span>`
        : `<span style="color:var(--accent-red);">⚠ 預計超時 ${-bufDays} 天</span>`)
    : '';
  return `<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
    <span style="font-size:12px;color:var(--text-muted);">📈 學習速度：每日 ${rate.toFixed(1)} 節</span>
    <span style="font-size:12px;color:var(--text-secondary);">預計完成：${fmtDate(finishDate.toISOString())}（還需 ${daysNeeded} 天）</span>
    ${bufMsg}
  </div>`;
}

// U16: current week session ids
function _getCurrentWeekIds() {
  if (!appState.manifest) return [];
  const allIds = getAllSessionIds();
  // 「本週」= 你最近一次活動所在的 16 節課程週（隨進度前進，而非卡在第一次完成的那一週）
  const lastId = getLastTouchedSession();
  const idx = lastId ? allIds.indexOf(lastId) : 0;
  const weekStart = Math.floor(Math.max(0, idx) / 16) * 16;
  return allIds.slice(weekStart, weekStart + 16);
}

// ================================================================
// 11. COURSE MAP
// ================================================================
function renderCourseMap() {
  const pg = el('pg-map');
  if (!appState.manifest) { pg.innerHTML = '<p>載入中…</p>'; return; }

  // U09: jump-to-week options
  const weekOpts = appState.manifest.stages.flatMap(st =>
    st.weeks.map(wk => `<option value="map-week-${wk.id}">Week ${wk.id} — ${wk.title.slice(0,18)}</option>`)
  ).join('');

  // #13 下一個該讀的節次（依順序第一個未完成）
  const nextId = getAllSessionIds().find(id => !userState.sessions[id]?.completed);
  const nextMeta = nextId ? appState.manifest?.sessionMeta?.[nextId] : null;

  let html = `
  ${nextId ? `<button class="map-next-banner" onclick="navigate('pg-lesson',{id:'${nextId}'})">
      👉 下一個該讀：<b>${esc(nextId)}</b> ${esc(nextMeta?.title || '')} <span style="margin-left:auto;">開始 →</span>
    </button>` : ''}
  <div style="display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
    <div>
      <h2 style="font-size:18px;font-weight:800;margin:0;">課程地圖</h2>
      <p style="font-size:12px;color:var(--text-muted);margin:2px 0 0;">192 節 × 45 分鐘 = 144 小時</p>
    </div>
    <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;">
      <!-- U10: map search -->
      <input id="map-search" class="todo-input" style="width:180px;" placeholder="🔍 搜尋節次…"
        oninput="filterMapNodes(this.value)">
      <!-- U09: jump to week -->
      <select id="map-jump" onchange="jumpToWeek(this.value)"
        style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);
               padding:7px 10px;color:var(--text-secondary);font-size:13px;cursor:pointer;">
        <option value="">跳到 Week…</option>
        ${weekOpts}
      </select>
    </div>
  </div>
  <div class="map-container" id="map-container">`;

  for (const stage of appState.manifest.stages) {
    html += `<div class="map-stage-band stage-${stage.id}">
      <div class="map-stage-title">
        <span class="stage-dot"></span>
        第 ${stage.id} 階段 — ${esc(stage.title)}
      </div>`;

    for (const week of stage.weeks) {
      const weekDone = countCompletedInWeek(week.sessionIds);
      html += `<div class="map-week-block" data-wid="${week.id}">
        <div class="week-header">
          <span>Week ${week.id} — ${esc(week.title)}</span>
          ${week.isCore ? `<span class="week-core-badge">★ 必保</span>` : ''}
          <span class="week-prog">${weekDone}/16</span>
        </div>`;

      // Split 16 sessions into 2 rows of 8
      const ids = week.sessionIds;
      for (let r = 0; r < 2; r++) {
        const rowIds = ids.slice(r * 8, r * 8 + 8);
        const isReverse = r % 2 === 1;

        if (r > 0) {
          html += `<div class="node-connector ${isReverse ? 'left' : 'right'}" style="width:100%"></div>`;
        }

        html += `<div class="node-row${isReverse ? ' reverse' : ''}">`;
        for (const sid of rowIds) {
          html += renderNodeHTML(sid);
        }
        html += `</div>`;
      }

      // Connector between weeks (unless last week of stage)
      const weekIdx = stage.weeks.indexOf(week);
      if (weekIdx < stage.weeks.length - 1) {
        html += `<div class="node-connector left" style="width:100%;height:16px;margin-top:4px;"></div>`;
      }

      // id anchor for jump-to-week
      html += `</div>`; // .map-week-block
    }

    html += `</div>`; // .map-stage-band
  }

  html += `</div>`; // .map-container

  pg.innerHTML = html;

  // Add week id anchors
  for (const st of appState.manifest.stages)
    for (const wk of st.weeks) {
      const block = pg.querySelector(`.map-week-block[data-wid="${wk.id}"]`);
      if (block) block.id = `map-week-${wk.id}`;
    }

  // #13 標記「下一個該讀」節點
  if (nextId) {
    const nd = pg.querySelector(`.node[data-id="${nextId}"]`);
    if (nd) nd.classList.add('node-next');
  }

  // Restore scroll position
  if (appState.mapScrollY > 0) {
    requestAnimationFrame(() => { window.scrollTo(0, appState.mapScrollY); });
  }
}

// U09: jump to week
function jumpToWeek(anchorId) {
  if (!anchorId) return;
  const el_ = document.getElementById(anchorId);
  if (el_) { el_.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  el('map-jump').value = '';
}

// U10: filter map nodes
function filterMapNodes(query) {
  const q = query.trim().toLowerCase();
  qsa('.node-wrapper').forEach(wrap => {
    const btn = wrap.querySelector('.node');
    const id = btn?.dataset?.id || '';
    const tip = btn?.dataset?.tooltip || '';
    const match = !q || id.toLowerCase().includes(q) || tip.toLowerCase().includes(q);
    wrap.style.opacity = match ? '1' : '0.2';
    wrap.style.pointerEvents = match ? '' : 'none';
  });
}

function renderNodeHTML(id) {
  const meta = appState.manifest?.sessionMeta?.[id] || {};
  const s = userState.sessions[id] || {};
  const lastId = getLastTouchedSession();

  let cls = 'node';
  if (s.completed)        cls += ' done';
  else if (id === lastId) cls += ' current';
  if (meta.isCore)        cls += ' core';

  const num = parseInt(id.replace('S',''), 10);
  const shortTitle = (meta.title || id).slice(0, 10);

  // U05: partial completion arc — count checked checkpoints
  const ckState = s.checkpoints || {};
  const checkedCount = Object.values(ckState).filter(Boolean).length;
  const totalCk = 6; // 每節通常 6 個檢核點；實際數量僅在載入該節後才知道
  const partialArc = (!s.completed && checkedCount > 0)
    ? _makeArc(checkedCount, totalCk) : '';

  // U04: tooltip (rendered as a title attribute + CSS tooltip)
  const platName = appState.manifest?.platforms?.[meta.platform]?.name || meta.platform || '';
  const doneLabel = s.completed ? ` · ✓ ${fmtDate(s.completedAt).slice(5)}` : '';
  const tooltipText = `S${num} ${meta.title || ''}${doneLabel}${platName ? ' · ' + platName : ''}`;

  return `<div class="node-wrapper">
    <button class="${cls}" onclick="navigate('pg-lesson',{id:'${id}'})"
      data-tooltip="${esc(tooltipText)}" data-id="${id}">
      <span class="node-id">S${num}</span>
      <span class="node-name">${esc(shortTitle)}</span>
      ${partialArc}
    </button>
    <div class="node-tip">${esc(tooltipText)}</div>
  </div>`;
}

function _makeArc(done, total) {
  if (!done || !total) return '';
  const r = 24, cx = 26, cy = 26;
  const ratio = Math.min(0.999, done / total);  // 夾住，弧度永不超過整圈（避免溢出或退化成空弧）
  const angle = ratio * 2 * Math.PI;
  const x = cx + r * Math.sin(angle);
  const y = cy - r * Math.cos(angle);
  const large = angle > Math.PI ? 1 : 0;
  return `<svg class="node-arc" viewBox="0 0 52 52" width="52" height="52">
    <path d="M ${cx} ${cy-r} A ${r} ${r} 0 ${large} 1 ${x.toFixed(1)} ${y.toFixed(1)}"
      fill="none" stroke="var(--accent-teal)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

// ================================================================
// 12. LESSON VIEW
// ================================================================
async function renderLesson(id) {
  if (!id) { navigate('pg-map'); return; }
  appState.currentSessionId = id;
  appState.enterTime = Date.now();

  const pg = el('pg-lesson');
  pg.innerHTML = `<div style="text-align:center;padding:60px 0;"><div class="loader-ring" style="margin:0 auto;"></div></div>`;

  const session = await loadSession(id);

  // Touch record
  if (!userState.sessions[id]) userState.sessions[id] = {};
  userState.sessions[id].lastTouched = new Date().toISOString();
  save();

  const meta = appState.manifest?.sessionMeta?.[id] || {};
  const platform = appState.manifest?.platforms?.[session.platform] || {};
  const allIds = getAllSessionIds();
  const idx = allIds.indexOf(id);
  const prevId = idx > 0 ? allIds[idx - 1] : null;
  const nextId = idx < allIds.length - 1 ? allIds[idx + 1] : null;
  const isDone = !!userState.sessions[id]?.completed;
  const ckState = userState.sessions[id]?.checkpoints || {};

  // Build checkpoints HTML
  const cpHTML = (session.checkpoints || []).map(cp => {
    const checked = !!ckState[cp.id];
    return `<li class="checkpoint-item${checked ? ' checked' : ''}">
      <input type="checkbox" id="cp_${cp.id}" data-cpid="${cp.id}" ${checked ? 'checked' : ''}
             onchange="toggleCheckpoint('${id}','${cp.id}',this.checked)">
      <label for="cp_${cp.id}">${esc(cp.text)}</label>
    </li>`;
  }).join('');

  // Build resources HTML
  const resHTML = (session.resources || []).length
    ? `<ul class="resources-list">${(session.resources).map(r => {
        const icon = r.type==='video' ? '📹' : r.type==='paper' ? '📄' : '🔗';
        return `<li class="resource-item">${icon} <a href="${esc(r.url)}" target="_blank">${esc(r.label)}</a></li>`;
      }).join('')}</ul>` : '';

  pg.innerHTML = `
  <div class="lesson-page">
    <!-- Back + Nav -->
    <div class="lesson-nav-bar">
      <button class="lesson-back-btn" onclick="navigate('pg-map')">${t('backToMap')}</button>
      <span style="flex:1"></span>
      <button class="lesson-nav-btn" ${!prevId?'disabled':''} onclick="navigate('pg-lesson',{id:'${prevId}'})">
        ${t('prevLesson')}
      </button>
      <button class="lesson-nav-btn" ${!nextId?'disabled':''} onclick="navigate('pg-lesson',{id:'${nextId}'})">
        ${t('nextLesson')}
      </button>
    </div>

    <!-- Header -->
    <div class="lesson-header">
      <div class="lesson-meta-row">
        <span class="lesson-id-badge">${esc(id)}</span>
        ${session.isCore ? `<span style="background:rgba(245,200,66,0.15);color:var(--accent-gold);border:1px solid rgba(245,200,66,0.3);border-radius:3px;padding:2px 7px;font-size:11px;font-weight:700;">★ 核心節</span>` : ''}
        ${session.status==='draft' ? `<span style="background:var(--bg-input);border:1px solid var(--border);border-radius:3px;padding:2px 7px;font-size:10px;color:var(--text-muted);">${t('draftSuffix')}</span>` : ''}
      </div>
      <h1 class="lesson-title-zh">${esc(session.title || id)}</h1>
      <p class="lesson-title-en">${esc(session.titleEn || '')}</p>
      ${session.objective ? `<div class="lesson-objective"><span style="font-size:11px;color:var(--accent-blue);font-weight:700;margin-right:6px;">${t('objective')}</span>${esc(session.objective)}</div>` : ''}
      ${(session.prereq && session.prereq.length) ? `<div class="prereq-row">
        <span class="prereq-label">先備：</span>
        ${session.prereq.map(pid => {
          const pdone = userState.sessions[pid]?.completed;
          return `<button class="prereq-chip${pdone ? ' done' : ''}" onclick="navigate('pg-lesson',{id:'${pid}'})" title="${esc(appState.manifest?.sessionMeta?.[pid]?.title || pid)}">${pdone ? '✓ ' : ''}${esc(pid)}</button>`;
        }).join('')}
        <span class="prereq-hint">沒把握的話先點回去複習</span>
      </div>` : ''}
      ${platform.url ? `<a class="lesson-platform-btn" href="${esc(platform.url)}" target="_blank">
        ${esc(platform.name || session.platform)} ${t('toPlatform')}
      </a>` : ''}
    </div>

    <!-- Content -->
    <div class="section-heading">${appState.settings.lang==='zh'?'教學內容':'Content'}</div>
    <div id="lesson-content-area"></div>

    <!-- Charts -->
    <div id="lesson-charts-area"></div>

    <!-- Field Link -->
    ${session.fieldLink ? `
      <div class="field-link">
        <div class="field-link-label">${t('fieldLink')}</div>
        <p>${esc(session.fieldLink)}</p>
      </div>` : ''}

    <!-- Resources -->
    ${resHTML ? `<div class="section-heading">${t('resources')}</div>${resHTML}` : ''}

    <!-- Checkpoints -->
    <div class="section-heading">${t('checkpoints')}</div>
    <ul class="checkpoints-list">${cpHTML}</ul>

    <!-- Quiz -->
    <div id="lesson-quiz-area"></div>

    <!-- #17 個人筆記 -->
    <details class="note-box"${userState.sessions[id]?.note ? ' open' : ''}>
      <summary>📝 我的筆記（畫重點、寫想法，只有你看得到）
        <span id="note-saved-label" style="font-size:10px;color:var(--accent-teal);margin-left:8px;"></span>
      </summary>
      <textarea class="note-textarea" id="note-textarea"
        placeholder="在這裡寫下你的理解、卡住的地方、想記住的重點…（自動儲存，跟 Drive 同步）"
        oninput="debouncedSaveNote('${id}',this.value)">${esc(userState.sessions[id]?.note || '')}</textarea>
    </details>

    <!-- Reflection: 點選評語標籤（取代手打三句總結） + 選填補充 -->
    <div class="section-heading" style="justify-content:flex-start;gap:8px;">
      ${t('summary')}
      <span id="summary-saved-label" style="font-size:10px;color:var(--accent-teal);margin-left:auto;"></span>
    </div>
    <div class="reflect-wrap">
      <div class="reflect-hint">${t('reflectHint')}</div>
      <div class="reflect-chips">
        ${REFLECT_CHIPS.map(c => {
          const sel = (userState.sessions[id]?.summaryTags || []).includes(c.key);
          return `<button type="button" class="reflect-chip${sel ? ' selected' : ''}"
            data-chipkey="${c.key}" style="--chip:${c.color};"
            onclick="toggleReflectChip('${id}','${c.key}',this)">${appState.settings.lang === 'en' ? c.en : c.zh}</button>`;
        }).join('')}
      </div>
      <details class="reflect-note"${userState.sessions[id]?.summary ? ' open' : ''}>
        <summary>${t('summaryOptional')}</summary>
        <textarea class="summary-textarea" id="summary-textarea"
          placeholder="${t('summaryPlaceholder')}"
          oninput="debouncedSaveSummary('${id}',this.value)"
        >${esc(userState.sessions[id]?.summary || '')}</textarea>
      </details>
    </div>

    <!-- Complete Button -->
    <button class="complete-btn${isDone ? ' already-done' : ''}" id="complete-btn"
            onclick="completeSession('${id}')">
      ${isDone ? t('alreadyDone') + ' · ' + fmtDate(userState.sessions[id].completedAt) : t('completeLesson')}
    </button>

    <!-- U08: related sessions -->
    <div id="lesson-related-area"></div>

    <div style="height:60px;"></div>
  </div>`;

  // U06: reading progress bar
  _attachReadingProgress();

  // Render content (also mounts inline [CHART:type] charts and returns the set of
  // chart specs consumed inline, so we don't render those again below)
  const consumedInline = renderLessonContent(id, session) || new Set();

  // Render any remaining charts (not placed inline) in the bottom section
  const bottomCharts = (session.charts || []).filter((_, i) => !consumedInline.has(i));
  if (bottomCharts.length > 0) {
    const chartsArea = el('lesson-charts-area');
    chartsArea.innerHTML = `<div class="section-heading">互動圖表</div>`;
    for (const chart of bottomCharts) {
      const wrap = document.createElement('div');
      chartsArea.appendChild(wrap);
      _mountChart(wrap, chart);
    }
  }

  // U24: quiz accuracy stats before rendering quiz
  if ((session.quiz || []).length > 0) {
    const quizArea = el('lesson-quiz-area');
    // 用 confidenceLog（逐題、每題一筆、含是非題）算正確率——與統計頁同源，
    // 永遠是合法的 0–100%（先前用 quizCorrect/quizAttempts 會分子分母單位不一致而爆表）
    const qlog = (userState.confidenceLog || []).filter(e => e.sessionId === id);
    const correct = qlog.filter(e => e.isCorrect).length;
    const statsHTML = qlog.length > 0
      ? `<span style="font-size:11px;color:var(--accent-teal);margin-left:auto;">歷史正確率 ${Math.round(correct/qlog.length*100)}%（${qlog.length} 題）</span>`
      : '';
    quizArea.innerHTML = `<div class="section-heading">${appState.settings.lang==='zh'?'練習題':'Quiz'}${statsHTML}</div>`;
    renderQuiz(quizArea, session.quiz, id);
  }

  // U08: related sessions (prev + next 2 within same week)
  _renderRelatedSessions(id);

  // U27: formula sidebar
  _renderFormulaSidebar(id, session);
}

// U06: reading progress bar
function _attachReadingProgress() {
  let bar = el('reading-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'reading-bar';
    bar.style.cssText = 'position:fixed;top:var(--nav-h);left:0;height:3px;background:linear-gradient(90deg,var(--accent-blue),var(--accent-teal));width:0%;z-index:900;transition:width 0.1s linear;pointer-events:none;';
    document.body.appendChild(bar);
  }
  bar.style.display = 'block';
  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const pct = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 100;
    bar.style.width = pct + '%';
  };
  window.removeEventListener('scroll', window._readScroll);
  window._readScroll = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
}

// U08: related sessions in same week
function _renderRelatedSessions(id) {
  const area = el('lesson-related-area');
  if (!area) return;
  const wkInfo = getWeekForSession(id);
  if (!wkInfo) return;
  const siblings = wkInfo.week.sessionIds;
  const idx = siblings.indexOf(id);
  const candidates = siblings.filter((_, i) => Math.abs(i - idx) <= 2 && siblings[i] !== id).slice(0, 4);
  if (!candidates.length) return;
  const cards = candidates.map(sid => {
    const m = appState.manifest?.sessionMeta?.[sid] || {};
    const done = userState.sessions[sid]?.completed;
    return `<button onclick="navigate('pg-lesson',{id:'${sid}'})"
      style="background:var(--bg-input);border:1px solid ${done?'var(--accent-green)':'var(--border)'};border-radius:var(--radius-sm);
             padding:8px 12px;font-size:12px;text-align:left;cursor:pointer;flex:1;min-width:120px;color:var(--text-secondary);">
      <div style="font-size:10px;color:${done?'var(--accent-green)':'var(--accent-blue)'};">${sid}${done?' ✓':''}</div>
      <div style="font-size:11px;margin-top:2px;">${esc((m.title||sid).slice(0,18))}</div>
    </button>`;
  }).join('');
  area.innerHTML = `<div class="section-heading">同週節次</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">${cards}</div>`;
}

// U27: formula sidebar — extract $$...$$ blocks
function _renderFormulaSidebar(id, session) {
  if (!session.content || session.status === 'draft') return;
  const matches = [...session.content.matchAll(/\$\$([\s\S]+?)\$\$/g)].map(m => m[1].trim());
  if (matches.length === 0) return;

  const existing = el('formula-sidebar');
  if (existing) existing.remove();

  const sidebar = document.createElement('div');
  sidebar.id = 'formula-sidebar';
  sidebar.style.cssText = `position:fixed;right:0;top:calc(var(--nav-h) + 20px);width:220px;
    background:var(--bg-card);border:1px solid var(--border);border-left:3px solid var(--accent-blue);
    border-radius:var(--radius-md) 0 0 var(--radius-md);
    padding:12px;z-index:500;max-height:60vh;overflow-y:auto;
    transform:translateX(200px);transition:transform 0.25s ease;`;
  sidebar.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span style="font-size:11px;font-weight:700;color:var(--accent-blue);">公式速查</span>
      <button onclick="this.closest('#formula-sidebar').style.transform='translateX(200px)'"
        style="font-size:16px;color:var(--text-muted);padding:0 4px;">×</button>
    </div>
    ${matches.slice(0, 8).map(f => `<div style="font-size:10px;border-bottom:1px solid var(--border);padding:4px 0;color:var(--text-secondary);word-break:break-all;">$$${f}$$</div>`).join('')}`;
  document.body.appendChild(sidebar);

  // Re-render KaTeX inside sidebar
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(sidebar, { delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}], throwOnError:false });
  }

  // Peek tab
  const tab = document.createElement('button');
  tab.style.cssText = `position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:501;
    background:var(--accent-blue);color:#fff;border-radius:var(--radius-sm) 0 0 var(--radius-sm);
    padding:8px 6px;font-size:11px;writing-mode:vertical-rl;`;
  tab.textContent = '公式';
  tab.onclick = () => {
    const open = sidebar.style.transform === 'translateX(0px)';
    sidebar.style.transform = open ? 'translateX(200px)' : 'translateX(0px)';
  };
  tab.id = 'formula-tab';
  document.body.appendChild(tab);
}

function renderLessonContent(id, session) {
  const area = el('lesson-content-area');
  if (!area) return;

  if (session.status === 'draft' || !session.content) {
    area.innerHTML = `<div class="draft-placeholder">
      <div class="draft-icon">📝</div>
      <p><strong>${t('contentInProgress')}</strong></p>
      <p style="font-size:12px;margin-top:6px;">${t('contentInProgressSub')}</p>
    </div>`;
    return new Set();
  }

  area.className = 'lesson-content';
  flog('CONTENT', `renderLessonContent: parsing Markdown for ${session.id}`, { chars: session.content.length });

  // Parse Markdown, then swap any inline [CHART:type] placeholders for real chart
  // containers so the chart appears exactly where the text references it
  // ("下方互動圖…") instead of showing the literal placeholder text. Charts matched
  // here are returned so renderLesson() won't render them again in the bottom section.
  const charts = session.charts || [];
  const consumedCharts = new Set();
  let html = marked.parse(session.content);
  html = html.replace(/(?:<p>\s*)?\[CHART:([A-Za-z0-9_]+)\]\s*(?:<\/p>)?/g, (_m, type) => {
    let idx = -1;
    for (let i = 0; i < charts.length; i++) {
      if (!consumedCharts.has(i) && charts[i].type === type) { idx = i; break; }
    }
    if (idx === -1) return '';            // no matching chart spec → drop placeholder
    consumedCharts.add(idx);
    return `<div class="chart-wrap inline-chart" data-chart-idx="${idx}"></div>`;
  });
  area.innerHTML = html;

  // Render KaTeX
  if (typeof renderMathInElement !== 'undefined') {
    flog('CONTENT', `renderLessonContent: running KaTeX auto-render`);
    renderMathInElement(area, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false
    });
  }

  // U25 + #14: 點塊狀公式 → 全螢幕放大；行內公式 → 複製 LaTeX
  qsa('.katex-display', area).forEach(k => {
    k.style.cursor = 'zoom-in';
    k.title = '點擊放大';
    k.addEventListener('click', () => {
      const src = k.closest('[data-orig]')?.dataset?.orig || k.textContent;
      _showFormulaOverlay(k.innerHTML, src);
    });
  });
  qsa('.katex', area).forEach(k => {
    if (k.closest('.katex-display')) return; // 塊狀已處理
    k.style.cursor = 'pointer';
    k.title = '點擊複製 LaTeX';
    k.addEventListener('click', () => {
      const src = k.closest('[data-orig]')?.dataset?.orig || k.textContent;
      navigator.clipboard?.writeText(src).then(() => showToast('LaTeX 已複製', 'info'));
    });
  });

  // U13: image lightbox
  qsa('img', area).forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => _showLightbox(img.src, img.alt));
  });

  // U26: term tooltips for key material science terms
  _applyTermTooltips(area);

  // U22: text selection → add to glossary
  area.addEventListener('mouseup', _onTextSelect);

  // Mount inline charts now that markup + KaTeX are in place
  qsa('.inline-chart', area).forEach(wrap => {
    const idx = parseInt(wrap.dataset.chartIdx, 10);
    const chart = charts[idx];
    if (chart) _mountChart(wrap, chart);
  });

  return consumedCharts;
}

// U13: lightbox implementation
function _showLightbox(src, alt) {
  let lb = el('fl-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'fl-lightbox';
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9000;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
    lb.innerHTML = `<img id="lb-img" style="max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,0.7);">
      <button onclick="el('fl-lightbox').style.display='none'" style="position:absolute;top:20px;right:24px;color:#fff;font-size:28px;background:none;border:none;cursor:pointer;">×</button>`;
    lb.addEventListener('click', e => { if (e.target === lb) lb.style.display = 'none'; });
    document.body.appendChild(lb);
  }
  el('lb-img').src = src;
  el('lb-img').alt = alt || '';
  lb.style.display = 'flex';
}

// #14 公式全螢幕：點放大顯示，附複製 LaTeX
function _showFormulaOverlay(html, latex) {
  let ov = el('fl-formula-ov');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'fl-formula-ov';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(10,12,18,0.96);z-index:9100;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:24px;cursor:zoom-out;';
    ov.addEventListener('click', e => { if (e.target === ov) ov.style.display = 'none'; });
    document.body.appendChild(ov);
  }
  ov.innerHTML = `
    <div style="font-size:1.9em;color:#e4e8f0;max-width:96vw;max-height:70vh;overflow:auto;text-align:center;">${html}</div>
    <div style="display:flex;gap:10px;">
      <button id="fl-fov-copy" style="background:var(--accent-blue);color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:13px;cursor:pointer;">複製 LaTeX</button>
      <button id="fl-fov-close" style="background:var(--bg-input);color:var(--text-secondary);border:1px solid var(--border);border-radius:8px;padding:9px 16px;font-size:13px;cursor:pointer;">關閉</button>
    </div>`;
  el('fl-fov-copy').onclick = () => { navigator.clipboard?.writeText(latex); showToast('LaTeX 已複製', 'info'); };
  el('fl-fov-close').onclick = () => { ov.style.display = 'none'; };
  ov.style.display = 'flex';
}

// #14 圖表全螢幕
function toggleChartFullscreen(wrap) {
  if (document.fullscreenElement) { document.exitFullscreen?.(); return; }
  const done = () => _resizeChartIn(wrap);
  if (wrap.requestFullscreen) {
    // 桌面：原生全螢幕；失敗則退回覆蓋層
    wrap.requestFullscreen().then(done).catch(() => { wrap.classList.toggle('chart-pseudo-fs'); done(); });
  } else {
    // iOS Safari 不支援任意元素原生全螢幕 → 直接用覆蓋層放大
    wrap.classList.toggle('chart-pseudo-fs');
    done();
  }
}

// 切換全螢幕後版面改變，主動讓該圖的 Chart.js 重算尺寸（等兩個 frame 讓 flex 佈局先穩定）
function _resizeChartIn(wrap) {
  const cv = wrap.querySelector('canvas');
  const ch = cv && appState._charts[cv.id];
  if (ch) requestAnimationFrame(() => requestAnimationFrame(() => ch.resize()));
}

// #17 個人筆記（與三句話總結分開的自由筆記）
let _noteTimer = null;
function debouncedSaveNote(id, val) {
  clearTimeout(_noteTimer);
  _noteTimer = setTimeout(() => {
    if (!userState.sessions[id]) userState.sessions[id] = {};
    userState.sessions[id].note = val;
    userState.sessions[id].lastTouched = new Date().toISOString();
    save();
    const lbl = el('note-saved-label');
    if (lbl) lbl.textContent = '已儲存 ' + new Date().toTimeString().slice(0, 5);
  }, 600);
}

// #9 番茄鐘（持久浮動專注計時器）
const FL_POMO = {
  _sec: 25 * 60, _running: false, _timer: null, _mode: 'focus', _panel: null,
  init() {
    if (el('fl-pomo-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'fl-pomo-btn'; btn.title = '專注計時器'; btn.textContent = '⏱';
    btn.addEventListener('click', () => this._panel.classList.toggle('open'));
    document.body.appendChild(btn);

    const p = document.createElement('div');
    p.id = 'fl-pomo-panel';
    p.innerHTML = `
      <div class="pomo-head">🍅 專注計時器
        <button id="pomo-x" title="收起">×</button>
      </div>
      <div class="pomo-mode">
        <button id="pomo-focus" class="active">專注 25</button>
        <button id="pomo-break">休息 5</button>
      </div>
      <div id="fl-pomo-time" class="pomo-time">25:00</div>
      <div class="pomo-ctrl">
        <button id="pomo-start" class="pomo-primary">開始</button>
        <button id="pomo-reset">重設</button>
      </div>
      <div class="pomo-tip">完成一輪自動 +25 分鐘到學習時數</div>`;
    document.body.appendChild(p);
    this._panel = p;
    el('pomo-x').addEventListener('click', () => p.classList.remove('open'));
    el('pomo-focus').addEventListener('click', () => this.setMode('focus'));
    el('pomo-break').addEventListener('click', () => this.setMode('break'));
    el('pomo-start').addEventListener('click', () => this.start());
    el('pomo-reset').addEventListener('click', () => this.reset());
    this._render();
  },
  _render() {
    const m = Math.floor(this._sec / 60), s = this._sec % 60;
    const t = el('fl-pomo-time'); if (t) t.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const b = el('pomo-start'); if (b) b.textContent = this._running ? '暫停' : '開始';
    el('pomo-focus')?.classList.toggle('active', this._mode === 'focus');
    el('pomo-break')?.classList.toggle('active', this._mode === 'break');
  },
  start() {
    if (this._running) { this.pause(); return; }
    this._running = true; this._render();
    this._timer = setInterval(() => {
      this._sec--;
      if (this._sec <= 0) this._done();
      this._render();
    }, 1000);
  },
  pause() { this._running = false; clearInterval(this._timer); this._render(); },
  reset() { this.pause(); this._sec = (this._mode === 'focus' ? 25 : 5) * 60; this._render(); },
  setMode(m) { this._mode = m; this.reset(); },
  _done() {
    this.pause();
    if (this._mode === 'focus') {
      userState.totalMinutes = (userState.totalMinutes || 0) + 25;
      save();
      flog('RECORD', 'pomodoro: focus block done (+25 min)');
      showToast('🍅 完成一個專注番茄鐘（+25 分鐘）！休息一下吧', 'success', 4500);
      this.setMode('break');
    } else {
      showToast('☕ 休息結束，繼續加油！', 'info');
      this.setMode('focus');
    }
  }
};

// #18 每日提醒（本機，App 開著時於設定時間提醒今天還沒讀書）
function setReminder(enabled, time) {
  userState.settings = userState.settings || {};
  userState.settings.reminder = { enabled, time: time || userState.settings.reminder?.time || '20:00' };
  if (enabled && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
  save();
  applyDailyReminder();
  flog('UI', `setReminder: ${enabled} @ ${userState.settings.reminder.time}`);
  if (appState.currentPage === 'pg-settings') renderSettings();
}
function applyDailyReminder() {
  clearTimeout(appState._reminderTimer);
  const r = userState.settings?.reminder;
  if (!r || !r.enabled) return;
  const [hh, mm] = (r.time || '20:00').split(':').map(Number);
  const now = new Date(), target = new Date();
  target.setHours(hh || 20, mm || 0, 0, 0);
  let delay = target - now;
  if (delay < 0) delay += 24 * 3600 * 1000;
  appState._reminderTimer = setTimeout(() => {
    if (userState.streak?.lastStudyDate !== today()) _fireReminder();
    applyDailyReminder();
  }, Math.min(delay, 24 * 3600 * 1000));
}
function _fireReminder() {
  const msg = '📚 今天還沒讀書喔！花 25 分鐘做一節吧。';
  if ('Notification' in window && Notification.permission === 'granted') {
    try { new Notification('FoundationLearn 提醒', { body: msg, icon: 'icon.svg' }); } catch (e) {}
  }
  showToast(msg, 'warn', 6000);
}

// U22: text selection → glossary
function _onTextSelect() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.toString().trim().length < 2) {
    el('glossary-bubble')?.remove(); return;
  }
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  let bub = el('glossary-bubble');
  if (!bub) {
    bub = document.createElement('div');
    bub.id = 'glossary-bubble';
    bub.style.cssText = 'position:fixed;z-index:7000;background:var(--bg-card);border:1px solid var(--accent-gold);border-radius:var(--radius-sm);padding:5px 10px;font-size:12px;color:var(--accent-gold);cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.4);';
    bub.textContent = '+ 加入詞彙表';
    document.body.appendChild(bub);
  }
  bub.style.display = 'block';
  bub.style.top = `${rect.top + window.scrollY - 36}px`;
  bub.style.left = `${rect.left + window.scrollX}px`;
  bub.onclick = () => {
    const term = sel.toString().trim();
    userState.glossary = userState.glossary || [];
    if (!userState.glossary.find(g => g.term === term)) {
      userState.glossary.push({ term, note: '', addedAt: new Date().toISOString() });
      save();
      showToast(`📖 「${term.slice(0,20)}」已加入詞彙表`, 'success');
    }
    bub.remove();
    sel.removeAllRanges();
  };
}
document.addEventListener('click', e => { if (e.target?.id !== 'glossary-bubble') el('glossary-bubble')?.remove(); });

// U26: term tooltip map
const TERM_MAP = {
  'IMC': '介金屬化合物 Intermetallic Compound',
  'TEC': '熱膨脹係數 Thermal Expansion Coefficient',
  'CTE': '熱膨脹係數 Coefficient of Thermal Expansion',
  'APF': '原子堆積率 Atomic Packing Factor',
  'TCB': '熱壓接合 Thermocompression Bonding',
  'FCC': '面心立方 Face-Centered Cubic',
  'BCC': '體心立方 Body-Centered Cubic',
  'HCP': '六方最密堆積 Hexagonal Close-Packed',
  'SAC': '錫銀銅焊料 Sn-Ag-Cu solder',
  'XRD': 'X 光繞射 X-Ray Diffraction',
  'SEM': '掃描式電子顯微鏡 Scanning Electron Microscope',
  'EDS': '能量色散光譜 Energy Dispersive Spectroscopy',
  'XPS': 'X 射線光電子能譜 X-ray Photoelectron Spectroscopy',
};
function _applyTermTooltips(area) {
  const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT);
  const replacements = [];
  let node;
  while ((node = walker.nextNode())) {
    for (const [term, def] of Object.entries(TERM_MAP)) {
      if (node.textContent.includes(term)) {
        replacements.push({ node, term, def });
        break;
      }
    }
  }
  for (const { node, term, def } of replacements) {
    const span = document.createElement('span');
    span.innerHTML = node.textContent.replace(
      new RegExp(`\\b${term}\\b`, 'g'),
      `<abbr title="${def}" style="text-decoration:underline dotted;cursor:help;color:inherit;">${term}</abbr>`
    );
    node.parentNode?.replaceChild(span, node);
  }
}

// U07: Debounced summary save + saved timestamp label
let _summaryTimer = null;
function debouncedSaveSummary(id, val) {
  clearTimeout(_summaryTimer);
  const label = el('summary-saved-label');
  if (label) label.textContent = '正在儲存…';
  _summaryTimer = setTimeout(() => {
    if (!userState.sessions[id]) userState.sessions[id] = {};
    userState.sessions[id].summary = val;
    userState.sessions[id].lastTouched = new Date().toISOString();
    save();
    const lbl = el('summary-saved-label');
    if (lbl) lbl.textContent = `已儲存 ${new Date().toTimeString().slice(0,5)}`;
  }, 600);
}

// 點選式評語標籤：toggle 一個 key 入／出 summaryTags，即時儲存（無需打字）
function toggleReflectChip(id, key, btn) {
  if (!userState.sessions[id]) userState.sessions[id] = {};
  const s = userState.sessions[id];
  if (!Array.isArray(s.summaryTags)) s.summaryTags = [];
  const i = s.summaryTags.indexOf(key);
  if (i >= 0) s.summaryTags.splice(i, 1);
  else s.summaryTags.push(key);
  s.lastTouched = new Date().toISOString();
  if (btn) btn.classList.toggle('selected', s.summaryTags.includes(key));
  save();
  const lbl = el('summary-saved-label');
  if (lbl) lbl.textContent = `已儲存 ${new Date().toTimeString().slice(0,5)}`;
}

function toggleCheckpoint(sessionId, cpId, checked) {
  if (!userState.sessions[sessionId]) userState.sessions[sessionId] = {};
  if (!userState.sessions[sessionId].checkpoints) userState.sessions[sessionId].checkpoints = {};
  userState.sessions[sessionId].checkpoints[cpId] = checked;
  save();

  // Update UI style
  const item = qs(`input[data-cpid="${cpId}"]`)?.closest('.checkpoint-item');
  if (item) item.classList.toggle('checked', checked);
}

async function completeSession(id) {
  if (!userState.sessions[id]) userState.sessions[id] = {};
  const s = userState.sessions[id];

  const ta = el('summary-textarea');
  if (ta) s.summary = ta.value;

  s.completed = true;
  s.completedAt = new Date().toISOString();
  srsSeed(id);  // #6 排入間隔複習（明天首次到期）

  flog('RECORD', `complete: ${id}`, {
    streak: userState.streak?.current,
    totalDone: countCompleted() + 1,
    hasSummary: hasReflect(s),
    checkpointsDone: Object.values(s.checkpoints || {}).filter(Boolean).length
  });

  updateStreak();
  checkAchievements();
  save();

  // Update button
  const btn = el('complete-btn');
  if (btn) {
    btn.className = 'complete-btn already-done';
    btn.textContent = t('alreadyDone') + ' · ' + fmtDate(s.completedAt);
  }

  showToast(`${t('completedMsg')} ${id}`, 'success');

  // U11: suggest next session
  const allIds = getAllSessionIds();
  const nextId = allIds[allIds.indexOf(id) + 1];
  if (nextId) {
    const nextMeta = appState.manifest?.sessionMeta?.[nextId];
    setTimeout(() => {
      showToast(`繼續 → ${nextId} ${(nextMeta?.title||'').slice(0,14)}`, 'info', 5000);
      const toastEl = el('toast');
      if (toastEl) {
        toastEl.style.cursor = 'pointer';
        toastEl.onclick = () => { toastEl.onclick = null; navigate('pg-lesson', {id: nextId}); };
      }
    }, 3200);
  }

  // Flash the node on the map (if map is cached in DOM)
  const nodeEl = qs(`.node[data-id="${id}"]`);
  if (nodeEl) {
    nodeEl.classList.add('done', 'flash');
    nodeEl.classList.remove('current', 'available');
  }
}

// ================================================================
// 13. CHARTS (M4 — Arrhenius + Phase Diagram + Stress-Strain)
// ================================================================
// Mount one chart spec into `wrap`: chart body + optional title (prepended as a
// sibling) + fullscreen button. Shared by inline content charts and the bottom
// "互動圖表" section so both stay visually identical.
function _mountChart(wrap, chart) {
  wrap.classList.add('chart-wrap');
  if (chart.title) {
    const titleDiv = document.createElement('div');
    titleDiv.className = 'chart-title';
    titleDiv.textContent = chart.title;
    wrap.parentNode.insertBefore(titleDiv, wrap);
  }
  renderChart(wrap, chart.type, chart.params);
  // #14 圖表全螢幕按鈕
  const fsBtn = document.createElement('button');
  fsBtn.className = 'chart-fs-btn';
  fsBtn.textContent = '⛶';
  fsBtn.title = '全螢幕';
  fsBtn.addEventListener('click', () => toggleChartFullscreen(wrap));
  wrap.appendChild(fsBtn);
}

function renderChart(container, type, params) {
  flog('CONTENT', `renderChart: type=${type}`, params);
  container.style.background = 'var(--bg-input)';
  container.style.borderRadius = 'var(--radius-md)';
  container.style.overflow = 'hidden';
  container.style.padding = '12px';

  if (type === 'arrhenius')    { renderArrheniusChart(container, params); return; }
  if (type === 'stressStrain') { renderStressStrainChart(container, params); return; }
  if (type === 'phaseDiagram') { renderPhaseDiagramChart(container, params); return; }
  if (type === 'freeEnergy')   { renderFreeEnergyChart(container, params); return; }
  if (type === 'crystal3d')    { renderCrystal3D(container, params); return; }
  if (type === 'surface3d')    { renderSurface3D(container, params); return; }
  if (type === 'functionPlot') { renderFunctionPlot(container, params); return; }

  container.innerHTML = `<p style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">
    ⚠ 圖表類型「${esc(type)}」尚未實作</p>`;
}

function makeCanvas(container, id) {
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.id = id || ('chart_' + Math.random().toString(36).slice(2));
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
  return canvas;
}

function destroyChart(key) {
  if (appState._charts[key]) {
    appState._charts[key].destroy();
    delete appState._charts[key];
  }
}

// Generic calculus function plotter (Week 1–2): linear / quadratic / cubic /
// exp / ln / power / recip / sqrt, plus an optional tangent line (x₀ slider)
// and editable coefficient inputs so learners can type their own values.
function renderFunctionPlot(container, params = {}) {
  const {
    curves = [{ fn: 'quadratic', a: 1, b: 0, c: 0, label: 'y = x²' }],
    xrange = [-5, 5],
    yrange = null,
    samples = 160,
    tangent = null,           // { curve: 0, x0: 1, adjustable: true }
    shade = null,             // { curve: 0, from: a, to: b, color, label } 曲線下面積填滿（積分視覺化）
    editable                  // true=全部可改 / false=都不可改 / undefined=自動（非參考線即可改）
  } = params;

  const palette = ['#4a9eff', '#2dd4bf', '#f5c842', '#a78bfa', '#f06060'];
  const live = curves.map(c => ({ ...c }));   // 可變副本（不動到 manifest 原始物件）
  const orig = curves.map(c => ({ ...c }));   // 原始值（重設用）
  let x0cur = tangent ? (tangent.x0 ?? 1) : 1;

  // 各函數型別的可調係數與公式標籤
  const COEF = {
    linear: ['a', 'b'], quadratic: ['a', 'b', 'c'], cubic: ['a', 'b', 'c', 'd'],
    exp: ['a', 'k', 'b'], ln: ['a', 'b'], power: ['a', 'n'], recip: ['a'], sqrt: ['a']
  };
  const FORM = {
    linear: 'y = a·x + b', quadratic: 'y = a·x² + b·x + c', cubic: 'y = a·x³ + b·x² + c·x + d',
    exp: 'y = a·e^(k·x) + b', ln: 'y = a·ln x + b', power: 'y = a·xⁿ', recip: 'y = a / x', sqrt: 'y = a·√x'
  };
  const DEF = { a: 1, b: 0, c: 0, d: 0, k: 1, n: 2 };

  // Evaluate a named curve form at x (no eval — safe, fixed set of forms).
  const evalCurve = (cv, x) => {
    const a = cv.a ?? 1, b = cv.b ?? 0, c = cv.c ?? 0, d = cv.d ?? 0, n = cv.n ?? 2, k = cv.k ?? 1;
    switch (cv.fn) {
      case 'linear':    return a * x + b;
      case 'quadratic': return a * x * x + b * x + c;
      case 'cubic':     return a*x*x*x + b*x*x + c*x + d;
      case 'exp':       return a * Math.exp(k * x) + b;
      case 'ln':        return x > 0 ? a * Math.log(x) + b : NaN;
      case 'power':     return a * Math.pow(x, n);
      case 'recip':     return x !== 0 ? a / x : NaN;
      case 'sqrt':      return x >= 0 ? a * Math.sqrt(x) : NaN;
      case 'identity':  return x;
      default:          return NaN;
    }
  };

  const buildPts = (cv) => {
    const [lo, hi] = xrange;
    const step = (hi - lo) / samples;
    const pts = [];
    for (let x = lo; x <= hi + 1e-9; x += step) {
      const y = evalCurve(cv, x);
      if (Number.isFinite(y)) pts.push({ x: +x.toFixed(4), y: +y.toFixed(4) });
    }
    return pts;
  };

  const uid = 'fnplot-' + Math.random().toString(36).slice(2);
  const canvas = makeCanvas(container, uid);
  const ctx = canvas.getContext('2d');

  // Tangent line via central-difference derivative (uses live curve, so edits update it too).
  const tCurve = () => live[(tangent && tangent.curve) || 0];
  const slopeAt = (x0v) => {
    const h = (xrange[1] - xrange[0]) / 2000;
    return (evalCurve(tCurve(), x0v + h) - evalCurve(tCurve(), x0v - h)) / (2 * h);
  };
  const tangentLine = (x0v) => {
    const m = slopeAt(x0v), y0 = evalCurve(tCurve(), x0v);
    const [xa, xb] = xrange;
    return {
      label: `切線 @ x₀=${x0v.toFixed(2)}（斜率 ${m.toFixed(2)}）`,
      data: [ { x: xa, y: +(y0 + m * (xa - x0v)).toFixed(4) },
              { x: xb, y: +(y0 + m * (xb - x0v)).toFixed(4) } ],
      borderColor: '#f5c842', borderWidth: 2, borderDash: [6, 4], pointRadius: 0, fill: false
    };
  };
  const tangentDot = (x0v) => ({
    label: '切點', data: [{ x: +x0v.toFixed(4), y: +evalCurve(tCurve(), x0v).toFixed(4) }],
    borderColor: '#f5c842', backgroundColor: '#f5c842', pointRadius: 5, showLine: false
  });

  // 從 live 重建所有資料集（曲線 + 切線）
  const buildDatasets = () => {
    const ds = live.map((cv, i) => ({
      label: cv.label || ('curve ' + (i + 1)),
      data: buildPts(cv),
      borderColor: cv.color || palette[i % palette.length],
      backgroundColor: 'transparent',
      borderWidth: cv.fn === 'identity' ? 1 : 2,
      borderDash: cv.fn === 'identity' ? [3, 3] : [],
      pointRadius: 0, tension: 0.2, fill: false
    }));
    // 曲線下面積填滿（積分視覺化）：另開一個只含 [from,to] 區段、填到 y=0 的資料集，畫在曲線後面
    if (shade) {
      const sc = live[shade.curve || 0];
      const lo = Math.max(xrange[0], shade.from), hi = Math.min(xrange[1], shade.to);
      const step = (xrange[1] - xrange[0]) / samples;
      const pts = [];
      for (let x = lo; x <= hi + 1e-9; x += step) {
        const y = evalCurve(sc, x);
        if (Number.isFinite(y)) pts.push({ x: +x.toFixed(4), y: +y.toFixed(4) });
      }
      ds.push({
        label: shade.label || '積分面積（曲線下）',
        data: pts,
        borderColor: 'transparent',
        backgroundColor: shade.color || 'rgba(74,158,255,0.28)',
        fill: 'origin', pointRadius: 0, tension: 0.2, order: 10
      });
    }
    if (tangent) ds.push(tangentLine(x0cur), tangentDot(x0cur));
    return ds;
  };

  destroyChart(uid);
  const yScale = { title: { display: true, text: 'y', color: '#8b93a8' }, ticks: { color: '#8b93a8' }, grid: { color: '#2e3447' } };
  if (yrange) { yScale.min = yrange[0]; yScale.max = yrange[1]; }

  appState._charts[uid] = new Chart(ctx, {
    type: 'line',
    data: { datasets: buildDatasets() },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 300 },
      scales: {
        x: { type: 'linear', min: xrange[0], max: xrange[1],
             title: { display: true, text: 'x', color: '#8b93a8' }, ticks: { color: '#8b93a8' }, grid: { color: '#2e3447' } },
        y: yScale
      },
      plugins: {
        legend: { labels: { color: '#e4e8f0', boxWidth: 18, font: { size: 11 } } },
        tooltip: { callbacks: { label: it => `(${it.parsed.x}, ${it.parsed.y})` } }
      }
    }
  });

  const redraw = () => { const ch = appState._charts[uid]; if (ch) { ch.data.datasets = buildDatasets(); ch.update(); } };

  // 決定哪些曲線可編輯：true=全部、false=無、undefined=自動（非 identity 參考線即可改）
  const editIdx = live
    .map((cv, i) => ({ cv, i }))
    .filter(o => COEF[o.cv.fn] && o.cv.fn !== 'identity')
    .filter(() => editable !== false)
    .map(o => o.i);

  // 係數輸入框：自己填數值玩
  if (editIdx.length) {
    const wrap = document.createElement('div');
    wrap.className = 'fnplot-edit-wrap';
    wrap.innerHTML = `<div class="fnplot-edit-tip">🎛 自己填數值玩玩看（圖會即時更新）</div>` +
      editIdx.map(idx => {
        const cv = live[idx];
        const inputs = (COEF[cv.fn] || []).map(name => {
          const val = cv[name] ?? DEF[name] ?? 0;
          return `<label class="fnplot-coef">${name} =
            <input type="number" step="0.5" id="${uid}-c${idx}-${name}" data-idx="${idx}" data-coef="${name}" value="${val}"></label>`;
        }).join('');
        return `<div class="fnplot-edit">
          <div class="fnplot-edit-head"><b>${FORM[cv.fn] || ''}</b></div>
          <div class="fnplot-edit-row">${inputs}
            <button type="button" class="fnplot-reset" data-idx="${idx}">↺ 重設</button>
          </div>
        </div>`;
      }).join('');
    container.appendChild(wrap);

    qsa('input[type=number]', wrap).forEach(inp => {
      inp.addEventListener('input', function () {
        const idx = +this.dataset.idx, coef = this.dataset.coef;
        const v = parseFloat(this.value);
        live[idx][coef] = isNaN(v) ? (DEF[coef] ?? 0) : v;
        redraw();
      });
    });
    qsa('.fnplot-reset', wrap).forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = +this.dataset.idx;
        live[idx] = { ...orig[idx] };
        (COEF[live[idx].fn] || []).forEach(name => {
          const inp = el(`${uid}-c${idx}-${name}`);
          if (inp) inp.value = live[idx][name] ?? DEF[name] ?? 0;
        });
        redraw();
      });
    });
  }

  // x₀ slider — moves the tangent point so the slope updates live.
  if (tangent && tangent.adjustable) {
    const sid = uid + '-x0';
    const ctrl = document.createElement('div');
    ctrl.className = 'chart-controls';
    ctrl.innerHTML = `
      <div class="chart-slider-group">
        <label>切點位置 x₀:</label>
        <input type="range" id="${sid}" min="${xrange[0]}" max="${xrange[1]}" step="0.1" value="${x0cur}">
        <span class="chart-slider-val" id="${sid}-val">x₀ = ${x0cur.toFixed(1)}</span>
      </div>`;
    container.appendChild(ctrl);
    el(sid).addEventListener('input', function () {
      x0cur = parseFloat(this.value);
      el(sid + '-val').textContent = 'x₀ = ' + x0cur.toFixed(1);
      redraw();
    });
  }
}

// Arrhenius: ln D vs 1000/T
function renderArrheniusChart(container, params = {}) {
  const { D0 = 1e-4, Q = 80000, Trange = [400, 1200] } = params;
  const R = 8.314;
  const canvas = makeCanvas(container, 'chart-arrhenius');
  const ctx = canvas.getContext('2d');

  const buildData = (q) => {
    const pts = [];
    for (let T = Trange[0]; T <= Trange[1]; T += 20) {
      const invT = 1000 / T;
      const lnD = Math.log(D0) - q / (R * T);
      pts.push({ x: parseFloat(invT.toFixed(4)), y: parseFloat(lnD.toFixed(3)) });
    }
    return pts;
  };

  destroyChart('arrhenius');
  appState._charts['arrhenius'] = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: `Q = ${Q/1000} kJ/mol`,
        data: buildData(Q),
        borderColor: '#4a9eff',
        backgroundColor: 'rgba(74,158,255,0.1)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 400 },
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: '1000/T  (K⁻¹)', color: '#8b93a8' },
          ticks: { color: '#8b93a8' },
          grid: { color: '#2e3447' }
        },
        y: {
          title: { display: true, text: 'ln D', color: '#8b93a8' },
          ticks: { color: '#8b93a8' },
          grid: { color: '#2e3447' }
        }
      },
      plugins: {
        legend: { labels: { color: '#e4e8f0' } },
        tooltip: {
          callbacks: {
            title: items => `1000/T = ${items[0].parsed.x}`,
            label: item => `ln D = ${item.parsed.y.toFixed(2)}`
          }
        }
      }
    }
  });

  // Add Q slider
  const ctrl = document.createElement('div');
  ctrl.className = 'chart-controls';
  ctrl.innerHTML = `
    <div class="chart-slider-group">
      <label>活化能 Q:</label>
      <input type="range" id="q-slider" min="20000" max="200000" step="5000" value="${Q}">
      <span class="chart-slider-val" id="q-val">${(Q/1000).toFixed(0)} kJ/mol</span>
    </div>`;
  container.appendChild(ctrl);

  el('q-slider').addEventListener('input', function() {
    const newQ = parseInt(this.value);
    el('q-val').textContent = (newQ/1000).toFixed(0) + ' kJ/mol';
    const ch = appState._charts['arrhenius'];
    if (ch) {
      ch.data.datasets[0].data = buildData(newQ);
      ch.data.datasets[0].label = `Q = ${newQ/1000} kJ/mol`;
      ch.update();
    }
  });
}

// Stress-Strain curve
function renderStressStrainChart(container, params = {}) {
  const canvas = makeCanvas(container, 'chart-ss');
  const ctx = canvas.getContext('2d');
  const pts = [
    {x:0, y:0}, {x:0.001, y:70}, {x:0.002, y:140}, {x:0.003, y:200},
    {x:0.005, y:250}, {x:0.01, y:260}, {x:0.03, y:280}, {x:0.08, y:310},
    {x:0.15, y:290}, {x:0.20, y:250}, {x:0.22, y:0}
  ];

  destroyChart('ss');
  appState._charts['ss'] = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: '應力-應變曲線',
        data: pts,
        borderColor: '#4caf6e',
        borderWidth: 2,
        pointRadius: pts.map((p,i)=>[2,4,8].includes(i)?5:0),
        pointBackgroundColor: '#f5c842',
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { title: { display:true, text:'應變 ε', color:'#8b93a8' }, ticks:{color:'#8b93a8'}, grid:{color:'#2e3447'} },
        y: { title: { display:true, text:'應力 σ (MPa)', color:'#8b93a8' }, ticks:{color:'#8b93a8'}, grid:{color:'#2e3447'} }
      },
      plugins: {
        legend: { labels: { color:'#e4e8f0' } },
        tooltip: {
          callbacks: {
            label: item => `σ = ${item.parsed.y.toFixed(0)} MPa  ε = ${item.parsed.x.toFixed(4)}`
          }
        },
        annotation: {} // placeholder
      }
    }
  });
}

// Simple binary phase diagram
function renderPhaseDiagramChart(container, params = {}) {
  const canvas = makeCanvas(container, 'chart-pd');
  const ctx = canvas.getContext('2d');

  const liquidus = [
    {x:0,y:327},{x:10,y:285},{x:20,y:255},{x:30,y:222},{x:40,y:190},
    {x:50,y:183},{x:61.9,y:183},{x:70,y:200},{x:80,y:225},{x:90,y:270},{x:100,y:231.9}
  ];
  const solidus_a = [
    {x:0,y:327},{x:10,y:280},{x:20,y:240},{x:30,y:210},{x:40,y:195},{x:50,y:183},{x:61.9,y:183}
  ];
  const solidus_b = [
    {x:61.9,y:183},{x:70,y:185},{x:80,y:200},{x:90,y:220},{x:100,y:231.9}
  ];

  destroyChart('pd');
  appState._charts['pd'] = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        { label:'液相線 Liquidus', data:liquidus, borderColor:'#4a9eff', borderWidth:2, pointRadius:0, tension:0.2, fill:false },
        { label:'固相線 α', data:solidus_a, borderColor:'#f5c842', borderWidth:2, pointRadius:0, tension:0.2, fill:false, borderDash:[4,4] },
        { label:'固相線 β', data:solidus_b, borderColor:'#a78bfa', borderWidth:2, pointRadius:0, tension:0.2, fill:false, borderDash:[4,4] }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      scales: {
        x: { title:{display:true, text:'成分 (wt% Sn)', color:'#8b93a8'}, min:0, max:100, ticks:{color:'#8b93a8'}, grid:{color:'#2e3447'} },
        y: { title:{display:true, text:'溫度 T (°C)', color:'#8b93a8'}, ticks:{color:'#8b93a8'}, grid:{color:'#2e3447'} }
      },
      plugins: {
        legend: { labels:{color:'#e4e8f0', fontSize:11} },
        tooltip: { callbacks: { label: item => `T = ${item.parsed.y.toFixed(0)}°C  成分 = ${item.parsed.x}wt%Sn` } }
      }
    }
  });

  // Annotations for key labels
  const ann = document.createElement('div');
  ann.style.cssText = 'padding:8px 12px;font-size:11px;color:var(--text-muted);display:flex;gap:16px;flex-wrap:wrap;';
  ann.innerHTML = `<span style="color:#4a9eff">■ L (液相)</span>
    <span style="color:#f5c842">■ L + α</span>
    <span style="color:#a78bfa">■ L + β</span>
    <span style="color:var(--accent-gold)">共晶點：61.9 wt%Sn, 183°C</span>`;
  container.appendChild(ann);
}

// Free energy vs composition
function renderFreeEnergyChart(container, params = {}) {
  const canvas = makeCanvas(container, 'chart-fe');
  const ctx = canvas.getContext('2d');
  let T = 250;

  const buildFE = (t) => {
    const pts_a = [], pts_b = [], pts_mix = [];
    for (let x = 0; x <= 1; x += 0.02) {
      const ga = -0.5*x*x + 0.1*x;
      const gb = -0.5*(1-x)*(1-x) + 0.1*(1-x);
      const gmix = 8.314 * t * (x > 0 ? x*Math.log(x) : 0) + 8.314 * t * ((1-x) > 0 ? (1-x)*Math.log(1-x) : 0);
      pts_a.push({x: parseFloat(x.toFixed(2)), y: parseFloat((ga + gmix/10000).toFixed(4)) });
    }
    return pts_a;
  };

  destroyChart('fe');
  appState._charts['fe'] = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: `G-x 曲線 (T=${T}°C)`,
        data: buildFE(T+273),
        borderColor: '#4a9eff',
        borderWidth: 2, pointRadius: 0, tension: 0.3, fill: false
      }]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      scales: {
        x: { title:{display:true, text:'成分 x (mol frac.)', color:'#8b93a8'}, min:0, max:1, ticks:{color:'#8b93a8'}, grid:{color:'#2e3447'} },
        y: { title:{display:true, text:'自由能 G (kJ/mol)', color:'#8b93a8'}, ticks:{color:'#8b93a8'}, grid:{color:'#2e3447'} }
      },
      plugins: { legend: { labels:{color:'#e4e8f0'} } }
    }
  });

  const ctrl = document.createElement('div');
  ctrl.className = 'chart-controls';
  ctrl.innerHTML = `<div class="chart-slider-group">
    <label>溫度 T:</label>
    <input type="range" id="fe-t-slider" min="100" max="600" step="10" value="${T}">
    <span class="chart-slider-val" id="fe-t-val">${T} °C</span>
  </div>`;
  container.appendChild(ctrl);

  el('fe-t-slider').addEventListener('input', function() {
    T = parseInt(this.value);
    el('fe-t-val').textContent = `${T} °C`;
    const ch = appState._charts['fe'];
    if (ch) {
      ch.data.datasets[0].data = buildFE(T+273);
      ch.data.datasets[0].label = `G-x 曲線 (T=${T}°C)`;
      ch.update();
    }
  });
}

// 3D Crystal (Three.js)
function renderCrystal3D(container, params = {}) {
  if (typeof THREE === 'undefined') {
    container.innerHTML = `<p style="text-align:center;padding:20px;color:var(--text-muted);">Three.js 載入失敗，請確認網路連線。</p>`;
    return;
  }

  const type = params.type || 'fcc';
  container.innerHTML = '';
  container.style.aspectRatio = '16/9';
  const w = container.clientWidth || 400;
  const h = w * 9 / 16;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setClearColor(0x1f2330, 1);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 100);
  camera.position.set(3.5, 2.5, 3.5);
  camera.lookAt(0,0,0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(4, 6, 4);
  scene.add(dLight);

  const atomMat = (color) => new THREE.MeshLambertMaterial({ color });
  const bondMat = new THREE.MeshLambertMaterial({ color: 0x4a9eff, transparent: true, opacity: 0.4 });

  const addAtom = (x, y, z, r, color) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), atomMat(color));
    m.position.set(x, y, z);
    scene.add(m);
  };

  const addBond = (p1, p2) => {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, len, 8), bondMat);
    cyl.position.copy(mid);
    cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir.normalize());
    scene.add(cyl);
  };

  const R = 0.35;
  // FCC corners + face-centers
  if (type === 'fcc') {
    const corners = [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]];
    const faceCenters = [[0.5,0.5,0],[0.5,0,0.5],[0,0.5,0.5],[0.5,0.5,1],[0.5,1,0.5],[1,0.5,0.5]];
    corners.forEach(([x,y,z]) => addAtom(x-0.5, y-0.5, z-0.5, R*0.7, 0x4a9eff));
    faceCenters.forEach(([x,y,z]) => addAtom(x-0.5, y-0.5, z-0.5, R, 0x2dd4bf));
  } else if (type === 'bcc') {
    const corners = [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]];
    corners.forEach(([x,y,z]) => addAtom(x-0.5, y-0.5, z-0.5, R*0.7, 0x4a9eff));
    addAtom(0, 0, 0, R, 0xf5c842); // body center
  } else if (type === 'hcp') {
    // HCP approximate
    addAtom(0,0,0, R, 0x4a9eff);
    addAtom(1,0,0, R, 0x4a9eff);
    addAtom(0.5, 0.866, 0, R, 0x4a9eff);
    addAtom(0,0,1.633, R, 0x4a9eff);
    addAtom(1,0,1.633, R, 0x4a9eff);
    addAtom(0.5, 0.866, 1.633, R, 0x4a9eff);
    addAtom(0.5, 0.289, 0.816, R, 0x2dd4bf); // inner layer atoms
    addAtom(-0.5, 0.289, 0.816, R, 0x2dd4bf);
    addAtom(0, -0.577, 0.816, R, 0x2dd4bf);
    // Center scene
    scene.children.forEach(c => { if(c.position) c.position.x -= 0.5; });
  }

  // Draw unit cell box
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(boxGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x3a4160 });
  scene.add(new THREE.LineSegments(edges, lineMat));

  // Info overlay
  const info = document.createElement('div');
  const cnMap = { fcc: 12, bcc: 8, hcp: 12 };
  const apfMap = { fcc: '74.0%', bcc: '68.0%', hcp: '74.0%' };
  info.style.cssText = `position:absolute;top:8px;right:8px;background:rgba(20,23,30,0.85);
    border:1px solid #2e3447;border-radius:8px;padding:8px 12px;font-size:11px;color:#e4e8f0;`;
  info.innerHTML = `<strong>${type.toUpperCase()}</strong><br>
    CN = ${cnMap[type]}<br>APF = ${apfMap[type]}`;
  container.style.position = 'relative';
  container.appendChild(info);

  // Structure toggle
  const toggle = document.createElement('div');
  toggle.style.cssText = 'position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:6px;';
  ['FCC','BCC','HCP'].forEach(s => {
    const btn = document.createElement('button');
    btn.textContent = s;
    btn.style.cssText = `padding:4px 10px;background:${s.toLowerCase()===type?'rgba(74,158,255,0.3)':'rgba(30,35,50,0.8)'};
      border:1px solid #3a4160;border-radius:4px;font-size:11px;color:#e4e8f0;cursor:pointer;`;
    btn.onclick = () => renderCrystal3D(container, { type: s.toLowerCase() });
    toggle.appendChild(btn);
  });
  container.appendChild(toggle);

  // Orbit-like interaction
  let isDragging = false, lastX = 0, lastY = 0;
  let rotX = 0, rotY = 0;
  renderer.domElement.addEventListener('mousedown', e => { isDragging=true; lastX=e.clientX; lastY=e.clientY; });
  window.addEventListener('mouseup', () => { isDragging=false; });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    rotY += (e.clientX - lastX) * 0.01;
    rotX += (e.clientY - lastY) * 0.01;
    lastX=e.clientX; lastY=e.clientY;
  });

  let animId;
  const animate = () => {
    animId = requestAnimationFrame(animate);
    if (!isDragging) rotY += 0.005;
    camera.position.x = 3.5 * Math.sin(rotY) * Math.cos(rotX);
    camera.position.z = 3.5 * Math.cos(rotY) * Math.cos(rotX);
    camera.position.y = 3.5 * Math.sin(rotX) + 1;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  animate();
  container._animId = animId;
}

// 多變數 z=f(x,y) 3D 曲面（Week 2 S17：先看整張曲面，再學「固定一變數＝切一刀」鋪 S18 偏微分）。
// 白名單函數（無 eval）：paraboloid x²+y² / saddle x²−y² / plane a·x+b·y。滑鼠拖曳＋iPad 觸控可旋轉。
function renderSurface3D(container, params = {}) {
  if (typeof THREE === 'undefined') {
    container.innerHTML = `<p style="text-align:center;padding:20px;color:var(--text-muted);">Three.js 載入失敗，請確認網路連線。</p>`;
    return;
  }
  if (container._animId) cancelAnimationFrame(container._animId);

  const fn = params.fn || 'paraboloid';
  const A = params.a ?? 1, B = params.b ?? 1;
  const RANGE = params.range || 2;            // x,y ∈ [−RANGE, RANGE]
  const N = 40;                               // 格點解析度
  const surf = (x, y) =>
    fn === 'saddle' ? A*x*x - B*y*y :
    fn === 'plane'  ? A*x + B*y :
                      A*x*x + B*y*y;          // paraboloid 預設

  container.innerHTML = '';
  container.style.position = 'relative';
  container.style.aspectRatio = '16/9';
  let curW = container.clientWidth || 400, curH = curW * 9 / 16;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(curW, curH);
  renderer.setClearColor(0x1f2330, 1);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, curW / curH, 0.1, 100);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dLight.position.set(4, 8, 4);
  scene.add(dLight);

  // 用 PlaneGeometry 位移頂點建曲面；z（高度）置中並縮放到合理視覺比例
  const geo = new THREE.PlaneGeometry(2 * RANGE, 2 * RANGE, N, N);
  const pos = geo.attributes.position;
  const zRaw = [];
  let zMin = Infinity, zMax = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const z = surf(pos.getX(i), pos.getY(i));
    zRaw.push(z);
    if (z < zMin) zMin = z;
    if (z > zMax) zMax = z;
  }
  const zScale = (zMax - zMin) > 1e-6 ? (RANGE * 1.0) / (zMax - zMin) : 1;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, (zRaw[i] - (zMin + zMax) / 2) * zScale);
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: 0x2dd4bf, side: THREE.DoubleSide }));
  mesh.rotation.x = -Math.PI / 2;             // 讓高度朝上（世界 +Y）
  scene.add(mesh);
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0x4a9eff, transparent: true, opacity: 0.22 }));
  wire.rotation.x = -Math.PI / 2;
  scene.add(wire);
  scene.add(new THREE.AxesHelper(RANGE * 1.3));

  const FORM = { paraboloid: 'z = x² + y²（碗形）', saddle: 'z = x² − y²（馬鞍）', plane: 'z = a·x + b·y（平面）' };
  const info = document.createElement('div');
  info.style.cssText = 'position:absolute;top:8px;left:8px;background:rgba(20,23,30,0.85);border:1px solid #2e3447;border-radius:8px;padding:8px 12px;font-size:12px;color:#e4e8f0;pointer-events:none;';
  info.innerHTML = `<strong>z = f(x, y)</strong><br>${FORM[fn] || ''}<br><span style="color:#8b93a8;font-size:10px;">拖曳旋轉 · 看曲面如何隨 x、y 起伏</span>`;
  container.appendChild(info);

  // orbit 互動：滑鼠 + iPad 觸控
  let isDragging = false, lastX = 0, lastY = 0, rotX = 0.5, rotY = 0.6;
  const down = (cx, cy) => { isDragging = true; lastX = cx; lastY = cy; };
  const move = (cx, cy) => {
    if (!isDragging) return;
    rotY += (cx - lastX) * 0.01;
    rotX = Math.max(-1.4, Math.min(1.4, rotX + (cy - lastY) * 0.01));
    lastX = cx; lastY = cy;
  };
  const up = () => { isDragging = false; };
  renderer.domElement.addEventListener('mousedown', e => down(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => move(e.clientX, e.clientY));
  window.addEventListener('mouseup', up);
  renderer.domElement.addEventListener('touchstart', e => { if (e.touches[0]) down(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  renderer.domElement.addEventListener('touchmove', e => { if (e.touches[0]) { move(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); } }, { passive: false });
  renderer.domElement.addEventListener('touchend', up);

  const dist = RANGE * 3.4;
  let animId;
  const animate = () => {
    animId = requestAnimationFrame(animate);
    // 容器尺寸變動（響應式／全螢幕）時自動重算 renderer 與相機
    const cw = container.clientWidth, ch = container.clientHeight;
    if (cw && ch && (cw !== curW || ch !== curH)) {
      curW = cw; curH = ch;
      renderer.setSize(cw, ch);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
    }
    if (!isDragging) rotY += 0.004;
    camera.position.x = dist * Math.sin(rotY) * Math.cos(rotX);
    camera.position.z = dist * Math.cos(rotY) * Math.cos(rotX);
    camera.position.y = dist * Math.sin(rotX) + RANGE;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  animate();
  container._animId = animId;
}

// ================================================================
// 14. QUIZ ENGINE (M5)
// ================================================================
// ── 信心選項：作答前選信心，用來找出「有信心卻錯」「沒把握卻對」 ──
function confRow() {
  return `<div class="conf-row">
    <span class="conf-label">作答前先選信心：</span>
    <button type="button" class="conf-btn" data-conf="high" onclick="setConf(this)">😎 有信心</button>
    <button type="button" class="conf-btn" data-conf="mid"  onclick="setConf(this)">🤔 普通</button>
    <button type="button" class="conf-btn" data-conf="low"  onclick="setConf(this)">😰 沒把握</button>
  </div>`;
}
function setConf(btn) {
  const item = btn.closest('.quiz-item');
  if (!item || item.dataset.answered) return; // 作答後不可改
  qsa('.conf-btn', item).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  item.dataset.conf = btn.dataset.conf;
}

// 記錄每題作答（含信心），找出信心與正確性不一致的題目
function recordAnswer(sessionId, qi, isCorrect, item, yourAns, correctAns) {
  const conf  = (item && item.dataset.conf) || 'mid';
  const qText = ((item && item.querySelector('.quiz-q')?.textContent) || '')
                  .replace(/^Q\d+\.\s*/, '').replace(/^\[[^\]]*\]\s*/, '').slice(0, 90);
  userState.confidenceLog = userState.confidenceLog || [];
  const entry = {
    sessionId, qi, isCorrect, confidence: conf, q: qText,
    yourAnswer: String(yourAns ?? ''), correctAnswer: String(correctAns ?? ''),
    at: new Date().toISOString()
  };
  const idx = userState.confidenceLog.findIndex(e => e.sessionId === sessionId && e.qi === qi);
  if (idx >= 0) userState.confidenceLog[idx] = entry;
  else userState.confidenceLog.push(entry);
  if (userState.confidenceLog.length > 1000) userState.confidenceLog.shift();
  flog('RECORD', `confidence: ${sessionId} Q${qi+1} conf=${conf} correct=${isCorrect}`);
  save();

  // 即時後設認知提示（最有價值的兩種不一致）
  let hint = '';
  if (conf === 'high' && !isCorrect) hint = '⚠ 有信心卻答錯——這是最危險的盲點，務必弄懂並記入重點';
  else if (conf === 'low' && isCorrect) hint = '🍀 沒把握卻答對——可能是猜中的，建議回看確認真的懂了';
  if (hint && item) {
    const h = document.createElement('div');
    h.className = 'conf-hint';
    h.textContent = hint;
    item.appendChild(h);
  }
}

// ── 填空答案正規化：放寬上下標、大小寫、符號差異，減少誤判 ──
const _SUP = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁺':'+','⁻':'-','ⁿ':'n','ˣ':'x'};
const _SUB = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','₊':'+','₋':'-'};
function _normFill(s) {
  if (s == null) return '';
  let t = String(s);
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿˣ]/g, c => _SUP[c] || c);  // 上標 → 一般字元
  t = t.replace(/[₀₁₂₃₄₅₆₇₈₉₊₋]/g, c => _SUB[c] || c);      // 下標 → 一般字元
  t = t.replace(/\^/g, '');                                   // x^2 與 x² 統一成 x2
  t = t.replace(/[−–—]/g, '-')                                // 各種減號 → -
       .replace(/[×·∙*✕]/g, '')                              // 乘號移除（x·y → xy）
       .replace(/[÷∕⁄]/g, '/')
       .replace(/√/g, 'sqrt').replace(/π/g, 'pi')
       .replace(/（/g, '(').replace(/）/g, ')').replace(/，/g, ',');
  t = t.toLowerCase().replace(/\s+/g, '');                    // 小寫、去所有空白
  return t;
}
// 判定填空是否正確（先正規化文字比對，再數值容差比對）
function fillIsCorrect(val, correctStr, tolerance) {
  const a = String(val).trim(), b = String(correctStr).trim();
  if (!a) return false;
  const na = _normFill(a), nb = _normFill(b);
  if (na === nb) return true;
  // 容許省略「變數＝」前綴（如答案「x = ln2」、使用者輸入「ln2」）
  const stripEq = s => s.includes('=') ? s.slice(s.lastIndexOf('=') + 1) : s;
  if (_normFill(stripEq(a)) === _normFill(stripEq(b))) return true;
  // 純數字才走容差比對（避免「6x²…」被 parseFloat 誤判成 6）
  const numRe = /^[+-]?\d*\.?\d+(e[+-]?\d+)?$/i;
  const ca = a.replace(/[,\s]/g, ''), cb = b.replace(/[,\s]/g, '');
  if (numRe.test(ca) && numRe.test(cb)) {
    const nv = parseFloat(ca), nc = parseFloat(cb);
    if (!isNaN(nv) && !isNaN(nc)) return Math.abs(nv - nc) <= Math.abs(nc * (tolerance || 0)) + 0.01;
  }
  return false;
}

function renderQuiz(container, quizArray, sessionId) {
  flog('QUIZ', `renderQuiz: ${quizArray.length} questions for ${sessionId}`, {
    types: quizArray.map(q => q.type)
  });
  const div = document.createElement('div');
  div.className = 'quiz-list';
  container.appendChild(div);

  quizArray.forEach((q, qi) => {
    const item = document.createElement('div');
    item.className = 'quiz-item';
    item.dataset.qi = qi;

    switch (q.type) {
      case 'single':    renderSingleQuiz(item, q, qi, sessionId); break;
      case 'multi':     renderMultiQuiz(item, q, qi, sessionId); break;
      case 'fill':      renderFillQuiz(item, q, qi, sessionId); break;
      case 'truefalse': renderTFQuiz(item, q, qi, sessionId); break;
      case 'free':      renderFreeQuiz(item, q, qi, sessionId); break;
      case 'match':     renderMatchQuiz(item, q, qi, sessionId); break;
      default:          item.innerHTML = `<p class="text-muted" style="font-size:13px;">題型 ${esc(q.type)} 暫不支援</p>`;
    }

    div.appendChild(item);
  });
}

function renderSingleQuiz(item, q, qi, sessionId) {
  item.innerHTML = `<div class="quiz-q">Q${qi+1}. ${esc(q.q)}</div>
    ${confRow()}
    <div class="quiz-opts">
      ${q.options.map((opt, i) =>
        `<div class="quiz-opt" data-idx="${i}" onclick="answerSingle('${sessionId}',${qi},${i},this.closest('.quiz-item'),${q.answer})">
          <span>${String.fromCharCode(65+i)}.</span> ${esc(opt)}
        </div>`
      ).join('')}
    </div>
    <div class="quiz-explain" id="qexp_${sessionId}_${qi}">
      <span class="quiz-explain-icon">💡</span>${esc(q.explain||'')}
    </div>`;
}

function answerSingle(sessionId, qi, chosen, item, correct) {
  if (item.dataset.answered) return;
  item.dataset.answered = '1';
  const isCorrect = chosen === correct;
  flog('QUIZ', `answer: single Q${qi+1} in ${sessionId}`, { chosen, correct, isCorrect });
  qsa('.quiz-opt', item).forEach((opt, i) => {
    if (i === correct) opt.classList.add('reveal');
    if (i === chosen && chosen !== correct) opt.classList.add('wrong');
    if (i === chosen && chosen === correct) opt.classList.add('correct');
  });
  const badge = document.createElement('div');
  badge.className = `quiz-badge ${isCorrect ? 'correct' : 'wrong'}`;
  badge.textContent = isCorrect ? '✓ 正確' : '✗ 錯誤';
  item.appendChild(badge);

  const exp = el(`qexp_${sessionId}_${qi}`);
  if (exp) exp.classList.add('show');

  recordAnswer(sessionId, qi, isCorrect, item, String.fromCharCode(65+chosen), String.fromCharCode(65+correct));
  if (!isCorrect) addToWrongBook(sessionId, qi, String.fromCharCode(65+chosen), String.fromCharCode(65+correct));
}

function renderMultiQuiz(item, q, qi, sessionId) {
  item.innerHTML = `<div class="quiz-q">Q${qi+1}. [多選] ${esc(q.q)}</div>
    ${confRow()}
    <div class="quiz-opts">
      ${q.options.map((opt, i) =>
        `<div class="quiz-opt" data-idx="${i}" onclick="this.classList.toggle('selected')">
          <input type="checkbox" onclick="event.stopPropagation();this.closest('.quiz-opt').classList.toggle('selected')">
          <span>${String.fromCharCode(65+i)}.</span> ${esc(opt)}
        </div>`
      ).join('')}
    </div>
    <button class="quiz-confirm-btn" style="margin-top:10px;" onclick="answerMulti('${sessionId}',${qi},this.closest('.quiz-item'),[${q.answer}])">確認</button>
    <div class="quiz-explain" id="qexp_${sessionId}_${qi}"><span class="quiz-explain-icon">💡</span>${esc(q.explain||'')}</div>`;
}

function answerMulti(sessionId, qi, item, correct) {
  if (item.dataset.answered) return;
  item.dataset.answered = '1';
  const selected = qsa('.quiz-opt.selected', item).map(o => parseInt(o.dataset.idx));
  const correctSet = new Set(correct);
  const isCorrect = selected.length === correct.length && selected.every(i => correctSet.has(i));
  qsa('.quiz-opt', item).forEach((opt, i) => {
    if (correctSet.has(i)) opt.classList.add('reveal');
    if (selected.includes(i) && !correctSet.has(i)) opt.classList.add('wrong');
  });
  const badge = document.createElement('div');
  badge.className = `quiz-badge ${isCorrect?'correct':'wrong'}`;
  badge.textContent = isCorrect ? '✓ 全對' : '✗ 未完全正確';
  item.appendChild(badge);
  const exp = el(`qexp_${sessionId}_${qi}`);
  if (exp) exp.classList.add('show');
  recordAnswer(sessionId, qi, isCorrect, item, selected.map(i=>String.fromCharCode(65+i)).join(','), correct.map(i=>String.fromCharCode(65+i)).join(','));
  if (!isCorrect) addToWrongBook(sessionId, qi, selected.join(','), correct.join(','));
}

function renderFillQuiz(item, q, qi, sessionId) {
  item.innerHTML = `<div class="quiz-q">Q${qi+1}. ${esc(q.q)}</div>
    ${confRow()}
    <div class="quiz-hint-tip">提示：可用一般鍵盤輸入，例如 x² 打成 x^2 或 x2 都算對；大小寫不限。</div>
    <div class="quiz-fill-row">
      <input class="quiz-fill-input" id="fill_${sessionId}_${qi}" placeholder="輸入答案…">
      <button class="quiz-confirm-btn" onclick="answerFill('${sessionId}',${qi},this.closest('.quiz-item'),'${esc(String(q.answer))}',${q.tolerance||0.05})">確認</button>
    </div>
    <div class="quiz-explain" id="qexp_${sessionId}_${qi}"><span class="quiz-explain-icon">💡</span>${esc(q.explain||'')}</div>`;
}

function answerFill(sessionId, qi, item, correctStr, tolerance) {
  if (item.dataset.answered) return;
  const inputEl = el(`fill_${sessionId}_${qi}`);
  if (!inputEl) return;
  const val = inputEl.value.trim();
  // 放寬判定：正規化文字（上下標、大小寫、符號）＋ 數值容差
  const isCorrect = fillIsCorrect(val, correctStr, tolerance);
  item.dataset.answered = '1';
  flog('QUIZ', `answer: fill Q${qi+1} in ${sessionId}`, { input: val, correct: correctStr, isCorrect });
  inputEl.style.borderColor = isCorrect ? 'var(--accent-green)' : 'var(--accent-red)';
  const badge = document.createElement('div');
  badge.className = `quiz-badge ${isCorrect?'correct':'wrong'}`;
  badge.innerHTML = isCorrect ? '✓ 正確' : `✗ 錯誤 &nbsp; 正確答案：${esc(correctStr)}`;
  item.appendChild(badge);
  const exp = el(`qexp_${sessionId}_${qi}`);
  if (exp) exp.classList.add('show');
  recordAnswer(sessionId, qi, isCorrect, item, val, correctStr);
  if (!isCorrect) addToWrongBook(sessionId, qi, val, correctStr);
}

function renderTFQuiz(item, q, qi, sessionId) {
  item.innerHTML = `<div class="quiz-q">Q${qi+1}. [是非] ${esc(q.q)}</div>
    ${confRow()}
    <div class="quiz-tf-row">
      <button class="quiz-tf-btn" onclick="answerTF('${sessionId}',${qi},true,this.closest('.quiz-item'),${q.answer})">✓ 是 (True)</button>
      <button class="quiz-tf-btn" onclick="answerTF('${sessionId}',${qi},false,this.closest('.quiz-item'),${q.answer})">✗ 否 (False)</button>
    </div>
    <div class="quiz-explain" id="qexp_${sessionId}_${qi}"><span class="quiz-explain-icon">💡</span>${esc(q.explain||'')}</div>`;
}

function answerTF(sessionId, qi, chosen, item, correct) {
  if (item.dataset.answered) return;
  item.dataset.answered = '1';
  const isCorrect = chosen === correct;
  flog('QUIZ', `answer: truefalse Q${qi+1} in ${sessionId}`, { chosen, correct, isCorrect });
  qsa('.quiz-tf-btn', item).forEach(btn => {
    const btnTrue = btn.textContent.includes('True');
    if ((btnTrue && correct) || (!btnTrue && !correct)) btn.classList.add('correct');
    else if ((btnTrue && chosen) || (!btnTrue && !chosen)) btn.classList.add('wrong');
  });
  // 與其他題型一致：作答後顯示 ✓/✗ 結果 badge
  const badge = document.createElement('div');
  badge.className = `quiz-badge ${isCorrect ? 'correct' : 'wrong'}`;
  badge.textContent = isCorrect ? '✓ 正確' : '✗ 錯誤';
  item.appendChild(badge);
  const exp = el(`qexp_${sessionId}_${qi}`);
  if (exp) exp.classList.add('show');
  recordAnswer(sessionId, qi, isCorrect, item, chosen ? 'True' : 'False', correct ? 'True' : 'False');
  if (!isCorrect) addToWrongBook(sessionId, qi, chosen ? 'True' : 'False', correct ? 'True' : 'False');
}

function renderFreeQuiz(item, q, qi, sessionId) {
  const saved = userState.sessions[sessionId]?.freeAnswers?.[qi] || '';
  item.innerHTML = `<div class="quiz-q">Q${qi+1}. [自由作答] ${esc(q.q)}</div>
    <textarea class="quiz-free-input" id="free_${sessionId}_${qi}" placeholder="寫下你的想法…">${esc(saved)}</textarea>
    <button class="quiz-save-btn" onclick="saveFreeAnswer('${sessionId}',${qi})">💾 存檔</button>`;
}

// U03: match quiz type — click-to-pair (left col + right col)
function renderMatchQuiz(item, q, qi, sessionId) {
  const pairs = q.pairs || [];
  const lefts  = pairs.map(p => p[0]);
  const rights = [...pairs.map(p => p[1])].sort(() => Math.random() - 0.5);
  item.innerHTML = `<div class="quiz-q">Q${qi+1}. [配對] ${esc(q.q)}</div>
    ${confRow()}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
      <div>${lefts.map((l,i) => `<div class="quiz-opt match-left" data-li="${i}" onclick="matchSelectLeft(this,${qi})">${esc(l)}</div>`).join('')}</div>
      <div>${rights.map((r,i) => `<div class="quiz-opt match-right" data-ri="${i}" data-val="${esc(r)}" onclick="matchSelectRight(this,${qi})">${esc(r)}</div>`).join('')}</div>
    </div>
    <div id="match-pairs-${qi}" style="font-size:12px;color:var(--text-muted);min-height:20px;"></div>
    <button class="quiz-confirm-btn" style="margin-top:8px;" onclick="answerMatch('${sessionId}',${qi},this.closest('.quiz-item'),${JSON.stringify(pairs).replace(/"/g,"'")})">確認配對</button>
    <div class="quiz-explain" id="qexp_${sessionId}_${qi}"><span class="quiz-explain-icon">💡</span>${esc(q.explain||'')}</div>`;
  item._matchState = { left: null, pairs: [] };
}

let _matchState = {};
function matchSelectLeft(btn, qi) {
  const item = btn.closest('.quiz-item');
  qsa('.match-left', item).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  _matchState[qi] = _matchState[qi] || {};
  _matchState[qi].left = { idx: parseInt(btn.dataset.li), text: btn.textContent };
  _tryPair(qi, item);
}
function matchSelectRight(btn, qi) {
  const item = btn.closest('.quiz-item');
  qsa('.match-right', item).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  _matchState[qi] = _matchState[qi] || {};
  _matchState[qi].right = { val: btn.dataset.val, text: btn.textContent };
  _tryPair(qi, item);
}
function _tryPair(qi, item) {
  const s = _matchState[qi];
  if (!s || !s.left || !s.right) return;
  s.pairs = s.pairs || [];
  s.pairs.push({ leftIdx: s.left.idx, leftText: s.left.text, rightVal: s.right.val });
  const display = el(`match-pairs-${qi}`);
  if (display) display.innerHTML = s.pairs.map(p => `<span style="margin-right:12px;">${esc(p.leftText)} → ${esc(p.rightVal)}</span>`).join('');
  s.left = null; s.right = null;
  qsa('.match-left, .match-right', item).forEach(b => b.classList.remove('selected'));
}
function answerMatch(sessionId, qi, item, pairsStr) {
  if (item.dataset.answered) return;
  const correct = Array.isArray(pairsStr) ? pairsStr : JSON.parse(pairsStr.replace(/'/g,'"'));
  const s = _matchState[qi] || {};
  const made = s.pairs || [];
  let allCorrect = made.length === correct.length;
  for (const cp of correct) {
    const found = made.find(m => m.leftText === cp[0] && m.rightVal === cp[1]);
    if (!found) { allCorrect = false; break; }
  }
  item.dataset.answered = '1';
  const badge = document.createElement('div');
  badge.className = `quiz-badge ${allCorrect ? 'correct' : 'wrong'}`;
  badge.textContent = allCorrect ? '✓ 全部配對正確！' : `✗ 有誤  正確：${correct.map(p=>p[0]+'→'+p[1]).join('，')}`;
  item.appendChild(badge);
  const exp = el(`qexp_${sessionId}_${qi}`);
  if (exp) exp.classList.add('show');
  recordAnswer(sessionId, qi, allCorrect, item, made.map(m=>m.leftText+'→'+m.rightVal).join(','), correct.map(p=>p[0]+'→'+p[1]).join(','));
  if (!allCorrect) addToWrongBook(sessionId, qi, made.map(m=>m.leftText+'→'+m.rightVal).join(','), correct.map(p=>p[0]+'→'+p[1]).join(','));
}

function saveFreeAnswer(sessionId, qi) {
  const val = el(`free_${sessionId}_${qi}`)?.value || '';
  if (!userState.sessions[sessionId]) userState.sessions[sessionId] = {};
  if (!userState.sessions[sessionId].freeAnswers) userState.sessions[sessionId].freeAnswers = {};
  userState.sessions[sessionId].freeAnswers[qi] = val;
  save();
  showToast('💾 已存檔', 'success');
}

function addToWrongBook(sessionId, qi, yourAns, correctAns) {
  flog('QUIZ', `wrong-book: added ${sessionId} Q${qi+1}`, { yourAns, correctAns });
  userState.wrongBook = userState.wrongBook || [];
  const existing = userState.wrongBook.findIndex(w => w.sessionId === sessionId && w.qi === qi);
  const entry = { sessionId, qi, yourAnswer: yourAns, correctAnswer: correctAns, addedAt: new Date().toISOString() };
  if (existing >= 0) userState.wrongBook[existing] = entry;
  else userState.wrongBook.push(entry);
  save();
}

// ================================================================
// 14b. RESOURCES PAGE (#1 公式總表 / #2 術語字卡 / #3 現場連結)
// ================================================================
let _resAllCache = null;
async function _resLoadAll() {
  if (_resAllCache) return _resAllCache;
  const ids = getAllSessionIds();
  const arr = await Promise.all(ids.map(id => loadSession(id).catch(() => null)));
  _resAllCache = arr.filter(s => s && s.status !== 'draft' && (s.content || s.fieldLink))
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
  flog('CONTENT', `resources: aggregated ${_resAllCache.length} sessions`);
  return _resAllCache;
}

function renderResources() {
  const pg = el('pg-resources');
  pg.innerHTML = `
    <h2 style="font-size:18px;font-weight:800;margin-bottom:6px;">📚 學習資源</h2>
    <p style="font-size:12px;color:var(--text-muted);margin-bottom:14px;">自動彙整全部已建好節次的公式、術語與現場連結，考前一頁掃完。</p>
    <div class="progress-tabs">
      <button class="prog-tab active" onclick="switchResTab('formulas',this)">📐 公式總表</button>
      <button class="prog-tab" onclick="switchResTab('terms',this)">🔤 術語字卡</button>
      <button class="prog-tab" onclick="switchResTab('fields',this)">🏭 現場連結</button>
    </div>
    <div id="res-formulas" class="prog-tab-panel active"></div>
    <div id="res-terms" class="prog-tab-panel"></div>
    <div id="res-fields" class="prog-tab-panel"></div>`;
  renderResFormulas();
}

function switchResTab(tab, btn) {
  const pg = el('pg-resources');
  qsa('.prog-tab', pg).forEach(b => b.classList.remove('active'));
  qsa('.prog-tab-panel', pg).forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  el('res-' + tab)?.classList.add('active');
  if (tab === 'formulas') renderResFormulas();
  if (tab === 'terms')    renderResTerms();
  if (tab === 'fields')   renderResFields();
}

function filterResList(listId, q) {
  const list = el(listId);
  if (!list) return;
  q = (q || '').toLowerCase();
  qsa('.res-card, .term-card', list).forEach(c => {
    c.style.display = (!q || c.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
}

// #1 公式總表：抽出所有「已編號（\tag）」的核心公式
async function renderResFormulas() {
  const area = el('res-formulas');
  if (!area) return;
  area.innerHTML = `<p class="text-muted" style="font-size:13px;padding:14px 0;">整理全部公式中…</p>`;
  const all = await _resLoadAll();
  const rows = [];
  for (const s of all) {
    const blocks = [...(s.content || '').matchAll(/\$\$([\s\S]+?)\$\$/g)].map(m => m[1].trim());
    const keyed = [...new Set(blocks.filter(f => /\\tag/.test(f)))];
    for (const f of keyed) rows.push({ id: s.id, title: s.title, f });
  }
  if (!rows.length) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">📐</div><p>尚無已編號的公式。</p></div>`;
    return;
  }
  area.innerHTML = `
    <input type="text" class="todo-input" style="width:100%;margin-bottom:12px;"
      placeholder="搜尋公式或節次…" oninput="filterResList('res-formulas-list',this.value)">
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">共 ${rows.length} 條核心公式（按節次順序）</div>
    <div id="res-formulas-list">${rows.map(r => `
      <div class="res-card">
        <div class="res-meta"><a onclick="navigate('pg-lesson',{id:'${r.id}'})" style="color:var(--accent-blue);cursor:pointer;">${esc(r.id)}</a> · ${esc(r.title)}</div>
        <div class="res-formula">$$${r.f}$$</div>
      </div>`).join('')}</div>`;
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(area, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false });
  }
}

// #2 術語字卡：抽出 term-zh / term-en，預設只露中文，點擊翻出英文
async function renderResTerms() {
  const area = el('res-terms');
  if (!area) return;
  area.innerHTML = `<p class="text-muted" style="font-size:13px;padding:14px 0;">整理全部術語中…</p>`;
  const all = await _resLoadAll();
  const map = new Map();
  const re = /<span class="term-zh">([\s\S]*?)<\/span>（<span class="term-en">([\s\S]*?)<\/span>/g;
  for (const s of all) {
    let m;
    while ((m = re.exec(s.content || ''))) {
      const zh = m[1].replace(/<[^>]+>/g, '').trim();
      const en = m[2].replace(/<[^>]+>/g, '').replace(/[，,].*$/, '').trim();
      if (!en) continue;
      const key = en.toLowerCase();
      if (!map.has(key)) map.set(key, { zh, en, ids: new Set() });
      map.get(key).ids.add(s.id);
    }
  }
  const terms = [...map.values()].sort((a, b) => a.en.localeCompare(b.en));
  if (!terms.length) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">🔤</div><p>尚無術語。</p></div>`;
    return;
  }
  area.innerHTML = `
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
      <input type="text" class="todo-input" style="flex:1;min-width:140px;"
        placeholder="搜尋術語…" oninput="filterResList('res-terms-list',this.value)">
      <button class="setting-btn" onclick="qsa('.term-card',el('res-terms-list')).forEach(c=>c.classList.add('flipped'))">全部翻面</button>
      <button class="setting-btn" onclick="qsa('.term-card',el('res-terms-list')).forEach(c=>c.classList.remove('flipped'))">全部蓋回</button>
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">共 ${terms.length} 個術語 · 點卡片翻出英文（練被動記憶）</div>
    <div id="res-terms-list" class="term-grid">${terms.map(tm => `
      <div class="term-card" onclick="this.classList.toggle('flipped')">
        <div class="tc-zh">${esc(tm.zh)}</div>
        <div class="tc-en">${esc(tm.en)}</div>
        <div class="tc-hint">點擊看英文</div>
      </div>`).join('')}</div>`;
}

// #3 現場連結：彙整每節 fieldLink（封裝現象 → 理論）
async function renderResFields() {
  const area = el('res-fields');
  if (!area) return;
  area.innerHTML = `<p class="text-muted" style="font-size:13px;padding:14px 0;">整理現場連結中…</p>`;
  const all = await _resLoadAll();
  const rows = all.filter(s => s.fieldLink && s.fieldLink.trim());
  if (!rows.length) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">🏭</div><p>尚無現場連結。</p></div>`;
    return;
  }
  area.innerHTML = `
    <input type="text" class="todo-input" style="width:100%;margin-bottom:12px;"
      placeholder="搜尋（如 IMC、bond、TEC）…" oninput="filterResList('res-fields-list',this.value)">
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">把你的封裝現場經驗掛上理論鉤子——共 ${rows.length} 條，這是你比同學多的維度。</div>
    <div id="res-fields-list">${rows.map(r => `
      <div class="res-card" style="border-left:3px solid var(--accent-teal);">
        <div class="res-meta"><a onclick="navigate('pg-lesson',{id:'${r.id}'})" style="color:var(--accent-blue);cursor:pointer;">${esc(r.id)}</a> · ${esc(r.title)}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;line-height:1.6;">${esc(r.fieldLink)}</div>
      </div>`).join('')}</div>`;
}

// ================================================================
// 15. PRACTICE PAGE
// ================================================================
function renderPractice(params = {}) {
  const pg = el('pg-practice');
  const stages = appState.manifest?.stages || [];
  const scopes = [
    { label: t('allSessions'), ids: getAllSessionIds() },
    ...stages[0]?.weeks.map(w => ({ label: `Week ${w.id}`, ids: w.sessionIds })) || [],
    ...stages[1]?.weeks.map(w => ({ label: `Week ${w.id}`, ids: w.sessionIds })) || [],
    ...stages[2]?.weeks.map(w => ({ label: `Week ${w.id}`, ids: w.sessionIds })) || [],
  ];

  let selectedScope = params.scope || 'all';

  const scopeHTML = scopes.map((s, i) =>
    `<button class="scope-btn${(i===0&&selectedScope==='all')||(s.label===selectedScope)?'  active':''}"
      onclick="startPractice('${s.label}',${JSON.stringify(s.ids).replace(/"/g,"'").replace(/'/g,'&apos;')})"
    >${esc(s.label)}</button>`
  ).join('');

  pg.innerHTML = `
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
      <h2 style="font-size:18px;font-weight:800;">${t('practiceTitle')}</h2>
      <label style="font-size:13px;color:var(--text-secondary);display:flex;align-items:center;gap:6px;cursor:pointer;">
        <input type="checkbox" id="timed-toggle" style="accent-color:var(--accent-gold);"> ⏱ 計時模式（30 分鐘）
      </label>
    </div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">${t('selectScope')}</p>
    <div class="practice-scope">${scopeHTML}</div>

    <!-- #5/#10 模擬考 + 里程碑檢定 -->
    <div class="card" style="margin-top:16px;">
      <div class="settings-title">📝 模擬考 / 里程碑檢定</div>
      <p style="font-size:12px;color:var(--text-muted);margin:6px 0 10px;">依難度配比（4 易/5 中/1 難）抽 20 題、計時 30 分鐘、按「交卷」評分；里程碑檢定達 <b>70%</b> 通過解鎖徽章。</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${stages.map((st, i) => {
          const ids = st.weeks.flatMap(w => w.sessionIds);
          const done = !!userState.milestones?.['stage' + st.id];
          return `<button class="scope-btn${done ? '  active' : ''}"
            onclick="startMockExam('第${st.id}階段檢定',${JSON.stringify(ids).replace(/"/g,"'").replace(/'/g,'&apos;')},'stage${st.id}',20)">
            ${done ? '🏅 ' : ''}第${st.id}階段檢定</button>`;
        }).join('')}
        <button class="scope-btn" onclick="startMockExam('全範圍模擬考',${JSON.stringify(getAllSessionIds()).replace(/"/g,"'").replace(/'/g,'&apos;')},'',25)">🎯 全範圍模擬考</button>
      </div>
    </div>

    <div id="practice-content">
      <p class="text-muted" style="font-size:13px;padding:20px 0;">選擇範圍後點擊週按鈕開始練習。</p>
    </div>`;
}

// #5/#10 模擬考：依難度配比抽題、計時、交卷評分、里程碑 70% 通過
let _examTimer = null;
async function startMockExam(label, idsStr, milestoneKey, count) {
  count = count || 20;
  const ids = Array.isArray(idsStr) ? idsStr : JSON.parse(idsStr.replace(/&apos;/g, "'"));
  const area = el('practice-content');
  if (!area) return;
  clearInterval(_examTimer); clearInterval(_practiceTimer);
  area.innerHTML = `<div style="text-align:center;padding:40px;"><div class="loader-ring" style="margin:0 auto;"></div><p style="margin-top:12px;font-size:13px;color:var(--text-muted);">組卷中…</p></div>`;

  const pool = [];
  for (const id of ids) {
    const s = await loadSession(id);
    if (s.quiz?.length) s.quiz.forEach((q, qi) => { if (q.type !== 'free') pool.push({ ...q, sessionId: id, qi }); });
  }
  if (pool.length < 4) {
    area.innerHTML = `<div class="card"><p class="text-muted text-center" style="padding:20px;">這個範圍可考題目還不夠（需先填充更多內容）。</p></div>`;
    return;
  }
  const shuf = arr => arr.slice().sort(() => Math.random() - 0.5);
  const byD = { basic: [], standard: [], challenge: [] };
  pool.forEach(q => (byD[q.difficulty] || byD.standard).push(q));
  const want = { basic: Math.round(count * 0.4), standard: Math.round(count * 0.5), challenge: Math.max(1, Math.round(count * 0.1)) };
  let exam = [...shuf(byD.basic).slice(0, want.basic), ...shuf(byD.standard).slice(0, want.standard), ...shuf(byD.challenge).slice(0, want.challenge)];
  if (exam.length < count) {
    const rest = pool.filter(q => !exam.includes(q));
    exam = exam.concat(shuf(rest).slice(0, count - exam.length));
  }
  exam = shuf(exam);

  area.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
      <span style="font-size:13px;color:var(--text-secondary);">${esc(label)} — ${exam.length} 題</span>
      <div style="display:flex;gap:8px;align-items:center;">
        <div id="exam-timer" style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:6px 14px;font-size:15px;font-weight:700;color:var(--accent-gold);">30:00</div>
        <button class="complete-btn" style="padding:8px 16px;margin:0;width:auto;" onclick="submitExam('${milestoneKey}',${exam.length})">交卷</button>
      </div>
    </div>
    <div id="practice-quiz-area"></div>`;
  renderQuiz(el('practice-quiz-area'), exam, 'exam');

  let sec = 30 * 60;
  const tick = () => {
    const tEl = el('exam-timer');
    if (!tEl) { clearInterval(_examTimer); return; }
    const m = Math.floor(sec / 60), s = sec % 60;
    tEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (sec <= 0) { clearInterval(_examTimer); submitExam(milestoneKey, exam.length); }
    sec--;
  };
  _examTimer = setInterval(tick, 1000); tick();
  flog('QUIZ', `mock exam started: ${label}`, { count: exam.length, milestoneKey });
}

function submitExam(milestoneKey, total) {
  clearInterval(_examTimer);
  const quizArea = el('practice-quiz-area');
  if (!quizArea) return;
  const correct = quizArea.querySelectorAll('.quiz-badge.correct').length;
  const answered = quizArea.querySelectorAll('.quiz-item[data-answered]').length;
  const pct = total ? Math.round(correct / total * 100) : 0;
  const pass = pct >= 70;

  let milestoneMsg = '';
  if (milestoneKey && pass) {
    userState.milestones = userState.milestones || {};
    if (!userState.milestones[milestoneKey]) {
      userState.milestones[milestoneKey] = new Date().toISOString();
      save();
      milestoneMsg = '🏅 恭喜通過里程碑檢定，已解鎖徽章！';
      showToast(milestoneMsg, 'success', 5000);
    } else milestoneMsg = '🏅 此里程碑先前已通過。';
  }
  flog('QUIZ', `exam submitted`, { correct, total, pct, pass, milestoneKey });

  const banner = document.createElement('div');
  banner.className = 'quiz-score-banner slide-in';
  banner.style.borderColor = pass ? 'var(--accent-green)' : 'var(--accent-gold)';
  banner.innerHTML = `
    <div class="quiz-score-num" style="color:${pass ? 'var(--accent-green)' : 'var(--accent-gold)'};">${correct}/${total}</div>
    <div class="quiz-score-label">${pct}% 正確 · ${answered} 題已作答 · ${pass ? '✓ 通過（≥70%）' : '未達 70%，再加油'}</div>
    ${milestoneMsg ? `<div style="font-size:12px;color:var(--accent-green);margin-top:6px;">${milestoneMsg}</div>` : ''}
    ${!pass ? `<div style="font-size:11px;color:var(--text-muted);margin-top:6px;">未答對的題目已自動進錯題本，可到「紀錄 → 錯題本」訂正。</div>` : ''}`;
  quizArea.insertBefore(banner, quizArea.firstChild);
  banner.scrollIntoView({ behavior: 'smooth' });
}

// U01: timed practice mode
let _practiceTimer = null;

async function startPractice(label, idsStr) {
  const timed = el('timed-toggle')?.checked || false;
  const ids = Array.isArray(idsStr) ? idsStr : JSON.parse(idsStr.replace(/&apos;/g,"'"));
  const area = el('practice-content');
  if (!area) return;
  clearInterval(_practiceTimer);

  area.innerHTML = `<div style="text-align:center;padding:40px;"><div class="loader-ring" style="margin:0 auto;"></div><p style="margin-top:12px;font-size:13px;color:var(--text-muted);">載入題庫…</p></div>`;

  const quizPool = [];
  for (const id of ids) {
    const s = await loadSession(id);
    if (s.quiz?.length) s.quiz.forEach((q, qi) => quizPool.push({ ...q, sessionId: id, qi }));
  }

  if (quizPool.length === 0) {
    area.innerHTML = `<div class="card"><p class="text-muted text-center" style="padding:20px;">這個範圍目前沒有練習題。請先填充內容。</p></div>`;
    return;
  }

  const shuffled = quizPool.sort(() => Math.random() - 0.5).slice(0, 15);
  const timedHTML = timed
    ? `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <span style="font-size:13px;color:var(--text-muted);">${label} — ${shuffled.length} 題（計時模式）</span>
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:6px 14px;font-size:15px;font-weight:700;color:var(--accent-gold);" id="quiz-timer">30:00</div>
      </div>`
    : `<p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">${label} — ${shuffled.length} 題</p>`;

  area.innerHTML = timedHTML + `<div id="practice-quiz-area"></div>`;

  const quizArea = el('practice-quiz-area');
  renderQuiz(quizArea, shuffled, 'practice');

  // Start countdown
  if (timed) {
    let seconds = 30 * 60;
    const tick = () => {
      if (!el('quiz-timer')) { clearInterval(_practiceTimer); return; }
      const m = Math.floor(seconds / 60), s = seconds % 60;
      el('quiz-timer').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      if (seconds === 0) {
        clearInterval(_practiceTimer);
        _showPracticeScore(quizArea, shuffled);
      }
      seconds--;
    };
    _practiceTimer = setInterval(tick, 1000);
    tick();
  }
}

function _showPracticeScore(quizArea, questions) {
  const total = questions.length;
  const answered = quizArea.querySelectorAll('.quiz-item[data-answered]').length;
  const correct  = quizArea.querySelectorAll('.quiz-badge.correct').length;
  const banner = document.createElement('div');
  banner.className = 'quiz-score-banner slide-in';
  banner.innerHTML = `<div class="quiz-score-num">${correct}/${total}</div>
    <div class="quiz-score-label">${Math.round(correct/total*100)}% 正確率 · ${answered} 題已作答</div>`;
  quizArea.insertBefore(banner, quizArea.firstChild);
  quizArea.scrollIntoView({ behavior: 'smooth' });
}

// ================================================================
// 16. PROGRESS / RECORDS PAGE
// ================================================================
function renderProgress() {
  const pg = el('pg-progress');

  pg.innerHTML = `
    <h2 style="font-size:18px;font-weight:800;margin-bottom:16px;">${t('navProgress')}</h2>
    <div class="progress-tabs">
      <button class="prog-tab active" onclick="switchProgTab('review',this)">🔁 今日複習</button>
      <button class="prog-tab" onclick="switchProgTab('stats',this)">📈 統計</button>
      <button class="prog-tab" onclick="switchProgTab('journal',this)">${t('journalTitle')}</button>
      <button class="prog-tab" onclick="switchProgTab('summaries',this)">${t('summaryList')}</button>
      <button class="prog-tab" onclick="switchProgTab('wrongbook',this)">${t('wrongBook')}</button>
      <button class="prog-tab" onclick="switchProgTab('calibration',this)">🎯 信心校準</button>
      <button class="prog-tab" onclick="switchProgTab('heatmap',this)">學習熱力圖</button>
      <button class="prog-tab" onclick="switchProgTab('badges',this)">${t('achievementsTitle')}</button>
    </div>
    <div id="prog-review" class="prog-tab-panel active"></div>
    <div id="prog-stats" class="prog-tab-panel"></div>
    <div id="prog-journal" class="prog-tab-panel"></div>
    <div id="prog-summaries" class="prog-tab-panel"></div>
    <div id="prog-wrongbook" class="prog-tab-panel"></div>
    <div id="prog-calibration" class="prog-tab-panel"></div>
    <div id="prog-heatmap" class="prog-tab-panel"></div>
    <div id="prog-badges" class="prog-tab-panel"></div>`;

  renderReview();
}

function switchProgTab(tab, btn) {
  qsa('.prog-tab').forEach(b => b.classList.remove('active'));
  qsa('.prog-tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  el(`prog-${tab}`)?.classList.add('active');

  if (tab === 'review')      renderReview();
  if (tab === 'stats')       renderStats();
  if (tab === 'journal')     renderJournal();
  if (tab === 'summaries')   renderSummaries();
  if (tab === 'wrongbook')   renderWrongBook();
  if (tab === 'calibration') renderCalibration();
  if (tab === 'heatmap')     renderHeatmap();
  if (tab === 'badges')      renderBadges();
}

// #6 今日複習：列出到期的節次，複習後依評分重新排程
function renderReview() {
  const area = el('prog-review');
  if (!area) return;
  srsSeedCompleted();             // 既有已完成節次補進複習佇列
  const due = srsDueIds();
  const totalScheduled = Object.keys(userState.srs || {}).length;
  const titleOf = id => appState.manifest?.sessionMeta?.[id]?.title || id;

  if (!due.length) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">✅</div>
      <p>今天沒有要複習的節次了！</p>
      <p style="font-size:12px;color:var(--text-muted);margin-top:6px;">
        ${totalScheduled ? `已排程 ${totalScheduled} 節，依遺忘曲線到期才會出現在這。` : '完成節次後會自動排入間隔複習。'}</p></div>`;
    return;
  }
  area.innerHTML = `
    <div class="card" style="margin-bottom:14px;">
      <div style="font-size:13px;color:var(--text-secondary);">今天有 <b style="color:var(--accent-gold);font-size:18px;">${due.length}</b> 節到期複習</div>
      <p style="font-size:11px;color:var(--text-muted);margin-top:6px;">複習方法：點「開啟複習」快速看一遍重點與題目，回來後誠實評分，系統會依遺忘曲線決定下次再考你的時間。</p>
    </div>
    ${due.map(id => {
      const e = userState.srs[id];
      return `<div class="card card-sm review-card" id="rev-${id}" style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
          <div>
            <span style="font-size:11px;color:var(--accent-blue);">${esc(id)}</span>
            <span style="font-size:13px;color:var(--text-primary);"> ${esc(titleOf(id))}</span>
            <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">已複習 ${e.reps||0} 次</div>
          </div>
          <button class="setting-btn" onclick="navigate('pg-lesson',{id:'${id}'})">開啟複習 →</button>
        </div>
        <div style="display:flex;gap:6px;margin-top:10px;">
          <button class="rev-btn rev-again" onclick="doReview('${id}','again')">😵 再來一次<br><span>1 天後</span></button>
          <button class="rev-btn rev-good"  onclick="doReview('${id}','good')">🙂 普通<br><span>${_revPreview(id,'good')}</span></button>
          <button class="rev-btn rev-easy"  onclick="doReview('${id}','easy')">😎 簡單<br><span>${_revPreview(id,'easy')}</span></button>
        </div>
      </div>`;
    }).join('')}`;
}
function _revPreview(id, grade) {
  const e = userState.srs?.[id] || { interval: 1, ease: 2.3, reps: 0 };
  let iv;
  if (e.reps === 0)      iv = grade === 'easy' ? 3 : 1;
  else if (e.reps === 1) iv = grade === 'easy' ? 7 : 3;
  else                   iv = Math.max(1, Math.round(e.interval * (grade === 'easy' ? (e.ease + 0.15) : e.ease)));
  return iv >= 30 ? `${Math.round(iv/30)} 個月後` : `${iv} 天後`;
}
function doReview(id, grade) {
  srsReview(id, grade);
  const card = el('rev-' + id);
  if (card) { card.style.transition = 'opacity .3s'; card.style.opacity = '0'; setTimeout(renderReview, 320); }
  else renderReview();
}

// #8 學習統計儀表板
function renderStats() {
  const area = el('prog-stats');
  if (!area) return;
  const sessions = Object.values(userState.sessions || {});
  const done = sessions.filter(s => s.completed).length;
  const mins = userState.totalMinutes || 0;
  const hrs = (mins / 60).toFixed(1);
  const studyDays = new Set(sessions.filter(s => s.completedAt).map(s => fmtDate(s.completedAt))).size;
  const cur = userState.streak?.current || 0, longest = userState.streak?.longest || 0;

  // 正確率（用 confidenceLog）
  const log = userState.confidenceLog || [];
  const acc = log.length ? Math.round(log.filter(e => e.isCorrect).length / log.length * 100) : null;
  // 難度細分需題庫對照（log 沒存難度），先用「作答前信心」分級替代
  const byConf = { high: [0, 0], mid: [0, 0], low: [0, 0] };
  for (const e of log) { const b = byConf[e.confidence] || byConf.mid; b[1]++; if (e.isCorrect) b[0]++; }

  // 每階段完成
  const stages = appState.manifest?.stages || [];
  const stageRows = stages.map((st, i) => {
    const ids = st.weeks.flatMap(w => w.sessionIds);
    const c = ids.filter(id => userState.sessions[id]?.completed).length;
    const color = i === 0 ? 'var(--stage-1-accent)' : i === 1 ? 'var(--stage-2-accent)' : 'var(--stage-3-accent)';
    return `<div style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:3px;"><span>${esc(st.title)}</span><span>${c}/${ids.length}</span></div>
      <div class="stage-bar-track"><div class="stage-bar-fill" style="width:${Math.round(c/ids.length*100)}%;background:${color};"></div></div>
    </div>`;
  }).join('');

  const statCard = (label, val, sub, color) => `
    <div class="card" style="flex:1;min-width:120px;text-align:center;padding:14px 10px;">
      <div style="font-size:11px;color:var(--text-muted);">${label}</div>
      <div style="font-size:24px;font-weight:800;color:${color||'var(--text-primary)'};margin:2px 0;">${val}</div>
      <div style="font-size:10px;color:var(--text-muted);">${sub||''}</div>
    </div>`;
  const confBar = (lvl, name, color) => {
    const [c, tt] = byConf[lvl];
    const pct = tt ? Math.round(c / tt * 100) : 0;
    return `<div style="margin-bottom:6px;">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);"><span>${name}</span><span>${tt ? pct + '% (' + c + '/' + tt + ')' : '—'}</span></div>
      <div class="stage-bar-track"><div class="stage-bar-fill" style="width:${pct}%;background:${color};"></div></div>
    </div>`;
  };

  area.innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
      ${statCard('已完成', done + '<span style="font-size:13px;color:var(--text-muted)">/192</span>', Math.round(done/192*100)+'%', 'var(--accent-blue)')}
      ${statCard('學習時數', hrs, mins + ' 分鐘', 'var(--accent-teal)')}
      ${statCard('學習天數', studyDays, '天', 'var(--accent-purple)')}
      ${statCard('連續天數', cur + ' 🔥', '最長 ' + longest, 'var(--accent-gold)')}
    </div>
    <div class="card" style="margin-bottom:14px;">
      <div class="settings-title">各階段進度</div>
      <div style="margin-top:8px;">${stageRows}</div>
    </div>
    <div class="card" style="margin-bottom:14px;">
      <div class="settings-title">作答正確率</div>
      <div style="font-size:13px;color:var(--text-secondary);margin:6px 0 10px;">整體 ${acc !== null ? `<b style="font-size:18px;color:${acc>=70?'var(--accent-green)':'var(--accent-gold)'}">${acc}%</b>（${log.length} 題）` : '尚無作答記錄'}</div>
      ${log.length ? `<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">依作答前信心分組：</div>
        ${confBar('high','😎 有信心','var(--accent-green)')}
        ${confBar('mid','🤔 普通','var(--accent-gold)')}
        ${confBar('low','😰 沒把握','var(--accent-teal)')}` : ''}
    </div>`;
}

// 信心校準：找出「有信心卻錯」「沒把握卻對」，並列出各信心等級的正確率
function renderCalibration() {
  const area = el('prog-calibration');
  if (!area) return;
  const log = userState.confidenceLog || [];
  if (!log.length) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">🎯</div>
      <p>還沒有作答記錄。</p>
      <p style="font-size:12px;color:var(--text-muted);margin-top:6px;">作答前先選「信心」，這裡就會幫你找出最該複習的盲點。</p></div>`;
    return;
  }
  const confName = { high: '😎 有信心', mid: '🤔 普通', low: '😰 沒把握' };
  const overconf  = log.filter(e => e.confidence === 'high' && !e.isCorrect);  // 過度自信
  const underconf = log.filter(e => e.confidence === 'low'  &&  e.isCorrect);  // 低估自己

  // 各信心等級正確率
  const stat = lvl => {
    const rows = log.filter(e => e.confidence === lvl);
    const correct = rows.filter(e => e.isCorrect).length;
    return { total: rows.length, correct, pct: rows.length ? Math.round(correct / rows.length * 100) : 0 };
  };
  const sHigh = stat('high'), sMid = stat('mid'), sLow = stat('low');

  const titleOf = sid => appState.manifest?.sessionMeta?.[sid]?.title || sid;
  const card = (e, tone) => `
    <div class="card card-sm" style="margin-bottom:8px;border-left:3px solid var(--accent-${tone});">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:4px;">
        <span><a href="#" onclick="navigate('pg-lesson',{id:'${e.sessionId}'});return false;" style="color:var(--accent-blue);">${esc(e.sessionId)}</a> ${esc(titleOf(e.sessionId))} · Q${e.qi+1}</span>
        <span>${confName[e.confidence] || e.confidence}</span>
      </div>
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:4px;">${esc(e.q || '')}</p>
      <div style="font-size:11px;color:var(--text-muted);">你的答案：<span style="color:var(--accent-${tone});">${esc(e.yourAnswer||'—')}</span> ｜ 正解：${esc(e.correctAnswer||'—')}</div>
    </div>`;

  area.innerHTML = `
    <div class="card" style="margin-bottom:14px;">
      <div class="settings-title">各信心等級的實際正確率</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
        <div style="flex:1;min-width:90px;text-align:center;">
          <div style="font-size:11px;color:var(--text-muted);">😎 有信心</div>
          <div style="font-size:22px;font-weight:800;color:${sHigh.pct>=80?'var(--accent-green)':'var(--accent-red)'};">${sHigh.total?sHigh.pct+'%':'—'}</div>
          <div style="font-size:10px;color:var(--text-muted);">${sHigh.correct}/${sHigh.total} 題</div>
        </div>
        <div style="flex:1;min-width:90px;text-align:center;">
          <div style="font-size:11px;color:var(--text-muted);">🤔 普通</div>
          <div style="font-size:22px;font-weight:800;color:var(--accent-gold);">${sMid.total?sMid.pct+'%':'—'}</div>
          <div style="font-size:10px;color:var(--text-muted);">${sMid.correct}/${sMid.total} 題</div>
        </div>
        <div style="flex:1;min-width:90px;text-align:center;">
          <div style="font-size:11px;color:var(--text-muted);">😰 沒把握</div>
          <div style="font-size:22px;font-weight:800;color:var(--accent-teal);">${sLow.total?sLow.pct+'%':'—'}</div>
          <div style="font-size:10px;color:var(--text-muted);">${sLow.correct}/${sLow.total} 題</div>
        </div>
      </div>
      <p style="font-size:11px;color:var(--text-muted);margin-top:8px;">理想情況：「有信心」正確率應該很高。若它偏低，代表你的「自我感覺」和「實際掌握」有落差，下面兩區就是要修正的地方。</p>
    </div>

    <div class="settings-title" style="color:var(--accent-red);">⚠ 有信心卻答錯（${overconf.length}）—— 最危險的盲點，優先複習</div>
    <p style="font-size:12px;color:var(--text-muted);margin:4px 0 10px;">你以為懂了、其實沒懂。這類錯誤考試最容易踩。</p>
    ${overconf.length ? overconf.slice().reverse().map(e => card(e, 'red')).join('') : '<p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">目前沒有——很好，你的自信沒有騙你。</p>'}

    <div class="settings-title" style="color:var(--accent-teal);margin-top:16px;">🍀 沒把握卻答對（${underconf.length}）—— 可能是猜的，回看鞏固</div>
    <p style="font-size:12px;color:var(--text-muted);margin:4px 0 10px;">這次對了不代表真的會，把它變成「有信心也對」。</p>
    ${underconf.length ? underconf.slice().reverse().map(e => card(e, 'teal')).join('') : '<p style="font-size:12px;color:var(--text-muted);">目前沒有。</p>'}`;
}

function renderJournal() {
  const area = el('prog-journal');
  if (!area) return;

  // Group by date
  const byDate = {};
  for (const [id, s] of Object.entries(userState.sessions)) {
    if (!s.completed || !s.completedAt) continue;
    const d = fmtDate(s.completedAt);
    if (!byDate[d]) byDate[d] = [];
    const meta = appState.manifest?.sessionMeta?.[id];
    byDate[d].push({ id, title: meta?.title || id, time: fmtTime(s.completedAt), summary: reflectSummaryText(s) });
  }

  const dates = Object.keys(byDate).sort((a,b) => b.localeCompare(a));
  if (!dates.length) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">📖</div><p>${t('noJournal')}</p></div>`;
    return;
  }

  area.innerHTML = dates.map(d =>
    `<div class="journal-day">
      <div class="journal-date">${d} (${byDate[d].length} 節)</div>
      <div class="journal-entries">
        ${byDate[d].map(e =>
          `<div class="journal-entry">
            <span class="je-id">${esc(e.id)}</span>
            <span class="je-title"> ${esc(e.title)}</span>
            ${e.time ? `<span style="float:right;font-size:10px;color:var(--text-muted);">${e.time}</span>` : ''}
            ${e.summary ? `<div class="je-summary">"${esc(e.summary)}"</div>` : ''}
          </div>`
        ).join('')}
      </div>
    </div>`
  ).join('');
}

function renderSummaries() {
  const area = el('prog-summaries');
  if (!area) return;
  const allIds = getAllSessionIds();
  const items = allIds
    .filter(id => hasReflect(userState.sessions[id]))
    .map(id => ({
      id,
      title: appState.manifest?.sessionMeta?.[id]?.title || id,
      summary: reflectSummaryText(userState.sessions[id]),
      date: fmtDate(userState.sessions[id].completedAt)
    }));

  if (!items.length) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">✍️</div><p>${t('noSummary')}</p></div>`;
    return;
  }

  area.innerHTML = `<input type="text" id="summary-search" class="todo-input" style="width:100%;margin-bottom:14px;"
    placeholder="搜尋…" oninput="filterSummaries(this.value)">
    <div id="summaries-list">${items.map(item =>
      `<div class="card card-sm" style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:4px;">
          <span>${esc(item.id)} ${esc(item.title)}</span>
          <span>${item.date}</span>
        </div>
        <p style="font-size:13.5px;color:var(--text-secondary);font-style:italic;">"${esc(item.summary)}"</p>
      </div>`
    ).join('')}</div>`;
}

function filterSummaries(query) {
  const list = el('summaries-list');
  if (!list) return;
  const items = qsa('.card', list);
  items.forEach(card => {
    const matches = card.textContent.toLowerCase().includes(query.toLowerCase());
    card.style.display = matches ? '' : 'none';
  });
}

function renderWrongBook() {
  const area = el('prog-wrongbook');
  if (!area) return;
  const wb = userState.wrongBook || [];
  if (!wb.length) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">🎉</div><p>${t('noWrong')}</p></div>`;
    return;
  }
  const log = userState.confidenceLog || [];
  const wasConfident = (sid, qi) => log.some(e => e.sessionId === sid && e.qi === qi && e.confidence === 'high' && !e.isCorrect);

  area.innerHTML = `
    <input type="text" class="todo-input" style="width:100%;margin-bottom:10px;"
      placeholder="搜尋節次/題目…" oninput="filterResList('wrongbook-list',this.value)">
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">共 ${wb.length} 題。訂正流程：返回本節重看講解 → 弄懂後「已記住，移除」。標 ⚠ 的是你當時「有信心卻答錯」，最該優先弄懂。</div>
    <div id="wrongbook-list" class="wrong-book-list">` + wb.map((w, i) => {
    const meta = appState.manifest?.sessionMeta?.[w.sessionId];
    const conf = wasConfident(w.sessionId, w.qi);
    return `<div class="wrong-book-item res-card" id="wb-item-${i}"${conf ? ' style="border-left:3px solid var(--accent-red);"' : ''}>
      <div class="wb-meta">${esc(w.sessionId)} · ${esc(meta?.title||'')} · 第 ${w.qi+1} 題 · ${fmtDate(w.addedAt)}${conf ? ' <span style="color:var(--accent-red);font-weight:700;">⚠ 當時有信心</span>' : ''}</div>
      <div class="wb-your">${t('yourAnswer')}：${esc(String(w.yourAnswer))}</div>
      <div class="wb-ans">${t('correctAnswer')}：${esc(String(w.correctAnswer))}</div>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="wb-retry" onclick="navigate('pg-lesson',{id:'${w.sessionId}'})">→ 返回本節重看</button>
        <button class="wb-retry" onclick="wbMarkResolved(${i})"
          style="color:var(--accent-green);border-color:rgba(76,175,110,0.3);">✓ 已記住，移除</button>
      </div>
    </div>`;
  }).join('') + `</div>`;
}

function wbMarkResolved(i) {
  userState.wrongBook.splice(i, 1);
  save();
  showToast('✓ 已從錯題本移除', 'success');
  renderWrongBook();
}

// U17: GitHub-style heatmap
function renderHeatmap() {
  const area = el('prog-heatmap');
  if (!area) return;

  // Build date → count map for last 15 weeks
  const countByDate = {};
  for (const s of Object.values(userState.sessions)) {
    if (s.completedAt) {
      const d = fmtDate(s.completedAt);
      countByDate[d] = (countByDate[d] || 0) + 1;
    }
  }

  const today_ = new Date();
  const WEEKS = 15;
  const cells = [];
  for (let w = WEEKS - 1; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today_);
      date.setDate(today_.getDate() - (w * 7 + (6 - d)));
      const key = fmtDate(date.toISOString());
      cells.push({ date: key, count: countByDate[key] || 0 });
    }
  }

  const maxCount = Math.max(1, ...Object.values(countByDate));
  const cellsHTML = cells.map(c => {
    const level = c.count === 0 ? 0 : Math.ceil(c.count / maxCount * 4);
    const colors = ['var(--bg-input)', '#1e3a5f', '#2d5a8e', '#3a7bc8', '#4a9eff'];
    return `<div title="${c.date}: ${c.count} 節"
      style="width:12px;height:12px;border-radius:2px;background:${colors[level]};cursor:default;"></div>`;
  }).join('');

  const totalCompleted = Object.values(userState.sessions).filter(s=>s.completed).length;
  const activeDays = Object.keys(countByDate).length;

  area.innerHTML = `
    <div class="card" style="margin-bottom:16px;">
      <div style="display:flex;gap:24px;margin-bottom:14px;flex-wrap:wrap;">
        <div><div style="font-size:22px;font-weight:800;color:var(--accent-blue);">${totalCompleted}</div><div style="font-size:11px;color:var(--text-muted);">已完成節數</div></div>
        <div><div style="font-size:22px;font-weight:800;color:var(--accent-teal);">${activeDays}</div><div style="font-size:11px;color:var(--text-muted);">學習天數</div></div>
        <div><div style="font-size:22px;font-weight:800;color:var(--accent-gold);">${userState.streak?.longest||0}</div><div style="font-size:11px;color:var(--text-muted);">最長連續天數</div></div>
      </div>
      <div style="overflow-x:auto;">
        <div style="display:grid;grid-auto-flow:column;grid-template-columns:repeat(${WEEKS},12px);grid-template-rows:repeat(7,12px);gap:2px;width:fit-content;">
          ${cellsHTML}
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:11px;color:var(--text-muted);">
        <span>少</span>
        ${['var(--bg-input)','#1e3a5f','#2d5a8e','#3a7bc8','#4a9eff'].map(c=>`<div style="width:12px;height:12px;border-radius:2px;background:${c};"></div>`).join('')}
        <span>多</span>
      </div>
    </div>`;
}

function renderBadges() {
  const area = el('prog-badges');
  if (!area) return;
  const BADGES = [
    { id:'first_step',  icon:'🎯', name:'第一步',    desc:'完成任意一節' },
    { id:'week1_done',  icon:'📐', name:'微積分入門', desc:'Week 1 全部完成' },
    { id:'week6_done',  icon:'⚗️', name:'擴散達人',  desc:'Week 6 全部完成' },
    { id:'week7_done',  icon:'🗺️', name:'相圖大師',  desc:'Week 7 全部完成' },
    { id:'week9_done',  icon:'🔬', name:'熱力學入門', desc:'Week 9 全部完成' },
    { id:'stage1_done', icon:'🏅', name:'第一階段完成', desc:'S1–S64 全部完成' },
    { id:'stage2_done', icon:'🥈', name:'第二階段完成', desc:'S65–S128 全部完成' },
    { id:'stage3_done', icon:'🥇', name:'第三階段完成', desc:'S129–S192 全部完成' },
    { id:'streak_7',    icon:'🔥', name:'連續 7 天',  desc:'Streak 達 7 天' },
    { id:'streak_30',   icon:'💥', name:'連續 30 天', desc:'Streak 達 30 天' },
    { id:'s90_s91',     icon:'📉', name:'Arrhenius 達人', desc:'S90 + S91 完成' },
    { id:'finish',      icon:'🎓', name:'準備就緒',   desc:'S192 完成' },
  ];
  const unlocked = new Set(userState.achievements || []);
  area.innerHTML = `<div class="badges-grid">` + BADGES.map(b =>
    `<div class="badge-item ${unlocked.has(b.id)?'unlocked':'locked'}">
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-name">${esc(b.name)}</div>
      <div class="badge-desc">${esc(b.desc)}</div>
    </div>`
  ).join('') + `</div>`;
}

// ================================================================
// 17. SETTINGS PAGE
// ================================================================
function renderSettings() {
  const pg = el('pg-settings');
  const lang = appState.settings.lang;
  const mode = appState.settings.storageMode;

  pg.innerHTML = `
    <h2 style="font-size:18px;font-weight:800;margin-bottom:20px;">${t('settingsTitle')}</h2>

    <div class="settings-section card">
      <div class="settings-title">${t('langTitle')}</div>
      <div class="setting-row">
        <div><div class="setting-label">介面語言 / Language</div></div>
        <div class="setting-control">
          <button class="setting-btn${lang==='zh'?' active':''}" onclick="setLang('zh')">繁體中文</button>
          <button class="setting-btn${lang==='en'?' active':''}" onclick="setLang('en')">English</button>
        </div>
      </div>
    </div>

    <div class="settings-section card" style="margin-top:16px;">
      <div class="settings-title">外觀</div>
      <div class="setting-row">
        <div>
          <div class="setting-label">主題色</div>
          <div class="setting-desc">長時間閱讀數學推導可切淺色護眼</div>
        </div>
        <div class="setting-control">
          <button class="setting-btn${(userState.settings?.theme||'dark')==='dark'?' active':''}" onclick="setTheme('dark')">🌙 深色</button>
          <button class="setting-btn${userState.settings?.theme==='light'?' active':''}" onclick="setTheme('light')">☀️ 淺色</button>
        </div>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-label">閱讀字級</div>
          <div class="setting-desc">放大整體畫面（目前 ${Math.round((userState.settings?.fontScale||1)*100)}%）</div>
        </div>
        <div class="setting-control">
          <button class="setting-btn${(userState.settings?.fontScale||1)===1?' active':''}" onclick="setFontScale(1)">標準</button>
          <button class="setting-btn${(userState.settings?.fontScale||1)===1.1?' active':''}" onclick="setFontScale(1.1)">大</button>
          <button class="setting-btn${(userState.settings?.fontScale||1)===1.25?' active':''}" onclick="setFontScale(1.25)">特大</button>
        </div>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-label">每日讀書提醒</div>
          <div class="setting-desc">App 開著時，到設定時間若今天還沒讀書會提醒你</div>
        </div>
        <div class="setting-control">
          <input type="time" value="${userState.settings?.reminder?.time||'20:00'}"
            onchange="setReminder(true,this.value)"
            style="background:var(--bg-input);border:1px solid var(--border);border-radius:6px;padding:6px 8px;color:var(--text-primary);font-size:13px;">
          <button class="setting-btn${userState.settings?.reminder?.enabled?' active':''}"
            onclick="setReminder(${!userState.settings?.reminder?.enabled})">${userState.settings?.reminder?.enabled?'已開':'開啟'}</button>
        </div>
      </div>
    </div>

    <div class="settings-section card" style="margin-top:16px;">
      <div class="settings-title">${t('storageModeTitle')}</div>
      <div class="setting-row">
        <div>
          <div class="setting-label">${t('storage_memory')}</div>
          <div class="setting-desc">重整頁面後清空，適合預覽</div>
        </div>
        <div class="setting-control">
          <button class="setting-btn${mode==='memory'?' active':''}" onclick="setStorageMode('memory')">選擇</button>
        </div>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-label">${t('storage_local')}</div>
          <div class="setting-desc">儲存在瀏覽器 localStorage</div>
        </div>
        <div class="setting-control">
          <button class="setting-btn${mode==='local'?' active':''}" onclick="setStorageMode('local')">選擇</button>
        </div>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-label">${t('storage_drive')}</div>
          <div class="setting-desc">${DriveStore.connected()?'<span style="color:var(--accent-green)">✓ 已連接並自動同步</span>':'自動備份到你的 Google Drive'}</div>
        </div>
        <div class="setting-control">
          <button class="setting-btn${mode==='drive'?' active':''}" onclick="setStorageMode('drive')">選擇</button>
        </div>
      </div>
    </div>

    <div class="settings-section card" style="margin-top:16px;">
      <div class="settings-title">🔗 Google Drive 同步設定</div>
      <div id="drive-cfg-inner">${DriveStore.configHtml()}</div>
    </div>

    <div class="settings-section card" style="margin-top:16px;">
      <div class="settings-title">資料管理</div>
      <div class="setting-row">
        <div>
          <div class="setting-label">${t('exportJSON')}</div>
          <div class="setting-desc">下載完整學習記錄（JSON 備份）</div>
        </div>
        <div class="setting-control">
          <button class="export-btn" onclick="exportJSON()">⬇ 匯出</button>
        </div>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-label">${t('importJSON')}</div>
          <div class="setting-desc">從備份檔案還原記錄</div>
        </div>
        <div class="setting-control">
          <button class="export-btn" style="background:var(--bg-card);color:var(--text-secondary);border:1px solid var(--border);" onclick="triggerImport()">⬆ 匯入</button>
          <input type="file" id="import-file" accept=".json" style="display:none" onchange="importJSON(this)">
        </div>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-label" style="color:var(--accent-red);">清除所有記錄</div>
          <div class="setting-desc">⚠ 此操作無法復原</div>
        </div>
        <div class="setting-control">
          <button class="setting-btn" style="color:var(--accent-red);" onclick="clearAllData()">清除</button>
        </div>
      </div>
    </div>

    <!-- U16: weekly goal + U19: school date + U21: notifications -->
    <div class="settings-section card" style="margin-top:16px;">
      <div class="settings-title">學習目標 & 提醒</div>
      <div class="setting-row">
        <div>
          <div class="setting-label">每週目標節數</div>
          <div class="setting-desc">儀表板進度條依此計算</div>
        </div>
        <div class="setting-control">
          <input type="number" min="1" max="30" value="${userState.settings?.weeklyGoal||12}"
            onchange="setWeeklyGoal(parseInt(this.value))"
            style="width:60px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm);padding:6px 8px;color:var(--text-primary);font-size:13px;text-align:center;">
        </div>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-label">開學日期</div>
          <div class="setting-desc">用於倒數計時與進度警示</div>
        </div>
        <div class="setting-control">
          <input type="date" value="${userState.settings?.schoolDate||''}"
            onchange="setSchoolDate(this.value)"
            style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm);padding:6px 8px;color:var(--text-primary);font-size:13px;">
        </div>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-label">瀏覽器提醒通知</div>
          <div class="setting-desc">需要瀏覽器授權</div>
        </div>
        <div class="setting-control">
          <button class="setting-btn" onclick="requestNotifPermission()">
            ${'Notification' in window && Notification.permission === 'granted' ? '✓ 已授權' : '申請授權'}
          </button>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="settings-title">關於</div>
      <p style="font-size:13px;color:var(--text-muted);line-height:1.8;">
        FoundationLearn v1.0 — 三個月入學前補底計劃追蹤 App<br>
        192 節 × 45 分鐘 = 144 小時<br>
        純前端，離線可用（需本機伺服器）<br>
        <span style="color:var(--text-muted);">開發者：梁鍵琨 · 中興材料所 115 入學</span>
      </p>
    </div>`;
}

function setLang(lang) {
  flog('UI', `setLang: ${appState.settings.lang} → ${lang}`);
  appState.settings.lang = lang;
  userState.settings.lang = lang;
  save();
  document.getElementById('lang-toggle').textContent = lang === 'zh' ? 'EN' : '中';
  updateNavI18n();
  navigate(appState.currentPage);
}

// #11 外觀偏好：淺/深色主題 + 閱讀字級（用 #main zoom 整體縮放）
function applyUiPrefs() {
  const theme = userState.settings?.theme || 'dark';
  document.body.classList.toggle('theme-light', theme === 'light');
  const scale = userState.settings?.fontScale || 1;
  const main = el('main');
  if (main) main.style.zoom = String(scale);
}
function setTheme(theme) {
  userState.settings = userState.settings || {};
  userState.settings.theme = theme;
  appState.settings.theme = theme;
  applyUiPrefs();
  save();
  flog('UI', `setTheme: ${theme}`);
  if (appState.currentPage === 'pg-settings') renderSettings();
}
function setFontScale(scale) {
  userState.settings = userState.settings || {};
  userState.settings.fontScale = scale;
  applyUiPrefs();
  save();
  flog('UI', `setFontScale: ${scale}`);
  if (appState.currentPage === 'pg-settings') renderSettings();
}

function setStorageMode(mode) {
  flog('STORAGE', `setStorageMode: ${appState.settings.storageMode} → ${mode}`);
  userState.settings.storageMode = mode;
  appState.settings.storageMode  = mode;
  if (mode === 'memory') appState.storage = MemoryStore;
  else if (mode === 'drive') appState.storage = DriveStore;
  else appState.storage = LocalStore;
  // 只寫本機保存「選擇」——絕不在此處推送，避免空白狀態覆蓋 Drive
  LocalStore.save(userState);
  if (mode === 'drive') {
    if (DriveStore.connected()) {
      driveSync();   // 立即合併，不覆蓋
    } else {
      showToast('已選 Google Drive；請按下方「連接 Google Drive」完成授權與合併', 'info', 5000);
    }
  } else {
    showToast(`儲存方式已切換為：${mode}`, 'info');
  }
  renderSettings();
}

function driveSaveClientId() {
  const input = document.getElementById('drive-cid-input');
  if (!input) return;
  const id = input.value.trim();
  if (!id) { showToast('請輸入 Client ID', 'warn'); return; }
  DriveStore.setClientId(id);
  flog('STORAGE', 'driveSaveClientId: saved');
  showToast('✓ Client ID 已儲存，請按「連接 Google Drive」授權', 'success');
  const saveBtn = document.getElementById('drive-cid-save');
  if (saveBtn) saveBtn.style.opacity = '0.5';
  const inner = document.getElementById('drive-cfg-inner');
  if (inner) inner.innerHTML = DriveStore.configHtml();
}

async function driveConnect() {
  try {
    await DriveStore.connect();
    // 連接後一律「合併」Drive 與本機進度（雙向都不弄丟），並自動採用 drive 模式
    showToast('正在與 Google Drive 合併進度…', 'info');
    const merged = await DriveStore.load();        // load() 現在會合併並寫回 Drive
    userState = merged;
    appState.settings.storageMode = 'drive';
    userState.settings = userState.settings || {};
    userState.settings.storageMode = 'drive';
    appState.storage = DriveStore;
    LocalStore.save(userState);
    flog('STORAGE', 'driveConnect: merged & adopted drive mode', {
      done: Object.values(userState.sessions || {}).filter(v => v.completed).length
    });
    showToast('✓ 已連接並合併進度（不會覆蓋任何一邊的紀錄）', 'success', 4000);
    if (appState.currentPage) navigate(appState.currentPage); // 讓合併後的進度立即顯示
    renderSettings();
  } catch(e) {
    flogErr('STORAGE', 'driveConnect failed', e);
    showToast('連接失敗：' + (e.message || '未知錯誤'), 'error', 5000);
    renderSettings();
  }
}

function driveDisconnect() {
  DriveStore.disconnect();
  renderSettings();
}

async function driveSync() {
  if (!DriveStore.connected()) { showToast('請先連接 Google Drive', 'warn'); return; }
  try {
    showToast('⟳ 合併同步中…', 'info');
    userState = await DriveStore.load();   // 合併 Drive 與本機
    showToast('✓ 同步完成（已合併兩邊進度）', 'success');
    if (appState.currentPage) navigate(appState.currentPage); // 立即反映合併結果
    renderSettings();
  } catch(e) {
    flogErr('STORAGE', 'driveSync failed', e);
    showToast('同步失敗：' + (e.message || ''), 'error', 5000);
  }
}

function exportJSON() {
  flog('STORAGE', 'exportJSON: user triggered export', { sessions: Object.keys(userState.sessions).length });
  const d = new Date().toISOString().slice(0,10);
  const blob = new Blob([JSON.stringify(userState, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `fl_backup_${d}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(t('exportDone'), 'success');
}

function triggerImport() { el('import-file')?.click(); }

function importJSON(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.sessions) throw new Error('missing sessions key');
      userState = { ...defaultUserState(), ...data };
      appState.settings.lang = userState.settings?.lang || 'zh';
      appState.settings.storageMode = userState.settings?.storageMode || 'local';
      save();
      flog('STORAGE', 'importJSON: success', { sessions: Object.keys(data.sessions).length });
      showToast(t('importSuccess'), 'success');
      navigate('pg-dashboard');
    } catch (err) {
      flogErr('STORAGE', `importJSON: FAILED — ${err.message}`, err);
      showToast(t('importFail'), 'error');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

function setWeeklyGoal(n) {
  if (!n || n < 1) return;
  userState.settings = userState.settings || {};
  userState.settings.weeklyGoal = n;
  save();
  showToast(`每週目標設定為 ${n} 節`, 'success');
}

function setSchoolDate(val) {
  userState.settings = userState.settings || {};
  userState.settings.schoolDate = val;
  save();
  if (val) {
    const d = Math.ceil((new Date(val) - new Date()) / 86400000);
    showToast(`開學日設定：距今 ${d} 天`, 'success');
  }
}

// U21: browser notifications
function requestNotifPermission() {
  if (!('Notification' in window)) { showToast('此瀏覽器不支援通知', 'error'); return; }
  Notification.requestPermission().then(p => {
    if (p === 'granted') {
      showToast('✓ 通知已授權', 'success');
      new Notification('FoundationLearn', { body: '通知功能已開啟！今天記得讀書 📚', icon: '' });
    } else {
      showToast('通知未授權，請在瀏覽器設定中允許', 'warn');
    }
    renderSettings();
  });
}

function clearAllData() {
  if (!confirm('確定要清除所有學習記錄嗎？此操作無法復原。')) return;
  userState = defaultUserState();
  appState.storage.save(userState);
  showToast('✓ 已清除所有記錄', 'warn');
  navigate('pg-dashboard');
}

// ================================================================
// 18. NAV i18n UPDATE
// ================================================================
function updateNavI18n() {
  qsa('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (I18N[appState.settings.lang]?.[key]) el.textContent = t(key);
  });
}

// ================================================================
// 19. INIT
// ================================================================
async function initApp() {
  // Setup storage
  const savedMode = LocalStore.load().settings?.storageMode || 'local';
  appState.settings.storageMode = savedMode;
  if (savedMode === 'memory') appState.storage = MemoryStore;
  else if (savedMode === 'drive') appState.storage = DriveStore;
  else appState.storage = LocalStore;

  // Drive mode: try async load (gracefully falls back to LocalStore if not connected)
  userState = (savedMode === 'drive')
    ? (await DriveStore.load())
    : appState.storage.load();
  appState.settings.lang = userState.settings?.lang || 'zh';

  // #11 套用外觀偏好（主題 + 字級）
  applyUiPrefs();
  // #9 番茄鐘 + #18 每日提醒
  FL_POMO.init();
  applyDailyReminder();

  // Language toggle
  const langBtn = el('lang-toggle');
  if (langBtn) {
    langBtn.textContent = appState.settings.lang === 'zh' ? 'EN' : '中';
    langBtn.addEventListener('click', () => {
      setLang(appState.settings.lang === 'zh' ? 'en' : 'zh');
    });
  }

  // Nav buttons
  qsa('.nav-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });

  // Load manifest
  flog('UI', 'initApp: starting', { mode: savedMode, lang: appState.settings.lang });
  const ok = await loadManifest();
  if (!ok) return;

  hideLoader();
  flog('UI', 'initApp: ready', { sessions: appState.manifest?.meta?.totalSessions });

  // U12: focus mode — press F to toggle nav
  document.addEventListener('keydown', e => {
    if (e.key === 'f' || e.key === 'F') {
      if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
      const nav = el('nav');
      const isHidden = nav.style.display === 'none';
      nav.style.display = isHidden ? '' : 'none';
      el('main').style.marginTop = isHidden ? 'var(--nav-h)' : '8px';
      showToast(isHidden ? '專注模式：關閉' : '專注模式：按 F 退出', 'info', 2000);
    }
    // lesson keyboard nav (only when in lesson page)
    if (appState.currentPage === 'pg-lesson') {
      if (e.key === 'ArrowRight' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
        qs('.lesson-nav-btn:not([disabled]):last-of-type')?.click();
      }
      if (e.key === 'ArrowLeft' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
        qs('.lesson-nav-btn:not([disabled]):first-of-type')?.click();
      }
    }
  });

  // Handle initial hash
  const hash = window.location.hash.replace('#', '');
  if (hash && el(hash)) {
    navigate(hash);
  } else {
    navigate('pg-dashboard');
  }
}

// U30: Offline detection banner
window.addEventListener('offline', () => {
  let banner = el('offline-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'offline-banner';
    banner.style.cssText = 'position:fixed;top:var(--nav-h);left:0;right:0;z-index:2000;background:#f5c842;color:#1a1d26;text-align:center;padding:7px 16px;font-size:13px;font-weight:600;';
    banner.textContent = '⚠ 目前離線 — Chart.js / KaTeX 需要網路連線。建議下載本地庫放入 lib/ 資料夾。';
    document.body.appendChild(banner);
  }
  banner.style.display = 'block';
});
window.addEventListener('online', () => {
  const b = el('offline-banner');
  if (b) b.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', initApp);
