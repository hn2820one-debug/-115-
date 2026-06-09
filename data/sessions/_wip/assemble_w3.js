// 組裝 Week 3 課節 JSON：讀 _wip/{id}.content.md + {id}.meta.json + 下方 DIMS → data/sessions/{id}.json
// 用法：node assemble_w3.js S33   （或不帶參數＝全部已登記 DIMS）
// 規範 v2：App quiz 收窄為純概念核對（3–4 題、全 single/truefalse、計算移聊天室）。
// 維度欄位由本檔控制（我把關），內容/quiz 由 content.md + meta.json 提供。
const fs = require('fs');
const path = require('path');
const WIP = __dirname;
const OUT = path.join(__dirname, '..');

const DIMS = {
  S33: { order: 33, week: 3, title: '原子結構（一）', titleEn: 'Atomic Structure I', platform: 'junyi',
    gradImportance: 'important', tier: 'core', cognition: 'concept', prereq: [],
    assessWeight: 'medium', extension: 'none', gradCourse: ['general'],
    resources: [{ type: 'video', label: '（選看）均一教育平台：原子的結構與組成', url: 'https://www.junyiacademy.org' }],
    chatPracticeHints: ['質量數 A（整數）同原子量撈亂', '離子電子數冇用 Z−電荷', '同位素當咗唔同元素'] },
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
  const isCore = dim.tier === 'core' || dim.tier === 'backbone';
  const session = {
    id, stage: 1, week: dim.week, order: dim.order,
    title: dim.title, titleEn: dim.titleEn, platform: dim.platform,
    objective: String(meta.objective || ''),
    isCore, status: 'done',
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

  // 驗證統計（v2 概念格式）
  const boxed = (content.match(/\\boxed/g) || []).length;
  const dd = (content.match(/\$\$/g) || []).length;
  const qn = session.quiz.length;
  const types = session.quiz.reduce((m, q) => (m[q.type] = (m[q.type] || 0) + 1, m), {});
  const diff = session.quiz.reduce((m, q) => (m[q.difficulty] = (m[q.difficulty] || 0) + 1, m), {});
  const hasDiag = /診斷|L1|L5/.test(content);
  const hasBanner = /銜接點/.test(content);
  const hasSummary = /一頁總表/.test(content);
  console.log(`[${id}] 寫出 ${id}.json | tier=${dim.tier} isCore=${isCore} | quiz=${qn} types=${JSON.stringify(types)} diff=${JSON.stringify(diff)} | \\boxed=${boxed} | $$對=${dd / 2} | checkpoints=${session.checkpoints.length} | 診斷組=${hasDiag} 銜接點=${hasBanner} 總表=${hasSummary}`);
  const warn = [];
  if (boxed !== 1) warn.push('\\boxed 應為 1，實為 ' + boxed);
  if (dd % 2 !== 0) warn.push('$$ 不成對 (' + dd + ')');
  if (qn < 3 || qn > 4) warn.push('App quiz 應 3–4 題（v2 概念核對），實為 ' + qn);
  const nonConcept = session.quiz.filter(q => q.type !== 'single' && q.type !== 'truefalse');
  if (nonConcept.length) warn.push('App quiz 應全 single/truefalse（計算移聊天室），發現 ' + nonConcept.map(q => q.type).join('/'));
  if (!session.chatPracticeHints || session.chatPracticeHints.length < 2) warn.push('chatPracticeHints 應 2–3 條，實為 ' + (session.chatPracticeHints || []).length);
  if (!hasBanner) warn.push('缺「銜接點」段落（H9）');
  if (!hasSummary) warn.push('缺「一頁總表」段落（H10）');
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
