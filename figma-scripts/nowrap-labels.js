// Правила переносов (docs/text-wrapping.md) для подписей строк показателей metN / metUp / metDown.
// Ставит неразрывные пробелы (U+00A0) и word joiner (U+2060) прямо в текст. Идемпотентно.
const page = await figma.getNodeByIdAsync('2012:87');
await figma.setCurrentPageAsync(page);
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
const NB = ' ', WJ = '⁠';
const PREP = new Set(['без','в','во','с','со','на','по','и','к','ко','о','об','от','до','для','за','из','у','не','при','над','под','через','а','или','между']);
const UNIT = /^(%|п\.п\.|чел\.|ед\.|шт\.|₽|₽\/кв\. м|кв\. м|км|авто-экв\.\/сут\.|×|баллов)$/;
const PHRASES = ['прошлого раунда', 'этого раунда', 'этом раунде', 'следующего раунда', 'начала игры'];
function norm(s) {
  let t = s.replace(/ /g, ' ').replace(/⁠/g, '');
  t = t.replace(/\(([^()]{1,40})\)/g, m => m.replace(/ /g, NB));
  for (const p of PHRASES) t = t.replace(new RegExp(p, 'gi'), m => m.replace(/ /g, NB));
  t = t.replace(/(^|\s)([А-Яа-яЁё]{2,5}\.) (?=[А-Яа-яЁё])/g, (m, a, b) => a + b + NB);
  t = t.split(' ').map((w, i, a) => (i < a.length - 1 && PREP.has(w.toLowerCase())) ? w + NB : w + ' ').join('').trimEnd().replace(new RegExp(NB + ' ', 'g'), NB);
  const m = t.match(/^(.*\S),[  ]([^,]+)$/);
  if (m && UNIT.test(m[2].replace(/ /g, ' '))) t = m[1] + ',' + NB + m[2].replace(/ /g, NB);
  return t.replace(/([\/-])(?=\S)/g, '$1' + WJ);
}
let changed = 0;
for (const row of page.findAll(n => n.type === 'FRAME' && /^met(N|Up|Down)\b/.test(n.name))) {
  const t = row.children.find(c => c.type === 'TEXT');
  if (!t || t.fontName.family !== 'Inter') continue;
  const ns = norm(t.characters);
  if (ns !== t.characters) { t.characters = ns; changed++; }
}
// Для ленты документооборота дополнительно: число+единица, «× 1», тире к предыдущему слову (см. text-wrapping.md, п. 7),
// и два состояния строки: одна строка → counterAxisAlignItems CENTER, 2–3 строки → MIN.
return { changed };
