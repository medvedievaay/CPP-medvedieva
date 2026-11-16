# August Monorepo

Монорепозиторій навчального застосунку супермаркету **August** (ЛР № 7-8, «Крос-платформне програмування»).

- `packages/core` — `@august/core`: спільне ядро (перевірка, пошук, підрахунок суми, `CartService`, інтерфейс адаптера);
- `packages/web` — веб-клієнт (`LocalStorageAdapter`, статичний сервер `server.js`);
- `packages/desktop` — десктопний клієнт на Electron (`FileStorageAdapter`, IPC, preload).

## Запуск

```bash
npm install            # з кореня: встановлює залежності й створює посилання на @august/core
npm test               # тести всіх пакетів
npm run start:web      # http://localhost:3000
npm run start:desktop  # вікно Electron
```

## Технологічний стек і компетентності

### Стек за рівнями

| Рівень | Технології | Де в репозиторії |
|---|---|---|
| 1. Платформи | Браузер (WebView), десктопна ОС; iOS (Expo Go) – окремий проєкт ЛР 5 | [packages/web](packages/web), [packages/desktop](packages/desktop) |
| 2. Клієнтські технології | HTML, CSS, JavaScript; Electron (main, preload, renderer); React + Tailwind CSS (ЛР 4) і React Native + Expo (ЛР 5) – окремі проєкти | [packages/web](packages/web), [packages/desktop](packages/desktop) |
| 3. Спільний код | `@august/core`, npm workspaces, модулі ES, `node:test`, адаптери сховища | [packages/core](packages/core) |
| 4. Сервер і API | Node.js, Express, Mongoose (REST, ЛР 2); Apollo Server, JWT (GraphQL, ЛР 3) – окремі проєкти | – |
| 5. База даних | MongoDB Atlas (ЛР 2); localStorage і файл `cart.json` через адаптери | [packages/web](packages/web), [packages/desktop](packages/desktop) |

### Сильні моменти проєкту

- **Спільне ядро.** Перевірка даних товару, пошук і підрахунок суми написані один раз у [packages/core](packages/core) і працюють у веб- та десктопному клієнтах.
- **Ядро + адаптери.** `CartService` отримує сховище через конструктор: `LocalStorageAdapter` у вебі, `FileStorageAdapter` в Electron, `MemoryStorageAdapter` у тестах.
- **Безпечний IPC в Electron.** `preload.cjs`, `contextIsolation: true`, `nodeIntegration: false` і Content-Security-Policy у [packages/desktop](packages/desktop).
- **Автоматичні тести.** 42 тести (`node --test`) для ядра та обох клієнтів; запуск командою `npm test` з кореня.

### Історія проєкту

| | |
|---|---|
| **Назва проєкту** | August – кросплатформний застосунок супермаркету |
| **Проблема** | Покупцеві потрібні каталог, пошук і кошик однаково і в браузері, і на комп’ютері. Застосунок розв’язує це одним набором правил для всіх платформ. |
| **Моя роль і внесок** | Єдина розробниця: вебклієнт, десктопний клієнт на Electron, спільне ядро, REST і GraphQL API, мобільна версія. |
| **Обраний стек технологій** | JavaScript на всіх рівнях: одна мова й один набір інструментів (Node.js, npm) для клієнтів і сервера. Electron дозволив повторно використати веб-інтерфейс на десктопі, npm workspaces – підключити ядро без публікації пакета. |
| **Найскладніший кросплатформний виклик і рішення** | Платформи по-різному зберігають дані: localStorage у браузері, файл в Electron. Рішення – адаптери сховища: ядро знає лише інтерфейс `load` / `save`, кожен клієнт реалізує його сам. |
| **Здобуті знання та вміння** | Монорепозиторій і патерн «ядро + адаптери»; Electron (IPC, preload); React, Tailwind CSS, React Native; REST (Express, Mongoose) і GraphQL (Apollo, JWT); автоматичне тестування. |

### Що я знаю і вмію

- Розумію підходи до кросплатформності: WebView, нативна компіляція, Shared UI.
- Виношу платформонезалежну логіку в спільний пакет і підключаю його до різних клієнтів.
- Створюю веб-, десктопні та мобільні клієнти на JavaScript.
- Пишу REST і GraphQL API, працюю з MongoDB Atlas.
- Покриваю код тестами й оформлюю проєкт у GitHub із README.

## Посилання

Репозиторій на GitHub: [medvedievaay/CPP-medvedieva](https://github.com/medvedievaay/CPP-medvedieva)
