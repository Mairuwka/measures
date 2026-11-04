# Симулятор мэра — материалы к макетам

- `fonts/PixelCode/` — исходный шрифт интерфейса Pixel Code (Bold, Medium, Regular), лицензия SIL OFL 1.1 (`OFL-LICENSE.txt`). Источник: github.com/qwerasd205/PixelCode.
- `figma-plugin/px-to-pixelcode/` — локальный плагин Figma. При сборке экранов в Figma через MCP шрифт Pixel Code недоступен на сервере. Поэтому изменённые тексты временно набраны Inter Bold, а их слои помечены префиксом `px·`. Плагин возвращает таким слоям Pixel Code Bold и снимает префикс.

## Как вернуть Pixel Code

1. Установите `fonts/PixelCode/PixelCode-Bold.ttf` в систему и перезапустите Figma desktop.
2. В Figma откройте Plugins → Development → Import plugin from manifest… и выберите `figma-plugin/px-to-pixelcode/manifest.json`.
3. Откройте страницу «Экраны для согласования» и запустите плагин. Если что-то выделено, он обработает только выделение, иначе всю страницу.
