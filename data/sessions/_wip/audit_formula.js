// Audit: find LaTeX backslash-punctuation sequences inside $...$ / $$...$$ that
// marked.js (CommonMark) will mangle BEFORE KaTeX runs, because content is fed to
// marked.parse() first (see app.js renderLessonContent). CommonMark escapes
// backslash followed by ASCII punctuation, silently dropping the backslash.
const fs = require('fs');
const path = require('path');

const DIR = path.resolve(__dirname, '..'); // data/sessions
// ASCII punctuation that CommonMark treats as escapable (backslash gets eaten):
const ESCAPABLE = new Set('!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~\\'.split(''));

// Extract math spans from content. Handles $$...$$ (display) and $...$ (inline).
function mathSpans(s) {
  const spans = [];
  const re = /\$\$([\s\S]*?)\$\$|\$([^$\n]+?)\$/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    spans.push({ body: m[1] !== undefined ? m[1] : m[2], display: m[1] !== undefined, idx: m.index });
  }
  return spans;
}

// Find backslash+escapable-punctuation occurrences (what marked will damage).
function findMangled(body) {
  const hits = [];
  for (let i = 0; i < body.length - 1; i++) {
    if (body[i] === '\\' && ESCAPABLE.has(body[i + 1])) {
      const seq = '\\' + body[i + 1];
      hits.push(seq);
      if (body[i + 1] === '\\') i++; // skip the consumed second backslash of \\
    }
  }
  return hits;
}

const files = fs.readdirSync(DIR).filter(f => /^S\d+[A-Z]?\.json$/.test(f))
  .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));

let grandTotal = 0;
const summary = [];
for (const f of files) {
  let j;
  try { j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); }
  catch (e) { console.log(`!! ${f}: JSON parse error ${e.message}`); continue; }
  const content = j.content || '';
  const spans = mathSpans(content);
  const perFile = {};
  let fileTotal = 0;
  const samples = [];
  for (const sp of spans) {
    const hits = findMangled(sp.body);
    if (hits.length) {
      for (const h of hits) { perFile[h] = (perFile[h] || 0) + 1; fileTotal++; }
      if (samples.length < 3) samples.push(sp.body.trim().slice(0, 70));
    }
  }
  if (fileTotal) {
    grandTotal += fileTotal;
    summary.push({ f, fileTotal, perFile, samples });
  }
}

console.log('=== FORMULA DISPLAY AUDIT (marked eats \\+punct before KaTeX) ===\n');
for (const s of summary) {
  const breakdown = Object.entries(s.perFile).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${JSON.stringify(k)}×${v}`).join('  ');
  console.log(`${s.f.padEnd(10)} ${String(s.fileTotal).padStart(3)} hits   ${breakdown}`);
  for (const ex of s.samples) console.log(`            e.g. ${ex}`);
}
console.log(`\nFILES AFFECTED: ${summary.length} / ${files.length}`);
console.log(`TOTAL MANGLED SEQUENCES: ${grandTotal}`);
