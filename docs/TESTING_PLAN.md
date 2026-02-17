# План покрытия тестами ключевых алгоритмов

## Рекомендуемый фреймворк: **Vitest**

**Почему Vitest:**
- Нативная интеграция с Vite (без доп. конфигурации)
- Быстрый запуск (ESM из коробки)
- Совместим с Jest API (`describe`, `it`, `expect`)
- Поддержка Vue компонентов через `@vue/test-utils`
- Встроенный coverage (`vitest run --coverage`)

**Установка:**
```bash
npm install -D vitest @vue/test-utils jsdom
```

---

## Ключевые алгоритмы для тестирования

### 1. `src/utils/bottles.ts` — конвертация мл в бутылки

| Функция | Тесты |
|---------|-------|
| `mlToBottles(ml)` | • 0 и отрицательные → `[]` |
| | • 200 → 1 бутылка small |
| | • 500 → 1 бутылка medium |
| | • 1000 → 1 бутылка large |
| | • 1500 → [1000, 500] |
| | • 2500 → [1000, 1000, 500] |
| | • 3000 → [1000, 1000, 1000] |
| `sizeForMl` (через mlToBottles) | • ≤200 → small, ≤500 → medium, >500 → large |
| `bottleSizeLabelKey(size)` | • small/medium/large → правильный ключ |

**Приоритет:** высокий — чистая функция, легко тестировать.

---

### 2. Расчёт дневной цели (SettingsDialog)

| Сценарий | Тесты |
|----------|-------|
| `calculateDailyGoal(weight, activity)` | • 70 кг, low → 2100 |
| | • 70 кг, medium → 2520 |
| | • 70 кг, high → 3150 |
| | • 50 кг, low → 1500 |
| | • 100 кг, high → 4500 |
| | • Округление до 100 |

**Рекомендация:** вынести `calculateDailyGoal` в `src/utils/waterGoal.ts` для изолированного тестирования.

**Приоритет:** высокий.

---

### 3. `useTimeOfDay` — определение времени суток

| Функция | Тесты |
|---------|-------|
| `getTimeOfDay()` | • 6:00 → morning |
| | • 11:59 → morning |
| | • 12:00 → day |
| | • 16:59 → day |
| | • 17:00 → evening |
| | • 20:59 → evening |
| | • 21:00, 5:59 → night |

**Рекомендация:** вынести `getTimeOfDay(hour)` в отдельную функцию с параметром для тестируемости (без мока Date).

**Приоритет:** средний.

---

### 4. `useWaterReminder` — логика напоминаний

| Сценарий | Тесты |
|----------|-------|
| `checkAndNotify` | • hour < 8 или ≥ 22 → не показывать |
| | • frequency 'never' → не показывать |
| | • hour в слоте, уже показано → не показывать |
| | • hour в слоте, не показано → показать |
| Слоты | • 3/day: [10, 14, 18] |
| | • 5/day: [9, 12, 15, 18, 21] |
| `getShownToday`, `markShown` | • Корректное сохранение/загрузка из localStorage |

**Рекомендация:** вынести `checkAndNotify`-логику в чистые функции с инжектом `getShownToday`/`markShown`.

**Приоритет:** средний.

---

### 5. Water Store — бизнес-логика

| Функция | Тесты |
|---------|-------|
| `addWater(ml)` | • ml ≤ 0 → без изменений |
| | • addWater(500) → totalMl +500, 1 бутылка в cells |
| | • addWater(1500) → 2 бутылки |
| | • addWater(2500) → 3 бутылки |
| `removeBottle(id)` | • Удаление из cells и bottles, totalMl уменьшается |
| | • Несуществующий id → без изменений |
| `goalReached` | • totalMl >= dailyGoal → true |
| `percentage` | • 1000/2000 → 50 |
| | • 2500/2000 → 100 (cap) |
| `createEmptyGrid` | • 4×4, все cells пустые |
| `placeBottle` | • Сначала свободные ячейки, потом вторые ряды |

**Приоритет:** высокий. Требует мока Pinia и localStorage.

---

### 6. History Store

| Функция | Тесты |
|---------|-------|
| `addRecord` | • Запись добавляется в records |
| `totalAllTime` | • Сумма totalMl по всем записям |

**Приоритет:** низкий.

---

## Структура тестов

```
src/
├── utils/
│   ├── bottles.ts
│   └── bottles.spec.ts
│   ├── waterGoal.ts          # вынести из SettingsDialog
│   └── waterGoal.spec.ts
├── stores/
│   ├── water.spec.ts
│   └── history.spec.ts
└── composables/
    ├── useTimeOfDay.ts
    └── useTimeOfDay.spec.ts
```

---

## Конфигурация Vitest

Добавить в `vite.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
// ...

export default defineConfig({
  // ...
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/stores/**'],
      exclude: ['**/*.spec.ts', '**/types/**'],
    },
  },
})
```

В `package.json`:
```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

---

## Порядок внедрения

1. Установить Vitest и настроить конфиг
2. Тесты для `bottles.ts` (самые простые)
3. Вынести и протестировать `calculateDailyGoal`
4. Вынести и протестировать `getTimeOfDay`
5. Тесты для water store (с моками)
6. Тесты для reminder и history (по необходимости)

---

## Оценка покрытия

| Модуль | Оценка тестов | Сложность |
|--------|---------------|-----------|
| bottles.ts | 8–10 тестов | Низкая |
| waterGoal | 5–7 тестов | Низкая |
| getTimeOfDay | 6–8 тестов | Низкая |
| water store | 10–15 тестов | Средняя |
| useWaterReminder | 5–8 тестов | Средняя |
| history store | 2–3 теста | Низкая |

**Итого:** ~40–50 unit-тестов для ключевой логики.
