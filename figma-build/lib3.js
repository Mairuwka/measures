async function LIB3(figma, L) {
const C = L.C, solid = L.solid;
// ---------- данные (форматирование по 4.2.8.1; в Pixel Code нет знака ₽ — пишем «р.», как в ките) ----------
L.CITY = [
  ['уровень удовлетворения', '64,2 %', '+1,3 п.п.', 0], ['ВРП', '13,42 трлн р.', '+4,1 %', 0], ['средняя ЗП', '121 500 р.', '+1 500 р.', 0], ['эффективность бизнеса', '0,95', '+0,03', 0],
  ['налоговые сборы', '842,10 млрд р.', '−2,4 %', 1], ['кол-во бизнесов', '456 782 ед.', '+10 000 ед.', 0], ['инфляция', '7,5 %', '+0,6 п.п.', 0], ['население', '5 410 000 чел.', '+30 000 чел.', 0]
];
L.ORDER = ['mig', 'edu', 'biz', 'urb', 'trn', 'tur'];
L.COM = {
  mig: { i: 0, title: 'комитет по миграции', short: 'миграция', abbr: 'мигр', team: 'Новые горизонты', rest: '7,45 млрд р.', start: '10,00 млрд ₽', plan: '2,55 млрд ₽',
    inputs: [['свободная пропускная способность', '120 000 чел.'], ['стандартный миграционный поток', '45 000 чел.']],
    tools: [['миграционная политика', '2,00 млрд р.'], ['адаптация', '0 р.']],
    sliders: [['миграционный контроль', '30 %', 0.30, ['−4 200 массовых мигрантов', '+3,1 % освоение потенциала']], ['реклама и PR города', '0,55 млрд р.', 0.055, ['+1,2 % миграц. привлекательность', '+2 000 чел. стандартный поток']]],
    kpi: [['освоение потенциала', '88,0 %', '+4,1 п.п.', 'g', 0], ['обеспеченность кадрами', '98,1 %', '+0,6 п.п.', 'y', 0], ['миграционная привлекательность', '71,5 %', '−1,2 п.п.', 'y', 1], ['соц. напряженность', '52,0 %', '+3,4 п.п.', 'r', 0]], notif: [] },
  edu: { i: 1, title: 'комитет по образованию, культуре и досугу', short: 'образование', abbr: 'обр', team: 'Знание — сила', rest: '8,45 млрд р.', start: '10,00 млрд ₽', plan: '1,55 млрд ₽',
    inputs: [['жители без образования', '38 400 чел.']],
    tools: [['образовательные программы', '1,20 млрд р.'], ['пространства', '0 р.'], ['мероприятия', '0,35 млрд р.']], sliders: [],
    kpi: [['качество выпуска', '72,4 %', '+2,0 п.п.', 'y', 0], ['охват образованием', '98,6 %', '+0,4 п.п.', 'g', 0], ['обеспеченность мероприятиями', '81,0 %', '+5,5 п.п.', 'y', 0], ['релевантность образования', '93,2 %', '−0,8 п.п.', 'y', 1]], notif: [] },
  biz: { i: 2, title: 'комитет по развитию бизнеса', short: 'бизнес', abbr: 'биз', team: 'Бизнес-ангелы', rest: '7,50 млрд р.', start: '10,00 млрд ₽', plan: '2,50 млрд ₽',
    inputs: [['новые рабочие (свободные специалисты)', '52 300 чел.']],
    tools: [['субсидирование', '1,50 млрд р.'], ['совм. инвестиции', '0 р.']],
    sliders: [['регулирование бизнеса', '60 %', 0.60, ['+2 деловой климат', '−0,8 п.п. инвест. привлекательность']], ['PR инкубаторов', '1,00 млрд р.', 0.10, ['+1,5 п.п. инвест. привлекательность']], ['налоговая нагрузка', '20 %', 0.20, ['+12,40 млрд ₽ налоговые сборы', '−1,0 п.п. налоговая привлекательность']]],
    kpi: [['обеспеченность работой', '68,3 %', '+1,9 п.п.', 'y', 0], ['обеспеченность кадрами', '84,0 %', '+2,2 п.п.', 'g', 0], ['инвест. привлекательность', '63,1 %', '−2,4 п.п.', 'r', 1], ['деловой климат', '88 из 100', '+3', 'y', 0]],
    notif: [['от транспорта', 'предложение принято', 'Транспорт принял предложение: грузовой порт × 1, ввод в начале раунда 5']] },
  urb: { i: 3, title: 'комитет по градостроительству', short: 'градостроительство', abbr: 'град', team: 'Градостроители 9Б', rest: '8,74 млрд р.', start: '10,00 млрд ₽', plan: '1,26 млрд ₽',
    inputs: [['потребность бизнеса в площадях', '1 250 000 кв. м'], ['потребность населения в жилье', '2 480 000 кв. м']],
    tools: [['выкуп территории', '0,84 млрд р.'], ['земля под жилье', '0 р.'], ['земля под бизнес', '0 р.'], ['реконструкция', '0,42 млрд р.']],
    sliders: [['субсидирование жилья', '0,96 млрд р.', 0.10, ['−4 500 ₽/кв. м эффективная цена', '+3,2 % доступность жилья']], ['стандарты жилья', '30 %', 0.30, ['+2,0 % качество жилья', '+1 200 ₽/кв. м цена', '−1,1 % доступность']]],
    kpi: [['потребность в бизнес кв. м', '62,0 %', '+6,0 п.п.', 'y', 0], ['обеспеченность жильем', '104,0 %', '+2,1 п.п.', 'g', 0], ['доступность жилья', '48,5 %', '−1,1 п.п.', 'r', 1], ['качество жилья', '66,0 %', '+0,5 п.п.', 'y', 0]], notif: [] },
  trn: { i: 4, title: 'комитет по транспорту', short: 'транспорт', abbr: 'транс', team: 'Транспортники', rest: '5,00 млрд р.', start: '10,00 млрд ₽', plan: '5,00 млрд ₽',
    inputs: [['грузооборот бизнесов', '20 000 000 ед.'], ['пассажиропоток', '3 120 000 чел.']],
    tools: [['общ. транспорт', '3,00 млрд р.'], ['совм. инвестиции', '0 р.'], ['строительство мостов', '0 р.']],
    sliders: [['ремонт дорог', '0,80 млрд р.', 0.16, ['−2,1 % загруженность дорог', '+40 км отремонтировано']], ['стоимость проезда', '50 р.', 0.42, ['+1,20 млрд ₽ доходы от проезда', '−2,0 % нагрузка на ОТ', '+0,6 % загруженность']], ['дороги и развязки', '1,20 млрд р.', 0.24, ['+6 км дорог', '−1,4 % загруженность дорог']]],
    kpi: [['охват общ. транспортом', '96,1 %', '+1,3 п.п.', 'y', 0], ['нагрузка на общ. транспорт', '74,0 %', '−2,0 п.п.', 'g', 1], ['загруженность дорог', '98,5 %', '+4,2 п.п.', 'y', 0], ['покрытие новых грузов', '42,0 %', '−8,0 п.п.', 'r', 1]],
    notif: [['от развития бизнеса', 'новое предложение', 'Бизнес предлагает построить грузовой порт × 1: своя доля 40 % (8,00 млрд ₽), вам 12,00 млрд ₽']] },
  tur: { i: 5, title: 'комитет по туризму', short: 'туризм', abbr: 'тур', team: 'Белые ночи', rest: '8,50 млрд р.', start: '10,00 млрд ₽', plan: '1,50 млрд ₽',
    inputs: [['турпоток (ожидаемый)', '10 800 000 чел.']],
    tools: [['тур. мероприятия', '0,70 млрд р.'], ['субсидии турбизнесу', '0 р.'], ['совм. инвестиции', '0 р.']],
    sliders: [['тур. реклама', '0,80 млрд р.', 0.08, ['+120 000 чел. потенциальный турпоток', '+85 000 чел. абсолютный турпоток']], ['тур. сбор', '300 р.', 0.13, ['+3,20 млрд ₽ доходы от сбора', '−40 000 чел. абсолютный турпоток']]],
    kpi: [['относительный турпоток', '1,92', '+0,08', 'g', 0], ['коэф. сезонности', '71,0 %', '+3,0 п.п.', 'y', 0], ['тур. привлекательность', '58,0 %', '−1,5 п.п.', 'y', 1], ['обеспеченность тур. коммерцией', '86,0 %', '+0,9 п.п.', 'y', 0]],
    notif: [['от транспорта', 'отклонено', 'Транспорт отклонил предложение: аэропорт × 1']] }
};
L.INFRA = { biz: 1, trn: 1, tur: 2 }; // индекс кнопки «Совм. инвестиции» (доступна в чужой ход)
// ---------- состояния «заблокировано» по киту ----------
L.disable = async function (n, kitKey) {
  const k = await L.node(L.K[kitKey]);
  const kin = k.findOne(x => x.name === 'inner_wrapper') || k;
  const kt = k.findOne(x => x.type === 'TEXT' && L.isVis(x));
  const inn = n.findOne(x => x.name === 'inner_wrapper') || n;
  inn.fills = JSON.parse(JSON.stringify(kin.fills)); inn.strokes = JSON.parse(JSON.stringify(kin.strokes));
  if (kt) for (const g of n.findAll(x => (x.type === 'VECTOR' && x.name === 'glyphs') || x.type === 'TEXT')) { g.fills = JSON.parse(JSON.stringify(kt.fills)); g.effects = JSON.parse(JSON.stringify(kt.effects)); }
  n.name = n.name.replace('/initial', '/disabled');
  return n;
};
L.scrollCards = function (cards, over) {
  const h = Math.max(60, cards.height - over); cards.primaryAxisSizingMode = 'FIXED'; cards.resize(cards.width, h); cards.clipsContent = true; cards.overflowDirection = 'VERTICAL';
  cards.name = 'cards · прокрутка (видно 2 последних, ЗАМ-13)';
  const par = cards.parent; const th = L.rect(4, Math.max(20, h * 0.55), C.a2, { r: 999, name: 'scroll_thumb' }); L.abs(par, th, par.width - 4, cards.y + 4);
};
L.downBadge = n => { const ic = n.findOne(x => x.name === 'vercel-solid'); if (ic) ic.rotation = 180; return n; };
// ---------- S-08 ----------
// o.mode: active | wait | pause | p18 | offline | solo | obs
// o.cur — индекс комитета, чей ход (по умолчанию свой); o.round; o.timer; o.event — название события; o.notif — переопределить уведомления
L.s08 = async function (cid, o = {}) {
  const c = L.COM[cid], mode = o.mode || 'active';
  const cur = o.cur != null ? o.cur : c.i;
  const locked = mode !== 'active' && mode !== 'solo';
  const scr = (await L.node(L.K.s08)).clone(); figma.currentPage.appendChild(scr);
  scr.name = 'S-08 · ' + c.short; scr.x = 0; scr.y = 0;
  // BLK-01
  const blk = scr.children.find(n => n.name === 'dashboard-kpi'); blk.name = 'BLK-01 · основные городские показатели';
  for (let i = 0; i < 8; i++) { const b = blk.children[i]; const d = L.CITY[i]; await L.relabel(b, [d[0], d[1], d[2]]); if (d[3]) L.downBadge(b); b.name = 'blk_button · ' + d[0]; }
  if (o.blkPressed != null) { const b = blk.children[o.blkPressed]; const iw = b; iw.strokes = [solid(C.a3)]; iw.strokeWeight = 2.2; iw.name += ' (pressed)'; }
  // левая панель
  const lp = scr.children.find(n => n.name === 'urban-planning-committee'); lp.name = 'committee_panel · ' + c.short;
  lp.itemSpacing = c.sliders.length >= 3 ? 14 : 20;
  await L.setT(lp.children[0], c.title);
  const bc = lp.children[1]; bc.name = 'UI-13 · бюджет комитета';
  await L.relabel(bc, [c.rest, 'бюджет комитета', c.start, 'запланировано на этом ходу', c.plan]);
  for (const v of bc.findAll(x => x.name === 'vercel-solid')) v.visible = false;
  const tc = lp.children[2]; tc.name = 'tools · инструменты';
  const chips = tc.children[1]; const tpl = chips.children[0];
  for (let i = 0; i < c.tools.length; i++) {
    const ch = tpl.clone(); chips.appendChild(ch); ch.layoutSizingHorizontal = 'FILL';
    await L.relabel(ch, c.tools[i]); ch.name = 'Chip_secondary/initial · ' + c.tools[i][0];
    if (locked && !(mode === 'wait' && L.INFRA[cid] === i)) await L.disable(ch, 'chipSd');
    if (o.toolPressed === i) { const iw = ch.findOne(x => x.name === 'inner_wrapper'); iw.strokes = [solid(C.a3)]; iw.strokeWeight = 2; ch.name = ch.name.replace('/initial', '/pressed'); }
  }
  for (const k of chips.children.slice(0, chips.children.length - c.tools.length)) k.remove();
  const sTpl = lp.children[3]; const sTpl2 = lp.children[4]; const hov = [];
  for (let i = 0; i < c.sliders.length; i++) {
    const sd = c.sliders[i]; const sc = sTpl.clone(); lp.appendChild(sc); sc.layoutSizingHorizontal = 'FILL'; sc.name = 'SL · ' + sd[0]; if (c.sliders.length >= 3) sc.itemSpacing = 6;
    await L.setT(sc.children[0], sd[0]);
    const old = sc.children[1];
    const st = (o.sliderState && o.sliderState[i]) || (locked ? 'disabled' : 'initial');
    const ns = await L.slider({ w: 317, price: sd[1], pct: sd[2], state: st, priceW: 142, track: C.s4 });
    sc.insertChild(1, ns); old.remove(); ns.layoutSizingHorizontal = 'FILL';
    if (st === 'hover' || st === 'pressed') { // предикты по наведению (UI-06): бейджи справа от курсора
      const pr = await L.preds(sd[3].map(t => [t, /^[−-]/.test(t) ? 'down' : 'up'])); pr.layoutWrap = 'NO_WRAP';
      const box = L.al('V', { gap: 6, name: 'predicts (hover)' }); for (const k of [...pr.children]) box.appendChild(k);
      scr.appendChild(box); hov.push([box, sc]);
    }
  }
  sTpl.remove(); sTpl2.remove();
  // правая колонка
  const rw = scr.children.find(n => n.name === 'wrapper'); rw.name = 'right_column';
  const evi = rw.children[0];
  if (o.event) {
    const ev = await L.kit('evOn'); rw.insertChild(0, ev); ev.layoutSizingHorizontal = 'FILL'; evi.remove();
    const t = L.texts(ev).find(x => x.fontName.family === 'Inter'); t.textAutoResize = 'HEIGHT'; t.layoutSizingHorizontal = 'FILL'; await L.setT(t, o.event);
    for (const g of ev.children.filter(c => c.type === 'RECTANGLE')) g.resize(ev.width, g.height);
    ev.name = 'UI-18 · Event_indicator/active';
  } else evi.name = 'UI-18 · Event_indicator/disabled';
  const fb = rw.children[1]; fb.name = 'committee-feedback';
  fb.itemSpacing = 14;
  const inc = fb.children[0]; inc.name = 'UI-40 · входящие от комитетов';
  const cards = inc.children[1];
  const notif = o.notif || c.notif;
  const ctpl = cards.children[0];
  for (let i = 0; i < notif.length; i++) {
    const cd = ctpl.clone(); cards.appendChild(cd); cd.layoutSizingHorizontal = 'FILL';
    const ts = L.texts(cd);
    await L.setT(ts[0], notif[i][0]); await L.setT(ts[1], notif[i][1]); await L.setT(ts[2], notif[i][2]);
    const t2 = ts[2]; t2.textAutoResize = 'HEIGHT'; t2.textCase = 'ORIGINAL'; t2.fontName = { family: 'Inter', style: 'Medium' }; t2.fontSize = 13; t2.lineHeight = { unit: 'PERCENT', value: 135 }; cd.paddingTop = 10; cd.paddingBottom = 10;
    for (const v of cd.findAll(x => x.name === 'vercel-solid')) v.visible = false;
    const x = await L.kit('btnIcon'); x.rescale(0.75); L.abs(cd, x, cd.width - 34, 10); x.name = 'Button_icon/close (ЗАМ-13)';
    cd.name = 'Doc_flow_ur · уведомление';
  }
  for (const k of cards.children.slice(0, cards.children.length - notif.length)) k.remove();
  if (!notif.length) { const e = L.tx('новых уведомлений нет', { size: 13, fill: C.n1, align: 'CENTER' }); cards.appendChild(e); e.layoutSizingHorizontal = 'FILL'; }
  // UI-14 входные показатели (РАСХ-04: между событиями и KPI)
  const inp = L.al('V', { gap: 8, name: 'UI-14 · входные показатели' });
  const ih = inc.children[0].clone(); inp.appendChild(ih); await L.setT(ih, 'входные показатели');
  for (const [lab, val] of c.inputs) {
    const box = L.al('V', { gap: 0, pad: [6, 16, 8, 16], fill: C.s1, stroke: C.n1, sw: 2, r: 20, name: 'Input_metrick · ' + lab });
    const lt = L.tx(lab, { size: 13, fill: C.n2 }); box.appendChild(lt); lt.layoutSizingHorizontal = 'FILL'; lt.textAutoResize = 'HEIGHT'; box.appendChild(L.px(val, { size: 16, fill: C.a3, shadow: C.dark }));
    inp.appendChild(box); box.layoutSizingHorizontal = 'FILL';
  }
  fb.insertChild(1, inp); inp.layoutSizingHorizontal = 'FILL';
  // KPI
  const kc = fb.children[2]; kc.name = 'BLK-04 · KPI команды';
  const rows = kc.children[1].children;
  for (let i = 0; i < 4; i++) {
    const r = rows[i], k = c.kpi[i]; await L.relabel(r, [k[0], k[1], k[2]]); { const nt = L.texts(r)[0]; nt.layoutSizingHorizontal = 'FILL'; nt.textAutoResize = 'HEIGHT'; nt.lineHeight = { unit: 'PERCENT', value: 130 }; const kr = r.findOne(x => x.name.startsWith('Kpi_row')) || r; kr.itemSpacing = 8; kr.paddingLeft = 12; kr.paddingRight = 6; const sg = r.findOne(x => x.name === 'stat_badge_group'); sg.itemSpacing = 4; const bi = sg.findOne(x => x.name === 'inner_wrapper'); if (bi) { bi.paddingLeft = 6; bi.paddingRight = 6; bi.itemSpacing = 4; } }
    const vt = L.texts(r)[1]; vt.fills = [solid(k[3] === 'r' ? C.err : k[3] === 'g' ? C.w : C.a3)]; if (k[3] === 'g') vt.effects = [];
    if (k[4]) L.downBadge(r);
    r.name = 'Kpi_row · ' + k[0] + ' · зона ' + ({ r: 'красная', y: 'жёлтая', g: 'зелёная' })[k[3]];
    if (o.kpiPressed === i) { r.strokes = [solid(C.a3)]; }
  }
  // панель управления
  if (rw.y + rw.height > 970) { fb.itemSpacing = 8; }
  if (lp.y + lp.height > 970) { lp.itemSpacing = 10; }
  if (rw.y + rw.height > 970) { L.scrollCards(cards, rw.y + rw.height - 966); }
  for (const [box, sc] of hov) { box.x = lp.x + lp.width + 12; box.y = lp.y + sc.y + 30; }
  const cp = scr.children.find(n => n.name === 'control_panel');
  const timer = cp.children[0], pause = cp.children[1], tp = cp.children[2], rec = cp.children[3], end = cp.children[4];
  await L.relabel(timer, [o.timer || '01:12', 'раунд ' + String(o.round || 4).padStart(2, '0')]);
  if (mode === 'solo') {
    const b = await L.btn('завершить игру', 'btnP'); b.name = 'Button_primary · завершить игру (вместо таймера)';
    const rc = L.q(timer, 'round_counter'); const pill = L.al('H', { gap: 10, pad: [4, 4, 4, 4], fill: C.s1, r: 999, cross: 'CENTER', name: 'solo_panel · завершить игру + раунд' }); cp.insertChild(0, pill); pill.appendChild(b); pill.appendChild(rc); timer.remove(); pause.remove();
  } else {
    await L.relabel(pause, ['пауза']);
    if (mode === 'pause' || mode === 'p18' || mode === 'offline' || o.pauseRequested) await L.disable(pause, 'btnPd');
  }
  await L.relabel(rec, ['приёмная']);
  if (mode === 'p18' || mode === 'offline') await L.disable(rec, 'btnPd');
  await L.relabel(end, ['завершить ход']);
  if (locked) await L.disable(end, 'btnAd');
  // очередь ходов UI-16 (РАСХ-08: мигр, обр, биз, град, транс, тур)
  const yt = tp.children[0];
  const wr = tp.children.slice(1); const tDone = wr[0], tCur = wr[1], tNext = wr[2];
  await L.setT(yt, mode === 'solo' ? 'ход' : 'ваш ход');
  if (locked || cur !== c.i) { const v = tp.children[0]; for (const g of v.findAll ? v.findAll(x => x.name === 'glyphs') : []) { g.fills = [solid(C.n1)]; g.effects = []; } }
  for (let i = 0; i < 6; i++) {
    const cc = L.COM[L.ORDER[i]];
    const tpl2 = i < cur ? tDone : i === cur ? tCur : tNext;
    const n = tpl2.clone(); tp.appendChild(n);
    if (i === cur) await L.relabel(n, [String(i + 1), cc.short]); else await L.relabel(n, [cc.abbr]);
    n.name = 'turn · ' + cc.abbr + (i < cur ? ' (сходил)' : i === cur ? ' (ходит)' : '');
    if (o.offline === i) { const bd = await L.badge('нет связи', 'badgeSE', { noIcon: true }); for (const w of bd.findAll(x => x.name === 'text_wrapper')) w.visible = false; n.appendChild(bd); }
  }
  for (const k of wr) k.remove();
  cp.itemSpacing = 8; tp.layoutSizingHorizontal = 'FILL'; tp.primaryAxisAlignItems = 'SPACE_BETWEEN'; tp.paddingLeft = 24; tp.paddingRight = 8;
  { const lab = tp.children[0]; const on = !locked && cur === c.i; for (const g of lab.findAll(x => x.name === 'glyphs')) { g.fills = [solid(on ? C.n5 : C.n1)]; g.effects = on ? [L.shadow(C.a2, 1.2)] : []; } }
  return scr;
};
return L;
}
