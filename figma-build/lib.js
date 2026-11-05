// Библиотека сборки экранов «Симулятор мэра» для Figma (выполняется внутри use_figma через eval).
// Тело async-функции (figma, G) → возвращает объект L с хелперами. G — таблица контуров Pixel Code Bold.
const L = {};
const UPM = 1008, ASC = 1119, DSC = 223, ADV = 672;
const C = { bg0: '000000', s1: '172827', s2: '202E30', s3: '232727', s4: '303E40', dark: '0D1B1A', n1: '4C5152', n2: '9D9D9D', n3: 'E3E3E3', n4: 'E6E6E6', n5: 'F2F2F2', w: 'FFFFFF', a1: 'DA2E76', a2: 'E94785', a3: 'FD3286', err: 'F52538' };
L.C = C;
const rgb = h => { h = h.replace('#', ''); return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 }; };
const solid = (h, o) => { const p = { type: 'SOLID', color: rgb(h) }; if (o != null && o < 1) p.opacity = o; return p; };
const shadow = (h, d) => ({ type: 'DROP_SHADOW', color: Object.assign(rgb(h), { a: 1 }), offset: { x: d, y: d }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' });
L.rgb = rgb; L.solid = solid; L.shadow = shadow;

// ---------- шрифты ----------
const FONTS = ['Regular', 'Medium', 'Semi Bold', 'Bold'].map(s => ({ family: 'Inter', style: s }));
for (const f of FONTS) await figma.loadFontAsync(f);

// ---------- Pixel Code: контуры ----------
function glyphPath(src, ox, oy, k) {
  // src — SVG path (M/H/V/L/Z) в единицах шрифта, y вверх
  let out = '', i = 0, cx = 0, cy = 0, cmd = '';
  const t = src.match(/[MLHVZ]|-?\d+(?:\.\d+)?/g) || [];
  const P = () => `${(ox + cx * k).toFixed(3)} ${(oy + (ASC - cy) * k).toFixed(3)}`;
  while (i < t.length) {
    const tok = t[i];
    if (/[MLHVZ]/.test(tok)) { cmd = tok; i++; if (cmd === 'Z') { out += ' Z'; } continue; }
    if (cmd === 'M') { cx = +t[i]; cy = +t[i + 1]; i += 2; out += ` M ${P()}`; cmd = 'L'; }
    else if (cmd === 'L') { cx = +t[i]; cy = +t[i + 1]; i += 2; out += ` L ${P()}`; }
    else if (cmd === 'H') { cx = +t[i]; i++; out += ` L ${P()}`; }
    else if (cmd === 'V') { cy = +t[i]; i++; out += ` L ${P()}`; }
    else i++;
  }
  return out;
}
const SUB = { '−': '-', '₽': 'Р', '№': 'N', 'ё': 'е', 'Ё': 'Е', ' ': ' ', '‑': '-' };
// Пресеты стиля из «Типографики» (обводка и тень зависят от размера)
const PXP = {
  13: { lh: 160, sh: 1.38, sw: 0 }, 16: { lh: 160, sh: 1.2, sw: 0 }, 18: { lh: 160, sh: 1.2, sw: 0 },
  24: { lh: 150, sh: 1.3, sw: 1 }, 30: { lh: 140, sh: 1.6, sw: 1.2 }, 40: { lh: 130, sh: 2, sw: 1.4 }, 80: { lh: 115, sh: 4, sw: 3 }
};
// px(text, {size, fill, stroke, sw, shadow (hex|null), sh, lh, align, upper, w (ширина для переноса)})
L.px = function (str, o = {}) {
  const size = o.size || 18, pr = PXP[size] || PXP[18];
  const lh = o.lh || pr.lh, upper = o.upper !== false;
  let s = String(str); s = [...s].map(ch => SUB[ch] || ch).join(''); if (upper) s = s.toUpperCase();
  const k = size / UPM, ls = (o.ls != null ? o.ls : -0.02 * size), adv = ADV * k + ls, LH = size * lh / 100;
  // перенос по словам
  let lines = [];
  for (const para of s.split('\n')) {
    if (!o.w) { lines.push(para); continue; }
    const maxc = Math.max(1, Math.floor((o.w + 0.5) / adv));
    let cur = '';
    for (const word of para.split(' ')) {
      const cand = cur ? cur + ' ' + word : word;
      if (cand.length <= maxc || !cur) cur = cand; else { lines.push(cur); cur = word; }
    }
    lines.push(cur);
  }
  const widths = lines.map(l => [...l].length * adv);
  const W = o.w || Math.max(1, ...widths);
  const top0 = (LH - (ASC + DSC) * k) / 2;
  let d = '';
  lines.forEach((ln, li) => {
    let x = 0; const al = o.align || 'LEFT';
    if (al === 'CENTER') x = (W - widths[li]) / 2; else if (al === 'RIGHT') x = W - widths[li];
    for (const ch of ln) { const g = G[ch]; if (g) d += glyphPath(g, x, li * LH + top0, k); x += adv; }
  });
  const fr = figma.createFrame();
  fr.name = 'px·' + size + '·' + (o.upper === false ? 'a·' : '') + String(str).replace(/\n/g, '⏎');
  fr.fills = []; fr.clipsContent = false;
  fr.resize(Math.max(1, W), Math.max(1, lines.length * LH));
  if (d.trim()) {
    const v = figma.createVector();
    v.vectorPaths = [{ windingRule: 'NONZERO', data: d.trim() }];
    v.name = 'glyphs';
    fr.appendChild(v);
    // vector bbox → в координаты фрейма по исходной точке пути
    const m = d.match(/M (-?[\d.]+) (-?[\d.]+)/);
    let minx = Infinity, miny = Infinity;
    for (const mm of d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)) { minx = Math.min(minx, +mm[1]); miny = Math.min(miny, +mm[2]); }
    v.x = minx; v.y = miny;
    v.fills = o.fills || [solid(o.fill || C.n5)];
    const sw = o.sw != null ? o.sw : (o.stroke ? pr.sw || 1 : 0);
    if (o.strokes) { v.strokes = o.strokes; v.strokeWeight = o.strokeWeight || 1; v.strokeAlign = 'OUTSIDE'; }
    else if (o.stroke && sw) { v.strokes = [solid(o.stroke)]; v.strokeWeight = sw; v.strokeAlign = 'OUTSIDE'; }
    if (o.effects) v.effects = o.effects;
    else if (o.shadow) v.effects = [shadow(o.shadow, o.sh || pr.sh)];
    v.constraints = { horizontal: (o.align === 'CENTER' ? 'CENTER' : o.align === 'RIGHT' ? 'MAX' : 'MIN'), vertical: 'CENTER' };
  }
  return fr;
};
// Заголовочные пресеты
L.pxTitle = (s, size = 24, o = {}) => L.px(s, Object.assign({ size, fill: C.n5, stroke: C.a2, shadow: C.a2 }, o));

// ---------- Inter ----------
L.tx = function (str, o = {}) {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: o.wt || 'Bold' };
  t.fontSize = o.size || 16;
  t.characters = String(str);
  t.textCase = o.upper === false ? 'ORIGINAL' : 'UPPER';
  t.lineHeight = { unit: 'PERCENT', value: o.lh || (o.size >= 24 ? 150 : 160) };
  t.letterSpacing = { unit: 'PERCENT', value: o.ls != null ? o.ls : -2 };
  t.fills = [solid(o.fill || C.n5, o.op)];
  if (o.stroke) { t.strokes = [solid(o.stroke)]; t.strokeWeight = o.sw || 1; t.strokeAlign = 'OUTSIDE'; }
  if (o.shadow) t.effects = [shadow(o.shadow, o.sh || 1.2)];
  if (o.align) t.textAlignHorizontal = o.align;
  if (o.w) { t.textAutoResize = 'HEIGHT'; t.resize(o.w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.name = o.name || String(str).slice(0, 40);
  return t;
};
// стилизованный Inter-заголовок (24 px, обводка и розовая тень)
L.h = (s, o = {}) => L.tx(s, Object.assign({ size: 24, stroke: C.a2, sw: 1, shadow: C.a2, sh: 1.3 }, o));
L.h18 = (s, o = {}) => L.tx(s, Object.assign({ size: 18, shadow: C.a2, sh: 1.2 }, o));
L.cap = (s, o = {}) => L.tx(s, Object.assign({ size: 13, wt: 'Medium', upper: false, fill: C.n2, lh: 150 }, o));
L.body = (s, o = {}) => L.tx(s, Object.assign({ size: 16, wt: 'Medium', upper: false, fill: C.n5, lh: 150 }, o));

// ---------- auto-layout ----------
L.al = function (dir, o = {}) {
  const f = figma.createAutoLayout(dir === 'H' ? 'HORIZONTAL' : 'VERTICAL');
  f.fills = o.fill ? [solid(o.fill, o.op)] : [];
  f.itemSpacing = o.gap != null ? o.gap : 0;
  const p = o.pad != null ? (Array.isArray(o.pad) ? o.pad : [o.pad, o.pad, o.pad, o.pad]) : [0, 0, 0, 0];
  f.paddingTop = p[0]; f.paddingRight = p[1]; f.paddingBottom = p[2]; f.paddingLeft = p[3];
  if (o.r != null) f.cornerRadius = o.r;
  if (o.stroke) { f.strokes = [solid(o.stroke)]; f.strokeWeight = o.sw || 2; f.strokeAlign = 'INSIDE'; }
  if (o.name) f.name = o.name;
  if (o.main) f.primaryAxisAlignItems = o.main;   // MIN CENTER MAX SPACE_BETWEEN
  if (o.cross) f.counterAxisAlignItems = o.cross; // MIN CENTER MAX BASELINE
  f.clipsContent = !!o.clip;
  if (o.w || o.h) { f.resize(o.w || f.width, o.h || f.height); const hw = !!o.w, hh = !!o.h; if (dir === 'H') { f.primaryAxisSizingMode = hw ? 'FIXED' : 'AUTO'; f.counterAxisSizingMode = hh ? 'FIXED' : 'AUTO'; } else { f.primaryAxisSizingMode = hh ? 'FIXED' : 'AUTO'; f.counterAxisSizingMode = hw ? 'FIXED' : 'AUTO'; } }
  if (o.kids) for (const k of o.kids) if (k) f.appendChild(k);
  return f;
};
L.fill = n => { n.layoutSizingHorizontal = 'FILL'; return n; };
L.fillV = n => { n.layoutSizingVertical = 'FILL'; return n; };
L.add = (p, ...kids) => { for (const k of kids) if (k) p.appendChild(k); return p; };
L.abs = (p, n, x, y) => { p.appendChild(n); if (p.layoutMode && p.layoutMode !== 'NONE') n.layoutPositioning = 'ABSOLUTE'; n.x = x; n.y = y; return n; };
L.rect = (w, h, fill, o = {}) => { const r = figma.createRectangle(); r.resize(w, h); r.fills = fill ? [solid(fill, o.op)] : []; if (o.r != null) r.cornerRadius = o.r; if (o.stroke) { r.strokes = [solid(o.stroke)]; r.strokeWeight = o.sw || 2; } if (o.name) r.name = o.name; return r; };

// ---------- кит ----------
const K = {
  btnP: '122:2778', btnPh: '122:3756', btnPp: '122:3783', btnPd: '122:3810', btnPe: '122:3837',
  btnS: '122:3212', btnSh: '122:3401', btnSd: '122:3374', btnSe: '122:3455', btnA: '122:5798', btnAh: '122:5825', btnAd: '122:5908',
  btnLink: '122:3239', btnIcon: '122:3864', btnIconD: '122:3911',
  chipP: '122:3482', chipPh: '122:3590', chipPp: '122:3646', chipPd: '122:3536', chipPe: '122:3702',
  chipS: '122:3509', chipSh: '122:3618', chipSp: '122:3674', chipSd: '122:3563', chipSe: '122:3729',
  chipIcon: '122:3883', chipIconP: '122:3899',
  input: '122:2965', inputH: '122:3050', inputP: '122:3082', inputT: '122:3116', inputE: '122:3150', inputD: '122:3181',
  sw: '122:2996', swH: '122:3026', swOn: '122:3038', swD: '122:3016',
  slider: '122:3987', sliderH: '122:4039', sliderP: '122:4092', sliderE: '122:4145', sliderD: '122:5935',
  seg: '122:4282', segC: '122:4905', segR: '122:4989', segE: '122:4822', segD: '122:4199',
  step: '122:4366', stepMin: '122:4410', stepMax: '122:4456', stepD: '122:4502', stepE: '122:4548',
  stepS: '122:4594', stepSmin: '122:4638', stepSmax: '122:4684', stepSd: '122:4730', stepSe: '122:4776',
  code: '122:5073', codeH: '122:5121', codeP: '122:5138', codeT: '122:5150', codeE: '122:5105', codeD: '122:5089',
  kpiUp: '122:2109', kpiDown: '122:2723', kpiN: '122:2771', metUp: '122:2699', metDown: '122:2747', metN: '122:2774',
  lbUp: '122:2133', lbDown: '122:2517', lbOup: '122:2164', lbOdown: '122:2487',
  graph: '122:2548', graph2: '122:2675', budget: '122:2566', timer: '122:2568', timerE: '122:2621', inMet: '122:2673',
  badgeSP: '122:2805', badgeSS: '122:2905', badgeSA: '122:2925', badgeSE: '122:2945',
  badgeBP: '122:2825', badgeBS: '122:2865', badgeBE: '122:2885', badgeP: '122:5228', badgeS: '122:5189',
  ccard: '122:5163', ccardH: '122:5342', ccardP: '122:5375', ccardC: '122:5313', ccardE: '122:5401',
  tcard: '122:5168', tcardO: '122:5179', tcardO2: '122:5209', tcardP: '122:5248', tcardH: '122:5274',
  dlg: '122:5407', dlg2: '122:5414', qBig: '122:5435', qSmall: '122:5447', qDlg: '122:5459',
  blk1: '122:5474', blk2: '122:2376', blk3: '122:20921', docUr: '122:2613', docAn: '122:2609', docGroup: '122:2458',
  evOff: '122:6144', evOn: '122:6152', evH: '122:6161', evP: '122:6170', feedback: '122:5987',
  resI: '84:27983', resH: '84:27993', resP: '84:28033', resC: '84:28065', resE: '84:28091',
  logo: '56:22038', s08: '122:16260', p01: '122:20798', p02: '122:20843', stripes: '122:1118', icons: '54:6759'
};
L.K = K;
const cache = {};
L.node = async id => cache[id] || (cache[id] = await figma.getNodeByIdAsync(id));
L.kit = async (key) => { const n = await L.node(K[key] || key); const c = n.clone(); figma.currentPage.appendChild(c); return c; };
// все текстовые узлы (видимые) в порядке обхода
L.texts = (n, all) => n.findAll(x => x.type === 'TEXT' && (all || isVis(x)));
function isVis(x) { let p = x; while (p && p.type !== 'PAGE') { if (p.visible === false) return false; p = p.parent; } return true; }
L.isVis = isVis;
// заменить текст узла: Inter — правкой, Pixel Code — контурами
L.setT = async function (t, str) {
  if (t.fontName === figma.mixed || t.fontName.family !== 'Pixel Code') {
    const fs = t.fontName === figma.mixed ? t.getStyledTextSegments(['fontName']).map(s => s.fontName) : [t.fontName];
    for (const f of fs) await figma.loadFontAsync(f);
    t.characters = String(str); if (t.textAutoResize === 'NONE' && t.layoutSizingHorizontal !== 'FILL') t.textAutoResize = 'WIDTH_AND_HEIGHT'; return t;
  }
  const lh = t.lineHeight.unit === 'PERCENT' ? t.lineHeight.value : (t.lineHeight.unit === 'PIXELS' ? t.lineHeight.value / t.fontSize * 100 : 120);
  const ls = t.letterSpacing.unit === 'PERCENT' ? t.letterSpacing.value / 100 * t.fontSize : t.letterSpacing.value;
  const wrapW = (t.textAutoResize === 'HEIGHT' || t.textAutoResize === 'TRUNCATE' || t.layoutSizingHorizontal === 'FILL') ? t.width : null;
  const p = L.px(str, { size: t.fontSize, lh, ls, upper: t.textCase === 'UPPER', fills: JSON.parse(JSON.stringify(t.fills)), strokes: t.strokes.length ? JSON.parse(JSON.stringify(t.strokes)) : null, strokeWeight: t.strokeWeight, effects: JSON.parse(JSON.stringify(t.effects)), align: t.textAlignHorizontal, w: wrapW });
  const par = t.parent, idx = par.children.indexOf(t);
  par.insertChild(idx, p);
  const auto = par.layoutMode && par.layoutMode !== 'NONE' && t.layoutPositioning !== 'ABSOLUTE';
  if (auto) {
    if (t.layoutSizingHorizontal === 'FILL') p.layoutSizingHorizontal = 'FILL';
    p.layoutAlign = t.layoutAlign === 'STRETCH' ? 'STRETCH' : 'INHERIT';
    if (t.layoutGrow) p.layoutGrow = t.layoutGrow;
  } else {
    if (t.layoutPositioning === 'ABSOLUTE') p.layoutPositioning = 'ABSOLUTE';
    let x = t.x; if (!wrapW) { if (t.textAlignHorizontal === 'CENTER') x = t.x + (t.width - p.width) / 2; else if (t.textAlignHorizontal === 'RIGHT') x = t.x + t.width - p.width; }
    p.x = x; p.y = t.y + (t.textAutoResize === 'WIDTH_AND_HEIGHT' ? (t.height - p.height) / 2 : 0);
    p.constraints = t.constraints;
  }
  p.visible = t.visible; p.opacity = t.opacity;
  t.remove();
  return p;
};
// relabel(node, [строки]) — по порядку видимых текстов; null — пропустить; '' — скрыть
L.relabel = async function (n, arr) {
  const ts = L.texts(n);
  const out = [];
  for (let i = 0; i < arr.length && i < ts.length; i++) {
    if (arr[i] == null) { out.push(ts[i]); continue; }
    if (arr[i] === '') { ts[i].visible = false; out.push(ts[i]); continue; }
    out.push(await L.setT(ts[i], arr[i]));
  }
  return n;
};
// найти потомка по имени
L.q = (n, name) => n.findOne(x => x.name === name);
L.qa = (n, name) => n.findAll(x => x.name === name);
// показать подпись ошибки (text_wrapper) с текстом
L.err = async function (n, str) {
  const w = n.findOne(x => x.name === 'text_wrapper' && x.children && x.children.some(c => c.type === 'TEXT' && c.characters === 'Текст ошибки'));
  if (!w) { const t0 = n.findOne(x => x.type === 'TEXT' && x.characters === 'Текст ошибки'); if (t0) { let p = t0; while (p && p !== n) { p.visible = true; p = p.parent; } await L.setT(t0, str); } return n; } w.visible = true;
  const t = w.findOne(x => x.type === 'TEXT'); if (t) await L.setT(t, str);
  return n;
};

// ---------- иконки ----------
L.ICON = {
  'close': '54:16239', 'arrow-left': '54:18572', 'arrow-right': '54:18546', 'check': '54:16718', 'clock': '54:16254', 'pause': '54:11218', 'play': '54:10917',
  'copy': '54:15953', 'circle-question': '54:16404', 'warning-diamond': '54:7108', 'users': '54:7433', 'user': '54:7520', 'trophy': '54:7769',
  'chart-line': '54:16748', 'home': '54:13907', 'bell': '54:17848', 'message-text': '54:11742', 'logout': '54:12210', 'reload': '54:10363',
  'wifi': '54:6926', 'cellular-signal-0': '54:16893', 'lock': '54:12248', 'eye': '54:15002', 'plus': '54:10890', 'minus': '54:11673', 'rubel': '54:10110',
  'crown': '54:15662', 'info-box': '54:13493', 'chevron-down': '54:16637', 'chevron-right': '54:16605', 'login': '54:12230', 'flag': '54:14759',
  'ship': '54:9668', 'truck': '54:7739', 'building': '54:17305', 'bus': '54:17214', 'map': '54:12039', 'megaphone': '54:11951', 'gamepad': '54:14560', 'sparkles': '54:9155'
};
L.icon = async function (name, size = 24, color) {
  const n = await L.node(L.ICON[name]); const c = n.clone(); figma.currentPage.appendChild(c);
  if (size !== 24) c.rescale(size / 24);
  if (color) for (const ch of c.findAll(x => 'fills' in x && Array.isArray(x.fills) && x.fills.some(f => f.type === 'SOLID'))) {
    if (ch === c) continue; ch.fills = [solid(color)];
  }
  c.fills = [];
  c.name = name;
  return c;
};

// ---------- экран ----------
const CITY = 'c7c6553428dbb409fd1f3e35fb6d957b94a2ddcd';
L.CITY = CITY;
// screen(name, kind): 'game' — город; 'sys' — размытый город с затемнением (системные экраны)
L.screen = function (name, kind = 'game', dim) {
  const f = figma.createFrame(); f.name = name; f.resize(1920, 1080); f.clipsContent = true;
  f.fills = [solid(C.bg0)];
  const bg = figma.createRectangle(); bg.name = 'bg · город'; bg.resize(1974, 1105); bg.x = -54; bg.y = -25;
  bg.fills = [{ type: 'IMAGE', imageHash: CITY, scaleMode: 'FILL' }]; f.appendChild(bg); bg.locked = true;
  if (kind === 'sys') { const d = L.rect(1920, 1080, C.bg0, { op: 0.45, name: 'bg · затемнение и размытие' }); d.effects = [{ type: 'BACKGROUND_BLUR', radius: 5.1, visible: true, blurType: 'NORMAL' }]; f.appendChild(d); d.locked = true; }
  if (dim) { const d = L.rect(1920, 1080, C.bg0, { op: dim, name: 'overlay 65%' }); f.appendChild(d); }
  return f;
};
L.overlay = (f, op = 0.65) => { const d = L.rect(1920, 1080, C.bg0, { op, name: 'overlay · затемнение ' + Math.round(op * 100) + '%' }); f.appendChild(d); return d; };

// ---------- поп-апы (UI-25) ----------
// Форма: тело с радиусом 40 + «вкладка» справа сверху (заголовок + крестик). Тело = шапка/скролл/футер.
const TABH = 57, R = 40;
function shellPath(W, H, TW) {
  const x0 = W - TW; // левый край вкладки
  const r2 = 31;
  return [
    `M 0 ${TABH + R}`,
    `L 0 ${H - R}`, `C 0 ${H - R / 2.2} ${R / 2.2} ${H} ${R} ${H}`,
    `L ${W - R} ${H}`, `C ${W - R / 2.2} ${H} ${W} ${H - R / 2.2} ${W} ${H - R}`,
    `L ${W} ${r2}`, `C ${W} ${r2 / 2.2} ${W - r2 / 2.2} 0 ${W - r2} 0`,
    `L ${x0 + 61} 0`, `C ${x0 + 36} 0 ${x0 + 25} ${TABH} ${x0} ${TABH}`,
    `L ${R} ${TABH}`, `C ${R / 2.2} ${TABH} 0 ${TABH + R / 2.2} 0 ${TABH + R}`, 'Z'
  ].join(' ');
}
// modal({w, title, sub, close:true, body:[nodes], footer:node, maxH, kind:'work'|'sys', titleLogo})
L.modal = async function (o) {
  const W = o.w || 800, PADX = 24, PADR = o.scroll === false ? 24 : 48;
  const maxH = o.maxH || 900;
  const root = figma.createFrame(); root.name = o.name || ('modal · ' + (o.title || '')); root.fills = []; root.clipsContent = false;
  // заголовок вкладки
  const head = L.al('H', { gap: 14, cross: 'CENTER', name: 'upper_group_close' });
  const tt = L.pxTitle(o.title || '', 24); head.appendChild(tt);
  if (o.logo) { const lg = await L.kit('logo'); lg.rescale(41 / lg.width); head.appendChild(lg); }
  if (o.close !== false) { const b = await L.kit('btnIcon'); b.name = 'Button_icon/close'; head.appendChild(b); }
  const TW = Math.max(300, head.width + 61 + 40);
  // тело
  const body = L.al('V', { gap: o.gap != null ? o.gap : 24, pad: [24, PADR, 24, PADX], name: 'modal_container · контент' });
  body.resize(W, 10); body.counterAxisSizingMode = 'FIXED'; body.primaryAxisSizingMode = 'AUTO';
  if (o.sub) { const s = L.cap(o.sub, { w: W - PADX - PADR }); body.appendChild(s); }
  for (const k of (o.body || [])) if (k) { body.appendChild(k); if (!k.name.startsWith('keep·')) { try { k.layoutSizingHorizontal = 'FILL'; } catch (e) { } } }
  // футер
  let foot = null;
  if (o.footer) {
    foot = L.al('H', { gap: 24, pad: [16, 24, 20, 24], cross: 'CENTER', name: 'modal_footer · фиксирован' });
    foot.resize(W, 10); foot.primaryAxisSizingMode = 'FIXED'; foot.counterAxisSizingMode = 'AUTO';
    foot.appendChild(o.footer); try { o.footer.layoutSizingHorizontal = 'FILL'; } catch (e) { }
  }
  const footH = foot ? foot.height : 0;
  const bodyMax = maxH - TABH - footH;
  const contentH = body.height;
  const scroll = contentH > bodyMax;
  const bodyH = scroll ? bodyMax : contentH;
  const H = TABH + bodyH + footH;
  // фон-форма
  const shape = figma.createVector(); shape.name = 'shape';
  shape.vectorPaths = [{ windingRule: 'NONZERO', data: shellPath(W, H, TW) }];
  shape.fills = [solid(C.s2)]; shape.strokes = [solid(C.s4)]; shape.strokeWeight = 4; shape.strokeAlign = 'INSIDE';
  shape.effects = [{ type: 'BACKGROUND_BLUR', radius: 6.2, visible: true, blurType: 'NORMAL' }];
  root.resize(W, H); root.appendChild(shape); shape.x = 0; shape.y = 0;
  // полосы паттерна, маска по форме
  const stripesSrc = await L.node(K.stripes);
  const mask = shape.clone(); mask.name = 'mask'; mask.isMask = true; mask.strokes = []; mask.effects = [];
  const st = stripesSrc.clone(); st.opacity = 0.09; st.name = 'pattern';
  root.appendChild(mask); root.appendChild(st); st.x = -1645 + 400; st.y = -595 + 100;
  const g = figma.group([mask, st], root); g.name = 'pattern (маска)';
  // вкладка
  root.appendChild(head); head.x = W - TW + 61 + 6; head.y = (TABH - head.height) / 2 + 2;
  // скролл-область
  const vp = figma.createFrame(); vp.name = scroll ? 'scroll · прокрутка (контент выше окна)' : 'body'; vp.fills = []; vp.clipsContent = true;
  vp.resize(W, bodyH); root.appendChild(vp); vp.x = 0; vp.y = TABH;
  vp.appendChild(body); body.x = 0; body.y = 0;
  if (scroll) {
    vp.overflowDirection = 'VERTICAL';
    const track = L.rect(4, bodyH - 48, C.s1, { r: 999, name: 'scroll_track' }); root.appendChild(track); track.x = W - 29; track.y = TABH + 24;
    const th = Math.max(29, (bodyH - 48) * bodyH / contentH);
    const thumb = L.rect(14, th, C.a2, { r: 999, name: 'scroll_thumb', stroke: C.s4, sw: 1 }); root.appendChild(thumb); thumb.x = W - 34; thumb.y = TABH + 24;
    thumb.effects = [{ type: 'INNER_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.25 }, offset: { x: 0, y: -2 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' }];
    // тень-градиент над футером: контент уходит под футер
    const fade = figma.createRectangle(); fade.name = 'scroll_fade'; fade.resize(W - 8, 40); root.appendChild(fade); fade.x = 4; fade.y = TABH + bodyH - 40;
    fade.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]], gradientStops: [{ position: 0, color: Object.assign(rgb(C.s2), { a: 0 }) }, { position: 1, color: Object.assign(rgb(C.s2), { a: 1 }) }] }];
  }
  if (foot) {
    root.appendChild(foot); foot.x = 0; foot.y = TABH + bodyH;
    const line = L.rect(W - 8, 2, C.s4, { name: 'footer_divider' }); root.appendChild(line); line.x = 4; line.y = TABH + bodyH;
  }
  return root;
};
// разместить поп-ап на экране: по центру (или со смещением 24 px для стопки)
L.place = (scr, m, o = {}) => { scr.appendChild(m); m.x = Math.round(o.x != null ? o.x : (1920 - m.width) / 2 + (o.dx || 0)); m.y = Math.round(o.y != null ? o.y : Math.max(20, (1080 - m.height) / 2) + (o.dy || 0)); return m; };

// ---------- мелкие компоненты (клоны кита с подписями) ----------
L.btn = async (label, kind = 'btnP', o = {}) => { const b = await L.kit(kind); await L.relabel(b, [label]); if (o.icon) { const ic = b.findOne(x => x.name === 'university'); if (ic) { const ni = await L.icon(o.icon, 24, o.iconColor || C.n5); ic.parent.insertChild(ic.parent.children.indexOf(ic), ni); ic.remove(); } } if (o.err) await L.err(b, o.err); b.name = (L.K[kind] ? kind : '') + ' · ' + label; return b; };
L.badge = async (label, kind = 'badgeSS', o = {}) => { const b = await L.kit(kind); const t = L.texts(b)[0]; await L.setT(t, label); if (o.noIcon) { const ic = b.findOne(x => x.name === 'vercel-solid'); if (ic) ic.visible = false; } if (o.down) { const ic = b.findOne(x => x.name === 'vercel-solid'); if (ic) ic.rotation = 180; } return b; };
L.row = async (name, val, o = {}) => { // Metrick_row / Kpi_row
  const kind = o.kind || (o.ch == null ? 'metN' : (o.down ? 'metDown' : 'metUp'));
  const r = await L.kit(kind);
  const ts = L.texts(r);
  await L.setT(ts[0], name);
  if (ts[1]) await L.setT(ts[1], val);
  if (ts[2] && o.ch != null) await L.setT(ts[2], o.ch);
  if (o.zone) { const vt = L.texts(r)[1]; if (vt) { vt.fills = [solid(o.zone === 'r' ? C.err : o.zone === 'g' ? C.w : C.a3)]; vt.effects = o.zone === 'g' ? [] : vt.effects; } }
  { const nt = L.texts(r)[0]; if (nt && nt.type === 'TEXT') { nt.layoutSizingHorizontal = 'FILL'; nt.textAutoResize = 'HEIGHT'; nt.lineHeight = { unit: 'PERCENT', value: 130 }; } r.counterAxisSizingMode = 'AUTO'; r.paddingTop = Math.max(r.paddingTop, 10); r.paddingBottom = Math.max(r.paddingBottom, 10); const sg = r.findOne(x => x.name === 'stat_badge_group'); if (sg) { sg.layoutSizingHorizontal = 'HUG'; } }
  r.name = kind + ' · ' + name;
  return r;
};
L.G = G;
return L;
