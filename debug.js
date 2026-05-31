/* ================================================================
   FoundationLearn — debug.js
   六類 Debug Logger + 懸浮控制面板
   ─────────────────────────────────────────────────────────────────
   使用方式：
     flog('UI',      '訊息', 可選資料物件)
     flog('CONTENT', '訊息')
     flog('QUIZ',    '訊息', { sessionId, qi })
     flog('RECORD',  '訊息')
     flog('STORAGE', '訊息')
     flog('ERROR',   '訊息', errorObject)

   快捷鍵：Ctrl + Shift + D  開關 Debug 面板
   ================================================================ */

'use strict';

// ── 1. 分類定義 ──────────────────────────────────────────────────
const FL_CATS = {
  UI:      { zh: '介面',   color: '#4a9eff', bg: 'rgba(74,158,255,0.12)',  enabled: true },
  CONTENT: { zh: '內容',   color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)',  enabled: true },
  QUIZ:    { zh: '題目',   color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', enabled: true },
  RECORD:  { zh: '記錄',   color: '#f5c842', bg: 'rgba(245,200,66,0.12)',  enabled: true },
  STORAGE: { zh: '儲存',   color: '#4caf6e', bg: 'rgba(76,175,110,0.12)', enabled: true },
  ERROR:   { zh: '錯誤',   color: '#f06060', bg: 'rgba(240,96,96,0.15)',  enabled: true },
};

// ── 2. 核心 Log Buffer ────────────────────────────────────────────
const FL_LOG = {
  _buf: [],       // { id, ts, cat, level, msg, data, stack? }
  _maxBuf: 2000,
  _id: 0,
  _panel: null,
  _paused: false,
  _sessionStart: new Date().toISOString(),

  push(cat, msg, data, level = 'INFO') {
    if (this._paused) return;
    const entry = {
      id:    ++this._id,
      ts:    new Date().toISOString(),
      tsMs:  Date.now(),
      cat:   cat.toUpperCase(),
      level,
      msg:   String(msg),
      data:  data !== undefined ? _safeClone(data) : null,
      page:  typeof appState !== 'undefined' ? (appState.currentPage || '?') : '?',
    };
    if (level === 'ERROR' && data instanceof Error) entry.stack = data.stack;
    this._buf.push(entry);
    if (this._buf.length > this._maxBuf) this._buf.shift();

    // Browser console — color-coded
    const cat_ = FL_CATS[entry.cat] || { color: '#888' };
    const prefix = `%c[FL:${entry.cat}]`;
    const style  = `color:${cat_.color};font-weight:700;font-size:11px;`;
    if (level === 'ERROR')
      console.error(prefix + ` ${msg}`, style, data ?? '');
    else if (level === 'WARN')
      console.warn(prefix  + ` ${msg}`, style, data ?? '');
    else
      console.log(prefix   + ` ${msg}`, style, data ?? '');

    this._appendRow(entry);
  },

  // ── Panel append (called every push) ──
  _appendRow(e) {
    const panel = this._panel;
    if (!panel || !panel._open) return;
    const cat_ = FL_CATS[e.cat] || { color: '#888', bg: 'transparent', zh: e.cat };
    if (!cat_.enabled) return;
    const stream = panel.querySelector('#fl-log-stream');
    if (!stream) return;

    const row = document.createElement('div');
    row.className = 'fl-row';
    row.dataset.cat = e.cat;
    row.style.cssText = `border-left:3px solid ${cat_.color};background:${cat_.bg};
      padding:4px 8px;margin-bottom:2px;border-radius:3px;font-size:11px;
      display:flex;gap:8px;align-items:flex-start;cursor:pointer;`;

    const t = e.ts.slice(11, 19);
    row.innerHTML = `
      <span style="color:${cat_.color};font-weight:700;min-width:52px;">${e.cat}</span>
      <span style="color:#5a6278;font-size:10px;min-width:60px;">${t}</span>
      <span style="color:#8b93a8;font-size:10px;min-width:60px;">${e.page}</span>
      <span style="flex:1;color:#e4e8f0;word-break:break-all;">${_escHtml(e.msg)}</span>
      ${e.data ? `<span style="color:#5a6278;font-size:10px;">▶</span>` : ''}`;

    if (e.data) {
      row.addEventListener('click', () => {
        const existing = row.querySelector('.fl-detail');
        if (existing) { existing.remove(); return; }
        const detail = document.createElement('div');
        detail.className = 'fl-detail';
        detail.style.cssText = 'margin-top:4px;padding:6px;background:#0d1117;border-radius:3px;font-size:10px;color:#8b93a8;white-space:pre-wrap;word-break:break-all;max-height:200px;overflow-y:auto;';
        detail.textContent = JSON.stringify(e.data, null, 2);
        row.appendChild(detail);
      });
    }

    const autoScroll = stream.scrollTop + stream.clientHeight >= stream.scrollHeight - 20;
    stream.appendChild(row);
    if (autoScroll) stream.scrollTop = stream.scrollHeight;

    // Update counter badge
    _updateBadge();
  },

  clear() {
    this._buf = [];
    this._id  = 0;
    const s = this._panel?.querySelector('#fl-log-stream');
    if (s) s.innerHTML = '';
    _updateBadge();
  },

  exportJSON() {
    const blob = new Blob([JSON.stringify({
      exportedAt: new Date().toISOString(),
      sessionStart: this._sessionStart,
      appVersion: '1.0',
      entries: this._buf
    }, null, 2)], { type: 'application/json' });
    _dl(blob, `fl_debug_${_tsFile()}.json`);
  },

  exportReport() {
    const lines = [];
    lines.push('FoundationLearn Debug Report');
    lines.push('═'.repeat(50));
    lines.push(`Session Start : ${this._sessionStart}`);
    lines.push(`Export Time   : ${new Date().toISOString()}`);
    lines.push(`Total Entries : ${this._buf.length}`);
    lines.push('');

    // Category summary
    lines.push('Category Summary');
    lines.push('─'.repeat(30));
    for (const [cat, def] of Object.entries(FL_CATS)) {
      const n = this._buf.filter(e => e.cat === cat).length;
      lines.push(`  ${cat.padEnd(8)} (${def.zh}) : ${n} entries`);
    }
    lines.push('');

    // Error list
    const errors = this._buf.filter(e => e.cat === 'ERROR');
    if (errors.length) {
      lines.push('Errors');
      lines.push('─'.repeat(30));
      errors.forEach(e => {
        lines.push(`  [${e.ts.slice(11,19)}] ${e.msg}`);
        if (e.stack) lines.push(`    ${e.stack.split('\n')[1]?.trim() || ''}`);
      });
      lines.push('');
    }

    // Quiz accuracy
    const quizAnswers = this._buf.filter(e => e.cat === 'QUIZ' && e.msg.startsWith('answer:'));
    if (quizAnswers.length) {
      const correct = quizAnswers.filter(e => e.data?.correct).length;
      lines.push('Quiz Performance');
      lines.push('─'.repeat(30));
      lines.push(`  Answered : ${quizAnswers.length}`);
      lines.push(`  Correct  : ${correct}`);
      lines.push(`  Accuracy : ${quizAnswers.length ? Math.round(correct/quizAnswers.length*100) + '%' : '—'}`);
      lines.push('');
    }

    // Session completions
    const completions = this._buf.filter(e => e.cat === 'RECORD' && e.msg.startsWith('complete:'));
    if (completions.length) {
      lines.push('Sessions Completed This Run');
      lines.push('─'.repeat(30));
      completions.forEach(e => lines.push(`  [${e.ts.slice(11,19)}] ${e.data?.id || e.msg}`));
      lines.push('');
    }

    // Full log
    lines.push('Full Log');
    lines.push('─'.repeat(50));
    this._buf.forEach(e => {
      const dataStr = e.data ? '  » ' + JSON.stringify(e.data).slice(0, 120) : '';
      lines.push(`[${e.ts.slice(11,23)}] [${e.cat.padEnd(7)}] [${e.level.padEnd(5)}] ${e.msg}${dataStr}`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    _dl(blob, `fl_report_${_tsFile()}.txt`);
  },

  copyToClipboard() {
    const text = this._buf.map(e =>
      `[${e.ts.slice(11,23)}][${e.cat}][${e.level}] ${e.msg}${e.data ? ' '+JSON.stringify(e.data) : ''}`
    ).join('\n');
    navigator.clipboard?.writeText(text)
      .then(() => _toast('📋 已複製 ' + this._buf.length + ' 條 log'))
      .catch(() => _toast('❌ 複製失敗，請用下載'));
  },
};

// ── 3. Public API ─────────────────────────────────────────────────
function flog(cat, msg, data) {
  const c = cat.toUpperCase();
  if (!FL_CATS[c]) { FL_LOG.push('ERROR', `flog: unknown category "${cat}"`, { cat, msg }); return; }
  FL_LOG.push(c, msg, data);
}
function flogWarn(cat, msg, data) { FL_LOG.push(cat.toUpperCase(), msg, data, 'WARN'); }
function flogErr(cat, msg, data)  { FL_LOG.push('ERROR', msg, data, 'ERROR'); }

// Make global
window.flog     = flog;
window.flogWarn = flogWarn;
window.flogErr  = flogErr;
window.FL_LOG   = FL_LOG;

// ── 4. Error Interception ─────────────────────────────────────────
window.addEventListener('error', e => {
  FL_LOG.push('ERROR', `JS Error: ${e.message}`, {
    file: e.filename?.replace(/.*foundationlearn\//, '') || '?',
    line: e.lineno, col: e.colno,
    stack: e.error?.stack || ''
  }, 'ERROR');
});

window.addEventListener('unhandledrejection', e => {
  FL_LOG.push('ERROR', `Promise rejected: ${e.reason?.message || e.reason}`, {
    reason: String(e.reason)
  }, 'ERROR');
});

// ── 5. Debug Panel UI ─────────────────────────────────────────────
function _buildPanel() {
  const panel = document.createElement('div');
  panel._open = false;
  FL_LOG._panel = panel;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #fl-btn {
      position:fixed; bottom:80px; right:16px; z-index:9500;
      width:44px; height:44px; border-radius:50%;
      background:#1a1d26; border:2px solid #3a4160;
      font-size:20px; cursor:pointer; display:flex;
      align-items:center; justify-content:center;
      box-shadow:0 2px 12px rgba(0,0,0,0.5);
      transition:transform 0.2s,border-color 0.2s;
      user-select:none;
    }
    #fl-btn:hover { transform:scale(1.1); border-color:#4a9eff; }
    #fl-btn.active { border-color:#f5c842; background:#252930; }
    #fl-badge {
      position:absolute; top:-4px; right:-4px;
      background:#f06060; color:#fff;
      border-radius:10px; font-size:9px; font-weight:700;
      padding:1px 5px; min-width:16px; text-align:center;
      display:none; line-height:16px;
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
    }
    #fl-panel {
      position:fixed; bottom:132px; right:16px; z-index:9499;
      width:680px; max-width:calc(100vw - 32px);
      height:520px; max-height:calc(100vh - 160px);
      background:#14171e; border:1px solid #2e3447;
      border-radius:12px; box-shadow:0 8px 40px rgba(0,0,0,0.7);
      display:none; flex-direction:column;
      font-family:-apple-system,"Noto Sans TC",sans-serif;
      overflow:hidden; resize:both;
    }
    #fl-panel.open { display:flex; }
    #fl-header {
      background:#1a1d26; border-bottom:1px solid #2e3447;
      padding:10px 14px; display:flex; align-items:center; gap:10px;
      flex-shrink:0;
    }
    #fl-title { font-size:13px; font-weight:700; color:#e4e8f0; flex:1; }
    #fl-stats { font-size:10px; color:#5a6278; }
    #fl-close {
      background:none; border:none; color:#5a6278; font-size:18px;
      cursor:pointer; padding:0 4px; line-height:1;
    }
    #fl-close:hover { color:#f06060; }
    #fl-cats {
      padding:8px 12px; display:flex; gap:6px; flex-wrap:wrap;
      border-bottom:1px solid #1f2330; flex-shrink:0; background:#1a1d26;
    }
    .fl-cat-btn {
      padding:3px 10px; border-radius:12px; font-size:11px;
      font-weight:600; cursor:pointer; border:1px solid transparent;
      transition:opacity 0.15s, background 0.15s;
    }
    .fl-cat-btn.off { opacity:0.3; }
    #fl-toolbar {
      padding:6px 12px; display:flex; gap:6px; align-items:center;
      flex-shrink:0; border-bottom:1px solid #1f2330;
    }
    .fl-tool-btn {
      padding:4px 10px; border-radius:6px; font-size:11px;
      background:#1f2330; border:1px solid #2e3447; color:#8b93a8;
      cursor:pointer; transition:all 0.15s;
    }
    .fl-tool-btn:hover { border-color:#4a9eff; color:#4a9eff; }
    .fl-tool-btn.danger:hover { border-color:#f06060; color:#f06060; }
    #fl-search {
      flex:1; background:#1f2330; border:1px solid #2e3447;
      border-radius:6px; padding:4px 8px; font-size:11px;
      color:#e4e8f0;
    }
    #fl-search:focus { outline:none; border-color:#4a9eff; }
    #fl-log-stream {
      flex:1; overflow-y:auto; padding:8px 10px;
      background:#14171e; font-family:"Fira Code",monospace;
    }
    #fl-log-stream::-webkit-scrollbar { width:5px; }
    #fl-log-stream::-webkit-scrollbar-track { background:#14171e; }
    #fl-log-stream::-webkit-scrollbar-thumb { background:#2e3447; border-radius:3px; }
    #fl-pause-btn.paused { color:#f5c842; border-color:rgba(245,200,66,0.3); }
    #fl-footer {
      padding:6px 12px; display:flex; gap:8px; align-items:center;
      border-top:1px solid #1f2330; flex-shrink:0; font-size:10px;
      color:#5a6278; background:#1a1d26;
    }
    #fl-count { margin-left:auto; }
    #fl-shortcut { color:#3a4160; font-size:10px; }
  `;
  document.head.appendChild(style);

  // Floating button
  const btn = document.createElement('button');
  btn.id = 'fl-btn';
  btn.title = 'Debug Panel (Ctrl+Shift+D)';
  btn.innerHTML = '🐛<span id="fl-badge"></span>';
  btn.addEventListener('click', _togglePanel);
  document.body.appendChild(btn);

  // Panel
  panel.id = 'fl-panel';

  // Category buttons HTML
  const catBtns = Object.entries(FL_CATS).map(([k, v]) =>
    `<button class="fl-cat-btn" data-cat="${k}"
      style="color:${v.color};background:${v.bg};border-color:${v.color}30;"
      onclick="FL_LOG._toggleCat('${k}',this)">${v.zh} (${k})</button>`
  ).join('');

  panel.innerHTML = `
    <div id="fl-header">
      <span id="fl-title">🐛 FoundationLearn Debug</span>
      <span id="fl-stats"></span>
      <button class="fl-tool-btn" id="fl-pause-btn" onclick="FL_LOG._togglePause(this)" title="暫停/恢復記錄">⏸ 暫停</button>
      <button id="fl-close" onclick="FL_LOG._panel._close()" title="關閉">×</button>
    </div>
    <div id="fl-cats">${catBtns}</div>
    <div id="fl-toolbar">
      <input id="fl-search" placeholder="🔍 搜尋 log 訊息…" oninput="FL_LOG._filterRows(this.value)">
      <button class="fl-tool-btn" onclick="FL_LOG.copyToClipboard()" title="複製全部到剪貼板">📋 複製</button>
      <button class="fl-tool-btn" onclick="FL_LOG.exportJSON()" title="下載完整 JSON">⬇ JSON</button>
      <button class="fl-tool-btn" onclick="FL_LOG.exportReport()" title="下載可讀報告 .txt">📄 報告</button>
      <button class="fl-tool-btn danger" onclick="FL_LOG.clear()" title="清除所有 log">🗑 清除</button>
    </div>
    <div id="fl-log-stream"></div>
    <div id="fl-footer">
      <span>分類顏色：${Object.entries(FL_CATS).map(([k,v])=>`<span style="color:${v.color}">■</span>${v.zh}`).join('  ')}</span>
      <span id="fl-count">0 條</span>
      <span id="fl-shortcut">Ctrl+Shift+D 開關</span>
    </div>`;

  // Close method
  panel._close = () => { panel.classList.remove('open'); panel._open = false; document.getElementById('fl-btn')?.classList.remove('active'); };

  document.body.appendChild(panel);

  // Replay existing buffer into stream
  FL_LOG._buf.forEach(e => FL_LOG._appendRow(e));

  return panel;
}

// ── Toggle cat filter ──
FL_LOG._toggleCat = function(cat, btn) {
  FL_CATS[cat].enabled = !FL_CATS[cat].enabled;
  btn.classList.toggle('off', !FL_CATS[cat].enabled);
  this._filterRows(document.getElementById('fl-search')?.value || '');
};

// ── Pause / Resume ──
FL_LOG._togglePause = function(btn) {
  this._paused = !this._paused;
  btn.classList.toggle('paused', this._paused);
  btn.textContent = this._paused ? '▶ 繼續' : '⏸ 暫停';
  _toast(this._paused ? '⏸ Debug 記錄已暫停' : '▶ Debug 記錄恢復');
};

// ── Text search filter ──
FL_LOG._filterRows = function(query) {
  const q = (query || '').toLowerCase();
  const stream = document.getElementById('fl-log-stream');
  if (!stream) return;
  stream.querySelectorAll('.fl-row').forEach(row => {
    const cat = row.dataset.cat;
    const catEnabled = FL_CATS[cat]?.enabled !== false;
    const textMatch = !q || row.textContent.toLowerCase().includes(q);
    row.style.display = catEnabled && textMatch ? '' : 'none';
  });
};

// ── Toggle panel open/close ──
function _togglePanel() {
  const panel = FL_LOG._panel || _buildPanel();
  const btn = document.getElementById('fl-btn');
  panel._open = !panel._open;
  panel.classList.toggle('open', panel._open);
  btn.classList.toggle('active', panel._open);
  if (panel._open) {
    _updateStats();
    panel.querySelector('#fl-log-stream').scrollTop = 99999;
  }
}

function _updateBadge() {
  const badge = document.getElementById('fl-badge');
  if (!badge) return;
  const errCount = FL_LOG._buf.filter(e => e.cat === 'ERROR').length;
  badge.textContent = errCount > 0 ? (errCount > 99 ? '99+' : errCount) : FL_LOG._buf.length > 0 ? FL_LOG._buf.length : '';
  badge.style.display = errCount > 0 ? 'block' : (FL_LOG._buf.length > 0 ? 'block' : 'none');
  badge.style.background = errCount > 0 ? '#f06060' : '#4a9eff';
  _updateStats();
}

function _updateStats() {
  const stats = document.getElementById('fl-stats');
  if (!stats) return;
  const total = FL_LOG._buf.length;
  const errs  = FL_LOG._buf.filter(e => e.cat === 'ERROR').length;
  const warns = FL_LOG._buf.filter(e => e.level === 'WARN').length;
  stats.innerHTML = `<span style="color:#5a6278">${total} 條</span>${errs ? ` <span style="color:#f06060">❌${errs}錯誤</span>` : ''}${warns ? ` <span style="color:#f5c842">⚠${warns}警告</span>` : ''}`;
  const cnt = document.getElementById('fl-count');
  if (cnt) cnt.textContent = `共 ${total} 條`;
}

// ── Keyboard shortcut: Ctrl+Shift+D ──
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
    e.preventDefault();
    if (!FL_LOG._panel) _buildPanel();
    _togglePanel();
  }
});

// ── Helpers ──────────────────────────────────────────────────────
function _escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function _safeClone(obj) {
  try { return JSON.parse(JSON.stringify(obj)); } catch { return String(obj); }
}
function _dl(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
function _tsFile() {
  return new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
}
function _toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show info';
  clearTimeout(t._dt);
  t._dt = setTimeout(() => t.classList.remove('show'), 3000);
}

// ── 6. Init log ──────────────────────────────────────────────────
flog('UI', 'debug.js loaded', {
  time: new Date().toISOString(),
  ua:   navigator.userAgent.slice(0, 80),
  tip:  'Ctrl+Shift+D to open panel'
});
