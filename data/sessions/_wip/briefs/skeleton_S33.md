# S33 結構骨架（core 概念節範式；照呢個結構/語氣/排版，內容換做本節主題）

## content.md 段落骨架（粵語書面語、全 LaTeX；每段都要寫足，唔好留空）
```
<!-- {id} 合成最終版｜新規範 v2（粵語書面語）｜tier: …｜cognition: …｜extension: … -->
<!-- 專業詞用 span class 包裹，全形（）分隔 -->

## 一、總綱            ← 一兩句點出本節核心
## 二、銜接點          ← H9：本節依賴(節號)/同已學關係/未掌握先補邊節/本節係邊節地基
## 三、先講白話        ← 粵語白話/比喻帶入（有好比喻先放）
## 四、正式定義        ← 嚴謹定義＋標準符號；可附「粒子/概念對照表」
## 五、主公式 …        ← $$\boxed{主公式}$$ + 式(1) 符號表 + 逐行移項推導（每行一動作、行末括號標依據）
## 六、…              ← 衍生關係/分情況（如中性 vs 離子）；公式編號式(2)(3)…，各附符號表或沿用說明
## 七、…              ← 概念延伸（如同位素）；可用對照表
## 八、…（次要公式）   ← 如有第二條公式：式(4)+符號表（普通 display，唔加 boxed）
## 九、睇圖：…（含讀圖導引）  ← 內嵌 <svg …>（circle/line/rect/text）+ ①X②Y③特徵④易錯 讀圖導引
## 十、Worked Examples ← H8 漸進：例1(易)→例2(中)→例3(較複雜)→例4(混合/完整計算)；逐步、每數字標來源、答案用引言塊
## 十一、易混淆對比     ← markdown 表：容易混 | 正確理解
## 十二、一頁總表       ← H10：表格集中本節所有公式/結果
## 十三、診斷題組（L1–L5）← 每層≥2 題 single-select；尾「診斷答案：D1 …」+「卡喺X→重睇Y」導引
```
> App quiz **唔寫入 content.md**（喺 meta.json）。bridge/tool 節：可省略第八–十三節中嘅深講部分，按 tier 篇幅縮減。

## meta.json 欄位（型別）
```
{
  "objective": "字串（本節學習目標、一段、講到 為下節打底）",
  "fieldLink": "字串（extension=none 就空 \"\"；有現場連結先寫）",
  "checkpoints": [ { "id":"c1", "text":"自足技能驗證（唔可叫人去外部平台做題）" }, … 4–6 條 ],
  "resources": [ { "type":"video|link|paper", "label":"（選看）…", "url":"…" } ],   // 1 條
  "charts": [],                                                                    // SVG 內嵌喺 content
  "quiz": [
    { "type":"single", "difficulty":"basic|standard", "q":"…unicode 數式…",
      "options":["…","…","…","…"], "answer":0, "explain":"點解啱＋常見錯選" },
    { "type":"truefalse", "difficulty":"…", "q":"…", "answer":true, "explain":"…" }
    // core 3–4 題（建議 2 basic+2 standard）；全 single/truefalse；唔可 fill
  ],
  "chatPracticeHints": [ "≤15字粵語最易錯題型", … 2–3 條 ]
}
```
