// Головний процес Electron: створює вікно та працює з файлом cart.json
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// Шлях до файлу з кошиком у системній теці даних застосунку
function getCartFilePath() {
    return path.join(app.getPath("userData"), "cart.json");
}

// Створення вікна застосунку з безпечними налаштуваннями
function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        title: "August Desktop",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

// Обробник "cart:load": повертає масив товарів кошика з файлу
ipcMain.handle("cart:load", () => {
    const filePath = getCartFilePath();

    // Якщо файлу ще немає — повертаємо порожній кошик
    if (!fs.existsSync(filePath)) {
        return [];
    }

    try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Не вдалося прочитати cart.json:", error.message);
        return [];
    }
});

// Обробник "cart:save": записує отриманий масив товарів у файл
ipcMain.handle("cart:save", (event, items) => {
    if (!Array.isArray(items)) {
        return false;
    }

    fs.writeFileSync(getCartFilePath(), JSON.stringify(items, null, 2), "utf-8");
    return true;
});

app.whenReady().then(() => {
    createWindow();

    // macOS: створюємо нове вікно, якщо клікнули на іконку в Dock, а вікон немає
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Закриваємо застосунок після закриття всіх вікон (крім macOS)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
