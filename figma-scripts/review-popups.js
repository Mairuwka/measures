// Вставить в use_figma, задав сначала: const SRC = '2092:87'; — вызывать по порядку для всех секций из ORDER (повторы ищутся в предыдущих секциях).
// Секция «11 · Поп-апы в полную высоту»: все окна поп-апов (экраны P-…, И-…, S-06.c), развёрнутые на всю высоту контента.
// Параметр SRC — ID секции-источника (строка в секции 11 на каждую секцию-источник).
const ORDER = ['2092:87','2096:87','2056:87','2076:88','2104:88','2110:87','2116:88'];
const pg = await figma.getNodeByIdAsync('2012:87'); await figma.setCurrentPageAsync(pg);
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' }); await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
const C = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const NAME = '11 · Поп-апы в полную высоту (окна развёрнуты, без прокрутки)';
const X0 = 8880 + 8480 + 400, SECW = 8480, P = 24, MAXX = SECW - 120, OV = 9;
let sec = pg.children.find(s => s.type === 'SECTION' && s.name === NAME); let created = false;
if (!sec) { sec = figma.createSection(); sec.name = NAME; pg.appendChild(sec); sec.x = X0; sec.y = 0; sec.resizeWithoutConstraints(SECW, 400); sec.fills = [{ type: 'SOLID', color: C('#141414') }]; created = true; }
const txt = (s, size, bold, w) => { const t = figma.createText(); t.fontName = { family: 'Inter', style: bold ? 'Bold' : 'Medium' }; t.fontSize = size; t.fills = [{ type: 'SOLID', color: bold ? C('#f2f2f2') : C('#9d9d9d') }]; if (!bold) t.lineHeight = { unit: 'PERCENT', value: 150 }; t.characters = s; if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } sec.appendChild(t); return t; };
function sig(n) { let s = ''; for (const x of [n, ...n.findAll(() => true)]) { s += `|${x.type[0]}${x.name}${Math.round(x.width)}x${Math.round(x.height)}@${Math.round(x.x)},${Math.round(x.y)}${x.visible ? '' : '-'}`; if (x.type === 'TEXT') s += x.characters; if ('fills' in x && x.fills !== figma.mixed) for (const f of x.fills) s += f.type === 'SOLID' ? `${Math.round(f.color.r * 255)}${Math.round(f.color.g * 255)}${Math.round(f.color.b * 255)}` : (f.imageHash || f.type[0]); }
  let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36) + s.length.toString(36); }
const isPopupScreen = s => /^(P-|И-|S-06\.c)/.test(s.name);
const modalsOf = s => s.children.filter(c => c.visible && c.type === 'FRAME' && /^(modal|P-16 · modal)/.test(c.name) && !(/^(S-06\.c|P-03)/.test(s.name) && c.name === 'modal_small')); // под S-06.c и P-03 лежит окно экрана S-06, это не поп-ап
const seen = {};
for (const sid of ORDER) { if (sid === SRC) break; const sc = await figma.getNodeByIdAsync(sid);
  for (const s of sc.children) if (s.type === 'FRAME' && isPopupScreen(s)) for (const m of modalsOf(s)) seen[sig(m)] = s.name.split(' · ')[0]; }
const src = await figma.getNodeByIdAsync(SRC);
let y = 120; for (const c of sec.children) y = Math.max(y, c.y + c.height + 240);
const t1 = txt(src.name, 48, true); t1.x = 120; t1.y = y; y += t1.height + 40;
let x = 120, lineBottom = y; const made = [], dups = [], ovStats = [];
for (const s of src.children) {
  if (s.type !== 'FRAME' || !isPopupScreen(s)) continue;
  const code = s.name.split(' · ')[0];
  for (const m of modalsOf(s)) {
    const k = sig(m); if (seen[k]) { dups.push(`${code}: ${m.name} = ${seen[k]}`); continue; } seen[k] = code;
    const w = figma.createFrame(); sec.appendChild(w); w.name = `pop · ${code} · ${m.name}`; w.clipsContent = true; w.fills = [{ type: 'SOLID', color: C('#141414') }];
    const bgs = s.children.filter(c => c.type === 'RECTANGLE' && c.visible);
    const rects = bgs.map(r => { const c = r.clone(); w.appendChild(c); c.x = r.x - m.x + P; c.y = r.y - m.y + P; return c; });
    const cl = m.clone(); w.appendChild(cl); cl.x = P; cl.y = P;
    let note = '';
    const pat = cl.children.find(c => c.name === 'pattern'); const mc = pat && pat.findOne(c => c.name === 'modal_container');
    if (pat && mc) {
      const tab = pat.children.find(c => c.name === 'modal_tab_bar' && c.visible);
      let contentB = 0; for (const c of mc.children) if (c.visible && c.layoutPositioning !== 'ABSOLUTE') contentB = Math.max(contentB, c.y + c.height);
      if (mc.primaryAxisSizingMode === 'FIXED' && contentB + mc.paddingBottom > mc.height + 1) mc.primaryAxisSizingMode = 'AUTO';
      if (tab && mc.height <= pat.height) ovStats.push(Math.round(mc.height - tab.y));
      const need = tab ? Math.round(mc.height - OV + tab.height) : Math.round(mc.height);
      if (need > pat.height + 1) {
        const visible = Math.round(cl.height);
        const d = need - pat.height;
        pat.resizeWithoutConstraints(pat.width, need);
        if (tab) tab.y = need - tab.height;
        cl.resizeWithoutConstraints(cl.width, cl.height + d);
        const sl = mc.children.find(c => c.name === 'slider'); if (sl) sl.visible = false;
        const vec = pat.children.find(c => c.type === 'VECTOR');
        if (vec && vec.y + vec.height < need) { const v2 = vec.clone(); pat.insertChild(pat.children.indexOf(vec) + 1, v2); v2.x = vec.x; v2.y = vec.y + vec.height; }
        note = `\nразвёрнуто: ${visible} → ${Math.round(cl.height)} px, на экране прокрутка`;
      }
    }
    const W = Math.round(cl.width + 2 * P), H = Math.round(cl.height + 2 * P); w.resizeWithoutConstraints(W, H); cl.x = P; cl.y = P;
    for (const r of rects) if (r.y + r.height < H) r.resize(r.width, H - r.y);
    const cap = txt(`${s.name}\n${m.name}${note}`, 18, false);
    const colW = Math.max(W, cap.width);
    if (x > 120 && x + colW > MAXX) { x = 120; y = lineBottom + 120; }
    cap.x = x; cap.y = y; w.x = x; w.y = y + cap.height + 12;
    x += colW + 80; lineBottom = Math.max(lineBottom, w.y + H);
    made.push(w.id);
  }
}
if (dups.length) { const t = txt('Совпадают с уже показанными окнами: ' + dups.join('; ') + '.', 18, false, 7600); t.x = 120; t.y = lineBottom + 40; lineBottom = t.y + t.height; }
let maxB = 0; for (const c of sec.children) maxB = Math.max(maxB, c.y + c.height);
sec.resizeWithoutConstraints(SECW, maxB + 120);
return { sec: sec.id, created, secH: sec.height, made: made.length, dups, ovStats: [...new Set(ovStats)] };
