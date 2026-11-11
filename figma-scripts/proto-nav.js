// proto-nav.js — клики и переходы на странице «Динамический интерфейс» (2323:87).
// Повторный запуск безопасен: у каждого узла заменяется только ON_CLICK / AFTER_TIMEOUT.
// Карта переходов — по ТЗ 1.1 (User Flow) и 1.5 (поведение экранов).
const PAGE = await figma.getNodeByIdAsync('2323:87');
await figma.setCurrentPageAsync(PAGE);
const SCR = {};
for (const sec of PAGE.children) if (sec.type === 'SECTION' && !/^Интерактивные/.test(sec.name)) for (const s of sec.children) SCR[s.name.split(' · ')[0]] = s;
const TRN = { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.15 };
const act = (to) => to === 'BACK' ? { type: 'BACK' } : { type: 'NODE', destinationId: SCR[to].id, navigation: 'NAVIGATE', transition: TRN, preserveScrollPosition: false };
async function setTrig(node, trigger, to) {
  if (to !== 'BACK' && !SCR[to]) throw new Error('no screen ' + to);
  const keep = (node.reactions || []).filter(r => r.trigger.type !== trigger.type);
  await node.setReactionsAsync([...keep, { trigger, actions: [act(to)] }]);
}
const BLK = { 'врп': '01', 'средняя зп': '02', 'эффективность бизнеса': '03', 'налоговые сборы': '04', 'кол-во бизнесов': '05', 'население': '06', 'уровень удовлетворения': '07', 'инфляция': '08' };
const KPI = [['освоение потенциала', '09'], ['миграционная привлекательность', '11'], ['соц. напряженность', '12'], ['качество выпуска', '13'], ['охват образованием', '14'], ['обеспеченность мероприятиями', '15'], ['релевантность образования', '16'], ['обеспеченность работой', '17'], ['инвест. привлекательность', '19'], ['деловой климат', '20'], ['потребность в бизнес кв. м', '21'], ['обеспеченность жиль', '22'], ['доступность жилья', '23'], ['качество жилья', '24'], ['охват общ. транспортом', '25'], ['нагрузка на общ. транспорт', '26'], ['загруженность дорог', '27'], ['покрытие новых грузов', '28'], ['относительный турпоток', '29'], ['коэф. сезонности', '30'], ['тур. привлекательность', '31'], ['обеспеченность тур. коммерц', '32']];
const TOOLS = { 'миграц. политика': 'И-01', 'адаптация': 'И-02', 'образ. программы': 'И-05', 'пространства': 'И-06', 'мероприятия': 'И-07', 'субсидирование': 'И-08', 'выкуп территории': 'И-10', 'земля под жилье': 'И-11', 'земля под бизнес': 'И-12', 'реконструкция': 'И-19', 'общ. транспорт': 'И-13', 'строительство мостов': 'И-18', 'тур. мероприятия': 'И-15', 'субсидии турбизнесу': 'И-16' };
const COMM_KPI = [['освоение потенциала', '01'], ['качество выпуска', '02'], ['деловой климат', '03'], ['качество жилья', '04'], ['покрытие новых грузов', '05'], ['тур. привлекательность', '06']];
const TABS = [['мигр', '01'], ['обр', '02'], ['биз', '03'], ['град', '04'], ['тран', '05'], ['тур', '06']];
const committee = (s) => { const names = s.findAll(n => /^Kpi_row · /.test(n.name)).map(n => n.name).join('|'); for (const [k, v] of COMM_KPI) if (names.includes(k)) return v; return null; };
const label = (n) => { const parts = n.name.split(' · '); const s = parts.length > 1 ? parts.slice(1).join(' ') : '';
  const t = n.findAll ? n.findAll(x => (x.type === 'TEXT' && x.visible && x.characters !== 'Текст ошибки') || /^px·/.test(x.name)).map(x => x.type === 'TEXT' ? x.characters : x.name.split('·').pop()).join(' ') : '';
  return (s + ' ' + t).toLowerCase().replace(/\s+/g, ' ').trim(); };
const topOf = (n, s) => { let x = n; while (x.parent && x.parent !== s) x = x.parent; return x; };

function route(code, n, s, cm) {
  const nm = n.name, L = label(n);
  const top = topOf(n, s); const inModal = /^modal/.test(top.name);
  const modals = s.children.filter(c => /^modal/.test(c.name)); const mIdx = modals.indexOf(top);
  const has = (w) => L.includes(w);
  const bg = code.replace(/^(P-1[0-2]\.\d+|P-1[45].*|И-.*)$/, 'S-08');
  if (/^blk_button/.test(nm)) { if (/^S-11/.test(code)) return null; const k = nm.split(' · ')[1].toLowerCase(); return BLK[k] ? 'P-10.' + BLK[k] : null; }
  if (/^Kpi_row · /.test(nm)) { const k = nm.split(' · ')[1].toLowerCase(); if (k.startsWith('обеспеченность кадрами')) return cm === '03' ? 'P-10.18' : 'P-10.10'; for (const [w, v] of KPI) if (k.startsWith(w)) return 'P-10.' + v; return null; }
  if (/^UI-18 · Event_indicator\/active/.test(nm)) return 'P-12.02';
  if (/^Chip_secondary\/initial · /.test(nm)) { const k = nm.split(' · ')[1].toLowerCase(); if (k === 'совм. инвестиции') return cm === '05' ? 'И-14' : cm === '06' ? 'И-17' : 'И-09'; return TOOLS[k] || null; }
  if (/^Chip_primary\/initial/.test(nm) && /^P-11/.test(code)) { for (const [w, v] of TABS) if (L.startsWith(w) || L.includes(' ' + w)) return 'P-11.' + v; return null; }
  if (/^Chip_icon\/initial/.test(nm) && /^S-03$/.test(code)) return 'S-03.q';
  if (/^Chip_icon\/pressed/.test(nm) && code === 'S-03.q') return 'S-03';
  if (/^Сommittee_card/.test(nm) && code === 'P-01') return has('организатор') ? 'S-03' : has('участник') ? 'P-02' : null;
  if (/^Team_card\/hover/.test(nm) && code === 'S-06') return 'S-06.r';
  if (/^Team_card\/pressed/.test(nm) && code === 'S-06.r') return 'S-06';
  if (/^Code_input/.test(nm) && /^P-02/.test(code)) return 'S-04';
  if (/^btnPd · начать игру/.test(nm) && code === 'S-06.h') return 'S-07';
  if (/^Button_icon\/initial/.test(nm)) {
    if (!inModal) return null;
    if (code === 'S-06.c') return 'S-06.h'; if (code === 'P-04') return 'S-07'; if (code === 'P-03') return 'S-06';
    if (/^И-0[34]$/.test(code) && mIdx === 0 && modals.length > 1) return 'S-08.mig';
    return 'BACK';
  }
  if (!/^(Button_|btnP ·|btnS ·|btnL ·)/.test(nm) || /(disabled|btnPd|\(pressed\))/.test(nm)) return null;
  // кнопки — по подписи
  if (has('остальные показатели')) return cm ? 'P-11.' + cm : null;
  if (has('приемная')) return 'S-10';
  if (has('завершить ход')) return /^Button_accent/.test(nm) ? 'P-15' : 'S-08.wait';
  if (has('пауза')) return /^(S-07|P-04|P-14$|P-14\.c|S-09|P-17\.h)/.test(code) ? 'P-17.h' : 'S-08.pauseReq';
  if (has('завершить игру')) {
    if (inModal) return code === 'P-14.solo' ? 'S-11.solo' : 'S-11.h';
    return /^(S-08\.solo|P-14\.solo)$/.test(code) ? 'P-14.solo' : /^(S-09\.h|P-14\.c)$/.test(code) ? 'P-14.c' : 'P-14';
  }
  if (has('наблюдение')) return 'S-07.obs';
  if (has('сводка')) return 'S-07';
  if (has('выйти')) return 'S-02';
  if (has('продолжить игру')) return 'S-07';
  if (has('отбор кадров')) return 'И-03';
  if (has('вахтовая миграция')) return 'И-04';
  if (has('предложить транспорт')) return 'P-13.trn';
  if (has('предложить бизнес')) return 'P-13.biz';
  if (has('предложить туризм')) return 'P-13.tur';
  if (has('принять') || has('отклонить')) {
    if (/^P-13/.test(code)) return { 'P-13.trn': 'S-08.trn', 'P-13.biz': 'S-08.biz', 'P-13.tur': 'S-08.tur' }[code];
    if (code === 'P-04') return has('принять') ? 'P-17.h' : 'S-07';
  }
  if (has('одиночная игра')) return 'S-12';
  if (has('совместная игра')) return 'P-01';
  if (has('вернуться в игру')) return 'S-08.trn';
  if (has('войти')) return 'P-16';
  if (has('начать') && /^P-16/.test(code)) return 'S-08.solo';
  if (has('подключиться')) return 'S-06';
  if (has('старт')) return 'S-06.h';
  if (has('далее')) return 'S-05';
  if (has('отменить готовность')) return 'S-06';
  if (has('готов')) return 'S-06.r';
  if (has('изменить')) return 'P-03';
  if (has('отменить игру')) return inModal && code === 'S-06.c' ? 'S-02' : 'S-06.c';
  if (has('назад')) return { 'S-12': 'S-02', 'S-12.e': 'S-02', 'P-16': 'S-12', 'P-16.e': 'S-12', 'P-01': 'S-02', 'P-02': 'P-01', 'P-02.e': 'P-01', 'S-05': 'S-04.a', 'S-03': 'P-01', 'S-03.q': 'P-01', 'S-04': 'P-02', 'S-04.a': 'P-02', 'S-06.c': 'S-06.h' }[code] || 'BACK';
  if (has('понятно') || has('применить') || has('отмена') || has('вернуться к ходу')) return code === 'P-03' ? 'S-06' : 'BACK';
  return null;
}
const TIMEOUTS = { 'S-04': ['S-04.a', 3], 'S-08.pauseReq': ['P-17', 3], 'P-17': ['S-08.tur', 5], 'P-18': ['S-08.mig', 5], 'S-08.offline': ['S-08.trn', 4], 'S-09': ['P-18', 6] };
const stats = { click: 0, none: [] , err: [] };
for (const [code, s] of Object.entries(SCR)) {
  const cm = committee(s);
  const nodes = s.findAll(n => (n.type === 'INSTANCE' && n.parent.type !== 'INSTANCE' && !/^(Rectangle|Badge)/.test(n.name)) || /^(Team_card\/pressed|Code_input\/error|btnPd · начать игру|Chip_icon\/pressed)/.test(n.name));
  for (const n of nodes) {
    try { const to = route(code, n, s, cm); if (to && SCR[to] !== s) { await setTrig(n, { type: 'ON_CLICK' }, to); stats.click++; } else if (n.type === 'INSTANCE' && /^(Button_|btn)/.test(n.name)) stats.none.push(code + ':' + label(n).slice(0, 20)); }
    catch (e) { stats.err.push(code + ':' + n.name.slice(0, 20) + ':' + e.message.slice(0, 60)); }
  }
  if (TIMEOUTS[code]) await setTrig(s, { type: 'AFTER_TIMEOUT', timeout: TIMEOUTS[code][1] }, TIMEOUTS[code][0]);
  if (code === 'S-03.q') await setTrig(s, { type: 'ON_CLICK' }, 'S-03');
}
PAGE.flowStartingPoints = [
  { nodeId: SCR['S-02'].id, name: '1. Участник: вход, лобби, игра' },
  { nodeId: SCR['S-08.mig'].id, name: '2. Игровой экран (миграция, свой ход)' },
  { nodeId: SCR['S-07'].id, name: '3. Ведущий' },
  { nodeId: SCR['P-04'].id, name: '4. Запрос паузы у ведущего' },
  { nodeId: SCR['S-09.h'].id, name: '5. Съезд комитетов (ведущий)' },
];
return { clicks: stats.click, none: [...new Set(stats.none)].join(' | '), err: stats.err.slice(0, 15) };
