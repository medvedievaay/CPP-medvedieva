// Preload-скрипт: безпечний міст між сторінкою та головним процесом
const { contextBridge, ipcRenderer } = require("electron");

// Сторінка отримує лише дві дозволені функції — без доступу до Node.js
contextBridge.exposeInMainWorld("cartAPI", {
    loadCart: () => ipcRenderer.invoke("cart:load"),
    saveCart: (items) => ipcRenderer.invoke("cart:save", items),
});
