async function LIB6(figma, L) {
const C = L.C, solid = L.solid;
L.TEAMS = [['Бизнес-ангелы', 'biz', '412', '+1'], ['Белые ночи', 'tur', '398', '+1'], ['Градостроители 9Б', 'urb', '377', '−2'], ['Транспортники', 'trn', '351', '+1'], ['Новые горизонты', 'mig', '344', '−1'], ['Знание — сила', 'edu', '320', null]];
L.DOCS = [
  [4, 'Транспортники', 'Вложиться в общественный транспорт: метро 2,00 млрд ₽; автобусы 1,00 млрд ₽ – 3,00 млрд ₽'],
  [4, 'Транспортники', 'Принял предложение бизнеса: грузовой порт × 1, ввод в начале раунда 5'],
  [4, 'Градостроители 9Б', 'Субсидирование жилья: 0 % → 10 % – 0,96 млрд ₽'],
  [4, 'Бизнес-ангелы', 'Предлагает транспорту построить грузовой порт × 1: своя доля 40 % (8,00 млрд ₽), партнеру 12,00 млрд ₽'],
  [4, 'Бизнес-ангелы', 'Налоговая нагрузка: 20 % → 15 %'],
  [4, 'Знание — сила', 'Вложиться в образовательные программы: it-образование 900 чел. – 1,26 млрд ₽'],
  [4, 'Новые горизонты', 'Миграционные политики: массовая миграция 5 000 чел. – 58,30 млн ₽'],
  [4, 'Город', 'Событие раунда: Рост мировых цен на нефть'],
  [3, 'Белые ночи', 'Туризм запросил паузу'],
  [3, 'Организатор', 'Принял запрос паузы команды Туризм']
];
L.panel = function (title, w, h) {
  const p = L.al('V', { gap: 14, pad: [14, 14, 14, 14], fill: C.s1, stroke: C.n1, sw: 2, r: 20, name: 'panel · ' + title, w });
  if (h) { p.resize(w, h); p.primaryAxisSizingMode = 'FIXED'; }
  p.clipsContent = true;
  const t = L.px(title, { size: 18, shadow: C.a2, align: 'CENTER', w: w - 28 }); p.appendChild(t);
  return p;
};
// BLK-02: own — cid своей команды (подсветка), score — подпись столбца
L.leaderboard = async function (o = {}) {
  const rows = [];
  for (let i = 0; i < L.TEAMS.length; i++) {
    const [team, cid, pts, ch] = (o.teams || L.TEAMS)[i];
    const own = o.own === cid; const down = ch && /^[−-]/.test(ch);
    const r = await L.kit(own ? (down ? 'lbDown' : 'lbUp') : (down ? 'lbOdown' : 'lbOup'));
    const ts = L.texts(r);
    await L.setT(ts[0], String(i + 1)); await L.setT(ts[1], team); await L.setT(ts[2], pts + (o.suffix || ' баллов'));
    if (ch) await L.setT(ts[3], ch + ' место'); else { const b = ts[3].parent.parent; b.visible = false; }
    for (const w of r.findAll(x => x.name === 'text_wrapper' && x.children && x.children.some(c => c.type === 'TEXT' && c.characters === 'Текст ошибки'))) w.visible = false;
    L.hug(r.findOne(x => x.name === 'stat_badge_group') || r);
    if (o.offline === cid) { const b = await L.badge('нет связи', 'badgeSE', { noIcon: true }); for (const w of b.findAll(x => x.name === 'text_wrapper')) w.visible = false; L.hug(b); ts[1].parent.parent.parent.appendChild(b); }
    r.name = 'Leaderboard_row · ' + (i + 1) + ' · ' + team + (own ? ' (своя)' : '');
    rows.push(r);
  }
  return L.col(rows, { gap: 8, name: 'BLK-02 · лидерборд' });
};
// BLK-03: строки документооборота с номером раунда (ЗАМ-07)
L.docflow = async function (o = {}) {
  const rows = [];
  for (const [rd, team, text] of (o.docs || L.DOCS)) {
    const own = o.ownTeam === team;
    const r = await L.kit(own ? 'docUr' : 'docAn');
    const ts = L.texts(r); await L.setT(ts[0], team);
    const tw = ts[0].parent; if (tw && tw.layoutMode) { tw.primaryAxisSizingMode = 'FIXED'; tw.resize(178, tw.height); tw.primaryAxisAlignItems = 'CENTER'; tw.paddingLeft = 8; tw.paddingRight = 8; }
    const t = ts[1]; t.textAutoResize = 'HEIGHT'; t.layoutSizingHorizontal = 'FILL'; await L.setT(t, text); t.textCase = 'ORIGINAL'; t.fontName = { family: 'Inter', style: 'Medium' }; t.fontSize = 14; t.lineHeight = { unit: 'PERCENT', value: 140 };
    const rb = await L.chipTag('Р' + rd, 'badgeS'); r.insertChild(0, rb);
    r.counterAxisAlignItems = 'MIN'; r.itemSpacing = 12;
    r.name = (own ? 'Doc_flow_ur' : 'Doc_flow_another') + ' · ' + team;
    rows.push(r);
  }
  return L.col(rows, { gap: 8, name: 'BLK-03 · документооборот' });
};
// панель управления организатора / съезда
// o: {mode:'sum'|'obs'|'congress', host, timer, round, paused, cur}
L.hostCtrl = async function (o) {
  const base = await figma.getNodeByIdAsync(L.BASE.trn);
  const cp = base.findOne(n => n.name === 'control_panel').clone(); figma.currentPage.appendChild(cp);
  const timer = cp.children[0], pause = cp.children[1], tp = cp.children[2], rec = cp.children[3], end = cp.children[4];
  const rl = (o.mode === 'congress' ? 'съезд ' : 'раунд ') + String(o.round || 4).padStart(2, '0');
  const tts = L.texts(timer); if (tts[0]) await L.setT(tts[0], rl);
  for (const n of [timer.findOne(x => x.name === 'round_counter'), timer.findOne(x => x.name === 'round_counter') && timer.findOne(x => x.name === 'round_counter').findOne(x => x.name === 'inner_wrapper')]) if (n) { n.primaryAxisSizingMode = 'AUTO'; if (n.layoutMode === 'HORIZONTAL') { n.paddingLeft = Math.max(n.paddingLeft, 16); n.paddingRight = Math.max(n.paddingRight, 16); } else n.counterAxisSizingMode = 'AUTO'; }
  rec.remove(); end.remove();
  if (o.mode === 'congress') { tp.remove(); }
  else {
    const tabs = await L.tabs(['сводка', 'наблюдение'], o.mode === 'obs' ? 1 : 0); tabs.layoutWrap = 'NO_WRAP';
    for (const g of tabs.findAll(x => x.type === 'RECTANGLE' && x.parent.name.startsWith('Chip_primary/pressed'))) { g.resize(Math.max(10, g.parent.width - 20), g.height); g.x = 10; }
    cp.insertChild(1, tabs);
    const lab = tp.children[0]; for (const g of lab.findAll(x => x.name === 'glyphs')) { g.fills = [solid(C.n2)]; g.effects = []; }
    const old = tp.findAll(x => x.name.startsWith('px·'))[0];
    if (old && old.parent === tp) { const nl = L.px('ход', { size: 16, fill: C.n2 }); tp.insertChild(0, nl); old.remove(); }
  }
  if (!o.host) { pause.remove(); }
  else {
    if (o.paused) await L.disable(pause, 'btnPd');
    const fin = await L.btn('завершить игру', 'btnP'); cp.appendChild(fin);
  }
  return cp;
};
// S-07 «Сводка» / S-09 «Съезд»
L.hostScreen = async function (o) {
  const s = L.screen(o.name || 'S-07', 'sys');
  const base = await figma.getNodeByIdAsync(L.BASE.trn);
  const blk = base.findOne(n => n.name.startsWith('BLK-01')).clone(); s.appendChild(blk); blk.x = 39; blk.y = 13;
  const lb = L.panel(o.mode === 'congress' ? 'лидерборд · итог раунда ' + (o.round || 4) : 'лидерборд', 1110, 560);
  lb.appendChild(await L.leaderboard({ own: o.own, offline: o.offline })); lb.children[1].layoutSizingHorizontal = 'FILL';
  lb.appendChild(L.cap(o.mode === 'congress' ? 'Строки обновились в END раунда. На съезде город не пересчитывается, лидерборд не меняется.' : 'Лидерборд обновляется только в END раунда (R-SCORE-09). Место команды — по итоговым баллам.', { w: 1082 }));
  s.appendChild(lb); lb.x = 39; lb.y = 160;
  const ev = (await figma.getNodeByIdAsync('2056:87')).findOne(n => n.name === 'UI-18 · Event_indicator/active').clone(); s.appendChild(ev); ev.resize(540, ev.height); ev.x = 39; ev.y = 740;
  for (const g of ev.children.filter(c => c.type === 'RECTANGLE')) g.resize(540, g.height);
  const info = L.al('V', { gap: 6, pad: [14, 20, 14, 20], fill: C.s1, stroke: C.n1, sw: 2, r: 20, name: 'round_info', w: 540 });
  info.appendChild(L.tx(o.mode === 'congress' ? 'съезд комитетов' : 'сейчас ходит', { size: 13, fill: C.n2 }));
  info.appendChild(L.px(o.mode === 'congress' ? 'обсуждение раунда ' + (o.round || 4) : 'комитет по транспорту', { size: 18, shadow: C.a2 }));
  s.appendChild(info); info.x = 609; info.y = 740;
  const dp = L.panel('документооборот', 711, 806); s.appendChild(dp); dp.x = 1170; dp.y = 160;
  const vp = figma.createFrame(); vp.name = 'scroll · лента (новые сверху)'; vp.fills = []; vp.clipsContent = true; vp.resize(683, 724); dp.appendChild(vp);
  const df = await L.docflow({ ownTeam: o.ownTeam }); vp.appendChild(df); df.resize(668, df.height); df.counterAxisSizingMode = 'FIXED'; for (const r of df.children) r.layoutSizingHorizontal = 'FILL'; df.x = 0; df.y = 0;
  const th = L.rect(4, 300, C.a2, { r: 999, name: 'scroll_thumb' }); vp.appendChild(th); th.x = 678; th.y = 0;
  const cp = await L.hostCtrl(o); s.appendChild(cp); cp.x = 39; cp.y = 989;
  return s;
};
return L;
}
