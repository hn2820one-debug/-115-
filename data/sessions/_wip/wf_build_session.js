export const meta = {
  name: 'build-w34-sessions-v2',
  description: 'Build lessons (optimized): write+assemble → combined validate (Sonnet) → conditional fix',
  phases: [
    { title: 'Write' },
    { title: 'Validate' },
    { title: 'Fix & Assemble' },
  ],
}

// 優化版 v2：簡報取代全 spec、3 路驗證合一（Sonnet）、pass-through 跳過唔必要嘅 fix。路徑正斜線、硬編。
const ROOT = 'C:/Users/Keith/Desktop/中興大115學年度材料科學與工程學系碩士在職專班'
const A = {
  wip: ROOT + '/foundationlearn/data/sessions/_wip',
  plan: ROOT + '/Background/三個月入學前補底計劃.md',
  briefWriter: ROOT + '/foundationlearn/data/sessions/_wip/briefs/brief_writer.md',
  briefValidator: ROOT + '/foundationlearn/data/sessions/_wip/briefs/brief_validator.md',
  skeleton: ROOT + '/foundationlearn/data/sessions/_wip/briefs/skeleton_S33.md',
}
// 本批要建嘅課節。續做時改呢個陣列。
const SESSIONS = [
  { id: 'S43', title: '化學平衡（一）', tier: 'core', cognition: 'concept', extension: 'none', platform: 'junyi' },
  { id: 'S44', title: '化學平衡（二）：溫度影響', tier: 'core', cognition: 'concept', extension: 'life', platform: 'junyi' },
  { id: 'S45', title: '氧化還原基礎', tier: 'core', cognition: 'concept', extension: 'packaging', platform: 'ka' },
  { id: 'S46', title: 'Week 3 整理', tier: 'tool', cognition: 'synthesis', extension: 'none', platform: 'self' },
  { id: 'S47', title: 'Week 3 練習', tier: 'tool', cognition: 'concept', extension: 'none', platform: 'callister' },
]

const TIERDESC = {
  core: 'core 深講：完整深講、可取代教科書，要完整計算或判讀範例，附 L1–L5 診斷題組',
  backbone: 'backbone 標準：中等篇幅、講清楚即可',
  bridge: 'bridge 輕講：短、重點「知道、能銜接」，1 題 quiz，可無診斷組，但仍要銜接點',
  tool: 'tool 工具/輸出：動作導向（整理/練習/輸出框），唔出教學長文，meta.quiz=[]',
}

const VALIDATION = {
  type: 'object', additionalProperties: false,
  properties: {
    pass: { type: 'boolean' },
    issues: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      properties: {
        id: { type: 'string' }, type: { type: 'string' }, severity: { type: 'string' },
        section: { type: 'string' }, description: { type: 'string' },
        flagged_text: { type: 'string' }, fix: { type: 'string' },
      },
      required: ['type', 'severity', 'section', 'description', 'fix'] } },
    summary: { type: 'object', additionalProperties: true,
      properties: { math_fact: { type: 'string' }, format_spec: { type: 'string' }, pedagogy_tone: { type: 'string' } } },
  },
  required: ['pass', 'issues'],
}
const ASM = {
  type: 'object', additionalProperties: false,
  properties: { ok: { type: 'boolean' }, warnings: { type: 'array', items: { type: 'string' } }, note: { type: 'string' } },
  required: ['ok'],
}

function writePrompt(s) {
  return `你係 FoundationLearn 補底 App 嘅資深課堂作者。為第 ${s.id} 節「${s.title}」生成課堂內容，目標「可取代教科書、純睇筆記即學得明」。

【先用 Read 讀（只需呢兩份，唔好再讀完整規範）】
1. 寫稿簡報（硬性施工指令）：${A.briefWriter}
2. 結構骨架（照呢個段落順序/JSON 欄位/語氣排版，內容換做本節主題）：${A.skeleton}
另外用 Grep 喺 ${A.plan} 搵「${s.id.replace(/B$/, '')}」嗰段，跟佢嘅學習目標同現場連結（${s.id} 係 ${s.id.replace(/B$/, '')} 嘅同題重生成）。

【本節維度】tier=${s.tier}（${TIERDESC[s.tier]}）｜cognition=${s.cognition}｜extension=${s.extension}｜platform=${s.platform}

【務必守（簡報有詳列，呢度只標最易失分）】
- 粵語書面語；content 全部數式用 LaTeX；${s.tier === 'tool' ? 'tool 節動作導向、唔出教學長文，可無主公式（如放參考公式至多一條 $\\boxed{}$）' : '**$\\boxed{}$ 啱啱一條**主公式；每條公式附符號表；逐行推導行末標依據'}。
- 專業詞每次寫成 <span class="term-zh">中</span>（<span class="term-en">en</span>）（**全形（）**，唔好半形）。
- App quiz 入 meta.json，**唔好寫落 content**；${s.tier === 'tool' ? 'tool 節 meta.quiz=[]' : s.tier === 'bridge' ? '1 題' : '3–4 題（建議 2 basic+2 standard）'}、**全 single/truefalse**、**q/options/explain 用 unicode 數式（唔可 $LaTeX$）**。single answer=index、truefalse answer=布林。
- 段落順序：${s.tier === 'tool' ? '（tool 動作導向、唔出教學長文）總綱（本節練咩、點解要練）→銜接點(H9)→重點回顧（精簡列要鞏固嘅步驟同關鍵公式）→練習指引（明確叫用戶喺聊天室做幾多題、練咩、標出本節最易錯嘅位）→自我檢核清單（可勾選）→' + (s.extension !== 'none' ? '現場連結→' : '') + '一頁速查表。**唔出 App quiz、唔出 L1–L5 診斷組**，meta.quiz=[]。' : '總綱→銜接點(H9)→正式定義→公式+符號表→Worked Examples(H8 由易到難)→易混淆→(如有圖:內嵌簡單 SVG+讀圖導引)→一頁總表(H10)→(core)診斷題組 L1–L5。'}
- charts 留 []（SVG 內嵌喺 content）；chatPracticeHints ${s.tier === 'tool' ? '可 []' : '2–3 條 ≤15 字粵語'}。

【輸出（用 Write，UTF-8）】
1. ${A.wip}/${s.id}.content.md
2. ${A.wip}/${s.id}.meta.json（欄位見骨架）

【寫完即組裝＋自驗】用 Bash 喺目錄 ${A.wip} 跑：node assemble_w3.js ${s.id}
把 console 嗰行 [${s.id}] … 同任何「⚠」貼返，若有 ⚠ 即修到無警告（最多再跑兩次）。
完成回覆一句：「${s.id} 已寫＋組裝，assemble 結果：<貼返嗰行>」。`
}

function validatePrompt(s) {
  return `你係嚴格課堂審查員，一次過查三維（math/format/pedagogy）。用 Read 睇：
1. 驗證簡報（檢查點＋輸出格式）：${A.briefValidator}
2. ${A.wip}/${s.id}.content.md
3. ${A.wip}/${s.id}.meta.json
本節：${s.id}「${s.title}」｜tier=${s.tier}｜cognition=${s.cognition}｜extension=${s.extension}。

注意：結構數量（boxed 條數、quiz 題型/題數、$$ 成對）已由 assemble 腳本自動檢查，你**集中查語意層**：數學/材料事實啱唔啱、課文係咪自足完整、粵語書面語、term 雙語全形、quiz 有無用咗 $LaTeX$（應 unicode）、例題漸進、銜接點/總表/符號表/讀圖導引內容是否到位、現場延伸是否符合 extension。
只報**有信心**嘅真問題（critical=必須改、minor=建議改），以黃金樣本接受嘅寫法為準，唔肯定唔好報。
嚴格按簡報嘅 JSON 格式回傳（pass / issues[] / summary）。無問題 issues 留 []、pass=true。`
}

function fixPrompt(s, issues) {
  return `你負責修正＋重組第 ${s.id} 節「${s.title}」。驗證搵到以下問題（可能有誤報，以規範精神＋黃金樣本為準，只改真問題）：
${JSON.stringify(issues, null, 1)}

做法：
1. 用 Read 睇 ${A.wip}/${s.id}.content.md 同 ${A.wip}/${s.id}.meta.json。
2. **只針對上面 flagged_text 用 Edit 逐處改**（唔好重寫成篇），保持慣例：粵語、content 全 LaTeX/quiz 全 unicode、$\\boxed{}$ 一條、term 全形（）、quiz 全 single/truefalse。
3. 改完用 Bash 喺 ${A.wip} 跑：node assemble_w3.js ${s.id}，貼返 [${s.id}] 行；有 ⚠ 修到無。
回傳 {ok, warnings:[剩低警告], note:"一句講改咗咩"}。`
}

const results = []
for (const s of SESSIONS) {
  log(`▶ 開始 ${s.id}「${s.title}」（${s.tier}/${s.cognition}）`)

  // 1) 寫稿＋組裝（Opus，繼承主線模型）
  await agent(writePrompt(s), { label: `write:${s.id}`, phase: 'Write', agentType: 'general-purpose' })

  // 2) 合一驗證（Sonnet，平比較平）
  const v = await agent(validatePrompt(s), { label: `validate:${s.id}`, phase: 'Validate', agentType: 'general-purpose', model: 'sonnet', schema: VALIDATION })
  const issues = (v && v.issues) || []
  const hasCritical = issues.some(i => i.severity === 'critical')
  log(`  ${s.id}：驗證 pass=${v && v.pass}，issues=${issues.length}（critical=${issues.filter(i => i.severity === 'critical').length}）`)

  // 3) pass-through：無 issue 直接收貨（寫稿已組裝）；有就修（critical→Opus、minor→Sonnet）
  let result
  if (issues.length === 0) {
    result = { id: s.id, title: s.title, tier: s.tier, issues: 0, ok: true, fixed: false, note: '一次過通過、無需修正' }
  } else {
    const fixModel = hasCritical ? undefined : 'sonnet' // critical 用 Opus（繼承），minor-only 用 Sonnet
    const asm = await agent(fixPrompt(s, issues), { label: `fix:${s.id}`, phase: 'Fix & Assemble', agentType: 'general-purpose', model: fixModel, schema: ASM })
    result = { id: s.id, title: s.title, tier: s.tier, issues: issues.length, hasCritical, ok: asm && asm.ok, fixed: true, warnings: (asm && asm.warnings) || [], note: (asm && asm.note) || '' }
  }
  results.push(result)
  log(`✓ ${s.id} 完成（ok=${result.ok}）`)
}
return results
