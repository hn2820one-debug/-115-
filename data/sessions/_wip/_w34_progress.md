# Week 3–4 建置進度帳（斷點續做用）

> 規範：`Background/筆記規範.md`（v2）｜黃金樣本：`Background/Golden Session/`、已建 exemplar `data/sessions/S33.json`
> Pipeline：`_wip/wf_build_session.js`（多 agent：寫→驗→修→組裝）＋ `_wip/assemble_w3.js`（維度＋驗證）
> 每堂 agent 直接寫 `_wip/{id}.content.md` + `{id}.meta.json`，再 `node assemble_w3.js {id}` → `data/sessions/{id}.json`
> **完成判準（磁碟為準）**：`data/sessions/{id}.json` 存在、可解析、status=done。續做＝揾未有 JSON 嘅 id 繼續。

## 續做步驟（下次接手）
1. 睇下表 status；或掃 `data/sessions/` 邊啲 S34–S64 已有 JSON。
2. 把仲係 `pending` 嘅 id 傳入 workflow：`Workflow({scriptPath:'…/_wip/wf_build_session.js', args:{sessions:[…], base, spec, plan, gold, exemplar}})`。
3. 每堂完成後：spot-check JSON → 更新本帳 → 改 manifest sessionMeta isCore（core/backbone=true）→ git commit + push。

## Week 3（S34–S48，stage1 week3）
| id | 標題 | tier | cognition | ext | status |
|---|---|---|---|---|---|
| S33 | 原子結構（一） | core | concept | none | ✅ done（已 push live）|
| S34 | 原子結構（二）：電子組態 | core | concept | none | ⏳ pending |
| S35 | 週期表邏輯 | bridge | concept | none | ⏳ pending |
| S36 | 化學鍵總覽 | core | concept | life | ⏳ pending |
| S37 | 金屬鍵深入 | core | concept | life | ⏳ pending |
| S38 | 共價鍵深入 | core | concept | life | ⏳ pending |
| S39 | 鍵結與材料性質 | core | concept | life | ⏳ pending |
| S40 | 鍵能與鍵長 | core | concept | life | ⏳ pending |
| S41 | 化學計量基礎 | bridge | calculation | none | ⏳ pending |
| S42 | 化學反應與能量 | core | concept | life | ⏳ pending |
| S43 | 化學平衡（一） | core | concept | none | ⏳ pending |
| S44 | 化學平衡（二）：溫度影響 | core | concept | life | ⏳ pending |
| S45 | 氧化還原基礎 | core | concept | packaging | ⏳ pending |
| S46 | Week 3 整理 | tool | synthesis | none | ⏳ pending |
| S47 | Week 3 練習 | tool | concept | none | ⏳ pending |
| S48 | Week 3 檢討 + 輸出 | tool | synthesis | none | ⏳ pending |

## Week 4（S49–S64，stage1 week4）
| id | 標題 | tier | cognition | ext | status |
|---|---|---|---|---|---|
| S49 | 溫度與熱 | core | concept | life | ⏳ pending |
| S50 | 熱力學第零定律 | core | concept | none | ⏳ pending |
| S51 | 熱力學第一定律（一） | core | concept | none | ⏳ pending |
| S52 | 熱力學第一定律（二） | core | calculation | none | ⏳ pending |
| S53 | 熵與第二定律（直覺） | core | concept | life | ⏳ pending |
| S54 | 比熱與熱容 | core | calculation | life | ⏳ pending |
| S55 | 熱傳導概念 | core | concept | packaging | ⏳ pending |
| S56 | 熱膨脹（TEC） | core | concept | packaging | ⏳ pending |
| S57 | 晶體與非晶 | core | concept | life | ⏳ pending |
| S58 | 單位晶胞概念 | core | concept | none | ⏳ pending |
| S59 | 三大金屬結構 | core | recall | none | ⏳ pending |
| S60 | 原子堆積與密度 | core | calculation | none | ⏳ pending |
| S61 | 晶面與晶向（入門） | bridge | concept | none | ⏳ pending |
| S62 | 第一階段大整理（一） | tool | synthesis | none | ⏳ pending |
| S63 | 第一階段大整理（二） | tool | calculation | none | ⏳ pending |
| S64 | 第一階段收尾 + 輸出 | tool | synthesis | none | ⏳ pending |
