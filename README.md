# FoundationLearn

三個月入學前補底計劃 — 互動學習追蹤 App  
192 節 × 45 分鐘 = 144 小時 | 中興大學材料所碩士在職專班

---

## 快速啟動

**必須用本機伺服器開啟，不能直接用 `file://`**（瀏覽器安全策略限制 JSON fetch）。

### 方法一：VS Code Live Server（推薦）

1. 安裝 VS Code 擴充功能「Live Server」
2. 用 VS Code 開啟 `foundationlearn/` 資料夾
3. 右鍵點 `index.html` → **Open with Live Server**
4. 瀏覽器自動開啟 `http://localhost:5500`

### 方法二：Python

```bash
cd foundationlearn/
python -m http.server 8080
# 瀏覽器開啟 http://localhost:8080
```

### 方法三：Node.js

```bash
npx serve .
```

---

## 目錄結構

```
foundationlearn/
├── index.html          ← 主程式（HTML 骨架）
├── style.css           ← 深色主題 CSS
├── app.js              ← 完整應用邏輯
├── data/
│   ├── manifest.json   ← 課程目錄（192 節結構）
│   └── sessions/
│       ├── S1.json     ← 已完整填寫
│       ├── S7.json
│       ├── S88.json
│       ├── S90.json    ← 核心：Arrhenius ★
│       ├── S91.json
│       ├── S100.json   ← 核心：相圖讀圖 ★
│       ├── S103.json   ← 核心：共晶系統 ★
│       ├── S133.json   ← 核心：Gibbs 自由能 ★
│       ├── S140.json   ← 核心：自由能推相圖 ★
│       └── ... (其餘節次 fetch 404 時顯示「建置中」)
├── img/                ← 教學圖片（目前空白）
└── README.md
```

---

## 填寫新節次

1. 複製以下空白範本到 `data/sessions/S{n}.json`
2. 填入 `title`、`titleEn`、`objective`、`content`（Markdown）
3. 填 `checkpoints`（3–5 個勾選動作）
4. 填 `quiz`（至少 1 道題目）
5. 把 `status` 從 `"draft"` 改成 `"done"`

### 空白範本

```json
{
  "id": "S__",
  "stage": 0, "week": 0, "order": 0,
  "title": "",
  "titleEn": "",
  "platform": "callister",
  "objective": "",
  "isCore": false,
  "status": "draft",
  "content": "",
  "fieldLink": "",
  "checkpoints": [
    { "id": "c1", "text": "" },
    { "id": "c2", "text": "" }
  ],
  "resources": [],
  "charts": [],
  "quiz": []
}
```

### 互動圖表宣告式填法

```json
"charts": [
  {
    "type": "arrhenius",
    "title": "Arrhenius 圖",
    "params": { "D0": 1e-4, "Q": 80000, "Trange": [400, 1400] }
  }
]
```

支援的 `type`：`arrhenius` | `phaseDiagram` | `crystal3d` | `stressStrain` | `freeEnergy`

### 題目類型

| type | 說明 |
|------|------|
| `single` | 單選（options[], answer: index） |
| `multi` | 多選（options[], answer: [indices]） |
| `fill` | 填空（answer: 字串/數字，tolerance: 容差）|
| `truefalse` | 是非（answer: true/false）|
| `free` | 自由作答（只存檔，不評分）|

---

## 常見問題

**Q：打開後空白或 console 有 fetch 錯誤？**  
A：必須用本機伺服器（見快速啟動）。不能 file:// 直接開。

**Q：如何備份學習記錄？**  
A：設定頁面 → 匯出 JSON → 下載 `fl_backup_YYYY-MM-DD.json`

**Q：換電腦/瀏覽器記錄消失？**  
A：先在舊環境匯出 JSON，新環境匯入即可還原。

**Q：某節內容沒有顯示，只看到「建置中」？**  
A：該節的 JSON 檔案尚未建立或 `status` 仍是 `"draft"`。但你仍可打勾完成。

---

## 開發里程碑

- [x] M0：目錄結構
- [x] M1：應用骨架（課程地圖、儀表板、i18n）
- [x] M2：單節學習頁（Markdown + KaTeX + 完成機制）
- [x] M3：進度系統（Streak、匯出/匯入）
- [x] M4：互動圖表（Arrhenius、相圖、3D 晶體、應力應變、自由能）
- [x] M5：練習題引擎（single、multi、fill、truefalse、free）
- [ ] M6：美化 + 成就徽章 + DriveStore
- [ ] 內容：S1-S16（Week 1）✓、Week 6 核心 ✓、Week 7 核心 ✓、Week 9 核心 ✓

---

*節奏比強度重要。先把四個核心週跑起來，再逐節擴充。*
