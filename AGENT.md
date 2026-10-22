# ⚡ AI Agent System Instruction & Engineering Protocols: Induktr Studio

> **Project:** Induktr Studio (`src/` with Feature-Sliced Design 2.1)  
> **Lead Architect:** Nikita Voitenko (Induktr)  
> **Architecture Status:** Single-Repository Next.js App Router (Production Core) transitioning into Decoupled Architecture v2.0 (Target Canonical Blueprint in `docs/`).  
> **Audience:** All Autonomous AI Agents (Antigravity, Cursor, Claude, Copilot), Tech Leads, and Systems Engineers.  
> **Execution Mandate:** Strict FSD 2.1 layer hierarchy, zero context drift, sub-16.6ms frame budget (60/120 FPS), Drizzle ORM schema integrity, deterministic IPO-Protocol state emissions, zero TypeScript errors (`tsc --noEmit`).

---

## 🏛️ 1. Архитектурная двойственность: Reality (Текущий код) vs Canon v2.0 (Целевой дизайн)

Критически важно понимать статус кодовой базы, чтобы не пытаться импортировать несуществующие пакеты и не ломать сборку:

| Домен | Текущий рабочий код (`src/`) | Целевой канон (`docs/` & `README.md`) | Правило для AI-агентов |
| :--- | :--- | :--- | :--- |
| **Топология** | Монорепозиторий Next.js App Router в `src/` | Декупленный воркспейс `apps/web` + `apps/api` | **Работать в `src/`**. При создании новых модулей сохранять строгую изоляцию слоев FSD. |
| **Рантайм & Package Manager** | Node.js / Bun (`bun run dev`, `bun run typecheck`) | Bun v1.2+ Native Runtime | **Использовать Bun** для запуска скриптов и сборки. |
| **База данных & ORM** | **Drizzle ORM** (`src/shared/api/database/schemas/schema.ts`) | **Prisma 7** (Целевая спецификация в `docs/doc-architecture.md`) | **Не ломать Drizzle-схемы!** Любые текущие миграции и запросы писать строго через Drizzle ORM. |
| **UI Стек & Анимации** | React 19 + Tailwind CSS + Radix UI + R3F Three.js | React Scan + OKLCH + 60/120 FPS Compositor | Соблюдать бюджет кадра `< 16.6ms`, анимировать только `transform`/`opacity`. |
| **Локализация (i18n)** | `src/shared/locales/` (`en.json`, `ua.json`, `ru.json`) | 5 шлюзов (`en`, `ua`, `de`, `ar` RTL, `es`) | Поддерживать текущие словари, при добавлении новых ключей заполнять `en` и `ua`. |

---

## 🏗️ 2. Стандарт Feature-Sliced Design (FSD 2.1)

Код внутри `src/` строго сегментирован. Нарушение границ слоев блокирует мерж и считается грубой архитектурной ошибкой:

```
src/
├── app/         # Роутинг Next.js App Router, провайдеры, глобальные стили
├── widgets/     # Композиционные блоки страниц (Header, Footer, MobileNav, ToolGrid)
├── features/    # Пользовательские сценарии и воркеры (telegram-bot, auth, forms)
├── entities/    # Бизнес-сущности и доменные модели (user, lead, tool)
└── shared/      # Переиспользуемый UI-кит (Radix), утилиты, API-клиенты, Drizzle DB
```

### Золотые правила импортов:
1. **Строго однонаправленный поток:** `app` $\rightarrow$ `widgets` $\rightarrow$ `features` $\rightarrow$ `entities` $\rightarrow$ `shared`.
2. **Запрет импортов вверх:** `shared` никогда не импортирует `entities`, `features` или `widgets`.
3. **Запрет кросс-импортов на одном слое:** Слайс в `features` не может импортировать соседний слайс в `features` (только через композицию в `widgets` или `app`).
4. **Абсолютные алиасы:** Все импорты оформляются через `@/*` (напр. `@/shared/ui/button`). Относительные пути `../../..` запрещены за пределами текущего слайса.

---

## ⚡ 3. Протокол работы AI-Агента: IPO-Protocol & TypeSafe Monitoring

Каждый AI-агент обязан квантовать выполнение любой задачи на три строгие фазы с детерминированной эмиссией состояния (без пустых LLM-размышлений о статусе):

```text
[IPO:INPUT]       :: task="<цель>" | scope="<слой_FSD>" | contracts="Verified"
[IPO:PROCESS:k/N] :: op="<действие>" | pure=true | touched="<компонент/файл>"
[IPO:OUTCOME]     :: status="SUCCESS" | typecheck="PASSED" | artifacts=[<файлы>]
```

### 3 Фазы выполнения:
1. **INPUT (Аудит и Контракт Результата):**
   - Проверить входящие пропсы, Zod-схемы и типы TypeScript до редактирования файлов.
   - Убедиться, что не нарушаются схемы базы данных (`src/shared/api/database/schemas/schema.ts`).
2. **PROCESS (Чистая трансформация):**
   - Изменения должны быть изолированными и минимальными.
   - Запрещено использовать `any` и принудительные касты `as unknown as T`.
   - В Three.js сценах обязательно вызывать `.dispose()` для материалов и геометрий при анмаунте.
3. **OUTCOME (Верификация DoD):**
   - Обязательный запуск `bun run typecheck` (`tsc --noEmit`).
   - Нулевые ошибки компилятора — блокирующий критерий приемки (Definition of Done).

---

## 🚫 4. Ограничения и Запреты (Rules of Engagement)

1. **Запрещено ломать текущий рабочий код ради абстрактных миграций:** Не удалять Drizzle ORM и рабочие API-роуты в `src/app/api/`, пока нет явной задачи на миграцию.
2. **Запрещен прямой доступ к БД из Client Components:** Все вызовы к базе выполняются строго в Server Components или API-хэндлерах.
3. **Запрещен консольный мусор:** Никаких забытых `console.log` в продакшен-коде — использовать централизованный логгер.
4. **Запрещены мутации стилей, вызывающие reflow:** Анимации делать строго через GPU-композитор (`transform`, `opacity`), сохраняя фреймрейт 60–120 FPS.

---

## 📚 5. Документация проекта (`docs/`)

- [**`docs/doc-architecture.md`**](file:///c:/Users/USER/Documents/projects/My%20Personal%20Platforms/induktr-studio/docs/doc-architecture.md) — целевой архитектурный блюпринт v2.0, двухконтурная шина, SPOF-устойчивость.
- [**`docs/doc-tech.md`**](file:///c:/Users/USER/Documents/projects/My%20Personal%20Platforms/induktr-studio/docs/doc-tech.md) — технические спецификации, ADRs 01–06.
- [**`docs/doc-design.md`**](file:///c:/Users/USER/Documents/projects/My%20Personal%20Platforms/induktr-studio/docs/doc-design.md) — визуальные стандарты, OKLCH, композиторные анимации.
- [**`docs/doc-validation.md`**](file:///c:/Users/USER/Documents/projects/My%20Personal%20Platforms/induktr-studio/docs/doc-validation.md) — матрица валидации, SPOF FMEA, Definition of Done.
- [**`docs/doc-loc1n.md`**](file:///c:/Users/USER/Documents/projects/My%20Personal%20Platforms/induktr-studio/docs/doc-loc1n.md) — целевой протокол 5 языковых шлюзов и RTL.
- [**`docs/doc-user.md`**](file:///c:/Users/USER/Documents/projects/My%20Personal%20Platforms/induktr-studio/docs/doc-user.md) — продуктовая модель, Multi-Rail checkout и ценность для клиентов.
