// proto-lib.js — библиотека для страницы «Динамический интерфейс» (2323:87).
// Превращает элементы экранов в интерактивные компоненты: варианты состояний
// собираются из самого элемента по правилам кита (страница «1», components 54:81),
// одинаковые элементы переиспользуют один набор (подпись sig в имени набора).
// Использование: вставить этот текст в начало кода use_figma, затем вызвать
//   await PROTO.convertScreen(screenFrame)  — для каждого экрана.
// LIB_ID — секция «Интерактивные компоненты» на странице 2323:87.

const LIB_ID = '2330:87';
const PROTO = await (async () => {
  const LIB = await figma.getNodeByIdAsync(LIB_ID);
  const C = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const P = C('#fd3286'), D2 = C('#232727'), E3 = C('#e3e3e3'), F2 = C('#f2f2f2'), G4 = C('#4c5152');
  const near = (c, h) => { const t = C(h); return Math.abs(c.r - t.r) < 0.012 && Math.abs(c.g - t.g) < 0.012 && Math.abs(c.b - t.b) < 0.012; };
  const TR = { type: 'SMART_ANIMATE', easing: { type: 'EASE_OUT' }, duration: 0.12 };
  const kitCache = {};
  const kit = async (id) => (kitCache[id] = kitCache[id] || await figma.getNodeByIdAsync(id));
  const GLOW_FX = JSON.parse(JSON.stringify((await kit('122:3590')).children[0].effects));
  const RES_FX = JSON.parse(JSON.stringify((await kit('123:21216')).findOne(n => n.name === 'stroke').effects));

  const inner = (n) => (n.children || []).find(c => /^inner_wrapper$/i.test(c.name));
  const isErr = (n) => n.type === 'TEXT' && n.characters === 'Текст ошибки';
  const paintNodes = (root) => {
    const out = [];
    root.findAll(x => {
      if (isErr(x)) return false;
      if (x.type === 'TEXT') out.push(x);
      else if (/^px·/.test(x.name)) { out.push(x); if (x.findAll) out.push(...x.findAll(v => 'fills' in v)); }
      return false;
    });
    return out;
  };
  const recolor = (nodes, from, to) => { for (const n of nodes) { if (!('fills' in n) || n.fills === figma.mixed || !n.fills.length) continue; n.fills = n.fills.map(p => p.type === 'SOLID' && near(p.color, from) ? { ...p, color: to } : p); } };
  const shadows = (nodes, to, from = '#9d9d9d') => { for (const n of nodes) { if (!n.effects || !n.effects.length) continue; n.effects = n.effects.map(e => e.type === 'DROP_SHADOW' && near(e.color, from) ? { ...e, color: { ...to, a: e.color.a } } : e); } };
  const all = (n) => [n, ...(n.findAll ? n.findAll(() => true) : [])];
  const stroke = (n, c, w) => { const had = n.strokes && n.strokes.length; n.strokes = [{ type: 'SOLID', color: c }]; if (w) n.strokeWeight = w; else if (!had) n.strokeWeight = 2.2; };
  const fill = (n, c) => { n.fills = [{ type: 'SOLID', color: c }]; };
  const glow = (n, x, y, w, h, fx = GLOW_FX) => {
    const r = figma.createRectangle(); r.name = 'Rectangle 24514';
    r.fills = [{ type: 'SOLID', color: P }]; r.effects = fx;
    n.insertChild(0, r); if (n.layoutMode && n.layoutMode !== 'NONE') r.layoutPositioning = 'ABSOLUTE';
    r.x = x; r.y = y; r.resize(Math.max(1, w), Math.max(1, h)); return r;
  };
  const relBox = (node, root) => { const a = node.absoluteTransform, b = root.absoluteTransform; return { x: a[0][2] - b[0][2], y: a[1][2] - b[1][2], w: node.width, h: node.height }; };
  const dup = (n) => { const c = n.clone(); LIB.appendChild(c); return c; };

  // ---------- builders: return { states:{name:node}, def, react:[[from,trigger,to]] } ----------
  const HOV = [['initial', 'ON_HOVER', 'hover'], ['hover', 'ON_PRESS', 'pressed']];
  const B = {
    BP(el) { const h = dup(el), p = dup(el); for (const v of [h, p]) { const w = inner(v) || v; stroke(w, P); shadows(all(w), P); } const pw = inner(p) || p; fill(pw, D2); recolor(paintNodes(pw), '#f2f2f2', E3); return { states: { initial: el, hover: h, pressed: p }, react: HOV }; },
    BS(el) { const h = dup(el), p = dup(el); for (const v of [h, p]) { const w = inner(v) || v; stroke(w, P); shadows(paintNodes(w), P); } recolor(paintNodes(p), '#f2f2f2', E3); return { states: { initial: el, hover: h, pressed: p }, react: HOV }; },
    BL(el) { const h = dup(el), p = dup(el); shadows(paintNodes(h), P); const pn = paintNodes(p); recolor(pn, '#f2f2f2', E3); pn.forEach(t => { if (t.effects) t.effects = []; }); return { states: { initial: el, hover: h, pressed: p }, react: HOV }; },
    BI(el) { const h = dup(el), p = dup(el); for (const v of [h, p]) stroke(inner(v) || v, P); fill(inner(p) || p, D2); return { states: { initial: el, hover: h, pressed: p }, react: HOV }; },
    BA(el) { const h = dup(el); glow(h, 0, -2, el.width, el.height + 4); return { states: { initial: el, hover: h }, react: [HOV[0]] }; },
    CP(el) { const h = dup(el); const w = inner(h); glow(h, 0, 0, el.width, el.height); if (w) { fill(w, D2); shadows(paintNodes(w), P); } return { states: { initial: el, hover: h }, react: [HOV[0]] }; },
    CS(el) { const h = dup(el); glow(h, 0, 0, el.width, el.height); shadows(paintNodes(h), P); return { states: { initial: el, hover: h }, react: [HOV[0]] }; },
    CI(el) { const h = dup(el), p = dup(el); for (const v of [h, p]) { glow(v, 0, 0, el.width, el.height); fill(inner(v) || v, D2); } stroke(inner(p) || p, P, (inner(p) || p).strokeWeight); return { states: { initial: el, hover: h, pressed: p }, react: HOV }; },
    BLK(el) { const h = dup(el), p = dup(el); for (const v of [h, p]) { stroke(v, P); shadows(all(v), P); } fill(p, D2); return { states: { initial: el, hover: h, pressed: p }, react: HOV }; },
    KPI(el) { const pill = (v) => v.children.find(c => /^Kpi_row\//.test(c.name)) || v; const h = dup(el), p = dup(el); for (const v of [h, p]) stroke(pill(v), P, pill(v).strokeWeight); fill(pill(p), D2); return { states: { initial: el, hover: h, pressed: p }, react: HOV }; },
    EV(el) { const h = dup(el), p = dup(el); for (const v of [h, p]) { const w = inner(v) || v; recolor(paintNodes(w), '#4c5152', F2); } stroke(inner(p) || p, F2, 2); return { states: { initial: el, hover: h, pressed: p }, react: HOV }; },
    // Слайдер: hover — контур ручки accent-3 (бейдж предикта в макетах — заглушка кита, не показываем)
    SL(el) { const h = dup(el); const th = h.findOne(n => n.name === 'thumb'); if (th) stroke(th, P, th.strokeWeight); return { states: { initial: el, hover: h }, react: [HOV[0]] }; },
    IN(el) {
      const h = dup(el), f = dup(el);
      for (const v of [h, f]) { const w = inner(v) || v; const b = relBox(w, v); glow(v, b.x, b.y + 2, b.w, b.h - 4); }
      return { states: { initial: el, hover: h, focus: f }, react: [['initial', 'MOUSE_ENTER', 'hover'], ['hover', 'MOUSE_LEAVE', 'initial'], ['hover', 'ON_CLICK', 'focus']] };
    },
    CODE(el) {
      const h = dup(el); const cell = h.findOne(n => n.name === 'cell'); const b = cell ? relBox(cell, h) : { x: 0, y: 0, w: 70, h: el.height };
      glow(h, b.x, b.y, b.w, b.h); return { states: { initial: el, hover: h }, react: [HOV[0]] };
    },
    SW: async (el) => {
      const on = /pressed/.test(el.name);
      const big = /big/i.test(el.name);
      const ids = big ? ['122:2996', '122:3026', '122:3038'] : ['122:3001', '122:3032', '122:3044'];
      const off = on ? dup(await kit(ids[0])) : el, hv = dup(await kit(ids[1])), onN = on ? el : dup(await kit(ids[2]));
      return { states: { off, 'off-hover': hv, on: onN }, def: on ? 'on' : 'off', react: [['off', 'MOUSE_ENTER', 'off-hover'], ['off-hover', 'MOUSE_LEAVE', 'off'], ['off-hover', 'ON_CLICK', 'on'], ['on', 'ON_CLICK', 'off']] };
    },
    CARD: async (el) => {
      // Сommittee_card (S-04.a, P-01) и Team_card (своя команда, S-06/P-03)
      const team = /^Team_card/.test(el.name);
      const role = !team && el.height < 200; // карточки ролей P-01
      const st = /hover/.test(el.name) ? 'hover' : /pressed/.test(el.name) ? 'pressed' : 'initial';
      const clean = (v) => {
        for (const c of [...v.children]) if (c.type === 'RECTANGLE' && c.name === 'Rectangle 24514') c.remove();
        const img = v.findOne(n => n.name === 'img'); if (!img) return;
        for (const c of [...img.children]) if (/^(Button_primary\/hover|Choosen)$/.test(c.name) || (!team && c.name === 'Badge/primary')) c.remove();
        stroke(img, G4, img.strokeWeight);
        for (const r of img.children) if (r.type === 'RECTANGLE' && r.fills !== figma.mixed) r.fills = r.fills.filter(f => !(f.type === 'SOLID' && near(f.color, '#000000')));
      };
      const darken = (img) => { for (const r of img.children) if (r.type === 'RECTANGLE' && r.fills !== figma.mixed && r.fills.some(f => f.type === 'IMAGE') && !r.fills.some(f => f.type === 'SOLID')) r.fills = [...r.fills, { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.65 }]; };
      const base = st === 'initial' ? el : dup(el); if (st !== 'initial') clean(base);
      const mkHover = async () => {
        const v = dup(base); const img = v.findOne(n => n.name === 'img');
        if (role) glow(v, 0, 0, v.width, v.height); else glow(v, -6, team ? -7 : -6, v.width + 11, v.height + (team ? 18 : 14));
        if (img) { stroke(img, P, img.strokeWeight); darken(img);
          const btn = (await kit(team ? '122:5274' : '122:5342')).findOne(n => n.name === 'Button_primary/hover').clone();
          img.appendChild(btn); btn.x = Math.round((img.width - btn.width) / 2); btn.y = role ? Math.round((img.height - btn.height) / 2) : 82; // кит: y = 82 }
        return v;
      };
      const states = { initial: base };
      states.hover = st === 'hover' ? el : await mkHover();
      const react = [['initial', 'MOUSE_ENTER', 'hover'], ['hover', 'MOUSE_LEAVE', 'initial']];
      if (!team && !role) {
        let p = st === 'pressed' ? el : null;
        if (!p) { p = dup(base); const img = p.findOne(n => n.name === 'img'); glow(p, 0, 0, p.width, p.height);
          if (img) { stroke(img, P, img.strokeWeight); darken(img); const kp = await kit('122:5375');
            for (const nm of ['Badge/primary', 'Choosen']) { const s = kp.findOne(n => n.name === nm); const c = s.clone(); img.appendChild(c); c.x = nm === 'Choosen' ? Math.round((img.width - c.width) / 2) : Math.round((img.width - c.width) / 2); c.y = s.y; } } }
        states.pressed = p; react.push(['hover', 'ON_CLICK', 'pressed'], ['pressed', 'ON_CLICK', 'initial']);
      }
      return { states, def: st === 'pressed' ? 'pressed' : 'initial', react };
    },
    RES(el) {
      const h = dup(el), r = dup(el);
      const sh = h.findOne(n => n.name === 'stroke'); if (sh) { sh.visible = true; sh.effects = RES_FX; }
      const im = h.findOne(n => /^img ·/.test(n.name)); if (im) im.fills = im.fills.map(f => f.type === 'IMAGE' ? { ...f, filters: { ...(f.filters || {}), exposure: -0.55 } } : f); // затемнение
      const sr = r.findOne(n => n.name === 'stroke'); if (sr) sr.visible = false;
      return { states: { initial: el, hover: h, read: r }, react: [['initial', 'MOUSE_ENTER', 'hover'], ['hover', 'MOUSE_LEAVE', 'initial'], ['hover', 'ON_CLICK', 'read']] };
    },
    SEG(el) {
      // три позиции; выбранная — оформление Chip_primary/pressed из самого элемента
      const chips = (v) => (inner(v) || v).children.filter(c => /^Chip_primary\//.test(c.name));
      const src = chips(el); const selIdx = src.findIndex(c => /pressed/.test(c.name));
      const pressedProto = src[selIdx], initProto = src.find(c => /initial/.test(c.name));
      const states = {}; const names = ['left', 'center', 'right'];
      names.forEach((nm, i) => {
        if (i >= src.length) return;
        const v = i === selIdx ? el : dup(el);
        if (i !== selIdx) {
          const cs = chips(v);
          // поменять оформление: i-й → pressed, бывший выбранный → initial (геометрия и заливки по образцам)
          const swap = (chip, proto, toPressed) => {
            const w = inner(chip), pw = inner(proto);
            const g = chip.children.find(c => c.type === 'RECTANGLE'); if (g) g.remove();
            if (toPressed) { const pg = proto.children.find(c => c.type === 'RECTANGLE'); if (pg) { const gc = pg.clone(); chip.insertChild(0, gc); gc.layoutPositioning = 'ABSOLUTE'; gc.x = pg.x; gc.y = pg.y; gc.resize(chip.width, pg.height); } }
            w.fills = JSON.parse(JSON.stringify(pw.fills)); w.strokes = JSON.parse(JSON.stringify(pw.strokes)); w.strokeWeight = pw.strokeWeight;
            w.paddingTop = pw.paddingTop; w.paddingBottom = pw.paddingBottom; w.paddingLeft = pw.paddingLeft; w.paddingRight = pw.paddingRight;
            const pt = paintNodes(pw)[0]; if (pt) for (const t of paintNodes(w)) { if (t.type === 'TEXT') { t.fills = JSON.parse(JSON.stringify(pt.fills)); t.effects = JSON.parse(JSON.stringify(pt.effects)); } }
            chip.name = toPressed ? 'Chip_primary/pressed' : 'Chip_primary/initial';
          };
          swap(cs[i], pressedProto, true); swap(cs[selIdx], initProto, false);
        }
        states[nm] = v;
      });
      return { states, def: names[selIdx], seg: true };
    },
  };

  // ---------- классификация ----------
  function kindOf(n, code) {
    if (n.type !== 'FRAME' || !n.visible) return null;
    const nm = n.name;
    if (/(\/disabled|\/error|\/pressed|\(pressed\)|^btnPd|\/lock|\/choosen|_another_team)/.test(nm) && !/^(Сommittee_card\/pressed|Switch_|Segment_control\/(left|center|right))/.test(nm)) return null;
    if (/^(Button_primary\/initial|btnP ·)/.test(nm)) return 'BP';
    if (/^(Button_secondary\/initial|btnS ·)/.test(nm)) return 'BS';
    if (/^(Button_link\/initial|btnL ·)/.test(nm)) return 'BL';
    if (/^Button_icon\/initial/.test(nm)) return 'BI';
    if (/^Button_accent\/initial/.test(nm)) return 'BA';
    if (/^Chip_primary\/initial/.test(nm)) return 'CP';
    if (/^Chip_secondary\/initial/.test(nm)) return 'CS';
    if (/^Chip_icon\/initial/.test(nm)) return 'CI';
    if (/^blk_button/.test(nm)) return 'BLK';
    if (/^Kpi_row · .+ · зона/.test(nm)) return 'KPI';
    if (/^UI-18 · Event_indicator\/active/.test(nm)) return 'EV';
    if (/^Slider\/initial/.test(nm)) return 'SL';
    if (/^(Input\/initial|input\/typing|input\/initial)/.test(nm)) return 'IN';
    if (/^Code_input\/(initial|typing)/.test(nm) && /^P-02/.test(code)) return 'CODE';
    if (/^Switch_(big|small)\/(initial|pressed)/.test(nm)) return 'SW';
    if (/^(Сommittee_card\/(initial|hover|pressed)|Team_card\/hover)/.test(nm)) return 'CARD';
    if (/^UI-31 · Resident · новая реплика/.test(nm)) return 'RES';
    if (/^Segment_control\/(left|center|right)/.test(nm)) return 'SEG';
    return null;
  }
  function skipInside(n) { // внутри этих узлов — свои правила
    return /^(Question_tip|UI-36|Dialog_window|Budget|UI-13)/.test(n.name);
  }
  function collect(screen, code) {
    const out = [];
    let start = 0; const ov = screen.children.findIndex(c => /^overlay/.test(c.name)); if (ov >= 0) start = ov + 1;
    const walk = (n, ctx) => {
      for (const c of n.children || []) {
        if (!c.visible || c.type === 'INSTANCE' || skipInside(c)) continue;
        const k = kindOf(c, code);
        if (k && !(ctx.stepper && k !== 'BI') && !(ctx.event && k === 'CI') && !(ctx.seg)) { out.push([c, k]); continue; }
        if (/^Stepper/.test(c.name)) { walk(c, { ...ctx, stepper: true }); continue; }
        if (/^UI-18/.test(c.name)) { walk(c, { ...ctx, event: true }); continue; }
        if (/^Segment_control/.test(c.name)) continue;
        if (c.children) walk(c, ctx);
      }
    };
    screen.children.slice(start).forEach(c => walk({ children: [c] }, {}));
    return out;
  }
  function sig(n, k) {
    let s = k; for (const x of all(n)) { s += `|${x.type[0]}${x.name}${Math.round(x.width)}x${Math.round(x.height)}${x.visible ? '' : '-'}`;
      if (x.type === 'TEXT') s += x.characters;
      if ('fills' in x && x.fills !== figma.mixed) for (const f of x.fills) s += f.type === 'SOLID' ? `${Math.round(f.color.r * 255)}${Math.round(f.color.g * 255)}${Math.round(f.color.b * 255)}` : f.type[0]; }
    let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36) + s.length.toString(36);
  }
  const libIndex = {};
  for (const c of LIB.children) if (c.type === 'COMPONENT_SET') { const m = c.name.match(/#(\w+)$/); if (m) libIndex[m[1]] = c; }
  let cursor = (() => { let x = 0, y = 0; for (const c of LIB.children) { if (c.x > x + 10) { x = c.x; y = 0; } if (Math.abs(c.x - x) < 10) y = Math.max(y, c.y + c.height + 40); } return { x: Math.max(80, x), y: Math.max(80, y) }; })();
  const place = (set) => { if (cursor.y + set.height > 9000) { cursor.x += 1700; cursor.y = 80; } set.x = cursor.x; set.y = cursor.y; cursor.y += set.height + 40; };

  async function makeSet(el, k, key) {
    const label = (el.name.split(' · ').slice(1).join(' ') || paintNodes(el).map(t => t.type === 'TEXT' ? t.characters : t.name.split('·').pop()).join(' ')).slice(0, 40);
    const base = dup(el);
    const r = await B[k](base);
    const comps = {};
    for (const [st, node] of Object.entries(r.states)) { node.name = 'State=' + st; const comp = figma.createComponentFromNode(node); comp.clipsContent = false; comps[st] = comp; }
    const set = figma.combineAsVariants(Object.values(comps), LIB);
    set.name = `ix · ${k} · ${label} #${key}`; set.clipsContent = false;
    let x = 24, hmax = 0; for (const c of Object.values(comps)) { c.x = x; c.y = 24; x += c.width + 24; hmax = Math.max(hmax, c.height); }
    set.resizeWithoutConstraints(x, hmax + 48);
    for (const [from, trig, to] of (r.react || [])) {
      const a = comps[from], b = comps[to]; if (!a || !b) continue;
      const trigger = /MOUSE_/.test(trig) ? { type: trig, delay: 0 } : { type: trig };
      await a.setReactionsAsync([...a.reactions, { trigger, actions: [{ type: 'NODE', destinationId: b.id, navigation: 'CHANGE_TO', transition: TR, preserveScrollPosition: false }] }]);
    }
    if (r.seg) { // клики по позициям переключателя
      const order = ['left', 'center', 'right'];
      for (const st of Object.keys(comps)) { const chipsOf = (inner(comps[st]) || comps[st]).children.filter(c => /^Chip_primary\//.test(c.name));
        for (let i = 0; i < chipsOf.length; i++) { const to = comps[order[i]]; if (!to || order[i] === st) continue;
          await chipsOf[i].setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId: to.id, navigation: 'CHANGE_TO', transition: TR, preserveScrollPosition: false }] }]); } }
    }
    place(set);
    return set;
  }
  function variant(set, st) { return set.children.find(c => c.name === 'State=' + st) || set.defaultVariant; }
  function replace(el, inst) {
    const p = el.parent, i = p.children.indexOf(el);
    p.insertChild(i, inst);
    inst.name = el.name;
    const al = p.layoutMode && p.layoutMode !== 'NONE';
    if (al && el.layoutPositioning !== 'ABSOLUTE') {
      try { inst.layoutSizingHorizontal = el.layoutSizingHorizontal; } catch (e) {}
      try { inst.layoutSizingVertical = el.layoutSizingVertical; } catch (e) {}
    } else { if (al) inst.layoutPositioning = 'ABSOLUTE'; inst.x = el.x; inst.y = el.y; try { inst.constraints = el.constraints; } catch (e) {} }
    el.remove();
  }
  async function convertScreen(screen) {
    const code = screen.name.split(' · ')[0];
    const items = collect(screen, code);
    let made = 0, reused = 0; const errs = [];
    for (const [el, k] of items) {
      try {
        const key = sig(el, k);
        let set = libIndex[key];
        if (!set) { set = await makeSet(el, k, key); libIndex[key] = set; made++; } else reused++;
        const st = k === 'SW' ? (/pressed/.test(el.name) ? 'on' : 'off') : k === 'SEG' ? (el.name.match(/(left|center|right)/) || [])[1] : (k === 'CARD' && /pressed/.test(el.name)) ? 'pressed' : null;
        const v = st ? variant(set, st) : (set.children.find(c => /State=(initial|off)$/.test(c.name)) || set.defaultVariant);
        replace(el, v.createInstance());
      } catch (e) { errs.push(k + ':' + el.name.slice(0, 30) + ':' + e.message.slice(0, 80)); }
    }
    return { code, items: items.length, made, reused, errs };
  }
  function fitLib() { let w = 0, h = 0; for (const c of LIB.children) { w = Math.max(w, c.x + c.width); h = Math.max(h, c.y + c.height); } LIB.resizeWithoutConstraints(w + 80, h + 80); }
  return { convertScreen, fitLib, LIB, kindOf, collect };
})();
