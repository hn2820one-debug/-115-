export const meta = {
  name: 'build-w34-sessions',
  description: 'Build Week 3–4 lessons one at a time: write → adversarial verify → fix → assemble',
  phases: [
    { title: 'Write' },
    { title: 'Verify' },
    { title: 'Fix & Assemble' },
  ],
}

// args: { base, wip, spec, plan, exemplarContent, exemplarMeta, sessions:[{id,title,tier,cognition,extension,platform}] }
const A = args
const TIERDESC = {
  core: 'core 深講：完整深講、可取代教科書，要完整計算或判讀範例，附 L1–L5 診斷題組',
  backbone: 'backbone 標準：中等篇幅、講清楚即可',
  bridge: 'bridge 輕講：短、重點「知道、能銜接」，1–2 題 quiz，可無診斷組，但仍要銜接點',
  tool: 'tool 工具/輸出：動作導向（整理/練習/輸出框/心智圖步驟），唔出教學長文，meta.quiz=[]',
}

const FINDINGS = {
  type: 'object', additionalProperties: false,
  properties: { findings: { type: 'array', items: {
    type: 'object', additionalProperties: false,
    properties: { severity: { type: 'string' }, where: { type: 'string' }, issue: { type: 'string' }, fix: { type: 'string' } },
    required: ['severity', 'issue'] } } },
  required: ['findings'],
}
const ASM = {
  type: 'object', additionalProperties: false,
  properties: { ok: { type: 'boolean' }, warnings: { type: 'array', items: { type: 'string' } }, note: { type: 'string' } },
  required: ['ok'],
}

function writePrompt(s) {
  return `你係 FoundationLearn 入學前補底 App 嘅資深課堂內容作者。為第 ${s.id} 節「${s.title}」生成課堂內容，目標係「可取代教科書、純睇筆記即學得明」。

【務必先用 Read／Grep 讀以下，照做】
1. 規範（唯一施工指令）：${A.spec}
2. 格式黃金範本（同週、剛建好，照足佢嘅格式/語氣/深度/排版/SVG 寫法）：
   - ${A.exemplarContent}
   - ${A.exemplarMeta}
3. 本節範圍大綱：喺 ${A.plan} 入面 Grep「${s.id}」，跟嗰段嘅學習目標同現場連結。

【本節維度】tier=${s.tier}（${TIERDESC[s.tier]}）｜cognition=${s.cognition}｜extension=${s.extension}｜platform=${s.platform}

【硬性慣例（違反即 NG）】
- 粵語書面語（廣東話），唔好普通話書面語。
- content 入面**所有**數式用 LaTeX（$…$ / $$…$$）；**每節只一條** $\\boxed{…}$ 主公式（揀本節最核心嗰條關係/定義框起）；每條公式下面附「符號表」（逐項意義＋單位）。含計算要逐行（一行一動作、行末括號註明依據），每個數字標來源。
- 專業詞每次出現用：<span class="term-zh">中文</span>（<span class="term-en">English</span>）—— **全形括號（）**，唔好半形。
- 段落順序：總綱 → 銜接點（明寫前置節號，如 ${s.id==='S49'||s.id==='S57'?'本節為起點、可寫唔依賴前節':'依賴邊節'}）→（概念入口/正式定義）→ 公式＋符號表 → Worked Examples（由易到難，最後一題綜合）→ 易混淆對比 →（如有圖：靜態圖＋讀圖導引）→ 一頁總表 → 診斷題組（L1–L5，每層≥2 題，尾附答案＋「卡喺 X→重睇 Y」補底導引）。
- 圖：原子/鍵結/晶體/能量曲線類，用**簡單內嵌 SVG**（淨係 circle/line/rect/text/path 基本圖元，配色 #f06060/#94a3b8/#4a9eff/#64748b/#f5c842/#2dd4bf，深底可讀），或 markdown 表，並附「讀圖導引」（X軸/Y軸/關鍵特徵/最易睇錯）。**唔好**用 [CHART:…] 除非係已支援型別（functionPlot/arrhenius/phaseDiagram/freeEnergy/crystal3d/surface3d/stressStrain）且你確定 params。
- 數值誠實：材料數據/常數用標準值；無十足把握就標「需查證 ⚠」，唔好作數。

【quiz（只寫入 meta.json，唔好寫落 content）】
- App quiz 純概念核對：${s.tier==='tool'?'0 題（tool 節 meta.quiz=[]）':s.tier==='bridge'?'1–2 題':'3–4 題（建議 2 basic + 2 standard）'}、**全 single / truefalse**（計算移聊天室，唔好出 fill）。
- quiz 嘅 q/options/explain **用 unicode 數式**（eˣ、x²、√、¹²C、Mg²⁺、ΔU、°C），**唔好用 $LaTeX$**（quiz 區唔行 KaTeX）。
- 每題附 explain（點解啱、常見錯選嘅概念錯）。single 的 answer = 正確選項 index（0 起）；truefalse 的 answer = 布林 true/false。

【chatPracticeHints】${s.tier==='tool'?'可空 []':'2–3 條 ≤15 字粵語，本節最易錯題型'}。

【輸出（用 Write，UTF-8）】
1. ${A.wip}/${s.id}.content.md —— 純 markdown 課文（唔含 App quiz；core 節含診斷題組）。
2. ${A.wip}/${s.id}.meta.json —— JSON，欄位：objective(字串)、fieldLink(字串；extension=none 就空 "")、checkpoints([{id,text}] 4–6 條、自足技能驗證、唔可叫人去外部平台做題；半導體現場連結類可保留)、resources([{type,label,url}] 一條選看，可指 ${s.platform}）、charts([]；SVG 內嵌喺 content)、quiz(見上)、chatPracticeHints(見上)。

寫完用 Read 自己覆一次：$$ 成對、$\\boxed{}$ 啱啱一條、term 雙語全形、quiz 全 single/truefalse、JSON 可解析。
完成回覆一句：「${s.id} 已寫，content 約 N 字、quiz M 題」。`
}

function verifyPrompt(s, lens, scope) {
  return `你係嚴格嘅課堂審查員（${lens} 角度）。用 Read 睇 ${A.wip}/${s.id}.content.md 同 ${A.wip}/${s.id}.meta.json，對照規範 ${A.spec} 同黃金範本 ${A.exemplarContent}。
本節：${s.id}「${s.title}」｜tier=${s.tier}｜cognition=${s.cognition}｜extension=${s.extension}。

只揾 ${lens} 範疇嘅**實在**問題：${scope}

重要原則：
- 以黃金範本為準——範本本身都接受嘅寫法，唔好當違規。
- 只報你**有信心**嘅真問題；唔肯定就唔好報（避免誤報）。
- 每項講清楚位置（where）、問題（issue）、點改（fix）、嚴重度（severity: high/med/low）。
- 完全冇問題就 findings 留空陣列 []。`
}

function fixAssemblePrompt(s, findings) {
  return `你負責定稿 + 組裝第 ${s.id} 節「${s.title}」。
1. 用 Read 睇 ${A.wip}/${s.id}.content.md 同 ${A.wip}/${s.id}.meta.json。
2. 以下係三路審查建議（可能有誤報；以規範 ${A.spec} 同黃金範本 ${A.exemplarContent} 為準，只改真問題，誤報就忽略）：
${JSON.stringify(findings, null, 1)}
3. 用 Edit/Write 修正真問題，保持慣例：粵語書面語、content 全 LaTeX / quiz 全 unicode、$\\boxed{}$ 啱啱一條、term 雙語全形（）、quiz 全 single/truefalse、${s.tier} 篇幅。
4. 用 Bash 喺目錄 ${A.wip} 跑（用引號包路徑，正斜線）：node assemble_w3.js ${s.id}
   把 console 嗰行 [${s.id}] … 同任何「⚠」貼返。
5. 若有 ⚠ 警告，修到無警告（最多再跑兩次 assemble）。${s.tier==='tool'?'（tool 節：quiz 應 0、可無 boxed/診斷組）':''}
回傳 {ok, warnings:[…剩低嘅警告], note:"一句總結改咗咩"}。`
}

const LENSES = [
  ['數學/事實', '材料科學或化學事實錯誤、計算/移項/數值/單位錯、公式寫錯、符號表意義錯。'],
  ['規範格式', '$\\boxed{} 數量（應 1）、符號表有無缺、段落順序、term 雙語全形（）、quiz 是否全 single/truefalse、content 是否全 LaTeX 而 quiz 是否全 unicode、銜接點/一頁總表/診斷題組（按 tier）齊唔齊、tier 篇幅是否相稱。'],
  ['語氣/教學', '是否粵語書面語（唔好變普通話）、講解清晰度與漸進性、易混淆對比是否有用、現場/延伸是否貼題且符合 extension 設定（none 就唔應有延伸）。'],
]

const results = []
for (const s of A.sessions) {
  log(`▶ 開始 ${s.id}「${s.title}」（${s.tier}/${s.cognition}）`)

  // 1) 寫
  await agent(writePrompt(s), { label: `write:${s.id}`, phase: 'Write', agentType: 'general-purpose' })

  // 2) 三路對抗式驗證（並行）
  const verdicts = await parallel(LENSES.map(([lens, scope]) => () =>
    agent(verifyPrompt(s, lens, scope), { label: `verify:${s.id}:${lens}`, phase: 'Verify', agentType: 'general-purpose', schema: FINDINGS })
  ))
  const findings = verdicts.filter(Boolean).flatMap(v => (v.findings || []))
  log(`  ${s.id}：驗證得 ${findings.length} 項建議`)

  // 3) 定稿 + 組裝
  const asm = await agent(fixAssemblePrompt(s, findings), { label: `fix:${s.id}`, phase: 'Fix & Assemble', agentType: 'general-purpose', schema: ASM })
  results.push({ id: s.id, title: s.title, tier: s.tier, findings: findings.length, ok: asm && asm.ok, warnings: (asm && asm.warnings) || [], note: (asm && asm.note) || '' })
  log(`✓ ${s.id} 完成（ok=${asm && asm.ok}，${(asm && asm.warnings || []).length} 警告）`)
}
return results
