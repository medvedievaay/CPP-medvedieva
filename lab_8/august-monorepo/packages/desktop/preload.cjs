// Preload-скрипт (CommonJS): безпечний міст між сторінкою та головним процесом
const { contextBridge, ipcRenderer } = require("electron");

// Сторінка отримує лише дозволені функції — без доступу до Node.js
contextBridge.exposeInMainWorld("augustAPI", {
    meta: () => ipcRenderer.invoke("cart:meta"),
    catalog: (query) => ipcRenderer.invoke("cart:catalog", query),
    summary: () => ipcRenderer.invoke("cart:summary"),
    add: (data) => ipcRenderer.invoke("cart:add", data),
    addProduct: (name) => ipcRenderer.invoke("cart:addProduct", name),
    changeQty: (id, delta) => ipcRenderer.invoke("cart:changeQty", id, delta),
    remove: (id) => ipcRenderer.invoke("cart:remove", id),
});
