# August monorepo

Монорепозиторій лабораторної роботи 7-8: спільне ядро та два клієнти застосунку супермаркету August.

- `packages/core` – `@august/core`: правила кошика, каталог, `CartService`, інтерфейс адаптера
- `packages/web` – веб-клієнт (адаптер localStorage, статичний сервер)
- `packages/desktop` – десктопний клієнт на Electron (адаптер файлу `cart.json`)

## Запуск
```
npm install
npm test
npm run start:web      # http://localhost:3000
npm run start:desktop
```
