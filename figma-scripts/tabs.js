// Пересборка корешков поп-апов (upper_group_close) по единой форме и ширине от содержимого.
// Безопасно перезапускать: форма и ширина пересчитываются заново, правый край вкладки не двигается.
// Логотипные корешки («симулятор мэра») пропускаются.
const PAGE_ID = '2012:87';            // '0:1' — то же для эталонов
const OUT = "M 36.76640697533436 0 L 73.30211929908023 0 L 106.62257006014899 0 L 335.61820045561393 0 L 335.61820045561393 0.1559647126394568 C 336.2048774946112 0.20250361627892643 336.7892824398882 0.2586416266531446 337.37124698820645 0.32549157420408376 C 340.3170585723047 0.6662627087397401 343.1968672363569 1.269124330304956 345.9946561221626 2.1111745160181545 C 369.2315830033548 9.114344067074711 386.69587710599563 30.558554469916047 404.2518123220194 52.11594778219762 C 405.4997527852252 53.648598638840426 406.75016169592953 55.17922311971609 408.00115966796875 56.707865372444815 L 143.38897352916587 56.707865372444815 L 143.38897352916587 192.11236024134365 C 143.38897352916587 217.67879452914545 126.9280893094077 238.4044952392578 106.62257006014899 238.4044952392578 L 36.766399962699424 238.4044952392578 C 16.460877207123247 238.4044952392578 0 217.67879452914545 0 192.11236024134365 L 0 46.29213499791413 C 0 20.72569629535032 16.460884219758185 0 36.76640697533436 0 Z";
const INN = "M 36.766405898854075 0 L 73.30212126218085 0 L 106.62257032006423 0 L 335.6182262652607 0 L 335.6182262652607 0.1559647067773105 C 336.20490329807023 0.202503611681235 336.7892709031668 0.25864163536425366 337.3712354465047 0.3254915852935944 C 340.3170469335715 0.666262730840548 343.1968603097483 1.2691242437170465 345.9946492721539 2.1111744414178775 C 369.23157647417895 9.11434398374745 386.6958652908414 30.558555454724004 404.25180052406546 52.115948032283725 C 405.4997409467391 53.64859887675421 406.75016173493066 55.17922447474075 408.00115966796875 56.70786666870117 L 143.3889716945099 56.70786666870117 L 0 56.70786666870117 L 0 46.292134031957644 C 0 20.725695169518147 16.460883619221796 0 36.766405898854075 0 Z";
// Шаблон W=408; для ширины S сдвигаются только точки скоса (x ≥ 335.6). Форма валидна при S ≥ 183.
const gen = (tpl, S) => { const d = S - 408.00115966796875; const t = tpl.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/g); for (let i = 0; i < t.length; i++) { if (/[MLCZ]/.test(t[i])) continue; const x = +t[i]; if (x >= 335.6) t[i] = String(x + d); i++; } return t.join(' '); };

const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);
const rows = [];
for (const tab of page.findAll(n => n.type === 'FRAME' && n.name === 'upper_group_close')) {
  const shape = tab.children.find(c => c.name === 'pattenr_form');
  if (!shape || shape.width - tab.width > 10) continue;                 // логотипный корешок
  const txt = tab.children.find(c => c.type === 'TEXT' || /^px·/.test(c.name));
  const btn = tab.children.find(c => /^Button_icon/.test(c.name));
  let W = btn ? Math.round(69 + txt.width + 16 + 32 + 34) : Math.round(69 + txt.width + 35);
  if (W + 3 < 183) W = 180;
  const S = W + 3, oldW = tab.width, oldRight = tab.x + tab.width;
  const vs = shape.findAll(v => v.type === 'VECTOR' && v.width < 1500 && v.vectorPaths.length === 1);
  const outV = vs.find(v => v.height > 100), inV = vs.find(v => v.height < 100);
  outV.vectorPaths = [{ windingRule: outV.vectorPaths[0].windingRule, data: gen(OUT, S) }];
  inV.vectorPaths = [{ windingRule: inV.vectorPaths[0].windingRule, data: gen(INN, S) }];
  const d = W - oldW, kids = tab.children.slice();
  tab.resizeWithoutConstraints(W, tab.height); tab.x = oldRight - W;
  for (const c of kids) { const rt = c.relativeTransform; c.relativeTransform = [[rt[0][0], rt[0][1], rt[0][2] + d], [rt[1][0], rt[1][1], rt[1][2]]]; }
  txt.x = 69; if (btn) btn.x = Math.round(69 + txt.width + 16);
  // узор внутри корешка совмещаем с узором тела окна
  const inter = shape.findOne(x => x.type === 'BOOLEAN_OPERATION' && x.name === 'Intersect');
  const pv = inter && inter.children.find(c => c.type === 'VECTOR' && c.width > 1000);
  const pat = tab.parent.children.find(c => c.name === 'pattern');
  const bodyV = pat && pat.children.find(c => c.type === 'VECTOR' && c.width > 1000);
  if (pv && bodyV) { pv.x = bodyV.absoluteTransform[0][2] - tab.absoluteTransform[0][2]; pv.y = bodyV.absoluteTransform[1][2] - tab.absoluteTransform[1][2]; }
  rows.push(`${tab.id} ${Math.round(oldW)}→${W}`);
}
return rows;
