// Свечения (прямоугольники с LAYER_BLUR) по правилам кита. Идемпотентно.
const page = await figma.getNodeByIdAsync('2012:87');
await figma.setCurrentPageAsync(page);
const glowOf = n => n.children.find(c => c.type === 'RECTANGLE' && c.effects.some(e => e.type === 'LAYER_BLUR'));
const log = { badges: 0, chips: 0, sliders: 0 };
// Badge/primary: свечение ровно по бейджу
for (const b of page.findAll(x => x.type === 'FRAME' && /^Badge\/primary/.test(x.name))) {
  const g = glowOf(b); if (!g) continue; g.resize(b.width, b.height); g.x = 0; g.y = 0; log.badges++;
}
// Chip_primary/pressed: по ширине чипа, y=2, высота чипа − 4
for (const c of page.findAll(x => x.type === 'FRAME' && /^Chip_primary\/pressed/.test(x.name))) {
  const g = glowOf(c); if (!g) continue; g.resize(c.width, c.height - 4); g.x = 0; g.y = 2; g.cornerRadius = 999; log.chips++;
}
// Ползунок слайдера: свечение по центру ползунка
for (const w of page.findAll(x => x.type === 'FRAME' && x.name === 'slider_wrapper')) {
  const g = glowOf(w); const t = w.children.find(c => c.type === 'RECTANGLE' && c.name === 'thumb' && c !== g);
  if (!g || !t) continue; g.x = t.x + (t.width - g.width) / 2; g.y = t.y + (t.height - g.height) / 2; log.sliders++;
}
// Карточки: hover/pressed — см. docs/figma-rules.md (hover шире карточки, pressed ровно по ней).
return log;
