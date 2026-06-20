# API Reference

Все `/api/*` хендлеры обёрнуты в `apiMiddleware` (panic recovery → JSON 500).

## Системные

### `GET /api/version`

Возвращает версию приложения.

```json
{ "version": "1.0.31" }
```

Не обёрнут в `apiMiddleware` (зарегистрирован напрямую в `main.go`).

---

## Config

### `GET /api/config`

Возвращает текущую конфигурацию.

```json
{
  "port": 8080,
  "tags_path": "C:\\...\\tags",
  "db_path": "C:\\...\\data.db",
  "log_level": "error",
  "logs_dir": "C:\\...\\logs"
}
```

### `PUT /api/config`

Обновляет конфигурацию. Принимает те же поля. Пустые поля заменяются текущими значениями. Сохраняет на диск и обновляет in-memory.

```json
{
  "port": 8080,
  "tags_path": "./tags",
  "db_path": "./data.db",
  "log_level": "debug",
  "logs_dir": "./logs"
}
```

Ответ: `{ "status": "ok" }`

---

## Packs

### `GET /api/packs`

Список всех паков.

```json
[
  {
    "id": 1,
    "name": "Danbooru",
    "path": "C:\\...\\tags\\Danbooru",
    "description": "Full Danbooru tag set",
    "description_ru": "Полный набор тегов Danbooru",
    "version": "1.0",
    "author": "DmitriusFalse",
    "icon": "📦",
    "name_ru": "Данбору",
    "categories": "[{\"name\":\"general\",\"name_ru\":\"Общие\",\"file\":\"0_general.txt\"},...]",
    "created_at": "2026-06-07T12:00:00Z",
    "updated_at": "2026-06-09T10:00:00Z"
  }
]
```

### `DELETE /api/packs?id=1`

Удаляет пак. Каскадно удаляет связанные файлы и теги.

Ответ: `{ "status": "ok" }`

### `GET /api/pack?id=1`

Получить пак по ID.

Ответ: один объект Pack или 404.

### `GET /api/pack/info?id=1`

Читает `info.pack` с диска и возвращает в виде JSON.

```json
{
  "name": "Danbooru",
  "name_ru": "Данбору",
  "categories": [
    { "name": "general", "name_ru": "Общие", "file": "0_general.txt", "block_id": 4 },
    ...
  ]
}
```

---

## Sync

### `POST /api/sync`

Триггер ресинхронизации: сканирует папку тегов, обновляет БД.

Ответ: `{ "status": "ok" }` или `{ "error": "..." }` с 500.

---

## Tags

### `GET /api/tags/tree?pack_id=1`

Дерево категорий с количеством тегов.

```json
[
  { "name": "general", "subcategories": null, "count": 5000 },
  { "name": "artist", "subcategories": null, "count": 2000 },
  ...
]
```

### `GET /api/tags/tree?pack_id=1&category=general&offset=0&limit=500`

Пагинированный список тегов внутри категории.

```json
{
  "tags": [
    { "id": 1, "tag_name": "1girl", "category_name": "general", ... }
  ],
  "total": 5000
}
```

## Custom Main Tags

### `GET /api/custom-main-tags`

Список кастомных тегов.

```json
[
  {
    "id": 1,
    "tag_name": "beautiful eyes",
    "full_text": "beautiful detailed eyes",
    "block_id": 7,
    "structures": ["standard", "midjourney", "flux"],
    "created_at": "2026-06-07T12:00:00Z"
  }
]
```

### `POST /api/custom-main-tags`

Создать или обновить кастомный тег.

**Create** (без `id`):
```json
{ "tag_name": "beautiful eyes", "full_text": "beautiful detailed eyes", "block_id": 7, "structures": ["standard", "midjourney"] }
```
Ответ: 201 + созданный объект.

**Update** (с `id`):
```json
{ "id": 1, "tag_name": "beautiful eyes", "full_text": "beautiful detailed eyes", "block_id": 6, "structures": ["standard"] }
```
Ответ: `{ "id": 1, "status": "updated" }`

Поля:
- `tag_name` — обязательное, название тега
- `full_text` — опционально, текст подстановки в промпт (если пусто — используется `tag_name`)
- `block_id` — ID блока для группировки
- `structures` — массив ID структур, в которых тег виден; `[]` = все структуры
- `id` — только для update

### `DELETE /api/custom-main-tags?id=1`

Удалить кастомный тег.

Ответ: `{ "status": "ok" }`

---

## Пресеты

### `GET /api/presets`

Список пресетов.

```json
[
  { "id": 1, "name": "Pony Quality", "positive_tags": "[\"score_9\",\"score_8_up\"]", "negative_tags": "[\"score_4\",\"worst quality\"]" }
]
```

### `POST /api/presets`

Создать или обновить пресет (upsert по name).

```json
{ "name": "My Preset", "positive_tags": ["tag1", "tag2"], "negative_tags": ["neg1"] }
```

Ответ: 201 + созданный пресет.

---

## Промпты

### `GET /api/prompts`

История промптов (последние 50).

```json
[
  { "id": 1, "name": "My Prompt", "positive_text": "1girl, solo BREAK standing", "negative_text": "ugly", "is_favorite": false, "created_at": "..." }
]
```

### `POST /api/prompts`

Сохранить промпт. Триммит историю до 50.

```json
{ "name": "My Prompt", "positive_text": "1girl, solo", "negative_text": "ugly", "is_favorite": false }
```

Ответ: 201 + созданный промпт.

### `DELETE /api/prompts?id=1`

Удалить промпт.

Ответ: `{ "status": "ok" }`

---



## Статика

### `GET /` → `index.html`

Главная страница SPA.

### `GET /settings` → `settings.html`

Страница настроек.

### `GET /favicon.ico` → redirect `/static/icon.ico`

### `GET /static/*`

Раздача встроенных статических файлов (HTML, JS, CSS, JSON, изображения).

---

## ComfyUI

### `GET /api/comfy/workflows`

Список воркфлоу из папки `Workflows/`.

```json
[{ "name": "Example", "label": "Example" }]
```

### `GET /api/comfy/workflows?name=Example`

Возвращает JSON воркфлоу.

### `POST /api/comfy/generate`

Отправляет промпт в ComfyUI. Макросы (`%STEPS%`, `%CFG%`, `%SEED%` и т.д.) заменяются в теле воркфлоу перед отправкой.

```json
{
  "client_id": "uuid",
  "workflow": "Example",
  "macros": {
    "STEPS": "20",
    "CFG": "7",
    "SEED": "123456",
    "WIDTH": "512",
    "HEIGHT": "512",
    "PROMPT_POSITIVE": "...",
    "PROMPT_NEGATIVE": "..."
  }
}
```

Ответ: `{ "prompt_id": "..." }`

### `POST /api/comfy/save-image`

Скачивает изображение из ComfyUI (`/view`) и сохраняет в папку из настроек (`cfg.SavePath`).

```json
{ "filename": "Danbooru_00001_.png", "subfolder": "", "type": "output" }
```

Ответ: `{ "path": "C:\\...\\Danbooru_00001_.png" }`

### `GET /api/comfy/image?filename=...&subfolder=...&type=...`

Прокси к ComfyUI `/view`. Показывает изображение результата в браузере.

### `GET /api/comfy/object_info/{node_type}`

Прокси к ComfyUI `/object_info/{node_type}`. Используется для загрузки списка чекпоинтов, семплеров и шедулеров.

### `WS /api/comfy/ws?clientId=...`

Прокси WebSocket к ComfyUI. Браузер подключается к этому endpoint'у, Go-бэкенд пайпит сообщения в обе стороны с ComfyUI. Позволяет получать прогресс генерации и результат без CORS-ошибок.

Зависимость: `github.com/gorilla/websocket`
