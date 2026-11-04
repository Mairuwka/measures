// Возвращает исходный шрифт Pixel Code Bold всем текстовым слоям,
// имя которых начинается с «px·» (временная замена, сделанная при сборке экранов).
// Работает по выделению, а если ничего не выделено — по всей текущей странице.
(async () => {
  const target = { family: 'Pixel Code', style: 'Bold' };
  try {
    await figma.loadFontAsync(target);
  } catch (e) {
    figma.closePlugin('Шрифт Pixel Code Bold не найден. Установите его (папка fonts/PixelCode) и перезапустите Figma.');
    return;
  }
  const roots = figma.currentPage.selection.length ? figma.currentPage.selection : [figma.currentPage];
  let count = 0;
  for (const root of roots) {
    const texts = root.type === 'TEXT' ? [root] : root.findAllWithCriteria({ types: ['TEXT'] });
    for (const t of texts) {
      if (!t.name.startsWith('px·')) continue;
      for (const seg of t.getStyledTextSegments(['fontName'])) {
        await figma.loadFontAsync(seg.fontName);
      }
      t.fontName = target;
      t.name = t.name.slice(3);
      count++;
    }
  }
  figma.closePlugin(`Готово: Pixel Code применён к ${count} слоям`);
})();
