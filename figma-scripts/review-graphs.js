// Графики по раундам (UI-12 · Round_graph) в окнах P-10: 5 точек — старт, раунды 1–3, текущее значение.
// Последняя точка = главное значение окна, предпоследняя — из бейджа изменения (± % — относительное, п.п./абсолютное — разность).
// Ранние точки — правдоподобная история (детерминированно по коду окна). Шкала: 6 делений, шаг «круглый».
// Вызов: задать перед кодом const ONLY = null | ['P-10.01']; применяется к окнам секции 05 и копиям в секции 11.
const pg = await figma.getNodeByIdAsync('2012:87'); await figma.setCurrentPageAsync(pg);
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' }); await figma.loadFontAsync({ family: 'Inter', style: 'Regular' }); await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
const num = (s) => { const m = s.replace(/ /g, ' ').match(/[−+-]?\d[\d ]*(,\d+)?/); return m ? parseFloat(m[0].replace(/ /g, '').replace(',', '.').replace('−', '-')) : NaN; };
const fmt = (v, dec) => { const s = Math.abs(v).toFixed(dec).split('.'); s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return (v < 0 ? '−' : '') + s.join(','); };
const nice = (x) => { const p = Math.pow(10, Math.floor(Math.log10(x))); const f = x / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; };
const KS = [[0.7, 1.2, 0.5], [1.1, -0.4, 0.9], [0.5, 0.9, -0.6], [1.3, 0.6, 0.8], [0.9, -0.7, 1.2]];
const sec05 = await figma.getNodeByIdAsync('2104:88');
const sec11 = pg.children.find(s => s.type === 'SECTION' && /^11 · /.test(s.name));
const out = [];
for (const scr of sec05.children) {
  if (scr.type !== 'FRAME' || !/^P-10\.\d\d /.test(scr.name)) continue;
  const code = scr.name.split(' · ')[0];
  if (ONLY && !ONLY.includes(code)) continue;
  const scopes = [scr.children.find(c => /^modal/.test(c.name)), ...sec11.children.filter(c => c.type === 'FRAME' && c.name.startsWith(`pop · ${code} `))];
  const head = scopes[0].findOne(n => n.type === 'FRAME' && /^(metUp|metDown|metN)/.test(n.name));
  const ts = head.findAll(n => n.type === 'TEXT' && n.characters !== 'Текст ошибки').map(t => t.characters);
  const v4 = num(ts[1]); const b = ts[2] || '';
  const bv = num(b);
  const v3 = /%$/.test(b.trim()) && !/п\.п\./.test(b) ? v4 / (1 + bv / 100) : v4 - (isNaN(bv) ? 0 : bv);
  const d = v4 - v3; let h = 0; for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0; const k = KS[h % KS.length];
  const isPct = /%/.test(ts[1]);
  const v2 = v3 - d * k[0], v1 = v2 - d * k[1], v0 = v1 - d * k[2];
  let ser = [v0, v1, v2, v3, v4].map(v => Math.max(0, v));
  if (isPct && v4 <= 100) ser = ser.map(v => Math.min(100, v));
  const mn = Math.min(...ser), mx = Math.max(...ser);
  let step = nice(Math.max((mx - mn) / 4, Math.abs(v4) * 0.002 || 0.01));
  let lo = Math.floor(mn / step) * step; if (lo > 0 && mn - lo < step * 0.3) lo -= step; lo = Math.max(0, lo);
  let hi = lo + 5 * step; while (hi < mx) { step = nice(step * 1.5); lo = Math.max(0, Math.floor(mn / step) * step); hi = lo + 5 * step; }
  const dec = Math.max(0, Math.min(2, -Math.floor(Math.log10(step) + 1e-9)));
  const labels = [0, 1, 2, 3, 4, 5].map(i => fmt(hi - i * step, dec));
  for (const sc of scopes) {
    const rg = sc.findOne(n => n.type === 'FRAME' && /Round_graph/.test(n.name)); if (!rg) continue;
    const cnt = rg.findOne(n => n.name === 'count');
    cnt.children.forEach((t, i) => { t.characters = labels[i]; try { t.layoutSizingHorizontal = 'HUG'; } catch (e) {} });
    const g = rg.findOne(n => n.name === 'Graph');
    const W = g.width, H = g.height, n = ser.length;
    const P = ser.map((v, i) => [4 + i * (W - 8) / (n - 1), (hi - v) / (hi - lo) * H]);
    const line = 'M ' + P.map(p => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' L ');
    const [fillV, strokeV] = g.children;
    for (const v of [fillV, strokeV]) { v.x = 0; v.y = 0; }
    strokeV.vectorPaths = [{ windingRule: 'NONE', data: line }];
    fillV.vectorPaths = [{ windingRule: 'NONZERO', data: `${line} L ${P[n - 1][0].toFixed(2)} ${H} L ${P[0][0].toFixed(2)} ${H} Z` }];
    rg.name = `UI-12 · Round_graph (старт, Р1–Р3, текущий: ${ts[1]})`;
  }
  out.push(`${code}: ${ser.map(v => fmt(v, dec + 1)).join(' → ')} | шкала ${labels[5]}…${labels[0]}`);
}
return out;
