async function LIB2(figma, L) {
const C = L.C, solid = L.solid;
L.col = (kids, o = {}) => { const f = L.al('V', Object.assign({ gap: 12 }, o)); for (const k of kids) if (k) { f.appendChild(k); try { k.layoutSizingHorizontal = 'FILL'; } catch (e) { } } return f; };
L.hrow = (kids, o = {}) => L.al('H', Object.assign({ gap: 12, cross: 'CENTER' }, o, { kids }));
L.grow = n => { n.layoutGrow = 1; return n; };
L.spacer = () => { const f = figma.createFrame(); f.fills = []; f.resize(1, 1); f.name = 'spacer'; return f; };
L.between = (a, b, o = {}) => { const r = L.al('H', Object.assign({ gap: 12, cross: 'CENTER' }, o)); r.appendChild(a); const s = L.spacer(); r.appendChild(s); s.layoutGrow = 1; if (b) r.appendChild(b); return r; };
// предикт: Badge_small/primary «▲ +50 бизнесов»; dir: 'up' | 'down' | 'none'
L.hug = n => { for (const f of [n, ...n.findAll(x => x.type === 'FRAME')]) { if (!f.layoutMode || f.layoutMode === 'NONE') continue; if (f.layoutSizingHorizontal === 'FILL' && f !== n) continue; try { if (f.layoutMode === 'HORIZONTAL') f.primaryAxisSizingMode = 'AUTO'; else f.counterAxisSizingMode = 'AUTO'; } catch (e) { } } return n; };
L.pred = async (txt, dir = 'up') => { const b = await L.kit('badgeSP'); await L.setT(L.texts(b)[0], txt); const ic = b.findOne(x => x.name === 'vercel-solid'); if (ic) { if (dir === 'none') ic.visible = false; if (dir === 'down') ic.rotation = 180; } b.name = 'predict · ' + txt; L.hug(b); return b; };
L.preds = async (arr) => { const r = L.al('H', { gap: 8, name: 'predicts' }); r.layoutWrap = 'WRAP'; r.counterAxisSpacing = 8; for (const p of arr) { const [t, d] = Array.isArray(p) ? p : [p, (/^[−-]/.test(p) ? 'down' : /^[+±]/.test(p) ? 'up' : 'none')]; r.appendChild(await L.pred(t, d)); } return r; };
// слайдер кита. o: {state, price, pct (0..1), applied (0..1), w, err}
L.slider = async function (o) {
  const kind = { initial: 'slider', hover: 'sliderH', pressed: 'sliderP', error: 'sliderE', disabled: 'sliderD' }[o.state || 'initial'];
  const s = await L.kit(kind);
  for (const b of s.findAll(x => x.name === 'Badge/primary')) b.visible = false;
  const pg = L.q(s, 'price_badges_group');
  const pt = L.texts(s).find(t => t.parent === pg);
  if (pt) { pt.layoutSizingHorizontal = 'HUG'; pg.counterAxisSizingMode = 'AUTO'; pg.counterAxisAlignItems = 'MAX'; if (o.price != null) await L.setT(pt, o.price); }
  if (o.priceW) { pg.counterAxisSizingMode = 'FIXED'; pg.resize(o.priceW, pg.height); }
  if (o.err) await L.err(s, o.err);
  const W = o.w || 600;
  s.counterAxisSizingMode = 'FIXED'; s.resize(W, s.height); s.primaryAxisSizingMode = 'AUTO';
  const grp = L.q(s, 'slider_price_group'), wrap = L.q(s, 'slider_wrapper');
  grp.layoutSizingHorizontal = 'FILL'; const ww = W - pg.width - grp.itemSpacing; wrap.layoutSizingHorizontal = 'FIXED'; wrap.resize(ww, wrap.height);
  const glow = wrap.children.find(c => c.name === 'thumb' && c.layoutPositioning === 'ABSOLUTE');
  const thumb = wrap.children.find(c => c.name === 'thumb' && c.layoutPositioning !== 'ABSOLUTE');
  const bars = wrap.children.filter(c => c.name === 'prorgress_bar');
  const prog = bars[0], red = bars[1], empty = L.q(wrap, 'empty_bar');
  empty.layoutSizingHorizontal = 'FILL'; if (o.track) empty.fills = [solid(o.track)];
  const bw = ww - thumb.width, pct = Math.max(0, Math.min(1, o.pct || 0));
  if (red) red.resize(Math.max(0.01, bw * (o.over || 0.06)), red.height);
  if (o.applied != null && o.applied > 0) {
    const ap = Math.min(o.applied, pct);
    const a = prog.clone(); a.name = 'applied_bar (ЗАМ-01)'; a.fills = [solid(C.a1)]; wrap.insertChild(wrap.children.indexOf(prog), a);
    a.resize(Math.max(0.01, bw * ap), prog.height); prog.resize(Math.max(0.01, bw * (pct - ap)), prog.height);
    a.topRightRadius = a.bottomRightRadius = 0; prog.topLeftRadius = prog.bottomLeftRadius = 0;
  } else prog.resize(Math.max(0.01, bw * pct), prog.height);
  if (glow) { glow.x = thumb.x + thumb.width / 2 - glow.width / 2; glow.y = thumb.y + thumb.height / 2 - glow.height / 2; }
  s.name = 'Slider/' + (o.state || 'initial');
  return s;
};
L.sItem = async function (o) {
  const w = o.w || 680;
  const kids = [];
  const head = L.between(L.tx(o.label, { size: 16 }), o.right ? L.tx(o.right, { size: 13, wt: 'Bold', fill: C.n2 }) : null);
  kids.push(head);
  kids.push(await L.slider(Object.assign({ w, priceW: w > 400 ? 180 : 130 }, o.slider || {})));
  if (o.preds && o.preds.length) kids.push(await L.preds(o.preds));
  if (o.note) kids.push(L.cap(o.note, { w }));
  const c = L.col(kids, { gap: 10, name: 'item · ' + o.label });
  return c;
};
// кликер: {val, state:'initial'|'min'|'max'|'error'|'disabled', small, err}
L.stepper = async function (o) {
  const map = o.small ? { initial: 'stepS', min: 'stepSmin', max: 'stepSmax', error: 'stepSe', disabled: 'stepSd' } : { initial: 'step', min: 'stepMin', max: 'stepMax', error: 'stepE', disabled: 'stepD' };
  const s = await L.kit(map[o.state || 'initial']);
  const t = L.texts(s).find(x => /^\d+$/.test(x.characters));
  if (t && o.val != null) await L.setT(t, String(o.val));
  for (const w of s.findAll(x => x.name === 'text_wrapper')) w.visible = false;
  if (o.err) await L.err(s.findOne(x => x.name === 'Button_icon/initial' || x.name.startsWith('Button_icon')) || s, o.err);
  s.name = 'Stepper/' + (o.state || 'initial');
  return s;
};
L.stItem = async function (o) { // {label, val, state, preds, note, right}
  const left = L.col([L.tx(o.label, { size: 16, w: o.lw || 360 }), o.right ? L.tx(o.right, { size: 13, fill: C.n2 }) : null], { gap: 4 });
  const st = await L.stepper(o);
  const r = L.between(left, st);
  const kids = [r];
  if (o.preds && o.preds.length) kids.push(await L.preds(o.preds));
  if (o.errText) kids.push(L.px(o.errText, { size: 13, fill: C.err, upper: false }));
  if (o.note) kids.push(L.cap(o.note));
  return L.col(kids, { gap: 10, name: 'item · ' + o.label });
};
// переключатель качества (Segment_control): pos 0|1|2, state 'error'|'disabled'
L.segment = async function (pos = 0, state) {
  const key = state === 'error' ? 'segE' : state === 'disabled' ? 'segD' : ['seg', 'segC', 'segR'][pos];
  const s = await L.kit(key); for (const w of s.findAll(x => x.name === 'text_wrapper')) w.visible = (state === 'error' && w.parent === s); return s;
};
// поле ввода: {label, value, placeholder, state:'initial'|'typing'|'error'|'disabled'|'pressed', err, w}
L.input = async function (o) {
  const key = { initial: 'input', hover: 'inputH', pressed: 'inputP', typing: 'inputT', error: 'inputE', disabled: 'inputD' }[o.state || 'initial'];
  const f = await L.kit(key);
  const ic = f.findOne(x => x.name === 'eye-off' || x.name === 'eye'); if (ic) ic.visible = false;
  const t = L.texts(f).find(x => x.characters !== 'Текст ошибки' && !(x.parent && x.parent.name === 'text_wrapper'));
  if (t) await L.setT(t, o.value != null ? o.value : (o.placeholder || ''));
  if (t && o.value == null && o.state !== 'disabled') { t.fills = [solid(C.n1)]; }
  for (const w of f.findAll(x => x.name === 'text_wrapper')) w.visible = false;
  if (o.err) await L.err(f, o.err);
  if (o.w) { f.counterAxisSizingMode = 'FIXED'; f.resize(o.w, f.height); f.primaryAxisSizingMode = 'AUTO'; const iw = L.q(f, 'inner_wrapper'); if (iw) iw.layoutSizingHorizontal = 'FILL'; }
  if (!o.label) return f;
  const c = L.col([L.tx(o.label, { size: 13, fill: C.n2 }), f], { gap: 8, name: 'field · ' + o.label });
  return c;
};
L.switchRow = async function (label, on, o = {}) {
  const sw = await L.kit(o.disabled ? 'swD' : on ? 'swOn' : 'sw'); for (const w of sw.findAll(x => x.name === 'text_wrapper')) w.visible = false;
  const lab = L.hrow([L.tx(label, { size: 18 })], { gap: 10 });
  if (o.q) { const q = await L.kit(o.qOpen ? 'chipIconP' : 'chipIcon'); for (const w of q.findAll(x => x.name === 'text_wrapper')) w.visible = false; lab.appendChild(q); }
  return L.between(lab, sw, { name: 'switch · ' + label });
};
// вкладки (Chip_primary): активная — pressed
L.tabs = async function (names, active = 0) {
  const r = L.al('H', { gap: 12, cross: 'CENTER', name: 'chip_group_tabs' }); r.layoutWrap = 'WRAP'; r.counterAxisSpacing = 12;
  for (let i = 0; i < names.length; i++) { const c = await L.kit(i === active ? 'chipPp' : 'chipP'); await L.relabel(c, [names[i]]); r.appendChild(c); }
  return r;
};
// тег команды: own — своя (белый), иначе розовый
L.tag = async function (name, own) {
  const src = await L.node(own ? '122:2137' : '122:2460'); const b = src.clone();
  await L.relabel(b, [name]); b.name = 'tag · ' + name; return b;
};
// футер поп-апа инструмента
L.toolFoot = async function (o = {}) {
  const ap = await L.btn(o.apply || 'применить', o.applyKind || (o.disabled ? 'btnPd' : 'btnP'), { err: o.applyErr });
  const tot = L.al('V', { gap: 2, kids: [L.tx(o.totalLabel || 'итог к оплате', { size: 13, fill: C.n2 }), L.px(o.total || '0 р.', { size: 18, fill: C.a3, shadow: C.dark })] });
  const rest = L.al('V', { gap: 2, kids: [L.tx(o.restLabel || 'остаток бюджета хода', { size: 13, fill: C.n2 }), L.px(o.rest || '0 р.', { size: 18, shadow: C.n2 })] });
  if (o.extra && o.extra.length) {
    const top = L.al('H', { gap: 32, cross: 'CENTER', name: 'totals' }); top.appendChild(tot); top.appendChild(rest);
    const bot = L.al('H', { gap: 12, cross: 'CENTER', name: 'buttons' }); bot.appendChild(ap); for (const e of o.extra) bot.appendChild(e);
    const v = L.al('V', { gap: 14, name: 'footer_tool' }); v.appendChild(top); v.appendChild(bot); return v;
  }
  const kids = [ap]; if (o.extra) for (const e of o.extra) kids.push(e);
  const r = L.al('H', { gap: 32, cross: 'CENTER', name: 'footer_tool' });
  for (const k of kids) r.appendChild(k);
  const sp = L.spacer(); r.appendChild(sp); sp.layoutGrow = 1;
  r.appendChild(tot); r.appendChild(rest);
  return r;
};
// футер с кнопками (системные поп-апы)
L.btnFoot = async function (btns, o = {}) {
  const r = L.al('H', { gap: 16, cross: 'CENTER', main: o.main || 'MAX', name: 'footer_buttons' });
  for (const b of btns) r.appendChild(Array.isArray(b) ? await L.btn(b[0], b[1] || 'btnP', b[2] || {}) : b);
  return r;
};
// справка / пояснение в поп-апе
L.note = (text, o = {}) => { const f = L.al('V', { gap: 6, pad: [14, 18, 14, 18], fill: o.fill || C.s1, stroke: o.stroke || C.n1, sw: 2, r: 20, name: 'note' }); if (o.title) f.appendChild(L.tx(o.title, { size: 13, fill: o.titleColor || C.a3 })); const t = L.body(text, { size: o.size || 14, fill: o.color || C.n3 }); f.appendChild(t); t.layoutSizingHorizontal = 'FILL'; return f; };
// раздел внутри поп-апа
L.sec = (t, o = {}) => L.h18(t, o);
// строка «название — значение» (Metrick_row)
L.kv = async (name, val, ch, down) => { const r = await L.row(name, val, ch != null ? { ch, down } : {}); const sg = r.findOne(x => x.name === 'stat_badge_group'); if (sg) L.hug(sg); return r; };
L.kvs = async (arr) => { const out = []; for (const a of arr) out.push(await L.kv(a[0], a[1], a[2], a[3])); return L.col(out, { gap: 8 }); };
// бейдж-статус (Badge/secondary белый / Badge/primary розовый) с текстом
L.chipTag = async (text, kind = 'badgeS') => { const b = await L.kit(kind); await L.relabel(b, [text]); for (const i of b.findAll(x => x.type === 'FRAME' && x.width <= 24 && x.height <= 24 && x.name !== 'inner_wrapper')) i.visible = false; L.hug(b); return b; };
// пиксельный крупный блок значения (как Budget)
L.bigVal = async (text, o = {}) => { const b = await L.kit('budget'); await L.relabel(b, [text]); if (o.w) { b.primaryAxisSizingMode = 'FIXED'; b.resize(o.w, b.height); b.primaryAxisAlignItems = 'CENTER'; } return b; };
// подпись в рамке над/под экраном (аннотация для согласования)
L.annot = function (scr, id, title, note) {
  const box = L.al('V', { gap: 10, pad: [0, 0, 0, 0], name: 'annotation · ' + id });
  box.appendChild(L.tx(id + ' · ' + title, { size: 28, upper: false, fill: C.n5 }));
  if (note) { const t = L.tx(note, { size: 18, wt: 'Medium', upper: false, fill: C.n2, lh: 150, w: 1920 }); box.appendChild(t); }
  return box;
};
// ---------- доска согласования: секции и раскладка ----------
L.section = async function (name, y) {
  const page = figma.currentPage;
  let sec = page.children.find(n => n.type === 'SECTION' && n.name === name);
  if (!sec) { sec = figma.createSection(); sec.name = name; page.appendChild(sec); sec.x = 0; sec.y = y; sec.resizeWithoutConstraints(4 * 2080 + 160, 1600); sec.fills = [solid('141414')]; }
  return sec;
};
// put(screen, section, index, id, title, note) — 4 экрана в ряд, подпись под экраном
L.put = function (scr, sec, idx, id, title, note) {
  const per = 4, cx = 120 + (idx % per) * 2080, cy = 140 + Math.floor(idx / per) * 1560;
  const old = sec.children.filter(n => n.name.startsWith(id + ' ·') || n.name === 'annotation · ' + id);
  for (const o of old) o.remove();
  sec.appendChild(scr); scr.x = cx; scr.y = cy; scr.name = id + ' · ' + title;
  const a = L.annot(scr, id, title, note); sec.appendChild(a); a.x = cx; a.y = cy + 1080 + 36;
  const needH = cy + 1560 + 40; if (sec.height < needH) sec.resizeWithoutConstraints(sec.width, needH);
  return scr;
};
return L;
}
