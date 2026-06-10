// 同步 manifest.sessionMeta[id].isCore ← data/sessions/{id}.json 的 isCore（只改有建好 JSON 的節）
// 用法：node sync_manifest.js
const fs = require('fs');
const path = require('path');
const SESS = __dirname.replace(/\\_wip$/, '').replace(/\/_wip$/, ''); // data/sessions
const DATA = path.join(SESS, '..');                                   // data
const mPath = path.join(DATA, 'manifest.json');
const m = JSON.parse(fs.readFileSync(mPath, 'utf8'));
let changed = 0;
for (const f of fs.readdirSync(SESS)) {
  const mt = f.match(/^(S\d+)\.json$/);
  if (!mt) continue;
  const id = mt[1];
  const s = JSON.parse(fs.readFileSync(path.join(SESS, f), 'utf8'));
  if (m.sessionMeta[id] && m.sessionMeta[id].isCore !== !!s.isCore) {
    m.sessionMeta[id].isCore = !!s.isCore;
    changed++;
    console.log(`  ${id}: isCore → ${s.isCore}`);
  }
}
if (changed) fs.writeFileSync(mPath, JSON.stringify(m, null, 2));
console.log(changed ? `✅ manifest 已同步 ${changed} 節` : 'manifest 已是最新，無改動');
