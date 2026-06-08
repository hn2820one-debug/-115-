// 組裝 Week 2 模塊 A 課節 JSON：讀 _wip/{id}.content.md + {id}.meta.json + 下方 DIMS → data/sessions/{id}.json
// 用法：node assemble.js S17   （或不帶參數＝全部 S17–S20）
// 維度欄位由本檔控制（我把關），內容/quiz 由 workflow agent 產出。
const fs = require('fs');
const path = require('path');
const WIP = __dirname;
const OUT = path.join(__dirname, '..');

const DIMS = {
  S17: { order: 17, title: '多變數函數概念', titleEn: 'Multivariable Functions', platform: 'ka',
    gradImportance: 'essential', tier: 'core', cognition: 'concept', prereq: ['S2', 'S8'],
    assessWeight: 'medium', extension: 'life', gradCourse: ['general'],
    resources: [{ type: 'video', label: '（選看）Khan Academy：Multivariable functions', url: 'https://www.khanacademy.org' }],
    chatPracticeHints: ['代值對位掉轉做咗 f(y,x)', '以為 f(x,y)=f(y,x)', '固定變數時冇當佢做常數'] },
  S18: { order: 18, title: '偏微分（一）：概念', titleEn: 'Partial Derivatives I: Concept', platform: 'ka',
    gradImportance: 'essential', tier: 'core', cognition: 'concept', prereq: ['S17', 'S8', 'S7', 'S9'],
    assessWeight: 'heavy', extension: 'none', gradCourse: ['general', 'thermo'],
    resources: [{ type: 'video', label: '（選看）Khan Academy：Partial derivatives, introduction', url: 'https://www.khanacademy.org' }],
    chatPracticeHints: ['求 ∂/∂x 時連 y 都微埋', '乘喺主角嘅 y 冇當係數提出', 'eˣ 亂套冪次法則'] },
  S19: { order: 19, title: '偏微分（二）：計算', titleEn: 'Partial Derivatives II: Calculation', platform: 'paul',
    gradImportance: 'essential', tier: 'core', cognition: 'calculation', prereq: ['S18', 'S9', 'S8'],
    assessWeight: 'heavy', extension: 'none', gradCourse: ['general', 'thermo'],
    resources: [{ type: 'link', label: "（選做）Paul's Math Notes：Partial Derivatives", url: 'https://tutorial.math.lamar.edu/Classes/CalcIII/PartialDerivatives.aspx' }],
    chatPracticeHints: ['乘喺主角嘅 y³ 當咗 0', 'e^(xy) 漏乘內層偏導', '求咗 ∂x 就停漏埋 ∂y'] },
  S20: { order: 20, title: '偏微分練習', titleEn: 'Partial Derivatives Practice', platform: 'paul',
    gradImportance: 'essential', tier: 'core', cognition: 'calculation', prereq: ['S19'],
    assessWeight: 'medium', extension: 'none', gradCourse: ['general', 'thermo'],
    resources: [{ type: 'link', label: "（選做）Paul's Math Notes：Partial Derivatives（practice problems）", url: 'https://tutorial.math.lamar.edu/Classes/CalcIII/PartialDerivatives.aspx' }],
    chatPracticeHints: ['讀解漏講其他變數固定', 'e^(xy) 內層偏導當咗 1', '−e^(−t) 漏咗負負得正'] },
};

function coerceQuiz(q) {
  const o = { type: q.type, difficulty: q.difficulty || 'standard', q: String(q.q || '') };
  if (q.type === 'single') { o.options = (q.options || []).map(String); o.answer = Number(q.answer); }
  else if (q.type === 'truefalse') { o.answer = (q.answer === true || q.answer === 'true'); }
  else if (q.type === 'fill') { o.answer = String(q.answer); if (q.tolerance != null) o.tolerance = Number(q.tolerance); }
  else if (q.type === 'multi') { o.options = (q.options || []).map(String); o.answer = (q.answer || []).map(Number); }
  else { o.answer = q.answer; }
  o.explain = String(q.explain || '');
  if (q.strategy) o.strategy = String(q.strategy);
  return o;
}

function build(id) {
  const dim = DIMS[id];
  if (!dim) throw new Error('no DIMS for ' + id);
  const content = fs.readFileSync(path.join(WIP, id + '.content.md'), 'utf8');
  const meta = JSON.parse(fs.readFileSync(path.join(WIP, id + '.meta.json'), 'utf8'));
  const session = {
    id, stage: 1, week: 2, order: dim.order,
    title: dim.title, titleEn: dim.titleEn, platform: dim.platform,
    objective: String(meta.objective || ''),
    isCore: true, status: 'done',
    gradImportance: dim.gradImportance, tier: dim.tier, cognition: dim.cognition,
    prereq: dim.prereq, assessWeight: dim.assessWeight, extension: dim.extension, gradCourse: dim.gradCourse,
    content,
    fieldLink: String(meta.fieldLink || ''),
    checkpoints: (meta.checkpoints || []).map((c, i) => ({ id: c.id || ('c' + (i + 1)), text: String(c.text || '') })),
    resources: meta.resources || dim.resources || [],
    charts: meta.charts || [],
    quiz: (meta.quiz || []).map(coerceQuiz),
    chatPracticeHints: meta.chatPracticeHints || dim.chatPracticeHints || [],
  };
  const json = JSON.stringify(session, null, 2);
  JSON.parse(json); // 驗證可解析
  fs.writeFileSync(path.join(OUT, id + '.json'), json);

  // 驗證統計
  const boxed = (content.match(/\\boxed/g) || []).length;
  const dd = (content.match(/\$\$/g) || []).length;
  const qn = session.quiz.length;
  const diff = session.quiz.reduce((m, q) => (m[q.difficulty] = (m[q.difficulty] || 0) + 1, m), {});
  const hasDiag = /診斷|L1|L5/.test(content);
  console.log(`[${id}] 寫出 ${id}.json | quiz=${qn} (${JSON.stringify(diff)}) | \\boxed=${boxed} | $$對=${dd / 2} | checkpoints=${session.checkpoints.length} | charts=${session.charts.length} | 診斷組=${hasDiag}`);
  const warn = [];
  if (boxed !== 1) warn.push('\\boxed 應為 1，實為 ' + boxed);
  if (dd % 2 !== 0) warn.push('$$ 不成對 (' + dd + ')');
  if (qn !== 7) warn.push('quiz 應 7 題，實為 ' + qn);
  if ((diff.basic || 0) !== 3 || (diff.standard || 0) !== 3 || (diff.challenge || 0) !== 1) warn.push('難度配比應 3/3/1');
  if (!session.quiz.some(q => q.type === 'challenge' || q.strategy)) warn.push('challenge 題缺 strategy');
  if (!session.chatPracticeHints || session.chatPracticeHints.length < 2) warn.push('chatPracticeHints 應 2–3 條，實為 ' + (session.chatPracticeHints || []).length);
  if (warn.length) warn.forEach(w => console.log('  ⚠ ' + id + '：' + w));
  return warn.length === 0;
}

const ids = process.argv[2] ? [process.argv[2]] : Object.keys(DIMS);
let allOk = true;
for (const id of ids) {
  try { allOk = build(id) && allOk; }
  catch (e) { console.log(`[${id}] ✗ 組裝失敗：${e.message}`); allOk = false; }
}
console.log(allOk ? '\n✅ 全部組裝且通過基本驗證' : '\n⚠ 有警告，需檢視上面標記');
