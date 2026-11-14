// Головний процес Electron (модуль ES): вікно, адаптер файлу та IPC-обробники
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CartService } from "@august/core";
import { FileStorageAdapter } from "./fileStorageAdapter.js";
import { createHandlers } from "./ipcHandlers.js";

// У модулі ES немає __dirname — теку файлу беремо з import.meta.url
const dirName = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        title: "August Desktop",
        webPreferences: {
            preload: path.join(dirName, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.loadFile(path.join(dirName, "renderer", "index.html"));
}

app.whenReady().then(function () {
    // Адаптер зберігає кошик у cart.json у теці даних застосунку
    const adapter = new FileStorageAdapter(path.join(app.getPath("userData"), "cart.json"));
    const handlers = createHandlers(new CartService(adapter));

    ipcMain.handle("cart:meta", () => handlers.meta());
    ipcMain.handle("cart:catalog", (event, query) => handlers.catalog(query));
    ipcMain.handle("cart:summary", () => handlers.summary());
    ipcMain.handle("cart:add", (event, data) => handlers.add(data));
    ipcMain.handle("cart:addProduct", (event, name) => handlers.addProduct(name));
    ipcMain.handle("cart:changeQty", (event, id, delta) => handlers.changeQty(id, delta));
    ipcMain.handle("cart:remove", (event, id) => handlers.remove(id));

    createWindow();

    // macOS: створюємо нове вікно, якщо клікнули на іконку в Dock, а вікон немає
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Закриваємо застосунок після закриття всіх вікон (крім macOS)
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
