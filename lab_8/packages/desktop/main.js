// Головний процес Electron (модуль ES): вікно, адаптер файлу та IPC над спільним ядром
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CartService } from "@august/core";
import { FileStorageAdapter } from "./fileStorageAdapter.js";
import { createHandlers } from "./ipcHandlers.js";

// У модулях ES немає __dirname – теку файлу отримуємо з import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        title: "August Desktop",
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(() => {
    const adapter = new FileStorageAdapter(path.join(app.getPath("userData"), "cart.json"));
    const handlers = createHandlers(new CartService(adapter));

    ipcMain.handle("cart:state", (event, query) => handlers.state(query));
    ipcMain.handle("cart:add", (event, id) => handlers.add(id));
    ipcMain.handle("cart:setQty", (event, id, qty) => handlers.setQty(id, qty));
    ipcMain.handle("cart:remove", (event, id) => handlers.remove(id));
    ipcMain.handle("cart:clear", () => handlers.clear());

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
