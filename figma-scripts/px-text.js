// Надпись шрифтом Pixel Code из контуров глифов (сам шрифт через MCP не загружается).
// Заменяет TEXT-слой Pixel Code на фрейм `px·<size>·<текст>` с тем же цветом и тенью.
// Использование: подставить TARGET_TEXT_ID и NEW_TEXT, выполнить в use_figma.
const TARGET_TEXT_ID = '0:0';   // ID текстового слоя Pixel Code, который заменяем
const NEW_TEXT = 'новый текст'; // регистр не важен: L.px пишет прописными (upper: false — как есть)

// 1) библиотека и глифы со служебной страницы
const sp = await figma.getNodeByIdAsync('2040:87');
await figma.setCurrentPageAsync(sp);
const G = JSON.parse((await figma.getNodeByIdAsync('2040:88')).characters);
const L = await (eval('(' + (await figma.getNodeByIdAsync('2041:87')).characters + ')'))(figma, G);
// 2) рабочая страница (вторая смена страницы за вызов — допустима)
const pg = await figma.getNodeByIdAsync('2012:87');
await figma.setCurrentPageAsync(pg);
const hex = c => [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();

const t = await figma.getNodeByIdAsync(TARGET_TEXT_ID);
const o = { size: t.fontSize, fill: hex(t.fills[0].color) };
if (t.strokes.length) { o.stroke = hex(t.strokes[0].color); o.sw = t.strokeWeight; }
const sh = t.effects.find(e => e.type === 'DROP_SHADOW' && e.visible !== false);
if (sh) { o.shadow = hex(sh.color); o.sh = sh.offset.x; }
const fr = L.px(NEW_TEXT, o);            // многострочно: '\n' в тексте
fr.name = 'px·' + t.fontSize + '·' + NEW_TEXT.replace(/\n/g, ' / ');
t.parent.insertChild(t.parent.children.indexOf(t), fr);
if (!(t.parent.layoutMode && t.parent.layoutMode !== 'NONE')) { fr.x = t.x; fr.y = t.y; }
t.remove();
// Перед заменой проверь, что все буквы есть в глифах: [...NEW_TEXT.toUpperCase()].filter(ch => ch !== ' ' && !G[ch])
// Заголовок поп-апа/секции в фирменном стиле: L.pxTitle('текст', 24)
return { id: fr.id, w: fr.width, h: fr.height };
