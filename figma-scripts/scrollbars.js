// Скроллбары поп-апов по киту. Запускать после любых правок, меняющих высоту контента окна.
// Ставит/обновляет группу `slider` в modal_container, если контент длиннее видимой части, и убирает, если нет.
const page = await figma.getNodeByIdAsync('2012:87');
await figma.setCurrentPageAsync(page);
let tpl = page.findOne(n => n.type === 'GROUP' && n.name === 'slider' && n.parent.name === 'modal_container');
const log = { set: 0, added: [], removed: [] };
for (const pat of page.findAll(n => n.type === 'FRAME' && n.name === 'pattern' && n.children.some(c => c.name === 'modal_container'))) {
  const mc = pat.children.find(c => c.name === 'modal_container');
  const bar = pat.children.find(c => c.name === 'modal_tab_bar');
  const visH = bar ? bar.y : pat.height;                                  // видимая часть — до нижней панели
  const scrolls = mc.y + mc.height - mc.paddingBottom > visH + 1 && visH > 200;
  let sl = mc.children.find(c => c.name === 'slider' && c.type === 'GROUP');
  let s = pat; while (s.parent.type !== 'SECTION') s = s.parent;
  if (!scrolls) { if (sl) { if (sl === tpl) tpl = sl.clone(); sl.remove(); log.removed.push(s.name.split(' · ')[0]); } continue; }
  if (!sl) { sl = tpl.clone(); mc.appendChild(sl); sl.layoutPositioning = 'ABSOLUTE'; log.added.push(s.name.split(' · ')[0]); }
  const thumb = sl.children.find(c => c.height < 40), track = sl.children.find(c => c.height >= 40);
  const X = Math.round(mc.width) === 560 ? 516 : mc.width - 42, Y = 68 - mc.y, H = visH - 18 - 68;
  thumb.resize(14, 29); thumb.x = X; thumb.y = Y;
  track.resize(4, H - 6); track.x = X + 5; track.y = Y + 6;
  log.set++;
}
// Списки вне поп-апов (документооборот, «Входящие от комитетов»): та же группа `slider` в контейнере списка,
// x = ширина контейнера − 14, y = верх списка `… · прокрутка`, высота = высота списка,
// у списка paddingRight = 26, дорожка #4C5152.
return log;
