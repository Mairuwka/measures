// Секции 09/10 страницы 2012:87: игровые экраны целиком, списки с прокруткой развёрнуты.
// Вставить в use_figma, задав перед кодом: const GROUP = 'solo' | 'team', FROM = 0, TO = 8;
// Повторный запуск продолжает сетку (4 экрана в ряд); для полной пересборки секцию сначала удалить.
// Если развёрнутый список не помещается над нижней панелью, экран удлиняется: панель и всё ниже сдвигаются, фон растягивается.
const GROUPS = {
  solo: { name: '09 · Одиночная игра: экраны целиком (списки развёрнуты)', screens: ['2171:11817','2193:11106','2195:3841'] },
  team: { name: '10 · Командная игра: экраны целиком (списки развёрнуты)', screens: ['2170:87','2170:1783','2169:3276','2169:5103','2169:6893','2169:8797','2171:87','2171:1934','2189:87','2171:5576','2171:13542','2171:7646','2171:9769','2193:4092','2192:1663','2193:87','2193:1419','2193:2766','2193:6626','2193:8326','2193:10056','2194:2113','2195:1002','2195:2334'] },
};
const pg = await figma.getNodeByIdAsync('2012:87'); await figma.setCurrentPageAsync(pg);
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' }); await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
const C = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const X0 = 8880, SECW = 8480, PER_ROW = 4, GAP = 80, GAP_CP = 24, CAPH = 120;
const G = GROUPS[GROUP];
let sec = pg.children.find(s => s.type === 'SECTION' && s.name === G.name); let created = false;
if (!sec) { sec = figma.createSection(); sec.name = G.name; pg.appendChild(sec); created = true;
  let y = 0; if (GROUP === 'team') { const s0 = pg.children.find(s => s.type === 'SECTION' && s.name === GROUPS.solo.name); y = s0.y + s0.height + 400; }
  sec.x = X0; sec.y = y; sec.resizeWithoutConstraints(SECW, 400); sec.fills = [{ type: 'SOLID', color: C('#141414') }]; }
const txt = (s, size, bold, w) => { const t = figma.createText(); t.fontName = { family: 'Inter', style: bold ? 'Bold' : 'Medium' }; t.fontSize = size; t.fills = [{ type: 'SOLID', color: bold ? C('#f2f2f2') : C('#9d9d9d') }]; t.lineHeight = { unit: 'PERCENT', value: 150 }; t.characters = s; if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } sec.appendChild(t); return t; };
// продолжить сетку
const placed = sec.children.filter(c => c.type === 'FRAME');
const rowsY = [...new Set(placed.map(f => f.y))].sort((a, b) => a - b);
const lastRowY = rowsY.length ? rowsY[rowsY.length - 1] : null;
const inLast = lastRowY === null ? 0 : placed.filter(f => f.y === lastRowY).length;
const bottomNow = () => { let b = 0; for (const c of sec.children) b = Math.max(b, c.y + c.height); return b; };
let col, rowY;
if (lastRowY === null) { rowY = 120 + CAPH; col = 0; }
else if (inLast >= PER_ROW) { rowY = bottomNow() + 200 + CAPH; col = 0; }
else { rowY = lastRowY; col = inLast; }
const made = [];
for (const sid of G.screens.slice(FROM, TO)) {
  const s = await figma.getNodeByIdAsync(sid);
  const cl = s.clone(); sec.appendChild(cl); cl.name = s.name + ' · целиком';
  const cp = cl.children.find(c => c.name === 'control_panel');
  const notes = []; let maxB = 0;
  for (const b of cl.children) {
    if (!b.visible || b === cp || b.type !== 'FRAME' || /^(modal|overlay)/.test(b.name)) continue;
    for (const l of b.findAll(n => n.type === 'FRAME' && /прокрутка/.test(n.name) && n.layoutMode === 'VERTICAL')) {
      const h0 = l.height; l.primaryAxisSizingMode = 'AUTO'; l.clipsContent = false;
      if (l.height > h0 + 1) { notes.push(`${b.name}: +${Math.round(l.height - h0)} px`); const sl = l.parent.children.find(c => c.name === 'slider'); if (sl) sl.visible = false; }
    }
    if (cp && b.y < cp.y) maxB = Math.max(maxB, b.y + b.height);
  }
  let delta = 0;
  if (cp && notes.length && maxB + GAP_CP > cp.y) delta = Math.ceil(maxB + GAP_CP - cp.y);
  if (delta > 0) {
    const cpY = cp.y;
    cl.resizeWithoutConstraints(cl.width, cl.height + delta);
    for (const c of cl.children) {
      if (c.type === 'RECTANGLE') c.resize(c.width, c.height + delta);
      else if (c.y >= cpY - 1 && !/^modal/.test(c.name)) c.y += delta;
    }
  }
  const x = 120 + col * (1920 + GAP);
  cl.x = x; cl.y = rowY;
  const cap = txt(s.name + '\n' + (notes.length ? 'Развёрнуто: ' + notes.join('; ') + (delta ? `. Экран выше на ${delta} px, нижняя панель сдвинута вниз.` : '.') : 'Прокрутки нет, экран как в секциях слева.'), 18, false, 1920);
  cap.x = x; cap.y = rowY - cap.height - 16;
  made.push(`${cl.id}|${s.name.split(' · ')[0]}|d${delta}|${notes.length}`);
  col++; if (col >= PER_ROW) { col = 0; rowY = bottomNow() + 200 + CAPH; }
}
sec.resizeWithoutConstraints(SECW, bottomNow() + 120);
return { sec: sec.id, created, secH: sec.height, made };
