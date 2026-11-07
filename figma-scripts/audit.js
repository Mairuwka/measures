// Запуск аудита, хранящегося на служебной странице (TEXT `audit.js`, ID 2215:87).
// Проверяет: отступы auto-layout против кита/эталонов, наложения, переполнения, нулевые зазоры, блоки над нижней панелью.
// SECTIONS — ID секций страницы 2012:87, которые проверяем (см. docs/figma.md).
const SECTIONS = ['2135:87', '2092:87', '2096:87', '2056:87', '2076:88', '2104:88', '2110:87', '2116:88'];
const sp = await figma.getNodeByIdAsync('2040:87');
await figma.setCurrentPageAsync(sp);
const src = (await figma.getNodeByIdAsync('2215:87')).characters;
const AUDIT = eval('(' + src.replace(/^async function AUDIT/, 'async function') + ')');
const r = await AUDIT(figma, SECTIONS);
// Известные старые замечания (не наши): Badge_small 12 вместо 8, Button_primary/disabled, наложение реплики на S-10.
const sum = {};
for (const [k, v] of Object.entries(r)) sum[k] = { n: v.n, ex: v.ex.filter(s => !/Badge_small|Button_primary\/disabled/.test(s)).slice(0, 15) };
return sum;
