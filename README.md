# DesignPrompts

**DesignPrompts** is an application for creating, organizing, and managing prompts for AI image generation using popular models such as Stable Diffusion, FLUX, ComfyUI, and others.

Instead of storing prompts as plain text, DesignPrompts lets you organize them into reusable building blocks. You can save prompt history, reuse individual components, combine existing fragments into new prompts, and generate images directly from the application without switching between multiple tools.

---

# Features

## 🖼 Canvas

Canvases allow you to save complete prompts and return to them at any time.

Features:

- Create unlimited canvas projects
- Store complete prompts
- Change canvas structure using templates
- Reuse previous projects
- Instantly generate images from saved prompts

---

## 🧩 Prompt Builder

DesignPrompts helps you build complex prompts without memorizing long prompt structures.

Organize your prompts into categories:

- General
- Character
- Artist
- Copyright
- Meta

Prompts are assembled from reusable blocks, making them easy to edit, expand, and maintain.

Supported features:

- Tag groups
- Dynamic tags
- Reusable prompt blocks
- Prompt history

---

## 📋 Templates

Create your own prompt templates.

The application includes built-in templates for popular AI image generation models.

Templates define:

- prompt structure
- category layout
- canvas organization
- prompt generation rules

---

## ⚙ ComfyUI Workflows

DesignPrompts includes native support for ComfyUI workflows.

You can:

- store JSON workflows;
- create custom generation pipelines;
- edit workflows directly inside the application;
- reuse workflows across multiple prompts;
- automatically replace variables before image generation.

---

# Modular Addon System

DesignPrompts supports modular addons.

An addon may contain:

- prompt templates;
- categories;
- tag libraries;
- reusable prompt collections.

This allows the application to be extended without modifying the core program.

---

# Addon Structure

```
Standard/
└── info.pack
```

Example `info.pack`

```yaml
name: "Addon Name"
description: "Description"
version: "1.0.0"
author: "Author"
icon: "🎨"
type: "box"

categories:
  - id: 1
    category: "Objects"

    tags:
      - name: "Tree"
        text: "beautiful oak tree"

    files:
      - "objects.txt"
```

## Fields

| Field | Type | Required | Description |
|------|------|----------|-------------|
| name | string | ✔ | Addon name |
| description | string | | Description |
| version | string | | Version |
| author | string | | Author |
| icon | string | | Emoji or icon |
| type | string | | `box` hides the addon icon from the sidebar |
| categories | array | ✔ | List of addon categories |

---

## Categories

Each category contains:

```yaml
id: 1
category: "Objects"

tags:
  - name: "Tree"
    text: "beautiful oak tree"

files:
  - objects.txt
```

---

## Tags

Tags can be stored in two different ways.

### Inline tags

```yaml
tags:
  - name: "Tree"
    text: "beautiful oak tree"
```

If `text` is omitted, the value of `name` is used.

---

### External files

```
Tree | beautiful oak tree
Car | sports car
House | old wooden house
```

Each line follows the format:

```
Display Name | Full Prompt
```

If the separator `|` is missing, the display name is used as the prompt text.

Comments begin with:

```
#
```

---

# Validation

When an addon is loaded, the following checks are performed:

- `name` is required;
- `name` cannot be empty;
- every `categories.id` must be unique;
- if `files` are specified, they are automatically loaded and parsed;
- if `files` are not specified, inline `tags` are used.

---

# Included Addons

The application comes with built-in tag libraries for Danbooru-style prompting.

These provide commonly used categories and tags, allowing you to start building prompts immediately.

---

# Workflow Editor

The Workflow Editor is designed to manage ComfyUI JSON workflows.

## Layout

The editor consists of three panels.

### Left Panel

Workflow list.

Features:

- each workflow is stored as a separate JSON file;
- workflows are located in:

```
Workflows/
```

- file format:

```
<workflow>.json
```

Workflow files can be edited either inside the application or with any text editor.

API:

```
GET /api/comfy/workflows
```

Returns a list of all available workflows.

Selecting a workflow loads it into the editor.

The **New** button creates an empty workflow.

---

### Center Panel

JSON editor.

Features:

- edit workflow JSON;
- monospace editor;
- save workflow;
- delete workflow.

API:

```
PUT /api/comfy/workflows
```

Accepts:

```json
{
  "name": "...",
  "content": "{ ... }"
}
```

and saves the file as:

```
Workflows/<name>.json
```

Delete:

```
DELETE /api/comfy/workflows?name=<workflow>
```

---

### Right Panel

Displays variables detected in the currently selected workflow.

Supported variables:

```
%SEED%
%STEPS%
%CFG%
%SAMPLER_NAME%
%SCHEDULER%
%CKPT%
%WIDTH%
%HEIGHT%
%PROMPT_POSITIVE%
%PROMPT_NEGATIVE%
```

Variables found in the workflow are marked with:

```
✓
```

Variables that are not used are marked with:

```
☐
```

---

# Image Generation

During image generation, the selected workflow is automatically applied.

When **Generate** is clicked:

1. The selected workflow is loaded.
2. All `%VARIABLE%` placeholders are replaced with the current UI values.
3. The resulting JSON is sent to:

```
POST /api/comfy/generate
```

ComfyUI then executes the workflow and starts the image generation process.

---

# Key Features

- Prompt history management
- Structured prompt organization
- Prompt templates
- Modular addon system
- Tag libraries
- Dynamic variables
- Native ComfyUI integration
- Built-in Workflow Editor
- Reusable prompt components
- Build complex prompts without repetitive copy-pasting
  
# DesignPrompts

**DesignPrompts** — приложение для создания, хранения и управления промптами для генерации изображений с помощью популярных нейросетей (Stable Diffusion, Flux, ComfyUI и других).

Приложение позволяет не только хранить историю промптов, но и структурировать их, повторно использовать отдельные части, собирать новые запросы из готовых блоков и сразу отправлять их на генерацию изображений, не покидая приложение.

---

# Возможности

## 🖼 Холсты (Canvas)

Холсты позволяют сохранять готовые промпты и возвращаться к ним в любой момент.

Возможности:

- создание неограниченного количества холстов;
- сохранение законченных промптов;
- изменение структуры холста через шаблоны;
- повторное использование ранее созданных проектов;
- быстрый переход к генерации изображения.

---

## 🧩 Конструктор промптов

DesignPrompts помогает создавать большие и сложные промпты без необходимости держать их структуру в памяти.

Используйте категории для организации запросов:

- General
- Character
- Artist
- Copyright
- Meta

Промпты собираются как конструктор из отдельных частей, которые можно свободно комбинировать между собой.

Поддерживаются:

- группы тегов;
- динамические теги;
- переиспользуемые блоки промптов;
- история изменений.

---

## 📋 Шаблоны

Создавайте собственные шаблоны структуры промптов.

По умолчанию приложение уже содержит шаблоны для популярных моделей и генераторов изображений.

Шаблон определяет:

- порядок частей промпта;
- используемые категории;
- структуру холста;
- правила построения итогового запроса.

---

## ⚙ Workflows ComfyUI

DesignPrompts умеет работать с Workflow ComfyUI.

Вы можете:

- хранить JSON Workflow;
- создавать собственные пайплайны;
- редактировать Workflow прямо внутри приложения;
- использовать один Workflow для различных промптов;
- автоматически подставлять значения параметров перед генерацией.

---

# Модульная система аддонов

Приложение поддерживает систему модулей (Addons).

Аддон может содержать:

- шаблоны промптов;
- категории;
- наборы тегов;
- готовые библиотеки промптов.

Это позволяет легко расширять программу без изменения основного приложения.

---

# Структура аддона

```
Standard/
└── info.pack
```

Пример файла `info.pack`

```yaml
name: "Название аддона"
description: "Описание"
version: "1.0.0"
author: "Имя автора"
icon: "🎨"
type: "box"

categories:
  - id: 1
    category: "Объекты"

    tags:
      - name: "Tree"
        text: "beautiful oak tree"

    files:
      - "objects.txt"
```

## Поля

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| name | string | ✔ | Название аддона |
| description | string | | Описание |
| version | string | | Версия |
| author | string | | Автор |
| icon | string | | Emoji или иконка |
| type | string | | `box` скрывает иконку из боковой панели |
| categories | array | ✔ | Категории аддона |

---

## Категории

Каждая категория содержит:

```yaml
id: 1
category: "Objects"

tags:
  - name: "Tree"
    text: "beautiful oak tree"

files:
  - objects.txt
```

---

## Tags

Теги можно хранить двумя способами.

### Встроенные

```yaml
tags:
  - name: "Tree"
    text: "beautiful oak tree"
```

Если поле `text` отсутствует, используется значение `name`.

---

### Внешние файлы

```
Tree | beautiful oak tree
Car | sports car
House | old wooden house
```

Формат строки:

```
Название | Полный промпт
```

Если символ `|` отсутствует, считается, что название и текст совпадают.

Комментарии начинаются с символа:

```
#
```

---

# Валидация

При загрузке аддона выполняются проверки:

- поле `name` обязательно;
- название не может быть пустым;
- идентификаторы `categories.id` должны быть уникальными;
- если указаны `files`, они автоматически загружаются и парсятся;
- если `files` отсутствуют, используются встроенные `tags`.

---

# Стандартные аддоны

В комплект приложения входят готовые библиотеки тегов для Danbooru-стиля промптов.

Они содержат наиболее распространённые категории и позволяют сразу приступить к работе без дополнительной настройки.

---

# Workflow Editor

Редактор Workflow предназначен для управления JSON-файлами ComfyUI.

## Интерфейс

Редактор состоит из трёх колонок.

### Левая колонка

Список Workflow.

Особенности:

- каждый Workflow хранится как отдельный JSON-файл;
- файлы находятся в каталоге:

```
Workflows/
```

- формат хранения:

```
<workflow>.json
```

Workflow можно редактировать как внутри приложения, так и обычным текстовым редактором.

API:

```
GET /api/comfy/workflows
```

Получает список Workflow.

При выборе Workflow его содержимое загружается в редактор.

Кнопка **New** создаёт новый пустой Workflow.

---

### Центральная колонка

JSON-редактор.

Возможности:

- редактирование содержимого Workflow;
- моноширинный шрифт;
- сохранение;
- удаление.

API:

```
PUT /api/comfy/workflows
```

Принимает

```json
{
  "name": "...",
  "content": "{ ... }"
}
```

и сохраняет файл

```
Workflows/<name>.json
```

Удаление:

```
DELETE /api/comfy/workflows?name=<workflow>
```

---

### Правая колонка

Показывает переменные, используемые текущим Workflow.

Поддерживаемые переменные:

```
%SEED%
%STEPS%
%CFG%
%SAMPLER_NAME%
%SCHEDULER%
%CKPT%
%WIDTH%
%HEIGHT%
%PROMPT_POSITIVE%
%PROMPT_NEGATIVE%
```

Если переменная присутствует в JSON Workflow, рядом отображается отметка:

```
✓
```

Иначе:

```
☐
```

---

# Генерация изображений

Во время генерации выбранный Workflow автоматически используется для формирования запроса.

При нажатии кнопки **Generate**:

1. Загружается выбранный Workflow.
2. Все переменные вида `%VARIABLE%` заменяются текущими значениями из интерфейса.
3. Полученный JSON отправляется в:

```
POST /api/comfy/generate
```

После этого ComfyUI начинает выполнение Workflow и генерацию изображения.

---

# Основные преимущества

- хранение истории промптов;
- структурированные категории;
- шаблоны промптов;
- модульная система аддонов;
- библиотеки тегов;
- динамические переменные;
- интеграция с ComfyUI;
- встроенный редактор Workflow;
- повторное использование промптов;
- удобная сборка сложных запросов без ручного копирования.