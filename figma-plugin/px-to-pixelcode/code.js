// «px → Pixel Code»: превращает контурные надписи в живой текст Pixel Code Bold.
//
// Экраны собираются через Figma API на сервере, где шрифта Pixel Code нет,
// поэтому все надписи Pixel Code собраны из точных контуров этого шрифта
// (fonts/PixelCode/PixelCode-Bold.ttf) и лежат во фреймах с именем
// «px·<размер>·<текст>» (или «px·<размер>·a·<текст>» — без перевода в верхний регистр).
// Плагин заменяет каждый такой фрейм текстовым слоем Pixel Code Bold с тем же
// размером, межстрочным, трекингом −2 %, цветом, обводкой, тенью, выравниванием
// и местом в автолейауте.
//
// Работает по выделению; если ничего не выделено — по всем страницам файла
// (кроме служебной «_build»).
// Шрифт Pixel Code Bold должен быть установлен на компьютере (папка fonts/PixelCode).
const FONT = { family: 'Pixel Code', style: 'Bold' };
// межстрочный по размеру — как на странице «Типографика»
const LH = { 13: 160, 16: 160, 18: 160, 24: 150, 30: 140, 40: 130, 80: 115 };
const RE = /^px·([\d.]+)·(a·)?([\s\S]*)$/;
const copy = v => JSON.parse(JSON.stringify(v));

async function convert(f) {
  const m = f.name.match(RE);
  if (!m) return false;
  const size = +m[1], upper = !m[2], text = m[3].replace(/⏎/g, '\n');
  const lh = LH[size] || 160;
  const v = f.findOne(x => x.name === 'glyphs');
  const t = figma.createText();
  t.fontName = FONT;
  t.characters = text;
  t.fontSize = size;
  t.textCase = upper ? 'UPPER' : 'ORIGINAL';
  t.letterSpacing = { unit: 'PERCENT', value: -2 };
  t.lineHeight = { unit: 'PERCENT', value: lh };
  let align = 'LEFT';
  if (v) {
    t.fills = copy(v.fills);
    if (v.strokes.length) { t.strokes = copy(v.strokes); t.strokeWeight = v.strokeWeight; t.strokeAlign = 'OUTSIDE'; }
    t.effects = copy(v.effects);
    const h = v.constraints.horizontal;
    align = h === 'CENTER' ? 'CENTER' : h === 'MAX' ? 'RIGHT' : 'LEFT';
  } else t.fills = [];
  t.textAlignHorizontal = align;
  const parent = f.parent;
  const auto = 'layoutMode' in parent && parent.layoutMode !== 'NONE' && f.layoutPositioning !== 'ABSOLUTE';
  const multi = f.height > size * lh / 100 * 1.5;
  const fixedW = multi || align !== 'LEFT' || (auto && f.layoutSizingHorizontal === 'FILL');
  if (fixedW) { t.textAutoResize = 'HEIGHT'; t.resize(f.width, t.height); }
  else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  parent.insertChild(parent.children.indexOf(f), t);
  if (auto) {
    if (f.layoutSizingHorizontal === 'FILL') t.layoutSizingHorizontal = 'FILL';
    t.layoutAlign = f.layoutAlign;
    t.layoutGrow = f.layoutGrow;
  } else {
    if (f.layoutPositioning === 'ABSOLUTE') t.layoutPositioning = 'ABSOLUTE';
    t.x = f.x; t.y = f.y + (f.height - t.height) / 2;
    if ('constraints' in f) t.constraints = f.constraints;
  }
  t.visible = f.visible;
  t.opacity = f.opacity;
  t.name = text.replace(/\n/g, ' ');
  f.remove();
  return true;
}

(async () => {
  try { await figma.loadFontAsync(FONT); }
  catch (e) { figma.closePlugin('Шрифт Pixel Code Bold не найден. Установите его (папка fonts/PixelCode) и перезапустите Figma.'); return; }
  let roots = figma.currentPage.selection;
  if (!roots.length) {
    roots = [];
    for (const page of figma.root.children) {
      if (page.name.startsWith('_build')) continue;
      await page.loadAsync();
      roots.push(page);
    }
  }
  figma.notify('px → Pixel Code: обрабатываю…', { timeout: 2000 });
  let count = 0;
  for (const root of roots) {
    const list = [];
    if (root.type === 'FRAME' && RE.test(root.name)) list.push(root);
    if ('findAll' in root) list.push(...root.findAll(x => x.type === 'FRAME' && RE.test(x.name)));
    for (const f of list) { if (f.removed) continue; if (await convert(f)) count++; }
  }
  const scope = figma.currentPage.selection.length ? 'в выделении' : 'во всём файле';
  figma.closePlugin(`Готово ${scope}: живой текст Pixel Code — ${count} надписей`);
})();
