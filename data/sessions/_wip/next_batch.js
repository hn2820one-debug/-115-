// next_batch.js — 自動續建隊列助手。
// 以 assemble_w3.js 嘅 DIMS 為單一真相，掃 data/sessions/ 已建 JSON，算出下一批未建課堂，
// 印出可直接貼入 wf_build_session.js 嘅 SESSIONS 陣列。tier/cognition/extension/platform 全部由 DIMS 嚟，唔會同 assemble 失同步。
// 用法：node next_batch.js [batchSize=5]
const fs = require('fs');
const path = require('path');
const WIP = __dirname;
const SESSIONS_DIR = path.join(__dirname, '..');

// 由 assemble_w3.js 抽 DIMS 物件文字（純資料，eval 安全；唔 require 以免觸發 build）
const src = fs.readFileSync(path.join(WIP, 'assemble_w3.js'), 'utf8');
const objStart = src.indexOf('{', src.indexOf('const DIMS = {'));
const objEnd = src.indexOf('\n};', objStart);
const DIMS = eval('(' + src.slice(objStart, objEnd + 2) + ')');

// 已建：data/sessions/S*.json
const built = new Set(
  fs.readdirSync(SESSIONS_DIR)
    .filter(f => /^S\d+[A-Z]?\.json$/.test(f))
    .map(f => f.replace('.json', ''))
);

// 有 DIMS 但未建（跳過 *B 對照樣本），按 order 排
const pending = Object.keys(DIMS)
  .filter(id => !built.has(id) && !/B$/.test(id))
  .sort((a, b) => DIMS[a].order - DIMS[b].order);

const N = parseInt(process.argv[2] || '5', 10);
const batch = pending.slice(0, N);

console.log(`已建 ${built.size} 節；DIMS 內待建 ${pending.length} 節。`);
if (!batch.length) { console.log('★ 冇待建課堂——隊列已清空，可停止 loop。'); process.exit(0); }
console.log(`下一批 ${batch.length} 節：${batch.join(' ')}\n`);
console.log('const SESSIONS = [');
for (const id of batch) {
  const d = DIMS[id];
  console.log(`  { id: '${id}', title: '${d.title}', tier: '${d.tier}', cognition: '${d.cognition}', extension: '${d.extension}', platform: '${d.platform}' },`);
}
console.log(']');
console.log('\n剩餘隊列：' + pending.join(' '));
