# ТЗ: оглавление

Оригиналы — Google Docs в папке «Документация» на Drive: https://drive.google.com/drive/folders/1qYB3yamX7_Eip_LD4-nq5qfUTMAPPVZB
Здесь — текстовые снимки на 07.11.2026 (Markdown, без картинок). Их удобно искать grep'ом. **Документы продолжают править: при расхождении верен оригинал**, а перед важным решением стоит перечитать нужный раздел в Drive (через Google Drive MCP: `read_file_content` с ID документа).

## Какой документ главнее

- Интерфейс: **1.1 User Flow и 1.5 Поведение интерфейса важнее 1.4 ТЗ Дизайн** (так написано в самом 1.4). Где 1.4 расходится с ними по составу экранов, состояниям, поп-апам P-16…P-18, S-12 и терминам — верны 1.1 и 1.5.
- Фон игрового экрана и рост города — 1.8.
- Механика и числа — 1.3; поведение каждого комитета — спецификации 1.2.
- События — 1.7 (названия и длительности).

## Документы

| № | Документ | Локальный снимок | Google Doc ID | О чём |
|---|---|---|---|---|
| 1.1 | User Flow | [1.1-user-flow.md](1.1-user-flow.md) | `1wtGuIYCel8k9m3_raWBre8Y5nJCgX6cF2FAvEMfT0b4` | Переходы между экранами, сценарии US-FLOW, R-FLOW |
| 1.2 | Общие показатели города и система баллов | [1.2-city-metrics-and-scoring.md](1.2-city-metrics-and-scoring.md) | `19G9UWU8FZ8_SZ5RWu0IBnlClz-VeGrYM2szydzfmqFA` | BLK-01, баллы, лидерборд |
| 1.2 | Комитет по миграции | [1.2-committee-migration.md](1.2-committee-migration.md) | `144FlWmcNn3jKAr9GW8mG6hornunpiH6OwkE05n6qX5c` | Инструменты, KPI, формулы |
| 1.2 | Комитет по образованию, культуре и досугу | [1.2-committee-education.md](1.2-committee-education.md) | `1QxeNXisgqiR5K1Bdv5AcWGAV-eKzCrTSGg9GZljtil4` | |
| 1.2 | Комитет по развитию бизнеса | [1.2-committee-business.md](1.2-committee-business.md) | `1z8b1nJMgkEZN8FcTAdDp4IqYMtPUSvhguSfXm4cvoTw` | |
| 1.2 | Комитет по градостроительству | [1.2-committee-urban.md](1.2-committee-urban.md) | `1shxvDdYED6xRr_3DIJW9xE7DM_xs9LszkjQVi1PWQYQ` | |
| 1.2 | Комитет по транспорту | [1.2-committee-transport.md](1.2-committee-transport.md) | `1AH2m2HR6wNHs_muGYAnuI115svc_jg0OnVgjfuIVlC8` | |
| 1.2 | Комитет по туризму | [1.2-committee-tourism.md](1.2-committee-tourism.md) | `1bCZunfx0p1b09TU4aQ3geEFCG-dhEnq4tCEg70WlFRM` | |
| 1.3 | Реестр механик и формул | [1.3-mechanics-and-formulas.md](1.3-mechanics-and-formulas.md) | `1QYyqUJ54c_hfuobyICsQ3pyBjASK8UJ7fssbpoYH7Cc` | Все формулы (большой, ~600 КБ) |
| 1.4 | ТЗ Дизайн | [1.4-design-spec.md](1.4-design-spec.md) | `1SUtw9BHdS6UlG6MvBdWIZOKaEf3q8Vsqm_nnGBnw08M` | Иллюстрации (3.2.x), экраны S-01…S-12, сквозные блоки BLK-01…04, реестры UI-/S-/P- |
| 1.4 | ТЗ Дизайн, дополнение S-08 | [1.4-design-spec-S-08.md](1.4-design-spec-S-08.md) | `1isWqRUouz-9ck0uZrq-V9bIVfjnM0CQZOYkiSLRqzCI` | Игровой экран, инструменты И-01…И-19, слайдеры SL-, поп-апы P-05…P-12, форматы чисел, короткие названия KPI |
| 1.5 | Поведение интерфейса | [1.5-ui-behaviour.md](1.5-ui-behaviour.md) | `1h7m5lfHEvAvAah1rZkfSez9ZqR8OaWj3s6RuDG7ZnY8` | Токены цвета, шрифты, компоненты и состояния, ЗАМ-xx, поп-апы (затемнение, кнопки), R-UI |
| 1.6 | Настройки баланса в админке | [1.6-admin-balance.md](1.6-admin-balance.md) | `1OYFp73ePoIk8wGRpCLmK02PYKlZmnwDTyYNRhiaxlaI` | |
| 1.7 | Случайные события | [1.7-random-events.md](1.7-random-events.md) | `15y3fgSAxOWzvK6whlZCtBK93FYFLI88Wic5eCKhqR_A` | 8 событий, модификаторы, длительности |
| 1.8 | User Flow — Расширение города | [1.8-city-expansion.md](1.8-city-expansion.md) | `1xwDhzzVnhW_Y_1stqyDrJCjlDQEm_-Yg0g3R6jNRWAE` | Этапы города 0–4 по населению, смена фона |

Ссылка на любой документ: `https://docs.google.com/document/d/<ID>/edit`.

## Где что искать

| Вопрос | Где |
|---|---|
| Какие иллюстрации и где | 1.4 §3.2 (илл. 3.2.1–3.2.7), 1.8 |
| Состав экрана | 1.4 §4.2.x, реестр экранов 1.4 §4.3.4 |
| Состояния компонента, токены цвета | 1.5 (UI-xx, ЗАМ-xx) |
| Инструменты комитета, предикты, единицы | 1.4 дополнение §4.2.8.4.x |
| Поп-апы показателей P-10, состав «из чего складывается» | 1.4 дополнение §4.2.8.5 |
| Что затемняется под поп-апом | 1.5: системные поп-апы P-01, P-02, P-04, P-13, P-14, P-15, P-16 — overlay #000 65 %; P-05…P-12, P-17, P-18 — без затемнения |

## Сводки несостыковок

- «Симулятор мэра — несостыковки в документации» (418 находок, 28.10.2026): https://docs.google.com/document/d/1zpesJE2_iM-ae29q8P8gREZfN-uOq6Rp85ja8I8fSQo/edit
- Прогоны правок Claude: [1](https://docs.google.com/document/d/1CT7xs9-O3FFVSK3Lid-9NcX9nLGdAYsaQKQmiXfCyk8/edit), [2](https://docs.google.com/document/d/1lQ8MAQay5GJsYoyNSuEGYD2hrMUwbae8tZtGY2vokQc/edit), [3](https://docs.google.com/document/d/1iOwlUpQ_-G7JYButGsDnLJBQ4st1ZF74nsG-YG7mN_I/edit)

## Обновить снимки

Через Google Drive MCP: `download_file_content` с `exportMimeType: "text/markdown"` для каждого ID, по одному-два запроса за раз (параллельные запросы таймаутят). Большие ответы сохраняются в файл `tool-results/…download_file_content….txt` — это JSON с base64 в поле `content`. Встроенные картинки (`data:image`) вырезать.
