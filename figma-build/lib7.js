async function LIB7(figma, L) {
const C = L.C, solid = L.solid;
const cp = v => JSON.parse(JSON.stringify(v));
// заменить px-надпись таймера с сохранением стиля
L.retime = function (root, value) {
  const pf = root.findOne(x => x.name.startsWith('px·40·')); if (!pf) return;
  const og = pf.findOne(x => x.name === 'glyphs');
  const np = L.px(value, { size: 40 }); const ng = np.findOne(x => x.name === 'glyphs');
  if (og && ng) { ng.fills = cp(og.fills); ng.strokes = cp(og.strokes); ng.strokeWeight = og.strokeWeight; ng.effects = cp(og.effects); }
  pf.parent.insertChild(pf.parent.children.indexOf(pf), np); pf.remove();
};
// плашка «режим» по центру сверху
L.modeBadge = function (scr, label, value, y) {
  const b = L.info(label, value); b.name = 'mode_badge · ' + label; scr.appendChild(b);
  b.x = Math.round(39 + 345 + (1530 - 39 - 345 - b.width) / 2 + 20); b.y = y || 160; return b;
};
// S-07 «Наблюдение»: S-08 текущего комитета только для просмотра + панель организатора
L.obsScreen = async function (o = {}) {
  const cid = o.cid || 'trn';
  const s = await L.s08(cid, { mode: 'obs', cur: L.COM[cid].i, round: o.round || 4 });
  const old = s.findOne(n => n.name === 'control_panel');
  const rec = old.children.find(c => /приём/.test(c.name) || c.findOne(x => x.name.startsWith('px·16·приёмная')));
  const nc = await L.hostCtrl({ mode: 'obs', host: true, round: o.round || 4 });
  s.appendChild(nc); nc.x = old.x; nc.y = old.y;
  if (rec) nc.insertChild(nc.children.length - 1, rec);
  const tp = nc.children.find(c => c.name.includes('turn_panel')); if (tp) { const lab = tp.children[0]; if (lab && lab.name.startsWith('px·')) lab.remove(); tp.paddingLeft = 8; tp.paddingRight = 8; }
  old.remove();
  L.modeBadge(s, 'наблюдение', L.COM[cid].title + ' · только просмотр');
  return s;
};
// модалка «команда + текст» для P-04
L.teamLine = async function (team, text) {
  const r = L.al('H', { gap: 12, cross: 'CENTER', name: 'keep·team_line' });
  r.appendChild(await L.tag(team, false)); r.appendChild(L.body(text, { size: 16 }));
  return r;
};
L.p04 = async function (team, o = {}) {
  return await L.modal({ w: 560, title: 'запрос паузы', body: [await L.teamLine(team, 'запрашивает паузу'), L.cap(o.note || 'Пауза остановит таймеры у всех команд на 5:00. Крестик – то же, что «Отклонить».', { w: 512 })], footer: await L.btnFoot([['отклонить', 'btnS'], ['принять', 'btnP']]), maxH: 860 });
};
// P-17 у организатора: тело из P-17 команды + «Продолжить игру»
L.p17host = async function () {
  const src = await figma.getNodeByIdAsync('2072:1719');
  const sm = src.children.find(c => c.name.startsWith('modal'));
  const body = sm.findOne(n => n.name === 'modal_container · контент').children.map(c => c.clone());
  const t = body[0]; if (t.type === 'TEXT') { await figma.loadFontAsync(t.fontName); t.characters = 'Игра на паузе: таймеры всех команд стоят. Возобновите игру, когда будете готовы, – или она продолжится сама по окончании отсчета.'; }
  return await L.modal({ w: 560, title: 'пауза', close: false, body, footer: await L.btnFoot([['продолжить игру', 'btnP']]), maxH: 860 });
};
// P-14: o.text — основной текст, o.note — пояснение
L.p14 = async function (o) {
  const body = []; if (o.text) body.push(L.body(o.text, { size: 16 })); if (o.note) body.push(L.cap(o.note, { w: 512 }));
  return await L.modal({ w: 560, title: 'завершить игру?', body, footer: await L.btnFoot([['отмена', 'btnS'], ['завершить игру', 'btnP']]), maxH: 860 });
};
// ---------- S-10 Приёмная ----------
L.RES = [
  ['студент', 'resP', 'Метро до моего района так и не дотянули: на учебу полтора часа в одну сторону.'],
  ['предприниматель', 'resC'],
  ['it-специалист', 'resI'],
  ['архитектор', 'resI'],
  ['адаптировавшийся мигрант', 'resI']
];
L.reception = async function (o = {}) {
  const cid = o.cid || 'trn';
  const s = await L.s08(cid, { mode: 'wait', cur: o.cur != null ? o.cur : 2, round: o.round || 4 });
  s.name = 'S-10';
  // интерфейс команды без блока инструментов
  const lp = s.findOne(n => n.name.startsWith('committee_panel'));
  for (const k of lp.children.slice(2)) k.remove();
  lp.primaryAxisSizingMode = 'AUTO';
  // кнопка «вернуться назад» вместо «приёмная»
  const ctrl = s.findOne(n => n.name === 'control_panel');
  const rec = ctrl.children.find(c => c.findOne(x => x.name.startsWith('px·16·приёмная')));
  const back = await L.btn('вернуться назад', 'btnS', { icon: 'arrow-left' });
  if (rec) { ctrl.insertChild(ctrl.children.indexOf(rec), back); rec.remove(); }
  // фон приёмной (заглушка до иллюстрации 3.2.6)
  const bg = s.children[0];
  const hall = L.rect(1920, 1080, C.dark, { op: 0.72, name: 'фон · приёмная (заглушка до илл. 3.2.6)' }); s.insertChild(1, hall);
  const floor = L.rect(1100, 6, C.s4, { r: 999, name: 'линия пола' }); s.insertChild(2, floor); floor.x = 410; floor.y = 905;
  // заголовок
  const title = L.px('приёмная · ' + L.COM[cid].short, { size: 30, shadow: C.a2, align: 'CENTER', w: 1000 }); s.appendChild(title); title.x = 460; title.y = 168;
  const sub = L.cap('Жители приходят после пересчета города. Нажмите на жителя, чтобы услышать реплику.', { w: 1000, align: 'CENTER' }); s.appendChild(sub); sub.x = 460; sub.y = 222;
  // жители
  const SC = 0.6, W = 365 * SC, GAP = 6, N = L.RES.length;
  const x0 = Math.round(410 + (1100 - (N * W + (N - 1) * GAP)) / 2);
  let pressed = null;
  for (let i = 0; i < N; i++) {
    const [type, kk] = L.RES[i];
    const r = await L.kit(kk); s.appendChild(r);
    const bp = r.findOne(x => x.name === 'Badge/primary'); if (bp) bp.visible = false;
    for (const tt of L.texts(r).filter(t => t.characters !== 'Текст ошибки' && L.isVis(t))) await L.setT(tt, type);
    if (kk === 'resI') for (const v of r.findAll(x => x.name === 'stroke')) v.visible = true;
    for (const w of r.findAll(x => x.name === 'text_wrapper' && x.children && x.children.some(c => c.type === 'TEXT' && c.characters === 'Текст ошибки'))) w.visible = false;
    r.rescale(SC); r.x = x0 + i * (W + GAP); r.y = 905 - r.height + 26;
    r.name = 'UI-31 · Resident/' + ({ resI: 'initial (новая реплика, обводка)', resP: 'pressed', resC: 'choosen (уже слушали)', resH: 'hover' }[kk]) + ' · ' + type;
    if (kk === 'resP') pressed = [r, L.RES[i][2], type];
  }
  if (pressed) {
    const [r, text, type] = pressed;
    const d = await L.kit('dlg'); s.appendChild(d);
    const ts = L.texts(d); await L.setT(ts[0], type); await L.setT(ts[1], text);
    d.name = 'UI-30 · Dialog_window · реплика (до 100 символов)';
    d.x = Math.round(r.x + r.width / 2 - 40); d.y = Math.round(r.y - d.height + 40);
  }
  return s;
};
// ---------- S-11 Итоги ----------
L.FINAL = [['Бизнес-ангелы', 'biz', '1 486'], ['Белые ночи', 'tur', '1 412'], ['Градостроители 9Б', 'urb', '1 377'], ['Транспортники', 'trn', '1 351'], ['Новые горизонты', 'mig', '1 298'], ['Знание — сила', 'edu', '1 240']];
L.SOLO = [['1', 'mayor_spb', '84', '6'], ['2', 'petrograd', '81', '6'], ['3', 'neva_nevа', '79', '5'], ['3', 'ostrov', '79', '6'], ['5', 'kirpich', '75', '4'], ['6', 'liteyny', '72', '6'], ['7', 'okhta', '70', '3'], ['8', 'admiral', '68', '6'], ['9', 'fontanka', '66', '5'], ['10', 'kupchino', '65', '6'], ['…', '', '', ''], ['14', 'gorodnichiy', '60', '4']];
L.soloBoard = async function (own) {
  const rows = [];
  for (const [pos, nick, avg, rd] of L.SOLO) {
    if (pos === '…') { const e = L.px('· · ·', { size: 18, fill: C.n2, align: 'CENTER', w: 600 }); rows.push(e); continue; }
    const me = nick === own;
    const r = await L.kit(me ? 'lbUp' : 'lbOup');
    const ts = L.texts(r);
    await L.setT(ts[0], pos); await L.setT(ts[1], nick); await L.setT(ts[2], 'ср. ' + avg); await L.setT(ts[3], rd + ' р.');
    for (const ic of r.findAll(x => x.name === 'vercel-solid')) ic.visible = false;
    for (const w of r.findAll(x => x.name === 'text_wrapper' && x.children && x.children.some(c => c.type === 'TEXT' && c.characters === 'Текст ошибки'))) w.visible = false;
    L.hug(r.findOne(x => x.name === 'stat_badge_group') || r);
    r.name = 'Leaderboard_row · ' + pos + ' · ' + nick + (me ? ' (своя)' : '');
    rows.push(r);
  }
  return L.col(rows, { gap: 4, name: 'BLK-02 · лидерборд одиночной игры (топ-10 + своя строка)' });
};
// UI-12 по киту Round_graph: несколько серий, ось X «Старт, Р1…», легенда
// series: [{name, pts, color, dash, own}], o: {w, max, yLabels, xLabels}
L.chart = async function (series, o) {
  const W = o.w || 704;
  const g = await L.kit('graph'); g.name = 'UI-12 · Round_graph';
  g.primaryAxisSizingMode = 'FIXED'; const dh = o.h ? o.h - g.height : 0; g.resize(W, g.height + dh);
  const cnt = g.findOne(x => x.name === 'count'); const ys = cnt.findAll(x => x.type === 'TEXT');
  if (dh) cnt.primaryAxisAlignItems = 'SPACE_BETWEEN';
  for (let i = 0; i < ys.length && i < o.yLabels.length; i++) await L.setT(ys[i], o.yLabels[i]);
  const lines = g.findOne(x => x.name === 'lines');
  const LW = Math.round(W - g.paddingLeft - g.paddingRight - cnt.width - g.itemSpacing);
  if (dh) lines.primaryAxisAlignItems = 'SPACE_BETWEEN';
  lines.resize(LW, lines.height + dh);
  cnt.primaryAxisSizingMode = 'FIXED'; cnt.resize(cnt.width, lines.height + 22);
  const gr = lines.findOne(x => x.name === 'Graph'); const H = lines.height; gr.resize(LW, H); gr.x = 0; gr.y = 0;
  for (const v of [...gr.children]) v.remove();
  const n = series[0].pts.length, dx = LW / (n - 1);
  const P = pts => pts.map((v, i) => [Math.round(i * dx * 10) / 10, Math.round(H * (1 - v / o.max) * 10) / 10]);
  const own = series.find(s => s.own);
  if (own) {
    const pp = P(own.pts); const a = figma.createVector(); a.name = 'area · ' + own.name;
    a.vectorPaths = [{ windingRule: 'NONZERO', data: 'M ' + pp.map(p => p.join(' ')).join(' L ') + ' L ' + pp[pp.length - 1][0] + ' ' + H + ' L 0 ' + H + ' Z' }];
    const c = L.rgb ? L.rgb(C.a3) : { r: 0.99, g: 0.2, b: 0.53 };
    a.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]], gradientStops: [{ position: 0, color: Object.assign({}, c, { a: 0.5 }) }, { position: 1, color: Object.assign({}, c, { a: 0.02 }) }] }];
    a.strokes = []; gr.appendChild(a);
  }
  for (const s of [...series].sort((x, y) => (x.own ? 1 : 0) - (y.own ? 1 : 0))) {
    const pp = P(s.pts); const v = figma.createVector(); v.name = 'line · ' + s.name;
    v.vectorPaths = [{ windingRule: 'NONE', data: 'M ' + pp.map(p => p.join(' ')).join(' L ') }];
    v.fills = []; v.strokes = [solid(s.color)]; v.strokeWeight = s.own ? 3 : 2; v.strokeJoin = 'ROUND'; v.strokeCap = 'ROUND';
    if (s.dash) v.dashPattern = [6, 6];
    gr.appendChild(v);
    const last = pp[pp.length - 1]; const d = figma.createEllipse(); d.resize(s.own ? 12 : 8, s.own ? 12 : 8); d.fills = [solid(s.color)]; d.name = 'point · итог'; gr.appendChild(d); d.x = last[0] - d.width / 2; d.y = last[1] - d.height / 2;
  }
  // ось X
  const xl = figma.createFrame(); xl.name = 'x_axis · Старт, раунды'; xl.fills = []; xl.clipsContent = false; xl.resize(W, 22);
  const x0 = g.paddingLeft + cnt.width + g.itemSpacing;
  for (let i = 0; i < n; i++) { const t = L.cap(o.xLabels[i], { size: 13, wt: 'Bold', fill: C.n2 }); xl.appendChild(t); t.x = Math.round(x0 + i * dx - t.width / 2); t.y = 0; }
  // легенда
  const lg = L.al('H', { gap: 20, name: 'legend' }); lg.layoutWrap = 'WRAP'; lg.counterAxisSpacing = 8;
  for (const s of series) {
    const it = L.al('H', { gap: 8, cross: 'CENTER', name: 'legend · ' + s.name });
    const sw = figma.createLine(); sw.resize(20, 0); sw.strokes = [solid(s.color)]; sw.strokeWeight = s.own ? 3 : 2; if (s.dash) sw.dashPattern = [4, 3]; it.appendChild(sw);
    it.appendChild(L.cap(s.name, { size: 13, wt: s.own ? 'Bold' : 'Medium', fill: s.own ? C.a3 : C.n3 }));
    lg.appendChild(it);
  }
  const wrap = L.col([g, xl, lg], { gap: 10, name: 'UI-12 · график по раундам' });
  xl.layoutSizingHorizontal = 'FIXED'; g.layoutSizingHorizontal = 'FIXED';
  return wrap;
};
// o: {kind:'team'|'host'|'solo', own, cid}
L.results = async function (o) {
  const s = L.screen('S-11', 'game');
  const base = await figma.getNodeByIdAsync(L.BASE.trn);
  const blk = base.findOne(n => n.name.startsWith('BLK-01')).clone(); s.appendChild(blk); blk.x = 39; blk.y = 13;
  blk.name = 'BLK-01 · на конец последнего оцененного раунда (без перехода в P-10)';
  // лидерборд
  const LW = 760;
  const lb = L.panel(o.kind === 'solo' ? 'лидерборд одиночной игры' : 'итоги · победитель', LW, 806);
  if (o.kind === 'solo') {
    lb.appendChild(await L.soloBoard('gorodnichiy'));
  } else {
    const teams = L.FINAL.map(t => [t[0], t[1], t[2], null]);
    lb.appendChild(await L.leaderboard({ own: o.kind === 'team' ? o.own : null, teams, suffix: ' баллов' }));
    const win = await L.chipTag('победитель', 'badgeP'); const r0 = lb.children[1].children[0]; const sg = r0.findOne(x => x.name === 'stat_badge_group') || r0; sg.appendChild(win);
  }
  lb.children[1].layoutSizingHorizontal = 'FILL';
  const capT = o.kind === 'solo' ? 'Топ-10 по среднему баллу + своя строка, если ниже 10-го места. При равенстве – общее место.' : (o.kind === 'host' ? 'Итоговые баллы – сумма оцененных раундов. У организатора своей строки нет.' : 'Итоговые баллы – сумма оцененных раундов. Своя строка подсвечена. При равенстве – несколько победителей.');
  const sp = L.spacer(); lb.appendChild(sp); sp.layoutGrow = 1;
  const stats = o.kind === 'solo' ? [['средний балл', '60'], ['итоговые баллы', '240'], ['раундов', '4'], ['сид', 'K7Q-24M']] : [['раундов оценено', '6'], ['сид комнаты', 'K7Q-24M']];
  const ir = L.infos(stats.map(a => [a[0], a[1]])); ir.name = 'итоги · сводка';
  lb.appendChild(L.cap(capT, { w: LW - 28 }));
  s.appendChild(lb); lb.x = 39; lb.y = 160;
  // графики
  const GW = 1881 - 39 - LW - 24, gx = 39 + LW + 24;
  const gp = L.panel('графики по раундам', GW, 806);
  const cid = o.cid || o.own || 'trn';
  if (o.kind !== 'team') {
    const ct = await L.tabs(L.ORDER.map(k => L.COM[k].short), L.ORDER.indexOf(cid)); ct.name = 'chip_group · выбор комитета'; gp.appendChild(ct);
  }
  const kt = await L.tabs(['баллы ' + (o.kind === 'solo' ? 'по раундам' : 'команд'), ...L.COM[cid].kpi.map(k => k[0])], 0); kt.name = 'chip_group · графики (баллы / KPI комитета)'; gp.appendChild(kt);
  kt.layoutSizingHorizontal = 'FILL';
  for (const gl of gp.findAll(x => x.type === 'RECTANGLE' && x.parent.name.startsWith('Chip_primary/pressed'))) { gl.resize(Math.max(10, gl.parent.width - 20), gl.height); gl.x = 10; }
  const used = 14 + gp.children.reduce((a, c) => a + c.height, 0) + 14 * gp.children.length;
  const HH = Math.round(Math.min(480, 806 - used - 14 - 14 - 40 - 62));
  let series, ch;
  if (o.kind === 'solo') {
    series = [{ name: 'gorodnichiy · баллы за раунд', pts: [0, 52, 61, 58, 69], color: C.a3, own: true }];
    ch = await L.chart(series, { w: GW - 28, max: 100, yLabels: ['100', '80', '60', '40', '20', '0'], xLabels: ['Старт', 'Р1', 'Р2', 'Р3', 'Р4'], h: HH });
  } else {
    const SER = { biz: [0, 230, 470, 720, 980, 1230, 1486], tur: [0, 250, 490, 710, 940, 1180, 1412], urb: [0, 240, 460, 690, 930, 1150, 1377], trn: [0, 210, 430, 660, 900, 1120, 1351], mig: [0, 220, 440, 650, 860, 1080, 1298], edu: [0, 200, 410, 620, 830, 1030, 1240] };
    const COL = [[C.n5, false], [C.n2, false], [C.a1, false], [C.n5, true], [C.n2, true], [C.a1, true]];
    let k = 0;
    series = L.FINAL.map(t => { const me = o.kind === 'team' && t[1] === o.own; const c = me ? [C.a3, false] : COL[k++]; return { name: t[0], pts: SER[t[1]], color: c[0], dash: c[1], own: me }; });
    ch = await L.chart(series, { w: GW - 28, max: 1500, yLabels: ['1 500', '1 200', '900', '600', '300', '0'], xLabels: ['Старт', 'Р1', 'Р2', 'Р3', 'Р4', 'Р5', 'Р6'], h: HH });
  }
  gp.appendChild(ch); ch.layoutSizingHorizontal = 'FILL';
  gp.appendChild(L.cap('Первая точка – «Старт», далее – итог каждого завершенного раунда. Баллы – целым числом; промежуточные пересчеты внутри раунда точек не добавляют.', { w: GW - 28 }));
  s.appendChild(gp); gp.x = gx; gp.y = 160;
  // нижняя панель
  const bar = L.al('H', { gap: 16, cross: 'CENTER', main: 'SPACE_BETWEEN', name: 'bottom_bar', w: 1842, h: 60 });
  bar.appendChild(ir);
  bar.appendChild(await L.btn('выйти', 'btnP', { icon: 'arrow-left' }));
  s.appendChild(bar); bar.x = 39; bar.y = 989;
  return s;
};
return L;
}
