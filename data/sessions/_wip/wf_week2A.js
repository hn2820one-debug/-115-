export const meta = {
  name: 'week2A-rebuild',
  description: 'Week 2 模塊A（S17–S20 偏微分）按新粵語規範＋S9黃金樣本，多agent重建（雙稿→合成→對抗驗證→修正）',
  phases: [
    { title: '1·雙稿' },
    { title: '2·合成' },
    { title: '3·對抗驗證' },
    { title: '4·修正' },
  ],
};

const ROOT = 'C:/Users/Keith/Desktop/中興大115學年度材料科學與工程學系碩士在職專班';
const STD = ROOT + '/Background/筆記規範(補充).md';
const GOLD = ROOT + '/foundationlearn/data/sessions/S9.json';
const GOLD2 = ROOT + '/Background/Golden Session/S90_golden.md';
const WIP = ROOT + '/foundationlearn/data/sessions/_wip';

const CONV = [
  '【硬性慣例（全部要守）】',
  '1. 書寫語言：粵語書面語（廣東話）。結構性文字（符號表、標題、表格）可中性書面語。',
  '2. content 內所有數式一律 LaTeX（$...$、$$...$$、\\dfrac、\\partial、\\tag）。全節剛好一條最核心主公式用 $\\boxed{...}$ 框出，其餘 display 唔加框。',
  '3. 專業詞每次出現用雙語＋全形括號：<span class="term-zh">中文</span>（<span class="term-en">English</span>）。',
  '4. content 段落順序（必備）：一、總綱 → 二、銜接點（明確點出先備節號同關係）→（可選 口語入門/比喻）→ 正式定義（含 boxed 主公式 + 符號表）→（若有圖：圖 + 讀圖導引①X軸②Y軸③關鍵特徵④易看錯）→ 逐行推導（H1：一行一動作、行末括號註明依據、嚴禁「整理可得/顯然/同理」跳步）→ Worked Examples（H8 漸進：線性內層→二次內層→高次或根號內層→混合，最後一題含至少兩種法則；逐行、每步註明、每個數字標來源）→ 易混淆對比（選配）→ 一頁總表（H10，表格集中本節所有公式）→ 診斷題組（L1–L5，每層≥2題、四選一、答案放最底、附「卡邊層→補返邊節」）。',
  '5. 圖表：只可用 [CHART:functionPlot]（唯一適合微積分嘅型別）。若放圖，content 對應位置寫 <p>[CHART:functionPlot]</p>，同時 meta.charts 放規格：{ "type":"functionPlot","title":"...","params":{ "curves":[{"fn":"quadratic","a":1,"b":0,"c":1,"label":"...","color":"#4a9eff"}],"xrange":[-3,3],"yrange":[-1,9],"tangent":{"curve":0,"x0":1,"adjustable":true} } }。fn 只可：linear/quadratic/cubic/exp/ln/power/recip/sqrt。可加 "shade":{"curve":0,"from":0,"to":2,"color":"...","label":"面積"} 顯示曲線下面積。唔啱放圖就 charts:[]，唔好作其他型別。',
  '6. 7 條評分 quiz 放 meta.quiz（唔好放入 content）；L1–L5 診斷組放 content 文字（唔好放入 meta.quiz）。兩者唔好重複。',
  '7. ★最重要：meta.quiz 嘅 q／options／explain／strategy 一律用 UNICODE 數式（例：∂f/∂x、eˣ、x²、√、x²+1、1/x、≈、·、₀、⁻），絕對唔可以用 $ LaTeX（App 喺 quiz 區唔會渲染 KaTeX，會原樣顯示）。content 先用 LaTeX，quiz 用 unicode。',
  '8. quiz 型別與答案：single → answer＝正確選項嘅整數索引（0 起，4 個選項）；truefalse → answer＝布林 true/false；fill → answer＝字串。剛好 7 題＝3 basic＋3 standard＋1 challenge。challenge 嗰題 difficulty="challenge" 並必附 "strategy"（完整解題策略）。',
  '9. checkpoints：5–7 條自足技能檢核（{"id":"c1","text":"..."}），嚴禁外部依賴（唔可「去Khan/Paul/睇片/做練習頁」）。',
  '10. meta.json 必須係合法 JSON：{ "objective":"一句學習目標(unicode數式)", "fieldLink":"(extension≠none先寫，否則空字串)", "checkpoints":[...], "charts":[...或[]], "quiz":[7題] }。',
].join('\n');

const SPECS = [
  {
    id: 'S17', title: '多變數函數概念', cognition: 'concept', prereq: 'S2（函數 y=f(x) 一入一出、圖形）、S8',
    extension: 'life',
    brief: [
      '【本節要教】由單變數 f(x)（S2）推廣到多變數：z=f(x,y)、w=f(x,y,z)——多個輸入、一個輸出。',
      '- 概念入口（粵語白話＋生活比喻，extension=life）：用一個日常多變數例子帶入，例如體感溫度＝f(氣溫,濕度,風速)；或半導體現場接合品質＝f(溫度T,壓力P,時間t)。',
      '- 正式定義：多變數函數記法 z=f(x,y)、定義域/值域、點 (x,y) 對應一個高度 z。主公式 boxed 框「z=f(x,y) 一般式定義」（概念節嘅主「公式」即係呢個記法定義）。附符號表。',
      '- 關鍵概念：「固定其中一個變數」就會塌返做 S2 識嘅單變數函數（為 S18 偏微分鋪路）。可選放一個 [CHART:functionPlot]：顯示 f(x,y) 喺固定 y=某值嘅 slice（例如 f=x²+y² 固定 y=1 → quadratic a=1,c=1），讀圖導引帶出「固定一個變數＝切一刀變單變數曲線」。',
      '- 易混淆：z=f(x,y)（一個輸出）vs 兩個獨立函數；輸入多≠輸出多；f(x,y) 同 f(y,x) 次序意義。',
      '- Worked Examples（概念節，以「理解＋代值＋固定變數」漸進，唔好做偏微分，偏微分係 S18）：例1 線性 f(x,y)=2x+3y 代 (1,2) 求值；例2 二次 f(x,y)=x²+y² 代值＋固定一個變數睇變化；例3 三變數 f(x,y,z)=xyz 或 x²y+z 代值；例4 混合/現場 f(T,P,t) 概念：判斷固定其餘變數時邊個輸入令輸出升。',
      '- 一頁總表：記法、定義域、固定變數概念、例子彙整。診斷組 L1–L5。',
    ].join('\n'),
  },
  {
    id: 'S18', title: '偏微分（一）：概念', cognition: 'concept', prereq: 'S17（多變數）、S8（單變數導數規則）、S7（導數＝切線斜率）',
    extension: 'none',
    brief: [
      '【本節要教｜旗艦核心】偏導數 ∂f/∂x ＝「固定其他所有變數做常數，淨係對 x 求導」。幾何意義＝喺曲面上沿 x 方向切一刀，嗰條 slice 曲線嘅切線斜率。',
      '- 銜接點：S17 多變數、S8 單變數導數規則、S7 導數＝切線斜率。',
      '- 正式定義 + 主公式 boxed：框 $\\boxed{\\dfrac{\\partial f}{\\partial x}}$（固定 y 對 x 求導）嘅定義；可同時寫極限定義式做衍生（唔加框）。符號表（∂ 偏微分符號 partial derivative、f、x、被固定嘅變數）。',
      '- 圖表 [CHART:functionPlot]（必放，呢節靠圖最有力）：f(x,y)=x²+y² 固定 y=1 → slice＝x²+1（fn quadratic, a=1,b=0,c=1），加 tangent adjustable x0，切線斜率＝2x＝∂f/∂x。讀圖導引講清楚「呢條切線斜率就係偏導數」。',
      '- 計算照舊：偏微分用返 S8/S9 嘅單變數規則，唯一分別係「其他變數當常數」。',
      '- Worked Examples（概念節，著重理解＋算一兩個偏導，漸進）：例1 線性 f=3x+2y 求 ∂/∂x、∂/∂y；例2 二次 f=x²+y² 求兩個偏導；例3 含乘積 f=x²y（求 ∂/∂x 時 y 當常數）；例4 混合 f=x²y+eˣ（兩種一齊，預告 S19）。逐行、每步註明「y 當常數，導數 0」。',
      '- 易混淆：∂（偏微分）vs d（常微分）符號；求 ∂/∂x 時 ∂(y³)/∂x=0；唔好連 y 一齊微。',
      '- 一頁總表 + 診斷組 L1–L5。extension=none（唔放現場 fieldLink；可一句輕帶熱力學 ∂G/∂T 之類預告，唔硬湊）。',
    ].join('\n'),
  },
  {
    id: 'S19', title: '偏微分（二）：計算', cognition: 'calculation', prereq: 'S18（偏微分概念）、S8/S9（導數規則、內層版）',
    extension: 'none',
    brief: [
      '【本節要教】實際計算偏導數嘅標準流程：鎖定一個變數做主角、其餘全部當常數、套返 S8/S9 規則（含 eᵘ·u′、u′/u 內層版，內層只對主角變數求導）。',
      '- 主公式 boxed：框一條最代表偏微分計算嘅式，例如 $\\boxed{\\dfrac{\\partial}{\\partial x}\\left(x^{n}y^{m}\\right)=n\\,x^{n-1}y^{m}}$（y^m 當常數提出）。符號表。',
      '- 多個偏導：示範同一個 f 分別求 ∂/∂x 同 ∂/∂y；輕帶二階偏導記法 ∂²f/∂x²、混合 ∂²f/∂x∂y（唔使深入，留返後面）。',
      '- Worked Examples（計算節，嚴格 H8 漸進，逐行＋每步註明「__ 當常數」＋每個數字溯源）：例1 多項式 f=3x²+2y（分別 ∂x、∂y）；例2 乘積 f=x²y³（求兩個偏導，另一變數當常數）；例3 內層型 f=e^(xy) 或 f=ln(x²+y)（用 S9 內層版：∂/∂x 時內層對 x 導，例如 e^(xy) 對 x ＝ y·e^(xy)）；例4 混合 f=x²y+e^(2x)+ln(y)（多種法則一齊）。',
      '- 易混淆：求 ∂/∂x 時 ∂(y³)/∂x=0；e^(xy) 對 x 偏導要乘內層 ∂(xy)/∂x=y；唔好把要當常數嘅變數當咗變數。',
      '- 一頁總表（各型偏導結果彙整）+ 診斷組 L1–L5。圖表可放可唔放（計算節重點唔係圖，唔啱就 charts:[]）。',
    ].join('\n'),
  },
  {
    id: 'S20', title: '偏微分練習', cognition: 'calculation', prereq: 'S19（偏微分計算）',
    extension: 'none',
    brief: [
      '【本節要教】鞏固偏微分計算 + 用粵語白話「讀」出偏導數嘅實際意義（變化率解讀）：∂f/∂x ＝ 固定其他變數時，x 升一單位 f 變幾多。',
      '- 主公式 boxed：框偏導數嘅口語化/變化率解讀，例如 $\\boxed{\\dfrac{\\partial f}{\\partial x}\\approx \\dfrac{\\Delta f}{\\Delta x}\\Big|_{\\text{其他變數固定}}}$。符號表。',
      '- 口訣：「鎖定主角、其餘當常數、套規則、再讀返意義」。每題做完都用一句粵語讀返個偏導數講緊咩。',
      '- Worked Examples（H8 漸進，每題加「口語化解讀」）：例1 線性；例2 二次/乘積；例3 內層（指數或對數）；例4 混合，並用半導體現場式 f(T,P,t)＝接合品質 做「∂(品質)/∂T 即係固定壓力時間、溫度升一度品質變幾多」嘅解讀（當例題內容，唔當 fieldLink）。',
      '- 易混淆：口語化解讀時要講明「其他變數固定」先成立；∂f/∂x 同 ∂f/∂y 解讀唔同。',
      '- 一頁總表（口訣 + 解讀模板）+ 診斷組 L1–L5。',
    ].join('\n'),
  },
];

function preamble(spec) {
  return [
    '【必讀（用 Read 工具完整讀晒）】',
    '1. 唯一施工指令／硬性規範 H1–H10：' + STD,
    '2. 黃金輸出樣本（已按新規範重建嘅 S9，照佢結構同 content/quiz 寫法）：' + GOLD,
    '3.（風格參考，計算深講節）：' + GOLD2,
  ].join('\n');
}

function draftPrompt(spec, tag) {
  return [
    '你係資深數學教材作者，為一個粵語深色互動學習 App 寫一節「可取代教科書」嘅 core 深講課：' + spec.id + '《' + spec.title + '》。',
    '',
    preamble(spec),
    '',
    '【本節規格】id=' + spec.id + '｜tier=core 深講｜cognition=' + spec.cognition + '｜先備：' + spec.prereq + '｜extension=' + spec.extension,
    spec.brief,
    '',
    CONV,
    '',
    '【產出：用 Write 寫兩個檔（草稿 ' + tag + '）】',
    '1. ' + WIP + '/' + spec.id + '.' + tag + '.md — 純 content markdown（粵語、全 LaTeX、boxed 主公式、銜接點、Worked Examples 漸進、易混淆、一頁總表、L1–L5 診斷組）。唔好放 7 條評分 quiz。',
    '2. ' + WIP + '/' + spec.id + '.' + tag + '.meta.json — 合法 JSON：{objective, fieldLink, checkpoints, charts, quiz(7題 unicode)}。',
    '',
    '寫完用兩三句講你版本嘅重點同最唔肯定嘅位。呢個係草稿，之後會被合成。',
  ].join('\n');
}

function synthPrompt(spec) {
  return [
    '你係主編，要把 ' + spec.id + '《' + spec.title + '》兩份獨立草稿合成一份最強最終版。',
    '',
    preamble(spec),
    '',
    '【讀兩份草稿】用 Read：',
    '  ' + WIP + '/' + spec.id + '.A.md 同 ' + WIP + '/' + spec.id + '.A.meta.json',
    '  ' + WIP + '/' + spec.id + '.B.md 同 ' + WIP + '/' + spec.id + '.B.meta.json',
    '揀每部分最好嘅、補對方缺漏、即場修正你見到嘅數學或規範問題，合成一份。',
    '',
    '【本節規格】' + spec.brief,
    '',
    CONV,
    '',
    '【產出：用 Write 寫最終兩個檔】',
    '  ' + WIP + '/' + spec.id + '.content.md',
    '  ' + WIP + '/' + spec.id + '.meta.json',
    '寫完逐項對規範第 6 節檢查表自檢，用三四句報告你合成同改正咗咩。',
  ].join('\n');
}

const VERDICT = {
  type: 'object',
  properties: {
    pass: { type: 'boolean' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
          where: { type: 'string' },
          problem: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'where', 'problem', 'fix'],
      },
    },
  },
  required: ['pass', 'issues'],
};

const FIXRES = {
  type: 'object',
  properties: {
    fixedCount: { type: 'number' },
    remaining: { type: 'string' },
    selfCheck: { type: 'string' },
  },
  required: ['fixedCount', 'selfCheck'],
};

function verifyPrompt(spec, lens) {
  const lensDesc = lens === 'math'
    ? '數學正確性：親手重算每條公式、每步推導、每條 Worked Example、每題 quiz 嘅 answer 同 explain、診斷組答案。特別捉：偏微分時其他變數有冇真係當常數（導數應為 0）、內層導數（鏈鎖）有冇漏或計錯、quiz single 嘅 answer 索引啱唔啱、truefalse 布林啱唔啱、fill 字串啱唔啱、challenge strategy 對唔對、診斷組標答對唔對。'
    : '規範＋格式合規：H1（逐行、行末註明、無「整理可得/顯然/同理」跳步）、H3（每條公式有符號表）、H7（全節剛好一條 \\boxed）、H8（例題線性→二次→高次→混合，最後一題含兩種法則）、H9（銜接點段落有指明先備節號）、H10（一頁總表）、H5（雙語全形括號＋term-zh/term-en class）、H0.6（content 全 LaTeX 無純文字數式）、粵語書面語；★quiz 必須 unicode 數式、嚴禁 $ LaTeX；charts 只可 functionPlot 且 [CHART] 佔位符同 meta.charts 一一對應；診斷組 L1–L5 每層≥2題且喺 content 唔喺 meta.quiz；quiz 剛好 7 題 3/3/1。';
  return [
    '你係對抗式審查員，職責係盡力揾錯，唔好客氣、唔好放水。你淨係負責一個面向：' + lens + '。',
    '',
    '【必讀】Read 規範：' + STD + '；黃金樣本：' + GOLD,
    '【審查對象】Read：' + WIP + '/' + spec.id + '.content.md 同 ' + WIP + '/' + spec.id + '.meta.json',
    '',
    '【你嘅面向】' + lensDesc,
    '',
    '逐項揾出所有問題。pass 只可以喺真係冇 blocker 同 major 先設 true。每個 issue 要寫清楚位置（section/公式/題號）、咩問題、點修。唔好自己改檔，淨係回報 issues。',
  ].join('\n');
}

function fixPrompt(spec, issues) {
  return [
    '你係修訂員，要根據對抗審查意見，直接修正 ' + spec.id + ' 嘅檔。',
    '',
    '【必讀】Read 規範：' + STD,
    '【要改嘅檔】先 Read 返：' + WIP + '/' + spec.id + '.content.md 同 ' + WIP + '/' + spec.id + '.meta.json，再用 Edit/Write 改。',
    '',
    '【審查意見（逐條處理；數學錯誤同規範違反必改）】',
    JSON.stringify(issues, null, 2),
    '',
    '改完自己快速核對：content 剛好一條 \\boxed；meta.quiz 7 題、unicode、3/3/1、challenge 有 strategy；診斷組喺 content；雙語全形括號。回報修咗幾多同仲有冇未解決顧慮。',
  ].join('\n');
}

async function buildSession(spec) {
  log('▶ ' + spec.id + ' ' + spec.title + '：開始（雙稿）');
  await parallel([
    () => agent(draftPrompt(spec, 'A'), { label: 'draft ' + spec.id + '.A', phase: '1·雙稿' }),
    () => agent(draftPrompt(spec, 'B'), { label: 'draft ' + spec.id + '.B', phase: '1·雙稿' }),
  ]);
  await agent(synthPrompt(spec), { label: 'synth ' + spec.id, phase: '2·合成' });
  const verds = await parallel([
    () => agent(verifyPrompt(spec, 'math'), { label: 'verify ' + spec.id + '·數學', phase: '3·對抗驗證', schema: VERDICT }),
    () => agent(verifyPrompt(spec, 'standard'), { label: 'verify ' + spec.id + '·規範', phase: '3·對抗驗證', schema: VERDICT }),
  ]);
  const issues = verds.filter(Boolean).flatMap(v => v.issues || []);
  log('  ' + spec.id + '：對抗驗證揾到 ' + issues.length + ' 個問題' + (issues.length ? '，進入修正' : '，免修'));
  let fix = null;
  if (issues.length) fix = await agent(fixPrompt(spec, issues), { label: 'fix ' + spec.id, phase: '4·修正', schema: FIXRES });
  return { id: spec.id, issues: issues.length, pass: verds.every(v => v && v.pass), fix };
}

const results = await parallel(SPECS.map(s => () => buildSession(s)));
log('Week 2 模塊A 完成：' + results.filter(Boolean).map(r => r.id + '(問題' + r.issues + ')').join('、'));
return results;
