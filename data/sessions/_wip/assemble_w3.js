// 組裝 Week 3–4 課節 JSON：讀 _wip/{id}.content.md + {id}.meta.json + 下方 DIMS → data/sessions/{id}.json
// 用法：node assemble_w3.js S34   （或不帶參數＝全部已登記 DIMS）
// 規範 v2：App quiz 收窄為純概念核對（3–4 題、全 single/truefalse、計算移聊天室）。
// 維度欄位由本檔控制（我把關），內容/quiz 由 content.md + meta.json 提供。
// tier：core 深講｜backbone 標準｜bridge 輕講｜tool 工具/輸出。驗證按 tier 分級。
const fs = require('fs');
const path = require('path');
const WIP = __dirname;
const OUT = path.join(__dirname, '..');

// gradImportance: essential(★必修) / important(重要) / support(支撐)
// cognition: concept / calculation / chartread / recall / synthesis
// extension: life / packaging / research / none
const DIMS = {
  // ── Week 2：微積分 — 積分入門（S21–S23）──
  S21: { week:2, order:21, title:'積分的意義', titleEn:'Meaning of Integration', platform:'3b1b', gradImportance:'important', tier:'core', cognition:'concept', prereq:['S7','S8'], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S22: { week:2, order:22, title:'反導數概念', titleEn:'Antiderivatives', platform:'junyi', gradImportance:'important', tier:'core', cognition:'calculation', prereq:['S21','S8','S9'], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S23: { week:2, order:23, title:'定積分', titleEn:'Definite Integrals', platform:'junyi', gradImportance:'essential', tier:'core', cognition:'calculation', prereq:['S22','S21'], assessWeight:'medium', extension:'packaging', gradCourse:['general','thermo'] },
  S24: { week:2, order:24, title:'定積分練習', titleEn:'Definite Integral Practice', platform:'paul', gradImportance:'support', tier:'tool', cognition:'calculation', prereq:['S23'], assessWeight:'light', extension:'none', gradCourse:['general'] },
  S25: { week:2, order:25, title:'指數函數的積分', titleEn:'Integration of Exponentials', platform:'paul', gradImportance:'important', tier:'core', cognition:'calculation', prereq:['S22','S23','S9'], assessWeight:'medium', extension:'packaging', gradCourse:['general'] },
  S26: { week:2, order:26, title:'微積分綜合（一）', titleEn:'Calculus Mixed I', platform:'paul', gradImportance:'support', tier:'tool', cognition:'synthesis', prereq:['S8','S23'], assessWeight:'light', extension:'none', gradCourse:['general'] },
  S27: { week:2, order:27, title:'微積分綜合（二）計時', titleEn:'Calculus Mixed II (Timed)', platform:'paul', gradImportance:'support', tier:'tool', cognition:'synthesis', prereq:['S26'], assessWeight:'light', extension:'none', gradCourse:['general'] },
  // ── Week 3：基礎化學 — 原子與鍵結 ──
  S33: { week:3, order:33, title:'原子結構（一）', titleEn:'Atomic Structure I', platform:'junyi', gradImportance:'important', tier:'core', cognition:'concept', prereq:[], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  // S33B：優化版 workflow 重生成嘅對照樣本（同 S33 維度，唔上 manifest、唔覆蓋 S33）
  S33B: { week:3, order:33, title:'原子結構（一）', titleEn:'Atomic Structure I', platform:'junyi', gradImportance:'important', tier:'core', cognition:'concept', prereq:[], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S34: { week:3, order:34, title:'原子結構（二）：電子組態', titleEn:'Atomic Structure II — Electron Config', platform:'ka', gradImportance:'important', tier:'core', cognition:'concept', prereq:['S33'], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S35: { week:3, order:35, title:'週期表邏輯', titleEn:'Periodic Table Logic', platform:'ka', gradImportance:'support', tier:'bridge', cognition:'concept', prereq:['S34'], assessWeight:'light', extension:'none', gradCourse:['general'] },
  S36: { week:3, order:36, title:'化學鍵總覽', titleEn:'Chemical Bonding Overview', platform:'junyi', gradImportance:'essential', tier:'core', cognition:'concept', prereq:['S34'], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S37: { week:3, order:37, title:'金屬鍵深入', titleEn:'Metallic Bonding In-depth', platform:'callister', gradImportance:'important', tier:'core', cognition:'concept', prereq:['S36'], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S38: { week:3, order:38, title:'共價鍵深入', titleEn:'Covalent Bonding In-depth', platform:'callister', gradImportance:'important', tier:'core', cognition:'concept', prereq:['S36'], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S39: { week:3, order:39, title:'鍵結與材料性質', titleEn:'Bonding & Material Properties', platform:'callister', gradImportance:'essential', tier:'core', cognition:'concept', prereq:['S37','S38'], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S40: { week:3, order:40, title:'鍵能與鍵長', titleEn:'Bond Energy & Bond Length', platform:'callister', gradImportance:'important', tier:'core', cognition:'concept', prereq:['S39'], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S41: { week:3, order:41, title:'化學計量基礎', titleEn:'Stoichiometry Basics', platform:'ka', gradImportance:'support', tier:'bridge', cognition:'calculation', prereq:['S33'], assessWeight:'light', extension:'none', gradCourse:['general'] },
  S42: { week:3, order:42, title:'化學反應與能量', titleEn:'Chemical Reactions & Energy', platform:'ka', gradImportance:'important', tier:'core', cognition:'concept', prereq:['S33'], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S43: { week:3, order:43, title:'化學平衡（一）', titleEn:'Chemical Equilibrium I', platform:'junyi', gradImportance:'essential', tier:'core', cognition:'concept', prereq:['S42'], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S44: { week:3, order:44, title:'化學平衡（二）：溫度影響', titleEn:'Chemical Equilibrium II — Temperature', platform:'junyi', gradImportance:'essential', tier:'core', cognition:'concept', prereq:['S43'], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S45: { week:3, order:45, title:'氧化還原基礎', titleEn:'Redox Basics', platform:'ka', gradImportance:'important', tier:'core', cognition:'concept', prereq:['S33'], assessWeight:'medium', extension:'packaging', gradCourse:['general'] },
  S46: { week:3, order:46, title:'Week 3 整理', titleEn:'Week 3 Summary', platform:'self', gradImportance:'support', tier:'tool', cognition:'synthesis', prereq:['S36','S39'], assessWeight:'light', extension:'none', gradCourse:['general'] },
  S47: { week:3, order:47, title:'Week 3 練習', titleEn:'Week 3 Practice', platform:'callister', gradImportance:'important', tier:'tool', cognition:'concept', prereq:['S39'], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S48: { week:3, order:48, title:'Week 3 檢討 + 輸出', titleEn:'Week 3 Review & Output', platform:'self', gradImportance:'support', tier:'tool', cognition:'synthesis', prereq:['S47'], assessWeight:'light', extension:'none', gradCourse:['general'] },
  // ── Week 4：基礎物理 — 熱與晶體入門 ──
  S49: { week:4, order:49, title:'溫度與熱', titleEn:'Temperature & Heat', platform:'ka', gradImportance:'important', tier:'core', cognition:'concept', prereq:[], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S50: { week:4, order:50, title:'熱力學第零定律', titleEn:'Zeroth Law of Thermodynamics', platform:'ka', gradImportance:'important', tier:'core', cognition:'concept', prereq:['S49'], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S51: { week:4, order:51, title:'熱力學第一定律（一）', titleEn:'First Law of Thermodynamics I', platform:'ka', gradImportance:'essential', tier:'core', cognition:'concept', prereq:['S49'], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S52: { week:4, order:52, title:'熱力學第一定律（二）', titleEn:'First Law of Thermodynamics II', platform:'ka', gradImportance:'essential', tier:'core', cognition:'calculation', prereq:['S51'], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S53: { week:4, order:53, title:'熵與第二定律（直覺）', titleEn:'Entropy & Second Law (Intuition)', platform:'ka', gradImportance:'essential', tier:'core', cognition:'concept', prereq:['S51'], assessWeight:'heavy', extension:'life', gradCourse:['general'] },
  S54: { week:4, order:54, title:'比熱與熱容', titleEn:'Specific Heat & Heat Capacity', platform:'ka', gradImportance:'important', tier:'core', cognition:'calculation', prereq:['S49'], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S55: { week:4, order:55, title:'熱傳導概念', titleEn:'Heat Conduction Concept', platform:'callister', gradImportance:'important', tier:'core', cognition:'concept', prereq:['S49'], assessWeight:'medium', extension:'packaging', gradCourse:['general'] },
  S56: { week:4, order:56, title:'熱膨脹（TEC）', titleEn:'Thermal Expansion (CTE)', platform:'callister', gradImportance:'important', tier:'core', cognition:'concept', prereq:['S49'], assessWeight:'medium', extension:'packaging', gradCourse:['general'] },
  S57: { week:4, order:57, title:'晶體與非晶', titleEn:'Crystalline vs Amorphous', platform:'callister', gradImportance:'essential', tier:'core', cognition:'concept', prereq:[], assessWeight:'medium', extension:'life', gradCourse:['general'] },
  S58: { week:4, order:58, title:'單位晶胞概念', titleEn:'Unit Cell Concept', platform:'callister', gradImportance:'essential', tier:'core', cognition:'concept', prereq:['S57'], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S59: { week:4, order:59, title:'三大金屬結構', titleEn:'FCC / BCC / HCP Structures', platform:'doitpoms', gradImportance:'essential', tier:'core', cognition:'recall', prereq:['S58'], assessWeight:'heavy', extension:'none', gradCourse:['general'] },
  S60: { week:4, order:60, title:'原子堆積與密度', titleEn:'Atomic Packing & Density', platform:'callister', gradImportance:'important', tier:'core', cognition:'calculation', prereq:['S59'], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S61: { week:4, order:61, title:'晶面與晶向（入門）', titleEn:'Miller Indices (Intro)', platform:'doitpoms', gradImportance:'support', tier:'bridge', cognition:'concept', prereq:['S58'], assessWeight:'light', extension:'none', gradCourse:['general'] },
  S62: { week:4, order:62, title:'第一階段大整理（一）', titleEn:'Stage 1 Grand Review I', platform:'self', gradImportance:'support', tier:'tool', cognition:'synthesis', prereq:['S36','S53','S59'], assessWeight:'light', extension:'none', gradCourse:['general'] },
  S63: { week:4, order:63, title:'第一階段大整理（二）', titleEn:'Stage 1 Grand Review II', platform:'self', gradImportance:'important', tier:'tool', cognition:'calculation', prereq:['S8','S39','S53'], assessWeight:'medium', extension:'none', gradCourse:['general'] },
  S64: { week:4, order:64, title:'第一階段收尾 + 輸出', titleEn:'Stage 1 Wrap-up & Output', platform:'self', gradImportance:'support', tier:'tool', cognition:'synthesis', prereq:['S62'], assessWeight:'light', extension:'none', gradCourse:['general'] },
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
    id, stage: dim.week <= 4 ? 1 : (dim.week <= 8 ? 2 : 3), week: dim.week, order: dim.order,
    title: dim.title, titleEn: dim.titleEn, platform: dim.platform,
    objective: String(meta.objective || ''),
    isCore, status: 'done',
    gradImportance: dim.gradImportance, tier: dim.tier, cognition: dim.cognition,
    prereq: dim.prereq, assessWeight: dim.assessWeight, extension: dim.extension, gradCourse: dim.gradCourse,
    content,
    fieldLink: String(meta.fieldLink || ''),
    checkpoints: (meta.checkpoints || []).map((c, i) => ({ id: c.id || ('c' + (i + 1)), text: String(c.text || '') })),
    resources: meta.resources || [],
    charts: meta.charts || [],
    quiz: (meta.quiz || []).map(coerceQuiz),
    chatPracticeHints: meta.chatPracticeHints || [],
  };
  const json = JSON.stringify(session, null, 2);
  JSON.parse(json); // 驗證可解析
  fs.writeFileSync(path.join(OUT, id + '.json'), json);

  // ── 驗證（按 tier 分級）──
  const boxed = (content.match(/\\boxed/g) || []).length;
  const dd = (content.match(/\$\$/g) || []).length;
  const qn = session.quiz.length;
  const types = session.quiz.reduce((m, q) => (m[q.type] = (m[q.type] || 0) + 1, m), {});
  const hasDiag = /診斷|L1|L5/.test(content);
  const hasBanner = /銜接點/.test(content);
  const hasSummary = /一頁總表/.test(content);
  const t = dim.tier;
  console.log(`[${id}] 寫出 ${id}.json | ${t}/${dim.cognition} isCore=${isCore} | quiz=${qn} ${JSON.stringify(types)} | \\boxed=${boxed} | $$對=${dd/2} | cp=${session.checkpoints.length} | 診斷=${hasDiag} 銜接=${hasBanner} 總表=${hasSummary}`);
  const warn = [];
  if (dd % 2 !== 0) warn.push('$$ 不成對 (' + dd + ')');
  const nonConcept = session.quiz.filter(q => q.type !== 'single' && q.type !== 'truefalse');
  if (nonConcept.length) warn.push('App quiz 應全 single/truefalse（計算移聊天室），發現 ' + nonConcept.map(q => q.type).join('/'));
  if (t === 'core' || t === 'backbone') {
    if (boxed !== 1) warn.push('（' + t + '）\\boxed 應為 1，實為 ' + boxed);
    if (qn < 3 || qn > 4) warn.push('（' + t + '）App quiz 應 3–4 題，實為 ' + qn);
    if (!hasBanner) warn.push('缺「銜接點」段落（H9）');
    if (!hasSummary) warn.push('缺「一頁總表」段落（H10）');
    if (!session.chatPracticeHints || session.chatPracticeHints.length < 2) warn.push('chatPracticeHints 應 2–3 條，實為 ' + (session.chatPracticeHints || []).length);
  } else if (t === 'bridge') {
    if (qn < 1 || qn > 2) warn.push('（bridge）App quiz 應 1–2 題，實為 ' + qn);
    if (!hasBanner) warn.push('缺「銜接點」段落（H9）');
  } else if (t === 'tool') {
    if (qn > 0) warn.push('（tool）動作導向、唔出教學題，quiz 應 0 題，實為 ' + qn);
  }
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
