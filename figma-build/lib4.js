async function LIB4(figma, L) {
const C = L.C, solid = L.solid;
L.BASE = { mig: '2056:88', edu: '2056:1619', biz: '2056:2968', urb: '2057:87', trn: '2057:1712', tur: '2057:3470' };
// фон поп-апа: готовый S-08 комитета; tool — индекс кнопки инструмента в состоянии pressed
L.base = async function (cid, tool) {
  const s = (await figma.getNodeByIdAsync(L.BASE[cid])).clone(); figma.currentPage.appendChild(s);
  if (tool != null) { const ch = s.findAll(n => n.name.startsWith('Chip_secondary/'))[tool]; if (ch) { const iw = ch.findOne(x => x.name === 'inner_wrapper'); iw.strokes = [solid(C.a3)]; iw.strokeWeight = 2; ch.name = ch.name.replace('/initial', '/pressed'); } }
  return s;
};
// инфо-плашка «подпись · значение»
L.info = (label, value, o = {}) => { const f = L.al('H', { gap: 10, pad: [8, 18, 8, 18], fill: C.s1, stroke: o.err ? C.err : C.n1, sw: 2, r: 999, cross: 'CENTER', name: 'info · ' + label }); f.appendChild(L.tx(label, { size: 13, fill: C.n2 })); f.appendChild(L.px(value, { size: 16, fill: o.err ? C.err : (o.color || C.a3), shadow: C.dark })); return f; };
L.infos = (arr) => { const r = L.al('H', { gap: 8, name: 'info_row' }); r.layoutWrap = 'WRAP'; r.counterAxisSpacing = 8; for (const a of arr) r.appendChild(L.info(a[0], a[1], a[2] || {})); return r; };
// итоговые строки внизу контента
L.sums = (arr, title) => { const f = L.al('V', { gap: 8, pad: [14, 20, 14, 20], fill: C.s1, stroke: C.n1, sw: 2, r: 20, name: 'summary' }); if (title) f.appendChild(L.tx(title, { size: 13, fill: C.a3 })); for (const [a, b, col] of arr) { const r = L.between(L.tx(a, { size: 13, wt: 'Medium', fill: C.n3 }), L.tx(b, { size: 14, fill: col || C.n5 })); f.appendChild(r); r.layoutSizingHorizontal = 'FILL'; } return f; };
// группа с заголовком
L.group = (title, kids, o = {}) => { const g = L.col([L.sec(title), ...kids], { gap: o.gap || 14, name: 'group · ' + title }); return g; };
// кнопка перехода во вложенный поп-ап
L.linkBtn = async (label) => { const b = await L.btn(label, 'btnS'); const ic = await L.icon('arrow-right', 20, C.n5); const iw = b.findOne(x => x.name === 'inner_wrapper'); iw.appendChild(ic); return b; };
// поп-ап инструмента на экране комитета
// o: {cid, tool, w, title, full, id, body, foot, dx, dy, stack:[{...}]}
L.toolScreen = async function (o) {
  const s = await L.base(o.cid, o.tool);
  if (o.under) for (const u of o.under) { const mu = await L.modal(u); L.place(s, mu, { dx: u.dx || 0, dy: u.dy || 0 }); }
  const m = await L.modal({ w: o.w || 800, title: o.title, sub: o.full, body: o.body, footer: o.foot, maxH: o.maxH || 860, gap: o.gap });
  L.place(s, m, { dx: o.dx || 0, dy: o.dy || 0 });
  return s;
};
return L;
}
