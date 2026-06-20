# Фронтенд (SPA)

## Технологии

- **Alpine.js 3.x** — реактивность через HTML-атрибуты (CDN, без сборки)
- **CSS custom properties** — утилитарные классы (Tailwind-like), светлая/тёмная тема
- **PWA** — Service Worker (cache-first для статики, network-first для API), manifest.json
- **i18n** — JSON-файлы с ключами, переключение RU/EN

## Файлы

| Файл | Назначение |
|------|------------|
| `index.html` | Основная SPA-страница (~755 строк) |
| `settings.html` | Страница настроек (280 строк) |
| `js/app.js` | Логика приложения (~1900 строк) |
| `styles.css` | Все стили (760+ строк) |
| `constants.json` | Статические теги (8 категорий, ~400+ тегов) |
| `presets.json` | 7 готовых пресетов |
| `i18n/ru.json` | Русские переводы (~180 строк) |
| `i18n/en.json` | Английские переводы (~180 строк) |
| `sw.js` | Service Worker (67 строк) |
| `manifest.json` | PWA-манифест |

## index.html — структура

### `<head>`

- Мета-теги, viewport
- PWA manifest + иконка
- Service Worker регистрация
- Alpine.js CDN (3.x)

### `<header>`

- Заголовок с версией
- 📋 Кнопка «Холсты» (менеджер сохранённых)
- Donate ссылка (Boosty)
- Theme switcher (auto/dark/light)
- Language toggle (RU/EN)
- PWA install
- ComfyUI toggle
- Settings link

### Sidebar

- **Пресеты** — кнопки из `presetData`
- **Табы сайдбара** — `sidebarTab = 'const' | 'tree' | 'main'`
  - **Статические теги** (`const`) — коллапсируемые категории из `constants.json`
  - **Теги из набора** (`tree`) — дерево категорий из API, lazy-load
  - **Основные** (`main`) — кастомные теги, сгруппированные по блокам текущей структуры промпта; каждая группа отображается если `mainTagsByBlock(block.id)` не пуст; у каждого тега кнопки: `+` (добавить), `−` (негатив), `✎` (редактировать), `✕` (удалить); фильтруется по `structures` — тег виден только если его `structures` пуст или включает текущую `promptStructure`

### Workspace (Canvas)

**Ряд 1:** `<select>` с `PROMPT_STRUCTURES` + кнопки ✎ (переименовать, только при `canvasName`), 💾 (сохранить), 🆕 (новый холст)

**Ряд 2:** Название холста

**Ряд 3:** Draggable `BREAK` кнопка

**Позитивный промпт** — заголовок + кнопка «Очистить» (красная)

**Положительные блоки** — динамические, `x-for="block in currentStructureBlocks"`. Каждый блок:
- Заголовок: `structureBlockLabel(block)` + счётчик чипов
- Чипы с DnD, ✎ edit, x удаление

**Негативный блок** — `:data-block-id="currentStructure.negativeBlockId"`, заголовок + очистить + чипы

### Modals

- **Save canvas** — поле имени + чекбокс «Создать копию» при конфликте имени
- **Rename canvas** — поле нового имени
- **Холсты (менеджер)** — список сохранённых, кнопки Открыть / 🗑
- **Main tag add/edit** — поля: tag_name, full_text, block_id (из `currentStructureAllBlocks`), чекбоксы стилей (`structures`). При редактировании предзаполнено
- **Edit chip** — name, prompt_text, block_id (из `currentStructureAllBlocks`)
- **Tree loading** — progress bar
- **Toast** — уведомление внизу

## app.js — Alpine.js компонент

### Глобальные константы

```js
const BLOCK_IDS = { '1': 1, ..., '9': 9 };
const BLOCK_COLORS = [null, '#60cdff', ..., '#ff8c00']; // 10 цветов для block_id 1-10
```

**`PROMPT_STRUCTURES`** — массив из 7 конфигов:

| id | labelKey | blocks | negativeBlockId | renderPositive |
|----|----------|--------|-----------------|----------------|
| `standard` | `structure.standard` | 8 блоков (block.1–8) | 9 | `g.join(', ').join(' BREAK ')` |
| `midjourney` | `structure.midjourney` | 8 блоков (mj.b1–8) | 9 | блоки через `, ` + `--ar --v --style --s --no` |
| `dalle3` | `structure.dalle3` | 7 блоков (d3.b1–7) | 9 | блоки через `. ` + `'` |
| `sd` | `structure.sd` | 8 блоков (sd.b1–8) | 9 | блоки через ` + ` |
| `flux` | `structure.flux` | 6 блоков (flux.b1–6) | 9 | блоки через `, ` |
| `novelai` | `structure.novelai` | 9 блоков (novelai.b1–9) | 10 | блоки через `, ` |
| `anime` | `structure.anime` | 8 блоков (anime.b1–8) | 9 | блоки через `, ` |

Каждый блок: `{ id, labelKey }`. `renderPositive(blocks, t)` — функция, `blocks` — массив массивов строк (по одному на блок). `renderNegative(chips, t)` — негативные чипы.

### Данные компонента (ключевые)

| Поле | Начальное | Описание |
|------|-----------|----------|
| `packs` | `[]` | Список паков |
| `selectedPackId` | `''` | ID выбранного пака |
| `constantTags` | `[]` | Статические теги из constants.json |
| `tagBlockMap` | `{}` | `tag → block_id` для констант |
| `positiveChips` | `[]` | Чипы позитива `{ name, category, subcategory, block_id, prompt_text }` |
| `negativeChips` | `[]` | Чипы негатива |
| `promptStructure` | `'standard'` | ID текущей структуры промпта |
| `_orphanChips` | `{positive:[], negative:[]}` | Чипы, не вписывающиеся в текущую структуру |
| `canvasName` | `''` | Имя текущего холста |
| `canvasId` | `null` | ID текущего холста (для overwrite) |
| `saveForm` | `{name, duplicate, showDuplicateCheckbox}` | Форма сохранения |
| `renameForm` | `{name}` | Форма переименования |
| `customMainTags` | `[]` | Кастомные теги |
| `mainTagForm` | `{tag_name, full_text, block_id, structures}` | Форма add/edit тега |
| `_editingMainTagId` | `null` | ID редактируемого тега (null = create) |
| `mainTagModal` | `false` | Видимость модалки Main tag |
| `editChipForm` | `{name, prompt_text, block_id}` | Форма edit chip |
| `sidebarTab` | `'const'` | `const / tree / main` |
| `dragState` | `null` | Состояние drag |
| `dropTarget` | `null` | Позиция drop |
| `comfyEnabled` | `false` | Включена ли интеграция ComfyUI |

### Computed (getters)

- `currentPack` — выбранный пак с локализованным именем
- `currentStructure` — объект структуры из `PROMPT_STRUCTURES[promptStructure]`
- `currentStructureBlocks` — `currentStructure.blocks`
- `currentStructureAllBlocks` — `currentStructure.blocks` + негативный блок
- `positivePrompt` — вызывает `currentStructure.renderPositive(blocks, t)`
- `negativePrompt` — вызывает `currentStructure.renderNegative(chips, t)`
- `isDark` — авто/тёмная/светлая тема

### Ключевые методы

**Инициализация:**
- `init()` — загружает пресеты, переводы, константы, паки, customMainTags, savedPrompts, ComfyUI-конфиг; устанавливает `$watch('saveForm.name', ...)` для чекбокса дублирования; `$watch('promptStructure', ...)` для переключения структуры

**Prompt Structure:**
- `structureBlockLabel(block)` — возвращает i18n-лейбл для блока текущей структуры
- `onStructureChange(oldId, newId)` — обновляет `block_id` негативных чипов, орфанит положительные чипы с блоком вне новой структуры, восстанавливает orphans при возврате

**Чипы:**
- `resolveBlockId(category, subcategory)` — const → BLOCK_IDS, иначе 1
- `resolveBlockIdByName(tagName)` — lookup в tagBlockMap
- `makeChip(tag)` — создаёт объект чипа с block_id
- `addTag(tag)` — toggle в позитив
- `addNegativeTag(tag)` — toggle в негатив; устанавливает `ch.block_id = currentStructure.negativeBlockId`
- `removeChip(type, name)` — удаление
- `addCustomTag(negative)` — toggle кастомного тега; в негатив ставит `block_id = currentStructure.negativeBlockId`
- `clearPositiveChips()` / `clearNegativeChips()` — очистка

**Custom Main Tags:**
- `loadCustomMainTags()` — GET `/api/custom-main-tags`
- `openMainTagAdd(blockId)` — открыть модалку создания; `structures = PROMPT_STRUCTURES.map(s => s.id)`
- `openEditMainTag(item)` — открыть модалку редактирования с предзаполненными данными
- `closeMainTagModal()` — сброс `_editingMainTagId`
- `saveMainTag()` — POST `/api/custom-main-tags`; если `_editingMainTagId` → передаёт `id` (update); передаёт `structures`
- `deleteMainTag(item)` — DELETE + удаляет из canvas чипов
- `addCustomMainTag(item)` — toggle; guard `item.structures` проверяет `promptStructure`; использует `currentStructure.negativeBlockId`
- `addCustomMainTagNegative(item)` — toggle; тот же guard
- `mainTagsByBlock(blockId)` — фильтр по `block_id` + `structures.includes(promptStructure)`

**Edit Chip:**
- `openEditChip(chip)` — заполняет `editChipForm`, открывает модалку
- `saveEditChip()` — сохраняет изменения в чип по ссылке

**DnD:**
- `onDragStart` — устанавливает dragState + `chip-dragging` класс
- `dragBreakSource` — для BREAK кнопки (флаг `isBreakSource`)
- `onDragOver` — Euclidean distance до центра чипа, определяет before/after
- `onDragEnter` / `onDragLeave` — `.drag-over` класс
- `onDrop` — перемещает чип между/внутри блоков; BREAK создаёт новый чип с уникальным `_key`
- `onDragEnd` — снимает визуальные классы

**Canvas save/load:**
- `openSaveModal()` — инициализирует `saveForm`
- `saveCanvas()` — POST `/api/prompts` с `chips_data` (включает `promptStructure`), handles duplicate conflict
- `newCanvas()` — очищает все чипы, `promptStructure = 'standard'`, `_orphanChips = {}`
- `openRenameModal()` / `renameCanvas()` — POST с `{id, name}`
- `openManager()` / `closeManager()` — модалка холстов
- `restoreFromSaved(item)` — восстанавливает чипы + `promptStructure` из `chips_data`
- `deleteSavedPrompt(item)` — DELETE + сброс `canvasName`/`canvasId` если совпадает

**Промпты:**
- `copyPrompt(type)` / `copyTagName(name)` — буфер обмена + toast
- `autoSavePrompt()` — debounced (150ms) localStorage
- `loadAutoSave()` — восстановление при старте

**ComfyUI:**
- `loadComfyConfig()`, `loadWorkflows()`, `loadCheckpoints()`, `loadSamplers()`, `generate()` и т.д.

## styles.css

### Тема

CSS custom properties для светлой темы (`:root`), `.dark` класс переопределяет их.

Ключевые цвета:
- Фон: `#fff` / `#0f172a` (dark)
- Поверхность: `#f9fafb` / `#1e293b`
- Текст: `#111827` / `#f1f5f9`
- Акцент: `#2563eb` / `#93c5fd`
- Зелёный (pos): `#16a34a`
- Красный (neg): `#dc2626`

### Компоненты

- `.chip` / `.chip-positive` / `.chip-negative` — чипы в workspace
- `.tag-pill` — теги в сайдбаре (с `.selected-pos` / `.selected-neg`)
- `.block-section` / `.block-header` — группы чипов
- `.break-btn` — кнопка BREAK
- `.chip-dragging` — opacity 0.4 при drag
- `.drop-before` / `.drop-after` — box-shadow индикаторы
- `.drag-over` — пунктирная рамка
- `.chip-btn` — кнопки ✎ / x на чипе
- `.toast` — уведомление
- `.sidebar-tabs` / `.sidebar-tab` / `.sidebar-tab.active` — табы сайдбара
- `.gen-row` / `.gen-label` / `.gen-refresh` — строки управления генерацией
- `.btn-gen` / `.btn-gen-ready` / `.btn-gen-busy` — кнопка Generate
- `.progress-bar` / `.progress-bar-fill` — прогресс-бар

### DnD визуал

- `.drop-before::before` / `.drop-after::after` — 3px синие вертикальные бары (position: relative на `.chip`)
- `.chip-dragging` — снижает opacity

## i18n

Файлы: `i18n/ru.json`, `i18n/en.json`

~180+ ключей в категориях: app, theme, packs, settings, const, presets, sidebar, tag, workspace, custom, prompt, actions, modal, toast, block (заголовки блоков), main, chip, canvas (save, rename, new, manager, duplicate), structure (7 названий структур + все label'и блоков для каждой структуры), donate, comfy, preview.

Переключение: `this.lang` → fetch `/static/i18n/{lang}.json` → `this.translations`

## PWA

**sw.js:**
- Cache name: `design-prompts-v1`
- Install: pre-cache `/`, js, manifest
- Activate: clean old caches
- Fetch: `/api/*` → network first, всё остальное → cache first

**manifest.json:**
- `display: standalone`
- Тёмные цвета темы
- Иконка `/static/icon.ico`
