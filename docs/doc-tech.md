# Техническая Архитектура

### 1. Схема Потока Данных (Data Flow)
`UI (React Form)` --[Zod Validation]--> `API Route (Next.js)` --[Telegram API]--> `Operator (You)`

### 2. Модель Данных (Zod Schema)
```typescript
const LeadSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  contact: z.string().min(5, "Укажите Email или Telegram"),
  budget: z.enum(["low", "medium", "high", "custom"]),
  description: z.string().max(1000, "Краткость — сестра таланта"),
});

3. Переменные Окружения (.env)
Для работы системы необходимо добавить в Vercel/Hosting:
TELEGRAM_BOT_TOKEN: токен от @BotFather.
TELEGRAM_CHAT_ID: твой ID (через @userinfobot).
4. План Очистки (Detox)
Удалить src/context/AuthContext.tsx.
Удалить src/hooks/useAuth.ts.
Очистить App.tsx от провайдеров авторизации.

---

### **Файл 4: `docs/DocUI.md` — Визуальная Стратегия**

```markdown
# Дизайн-система «Wow & Trust»

### 1. Психология Элементов
*   **3D Tilt Effect:** Используется на форме, чтобы создать ощущение «осязаемости» и премиальности. Когда форма реагирует на движение мыши, это повышает время контакта пользователя с зоной захвата.
*   **Минимализм:** Белое пространство вокруг формы помогает сфокусироваться на вводе данных.

### 2. Компоненты
*   **Primary Button:** Градиентная заливка, эффект нажатия (scale-95).
*   **Input Fields:** Фокус с мягким свечением.
*   **Success Message:** Зеленая галочка с анимацией конфетти (легкий Framer Motion эффект).

### 3. Адаптив
*   **Mobile:** Форма занимает 100% ширины. Поля ввода имеют высоту не менее 48px для удобства нажатия пальцем.