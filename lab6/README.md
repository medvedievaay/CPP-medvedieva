# August Desktop (Electron)

Десктопна версія застосунку супермаркету August (лабораторна робота 6).

## Запуск
```
cd lab6
npm install --save-dev electron
npm start
```

## Файл із даними
Кошик зберігається у `cart.json` у теці даних застосунку (`app.getPath("userData")`):
- Windows: `%APPDATA%\august-desktop\cart.json`
- macOS: `~/Library/Application Support/august-desktop/cart.json`
- Linux: `~/.config/august-desktop/cart.json`

## Структура
- `main.js` – головний процес (вікно, IPC-канали `cart:load`, `cart:save`)
- `preload.js` – міст `window.cartAPI` (`loadCart`, `saveCart`)
- `renderer/` – інтерфейс (`index.html`, `style.css` з lab1, `app.css`, `script.js`)
