# DomoSense Design System

Токены и компоненты платформы диспетчеризации DomoSense для управляющих компаний и ТСЖ.
Источник правды — файл Figma «DomoSense — дизайн-система и диспетчерская». Код повторяет его один в один:
те же имена токенов, те же варианты и состояния компонентов.

> DomoSense — вымышленный бренд для портфолио. Логика интерфейса взята из реального B2B-проекта под NDA, данные заменены.

## Что внутри

| Папка | Что лежит |
| --- | --- |
| `tokens/figma-variables.json` | Экспорт переменных из Figma: 41 примитив, 28 семантических цветов (Light / Dark), 11 отступов, 5 радиусов, 9 текстовых стилей |
| `scripts/build-tokens.mjs` | Скрипт без зависимостей: JSON → `dist/tokens.css` |
| `dist/tokens.css` | CSS-переменные и классы типографики. Тёмная тема — `data-theme="dark"` или системная настройка |
| `components/` | Компоненты: Button, Input, Status Badge, Toast, Subsystem Card, Event Row, Nav Item |
| `index.html` | Витрина: все состояния компонентов и адаптивный дашборд |

## Как пользоваться

```bash
node scripts/build-tokens.mjs   # пересобрать токены после изменений в Figma
open index.html                  # открыть витрину
```

## Связь Figma ↔ код

| Figma | Код |
| --- | --- |
| Переменная `accent/default` | `var(--color-accent-default)` (code syntax прописан в Figma) |
| Текстовый стиль `Heading/H2` | `.ds-text-heading-h2` |
| `Button · Style=Primary, State=Loading` | `.ds-button.ds-button--primary[aria-busy="true"]` |
| `Input · State=Error` | `.ds-field.ds-field--error` + `aria-invalid="true"` |
| `Event Row · State=Selected` | `.ds-row[aria-current="true"]` |
| `Nav Item · State=Active` | `.ds-nav-item[aria-current="page"]` |

## Принципы

1. **Только семантические токены в компонентах.** Примитивы (`--teal-600`) используются лишь внутри `tokens.css`. Поэтому тёмная тема — это смена значений, а не новые стили.
2. **Состояния — через нативные атрибуты.** `disabled`, `aria-busy`, `aria-invalid`, `aria-current` вместо классов-модификаторов: стили и доступность не расходятся.
3. **Цвет не единственный носитель смысла.** У каждого статуса есть текст, у ошибки — объяснение, что исправить.
4. **Краевые случаи — часть компонента.** `999+` в счётчике, пустое состояние, скелетон при загрузке, «нет связи» у устройства.

Автор: Анастасия Путина · Product Designer
