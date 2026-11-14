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
