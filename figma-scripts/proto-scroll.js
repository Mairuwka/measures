// proto-scroll.js — прокрутка и статичный фон под системными поп-апами на странице «Динамический интерфейс» (2323:87).
// Повторный запуск безопасен (уже обёрнутые окна пропускаются).
const PAGE = await figma.getNodeByIdAsync('2323:87');
await figma.setCurrentPageAsync(PAGE);
const SCR = {};
for (const sec of PAGE.children) if (sec.type === 'SECTION' && !/^Интерактивные/.test(sec.name)) for (const s of sec.children) SCR[s.name.split(' · ')[0]] = s;
// 1) Под системными поп-апами экран не реагирует (ТЗ 1.5, UI-25): экземпляры на фоне отвязываются от компонентов.
const SYS = ['P-13.trn', 'P-13.biz', 'P-13.tur', 'P-15', 'P-14', 'P-14.c', 'P-14.solo', 'P-04', 'S-06.c'];
let detached = 0;
for (const code of SYS) { const s = SCR[code]; if (!s) continue;
  for (const top of s.children) { if (/^modal/.test(top.name)) continue;
    const insts = top.type === 'INSTANCE' ? [top] : ('findAll' in top ? top.findAll(n => n.type === 'INSTANCE') : []);
    for (const i of insts.reverse()) { try { i.detachInstance(); detached++; } catch (e) {} } } }
// 2) Списки «list · прокрутка» (документооборот, лидерборды) — вертикальная прокрутка.
let lists = 0;
for (const s of Object.values(SCR)) for (const l of s.findAll(n => n.type === 'FRAME' && /^list · прокрутка/.test(n.name))) { l.clipsContent = true; l.overflowDirection = 'VERTICAL'; lists++; }
// 3) Окна поп-апов: modal_container оборачивается в «scroll · содержимое окна» высотой до modal_tab_bar,
//    скроллбар (slider) выносится из контейнера, чтобы стоять на месте. Шапка и нижняя панель не прокручиваются.
const pop = [];
for (const [code, s] of Object.entries(SCR)) {
  for (const pat of s.findAll(n => n.type === 'FRAME' && n.name === 'pattern')) {
    const mc = pat.children.find(c => /^modal_container/.test(c.name)); if (!mc || pat.layoutMode !== 'NONE') continue;
    if (pat.children.some(c => /^scroll ·/.test(c.name))) continue;
    const bar = pat.children.find(c => /^modal_tab_bar/.test(c.name));
    const visH = bar ? bar.y : pat.height;
    if (mc.y + mc.height <= visH + 1) continue;
    const sc = figma.createFrame(); sc.name = 'scroll · содержимое окна'; sc.fills = []; sc.clipsContent = true;
    pat.insertChild(pat.children.indexOf(mc), sc); sc.x = 0; sc.y = 0; sc.resize(pat.width, visH);
    const sl = mc.children.find(c => c.name === 'slider'); const mx = mc.x, my = mc.y;
    sc.appendChild(mc); mc.x = mx; mc.y = my;
    if (sl) { const sx = sl.x, sy = sl.y; pat.insertChild(pat.children.indexOf(sc) + 1, sl); sl.x = mx + sx; sl.y = my + sy; }
    sc.overflowDirection = 'VERTICAL'; pop.push(code);
  }
}
return { detached, lists, popups: pop.length };
