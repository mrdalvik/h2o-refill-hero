# План настройки GitHub Actions для beta-превью

## Цель

Возможность переключаться между:
- **Production**: https://mrdalvik.github.io/h2o-refill-hero/ (ветка `main`)
- **Beta**: https://mrdalvik.github.io/h2o-refill-hero/beta/ (ветка для разработки)

## Ограничение GitHub Pages

GitHub Pages разворачивает **один артефакт** на репозиторий. Нельзя иметь два независимых деплоя. Поэтому решение — **объединять** сборки production и beta в один артефакт.

---

## План реализации

### 1. Структура деплоя

```
https://mrdalvik.github.io/h2o-refill-hero/
├── index.html, assets/...     ← production (main)
└── beta/
    ├── index.html, assets/... ← beta (ветка разработки)
```

### 2. Ветка для beta

Рекомендуемые варианты:
- **`beta`** — отдельная ветка для тестирования
- **`develop`** — классическая ветка разработки
- **`cursor/github-actions-af74`** — текущая feature-ветка (для теста)

Можно выбрать любую. В плане ниже — ветка `beta`.

### 3. Изменения в workflow

**Файл**: `.github/workflows/deploy.yml`

**Триггеры**:
- `push` в `main` → обновить production
- `push` в `beta` → обновить beta
- `workflow_dispatch` → ручной запуск (обновить оба)

**Логика**:
1. Checkout текущей ветки
2. **Сборка production**: checkout `main`, `VITE_BASE=/h2o-refill-hero/ npm run build` → `dist/`
3. **Сборка beta**: checkout `beta`, `VITE_BASE=/h2o-refill-hero/beta/ npm run build` → `dist/beta/`
4. Объединить: `dist/` (production) + `dist/beta/` (beta) в один артефакт
5. Загрузить объединённый артефакт и задеплоить

### 4. Обработка отсутствия ветки beta

Если ветки `beta` ещё нет:
- Пропустить сборку beta
- Деплоить только production
- Либо создать ветку `beta` от `main` и использовать её

### 5. Переключение для разработчика

**В настройках приложения** (если есть выбор окружения):
- Добавить опцию «Beta» с URL: `https://mrdalvik.github.io/h2o-refill-hero/beta/`
- Либо просто закладки в браузере:
  - Production: https://mrdalvik.github.io/h2o-refill-hero/
  - Beta: https://mrdalvik.github.io/h2o-refill-hero/beta/

**Просмотр других веток**:
- Каждая ветка — отдельный URL возможен только при **разных путях** в одном деплое
- Вариант: `/beta/` = последняя сборка из ветки `beta`
- Для превью **произвольных веток** (feature-1, feature-2 и т.д.) нужны сервисы вроде Vercel/Netlify с preview-деплоями

### 6. Чеклист внедрения

- [x] Создать ветку `beta` (или выбрать существующую)
- [x] Обновить `.github/workflows/deploy.yml` по плану выше
- [x] Убедиться, что `VITE_BASE` поддерживается в `vite.config.ts` (уже есть)
- [x] Проверить `manifest.webmanifest`: `start_url` должен учитывать base (уже через `./`)
- [ ] Прогнать workflow вручную через `workflow_dispatch`
- [ ] Проверить оба URL после деплоя

---

## Альтернатива: превью произвольных веток

Если нужны превью **любых** веток (не только beta):

| Сервис   | Возможности                                      |
|----------|---------------------------------------------------|
| Vercel   | Автоматический preview-деплой на каждую ветку/PR  |
| Netlify  | Аналогично                                        |
| GitHub Pages | Только один деплой, нужна своя логика объединения |

Для GitHub Pages с произвольными ветками пришлось бы:
- Собирать несколько веток в одном workflow
- Класть каждую в свой путь: `/beta/`, `/feature-x/` и т.д.
- Усложнять конфигурацию и время сборки

---

## Итог

**Да, это возможно** в рамках GitHub Pages:

1. Production и beta в одном деплое по разным путям.
2. Переключение — по URL: `/` и `/beta/`.
3. В настройках приложения можно добавить ссылку на beta.
4. Превью произвольных веток — лучше решать через Vercel/Netlify.
